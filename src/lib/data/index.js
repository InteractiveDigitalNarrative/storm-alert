// Data layer — the ONLY way game screens save or delete player data.
// Screens call these functions; this file applies the rules in ./config.js
// (consent, allow-listed fields, master switch) and hands clean records to one
// backend adapter. Swapping backends = new adapter, screens untouched.

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

// Current consent counts only if given under the current consent version.
export async function getConsent() {
  const consent = await adapter.getConsent();
  if (!consent || consent.version !== DATA_CONFIG.consentVersion) return null;
  return consent;
}

export async function hasConsent() {
  return !!(await getConsent())?.given;
}

// Record the player's answer (yes or no). Saying no also wipes anything stored.
export async function setConsent(given) {
  const consent = { version: DATA_CONFIG.consentVersion, given: !!given, at: now() };
  if (!given) await adapter.deleteAll();
  await adapter.saveConsent(consent);
  return consent;
}

export async function saveProfile(data) {
  if (!(await hasConsent())) return false;
  await adapter.saveProfile({ ...clean('profile', data), at: now() });
  return true;
}

export async function saveHousehold(data) {
  if (!(await hasConsent())) return false;
  await adapter.saveHousehold({ ...clean('household', data), at: now() });
  return true;
}

export async function logEvent(type, screen, payload = {}) {
  if (!DATA_CONFIG.events.includes(type)) return false;
  if (!(await hasConsent())) return false;
  await adapter.logEvents([{ type, screen, payload: clean('payload', payload), at: now() }]);
  return true;
}

export async function saveResult(data) {
  if (!(await hasConsent())) return false;
  await adapter.saveResult({ ...clean('result', data), at: now() });
  return true;
}

export async function getUserId() {
  return adapter.getUserId();
}

export async function exportMyData() {
  return adapter.exportAll();
}

// "Delete my data": removes everything, including the consent record and the
// device-only conveniences below (survey asked again, no pre-filled household).
export async function deleteMyData() {
  await adapter.deleteAll();
  for (const key of Object.values(DEVICE_KEYS)) {
    try { localStorage.removeItem(key); } catch { /* ignore */ }
  }
}

// ── Device-only conveniences ─────────────────────────────────────────────
// Stored on this device only, consent or not; never sent to any backend.

const DEVICE_KEYS = {
  surveyDone: 'storm_survey_done',
  lastHousehold: 'storm_last_household',
};

function deviceGet(key) {
  try { return JSON.parse(localStorage.getItem(key)); } catch { return null; }
}

function deviceSet(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* ignore */ }
}

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
