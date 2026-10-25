import { useSyncExternalStore } from "react";

// Certificates and other PY documents. Files are too big for localStorage, so
// they live in IndexedDB: metadata in one store, the file bytes in another so
// listing documents doesn't load every file into memory.

export type DocCategory =
  | "qualification"
  | "exam"
  | "py-quarter"
  | "training"
  | "cpd"
  | "registration"
  | "other";

export const DOC_CATEGORIES: { id: DocCategory; label: string }[] = [
  { id: "qualification", label: "Qualification" },
  { id: "exam", label: "Exam result" },
  { id: "py-quarter", label: "PY quarter certificate" },
  { id: "training", label: "Structured training" },
  { id: "cpd", label: "CPD" },
  { id: "registration", label: "ASIC registration" },
  { id: "other", label: "Other" },
];

export type DocMeta = {
  id: string;
  name: string;
  category: DocCategory;
  mime: string;
  size: number; // bytes
  addedAt: number;
};

/** Larger files are refused: browsers cap per-site storage. */
export const MAX_FILE_BYTES = 25 * 1024 * 1024;

const DB_NAME = "py-documents";
const META = "meta";
const FILES = "files";

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => {
      req.result.createObjectStore(META, { keyPath: "id" });
      req.result.createObjectStore(FILES);
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function run<T>(
  stores: string[],
  mode: IDBTransactionMode,
  fn: (tx: IDBTransaction) => IDBRequest<T> | void,
): Promise<T | undefined> {
  const db = await openDb();
  try {
    return await new Promise<T | undefined>((resolve, reject) => {
      const tx = db.transaction(stores, mode);
      const req = fn(tx);
      tx.oncomplete = () => resolve(req ? req.result : undefined);
      tx.onerror = () => reject(tx.error);
      tx.onabort = () => reject(tx.error);
    });
  } finally {
    db.close();
  }
}

/* ---------- Live list for React ---------- */

// null until the first load finishes; [] if IndexedDB is unavailable.
let cache: DocMeta[] | null = null;
let loading = false;
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((l) => l());
}

async function reload(): Promise<void> {
  try {
    const all = (await run<DocMeta[]>([META], "readonly", (tx) => tx.objectStore(META).getAll())) ?? [];
    cache = all.sort((a, b) => b.addedAt - a.addedAt);
  } catch {
    cache = []; // Private browsing or storage blocked.
  }
  emit();
}

function subscribe(onChange: () => void): () => void {
  listeners.add(onChange);
  if (cache === null && !loading) {
    loading = true;
    void reload();
  }
  return () => listeners.delete(onChange);
}

/** Document metadata, newest first, or null while loading. */
export function useDocuments(): DocMeta[] | null {
  return useSyncExternalStore(subscribe, () => cache, () => null);
}

/* ---------- Changes ---------- */

export async function addDocument(file: File, category: DocCategory): Promise<void> {
  if (file.size > MAX_FILE_BYTES) throw new Error(`${file.name} is over 25 MB`);
  const meta: DocMeta = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    name: file.name,
    category,
    mime: file.type || "application/octet-stream",
    size: file.size,
    addedAt: Date.now(),
  };
  // Ask the browser not to evict our data under storage pressure.
  void navigator.storage?.persist?.().catch(() => false);
  await run([META, FILES], "readwrite", (tx) => {
    tx.objectStore(META).put(meta);
    tx.objectStore(FILES).put(file, meta.id);
  });
  await reload();
}

export async function setCategory(id: string, category: DocCategory): Promise<void> {
  const meta = cache?.find((d) => d.id === id);
  if (!meta) return;
  await run([META], "readwrite", (tx) => tx.objectStore(META).put({ ...meta, category }));
  await reload();
}

export async function removeDocument(id: string): Promise<void> {
  await run([META, FILES], "readwrite", (tx) => {
    tx.objectStore(META).delete(id);
    tx.objectStore(FILES).delete(id);
  });
  await reload();
}

export async function getFile(id: string): Promise<Blob | undefined> {
  return run<Blob>([FILES], "readonly", (tx) => tx.objectStore(FILES).get(id));
}

/* ---------- Backup ---------- */

/** Every document in a .zip, one folder per category. */
export async function backupZip(docs: DocMeta[]): Promise<Blob> {
  const used = new Set<string>();
  const entries: { path: string; data: Uint8Array<ArrayBuffer> }[] = [];
  for (const doc of docs) {
    const blob = await getFile(doc.id);
    if (!blob) continue;
    const folder = DOC_CATEGORIES.find((c) => c.id === doc.category)?.label ?? "Other";
    entries.push({ path: uniquePath(`${folder}/${doc.name}`, used), data: new Uint8Array(await blob.arrayBuffer()) });
  }
  return zip(entries);
}

function uniquePath(path: string, used: Set<string>): string {
  let candidate = path;
  const dot = path.lastIndexOf(".");
  const [base, ext] = dot > path.lastIndexOf("/") ? [path.slice(0, dot), path.slice(dot)] : [path, ""];
  for (let n = 2; used.has(candidate); n++) candidate = `${base} (${n})${ext}`;
  used.add(candidate);
  return candidate;
}

// A minimal stored (uncompressed) zip writer. PDFs and images are already
// compressed, so deflate would gain little and need a dependency.
const CRC_TABLE = Array.from({ length: 256 }, (_, n) => {
  let c = n;
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  return c >>> 0;
});

function crc32(data: Uint8Array): number {
  let crc = 0xffffffff;
  for (const byte of data) crc = CRC_TABLE[(crc ^ byte) & 0xff] ^ (crc >>> 8);
  return (crc ^ 0xffffffff) >>> 0;
}

function zip(entries: { path: string; data: Uint8Array<ArrayBuffer> }[]): Blob {
  const now = new Date();
  const time = (now.getHours() << 11) | (now.getMinutes() << 5) | (now.getSeconds() >> 1);
  const date = ((now.getFullYear() - 1980) << 9) | ((now.getMonth() + 1) << 5) | now.getDate();
  const encoder = new TextEncoder();
  const parts: BlobPart[] = [];
  const central: Uint8Array<ArrayBuffer>[] = [];
  let offset = 0;

  for (const { path, data } of entries) {
    const name = encoder.encode(path);
    const crc = crc32(data);
    // Fields shared by the local header and the central directory record.
    const common = (view: DataView, at: number) => {
      view.setUint16(at, 20, true); // version needed
      view.setUint16(at + 2, 0x0800, true); // UTF-8 names
      view.setUint16(at + 4, 0, true); // stored
      view.setUint16(at + 6, time, true);
      view.setUint16(at + 8, date, true);
      view.setUint32(at + 10, crc, true);
      view.setUint32(at + 14, data.length, true);
      view.setUint32(at + 18, data.length, true);
      view.setUint16(at + 22, name.length, true);
    };

    const local = new Uint8Array(30 + name.length);
    const lv = new DataView(local.buffer);
    lv.setUint32(0, 0x04034b50, true);
    common(lv, 4);
    local.set(name, 30);

    const record = new Uint8Array(46 + name.length);
    const cv = new DataView(record.buffer);
    cv.setUint32(0, 0x02014b50, true);
    cv.setUint16(4, 20, true); // version made by
    common(cv, 6);
    cv.setUint32(42, offset, true);
    record.set(name, 46);

    parts.push(local, data);
    central.push(record);
    offset += local.length + data.length;
  }

  const size = central.reduce((n, r) => n + r.length, 0);
  const end = new Uint8Array(22);
  const ev = new DataView(end.buffer);
  ev.setUint32(0, 0x06054b50, true);
  ev.setUint16(8, entries.length, true);
  ev.setUint16(10, entries.length, true);
  ev.setUint32(12, size, true);
  ev.setUint32(16, offset, true);

  return new Blob([...parts, ...central, end], { type: "application/zip" });
}
