---
microblog: true
toc: false
layout: post
title: SRFSC Website Redesign Examples
description: Visual mockup examples showing how the Scripps Ranch Fire Safe Council website could be redesigned for clarity, urgency, and action.
permalink: /capstone/srfsc-redesign-examples/
author: Krish Kelageri, Jasan Boprai, Shourya Patel
year: "2026-2027"
courses: { csp: {week: 25} }
---

<style>
  .srfsc-demo {
    margin: 2rem 0;
    color: #111111;
  }

  .srfsc-demo *,
  .srfsc-demo h1,
  .srfsc-demo h2,
  .srfsc-demo h3,
  .srfsc-demo h4,
  .srfsc-demo p,
  .srfsc-demo li,
  .srfsc-demo strong,
  .srfsc-demo span,
  .srfsc-demo a {
    color: #111111;
  }

  .srfsc-demo .ocs__grid {
    display: grid;
    gap: 1rem;
    margin: 0 0 1.5rem;
  }

  .srfsc-demo .ocs__grid-cell {
    background: #fff;
    border-radius: 14px;
    border: 1px solid rgba(17, 38, 27, 0.08);
    box-shadow: 0 8px 18px rgba(17, 38, 27, 0.04);
  }

  .srfsc-demo .ocs__grid-cell--header {
    background: #173b2f;
    color: #fff;
    border: 1px solid rgba(17, 38, 27, 0.12);
    font-weight: 700;
    letter-spacing: 0.02em;
  }

  .srfsc-demo .ocs__grid-cell--accent {
    background: #f4f8f3;
  }

  .srfsc-demo .ocs__grid-cell strong {
    display: block;
    margin-bottom: 0.6rem;
    font-size: 1.1rem;
    color: #112420;
  }

  .srfsc-demo .ocs__grid-cell p,
  .srfsc-demo .ocs__grid-cell li {
    margin: 0;
    line-height: 1.7;
    color: #49615b;
  }

  .srfsc-demo .ocs__grid-cell ul {
    margin: 0;
    padding-left: 1.2rem;
  }

  .srfsc-topbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    padding: 1rem 1.25rem;
    background: #173b2f;
    border-radius: 14px 14px 0 0;
    color: #fff;
  }

  .srfsc-brand {
    font-weight: 800;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: #dcefd9;
  }

  .srfsc-nav {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
    justify-content: center;
  }

  .srfsc-nav a {
    color: rgba(255,255,255,0.8);
    text-decoration: none;
    font-size: 0.8rem;
    text-transform: uppercase;
    letter-spacing: 0.08em;
  }

  .srfsc-hero {
    background: linear-gradient(135deg, #173b2f 0%, #214b3c 100%);
    color: #fff;
    padding: 2rem 1.5rem;
    border-radius: 0 0 14px 14px;
  }

  .srfsc-hero-inner {
    max-width: 1100px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: 1.5fr 0.9fr;
    gap: 1.5rem;
    align-items: center;
  }

  .srfsc-kicker {
    font-size: 0.72rem;
    font-weight: 800;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: #cfeac4;
    margin-bottom: 0.8rem;
  }

  .srfsc-hero h2 {
    margin: 0 0 0.8rem;
    font-size: clamp(2rem, 4vw, 3.2rem);
    line-height: 1.08;
    letter-spacing: -0.04em;
    color: #fff;
  }

  .srfsc-hero p {
    margin: 0;
    line-height: 1.7;
    color: rgba(255,255,255,0.86);
  }

  .srfsc-cta-row {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
    margin-top: 1.25rem;
  }

  .srfsc-hero-box {
    background: rgba(255,255,255,0.08);
    border: 1px solid rgba(255,255,255,0.12);
    border-radius: 12px;
    padding: 1.2rem;
  }

  .srfsc-hero-box h3 {
    margin: 0 0 0.8rem;
    font-size: 0.78rem;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: #dcefd9;
  }

  .srfsc-hero-box strong {
    display: block;
    font-size: 2.4rem;
    color: #ffffff;
    margin-bottom: 0.45rem;
  }

  .srfsc-section {
    max-width: 1180px;
    margin: 0 auto;
    padding: 0 0 1rem;
  }

  .srfsc-card .icon {
    font-size: 2rem;
    margin-bottom: 0.7rem;
  }

  .srfsc-list {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .srfsc-list li {
    display: flex;
    gap: 0.75rem;
    align-items: flex-start;
    margin-bottom: 0.75rem;
  }

  .srfsc-bullet {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #d8572a;
    margin-top: 0.52rem;
    flex-shrink: 0;
  }

  .srfsc-news-image {
    min-height: 180px;
    background: linear-gradient(135deg, #d3e8c3, #7f9d7d);
    border-radius: 12px 12px 0 0;
  }

  .srfsc-news-content {
    padding: 1rem;
  }

  .srfsc-news-content .tag {
    display: inline-block;
    margin-bottom: 0.6rem;
    padding: 0.28rem 0.7rem;
    border-radius: 999px;
    background: #edf6ec;
    color: #173b2f;
    font-size: 0.62rem;
    font-weight: 800;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  .srfsc-pitch {
    max-width: 1180px;
    margin: 0 auto 2rem;
  }

  .srfsc-pitch-hero {
    background: #173b2f;
    color: #fff;
    border-radius: 14px;
    padding: 1.5rem;
    margin-bottom: 1rem;
  }

  .srfsc-pitch-kicker {
    font-size: 0.7rem;
    font-weight: 800;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: #dcefd9;
    margin-bottom: 0.6rem;
  }

  .srfsc-pitch-hero h2 {
    margin: 0;
    font-size: clamp(1.7rem, 3vw, 2.5rem);
    color: #fff;
  }

  .srfsc-pitch-card {
    padding: 1.1rem;
  }

  .srfsc-pitch-number {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 2.2rem;
    height: 2.2rem;
    border-radius: 50%;
    background: #d8572a;
    color: #fff;
    font-size: 0.72rem;
    font-weight: 800;
    margin-bottom: 0.8rem;
  }

  .srfsc-feature-number {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 2.2rem;
    height: 2.2rem;
    border-radius: 50%;
    background: #d8572a;
    color: #fff;
    font-size: 0.72rem;
    font-weight: 800;
    margin-bottom: 0.8rem;
  }

  @media (max-width: 900px) {
    .srfsc-hero-inner {
      grid-template-columns: 1fr;
    }

    .srfsc-topbar {
      flex-direction: column;
      align-items: flex-start;
    }
  }

  @media (max-width: 640px) {
    .srfsc-demo {
      margin-top: 1rem;
    }

    .srfsc-btn,
    .srfsc-cta-row .srfsc-btn {
      width: 100%;
      text-align: center;
    }

    .srfsc-cta-row {
      flex-direction: column;
    }

    .srfsc-demo .ocs__grid.cols-2,
    .srfsc-demo .ocs__grid.cols-3,
    .srfsc-demo .ocs__grid.cols-4 {
      grid-template-columns: 1fr;
    }
  }

  .srfsc-demo,
  .srfsc-demo p,
  .srfsc-demo h2,
  .srfsc-demo h3,
  .srfsc-demo h4,
  .srfsc-demo li,
  .srfsc-demo strong,
  .srfsc-demo span,
  .srfsc-demo a {
    color: #111111;
  }

  .srfsc-demo .srfsc-topbar,
  .srfsc-demo .srfsc-topbar *,
  .srfsc-demo .srfsc-hero,
  .srfsc-demo .srfsc-hero *,
  .srfsc-demo .srfsc-pitch-hero,
  .srfsc-demo .srfsc-pitch-hero *,
  .srfsc-demo .srfsc-hero-box *,
  .srfsc-demo .srfsc-kicker,
  .srfsc-demo .srfsc-pitch-kicker {
    color: #ffffff;
  }

  .srfsc-demo .srfsc-pitch-hero p,
  .srfsc-demo .srfsc-hero p,
  .srfsc-demo .srfsc-hero-box p,
  .srfsc-demo .srfsc-hero-box strong,
  .srfsc-demo .srfsc-hero-box h3,
  .srfsc-demo .srfsc-pitch-hero h2,
  .srfsc-demo .srfsc-pitch-hero .srfsc-pitch-kicker,
  .srfsc-demo .srfsc-topbar a,
  .srfsc-demo .srfsc-nav a,
  .srfsc-demo .srfsc-brand,
  .srfsc-demo .srfsc-btn,
  .srfsc-demo .srfsc-cta-row .srfsc-btn {
    color: #ffffff;
  }

  .srfsc-demo .srfsc-card h3,
  .srfsc-demo .srfsc-card p,
  .srfsc-demo .srfsc-panel h3,
  .srfsc-demo .srfsc-panel li,
  .srfsc-demo .srfsc-alert strong,
  .srfsc-demo .srfsc-alert p,
  .srfsc-demo .srfsc-news-content h4,
  .srfsc-demo .srfsc-news-content p,
  .srfsc-demo .srfsc-feature-card h4,
  .srfsc-demo .srfsc-feature-card p,
  .srfsc-demo .srfsc-pitch-card h3,
  .srfsc-demo .srfsc-pitch-card p,
  .srfsc-demo .srfsc-pitch-panel li,
  .srfsc-demo .srfsc-pitch-panel ul,
  .srfsc-demo .srfsc-feature-header h3,
  .srfsc-demo .srfsc-pitch-panel .srfsc-panel-label,
  .srfsc-demo .srfsc-before-after,
  .srfsc-demo .srfsc-before-after *,
  .srfsc-demo .srfsc-feature-wrap,
  .srfsc-demo .srfsc-feature-wrap * {
    color: #111111;
  }
</style>

<div class="srfsc-demo">
  <div class="srfsc-topbar">
    <div class="srfsc-brand">SRFSC</div>
    <nav class="srfsc-nav">
      <a href="{{ site.baseurl }}/srfsc-about">About</a>
      <a href="{{ site.baseurl }}/news">News</a>
      <a href="{{ site.baseurl }}/volunteer">Volunteer</a>
      <a href="{{ site.baseurl }}/donate">Donate</a>
    </nav>
    <a class="srfsc-btn" href="{{ site.baseurl }}/volunteer">Join Us</a>
  </div>

  <div class="srfsc-hero">
    <div class="srfsc-hero-inner">
      <div>
        <div class="srfsc-kicker">Scripps Ranch Fire Safe Council</div>
        <h2>Protect your home.<br>Protect the whole canyon.</h2>
        <p>
          We are neighbors working together to reduce wildfire risk, protect homes,
          and keep our community prepared year-round.
        </p>
        <div class="srfsc-cta-row">
          <a class="srfsc-btn" href="{{ site.baseurl }}/volunteer">Volunteer</a>
          <a class="srfsc-btn secondary" href="{{ site.baseurl }}/donate">Donate</a>
        </div>
      </div>

      <div class="srfsc-hero-box">
        <h3>Why it matters</h3>
        <strong>312</strong>
        <p>homes lost in the Cedar Fire — a reminder that wildfire risk is not theoretical.</p>
      </div>
    </div>
  </div>

  <div class="srfsc-section">
    <div class="ocs__grid ocs__grid--standard cols-3">
      <div class="ocs__grid-cell ocs__grid-cell--accent srfsc-card" data-search="fuel reduction brush firebreak hazard trees">
        <div class="icon">🔥</div>
        <h3>Fuel Reduction</h3>
        <p>Clear dead brush, remove hazard trees, and protect canyon edges with neighborhood work days.</p>
      </div>

      <div class="ocs__grid-cell srfsc-card" data-search="home hardening defensible space fire safety guidance">
        <div class="icon">🏠</div>
        <h3>Home Hardening</h3>
        <p>Help residents prepare their homes with defensible space guidance and practical fire-safety education.</p>
      </div>

      <div class="ocs__grid-cell ocs__grid-cell--accent srfsc-card" data-search="community action agency partners neighbors preparedness">
        <div class="icon">🤝</div>
        <h3>Community Action</h3>
        <p>Partner with agencies, local leaders, and neighbors to bring preparedness resources to the whole canyon.</p>
      </div>
    </div>
  </div>

  <div class="srfsc-section">
    <div class="ocs__grid ocs__grid--standard cols-2">
      <div class="ocs__grid-cell srfsc-panel" data-search="firebreak maintenance hazard tree removal community education cal fire fire rescue partners">
        <h3>Where the work actually happens</h3>
        <ul class="srfsc-list">
          <li><span class="srfsc-bullet"></span><span>Firebreak maintenance along canyon edges and property lines</span></li>
          <li><span class="srfsc-bullet"></span><span>Hazard tree removal and fuel reduction throughout the neighborhood</span></li>
          <li><span class="srfsc-bullet"></span><span>Community education for homeowners and families preparing for wildfires</span></li>
          <li><span class="srfsc-bullet"></span><span>Coordination with CAL FIRE, SD Fire-Rescue, and local partners</span></li>
        </ul>
      </div>

      <div class="ocs__grid-cell ocs__grid-cell--accent srfsc-alert" data-search="ready to take action volunteer clearing day block meeting next season">
        <strong>Ready to take action?</strong>
        <p>Join a clearing day, host a block meeting, or help the council stay prepared for the next fire season.</p>
      </div>
    </div>
  </div>

  <div class="srfsc-section">
    <h3 style="margin:0 0 1.25rem; color:#173b2f; font-size:1.7rem;">Latest updates</h3>
    <div class="ocs__grid ocs__grid--standard cols-3">
      <div class="ocs__grid-cell srfsc-news-item" data-search="news grant hazard tree removal canyon safety">
        <div class="srfsc-news-image"></div>
        <div class="srfsc-news-content">
          <span class="tag">News</span>
          <h4>New grant funds hazard tree removal</h4>
          <p>Fresh support helps expand defensible space work and improve canyon safety.</p>
        </div>
      </div>

      <div class="ocs__grid-cell srfsc-news-item" data-search="newsletter expo turnout community guidance fire prep">
        <div class="srfsc-news-image" style="background: linear-gradient(135deg, #8f9b75, #d8c29a);"></div>
        <div class="srfsc-news-content">
          <span class="tag">Newsletter</span>
          <h4>Expo draws record turnout</h4>
          <p>Neighbors gathered for checklists, informative resources, and live fire-prep guidance.</p>
        </div>
      </div>

      <div class="ocs__grid-cell srfsc-news-item" data-search="wildfire california rules home safety zoning">
        <div class="srfsc-news-image" style="background: linear-gradient(135deg, #9d8f73, #e7ddc5);"></div>
        <div class="srfsc-news-content">
          <span class="tag">Wildfire</span>
          <h4>California adopts stronger home wildfire rules</h4>
          <p>New statewide zoning standards raise the bar for preparation and home safety.</p>
        </div>
      </div>
    </div>
  </div>

  <div class="srfsc-feature-wrap">
    <div class="srfsc-feature-header">
      <h3>Redesign features breakdown</h3>
    </div>

    <div class="ocs__grid ocs__grid--standard cols-3">
      <div class="ocs__grid-cell srfsc-feature-card" data-search="cleaner hero section emergency message">
        <div class="srfsc-feature-number">01</div>
        <div class="srfsc-feature-icon">🌟</div>
        <h4>Cleaner hero section</h4>
        <p>Streamlined design with a direct emergency message for immediate impact.</p>
      </div>

      <div class="ocs__grid-cell srfsc-feature-card" data-search="strong call-to-action buttons volunteering donating">
        <div class="srfsc-feature-number">02</div>
        <div class="srfsc-feature-icon">👉</div>
        <h4>Strong call-to-action buttons</h4>
        <p>Prominent buttons for volunteering and donating to increase engagement.</p>
      </div>

      <div class="ocs__grid-cell srfsc-feature-card" data-search="obvious program grouping homepage">
        <div class="srfsc-feature-number">03</div>
        <div class="srfsc-feature-icon">📋</div>
        <h4>Obvious program grouping</h4>
        <p>Clearer organization of programs instead of a crowded homepage.</p>
      </div>

      <div class="ocs__grid-cell srfsc-feature-card" data-search="community impact messaging">
        <div class="srfsc-feature-number">04</div>
        <div class="srfsc-feature-icon">📣</div>
        <h4>Community impact messaging</h4>
        <p>Emphasizes the difference we make together, right at the forefront.</p>
      </div>

      <div class="ocs__grid-cell srfsc-feature-card" data-search="better use of cards content blocks">
        <div class="srfsc-feature-number">05</div>
        <div class="srfsc-feature-icon">🗂️</div>
        <h4>Better use of cards and content blocks</h4>
        <p>Organizes information effectively, making it easier to navigate.</p>
      </div>

      <div class="ocs__grid-cell srfsc-feature-card" data-search="polished trustworthy nonprofit look">
        <div class="srfsc-feature-number">06</div>
        <div class="srfsc-feature-icon">🔒</div>
        <h4>A more polished and trustworthy look</h4>
        <p>Professional design that enhances credibility and encourages action.</p>
      </div>
    </div>
  </div>
</div>

<div class="srfsc-pitch">
  <div class="srfsc-pitch-hero">
    <div class="srfsc-pitch-kicker">Redesign goals</div>
    <h2>Make the mission clear in a few seconds.</h2>
    <p>Visitors should understand the risk, the purpose, and the next action without digging through clutter. This redesign puts urgency and action front and center.</p>
  </div>

  <div class="srfsc-pitch-grid">
    <div class="srfsc-pitch-card">
      <div class="srfsc-pitch-number">1</div>
      <h3>Mission first</h3>
      <p>The hero message tells neighbors exactly what SRFSC does and why it matters right away.</p>
    </div>

    <div class="srfsc-pitch-card">
      <div class="srfsc-pitch-number">2</div>
      <h3>Clear action path</h3>
      <p>Volunteer, donate, and learn are all visible without forcing people to hunt for information.</p>
    </div>

    <div class="srfsc-pitch-card">
      <div class="srfsc-pitch-number">3</div>
      <h3>Trust and clarity</h3>
      <p>The layout feels more professional, local, and reliable while still staying community-driven.</p>
    </div>
  </div>

  <div class="srfsc-before-after">
    <div class="srfsc-pitch-panel before">
      <div class="srfsc-panel-label">Before</div>
      <ul>
        <li>Mission and updates compete for attention.</li>
        <li>Users are unsure what to do next.</li>
        <li>Important actions are spread across the page.</li>
      </ul>
    </div>

    <div class="srfsc-pitch-panel after">
      <div class="srfsc-panel-label">After</div>
      <ul>
        <li>Cleaner hero and stronger local urgency.</li>
        <li>Better grouping for programs, updates, and support.</li>
        <li>Clear volunteer / donation flow for action.</li>
      </ul>
    </div>
  </div>
</div>

<script>
  const searchInput = document.getElementById('srfscSearch');
  if (searchInput) {
    searchInput.addEventListener('input', function () {
      const value = this.value.toLowerCase().trim();
      const items = document.querySelectorAll('.srfsc-card, .srfsc-panel, .srfsc-alert, .srfsc-news-item, .srfsc-feature-card');

      items.forEach((item) => {
        const text = (item.dataset.search || item.textContent || '').toLowerCase();
        const matches = !value || text.includes(value);
        item.classList.toggle('srfsc-hidden', !matches);
      });
    });
  }
</script>

## A clearer redesign direction

This mockup keeps the same local mission but makes the page easier to scan, easier to trust, and easier to act on.

- stronger hero message
- more visible volunteer and donation calls-to-action
- clearer program grouping and community impact
