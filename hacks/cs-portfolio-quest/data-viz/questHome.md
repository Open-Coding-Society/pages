---
layout: post 
tailwind: True
title: Data Visualization Quest
description: >
  Learn about how to visualize data from various sources for effective representation and application, such as machine learning
author: CSA 2025-26
permalink: /cs-portfolio-quest/data-viz/
lxdData:
  Title: "Data Visualization Modules"
  Description: "Master data visualization techniques and tools for effective data representation!"
  Topics:
    - Title: "Submodule 1: Building Company Profiles with Spring Boot & REST APIs"
      Genre: "Practice"
      Level: 1
      Description: "Spring Boot RESTful Company Profile System"
      Categories: ["Visualization", "ML", "Collation"]
      Lessons: "/cs-portfolio-quest/data-viz/submodule_1/"
      Image: "/images/cs-portfolio-quest/data-viz/s1.png"
      Alt: "Data Viz Submodule 1"
    - Title: "Submodule 2: Search & Data Filtering with Spring Boot"
      Genre: "Practice"
      Level: 2
      Description: "Search & Data Filtering with Spring Boot"
      Categories: ["Visualization", "ML", "Collation"]
      Lessons: "/cs-portfolio-quest/data-viz/submodule_2/"
      Image: "/images/cs-portfolio-quest/data-viz/s2.png"
      Alt: "Data Viz Submodule 2"
microblog: True
---

{%- include tailwind/cs-portfolio-mini_quest_info.html -%}

<!-- FRQ: Placeholder -->
<div class="frq-box" id="quest-frq" style="border:1px solid #2c2c2e; padding:1rem; border-radius:8px; margin:1.5rem 0; background:#1c1c1e; color:#e5e5ea; font-weight:300;">
  <b>FRQ:</b> <span id="frq-question">Placeholder FRQ: Briefly describe the data visualization you plan to create and the dataset you will use.</span><br><br>
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