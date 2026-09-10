// resume.js
// RESPONSIBILITY: Resume bullet transformer feature (Step 4).
// Owns the STAR prompt, the three version cards, and the generateVersions handler.

import { callGemini, parseJsonResponse, setButtonBusy, showInlineError, loadingSpinnerHtml } from './gemini.js';

export class ResumeGenerator {
  init() {
    const btn = document.querySelector('[data-action="generate-versions"]');
    if (btn) btn.addEventListener('click', () => this.#generateVersions());
  }

  // ── RESPONSIBILITY: Build the STAR transformer prompt ────────────────────────
  #buildResumePrompt() {
    return `You are a professional resume coach. Transform this weak resume bullet point into 3 STAR-format versions.

Respond ONLY with valid JSON — no markdown, no backticks, no extra text. Use this exact structure:
{
  "conservative": "one sentence, modest tone, no invented metrics",
  "balanced": "one sentence, moderate achievements, 1 realistic metric",
  "bold": "one sentence, strong action verb, 1-2 impactful metrics"
}

Rules:
- Each version must be a single polished resume bullet (one sentence)
- Start with a strong past-tense action verb
- Use STAR structure: imply Situation/Task, show Action, hint at Result
- Do NOT invent specific company names or technologies not mentioned
- The bullet to transform is`;
  }

  // ── RESPONSIBILITY: Set all three version cards to the loading state ──────────
  #setVersionCardsLoading() {
    ['version-conservative', 'version-balanced', 'version-bold'].forEach(id => {
      document.getElementById(id).innerHTML = loadingSpinnerHtml();
    });
  }

  // ── RESPONSIBILITY: Clear all three version cards ─────────────────────────────
  #clearVersionCards() {
    ['version-conservative', 'version-balanced', 'version-bold'].forEach(id => {
      document.getElementById(id).textContent = '';
    });
  }

  // ── RESPONSIBILITY: Write parsed versions into the three version cards ────────
  #renderVersionCards(parsed) {
    document.getElementById('version-conservative').textContent = parsed.conservative || '—';
    document.getElementById('version-balanced').textContent     = parsed.balanced     || '—';
    document.getElementById('version-bold').textContent         = parsed.bold         || '—';
  }

  // ── ORCHESTRATOR: Read input → call API chain → render results ────────────────
  #generateVersions() {
    const weakBullet = document.getElementById('weak-bullet').value.trim();
    if (!weakBullet) { alert('Please enter a resume bullet point first!'); return; }

    const btn       = document.querySelector('[data-action="generate-versions"]');
    const container = document.getElementById('versions-container');

    setButtonBusy(btn, true, '✦ Transform to STAR Format');
    container.style.display = 'block';
    this.#setVersionCardsLoading();
    document.getElementById('transformer-error')?.remove();

    // API chain: callGemini → parseJsonResponse → renderVersionCards
    callGemini(weakBullet, this.#buildResumePrompt())
      .then(({ text }) => parseJsonResponse(text))
      .then(parsed    => this.#renderVersionCards(parsed))
      .catch(err => {
        this.#clearVersionCards();
        showInlineError('versions-container', 'transformer-error', err.message);
      })
      .finally(() => setButtonBusy(btn, false, '✦ Transform to STAR Format'));
  }
}
