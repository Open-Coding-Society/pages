// interview.js
// RESPONSIBILITY: Mock interview analyzer feature (Step 5).
// Owns the interview prompt, the analysis HTML renderer, and the analyzeInterview handler.

import { callGemini, parseJsonResponse, setButtonBusy, showInlineError, loadingSpinnerHtml } from './gemini.js';

const QUESTION_MAP = {
  '1': 'Tell me about a time you failed.',
  '2': 'Walk me through your project architecture.',
  '3': 'Why do you want to work at this company?',
};

export class InterviewAnalyzer {
  init() {
    const btn = document.querySelector('[data-action="analyze-interview"]');
    if (btn) btn.addEventListener('click', () => this.#analyzeInterview());
  }

  // ── RESPONSIBILITY: Build the interview analysis prompt for a given question ──
  #buildInterviewPrompt(question) {
    return `You are an experienced technical interviewer and career coach. The candidate was asked: "${question}". Analyze their answer below.

Respond ONLY with valid JSON — no markdown, no backticks, no preamble. Use exactly this structure:
{
  "wordCount": <number>,
  "scores": {
    "structure":    { "rating": "good|ok|poor", "feedback": "one sentence" },
    "specificity":  { "rating": "good|ok|poor", "feedback": "one sentence" },
    "metrics":      { "rating": "good|ok|poor", "feedback": "one sentence" },
    "relevance":    { "rating": "good|ok|poor", "feedback": "one sentence" }
  },
  "overallFeedback": "2-3 sentences of actionable coaching advice",
  "improvedOpener":  "Rewrite just the first sentence of their answer to be stronger"
}

The candidate's answer is`;
  }

  // ── RESPONSIBILITY: Return inline badge style string for a rating value ───────
  #badgeStyle(r) {
    if (r === 'good') return 'background:var(--good);border:1px solid var(--good-border);color:#4ade80;';
    if (r === 'ok')   return 'background:rgba(234,179,8,0.1);border:1px solid rgba(234,179,8,0.4);color:#fbbf24;';
    return 'background:var(--bad);border:1px solid var(--bad-border);color:#f87171;';
  }

  // ── RESPONSIBILITY: Return display label for a rating value ──────────────────
  #ratingLabel(r) {
    return r === 'good' ? '✓ Good' : r === 'ok' ? '~ OK' : '✗ Needs work';
  }

  // ── RESPONSIBILITY: Build the score rows HTML from parsed scores ──────────────
  #buildScoreRowsHtml(scores) {
    const labels = {
      structure:   'STAR Structure',
      specificity: 'Specificity',
      metrics:     'Metrics/Numbers',
      relevance:   'Relevance to Question',
    };
    return Object.entries(labels).map(([key, label]) => {
      const s = scores[key] || {};
      return `<div style="display:flex;gap:10px;align-items:flex-start;">
      <span style="flex-shrink:0;padding:3px 10px;border-radius:20px;font-size:11px;font-weight:600;${this.#badgeStyle(s.rating)}">${this.#ratingLabel(s.rating)}</span>
      <span style="font-size:13px;"><strong style="color:#a6c9ff;">${label}:</strong> ${s.feedback || ''}</span>
    </div>`;
    }).join('');
  }

  // ── RESPONSIBILITY: Render parsed AI analysis into the analysis-content div ───
  #renderAnalysis(parsed) {
    let html = `<div style="font-size:12px;color:var(--muted);margin-bottom:12px;">${parsed.wordCount || '?'} words</div>`;
    html += `<div style="display:grid;gap:8px;margin-bottom:16px;">${this.#buildScoreRowsHtml(parsed.scores || {})}</div>`;

    if (parsed.overallFeedback) {
      html += `<div style="background:var(--blue-bg);border:1px solid var(--blue-border);border-radius:8px;padding:12px;margin-bottom:12px;font-size:13px;line-height:1.7;">
      <strong style="color:var(--blue);display:block;margin-bottom:4px;">Coach Feedback</strong>
      ${parsed.overallFeedback}
    </div>`;
    }
    if (parsed.improvedOpener) {
      html += `<div style="background:var(--accent-soft);border:1px solid var(--accent-border);border-radius:8px;padding:12px;font-size:13px;line-height:1.7;">
      <strong style="color:#c4b5fd;display:block;margin-bottom:4px;">Stronger Opening</strong>
      "${parsed.improvedOpener}"
    </div>`;
    }
    document.getElementById('analysis-content').innerHTML = html;
  }

  // ── ORCHESTRATOR: Read inputs → call API chain → render analysis ──────────────
  #analyzeInterview() {
    const answer  = document.getElementById('interview-answer').value.trim();
    const qChoice = document.getElementById('question-choice').value;
    if (!answer) { alert('Please write your interview answer first!'); return; }

    const question  = QUESTION_MAP[qChoice];
    const btn       = document.querySelector('[data-action="analyze-interview"]');
    const resultBox = document.getElementById('analysis-result');

    setButtonBusy(btn, true, '🔍 Analyze My Answer');
    resultBox.style.display = 'block';
    document.getElementById('analysis-content').innerHTML = loadingSpinnerHtml('Analyzing your answer…');
    document.getElementById('interview-error')?.remove();

    // API chain: callGemini → parseJsonResponse → renderAnalysis
    callGemini(answer, this.#buildInterviewPrompt(question))
      .then(({ text }) => parseJsonResponse(text))
      .then(parsed    => this.#renderAnalysis(parsed))
      .catch(err => {
        document.getElementById('analysis-content').innerHTML = '';
        showInlineError('analysis-result', 'interview-error', err.message);
      })
      .finally(() => setButtonBusy(btn, false, '🔍 Analyze My Answer'));
  }
}
