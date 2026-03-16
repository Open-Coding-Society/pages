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
    --panel-2: #1a2540;
    --border: rgba(255, 255, 255, 0.08);
    --text: #e6eef8;
    --muted: #9aa6bf;
    --accent: #7c3aed;
    --success: #b6f5c2;
    --error: #fbbebe;
    --good-bg: rgba(34, 197, 94, 0.15);
    --bad-bg: rgba(239, 68, 68, 0.15);
    --hover-bg: rgba(124, 58, 237, 0.1);
    --sel-bg: rgba(124, 58, 237, 0.2);
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
    background: var(--bg);
    border: 1px solid var(--border);
    border-radius: 10px;
    padding: 12px;
    color: var(--text);
    font-family: Inter, system-ui, sans-serif;
    font-size: 14px;
    width: 100%;
    margin-top: 6px;
    margin-bottom: 10px;
  }
  .editor-box:focus, input:focus, textarea:focus, select:focus { outline: none; box-shadow: 0 0 8px rgba(124, 58, 237, 0.3); }

  .preview-box { background: var(--panel); border: 1px solid var(--border); border-radius: 10px; padding: 12px; min-height: 120px; overflow: auto; white-space: pre-wrap; word-break: break-word; }

  button { appearance: none; border: 1px solid var(--border); background: var(--accent); color: var(--text); padding: 8px 14px; border-radius: 8px; cursor: pointer; font-size: 14px; font-weight: 500; transition: 0.2s; margin-top: 8px; }
  button:hover { opacity: 0.85; transform: translateY(-1px); }
  button.secondary { background: var(--panel-2); }
  button:disabled { opacity: 0.4; cursor: not-allowed; transform: none; }

  .nav-buttons { display: flex; gap: 12px; margin-top: 24px; justify-content: space-between; }

  .exercise { background: var(--hover-bg); border-left: 3px solid var(--accent); padding: 12px; border-radius: 6px; margin: 8px 0; }

  .nav { display: flex; gap: 8px; flex-wrap: wrap; margin: 10px 0 14px; }
  .nav button {
    background: var(--panel);
    color: var(--text);
    border: 1px solid var(--border);
    padding: 10px 14px;
    border-radius: 12px;
    cursor: pointer;
    font-weight: 800;
    transition: all 0.25s ease;
    margin-top: 0;
  }
  .nav button.active { background: var(--accent); box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.2); }

  .hidden { display: none; }
  .note { font-size: 12px; color: var(--muted); }

  .recap { display: grid; gap: 12px; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); align-items: stretch; }
  .recap-block { border: 1px solid var(--border); border-radius: 12px; background: var(--panel); padding: 14px; display: flex; flex-direction: column; gap: 8px; }
  .recap-title { font-weight: 800; color: var(--text); }
  .recap-list { display: grid; gap: 8px; margin-top: 6px; }
  .recap-row { display: grid; grid-template-columns: max-content 1fr; gap: 10px; align-items: start; }
  .recap-key { color: var(--muted); word-break: break-word; }
  .recap-val { color: var(--text); min-width: 0; }
  .recap-val code { background: var(--panel-2); color: var(--text); border-radius: 6px; padding: 2px 6px; font-size: 12px; word-break: break-word; }

  .block-desc {
    background: linear-gradient(90deg, rgba(96, 165, 250, 0.1), rgba(167, 139, 250, 0.1));
    border-left: 3px solid var(--accent);
    padding: 8px 12px;
    border-radius: 8px;
    color: var(--text);
    font-size: 14px;
    margin: 6px 0 10px;
  }

  /* Quiz styles */
  .quiz-question { margin: 16px 0 8px; }
  .quiz-question-text { font-weight: 700; font-size: 14px; margin-bottom: 8px; color: var(--text); }

  .opt {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 14px;
    margin: 5px 0;
    border: 1px solid var(--border);
    border-radius: 8px;
    cursor: pointer;
    background: var(--panel);
    color: var(--text);
    font-size: 14px;
    transition: all 0.2s ease;
    user-select: none;
  }
  .opt:hover { background: var(--hover-bg); border-color: var(--accent); }
  .opt.sel { background: var(--sel-bg); border-color: var(--accent); }
  .opt.good { background: var(--good-bg); border-color: var(--success); color: var(--success); }
  .opt.bad { background: var(--bad-bg); border-color: var(--error); color: var(--error); }

  .radio-dot {
    display: inline-block;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    border: 2px solid var(--muted);
    flex-shrink: 0;
    transition: all 0.2s ease;
  }
  .opt.sel .radio-dot { background: var(--accent); border-color: var(--accent); }
  .opt.good .radio-dot { background: var(--success); border-color: var(--success); }
  .opt.bad .radio-dot { background: var(--error); border-color: var(--error); }

  /* Company cards */
  .company-card {
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 10px 12px;
    margin: 6px 0;
    background: var(--panel-2);
  }
  .company-card strong { color: #a6c9ff; }
  .pill {
    display: inline-block;
    background: var(--hover-bg);
    border: 1px solid var(--accent);
    color: var(--text);
    border-radius: 12px;
    padding: 1px 8px;
    font-size: 11px;
    margin: 2px 2px 0 0;
  }
  .badge {
    display: inline-block;
    background: var(--panel-2);
    border: 1px solid var(--border);
    color: var(--muted);
    border-radius: 6px;
    padding: 1px 8px;
    font-size: 11px;
    margin-left: 6px;
  }

  label { display: block; font-size: 13px; color: var(--muted); margin-top: 10px; }
  details summary { cursor: pointer; color: var(--muted); font-size: 12px; margin-top: 8px; }
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
      <h2>1 — REST APIs &amp; CRUD with Mock Database</h2>
      <p class="block-desc"><strong>What this shows:</strong> Experiment with a live mock REST API. Send POST, GET, PUT, DELETE requests to create, read, update, and remove company records.</p>

      <div class="nav" style="margin-bottom: 16px;">
        <button class="active" onclick="setApiTab(event, 'POST /api/companies')">POST (Create)</button>
        <button onclick="setApiTab(event, 'GET /api/companies')">GET (Read)</button>
        <button onclick="setApiTab(event, 'PUT /api/companies/{id}')">PUT (Update)</button>
        <button onclick="setApiTab(event, 'DELETE /api/companies/{id}')">DELETE (Delete)</button>
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
            <label>Path ID</label>
            <input id="pid" type="number" min="1" placeholder="e.g., 1"/>
          </div>
        </div>
        <div>
          <label>Body (JSON)</label>
          <div id="bodyWrap">
            <textarea id="body" rows="7">{
  "name": "TechCorp",
  "industry": "Software",
  "location": "San Francisco",
  "size": 150,
  "skills": ["Java","Spring"]
}</textarea>
          </div>
        </div>
      </div>

      <div style="display: flex; gap: 8px; flex-wrap: wrap;">
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
      <h2>2 — Query Methods &amp; Company Builder</h2>
      <p class="block-desc"><strong>What this shows:</strong> Practice Spring Data JPA derived queries, and build company records with sample data.</p>
      <div class="grid">
        <div>
          <h3>Derived Query Practice</h3>
          <p style="font-size: 13px; color: var(--muted);">Write a method to find companies with size &gt; minSize:</p>
          <input id="kataIn" placeholder="List&lt;Company&gt; findBySizeGreaterThan(Integer minSize);"/>
          <button onclick="checkKata()">Check Answer</button>
          <div id="kataMsg" style="margin: 8px 0; font-size: 13px;"></div>
          <details>
            <summary>Show Hint</summary>
            <p class="note" style="margin-top: 6px;">Use Spring Data naming: <code>findBy&lt;Field&gt;GreaterThan(param)</code></p>
          </details>
        </div>
        <div>
          <h3>Company Builder</h3>
          <label>Company Name</label>
          <input id="bName" placeholder="e.g. TechCorp"/>
          <label>Industry</label>
          <select id="bInd">
            <option>Software</option>
            <option>AI</option>
            <option>Healthcare</option>
            <option>Finance</option>
          </select>
          <label>Location</label>
          <input id="bLoc" placeholder="e.g. San Diego"/>
          <label>Size (employees)</label>
          <input id="bSize" type="number" placeholder="e.g. 150" min="1"/>
          <label>Skills (comma separated)</label>
          <input id="bSkills" placeholder="e.g. Java, Spring, AWS"/>
          <div style="display: flex; gap: 8px; flex-wrap: wrap;">
            <button onclick="cheatFill()">Cheat Fill</button>
            <button onclick="builderAdd()">Add Company</button>
          </div>
          <pre id="bOut" class="preview-box" style="min-height: 80px; font-size: 12px; margin-top: 10px;"></pre>
        </div>
      </div>
    </div>
  </div>

  <!-- Step 3: Search & Filtering -->
  <div class="section" id="step3">
    <div class="card">
      <h2>3 — Search &amp; Data Filtering</h2>
      <p class="block-desc"><strong>What this shows:</strong> Build query filters using derived queries, JPQL, and Specifications.</p>
      <h3>Query Builder</h3>
      <div class="grid">
        <div class="card">
          <label><input type="checkbox" id="qLoc" onchange="enableFilters()"/> Filter by Location</label>
          <input id="vLoc" placeholder="e.g., NYC" disabled/>
          <label><input type="checkbox" id="qInd" onchange="enableFilters()"/> Filter by Industry</label>
          <select id="vInd" disabled>
            <option>Tech</option>
            <option>Finance</option>
            <option>Healthcare</option>
          </select>
          <label><input type="checkbox" id="qSize" onchange="enableFilters()"/> Min Size</label>
          <input id="vSize" type="number" placeholder="e.g., 100" disabled/>
          <label><input type="checkbox" id="qSkill" onchange="enableFilters()"/> Require Skill</label>
          <input id="vSkill" placeholder="e.g., Java" disabled/>
          <button onclick="buildQuery()">Build Query</button>
        </div>
        <div class="card">
          <label>JPQL Generated:</label>
          <pre id="jpqlOut" class="preview-box" style="min-height: 100px; font-size: 12px;">SELECT c FROM Company c</pre>
          <label>Specifications:</label>
          <pre id="specOut" class="preview-box" style="min-height: 100px; font-size: 12px;">Specification.where(null)</pre>
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
          <div class="recap-title">JPQL &amp; Native</div>
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
      <h2>4 — Pagination &amp; Sorting</h2>
      <p class="block-desc"><strong>What this shows:</strong> See how Pageable works with sorting, limiting, and page navigation.</p>
      <div class="grid">
        <div class="card">
          <label>Page (0-indexed)</label>
          <input id="pg" type="number" min="0" value="0"/>
          <label>Size (items per page)</label>
          <input id="sz" type="number" min="1" value="5"/>
          <label>Sort by field</label>
          <select id="sortField">
            <option value="id">id</option>
            <option value="name">name</option>
            <option value="size">size</option>
          </select>
          <label>Sort direction</label>
          <select id="sortDir">
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
          <button onclick="runPaging()">Apply Pagination</button>
        </div>
        <div class="card">
          <pre id="pageOut" class="preview-box" style="min-height: 150px; font-size: 12px;">Click Apply Pagination to see results.</pre>
        </div>
      </div>
      <h3>Pageable Example Code</h3>
      <pre class="preview-box" style="font-size: 12px;">// Repository
Page&lt;Company&gt; findAll(Pageable pageable);

// Service
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

  <!-- Step 5: Scenario Checker & Quiz -->
  <div class="section" id="step5">
    <div class="card">
      <h2>5 — Scenario Checker &amp; Quick Quiz</h2>
      <p class="block-desc"><strong>What this shows:</strong> Real-world scenarios and a quick knowledge check.</p>

      <h3>Capstone Scenario Checker</h3>
      <div class="grid">
        <div class="card">
          <label>Scenario</label>
          <select id="scenarioSel">
            <option value="1">Find companies in NYC with Java skill, sorted by size desc, top 20</option>
            <option value="2">Companies with ANY of {Kubernetes, AWS}, size &gt; 500</option>
            <option value="3">Free-text search: name contains 'Tech', composable filters</option>
          </select>
          <label>Your approach</label>
          <select id="approach">
            <option>Derived Query</option>
            <option>JPQL</option>
            <option>Specifications</option>
            <option>Pageable</option>
            <option>DTO Projection</option>
          </select>
          <button onclick="scoreScenario()">Check Approach</button>
        </div>
        <div class="card">
          <pre id="scenarioOut" class="preview-box" style="min-height: 100px; font-size: 12px;">Select a scenario and approach, then click Check.</pre>
        </div>
      </div>

      <h3>Exit Quiz</h3>
      <div id="qBox"></div>
      <div style="display: flex; gap: 8px; align-items: center; margin-top: 12px; flex-wrap: wrap;">
        <button onclick="gradeQuiz()">Grade Quiz</button>
        <button onclick="resetQuiz()" class="secondary">Reset Quiz</button>
        <span id="qScore" style="font-size: 14px; color: var(--text);"></span>
      </div>
    </div>
  </div>

  <!-- Step 6: Completion Checklist -->
  <div class="section" id="step6">
    <div class="card">
      <h2>6 — Completion Checklist &amp; Export</h2>
      <p class="block-desc"><strong>What this shows:</strong> Self-assessment and exportable progress.</p>
      <div class="grid">
        <div class="card">
          <h3>Self-Assessment</h3>
          <label><input type="checkbox" class="ck" value="crud"/> I understand CRUD (Create, Read, Update, Delete)</label>
          <label><input type="checkbox" class="ck" value="derived"/> I can write derived query methods</label>
          <label><input type="checkbox" class="ck" value="jpql"/> I can write JPQL with JOINs &amp; filters</label>
          <label><input type="checkbox" class="ck" value="spec"/> I can chain Specifications</label>
          <label><input type="checkbox" class="ck" value="pageable"/> I can use Pageable for sorting &amp; pagination</label>
          <label><input type="checkbox" class="ck" value="dto"/> I know when to use DTOs</label>
          <button onclick="exportNotes()" style="margin-top: 16px;">Export Progress</button>
        </div>
        <div class="card">
          <h3>Notes</h3>
          <textarea id="notes" rows="6" placeholder="Key takeaways, gotchas, next steps..."></textarea>
          <pre id="exportOut" class="preview-box" style="min-height: 120px; font-size: 11px; margin-top: 10px;"></pre>
        </div>
      </div>
    </div>
  </div>

  <!-- Navigation -->
  <div class="nav-buttons">
    <button id="prevBtn" onclick="prevStep()" class="secondary">← Previous</button>
    <div style="display: flex; gap: 8px; align-items: center;">
      <span id="stepIndicator" style="color: var(--muted); font-size: 12px;">Step 1 / 6</span>
      <button id="nextBtn" onclick="nextStep()">Next →</button>
    </div>
  </div>
</div>

<script>
// ============================================================
// CONFIG — Edit data here without touching logic below
// ============================================================

const STEPS = ['step1', 'step2', 'step3', 'step4', 'step5', 'step6'];
const STORAGE_KEY = 'dataviz_combined_v1';

const DEFAULT_DB = [
  { id: 1, name: 'TechNova', industry: 'AI', location: 'San Diego', size: 1200, skills: ['Python', 'TensorFlow'] },
  { id: 2, name: 'HealthBridge', industry: 'Healthcare', location: 'Austin', size: 300, skills: ['Java', 'Spring'] }
];

const CHEAT_NAMES = ['NovaEdge', 'Skyline', 'Quantum', 'BlueHarbor', 'ApexForge'];
const CHEAT_CITIES = ['San Diego', 'Austin', 'Seattle', 'Boston', 'Denver'];
const CHEAT_SKILLS = 'Java, Spring, AWS';

const PAGINATION_SAMPLE = [
  { id: 1,  name: 'Alice Corp',      size: 100 },
  { id: 2,  name: 'Bob Industries',  size: 200 },
  { id: 3,  name: 'Carol Solutions', size: 150 },
  { id: 4,  name: 'Dave Enterprises',size: 300 },
  { id: 5,  name: 'Eve Technologies', size: 120 },
  { id: 6,  name: 'Frank Systems',   size: 250 },
  { id: 7,  name: 'Grace Analytics', size: 180 },
  { id: 8,  name: 'Henry Ventures',  size: 220 },
  { id: 9,  name: 'Ivy Labs',        size: 90  },
  { id: 10, name: 'Jack Dynamics',   size: 280 }
];

const SCENARIOS = {
  '1': {
    best: ['Specifications', 'Pageable', 'DTO Projection'],
    reason: 'This needs filtering (Specifications), pagination/sorting (Pageable), and optimized output (DTO Projection).'
  },
  '2': {
    best: ['JPQL', 'Specifications'],
    reason: 'ANY-of collection checks and size comparisons work well with JPQL MEMBER OF or Specifications.'
  },
  '3': {
    best: ['Specifications'],
    reason: 'Composable, optional free-text filters are exactly what Specifications are designed for.'
  }
};

const QUIZ_DATA = [
  {
    q: 'Which approach is best for optional, composable filters?',
    opts: ['Derived Query', 'JPQL', 'Specifications', 'Native SQL'],
    a: 2,
    explanation: 'Specifications let you chain optional filters with .and() and .or() — perfect for dynamic queries.'
  },
  {
    q: 'What does returning DTOs (Data Transfer Objects) improve?',
    opts: ['Security only', 'Performance by reducing payload size', 'Authentication speed', 'Transaction handling'],
    a: 1,
    explanation: 'DTOs let you return only the fields the client needs, reducing response size and improving performance.'
  },
  {
    q: 'To sort and limit results in Spring Data, you use…',
    opts: ['Specifications', 'Pageable with PageRequest', '@Transactional', 'JOIN FETCH'],
    a: 1,
    explanation: 'PageRequest.of(page, size, Sort.by(...)) gives full control over pagination and sorting.'
  },
  {
    q: 'In JPQL, what does MEMBER OF check?',
    opts: ['Whether a field is null', 'If an item exists in a collection field', 'The sort order of results', 'User permission levels'],
    a: 1,
    explanation: 'MEMBER OF checks if a value is inside a collection, e.g. :skill MEMBER OF c.skills.'
  }
];

// ============================================================
// State
// ============================================================
let currentStep = 0;
let db = JSON.parse(JSON.stringify(DEFAULT_DB));
let nextId = DEFAULT_DB.length + 1;
const picks = {};

// ============================================================
// Helpers
// ============================================================
const $ = id => document.getElementById(id);
const pickRandom = arr => arr[Math.floor(Math.random() * arr.length)];

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// ============================================================
// Navigation
// ============================================================
function showStep(n) {
  currentStep = Math.max(0, Math.min(STEPS.length - 1, n));
  STEPS.forEach((s, i) => document.getElementById(s).classList.toggle('active', i === currentStep));

  $('progressBar').innerHTML = STEPS.map((_, i) =>
    `<div class="step ${i <= currentStep ? 'active' : ''}" onclick="showStep(${i})" title="Step ${i + 1}"></div>`
  ).join('');

  $('stepIndicator').textContent = `Step ${currentStep + 1} / ${STEPS.length}`;
  $('prevBtn').disabled = currentStep === 0;
  $('nextBtn').disabled = currentStep === STEPS.length - 1;
  persist();
}

function prevStep() { showStep(currentStep - 1); }
function nextStep() { showStep(currentStep + 1); }

// ============================================================
// Step 1 — API Simulator
// ============================================================
function uiEP() {
  const val = $('ep').value;
  $('pidWrap').classList.toggle('hidden', !val.includes('{id}'));
  $('bodyWrap').classList.toggle('hidden', !(val.startsWith('POST') || val.startsWith('PUT')));
}

function renderList() {
  if (!db.length) {
    $('list').innerHTML = '<p style="color:var(--muted);padding:8px;">No companies in database.</p>';
    return;
  }
  $('list').innerHTML = db.map(c => `
    <div class="company-card">
      <strong>${escapeHtml(c.name)}</strong>
      <span class="badge">${escapeHtml(c.industry)}</span>
      <span style="color:var(--muted);font-size:12px;margin-left:8px;">ID: ${c.id}</span><br/>
      <span style="font-size:13px;color:var(--muted);">${escapeHtml(c.location)} &middot; ${c.size} employees</span><br/>
      <div style="margin-top:4px;">${(c.skills||[]).map(s=>`<span class="pill">${escapeHtml(s)}</span>`).join('')}</div>
    </div>`).join('');
}

function sendApiRequest() {
  const parts = $('ep').value.split(' ');
  const method = parts[0];
  const path = parts[1];
  let res = null;
  const statusEl = $('status');

  try {
    if (method === 'POST' && path === '/api/companies') {
      const body = JSON.parse($('body').value || '{}');
      if (!body.name) throw new Error('"name" field is required');
      const obj = { id: nextId++, name: body.name, industry: body.industry || 'Unknown', location: body.location || 'Unknown', size: Number(body.size) || 0, skills: Array.isArray(body.skills) ? body.skills : [] };
      db.push(obj);
      statusEl.textContent = '201 Created';
      res = obj;

    } else if (method === 'GET' && path === '/api/companies') {
      statusEl.textContent = `200 OK (${db.length} records)`;
      res = db;

    } else if (method === 'GET' && path === '/api/companies/{id}') {
      const id = Number($('pid').value);
      if (!id) throw new Error('Enter a valid numeric ID');
      const found = db.find(x => x.id === id);
      statusEl.textContent = found ? '200 OK' : '404 Not Found';
      res = found || { error: `No company with id ${id}` };

    } else if (method === 'PUT' && path === '/api/companies/{id}') {
      const id = Number($('pid').value);
      if (!id) throw new Error('Enter a valid numeric ID');
      const idx = db.findIndex(x => x.id === id);
      if (idx === -1) { statusEl.textContent = '404 Not Found'; res = { error: `No company with id ${id}` }; }
      else {
        const body = JSON.parse($('body').value || '{}');
        db[idx] = { ...db[idx], ...body, id };
        statusEl.textContent = '200 OK';
        res = db[idx];
      }

    } else if (method === 'DELETE' && path === '/api/companies/{id}') {
      const id = Number($('pid').value);
      if (!id) throw new Error('Enter a valid numeric ID');
      const before = db.length;
      db = db.filter(x => x.id !== id);
      statusEl.textContent = db.length < before ? '204 No Content' : '404 Not Found';
      res = db.length < before ? { message: `Company ${id} deleted` } : { error: `No company with id ${id}` };
    }
  } catch (err) {
    statusEl.textContent = '400 Bad Request';
    res = { error: err.message };
  }

  $('out').textContent = JSON.stringify(res, null, 2);
  renderList();
}

function resetDb() {
  db = JSON.parse(JSON.stringify(DEFAULT_DB));
  nextId = DEFAULT_DB.length + 1;
  $('status').textContent = 'DB reset — 200 OK';
  $('out').textContent = 'Database reset to default entries.';
  renderList();
}

function setApiTab(event, endpoint) {
  document.querySelectorAll('.nav button').forEach(b => b.classList.remove('active'));
  event.target.classList.add('active');
  $('ep').value = endpoint;
  uiEP();
}

// ============================================================
// Step 2 — Kata & Builder
// ============================================================
function checkKata() {
  const v = ($('kataIn').value || '').trim().replace(/\s+/g, ' ');
  const ok = /^List\s*<\s*Company\s*>\s*findBySizeGreaterThan\s*\(\s*(Integer|int)\s+\w+\s*\)\s*;?\s*$/i.test(v);
  const msg = $('kataMsg');
  msg.textContent = ok
    ? '✅ Correct! findBySizeGreaterThan follows Spring Data naming conventions.'
    : '❌ Not quite. Try: List<Company> findBySizeGreaterThan(Integer minSize);';
  msg.style.color = ok ? 'var(--success)' : 'var(--error)';
}

function cheatFill() {
  $('bName').value = pickRandom(CHEAT_NAMES) + ' Inc';
  $('bLoc').value = pickRandom(CHEAT_CITIES);
  $('bSize').value = Math.floor(Math.random() * 1800) + 20;
  $('bSkills').value = CHEAT_SKILLS;
}

function builderAdd() {
  const name = ($('bName').value || '').trim();
  if (!name) { alert('Please enter a company name.'); return; }
  const obj = {
    id: nextId++,
    name,
    industry: $('bInd').value,
    location: ($('bLoc').value || 'Unknown').trim(),
    size: Math.max(0, Number($('bSize').value) || 0),
    skills: ($('bSkills').value || '').split(',').map(s => s.trim()).filter(Boolean)
  };
  db.push(obj);
  $('bOut').textContent = '✅ Company added:\n' + JSON.stringify(obj, null, 2);
  renderList();
}

// ============================================================
// Step 3 — Query Builder
// ============================================================
function enableFilters() {
  [['qLoc','vLoc'],['qInd','vInd'],['qSize','vSize'],['qSkill','vSkill']].forEach(([cId, iId]) => {
    $(iId).disabled = !$(cId).checked;
    if (!$(cId).checked) $(iId).value = '';
  });
}

function buildQuery() {
  const parts = [], spec = [];
  if ($('qLoc').checked && $('vLoc').value.trim()) {
    parts.push('c.location = :location');
    spec.push(`hasLocation("${$('vLoc').value.trim()}")`);
  }
  if ($('qInd').checked) {
    parts.push('c.industry = :industry');
    spec.push(`hasIndustry("${$('vInd').value}")`);
  }
  if ($('qSize').checked && $('vSize').value) {
    parts.push('c.size >= :minSize');
    spec.push(`hasMinSize(${$('vSize').value})`);
  }
  if ($('qSkill').checked && $('vSkill').value.trim()) {
    parts.push(':skill MEMBER OF c.skills');
    spec.push(`hasSkill("${$('vSkill').value.trim()}")`);
  }

  $('jpqlOut').textContent = parts.length
    ? `SELECT c FROM Company c\nWHERE ${parts.join('\n  AND ')}`
    : 'SELECT c FROM Company c';

  $('specOut').textContent = spec.length
    ? `Specification.where(${spec[0]})` + spec.slice(1).map(x => `\n  .and(${x})`).join('')
    : 'Specification.where(null)';
}

// ============================================================
// Step 4 — Pagination
// ============================================================
function runPaging() {
  let page = Math.max(0, parseInt($('pg').value) || 0);
  let size = Math.max(1, parseInt($('sz').value) || 5);
  const field = $('sortField').value;
  const dir = $('sortDir').value;

  let data = [...PAGINATION_SAMPLE].sort((a, b) => {
    const av = a[field], bv = b[field];
    const cmp = typeof av === 'string' ? av.localeCompare(bv) : av - bv;
    return dir === 'desc' ? -cmp : cmp;
  });

  const total = data.length;
  const totalPages = Math.ceil(total / size);
  page = Math.min(page, totalPages - 1);
  const start = page * size;
  const rows = data.slice(start, start + size);

  $('pageOut').textContent =
    `Page: ${page}  |  Size: ${size}  |  Sort: ${field} ${dir}\n` +
    `Total: ${total} records  |  Total pages: ${totalPages}\n` +
    `Showing ${start + 1}–${Math.min(start + size, total)}\n\n` +
    rows.map(r => `  [${r.id}] ${r.name} — ${r.size} employees`).join('\n');
}

// ============================================================
// Step 5 — Scenario Checker
// ============================================================
function scoreScenario() {
  const sel = $('scenarioSel').value;
  const chosen = $('approach').value;
  const scenario = SCENARIOS[sel];
  if (!scenario) return;
  const good = scenario.best.includes(chosen);
  $('scenarioOut').textContent = good
    ? `✅ Good choice — "${chosen}" works well here.\n\n${scenario.reason}`
    : `❌ Not the best fit for this scenario.\n\nPrefer: ${scenario.best.join(' or ')}\n\n${scenario.reason}`;
}

// ============================================================
// Step 5 — Quiz
// ============================================================
function renderQuiz() {
  const box = $('qBox');
  box.innerHTML = '';

  if (!QUIZ_DATA || QUIZ_DATA.length === 0) {
    box.innerHTML = '<p style="color:var(--muted);">No quiz questions available.</p>';
    return;
  }

  QUIZ_DATA.forEach((item, i) => {
    if (!item.q || !Array.isArray(item.opts) || item.opts.length < 2) return;

    const wrap = document.createElement('div');
    wrap.className = 'quiz-question';

    const qText = document.createElement('div');
    qText.className = 'quiz-question-text';
    qText.textContent = `Q${i + 1}. ${item.q}`;
    wrap.appendChild(qText);

    item.opts.forEach((optText, oi) => {
      const el = document.createElement('div');
      el.className = 'opt';
      el.dataset.i = i;
      el.dataset.oi = oi;

      const dot = document.createElement('span');
      dot.className = 'radio-dot';

      const lbl = document.createElement('span');
      lbl.textContent = optText;

      el.appendChild(dot);
      el.appendChild(lbl);

      el.addEventListener('click', () => {
        picks[i] = oi;
        box.querySelectorAll(`.opt[data-i="${i}"]`).forEach(x => x.classList.remove('sel', 'good', 'bad'));
        el.classList.add('sel');
      });

      wrap.appendChild(el);
    });

    box.appendChild(wrap);
  });
}

function gradeQuiz() {
  let correct = 0;
  let unanswered = 0;

  document.querySelectorAll('.opt').forEach(el => el.classList.remove('good', 'bad'));

  QUIZ_DATA.forEach((item, i) => {
    const chosen = picks[i];
    if (chosen === undefined) { unanswered++; return; }

    const isCorrect = chosen === item.a;
    if (isCorrect) correct++;

    const chosenEl = document.querySelector(`.opt[data-i="${i}"][data-oi="${chosen}"]`);
    if (chosenEl) chosenEl.classList.add(isCorrect ? 'good' : 'bad');

    if (!isCorrect) {
      const correctEl = document.querySelector(`.opt[data-i="${i}"][data-oi="${item.a}"]`);
      if (correctEl) correctEl.classList.add('good');
    }
  });

  const total = QUIZ_DATA.length;
  let msg = `Score: ${correct} / ${total}`;
  if (unanswered > 0) msg += `  (${unanswered} unanswered)`;
  if (correct === total && unanswered === 0) msg += '  🎉 Perfect!';
  else if (correct >= Math.ceil(total * 0.75) && unanswered === 0) msg += '  👍 Great work!';
  $('qScore').textContent = msg;
}

function resetQuiz() {
  Object.keys(picks).forEach(k => delete picks[k]);
  $('qScore').textContent = '';
  renderQuiz();
}

// ============================================================
// Step 6 — Export
// ============================================================
function exportNotes() {
  const mastery = [...document.querySelectorAll('.ck')].filter(x => x.checked).map(x => x.value);
  $('exportOut').textContent = JSON.stringify({
    exported_at: new Date().toISOString(),
    mastery_checklist: mastery,
    jpql_query: $('jpqlOut').textContent,
    specifications: $('specOut').textContent,
    pagination_result: $('pageOut').textContent,
    notes: $('notes').value
  }, null, 2);
}

// ============================================================
// Persistence
// ============================================================
function persist() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify({ step: currentStep, notes: $('notes').value })); } catch(e) {}
}

function restore() {
  try {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (!data) { showStep(0); return; }
    if (data.notes) $('notes').value = data.notes;
    showStep(data.step || 0);
  } catch(e) { showStep(0); }
}

// ============================================================
// Boot
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
  uiEP();
  renderList();
  renderQuiz();
  enableFilters();
  restore();
});
</script>

<script>
(function(){
  document.addEventListener('DOMContentLoaded', function(){
    document.querySelectorAll('a.back-btn').forEach(function(a){
      a.addEventListener('click', function(e){
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.button === 1) return;
        e.preventDefault();
        try {
          if (document.referrer && new URL(document.referrer).origin === location.origin) { history.back(); return; }
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