# Checklist — User data system (DRAFT)

Read this first every session.

## Resume here
New session? Say: **"Resume user data work — read CHECKLIST-user-data.md"**

| Item | Value |
|---|---|
| Next step | 4 — Save demographics + household (after step 3 review) |
| Last updated | 2026-09-18 |
| Branch | `feature/user-data` |
| Blockers | none |
| Open items | 12 — see "Open items" below |

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
| 2026-09-18 | Step 1 committed (`3c80b47`). Step 2: data layer, allow-list filter, consent gate, local adapter | Review step 2 → step 3 |
| 2026-09-18 | Step 2 committed (`4f5d9aa`). Step 3: consent screen, asked once per version; "no" skips survey. ET text needs native check | Review step 3 → step 4 |


Status: TODO / IN PROGRESS / DONE / BLOCKED

Rules: branch `feature/user-data` · `collectionEnabled: false` · test data only

## Phase A — backend-free
| # | Step | Status | Evidence | Approved |
|---|---|---|---|---|
| 1 | Privacy docs draft | DONE | `docs/data/privacy-notice.md`, `docs/data/data-summary.md` | yes (2026-09-18) |
| 2 | Data layer + config + local adapter | DONE | `src/lib/data/`; smoke test 10/10, lint, build OK | yes (2026-09-18) |
| 3 | Consent screen | DONE | browser test 9/9 (EN/ET, phone), smoke OK, build OK; hidden privacy-notice link | yes (2026-09-18) |
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

## Open items
Found while building. Close before merge unless noted.

| # | Item | From step | Owner | Resolves when | Status |
|---|---|---|---|---|---|
| O1 | Estonian consent text — native check | 3 | team | Native speaker OKs `consent` in `et.json` | OPEN |
| O2 | Estonian privacy notice | 1 | team | `privacy-notice.md` translated | OPEN |
| O3 | Change consent answer later | 3 | Dev | Step 14 delete button clears it | OPEN |
| O4 | Minors can say yes to consent | 3 | team (Q5) | Q5 answered; flow adjusted | OPEN |
| O5 | Resend region + transfer safeguards | 1 | team (Q9) | Region/DPA confirmed | OPEN |
| O6 | Hosting logs (GitHub Pages, Supabase) retention | 1 | Dev + team | Checked; notice updated | OPEN |
| O7 | `[[TBD]]` fields in privacy docs | 1 | team (Q5–Q10) | No `[[TBD]]` left in `docs/data/` | OPEN |
| O8 | Relative's free-text name never sent | 1 | Dev | Step 4 verified; allow-list test | OPEN |
| O9 | Event payload list (allowed types) | 2 | Dev | Step 5 fills `events` in config | OPEN |
| O10 | Pre-existing lint error `src/App.jsx:35` | 3 | Dev | Fixed or accepted (not ours) | OPEN |
| O11 | Publish full privacy notice (EN + ET) + link it | 3 | team + Dev | Hosted (uni site or in-game page); `privacyNoticeUrl` set in config; link visible on consent screen | OPEN |
| O12 | Privacy notice reachable anytime (not only consent) | 3 | Dev | Menu link added (with step 13/14 menu work) | OPEN |

## Questions for co-workers
Full doc + answers: [QUESTIONS-user-data.md](QUESTIONS-user-data.md) (Q1–Q10)

## Before merge to `main` / real data
| Check | Done? |
|---|---|
| Team answered Q1–Q10 | |
| Built steps adjusted to answers | |
| Open items O1–O12 closed or accepted | |
| Ethics approval received | |
| `collectionEnabled` turned on | |
