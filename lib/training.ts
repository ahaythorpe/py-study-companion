import { createStore } from "./storage";

export type TrainingCategory = "technical" | "client-care";

// Structured training targets for the Professional Year. Check these against
// ASIC's current requirements and your licensee's PY plan.
export const TARGETS: { id: TrainingCategory; label: string; hours: number }[] = [
  { id: "technical", label: "Technical competence", hours: 70 },
  { id: "client-care", label: "Client care and practice", hours: 30 },
];
export const TOTAL_TARGET = TARGETS.reduce((sum, t) => sum + t.hours, 0);

export const ACTIVITY_TYPES = [
  "Course or module",
  "Workshop or webinar",
  "Supervisor session",
  "Reading",
  "Other",
] as const;
export type ActivityType = (typeof ACTIVITY_TYPES)[number];

export type TrainingEntry = {
  id: string;
  date: string; // YYYY-MM-DD
  title: string;
  category: TrainingCategory;
  type: ActivityType;
  hours: number;
  quarter?: 1 | 2 | 3 | 4;
  provider?: string;
  notes?: string;
};

const store = createStore<TrainingEntry[]>("py-training-v1", [], Array.isArray);

export const useTraining = store.useValue;

export function addEntry(entry: Omit<TrainingEntry, "id">): void {
  const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  // Newest date first.
  const next = [{ ...entry, id }, ...store.read()].sort((a, b) => b.date.localeCompare(a.date));
  store.write(next);
}

export function removeEntry(id: string): void {
  store.write(store.read().filter((e) => e.id !== id));
}

export function hoursBy(entries: TrainingEntry[], category: TrainingCategory): number {
  return entries.filter((e) => e.category === category).reduce((sum, e) => sum + e.hours, 0);
}

function csvCell(value: string | number | undefined): string {
  const s = String(value ?? "");
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

/** A spreadsheet-friendly copy to share with a supervisor. */
export function toCsv(entries: TrainingEntry[]): string {
  const header = ["Date", "Quarter", "Activity", "Category", "Type", "Provider", "Hours", "Notes"];
  const label = (c: TrainingCategory) => TARGETS.find((t) => t.id === c)?.label ?? c;
  const rows = [...entries]
    .sort((a, b) => a.date.localeCompare(b.date))
    .map((e) => [e.date, e.quarter, e.title, label(e.category), e.type, e.provider, e.hours, e.notes]);
  return [header, ...rows].map((row) => row.map(csvCell).join(",")).join("\n");
}
