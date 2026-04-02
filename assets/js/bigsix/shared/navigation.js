// ============================================================
//  shared/navigation.js — Reusable OOP Step Navigator
//  Path: assets/js/bigsix/shared/navigation.js
//
//  A single Navigator class used by all Big6 modules.
//  Replaces the per-module navigation.js files.
//
//  USAGE:
//    import { Navigator } from '/assets/js/bigsix/shared/navigation.js';
//
//    const nav = new Navigator({
//      progressStyle: 'bar',          // 'bar' (default) or 'dots'
//      labels:        ['Intro', ...], // labels for dot-style only
//      onComplete:    () => { ... },  // called when last step is reached
//    });
//
//    nav.init(() => store.persist()); // pass persist fn or omit
//    store.restore((n, s) => nav.showStep(n, s));
// ============================================================

export class Navigator {
  // Private fields — OOP encapsulation, not accessible outside the class
  #currentStep   = 0;
  #steps         = [];
  #labels        = [];
  #persist       = null;
  #progressStyle = 'bar';
  #onComplete    = null;
  #onStep        = null;

  // ── CONSTRUCTOR ──────────────────────────────────────────────
  // @param {Object} options
  //   progressStyle {string}   'bar' | 'dots' | 'fill'  (default: 'bar')
  //     'bar'  — clickable segment divs    (dataviz, analytics, frontend, ai)
  //     'dots' — numbered dots + labels    (backend)
  //     'fill' — single CSS-width bar      (resume)
  //   labels     {string[]} step label text  (dots style only)
  //   onComplete {Function} called once when the last step is reached
  //   onStep     {Function} called on every step change with (stepIndex)
  constructor({ progressStyle = 'bar', labels = [], onComplete = null, onStep = null } = {}) {
    this.#progressStyle = progressStyle;
    this.#labels        = labels;
    this.#onComplete    = onComplete;
    this.#onStep        = onStep;
  }


  // ============================================================
  //  PRIVATE WORKER — #toggleSections
  //  Shows the active section, hides all others.
  // ============================================================
  #toggleSections() {
    this.#steps.forEach((id, i) => {
      document.getElementById(id)
        ?.classList.toggle('active', i === this.#currentStep);
    });
  }


  // ============================================================
  //  PRIVATE WORKER — #renderProgress
  //  Delegates to bar or dots renderer based on progressStyle.
  // ============================================================
  #renderProgress() {
    if (this.#progressStyle === 'dots')     this.#renderDots();
    else if (this.#progressStyle === 'fill') this.#renderFill();
    else                                     this.#renderBar();
  }

  // Fill style — single bar whose width% grows with the step (resume)
  #renderFill() {
    const bar = document.getElementById('progressBar');
    if (bar) bar.style.width = `${((this.#currentStep + 1) / this.#steps.length) * 100}%`;
    const label = document.getElementById('progressLabel');
    if (label) label.textContent = `Step ${this.#currentStep + 1} / ${this.#steps.length}`;
  }

  // Bar style — flat segments (dataviz, analytics, frontend, ai)
  #renderBar() {
    const bar = document.getElementById('progressBar');
    if (!bar) return;
    bar.innerHTML = this.#steps.map((_, i) =>
      `<div class="step ${i <= this.#currentStep ? 'active' : ''}"
            data-step="${i}" title="Step ${i + 1}"></div>`
    ).join('');
    bar.querySelectorAll('.step').forEach(el =>
      el.addEventListener('click', () => this.showStep(parseInt(el.dataset.step)))
    );
  }

  // Dot style — numbered dots with checkmarks and labels (backend)
  #renderDots() {
    const container = document.getElementById('progressSteps');
    if (!container) return;
    container.innerHTML = this.#steps.map((_, i) => {
      const cls  = i < this.#currentStep ? 'done' : i === this.#currentStep ? 'active' : '';
      const dot  = i < this.#currentStep ? '✓' : i + 1;
      const label = this.#labels[i] || `Step ${i + 1}`;
      return `<div class="progress-step ${cls}" data-idx="${i}">
        <div class="step-dot">${dot}</div>
        <div class="step-label">${label}</div>
      </div>`;
    }).join('');
    container.querySelectorAll('.progress-step').forEach(el =>
      el.addEventListener('click', () => this.showStep(parseInt(el.dataset.idx)))
    );
  }


  // ============================================================
  //  PRIVATE WORKER — #renderStepCounter
  //  Updates the "Step X / Y" indicator text.
  // ============================================================
  #renderStepCounter() {
    const el = document.getElementById('stepIndicator');
    if (el) el.textContent = `Step ${this.#currentStep + 1} / ${this.#steps.length}`;
  }


  // ============================================================
  //  PRIVATE WORKER — #updateNavButtons
  //  Disables prev/next at the boundaries.
  // ============================================================
  #updateNavButtons() {
    const prev = document.getElementById('prevBtn');
    const next = document.getElementById('nextBtn');
    if (prev) prev.disabled = this.#currentStep === 0;
    if (next) next.disabled = this.#currentStep === this.#steps.length - 1;
  }


  // ============================================================
  //  PUBLIC — showStep
  //  The main method — coordinates all workers.
  //
  //  @param {number}  n      — target step index
  //  @param {boolean} silent — if true, skips persist call
  //                            (used for init render and restore)
  // ============================================================
  showStep(n, silent = false) {
    this.#currentStep    = Math.max(0, Math.min(this.#steps.length - 1, n));
    window.__currentStep = this.#currentStep;   // shared with Persistence

    this.#toggleSections();
    this.#renderProgress();
    this.#renderStepCounter();
    this.#updateNavButtons();

    // Persist only on real user navigation, not silent init/restore
    if (!silent && this.#persist) this.#persist();

    // Fire onStep on every step change (used for per-step side effects)
    if (this.#onStep) this.#onStep(this.#currentStep);

    // Fire onComplete when the last step is reached
    if (this.#currentStep === this.#steps.length - 1 && this.#onComplete) {
      this.#onComplete();
    }
  }


  // ============================================================
  //  PUBLIC — init
  //  Auto-detects .section elements, wires buttons, renders step 0.
  //  Must be called once after DOMContentLoaded.
  //
  //  @param {Function} persistFn — from Persistence.persist(), or null
  // ============================================================
  init(persistFn = null) {
    this.#persist = persistFn;
    this.#steps   = [...document.querySelectorAll('.section')].map(el => el.id);

    if (!this.#steps.length) {
      console.error(
        '[Navigator] No .section elements found. ' +
        'Check that the HTML has rendered and that import paths are correct.'
      );
      return;
    }

    document.getElementById('prevBtn')
      ?.addEventListener('click', () => this.showStep(this.#currentStep - 1));
    document.getElementById('nextBtn')
      ?.addEventListener('click', () => this.showStep(this.#currentStep + 1));

    // Expose on window so progress bar onclick="__showStep(n)" works
    window.__showStep = (n) => this.showStep(n);

    // Silent initial render — restore() will overwrite with the saved step
    this.showStep(0, true);
  }
}
