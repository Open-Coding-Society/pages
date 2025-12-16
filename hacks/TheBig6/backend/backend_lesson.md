---
layout: cs-portfolio-lesson
title: "Backend Development — All-in-One Advanced Lesson"
description: "A multi-step lesson on backend development, from fundamentals to advanced topics like serverless, IaC, and AI integration."
permalink: /bigsix/backend_lesson
parent: "Backend Development"
team: "Encrypters"
categories: [CSP, Backend, Interactive, Advanced]
tags: [backend, flask, spring, serverless, ai, interactive]
author: "Encrypters Team"
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
  .nav-buttons { display: flex; gap: 12px; margin-top: 24px; justify-content: space-between; }
  button { appearance: none; border: 1px solid var(--border); background: var(--accent); color: #fff; padding: 8px 14px; border-radius: 8px; cursor: pointer; font-size: 14px; font-weight: 500; transition: 0.2s; }
  button:hover { background: #6d28d9; transform: translateY(-1px); }
  button.secondary { background: #334155; }
  button.secondary:hover { background: #1e293b; }
  .code-snippet { background: #020617; border: 1px solid var(--border); border-radius: 10px; padding: 12px; margin-top: 1rem; font-family: Consolas, monospace; font-size: 12px; color: #cfe8ff; white-space: pre-wrap; word-wrap: break-word; }
</style>

<div class="container">
  <div class="header">
    <h1>Backend Development — All-in-One</h1>
    <p>An interactive lesson covering backend fundamentals, frameworks, and advanced topics.</p>
    <a href="../" class="button back-btn">Back</a>
  </div>

  <div class="progress-bar" id="progressBar"></div>

  <!-- Step 1: Backend Fundamentals -->
  <div class="section active" id="step1">
    <div class="card">
      <h2>1 — Backend Fundamentals</h2>
      <p>The backend handles authentication, data processing, and API endpoints. This section covers the core responsibilities and a quick quiz to test your knowledge.</p>
      <div id="mc-quiz" style="border:1px solid #574e4eff;padding:12px;border-radius:6px;max-width:900px;">
        <form id="quiz-form">
          <ol>
            <li>
              <div style="margin-bottom:6px">You see this frontend call:
                <pre style="display:inline-block;margin:6px 0;padding:6px;border-radius:4px;background:#574e4eff">fetch(`${javaURI}/api/responses`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: "Ana", response: "Here is my answer" }) });</pre>
              </div>
              <div>What is the backend expected to do first when this request arrives?</div>
              <div><label><input type="radio" name="q0" value="C"> C. Validate the request format and required fields, then authenticate the user if needed</label></div>
            </li>
          </ol>
          <div style="margin-top:12px;">
            <button type="submit" id="quiz-submit">Submit</button>
            <button type="button" id="quiz-reset" style="margin-left:8px">Reset</button>
            <span id="quiz-result" style="margin-left:12px;font-weight:600"></span>
          </div>
        </form>
      </div>
    </div>
  </div>

  <!-- Step 2: Databases & APIs -->
  <div class="section" id="step2">
    <div class="card">
      <h2>2 — Databases & APIs</h2>
      <p>Learn how databases store data (SQL vs. NoSQL) and how APIs, following REST principles, allow the frontend and backend to communicate and perform CRUD operations.</p>
      <div id="vocab-crossword" style="border:1px solid #e0e0e0;padding:12px;border-radius:6px;max-width:760px;">
        <ol>
          <li><div style="margin-bottom:6px"><strong>1.</strong> A structured collection of rows and columns in a relational database. (5 letters)</div><input name="w0" maxlength="5" style="width:120px;text-transform:uppercase" /></li>
          <li><div style="margin-bottom:6px"><strong>2.</strong> One record in a table. (3 letters)</div><input name="w1" maxlength="3" style="width:80px;text-transform:uppercase" /></li>
        </ol>
        <div style="margin-top:12px;">
          <button id="vocab2-submit">Submit</button>
          <button id="vocab2-reset" type="button" style="margin-left:8px">Reset</button>
          <span id="vocab2-result" style="margin-left:12px;font-weight:600"></span>
        </div>
      </div>
    </div>
  </div>

  <!-- Step 3: Backend Frameworks -->
  <div class="section" id="step3">
    <div class="card">
      <h2>3 — Backend Frameworks</h2>
      <p>Explore popular backend frameworks like Flask (Python) and Spring Boot (Java), and understand their architecture, core concepts, and when to use each.</p>
      <div id="mc-quiz-3" style="border:1px solid #e0e0e0;padding:12px;border-radius:6px;max-width:900px;">
        <form id="quiz-form-3">
          <ol>
            <li><div style="margin-bottom:6px">In Spring Boot's layered architecture, which layer should contain business logic?</div>
              <div><label><input type="radio" name="q1" value="B"> B. Service</label></div>
            </li>
          </ol>
          <div style="margin-top:12px;">
            <button type="submit" id="quiz-submit-3">Submit</button>
            <span id="quiz-result-3" style="margin-left:12px;font-weight:600"></span>
          </div>
        </form>
      </div>
    </div>
  </div>

  <!-- Step 4: API Project & Testing -->
  <div class="section" id="step4">
      <div class="card">
          <h2>4 — API Project & Testing</h2>
          <p>This section outlines a capstone project to build a RESTful API and validate it with Postman. Use the simulator below to understand how API testing tools work.</p>
          <div class="api-tester-container">
              <h1>API Tester</h1>
              <div class="tester-section">
                  <div class="input-group">
                      <label>Request</label>
                      <select id="endpoint-select" class="endpoint-select"><option value="GET:/api/users">GET /api/users</option><option value="GET:/api/invalid">GET /api/invalid (404)</option></select>
                      <button class="btn" onclick="sendRequest(event)" style="margin-top: 20px;">Send Request</button>
                  </div>
              </div>
              <div id="response-container" class="response-section">
                  <div class="response-header"><h2>Response</h2><span id="status-code" class="status-badge"></span></div>
                  <div id="response-time" class="response-info"></div>
                  <div id="response-body" class="response-body"></div>
              </div>
          </div>
      </div>
  </div>

  <!-- Step 5: Advanced Backend Concepts -->
  <div class="section" id="step5">
      <div class="card">
          <h2>5 — Advanced Backend Concepts</h2>
          <p>Explore modern, advanced backend topics.</p>
          <div class="code-snippet"><h3>ML in the Backend</h3><p>Backends can run complex machine learning models, like custom attention mechanisms in PyTorch, for high-performance AI features.</p></div>
          <div class="code-snippet"><h3>CLI Tools for Backend Configuration</h3><p>Use libraries like Python's `click` to build command-line interfaces that guide developers through backend setup and deployment.</p></div>
      </div>
  </div>

  <!-- Step 6: FRQ & Reflection -->
  <div class="section" id="step6">
      <div class="card">
          <h2>6 — Free Response Question</h2>
          <p>Apply what you've learned by answering the free-response question below.</p>
          <div class="frq-box" id="quest-frq" style="border:1px solid #2c2c2e; padding:1rem; border-radius:8px; margin:1.5rem 0; background:#1c1c1e; color:#e5e5ea; font-weight:300;">
            <b>FRQ:</b> <span id="frq-question">Describe the backend API or database feature you plan to implement.</span><br><br>
            <textarea id="frq-answer" rows="5" placeholder="Type your response here..." style="width:100%; border-radius:6px; border:1px solid #3a3a3c; padding:0.5rem; margin-top:0.5rem; background:#2c2c2e; color:#f2f2f7;"></textarea>
            <button id="frq-grade-btn" style="margin-top:10px;">Grade</button>
            <div id="frq-feedback"></div>
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

<script type="module">
// ========== State & Navigation ==========
let currentStep = 0;
const steps = ['step1', 'step2', 'step3', 'step4', 'step5', 'step6'];
const STORAGE_KEY = 'backend_combined_v1';

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

function persist() {
  const data = { step: currentStep };
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); } catch (e) {}
}

function restore() {
  try {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (data) showStep(data.step || 0);
  } catch (e) {}
}

// ========== Interactive Scripts ==========
// Quiz 1
(() => {
 const form = document.getElementById('quiz-form');
 if(!form) return;
 const resultSpan = document.getElementById('quiz-result');
 const resetBtn = document.getElementById('quiz-reset');
 const answers = ['C','C','B','B','B'];
 form.addEventListener('submit', (e) => {
   e.preventDefault();
   let score = 0;
   for (let i = 0; i < answers.length; i++) {
     const selected = form.elements['q' + i] ? form.elements['q' + i].value : null;
     if (selected === answers[i]) score += 1;
   }
   resultSpan.textContent = `You scored ${score} / ${answers.length}`;
 });
 resetBtn.addEventListener('click', () => { form.reset(); resultSpan.textContent = ''; });
})();

// Vocab 2
(() => {
  const answers = ['TABLE','ROW','JSON','POST','JOIN'];
  const submitBtn = document.getElementById('vocab2-submit');
  if(!submitBtn) return;
  const resetBtn = document.getElementById('vocab2-reset');
  const resultSpan = document.getElementById('vocab2-result');
  const container = document.getElementById('vocab-crossword');
  submitBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const vals = Array.from(container.querySelectorAll('input')).map(i => i.value.trim().toUpperCase());
    let score = 0;
    for (let i = 0; i < answers.length; i++) if (vals[i] === answers[i]) score += 1;
    resultSpan.textContent = `You scored ${score} / ${answers.length}`;
  });
  resetBtn.addEventListener('click', () => {
    container.querySelectorAll('input').forEach(i => { i.value = ''; });
    resultSpan.textContent = '';
  });
})();

// Quiz 3
(() => {
  const form = document.getElementById('quiz-form-3');
  if(!form) return;
  const resultSpan = document.getElementById('quiz-result-3');
  const answers = ['A','B','B','B','B'];
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let score = 0;
    for (let i = 0; i < answers.length; i++) {
      const selected = form.elements['q' + i] ? form.elements['q' + i].value : null;
      if (selected === answers[i]) score += 1;
    }
    resultSpan.textContent = `You scored ${score} / ${answers.length}`;
  });
})();

// API Tester
const mockEndpoints = {
    'GET:/api/users': { status: 200, body: [{ id: 1, name: 'Alice' }, { id: 2, name: 'Bob' }] },
    'GET:/api/invalid': { status: 404, body: { error: 'Not Found' } }
};
window.sendRequest = function(event) {
    const key = document.getElementById('endpoint-select').value;
    const mockResponse = mockEndpoints[key];
    const btn = event.target;
    btn.disabled = true;
    btn.textContent = 'Sending...';
    setTimeout(() => {
        const responseContainer = document.getElementById('response-container');
        if(responseContainer) {
            responseContainer.classList.add('active');
            document.getElementById('status-code').textContent = mockResponse.status;
            document.getElementById('response-time').textContent = `Response time: ${Math.floor(Math.random() * 100) + 50}ms`;
            document.getElementById('response-body').textContent = JSON.stringify(mockResponse.body, null, 2);
        }
        btn.disabled = false;
        btn.textContent = 'Send Request';
    }, 500);
}

// FRQ
import { javaURI } from '{{ site.baseurl }}/assets/js/api/config.js';
const frqBtn = document.getElementById('frq-grade-btn');
if(frqBtn) {
    frqBtn.addEventListener('click', async () => {
        const q = document.getElementById('frq-question').textContent.trim();
        const a = document.getElementById('frq-answer').value.trim();
        const fb = document.getElementById('frq-feedback');
        if (!a) { fb.innerHTML = '<span style="color:red;">Please enter a response.</span>'; return; }
        frqBtn.disabled = true; fb.innerHTML = 'Grading...';
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
            frqBtn.disabled = false;
        }
    });
}

// ========== Boot ==========
document.addEventListener('DOMContentLoaded', () => {
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
        var p = location.pathname.replace(/\/$/,'').split('/');
        if (p.length>1){ p.pop(); window.location.href = p.join('/') + '/'; } else { window.location.href = '/'; }
      });
    });
  });
})();
</script>
