**Subject:** 72 Hours — player data: 10 quick questions

Hi,

Following up on our chat. Here are the open questions. Each one has my **draft answer**. Reply "OK", pick a letter, or write "other: …".

**Q1 — Where should the data live?**
- **Draft: A. Supabase, EU servers.** Free, ready now, login built in. Downside: an outside company holds the data.
- B. University server. The university controls the data, but someone has to build and maintain it.
- C. Supabase now, move later. Fast start, but about 30% of the backend work is redone.

**Q2 — How do players log in?**
- **Draft: A. Email magic link** (a one-click link sent by email). No passwords are stored, but players need access to their email.
- B. University login (SSO). Trusted, but only university people can log in.
- C. Email + password. Familiar, but we have to store passwords and handle resets.
- D. Google sign-in. One tap, but data is shared with Google.

**Q3 — Do we need accounts?**
- **Draft: A. Optional, guests can play.** Few players drop off, and follow-up contact is still possible.
- B. Guests only. Simplest and safest, but no follow-up and no play across devices.
- C. Accounts required. Clean per-person data, but many players quit at login.

If we never need to contact players later, B is enough.

**Q4 — Consent style**
- **Draft: A. One tick for research + analytics, in Estonian and English.** One simple choice, but players can't agree to only one of the two.
- B. Two separate ticks. More precise, but one more decision for players.

**Q5 — Players under 18**
- **Draft: A. Guest play only, no email.** We keep school players, but ethics may still require guardian consent.
- B. No data collected from them. Simplest legally, but we lose school data.
- C. Allowed with guardian consent. Full data, but a heavy extra step.

**Q6 — Ethics review**
- Who submits it?
- Which committee?
- What's the deadline?

Without approval, the data usually can't be published.

**Q7 — Study end date**
- **Draft: delete all data after 2 years at most.** GDPR requires a delete date.
- End date: ______

**Q8 — Who can access the database?**
- **Draft: 2–3 named people, 2FA required.** Fewer people means less risk if an account is hacked.
- Names: ______

**Q9 — University rules**
- Is hosting on external EU servers allowed? If not, Q1 becomes B.
- Do we need a DPA (data processing agreement, a contract with the hosting company)?

**Q10 — What we collect**
Please mark anything to drop, or tell me what's missing.

| Group | What | Keep? |
|---|---|---|
| Player (once) | Age group, gender, how prepared before | |
| Household | Family size, elderly, children, building, heating | |
| Playthrough | 1st/2nd play, language, device type, start/end | |
| Actions | Screens opened, choices, time on each | |
| End of game | Supply scores, call result, ending, how prepared after | |

Never collected: names or typed text.

**Location: should we collect it?** Preparedness data by region could be useful for the Estonian government and the Rescue Board (Päästeamet).
- **Draft: A. Ask for the county (maakond) in the start survey.** Simple and clear to players, with no IP address stored. Downside: they can pick a wrong county.
- B. Work out the county from the IP address, then throw the IP away. No extra question, but less accurate (VPNs, mobile networks) and it has to be explained in the consent text.
- C. Store the IP address. Most raw data, but it counts as personal data under GDPR, so it's harder to get through ethics.
- D. No location. Simplest, but no regional data.

Also: would the Rescue Board need a data-sharing agreement? Only group totals would be shared, never individual rows.

Thanks,
Pasha
