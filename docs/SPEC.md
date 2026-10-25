# Spec

## Pages

| Route | What it shows |
|---|---|
| `/` | Dashboard: one card per topic with accuracy %, question count, a "weak" badge if under 70%, and buttons for Quiz and Cards |
| `/quiz/[topic]` | One MCQ at a time. Pick an answer, see right/wrong, the explanation, and the source. "Next" button. Score at the end |
| `/cards/[topic]` | One flashcard at a time. Tap to flip. Buttons: "Got it" / "Missed it" |
| `/quiz/weak` | Mixed quiz drawn only from box 1 and 2 questions across all topics |

## Data model (`lib/types.ts`)

```ts
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
  id: string;              // "bid-001"
  topic: Topic;
  kind: "mcq" | "flashcard";
  prompt: string;
  options?: string[];      // mcq only, 4 options
  answerIndex?: number;    // mcq only
  answer?: string;         // flashcard only
  explanation: string;
  source: string;          // "Corps Act s961B"
};

export type Box = 1 | 2 | 3 | 4 | 5;

export type QuestionProgress = {
  box: Box;
  right: number;
  wrong: number;
  lastSeen: number;        // Date.now()
};

export type Progress = Record<string, QuestionProgress>;
```

## Question bank

- File: `data/questions.json`, an array of `Question`
- IDs are prefixed by topic: `ca-`, `bid-`, `soa-`, `eth-`, `bf-`
- See [QUESTION-GUIDE.md](QUESTION-GUIDE.md)

## Progress (`lib/progress.ts`)

- localStorage key: `py-progress-v1`
- Functions:
  - `loadProgress(): Progress`, which returns `{}` if empty or on error
  - `saveProgress(p: Progress): void`
  - `recordAnswer(id: string, correct: boolean): Progress`
  - `resetProgress(): void`
- Wrap every localStorage call in try/catch. It can throw in private browsing.
- Only call these inside `useEffect` or event handlers. localStorage doesn't exist during server render.

## Leitner rules (`lib/scheduler.ts`)

- New question: treated as box 1
- Correct: `box = min(box + 1, 5)`
- Wrong: `box = 1`
- Ordering for a session: sort by box ascending, then `lastSeen` ascending (oldest first), then shuffle within ties
- Session length: 10 questions (or fewer if the topic has fewer)

## Topic stats

```ts
accuracy = right / (right + wrong)   // across all questions in the topic
weak = attempts >= 5 && accuracy < 0.7
```

Show "Not started" if there are 0 attempts. Only flag as weak after 5 attempts, so one bad answer doesn't trigger it.

## Components

| Component | Props | Job |
|---|---|---|
| `QuestionCard` | `question`, `onAnswer(correct)` | Renders the MCQ, locks after answering, shows explanation and source |
| `Flashcard` | `question`, `onMark(correct)` | Front/back flip, two buttons |
| `TopicStats` | `topic`, `stats` | Dashboard card with accuracy bar and weak badge |
| `ResultScreen` | `score`, `total`, `onRestart` | End of session |

## Edge cases

- Topic with no questions: show "No questions yet" instead of crashing
- Refresh mid-quiz: fine to restart the session; progress is already saved per answer
- Bad JSON: fail at build time (import the JSON directly so TypeScript catches it)
