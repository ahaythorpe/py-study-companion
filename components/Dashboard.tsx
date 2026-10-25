"use client";

import Link from "next/link";
import { useState } from "react";
import { resetProgress, useProgress } from "@/lib/progress";
import { QUESTIONS, questionsFor } from "@/lib/questions";
import { weakQuestions } from "@/lib/scheduler";
import { computeStats } from "@/lib/stats";
import { TOPICS } from "@/lib/types";
import { TopicStats } from "./TopicStats";
import { btnDisabled, btnGhost, h1, intro, panel } from "./ui";

export function Dashboard() {
  const live = useProgress();
  const loading = live === null;
  const progress = live ?? {};

  const topicStats = TOPICS.map((topic) => ({
    topic,
    stats: computeStats(questionsFor(topic.id), progress),
  }));
  const overall = computeStats(QUESTIONS, progress);
  const answered = QUESTIONS.filter((q) => progress[q.id]).length;
  const weakTopics = topicStats.filter((t) => t.stats.weak).length;
  const weakCount = weakQuestions(
    QUESTIONS.filter((q) => q.kind === "mcq"),
    progress,
  ).length;

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div className="flex flex-col gap-2">
          <h1 className={h1}>Your topics</h1>
          <p className={intro}>
            Topics under 70% accuracy after 5 attempts are flagged weak. Missed questions come back
            first.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Stat label="Answered">
            {loading ? "–" : answered} <small className="text-sm font-medium text-muted">/ {QUESTIONS.length}</small>
          </Stat>
          <Stat label="Accuracy">
            {loading || overall.accuracy === null ? "–" : `${Math.round(overall.accuracy * 100)}%`}
          </Stat>
          <Stat label="Weak topics">{loading ? "–" : weakTopics}</Stat>
        </div>
      </div>

      <section
        aria-label="Weak questions"
        className={`${panel} flex flex-wrap items-center justify-between gap-4 px-5 py-[18px]`}
      >
        <div className="flex min-w-0 flex-[1_1_320px] items-center gap-3.5">
          <div className="flex size-10 flex-none items-center justify-center rounded-[10px] bg-warn-soft">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="var(--warn)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
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

      <section aria-label="Topics" className={`${panel} overflow-hidden`}>
        {topicStats.map(({ topic, stats }, i) => (
          <TopicStats key={topic.id} index={i + 1} topic={topic} stats={stats} loading={loading} />
        ))}
      </section>

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
        Reset progress
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
