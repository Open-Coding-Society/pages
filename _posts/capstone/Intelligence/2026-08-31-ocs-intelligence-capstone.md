---
microblog: true
toc: false
layout: post
title: OCS Intelligence LLM
description:
permalink: "/capstone/ocs-intelligence/"
sticky_rank: 1
year: 2026-2027
---
<!-- markdownlint-disable -->
{% assign data = site.data.ocs_intelligence_infograph %}
{% assign topic = data.Topics[0] %}
{% assign gift = data.donation %}

<div class="ocs-intelligence-infograph">
  <div class="ocs-intelligence-header">
    <div class="ocs-intelligence-badge">Design-Based Research Capstone</div>
    <h1 class="ocs-intelligence-title">{{ data.Title }}</h1>
    <p class="ocs-intelligence-description">{{ data.Description }}</p>
  </div>

  {% assign current_stage = page.ocs_stage | default: "" %}
{% assign overview_url = "/capstone/ocs-intelligence/" %}

<style>
.ocs-intelligence-infograph .ocs-intelligence-question {
  font-size: 1.35rem;
  font-weight: 700;
  line-height: 1.4;
  margin: 0;
}

.ocs-intelligence-infograph .ocs-intelligence-split,
.ocs-intelligence-infograph .ocs-intelligence-facts {
  display: grid;
  gap: 1.25rem;
  margin-top: 1.25rem;
  align-items: stretch;
}

.ocs-intelligence-infograph .ocs-intelligence-split {
  grid-template-columns: 1fr 1fr;
}

.ocs-intelligence-infograph .ocs-intelligence-facts {
  grid-template-columns: repeat(3, 1fr);
}

.ocs-intelligence-infograph .ocs-intelligence-split .ocs-intelligence-visual,
.ocs-intelligence-infograph .ocs-intelligence-facts .ocs-intelligence-visual {
  width: 100%;
  height: 100%;
}

.ocs-intelligence-infograph .ocs-intelligence-team .ocs-intelligence-about {
  margin: 0.35rem 0 0;
  text-align: center;
}

.ocs-intelligence-infograph .ocs-intelligence-diagram {
  margin: 1rem 0 1.25rem;
  padding: 1.25rem;
  overflow-x: auto;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 12px;
}

.ocs-intelligence-infograph .ocs-intelligence-diagram-stack {
  display: grid;
  gap: 1.5rem;
  margin-top: 1rem;
}

.ocs-intelligence-infograph .ocs-intelligence-diagram-block .ocs-intelligence-diagram {
  margin-bottom: 0;
}

.ocs-intelligence-infograph .ocs-intelligence-diagram-title {
  margin: 0 0 0.5rem;
  font-size: 0.95rem;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.75);
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

@media (min-width: 900px) {
  .ocs-intelligence-infograph .ocs-intelligence-diagram-stack {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    align-items: start;
  }
}

.ocs-intelligence-infograph .ocs-intelligence-diagram .mermaid {
  display: flex;
  justify-content: center;
  margin: 0;
}

.ocs-intelligence-infograph .ocs-intelligence-diagram .mermaid,
.ocs-intelligence-infograph .ocs-intelligence-diagram .mermaid * {
  box-sizing: content-box;
}

.ocs-intelligence-infograph .ocs-intelligence-figure {
  margin: 0;
}

.ocs-intelligence-infograph .ocs-intelligence-figure img {
  display: block;
  width: 100%;
  height: auto;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: rgba(0, 0, 0, 0.35);
}

.ocs-intelligence-infograph .ocs-intelligence-figure figcaption {
  margin-top: 0.55rem;
  color: rgba(255, 255, 255, 0.75);
  font-size: 0.9rem;
  line-height: 1.45;
}

.ocs-intelligence-infograph .ocs-intelligence-figure a {
  text-decoration: underline;
  text-underline-offset: 2px;
}

.ocs-intelligence-infograph .ocs-intelligence-table-wrap {
  overflow-x: auto;
  margin-top: 1rem;
}

.ocs-intelligence-infograph .ocs-intelligence-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.95rem;
}

.ocs-intelligence-infograph .ocs-intelligence-table th,
.ocs-intelligence-infograph .ocs-intelligence-table td {
  text-align: left;
  padding: 0.9rem 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.12);
  vertical-align: top;
}

.ocs-intelligence-infograph .ocs-intelligence-table th {
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.75);
}

.ocs-intelligence-infograph .ocs-intelligence-table td {
  color: rgba(255, 255, 255, 0.75);
  line-height: 1.5;
}

.ocs-intelligence-infograph .ocs-intelligence-table td:first-child {
  font-weight: 600;
  min-width: 12rem;
}

.ocs-intelligence-infograph .ocs-intelligence-table td:nth-child(2) {
  white-space: nowrap;
  width: 8rem;
}

.ocs-intelligence-infograph .ocs-intelligence-table a {
  text-decoration: none;
}

.ocs-intelligence-infograph .ocs-intelligence-table a:hover {
  text-decoration: underline;
  text-underline-offset: 2px;
}

.ocs-intelligence-infograph .ocs-intelligence-table tr:last-child td {
  border-bottom: none;
}

.ocs-intelligence-infograph .ocs-intelligence-table .ocs-intelligence-tech-tag {
  display: inline-block;
  margin: 0;
}

.ocs-intelligence-infograph .ocs-intelligence-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 0.85rem;
  margin: 1.25rem 0 0;
}

.ocs-intelligence-infograph .ocs-intelligence-stat {
  padding: 1rem 0.75rem;
  text-align: center;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
}

.ocs-intelligence-infograph .ocs-intelligence-stat-value {
  display: block;
  font-size: 1.7rem;
  font-weight: 800;
  line-height: 1.1;
  letter-spacing: -0.03em;
}

.ocs-intelligence-infograph .ocs-intelligence-stat-label {
  display: block;
  margin-top: 0.35rem;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.75);
}

.ocs-intelligence-infograph .ocs-intelligence-gpu-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.45rem;
  width: 100%;
  margin: 0.75rem 0 0.5rem;
}

.ocs-intelligence-infograph .ocs-intelligence-gpu {
  display: grid;
  place-items: center;
  aspect-ratio: 1;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.14);
  border-radius: 10px;
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.02em;
}

.ocs-intelligence-infograph .ocs-intelligence-card-grid + .ocs-intelligence-stats {
  margin-top: 1.75rem;
}

.ocs-intelligence-infograph .ocs-intelligence-card-grid + .ocs-intelligence-stats + .ocs-intelligence-section-title {
  margin-top: 1.75rem;
}

@media (max-width: 900px) {
  .ocs-intelligence-infograph .ocs-intelligence-facts {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .ocs-intelligence-infograph .ocs-intelligence-split {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 520px) {
  .ocs-intelligence-infograph .ocs-intelligence-stats {
    grid-template-columns: 1fr;
  }

  .ocs-intelligence-infograph .ocs-intelligence-gpu-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

.ocs-intelligence-infograph .ocs-intelligence-stage-nav {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 0.75rem;
  margin-bottom: 2rem;
  padding-bottom: 1.25rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.12);
}

.ocs-intelligence-infograph .ocs-intelligence-stage-nav-link {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.2rem;
  padding: 0.9rem 1.1rem;
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.14);
  background: rgba(255, 255, 255, 0.05);
  color: rgba(255, 255, 255, 0.75);
  font-weight: 600;
  text-decoration: none;
  min-height: 4.75rem;
  transition: background 0.2s ease, color 0.2s ease, border-color 0.2s ease;
}

.ocs-intelligence-infograph .ocs-intelligence-stage-nav-kicker {
  font-size: 0.68rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.55);
}

.ocs-intelligence-infograph .ocs-intelligence-stage-nav-link,
.ocs-intelligence-infograph .ocs-intelligence-stage-nav-link:visited,
.ocs-intelligence-infograph .ocs-intelligence-phase-card,
.ocs-intelligence-infograph .ocs-intelligence-phase-card:visited {
  color: rgba(255, 255, 255, 0.75);
}

.ocs-intelligence-infograph .ocs-intelligence-stage-nav-link .ocs-intelligence-stage-nav-title {
  color: #ffffff;
}

.ocs-intelligence-infograph .ocs-intelligence-stage-nav-link:hover {
  color: #ffffff;
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.24);
}

.ocs-intelligence-infograph .ocs-intelligence-stage-nav-link.is-active {
  color: #ffffff;
  background: rgba(255, 255, 255, 0.16);
  border-color: rgba(255, 255, 255, 0.32);
}

.ocs-intelligence-infograph .ocs-intelligence-gift-kicker,
.ocs-intelligence-infograph .ocs-intelligence-cost-line {
  letter-spacing: 0.04em;
}

.ocs-intelligence-infograph .ocs-intelligence-gift-kicker {
  margin: 0 0 0.5rem;
  font-size: 0.78rem;
  font-weight: 700;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.62);
}

.ocs-intelligence-infograph .ocs-intelligence-lead {
  font-size: 1.08rem;
  line-height: 1.75;
  max-width: 70ch;
}

.ocs-intelligence-infograph .ocs-intelligence-cost-line {
  margin: 1.25rem 0 0;
  font-size: 1.05rem;
  font-weight: 700;
  color: #ffffff;
}

.ocs-intelligence-infograph .ocs-intelligence-gift .ocs-intelligence-stats {
  margin-top: 1.75rem;
}

.ocs-intelligence-infograph .ocs-intelligence-phase-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1.25rem;
  margin-top: 1.25rem;
}

.ocs-intelligence-infograph .ocs-intelligence-phase-card {
  display: block;
  padding: 1.5rem;
  border-radius: 18px;
  border: 1px solid rgba(255, 255, 255, 0.14);
  background: rgba(255, 255, 255, 0.04);
  color: inherit;
  text-decoration: none;
  min-height: 100%;
  transition: background 0.2s ease, border-color 0.2s ease, transform 0.2s ease;
}

.ocs-intelligence-infograph .ocs-intelligence-phase-card:hover {
  background: rgba(255, 255, 255, 0.09);
  border-color: rgba(255, 255, 255, 0.28);
  transform: translateY(-2px);
}

.ocs-intelligence-infograph .ocs-intelligence-phase-card .ocs-intelligence-project-title {
  margin: 0.75rem 0 0.65rem;
  font-size: 1.35rem;
}

.ocs-intelligence-infograph .ocs-intelligence-phase-cta {
  display: inline-block;
  margin-top: 1rem;
  font-size: 0.82rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: #ffffff;
}

@media (max-width: 900px) {
  .ocs-intelligence-infograph .ocs-intelligence-stage-nav,
  .ocs-intelligence-infograph .ocs-intelligence-phase-grid {
    grid-template-columns: 1fr;
  }
}

.ocs-intelligence-infograph .ocs-intelligence-stage-status {
  display: inline-block;
  margin-top: 1rem;
}

.ocs-intelligence-infograph .ocs-intelligence-stack-link {
  display: block;
  color: rgba(255, 255, 255, 0.75);
  text-decoration: none;
  transition: background 0.2s ease, color 0.2s ease, border-color 0.2s ease;
}

.ocs-intelligence-infograph .ocs-intelligence-stack-link:hover {
  color: #ffffff;
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.22);
}
</style>

<nav class="ocs-intelligence-stage-nav" aria-label="OCS Intelligence LLM implementation phases">
  <a
    href="{{ site.baseurl }}{{ overview_url }}"
    class="ocs-intelligence-stage-nav-link{% if current_stage == '' %} is-active{% endif %}"
    {% if current_stage == '' %}aria-current="page"{% endif %}
  >
    <span class="ocs-intelligence-stage-nav-kicker">Story</span>
    <span class="ocs-intelligence-stage-nav-title">Overview</span>
  </a>
  {% for stage in data.stages %}
  <a
    href="{{ site.baseurl }}/capstone/ocs-intelligence/{{ stage.slug }}/"
    class="ocs-intelligence-stage-nav-link{% if current_stage == stage.slug %} is-active{% endif %}"
    {% if current_stage == stage.slug %}aria-current="page"{% endif %}
  >
    <span class="ocs-intelligence-stage-nav-kicker">{{ stage.navKicker }}</span>
    <span class="ocs-intelligence-stage-nav-title">{{ stage.navLabel }}</span>
  </a>
  {% endfor %}
</nav>


  <div class="ocs-intelligence-card">
    <p class="ocs-intelligence-gift-kicker">{{ data.problemStatement.kicker }}</p>
    <h3 class="ocs-intelligence-section-title">{{ data.problemStatement.title }}</h3>
    <p class="ocs-intelligence-about ocs-intelligence-lead">{{ data.problemStatement.body }}</p>
    <div class="ocs-intelligence-diagram" role="img" aria-label="Comparison: a paid AI subscription serves one seat, versus OCS Intelligence LLM which serves every student off donated hardware.">
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

  <div class="ocs-intelligence-card ocs-intelligence-gift">
    <p class="ocs-intelligence-gift-kicker">{{ gift.kicker }}</p>
    <h3 class="ocs-intelligence-section-title">{{ gift.title }}</h3>
    <p class="ocs-intelligence-about ocs-intelligence-lead">{{ gift.body }}</p>
    <p class="ocs-intelligence-cost-line">{{ gift.costLine }}</p>
    <div class="ocs-intelligence-stats">
      {% for stat in data.inventory %}
      <div class="ocs-intelligence-stat">
        <span class="ocs-intelligence-stat-value">{{ stat.value }}</span>
        <span class="ocs-intelligence-stat-label">{{ stat.label }}</span>
      </div>
      {% endfor %}
    </div>
  </div>

  <div class="ocs-intelligence-card">
    <h3 class="ocs-intelligence-section-title">How this works</h3>
    <p class="ocs-intelligence-about">Two pictures: the path from gift to classroom service, and how a student actually reaches it.</p>
    <div class="ocs-intelligence-diagram-stack">
      <div class="ocs-intelligence-diagram-block">
        <h4 class="ocs-intelligence-diagram-title">From donation to three phases</h4>
        <div class="ocs-intelligence-diagram">
          <pre class="mermaid">flowchart LR
    A[Donated 8x GTX 1070 rack] --> P0[Phase 0]
    P0 --> B[Phase 1]
    B --> C[Phase 2]
    P0 --> P01[Problem and research questions]
    P0 --> P02[Literature review]
    P0 --> P03[Pick a candidate model]
    B --> B1[Build rack]
    B --> B2[Ollama and llama.cpp]
    B --> B3[Stream and keys]
    C --> C1[Deploy service]
    C --> C2[Monitor under load]
    C --> C3[Every student gets in]</pre>
        </div>
      </div>
      <div class="ocs-intelligence-diagram-block">
        <h4 class="ocs-intelligence-diagram-title">How a student reaches the model</h4>
        <div class="ocs-intelligence-diagram">
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
    <div class="ocs-intelligence-card">
      <h2 id="ocs-implementation-title" class="ocs-intelligence-section-title">{{ data.implementation.title }}</h2>
      <p class="ocs-intelligence-about ocs-intelligence-lead">{{ data.implementation.introduction }}</p>
      <div class="ocs-intelligence-diagram">
        <pre class="mermaid">{{ data.implementation.diagram | escape }}</pre>
      </div>
    </div>
    {% for section in data.implementation.sections %}
    <div class="ocs-intelligence-card">
      <h3 class="ocs-intelligence-section-title">{{ section.title }}</h3>
      <p class="ocs-intelligence-about">{{ section.body }}</p>
      <ul class="ocs-intelligence-about">
        {% for step in section.steps %}
        <li>{{ step }}</li>
        {% endfor %}
      </ul>
      <p class="ocs-intelligence-about"><strong>How we will verify it:</strong> {{ section.evidence }}</p>
    </div>
    {% endfor %}
  </section>

  <p class="ocs-intelligence-about ocs-intelligence-lead">{{ data.researchQuestionsNote }}</p>

  {% for item in data.researchQuestions %}
  <div class="ocs-intelligence-card">
    <h3 class="ocs-intelligence-section-title">{{ item.label }}{% if item.priority %} · {{ item.priority }}{% endif %}</h3>
    <p class="ocs-intelligence-question">{{ item.question }}</p>
    <div class="ocs-intelligence-facts">
      {% for fact in item.facts %}
      <div class="ocs-intelligence-visual">
        <span class="ocs-intelligence-team-label">{{ fact.label }}</span>
        <span class="ocs-intelligence-team-name">{{ fact.text }}</span>
      </div>
      {% endfor %}
    </div>
    {% if item.endpoint %}
    <p class="ocs-intelligence-about"><strong>Research endpoint:</strong> {{ item.endpoint }}</p>
    {% endif %}
  </div>
  {% endfor %}

  <div class="ocs-intelligence-card">
    <h3 class="ocs-intelligence-section-title">Three phases, one promise</h3>
    <p class="ocs-intelligence-about">The tabs are the implementation path. First we name the problem and pick a direction. Then the gift becomes a live service. Then that service has to survive a class.</p>
    <div class="ocs-intelligence-phase-grid">
      {% for stage in data.stages %}
      <a href="{{ site.baseurl }}/capstone/ocs-intelligence/{{ stage.slug }}/" class="ocs-intelligence-phase-card">
        <span class="ocs-intelligence-status">{{ stage.navKicker }} · {{ stage.status }}</span>
        <h2 class="ocs-intelligence-project-title">{{ stage.title }}</h2>
        <p class="ocs-intelligence-about">{{ stage.summary }}</p>
        <span class="ocs-intelligence-phase-cta">Open this phase</span>
      </a>
      {% endfor %}
    </div>
  </div>

  <div class="ocs-intelligence-card">
    <h3 class="ocs-intelligence-section-title">Team split</h3>
    <div class="ocs-intelligence-split">
      {% for team in data.teams %}
      <div class="ocs-intelligence-visual">
        <div class="ocs-intelligence-status">{{ team.name }}</div>
        <div class="ocs-intelligence-team">
          <span class="ocs-intelligence-team-name">{{ team.members }}</span>
          <p class="ocs-intelligence-about">{{ team.role }}</p>
        </div>
      </div>
      {% endfor %}
    </div>
  </div>

  <div class="ocs-intelligence-card">
    <p class="ocs-intelligence-gift-kicker">{{ data.communication.kicker }}</p>
    <h3 class="ocs-intelligence-section-title">{{ data.communication.title }}</h3>
    <p class="ocs-intelligence-about">{{ data.communication.body }}</p>
    <div class="ocs-intelligence-facts">
      {% for channel in data.communication.channels %}
      <div class="ocs-intelligence-visual">
        <span class="ocs-intelligence-team-label">{{ channel.label }}</span>
        <p class="ocs-intelligence-about">{{ channel.text }}</p>
      </div>
      {% endfor %}
    </div>
  </div>

  <div class="ocs-intelligence-card">
    <h3 class="ocs-intelligence-section-title">Justification</h3>
    <p class="ocs-intelligence-about">{{ data.harnesses }}</p>
  </div>

  <div class="ocs-intelligence-card">
    <div class="ocs-intelligence-card-grid">
      <div class="ocs-intelligence-visual">
        <h2 class="ocs-intelligence-project-title">{{ topic.visualTitle }}</h2>
        <div class="ocs-intelligence-impact-list">
          {% for stage in data.stages %}
          <a href="{{ site.baseurl }}/capstone/ocs-intelligence/{{ stage.slug }}/" class="ocs-intelligence-impact-item ocs-intelligence-stack-link">{{ stage.navLabel }}</a>
          {% endfor %}
        </div>
        <div class="ocs-intelligence-status">{{ topic.status }}</div>
        <div class="ocs-intelligence-team">
          <span class="ocs-intelligence-team-label">Primary audience</span>
          <span class="ocs-intelligence-team-name">{{ topic.audience }}</span>
        </div>
      </div>

      <div class="ocs-intelligence-content">
        <h2 class="ocs-intelligence-project-title">{{ topic.title }}</h2>
        <p class="ocs-intelligence-subtitle">{{ topic.subtitle }}</p>

        <div class="ocs-intelligence-keypoints">
          {% for point in topic.keyPoints %}
          <div class="ocs-intelligence-keypoint">
            <span class="ocs-intelligence-check">✓</span>
            <span>{{ point }}</span>
          </div>
          {% endfor %}
        </div>

        <div class="ocs-intelligence-tech-stack">
          {% for tech in topic.tech %}
          <span class="ocs-intelligence-tech-tag">{{ tech }}</span>
          {% endfor %}
        </div>
      </div>

      <div class="ocs-intelligence-details">
        <h3 class="ocs-intelligence-section-title">Why this is challenging</h3>
        <p class="ocs-intelligence-about">{{ topic.description }}</p>

        <h3 class="ocs-intelligence-section-title">Goal</h3>
        <p class="ocs-intelligence-about">{{ topic.candidateModel }}</p>

        <h3 class="ocs-intelligence-section-title">Impact</h3>
        <div class="ocs-intelligence-impact-list">
          {% for item in topic.impact %}
          <div class="ocs-intelligence-impact-item">{{ item }}</div>
          {% endfor %}
        </div>

        <a
          href="{{ topic.link }}"
          class="ocs-intelligence-btn"
          target="_blank"
          rel="noopener noreferrer"
        >{{ topic.linkLabel }}</a>
      </div>
    </div>
  </div>

  <div class="ocs-intelligence-card">
    <h3 class="ocs-intelligence-section-title">Two rigs</h3>
    <p class="ocs-intelligence-about">The donated production rack is the student-facing gift. A second box holds experiments so the class path stays calm.</p>
    <div class="ocs-intelligence-split">
      {% for rig in data.rigs %}
      <div class="ocs-intelligence-visual">
        <div class="ocs-intelligence-status">{{ rig.status }}</div>
        <h2 class="ocs-intelligence-project-title">{{ rig.name }}</h2>
        <p class="ocs-intelligence-subtitle">{{ rig.role }}</p>
        <div class="ocs-intelligence-team">
          <span class="ocs-intelligence-team-label">{{ rig.team }}</span>
          <span class="ocs-intelligence-team-name">{{ rig.members }}</span>
        </div>
        <div class="ocs-intelligence-tech-stack">
          <span class="ocs-intelligence-tech-tag">{{ rig.storage }}</span>
          <span class="ocs-intelligence-tech-tag">{{ rig.stack }}</span>
        </div>
      </div>
      {% endfor %}
    </div>
  </div>

  <div class="ocs-intelligence-card">
    <h3 class="ocs-intelligence-section-title">Capability we want in the room</h3>
    <p class="ocs-intelligence-about">{{ data.chartsIntro }}</p>
    <div class="ocs-intelligence-split">
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
