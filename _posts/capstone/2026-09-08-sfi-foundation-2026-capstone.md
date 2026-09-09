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

<br>

<div class="ocs__links ocs__links--wide">
    <a class="ocs__btn ocs__btn--icon alert-green iridescent" href="https://github.com/ruhaanb622/SFI-Frontend" target="_blank" rel="noreferrer noopener">
        <span class="ocs__btn-icon" aria-hidden="true">
            <svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
            </svg>
        </span>
        <span>Frontend Repository</span>
    </a>
    <a class="ocs__btn ocs__btn--icon alert-yellow iridescent" href="https://github.com/ruhaanb622/SFI-Backend" target="_blank" rel="noreferrer noopener">
        <span class="ocs__btn-icon" aria-hidden="true">
            <svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
            </svg>
        </span>
        <span>Backend Repository</span>
    </a>
</div>

<br>

---

## Core experience

> Four connected parts of the user journey, from finding a standard to returning to saved gear later.

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

<br>

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

<br>

---

## System flow

> A simple view of how the browser, API, data layer, and assisted-discovery tools work together.

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

<br>

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

<br>

<div class="ocs__links ocs__links--wide">
    <a class="ocs__btn pill alert-green fill" href="https://github.com/ruhaanb622/SFI-Frontend" target="_blank" rel="noreferrer noopener">Explore Frontend ↗</a>
    <a class="ocs__btn pill alert-yellow fill" href="https://github.com/ruhaanb622/SFI-Backend" target="_blank" rel="noreferrer noopener">Explore Backend ↗</a>
</div>

<br>

---

## Team

> Two Scrum Masters guide project coordination while four technologists/developers build and refine the product experience.

### Scrum Masters

<div class="ocs__grid ocs__grid--standard cols-2">
    <div class="ocs__grid-cell ocs__grid-cell--header">Project Leadership</div>
    <div class="ocs__grid-cell ocs__grid-cell--accent">
        <strong>Ruhaan Bansal</strong>
        <p>Scrum Master</p>
    </div>
    <div class="ocs__grid-cell ocs__grid-cell--accent">
        <strong>Ishan Jha</strong>
        <p>Scrum Master</p>
    </div>
</div>

<br>

### Technologists / Developers

<div class="ocs__grid ocs__grid--card">
    <div class="ocs__grid-cell">
        <strong>Arya Taghavi Zargar</strong>
        <p>Technologist / Developer</p>
    </div>
    <div class="ocs__grid-cell">
        <strong>Deyar Raissadat</strong>
        <p>Technologist / Developer</p>
    </div>
    <div class="ocs__grid-cell">
        <strong>Ishan Khandelwal</strong>
        <p>Technologist / Developer</p>
    </div>
    <div class="ocs__grid-cell">
        <strong>Vayun Shekhar</strong>
        <p>Technologist / Developer</p>
    </div>
</div>

<br>

<div class="ocs__links ocs__links--wide">
    <a class="ocs__btn large iridescent" href="https://github.com/ruhaanb622/SFI-Frontend" target="_blank" rel="noreferrer noopener">View Frontend Repository</a>
    <a class="ocs__btn large iridescent" href="https://github.com/ruhaanb622/SFI-Backend" target="_blank" rel="noreferrer noopener">View Backend Repository</a>
</div>
