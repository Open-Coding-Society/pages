---
layout: post 
tailwind: True
title: Frontend Development Quest
description: >
  Learn how to develop blogs and projects that convey information effectively and are visually appealing
author: CSA 2025-26
permalink: /cs-portfolio-quest/frontend/
lxdData:
  Title: "Frontend Development Modules"
  Description: "Master frontend development skills through hands-on projects and earn certificates!"
  Topics:
    - Title: "Frontend Purpose"
      Genre: "Project Creation"
      Level: 1
      Description: "Learn about the Purpose of Frontend in this Lesson!"
      Categories: ["Frontend", "HTML", "CSS", "Javascript"]
      Video: "https://www.youtube.com/live/7C4dv8vuwEk?si=jk5fBRVyYVxM70xC"
      Lessons: "/cs-portfolio-quest/frontend/submodule_1/"
      Image: "/images/cs-portfolio-quest/frontend/frontend.png"
      Alt: "Frontend Submodule 1"
    - Title: "Markdown and Html + Full-Stack"
      Genre: "Project Creation"
      Level: 2
      Description: "Learn about Markdown to HTML & Full Stack in this Lesson!"
      Categories: ["Frontend", "HTML", "CSS", "Javascript"]
      Video: "https://youtu.be/nu_pCVPKzTk?si=fmdT2DhLI_dMOOXi"
      Lessons: "/cs-portfolio-quest/frontend/submodule_2/"
      Image: "/images/cs-portfolio-quest/frontend/fullstack.png"
      Alt: "Frontend Submodule 2"
    - Title: "CSS Styling"
      Genre: "Markdown and Html + Full-Stack"
      Level: 3
      Description: "Learn about CSS Styling in this lesson!"
      Categories: ["Frontend", "HTML", "CSS", "Javascript"]
      Video: "https://youtu.be/OXGznpKZ_sA?si=DocJUtY8PBd7Nw-e"
      Lessons: "/cs-portfolio-quest/frontend/submodule_3/"
      Image: "/images/cs-portfolio-quest/frontend/css.png"
      Alt: "Frontend Submodule 3"
    - Title: "Tailwind and SASS"
      Genre: "Project Creation"
      Level: 4
      Description: "Learn about Tailwind and Sass in this lesson!"
      Categories: ["Frontend", "HTML", "CSS", "Javascript"]
      Video: "https://youtu.be/lCxcTsOHrjo?si=OCUB7OCeN9PRzcvH"
      Lessons: "/cs-portfolio-quest/frontend/submodule_4/"
      Image: "/images/cs-portfolio-quest/frontend/tailwind.png"
      Alt: "Frontend Submodule 4"
    - Title: "Javascript"
      Genre: "Project Creation"
      Level: 5
      Description: "Learn About Javascript in this Lesson!"
      Categories: ["Frontend", "HTML", "CSS", "Javascript"]
      Video: "https://youtu.be/EerdGm-ehJQ?si=kml1IpI_4ZoXtOT_"
      Lessons: "/cs-portfolio-quest/frontend/submodule_5/"
      Image: "/images/cs-portfolio-quest/frontend/javascript.png"
      Alt: "Frontend Submodule 5"
    - Title: "Component Integration"
      Genre: "Project Creation"
      Level: 6
      Description: "Learn about Component Integration in this lesson!"
      Categories: ["Frontend", "HTML", "CSS", "Javascript"]
      Video: "https://youtu.be/tUGB5UKIOrY?si=x-UTlOuWwFFSW4iC"
      Lessons: "/cs-portfolio-quest/frontend/submodule_6/"
      Image: "/images/cs-portfolio-quest/frontend/integration.png"
      Alt: "Frontend Submodule 6"
---

{%- include tailwind/cs-portfolio-mini_quest_info.html -%}

<!-- FRQ: Placeholder -->
<div class="frq-box" id="quest-frq" style="border:1px solid #2c2c2e; padding:1rem; border-radius:8px; margin:1.5rem 0; background:#1c1c1e; color:#e5e5ea; font-weight:300;">
  <b>FRQ:</b> <span id="frq-question">Placeholder FRQ: Describe the frontend feature you will build and which stack (HTML/CSS/JS) you’ll use.</span><br><br>
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