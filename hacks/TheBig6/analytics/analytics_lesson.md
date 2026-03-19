---
# ============================================================
# FRONT MATTER — Jekyll reads this block before rendering the page.
# Keys here control layout, metadata, and how the site indexes
# this page.  The "defaults" approach (see _config.yml note at
# the bottom of this file) means you usually DON'T need to repeat
# layout/team/categories on every new lesson — they're inherited.
# ============================================================
layout: cs-bigsix-lesson          # which Jekyll layout template to use
title: "Analytics — All-in-One Interactive Lesson"
description: "A multi-step interactive lesson covering the admin dashboard, certificates, and mastery questions."
permalink: /bigsix/analytics_lesson
parent: "bigsix"
lesson_number: 6
team: "Curators"
categories: [CSP, Analytics, Interactive]
tags: [analytics, admin, interactive]
author: "Curators Team"
date: 2025-12-02
---

<!--
  ============================================================
  NOTE — To make layout/team/categories the DEFAULT for ALL
  Curators lessons without repeating them in every file, add
  this block to your Jekyll _config.yml:

    defaults:
      - scope:
          path: ""
          type: "pages"
        values:
          layout: cs-bigsix-lesson
          team: "Curators"
          categories: [CSP, Interactive]

  After that, a new lesson only needs title, description,
  permalink, lesson_number, and tags in its front matter.
  ============================================================
-->

<!-- ============================================================
     STYLESHEET — All colors are CSS custom properties (variables)
     so the entire theme can be changed from one place (:root {}).
     ============================================================ -->
<style>
  /* ---- Design tokens: change these to retheme the whole page ---- */
  :root {
    --bg:      #0a0e27;           /* page background */
    --panel:   #0f1729;           /* card / widget background */
    --border:  rgba(255,255,255,0.08);
    --text:    #e6eef8;           /* primary text */
    --muted:   #9aa6bf;           /* secondary / label text */
    --accent:  #7c3aed;           /* purple brand color */
    --accent2: #9f7aea;           /* lighter purple for gradients */
    --success: #22c55e;           /* green used in cert card */
    --danger:  #ef4444;           /* error red */
  }

  /* ---- Reset & base ---- */
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: var(--bg); color: var(--text); font-family: system-ui, sans-serif; }

  /* ---- Page shell ---- */
  .container { max-width: 1200px; margin: 0 auto; padding: 24px 16px 40px; }
  .header    { margin-bottom: 32px; }
  .header h1 { font-size: 28px; font-weight: 800; margin-bottom: 4px; }
  .header p  { color: var(--muted); font-size: 14px; }

  /* ---- Step progress bar ---- */
  /* Each colored segment represents one lesson step */
  .progress-bar           { display: flex; gap: 8px; margin: 20px 0; align-items: center; }
  .progress-bar .step     { flex: 1; height: 4px; background: rgba(255,255,255,0.1); border-radius: 2px; cursor: pointer; transition: 0.2s; }
  .progress-bar .step.active { background: var(--accent); height: 6px; }

  /* ---- Sections: only the active one is visible ---- */
  .section        { display: none; }
  .section.active { display: block; }

  /* ---- Card (content panel) ---- */
  .card    { background: var(--panel); border: 1px solid var(--border); border-radius: 12px; padding: 20px; margin-bottom: 16px; }
  .card h2 { margin-bottom: 12px; font-size: 20px; color: #a6c9ff; }

  /* ---- Prev / Next navigation ---- */
  .nav-buttons { display: flex; gap: 12px; margin-top: 24px; justify-content: space-between; }
  button            { appearance: none; border: 1px solid var(--border); background: var(--accent); color: #fff; padding: 8px 14px; border-radius: 8px; cursor: pointer; font-size: 14px; font-weight: 500; transition: 0.2s; }
  button:hover      { background: #6d28d9; transform: translateY(-1px); }
  button.secondary  { background: #334155; color: #fff; }
  button.secondary:hover { background: #1e293b; }
  button:disabled   { opacity: 0.4; cursor: not-allowed; transform: none; }

  /* ---- Metrics grid (3 KPI cards side-by-side) ---- */
  .metrics-grid  { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 16px; margin-bottom: 20px; }
  .metric-card   { background: #051226; border: 1px solid var(--border); border-radius: 10px; padding: 16px; }
  .metric-title  { font-size: 12px; color: var(--muted); text-transform: uppercase; letter-spacing: 0.05em; }
  .metric-value  { font-size: 32px; font-weight: 800; color: var(--accent); margin: 8px 0 4px; }
  .metric-subtitle { font-size: 12px; color: var(--muted); }

  /* ---- Toolbar above the table ---- */
  .toolbar       { display: flex; align-items: center; justify-content: space-between; background: #051226; border: 1px solid var(--border); border-radius: 8px 8px 0 0; padding: 12px 16px; }
  .toolbar-title { font-weight: 700; color: var(--accent); }
  .download-btn  { background: var(--accent); }

  /* ---- Sortable gradebook table ---- */
  .table-container { background: #051226; border: 1px solid var(--border); border-top: none; border-radius: 0 0 8px 8px; overflow-x: auto; }
  table            { width: 100%; border-collapse: collapse; font-size: 14px; }
  thead            { border-bottom: 2px solid var(--accent); }
  th               { padding: 10px 16px; text-align: left; color: var(--accent); font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em; cursor: pointer; user-select: none; }
  th:hover         { background: rgba(124,58,237,0.1); }
  /* Sort-direction arrow rendered via ::after pseudo-element */
  th[data-sort]::after { content: " ↕"; font-size: 10px; opacity: 0.5; }
  th[data-sort="asc"]::after  { content: " ↑"; opacity: 1; }
  th[data-sort="desc"]::after { content: " ↓"; opacity: 1; }
  td               { padding: 10px 16px; border-bottom: 1px solid var(--border); }
  tr:last-child td { border-bottom: none; }
  tr:hover td      { background: rgba(255,255,255,0.03); }
  .student-name    { font-weight: 600; color: var(--accent); }
  td.center        { text-align: center; }

  /* ---- Progress bar inside table cells ---- */
  .bar-wrap  { display: flex; align-items: center; gap: 8px; }
  .bar-track { flex: 1; height: 6px; background: rgba(255,255,255,0.08); border-radius: 3px; }
  .bar-fill  { height: 100%; border-radius: 3px; background: linear-gradient(90deg, var(--accent) 0%, var(--accent2) 100%); transition: width 0.4s ease; }
  .bar-label { font-size: 12px; min-width: 36px; text-align: right; }

  /* ---- Expandable detail row ---- */
  .detail-row    { border-top: 1px solid var(--accent); background: rgba(124,58,237,0.05); }
  .detail-header { font-weight: 700; color: var(--accent); margin-bottom: 8px; }
  .modules-list  { display: flex; flex-wrap: wrap; gap: 8px; }
  .module-chip   { background: rgba(124,58,237,0.15); border: 1px solid var(--accent); border-radius: 20px; padding: 4px 12px; font-size: 12px; }

  /* ---- Certificate card ---- */
  .cert-card     { background: #051226; border: 1px solid var(--border); border-radius: 12px; padding: 24px; max-width: 400px; }
  .cert-badge    { display: inline-block; background: var(--success); color: #fff; font-size: 11px; font-weight: 700; padding: 2px 8px; border-radius: 20px; margin-bottom: 12px; }
  .cert-title    { font-size: 20px; font-weight: 800; color: var(--accent); margin-bottom: 4px; }
  .cert-org      { font-size: 13px; color: var(--muted); }
  .cert-date     { font-size: 12px; color: var(--muted); margin: 8px 0 16px; }
  .cert-actions  { display: flex; gap: 10px; }
  .btn-share     { background: #0077b5; }   /* LinkedIn blue */
  .btn-share:hover { background: #005f91; }

  /* ---- FRQ (free response) box ---- */
  .frq-box      { border: 1px solid #2c2c2e; padding: 1rem; border-radius: 8px; margin: 1.5rem 0; background: #1c1c1e; color: #e5e5ea; font-weight: 300; }
  .frq-box textarea { width: 100%; border-radius: 6px; border: 1px solid #3a3a3c; padding: 0.5rem; margin-top: 0.5rem; background: #2c2c2e; color: #f2f2f7; resize: vertical; }
  #frq-feedback { margin-top: 12px; line-height: 1.6; }

  /* ---- Loading / empty state ---- */
  .loading { color: var(--muted); font-style: italic; padding: 20px 0; }
</style>

<!-- ============================================================
     HTML STRUCTURE
     The page is split into three <section> divs (#step1-3).
     JavaScript shows only the active one and updates the
     progress bar + navigation buttons accordingly.
     ============================================================ -->
<div class="container page-content">

  <!-- Page header + back link -->
  <div class="header">
    <h1>Analytics — All-in-One</h1>
    <p>Interactive lesson covering the admin dashboard, certificates, and mastery questions.</p>
    <a href="../" class="button back-btn">Back</a>
  </div>

  <!-- Progress indicator: rendered dynamically by JS -->
  <div class="progress-bar" id="progressBar"></div>

  <!-- ======================================================
       STEP 1 — Admin Analytics Dashboard
       Fetches real student data from the backend API,
       computes summary metrics, and renders a sortable table.
       ====================================================== -->
  <div class="section active" id="step1">
    <div class="card">
      <h2>1 — Admin Analytics Dashboard</h2>
      <p>This dashboard provides a comprehensive overview of student performance. View real-time metrics, sort the interactive gradebook, and expand any row to see per-module progress.</p>

      <!-- KPI cards — values injected by JS after the API responds -->
      <div class="metrics-grid">
        <div class="metric-card">
          <div class="metric-title">Class Average</div>
          <div class="metric-value" id="class-average">—</div>
          <div class="metric-subtitle" id="students-enrolled">loading…</div>
        </div>
        <div class="metric-card">
          <div class="metric-title">Modules Completed</div>
          <div class="metric-value" id="modules-completed">—</div>
          <div class="metric-subtitle">Out of 25 total</div>
        </div>
        <div class="metric-card">
          <div class="metric-title">Top Performer</div>
          <div class="metric-value" id="top-grade">—</div>
          <div class="metric-subtitle" id="top-scorer">—</div>
        </div>
      </div>

      <!-- Toolbar: title on the left, export button on the right -->
      <div class="toolbar">
        <span class="toolbar-title">Class Gradebook</span>
        <button class="download-btn" id="exportBtn">Export Report</button>
      </div>

      <!-- Table: <thead> is static; <tbody> is filled by JS -->
      <div class="table-container">
        <table id="gradebook">
          <thead>
            <tr>
              <!-- data-key matches the property name in studentData[] -->
              <th data-key="name">Student Name</th>
              <th data-key="overall" class="center">Overall</th>
              <th data-key="modules" class="center">Modules</th>
            </tr>
          </thead>
          <tbody id="tableBody">
            <tr><td colspan="3" class="loading">Loading gradebook…</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>

  <!-- ======================================================
       STEP 2 — Certificates & Badges
       Fetches the logged-in user's name from the API and
       generates a downloadable PNG certificate via <canvas>.
       ====================================================== -->
  <div class="section" id="step2">
    <div class="card">
      <h2>2 — Certificates and Badges</h2>
      <p>Claim your certificates for completed modules. Download as a high-quality image or share directly to LinkedIn.</p>
      <div class="cert-card">
        <span class="cert-badge">Verified</span>
        <div class="cert-title">CS Portfolio Certificate</div>
        <div class="cert-org">Open Coding Society</div>
        <div class="cert-date" id="certDate">—</div>
        <div class="cert-actions">
          <button class="btn-download" id="btnDownload">⬇ Download</button>
          <button class="btn-share"    id="btnLinkedIn">Add to LinkedIn</button>
        </div>
      </div>
      <!-- Hidden canvas used only for rendering the certificate PNG -->
      <canvas id="certCanvas" style="display:none;"></canvas>
    </div>
  </div>

  <!-- ======================================================
       STEP 3 — Free Response Question (FRQ)
       Sends the student's answer to a grading endpoint and
       displays AI-generated feedback inline.
       ====================================================== -->
  <div class="section" id="step3">
    <div class="card">
      <h2>3 — Free Response Question</h2>
      <p>Submit a response below. Your answer will be graded by an AI assistant.</p>
      <div class="frq-box">
        <b>FRQ:</b>
        <span id="frq-question">Describe what analytics or metrics you aim to collect and how you'll present them.</span>
        <br><br>
        <textarea id="frq-answer" rows="5" placeholder="Type your response here…"></textarea>
        <br>
        <button id="frq-grade-btn" style="margin-top:10px;">Grade</button>
        <div id="frq-feedback"></div>
      </div>
    </div>
  </div>

  <!-- Prev / Next navigation + step counter -->
  <div class="nav-buttons">
    <button id="prevBtn" class="secondary" onclick="prevStep()">← Previous</button>
    <div style="display:flex; gap:8px; align-items:center;">
      <span id="stepIndicator" style="color:var(--muted); font-size:12px;"></span>
      <button id="nextBtn" onclick="nextStep()">Next →</button>
    </div>
  </div>

</div><!-- /.container -->

<!-- ============================================================
     MAIN SCRIPT (ES module so we can use import statements)
     ============================================================ -->
<script type="module">

// ── Imports ──────────────────────────────────────────────────
// These config helpers centralise the API base URLs and default
// fetch options (credentials, CORS mode, etc.) so every fetch
// call doesn't need to repeat them.
import { javaURI, pythonURI, fetchOptions } from '{{ site.baseurl }}/assets/js/api/config.js';

// ── Constants ─────────────────────────────────────────────────
const STORAGE_KEY = 'analytics_combined_v1';   // localStorage key
const TOTAL_MODULES = 25;                       // displayed in KPI card

// ============================================================
//  SECTION 1 — STEP / NAVIGATION
//  currentStep tracks which section (0-indexed) is visible.
//  showStep() is the single source of truth for UI state.
// ============================================================

let currentStep = 0;
const STEPS = ['step1', 'step2', 'step3'];   // maps index → element id

/**
 * Show a specific step by index.
 * - Hides all sections, then shows the target.
 * - Re-renders the progress bar with correct active states.
 * - Enables / disables prev/next buttons at the boundaries.
 * - Persists state to localStorage so a page reload restores position.
 */
function showStep(n) {
  // Clamp n to valid range [0, STEPS.length - 1]
  currentStep = Math.max(0, Math.min(STEPS.length - 1, n));

  // Toggle visibility of each section
  STEPS.forEach((id, i) =>
    document.getElementById(id).classList.toggle('active', i === currentStep)
  );

  // Rebuild progress bar segments
  const bar = document.getElementById('progressBar');
  bar.innerHTML = STEPS.map((_, i) =>
    `<div class="step ${i <= currentStep ? 'active' : ''}"
          onclick="showStep(${i})"
          title="Go to step ${i + 1}"></div>`
  ).join('');

  // Update "Step X / Y" counter
  document.getElementById('stepIndicator').textContent =
    `Step ${currentStep + 1} / ${STEPS.length}`;

  // Disable buttons at boundaries so users can't go out-of-range
  document.getElementById('prevBtn').disabled = currentStep === 0;
  document.getElementById('nextBtn').disabled = currentStep === STEPS.length - 1;

  persist();  // save position
}

// Expose to inline onclick attributes in the HTML
window.showStep = showStep;
function prevStep() { showStep(currentStep - 1); }
function nextStep() { showStep(currentStep + 1); }
window.prevStep = prevStep;
window.nextStep = nextStep;


// ============================================================
//  SECTION 2 — ANALYTICS DASHBOARD
//  Fetches student data from the Java backend, computes summary
//  metrics dynamically, and builds a sortable, expandable table.
// ============================================================

// Sort state: which column and which direction
let sortKey = 'name';
let sortDir = 'asc';   // 'asc' | 'desc'

// Holds the raw data from the API so we can re-sort without re-fetching
let studentData = [];

/**
 * Fetch student grade data from the API.
 * Falls back to mock data if the endpoint is unavailable
 * (useful when developing locally without a running backend).
 */
async function loadAnalytics() {
  try {
    const res = await fetch(`${javaURI}/api/analytics/students`, fetchOptions);

    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    // Expected shape: [{ id, name, overall, modulesCompleted, moduleScores: {...} }, ...]
    studentData = await res.json();
  } catch (err) {
    console.warn('Analytics API unavailable, using mock data:', err.message);

    // ── Mock data (replace with real API when backend is ready) ──
    // Each entry represents one student record returned by the server.
    studentData = [
      { id: 1, name: 'Priya Patel',   overall: 96, modulesCompleted: 6,
        moduleScores: { Frontend: 98, Backend: 94, DataViz: 96, Security: 95, Analytics: 97, AI: 100 } },
      { id: 2, name: 'John Doe',      overall: 88, modulesCompleted: 5,
        moduleScores: { Frontend: 90, Backend: 85, DataViz: 88, Security: 87, Analytics: 90 } },
      { id: 3, name: 'Maria Garcia',  overall: 74, modulesCompleted: 4,
        moduleScores: { Frontend: 78, Backend: 70, DataViz: 76, Security: 72 } },
      { id: 4, name: 'Sam Lee',       overall: 91, modulesCompleted: 5,
        moduleScores: { Frontend: 93, Backend: 89, DataViz: 91, Security: 90, Analytics: 92 } },
    ];
  }

  renderDashboard();
}

/**
 * Compute summary KPIs from studentData and render the table.
 * Called after every load or re-sort.
 */
function renderDashboard() {
  if (!studentData.length) return;

  // ── Compute metrics ──────────────────────────────────────
  const count   = studentData.length;
  const avg     = Math.round(studentData.reduce((s, r) => s + r.overall, 0) / count);
  const avgMods = (studentData.reduce((s, r) => s + r.modulesCompleted, 0) / count).toFixed(1);
  const top     = studentData.reduce((a, b) => a.overall >= b.overall ? a : b);

  // ── Update KPI cards ─────────────────────────────────────
  document.getElementById('class-average').textContent    = `${avg}%`;
  document.getElementById('students-enrolled').textContent = `${count} students enrolled`;
  document.getElementById('modules-completed').textContent = avgMods;
  document.getElementById('top-grade').textContent        = `${top.overall}%`;
  document.getElementById('top-scorer').textContent       = top.name;

  // ── Render sortable table ─────────────────────────────────
  renderTable();

  // ── Wire up column header sort clicks ────────────────────
  document.querySelectorAll('#gradebook thead th[data-key]').forEach(th => {
    // Remove old listener by replacing node (simple pattern for small tables)
    const fresh = th.cloneNode(true);
    th.replaceWith(fresh);
    fresh.addEventListener('click', () => {
      const key = fresh.dataset.key;
      // Toggle direction if same column clicked again
      sortDir = (sortKey === key && sortDir === 'asc') ? 'desc' : 'asc';
      sortKey = key;
      renderTable();
    });
  });
}

/**
 * Sort studentData and rebuild <tbody> rows.
 * Also updates column header arrows to show sort direction.
 */
function renderTable() {
  // ── Sort in-place ─────────────────────────────────────────
  const sorted = [...studentData].sort((a, b) => {
    const va = a[sortKey] ?? '';
    const vb = b[sortKey] ?? '';
    if (typeof va === 'string') return sortDir === 'asc'
      ? va.localeCompare(vb)
      : vb.localeCompare(va);
    return sortDir === 'asc' ? va - vb : vb - va;
  });

  // ── Update sort-direction arrows on column headers ────────
  document.querySelectorAll('#gradebook thead th[data-key]').forEach(th => {
    delete th.dataset.sort;
    if (th.dataset.key === sortKey) th.dataset.sort = sortDir;
  });

  // ── Build rows ────────────────────────────────────────────
  const tbody = document.getElementById('tableBody');
  tbody.innerHTML = sorted.map(s => {
    const pct = s.overall;
    return `
      <!-- Main data row — clicking the name expands the detail row below -->
      <tr class="data-row" data-id="${s.id}" style="cursor:pointer;">
        <td><span class="student-name">${s.name}</span></td>
        <td class="center">
          <div class="bar-wrap">
            <div class="bar-track"><div class="bar-fill" style="width:${pct}%"></div></div>
            <span class="bar-label">${pct}%</span>
          </div>
        </td>
        <td class="center">${s.modulesCompleted} / ${TOTAL_MODULES}</td>
      </tr>
      <!-- Hidden detail row — toggled by clicking the name cell above -->
      <tr class="detail-row" id="detail-${s.id}" style="display:none;">
        <td colspan="3" style="padding:12px 16px;">
          <div class="detail-header">Per-module scores for ${s.name}</div>
          <div class="modules-list">
            ${Object.entries(s.moduleScores || {}).map(([mod, score]) =>
              `<span class="module-chip">${mod}: ${score}%</span>`
            ).join('')}
          </div>
        </td>
      </tr>`;
  }).join('');

  // ── Toggle detail rows on click ───────────────────────────
  tbody.querySelectorAll('.data-row').forEach(row => {
    row.addEventListener('click', () => {
      const detail = document.getElementById(`detail-${row.dataset.id}`);
      if (detail) detail.style.display = detail.style.display === 'none' ? '' : 'none';
    });
  });
}

/**
 * Export gradebook as a CSV file and trigger a browser download.
 * Uses the Blob / URL.createObjectURL pattern — no server needed.
 */
function exportReport() {
  if (!studentData.length) { alert('No data to export.'); return; }

  // Build CSV header + one row per student
  const header = ['Name', 'Overall (%)', 'Modules Completed'];
  const rows   = studentData.map(s => [s.name, s.overall, s.modulesCompleted]);
  const csv    = [header, ...rows].map(r => r.join(',')).join('\n');

  // Create a temporary anchor element to trigger the download
  const blob = new Blob([csv], { type: 'text/csv' });
  const url  = URL.createObjectURL(blob);
  const a    = Object.assign(document.createElement('a'), {
    href:     url,
    download: `gradebook_${new Date().toISOString().slice(0, 10)}.csv`,
  });
  a.click();
  URL.revokeObjectURL(url);   // free memory after download starts
}

document.getElementById('exportBtn').addEventListener('click', exportReport);


// ============================================================
//  SECTION 3 — CERTIFICATES
//  Fetches the current user's real name from the API, then
//  renders a certificate PNG using the HTML <canvas> element.
// ============================================================

/** Fetch the logged-in user's display name. */
async function getStudentName() {
  try {
    const res = await fetch(`${pythonURI}/api/id`, fetchOptions);
    if (res.ok) return (await res.json()).name || 'Student Name';
  } catch (err) {
    console.warn('Could not fetch student name:', err.message);
  }
  return 'Student Name';   // safe fallback
}

/** Render and download a certificate PNG for the given course. */
async function downloadCert(course, org, date) {
  const name   = await getStudentName();
  const canvas = document.getElementById('certCanvas');
  const ctx    = canvas.getContext('2d');

  // Certificate dimensions (landscape A4-ish)
  canvas.width  = 1400;
  canvas.height = 1000;

  // ── Background ───────────────────────────────────────────
  ctx.fillStyle = '#f8f6f0';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // ── Border ───────────────────────────────────────────────
  ctx.strokeStyle = '#2c3e50';
  ctx.lineWidth   = 25;
  ctx.strokeRect(50, 50, canvas.width - 100, canvas.height - 100);

  // ── Title ─────────────────────────────────────────────────
  ctx.fillStyle  = '#2c3e50';
  ctx.font       = 'bold 60px Georgia';
  ctx.textAlign  = 'center';
  ctx.fillText('CERTIFICATE OF COMPLETION', canvas.width / 2, 260);

  // ── Body text ─────────────────────────────────────────────
  ctx.font      = '28px Arial';
  ctx.fillText('This is to certify that', canvas.width / 2, 380);

  // ── Recipient name (fetched dynamically from API) ─────────
  ctx.fillStyle = '#ea8c33';
  ctx.font      = 'italic bold 52px Georgia';
  ctx.fillText(name, canvas.width / 2, 470);

  // ── Course / org / date ───────────────────────────────────
  ctx.fillStyle = '#2c3e50';
  ctx.font      = '32px Arial';
  ctx.fillText(`has successfully completed ${course}`, canvas.width / 2, 570);
  ctx.font      = '24px Arial';
  ctx.fillStyle = '#666';
  ctx.fillText(org, canvas.width / 2, 640);
  ctx.fillText(date, canvas.width / 2, 690);

  // ── Trigger download ──────────────────────────────────────
  const a     = document.createElement('a');
  a.download  = `${course.replace(/\s+/g, '_')}_Certificate.png`;
  a.href      = canvas.toDataURL('image/png');
  a.click();
}

/** Open LinkedIn's "Add Certification" page pre-filled with course details. */
function addToLinkedIn(courseName) {
  const url = new URL('https://www.linkedin.com/profile/add');
  url.searchParams.append('name',             courseName);
  url.searchParams.append('organizationName', 'Open Coding Society');
  url.searchParams.append('issueYear',        new Date().getFullYear());
  url.searchParams.append('issueMonth',       new Date().getMonth() + 1);
  url.searchParams.append('certId',           `CSPORTFOLIO-${Date.now()}`);
  window.open(url.toString(), '_blank');
}

/** Populate the cert date on page load and wire up buttons. */
function initCerts() {
  // Show a human-readable month/year on the cert card
  const dateStr = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  document.getElementById('certDate').textContent = dateStr;

  document.getElementById('btnDownload').addEventListener('click',
    () => downloadCert('CS Portfolio Certificate', 'Open Coding Society', dateStr)
  );
  document.getElementById('btnLinkedIn').addEventListener('click',
    () => addToLinkedIn('CS Portfolio Certificate')
  );
}


// ============================================================
//  SECTION 4 — FREE RESPONSE QUESTION (FRQ)
//  Posts the student's answer to the backend grading endpoint.
//  Displays the AI-generated feedback with basic HTML formatting.
// ============================================================

function initFRQ() {
  const btn = document.getElementById('frq-grade-btn');
  const fb  = document.getElementById('frq-feedback');

  btn.addEventListener('click', async () => {
    const question = document.getElementById('frq-question').textContent.trim();
    const answer   = document.getElementById('frq-answer').value.trim();

    // Validate: don't submit an empty answer
    if (!answer) {
      fb.innerHTML = `<span style="color:var(--danger);">Please enter a response before grading.</span>`;
      return;
    }

    // Disable button + show spinner text while waiting
    btn.disabled    = true;
    fb.innerHTML    = 'Grading…';

    try {
      const res = await fetch(`${javaURI}/api/gemini-frq/grade`, {
        method:  'POST',
        mode:    'cors',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ question, answer }),
      });

      if (!res.ok) throw new Error(`Server returned ${res.status}`);

      const result = await res.json();

      // The Gemini response is nested inside candidates[0].content.parts[0].text
      // Convert **bold** markers and newlines to HTML
      const raw = result.candidates?.[0]?.content?.parts?.[0]?.text ?? 'No feedback returned.';
      fb.innerHTML = raw
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\n/g, '<br>');

    } catch (err) {
      fb.innerHTML = `<span style="color:var(--danger);">Grading error: ${err.message}</span>`;
    } finally {
      btn.disabled = false;   // always re-enable button
    }
  });
}


// ============================================================
//  SECTION 5 — PERSISTENCE (localStorage)
//  Saves current step + FRQ draft so a page refresh restores
//  where the student left off.
// ============================================================

/** Write current UI state to localStorage. */
function persist() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      step:      currentStep,
      frqAnswer: document.getElementById('frq-answer')?.value ?? '',
    }));
  } catch (e) { /* quota exceeded or private browsing — silently skip */ }
}

/** Read saved state from localStorage and apply it. */
function restore() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (!saved) return;

    // Restore the FRQ draft text if present
    const ta = document.getElementById('frq-answer');
    if (ta && saved.frqAnswer) ta.value = saved.frqAnswer;

    // Restore which step was active (defaults to 0)
    showStep(saved.step ?? 0);
  } catch (e) { /* corrupt data — just start from the beginning */ }
}


// ============================================================
//  SECTION 6 — BOOT
//  DOMContentLoaded fires once the HTML is fully parsed.
//  We restore saved state first, then kick off async data loads.
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
  restore();       // apply any saved step / FRQ draft
  showStep(currentStep);   // initialise progress bar + button states

  loadAnalytics(); // async: fetch students → render dashboard
  initCerts();     // wire up download / LinkedIn buttons
  initFRQ();       // wire up the grade button
});

</script>

<!-- ============================================================
     BACK BUTTON HANDLER
     Tries history.back() so the browser returns to wherever the
     student navigated from; falls back to the parent path.
     Kept as a separate non-module script because it doesn't need
     any imports and runs independently.
     ============================================================ -->
<script>
(function () {
  document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('a.back-btn').forEach(function (a) {
      a.addEventListener('click', function (e) {
        // Let modifier-clicks (Cmd/Ctrl/Shift + click, middle-click) behave normally
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.button === 1) return;
        e.preventDefault();

        // Prefer history.back() when we came from the same origin
        try {
          if (document.referrer && new URL(document.referrer).origin === location.origin) {
            history.back();
            return;
          }
        } catch (err) { /* ignore URL parse errors */ }

        // Fallback: navigate to the parent directory
        const parts = location.pathname.replace(/\/$/, '').split('/');
        if (parts.length > 1) {
          parts.pop();
          window.location.href = parts.join('/') + '/';
        } else {
          window.location.href = '/';
        }
      });
    });
  });
})();
</script>

<!-- Lesson completion tracker (provided by the site framework) -->
<script src="/assets/js/lesson-completion-bigsix.js"></script>