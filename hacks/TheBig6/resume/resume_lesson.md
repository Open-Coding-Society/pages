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
  /*
   * Colors from system SASS (_sass/minima/lessonbase.scss → :root).
   * Edit lessonbase.scss to change colors — not this file.
   */
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
  .container { max-width: 1000px; margin: 0 auto; padding: 28px 16px 64px; }

  .lesson-header { margin-bottom: 32px; padding-bottom: 20px; border-bottom: 1px solid var(--border); }
  .lesson-header .badge { display: inline-flex; align-items: center; gap: 6px; background: var(--panel-2); border: 1px solid var(--border-b); border-radius: 20px; padding: 3px 12px; font-size: 11px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; color: var(--ac2); margin-bottom: 10px; }
  .lesson-header .badge::before { content: ''; width: 6px; height: 6px; border-radius: 50%; background: var(--ac); box-shadow: 0 0 8px var(--ac); display: inline-block; }
  .lesson-header h1 { font-size: 30px; font-weight: 800; letter-spacing: -0.02em; margin-bottom: 6px; color: var(--txt); }
  .lesson-header p  { color: var(--muted); font-size: 14px; }

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
  .block-desc { font-size: 13px; color: var(--muted); margin-bottom: 16px; line-height: 1.6; }
  .tip { font-size: 12px; color: var(--muted); border-left: 2px solid var(--border-ac); padding-left: 10px; margin-top: 16px; }

  .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
  @media (max-width: 900px) { .grid { grid-template-columns: 1fr; } }

  input, textarea, select { background: var(--code-bg); border: 1px solid var(--border); border-radius: 10px; padding: 12px; color: var(--txt); font-size: 14px; width: 100%; margin-bottom: 8px; }
  input:focus, textarea:focus { outline: none; box-shadow: 0 0 8px rgba(76,175,239,0.3); }

  button { appearance: none; background: var(--panel); border: 1px solid var(--border); border-radius: 8px; color: var(--txt); padding: 8px 14px; font-size: 13px; font-weight: 500; cursor: pointer; transition: background 0.15s, border-color 0.15s, transform 0.1s; }
  button:hover { background: var(--hover-bg); border-color: var(--border-ac); }
  button:disabled { opacity: 0.4; cursor: not-allowed; transform: none; }
  button.primary { background: var(--ac); border-color: var(--border-ac); color: #fff; }
  button.primary:hover { background: var(--accent-700); }
  button.secondary { background: var(--panel-2); border-color: var(--border); }

  .preview-box { background: var(--panel); border: 1px solid var(--border); border-radius: 10px; padding: 12px; min-height: 200px; overflow: auto; }
  #resumePreview { color: var(--txt); }
  #resumePreview b { color: var(--ac); }

  .nav-buttons { display: flex; gap: 12px; margin-top: 24px; justify-content: space-between; }
  .tooltip  { font-size: 11px; color: var(--muted); margin-top: 6px; }
  .exercise { background: rgba(76,175,239,0.1); border-left: 3px solid var(--ac); padding: 12px; border-radius: 6px; margin: 8px 0; }

  .skill-tag { display: inline-block; padding: 4px 10px; background: rgba(76,175,239,0.15); border: 1px solid rgba(76,175,239,0.35); border-radius: 20px; font-size: 12px; color: var(--ac); }
  .skill-check-label { display: flex; align-items: center; gap: 8px; font-size: 13px; color: var(--txt); padding: 4px 0; cursor: pointer; }
  .skill-check-label input[type="checkbox"] { width: 15px; height: 15px; min-width: 15px; padding: 0; margin: 0; background: var(--code-bg); border: 1px solid var(--border); border-radius: 3px; accent-color: var(--ac); cursor: pointer; margin-bottom: 0; }

  .exp-entry { background: var(--code-bg); border: 1px solid var(--border); border-radius: 10px; padding: 14px; margin-bottom: 10px; }
  .exp-entry input, .exp-entry textarea { margin-bottom: 8px; }

  .drop-zone { min-height: 80px; padding: 10px; border: 1px dashed rgba(76,175,239,0.4); border-radius: 8px; background: rgba(76,175,239,0.05); color: var(--muted); font-size: 13px; }
  .drop-zone.drag-over { border-color: var(--ac); background: rgba(76,175,239,0.12); }
  .drag-item { display: inline-block; padding: 5px 12px; background: var(--panel); border: 1px solid var(--border); border-radius: 6px; font-size: 12px; color: var(--txt); cursor: grab; margin: 4px; user-select: none; }
  .drag-item:active { cursor: grabbing; }

  .interview-box { background: var(--code-bg); border: 1px solid var(--border); border-radius: 10px; padding: 14px; }
  .video-container { height: 80px; background: var(--code-bg); border: 1px solid var(--border); border-radius: 8px; display: flex; align-items: center; justify-content: center; color: var(--muted); font-size: 13px; }

  #recordingIndicator { color: var(--red); font-size: 13px; font-weight: 600; animation: blink 1s step-start infinite; }
  @keyframes blink { 50% { opacity: 0; } }

  #linkedinPreview { background: var(--code-bg); border: 1px solid var(--border); border-radius: 8px; padding: 10px; font-size: 13px; color: var(--txt); min-height: 48px; margin-top: 8px; }
  #saveMessage { color: var(--green); font-size: 13px; margin-top: 6px; }

  #nextModuleBtnNav { background: var(--ac); border: none; border-radius: 8px; color: #fff; padding: 6px 14px; font-size: 13px; text-decoration: none; display: inline-flex; align-items: center; }
  #nextModuleBtnNav:hover { background: var(--accent-700); }

  .flex-row-gap { display: flex; gap: 8px; flex-wrap: wrap; align-items: center; }
  .back-btn { display: inline-flex; align-items: center; gap: 6px; margin-top: 12px; font-size: 12px; font-weight: 600; color: var(--muted); text-decoration: none; background: var(--panel-2); border: 1px solid var(--border); border-radius: 6px; padding: 5px 12px; transition: 0.2s; }
  .back-btn:hover { color: var(--txt); border-color: var(--border-b); }
</style>

<div class="container page-content">
  <div class="lesson-header">
    <div class="badge">Grinders · Lesson 4</div>
    <h1>Resume — All-in-One</h1>
    <p>Short, interactive steps. Build your resume, export PDF, and practice interviews.</p>
    <a href="../" class="button back-btn">← Back to Big Six</a>
  </div>

  <div class="progress-track">
    <div class="progress-steps" id="progressSteps"></div>
  </div>

  <!-- Step 1 -->
  <section data-step="0" id="step1" class="section active">
    <div class="card">
      <h2><span class="step-num">1</span> Contact</h2>
      <p class="block-desc">Fill in your basic contact information — this is the first thing recruiters see.</p>
      <div class="grid">
        <input id="fullName" placeholder="Full name" />
        <input id="email" placeholder="Email" />
        <input id="phone" placeholder="Phone" />
        <input id="location" placeholder="City, State" />
      </div>
      <p class="tip">Keep it short and professional. Use a real contact email.</p>
    </div>
  </section>

  <!-- Step 2 -->
  <section data-step="1" id="step2" class="section">
    <div class="card">
      <h2><span class="step-num">2</span> Skills</h2>
      <p class="block-desc">Select or add your hard and soft skills — these are keywords recruiters search for.</p>
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
      <p class="tip">Aim for 5–8 hard skills that match your target job descriptions.</p>
    </div>
  </section>

  <!-- Step 3 -->
  <section data-step="2" id="step3" class="section">
    <div class="card">
      <h2><span class="step-num">3</span> Education</h2>
      <p class="block-desc">List your school, degree, and key achievements to show academic credibility.</p>
      <input id="school" placeholder="School / Program" />
      <input id="degree" placeholder="Degree / Dates" />
      <textarea id="eduHighlights" rows="3" placeholder="Highlights (one per line)"></textarea>
      <p class="tip">Include GPA only if 3.5+. List relevant coursework if you lack experience.</p>
    </div>
  </section>

  <!-- Step 4 -->
  <section data-step="3" id="step4" class="section">
    <div class="card">
      <h2><span class="step-num">4</span> Experiences</h2>
      <p class="block-desc">Add work, projects, and activities using the Action → Metric → Result formula.</p>
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
      <p class="tip">Use strong action verbs: Built, Designed, Led, Reduced, Increased.</p>
    </div>
  </section>

  <!-- Step 5 -->
  <section data-step="4" id="step5" class="section">
    <div class="card">
      <h2><span class="step-num">5</span> Preview &amp; PDF</h2>
      <p class="block-desc">Review your assembled resume and download it as a polished PDF.</p>
      <div class="preview-box"><div id="resumePreview"></div></div>
      <div class="flex-row-gap" style="margin-top:12px;">
        <button id="downloadPdfBtn">⬇ Download PDF</button>
        <button id="saveDraft">💾 Save Draft</button>
      </div>
      <p id="saveMessage"></p>
      <p class="tip">Keep your resume to one page. Save as PDF to preserve formatting.</p>
    </div>
  </section>

  <!-- Step 6 -->
  <section data-step="5" id="step6" class="section">
    <div class="card">
      <h2><span class="step-num">6</span> LinkedIn &amp; Interview</h2>
      <p class="block-desc">Build your LinkedIn About section and practice interview questions with ELIO.</p>
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
            <div id="elioQuestion" style="font-size:14px; font-weight:600; color:var(--ac); margin-bottom:12px; min-height:40px;">Press Start to begin.</div>
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
      <p class="tip">Practice ELIO answers out loud — fluency improves with repetition.</p>
    </div>
  </section>

  <div class="nav-buttons">
    <button id="prevBtn" disabled class="secondary">← Previous</button>
    <div class="flex-row-gap">
      <span id="stepIndicator" style="color:var(--muted); font-size:12px;">Step 1 / 6</span>
      <button id="nextBtn" class="primary">Next →</button>
    </div>
  </div>

  <video id="floating-sprite" width="150" height="160" loop muted playsinline
    style="position:fixed; bottom:20px; right:-200px; border-radius:16px; box-shadow:0 4px 15px rgba(0,0,0,0.3); display:none; z-index:1000;">
    <source id="floating-source" src="" type="video/mp4">
  </video>
</div>

<script src="/assets/js/bigsix/resume/persistence.js"></script>
<script src="/assets/js/bigsix/resume/skills.js"></script>
<script src="/assets/js/bigsix/resume/experience.js"></script>
<script src="/assets/js/bigsix/resume/preview.js"></script>
<script src="/assets/js/bigsix/resume/linkedin.js"></script>
<script src="/assets/js/bigsix/resume/interview.js"></script>

<script type="module">
import { Navigator } from '/assets/js/bigsix/shared/navigation.js';
window.__ResumeNav = new Navigator({
  progressStyle: 'dots',
  labels: ['Contact', 'Skills', 'Education', 'Experiences', 'Preview PDF', 'LinkedIn'],
  onStep: (step) => {
    const nextBtn = document.getElementById('nextBtn');
    const lastStep = document.querySelectorAll('.section').length - 1;
    if (nextBtn) nextBtn.style.display = step === lastStep ? 'none' : '';
    document.getElementById('nextModuleBtnNav')?.classList.toggle('hidden', step !== lastStep);
    if (step === 4 && window.Resume) new Resume.ResumePreview(window.__resumeState).update();
  },
});
</script>

<script>
document.addEventListener('DOMContentLoaded', () => {
  const $ = id => document.getElementById(id);

  const state = {
    step:        0,
    personal:    {},
    hardSkills:  new Set(['JavaScript', 'Python', 'HTML']),
    softSkills:  new Set(['Communication', 'Teamwork']),
    education:   {},
    experiences: [],
    about:       '',
  };

  window.__resumeState = state;

  // Wire navigation using shared Navigator — persist uses Resume.persist(state)
  __ResumeNav.init(() => Resume.persist(state));

  const saved = Resume.restore();
  if (saved) {
    state.personal    = saved.personal    || {};
    state.education   = saved.education   || {};
    state.experiences = saved.experiences || [];
    state.about       = saved.about       || '';
    (saved.hard || []).forEach(k => state.hardSkills.add(k));
    (saved.soft || []).forEach(k => state.softSkills.add(k));
  }

  ['fullName', 'email', 'phone', 'location'].forEach(id => {
    const el = $(id); if (!el) return;
    el.value = state.personal[id] || '';
    el.addEventListener('input', () => { state.personal[id] = el.value; Resume.persist(state); });
  });

  ['school', 'degree', 'eduHighlights'].forEach(id => {
    const el = $(id); if (!el) return;
    el.value = state.education[id] || '';
    el.addEventListener('input', () => { state.education[id] = el.value; Resume.persist(state); });
  });

  const aboutEl = $('aboutPrompt');
  if (aboutEl) aboutEl.value = state.about || '';

  new Resume.SkillsManager(state).init();
  new Resume.ExperienceManager(state).init();
  new Resume.ResumePreview(state).init();
  new Resume.LinkedInBuilder(state).init();
  new Resume.InterviewRecorder().init();

  const savedChar = localStorage.getItem('selectedCharacter');
  if (savedChar) {
    const src = { char1: '/hacks/cs-portfolio-quest/resume/sprites/elephant_2.mp4', char2: '/hacks/cs-portfolio-quest/resume/sprites/fox_2.mp4' }[savedChar];
    if (src) { $('floating-source').src = src; $('floating-sprite').style.display = 'block'; $('floating-sprite').play().catch(() => {}); }
  }

  // Restore saved step — silent=true so we don't re-persist step 0 over the saved value
  __ResumeNav.showStep(saved?.step || 0, true);
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