# Data summary — 72 Hours (DRAFT for ethics review)

> **DRAFT.** Nothing is collected yet. Master switch `collectionEnabled: false`.
> - `[[TBD]]` = team must fill in; (Qn) = linked question in [QUESTIONS-user-data.md](../../QUESTIONS-user-data.md).
> - Player-facing text: [privacy-notice.md](privacy-notice.md).

Last updated: 2026-09-18

---

## 1. Study at a glance
| Item | Value |
|---|---|
| Game | 72 Hours — winter-storm preparedness, browser game |
| Players | General public, EE + EN |
| Research question | `[[TBD]]` (Q10) |
| Consent | Opt-in screen before any data (Q4) |
| Accounts | Optional; guests allowed (Q3) |
| Minors | Guest only, no email (Q5) |
| Storage | Supabase, EU Frankfurt (Q1, Q9) |
| Study end | `[[TBD]]` (Q7) |
| Ethics committee | `[[TBD]]` (Q6) |

## 2. Data flow
1. Player opens game → picks language.
2. Consent screen → **no**: nothing leaves device. **Yes**: continue.
3. Anonymous guest ID created (random, no personal info).
4. Demographics + household answers saved.
5. Game choices + timing saved as events (queued on device, sent when online).
6. End: scores + post-game self-rating saved.
7. Optional: player adds email → can log in on other devices.
8. Researchers export data **without** emails.

## 3. Data inventory
Only collected after consent.

### Survey (start of game)
| Field | Values | Why |
|---|---|---|
| Age bracket | under 18 … 65+ (7 brackets) | Compare groups |
| Gender | male / female / non-binary / prefer not say | Compare groups |
| Prep before | fully / somewhat / never | Baseline |

Source: `src/components/Demography.jsx`

### Household (in game)
| Field | Values | Why |
|---|---|---|
| Family size | number | Scenario context |
| Has elderly / children | yes / no | Scenario context |
| Children count | number | Scenario context |
| Building type | category | Scenario context |
| Heating type | electric / wood-gas / district | Scenario context |

**Excluded:** relative's name — free text in `src/components/FamilySetup.jsx`. Could be a real name.

### Gameplay
| Field | Values | Why |
|---|---|---|
| Choices | Ink knot id + choice number (no text) | What players do |
| Screen views | overlay name or Ink knot id | Where players go |
| Timing | ms since playthrough start | Time per screen (gap between views) |
| Playthrough | number on this device (1, 2, 3…) | Separate first plays from replays |
| Prep scores | water/food/heat/light/info/meds, 0–2 each | Learning outcome |
| Call score + dialed number | number, 112/1220/1247/1343 | Emergency-number knowledge |
| Ending | good / bad / … | Outcome |

Source: Ink vars in `public/ink/72Hours.ink`, `src/components/EndingScreen.jsx`

### After game
| Field | Values | Why |
|---|---|---|
| Prep after | fully / somewhat / never | Pre/post change |

### Technical
| Field | Values | Why |
|---|---|---|
| Language | et / en | Compare versions |
| Device class | phone / tablet / desktop | UX analysis |
| Game version | git commit id | Compare versions |
| Consent record | version, yes/no, date | Proof of consent |

### Accounts only
| Field | Stored where | Why |
|---|---|---|
| Email | Login system only, never game tables | Log in, cross-device |

## 4. Never collected
- Names (player or relatives)
- Address, exact location
- IP address in game tables
- Full user-agent string
- Health data about the player

## 5. Identifiability
| Player type | Identifiable? |
|---|---|
| Guest | Pseudonymous — random ID only |
| Account | Yes, via email — separated in login system |
| Exports | Pseudonymous — no emails |

Risk: small groups (e.g. rare age + household combo) could narrow down a person → report only aggregated results.

## 6. Storage + processors
| Service | Does | Location | DPA |
|---|---|---|---|
| Supabase | Database + login | EU (Frankfurt) | `[[TBD]]` |
| Resend | Login emails | `[[TBD]]` | `[[TBD]]` |
| GitHub Pages | Hosts game files | `[[TBD]]` | `[[TBD]]` |

Open: confirm transfer safeguards for any non-EU service (Q9).

## 7. Access
- Raw data: `[[TBD — 2–3 names]]` (Q8), 2FA required.
- Others: exports without emails.
- Master (service) key: never in code or repo.

## 8. Security measures
| Measure | Effect |
|---|---|
| Row-level security (RLS) on every table | Player reaches only own rows |
| Public key only in game | Useless without RLS permission |
| HTTPS | Encrypted in transit |
| Email separated | Game data alone is pseudonymous |
| 2FA for staff | Stolen password not enough |
| Security rules tested before launch | Checked, not assumed |

## 9. Retention + deletion
| Data | Deleted |
|---|---|
| Emails | Study end `[[TBD]]` (Q7) |
| Game data | Study end, max 2 years |
| Player request | Immediately, "Delete my data" button |

Automatic job deletes expired data.

## 10. Participant rights
- Withdraw consent any time; game still playable.
- Self-service delete in menu.
- Access / copy / correction on request: `[[TBD — contact]]`.

## 11. Risks + mitigations
| Risk | Mitigation |
|---|---|
| Account hacked | 2FA, few people |
| Public key misused | RLS on every table, tested |
| Player types a name | Free text never sent |
| Minor gives email | Under 18 → guest only |
| Re-identification | Categories only; aggregate reports |
| Data kept too long | Auto-delete job |
| Collected before approval | `collectionEnabled: false` until approval |

## 12. Open items for team
| Item | Q |
|---|---|
| Controller + DPO | Q6, Q9 |
| Research question | Q10 |
| Study end date | Q7 |
| Named researchers | Q8 |
| Guardian consent for minors | Q5 |
| External hosting allowed + DPAs | Q9 |
| Estonian translation of notice | Q4 |
