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

  .section { display: none; }
  .section.active { display: block; }

  .card { background: var(--panel); border: 1px solid var(--border); border-radius: 12px; padding: 20px; margin-bottom: 16px; }
  .card h2 { margin-top: 0; font-size: 20px; color: #a6c9ff; }
  .card h3 { margin-top: 16px; font-size: 16px; color: #a6c9ff; }

  .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
  @media (max-width: 900px) { .grid { grid-template-columns: 1fr; } }

  input, textarea {
    background: #051226;
    border: 1px solid var(--border);
    border-radius: 10px;
    padding: 12px;
    color: #dce9ff;
    font-family: Inter, system-ui, sans-serif;
    font-size: 14px;
    width: 100%;
  }
  input:focus, textarea:focus { outline: none; box-shadow: 0 0 8px rgba(124, 58, 237, 0.3); }

  .preview-box { background: #0f1729; border: 1px solid var(--border); border-radius: 10px; padding: 12px; min-height: 200px; overflow: auto; }

  .nav-buttons { display: flex; gap: 12px; margin-top: 24px; justify-content: space-between; }

  .tooltip { font-size: 11px; color: var(--muted); margin-top: 6px; }

  .exercise { background: rgba(124, 58, 237, 0.1); border-left: 3px solid var(--accent); padding: 12px; border-radius: 6px; margin: 8px 0; }

</style>

<div class="container page-content">
  <div class="header">
    <h1>Resume — All-in-One</h1>
    <p>Short, interactive steps. Autosaves locally.</p>
    <a href="../" class="button back-btn">Back</a>
  </div>

  <div class="progress-bar-container">
    <div class="flex justify-between text-sm" style="color: var(--muted);">
      <span>Progress</span><span id="progressLabel">Step 1 / 6</span>
    </div>
    <div class="w-full bg-gray-200 rounded h-2 mt-2" style="background: rgba(255,255,255,0.1);">
      <div id="progressBar" class="bg-blue-600 h-2 rounded" style="width:16.6667%; background: var(--accent);"></div>
    </div>
  </div>

  <!-- Steps -->
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

  <section data-step="1" class="section hidden">
    <div class="card">
      <h2>2 — Skills</h2>
      <div class="grid">
        <div>
          <h3>Hard Skills</h3>
          <div id="hardSkillsGrid" class="grid gap-2"></div>
          <div class="flex gap-2 mt-2">
            <input id="customHardSkill" placeholder="Add hard skill" class="flex-1" />
            <button id="addHardSkillBtn" class="px-3 py-1 border rounded">Add</button>
          </div>
          <div id="hardSkillTags" class="flex flex-wrap gap-2 mt-2"></div>
        </div>
        <div>
          <h3>Soft Skills</h3>
          <div id="softSkillsGrid" class="grid gap-2"></div>
          <div class="flex gap-2 mt-2">
            <input id="customSoftSkill" placeholder="Add soft skill" class="flex-1" />
            <button id="addSoftSkillBtn" class="px-3 py-1 border rounded">Add</button>
          </div>
          <div id="softSkillTags" class="flex flex-wrap gap-2 mt-2"></div>
        </div>
      </div>
    </div>
  </section>

  <section data-step="2" class="section hidden">
    <div class="card">
      <h2>3 — Education</h2>
      <input id="school" placeholder="School / Program" />
      <input id="degree" placeholder="Degree / Dates" />
      <textarea id="eduHighlights" rows="3" placeholder="Highlights (one per line)"></textarea>
    </div>
  </section>

  <section data-step="3" class="section hidden">
    <div class="card">
      <h2>4 — Experiences</h2>
      <div class="flex justify-between items-center">
        <h3>Add Experiences (Action → Metric → Result)</h3>
        <button id="addExperienceBtn" class="px-3 py-1 border rounded">Add</button>
      </div>
      <div id="experienceContainer" class="space-y-3"></div>

      <div class="exercise mt-2">
        <h3>Drag & drop practice</h3>
        <div class="grid">
          <div id="goodZone" class="min-h-24 p-2 border rounded">Good</div>
          <div id="badZone" class="min-h-24 p-2 border rounded">Bad</div>
        </div>
        <div id="itemsPool" class="mt-2 flex flex-wrap gap-2"></div>
      </div>
    </div>
  </section>

  <section data-step="4" class="section hidden">
    <div class="card">
      <h2>5 — Preview & PDF</h2>
      <div class="preview-box">
        <div id="resumePreview" class="space-y-2 text-sm leading-6"></div>
      </div>
      <div class="flex gap-2 mt-2">
        <button id="downloadPdfBtn" class="px-3 py-2 border rounded">Download PDF</button>
        <button id="saveDraft" class="px-3 py-2 border rounded">Save Draft</button>
        <p id="saveMessage" class="text-sm mt-2"></p>
      </div>
    </div>
  </section>

  <section data-step="5" class="section hidden">
    <div class="card">
      <h2>6 — LinkedIn & Interview</h2>
      <div class="grid">
        <div>
          <h3>LinkedIn Builder</h3>
          <textarea id="aboutPrompt" rows="3" placeholder="Short about text or paste summary"></textarea>
          <button id="generateLinkedInBtn" class="mt-2 px-3 py-2 border rounded">Generate (AI stub)</button>
          <div id="linkedinPreview" class="mt-2 text-sm"></div>
        </div>
        <div>
          <h3>Interview Practice (ELIO)</h3>
          <div class="border rounded p-2">
            <div id="elioQuestion" class="font-semibold mb-2">Press Start</div>
            <div class="flex gap-2">
              <button id="startInterviewBtn" class="px-3 py-1 border rounded">Start</button>
              <button id="nextQuestionBtn" class="px-3 py-1 border rounded">Next</button>
              <button id="endInterviewBtn" class="px-3 py-1 border rounded">End</button>
            </div>
            <div class="tooltip">Uses browser TTS. Try answering out loud and record below.</div>
            <div class="mt-2">
              <div class="video-container" style="height:160px; background:#111; display:flex; align-items:center; justify-content:center; color:#fff;">
                <div id="recordingIndicator" class="hidden">● Recording</div>
              </div>
              <div class="flex gap-2 mt-2">
                <button id="startRecordingBtn" class="px-3 py-1 border rounded">Record</button>
                <button id="stopRecordingBtn" class="px-3 py-1 border rounded">Stop</button>
                <button id="downloadRecBtn" class="px-3 py-1 border rounded">Download</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Bottom Nav -->
  <div class="nav-buttons">
    <button id="prevBtn" class="px-3 py-2 border rounded" disabled>Previous</button>
    <div class="flex gap-2">
      <button id="nextBtn" class="px-3 py-2 border rounded">Next</button>
      <a id="nextModuleBtnNav" class="px-3 py-2 border rounded bg-gray-200 hidden" href="#">Next Module →</a>
    </div>
  </div>

  <!-- Floating Sprite -->
  <video id="floating-sprite" width="150" height="160" loop muted playsinline style="position: fixed; bottom: 20px; right: -200px; border-radius: 16px; box-shadow: 0 4px 15px rgba(0,0,0,0.3); display: none; z-index: 1000;">
    <source id="floating-source" src="" type="video/mp4">
  </video>
</div>

<script>
document.addEventListener('DOMContentLoaded', () => {
  // State
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

  // DOM
  const $ = s => document.querySelector(s);
  const $$ = s => Array.from(document.querySelectorAll('section[data-step]'));
  const steps = $$('section[data-step]');
  const progressBar = $('#progressBar');
  const progressLabel = $('#progressLabel');
  const prevBtn = $('#prevBtn');
  const nextBtn = $('#nextBtn');
  const nextModuleBtnNav = $('#nextModuleBtnNav');

  // Inputs
  const personalIds = ['fullName','email','phone','location'];
  const eduIds = ['school','degree','eduHighlights'];

  // Skills
  const hardSkillsGrid = $('#hardSkillsGrid');
  const softSkillsGrid = $('#softSkillsGrid');
  const hardSkillTags = $('#hardSkillTags');
  const softSkillTags = $('#softSkillTags');
  const customHardSkillInput = $('#customHardSkill');
  const customSoftSkillInput = $('#customSoftSkill');

  // Experiences
  const experienceContainer = $('#experienceContainer');
  const addExperienceBtn = $('#addExperienceBtn');
  const itemsPool = $('#itemsPool');
  const goodZone = $('#goodZone');
  const badZone = $('#badZone');

  // Preview/pdf
  const resumePreview = $('#resumePreview');
  const downloadPdfBtn = $('#downloadPdfBtn');
  const saveDraftBtn = $('#saveDraft');
  const saveMessage = $('#saveMessage');

  // LinkedIn
  const aboutPrompt = $('#aboutPrompt');
  const generateLinkedInBtn = $('#generateLinkedInBtn');
  const linkedinPreview = $('#linkedinPreview');

  // Interview
  const elioQuestion = $('#elioQuestion');
  const startInterviewBtn = $('#startInterviewBtn');
  const nextQuestionBtn = $('#nextQuestionBtn');
  const endInterviewBtn = $('#endInterviewBtn');

  // Recording
  const startRecordingBtn = $('#startRecordingBtn');
  const stopRecordingBtn = $('#stopRecordingBtn');
  const downloadRecBtn = $('#downloadRecBtn');
  const recordingIndicator = $('#recordingIndicator');
  let mediaRecorder, recordedChunks = [];

  // Simple step nav
  function showStep(i){
    state.step = Math.max(0, Math.min(steps.length-1, i));
    steps.forEach((el,idx)=> el.classList.toggle('hidden', idx !== state.step));
    steps.forEach((el,idx)=> el.classList.toggle('active', idx === state.step));
    const pct = ((state.step+1)/steps.length)*100;
    progressBar.style.width = pct + '%';
    progressLabel.textContent = `Step ${state.step+1} / ${steps.length}`;
    prevBtn.disabled = state.step===0;
    nextBtn.classList.toggle('hidden', state.step === steps.length-1);
    nextModuleBtnNav.classList.toggle('hidden', state.step !== steps.length-1);
    persist();
    if (state.step === 4) updateResumePreview();
  }
  prevBtn.addEventListener('click', ()=> showStep(state.step-1));
  nextBtn.addEventListener('click', ()=> showStep(state.step+1));

  // Persistence
  function persist(){
    try{ localStorage.setItem(STORAGE_KEY, JSON.stringify({
      personal: state.personal,
      hard: Array.from(state.hardSkills),
      soft: Array.from(state.softSkills),
      education: state.education,
      experiences: state.experiences,
      about: state.about
    })); }catch(e){}
  }
  function restore(){
    try{
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const s = JSON.parse(raw);
      state.personal = s.personal || {};
      (s.hard||[]).forEach(k=>state.hardSkills.add(k));
      (s.soft||[]).forEach(k=>state.softSkills.add(k));
      state.education = s.education || {};
      state.experiences = s.experiences || [];
      state.about = s.about || '';

      // populate inputs
      personalIds.forEach(id=>{ const el=$('#'+id); if(el) el.value = state.personal[id]||''; });
      eduIds.forEach(id=>{ const el=$('#'+id); if(el) el.value = state.education[id]||''; });
      aboutPrompt.value = state.about || '';
    }catch(e){}
  }

  // Bind personal inputs
  personalIds.forEach(id=>{
    const el = $('#'+id); if(!el) return;
    el.addEventListener('input', ()=>{ state.personal[id] = el.value; persist(); });
  });
  eduIds.forEach(id=>{
    const el = $('#'+id); if(!el) return;
    el.addEventListener('input', ()=>{ state.education[id] = el.value; persist(); });
  });

  // Skills UI
  function renderChecklist(gridEl, setRef){
    if(!gridEl) return; gridEl.innerHTML = '';
    Array.from(setRef).forEach(sk => {
      const id = 'sk_' + sk.replace(/[^a-z0-9]/ig,'_');
      const row = document.createElement('label'); row.className='flex items-center gap-2';
      row.innerHTML = `<input type=checkbox data-skill="${escapeHtml(sk)}" id="${id}" checked /> <span>${escapeHtml(sk)}</span>`;
      gridEl.appendChild(row);
      row.querySelector('input').addEventListener('change', (e)=>{
        if (e.target.checked) setRef.add(sk); else setRef.delete(sk);
        renderTags(); persist();
      });
    });
  }
  function renderTags(){
    hardSkillTags.innerHTML = Array.from(state.hardSkills).map(s=>`<span class="px-2 py-1 bg-gray-100 rounded text-sm">${escapeHtml(s)}</span>`).join('');
    softSkillTags.innerHTML = Array.from(state.softSkills).map(s=>`<span class="px-2 py-1 bg-gray-100 rounded text-sm">${escapeHtml(s)}</span>`).join('');
  }

  $('#addHardSkillBtn').addEventListener('click', ()=>{
    const v = customHardSkillInput.value.trim(); if(!v) return; state.hardSkills.add(v); customHardSkillInput.value=''; renderChecklist(hardSkillsGrid, state.hardSkills); renderTags(); persist();
  });
  $('#addSoftSkillBtn').addEventListener('click', ()=>{
    const v = customSoftSkillInput.value.trim(); if(!v) return; state.softSkills.add(v); customSoftSkillInput.value=''; renderChecklist(softSkillsGrid, state.softSkills); renderTags(); persist();
  });

  // Experiences
  function addExperience(initial={title:'',company:'',dates:'',bullets:''}){
    const idx = state.experiences.length;
    state.experiences.push(initial);
    const el = document.createElement('div'); el.className='border rounded p-2';
    el.innerHTML = `
      <input class="w-full border rounded px-2 py-1 mb-1" placeholder="Title" data-idx="${idx}" data-key="title" value="${escapeHtml(initial.title)}" />
      <input class="w-full border rounded px-2 py-1 mb-1" placeholder="Company | Dates" data-idx="${idx}" data-key="company" value="${escapeHtml(initial.company)}" />
      <textarea class="w-full border rounded px-2 py-1" rows=3 placeholder="Bulleted points (one per line)" data-idx="${idx}" data-key="bullets">${escapeHtml(initial.bullets)}</textarea>
      <div class="flex justify-end mt-2"><button class="removeExpBtn px-2 py-1 border rounded">Remove</button></div>
    `;
    experienceContainer.appendChild(el);

    el.querySelectorAll('input,textarea').forEach(inp=>{
      inp.addEventListener('input', (e)=>{
        const k = e.target.dataset.key; const i = Number(e.target.dataset.idx);
        state.experiences[i][k] = e.target.value; persist();
      });
    });
    el.querySelector('.removeExpBtn').addEventListener('click', ()=>{
      state.experiences.splice(idx,1); experienceContainer.removeChild(el); // re-render all to keep indexes stable
      renderExperiences(); persist();
    });
  }
  function renderExperiences(){ experienceContainer.innerHTML=''; const copy = state.experiences.slice(); state.experiences = []; copy.forEach(e=>addExperience(e)); }
  addExperienceBtn.addEventListener('click', ()=>{ addExperience({title:'Project / Role', company:'Org | Dates', bullets:'• Did X\n• Improved Y by 20%'}); persist(); });

  // Drag & Drop practice (simple)
  const dragItems = [
    {text: 'Reduced page load by 40%', good:true},
    {text: 'Responsible for projects', good:false},
    {text: 'Implemented feature increasing retention by 12%', good:true},
    {text: 'Hardworking and motivated', good:false}
  ];
  function initDragPool(){ itemsPool.innerHTML = ''; dragItems.forEach((it, idx)=>{
    const b = document.createElement('button'); b.className='px-2 py-1 border rounded bg-white'; b.draggable=true; b.textContent = it.text; b.dataset.idx = idx;
    b.addEventListener('dragstart', e=> e.dataTransfer.setData('text/plain', idx)); itemsPool.appendChild(b);
  });
  [goodZone,badZone].forEach(z=>{
    z.addEventListener('dragover', e=>e.preventDefault());
    z.addEventListener('drop', e=>{ e.preventDefault(); const idx = e.dataTransfer.getData('text/plain'); const it = dragItems[Number(idx)]; const el = document.querySelector(`[data-idx='${idx}']`); if(el) e.target.appendChild(el); });
  }); }

  // Preview / PDF
  function updateResumePreview(){
    const P = state.personal; const edu = state.education; const exp = state.experiences;
    const name = escapeHtml(P.fullName || '');
    const contact = [P.email, P.phone, P.location].filter(Boolean).join(' • ');
    const eduBlock = edu.school ? `<div><b>${escapeHtml(edu.school)}</b><div class=\"text-sm\">${escapeHtml(edu.degree||'')}</div><div class=\"text-sm\">${escapeHtml(edu.eduHighlights||'')}</div></div>` : '';
    const skills = `<div class=\"text-sm\">${Array.from(state.hardSkills).concat(Array.from(state.softSkills)).map(s=>escapeHtml(s)).join(', ')}</div>`;
    const expHtml = exp.map(e=>`<div><b>${escapeHtml(e.title)}</b> — <span class=\"text-sm\">${escapeHtml(e.company)}</span><div class=\"text-sm ml-4\">${(e.bullets||'').split(/\n/).map(l=>l.trim()).filter(Boolean).map(li=>`<div>• ${escapeHtml(li.replace(/^•\s*/,''))}</div>`).join('')}</div></div>`).join('');
    resumePreview.innerHTML = `<div class=\"mb-1\"><h2 class=\"text-lg font-bold\">${name}</h2><div class=\"text-sm text-gray-600\">${escapeHtml(contact)}</div></div>${eduBlock}<div class=\"mt-2\"><b>Skills</b>${skills}</div><div class=\"mt-2\"><b>Experience</b>${expHtml}</div>`;
  }
  downloadPdfBtn.addEventListener('click', ()=>{
    updateResumePreview(); const { jsPDF } = window.jspdf; const doc = new jsPDF(); doc.setFontSize(12); doc.text((resumePreview.innerText||'').split('\n').slice(0,80).join('\n'), 10, 10); doc.save('Resume.pdf');
  });

  // Save draft
  saveDraftBtn.addEventListener('click', ()=>{ persist(); saveMessage.textContent = 'Saved locally'; saveMessage.className='text-sm mt-2 text-green-700'; setTimeout(()=> saveMessage.textContent='',2000); });

  // LinkedIn generator (local synthesis fallback)
  function synthAbout({fullName, about}){
    if(!about) return `${fullName||''} is a motivated student or early-career developer with hands-on experience building projects and working in teams.`;
    return about;
  }
  generateLinkedInBtn.addEventListener('click', async ()=>{
    const full = state.personal.fullName || $('#fullName').value || 'Candidate';
    const about = aboutPrompt.value.trim(); const out = synthAbout({fullName: full, about}); linkedinPreview.textContent = out; state.about = out; persist();
  });

  // Interview ELIO (simple TTS question flow)
  const interviewQuestions = [
    'Tell me about yourself.',
    'Describe a project you are proud of.',
    'How do you handle team conflict?',
    'Do you have any questions for us?'
  ];
  let currentQuestion = 0;
  function speakText(t){ if(!t) return; if('speechSynthesis' in window){ const u = new SpeechSynthesisUtterance(t); window.speechSynthesis.cancel(); window.speechSynthesis.speak(u); }}
  function askQuestion(){ const q = interviewQuestions[currentQuestion%interviewQuestions.length]; elioQuestion.textContent = q; speakText(q); }
  startInterviewBtn.addEventListener('click', ()=>{ currentQuestion=0; askQuestion(); });
  nextQuestionBtn.addEventListener('click', ()=>{ currentQuestion++; askQuestion(); });
  endInterviewBtn.addEventListener('click', ()=>{ elioQuestion.textContent='Session ended'; window.speechSynthesis.cancel(); });

  // Recording (audio only)
  startRecordingBtn.addEventListener('click', async ()=>{
    try{ const stream = await navigator.mediaDevices.getUserMedia({ audio:true }); recordedChunks = []; mediaRecorder = new MediaRecorder(stream); mediaRecorder.ondataavailable = e=>{ if(e.data.size>0) recordedChunks.push(e.data); };
      mediaRecorder.start(); recordingIndicator.classList.remove('hidden'); recordingIndicator.textContent='● Recording';
    }catch(e){ alert('Microphone access required'); }
  });
  stopRecordingBtn.addEventListener('click', ()=>{ if(mediaRecorder && mediaRecorder.state !== 'inactive'){ mediaRecorder.stop(); recordingIndicator.classList.add('hidden'); } });
  downloadRecBtn.addEventListener('click', ()=>{
    if(!recordedChunks.length){ alert('No recording'); return; }
    const blob = new Blob(recordedChunks, { type:'audio/webm' }); const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = 'interview.webm'; a.click(); URL.revokeObjectURL(url);
  });

  // Floating sprite: show if selectedCharacter set
  const floatingSprite = document.getElementById('floating-sprite'); const floatingSource = document.getElementById('floating-source');
  const savedCharacter = localStorage.getItem('selectedCharacter');
  if(savedCharacter){ showFloatingSprite(savedCharacter); }
  function showFloatingSprite(charId){ const spriteMap = { 'char1': '/hacks/cs-portfolio-quest/resume/sprites/elephant_2.mp4', 'char2':'/hacks/cs-portfolio-quest/resume/sprites/fox_2.mp4' };
    const src = spriteMap[charId]; if(src){ floatingSource.src = src; floatingSprite.style.display = 'block'; floatingSprite.play().catch(()=>{}); }
  }

  // Utilities
  function escapeHtml(s){ return String(s||'').replace(/[&<>'"']/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }

  // Boot
  restore(); renderChecklist(hardSkillsGrid, state.hardSkills); renderChecklist(softSkillsGrid, state.softSkills); renderTags(); renderExperiences(); initDragPool(); showStep(0);
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
        var p = location.pathname.replace(///$/,'').split('/');
        if (p.length>1){ p.pop(); window.location.href = p.join('/') + '/'; } else { window.location.href = '/'; }
      });
    });
  });
})();
</script>

<script src="/assets/js/lesson-completion-bigsix.js"></script>