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

<link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">

<div class="max-w-3xl mx-auto p-4">
  <h1 class="text-2xl font-bold mb-2">Impact & Experience Builder</h1>
  <p class="text-gray-600 mb-4">Learn to write measurable, clear experiences. It autosaves locally on your device.</p>

  <!-- Progress -->
  <div class="border rounded p-3 mb-4">
    <div class="flex justify-between text-sm">
      <span>Progress</span><span id="progressLabel">Step 1 / 5</span>
    </div>
    <div class="w-full bg-gray-200 rounded h-2 mt-2">
      <div id="progressBar" class="bg-blue-600 h-2 rounded" style="width:20%"></div>
    </div>
  </div>

  <!-- STEP 1: WHY -->
  <section data-step="0" class="space-y-3">
    <h2 class="text-xl font-semibold">Why this matters</h2>
    <p>Your experience should show <b>action + metric + result</b>. We’ll compare good vs bad, practice sorting, then write your own.</p>
    <details class="border rounded p-3">
      <summary class="font-medium cursor-pointer">What employers look for first</summary>
      <ul class="list-disc ml-5 mt-2 text-sm">
        <li><b>Action verbs</b> (Developed, Optimized, Led)</li>
        <li><b>Metrics</b> (% / time / $ / users)</li>
        <li><b>Results</b> (what improved and how it mattered)</li>
      </ul>
    </details>
    <div class="border rounded p-3">
      <div class="font-medium mb-1">Mini-quiz: Which is stronger?</div>
      <div class="space-y-1 text-sm" id="miniQuiz">
        <label class="flex items-center gap-2"><input type="radio" name="q1" value="a"> Helped the team with various tasks</label>
        <label class="flex items-center gap-2"><input type="radio" name="q1" value="b"> Developed an API that reduced response time by 40%</label>
      </div>
      <p id="miniQuizResult" class="text-sm mt-2"></p>
    </div>
  </section>

  <!-- STEP 2: GOOD VS BAD -->
  <section data-step="1" class="space-y-3 hidden">
    <h2 class="text-xl font-semibold">Good vs Bad</h2>
    <p>Compare examples to see what works.</p>
    <div class="grid md:grid-cols-2 gap-3">
      <!-- GOOD -->
      <div class="border rounded p-3">
        <h3 class="font-semibold mb-1 text-green-700">GOOD Example</h3>
        <div>
          <div class="font-medium">Software Engineering Intern</div>
          <div class="text-sm text-gray-600 mb-2"><em>Tech Solutions Inc. • Jun 2024 – Aug 2024</em></div>
          <ul class="list-disc ml-5 text-sm space-y-1">
            <li>Built a React/Node dashboard that cut support time by <b>35%</b></li>
            <li>Implemented REST APIs for <b>10,000+ DAU</b></li>
            <li>Optimized PostgreSQL queries, improving load time by <b>50%</b></li>
          </ul>
          <p class="text-sm mt-2"><b>Skills:</b> JavaScript, React, Node.js, PostgreSQL, Git</p>
        </div>
        <div class="mt-3">
          <div class="font-semibold text-green-700">Why it works</div>
          <ul class="list-disc ml-5 text-sm mt-1">
            <li>Specific + measurable</li>
            <li>Strong verbs</li>
            <li>Clear tools used</li>
          </ul>
        </div>
      </div>
      <!-- BAD -->
      <div class="border rounded p-3">
        <h3 class="font-semibold mb-1 text-red-700">BAD Example</h3>
        <div>
          <div class="font-medium">Intern</div>
          <div class="text-sm text-gray-600 mb-2"><em>Some Company • Summer 2024</em></div>
          <ul class="list-disc ml-5 text-sm space-y-1">
            <li>Worked on code projects</li>
            <li>Helped the team with tasks</li>
            <li>Learned a lot about development</li>
          </ul>
          <p class="text-sm mt-2"><b>Skills:</b> Coding, Computers, Hard worker</p>
        </div>
        <div class="mt-3">
          <div class="font-semibold text-red-700">Why it doesn’t work</div>
          <ul class="list-disc ml-5 text-sm mt-1">
            <li>Vague, no metrics</li>
            <li>Weak verbs</li>
            <li>No outcome or impact</li>
          </ul>
        </div>
      </div>
    </div>
  </section>

  <!-- STEP 3: DRAG & DROP PRACTICE -->
  <section data-step="2" class="space-y-3 hidden">
    <h2 class="text-xl font-semibold">Interactive: Sort Good vs Bad</h2>
    <p>Drag each card into the correct column.</p>
    <div class="text-center font-medium">Score: <span id="score">0</span> / <span id="total">0</span></div>
    <div class="grid md:grid-cols-2 gap-3">
      <div>
        <div class="border-2 border-dashed rounded p-3 min-h-[160px]" id="goodZone">
          <div class="font-semibold text-green-700 mb-1">GOOD</div>
          <p class="text-sm text-gray-600">Drop the good ones here</p>
        </div>
      </div>
      <div>
        <div class="border-2 border-dashed rounded p-3 min-h-[160px]" id="badZone">
          <div class="font-semibold text-red-700 mb-1">BAD</div>
          <p class="text-sm text-gray-600">Drop the bad ones here</p>
        </div>
      </div>
    </div>
    <div>
      <div class="font-medium mb-1">Items:</div>
      <div id="itemsPool" class="border rounded p-3 flex flex-wrap gap-2"></div>
    </div>
  </section>

  <!-- STEP 4: WRITE -->
  <section data-step="3" class="space-y-3 hidden">
    <h2 class="text-xl font-semibold">Write your experience</h2>
    <p>Start with a brief summary, then add experiences using verbs, metrics, and results.</p>
    <div>
      <label class="block text-sm font-medium">Professional Summary *</label>
      <textarea id="summary" rows="3" class="w-full border rounded px-3 py-2" placeholder="Ex: CS student with full-stack experience; launched an app that reduced support time by 35%"></textarea>
    </div>
    <div class="border rounded p-3">
      <div class="flex items-center justify-between">
        <div class="font-medium">Experiences</div>
        <button id="addExperienceBtn" class="px-3 py-2 border rounded">+ Add experience</button>
      </div>
      <div id="experienceContainer" class="space-y-3 mt-3"></div>
    </div>
    <div class="text-sm text-gray-700">
      Tip: Use the <b>Action → Metric → Result</b> format. Example: “Optimized SQL queries, reducing latency by 50% and increasing weekly retention by 12%.”
    </div>
  </section>

  <!-- STEP 5: PREVIEW & SAVE -->
  <section data-step="4" class="space-y-3 hidden">
    <h2 class="text-xl font-semibold">Preview</h2>
    <div id="resumePreview" class="border rounded p-4 space-y-2 text-sm leading-6"></div>
    <!-- Buttons on SAME LEVEL like submodule_2 -->
    <div class="grid md:grid-cols-2 gap-2">
      <button id="saveDraft" class="px-3 py-2 border rounded">Save Draft</button>
      <button id="submitFinal" class="px-3 py-2 border rounded">Submit Final</button>
    </div>
    <p id="saveMessage" class="text-sm mt-2"></p>
  </section>

  <!-- Bottom Nav: SAME pattern as submodule_2 -->
  <div class="flex justify-between mt-4">
    <button id="prevBtn" class="px-3 py-2 border rounded" disabled>Previous</button>
    <button id="nextBtn" class="px-3 py-2 border rounded">Next</button>
    <button
      id="nextModuleBtnNav"
      data-href="/cs-portfolio-quest/resume/submodule_4/"
      class="px-3 py-2 border rounded hidden disabled:opacity-50"
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
  // ------- State -------
  const state = {
    step: 0,
    submitted: false,
    summary: "",
    experiences: []
  };

  // ------- DOM -------
  const $  = s => document.querySelector(s);
  const $$ = s => Array.from(document.querySelectorAll(s));
  const steps = $$('section[data-step]');
  const progressBar   = $('#progressBar');
  const progressLabel = $('#progressLabel');

  const prevBtn = $("#prevBtn");
  const nextBtn = $("#nextBtn");
  const nextModuleBtnNav = $("#nextModuleBtnNav");

  const miniQuiz = $("#miniQuiz");
  const miniQuizResult = $("#miniQuizResult");

  const itemsPool = $("#itemsPool");
  const goodZone = $("#goodZone");
  const badZone  = $("#badZone");

  const summaryEl = $("#summary");
  const experienceContainer = $("#experienceContainer");
  const addExperienceBtn = $("#addExperienceBtn");

  const resumePreview = $("#resumePreview");
  const saveDraftBtn = $("#saveDraft");
  const submitFinalBtn = $("#submitFinal");
  const saveMessage = $("#saveMessage");

  // ------- Step Nav -------
  function showStep(i){
    state.step = Math.max(0, Math.min(steps.length-1, i));
    steps.forEach((el,idx)=>el.classList.toggle('hidden', idx!==state.step));
    const pct = ((state.step+1)/steps.length)*100;
    progressBar.style.width = pct + '%';
    progressLabel.textContent = `Step ${state.step+1} / ${steps.length}`;
    prevBtn.disabled = state.step===0;

    const onLast = state.step === steps.length - 1;
    nextBtn.classList.toggle('hidden', onLast);
    nextModuleBtnNav.classList.toggle('hidden', !onLast);
    nextModuleBtnNav.disabled = !state.submitted;

    if (onLast) updateResumePreview();
    persist();
  }

  prevBtn.addEventListener('click', ()=>showStep(state.step-1));
  nextBtn.addEventListener('click', ()=>{
    if (state.step < steps.length-1) showStep(state.step+1);
  });

  if (nextModuleBtnNav){
    nextModuleBtnNav.addEventListener('click', (e)=>{
      e.preventDefault();
      if (!state.submitted){
        alert("Please submit your final first.");
        return;
      }
      alert("Next, you’ll auto-generate your resume from what you wrote.");
      const href = nextModuleBtnNav.getAttribute('data-href');
      if (href) window.location.href = href;
    });
  }

  // ------- Step 1 mini-quiz -------
  if (miniQuiz){
    miniQuiz.addEventListener('change', (e)=>{
      const v = e.target.value;
      if (!v) return;
      const ok = v==="b";
      miniQuizResult.textContent = ok ? "Correct — action + metric = clear impact." : "Not ideal — the other option is specific and measurable.";
      miniQuizResult.className = "text-sm mt-2 " + (ok ? "text-green-700" : "text-red-700");
    });
  }

  // ------- Step 3 drag & drop -------
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
  const scoreSpan = $("#score");
  const totalSpan = $("#total");

  function initDragDrop(){
    if (!itemsPool) return;
    itemsPool.innerHTML = "";
    const shuffled = [...dragDropItems].sort(()=>Math.random()-0.5);
    shuffled.forEach((item, idx)=>{
      const div = document.createElement('div');
      div.className = "px-3 py-2 border rounded cursor-move text-sm";
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
    if (totalSpan) totalSpan.textContent = String(shuffled.length);
    if (scoreSpan) scoreSpan.textContent = "0";
  }

  function zoneCommon(zone){
    if (!zone) return;
    zone.addEventListener('dragover', e=>{ e.preventDefault(); zone.classList.add('bg-gray-50'); });
    zone.addEventListener('dragleave', ()=>{ zone.classList.remove('bg-gray-50'); });
    zone.addEventListener('drop', e=>{
      e.preventDefault();
      zone.classList.remove('bg-gray-50');
      const id = e.dataTransfer.getData('text/plain');
      const el = document.querySelector(`[data-id="${id}"]`);
      if (!el) return;
      zone.appendChild(el);
      answers[id] = (zone.id === 'goodZone');
      // When all moved, auto-score
      if (itemsPool.children.length === 0) scoreDragDrop();
    });
  }
  function scoreDragDrop(){
    let correct = 0;
    Object.keys(answers).forEach(id=>{
      const el = document.querySelector(`[data-id="${id}"]`);
      if (!el) return;
      const isGood = el.dataset.good === 'true';
      const pickedGood = answers[id] === true;
      if (isGood === pickedGood){
        el.classList.remove('border-red-600');
        el.classList.add('border-green-600');
        correct++;
      } else {
        el.classList.remove('border-green-600');
        el.classList.add('border-red-600');
      }
    });
    if (scoreSpan) scoreSpan.textContent = String(correct);
    alert(`You got ${correct}/${Object.keys(answers).length}. Review red ones or continue to the next step.`);
  }

  // Initialize zones once
  zoneCommon(goodZone);
  zoneCommon(badZone);

  // ------- Step 4 experiences -------
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
    if (!experienceContainer) return;
    experienceContainer.innerHTML = "";
    state.experiences.forEach((ex, i)=>{
      const wrap = document.createElement('div');
      wrap.className = "border rounded p-3";
      wrap.innerHTML = `
        <div class="flex justify-between items-center">
          <div class="font-semibold">Experience ${i+1}</div>
          <button data-rm="${i}" class="px-2 py-1 border rounded text-sm">Remove</button>
        </div>
        <div class="mt-2 grid md:grid-cols-2 gap-2">
          <div>
            <label class="block text-sm font-medium">Job Title *</label>
            <input data-f="title" data-i="${i}" class="w-full border rounded px-3 py-2" placeholder="Software Engineering Intern" value="${escapeHtml(ex.title)}">
          </div>
          <div>
            <label class="block text-sm font-medium">Company *</label>
            <input data-f="company" data-i="${i}" class="w-full border rounded px-3 py-2" placeholder="Tech Solutions Inc." value="${escapeHtml(ex.company)}">
          </div>
        </div>
        <div class="mt-2">
          <label class="block text-sm font-medium">Dates *</label>
          <input data-f="dates" data-i="${i}" class="w-full border rounded px-3 py-2" placeholder="Jun 2024 – Aug 2024" value="${escapeHtml(ex.dates)}">
        </div>
        <div class="mt-2">
          <label class="block text-sm font-medium">Bullets * (one per line)</label>
          <textarea data-f="bullets" data-i="${i}" rows="3" class="w-full border rounded px-3 py-2" placeholder="• Developed X that reduced Y by Z%\n• Led 3 people to launch ...\n• Optimized SQL queries ...">${escapeHtml(ex.bullets)}</textarea>
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

  // ------- Step 5 preview & save -------
  function updateResumePreview(){
    if (!resumePreview) return;
    const parts = [];
    parts.push(`<div class="text-lg font-bold">Professional Summary</div>`);
    parts.push(`<div class="text-gray-700">${nl2br(escapeHtml(state.summary || "Add a brief professional summary."))}</div>`);
    parts.push(`<div class="mt-3 text-base font-semibold">Experience</div>`);
    if (state.experiences.length){
      state.experiences.forEach(ex=>{
        if (!ex.title && !ex.company && !ex.dates && !ex.bullets) return;
        parts.push(`<div class="mt-1">
          <div class="font-medium">${escapeHtml(ex.title || "Job title")}</div>
          <div class="text-gray-600 text-sm">${escapeHtml(ex.company || "Company")} • ${escapeHtml(ex.dates || "Dates")}</div>
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
    const items = lines.map(l=>`<li>${escapeHtml(l.replace(/^•\s*/,'') || '')}</li>`).join('');
    return `<ul class="list-disc ml-5 text-sm mt-1 space-y-1">${items}</ul>`;
  }

  saveDraftBtn?.addEventListener('click', ()=>{
    persist();
    updateResumePreview();
    saveMessage.textContent = "Draft saved on this device.";
    saveMessage.className = "text-sm mt-2 text-green-700";
  });

  submitFinalBtn?.addEventListener('click', async ()=>{
    updateResumePreview();
    const ok = await submitFinal({
      summary: state.summary,
      experiences: state.experiences
    });
    state.submitted = !!ok;
    persist();

    saveMessage.textContent = ok
      ? "Submitted! Your information has been received."
      : "Something went wrong. Please try again.";
    saveMessage.className = "text-sm mt-2 " + (ok ? "text-green-700" : "text-red-700");

    const onLast = state.step === steps.length - 1;
    if (ok && onLast && nextModuleBtnNav){
      nextModuleBtnNav.disabled = false;
    }
  });

  async function submitFinal(payload){
    // Shape payload similar to backend expectation
    const resume = {
      professionalSummary: payload.summary || "",
      experiences: (payload.experiences||[]).map(e=>({
        jobTitle: e.title || "",
        company: e.company || "",
        dates: e.dates || "",
        description: e.bullets || ""
      }))
    };
    // Host switcher (same pattern you used)
    function determineApiUrl(){
      if (window.location.hostname === 'localhost') return 'http://localhost:8585/api/resume/me';
      if (window.location.hostname === 'pages.opencodingsociety.com') return 'https://spring.opencodingsociety.com/api/resume/me';
      return ''; // unknown host
    }
    const url = determineApiUrl();
    if (!url) return true; // allow front-end flow during dev
    try{
      const res = await fetch(url, {
        method: "POST",
        credentials: "include",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify(resume)
      });
      return res.ok;
    }catch(e){ return false; }
  }

  // ------- Persistence -------
  const STORAGE_KEY = "resume_builder_module3_light_v1";
  function persist(){
    try{ localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }catch(e){}
  }
  function restore(){
    try{
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) { addExperience(); return; }
      const s = JSON.parse(raw);
      state.step = 0;                 // always start at intro
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

  // Boot
  restore();
  initDragDrop();
  showStep(0);
});

// Floating MP4 sprite logic (version 3 files)
const floatingSprite = document.getElementById("floating-sprite");
const floatingSource = document.getElementById("floating-source");
const savedCharacter = localStorage.getItem("selectedCharacter");
if (savedCharacter) { showFloatingSprite(savedCharacter); }
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
