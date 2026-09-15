---
layout: post
microblog: true
title: OCS Intelligence LLM
description:
permalink: "/capstone/ocs-intelligence/"
year: 2026-2027
---
<!-- markdownlint-disable -->
{% assign data = site.data.ocs_intelligence_infograph %}
{% assign topic = data.Topics[0] %}
{% assign gift = data.donation %}

<div class="ocs-intelligence-infograph">
  <div class="ocs-intelligence-header">
    <div class="ocs__badge">Design-Based Research Capstone</div>
    <h1 class="ocs-intelligence-title">{{ data.Title }}</h1>
    <p class="ocs__description">{{ data.Description }}</p>
  </div>

  {% assign current_stage = page.ocs_stage | default: "" %}
{% assign overview_url = "/capstone/ocs-intelligence/" %}


<nav class="ocs__nav-grid" aria-label="OCS Intelligence LLM implementation phases">
  <a
    href="{{ site.baseurl }}{{ overview_url }}"
    class="ocs__nav-card{% if current_stage == '' %} is-active{% endif %}"
    {% if current_stage == '' %}aria-current="page"{% endif %}
  >
    <span class="ocs__nav-card-kicker">Story</span>
    <span class="ocs__nav-card-title">Overview</span>
  </a>
  {% for stage in data.stages %}
  <a
    href="{{ site.baseurl }}/capstone/ocs-intelligence/{{ stage.slug }}/"
    class="ocs__nav-card{% if current_stage == stage.slug %} is-active{% endif %}"
    {% if current_stage == stage.slug %}aria-current="page"{% endif %}
  >
    <span class="ocs__nav-card-kicker">{{ stage.navKicker }}</span>
    <span class="ocs__nav-card-title">{{ stage.navLabel }}</span>
  </a>
  {% endfor %}
</nav>


  <div class="ocs__card">
    <p class="ocs-intelligence-gift-kicker">{{ data.problemStatement.kicker }}</p>
    <h3 class="ocs__section-title">{{ data.problemStatement.title }}</h3>
    <p class="ocs__text ocs__lead">{{ data.problemStatement.body }}</p>
    <div class="ocs__diagram" role="img" aria-label="Comparison: a paid AI subscription serves one seat, versus OCS Intelligence LLM which serves every student off donated hardware.">
      <svg viewBox="0 0 640 220" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font-family:inherit;">
        <rect x="8" y="8" width="270" height="204" rx="14" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.14)"/>
        <text x="143" y="34" text-anchor="middle" fill="#fff" font-size="15" font-weight="700">Paid subscription</text>
        <rect x="125" y="70" width="36" height="30" rx="4" fill="none" stroke="rgba(255,255,255,0.65)" stroke-width="2"/>
        <path d="M132 70 v-14 a11 11 0 0 1 22 0 v14" fill="none" stroke="rgba(255,255,255,0.65)" stroke-width="2"/>
        <circle cx="143" cy="85" r="3" fill="rgba(255,255,255,0.65)"/>
        <text x="143" y="138" text-anchor="middle" fill="#fff" font-size="20" font-weight="800">~$20/mo</text>
        <text x="143" y="160" text-anchor="middle" fill="rgba(255,255,255,0.65)" font-size="12">one seat</text>
        <text x="143" y="196" text-anchor="middle" fill="rgba(255,255,255,0.55)" font-size="12">Can't pay? No help.</text>

        <text x="320" y="93" text-anchor="middle" fill="rgba(255,255,255,0.5)" font-size="22">→</text>

        <rect x="362" y="8" width="270" height="204" rx="14" fill="rgba(255,255,255,0.07)" stroke="rgba(255,255,255,0.28)"/>
        <text x="497" y="34" text-anchor="middle" fill="#fff" font-size="15" font-weight="700">OCS Intelligence LLM</text>
        <rect x="468" y="70" width="10" height="30" rx="2" fill="rgba(255,255,255,0.65)"/>
        <rect x="484" y="70" width="10" height="30" rx="2" fill="rgba(255,255,255,0.65)"/>
        <rect x="500" y="70" width="10" height="30" rx="2" fill="rgba(255,255,255,0.65)"/>
        <rect x="516" y="70" width="10" height="30" rx="2" fill="rgba(255,255,255,0.65)"/>
        <text x="497" y="138" text-anchor="middle" fill="#fff" font-size="20" font-weight="800">Shared compute</text>
        <text x="497" y="160" text-anchor="middle" fill="rgba(255,255,255,0.65)" font-size="12">every student</text>
        <text x="497" y="196" text-anchor="middle" fill="rgba(255,255,255,0.55)" font-size="12">Donated GPUs, shared.</text>
      </svg>
    </div>
  </div>

  <div class="ocs__card ocs-intelligence-gift">
    <p class="ocs-intelligence-gift-kicker">{{ gift.kicker }}</p>
    <h3 class="ocs__section-title">{{ gift.title }}</h3>
    <p class="ocs__text ocs__lead">{{ gift.body }}</p>
    <p class="ocs-intelligence-cost-line">{{ gift.costLine }}</p>
    <div class="ocs__stats">
      {% for stat in data.inventory %}
      <div class="ocs__stat">
        <span class="ocs__stat-value">{{ stat.value }}</span>
        <span class="ocs__stat-label">{{ stat.label }}</span>
      </div>
      {% endfor %}
    </div>
  </div>

  <div class="ocs__card">
    <h3 class="ocs__section-title">How this works</h3>
    <p class="ocs__text">Two pictures: the path from gift to classroom service, and how a student actually reaches it.</p>
    <div class="ocs__diagram-stack">
      <div class="ocs__diagram-block">
        <h4 class="ocs__diagram-title">From donation to three phases</h4>
        <div class="ocs__diagram">
          <pre class="mermaid">flowchart TD
          A[8x GTX 1070 rack] --> P0[Phase 0]
          P0 --> P01[Problem and RQs]
          P0 --> P02[Literature review]
          P0 --> P03[Pick a model]
          P01 --> H0[Phase 0 handoff]
          P02 --> H0
          P03 --> H0
          H0 --> P1[Phase 1]
          P1 --> P11[Build rack]
          P1 --> P12[Ollama llama.cpp]
          P1 --> P13[Stream and keys]
          P11 --> H1[Phase 1 service]
          P12 --> H1
          P13 --> H1
          H1 --> P2[Phase 2]
          P2 --> P21[Deploy service]
          P2 --> P22[Monitor load]
          P2 --> P23[Every student in]</pre>
        </div>
      </div>
      <div class="ocs__diagram-block">
        <h4 class="ocs__diagram-title">How a student reaches the model</h4>
        <div class="ocs__diagram">
          <pre class="mermaid">flowchart TD
          A[Student at school or home] --> B[Authenticated OCS API]
          B --> C[Broker and request queue]
          C --> D[Mini prepares session context]
          D --> E[GPU worker generates answer]
          E --> F[Stream returned to student]</pre>
        </div>
      </div>
    </div>
  </div>

  <section aria-labelledby="ocs-implementation-title">
    <div class="ocs__card">
      <h2 id="ocs-implementation-title" class="ocs__section-title">{{ data.implementation.title }}</h2>
      <p class="ocs__text ocs__lead">{{ data.implementation.introduction }}</p>
      <div class="ocs__diagram">
        <pre class="mermaid">{{ data.implementation.diagram | escape }}</pre>
      </div>
    </div>
    {% for section in data.implementation.sections %}
    <div class="ocs__card">
      <h3 class="ocs__section-title">{{ section.title }}</h3>
      <p class="ocs__text">{{ section.body }}</p>
      <ul class="ocs__text">
        {% for step in section.steps %}
        <li>{{ step }}</li>
        {% endfor %}
      </ul>
      <p class="ocs__text"><strong>How we will verify it:</strong> {{ section.evidence }}</p>
    </div>
    {% endfor %}
  </section>

  <p class="ocs__text ocs__lead">{{ data.researchQuestionsNote }}</p>

  {% for item in data.researchQuestions %}
  <div class="ocs__card">
    <h3 class="ocs__section-title">{{ item.label }}{% if item.priority %} · {{ item.priority }}{% endif %}</h3>
    <p class="ocs-intelligence-question">{{ item.question }}</p>
    <div class="ocs__facts">
      {% for fact in item.facts %}
      <div class="ocs__visual">
        <span class="ocs__team-label">{{ fact.label }}</span>
        <span class="ocs__team-name">{{ fact.text }}</span>
      </div>
      {% endfor %}
    </div>
    {% if item.endpoint %}
    <p class="ocs__text"><strong>Research endpoint:</strong> {{ item.endpoint }}</p>
    {% endif %}
  </div>
  {% endfor %}

  <div class="ocs__card">
    <h3 class="ocs__section-title">Three phases, one promise</h3>
    <p class="ocs__text">The tabs are the implementation path. First we name the problem and pick a direction. Then the gift becomes a live service. Then that service has to survive a class.</p>
    <div class="ocs__nav-grid ocs__nav-grid--in-card">
      {% for stage in data.stages %}
      <a href="{{ site.baseurl }}/capstone/ocs-intelligence/{{ stage.slug }}/" class="ocs__nav-card">
        <span class="ocs__status">{{ stage.navKicker }} · {{ stage.status }}</span>
        <h2 class="ocs__nav-card-title">{{ stage.title }}</h2>
        <p class="ocs__text">{{ stage.summary }}</p>
        <span class="ocs__nav-card-cta">Open this phase</span>
      </a>
      {% endfor %}
    </div>
  </div>

  <div class="ocs__card">
    <h3 class="ocs__section-title">Team split</h3>
    <div class="ocs__split">
      {% for team in data.teams %}
      <div class="ocs__visual">
        <div class="ocs__status">{{ team.name }}</div>
        <div class="ocs__team">
          <span class="ocs__team-name">{{ team.members }}</span>
          <p class="ocs__text">{{ team.role }}</p>
        </div>
      </div>
      {% endfor %}
    </div>
  </div>

  <div class="ocs__card">
    <p class="ocs-intelligence-gift-kicker">{{ data.communication.kicker }}</p>
    <h3 class="ocs__section-title">{{ data.communication.title }}</h3>
    <p class="ocs__text">{{ data.communication.body }}</p>
    <div class="ocs__facts">
      {% for channel in data.communication.channels %}
      <div class="ocs__visual">
        <span class="ocs__team-label">{{ channel.label }}</span>
        <p class="ocs__text">{{ channel.text }}</p>
      </div>
      {% endfor %}
    </div>
  </div>

  <div class="ocs__card">
    <h3 class="ocs__section-title">Justification</h3>
    <p class="ocs__text">{{ data.harnesses }}</p>
  </div>

  <div class="ocs__card">
    <div class="ocs__card-grid">
      <div class="ocs__visual">
        <h2 class="ocs-intelligence-project-title">{{ topic.visualTitle }}</h2>
        <div class="ocs-intelligence-impact-list">
          {% for stage in data.stages %}
          <a href="{{ site.baseurl }}/capstone/ocs-intelligence/{{ stage.slug }}/" class="ocs-intelligence-impact-item ocs-intelligence-stack-link">{{ stage.navLabel }}</a>
          {% endfor %}
        </div>
        <div class="ocs__status">{{ topic.status }}</div>
        <div class="ocs__team">
          <span class="ocs__team-label">Primary audience</span>
          <span class="ocs__team-name">{{ topic.audience }}</span>
        </div>
      </div>

      <div class="ocs-intelligence-content">
        <h2 class="ocs-intelligence-project-title">{{ topic.title }}</h2>
        <p class="ocs-intelligence-subtitle">{{ topic.subtitle }}</p>

        <div class="ocs__keypoints">
          {% for point in topic.keyPoints %}
          <div class="ocs__keypoint">
            <span class="ocs__check">✓</span>
            <span>{{ point }}</span>
          </div>
          {% endfor %}
        </div>

        <div class="ocs-intelligence-tech-stack">
          {% for tech in topic.tech %}
          <span class="ocs__status-pill">{{ tech }}</span>
          {% endfor %}
        </div>
      </div>

      <div class="ocs-intelligence-details">
        <h3 class="ocs__section-title">Why this is challenging</h3>
        <p class="ocs__text">{{ topic.description }}</p>

        <h3 class="ocs__section-title">Goal</h3>
        <p class="ocs__text">{{ topic.candidateModel }}</p>

        <h3 class="ocs__section-title">Impact</h3>
        <div class="ocs-intelligence-impact-list">
          {% for item in topic.impact %}
          <div class="ocs-intelligence-impact-item">{{ item }}</div>
          {% endfor %}
        </div>

        <a
          href="{{ topic.link }}"
          class="ocs__btn accent fill"
          target="_blank"
          rel="noopener noreferrer"
        >{{ topic.linkLabel }}</a>
      </div>
    </div>
  </div>

  <div class="ocs__card">
    <h3 class="ocs__section-title">Two rigs</h3>
    <p class="ocs__text">The donated production rack is the student-facing gift. A second box holds experiments so the class path stays calm.</p>
    <div class="ocs__split">
      {% for rig in data.rigs %}
      <div class="ocs__visual">
        <div class="ocs__status">{{ rig.status }}</div>
        <h2 class="ocs-intelligence-project-title">{{ rig.name }}</h2>
        <p class="ocs-intelligence-subtitle">{{ rig.role }}</p>
        <div class="ocs__team">
          <span class="ocs__team-label">{{ rig.team }}</span>
          <span class="ocs__team-name">{{ rig.members }}</span>
        </div>
        <div class="ocs-intelligence-tech-stack">
          <span class="ocs__status-pill">{{ rig.storage }}</span>
          <span class="ocs__status-pill">{{ rig.stack }}</span>
        </div>
      </div>
      {% endfor %}
    </div>
  </div>

  <div class="ocs__card">
    <h3 class="ocs__section-title">Capability we want in the room</h3>
    <p class="ocs__text">{{ data.chartsIntro }}</p>
    <div class="ocs__split">
      {% for chart in data.charts %}
      <figure class="ocs-intelligence-figure">
        <img src="{{ site.baseurl }}/images/{{ chart.image }}" alt="{{ chart.alt }}">
        <figcaption>
          {{ chart.caption }}
          Source: <a href="{{ chart.source }}" target="_blank" rel="noopener noreferrer">{{ chart.sourceLabel }}</a>.
        </figcaption>
      </figure>
      {% endfor %}
    </div>
  </div>
</div>
<!-- markdownlint-enable -->
