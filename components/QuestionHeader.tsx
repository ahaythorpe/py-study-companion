import { ANGLES, type Question } from "@/lib/types";

/** Scenario, quoted law and prompt, shared by every question format. */
export function QuestionHeader({ question }: { question: Question }) {
  return (
    <div className="space-y-4">
      {question.kind === "flashcard" && (
        <span className="inline-block rounded-full bg-accent-soft px-2.5 py-0.5 text-xs font-medium text-accent">
          {ANGLES[question.angle ?? "define"]}
        </span>
      )}
      {question.scenario && <p className="text-[15px] leading-relaxed">{question.scenario}</p>}
      {question.extract && <LawExtract extract={question.extract} />}
      <h2 className="text-xl font-semibold leading-snug tracking-[-0.01em]">{question.prompt}</h2>
    </div>
  );
}

/** Statutory text as the exam provides it: read it, then apply it. */
export function LawExtract({ extract }: { extract: NonNullable<Question["extract"]> }) {
  return (
    <figure className="rounded-[10px] border-l-4 border-accent bg-surface-2 px-4 py-3">
      <figcaption className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-muted">
        Provided law · {extract.cite}
      </figcaption>
      <blockquote className="whitespace-pre-line text-sm leading-relaxed">{extract.text}</blockquote>
    </figure>
  );
}
