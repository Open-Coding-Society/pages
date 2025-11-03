---
layout: cs-portfolio-lesson
title: "Introduction"
description: "Walkthrough of our lesson gathering data from team applicators to issolate the job focus ment for you"
permalink: /cs-portfolio-quest/resume/submodule_1/
parent: "Resume Building"
team: "Grinders"
submodule: 1
categories: [CSP, Submodule, ResumeBuilding]
tags: [resume, submodule, grinders]
author: "Grinders Team"
date: 2025-10-21
---

<link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">

<div class="max-w-3xl mx-auto p-4">
  <h1 class="text-2xl font-bold mb-2">Introduction</h1>
  <p class="text-gray-600 mb-4">A strong resume can dramatically increase your chances of landing your dream tech job. Recruiters often spend <b>6–8 seconds</b> scanning — make yours count.</p>

  <!-- Progress -->
  <div class="border rounded p-3 mb-4">
    <div class="flex justify-between text-sm">
      <span>Progress</span><span id="progressLabel">Step 1 / 3</span>
    </div>
    <div class="w-full bg-gray-200 rounded h-2 mt-2">
      <div id="progressBar" class="bg-blue-600 h-2 rounded" style="width:33.3%"></div>
    </div>
  </div>

  <!-- STEP 1: Character selection -->
<section data-step="0" class="space-y-3">
  <h2 class="text-xl font-semibold">Choose Your Character</h2>
  <p class="text-gray-700 text-sm">Pick a guide to accompany you through the mini-quest.</p>

  <div class="flex justify-center gap-4">
    <video id="char1" class="character w-32 h-34 border-2 border-gray-300 rounded cursor-pointer"
      autoplay loop muted playsinline preload="auto">
      <source src="{{site.baseurl}}/hacks/cs-portfolio-quest/resume/sprites/elephant.mp4" type="video/mp4"/>
      Your browser does not support the video tag.
    </video>

  <video id="char2" class="character w-32 h-34 border-2 border-gray-300 rounded cursor-pointer"
      autoplay loop muted playsinline preload="auto">
      <source src="{{site.baseurl}}/hacks/cs-portfolio-quest/resume/sprites/hamster.mp4" type="video/mp4"/>
      Your browser does not support the video tag.
    </video>

  <video id="char3" class="character w-32 h-34 border-2 border-gray-300 rounded cursor-pointer"
      autoplay loop muted playsinline preload="auto">
      <source src="{{site.baseurl}}/hacks/cs-portfolio-quest/resume/sprites/monkey.mp4" type="video/mp4"/>
      Your browser does not support the video tag.
    </video>
  </div>

  <p id="charNote" class="text-xs text-gray-600 text-center">Click a character to enable “Next”.</p>
</section>

  <!-- STEP 2: Recruiter stats -->
  <section data-step="1" class="space-y-3 hidden">
    <h2 class="text-xl font-semibold">What recruiters prioritize</h2>
    <p class="text-gray-700 text-sm">These signals help your resume stand out.</p>
    <div class="grid gap-3 md:grid-cols-2">
      <div class="border rounded p-3">
        <div class="font-medium">Skills Section</div>
        <div class="text-2xl font-bold">65%</div>
        <p class="text-gray-700 text-sm">Detailed, specific technical skills stand out.</p>
      </div>
      <div class="border rounded p-3">
        <div class="font-medium">Work Experience</div>
        <div class="text-2xl font-bold">70%</div>
        <p class="text-gray-700 text-sm">Impact-driven bullets with metrics matter most.</p>
      </div>
      <div class="border rounded p-3">
        <div class="font-medium">Education & Certifications</div>
        <div class="text-2xl font-bold">55%</div>
        <p class="text-gray-700 text-sm">Degrees/certs help establish credibility.</p>
      </div>
      <div class="border rounded p-3">
        <div class="font-medium">Projects & Portfolios</div>
        <div class="text-2xl font-bold">42%</div>
        <p class="text-gray-700 text-sm">Personal projects and GitHub links pop.</p>
      </div>
      <div class="border rounded p-3 md:col-span-2">
        <div class="font-medium">ATS Optimization</div>
        <div class="text-2xl font-bold">60%</div>
        <p class="text-gray-700 text-sm">Many resumes fail automated screens — formatting and keywords matter.</p>
      </div>
    </div>
  </section>

  <!-- STEP 3: Tech Career Paths -->
  <section data-step="2" class="space-y-3 hidden">
    <h2 class="text-xl font-semibold">Explore Tech Career Paths</h2>
    <p class="text-gray-700 text-sm">Click a role to expand its responsibilities, skills, and resume focus.</p>
    <div class="space-y-3">
      <details class="border rounded">
        <summary class="px-3 py-2 cursor-pointer font-medium">Software Engineer</summary>
        <div class="border-t p-3 grid gap-3 md:grid-cols-3 text-sm text-gray-800">
          <div>
            <div class="font-semibold mb-1 text-blue-700">Responsibilities</div>
            <ul class="list-disc ml-5 space-y-1">
              <li>Write, test, and maintain code</li>
              <li>Design and implement solutions</li>
              <li>Fix issues collaboratively</li>
              <li>Prioritize performance & maintainability</li>
            </ul>
          </div>
          <div>
            <div class="font-semibold mb-1 text-blue-700">Key Skills</div>
            <ul class="list-disc ml-5 space-y-1">
              <li>Java, C++, Python, JS</li>
              <li>React/Angular, Django</li>
              <li>Git, SQL/NoSQL, DS&A</li>
            </ul>
          </div>
          <div>
            <div class="font-semibold mb-1 text-blue-700">Resume Focus</div>
            <ul class="list-disc ml-5 space-y-1">
              <li>Concrete stacks/tools</li>
              <li>Personal/academic projects</li>
              <li>Metrics (%, time, users)</li>
            </ul>
          </div>
        </div>
      </details>
      <details class="border rounded">
        <summary class="px-3 py-2 cursor-pointer font-medium">Data Scientist</summary>
        <div class="border-t p-3 grid gap-3 md:grid-cols-3 text-sm text-gray-800">
          <div>
            <div class="font-semibold mb-1 text-blue-700">Responsibilities</div>
            <ul class="list-disc ml-5 space-y-1">
              <li>Analyze datasets & trends</li>
              <li>Build predictive models</li>
              <li>Communicate via visualization</li>
            </ul>
          </div>
          <div>
            <div class="font-semibold mb-1 text-blue-700">Key Skills</div>
            <ul class="list-disc ml-5 space-y-1">
              <li>Python, R, SQL</li>
              <li>ML, data viz</li>
              <li>Big data (Spark, Hadoop)</li>
            </ul>
          </div>
          <div>
            <div class="font-semibold mb-1 text-blue-700">Resume Focus</div>
            <ul class="list-disc ml-5 space-y-1">
              <li>Library experience</li>
              <li>Kaggle/personal projects</li>
              <li>Quantify accuracy/lift</li>
            </ul>
          </div>
        </div>
      </details>
      <details class="border rounded">
        <summary class="px-3 py-2 cursor-pointer font-medium">DevOps Engineer</summary>
        <div class="border-t p-3 grid gap-3 md:grid-cols-3 text-sm text-gray-800">
          <div>
            <div class="font-semibold mb-1 text-blue-700">Responsibilities</div>
            <ul class="list-disc ml-5 space-y-1">
              <li>Automate deployments</li>
              <li>Manage cloud infra</li>
              <li>Monitor systems</li>
            </ul>
          </div>
          <div>
            <div class="font-semibold mb-1 text-blue-700">Key Skills</div>
            <ul class="list-disc ml-5 space-y-1">
              <li>CI/CD (Jenkins, GitLab CI)</li>
              <li>AWS/Azure/GCP</li>
              <li>Docker, K8s, Terraform</li>
            </ul>
          </div>
          <div>
            <div class="font-semibold mb-1 text-blue-700">Resume Focus</div>
            <ul class="list-disc ml-5 space-y-1">
              <li>Cloud certs</li>
              <li>Automation & IaC</li>
              <li>Reliability metrics</li>
            </ul>
          </div>
        </div>
      </details>
      <details class="border rounded">
        <summary class="px-3 py-2 cursor-pointer font-medium">Cybersecurity Analyst</summary>
        <div class="border-t p-3 grid gap-3 md:grid-cols-3 text-sm text-gray-800">
          <div>
            <div class="font-semibold mb-1 text-blue-700">Responsibilities</div>
            <ul class="list-disc ml-5 space-y-1">
              <li>Protect infrastructure</li>
              <li>Monitor for vulnerabilities</li>
              <li>Run risk assessments</li>
            </ul>
          </div>
          <div>
            <div class="font-semibold mb-1 text-blue-700">Key Skills</div>
            <ul class="list-disc ml-5 space-y-1">
              <li>Firewalls, VPN, IDS</li>
              <li>Encryption, forensics</li>
              <li>CISSP/CEH track</li>
            </ul>
          </div>
          <div>
            <div class="font-semibold mb-1 text-blue-700">Resume Focus</div>
            <ul class="list-disc ml-5 space-y-1">
              <li>Certifications</li>
              <li>Incident response</li>
              <li>Security tooling</li>
            </ul>
          </div>
        </div>
      </details>
      <details class="border rounded">
        <summary class="px-3 py-2 cursor-pointer font-medium">Product Manager (Tech)</summary>
        <div class="border-t p-3 grid gap-3 md:grid-cols-3 text-sm text-gray-800">
          <div>
            <div class="font-semibold mb-1 text-blue-700">Responsibilities</div>
            <ul class="list-disc ml-5 space-y-1">
              <li>Guide product lifecycle</li>
              <li>Define vision/strategy</li>
              <li>Coordinate cross-functional teams</li>
            </ul>
          </div>
          <div>
            <div class="font-semibold mb-1 text-blue-700">Key Skills</div>
            <ul class="list-disc ml-5 space-y-1">
              <li>Agile/Scrum</li>
              <li>Leadership, communication</li>
              <li>Roadmapping</li>
            </ul>
          </div>
          <div>
            <div class="font-semibold mb-1 text-blue-700">Resume Focus</div>
            <ul class="list-disc ml-5 space-y-1">
              <li>Tools (Jira/Asana)</li>
              <li>Stakeholder alignment</li>
              <li>Quantified product impact</li>
            </ul>
          </div>
        </div>
      </details>
      <details class="border rounded">
        <summary class="px-3 py-2 cursor-pointer font-medium">UX/UI Designer</summary>
        <div class="border-t p-3 grid gap-3 md:grid-cols-3 text-sm text-gray-800">
          <div>
            <div class="font-semibold mb-1 text-blue-700">Responsibilities</div>
            <ul class="list-disc ml-5 space-y-1">
              <li>Design web/app UIs</li>
              <li>Wireframe & prototype</li>
              <li>User testing</li>
            </ul>
          </div>
          <div>
            <div class="font-semibold mb-1 text-blue-700">Key Skills</div>
            <ul class="list-disc ml-5 space-y-1">
              <li>Figma/Sketch/XD</li>
              <li>Research, prototyping</li>
              <li>HTML/CSS basics</li>
            </ul>
          </div>
          <div>
            <div class="font-semibold mb-1 text-blue-700">Resume Focus</div>
            <ul class="list-disc ml-5 space-y-1">
              <li>Portfolio link</li>
              <li>A/B testing</li>
              <li>Collaboration</li>
            </ul>
          </div>
        </div>
      </details>
    </div>
  </section>

  <!-- Bottom Navigation -->
  <div class="flex justify-between mt-4">
    <button id="prevBtn" class="px-3 py-2 border rounded" disabled>Previous</button>
    <button id="nextBtn" class="px-3 py-2 border rounded">Next →</button>
  </div>

  <!-- Only visible on last step -->
  <div class="flex justify-end mt-3">
    <a id="nextModuleBtn" href="{{site.baseurl}}/cs-portfolio-quest/resume/submodule_2/" class="px-3 py-2 border rounded hidden">Next Module →</a>
  </div>
</div>

<script>
(function(){
  const steps = Array.from(document.querySelectorAll('section[data-step]'));
  const progressBar = document.getElementById('progressBar');
  const progressLabel = document.getElementById('progressLabel');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const nextModuleBtn = document.getElementById('nextModuleBtn');

  let step = 0;
  let charSelected = false;

  function showStep(i){
    step = Math.max(0, Math.min(steps.length-1, i));
    steps.forEach((el, idx) => el.classList.toggle('hidden', idx !== step));
    const pct = ((step+1)/steps.length)*100;
    progressBar.style.width = pct + '%';
    progressLabel.textContent = `Step ${step+1} / ${steps.length}`;
    prevBtn.disabled = step === 0;
    nextBtn.textContent = (step === steps.length-1) ? 'Done' : 'Next →';
    nextModuleBtn.classList.toggle('hidden', step !== steps.length-1);
  }

  prevBtn.addEventListener('click', ()=> showStep(step-1));
  nextBtn.addEventListener('click', ()=>{
    if (step === 0 && !charSelected){
      alert('Please select a character first.');
      return;
    }
    if (step < steps.length-1) showStep(step+1);
    else nextModuleBtn.scrollIntoView({ behavior: 'smooth' });
  });

  // Character selection: blue border + ensure videos play correctly
const videos = document.querySelectorAll('.character');
const charNote = document.getElementById('charNote');

videos.forEach(v => {
  // Ensure autoplay works even if browser blocks it initially
  const tryPlay = () => v.play().catch(() => {});
  v.addEventListener('loadeddata', tryPlay);
  tryPlay();

  v.addEventListener('click', () => {
    videos.forEach(x => {
      x.classList.remove('border-blue-600');
      x.classList.add('border-gray-300');
    });

    v.classList.remove('border-gray-300');
    v.classList.add('border-blue-600'); // same blue as progress bar
    localStorage.setItem('selectedCharacter', v.id);
    charSelected = true;
    if (charNote) charNote.textContent = `Selected: ${v.id}`;
    tryPlay();
  });
});

  // Boot
  showStep(0);
})();
</script>
