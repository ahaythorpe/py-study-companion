import Link from "next/link";

type Props = {
  score: number;
  total: number;
  onRestart: () => void;
};

export function ResultScreen({ score, total, onRestart }: Props) {
  const pct = total === 0 ? 0 : Math.round((score / total) * 100);
  return (
    <div className="space-y-6 py-8 text-center">
      <p className="text-sm uppercase tracking-wide text-muted">Session complete</p>
      <p className="text-5xl font-semibold">
        {score} / {total}
      </p>
      <p className="text-muted">{pct}% correct. Missed questions will come back first.</p>
      <div className="flex justify-center gap-3">
        <button
          type="button"
          onClick={onRestart}
          className="rounded-lg bg-accent px-5 py-2.5 font-medium text-white hover:opacity-90"
        >
          Go again
        </button>
        <Link
          href="/"
          className="rounded-lg border-2 border-line px-5 py-2.5 font-medium hover:border-accent"
        >
          Dashboard
        </Link>
      </div>
    </div>
  );
}
