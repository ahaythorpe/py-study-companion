import type { Metadata } from "next";
import { Logbook } from "@/components/Logbook";
import { h1, intro } from "@/components/ui";

export const metadata: Metadata = { title: "PY logbook · PY Study Companion" };

export default function LogbookPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className={h1}>PY logbook</h1>
        <p className={intro}>
          Record your work activities and structured training by quarter. Log ethical dilemmas and
          client notifications too. Keep copies of your certificates and download the CSV for your
          supervisor. Saved in this browser only. Download a copy regularly.
        </p>
        <p className="max-w-[640px] text-xs text-muted">
          Based on ASIC&apos;s professional year guidance (INFO 297) and the Corporations (Work and
          Training Professional Year Standard) Determination 2018. Your PY plan and licensee may set
          extra requirements.
        </p>
      </div>
      <Logbook />
    </div>
  );
}
