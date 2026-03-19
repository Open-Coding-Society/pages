// navigation.js
// RESPONSIBILITY: Step show/hide, progress bar rendering, and nav button state.

import { persistState, markLessonComplete } from './persistence.js';

const STEPS = ['step1', 'step2', 'step3', 'step4', 'step5', 'step6'];
let currentStep = 0;

// ── RESPONSIBILITY: Toggle which section is visible ───────────────────────────
function applyStepVisibility(stepIndex) {
  STEPS.forEach((s, i) => {
    document.getElementById(s)?.classList.toggle('active', i === stepIndex);
  });
}

// ── RESPONSIBILITY: Render the progress bar dots + step indicator ─────────────
function renderProgressBar(stepIndex) {
  const bar = document.getElementById('progressBar');
  if (!bar) return;
  bar.innerHTML =
    STEPS.map((_, i) =>
      `<div class="step ${i <= stepIndex ? 'active' : ''}" onclick="showStep(${i})"></div>`
    ).join('') +
    `<span id="stepIndicator">Step ${stepIndex + 1} / ${STEPS.length}</span>`;
}

// ── RESPONSIBILITY: Enable/disable prev & next buttons ───────────────────────
function updateNavButtons(stepIndex) {
  const prev = document.getElementById('prevBtn');
  const next = document.getElementById('nextBtn');
  if (prev) prev.disabled = stepIndex === 0;
  if (next) next.disabled = stepIndex === STEPS.length - 1;
}

// ── ORCHESTRATOR: Coordinate all step-change side effects ─────────────────────
export function showStep(n) {
  currentStep = Math.max(0, Math.min(STEPS.length - 1, n));
  applyStepVisibility(currentStep);
  renderProgressBar(currentStep);
  updateNavButtons(currentStep);
  persistState(currentStep);
  if (currentStep === STEPS.length - 1) markLessonComplete();
}

export function prevStep() { showStep(currentStep - 1); }
export function nextStep() { showStep(currentStep + 1); }

// Expose to inline HTML onclick attributes
window.showStep  = showStep;
window.prevStep  = prevStep;
window.nextStep  = nextStep;