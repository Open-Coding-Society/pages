---

microblog: true
toc: false
layout: post
title: Oncology Sesh
description: >
  Capstone project exploring an accessible educational website inspired by OncologySesh,
  helping patients and families understand cancer science, biomarkers, and personalized care.
categories: [Capstone]
permalink: /capstone/oncologysesh/


---


<div class="ocs__grid ocs__grid--standard cols-2">
    <div class="ocs__grid-cell ocs__grid-cell--header">OncologySesh · Organization</div>

    <div class="ocs__grid-cell ocs__grid-cell--accent">
        <strong>What do they aim to do?</strong>
        <p>OncologySesh aims to improve cancer treatment outcomes by developing liquid biopsy technology that helps identify biomarkers relevant to personalized immunotherapy. Its work focuses on helping clinicians make more informed treatment decisions.</p>
        <strong>Why we chose this organization</strong>
        <p><strong>Our motivation:</strong> Our team shares an interest in STEM and in making complex medical information easier to understand. OncologySesh’s focus on precision oncology inspired us to explore how an educational website could help patients and families learn about the science behind personalized cancer care.</p>
    </div>
</div>


{% assign oak_data = site.data.oak %}
{% if oak_data.Board %}
{% include ocs_kanban_board.html url=oak_data.Board.url %}
{% endif %}


> **Student capstone · In development.** This project explores an accessible educational experience inspired by OncologySesh’s work in precision oncology. It is an independent student-built concept, not an official OncologySesh service, diagnostic tool, or source of medical advice. Proposed features are project ideas, not descriptions of services offered by OncologySesh.


<div class="ocs__grid ocs__grid--standard cols-2">
    <div class="ocs__grid-cell ocs__grid-cell--header">OncologySesh · Capstone</div>

    <div class="ocs__grid-cell ocs__grid-cell--accent">
        <strong>Connecting cancer science with patient understanding</strong>
        <p>This capstone proposes an approachable way for patients and families to explore precision oncology. Through plain-language explanations and interactive learning tools, the project aims to introduce cancer biology, biomarkers, liquid biopsies, and the role of personalized treatment.</p>
        <p><strong>Experience:</strong> explore → learn → interact → reflect → prepare questions</p>
    </div>

    <div class="ocs__grid-cell">
        <img src="{{ '/images/capstone/oncologysesh.png' | relative_url }}" alt="Student capstone exploring OncologySesh-inspired cancer education" loading="lazy" style="max-width: 220px; width: 100%; height: auto; display: block; margin: 0 auto;">
        <p><strong>Project focus:</strong> accessible cancer education, biomarker explanations, liquid biopsy concepts, interactive activities, reading-level options, and resources for preparing questions for a care team.</p>
    </div>
</div>


<br>


<div class="ocs__links ocs__links--wide">
    <a class="ocs__btn ocs__btn--icon alert-green iridescent" href="https://github.com/CSP-Oncology/OCS-Kit-Flask" target="_blank" rel="noreferrer noopener">
        <span>Backend Repository</span>
    </a>
    <a class="ocs__btn ocs__btn--icon alert-yellow iridescent" href="https://www.oncologysesh.com/" target="_blank" rel="noreferrer noopener">
        <span>Original Oncology Sesh Website</span>
    </a>
</div>


<br>


---


## From problem to product direction


<div class="ocs__grid ocs__grid--standard cols-2">
    <div class="ocs__grid-cell ocs__grid-cell--header">Why we are building it</div>

    <div class="ocs__grid-cell ocs__grid-cell--accent">
        <strong>Learning challenge</strong>
        <p>Terms such as biomarkers, liquid biopsy, and immunotherapy introduce complex ideas. Our design challenge is to explain these concepts without overwhelming visitors or implying that an educational website can interpret their individual medical situation.</p>
    </div>

    <div class="ocs__grid-cell">
        <strong>Project direction</strong>
        <p>Build an accessible educational website that pairs clear explanations with interactive activities, helping visitors explore precision oncology and prepare thoughtful questions for their healthcare team.</p>
    </div>
</div>


<br>


---


## Proposed core features


<div class="ocs__grid ocs__grid--card">
    <div class="ocs__grid-cell">
        <strong>Patient and family resources</strong>
        <p>Organize educational material around common questions about cancer science and personalized treatment, with clear distinctions between general information and individual medical advice.</p>
    </div>

    <div class="ocs__grid-cell ocs__grid-cell--accent">
        <strong>Learning check-in</strong>
        <p>Offer an optional check-in where visitors can reflect on what they understand, identify unfamiliar terms, and choose what they would like to explore next.</p>
    </div>

    <div class="ocs__grid-cell">
        <strong>Interactive activities</strong>
        <p>Use matching games, short quizzes, and visual activities to reinforce concepts such as cells, biomarkers, and the immune system.</p>
    </div>

    <div class="ocs__grid-cell ocs__grid-cell--accent">
        <strong>Reading-level options</strong>
        <p>Provide introductory explanations alongside more detailed content so visitors can choose a level of scientific depth that suits their needs.</p>
    </div>

    <div class="ocs__grid-cell">
        <strong>Biomarker explorer</strong>
        <p>Introduce what biomarkers are and how they can inform cancer research and treatment decisions. This feature would explain concepts without calculating personal risk or recommending treatment.</p>
    </div>

    <div class="ocs__grid-cell ocs__grid-cell--accent">
        <strong>Cell lab</strong>
        <p>Adapt the earlier cell lab concept into an interactive introduction to cancer cells and the immune system, creating a foundation for learning about immunotherapy.</p>
    </div>

    <div class="ocs__grid-cell">
        <strong>Liquid biopsy walkthrough</strong>
        <p>Use a visual learning sequence to introduce how a blood sample can provide information about cancer-related biomarkers, while explaining that clinical testing and interpretation belong with qualified healthcare professionals.</p>
    </div>
</div>


<br>


---


## System flow


> The proposed experience connects introductory science, interactive learning, and personal reflection without providing clinical assessments.


<div class="ocs__grid ocs__grid--standard cols-4">
    <div class="ocs__grid-cell ocs__grid-cell--header">One connected educational workflow</div>

    <div class="ocs__grid-cell ocs__grid-cell--accent">
        <strong>1 · User interface</strong>
        <p>Visitors enter through an accessible website with clearly labeled topics, plain-language introductions, and straightforward navigation.</p>
    </div>

    <div class="ocs__grid-cell">
        <strong>2 · User actions</strong>
        <p>Users explore modules, choose a reading level, complete learning activities, and identify concepts they want to understand better.</p>
    </div>

    <div class="ocs__grid-cell">
        <strong>3 · Content and tools</strong>
        <p>Educational modules and visual explanations introduce cancer biology, biomarkers, liquid biopsies, and personalized treatment concepts.</p>
    </div>

    <div class="ocs__grid-cell ocs__grid-cell--accent">
        <strong>4 · Learning goal</strong>
        <p>The experience aims to help visitors build familiarity with key terms and prepare questions to discuss with their healthcare team.</p>
    </div>
</div>


<br>


---


## Technical foundation


<div class="ocs__grid ocs__grid--card">
    <div class="ocs__grid-cell">
        <strong>Frontend</strong>
        <p>Jekyll, HTML, and JavaScript provide the foundation for a responsive educational website with accessible navigation and interactive learning tools.</p>
    </div>

    <div class="ocs__grid-cell ocs__grid-cell--accent">
        <strong>Backend</strong>
        <p>Python Flask services could support educational content delivery, activity responses, and future learning workflows as the project develops.</p>
    </div>

    <div class="ocs__grid-cell">
        <strong>Content</strong>
        <p>Proposed modules combine plain-language explanations, reading-level options, and interactive activities. Medical content would require appropriate sourcing and qualified review before public use.</p>
    </div>

    <div class="ocs__grid-cell ocs__grid-cell--accent">
        <strong>Project goal</strong>
        <p>Turn earlier project ideas into a clear, maintainable educational concept centered on precision oncology, accessibility, and responsible communication.</p>
    </div>
</div>


<br>


---


## Our team


> Our team is exploring how thoughtful design and interactive technology can make precision oncology concepts more approachable.


<div class="ocs__grid ocs__grid--standard cols-2">
    <div class="ocs__grid-cell ocs__grid-cell--header">Current project team</div>

    <div class="ocs__grid-cell ocs__grid-cell--accent">
        <strong>Salma</strong>
        <p>Developer</p>
    </div>

    <div class="ocs__grid-cell">
        <strong>Anika</strong>
        <p>Developer</p>
    </div>

    <div class="ocs__grid-cell">
        <strong>Aashi</strong>
        <p>Developer</p>
    </div>

    <div class="ocs__grid-cell ocs__grid-cell--accent">
        <strong>Jailene</strong>
        <p>Developer</p>
    </div>
</div>


<br>