"use client";

import Link from "next/link";
import { useState } from "react";
import { recordAnswer, useProgress } from "@/lib/progress";
import { buildSession, weakQuestions } from "@/lib/scheduler";
import type { Progress, Question } from "@/lib/types";
import { Flashcard } from "./Flashcard";
import { QuestionCard } from "./QuestionCard";
import { ResultScreen } from "./ResultScreen";

type Props = {
  mode: "quiz" | "cards";
  title: string;
  questions: Question[];
  /** Only use attempted questions in box 1 or 2 (the /quiz/weak route). */
  weakOnly?: boolean;
  emptyMessage?: string;
};

export function StudySession(props: Props) {
  const progress = useProgress();
  const [run, setRun] = useState(0);

  return (
    <div className="space-y-6">
      <div className="flex items-baseline justify-between gap-4">
        <h1 className="text-2xl font-semibold">{props.title}</h1>
        <Link href="/" className="shrink-0 text-sm text-muted hover:text-accent">
          ← Dashboard
        </Link>
      </div>
      {progress === null ? (
        <p className="text-muted">Loading…</p>
      ) : (
        // Remounting on restart rebuilds the session from the latest progress.
        <Run key={run} {...props} progress={progress} onRestart={() => setRun((r) => r + 1)} />
      )}
    </div>
  );
}

function Run({
  mode,
  questions,
  weakOnly,
  emptyMessage = "No questions yet.",
  progress,
  onRestart,
}: Props & { progress: Progress; onRestart: () => void }) {
  // Fix the order at the start so answering doesn't reshuffle the session.
  const [session] = useState(() =>
    buildSession(weakOnly ? weakQuestions(questions, progress) : questions, progress),
  );
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);

  if (session.length === 0) {
    return <p className="rounded-lg bg-surface-2 p-6 text-center text-muted">{emptyMessage}</p>;
  }
  if (index >= session.length) {
    return <ResultScreen score={score} total={session.length} onRestart={onRestart} />;
  }

  const question = session[index];

  function answer(correct: boolean) {
    recordAnswer(question.id, correct);
    if (correct) setScore((s) => s + 1);
    setAnswered(true);
  }

  function next() {
    setAnswered(false);
    setIndex((i) => i + 1);
  }

  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-muted">
          <span>
            {index + 1} of {session.length}
          </span>
          <span>Score {score}</span>
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-surface-2">
          <div
            className="h-full bg-accent transition-all"
            style={{ width: `${(index / session.length) * 100}%` }}
          />
        </div>
      </div>

      {mode === "quiz" ? (
        <>
          <QuestionCard key={question.id} question={question} onAnswer={answer} />
          {answered && (
            <button
              type="button"
              onClick={next}
              className="w-full rounded-lg bg-accent px-5 py-3 font-medium text-white hover:opacity-90"
            >
              {index + 1 === session.length ? "See score" : "Next"}
            </button>
          )}
        </>
      ) : (
        <Flashcard
          key={question.id}
          question={question}
          onMark={(correct) => {
            answer(correct);
            next();
          }}
        />
      )}
    </div>
  );
}
