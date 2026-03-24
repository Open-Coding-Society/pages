// ============================================================
//  markdown.js — Single Responsibility: Markdown conversion
//  Path: assets/js/bigsix/frontend/markdown.js
//
//  Owns everything related to the Markdown step:
//    - Converting Markdown input to HTML via marked.js
//    - Rendering the HTML preview
//    - Resetting to the default Markdown content
//    - Waiting for marked.js to load if not yet available
//
//  EXPORTS:
//    initMarkdown()  — call once on DOMContentLoaded
// ============================================================

// ── Default content shown on first load ──────────────────────
const DEFAULT_MARKDOWN = `## Hello Frontend!

Write your **Markdown** here and hit Convert.

### Why Markdown?
- HTML structures pages
- CSS styles them
- JavaScript makes them *interactive*

> Markdown is faster to write than raw HTML.

[Visit MDN Docs](https://developer.mozilla.org)`;


// ============================================================
//  WORKER 1 — parseMarkdown
//  Single responsibility: convert a Markdown string to HTML.
//  Delegates to the marked.js library.
//  Pure function — no DOM access.
// ============================================================

/**
 * Convert a Markdown string to an HTML string using marked.js.
 *
 * @param {string} markdown - Raw Markdown text
 * @returns {string}        - Rendered HTML string
 */
function parseMarkdown(markdown) {
  if (typeof marked === 'undefined') {
    throw new Error('marked.js not loaded yet');
  }
  return marked.parse(markdown);
}


// ============================================================
//  WORKER 2 — renderPreview
//  Single responsibility: inject HTML into the preview element.
//  Only touches #htmlPreview — nothing else.
// ============================================================

/**
 * Render an HTML string into the preview pane.
 *
 * @param {string} html - HTML to display
 */
function renderPreview(html) {
  document.getElementById('htmlPreview').innerHTML = html;
}


// ============================================================
//  WORKER 3 — showError
//  Single responsibility: display an error message in the preview.
// ============================================================

/**
 * Show an error message in the preview pane.
 *
 * @param {string} message - Error text to display
 */
function showError(message) {
  document.getElementById('htmlPreview').innerHTML =
    `<p style="color:var(--error);">${message}</p>`;
}


// ============================================================
//  WORKER 4 — waitForMarked
//  Single responsibility: poll until marked.js is available,
//  then run a callback. Handles the async CDN load timing.
// ============================================================

/**
 * Wait for marked.js to be available, then call the callback.
 *
 * @param {Function} callback - Called once marked is ready
 */
function waitForMarked(callback) {
  if (typeof marked !== 'undefined') {
    callback();
    return;
  }
  // Poll every 100ms — marked.js is loaded from a CDN
  const check = setInterval(() => {
    if (typeof marked !== 'undefined') {
      clearInterval(check);
      callback();
    }
  }, 100);
}


// ============================================================
//  ORCHESTRATOR — initMarkdown
//  Wires the Convert and Reset buttons, then runs the initial
//  conversion once marked.js is ready.
//  Called once on DOMContentLoaded from frontend_lesson.md.
// ============================================================

/**
 * Initialise the Markdown section.
 * Call once on DOMContentLoaded.
 */
export function initMarkdown() {
  const input = document.getElementById('mdInput');

  // Wire Convert button — delegates to parseMarkdown + renderPreview
  document.getElementById('mdConvertBtn').addEventListener('click', () => {
    try {
      renderPreview(parseMarkdown(input.value));
    } catch (err) {
      showError(err.message + ' — please try again in a moment.');
    }
  });

  // Wire Reset button — restores default content and re-converts
  document.getElementById('mdResetBtn').addEventListener('click', () => {
    input.value = DEFAULT_MARKDOWN;
    try {
      renderPreview(parseMarkdown(input.value));
    } catch (err) {
      showError(err.message);
    }
  });

  // Run initial conversion once marked.js is available
  waitForMarked(() => {
    try {
      renderPreview(parseMarkdown(input.value));
    } catch (err) {
      showError(err.message);
    }
  });
}