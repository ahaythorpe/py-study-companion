import { useSyncExternalStore } from "react";
import type { Box, Progress } from "./types";

const KEY = "py-progress-v1";
const CHANGE_EVENT = "py-progress-change";

// Every localStorage call is wrapped: it can throw in private browsing, and it
// doesn't exist during server render.
function readRaw(): string | null {
  try {
    return window.localStorage.getItem(KEY);
  } catch {
    return null;
  }
}

function parse(raw: string | null): Progress {
  if (!raw) return {};
  try {
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? (parsed as Progress) : {};
  } catch {
    return {};
  }
}

export function loadProgress(): Progress {
  return parse(readRaw());
}

export function saveProgress(p: Progress): void {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(p));
  } catch {
    // Storage full or blocked: progress just won't persist.
  }
  window.dispatchEvent(new Event(CHANGE_EVENT));
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
  try {
    window.localStorage.removeItem(KEY);
  } catch {
    // Nothing to clear.
  }
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

// useSyncExternalStore needs a stable snapshot, so cache the parse by raw string.
let cachedRaw: string | null | undefined;
let cached: Progress = {};

function getSnapshot(): Progress {
  const raw = readRaw();
  if (raw !== cachedRaw) {
    cachedRaw = raw;
    cached = parse(raw);
  }
  return cached;
}

function subscribe(onChange: () => void): () => void {
  window.addEventListener(CHANGE_EVENT, onChange);
  window.addEventListener("storage", onChange); // other tabs
  return () => {
    window.removeEventListener(CHANGE_EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}

/** Live progress, or null during server render and hydration. */
export function useProgress(): Progress | null {
  return useSyncExternalStore(subscribe, getSnapshot, () => null);
}
