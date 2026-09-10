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
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    color: #14213d;
    background: linear-gradient(180deg, #fafbf9 0%, #f3f6f1 100%);
    border-radius: 24px;
    overflow: hidden;
    box-shadow: 0 12px 32px rgba(18, 41, 25, 0.08);
    margin: 2rem 0;
    border: 1px solid rgba(17, 38, 27, 0.08);
  }

  .srfsc-topbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: #1a4538;
    color: white;
    padding: 1.2rem 2rem;
    gap: 2rem;
  }

  .srfsc-brand {
    font-size: 1.2rem;
    font-weight: 900;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: #7cef8d;
  }

  .srfsc-nav {
    display: flex;
    gap: 2rem;
    font-size: 0.85rem;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    margin-left: auto;
  }

  .srfsc-nav a {
    color: rgba(255, 255, 255, 0.8);
    text-decoration: none;
    font-weight: 600;
  }

  .srfsc-btn {
    display: inline-block;
    background: #d8572a;
    color: white;
    padding: 0.9rem 1.8rem;
    border-radius: 999px;
    font-weight: 700;
    text-decoration: none;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    font-size: 0.75rem;
    box-shadow: 0 4px 12px rgba(216, 87, 42, 0.2);
    border: none;
    cursor: pointer;
  }

  .srfsc-btn.secondary {
    background: rgba(255, 255, 255, 0.15);
    color: white;
    border: 1px solid rgba(255, 255, 255, 0.3);
  }

  .srfsc-hero {
    position: relative;
    background:
      linear-gradient(120deg, rgba(14, 34, 27, 0.75), rgba(46, 77, 57, 0.65)),
      url('https://images.unsplash.com/photo-1473448912268-2022ce9509d8?auto=format&fit=crop&w=1200&q=80') center/cover no-repeat;
    color: white;
    padding: 4rem 2rem 3.5rem;
  }

  .srfsc-hero-inner {
    max-width: 1180px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: 1.4fr 1fr;
    gap: 2rem;
    align-items: center;
  }

  .srfsc-kicker {
    font-size: 0.7rem;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    font-weight: 900;
    color: #9ef77f;
    margin-bottom: 1rem;
  }

  .srfsc-hero h2 {
    font-size: clamp(2rem, 5vw, 3.5rem);
    line-height: 1.1;
    margin: 0 0 1.2rem;
    letter-spacing: -0.06em;
    font-weight: 900;
  }

  .srfsc-hero p {
    font-size: 1.05rem;
    line-height: 1.8;
    color: rgba(255, 255, 255, 0.9);
  }

  .srfsc-cta-row {
    display: flex;
    gap: 1rem;
    margin-top: 1.8rem;
  }

  .srfsc-hero-box {
    background: rgba(255, 255, 255, 0.12);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 20px;
    padding: 2rem;
  }

  .srfsc-hero-box h3 {
    margin: 0 0 1rem;
    font-size: 0.75rem;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: #9ef77f;
  }

  .srfsc-hero-box strong {
    display: block;
    font-size: 2.8rem;
    margin-bottom: 0.5rem;
  }

  .srfsc-section {
    max-width: 1180px;
    margin: 0 auto;
    padding: 3.5rem 2rem;
  }

  .srfsc-card {
    color: #475a53;
  }

  .srfsc-card .icon {
    font-size: 2.2rem;
    margin-bottom: 1rem;
  }

  .srfsc-card h3 {
    margin: 0 0 0.8rem;
    font-size: 1.3rem;
    font-weight: 700;
    color: #112420;
  }

  .srfsc-card p {
    margin: 0;
    line-height: 1.8;
  }

  .srfsc-panel h3 {
    margin: 0 0 1.4rem;
    font-size: 1.5rem;
    font-weight: 700;
    color: #173b2f;
  }

  .srfsc-list {
    list-style: none;
    padding: 0;
    margin: 0;
    gap: 1rem;
  }

  .srfsc-list li {
    display: flex;
    gap: 1rem;
    line-height: 1.8;
    color: #24372f;
  }

  .srfsc-bullet {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #d8572a;
    margin-top: 0.6rem;
    flex-shrink: 0;
  }

  .srfsc-alert {
    background: linear-gradient(135deg, #fdf5ea 0%, #fffaf3 100%);
    border: 1px solid rgba(216, 87, 42, 0.15);
  }

  .srfsc-alert strong {
    font-size: 1.5rem;
    color: #173b2f;
    margin-bottom: 0.8rem;
  }

  .srfsc-alert p {
    margin: 0;
    line-height: 1.8;
    color: #4a5d55;
  }

  .srfsc-search {
    max-width: 1180px;
    margin: 0 auto;
    padding: 0 2rem 2.4rem;
  }

  .srfsc-search input {
    width: 100%;
    border: 1px solid rgba(17, 38, 27, 0.1);
    border-radius: 999px;
    padding: 1rem 1.4rem;
    font-size: 1rem;
    background: white;
    color: #111;
    box-shadow: 0 4px 12px rgba(19, 41, 18, 0.08);
  }

  .srfsc-search input:focus {
    outline: none;
    border-color: #d8572a;
  }

  .srfsc-hidden {
    display: none !important;
  }

  .srfsc-feature-wrap {
    max-width: 1180px;
    margin: 2.5rem auto 0;
    padding: 0 2rem;
  }

  .srfsc-feature-header h3 {
    margin: 0 0 1.5rem;
    font-size: clamp(1.7rem, 3vw, 2.2rem);
    font-weight: 800;
    color: #173b2f;
  }

  .srfsc-feature-number {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 2.5rem;
    height: 2.5rem;
    border-radius: 50%;
    background: #d8572a;
    color: white;
    font-size: 0.75rem;
    font-weight: 900;
    margin-bottom: 1rem;
  }

  .srfsc-feature-icon {
    font-size: 2rem;
    margin-bottom: 0.8rem;
  }

  .srfsc-feature-card h4 {
    margin: 0 0 0.6rem;
    font-size: 1.15rem;
    font-weight: 700;
    color: #112420;
  }

  .srfsc-feature-card p {
    margin: 0;
    line-height: 1.7;
    color: #3b4d47;
  }

  .srfsc-news-image {
    min-height: 200px;
    background: linear-gradient(135deg, #d3e8c3, #7f9d7d);
  }

  .srfsc-news-content {
    padding: 1.3rem;
  }

  .srfsc-news-content .tag {
    display: inline-block;
    padding: 0.35rem 0.8rem;
    background: #edf6ec;
    border-radius: 999px;
    font-size: 0.65rem;
    font-weight: 800;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: #173b2f;
    margin-bottom: 0.8rem;
  }

  .srfsc-news-content h4 {
    margin: 0 0 0.6rem;
    font-size: 1.15rem;
    font-weight: 700;
    color: #112420;
  }

  .srfsc-news-content p {
    margin: 0;
    line-height: 1.7;
    color: #4b5d55;
  }

  .srfsc-pitch {
    max-width: 1180px;
    margin: 2.5rem auto 0;
    padding: 0 2rem 2rem;
  }

  .srfsc-pitch-hero {
    background: #1a4538;
    border-radius: 24px;
    padding: 2.5rem 2rem;
    text-align: center;
    border: 1px solid rgba(239, 182, 59, 0.2);
    box-shadow: 0 12px 32px rgba(17, 38, 27, 0.1);
  }

  .srfsc-pitch-kicker {
    display: inline-block;
    font-size: 0.7rem;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    font-weight: 900;
    color: #9ef77f;
    background: rgba(255, 255, 255, 0.08);
    border: 1px solid rgba(255, 255, 255, 0.15);
    border-radius: 999px;
    padding: 0.5rem 1rem;
    margin-bottom: 1rem;
  }

  .srfsc-pitch-hero h2 {
    margin: 0 0 0.8rem;
    font-size: clamp(2rem, 4vw, 2.8rem);
    line-height: 1.1;
    font-weight: 900;
    color: #f0c767;
  }

  .srfsc-pitch-hero p {
    max-width: 720px;
    margin: 0 auto;
    line-height: 1.8;
    color: rgba(255, 255, 255, 0.85);
    font-size: 1.05rem;
  }

  .srfsc-pitch-grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 1.2rem;
    margin-top: 2rem;
  }

  .srfsc-pitch-card {
    background: linear-gradient(135deg, #f8faf7 0%, #f3f6f1 100%);
    border: 1px solid rgba(17, 38, 27, 0.08);
    border-radius: 20px;
    padding: 1.5rem;
    box-shadow: 0 8px 24px rgba(19, 41, 18, 0.06);
  }

  .srfsc-pitch-number {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 2.5rem;
    height: 2.5rem;
    border-radius: 50%;
    background: #d8572a;
    color: white;
    font-size: 0.75rem;
    font-weight: 900;
    margin-bottom: 1rem;
  }

  .srfsc-pitch-card h3 {
    margin: 0 0 0.7rem;
    font-size: 1.2rem;
    font-weight: 700;
    color: #112420;
  }

  .srfsc-pitch-card p {
    margin: 0;
    line-height: 1.8;
    color: #3c4b42;
  }

  .srfsc-before-after {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1.5rem;
    margin-top: 2rem;
  }

  .srfsc-pitch-panel {
    border-radius: 20px;
    padding: 1.5rem;
    border: 1px solid rgba(17, 38, 27, 0.08);
  }

  .srfsc-pitch-panel.before {
    background: linear-gradient(135deg, #fff3ee 0%, #fffaf3 100%);
    border-color: rgba(216, 87, 42, 0.2);
  }

  .srfsc-pitch-panel.after {
    background: linear-gradient(135deg, #f1f7f2 0%, #ebf4ed 100%);
    border-color: rgba(106, 141, 109, 0.2);
  }

  .srfsc-panel-label {
    font-size: 0.7rem;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    font-weight: 900;
    margin-bottom: 1rem;
    color: #bf4c23;
  }

  .srfsc-pitch-panel.after .srfsc-panel-label {
    color: #2f6f4f;
  }

  .srfsc-pitch-panel ul {
    margin: 0;
    padding-left: 1.5rem;
    list-style: none;
    line-height: 1.8;
    color: #21342d;
  }

  .srfsc-pitch-panel li {
    margin-bottom: 0.6rem;
  }

  .srfsc-pitch-panel li:before {
    content: "→ ";
    font-weight: 700;
    margin-right: 0.5rem;
  }

  .srfsc-demo .ocs__grid {
    width: 100%;
    margin: 0;
    gap: 1.2rem;
    display: grid;
  }

  .srfsc-demo .ocs__grid.cols-2 {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .srfsc-demo .ocs__grid.cols-3 {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .srfsc-demo .ocs__grid.cols-4 {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }

  .srfsc-demo .ocs__grid-cell {
    background: rgba(255, 255, 255, 0.98);
    border: 1px solid rgba(17, 38, 27, 0.08);
    border-radius: 20px;
    padding: 1.5rem;
    box-shadow: 0 8px 20px rgba(19, 41, 18, 0.06);
  }

  .srfsc-demo .ocs__grid-cell--header {
    background: #edf6ec;
    color: #173b2f;
    border-color: rgba(23, 59, 47, 0.2);
    font-weight: 700;
  }

  .srfsc-demo .ocs__grid-cell--accent {
    background: linear-gradient(135deg, #fafbf9 0%, #f5f7f4 100%);
  }

  .srfsc-demo .ocs__grid-cell strong {
    display: block;
    margin-bottom: 0.5rem;
    color: #112420;
    font-size: 1.15rem;
  }

  .srfsc-demo .ocs__grid-cell li {
    line-height: 1.8;
    color: #475a53;
  }

  .srfsc-demo .ocs__grid-cell ul {
    margin: 0;
    padding-left: 1.2rem;
  }

  @media (max-width: 900px) {
    .srfsc-hero-inner,
    .srfsc-pitch-grid,
    .srfsc-before-after {
      grid-template-columns: 1fr;
    }
    .srfsc-nav { display: none; }
    .srfsc-topbar { padding: 1rem 1.2rem; }
    .srfsc-hero { padding: 3rem 1.2rem 2.5rem; }
    .srfsc-section { padding: 2.5rem 1.2rem; }
    .srfsc-feature-wrap,
    .srfsc-pitch,
    .srfsc-search { padding-left: 1.2rem; padding-right: 1.2rem; }
  }

  @media (max-width: 640px) {
    .srfsc-topbar { flex-wrap: wrap; gap: 0.8rem; padding: 0.9rem 1rem; }
    .srfsc-brand { font-size: 1rem; order: -1; flex: 1 0 auto; }
    .srfsc-btn { padding: 0.8rem 1.4rem; min-width: 140px; width: auto; }
    .srfsc-hero { padding: 2.5rem 1rem 2rem; }
    .srfsc-hero-inner { gap: 1.2rem; }
    .srfsc-hero h2 { font-size: 1.8rem; margin-bottom: 0.8rem; }
    .srfsc-hero p { font-size: 0.95rem; }
    .srfsc-cta-row { flex-direction: column; }
    .srfsc-cta-row .srfsc-btn { width: 100%; }
    .srfsc-section,
    .srfsc-feature-wrap,
    .srfsc-pitch,
    .srfsc-search { padding-left: 1rem; padding-right: 1rem; }
    .srfsc-card,
    .srfsc-panel,
    .srfsc-alert,
    .srfsc-feature-card,
    .srfsc-news-item { border-radius: 16px; padding: 1.1rem; }
    .srfsc-card h3 { font-size: 1.1rem; }
    .srfsc-panel h3 { font-size: 1.2rem; margin-bottom: 1rem; }
    .srfsc-news-image { min-height: 160px; }
    .srfsc-pitch-hero { padding: 1.8rem 1.2rem; }
    .srfsc-pitch-hero h2 { font-size: 1.6rem; }
    .srfsc-pitch-card { padding: 1.1rem; }
    .srfsc-pitch-panel { padding: 1.2rem; }
    .srfsc-pitch-panel li { font-size: 0.9rem; }
    .srfsc-search input { padding: 0.9rem 1.1rem; }
    .srfsc-demo .ocs__grid { gap: 0.9rem; }
    .srfsc-demo .ocs__grid-cell { padding: 1.1rem; border-radius: 16px; }
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

## How this matches the redesign ideas

This mockup is designed to implement the key concepts from the ideation work:

- Cleaner hero section with a direct emergency message
- Strong call-to-action buttons for volunteering and donating
- More obvious program grouping instead of a crowded homepage
- Clear community impact messaging
- Better use of cards and content blocks to organize information
- A more polished and trustworthy nonprofit look

## Example improvements this mockup reflects

1. Simplify the homepage hierarchy
2. Put the mission first
3. Make volunteering and donating obvious
4. Give each section a purpose and a visual weight
5. Present local impact and urgency clearly
6. Make the site feel community-driven, reliable, and action-focused

This is a strong starting point for a final site redesign because it keeps the emotional mission while making the structure much easier to navigate.

<div class="srfsc-pitch">
  <div class="srfsc-pitch-hero">
    <div class="srfsc-pitch-kicker">Redesign Summary</div>
    <h2>Key improvements at a glance</h2>
    <p>These focused changes can significantly enhance the website's effectiveness in communication and engagement.</p>
  </div>

  <div class="srfsc-pitch-grid">
    <div class="srfsc-pitch-card" data-search="cleaner hero section emergency message">
      <div class="srfsc-pitch-number">01</div>
      <h3>Cleaner hero section</h3>
      <p>Streamlined design with a direct emergency message for immediate impact.</p>
    </div>

    <div class="srfsc-pitch-card" data-search="strong call-to-action buttons volunteering donating">
      <div class="srfsc-pitch-number">02</div>
      <h3>Strong call-to-action buttons</h3>
      <p>Prominent buttons for volunteering and donating to increase engagement.</p>
    </div>

    <div class="srfsc-pitch-card" data-search="obvious program grouping homepage">
      <div class="srfsc-pitch-number">03</div>
      <h3>Obvious program grouping</h3>
      <p>Clearer organization of programs instead of a crowded homepage.</p>
    </div>

    <div class="srfsc-pitch-card" data-search="community impact messaging">
      <div class="srfsc-pitch-number">04</div>
      <h3>Community impact messaging</h3>
      <p>Emphasizes the difference we make together, right at the forefront.</p>
    </div>

    <div class="srfsc-pitch-card" data-search="better use of cards content blocks">
      <div class="srfsc-pitch-number">05</div>
      <h3>Better use of cards and content blocks</h3>
      <p>Organizes information effectively, making it easier to navigate.</p>
    </div>

    <div class="srfsc-pitch-card" data-search="polished trustworthy nonprofit look">
      <div class="srfsc-pitch-number">06</div>
      <h3>A more polished and trustworthy look</h3>
      <p>Professional design that enhances credibility and encourages action.</p>
    </div>
  </div>

  <div class="srfsc-before-after">
    <div class="srfsc-pitch-panel before">
      <div class="srfsc-panel-label">Before</div>
      <ul>
        <li>Overly complex hero section</li>
        <li>Weak call-to-action visibility</li>
        <li>Programs not clearly grouped</li>
        <li>Impact of donations not highlighted</li>
        <li>Information densely packed</li>
        <li>Lack of professional polish</li>
      </ul>
    </div>

    <div class="srfsc-pitch-panel after">
      <div class="srfsc-panel-label">After</div>
      <ul>
        <li>Cleaner, focused hero with emergency info</li>
        <li>Strong, clear buttons for action</li>
        <li>Logical grouping of programs and services</li>
        <li>Community impact and urgency upfront</li>
        <li>Well-organized, digestible information</li>
        <li>Polished, trustworthy nonprofit appearance</li>
      </ul>
    </div>
  </div>
</div>
