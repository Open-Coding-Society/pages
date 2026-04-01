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
  /*
   * Colors come from the system SASS (_sass/minima/lessonbase.scss).
   * lessonbase.scss compiles those $variables into :root custom properties
   * which are already on the page. We just alias them here for readability.
   * To change a color, edit lessonbase.scss — NOT this file.p
   */
  .page-content {
    --bg:          var(--bg-1);
    --panel:       var(--panel);
    --panel-2:     var(--bg-3);
    --panel-3:     var(--surface);
    --border:      rgba(255,255,255,0.08);
    --border-b:    rgba(255,255,255,0.14);
    --txt:         var(--text);
    --muted:       var(--text-muted);
    --ac:          var(--accent);
    --ac2:         var(--accent);
    --ok:          var(--green);
    --ok-bg:       var(--green-bg);
    --err:         var(--red);
    --err-bg:      var(--warn-bg);
    --warning:     var(--warn);
    --hover-bg:    rgba(76,175,239,0.1);
    --sel-bg:      rgba(76,175,239,0.2);
    --code-bg:     var(--bg-0);
  }

  * { box-sizing: border-box; margin: 0; padding: 0; }
  .container { max-width: 1000px; margin: 0 auto; padding: 28px 16px 64px; }

  /* ---- Header ---- */
  .lesson-header { margin-bottom: 32px; padding-bottom: 20px; border-bottom: 1px solid var(--border); }
  .lesson-header .badge { display: inline-flex; align-items: center; gap: 6px; background: var(--panel-2); border: 1px solid var(--border-b); border-radius: 20px; padding: 3px 12px; font-size: 11px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; color: var(--ac2); margin-bottom: 10px; }
  .lesson-header .badge::before { content: ''; width: 6px; height: 6px; border-radius: 50%; background: var(--ac); box-shadow: 0 0 8px var(--ac); display: inline-block; }
  .lesson-header h1 { font-size: 30px; font-weight: 800; letter-spacing: -0.02em; margin-bottom: 6px; color: var(--txt); }
  .lesson-header p  { color: var(--muted); font-size: 14px; }
  .back-btn { display: inline-flex; align-items: center; gap: 6px; margin-top: 12px; font-size: 12px; font-weight: 600; color: var(--muted); text-decoration: none; background: var(--panel-2); border: 1px solid var(--border); border-radius: 6px; padding: 5px 12px; transition: 0.2s; }
  .back-btn:hover { color: var(--txt); border-color: var(--border-b); }

  /* ---- Progress dots ---- */
  .progress-track { margin: 20px 0 28px; }
  .progress-steps { display: flex; }
  .progress-step { flex: 1; position: relative; cursor: pointer; display: flex; flex-direction: column; align-items: center; gap: 6px; }
  .progress-step .step-dot { width: 28px; height: 28px; border-radius: 50%; background: var(--panel-2); border: 2px solid var(--border-b); display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 700; color: var(--muted); transition: all 0.3s; z-index: 1; position: relative; }
  .progress-step.active .step-dot { background: var(--ac);  border-color: var(--ac);  color: #fff; box-shadow: 0 0 12px rgba(76,175,239,0.5); }
  .progress-step.done   .step-dot { background: var(--ok);  border-color: var(--ok);  color: #fff; }
  .progress-step .step-label { font-size: 10px; color: var(--muted); font-weight: 600; text-align: center; white-space: nowrap; }
  .progress-step.active .step-label { color: var(--ac2); }
  .progress-step.done   .step-label { color: var(--ok); }
  .progress-step::before { content: ''; position: absolute; top: 14px; left: calc(-50% + 14px); right: calc(50% + 14px); height: 2px; background: var(--border-b); }
  .progress-step:first-child::before { display: none; }
  .progress-step.done::before { background: var(--ok); }

  /* ---- Sections ---- */
  .section        { display: none; }
  .section.active { display: block; animation: slideIn 0.3s ease; }
  @keyframes slideIn { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }

  /* ---- Cards ---- */
  .card { background: var(--panel); border: 1px solid var(--border); border-radius: 14px; padding: 24px; margin-bottom: 16px; position: relative; overflow: hidden; }
  .card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px; background: linear-gradient(90deg, var(--ac), var(--ac2)); opacity: 0.6; }
  .card h2 { font-size: 20px; font-weight: 800; color: var(--txt); margin-bottom: 8px; display: flex; align-items: center; gap: 10px; }
  .card h2 .step-num { width: 28px; height: 28px; border-radius: 8px; background: var(--ac); color: #fff; font-size: 12px; font-weight: 800; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
  .card h3 { font-size: 15px; color: var(--ac2); margin: 20px 0 8px; }

  .block-desc { background: rgba(76,175,239,0.06); border-left: 3px solid var(--ac); padding: 12px 16px; border-radius: 0 8px 8px 0; color: var(--txt); font-size: 14px; margin: 0 0 20px; line-height: 1.7; }

  /* ---- Concept tiles ---- */
  .concept-grid { display: grid; grid-template-columns: repeat(auto-fit,minmax(200px,1fr)); gap: 12px; margin-bottom: 20px; }
  .concept-tile { background: var(--panel-2); border: 1px solid var(--border); border-radius: 10px; padding: 14px 16px; transition: border-color 0.2s, transform 0.2s; }
  .concept-tile:hover { border-color: rgba(76,175,239,0.4); transform: translateY(-2px); }
  .concept-tile .tile-icon  { font-size: 22px; margin-bottom: 6px; }
  .concept-tile .tile-title { font-size: 13px; font-weight: 700; color: var(--ac2); margin-bottom: 4px; }
  .concept-tile .tile-body  { font-size: 12px; color: var(--muted); line-height: 1.55; }

  /* ---- Code blocks ---- */
  .code-block { background: var(--code-bg); border: 1px solid var(--border); border-radius: 10px; overflow: hidden; margin: 12px 0; }
  .code-header { background: var(--panel-2); border-bottom: 1px solid var(--border); padding: 7px 14px; display: flex; align-items: center; justify-content: space-between; }
  .code-header .dots { display: flex; gap: 5px; }
  .code-header .dots span { width: 10px; height: 10px; border-radius: 50%; }
  .code-header .dots .d-r { background: #ff5f57; } .code-header .dots .d-y { background: #ffbd2e; } .code-header .dots .d-g { background: #28c840; }
  .code-header .lang { font-size: 10px; color: var(--muted); font-family: monospace; font-weight: 700; letter-spacing: 0.05em; }
  .code-block pre { margin: 0; padding: 16px; font-family: 'Consolas','Fira Code',monospace; font-size: 12px; color: var(--txt); overflow-x: auto; line-height: 1.65; white-space: pre; }
  .kw { color: #ff7b72; } .fn { color: #d2a8ff; } .st { color: #a5d6ff; }
  .cm { color: var(--muted); font-style: italic; } .an { color: var(--ac); } .nb { color: var(--ac2); }

  /* ---- Quiz ---- */
  .quiz-wrap { margin: 16px 0; }
  .question-block { margin-bottom: 22px; }
  .question-text { font-size: 14px; font-weight: 700; color: var(--txt); margin-bottom: 10px; line-height: 1.6; padding: 10px 14px; background: var(--panel-2); border-radius: 8px; border-left: 3px solid var(--ac); }
  .opt { display: flex; align-items: flex-start; gap: 10px; padding: 10px 14px; margin: 6px 0; border: 1px solid var(--border); border-radius: 8px; cursor: pointer; background: var(--panel-2); color: var(--txt); font-size: 13px; transition: all 0.2s; user-select: none; line-height: 1.5; }
  .opt:hover { background: var(--hover-bg); border-color: var(--ac); }
  .opt.sel  { background: var(--sel-bg);  border-color: var(--ac); }
  .opt.good { background: var(--ok-bg);   border-color: var(--ok);  color: var(--ok); }
  .opt.bad  { background: var(--err-bg);  border-color: var(--err); color: var(--err); }
  .radio-dot { width: 14px; height: 14px; border-radius: 50%; border: 2px solid var(--muted); flex-shrink: 0; margin-top: 2px; transition: all 0.2s; }
  .opt.sel  .radio-dot { background: var(--ac);  border-color: var(--ac); }
  .opt.good .radio-dot { background: var(--ok);  border-color: var(--ok); }
  .opt.bad  .radio-dot { background: var(--err); border-color: var(--err); }
  .opt-label { flex: 1; }
  .explanation { display: none; margin: 6px 0 4px 24px; padding: 8px 12px; background: var(--panel-3); border-radius: 6px; font-size: 12px; color: var(--muted); border-left: 2px solid var(--ok); line-height: 1.6; }
  .explanation.show { display: block; }

  /* ---- Vocab fill-in ---- */
  .vocab-item { display: flex; align-items: center; gap: 12px; margin: 10px 0; flex-wrap: wrap; }
  .vocab-clue { font-size: 13px; color: var(--txt); flex: 1; min-width: 200px; line-height: 1.5; }
  .vocab-clue .hint { font-size: 11px; color: var(--muted); }
  .vocab-input { background: var(--code-bg); border: 1px solid var(--border); border-radius: 6px; color: var(--txt); font-family: monospace; font-size: 13px; padding: 7px 10px; text-transform: uppercase; transition: border-color 0.2s; width: 130px; }
  .vocab-input:focus  { outline: none; border-color: var(--ac); }
  .vocab-input.correct { border-color: var(--ok);  background: var(--ok-bg); }
  .vocab-input.wrong   { border-color: var(--err); background: var(--err-bg); }

  /* ---- API tester ---- */
  .api-tester { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
  @media (max-width: 720px) { .api-tester { grid-template-columns: 1fr; } }
  .field-label { font-size: 11px; font-weight: 700; letter-spacing: 0.07em; text-transform: uppercase; color: var(--muted); margin-bottom: 4px; display: block; }
  select { background: var(--panel-2); border: 1px solid var(--border); border-radius: 8px; color: var(--txt); padding: 8px 12px; font-size: 13px; cursor: pointer; width: 100%; }
  select:focus { outline: none; box-shadow: 0 0 0 2px rgba(76,175,239,0.3); }
  .status-badge { display: inline-block; border-radius: 4px; padding: 2px 10px; font-family: monospace; font-size: 12px; font-weight: 800; }
  .status-2xx { background: var(--ok-bg);   color: var(--ok); }
  .status-4xx { background: var(--err-bg);  color: var(--err); }
  .status-5xx { background: var(--warn-bg); color: var(--warning); }
  .response-box { background: var(--code-bg); border: 1px solid var(--border); border-radius: 10px; overflow: hidden; }
  .response-box-header { background: var(--panel-2); border-bottom: 1px solid var(--border); padding: 7px 14px; display: flex; align-items: center; justify-content: space-between; font-size: 11px; color: var(--muted); font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; }
  .response-box-body { padding: 14px; font-family: 'Consolas',monospace; font-size: 12px; color: var(--ac2); min-height: 120px; white-space: pre-wrap; word-break: break-word; line-height: 1.6; }
  .response-meta { font-size: 11px; color: var(--muted); padding: 6px 14px; border-top: 1px solid var(--border); display: flex; gap: 14px; }

  /* ---- FRQ ---- */
  .frq-box { background: var(--panel-2); border: 1px solid var(--border); border-radius: 12px; padding: 20px; margin: 16px 0; }
  .frq-question { font-size: 14px; font-weight: 700; color: var(--txt); margin-bottom: 12px; line-height: 1.6; padding: 10px 14px; background: var(--panel-3); border-radius: 8px; border-left: 3px solid var(--ac2); }
  .frq-textarea { width: 100%; background: var(--code-bg); border: 1px solid var(--border); border-radius: 8px; color: var(--txt); font-size: 13px; padding: 12px; resize: vertical; min-height: 120px; line-height: 1.6; transition: border-color 0.2s; }
  .frq-textarea:focus { outline: none; border-color: var(--ac); }
  .frq-feedback { margin-top: 12px; padding: 12px 16px; background: var(--panel-3); border-radius: 8px; border-left: 3px solid var(--ok); font-size: 13px; color: var(--txt); line-height: 1.7; display: none; }
  .frq-feedback.show { display: block; }

  /* ---- Compare table ---- */
  .compare-table { width: 100%; border-collapse: collapse; font-size: 12px; margin: 12px 0; }
  .compare-table th { background: var(--panel-2); padding: 8px 12px; text-align: left; font-weight: 700; color: var(--ac2); border-bottom: 1px solid var(--border-b); font-size: 11px; letter-spacing: 0.05em; text-transform: uppercase; }
  .compare-table td { padding: 8px 12px; border-bottom: 1px solid var(--border); color: var(--txt); vertical-align: top; line-height: 1.5; }
  .compare-table tr:last-child td { border-bottom: none; }
  .compare-table tr:hover td { background: var(--hover-bg); }
  .compare-table code { background: var(--code-bg); padding: 1px 5px; border-radius: 3px; font-family: monospace; font-size: 11px; color: var(--ac2); }

  /* ---- Architecture diagram ---- */
  .arch-diagram { display: flex; align-items: center; margin: 16px 0; flex-wrap: wrap; justify-content: center; }
  .arch-box { background: var(--panel-2); border: 1px solid var(--border-b); border-radius: 8px; padding: 10px 16px; text-align: center; min-width: 110px; flex-shrink: 0; }
  .arch-box .arch-icon  { font-size: 20px; margin-bottom: 4px; }
  .arch-box .arch-label { font-size: 11px; font-weight: 700; color: var(--ac2); letter-spacing: 0.05em; text-transform: uppercase; }
  .arch-box .arch-sub   { font-size: 10px; color: var(--muted); margin-top: 2px; }
  .arch-arrow { color: var(--muted); font-size: 18px; padding: 0 6px; flex-shrink: 0; }

  /* ---- Buttons ---- */
  button { appearance: none; border: 1px solid var(--border); background: var(--ac); color: #fff; padding: 8px 18px; border-radius: 8px; cursor: pointer; font-size: 13px; font-weight: 600; transition: all 0.2s; }
  button:hover { background: var(--accent-700); transform: translateY(-1px); box-shadow: 0 4px 14px rgba(76,175,239,0.3); }
  button:active { transform: translateY(0); }
  button:disabled { opacity: 0.4; cursor: not-allowed; transform: none; box-shadow: none; }
  button.secondary { background: var(--panel-2); color: var(--txt); }
  button.secondary:hover { background: var(--panel-3); box-shadow: none; }
  .btn-row { display: flex; gap: 8px; flex-wrap: wrap; margin-top: 14px; align-items: center; }
  .score-badge { font-size: 13px; font-weight: 700; padding: 4px 12px; border-radius: 6px; background: var(--panel-2); color: var(--txt); }
  .score-badge.perfect { background: var(--ok-bg); color: var(--ok); }

  /* ---- Tip ---- */
  .tip { font-size: 12px; color: var(--muted); padding: 8px 14px; background: var(--panel-2); border-radius: 6px; border-left: 2px solid var(--ac); line-height: 1.5; margin-top: 12px; }
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

  <div class="progress-track">
    <div class="progress-steps" id="progressSteps"></div>
  </div>

  <!-- STEP 1 -->
  <div class="section active" id="step1">
    <div class="card">
      <h2><span class="step-num">1</span> Backend Fundamentals</h2>
      <div class="block-desc">The backend is everything users <em>don't</em> see — authentication, business logic, data processing, and API endpoints. Before saving anything, a well-built backend always <strong>validates first</strong>.</div>
      <div class="arch-diagram">
        <div class="arch-box"><div class="arch-icon">🌐</div><div class="arch-label">Client</div><div class="arch-sub">Browser / App</div></div>
        <div class="arch-arrow">→</div>
        <div class="arch-box" style="border-color:rgba(76,175,239,0.5);"><div class="arch-icon">🛡️</div><div class="arch-label">Auth</div><div class="arch-sub">Validate &amp; Guard</div></div>
        <div class="arch-arrow">→</div>
        <div class="arch-box"><div class="arch-icon">⚙️</div><div class="arch-label">Controller</div><div class="arch-sub">Route Handler</div></div>
        <div class="arch-arrow">→</div>
        <div class="arch-box"><div class="arch-icon">🧠</div><div class="arch-label">Service</div><div class="arch-sub">Business Logic</div></div>
        <div class="arch-arrow">→</div>
        <div class="arch-box"><div class="arch-icon">🗃️</div><div class="arch-label">Database</div><div class="arch-sub">Persist Data</div></div>
      </div>
      <div class="concept-grid">
        <div class="concept-tile"><div class="tile-icon">🔒</div><div class="tile-title">Authentication</div><div class="tile-body">Verify who the user is. Happens before any data is accessed.</div></div>
        <div class="concept-tile"><div class="tile-icon">✅</div><div class="tile-title">Validation</div><div class="tile-body">Check that incoming data has the right format before processing.</div></div>
        <div class="concept-tile"><div class="tile-icon">🧠</div><div class="tile-title">Business Logic</div><div class="tile-body">Rules specific to your app — pricing, permissions, workflows.</div></div>
        <div class="concept-tile"><div class="tile-icon">📡</div><div class="tile-title">API Endpoints</div><div class="tile-body">URLs the frontend calls. Each maps to a controller method.</div></div>
      </div>
      <div id="quiz1" class="quiz-wrap"></div>
      <div class="btn-row">
        <button id="gradeQuiz1Btn">Grade</button>
        <button id="resetQuiz1Btn" class="secondary">Reset</button>
        <span id="quiz1-score" class="score-badge" style="display:none;"></span>
      </div>
      <div class="tip">Validation and authentication always happen before database writes.</div>
    </div>
  </div>

  <!-- STEP 2 -->
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
    <span class="an">@PostMapping</span>          <span class="cm">// POST /api/users     → Create</span>
    <span class="kw">public</span> User <span class="fn">create</span>(<span class="an">@RequestBody</span> UserDTO dto) { ... }
    <span class="an">@PutMapping</span>(<span class="st">"/{id}"</span>)   <span class="cm">// PUT  /api/users/1   → Update</span>
    <span class="kw">public</span> User <span class="fn">update</span>(<span class="an">@PathVariable</span> Long id, <span class="an">@RequestBody</span> UserDTO dto) { ... }
    <span class="an">@DeleteMapping</span>(<span class="st">"/{id}"</span>) <span class="cm">// DELETE /api/users/1 → Delete</span>
    <span class="kw">public void</span> <span class="fn">delete</span>(<span class="an">@PathVariable</span> Long id) { ... }
}</pre>
      </div>
      <h3>Vocabulary Check</h3>
      <div id="vocab2" class="quiz-wrap"></div>
      <div class="btn-row">
        <button id="gradeVocab2Btn">Check Answers</button>
        <button id="resetVocab2Btn" class="secondary">Reset</button>
        <span id="vocab2-score" class="score-badge" style="display:none;"></span>
      </div>
      <div class="tip">In REST: Create (POST), Read (GET), Update (PUT/PATCH), Delete (DELETE).</div>
    </div>
  </div>

  <!-- STEP 3 -->
  <div class="section" id="step3">
    <div class="card">
      <h2><span class="step-num">3</span> Backend Frameworks</h2>
      <div class="block-desc"><strong>Flask</strong> (Python) is minimal and flexible. <strong>Spring Boot</strong> (Java) is opinionated and full-featured.</div>
      <table class="compare-table">
        <thead><tr><th>Feature</th><th>Flask (Python)</th><th>Spring Boot (Java)</th></tr></thead>
        <tbody>
          <tr><td>Philosophy</td><td>Micro — bring what you need</td><td>Opinionated — batteries included</td></tr>
          <tr><td>Routing</td><td><code>@app.route('/path')</code></td><td><code>@GetMapping('/path')</code></td></tr>
          <tr><td>DB layer</td><td>SQLAlchemy / raw SQL</td><td>Spring Data JPA / Hibernate</td></tr>
          <tr><td>Best for</td><td>Quick APIs, ML serving, scripts</td><td>Large enterprise backends</td></tr>
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
    <span class="kw">return</span> <span class="fn">jsonify</span>({<span class="st">'message'</span>: <span class="st">'Hello!'</span>})</pre>
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
        <span class="kw">return</span> Map.<span class="fn">of</span>(<span class="st">"message"</span>, <span class="st">"Hello!"</span>);
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
      <div class="tip">Spring Boot: Controller (routes) → Service (logic) → Repository (database). Never put database calls in a Controller.</div>
    </div>
  </div>

  <!-- STEP 4 -->
  <div class="section" id="step4">
    <div class="card">
      <h2><span class="step-num">4</span> API Project &amp; Testing</h2>
      <div class="block-desc">Testing your API before the frontend is built is essential. Select an endpoint and click Send to see a real response shape.</div>
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
            <div class="response-box-header"><span>Body</span><span id="statusBadgeWrap"></span></div>
            <div class="response-box-body" id="responseBody">Select an endpoint and click Send.</div>
            <div class="response-meta" id="responseMeta" style="display:none;"><span id="respTime"></span><span id="respSize"></span></div>
          </div>
          <span class="field-label">What to look for</span>
          <div id="apiHint" style="background:var(--panel-3);border:1px solid var(--border);border-radius:8px;padding:12px;font-size:12px;color:var(--muted);line-height:1.6;">Pick an endpoint and send a request.</div>
        </div>
      </div>
      <div class="tip">HTTP status codes: 2xx = success, 4xx = client error, 5xx = server error.</div>
    </div>
  </div>

  <!-- STEP 5 -->
  <div class="section" id="step5">
    <div class="card">
      <h2><span class="step-num">5</span> Advanced Backend Concepts</h2>
      <div class="block-desc">Patterns that separate junior from senior backend engineers — security, scalability, observability, and AI integration.</div>
      <div class="concept-grid">
        <div class="concept-tile"><div class="tile-icon">☁️</div><div class="tile-title">Serverless</div><div class="tile-body">Deploy individual functions without managing a server. Scale to zero when idle.</div></div>
        <div class="concept-tile"><div class="tile-icon">🔑</div><div class="tile-title">JWT Auth</div><div class="tile-body">JSON Web Tokens encode user identity. The backend signs them; every request carries the token.</div></div>
        <div class="concept-tile"><div class="tile-icon">📊</div><div class="tile-title">Observability</div><div class="tile-body">Logging, metrics, and tracing. You can't fix what you can't see.</div></div>
        <div class="concept-tile"><div class="tile-icon">🤖</div><div class="tile-title">AI Integration</div><div class="tile-body">Backend calls to LLM APIs for summarization, classification, generation.</div></div>
        <div class="concept-tile"><div class="tile-icon">⚡</div><div class="tile-title">Caching</div><div class="tile-body">Redis stores frequent queries in memory. Can cut response times 100x.</div></div>
        <div class="concept-tile"><div class="tile-icon">🏗️</div><div class="tile-title">IaC</div><div class="tile-body">Infrastructure as Code — define servers in version-controlled config files.</div></div>
      </div>
      <div class="code-block">
        <div class="code-header"><div class="dots"><span class="d-r"></span><span class="d-y"></span><span class="d-g"></span></div><span class="lang">python — JWT token flow</span></div>
        <pre><span class="kw">import</span> jwt, datetime
SECRET = <span class="st">"your-secret-key"</span>

<span class="kw">def</span> <span class="fn">create_token</span>(user_id):
    payload = {<span class="st">"sub"</span>: user_id, <span class="st">"exp"</span>: datetime.<span class="fn">utcnow</span>() + datetime.timedelta(hours=<span class="nb">24</span>)}
    <span class="kw">return</span> jwt.<span class="fn">encode</span>(payload, SECRET, algorithm=<span class="st">"HS256"</span>)

<span class="kw">def</span> <span class="fn">verify_token</span>(token):
    <span class="kw">try</span>:
        <span class="kw">return</span> jwt.<span class="fn">decode</span>(token, SECRET, algorithms=[<span class="st">"HS256"</span>])
    <span class="kw">except</span> jwt.ExpiredSignatureError:
        <span class="kw">raise</span> <span class="fn">Exception</span>(<span class="st">"Token expired"</span>)</pre>
      </div>
      <div id="quiz5" class="quiz-wrap"></div>
      <div class="btn-row">
        <button id="gradeQuiz5Btn">Grade</button>
        <button id="resetQuiz5Btn" class="secondary">Reset</button>
        <span id="quiz5-score" class="score-badge" style="display:none;"></span>
      </div>
    </div>
  </div>

  <!-- STEP 6 -->
  <div class="section" id="step6">
    <div class="card">
      <h2><span class="step-num">6</span> Free Response &amp; Reflection</h2>
      <div class="block-desc">Apply everything you've learned. Answer each question thoughtfully.</div>
      <div id="frqContainer"></div>
      <div style="margin-top:24px;background:var(--panel-2);border:1px solid var(--border);border-radius:10px;padding:16px;">
        <div style="font-size:14px;font-weight:700;color:var(--ac2);margin-bottom:10px;">✅ What You Covered</div>
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:8px;">
          <div style="background:var(--panel-3);border-radius:8px;padding:10px 12px;font-size:12px;color:var(--muted);"><span style="color:var(--ok);font-weight:700;">Step 1</span> — Backend flow: validate → authenticate → process → persist</div>
          <div style="background:var(--panel-3);border-radius:8px;padding:10px 12px;font-size:12px;color:var(--muted);"><span style="color:var(--ok);font-weight:700;">Step 2</span> — SQL vs NoSQL, REST CRUD, HTTP methods &amp; status codes</div>
          <div style="background:var(--panel-3);border-radius:8px;padding:10px 12px;font-size:12px;color:var(--muted);"><span style="color:var(--ok);font-weight:700;">Step 3</span> — Flask vs Spring Boot architecture and layering</div>
          <div style="background:var(--panel-3);border-radius:8px;padding:10px 12px;font-size:12px;color:var(--muted);"><span style="color:var(--ok);font-weight:700;">Step 4</span> — API testing: status codes, request/response shape</div>
          <div style="background:var(--panel-3);border-radius:8px;padding:10px 12px;font-size:12px;color:var(--muted);"><span style="color:var(--ok);font-weight:700;">Step 5</span> — Serverless, JWT, caching, observability, AI integration</div>
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
import { CONFIG }      from '/assets/js/bigsix/backend/data.js';
import { Navigator }   from '/assets/js/bigsix/shared/navigation.js';
import { Persistence } from '/assets/js/bigsix/shared/persistence.js';
import { Quiz }        from '/assets/js/bigsix/backend/quiz.js';
import { Vocab }       from '/assets/js/bigsix/backend/vocab.js';
import { Frq }         from '/assets/js/bigsix/backend/frq.js';
import { ApiTester }   from '/assets/js/bigsix/backend/api-tester.js';

document.addEventListener('DOMContentLoaded', () => {
  const nav   = new Navigator({ progressStyle: 'dots', labels: CONFIG.STEP_LABELS });
  const store = new Persistence();
  nav.init(() => store.persist());
  store.restore((n, s) => nav.showStep(n, s));
  new Quiz(CONFIG.QUIZZES).init();
  new Vocab(CONFIG.VOCAB).init();
  new Frq(CONFIG.FRQS).init();
  new ApiTester(CONFIG).init();
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