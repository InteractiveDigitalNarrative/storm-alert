# Checklist — IDN platform landing page

Read this first every session.

## Resume here
New session? Say: **"Resume platform work — read CHECKLIST-platform.md"**

| Item | Value |
|---|---|
| Next step | DESIGN.md (local), then 11 — Storm Alert link |
| Last updated | 2026-09-22 |
| Deadline | Investor demo in 2–4 weeks |
| Art budget | $5 total · spent $0.72 |
| Blockers | none |

**How we work (step gate)**
1. Dev says what the step creates / changes / spends.
2. You approve.
3. Dev does only that step.
4. Dev shows result, updates row + "Resume here", waits.

**Files**
| File | Purpose |
|---|---|
| [PLAYBOOK-platform.md](PLAYBOOK-platform.md) | Goal, decisions, steps |
| This file | Tracker + resume point |
| [CHECKLIST-user-data.md](CHECKLIST-user-data.md) | Paused research-data work (Phase B) |

Status: TODO / IN PROGRESS / ✅ DONE / BLOCKED

## Steps
| # | Step | Status | Evidence | Approved |
|---|---|---|---|---|
| 1 | Shared data contract | ✅ DONE | `docs/platform/data-contract.md` | playbook yes (2026-09-22) |
| 2 | Scaffold landing repo | ✅ DONE | `../interactivedigitalnarrative.github.io`; install, lint, build OK; assets at `/assets/` | yes (2026-09-22) |
| 3 | Design system + page shell | ✅ DONE | tokens, Header/Footer, branch rule; lint, build, detector clean; phone + desktop screenshots | yes (2026-09-22) |
| 4 | Catalogue data | ✅ DONE | `src/data/stories.json` + `themes.json`; contract section; validated, lint, build OK | yes (2026-09-22) |
| 5 | Key art (≤ $5) | ✅ DONE | `public/art/` 1 hero + 5 posters (webp, borders cropped); paths in `stories.json`; $0.72; raw in gitignored `art/` | yes (2026-09-22) |
| 6 | Gameplay teaser | SKIPPED | deferred; hero = slow zoom only | user (2026-09-22) |
| 7 | Hero + shelves | ✅ DONE | Hero (slow zoom), 4 shelves, theme chips, `lib/storage.js`; themed selection/scrollbars; lint, build; phone + desktop, guest + signed-in shots, no sideways scroll | yes (2026-09-22) |
| 8 | Detail pop-up + Play | ✅ DONE | `StoryModal` (native dialog): Esc, backdrop, focus trap, scroll lock tested phone + desktop; Play/Continue/Coming soon; endings dots | yes (2026-09-22) |
| 9 | Mock sign-in | ✅ DONE | `SignInModal` (email → fake link → signed in), account menu + sign-out (clears `idn.v1.*`, keeps game keys), guest hint in pop-up; flow tested phone + desktop | yes (2026-09-22) |
| 10 | Profile page | ✅ DONE | `ProfileModal` (offered after sign-in + "Edit profile" in menu); options match game survey; saves `idn.v1.profile`, bad data cleaned on read; tested phone + desktop | yes (2026-09-22) |
| 11 | Storm Alert link | TODO | | |
| 12 | End-to-end test + responsive check | TODO | | |
| 13 | Publish | TODO | | |

## Session log
| Date | Done | Next |
|---|---|---|
| 2026-09-22 | Interview, playbook, checklist | Approve → step 1 |
| 2026-09-22 | Playbook approved. Step 1: data contract (3 keys, one writer each, Storm Alert behaviour) | Review step 1 → step 2 |
| 2026-09-22 | Step 1 approved; ✅ ticks. Step 2: landing repo scaffolded locally (no remote, uncommitted) | Review step 2 → step 3 |
| 2026-09-22 | Step 3: design system + shell; PRODUCT.md in landing repo. Finish review + DESIGN.md deferred to after step 8 | Review step 3 → step 4 |
| 2026-09-22 | Design rule added: theme text selection + scrollbars (do in step 7) | Step 4 (confirm placeholder themes) |
| 2026-09-22 | Step 4: catalogue (5 stories, 5 themes), placeholders OK for now | Step 5 — draft art prompts, cost first |
| 2026-09-22 | Art style set (playbook). Hero: v1, edit v2, fresh v3 → v3 kept. Rule: POC art = one shot | Draft 5 poster prompts, one approval |
| 2026-09-22 | 5 posters (one shot each), borders cropped, web export (8–58 KB), wired into catalogue | Step 6 — teaser recording ($0) |
| 2026-09-22 | Step 6 skipped: hero uses slow zoom only, teaser maybe later | Step 7 — hero + shelves |
| 2026-09-22 | Step 7: hero + shelves built; phone hero reframed so cabin shows | Review step 7 → step 8 |
| 2026-09-22 | Display font Bodoni Moda → Fraunces ("for now", may revisit) | Review step 7 → step 8 |
| 2026-09-22 | Step 8: detail pop-up built + tested. Deferred: finish review + DESIGN.md (was "after step 8") | Review step 8 → step 9 |
| 2026-09-22 | Step 9: mock sign-in + sign-out built and tested; shared `Dialog.css` shell | Review step 9 → step 10 |
| 2026-09-22 | Step 10: profile built + tested (save, edit, clean, sign-out) | Design review + DESIGN.md → step 11 |
| 2026-09-22 | Footer redesigned (forked line, statement, Explore links, demo pill); served at localhost:5174 | Design review + DESIGN.md → step 11 |
| 2026-09-22 | Not every IDN branches: slogan "Stories you step into.", footer diamond ornament, endings UI only when endingsTotal ≥ 2 (else "Completed ✓"), shelf "Your endings" → "Completed"; contract + PRODUCT.md updated | Design review + DESIGN.md → step 11 |
| 2026-09-22 | Storm Alert shows "4 outcomes" (new `endingsLabel` field; outcomes set by final call, ink lines 2010–2033). Heading fork → diamond + hairline sized to heading text | Design review + DESIGN.md → step 11 |
| 2026-09-22 | Design review: 8 fixes applied (no duplicate shelves, "New" hidden once played, no labels above titles, wider desktop cards, 44px targets, synopsis copy, check icon). Landing repo committed locally (no remote yet) | DESIGN.md → step 11 |
