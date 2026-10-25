import { useSyncExternalStore } from "react";

/**
 * A localStorage-backed value with a React hook. Every storage call is wrapped:
 * it can throw in private browsing, and it doesn't exist during server render.
 */
export function createStore<T>(key: string, fallback: T, isValid: (value: unknown) => boolean) {
  const changeEvent = `store-change:${key}`;

  function readRaw(): string | null {
    try {
      return window.localStorage.getItem(key);
    } catch {
      return null;
    }
  }

  function parse(raw: string | null): T {
    if (!raw) return fallback;
    try {
      const parsed: unknown = JSON.parse(raw);
      return isValid(parsed) ? (parsed as T) : fallback;
    } catch {
      return fallback;
    }
  }

  function notify() {
    window.dispatchEvent(new Event(changeEvent));
  }

  function read(): T {
    return parse(readRaw());
  }

  function write(value: T): void {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Storage full or blocked: the value just won't persist.
    }
    notify();
  }

  function clear(): void {
    try {
      window.localStorage.removeItem(key);
    } catch {
      // Nothing to clear.
    }
    notify();
  }

  // useSyncExternalStore needs a stable snapshot, so cache the parse by raw string.
  let cachedRaw: string | null | undefined;
  let cached: T = fallback;

  function getSnapshot(): T {
    const raw = readRaw();
    if (raw !== cachedRaw) {
      cachedRaw = raw;
      cached = parse(raw);
    }
    return cached;
  }

  function subscribe(onChange: () => void): () => void {
    window.addEventListener(changeEvent, onChange);
    window.addEventListener("storage", onChange); // other tabs
    return () => {
      window.removeEventListener(changeEvent, onChange);
      window.removeEventListener("storage", onChange);
    };
  }

  /** The live value, or null during server render and hydration. */
  function useValue(): T | null {
    return useSyncExternalStore(subscribe, getSnapshot, () => null);
  }

  return { read, write, clear, useValue };
}
