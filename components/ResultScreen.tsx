import Link from "next/link";
import { btnGhost, btnPrimary } from "./ui";

type Props = {
  score: number;
  total: number;
  onRestart: () => void;
};

export function ResultScreen({ score, total, onRestart }: Props) {
  const pct = total === 0 ? 0 : Math.round((score / total) * 100);
  return (
    <div className="space-y-6 rounded-[14px] border border-line bg-surface px-6 py-10 text-center">
      <p className="text-xs font-semibold uppercase tracking-wide text-muted">Session complete</p>
      <p className="text-5xl font-bold tracking-[-0.02em]">
        {score} / {total}
      </p>
      <p className="text-muted">
        {pct}% correct.{" "}
        {pct >= 75
          ? "Above the top of the 65 to 74% range ASIC starts from when setting the pass mark."
          : pct >= 65
            ? "Inside the 65 to 74% range ASIC starts from when setting the pass mark, so aim higher for a buffer."
            : "Below the 65 to 74% range ASIC starts from when setting the pass mark."}{" "}
        Missed questions will come back first.
      </p>
      <div className="flex justify-center gap-3">
        <button
          type="button"
          onClick={onRestart}
          className={btnPrimary}
        >
          Go again
        </button>
        <Link
          href="/"
          className={btnGhost}
        >
          Dashboard
        </Link>
      </div>
    </div>
  );
}
