# PY Study Companion

Study and logbook companion for the Australian Professional Year. Quizzes and flashcards follow the three areas of the ASIC financial adviser exam, and the PY logbook tracks hours, quarters and milestones against ASIC's requirements.

> Learning the craft of advice, building the tools along the way.

**Live:** https://py-study-companion.vercel.app

## Why

Most study tools treat every question equally. This one keeps a score for each topic, so study time goes where it's needed.

## Features (v1)

- Quiz mode: multiple choice with an explanation and a source reference for every answer
- Flashcard mode: flip the card, then mark "got it" or "missed it"
- Readiness tracking: Leitner boxes, and after 5 attempts each topic is rated weak (<65%), borderline (65 to 74%, ASIC's starting range for the pass mark) or exam-ready (75%+)
- Progress saved in your browser, so there's no login
- Topics organised by ASIC's three exam areas, with multiple-choice and true/false questions like the real exam, plus mixed practice
- PY logbook: work activities (1,500 h), structured training (100 h), ethical dilemmas, client notifications, quarter certificates, the pre-Q3 checklist and a CSV for your supervisor
- Exam prep: exam format, learning outcomes per area, a 10-week plan, practice method and ASIC's full suggested and extension reading list
- Documents: upload certificates (qualifications, exam result, PY quarter certificates, training, CPD) by type, stored in the browser with a one-click .zip backup
- Practice questions: links to ASIC's official practice questions and answers, and ACER's online version
- Reading log: track your study reading, and import ASIC's suggested exam reading list in one tap
- Resources: links to the FAAA, the Corporations Act, the Code of Ethics, ASIC regulatory guides and AFCA

## Tech

Next.js (App Router), TypeScript, Tailwind, and localStorage. Deployed on Vercel.

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Docs

- [Plan](docs/PLAN.md): scope and weekend schedule
- [Spec](docs/SPEC.md): data model, pages, and logic
- [Tasks](docs/TASKS.md): step-by-step build checklist
- [Question guide](docs/QUESTION-GUIDE.md): how to write the question bank

## Disclaimer

This is a personal study aid. It is not financial advice and not an official ASIC resource.
