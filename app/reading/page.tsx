import type { Metadata } from "next";
import { ReadingLog } from "@/components/ReadingLog";

export const metadata: Metadata = { title: "Reading log · PY Study Companion" };

export default function ReadingPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-[32px] font-bold leading-tight tracking-[-0.02em]">Reading log</h1>
        <p className="max-w-[520px] text-[15px] leading-[1.55] text-muted">
          Books, articles, courses and podcasts you&apos;re working through. Log hours to keep a
          record for CPD. Saved in this browser only.
        </p>
      </div>
      <ReadingLog />
    </div>
  );
}
