// gemini.js
// RESPONSIBILITY: All communication with the Gemini AI backends.
// Also owns shared UI helpers (button busy state, inline errors, loading spinners)
// that every feature reuses — nothing here knows about resume or interview specifics.

const FLASK_URL  = 'https://flask.opencodingsociety.com';
const SPRING_URL = 'https://spring.opencodingsociety.com';

// ── RESPONSIBILITY: Try the Flask /api/gemini endpoint only ──────────────────
export async function fetchFromFlask(promptText, fullPrompt) {
  const res = await fetch(`${FLASK_URL}/api/gemini`, {
    method:      'POST',
    headers:     { 'Content-Type': 'application/json' },
    credentials: 'include',
    body:        JSON.stringify({ text: promptText, prompt: fullPrompt }),
  });
  if (!res.ok) throw new Error('FLASK_UNAVAILABLE');
  const data = await res.json();
  if (!data.success || !data.text) throw new Error('FLASK_UNAVAILABLE');
  return data.text;
}

// ── RESPONSIBILITY: Try the Spring /api/chatbot/chat fallback only ────────────
export async function fetchFromSpring(promptText, fullPrompt) {
  const res = await fetch(`${SPRING_URL}/api/chatbot/chat`, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify({ userId: 'lesson-guest', message: `${fullPrompt}: ${promptText}` }),
  });
  if (!res.ok) throw new Error(`AI_SERVICE_ERROR_${res.status}`);
  const data = await res.json();
  const text = data.response || data.text || '';
  if (!text) throw new Error('EMPTY_RESPONSE');
  return text;
}

// ── ORCHESTRATOR: Try Flask → fall back to Spring ─────────────────────────────
export async function callGemini(promptText, fullPrompt) {
  try {
    const text = await fetchFromFlask(promptText, fullPrompt);
    return { text };
  } catch (_) {
    // Flask unavailable or user not logged in — chain to Spring
  }
  const text = await fetchFromSpring(promptText, fullPrompt);
  return { text };
}

// ── RESPONSIBILITY: Parse raw AI text as JSON, strip markdown fences ──────────
export function parseJsonResponse(rawText) {
  try {
    return JSON.parse(rawText.replace(/```json|```/g, '').trim());
  } catch {
    throw new Error('PARSE_FAILED: Could not parse AI response. Try again.');
  }
}

// ── RESPONSIBILITY: Lock/unlock a button and swap its label ──────────────────
export function setButtonBusy(btn, isBusy, idleLabel) {
  btn.disabled    = isBusy;
  btn.textContent = isBusy ? 'Loading…' : idleLabel;
}

// ── RESPONSIBILITY: Inject or clear an inline error message ──────────────────
export function showInlineError(containerId, errorId, message) {
  document.getElementById(errorId)?.remove();
  document.getElementById(containerId).insertAdjacentHTML(
    'beforebegin',
    `<div class="ai-error" id="${errorId}">⚠ ${message}</div>`
  );
}

// ── RESPONSIBILITY: Build the loading spinner HTML string ─────────────────────
export function loadingSpinnerHtml(label = 'Thinking…') {
  return `<div class="ai-loading"><div class="ai-spinner"></div>${label}</div>`;
}