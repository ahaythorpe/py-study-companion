# Question Guide

Writing the questions is the studying. Do it from your PY materials and the primary sources, not from memory.

## Rules

1. **Your own words.** Don't copy questions from paid exam-prep providers or textbooks. The repo is public.
2. **One idea per question.** If the explanation needs two paragraphs, split it.
3. **Always fill `source`.** A section number or regulatory guide. If you can't name one, check before adding it.
4. **Plausible wrong options.** Use real terms that are wrong here, not obviously silly ones.
5. **Check the current law.** Rules change. Confirm against the current version on legislation.gov.au or asic.gov.au before committing.

## Where to look

| Topic | Sources |
|---|---|
| Corporations Act | Corporations Act 2001 Chapter 7, ASIC RG 175 |
| Best interests | Corporations Act Part 7.7A Division 2 (s961B to s961J) |
| SOA and ROA | Corporations Act Part 7.7 Division 3, ASIC RG 175, RG 244 |
| Code of Ethics | Financial Planners and Advisers Code of Ethics 2019 (the 12 standards) |
| Behavioural finance | Your PY / exam study materials |

## Format

**MCQ**

```json
{
  "id": "bid-001",
  "topic": "best-interests",
  "kind": "mcq",
  "prompt": "Which section of the Corporations Act sets out the duty to act in the client's best interests?",
  "options": ["s961B", "s961J", "s946A", "s912A"],
  "answerIndex": 0,
  "explanation": "s961B is the best interests duty. s961J is the priority rule, s946A relates to ROAs and s912A sets general licensee obligations.",
  "source": "Corps Act s961B"
}
```

**Flashcard**

```json
{
  "id": "bid-002",
  "topic": "best-interests",
  "kind": "flashcard",
  "prompt": "What does the priority rule require?",
  "answer": "If the adviser knows, or reasonably should know, there is a conflict between the client's interests and their own (or their licensee's or associates'), they must give priority to the client's interests.",
  "explanation": "This sits alongside the best interests duty and the appropriate advice requirement.",
  "source": "Corps Act s961J"
}
```

## Quality check before committing

- [ ] Could someone answer it without the options? (Good MCQs can be.)
- [ ] Is exactly one option correct?
- [ ] Does the explanation say why the wrong options are wrong?
- [ ] Is the source filled in and checked?

## Targets

| Milestone | Per topic | Total |
|---|---|---|
| Weekend build | 4 | 20 |
| End of week 2 | 10 | 50 |
| Before the exam | 20+ | 100+ |
