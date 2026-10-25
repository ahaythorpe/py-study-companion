import Link from "next/link";
import type { TopicStatsData } from "@/lib/stats";
import type { Topic } from "@/lib/types";

type Props = {
  topic: { id: Topic; label: string };
  stats: TopicStatsData;
  loading?: boolean;
};

export function TopicStats({ topic, stats, loading }: Props) {
  const pct = stats.accuracy === null ? null : Math.round(stats.accuracy * 100);

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-line bg-surface p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="font-semibold">{topic.label}</h2>
          <p className="text-sm text-muted">
            {stats.questionCount} {stats.questionCount === 1 ? "question" : "questions"}
          </p>
        </div>
        {!loading && stats.weak && (
          <span className="rounded-full bg-bad-soft px-2.5 py-0.5 text-xs font-semibold text-bad">
            Weak
          </span>
        )}
      </div>

      <div className="space-y-1.5">
        <div className="flex justify-between text-sm">
          <span className="text-muted">Accuracy</span>
          <span className="font-medium tabular-nums">
            {loading ? "…" : pct === null ? "Not started" : `${pct}% · ${stats.attempts} attempts`}
          </span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-surface-2">
          {!loading && pct !== null && (
            <div
              className={`h-full ${stats.weak ? "bg-bad" : "bg-good"}`}
              style={{ width: `${pct}%` }}
            />
          )}
        </div>
      </div>

      {stats.questionCount === 0 ? (
        <p className="text-sm text-muted">No questions yet</p>
      ) : (
        <div className="mt-auto grid grid-cols-2 gap-2">
          {stats.mcqCount > 0 ? (
            <Link
              href={`/quiz/${topic.id}`}
              className="rounded-lg bg-accent px-3 py-2 text-center text-sm font-medium text-white hover:opacity-90"
            >
              Quiz
            </Link>
          ) : (
            <span className="rounded-lg bg-surface-2 px-3 py-2 text-center text-sm text-muted">
              No MCQs
            </span>
          )}
          <Link
            href={`/cards/${topic.id}`}
            className="rounded-lg border-2 border-line px-3 py-2 text-center text-sm font-medium hover:border-accent"
          >
            Cards
          </Link>
        </div>
      )}
    </div>
  );
}
