---
layout: cs-portfolio-lesson
title: "Experiences and Achievments"
description: "Learn about why you need experiences/achievments on your resume and add your own"
permalink: /cs-portfolio-quest/resume/submodule_3/
parent: "Resume Building"
team: "Grinders"
submodule: 3
categories: [CSP, Submodule, ResumeBuilding]
tags: [resume, submodule, grinders]
author: "Grinders Team"
date: 2025-10-21
---

<html>
<title>Impact & Experience Builder - Dark Mode</title>
<link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
<style>
  body {
    background-color: #1a1a1a;
    color: #e5e5e5;
  }
  .bg-dark-card {
    background-color: #2d2d2d;
  }
  .bg-dark-input {
    background-color: #3a3a3a;
    color: #e5e5e5;
    border-color: #4a4a4a;
  }
  .bg-dark-input:focus {
    outline: none;
    border-color: #60a5fa;
  }
  .border-dark {
    border-color: #4a4a4a;
  }
  .text-gray-custom {
    color: #a0a0a0;
  }
  .bg-dark-hover:hover {
    background-color: #3a3a3a;
  }
</style>
</head>
<body class="min-h-screen">

<div class="max-w-3xl mx-auto p-4">
  <h1 class="text-2xl font-bold mb-2 text-white">Impact & Experience Builder</h1>
  <p class="text-gray-custom mb-4">Learn to write measurable, clear experiences. Saved locally on your device.</p>

  <!-- Progress -->
  <div class="border border-dark rounded p-3 mb-4 bg-dark-card">
    <div class="flex justify-between text-sm text-gray-custom">
      <span>Progress</span><span id="progressLabel">Step 1 / 5</span>
    </div>
    <div class="w-full bg-gray-700 rounded h-2 mt-2">
      <div id="progressBar" class="bg-blue-600 h-2 rounded" style="width:20%"></div>
    </div>
  </div>

  <!-- STEP 1: Why it matters -->
  <section data-step="0" class="space-y-3">
    <h2 class="text-xl font-semibold text-white">Why this matters</h2>
    <p class="text-gray-300">Your experience should show <b class="text-white">action + result</b>. You'll see examples and try a quick activity before writing your own.</p>
    <details class="border border-dark rounded p-3 bg-dark-card">
      <summary class="font-medium cursor-pointer text-white">What employers look for first</summary>
      <ul class="list-disc ml-5 mt-2 text-sm text-gray-300">
        <li><b class="text-white">Action verbs</b> (Developed, Optimized, Led)</li>
        <li><b class="text-white">Metrics</b> (% / time / $ / users)</li>
        <li><b class="text-white">Clear results</b> (what you improved and how it made an impact)</li>
      </ul>
    </details>
    <div class="border border-dark rounded p-3 bg-dark-card">
      <div class="font-medium mb-2 text-white">Mini-quiz: Which phrase is stronger?</div>
      <div class="space-y-1 text-sm text-gray-300" id="miniQuiz">
        <label class="flex items-center gap-2 cursor-pointer hover:text-white"><input type="radio" name="q1" value="a"> Helped the team with various tasks</label>
        <label class="flex items-center gap-2 cursor-pointer hover:text-white"><input type="radio" name="q1" value="b"> Developed an API that reduced response time by 40%</label>
      </div>
      <p id="miniQuizResult" class="text-sm mt-2"></p>
    </div>
<<<<<<< HEAD
    <!-- moved to the right -->
    <div class="flex justify-end">
      <button id="toStep2" class="px-3 py-2 border rounded">See examples →</button>
=======
    <div>
      <button id="toStep2" class="px-3 py-2 border border-dark rounded bg-dark-card text-white hover:bg-gray-700">See examples →</button>
>>>>>>> 5d452b56c (changes to mod 3, changing styling)
    </div>
  </section>

  <!-- STEP 2: Good vs Bad -->
  <section data-step="1" class="space-y-3 hidden">
    <h2 class="text-xl font-semibold text-white">Good vs Bad</h2>
    <p class="text-gray-300">Toggle between examples to see what works.</p>
    <div class="grid md:grid-cols-2 gap-3">
      <!-- GOOD -->
      <div class="border border-green-600 rounded p-3 bg-dark-card">
        <h3 class="font-semibold mb-1 text-green-400">GOOD Example</h3>
        <div>
          <div class="font-medium text-white">Software Engineering Intern</div>
          <div class="text-sm text-gray-custom mb-2"><em>Tech Solutions Inc. • Jun 2024 – Aug 2024</em></div>
          <ul class="list-disc ml-5 text-sm space-y-1 text-gray-300">
            <li>Developed a React/Node dashboard that reduced support time by <b class="text-white">35%</b></li>
            <li>Implemented REST APIs for <b class="text-white">10,000+ DAU</b></li>
            <li>Optimized PostgreSQL queries, improving load time by <b class="text-white">50%</b></li>
          </ul>
          <p class="text-sm mt-2 text-gray-300"><b class="text-white">Skills:</b> JavaScript, React, Node.js, PostgreSQL, Git</p>
        </div>
        <div class="mt-3">
          <div class="font-semibold text-green-400">Why it works</div>
          <ul class="list-disc ml-5 text-sm mt-1 text-gray-300">
            <li>Specific and measurable</li>
            <li>Strong verbs</li>
            <li>Clear tools</li>
          </ul>
        </div>
      </div>
      <!-- BAD -->
      <div class="border border-red-600 rounded p-3 bg-dark-card">
        <h3 class="font-semibold mb-1 text-red-400">BAD Example</h3>
        <div>
          <div class="font-medium text-white">Intern</div>
          <div class="text-sm text-gray-custom mb-2"><em>Some Company • Summer 2024</em></div>
          <ul class="list-disc ml-5 text-sm space-y-1 text-gray-300">
            <li>Worked on code projects</li>
            <li>Helped the team with tasks</li>
            <li>Learned a lot about development</li>
          </ul>
          <p class="text-sm mt-2 text-gray-300"><b class="text-white">Skills:</b> Coding, Computers, Hard worker</p>
        </div>
        <div class="mt-3">
          <div class="font-semibold text-red-400">Why it doesn't work</div>
          <ul class="list-disc ml-5 text-sm mt-1 text-gray-300">
            <li>Vague and lacks metrics</li>
            <li>Weak verbs</li>
            <li>No clear impact</li>
          </ul>
        </div>
      </div>
    </div>
<<<<<<< HEAD
    <!-- moved to the right -->
    <div class="flex justify-end">
      <button id="toStep3" class="px-3 py-2 border rounded">Practice: drag & drop →</button>
=======
    <div>
      <button id="toStep3" class="px-3 py-2 border border-dark rounded bg-dark-card text-white hover:bg-gray-700">Practice: drag & drop →</button>
>>>>>>> 5d452b56c (changes to mod 3, changing styling)
    </div>
  </section>

  <!-- STEP 3: Drag & Drop -->
  <section data-step="2" class="space-y-3 hidden">
    <h2 class="text-xl font-semibold text-white">Interactive: Sort Good vs Bad</h2>
    <p class="text-gray-300">Drag each card into the correct column.</p>
    <div class="text-center font-medium text-white">Score: <span id="score">0</span> / <span id="total">0</span></div>
    <div class="grid md:grid-cols-2 gap-3">
      <div>
        <div class="border-2 border-dashed border-green-600 rounded p-3 min-h-[160px] bg-dark-card" id="goodZone">
          <div class="font-semibold mb-1 text-green-400">GOOD</div>
          <p class="text-sm text-gray-custom">Drop the good ones here</p>
        </div>
      </div>
      <div>
        <div class="border-2 border-dashed border-red-600 rounded p-3 min-h-[160px] bg-dark-card" id="badZone">
          <div class="font-semibold mb-1 text-red-400">BAD</div>
          <p class="text-sm text-gray-custom">Drop the bad ones here</p>
        </div>
      </div>
    </div>
    <div>
      <div class="font-medium mb-1 text-white">Items:</div>
      <div id="itemsPool" class="border border-dark rounded p-3 flex flex-wrap gap-2 bg-dark-card"></div>
    </div>
<<<<<<< HEAD
    <!-- left: check/continue; right: skip/next -->
    <div class="flex items-center justify-between gap-2">
      <div class="flex gap-2">
        <button id="checkAnswersBtn" class="px-3 py-2 border rounded hidden">Check my answers</button>
        <button id="toStep4" class="px-3 py-2 border rounded hidden">Start writing →</button>
      </div>
      <div class="flex justify-end">
        <button id="skipToStep4" class="px-3 py-2 border rounded">Skip to writing →</button>
      </div>
=======
    <div class="flex gap-2">
      <button id="checkAnswersBtn" class="px-3 py-2 border border-dark rounded bg-dark-card text-white hover:bg-gray-700 hidden">Check my answers</button>
      <button id="toStep4" class="px-3 py-2 border border-dark rounded bg-dark-card text-white hover:bg-gray-700 hidden">Start writing →</button>
>>>>>>> 5d452b56c (changes to mod 3, changing styling)
    </div>
  </section>

  <!-- STEP 4: Writing Form -->
  <section data-step="3" class="space-y-3 hidden">
    <h2 class="text-xl font-semibold text-white">Write your experience</h2>
    <p class="text-gray-300">Start with a brief summary, then add experiences using verbs, metrics, and results.</p>
    <div>
      <label class="block text-sm font-medium text-white">Professional Summary *</label>
      <textarea id="summary" rows="3" class="w-full border rounded px-3 py-2 bg-dark-input" placeholder="Ex: CS student with full-stack experience; launched an app that reduced support time by 35%"></textarea>
    </div>
    <div class="border border-dark rounded p-3 bg-dark-card">
      <div class="font-medium mb-2 text-white">Experiences</div>
      <div id="experienceContainer" class="space-y-3"></div>
      <button id="addExperienceBtn" class="px-3 py-2 border border-dark rounded bg-dark-input text-white hover:bg-gray-700">+ Add experience</button>
    </div>
    <div class="text-sm text-gray-custom">
      Tip: Use the <b class="text-white">Action → Metric → Result</b> format. Example: "Optimized SQL queries, reducing latency by 50% and increasing weekly retention by 12%."
    </div>
<<<<<<< HEAD
    <div class="flex justify-end">
      <button id="toStep5" class="px-3 py-2 border rounded">Preview →</button>
    </div>
  </section>

<!-- STEP 5: Resume Preview -->
<section data-step="4" class="space-y-3 hidden">
  <h2 class="text-xl font-semibold">Preview</h2>
  <div id="resumePreview" class="border rounded p-4 space-y-3 text-sm leading-6"></div>

  <!-- Actions row: Prev on left, other buttons on right -->
  <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
    <button id="prevBtn" class="px-3 py-2 border rounded">Previous</button>
    <div class="flex flex-wrap gap-2">
      <button id="saveDraft" class="px-3 py-2 border rounded">Save Draft</button>
      <button id="submitFinal" class="px-3 py-2 border rounded">Submit Final</button>
      <button
        id="nextModuleBtnNav"
        data-href="/cs-portfolio-quest/resume/submodule_4/"
        class="px-3 py-2 border rounded bg-red-600 text-white disabled:opacity-60"
        disabled
      >Next Module →</button>
    </div>
=======
    <div>
      <button id="toStep5" class="px-3 py-2 border border-dark rounded bg-dark-card text-white hover:bg-gray-700">Preview →</button>
    </div>
  </section>

  <!-- STEP 5: Resume Preview -->
  <section data-step="4" class="space-y-3 hidden">
    <h2 class="text-xl font-semibold text-white">Preview</h2>
    <div id="resumePreview" class="border border-dark rounded p-4 space-y-3 text-sm leading-6 bg-dark-card"></div>
    <div class="grid md:grid-cols-2 gap-2">
      <button id="saveDraft" class="px-3 py-2 border border-dark rounded bg-dark-card text-white hover:bg-gray-700">Save Draft</button>
      <button id="submitFinal" class="px-3 py-2 border border-dark rounded bg-blue-600 text-white hover:bg-blue-700">Submit Final</button>
    </div>
    <p id="saveMessage" class="text-sm mt-1"></p>
  </section>

  <!-- Bottom Navigation -->
  <div class="flex justify-between mt-4">
    <button id="prevBtn" class="px-3 py-2 border border-dark rounded bg-dark-card text-white hover:bg-gray-700 disabled:opacity-40" disabled>Previous</button>
    <button
      id="nextModuleBtnNav"
      data-href="/cs-portfolio-quest/resume/submodule_4/"
      class="px-3 py-2 border border-dark rounded hidden bg-red-600 text-white disabled:opacity-60 hover:opacity-90"
      disabled
    >Next Module →</button>
>>>>>>> 5d452b56c (changes to mod 3, changing styling)
  </div>

  <p id="saveMessage" class="text-sm mt-1"></p>
</section>

<!-- Bottom Navigation -->
<div class="flex justify-between mt-4">
  <button id="prevBtn" class="px-3 py-2 border rounded" disabled>Previous</button>
  <button
    id="nextModuleBtnNav"
    data-href="/cs-portfolio-quest/resume/submodule_4/"
    class="px-3 py-2 border rounded hidden bg-red-600 text-white disabled:opacity-60"
    disabled
  >Next Module →</button>
</div>

  <!-- Floating Selected Sprite -->
<video id="floating-sprite" width="150" height="160" loop muted playsinline style="
  position: fixed;
  bottom: 20px;
  right: -200px;
  border-radius: 16px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.3);
  display: none;
  z-index: 1000;
">
  <source id="floating-source" src="" type="video/mp4">
</video>

</div>

<script>
document.addEventListener('DOMContentLoaded', () => {
  const state = {
    step: 0,
    submitted: false,
    summary: "",
    experiences: []
  };

  const $  = s => document.querySelector(s);
  const $$ = s => Array.from(document.querySelectorAll(s));
  const steps = $$('section[data-step]');
  const progressBar   = $('#progressBar');
  const progressLabel = $('#progressLabel');

  const prevBtn = $('#prevBtn');
  const nextModuleBtnNav = $('#nextModuleBtnNav');

  const miniQuiz = $('#miniQuiz');
  const miniQuizResult = $('#miniQuizResult');
  const toStep2 = $('#toStep2');

  const toStep3 = $('#toStep3');

  const itemsPool = $('#itemsPool');
  const goodZone = $('#goodZone');
  const badZone  = $('#badZone');
  const checkAnswersBtn = $('#checkAnswersBtn');
  const toStep4 = $('#toStep4');
  const skipToStep4 = $('#skipToStep4'); // NEW
  const scoreSpan = $('#score');
  const totalSpan = $('#total');

  const summaryEl = $('#summary');
  const experienceContainer = $('#experienceContainer');
  const addExperienceBtn = $('#addExperienceBtn');
  const toStep5 = $('#toStep5');

  const resumePreview = $('#resumePreview');
  const saveDraftBtn = $('#saveDraft');
  const submitFinalBtn = $('#submitFinal');
  const saveMessage = $('#saveMessage');

  function showStep(i){
    state.step = Math.max(0, Math.min(steps.length-1, i));
    steps.forEach((el,idx)=>el.classList.toggle('hidden', idx!==state.step));
    const pct = ((state.step+1)/steps.length)*100;
    progressBar.style.width = pct + '%';
    progressLabel.textContent = `Step ${state.step+1} / ${steps.length}`;
    prevBtn.disabled = state.step===0;

    const onLast = state.step === steps.length - 1;
    nextModuleBtnNav.classList.toggle('hidden', !onLast);
    nextModuleBtnNav.disabled = !state.submitted;

    if (onLast) {
      nextModuleBtnNav.classList.toggle('bg-green-600', !!state.submitted);
      nextModuleBtnNav.classList.toggle('bg-red-600', !state.submitted);
      updateResumePreview(); 
    }

    persist();
  }

  prevBtn.addEventListener('click', ()=>showStep(state.step-1));

  if (nextModuleBtnNav){
    nextModuleBtnNav.addEventListener('click', (e)=>{
      e.preventDefault();
      if (!state.submitted){ alert("Submit Final first."); return; }
      alert("Great! Next you'll auto-generate your resume from what you wrote.");
      const href = nextModuleBtnNav.getAttribute('data-href');
      if (href) window.location.href = href;
    });
  }

  if (miniQuiz){
    miniQuiz.addEventListener('change', (e)=>{
      const v = e.target.value;
      if (!v) return;
      const ok = v === 'b';
      miniQuizResult.textContent = ok ? "✓ Correct — action + metric = clear impact." : "✗ The other option is better — more concrete and measurable.";
      miniQuizResult.className = "text-sm mt-2 " + (ok ? "text-green-400" : "text-red-400");
    });
  }
  toStep2?.addEventListener('click', ()=>showStep(1));

  toStep3?.addEventListener('click', ()=>{
    showStep(2);
    initDragDrop();
  });

  const dragDropItems = [
    { text: "Increased engagement by 45% using personalized recommendations", good: true },
    { text: "Worked on team stuff", good: false },
    { text: "Was responsible for tasks", good: false },
    { text: "Implemented automated tests and cut detection time by 60%", good: true },
    { text: "Used Java and Python", good: false },
    { text: "Helped on projects", good: false },
    { text: "Led 4 devs and launched an app with 50,000+ downloads in 1 month", good: true },
    { text: "I'm good at teamwork", good: false },
    { text: "Optimized queries and saved $2,000/month on servers", good: true },
    { text: "Completed assigned tasks", good: false },
    { text: "Designed a REST API with 100,000+ requests/day", good: true },
    { text: "I learn fast", good: false }
  ];
  const answers = {};

  function initDragDrop(){
    itemsPool.innerHTML = "";
    const shuffled = [...dragDropItems].sort(()=>Math.random()-0.5);
    shuffled.forEach((item, idx)=>{
      const div = document.createElement('div');
      div.className = "px-3 py-2 border border-dark rounded bg-dark-input cursor-move text-sm text-gray-300";
      div.draggable = true;
      const id = `itm-${Date.now()}-${idx}`;
      div.dataset.id = id;
      div.dataset.good = String(item.good);
      div.textContent = item.text;
      div.addEventListener('dragstart', ev=>{
        ev.dataTransfer.setData('text/plain', id);
        div.classList.add('opacity-50');
      });
      div.addEventListener('dragend', ()=>div.classList.remove('opacity-50'));
      itemsPool.appendChild(div);
      answers[id] = undefined;
    });
    totalSpan.textContent = String(shuffled.length);
    scoreSpan.textContent = "0";
    checkAnswersBtn.classList.add('hidden');
    toStep4.classList.add('hidden');
  }

  function zoneCommon(zone){
    zone.addEventListener('dragover', e=>{ e.preventDefault(); zone.style.backgroundColor = '#3a3a3a'; });
    zone.addEventListener('dragleave', ()=>{ zone.style.backgroundColor = ''; });
    zone.addEventListener('drop', e=>{
      e.preventDefault();
      zone.style.backgroundColor = '';
      const id = e.dataTransfer.getData('text/plain');
      const el = document.querySelector(`[data-id="${id}"]`);
      if (!el) return;
      zone.appendChild(el);
      answers[id] = (zone.id === 'goodZone');
      if (itemsPool.children.length === 0) checkAnswersBtn.classList.remove('hidden');
    });
  }
  zoneCommon(goodZone);
  zoneCommon(badZone);

  checkAnswersBtn?.addEventListener('click', ()=>{
    let correct = 0;
    Object.keys(answers).forEach(id=>{
      const el = document.querySelector(`[data-id="${id}"]`);
      if (!el) return;
      const isGood = el.dataset.good === 'true';
      const pickedGood = answers[id] === true;
      if (isGood === pickedGood){
        el.classList.remove('border-red-600','bg-red-900');
        el.classList.add('border-green-600','bg-green-900');
        correct++;
      } else {
        el.classList.remove('border-green-600','bg-green-900');
        el.classList.add('border-red-600','bg-red-900');
      }
    });
    scoreSpan.textContent = String(correct);
    toStep4.classList.remove('hidden');
    if (correct === Object.keys(answers).length){
      alert("Perfect! 🎉");
    } else {
      alert(`You got ${correct}/${Object.keys(answers).length}. Review the red ones or continue.`);
    }
  });

  toStep4?.addEventListener('click', ()=>showStep(3));
  skipToStep4?.addEventListener('click', ()=>showStep(3)); // NEW: skippable

  addExperienceBtn?.addEventListener('click', ()=>addExperience());
  function addExperience(initial={}){
    state.experiences.push({
      title: initial.title || "",
      company: initial.company || "",
      dates: initial.dates || "",
      bullets: initial.bullets || ""
    });
    renderExperiences();
    persist();
  }

  function renderExperiences(){
    experienceContainer.innerHTML = "";
    state.experiences.forEach((ex, i)=>{
      const wrap = document.createElement('div');
      wrap.className = "border-l-4 border-blue-600 bg-dark-input p-3 rounded";
      wrap.innerHTML = `
        <div class="flex justify-between items-center">
          <div class="font-semibold text-white">Experience ${i+1}</div>
          <button data-rm="${i}" class="px-2 py-1 border border-dark rounded text-sm text-white hover:bg-gray-700">Remove</button>
        </div>
        <div class="mt-2 grid md:grid-cols-2 gap-2">
          <div>
            <label class="block text-sm font-medium text-white">Job Title *</label>
            <input data-f="title" data-i="${i}" class="w-full border rounded px-3 py-2 bg-dark-input" placeholder="Software Engineering Intern" value="${escapeHtml(ex.title)}">
          </div>
          <div>
            <label class="block text-sm font-medium text-white">Company *</label>
            <input data-f="company" data-i="${i}" class="w-full border rounded px-3 py-2 bg-dark-input" placeholder="Tech Solutions Inc." value="${escapeHtml(ex.company)}">
          </div>
        </div>
        <div class="mt-2">
          <label class="block text-sm font-medium text-white">Dates *</label>
          <input data-f="dates" data-i="${i}" class="w-full border rounded px-3 py-2 bg-dark-input" placeholder="Jun 2024 – Aug 2024" value="${escapeHtml(ex.dates)}">
        </div>
        <div class="mt-2">
          <label class="block text-sm font-medium text-white">Bullets * (use "-" on separate lines)</label>
          <textarea data-f="bullets" data-i="${i}" rows="3" class="w-full border rounded px-3 py-2 bg-dark-input" placeholder="• Developed X that reduced Y by Z%\n• Led 3 people to launch ...\n• Optimized SQL queries ...">${escapeHtml(ex.bullets)}</textarea>
        </div>
      `;
      experienceContainer.appendChild(wrap);
    });

    experienceContainer.querySelectorAll('[data-rm]').forEach(btn=>{
      btn.addEventListener('click', ()=>{
        const i = +btn.getAttribute('data-rm');
        state.experiences.splice(i,1);
        renderExperiences();
        persist();
      });
    });
    experienceContainer.querySelectorAll('input[data-f], textarea[data-f]').forEach(inp=>{
      inp.addEventListener('input', ()=>{
        const i = +inp.getAttribute('data-i');
        const f = inp.getAttribute('data-f');
        state.experiences[i][f] = inp.value;
        persist();
      });
    });
  }

  summaryEl?.addEventListener('input', ()=>{
    state.summary = summaryEl.value;
    persist();
  });

  toStep5?.addEventListener('click', ()=>{
    if (!state.summary.trim()){
      alert("Write your Professional Summary before continuing.");
      return;
    }
    showStep(4);
    updateResumePreview();
  });

  function updateResumePreview(){
    if (!resumePreview) return;

    const parts = [];

    parts.push(`<div class="text-lg font-bold text-white">Professional Summary</div>`);
    parts.push(`<div class="text-gray-300">${nl2br(escapeHtml(state.summary || "Add a brief professional summary."))}</div>`);

    parts.push(`<div class="mt-3 text-base font-semibold text-white">Experience</div>`);
    if (state.experiences.length){
      state.experiences.forEach(ex=>{
        if (!ex.title && !ex.company && !ex.dates && !ex.bullets) return;
        parts.push(`<div class="mt-1">
          <div class="font-medium text-white">${escapeHtml(ex.title || "Job title")}</div>
          <div class="text-gray-custom text-sm">${escapeHtml(ex.company || "Company")} • ${escapeHtml(ex.dates || "Dates")}</div>
          ${renderBullets(ex.bullets)}
        </div>`);
      });
    } else {
      parts.push(`<div class="text-sm text-gray-500">Add at least one experience.</div>`);
    }

    resumePreview.innerHTML = parts.join("\n");
  }

  function renderBullets(text){
    const lines = (text || "").split(/\r?\n/).map(s=>s.trim()).filter(Boolean);
    if (!lines.length) return `<div class="text-sm text-gray-500">Add bullets with metrics and impact.</div>`;
    const items = lines.map(l=>`<li class="text-gray-300">${escapeHtml(l.replace(/^•\s*/,'') || '')}</li>`).join('');
    return `<ul class="list-disc ml-5 text-sm mt-1 space-y-1">${items}</ul>`;
  }

  saveDraftBtn?.addEventListener('click', ()=>{
    persist();            
    updateResumePreview();
    saveMessage.textContent = "Draft saved on this device.";
    saveMessage.className = "text-sm mt-1 text-green-400";
  });

  submitFinalBtn?.addEventListener('click', async ()=>{
    updateResumePreview();
    const ok = await submitFinal({
      summary: state.summary,
      experiences: state.experiences
    });
    state.submitted = !!ok;
    persist();

    if (ok){
      saveMessage.textContent = "Submitted! Your information has been received.";
      saveMessage.className = "text-sm mt-1 text-green-400";
      nextModuleBtnNav.disabled = false;
      nextModuleBtnNav.classList.remove('bg-red-600');
      nextModuleBtnNav.classList.add('bg-green-600');
    } else {
      saveMessage.textContent = "Something went wrong. Try again.";
      saveMessage.className = "text-sm mt-1 text-red-400";
    }
  });

  async function submitFinal(payload){
    function buildResumePayload(p){
      const exp = Array.isArray(p.experiences) ? p.experiences : [];
      return {
        professionalSummary: p.summary || "",
        experiences: exp.map(e => ({
          jobTitle: e.title || "",
          company: e.company || "",
          dates: e.dates || "",
          description: (e.bullets || "")
        }))
      };
    }
    function determineApiUrl(){
      if (window.location.hostname === 'localhost') return 'http://localhost:8585/api/resume/me';
      if (window.location.hostname === 'pages.opencodingsociety.com') return 'https://spring.opencodingsociety.com/api/resume/me';
      return '';
    }

    const resume = buildResumePayload(payload);
    const url = determineApiUrl();
    if (!url){
      console.error('Unknown host for resume submission');
      return false;
    }

    return new Promise((resolve) => {
      fetch(url, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(resume)
      })
        .then(async res => {
          if (!res.ok) {
            throw res.status;
          }
          return res.json();
        })
        .then(data => {
          console.log("Success:", data);
          resolve(true);
        })
        .catch(code => {
          console.error("Request failed with status code:", code);
          resolve(false);
        });
    });
  }

  const STORAGE_KEY = "resume_builder_module3_v1";
  function persist(){
    try{
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }catch(e){}
  }
  function restore(){
    try{
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) { 
        addExperience();
        return;
      }
      const s = JSON.parse(raw);
      state.step = 0;               
      state.submitted = !!s.submitted;
      state.summary = s.summary || "";
      state.experiences = Array.isArray(s.experiences) ? s.experiences : [];
      if (summaryEl) summaryEl.value = state.summary;
      renderExperiences();
    }catch(e){
      addExperience();
    }
  }

  function escapeHtml(s){ return String(s||"").replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m])); }
  function nl2br(s){ return String(s||"").replace(/\n/g,"<br>"); }

  restore();
  showStep(0);
});
<<<<<<< HEAD

// ✅ Floating MP4 sprite logic
const floatingSprite = document.getElementById("floating-sprite");
const floatingSource = document.getElementById("floating-source");

// On page load, check if a character was selected in Submodule 1
const savedCharacter = localStorage.getItem("selectedCharacter");
if (savedCharacter) {
  showFloatingSprite(savedCharacter);
}

function showFloatingSprite(charId) {
  const spriteMap = {
    "char1": "{{site.baseurl}}/hacks/cs-portfolio-quest/resume/sprites/elephant_3.mp4",
    "char2": "{{site.baseurl}}/hacks/cs-portfolio-quest/resume/sprites/hamster_3.mp4",
    "char3": "{{site.baseurl}}/hacks/cs-portfolio-quest/resume/sprites/monkey_3.mp4"
  };

  const src = spriteMap[charId];
  if (src) {
    floatingSource.src = src;
    floatingSprite.load();
    floatingSprite.style.display = "block";
    floatingSprite.play();
  }
}
</script>
=======
</script>

</body>
</html>
>>>>>>> 5d452b56c (changes to mod 3, changing styling)
