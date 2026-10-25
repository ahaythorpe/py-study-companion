"use client";

import Link from "next/link";
import { useState } from "react";
import { resetProgress, useProgress } from "@/lib/progress";
import { QUESTIONS, questionsFor } from "@/lib/questions";
import { weakQuestions } from "@/lib/scheduler";
import { computeStats } from "@/lib/stats";
import { TOPICS } from "@/lib/types";
import { TopicStats } from "./TopicStats";

export function Dashboard() {
  const live = useProgress();
  const loading = live === null;
  const progress = live ?? {};
  const weakCount = weakQuestions(
    QUESTIONS.filter((q) => q.kind === "mcq"),
    progress,
  ).length;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        {TOPICS.map((topic) => (
          <TopicStats
            key={topic.id}
            topic={topic}
            stats={computeStats(questionsFor(topic.id), progress)}
            loading={loading}
          />
        ))}

        <div className="flex flex-col justify-between gap-4 rounded-xl border border-dashed border-line p-5">
          <div>
            <h2 className="font-semibold">Weak questions</h2>
            <p className="text-sm text-muted">
              {loading
                ? "…"
                : weakCount === 0
                  ? "Nothing to review yet. Questions you miss land here."
                  : `${weakCount} across all topics, worst first.`}
            </p>
          </div>
          <Link
            href="/quiz/weak"
            className="rounded-lg bg-accent px-3 py-2 text-center text-sm font-medium text-white hover:opacity-90"
          >
            Review weak questions
          </Link>
        </div>
      </div>

      <ResetButton />
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
        className="text-sm text-muted underline-offset-4 hover:text-bad hover:underline"
      >
        Reset progress
      </button>
    );
  }
  return (
    <div className="flex flex-wrap items-center gap-3 text-sm">
      <span>Clear all progress? This can&apos;t be undone.</span>
      <button
        type="button"
        onClick={() => {
          resetProgress();
          setConfirming(false);
        }}
        className="rounded-md bg-bad px-3 py-1.5 font-medium text-white hover:opacity-90"
      >
        Yes, reset
      </button>
      <button
        type="button"
        onClick={() => setConfirming(false)}
        className="rounded-md border border-line px-3 py-1.5 hover:border-accent"
      >
        Cancel
      </button>
    </div>
  );
}
