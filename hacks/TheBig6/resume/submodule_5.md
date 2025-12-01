---
layout: cs-portfolio-lesson
title: "Linkden Walkthrough"
description: "Generate a personalized linkden page based on the info you filled out throughout the lesson"
permalink: /cs-portfolio-quest/resume/submodule_5/
parent: "Resume Building"
team: "Grinders"
submodule: 5
categories: [CSP, Submodule, ResumeBuilding]
tags: [resume, submodule, grinders]
author: "Grinders Team"
date: 2025-10-21
---

<link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">

<div class="max-w-3xl mx-auto p-4">
  <div class="mb-4">
    <h1 class="text-2xl font-bold mb-2">LinkedIn Profile Builder</h1>
    <p class="text-gray-600 text-sm">Create a professional LinkedIn profile with AI assistance. Follow the steps to build your complete profile.</p>
  </div>

  <!-- Progress -->
  <div class="border rounded p-3 mb-4">
    <div class="flex justify-between text-sm">
      <span>Progress</span><span id="progressLabel">Step 1 / 6</span>
    </div>
    <div class="w-full bg-gray-200 rounded h-2 mt-2">
      <div id="progressBar" class="bg-blue-600 h-2 rounded" style="width:16.7%"></div>
    </div>
  </div>

  <!-- Step 1: Profile Setup Basics -->
  <section id="step1" data-step="0" class="space-y-4">
    <h2 class="text-xl font-bold">Step 1: LinkedIn Profile Basics</h2>
    <p class="text-sm">We've pre-filled data from your resume. Review and adjust for LinkedIn.</p>
    <!-- Video only on Step 1 -->
    <div class="panel rounded p-3">
      <h3 class="font-medium mb-2">Watch: How to Create a LinkedIn Profile</h3>
      <div class="video-wrap">
        <iframe 
          src="https://www.youtube.com/embed/ZgPgI0YLMEw" 
          frameborder="0" 
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
          allowfullscreen>
        </iframe>
      </div>
    </div>
    <div class="border rounded p-3">
      <p class="text-sm font-semibold text-green-700">✓ Auto-filled from Resume Builder</p>
      <p class="text-xs mt-1 text-gray-600">Your name, location, and education were imported. Add a professional headline.</p>
    </div>
    <div>
      <label class="block text-sm font-medium">Full Name *</label>
      <input id="fullName" class="w-full border rounded px-3 py-2" placeholder="John Doe">
    </div>
    <div>
      <label class="block text-sm font-medium">Professional Headline *</label>
      <input id="headline" class="w-full border rounded px-3 py-2" placeholder="e.g., CS student at ___ | Aspiring SWE">
      <p class="text-xs mt-1 text-gray-600">Tip: Include your role, key skills, and what you're seeking</p>
    </div>
    <div>
      <label class="block text-sm font-medium">Location</label>
      <input id="location" class="w-full border rounded px-3 py-2" placeholder="San Diego, CA">
    </div>
    <div>
      <label class="block text-sm font-medium">Skills (comma-separated)</label>
      <input id="skills" class="w-full border rounded px-3 py-2" placeholder="Python, React, SQL, Git">
    </div>
    <div>
      <label class="block text-sm font-medium">Education</label>
      <textarea id="education" rows="2" class="w-full border rounded px-3 py-2" placeholder="B.S. in Computer Science, UC San Diego..."></textarea>
    </div>
    <!-- Buttons row: Demo + Previously Collected -->
    <div class="pt-2 flex gap-2 flex-wrap items-center">
      <button onclick="fillDummyData()" class="px-3 py-2 border rounded">Fill with Demo Data</button>
      <button onclick="fillFromSaved()" class="px-3 py-2 border rounded">Fill with Previously Collected Data</button>
      <span class="fillSavedNote text-xs text-gray-600"></span>
    </div>
  </section>

  <!-- Step 2: Profile Photo & Header -->
  <section id="step2" data-step="1" class="space-y-4 hidden">
    <h2 class="text-xl font-semibold">Step 2: Profile Photo & Header Image</h2>
    <p class="text-gray-700 text-sm">Your photo is the first thing people see. Make it count.</p>
    <details class="border rounded p-3">
      <summary class="font-medium cursor-pointer">Profile Photo Guidelines</summary>
      <div class="text-sm mt-2 space-y-2 text-gray-700">
        <ul class="list-disc ml-5">
          <li>High-quality, recent (≥400×400)</li>
          <li>Professional attire, neutral background</li>
          <li>Clear head & shoulders, no filters</li>
        </ul>
      </div>
    </details>
    <details class="border rounded p-3">
      <summary class="font-medium cursor-pointer">LinkedIn Header (Banner) Tips</summary>
      <div class="text-sm mt-2 space-y-2 text-gray-700">
        <p>Recommended size: 1584×396px. Ideas: simple gradient, campus photo, clean tech motif.</p>
      </div>
    </details>
    <div class="border rounded p-3">
      <div class="font-medium mb-2">Create Your LinkedIn Header Image</div>
      <p class="text-sm mb-2 text-gray-700">We'll generate ideas for your header banner based on your profile.</p>
      <button onclick="generateHeaderIdeas()" id="headerBtn" class="px-3 py-2 border rounded">
        <span id="headerIcon">Generate Header Ideas</span>
      </button>
      <div id="headerIdeas" class="mt-3 border rounded p-3 hidden">
        <div class="flex justify-between items-start mb-2">
          <span class="font-medium text-sm">Your Header Image Ideas</span>
          <button onclick="copyHeaderIdeas()" class="px-3 py-2 border rounded text-xs">Copy</button>
        </div>
        <div id="headerContent" class="text-sm whitespace-pre-wrap text-gray-800"></div>
      </div>
    </div>
  </section>

  <!-- Step 3: About Section -->
  <section id="step3" data-step="2" class="space-y-4 hidden">
    <h2 class="text-xl font-semibold">Step 3: About Section</h2>
    <p class="text-sm text-gray-700">Your About section is your story. Make it engaging and authentic.</p>
    <details class="border rounded p-3">
      <summary class="font-medium cursor-pointer">How to write a great About section</summary>
      <div class="text-sm mt-2 space-y-2 text-gray-700">
        <ol class="list-decimal ml-5">
          <li>Hook: who you are, what you do</li>
          <li>Journey: background & passion</li>
          <li>Skills: highlight technical/soft skills</li>
          <li>Goals: internships/jobs you seek</li>
          <li>CTA: invite connections/messages</li>
        </ol>
      </div>
    </details>
    <div>
      <label class="block text-sm font-medium">About You *</label>
      <textarea id="aboutPrompt" rows="5" class="w-full border rounded px-3 py-2" placeholder="I'm a junior CS student at UC San Diego passionate about full-stack development..."></textarea>
      <p class="text-xs mt-1 text-gray-600">Our AI will polish this into a professional About section</p>
    </div>
    <div class="pt-2 flex gap-2 flex-wrap items-center">
      <button onclick="fillDummyData()" class="px-3 py-2 border rounded">Fill with Demo Data</button>
      <button onclick="fillFromSaved()" class="px-3 py-2 border rounded">Fill with Previously Collected Data</button>
      <span class="fillSavedNote text-xs text-gray-600"></span>
    </div>
  </section>

  <!-- Step 4: Experience -->
  <section id="step4" data-step="3" class="space-y-4 hidden">
    <h2 class="text-xl font-semibold">Step 4: Experience</h2>
    <p class="text-sm text-gray-700">Show what you've accomplished. Data from your resume is pre-filled.</p>
    <div class="border rounded p-3">
      <p class="text-sm font-semibold text-green-700">✓ Auto-filled from Experience Builder</p>
      <p class="text-xs mt-1 text-gray-600">Review and add any additional experiences for LinkedIn.</p>
    </div>
    <div>
      <label class="block text-sm font-medium">Experience & Projects *</label>
      <textarea id="experiencePrompt" rows="6" class="w-full border rounded px-3 py-2" placeholder="Software Engineering Intern | TechStart Inc | Jun–Aug 2024
• Built a React dashboard...
• Collaborated with a team of 5...
• Improved load times by 40%"></textarea>
      <p class="text-xs mt-1 text-gray-600">Include internships, jobs, projects, and volunteer work</p>
    </div>
    <!-- ⬇️ Added: Demo + Previously Saved buttons for Step 4 -->
    <div class="pt-2 flex gap-2 flex-wrap items-center">
      <button onclick="fillDummyData()" class="px-3 py-2 border rounded">Fill with Demo Data</button>
      <button onclick="fillFromSaved()" class="px-3 py-2 border rounded">Fill with Previously Collected Data</button>
      <span class="fillSavedNote text-xs text-gray-600"></span>
    </div>
    <!-- /Added -->
    <button onclick="generateProfile()" id="generateBtn" class="px-3 py-2 border rounded">
      <span id="generateIcon">Generate LinkedIn Profile</span>
    </button>
    <div id="statusMessage" class="mt-3 p-3 rounded hidden border text-sm"></div>
  </section>

  <!-- Step 5: Professional Posting -->
  <section id="step5" data-step="4" class="space-y-4 hidden">
    <h2 class="text-xl font-semibold">Step 5: Professional Presence & Posting</h2>
    <p class="text-sm text-gray-700">Learn how to maintain a professional LinkedIn presence.</p>
    <div class="border rounded p-3">
      <div class="font-medium mb-2">Watch: LinkedIn Networking & Professional Presence</div>
      <div class="rounded p-6 text-center text-gray-500 border border-dashed">
        [YouTube Placeholder]<br>Embed URL here
      </div>
    </div>
    <details class="border rounded p-3">
      <summary class="font-medium cursor-pointer">How to Post Professionally</summary>
      <div class="text-sm mt-2 space-y-2 text-gray-700">
        <ul class="list-disc ml-5">
          <li>Project updates & learning notes</li>
          <li>Industry insights, achievements</li>
          <li>Engage respectfully; avoid controversy</li>
        </ul>
      </div>
    </details>
  </section>

  <!-- Step 6: Review -->
  <section id="step6" data-step="5" class="space-y-4 hidden">
    <h2 class="text-xl font-semibold">Step 6: Your Generated LinkedIn Profile</h2>
    <p class="text-sm text-gray-700">Review your AI-generated profile and copy each section to LinkedIn.</p>
    <div class="border rounded p-3">
      <div class="font-medium mb-2">How to use this:</div>
      <ol class="list-decimal ml-5 text-sm space-y-1 text-gray-700">
        <li>Click "Copy" for each section below</li>
        <li>Go to LinkedIn.com and login</li>
        <li>Click "Me" then "View profile"</li>
        <li>Edit each section and paste</li>
      </ol>
    </div>
    <!-- LinkedIn Preview -->
    <div class="border rounded overflow-hidden mb-3">
      <div class="p-3">
        <div class="mb-3">
          <h3 id="previewName" class="text-lg font-semibold"></h3>
          <p id="previewHeadline" class="text-sm text-gray-800"></p>
          <p id="previewLocation" class="text-xs text-gray-600"></p>
        </div>
        <div class="border rounded p-3 mb-2">
          <div class="flex justify-between items-start mb-1">
            <span class="font-medium text-sm">About</span>
            <button onclick="copySection('about')" class="px-3 py-2 border rounded text-xs">Copy</button>
          </div>
          <p id="previewAbout" class="text-sm whitespace-pre-wrap mt-2 text-gray-800"></p>
        </div>
        <div class="border rounded p-3 mb-2">
          <div class="flex justify-between items-start mb-1">
            <span class="font-medium text-sm">Experience</span>
            <button onclick="copySection('experience')" class="px-3 py-2 border rounded text-xs">Copy</button>
          </div>
          <p id="previewExperience" class="text-sm whitespace-pre-wrap mt-2 text-gray-800"></p>
        </div>
        <div class="border rounded p-3 mb-2">
          <div class="flex justify-between items-start mb-1">
            <span class="font-medium text-sm">Skills</span>
            <button onclick="copySection('skills')" class="px-3 py-2 border rounded text-xs">Copy</button>
          </div>
          <div id="previewSkills" class="flex flex-wrap gap-1 mt-2"></div>
        </div>
        <div class="border rounded p-3">
          <div class="flex justify-between items-start mb-1">
            <span class="font-medium text-sm">Education</span>
            <button onclick="copySection('education')" class="px-3 py-2 border rounded text-xs">Copy</button>
          </div>
          <p id="previewEducation" class="text-sm whitespace-pre-wrap mt-2 text-gray-800"></p>
        </div>
      </div>
    </div>
  </section>

  <!-- Footer Nav (match Submodule 3: simple, minimal) -->
  <div class="flex flex-col sm:flex-row gap-3 justify-between items-center mt-6 pt-6 border-t">
    <div class="w-full sm:w-auto flex gap-3">
      <button id="prevBtn" class="px-3 py-2 border rounded" onclick="prevStep()" disabled>← Previous</button>
      <button id="nextBtn" class="px-3 py-2 border rounded" onclick="nextStep()">Next →</button>
    </div>
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
// ================= Configuration =================
const API_KEY = 'AIzaSyACXPXKEgZ_9P6ikvDiFnNpDZe1cXUR3jY';
const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';
const STORAGE_KEY = 'linkedin_profile_v3';

let currentStep = 1;
let profileData = { about: '', experience: '', headerIdeas: '' };

// Initialize on load
window.addEventListener('DOMContentLoaded', () => {
  loadSavedData();
  autoFillFromOtherModules(false); // gentle fill on load (only if empty)
  setTimeout(() => {
    document.querySelectorAll('input, textarea').forEach(el => {
      el.addEventListener('input', () => { saveToLocal(); });
    });
  }, 100);
  goToStep(1);
});

// ===== Autofill from Submodule 2 & 3 localStorage =====
function autoFillFromOtherModules(overwrite=false) {
  let found2=false, found3=false;

  try {
    const m2raw = localStorage.getItem('resume_builder_no_experience_v2')
               || localStorage.getItem('resume_builder_v2');
    if (m2raw) {
      found2 = true;
      const m2 = JSON.parse(m2raw) || {};
      const personal = m2.personal || {};
      const education = m2.education || {};
      const skillsArr = Array.isArray(m2.skills) ? m2.skills : [];

      setField('fullName', personal.fullName, overwrite);
      setField('location', personal.location, overwrite);
      if (skillsArr.length) setField('skills', skillsArr.join(', '), overwrite);

      const eduLines = [];
      if (education.school) eduLines.push(education.school);
      if (education.degree) eduLines.push(education.degree);
      if (education.eduHighlights) eduLines.push(education.eduHighlights);
      if (eduLines.length) setField('education', eduLines.join('\n'), overwrite);

      const hl = document.getElementById('headline');
      if (hl && (overwrite || !hl.value.trim())) {
        if (education.degree) {
          hl.value = `${education.degree} | ${education.school || 'Student'}`;
        } else if (education.school) {
          hl.value = `Student at ${education.school}`;
        }
      }
    }

    const m3raw = localStorage.getItem('resume_builder_module3_v1')
               || localStorage.getItem('impact_exp_v1');
    if (m3raw) {
      found3 = true;
      const m3 = JSON.parse(m3raw) || {};
      const sum = (m3.summary || '').trim();
      const exps = Array.isArray(m3.experiences) ? m3.experiences : [];

      if (sum) setField('aboutPrompt', sum, overwrite);

      if (exps.length) {
        const blocks = exps.map(e => {
          const title = e.title || 'Title';
          const company = e.company || 'Company';
          const dates = e.dates || 'Dates';
          const bullets = (e.bullets || '').trim();
          const cleanBullets = bullets
            .split(/\r?\n/)
            .map(s => s.trim())
            .filter(Boolean)
            .map(b => (b.startsWith('•') ? b : `• ${b}`))
            .join('\n');
          return `${title} | ${company} | ${dates}\n${cleanBullets}`;
        });
        setField('experiencePrompt', blocks.join('\n\n'), overwrite);
      }
    }
  } catch (e) {
    console.log('Could not auto-fill from modules 2/3:', e);
  }

  document.querySelectorAll('.fillSavedNote').forEach(el=>{
    if (found2 || found3) {
      const parts = [];
      if (found2) parts.push('Submodule 2');
      if (found3) parts.push('Submodule 3');
      el.textContent = `Loaded data from: ${parts.join(' & ')}`;
    } else {
      el.textContent = 'No previously collected data found.';
    }
  });

  saveToLocal();
}

function setField(id, value, overwrite){
  if (value == null) return;
  const el = document.getElementById(id);
  if (!el) return;
  if (overwrite || !el.value.trim()) {
    el.value = value;
  }
}

function fillFromSaved(){
  autoFillFromOtherModules(true);
  alert('Filled from previously collected data.');
}

function fillDummyData() {
  document.getElementById('fullName').value = 'Alex Johnson';
  document.getElementById('headline').value = 'Computer Science Student at UC San Diego | Aspiring Software Engineer';
  document.getElementById('location').value = 'San Diego, California';
  document.getElementById('skills').value = 'Python, JavaScript, React, Node.js, SQL, Git, Machine Learning';
  document.getElementById('aboutPrompt').value = 'I am a junior computer science student at UC San Diego with a passion for full-stack development and AI...';
  document.getElementById('experiencePrompt').value = 'Software Engineering Intern | TechStart Inc | June 2024 - August 2024\n• Built a React dashboard...\n• Collaborated with a team of 5...\n• Improved load times by 40%';
  document.getElementById('education').value = 'B.S. Computer Science, UC San Diego\nExpected Graduation: June 2026\nGPA: 3.7/4.0';
  saveToLocal();
}

// Navigation
function prevStep(){ if (currentStep > 1) goToStep(currentStep - 1); }

function nextStep(){
  if (currentStep === 1){
    const fullName = document.getElementById('fullName');
    const headline = document.getElementById('headline');
    if (!fullName?.value?.trim()){ alert('Please enter your Full Name'); fullName?.focus(); return; }
    if (!headline?.value?.trim()){ alert('Please enter your Professional Headline'); headline?.focus(); return; }
  } else if (currentStep === 3){
    const aboutPrompt = document.getElementById('aboutPrompt');
    if (!aboutPrompt?.value?.trim()){ alert('Please write your About section'); aboutPrompt?.focus(); return; }
  } else if (currentStep === 4){
    const experiencePrompt = document.getElementById('experiencePrompt');
    if (!experiencePrompt?.value?.trim()){ alert('Please add your Experience'); experiencePrompt?.focus(); return; }
    generateProfile(); // stay here until generated, then jump to step 6
    return;
  } else if (currentStep === 6){
    window.location.href = '/cs-portfolio-quest/resume/submodule_6/';
    return;
  }
  if (currentStep < 6) goToStep(currentStep + 1);
}

function loadSavedData(){
  try{
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved){
      const data = JSON.parse(saved);
      Object.keys(data).forEach(key => {
        const el = document.getElementById(key);
        if (el) el.value = data[key] || '';
      });
    }
  } catch(e){ console.error('Error loading saved data:', e); }
}

function saveToLocal(){
  try{
    const data = {
      fullName: document.getElementById('fullName').value,
      headline: document.getElementById('headline').value,
      location: document.getElementById('location').value,
      skills: document.getElementById('skills').value,
      aboutPrompt: document.getElementById('aboutPrompt').value,
      experiencePrompt: document.getElementById('experiencePrompt').value,
      education: document.getElementById('education').value
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch(e){ console.error('Error saving data:', e); }
}

function goToStep(step){
  if (step > currentStep){
    if (step === 2){
      const fullName = document.getElementById('fullName').value.trim();
      const headline = document.getElementById('headline').value.trim();
      if (!fullName || !headline){ showMessage('Please fill in your name and headline before continuing', 'info'); return; }
    } else if (step === 3){
      const aboutPrompt = document.getElementById('aboutPrompt').value.trim();
      if (!aboutPrompt){ showMessage('Please describe yourself before continuing', 'info'); return; }
    }
  }

  for (let i=1; i<=6; i++){
    const stepEl = document.getElementById('step' + i);
    if (stepEl) stepEl.classList.add('hidden');
  }
  const targetEl = document.getElementById('step' + step);
  if (targetEl) targetEl.classList.remove('hidden');
  currentStep = step;
  updateStepIndicators();
  window.scrollTo({ top:0, behavior:'smooth' });
}

function updateStepIndicators(){
  const progressBar = document.getElementById('progressBar');
  const progressLabel = document.getElementById('progressLabel');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');

  const percent = (currentStep / 6) * 100;
  if (progressBar) progressBar.style.width = percent + '%';
  if (progressLabel) progressLabel.textContent = `Step ${currentStep} / 6`;
  if (prevBtn) prevBtn.disabled = currentStep === 1;
  if (nextBtn){
    nextBtn.textContent = (currentStep === 6) ? 'Continue to Next Lesson →' : 'Next →';
  }
}

// ===== Local synthesis fallback if API fails =====
function synthAbout({fullName, headline, aboutPrompt}){
  const name = fullName || 'I';
  const hook = `${name} ${headline ? `— ${headline}` : ''}`.trim();
  const body = aboutPrompt || 'I enjoy building useful software and learning quickly.';
  return [
    hook,
    '',
    body,
    '',
    'I’m actively looking to grow through internships, projects, and collaboration. Feel free to reach out.'
  ].join('\n');
}

function synthExperience(experiencePrompt){
  const blocks = experiencePrompt.split(/\n\s*\n/).map(b => b.trim()).filter(Boolean);
  return blocks.map(b => {
    const lines = b.split('\n');
    const header = lines[0];
    const rest = lines.slice(1);
    const bullets = rest.length ? rest : ['• Built features and collaborated in a team environment', '• Improved performance and reliability'];
    const formattedBullets = bullets.map(x => x.trim().startsWith('•') ? x.trim() : `• ${x.trim()}`).join('\n');
    return `${header}\n${formattedBullets}`;
  }).join('\n\n');
}

// Generate profile with AI (+ fallback)
async function generateProfile(){
  const fullName = document.getElementById('fullName').value.trim();
  const headline = document.getElementById('headline').value.trim();
  const aboutPrompt = document.getElementById('aboutPrompt').value.trim();
  const experiencePrompt = document.getElementById('experiencePrompt').value.trim();

  if (!fullName || !headline || !aboutPrompt || !experiencePrompt){
    showMessage('Please fill in all required fields before generating', 'info');
    return;
  }

  const btn = document.getElementById('generateBtn');
  const icon = document.getElementById('generateIcon');
  btn.disabled = true;
  icon.textContent = 'Generating...';

  showMessage('Generating your LinkedIn profile...', 'info');

  try{
    const aboutText = await callGeminiAPI(`Write a professional LinkedIn "About" section (3-4 paragraphs, first-person) for:
Name: ${fullName}
Headline: ${headline}
Background: ${aboutPrompt}
Return ONLY the about text.`);
    const expText = await callGeminiAPI(`Write a professional LinkedIn "Experience" section for:
Name: ${fullName}
Role: ${headline}
Details: ${experiencePrompt}
Format each position as: Job Title | Company | Dates, then bullet points. Return ONLY the experience text.`);

    profileData.about = aboutText;
    profileData.experience = expText;

  } catch (error){
    console.warn('API failed, using local synthesis fallback:', error);
    profileData.about = synthAbout({fullName, headline, aboutPrompt});
    profileData.experience = synthExperience(experiencePrompt);
    showMessage('AI service unavailable — generated a solid draft locally. You can edit it below.', 'success');
  }

  updateLinkedInPreview();
  goToStep(6);
  btn.disabled = false;
  icon.textContent = 'Generate LinkedIn Profile';
}

// Call Gemini API
async function callGeminiAPI(prompt){
  const requestBody = {
    contents:[{ parts:[{ text: prompt }]}],
    generationConfig:{ temperature:0.6, topP:0.9, topK:40, maxOutputTokens:800 }
  };

  const response = await fetch(`${API_URL}?key=${API_KEY}`, {
    method:'POST',
    headers:{ 'Content-Type':'application/json' },
    body: JSON.stringify(requestBody)
  });

  if (!response.ok){
    const errorText = await response.text().catch(()=> '');
    let msg = `API request failed (${response.status})`;
    if (response.status === 401 || response.status === 403) msg = 'API key invalid or blocked (HTTP ' + response.status + ')';
    if (response.status === 429) msg = 'Rate limit or quota exceeded (HTTP 429)';
    if (response.status >= 500) msg = 'AI service error (HTTP ' + response.status + ')';
    throw new Error(msg + (errorText ? `: ${errorText.slice(0,200)}` : ''));
  }

  const data = await response.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error('Invalid AI response format');
  return text.trim();
}

// Update LinkedIn preview
function updateLinkedInPreview(){
  const fullName = document.getElementById('fullName').value.trim();
  const headline = document.getElementById('headline').value.trim();
  const location = document.getElementById('location').value.trim();
  const skills = document.getElementById('skills').value.trim();
  const education = document.getElementById('education').value.trim();

  // Simple initials circle replaced by first letter text
  document.getElementById('previewName').textContent = fullName;
  document.getElementById('previewHeadline').textContent = headline;
  document.getElementById('previewLocation').textContent = location || '';

  document.getElementById('previewAbout').textContent = profileData.about || '';
  document.getElementById('previewExperience').textContent = profileData.experience || '';

  if (skills){
    const skillsArray = skills.split(',').map(s => s.trim()).filter(Boolean);
    document.getElementById('previewSkills').innerHTML =
      skillsArray.map(skill => `<span class="px-2 py-1 border rounded text-xs">${escapeHtml(skill)}</span>`).join(' ');
  } else {
    document.getElementById('previewSkills').innerHTML = '<span class="text-gray-500 text-sm">No skills added</span>';
  }

  document.getElementById('previewEducation').textContent = education || 'No education added';
}

// Header ideas
async function generateHeaderIdeas(){
  const fullName = document.getElementById('fullName').value.trim();
  const headline = document.getElementById('headline').value.trim();
  if (!fullName || !headline){ alert('Please fill in your name and headline first'); return; }
  const btn = document.getElementById('headerBtn');
  const icon = document.getElementById('headerIcon');
  btn.disabled = true;
  icon.textContent = 'Generating...';
  try{
    const ideas = await callGeminiAPI(`Generate 3-4 creative LinkedIn header image ideas for:
Name: ${fullName}
Headline: ${headline}
Provide specific ideas for Canva/Unsplash. Format as a numbered list.`);
    profileData.headerIdeas = ideas;
    document.getElementById('headerContent').textContent = ideas;
    document.getElementById('headerIdeas').classList.remove('hidden');
  } catch(error){
    document.getElementById('headerContent').textContent = [
      '1) Minimal light gradient with subtle grid.',
      '2) Blurred code screenshot with soft vignette.',
      '3) Campus silhouette in monochrome.',
      '4) Simple geometric shapes on neutral background.'
    ].join('\n');
    document.getElementById('headerIdeas').classList.remove('hidden');
  } finally{
    btn.disabled = false;
    icon.textContent = 'Generate Header Ideas';
  }
}

// Copy helpers
function copyHeaderIdeas(){
  const text = profileData.headerIdeas || document.getElementById('headerContent').textContent || '';
  if (!text.trim()){ alert('Nothing to copy'); return; }
  navigator.clipboard.writeText(text).then(()=> alert('Header ideas copied!')).catch(()=> alert('Failed to copy'));
}

function copySection(section){
  let text = '';
  if (section === 'about') text = profileData.about;
  else if (section === 'experience') text = profileData.experience;
  else if (section === 'skills') text = document.getElementById('skills').value;
  else if (section === 'education') text = document.getElementById('education').value;

  if (!text){ showMessage('Nothing to copy from this section', 'info'); return; }
  navigator.clipboard.writeText(text)
    .then(()=> showMessage('Copied to clipboard successfully', 'success'))
    .catch(()=> showMessage('Failed to copy to clipboard', 'info'));
}

// Status + utils
function showMessage(message, type){
  const statusEl = document.getElementById('statusMessage');
  if (!statusEl) return;
  statusEl.textContent = message;
  statusEl.className = 'mt-3 p-3 rounded border text-sm';
  statusEl.classList.remove('hidden');
  if (type !== 'info'){ setTimeout(()=> statusEl.classList.add('hidden'), 5000); }
}

function escapeHtml(text){ const div = document.createElement('div'); div.textContent = text; return div.innerHTML; }

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
    "char1": "{{site.baseurl}}/hacks/cs-portfolio-quest/resume/sprites/elephant_5.mp4",
    "char2": "{{site.baseurl}}/hacks/cs-portfolio-quest/resume/sprites/hamster_5.mp4",
    "char3": "{{site.baseurl}}/hacks/cs-portfolio-quest/resume/sprites/monkey_5.mp4"
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
