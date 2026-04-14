---
toc: false
layout: post
title: "Sentri: The AI-Driven Recovery Ecosystem"
description: A comprehensive digital platform for the Poway Recovery Center featuring automated program matching, personalized meeting scheduling, and integrated sentiment-aware chat history.
permalink: /capstone/sentri/
---

{% include sentri-infographic.html %}

<br>

### Project Overview
Sentri is a full-stack recovery management system for the **Poway Recovery Center**. It’s your "Digital Sponsor." 

* **AI-Driven Matching:** Sentri analyzes your needs and matches you with the perfect recovery program.
* **Personalized Scheduling:** Get a tailored meeting calendar for AA, NA, GA, and more.
* **Emotional Tracking:** Review your journey with integrated chat history and sentiment analysis.
* **Secure & Private:** HIPAA-compliant architecture ensures your data stays safe.

### Core Ecosystem Features
*   **PRC Guide (AI Matcher):** Calculates "Match Percentages" to find your ideal recovery program.
*   **Dynamic Meeting Calendar:** Real-time scheduling tailored to your recovery journey.
*   **Integrated Chat History:** Track emotional trends with secure, logged conversations.
*   **HIPAA-Compliant:** Your data is encrypted and confidential.
*   **Program Discovery Hub:** Explore 8+ recovery programs with clear definitions.

### Project Interfaces
*   **Sentri Client App:** Your dashboard for personalized recovery.
*   **Sentri Admin Portal:** Tools for counselors to manage programs.

<style>
/* (Keep your existing CSS styles here - they are great) */
.sentri-container {
    background-color: #020617; 
    color: #f1f5f9;
    font-family: 'Inter', sans-serif;
    padding: 20px;
    border-radius: 24px;
}
/* ... [Rest of your CSS] ... */
</style>

<div class="sentri-container">
    <div class="sentri-info-box">
        <div class="sentri-badge">Ecosystem Status: Active Deployment</div>
        <p style="color: #94a3b8; max-width: 800px; margin: 0 auto; font-size: 1.1em;">
            Sentri integrates the <strong>Poway Recovery Center</strong> mission with algorithmic precision. No one walks the path to sobriety alone.
        </p>
    </div>

    <div class="sentri-grid">
        <!-- Sidebar with Links -->
        <div class="col-left">
            <div class="sentri-logo-box">
                <img src="{{site.baseurl}}/images/capstone/sentri.png" alt="Sentri Logo" style="max-height: 80%; filter: drop-shadow(0 0 8px #3b82f655);">
            </div>
            
            <div class="ui-links">
                <a href="https://sentri-prc.opencodingsociety.com/" class="ui-btn btn-fe">Sentri User UI</a>
                <a href="https://sentri.opencodingsociety.com/" class="ui-btn btn-admin">Sentri Admin UI</a>
            </div>
            <p style="font-size: 10px; color: #64748b; margin-top: 20px; text-transform: uppercase; letter-spacing: 1px;">Build v3.1.0-Stable</p>
        </div>

        <!-- Middle: Core Features -->
        <div class="col-mid">
            <h1 class="proj-title">SENTRI</h1>
            <p class="proj-subtitle">Recovery Matching & Tracking</p>

            <div class="feature-item"><span class="ai-icon">✓</span><span><strong>PRC Guide matching:</strong> Find your best-fit recovery program.</span></div>
            <div class="feature-item"><span class="ai-icon">✓</span><span><strong>Personalized Calendar:</strong> Your recovery meetings, your schedule.</span></div>
            <div class="feature-item"><span class="ai-icon">✓</span><span><strong>Integrated Chat History:</strong> Track your emotional stability over time.</span></div>
            <div class="feature-item"><span class="ai-icon">✓</span><span><strong>Database Persistence:</strong> Securely save milestones and history.</span></div>
        </div>

        <!-- Right: Technical Logic -->
        <div class="col-right">
            <div class="section-header">Backend Intelligence</div>
            <p style="font-size: 0.85em; color: #94a3b8; line-height: 1.6;">
                The <strong>Matching Algorithm</strong> calculates compatibility scores for 12-step programs. The <strong>Data Engine</strong> links user IDs with meeting registrations and <strong>Chat Log</strong> history.
            </p>
            <div class="section-header" style="margin-top:20px;">Security Standard</div>
            <div style="background: rgba(59, 130, 246, 0.1); border: 1px solid #3b82f6; padding: 15px; border-radius: 12px; font-size: 0.8em; color: #3b82f6; font-weight: 600;">
                All chat history and recovery data is encrypted and HIPAA-compliant.
            </div>
        </div>
    </div>
</div>