"use client";

import { useState } from "react";
import type { Question } from "@/lib/types";
import { Explanation } from "./Explanation";
import { QuestionHeader } from "./QuestionHeader";
import { btnGhost, btnPrimary, field } from "./ui";

type Props = {
  question: Question;
  onAnswer: (correct: boolean) => void;
};

function shuffledIndexes(n: number): number[] {
  const a = Array.from({ length: n }, (_, i) => i);
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function QuestionCard({ question, onAnswer }: Props) {
  return (
    <div className="space-y-4">
      <QuestionHeader question={question} />
      {question.kind === "multitf" ? (
        <MultiTrueFalse question={question} onAnswer={onAnswer} />
      ) : question.kind === "spot" ? (
        <SpotTheIssue question={question} onAnswer={onAnswer} />
      ) : (
        <Choice question={question} onAnswer={onAnswer} />
      )}
    </div>
  );
}

/* ---------- Multiple choice and true/false ---------- */

function Choice({ question, onAnswer }: Props) {
  // Shuffle so the answer's position in the JSON doesn't give it away.
  // True/false keeps its natural order.
  const [order] = useState(() => {
    const n = question.options?.length ?? 0;
    return question.kind === "truefalse" ? [0, 1] : shuffledIndexes(n);
  });
  const [picked, setPicked] = useState<number | null>(null);
  const locked = picked !== null;
  const correctIndex = question.answerIndex ?? 0;

  function pick(i: number) {
    if (locked) return;
    setPicked(i);
    onAnswer(i === correctIndex);
  }

  return (
    <>
      <ul className={question.kind === "truefalse" ? "grid grid-cols-2 gap-2" : "space-y-2"}>
        {order.map((i) => {
          const option = question.options?.[i];
          let style = "border-line-strong bg-surface hover:border-accent hover:bg-accent-soft";
          if (locked) {
            if (i === correctIndex) style = "border-good bg-good-soft";
            else if (i === picked) style = "border-bad bg-bad-soft";
            else style = "border-line bg-surface opacity-60";
          }
          return (
            <li key={i}>
              <button
                type="button"
                onClick={() => pick(i)}
                disabled={locked}
                className={`w-full rounded-[10px] border-[1.5px] px-4 py-3.5 text-left text-[15px] transition-colors disabled:cursor-default ${style}`}
              >
                {option}
              </button>
            </li>
          );
        })}
      </ul>

      {locked &&
        (question.kind === "mcq" ? (
          <WhyWrong question={question} picked={picked} />
        ) : (
          <Explanation correct={picked === correctIndex} explanation={question.explanation} source={question.source} />
        ))}
    </>
  );
}

/**
 * Before showing the explanation, ask why a wrong option is wrong: the one you
 * picked if you got it wrong, otherwise a random distractor. Exam distractors
 * are real terms applied to the wrong situation, so this is where understanding shows.
 */
function WhyWrong({ question, picked }: { question: Question; picked: number }) {
  const correctIndex = question.answerIndex ?? 0;
  const correct = picked === correctIndex;
  const [target] = useState(() => {
    if (!correct) return picked;
    const wrong = (question.options ?? []).map((_, i) => i).filter((i) => i !== correctIndex);
    return wrong[Math.floor(Math.random() * wrong.length)];
  });
  const [reason, setReason] = useState("");
  const [revealed, setRevealed] = useState(false);

  if (revealed) {
    return (
      <div className="space-y-3">
        {reason.trim() && (
          <p className="rounded-[10px] border border-line bg-surface-2 p-4 text-sm">
            <span className="font-medium">Your reasoning: </span>
            {reason}
          </p>
        )}
        <Explanation correct={correct} explanation={question.explanation} source={question.source} />
      </div>
    );
  }

  return (
    <div className="space-y-3 rounded-[14px] border border-line bg-surface p-5">
      <p className={`text-sm font-semibold ${correct ? "text-good" : "text-bad"}`}>{correct ? "Correct" : "Not quite"}</p>
      <label className="block space-y-2 text-sm">
        <span className="font-medium">
          Before you see the explanation: why is &ldquo;{question.options?.[target]}&rdquo; wrong here?
        </span>
        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          rows={3}
          placeholder="Optional. A sentence is enough."
          className={field}
        />
      </label>
      <button type="button" onClick={() => setRevealed(true)} className={reason.trim() ? btnPrimary : btnGhost}>
        {reason.trim() ? "Compare with explanation" : "Skip and show explanation"}
      </button>
    </div>
  );
}

/* ---------- Several true/false statements, all must be right ---------- */

function MultiTrueFalse({ question, onAnswer }: Props) {
  const statements = question.statements ?? [];
  const [answers, setAnswers] = useState<(boolean | null)[]>(() => statements.map(() => null));
  const [submitted, setSubmitted] = useState(false);
  const allRight = statements.every((s, i) => answers[i] === s.answer);

  function submit() {
    setSubmitted(true);
    onAnswer(allRight);
  }

  return (
    <>
      <p className="text-sm text-muted">Like the exam: you need every statement right to get the mark.</p>
      <ol className="space-y-3">
        {statements.map((s, i) => {
          const right = answers[i] === s.answer;
          return (
            <li
              key={i}
              className={`rounded-[10px] border-[1.5px] p-4 ${
                submitted ? (right ? "border-good bg-good-soft" : "border-bad bg-bad-soft") : "border-line-strong bg-surface"
              }`}
            >
              <p className="text-[15px] leading-snug">{s.text}</p>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                {[true, false].map((value) => (
                  <button
                    key={String(value)}
                    type="button"
                    disabled={submitted}
                    onClick={() => setAnswers((a) => a.map((x, j) => (j === i ? value : x)))}
                    aria-pressed={answers[i] === value}
                    className="h-9 min-w-[72px] rounded-lg border border-line-strong bg-surface px-3 text-sm font-medium aria-pressed:border-accent aria-pressed:bg-accent aria-pressed:text-white disabled:cursor-default"
                  >
                    {value ? "True" : "False"}
                  </button>
                ))}
                {submitted && !right && (
                  <span className="text-sm font-medium text-bad">It&apos;s {s.answer ? "true" : "false"}</span>
                )}
              </div>
            </li>
          );
        })}
      </ol>
      {submitted ? (
        <Explanation correct={allRight} explanation={question.explanation} source={question.source} />
      ) : (
        <button type="button" onClick={submit} disabled={answers.includes(null)} className={`${btnPrimary} w-full`}>
          {answers.includes(null) ? "Answer every statement" : "Check"}
        </button>
      )}
    </>
  );
}

/* ---------- Spot the problems in a document ---------- */

function SpotTheIssue({ question, onAnswer }: Props) {
  const lines = question.lines ?? [];
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [submitted, setSubmitted] = useState(false);
  const exact = lines.every((l, i) => Boolean(l.issue) === selected.has(i));
  const issueCount = lines.filter((l) => l.issue).length;
  const found = lines.filter((l, i) => l.issue && selected.has(i)).length;

  function toggle(i: number) {
    setSelected((s) => {
      const next = new Set(s);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  }

  function submit() {
    setSubmitted(true);
    onAnswer(exact);
  }

  return (
    <>
      <ul className="space-y-2">
        {lines.map((l, i) => {
          const on = selected.has(i);
          let style = on ? "border-accent bg-accent-soft" : "border-line-strong bg-surface hover:border-accent";
          let note: string | null = null;
          if (submitted) {
            if (l.issue) {
              style = on ? "border-good bg-good-soft" : "border-bad bg-bad-soft";
              note = `${on ? "Found" : "Missed"}: ${l.issue}`;
            } else {
              style = on ? "border-bad bg-bad-soft" : "border-line bg-surface opacity-70";
              note = on ? "This line is fine." : null;
            }
          }
          return (
            <li key={i}>
              <button
                type="button"
                onClick={() => toggle(i)}
                disabled={submitted}
                aria-pressed={on}
                className={`w-full rounded-[10px] border-[1.5px] px-4 py-3 text-left text-[15px] leading-snug transition-colors disabled:cursor-default ${style}`}
              >
                {l.text}
                {note && <span className="mt-2 block text-sm text-[#374151]">{note}</span>}
              </button>
            </li>
          );
        })}
      </ul>
      {submitted ? (
        <>
          <p className="text-sm text-muted">
            You found {found} of {issueCount} {issueCount === 1 ? "problem" : "problems"}
            {exact ? "." : ". To get the mark you need every problem and no false alarms."}
          </p>
          <Explanation correct={exact} explanation={question.explanation} source={question.source} />
        </>
      ) : (
        <button type="button" onClick={submit} className={`${btnPrimary} w-full`}>
          Check ({selected.size} selected)
        </button>
      )}
    </>
  );
}
