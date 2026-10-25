import type { Metadata } from "next";
import { PrincipleList } from "@/components/PrincipleList";
import { h1, intro } from "@/components/ui";

export const metadata: Metadata = { title: "Principles · PY Study Companion" };

export default function PrinciplesPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className={h1}>Mastery by principle</h1>
        <p className={intro}>
          Each principle is asked several ways. Explain it · apply it to a scenario · compare it · explain it to a
          client · apply the quoted law. You&apos;ve only got it when you can answer every version and not just
          one wording.
        </p>
      </div>
      <PrincipleList />
    </div>
  );
}
