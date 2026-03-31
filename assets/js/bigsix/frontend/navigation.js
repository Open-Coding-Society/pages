// ============================================================
//  frontend_navigation.js
//  Path: assets/js/bigsix/frontend/navigation.js
//
//  Self-contained navigation for the frontend lesson (6 steps).
//  Logic is inline — no module timing issues.
//
//  EXPORTS:
//    showStep(n)
//    initNavigation()
// ============================================================

let currentStep = 0;
let STEPS = [];

// ── Workers ──────────────────────────────────────────────────

function toggleSections() {
  STEPS.forEach((id, i) =>
    document.getElementById(id).classList.toggle('active', i === currentStep)
  );
}

function renderProgressBar() {
  document.getElementById('progressBar').innerHTML = STEPS.map((_, i) =>
    `<div class="step ${i <= currentStep ? 'active' : ''}"
          onclick="window.__showStep(${i})"
          title="Step ${i + 1}"></div>`
  ).join('');
}

function renderStepCounter() {
  document.getElementById('stepIndicator').textContent =
    `Step ${currentStep + 1} / ${STEPS.length}`;
}

function updateNavButtons() {
  document.getElementById('prevBtn').disabled = currentStep === 0;
  document.getElementById('nextBtn').disabled = currentStep === STEPS.length - 1;
}

// ── Orchestrator ─────────────────────────────────────────────

export function showStep(n) {
  currentStep = Math.max(0, Math.min(STEPS.length - 1, n));
  window.__currentStep = currentStep;

  toggleSections();
  renderProgressBar();
  renderStepCounter();
  updateNavButtons();
}

// Expose for progress bar inline onclick
window.__showStep = showStep;

export function initNavigation() {
  // Auto-detect all .section elements — works for any step count
  STEPS = [...document.querySelectorAll('.section')].map(el => el.id);

  document.getElementById('prevBtn').addEventListener('click',
    () => showStep(currentStep - 1)
  );
  document.getElementById('nextBtn').addEventListener('click',
    () => showStep(currentStep + 1)
  );

  showStep(0);
}