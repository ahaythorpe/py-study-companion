import type { Progress, Question } from "./types";

export const SESSION_LENGTH = 10;

function shuffle<T>(items: T[]): T[] {
  const a = [...items];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * Leitner ordering: lowest box first, then oldest lastSeen. New questions count
 * as box 1, never seen. Shuffling before a stable sort randomises ties.
 */
export function buildSession(
  questions: Question[],
  progress: Progress,
  length = SESSION_LENGTH,
): Question[] {
  const box = (q: Question) => progress[q.id]?.box ?? 1;
  const lastSeen = (q: Question) => progress[q.id]?.lastSeen ?? 0;
  return shuffle(questions)
    .sort((a, b) => box(a) - box(b) || lastSeen(a) - lastSeen(b))
    .slice(0, length);
}

/** Questions you've attempted that sit in box 1 or 2, across all topics. */
export function weakQuestions(questions: Question[], progress: Progress): Question[] {
  return questions.filter((q) => {
    const p = progress[q.id];
    return p !== undefined && p.box <= 2;
  });
}
