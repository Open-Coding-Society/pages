---
microblog: true
toc: false
layout: post
title: SFI Foundation 2026–27
description: >
  CSP 2026–27 capstone continuing the SFI Foundation prototype with searchable
  motorsports safety standards, ML-assisted discovery, equipment detection,
  personal gear tracking, and staff tools.
categories: [Capstone]
permalink: /capstone/sfi-foundation/
---

> A continuation of our motorsports safety modernization prototype — making SFI standards easier to search, understand, personalize, and maintain. This is a student capstone, not an official SFI Foundation product or a replacement for official SFI standards, labels, or PDF documents.

<div class="ocs__grid ocs__grid--standard cols-2" style="margin-bottom: 1.5rem;">
    <div class="ocs__grid-cell ocs__grid-cell--header">Core Experience</div>

    <div class="ocs__grid-cell ocs__grid-cell--accent">
        <strong>Search Standards</strong>
        <p>Browse categories or search specification records in plain language instead of relying only on exact spec numbers.</p>
        <a class="ocs__btn small iridescent" href="https://github.com/ruhaanb622/SFI-Frontend">
            Frontend Repo
        </a>
    </div>
    <div class="ocs__grid-cell">
        <strong>Describe a Part</strong>
        <p>A TF-IDF + LinearSVC classifier suggests likely specification matches from a free-text equipment description.</p>
        <a class="ocs__btn small iridescent" href="https://github.com/ruhaanb622/SFI-Backend">
            Backend Repo
        </a>
    </div>

    <div class="ocs__grid-cell ocs__grid-cell--accent">
        <strong>Inspect Equipment</strong>
        <p>Browser-side TensorFlow.js models explore image and camera-based equipment recognition as an assistive discovery tool.</p>
        <a class="ocs__btn small iridescent" href="https://github.com/ruhaanb622/SFI-Frontend">
            Detector Code
        </a>
    </div>
    <div class="ocs__grid-cell">
        <strong>Track and Revisit</strong>
        <p>Users organize personal gear, revisit certification information, and ask the site chatbot questions about the available spec data.</p>
        <a class="ocs__btn small iridescent" href="https://github.com/ruhaanb622/SFI-Backend">
            My Gear API
        </a>
    </div>
</div>

<div class="ocs__grid ocs__grid--standard cols-2" style="margin-bottom: 1.5rem;">
    <div class="ocs__grid-cell ocs__grid-cell--header">Problem vs Direction</div>

    <div class="ocs__grid-cell ocs__grid-cell--accent">
        <strong>Current Challenge</strong>
        <p>Users face dense lists, unfamiliar specification numbers, and multiple documents when determining which safety standard applies to a piece of equipment.</p>
    </div>
    <div class="ocs__grid-cell">
        <strong>Project Direction</strong>
        <p>Combine structured spec data, plain-language search, ML suggestions, gear tracking, and guided tools into one consistent frontend backed by a Flask API.</p>
    </div>
</div>

<div class="ocs__grid ocs__grid--standard cols-2" style="margin-bottom: 1.5rem;">
    <div class="ocs__grid-cell ocs__grid-cell--header">Technical Plan</div>

    <div class="ocs__grid-cell ocs__grid-cell--accent">
        <strong>Frontend</strong>
        <p>Jekyll and JavaScript for static content plus interactive client-side features, including TensorFlow.js.</p>
    </div>
    <div class="ocs__grid-cell">
        <strong>Backend + Data</strong>
        <p>Python Flask APIs with SQLAlchemy persistence and a SQLite development database.</p>
    </div>

    <div class="ocs__grid-cell ocs__grid-cell--accent">
        <strong>Assisted Discovery</strong>
        <p>TF-IDF and LinearSVC text classification for spec matching.</p>
    </div>
    <div class="ocs__grid-cell">
        <strong>AI Assistant</strong>
        <p>A Gemini-backed chatbot answering questions from compact SFI specification context supplied by the backend.</p>
    </div>
</div>

> The capstone spans the browser experience and backend services so the team can iterate on a complete full-stack workflow.

<div class="ocs__grid ocs__grid--standard cols-2" style="margin-bottom: 1.5rem;">
    <div class="ocs__grid-cell ocs__grid-cell--header">System Flow</div>

    <div class="ocs__grid-cell ocs__grid-cell--accent">
        <strong>Jekyll + JavaScript</strong>
        <p>Search UI, equipment detector, My Gear, auth views, and the chatbot across responsive pages.</p>
    </div>
    <div class="ocs__grid-cell">
        <strong>Flask API</strong>
        <p>Authentication, SFI spec endpoints, the classifier, chatbot, and gear operations.</p>
    </div>

    <div class="ocs__grid-cell ocs__grid-cell--accent">
        <strong>SQLAlchemy + SQLite</strong>
        <p>Structured specification records and user-linked prototype data.</p>
    </div>
    <div class="ocs__grid-cell">
        <strong>ML + AI helpers</strong>
        <p>LinearSVC matching, TensorFlow.js detection, and Gemini-assisted questions.</p>
    </div>
</div>

<p style="display:flex;flex-wrap:wrap;gap:.7rem;margin-bottom:1.5rem;">
    <a class="glowOnHover" style="padding:.65rem 1.15rem;text-decoration:none;display:inline-block;" href="https://github.com/ruhaanb622/SFI-Frontend">Frontend Repository ↗</a>
    <a class="glowOnHover" style="padding:.65rem 1.15rem;text-decoration:none;display:inline-block;" href="https://github.com/ruhaanb622/SFI-Backend">Backend Repository ↗</a>
</p>

**Team:** Ruhaan Bansal, Arya Taghavi Zargar, Deyar Raissadat, Ishan Jha, Ishan Khandelwal, Vayun Shekhar

**Powered by OCS grids and buttons**

[Buttons]({{site.baseurl}}/index2) | [Grids]({{site.baseurl}}/index4)
