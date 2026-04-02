// ============================================================
//  shared/persistence.js — Reusable OOP Persistence
//  Path: assets/js/bigsix/shared/persistence.js
//
//  A single Persistence class used by all Big6 modules.
//  Replaces the per-module persistence.js files.
//
//  USAGE:
//    import { Persistence } from '/assets/js/bigsix/shared/persistence.js';
//
//    // key: storage key string, or null to auto-derive from the URL
//    // fields: array of element IDs whose .value should be saved
//    const store = new Persistence(null, { fields: ['notes', 'frq-answer'] });
//
//    nav.init(() => store.persist());
//    store.restore((n, silent) => nav.showStep(n, silent));
// ============================================================

export class Persistence {
  // Private fields — encapsulated, not accessible outside the class
  #key;
  #fields;

  // ── CONSTRUCTOR ──────────────────────────────────────────────
  // @param {string|null} key
  //   The localStorage key. Pass null to auto-derive from the URL
  //   (e.g. on /bigsix/dataviz_lesson → "bigsix_dataviz_lesson").
  //
  // @param {Object} options
  //   fields {string[]} — element IDs whose .value to save/restore
  constructor(key = null, { fields = [] } = {}) {
    this.#key = key || (
      'bigsix_' + location.pathname
        .replace(/\/+$/, '')
        .split('/')
        .pop()
    );
    this.#fields = fields;
  }


  // ============================================================
  //  PRIVATE WORKER — #read
  //  Safely parses localStorage. Returns null on any error.
  // ============================================================
  #read() {
    try {
      return JSON.parse(localStorage.getItem(this.#key));
    } catch {
      return null;
    }
  }


  // ============================================================
  //  PRIVATE WORKER — #write
  //  Safely writes to localStorage. Silently skips on quota/private.
  // ============================================================
  #write(data) {
    try {
      localStorage.setItem(this.#key, JSON.stringify(data));
    } catch { /* quota exceeded or private browsing — silently skip */ }
  }


  // ============================================================
  //  PUBLIC — persist
  //  Saves the current step + any configured field values.
  //  Called by Navigator on every real user-driven step change.
  // ============================================================
  persist() {
    const data = { step: window.__currentStep ?? 0 };

    // Save the value of each configured form field
    this.#fields.forEach(id => {
      data[id] = document.getElementById(id)?.value ?? '';
    });

    this.#write(data);
  }


  // ============================================================
  //  PUBLIC — restore
  //  Reads saved state and applies it on page load.
  //  Must be called AFTER nav.init() so sections exist in the DOM.
  //
  //  @param {Function} showStep — nav.showStep.bind(nav)
  //                               or (n, silent) => nav.showStep(n, silent)
  // ============================================================
  restore(showStep) {
    const saved = this.#read();
    if (!saved) return;

    // Restore saved field values
    this.#fields.forEach(id => {
      const el = document.getElementById(id);
      if (el && saved[id]) el.value = saved[id];
    });

    // Jump to saved step — silent=true so we don't re-persist step 0
    if (typeof saved.step === 'number') showStep(saved.step, true);
  }
}
