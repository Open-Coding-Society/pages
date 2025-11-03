---
layout: cs-portfolio-lesson
title: "Personal Info and Skills"
description: "Learn about why you need personal info and skills on your resume and add your own"
permalink: /cs-portfolio-quest/resume/submodule_2/
parent: "Resume Building"
team: "Grinders"
submodule: 2
categories: [CSP, Submodule, ResumeBuilding]
tags: [resume, submodule, grinders]
author: "Grinders Team"
date: 2025-10-21
---

<link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">

<div class="max-w-3xl mx-auto p-4">
  <h1 class="text-2xl font-bold mb-2">Resume Builder</h1>
  <p class="text-gray-600 mb-4">Fill this out step by step. It autosaves locally on your device.</p>

  <!-- Progress -->
  <div class="border rounded p-3 mb-4">
    <div class="flex justify-between text-sm">
      <span>Progress</span><span id="progressLabel">Step 1 / 6</span>
    </div>
    <div class="w-full bg-gray-200 rounded h-2 mt-2">
      <div id="progressBar" class="bg-blue-600 h-2 rounded" style="width:16.7%"></div>
    </div>
  </div>

  <!-- STEP 1: INTRO + WHY -->
  <section data-step="0" class="space-y-3">
    <h2 class="text-xl font-semibold">Why this matters</h2>
    <p>Your resume should be simple, clear, and truthful. We’ll collect contact info, education, and skills, then show a clean preview.</p>
    <details class="border rounded p-3">
      <summary class="font-medium cursor-pointer">What readers scan first</summary>
      <ul class="list-disc ml-5 mt-2 text-sm">
        <li><b>Contact line</b> – can they reach you quickly?</li>
        <li><b>Skills</b> – do you match the role?</li>
        <li><b>Education</b> – what foundation do you have?</li>
      </ul>
    </details>
    <div class="border rounded p-3">
      <div class="font-medium mb-1">Mini-quiz: Which email is most professional?</div>
      <div class="space-y-1 text-sm" id="emailQuiz">
        <label class="flex items-center gap-2"><input type="radio" name="q1" value="a"> xXGamerPro2007Xx@…</label>
        <label class="flex items-center gap-2"><input type="radio" name="q1" value="b"> firstname.lastname@domain.com</label>
        <label class="flex items-center gap-2"><input type="radio" name="q1" value="c"> cutiepie@…</label>
      </div>
      <p id="emailQuizResult" class="text-sm mt-2"></p>
    </div>
  </section>

  <!-- STEP 2: CONTACT (NAME + EMAIL) -->
  <section data-step="1" class="space-y-3 hidden">
    <h2 class="text-xl font-semibold">Contact — Name & Email</h2>
    <div>
      <label class="block text-sm font-medium">Full Name *</label>
      <input id="fullName" class="w-full border rounded px-3 py-2" placeholder="Mary Jane">
    </div>
    <div>
      <label class="block text-sm font-medium">Email *</label>
      <input id="email" type="email" class="w-full border rounded px-3 py-2" placeholder="firstname.lastname@domain.com">
      <p id="emailTip" class="text-xs mt-1"></p>
    </div>
    <details class="border rounded p-3">
      <summary class="font-medium cursor-pointer">Why this matters</summary>
      <p class="text-sm mt-2">A clean, professional email sets the tone. It’s often the first thing they use to contact you.</p>
    </details>
  </section>

  <!-- STEP 3: CONTACT (PHONE + CITY/STATE) -->
  <section data-step="2" class="space-y-3 hidden">
    <h2 class="text-xl font-semibold">Contact — Phone & City/State</h2>
    <div>
      <label class="block text-sm font-medium">Phone *</label>
      <input id="phone" class="w-full border rounded px-3 py-2" placeholder="(555) 123-4567">
      <p id="phoneTip" class="text-xs mt-1"></p>
    </div>
    <div>
      <label class="block text-sm font-medium">City, State</label>
      <input id="location" class="w-full border rounded px-3 py-2" placeholder="San Diego, CA">
    </div>
    <div class="border rounded p-3">
      <div class="font-medium mb-1">Quick check</div>
      <div class="text-sm" id="addressQuiz">
        Should you include your full street address?
        <div class="mt-1 space-x-3">
          <button data-a="yes" class="px-2 py-1 border rounded">Yes</button>
          <button data-a="no" class="px-2 py-1 border rounded">No</button>
        </div>
      </div>
      <p id="addressQuizResult" class="text-sm mt-2"></p>
    </div>
  </section>

  <!-- STEP 4: EDUCATION -->
  <section data-step="3" class="space-y-3 hidden">
    <h2 class="text-xl font-semibold">Education</h2>
    <div>
      <label class="block text-sm font-medium">School</label>
      <input id="school" class="w-full border rounded px-3 py-2" placeholder="UC San Diego">
    </div>
    <div>
      <label class="block text-sm font-medium">Degree / Focus </label>
      <input id="degree" class="w-full border rounded px-3 py-2" placeholder="M.S.–Med Bioengineering">
    </div>
    <div>
      <label class="block text-sm font-medium">Highlights</label>
      <textarea id="eduHighlights" rows="3" class="w-full border rounded px-3 py-2" placeholder="GPA; relevant courses; honors"></textarea>
    </div>
    <details class="border rounded p-3">
      <summary class="font-medium cursor-pointer">Why this matters</summary>
      <p class="text-sm mt-2">Education shows your foundation. If your experience is light, lean on relevant coursework and honors.</p>
    </details>
  </section>

  <!-- STEP 5: SKILLS -->
<section data-step="4" class="space-y-4 hidden">
  <h2 class="text-xl font-semibold">Skills</h2>

  <!-- Teaching block: Hard vs Soft skills (styled like the rest) -->
  <div class="border rounded p-3 space-y-3">
    <div class="font-medium">
      Watch this video to learn about the different types of skills employers are looking for in a candidate
    </div>
    <!-- Embedded video -->
    <div class="relative rounded overflow-hidden" style="padding-top: 56.25%;">
      <iframe
        class="absolute inset-0 w-full h-full"
        src="https://www.youtube.com/embed/0FFLFcB9xfQ"
        title="Hard vs Soft Skills"
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowfullscreen
      ></iframe>
    </div>
    <!-- Quick guidance (kept neutral) -->
    <div class="text-sm bg-gray-700 border rounded p-3">
      <b>How many of each?</b> Aim for <b>~8–12 total skills</b> tailored to the job:
      <ul class="list-disc ml-5 mt-1">
        <li><b>~60–80%</b> hard skills that match the posting (tools, languages, methods).</li>
        <li><b>~20–40%</b> soft skills to show you can collaborate and deliver.</li>
      </ul>
      Keep only skills you can <i>explain and demonstrate</i>.
    </div>
  </div>

  <!-- Selection UI split into Hard / Soft (equal size) -->
  <div class="grid md:grid-cols-2 gap-4 items-stretch">
    <!-- HARD -->
    <div class="border rounded p-3 flex flex-col h-full">
      <div class="font-medium mb-2">Hard Skills</div>
      <div id="hardSkillsGrid" class="grid grid-cols-2 gap-2 text-sm mb-3"></div>
      <div class="mt-auto">
        <div class="flex gap-2">
          <input id="customHardSkill" class="flex-1 border rounded px-3 py-2" placeholder="Add hard skill (e.g., Python)">
          <button id="addHardSkillBtn" class="px-3 py-2 border rounded">Add</button>
        </div>
        <div id="hardSkillTags" class="flex flex-wrap gap-2 mt-2"></div>
      </div>
    </div>
    <!-- SOFT -->
    <div class="border rounded p-3 flex flex-col h-full">
      <div class="font-medium mb-2">Soft Skills</div>
      <div id="softSkillsGrid" class="grid grid-cols-2 gap-2 text-sm mb-3"></div>
      <div class="mt-auto">
        <div class="flex gap-2">
          <input id="customSoftSkill" class="flex-1 border rounded px-3 py-2" placeholder="Add soft skill (e.g., Communication)">
          <button id="addSoftSkillBtn" class="px-3 py-2 border rounded">Add</button>
        </div>
        <div id="softSkillTags" class="flex flex-wrap gap-2 mt-2"></div>
      </div>
    </div>
  </div>
</section>


  <!-- STEP 6: REVIEW & SAVE -->
  <section data-step="5" class="space-y-3 hidden">
    <h2 class="text-xl font-semibold">Preview</h2>
    <div id="resumePreview" class="border rounded p-4 space-y-2 text-sm leading-6"></div>
    <div class="grid md:grid-cols-2 gap-2">
      <button id="saveDraft" class="px-3 py-2 border rounded">Save Draft</button>
      <button id="submitFinal" class="px-3 py-2 border rounded">Submit Final</button>
    </div>
    <p id="saveMessage" class="text-sm mt-2"></p>
  </section>

  <!-- Bottom Nav -->
  <div class="flex justify-between mt-4">
    <button id="prevBtn" class="px-3 py-2 border rounded" disabled>Previous</button>
    <button id="nextBtn" class="px-3 py-2 border rounded">Next</button>
    <button
      id="nextModuleBtnNav"
      data-href="/cs-portfolio-quest/resume/submodule_3/"
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
    personal: { fullName:"", email:"", phone:"", location:"" },
    education: { school:"", degree:"", eduHighlights:"" },
    skillsHard: new Set(),
    skillsSoft: new Set()
  };

  // ------- DOM -------
  const $  = s => document.querySelector(s);
  const $$ = s => Array.from(document.querySelectorAll(s));
  const steps = $$('section[data-step]');
  const progressBar   = $('#progressBar');
  const progressLabel = $('#progressLabel');

  // Inputs
  const personalIds = ["fullName","email","phone","location"];
  const eduIds = ["school","degree","eduHighlights"];

  // Review / UI
  const resumePreview = $("#resumePreview");
  const saveMessage = $("#saveMessage");

  // Bottom nav buttons
  const prevBtn = $("#prevBtn");
  const nextBtn = $("#nextBtn");
  const nextModuleBtnNav = $("#nextModuleBtnNav");

  // Step 6 buttons
  const saveDraftBtn = $("#saveDraft");
  const submitFinalBtn = $("#submitFinal");

  // Interactive tips & quizzes
  const emailTip = $("#emailTip");
  const phoneTip = $("#phoneTip");
  const emailQuiz = $("#emailQuiz");
  const emailQuizResult = $("#emailQuizResult");
  const addressQuiz = $("#addressQuiz");
  const addressQuizResult = $("#addressQuizResult");

  // Skills (split) — equal count for even columns
  const hardCurated = ["JavaScript","Python","Java","Flask","SQL","Git","Linux","Html"];
  const softCurated = ["Communication","Teamwork","Leadership","Problem-Solving","Adaptability","Time Management"];

  const hardSkillsGrid = $("#hardSkillsGrid");
  const softSkillsGrid = $("#softSkillsGrid");

  const customHardSkillInput = $("#customHardSkill");
  const customSoftSkillInput = $("#customSoftSkill");

  const addHardSkillBtn = $("#addHardSkillBtn");
  const addSoftSkillBtn = $("#addSoftSkillBtn");

  const hardSkillTags = $("#hardSkillTags");
  const softSkillTags = $("#softSkillTags");

  // ------- Build skills checklists -------
  function renderChecklist(gridEl, list, dataAttr){
    if (!gridEl) return;
    gridEl.innerHTML = "";
    list.forEach(label=>{
      const wrap = document.createElement('label');
      wrap.className = "flex items-center gap-2 p-2 border rounded";
      wrap.innerHTML = `<input type="checkbox" data-${dataAttr}="${label}" class="h-4 w-4"><span>${label}</span>`;
      gridEl.appendChild(wrap);
    });
  }

  function syncChecklist(){
    if (hardSkillsGrid){
      hardSkillsGrid.querySelectorAll('input[type=checkbox][data-hard]').forEach(cb=>{
        cb.checked = state.skillsHard.has(cb.dataset.hard);
      });
    }
    if (softSkillsGrid){
      softSkillsGrid.querySelectorAll('input[type=checkbox][data-soft]').forEach(cb=>{
        cb.checked = state.skillsSoft.has(cb.dataset.soft);
      });
    }
  }

  function renderTags(container, setRef){
    if (!container) return;
    container.innerHTML = "";
    [...setRef].forEach(s=>{
      const tag = document.createElement('span');
      tag.className = "px-2 py-1 rounded bg-gray-100 text-gray-800 text-sm flex items-center gap-2";
      tag.innerHTML = `${escapeHtml(s)} <button title="remove" class="font-bold">×</button>`;
      tag.querySelector('button').addEventListener('click', ()=>{
        setRef.delete(s);
        syncChecklist();
        renderTags(container, setRef);
        persist();
      });
      container.appendChild(tag);
    });
  }

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
    if (state.step===1 && (!state.personal.fullName || !state.personal.email)) {
      alert("Please add your Name and Email.");
      return;
    }
    if (state.step===2 && (!state.personal.phone)) {
      alert("Please add your Phone.");
      return;
    }
    if (state.step < steps.length-1) showStep(state.step+1);
  });

  if (nextModuleBtnNav){
    nextModuleBtnNav.addEventListener('click', (e)=>{
      e.preventDefault();
      if (!state.submitted){
        alert("Please submit your final first.");
        return;
      }
      alert("Next, you’ll learn how to present your work and experience effectivley to an employer");
      const href = nextModuleBtnNav.getAttribute('data-href');
      if (href) window.location.href = href;
    });
  }

  // ------- Bind Inputs -------
  personalIds.forEach(id=>{
    const el = $("#"+id); if (!el) return;
    el.addEventListener('input', ()=>{
      state.personal[id] = el.value.trim();
      if (id==="email") {
        emailTip.textContent = isProfessionalEmail(state.personal.email)
          ? "Looks good."
          : "Tip: use firstname.lastname@domain.com for a professional look.";
        emailTip.className = "text-xs mt-1 " + (isProfessionalEmail(state.personal.email) ? "text-green-700" : "text-gray-600");
      }
      if (id==="phone") {
        phoneTip.textContent = looksLikePhone(state.personal.phone)
          ? "Nice—add a clear voicemail greeting with your name."
          : "Tip: include area code. Format like (555) 123-4567.";
        phoneTip.className = "text-xs mt-1 " + (looksLikePhone(state.personal.phone) ? "text-green-700" : "text-gray-600");
      }
      persist();
    });
  });

  eduIds.forEach(id=>{
    const el = $("#"+id); if (!el) return;
    el.addEventListener('input', ()=>{
      state.education[id==='eduHighlights' ? 'eduHighlights' : id] = el.value;
      persist();
    });
  });

  // HARD checklist + add
  if (hardSkillsGrid){
    hardSkillsGrid.addEventListener('change', (e)=>{
      const cb = e.target;
      if (cb && cb.matches('input[type=checkbox][data-hard]')){
        const s = cb.dataset.hard;
        cb.checked ? state.skillsHard.add(s) : state.skillsHard.delete(s);
        renderTags(hardSkillTags, state.skillsHard);
        persist();
      }
    });
  }
  if (addHardSkillBtn && customHardSkillInput){
    addHardSkillBtn.addEventListener('click', ()=>{
      const val = customHardSkillInput.value.trim();
      if (!val) return;
      state.skillsHard.add(val);
      customHardSkillInput.value = "";
      syncChecklist();
      renderTags(hardSkillTags, state.skillsHard);
      persist();
    });
    customHardSkillInput.addEventListener('keydown', (e)=>{
      if (e.key==='Enter'){ e.preventDefault(); addHardSkillBtn.click(); }
    });
  }

  // SOFT checklist + add
  if (softSkillsGrid){
    softSkillsGrid.addEventListener('change', (e)=>{
      const cb = e.target;
      if (cb && cb.matches('input[type=checkbox][data-soft]')){
        const s = cb.dataset.soft;
        cb.checked ? state.skillsSoft.add(s) : state.skillsSoft.delete(s);
        renderTags(softSkillTags, state.skillsSoft);
        persist();
      }
    });
  }
  if (addSoftSkillBtn && customSoftSkillInput){
    addSoftSkillBtn.addEventListener('click', ()=>{
      const val = customSoftSkillInput.value.trim();
      if (!val) return;
      state.skillsSoft.add(val);
      customSoftSkillInput.value = "";
      syncChecklist();
      renderTags(softSkillTags, state.skillsSoft);
      persist();
    });
    customSoftSkillInput.addEventListener('keydown', (e)=>{
      if (e.key==='Enter'){ e.preventDefault(); addSoftSkillBtn.click(); }
    });
  }

  // Quizzes
  if (emailQuiz){
    emailQuiz.addEventListener('change', (e)=>{
      const v = e.target.value;
      if (!v) return;
      emailQuizResult.textContent = v==="b" ? "Correct — simple and professional wins."
                                            : "Not ideal — aim for firstname.lastname@domain.com.";
      emailQuizResult.className = "text-sm mt-2 " + (v==="b" ? "text-green-700" : "text-red-700");
    });
  }
  if (addressQuiz){
    addressQuiz.addEventListener('click', (e)=>{
      const a = e.target.getAttribute('data-a');
      if (!a) return;
      addressQuizResult.textContent = (a==="no")
        ? "Correct — City, State is enough."
        : "Use City, State only. Full street address isn’t needed.";
      addressQuizResult.className = "text-sm mt-2 " + (a==="no" ? "text-green-700" : "text-red-700");
    });
  }

  // ------- Resume-style Preview -------
  function updateResumePreview(){
    const P = state.personal;
    const E = state.education;

    const headerName = `<div class="text-lg font-bold">${escapeHtml(P.fullName || "Your Name")}</div>`;
    const contactLineParts = [];
    if (P.email) contactLineParts.push(escapeHtml(P.email));
    if (P.phone) contactLineParts.push(escapeHtml(P.phone));
    if (P.location) contactLineParts.push(escapeHtml(P.location));
    const contactLine = contactLineParts.length
      ? `<div class="text-sm text-gray-700">${contactLineParts.join(" • ")}</div>`
      : `<div class="text-sm text-gray-500">Add your email, phone, and city/state</div>`;

    const educationBlock = (E.school || E.degree || E.eduHighlights)
      ? `
        <div class="mt-3">
          <div class="font-semibold">Education</div>
          <div>${escapeHtml(E.school || "School")} — ${escapeHtml(E.degree || "Degree/Program")}</div>
          ${E.eduHighlights ? `<div class="text-sm">${escapeHtml(E.eduHighlights)}</div>` : ""}
        </div>`
      : `
        <div class="mt-3">
          <div class="font-semibold">Education</div>
          <div class="text-sm text-gray-500">Add your school, degree, and highlights</div>
        </div>`;

    const hard = [...state.skillsHard];
    const soft = [...state.skillsSoft];

    const skillsBlock = `
      <div class="mt-3">
        <div class="font-semibold">Skills</div>
        ${
          hard.length || soft.length
          ? `<div class="grid md:grid-cols-2 gap-2">
               <div>
                 <div class="text-sm font-medium">Hard</div>
                 <div class="text-sm">${hard.map(escapeHtml).join(", ") || '<span class="text-gray-500">—</span>'}</div>
               </div>
               <div>
                 <div class="text-sm font-medium">Soft</div>
                 <div class="text-sm">${soft.map(escapeHtml).join(", ") || '<span class="text-gray-500">—</span>'}</div>
               </div>
             </div>`
          : `<div class="text-sm text-gray-500">Add ~8–12 total skills (60–80% hard, 20–40% soft)</div>`
        }
      </div>`;

    resumePreview.innerHTML = `${headerName}${contactLine}${educationBlock}${skillsBlock}`;
  }

  // ------- Persistence -------
  const STORAGE_KEY = "resume_builder_hard_soft_v1";
  function persist(){
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        ...state,
        skillsHard:[...state.skillsHard],
        skillsSoft:[...state.skillsSoft]
      }));
    } catch(e){}
  }
  function restore(){
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const saved = JSON.parse(raw);
      state.step = 0; // always start at intro
      state.submitted = !!saved.submitted;
      Object.assign(state.personal, saved.personal||{});
      Object.assign(state.education, saved.education||{});
      (saved.skillsHard||[]).forEach(s=>state.skillsHard.add(s));
      (saved.skillsSoft||[]).forEach(s=>state.skillsSoft.add(s));

      // reflect inputs
      personalIds.forEach(id=>{ const el=$("#"+id); if (el) el.value = state.personal[id]||""; });
      const sch=$("#school"), deg=$("#degree"), hil=$("#eduHighlights");
      if (sch) sch.value = state.education.school || "";
      if (deg) deg.value = state.education.degree || "";
      if (hil) hil.value = state.education.eduHighlights || "";
      syncChecklist();
      renderTags(hardSkillTags, state.skillsHard);
      renderTags(softSkillTags, state.skillsSoft);
    } catch(e){}
  }

  // ------- Save Draft / Submit Final -------
  if (saveDraftBtn) saveDraftBtn.addEventListener('click', ()=>{
    persist();
    updateResumePreview();
    saveMessage.textContent = "Draft saved on this device.";
    saveMessage.className = "text-sm mt-2 text-green-700";
  });

  if (submitFinalBtn) submitFinalBtn.addEventListener('click', async ()=>{
    updateResumePreview();
    const ok = await submitFinal(makePayload());
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

  function makePayload(){
    return {
      personal: {...state.personal},
      education: {
        school: state.education.school,
        degree: state.education.degree,
        highlights: state.education.eduHighlights
      },
      skills: {
        hard: [...state.skillsHard],
        soft: [...state.skillsSoft]
      }
    };
  }

  // Friendly submit stub
  async function submitFinal(payload){
    console.log("Would submit this data:", payload);
    // await fetch("/api/resume/submit", { method:"POST", headers:{'Content-Type':'application/json'}, body: JSON.stringify(payload) });
    return true;
  }

  // ------- Helpers -------
  function escapeHtml(s){ return String(s).replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m])); }
  function isProfessionalEmail(s){
    if (!s) return false;
    const simple = /^[a-z][a-z0-9._-]+@[a-z0-9.-]+\.[a-z]{2,}$/i.test(s);
    return simple && !/(gamer|cutie|party|x{2,}|lol|420|69)/i.test(s);
  }
  function looksLikePhone(s){
    return /\d{10}/.test(String(s).replace(/\D/g,'')); // 10 digits
  }

  // ------- Boot -------
  renderChecklist(hardSkillsGrid, hardCurated, "hard");
  renderChecklist(softSkillsGrid, softCurated, "soft");
  restore();
  syncChecklist();
  showStep(0);
});

// ✅ Floating MP4 sprite logic (unchanged)
const floatingSprite = document.getElementById("floating-sprite");
const floatingSource = document.getElementById("floating-source");
const savedCharacter = localStorage.getItem("selectedCharacter");
if (savedCharacter) { showFloatingSprite(savedCharacter); }
function showFloatingSprite(charId) {
  const spriteMap = {
    "char1": "{{site.baseurl}}/hacks/cs-portfolio-quest/resume/sprites/elephant_2.mp4",
    "char2": "{{site.baseurl}}/hacks/cs-portfolio-quest/resume/sprites/hamster_2.mp4",
    "char3": "{{site.baseurl}}/hacks/cs-portfolio-quest/resume/sprites/monkey_2.mp4"
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

