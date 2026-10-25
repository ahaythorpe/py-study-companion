"use client";

import { useState } from "react";
import type { Question } from "@/lib/types";
import { Explanation } from "./Explanation";
import { LawExtract, QuestionHeader } from "./QuestionHeader";
import { btnGhost, btnPrimary, field } from "./ui";

type Props = {
  question: Question;
  onMark: (correct: boolean) => void;
};

const LETTERS = ["A", "B", "C", "D"];

export function Flashcard(props: Props) {
  return props.question.kind === "flashcard" ? <ExplainCard {...props} /> : <FlipCard {...props} />;
}

/* ---------- Written answer, checked against key points ---------- */

// The same idea can be written many ways, so there's no single right sentence
// to match. You write your own answer, then tick which key ideas it covered.
function ExplainCard({ question, onMark }: Props) {
  const keyPoints = question.keyPoints ?? [];
  const [answer, setAnswer] = useState("");
  const [checked, setChecked] = useState(false);
  const [covered, setCovered] = useState<boolean[]>(() => keyPoints.map(() => false));
  const [copied, setCopied] = useState(false);
  const hits = covered.filter(Boolean).length;

  async function copyForAi() {
    try {
      await navigator.clipboard.writeText(markingPrompt(question, answer));
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="rounded-[14px] border border-line bg-surface p-6">
        <QuestionHeader question={question} />
      </div>

      {!checked ? (
        <div className="space-y-3">
          <label className="block space-y-2 text-sm">
            <span className="font-medium">Your answer in your own words</span>
            <textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              rows={6}
              placeholder="Explain it as if to a colleague. Dot points are fine."
              className={field}
            />
          </label>
          <button type="button" onClick={() => setChecked(true)} className={`${answer.trim() ? btnPrimary : btnGhost} w-full`}>
            {answer.trim() ? "Check my answer" : "I'm not sure. Show me"}
          </button>
        </div>
      ) : (
        <>
          {answer.trim() && (
            <div className="rounded-[14px] border border-line bg-surface-2 p-5 text-sm">
              <p className="mb-1 font-medium">Your answer</p>
              <p className="whitespace-pre-line">{answer}</p>
            </div>
          )}

          <fieldset className="space-y-2 rounded-[14px] border border-line bg-surface p-5">
            <legend className="px-1 text-sm font-semibold">Did your answer cover these ideas?</legend>
            <p className="text-sm text-muted">Wording doesn&apos;t matter. Tick an idea if your answer got it across.</p>
            {keyPoints.map((point, i) => (
              <label key={i} className="flex cursor-pointer gap-3 rounded-lg p-2 text-[15px] leading-snug hover:bg-surface-2">
                <input
                  type="checkbox"
                  checked={covered[i]}
                  onChange={(e) => setCovered((c) => c.map((x, j) => (j === i ? e.target.checked : x)))}
                  className="mt-1 size-4 flex-none accent-[var(--accent)]"
                />
                <span>{point}</span>
              </label>
            ))}
          </fieldset>

          <div className="rounded-[14px] border border-line bg-surface p-5 text-sm leading-relaxed">
            <p className="mb-1 font-medium">One way to say it</p>
            <p>{question.answer}</p>
          </div>

          <Explanation explanation={question.explanation} source={question.source} />

          {answer.trim() && (
            <div className="flex flex-wrap items-center gap-3 text-sm">
              <button type="button" onClick={copyForAi} className={btnGhost}>
                {copied ? "Copied" : "Copy for AI marking"}
              </button>
              <span className="text-muted">
                {copied
                  ? "Paste it into your AI assistant for detailed feedback."
                  : "Copies the question and key points and your answer as a marking prompt."}
              </span>
            </div>
          )}

          <button
            type="button"
            onClick={() => onMark(hits === keyPoints.length)}
            className={`h-11 w-full rounded-[10px] px-4 text-sm font-semibold ${
              hits === keyPoints.length
                ? "border border-good bg-good text-white hover:opacity-90"
                : "border border-bad bg-surface text-bad hover:bg-bad-soft"
            }`}
          >
            {hits === keyPoints.length
              ? `Got it: all ${keyPoints.length} ideas`
              : `${hits} of ${keyPoints.length} ideas. Review again soon`}
          </button>
        </>
      )}
    </div>
  );
}

function markingPrompt(q: Question, answer: string): string {
  return [
    "You're marking my practice answer for the ASIC financial adviser exam (Australia). Mark on understanding and not on wording.",
    "",
    `Question: ${q.prompt}`,
    q.scenario ? `Scenario: ${q.scenario}` : "",
    q.extract ? `Provided law (${q.extract.cite}):\n${q.extract.text}` : "",
    "",
    "Key points a correct answer must contain:",
    ...(q.keyPoints ?? []).map((p, i) => `${i + 1}. ${p}`),
    "",
    `Model answer (one acceptable wording): ${q.answer}`,
    `Source: ${q.source}`,
    "",
    "My answer:",
    answer,
    "",
    "For each key point say whether my answer covers it fully or partly or not at all. Quote the part of my answer that does. Then point out anything in my answer that is legally or factually wrong under current Australian law. Give one sentence on how to improve it. Don't penalise different wording.",
  ]
    .filter((line, i, all) => line !== "" || all[i - 1] !== "")
    .join("\n");
}

/* ---------- Multiple choice and true/false as flip cards ---------- */

// MCQs double as cards: the front lists the options so the prompt makes sense
// on its own, and the back names the correct one.
function backText(q: Question): string {
  const i = q.answerIndex ?? 0;
  const option = q.options?.[i] ?? "";
  return q.kind === "mcq" ? `${LETTERS[i]}. ${option}` : option;
}

function FlipCard({ question, onMark }: Props) {
  const [flipped, setFlipped] = useState(false);

  return (
    <div className="space-y-4">
      {question.scenario && <p className="text-[15px] leading-relaxed">{question.scenario}</p>}
      {question.extract && <LawExtract extract={question.extract} />}
      <button
        type="button"
        onClick={() => setFlipped((f) => !f)}
        aria-label={flipped ? "Show question" : "Show answer"}
        className="flex min-h-56 w-full flex-col justify-center rounded-[14px] border border-line bg-surface p-7 text-left transition-colors hover:border-accent"
      >
        <span className="mb-3 text-xs font-medium uppercase tracking-wide text-muted">
          {flipped ? "Answer" : "Question · answer in your head then tap to flip"}
        </span>
        {flipped && <span className="mb-3 text-sm leading-snug text-muted">{question.prompt}</span>}
        <span className="text-xl font-semibold leading-snug tracking-[-0.01em]">
          {flipped ? backText(question) : question.prompt}
        </span>
        {!flipped && question.kind === "mcq" && (
          <span className="mt-5 block space-y-2">
            {question.options?.map((option, i) => (
              <span key={i} className="flex gap-3 text-[15px] leading-snug">
                <span className="font-semibold text-muted">{LETTERS[i]}.</span>
                <span>{option}</span>
              </span>
            ))}
          </span>
        )}
      </button>

      {flipped && (
        <>
          <Explanation explanation={question.explanation} source={question.source} />
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => onMark(false)}
              className="h-11 rounded-[10px] border border-bad bg-surface px-4 text-sm font-semibold text-bad hover:bg-bad-soft"
            >
              Missed it
            </button>
            <button
              type="button"
              onClick={() => onMark(true)}
              className="h-11 rounded-[10px] border border-good bg-good px-4 text-sm font-semibold text-white hover:opacity-90"
            >
              Got it
            </button>
          </div>
        </>
      )}
    </div>
  );
}
