--- 
layout: cs-bigsix-lesson
title: "Resume — All-in-One Interactive Lesson"
description: "Compact interactive lesson combining contact, skills, education, experiences, PDF export, LinkedIn builder and interview practice"
permalink: /bigsix/resume_lesson
parent: "bigsix"
lesson_number: 4
team: "Grinders"
categories: [CSP, Resume]
tags: [resume, interactive, skills]
author: "Grinders Team"
date: 2025-12-01
---

<link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
<script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>

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

  .progress-bar-container { border: 1px solid var(--border); border-radius: 12px; padding: 12px; margin-bottom: 24px; }

  .section { display: none; }
  .section.active { display: block; }

  .card { background: var(--panel); border: 1px solid var(--border); border-radius: 12px; padding: 20px; margin-bottom: 16px; }
  .card h2 { margin-top: 0; font-size: 20px; color: #a6c9ff; }
  .card h3 { margin-top: 16px; font-size: 16px; color: #a6c9ff; }

  .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
  @media (max-width: 900px) { .grid { grid-template-columns: 1fr; } }

  input, textarea, select {
    background: #051226; border: 1px solid var(--border); border-radius: 10px;
    padding: 12px; color: #dce9ff; font-family: Inter, system-ui, sans-serif;
    font-size: 14px; width: 100%; margin-bottom: 8px;
  }
  input:focus, textarea:focus { outline: none; box-shadow: 0 0 8px rgba(124, 58, 237, 0.3); }

  button {
    background: #0f1729; border: 1px solid var(--border); border-radius: 8px;
    color: var(--text); padding: 6px 14px; font-family: Inter, system-ui, sans-serif;
    font-size: 13px; cursor: pointer; transition: background 0.15s, border-color 0.15s;
  }
  button:hover { background: #1a2340; border-color: rgba(124,58,237,0.5); }
  button:disabled { opacity: 0.4; cursor: not-allowed; }

  .preview-box { background: #0f1729; border: 1px solid var(--border); border-radius: 10px; padding: 12px; min-height: 200px; overflow: auto; }
  #resumePreview { color: var(--text); }
  #resumePreview b { color: #a6c9ff; }

  .nav-buttons { display: flex; gap: 12px; margin-top: 24px; justify-content: space-between; }
  .tooltip { font-size: 11px; color: var(--muted); margin-top: 6px; }
  .exercise { background: rgba(124, 58, 237, 0.1); border-left: 3px solid var(--accent); padding: 12px; border-radius: 6px; margin: 8px 0; }

  .skill-tag { display: inline-block; padding: 4px 10px; background: rgba(124, 58, 237, 0.15); border: 1px solid rgba(124, 58, 237, 0.35); border-radius: 20px; font-size: 12px; color: #c4b5fd; }
  .skill-check-label { display: flex; align-items: center; gap: 8px; font-size: 13px; color: var(--text); padding: 4px 0; cursor: pointer; }
  .skill-check-label input[type="checkbox"] { width: 15px; height: 15px; min-width: 15px; padding: 0; margin: 0; background: #051226; border: 1px solid var(--border); border-radius: 3px; accent-color: var(--accent); cursor: pointer; margin-bottom: 0; }

  .exp-entry { background: #051226; border: 1px solid var(--border); border-radius: 10px; padding: 14px; margin-bottom: 10px; }
  .exp-entry input, .exp-entry textarea { margin-bottom: 8px; }

  .drop-zone { min-height: 80px; padding: 10px; border: 1px dashed rgba(124, 58, 237, 0.4); border-radius: 8px; background: rgba(124, 58, 237, 0.05); color: var(--muted); font-size: 13px; }
  .drop-zone.drag-over { border-color: var(--accent); background: rgba(124,58,237,0.12); }
  .drag-item { display: inline-block; padding: 5px 12px; background: #0f1729; border: 1px solid var(--border); border-radius: 6px; font-size: 12px; color: var(--text); cursor: grab; margin: 4px; user-select: none; }
  .drag-item:active { cursor: grabbing; }

  .interview-box { background: #051226; border: 1px solid var(--border); border-radius: 10px; padding: 14px; }
  .video-container { height: 80px; background: #051226; border: 1px solid var(--border); border-radius: 8px; display: flex; align-items: center; justify-content: center; color: var(--muted); font-size: 13px; }

  #recordingIndicator { color: #f87171; font-size: 13px; font-weight: 600; animation: blink 1s step-start infinite; }
  @keyframes blink { 50% { opacity: 0; } }

  #linkedinPreview { background: #051226; border: 1px solid var(--border); border-radius: 8px; padding: 10px; font-size: 13px; color: var(--text); min-height: 48px; margin-top: 8px; }
  #saveMessage { color: #4ade80; font-size: 13px; margin-top: 6px; }

  #nextModuleBtnNav { background: var(--accent); border: none; border-radius: 8px; color: #fff; padding: 6px 14px; font-size: 13px; text-decoration: none; display: inline-flex; align-items: center; }
  #nextModuleBtnNav:hover { background: #6d28d9; }

  .flex-row-gap { display: flex; gap: 8px; flex-wrap: wrap; align-items: center; }
  .back-btn { display: inline-block; margin-top: 8px; padding: 5px 12px; background: #0f1729; border: 1px solid var(--border); border-radius: 8px; color: var(--muted); font-size: 13px; text-decoration: none; }
  .back-btn:hover { border-color: rgba(124,58,237,0.5); color: var(--text); }
</style>

<div class="container page-content">
  <div class="header">
    <h1>Resume — All-in-One</h1>
    <p>Short, interactive steps. Autosaves locally.</p>
    <a href="../" class="button back-btn">← Back</a>
  </div>

  <div class="progress-bar-container">
    <div style="display:flex; justify-content:space-between; font-size:13px; color:var(--muted); margin-bottom:8px;">
      <span>Progress</span><span id="progressLabel">Step 1 / 6</span>
    </div>
    <div style="width:100%; background:rgba(255,255,255,0.1); border-radius:4px; height:6px;">
      <div id="progressBar" style="width:16.6667%; height:6px; border-radius:4px; background:var(--accent); transition:width 0.3s;"></div>
    </div>
  </div>

  <!-- Step 1: Contact -->
  <section data-step="0" class="section active">
    <div class="card">
      <h2>1 — Contact</h2>
      <div class="grid">
        <input id="fullName" placeholder="Full name" />
        <input id="email" placeholder="Email" />
        <input id="phone" placeholder="Phone" />
        <input id="location" placeholder="City, State" />
      </div>
      <div class="tooltip">Keep it short and professional. Use a real contact email.</div>
    </div>
  </section>

  <!-- Step 2: Skills -->
  <section data-step="1" class="section">
    <div class="card">
      <h2>2 — Skills</h2>
      <div class="grid">
        <div>
          <h3>Hard Skills</h3>
          <div id="hardSkillsGrid"></div>
          <div class="flex-row-gap" style="margin-top:8px;">
            <input id="customHardSkill" placeholder="Add hard skill" style="flex:1; min-width:0; margin-bottom:0;" />
            <button id="addHardSkillBtn">Add</button>
          </div>
          <div id="hardSkillTags" class="flex-row-gap" style="margin-top:10px;"></div>
        </div>
        <div>
          <h3>Soft Skills</h3>
          <div id="softSkillsGrid"></div>
          <div class="flex-row-gap" style="margin-top:8px;">
            <input id="customSoftSkill" placeholder="Add soft skill" style="flex:1; min-width:0; margin-bottom:0;" />
            <button id="addSoftSkillBtn">Add</button>
          </div>
          <div id="softSkillTags" class="flex-row-gap" style="margin-top:10px;"></div>
        </div>
      </div>
    </div>
  </section>

  <!-- Step 3: Education -->
  <section data-step="2" class="section">
    <div class="card">
      <h2>3 — Education</h2>
      <input id="school" placeholder="School / Program" />
      <input id="degree" placeholder="Degree / Dates" />
      <textarea id="eduHighlights" rows="3" placeholder="Highlights (one per line)"></textarea>
    </div>
  </section>

  <!-- Step 4: Experiences -->
  <section data-step="3" class="section">
    <div class="card">
      <h2>4 — Experiences</h2>
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
        <h3 style="margin:0;">Add Experiences (Action → Metric → Result)</h3>
        <button id="addExperienceBtn">+ Add</button>
      </div>
      <div id="experienceContainer"></div>
      <div class="exercise" style="margin-top:16px;">
        <h3 style="margin-top:0;">Drag &amp; drop practice</h3>
        <p style="font-size:12px; color:var(--muted); margin:4px 0 10px;">Drag each item into the correct zone.</p>
        <div class="grid" style="gap:10px; margin-bottom:10px;">
          <div id="goodZone" class="drop-zone"><span style="font-size:12px; opacity:0.6;">✓ Good bullet points</span></div>
          <div id="badZone"  class="drop-zone"><span style="font-size:12px; opacity:0.6;">✗ Bad bullet points</span></div>
        </div>
        <div id="itemsPool" class="flex-row-gap"></div>
      </div>
    </div>
  </section>

  <!-- Step 5: Preview & PDF -->
  <section data-step="4" class="section">
    <div class="card">
      <h2>5 — Preview &amp; PDF</h2>
      <div class="preview-box"><div id="resumePreview"></div></div>
      <div class="flex-row-gap" style="margin-top:12px;">
        <button id="downloadPdfBtn">⬇ Download PDF</button>
        <button id="saveDraft">💾 Save Draft</button>
      </div>
      <p id="saveMessage"></p>
    </div>
  </section>

  <!-- Step 6: LinkedIn & Interview -->
  <section data-step="5" class="section">
    <div class="card">
      <h2>6 — LinkedIn &amp; Interview</h2>
      <div class="grid">
        <div>
          <h3 style="margin-top:0;">LinkedIn Builder</h3>
          <textarea id="aboutPrompt" rows="3" placeholder="Short about text or paste summary"></textarea>
          <button id="generateLinkedInBtn" style="margin-top:4px;">✨ Generate About</button>
          <div id="linkedinPreview"></div>
        </div>
        <div>
          <h3 style="margin-top:0;">Interview Practice (ELIO)</h3>
          <div class="interview-box">
            <div id="elioQuestion" style="font-size:14px; font-weight:600; color:#a6c9ff; margin-bottom:12px; min-height:40px;">Press Start to begin.</div>
            <div class="flex-row-gap" style="margin-bottom:10px;">
              <button id="startInterviewBtn">▶ Start</button>
              <button id="nextQuestionBtn">→ Next</button>
              <button id="endInterviewBtn">■ End</button>
            </div>
            <div class="tooltip" style="margin-bottom:10px;">Uses browser TTS. Answer out loud and record below.</div>
            <div class="video-container" style="margin-bottom:8px;">
              <div id="recordingIndicator" class="hidden">● Recording</div>
            </div>
            <div class="flex-row-gap">
              <button id="startRecordingBtn">⏺ Record</button>
              <button id="stopRecordingBtn">⏹ Stop</button>
              <button id="downloadRecBtn">⬇ Download</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Bottom Nav -->
  <div class="nav-buttons">
    <button id="prevBtn" disabled>← Previous</button>
    <div class="flex-row-gap">
      <span id="stepIndicator" style="color:var(--muted); font-size:12px;">Step 1 / 6</span>
      <button id="nextBtn">Next →</button>
    </div>
  </div>

  <video id="floating-sprite" width="150" height="160" loop muted playsinline
    style="position:fixed; bottom:20px; right:-200px; border-radius:16px; box-shadow:0 4px 15px rgba(0,0,0,0.3); display:none; z-index:1000;">
    <source id="floating-source" src="" type="video/mp4">
  </video>
</div>

<!-- Feature modules — each registers its functions onto window.Resume -->
<script src="{{ site.baseurl }}/assets/js/bigsix/resume/persistence.js"></script>
<script src="{{ site.baseurl }}/assets/js/bigsix/resume/skills.js"></script>
<script src="{{ site.baseurl }}/assets/js/bigsix/resume/experience.js"></script>
<script src="{{ site.baseurl }}/assets/js/bigsix/resume/preview.js"></script>
<script src="{{ site.baseurl }}/assets/js/bigsix/resume/linkedin.js"></script>
<script src="{{ site.baseurl }}/assets/js/bigsix/resume/interview.js"></script>

<script>
// Boot script — wires navigation and calls each module's init function.
// All feature logic lives in the files above; nothing is duplicated here.
document.addEventListener('DOMContentLoaded', () => {

  const $ = id => document.getElementById(id);

  // ── Shared state ─────────────────────────────────────────────────────────────
  const state = {
    step:        0,
    personal:    {},
    hardSkills:  new Set(['JavaScript', 'Python', 'HTML']),
    softSkills:  new Set(['Communication', 'Teamwork']),
    education:   {},
    experiences: [],
    about:       '',
  };

  // ── Navigation ────────────────────────────────────────────────────────────────
  function showStep(i) {
    const steps = Array.from(document.querySelectorAll('section[data-step]'));
    state.step  = Math.max(0, Math.min(steps.length - 1, i));

    steps.forEach((el, idx) => {
      el.classList.toggle('active', idx === state.step);
      el.classList.remove('hidden');
    });

    const pct = ((state.step + 1) / steps.length) * 100;
    $('progressBar').style.width    = pct + '%';
    $('progressLabel').textContent  = `Step ${state.step + 1} / ${steps.length}`;
    $('stepIndicator').textContent  = `Step ${state.step + 1} / ${steps.length}`;

    $('prevBtn').disabled           = state.step === 0;
    $('nextBtn').style.display      = state.step === steps.length - 1 ? 'none' : '';
    $('nextModuleBtnNav')?.classList.toggle('hidden', state.step !== steps.length - 1);

    Resume.persist(state);
    if (state.step === 4) Resume.updatePreview(state);
  }

  // Single listener each — no onclick attributes on the buttons
  $('prevBtn').addEventListener('click', () => showStep(state.step - 1));
  $('nextBtn').addEventListener('click', () => showStep(state.step + 1));

  // ── Restore saved state ───────────────────────────────────────────────────────
  const saved = Resume.restore();
  if (saved) {
    state.personal    = saved.personal    || {};
    state.education   = saved.education   || {};
    state.experiences = saved.experiences || [];
    state.about       = saved.about       || '';
    (saved.hard || []).forEach(k => state.hardSkills.add(k));
    (saved.soft || []).forEach(k => state.softSkills.add(k));
  }

  // Bind + restore personal inputs
  ['fullName', 'email', 'phone', 'location'].forEach(id => {
    const el = $(id); if (!el) return;
    el.value = state.personal[id] || '';
    el.addEventListener('input', () => { state.personal[id] = el.value; Resume.persist(state); });
  });

  // Bind + restore education inputs
  ['school', 'degree', 'eduHighlights'].forEach(id => {
    const el = $(id); if (!el) return;
    el.value = state.education[id] || '';
    el.addEventListener('input', () => { state.education[id] = el.value; Resume.persist(state); });
  });

  const aboutEl = $('aboutPrompt');
  if (aboutEl) aboutEl.value = state.about || '';

  // ── Init each feature module ──────────────────────────────────────────────────
  Resume.initSkills(state);
  Resume.initExperiences(state);
  Resume.initPreview(state);
  Resume.initLinkedIn(state);
  Resume.initInterview();

  // ── Floating sprite ───────────────────────────────────────────────────────────
  const savedChar = localStorage.getItem('selectedCharacter');
  if (savedChar) {
    const src = { char1: '/hacks/cs-portfolio-quest/resume/sprites/elephant_2.mp4', char2: '/hacks/cs-portfolio-quest/resume/sprites/fox_2.mp4' }[savedChar];
    if (src) { $('floating-source').src = src; $('floating-sprite').style.display = 'block'; $('floating-sprite').play().catch(() => {}); }
  }

  // ── Boot to saved step (always last) ─────────────────────────────────────────
  showStep(saved?.step || 0);
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
        var p = location.pathname.replace(/\/$/,'').split('/');
        if (p.length > 1) { p.pop(); window.location.href = p.join('/') + '/'; }
        else { window.location.href = '/'; }
      });
    });
  });
})();
</script>

<script src="/assets/js/lesson-completion-bigsix.js"></script>