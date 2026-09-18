# Lessons — Player data, explained simply

> Three short lessons. Read in order. ~10 min total.
> 1. What we built (Phase A)
> 2. How a backend works
> 3. What we build next (Phase B)
>
> Terms: [PLAYBOOK glossary](PLAYBOOK-user-data.md#glossary-one-line-each) · Progress: [SUMMARY](SUMMARY-user-data.md)

---

## Lesson 1 — What we built (Phase A)

### The one-picture version
Think of the game as a **restaurant**.

| Restaurant | Our game |
|---|---|
| Dining room | The game on the player's screen |
| Waiter | **Data layer** (`src/lib/data/`) |
| Kitchen | **Backend** (not built yet) |
| Labelled shelves in the pantry | **Database tables** (`db/schema.sql`) |

- Screens never walk into the kitchen. They only talk to the waiter.
- Change kitchens later (Supabase → university server)? Only the waiter's route changes. Screens stay the same.

### Where data lives today
- In the player's **own browser** only (`localStorage` = a small notebook the browser keeps per website).
- Nothing is sent anywhere. The **master switch** (`collectionEnabled: false`) is like a closed main water valve.

### Step by step

**Step 1 — Privacy docs**
- ELI5: we wrote down our promise *before* collecting anything.
- `privacy-notice.md` = the promise players read.
- `data-summary.md` = the detailed version for the ethics committee.
- Why: ethics review checks this first; it also forced us to decide what we'll never collect.

**Step 2 — Data layer (the waiter)**
- ELI5: one waiter carries every order. He follows three rules:
  - **Permission slip** — no "yes" to consent → he carries nothing.
  - **Guest list (allow-list)** — only named fields get in; long text and names are turned away.
  - **Master switch** — while off, orders go to the local notebook, never out.
- Why: rules in one place can't be forgotten by a screen.

**Step 3 — Consent screen**
- ELI5: the permission slip. "Yes" and "No" look the same so nobody is pushed.
- "No" → game still works, nothing saved.
- Asked once per **version** of the text; new text → asked again.

**Step 4 — Survey + household**
- Survey asked **once** (a second "before" answer isn't really "before").
- Household asked every game, **pre-filled** from last time.
- The relative's typed name stays in the device notebook only — never handed to the waiter.

**Step 5 — Diary of a playthrough**
- **Session** = one playthrough. Numbered 1, 2, 3…
- **Events** = diary lines: "saw screen X", "picked choice 2", "came back after a break".
- Choices saved as short ids (`tv_start` / 2), not the sentence on screen.
- **Offline queue** = an outbox tray. Every note goes in the tray first, then gets sent. No internet → it waits in the tray and tries again later.
- Quit mid-game → the diary stops there. That shows *where* people give up.

**Step 6 — Before/after question**
- Start: "How prepared do you feel right now?"
- End: same question, asked **before** showing scores — like asking "how did you do?" before handing back the graded test.
- Same words, same scale → a fair before/after comparison.

**Step 7 — Database design**
- ELI5: labelled shelves with rules on each shelf.
  - Age shelf only accepts the 7 age groups. "Twenty" is refused.
  - Device shelf only accepts phone / tablet / desktop.
- **Cascade delete** = every item is tagged with the player's id; pull that tag and everything with it goes.
- Written in plain Postgres so any Postgres kitchen can use it.

---

## Lesson 2 — How a backend works

### Why we need one
- Today the game is on GitHub Pages = a **printed flyer**. Everyone gets a copy; nobody can write back to you.
- To collect answers you need a **mailbox you own** that receives, checks and stores them. That's the backend.

### The journey of one answer
1. Player taps a choice.
2. Waiter (data layer) puts a note in the outbox tray.
3. **Adapter** sends it over the internet — sealed envelope (**HTTPS** = encrypted, nobody can read it on the way).
4. Backend **front desk** (API) receives it.
5. Front desk checks **who sent it** (auth) and **whether they may write there** (security rules).
6. Note goes on the right shelf (database table).
7. Front desk replies "got it" → note leaves the tray.

### The four security ideas
| Idea | ELI5 | Why it matters |
|---|---|---|
| **Auth** (login) | A wristband proving who you are | Rows get the right owner |
| **Anon key** | A public door key that only opens the lobby | Safe to put in game code — but only because of RLS |
| **RLS** (row-level security) | Every locker opens only for its owner's wristband | A player can't read or change anyone else's data |
| **Service key** | The building's master key | Opens everything → **never** in the game or the repo |

### Two kinds of login (planned)
- **Guest (anonymous)** — invisible wristband, no email. Default.
- **Magic link** — optional; we email a one-click link. No passwords to leak.

### Why Supabase
- Gives front desk + wristbands + database in one package.
- Free tier, EU (Frankfurt) servers.
- Uses Postgres underneath → our shelves (`schema.sql`) fit as-is.

---

## Lesson 3 — What we build next (Phase B)

**All test data only** until ethics approval. Master switch stays off on the live game.

| # | Step | ELI5 |
|---|---|---|
| 8 | Create Supabase project (EU) | Rent the kitchen |
| 9 | Lock down access (2FA) | Two locks on the staff door |
| 10 | Tables + security rules + tests | Put up the shelves + locker rules, then try to break in |
| 11 | Login setup + email sender | Wristband machine + the service that sends magic links |
| 12 | Supabase adapter | Teach the waiter the route to the new kitchen |
| 13 | Account screen (18+ only) | Optional "add your email" desk |
| 14 | "Delete my data" button | Player can empty their own locker any time |
| 15 | Auto-delete after study end | Timer that clears old shelves |
| 16 | Researcher export (no emails) | A clean copy for researchers, no contact details |
| 17 | End-to-end + security review | Full rehearsal + a burglar check |

### If the team picks a university server instead
| Stays | Rewritten |
|---|---|
| All screens | Login |
| Data layer rules | Security rules |
| Queue, events, sessions | Delete + auto-delete jobs |
| `db/schema.sql` shelves | A small front desk (API) server |

That's why we built "swap-ready": roughly 30% of the backend work changes, 0% of the game.

---

## Check yourself
1. Why do screens only talk to the data layer?
2. What stops a player reading someone else's data?
3. Why is the anon key safe in the game but the service key isn't?
4. What happens to a player's notes if their wifi drops?
5. Why is the end question asked before the scores?

<details>
<summary>Answers</summary>

1. So a backend swap only changes one folder, and the rules live in one place.
2. RLS — each row only opens for its owner.
3. Anon key only opens the lobby; RLS guards the lockers. Service key bypasses RLS.
4. They wait in the outbox tray (queue) and are sent when back online.
5. Seeing scores first would change how prepared they say they feel.

</details>
