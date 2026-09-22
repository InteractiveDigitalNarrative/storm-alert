# Platform data contract (demo, v1)

How the landing page and every IDN share the player's sign-in, profile and progress.

## Simple picture
- Landing page and all games live on **one domain** → they share **one browser store** (`localStorage`).
- The landing page writes **who you are**.
- Each game reads that, and writes **how far you got**.
- Nothing leaves the device. Demo only.

## Keys at a glance
| Key | Written by | Read by | Holds |
|---|---|---|---|
| `idn.v1.session` | Landing | Landing, games | Mock sign-in |
| `idn.v1.profile` | Landing | Landing, games | Basic player info |
| `idn.v1.progress.<storyId>` | That game only | Landing | Progress + endings |

- `<storyId>` = the game's URL folder, e.g. `storm-alert`.
- `v1` = contract version. Breaking change → new version, old keys ignored.

## `idn.v1.session`
```json
{ "email": "mari@example.com", "signedInAt": "2026-09-22T10:00:00Z" }
```
- Present = signed in. Missing = guest.
- Email is only for the mock sign-in screen. Games never read it.

## `idn.v1.profile`
```json
{
  "nickname": "Mari",
  "age": "25_34",
  "gender": "female",
  "language": "et",
  "country": "EE",
  "updatedAt": "2026-09-22T10:02:00Z"
}
```
| Field | Allowed values | Notes |
|---|---|---|
| `nickname` | text, 1–30 chars | Greeting only. Personal data → never in research data |
| `age` | `under_18` `18_24` `25_34` `35_44` `45_54` `55_64` `65_plus` | Same as Storm Alert + `db/schema.sql` |
| `gender` | `male` `female` `non_binary` `prefer_not_say` | Same as Storm Alert + `db/schema.sql` |
| `language` | `en` `et` | Games fall back to their own picker if unsupported |
| `country` | 2-letter code (ISO 3166-1, e.g. `EE`) or `prefer_not_say` | |
| `updatedAt` | ISO date-time | |

- Every field is optional. A missing field means "ask in the game as usual".

## `idn.v1.progress.<storyId>`
```json
{
  "status": "in_progress",
  "playthroughs": 2,
  "lastPlayedAt": "2026-09-22T10:30:00Z",
  "endingsReached": ["partial"],
  "lastEnding": "partial"
}
```
| Field | Meaning |
|---|---|
| `status` | `in_progress` (has a saved game) or `finished` (last run reached an ending) |
| `playthroughs` | Runs started, counting from 1 |
| `lastPlayedAt` | Drives "Continue your story" order |
| `endingsReached` | Unique ending IDs so far, e.g. 1 of 4 |
| `lastEnding` | Ending ID of the most recent finished run, or `null` |

- The total number of endings per story lives in the landing catalogue (`stories.json`), not here.
- Storm Alert ending IDs: `good` `partial` `delayed` `bad`.

## Rules
1. **One writer per key.** Games never write `session` / `profile`. The landing page never writes `progress`.
2. **Games write progress only when signed in** (`idn.v1.session` present). Guests play exactly as today.
3. **Game-private keys get a prefix**: `<storyId>.…` (e.g. `storm-alert.save`).
   - Storm Alert's existing keys stay as they are for now: `storm_save_v1`, `storm_notebook_v2`, `textSpeed`, `soundMuted`.
   - Future games must not use those 4 names.
4. **Read safely.** Wrap every read in try/catch. Bad or missing JSON = treat as absent.
5. **Sign out** (landing) removes every `idn.v1.*` key. Game-private keys stay (same as today).
6. **Stay in sync.** The landing page re-reads on the `storage` event (fires when another tab changes the store) and when the tab regains focus.

## What Storm Alert will do (step 11)
| Profile has | Storm Alert does |
|---|---|
| `language` = `en`/`et` | Skips language select |
| `age` + `gender` | Survey shows only the 2 prep questions |
| Nothing / guest | Unchanged |

- Writes `idn.v1.progress.storm-alert` when a run starts, when it saves, and when it reaches an ending.
- Adds a "Back to library" link → `/`.

## Later: Supabase (Phase B)
| Demo key | Becomes |
|---|---|
| `session` | Supabase login |
| `profile` | `profiles` table (nickname kept apart from research data) |
| `progress` | Built from `sessions` + `results` tables |

- Field names already match `db/schema.sql`, so the swap is mostly the adapter.
