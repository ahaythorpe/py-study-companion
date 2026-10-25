// The three examined knowledge areas, as set out in ASIC's Financial adviser
// exam: Exam preparation guidance (v6.0, September 2026). Questions are split
// equally across them.
export type Area = "regulatory" | "ethics" | "construction";

export const AREAS: { id: Area; label: string; summary: string }[] = [
  {
    id: "regulatory",
    label: "Regulatory and legal obligations",
    summary: "Corporations Act Chapter 7, AML/CTF Act, Privacy Act and Subdivision 50-AA of the TASA.",
  },
  {
    id: "ethics",
    label: "Applied ethical and professional reasoning",
    summary: "The Code of Ethics, ethical frameworks, best interests duty, biases and file maintenance.",
  },
  {
    id: "construction",
    label: "Financial advice construction",
    summary: "Suitability of advice for different consumer groups, risk, and client behaviour.",
  },
];

export type Topic =
  | "licensing"
  | "disclosure"
  | "remuneration"
  | "aml-privacy-tax"
  | "best-interests"
  | "ethics"
  | "advice-construction"
  | "behavioural-finance";

export const TOPICS: { id: Topic; label: string; area: Area; scope: string }[] = [
  { id: "licensing", label: "Licensing, conduct and breach reporting", area: "regulatory", scope: "Part 7.6, s912A, s912DAA, RG 78" },
  { id: "disclosure", label: "Disclosure: FSG, SOA, ROA and PDS", area: "regulatory", scope: "Parts 7.7 and 7.9, RG 175" },
  { id: "remuneration", label: "Fees and conflicted remuneration", area: "regulatory", scope: "Part 7.7A Div 3–5, RG 246" },
  { id: "aml-privacy-tax", label: "AML/CTF, Privacy and tax advice", area: "regulatory", scope: "AML/CTF Act, Privacy Act APPs, TASA" },
  { id: "best-interests", label: "Best interests duty", area: "ethics", scope: "Part 7.7A Div 2, s961B–s961J" },
  { id: "ethics", label: "Code of Ethics and ethical reasoning", area: "ethics", scope: "Code of Ethics 2019, ethical frameworks" },
  { id: "advice-construction", label: "Advice suitability and scope", area: "construction", scope: "RG 90, RG 244, INFO 267" },
  { id: "behavioural-finance", label: "Consumer behaviour and biases", area: "construction", scope: "Behavioural finance, risk profiling" },
];

export type Question = {
  id: string; // "bid-001"
  topic: Topic;
  kind: "mcq" | "truefalse" | "flashcard";
  prompt: string;
  options?: string[]; // mcq: 4 options; truefalse: ["True", "False"]
  answerIndex?: number; // mcq and truefalse
  answer?: string; // flashcard only
  explanation: string;
  source: string; // "Corps Act s961B"
};

export type Box = 1 | 2 | 3 | 4 | 5;

export type QuestionProgress = {
  box: Box;
  right: number;
  wrong: number;
  lastSeen: number; // Date.now()
};

export type Progress = Record<string, QuestionProgress>;
