---
microblog: true
toc: false
layout: post
title: Educators Capstone
description: A Design-Based Research capstone creating interactive lessons that teach CS newcomers how to navigate temporal challenges — resolving make errors, handling merge conflicts, and mastering debugging workflows through guided wayfinding experiences.
permalink: /capstone/educators/
sticky_rank: 1
capstone_project:
  course: CSA
  school_year: "2025-2026"
  title: "Educators"
  image: "/images/capstone/educators_icon.png"
  description: "An educational platform that helps CS newcomers build mental models for temporal problem-solving in software development."
  team: "Nithika Vivek, Eshika Pallpotu, Saanvi Dogra"
  links:
    frontend: "https://github.com/NithikaVivek/pages-educators"
    backend: "https://github.com/NithikaVivek/spring-educators"
---

<!-- markdownlint-capture -->
<!-- markdownlint-disable -->
{% assign data = site.data.educators_infograph %}

<div class="ed-infograph">
  <!-- Header Section -->
  <div class="ed-header">
    <div class="ed-badge">Design-Based Research Capstone</div>
    <h1 class="ed-title">{{ data.Title }}</h1>
    <p class="ed-description">{{ data.Description }}</p>
  </div>

  <!-- Project Cards -->
  {% for topic in data.Topics %}
  <div class="ed-card">
    <div class="ed-card-grid">

      <!-- Left: Image & Status -->
      <div class="ed-visual">
        <a href="{{ site.baseurl }}{{ topic.link }}" class="ed-image-link">
          <img src="{{ site.baseurl }}/images/{{ topic.image }}" alt="{{ topic.alt }}" class="ed-image">
          <div class="ed-overlay">
            <span>View Project</span>
          </div>
        </a>
        <div class="ed-status">{{ topic.status }}</div>
        <div class="ed-team">
          <span class="ed-team-label">Project Leads</span>
          <span class="ed-team-name">{{ topic.team | join: ", " }}</span>
        </div>
      </div>

      <!-- Center: Key Points -->
      <div class="ed-content">
        <h2 class="ed-project-title">{{ topic.title }}</h2>
        <p class="ed-subtitle">{{ topic.subtitle }}</p>

        <div class="ed-keypoints">
          {% for point in topic.keyPoints %}
          <div class="ed-keypoint">
            <span class="ed-check">✓</span>
            <span>{{ point }}</span>
          </div>
          {% endfor %}
        </div>

        <div class="ed-tech-stack">
          {% for tech in topic.tech %}
          <span class="ed-tech-tag">{{ tech }}</span>
          {% endfor %}
        </div>
      </div>

      <!-- Right: Description & Impact -->
      <div class="ed-details">
        <h3 class="ed-section-title">About</h3>
        <p class="ed-about">{{ topic.description }}</p>

        <h3 class="ed-section-title">Impact</h3>
        <div class="ed-impact-list">
          {% for item in topic.impact %}
          <div class="ed-impact-item">{{ item }}</div>
          {% endfor %}
        </div>

        <a href="{{ site.baseurl }}{{ topic.link }}" class="ed-btn">Learn More</a>
      </div>

    </div>
  </div>
  {% endfor %}
</div>
<!-- markdownlint-restore -->
