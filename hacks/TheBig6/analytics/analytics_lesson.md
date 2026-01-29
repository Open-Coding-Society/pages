---
layout: cs-portfolio-lesson
title: "Analytics — All-in-One Interactive Lesson"
description: "A multi-step interactive lesson covering the admin dashboard, certificates, and mastery questions."
permalink: /bigsix/analytics_lesson
parent: "Analytics/Admin"
team: "Curators"
categories: [CSP, Analytics, Interactive]
tags: [analytics, admin, interactive]
author: "Curators Team"
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
  .container { max-width: 1200px; margin: 0 auto; padding: 24px 16px 40px; }
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
  .nav-buttons { display: flex; gap: 12px; margin-top: 24px; justify-content: space-between; }
  button { appearance: none; border: 1px solid var(--border); background: var(--accent); color: #fff; padding: 8px 14px; border-radius: 8px; cursor: pointer; font-size: 14px; font-weight: 500; transition: 0.2s; }
  button:hover { background: #6d28d9; transform: translateY(-1px); }
  button.secondary { background: #334155; }
  button.secondary:hover { background: #1e293b; }

  /* Analytics Styles */
  .analytics-container, .cert-container { color: var(--text); }
  .page-title { color: var(--accent); }
  .metric-card, .toolbar, .table-container, .info-box, .cert-card { background: #051226; border: 1px solid var(--border); }
  .metric-value, .toolbar-title, th, .student-name, .detail-header, .module-box h4, .module-summary { color: var(--accent); }
  thead { border-bottom-color: var(--accent); }
  .download-btn { background: var(--accent); }
  .progress-bar-fill { background: linear-gradient(90deg, var(--accent) 0%, #9f7aea 100%); }
  .detail-row { border-top-color: var(--accent); }
</style>

<div class="container">
  <div class="header">
    <h1>Analytics — All-in-One</h1>
    <p>Interactive lesson covering the admin dashboard, certificates, and mastery questions.</p>
    <a href="../" class="button back-btn">Back</a>
  </div>

  <div class="progress-bar" id="progressBar"></div>

  <!-- Step 1: Admin Analytics -->
  <div class="section active" id="step1">
    <div class="card">
      <h2>1 — Admin Analytics Dashboard</h2>
      <p>This dashboard provides a comprehensive overview of student performance. View real-time metrics, sort the interactive gradebook, and expand rows to see detailed progress for each student.</p>
      <div class="analytics-container">
        <h1 class="page-title">Student Grading Overview</h1>
        <div class="metrics-grid">
            <div class="metric-card"><div class="metric-header"><span class="metric-title">Class Average</span></div><div class="metric-value" id="class-average">--%</div><div class="metric-subtitle" id="students-enrolled">-- students</div></div>
            <div class="metric-card"><div class="metric-header"><span class="metric-title">Modules Completed</span></div><div class="metric-value" id="modules-completed">--</div><div class="metric-subtitle">Out of 25 total</div></div>
            <div class="metric-card"><div class="metric-header"><span class="metric-title">Top Performer</span></div><div class="metric-value" id="top-grade">--%</div><div class="metric-subtitle" id="top-scorer">--</div></div>
        </div>
        <div class="toolbar"><div class="toolbar-title">Class Gradebook</div><button class="download-btn" onclick="window.downloadReport()">Export Report</button></div>
        <div class="table-container">
            <table>
                <thead><tr><th onclick="window.sortTable('name')" id="th-name">Student Name</th><th class="center">Overall</th></tr></thead>
                <tbody id="tableBody"></tbody>
            </table>
        </div>
      </div>
    </div>
  </div>

  <!-- Step 2: Certificates -->
  <div class="section" id="step2">
    <div class="card">
      <h2>2 — Certificates and Badges</h2>
      <p>Claim your certificates for completed modules. You can download each certificate as a high-quality image or share it directly to your LinkedIn profile.</p>
      <div class="cert-container">
        <h2 class="section-title">Overall Certificate</h2>
        <div class="certificates-grid">
            <div class="cert-card cert-green"><span class="cert-badge">Verified</span><h3 class="cert-title">CS Portfolio Certificate</h3><div class="cert-org">Open Coding Society</div><div class="cert-date">December 2025</div><div class="cert-actions"><button class="btn btn-download" onclick="window.downloadCert('Computer Science Portfolio', 'Open Coding Society', 'December 2025')">⬇ Download</button><button class="btn btn-share" onclick="window.addToLinkedIn('CS Portfolio Certificate')">Add to LinkedIn</button></div></div>
        </div>
      </div>
      <canvas id="certCanvas" style="display: none;"></canvas>
    </div>
  </div>

  <!-- Step 3: FRQ -->
  <div class="section" id="step3">
    <div class="card">
      <h2>3 — Free Response Question</h2>
      <p>Test your knowledge by submitting a response to the free-response question below. Your answer will be graded by an AI assistant.</p>
      <div class="frq-box" id="quest-frq" style="border:1px solid #2c2c2e; padding:1rem; border-radius:8px; margin:1.5rem 0; background:#1c1c1e; color:#e5e5ea; font-weight:300;">
        <b>FRQ:</b> <span id="frq-question">Describe what analytics or metrics you aim to collect and how you’ll present them.</span><br><br>
        <textarea id="frq-answer" rows="5" placeholder="Type your response here..." style="width:100%; border-radius:6px; border:1px solid #3a3a3c; padding:0.5rem; margin-top:0.5rem; background:#2c2c2e; color:#f2f2f7;"></textarea>
        <p></p>
        <button id="frq-grade-btn" style="margin-top:10px;">Grade</button>
        <div id="frq-feedback"></div>
      </div>
    </div>
  </div>

  <!-- Navigation -->
  <div class="nav-buttons">
    <button id="prevBtn" onclick="prevStep()" class="secondary">← Previous</button>
    <div style="display: flex; gap: 8px;">
      <span id="stepIndicator" style="color: var(--muted); font-size: 12px; align-self: center;">Step 1 / 3</span>
      <button id="nextBtn" onclick="nextStep()">Next →</button>
    </div>
  </div>
</div>

<script type="module">
// ========== State & Navigation ==========
let currentStep = 0;
const steps = ['step1', 'step2', 'step3'];
const STORAGE_KEY = 'analytics_combined_v1';

function showStep(n) {
  currentStep = Math.max(0, Math.min(steps.length - 1, n));
  steps.forEach((s, i) => document.getElementById(s).classList.toggle('active', i === currentStep));
  
  const bar = document.getElementById('progressBar');
  if(bar) bar.innerHTML = steps.map((_, i) => `<div class="step ${i <= currentStep ? 'active' : ''}" onclick="showStep(${i})"></div>`).join('');
  
  const indicator = document.getElementById('stepIndicator');
  if(indicator) indicator.textContent = `Step ${currentStep + 1} / ${steps.length}`;
  
  document.getElementById('prevBtn').disabled = currentStep === 0;
  document.getElementById('nextBtn').disabled = currentStep === steps.length - 1;

  persist();
}
window.showStep = showStep;
function prevStep() { showStep(currentStep - 1); }
window.prevStep = prevStep;
function nextStep() { showStep(currentStep + 1); }
window.nextStep = nextStep;

// ========== Analytics, Certs, and FRQ Scripts ==========
import { javaURI, pythonURI, fetchOptions } from '{{ site.baseurl }}/assets/js/api/config.js';

// --- Certificates ---
async function getCredentials() {
    try {
        const res = await fetch(`${pythonURI}/api/id`, fetchOptions);
        if (res.ok) return (await res.json()).name || 'Student Name';
    } catch (err) { console.error("Error fetching credentials:", err); }
    return 'Student Name';
}
window.downloadCert = async function(course, org, date) {
    const name = await getCredentials();
    const canvas = document.getElementById('certCanvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 1400; canvas.height = 1000;
    ctx.fillStyle = '#f8f6f0'; ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = '#2c3e50'; ctx.lineWidth = 25; ctx.strokeRect(50, 50, canvas.width - 100, canvas.height - 100);
    ctx.font = 'bold 60px Georgia'; ctx.textAlign = 'center'; ctx.fillStyle = '#2c3e50';
    ctx.fillText('CERTIFICATE OF COMPLETION', canvas.width / 2, 260);
    ctx.font = '28px Arial'; ctx.fillText('This is to certify that', canvas.width / 2, 380);
    ctx.fillStyle = '#ea8c33'; ctx.font = 'italic bold 52px Georgia'; ctx.fillText(name, canvas.width / 2, 470);
    const link = document.createElement('a');
    link.download = `${course.replace(/\s+/g, '_')}_Certificate.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
}
window.addToLinkedIn = function(courseName) {
    const certId = 'CSPORTFOLIO-' + Date.now();
    const url = new URL('https://www.linkedin.com/profile/add');
    url.searchParams.append('name', courseName);
    url.searchParams.append('organizationName', 'Open Coding Society');
    url.searchParams.append('issueYear', new Date().getFullYear());
    url.searchParams.append('issueMonth', new Date().getMonth() + 1);
    url.searchParams.append('certId', certId);
    window.open(url.toString(), '_blank');
}

// --- Analytics Dashboard ---
async function mainAnalytics() {
    // Mock data for demonstration
    const students = [{id: 1, name: 'Priya Patel', modules: { overall: 96 }}, {id: 2, name: 'John Doe', modules: { overall: 88 }}];
    document.getElementById("class-average").innerText = `92%`;
    document.getElementById("students-enrolled").innerText = `${students.length} students enrolled`;
    document.getElementById("modules-completed").innerText = `4.5`;
    document.getElementById("top-grade").innerText = `96%`;
    document.getElementById("top-scorer").innerText = `Priya Patel`;
    
    const tbody = document.getElementById('tableBody');
    tbody.innerHTML = students.map(s => `<tr><td><span class="student-name">${s.name}</span></td><td class="center">${s.modules.overall}%</td></tr>`).join('');
}
window.downloadReport = () => alert("Report download functionality would be implemented here.");
window.sortTable = () => alert("Sorting functionality would be implemented here.");

// --- FRQ ---
const btn = document.getElementById('frq-grade-btn');
btn.addEventListener('click', async () => {
    const q = document.getElementById('frq-question').textContent.trim();
    const a = document.getElementById('frq-answer').value.trim();
    const fb = document.getElementById('frq-feedback');
    if (!a) { fb.innerHTML = '<span style="color:red;">Please enter a response.</span>'; return; }
    btn.disabled = true; fb.innerHTML = 'Grading...';
    try {
        const res = await fetch(`${javaURI}/api/gemini-frq/grade`, {
            method: 'POST', mode: 'cors', credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ question: q, answer: a })
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const result = await res.json();
        fb.innerHTML = (result.candidates?.[0]?.content?.parts?.[0]?.text || 'No feedback.').replace(/\*\*/g, '<strong>').replace(/\n/g,'<br>');
    } catch (e) {
        fb.innerHTML = `<span style="color:red;">Error: ${e.message}</span>`;
    } finally {
        btn.disabled = false;
    }
});

// ========== Persistence ==========
function persist() {
  const data = { step: currentStep, frqAnswer: document.getElementById('frq-answer')?.value };
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); } catch (e) {}
}

function restore() {
  try {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (!data) return;
    const frqAnswerEl = document.getElementById('frq-answer');
    if (frqAnswerEl && data.frqAnswer) frqAnswerEl.value = data.frqAnswer;
    showStep(data.step || 0);
  } catch (e) {}
}

// ========== Boot ==========
document.addEventListener('DOMContentLoaded', () => {
  restore();
  mainAnalytics();
});
</script>

<script>
// Back button handler: prefer history.back() when possible, fall back to parent path
(function(){
  document.addEventListener('DOMContentLoaded', function(){
    document.querySelectorAll('a.back-btn').forEach(function(a){
      a.addEventListener('click', function(e){
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.button === 1) return; // respect modifier clicks
        e.preventDefault();
        try{
          if (document.referrer && new URL(document.referrer).origin === location.origin){ history.back(); return; }
        }catch(err){}
        var p = location.pathname.replace(/\/$/,'').split('/');
        if (p.length>1){ p.pop(); window.location.href = p.join('/') + '/'; }
        else { window.location.href = '/'; }
      });
    });
  });
})();
</script>