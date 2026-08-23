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
 */

const RUNNER_SELECTOR = '.code-runner-container';

/** Runner language -> file extension. Unknown languages fall back to .txt */
const EXTENSIONS = {
  python: 'py',
  java: 'java',
  javascript: 'js',
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
 * @returns {Object} { "runner_id.java": { content: "..." }, ... }
 */
export function readRunners(opts = {}) {
  const includeQuestion = opts.includeQuestion !== false;
  const files = {};

  listRunners().forEach((container, index) => {
    const code = readRunner(container);
    if (!code) return;

    const runnerId = container.dataset.runnerId || `runner_${index + 1}`;
    const lang = container.querySelector('.languageSelect')?.value || 'java';
    const ext = EXTENSIONS[lang] || 'txt';

    let content = code;
    if (includeQuestion) {
      const box = container.querySelector('.challenge-box');
      const title = box?.querySelector('h3')?.textContent.trim() || `Part ${index + 1}`;
      const desc = box?.querySelector('p')?.textContent.trim() || '';
      content = `Question: ${title}\n${desc}\n\nAnswer (runner: ${runnerId}):\n\n${code}`;
    }

    files[`${safeName(runnerId)}.${ext}`] = { content };
  });

  return files;
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
