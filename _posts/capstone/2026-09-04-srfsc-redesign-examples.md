---
microblog: true
toc: false
layout: post
comments: true
title: SRFSC Website Redesign Examples
description: Visual mockup examples showing how the Scripps Ranch Fire Safe Council website could be redesigned for clarity, urgency, and action.
permalink: /capstone/srfsc-redesign-examples/
author: Krish Kelageri, Jasan Boprai, Shourya Patel
year: "2026-2027"
courses: { csp: {week: 25} }
---

<style>
  .srfsc-demo {
    font-family: Arial, sans-serif;
    color: #14213d;
    background: linear-gradient(180deg, #f7f7f2 0%, #eef4ee 100%);
    border-radius: 22px;
    overflow: hidden;
    box-shadow: 0 20px 40px rgba(18, 41, 25, 0.12);
    margin: 2rem 0;
    border: 1px solid rgba(17, 38, 27, 0.08);
  }

  .srfsc-demo,
  .srfsc-demo p,
  .srfsc-demo h2,
  .srfsc-demo h3,
  .srfsc-demo h4,
  .srfsc-demo li,
  .srfsc-demo span,
  .srfsc-demo strong,
  .srfsc-demo a:not(.srfsc-btn) {
    color: #111111 !important;
  }

  .srfsc-demo * { box-sizing: border-box; }

  .post-content,
  .post-content p,
  .post-content li,
  .post-content h2,
  .post-content h3,
  .post-content h4,
  .post-content strong,
  .post-content a,
  .post-content span {
    color: #111111 !important;
  }

  .srfsc-topbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: #173b2f;
    color: white;
    padding: 1rem 2rem;
  }

  .srfsc-brand {
    font-size: 1.1rem;
    font-weight: 800;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  .srfsc-nav {
    display: flex;
    gap: 1.2rem;
    font-size: 0.82rem;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    opacity: 0.95;
  }

  .srfsc-nav a {
    color: white;
    text-decoration: none;
  }

  .srfsc-btn {
    display: inline-block;
    background: #d8572a;
    color: white;
    padding: 0.85rem 1.5rem;
    border-radius: 999px;
    font-weight: 700;
    text-decoration: none;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    font-size: 0.75rem;
  }

  .srfsc-btn.secondary {
    background: #e8f0ea;
    color: #173b2f;
  }

  .srfsc-hero {
    position: relative;
    background:
      linear-gradient(120deg, rgba(14, 34, 27, 0.82), rgba(46, 77, 57, 0.65)),
      url('https://images.unsplash.com/photo-1473448912268-2022ce9509d8?auto=format&fit=crop&w=1200&q=80') center/cover no-repeat;
    color: white;
    padding: 4.5rem 2rem 3rem;
  }

  .srfsc-hero-inner {
    max-width: 1180px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: 1.4fr 0.8fr;
    gap: 2rem;
    align-items: center;
  }

  .srfsc-kicker {
    font-size: 0.72rem;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    font-weight: 800;
    color: #dfeecf;
    margin-bottom: 1rem;
  }

  .srfsc-hero h2 {
    font-size: clamp(2.2rem, 5vw, 4.3rem);
    line-height: 0.96;
    margin: 0 0 1rem;
    letter-spacing: -0.05em;
    font-weight: 900;
  }

  .srfsc-hero p {
    font-size: 1.05rem;
    line-height: 1.7;
    max-width: 620px;
    color: rgba(255,255,255,0.88);
  }

  .srfsc-cta-row {
    display: flex;
    flex-wrap: wrap;
    gap: 0.9rem;
    margin-top: 1.5rem;
  }

  .srfsc-hero-box {
    background: rgba(255,255,255,0.08);
    border: 1px solid rgba(255,255,255,0.18);
    border-radius: 18px;
    padding: 1.5rem;
    backdrop-filter: blur(4px);
  }

  .srfsc-hero-box h3 {
    margin: 0 0 0.8rem;
    font-size: 0.8rem;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: #dfeecf;
  }

  .srfsc-hero-box strong {
    display: block;
    font-size: 2.3rem;
    margin-bottom: 0.4rem;
  }

  .srfsc-section {
    max-width: 1180px;
    margin: 0 auto;
    padding: 3rem 2rem;
  }

  .srfsc-grid-3 {
    display: grid;
    grid-template-columns: repeat(3, minmax(0,1fr));
    gap: 1.2rem;
  }

  .srfsc-card {
    background: white;
    border-radius: 18px;
    padding: 1.5rem;
    box-shadow: 0 10px 25px rgba(19, 41, 18, 0.07);
    border: 1px solid rgba(17, 38, 27, 0.06);
  }

  .srfsc-card .icon {
    width: 52px;
    height: 52px;
    border-radius: 14px;
    display: grid;
    place-items: center;
    background: #edf8eb;
    font-size: 1.6rem;
    margin-bottom: 1rem;
  }

  .srfsc-card h3 {
    margin: 0 0 0.75rem;
    font-size: 1.2rem;
    color: #112420;
  }

  .srfsc-card p {
    margin: 0;
    line-height: 1.7;
    color: #475a53;
  }

  .srfsc-split {
    display: grid;
    grid-template-columns: 1.35fr 0.95fr;
    gap: 1.5rem;
    align-items: stretch;
  }

  .srfsc-panel,
  .srfsc-alert {
    background: white;
    border: 1px solid rgba(17, 38, 27, 0.08);
    border-radius: 20px;
    padding: 1.5rem;
    box-shadow: 0 10px 25px rgba(19, 41, 18, 0.05);
  }

  .srfsc-panel h3 {
    margin: 0 0 1rem;
    font-size: 1.6rem;
    letter-spacing: -0.04em;
    color: #173b2f;
  }

  .srfsc-list {
    list-style: none;
    padding: 0;
    margin: 0;
    display: grid;
    gap: 0.8rem;
  }

  .srfsc-list li {
    display: flex;
    gap: 0.75rem;
    align-items: flex-start;
    line-height: 1.6;
    color: #24372f;
  }

  .srfsc-bullet {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: linear-gradient(135deg, #d8572a, #efb63b);
    margin-top: 0.45rem;
    flex-shrink: 0;
  }

  .srfsc-alert {
    display: flex;
    flex-direction: column;
    justify-content: center;
    background: linear-gradient(180deg, #fdf5ea 0%, #fffaf3 100%);
    border-color: rgba(216, 87, 42, 0.18);
  }

  .srfsc-alert strong {
    font-size: 1.4rem;
    color: #173b2f;
    margin-bottom: 0.8rem;
  }

  .srfsc-alert p {
    margin: 0;
    line-height: 1.7;
    color: #4a5d55;
  }

  .srfsc-search {
    max-width: 1180px;
    margin: 0 auto;
    padding: 0 2rem 2.4rem;
  }

  .srfsc-search input {
    width: 100%;
    border: 1px solid rgba(17, 38, 27, 0.12);
    border-radius: 999px;
    padding: 0.9rem 1.2rem;
    font-size: 1rem;
    background: rgba(255,255,255,0.9);
    color: #111;
    box-shadow: 0 6px 18px rgba(19, 41, 18, 0.05);
  }

  .srfsc-search input:focus {
    outline: 2px solid rgba(216, 87, 42, 0.25);
    border-color: rgba(216, 87, 42, 0.5);
  }

  .srfsc-hidden {
    display: none !important;
  }

  .srfsc-feature-wrap {
    max-width: 1180px;
    margin: 2.5rem auto 0;
    padding: 0 2rem;
  }

  .srfsc-feature-header {
    margin-bottom: 1rem;
  }

  .srfsc-feature-header h3 {
    margin: 0.4rem 0 0;
    font-size: clamp(1.7rem, 3vw, 2.4rem);
    letter-spacing: -0.04em;
    color: #173b2f;
  }

  .srfsc-eyebrow {
    display: inline-block;
    padding: 0.38rem 0.78rem;
    border-radius: 999px;
    background: #edf6ec;
    color: #173b2f;
    font-size: 0.72rem;
    font-weight: 800;
    letter-spacing: 0.1em;
    text-transform: uppercase;
  }

  .srfsc-feature-grid {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 1rem;
  }

  .srfsc-feature-card {
    background: linear-gradient(180deg, #ffffff 0%, #f7faf7 100%);
    border: 1px solid rgba(17, 38, 27, 0.08);
    border-radius: 20px;
    padding: 1.25rem;
    box-shadow: 0 12px 24px rgba(19, 41, 18, 0.05);
    transition: transform 0.2s ease, box-shadow 0.2s ease;
  }

  .srfsc-feature-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 16px 28px rgba(19, 41, 18, 0.08);
  }

  .srfsc-feature-number {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 2.2rem;
    height: 2.2rem;
    border-radius: 50%;
    background: #173b2f;
    color: white;
    font-size: 0.7rem;
    font-weight: 800;
    letter-spacing: 0.08em;
    margin-bottom: 0.9rem;
  }

  .srfsc-feature-icon {
    font-size: 1.9rem;
    margin-bottom: 0.8rem;
  }

  .srfsc-feature-card h4 {
    margin: 0 0 0.6rem;
    font-size: 1.1rem;
    color: #112420;
  }

  .srfsc-feature-card p {
    margin: 0;
    line-height: 1.6;
    color: #3b4d47;
  }

  .srfsc-feature-card.accent-1 { border-top: 4px solid #d8572a; }
  .srfsc-feature-card.accent-2 { border-top: 4px solid #efb63b; }
  .srfsc-feature-card.accent-3 { border-top: 4px solid #6a8d6d; }
  .srfsc-feature-card.accent-4 { border-top: 4px solid #3e7d5d; }

  .srfsc-news-grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0,1fr));
    gap: 1rem;
  }

  .srfsc-news-item {
    background: white;
    border: 1px solid rgba(17, 38, 27, 0.08);
    border-radius: 18px;
    overflow: hidden;
    box-shadow: 0 12px 24px rgba(19, 41, 18, 0.04);
  }

  .srfsc-news-image {
    min-height: 180px;
    background: linear-gradient(135deg, #d3e8c3, #7f9d7d);
  }

  .srfsc-news-content {
    padding: 1rem 1rem 1.2rem;
  }

  .srfsc-news-content .tag {
    display: inline-block;
    padding: 0.3rem 0.65rem;
    background: #edf6ec;
    border-radius: 999px;
    font-size: 0.65rem;
    font-weight: 800;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: #173b2f;
    margin-bottom: 0.7rem;
  }

  .srfsc-news-content h4 {
    margin: 0 0 0.6rem;
    font-size: 1.15rem;
    color: #112420;
  }

  .srfsc-news-content p {
    margin: 0;
    line-height: 1.7;
    color: #4b5d55;
  }

  .srfsc-callout {
    max-width: 1180px;
    margin: 0 auto 2rem;
    padding: 1.75rem 2rem;
    border-radius: 20px;
    background: linear-gradient(135deg, #173b2f, #214b3c);
    text-align: center;
    box-shadow: 0 18px 35px rgba(17, 38, 27, 0.12);
  }

  .srfsc-callout h3 {
    margin: 0 0 1rem;
    font-size: clamp(1.8rem, 4vw, 2.6rem);
    letter-spacing: -0.04em;
    color: #f4e4c3;
  }

  * {
    box-sizing: border-box;
  }

  @media (max-width: 900px) {
    .srfsc-hero-inner,
    .srfsc-grid-3,
    .srfsc-news-grid,
    .srfsc-split,
    .srfsc-feature-grid {
      grid-template-columns: 1fr;
    }

    .srfsc-nav {
      display: none;
    }

    .srfsc-topbar {
      padding: 1rem 1.2rem;
    }

    .srfsc-hero,
    .srfsc-section,
    .srfsc-feature-wrap,
    .srfsc-search,
    .srfsc-callout {
      padding-left: 1rem;
      padding-right: 1rem;
    }
  }

  @media (max-width: 640px) {
    .srfsc-topbar {
      flex-wrap: wrap;
      gap: 0.75rem;
      padding: 0.9rem 1rem;
    }

    .srfsc-brand {
      font-size: 0.98rem;
      letter-spacing: 0.12em;
    }

    .srfsc-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      padding: 0.8rem 1rem;
      font-size: 0.72rem;
      letter-spacing: 0.08em;
    }

    .srfsc-cta-row {
      flex-direction: column;
      width: 100%;
    }

    .srfsc-hero {
      padding: 3rem 1rem 2.1rem;
    }

    .srfsc-hero h2 {
      font-size: clamp(2rem, 9vw, 2.8rem);
      line-height: 1.02;
    }

    .srfsc-hero p {
      font-size: 0.96rem;
      line-height: 1.6;
    }

    .srfsc-hero-box {
      padding: 1.1rem 1rem;
    }

    .srfsc-hero-box strong {
      font-size: 1.9rem;
    }

    .srfsc-section,
    .srfsc-feature-wrap,
    .srfsc-search,
    .srfsc-callout {
      padding-left: 0.9rem;
      padding-right: 0.9rem;
    }

    .srfsc-card,
    .srfsc-panel,
    .srfsc-alert,
    .srfsc-feature-card,
    .srfsc-news-item,
    .srfsc-news-content {
      padding: 1rem;
    }

    .srfsc-feature-header h3,
    .srfsc-callout h3 {
      font-size: clamp(1.6rem, 7vw, 2.2rem);
    }
  }

  .srfsc-pitch {
    max-width: 1180px;
    margin: 2.5rem auto 0;
    padding: 0 2rem 2rem;
    font-family: Arial, sans-serif;
    color: #14213d !important;
  }

  .srfsc-pitch-hero {
    background: linear-gradient(135deg, #173b2f 0%, #214b3c 100%) !important;
    border-radius: 24px;
    padding: 2rem 1.5rem;
    text-align: center;
    border: 1px solid rgba(239, 182, 59, 0.25);
    box-shadow: 0 18px 35px rgba(17, 38, 27, 0.12);
  }

  .srfsc-pitch-kicker {
    display: inline-block;
    font-size: 0.72rem;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    font-weight: 800;
    color: #e9f3d7 !important;
    background: rgba(255,255,255,0.08) !important;
    border: 1px solid rgba(255,255,255,0.14);
    border-radius: 999px;
    padding: 0.45rem 0.8rem;
    margin-bottom: 0.8rem;
  }

  .srfsc-pitch-hero h2 {
    margin: 0 0 0.5rem;
    font-size: clamp(2rem, 4vw, 3rem);
    line-height: 1.1;
    letter-spacing: -0.05em;
    color: #f0c767 !important;
  }

  .srfsc-pitch-hero p {
    max-width: 760px;
    margin: 0 auto;
    line-height: 1.7;
    color: #f8fbf4 !important;
    font-size: 1rem;
  }

  .srfsc-pitch-grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 1rem;
    margin-top: 1.5rem;
  }

  .srfsc-pitch-card {
    background: #f8faf7 !important;
    border: 1px solid rgba(17, 38, 27, 0.08);
    border-radius: 18px;
    padding: 1.25rem;
    box-shadow: 0 12px 24px rgba(19, 41, 18, 0.06);
  }

  .srfsc-pitch-number {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 2.3rem;
    height: 2.3rem;
    border-radius: 50%;
    background: linear-gradient(135deg, #d8572a, #efb63b);
    color: white;
    font-size: 0.7rem;
    font-weight: 800;
    letter-spacing: 0.08em;
    margin-bottom: 0.85rem;
  }

  .srfsc-pitch-card h3 {
    margin: 0 0 0.7rem;
    font-size: 1.2rem;
    color: #112420 !important;
  }

  .srfsc-pitch-card p {
    margin: 0;
    line-height: 1.7;
    color: #3c4b42 !important;
  }

  .srfsc-before-after {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
    margin-top: 1.5rem;
  }

  .srfsc-pitch-panel {
    border-radius: 18px;
    padding: 1.2rem 1.1rem;
    border: 1px solid rgba(17, 38, 27, 0.08);
  }

  .srfsc-pitch-panel.before {
    background: #fff3ee !important;
    border-color: rgba(216, 87, 42, 0.2);
  }

  .srfsc-pitch-panel.after {
    background: #f1f7f2 !important;
    border-color: rgba(106, 141, 109, 0.2);
  }

  .srfsc-panel-label {
    font-size: 0.72rem;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    font-weight: 800;
    margin-bottom: 0.8rem;
  }

  .srfsc-pitch-panel.before .srfsc-panel-label {
    color: #bf4c23;
  }

  .srfsc-pitch-panel.after .srfsc-panel-label {
    color: #2f6f4f;
  }

  .srfsc-pitch-panel ul {
    margin: 0;
    padding-left: 1.1rem;
    color: #21342d !important;
    line-height: 1.65;
  }

  .srfsc-pitch-panel li {
    color: #21342d !important;
  }

  @media (max-width: 900px) {
    .srfsc-pitch-grid,
    .srfsc-before-after {
      grid-template-columns: 1fr;
    }
  }

  @media (max-width: 640px) {
    .srfsc-pitch {
      padding-left: 0.9rem;
      padding-right: 0.9rem;
    }

    .srfsc-pitch-hero {
      padding: 1.5rem 1.1rem;
    }

    .srfsc-pitch-hero p {
      font-size: 0.95rem;
    }
  }

  .srfsc-demo .ocs__grid {
    width: 100%;
    margin: 0;
    gap: 1rem;
  }

  .srfsc-demo .ocs__grid-cell {
    background: rgba(255,255,255,0.96);
    border: 1px solid rgba(17, 38, 27, 0.08);
    border-radius: 18px;
    padding: 1.25rem;
    box-shadow: 0 10px 25px rgba(19, 41, 18, 0.06);
  }

  .srfsc-demo .ocs__grid-cell--header {
    background: #edf6ec;
    color: #173b2f;
    border-color: rgba(23, 59, 47, 0.2);
    font-size: 1.05rem;
    font-weight: 800;
    letter-spacing: 0.04em;
    text-transform: uppercase;
  }

  .srfsc-demo .ocs__grid-cell--accent {
    background: linear-gradient(180deg, #ffffff 0%, #f7faf7 100%);
    border-color: rgba(17, 38, 27, 0.08);
  }

  .srfsc-demo .ocs__grid-cell strong {
    display: block;
    margin-bottom: 0.5rem;
    color: #112420;
    font-size: 1.1rem;
  }

  .srfsc-demo .ocs__grid-cell p,
  .srfsc-demo .ocs__grid-cell li {
    color: #475a53;
    margin: 0;
    line-height: 1.7;
  }

  .srfsc-demo .ocs__grid-cell ul {
    margin: 0;
    padding-left: 1.1rem;
  }

  .srfsc-demo .ocs__grid-cell .ocs__btn {
    margin-top: 0.9rem;
  }

  @media (max-width: 640px) {
    .srfsc-demo .ocs__grid {
      gap: 0.75rem;
    }

    .srfsc-demo .ocs__grid-cell {
      padding: 1rem;
    }
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
