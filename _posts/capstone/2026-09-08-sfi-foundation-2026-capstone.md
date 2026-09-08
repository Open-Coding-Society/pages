---
microblog: true
toc: false
layout: post
title: SFI Foundation 2026–27
description: CSP 2026–27 capstone continuing the SFI Foundation prototype with searchable safety standards, ML-assisted discovery, equipment detection, user gear tracking, and staff tools.
categories: Capstone
permalink: /capstone/sfi-foundation/
---

<style>
.sfi27-page {
  --sfi-blue: #274294;
  --sfi-blue-dark: #1b2f70;
  --sfi-ink: #111827;
  --sfi-muted: #586174;
  --sfi-border: #dbe2f1;
  --sfi-soft: #f5f7fc;
  --sfi-white: #ffffff;
  width: 100vw;
  margin-left: calc(50% - 50vw);
  background: var(--sfi-soft);
  color: var(--sfi-ink);
  font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
}
.sfi27-page * { box-sizing: border-box; }
.sfi27-shell { width: min(1120px, calc(100% - 2rem)); margin: 0 auto; }
.sfi27-hero {
  background: linear-gradient(135deg, #eef2ff 0%, #ffffff 60%, #edf3ff 100%);
  border-bottom: 1px solid var(--sfi-border);
  padding: 4.5rem 0 4rem;
}
.sfi27-hero-grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 220px;
  gap: 3rem;
  align-items: center;
}
.sfi27-kicker {
  display: inline-flex;
  align-items: center;
  gap: .55rem;
  padding: .45rem .72rem;
  border: 1px solid #bfc9e7;
  border-radius: 999px;
  color: var(--sfi-blue-dark);
  background: rgba(255,255,255,.78);
  font-size: .76rem;
  font-weight: 800;
  letter-spacing: .08em;
  text-transform: uppercase;
}
.sfi27-kicker::before { content: ""; width: .55rem; height: .55rem; border-radius: 50%; background: #16a34a; }
.sfi27-title {
  margin: 1.25rem 0 .75rem;
  font-size: clamp(3rem, 8vw, 6.2rem);
  line-height: .92;
  letter-spacing: -.055em;
  color: var(--sfi-ink) !important;
}
.sfi27-lede {
  max-width: 760px;
  margin: 0;
  font-size: clamp(1.05rem, 2vw, 1.3rem);
  line-height: 1.7;
  color: var(--sfi-muted) !important;
}
.sfi27-logo {
  width: 190px;
  height: 190px;
  margin-left: auto;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 20px 45px rgba(39,66,148,.22);
  background: var(--sfi-blue);
}
.sfi27-logo img { width: 100%; height: 100%; object-fit: cover; display: block; }
.sfi27-actions { display: flex; flex-wrap: wrap; gap: .8rem; margin-top: 1.6rem; }
.sfi27-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: .45rem;
  min-height: 44px;
  padding: .72rem 1rem;
  border-radius: 8px;
  border: 1px solid var(--sfi-blue);
  font-weight: 800;
  text-decoration: none !important;
}
.sfi27-button--primary { background: var(--sfi-blue); color: white !important; }
.sfi27-button--secondary { background: white; color: var(--sfi-blue-dark) !important; }
.sfi27-section { padding: 4rem 0; border-bottom: 1px solid var(--sfi-border); }
.sfi27-section--white { background: var(--sfi-white); }
.sfi27-eyebrow { margin: 0 0 .65rem; color: var(--sfi-blue) !important; font-size: .76rem; font-weight: 900; letter-spacing: .12em; text-transform: uppercase; }
.sfi27-heading { margin: 0 0 1rem; color: var(--sfi-ink) !important; font-size: clamp(2rem, 5vw, 3.2rem); letter-spacing: -.035em; }
.sfi27-copy { max-width: 820px; margin: 0; color: var(--sfi-muted) !important; font-size: 1rem; line-height: 1.8; }
.sfi27-two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 1.2rem; margin-top: 2rem; }
.sfi27-panel {
  background: white;
  border: 1px solid var(--sfi-border);
  border-radius: 14px;
  padding: 1.5rem;
  box-shadow: 0 10px 28px rgba(17,24,39,.045);
}
.sfi27-panel h3 { margin: 0 0 .7rem; color: var(--sfi-ink) !important; }
.sfi27-panel p { margin: 0; color: var(--sfi-muted) !important; line-height: 1.75; }
.sfi27-feature-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; margin-top: 2rem; }
.sfi27-feature {
  background: white;
  border: 1px solid var(--sfi-border);
  border-radius: 14px;
  padding: 1.35rem;
  min-height: 190px;
}
.sfi27-feature-num { color: var(--sfi-blue) !important; font-size: .72rem; font-weight: 900; letter-spacing: .12em; }
.sfi27-feature h3 { margin: .7rem 0 .55rem; color: var(--sfi-ink) !important; font-size: 1.1rem; }
.sfi27-feature p { margin: 0; color: var(--sfi-muted) !important; line-height: 1.65; font-size: .92rem; }
.sfi27-architecture { display: grid; grid-template-columns: 1fr auto 1fr; gap: 1rem; align-items: stretch; margin-top: 2rem; }
.sfi27-arch-card { border: 1px solid var(--sfi-border); border-radius: 14px; padding: 1.5rem; background: white; }
.sfi27-arch-card h3 { margin: 0 0 .75rem; color: var(--sfi-ink) !important; }
.sfi27-arch-card ul { margin: 0; padding-left: 1.2rem; color: var(--sfi-muted); line-height: 1.8; }
.sfi27-arrow { display: grid; place-items: center; color: var(--sfi-blue); font-weight: 900; font-size: 1.5rem; }
.sfi27-status-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.2rem; margin-top: 2rem; }
.sfi27-list { margin: .9rem 0 0; padding-left: 1.2rem; color: var(--sfi-muted); line-height: 1.8; }
.sfi27-team { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: .8rem; margin-top: 1.6rem; }
.sfi27-person { padding: 1rem 1.1rem; border-radius: 10px; background: white; border: 1px solid var(--sfi-border); font-weight: 800; color: var(--sfi-ink); }
.sfi27-note { margin-top: 1.5rem; padding: 1rem 1.1rem; border-left: 4px solid var(--sfi-blue); background: #eef2ff; color: #34405f; line-height: 1.7; }
@media (max-width: 860px) {
  .sfi27-hero-grid, .sfi27-feature-grid, .sfi27-team { grid-template-columns: 1fr 1fr; }
  .sfi27-logo { margin: 0; }
  .sfi27-architecture { grid-template-columns: 1fr; }
  .sfi27-arrow { transform: rotate(90deg); min-height: 32px; }
}
@media (max-width: 640px) {
  .sfi27-hero { padding: 3rem 0; }
  .sfi27-hero-grid, .sfi27-two-col, .sfi27-feature-grid, .sfi27-status-grid, .sfi27-team { grid-template-columns: 1fr; }
  .sfi27-logo { width: 145px; height: 145px; order: -1; }
  .sfi27-section { padding: 3rem 0; }
}
</style>

<div class="sfi27-page">
  <section class="sfi27-hero">
    <div class="sfi27-shell sfi27-hero-grid">
      <div>
        <span class="sfi27-kicker">CSP 2026–27 · In Development</span>
        <h1 class="sfi27-title">SFI Foundation</h1>
        <p class="sfi27-lede">A continuation of the SFI Foundation web modernization prototype, focused on making motorsports safety standards easier to search, understand, personalize, and maintain.</p>
        <div class="sfi27-actions">
          <a class="sfi27-button sfi27-button--primary" href="https://github.com/ruhaanb622/SFI-Frontend" target="_blank" rel="noopener">Frontend Repository ↗</a>
          <a class="sfi27-button sfi27-button--secondary" href="https://github.com/ruhaanb622/SFI-Backend" target="_blank" rel="noopener">Backend Repository ↗</a>
        </div>
      </div>
      <div class="sfi27-logo">
        <img src="/images/capstone/sfi-foundation-2026-27.png" alt="SFI logo">
      </div>
    </div>
  </section>

  <section class="sfi27-section sfi27-section--white">
    <div class="sfi27-shell">
      <p class="sfi27-eyebrow">Design problem</p>
      <h2 class="sfi27-heading">Put critical safety information closer to the people who need it.</h2>
      <div class="sfi27-two-col">
        <article class="sfi27-panel">
          <h3>Current challenge</h3>
          <p>SFI publishes important motorsports safety standards and specification PDFs, but users can still face friction when searching by plain language, finding the right standard for a part, tracking their own gear, or understanding what applies to their role.</p>
        </article>
        <article class="sfi27-panel">
          <h3>Capstone direction</h3>
          <p>Build a prototype experience around searchable specifications, ML-assisted matching, account-aware tools, equipment recognition, gear tracking, and staff workflows while keeping SFI's published standards as the source of truth.</p>
        </article>
      </div>
      <div class="sfi27-note"><strong>Prototype status:</strong> this project is a student capstone prototype, not a production replacement for SFI Foundation's official website.</div>
    </div>
  </section>

  <section class="sfi27-section">
    <div class="sfi27-shell">
      <p class="sfi27-eyebrow">Prototype features</p>
      <h2 class="sfi27-heading">Six connected ways to make standards more usable.</h2>
      <div class="sfi27-feature-grid">
        <article class="sfi27-feature"><span class="sfi27-feature-num">01 · SEARCH</span><h3>Plain-English spec search</h3><p>Search SFI specifications by product name, description, category, or standard number instead of relying only on exact identifiers.</p></article>
        <article class="sfi27-feature"><span class="sfi27-feature-num">02 · ML</span><h3>Text classification</h3><p>A TF-IDF + LinearSVC classifier suggests likely SFI specifications from a free-text description of a motorsports part.</p></article>
        <article class="sfi27-feature"><span class="sfi27-feature-num">03 · VISION</span><h3>Equipment detector</h3><p>Browser-side TensorFlow.js models provide prototype image and camera classification to help users narrow down equipment categories.</p></article>
        <article class="sfi27-feature"><span class="sfi27-feature-num">04 · PROFILE</span><h3>My Gear tracking</h3><p>Authenticated users can store safety equipment in a personal gear list while the frontend keeps a local fallback for prototype use.</p></article>
        <article class="sfi27-feature"><span class="sfi27-feature-num">05 · ASSISTANT</span><h3>SFI chatbot</h3><p>A Gemini-backed chat endpoint answers questions using a compact summary of the specification database, with deeper document retrieval planned.</p></article>
        <article class="sfi27-feature"><span class="sfi27-feature-num">06 · STAFF</span><h3>Specification management</h3><p>Prototype CRUD tools let staff add, edit, and remove specification records; stronger admin authorization remains part of the roadmap.</p></article>
      </div>
    </div>
  </section>

  <section class="sfi27-section sfi27-section--white">
    <div class="sfi27-shell">
      <p class="sfi27-eyebrow">Full-stack architecture</p>
      <h2 class="sfi27-heading">Frontend experience + Flask API.</h2>
      <p class="sfi27-copy">The project separates the user-facing SFI prototype from a Python Flask backend so the team can iterate independently on interface design, API behavior, machine-learning services, authentication, and data storage.</p>
      <div class="sfi27-architecture">
        <article class="sfi27-arch-card">
          <h3>Frontend</h3>
          <ul>
            <li>Jekyll / GitHub Pages structure</li>
            <li>Shared SFI layout, navigation, and responsive pages</li>
            <li>JavaScript search, gear, and detector experiences</li>
            <li>TensorFlow.js / COCO-SSD / MobileNet experiments</li>
          </ul>
        </article>
        <div class="sfi27-arrow">↔</div>
        <article class="sfi27-arch-card">
          <h3>Backend</h3>
          <ul>
            <li>Python Flask REST API</li>
            <li>SQLAlchemy specification and gear models</li>
            <li>TF-IDF + LinearSVC text classifier</li>
            <li>Gemini-backed chat endpoint and authentication support</li>
          </ul>
        </article>
      </div>
    </div>
  </section>

  <section class="sfi27-section">
    <div class="sfi27-shell">
      <p class="sfi27-eyebrow">Development status</p>
      <h2 class="sfi27-heading">What works now, and what comes next.</h2>
      <div class="sfi27-status-grid">
        <article class="sfi27-panel">
          <h3>Implemented / prototyped</h3>
          <ul class="sfi27-list">
            <li>SFI-styled informational pages and shared navigation</li>
            <li>Specification browsing, search, categories, and stats</li>
            <li>Machine-learning text classification</li>
            <li>Browser-side equipment detection experiments</li>
            <li>Authentication-connected personal gear storage</li>
            <li>Specification CRUD and Gemini chatbot endpoint</li>
          </ul>
        </article>
        <article class="sfi27-panel">
          <h3>Next milestones</h3>
          <ul class="sfi27-list">
            <li>Finish admin and role-management backend endpoints</li>
            <li>Add real permission checks around staff actions</li>
            <li>Build secure PDF ingestion, extraction, and retrieval</li>
            <li>Give the chatbot grounded access to site and PDF content</li>
            <li>Improve mobile polish, consistency, and automated tests</li>
            <li>Strengthen equipment verification beyond category detection</li>
          </ul>
        </article>
      </div>
    </div>
  </section>

  <section class="sfi27-section sfi27-section--white">
    <div class="sfi27-shell">
      <p class="sfi27-eyebrow">CSP 2026–27 team</p>
      <h2 class="sfi27-heading">Project team</h2>
      <div class="sfi27-team">
        <div class="sfi27-person">Ruhaan Bansal</div>
        <div class="sfi27-person">Arya Taghavi Zargar</div>
        <div class="sfi27-person">Deyar Raissadat</div>
        <div class="sfi27-person">Ishan Jha</div>
        <div class="sfi27-person">Ishan Khandelwal</div>
        <div class="sfi27-person">Vayun Shekhar</div>
      </div>
      <div class="sfi27-actions">
        <a class="sfi27-button sfi27-button--primary" href="https://github.com/ruhaanb622/SFI-Frontend" target="_blank" rel="noopener">View Frontend Code ↗</a>
        <a class="sfi27-button sfi27-button--secondary" href="https://github.com/ruhaanb622/SFI-Backend" target="_blank" rel="noopener">View Backend Code ↗</a>
      </div>
    </div>
  </section>
</div>
