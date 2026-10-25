import { isQuizQuestion } from "./questions";
import type { Progress, Question } from "./types";

export const WEAK_THRESHOLD = 0.7;
export const MIN_ATTEMPTS = 5;

export type TopicStatsData = {
  questionCount: number;
  quizCount: number; // MCQ + true/false
  attempts: number;
  accuracy: number | null; // null until the first attempt
  weak: boolean;
};

export function computeStats(questions: Question[], progress: Progress): TopicStatsData {
  let right = 0;
  let wrong = 0;
  for (const q of questions) {
    right += progress[q.id]?.right ?? 0;
    wrong += progress[q.id]?.wrong ?? 0;
  }
  const attempts = right + wrong;
  const accuracy = attempts === 0 ? null : right / attempts;
  return {
    questionCount: questions.length,
    quizCount: questions.filter(isQuizQuestion).length,
    attempts,
    accuracy,
    // Wait for 5 attempts so one bad answer doesn't flag the topic.
    weak: accuracy !== null && attempts >= MIN_ATTEMPTS && accuracy < WEAK_THRESHOLD,
  };
}
