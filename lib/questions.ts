import data from "@/data/questions.json";
import { TOPICS, type Question, type Topic } from "./types";

const PREFIX: Record<Topic, string> = {
  "corps-act": "ca-",
  "best-interests": "bid-",
  "soa-roa": "soa-",
  ethics: "eth-",
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
    if (q.kind === "mcq") {
      if (q.options?.length !== 4) fail("mcq needs exactly 4 options");
      if (q.answerIndex === undefined || q.answerIndex < 0 || q.answerIndex > 3) {
        fail("mcq needs answerIndex 0-3");
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

export function questionsFor(topic: Topic): Question[] {
  return QUESTIONS.filter((q) => q.topic === topic);
}

export function isTopic(value: string): value is Topic {
  return TOPICS.some((t) => t.id === value);
}

export function topicLabel(topic: Topic): string {
  return TOPICS.find((t) => t.id === topic)?.label ?? topic;
}
