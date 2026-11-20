---
layout: post
microblog: true
title: 'OCS Intelligence LLM — Phase 3: Mac mini architecture'
description: Recent architecture work on Mac mini provisioning, stable networking, and a shared package cache, with verified results and remaining rollout work.
permalink: "/capstone/ocs-intelligence/phase-3/"
ocs_stage: phase-3
year: 2026-2027
---
<!-- markdownlint-capture -->
<!-- markdownlint-disable -->
{% assign data = site.data.ocs_intelligence_infograph %}
{% assign update = site.data.ocs_intelligence_phase_3 %}
{% assign stage = data.stages | where: "slug", page.ocs_stage | first %}

<div class="ocs-intelligence-infograph">
  <div class="ocs-intelligence-header">
    <div class="ocs__badge">{{ stage.navKicker }} · Architecture updates · November 17, 2026</div>
    <h1 class="ocs-intelligence-title">{{ stage.title }}</h1>
    <p class="ocs__description">{{ stage.summary }}</p>
    <div class="ocs__status ocs-intelligence-stage-status">{{ stage.status }}</div>
  </div>

  <nav class="ocs__nav-grid" aria-label="OCS Intelligence LLM implementation phases">
    <a href="{{ site.baseurl }}/capstone/ocs-intelligence/" class="ocs__nav-card">
      <span class="ocs__nav-card-kicker">Story</span>
      <span class="ocs__nav-card-title">Overview</span>
    </a>
    {% for phase in data.stages %}
    <a
      href="{{ site.baseurl }}/capstone/ocs-intelligence/{{ phase.slug }}/"
      class="ocs__nav-card{% if page.ocs_stage == phase.slug %} is-active{% endif %}"
      {% if page.ocs_stage == phase.slug %}aria-current="page"{% endif %}
    >
      <span class="ocs__nav-card-kicker">{{ phase.navKicker }}</span>
      <span class="ocs__nav-card-title">{{ phase.navLabel }}</span>
    </a>
    {% endfor %}
  </nav>

  <section class="ocs__card" aria-labelledby="ocs-phase-3-provisioning">
    <h2 id="ocs-phase-3-provisioning" class="ocs__section-title">Preparing the Mac mini pool</h2>
    <p class="ocs__text ocs__lead">{{ update.introduction }}</p>
    <div class="ocs-intelligence-tech-stack">
      {% for tech in stage.tech %}
      <span class="ocs__status-pill">{{ tech }}</span>
      {% endfor %}
    </div>
    <div class="ocs__diagram">
      <pre class="mermaid">{{ update.diagram | escape }}</pre>
    </div>
  </section>

  {% for section in update.sections %}
  <section class="ocs__card" aria-labelledby="ocs-phase-3-work-{{ forloop.index }}">
    <h2 id="ocs-phase-3-work-{{ forloop.index }}" class="ocs__section-title">{{ section.title }}</h2>
    <p class="ocs__text">{{ section.body }}</p>
    <ul class="ocs__text">
      {% for step in section.steps %}
      <li>{{ step }}</li>
      {% endfor %}
    </ul>
    <p class="ocs__text"><strong>Evidence and next check:</strong> {{ section.evidence }}</p>
    <p class="ocs__text"><a href="{{ section.source.url | escape }}">{{ section.source.label | escape }}</a></p>
  </section>
  {% endfor %}

  <div class="ocs__card">
    <h3 class="ocs__section-title">Serving context for this phase</h3>
    <p class="ocs__text">The API uses one public base URL, <code>https://ai.opencodingsociety.com/v1</code>, and a shared student key. The EC2 gateway checks that key, manages a bounded wait line for each model, and routes requests over NetBird to the appropriate rig. Tokens stream back along the same path. Per-student keys remain planned.</p>
    <div class="ocs__diagram-stack">
      <div class="ocs__diagram-block">
        <h4 class="ocs__diagram-title">One API, two rigs</h4>
        <div class="ocs__diagram">
          <pre class="mermaid">flowchart TD
          A[OpenAI-compatible client] -->|HTTPS| B[EC2 Nginx]
          B --> C[Admission gateway: key check and per-model wait line]
          C -->|NetBird| D[Rig 1 orchestrator]
          C -->|NetBird and stored Rig 2 key| E[Rig 2 orchestrator]
          D --> F[llama.cpp: two workers on separate 4-GPU groups]
          E --> G[llama.cpp: MoE worker across 9 GPUs]</pre>
        </div>
      </div>
    </div>
    <p class="ocs__text">The October 29 gateway change brought Rig 2 into this API path, using a server-held Rig 2 key. The Mac mini work in this phase prepares a future routing layer; it has not replaced either rig's orchestrator.</p>
    <p class="ocs__text">On November 3, both Rig 1 workers received a 4 GB prompt-cache cap after repeated host-memory failures. Worker A also gained speculative decoding: copying text reached 37.2 tokens/s, while varied free generation stayed near 8.8 tokens/s. Classroom stability under the new cache cap still needs a load test.</p>
    <p class="ocs__text">Recorded evidence: <a href="https://github.com/Open-Coding-Society/OCS-Intelligence/blob/45246ff2a0c3baf032c52b26db6dc9f3dafd3a5f/evidence/captures/2026-10-29-ec2-gateway-rig2-lane.md">gateway routing</a> and <a href="https://github.com/Open-Coding-Society/OCS-Intelligence/blob/45246ff2a0c3baf032c52b26db6dc9f3dafd3a5f/evidence/captures/2026-11-03-rig1-speed-tuning.md">Rig 1 tuning</a>.</p>
  </div>

</div>
<!-- markdownlint-restore -->
