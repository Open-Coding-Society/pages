---
microblog: true
toc: false
layout: post
title: Hunger Heroes Capstone
description: A Design-Based Research capstone project using JavaScript, Python, and Flask to fight food insecurity. Full-stack food redistribution platform connecting donors with those in need.
permalink: /capstone/hunger-heroes/
sticky_rank: 1
capstone_project:
  course: CSA
  school_year: "2025-2026"
  title: "Hunger Heroes"
  image: "/images/capstone/hunger_heroes.svg"
  description: "A community-driven platform connecting restaurants, grocery stores, and individuals with excess fresh food to local shelters, food banks, and families in need."
  team: "Ahaan, Shaurya, Arnav"
  links:
    frontend: "https://github.com/Ahaanv19/hunger_heroes"
    backend: "https://github.com/Ahaanv19/hunger_heroes_backend"
---

<!-- markdownlint-capture -->
<!-- markdownlint-disable -->
{% assign data = site.data.hunger_heroes_infograph %}

<div class="hh-infograph">
  <!-- Header Section -->
  <div class="hh-header">
    <div class="hh-badge">Design-Based Research Capstone</div>
    <h1 class="hh-title">{{ data.Title }}</h1>
    <p class="hh-description">{{ data.Description }}</p>
  </div>

  <!-- Project Cards -->
  {% for topic in data.Topics %}
  <div class="hh-card">
    <div class="hh-card-grid">

      <!-- Left: Image & Status -->
      <div class="hh-visual">
        <a href="{{ site.baseurl }}{{ topic.link }}" class="hh-image-link">
          <img src="{{ site.baseurl }}/images/{{ topic.image }}" alt="{{ topic.alt }}" class="hh-image">
          <div class="hh-overlay">
            <span>View Project</span>
          </div>
        </a>
        <div class="hh-status">{{ topic.status }}</div>
        <div class="hh-team">
          <span class="hh-team-label">Project Leads</span>
          <span class="hh-team-name">{{ topic.team | join: ", " }}</span>
        </div>
      </div>

      <!-- Center: Key Points -->
      <div class="hh-content">
        <h2 class="hh-project-title">{{ topic.title }}</h2>
        <p class="hh-subtitle">{{ topic.subtitle }}</p>

        <div class="hh-keypoints">
          {% for point in topic.keyPoints %}
          <div class="hh-keypoint">
            <span class="hh-check">✓</span>
            <span>{{ point }}</span>
          </div>
          {% endfor %}
        </div>

        <div class="hh-tech-stack">
          {% for tech in topic.tech %}
          <span class="hh-tech-tag">{{ tech }}</span>
          {% endfor %}
        </div>
      </div>

      <!-- Right: Description & Impact -->
      <div class="hh-details">
        <h3 class="hh-section-title">About</h3>
        <p class="hh-about">{{ topic.description }}</p>

        {% if topic.videos %}
        <h3 class="hh-section-title">Videos</h3>
        <div class="hh-videos">
          {% for video in topic.videos %}
          <div class="hh-video-item">
            <p class="hh-video-title">{{ video.title }}</p>
            <video width="100%" height="auto" controls class="hh-video-player">
              <source src="{{ site.baseurl }}{{ video.path }}" type="video/mp4">
              Your browser does not support the video tag.
            </video>
          </div>
          {% endfor %}
        </div>
        {% endif %}

        <h3 class="hh-section-title">Impact</h3>
        <div class="hh-impact-list">
          {% for item in topic.impact %}
          <div class="hh-impact-item">{{ item }}</div>
          {% endfor %}
        </div>

        <a href="{{ site.baseurl }}{{ topic.link }}" class="hh-btn">Learn More</a>
      </div>

    </div>
  </div>
  {% endfor %}
</div>
<!-- markdownlint-restore -->
