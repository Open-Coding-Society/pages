---
toc: false
title: "Sentri: The AI-Driven Recovery Ecosystem"
description: A streamlined digital platform for program matching, meeting scheduling, and recovery tracking.
permalink: /capstone/sentri/
---

<div id="sentri-showcase" class="sentri-root">
<style>
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;600;800&display=swap');

.sentri-root {
    --bg-dark: #04130c;
    --accent-green: #4CAF50;
    --accent-dark: #1b5e20;
    --accent-light: #81c784;
    --glass: rgba(255,255,255,0.04);
    --glass-border: rgba(255,255,255,0.08);
    --text-white: #ffffff;
    --text-muted: #a7c4a0;

    background: radial-gradient(circle at top, rgba(76,175,80,0.08), transparent 60%), #04130c;
    color: var(--text-white);
    font-family: 'Plus Jakarta Sans', sans-serif;
    padding: 60px 20px;
    border-radius: 40px;
    max-width: 1100px;
    margin: auto;
}

/* HERO */
.sentri-hero {
    text-align: center;
    margin-bottom: 70px;
}

.sentri-badge {
    display: inline-block;
    padding: 6px 14px;
    border-radius: 999px;
    border: 1px solid var(--accent-light);
    color: var(--accent-light);
    font-size: 0.75rem;
    margin-bottom: 15px;
}

.sentri-hero h1 {
    font-size: clamp(2.5rem, 5vw, 3.5rem);
    margin: 0;
    font-weight: 800;
}

.sentri-hero p {
    color: var(--text-muted);
    max-width: 600px;
    margin: 15px auto;
    font-size: 1.1rem;
}

/* PILLARS */
.pillar-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(260px,1fr));
    gap: 20px;
    margin-bottom: 70px;
}

.pillar-card {
    padding: 25px;
    border-radius: 20px;
    background: var(--glass);
    border: 1px solid var(--glass-border);
    transition: 0.25s;
}

.pillar-card:hover {
    transform: translateY(-6px);
    border-color: var(--accent-green);
}

.pillar-card h3 {
    margin-bottom: 8px;
}

.pillar-card p {
    color: var(--text-muted);
    font-size: 0.95rem;
}

/* LOGO NAV GRID */
.logo-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px,1fr));
    gap: 20px;
    margin-bottom: 70px;
}

.logo-card {
    text-align: center;
    padding: 30px;
    border-radius: 20px;
    background: var(--glass);
    border: 1px solid var(--glass-border);
    text-decoration: none;
    color: white;
    transition: 0.25s;
}

.logo-card:hover {
    transform: translateY(-6px) scale(1.02);
    border-color: var(--accent-green);
    box-shadow: 0 8px 25px rgba(76,175,80,0.25);
}

.logo-card img {
    width: 70px;
    margin-bottom: 12px;
}

.logo-card span {
    display: block;
    font-weight: 600;
}

/* STATS */
.trust-strip {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    justify-content: space-between;
    background: var(--glass);
    padding: 25px;
    border-radius: 20px;
    border: 1px solid var(--glass-border);
}

.stat {
    font-size: 0.85rem;
    color: var(--text-muted);
}

.stat strong {
    display: block;
    color: white;
    font-size: 1rem;
}

/* FOOTER */
.sentri-footer {
    margin-top: 60px;
    text-align: center;
    border-top: 1px solid rgba(255,255,255,0.08);
    padding-top: 30px;
}

.btn-group {
    display: flex;
    justify-content: center;
    gap: 12px;
    flex-wrap: wrap;
}

.sentri-btn {
    padding: 14px 24px;
    border-radius: 12px;
    text-decoration: none;
    font-weight: 600;
    transition: 0.25s;
}

.btn-green {
    background: linear-gradient(135deg,#4CAF50,#2e7d32);
    box-shadow: 0 0 18px rgba(76,175,80,0.35);
}

.btn-outline {
    border: 1px solid rgba(129,199,132,0.3);
    background: rgba(76,175,80,0.05);
}

.sentri-btn:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 25px rgba(76,175,80,0.25);
}

.footer-note {
    margin-top: 20px;
    font-size: 0.8rem;
    color: var(--text-muted);
}
</style>

<!-- HERO -->
<header class="sentri-hero">
    <span class="sentri-badge">LIVE PLATFORM</span>
    <h1>SENTRI</h1>
    <p>Find the right program. Stay on track. See your progress.</p>
</header>

<!-- PILLARS -->
<section class="pillar-grid">
    <div class="pillar-card">
        <h3>🎯 Smart Matching</h3>
        <p>Quick questions → best-fit recovery path.</p>
    </div>
    <div class="pillar-card">
        <h3>📅 Easy Scheduling</h3>
        <p>Find and save meetings in seconds.</p>
    </div>
    <div class="pillar-card">
        <h3>📊 Progress Tracking</h3>
        <p>Log mood, patterns, and milestones.</p>
    </div>
</section>

<!-- LOGO NAV -->
<section class="logo-grid">
    <a href="https://sentri-prc.opencodingsociety.com/" class="logo-card" target="_blank">
        <img src="{{site.baseurl}}/images/logo.png" alt="Homepage">
        <span>Homepage</span>
    </a>
    <a href="https://sentri-prc.opencodingsociety.com/programs" class="logo-card" target="_blank">
        <img src="{{site.baseurl}}/images/logo.png" alt="Programs">
        <span>Programs</span>
    </a>
    <a href="https://sentri-prc.opencodingsociety.com/meetings" class="logo-card" target="_blank">
        <img src="{{site.baseurl}}/images/logo.png" alt="Meetings">
        <span>Meetings</span>
    </a>
</section>

<!-- TRUST -->
<section class="trust-strip">
    <div class="stat"><strong>Secure</strong> HIPAA-ready</div>
    <div class="stat"><strong>Reliable</strong> Always available</div>
    <div class="stat"><strong>Smart</strong> AI-supported</div>
    <div class="stat"><strong>Organized</strong> Clean data system</div>
</section>
