import type { Metadata } from "next";
import resources from "@/data/resources.json";
import { TOPICS } from "@/lib/types";

export const metadata: Metadata = { title: "Resources · PY Study Companion" };

type Resource = {
  group: string;
  title: string;
  url: string;
  note: string;
  topics?: string[];
};

export default function ResourcesPage() {
  const list = resources as Resource[];
  const groups = [...new Set(list.map((r) => r.group))];

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-[32px] font-bold leading-tight tracking-[-0.02em]">Resources</h1>
        <p className="max-w-[520px] text-[15px] leading-[1.55] text-muted">
          Primary sources for writing and checking questions. Always confirm against the current
          version before relying on it.
        </p>
      </div>

      {groups.map((group) => (
        <section key={group} className="space-y-3">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">{group}</h2>
          <ul className="space-y-3">
            {list
              .filter((r) => r.group === group)
              .map((r) => (
                <li key={r.url}>
                  <a
                    href={r.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block rounded-[14px] border border-line bg-surface p-5 transition-colors hover:border-accent"
                  >
                    <p className="font-medium">
                      {r.title} <span className="text-muted">↗</span>
                    </p>
                    <p className="mt-1 text-sm text-muted">{r.note}</p>
                    {r.topics && (
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {r.topics.map((id) => (
                          <span
                            key={id}
                            className="rounded-full bg-accent-soft px-2 py-0.5 text-xs text-accent"
                          >
                            {TOPICS.find((t) => t.id === id)?.label ?? id}
                          </span>
                        ))}
                      </div>
                    )}
                  </a>
                </li>
              ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
