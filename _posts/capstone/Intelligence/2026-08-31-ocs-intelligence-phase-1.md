---
layout: post
microblog: true
title: 'OCS Intelligence LLM — Phase 1: Rack, inference & access'
description: Build the donated GPU rack, run Ollama and llama.cpp, and stream models to student harnesses with keys.
permalink: "/capstone/ocs-intelligence/phase-1/"
ocs_stage: phase-1
year: 2026-2027
---
<!-- markdownlint-disable -->
{% assign data = site.data.ocs_intelligence_infograph %}
{% assign stage_slug = page.ocs_stage %}
{% assign stage = nil %}
{% for s in data.stages %}
  {% if s.slug == stage_slug %}
    {% assign stage = s %}
  {% endif %}
{% endfor %}

{% unless stage %}
  <p>Phase not found.</p>
{% else %}
<div class="ocs-intelligence-infograph">
  <div class="ocs-intelligence-header">
    <div class="ocs__badge">{{ stage.navKicker }} of {{ data.stages | size }} · Implementation</div>
    <h1 class="ocs-intelligence-title">{{ stage.title }}</h1>
    <p class="ocs__description">{{ stage.summary }}</p>
    <div class="ocs__status ocs-intelligence-stage-status">{{ stage.status }}</div>
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


  {% if stage.showDonation %}
  {% assign gift = data.donation %}
  <div class="ocs__card ocs-intelligence-gift">
    <p class="ocs-intelligence-gift-kicker">{{ gift.kicker }}</p>
    <h3 class="ocs__section-title">{{ gift.title }}</h3>
    <p class="ocs__text">{{ gift.body }}</p>
    <p class="ocs-intelligence-cost-line">{{ gift.costLine }}</p>
  </div>
  {% endif %}

  <div class="ocs__card">
    <h3 class="ocs__section-title">What this phase is for</h3>
    <div class="ocs__keypoints">
      {% for goal in stage.goals %}
      <div class="ocs__keypoint">
        <span class="ocs__check">✓</span>
        <span>{{ goal }}</span>
      </div>
      {% endfor %}
    </div>
    {% if stage.tech %}
    <div class="ocs-intelligence-tech-stack">
      {% for tech in stage.tech %}
      <span class="ocs__status-pill">{{ tech }}</span>
      {% endfor %}
    </div>
    {% endif %}
  </div>

  {% if stage.workstreams %}
  <div class="ocs__card">
    <h3 class="ocs__section-title">How the work shows up</h3>
    <div class="ocs__facts">
      {% for item in stage.workstreams %}
      <div class="ocs__visual">
        <span class="ocs__team-label">{{ item.title }}</span>
        <p class="ocs__text">{{ item.detail }}</p>
      </div>
      {% endfor %}
    </div>
  </div>
  {% endif %}

  {% if stage.doneWhen %}
  <div class="ocs__card">
    <h3 class="ocs__section-title">Done when</h3>
    <div class="ocs__keypoints">
      {% for item in stage.doneWhen %}
      <div class="ocs__keypoint">
        <span class="ocs__check">→</span>
        <span>{{ item }}</span>
      </div>
      {% endfor %}
    </div>
  </div>
  {% endif %}

  {% if stage.showAllResearchQuestions %}
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
  {% elsif stage.showResearchQuestion %}
  {% assign rq_index = stage.showResearchQuestion | minus: 1 %}
  {% assign item = data.researchQuestions[rq_index] %}
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
  {% endif %}

  {% if stage.priorities %}
  <div class="ocs__card">
    <h3 class="ocs__section-title">Priorities for this phase</h3>
    <div class="ocs__facts">
      {% for item in stage.priorities %}
      <div class="ocs__visual">
        <span class="ocs__team-label">{{ item.priority }}</span>
        <span class="ocs__team-name">{{ item.text }}</span>
      </div>
      {% endfor %}
    </div>
  </div>
  {% endif %}

  {% if stage.apiEndpoints %}
  <div class="ocs__card">
    <h3 class="ocs__section-title">Serving endpoints</h3>
    <p class="ocs__text">The literal endpoints student harnesses talk to once a model is loaded on the rack.</p>
    <div class="ocs__table-wrap">
      <table class="ocs__table">
        <thead>
          <tr>
            <th scope="col">Endpoint</th>
            <th scope="col">Engine</th>
            <th scope="col">What it's for</th>
          </tr>
        </thead>
        <tbody>
          {% for ep in stage.apiEndpoints %}
          <tr>
            <td>{{ ep.method }} {{ ep.path }}</td>
            <td><span class="ocs__status-pill">{{ ep.engine }}</span></td>
            <td>{{ ep.text }}</td>
          </tr>
          {% endfor %}
        </tbody>
      </table>
    </div>
  </div>
  {% endif %}

  {% if stage.showJustification %}
  <div class="ocs__card">
    <h3 class="ocs__section-title">Why electricity is the whole bill</h3>
    <div class="ocs__diagram">
      <pre class="mermaid">flowchart TD
    A[Paid subscriptions] --> B[Donated GPU rack]
    B --> C[Host open models locally]
    C --> D[Electricity only]
    D --> E[Stream, keys, harness]
    E --> F[Student on another network]
    F --> G[Same chance to code with a model]</pre>
    </div>
    <p class="ocs__text">{{ data.harnesses }}</p>
  </div>
  {% endif %}

  {% if stage.impact %}
  <div class="ocs__card">
    <h3 class="ocs__section-title">If this phase works</h3>
    <div class="ocs-intelligence-impact-list">
      {% for item in stage.impact %}
      <div class="ocs-intelligence-impact-item">{{ item }}</div>
      {% endfor %}
    </div>
  </div>
  {% endif %}

  {% if stage.showInventory %}
  <div class="ocs__card">
    <h3 class="ocs__section-title">What we were given to work with</h3>
    <div class="ocs__stats">
      {% for stat in data.inventory %}
      <div class="ocs__stat">
        <span class="ocs__stat-value">{{ stat.value }}</span>
        <span class="ocs__stat-label">{{ stat.label }}</span>
      </div>
      {% endfor %}
    </div>
  </div>
  {% endif %}

  {% if stage.showRigs %}
  <div class="ocs__card">
    <h3 class="ocs__section-title">Who carries the donated rack</h3>
    <p class="ocs__text">Team 1 puts the gifted production box in front of students. Team 2 keeps experiments off that path.</p>
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
  {% endif %}

  {% if stage.showAllLiterature or stage.literatureTitles.size > 0 %}
  <div class="ocs__card">
    <h3 class="ocs__section-title">Literature</h3>
    <div class="ocs__table-wrap">
      <table class="ocs__table">
        <thead>
          <tr>
            <th scope="col">Resource</th>
            <th scope="col">Type</th>
            <th scope="col">What it means</th>
          </tr>
        </thead>
        <tbody>
          {% if stage.showAllLiterature %}
            {% for item in data.literature %}
          <tr>
            <td>
              <a href="{{ item.url }}" target="_blank" rel="noopener noreferrer">{{ item.title }}</a>
            </td>
            <td><span class="ocs__status-pill">{{ item.type }}</span></td>
            <td>{{ item.description }}</td>
          </tr>
            {% endfor %}
          {% else %}
            {% for lit_title in stage.literatureTitles %}
              {% for item in data.literature %}
                {% if item.title == lit_title %}
          <tr>
            <td>
              <a href="{{ item.url }}" target="_blank" rel="noopener noreferrer">{{ item.title }}</a>
            </td>
            <td><span class="ocs__status-pill">{{ item.type }}</span></td>
            <td>{{ item.description }}</td>
          </tr>
                {% endif %}
              {% endfor %}
            {% endfor %}
          {% endif %}
        </tbody>
      </table>
    </div>
  </div>
  {% endif %}
</div>
{% endunless %}
<!-- markdownlint-enable -->
