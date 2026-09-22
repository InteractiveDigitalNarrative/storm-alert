// Link to the IDN Library landing page, which shares this site's browser storage.
// Keys and shapes follow the platform data contract (docs/platform/data-contract.md).
// With no library profile or session, the game behaves exactly as before.

const PREFIX = 'idn.v1.';
const STORY_ID = 'storm-alert';

const LANGUAGES = ['en', 'et'];
const AGES = ['under_18', '18_24', '25_34', '35_44', '45_54', '55_64', '65_plus'];
const GENDERS = ['male', 'female', 'non_binary', 'prefer_not_say'];
const ENDINGS = ['good', 'partial', 'delayed', 'bad'];

// Bad or missing JSON = absent
function readJSON(key) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const value = JSON.parse(raw);
    return value && typeof value === 'object' ? value : null;
  } catch {
    return null;
  }
}

export function isSignedIn() {
  return readJSON(`${PREFIX}session`) !== null;
}

// Only the fields this game can use, and only valid values
export function readProfile() {
  const p = readJSON(`${PREFIX}profile`) || {};
  return {
    language: LANGUAGES.includes(p.language) ? p.language : null,
    age: AGES.includes(p.age) ? p.age : null,
    gender: GENDERS.includes(p.gender) ? p.gender : null,
  };
}

// event: 'start' (new run), 'save' (checkpoint), 'ending' (reached an outcome)
// Written only when signed in; the game never writes session or profile.
export function recordProgress(event, ending = null) {
  if (!isSignedIn()) return;
  const key = `${PREFIX}progress.${STORY_ID}`;
  const prev = readJSON(key) || {};
  const reached = Array.isArray(prev.endingsReached) ? prev.endingsReached : [];
  const next = {
    status: 'in_progress',
    playthroughs: Number.isInteger(prev.playthroughs) ? prev.playthroughs : 0,
    lastPlayedAt: new Date().toISOString(),
    endingsReached: reached,
    lastEnding: prev.lastEnding ?? null,
  };
  if (event === 'start') next.playthroughs += 1;
  if (event === 'ending' && ENDINGS.includes(ending)) {
    next.status = 'finished';
    next.endingsReached = [...new Set([...reached, ending])];
    next.lastEnding = ending;
  }
  // A save or ending with no recorded start still counts as one run
  if (next.playthroughs === 0) next.playthroughs = 1;
  try {
    localStorage.setItem(key, JSON.stringify(next));
  } catch {
    /* storage full — non-fatal */
  }
}
