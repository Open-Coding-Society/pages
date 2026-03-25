// ============================================================
//  navigation.js — Single Responsibility: Step navigation
//  Path: assets/js/bigsix/dataviz/navigation.js
//
//  Owns everything related to moving between lesson steps:
//    - Showing / hiding sections
//    - Rendering the progress bar (using addEventListener,
//      NOT onclick attributes — avoids all module timing issues)
//    - Enabling / disabling prev/next buttons
//    - Updating the step counter
//
//  EXPORTS:
//    initNavigation(persistFn)
//    showStep(n)
// ============================================================

let currentStep = 0;
let STEPS       = [];
let _persist    = null;  // set by initNavigation, called on every step change


// ============================================================
//  WORKER 1 — toggleSections
//  Show the active section, hide all others.
// ============================================================
function toggleSections() {
  STEPS.forEach((id, i) =>
    document.getElementById(id).classList.toggle('active', i === currentStep)
  );
}


// ============================================================
//  WORKER 2 — renderProgressBar
//  Rebuild the progress bar segments.
//  Uses data-step + addEventListener so there is zero dependency
//  on window globals — clicks are wired inside the module scope.
// ============================================================
function renderProgressBar() {
  const bar = document.getElementById('progressBar');
  if (!bar) return;

  bar.innerHTML = STEPS.map((_, i) =>
    `<div class="step ${i <= currentStep ? 'active' : ''}"
          data-step="${i}"
          title="Step ${i + 1}"></div>`
  ).join('');

  // Wire each dot click — inside module scope, no window needed
  bar.querySelectorAll('.step').forEach(el =>
    el.addEventListener('click', () => showStep(parseInt(el.dataset.step)))
  );
}


// ============================================================
//  WORKER 3 — renderStepCounter
//  Update the "Step X / Y" text.
// ============================================================
function renderStepCounter() {
  const el = document.getElementById('stepIndicator');
  if (el) el.textContent = `Step ${currentStep + 1} / ${STEPS.length}`;
}


// ============================================================
//  WORKER 4 — updateNavButtons
//  Disable prev at step 0, disable next at last step.
// ============================================================
function updateNavButtons() {
  const prev = document.getElementById('prevBtn');
  const next = document.getElementById('nextBtn');
  if (prev) prev.disabled = currentStep === 0;
  if (next) next.disabled = currentStep === STEPS.length - 1;
}


// ============================================================
//  EXPORT — showStep
//  Orchestrates all navigation workers.
//  Also calls persist() so every step change is saved.
// ============================================================
export function showStep(n) {
  currentStep = Math.max(0, Math.min(STEPS.length - 1, n));
  window.__currentStep = currentStep;  // shared with persistence.js

  toggleSections();
  renderProgressBar();
  renderStepCounter();
  updateNavButtons();

  if (_persist) _persist();
}


// ============================================================
//  EXPORT — initNavigation
//  Auto-detects .section elements, wires prev/next buttons,
//  and renders the initial state.
//
//  @param {Function} persistFn — from persistence.js, called
//                                on every step change
// ============================================================
export function initNavigation(persistFn) {
  // Store persist so showStep can call it
  _persist = persistFn || null;

  // Auto-detect all .section elements — works for any step count
  STEPS = [...document.querySelectorAll('.section')].map(el => el.id);

  // Wire prev/next buttons
  const prev = document.getElementById('prevBtn');
  const next = document.getElementById('nextBtn');
  if (prev) prev.addEventListener('click', () => showStep(currentStep - 1));
  if (next) next.addEventListener('click', () => showStep(currentStep + 1));

  // Render step 0
  showStep(0);
}