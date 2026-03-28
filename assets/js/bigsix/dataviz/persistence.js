// ============================================================
//  persistence.js — Single Responsibility: localStorage state
//  Path: assets/js/bigsix/dataviz/persistence.js
//
//  FIX SUMMARY:
//    restore() now passes silent=true to showStep so that
//    jumping to a saved step does NOT immediately re-persist
//    step 0 on top of the saved value.
//    (navigation.js showStep now accepts an optional silent arg)
//
//  EXPORTS:
//    persist()
//    restore(showStep)
// ============================================================

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
// ============================================================
export function persist() {
  writeStorage({
    step:  window.__currentStep ?? 0,
    notes: document.getElementById('notes')?.value ?? '',
  });
}


// ============================================================
//  EXPORT — restore
//  Passes silent=true so jumping to the saved step does not
//  immediately overwrite localStorage with step 0.
// ============================================================
export function restore(showStep) {
  const saved = readStorage();
  if (!saved) return;

  const notes = document.getElementById('notes');
  if (notes && saved.notes) notes.value = saved.notes;

  // silent=true — this is a restore, not a user navigation,
  // so we must not persist step 0 over the saved value.
  if (typeof saved.step === 'number') showStep(saved.step, true);
}