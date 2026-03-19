// ============================================================
//  navigation.js — Single Responsibility: Step navigation
//  Path: assets/js/bigsix/analytics/navigation.js
//
//  Owns everything related to moving between lesson steps:
//    - Showing / hiding sections
//    - Rendering the progress bar
//    - Enabling / disabling prev/next buttons
//    - Exposing showStep on window for inline onclick use
//
//  EXPORTS:
//    initNavigation(showStep, persist)
//    showStep(n, persist)
// ============================================================

const STEPS = ['step1', 'step2', 'step3'];  // maps index → element id
let currentStep = 0;


// ============================================================
//  WORKER 1 — toggleSections
//  Single responsibility: show active section, hide all others.
// ============================================================
function toggleSections() {
  STEPS.forEach((id, i) =>
    document.getElementById(id).classList.toggle('active', i === currentStep)
  );
}


// ============================================================
//  WORKER 2 — renderProgressBar
//  Single responsibility: rebuild clickable progress bar segments.
// ============================================================
function renderProgressBar() {
  const bar = document.getElementById('progressBar');
  bar.innerHTML = STEPS.map((_, i) =>
    `<div class="step ${i <= currentStep ? 'active' : ''}"
          onclick="showStep(${i})"
          title="Go to step ${i + 1}"></div>`
  ).join('');
}


// ============================================================
//  WORKER 3 — renderStepCounter
//  Single responsibility: update the "Step X / Y" text.
// ============================================================
function renderStepCounter() {
  document.getElementById('stepIndicator').textContent =
    `Step ${currentStep + 1} / ${STEPS.length}`;
}


// ============================================================
//  WORKER 4 — updateNavButtons
//  Single responsibility: disable prev/next at boundaries.
// ============================================================
function updateNavButtons() {
  document.getElementById('prevBtn').disabled = currentStep === 0;
  document.getElementById('nextBtn').disabled = currentStep === STEPS.length - 1;
}


// ============================================================
//  ORCHESTRATOR — showStep
//  Coordinates all navigation workers.
//  Also placed on window so inline onclick="showStep(n)" works.
// ============================================================
export function showStep(n, persist) {
  // Clamp to valid range [0, STEPS.length - 1]
  currentStep = Math.max(0, Math.min(STEPS.length - 1, n));

  toggleSections();    // show active section, hide others
  renderProgressBar(); // rebuild progress bar highlights
  renderStepCounter(); // update "Step X / Y" text
  updateNavButtons();  // disable buttons at boundaries

  // Save position — persist passed in from persistence.js
  if (persist) persist();
}

// Expose on window for inline onclick attributes in the HTML
window.showStep = showStep;


// ============================================================
//  ORCHESTRATOR — initNavigation
//  Wires prev/next buttons and renders the initial step.
//  Called once on DOMContentLoaded from analytics.md.
// ============================================================
export function initNavigation(showStepFn, persist) {
  document.getElementById('prevBtn').addEventListener('click',
    () => showStepFn(currentStep - 1, persist)
  );
  document.getElementById('nextBtn').addEventListener('click',
    () => showStepFn(currentStep + 1, persist)
  );

  // Render initial state
  showStepFn(currentStep, persist);
}