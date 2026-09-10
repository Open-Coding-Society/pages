---
microblog: true
toc: false
title: "Sentri: The AI-Driven Recovery Ecosystem"
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
    display: block;
    text-decoration: none;
    color: white;
    padding: 25px;
    border-radius: 20px;
    background: var(--glass);
    border: 1px solid var(--glass-border);
    transition: 0.25s;
}

.pillar-card:hover {
    transform: translateY(-6px);
    border-color: var(--accent-green);
    box-shadow: 0 8px 25px rgba(76,175,80,0.25);
}

.pillar-card h3, .pillar-card p {
    margin: 0;
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

/* HANDOFF STYLES */
.handoff-container {
    margin-top: 100px;
    border-top: 2px dashed var(--glass-border);
    padding-top: 60px;
    text-align: left;
}

.handoff-header {
    margin-bottom: 40px;
    text-align: center;
}

.handoff-header h2 {
    font-size: 2rem;
    color: var(--accent-light);
    margin-bottom: 10px;
}

.feedback-section {
    background: rgba(0,0,0,0.2);
    padding: 40px;
    border-radius: 24px;
    margin-bottom: 40px;
    border: 1px solid var(--glass-border);
}

.feedback-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 40px;
}

.feedback-item h4 {
    color: var(--accent-light);
    margin-bottom: 15px;
    font-size: 1.2rem;
    border-bottom: 1px solid var(--glass-border);
    padding-bottom: 10px;
}

.feedback-item p {
    font-size: 0.9rem;
    color: var(--text-muted);
    line-height: 1.6;
}

.tech-stack-tag {
    display: inline-block;
    padding: 2px 8px;
    background: var(--accent-dark);
    border-radius: 4px;
    font-size: 0.7rem;
    color: white;
    margin-right: 5px;
    margin-bottom: 10px;
}

.github-cta {
    display: inline-flex;
    align-items: center;
    background: var(--accent-green);
    color: white;
    text-decoration: none;
    padding: 15px 30px;
    border-radius: 12px;
    font-weight: 600;
    margin: 20px 0;
    transition: 0.3s;
}

.github-cta:hover {
    background: var(--accent-light);
    transform: scale(1.05);
}

.team-contact {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    margin-top: 30px;
    justify-content: center;
}

.contact-card {
    background: var(--glass);
    padding: 15px;
    border-radius: 12px;
    font-size: 0.85rem;
    border: 1px solid var(--glass-border);
}

.contact-card a {
    color: var(--accent-light);
    text-decoration: none;
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
    <div class="pillar-card" onclick="triggerConfetti()">
        <h3>🎯 Smart Matching</h3>
        <p>Quick questions → best-fit recovery path.</p>
    </div>
    <div class="pillar-card" onclick="triggerConfetti()">
        <h3>📅 Easy Scheduling</h3>
        <p>Find and save meetings fast.</p>
    </div>
    <div class="pillar-card" onclick="triggerConfetti()">
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
    <a href="https://sentri-prc.opencodingsociety.com/" class="logo-card" target="_blank">
        <span class="logo-emoji">📋</span>
        <span>Programs</span>
    </a>
    <a href="https://sentri-prc.opencodingsociety.com/" class="logo-card" target="_blank">
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

<!-- HANDOFF SECTION -->
<div class="handoff-container">
    <div class="handoff-header">
        <h2>Technical Handoff & Development Roadmap</h2>
        <p>Strategic plan for the Poway Recovery Center digital infrastructure revamp.</p>
        
        <a href="https://github.com/Debuggers-CSP/Sentri-PRC" target="_blank" class="github-cta">
            <span>🚀 Access GitHub Repository</span>
        </a>
    </div>

    <div class="feedback-section">
        <h3>Development Strategy: Addressing Expo Feedback</h3>
        <div class="feedback-grid">
            
            <!-- PRIVACY & BACKEND -->
            <div class="feedback-item">
                <h4>🔒 Privacy & Data Architecture</h4>
                <div class="tech-stack-tag">Node.js</div><div class="tech-stack-tag">PostgreSQL</div><div class="tech-stack-tag">JWT</div>
                <p>
                    <strong>The Gameplan:</strong> To ensure anonymity, we are shifting to a persistent backend. 
                    User identities will be decoupled from activity logs using a <em>UUID system</em>.
                </p>
                <p>
                    <strong>CRUD Operations:</strong> We will implement a RESTful API to manage the "Sobriety Garden" and journal entries. 
                    Users will have full control over their data, including an "Account Purge" feature to permanently Delete all database entries, satisfying privacy requirements.
                </p>
            </div>

            <!-- UI/UX PIVOT -->
            <div class="feedback-item">
                <h4>🎨 Psychological UI Refactor</h4>
                <div class="tech-stack-tag">CSS Grid</div><div class="tech-stack-tag">Mobile-First</div>
                <p>
                    <strong>Visual Pivot:</strong> Transitioning from the clinical "High-Alert Green" to a "Serene Blue" and neutral palette (#E3F2FD, #F5F5F5) to reduce user anxiety during crisis.
                </p>
                <p>
                    <strong>Mobile-First:</strong> Refactoring the Information Architecture for 320px–480px viewports. This ensures that users in transition—who often rely solely on smartphones—can access the AI Program Finder with zero friction.
                </p>
            </div>

            <!-- GOVERNANCE -->
            <div class="feedback-item">
                <h4>🛡️ Admin Moderation System</h4>
                <div class="tech-stack-tag">RBAC</div><div class="tech-stack-tag">Dashboard</div>
                <p>
                    <strong>The Solution:</strong> A dedicated Admin UI with Role-Based Access Control (RBAC) for PRC staff. 
                </p>
                <p>
                    <strong>Functionality:</strong> Staff will be able to Read flagged community posts, Update community bulletin content in real-time, and Delete inappropriate interactions to maintain a safe, recovery-focused environment.
                </p>
            </div>

            <!-- IA PIVOT -->
            <div class="feedback-item">
                <h4>🚪 "Before-Login" Landing</h4>
                <div class="tech-stack-tag">Routing</div><div class="tech-stack-tag">SEO</div>
                <p>
                    <strong>Entry Barriers:</strong> Currently, features are gated. Our plan includes a "Public Hope" landing page that allows users to utilize the AI Program Finder <em>anonymously</em> before committing to an account. This builds trust before data collection.
                </p>
            </div>

        </div>
    </div>

    <div class="feedback-section" style="text-align: center;">
        <h3>Future Partnership: Poway Recovery Center</h3>
        <p style="font-size: 1rem; color: var(--text-muted); max-width: 800px; margin: auto; line-height: 1.8;">
            Following our connection with <strong>Damon Dong</strong>, Sentri is moving from a prototype to a "Service Learning" project. Our immediate next steps include scheduling a requirements-gathering call to align our SQL schema with the Center’s existing operational data.
        </p>
        
        <div class="team-contact">
            <div class="contact-card">
                <strong>Anika Marathe</strong><br>
                <a href="mailto:anika.marathe@gmail.com">anika.marathe@gmail.com</a>
            </div>
            <div class="contact-card">
                <strong>Lilian Wu</strong><br>
                <a href="mailto:lilianwu08@gmail.com">lilianwu08@gmail.com</a>
            </div>
            <div class="contact-card">
                <strong>Jaynee Chauhan</strong><br>
                <a href="mailto:chauhanjayneea@gmail.com">chauhanjayneea@gmail.com</a>
            </div>
        </div>
    </div>
</div>

<!-- FOOTER -->
<footer class="sentri-footer">
    <p class="footer-note">Poway Recovery Center × Open Coding Society</p>
</footer>

<script>
function triggerConfetti() {
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
}
</script>

</div>