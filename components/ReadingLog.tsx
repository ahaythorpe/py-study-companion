"use client";

import { useState } from "react";
import {
  KINDS,
  STATUSES,
  addItem,
  removeItem,
  setStatus,
  useReading,
  type ReadingItem,
  type ReadingKind,
  type ReadingStatus,
} from "@/lib/reading";
import { TOPICS, type Topic } from "@/lib/types";
import { field } from "./ui";

export function ReadingLog() {
  const items = useReading();
  const [filter, setFilter] = useState<ReadingStatus | "all">("all");

  if (items === null) return <p className="text-muted">Loading…</p>;

  const done = items.filter((i) => i.status === "done");
  const hours = items.reduce((sum, i) => sum + (i.hours ?? 0), 0);
  const shown = filter === "all" ? items : items.filter((i) => i.status === filter);

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-3 gap-3">
        <Stat label="Finished" value={done.length} />
        <Stat label="In progress" value={items.filter((i) => i.status === "reading").length} />
        <Stat label="Hours logged" value={Math.round(hours * 10) / 10} />
      </div>

      <AddForm />

      <section className="space-y-3">
        <div className="flex flex-wrap gap-2">
          {[{ id: "all" as const, label: "All" }, ...STATUSES].map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setFilter(s.id)}
              className={`rounded-full px-3 py-1 text-sm ${
                filter === s.id ? "bg-accent text-white" : "bg-surface-2 text-muted hover:text-foreground"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>

        {shown.length === 0 ? (
          <p className="rounded-lg bg-surface-2 p-6 text-center text-sm text-muted">
            {items.length === 0 ? "Nothing logged yet. Add your first book above." : "Nothing here."}
          </p>
        ) : (
          <ul className="space-y-3">
            {shown.map((item) => (
              <Item key={item.id} item={item} />
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-line bg-surface p-4">
      <p className="text-2xl font-semibold tabular-nums">{value}</p>
      <p className="text-xs text-muted">{label}</p>
    </div>
  );
}

function AddForm() {
  const [open, setOpen] = useState(false);

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="w-full rounded-lg border-2 border-dashed border-line px-4 py-3 font-medium text-muted hover:border-accent hover:text-accent"
      >
        + Add a book, article, course or podcast
      </button>
    );
  }

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const text = (name: string) => String(form.get(name) ?? "").trim() || undefined;
    const title = text("title");
    if (!title) return;
    const hours = Number(form.get("hours"));
    addItem({
      title,
      author: text("author"),
      kind: form.get("kind") as ReadingKind,
      topic: text("topic") as Topic | undefined,
      status: form.get("status") as ReadingStatus,
      hours: hours > 0 ? hours : undefined,
      notes: text("notes"),
    });
    setOpen(false);
  }

  return (
    <form onSubmit={submit} className="space-y-3 rounded-xl border border-line bg-surface p-5">
      <input name="title" required placeholder="Title" className={field} autoFocus />
      <input name="author" placeholder="Author or source (optional)" className={field} />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <select name="kind" defaultValue="book" className={field} aria-label="Type">
          {KINDS.map((k) => (
            <option key={k.id} value={k.id}>
              {k.label}
            </option>
          ))}
        </select>
        <select name="status" defaultValue="reading" className={field} aria-label="Status">
          {STATUSES.map((s) => (
            <option key={s.id} value={s.id}>
              {s.label}
            </option>
          ))}
        </select>
        <select name="topic" defaultValue="" className={field} aria-label="Topic">
          <option value="">No topic</option>
          {TOPICS.map((t) => (
            <option key={t.id} value={t.id}>
              {t.label}
            </option>
          ))}
        </select>
        <input
          name="hours"
          type="number"
          min="0"
          step="0.25"
          placeholder="Hours"
          className={field}
          aria-label="Hours"
        />
      </div>
      <textarea name="notes" rows={3} placeholder="Notes and key takeaways (optional)" className={field} />
      <div className="flex gap-2">
        <button
          type="submit"
          className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white hover:opacity-90"
        >
          Save
        </button>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="rounded-lg border border-line px-4 py-2 text-sm hover:border-accent"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

function Item({ item }: { item: ReadingItem }) {
  const [confirming, setConfirming] = useState(false);
  const kind = KINDS.find((k) => k.id === item.kind)?.label;
  const topic = TOPICS.find((t) => t.id === item.topic)?.label;
  const meta = [kind, topic, item.hours ? `${item.hours}h` : undefined].filter(Boolean).join(" · ");

  return (
    <li className="space-y-2 rounded-xl border border-line bg-surface p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className={`font-medium ${item.status === "done" ? "text-muted line-through" : ""}`}>
            {item.title}
          </p>
          {item.author && <p className="text-sm text-muted">{item.author}</p>}
          <p className="text-xs text-muted">{meta}</p>
        </div>
        <select
          value={item.status}
          onChange={(e) => setStatus(item.id, e.target.value as ReadingStatus)}
          className="shrink-0 rounded-md border border-line bg-surface px-2 py-1 text-sm"
          aria-label="Status"
        >
          {STATUSES.map((s) => (
            <option key={s.id} value={s.id}>
              {s.label}
            </option>
          ))}
        </select>
      </div>
      {item.notes && <p className="whitespace-pre-line text-sm">{item.notes}</p>}
      <div className="flex items-center gap-3 text-xs text-muted">
        <span>
          Added {new Date(item.addedAt).toLocaleDateString("en-AU")}
          {item.finishedAt && ` · finished ${new Date(item.finishedAt).toLocaleDateString("en-AU")}`}
        </span>
        {confirming ? (
          <>
            <button type="button" onClick={() => removeItem(item.id)} className="font-medium text-bad">
              Delete
            </button>
            <button type="button" onClick={() => setConfirming(false)}>
              Cancel
            </button>
          </>
        ) : (
          <button type="button" onClick={() => setConfirming(true)} className="hover:text-bad">
            Remove
          </button>
        )}
      </div>
    </li>
  );
}
