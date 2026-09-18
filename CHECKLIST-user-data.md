# Checklist — User data system (DRAFT)

Read this first every session.

## Resume here
New session? Say: **"Resume user data work — read CHECKLIST-user-data.md"**

| Item | Value |
|---|---|
| Next step | 2 — Data layer + config + local adapter (after step 1 review) |
| Last updated | 2026-09-18 |
| Branch | `feature/user-data` (not created yet — step 2) |
| Blockers | none |

**How we work (grill-me gate)**
1. Dev says what the step creates / changes / spends.
2. You approve.
3. Dev does only that step.
4. Dev shows result, updates row + "Resume here", waits.

**Files**
| File | Purpose |
|---|---|
| [PLAYBOOK-user-data.md](PLAYBOOK-user-data.md) | Plan, decisions, glossary |
| This file | Tracker + resume point |
| [QUESTIONS-user-data.md](QUESTIONS-user-data.md) | Co-worker questions + answers |

**Key facts (no need to re-derive)**
- Game = static site, GitHub Pages; push to `main` auto-deploys.
- Demographics currently only `console.log` → `src/App.jsx:57`.
- Scores: `total_prep`, `callScore`, `ending_type` → `src/components/EndingScreen.jsx:45`.
- Ink vars (`prep_*`, household) → `public/ink/72Hours.ink`.
- User is new to backend: explain ADHD-friendly, define terms once.

## Session log
| Date | Done | Next |
|---|---|---|
| 2026-09-18 | Interview, playbook, checklist, team questions | Step 1 |
| 2026-09-18 | Step 1: privacy notice + data summary drafts; relative-name free text flagged as never-collect | Review step 1 → step 2 |


Status: TODO / IN PROGRESS / DONE / BLOCKED

Rules: branch `feature/user-data` · `collectionEnabled: false` · test data only

## Phase A — backend-free
| # | Step | Status | Evidence | Approved |
|---|---|---|---|---|
| 1 | Privacy docs draft | DONE | `docs/data/privacy-notice.md`, `docs/data/data-summary.md` | yes (2026-09-18) |
| 2 | Data layer + config + local adapter | TODO | | |
| 3 | Consent screen | TODO | | |
| 4 | Save demographics + household | TODO | | |
| 5 | Event logger + offline queue | TODO | | |
| 6 | End summary + post rating | TODO | | |
| 7 | Portable table design | TODO | | |

## Phase B — backend
| # | Step | Status | Evidence | Approved |
|---|---|---|---|---|
| 8 | Create Supabase EU project | TODO | | |
| 9 | Lock down access (2FA) | TODO | | |
| 10 | Tables + RLS + tests | TODO | | |
| 11 | Login setup + SMTP | TODO | | |
| 12 | Supabase adapter | TODO | | |
| 13 | Account screen, 18+ gate | TODO | | |
| 14 | Delete-my-data button | TODO | | |
| 15 | Retention auto-delete | TODO | | |
| 16 | Researcher export | TODO | | |
| 17 | End-to-end + security review | TODO | | |

## Questions for co-workers
Full doc + answers: [QUESTIONS-user-data.md](QUESTIONS-user-data.md) (Q1–Q10)

## Before merge to `main` / real data
| Check | Done? |
|---|---|
| Team answered Q1–Q10 | |
| Built steps adjusted to answers | |
| Ethics approval received | |
| `collectionEnabled` turned on | |
