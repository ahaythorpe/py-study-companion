import reading from "@/data/exam-reading.json";
import { QUESTIONS } from "@/lib/questions";
import { AREAS, TOPICS } from "@/lib/types";

// The question bank and reading list as one Markdown file, for reading offline
// or uploading to an AI assistant as study context. Built at build time.

const LETTERS = ["A", "B", "C", "D"];

function studyPack(): string {
  const lines: string[] = [
    "# PY Study Companion: study pack",
    "",
    "Questions, answers and the reading list for the ASIC financial adviser exam. A personal study aid,",
    "not financial advice and not an official ASIC resource. Check anything you rely on against the current law.",
    "",
  ];

  for (const area of AREAS) {
    lines.push(`## ${area.label}`, "", area.summary, "");
    for (const topic of TOPICS.filter((t) => t.area === area.id)) {
      lines.push(`### ${topic.label} (${topic.scope})`, "");
      for (const q of QUESTIONS.filter((x) => x.topic === topic.id)) {
        if (q.scenario) lines.push(`Scenario: ${q.scenario}`, "");
        if (q.extract) lines.push(`> ${q.extract.cite}`, ">", ...q.extract.text.split("\n").map((l) => `> ${l}`), "");
        lines.push(`**${q.id}.** ${q.prompt}`, "");
        if (q.kind === "mcq") lines.push(...(q.options ?? []).map((o, i) => `- ${LETTERS[i]}. ${o}`), "");
        if (q.kind === "multitf") lines.push(...(q.statements ?? []).map((st, i) => `${i + 1}. ${st.text}`), "");
        if (q.kind === "spot") lines.push(...(q.lines ?? []).map((l, i) => `${i + 1}. ${l.text}`), "");

        if (q.kind === "flashcard") {
          lines.push("Key points:", ...(q.keyPoints ?? []).map((p) => `- ${p}`), "", `Model answer: ${q.answer}`);
        } else if (q.kind === "multitf") {
          lines.push(`Answers: ${(q.statements ?? []).map((st, i) => `${i + 1} ${st.answer ? "true" : "false"}`).join(", ")}`);
        } else if (q.kind === "spot") {
          lines.push("Problems:", ...(q.lines ?? []).flatMap((l, i) => (l.issue ? [`- Line ${i + 1}: ${l.issue}`] : [])));
        } else {
          const i = q.answerIndex ?? 0;
          lines.push(`Answer: ${q.kind === "mcq" ? `${LETTERS[i]}. ` : ""}${q.options?.[i]}`);
        }
        lines.push("", `Why: ${q.explanation}`, "", `Source: ${q.source}`, "");
      }
    }
  }

  lines.push("## Reading list (ASIC exam preparation guidance v6.0)", "");
  for (const area of AREAS) {
    lines.push(`### ${area.label}`, "");
    for (const r of reading.filter((x) => x.area === area.id)) {
      const tier = r.tier === "suggested" ? "Suggested" : "Extension";
      lines.push(`- **${r.title}** (${tier}). ${r.focus}${"url" in r && r.url ? ` ${r.url}` : ""}`);
    }
    lines.push("");
  }

  return lines.join("\n");
}

export function GET() {
  return new Response(studyPack(), {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Content-Disposition": 'attachment; filename="py-study-pack.md"',
    },
  });
}
