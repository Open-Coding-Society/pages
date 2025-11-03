---
layout: post
tailwind: true
title: "Backend Development Quest"
description: >
  Learn about database structures, types, and integration with frontend for real-world full-stack development
author: "CSA 2025-26"
permalink: /cs-portfolio-quest/backend/
lxdData:
  Title: "Backend Development Modules"
  Description: "Master backend development and database integration skills!"
  Topics:
    - Title: "What is Backend?"
      Genre: "Project Creation"
      Level: 1
      Description: "Team-defined backend development module"
      Categories:
        - "Backend"
        - "Flask"
        - "Spring"
        - "Databases"
      Video: "/cs-portfolio-quest/backend/submodule_1-video"
      Lessons: "/cs-portfolio-quest/backend/submodule_1/"
      Image: "/images/backend/backend.png"
      Alt: "Backend Submodule 1"
    - Title: "Data Bases"
      Genre: "Project Creation"
      Level: 2
      Description: "Team-defined backend development module"
      Categories:
        - "Backend"
        - "Flask"
        - "Spring"
        - "Databases"
      Video: "/cs-portfolio-quest/backend/submodule_2-video"
      Lessons: "/cs-portfolio-quest/backend/submodule_2/"
      Image: "/images/backend/database.png"
      Alt: "Backend Submodule 2"
    - Title: "Frameworks"
      Genre: "Project Creation"
      Level: 3
      Description: "Team-defined backend development module"
      Categories:
        - "Backend"
        - "Flask"
        - "Spring"
        - "Databases"
      Video: "/cs-portfolio-quest/backend/submodule_3-video"
      Lessons: "/cs-portfolio-quest/backend/submodule_3/"
      Image: "/images/backend/spring.png"
      Alt: "Backend Submodule 3"
    - Title: "Api project"
      Genre: "Project Creation"
      Level: 4
      Description: "Team-defined backend development module"
      Categories:
        - "Backend"
        - "Flask"
        - "Spring"
        - "Databases"
      Video: "/cs-portfolio-quest/backend/submodule_4-video"
      Lessons: "/cs-portfolio-quest/backend/submodule_4/"
      Image: "/images/backend/API.png"
      Alt: "Backend Submodule 4"
---
{%- include tailwind/cs-portfolio-mini_quest_info.html -%}

<!-- FRQ: Placeholder -->
<div class="frq-box" id="quest-frq" style="border:1px solid #2c2c2e; padding:1rem; border-radius:8px; margin:1.5rem 0; background:#1c1c1e; color:#e5e5ea; font-weight:300;">
  <b>FRQ:</b> <span id="frq-question">Placeholder FRQ: Describe the backend API or database feature you plan to implement.</span><br><br>
  <textarea id="frq-answer" rows="5" placeholder="Type your response here..." style="width:100%; border-radius:6px; border:1px solid #3a3a3c; padding:0.5rem; margin-top:0.5rem; background:#2c2c2e; color:#f2f2f7;"></textarea>
  <p></p>
  <button id="frq-grade-btn" style="margin-top:10px; background:#2c2c2e; color:#e5e5ea; border:1px solid #3a3a3c; padding:0.4rem 0.75rem; border-radius:6px;">Grade</button>
  <div id="frq-feedback"></div>
</div>

<script type="module">
  import { javaURI } from '../../../assets/js/api/config.js';

  const btn = document.getElementById('frq-grade-btn');
  btn.addEventListener('click', async () => {
    const q = document.getElementById('frq-question').textContent.trim();
    const a = document.getElementById('frq-answer').value.trim();
    const fb = document.getElementById('frq-feedback');
    if (!a) { fb.innerHTML = '<span style="color:red;">Please enter your response before submitting.</span>'; return; }
    btn.disabled = true;
    fb.innerHTML = 'Grading...';
    try {
      const res = await fetch(`${javaURI}/api/gemini-frq/grade`, {
        method: 'POST',
        mode: 'cors',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: q, answer: a })
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const result = await res.json();
      let feedbackText = '';
      try {
        feedbackText = result.candidates?.[0]?.content?.parts?.[0]?.text || result.feedback || JSON.stringify(result);
      } catch(_) {}
      const formatted = (feedbackText || 'No feedback returned.').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g,'<br>');
      fb.innerHTML = formatted;
    } catch (e) {
      fb.innerHTML = `<span style="color:red;">An error occurred while grading. Please try again. (${e.message})</span>`;
    } finally {
      btn.disabled = false;
    }
  });
</script>