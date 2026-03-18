---
layout: cs-bigsix-lesson
title: "Backend Development — All-in-One Advanced Lesson"
description: "A multi-step lesson on backend development, from fundamentals to advanced topics like serverless, IaC, and AI integration."
permalink: /bigsix/backend_lesson
parent: "bigsix"
lesson_number: 2
team: "Encrypters"
categories: [CSP, Backend, Interactive, Advanced]
tags: [backend, flask, spring, serverless, ai, interactive]
author: "Encrypters Team"
date: 2025-12-02
---

<style>
  :root {
    --bg: #07090f;
    --panel: #0d1117;
    --panel-2: #161b22;
    --panel-3: #1c2333;
    --border: rgba(255,255,255,0.07);
    --border-bright: rgba(255,255,255,0.14);
    --text: #e2e8f0;
    --muted: #8b949e;
    --accent: #58a6ff;
    --accent-2: #3fb950;
    --accent-3: #f78166;
    --accent-4: #d2a8ff;
    --warn: #e3b341;
    --success: #3fb950;
    --success-bg: rgba(63,185,80,0.1);
    --error: #f85149;
    --error-bg: rgba(248,81,73,0.1);
    --code-bg: #010409;
    --hover-bg: rgba(88,166,255,0.08);
    --sel-bg: rgba(88,166,255,0.15);
    --good-bg: rgba(63,185,80,0.12);
    --bad-bg: rgba(248,81,73,0.12);
  }

  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: var(--bg); color: var(--text); font-family: 'Segoe UI', system-ui, sans-serif; line-height: 1.65; }

  /* ── Layout ── */
  .container { max-width: 1000px; margin: 0 auto; padding: 28px 16px 64px; }

  /* ── Header ── */
  .lesson-header { margin-bottom: 32px; padding-bottom: 20px; border-bottom: 1px solid var(--border); }
  .lesson-header .badge {
    display: inline-flex; align-items: center; gap: 6px;
    background: var(--panel-2); border: 1px solid var(--border-bright);
    border-radius: 20px; padding: 3px 12px; font-size: 11px; font-weight: 700;
    letter-spacing: 0.06em; text-transform: uppercase; color: var(--accent);
    margin-bottom: 10px;
  }
  .lesson-header .badge::before { content: ''; width: 6px; height: 6px; border-radius: 50%; background: var(--accent); box-shadow: 0 0 8px var(--accent); display: inline-block; }
  .lesson-header h1 { font-size: 30px; font-weight: 800; letter-spacing: -0.02em; margin-bottom: 6px; }
  .lesson-header p { color: var(--muted); font-size: 14px; }
  .back-btn {
    display: inline-flex; align-items: center; gap: 6px;
    margin-top: 12px; font-size: 12px; font-weight: 600;
    color: var(--muted); text-decoration: none;
    background: var(--panel-2); border: 1px solid var(--border);
    border-radius: 6px; padding: 5px 12px; transition: 0.2s;
  }
  .back-btn:hover { color: var(--text); border-color: var(--border-bright); }

  /* ── Progress ── */
  .progress-track { margin: 20px 0 28px; }
  .progress-steps { display: flex; gap: 0; }
  .progress-step {
    flex: 1; position: relative; cursor: pointer;
    display: flex; flex-direction: column; align-items: center; gap: 6px;
  }
  .progress-step .step-dot {
    width: 28px; height: 28px; border-radius: 50%;
    background: var(--panel-2); border: 2px solid var(--border-bright);
    display: flex; align-items: center; justify-content: center;
    font-size: 11px; font-weight: 700; color: var(--muted);
    transition: all 0.3s; z-index: 1; position: relative;
  }
  .progress-step.active .step-dot {
    background: var(--accent); border-color: var(--accent);
    color: #fff; box-shadow: 0 0 12px rgba(88,166,255,0.5);
  }
  .progress-step.done .step-dot {
    background: var(--accent-2); border-color: var(--accent-2);
    color: #fff;
  }
  .progress-step .step-label { font-size: 10px; color: var(--muted); font-weight: 600; text-align: center; white-space: nowrap; }
  .progress-step.active .step-label { color: var(--accent); }
  .progress-step.done .step-label  { color: var(--accent-2); }
  .progress-step::before {
    content: ''; position: absolute; top: 14px; left: calc(-50% + 14px);
    right: calc(50% + 14px); height: 2px; background: var(--border-bright);
  }
  .progress-step:first-child::before { display: none; }
  .progress-step.done::before { background: var(--accent-2); }

  /* ── Sections ── */
  .section { display: none; }
  .section.active { display: block; animation: slideIn 0.35s ease; }
  @keyframes slideIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }

  /* ── Cards ── */
  .card {
    background: var(--panel); border: 1px solid var(--border);
    border-radius: 14px; padding: 24px; margin-bottom: 16px;
    position: relative; overflow: hidden;
  }
  .card::before {
    content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px;
    background: linear-gradient(90deg, var(--accent), var(--accent-4));
    opacity: 0.6;
  }
  .card h2 {
    font-size: 20px; font-weight: 800; color: var(--text);
    margin-bottom: 8px; display: flex; align-items: center; gap: 10px;
  }
  .card h2 .step-num {
    width: 28px; height: 28px; border-radius: 8px;
    background: var(--accent); color: #fff;
    font-size: 12px; font-weight: 800; display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
  }

  /* ── Block desc ── */
  .block-desc {
    background: linear-gradient(135deg, rgba(88,166,255,0.06), rgba(210,168,255,0.06));
    border-left: 3px solid var(--accent);
    padding: 12px 16px; border-radius: 0 8px 8px 0;
    color: var(--text); font-size: 14px; margin: 0 0 20px; line-height: 1.7;
  }

  /* ── Concept tiles ── */
  .concept-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 12px; margin-bottom: 20px; }
  .concept-tile {
    background: var(--panel-2); border: 1px solid var(--border);
    border-radius: 10px; padding: 14px 16px;
    transition: border-color 0.2s, transform 0.2s;
  }
  .concept-tile:hover { border-color: var(--border-bright); transform: translateY(-2px); }
  .concept-tile .tile-icon { font-size: 22px; margin-bottom: 6px; }
  .concept-tile .tile-title { font-size: 13px; font-weight: 700; color: var(--accent); margin-bottom: 4px; }
  .concept-tile .tile-body { font-size: 12px; color: var(--muted); line-height: 1.55; }

  /* ── Code block ── */
  .code-block { background: var(--code-bg); border: 1px solid var(--border); border-radius: 10px; overflow: hidden; margin: 12px 0; }
  .code-header {
    background: var(--panel-2); border-bottom: 1px solid var(--border);
    padding: 7px 14px; display: flex; align-items: center; justify-content: space-between;
  }
  .code-header .dots { display: flex; gap: 5px; }
  .code-header .dots span { width: 10px; height: 10px; border-radius: 50%; }
  .code-header .dots .d-r { background: #ff5f57; }
  .code-header .dots .d-y { background: #ffbd2e; }
  .code-header .dots .d-g { background: #28c840; }
  .code-header .lang { font-size: 10px; color: var(--muted); font-family: monospace; font-weight: 700; letter-spacing: 0.05em; }
  .code-block pre {
    margin: 0; padding: 16px; font-family: 'Consolas', 'Fira Code', monospace;
    font-size: 12px; color: #e6edf3; overflow-x: auto; line-height: 1.65;
    white-space: pre; tab-size: 2;
  }
  /* Syntax highlights */
  .kw  { color: #ff7b72; }
  .fn  { color: #d2a8ff; }
  .st  { color: #a5d6ff; }
  .cm  { color: #8b949e; font-style: italic; }
  .an  { color: #3fb950; }
  .nb  { color: #79c0ff; }

  /* ── Quiz / MCQ ── */
  .quiz-wrap { margin: 16px 0; }
  .question-block { margin-bottom: 22px; }
  .question-text {
    font-size: 14px; font-weight: 700; color: var(--text);
    margin-bottom: 10px; line-height: 1.6; padding: 10px 14px;
    background: var(--panel-2); border-radius: 8px; border-left: 3px solid var(--accent);
  }
  .question-code {
    background: var(--code-bg); border: 1px solid var(--border);
    border-radius: 6px; padding: 10px 14px; margin: 8px 0 10px;
    font-family: 'Consolas', monospace; font-size: 12px; color: #a5d6ff;
    white-space: pre-wrap; word-break: break-word; line-height: 1.6;
  }
  .opt {
    display: flex; align-items: flex-start; gap: 10px;
    padding: 10px 14px; margin: 6px 0;
    border: 1px solid var(--border); border-radius: 8px;
    cursor: pointer; background: var(--panel-2); color: var(--text);
    font-size: 13px; transition: all 0.2s; user-select: none; line-height: 1.5;
  }
  .opt:hover { background: var(--hover-bg); border-color: var(--accent); }
  .opt.sel { background: var(--sel-bg); border-color: var(--accent); }
  .opt.good { background: var(--good-bg); border-color: var(--success); color: var(--success); }
  .opt.bad  { background: var(--bad-bg);  border-color: var(--error);   color: var(--error);   }
  .radio-dot {
    width: 14px; height: 14px; border-radius: 50%;
    border: 2px solid var(--muted); flex-shrink: 0; margin-top: 2px;
    transition: all 0.2s;
  }
  .opt.sel  .radio-dot { background: var(--accent);  border-color: var(--accent); }
  .opt.good .radio-dot { background: var(--success); border-color: var(--success); }
  .opt.bad  .radio-dot { background: var(--error);   border-color: var(--error);  }
  .opt-label { flex: 1; }
  .explanation {
    display: none; margin: 8px 0 4px 24px; padding: 8px 12px;
    background: var(--panel-3); border-radius: 6px;
    font-size: 12px; color: var(--muted); border-left: 2px solid var(--accent-2); line-height: 1.6;
  }
  .explanation.show { display: block; }

  /* ── Vocab / FIB ── */
  .vocab-item { display: flex; align-items: center; gap: 12px; margin: 10px 0; flex-wrap: wrap; }
  .vocab-clue { font-size: 13px; color: var(--text); flex: 1; min-width: 200px; line-height: 1.5; }
  .vocab-clue .hint { font-size: 11px; color: var(--muted); }
  .vocab-input {
    background: var(--code-bg); border: 1px solid var(--border);
    border-radius: 6px; color: var(--text); font-family: monospace;
    font-size: 13px; padding: 7px 10px; text-transform: uppercase;
    transition: border-color 0.2s; width: 120px;
  }
  .vocab-input:focus { outline: none; border-color: var(--accent); }
  .vocab-input.correct { border-color: var(--success); background: var(--good-bg); }
  .vocab-input.wrong   { border-color: var(--error);   background: var(--bad-bg); }

  /* ── API Tester ── */
  .api-tester { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
  @media (max-width: 720px) { .api-tester { grid-template-columns: 1fr; } }
  .api-left, .api-right { display: flex; flex-direction: column; gap: 10px; }
  .field-label { font-size: 11px; font-weight: 700; letter-spacing: 0.07em; text-transform: uppercase; color: var(--muted); margin-bottom: 4px; display: block; }
  select, .api-select {
    background: var(--panel-2); border: 1px solid var(--border);
    border-radius: 8px; color: var(--text); padding: 8px 12px; font-size: 13px;
    cursor: pointer; width: 100%;
  }
  select:focus { outline: none; box-shadow: 0 0 0 2px rgba(88,166,255,0.3); }
  .method-badge {
    display: inline-flex; align-items: center;
    border-radius: 4px; padding: 2px 8px; font-size: 11px; font-weight: 800;
    font-family: monospace; letter-spacing: 0.05em;
  }
  .method-badge.GET    { background: rgba(63,185,80,0.15);  color: #3fb950; }
  .method-badge.POST   { background: rgba(88,166,255,0.15); color: #58a6ff; }
  .method-badge.PUT    { background: rgba(227,179,65,0.15); color: #e3b341; }
  .method-badge.DELETE { background: rgba(248,81,73,0.15);  color: #f85149; }
  .status-badge {
    display: inline-block; border-radius: 4px; padding: 2px 10px;
    font-family: monospace; font-size: 12px; font-weight: 800;
  }
  .status-2xx { background: var(--good-bg); color: var(--success); }
  .status-4xx { background: var(--bad-bg);  color: var(--error); }
  .status-5xx { background: rgba(227,179,65,0.15); color: var(--warn); }
  .response-box {
    background: var(--code-bg); border: 1px solid var(--border);
    border-radius: 10px; overflow: hidden; flex: 1;
  }
  .response-box-header {
    background: var(--panel-2); border-bottom: 1px solid var(--border);
    padding: 7px 14px; display: flex; align-items: center; justify-content: space-between;
    font-size: 11px; color: var(--muted); font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase;
  }
  .response-box-body {
    padding: 14px; font-family: 'Consolas', monospace; font-size: 12px;
    color: #a5d6ff; min-height: 120px; white-space: pre-wrap; word-break: break-word; line-height: 1.6;
  }
  .response-meta { font-size: 11px; color: var(--muted); padding: 6px 14px; border-top: 1px solid var(--border); display: flex; gap: 14px; }

  /* ── FRQ ── */
  .frq-box {
    background: var(--panel-2); border: 1px solid var(--border);
    border-radius: 12px; padding: 20px; margin: 16px 0;
  }
  .frq-question {
    font-size: 14px; font-weight: 700; color: var(--text);
    margin-bottom: 12px; line-height: 1.6;
    padding: 10px 14px; background: var(--panel-3);
    border-radius: 8px; border-left: 3px solid var(--accent-4);
  }
  .frq-textarea {
    width: 100%; background: var(--code-bg);
    border: 1px solid var(--border); border-radius: 8px;
    color: var(--text); font-family: 'Segoe UI', system-ui, sans-serif;
    font-size: 13px; padding: 12px; resize: vertical; min-height: 120px;
    line-height: 1.6; transition: border-color 0.2s;
  }
  .frq-textarea:focus { outline: none; border-color: var(--accent); }
  .frq-feedback {
    margin-top: 12px; padding: 12px 16px;
    background: var(--panel-3); border-radius: 8px;
    border-left: 3px solid var(--accent-2);
    font-size: 13px; color: var(--text); line-height: 1.7;
    display: none;
  }
  .frq-feedback.show { display: block; }
  .frq-rubric { margin-top: 10px; display: flex; flex-wrap: wrap; gap: 8px; }
  .rubric-tag {
    background: var(--panel-2); border: 1px solid var(--border);
    border-radius: 6px; padding: 3px 10px; font-size: 11px; color: var(--muted);
    font-weight: 600;
  }
  .rubric-tag.hit { background: var(--good-bg); border-color: var(--success); color: var(--success); }

  /* ── Buttons ── */
  button {
    appearance: none; border: 1px solid var(--border);
    background: var(--accent); color: #fff;
    padding: 8px 18px; border-radius: 8px; cursor: pointer;
    font-size: 13px; font-weight: 600; transition: all 0.2s;
  }
  button:hover { opacity: 0.85; transform: translateY(-1px); box-shadow: 0 4px 14px rgba(88,166,255,0.25); }
  button:active { transform: translateY(0); }
  button:disabled { opacity: 0.4; cursor: not-allowed; transform: none; box-shadow: none; }
  button.secondary { background: var(--panel-2); color: var(--text); }
  button.secondary:hover { background: var(--panel-3); box-shadow: none; }
  button.success-btn { background: var(--accent-2); }
  .btn-row { display: flex; gap: 8px; flex-wrap: wrap; margin-top: 14px; align-items: center; }
  .score-badge {
    font-size: 13px; font-weight: 700; padding: 4px 12px;
    border-radius: 6px; background: var(--panel-2); color: var(--text);
  }
  .score-badge.perfect { background: var(--good-bg); color: var(--success); }

  /* ── Concept comparison table ── */
  .compare-table { width: 100%; border-collapse: collapse; font-size: 12px; margin: 12px 0; }
  .compare-table th {
    background: var(--panel-2); padding: 8px 12px;
    text-align: left; font-weight: 700; color: var(--accent);
    border-bottom: 1px solid var(--border-bright); font-size: 11px; letter-spacing: 0.05em; text-transform: uppercase;
  }
  .compare-table td { padding: 8px 12px; border-bottom: 1px solid var(--border); color: var(--text); vertical-align: top; line-height: 1.5; }
  .compare-table tr:last-child td { border-bottom: none; }
  .compare-table tr:hover td { background: var(--hover-bg); }
  .compare-table code { background: var(--code-bg); padding: 1px 5px; border-radius: 3px; font-family: monospace; font-size: 11px; color: #a5d6ff; }

  /* ── Architecture diagram ── */
  .arch-diagram { display: flex; align-items: center; gap: 0; margin: 16px 0; flex-wrap: wrap; justify-content: center; }
  .arch-box {
    background: var(--panel-2); border: 1px solid var(--border-bright);
    border-radius: 8px; padding: 10px 16px; text-align: center;
    min-width: 110px; flex-shrink: 0;
  }
  .arch-box .arch-icon { font-size: 20px; margin-bottom: 4px; }
  .arch-box .arch-label { font-size: 11px; font-weight: 700; color: var(--accent); letter-spacing: 0.05em; text-transform: uppercase; }
  .arch-box .arch-sub { font-size: 10px; color: var(--muted); margin-top: 2px; }
  .arch-arrow { color: var(--muted); font-size: 18px; padding: 0 6px; flex-shrink: 0; }

  /* ── Tooltip ── */
  .tip {
    font-size: 12px; color: var(--muted); padding: 8px 14px;
    background: var(--panel-2); border-radius: 6px; border-left: 2px solid var(--accent);
    line-height: 1.5; margin-top: 12px;
  }
  .tip::before { content: '💡 '; }

  /* ── Nav ── */
  .nav-buttons { display: flex; gap: 12px; margin-top: 28px; justify-content: space-between; align-items: center; }
  #stepIndicator { font-size: 12px; color: var(--muted); }
</style>

<div class="container page-content">
  <div class="lesson-header">
    <div class="badge">Module 2 · Encrypters Team</div>
    <h1>Backend Development</h1>
    <p>Servers, databases, frameworks, APIs — everything that runs behind what users see.</p>
    <a href="../" class="back-btn">← Back to Big Six</a>
  </div>

  <!-- Progress tracker -->
  <div class="progress-track">
    <div class="progress-steps" id="progressSteps"></div>
  </div>

  <!-- ═══════════════════════════════════════════
       STEP 1: Backend Fundamentals
  ═══════════════════════════════════════════ -->
  <div class="section active" id="step1">
    <div class="card">
      <h2><span class="step-num">1</span> Backend Fundamentals</h2>
      <div class="block-desc">The backend is everything users <em>don't</em> see — authentication, business logic, data processing, and API endpoints. Before saving anything or returning a response, a well-built backend always <strong>validates first</strong>.</div>

      <!-- Architecture diagram -->
      <div class="arch-diagram">
        <div class="arch-box"><div class="arch-icon">🌐</div><div class="arch-label">Client</div><div class="arch-sub">Browser / App</div></div>
        <div class="arch-arrow">→</div>
        <div class="arch-box" style="border-color:rgba(88,166,255,0.4);"><div class="arch-icon">🛡️</div><div class="arch-label">Auth</div><div class="arch-sub">Validate &amp; Guard</div></div>
        <div class="arch-arrow">→</div>
        <div class="arch-box"><div class="arch-icon">⚙️</div><div class="arch-label">Controller</div><div class="arch-sub">Route Handler</div></div>
        <div class="arch-arrow">→</div>
        <div class="arch-box"><div class="arch-icon">🧠</div><div class="arch-label">Service</div><div class="arch-sub">Business Logic</div></div>
        <div class="arch-arrow">→</div>
        <div class="arch-box"><div class="arch-icon">🗃️</div><div class="arch-label">Database</div><div class="arch-sub">Persist Data</div></div>
      </div>

      <!-- Concept tiles -->
      <div class="concept-grid">
        <div class="concept-tile">
          <div class="tile-icon">🔒</div>
          <div class="tile-title">Authentication</div>
          <div class="tile-body">Verify who the user is (login, JWT, sessions). Happens before any data is accessed.</div>
        </div>
        <div class="concept-tile">
          <div class="tile-icon">✅</div>
          <div class="tile-title">Validation</div>
          <div class="tile-body">Check that incoming data has the right format and required fields before processing.</div>
        </div>
        <div class="concept-tile">
          <div class="tile-icon">🧠</div>
          <div class="tile-title">Business Logic</div>
          <div class="tile-body">Rules specific to your app — pricing, permissions, workflows. Lives in the Service layer.</div>
        </div>
        <div class="concept-tile">
          <div class="tile-icon">📡</div>
          <div class="tile-title">API Endpoints</div>
          <div class="tile-body">URLs the frontend calls. Each maps to a controller method that handles a specific action.</div>
        </div>
      </div>

      <!-- MCQ -->
      <div id="quiz1" class="quiz-wrap"></div>
      <div class="btn-row">
        <button onclick="gradeQuiz('quiz1')">Grade</button>
        <button onclick="resetQuiz('quiz1')" class="secondary">Reset</button>
        <span id="quiz1-score" class="score-badge" style="display:none;"></span>
      </div>
      <div class="tip">Validation and authentication always happen before database writes. A backend that saves first and asks questions later is a security risk.</div>
    </div>
  </div>

  <!-- ═══════════════════════════════════════════
       STEP 2: Databases & APIs
  ═══════════════════════════════════════════ -->
  <div class="section" id="step2">
    <div class="card">
      <h2><span class="step-num">2</span> Databases &amp; APIs</h2>
      <div class="block-desc">Databases persist your data. APIs expose it. Understanding SQL vs NoSQL and REST principles is foundational to every backend project.</div>

      <!-- SQL vs NoSQL comparison -->
      <table class="compare-table">
        <thead>
          <tr><th>Feature</th><th>SQL (Relational)</th><th>NoSQL (Non-Relational)</th></tr>
        </thead>
        <tbody>
          <tr><td>Structure</td><td>Fixed schema — tables, rows, columns</td><td>Flexible — documents, key-value, graphs</td></tr>
          <tr><td>Query language</td><td><code>SELECT * FROM users WHERE id = 1</code></td><td><code>db.users.find({id: 1})</code></td></tr>
          <tr><td>Relationships</td><td>JOINs between tables</td><td>Embedded documents or references</td></tr>
          <tr><td>Best for</td><td>Complex queries, strict consistency</td><td>Scale, flexible data, rapid iteration</td></tr>
          <tr><td>Examples</td><td>PostgreSQL, MySQL, SQLite</td><td>MongoDB, Redis, DynamoDB</td></tr>
        </tbody>
      </table>

      <!-- REST CRUD code snippet -->
      <div class="code-block">
        <div class="code-header">
          <div class="dots"><span class="d-r"></span><span class="d-y"></span><span class="d-g"></span></div>
          <span class="lang">REST API — CRUD Endpoints</span>
        </div>
        <pre><span class="cm"># Spring Boot Controller</span>
<span class="an">@RestController</span>
<span class="an">@RequestMapping</span>(<span class="st">"/api/users"</span>)
<span class="kw">public class</span> <span class="fn">UserController</span> {

    <span class="an">@GetMapping</span>           <span class="cm">// GET  /api/users       → Read all</span>
    <span class="kw">public</span> List&lt;User&gt; <span class="fn">getAll</span>() { ... }

    <span class="an">@GetMapping</span>(<span class="st">"/{id}"</span>)  <span class="cm">// GET  /api/users/1     → Read one</span>
    <span class="kw">public</span> User <span class="fn">getById</span>(<span class="an">@PathVariable</span> Long id) { ... }

    <span class="an">@PostMapping</span>          <span class="cm">// POST /api/users       → Create</span>
    <span class="kw">public</span> User <span class="fn">create</span>(<span class="an">@RequestBody</span> UserDTO dto) { ... }

    <span class="an">@PutMapping</span>(<span class="st">"/{id}"</span>)   <span class="cm">// PUT  /api/users/1     → Update</span>
    <span class="kw">public</span> User <span class="fn">update</span>(<span class="an">@PathVariable</span> Long id, <span class="an">@RequestBody</span> UserDTO dto) { ... }

    <span class="an">@DeleteMapping</span>(<span class="st">"/{id}"</span>) <span class="cm">// DELETE /api/users/1   → Delete</span>
    <span class="kw">public void</span> <span class="fn">delete</span>(<span class="an">@PathVariable</span> Long id) { ... }
}</pre>
      </div>

      <!-- Fill-in-the-blank vocab -->
      <h3 style="color:var(--accent);font-size:15px;margin:20px 0 12px;">Vocabulary Check — Fill in the Blanks</h3>
      <div id="vocab2" class="quiz-wrap"></div>
      <div class="btn-row">
        <button onclick="gradeVocab('vocab2')">Check Answers</button>
        <button onclick="resetVocab('vocab2')" class="secondary">Reset</button>
        <span id="vocab2-score" class="score-badge" style="display:none;"></span>
      </div>
      <div class="tip">In REST, every endpoint maps to one of four CRUD operations: Create (POST), Read (GET), Update (PUT/PATCH), Delete (DELETE).</div>
    </div>
  </div>

  <!-- ═══════════════════════════════════════════
       STEP 3: Backend Frameworks
  ═══════════════════════════════════════════ -->
  <div class="section" id="step3">
    <div class="card">
      <h2><span class="step-num">3</span> Backend Frameworks</h2>
      <div class="block-desc">Frameworks give structure. <strong>Flask</strong> (Python) is minimal and flexible — great for microservices and ML backends. <strong>Spring Boot</strong> (Java) is opinionated and full-featured — great for enterprise APIs with strict layers.</div>

      <!-- Framework comparison -->
      <table class="compare-table">
        <thead>
          <tr><th>Feature</th><th>Flask (Python)</th><th>Spring Boot (Java)</th></tr>
        </thead>
        <tbody>
          <tr><td>Philosophy</td><td>Micro — bring what you need</td><td>Opinionated — batteries included</td></tr>
          <tr><td>Routing</td><td><code>@app.route('/path')</code></td><td><code>@GetMapping('/path')</code></td></tr>
          <tr><td>DB layer</td><td>SQLAlchemy / raw SQL</td><td>Spring Data JPA / Hibernate</td></tr>
          <tr><td>Auth built-in</td><td>Flask-Login / JWT manual</td><td>Spring Security (powerful)</td></tr>
          <tr><td>Best for</td><td>Quick APIs, ML serving, scripts</td><td>Large enterprise backends, strict architecture</td></tr>
        </tbody>
      </table>

      <!-- Side-by-side code -->
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin:16px 0;">
        <div>
          <div class="field-label" style="margin-bottom:6px;">Flask (Python)</div>
          <div class="code-block">
            <div class="code-header"><div class="dots"><span class="d-r"></span><span class="d-y"></span><span class="d-g"></span></div><span class="lang">python</span></div>
            <pre><span class="kw">from</span> flask <span class="kw">import</span> Flask, jsonify

app = <span class="fn">Flask</span>(__name__)

<span class="an">@app.route</span>(<span class="st">'/api/hello'</span>)
<span class="kw">def</span> <span class="fn">hello</span>():
    <span class="kw">return</span> <span class="fn">jsonify</span>({
        <span class="st">'message'</span>: <span class="st">'Hello!'</span>
    })

<span class="kw">if</span> __name__ == <span class="st">'__main__'</span>:
    app.<span class="fn">run</span>(debug=<span class="nb">True</span>)</pre>
          </div>
        </div>
        <div>
          <div class="field-label" style="margin-bottom:6px;">Spring Boot (Java)</div>
          <div class="code-block">
            <div class="code-header"><div class="dots"><span class="d-r"></span><span class="d-y"></span><span class="d-g"></span></div><span class="lang">java</span></div>
            <pre><span class="an">@RestController</span>
<span class="an">@RequestMapping</span>(<span class="st">"/api"</span>)
<span class="kw">public class</span> <span class="fn">HelloController</span> {

    <span class="an">@GetMapping</span>(<span class="st">"/hello"</span>)
    <span class="kw">public</span> Map&lt;String, String&gt; <span class="fn">hello</span>() {
        <span class="kw">return</span> Map.<span class="fn">of</span>(
            <span class="st">"message"</span>, <span class="st">"Hello!"</span>
        );
    }
}</pre>
          </div>
        </div>
      </div>

      <!-- MCQ -->
      <div id="quiz3" class="quiz-wrap"></div>
      <div class="btn-row">
        <button onclick="gradeQuiz('quiz3')">Grade</button>
        <button onclick="resetQuiz('quiz3')" class="secondary">Reset</button>
        <span id="quiz3-score" class="score-badge" style="display:none;"></span>
      </div>
      <div class="tip">Spring Boot's layered architecture: Controller (routes) → Service (logic) → Repository (database). Never put database calls in a Controller.</div>
    </div>
  </div>

  <!-- ═══════════════════════════════════════════
       STEP 4: API Tester
  ═══════════════════════════════════════════ -->
  <div class="section" id="step4">
    <div class="card">
      <h2><span class="step-num">4</span> API Project &amp; Testing</h2>
      <div class="block-desc">Testing your API before the frontend is built is essential. Tools like <strong>Postman</strong> let you send requests, inspect responses, and verify your endpoints behave correctly — all without writing a single line of frontend code.</div>

      <div class="api-tester">
        <div class="api-left">
          <span class="field-label">Method + Endpoint</span>
          <select id="endpoint-select">
            <option value="GET:/api/users">GET /api/users</option>
            <option value="GET:/api/users/1">GET /api/users/1</option>
            <option value="POST:/api/users">POST /api/users</option>
            <option value="PUT:/api/users/1">PUT /api/users/1</option>
            <option value="DELETE:/api/users/1">DELETE /api/users/1</option>
            <option value="GET:/api/invalid">GET /api/invalid (404)</option>
            <option value="POST:/api/users/bad">POST /api/users (invalid body → 400)</option>
          </select>

          <span class="field-label" style="margin-top:12px;">Request Preview</span>
          <div class="code-block">
            <div class="code-header"><div class="dots"><span class="d-r"></span><span class="d-y"></span><span class="d-g"></span></div><span class="lang" id="reqLang">http</span></div>
            <pre id="reqPreview" style="font-size:11px;">GET /api/users HTTP/1.1
Host: localhost:8080
Accept: application/json</pre>
          </div>

          <button onclick="sendRequest()" style="margin-top:8px;">▶ Send Request</button>
          <div id="sendStatus" style="font-size:12px;color:var(--muted);margin-top:6px;"></div>
        </div>

        <div class="api-right">
          <span class="field-label">Response</span>
          <div class="response-box" style="flex:1;">
            <div class="response-box-header">
              <span>Body</span>
              <span id="status-badge-wrap"></span>
            </div>
            <div class="response-box-body" id="response-body">Select an endpoint and click Send.</div>
            <div class="response-meta" id="response-meta" style="display:none;">
              <span id="resp-time"></span>
              <span id="resp-size"></span>
            </div>
          </div>

          <span class="field-label" style="margin-top:12px;">What to look for</span>
          <div id="apiHint" style="background:var(--panel-3);border:1px solid var(--border);border-radius:8px;padding:12px;font-size:12px;color:var(--muted);line-height:1.6;">
            Pick an endpoint and send a request to see what a real API response looks like.
          </div>
        </div>
      </div>

      <div class="tip">HTTP status codes tell you what happened: 2xx = success, 4xx = client error (bad request, not found), 5xx = server error.</div>
    </div>
  </div>

  <!-- ═══════════════════════════════════════════
       STEP 5: Advanced Backend
  ═══════════════════════════════════════════ -->
  <div class="section" id="step5">
    <div class="card">
      <h2><span class="step-num">5</span> Advanced Backend Concepts</h2>
      <div class="block-desc">Once you know the basics, these are the patterns that separate junior from senior backend engineers — security, scalability, observability, and AI integration.</div>

      <div class="concept-grid">
        <div class="concept-tile">
          <div class="tile-icon">☁️</div>
          <div class="tile-title">Serverless</div>
          <div class="tile-body">Deploy individual functions (AWS Lambda, Vercel Functions) without managing a server. Scale to zero when idle.</div>
        </div>
        <div class="concept-tile">
          <div class="tile-icon">🔑</div>
          <div class="tile-title">JWT Auth</div>
          <div class="tile-body">JSON Web Tokens encode user identity. The backend signs them; every subsequent request carries the token so no session needed.</div>
        </div>
        <div class="concept-tile">
          <div class="tile-icon">📊</div>
          <div class="tile-title">Observability</div>
          <div class="tile-body">Logging, metrics, and tracing. You can't fix what you can't see — structured logs are as important as the code itself.</div>
        </div>
        <div class="concept-tile">
          <div class="tile-icon">🤖</div>
          <div class="tile-title">AI Integration</div>
          <div class="tile-body">Backend calls to LLM APIs (OpenAI, Gemini) for summarization, classification, generation — AI is just another service call.</div>
        </div>
        <div class="concept-tile">
          <div class="tile-icon">⚡</div>
          <div class="tile-title">Caching</div>
          <div class="tile-body">Redis stores frequent queries in memory so the database isn't hit every time. Can cut response times 100x.</div>
        </div>
        <div class="concept-tile">
          <div class="tile-icon">🏗️</div>
          <div class="tile-title">IaC</div>
          <div class="tile-body">Infrastructure as Code (Terraform, Pulumi) — define servers, databases, and networks in version-controlled config files.</div>
        </div>
      </div>

      <!-- JWT code -->
      <div class="code-block">
        <div class="code-header"><div class="dots"><span class="d-r"></span><span class="d-y"></span><span class="d-g"></span></div><span class="lang">python — JWT token flow</span></div>
        <pre><span class="kw">import</span> jwt, datetime

SECRET = <span class="st">"your-secret-key"</span>

<span class="kw">def</span> <span class="fn">create_token</span>(user_id):
    payload = {
        <span class="st">"sub"</span>: user_id,
        <span class="st">"iat"</span>: datetime.<span class="fn">utcnow</span>(),
        <span class="st">"exp"</span>: datetime.<span class="fn">utcnow</span>() + datetime.timedelta(hours=<span class="nb">24</span>)
    }
    <span class="kw">return</span> jwt.<span class="fn">encode</span>(payload, SECRET, algorithm=<span class="st">"HS256"</span>)

<span class="kw">def</span> <span class="fn">verify_token</span>(token):
    <span class="kw">try</span>:
        <span class="kw">return</span> jwt.<span class="fn">decode</span>(token, SECRET, algorithms=[<span class="st">"HS256"</span>])
    <span class="kw">except</span> jwt.ExpiredSignatureError:
        <span class="kw">raise</span> <span class="fn">Exception</span>(<span class="st">"Token expired"</span>)
    <span class="kw">except</span> jwt.InvalidTokenError:
        <span class="kw">raise</span> <span class="fn">Exception</span>(<span class="st">"Invalid token"</span>)</pre>
      </div>

      <!-- Advanced MCQ -->
      <div id="quiz5" class="quiz-wrap"></div>
      <div class="btn-row">
        <button onclick="gradeQuiz('quiz5')">Grade</button>
        <button onclick="resetQuiz('quiz5')" class="secondary">Reset</button>
        <span id="quiz5-score" class="score-badge" style="display:none;"></span>
      </div>
    </div>
  </div>

  <!-- ═══════════════════════════════════════════
       STEP 6: FRQ & Reflection
  ═══════════════════════════════════════════ -->
  <div class="section" id="step6">
    <div class="card">
      <h2><span class="step-num">6</span> Free Response &amp; Reflection</h2>
      <div class="block-desc">Apply everything you've learned. Answer each question thoughtfully — responses are graded against a rubric of key backend concepts.</div>

      <div id="frqContainer"></div>

      <div style="margin-top:24px;background:var(--panel-2);border:1px solid var(--border);border-radius:10px;padding:16px;">
        <div style="font-size:14px;font-weight:700;color:#a6c9ff;margin-bottom:10px;">✅ What You Covered</div>
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:8px;">
          <div style="background:var(--panel-3);border-radius:8px;padding:10px 12px;font-size:12px;color:var(--muted);">
            <span style="color:var(--accent-2);font-weight:700;">Step 1</span> — Backend flow: validate → authenticate → process → persist
          </div>
          <div style="background:var(--panel-3);border-radius:8px;padding:10px 12px;font-size:12px;color:var(--muted);">
            <span style="color:var(--accent-2);font-weight:700;">Step 2</span> — SQL vs NoSQL, REST CRUD, HTTP methods &amp; status codes
          </div>
          <div style="background:var(--panel-3);border-radius:8px;padding:10px 12px;font-size:12px;color:var(--muted);">
            <span style="color:var(--accent-2);font-weight:700;">Step 3</span> — Flask vs Spring Boot architecture and layering
          </div>
          <div style="background:var(--panel-3);border-radius:8px;padding:10px 12px;font-size:12px;color:var(--muted);">
            <span style="color:var(--accent-2);font-weight:700;">Step 4</span> — API testing: status codes, request/response shape
          </div>
          <div style="background:var(--panel-3);border-radius:8px;padding:10px 12px;font-size:12px;color:var(--muted);">
            <span style="color:var(--accent-2);font-weight:700;">Step 5</span> — Serverless, JWT, caching, observability, AI integration
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Navigation -->
  <div class="nav-buttons">
    <button id="prevBtn" onclick="prevStep()" class="secondary" disabled>← Previous</button>
    <span id="stepIndicator">Step 1 / 6</span>
    <button id="nextBtn" onclick="nextStep()">Next →</button>
  </div>
</div>

<script>
// ============================================================
// CONFIG — all lesson data lives here
// ============================================================
const STEPS = ['step1','step2','step3','step4','step5','step6'];
const STEP_LABELS = ['Fundamentals','Databases','Frameworks','API Testing','Advanced','FRQ'];
const STORAGE_KEY = 'backend_combined_v2';

// ── MCQ DATA ──────────────────────────────────────────────
const QUIZZES = {
  quiz1: [
    {
      q: 'You see this frontend call:',
      code: 'fetch(`${javaURI}/api/responses`, {\n  method: "POST",\n  headers: { "Content-Type": "application/json" },\n  body: JSON.stringify({ name: "Ana", response: "Here is my answer" })\n});',
      opts: [
        'Immediately save the data to the database',
        'Return a success message to the frontend',
        'Validate the request format and required fields, then authenticate the user if needed',
        'Start a background processing job'
      ],
      a: 2,
      explanation: 'Correct — validation and authentication always happen first. Saving unvalidated data is a major security risk that can corrupt the database or allow malicious input.'
    },
    {
      q: 'Which HTTP status code indicates a request succeeded and a new resource was created?',
      opts: ['200 OK', '201 Created', '204 No Content', '301 Moved Permanently'],
      a: 1,
      explanation: '201 Created is the correct response for a successful POST that creates a new resource. 200 OK is for successful reads or updates that return a body.'
    },
    {
      q: 'What does a 401 Unauthorized response mean?',
      opts: [
        'The resource does not exist',
        'The server crashed',
        'The client is not authenticated — no valid credentials were provided',
        'The client does not have permission for this specific resource (that is 403)'
      ],
      a: 2,
      explanation: '401 = not authenticated (no login / bad token). 403 = authenticated but not authorized (you are logged in but do not have permission). These are different!'
    }
  ],

  quiz3: [
    {
      q: 'In Spring Boot\'s layered architecture, which layer should contain business logic?',
      opts: ['Controller — it handles the HTTP request', 'Service — it holds all business rules and logic', 'Repository — it talks to the database', 'Entity — it defines the data model'],
      a: 1,
      explanation: 'The Service layer holds business logic. Controllers only route requests and call services. Repositories only talk to the database. This separation makes code testable and maintainable.'
    },
    {
      q: 'What is the primary advantage of Flask over Spring Boot for a small ML serving endpoint?',
      opts: [
        'Flask has built-in Spring Security',
        'Flask uses JPA for database access',
        'Flask is minimal and Python-native, making it easy to integrate with PyTorch/TensorFlow models',
        'Flask requires less RAM than Spring at runtime'
      ],
      a: 2,
      explanation: 'Flask is written in Python, which is the native language of ML libraries like PyTorch and TensorFlow. You can import your model directly and serve predictions with very few lines of code.'
    },
    {
      q: 'Which annotation in Spring Boot maps a POST request to a controller method?',
      opts: ['@GetMapping', '@PostMapping', '@RequestBody', '@Service'],
      a: 1,
      explanation: '@PostMapping maps HTTP POST requests to the annotated method. @RequestBody is used to bind the request body to a parameter, not to map the route.'
    }
  ],

  quiz5: [
    {
      q: 'What is the main advantage of serverless functions (e.g., AWS Lambda) over traditional servers?',
      opts: [
        'They run faster than regular servers',
        'They scale automatically to zero when idle — no idle compute cost',
        'They support more programming languages',
        'They do not need authentication'
      ],
      a: 1,
      explanation: 'Serverless functions spin up on demand and scale down to zero — you only pay when they run. Traditional servers run 24/7 even when idle.'
    },
    {
      q: 'In a JWT (JSON Web Token), where is user data stored?',
      opts: [
        'In a server-side session database',
        'In a cookie only',
        'Encoded directly in the token payload — readable by anyone, signed by the server',
        'Encrypted inside the token — unreadable without the private key'
      ],
      a: 2,
      explanation: 'JWT payloads are Base64-encoded, not encrypted — anyone can read the claims. The server\'s signature (using a secret key) is what makes them tamper-proof. Never put sensitive data like passwords in a JWT payload.'
    },
    {
      q: 'What does Redis primarily improve in a backend architecture?',
      opts: [
        'Code compilation speed',
        'Database schema migrations',
        'Response time for frequently accessed data by caching it in memory',
        'Serverless cold start latency'
      ],
      a: 2,
      explanation: 'Redis is an in-memory data store used as a cache. Frequently queried data is stored in RAM so the backend skips the database entirely on cache hits, reducing response times dramatically.'
    }
  ]
};

// ── VOCAB DATA ────────────────────────────────────────────
const VOCAB_DATA = {
  vocab2: [
    { clue: 'A structured set of rows and columns in a relational database', hint: '5 letters', answer: 'TABLE' },
    { clue: 'A single record in a database table', hint: '3 letters', answer: 'ROW' },
    { clue: 'A lightweight data format used in REST API responses (two abbreviations)', hint: '4 letters', answer: 'JSON' },
    { clue: 'The HTTP method used to CREATE a new resource', hint: '4 letters', answer: 'POST' },
    { clue: 'SQL keyword used to combine rows from two or more tables', hint: '4 letters', answer: 'JOIN' }
  ]
};

// ── FRQ DATA ──────────────────────────────────────────────
const FRQ_DATA = [
  {
    id: 'frq1',
    q: 'Describe the full lifecycle of a POST request in a Spring Boot backend — from the moment the frontend sends the request to the moment a response is returned. Mention at least three layers.',
    rubric: [
      { key: 'controller', label: 'Controller mentioned', test: a => /controller/i.test(a) },
      { key: 'service', label: 'Service layer mentioned', test: a => /service/i.test(a) },
      { key: 'repository', label: 'Repository / database layer mentioned', test: a => /repositor|database|db|persist/i.test(a) },
      { key: 'validation', label: 'Validation or auth discussed', test: a => /valid|auth/i.test(a) },
      { key: 'response', label: 'HTTP response / status code discussed', test: a => /response|status|201|200|return/i.test(a) }
    ]
  },
  {
    id: 'frq2',
    q: 'Compare SQL and NoSQL databases. Give a real-world scenario where you would choose each, and explain why.',
    rubric: [
      { key: 'sql_def', label: 'SQL defined (relational, schema, tables)', test: a => /relational|schema|table|column|row/i.test(a) },
      { key: 'nosql_def', label: 'NoSQL defined (flexible, document, key-value)', test: a => /nosql|document|flexible|mongo|key.value/i.test(a) },
      { key: 'sql_use', label: 'SQL use case given', test: a => /bank|financial|transaction|commerce|consistent/i.test(a) },
      { key: 'nosql_use', label: 'NoSQL use case given', test: a => /social|real.time|cache|scale|json|rapid/i.test(a) },
      { key: 'reasoning', label: 'Reasoning explained (not just listed)', test: a => a.length > 120 }
    ]
  }
];

// ── API MOCK ──────────────────────────────────────────────
const MOCK_API = {
  'GET:/api/users': {
    status: 200,
    body: [{ id: 1, name: 'Alice', role: 'admin' }, { id: 2, name: 'Bob', role: 'user' }],
    hint: '200 OK — the server found the resource and returned it. This is the expected response for a successful GET.'
  },
  'GET:/api/users/1': {
    status: 200,
    body: { id: 1, name: 'Alice', role: 'admin', createdAt: '2024-01-15' },
    hint: '200 OK — fetching a single record by ID. If the ID did not exist you would get 404.'
  },
  'POST:/api/users': {
    status: 201,
    body: { id: 3, name: 'Carol', role: 'user', createdAt: '2025-12-02' },
    hint: '201 Created — a new resource was successfully created. The response body contains the created record with its new ID.'
  },
  'PUT:/api/users/1': {
    status: 200,
    body: { id: 1, name: 'Alice Updated', role: 'admin', updatedAt: '2025-12-02' },
    hint: '200 OK — the resource was updated. Some APIs return 204 No Content instead (no body).'
  },
  'DELETE:/api/users/1': {
    status: 204,
    body: null,
    hint: '204 No Content — the resource was deleted. No body is returned because there is nothing left to send.'
  },
  'GET:/api/invalid': {
    status: 404,
    body: { error: 'Not Found', message: 'No route matches GET /api/invalid', timestamp: '2025-12-02T10:30:00Z' },
    hint: '404 Not Found — the route or resource does not exist. Check your URL path and spelling.'
  },
  'POST:/api/users/bad': {
    status: 400,
    body: { error: 'Bad Request', message: 'Validation failed: "name" is required, "email" must be a valid email', timestamp: '2025-12-02T10:30:00Z' },
    hint: '400 Bad Request — the client sent invalid data. The server caught this during validation before touching the database.'
  }
};

const REQUEST_PREVIEWS = {
  'GET:/api/users':       `GET /api/users HTTP/1.1\nHost: localhost:8080\nAccept: application/json`,
  'GET:/api/users/1':     `GET /api/users/1 HTTP/1.1\nHost: localhost:8080\nAccept: application/json`,
  'POST:/api/users':      `POST /api/users HTTP/1.1\nHost: localhost:8080\nContent-Type: application/json\n\n{\n  "name": "Carol",\n  "role": "user"\n}`,
  'PUT:/api/users/1':     `PUT /api/users/1 HTTP/1.1\nHost: localhost:8080\nContent-Type: application/json\n\n{\n  "name": "Alice Updated"\n}`,
  'DELETE:/api/users/1':  `DELETE /api/users/1 HTTP/1.1\nHost: localhost:8080`,
  'GET:/api/invalid':     `GET /api/invalid HTTP/1.1\nHost: localhost:8080`,
  'POST:/api/users/bad':  `POST /api/users HTTP/1.1\nHost: localhost:8080\nContent-Type: application/json\n\n{\n  "name": "",\n  "email": "not-an-email"\n}`
};

// ============================================================
// State
// ============================================================
let currentStep = 0;
const quizPicks = {}; // quizId → { qIndex → optIndex }

const $ = id => document.getElementById(id);

// ============================================================
// Navigation
// ============================================================
function showStep(n) {
  currentStep = Math.max(0, Math.min(STEPS.length - 1, n));
  STEPS.forEach((s, i) => $(s).classList.toggle('active', i === currentStep));

  // Update progress dots
  const stepsEl = $('progressSteps');
  stepsEl.innerHTML = STEPS.map((_, i) => {
    const state = i < currentStep ? 'done' : i === currentStep ? 'active' : '';
    const icon = i < currentStep ? '✓' : i + 1;
    return `<div class="progress-step ${state}" onclick="showStep(${i})">
      <div class="step-dot">${icon}</div>
      <div class="step-label">${STEP_LABELS[i]}</div>
    </div>`;
  }).join('');

  $('stepIndicator').textContent = `Step ${currentStep + 1} / ${STEPS.length}`;
  $('prevBtn').disabled = currentStep === 0;
  $('nextBtn').disabled = currentStep === STEPS.length - 1;

  persist();

  if (currentStep === STEPS.length - 1) {
    if (typeof completeBigSixLesson === 'function') completeBigSixLesson();
  }
  saveBigSixProgress(currentStep + 1);
}

function prevStep() { showStep(currentStep - 1); }
function nextStep() { showStep(currentStep + 1); }

// ============================================================
// MCQ Engine
// ============================================================
function renderQuiz(quizId) {
  const data = QUIZZES[quizId];
  if (!data) return;
  const box = $(quizId);
  if (!box) return;
  if (!quizPicks[quizId]) quizPicks[quizId] = {};
  box.innerHTML = '';

  data.forEach((item, qi) => {
    const wrap = document.createElement('div');
    wrap.className = 'question-block';

    const qText = document.createElement('div');
    qText.className = 'question-text';
    qText.textContent = `Q${qi + 1}. ${item.q}`;
    wrap.appendChild(qText);

    if (item.code) {
      const codeEl = document.createElement('pre');
      codeEl.className = 'question-code';
      codeEl.textContent = item.code;
      wrap.appendChild(codeEl);
    }

    item.opts.forEach((optText, oi) => {
      const el = document.createElement('div');
      el.className = 'opt';
      el.dataset.qi = qi;
      el.dataset.oi = oi;
      el.dataset.quiz = quizId;

      const dot = document.createElement('span');
      dot.className = 'radio-dot';

      const lbl = document.createElement('span');
      lbl.className = 'opt-label';
      lbl.textContent = `${String.fromCharCode(65 + oi)}. ${optText}`;

      el.appendChild(dot);
      el.appendChild(lbl);

      el.addEventListener('click', () => {
        quizPicks[quizId][qi] = oi;
        box.querySelectorAll(`.opt[data-qi="${qi}"][data-quiz="${quizId}"]`).forEach(x => x.classList.remove('sel'));
        el.classList.add('sel');
      });

      wrap.appendChild(el);
    });

    // Explanation placeholder (hidden until graded)
    const exp = document.createElement('div');
    exp.className = 'explanation';
    exp.id = `${quizId}-exp-${qi}`;
    wrap.appendChild(exp);

    box.appendChild(wrap);
  });
}

function gradeQuiz(quizId) {
  const data = QUIZZES[quizId];
  if (!data) return;
  const picks = quizPicks[quizId] || {};
  let correct = 0;

  data.forEach((item, qi) => {
    const chosen = picks[qi];
    // Clear previous
    document.querySelectorAll(`.opt[data-qi="${qi}"][data-quiz="${quizId}"]`).forEach(el => el.classList.remove('good', 'bad'));
    const expEl = $(`${quizId}-exp-${qi}`);

    if (chosen === undefined) {
      // Not answered
      if (expEl) { expEl.textContent = '⚠ Not answered. The correct answer is ' + String.fromCharCode(65 + item.a) + '.'; expEl.classList.add('show'); }
      return;
    }

    const isCorrect = chosen === item.a;
    if (isCorrect) correct++;

    const chosenEl = document.querySelector(`.opt[data-qi="${qi}"][data-oi="${chosen}"][data-quiz="${quizId}"]`);
    if (chosenEl) chosenEl.classList.add(isCorrect ? 'good' : 'bad');

    if (!isCorrect) {
      const correctEl = document.querySelector(`.opt[data-qi="${qi}"][data-oi="${item.a}"][data-quiz="${quizId}"]`);
      if (correctEl) correctEl.classList.add('good');
    }

    if (expEl) {
      expEl.textContent = (isCorrect ? '✅ ' : '❌ ') + item.explanation;
      expEl.classList.add('show');
    }
  });

  const scoreEl = $(`${quizId}-score`);
  if (scoreEl) {
    scoreEl.textContent = `${correct} / ${data.length}`;
    scoreEl.style.display = 'inline-block';
    scoreEl.className = 'score-badge' + (correct === data.length ? ' perfect' : '');
  }
}

function resetQuiz(quizId) {
  quizPicks[quizId] = {};
  const scoreEl = $(`${quizId}-score`);
  if (scoreEl) { scoreEl.style.display = 'none'; scoreEl.textContent = ''; }
  renderQuiz(quizId);
}

// ============================================================
// Vocab / Fill-in-Blank Engine
// ============================================================
function renderVocab(vocabId) {
  const data = VOCAB_DATA[vocabId];
  if (!data) return;
  const box = $(vocabId);
  if (!box) return;
  box.innerHTML = '';
  data.forEach((item, i) => {
    const row = document.createElement('div');
    row.className = 'vocab-item';
    row.innerHTML = `
      <div class="vocab-clue">
        <strong>${i + 1}.</strong> ${item.clue}
        <span class="hint">(${item.hint})</span>
      </div>
      <input class="vocab-input" id="${vocabId}-inp-${i}" maxlength="${item.answer.length}"
             placeholder="${'_'.repeat(item.answer.length)}" autocomplete="off" spellcheck="false" />
    `;
    box.appendChild(row);
  });
}

function gradeVocab(vocabId) {
  const data = VOCAB_DATA[vocabId];
  if (!data) return;
  let correct = 0;
  data.forEach((item, i) => {
    const inp = $(`${vocabId}-inp-${i}`);
    if (!inp) return;
    const val = inp.value.trim().toUpperCase();
    const isCorrect = val === item.answer;
    if (isCorrect) correct++;
    inp.classList.remove('correct', 'wrong');
    inp.classList.add(isCorrect ? 'correct' : 'wrong');
    if (!isCorrect) inp.placeholder = item.answer; // Reveal answer
  });
  const scoreEl = $(`${vocabId}-score`);
  if (scoreEl) {
    scoreEl.textContent = `${correct} / ${data.length}`;
    scoreEl.style.display = 'inline-block';
    scoreEl.className = 'score-badge' + (correct === data.length ? ' perfect' : '');
  }
}

function resetVocab(vocabId) {
  const data = VOCAB_DATA[vocabId];
  if (!data) return;
  data.forEach((_, i) => {
    const inp = $(`${vocabId}-inp-${i}`);
    if (inp) { inp.value = ''; inp.className = 'vocab-input'; inp.placeholder = '_'.repeat(data[i].answer.length); }
  });
  const scoreEl = $(`${vocabId}-score`);
  if (scoreEl) { scoreEl.style.display = 'none'; scoreEl.textContent = ''; }
}

// ============================================================
// API Tester
// ============================================================
function updateRequestPreview() {
  const key = $('endpoint-select').value;
  const preview = REQUEST_PREVIEWS[key] || '';
  $('reqPreview').textContent = preview;
  const method = key.split(':')[0];
  $('reqLang').textContent = method + ' · http';
}

function sendRequest() {
  const key = $('endpoint-select').value;
  const mock = MOCK_API[key];
  if (!mock) return;

  const bodyEl = $('response-body');
  const metaEl = $('response-meta');
  const hintEl = $('apiHint');
  const statusWrap = $('status-badge-wrap');
  const sendStatus = $('sendStatus');

  bodyEl.textContent = 'Sending…';
  statusWrap.innerHTML = '';
  metaEl.style.display = 'none';
  sendStatus.textContent = 'Request sent…';

  const start = Date.now();
  const delay = 300 + Math.floor(Math.random() * 300);

  setTimeout(() => {
    const elapsed = Date.now() - start;
    const body = mock.body ? JSON.stringify(mock.body, null, 2) : '(no body — 204 No Content)';
    const size = body.length;

    bodyEl.textContent = body;

    const s = mock.status;
    const cls = s >= 500 ? 'status-5xx' : s >= 400 ? 'status-4xx' : 'status-2xx';
    statusWrap.innerHTML = `<span class="status-badge ${cls}">${s}</span>`;

    metaEl.style.display = 'flex';
    $('resp-time').textContent = `⏱ ${elapsed}ms`;
    $('resp-size').textContent = `📦 ${size} bytes`;

    hintEl.innerHTML = `<strong style="color:var(--text);">${s}</strong> — ${mock.hint}`;
    sendStatus.textContent = 'Done';
  }, delay);
}

// ============================================================
// FRQ Engine
// ============================================================
function renderFrqs() {
  const container = $('frqContainer');
  if (!container) return;
  container.innerHTML = '';

  FRQ_DATA.forEach((frq, fi) => {
    const wrap = document.createElement('div');
    wrap.className = 'frq-box';
    wrap.innerHTML = `
      <div class="frq-question">FRQ ${fi + 1}: ${frq.q}</div>
      <textarea class="frq-textarea" id="${frq.id}-ans" rows="5" placeholder="Write your response here — use complete sentences and be specific..."></textarea>
      <div class="btn-row">
        <button onclick="gradeFrq('${frq.id}')">Grade Response</button>
        <button class="secondary" onclick="resetFrq('${frq.id}')">Clear</button>
      </div>
      <div class="frq-feedback" id="${frq.id}-fb"></div>
    `;
    container.appendChild(wrap);
  });
}

function gradeFrq(frqId) {
  const frq = FRQ_DATA.find(f => f.id === frqId);
  if (!frq) return;
  const answer = ($(`${frqId}-ans`).value || '').trim();
  const fb = $(`${frqId}-fb`);

  if (!answer) { fb.innerHTML = '<span style="color:var(--error);">Please write a response before grading.</span>'; fb.classList.add('show'); return; }

  let hits = 0;
  const tagsHtml = frq.rubric.map(r => {
    const passed = r.test(answer);
    if (passed) hits++;
    return `<span class="rubric-tag ${passed ? 'hit' : ''}">${passed ? '✓' : '○'} ${r.label}</span>`;
  }).join('');

  const total = frq.rubric.length;
  const score = Math.round((hits / total) * 100);
  let verdict = '';
  if (score >= 80) verdict = `<strong style="color:var(--success);">Strong response (${hits}/${total} criteria met)</strong>`;
  else if (score >= 50) verdict = `<strong style="color:var(--warn);">Partial response (${hits}/${total} criteria met) — expand your answer</strong>`;
  else verdict = `<strong style="color:var(--error);">Needs more depth (${hits}/${total} criteria met)</strong>`;

  fb.innerHTML = `${verdict}<div class="frq-rubric" style="margin-top:10px;">${tagsHtml}</div>`;
  fb.classList.add('show');
}

function resetFrq(frqId) {
  const ans = $(`${frqId}-ans`);
  const fb = $(`${frqId}-fb`);
  if (ans) ans.value = '';
  if (fb) { fb.innerHTML = ''; fb.classList.remove('show'); }
}

// ============================================================
// Persistence
// ============================================================
function persist() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify({ step: currentStep })); } catch(e) {}
}

function restore() {
  try {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (data) showStep(data.step || 0);
    else showStep(0);
  } catch(e) { showStep(0); }
}

function saveBigSixProgress(stepNumber) {
  try {
    const key = 'bigsix:backend_lesson:lesson:' + stepNumber;
    if (localStorage.getItem(key) !== 'done') localStorage.setItem(key, 'done');
  } catch(e) {}
}

// ============================================================
// Boot
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
  renderQuiz('quiz1');
  renderVocab('vocab2');
  renderQuiz('quiz3');
  renderQuiz('quiz5');
  renderFrqs();

  const epSelect = $('endpoint-select');
  if (epSelect) epSelect.addEventListener('change', updateRequestPreview);
  updateRequestPreview();

  restore();
});
</script>

<script>
(function(){
  document.addEventListener('DOMContentLoaded',function(){
    document.querySelectorAll('a.back-btn').forEach(function(a){
      a.addEventListener('click',function(e){
        if(e.metaKey||e.ctrlKey||e.shiftKey||e.button===1)return;
        e.preventDefault();
        try{if(document.referrer&&new URL(document.referrer).origin===location.origin){history.back();return;}}catch(err){}
        var p=location.pathname.replace(/\/$/,'').split('/');
        if(p.length>1){p.pop();window.location.href=p.join('/')+'/';}else{window.location.href='/';}
      });
    });
  });
})();
</script>

<script src="/assets/js/lesson-completion-bigsix.js"></script>