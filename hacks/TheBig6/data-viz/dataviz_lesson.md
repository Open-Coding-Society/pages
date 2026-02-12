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
  :root {
    --bg: #0a0e27;
    --panel: #0f1729;
    --border: rgba(255, 255, 255, 0.08);
    --text: #e6eef8;
    --muted: #9aa6bf;
    --accent: #7c3aed;
  }

  * { box-sizing: border-box; }
  body { margin: 0; padding: 0; background: var(--bg); color: var(--text); font-family: Inter, system-ui, sans-serif; line-height: 1.5; }

  .container { max-width: 1000px; margin: 0 auto; padding: 24px 16px 40px; }
  .header { margin-bottom: 32px; }
  .header h1 { font-size: 28px; font-weight: 800; margin: 0 0 4px 0; }
  .header p { color: var(--muted); font-size: 14px; margin: 0; }

  .progress-bar { display: flex; gap: 8px; margin: 20px 0; justify-content: space-between; align-items: center; }
  .progress-bar .step { flex: 1; height: 4px; background: rgba(255, 255, 255, 0.1); border-radius: 2px; cursor: pointer; transition: 0.2s; }
  .progress-bar .step.active { background: var(--accent); height: 6px; }

  .section { display: none; }
  .section.active { display: block; }

  .card { background: var(--panel); border: 1px solid var(--border); border-radius: 12px; padding: 20px; margin-bottom: 16px; }
  .card h2 { margin-top: 0; font-size: 20px; color: #a6c9ff; }
  .card h3 { margin-top: 16px; font-size: 16px; color: #a6c9ff; }

  .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
  @media (max-width: 900px) { .grid { grid-template-columns: 1fr; } }

  .editor-box, input, textarea, select {
    background: #051226;
    border: 1px solid var(--border);
    border-radius: 10px;
    padding: 12px;
    color: #dce9ff;
    font-family: Inter, system-ui, sans-serif;
    font-size: 14px;
    width: 100%;
  }
  .editor-box:focus, input:focus, textarea:focus, select:focus { outline: none; box-shadow: 0 0 8px rgba(124, 58, 237, 0.3); }

  .preview-box { background: #0f1729; border: 1px solid var(--border); border-radius: 10px; padding: 12px; min-height: 120px; overflow: auto; }

  button { appearance: none; border: 1px solid var(--border); background: var(--accent); color: #fff; padding: 8px 14px; border-radius: 8px; cursor: pointer; font-size: 14px; font-weight: 500; transition: 0.2s; }
  button:hover { background: #6d28d9; transform: translateY(-1px); }
  button.secondary { background: #334155; }
  button.secondary:hover { background: #1e293b; }

  .nav-buttons { display: flex; gap: 12px; margin-top: 24px; justify-content: space-between; }

  .tooltip { font-size: 11px; color: var(--muted); margin-top: 6px; }

  .exercise { background: rgba(124, 58, 237, 0.1); border-left: 3px solid var(--accent); padding: 12px; border-radius: 6px; margin: 8px 0; }
  
  .nav { display: flex; gap: 8px; flex-wrap: wrap; margin: 10px 0 14px; }
  .nav button {
    position: relative;
    background: var(--panel);
    color: #eee;
    border: none;
    padding: 10px 14px;
    border-radius: 12px;
    cursor: pointer;
    font-weight: 800;
    transition: all 0.25s ease;
    z-index: 0;
  }
  .nav button.active {
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15) inset;
  }
  .hidden { display: none; }
  .note { font-size: 12px; color: #aaa; }
  .recap { display: grid; gap: 12px; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); align-items: stretch; }
  .recap-block { border: 1px solid var(--border); border-radius: 12px; background: var(--panel); padding: 14px; display: flex; flex-direction: column; gap: 8px; }
  .recap-title { font-weight: 800; color: var(--text); }
  .recap-list { display: grid; gap: 8px; margin-top: 6px; }
  .recap-row { display: grid; grid-template-columns: max-content 1fr; gap: 10px; align-items: start; }
  .recap-key { color: #aaa; word-break: break-word; }
  .recap-val { color: #f3f4f6; min-width: 0; }
  .recap-val code { background: var(--panel-2); color: #f3f4f6; border-radius: 6px; padding: 2px 6px; font-size: 12px; word-break: break-word; }
  .block-desc {
    background: linear-gradient(90deg, rgba(96, 165, 250, 0.1), rgba(167, 139, 250, 0.1));
    border-left: 3px solid var(--accent);
    padding: 8px 12px;
    border-radius: 8px;
    color: #e2e8f0;
    font-size: 14px;
    margin: 6px 0 10px;
  }
</style>

<div class="container page-content">
  <div class="header">
    <h1>Data Visualization — All-in-One</h1>
    <p>Interactive lessons: REST APIs, Spring Boot CRUD, search, filtering, pagination, and data queries.</p>
     <a href="../" class="button back-btn">Back</a>
  </div>

  <div class="progress-bar" id="progressBar"></div>

  <!-- Step 1: API Simulator -->
  <div class="section active" id="step1">
    <div class="card">
      <h2>1 — REST APIs & CRUD with Mock Database</h2>
      <p class="block-desc"><strong>What this shows:</strong> Experiment with a live mock REST API. Send POST, GET, PUT, DELETE requests to create, read, update, and remove company records.</p>

      <div class="nav" style="margin-bottom: 16px;">
        <button class="active" onclick="setApiTab('create')">POST (Create)</button>
        <button onclick="setApiTab('read')">GET (Read)</button>
        <button onclick="setApiTab('update')">PUT (Update)</button>
        <button onclick="setApiTab('delete')">DELETE (Delete)</button>
      </div>

      <div class="grid">
        <div>
          <label>Endpoint</label>
          <select id="ep" onchange="uiEP()">
            <option>POST /api/companies</option>
            <option>GET /api/companies</option>
            <option>GET /api/companies/{id}</option>
            <option>PUT /api/companies/{id}</option>
            <option>DELETE /api/companies/{id}</option>
          </select>

          <div id="pidWrap" class="hidden">
            <label>Path <code>{id}</code></label>
            <input id="pid" type="number" min="1" placeholder="e.g., 1"/>
          </div>
        </div>

        <div>
          <label>Body (JSON)</label>
          <div id="bodyWrap" class="hidden">
            <textarea id="body">{
  "name": "TechCorp",
  "industry": "Software",
  "location": "San Francisco",
  "size": 150,
  "skills": ["Java","Spring"]
}</textarea>
          </div>
        </div>
      </div>

      <div style="display: flex; gap: 8px;">
        <button onclick="sendApiRequest()">Send Request</button>
        <button onclick="resetDb()" class="secondary">Reset DB</button>
      </div>

      <label style="margin-top: 12px;">Response <small id="status" class="note"></small></label>
      <pre id="out" class="preview-box">Try a request!</pre>

      <label style="margin-top: 12px;">Current Companies</label>
      <div id="list" class="preview-box" style="min-height: 120px;"></div>
    </div>
  </div>

  <!-- Step 2: Code Kata & Builder -->
  <div class="section" id="step2">
    <div class="card">
      <h2>2 — Query Methods & Company Builder</h2>
      <p class="block-desc"><strong>What this shows:</strong> Practice Spring Data JPA derived queries, and build company records with sample data.</p>

      <div class="grid">
        <div>
          <h3>Derived Query Practice</h3>
          <p style="font-size: 13px; color: var(--muted);">Write a method to find companies with size &gt; minSize:</p>
          <input id="kataIn" placeholder="List<Company> findBySizeGreaterThan(Integer minSize);"/>
          <button onclick="checkKata()">Check</button>
          <div id="kataMsg" style="margin: 8px 0; font-size: 13px;"></div>
          <details style="font-size: 12px;">
            <summary>Hint</summary>
            <small class="note">Use Spring Data naming: <code>findBy&lt;Field&gt;GreaterThan(param)</code></small>
          </details>
        </div>

        <div>
          <h3>Company Builder</h3>
          <div class="grid">
            <input id="bName" placeholder="Company Name"/>
            <select id="bInd">
              <option>Software</option>
              <option>AI</option>
              <option>Healthcare</option>
              <option>Finance</option>
            </select>
            <input id="bLoc" placeholder="Location"/>
            <input id="bSize" type="number" placeholder="Size" min="1"/>
            <input id="bSkills" placeholder="Skills (comma-sep)"/>
          </div>
          <div style="display: flex; gap: 8px; margin-top: 8px;">
            <button onclick="cheatFill()">Cheat Fill</button>
            <button onclick="builderAdd()">Add Company</button>
          </div>
          <pre id="bOut" class="preview-box" style="min-height: 80px; font-size: 12px;"></pre>
        </div>
      </div>
    </div>
  </div>

  <!-- Step 3: Search & Filtering -->
  <div class="section" id="step3">
    <div class="card">
      <h2>3 — Search & Data Filtering</h2>
      <p class="block-desc"><strong>What this shows:</strong> Build query filters using derived queries, JPQL, and Specifications.</p>

      <h3>Query Builder</h3>
      <div class="grid">
        <div class="card">
          <label><input type="checkbox" id="qLoc"/> Filter by Location</label>
          <input id="vLoc" placeholder="e.g., NYC" disabled/>

          <label><input type="checkbox" id="qInd"/> Filter by Industry</label>
          <select id="vInd" disabled>
            <option>Tech</option>
            <option>Finance</option>
            <option>Healthcare</option>
          </select>

          <label><input type="checkbox" id="qSize"/> Min Size</label>
          <input id="vSize" type="number" placeholder="e.g., 100" disabled/>

          <label><input type="checkbox" id="qSkill"/> Require Skill</label>
          <input id="vSkill" placeholder="e.g., Java" disabled/>

          <button onclick="buildQuery()">Build</button>
        </div>

        <div class="card">
          <label>JPQL Generated:</label>
          <pre id="jpqlOut" class="preview-box" style="min-height: 100px; font-size: 12px;">SELECT c FROM Company c</pre>
          <label>Specifications:</label>
          <pre id="specOut" class="preview-box" style="min-height: 100px; font-size: 12px;">where(null)</pre>
        </div>
      </div>

      <h3>Learning Recap</h3>
      <div class="recap">
        <div class="recap-block">
          <div class="recap-title">Derived Queries</div>
          <div class="recap-list">
            <div class="recap-row"><div class="recap-key">Simple</div><div class="recap-val"><code>findByLocation(..)</code></div></div>
            <div class="recap-row"><div class="recap-key">Multi-field</div><div class="recap-val"><code>findByLocationAndIndustry(..)</code></div></div>
            <div class="recap-row"><div class="recap-key">Compare</div><div class="recap-val"><code>findBySizeGreaterThan(..)</code></div></div>
            <div class="recap-row"><div class="recap-key">Like</div><div class="recap-val"><code>findByNameContaining(..)</code></div></div>
          </div>
        </div>

        <div class="recap-block">
          <div class="recap-title">JPQL & Native</div>
          <div class="recap-list">
            <div class="recap-row"><div class="recap-key">Filter</div><div class="recap-val"><code>WHERE c.size &gt; :min</code></div></div>
            <div class="recap-row"><div class="recap-key">Join</div><div class="recap-val"><code>JOIN c.skills s</code></div></div>
            <div class="recap-row"><div class="recap-key">Projection</div><div class="recap-val"><code>SELECT new DTO(..)</code></div></div>
          </div>
        </div>

        <div class="recap-block">
          <div class="recap-title">Specifications</div>
          <div class="recap-list">
            <div class="recap-row"><div class="recap-key">Chain</div><div class="recap-val"><code>where(a).and(b)</code></div></div>
            <div class="recap-row"><div class="recap-key">Optional</div><div class="recap-val"><code>return null</code> to skip</div></div>
            <div class="recap-row"><div class="recap-key">Flexible</div><div class="recap-val">Best for dynamic filters</div></div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Step 4: Pagination & Sorting -->
  <div class="section" id="step4">
    <div class="card">
      <h2>4 — Pagination & Sorting</h2>
      <p class="block-desc"><strong>What this shows:</strong> See how Pageable works with sorting, limiting, and page navigation.</p>

      <div class="grid">
        <div class="card">
          <label>Page (0-indexed)</label>
          <input id="pg" type="number" min="0" value="0"/>

          <label>Size (items per page)</label>
          <input id="sz" type="number" min="1" value="5"/>

          <label>Sort (field,asc|desc)</label>
          <input id="sort" placeholder="e.g., name,asc" value="id,asc"/>

          <button onclick="runPaging()">Apply</button>
        </div>

        <div class="card">
          <pre id="pageOut" class="preview-box" style="min-height: 150px; font-size: 12px;">No results yet…</pre>
        </div>
      </div>

      <h3>Pageable Example Code</h3>
      <pre class="preview-box" style="font-size: 12px;">// Repository
Page&lt;Company&gt; findAll(Pageable pageable);

// Service
Pageable paging = PageRequest.of(0, 10, Sort.by("size").descending());
Page&lt;Company&gt; page = repo.findAll(paging);

// Response
{
  "content": [...],
  "totalElements": 50,
  "totalPages": 5,
  "currentPage": 0,
  "size": 10
}</pre>
    </div>
  </div>

  <!-- Step 5: Scenario Checker & Quiz -->
  <div class="section" id="step5">
    <div class="card">
      <h2>5 — Scenario Checker & Quick Quiz</h2>
      <p class="block-desc"><strong>What this shows:</strong> Real-world scenarios and a quick knowledge check.</p>

      <h3>Capstone Scenario Checker</h3>
      <div class="grid">
        <div class="card">
          <label>Scenario</label>
          <select id="scenarioSel">
            <option value="1">Find companies in NYC with Java skill, sorted by size desc, top 20</option>
            <option value="2">Companies with ANY of {Kubernetes, AWS}, size > 500</option>
            <option value="3">Free-text search: name contains 'Tech', composable filters</option>
          </select>

          <label>Your pick</label>
          <select id="approach">
            <option>Derived Query</option>
            <option>JPQL</option>
            <option>Specifications</option>
            <option>Pageable</option>
            <option>DTO Projection</option>
          </select>

          <button onclick="scoreScenario()">Check</button>
        </div>

        <div class="card">
          <pre id="scenarioOut" class="preview-box" style="min-height: 100px; font-size: 12px;">Select a scenario and approach, then "Check".</pre>
        </div>
      </div>

      <h3>Exit Quiz</h3>
      <div id="qBox" class="quiz"></div>
      <button onclick="gradeQuiz()">Grade</button>
      <div id="qScore" style="margin-top: 8px; font-size: 14px;"></div>
    </div>
  </div>

  <!-- Step 6: Completion Checklist -->
  <div class="section" id="step6">
    <div class="card">
      <h2>6 — Completion Checklist & Export</h2>
      <p class="block-desc"><strong>What this shows:</strong> Self-assessment and exportable progress.</p>

      <div class="grid">
        <div class="card">
          <h3>Self-Assessment</h3>
          <label><input type="checkbox" class="ck" value="crud"/> I understand CRUD (Create, Read, Update, Delete)</label>
          <label><input type="checkbox" class="ck" value="derived"/> I can write derived query methods</label>
          <label><input type="checkbox" class="ck" value="jpql"/> I can write JPQL with JOINs & filters</label>
          <label><input type="checkbox" class="ck" value="spec"/> I can chain Specifications</label>
          <label><input type="checkbox" class="ck" value="pageable"/> I can use Pageable for sorting & pagination</label>
          <label><input type="checkbox" class="ck" value="dto"/> I know when to use DTOs</label>
          <button onclick="exportNotes()">Export</button>
        </div>

        <div class="card">
          <h3>Notes</h3>
          <textarea id="notes" placeholder="Key takeaways, gotchas, next steps..."></textarea>
          <pre id="exportOut" class="preview-box" style="min-height: 120px; font-size: 11px;"></pre>
        </div>
      </div>
    </div>
  </div>

  <!-- Navigation -->
  <div class="nav-buttons">
    <button id="prevBtn" onclick="prevStep()" class="secondary">← Previous</button>
    <div style="display: flex; gap: 8px;">
      <span id="stepIndicator" style="color: var(--muted); font-size: 12px; align-self: center;">Step 1 / 6</span>
      <button id="nextBtn" onclick="nextStep()">Next →</button>
    </div>
  </div>
</div>

<script>
// ========== Navigation ========== 
let currentStep = 0;
const steps = ['step1', 'step2', 'step3', 'step4', 'step5', 'step6'];
const STORAGE_KEY = 'dataviz_combined_v1';

function showStep(n) {
  currentStep = Math.max(0, Math.min(steps.length - 1, n));
  steps.forEach((s, i) => document.getElementById(s).classList.toggle('active', i === currentStep));

  const bar = document.getElementById('progressBar');
  bar.innerHTML = steps.map((_, i) => `<div class="step ${i <= currentStep ? 'active' : ''}"></div>`).join('');

  document.getElementById('stepIndicator').textContent = `Step ${currentStep + 1} / ${steps.length}`;
  document.getElementById('prevBtn').disabled = currentStep === 0;
  document.getElementById('nextBtn').disabled = currentStep === steps.length - 1;

  persist();
}

function prevStep() { showStep(currentStep - 1); }
function nextStep() { showStep(currentStep + 1); }

// ========== API Simulator ========== 
let db = [
  { id: 1, name: 'TechNova', industry: 'AI', location: 'San Diego', size: 1200, skills: ['Python', 'TensorFlow'] },
  { id: 2, name: 'HealthBridge', industry: 'Healthcare', location: 'Austin', size: 300, skills: ['Java', 'Spring'] }
];
let nextId = 3;

const $ = id => document.getElementById(id);
function escapeHtml(s) { return String(s).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;'); }

function uiEP() {
  const val = $('ep').value;
  const needsId = val.includes('{id}');
  const needsBody = val.startsWith('POST') || val.startsWith('PUT');
  $('pidWrap').classList.toggle('hidden', !needsId);
  $('bodyWrap').classList.toggle('hidden', !needsBody);
}

function renderList() {
  const html = db.map(c => `
    <div style="border:1px solid #333;border-radius:8px;padding:8px;margin:6px 0">
      <strong>${escapeHtml(c.name)}</strong> <span class="badge">${escapeHtml(c.industry)}</span><br/>
      ${escapeHtml(c.location)} · size ${c.size}<br/>
      ${(c.skills || []).map(s => `<span class="pill">${escapeHtml(s)}</span>`).join(' ')}
    </div>
  `).join('');
  $('list').innerHTML = html || '<p style="color:#aaa;">No companies yet.</p>';
}

function sendApiRequest() {
  const [method, path] = $('ep').value.split(' ');
  let res = null;
  const statusEl = $('status');

  try {
    if (method === 'POST' && path === '/api/companies') {
      const body = JSON.parse($('body').value || '{}');
      const obj = { id: nextId++, name: body.name || 'Unnamed', industry: body.industry || 'Unknown', location: body.location || 'Unknown', size: body.size || 0, skills: body.skills || [] };
      db.push(obj);
      statusEl.textContent = '201 Created';
      res = obj;
    } else if (method === 'GET' && path === '/api/companies') {
      statusEl.textContent = '200 OK';
      res = db;
    } else if (method === 'GET' && path === '/api/companies/{id}') {
      const id = Number($('pid').value);
      const found = db.find(x => x.id === id);
      if (found) { statusEl.textContent = '200 OK'; res = found; } else { statusEl.textContent = '404 Not Found'; res = { error: 'Not found' }; }
    } else if (method === 'PUT' && path === '/api/companies/{id}') {
      const id = Number($('pid').value);
      const idx = db.findIndex(x => x.id === id);
      if (idx === -1) { statusEl.textContent = '404 Not Found'; res = { error: 'Not found' }; } else {
        const body = JSON.parse($('body').value || '{}');
        db[idx] = { ...db[idx], ...body, id };
        statusEl.textContent = '200 OK';
        res = db[idx];
      }
    } else if (method === 'DELETE' && path === '/api/companies/{id}') {
      const id = Number($('pid').value);
      const before = db.length;
      db = db.filter(x => x.id !== id);
      if (db.length === before) { statusEl.textContent = '404 Not Found'; res = { error: 'Not found' }; } else { statusEl.textContent = '204 No Content'; res = {}; }
    }
  } catch (err) {
    statusEl.textContent = '400 Bad Request';
    res = { error: err.message };
  }

  $('out').textContent = JSON.stringify(res, null, 2);
  renderList();
}

function resetDb() {
  db = [
    { id: 1, name: 'TechNova', industry: 'AI', location: 'San Diego', size: 1200, skills: ['Python', 'TensorFlow'] },
    { id: 2, name: 'HealthBridge', industry: 'Healthcare', location: 'Austin', size: 300, skills: ['Java', 'Spring'] }
  ];
  nextId = 3;
  $('status').textContent = '200 OK';
  $('out').textContent = 'Database reset.';
  renderList();
}

function setApiTab(tab) {
  document.querySelectorAll('.nav button').forEach(b => b.classList.remove('active'));
  event.target.classList.add('active');
}

// ========== Kata & Builder ========== 
function checkKata() {
  const v = ($('kataIn').value || '').trim().replace(/\s+/g, ' ');
  const ok = /^List<\s*Company\s*>\s*findBySizeGreaterThan\s*\(\s*Integer\s+\w+\s*\);\s*$/i.test(v);
  const msg = $('kataMsg');
  msg.textContent = ok ? '✅ Correct derived query.' : '❌ Try: List<Company> findBySizeGreaterThan(Integer minSize);';
  msg.style.color = ok ? '#b6f5c2' : '#fbbebe';
}

function cheatFill() {
  const names = ['NovaEdge', 'Skyline', 'Quantum', 'BlueHarbor', 'ApexForge'];
  const cities = ['San Diego', 'Austin', 'Seattle', 'Boston', 'Denver'];
  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
  $('bName').value = pick(names) + ' Inc';
  $('bLoc').value = pick(cities);
  $('bSize').value = Math.floor(Math.random() * 1800) + 20;
  $('bSkills').value = 'Java, Spring, AWS';
}

function builderAdd() {
  const obj = {
    id: nextId++,
    name: ($('bName').value || 'New Co').trim(),
    industry: $('bInd').value,
    location: ($('bLoc').value || 'Unknown').trim(),
    size: Number($('bSize').value || 0),
    skills: ($('bSkills').value || '').split(',').map(s => s.trim()).filter(Boolean)
  };
  db.push(obj);
  $('bOut').textContent = JSON.stringify(obj, null, 2);
  renderList();
}

// ========== Query Builder ========== 
function enableFilters() {
  [['qLoc', 'vLoc'], ['qInd', 'vInd'], ['qSize', 'vSize'], ['qSkill', 'vSkill']].forEach(([c, i]) => {
    $(i).disabled = !$(c).checked;
    if (!$(c).checked) $(i).value = '';
  });
}

function buildQuery() {
  const parts = [], spec = [];
  if ($('qLoc').checked && $('vLoc').value.trim()) {
    parts.push("c.location = :location");
    spec.push("hasLocation(location)");
  }
  if ($('qInd').checked) {
    parts.push("c.industry = :industry");
    spec.push("hasIndustry(industry)");
  }
  if ($('qSize').checked && $('vSize').value) {
    parts.push("c.size >= :minSize");
    spec.push("hasMinSize(minSize)");
  }
  if ($('qSkill').checked && $('vSkill').value.trim()) {
    parts.push(":skill MEMBER OF c.skills");
    spec.push("hasSkill(skill)");
  }

  const jpql = parts.length ? `SELECT c FROM Company c WHERE ${parts.join(' AND ')}` : 'SELECT c FROM Company c';
  const sc = spec.length ? `Specification.where(${spec[0]})${spec.slice(1).map(x => ' .and(' + x + ')').join('')}` : 'Specification.where(null)';

  $('jpqlOut').textContent = jpql;
  $('specOut').textContent = sc;
}

// ========== Pagination ========== 
let sampleData = [
  { id: 1, name: 'Alice', size: 100 },
  { id: 2, name: 'Bob', size: 200 },
  { id: 3, name: 'Carol', size: 150 },
  { id: 4, name: 'Dave', size: 300 },
  { id: 5, name: 'Eve', size: 120 },
  { id: 6, name: 'Frank', size: 250 },
  { id: 7, name: 'Grace', size: 180 },
  { id: 8, name: 'Henry', size: 220 },
  { id: 9, name: 'Ivy', size: 90 },
  { id: 10, name: 'Jack', size: 280 }
];

function runPaging() {
  let page = Math.max(0, parseInt($('pg').value || 0));
  let size = Math.max(1, parseInt($('sz').value || 5));
  let sort = ($('sort').value || '').trim();

  let data = [...sampleData];
  if (sort) {
    const [field, dirRaw] = sort.split(',');
    const dir = (dirRaw || 'asc').toLowerCase();
    data.sort((a, b) => ((a[field] > b[field]) - (a[field] < b[field])) * (dir === 'desc' ? -1 : 1));
  }

  const total = data.length, totalPages = Math.ceil(total / size);
  page = Math.min(page, Math.max(totalPages - 1, 0));
  const start = page * size, end = start + size;
  const rows = data.slice(start, end);

  $('pageOut').textContent = `page=${page}, size=${size}, sort=${sort || '(none)'}\ntotal=${total}, totalPages=${totalPages}\n\n` +
    (rows.map(r => `${r.id}. ${r.name} — size ${r.size}`).join('\n') || 'No data');
}

// ========== Scenario Checker ========== 
function scenarioAnswer(id) {
  switch (id) {
    case '1': return ['Specifications', 'Pageable', 'DTO Projection'];
    case '2': return ['JPQL', 'Specifications'];
    case '3': return ['Specifications'];
    default: return [];
  }
}

function scoreScenario() {
  const sel = $('scenarioSel').value;
  const pick = $('approach').value;
  const good = scenarioAnswer(sel).includes(pick);
  const extra = scenarioAnswer(sel).join(' + ');
  $('scenarioOut').textContent = (good ? '✅ Good choice.' : '❌ Prefer: ' + extra);
}

// ========== Quiz ========== 
const quizData = [
  { q: 'Which is best for optional, composable filters?', opts: ['Derived query', 'JPQL', 'Specifications', 'Native SQL'], a: 2 },
  { q: 'What does returning DTOs improve?', opts: ['Security', 'Performance (payload)', 'Authentication', 'Transactions'], a: 1 },
  { q: 'To sort + limit results use…', opts: ['Specifications', 'Pageable', '@Transactional', 'JOIN'], a: 1 },
  { q: 'MEMBER OF in JPQL checks…', opts: ['null values', 'collection membership', 'sorting', 'permissions'], a: 1 }
];
const picks = {};

function renderQuiz() {
  const box = $('qBox');
  box.innerHTML = '';
  quizData.forEach((it, i) => {
    const wrap = document.createElement('div');
    wrap.innerHTML = `<div style="margin:6px 0;font-weight:700">Q${i + 1}. ${it.q}</div>`;
    it.opts.forEach((o, oi) => {
      const el = document.createElement('div');
      el.className = 'opt';
      el.innerHTML = `<span style="margin-right: 10px; display: inline-block; width: 10px; height: 10px; border-radius: 50%; border: 1px solid var(--border);"></span>${o}`;
      el.dataset.i = i;
      el.dataset.oi = oi;
      el.onclick = () => {
        picks[i] = oi;
        box.querySelectorAll(`.opt[data-i="${i}"]`).forEach(x => {
            x.classList.remove('sel');
            const span = x.querySelector('span');
            if (span) span.style.background = 'transparent';
        });
        el.classList.add('sel');
        const span = el.querySelector('span');
        if (span) span.style.background = 'var(--accent)';
      };
      wrap.appendChild(el);
    });
    box.appendChild(wrap);
  });
}

function gradeQuiz() {
  let s = 0;
  document.querySelectorAll('.opt').forEach(el => el.classList.remove('good', 'bad'));
  quizData.forEach((it, i) => {
    const pick = picks[i];
    if (pick === it.a) s++;
    const el = document.querySelector(`.opt[data-i="${i}"][data-oi="${pick}"]`);
    if (el) el.classList.add(pick === it.a ? 'good' : 'bad');
  });
  $('qScore').textContent = `Score: ${s}/${quizData.length}`;
}

// ========== Export ========== 
function exportNotes() {
  const checks = [...document.querySelectorAll('.ck')].filter(x => x.checked).map(x => x.value);
  const obj = {
    time: new Date().toISOString(),
    mastery: checks,
    jpql: $('jpqlOut').textContent,
    spec: $('specOut').textContent,
    paging: $('pageOut').textContent,
    notes: $('notes').value
  };
  $('exportOut').textContent = JSON.stringify(obj, null, 2);
}

// ========== Persistence ========== 
function persist() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify({ step: currentStep, notes: $('notes').value })); } catch (e) {}
}

function restore() {
  try {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (!data) return;
    if (data.notes) $('notes').value = data.notes;
    showStep(data.step || 0);
  } catch (e) {}
}

// ========== Boot ========== 
document.addEventListener('DOMContentLoaded', () => {
  uiEP();
  renderList();
  renderQuiz();
  enableFilters();
  $('qLoc').addEventListener('change', () => enableFilters());
  $('qInd').addEventListener('change', () => enableFilters());
  $('qSize').addEventListener('change', () => enableFilters());
  $('qSkill').addEventListener('change', () => enableFilters());
  restore();
});
</script>

<script>
// Back button handler: prefer history.back() when possible, fall back to parent path
(function(){
  document.addEventListener('DOMContentLoaded', function(){
    document.querySelectorAll('a.back-btn').forEach(function(a){
      a.addEventListener('click', function(e){
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.button === 1) return;
        e.preventDefault();
        try{ if (document.referrer && new URL(document.referrer).origin === location.origin){ history.back(); return; } }catch(err){}
        var p = location.pathname.replace(///$/,'').split('/');
        if (p.length>1){ p.pop(); window.location.href = p.join('/') + '/'; } else { window.location.href = '/'; }
      });
    });
  });
})();
</script>

<script src="/assets/js/lesson-completion-bigsix.js"></script>