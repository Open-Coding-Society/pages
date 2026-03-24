// ============================================================
//  persistence.js — Single Responsibility: localStorage state
//  Path: assets/js/bigsix/dataviz/persistence.js
//
//  Saves and restores current step + notes across page reloads.
//  Storage key is derived from the page URL automatically so
//  it never collides with other lessons.
//
//  EXPORTS:
//    persist()
//    restore(showStep)
// ============================================================

// Derive key from last path segment e.g. "dataviz_lesson"
const STORAGE_KEY = 'bigsix_' + location.pathname
  .replace(/\/+$/, '')
  .split('/')
  .pop();


// ── Workers ──────────────────────────────────────────────────

function readStorage() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)); }
  catch (e) { return null; }
}

function writeStorage(data) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); }
  catch (e) { /* private browsing / quota — silently skip */ }
}


// ============================================================
//  EXPORT — persist
//  Saves the current step and notes textarea value.
//  Called by navigation.js on every step change.
// ============================================================
export function persist() {
  writeStorage({
    step:  window.__currentStep ?? 0,
    notes: document.getElementById('notes')?.value ?? '',
  });
}


// ============================================================
//  EXPORT — restore
//  Reads saved state and applies it on page load.
//  Must be called AFTER initNavigation() so STEPS is populated.
//
//  @param {Function} showStep — from navigation.js
// ============================================================
export function restore(showStep) {
  const saved = readStorage();
  if (!saved) return;

  // Restore notes textarea if present
  const notes = document.getElementById('notes');
  if (notes && saved.notes) notes.value = saved.notes;

  // Jump to the saved step
  if (typeof saved.step === 'number') showStep(saved.step);
}