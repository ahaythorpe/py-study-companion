import type { Metadata } from "next";
import Link from "next/link";
import reading from "@/data/exam-reading.json";
import { panel } from "@/components/ui";
import { AREAS, TOPICS, type Area } from "@/lib/types";

export const metadata: Metadata = { title: "Exam prep · PY Study Companion" };

type Reading = {
  area: Area;
  tier: "suggested" | "extension";
  title: string;
  focus: string;
  url?: string;
};

const GUIDE_URL =
  "https://download.asic.gov.au/media/p1pleaco/financial-adviser-exam-exam-preparation-guidance-v6-published-29-sept-2026.pdf";
const RESOURCES_URL =
  "https://www.asic.gov.au/regulatory-resources/financial-services/financial-advice/professional-standards/financial-adviser-exam/resources-financial-adviser-exam";

// From ASIC's Financial adviser exam: Exam preparation guidance v6.0 and ACER.
const FORMAT = [
  "3.5 hours, including 15 minutes of reading time.",
  "Selected response only: multiple choice (one of four, one mark each) and true/false.",
  "True/false questions can have several statements. You must get every one right to earn the mark.",
  "No marks are deducted for wrong answers, so answer everything.",
  "The relevant law is quoted in the question (e.g. a section of the Corporations Act or a Code standard). You don't need to memorise section numbers. You do need to apply them.",
  "Pass or fail only. ACER sets the pass mark each sitting by standard setting, starting from a credit range of 65 to 74%.",
  "Practice questions are in your ACER exam account; ASIC publishes the answers in its Practice question guidance.",
];

// Condensed from the curriculum's learning outcomes.
const OUTCOMES: Record<Area, string[]> = {
  regulatory: [
    "Apply Chapter 7 to scenarios and identify provider obligations and breaches.",
    "Apply Chapter 7 to advice documents (FSG, SOA, ROA, PDS) and spot disclosure breaches.",
    "Work out the consequences of a breach for the adviser, the client and the industry, and what must be reported.",
    "Tell apart the obligations of the individual adviser and of the licensee.",
    "Apply AML/CTF and Privacy Act requirements to scenarios.",
    "Know the civil penalty provisions for tax (financial) advice in TASA Subdivision 50-AA.",
  ],
  ethics: [
    "Apply the Code of Ethics to dilemmas and identify compliance, non-compliance and its consequences.",
    "Spot conduct that is lawful under the Corporations Act but breaches the Code.",
    "Apply more than one ethical framework to the same dilemma.",
    "Apply the best interests duty and related obligations, and know when to refer a client.",
    "Identify biases in yourself and your clients, and how they affect advice.",
    "Apply the legal and Code requirements for client files, and explain what due diligence means in practice.",
  ],
  construction: [
    "Understand the context in which advice is sought and given, and how it shapes decisions.",
    "Identify misconduct and inappropriate advice, explain why it's inappropriate, and propose a better course of action.",
    "Compare population and community profiles at a retail client level.",
    "Identify types of consumer behaviour and decision making.",
    "Evaluate and apply advice strategies suitable for different retail clients.",
    "Understand risk, including the difference between risk tolerance and risk capacity.",
  ],
};

const PLAN: { weeks: string; focus: string; read: string; practise: string }[] = [
  {
    weeks: "Weeks 1 to 3",
    focus: "Regulatory and legal obligations",
    read: "Part 7.7A and RG 175 first (best interests and disclosure underpin everything), then Parts 7.6 and 7.7, RG 78, RG 246, INFO 286.",
    practise: "Cards for each regulatory topic until most are 'got it', then the topic quizzes.",
  },
  {
    weeks: "Week 4",
    focus: "AML/CTF, privacy and tax",
    read: "AUSTRAC guidance, the APPs and notifiable data breaches, TPB Info Sheet 20/2014 and INFO 268.",
    practise: "AML/CTF, privacy and tax cards and quiz. Write two scenario questions of your own.",
  },
  {
    weeks: "Weeks 5 to 6",
    focus: "Applied ethics and best interests",
    read: "The Code of Ethics and explanatory statement, FG002, and the Markkula framework.",
    practise: "For each standard, write one scenario that is lawful but breaches the Code. Take the best interests and ethics quizzes.",
  },
  {
    weeks: "Weeks 7 to 8",
    focus: "Advice construction and behavioural finance",
    read: "RG 90, RG 244, INFO 266 and INFO 267 (with the example SOA), and Pompian.",
    practise: "Read the example SOAs and list what makes them compliant. Advice construction and behavioural finance quizzes.",
  },
  {
    weeks: "Weeks 9 to 10",
    focus: "Exam conditions",
    read: "Go back over your notes on your weakest topic.",
    practise: "ACER practice questions under timed conditions, mixed practice daily, and weak questions until none are left.",
  },
];

const METHOD: { title: string; body: string }[] = [
  {
    title: "Read with the law open",
    body: "Because the exam quotes the statute, practise the way you'll be tested: read the scenario, find the obligation in the provided text, then decide whether it was breached. Don't learn section numbers by rote.",
  },
  {
    title: "Recall before you recognise",
    body: "Use cards first and try to answer before you flip. Multiple choice can make you think you know something when you don't.",
  },
  {
    title: "Space it out",
    body: "Little and often beats cramming. This app's Leitner boxes bring missed questions back sooner. Do weak questions every few days.",
  },
  {
    title: "Explain why the wrong options are wrong",
    body: "After each quiz answer, say why each distractor is wrong. Exam distractors use real terms applied to the wrong situation.",
  },
  {
    title: "Write your own questions",
    body: "Turn each reading into two or three scenario questions with a source (see the question guide). Writing them is the studying.",
  },
  {
    title: "Rehearse the exam",
    body: "At least twice, sit ACER's practice questions in one timed session. Answer everything, flag hard questions, and use the navigation bar to come back to them.",
  },
];

export default function PreparePage() {
  const list = reading as Reading[];

  return (
    <div className="space-y-10">
      <div className="space-y-2">
        <h1 className="text-[32px] font-bold leading-tight tracking-[-0.02em]">Exam prep</h1>
        <p className="max-w-[560px] text-[15px] leading-[1.55] text-muted">
          How the ASIC financial adviser exam works, what it tests, a study plan and the full reading list.
          Based on ASIC&apos;s{" "}
          <a href={GUIDE_URL} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">
            Exam preparation guidance v6.0 (September 2026)
          </a>
          . Check the{" "}
          <a href={RESOURCES_URL} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">
            ASIC exam resources page
          </a>{" "}
          for sitting dates and the latest version.
        </p>
      </div>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">The exam at a glance</h2>
        <ul className={`${panel} list-disc space-y-1.5 py-5 pr-5 pl-9 text-[15px] leading-[1.55]`}>
          {FORMAT.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">What each area tests</h2>
        <div className="grid gap-3 md:grid-cols-3">
          {AREAS.map((area) => (
            <div key={area.id} className={`${panel} space-y-3 p-5`}>
              <h3 className="font-semibold leading-snug">{area.label}</h3>
              <ul className="list-disc space-y-1.5 pl-4 text-sm leading-relaxed">
                {OUTCOMES[area.id].map((o) => (
                  <li key={o}>{o}</li>
                ))}
              </ul>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {TOPICS.filter((t) => t.area === area.id).map((t) => (
                  <Link
                    key={t.id}
                    href={`/cards/${t.id}`}
                    className="rounded-full bg-accent-soft px-2 py-0.5 text-xs text-accent hover:underline"
                  >
                    {t.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">A 10-week plan</h2>
        <p className="max-w-[560px] text-sm text-muted">
          About 6 to 8 hours a week. Stretch it out if you&apos;re also working full time in your PY.
        </p>
        <ol className="space-y-3">
          {PLAN.map((step) => (
            <li key={step.weeks} className={`${panel} grid gap-2 p-5 sm:grid-cols-[120px_1fr]`}>
              <p className="text-sm font-semibold text-accent">{step.weeks}</p>
              <div className="space-y-1.5 text-sm leading-relaxed">
                <p className="text-[15px] font-semibold">{step.focus}</p>
                <p>
                  <span className="font-medium">Read: </span>
                  {step.read}
                </p>
                <p>
                  <span className="font-medium">Practise: </span>
                  {step.practise}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">How to practise</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {METHOD.map((m) => (
            <div key={m.title} className={`${panel} p-5`}>
              <h3 className="font-semibold">{m.title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-muted">{m.body}</p>
            </div>
          ))}
        </div>
        <p className="text-sm text-muted">
          In this app: <Link href="/quiz/mixed" className="text-accent hover:underline">exam-style practice</Link>{" "}
          mixes all three areas, and <Link href="/quiz/weak" className="text-accent hover:underline">weak questions</Link>{" "}
          retests what you&apos;ve missed. This app&apos;s true/false questions have one statement each; the real
          exam&apos;s can have several.
        </p>
      </section>

      <section className="space-y-6">
        <div className="space-y-1">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">Reading list</h2>
          <p className="max-w-[560px] text-sm text-muted">
            ASIC&apos;s suggested reading is for everyone; extension reading is optional. You aren&apos;t
            expected to memorise any of it, but you should understand how it applies to advice. Add the
            suggested items to your <Link href="/reading" className="text-accent hover:underline">reading log</Link>{" "}
            in one tap, or download the{" "}
            <a href="/study-pack" download="py-study-pack.md" className="text-accent hover:underline">
              study pack
            </a>{" "}
            (questions, answers and this list as one file) to read offline or give to an AI assistant.
          </p>
        </div>
        {AREAS.map((area) => (
          <div key={area.id} className="space-y-3">
            <h3 className="font-semibold">{area.label}</h3>
            {(["suggested", "extension"] as const).map((tier) => (
              <ul key={tier} className="space-y-2">
                {list
                  .filter((r) => r.area === area.id && r.tier === tier)
                  .map((r) => (
                    <li key={r.title} className={`${panel} p-4`}>
                      <p className="flex flex-wrap items-baseline gap-x-2 font-medium">
                        {r.url ? (
                          <a href={r.url} target="_blank" rel="noopener noreferrer" className="hover:text-accent">
                            {r.title} <span className="text-muted">↗</span>
                          </a>
                        ) : (
                          r.title
                        )}
                        <span
                          className={`rounded-full px-2 py-0.5 text-xs font-normal ${
                            tier === "suggested" ? "bg-accent-soft text-accent" : "bg-track text-muted"
                          }`}
                        >
                          {tier === "suggested" ? "Suggested" : "Extension"}
                        </span>
                      </p>
                      <p className="mt-1 text-sm leading-relaxed text-muted">{r.focus}</p>
                    </li>
                  ))}
              </ul>
            ))}
          </div>
        ))}
      </section>
    </div>
  );
}
