import { isQuizQuestion } from "./questions";
import type { Progress, Question } from "./types";

// ASIC sets the pass mark each sitting, starting from a university credit
// range of 65 to 74% (FAQs: Financial adviser exam). Below the range is weak;
// above the top of it is a safe buffer.
export const WEAK_BELOW = 0.65;
export const READY_FROM = 0.75;
export const MIN_ATTEMPTS = 5;

export type Readiness = "not-started" | "building" | "weak" | "borderline" | "ready";

export const READINESS: Record<Readiness, { label: string; badge: string; bar: string }> = {
  "not-started": { label: "Not started", badge: "", bar: "bg-accent" },
  building: { label: "Building", badge: "", bar: "bg-accent" },
  weak: { label: "Weak", badge: "bg-warn-soft text-warn", bar: "bg-warn" },
  borderline: { label: "Borderline", badge: "bg-accent-soft text-accent", bar: "bg-accent" },
  ready: { label: "Exam-ready", badge: "bg-good-soft text-good", bar: "bg-good" },
};

export type TopicStatsData = {
  questionCount: number;
  quizCount: number; // MCQ + true/false
  attempts: number;
  accuracy: number | null; // null until the first attempt
  readiness: Readiness;
  weak: boolean;
};

export function readinessOf(accuracy: number | null, attempts: number): Readiness {
  if (accuracy === null) return "not-started";
  // Wait for 5 attempts so one bad answer doesn't flag the topic.
  if (attempts < MIN_ATTEMPTS) return "building";
  if (accuracy < WEAK_BELOW) return "weak";
  if (accuracy < READY_FROM) return "borderline";
  return "ready";
}

export function computeStats(questions: Question[], progress: Progress): TopicStatsData {
  let right = 0;
  let wrong = 0;
  for (const q of questions) {
    right += progress[q.id]?.right ?? 0;
    wrong += progress[q.id]?.wrong ?? 0;
  }
  const attempts = right + wrong;
  const accuracy = attempts === 0 ? null : right / attempts;
  const readiness = readinessOf(accuracy, attempts);
  return {
    questionCount: questions.length,
    quizCount: questions.filter(isQuizQuestion).length,
    attempts,
    accuracy,
    readiness,
    weak: readiness === "weak",
  };
}

/* ---------- Principles ---------- */

// Understanding a principle means getting it right however it's asked, so
// mastery looks at every variant: each one's latest answer must be right.
// recordAnswer moves a question to box 2+ on a right answer and back to 1 on a
// wrong one, so box >= 2 means the latest attempt was right.
export type Mastery = "not-started" | "learning" | "solid" | "mastered";

export const MASTERY: Record<Mastery, { label: string; badge: string; hint: string }> = {
  "not-started": { label: "Not started", badge: "bg-surface-2 text-muted", hint: "No version attempted yet" },
  learning: { label: "Learning", badge: "bg-warn-soft text-warn", hint: "Some versions not yet attempted or last answered wrong" },
  solid: { label: "Solid", badge: "bg-accent-soft text-accent", hint: "Every version last answered right" },
  mastered: { label: "Mastered", badge: "bg-good-soft text-good", hint: "Every version right at least twice in a row" },
};

export type PrincipleStatsData = {
  variants: number;
  attempted: number; // variants answered at least once
  right: number; // variants whose latest answer was right
  mastery: Mastery;
};

export function principleStats(variants: Question[], progress: Progress): PrincipleStatsData {
  const boxes = variants.map((q) => progress[q.id]?.box);
  const attempted = boxes.filter((b) => b !== undefined).length;
  const right = boxes.filter((b) => b !== undefined && b >= 2).length;
  let mastery: Mastery = "learning";
  if (attempted === 0) mastery = "not-started";
  else if (boxes.every((b) => b !== undefined && b >= 3)) mastery = "mastered";
  else if (right === variants.length) mastery = "solid";
  return { variants: variants.length, attempted, right, mastery };
}
