---
layout: cs-bigsix-lesson
title: "AI Development — All-in-One Interactive Lesson"
description: "A multi-step interactive lesson on using AI for prompt engineering, coding, and professional development."
permalink: /bigsix/ai_lesson
parent: "bigsix"
lesson_number: 5
team: "Thinkers"
categories: [CSP, AI, Interactive]
tags: [ai, prompt-engineering, interactive]
author: "Thinkers Team"
date: 2025-12-02
---

<style>
  :root {
    --bg: #0a0e27;
    --panel: #0f1729;
    --border: rgba(255, 255, 255, 0.08);
    --text: #e6eef8;
    --muted: #9aa6bf;
    --accent: #7c3aed;
    --accent-soft: rgba(124, 58, 237, 0.15);
    --accent-border: rgba(124, 58, 237, 0.4);
    --blue: #4a9eff;
    --blue-bg: rgba(74, 158, 255, 0.08);
    --blue-border: rgba(74, 158, 255, 0.25);
    --good: rgba(46, 164, 79, 0.15);
    --good-border: rgba(46, 164, 79, 0.5);
    --bad: rgba(155, 52, 52, 0.2);
    --bad-border: rgba(194, 68, 68, 0.5);
  }

  * { box-sizing: border-box; }
  body { margin: 0; padding: 0; background: var(--bg); color: var(--text); font-family: Inter, system-ui, sans-serif; line-height: 1.5; }

  .container { max-width: 1000px; margin: 0 auto; padding: 24px 16px 40px; }
  .header { margin-bottom: 32px; }
  .header h1 { font-size: 28px; font-weight: 800; margin: 0 0 4px 0; }
  .header p { color: var(--muted); font-size: 14px; margin: 0; }

  /* Progress bar */
  .progress-bar { display: flex; gap: 8px; margin: 20px 0; justify-content: space-between; align-items: center;
    border: 1px solid var(--border); border-radius: 12px; padding: 12px; }
  .progress-bar .step { flex: 1; height: 4px; background: rgba(255,255,255,0.1); border-radius: 2px; cursor: pointer; transition: 0.2s; }
  .progress-bar .step.active { background: var(--accent); height: 6px; }

  /* Step indicator */
  #stepIndicator { color: var(--muted); font-size: 12px; align-self: center; }

  /* Sections */
  .section { display: none; }
  .section.active { display: block; }

  /* Card */
  .card { background: var(--panel); border: 1px solid var(--border); border-radius: 12px; padding: 20px; margin-bottom: 16px; }
  .card h2 { margin-top: 0; font-size: 20px; color: #a6c9ff; }
  .card h3 { margin-top: 16px; font-size: 16px; color: #a6c9ff; }
  .card p, .card li { color: var(--text); font-size: 14px; }
  .card ul, .card ol { padding-left: 20px; }
  .card li { margin-bottom: 6px; }
  .card strong { color: #a6c9ff; }

  /* Nav buttons */
  .nav-buttons { display: flex; gap: 12px; margin-top: 24px; justify-content: space-between; }

  /* Unified button */
  button {
    appearance: none;
    border: 1px solid var(--border);
    background: var(--panel);
    color: var(--text);
    padding: 8px 14px;
    border-radius: 8px;
    cursor: pointer;
    font-size: 13px;
    font-family: Inter, system-ui, sans-serif;
    font-weight: 500;
    transition: background 0.15s, border-color 0.15s, transform 0.1s;
  }
  button:hover { background: #1a2340; border-color: var(--accent-border); }
  button:disabled { opacity: 0.4; cursor: not-allowed; transform: none; }
  button.primary { background: var(--accent); border-color: var(--accent-border); color: #fff; }
  button.primary:hover { background: #6d28d9; }
  button.secondary { background: #1a2340; border-color: var(--border); }

  /* Unified dark inputs */
  input, textarea, select {
    background: #051226;
    border: 1px solid var(--border);
    border-radius: 10px;
    padding: 12px;
    color: #dce9ff;
    font-family: Inter, system-ui, sans-serif;
    font-size: 14px;
    width: 100%;
    margin-bottom: 8px;
  }
  input:focus, textarea:focus, select:focus { outline: none; box-shadow: 0 0 8px rgba(124,58,237,0.3); }
  select option { background: #0f1729; color: #dce9ff; }

  /* Back button */
  .back-btn {
    display: inline-block;
    margin-top: 8px;
    padding: 5px 12px;
    background: var(--panel);
    border: 1px solid var(--border);
    border-radius: 8px;
    color: var(--muted);
    font-size: 13px;
    text-decoration: none;
  }
  .back-btn:hover { border-color: var(--accent-border); color: var(--text); }

  /* ── Interactive tool panels ── */
  .tool-panel {
    background: var(--blue-bg);
    border: 1px solid var(--blue-border);
    border-radius: 12px;
    padding: 20px;
    margin: 16px 0;
  }
  .tool-panel h3 { color: var(--blue); font-size: 18px; margin-top: 0; margin-bottom: 8px; }
  .tool-panel p { color: var(--muted); font-size: 13px; margin-bottom: 12px; }
  .tool-panel label { display: block; font-size: 13px; font-weight: 600; color: #a6c9ff; margin-top: 14px; margin-bottom: 4px; }

  /* Version cards (resume transformer output) */
  .version-card {
    background: var(--panel);
    border: 1px solid var(--border);
    border-radius: 10px;
    padding: 16px;
    margin: 10px 0;
  }
  .version-card h4 { color: var(--blue); font-size: 14px; margin: 0 0 8px 0; }
  .version-card p { color: var(--text); font-size: 13px; margin: 0; line-height: 1.6; }

  /* Analysis result */
  .analysis-result {
    background: var(--panel);
    border: 1px solid var(--border);
    border-radius: 10px;
    padding: 16px;
    margin: 14px 0;
    display: none;
  }
  .analysis-result h4 { color: #4ecdc4; font-size: 14px; margin: 0 0 12px 0; }

  /* Score badges */
  .score-badge {
    display: inline-block;
    padding: 4px 12px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 600;
    margin: 4px 0;
  }
  .score-badge.good { background: var(--good); border: 1px solid var(--good-border); color: #4ade80; }
  .score-badge.bad  { background: var(--bad);  border: 1px solid var(--bad-border);  color: #f87171; }

  /* Scenario cards (use-case sorter) */
  .scenario-card {
    background: var(--panel);
    border: 1px solid var(--border);
    border-radius: 10px;
    padding: 14px 16px;
    margin: 8px 0;
    cursor: pointer;
    font-size: 13px;
    color: var(--text);
    user-select: none;
    transition: background 0.15s, border-color 0.15s, transform 0.1s;
  }
  .scenario-card:hover { background: #1a2340; border-color: var(--accent-border); transform: translateY(-2px); }
  .scenario-card.correct  { background: var(--good); border-color: var(--good-border); color: #4ade80; }
  .scenario-card.incorrect { background: var(--bad);  border-color: var(--bad-border);  color: #f87171; }

  /* Action button (main CTA in tool panels) */
  .action-button {
    background: var(--accent);
    border: 1px solid var(--accent-border);
    border-radius: 8px;
    color: #fff;
    padding: 10px 20px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    font-family: Inter, system-ui, sans-serif;
    transition: background 0.15s, transform 0.1s;
    margin: 8px 4px 4px 0;
  }
  .action-button:hover { background: #6d28d9; transform: translateY(-1px); }

  /* Game score display */
  #game-score { color: var(--blue); font-weight: 700; }

  /* Flex row helper */
  .flex-row { display: flex; gap: 8px; flex-wrap: wrap; align-items: center; }
</style>

<div class="container page-content">
  <div class="header">
    <h1>AI Development — All-in-One</h1>
    <p>A multi-step interactive lesson on using AI for prompt engineering, coding, and professional development.</p>
    <a href="../" class="back-btn">← Back</a>
  </div>

  <div class="progress-bar" id="progressBar"></div>

  <!-- Step 1: Prompt Engineering -->
  <div class="section active" id="step1">
    <div class="card">
      <h2>1 — Prompt Engineering</h2>
      <p>Mastering the art of communication with AI is the first step. A great prompt includes four key ingredients: Context, Problem, What You've Tried, and What You Need.</p>
      <ul>
        <li><strong>The Prompt Formula</strong>: A great prompt includes four key ingredients:
          <ol>
            <li><strong>Context</strong>: What are you working with? (e.g., Python, Flask, a specific library)</li>
            <li><strong>Problem</strong>: What is the specific issue? (e.g., "I'm getting a 404 error")</li>
            <li><strong>What You've Tried</strong>: Show your work. (e.g., "I've checked the routes and tested with Postman")</li>
            <li><strong>What You Need</strong>: What is your desired outcome? (e.g., "I need a checklist of likely causes")</li>
          </ol>
        </li>
        <li><strong>Iterate, Don't Quit</strong>: The first response from an AI is rarely perfect. The key to success is to refine your prompt based on the AI's output. Add more specifics, clarify your needs, and guide the AI to the correct solution. Winners iterate 3–5 times.</li>
      </ul>
    </div>
  </div>

  <!-- Step 2: Coding with AI -->
  <div class="section" id="step2">
    <div class="card">
      <h2>2 — Coding with AI</h2>
      <p>When it comes to generating code, specificity is everything. Use frameworks and checklists to ensure your AI-generated code is safe and effective.</p>
      <ul>
        <li><strong>The SPEC Framework</strong>: To get useful code, your prompt must be a detailed specification: Specific, Platform, Examples, and Constraints.</li>
        <li><strong>4-Step Debugging Template</strong>: When you're stuck, give the AI the information it needs: Problem, Expected vs. Actual, Minimal Code, and What You Tried.</li>
        <li><strong>The 5 Security Non-Negotiables</strong>: Always check for SQL Injection, Hardcoded Secrets, Input Validation, XSS, and improper Authentication/Authorization.</li>
      </ul>
    </div>
  </div>

  <!-- Step 3: Professional Applications -->
  <div class="section" id="step3">
    <div class="card">
      <h2>3 — Professional Applications</h2>
      <p>Leverage AI to accelerate your career, but know its limits. Use it for resume building, interview prep, and more.</p>
      <ul>
        <li><strong>Resume Transformation with STAR</strong>: Turn weak resume points into compelling, quantified achievements (Situation, Task, Action, Result).</li>
        <li><strong>Interview Preparation</strong>: Practice answering crucial questions about failure, project architecture, and your interest in the company.</li>
        <li><strong>Know When to Use AI</strong>: It's great for summarizing and brainstorming, but bad for highly specialized or sensitive topics where accuracy is critical.</li>
      </ul>
    </div>
  </div>

  <!-- Step 4: Resume Transformer -->
  <div class="section" id="step4">
    <div class="card">
      <h2>4 — Interactive: Resume Transformer</h2>
      <div class="tool-panel">
        <h3>Resume Bullet Transformer</h3>
        <p>Paste your weak bullet point and we'll generate 3 STAR versions!</p>
        <label>Your Current Bullet:</label>
        <textarea id="weak-bullet" placeholder="e.g., 'Worked on website development'" rows="3"></textarea>
        <button class="action-button" onclick="generateVersions()">✦ Transform to STAR Format</button>
        <div id="versions-container" style="display:none; margin-top:16px;">
          <div class="version-card"><h4>Version 1 — Conservative</h4><p id="version-conservative"></p></div>
          <div class="version-card"><h4>Version 2 — Balanced</h4><p id="version-balanced"></p></div>
          <div class="version-card"><h4>Version 3 — Bold</h4><p id="version-bold"></p></div>
        </div>
      </div>
    </div>
  </div>

  <!-- Step 5: Interview Analyzer -->
  <div class="section" id="step5">
    <div class="card">
      <h2>5 — Interactive: Interview Analyzer</h2>
      <div class="tool-panel">
        <h3>Mock Interview Analyzer</h3>
        <p>Type your answer to one of the questions below (250 words max).</p>
        <label>Which question are you answering?</label>
        <select id="question-choice">
          <option value="1">Question 1: Tell me about a time you failed</option>
          <option value="2">Question 2: Walk me through your architecture</option>
          <option value="3">Question 3: Why this company?</option>
        </select>
        <label>Your Answer:</label>
        <textarea id="interview-answer" placeholder="Type your answer here..." rows="6"></textarea>
        <button class="action-button" onclick="analyzeInterview()">🔍 Analyze My Answer</button>
        <div class="analysis-result" id="analysis-result">
          <h4>Analysis Results</h4>
          <div id="analysis-content"></div>
        </div>
      </div>
    </div>
  </div>

  <!-- Step 6: AI Use Case Sorter -->
  <div class="section" id="step6">
    <div class="card">
      <h2>6 — Interactive: AI Use Case Sorter</h2>
      <div class="tool-panel">
        <h3>Use Case Sorter Game</h3>
        <p>Click each scenario card to sort it — confirm if it's a <strong style="color:#4ade80;">good</strong> or <strong style="color:#f87171;">bad</strong> use of AI.</p>
        <p>Score: <span id="game-score">0/6</span> correct</p>
        <div id="scenarios-container"></div>
        <button class="action-button" onclick="resetGame()" style="margin-top:16px;">↺ Reset Game</button>
      </div>
    </div>
  </div>

  <!-- Navigation -->
  <div class="nav-buttons">
    <button id="prevBtn" onclick="prevStep()" class="secondary">← Previous</button>
    <div class="flex-row">
      <span id="stepIndicator">Step 1 / 6</span>
      <button id="nextBtn" onclick="nextStep()" class="primary">Next →</button>
    </div>
  </div>
</div>

<script>
// ── State & Navigation ────────────────────────────────────────────────────────
let currentStep = 0;
const steps = ['step1','step2','step3','step4','step5','step6'];
const STORAGE_KEY = 'ai_combined_v1';

const BIG_SIX_META = { module: 'ai_lesson', lesson: 5 };

function completeBigSixLesson() {
  const key = `bigsix:${BIG_SIX_META.module}:lesson:${BIG_SIX_META.lesson}`;
  if (localStorage.getItem(key) !== 'done') {
    localStorage.setItem(key, 'done');
    console.log(`✅ Big Six completed: ${key}`);
  }
}

function showStep(n) {
  currentStep = Math.max(0, Math.min(steps.length - 1, n));

  steps.forEach((s, i) => {
    const el = document.getElementById(s);
    if (el) el.classList.toggle('active', i === currentStep);
  });

  const bar = document.getElementById('progressBar');
  if (bar) bar.innerHTML = steps.map((_, i) =>
    `<div class="step ${i <= currentStep ? 'active' : ''}" onclick="showStep(${i})"></div>`
  ).join('');

  const indicator = document.getElementById('stepIndicator');
  if (indicator) indicator.textContent = `Step ${currentStep + 1} / ${steps.length}`;

  const prevBtn = document.getElementById('prevBtn');
  if (prevBtn) prevBtn.disabled = currentStep === 0;

  const nextBtn = document.getElementById('nextBtn');
  if (nextBtn) nextBtn.disabled = currentStep === steps.length - 1;

  persist();

  if (currentStep === steps.length - 1) completeBigSixLesson();
}

function prevStep() { showStep(currentStep - 1); }
function nextStep() { showStep(currentStep + 1); }
window.prevStep = prevStep;
window.nextStep = nextStep;
window.showStep = showStep;

// ── Resume Transformer ────────────────────────────────────────────────────────
function generateVersions() {
  const weakBullet = document.getElementById('weak-bullet').value.trim();
  if (!weakBullet) { alert('Please enter a resume bullet point first!'); return; }

  document.getElementById('version-conservative').textContent =
    'Contributed to team project using web technologies, implementing core features and collaborating with 3–4 team members to meet project deadlines.';
  document.getElementById('version-balanced').textContent =
    'Developed web application as part of a 4-person team, implementing 5+ key features and improving system performance by 25% through code optimization.';
  document.getElementById('version-bold').textContent =
    'Led development of a web platform serving 5,000+ monthly users, architecting scalable backend infrastructure and reducing load times by 40%.';

  document.getElementById('versions-container').style.display = 'block';
}
window.generateVersions = generateVersions;

// ── Interview Analyzer ────────────────────────────────────────────────────────
function analyzeInterview() {
  const answer = document.getElementById('interview-answer').value.trim();
  if (!answer) { alert('Please write your interview answer first!'); return; }

  const wordCount = answer.split(/\s+/).filter(Boolean).length;
  const hasMetrics = /\d+/.test(answer);
  const hasSTAR = /(situation|task|action|result|because|led|built|improved|reduced|increased)/i.test(answer);
  const tooLong = wordCount > 250;

  let html = '';
  html += `<div><span class="score-badge ${tooLong ? 'bad' : 'good'}">Length: ${wordCount} words ${tooLong ? '(too long — trim to 250)' : '✓'}</span></div>`;
  html += `<div><span class="score-badge ${hasMetrics ? 'good' : 'bad'}">Metrics: ${hasMetrics ? 'Present ✓' : 'Missing — add numbers!'}</span></div>`;
  html += `<div><span class="score-badge ${hasSTAR ? 'good' : 'bad'}">STAR structure: ${hasSTAR ? 'Detected ✓' : 'Not detected — add context & result'}</span></div>`;

  document.getElementById('analysis-content').innerHTML = html;
  document.getElementById('analysis-result').style.display = 'block';
}
window.analyzeInterview = analyzeInterview;

// ── Use Case Sorter ───────────────────────────────────────────────────────────
let gameScore = 0;
const scenarios = [
  { text: 'Summarize a 50-page research paper',     correct: 'good' },
  { text: 'Generate a legal contract for a startup', correct: 'bad'  },
  { text: 'Write a SQL query for a database',        correct: 'good' },
  { text: 'Diagnose chest pain symptoms',            correct: 'bad'  },
  { text: 'Brainstorm app feature ideas',            correct: 'good' },
  { text: 'Calculate structural load for a bridge',  correct: 'bad'  },
];

function initializeGame() {
  const container = document.getElementById('scenarios-container');
  if (!container) return;
  container.innerHTML = '';
  gameScore = 0;
  scenarios.forEach(scenario => {
    const card = document.createElement('div');
    card.className = 'scenario-card';
    card.textContent = scenario.text;
    card.onclick = () => handleScenarioClick(card, scenario.correct);
    container.appendChild(card);
  });
  updateScore();
}

function handleScenarioClick(card, correctAnswer) {
  if (card.classList.contains('correct') || card.classList.contains('incorrect')) return;
  const userChoice = confirm(`Is "${card.textContent}" a GOOD use of AI?\n\nOK = Yes (good use)\nCancel = No (bad use)`);
  const choice = userChoice ? 'good' : 'bad';
  if (choice === correctAnswer) { card.classList.add('correct'); gameScore++; }
  else { card.classList.add('incorrect'); }
  updateScore();
}

function updateScore() {
  const el = document.getElementById('game-score');
  if (el) el.textContent = `${gameScore}/${scenarios.length}`;
}

function resetGame() { initializeGame(); }
window.resetGame = resetGame;

// ── Persistence ───────────────────────────────────────────────────────────────
function persist() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      step: currentStep,
      weakBullet: document.getElementById('weak-bullet')?.value || '',
      interviewAnswer: document.getElementById('interview-answer')?.value || '',
    }));
  } catch(e) {}
}

function restore() {
  try {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (!data) return;
    const wb = document.getElementById('weak-bullet');
    if (wb && data.weakBullet) wb.value = data.weakBullet;
    const ia = document.getElementById('interview-answer');
    if (ia && data.interviewAnswer) ia.value = data.interviewAnswer;
    showStep(data.step || 0);
  } catch(e) { showStep(0); }
}

// ── Boot ──────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  restore();
  initializeGame();
  // Ensure progress bar renders even if restore() skips showStep
  if (!document.querySelector('#progressBar .step')) showStep(0);
});
</script>

<script>
// Back button handler
(function(){
  document.addEventListener('DOMContentLoaded', function(){
    document.querySelectorAll('a.back-btn').forEach(function(a){
      a.addEventListener('click', function(e){
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.button === 1) return;
        e.preventDefault();
        try {
          if (document.referrer && new URL(document.referrer).origin === location.origin) {
            history.back(); return;
          }
        } catch(err) {}
        var p = location.pathname.replace(/\/$/, '').split('/');
        if (p.length > 1) { p.pop(); window.location.href = p.join('/') + '/'; }
        else { window.location.href = '/'; }
      });
    });
  });
})();
</script>

<script src="/assets/js/lesson-completion-bigsix.js"></script>