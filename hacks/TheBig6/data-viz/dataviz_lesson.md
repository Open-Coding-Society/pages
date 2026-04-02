---
layout: cs-bigsix-lesson
title: "Data Visualization — All-in-One Interactive Lesson"
description: "Compact lesson combining REST APIs, Spring Boot, CRUD, search, filtering, pagination, and data queries"
permalink: /bigsix/dataviz_lesson
parent: "bigsix"
lesson_number: 3
team: "Applicators"
categories: [CSP, DataVisualization, Interactive]
tags: [spring-boot, rest, jpa, search, pagination, interactive]
author: "Applicators Team"
date: 2025-12-02
---

<style>
  /*
   * Colors from system SASS (_sass/minima/lessonbase.scss → :root).
   * Edit lessonbase.scss to change colors — not this file.
   */
  .page-content {
    --bg:       var(--bg-1);
    --panel:    var(--panel);
    --panel-2:  var(--bg-3);
    --panel-3:  var(--surface);
    --border:   rgba(255,255,255,0.08);
    --border-b: rgba(255,255,255,0.14);
    --border-ac:rgba(76,175,239,0.4);
    --txt:      var(--text);
    --muted:    var(--text-muted);
    --ac:       var(--accent);
    --ac2:      var(--accent);
    --ok:       var(--green);
    --ok-bg:    var(--green-bg);
    --err:      var(--red);
    --err-bg:   var(--warn-bg);
    --code-bg:  var(--bg-0);
    --hover-bg: rgba(76,175,239,0.1);
    --sel-bg:   rgba(76,175,239,0.2);
  }

  * { box-sizing: border-box; margin: 0; padding: 0; }
  .container { max-width: 1000px; margin: 0 auto; padding: 28px 16px 64px; }

  /* ── Header ── */
  .lesson-header { margin-bottom: 32px; padding-bottom: 20px; border-bottom: 1px solid var(--border); }
  .lesson-header .badge { display: inline-flex; align-items: center; gap: 6px; background: var(--panel-2); border: 1px solid var(--border-b); border-radius: 20px; padding: 3px 12px; font-size: 11px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; color: var(--ac2); margin-bottom: 10px; }
  .lesson-header .badge::before { content: ''; width: 6px; height: 6px; border-radius: 50%; background: var(--ac); box-shadow: 0 0 8px var(--ac); display: inline-block; }
  .lesson-header h1 { font-size: 30px; font-weight: 800; letter-spacing: -0.02em; margin-bottom: 6px; color: var(--txt); }
  .lesson-header p  { color: var(--muted); font-size: 14px; }
  .back-btn { display: inline-flex; align-items: center; gap: 6px; margin-top: 12px; font-size: 12px; font-weight: 600; color: var(--muted); text-decoration: none; background: var(--panel-2); border: 1px solid var(--border); border-radius: 6px; padding: 5px 12px; transition: 0.2s; }
  .back-btn:hover { color: var(--txt); border-color: var(--border-b); }

  /* ── Progress bar ── */
  .progress-track { margin: 20px 0 28px; }
  .progress-steps { display: flex; }
  .progress-step { flex: 1; position: relative; cursor: pointer; display: flex; flex-direction: column; align-items: center; gap: 6px; }
  .progress-step .step-dot { width: 28px; height: 28px; border-radius: 50%; background: var(--panel-2); border: 2px solid var(--border-b); display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 700; color: var(--muted); transition: all 0.3s; z-index: 1; position: relative; }
  .progress-step.active .step-dot { background: var(--ac); border-color: var(--ac); color: #fff; box-shadow: 0 0 12px rgba(76,175,239,0.5); }
  .progress-step.done   .step-dot { background: var(--ok); border-color: var(--ok); color: #fff; }
  .progress-step .step-label { font-size: 10px; color: var(--muted); font-weight: 600; text-align: center; white-space: nowrap; }
  .progress-step.active .step-label { color: var(--ac2); }
  .progress-step.done   .step-label { color: var(--ok); }
  .progress-step::before { content: ''; position: absolute; top: 14px; left: calc(-50% + 14px); right: calc(50% + 14px); height: 2px; background: var(--border-b); }
  .progress-step:first-child::before { display: none; }
  .progress-step.done::before { background: var(--ok); }

  /* ── Sections ── */
  .section        { display: none; }
  .section.active { display: block; animation: fadeIn 0.3s ease; }
  @keyframes fadeIn { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }

  /* ── Cards ── */
  .card { background: var(--panel); border: 1px solid var(--border); border-radius: 14px; padding: 24px; margin-bottom: 16px; position: relative; overflow: hidden; }
  .card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px; background: linear-gradient(90deg, var(--ac), var(--ac2)); opacity: 0.6; }
  .card h2 { font-size: 20px; font-weight: 800; color: var(--txt); margin-bottom: 12px; display: flex; align-items: center; gap: 10px; }
  .card h2 .step-num { width: 28px; height: 28px; border-radius: 8px; background: var(--ac); color: #fff; font-size: 12px; font-weight: 800; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
  .card h3 { font-size: 15px; color: var(--ac2); margin: 20px 0 8px; }
  .block-desc { background: rgba(76,175,239,0.06); border-left: 3px solid var(--ac); padding: 12px 16px; border-radius: 0 8px 8px 0; color: var(--txt); font-size: 14px; margin: 0 0 20px; line-height: 1.7; }

  /* ── Concept tiles ── */
  .concept-grid { display: grid; grid-template-columns: repeat(auto-fit,minmax(180px,1fr)); gap: 12px; margin-bottom: 20px; }
  .concept-tile { background: var(--panel-2); border: 1px solid var(--border); border-radius: 10px; padding: 14px 16px; transition: border-color 0.2s, transform 0.2s; }
  .concept-tile:hover { border-color: var(--border-ac); transform: translateY(-2px); }
  .concept-tile .tile-icon  { font-size: 22px; margin-bottom: 6px; }
  .concept-tile .tile-title { font-size: 13px; font-weight: 700; color: var(--ac2); margin-bottom: 4px; }
  .concept-tile .tile-body  { font-size: 12px; color: var(--muted); line-height: 1.55; }

  /* ── Code blocks ── */
  .code-block { background: var(--code-bg); border: 1px solid var(--border); border-radius: 10px; overflow: hidden; margin: 12px 0; }
  .code-header { background: var(--panel-2); border-bottom: 1px solid var(--border); padding: 7px 14px; display: flex; align-items: center; justify-content: space-between; }
  .code-header .dots { display: flex; gap: 5px; }
  .code-header .dots span { width: 10px; height: 10px; border-radius: 50%; }
  .code-header .dots .d-r { background: #ff5f57; } .code-header .dots .d-y { background: #ffbd2e; } .code-header .dots .d-g { background: #28c840; }
  .code-header .lang { font-size: 10px; color: var(--muted); font-family: monospace; font-weight: 700; letter-spacing: 0.05em; }
  .code-block pre { margin: 0; padding: 16px; font-family: 'Consolas','Fira Code',monospace; font-size: 12px; color: var(--txt); overflow-x: auto; line-height: 1.65; }
  .kw { color: #ff7b72; } .fn { color: #d2a8ff; } .st { color: #a5d6ff; } .cm { color: var(--muted); font-style: italic; } .an { color: var(--ac); }

  /* ── Split view ── */
  .split-view { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
  @media (max-width: 720px) { .split-view { grid-template-columns: 1fr; } }

  /* ── Response/output box ── */
  .response-box { background: var(--code-bg); border: 1px solid var(--border); border-radius: 10px; overflow: hidden; margin: 12px 0; }
  .response-header { background: var(--panel-2); border-bottom: 1px solid var(--border); padding: 7px 14px; display: flex; align-items: center; justify-content: space-between; font-size: 11px; color: var(--muted); font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; }
  .response-body { padding: 14px; font-family: 'Consolas',monospace; font-size: 12px; color: var(--ac2); min-height: 100px; white-space: pre-wrap; word-break: break-word; line-height: 1.6; }

  /* ── Tab nav ── */
  .tab-nav { display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 16px; }
  .tab-nav button { background: var(--panel-2); color: var(--muted); border: 1px solid var(--border); padding: 6px 14px; font-size: 12px; border-radius: 20px; font-weight: 600; }
  .tab-nav button.active { background: var(--ac); color: #fff; border-color: var(--ac); }
  .tab-nav button:hover:not(.active) { background: var(--hover-bg); color: var(--txt); transform: none; box-shadow: none; }

  /* ── Inputs ── */
  input, textarea, select { background: var(--code-bg); border: 1px solid var(--border); border-radius: 8px; color: var(--txt); font-size: 13px; padding: 9px 12px; width: 100%; font-family: inherit; }
  input:focus, textarea:focus, select:focus { outline: none; border-color: var(--ac); box-shadow: 0 0 0 2px rgba(76,175,239,0.15); }

  /* ── Buttons ── */
  button { appearance: none; border: 1px solid var(--border); background: var(--ac); color: #fff; padding: 8px 18px; border-radius: 8px; cursor: pointer; font-size: 13px; font-weight: 600; transition: all 0.2s; }
  button:hover { background: var(--accent-700); transform: translateY(-1px); box-shadow: 0 4px 14px rgba(76,175,239,0.3); }
  button:active { transform: translateY(0); }
  button:disabled { opacity: 0.4; cursor: not-allowed; transform: none; box-shadow: none; }
  button.secondary { background: var(--panel-2); color: var(--txt); }
  button.secondary:hover { background: var(--panel-3); box-shadow: none; }
  button.danger   { background: var(--err-bg); border: 1px solid var(--err); color: var(--err); }
  button.danger:hover { background: rgba(229,62,62,0.25); box-shadow: none; }
  .btn-row { display: flex; gap: 8px; flex-wrap: wrap; margin-top: 14px; align-items: center; }
  .score-badge { font-size: 13px; font-weight: 700; padding: 4px 12px; border-radius: 6px; background: var(--panel-2); color: var(--txt); }
  .score-badge.ok  { background: var(--ok-bg); color: var(--ok); }
  .score-badge.err { background: var(--err-bg); color: var(--err); }

  /* ── Field label ── */
  .field-label { font-size: 11px; font-weight: 700; letter-spacing: 0.07em; text-transform: uppercase; color: var(--muted); margin-bottom: 4px; display: block; }

  /* ── Tip ── */
  .tip { font-size: 12px; color: var(--muted); padding: 8px 14px; background: var(--panel-2); border-radius: 6px; border-left: 2px solid var(--ac); line-height: 1.5; margin-top: 14px; }
  .tip::before { content: '💡 '; }

  /* ── Nav ── */
  .nav-buttons { display: flex; gap: 12px; margin-top: 28px; justify-content: space-between; align-items: center; }
  #stepIndicator { font-size: 12px; color: var(--muted); }

  /* ── Checklist ── */
  .checklist-item { display: flex; align-items: center; gap: 10px; padding: 10px 14px; border: 1px solid var(--border); border-radius: 8px; margin: 6px 0; cursor: pointer; transition: background 0.2s; }
  .checklist-item:hover { background: var(--hover-bg); }
  .checklist-item.checked { background: var(--ok-bg); border-color: var(--ok); }
  .checklist-item input[type="checkbox"] { accent-color: var(--ac); width: 15px; height: 15px; }

  /* ── Export/notes ── */
  #notes { min-height: 80px; resize: vertical; }
  #exportOut { background: var(--code-bg); border: 1px solid var(--border); border-radius: 8px; padding: 12px; font-family: monospace; font-size: 12px; color: var(--ac2); white-space: pre-wrap; margin-top: 12px; min-height: 60px; }

  /* ── Legacy helpers preserved for JS-rendered elements ── */
  .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
  @media (max-width: 740px) { .grid { grid-template-columns: 1fr; } }
  label { display: block; font-size: 12px; color: var(--muted); text-transform: uppercase; letter-spacing: 0.04em; margin: 10px 0 4px; }
  textarea { resize: vertical; font-family: 'Courier New', monospace; }
  .preview-box { background: var(--code-bg); border: 1px solid var(--border); border-radius: 10px; padding: 14px; min-height: 80px; overflow: auto; white-space: pre-wrap; word-break: break-word; font-family: 'Courier New', monospace; font-size: 12px; color: var(--txt); line-height: 1.7; }
  .status-badge { display: inline-block; padding: 2px 10px; border-radius: 20px; font-size: 11px; font-weight: 700; letter-spacing: 0.04em; margin-left: 8px; }
  .status-2xx { background: var(--ok-bg);  color: var(--ok);  border: 1px solid var(--ok); }
  .status-4xx { background: var(--err-bg); color: var(--err); border: 1px solid var(--err); }
  .company-card { border: 1px solid var(--border); border-radius: 10px; padding: 12px 14px; margin: 6px 0; background: var(--panel-2); transition: border-color 0.2s; }
  .company-card:hover { border-color: rgba(76,175,239,0.4); }
  .company-card strong { color: var(--ac2); font-size: 14px; }
  .pill  { display: inline-block; background: rgba(76,175,239,0.15); border: 1px solid rgba(76,175,239,0.4); color: var(--ac2); border-radius: 12px; padding: 1px 8px; font-size: 11px; margin: 2px 2px 0 0; }
  .quiz-question-text { font-weight: 700; font-size: 14px; margin: 16px 0 8px; color: var(--txt); }
  .opt { display: flex; align-items: center; gap: 10px; padding: 10px 14px; margin: 5px 0; border: 1px solid var(--border); border-radius: 8px; cursor: pointer; background: var(--panel-2); color: var(--txt); font-size: 13px; transition: all 0.2s; user-select: none; }
  .opt:hover { background: var(--hover-bg); border-color: var(--ac); }
  .opt.sel  { background: var(--sel-bg);  border-color: var(--ac); }
  .opt.good { background: var(--ok-bg);   border-color: var(--ok);  color: var(--ok); }
  .opt.bad  { background: var(--err-bg);  border-color: var(--err); color: var(--err); }
  .radio-dot { width: 12px; height: 12px; border-radius: 50%; border: 2px solid var(--muted); flex-shrink: 0; transition: all 0.2s; }
  .opt.sel  .radio-dot { background: var(--ac);  border-color: var(--ac); }
  .opt.good .radio-dot { background: var(--ok);  border-color: var(--ok); }
  .opt.bad  .radio-dot { background: var(--err); border-color: var(--err); }
  .recap { display: grid; gap: 12px; grid-template-columns: repeat(auto-fit,minmax(230px,1fr)); }
  .recap-block { border: 1px solid var(--border); border-radius: 12px; background: var(--panel-2); padding: 14px; }
  .recap-title { font-weight: 800; color: var(--ac2); margin-bottom: 10px; font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em; }
  .recap-row   { display: grid; grid-template-columns: max-content 1fr; gap: 10px; margin-bottom: 6px; align-items: start; }
  .recap-key   { color: var(--muted); font-size: 12px; }
  .recap-val code { background: rgba(76,175,239,0.15); color: var(--ac2); border-radius: 5px; padding: 1px 6px; font-size: 11px; font-family: 'Courier New',monospace; }
  .hidden  { display: none; }
  .note    { font-size: 12px; color: var(--muted); }
  details summary { cursor: pointer; color: var(--ac2); font-size: 12px; margin-top: 8px; }
  details p { margin-top: 6px; font-size: 12px; color: var(--muted); }
  code { background: rgba(76,175,239,0.15); color: var(--ac2); border-radius: 4px; padding: 1px 5px; font-family: 'Courier New',monospace; font-size: 12px; }
  .filter-row { display: flex; align-items: center; gap: 10px; margin-top: 12px; }
  .filter-row input[type="checkbox"] { width: 15px; height: 15px; accent-color: var(--ac); flex-shrink: 0; }
  .filter-label { font-size: 13px; color: var(--txt); text-transform: none; letter-spacing: 0; margin: 0; }
</style>

<div class="container page-content">
  <div class="lesson-header">
    <div class="badge">Applicators · Lesson 3</div>
    <h1>Data Visualization</h1>
    <p>Interactive lessons: REST APIs, Spring Boot CRUD, search, filtering, pagination, and data queries.</p>
    <a href="../" class="button back-btn">← Back to Big Six</a>
  </div>

  <div class="progress-track">
    <div class="progress-steps" id="progressSteps"></div>
  </div>

  <!-- STEP 1 -->
  <div class="section active" id="step1">
    <div class="card">
      <h2>1 — REST APIs &amp; CRUD with Mock Database</h2>
      <p class="block-desc"><strong>What this shows:</strong> Experiment with a live mock REST API. Send POST, GET, PUT, DELETE requests to create, read, update, and remove company records.</p>
      <div class="tab-nav" id="methodTabs">
        <button class="active" data-ep="POST /api/companies">POST — Create</button>
        <button data-ep="GET /api/companies">GET — All</button>
        <button data-ep="GET /api/companies/{id}">GET — One</button>
        <button data-ep="PUT /api/companies/{id}">PUT — Update</button>
        <button data-ep="DELETE /api/companies/{id}">DELETE — Remove</button>
      </div>
      <div class="grid">
        <div>
          <label>Endpoint</label>
          <input id="ep" readonly style="color:var(--ac2);font-family:'Courier New',monospace;" value="POST /api/companies"/>
          <div id="pidWrap" class="hidden">
            <label>Path ID</label>
            <input id="pid" type="number" min="1" placeholder="e.g. 1"/>
          </div>
        </div>
        <div id="bodyWrap">
          <label>Request Body (JSON)</label>
          <textarea id="reqBody" rows="9">{
  "name": "TechCorp",
  "industry": "Software",
  "location": "San Francisco",
  "size": 150,
  "skills": ["Java","Spring"]
}</textarea>
        </div>
      </div>
      <div class="btn-row">
        <button id="sendBtn">▶ Send Request</button>
        <button class="danger" id="resetBtn">↺ Reset DB</button>
      </div>
      <div style="margin-top:14px;display:flex;align-items:center;gap:8px;">
        <span style="font-size:12px;color:var(--muted);">Response</span>
        <span id="statusBadge" class="status-badge"></span>
      </div>
      <pre id="out" class="preview-box" style="margin-top:6px;">Send a request to see the response here.</pre>
      <label style="margin-top:14px;">Current Database</label>
      <div id="list" style="margin-top:6px;"></div>
    </div>
  </div>

  <!-- STEP 2 -->
  <div class="section" id="step2">
    <div class="card">
      <h2>2 — Query Methods &amp; Company Builder</h2>
      <p class="block-desc"><strong>What this shows:</strong> Practice Spring Data JPA derived queries, and build company records with sample data.</p>
      <div class="grid">
        <div>
          <h3>Derived Query Practice</h3>
          <p style="font-size:13px;color:var(--muted);margin-bottom:8px;">Write a method signature to find companies with size greater than a minimum:</p>
          <input id="kataIn" placeholder="List&lt;Company&gt; findBy..."/>
          <div class="btn-row"><button id="kataBtn">Check Answer</button></div>
          <div id="kataMsg" style="margin-top:10px;font-size:13px;padding:8px 12px;border-radius:8px;min-height:20px;"></div>
          <details><summary>Show Hint</summary><p>Use Spring Data naming: <code>findBy&lt;Field&gt;GreaterThan(param)</code></p></details>
        </div>
        <div>
          <h3>Company Builder</h3>
          <label>Company Name</label><input id="bName" placeholder="e.g. TechCorp"/>
          <label>Industry</label>
          <select id="bInd"><option>Software</option><option>AI</option><option>Healthcare</option><option>Finance</option><option>Cybersecurity</option></select>
          <label>Location</label><input id="bLoc" placeholder="e.g. San Diego"/>
          <label>Size (employees)</label><input id="bSize" type="number" placeholder="e.g. 150" min="1"/>
          <label>Skills (comma separated)</label><input id="bSkills" placeholder="e.g. Java, Spring, AWS"/>
          <div class="btn-row">
            <button class="secondary" id="cheatBtn">🎲 Random Fill</button>
            <button id="builderBtn">+ Add Company</button>
          </div>
          <pre id="bOut" class="preview-box" style="min-height:70px;margin-top:10px;"></pre>
        </div>
      </div>
    </div>
  </div>

  <!-- STEP 3 -->
  <div class="section" id="step3">
    <div class="card">
      <h2>3 — Search &amp; Data Filtering</h2>
      <p class="block-desc"><strong>What this shows:</strong> Build query filters using derived queries, JPQL, and Specifications.</p>
      <h3>Query Builder</h3>
      <div class="grid">
        <div class="card">
          <div class="filter-row"><input type="checkbox" id="qLoc"/><label class="filter-label">Filter by Location</label></div>
          <input id="vLoc" placeholder="e.g. San Diego" disabled/>
          <div class="filter-row" style="margin-top:10px;"><input type="checkbox" id="qInd"/><label class="filter-label">Filter by Industry</label></div>
          <select id="vInd" disabled><option>Software</option><option>AI</option><option>Healthcare</option><option>Finance</option></select>
          <div class="filter-row" style="margin-top:10px;"><input type="checkbox" id="qSize"/><label class="filter-label">Min Size</label></div>
          <input id="vSize" type="number" placeholder="e.g. 100" disabled/>
          <div class="filter-row" style="margin-top:10px;"><input type="checkbox" id="qSkill"/><label class="filter-label">Require Skill</label></div>
          <input id="vSkill" placeholder="e.g. Java" disabled/>
          <div class="btn-row" style="margin-top:14px;"><button id="buildQueryBtn">Build Query</button></div>
        </div>
        <div class="card">
          <label>JPQL Generated</label>
          <pre id="jpqlOut" class="preview-box" style="min-height:90px;">SELECT c FROM Company c</pre>
          <label style="margin-top:12px;">Specifications</label>
          <pre id="specOut" class="preview-box" style="min-height:90px;">Specification.where(null)</pre>
        </div>
      </div>
      <h3 style="margin-top:20px;">Learning Recap</h3>
      <div class="recap">
        <div class="recap-block">
          <div class="recap-title">Derived Queries</div>
          <div class="recap-row"><div class="recap-key">Simple</div><div class="recap-val"><code>findByLocation(..)</code></div></div>
          <div class="recap-row"><div class="recap-key">Multi-field</div><div class="recap-val"><code>findByLocationAndIndustry(..)</code></div></div>
          <div class="recap-row"><div class="recap-key">Compare</div><div class="recap-val"><code>findBySizeGreaterThan(..)</code></div></div>
          <div class="recap-row"><div class="recap-key">Like</div><div class="recap-val"><code>findByNameContaining(..)</code></div></div>
        </div>
        <div class="recap-block">
          <div class="recap-title">JPQL &amp; Native</div>
          <div class="recap-row"><div class="recap-key">Filter</div><div class="recap-val"><code>WHERE c.size &gt; :min</code></div></div>
          <div class="recap-row"><div class="recap-key">Join</div><div class="recap-val"><code>JOIN c.skills s</code></div></div>
          <div class="recap-row"><div class="recap-key">Projection</div><div class="recap-val"><code>SELECT new DTO(..)</code></div></div>
        </div>
        <div class="recap-block">
          <div class="recap-title">Specifications</div>
          <div class="recap-row"><div class="recap-key">Chain</div><div class="recap-val"><code>where(a).and(b)</code></div></div>
          <div class="recap-row"><div class="recap-key">Optional</div><div class="recap-val"><code>return null</code> to skip</div></div>
          <div class="recap-row"><div class="recap-key">Flexible</div><div class="recap-val">Best for dynamic filters</div></div>
        </div>
      </div>
    </div>
  </div>

  <!-- STEP 4 -->
  <div class="section" id="step4">
    <div class="card">
      <h2>4 — Pagination &amp; Sorting</h2>
      <p class="block-desc"><strong>What this shows:</strong> See how Pageable works with sorting, limiting, and page navigation.</p>
      <div class="grid">
        <div class="card">
          <label>Page (0-indexed)</label><input id="pg" type="number" min="0" value="0"/>
          <label>Items per page</label><input id="sz" type="number" min="1" value="4"/>
          <label>Sort by field</label>
          <select id="sortField"><option value="id">id</option><option value="name">name</option><option value="size">size</option></select>
          <label>Sort direction</label>
          <select id="sortDir"><option value="asc">Ascending ↑</option><option value="desc">Descending ↓</option></select>
          <div class="btn-row" style="margin-top:14px;"><button id="pagingBtn">Apply Pagination</button></div>
          <div id="pageNav" style="display:flex;gap:8px;margin-top:10px;flex-wrap:wrap;"></div>
        </div>
        <div class="card">
          <label>Result</label>
          <pre id="pageOut" class="preview-box" style="min-height:160px;">Click Apply Pagination to see results.</pre>
        </div>
      </div>
      <h3>Pageable Example Code</h3>
      <pre class="preview-box">// Repository method
Page&lt;Company&gt; findAll(Pageable pageable);

// Service usage
Pageable paging = PageRequest.of(0, 10, Sort.by("size").descending());
Page&lt;Company&gt; page = repo.findAll(paging);</pre>
    </div>
  </div>

  <!-- STEP 5 -->
  <div class="section" id="step5">
    <div class="card">
      <h2>5 — Scenario Checker &amp; Quick Quiz</h2>
      <p class="block-desc"><strong>What this shows:</strong> Real-world scenarios and a quick knowledge check.</p>
      <h3>Scenario Checker</h3>
      <div class="grid">
        <div class="card">
          <label>Scenario</label>
          <select id="scenarioSel">
            <option value="1">Find companies in NYC with Java skill, sorted by size desc, top 20</option>
            <option value="2">Companies with ANY of {Kubernetes, AWS}, size &gt; 500</option>
            <option value="3">Free-text search: name contains 'Tech', composable filters</option>
          </select>
          <label style="margin-top:12px;">Your approach</label>
          <select id="approach">
            <option>Derived Query</option><option>JPQL</option>
            <option>Specifications</option><option>Pageable</option><option>DTO Projection</option>
          </select>
          <div class="btn-row" style="margin-top:14px;"><button id="scenarioBtn">Check Approach</button></div>
        </div>
        <div class="card">
          <pre id="scenarioOut" class="preview-box" style="min-height:100px;">Select a scenario and approach, then click Check.</pre>
        </div>
      </div>
      <h3 style="margin-top:20px;">Exit Quiz</h3>
      <div id="qBox"></div>
      <div class="btn-row" style="margin-top:14px;align-items:center;">
        <button id="gradeBtn">Grade Quiz</button>
        <button class="secondary" id="resetQuizBtn">Reset Quiz</button>
        <span id="qScore" style="font-size:14px;color:var(--txt);margin-left:4px;"></span>
      </div>
    </div>
  </div>

  <!-- STEP 6 -->
  <div class="section" id="step6">
    <div class="card">
      <h2>6 — Completion Checklist &amp; Export</h2>
      <p class="block-desc"><strong>What this shows:</strong> Self-assessment and exportable progress summary.</p>
      <div class="grid">
        <div class="card">
          <h3>Self-Assessment</h3>
          <div id="checklistItems"></div>
          <div class="btn-row" style="margin-top:16px;"><button id="exportBtn">Export Progress</button></div>
        </div>
        <div class="card">
          <h3>Notes</h3>
          <textarea id="notes" rows="6" placeholder="Key takeaways, gotchas, next steps…"></textarea>
          <pre id="exportOut" class="preview-box" style="min-height:100px;margin-top:10px;"></pre>
        </div>
      </div>
    </div>
  </div>

  <div class="nav-buttons">
    <button id="prevBtn" class="secondary">← Previous</button>
    <div style="display:flex;gap:10px;align-items:center;">
      <span id="stepIndicator" style="color:var(--muted);font-size:12px;"></span>
      <button id="nextBtn">Next →</button>
    </div>
  </div>
</div>

<script type="module">
import { CONFIG }        from '/assets/js/bigsix/dataviz/data.js';
import { Navigator }     from '/assets/js/bigsix/shared/navigation.js';
import { Persistence }   from '/assets/js/bigsix/shared/persistence.js';
import { ApiSimulator }  from '/assets/js/bigsix/dataviz/api-simulator.js';
import { QueryBuilder }  from '/assets/js/bigsix/dataviz/query-builder.js';
import { Pagination }    from '/assets/js/bigsix/dataviz/pagination.js';
import { ScenarioQuiz }  from '/assets/js/bigsix/dataviz/scenario-quiz.js';
import { Checklist }     from '/assets/js/bigsix/dataviz/checklist.js';

const db        = JSON.parse(JSON.stringify(CONFIG.DEFAULT_DB));
let   _nextId   = CONFIG.DEFAULT_DB.length + 1;
const getNextId = () => _nextId++;

document.addEventListener('DOMContentLoaded', () => {
  const nav   = new Navigator({ progressStyle: 'dots', labels: ['REST & CRUD', 'Query Methods', 'Search & Filter', 'Pagination', 'Scenario Quiz', 'Completion'] });
  const store = new Persistence(null, { fields: ['notes'] });
  nav.init(() => store.persist());
  store.restore((n, s) => nav.showStep(n, s));
  new ApiSimulator(CONFIG).init();
  new QueryBuilder(CONFIG, db, getNextId).init();
  new Pagination(CONFIG.PAGINATION_SAMPLE).init();
  new ScenarioQuiz(CONFIG).init();
  new Checklist(CONFIG.CHECKLIST).init();
});
</script>

<script>
(function(){
  document.addEventListener('DOMContentLoaded',function(){
    document.querySelectorAll('a.back-btn').forEach(function(a){
      a.addEventListener('click',function(e){
        if (e.metaKey||e.ctrlKey||e.shiftKey||e.button===1) return;
        e.preventDefault();
        try { if (document.referrer&&new URL(document.referrer).origin===location.origin){history.back();return;} } catch(err){}
        var p=location.pathname.replace(/\/$/,'').split('/');
        if (p.length>1){p.pop();window.location.href=p.join('/')+'/';} else {window.location.href='/';}
      });
    });
  });
})();
</script>
<script src="/assets/js/lesson-completion-bigsix.js"></script>