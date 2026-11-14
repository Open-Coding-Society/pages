---
microblog: true
toc: false
layout: post
title: Big Six & Code Hub
description: The Big Six is a suite of six interactive CS lessons covering Frontend, Backend, Data Visualization, Resume Building, AI Usage, and Analytics. Code Hub is the RPG game level that brings three of those lessons to life — students explore Markdown & CSS, REST APIs, and data filtering through hands-on terminals and a Space Invaders quiz game that gates progression to the next terminal.
permalink: /capstone/big6/
sticky_rank: 1
capstone_project:
  course: CSA
  school_year: "2025-2026"
  title: "Big Six & Code Hub"
  image: "/images/capstone/backend.png"
  description: "The Big Six is a suite of six interactive CS lessons (Frontend, Backend, Data Visualization, Resume, AI, Analytics). Code Hub is the RPG game level where students walk up to three robot terminals — each teaching a core discipline — with a Space Invaders quiz gating progression to the next terminal."
  team: "Alex, Travis"
---

<!-- markdownlint-capture -->
<!-- markdownlint-disable -->
{% assign data = site.data.big6 %}

<div class="dd-infograph">
  <!-- Header Section -->
  <div class="dd-header">
    <div class="dd-badge">{{ data.Title }}</div>
    <h1 class="dd-title">{{ data.Title }}</h1>
    <p class="dd-description">{{ data.Description }}</p>
  </div>

  <!-- Project Cards -->
  {% for topic in data.Topics %}
  <div class="dd-card">
    <div class="dd-card-grid">

      <!-- Left: Image & Status -->
      <div class="dd-visual">
        <a href="{{ site.baseurl }}{{ topic.link }}" class="dd-image-link">
          <img src="{{ site.baseurl }}/images/{{ topic.image }}" alt="{{ topic.alt }}" class="dd-image">
          <div class="dd-overlay">
            <span>View Project</span>
          </div>
        </a>
        <div class="dd-status">{{ topic.status }}</div>
        <div class="dd-team">
          <span class="dd-team-label">Project Leads</span>
          <span class="dd-team-name">{{ topic.team | join: ", " }}</span>
        </div>
      </div>

      <!-- Center: Key Points -->
      <div class="dd-content">
        <h2 class="dd-project-title">{{ topic.title }}</h2>
        <p class="dd-subtitle">{{ topic.subtitle }}</p>

        <div class="dd-keypoints">
          {% for point in topic.keyPoints %}
          <div class="dd-keypoint">
            <span class="dd-check">✓</span>
            <span>{{ point }}</span>
          </div>
          {% endfor %}
        </div>

        <div class="dd-tech-stack">
          {% for tech in topic.tech %}
          <span class="dd-tech-tag">{{ tech }}</span>
          {% endfor %}
        </div>
      </div>

      <!-- Right: Description & Impact -->
      <div class="dd-details">
        <h3 class="dd-section-title">About</h3>
        <p class="dd-about">{{ topic.description }}</p>

        <h3 class="dd-section-title">Impact</h3>
        <div class="dd-impact-list">
          {% for item in topic.impact %}
          <div class="dd-impact-item">{{ item }}</div>
          {% endfor %}
        </div>

        <a href="{{ site.baseurl }}{{ topic.link }}" class="dd-btn">Learn More</a>
      </div>

    </div>
  </div>
  {% endfor %}
</div>
<!-- markdownlint-restore -->