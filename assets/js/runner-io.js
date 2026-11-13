/**
 * runner-io.js — reading and writing code runners.
 *
 * Knows how a runner stores its code on the page; knows nothing about where
 * that code is going. It must never import gist.js (or any transport) — that
 * is what lets the same reader feed a gist, an AI grader, or a Slack message
 * without dragging any of them along.
 *
 *   import { readRunners } from '/assets/js/runner-io.js';
 *   const files = readRunners();
 *
 * Students choose which runners go into a code submission ("Add to submission"), because
 * lessons mix graded hacks with practice runners. The choice is stored next to the runner's
 * code, under `<storageKey>__submit`, so it survives a refresh like the code does.
 */

const RUNNER_SELECTOR = '.code-runner-container';

/**
 * Reflection runners (_includes/runners/reflection.html) share the container class so they
 * are saved, listed and bundled with the code runners; they mark themselves with
 * `data-runner-kind="reflection"` and their written answer travels as Markdown.
 */
export const REFLECTION_KIND = 'reflection';

/** MCQ runners (_includes/runners/mcq.html) do the same; their stored answers are readable text. */
export const MCQ_KIND = 'mcq';

const ANSWER_EXTENSION = 'md';

/** Suffix of the localStorage key that remembers a runner is in the submission. */
const SELECTED_SUFFIX = '__submit';

/** Fired on document whenever a runner is added to or removed from the submission. */
export const SELECTION_CHANGE_EVENT = 'runner-selection-change';

/** Runner language -> file extension. Unknown languages fall back to .txt */
const EXTENSIONS = {
  python: 'py',
  java: 'java',
  javascript: 'js',
  html: 'html',
  pseudocode: 'txt',
};

/** Every runner on the page, in document order. */
export function listRunners() {
  return [...document.querySelectorAll(RUNNER_SELECTOR)];
}

/**
 * Runners whose code has not been saved with the 💾 button.
 * A runner stores to localStorage under the key it declares in
 * `data-storage-key`, so "unsaved" means that key holds nothing.
 */
export function unsavedRunners() {
  return listRunners().filter((el) => {
    const key = el.dataset.storageKey;
    return !key || localStorage.getItem(key) === null;
  });
}

/** True when the student added this runner to the submission. */
export function isRunnerSelected(el) {
  const key = el.dataset.storageKey;
  return Boolean(key) && localStorage.getItem(key + SELECTED_SUFFIX) === 'true';
}

/** Add a runner to the submission (selected = true) or take it out again. */
export function setRunnerSelected(el, selected) {
  const key = el.dataset.storageKey;
  if (!key) throw new Error(`Runner "${el.dataset.runnerId || '?'}" has no storage key, so it cannot be submitted.`);
  if (selected) {
    localStorage.setItem(key + SELECTED_SUFFIX, 'true');
  } else {
    localStorage.removeItem(key + SELECTED_SUFFIX);
  }
  // Toggles on the runners and the submit panel's list both listen, so they stay in step.
  document.dispatchEvent(new CustomEvent(SELECTION_CHANGE_EVENT, { detail: { runner: el, selected } }));
}

/** Runners the student added to the submission, in document order. */
export function selectedRunners() {
  return listRunners().filter(isRunnerSelected);
}

/**
 * Where the submission stands: every runner, the selected ones, and the selected ones that
 * have nothing saved yet (those block the submit; unselected runners never do).
 *
 * @returns {{ runners: Element[], selected: Element[], selectedUnsaved: Element[] }}
 */
export function submissionStatus() {
  const runners = listRunners();
  const selected = runners.filter(isRunnerSelected);
  const selectedUnsaved = selected.filter((el) => readRunner(el) === null);
  return { runners, selected, selectedUnsaved };
}

/**
 * Which runners were submitted and which were left out, for the gist manifest. The grader
 * uses it to tell required work that is missing from practice runners the student skipped.
 *
 * @returns {{ total: number, submitted: {id, title}[], skipped: {id, title}[] }}
 */
export function runnerSelectionSummary() {
  const submitted = [];
  const skipped = [];
  listRunners().forEach((container, index) => {
    const entry = { id: runnerIdOf(container, index), title: runnerTitle(container, index) };
    (isRunnerSelected(container) && readRunner(container) ? submitted : skipped).push(entry);
  });
  return { total: submitted.length + skipped.length, submitted, skipped };
}

/** The saved code for one runner element, or null. */
export function readRunner(el) {
  const key = el.dataset.storageKey;
  if (!key) return null;
  return localStorage.getItem(key)?.trim() || null;
}

/**
 * Collect every runner's saved work into a files bundle.
 *
 * @param {Object} [opts]
 * @param {boolean} [opts.includeQuestion=true] prepend the challenge prompt so
 *        the bundle is readable on its own, away from the lesson page.
 * @param {boolean} [opts.selectedOnly=false] only the runners added to the submission.
 * @returns {Object} { "runner_id.java": { content: "..." }, ... }
 */
export function readRunners(opts = {}) {
  const includeQuestion = opts.includeQuestion !== false;
  const files = {};

  // Iterate every runner (not just the selected ones) so unnamed runners keep the same
  // runner_<n> file name whether or not the others were selected.
  listRunners().forEach((container, index) => {
    if (opts.selectedOnly && !isRunnerSelected(container)) return;
    const code = readRunner(container);
    if (!code) return;

    const { runnerId, name, kind } = runnerFile(container, index);

    let content = code;
    if (includeQuestion) {
      const box = container.querySelector('.challenge-box');
      const title = runnerTitle(container, index);
      const desc = box?.querySelector('p')?.textContent.trim() || '';
      const label = kind === 'code' ? 'runner' : kind;
      content = `Question: ${title}\n${desc}\n\nAnswer (${label}: ${runnerId}):\n\n${code}`;
    }

    files[name] = { content };
  });

  return files;
}

/**
 * What each file readRunners() produces holds: "code", "reflection" or "mcq". Sent in the gist
 * manifest so the grader knows which answers are written prose rather than code.
 *
 * @param {Object} [opts]
 * @param {boolean} [opts.selectedOnly=false] only the runners added to the submission.
 * @returns {Object} { "runner_id.java": "code", "reflection_id.md": "reflection", ... }
 */
export function readRunnerKinds(opts = {}) {
  const kinds = {};
  listRunners().forEach((container, index) => {
    if (opts.selectedOnly && !isRunnerSelected(container)) return;
    if (!readRunner(container)) return;
    const { name, kind } = runnerFile(container, index);
    kinds[name] = kind;
  });
  return kinds;
}

/** A runner's id, falling back to its position for runners included without one. */
export function runnerIdOf(container, index) {
  return container.dataset.runnerId || `runner_${index + 1}`;
}

/** The runner's heading ("Popcorn Hack #2"), which tells a reader what the runner is for. */
export function runnerTitle(container, index) {
  return container.querySelector('.challenge-box')?.querySelector('h3')?.textContent.trim() || `Part ${index + 1}`;
}

/** The bundle filename and kind for one runner element. */
function runnerFile(container, index) {
  const runnerId = runnerIdOf(container, index);
  const { runnerKind } = container.dataset;
  if (runnerKind === REFLECTION_KIND || runnerKind === MCQ_KIND) {
    return { runnerId, name: `${safeName(runnerId)}.${ANSWER_EXTENSION}`, kind: runnerKind };
  }
  const lang = container.querySelector('.languageSelect')?.value || 'java';
  const ext = EXTENSIONS[lang] || 'txt';
  return { runnerId, name: `${safeName(runnerId)}.${ext}`, kind: 'code' };
}

/**
 * Load code into the runners on this page — the reverse direction, used by
 * anything that hands a student prepared code (starter files, a peer's
 * solution). Matches by runner id; unmatched entries are ignored.
 *
 * Writes through the same localStorage key the runner reads from, so the code
 * survives a refresh exactly like the student's own work.
 *
 * @param {Object} files bundle keyed by "<runner_id>.<ext>"
 * @returns {string[]} ids of the runners that were written
 */
export function writeRunners(files) {
  const written = [];

  listRunners().forEach((container, index) => {
    const runnerId = container.dataset.runnerId || `runner_${index + 1}`;
    const key = container.dataset.storageKey;
    if (!key) return;

    const match = Object.keys(files).find(
      (name) => name.replace(/\.[^.]+$/, '') === safeName(runnerId)
    );
    if (!match) return;

    const code = files[match]?.content;
    if (typeof code !== 'string') return;

    localStorage.setItem(key, code);
    written.push(runnerId);
  });

  return written;
}

/** Runner ids become filenames, so keep them to characters a filename can hold. */
function safeName(runnerId) {
  return runnerId.toLowerCase().replace(/[^a-z0-9_-]/g, '_');
}
