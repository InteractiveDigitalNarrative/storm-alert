# Team questions — Player data system

> **Draft.** We're adding optional data collection to the game for research + analytics.
> Building starts now with test data only. Your answers decide what we change before real players.

## How to answer
- Each question has a **draft answer** (what we'll build unless you say otherwise).
- Reply with an option letter, or "other: …".
- Not sure? Say who would know.

## Context in 30 seconds
- Today: the game is a static site on GitHub Pages. No server. Data never leaves the player's device.
- Plan: a consent screen → if "yes", save demographics, choices, scores to an EU database.
- The game stays fully playable if the player says "no".
- Code is built so the backend can be swapped (e.g. to a university server) later.
- Full plan: [PLAYBOOK-user-data.md](PLAYBOOK-user-data.md)

## Summary
| # | Topic | Draft answer | Blocks |
|---|---|---|---|
| Q1 | Where data lives | Supabase (EU) | Backend work |
| Q2 | Login method | Email magic link | Account screen |
| Q3 | Accounts at all? | Optional | Account screen |
| Q4 | Consent style | One tick | Consent screen |
| Q5 | Minors | Guest only under 18 | Consent, accounts |
| Q6 | Ethics review | Not started | Real data |
| Q7 | Study end date | Unknown | Auto-delete |
| Q8 | Who sees data | 2–3 named people | Access setup |
| Q9 | Uni storage rules | Unknown | Q1 |
| Q10 | What we collect | See list | Consent text |

---

## Q1 — Where should the data live?
**Why it matters:** decides who controls the data and how much server work we do.

| Option | Plus | Minus |
|---|---|---|
| **A. Supabase, EU (draft)** | Free, ready now, login built in | External company holds data |
| B. University server | Uni controls data | Someone must build + maintain it |
| C. Start Supabase, move later | Fast start | ~30% of backend work redone |

**If not A:** we rewrite login, security rules, delete jobs. Screens stay.

## Q2 — How should players log in?
**Why it matters:** passwords are the biggest leak risk.

| Option | Plus | Minus |
|---|---|---|
| **A. Email magic link (draft)** | No passwords stored | Needs email access to log in |
| B. University login (SSO) | Trusted, no new accounts | Only uni people can log in |
| C. Email + password | Familiar | Password storage + resets |
| D. Google sign-in | One tap | Data shared with Google |

## Q3 — Do we need accounts at all?
**Why it matters:** accounts mean storing emails = personal data under GDPR.

| Option | Plus | Minus |
|---|---|---|
| **A. Optional; guests allowed (draft)** | Low drop-off; follow-up possible | Two flows to maintain |
| B. Guest only, no accounts | Simplest, safest | No cross-device play, no follow-up |
| C. Required | Clean per-person data | Many players quit at login |

**Ask yourself:** do we need to contact players later (follow-up survey)? If no → B is enough.

## Q4 — What should consent look like?
**Why it matters:** ethics review checks this wording first.

| Option | Plus | Minus |
|---|---|---|
| **A. One tick: research + analytics (draft)** | One simple choice | Can't say yes to only one |
| B. Two ticks: research / analytics | More precise | One more decision for player |

Also needed:
- Who writes the consent text? (Draft: we write, team reviews.)
- Estonian + English both required? (Draft: yes.)

## Q5 — Minors (under 18)?
**Why it matters:** children's data has stricter rules; schools may be an audience.

| Option | Plus | Minus |
|---|---|---|
| **A. Under 18: guest only, no email (draft)** | Keeps school players | Ethics may still need guardian consent |
| B. Block under 18 from data collection | Simplest legally | Loses school data |
| C. Allow with guardian consent | Full data | Heavy extra flow |

**Ask:** is the game used in schools?

## Q6 — Ethics review
**Why it matters:** research data collected without approval usually can't be published.

- Who submits it?
- Which committee? (e.g. University of Tartu Research Ethics Committee)
- Deadline?
- Do we have a template to follow?

We'll prepare a draft data summary + privacy notice for it.

## Q7 — When does the study end?
**Why it matters:** GDPR needs a delete date. We'll auto-delete emails after it.

- Study end date: ______
- Keep anonymous stats after? (Draft: yes, emails deleted, max 2 years total.)

## Q8 — Who can see the raw data?
**Why it matters:** fewer people = smaller risk if an account is hacked.

- Names of 2–3 people with database access: ______
- Everyone with access must turn on 2FA (a second login step via phone app).
- Others get exported spreadsheets without emails. OK?

## Q9 — University data rules
**Why it matters:** the uni may forbid external hosting → decides Q1.

- Is external hosting (Supabase, EU servers) allowed for research data?
- Does the uni need a data processing agreement (DPA, a contract with the hosting company)?
- Who is the uni data protection contact?

## Q10 — What we plan to collect
**Why it matters:** collect only what the research question needs.

| Data | Example | Keep? |
|---|---|---|
| Age bracket | 25–34 | |
| Gender | female / prefer not say | |
| Prep level before + after | somewhat → fully | |
| Household (categories) | has elderly: yes; apartment | |
| Choices in story | chose to fill bathtub | |
| Scores + ending | water 3/5, ending "cold" | |
| Timing | 4 min on shop screen | |
| Language + device type | et, phone | |

**Never collected:** names, addresses, IP addresses, exact location.

**Ask:** what is the research question? Anything here we don't need? Anything missing?

---

## Answers
| # | Answer | Who | Date |
|---|---|---|---|
| Q1 | | | |
| Q2 | | | |
| Q3 | | | |
| Q4 | | | |
| Q5 | | | |
| Q6 | | | |
| Q7 | | | |
| Q8 | | | |
| Q9 | | | |
| Q10 | | | |
