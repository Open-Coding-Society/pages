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
    position: relative;
    overflow: hidden;
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

.pillar-card p {
    color: var(--text-muted);
    font-size: 0.95rem;
}

/* EMOJI NAV */
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

.logo-emoji {
    font-size: 3rem;
    display: block;
    margin-bottom: 10px;
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
    padding-top: 25px;
}

.footer-note {
    font-size: 0.85rem;
    color: var(--text-muted);
}

/* CONFETTI */
.confetti {
    position: absolute;
    width: 6px;
    height: 10px;
    background: var(--accent-light);
    top: -10px;
    opacity: 0.8;
    animation: fall 2.5s linear forwards;
}

@keyframes fall {
    to {
        transform: translateY(600px) rotate(360deg);
        opacity: 0;
    }
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
        <p>Find and save meetings fast.</p>
    </div>
    <div class="pillar-card">
        <h3>📊 Progress Tracking</h3>
        <p>Track mood, patterns, and growth.</p>
    </div>
</section>

<!-- EMOJI NAV -->
<section class="logo-grid">
    <a href="https://sentri-prc.opencodingsociety.com/" class="logo-card" target="_blank">
        <span class="logo-emoji">🏠</span>
        <span>Homepage</span>
    </a>
    <a href="https://sentri-prc.opencodingsociety.com/programs" class="logo-card" target="_blank">
        <span class="logo-emoji">📋</span>
        <span>Programs</span>
    </a>
    <a href="https://sentri-prc.opencodingsociety.com/meetings" class="logo-card" target="_blank">
        <span class="logo-emoji">📅</span>
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

<!-- FOOTER -->
<footer class="sentri-footer">
    <p class="footer-note">Poway Recovery Center × Open Coding Society</p>
</footer>

<script>
// Confetti burst on load (runs once)
window.addEventListener("load", () => {
    const container = document.getElementById("sentri-showcase");

    for (let i = 0; i < 60; i++) {
        const confetti = document.createElement("div");
        confetti.classList.add("confetti");

        confetti.style.left = Math.random() * 100 + "%";
        confetti.style.animationDuration = (Math.random() * 1.5 + 1.5) + "s";
        confetti.style.background = ["#4CAF50","#81c784","#a5d6a7"][Math.floor(Math.random()*3)];

        container.appendChild(confetti);

        setTimeout(() => confetti.remove(), 3000);
    }
});
</script>

</div>