"use client";

import { useState } from "react";
import type { Question } from "@/lib/types";
import { Explanation } from "./Explanation";

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
  // Shuffle so the answer's position in the JSON doesn't give it away.
  const [order] = useState(() => shuffledIndexes(question.options?.length ?? 0));
  const [picked, setPicked] = useState<number | null>(null);
  const locked = picked !== null;
  const correctIndex = question.answerIndex ?? 0;

  function pick(i: number) {
    if (locked) return;
    setPicked(i);
    onAnswer(i === correctIndex);
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-medium leading-snug">{question.prompt}</h2>

      <ul className="space-y-2">
        {order.map((i) => {
          const option = question.options?.[i];
          let style = "border-line hover:border-accent hover:bg-accent-soft";
          if (locked) {
            if (i === correctIndex) style = "border-good bg-good-soft";
            else if (i === picked) style = "border-bad bg-bad-soft";
            else style = "border-line opacity-60";
          }
          return (
            <li key={i}>
              <button
                type="button"
                onClick={() => pick(i)}
                disabled={locked}
                className={`w-full rounded-lg border-2 px-4 py-3 text-left transition-colors disabled:cursor-default ${style}`}
              >
                {option}
              </button>
            </li>
          );
        })}
      </ul>

      {locked && (
        <Explanation
          correct={picked === correctIndex}
          explanation={question.explanation}
          source={question.source}
        />
      )}
    </div>
  );
}
