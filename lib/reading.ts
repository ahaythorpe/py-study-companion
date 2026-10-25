import suggested from "@/data/suggested-reading.json";
import { createStore } from "./storage";
import type { Topic } from "./types";

export type ReadingKind = "guidance" | "book" | "article" | "course" | "podcast";
export type ReadingStatus = "to-read" | "reading" | "done";

export const KINDS: { id: ReadingKind; label: string }[] = [
  { id: "guidance", label: "Law or guidance" },
  { id: "book", label: "Book" },
  { id: "article", label: "Article" },
  { id: "course", label: "Course" },
  { id: "podcast", label: "Podcast" },
];

export const STATUSES: { id: ReadingStatus; label: string }[] = [
  { id: "to-read", label: "To read" },
  { id: "reading", label: "Reading" },
  { id: "done", label: "Done" },
];

export type ReadingItem = {
  id: string;
  title: string;
  author?: string;
  kind: ReadingKind;
  topic?: Topic;
  status: ReadingStatus;
  hours?: number; // study time, handy for CPD records
  notes?: string;
  addedAt: number;
  finishedAt?: number;
};

const store = createStore<ReadingItem[]>("py-reading-v1", [], Array.isArray);

export const useReading = store.useValue;

export function addItem(item: Omit<ReadingItem, "id" | "addedAt" | "finishedAt">): void {
  const now = Date.now();
  store.write([
    {
      ...item,
      id: `${now}-${Math.random().toString(36).slice(2, 8)}`,
      addedAt: now,
      finishedAt: item.status === "done" ? now : undefined,
    },
    ...store.read(),
  ]);
}

export function setStatus(id: string, status: ReadingStatus): void {
  store.write(
    store.read().map((item) =>
      item.id === id
        ? { ...item, status, finishedAt: status === "done" ? Date.now() : undefined }
        : item,
    ),
  );
}

/** ASIC's suggested reading for the exam (exam preparation guidance v6.0). */
export const SUGGESTED = suggested as { title: string; author: string; kind: ReadingKind; topic: Topic }[];

/** Adds any suggested items not already in the log, as "to read". Returns how many were added. */
export function addSuggested(): number {
  const items = store.read();
  const have = new Set(items.map((i) => i.title));
  const now = Date.now();
  const fresh: ReadingItem[] = SUGGESTED.filter((s) => !have.has(s.title)).map((s, n) => ({
    ...s,
    id: `${now}-asic-${n}`,
    status: "to-read",
    addedAt: now,
  }));
  if (fresh.length) store.write([...items, ...fresh]);
  return fresh.length;
}

export function removeItem(id: string): void {
  store.write(store.read().filter((item) => item.id !== id));
}
