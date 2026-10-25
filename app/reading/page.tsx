import type { Metadata } from "next";
import { ReadingLog } from "@/components/ReadingLog";

export const metadata: Metadata = { title: "Reading log · PY Study Companion" };

export default function ReadingPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Reading log</h1>
        <p className="text-muted">
          Books, articles, courses and podcasts you&apos;re working through. Log hours to keep a
          record for CPD. Saved in this browser only.
        </p>
      </div>
      <ReadingLog />
    </div>
  );
}
