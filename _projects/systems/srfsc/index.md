---
toc: false
layout: post
title: Scripps Ranch Fire Safe Council
description: SRFSC community dashboard — live fire weather, upcoming clearing days with RSVP, volunteer and hazard-report forms, community updates, and a defensible-space checklist, backed by the Flask /api/srfsc service.
permalink: /capstone/srfsc/app/
author: Krish Kelageri, Jasan Boprai, Shourya Patel
---

<!-- markdownlint-disable MD033 -->
<!-- Panels live in navigation/*.html and are copied to _includes/projects/srfsc/ by the project Makefile. -->
<div class="srfsc-app">
  {% include projects/srfsc/srfsc-hero.html %}
  {% include projects/srfsc/srfsc-kpis.html %}

  <div class="srfsc-dashboard">
    <div class="srfsc-dashboard__main">
      {% include projects/srfsc/srfsc-events.html %}
      {% include projects/srfsc/srfsc-programs.html %}
      {% include projects/srfsc/srfsc-checklist.html %}
    </div>
    <div class="srfsc-dashboard__side">
      {% include projects/srfsc/srfsc-take-action.html %}
      {% include projects/srfsc/srfsc-community.html %}
    </div>
  </div>

  {% include projects/srfsc/srfsc-admin.html %}

  <p class="srfsc-footnote">
    Student capstone redesign of <a href="https://srfiresafe.org/" target="_blank" rel="noopener noreferrer">srfiresafe.org</a>.
    See the <a href="{{site.baseurl}}/capstone/srfsc/">ideation page</a>.
  </p>
</div>

<script type="module">
  import { initSrfscDashboard } from '{{site.baseurl}}/assets/js/projects/srfsc/srfscDashboard.js';

  initSrfscDashboard();
</script>
