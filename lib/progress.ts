import { createStore } from "./storage";
import type { Box, Progress } from "./types";

const store = createStore<Progress>(
  "py-progress-v1",
  {},
  (v) => typeof v === "object" && v !== null && !Array.isArray(v),
);

export function loadProgress(): Progress {
  return store.read();
}

export function saveProgress(p: Progress): void {
  store.write(p);
}

export function recordAnswer(id: string, correct: boolean): Progress {
  const progress = loadProgress();
  const current = progress[id] ?? { box: 1, right: 0, wrong: 0, lastSeen: 0 };
  const next: Progress = {
    ...progress,
    [id]: {
      box: correct ? (Math.min(current.box + 1, 5) as Box) : 1,
      right: current.right + (correct ? 1 : 0),
      wrong: current.wrong + (correct ? 0 : 1),
      lastSeen: Date.now(),
    },
  };
  saveProgress(next);
  return next;
}

export function resetProgress(): void {
  store.clear();
}

/** Live progress, or null during server render and hydration. */
export const useProgress = store.useValue;
