# Summary — User data system (so far)

> Short "where are we" view. Details: [CHECKLIST-user-data.md](CHECKLIST-user-data.md) · Plan: [PLAYBOOK-user-data.md](PLAYBOOK-user-data.md) · Testing: [DEV-SHORTCUTS.md](DEV-SHORTCUTS.md)

Last updated: 2026-09-18 · Branch: `feature/user-data` · Nothing live, nothing sent anywhere

## Big picture
- Phase A (no backend): **✅ all 7 steps done**
- Phase B (Supabase): not started
- Master switch `collectionEnabled: false` → all data stays on the device
- Not on `main` → the live game is unchanged

## What's built
| Step | What | Commit |
|---|---|---|
| ✅ 1 | Privacy notice + data summary drafts for ethics review | `3c80b47` |
| ✅ 2 | Data layer: the one place screens save through | `4f5d9aa` |
| ✅ 3 | Consent screen (EN + ET) | `3c89d11` |
| ✅ 4 | Survey + household saved; survey once; household pre-fill | `d7660b5` |
| ✅ 5 | Events, sessions, offline queue | `6052312` |
| ✅ 6 | Post-game rating (before results) + result saved | `bc31f20` |
| ✅ 7 | Portable database design (7 tables, plain Postgres) | STEP7SHA |

## How it works now
1. Player picks a language.
2. **Consent screen** asks once per consent version.
3. **No** → nothing saved, straight to the game.
4. **Yes** → survey (asked once only) → game.
5. Household questions each game, **pre-filled** from last time.
6. Saved: age, gender, past preparation, how prepared they feel, household categories.
7. Each game = one session (playthrough no., language, device type, version).
8. Screens + choices logged as short ids with timing.
9. At the end: "How prepared do you feel now?" → then results. Scores + rating saved.
10. Quit mid-game → kept up to last screen; unfinished session shows the drop-out point. Continue → same session + `resume` marker.
11. Everything goes through an on-device queue; sent in order, retried if offline.

## Safety built in
| Protection | Effect |
|---|---|
| Consent gate | No "yes" → nothing saved |
| Allow-list | Only listed fields, short values |
| Name filter | Relative's typed name never saved to data |
| Master switch | Device-only until ethics approval |
| Delete | Wipes data + queue + device conveniences |
| Choice ids only | Knot + number, never displayed text |
| Device type | phone / tablet / desktop — no user-agent |

## Decisions made along the way
| Decision | Why |
|---|---|
| Survey asked once | A repeat "before" rating isn't a true baseline |
| Household asked each game, pre-filled | Drives the story; replays teach |
| Household stored per playthrough | Same player may try different households |
| Privacy link hidden until hosted | Never send players to a dead page |
| Rating before results | Scores would sway the answer |
| "Feel prepared" asked at start + end | Same wording + scale → true before/after pair |

## Waiting on others
- Team answers Q1–Q10 → [QUESTIONS-user-data.md](QUESTIONS-user-data.md)
- Estonian text check (consent + notice)
- Where the privacy notice is hosted
- Ethics approval
- Team OK on the new "feel prepared" start question

Open items: 16 (4 done) → see checklist.

## Next
| Step | What |
|---|---|
| 8 | Create Supabase EU project (you click, I guide) |
| 9 | Lock down access (2FA) |
| 10 | Tables + security rules + tests |
