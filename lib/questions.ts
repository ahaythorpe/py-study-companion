import data from "@/data/questions.json";
import { TOPICS, type Area, type Question, type Topic } from "./types";

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
    if (!q.prompt) fail("missing prompt");
    if (!q.explanation) fail("missing explanation");
    if (!q.source) fail("missing source");
    if (q.kind === "mcq" || q.kind === "truefalse") {
      const n = q.kind === "mcq" ? 4 : 2;
      if (q.options?.length !== n) fail(`${q.kind} needs exactly ${n} options`);
      if (q.kind === "truefalse" && (q.options?.[0] !== "True" || q.options?.[1] !== "False")) {
        fail('truefalse options must be ["True", "False"]');
      }
      if (q.answerIndex === undefined || q.answerIndex < 0 || q.answerIndex >= n) {
        fail(`answerIndex must be 0-${n - 1}`);
      }
    } else if (q.kind === "flashcard") {
      if (!q.answer) fail("flashcard needs an answer");
    } else {
      fail(`unknown kind "${q.kind}"`);
    }
  }
  return raw as Question[];
}

export const QUESTIONS: Question[] = validate(data);

/** MCQ and true/false questions; flashcards are for card mode only. */
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
