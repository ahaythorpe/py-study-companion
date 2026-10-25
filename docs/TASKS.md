# Tasks

Tick each box as you go. Every block ends with a commit. Don't start the next block until the "Stop when" check passes.

## Block 1: Saturday morning (setup)

- [ ] `npx create-next-app@latest py-study-companion` (TypeScript: yes, Tailwind: yes, App Router: yes, src dir: no)
- [ ] Create a GitHub repo, then `git remote add origin ...` and push
- [ ] Create `docs/` and drop in these Markdown files
- [ ] Create `lib/types.ts` from SPEC.md
- [ ] Create `data/questions.json` with 20 questions (4 per topic)
- [ ] On `app/page.tsx`, import the JSON and list the 5 topics with a question count each
- [ ] Commit: `init: next app, types, seed bank`

**Stop when:** the homepage shows 5 topics with counts, and it's pushed to GitHub.

## Block 2: Saturday afternoon (quiz flow)

- [ ] Create `components/QuestionCard.tsx`
- [ ] Create `app/quiz/[topic]/page.tsx` (mark it `"use client"`)
- [ ] Filter questions by topic, take the first 10 MCQs for now
- [ ] Answer, then show right/wrong, the explanation, and the source
- [ ] "Next" button, then `ResultScreen` at the end
- [ ] Link each topic on the homepage to its quiz
- [ ] Commit: `feat: quiz flow`

**Stop when:** you can finish a full quiz on one topic and see a score.

## Block 3: Sunday morning (the smart part)

- [ ] Create `lib/progress.ts` (load, save, recordAnswer, reset)
- [ ] Call `recordAnswer` in the quiz on every answer
- [ ] Create `lib/scheduler.ts` with Leitner ordering
- [ ] Use the scheduler in the quiz instead of "first 10"
- [ ] Commit: `feat: progress + leitner scheduler`
- [ ] Create `components/TopicStats.tsx` with accuracy and the weak badge
- [ ] Replace the homepage list with `TopicStats` cards
- [ ] Add the `/quiz/weak` route
- [ ] Add a "Reset progress" button (with a confirm)
- [ ] Commit: `feat: dashboard + weak topics`

**Stop when:** you answer a question wrong, start a new quiz, and that question shows up first. After 5+ attempts under 70%, the topic shows "weak".

## Block 4: Sunday afternoon (finish and ship)

- [ ] Create `components/Flashcard.tsx`
- [ ] Create `app/cards/[topic]/page.tsx`, using the same `recordAnswer`
- [ ] Commit: `feat: flashcards`
- [ ] Import the repo on vercel.com and deploy
- [ ] Test on your phone
- [ ] Take a screenshot of the dashboard, add it to the README along with the live URL
- [ ] Commit: `docs: readme + live link`

**Stop when:** the live URL works on your phone. You're done. Close the laptop.

## If you're behind

| Running late at | Cut |
|---|---|
| End of Block 2 | Skip `ResultScreen`; just show the score as text |
| End of Block 3 | Skip `/quiz/weak` and reset |
| End of Block 4 | Skip flashcards entirely; deploy the quiz |

## After the weekend

- Add 5 questions per study session until each topic has 20
- Commit questions separately: `content: +5 best-interests questions`
