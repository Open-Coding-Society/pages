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
  /* ============================================================
     DESIGN TOKENS — change here to retheme the whole page
     ============================================================ */
  :root {
    --bg:       #0a0e27;
    --panel:    #0f1729;
    --panel-2:  #1a2540;
    --border:   rgba(255,255,255,0.08);
    --text:     #e6eef8;
    --muted:    #9aa6bf;
    --accent:   #7c3aed;
    --accent2:  #a78bfa;
    --success:  #22c55e;
    --danger:   #ef4444;
    --good-bg:  rgba(34,197,94,0.12);
    --bad-bg:   rgba(239,68,68,0.12);
    --hover-bg: rgba(124,58,237,0.1);
    --sel-bg:   rgba(124,58,237,0.2);
  }

  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: var(--bg); color: var(--text); font-family: 'Segoe UI', system-ui, sans-serif; line-height: 1.6; }

  .container { max-width: 1020px; margin: 0 auto; padding: 28px 18px 48px; }
  .header    { margin-bottom: 32px; }
  .header h1 { font-size: 28px; font-weight: 800; margin-bottom: 4px; background: linear-gradient(90deg,#a78bfa,#60a5fa); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
  .header p  { color: var(--muted); font-size: 14px; }

  /* Progress bar */
  .progress-bar       { display: flex; gap: 6px; margin: 20px 0; align-items: center; }
  .progress-bar .step { flex: 1; height: 4px; background: rgba(255,255,255,0.08); border-radius: 2px; cursor: pointer; transition: all 0.25s; }
  .progress-bar .step.active { background: var(--accent); height: 6px; box-shadow: 0 0 8px rgba(124,58,237,0.5); }
  .progress-bar .step:hover  { background: var(--accent2); }

  /* Sections */
  .section        { display: none; animation: fadeIn 0.25s ease; }
  .section.active { display: block; }
  @keyframes fadeIn { from { opacity:0; transform:translateY(6px); } to { opacity:1; transform:translateY(0); } }

  /* Cards */
  .card    { background: var(--panel); border: 1px solid var(--border); border-radius: 14px; padding: 22px; margin-bottom: 16px; }
  .card h2 { font-size: 19px; color: #a6c9ff; margin-bottom: 10px; }
  .card h3 { font-size: 15px; color: #a6c9ff; margin: 16px 0 8px; }

  /* Grid */
  .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
  @media (max-width: 740px) { .grid { grid-template-columns: 1fr; } }

  /* Inputs */
  label { display: block; font-size: 12px; color: var(--muted); text-transform: uppercase; letter-spacing: 0.04em; margin: 10px 0 4px; }
  input, textarea, select {
    background: var(--panel-2); border: 1px solid var(--border); border-radius: 8px;
    padding: 9px 12px; color: var(--text); font-size: 13px; width: 100%; transition: border-color 0.2s, box-shadow 0.2s;
  }
  input:focus, textarea:focus, select:focus { outline: none; border-color: var(--accent); box-shadow: 0 0 0 3px rgba(124,58,237,0.2); }
  textarea { resize: vertical; font-family: 'Courier New', monospace; }

  /* Buttons */
  button {
    appearance: none; border: none; background: var(--accent); color: #fff;
    padding: 9px 18px; border-radius: 8px; cursor: pointer; font-size: 13px;
    font-weight: 600; transition: all 0.2s; letter-spacing: 0.02em;
  }
  button:hover    { background: #6d28d9; transform: translateY(-1px); box-shadow: 0 4px 12px rgba(124,58,237,0.35); }
  button:active   { transform: translateY(0); }
  button:disabled { opacity: 0.35; cursor: not-allowed; transform: none; box-shadow: none; }
  button.secondary { background: var(--panel-2); border: 1px solid var(--border); color: var(--muted); }
  button.secondary:hover { background: #253352; color: var(--text); box-shadow: none; }
  button.danger   { background: rgba(239,68,68,0.15); border: 1px solid rgba(239,68,68,0.3); color: #fca5a5; }
  button.danger:hover { background: rgba(239,68,68,0.25); box-shadow: none; }

  /* Tab nav */
  .tab-nav { display: flex; gap: 6px; flex-wrap: wrap; margin: 0 0 16px; }
  .tab-nav button { background: var(--panel-2); color: var(--muted); border: 1px solid var(--border); padding: 8px 14px; border-radius: 20px; font-size: 12px; font-weight: 600; }
  .tab-nav button.active { background: var(--accent); color: #fff; border-color: var(--accent); box-shadow: 0 0 12px rgba(124,58,237,0.4); }
  .tab-nav button:hover:not(.active) { background: var(--hover-bg); color: var(--text); border-color: var(--accent); box-shadow: none; transform: none; }

  /* Preview / code boxes */
  .preview-box {
    background: #060d1f; border: 1px solid var(--border); border-radius: 10px;
    padding: 14px; min-height: 80px; overflow: auto; white-space: pre-wrap;
    word-break: break-word; font-family: 'Courier New', monospace; font-size: 12px;
    color: #c4d4f0; line-height: 1.7;
  }

  /* Block description */
  .block-desc {
    background: linear-gradient(90deg,rgba(96,165,250,0.08),rgba(167,139,250,0.08));
    border-left: 3px solid var(--accent); padding: 10px 14px;
    border-radius: 0 8px 8px 0; color: var(--muted); font-size: 13px; margin-bottom: 16px;
  }
  .block-desc strong { color: var(--text); }

  /* Status badge */
  .status-badge { display: inline-block; padding: 2px 10px; border-radius: 20px; font-size: 11px; font-weight: 700; letter-spacing: 0.04em; margin-left: 8px; }
  .status-2xx { background: rgba(34,197,94,0.15); color: #86efac; border: 1px solid rgba(34,197,94,0.3); }
  .status-4xx { background: rgba(239,68,68,0.15);  color: #fca5a5; border: 1px solid rgba(239,68,68,0.3); }

  /* Company cards */
  .company-card { border: 1px solid var(--border); border-radius: 10px; padding: 12px 14px; margin: 6px 0; background: var(--panel-2); transition: border-color 0.2s; }
  .company-card:hover { border-color: rgba(124,58,237,0.4); }
  .company-card strong { color: #a6c9ff; font-size: 14px; }
  .pill  { display: inline-block; background: rgba(124,58,237,0.15); border: 1px solid rgba(124,58,237,0.4); color: var(--accent2); border-radius: 12px; padding: 1px 8px; font-size: 11px; margin: 2px 2px 0 0; }
  .badge { display: inline-block; background: var(--panel-2); border: 1px solid var(--border); color: var(--muted); border-radius: 6px; padding: 1px 8px; font-size: 11px; margin-left: 6px; }

  /* Quiz */
  .quiz-question-text { font-weight: 700; font-size: 14px; margin: 16px 0 8px; color: var(--text); }
  .opt { display: flex; align-items: center; gap: 10px; padding: 10px 14px; margin: 5px 0; border: 1px solid var(--border); border-radius: 8px; cursor: pointer; background: var(--panel-2); color: var(--text); font-size: 13px; transition: all 0.2s; user-select: none; }
  .opt:hover  { background: var(--hover-bg); border-color: var(--accent); }
  .opt.sel    { background: var(--sel-bg);   border-color: var(--accent); }
  .opt.good   { background: var(--good-bg);  border-color: rgba(34,197,94,0.5); color: #86efac; }
  .opt.bad    { background: var(--bad-bg);   border-color: rgba(239,68,68,0.5);  color: #fca5a5; }
  .radio-dot  { width: 12px; height: 12px; border-radius: 50%; border: 2px solid var(--muted); flex-shrink: 0; transition: all 0.2s; }
  .opt.sel  .radio-dot { background: var(--accent); border-color: var(--accent); }
  .opt.good .radio-dot { background: var(--success); border-color: var(--success); }
  .opt.bad  .radio-dot { background: var(--danger);  border-color: var(--danger); }

  /* Recap */
  .recap { display: grid; gap: 12px; grid-template-columns: repeat(auto-fit,minmax(230px,1fr)); }
  .recap-block { border: 1px solid var(--border); border-radius: 12px; background: var(--panel-2); padding: 14px; }
  .recap-title { font-weight: 800; color: var(--accent2); margin-bottom: 10px; font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em; }
  .recap-row   { display: grid; grid-template-columns: max-content 1fr; gap: 10px; margin-bottom: 6px; align-items: start; }
  .recap-key   { color: var(--muted); font-size: 12px; }
  .recap-val code { background: rgba(124,58,237,0.15); color: var(--accent2); border-radius: 5px; padding: 1px 6px; font-size: 11px; font-family: 'Courier New',monospace; }

  /* Checklist */
  .checklist-item { display: flex; align-items: center; gap: 10px; padding: 10px 12px; margin: 5px 0; background: var(--panel-2); border: 1px solid var(--border); border-radius: 8px; cursor: pointer; transition: all 0.2s; font-size: 13px; }
  .checklist-item:hover { border-color: rgba(124,58,237,0.4); }
  .checklist-item input[type="checkbox"] { width: 16px; height: 16px; accent-color: var(--accent); cursor: pointer; flex-shrink: 0; }
  .checklist-item.checked { background: rgba(34,197,94,0.08); border-color: rgba(34,197,94,0.3); color: #86efac; }

  /* Nav */
  .nav-buttons { display: flex; gap: 12px; margin-top: 28px; justify-content: space-between; align-items: center; }

  /* Misc */
  .hidden  { display: none; }
  .note    { font-size: 12px; color: var(--muted); }
  .btn-row { display: flex; gap: 8px; flex-wrap: wrap; margin-top: 10px; }
  details summary { cursor: pointer; color: var(--accent2); font-size: 12px; margin-top: 8px; }
  details p { margin-top: 6px; font-size: 12px; color: var(--muted); }
  code { background: rgba(124,58,237,0.15); color: var(--accent2); border-radius: 4px; padding: 1px 5px; font-family: 'Courier New',monospace; font-size: 12px; }
  .filter-row { display: flex; align-items: center; gap: 10px; margin-top: 12px; }
  .filter-row input[type="checkbox"] { width: 15px; height: 15px; accent-color: var(--accent); flex-shrink: 0; }
  .filter-label { font-size: 13px; color: var(--text); text-transform: none; letter-spacing: 0; margin: 0; }
</style>

<div class="container page-content">

  <div class="header">
    <h1>Data Visualization — All-in-One</h1>
    <p>Interactive lessons: REST APIs, Spring Boot CRUD, search, filtering, pagination, and data queries.</p>
    <a href="../" class="button back-btn">← Back</a>
  </div>

  <div class="progress-bar" id="progressBar"></div>

  <!-- STEP 1: API Simulator -->
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
          <input id="ep" readonly style="color:var(--accent2);font-family:'Courier New',monospace;" value="POST /api/companies"/>
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

  <!-- STEP 2: Query Kata & Builder -->
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
          <details>
            <summary>Show Hint</summary>
            <p>Use Spring Data naming: <code>findBy&lt;Field&gt;GreaterThan(param)</code></p>
          </details>
        </div>
        <div>
          <h3>Company Builder</h3>
          <label>Company Name</label>
          <input id="bName" placeholder="e.g. TechCorp"/>
          <label>Industry</label>
          <select id="bInd">
            <option>Software</option><option>AI</option>
            <option>Healthcare</option><option>Finance</option><option>Cybersecurity</option>
          </select>
          <label>Location</label>
          <input id="bLoc" placeholder="e.g. San Diego"/>
          <label>Size (employees)</label>
          <input id="bSize" type="number" placeholder="e.g. 150" min="1"/>
          <label>Skills (comma separated)</label>
          <input id="bSkills" placeholder="e.g. Java, Spring, AWS"/>
          <div class="btn-row">
            <button class="secondary" id="cheatBtn">🎲 Random Fill</button>
            <button id="builderBtn">+ Add Company</button>
          </div>
          <pre id="bOut" class="preview-box" style="min-height:70px;margin-top:10px;"></pre>
        </div>
      </div>
    </div>
  </div>

  <!-- STEP 3: Search & Filtering -->
  <div class="section" id="step3">
    <div class="card">
      <h2>3 — Search &amp; Data Filtering</h2>
      <p class="block-desc"><strong>What this shows:</strong> Build query filters using derived queries, JPQL, and Specifications.</p>
      <h3>Query Builder</h3>
      <div class="grid">
        <div class="card">
          <div class="filter-row">
            <input type="checkbox" id="qLoc"/>
            <label class="filter-label">Filter by Location</label>
          </div>
          <input id="vLoc" placeholder="e.g. San Diego" disabled/>
          <div class="filter-row" style="margin-top:10px;">
            <input type="checkbox" id="qInd"/>
            <label class="filter-label">Filter by Industry</label>
          </div>
          <select id="vInd" disabled>
            <option>Software</option><option>AI</option>
            <option>Healthcare</option><option>Finance</option>
          </select>
          <div class="filter-row" style="margin-top:10px;">
            <input type="checkbox" id="qSize"/>
            <label class="filter-label">Min Size</label>
          </div>
          <input id="vSize" type="number" placeholder="e.g. 100" disabled/>
          <div class="filter-row" style="margin-top:10px;">
            <input type="checkbox" id="qSkill"/>
            <label class="filter-label">Require Skill</label>
          </div>
          <input id="vSkill" placeholder="e.g. Java" disabled/>
          <div class="btn-row" style="margin-top:14px;">
            <button id="buildQueryBtn">Build Query</button>
          </div>
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

  <!-- STEP 4: Pagination -->
  <div class="section" id="step4">
    <div class="card">
      <h2>4 — Pagination &amp; Sorting</h2>
      <p class="block-desc"><strong>What this shows:</strong> See how Pageable works with sorting, limiting, and page navigation.</p>
      <div class="grid">
        <div class="card">
          <label>Page (0-indexed)</label>
          <input id="pg" type="number" min="0" value="0"/>
          <label>Items per page</label>
          <input id="sz" type="number" min="1" value="4"/>
          <label>Sort by field</label>
          <select id="sortField">
            <option value="id">id</option>
            <option value="name">name</option>
            <option value="size">size</option>
          </select>
          <label>Sort direction</label>
          <select id="sortDir">
            <option value="asc">Ascending ↑</option>
            <option value="desc">Descending ↓</option>
          </select>
          <div class="btn-row" style="margin-top:14px;">
            <button id="pagingBtn">Apply Pagination</button>
          </div>
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
Page&lt;Company&gt; page = repo.findAll(paging);

// Response shape
{
  "content": [...],
  "totalElements": 50,
  "totalPages": 5,
  "currentPage": 0,
  "size": 10
}</pre>
    </div>
  </div>

  <!-- STEP 5: Scenario & Quiz -->
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
          <div class="btn-row" style="margin-top:14px;">
            <button id="scenarioBtn">Check Approach</button>
          </div>
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
        <span id="qScore" style="font-size:14px;color:var(--text);margin-left:4px;"></span>
      </div>
    </div>
  </div>

  <!-- STEP 6: Checklist & Export -->
  <div class="section" id="step6">
    <div class="card">
      <h2>6 — Completion Checklist &amp; Export</h2>
      <p class="block-desc"><strong>What this shows:</strong> Self-assessment and exportable progress summary.</p>
      <div class="grid">
        <div class="card">
          <h3>Self-Assessment</h3>
          <div id="checklistItems"></div>
          <div class="btn-row" style="margin-top:16px;">
            <button id="exportBtn">Export Progress</button>
          </div>
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

<script>
// ============================================================
//  CONFIG — all hardcoded data lives here, edit freely
// ============================================================
const CONFIG = {
  STEPS: ['step1','step2','step3','step4','step5','step6'],
  STORAGE_KEY: 'dataviz_combined_v2',

  DEFAULT_DB: [
    { id:1, name:'TechNova',     industry:'AI',         location:'San Diego', size:1200, skills:['Python','TensorFlow','Docker'] },
    { id:2, name:'HealthBridge', industry:'Healthcare', location:'Austin',    size:300,  skills:['Java','Spring','MySQL'] },
    { id:3, name:'FinEdge',      industry:'Finance',    location:'New York',  size:850,  skills:['Kotlin','AWS','Redis'] },
    { id:4, name:'CloudPeak',    industry:'Software',   location:'Seattle',   size:420,  skills:['Go','Kubernetes','GCP'] },
  ],

  CHEAT_NAMES:  ['NovaEdge','Skyline','Quantum','BlueHarbor','ApexForge','CipherLabs','NorthStar'],
  CHEAT_CITIES: ['San Diego','Austin','Seattle','Boston','Denver','Miami','Chicago'],
  CHEAT_SKILLS: ['Java, Spring, AWS','Python, TensorFlow, Docker','Go, Kubernetes, Redis','Kotlin, Android, Firebase'],

  PAGINATION_SAMPLE: [
    { id:1,  name:'Alice Corp',        size:100 },
    { id:2,  name:'Bob Industries',    size:200 },
    { id:3,  name:'Carol Solutions',   size:150 },
    { id:4,  name:'Dave Enterprises',  size:300 },
    { id:5,  name:'Eve Technologies',  size:120 },
    { id:6,  name:'Frank Systems',     size:250 },
    { id:7,  name:'Grace Analytics',   size:180 },
    { id:8,  name:'Henry Ventures',    size:220 },
    { id:9,  name:'Ivy Labs',          size:90  },
    { id:10, name:'Jack Dynamics',     size:280 },
  ],

  SCENARIOS: {
    '1': { best:['Specifications','Pageable','DTO Projection'], reason:'Needs filtering (Specifications), pagination/sorting (Pageable), and optimised output (DTO Projection).' },
    '2': { best:['JPQL','Specifications'], reason:'ANY-of collection checks and size comparisons work well with JPQL MEMBER OF or Specifications.' },
    '3': { best:['Specifications'], reason:'Composable, optional free-text filters are exactly what Specifications are designed for.' },
  },

  QUIZ: [
    { q:'Which approach is best for optional, composable filters?', opts:['Derived Query','JPQL','Specifications','Native SQL'], a:2, explanation:'Specifications let you chain optional filters with .and()/.or() — perfect for dynamic queries.' },
    { q:'What does returning DTOs improve?', opts:['Security only','Performance by reducing payload size','Authentication speed','Transaction handling'], a:1, explanation:'DTOs let you return only what the client needs, reducing response size and improving performance.' },
    { q:'To sort and limit results in Spring Data, you use…', opts:['Specifications','Pageable with PageRequest','@Transactional','JOIN FETCH'], a:1, explanation:'PageRequest.of(page, size, Sort.by(...)) gives full control over pagination and sorting.' },
    { q:'In JPQL, what does MEMBER OF check?', opts:['Whether a field is null','If an item exists in a collection field','The sort order','User permission levels'], a:1, explanation:'MEMBER OF checks if a value is inside a collection, e.g. :skill MEMBER OF c.skills.' },
  ],

  CHECKLIST: [
    { value:'crud',     label:'I understand CRUD (Create, Read, Update, Delete)' },
    { value:'derived',  label:'I can write derived query methods' },
    { value:'jpql',     label:'I can write JPQL with JOINs & filters' },
    { value:'spec',     label:'I can chain Specifications for dynamic filtering' },
    { value:'pageable', label:'I can use Pageable for sorting & pagination' },
    { value:'dto',      label:'I know when to use DTOs for performance' },
  ],
};

// ============================================================
//  STATE
// ============================================================
let currentStep = 0;
let db    = JSON.parse(JSON.stringify(CONFIG.DEFAULT_DB));
let nextId = CONFIG.DEFAULT_DB.length + 1;
const picks = {};

// ============================================================
//  HELPERS
// ============================================================
const $  = id => document.getElementById(id);
const pickRandom = arr => arr[Math.floor(Math.random() * arr.length)];

function escapeHtml(s) {
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function setStatusBadge(text) {
  const el = $('statusBadge');
  if (!el) return;
  const code = parseInt(text);
  el.textContent = text;
  el.className   = 'status-badge ' + (code >= 400 ? 'status-4xx' : 'status-2xx');
}

// ============================================================
//  NAVIGATION
// ============================================================
function showStep(n) {
  currentStep = Math.max(0, Math.min(CONFIG.STEPS.length - 1, n));
  CONFIG.STEPS.forEach((id, i) =>
    document.getElementById(id).classList.toggle('active', i === currentStep)
  );
  $('progressBar').innerHTML = CONFIG.STEPS.map((_, i) =>
    `<div class="step ${i <= currentStep ? 'active' : ''}" onclick="window.__showStep(${i})" title="Step ${i+1}"></div>`
  ).join('');
  $('stepIndicator').textContent = `Step ${currentStep + 1} / ${CONFIG.STEPS.length}`;
  $('prevBtn').disabled = currentStep === 0;
  $('nextBtn').disabled = currentStep === CONFIG.STEPS.length - 1;
  persist();
}
// Expose on window so inline onclick in progress bar works
window.__showStep = showStep;

// ============================================================
//  STEP 1 — API Simulator
// ============================================================
function initMethodTabs() {
  document.querySelectorAll('#methodTabs button').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('#methodTabs button').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      $('ep').value = btn.dataset.ep;
      syncEndpointUI();
    });
  });
}

function syncEndpointUI() {
  const val      = $('ep').value;
  const needsId  = val.includes('{id}');
  const needsBody= val.startsWith('POST') || val.startsWith('PUT');
  $('pidWrap').classList.toggle('hidden', !needsId);
  $('bodyWrap').classList.toggle('hidden', !needsBody);
}

function renderList() {
  const el = $('list');
  if (!db.length) { el.innerHTML = '<p style="color:var(--muted);padding:12px;">No companies in database.</p>'; return; }
  el.innerHTML = db.map(c => `
    <div class="company-card">
      <strong>${escapeHtml(c.name)}</strong>
      <span class="badge">${escapeHtml(c.industry)}</span>
      <span style="color:var(--muted);font-size:11px;margin-left:8px;">ID: ${c.id}</span><br/>
      <span style="font-size:12px;color:var(--muted);">${escapeHtml(c.location)} · ${c.size} employees</span><br/>
      <div style="margin-top:5px;">${(c.skills||[]).map(s=>`<span class="pill">${escapeHtml(s)}</span>`).join('')}</div>
    </div>`).join('');
}

function sendApiRequest() {
  const parts  = $('ep').value.split(' ');
  const method = parts[0];
  const path   = parts[1];
  let res      = null;
  try {
    if (method === 'POST' && path === '/api/companies') {
      const body = JSON.parse($('reqBody').value || '{}');
      if (!body.name) throw new Error('"name" field is required');
      const obj = { id:nextId++, name:body.name, industry:body.industry||'Unknown', location:body.location||'Unknown', size:Number(body.size)||0, skills:Array.isArray(body.skills)?body.skills:[] };
      db.push(obj); setStatusBadge('201 Created'); res = obj;

    } else if (method === 'GET' && path === '/api/companies') {
      setStatusBadge('200 OK'); res = { total:db.length, companies:db };

    } else if (method === 'GET' && path === '/api/companies/{id}') {
      const id = Number($('pid').value);
      if (!id) throw new Error('Enter a valid numeric ID');
      const found = db.find(x => x.id === id);
      setStatusBadge(found ? '200 OK' : '404 Not Found');
      res = found || { error:`No company with id ${id}` };

    } else if (method === 'PUT' && path === '/api/companies/{id}') {
      const id  = Number($('pid').value);
      if (!id) throw new Error('Enter a valid numeric ID');
      const idx = db.findIndex(x => x.id === id);
      if (idx === -1) { setStatusBadge('404 Not Found'); res = { error:`No company with id ${id}` }; }
      else { const body = JSON.parse($('reqBody').value||'{}'); db[idx] = {...db[idx],...body,id}; setStatusBadge('200 OK'); res = db[idx]; }

    } else if (method === 'DELETE' && path === '/api/companies/{id}') {
      const id     = Number($('pid').value);
      if (!id) throw new Error('Enter a valid numeric ID');
      const before = db.length;
      db = db.filter(x => x.id !== id);
      const deleted = db.length < before;
      setStatusBadge(deleted ? '204 No Content' : '404 Not Found');
      res = deleted ? { message:`Company ${id} deleted` } : { error:`No company with id ${id}` };
    }
  } catch(err) { setStatusBadge('400 Bad Request'); res = { error:err.message }; }

  $('out').textContent = JSON.stringify(res, null, 2);
  renderList();
}

function resetDb() {
  db = JSON.parse(JSON.stringify(CONFIG.DEFAULT_DB));
  nextId = CONFIG.DEFAULT_DB.length + 1;
  setStatusBadge('200 OK');
  $('out').textContent = 'Database reset to defaults.';
  renderList();
}

// ============================================================
//  STEP 2 — Kata & Builder
// ============================================================
function checkKata() {
  const v  = ($('kataIn').value||'').trim().replace(/\s+/g,' ');
  const ok = /^List\s*<\s*Company\s*>\s*findBySizeGreaterThan\s*\(\s*(Integer|int)\s+\w+\s*\)\s*;?\s*$/i.test(v);
  const el = $('kataMsg');
  el.textContent       = ok ? '✅ Correct! findBySizeGreaterThan follows Spring Data naming conventions.' : '❌ Not quite. Try: List<Company> findBySizeGreaterThan(Integer minSize);';
  el.style.background  = ok ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)';
  el.style.color       = ok ? '#86efac' : '#fca5a5';
  el.style.padding     = '8px 12px';
  el.style.borderRadius= '8px';
}

function cheatFill() {
  $('bName').value   = pickRandom(CONFIG.CHEAT_NAMES) + ' Inc';
  $('bLoc').value    = pickRandom(CONFIG.CHEAT_CITIES);
  $('bSize').value   = Math.floor(Math.random() * 1800) + 20;
  $('bSkills').value = pickRandom(CONFIG.CHEAT_SKILLS);
}

function builderAdd() {
  const name = ($('bName').value||'').trim();
  if (!name) { $('bOut').textContent = '⚠ Please enter a company name.'; return; }
  const obj = { id:nextId++, name, industry:$('bInd').value, location:($('bLoc').value||'Unknown').trim(), size:Math.max(0,Number($('bSize').value)||0), skills:($('bSkills').value||'').split(',').map(s=>s.trim()).filter(Boolean) };
  db.push(obj);
  $('bOut').textContent = '✅ Company added:\n' + JSON.stringify(obj, null, 2);
  renderList();
}

// ============================================================
//  STEP 3 — Query Builder
// ============================================================
function enableFilters() {
  [['qLoc','vLoc'],['qInd','vInd'],['qSize','vSize'],['qSkill','vSkill']].forEach(([cId,iId]) => {
    const on = $(cId).checked;
    $(iId).disabled = !on;
    if (!on) $(iId).value = '';
  });
}

function buildQuery() {
  const parts=[], spec=[];
  if ($('qLoc').checked && $('vLoc').value.trim()) { parts.push(`c.location = :location`); spec.push(`hasLocation("${$('vLoc').value.trim()}")`); }
  if ($('qInd').checked) { parts.push(`c.industry = :industry`); spec.push(`hasIndustry("${$('vInd').value}")`); }
  if ($('qSize').checked && $('vSize').value) { parts.push(`c.size >= :minSize`); spec.push(`hasMinSize(${$('vSize').value})`); }
  if ($('qSkill').checked && $('vSkill').value.trim()) { parts.push(`:skill MEMBER OF c.skills`); spec.push(`hasSkill("${$('vSkill').value.trim()}")`); }
  $('jpqlOut').textContent = parts.length ? `SELECT c FROM Company c\nWHERE ${parts.join('\n  AND ')}` : 'SELECT c FROM Company c';
  $('specOut').textContent = spec.length  ? `Specification.where(${spec[0]})`+spec.slice(1).map(x=>`\n  .and(${x})`).join('') : 'Specification.where(null)';
}

// ============================================================
//  STEP 4 — Pagination
// ============================================================
function runPaging() {
  const field = $('sortField').value;
  const dir   = $('sortDir').value;
  const size  = Math.max(1, parseInt($('sz').value)||4);
  const data  = [...CONFIG.PAGINATION_SAMPLE].sort((a,b) => {
    const av=a[field], bv=b[field];
    const cmp = typeof av==='string' ? av.localeCompare(bv) : av-bv;
    return dir==='desc' ? -cmp : cmp;
  });
  const total      = data.length;
  const totalPages = Math.ceil(total/size);
  let   page       = Math.max(0, Math.min(parseInt($('pg').value)||0, totalPages-1));
  $('pg').value    = page;
  const start = page*size;
  const rows  = data.slice(start, start+size);
  $('pageOut').textContent =
    `Page ${page} of ${totalPages-1}  |  Size: ${size}  |  Sort: ${field} ${dir}\n`+
    `Total: ${total} records  |  Showing ${start+1}–${Math.min(start+size,total)}\n\n`+
    rows.map(r=>`  [${r.id}] ${r.name.padEnd(22)} ${r.size} employees`).join('\n');
  const nav = $('pageNav');
  nav.innerHTML = '';
  if (page > 0) {
    const b = document.createElement('button'); b.className='secondary'; b.textContent='← Prev';
    b.addEventListener('click',()=>{ $('pg').value=page-1; runPaging(); }); nav.appendChild(b);
  }
  if (page < totalPages-1) {
    const b = document.createElement('button'); b.textContent='Next →';
    b.addEventListener('click',()=>{ $('pg').value=page+1; runPaging(); }); nav.appendChild(b);
  }
}

// ============================================================
//  STEP 5 — Scenario Checker & Quiz
// ============================================================
function scoreScenario() {
  const scenario = CONFIG.SCENARIOS[$('scenarioSel').value];
  if (!scenario) return;
  const good = scenario.best.includes($('approach').value);
  $('scenarioOut').textContent = good
    ? `✅ Good choice — "${$('approach').value}" works well here.\n\n${scenario.reason}`
    : `❌ Not the best fit.\n\nPrefer: ${scenario.best.join(' or ')}\n\n${scenario.reason}`;
}

function renderQuiz() {
  const box=$('qBox'); box.innerHTML='';
  CONFIG.QUIZ.forEach((item,i) => {
    const wrap=document.createElement('div');
    const qText=document.createElement('div'); qText.className='quiz-question-text'; qText.textContent=`Q${i+1}. ${item.q}`; wrap.appendChild(qText);
    item.opts.forEach((optText,oi) => {
      const el=document.createElement('div'); el.className='opt'; el.dataset.i=i; el.dataset.oi=oi;
      const dot=document.createElement('span'); dot.className='radio-dot';
      const lbl=document.createElement('span'); lbl.textContent=optText;
      el.appendChild(dot); el.appendChild(lbl);
      el.addEventListener('click',()=>{ picks[i]=oi; box.querySelectorAll(`.opt[data-i="${i}"]`).forEach(x=>x.classList.remove('sel','good','bad')); el.classList.add('sel'); });
      wrap.appendChild(el);
    });
    box.appendChild(wrap);
  });
}

function gradeQuiz() {
  let correct=0, unanswered=0;
  document.querySelectorAll('.opt').forEach(el=>el.classList.remove('good','bad'));
  CONFIG.QUIZ.forEach((item,i) => {
    const chosen=picks[i];
    if (chosen===undefined) { unanswered++; return; }
    const ok=chosen===item.a; if (ok) correct++;
    const chosenEl=document.querySelector(`.opt[data-i="${i}"][data-oi="${chosen}"]`);
    const correctEl=document.querySelector(`.opt[data-i="${i}"][data-oi="${item.a}"]`);
    if (chosenEl) chosenEl.classList.add(ok?'good':'bad');
    if (!ok && correctEl) correctEl.classList.add('good');
  });
  const total=CONFIG.QUIZ.length;
  let msg=`Score: ${correct} / ${total}`;
  if (unanswered>0) msg+=`  (${unanswered} unanswered)`;
  if (correct===total&&!unanswered) msg+='  🎉 Perfect!';
  else if (correct>=Math.ceil(total*0.75)&&!unanswered) msg+='  👍 Great work!';
  $('qScore').textContent=msg;
}

function resetQuiz() {
  Object.keys(picks).forEach(k=>delete picks[k]);
  $('qScore').textContent='';
  renderQuiz();
}

// ============================================================
//  STEP 6 — Checklist & Export
// ============================================================
function renderChecklist() {
  const container=$('checklistItems'); container.innerHTML='';
  CONFIG.CHECKLIST.forEach(item => {
    const div=document.createElement('div'); div.className='checklist-item';
    const cb=document.createElement('input'); cb.type='checkbox'; cb.className='ck'; cb.value=item.value;
    const lbl=document.createElement('span'); lbl.textContent=item.label;
    div.appendChild(cb); div.appendChild(lbl);
    cb.addEventListener('change',()=>div.classList.toggle('checked',cb.checked));
    div.addEventListener('click',e=>{ if(e.target!==cb){cb.checked=!cb.checked; div.classList.toggle('checked',cb.checked);} });
    container.appendChild(div);
  });
}

function exportNotes() {
  const mastery=[...document.querySelectorAll('.ck')].filter(x=>x.checked).map(x=>x.value);
  $('exportOut').textContent=JSON.stringify({ exported_at:new Date().toISOString(), mastery_checklist:mastery, jpql_query:$('jpqlOut').textContent, specifications:$('specOut').textContent, pagination_result:$('pageOut').textContent, notes:$('notes').value },null,2);
}

// ============================================================
//  PERSISTENCE
// ============================================================
function persist() {
  try { localStorage.setItem(CONFIG.STORAGE_KEY,JSON.stringify({ step:currentStep, notes:$('notes')?.value??'' })); } catch(e) {}
}

function restore() {
  try {
    const data=JSON.parse(localStorage.getItem(CONFIG.STORAGE_KEY));
    if (!data) { showStep(0); return; }
    if (data.notes&&$('notes')) $('notes').value=data.notes;
    showStep(data.step||0);
  } catch(e) { showStep(0); }
}

// ============================================================
//  BOOT
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
  initMethodTabs(); syncEndpointUI(); renderList();
  $('sendBtn').addEventListener('click', sendApiRequest);
  $('resetBtn').addEventListener('click', resetDb);
  $('kataBtn').addEventListener('click', checkKata);
  $('cheatBtn').addEventListener('click', cheatFill);
  $('builderBtn').addEventListener('click', builderAdd);
  ['qLoc','qInd','qSize','qSkill'].forEach(id=>$(id).addEventListener('change',enableFilters));
  enableFilters();
  $('buildQueryBtn').addEventListener('click', buildQuery);
  $('pagingBtn').addEventListener('click', runPaging);
  $('scenarioBtn').addEventListener('click', scoreScenario);
  $('gradeBtn').addEventListener('click', gradeQuiz);
  $('resetQuizBtn').addEventListener('click', resetQuiz);
  renderQuiz();
  renderChecklist();
  $('exportBtn').addEventListener('click', exportNotes);
  $('prevBtn').addEventListener('click', ()=>showStep(currentStep-1));
  $('nextBtn').addEventListener('click', ()=>showStep(currentStep+1));
  restore();
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