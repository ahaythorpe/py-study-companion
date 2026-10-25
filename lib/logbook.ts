import { createStore } from "./storage";

// Professional year rules, from ASIC's "Professional year" page and INFO 297
// (FAQs: Professional year), which summarise the Corporations (Work and Training
// Professional Year Standard) Determination 2018.
export const WORK_HOURS_REQUIRED = 1500;
export const TRAINING_HOURS_REQUIRED = 100;
export const DILEMMAS_PER_QUARTER = 2; // in each of quarters 3 and 4

export type Quarter = 1 | 2 | 3 | 4;
export const QUARTERS: Quarter[] = [1, 2, 3, 4];

export const QUARTER_INFO: Record<Quarter, { supervision: string; activities: string }> = {
  1: {
    supervision: "Direct supervision",
    activities:
      "Shadow your supervisor in client meetings, do post-meeting documentation and follow-up, discuss advice strategies, help with admin.",
  },
  2: {
    supervision: "Direct supervision",
    activities:
      "Prepare for and conduct client meetings, draft advice documents including SOAs, complete admin.",
  },
  3: {
    supervision: "Indirect supervision",
    activities:
      "Model strategies and research products, prepare SOAs, complete admin, resolve at least 2 ethical dilemmas.",
  },
  4: {
    supervision: "Indirect supervision",
    activities:
      "As for Q3, resolve at least 2 more ethical dilemmas, and reach the Determination's outcomes and key competencies.",
  },
};

export type EntryType = "work" | "training" | "dilemma" | "notification";

export const ENTRY_TYPES: { id: EntryType; label: string; hint: string }[] = [
  { id: "work", label: "Work activity", hint: "Counts toward the 1,500 work hours." },
  {
    id: "training",
    label: "Structured training",
    hint: "Counts toward the 100 training hours. Must be separate from work, done during your PY, and not the exam.",
  },
  {
    id: "dilemma",
    label: "Ethical dilemma",
    hint: "Real or fictional. Show how you applied the Code of Ethics. Hours count as work.",
  },
  {
    id: "notification",
    label: "Client notification",
    hint: "Record when your licensee told a retail client you're doing supervised work and training.",
  },
];

export const WORK_CATEGORIES = [
  "Shadowing client meetings",
  "Post-meeting documentation and follow-up",
  "Discussing advice strategies with supervisor",
  "Preparing for client meetings",
  "Conducting client meetings",
  "Drafting SOAs and advice documents",
  "Strategy modelling and product research",
  "Administration and back office",
  "Other work activity",
];

// The three kinds of structured training in s11(1) of the PY Determination.
export const TRAINING_KINDS = [
  "Training by supervisor or licensee",
  "Qualifications Determination course or unit",
  "Professional association course",
];

export type LogEntry = {
  id: string;
  date: string; // YYYY-MM-DD
  quarter: Quarter;
  type: EntryType;
  category: string;
  title: string;
  hours: number; // 0 for notifications
  provider?: string;
  details?: string; // what you did / how you resolved the dilemma
  standards?: string; // Code of Ethics standards applied (dilemmas)
};

export type QuarterRecord = {
  start?: string;
  end?: string;
  certificateDate?: string; // supervisor's completion certificate
  logbookConfirmedDate?: string; // supervisor's written confirmation
};

export type PySetup = {
  startDate?: string;
  basis: "full-time" | "part-time";
  supervisorName?: string;
  supervisorContact?: string;
  licensee?: string;
  planAgreedDate?: string;
  qualificationsMet: boolean;
  examBookedDate?: string;
  examPassedDate?: string;
  authorisedDate?: string; // licensee authorisation as provisional relevant provider
  quarters: Record<Quarter, QuarterRecord>;
  finalSupervisorCertDate?: string;
  finalLicenseeCertDate?: string;
};

export type Logbook = { setup: PySetup; entries: LogEntry[] };

export const EMPTY_LOGBOOK: Logbook = {
  setup: { basis: "full-time", qualificationsMet: false, quarters: { 1: {}, 2: {}, 3: {}, 4: {} } },
  entries: [],
};

const store = createStore<Logbook>(
  "py-logbook-v1",
  EMPTY_LOGBOOK,
  (v) => typeof v === "object" && v !== null && "setup" in v && "entries" in v,
);

export const useLogbook = store.useValue;

/** Carry over entries from the earlier simple training log, once. */
export function migrateOldTrainingLog(): void {
  try {
    const raw = window.localStorage.getItem("py-training-v1");
    if (!raw) return;
    const old = JSON.parse(raw) as {
      id: string;
      date: string;
      title: string;
      type: string;
      hours: number;
      quarter?: Quarter;
      provider?: string;
      notes?: string;
    }[];
    const book = store.read();
    const migrated: LogEntry[] = old.map((e) => ({
      id: e.id,
      date: e.date,
      quarter: e.quarter ?? 1,
      type: "training",
      category: "Not yet categorised",
      title: `${e.title} (${e.type})`,
      hours: e.hours,
      provider: e.provider,
      details: e.notes,
    }));
    store.write({ ...book, entries: sortEntries([...migrated, ...book.entries]) });
    window.localStorage.removeItem("py-training-v1");
  } catch {
    // Nothing usable to migrate.
  }
}

function sortEntries(entries: LogEntry[]): LogEntry[] {
  return [...entries].sort((a, b) => b.date.localeCompare(a.date));
}

export function saveSetup(setup: PySetup): void {
  store.write({ ...store.read(), setup });
}

export function addEntry(entry: Omit<LogEntry, "id">): void {
  const book = store.read();
  const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  store.write({ ...book, entries: sortEntries([{ ...entry, id }, ...book.entries]) });
}

export function removeEntry(id: string): void {
  const book = store.read();
  store.write({ ...book, entries: book.entries.filter((e) => e.id !== id) });
}

/** Training before the PY started doesn't count (INFO 297). */
export function trainingCounts(entry: LogEntry, setup: PySetup): boolean {
  return entry.type === "training" && (!setup.startDate || entry.date >= setup.startDate);
}

/** Local date as YYYY-MM-DD. */
export function today(): string {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export function formatDate(date: string | undefined): string {
  return date ? new Date(`${date}T00:00:00`).toLocaleDateString("en-AU") : "";
}

export function addYears(date: string, years: number): string {
  const [y, m, d] = date.split("-").map(Number);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${y + years}-${pad(m)}-${pad(d)}`;
}

export function summarise({ setup, entries }: Logbook) {
  const workHours = entries
    .filter((e) => e.type === "work" || e.type === "dilemma")
    .reduce((sum, e) => sum + e.hours, 0);
  const countedTraining = entries.filter((e) => trainingCounts(e, setup));
  const trainingHours = countedTraining.reduce((sum, e) => sum + e.hours, 0);
  const excludedTraining = entries.filter((e) => e.type === "training" && !trainingCounts(e, setup));
  const dilemmas = (q: Quarter) => entries.filter((e) => e.type === "dilemma" && e.quarter === q).length;
  const hoursIn = (q: Quarter) => entries.filter((e) => e.quarter === q).reduce((s, e) => s + e.hours, 0);
  const q = setup.quarters;

  // Minimum length is one year, even if Q1 and Q2 are accelerated.
  const earliestFinish = setup.startDate ? addYears(setup.startDate, 1) : undefined;
  const fullTime = setup.basis === "full-time";

  const milestones: { label: string; done: boolean; detail?: string }[] = [
    { label: "PY plan agreed with supervisor and licensee", done: !!setup.planAgreedDate },
    { label: "Q1 completion certificate", done: !!q[1].certificateDate },
    { label: "Q2 completion certificate", done: !!q[2].certificateDate },
    { label: "Qualifications standard met", done: setup.qualificationsMet, detail: "Needed before Q3" },
    { label: "Financial adviser exam passed", done: !!setup.examPassedDate, detail: "Needed before Q3" },
    {
      label: "Authorised by licensee as provisional relevant provider",
      done: !!setup.authorisedDate,
      detail: "Needed before Q3. Licensee appoints you on the FAR within 30 business days",
    },
    {
      label: `Q3 certificate, with ${DILEMMAS_PER_QUARTER}+ ethical dilemmas`,
      done: !!q[3].certificateDate && dilemmas(3) >= DILEMMAS_PER_QUARTER,
      detail: `${dilemmas(3)} dilemma${dilemmas(3) === 1 ? "" : "s"} logged in Q3`,
    },
    {
      label: `Q4 certificate, with ${DILEMMAS_PER_QUARTER}+ ethical dilemmas`,
      done: !!q[4].certificateDate && dilemmas(4) >= DILEMMAS_PER_QUARTER,
      detail: `${dilemmas(4)} dilemma${dilemmas(4) === 1 ? "" : "s"} logged in Q4`,
    },
    {
      label: `${WORK_HOURS_REQUIRED.toLocaleString()} work hours and ${TRAINING_HOURS_REQUIRED} training hours`,
      done: workHours >= WORK_HOURS_REQUIRED && trainingHours >= TRAINING_HOURS_REQUIRED,
    },
    {
      label: "At least one year since starting",
      done: !!earliestFinish && today() >= earliestFinish,
      detail: earliestFinish
        ? `Earliest finish ${formatDate(earliestFinish)}${fullTime ? "" : " (part-time takes longer)"}`
        : "Set your start date",
    },
    {
      label: "Final certificates from supervisor and licensee",
      done: !!setup.finalSupervisorCertDate && !!setup.finalLicenseeCertDate,
      detail: "Licensee audits at least 5 of your client files first",
    },
  ];

  const q3Ready = milestones.slice(1, 6).every((m) => m.done);

  return {
    workHours,
    trainingHours,
    excludedTraining,
    dilemmas,
    hoursIn,
    earliestFinish,
    milestones,
    q3Ready,
  };
}

/** The quarter you're most likely logging for: the first without a certificate. */
export function currentQuarter(setup: PySetup): Quarter {
  return QUARTERS.find((q) => !setup.quarters[q].certificateDate) ?? 4;
}

function csvCell(value: string | number | undefined): string {
  const s = String(value ?? "");
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

/** Spreadsheet copy of the logbook to share with a supervisor. */
export function toCsv(book: Logbook): string {
  const { setup } = book;
  const label = (t: EntryType) => ENTRY_TYPES.find((x) => x.id === t)?.label ?? t;
  const meta = [
    ["PY start date", setup.startDate],
    ["Basis", setup.basis],
    ["Primary supervisor", setup.supervisorName],
    ["Supervisor contact", setup.supervisorContact],
    ["Responsible licensee", setup.licensee],
    ["Exam passed", setup.examPassedDate],
    [],
  ];
  const header = ["Date", "Quarter", "Type", "Category", "Activity", "Hours", "Provider", "Details", "Code standards", "Counts toward minimum"];
  const rows = [...book.entries]
    .sort((a, b) => a.date.localeCompare(b.date))
    .map((e) => [
      e.date,
      `Q${e.quarter}`,
      label(e.type),
      e.category,
      e.title,
      e.hours,
      e.provider,
      e.details,
      e.standards,
      e.type === "notification" ? "n/a" : e.type === "training" && !trainingCounts(e, setup) ? "No (before PY start)" : "Yes",
    ]);
  return [...meta, header, ...rows].map((row) => row.map(csvCell).join(",")).join("\n");
}
