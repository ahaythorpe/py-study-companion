"use client";

import Link from "next/link";
import { useState } from "react";
import { formatDate, today, useLogbook } from "@/lib/logbook";
import { resetProgress, useProgress } from "@/lib/progress";
import { QUESTIONS, isQuizQuestion, questionsFor, questionsForArea } from "@/lib/questions";
import { weakQuestions } from "@/lib/scheduler";
import { READINESS, computeStats } from "@/lib/stats";
import { AREAS, TOPICS } from "@/lib/types";
import { TopicStats } from "./TopicStats";
import { btnDisabled, btnGhost, btnPrimary, h1, intro, panel } from "./ui";

function daysUntil(date: string): number {
  const ms = new Date(`${date}T00:00:00`).getTime() - new Date(`${today()}T00:00:00`).getTime();
  return Math.round(ms / 86_400_000);
}

export function Dashboard() {
  const live = useProgress();
  const book = useLogbook();
  const loading = live === null;
  const progress = live ?? {};

  const overall = computeStats(QUESTIONS, progress);
  const answered = QUESTIONS.filter((q) => progress[q.id]).length;
  const weakTopics = TOPICS.filter((t) => computeStats(questionsFor(t.id), progress).weak).length;
  const weakCount = weakQuestions(QUESTIONS.filter(isQuizQuestion), progress).length;
  const examDate = book?.setup.examBookedDate;
  const examPassed = book?.setup.examPassedDate;

  let topicNumber = 0;

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div className="flex flex-col gap-2">
          <h1 className={h1}>Your topics</h1>
          <p className={intro}>
            Organised by the three areas of the ASIC financial adviser exam. After 5 attempts a topic is
            weak under 65%, borderline at 65–74% (ASIC&apos;s starting range for the pass mark) and
            exam-ready from 75%. Missed questions come back first.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Stat label="Answered">
            {loading ? "–" : answered}{" "}
            <small className="text-sm font-medium text-muted">/ {QUESTIONS.length}</small>
          </Stat>
          <Stat label="Accuracy">
            {loading || overall.accuracy === null ? "–" : `${Math.round(overall.accuracy * 100)}%`}
          </Stat>
          <Stat label="Weak topics">{loading ? "–" : weakTopics}</Stat>
        </div>
      </div>

      <section aria-label="The exam" className={`${panel} flex flex-wrap items-center justify-between gap-4 px-5 py-[18px]`}>
        <div className="flex min-w-0 flex-[1_1_360px] items-center gap-3.5">
          <div className="flex size-10 flex-none items-center justify-center rounded-[10px] bg-accent-soft">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <rect x="3" y="4" width="18" height="18" rx="2" />
              <path d="M16 2v4M8 2v4M3 10h18" />
            </svg>
          </div>
          <div>
            <h2 className="text-[15px] font-semibold">
              ASIC financial adviser exam
              {examPassed ? (
                <span className="ml-2 text-sm font-medium text-good">Passed {formatDate(examPassed)}</span>
              ) : examDate && daysUntil(examDate) >= 0 ? (
                <span className="ml-2 text-sm font-medium text-accent">
                  {daysUntil(examDate) === 0 ? "Today" : `in ${daysUntil(examDate)} days`}
                </span>
              ) : null}
            </h2>
            <ul className="mt-1.5 grid gap-x-6 gap-y-1 text-sm text-muted sm:grid-cols-2">
              <li>Multiple choice only, 70+ questions (no written answers since Jan 2024)</li>
              <li>Equal split across the 3 areas below</li>
              <li>Open book for statutory material: the law is quoted in the question</li>
              <li>Pass mark set each sitting from a 65–74% credit range</li>
              <li>3.5 hours including 15 min reading; no penalty for wrong answers</li>
              <li>Must be passed before PY quarter 3</li>
            </ul>
          </div>
        </div>
        <Link href="/quiz/mixed" className={btnPrimary}>
          Exam-style practice
        </Link>
      </section>

      <section aria-label="Weak questions" className={`${panel} flex flex-wrap items-center justify-between gap-4 px-5 py-[18px]`}>
        <div className="flex min-w-0 flex-[1_1_320px] items-center gap-3.5">
          <div className="flex size-10 flex-none items-center justify-center rounded-[10px] bg-warn-soft">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--warn)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M3 12a9 9 0 1 0 3-6.7" />
              <path d="M3 4v5h5" />
            </svg>
          </div>
          <div>
            <h2 className="text-[15px] font-semibold">Weak questions</h2>
            <p className="mt-0.5 text-sm text-muted">
              {loading
                ? "…"
                : weakCount === 0
                  ? "Nothing to review yet. Questions you miss land here."
                  : `${weakCount} ${weakCount === 1 ? "question" : "questions"} to review across all topics, worst first.`}
            </p>
          </div>
        </div>
        {weakCount === 0 ? (
          <button type="button" disabled className={btnDisabled}>
            Review weak questions
          </button>
        ) : (
          <Link href="/quiz/weak" className={btnGhost}>
            Review weak questions
          </Link>
        )}
      </section>

      {AREAS.map((area, i) => {
        const areaStats = computeStats(questionsForArea(area.id), progress);
        return (
          <section key={area.id} aria-label={area.label} className="space-y-3">
            <div className="flex flex-wrap items-end justify-between gap-2 px-1">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-muted">Area {i + 1} of 3</p>
                <h2 className="text-lg font-semibold tracking-[-0.01em]">{area.label}</h2>
                <p className="text-sm text-muted">{area.summary}</p>
              </div>
              <span className="flex items-center gap-2 text-sm font-medium tabular-nums text-muted">
                {loading || areaStats.accuracy === null ? "Not started" : `${Math.round(areaStats.accuracy * 100)}% accuracy`}
                {!loading && READINESS[areaStats.readiness].badge && (
                  <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${READINESS[areaStats.readiness].badge}`}>
                    {READINESS[areaStats.readiness].label}
                  </span>
                )}
              </span>
            </div>
            <div className={`${panel} overflow-hidden`}>
              {TOPICS.filter((t) => t.area === area.id).map((topic) => (
                <TopicStats
                  key={topic.id}
                  index={++topicNumber}
                  topic={topic}
                  stats={computeStats(questionsFor(topic.id), progress)}
                  loading={loading}
                />
              ))}
            </div>
          </section>
        );
      })}

      <ResetButton />
    </div>
  );
}

function Stat({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex min-w-[120px] flex-col gap-1 rounded-xl border border-line bg-surface px-[18px] py-3.5">
      <span className="text-xs font-medium text-muted">{label}</span>
      <span className="text-xl font-semibold tabular-nums">{children}</span>
    </div>
  );
}

function ResetButton() {
  const [confirming, setConfirming] = useState(false);

  if (!confirming) {
    return (
      <button
        type="button"
        onClick={() => setConfirming(true)}
        className="self-start text-sm text-muted underline-offset-4 hover:text-bad hover:underline"
      >
        Reset quiz progress
      </button>
    );
  }
  return (
    <div className="flex flex-wrap items-center gap-3 text-sm">
      <span>Clear all quiz progress? This can&apos;t be undone.</span>
      <button
        type="button"
        onClick={() => {
          resetProgress();
          setConfirming(false);
        }}
        className="rounded-lg bg-bad px-3 py-1.5 font-medium text-white hover:opacity-90"
      >
        Yes, reset
      </button>
      <button
        type="button"
        onClick={() => setConfirming(false)}
        className="rounded-lg border border-line-strong bg-surface px-3 py-1.5 hover:border-accent"
      >
        Cancel
      </button>
    </div>
  );
}
