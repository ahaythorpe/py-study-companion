"use client";

import { useState } from "react";
import { today } from "@/lib/logbook";
import {
  DOC_CATEGORIES,
  MAX_FILE_BYTES,
  addDocument,
  backupZip,
  getFile,
  removeDocument,
  setCategory,
  useDocuments,
  type DocCategory,
  type DocMeta,
} from "@/lib/documents";
import { btnGhost, btnPrimary, field, panel } from "./ui";

function formatSize(bytes: number): string {
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function save(blob: Blob, name: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  URL.revokeObjectURL(url);
}

export function Documents() {
  const docs = useDocuments();
  const [zipping, setZipping] = useState(false);

  if (docs === null) return <p className="text-muted">Loading…</p>;

  async function backup() {
    setZipping(true);
    try {
      save(await backupZip(docs ?? []), `py-documents-${today()}.zip`);
    } finally {
      setZipping(false);
    }
  }

  return (
    <div className="space-y-6">
      <p className={`${panel} p-4 text-sm leading-relaxed text-muted`}>
        Certificates and sign-offs are saved in this browser only, on this device. Clearing site data
        or switching browsers loses them, so keep the originals and download a backup after adding
        new ones.
      </p>

      <Upload />

      {docs.length > 0 && (
        <div className="flex justify-end">
          <button type="button" onClick={backup} disabled={zipping} className={btnGhost}>
            {zipping ? "Preparing…" : `Download all (${docs.length}) as .zip`}
          </button>
        </div>
      )}

      {docs.length === 0 ? (
        <p className={`${panel} p-8 text-center text-sm text-muted`}>
          No documents yet. Upload your qualifications, exam result and quarter certificates above.
        </p>
      ) : (
        DOC_CATEGORIES.filter((c) => docs.some((d) => d.category === c.id)).map((c) => (
          <section key={c.id} className="space-y-3">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">{c.label}</h2>
            <ul className="space-y-3">
              {docs
                .filter((d) => d.category === c.id)
                .map((d) => (
                  <Doc key={d.id} doc={d} />
                ))}
            </ul>
          </section>
        ))
      )}
    </div>
  );
}

function Upload() {
  const [category, setCat] = useState<DocCategory>("py-quarter");
  const [files, setFiles] = useState<File[]>([]);
  const [inputKey, setInputKey] = useState(0);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const failed: string[] = [];
    for (const file of files) {
      try {
        await addDocument(file, category);
      } catch (err) {
        failed.push(err instanceof Error && err.message.includes("25 MB") ? err.message : `${file.name} couldn't be saved`);
      }
    }
    setBusy(false);
    setFiles([]);
    setInputKey((k) => k + 1); // clears the file input
    if (failed.length) setError(failed.join(". "));
  }

  return (
    <form onSubmit={submit} className={`${panel} space-y-4 p-5`}>
      <h2 className="font-semibold">Upload documents</h2>
      <div className="grid gap-4 sm:grid-cols-[220px_1fr]">
        <label className="space-y-1.5 text-sm">
          <span className="font-medium">Type</span>
          <select value={category} onChange={(e) => setCat(e.target.value as DocCategory)} className={field}>
            {DOC_CATEGORIES.map((c) => (
              <option key={c.id} value={c.id}>
                {c.label}
              </option>
            ))}
          </select>
        </label>
        <label className="space-y-1.5 text-sm">
          <span className="font-medium">Files (PDF, image or Word, up to {MAX_FILE_BYTES / (1024 * 1024)} MB each)</span>
          <input
            key={inputKey}
            type="file"
            multiple
            accept="application/pdf,image/*,.doc,.docx"
            onChange={(e) => setFiles(Array.from(e.target.files ?? []))}
            className={`${field} file:mr-3 file:rounded-md file:border-0 file:bg-accent-soft file:px-3 file:py-1 file:text-sm file:font-medium file:text-accent`}
          />
        </label>
      </div>
      {error && <p className="text-sm text-bad">{error}</p>}
      <button type="submit" disabled={files.length === 0 || busy} className={btnPrimary}>
        {busy ? "Saving…" : files.length > 1 ? `Upload ${files.length} files` : "Upload"}
      </button>
    </form>
  );
}

function Doc({ doc }: { doc: DocMeta }) {
  const [confirming, setConfirming] = useState(false);

  async function open() {
    const blob = await getFile(doc.id);
    if (!blob) return;
    // Opening in a tab shows PDFs and images inline; other types download.
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank", "noopener");
    setTimeout(() => URL.revokeObjectURL(url), 60_000);
  }

  async function download() {
    const blob = await getFile(doc.id);
    if (blob) save(blob, doc.name);
  }

  return (
    <li className={`${panel} flex flex-wrap items-center justify-between gap-3 p-4`}>
      <div className="min-w-0 flex-[1_1_240px]">
        <button type="button" onClick={open} className="max-w-full truncate text-left font-medium hover:text-accent">
          {doc.name}
        </button>
        <p className="text-xs text-muted">
          {formatSize(doc.size)} · added {new Date(doc.addedAt).toLocaleDateString("en-AU")}
        </p>
      </div>
      <div className="flex flex-wrap items-center gap-3 text-xs text-muted">
        <select
          value={doc.category}
          onChange={(e) => void setCategory(doc.id, e.target.value as DocCategory)}
          aria-label={`Type of ${doc.name}`}
          className="rounded-lg border border-line-strong bg-surface px-2 py-1.5 text-xs"
        >
          {DOC_CATEGORIES.map((c) => (
            <option key={c.id} value={c.id}>
              {c.label}
            </option>
          ))}
        </select>
        <button type="button" onClick={download} className="font-medium hover:text-accent">
          Download
        </button>
        {confirming ? (
          <span className="flex gap-3">
            <button type="button" onClick={() => void removeDocument(doc.id)} className="font-medium text-bad">
              Delete
            </button>
            <button type="button" onClick={() => setConfirming(false)}>
              Cancel
            </button>
          </span>
        ) : (
          <button type="button" onClick={() => setConfirming(true)} className="hover:text-bad">
            Remove
          </button>
        )}
      </div>
    </li>
  );
}
