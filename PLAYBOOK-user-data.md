# Playbook — User data system

> **Status: DRAFT.** Build everything now; team answers may change it later.
> - Work on branch `feature/user-data` (pushing `main` redeploys the live game).
> - Master switch `collectionEnabled: false` until ethics approval. Test data only.

## Goal
Securely save player data (research + analytics), with consent, optional accounts, self-service deletion — built so the backend can be swapped later.

## Simple picture
- Game → **one small "data layer" in our code** → backend (Supabase for now) → researchers.
- Game screens never talk to Supabase directly. Only the data layer does.
- Swap backend later (e.g. uni server) = rewrite the data layer only; screens untouched.
- No consent = nothing leaves the device.

## Glossary (one line each)
| Term | Plain meaning |
|---|---|
| Backend | Service between game and database that enforces rules |
| Supabase | Hosted backend: database + login + rules |
| Postgres | Database engine; Supabase and most uni servers both use it |
| Data layer | Our own file(s) the game calls: `save()`, `login()`, `deleteMe()` |
| Adapter | One backend-specific version of the data layer |
| Config | One file holding rules (consent version, login modes) |
| Auth | Login system; proves who a player is |
| Magic link | Emailed one-click login link; no password |
| Anonymous login | Invisible guest ID; can upgrade to email later |
| RLS | Row-level security: "players see only their own rows" |
| Anon key | Public key in game code; safe *only because* RLS exists |
| Service key | Master key; bypasses RLS; never in code or repo |
| Migration | SQL file that builds/changes tables; tracked in git |
| GDPR | EU privacy law; applies to all EU players |

## Built to swap (rules)
| Rule | Why |
|---|---|
| Screens call only `src/lib/data/` | Backend swap touches one folder |
| Consent + login rules live in `config.js` | Change rules without hunting through screens |
| Consent text has a version number | New rules → players re-asked, old answers stay valid |
| Tables use plain Postgres SQL | Same SQL runs on uni Postgres server |
| Supabase-only parts kept in separate files | Clear list of what to rewrite on move |
| `local` adapter (saves to device only) | Build + test UI with no backend at all |
| `collectionEnabled` switch in config | Nothing sent to any backend until approval |

What a uni-server move would still need rewritten:
- Login (Supabase Auth → uni login or own)
- Security rules (`auth.uid()` is Supabase-specific)
- Delete + retention jobs
- A small API server (Supabase gives this for free)

## Decisions (draft — confirm with team)
| Topic | Draft decision | Swappable via |
|---|---|---|
| Purpose | Research + analytics | privacy docs |
| Backend | Supabase, EU (Frankfurt) | adapter |
| Login | Email magic link | config + adapter |
| Login required? | No — guest play | config |
| Guest ID | Supabase anonymous login | adapter |
| Minors | Under 18: guest only | config |
| Consent | Screen before demographics; "no" = nothing sent | config + versioned text |
| Data | Demographics, choices, timing, device/language, scores | config (event list) |
| Detail | Events + end summary | config |
| Household | Categories only | config |
| Learning | Pre + post self-rating | screen |
| Offline | Queue on device, retry | data layer |
| Replays | Survey once; household asked each game, pre-filled; data per playthrough | data layer |
| Access | Named researchers, 2FA | backend settings |
| Retention | Study end, max 2 years | config + job |
| Deletion | "Delete my data" button | adapter |
| Email sender | Resend free tier | backend settings |
| Ethics review | Not done → step 1 prepares | — |

## Security rules (always true, any backend)
- Email lives only in the login system — never in game tables.
- No names, addresses, IPs, full user-agent strings in tables.
- Device stored as `phone / tablet / desktop` only.
- Master/service keys: never in repo, never in frontend.
- Security rules on every table before any data arrives.

## Tables (planned)
| Table | One row per | Key fields |
|---|---|---|
| `profiles` | player | age bracket, gender, created |
| `consents` | consent given | version, research, analytics, given/withdrawn |
| `sessions` | playthrough | start, end, language, device class, game version |
| `events` | choice/screen | type, screen, small payload, time |
| `results` | finished game | prep scores, total, call score, ending, household, pre/post rating |

## Steps
Each: **creates / changes / spends**. Phase A = backend-free. Phase B = Supabase (≈30% rewrite if uni server chosen).

### Phase A — backend-free
1. **Privacy docs draft for ethics review**
   - Creates: `docs/data/privacy-notice.md`, `docs/data/data-summary.md`
   - Spends: nothing
2. **Data layer + config + local adapter**
   - Creates: branch `feature/user-data`; `src/lib/data/index.js`, `config.js` (with `collectionEnabled: false`), `localAdapter.js`
   - Why: every later step plugs in here
3. **Consent screen**
   - Creates: `src/components/Consent.jsx` + `.css`
   - Changes: `src/App.jsx`, `src/i18n/en.json`, `src/i18n/et.json`
4. **Save demographics + household (via data layer)**
   - Changes: `src/App.jsx`, `src/components/Demography.jsx`
5. **Event logger + offline queue**
   - Changes: `src/lib/data/index.js`, `src/components/InkStory.jsx`
   - Adds: playthrough number (1, 2, 3…) so replays can be separated
6. **End summary + post self-rating**
   - Creates: `src/components/PostRating.jsx` (reuses `Demography.css`)
   - Changes: `src/components/InkStory.jsx` (result saved there), i18n files
   - Rating shown **before** the ending screen
7. **Portable table design**
   - Creates: `db/schema.sql` (plain Postgres, no Supabase features)

### Phase B — backend (Supabase; test data only)
8. **Create Supabase EU project (you click, I guide)**
   - Creates: Supabase account + project
   - Spends: free tier (€0)
9. **Lock down access**
   - Changes: 2FA on Supabase + GitHub; researcher list
10. **Apply tables + security rules + tests**
    - Creates: `supabase/migrations/001_schema.sql`, `002_rls.sql`, `supabase/tests/rls.sql`
11. **Login setup**
    - Changes: Supabase auth (anonymous + magic link)
    - Creates: Resend account, custom SMTP
    - Spends: free tier (€0)
12. **Supabase adapter**
    - Also: send last batch on page close (O15)
    - Creates: `src/lib/data/supabaseAdapter.js`, `.env.local` (git-ignored)
    - Changes: `package.json` (+ `@supabase/supabase-js`), `.github/workflows/deploy.yml`, GitHub secrets
13. **Account screen (magic link, 18+ gate)**
    - Creates: `src/components/Account.jsx` + `.css`
    - Changes: `src/components/Menu.jsx`, i18n files
14. **"Delete my data" button**
    - Creates: `supabase/migrations/003_delete_my_data.sql`
    - Changes: `src/components/Menu.jsx`
15. **Retention auto-delete**
    - Creates: `supabase/migrations/004_retention.sql`
16. **Researcher export (no emails)**
    - Creates: `supabase/migrations/005_export_view.sql`, `docs/data/export-howto.md`
17. **End-to-end test + security review**
    - Changes: nothing unless bugs found

## Gate rule
One step at a time. Each needs your "yes" before it starts and after it ends.
No real player data before ethics approval. Merge to `main` only after team agrees.
