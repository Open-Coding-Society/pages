---
microblog: true
toc: false
layout: post
title: Bud-E Capstone
description: A design-research capstone for a browser extension that gamifies productivity through a virtual pet that grows when users stay focused on whitelisted websites and degrades when they navigate to distracting sites.
permalink: /capstone/bud-e/
sticky_rank: 1
capstone_project:
  course: CSA
  school_year: "2025-2026"
  title: "Bud-E"
  image: "/images/capstone/bud_e.png"
  description: "Bud-E is a browser extension that gamifies productivity through a persistent virtual pet that grows when users stay focused on whitelisted websites and degrades when they navigate to distracting sites."
  team: "Aadi Bhat, Pranav Santhosh, Nolan Hightower"
---

<!-- markdownlint-capture -->
<!-- markdownlint-disable -->
{% assign data = site.data.bud_e_infograph %}

<div class="be-infograph">
  <!-- Header Section -->
  <div class="be-header">
    <div class="be-badge">Design-Based Research Capstone</div>
    <h1 class="be-title">{{ data.Title }}</h1>
    <p class="be-description">{{ data.Description }}</p>
  </div>

  <!-- Project Cards -->
  {% for topic in data.Topics %}
  <div class="be-card">
    <div class="be-card-grid">

      <!-- Left: Image & Status -->
      <div class="be-visual">
        <a href="{{ site.baseurl }}{{ topic.link }}" class="be-image-link">
          <img src="{{ site.baseurl }}/images/{{ topic.image }}" alt="{{ topic.alt }}" class="be-image">
          <div class="be-overlay">
            <span>View Project</span>
          </div>
        </a>
        <div class="be-status">{{ topic.status }}</div>
        <div class="be-team">
          <span class="be-team-label">Project Leads</span>
          <span class="be-team-name">{{ topic.team | join: ", " }}</span>
        </div>
      </div>

      <!-- Center: Key Points -->
      <div class="be-content">
        <h2 class="be-project-title">{{ topic.title }}</h2>
        <p class="be-subtitle">{{ topic.subtitle }}</p>

        <div class="be-keypoints">
          {% for point in topic.keyPoints %}
          <div class="be-keypoint">
            <span class="be-check">✓</span>
            <span>{{ point }}</span>
          </div>
          {% endfor %}
        </div>

        <div class="be-tech-stack">
          {% for tech in topic.tech %}
          <span class="be-tech-tag">{{ tech }}</span>
          {% endfor %}
        </div>
      </div>

      <!-- Right: Description & Impact -->
      <div class="be-details">
        <h3 class="be-section-title">About</h3>
        <p class="be-about">{{ topic.description }}</p>

        <h3 class="be-section-title">Impact</h3>
        <div class="be-impact-list">
          {% for item in topic.impact %}
          <div class="be-impact-item">{{ item }}</div>
          {% endfor %}
        </div>

        <a href="{{ site.baseurl }}{{ topic.link }}" class="be-btn">Learn More</a>
      </div>

    </div>
  </div>
  {% endfor %}
</div>
<!-- markdownlint-restore -->
