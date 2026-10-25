import Link from "next/link";
import type { TopicStatsData } from "@/lib/stats";
import type { Topic } from "@/lib/types";
import { btnDisabled, btnGhost, btnPrimary } from "./ui";

type Props = {
  index: number;
  topic: { id: Topic; label: string };
  stats: TopicStatsData;
  loading?: boolean;
};

export function TopicStats({ index, topic, stats, loading }: Props) {
  const pct = stats.accuracy === null ? 0 : Math.round(stats.accuracy * 100);
  const weak = !loading && stats.weak;

  return (
    <div className="flex flex-wrap items-center gap-x-8 gap-y-4 p-5 [&+&]:border-t [&+&]:border-divider">
      <div className="flex min-w-0 flex-[1_1_240px] items-center gap-3.5">
        <span className="flex size-8 flex-none items-center justify-center rounded-lg bg-surface-2 text-[13px] font-semibold text-muted">
          {String(index).padStart(2, "0")}
        </span>
        <div className="min-w-0">
          <h3 className="flex flex-wrap items-center gap-2 text-base font-semibold">
            {topic.label}
            {weak && (
              <span className="rounded-full bg-warn-soft px-2 py-0.5 text-xs font-semibold text-warn">
                Weak
              </span>
            )}
          </h3>
          <span className="text-[13px] text-muted">
            {stats.questionCount === 0
              ? "No questions yet"
              : `${stats.questionCount} ${stats.questionCount === 1 ? "question" : "questions"}`}
          </span>
        </div>
      </div>

      <div className="flex min-w-40 flex-[1_1_200px] flex-col gap-2">
        <div className="flex justify-between text-[13px]">
          <span className="text-muted">Accuracy</span>
          <span className="font-medium tabular-nums text-[#374151]">
            {loading
              ? "…"
              : stats.accuracy === null
                ? "Not started"
                : `${pct}% · ${stats.attempts} attempts`}
          </span>
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-track">
          <div
            className={`h-1.5 rounded-full ${weak ? "bg-warn" : "bg-accent"}`}
            style={{ width: `${loading ? 0 : pct}%` }}
          />
        </div>
      </div>

      <div className="flex flex-none gap-2">
        {stats.mcqCount > 0 ? (
          <Link href={`/quiz/${topic.id}`} className={btnPrimary}>
            Quiz
          </Link>
        ) : (
          <button type="button" disabled className={btnDisabled}>
            Quiz
          </button>
        )}
        {stats.questionCount > 0 ? (
          <Link href={`/cards/${topic.id}`} className={btnGhost}>
            Cards
          </Link>
        ) : (
          <button type="button" disabled className={btnDisabled}>
            Cards
          </button>
        )}
      </div>
    </div>
  );
}
