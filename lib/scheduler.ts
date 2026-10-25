import { AREAS, TOPICS, type Progress, type Question } from "./types";

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
 *
 * Each principle is asked once per session where possible, so the variant you
 * see rotates (the least recently seen comes first) and a principle is tested
 * in different wordings across sessions rather than the same card every time.
 */
export function buildSession(
  questions: Question[],
  progress: Progress,
  length = SESSION_LENGTH,
): Question[] {
  const box = (q: Question) => progress[q.id]?.box ?? 1;
  const lastSeen = (q: Question) => progress[q.id]?.lastSeen ?? 0;
  const ordered = shuffle(questions).sort((a, b) => box(a) - box(b) || lastSeen(a) - lastSeen(b));

  const picked: Question[] = [];
  const principles = new Set<string>();
  for (const q of ordered) {
    if (picked.length === length) break;
    if (principles.has(q.principle)) continue;
    principles.add(q.principle);
    picked.push(q);
  }
  // Too few principles to fill the session: top up with other variants.
  for (const q of ordered) {
    if (picked.length === length) break;
    if (!picked.includes(q)) picked.push(q);
  }
  return picked;
}

/**
 * Exam-style mix: the exam covers all three areas (ASIC doesn't publish the
 * split), so take the same number from each, Leitner-ordered, then shuffle.
 */
export function buildBalancedSession(
  questions: Question[],
  progress: Progress,
  perArea: number,
): Question[] {
  const areaOf = (q: Question) => TOPICS.find((t) => t.id === q.topic)?.area;
  const picked = AREAS.flatMap((area) =>
    buildSession(questions.filter((q) => areaOf(q) === area.id), progress, perArea),
  );
  return shuffle(picked);
}

/** Questions you've attempted that sit in box 1 or 2, across all topics. */
export function weakQuestions(questions: Question[], progress: Progress): Question[] {
  return questions.filter((q) => {
    const p = progress[q.id];
    return p !== undefined && p.box <= 2;
  });
}
