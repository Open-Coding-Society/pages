---
layout: post
title: New Capstone
permalink: /new-capstone/
toc: false
tailwind: true
---

<link rel="stylesheet" href="/assets/css/new-capstone.css">

<div class="new-capstone-page">
  <div class="new-capstone-title">Create a New Capstone</div>
  <div class="new-capstone-subtitle">Fill this out once instead of manually making markdown files by hand.</div>

  <form id="capstoneForm" class="capstone-form">
    <div class="capstone-grid">
      <div class="capstone-card">
        <label class="capstone-label" for="title">Project title</label>
        <input class="capstone-input" id="title" name="title" required>
        <div class="capstone-help">Example: Smart Transit Planner</div>
      </div>

      <div class="capstone-card">
        <label class="capstone-label" for="teamMembers">Team members</label>
        <input class="capstone-input" id="teamMembers" name="teamMembers" required>
        <div class="capstone-help">Comma separated. Example: Alice Kim, Rahul Patel, Maya Chen</div>
      </div>
    </div>

    <div class="capstone-card">
      <label class="capstone-label" for="description">Short description</label>
      <textarea class="capstone-textarea" id="description" name="description" required></textarea>
      <div class="capstone-help">This appears on the home/listing card.</div>
    </div>

    <div class="capstone-grid">
      <div class="capstone-card">
        <label class="capstone-label" for="courseCode">Course code</label>
        <input class="capstone-input" id="courseCode" name="courseCode" value="csse">
      </div>

      <div class="capstone-card">
        <label class="capstone-label" for="week">Week</label>
        <input class="capstone-input" id="week" name="week" value="25">
      </div>
    </div>

    <div class="capstone-grid">
      <div class="capstone-card">
        <label class="capstone-label" for="heroTitle">Main section title</label>
        <input class="capstone-input" id="heroTitle" name="heroTitle" value="Overview">
      </div>

      <div class="capstone-card">
        <label class="capstone-label" for="badge">Badge label</label>
        <input class="capstone-input" id="badge" name="badge" value="DESIGN-BASED RESEARCH CAPSTONE">
      </div>
    </div>

    <div class="capstone-card">
      <label class="capstone-label" for="overview">Overview paragraph</label>
      <textarea class="capstone-textarea" id="overview" name="overview" required></textarea>
    </div>

    <div class="capstone-grid">
      <div class="capstone-card">
        <label class="capstone-label" for="featureBullets">Feature bullets</label>
        <textarea class="capstone-textarea" id="featureBullets" name="featureBullets" required></textarea>
        <div class="capstone-help">One bullet per line.</div>
      </div>

      <div class="capstone-card">
        <label class="capstone-label" for="impactBullets">Impact bullets</label>
        <textarea class="capstone-textarea" id="impactBullets" name="impactBullets" required></textarea>
        <div class="capstone-help">One bullet per line.</div>
      </div>
    </div>

    <div class="capstone-grid">
      <div class="capstone-card">
        <label class="capstone-label" for="tags">Tags</label>
        <textarea class="capstone-textarea" id="tags" name="tags"></textarea>
        <div class="capstone-help">One tag per line. Example: GitHub Pages</div>
      </div>

      <div class="capstone-card">
        <label class="capstone-label" for="imageUrl">Image URL</label>
        <input class="capstone-input" id="imageUrl" name="imageUrl">
        <div class="capstone-help">Optional. Put a full image path if your layout uses one.</div>
      </div>
    </div>

    <div class="capstone-card">
      <label class="capstone-label" for="token">Bearer token</label>
      <input class="capstone-input" id="token" name="token" type="password" required>
      <div class="capstone-help">For now this is the admin token checked by the Spring backend.</div>
    </div>

    <button class="capstone-submit" type="submit">Create Capstone</button>
    <div id="capstoneStatus" class="capstone-status"></div>
  </form>
</div>

<script src="/assets/js/new-capstone.js"></script>
