"use client";

import Link from "next/link";
import { useProgress } from "@/lib/progress";
import { PRINCIPLES, QUESTIONS } from "@/lib/questions";
import { MASTERY, principleStats } from "@/lib/stats";
import { AREAS, TOPICS } from "@/lib/types";
import { panel } from "./ui";

export function PrincipleList() {
  const progress = useProgress();

  return (
    <div className="space-y-8">
      <ul className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted">
        {Object.values(MASTERY).map((m) => (
          <li key={m.label} className="flex items-center gap-2">
            <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${m.badge}`}>{m.label}</span>
            {m.hint}
          </li>
        ))}
      </ul>

      {AREAS.map((area) => (
        <section key={area.id} className="space-y-4">
          <h2 className="text-lg font-semibold tracking-[-0.01em]">{area.label}</h2>
          {TOPICS.filter((t) => t.area === area.id).map((topic) => (
            <div key={topic.id} className="space-y-2">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-muted">{topic.label}</h3>
              <ul className={`${panel} overflow-hidden`}>
                {PRINCIPLES.filter((p) => p.topic === topic.id).map((p) => {
                  const variants = QUESTIONS.filter((q) => q.principle === p.id);
                  const stats = progress === null ? null : principleStats(variants, progress);
                  const mastery = stats ? MASTERY[stats.mastery] : null;
                  return (
                    <li
                      key={p.id}
                      className="flex flex-wrap items-center justify-between gap-3 px-5 py-3.5 [&+&]:border-t [&+&]:border-divider"
                    >
                      <div className="min-w-0 flex-[1_1_260px]">
                        <p className="flex flex-wrap items-center gap-2 font-medium">
                          {p.label}
                          {mastery && (
                            <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${mastery.badge}`}>
                              {mastery.label}
                            </span>
                          )}
                        </p>
                        <p className="text-[13px] text-muted">
                          {stats
                            ? `${stats.right} of ${stats.variants} ${stats.variants === 1 ? "version" : "versions"} last answered right`
                            : `${variants.length} ${variants.length === 1 ? "version" : "versions"}`}
                        </p>
                      </div>
                      <Link
                        href={`/principle/${p.id}`}
                        className="rounded-lg border border-line-strong px-3 py-1.5 text-sm font-medium hover:border-accent hover:text-accent"
                      >
                        Practise all versions
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </section>
      ))}
    </div>
  );
}
