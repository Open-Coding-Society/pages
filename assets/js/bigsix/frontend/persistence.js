// ============================================================
//  frontend_persistence.js
//  Path: assets/js/bigsix/frontend/persistence.js
//
//  Self-contained persistence for the frontend lesson.
//  Saves and restores the current step across page reloads.
//
//  EXPORTS:
//    persist()
//    restore()
// ============================================================

// Key is derived from the URL so it never collides with other lessons
const STORAGE_KEY = 'bigsix_' + location.pathname
  .replace(/\/+$/, '')
  .split('/')
  .pop();

// ── Workers ──────────────────────────────────────────────────

function readStorage() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY));
  } catch (e) {
    return null;
  }
}

function writeStorage(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    // Quota exceeded or private browsing — silently skip
  }
}

// ── Exports ──────────────────────────────────────────────────

// Call this after every step change to save position
export function persist() {
  writeStorage({ step: window.__currentStep ?? 0 });
}

// Call this on DOMContentLoaded before initNavigation()
// so the correct step is shown immediately on load
export function restore(showStep) {
  const saved = readStorage();
  if (!saved) return;
  if (typeof saved.step === 'number') showStep(saved.step);
}