"use client";

import Link from "next/link";
import { useState } from "react";
import { recordAnswer, useProgress } from "@/lib/progress";
import { buildBalancedSession, buildSession, weakQuestions } from "@/lib/scheduler";
import type { Progress, Question } from "@/lib/types";
import { Flashcard } from "./Flashcard";
import { QuestionCard } from "./QuestionCard";
import { ResultScreen } from "./ResultScreen";
import { btnPrimary } from "./ui";

type Props = {
  mode: "quiz" | "cards";
  title: string;
  questions: Question[];
  /** Only use attempted questions in box 1 or 2 (the /quiz/weak route). */
  weakOnly?: boolean;
  length?: number;
  /** Exam-style: this many questions from each of the three areas. */
  perArea?: number;
  emptyMessage?: string;
};

export function StudySession(props: Props) {
  const progress = useProgress();
  const [run, setRun] = useState(0);

  return (
    <div className="mx-auto max-w-[680px] space-y-8">
      <div className="flex items-baseline justify-between gap-4">
        <h1 className="text-[32px] font-bold leading-tight tracking-[-0.02em]">{props.title}</h1>
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
  length,
  perArea,
  emptyMessage = "No questions yet.",
  progress,
  onRestart,
}: Props & { progress: Progress; onRestart: () => void }) {
  // Fix the order at the start so answering doesn't reshuffle the session.
  const [session] = useState(() => {
    if (perArea) return buildBalancedSession(questions, progress, perArea);
    return buildSession(weakOnly ? weakQuestions(questions, progress) : questions, progress, length);
  });
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);

  if (session.length === 0) {
    return <p className="rounded-[14px] border border-line bg-surface p-8 text-center text-muted">{emptyMessage}</p>;
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
        <div className="h-1.5 overflow-hidden rounded-full bg-track">
          <div
            className="h-full rounded-full bg-accent transition-all"
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
              className={`${btnPrimary} w-full`}
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
