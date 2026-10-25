import type { Metadata } from "next";
import { TrainingLog } from "@/components/TrainingLog";

export const metadata: Metadata = { title: "PY training log · PY Study Companion" };

export default function TrainingPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-[32px] font-bold leading-tight tracking-[-0.02em]">PY training log</h1>
        <p className="max-w-[520px] text-[15px] leading-[1.55] text-muted">
          Track your structured training hours for the Professional Year. Download the CSV to share
          with your supervisor. Saved in this browser only.
        </p>
        <p className="text-xs text-muted">
          Targets shown are 70 h technical and 30 h client care (100 h total). Confirm the current
          requirements with ASIC and your licensee&apos;s PY plan.
        </p>
      </div>
      <TrainingLog />
    </div>
  );
}
