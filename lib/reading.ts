import { createStore } from "./storage";
import type { Topic } from "./types";

export type ReadingKind = "book" | "article" | "course" | "podcast";
export type ReadingStatus = "to-read" | "reading" | "done";

export const KINDS: { id: ReadingKind; label: string }[] = [
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

export function removeItem(id: string): void {
  store.write(store.read().filter((item) => item.id !== id));
}
