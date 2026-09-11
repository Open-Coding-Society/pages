---
microblog: true
toc: false
layout: post
title: Friends of the Poway Library 2026–27
description: >
  CSP 2026–27 capstone continuing the Friends of the Poway Library prototype
  with a searchable bookstore catalog, events, newsletters, volunteer and
  donation pathways, community history, and library-themed games.
categories: [Capstone]
permalink: /capstone/poway-library-2026-27/
---

> **Student capstone · In development.** This project continues the 2025–26 Friends of the Poway Library prototype. It is a student-built concept and is not the official Friends of the Poway Library or San Diego County Library website.

<div class="ocs__grid ocs__grid--standard cols-2">
    <div class="ocs__grid-cell ocs__grid-cell--header">Friends of the Poway Library · 2026–2027</div>

    <div class="ocs__grid-cell ocs__grid-cell--accent">
        <strong>One useful home for the library community</strong>
        <p>A continuation of the previous website redesign, focused on helping visitors discover used books, find events, support the organization, and return for community resources and activities.</p>
        <p><strong>Experience:</strong> discover → explore → participate → support → return</p>
    </div>

    <div class="ocs__grid-cell">
        <img src="{{ '/images/capstone/poway_library.png' | relative_url }}" alt="Friends of the Poway Library capstone project" loading="lazy">
        <p><strong>Project focus:</strong> bookstore discovery, event access, newsletters, history, volunteering, donations, member profiles, and interactive games.</p>
    </div>
</div>

<br>

<div class="ocs__links ocs__links--wide">
    <a class="ocs__btn ocs__btn--icon alert-green iridescent" href="https://github.com/Boolean-Boyz/bb-pages" target="_blank" rel="noreferrer noopener">
        <span>Frontend Repository</span>
    </a>
    <a class="ocs__btn ocs__btn--icon alert-yellow iridescent" href="https://github.com/Boolean-Boyz/bb-flask" target="_blank" rel="noreferrer noopener">
        <span>Backend Repository</span>
    </a>
    <a class="ocs__btn iridescent" href="https://fopl.opencodingsociety.com/home" target="_blank" rel="noreferrer noopener">Previous Prototype ↗</a>
</div>

<br>

---

## Core experience

> Four connected parts of the visitor journey, from discovering what the Friends offer to supporting and revisiting the organization.

<div class="ocs__grid ocs__grid--card">
    <div class="ocs__grid-cell ocs__grid-cell--accent">
        <strong>01 · Browse the bookstore</strong>
        <p>Search and filter the bookstore catalog so visitors can discover available books before coming to the library.</p>
    </div>

    <div class="ocs__grid-cell">
        <strong>02 · Find events and news</strong>
        <p>View upcoming events and past newsletters in one place without leaving the Friends website.</p>
    </div>

    <div class="ocs__grid-cell">
        <strong>03 · Participate and support</strong>
        <p>Make volunteer opportunities, contact information, and the planned donation flow easier to find and use.</p>
    </div>

    <div class="ocs__grid-cell ocs__grid-cell--accent">
        <strong>04 · Learn and return</strong>
        <p>Explore the library's history and use library-themed games, profiles, and leaderboards that give visitors reasons to come back.</p>
    </div>
</div>

<br>

---

## From problem to product direction

<div class="ocs__grid ocs__grid--standard cols-2">
    <div class="ocs__grid-cell ocs__grid-cell--header">Why we are building it</div>

    <div class="ocs__grid-cell ocs__grid-cell--accent">
        <strong>Previous challenge</strong>
        <p>Visitors could not browse bookstore inventory online, events lived on a separate county library site, direct online donations were unavailable, and the site offered few interactive reasons to return.</p>
    </div>

    <div class="ocs__grid-cell">
        <strong>Project direction</strong>
        <p>Continue the prototype as a modern, community-facing website that brings the bookstore catalog, events, newsletters, organizational history, support pathways, and interactive features into one consistent experience.</p>
    </div>
</div>

<br>

---

## Feature foundation from 2025–26

<div class="ocs__grid ocs__grid--card">
    <div class="ocs__grid-cell">
        <strong>Searchable catalog</strong>
        <p>A bookstore inventory experience with search and filtering for easier book discovery.</p>
    </div>

    <div class="ocs__grid-cell ocs__grid-cell--accent">
        <strong>Events and newsletters</strong>
        <p>An embedded events calendar and a place to read past newsletters and community updates.</p>
    </div>

    <div class="ocs__grid-cell">
        <strong>History and service</strong>
        <p>An interactive timeline, volunteer information, contact tools, and a planned donation pathway.</p>
    </div>

    <div class="ocs__grid-cell ocs__grid-cell--accent">
        <strong>Games and profiles</strong>
        <p>Six library-themed games supported by user profiles and leaderboards.</p>
    </div>
</div>

<br>

---

## System flow

> The inherited prototype provides a starting point for a connected full-stack experience.

<div class="ocs__grid ocs__grid--standard cols-4">
    <div class="ocs__grid-cell ocs__grid-cell--header">One connected community workflow</div>

    <div class="ocs__grid-cell ocs__grid-cell--accent">
        <strong>1 · Visitor interface</strong>
        <p>Jekyll pages and JavaScript present the catalog, calendar, newsletters, history, games, and support pathways.</p>
    </div>

    <div class="ocs__grid-cell">
        <strong>2 · User actions</strong>
        <p>Visitors search, filter, sign in, manage a profile, play games, volunteer, contact the organization, or begin a donation.</p>
    </div>

    <div class="ocs__grid-cell">
        <strong>3 · Flask services</strong>
        <p>Backend APIs support data-driven features and connect the frontend experience to stored information.</p>
    </div>

    <div class="ocs__grid-cell ocs__grid-cell--accent">
        <strong>4 · Community value</strong>
        <p>Visitors can plan bookstore trips, stay informed, participate more easily, and keep returning to the site.</p>
    </div>
</div>

<br>

---

## Technical foundation

<div class="ocs__grid ocs__grid--card">
    <div class="ocs__grid-cell">
        <strong>Frontend</strong>
        <p>Jekyll, HTML, and JavaScript for the public site and interactive visitor features.</p>
    </div>

    <div class="ocs__grid-cell ocs__grid-cell--accent">
        <strong>Backend</strong>
        <p>Python Flask services for data-backed workflows and REST API endpoints.</p>
    </div>

    <div class="ocs__grid-cell">
        <strong>Data</strong>
        <p>Structured records for catalog items, events, users, profiles, game results, and future support workflows.</p>
    </div>

    <div class="ocs__grid-cell ocs__grid-cell--accent">
        <strong>Continuation goal</strong>
        <p>Review the inherited code, confirm nonprofit priorities, and turn the strongest prototype features into a maintainable product direction.</p>
    </div>
</div>

<br>

---

## Project handoff

> The 2026–27 capstone starts from the work and documentation created by the previous student team.

### 2026–27 team

<div class="ocs__grid ocs__grid--standard cols-2">
    <div class="ocs__grid-cell ocs__grid-cell--header">Current project team</div>
    <div class="ocs__grid-cell ocs__grid-cell--accent">
        <strong>Arjun Ganesh</strong>
        <p>Scrum Master</p>
    </div>
    <div class="ocs__grid-cell">
        <strong>Nathan Trieu</strong>
        <p>Developer 1</p>
    </div>
    <div class="ocs__grid-cell">
        <strong>Raadin Ansari</strong>
        <p>Developer 2</p>
    </div>
</div>

<br>

### 2025–26 prototype team

<div class="ocs__grid ocs__grid--standard cols-2">
    <div class="ocs__grid-cell ocs__grid-cell--header">Original project contributors</div>
    <div class="ocs__grid-cell ocs__grid-cell--accent"><strong>Shayan Bhatti</strong></div>
    <div class="ocs__grid-cell ocs__grid-cell--accent"><strong>Arnav Pallapotu</strong></div>
    <div class="ocs__grid-cell ocs__grid-cell--accent"><strong>Tanay Paranjpe</strong></div>
</div>

<br>

<div class="ocs__links ocs__links--wide">
    <a class="ocs__btn large iridescent" href="https://github.com/Boolean-Boyz/bb-pages" target="_blank" rel="noreferrer noopener">View Frontend Repository</a>
    <a class="ocs__btn large iridescent" href="https://github.com/Boolean-Boyz/bb-flask" target="_blank" rel="noreferrer noopener">View Backend Repository</a>
    <a class="ocs__btn large iridescent" href="{{ '/capstone/poway-library/' | relative_url }}">View 2025–26 Project Page</a>
</div>
