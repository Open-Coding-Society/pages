---
microblog: true
toc: false
layout: post
title: Poway Neighborhood Emergency Corps 2026–2027
description: CSP capstone continuing the PNEC project with proposed improvements to mobile access, neighborhood lookup, and volunteer tools.
permalink: /capstone/powaynec-2026-2027/
year: "2026-2027"
---

> **CSP 2026–2027 · Samanvi, Joan, and Ainsley.** We are continuing the previous PNEC team's project. The improvements below are proposals based on their handoff, pending team and stakeholder review.

<div class="ocs__links ocs__links--wide">
    <a class="ocs__btn alert-green fill large" href="{% post_url 2026-03-06-powaynec-capstone %}">Previous Team's Handoff</a>
    <a class="ocs__btn large" href="https://pnec.opencodingsociety.com" target="_blank" rel="noopener noreferrer">Existing Project Site</a>
    <a class="ocs__btn large" href="https://github.com/whitelunarium/Beasts_FrontEnd" target="_blank" rel="noopener noreferrer">Inherited Frontend</a>
    <a class="ocs__btn large" href="https://github.com/whitelunarium/Beasts_Flask" target="_blank" rel="noopener noreferrer">Inherited Backend</a>
</div>

## Project direction

<div class="ocs__grid ocs__grid--card cols-3">
    <div class="ocs__grid-cell ocs__grid-cell--accent">
        <h3>Who it serves</h3>
        <p>Poway Neighborhood Emergency Corps supports community preparedness. This project focuses on residents finding neighborhood information and volunteers maintaining useful resources.</p>
    </div>
    <div class="ocs__grid-cell">
        <h3>What we inherit</h3>
        <p>The previous team's handoff describes Risk Watch, a preparedness chatbot, a neighborhood map, member accounts, and a browser-based site editor. These are inherited features to review, not new work completed by our team.</p>
    </div>
    <div class="ocs__grid-cell">
        <h3>What needs improvement</h3>
        <p>The handoff identifies mobile accessibility, address lookup, coordinator tools, and editor usability as opportunities. Our first step is to reproduce these workflows and select a small improvement with PNEC.</p>
    </div>
</div>

## Proposed improvements

<div class="ocs__grid ocs__grid--card cols-3">
    <div class="ocs__grid-cell ocs__grid-cell--accent">
        <h3>Mobile access</h3>
        <p>Make the neighborhood and preparedness pages easier to read and navigate on phones.</p>
        <p><strong>Proposed acceptance check:</strong> at 320px and 390px, text and controls remain usable without horizontal scrolling; keyboard focus remains visible.</p>
    </div>
    <div class="ocs__grid-cell">
        <h3>Neighborhood lookup</h3>
        <p>Explore address-based lookup so residents can find their neighborhood and coordinator without already knowing their block name.</p>
        <p><strong>Proposed acceptance check:</strong> a supported address shows the matching neighborhood; an unmatched address gives a clear message and preserves manual map navigation.</p>
    </div>
    <div class="ocs__grid-cell">
        <h3>Volunteer updates</h3>
        <p>Review the existing editor with volunteers and simplify one frequent task, such as updating an event date.</p>
        <p><strong>Proposed acceptance check:</strong> an authorized volunteer can review and save a change, while a failed save keeps the draft and displays a useful error.</p>
    </div>
</div>

## Team and review process

**Team:** Samanvi, Joan, and Ainsley. Feature ownership and Scrum responsibilities will be agreed during planning before implementation begins.

<div class="ocs__grid ocs__grid--card cols-3">
    <div class="ocs__grid-cell">
        <h3>1 · Investigate and scope</h3>
        <p>Review the inherited repositories and handoff, reproduce a user problem, and discuss priorities with PNEC. Record the selected scope, owner, and acceptance checks in an issue.</p>
    </div>
    <div class="ocs__grid-cell ocs__grid-cell--accent">
        <h3>2 · Build and test</h3>
        <p>Implement one agreed improvement in a small branch. Test the main workflow, failure cases, keyboard navigation, and phone layouts. Keep screenshots and results with the issue.</p>
    </div>
    <div class="ocs__grid-cell">
        <h3>3 · Review and revise</h3>
        <p>Open a focused PR with the problem, changes, and actual test results. Have a teammate review it, address feedback, and record the next iteration before the class review.</p>
    </div>
</div>

## Evidence for the next iteration

This PR updates the capstone overview only. Feature implementation and stakeholder validation remain future work. Subsequent updates should link the agreed planning issue, each teammate's contributions, test results, and review feedback.
