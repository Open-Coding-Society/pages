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

> **Student capstone · In development.** This project explores a clearer way to discover and organize motorsports safety information. It is not an official SFI Foundation product and does not replace official SFI standards, labels, or PDF documents.

<div class="ocs__grid ocs__grid--standard cols-2">
    <div class="ocs__grid-cell ocs__grid-cell--header">SFI Foundation · 2026–2027</div>

    <div class="ocs__grid-cell ocs__grid-cell--accent">
        <strong>Making safety information easier to use</strong>
        <p>A continuation of our motorsports safety modernization prototype, focused on helping people search standards, understand likely matches, organize equipment, and revisit important certification information.</p>
        <p><strong>Experience:</strong> discover → understand → inspect → save → revisit</p>
    </div>

    <div class="ocs__grid-cell">
        <img src="{{ '/images/capstone/sfi-foundation-2026-27.png' | relative_url }}" alt="SFI Foundation capstone project logo" loading="lazy">
        <p><strong>Project focus:</strong> searchable standards, assisted discovery, equipment recognition, personal gear tracking, and staff-oriented workflows.</p>
    </div>
</div>

<div class="ocs__links ocs__links--wide">
    <a class="ocs__btn iridescent" href="https://github.com/ruhaanb622/SFI-Frontend" target="_blank" rel="noreferrer noopener">Frontend Repository ↗</a>
    <a class="ocs__btn iridescent" href="https://github.com/ruhaanb622/SFI-Backend" target="_blank" rel="noreferrer noopener">Backend Repository ↗</a>
</div>

---

## Core experience

<div class="ocs__grid ocs__grid--card">
    <div class="ocs__grid-cell ocs__grid-cell--accent">
        <strong>01 · Search standards</strong>
        <p>Browse categories or search specification records in plain language instead of relying only on exact specification numbers.</p>
    </div>

    <div class="ocs__grid-cell">
        <strong>02 · Describe a part</strong>
        <p>A TF-IDF + LinearSVC classifier suggests likely specification matches from a free-text equipment description.</p>
    </div>

    <div class="ocs__grid-cell">
        <strong>03 · Inspect equipment</strong>
        <p>Browser-side TensorFlow.js models explore image and camera-based equipment recognition as an assistive discovery tool.</p>
    </div>

    <div class="ocs__grid-cell ocs__grid-cell--accent">
        <strong>04 · Track and revisit</strong>
        <p>Users organize personal gear, revisit certification information, and ask the site chatbot questions about the available specification data.</p>
    </div>
</div>

---

## From problem to product direction

<div class="ocs__grid ocs__grid--standard cols-2">
    <div class="ocs__grid-cell ocs__grid-cell--header">Why we are building it</div>

    <div class="ocs__grid-cell ocs__grid-cell--accent">
        <strong>Current challenge</strong>
        <p>Users can face dense lists, unfamiliar specification numbers, and multiple documents when determining which safety standard applies to a piece of equipment.</p>
    </div>

    <div class="ocs__grid-cell">
        <strong>Project direction</strong>
        <p>Bring structured specification data, plain-language search, ML suggestions, gear tracking, and guided tools into one consistent frontend backed by a Flask API.</p>
    </div>
</div>

---

## System flow

<div class="ocs__grid ocs__grid--standard cols-4">
    <div class="ocs__grid-cell ocs__grid-cell--header">One connected full-stack workflow</div>

    <div class="ocs__grid-cell ocs__grid-cell--accent">
        <strong>1 · Browser</strong>
        <p>Jekyll and JavaScript provide search, equipment detection, My Gear, authentication views, and chatbot interactions.</p>
    </div>

    <div class="ocs__grid-cell">
        <strong>2 · Flask API</strong>
        <p>Backend routes handle authentication, SFI specification endpoints, classifier requests, chatbot requests, and gear operations.</p>
    </div>

    <div class="ocs__grid-cell">
        <strong>3 · Data layer</strong>
        <p>SQLAlchemy and SQLite organize structured specification records and user-linked prototype data during development.</p>
    </div>

    <div class="ocs__grid-cell ocs__grid-cell--accent">
        <strong>4 · Assisted discovery</strong>
        <p>LinearSVC matching, TensorFlow.js detection, and Gemini-assisted questions help users narrow down relevant information.</p>
    </div>
</div>

> The goal is a single workflow where the browser experience and backend services can evolve together instead of feeling like separate demos.

---

## Technical foundation

<div class="ocs__grid ocs__grid--card">
    <div class="ocs__grid-cell">
        <strong>Frontend</strong>
        <p>Jekyll + JavaScript for static content and interactive client-side features.</p>
    </div>

    <div class="ocs__grid-cell ocs__grid-cell--accent">
        <strong>Backend</strong>
        <p>Python Flask APIs for authentication, specifications, chatbot requests, and gear operations.</p>
    </div>

    <div class="ocs__grid-cell">
        <strong>Machine learning</strong>
        <p>TF-IDF + LinearSVC text classification and TensorFlow.js experiments for assisted equipment discovery.</p>
    </div>

    <div class="ocs__grid-cell ocs__grid-cell--accent">
        <strong>Data + assistant</strong>
        <p>SQLAlchemy persistence with SQLite in development, plus a Gemini-backed chatbot using compact specification context from the backend.</p>
    </div>
</div>

---

## Team

<div class="ocs__grid ocs__grid--card">
    <div class="ocs__grid-cell"><strong>Ruhaan Bansal</strong></div>
    <div class="ocs__grid-cell"><strong>Arya Taghavi Zargar</strong></div>
    <div class="ocs__grid-cell"><strong>Deyar Raissadat</strong></div>
    <div class="ocs__grid-cell"><strong>Ishan Jha</strong></div>
    <div class="ocs__grid-cell"><strong>Ishan Khandelwal</strong></div>
    <div class="ocs__grid-cell"><strong>Vayun Shekhar</strong></div>
</div>

<div class="ocs__links">
    <a class="ocs__btn small iridescent" href="https://github.com/ruhaanb622/SFI-Frontend" target="_blank" rel="noreferrer noopener">Explore Frontend</a>
    <a class="ocs__btn small iridescent" href="https://github.com/ruhaanb622/SFI-Backend" target="_blank" rel="noreferrer noopener">Explore Backend</a>
</div>
