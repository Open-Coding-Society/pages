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
Sentri is a full-stack recovery management system built for the **Poway Recovery Center**. Moving beyond simple sobriety clocks, Sentri serves as a "Digital Sponsor." 

The platform utilizes a multi-step **PRC Guide**—an AI-driven onboarding system—to analyze a user's specific needs (Substance, Family, or Behavioral support) and match them with the ideal recovery program (AA, NA, GA, etc.). Once matched, Sentri generates a personalized **Meeting Calendar** and a **Live Recovery Dashboard** that tracks saved meetings and **Integrated Chat History**, providing users with a comprehensive view of their emotional journey in a HIPAA-compliant environment.

### Core Ecosystem Features
*   **The PRC Guide (AI Matcher):** A diagnostic onboarding flow that calculates "Match Percentages" between users and programs like ACA, Alateen, or SA based on behavioral input.
*   **Dynamic Meeting Calendar:** A personalized scheduling interface that pulls real-time recovery meetings into a clean, weekly view tailored to the user’s selected programs and saved to a relational database.
*   **Integrated Chat History & Sentiment Logging:** A secure messaging interface that logs AI-driven support conversations, allowing users to review past check-ins and monitor emotional trends over time.
*   **HIPAA-Compliant Architecture:** A secure authentication system ensuring that sensitive recovery data and chat logs remain strictly confidential.
*   **Program Discovery Hub:** A centralized library of 8+ specialized recovery programs, providing users with the definitions and differences between "Open" and "Closed" meetings.

### Project Interfaces
*   ** Sentri Client-Facing Application** — *The primary user dashboard, PRC Guide, and personalized meeting schedule.*
*   ** Sentri Administrator & Counselor Portal** — *The backend management system for Poway Recovery Center staff to oversee program health.*

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
                <a href="https://sentri-prc.opencodingsociety.com/" class="ui-btn btn-fe">Sentri User UI</a>
                <a href="https://sentri.opencodingsociety.com/" class="ui-btn btn-admin">Sentri Admin UI</a>
            </div>
            <p style="font-size: 10px; color: #64748b; margin-top: 20px; text-transform: uppercase; letter-spacing: 1px;">Build v3.1.0-Stable</p>
        </div>

        <!-- Middle: Core Features -->
        <div class="col-mid">
            <h1 class="proj-title">SENTRI</h1>
            <p class="proj-subtitle">Recovery Matching & Tracking</p>

            <div class="feature-item"><span class="ai-icon">✓</span><span><strong>PRC Guide matching:</strong> Multi-step onboarding quiz to identify the best-fit recovery program.</span></div>
            <div class="feature-item"><span class="ai-icon">✓</span><span><strong>Personalized Calendar:</strong> Dynamic storage and retrieval of AA, NA, and GA meetings.</span></div>
            <div class="feature-item"><span class="ai-icon">✓</span><span><strong>Integrated Chat History:</strong> Real-time logging of AI support conversations to track emotional stability.</span></div>
            <div class="feature-item"><span class="ai-icon">✓</span><span><strong>Database Persistence:</strong> All user milestones and history are saved to a secure relational SQLite backend.</span></div>
        </div>

        <!-- Right: Technical Logic -->
        <div class="col-right">
            <div class="section-header">Backend Intelligence</div>
            <p style="font-size: 0.85em; color: #94a3b8; line-height: 1.6;">
                The <strong>Matching Algorithm</strong> determines compatibility scores for 12-step programs. The <strong>Data Engine</strong> manages a complex relational schema to link user IDs with specific meeting registrations and <strong>Chat Log</strong> history for long-term progress tracking.
            </p>
            <div class="section-header" style="margin-top:20px;">Security Standard</div>
            <div style="background: rgba(59, 130, 246, 0.1); border: 1px solid #3b82f6; padding: 15px; border-radius: 12px; font-size: 0.8em; color: #3b82f6; font-weight: 600;">
                All chat history and recovery data is encrypted and HIPAA-compliant, protecting identity across the entire PRC network.
            </div>
        </div>
    </div>
</div>