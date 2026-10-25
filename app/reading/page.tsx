import type { Metadata } from "next";
import { ReadingLog } from "@/components/ReadingLog";

export const metadata: Metadata = { title: "Reading log · PY Study Companion" };

export default function ReadingPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-[32px] font-bold leading-tight tracking-[-0.02em]">Reading log</h1>
        <p className="max-w-[520px] text-[15px] leading-[1.55] text-muted">
          Legislation and regulatory guides plus the books and courses you&apos;re working through. Includes
          ASIC&apos;s suggested exam reading. Log hours as a record of study. Saved in this browser only.
        </p>
      </div>
      <ReadingLog />
    </div>
  );
}
