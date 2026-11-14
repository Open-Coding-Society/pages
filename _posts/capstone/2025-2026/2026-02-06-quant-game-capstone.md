---
microblog: true
toc: false
layout: post
title: Quantitative Trading Bot Capstone
description: A Design-Based Research capstone project using machine learning, news sentiment analysis, databases, and graph-based data structures to predict short-term stock market movement.
permalink: /capstone/quant-trading-bot/
sticky_rank: 1
capstone_project:
  course: CSA
  school_year: "2025-2026"
  title: "Quantitative Trading Bot"
  image: "/images/capstone/quant-trading-game.png"
  description: "We are developing a quantitative trading bot that predicts short-term stock movement using market indicators and real-time financial news sentiment."
  team: "Anvay, Sai, Aashray"
---

<!-- markdownlint-capture -->
<!-- markdownlint-disable -->
{% assign data = site.data.quant_infograph %}

<div class="quant-infograph">

  <!-- Header Section -->
  <div class="quant-header">
    <div class="quant-badge">Design-Based Research Capstone</div>
    <h1 class="quant-title">{{ data.Title }}</h1>
    <p class="quant-description">{{ data.Description }}</p>
  </div>

  <!-- Project Cards -->
  {% for topic in data.Topics %}
  <div class="quant-card">
    <div class="quant-card-grid">

      <!-- Left: Image & Status -->
      <div class="quant-visual">
        <a href="{{ site.baseurl }}{{ topic.link }}" class="quant-image-link">
          <img src="{{ site.baseurl }}/images/{{ topic.image }}" alt="{{ topic.alt }}" class="quant-image">
          <div class="quant-overlay">
            <span>View Project</span>
          </div>
        </a>

        <div class="quant-status">{{ topic.status }}</div>

        <div class="quant-team">
          <span class="quant-team-label">Project Leads</span>
          <span class="quant-team-name">{{ topic.team | join: ", " }}</span>
        </div>
      </div>

      <!-- Center: Key Points -->
      <div class="quant-content">
        <h2 class="quant-project-title">{{ topic.title }}</h2>
        <p class="quant-subtitle">{{ topic.subtitle }}</p>

        <div class="quant-keypoints">
          {% for point in topic.keyPoints %}
          <div class="quant-keypoint">
            <span class="quant-check">✓</span>
            <span>{{ point }}</span>
          </div>
          {% endfor %}
        </div>

        <div class="quant-tech-stack">
          {% for tech in topic.tech %}
          <span class="quant-tech-tag">{{ tech }}</span>
          {% endfor %}
        </div>
      </div>

      <!-- Right: Description & Impact -->
      <div class="quant-details">
        <h3 class="quant-section-title">About</h3>
        <p class="quant-about">{{ topic.description }}</p>

        <h3 class="quant-section-title">Impact</h3>
        <div class="quant-impact-list">
          {% for item in topic.impact %}
          <div class="quant-impact-item">{{ item }}</div>
          {% endfor %}
        </div>

        <a href="{{ site.baseurl }}{{ topic.link }}" class="quant-btn">Learn More</a>
      </div>

    </div>
  </div>
  {% endfor %}

</div>
<!-- markdownlint-restore -->
