# Summary — User data system (so far)

> Short "where are we" view. Details: [CHECKLIST-user-data.md](CHECKLIST-user-data.md) · Plan: [PLAYBOOK-user-data.md](PLAYBOOK-user-data.md)

Last updated: 2026-09-18 · Branch: `feature/user-data` · Nothing live, nothing sent anywhere

## Big picture
- Phase A (no backend): **4 of 7 steps done**
- Phase B (Supabase): not started
- Master switch `collectionEnabled: false` → all data stays on the device
- Not on `main` → the live game is unchanged

## What's built
| Step | What | Commit |
|---|---|---|
| 1 | Privacy notice + data summary drafts for ethics review | `3c80b47` |
| 2 | Data layer: the one place screens save through | `4f5d9aa` |
| 3 | Consent screen (EN + ET) | `3c89d11` |
| 4 | Survey + household saved; survey once; household pre-fill | STEP4SHA |

## How it works now
1. Player picks a language.
2. **Consent screen** asks once per consent version.
3. **No** → nothing saved, straight to the game.
4. **Yes** → survey (asked once only) → game.
5. Household questions each game, **pre-filled** from last time.
6. Saved: age, gender, prep level, household categories.

## Safety built in
| Protection | Effect |
|---|---|
| Consent gate | No "yes" → nothing saved |
| Allow-list | Only listed fields, short values |
| Name filter | Relative's typed name never saved to data |
| Master switch | Device-only until ethics approval |
| Delete | Wipes data + device conveniences |

## Decisions made along the way
| Decision | Why |
|---|---|
| Survey asked once | A repeat "before" rating isn't a true baseline |
| Household asked each game, pre-filled | Drives the story; replays teach |
| Household stored per playthrough | Same player may try different households |
| Privacy link hidden until hosted | Never send players to a dead page |

## Waiting on others
- Team answers Q1–Q10 → [QUESTIONS-user-data.md](QUESTIONS-user-data.md)
- Estonian text check (consent + notice)
- Where the privacy notice is hosted
- Ethics approval

Open items: 13 (1 done) → see checklist.

## Next
| Step | What |
|---|---|
| 5 | Event logger + offline queue + playthrough number |
| 6 | End summary + post-game rating |
| 7 | Portable table design |
