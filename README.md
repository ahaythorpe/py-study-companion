# PY Study Companion

Flashcards and quizzes for the Professional Year: the Corporations Act, best interests duty, the SOA and ROA process, and the exam areas. It tracks the topics you're weak on and brings them back first.

> Learning the craft of advice, building the tools along the way.

**Live:** https://py-study-companion.vercel.app

## Why

Most study tools treat every question equally. This one keeps a score for each topic, so study time goes where it's needed.

## Features (v1)

- Quiz mode: multiple choice with an explanation and a source reference for every answer
- Flashcard mode: flip the card, then mark "got it" or "missed it"
- Weak-topic tracking: Leitner boxes, plus a flag on any topic under 70% accuracy
- Progress saved in your browser, so there's no login
- PY training log: record structured training hours against the 70 h technical / 30 h client care targets, and download a CSV for your supervisor
- Reading log: track books, articles, courses and podcasts, with status, topic, hours (for CPD) and notes
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
