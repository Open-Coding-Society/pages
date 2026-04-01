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
  }

  * { box-sizing: border-box; margin: 0; padding: 0; }
  .container { max-width: 1200px; margin: 0 auto; padding: 28px 16px 64px; }

  .lesson-header { margin-bottom: 32px; padding-bottom: 20px; border-bottom: 1px solid var(--border); }
  .lesson-header .badge { display: inline-flex; align-items: center; gap: 6px; background: var(--panel-2); border: 1px solid var(--border-b); border-radius: 20px; padding: 3px 12px; font-size: 11px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; color: var(--ac2); margin-bottom: 10px; }
  .lesson-header .badge::before { content: ''; width: 6px; height: 6px; border-radius: 50%; background: var(--ac); box-shadow: 0 0 8px var(--ac); display: inline-block; }
  .lesson-header h1 { font-size: 30px; font-weight: 800; letter-spacing: -0.02em; margin-bottom: 6px; color: var(--txt); }
  .lesson-header p  { color: var(--muted); font-size: 14px; }
  .back-btn { display: inline-flex; align-items: center; gap: 6px; margin-top: 12px; font-size: 12px; font-weight: 600; color: var(--muted); text-decoration: none; background: var(--panel-2); border: 1px solid var(--border); border-radius: 6px; padding: 5px 12px; transition: 0.2s; }
  .back-btn:hover { color: var(--txt); border-color: var(--border-b); }

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

  .section        { display: none; }
  .section.active { display: block; animation: fadeIn 0.3s ease; }
  @keyframes fadeIn { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }

  .card { background: var(--panel); border: 1px solid var(--border); border-radius: 14px; padding: 24px; margin-bottom: 16px; position: relative; overflow: hidden; }
  .card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px; background: linear-gradient(90deg, var(--ac), var(--ac2)); opacity: 0.6; }
  .card h2 { font-size: 20px; font-weight: 800; color: var(--txt); margin-bottom: 12px; display: flex; align-items: center; gap: 10px; }
  .card h2 .step-num { width: 28px; height: 28px; border-radius: 8px; background: var(--ac); color: #fff; font-size: 12px; font-weight: 800; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
  .card h3 { font-size: 15px; color: var(--ac2); margin: 20px 0 8px; }
  .block-desc { background: rgba(76,175,239,0.06); border-left: 3px solid var(--ac); padding: 12px 16px; border-radius: 0 8px 8px 0; color: var(--txt); font-size: 14px; margin: 0 0 20px; line-height: 1.7; }

  .concept-grid { display: grid; grid-template-columns: repeat(auto-fit,minmax(180px,1fr)); gap: 12px; margin-bottom: 20px; }
  .concept-tile { background: var(--panel-2); border: 1px solid var(--border); border-radius: 10px; padding: 14px 16px; transition: border-color 0.2s, transform 0.2s; }
  .concept-tile:hover { border-color: var(--border-ac); transform: translateY(-2px); }
  .concept-tile .tile-icon  { font-size: 22px; margin-bottom: 6px; }
  .concept-tile .tile-title { font-size: 13px; font-weight: 700; color: var(--ac2); margin-bottom: 4px; }
  .concept-tile .tile-body  { font-size: 12px; color: var(--muted); line-height: 1.55; }

  /* KPI cards */
  .kpi-grid { display: grid; grid-template-columns: repeat(auto-fit,minmax(160px,1fr)); gap: 12px; margin-bottom: 20px; }
  .kpi-card { background: var(--panel-2); border: 1px solid var(--border); border-radius: 10px; padding: 16px; text-align: center; }
  .kpi-value { font-size: 28px; font-weight: 800; color: var(--ac); }
  .kpi-label { font-size: 11px; color: var(--muted); text-transform: uppercase; letter-spacing: 0.06em; margin-top: 4px; }
  .kpi-sub   { font-size: 12px; color: var(--txt); margin-top: 2px; }

  /* Gradebook table */
  .gradebook { width: 100%; border-collapse: collapse; font-size: 13px; }
  .gradebook thead th { background: var(--panel-2); padding: 10px 14px; text-align: left; font-weight: 700; color: var(--ac2); border-bottom: 1px solid var(--border-b); font-size: 11px; letter-spacing: 0.05em; text-transform: uppercase; cursor: pointer; user-select: none; }
  .gradebook thead th:hover { color: var(--ac); }
  .gradebook td { padding: 10px 14px; border-bottom: 1px solid var(--border); color: var(--txt); vertical-align: middle; }
  .gradebook tr.data-row:hover td { background: var(--hover-bg); cursor: pointer; }
  .gradebook tr:last-child td { border-bottom: none; }
  .bar-wrap { display: flex; align-items: center; gap: 8px; }
  .bar-track { flex: 1; height: 6px; background: rgba(255,255,255,0.1); border-radius: 3px; overflow: hidden; }
  .bar-fill  { height: 100%; background: var(--ac); border-radius: 3px; transition: width 0.4s; }
  .bar-label { font-size: 12px; font-weight: 700; color: var(--ac); min-width: 36px; }
  .student-name { font-weight: 600; }
  .detail-row td { background: var(--panel-2); }
  .detail-header { font-size: 12px; font-weight: 700; color: var(--ac2); margin-bottom: 8px; }
  .modules-list { display: flex; flex-wrap: wrap; gap: 6px; }
  .module-chip { background: var(--hover-bg); border: 1px solid var(--border-ac); border-radius: 4px; padding: 2px 8px; font-size: 11px; color: var(--ac); }

  /* Certificate canvas */
  #certCanvas { display: block; max-width: 100%; border: 1px solid var(--border); border-radius: 10px; margin: 12px 0; }

  /* FRQ */
  textarea { background: var(--code-bg); border: 1px solid var(--border); border-radius: 8px; color: var(--txt); font-size: 13px; padding: 10px 12px; width: 100%; resize: vertical; min-height: 120px; line-height: 1.6; }
  textarea:focus { outline: none; border-color: var(--ac); box-shadow: 0 0 0 2px rgba(76,175,239,0.15); }
  .frq-feedback { margin-top: 12px; padding: 12px 16px; background: var(--panel-3); border-radius: 8px; border-left: 3px solid var(--ok); font-size: 13px; color: var(--txt); line-height: 1.7; display: none; }
  .frq-feedback.show { display: block; }

  button { appearance: none; border: 1px solid var(--border); background: var(--ac); color: #fff; padding: 8px 18px; border-radius: 8px; cursor: pointer; font-size: 13px; font-weight: 600; transition: all 0.2s; }
  button:hover { background: var(--accent-700); transform: translateY(-1px); box-shadow: 0 4px 14px rgba(76,175,239,0.3); }
  button:active { transform: translateY(0); }
  button:disabled { opacity: 0.4; cursor: not-allowed; transform: none; box-shadow: none; }
  button.secondary { background: var(--panel-2); color: var(--txt); }
  button.secondary:hover { background: var(--panel-3); box-shadow: none; }
  .btn-row { display: flex; gap: 8px; flex-wrap: wrap; margin-top: 14px; align-items: center; }

  input { background: var(--code-bg); border: 1px solid var(--border); border-radius: 8px; color: var(--txt); font-size: 13px; padding: 9px 12px; width: 100%; }
  input:focus { outline: none; border-color: var(--ac); }

  .tip { font-size: 12px; color: var(--muted); padding: 8px 14px; background: var(--panel-2); border-radius: 6px; border-left: 2px solid var(--ac); line-height: 1.5; margin-top: 14px; }
  .tip::before { content: '💡 '; }

  .nav-buttons { display: flex; gap: 12px; margin-top: 28px; justify-content: space-between; align-items: center; }
  #stepIndicator { font-size: 12px; color: var(--muted); }
</style>

<div class="container page-content">
  <div class="lesson-header">
    <div class="badge">Module 6 · Curators Team</div>
    <h1>Analytics</h1>
    <p>Admin dashboard, student gradebook, certificates, and AI-graded mastery questions.</p>
    <a href="../" class="back-btn">← Back to Big Six</a>
  </div>

  <div class="progress-track">
    <div class="progress-steps" id="progressSteps"></div>
  </div>

  <!-- STEP 1 -->
  <div class="section active" id="step1">
    <div class="card">
      <h2><span class="step-num">1</span> Admin Analytics Dashboard</h2>
      <div class="block-desc">This dashboard provides a comprehensive overview of student performance with real-time KPI metrics, a sortable gradebook, and expandable per-module breakdowns.</div>
      <div class="concept-grid">
        <div class="concept-tile"><div class="tile-icon">📊</div><div class="tile-title">KPI Metrics</div><div class="tile-body">Key Performance Indicators summarize class health at a glance.</div></div>
        <div class="concept-tile"><div class="tile-icon">🏆</div><div class="tile-title">Top Performer</div><div class="tile-body">Identify the highest-scoring student to celebrate achievement.</div></div>
        <div class="concept-tile"><div class="tile-icon">📋</div><div class="tile-title">Gradebook</div><div class="tile-body">Sortable table with per-module breakdown expandable on click.</div></div>
        <div class="concept-tile"><div class="tile-icon">📥</div><div class="tile-title">CSV Export</div><div class="tile-body">Download the full gradebook as a spreadsheet with one click.</div></div>
      </div>
      <div class="kpi-grid">
        <div class="kpi-card">
          <div class="kpi-value" id="class-average">—</div>
          <div class="kpi-label">Class Average</div>
          <div class="kpi-sub" id="students-enrolled">loading…</div>
        </div>
        <div class="kpi-card">
          <div class="kpi-value" id="modules-completed">—</div>
          <div class="kpi-label">Modules Completed</div>
          <div class="kpi-sub">Out of 25 total</div>
        </div>
        <div class="kpi-card">
          <div class="kpi-value" id="top-grade">—</div>
          <div class="kpi-label">Top Performer</div>
          <div class="kpi-sub" id="top-scorer">—</div>
        </div>
      </div>
      <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:8px;">
        <span style="font-weight:700; color:var(--ac2); font-size:13px;">Class Gradebook</span>
        <button id="exportBtn">Export Report</button>
      </div>
      <div style="overflow-x:auto;">
        <table class="gradebook" id="gradebook">
          <thead>
            <tr>
              <th data-key="name">Student Name</th>
              <th data-key="overall">Overall</th>
              <th data-key="modules">Modules</th>
            </tr>
          </thead>
          <tbody id="tableBody">
            <tr><td colspan="3" style="color:var(--muted); font-style:italic; padding:20px 14px;">Loading gradebook…</td></tr>
          </tbody>
        </table>
      </div>
      <p class="tip">Click any student row to expand their per-module breakdown, or click a column header to sort.</p>
    </div>
  </div>

  <!-- STEP 2 -->
  <div class="section" id="step2">
    <div class="card">
      <h2><span class="step-num">2</span> Certificates and Badges</h2>
      <div class="block-desc">Claim your certificate for completed modules — download as a high-quality image or share it directly to LinkedIn to showcase your achievement.</div>
      <canvas id="certCanvas"></canvas>
      <div class="btn-row">
        <button class="btn-download" id="btnDownload">⬇ Download</button>
        <button id="btnLinkedIn" style="background:#0077b5;">Add to LinkedIn</button>
      </div>
      <p class="tip">Your certificate is generated with your name and completion date automatically pulled from your profile.</p>
    </div>
  </div>

  <!-- STEP 3 -->
  <div class="section" id="step3">
    <div class="card">
      <h2><span class="step-num">3</span> Free Response Question</h2>
      <div class="block-desc">Submit a written response below — your answer will be evaluated by an AI assistant and you will receive instant feedback.</div>
      <h3>FRQ Prompt</h3>
      <p style="font-size:14px; color:var(--txt); margin-bottom:16px;" id="frq-question">Describe what analytics or metrics you aim to collect and how you'll present them.</p>
      <textarea id="frq-answer" rows="5" placeholder="Type your response here…"></textarea>
      <div class="btn-row">
        <button id="frq-grade-btn">Grade</button>
      </div>
      <div id="frq-feedback" class="frq-feedback"></div>
      <p class="tip">Be specific about which data points you would track and what visualizations (charts, tables, KPIs) you would use to present them.</p>
    </div>
  </div>

  <div class="nav-buttons">
    <button id="prevBtn" class="secondary">← Previous</button>
    <div style="display:flex; gap:8px; align-items:center;">
      <span id="stepIndicator"></span>
      <button id="nextBtn">Next →</button>
    </div>
  </div>
</div>

<script type="module">
import { javaURI, pythonURI, fetchOptions } from '/assets/js/api/config.js';
import { Navigator }   from '/assets/js/bigsix/shared/navigation.js';
import { Persistence } from '/assets/js/bigsix/shared/persistence.js';
import { AnalyticsDashboard } from '/assets/js/bigsix/analytics/analytics.js';
import { CertificatePanel }   from '/assets/js/bigsix/analytics/certificates.js';
import { FrqGrader }          from '/assets/js/bigsix/analytics/frq.js';

document.addEventListener('DOMContentLoaded', () => {
  const nav   = new Navigator({ progressStyle: 'dots', labels: ['Analytics', 'Certificates', 'Free Response'] });
  const store = new Persistence('analytics_combined_v1', { fields: ['frq-answer'] });
  nav.init(() => store.persist());
  store.restore((n, s) => nav.showStep(n, s));
  new AnalyticsDashboard(javaURI, fetchOptions).init();
  new CertificatePanel(pythonURI, fetchOptions).init();
  new FrqGrader(javaURI).init();
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
