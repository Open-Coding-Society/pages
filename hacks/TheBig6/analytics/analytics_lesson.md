---
layout: cs-bigsix-lesson
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

<style>
  /*
   * Colors from system SASS (_sass/minima/lessonbase.scss → :root).
   * Edit lessonbase.scss to change colors — not this file.
   */
  .page-content {
    --bg:      var(--bg-1);
    --panel:   var(--panel);
    --border:  rgba(255,255,255,0.08);
    --txt:     var(--text);
    --muted:   var(--text-muted);
    --ac:      var(--accent);
    --ac2:     var(--accent);
    --ok:      var(--green);
    --err:     var(--red);
    --code-bg: var(--bg-0);
  }

  * { box-sizing: border-box; margin: 0; padding: 0; }
  .container { max-width: 1200px; margin: 0 auto; padding: 24px 16px 40px; }
  .header    { margin-bottom: 32px; }
  .header h1 { font-size: 28px; font-weight: 800; margin-bottom: 4px; color: var(--txt); }
  .header p  { color: var(--muted); font-size: 14px; }

  .progress-bar           { display: flex; gap: 8px; margin: 20px 0; align-items: center; }
  .progress-bar .step     { flex: 1; height: 4px; background: rgba(255,255,255,0.1); border-radius: 2px; cursor: pointer; transition: 0.2s; }
  .progress-bar .step.active { background: var(--ac); height: 6px; }

  .section        { display: none; }
  .section.active { display: block; }

  .card    { background: var(--panel); border: 1px solid var(--border); border-radius: 12px; padding: 20px; margin-bottom: 16px; }
  .card h2 { margin-bottom: 12px; font-size: 20px; color: var(--ac2); }

  .nav-buttons      { display: flex; gap: 12px; margin-top: 24px; justify-content: space-between; }
  button            { appearance: none; border: 1px solid var(--border); background: var(--ac); color: #fff; padding: 8px 14px; border-radius: 8px; cursor: pointer; font-size: 14px; font-weight: 500; transition: 0.2s; }
  button:hover      { background: var(--accent-700); transform: translateY(-1px); }
  button.secondary  { background: var(--bg-3); color: var(--txt); }
  button.secondary:hover { background: var(--surface); }
  button:disabled   { opacity: 0.4; cursor: not-allowed; transform: none; }

  .metrics-grid   { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 16px; margin-bottom: 20px; }
  .metric-card    { background: var(--code-bg); border: 1px solid var(--border); border-radius: 10px; padding: 16px; }
  .metric-title   { font-size: 12px; color: var(--muted); text-transform: uppercase; letter-spacing: 0.05em; }
  .metric-value   { font-size: 32px; font-weight: 800; color: var(--ac); margin: 8px 0 4px; }
  .metric-subtitle{ font-size: 12px; color: var(--muted); }

  .toolbar        { display: flex; align-items: center; justify-content: space-between; background: var(--code-bg); border: 1px solid var(--border); border-radius: 8px 8px 0 0; padding: 12px 16px; }
  .toolbar-title  { font-weight: 700; color: var(--ac); }
  .download-btn   { background: var(--ac); }

  .table-container { background: var(--code-bg); border: 1px solid var(--border); border-top: none; border-radius: 0 0 8px 8px; overflow-x: auto; }
  table            { width: 100%; border-collapse: collapse; font-size: 14px; }
  thead            { border-bottom: 2px solid var(--ac); }
  th               { padding: 10px 16px; text-align: left; color: var(--ac); font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em; cursor: pointer; user-select: none; }
  th:hover         { background: rgba(76,175,239,0.1); }
  th[data-sort]::after      { content: " ↕"; font-size: 10px; opacity: 0.5; }
  th[data-sort="asc"]::after  { content: " ↑"; opacity: 1; }
  th[data-sort="desc"]::after { content: " ↓"; opacity: 1; }
  td               { padding: 10px 16px; border-bottom: 1px solid var(--border); color: var(--txt); }
  tr:last-child td { border-bottom: none; }
  tr:hover td      { background: rgba(255,255,255,0.03); }
  .student-name   { font-weight: 600; color: var(--ac); }
  td.center       { text-align: center; }

  .bar-wrap  { display: flex; align-items: center; gap: 8px; }
  .bar-track { flex: 1; height: 6px; background: rgba(255,255,255,0.08); border-radius: 3px; }
  .bar-fill  { height: 100%; border-radius: 3px; background: linear-gradient(90deg, var(--ac), var(--ac2)); transition: width 0.4s ease; }
  .bar-label { font-size: 12px; min-width: 36px; text-align: right; }

  .detail-row    { border-top: 1px solid var(--ac); background: rgba(76,175,239,0.05); }
  .detail-header { font-weight: 700; color: var(--ac); margin-bottom: 8px; }
  .modules-list  { display: flex; flex-wrap: wrap; gap: 8px; }
  .module-chip   { background: rgba(76,175,239,0.15); border: 1px solid var(--ac); border-radius: 20px; padding: 4px 12px; font-size: 12px; color: var(--txt); }

  .cert-card   { background: var(--code-bg); border: 1px solid var(--border); border-radius: 12px; padding: 24px; max-width: 400px; }
  .cert-badge  { display: inline-block; background: var(--ok); color: #fff; font-size: 11px; font-weight: 700; padding: 2px 8px; border-radius: 20px; margin-bottom: 12px; }
  .cert-title  { font-size: 20px; font-weight: 800; color: var(--ac); margin-bottom: 4px; }
  .cert-org    { font-size: 13px; color: var(--muted); }
  .cert-date   { font-size: 12px; color: var(--muted); margin: 8px 0 16px; }
  .cert-actions{ display: flex; gap: 10px; }
  .btn-share   { background: #0077b5; }
  .btn-share:hover { background: #005f91; }

  .frq-box      { border: 1px solid var(--border); padding: 1rem; border-radius: 8px; margin: 1.5rem 0; background: var(--bg-3); color: var(--txt); font-weight: 300; }
  .frq-box textarea { width: 100%; border-radius: 6px; border: 1px solid var(--border); padding: 0.5rem; margin-top: 0.5rem; background: var(--surface); color: var(--txt); resize: vertical; }
  #frq-feedback { margin-top: 12px; line-height: 1.6; }

  .loading { color: var(--muted); font-style: italic; padding: 20px 0; }
</style>

<div class="container page-content">
  <div class="header">
    <h1>Analytics — All-in-One</h1>
    <p>Interactive lesson covering the admin dashboard, certificates, and mastery questions.</p>
    <a href="../" class="button back-btn">Back</a>
  </div>

  <div class="progress-bar" id="progressBar"></div>

  <!-- STEP 1 -->
  <div class="section active" id="step1">
    <div class="card">
      <h2>1 — Admin Analytics Dashboard</h2>
      <p>This dashboard provides a comprehensive overview of student performance. View real-time metrics, sort the interactive gradebook, and expand any row to see per-module progress.</p>
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
      <div class="toolbar">
        <span class="toolbar-title">Class Gradebook</span>
        <button class="download-btn" id="exportBtn">Export Report</button>
      </div>
      <div class="table-container">
        <table id="gradebook">
          <thead>
            <tr>
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

  <!-- STEP 2 -->
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
      <canvas id="certCanvas" style="display:none;"></canvas>
    </div>
  </div>

  <!-- STEP 3 -->
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

  <div class="nav-buttons">
    <button id="prevBtn" class="secondary">← Previous</button>
    <div style="display:flex; gap:8px; align-items:center;">
      <span id="stepIndicator" style="color:var(--muted); font-size:12px;"></span>
      <button id="nextBtn">Next →</button>
    </div>
  </div>
</div>

<script type="module">
import { javaURI, pythonURI, fetchOptions } from '/assets/js/api/config.js';
import { restore, persist }         from '/assets/js/bigsix/persistence.js';
import { initNavigation, showStep } from '/assets/js/bigsix/navigation.js';
import { loadAnalytics }            from '/assets/js/bigsix/analytics/analytics.js';
import { initCerts }                from '/assets/js/bigsix/analytics/certificates.js';
import { initFRQ }                  from '/assets/js/bigsix/analytics/frq.js';

document.addEventListener('DOMContentLoaded', () => {
  restore(showStep);
  initNavigation(showStep, persist);
  loadAnalytics(javaURI, fetchOptions);
  initCerts(pythonURI, fetchOptions);
  initFRQ(javaURI);
});
</script>

<script>
(function(){
  document.addEventListener('DOMContentLoaded', function(){
    document.querySelectorAll('a.back-btn').forEach(function(a){
      a.addEventListener('click', function(e){
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.button === 1) return;
        e.preventDefault();
        try { if (document.referrer && new URL(document.referrer).origin === location.origin) { history.back(); return; } } catch(err) {}
        var p = location.pathname.replace(/\/$/, '').split('/');
        if (p.length > 1) { p.pop(); window.location.href = p.join('/') + '/'; } else { window.location.href = '/'; }
      });
    });
  });
})();
</script>
<script src="/assets/js/lesson-completion-bigsix.js"></script>