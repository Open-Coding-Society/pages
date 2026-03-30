// ============================================================
//  navigation.js — Step navigation
//  Path: assets/js/bigsix/backend/navigation.js
// ============================================================

let currentStep = 0;
let STEPS       = [];
let LABELS      = [];
let _persist    = null;

function toggleSections() {
  STEPS.forEach((id, i) => {
    const el = document.getElementById(id);
    if (el) el.classList.toggle('active', i === currentStep);
  });
}

function renderProgressDots() {
  const container = document.getElementById('progressSteps');
  if (!container) return;
  container.innerHTML = STEPS.map((_, i) => {
    const cls = i < currentStep ? 'done' : i === currentStep ? 'active' : '';
    return `
      <div class="progress-step ${cls}" data-idx="${i}">
        <div class="step-dot">${i < currentStep ? '✓' : i + 1}</div>
        <div class="step-label">${LABELS[i] || 'Step ' + (i + 1)}</div>
      </div>`;
  }).join('');
  container.querySelectorAll('.progress-step').forEach(el =>
    el.addEventListener('click', () => showStep(parseInt(el.dataset.idx)))
  );
}

function renderStepCounter() {
  const el = document.getElementById('stepIndicator');
  if (el) el.textContent = `Step ${currentStep + 1} / ${STEPS.length}`;
}

function updateNavButtons() {
  const prev = document.getElementById('prevBtn');
  const next = document.getElementById('nextBtn');
  if (prev) prev.disabled = currentStep === 0;
  if (next) next.disabled = currentStep === STEPS.length - 1;
}

export function showStep(n, silent = false) {
  currentStep = Math.max(0, Math.min(STEPS.length - 1, n));
  window.__currentStep = currentStep;
  toggleSections();
  renderProgressDots();
  renderStepCounter();
  updateNavButtons();
  if (!silent && _persist) _persist();
}

export function initNavigation(labels, persistFn) {
  LABELS   = labels || [];
  _persist = persistFn || null;
  STEPS    = [...document.querySelectorAll('.section')].map(el => el.id);

  if (!STEPS.length) {
    console.error('[navigation.js] No .section elements found.');
    return;
  }

  document.getElementById('prevBtn')
    ?.addEventListener('click', () => showStep(currentStep - 1));
  document.getElementById('nextBtn')
    ?.addEventListener('click', () => showStep(currentStep + 1));

  showStep(0, true);
}