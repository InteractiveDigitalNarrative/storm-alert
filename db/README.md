# Database — portable schema

- [schema.sql](schema.sql) = plain PostgreSQL 13+. No Supabase features.
- Runs on Supabase **or** a university Postgres server.
- Supabase extras (login link, security rules) come later in `supabase/migrations/`.
- Allowed values mirror `src/lib/data/config.js` → change both together.

## Tables
| Table | One row per | Linked to |
|---|---|---|
| `players` | player | — |
| `consents` | consent answer | player |
| `profiles` | player (start survey) | player |
| `sessions` | playthrough | player |
| `households` | playthrough | session |
| `events` | screen view / choice / resume | session |
| `results` | finished playthrough | session |

Delete a `players` row → all their rows go (cascade).

## Data layer → table
| Data layer sends | Goes to | Note |
|---|---|---|
| `saveProfile` | `profiles` | `at` → `created_at` |
| `saveSession` (start) | `sessions` insert | `started_at` |
| `saveSession` (end) | `sessions` update | `ended_at`, `completed` |
| `saveHousehold` | `households` upsert | Merge family + home |
| `logEvents` | `events` | Batch insert |
| `saveResult` | `results` | One per session |
| `saveConsent` | `consents` | New row each answer |

`player_id` is added by the adapter (Supabase: logged-in/guest user id).

## Handy queries
| Question | Query idea |
|---|---|
| Drop-out rate | `sessions` where `ended_at is null` |
| Drop-out point | last `events` row per unfinished session |
| Pre/post change | `profiles.feel_prepared_before` vs `results.feel_prepared_after` |
| First plays only | `sessions.playthrough = 1` |
| Time per screen | gap between `screen_view` rows; skip gaps ending in `resume` |

## Tested
PostgreSQL 18.3 (PGlite): 21/21 — valid data, 14 bad-data rejects, cascade delete.
