# Playbook — IDN platform landing page (investor demo)

## Goal
A cinematic landing page that presents our Interactive Digital Narratives, with one shared player profile, ready for an investor demo in 2–4 weeks.

## Decisions
| Topic | Decision |
|---|---|
| Repo | New `interactivedigitalnarrative.github.io` (landing at `/`); games keep own repos at `/<game>/` |
| Domain | One domain for all (GitHub Pages now, custom domain later) |
| Stack | React + Vite |
| Fidelity | Clickable front-end, mock login, nothing sent to a server |
| Brand | Placeholder name, swap later |
| Language | English only |
| Layout | Cinematic hero + story shelves (Netflix-like) |
| Look | Dark cinematic + story-book accents (serif titles, branching-path motifs) |
| Catalogue | Storm Alert (playable) + "IDN 1", "IDN 2"… placeholders |
| Hero media | Slowly zooming key art ("Ken Burns" effect). Gameplay clip deferred (step 6 skipped) |
| Card click | Detail pop-up (modal) → Play |
| Shelves | Continue your story · By theme · New & coming soon · Completed (endings shown only for branching stories) |
| Art | Illustrated key art, max **$5** budget, each brief approved |
| Login | Optional. Browse freely; sign in to play/save |
| Mock sign-in | Email field → fake "magic link" step, labelled demo |
| Consent | Short notice: "Demo — stored on this device only" |
| Profile fields | Nickname, age group, gender, language, country/region |
| Data sharing | Shared browser storage (`localStorage`) with documented keys (same domain) |
| Storm Alert link | Reads profile, skips age + gender; writes progress + ending |
| Game branch | New branch off `main` (`feature/platform-link`) |
| Game deploy | Merge to `main` → live. No profile = game unchanged |
| New repo | User creates on GitHub; Dev builds locally, pushes after OK |

## Art style (every art brief follows this)
| Item | Rule |
|---|---|
| Look | Minimalist flat vector, screen-print poster |
| Shading | One hard-edged shadow tone, no gradients |
| Base | Deep ink `#17131e` + night blue (matches site tokens) |
| Accent | One per story. Storm Alert = amber `#f2b43c` (= `--thread-gold`) |
| Composition | One strong symbol/silhouette, big empty space for title |
| Texture | Subtle paper grain |
| Never | Faces, text, logos, 3D, gloss, gradients |
| Workflow | Hero first → sets the look for the posters |

## Notes
- Profile covers only age + gender from Storm Alert survey. Prep questions stay in the game.
- Nickname = personal data → never in research tables later.
- Storage contract is written so Supabase (Phase B) can replace it with the same shape.
- User-data Phase B paused until this is done.

## Steps
| # | Step | Creates / changes / spends |
|---|---|---|
| 1 | Shared data contract | `docs/platform/data-contract.md`: keys, shapes, who writes what |
| 2 | Scaffold landing repo | Local folder `../interactivedigitalnarrative.github.io`, Vite+React, deploy workflow, `base: '/'` |
| 3 | Design system + page shell | Colours, fonts, spacing, header/footer, placeholder brand |
| 4 | Catalogue data | `stories.json`: Storm Alert + IDN 1–4 (title, blurb, themes, status) |
| 5 | Key art | Illustrations: 1 hero (16:9) + ~5 posters (2:3). **≤ $5**, briefs approved first |
| 6 | Gameplay teaser | Muted screen recording of Storm Alert, short loop (webm). $0 |
| 7 | Hero + shelves | Hero with slow zoom; 4 shelves; mobile + desktop |
| 8 | Detail pop-up + Play | Synopsis, duration, themes, endings badge, Play / "Coming soon" |
| 9 | Mock sign-in | Email → fake magic link → signed in; demo notice; sign out |
| 10 | Profile page | Nickname, age group, gender, language, country; edit anytime |
| 11 | Storm Alert link | Branch `feature/platform-link` off `main`: read profile, skip age/gender, write progress + ending |
| 12 | End-to-end test + responsive check | Full flow in browser: guest, sign-in, play, return, shelves update |
| 13 | Publish | User creates repo → push landing; merge game branch to `main` |
