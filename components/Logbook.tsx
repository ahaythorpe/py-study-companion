"use client";

import { useEffect, useState } from "react";
import {
  DILEMMAS_PER_QUARTER,
  ENTRY_TYPES,
  QUARTERS,
  QUARTER_INFO,
  TRAINING_HOURS_REQUIRED,
  TRAINING_KINDS,
  WORK_CATEGORIES,
  WORK_HOURS_REQUIRED,
  addEntry,
  currentQuarter,
  formatDate,
  migrateOldTrainingLog,
  removeEntry,
  saveSetup,
  summarise,
  toCsv,
  today,
  trainingCounts,
  useLogbook,
  type EntryType,
  type LogEntry,
  type Logbook as LogbookData,
  type PySetup,
  type Quarter,
} from "@/lib/logbook";
import { btnGhost, btnPrimary, field, panel } from "./ui";

type Tab = "overview" | "log" | "setup";

const round = (n: number) => Math.round(n * 100) / 100;

export function Logbook() {
  const book = useLogbook();
  const [tab, setTab] = useState<Tab>("overview");

  useEffect(() => {
    migrateOldTrainingLog();
  }, []);

  if (book === null) return <p className="text-muted">Loading…</p>;

  const tabs: { id: Tab; label: string }[] = [
    { id: "overview", label: "Overview" },
    { id: "log", label: `Log (${book.entries.length})` },
    { id: "setup", label: "Setup" },
  ];

  return (
    <div className="space-y-6">
      <div role="tablist" className="flex gap-1 rounded-xl border border-line bg-surface p-1 sm:w-fit">
        {tabs.map((t) => (
          <button
            key={t.id}
            role="tab"
            type="button"
            aria-selected={tab === t.id}
            onClick={() => setTab(t.id)}
            className="flex-1 rounded-lg px-4 py-2 text-sm font-medium text-muted hover:text-foreground aria-selected:bg-accent-soft aria-selected:text-accent sm:flex-none"
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "overview" && <Overview book={book} onSetup={() => setTab("setup")} />}
      {tab === "log" && <Log book={book} />}
      {tab === "setup" && <Setup setup={book.setup} onSaved={() => setTab("overview")} />}
    </div>
  );
}

/* ---------- Overview ---------- */

function Overview({ book, onSetup }: { book: LogbookData; onSetup: () => void }) {
  const s = summarise(book);
  const { setup } = book;
  const q3Started = book.entries.some((e) => e.quarter >= 3);

  return (
    <div className="space-y-6">
      {!setup.startDate && (
        <div className={`${panel} flex flex-wrap items-center justify-between gap-4 p-5`}>
          <div>
            <h2 className="font-semibold">Set up your Professional Year</h2>
            <p className="text-sm text-muted">
              Add your start date, supervisor and licensee so the checklist and dates work.
            </p>
          </div>
          <button type="button" onClick={onSetup} className={btnPrimary}>
            Set up
          </button>
        </div>
      )}

      {q3Started && !s.q3Ready && (
        <div className="rounded-[14px] border border-warn/30 bg-warn-soft p-4 text-sm text-warn">
          You have Q3 or Q4 entries, but not every requirement for starting Q3 is ticked below. Before
          Q3 you need both Q1 and Q2 certificates, the qualifications standard, a passed exam, and
          licensee authorisation.
        </div>
      )}

      <section className={`${panel} space-y-4 p-5`}>
        <Bar label="Work activities" hours={s.workHours} target={WORK_HOURS_REQUIRED} strong />
        <Bar label="Structured training" hours={s.trainingHours} target={TRAINING_HOURS_REQUIRED} strong />
        {s.excludedTraining.length > 0 && (
          <p className="text-xs text-warn">
            {s.excludedTraining.length} training {s.excludedTraining.length === 1 ? "entry is" : "entries are"} dated
            before your PY start date and {s.excludedTraining.length === 1 ? "doesn't" : "don't"} count.
          </p>
        )}
        <p className="text-xs text-muted">
          At least {WORK_HOURS_REQUIRED.toLocaleString()} hours of work and {TRAINING_HOURS_REQUIRED} hours of structured
          training over at least one year. No minimum per quarter. The exam doesn&apos;t count as training.
        </p>
      </section>

      <section className="grid gap-4 sm:grid-cols-2">
        {QUARTERS.map((q) => {
          const rec = setup.quarters[q];
          const dilemmas = s.dilemmas(q);
          return (
            <div key={q} className={`${panel} space-y-3 p-5`}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-semibold">Quarter {q}</h3>
                  <p className="text-xs text-muted">
                    {QUARTER_INFO[q].supervision}
                    {rec.start && ` · ${formatDate(rec.start)}–${formatDate(rec.end) || "?"}`}
                  </p>
                </div>
                {rec.certificateDate ? (
                  <span className="rounded-full bg-good-soft px-2.5 py-0.5 text-xs font-semibold text-good">
                    Certified
                  </span>
                ) : (
                  <span className="rounded-full bg-surface-2 px-2.5 py-0.5 text-xs font-medium text-muted">
                    In progress
                  </span>
                )}
              </div>
              <p className="text-sm text-muted">{QUARTER_INFO[q].activities}</p>
              <div className="flex flex-wrap gap-x-5 gap-y-1 text-sm">
                <span>
                  <strong className="tabular-nums">{round(s.hoursIn(q))}</strong> h logged
                </span>
                {q >= 3 && (
                  <span className={dilemmas >= DILEMMAS_PER_QUARTER ? "text-good" : ""}>
                    <strong className="tabular-nums">{dilemmas}</strong> / {DILEMMAS_PER_QUARTER} ethical dilemmas
                  </span>
                )}
                {rec.logbookConfirmedDate && <span className="text-good">Logbook confirmed</span>}
              </div>
            </div>
          );
        })}
      </section>

      <section className={`${panel} overflow-hidden`}>
        <h2 className="border-b border-divider px-5 py-4 font-semibold">Milestones</h2>
        <ul>
          {s.milestones.map((m) => (
            <li key={m.label} className="flex items-start gap-3 px-5 py-3 [&+&]:border-t [&+&]:border-divider">
              <span
                className={`mt-0.5 flex size-5 flex-none items-center justify-center rounded-full text-xs font-bold ${
                  m.done ? "bg-good text-white" : "border-2 border-line-strong"
                }`}
                aria-label={m.done ? "Done" : "Not done"}
              >
                {m.done && "✓"}
              </span>
              <div>
                <p className={`text-sm ${m.done ? "text-muted" : "font-medium"}`}>{m.label}</p>
                {m.detail && <p className="text-xs text-muted">{m.detail}</p>}
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

function Bar({ label, hours, target, strong }: { label: string; hours: number; target: number; strong?: boolean }) {
  const pct = Math.min(100, (hours / target) * 100);
  const met = hours >= target;
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between gap-3 text-sm">
        <span className={strong ? "font-semibold" : "text-muted"}>{label}</span>
        <span className="font-medium tabular-nums">
          {round(hours).toLocaleString()} / {target.toLocaleString()} h
          {met && <span className="ml-1.5 text-good">✓ met</span>}
        </span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-track">
        <div className={`h-full rounded-full ${met ? "bg-good" : "bg-accent"}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

/* ---------- Log ---------- */

function Log({ book }: { book: LogbookData }) {
  const [quarter, setQuarter] = useState<Quarter | "all">("all");
  const [type, setType] = useState<EntryType | "all">("all");
  const shown = book.entries.filter(
    (e) => (quarter === "all" || e.quarter === quarter) && (type === "all" || e.type === type),
  );

  function download() {
    const blob = new Blob([toCsv(book)], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `py-logbook-${today()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-6">
      <AddEntry setup={book.setup} />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          <select
            value={quarter}
            onChange={(e) => setQuarter(e.target.value === "all" ? "all" : (Number(e.target.value) as Quarter))}
            className="rounded-lg border border-line-strong bg-surface px-3 py-2 text-sm"
            aria-label="Filter by quarter"
          >
            <option value="all">All quarters</option>
            {QUARTERS.map((q) => (
              <option key={q} value={q}>
                Q{q}
              </option>
            ))}
          </select>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as EntryType | "all")}
            className="rounded-lg border border-line-strong bg-surface px-3 py-2 text-sm"
            aria-label="Filter by type"
          >
            <option value="all">All types</option>
            {ENTRY_TYPES.map((t) => (
              <option key={t.id} value={t.id}>
                {t.label}
              </option>
            ))}
          </select>
        </div>
        {book.entries.length > 0 && (
          <button type="button" onClick={download} className={btnGhost}>
            Download CSV
          </button>
        )}
      </div>

      {shown.length === 0 ? (
        <p className={`${panel} p-8 text-center text-sm text-muted`}>
          {book.entries.length === 0 ? "Nothing logged yet. Add your first entry above." : "No entries match."}
        </p>
      ) : (
        <ul className="space-y-3">
          {shown.map((e) => (
            <Entry key={e.id} entry={e} counts={e.type !== "training" || trainingCounts(e, book.setup)} />
          ))}
        </ul>
      )}
    </div>
  );
}

function AddEntry({ setup }: { setup: PySetup }) {
  const [open, setOpen] = useState(false);
  const [type, setType] = useState<EntryType>("work");
  const [defaults] = useState(() => ({ date: today(), quarter: currentQuarter(setup) }));

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="w-full rounded-[14px] border-2 border-dashed border-line-strong px-4 py-3 font-medium text-muted hover:border-accent hover:text-accent"
      >
        + Add logbook entry
      </button>
    );
  }

  const hint = ENTRY_TYPES.find((t) => t.id === type)?.hint;
  const categories = type === "work" ? WORK_CATEGORIES : type === "training" ? TRAINING_KINDS : null;

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const text = (name: string) => String(form.get(name) ?? "").trim() || undefined;
    const title = text("title");
    const hours = type === "notification" ? 0 : Number(form.get("hours"));
    if (!title || (type !== "notification" && !(hours > 0))) return;
    addEntry({
      date: text("date") ?? today(),
      quarter: Number(form.get("quarter")) as Quarter,
      type,
      category:
        text("category") ??
        (type === "dilemma" ? "Ethical dilemma" : type === "notification" ? "Retail client notification" : ""),
      title,
      hours,
      provider: text("provider"),
      details: text("details"),
      standards: text("standards"),
    });
    setOpen(false);
  }

  return (
    <form onSubmit={submit} className={`${panel} space-y-4 p-5`}>
      <div className="grid grid-cols-2 gap-1 rounded-xl bg-surface-2 p-1 sm:grid-cols-4">
        {ENTRY_TYPES.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setType(t.id)}
            className={`rounded-lg px-3 py-2 text-sm font-medium ${
              type === t.id ? "bg-surface text-accent shadow-sm" : "text-muted hover:text-foreground"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>
      <p className="text-xs text-muted">{hint}</p>

      <input
        name="title"
        required
        autoFocus
        className={field}
        placeholder={
          type === "dilemma"
            ? "Dilemma, e.g. Client asks to switch super against their interests"
            : type === "notification"
              ? "Client, e.g. J. Smith (initials only)"
              : "What you did, e.g. Drafted SOA for retirement strategy"
        }
      />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <input name="date" type="date" defaultValue={defaults.date} className={field} aria-label="Date" />
        <select name="quarter" defaultValue={defaults.quarter} className={field} aria-label="Quarter">
          {QUARTERS.map((q) => (
            <option key={q} value={q}>
              Quarter {q}
            </option>
          ))}
        </select>
        {type !== "notification" && (
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
        )}
      </div>
      {categories && (
        <select name="category" defaultValue={categories[0]} className={field} aria-label="Category">
          {categories.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
      )}
      {type === "training" && <input name="provider" placeholder="Provider (e.g. licensee, university, FAAA)" className={field} />}
      {type === "dilemma" && (
        <input name="standards" placeholder="Code of Ethics standards applied (e.g. 2, 3, 6)" className={field} />
      )}
      <textarea
        name="details"
        rows={3}
        className={field}
        placeholder={
          type === "dilemma"
            ? "The issue, options considered, and how you resolved it"
            : "Details (optional). Don't include client names or personal information."
        }
      />
      <div className="flex gap-2">
        <button type="submit" className={btnPrimary}>
          Save
        </button>
        <button type="button" onClick={() => setOpen(false)} className={btnGhost}>
          Cancel
        </button>
      </div>
    </form>
  );
}

function Entry({ entry, counts }: { entry: LogEntry; counts: boolean }) {
  const [confirming, setConfirming] = useState(false);
  const typeLabel = ENTRY_TYPES.find((t) => t.id === entry.type)?.label;
  const badge: Record<EntryType, string> = {
    work: "bg-accent-soft text-accent",
    training: "bg-good-soft text-good",
    dilemma: "bg-warn-soft text-warn",
    notification: "bg-surface-2 text-muted",
  };

  return (
    <li className={`${panel} space-y-2 p-4`}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="font-medium">{entry.title}</p>
          <p className="text-xs text-muted">
            {[formatDate(entry.date), `Q${entry.quarter}`, entry.category, entry.provider].filter(Boolean).join(" · ")}
          </p>
        </div>
        {entry.type !== "notification" && <span className="shrink-0 font-semibold tabular-nums">{entry.hours} h</span>}
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${badge[entry.type]}`}>{typeLabel}</span>
        {entry.standards && <span className="text-xs text-muted">Standards: {entry.standards}</span>}
        {!counts && <span className="text-xs text-warn">Before PY start, doesn&apos;t count</span>}
      </div>
      {entry.details && <p className="whitespace-pre-line text-sm">{entry.details}</p>}
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

/* ---------- Setup ---------- */

function Setup({ setup, onSaved }: { setup: PySetup; onSaved: () => void }) {
  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const text = (name: string) => String(form.get(name) ?? "").trim() || undefined;
    const quarters = Object.fromEntries(
      QUARTERS.map((q) => [
        q,
        {
          start: text(`q${q}-start`),
          end: text(`q${q}-end`),
          certificateDate: text(`q${q}-cert`),
          logbookConfirmedDate: text(`q${q}-confirmed`),
        },
      ]),
    ) as PySetup["quarters"];
    saveSetup({
      startDate: text("startDate"),
      basis: form.get("basis") === "part-time" ? "part-time" : "full-time",
      supervisorName: text("supervisorName"),
      supervisorContact: text("supervisorContact"),
      licensee: text("licensee"),
      planAgreedDate: text("planAgreedDate"),
      qualificationsMet: form.get("qualificationsMet") === "on",
      examBookedDate: text("examBookedDate"),
      examPassedDate: text("examPassedDate"),
      authorisedDate: text("authorisedDate"),
      quarters,
      finalSupervisorCertDate: text("finalSupervisorCertDate"),
      finalLicenseeCertDate: text("finalLicenseeCertDate"),
    });
    onSaved();
  }

  return (
    <form onSubmit={submit} className="space-y-6">
      <Fieldset title="Your Professional Year">
        <Field label="PY start date">
          <input name="startDate" type="date" defaultValue={setup.startDate} className={field} />
        </Field>
        <Field label="Basis">
          <select name="basis" defaultValue={setup.basis} className={field}>
            <option value="full-time">Full-time</option>
            <option value="part-time">Part-time</option>
          </select>
        </Field>
        <Field label="PY plan agreed">
          <input name="planAgreedDate" type="date" defaultValue={setup.planAgreedDate} className={field} />
        </Field>
      </Fieldset>

      <Fieldset title="Supervisor and licensee">
        <Field label="Primary supervisor">
          <input name="supervisorName" defaultValue={setup.supervisorName} className={field} />
        </Field>
        <Field label="Supervisor contact">
          <input name="supervisorContact" defaultValue={setup.supervisorContact} className={field} placeholder="Email or phone" />
        </Field>
        <Field label="Responsible licensee">
          <input name="licensee" defaultValue={setup.licensee} className={field} />
        </Field>
      </Fieldset>

      <Fieldset title="Before Quarter 3">
        <Field label="Exam booked for">
          <input name="examBookedDate" type="date" defaultValue={setup.examBookedDate} className={field} />
        </Field>
        <Field label="Exam passed">
          <input name="examPassedDate" type="date" defaultValue={setup.examPassedDate} className={field} />
        </Field>
        <Field label="Authorised by licensee">
          <input name="authorisedDate" type="date" defaultValue={setup.authorisedDate} className={field} />
        </Field>
        <label className="flex items-center gap-2 text-sm sm:col-span-3">
          <input name="qualificationsMet" type="checkbox" defaultChecked={setup.qualificationsMet} className="size-4 accent-accent" />
          I&apos;ve met the qualifications standard (approved degree)
        </label>
      </Fieldset>

      {QUARTERS.map((q) => (
        <Fieldset key={q} title={`Quarter ${q}`} columns={4}>
          <Field label="Start">
            <input name={`q${q}-start`} type="date" defaultValue={setup.quarters[q].start} className={field} />
          </Field>
          <Field label="End">
            <input name={`q${q}-end`} type="date" defaultValue={setup.quarters[q].end} className={field} />
          </Field>
          <Field label="Completion certificate">
            <input name={`q${q}-cert`} type="date" defaultValue={setup.quarters[q].certificateDate} className={field} />
          </Field>
          <Field label="Logbook confirmed">
            <input name={`q${q}-confirmed`} type="date" defaultValue={setup.quarters[q].logbookConfirmedDate} className={field} />
          </Field>
        </Fieldset>
      ))}

      <Fieldset title="Final completion">
        <Field label="Supervisor's final certificate">
          <input name="finalSupervisorCertDate" type="date" defaultValue={setup.finalSupervisorCertDate} className={field} />
        </Field>
        <Field label="Licensee's final certificate">
          <input name="finalLicenseeCertDate" type="date" defaultValue={setup.finalLicenseeCertDate} className={field} />
        </Field>
      </Fieldset>

      <button type="submit" className={btnPrimary}>
        Save setup
      </button>
    </form>
  );
}

function Fieldset({ title, columns = 3, children }: { title: string; columns?: 3 | 4; children: React.ReactNode }) {
  return (
    <fieldset className={`${panel} p-5`}>
      <legend className="sr-only">{title}</legend>
      <h2 className="mb-4 font-semibold">{title}</h2>
      <div className={`grid gap-3 sm:grid-cols-2 ${columns === 4 ? "lg:grid-cols-4" : "lg:grid-cols-3"}`}>
        {children}
      </div>
    </fieldset>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="space-y-1">
      <span className="text-xs font-medium text-muted">{label}</span>
      {children}
    </label>
  );
}
