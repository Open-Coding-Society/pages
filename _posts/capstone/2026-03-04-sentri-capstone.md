---
toc: false
title: "Sentri: The AI-Driven Recovery Ecosystem"
description: A comprehensive digital platform for the Poway Recovery Center featuring automated program matching, personalized meeting scheduling, and integrated sentiment-aware chat history.
permalink: /capstone/sentri/
---

<!-- Sentri Infographic Component -->
<div id="sentri-showcase" class="sentri-root">
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;600;800&display=swap');

        .sentri-root {
            --bg-dark: #050810;
            --accent-blue: #3b82f6;
            --accent-purple: #8b5cf6;
            --glass: rgba(255, 255, 255, 0.03);
            --glass-border: rgba(255, 255, 255, 0.1);
            --text-white: #ffffff;
            --text-muted: #94a3b8;
            
            background: var(--bg-dark);
            color: var(--text-white);
            font-family: 'Plus Jakarta Sans', sans-serif;
            padding: 60px 20px;
            border-radius: 40px;
            margin: 20px auto;
            max-width: 1200px;
            overflow: hidden;
            line-height: 1.5;
        }

        /* --- HERO SECTION --- */
        .sentri-hero {
            text-align: center;
            margin-bottom: 80px;
        }

        .sentri-badge {
            display: inline-block;
            padding: 6px 16px;
            background: linear-gradient(90deg, #3b82f633, #8b5cf633);
            border: 1px solid var(--accent-blue);
            border-radius: 100px;
            color: var(--accent-blue);
            font-size: 0.8rem;
            font-weight: 700;
            letter-spacing: 1px;
            text-transform: uppercase;
            margin-bottom: 20px;
        }

        .sentri-hero h1 {
            font-size: clamp(2.5rem, 6vw, 4rem);
            font-weight: 800;
            margin: 0;
            letter-spacing: -2px;
            background: linear-gradient(to bottom right, #fff 50%, #94a3b8);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }

        .sentri-hero p {
            font-size: 1.25rem;
            color: var(--text-muted);
            max-width: 700px;
            margin: 20px auto;
        }

        /* --- FEATURE PILLARS --- */
        .pillar-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            gap: 20px;
            margin-bottom: 80px;
        }

        .pillar-card {
            background: var(--glass);
            border: 1px solid var(--glass-border);
            padding: 40px 30px;
            border-radius: 30px;
            transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            text-align: left;
        }

        .pillar-card:hover {
            transform: translateY(-10px);
            border-color: var(--accent-blue);
            background: rgba(255, 255, 255, 0.05);
        }

        .pillar-icon {
            font-size: 2.5rem;
            margin-bottom: 20px;
            display: block;
        }

        .pillar-card h3 {
            font-size: 1.4rem;
            margin-bottom: 12px;
            font-weight: 700;
        }

        .pillar-card p {
            color: var(--text-muted);
            font-size: 0.95rem;
            margin: 0;
        }

        /* --- INTERFACE MESH GRID --- */
        .interface-section {
            display: grid;
            grid-template-columns: repeat(6, 1fr);
            grid-template-rows: repeat(2, 250px);
            gap: 15px;
            margin-bottom: 60px;
        }

        .screenshot-box {
            position: relative;
            border-radius: 20px;
            overflow: hidden;
            border: 1px solid var(--glass-border);
            background: #111;
            transition: filter 0.3s;
        }

        .screenshot-box img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            opacity: 0.7;
            transition: transform 0.5s, opacity 0.3s;
        }

        .screenshot-box:hover img {
            transform: scale(1.05);
            opacity: 1;
        }

        .label {
            position: absolute;
            bottom: 15px;
            left: 15px;
            background: rgba(0,0,0,0.6);
            backdrop-filter: blur(10px);
            padding: 4px 12px;
            border-radius: 10px;
            font-size: 0.75rem;
            font-weight: 600;
            border: 1px solid rgba(255,255,255,0.1);
        }

        /* Grid Layout Sizes */
        .item-home { grid-column: span 3; }
        .item-prog { grid-column: span 3; }
        .item-assist { grid-column: span 2; }
        .item-aa { grid-column: span 2; }
        .item-prof { grid-column: span 1; }
        .item-meet { grid-column: span 1; }

        /* --- TRUST & STATS --- */
        .trust-strip {
            display: flex;
            justify-content: space-between;
            align-items: center;
            background: var(--glass);
            border-radius: 24px;
            padding: 30px;
            border: 1px solid var(--glass-border);
            flex-wrap: wrap;
            gap: 20px;
        }

        .stat-item {
            display: flex;
            align-items: center;
            gap: 12px;
        }

        .stat-icon { color: var(--accent-blue); font-size: 1.5rem; }
        .stat-text { font-size: 0.85rem; font-weight: 600; text-transform: uppercase; color: var(--text-muted); }
        .stat-text strong { color: white; display: block; font-size: 1rem; }

        /* --- FOOTER CTA --- */
        .sentri-footer {
            margin-top: 60px;
            text-align: center;
        }

        .btn-group {
            display: flex;
            justify-content: center;
            gap: 15px;
        }

        .sentri-btn {
            padding: 16px 32px;
            border-radius: 14px;
            text-decoration: none;
            font-weight: 700;
            transition: 0.3s;
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .btn-blue { background: var(--accent-blue); color: white; }
        .btn-outline { border: 1px solid var(--glass-border); color: white; }
        
        .sentri-btn:hover { filter: brightness(1.2); transform: scale(1.02); }

        @media (max-width: 900px) {
            .interface-section { grid-template-columns: repeat(2, 1fr); grid-template-rows: auto; }
            .item-home, .item-prog, .item-assist, .item-aa, .item-prof, .item-meet { grid-column: span 2; height: 250px; }
            .trust-strip { flex-direction: column; align-items: flex-start; }
        }
    </style>

    <!-- 1. Hero -->
    <header class="sentri-hero">
        <span class="sentri-badge">V3.1.0-STABLE | LIVE DEPLOYMENT</span>
        <h1>SENTRI</h1>
        <p>A sophisticated recovery ecosystem mapping user behavioral data to specialized clinical programs with algorithmic precision.</p>
    </header>

    <!-- 2. The 3 Pillars -->
    <section class="pillar-grid">
        <div class="pillar-card">
            <span class="pillar-icon">🎯</span>
            <h3>PRC Matcher</h3>
            <p>Diagnostic onboarding flow that calculates compatibility scores for 12-step programs based on user inputs.</p>
        </div>
        <div class="pillar-card">
            <span class="pillar-icon">📅</span>
            <h3>Smart Calendar</h3>
            <p>Dynamic scheduling engine that retrieves and persists regional meetings into a clean, relational database view.</p>
        </div>
        <div class="pillar-card">
            <span class="pillar-icon">📊</span>
            <h3>Sentiment Logging</h3>
            <p>AI-integrated support check-ins that track emotional trends and recovery milestones over time.</p>
        </div>
    </section>

    <!-- 3. Interface Showcase -->
    <section class="interface-section">
        <div class="screenshot-box item-home">
            <img src="{{site.baseurl}}/images/homepage.png" alt="Homepage">
            <span class="label">Primary Dashboard</span>
        </div>
        <div class="screenshot-box item-prog">
            <img src="{{site.baseurl}}/images/programs.png" alt="Programs">
            <span class="label">Program Discovery</span>
        </div>
        <div class="screenshot-box item-assist">
            <img src="{{site.baseurl}}/images/assistant.png" alt="Assistant">
            <span class="label">AI Onboarding Guide</span>
        </div>
        <div class="screenshot-box item-aa">
            <img src="{{site.baseurl}}/images/aa.png" alt="AA Program">
            <span class="label">Specialized Curriculum</span>
        </div>
        <div class="screenshot-box item-prof">
            <img src="{{site.baseurl}}/images/profile.png" alt="Profile">
            <span class="label">Analytics</span>
        </div>
        <div class="screenshot-box item-meet">
            <img src="{{site.baseurl}}/images/meetings.png" alt="Meetings">
            <span class="label">Scheduling</span>
        </div>
    </section>

    <!-- 4. Security & Tech -->
    <section class="trust-strip">
        <div class="stat-item">
            <span class="stat-icon">🛡️</span>
            <div class="stat-text">Security Standard <strong>HIPAA-Compliant</strong></div>
        </div>
        <div class="stat-item">
            <span class="stat-icon">🔋</span>
            <div class="stat-text">Data Engine <strong>SQLite Relational</strong></div>
        </div>
        <div class="stat-item">
            <span class="stat-icon">🧠</span>
            <div class="stat-text">AI Logic <strong>Sentiment Aware</strong></div>
        </div>
        <div class="stat-item">
            <span class="stat-icon">🌐</span>
            <div class="stat-text">Availability <strong>Active Network</strong></div>
        </div>
    </section>

    <!-- 5. CTA -->
    <footer class="sentri-footer">
        <div class="btn-group">
            <a href="https://sentri-prc.opencodingsociety.com/" class="sentri-btn btn-blue">Launch User UI</a>
            <a href="https://sentri.opencodingsociety.com/" class="sentri-btn btn-outline">Admin Portal</a>
        </div>
        <p style="color: var(--text-muted); font-size: 0.8rem; margin-top: 25px;">Poway Recovery Center × Open Coding Society</p>
    </footer>
</div>