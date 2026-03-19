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

  .progress-bar-container {
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 12px;
    margin-bottom: 24px;
  }

  .progress-bar { display: flex; gap: 8px; justify-content: space-between; align-items: center; }
  .progress-bar .step { flex: 1; height: 4px; background: rgba(255, 255, 255, 0.1); border-radius: 2px; transition: 0.2s; }
  .progress-bar .step.active { background: var(--accent); height: 6px; }

  /* Section visibility — JS toggles .hidden/.active */
  .section { display: none; }
  .section.active { display: block; }

  .card { background: var(--panel); border: 1px solid var(--border); border-radius: 12px; padding: 20px; margin-bottom: 16px; }
  .card h2 { margin-top: 0; font-size: 20px; color: #a6c9ff; }
  .card h3 { margin-top: 16px; font-size: 16px; color: #a6c9ff; }

  .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
  @media (max-width: 900px) { .grid { grid-template-columns: 1fr; } }

  /* Unified dark input style — all inputs/textareas everywhere */
  input, textarea, select {
    background: #051226;
    border: 1px solid var(--border);
    border-radius: 10px;
    padding: 12px;
    color: #dce9ff;
    font-family: Inter, system-ui, sans-serif;
    font-size: 14px;
    width: 100%;
    margin-bottom: 8px;
  }
  input:focus, textarea:focus { outline: none; box-shadow: 0 0 8px rgba(124, 58, 237, 0.3); }

  /* Unified dark button style */
  button {
    background: #0f1729;
    border: 1px solid var(--border);
    border-radius: 8px;
    color: var(--text);
    padding: 6px 14px;
    font-family: Inter, system-ui, sans-serif;
    font-size: 13px;
    cursor: pointer;
    transition: background 0.15s, border-color 0.15s;
  }
  button:hover { background: #1a2340; border-color: rgba(124,58,237,0.5); }
  button:disabled { opacity: 0.4; cursor: not-allowed; }

  .preview-box { background: #0f1729; border: 1px solid var(--border); border-radius: 10px; padding: 12px; min-height: 200px; overflow: auto; }
  /* Preview text should be light */
  #resumePreview { color: var(--text); }
  #resumePreview b { color: #a6c9ff; }
  #resumePreview .text-gray-600 { color: var(--muted) !important; }

  .nav-buttons { display: flex; gap: 12px; margin-top: 24px; justify-content: space-between; }

  .tooltip { font-size: 11px; color: var(--muted); margin-top: 6px; }

  .exercise { background: rgba(124, 58, 237, 0.1); border-left: 3px solid var(--accent); padding: 12px; border-radius: 6px; margin: 8px 0; }

  /* Skill tags — dark theme */
  .skill-tag {
    display: inline-block;
    padding: 4px 10px;
    background: rgba(124, 58, 237, 0.15);
    border: 1px solid rgba(124, 58, 237, 0.35);
    border-radius: 20px;
    font-size: 12px;
    color: #c4b5fd;
  }

  /* Skill checklist labels */
  .skill-check-label {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 13px;
    color: var(--text);
    padding: 4px 0;
    cursor: pointer;
  }
  .skill-check-label input[type="checkbox"] {
    width: 15px;
    height: 15px;
    min-width: 15px;
    padding: 0;
    margin: 0;
    background: #051226;
    border: 1px solid var(--border);
    border-radius: 3px;
    accent-color: var(--accent);
    cursor: pointer;
    margin-bottom: 0;
  }

  /* Experience entry cards */
  .exp-entry {
    background: #051226;
    border: 1px solid var(--border);
    border-radius: 10px;
    padding: 14px;
    margin-bottom: 10px;
  }
  .exp-entry input, .exp-entry textarea {
    margin-bottom: 8px;
  }

  /* Drag & drop zones */
  .drop-zone {
    min-height: 80px;
    padding: 10px;
    border: 1px dashed rgba(124, 58, 237, 0.4);
    border-radius: 8px;
    background: rgba(124, 58, 237, 0.05);
    color: var(--muted);
    font-size: 13px;
  }
  .drop-zone.drag-over { border-color: var(--accent); background: rgba(124,58,237,0.12); }

  /* Drag items */
  .drag-item {
    display: inline-block;
    padding: 5px 12px;
    background: #0f1729;
    border: 1px solid var(--border);
    border-radius: 6px;
    font-size: 12px;
    color: var(--text);
    cursor: grab;
    margin: 4px;
    user-select: none;
  }
  .drag-item:active { cursor: grabbing; }

  /* Interview box */
  .interview-box {
    background: #051226;
    border: 1px solid var(--border);
    border-radius: 10px;
    padding: 14px;
  }

  /* Recording area */
  .video-container {
    height: 80px;
    background: #051226;
    border: 1px solid var(--border);
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--muted);
    font-size: 13px;
  }

  #recordingIndicator {
    color: #f87171;
    font-size: 13px;
    font-weight: 600;
    animation: blink 1s step-start infinite;
  }
  @keyframes blink { 50% { opacity: 0; } }

  /* LinkedIn preview area */
  #linkedinPreview {
    background: #051226;
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 10px;
    font-size: 13px;
    color: var(--text);
    min-height: 48px;
    margin-top: 8px;
  }

  /* Save message */
  #saveMessage { color: #4ade80; font-size: 13px; margin-top: 6px; }

  /* Next module link styled as button */
  #nextModuleBtnNav {
    background: var(--accent);
    border: none;
    border-radius: 8px;
    color: #fff;
    padding: 6px 14px;
    font-size: 13px;
    text-decoration: none;
    display: inline-flex;
    align-items: center;
  }
  #nextModuleBtnNav:hover { background: #6d28d9; }

  /* Flex helpers not relying on tailwind gap */
  .flex-row-gap { display: flex; gap: 8px; flex-wrap: wrap; align-items: center; }

  .back-btn {
    display: inline-block;
    margin-top: 8px;
    padding: 5px 12px;
    background: #0f1729;
    border: 1px solid var(--border);
    border-radius: 8px;
    color: var(--muted);
    font-size: 13px;
    text-decoration: none;
  }
  .back-btn:hover { border-color: rgba(124,58,237,0.5); color: var(--text); }
</style>

<div class="container page-content">
  <div class="header">
    <h1>Resume — All-in-One</h1>
    <p>Short, interactive steps. Autosaves locally.</p>
    <a href="../" class="back-btn">← Back</a>
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
          <div id="badZone" class="drop-zone"><span style="font-size:12px; opacity:0.6;">✗ Bad bullet points</span></div>
        </div>
        <div id="itemsPool" class="flex-row-gap"></div>
      </div>
    </div>
  </section>

  <!-- Step 5: Preview & PDF -->
  <section data-step="4" class="section">
    <div class="card">
      <h2>5 — Preview &amp; PDF</h2>
      <div class="preview-box">
        <div id="resumePreview"></div>
      </div>
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
      <button id="nextBtn">Next →</button>
      <a id="nextModuleBtnNav" class="hidden" href="#">Next Module →</a>
    </div>
  </div>

  <!-- Floating Sprite -->
  <video id="floating-sprite" width="150" height="160" loop muted playsinline style="position:fixed; bottom:20px; right:-200px; border-radius:16px; box-shadow:0 4px 15px rgba(0,0,0,0.3); display:none; z-index:1000;">
    <source id="floating-source" src="" type="video/mp4">
  </video>
</div>

<script>
document.addEventListener('DOMContentLoaded', () => {
  // ── State ──────────────────────────────────────────────────────────────────
  const STORAGE_KEY = 'resume_combined_v1';
  const state = {
    step: 0,
    personal: {},
    hardSkills: new Set(['JavaScript','Python','HTML']),
    softSkills: new Set(['Communication','Teamwork']),
    education: {},
    experiences: [],
    about: ''
  };

  // ── DOM helpers ────────────────────────────────────────────────────────────
  const $ = s => document.querySelector(s);
  const getAllSteps = () => Array.from(document.querySelectorAll('section[data-step]'));

  const progressBar       = $('#progressBar');
  const progressLabel     = $('#progressLabel');
  const prevBtn           = $('#prevBtn');
  const nextBtn           = $('#nextBtn');
  const nextModuleBtnNav  = $('#nextModuleBtnNav');

  const personalIds = ['fullName','email','phone','location'];
  const eduIds      = ['school','degree','eduHighlights'];

  const hardSkillsGrid      = $('#hardSkillsGrid');
  const softSkillsGrid      = $('#softSkillsGrid');
  const hardSkillTags       = $('#hardSkillTags');
  const softSkillTags       = $('#softSkillTags');
  const customHardSkillInput = $('#customHardSkill');
  const customSoftSkillInput = $('#customSoftSkill');

  const experienceContainer = $('#experienceContainer');
  const addExperienceBtn    = $('#addExperienceBtn');
  const itemsPool           = $('#itemsPool');
  const goodZone            = $('#goodZone');
  const badZone             = $('#badZone');

  const resumePreview   = $('#resumePreview');
  const downloadPdfBtn  = $('#downloadPdfBtn');
  const saveDraftBtn    = $('#saveDraft');
  const saveMessage     = $('#saveMessage');

  const aboutPrompt        = $('#aboutPrompt');
  const generateLinkedInBtn = $('#generateLinkedInBtn');
  const linkedinPreview    = $('#linkedinPreview');

  const elioQuestion      = $('#elioQuestion');
  const startInterviewBtn = $('#startInterviewBtn');
  const nextQuestionBtn   = $('#nextQuestionBtn');
  const endInterviewBtn   = $('#endInterviewBtn');

  const startRecordingBtn  = $('#startRecordingBtn');
  const stopRecordingBtn   = $('#stopRecordingBtn');
  const downloadRecBtn     = $('#downloadRecBtn');
  const recordingIndicator = $('#recordingIndicator');
  let mediaRecorder, recordedChunks = [];

  // ── Step navigation ────────────────────────────────────────────────────────
  function showStep(i) {
    const steps = getAllSteps();
    state.step = Math.max(0, Math.min(steps.length - 1, i));

    steps.forEach((el, idx) => {
      el.classList.toggle('active', idx === state.step);
      // remove any stray 'hidden' class so CSS .section / .section.active controls display
      el.classList.remove('hidden');
    });

    const pct = ((state.step + 1) / steps.length) * 100;
    progressBar.style.width = pct + '%';
    progressLabel.textContent = `Step ${state.step + 1} / ${steps.length}`;

    prevBtn.disabled = state.step === 0;
    nextBtn.style.display = state.step === steps.length - 1 ? 'none' : '';
    nextModuleBtnNav.classList.toggle('hidden', state.step !== steps.length - 1);

    persist();
    if (state.step === 4) updateResumePreview();
  }

  prevBtn.addEventListener('click', () => showStep(state.step - 1));
  nextBtn.addEventListener('click', () => showStep(state.step + 1));

  // ── Persistence ────────────────────────────────────────────────────────────
  function persist() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        personal:     state.personal,
        hard:         Array.from(state.hardSkills),
        soft:         Array.from(state.softSkills),
        education:    state.education,
        experiences:  state.experiences,
        about:        state.about
      }));
    } catch(e) {}
  }

  function restore() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const s = JSON.parse(raw);
      state.personal   = s.personal   || {};
      state.education  = s.education  || {};
      state.experiences = s.experiences || [];
      state.about      = s.about      || '';
      (s.hard || []).forEach(k => state.hardSkills.add(k));
      (s.soft || []).forEach(k => state.softSkills.add(k));

      personalIds.forEach(id => { const el = $('#' + id); if (el) el.value = state.personal[id] || ''; });
      eduIds.forEach(id => { const el = $('#' + id); if (el) el.value = state.education[id] || ''; });
      if (aboutPrompt) aboutPrompt.value = state.about || '';
    } catch(e) {}
  }

  // Bind personal inputs
  personalIds.forEach(id => {
    const el = $('#' + id); if (!el) return;
    el.addEventListener('input', () => { state.personal[id] = el.value; persist(); });
  });
  eduIds.forEach(id => {
    const el = $('#' + id); if (!el) return;
    el.addEventListener('input', () => { state.education[id] = el.value; persist(); });
  });

  // ── Skills UI ──────────────────────────────────────────────────────────────
  function renderChecklist(gridEl, setRef) {
    if (!gridEl) return;
    gridEl.innerHTML = '';
    Array.from(setRef).forEach(sk => {
      const label = document.createElement('label');
      label.className = 'skill-check-label';
      const cb = document.createElement('input');
      cb.type = 'checkbox';
      cb.dataset.skill = sk;
      cb.checked = true;
      const span = document.createElement('span');
      span.textContent = sk;
      label.appendChild(cb);
      label.appendChild(span);
      gridEl.appendChild(label);
      cb.addEventListener('change', () => {
        if (cb.checked) setRef.add(sk); else setRef.delete(sk);
        renderTags(); persist();
      });
    });
  }

  function renderTags() {
    hardSkillTags.innerHTML = Array.from(state.hardSkills)
      .map(s => `<span class="skill-tag">${escapeHtml(s)}</span>`).join('');
    softSkillTags.innerHTML = Array.from(state.softSkills)
      .map(s => `<span class="skill-tag">${escapeHtml(s)}</span>`).join('');
  }

  $('#addHardSkillBtn').addEventListener('click', () => {
    const v = customHardSkillInput.value.trim(); if (!v) return;
    state.hardSkills.add(v); customHardSkillInput.value = '';
    renderChecklist(hardSkillsGrid, state.hardSkills); renderTags(); persist();
  });
  $('#addSoftSkillBtn').addEventListener('click', () => {
    const v = customSoftSkillInput.value.trim(); if (!v) return;
    state.softSkills.add(v); customSoftSkillInput.value = '';
    renderChecklist(softSkillsGrid, state.softSkills); renderTags(); persist();
  });
  // Allow Enter key in skill inputs
  customHardSkillInput.addEventListener('keydown', e => { if (e.key === 'Enter') $('#addHardSkillBtn').click(); });
  customSoftSkillInput.addEventListener('keydown', e => { if (e.key === 'Enter') $('#addSoftSkillBtn').click(); });

  // ── Experiences ────────────────────────────────────────────────────────────
  function addExperience(initial = { title:'', company:'', dates:'', bullets:'' }) {
    const idx = state.experiences.length;
    state.experiences.push({ ...initial });

    const el = document.createElement('div');
    el.className = 'exp-entry';
    el.innerHTML = `
      <input placeholder="Job Title / Role" data-idx="${idx}" data-key="title" value="${escapeHtml(initial.title || '')}" />
      <input placeholder="Company | Dates" data-idx="${idx}" data-key="company" value="${escapeHtml(initial.company || '')}" />
      <textarea rows="3" placeholder="Bullet points (one per line, start with action verbs)" data-idx="${idx}" data-key="bullets">${escapeHtml(initial.bullets || '')}</textarea>
      <div style="display:flex; justify-content:flex-end; margin-top:4px;">
        <button class="removeExpBtn" style="font-size:12px; color:#f87171; border-color:rgba(248,113,113,0.3);">✕ Remove</button>
      </div>
    `;
    experienceContainer.appendChild(el);

    el.querySelectorAll('input, textarea').forEach(inp => {
      inp.addEventListener('input', e => {
        const k = e.target.dataset.key;
        const i = Number(e.target.dataset.idx);
        if (state.experiences[i]) state.experiences[i][k] = e.target.value;
        persist();
      });
    });
    el.querySelector('.removeExpBtn').addEventListener('click', () => {
      const i = Number(el.querySelector('[data-idx]').dataset.idx);
      state.experiences.splice(i, 1);
      renderExperiences(); persist();
    });
  }

  function renderExperiences() {
    experienceContainer.innerHTML = '';
    const copy = state.experiences.slice();
    state.experiences = [];
    copy.forEach(e => addExperience(e));
  }

  addExperienceBtn.addEventListener('click', () => {
    addExperience({ title:'Project / Role', company:'Org | Dates', bullets:'• Led X\n• Improved Y by 20%' });
    persist();
  });

  // ── Drag & Drop practice ───────────────────────────────────────────────────
  const dragItems = [
    { text:'Reduced page load time by 40%', good:true },
    { text:'Responsible for doing projects', good:false },
    { text:'Implemented feature increasing retention by 12%', good:true },
    { text:'Hardworking and motivated person', good:false }
  ];

  function initDragPool() {
    itemsPool.innerHTML = '';
    dragItems.forEach((it, idx) => {
      const b = document.createElement('div');
      b.className = 'drag-item';
      b.draggable = true;
      b.textContent = it.text;
      b.dataset.idx = idx;
      b.addEventListener('dragstart', e => e.dataTransfer.setData('text/plain', idx));
      itemsPool.appendChild(b);
    });

    [goodZone, badZone].forEach(zone => {
      zone.addEventListener('dragover', e => { e.preventDefault(); zone.classList.add('drag-over'); });
      zone.addEventListener('dragleave', () => zone.classList.remove('drag-over'));
      zone.addEventListener('drop', e => {
        e.preventDefault();
        zone.classList.remove('drag-over');
        const idx = parseInt(e.dataTransfer.getData('text/plain'), 10);
        const sourceEl = document.querySelector(`.drag-item[data-idx="${idx}"]`);
        if (sourceEl) {
          zone.appendChild(sourceEl);
          // Visual feedback
          const isGoodZone = zone.id === 'goodZone';
          const isCorrect = dragItems[idx].good === isGoodZone;
          sourceEl.style.borderColor = isCorrect ? 'rgba(74,222,128,0.6)' : 'rgba(248,113,113,0.6)';
          sourceEl.style.background = isCorrect ? 'rgba(74,222,128,0.08)' : 'rgba(248,113,113,0.08)';
        }
      });
    });
  }

  // ── Resume Preview & PDF ───────────────────────────────────────────────────
  function updateResumePreview() {
    const P   = state.personal;
    const edu = state.education;
    const exp = state.experiences;

    const name    = escapeHtml(P.fullName || '(Your Name)');
    const contact = [P.email, P.phone, P.location].filter(Boolean).map(escapeHtml).join(' &nbsp;•&nbsp; ');

    const eduBlock = edu.school ? `
      <div style="margin-bottom:10px;">
        <b>${escapeHtml(edu.school)}</b>
        <div style="color:var(--muted); font-size:12px;">${escapeHtml(edu.degree || '')}</div>
        <div style="font-size:12px;">${escapeHtml(edu.eduHighlights || '')}</div>
      </div>` : '';

    const allSkills = [...state.hardSkills, ...state.softSkills].map(escapeHtml).join(', ');
    const skillsBlock = allSkills
      ? `<div style="margin-bottom:10px;"><b>Skills</b><div style="font-size:12px; color:var(--muted);">${allSkills}</div></div>`
      : '';

    const expHtml = exp.map(e => `
      <div style="margin-bottom:8px;">
        <b>${escapeHtml(e.title || '')}</b> <span style="color:var(--muted); font-size:12px;">— ${escapeHtml(e.company || '')}</span>
        <div style="font-size:12px; padding-left:12px;">
          ${(e.bullets || '').split('\n').map(l => l.trim()).filter(Boolean)
            .map(li => `<div>• ${escapeHtml(li.replace(/^[•\-]\s*/,''))}</div>`).join('')}
        </div>
      </div>`).join('');

    resumePreview.innerHTML = `
      <div style="border-bottom:1px solid var(--border); padding-bottom:10px; margin-bottom:12px;">
        <div style="font-size:18px; font-weight:800; color:#a6c9ff;">${name}</div>
        <div style="font-size:12px; color:var(--muted);">${contact}</div>
      </div>
      ${eduBlock}
      ${skillsBlock}
      ${expHtml ? `<div><b>Experience</b><div style="margin-top:6px;">${expHtml}</div></div>` : ''}
    `;
  }

  downloadPdfBtn.addEventListener('click', () => {
    updateResumePreview();
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    doc.setFontSize(11);
    const lines = (resumePreview.innerText || '').split('\n').filter(l => l.trim());
    doc.text(lines.slice(0, 80).join('\n'), 10, 10, { maxWidth: 190 });
    doc.save('Resume.pdf');
  });

  saveDraftBtn.addEventListener('click', () => {
    persist();
    saveMessage.textContent = '✓ Saved locally';
    setTimeout(() => { saveMessage.textContent = ''; }, 2000);
  });

  // ── LinkedIn Generator ─────────────────────────────────────────────────────
  function synthAbout({ fullName, about }) {
    if (about) return about;
    const skills = Array.from(state.hardSkills).slice(0, 3).join(', ');
    return `${fullName || 'This candidate'} is a motivated student or early-career developer with hands-on experience in ${skills || 'software development'}, building projects and collaborating in teams.`;
  }

  generateLinkedInBtn.addEventListener('click', () => {
    const full  = state.personal.fullName || $('#fullName').value || 'Candidate';
    const about = aboutPrompt.value.trim();
    const out   = synthAbout({ fullName: full, about });
    linkedinPreview.textContent = out;
    state.about = out;
    persist();
  });

  // ── Interview ELIO ─────────────────────────────────────────────────────────
  const interviewQuestions = [
    'Tell me about yourself.',
    'Describe a project you are proud of.',
    'How do you handle team conflict?',
    'What are your greatest strengths?',
    'Where do you see yourself in 5 years?',
    'Do you have any questions for us?'
  ];
  let currentQuestion = 0;

  function speakText(t) {
    if (!t || !('speechSynthesis' in window)) return;
    const u = new SpeechSynthesisUtterance(t);
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(u);
  }
  function askQuestion() {
    const q = interviewQuestions[currentQuestion % interviewQuestions.length];
    elioQuestion.textContent = q;
    speakText(q);
  }
  startInterviewBtn.addEventListener('click', () => { currentQuestion = 0; askQuestion(); });
  nextQuestionBtn.addEventListener('click', () => { currentQuestion++; askQuestion(); });
  endInterviewBtn.addEventListener('click', () => {
    elioQuestion.textContent = 'Session ended. Great practice!';
    window.speechSynthesis.cancel();
  });

  // ── Recording ──────────────────────────────────────────────────────────────
  startRecordingBtn.addEventListener('click', async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      recordedChunks = [];
      mediaRecorder = new MediaRecorder(stream);
      mediaRecorder.ondataavailable = e => { if (e.data.size > 0) recordedChunks.push(e.data); };
      mediaRecorder.start();
      recordingIndicator.classList.remove('hidden');
    } catch(e) {
      alert('Microphone access is required for recording.');
    }
  });
  stopRecordingBtn.addEventListener('click', () => {
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
      mediaRecorder.stop();
      recordingIndicator.classList.add('hidden');
    }
  });
  downloadRecBtn.addEventListener('click', () => {
    if (!recordedChunks.length) { alert('No recording found. Press Record first.'); return; }
    const blob = new Blob(recordedChunks, { type: 'audio/webm' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href = url; a.download = 'interview.webm'; a.click();
    URL.revokeObjectURL(url);
  });

  // ── Floating sprite ────────────────────────────────────────────────────────
  const floatingSprite = $('#floating-sprite');
  const floatingSource = $('#floating-source');
  const savedCharacter = localStorage.getItem('selectedCharacter');
  if (savedCharacter) showFloatingSprite(savedCharacter);

  function showFloatingSprite(charId) {
    const spriteMap = {
      'char1': '/hacks/cs-portfolio-quest/resume/sprites/elephant_2.mp4',
      'char2': '/hacks/cs-portfolio-quest/resume/sprites/fox_2.mp4'
    };
    const src = spriteMap[charId];
    if (src) {
      floatingSource.src = src;
      floatingSprite.style.display = 'block';
      floatingSprite.play().catch(() => {});
    }
  }

  // ── Utilities ──────────────────────────────────────────────────────────────
  function escapeHtml(s) {
    return String(s || '').replace(/[&<>"']/g, c => ({
      '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'
    }[c]));
  }

  // ── Boot ───────────────────────────────────────────────────────────────────
  restore();
  renderChecklist(hardSkillsGrid, state.hardSkills);
  renderChecklist(softSkillsGrid, state.softSkills);
  renderTags();
  renderExperiences();
  initDragPool();
  showStep(0);
});
</script>

<script>
// Back button handler
(function(){
  document.addEventListener('DOMContentLoaded', function(){
    document.querySelectorAll('a.back-btn').forEach(function(a){
      a.addEventListener('click', function(e){
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.button === 1) return;
        e.preventDefault();
        try {
          if (document.referrer && new URL(document.referrer).origin === location.origin) {
            history.back(); return;
          }
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