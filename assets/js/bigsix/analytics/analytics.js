// ============================================================
//  analytics.js — Single Responsibility: Student grade data
//
//  This module owns everything related to the analytics dashboard:
//    - Fetching student data from the API
//    - Computing KPI metrics (average, top performer, etc.)
//    - Rendering and sorting the gradebook table
//    - Exporting the gradebook as a CSV
//
//  It does NOT handle: navigation, certificates, FRQ, or persistence.
//  Those are separate modules with their own single responsibility.
//
//  EXPORTS (used by analytics_lesson.html):
//    loadAnalytics()  — orchestrator, call this on page load
// ============================================================

// ── No imports needed — javaURI and fetchOptions are passed in
//    as parameters by the orchestrator in analytics_lesson.md.

// ── Constants ─────────────────────────────────────────────────
const TOTAL_MODULES = 25;   // used in the "X / 25" modules column

// ── Module-level state ────────────────────────────────────────
// Stored here so re-sorts don't need to re-fetch from the API.
let studentData = [];
let sortKey = 'name';       // which column is currently sorted
let sortDir = 'asc';        // 'asc' | 'desc'


// ============================================================
//  WORKER 1 — fetchStudents
//  Single responsibility: hit the API and return raw student data.
//  Falls back to mock data when the backend is unavailable
//  (e.g. local dev without a running Java server).
// ============================================================

/**
 * Fetch student records from the Java backend.
 *
 * @param {string} javaURI      - Base URL of the Java API
 * @param {object} fetchOptions - Shared fetch config (credentials, mode, etc.)
 * @returns {Promise<Array>}    - Array of student objects
 */
async function fetchStudents(javaURI, fetchOptions) {
  try {
    const res = await fetch(`${javaURI}/api/analytics/students`, fetchOptions);

    // Throw so the catch block can handle any non-2xx response
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    // Expected shape per student:
    // { id, name, overall, modulesCompleted, moduleScores: { ModuleName: score, ... } }
    return await res.json();

  } catch (err) {
    // Warn in the console so developers know they're on mock data
    console.warn('Analytics API unavailable, using mock data:', err.message);

    // ── Mock data — replace when backend endpoint is live ────
    return [
      { id: 1, name: 'Priya Patel',  overall: 96, modulesCompleted: 6,
        moduleScores: { Frontend: 98, Backend: 94, DataViz: 96, Security: 95, Analytics: 97, AI: 100 } },
      { id: 2, name: 'John Doe',     overall: 88, modulesCompleted: 5,
        moduleScores: { Frontend: 90, Backend: 85, DataViz: 88, Security: 87, Analytics: 90 } },
      { id: 3, name: 'Maria Garcia', overall: 74, modulesCompleted: 4,
        moduleScores: { Frontend: 78, Backend: 70, DataViz: 76, Security: 72 } },
      { id: 4, name: 'Sam Lee',      overall: 91, modulesCompleted: 5,
        moduleScores: { Frontend: 93, Backend: 89, DataViz: 91, Security: 90, Analytics: 92 } },
    ];
  }
}


// ============================================================
//  WORKER 2 — computeMetrics
//  Single responsibility: derive summary KPIs from student array.
//  Pure function — takes data in, returns numbers out, no side effects.
// ============================================================

/**
 * Compute class-level summary metrics from an array of student records.
 *
 * @param {Array} students - Array of student objects
 * @returns {{ avg, avgMods, top }} - Computed metrics object
 */
function computeMetrics(students) {
  const count  = students.length;

  // Reduce sums the 'overall' field across all students, then we divide
  const avg    = Math.round(students.reduce((sum, s) => sum + s.overall, 0) / count);

  // toFixed(1) gives us "4.5" instead of "4.500000..."
  const avgMods = (students.reduce((sum, s) => sum + s.modulesCompleted, 0) / count).toFixed(1);

  // Find the student with the highest overall score
  const top    = students.reduce((best, s) => s.overall >= best.overall ? s : best);

  return { avg, avgMods, top };
}


// ============================================================
//  WORKER 3 — renderKPIs
//  Single responsibility: push computed metrics into the DOM.
//  Only touches the three KPI card elements — nothing else.
// ============================================================

/**
 * Update the three KPI metric cards with computed values.
 *
 * @param {{ avg, avgMods, top }} metrics - Output from computeMetrics()
 * @param {number} count                 - Total number of students
 */
function renderKPIs({ avg, avgMods, top }, count) {
  document.getElementById('class-average').textContent     = `${avg}%`;
  document.getElementById('students-enrolled').textContent = `${count} students enrolled`;
  document.getElementById('modules-completed').textContent = avgMods;
  document.getElementById('top-grade').textContent         = `${top.overall}%`;
  document.getElementById('top-scorer').textContent        = top.name;
}


// ============================================================
//  WORKER 4 — sortStudents
//  Single responsibility: return a sorted copy of student array.
//  Pure function — never mutates the original array.
// ============================================================

/**
 * Sort a copy of the student array by the given key and direction.
 *
 * @param {Array}  students - Source array (not mutated)
 * @param {string} key      - Property name to sort by ('name', 'overall', etc.)
 * @param {string} dir      - 'asc' or 'desc'
 * @returns {Array}         - New sorted array
 */
function sortStudents(students, key, dir) {
  // Spread into a new array so we never mutate the stored studentData
  return [...students].sort((a, b) => {
    const va = a[key] ?? '';
    const vb = b[key] ?? '';

    // String columns (like 'name') use localeCompare for correct alphabetical order
    if (typeof va === 'string') {
      return dir === 'asc' ? va.localeCompare(vb) : vb.localeCompare(va);
    }

    // Numeric columns (like 'overall') use simple subtraction
    return dir === 'asc' ? va - vb : vb - va;
  });
}


// ============================================================
//  WORKER 5 — buildStudentRow
//  Single responsibility: convert one student object into HTML.
//  Returns a string — no DOM access, easy to test independently.
// ============================================================

/**
 * Build the HTML string for one student's data row + detail row.
 *
 * @param {object} student - Single student record
 * @returns {string}       - Two <tr> elements as an HTML string
 */
function buildStudentRow(student) {
  const pct = student.overall;

  // Module score chips — one per entry in moduleScores
  const chips = Object.entries(student.moduleScores || {})
    .map(([mod, score]) => `<span class="module-chip">${mod}: ${score}%</span>`)
    .join('');

  return `
    <tr class="data-row" data-id="${student.id}" style="cursor:pointer;">
      <td><span class="student-name">${student.name}</span></td>
      <td class="center">
        <div class="bar-wrap">
          <div class="bar-track">
            <div class="bar-fill" style="width:${pct}%"></div>
          </div>
          <span class="bar-label">${pct}%</span>
        </div>
      </td>
      <td class="center">${student.modulesCompleted} / ${TOTAL_MODULES}</td>
    </tr>
    <tr class="detail-row" id="detail-${student.id}" style="display:none;">
      <td colspan="3" style="padding:12px 16px;">
        <div class="detail-header">Per-module scores for ${student.name}</div>
        <div class="modules-list">${chips}</div>
      </td>
    </tr>`;
}


// ============================================================
//  WORKER 6 — renderTable
//  Single responsibility: sort data, build rows, inject into DOM,
//  and wire up expand-on-click and column sort listeners.
// ============================================================

/**
 * Re-render the gradebook <tbody> using the current sort state.
 * Also updates column header sort-direction arrows.
 */
function renderTable() {
  const sorted = sortStudents(studentData, sortKey, sortDir);

  // ── Update sort arrows on column headers ─────────────────
  document.querySelectorAll('#gradebook thead th[data-key]').forEach(th => {
    delete th.dataset.sort;
    if (th.dataset.key === sortKey) th.dataset.sort = sortDir;
  });

  // ── Inject rows into <tbody> ──────────────────────────────
  const tbody = document.getElementById('tableBody');
  tbody.innerHTML = sorted.map(buildStudentRow).join('');

  // ── Wire expand/collapse on each data row ─────────────────
  // Clicking a row toggles the hidden detail row directly below it
  tbody.querySelectorAll('.data-row').forEach(row => {
    row.addEventListener('click', () => {
      const detail = document.getElementById(`detail-${row.dataset.id}`);
      if (detail) detail.style.display = detail.style.display === 'none' ? '' : 'none';
    });
  });
}


// ============================================================
//  WORKER 7 — wireSortHeaders
//  Single responsibility: attach click listeners to <th> elements.
//  Separated from renderTable so sort wiring only happens once,
//  not on every re-render.
// ============================================================

/**
 * Attach sort-on-click listeners to all column headers.
 * Clicking the same column again toggles asc ↔ desc.
 */
function wireSortHeaders() {
  document.querySelectorAll('#gradebook thead th[data-key]').forEach(th => {
    // Clone and replace to guarantee no duplicate listeners
    const fresh = th.cloneNode(true);
    th.replaceWith(fresh);
    fresh.addEventListener('click', () => {
      const key = fresh.dataset.key;
      // Toggle direction if same column, otherwise default to ascending
      sortDir = (sortKey === key && sortDir === 'asc') ? 'desc' : 'asc';
      sortKey = key;
      renderTable();
    });
  });
}


// ============================================================
//  WORKER 8 — exportCSV
//  Single responsibility: convert studentData to CSV and
//  trigger a browser download. No server required.
// ============================================================

/**
 * Build a CSV from the current studentData and download it.
 * Uses Blob + URL.createObjectURL — works entirely in the browser.
 */
function exportCSV() {
  if (!studentData.length) { alert('No data to export.'); return; }

  const header = ['Name', 'Overall (%)', 'Modules Completed'];
  const rows   = studentData.map(s => [s.name, s.overall, s.modulesCompleted]);
  const csv    = [header, ...rows].map(r => r.join(',')).join('\n');

  // Create an invisible <a> and programmatically click it to start download
  const blob = new Blob([csv], { type: 'text/csv' });
  const url  = URL.createObjectURL(blob);
  const a    = Object.assign(document.createElement('a'), {
    href:     url,
    download: `gradebook_${new Date().toISOString().slice(0, 10)}.csv`,
  });
  a.click();

  // Free the object URL immediately after — good memory hygiene
  URL.revokeObjectURL(url);
}


// ============================================================
//  ORCHESTRATOR — loadAnalytics
//  Single responsibility: coordinate the analytics workflow.
//  Delegates ALL real work to the workers above.
//  This is the only function exported — it's the public API
//  of this module.
//
//  Workflow:
//    fetchStudents → computeMetrics → renderKPIs
//                                   → renderTable
//                                   → wireSortHeaders
//    wireExportButton
// ============================================================

/**
 * Initialise the analytics dashboard.
 * Call this once on DOMContentLoaded from analytics_lesson.html.
 *
 * @param {string} javaURI      - Base URL of the Java API
 * @param {object} fetchOptions - Shared fetch config
 */
export async function loadAnalytics(javaURI, fetchOptions) {
  // Step 1: Fetch — worker does the actual HTTP request
  studentData = await fetchStudents(javaURI, fetchOptions);

  // Step 2: Compute — pure function, no side effects
  const metrics = computeMetrics(studentData);

  // Step 3: Render KPIs — only touches the three metric cards
  renderKPIs(metrics, studentData.length);

  // Step 4: Render table — sorts, builds rows, injects into DOM
  renderTable();

  // Step 5: Wire sort headers — done once after initial render
  wireSortHeaders();

  // Step 6: Wire export button — delegates to exportCSV worker
  document.getElementById('exportBtn').addEventListener('click', exportCSV);
}