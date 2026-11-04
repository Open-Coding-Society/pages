---
microblog: true
toc: false
layout: post
title: Jarvis3000 — Future Plans
description: Feature development and integration goals for the October 25th target release.
permalink: /capstone/jarvis/future-plans/
year: "2026-2027"
rp_active: future-plans
---

{% assign data = site.data.jarvis_infograph %}
<!-- markdownlint-disable MD033 MD010 MD012 -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">

<div class="ocs__container">

  {% include jarvis-nav.html %}

  <div class="jv-header">
    <div class="ocs__badge">Jarvis3000 · Future Plans</div>
    <h1 class="jv-title">Future Plans</h1>
    <p class="ocs__description">Feature development and integration goals for the October 25th target release.</p>
  </div>

  <nav class="ocs__links" aria-label="Project issues">
    <a href="https://github.com/Arnav210/Jarvis3000/issues/19" target="_blank" rel="noopener" class="ocs__btn">Mentor Meeting Notes</a>
    <a href="https://github.com/Arnav210/Jarvis3000/issues/20" target="_blank" rel="noopener" class="ocs__btn">Future Plans Issue</a>
  </nav>

  <h2 class="ocs__section-title">Feature Development</h2>
  <section class="ocs__card">
    <h3>Website (Frontend)</h3>
    <ul class="ocs__checklist">
      <li class="open"><span class="ocs__checklist-box" aria-hidden="true"></span><span>Connect gesture recognition controls / display</span></li>
      <li class="open"><span class="ocs__checklist-box" aria-hidden="true"></span><span>Implement change log display interface</span></li>
      <li class="open"><span class="ocs__checklist-box" aria-hidden="true"></span><span>Link authenticator app for admin access</span></li>
      <li class="open"><span class="ocs__checklist-box" aria-hidden="true"></span><span>Render distance estimation overlays when hovering over detected objects</span></li>
    </ul>
  </section>
  <section class="ocs__card">
    <h3>Scene Detection Engine</h3>
    <ul class="ocs__checklist">
      <li class="open"><span class="ocs__checklist-box" aria-hidden="true"></span><span>Develop automated triggers to determine when to scan for scene changes</span></li>
      <li class="open"><span class="ocs__checklist-box" aria-hidden="true"></span><span>Optimize processing pipeline to reduce frame analysis latency</span></li>
    </ul>
  </section>

  <h2 class="ocs__section-title">Integration</h2>
  <section class="ocs__card">
    <h3>Jarvis3000 (Backend Core)</h3>
    <ul class="ocs__checklist">
      <li class="open"><span class="ocs__checklist-box" aria-hidden="true"></span><span>Integrate gesture system output with the web server</span></li>
      <li class="open"><span class="ocs__checklist-box" aria-hidden="true"></span><span>Compare image frames, detect changes, and purge static/unchanged images</span></li>
      <li class="open"><span class="ocs__checklist-box" aria-hidden="true"></span><span>Expose change log generation and API endpoints</span></li>
      <li class="open"><span class="ocs__checklist-box" aria-hidden="true"></span><span>Connect voice command system to web interface actions</span></li>
    </ul>
  </section>
  <section class="ocs__card">
    <h3>RFID Classroom Presence System</h3>
    <ul class="ocs__checklist">
      <li class="open"><span class="ocs__checklist-box" aria-hidden="true"></span><span>Import and configure facial recognition model</span></li>
      <li class="open"><span class="ocs__checklist-box" aria-hidden="true"></span><span>Connect Mac Mini to main Flask server</span></li>
      <li class="open"><span class="ocs__checklist-box" aria-hidden="true"></span><span>Enforce privacy constraint: process recognition in memory without saving raw student images</span></li>
      <li class="open"><span class="ocs__checklist-box" aria-hidden="true"></span><span>Send complete payload request (student ID/presence data) to server</span></li>
    </ul>
  </section>

  {% include jarvis-footer.html %}

</div>
<!-- markdownlint-enable MD033 MD010 MD012 -->
