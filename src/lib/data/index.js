// Data layer — the ONLY way game screens save or delete player data.
// Screens call these functions; this file applies the rules in ./config.js
// (consent, allow-listed fields, master switch) and hands clean records to one
// backend adapter. Swapping backends = new adapter, screens untouched.
//
// Every write goes through an on-device queue: saved to localStorage first,
// then sent in order. If sending fails (offline, server down) it stays queued
// and is retried with growing delays — nothing is lost on a reload.

import { DATA_CONFIG } from './config.js';
import { localAdapter } from './localAdapter.js';

const ADAPTERS = { local: localAdapter };

// Master switch off → device-only adapter, whatever `adapter` says.
function pickAdapter() {
  if (!DATA_CONFIG.collectionEnabled) return localAdapter;
  return ADAPTERS[DATA_CONFIG.adapter] || localAdapter;
}

const adapter = pickAdapter();

// Keep only allow-listed fields holding short primitive values (or null =
// unknown), so free text (names, notes) can never slip into a record.
function clean(kind, data) {
  const allowed = kind === 'payload' ? Object.keys(data || {}) : DATA_CONFIG.fields[kind] || [];
  const out = {};
  for (const key of allowed) {
    const value = data?.[key];
    if (value === null || typeof value === 'number' || typeof value === 'boolean') out[key] = value;
    else if (typeof value === 'string' && value.length <= DATA_CONFIG.maxValueLength) out[key] = value;
  }
  return out;
}

const now = () => new Date().toISOString();

// ── Device-only storage ──────────────────────────────────────────────────
// Stored on this device only, consent or not; never sent to any backend.

const DEVICE_KEYS = {
  surveyDone: 'storm_survey_done',
  lastHousehold: 'storm_last_household',
  playthroughs: 'storm_playthrough_count',
  session: 'storm_current_session',
  queue: 'storm_data_queue',
};

function deviceGet(key) {
  try { return JSON.parse(localStorage.getItem(key)); } catch { return null; }
}

function deviceSet(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* ignore */ }
}

function deviceRemove(key) {
  try { localStorage.removeItem(key); } catch { /* ignore */ }
}

// ── Consent ──────────────────────────────────────────────────────────────

// Current consent counts only if given under the current consent version.
export async function getConsent() {
  const consent = await adapter.getConsent();
  if (!consent || consent.version !== DATA_CONFIG.consentVersion) return null;
  return consent;
}

export async function hasConsent() {
  return !!(await getConsent())?.given;
}

// Record the player's answer (yes or no). Saying no also wipes anything stored
// or still waiting to be sent.
export async function setConsent(given) {
  const consent = { version: DATA_CONFIG.consentVersion, given: !!given, at: now() };
  if (!given) {
    deviceRemove(DEVICE_KEYS.queue);
    await adapter.deleteAll();
  }
  await adapter.saveConsent(consent);
  return consent;
}

// ── Offline queue ────────────────────────────────────────────────────────

const QUEUE_LIMIT = 2000;       // oldest dropped beyond this — protects storage
const BATCH_SIZE = 50;          // events sent per request
const RETRY_MIN_MS = 5000;
const RETRY_MAX_MS = 5 * 60 * 1000;

let flushing = false;
let retryDelay = RETRY_MIN_MS;
let retryTimer = null;

const readQueue = () => deviceGet(DEVICE_KEYS.queue) || [];
const writeQueue = (q) => deviceSet(DEVICE_KEYS.queue, q.slice(-QUEUE_LIMIT));

function enqueue(op, data) {
  writeQueue([...readQueue(), { op, data }]);
  flush();
}

// Sends one queue item — or a run of consecutive events as one batch.
// Returns how many items were sent.
async function sendNext(queue) {
  const first = queue[0];
  if (first.op === 'event') {
    let n = 0;
    while (n < queue.length && n < BATCH_SIZE && queue[n].op === 'event') n++;
    await adapter.logEvents(queue.slice(0, n).map(item => item.data));
    return n;
  }
  const method = {
    profile: 'saveProfile',
    household: 'saveHousehold',
    session: 'saveSession',
    result: 'saveResult',
  }[first.op];
  if (method) await adapter[method](first.data);
  return 1; // unknown ops are dropped rather than blocking the queue forever
}

// Send everything queued, in order. Stops at the first failure and retries later.
export async function flush() {
  if (flushing) return;
  flushing = true;
  clearTimeout(retryTimer);
  try {
    let queue = readQueue();
    while (queue.length) {
      const sent = await sendNext(queue);
      // Re-read: new items may have been queued while we were sending.
      queue = readQueue().slice(sent);
      writeQueue(queue);
    }
    retryDelay = RETRY_MIN_MS;
  } catch {
    retryTimer = setTimeout(flush, retryDelay);
    retryDelay = Math.min(retryDelay * 2, RETRY_MAX_MS);
  } finally {
    flushing = false;
  }
}

export const pendingCount = () => readQueue().length;

// Retry when the connection comes back or the tab is being left.
if (typeof window !== 'undefined') {
  window.addEventListener('online', () => flush());
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') flush();
  });
  flush(); // anything left over from last visit
}

// ── Device info (coarse only) ────────────────────────────────────────────

// phone / tablet / desktop from screen size + touch — never the user-agent.
export function getDeviceClass() {
  if (typeof window === 'undefined') return null;
  const shortSide = Math.min(window.screen?.width || 0, window.screen?.height || 0);
  const touch = window.matchMedia?.('(pointer: coarse)').matches;
  if (shortSide && shortSide < 600) return 'phone';
  if (touch) return 'tablet';
  return 'desktop';
}

// ── Sessions (one per playthrough) ───────────────────────────────────────

const currentSession = () => deviceGet(DEVICE_KEYS.session);

function randomId() {
  if (globalThis.crypto?.randomUUID) return globalThis.crypto.randomUUID();
  return `s-${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
}

// New game. The playthrough number counts on this device even without consent,
// so it's still right if the player agrees later.
export async function startSession({ language } = {}) {
  const playthrough = (deviceGet(DEVICE_KEYS.playthroughs) || 0) + 1;
  deviceSet(DEVICE_KEYS.playthroughs, playthrough);
  const session = { id: randomId(), started_ms: Date.now() };
  deviceSet(DEVICE_KEYS.session, session);

  if (await hasConsent()) {
    enqueue('session', {
      id: session.id,
      ...clean('session', {
        playthrough,
        language,
        device_class: getDeviceClass(),
        game_version: DATA_CONFIG.gameVersion,
        started_at: now(),
      }),
    });
  }
  return session;
}

// Saved game continued. Same playthrough → same session, marked with a
// `resume` event. No session on this device (e.g. data was deleted) → new one.
export async function resumeSession({ language } = {}) {
  if (!currentSession()) return startSession({ language });
  await logEvent('resume', 'game');
  return currentSession();
}

// Game reached an ending.
export async function endSession() {
  const session = currentSession();
  if (!session || !(await hasConsent())) return false;
  enqueue('session', { id: session.id, ...clean('session', { ended_at: now(), completed: true }) });
  return true;
}

// ── Records ──────────────────────────────────────────────────────────────

export async function saveProfile(data) {
  if (!(await hasConsent())) return false;
  enqueue('profile', { ...clean('profile', data), at: now() });
  return true;
}

// Per playthrough; family + home answers arrive separately and are merged.
export async function saveHousehold(data) {
  if (!(await hasConsent())) return false;
  enqueue('household', {
    session_id: currentSession()?.id ?? null,
    ...clean('household', data),
    at: now(),
  });
  return true;
}

// `screen` is a short id (overlay name or Ink knot), never display text.
export async function logEvent(type, screen, payload = {}) {
  if (!DATA_CONFIG.events.includes(type)) return false;
  if (!(await hasConsent())) return false;
  const session = currentSession();
  enqueue('event', {
    session_id: session?.id ?? null,
    type,
    screen: String(screen || '').slice(0, DATA_CONFIG.maxValueLength),
    payload: clean('payload', payload),
    at: now(),
    // Time since the playthrough started — durations per screen come from
    // the gaps between consecutive screen_view events.
    t_ms: session ? Date.now() - session.started_ms : null,
  });
  return true;
}

export async function saveResult(data) {
  if (!(await hasConsent())) return false;
  enqueue('result', {
    session_id: currentSession()?.id ?? null,
    ...clean('result', data),
    at: now(),
  });
  return true;
}

// ── Player-level ─────────────────────────────────────────────────────────

export async function getUserId() {
  return adapter.getUserId();
}

export async function exportMyData() {
  return adapter.exportAll();
}

// "Delete my data": removes everything, including the consent record, the
// queue and the device-only conveniences (survey asked again, no pre-fill).
export async function deleteMyData() {
  for (const key of Object.values(DEVICE_KEYS)) deviceRemove(key);
  await adapter.deleteAll();
}

// ── Device-only conveniences ─────────────────────────────────────────────

// Survey is asked once per player (answered or skipped) — a repeat "before"
// rating would no longer be a true baseline.
export const isSurveyDone = () => !!deviceGet(DEVICE_KEYS.surveyDone);
export const markSurveyDone = () => deviceSet(DEVICE_KEYS.surveyDone, true);

// Last household setup, to pre-fill the next playthrough. May hold the
// relative's typed name — which is why it lives here and not in the adapter.
export function getLastHousehold() {
  const extras = deviceGet(DEVICE_KEYS.lastHousehold);
  return Array.isArray(extras) ? extras : null;
}
export const setLastHousehold = (extras) => deviceSet(DEVICE_KEYS.lastHousehold, extras);

export const backendName = adapter.name;
