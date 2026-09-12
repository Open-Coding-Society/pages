---
microblog: true
toc: false
layout: post
title: SRFSC Website Redesign Examples
description: Visual mockup examples showing how the Scripps Ranch Fire Safe Council website could be redesigned for clarity, urgency, and action.
permalink: /capstone/srfsc
author: Krish Kelageri, Jasan Boprai, Shourya Patel
year: "2026-2027"
---

> The SRFSC homepage can be more direct and action-focused. The strongest example is to make the mission, volunteer path, and urgent neighborhood context visible immediately.

<!-- markdownlint-disable MD033 MD010 MD012 -->
<div class="ocs__grid ocs__grid--standard cols-2" style="margin-bottom: 1.5rem;">
    <div class="ocs__grid-cell ocs__grid-cell--header">Strengths vs Improvement</div>
    <div class="ocs__grid-cell ocs__grid-cell--accent">
        <strong>Clear Mission Messaging</strong>
        <p>Visitors should understand the wildfire risk and the council’s role before exploring the rest of the page.</p>
        <a class="ocs__btn alert-green fill small" href="{{ site.baseurl }}/capstone/srfsc/#mission">
            View Example
        </a>
    </div>
    <div class="ocs__grid-cell">
        <strong>Volunteer Path</strong>
        <p>Action buttons are easy to find and connect users directly to volunteering and donations.</p>
        <a class="ocs__btn alert-yellow fill small" href="{{ site.baseurl }}/capstone/srfsc/#actions">
            Join Us
        </a>
    </div>
    <div class="ocs__grid-cell ocs__grid-cell--accent">
        <strong>Community Trust</strong>
        <p>Local context, impact stories, and partner credibility make the council feel more established and reliable.</p>
        <a class="ocs__btn alert-green fill small" href="{{ site.baseurl }}/capstone/srfsc/#updates">
            Updates
        </a>
    </div>
    <div class="ocs__grid-cell">
        <strong>Program Clarity</strong>
        <p>Grouping fuel reduction, home hardening, and education into clear sections reduces friction and confusion.</p>
        <a class="ocs__btn alert-yellow fill small" href="{{ site.baseurl }}/capstone/srfsc/#programs">
            Program View
        </a>
    </div>
</div>

<div class="ocs__grid ocs__grid--standard cols-3" style="margin-bottom: 1.5rem;">
    <div class="ocs__grid-cell ocs__grid-cell--header">Key Opportunities</div>
    <div class="ocs__grid-cell ocs__grid-cell--accent">
        <strong>Priority First</strong>
        <p>Lead with wildfire preparedness, hazard reduction, and neighborhood action.</p>
    </div>
    <div class="ocs__grid-cell">
        <strong>Shared Visibility</strong>
        <p>Keep local news, volunteering, and donations in a single clear path.</p>
    </div>
    <div class="ocs__grid-cell ocs__grid-cell--accent">
        <strong>Clearer Identity</strong>
        <p>Use a stronger brand palette and cleaner structure to feel current and trustworthy.</p>
    </div>
</div>

<div class="ocs__grid ocs__grid--standard cols-3" style="margin-bottom: 1.5rem;">
    <div class="ocs__grid-cell ocs__grid-cell--header">What the page should emphasize</div>
    <div class="ocs__grid-cell ocs__grid-cell--accent">
        <strong>Urgency</strong>
        <p>Use a direct wildfire-risk message early so visitors understand why this matters immediately.</p>
    </div>
    <div class="ocs__grid-cell">
        <strong>Action</strong>
        <p>Volunteer, donate, and join events should be visible in one glance instead of buried in navigation.</p>
    </div>
    <div class="ocs__grid-cell ocs__grid-cell--accent">
        <strong>Trust</strong>
        <p>Neighborhood impact, local partnerships, and clear communication make the council feel credible and active.</p>
    </div>
</div>

<div style="margin-top: 1rem; margin-bottom: 1.5rem;">
    <a class="ocs__btn alert-red fill small" href="https://www.srfsc.org/" target="_blank" rel="noopener noreferrer">
        Visit the original page
    </a>
</div>

> A stronger homepage should feel calm, urgent, and clear at the same time: the message is important, the next step is obvious, and the local community feels included.

<style>
  .srfsc-mermaid-wrap {
    width: 100%;
    overflow-x: auto;
    margin: 1.5rem 0;
    padding: 0.5rem 0;
    border-radius: 12px;
    border: 1px solid rgba(23, 59, 47, 0.08);
  }

  .srfsc-mermaid-wrap .mermaid {
    min-width: 0;
    display: flex;
    justify-content: center;
  }

  .srfsc-mermaid-wrap .mermaid svg {
    max-width: 100%;
    height: auto;
    display: block;
  }
</style>

<div class="srfsc-mermaid-wrap">
  <div class="mermaid">
    flowchart TD
        A[Visitor lands on page] --> B{Understand the risk?}
        B -->|Yes| C[Read mission + local context]
        B -->|No| D[Improve hero message]
        C --> E[See call-to-action buttons]
        D --> E
        E --> F[Volunteer or donate]
        E --> G[Learn more about programs]
        F --> H[Community action grows]
        G --> H

        style A fill:#173b2f,color:#ffffff,stroke:#173b2f
        style C fill:#2f6d4c,color:#ffffff,stroke:#2f6d4c
        style E fill:#d8572a,color:#ffffff,stroke:#d8572a
        style H fill:#49615b,color:#ffffff,stroke:#49615b
  </div>
</div>
<!-- markdownlint-enable MD033 MD010 MD012 -->

## Powered by OCS grids and buttons

[Buttons]({{site.baseurl}}/index2) | [Grids]({{site.baseurl}}/index4)
