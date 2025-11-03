---
layout: cs-portfolio-lesson
title: "Resume Generator"
description: "Generate a resume based on the info previously entered"
permalink: /cs-portfolio-quest/resume/submodule_4/
parent: "Resume Building"
team: "Grinders"
submodule: 4
categories: [CSP, Submodule, ResumeBuilding]
tags: [resume, submodule, grinders]
author: "Grinders Team"
date: 2025-10-21
---

<link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
<script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>

<div class="max-w-3xl mx-auto p-4">
  <h1 class="text-2xl font-bold mb-2">Resume PDF Generator</h1>
  <p class="text-gray-600 mb-4">Pull your saved content from previous modules, choose a layout, and download your PDF.</p>

  <!-- Progress -->
  <div class="border rounded p-3 mb-4">
    <div class="flex justify-between text-sm">
      <span>Progress</span><span id="progressLabel">Step 1 / 3</span>
    </div>
    <div class="w-full bg-gray-200 rounded h-2 mt-2">
      <div id="progressBar" class="bg-blue-600 h-2 rounded" style="width:33.3333%"></div>
    </div>
  </div>

  <!-- STEP 1: Fetch resume data -->
  <section data-step="0" class="space-y-3">
    <h2 class="text-xl font-semibold">Load your resume data</h2>
    <p class="text-gray-700">We’ll fetch the content you saved earlier (summary + experiences).</p>
    <div class="border rounded p-3">
      <div class="font-medium mb-2">Fetch status</div>
      <p id="fetchStatus" class="text-sm text-gray-600" role="status">Initializing…</p>
      <div class="mt-3">
        <button id="fetchBtn" class="px-3 py-2 border rounded">Fetch from backend</button>
      </div>
    </div>
    <div class="flex justify-end">
      <button id="toStep2" class="px-3 py-2 border rounded" disabled>Choose layout →</button>
    </div>
  </section>

  <!-- STEP 2: Choose layout -->
  <section data-step="1" class="space-y-3 hidden">
    <h2 class="text-xl font-semibold">Choose your resume style</h2>
    <div class="grid md:grid-cols-2 gap-3">
      <button id="classicBtn" class="border rounded p-3 text-left hover:border-blue-600">
        <div class="font-semibold">Classic</div>
        <small class="text-gray-600">Clean & professional</small>
      </button>
      <button id="modernBtn" class="border rounded p-3 text-left hover:border-blue-600">
        <div class="font-semibold">Modern</div>
        <small class="text-gray-600">Bold headings, subtle accents</small>
      </button>
    </div>
    <div class="border rounded p-3">
      <div class="font-medium mb-2">Preview <span id="previewLabel" class="font-normal text-gray-600"></span></div>
      <div id="resumePreview" class="space-y-2 text-sm leading-6"></div>
    </div>
    <div class="flex justify-between">
      <button id="backTo1" class="px-3 py-2 border rounded">← Back</button>
      <button id="toStep3" class="px-3 py-2 border rounded" disabled>Download & submit →</button>
    </div>
  </section>

  <!-- STEP 3: Download & Submit -->
  <section data-step="2" class="space-y-3 hidden">
    <h2 class="text-xl font-semibold">Download & mark complete</h2>
    <div class="border rounded p-3">
      <div class="font-medium mb-2">Actions</div>
      <div class="flex flex-wrap gap-2">
        <button id="downloadBtn" class="px-3 py-2 border rounded" disabled>Download as PDF</button>
        <button id="saveDraft" class="px-3 py-2 border rounded">Save Draft</button>
        <button id="submitFinal" class="px-3 py-2 border rounded">Submit Final</button>
      </div>
      <p id="saveMessage" class="text-sm mt-2"></p>
    </div>
    <div class="border rounded p-3">
      <div class="font-medium mb-2">Final preview</div>
      <div id="finalPreview" class="space-y-2 text-sm leading-6"></div>
    </div>
    <div class="flex justify-between">
      <button id="backTo2" class="px-3 py-2 border rounded">← Back</button>
      <div></div>
    </div>
  </section>

  <!-- Bottom Navigation: Previous + Next Module (unlocked on submit) -->
  <div class="flex justify-between mt-4">
    <button id="prevBtn" class="px-3 py-2 border rounded" disabled>Previous</button>
    <button
      id="nextModuleBtnNav"
      data-href="/cs-portfolio-quest/resume/submodule_5/"
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
  // ---------- State / storage ----------
  const STORAGE_KEY = "resume_pdf_module4_v1";
  const state = {
    step: 0,
    submitted: false,
    layout: null,   // 'classic' | 'modern'
    data: null      // resume payload
  };

  // restore
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const s = JSON.parse(raw);
      state.submitted = !!s.submitted;
      state.layout = s.layout || null;
      state.data = s.data || null;
    }
  } catch (e) {}

  function persist(){
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        submitted: state.submitted,
        layout: state.layout,
        data: state.data
      }));
    } catch (e) {}
  }

  // ---------- DOM ----------
  const $  = s => document.querySelector(s);
  const $$ = s => Array.from(document.querySelectorAll(s));

  const steps = $$('section[data-step]');
  const progressBar   = $('#progressBar');
  const progressLabel = $('#progressLabel');

  const prevBtn = $('#prevBtn');
  const nextModuleBtnNav = $('#nextModuleBtnNav');

  // Step 1
  const fetchBtn = $('#fetchBtn');
  const fetchStatus = $('#fetchStatus');
  const toStep2 = $('#toStep2');

  // Step 2
  const classicBtn = $('#classicBtn');
  const modernBtn  = $('#modernBtn');
  const previewLabel = $('#previewLabel');
  const resumePreview = $('#resumePreview');
  const backTo1 = $('#backTo1');
  const toStep3 = $('#toStep3');

  // Step 3
  const downloadBtn = $('#downloadBtn');
  const saveDraftBtn = $('#saveDraft');
  const submitFinalBtn = $('#submitFinal');
  const saveMessage = $('#saveMessage');
  const finalPreview = $('#finalPreview');
  const backTo2 = $('#backTo2');

  // ---------- Navigation ----------
  function showStep(i){
    state.step = Math.max(0, Math.min(steps.length - 1, i));
    steps.forEach((el, idx) => el.classList.toggle('hidden', idx !== state.step));

    const pct = ((state.step + 1) / steps.length) * 100;
    progressBar.style.width = pct + '%';
    progressLabel.textContent = `Step ${state.step + 1} / ${steps.length}`;

    prevBtn.disabled = state.step === 0;

    const onLast = state.step === steps.length - 1;
    nextModuleBtnNav.classList.toggle('hidden', !onLast);
    nextModuleBtnNav.disabled = !state.submitted;
    nextModuleBtnNav.classList.toggle('bg-green-600', !!state.submitted);
    nextModuleBtnNav.classList.toggle('bg-red-600', !state.submitted);

    persist();
  }

  prevBtn.addEventListener('click', () => showStep(state.step - 1));

  if (nextModuleBtnNav){
    nextModuleBtnNav.addEventListener('click', (e) => {
      e.preventDefault();
      if (!state.submitted){ alert("Submit Final first."); return; }
      const href = nextModuleBtnNav.getAttribute('data-href');
      if (href) window.location.href = href;
    });
  }

  // ---------- Backend fetch ----------
  function determineApiUrl() {
    if (window.location.hostname === 'localhost') {
      return 'http://localhost:8585/api/resume/me';
    } else if (window.location.hostname === 'pages.opencodingsociety.com') {
      return 'https://spring.opencodingsociety.com/api/resume/me';
    }
    return '';
  }

  async function fetchResume(){
    fetchStatus.textContent = 'Fetching…';
    const url = determineApiUrl();
    if (!url){
      fetchStatus.textContent = 'Unrecognized host. Cannot fetch resume data.';
      return false;
    }
    try {
      const res = await fetch(url, { credentials: 'include' });
      if (!res.ok) throw new Error('HTTP ' + res.status);
      const data = await res.json();
      if (!data || !data.professionalSummary) {
        throw new Error('No resume data found. Complete previous modules first.');
      }
      state.data = data;
      fetchStatus.textContent = 'Loaded! Pick a layout next.';
      toStep2.disabled = false;
      persist();
      return true;
    } catch (e) {
      fetchStatus.textContent = 'Error fetching resume: ' + (e && e.message ? e.message : e);
      toStep2.disabled = true;
      return false;
    }
  }

  // ---------- Preview rendering ----------
  function escapeHtml(str){
    if (!str) return '';
    return String(str)
      .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
      .replace(/"/g,'&quot;').replace(/'/g,'&#39;');
  }

  function renderPreview(layout, data){
    const { professionalSummary, experiences = [] } = data || {};
    if (!data) return '';

    if (layout === 'classic'){
      previewLabel.textContent = '(Classic)';
      return `
        <div>
          <div class="text-base font-bold">Your Name</div>
          <div class="text-sm text-gray-600 italic mb-2">${escapeHtml(professionalSummary)}</div>
          <div class="text-base font-semibold">Experience</div>
          ${experiences.map(e => `
            <div class="border-l-4 border-gray-200 bg-white p-3 rounded mt-1">
              <div class="font-medium">${escapeHtml(e.jobTitle || '')}</div>
              <div class="text-gray-700 text-sm">${escapeHtml(e.company || '')} • ${escapeHtml(e.dates || '')}</div>
              <div class="text-sm mt-1 whitespace-pre-line">${escapeHtml(e.description || '')}</div>
            </div>
          `).join('')}
        </div>
      `;
    }

    if (layout === 'modern'){
      previewLabel.textContent = '(Modern)';
      return `
        <div>
          <div class="flex items-center gap-3 mb-1">
            <div class="w-10 h-10 rounded-full border flex items-center justify-center">👤</div>
            <div>
              <div class="font-bold">Your Name</div>
              <div class="text-sm" style="color:#2c62b6;">${escapeHtml(professionalSummary)}</div>
            </div>
          </div>
          <div class="text-base font-semibold" style="color:#2c62b6;">Experience</div>
          ${experiences.map(e => `
            <div class="border-l-4 bg-white p-3 rounded mt-1" style="border-left-color:#2c62b6;">
              <div class="font-medium" style="color:#1a2b4d;">${escapeHtml(e.jobTitle || '')}</div>
              <div class="text-gray-700 text-sm">${escapeHtml(e.company || '')} • ${escapeHtml(e.dates || '')}</div>
              <div class="text-sm mt-1 whitespace-pre-line">${escapeHtml(e.description || '')}</div>
            </div>
          `).join('')}
        </div>
      `;
    }

    return '';
  }

  function refreshPreviews(){
    if (!state.layout || !state.data) return;
    const html = renderPreview(state.layout, state.data);
    resumePreview.innerHTML = html;
    finalPreview.innerHTML = html;
  }

  // ---------- PDF ----------
  function renderPdf(layout, data){
    const { professionalSummary, experiences = [] } = data || {};
    const doc = new window.jspdf.jsPDF({ unit:'pt', format:'a4' });
    let y = 48;

    doc.setFont('helvetica','bold'); doc.setFontSize(22); doc.text('Your Name', 40, y); y += 28;

    doc.setFont('helvetica','normal'); doc.setFontSize(12);
    if (layout === 'classic'){ doc.setTextColor(70,70,70); } else { doc.setTextColor(44,98,182); }
    doc.text(professionalSummary || '', 40, y, { maxWidth: 520 }); y += 30;

    if (layout === 'classic'){ doc.setTextColor(0,0,0); doc.setFont('helvetica','bold'); doc.setFontSize(16); doc.text('Experience', 40, y); }
    else { doc.setTextColor(44,98,182); doc.setFont('helvetica','bold'); doc.setFontSize(16); doc.text('EXPERIENCE', 40, y); }
    y += 20;

    doc.setFont('helvetica','normal'); doc.setFontSize(12);
    experiences.forEach(ex => {
      doc.setFont('helvetica','bold');
      if (layout === 'modern') doc.setTextColor(26,43,77); else doc.setTextColor(0,0,0);
      doc.text(ex.jobTitle || '', 48, y);

      doc.setFont('helvetica','normal'); doc.setTextColor(130,142,158);
      doc.text(((ex.company || '') + ' • ' + (ex.dates || '')), 48, y + 16);

      doc.setTextColor(70,70,70);
      const desc = ex.description || '';
      doc.text(desc, 48, y + 32, { maxWidth: 480 });
      y += 54 + 6 * ((desc.match(/\n/g) || []).length);
      doc.setTextColor(0,0,0);
    });

    doc.save('Resume.pdf');
  }

  // ---------- Handlers ----------
  fetchBtn.addEventListener('click', fetchResume);
  toStep2.addEventListener('click', () => showStep(1));

  backTo1.addEventListener('click', () => showStep(0));
  backTo2.addEventListener('click', () => showStep(1));

  classicBtn.addEventListener('click', () => {
    if (!state.data) return;
    state.layout = 'classic';
    resumePreview.innerHTML = renderPreview('classic', state.data);
    finalPreview.innerHTML = '';
    toStep3.disabled = false;
    persist();
  });

  modernBtn.addEventListener('click', () => {
    if (!state.data) return;
    state.layout = 'modern';
    resumePreview.innerHTML = renderPreview('modern', state.data);
    finalPreview.innerHTML = '';
    toStep3.disabled = false;
    persist();
  });

  toStep3.addEventListener('click', () => {
    refreshPreviews();
    downloadBtn.disabled = !state.layout || !state.data;
    showStep(2);
  });

  downloadBtn.addEventListener('click', () => {
    if (!state.layout || !state.data) return;
    renderPdf(state.layout, state.data);
  });

  saveDraftBtn.addEventListener('click', () => {
    persist();
    saveMessage.textContent = "Draft saved on this device.";
    saveMessage.className = "text-sm mt-2 text-green-700";
  });

  submitFinalBtn.addEventListener('click', () => {
    state.submitted = true;
    persist();
    saveMessage.textContent = "Submitted! This module is marked complete.";
    saveMessage.className = "text-sm mt-2 text-green-700";
    nextModuleBtnNav.disabled = false;
    nextModuleBtnNav.classList.remove('bg-red-600');
    nextModuleBtnNav.classList.add('bg-green-600');
  });

  // ---------- Boot ----------
  // If data was already present, enable moving forward
  if (state.data){ fetchStatus.textContent = 'Loaded from earlier. You can proceed.'; toStep2.disabled = false; }
  else { fetchStatus.textContent = 'Click “Fetch from backend” to load your data.'; }

  // If a layout was chosen earlier, pre-render it
  if (state.layout && state.data){
    resumePreview.innerHTML = renderPreview(state.layout, state.data);
    toStep3.disabled = false;
  }

  showStep(0);
});

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
    "char1": "{{site.baseurl}}/hacks/cs-portfolio-quest/resume/sprites/elephant_4.mp4",
    "char2": "{{site.baseurl}}/hacks/cs-portfolio-quest/resume/sprites/hamster_4.mp4",
    "char3": "{{site.baseurl}}/hacks/cs-portfolio-quest/resume/sprites/monkey_4.mp4"
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
