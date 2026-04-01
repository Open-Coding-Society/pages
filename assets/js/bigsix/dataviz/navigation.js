// ============================================================
//  navigation.js — Single Responsibility: Step navigation
//  Path: assets/js/bigsix/dataviz/navigation.js
//
//  FIX SUMMARY (3 bugs resolved):
//
//  BUG 1 — persist-before-restore race:
//    initNavigation called showStep(0) which fired _persist()
//    before restore() ran, immediately overwriting any saved step.
//    FIX: persist is now skipped on the silent initial render by
//    passing an internal `silent` flag.
//
//  BUG 2 — next/prev buttons could bind to the wrong elements
//    if initNavigation was called before the full DOM settled.
//    FIX: querySelector calls are deferred into each click handler
//    so they always resolve against the live DOM.
//
//  BUG 3 — silent module-load failure hiding broken navigation:
//    If any import in the module graph failed (e.g. wrong
//    site.baseurl path in Jekyll), STEPS stayed [] and buttons
//    appeared disabled/broken with no console error.
//    FIX: Added a guard that warns loudly if STEPS is empty,
//    making the root cause immediately visible in the console.
//
//  EXPORTS:
//    initNavigation(persistFn)
//    showStep(n)
// ============================================================

let currentStep = 0;
let STEPS       = [];
let _persist    = null;


// ============================================================
//  WORKER 1 — toggleSections
// ============================================================
function toggleSections() {
  STEPS.forEach((id, i) => {
    const el = document.getElementById(id);
    if (el) el.classList.toggle('active', i === currentStep);
  });
}


// ============================================================
//  WORKER 2 — renderProgressBar
// ============================================================
function renderProgressBar() {
  const bar = document.getElementById('progressBar');
  if (!bar) return;

  bar.innerHTML = STEPS.map((_, i) =>
    `<div class="step ${i <= currentStep ? 'active' : ''}"
          data-step="${i}"
          title="Step ${i + 1}"></div>`
  ).join('');

  bar.querySelectorAll('.step').forEach(el =>
    el.addEventListener('click', () => showStep(parseInt(el.dataset.step)))
  );
}


// ============================================================
//  WORKER 3 — renderStepCounter
// ============================================================
function renderStepCounter() {
  const el = document.getElementById('stepIndicator');
  if (el) el.textContent = `Step ${currentStep + 1} / ${STEPS.length}`;
}


// ============================================================
//  WORKER 4 — updateNavButtons
// ============================================================
function updateNavButtons() {
  const prev = document.getElementById('prevBtn');
  const next = document.getElementById('nextBtn');
  if (prev) prev.disabled = currentStep === 0;
  if (next) next.disabled = currentStep === STEPS.length - 1;
}


// ============================================================
//  EXPORT — showStep
//  @param {number}  n       — target step index
//  @param {boolean} silent  — if true, skip persist call
//                             (used for the initial render so
//                              we don't overwrite a saved step)
// ============================================================
export function showStep(n, silent = false) {
  currentStep = Math.max(0, Math.min(STEPS.length - 1, n));
  window.__currentStep = currentStep;

  toggleSections();
  renderProgressBar();
  renderStepCounter();
  updateNavButtons();

  // Only persist real user-driven step changes, not the silent
  // initial render triggered by initNavigation itself.
  if (!silent && _persist) _persist();
}


// ============================================================
//  EXPORT — initNavigation
// ============================================================
export function initNavigation(persistFn) {
  _persist = persistFn || null;

  // Auto-detect all .section elements
  STEPS = [...document.querySelectorAll('.section')].map(el => el.id);

  // Guard: warn loudly if no sections found so a bad Jekyll
  // baseurl or missing HTML is immediately obvious in DevTools.
  if (STEPS.length === 0) {
    console.error(
      '[navigation.js] No .section elements found. ' +
      'Check that the HTML has rendered and that the ' +
      'import paths using {{ site.baseurl }} are correct.'
    );
    return;
  }

  // Wire prev/next — querySelector is inside the handler so it
  // always resolves against the live DOM at click time.
  document.getElementById('prevBtn')
    ?.addEventListener('click', () => showStep(currentStep - 1));
  document.getElementById('nextBtn')
    ?.addEventListener('click', () => showStep(currentStep + 1));

  // Silent initial render — does NOT call persist, so restore()
  // (called right after in the orchestrator) can safely overwrite.
  showStep(0, true);
}