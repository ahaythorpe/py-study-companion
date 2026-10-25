"use client";

import { useState } from "react";
import type { Question } from "@/lib/types";
import { Explanation } from "./Explanation";

type Props = {
  question: Question;
  onMark: (correct: boolean) => void;
};

// MCQs double as cards: the back shows the correct option.
function backText(q: Question): string {
  if (q.kind === "flashcard") return q.answer ?? "";
  return q.options?.[q.answerIndex ?? 0] ?? "";
}

export function Flashcard({ question, onMark }: Props) {
  const [flipped, setFlipped] = useState(false);

  return (
    <div className="space-y-4">
      <button
        type="button"
        onClick={() => setFlipped((f) => !f)}
        aria-label={flipped ? "Show question" : "Show answer"}
        className="flex min-h-56 w-full flex-col justify-center rounded-[14px] border border-line bg-surface p-7 text-left transition-colors hover:border-accent"
      >
        <span className="mb-3 text-xs font-medium uppercase tracking-wide text-muted">
          {flipped ? "Answer" : "Question · tap to flip"}
        </span>
        <span className="text-xl font-semibold leading-snug tracking-[-0.01em]">
          {flipped ? backText(question) : question.prompt}
        </span>
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
