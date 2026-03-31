// ============================================================
//  persistence.js — localStorage state
//  Path: assets/js/bigsix/backend/persistence.js
// ============================================================

const STORAGE_KEY = 'bigsix_' + location.pathname
  .replace(/\/+$/, '').split('/').pop();

function readStorage() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)); } catch(e) { return null; }
}

function writeStorage(data) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); } catch(e) {}
}

export function persist() {
  writeStorage({ step: window.__currentStep ?? 0 });
}

export function restore(showStep) {
  const saved = readStorage();
  if (saved?.step) showStep(saved.step, true);
}