// Local adapter — keeps player data on this device only (localStorage).
// Used while `collectionEnabled` is false and for building/testing the UI with
// no backend. Every adapter exposes the same methods; ./index.js is the only
// caller. Save methods throw on failure so the queue keeps the item and retries.

const PREFIX = 'storm_data_v1:';
const KEYS = ['user_id', 'consent', 'profile', 'sessions', 'households', 'events', 'results'];

function read(key, fallback) {
  try {
    const raw = localStorage.getItem(PREFIX + key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

// Throws if storage is full or blocked — callers decide whether that matters.
function write(key, value) {
  localStorage.setItem(PREFIX + key, JSON.stringify(value));
}

// Insert-or-merge a record into an object keyed by `id` (like an SQL upsert).
function upsert(key, id, fields) {
  const all = read(key, {});
  all[id] = { ...all[id], ...fields };
  write(key, all);
}

function randomId() {
  if (globalThis.crypto?.randomUUID) return globalThis.crypto.randomUUID();
  return `local-${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
}

export const localAdapter = {
  name: 'local',

  // Random guest ID; no personal info. Created on first use.
  async getUserId() {
    let id = read('user_id', null);
    if (!id) {
      id = randomId();
      try { write('user_id', id); } catch { /* ignore */ }
    }
    return id;
  },

  async getConsent() {
    return read('consent', null);
  },

  async saveConsent(consent) {
    write('consent', consent);
  },

  async saveProfile(profile) {
    write('profile', profile);
  },

  // One row per playthrough; start and end arrive as separate saves.
  async saveSession({ id, ...fields }) {
    upsert('sessions', id, fields);
  },

  // One row per playthrough; family and home answers arrive separately.
  async saveHousehold({ session_id, ...fields }) {
    upsert('households', session_id ?? 'none', fields);
  },

  async logEvents(events) {
    write('events', [...read('events', []), ...events]);
  },

  async saveResult(result) {
    write('results', [...read('results', []), result]);
  },

  // Everything stored for this player — for "see my data" and debugging.
  async exportAll() {
    return Object.fromEntries(KEYS.map(k => [k, read(k, null)]));
  },

  async deleteAll() {
    for (const k of KEYS) {
      try { localStorage.removeItem(PREFIX + k); } catch { /* ignore */ }
    }
  },
};
