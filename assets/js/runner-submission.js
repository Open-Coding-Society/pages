/**
 * runner-submission.js — the student's choice of which runners a code submission sends.
 *
 * Two views of the same selection (kept in runner-io.js):
 *   - mountSubmissionToggles(): the "Add to submission" button on each runner.
 *   - mountSubmissionSummary(): the submit panel's "N of M selected" count and list,
 *     where each runner can also be added or removed.
 * submissionError() is the check both submit handlers run before sending anything.
 *
 * Both views re-render on SELECTION_CHANGE_EVENT, so changing one updates the other.
 */
import {
  SELECTION_CHANGE_EVENT,
  isRunnerSelected,
  readRunner,
  runnerIdOf,
  runnerTitle,
  setRunnerSelected,
  submissionStatus,
} from './runner-io.js';

const TOGGLE_SELECTOR = '[data-runner-submit-toggle]';
const ADD_LABEL = '➕ Add to submission';
const SELECTED_LABEL = '✓ In submission';

/** Wire every runner's toggle under root. Safe to call more than once. */
export function mountSubmissionToggles(root = document) {
  root.querySelectorAll(TOGGLE_SELECTOR).forEach((button) => {
    if (button.dataset.mounted === 'true') return;
    const runner = button.closest('.code-runner-container');
    if (!runner) return;
    button.dataset.mounted = 'true';
    showToggle(button, runner);
    button.addEventListener('click', () => setRunnerSelected(runner, !isRunnerSelected(runner)));
    document.addEventListener(SELECTION_CHANGE_EVENT, () => showToggle(button, runner));
  });
}

function showToggle(button, runner) {
  const selected = isRunnerSelected(runner);
  button.setAttribute('aria-pressed', String(selected));
  // Text sits directly in the button (no <span>): the theme engine recolors spans.
  button.textContent = selected ? SELECTED_LABEL : ADD_LABEL;
}

/**
 * Render the submit panel's count and runner list, and keep them current.
 *
 * @param {HTMLElement} countEl paragraph for "N of M runners selected"
 * @param {HTMLElement} listEl  <ul> listing every runner with an Add/Remove button
 */
export function mountSubmissionSummary(countEl, listEl) {
  if (!countEl || !listEl) return;
  const render = () => renderSubmissionSummary(countEl, listEl);
  render();
  document.addEventListener(SELECTION_CHANGE_EVENT, render);
  // Saving (💾, 📤, MCQ Check) or clearing (🗑) a runner changes "not saved yet"/"saved".
  // Each runner stores in its own click handler, so re-check after any click inside a runner
  // (deferred until that handler has run) rather than wiring into every runner kind's save.
  document.addEventListener('click', (event) => {
    if (event.target.closest?.('.code-runner-container')) setTimeout(render, 0);
  });
}

export function renderSubmissionSummary(countEl, listEl) {
  const { runners, selected } = submissionStatus();
  listEl.replaceChildren();
  if (runners.length === 0) {
    countEl.textContent = 'No runners found on this page.';
    return;
  }
  countEl.textContent = selected.length === 0
    ? `0 of ${runners.length} runners selected. Click "Add to submission" on each runner you want graded.`
    : `${selected.length} of ${runners.length} runners selected`;
  countEl.classList.toggle('code-runner-count--empty', selected.length === 0);

  runners.forEach((runner, index) => listEl.append(summaryItem(runner, index)));
}

function summaryItem(runner, index) {
  const item = document.createElement('li');
  const selected = isRunnerSelected(runner);
  const state = document.createElement('span');
  if (!selected) {
    state.className = 'code-runner-skipped';
    state.textContent = 'not selected';
  } else if (readRunner(runner) === null) {
    state.className = 'code-runner-unsaved';
    state.textContent = 'selected, not saved yet';
  } else {
    state.className = 'code-runner-saved';
    state.textContent = 'selected, saved';
  }

  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'ocs__btn';
  button.textContent = selected ? 'Remove' : 'Add';
  button.setAttribute('aria-label', `${selected ? 'Remove' : 'Add'} ${runnerTitle(runner, index)}`);
  button.addEventListener('click', () => setRunnerSelected(runner, !selected));

  item.append(`${runnerTitle(runner, index)} (${runnerIdOf(runner, index)}) — `, state, ' ', button);
  return item;
}

/**
 * Why the submission cannot be sent yet, or null when it can. Unselected runners never block:
 * they are usually practice runners the lesson did not mean for grading.
 */
export function submissionError() {
  const { runners, selected, selectedUnsaved } = submissionStatus();
  if (runners.length === 0) return 'There are no runners on this page to submit.';
  if (selected.length === 0) {
    return 'Select at least one runner: click "Add to submission" on each runner you want graded.';
  }
  if (selectedUnsaved.length > 0) {
    const names = selectedUnsaved.map((el) => runnerTitle(el, runners.indexOf(el))).join(', ');
    return `Save these selected runners first (💾 for code, 📤 for reflections, Check for MCQs), or remove them: ${names}.`;
  }
  return null;
}
