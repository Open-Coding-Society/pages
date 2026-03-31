// ============================================================
//  persistence.js — Single Responsibility: localStorage state
//  Path: assets/js/bigsix/analytics/persistence.js
//
//  Owns saving and restoring the student's session:
//    - Writing current step + FRQ draft to localStorage
//    - Reading and restoring that state on page load
//
//  EXPORTS:
//    persist()
//    restore(showStep)
// ============================================================

const STORAGE_KEY = 'analytics_combined_v1';


// ============================================================
//  WORKER 1 — readStorage
//  Single responsibility: safely read and parse localStorage.
//  Returns null if key doesn't exist or data is corrupt.
// ============================================================
function readStorage() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY));
  } catch (e) {
    return null;  // corrupt JSON — treat as nothing saved
  }
}


// ============================================================
//  WORKER 2 — writeStorage
//  Single responsibility: safely write to localStorage.
//  Silently skips if storage is full or unavailable.
// ============================================================
function writeStorage(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    // Quota exceeded or private browsing — silently skip
  }
}


// ============================================================
//  EXPORT — persist
//  Reads current step + FRQ answer from the DOM and saves them.
//  Called by navigation.js whenever the step changes.
// ============================================================
export function persist() {
  writeStorage({
    step:      window.__currentStep ?? 0,
    frqAnswer: document.getElementById('frq-answer')?.value ?? '',
  });
}


// ============================================================
//  EXPORT — restore
//  Reads saved state and applies it to the DOM.
//  Must be called before initNavigation() so the correct
//  step is shown on first render.
//
//  @param {Function} showStep - from navigation.js
// ============================================================
export function restore(showStep) {
  const saved = readStorage();
  if (!saved) return;

  // Restore FRQ draft text
  const ta = document.getElementById('frq-answer');
  if (ta && saved.frqAnswer) ta.value = saved.frqAnswer;

  // Restore saved step position
  if (typeof saved.step === 'number') showStep(saved.step);
}