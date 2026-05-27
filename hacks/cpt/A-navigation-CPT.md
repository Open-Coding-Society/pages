---
layout: post 
tailwind: True
ourses: {'csp': {'week': 13}}
title: CPT Quest
description: >
  Build the APCSP CPT project through a quest to assist students in fulfilling the collegeboard requirements.
author: David M, Sloane S
permalink: /cpt
lxdData:
  Title: "Learning Modules"
  Description: "Explore this quest of lessons and workshops to build the APCSP CPT Project"
  Topics:
    - Title: "C1: Idea and Inspirations for the CPT"
      Genre: "Activation"
      Level: 1
      Description: "Explore CPT requirements and simply ideas to start the project."
      Lessons: "/cpt/1"
      Image: "/images/cpt/c1.webp"
    - Title: "C2: Draft the CPT Project Layout"
      Genre: "Drafting"
      Level: 2
      Description: "Fully understand Collegeboard CPT requirements and draft the project to be polished later"
      Lessons: "/cpt/2"
      Image: "/images/cpt/c2.jpg"
    - Title: "C3: Trace the Program"
      Genre: "Practice"
      Level: 3
      Description: "Trace and explain the purpose and phases of the project to be used to practice answer AP exam questions later about the CPT"
      Lessons: "/cpt/3"
      Image: "/images/cpt/c3.webp"
    - Title: "C4: Collegeboard FRQ Questions"
      Genre: "Application"
      Level: 4
      Description: "Practice answering common AP exam questions about the CPT by using the previous ideas and drafts in this quest."
      Lessons: "/cpt/4"
      Image: "/images/cpt/c4.webp"
---
{%- include tailwind/plagiarism_info.html -%}

<style>
/* SIDE BLUE BUTTON — CODE RUNNER GUIDE */
.code-runner-toggle {
    position: fixed;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    background: #1E4FBF; /* Strong College Board Blue */
    color: white;
    padding: 20px 14px;
    cursor: pointer;
    border-radius: 0 12px 12px 0;
    font-weight: bold;
    z-index: 2000;
    writing-mode: vertical-rl;
    text-orientation: mixed;
    font-size: 1.4rem; /* LARGE */
    box-shadow: 0 0 15px rgba(0,0,0,0.4);
    letter-spacing: 1px;
    transition: 0.3s ease;
}

.code-runner-toggle:hover {
    background: #2F6BFF;
    box-shadow: 0 0 25px rgba(47,107,255,0.7);
    transform: translateY(-50%) scale(1.05);
}
</style>

<a href="https://davidmadnhs.github.io/CPTGuidePages/cpt/code"
   class="code-runner-toggle">
    CODE RUNNER GUIDE
</a>