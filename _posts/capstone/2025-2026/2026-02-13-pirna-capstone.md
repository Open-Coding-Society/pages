---
microblog: true
toc: false
layout: post
title: Pirna OCS Messaging Capstone
description: Integrating a groups messaging system into OCS to improve collaboration and engagement.
permalink: /capstone/pirna/
sticky_rank: 1
capstone_project:
  course: CSA
  school_year: "2025-2026"
  title: "Pirna"
  image: "/images/capstone/pirna_logo.png"
  description: "Improve group-level communication and engagement on OCS through an integrated messaging system, while generating practical design principles for scalable, analytics-informed collaborative tools in educational platforms."
  team: "Nikhil, Rohan, Adi"
  links:
    frontend: "https://github.com/adikatre/Pirna-pages"
    backend: "https://github.com/adikatre/Pirna-spring"
---

<!-- markdownlint-capture -->
<!-- markdownlint-disable -->
{% assign data = site.data.pirna_capstone_infograph %}

<div class="pirna-infograph">
  <!-- Header Section -->
  <div class="pirna-header">
    {% if data.Logo %}
    <img src="{{ site.baseurl }}/images/{{ data.Logo }}" alt="Project Logo" class="pirna-logo">
    {% endif %}
    <div class="pirna-badge">Design-Based
      Research Capstone</div>
    <h1 class="pirna-title">{{ data.Title }}</h1>
    <p class="pirna-description">{{ data.Description }}</p>
  </div>

  <!-- Project Cards -->
  {% for topic in data.Topics %}
  <div class="pirna-card">
    <div class="pirna-card-grid">

      <!-- Left: Image & Status -->
      <div class="pirna-visual">
        <a href="{{ site.baseurl }}{{ topic.link }}" class="pirna-image-link">
          <img src="{{ site.baseurl }}/images/{{ topic.image }}" alt="{{ topic.alt }}" class="pirna-image">
          <div class="pirna-overlay">
            <span>View Project</span>
          </div>
        </a>
        <div class="pirna-status">{{ topic.status }}</div>
        <div class="pirna-team">
          <span class="pirna-team-label">Project Leads</span>
          <span class="pirna-team-name">{{ topic.team | join: ", " }}</span>
        </div>
      </div>

      <!-- Center: Key Points -->
      <div class="pirna-content">
        <h2 class="pirna-project-title">{{ topic.title }}</h2>
        <p class="pirna-subtitle">{{ topic.subtitle }}</p>

        <div class="pirna-keypoints">
          {% for point in topic.keyPoints %}
          <div class="pirna-keypoint">
            <span class="pirna-check">✓</span>
            <span>{{ point }}</span>
          </div>
          {% endfor %}
        </div>

        <div class="pirna-tech-stack">
          {% for tech in topic.tech %}
          <span class="pirna-tech-tag">{{ tech }}</span>
          {% endfor %}
        </div>
      </div>

      <!-- Right: Description & Impact -->
      <div class="pirna-details">
        <h3 class="pirna-section-title">About</h3>
        <p class="pirna-about">{{ topic.description }}</p>

        <h3 class="pirna-section-title">Impact</h3>
        <div class="pirna-impact-list">
          {% for item in topic.impact %}
          <div class="pirna-impact-item">{{ item }}</div>
          {% endfor %}
        </div>

        <a href="{{ site.baseurl }}{{ topic.link }}" class="pirna-btn">Learn More</a>
      </div>

    </div>
  </div>
  {% endfor %}
</div>
<!-- markdownlint-restore -->
