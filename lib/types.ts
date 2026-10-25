export type Topic =
  | "corps-act"
  | "best-interests"
  | "soa-roa"
  | "ethics"
  | "behavioural-finance";

export const TOPICS: { id: Topic; label: string }[] = [
  { id: "corps-act", label: "Corporations Act" },
  { id: "best-interests", label: "Best interests duty" },
  { id: "soa-roa", label: "SOA and ROA" },
  { id: "ethics", label: "Code of Ethics" },
  { id: "behavioural-finance", label: "Behavioural finance" },
];

export type Question = {
  id: string; // "bid-001"
  topic: Topic;
  kind: "mcq" | "flashcard";
  prompt: string;
  options?: string[]; // mcq only, 4 options
  answerIndex?: number; // mcq only
  answer?: string; // flashcard only
  explanation: string;
  source: string; // "Corps Act s961B"
};

export type Box = 1 | 2 | 3 | 4 | 5;

export type QuestionProgress = {
  box: Box;
  right: number;
  wrong: number;
  lastSeen: number; // Date.now()
};

export type Progress = Record<string, QuestionProgress>;
