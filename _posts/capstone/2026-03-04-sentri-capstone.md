---
toc: false
layout: post
title: "Sentri: The AI-Driven Recovery Ecosystem"
description: A comprehensive digital platform for the Poway Recovery Center featuring automated program matching, personalized meeting scheduling, and milestone tracking.
permalink: /capstone/sentri/
---

{% include sentri-infographic.html %}

<br>

### Project Overview
Sentri is a full-stack recovery management system built for the **Poway Recovery Center**. Moving beyond simple sobriety clocks, Sentri serves as a "Digital Sponsor." 

The platform utilizes a multi-step **PRC Guide**—an AI-driven onboarding system—to analyze a user's specific needs (Substance, Family, or Behavioral support) and match them with the ideal recovery program (AA, NA, GA, etc.). Once matched, Sentri generates a personalized **Meeting Calendar** and a **Recovery Dashboard** to track streaks and program milestones in a HIPAA-compliant environment.

### Core Ecosystem Features
*   **The PRC Guide (AI Matcher):** A diagnostic onboarding flow that calculates "Match Percentages" between users and programs like ACA, Alateen, or SA based on behavioral input.
*   **Dynamic Meeting Calendar:** A personalized scheduling interface that filters global recovery meetings into a clean, weekly view tailored to the user’s selected programs.
*   **Recovery Statistics Dashboard:** High-fidelity tracking of "Meetings Attended," and "Chat History" to provide visual positive reinforcement.
*   **HIPAA-Compliant Architecture:** A secure authentication system ensuring that sensitive recovery data remains confidential and protected.
*   **Program Discovery Hub:** A centralized library of 8+ specialized recovery programs, providing users with the definitions and differences between "Open" and "Closed" meetings.

### Project Interfaces
*   ** Sentri Client-Facing Application** — *The primary user dashboard, PRC Guide, and personalized meeting schedule.*
*   ** Sentri Administrator & Counselor Portal** — *The backend management system for Poway Recovery Center staff to oversee program health.*

<style>
.sentri-container {
    background-color: #020617; 
    color: #f1f5f9;
    font-family: 'Inter', sans-serif;
    padding: 20px;
    border-radius: 24px;
}

.sentri-info-box {
    background: radial-gradient(circle at center, #0f172a 0%, #020617 100%);
    border: 1px solid #3b82f633;
    border-radius: 24px;
    padding: 40px;
    text-align: center;
    margin-bottom: 30px;
    position: relative;
    overflow: hidden;
}

/* Scanning Line Animation */
.sentri-info-box::after {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, #3b82f6, transparent);
    animation: scan 6s linear infinite;
}

@keyframes scan {
    0% { top: 0%; opacity: 0; }
    50% { opacity: 0.5; }
    100% { top: 100%; opacity: 0; }
}

.sentri-badge {
    background-color: rgba(59, 130, 246, 0.1);
    color: #3b82f6;
    border: 1px solid #3b82f6;
    padding: 8px 25px;
    border-radius: 8px;
    font-size: 12px;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 2px;
    display: inline-block;
    margin-bottom: 20px;
}

.sentri-grid {
    display: grid;
    grid-template-columns: 220px 1fr 1fr; 
    gap: 25px;
    background-color: #0f172a;
    border: 1px solid #1e293b;
    border-radius: 24px;
    padding: 30px;
}

.col-left {
    text-align: center;
    border-right: 1px solid #1e293b;
    padding-right: 20px;
}

.sentri-logo-box {
    background: #020617;
    border: 2px solid #3b82f622;
    border-radius: 16px;
    padding: 15px; 
    height: 120px; 
    margin-bottom: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
}

.ui-links {
    margin-top: 20px;
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.link-label {
    font-size: 10px;
    color: #64748b;
    text-transform: uppercase;
    font-weight: bold;
    margin-bottom: -8px;
}

.ui-btn {
    display: block;
    padding: 12px;
    border-radius: 8px;
    font-size: 11px;
    font-weight: bold;
    text-decoration: none;
    text-transform: uppercase;
    transition: 0.3s;
    text-align: center;
}

.btn-fe { background: #3b82f6; color: #fff; }
.btn-admin { border: 1px solid #3b82f6; color: #3b82f6; }
.ui-btn:hover { opacity: 0.8; transform: translateY(-2px); box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3); }

.proj-title { font-size: 2.5em; font-weight: 900; margin: 0; color: #fff; letter-spacing: -1px;}
.proj-subtitle { color: #3b82f6; font-size: 0.9em; font-weight: 700; margin-bottom: 25px; text-transform: uppercase; }

.section-header {
    font-size: 1em;
    font-weight: 800;
    margin-bottom: 15px;
    color: #fff;
    text-transform: uppercase;
    border-left: 4px solid #3b82f6;
    padding-left: 15px;
}

.feature-item { margin-bottom: 12px; font-size: 0.9em; display: flex; color: #cbd5e1; line-height: 1.4; }
.ai-icon { color: #3b82f6; margin-right: 10px; font-weight: bold; }

@media (max-width: 1024px) {
    .sentri-grid { grid-template-columns: 1fr; }
    .col-left { border-right: none; padding-bottom: 20px; border-bottom: 1px solid #1e293b; }
}
</style>

<div class="sentri-container">
    <div class="sentri-info-box">
        <div class="sentri-badge">Ecosystem Status: Active Deployment</div>
        <p style="color: #94a3b8; max-width: 800px; margin: 0 auto; font-size: 1.1em;">
            Integrating the <strong>Poway Recovery Center</strong> mission with algorithmic precision. Sentri maps user needs to recovery programs, ensuring no one walks the path to sobriety alone.
        </p>
    </div>

    <div class="sentri-grid">
        <!-- Sidebar with Links -->
        <div class="col-left">
            <div class="sentri-logo-box">
                <img src="{{site.baseurl}}/images/capstone/sentri.png" alt="Sentri Logo" style="max-height: 80%; filter: drop-shadow(0 0 8px #3b82f655);">
            </div>
            
            <div class="ui-links">
                
                <a href="#" class="ui-btn btn-fe">Sentri User UI</a>
                
               
                <a href="#" class="ui-btn btn-admin">Sentri Admin UI</a>
            </div>
            <p style="font-size: 10px; color: #64748b; margin-top: 20px; text-transform: uppercase; letter-spacing: 1px;">Build v3.0.0-FigmaAlpha</p>
        </div>

        <!-- Middle: Core Features from Figma -->
        <div class="col-mid">
            <h1 class="proj-title">SENTRI</h1>
            <p class="proj-subtitle">Recovery Matching & Tracking</p>

            <div class="feature-item"><span class="ai-icon">✓</span><span><strong>PRC Guide matching:</strong> Multi-step onboarding quiz to identify the best-fit recovery program.</span></div>
            <div class="feature-item"><span class="ai-icon">✓</span><span><strong>Personalized Calendar:</strong> Tailored schedule of AA, NA, and GA meetings based on user interest.</span></div>
            <div class="feature-item"><span class="ai-icon">✓</span><span><strong> Milestone Tracking:</strong> Gamified recovery stats showing "Chat History" and "Meetings Attended."</span></div>
            <div class="feature-item"><span class="ai-icon">✓</span><span><strong>Program Discovery:</strong> Educational database explaining "Open" vs "Closed" meeting protocols.</span></div>
        </div>

        <!-- Right: Technical Logic -->
        <div class="col-right">
            <div class="section-header">Backend Intelligence</div>
            <p style="font-size: 0.85em; color: #94a3b8; line-height: 1.6;">
                The <strong>Matching Algorithm</strong> processes user responses to determine compatibility scores with various 12-step programs. The <strong>Calendar Engine</strong> cross-references these programs with local PRC schedules to automate the user's weekly agenda.
            </p>
            <div class="section-header" style="margin-top:20px;">Security Standard</div>
            <div style="background: rgba(59, 130, 246, 0.1); border: 1px solid #3b82f6; padding: 15px; border-radius: 12px; font-size: 0.8em; color: #3b82f6; font-weight: 600;">
                All user data is encrypted and HIPAA-compliant, protecting identity and recovery status across the entire PRC network.
            </div>
        </div>
    </div>
</div>