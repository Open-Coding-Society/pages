---
microblog: true
toc: false
layout: post
title: OCS Communication Systems
description: Students are extending the OCS communication system with chat, announcements, assignment discussions, direct messaging, calendar integration, and reusable presentation components. The work includes maintaining the real-time WebSocket service and connecting these features to the existing course site, backend APIs, security, and data model. Students will also develop the OCS SASS grammar—a small, purpose-built styling system for consistent, responsive, reusable components across the OCS GitHub Pages ecosystem.
permalink: /capstone/communication-system/
sticky_rank: 1
capstone_project:
  course: CSA
  school_year: "2026-2027"
  title: "OCS Communication Systems"
  image: "/images/csa-chat/announcement-chat.png"
  description: "Students are extending the OCS communication system with chat, announcements, assignment discussions, direct messaging, calendar integration, and reusable presentation components. The work includes maintaining the real-time WebSocket service and connecting these features to the existing course site, backend APIs, security, and data model. Students will also develop the OCS SASS grammar—a small, purpose-built styling system for consistent, responsive, reusable components across the OCS GitHub Pages ecosystem."
  team: "Akhil, Syown, Leon, Perry, Skandan, Sathwik, Akshajh, Tarun, Samarth"
  links:
    frontend: "https://github.com/UGRC-CSA/Pages"
    backend: "https://github.com/Open-Coding-Society/spring"
---

<!-- markdownlint-capture -->
<!-- markdownlint-disable -->
{% assign data = site.data.communication_system_infograph %}

<div class="comms-infograph">
  <!-- Header Section -->
  <div class="comms-header">
    <div class="comms-badge">Design-Based Research Capstone</div>
    <h1 class="comms-title">{{ data.Title }}</h1>
    <p class="comms-description">{{ data.Description }}</p>
  </div>

  <!-- Sprint Board: live from the team's GitHub project -->
  {% if data.Board %}
  {% include ocs_kanban_board.html url=data.Board.url filter=data.Board.filter columns=data.Board.columns %}
  {% endif %}

  <!-- Project Cards -->
  {% for topic in data.Topics %}
  {% if topic.link contains '://' %}
    {% assign topicHref = topic.link %}
  {% else %}
    {% assign topicHref = topic.link | prepend: site.baseurl %}
  {% endif %}
  <div class="comms-card">
    <div class="comms-card-grid">

      <!-- Left: Image & Status -->
      <div class="comms-visual">
        {% if topic.image %}
        <a href="{{ topicHref }}" class="comms-image-link">
          <img src="{{ site.baseurl }}/images/{{ topic.image }}" alt="{{ topic.alt }}" class="comms-image">
          <div class="comms-overlay">
            <span>View Screenshot</span>
          </div>
        </a>
        {% if topic.caption %}
        <p class="comms-subtitle">{{ topic.caption }}</p>
        {% endif %}
        {% else %}
        <div class="comms-badge">{{ topic.phase }}</div>
        {% endif %}
        <div class="comms-status">{{ topic.status }}</div>
        <div class="comms-team">
          <span class="comms-team-label">Project Leads</span>
          <span class="comms-team-name">{{ topic.team | join: ", " }}</span>
        </div>
      </div>

      <!-- Center: Key Points -->
      <div class="comms-content">
        <h2 class="comms-project-title">{{ topic.title }}</h2>
        <p class="comms-subtitle">{{ topic.subtitle }}</p>

        <div class="comms-keypoints">
          {% for point in topic.keyPoints %}
          <div class="comms-keypoint">
            <span class="comms-check">✓</span>
            <span>{{ point }}</span>
          </div>
          {% endfor %}
        </div>

        <div class="comms-tech-stack">
          {% for tech in topic.tech %}
          <span class="comms-tech-tag">{{ tech }}</span>
          {% endfor %}
        </div>
      </div>

      <!-- Right: Description & Impact -->
      <div class="comms-details">
        <h3 class="comms-section-title">About</h3>
        <p class="comms-about">{{ topic.description }}</p>

        <h3 class="comms-section-title">Impact</h3>
        <div class="comms-impact-list">
          {% for item in topic.impact %}
          <div class="comms-impact-item">{{ item }}</div>
          {% endfor %}
        </div>

        <a href="{{ topicHref }}" class="comms-btn">{{ topic.linkLabel | default: "Learn More" }}</a>
      </div>

    </div>
  </div>
  {% endfor %}

  <!-- Supporting Sections -->
  {% for section in data.Sections %}
  <div class="comms-card">
    <h2 class="comms-project-title">{{ section.title }}</h2>
    <p class="comms-subtitle">{{ section.subtitle }}</p>
    <div class="comms-impact-list">
      {% for item in section.items %}
      <div class="comms-impact-item">{{ item }}</div>
      {% endfor %}
    </div>
  </div>
  {% endfor %}

  <!-- Following Along -->
  {% if data.Links %}
  <div class="comms-card">
    <h2 class="comms-project-title">{{ data.Links.title }}</h2>
    <p class="comms-subtitle">{{ data.Links.subtitle }}</p>
    <div class="comms-tech-stack">
      {% for item in data.Links.items %}
      <a href="{{ item.url }}" class="comms-btn" target="_blank" rel="noopener">{{ item.label }}</a>
      {% endfor %}
    </div>
  </div>
  {% endif %}
</div>
<!-- markdownlint-restore -->
