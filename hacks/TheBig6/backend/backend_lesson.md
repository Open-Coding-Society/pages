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
  /* ============================================================
     DESIGN TOKENS — matches the default bigsix theme
     ============================================================ */
  :root {
    --bg:       #0a0e27;
    --panel:    #0f1729;
    --panel-2:  #1a2540;
    --panel-3:  #1e2d45;
    --border:   rgba(255,255,255,0.08);
    --border-bright: rgba(255,255,255,0.14);
    --text:     #e6eef8;
    --muted:    #9aa6bf;
    --accent:   #7c3aed;
    --accent2:  #a78bfa;
    --success:  #22c55e;
    --danger:   #ef4444;
    --warn:     #f59e0b;
    --good-bg:  rgba(34,197,94,0.12);
    --bad-bg:   rgba(239,68,68,0.12);
    --hover-bg: rgba(124,58,237,0.1);
    --sel-bg:   rgba(124,58,237,0.2);
    --code-bg:  #060d1f;
  }

  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: var(--bg); color: var(--text); font-family: 'Segoe UI', system-ui, sans-serif; line-height: 1.65; }

  .container { max-width: 1000px; margin: 0 auto; padding: 28px 16px 64px; }

  /* ---- Header ---- */
  .lesson-header { margin-bottom: 32px; padding-bottom: 20px; border-bottom: 1px solid var(--border); }
  .lesson-header .badge {
    display: inline-flex; align-items: center; gap: 6px;
    background: var(--panel-2); border: 1px solid var(--border-bright);
    border-radius: 20px; padding: 3px 12px; font-size: 11px; font-weight: 700;
    letter-spacing: 0.06em; text-transform: uppercase; color: var(--accent2);
    margin-bottom: 10px;
  }
  .lesson-header .badge::before {
    content: ''; width: 6px; height: 6px; border-radius: 50%;
    background: var(--accent); box-shadow: 0 0 8px var(--accent); display: inline-block;
  }
  .lesson-header h1 { font-size: 30px; font-weight: 800; letter-spacing: -0.02em; margin-bottom: 6px; }
  .lesson-header p  { color: var(--muted); font-size: 14px; }
  .back-btn {
    display: inline-flex; align-items: center; gap: 6px; margin-top: 12px;
    font-size: 12px; font-weight: 600; color: var(--muted); text-decoration: none;
    background: var(--panel-2); border: 1px solid var(--border);
    border-radius: 6px; padding: 5px 12px; transition: 0.2s;
  }
  .back-btn:hover { color: var(--text); border-color: var(--border-bright); }

  /* ---- Progress dots ---- */
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
    color: #fff; box-shadow: 0 0 12px rgba(124,58,237,0.5);
  }
  .progress-step.done .step-dot { background: var(--success); border-color: var(--success); color: #fff; }
  .progress-step .step-label { font-size: 10px; color: var(--muted); font-weight: 600; text-align: center; white-space: nowrap; }
  .progress-step.active .step-label { color: var(--accent2); }
  .progress-step.done  .step-label  { color: var(--success); }
  .progress-step::before {
    content: ''; position: absolute; top: 14px;
    left: calc(-50% + 14px); right: calc(50% + 14px);
    height: 2px; background: var(--border-bright);
  }
  .progress-step:first-child::before { display: none; }
  .progress-step.done::before { background: var(--success); }

  /* ---- Sections ---- */
  .section        { display: none; }
  .section.active { display: block; animation: slideIn 0.3s ease; }
  @keyframes slideIn { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }

  /* ---- Cards ---- */
  .card {
    background: var(--panel); border: 1px solid var(--border);
    border-radius: 14px; padding: 24px; margin-bottom: 16px;
    position: relative; overflow: hidden;
  }
  .card::before {
    content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px;
    background: linear-gradient(90deg, var(--accent), var(--accent2)); opacity: 0.6;
  }
  .card h2 { font-size: 20px; font-weight: 800; color: var(--text); margin-bottom: 8px; display: flex; align-items: center; gap: 10px; }
  .card h2 .step-num {
    width: 28px; height: 28px; border-radius: 8px;
    background: var(--accent); color: #fff;
    font-size: 12px; font-weight: 800; display: flex; align-items: center; justify-content: center; flex-shrink: 0;
  }
  .card h3 { font-size: 15px; color: var(--accent2); margin: 20px 0 8px; }

  /* ---- Block desc ---- */
  .block-desc {
    background: linear-gradient(135deg, rgba(124,58,237,0.06), rgba(167,139,250,0.06));
    border-left: 3px solid var(--accent); padding: 12px 16px;
    border-radius: 0 8px 8px 0; color: var(--text); font-size: 14px;
    margin: 0 0 20px; line-height: 1.7;
  }

  /* ---- Concept tiles ---- */
  .concept-grid { display: grid; grid-template-columns: repeat(auto-fit,minmax(200px,1fr)); gap: 12px; margin-bottom: 20px; }
  .concept-tile {
    background: var(--panel-2); border: 1px solid var(--border);
    border-radius: 10px; padding: 14px 16px; transition: border-color 0.2s, transform 0.2s;
  }
  .concept-tile:hover { border-color: rgba(124,58,237,0.4); transform: translateY(-2px); }
  .concept-tile .tile-icon  { font-size: 22px; margin-bottom: 6px; }
  .concept-tile .tile-title { font-size: 13px; font-weight: 700; color: var(--accent2); margin-bottom: 4px; }
  .concept-tile .tile-body  { font-size: 12px; color: var(--muted); line-height: 1.55; }

  /* ---- Code block ---- */
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
  .code-block pre { margin: 0; padding: 16px; font-family: 'Consolas','Fira Code',monospace; font-size: 12px; color: #e6edf3; overflow-x: auto; line-height: 1.65; white-space: pre; }
  .kw { color: #ff7b72; } .fn { color: #d2a8ff; } .st { color: #a5d6ff; }
  .cm { color: #8b949e; font-style: italic; } .an { color: #7c3aed; } .nb { color: #a78bfa; }

  /* ---- Quiz ---- */
  .quiz-wrap { margin: 16px 0; }
  .question-block { margin-bottom: 22px; }
  .question-text {
    font-size: 14px; font-weight: 700; color: var(--text); margin-bottom: 10px;
    line-height: 1.6; padding: 10px 14px; background: var(--panel-2);
    border-radius: 8px; border-left: 3px solid var(--accent);
  }
  .opt {
    display: flex; align-items: flex-start; gap: 10px; padding: 10px 14px; margin: 6px 0;
    border: 1px solid var(--border); border-radius: 8px;
    cursor: pointer; background: var(--panel-2); color: var(--text);
    font-size: 13px; transition: all 0.2s; user-select: none; line-height: 1.5;
  }
  .opt:hover { background: var(--hover-bg); border-color: var(--accent); }
  .opt.sel  { background: var(--sel-bg);  border-color: var(--accent); }
  .opt.good { background: var(--good-bg); border-color: rgba(34,197,94,0.5); color: #86efac; }
  .opt.bad  { background: var(--bad-bg);  border-color: rgba(239,68,68,0.5);  color: #fca5a5; }
  .radio-dot { width: 14px; height: 14px; border-radius: 50%; border: 2px solid var(--muted); flex-shrink: 0; margin-top: 2px; transition: all 0.2s; }
  .opt.sel  .radio-dot { background: var(--accent);  border-color: var(--accent); }
  .opt.good .radio-dot { background: var(--success); border-color: var(--success); }
  .opt.bad  .radio-dot { background: var(--danger);  border-color: var(--danger); }
  .opt-label { flex: 1; }
  .explanation { display: none; margin: 6px 0 4px 24px; padding: 8px 12px; background: var(--panel-3); border-radius: 6px; font-size: 12px; color: var(--muted); border-left: 2px solid var(--success); line-height: 1.6; }
  .explanation.show { display: block; }

  /* ---- Vocab fill-in ---- */
  .vocab-item { display: flex; align-items: center; gap: 12px; margin: 10px 0; flex-wrap: wrap; }
  .vocab-clue { font-size: 13px; color: var(--text); flex: 1; min-width: 200px; line-height: 1.5; }
  .vocab-clue .hint { font-size: 11px; color: var(--muted); }
  .vocab-input {
    background: var(--code-bg); border: 1px solid var(--border);
    border-radius: 6px; color: var(--text); font-family: monospace;
    font-size: 13px; padding: 7px 10px; text-transform: uppercase;
    transition: border-color 0.2s; width: 130px;
  }
  .vocab-input:focus { outline: none; border-color: var(--accent); }
  .vocab-input.correct { border-color: var(--success); background: var(--good-bg); }
  .vocab-input.wrong   { border-color: var(--danger);  background: var(--bad-bg); }

  /* ---- API tester ---- */
  .api-tester { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
  @media (max-width: 720px) { .api-tester { grid-template-columns: 1fr; } }
  .field-label { font-size: 11px; font-weight: 700; letter-spacing: 0.07em; text-transform: uppercase; color: var(--muted); margin-bottom: 4px; display: block; }
  select { background: var(--panel-2); border: 1px solid var(--border); border-radius: 8px; color: var(--text); padding: 8px 12px; font-size: 13px; cursor: pointer; width: 100%; }
  select:focus { outline: none; box-shadow: 0 0 0 2px rgba(124,58,237,0.3); }
  .status-badge { display: inline-block; border-radius: 4px; padding: 2px 10px; font-family: monospace; font-size: 12px; font-weight: 800; }
  .status-2xx { background: var(--good-bg); color: #86efac; }
  .status-4xx { background: var(--bad-bg);  color: #fca5a5; }
  .status-5xx { background: rgba(245,158,11,0.15); color: var(--warn); }
  .response-box { background: var(--code-bg); border: 1px solid var(--border); border-radius: 10px; overflow: hidden; }
  .response-box-header { background: var(--panel-2); border-bottom: 1px solid var(--border); padding: 7px 14px; display: flex; align-items: center; justify-content: space-between; font-size: 11px; color: var(--muted); font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; }
  .response-box-body { padding: 14px; font-family: 'Consolas',monospace; font-size: 12px; color: #a5d6ff; min-height: 120px; white-space: pre-wrap; word-break: break-word; line-height: 1.6; }
  .response-meta { font-size: 11px; color: var(--muted); padding: 6px 14px; border-top: 1px solid var(--border); display: flex; gap: 14px; }

  /* ---- FRQ ---- */
  .frq-box { background: var(--panel-2); border: 1px solid var(--border); border-radius: 12px; padding: 20px; margin: 16px 0; }
  .frq-question { font-size: 14px; font-weight: 700; color: var(--text); margin-bottom: 12px; line-height: 1.6; padding: 10px 14px; background: var(--panel-3); border-radius: 8px; border-left: 3px solid var(--accent2); }
  .frq-textarea { width: 100%; background: var(--code-bg); border: 1px solid var(--border); border-radius: 8px; color: var(--text); font-family: 'Segoe UI',system-ui,sans-serif; font-size: 13px; padding: 12px; resize: vertical; min-height: 120px; line-height: 1.6; transition: border-color 0.2s; }
  .frq-textarea:focus { outline: none; border-color: var(--accent); }
  .frq-feedback { margin-top: 12px; padding: 12px 16px; background: var(--panel-3); border-radius: 8px; border-left: 3px solid var(--success); font-size: 13px; color: var(--text); line-height: 1.7; display: none; }
  .frq-feedback.show { display: block; }

  /* ---- Compare table ---- */
  .compare-table { width: 100%; border-collapse: collapse; font-size: 12px; margin: 12px 0; }
  .compare-table th { background: var(--panel-2); padding: 8px 12px; text-align: left; font-weight: 700; color: var(--accent2); border-bottom: 1px solid var(--border-bright); font-size: 11px; letter-spacing: 0.05em; text-transform: uppercase; }
  .compare-table td { padding: 8px 12px; border-bottom: 1px solid var(--border); color: var(--text); vertical-align: top; line-height: 1.5; }
  .compare-table tr:last-child td { border-bottom: none; }
  .compare-table tr:hover td { background: var(--hover-bg); }
  .compare-table code { background: var(--code-bg); padding: 1px 5px; border-radius: 3px; font-family: monospace; font-size: 11px; color: #a5d6ff; }

  /* ---- Architecture diagram ---- */
  .arch-diagram { display: flex; align-items: center; gap: 0; margin: 16px 0; flex-wrap: wrap; justify-content: center; }
  .arch-box { background: var(--panel-2); border: 1px solid var(--border-bright); border-radius: 8px; padding: 10px 16px; text-align: center; min-width: 110px; flex-shrink: 0; }
  .arch-box .arch-icon  { font-size: 20px; margin-bottom: 4px; }
  .arch-box .arch-label { font-size: 11px; font-weight: 700; color: var(--accent2); letter-spacing: 0.05em; text-transform: uppercase; }
  .arch-box .arch-sub   { font-size: 10px; color: var(--muted); margin-top: 2px; }
  .arch-arrow { color: var(--muted); font-size: 18px; padding: 0 6px; flex-shrink: 0; }

  /* ---- Buttons ---- */
  button { appearance: none; border: 1px solid var(--border); background: var(--accent); color: #fff; padding: 8px 18px; border-radius: 8px; cursor: pointer; font-size: 13px; font-weight: 600; transition: all 0.2s; }
  button:hover { background: #6d28d9; transform: translateY(-1px); box-shadow: 0 4px 14px rgba(124,58,237,0.3); }
  button:active { transform: translateY(0); }
  button:disabled { opacity: 0.4; cursor: not-allowed; transform: none; box-shadow: none; }
  button.secondary { background: var(--panel-2); color: var(--text); }
  button.secondary:hover { background: var(--panel-3); box-shadow: none; }
  .btn-row { display: flex; gap: 8px; flex-wrap: wrap; margin-top: 14px; align-items: center; }
  .score-badge { font-size: 13px; font-weight: 700; padding: 4px 12px; border-radius: 6px; background: var(--panel-2); color: var(--text); }
  .score-badge.perfect { background: var(--good-bg); color: #86efac; }

  /* ---- Tip ---- */
  .tip { font-size: 12px; color: var(--muted); padding: 8px 14px; background: var(--panel-2); border-radius: 6px; border-left: 2px solid var(--accent); line-height: 1.5; margin-top: 12px; }
  .tip::before { content: '💡 '; }

  /* ---- Nav ---- */
  .nav-buttons { display: flex; gap: 12px; margin-top: 28px; justify-content: space-between; align-items: center; }
  #stepIndicator { font-size: 12px; color: var(--muted); }
</style>

<div class="container page-content">
  <div class="lesson-header">
    <div class="badge">Module 2 · Encrypters Team</div>
    <h1>Backend Development</h1>
    <p>Servers, databases, frameworks, APIs — everything that runs behind what users see.</p>
    <a href="../" class="button back-btn">← Back to Big Six</a>
  </div>

  <!-- Progress dots — rendered by JS -->
  <div class="progress-track">
    <div class="progress-steps" id="progressSteps"></div>
  </div>

  <!-- ======================================================
       STEP 1 — Backend Fundamentals
       ====================================================== -->
  <div class="section active" id="step1">
    <div class="card">
      <h2><span class="step-num">1</span> Backend Fundamentals</h2>
      <div class="block-desc">The backend is everything users <em>don't</em> see — authentication, business logic, data processing, and API endpoints. Before saving anything, a well-built backend always <strong>validates first</strong>.</div>

      <div class="arch-diagram">
        <div class="arch-box"><div class="arch-icon">🌐</div><div class="arch-label">Client</div><div class="arch-sub">Browser / App</div></div>
        <div class="arch-arrow">→</div>
        <div class="arch-box" style="border-color:rgba(124,58,237,0.5);"><div class="arch-icon">🛡️</div><div class="arch-label">Auth</div><div class="arch-sub">Validate &amp; Guard</div></div>
        <div class="arch-arrow">→</div>
        <div class="arch-box"><div class="arch-icon">⚙️</div><div class="arch-label">Controller</div><div class="arch-sub">Route Handler</div></div>
        <div class="arch-arrow">→</div>
        <div class="arch-box"><div class="arch-icon">🧠</div><div class="arch-label">Service</div><div class="arch-sub">Business Logic</div></div>
        <div class="arch-arrow">→</div>
        <div class="arch-box"><div class="arch-icon">🗃️</div><div class="arch-label">Database</div><div class="arch-sub">Persist Data</div></div>
      </div>

      <div class="concept-grid">
        <div class="concept-tile"><div class="tile-icon">🔒</div><div class="tile-title">Authentication</div><div class="tile-body">Verify who the user is (login, JWT, sessions). Happens before any data is accessed.</div></div>
        <div class="concept-tile"><div class="tile-icon">✅</div><div class="tile-title">Validation</div><div class="tile-body">Check that incoming data has the right format and required fields before processing.</div></div>
        <div class="concept-tile"><div class="tile-icon">🧠</div><div class="tile-title">Business Logic</div><div class="tile-body">Rules specific to your app — pricing, permissions, workflows. Lives in the Service layer.</div></div>
        <div class="concept-tile"><div class="tile-icon">📡</div><div class="tile-title">API Endpoints</div><div class="tile-body">URLs the frontend calls. Each maps to a controller method that handles a specific action.</div></div>
      </div>

      <!-- Quiz injected by JS into #quiz1 -->
      <div id="quiz1" class="quiz-wrap"></div>
      <div class="btn-row">
        <button id="gradeQuiz1Btn">Grade</button>
        <button id="resetQuiz1Btn" class="secondary">Reset</button>
        <span id="quiz1-score" class="score-badge" style="display:none;"></span>
      </div>
      <div class="tip">Validation and authentication always happen before database writes. A backend that saves first is a security risk.</div>
    </div>
  </div>

  <!-- ======================================================
       STEP 2 — Databases & APIs
       ====================================================== -->
  <div class="section" id="step2">
    <div class="card">
      <h2><span class="step-num">2</span> Databases &amp; APIs</h2>
      <div class="block-desc">Databases persist your data. APIs expose it. Understanding SQL vs NoSQL and REST principles is foundational to every backend project.</div>

      <table class="compare-table">
        <thead><tr><th>Feature</th><th>SQL (Relational)</th><th>NoSQL (Non-Relational)</th></tr></thead>
        <tbody>
          <tr><td>Structure</td><td>Fixed schema — tables, rows, columns</td><td>Flexible — documents, key-value, graphs</td></tr>
          <tr><td>Query language</td><td><code>SELECT * FROM users WHERE id = 1</code></td><td><code>db.users.find({id: 1})</code></td></tr>
          <tr><td>Relationships</td><td>JOINs between tables</td><td>Embedded documents or references</td></tr>
          <tr><td>Best for</td><td>Complex queries, strict consistency</td><td>Scale, flexible data, rapid iteration</td></tr>
          <tr><td>Examples</td><td>PostgreSQL, MySQL, SQLite</td><td>MongoDB, Redis, DynamoDB</td></tr>
        </tbody>
      </table>

      <div class="code-block">
        <div class="code-header"><div class="dots"><span class="d-r"></span><span class="d-y"></span><span class="d-g"></span></div><span class="lang">REST API — CRUD Endpoints (Spring Boot)</span></div>
        <pre><span class="an">@RestController</span>
<span class="an">@RequestMapping</span>(<span class="st">"/api/users"</span>)
<span class="kw">public class</span> <span class="fn">UserController</span> {

    <span class="an">@GetMapping</span>           <span class="cm">// GET  /api/users     → Read all</span>
    <span class="kw">public</span> List&lt;User&gt; <span class="fn">getAll</span>() { ... }

    <span class="an">@GetMapping</span>(<span class="st">"/{id}"</span>)  <span class="cm">// GET  /api/users/1   → Read one</span>
    <span class="kw">public</span> User <span class="fn">getById</span>(<span class="an">@PathVariable</span> Long id) { ... }

    <span class="an">@PostMapping</span>          <span class="cm">// POST /api/users     → Create</span>
    <span class="kw">public</span> User <span class="fn">create</span>(<span class="an">@RequestBody</span> UserDTO dto) { ... }

    <span class="an">@PutMapping</span>(<span class="st">"/{id}"</span>)   <span class="cm">// PUT  /api/users/1   → Update</span>
    <span class="kw">public</span> User <span class="fn">update</span>(<span class="an">@PathVariable</span> Long id, <span class="an">@RequestBody</span> UserDTO dto) { ... }

    <span class="an">@DeleteMapping</span>(<span class="st">"/{id}"</span>) <span class="cm">// DELETE /api/users/1 → Delete</span>
    <span class="kw">public void</span> <span class="fn">delete</span>(<span class="an">@PathVariable</span> Long id) { ... }
}</pre>
      </div>

      <h3>Vocabulary Check — Fill in the Blanks</h3>
      <div id="vocab2" class="quiz-wrap"></div>
      <div class="btn-row">
        <button id="gradeVocab2Btn">Check Answers</button>
        <button id="resetVocab2Btn" class="secondary">Reset</button>
        <span id="vocab2-score" class="score-badge" style="display:none;"></span>
      </div>
      <div class="tip">In REST, every endpoint maps to a CRUD operation: Create (POST), Read (GET), Update (PUT/PATCH), Delete (DELETE).</div>
    </div>
  </div>

  <!-- ======================================================
       STEP 3 — Backend Frameworks
       ====================================================== -->
  <div class="section" id="step3">
    <div class="card">
      <h2><span class="step-num">3</span> Backend Frameworks</h2>
      <div class="block-desc"><strong>Flask</strong> (Python) is minimal and flexible — great for microservices and ML backends. <strong>Spring Boot</strong> (Java) is opinionated and full-featured — great for enterprise APIs with strict layers.</div>

      <table class="compare-table">
        <thead><tr><th>Feature</th><th>Flask (Python)</th><th>Spring Boot (Java)</th></tr></thead>
        <tbody>
          <tr><td>Philosophy</td><td>Micro — bring what you need</td><td>Opinionated — batteries included</td></tr>
          <tr><td>Routing</td><td><code>@app.route('/path')</code></td><td><code>@GetMapping('/path')</code></td></tr>
          <tr><td>DB layer</td><td>SQLAlchemy / raw SQL</td><td>Spring Data JPA / Hibernate</td></tr>
          <tr><td>Auth built-in</td><td>Flask-Login / JWT manual</td><td>Spring Security (powerful)</td></tr>
          <tr><td>Best for</td><td>Quick APIs, ML serving, scripts</td><td>Large enterprise backends, strict architecture</td></tr>
        </tbody>
      </table>

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin:16px 0;">
        <div>
          <span class="field-label" style="margin-bottom:6px;">Flask (Python)</span>
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
          <span class="field-label" style="margin-bottom:6px;">Spring Boot (Java)</span>
          <div class="code-block">
            <div class="code-header"><div class="dots"><span class="d-r"></span><span class="d-y"></span><span class="d-g"></span></div><span class="lang">java</span></div>
            <pre><span class="an">@RestController</span>
<span class="an">@RequestMapping</span>(<span class="st">"/api"</span>)
<span class="kw">public class</span> <span class="fn">HelloController</span> {

    <span class="an">@GetMapping</span>(<span class="st">"/hello"</span>)
    <span class="kw">public</span> Map&lt;String,String&gt; <span class="fn">hello</span>() {
        <span class="kw">return</span> Map.<span class="fn">of</span>(
            <span class="st">"message"</span>, <span class="st">"Hello!"</span>
        );
    }
}</pre>
          </div>
        </div>
      </div>

      <div id="quiz3" class="quiz-wrap"></div>
      <div class="btn-row">
        <button id="gradeQuiz3Btn">Grade</button>
        <button id="resetQuiz3Btn" class="secondary">Reset</button>
        <span id="quiz3-score" class="score-badge" style="display:none;"></span>
      </div>
      <div class="tip">Spring Boot layered architecture: Controller (routes) → Service (logic) → Repository (database). Never put database calls in a Controller.</div>
    </div>
  </div>

  <!-- ======================================================
       STEP 4 — API Tester
       ====================================================== -->
  <div class="section" id="step4">
    <div class="card">
      <h2><span class="step-num">4</span> API Project &amp; Testing</h2>
      <div class="block-desc">Testing your API before the frontend is built is essential. Tools like <strong>Postman</strong> let you send requests, inspect responses, and verify your endpoints behave correctly.</div>

      <div class="api-tester">
        <div style="display:flex;flex-direction:column;gap:10px;">
          <span class="field-label">Method + Endpoint</span>
          <select id="endpointSelect"></select>

          <span class="field-label">Request Preview</span>
          <div class="code-block">
            <div class="code-header"><div class="dots"><span class="d-r"></span><span class="d-y"></span><span class="d-g"></span></div><span class="lang">http</span></div>
            <pre id="reqPreview" style="font-size:11px;">Select an endpoint above.</pre>
          </div>
          <button id="sendRequestBtn">▶ Send Request</button>
        </div>

        <div style="display:flex;flex-direction:column;gap:10px;">
          <span class="field-label">Response</span>
          <div class="response-box">
            <div class="response-box-header">
              <span>Body</span>
              <span id="statusBadgeWrap"></span>
            </div>
            <div class="response-box-body" id="responseBody">Select an endpoint and click Send.</div>
            <div class="response-meta" id="responseMeta" style="display:none;">
              <span id="respTime"></span>
              <span id="respSize"></span>
            </div>
          </div>
          <span class="field-label">What to look for</span>
          <div id="apiHint" style="background:var(--panel-3);border:1px solid var(--border);border-radius:8px;padding:12px;font-size:12px;color:var(--muted);line-height:1.6;">
            Pick an endpoint and send a request to see what a real API response looks like.
          </div>
        </div>
      </div>
      <div class="tip">HTTP status codes: 2xx = success, 4xx = client error (bad request, not found), 5xx = server error.</div>
    </div>
  </div>

  <!-- ======================================================
       STEP 5 — Advanced Backend
       ====================================================== -->
  <div class="section" id="step5">
    <div class="card">
      <h2><span class="step-num">5</span> Advanced Backend Concepts</h2>
      <div class="block-desc">Once you know the basics, these are the patterns that separate junior from senior backend engineers — security, scalability, observability, and AI integration.</div>

      <div class="concept-grid">
        <div class="concept-tile"><div class="tile-icon">☁️</div><div class="tile-title">Serverless</div><div class="tile-body">Deploy individual functions (AWS Lambda, Vercel) without managing a server. Scale to zero when idle.</div></div>
        <div class="concept-tile"><div class="tile-icon">🔑</div><div class="tile-title">JWT Auth</div><div class="tile-body">JSON Web Tokens encode user identity. The backend signs them; every request carries the token.</div></div>
        <div class="concept-tile"><div class="tile-icon">📊</div><div class="tile-title">Observability</div><div class="tile-body">Logging, metrics, and tracing. You can't fix what you can't see — structured logs are critical.</div></div>
        <div class="concept-tile"><div class="tile-icon">🤖</div><div class="tile-title">AI Integration</div><div class="tile-body">Backend calls to LLM APIs (OpenAI, Gemini) for summarization, classification, generation.</div></div>
        <div class="concept-tile"><div class="tile-icon">⚡</div><div class="tile-title">Caching</div><div class="tile-body">Redis stores frequent queries in memory so the database isn't hit every time. Can cut response times 100x.</div></div>
        <div class="concept-tile"><div class="tile-icon">🏗️</div><div class="tile-title">IaC</div><div class="tile-body">Infrastructure as Code (Terraform, Pulumi) — define servers and networks in version-controlled config files.</div></div>
      </div>

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

      <div id="quiz5" class="quiz-wrap"></div>
      <div class="btn-row">
        <button id="gradeQuiz5Btn">Grade</button>
        <button id="resetQuiz5Btn" class="secondary">Reset</button>
        <span id="quiz5-score" class="score-badge" style="display:none;"></span>
      </div>
    </div>
  </div>

  <!-- ======================================================
       STEP 6 — FRQ & Reflection
       ====================================================== -->
  <div class="section" id="step6">
    <div class="card">
      <h2><span class="step-num">6</span> Free Response &amp; Reflection</h2>
      <div class="block-desc">Apply everything you've learned. Answer each question thoughtfully.</div>

      <div id="frqContainer"></div>

      <div style="margin-top:24px;background:var(--panel-2);border:1px solid var(--border);border-radius:10px;padding:16px;">
        <div style="font-size:14px;font-weight:700;color:var(--accent2);margin-bottom:10px;">✅ What You Covered</div>
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:8px;">
          <div style="background:var(--panel-3);border-radius:8px;padding:10px 12px;font-size:12px;color:var(--muted);"><span style="color:var(--success);font-weight:700;">Step 1</span> — Backend flow: validate → authenticate → process → persist</div>
          <div style="background:var(--panel-3);border-radius:8px;padding:10px 12px;font-size:12px;color:var(--muted);"><span style="color:var(--success);font-weight:700;">Step 2</span> — SQL vs NoSQL, REST CRUD, HTTP methods &amp; status codes</div>
          <div style="background:var(--panel-3);border-radius:8px;padding:10px 12px;font-size:12px;color:var(--muted);"><span style="color:var(--success);font-weight:700;">Step 3</span> — Flask vs Spring Boot architecture and layering</div>
          <div style="background:var(--panel-3);border-radius:8px;padding:10px 12px;font-size:12px;color:var(--muted);"><span style="color:var(--success);font-weight:700;">Step 4</span> — API testing: status codes, request/response shape</div>
          <div style="background:var(--panel-3);border-radius:8px;padding:10px 12px;font-size:12px;color:var(--muted);"><span style="color:var(--success);font-weight:700;">Step 5</span> — Serverless, JWT, caching, observability, AI integration</div>
        </div>
      </div>
    </div>
  </div>

  <div class="nav-buttons">
    <button id="prevBtn" class="secondary" disabled>← Previous</button>
    <span id="stepIndicator">Step 1 / 6</span>
    <button id="nextBtn">Next →</button>
  </div>
</div>

<script type="module">
// ============================================================
//  ORCHESTRATOR — backend_lesson.md
//  Imports all SRP modules and calls their init functions.
//  No logic lives here — everything is in assets/js/bigsix/backend/
// ============================================================

import { CONFIG }         from '{{ site.baseurl }}/assets/js/bigsix/backend/data.js';
import { showStep,
         initNavigation } from '{{ site.baseurl }}/assets/js/bigsix/backend/navigation.js';
import { persist,
         restore }        from '{{ site.baseurl }}/assets/js/bigsix/backend/persistence.js';
import { initQuizzes }    from '{{ site.baseurl }}/assets/js/bigsix/backend/quiz.js';
import { initVocab }      from '{{ site.baseurl }}/assets/js/bigsix/backend/vocab.js';
import { initFrqs }       from '{{ site.baseurl }}/assets/js/bigsix/backend/frq.js';
import { initApiTester }  from '{{ site.baseurl }}/assets/js/bigsix/backend/api-tester.js';

document.addEventListener('DOMContentLoaded', () => {
  initNavigation(CONFIG.STEP_LABELS); // auto-detect sections, wire buttons
  restore(showStep);                  // jump to saved step
  initQuizzes(CONFIG.QUIZZES);        // render + wire quiz1, quiz3, quiz5
  initVocab(CONFIG.VOCAB);            // render + wire vocab2
  initFrqs(CONFIG.FRQS);              // render + wire FRQ boxes
  initApiTester(CONFIG);              // populate endpoints, wire send button
});
</script>

<!-- INLINE FALLBACK — delete this block once SRP modules are in place -->
<script>
// ============================================================
//  CONFIG — all hardcoded content lives here
//  Edit this block to update questions, vocab, FRQs, and API
//  mock responses without touching any logic below.
// ============================================================
const CONFIG = {

  STORAGE_KEY: 'bigsix_backend_lesson',

  STEP_LABELS: ['Fundamentals','Databases & APIs','Frameworks','API Testing','Advanced','FRQ'],

  // ── Quiz questions ────────────────────────────────────────
  QUIZZES: {
    quiz1: [
      {
        q: 'In the backend request lifecycle, what happens FIRST?',
        opts: ['Write to the database','Run business logic in the Service layer','Authenticate and validate the incoming request','Return a JSON response'],
        a: 2,
        explanation: 'Authentication and validation always happen before any data is read or written. This prevents unauthorized or malformed data from ever reaching your business logic.',
      },
      {
        q: 'Which layer is responsible for business logic in a layered backend?',
        opts: ['Controller','Repository','Service','Database'],
        a: 2,
        explanation: 'The Service layer owns business logic. Controllers handle routing, Repositories handle database access. Mixing them violates SRP.',
      },
      {
        q: 'What is the correct order of layers in a Spring Boot request?',
        opts: ['Database → Service → Controller → Client','Client → Controller → Service → Repository → Database','Client → Service → Controller → Database','Controller → Client → Repository → Service'],
        a: 1,
        explanation: 'Request flows: Client → Controller (routing) → Service (logic) → Repository (data access) → Database.',
      },
    ],
    quiz3: [
      {
        q: 'Which framework is better suited for a machine learning model serving API?',
        opts: ['Spring Boot','Flask','Neither — use a database directly','Both are equally suited'],
        a: 1,
        explanation: 'Flask is lightweight and Python-native, making it the natural choice for serving ML models built with Python libraries like PyTorch or scikit-learn.',
      },
      {
        q: 'In Spring Boot, where should database queries live?',
        opts: ['In the Controller method','In the Service class','In the Repository interface','Inline in the HTML template'],
        a: 2,
        explanation: 'The Repository layer (via Spring Data JPA) handles all database access. Controllers and Services should never write raw SQL or call the database directly.',
      },
      {
        q: 'What does @RestController do in Spring Boot?',
        opts: ['Marks the class as a database entity','Combines @Controller and @ResponseBody — returns JSON automatically','Creates a new database table','Injects a dependency'],
        a: 1,
        explanation: '@RestController tells Spring that every method in this class returns data (JSON) directly, not an HTML template view.',
      },
    ],
    quiz5: [
      {
        q: 'What is the main advantage of serverless functions over traditional servers?',
        opts: ['They are always faster','They scale to zero and you only pay for actual usage','They never have cold starts','They require no code'],
        a: 1,
        explanation: 'Serverless functions scale to zero when not in use, meaning you pay nothing for idle time. Traditional servers run 24/7 regardless of traffic.',
      },
      {
        q: 'In JWT authentication, where is the user identity stored?',
        opts: ['In a server-side session database','In the token itself, signed by the server','In a cookie set by the browser','In the request URL'],
        a: 1,
        explanation: 'JWT encodes the user identity (payload) directly in the token. The server signs it so the client cannot tamper with it. No server-side session storage needed.',
      },
      {
        q: 'What is Redis primarily used for in a backend stack?',
        opts: ['Storing permanent user records','Caching frequent queries in memory for fast retrieval','Running serverless functions','Managing JWT secrets'],
        a: 1,
        explanation: 'Redis is an in-memory data store. It caches expensive database query results so subsequent requests get the same data in microseconds instead of milliseconds.',
      },
    ],
  },

  // ── Vocabulary fill-in-the-blank ──────────────────────────
  VOCAB: {
    vocab2: [
      { clue: 'HTTP method used to CREATE a new resource', hint: '4 letters', answer: 'POST' },
      { clue: 'HTTP method used to READ / retrieve data',  hint: '3 letters', answer: 'GET'  },
      { clue: 'HTTP method used to UPDATE an existing resource', hint: '3 letters', answer: 'PUT'  },
      { clue: 'HTTP method used to REMOVE a resource',    hint: '6 letters', answer: 'DELETE' },
      { clue: 'Status code range meaning success',        hint: '3 chars e.g. 2XX', answer: '2XX'  },
      { clue: 'Status code range meaning client error',   hint: '3 chars e.g. 4XX', answer: '4XX'  },
    ],
  },

  // ── FRQ prompts ───────────────────────────────────────────
  FRQS: [
    {
      id: 'frq1',
      question: 'Explain the difference between authentication and authorization. Give a real-world example of each in a web application.',
      rubric: ['authentication','authorization','example','difference'],
    },
    {
      id: 'frq2',
      question: 'Describe when you would choose Flask over Spring Boot for a backend project. What factors influence that decision?',
      rubric: ['flask','spring','microservice','scale','python','java'],
    },
  ],

  // ── API mock responses ────────────────────────────────────
  // Each key is "METHOD:/path" — add new endpoints here
  API_ENDPOINTS: [
    { value: 'GET:/api/users',          label: 'GET /api/users' },
    { value: 'GET:/api/users/1',        label: 'GET /api/users/1' },
    { value: 'POST:/api/users',         label: 'POST /api/users' },
    { value: 'PUT:/api/users/1',        label: 'PUT /api/users/1' },
    { value: 'DELETE:/api/users/1',     label: 'DELETE /api/users/1' },
    { value: 'GET:/api/invalid',        label: 'GET /api/invalid (404)' },
    { value: 'POST:/api/users/bad',     label: 'POST /api/users (invalid → 400)' },
  ],

  API_RESPONSES: {
    'GET:/api/users': {
      status: 200, time: 42, hint: '200 OK — returned a list of all users. This is a successful read.',
      body: JSON.stringify([
        { id: 1, name: 'Alice Johnson', email: 'alice@example.com', role: 'admin' },
        { id: 2, name: 'Bob Smith',     email: 'bob@example.com',   role: 'user'  },
        { id: 3, name: 'Carol White',   email: 'carol@example.com', role: 'user'  },
      ], null, 2),
    },
    'GET:/api/users/1': {
      status: 200, time: 18, hint: '200 OK — returned a single user object by ID.',
      body: JSON.stringify({ id: 1, name: 'Alice Johnson', email: 'alice@example.com', role: 'admin', createdAt: '2024-01-15' }, null, 2),
    },
    'POST:/api/users': {
      status: 201, time: 67, hint: '201 Created — the server created a new resource and returned it.',
      body: JSON.stringify({ id: 4, name: 'Dave Lee', email: 'dave@example.com', role: 'user', createdAt: new Date().toISOString().split('T')[0] }, null, 2),
    },
    'PUT:/api/users/1': {
      status: 200, time: 55, hint: '200 OK — the resource was updated. Server returns the updated object.',
      body: JSON.stringify({ id: 1, name: 'Alice Johnson-Updated', email: 'alice.new@example.com', role: 'admin' }, null, 2),
    },
    'DELETE:/api/users/1': {
      status: 204, time: 31, hint: '204 No Content — deletion was successful. No body is returned.',
      body: '',
    },
    'GET:/api/invalid': {
      status: 404, time: 12, hint: '404 Not Found — the endpoint does not exist. Check your URL.',
      body: JSON.stringify({ error: 'Not Found', message: 'The requested resource /api/invalid does not exist.', status: 404 }, null, 2),
    },
    'POST:/api/users/bad': {
      status: 400, time: 9, hint: '400 Bad Request — the request body was missing required fields. Always validate input.',
      body: JSON.stringify({ error: 'Bad Request', message: 'Validation failed', details: ['name is required', 'email must be a valid email address'] }, null, 2),
    },
  },
};

// ============================================================
//  STATE
// ============================================================
let currentStep = 0;
let STEPS       = [];
const quizPicks = {};   // { quizId: { qIndex: optIndex } }

// ============================================================
//  NAVIGATION — inline so it works without any imports
// ============================================================
function showStep(n) {
  currentStep = Math.max(0, Math.min(STEPS.length - 1, n));
  window.__currentStep = currentStep;

  // Toggle sections
  STEPS.forEach((id, i) =>
    document.getElementById(id).classList.toggle('active', i === currentStep)
  );

  // Rebuild progress dots
  const container = document.getElementById('progressSteps');
  if (container) {
    container.innerHTML = STEPS.map((_, i) => {
      const cls = i < currentStep ? 'done' : i === currentStep ? 'active' : '';
      return `
        <div class="progress-step ${cls}" data-idx="${i}">
          <div class="step-dot">${i < currentStep ? '✓' : i + 1}</div>
          <div class="step-label">${CONFIG.STEP_LABELS[i] || 'Step ' + (i + 1)}</div>
        </div>`;
    }).join('');
    container.querySelectorAll('.progress-step').forEach(el =>
      el.addEventListener('click', () => showStep(parseInt(el.dataset.idx)))
    );
  }

  // Step counter
  const ind = document.getElementById('stepIndicator');
  if (ind) ind.textContent = `Step ${currentStep + 1} / ${STEPS.length}`;

  // Buttons
  document.getElementById('prevBtn').disabled = currentStep === 0;
  document.getElementById('nextBtn').disabled = currentStep === STEPS.length - 1;

  persist();
}

// ============================================================
//  PERSISTENCE — inline
// ============================================================
const STORAGE_KEY = CONFIG.STORAGE_KEY;

function persist() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify({ step: currentStep })); } catch(e) {}
}

function restore() {
  try {
    const d = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (d?.step) showStep(d.step);
  } catch(e) {}
}

// ============================================================
//  QUIZ
// ============================================================
function renderQuiz(quizId) {
  const questions = CONFIG.QUIZZES[quizId];
  if (!questions) return;
  const box = document.getElementById(quizId);
  if (!box) return;
  box.innerHTML = '';
  questions.forEach((item, qi) => {
    const wrap = document.createElement('div');
    wrap.className = 'question-block';
    const qText = document.createElement('div');
    qText.className = 'question-text';
    qText.textContent = `Q${qi + 1}. ${item.q}`;
    wrap.appendChild(qText);
    item.opts.forEach((opt, oi) => {
      const el = document.createElement('div');
      el.className = 'opt';
      el.dataset.qi = qi; el.dataset.oi = oi;
      el.innerHTML = `<span class="radio-dot"></span><span class="opt-label">${opt}</span>`;
      el.addEventListener('click', () => {
        if (!quizPicks[quizId]) quizPicks[quizId] = {};
        quizPicks[quizId][qi] = oi;
        box.querySelectorAll(`.opt[data-qi="${qi}"]`).forEach(x => x.classList.remove('sel'));
        el.classList.add('sel');
      });
      wrap.appendChild(el);
    });
    // Explanation (hidden until graded)
    const exp = document.createElement('div');
    exp.className = 'explanation'; exp.id = `${quizId}-exp-${qi}`;
    exp.textContent = item.explanation;
    wrap.appendChild(exp);
    box.appendChild(wrap);
  });
}

function gradeQuiz(quizId) {
  const questions = CONFIG.QUIZZES[quizId];
  if (!questions) return;
  const box = document.getElementById(quizId);
  let correct = 0;
  questions.forEach((item, qi) => {
    const chosen = quizPicks[quizId]?.[qi];
    box.querySelectorAll(`.opt[data-qi="${qi}"]`).forEach(el => el.classList.remove('good','bad'));
    const expEl = document.getElementById(`${quizId}-exp-${qi}`);
    if (chosen === undefined) return;
    const ok = chosen === item.a;
    if (ok) correct++;
    const chosenEl  = box.querySelector(`.opt[data-qi="${qi}"][data-oi="${chosen}"]`);
    const correctEl = box.querySelector(`.opt[data-qi="${qi}"][data-oi="${item.a}"]`);
    if (chosenEl)  chosenEl.classList.add(ok ? 'good' : 'bad');
    if (!ok && correctEl) correctEl.classList.add('good');
    if (expEl) expEl.classList.add('show');
  });
  const scoreEl = document.getElementById(`${quizId}-score`);
  if (scoreEl) {
    scoreEl.style.display = '';
    scoreEl.textContent = `${correct} / ${questions.length}`;
    scoreEl.className = 'score-badge' + (correct === questions.length ? ' perfect' : '');
  }
}

function resetQuiz(quizId) {
  quizPicks[quizId] = {};
  const scoreEl = document.getElementById(`${quizId}-score`);
  if (scoreEl) scoreEl.style.display = 'none';
  renderQuiz(quizId);
}

// ============================================================
//  VOCABULARY FILL-IN
// ============================================================
function renderVocab(vocabId) {
  const items = CONFIG.VOCAB[vocabId];
  if (!items) return;
  const box = document.getElementById(vocabId);
  if (!box) return;
  box.innerHTML = items.map((item, i) => `
    <div class="vocab-item">
      <div class="vocab-clue">
        ${item.clue}<br>
        <span class="hint">Hint: ${item.hint}</span>
      </div>
      <input class="vocab-input" id="${vocabId}-inp-${i}" placeholder="?" maxlength="10"/>
    </div>`).join('');
}

function gradeVocab(vocabId) {
  const items = CONFIG.VOCAB[vocabId];
  if (!items) return;
  let correct = 0;
  items.forEach((item, i) => {
    const inp = document.getElementById(`${vocabId}-inp-${i}`);
    if (!inp) return;
    const val = inp.value.trim().toUpperCase();
    const ok  = val === item.answer.toUpperCase();
    if (ok) correct++;
    inp.classList.toggle('correct', ok);
    inp.classList.toggle('wrong', !ok && val !== '');
  });
  const scoreEl = document.getElementById(`${vocabId}-score`);
  if (scoreEl) {
    scoreEl.style.display = '';
    scoreEl.textContent = `${correct} / ${items.length}`;
    scoreEl.className = 'score-badge' + (correct === items.length ? ' perfect' : '');
  }
}

function resetVocab(vocabId) {
  const scoreEl = document.getElementById(`${vocabId}-score`);
  if (scoreEl) scoreEl.style.display = 'none';
  renderVocab(vocabId);
}

// ============================================================
//  FRQ
// ============================================================
function renderFrqs() {
  const container = document.getElementById('frqContainer');
  if (!container) return;
  container.innerHTML = CONFIG.FRQS.map(frq => `
    <div class="frq-box" id="${frq.id}">
      <div class="frq-question">${frq.question}</div>
      <textarea class="frq-textarea" id="${frq.id}-ta" placeholder="Write your answer here…"></textarea>
      <div class="btn-row">
        <button id="${frq.id}-grade-btn">Grade</button>
        <button id="${frq.id}-reset-btn" class="secondary">Reset</button>
      </div>
      <div class="frq-feedback" id="${frq.id}-feedback"></div>
    </div>`).join('');

  CONFIG.FRQS.forEach(frq => {
    document.getElementById(`${frq.id}-grade-btn`).addEventListener('click', () => gradeFrq(frq));
    document.getElementById(`${frq.id}-reset-btn`).addEventListener('click', () => resetFrq(frq));
  });
}

function gradeFrq(frq) {
  const answer   = (document.getElementById(`${frq.id}-ta`)?.value || '').toLowerCase();
  const feedback = document.getElementById(`${frq.id}-feedback`);
  if (!answer.trim()) { feedback.textContent = 'Please write an answer first.'; feedback.classList.add('show'); return; }

  const hits    = frq.rubric.filter(k => answer.includes(k));
  const score   = Math.round((hits.length / frq.rubric.length) * 100);
  const tags    = frq.rubric.map(k =>
    `<span class="score-badge ${hits.includes(k) ? 'perfect' : ''}" style="font-size:11px;padding:2px 8px;">${k}</span>`
  ).join(' ');

  feedback.innerHTML = `
    <strong>Score: ${score}%</strong> — ${hits.length} of ${frq.rubric.length} key concepts mentioned.<br>
    <div style="margin-top:8px;display:flex;flex-wrap:wrap;gap:6px;">${tags}</div>`;
  feedback.classList.add('show');
}

function resetFrq(frq) {
  const ta = document.getElementById(`${frq.id}-ta`);
  const fb = document.getElementById(`${frq.id}-feedback`);
  if (ta) ta.value = '';
  if (fb) { fb.innerHTML = ''; fb.classList.remove('show'); }
}

// ============================================================
//  API TESTER
// ============================================================
function initApiTester() {
  // Populate the endpoint select from CONFIG
  const sel = document.getElementById('endpointSelect');
  if (!sel) return;
  sel.innerHTML = CONFIG.API_ENDPOINTS.map(ep =>
    `<option value="${ep.value}">${ep.label}</option>`
  ).join('');

  sel.addEventListener('change', updateRequestPreview);
  document.getElementById('sendRequestBtn').addEventListener('click', sendApiRequest);
  updateRequestPreview();
}

function updateRequestPreview() {
  const val    = document.getElementById('endpointSelect')?.value || '';
  const [method, path] = val.split(':');
  const preEl  = document.getElementById('reqPreview');
  if (!preEl) return;
  const bodies = { POST: '{\n  "name": "Dave Lee",\n  "email": "dave@example.com"\n}', PUT: '{\n  "name": "Alice Johnson-Updated",\n  "email": "alice.new@example.com"\n}' };
  const body   = bodies[method] ? `\nContent-Type: application/json\n\n${bodies[method]}` : '';
  preEl.textContent = `${method} ${path} HTTP/1.1\nHost: localhost:8080\nAccept: application/json${body}`;
}

function sendApiRequest() {
  const key  = document.getElementById('endpointSelect')?.value;
  const mock = CONFIG.API_RESPONSES[key];
  if (!mock) return;

  const bodyEl  = document.getElementById('responseBody');
  const metaEl  = document.getElementById('responseMeta');
  const badgeEl = document.getElementById('statusBadgeWrap');
  const hintEl  = document.getElementById('apiHint');
  const timeEl  = document.getElementById('respTime');
  const sizeEl  = document.getElementById('respSize');

  const cls = mock.status >= 500 ? 'status-5xx' : mock.status >= 400 ? 'status-4xx' : 'status-2xx';
  badgeEl.innerHTML = `<span class="status-badge ${cls}">${mock.status}</span>`;
  bodyEl.textContent = mock.body || '(no body)';
  timeEl.textContent = `${mock.time}ms`;
  sizeEl.textContent = `${new Blob([mock.body]).size} bytes`;
  metaEl.style.display = '';
  hintEl.textContent = mock.hint;
}

// ============================================================
//  BOOT
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
  // Detect all .section elements for navigation
  STEPS = [...document.querySelectorAll('.section')].map(el => el.id);

  // Wire nav buttons
  document.getElementById('prevBtn').addEventListener('click', () => showStep(currentStep - 1));
  document.getElementById('nextBtn').addEventListener('click', () => showStep(currentStep + 1));

  // Render all interactive components
  renderQuiz('quiz1');
  renderQuiz('quiz3');
  renderQuiz('quiz5');
  renderVocab('vocab2');
  renderFrqs();
  initApiTester();

  // Wire quiz/vocab buttons
  document.getElementById('gradeQuiz1Btn').addEventListener('click', () => gradeQuiz('quiz1'));
  document.getElementById('resetQuiz1Btn').addEventListener('click', () => resetQuiz('quiz1'));
  document.getElementById('gradeVocab2Btn').addEventListener('click', () => gradeVocab('vocab2'));
  document.getElementById('resetVocab2Btn').addEventListener('click', () => resetVocab('vocab2'));
  document.getElementById('gradeQuiz3Btn').addEventListener('click', () => gradeQuiz('quiz3'));
  document.getElementById('resetQuiz3Btn').addEventListener('click', () => resetQuiz('quiz3'));
  document.getElementById('gradeQuiz5Btn').addEventListener('click', () => gradeQuiz('quiz5'));
  document.getElementById('resetQuiz5Btn').addEventListener('click', () => resetQuiz('quiz5'));

  // Show initial step then restore saved position
  showStep(0);
  restore();
});
</script>

<!-- Back button handler -->
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