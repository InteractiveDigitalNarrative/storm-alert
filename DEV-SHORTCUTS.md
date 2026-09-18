# Dev shortcuts

Jump straight to any part of the game while testing. **Dev server only** — they do nothing on the live site.

## Start the dev server
```bash
npm run dev
```
Game: http://localhost:5173/storm-alert/

## Scene jumps
Click a link → lands on that scene, skipping the intro. Add `&lang=et` for Estonian.

### Preparation phase
| Scene | Lands on |
|---|---|
| [prep-hub](http://localhost:5173/storm-alert/?scene=prep-hub) | Preparation hub (Water card → water calc) |
| [pantry-check](http://localhost:5173/storm-alert/?scene=pantry-check) | Pantry Check (Kitchen Report) |
| [cabinet-check](http://localhost:5173/storm-alert/?scene=cabinet-check) | Medicine Cabinet Check |
| [home-setup](http://localhost:5173/storm-alert/?scene=home-setup) | Home Setup (building, heating) |
| [light-audit](http://localhost:5173/storm-alert/?scene=light-audit) | Light Audit |
| [flashlight-fetch](http://localhost:5173/storm-alert/?scene=flashlight-fetch) | Light hub, flashlight fetch |
| [radio-fetch](http://localhost:5173/storm-alert/?scene=radio-fetch) | Info hub, radio fetch |
| [breaking-news](http://localhost:5173/storm-alert/?scene=breaking-news) | TV breaking news |

### Crisis night
| Scene | Lands on |
|---|---|
| [crisis-nolight](http://localhost:5173/storm-alert/?scene=crisis-nolight) | Crisis night, no light prepared |
| [crisis-light](http://localhost:5173/storm-alert/?scene=crisis-light) | Crisis night, flashlight prepared |
| [flashlight-nolight](http://localhost:5173/storm-alert/?scene=flashlight-nolight) | Flashlight search, no light |
| [flashlight-light](http://localhost:5173/storm-alert/?scene=flashlight-light) | Flashlight search, light in known spot |
| [consequence-light](http://localhost:5173/storm-alert/?scene=consequence-light) | Consequence card, well prepared |
| [consequence-light-bad](http://localhost:5173/storm-alert/?scene=consequence-light-bad) | Consequence card, underprepared |

### Ending
| Scene | Lands on |
|---|---|
| [call-power](http://localhost:5173/storm-alert/?scene=call-power) | Power-outage emergency call |
| [ending-screen](http://localhost:5173/storm-alert/?scene=ending-screen) | Post-game rating → results |

- Post-game rating shows only if consent = yes. No consent → straight to results.
- Scene jumps don't start a research session (keeps test data clean).

Source: `DEV_SCENES` in `src/components/InkStory.jsx`.

## Player data — browser console
Open DevTools (Cmd+Option+J) → paste.

| Do | Paste |
|---|---|
| See saved data | `Object.fromEntries(Object.entries(localStorage).filter(([k]) => k.startsWith('storm_data')))` |
| Ask consent again | `localStorage.removeItem('storm_data_v1:consent')` |
| Ask survey again | `localStorage.removeItem('storm_survey_done')` |
| Items waiting to send | `JSON.parse(localStorage.getItem('storm_data_queue') \|\| '[]')` |
| Fresh player (wipe all) | `localStorage.clear()` |

Reload the page after removing anything.

## Jump anywhere in the story
Console: `window.story.ChoosePathString('<knot>')` — knot names in `public/ink/72Hours.ink` (`=== name ===`).
