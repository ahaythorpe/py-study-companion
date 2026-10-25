import type { Metadata } from "next";
import Link from "next/link";
import { btnGhost, btnPrimary, h1, intro, panel } from "@/components/ui";

export const metadata: Metadata = { title: "Practice questions · PY Study Companion" };

const ASIC_EXAM = "https://www.asic.gov.au/regulatory-resources/financial-services/financial-advice/professional-standards/financial-adviser-exam";

const PRACTICE_PDF =
  "https://download.asic.gov.au/media/gqahkobx/financial-adviser-exam-practice-question-guidance-published-17-july-2024-20240726.pdf";
const GUIDE_PDF =
  "https://download.asic.gov.au/media/p1pleaco/financial-adviser-exam-exam-preparation-guidance-v6-published-29-sept-2026.pdf";

const OFFICIAL: { title: string; url: string; note: string; tag: string }[] = [
  {
    title: "ASIC: Financial adviser exam practice question guidance (v16.1, July 2024)",
    url: PRACTICE_PDF,
    note: "The official practice questions: client scenarios with multiple choice and true/false questions. Answers are in the appendix from page 30. Free PDF.",
    tag: "Questions and answers",
  },
  {
    title: "ACER: online practice questions (candidate account)",
    url: "https://fae.acer.org/",
    note: "The online version of the practice questions, in the same exam interface you'll use on the day. Log in to the ACER account you registered with (see purchases).",
    tag: "Exam interface",
  },
  {
    title: "ASIC: Resources for the financial adviser exam",
    url: `${ASIC_EXAM}/resources-financial-adviser-exam`,
    note: "Check here for the latest version of the practice questions, plus the candidate booklet, exam policy and remote proctoring guide.",
    tag: "Latest versions",
  },
  {
    title: "ASIC: Exam preparation guidance (v6.0, September 2026)",
    url: GUIDE_PDF,
    note: "Curriculum, reading list and exam technique. The Exam prep page in this app summarises it.",
    tag: "Guidance",
  },
  {
    title: "ASIC: Book to sit the exam",
    url: `${ASIC_EXAM}/book-to-sit-the-exam`,
    note: "Sitting dates, booking windows and fees.",
    tag: "Booking",
  },
  {
    title: "ASIC: FAQs, Financial adviser exam",
    url: `${ASIC_EXAM}/faqs-financial-adviser-exam`,
    note: "How the pass mark is set, results, resits and special consideration.",
    tag: "FAQs",
  },
];

const HOW = [
  "Do the full PDF once, early, without notes, to find your weak areas. Don't look at the answers until you've finished.",
  "Mark it, then for every question you got wrong, find the provision or Code standard that decides it and write a card for it in your own words.",
  "Close to the exam, sit the ACER online version in one timed session so the interface and the navigation bar feel familiar.",
  "Questions come in client scenarios, with several questions on the same facts. Read the scenario once for the story and again for the detail each question needs.",
  "Pick the best answer. When more than one option looks right, choose the one that most directly answers what's asked.",
];

export default function PracticePage() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className={h1}>Practice questions</h1>
        <p className={intro}>
          Links to the official practice questions from ASIC and ACER, and how to get the most out of them.
        </p>
      </div>

      <p className={`${panel} border-warn p-4 text-sm leading-relaxed`}>
        <span className="font-semibold text-warn">Check the date. </span>
        The practice question PDF was last updated in July 2024, before the Delivering Better Financial
        Outcomes changes of 10 January 2025 (ongoing fee consents, FSGs) and the AML/CTF reforms of 2025 and 2026.
        If an answer about those areas looks off, check it against the current law.
      </p>

      <section className={`${panel} space-y-3 p-5`}>
        <h2 className="font-semibold">Downloads</h2>
        <p className="text-sm leading-relaxed text-muted">
          Save these to read offline, or upload them to an AI assistant as study material. The study pack
          is every question in this app with its answer, explanation and source, plus the reading list,
          as one Markdown file.
        </p>
        <div className="flex flex-wrap gap-3">
          <a href="/study-pack" download="py-study-pack.md" className={btnPrimary}>
            Study pack (.md)
          </a>
          <a href={PRACTICE_PDF} download target="_blank" rel="noopener noreferrer" className={btnGhost}>
            ASIC practice questions (PDF)
          </a>
          <a href={GUIDE_PDF} download target="_blank" rel="noopener noreferrer" className={btnGhost}>
            ASIC exam guidance (PDF)
          </a>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">Official practice</h2>
        <ul className="space-y-3">
          {OFFICIAL.map((r) => (
            <li key={r.url}>
              <a
                href={r.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`${panel} block p-5 transition-colors hover:border-accent`}
              >
                <p className="flex flex-wrap items-baseline gap-x-2 font-medium">
                  <span>
                    {r.title} <span className="text-muted">↗</span>
                  </span>
                  <span className="rounded-full bg-accent-soft px-2 py-0.5 text-xs font-normal text-accent">{r.tag}</span>
                </p>
                <p className="mt-1 text-sm text-muted">{r.note}</p>
              </a>
            </li>
          ))}
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">How to use them</h2>
        <ol className={`${panel} list-decimal space-y-2 py-5 pr-5 pl-9 text-[15px] leading-[1.55]`}>
          {HOW.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ol>
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">Practise in this app</h2>
        <div className="flex flex-wrap gap-3 text-sm">
          <Link href="/quiz/mixed" className={`${panel} px-4 py-3 font-medium hover:border-accent`}>
            Exam-style mixed practice →
          </Link>
          <Link href="/quiz/weak" className={`${panel} px-4 py-3 font-medium hover:border-accent`}>
            Weak questions →
          </Link>
          <Link href="/prepare" className={`${panel} px-4 py-3 font-medium hover:border-accent`}>
            Study plan and reading list →
          </Link>
        </div>
      </section>
    </div>
  );
}
