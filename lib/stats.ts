import { isQuizQuestion } from "./questions";
import type { Progress, Question } from "./types";

// ASIC sets the pass mark each sitting, starting from a university credit
// range of 65–74% (FAQs: Financial adviser exam). Below the range is weak;
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
