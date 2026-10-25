"use client";

import { useState } from "react";
import {
  ACTIVITY_TYPES,
  TARGETS,
  TOTAL_TARGET,
  addEntry,
  hoursBy,
  removeEntry,
  toCsv,
  useTraining,
  type ActivityType,
  type TrainingCategory,
  type TrainingEntry,
} from "@/lib/training";
import { btnGhost, btnPrimary, field } from "./ui";

const round = (n: number) => Math.round(n * 100) / 100;

export function TrainingLog() {
  const entries = useTraining();
  if (entries === null) return <p className="text-muted">Loading…</p>;

  const total = entries.reduce((sum, e) => sum + e.hours, 0);

  function download() {
    const blob = new Blob([toCsv(entries ?? [])], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "py-training-log.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-8">
      <section className="space-y-4 rounded-[14px] border border-line bg-surface p-5">
        <ProgressRow label="Total structured training" hours={total} target={TOTAL_TARGET} strong />
        {TARGETS.map((t) => (
          <ProgressRow key={t.id} label={t.label} hours={hoursBy(entries, t.id)} target={t.hours} />
        ))}
      </section>

      <AddForm />

      <section className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-semibold">
            Activities <span className="font-normal text-muted">({entries.length})</span>
          </h2>
          {entries.length > 0 && (
            <button
              type="button"
              onClick={download}
              className="rounded-lg border border-line px-3 py-1.5 text-sm hover:border-accent"
            >
              Download CSV
            </button>
          )}
        </div>
        {entries.length === 0 ? (
          <p className="rounded-[14px] border border-line bg-surface p-8 text-center text-sm text-muted">
            No training logged yet. Add your first activity above.
          </p>
        ) : (
          <ul className="space-y-3">
            {entries.map((e) => (
              <Entry key={e.id} entry={e} />
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

function ProgressRow({
  label,
  hours,
  target,
  strong,
}: {
  label: string;
  hours: number;
  target: number;
  strong?: boolean;
}) {
  const pct = Math.min(100, (hours / target) * 100);
  const met = hours >= target;
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between gap-3 text-sm">
        <span className={strong ? "font-semibold" : "text-muted"}>{label}</span>
        <span className="font-medium tabular-nums">
          {round(hours)} / {target} h{met && <span className="ml-1.5 text-good">✓ met</span>}
        </span>
      </div>
      <div className={`overflow-hidden rounded-full bg-surface-2 ${strong ? "h-3" : "h-2"}`}>
        <div className={`h-full ${met ? "bg-good" : "bg-accent"}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

function today(): string {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function AddForm() {
  const [open, setOpen] = useState(false);
  const [defaultDate] = useState(today);

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="w-full rounded-lg border-2 border-dashed border-line px-4 py-3 font-medium text-muted hover:border-accent hover:text-accent"
      >
        + Log training
      </button>
    );
  }

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const text = (name: string) => String(form.get(name) ?? "").trim() || undefined;
    const title = text("title");
    const hours = Number(form.get("hours"));
    const quarter = Number(form.get("quarter"));
    if (!title || !(hours > 0)) return;
    addEntry({
      date: text("date") ?? today(),
      title,
      category: form.get("category") as TrainingCategory,
      type: form.get("type") as ActivityType,
      hours,
      quarter: quarter >= 1 && quarter <= 4 ? (quarter as 1 | 2 | 3 | 4) : undefined,
      provider: text("provider"),
      notes: text("notes"),
    });
    setOpen(false);
  }

  return (
    <form onSubmit={submit} className="space-y-3 rounded-[14px] border border-line bg-surface p-5">
      <input name="title" required placeholder="Activity, e.g. SOA writing workshop" className={field} autoFocus />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <input name="date" type="date" defaultValue={defaultDate} className={field} aria-label="Date" />
        <input
          name="hours"
          type="number"
          required
          min="0.25"
          step="0.25"
          placeholder="Hours"
          className={field}
          aria-label="Hours"
        />
        <select name="category" defaultValue="technical" className={field} aria-label="Category">
          {TARGETS.map((t) => (
            <option key={t.id} value={t.id}>
              {t.label}
            </option>
          ))}
        </select>
        <select name="quarter" defaultValue="" className={field} aria-label="Quarter">
          <option value="">Quarter</option>
          {[1, 2, 3, 4].map((q) => (
            <option key={q} value={q}>
              Q{q}
            </option>
          ))}
        </select>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <select name="type" defaultValue={ACTIVITY_TYPES[0]} className={field} aria-label="Type">
          {ACTIVITY_TYPES.map((t) => (
            <option key={t}>{t}</option>
          ))}
        </select>
        <input name="provider" placeholder="Provider or supervisor (optional)" className={field} />
      </div>
      <textarea name="notes" rows={2} placeholder="What you covered (optional)" className={field} />
      <div className="flex gap-2">
        <button
          type="submit"
          className={btnPrimary}
        >
          Save
        </button>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className={btnGhost}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

function Entry({ entry }: { entry: TrainingEntry }) {
  const [confirming, setConfirming] = useState(false);
  const category = TARGETS.find((t) => t.id === entry.category)?.label;
  const date = new Date(`${entry.date}T00:00:00`).toLocaleDateString("en-AU");
  const meta = [date, entry.quarter && `Q${entry.quarter}`, entry.type, entry.provider]
    .filter(Boolean)
    .join(" · ");

  return (
    <li className="space-y-1.5 rounded-[14px] border border-line bg-surface p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="font-medium">{entry.title}</p>
          <p className="text-xs text-muted">{meta}</p>
        </div>
        <span className="shrink-0 font-semibold tabular-nums">{entry.hours} h</span>
      </div>
      <span
        className={`inline-block rounded-full px-2 py-0.5 text-xs ${
          entry.category === "technical" ? "bg-accent-soft text-accent" : "bg-good-soft text-good"
        }`}
      >
        {category}
      </span>
      {entry.notes && <p className="whitespace-pre-line text-sm">{entry.notes}</p>}
      <div className="text-xs text-muted">
        {confirming ? (
          <span className="flex gap-3">
            <button type="button" onClick={() => removeEntry(entry.id)} className="font-medium text-bad">
              Delete
            </button>
            <button type="button" onClick={() => setConfirming(false)}>
              Cancel
            </button>
          </span>
        ) : (
          <button type="button" onClick={() => setConfirming(true)} className="hover:text-bad">
            Remove
          </button>
        )}
      </div>
    </li>
  );
}
