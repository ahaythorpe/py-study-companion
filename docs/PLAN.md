# Plan

## Goal

Ship a working, deployed study app in one weekend.

## Scope

**In v1**
- Multiple-choice quizzes by topic
- Flashcards by topic
- Per-topic accuracy and weak-topic flags
- Progress stored in localStorage
- Live on Vercel, with a README

**Not in v1**
- Login or accounts
- Database
- AI-generated questions
- Timed mock exams
- Mobile app

If an idea isn't on the "In" list, add it to the "Later" section at the bottom and keep building.

## Topics

| id | Topic |
|---|---|
| `corps-act` | Corporations Act and the regulatory framework |
| `best-interests` | Best interests duty and related obligations |
| `soa-roa` | Statement of Advice and Record of Advice |
| `ethics` | Code of Ethics |
| `behavioural-finance` | Behavioural finance and client behaviour |

## Weekend schedule

| Block | Build | Stop when |
|---|---|---|
| Sat AM | Scaffold, push to GitHub, types, 20 seed questions | The repo is on GitHub and the homepage lists the 5 topics from the JSON |
| Sat PM | Quiz flow | You can finish a 5-question quiz on one topic and see your score |
| Sun AM | Progress + scheduler + dashboard | A question you got wrong comes back first, and the weak topic is flagged |
| Sun PM | Flashcards, deploy, README | You have a live URL and the README has a screenshot |

**If you run over:** cut flashcards first. The quiz plus weak-topic tracking is the core.

**Done means:** live URL, 20+ questions, and the weak-topic logic works. Stop there, even if it's ugly.

## Later (v2 ideas)

- Timed mock exam mode
- Import questions from CSV
- Stats over time (chart)
- Supabase sync across devices
