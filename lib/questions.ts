import principleData from "@/data/principles.json";
import data from "@/data/questions.json";
import { ANGLES, TOPICS, type Area, type Principle, type Question, type Topic } from "./types";

const PREFIX: Record<Topic, string> = {
  licensing: "lic-",
  disclosure: "dis-",
  remuneration: "rem-",
  "aml-privacy-tax": "apt-",
  "best-interests": "bid-",
  ethics: "eth-",
  "advice-construction": "adv-",
  "behavioural-finance": "bf-",
};

// JSON imports widen string literals, so check the bank here. This module is
// loaded while prerendering every page, so a bad question fails the build.
function validatePrinciples(raw: unknown): Principle[] {
  if (!Array.isArray(raw)) throw new Error("principles.json must be an array");
  const topicIds = new Set<string>(TOPICS.map((t) => t.id));
  const seen = new Set<string>();
  for (const p of raw as Principle[]) {
    if (!p.id || !p.label) throw new Error(`principles.json: ${p.id ?? "(no id)"}: missing id or label`);
    if (seen.has(p.id)) throw new Error(`principles.json: ${p.id}: duplicate id`);
    if (!topicIds.has(p.topic)) throw new Error(`principles.json: ${p.id}: unknown topic "${p.topic}"`);
    seen.add(p.id);
  }
  return raw as Principle[];
}

export const PRINCIPLES: Principle[] = validatePrinciples(principleData);

function validate(raw: unknown): Question[] {
  if (!Array.isArray(raw)) throw new Error("questions.json must be an array");
  const seen = new Set<string>();
  const topicIds = new Set<string>(TOPICS.map((t) => t.id));

  for (const q of raw as Question[]) {
    const fail = (msg: string) => {
      throw new Error(`questions.json: ${q.id ?? "(no id)"}: ${msg}`);
    };
    if (!q.id) fail("missing id");
    if (seen.has(q.id)) fail("duplicate id");
    seen.add(q.id);
    if (!topicIds.has(q.topic)) fail(`unknown topic "${q.topic}"`);
    if (!q.id.startsWith(PREFIX[q.topic])) fail(`id must start with "${PREFIX[q.topic]}"`);
    const principle = PRINCIPLES.find((p) => p.id === q.principle);
    if (!principle) fail(`unknown principle "${q.principle}"`);
    else if (principle.topic !== q.topic) fail(`principle "${q.principle}" belongs to ${principle.topic}`);
    if (!q.prompt) fail("missing prompt");
    if (!q.explanation) fail("missing explanation");
    if (!q.source) fail("missing source");
    if (q.extract && (!q.extract.cite || !q.extract.text)) fail("extract needs cite and text");
    if (q.angle && (q.kind !== "flashcard" || !(q.angle in ANGLES))) fail(`bad angle "${q.angle}"`);

    if (q.kind === "mcq" || q.kind === "truefalse") {
      const n = q.kind === "mcq" ? 4 : 2;
      if (q.options?.length !== n) fail(`${q.kind} needs exactly ${n} options`);
      if (q.kind === "truefalse" && (q.options?.[0] !== "True" || q.options?.[1] !== "False")) {
        fail('truefalse options must be ["True", "False"]');
      }
      if (q.answerIndex === undefined || q.answerIndex < 0 || q.answerIndex >= n) {
        fail(`answerIndex must be 0-${n - 1}`);
      }
    } else if (q.kind === "multitf") {
      const n = q.statements?.length ?? 0;
      if (n < 3 || n > 4) fail("multitf needs 3-4 statements");
      if (q.statements?.some((st) => !st.text || typeof st.answer !== "boolean")) fail("each statement needs text and a boolean answer");
    } else if (q.kind === "spot") {
      const n = q.lines?.length ?? 0;
      if (n < 4) fail("spot needs at least 4 lines");
      if (!q.lines?.some((l) => l.issue)) fail("spot needs at least one line with an issue");
      if (q.lines?.every((l) => l.issue)) fail("spot needs at least one line without an issue");
    } else if (q.kind === "flashcard") {
      if (!q.answer) fail("flashcard needs an answer");
      if (!q.keyPoints || q.keyPoints.length < 2 || q.keyPoints.length > 5) fail("flashcard needs 2-5 keyPoints");
    } else {
      fail(`unknown kind "${q.kind}"`);
    }
  }
  return raw as Question[];
}

export const QUESTIONS: Question[] = validate(data);

/** Everything with a fixed answer; written-answer flashcards are for card mode only. */
export function isQuizQuestion(q: Question): boolean {
  return q.kind !== "flashcard";
}

export function questionsFor(topic: Topic): Question[] {
  return QUESTIONS.filter((q) => q.topic === topic);
}

export function questionsForArea(area: Area): Question[] {
  const topics = new Set(TOPICS.filter((t) => t.area === area).map((t) => t.id));
  return QUESTIONS.filter((q) => topics.has(q.topic));
}

export function isTopic(value: string): value is Topic {
  return TOPICS.some((t) => t.id === value);
}

export function topicLabel(topic: Topic): string {
  return TOPICS.find((t) => t.id === topic)?.label ?? topic;
}

export function principleLabel(id: string): string {
  return PRINCIPLES.find((p) => p.id === id)?.label ?? id;
}
