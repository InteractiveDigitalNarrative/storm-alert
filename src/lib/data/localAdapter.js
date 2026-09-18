// Local adapter — keeps player data on this device only (localStorage).
// Used while `collectionEnabled` is false and for building/testing the UI with
// no backend. Every adapter exposes the same methods; ./index.js is the only
// caller.

const PREFIX = 'storm_data_v1:';
const KEYS = ['user_id', 'consent', 'profile', 'household', 'events', 'results'];

function read(key, fallback) {
  try {
    const raw = localStorage.getItem(PREFIX + key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function write(key, value) {
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify(value));
  } catch { /* ignore — storage full or blocked */ }
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
      write('user_id', id);
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

  // Merge: family and home answers arrive in separate saves.
  async saveHousehold(household) {
    write('household', { ...read('household', {}), ...household });
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
