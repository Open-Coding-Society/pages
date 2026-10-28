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

<!-- Sprint Board: live from the team's GitHub project, like Communication Systems -->
{% assign sfi_data = site.data.sfi_foundation %}
{% if sfi_data.Board %}
{% include ocs_kanban_board.html url=sfi_data.Board.url filter=sfi_data.Board.filter columns=sfi_data.Board.columns %}
{% endif %}

<br>

<div class="ocs__links ocs__links--wide">
    <a class="ocs__btn ocs__btn--icon alert-green iridescent" href="https://github.com/SFI-Foundation/Frontend" target="_blank" rel="noreferrer noopener">
        <span class="ocs__btn-icon" aria-hidden="true">
            <svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
            </svg>
        </span>
        <span>Frontend Repository</span>
    </a>
    <a class="ocs__btn ocs__btn--icon alert-yellow iridescent" href="https://github.com/SFI-Foundation/Backend" target="_blank" rel="noreferrer noopener">
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

## Our community partner: SFI Foundation

**Who we serve.** [SFI Foundation, Inc.](https://www.sfifoundation.com/) is an organization working in motorsports safety through equipment specifications and certification programs. Our community-focused capstone supports people who need to find and understand motorsports safety information, including racers, equipment users, and manufacturers. We are partnering with SFI to explore improving its online experience—not to issue certifications or replace SFI's official standards.

**The partner's website.** [sfifoundation.com](https://www.sfifoundation.com/) is SFI Foundation's official website. The student project continues a website prototype developed during the previous semester; our 2026–27 effort is intended to explore improvements and a possible path toward a more useful, maintainable experience, subject to SFI's feedback and project scope.

### Client contacts and project communication

| Contact | Role | Details |
| --- | --- | --- |
| **Jennifer Faye** | President, SFI Foundation; primary partner contact in the October 2026 email thread | [jfaye@sfifoundation.com](mailto:jfaye@sfifoundation.com) |
| **SFI Foundation** | Organization contact | [sfi@sfifoundation.com](mailto:sfi@sfifoundation.com) · [(858) 451-8868](tel:+18584518868) |
| **Katie Salo** | PUSD Partners in Education Manager; school–community partnership coordinator | [ksalo@powayusd.com](mailto:ksalo@powayusd.com) |
| **John Mortensen** | Del Norte High School Computer Science teacher; project liaison | [jmortensen@powayusd.com](mailto:jmortensen@powayusd.com) |

**SFI mailing address:** 15708 Pomerado Rd., Ste. N208, Poway, CA 92064, USA.  
**Official website:** [www.sfifoundation.com](https://www.sfifoundation.com/) · **Contact page:** [SFI Contact](https://sfifoundation.com/contact/)

The contacts above come from the October 2026 partnership correspondence. This capstone is student work rather than an official SFI service.

---

## Partner communication microblog

A dated record of conversations and decisions with our community partner. Entries summarize correspondence rather than reproducing private email messages. New discussions, client feedback, decisions, and action items should be added here as they happen.

### October 28, 2026 — Capstone documentation update

**Context:** CSP class assignment, periods 3 and 4.  
**Update:** Documented whom the project serves, the partner's website and contact information, and a chronological communication record.  
**Next steps:** Confirm SFI's representative for the Electives Fair, discuss desired improvements with the partner, and translate feedback into a prioritized project scope. No client approval of specific features is implied by this documentation.

### October 26, 2026 — Jennifer Faye confirms interest in continuing

**Participants:** Jennifer Faye (SFI Foundation), Katie Salo (PUSD), John Mortensen (Del Norte), and Ruhaan Bansal (student team).  
**Summary:** Jennifer apologized for the delayed reply and said she was impressed with the previous semester's SFI website prototype and student team. She confirmed that SFI is **very interested in continuing** with the new student group working on the upgrade. She cannot attend the November 2 Electives Fair because she will be out of town, but said a colleague might attend on SFI's behalf. She planned to provide an update about that colleague's availability.  
**Outcome:** Positive partner interest; representative attendance was **not yet confirmed** in the supplied thread.  
**Next steps:** Follow up regarding the colleague's attendance and arrange a conversation about SFI's needs and priorities.

### October 26, 2026 — Katie Salo follows up with RSVP details

**Participants:** Katie Salo, Jennifer Faye, John Mortensen, and Ruhaan Bansal.  
**Summary:** Katie thanked Jennifer and explained that an SFI representative can use the [RSVP form](https://forms.gle/rU9gojMELnqBm4G17) to express interest even if the organization cannot attend in person. She reiterated the value of the school–nonprofit partnership.  
**Event details:** Monday, **November 2, 2026**, 6:00–7:30 p.m.; Del Norte High School, Room A101, 16601 Nighthawk Lane, San Diego, CA 92127.  
**Next steps:** Confirm whether SFI will send a colleague or participate through later discussions.

### October 26, 2026 — Katie Salo reconnects with SFI

**Participants:** Katie Salo, Jennifer Faye, SFI Foundation, and John Mortensen.  
**Summary:** Katie explained that Del Norte's Computer Science program was resuming its nonprofit website work on a larger scale than the previous spring pilot. She invited SFI to meet students, view previous work, and consider participating in a spring 2027 project.  
**Outcome:** Formal invitation to the Electives Fair and an opportunity to renew the partnership.

### October 22, 2026 — John Mortensen invites SFI to renew the partnership

**Participants:** John Mortensen, SFI Foundation, and Katie Salo.  
**Summary:** John invited SFI to reconnect with Del Norte Computer Science students for projects targeting **spring 2027 completion**. Potential work included website improvements, prototypes, exploring a path from previous student work to production, and investigating AI, data, or automation. He described Open Coding Society resources and emphasized that actual projects would be evaluated for scope and student capacity.  
**Outcome:** Invitation to build on the prior prototype and discuss concrete requirements; no production deployment commitment was made.  
**Next steps:** Obtain client priorities and agree on a realistic student project plan.

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
    <a class="ocs__btn alert-green iridescent" href="https://github.com/SFI-Foundation/Frontend" target="_blank" rel="noreferrer noopener">Explore Frontend ↗</a>
    <a class="ocs__btn alert-yellow iridescent" href="https://github.com/SFI-Foundation/Backend" target="_blank" rel="noreferrer noopener">Explore Backend ↗</a>
</div>

<br>

---

## Official SFI Foundation contact

For technical questions, specification information, or product certification inquiries, contact SFI Foundation directly.

- **Email:** [sfi@sfifoundation.com](mailto:sfi@sfifoundation.com)
- **Phone:** [(858) 451-8868](tel:+18584518868)
- **Website:** [Official SFI contact page](https://sfifoundation.com/contact/)

This is SFI Foundation's public contact information. For feedback on this student capstone, use the [project's GitHub organization](https://github.com/SFI-Foundation).

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
    <a class="ocs__btn large iridescent" href="https://github.com/SFI-Foundation/Frontend" target="_blank" rel="noreferrer noopener">View Frontend Repository</a>
    <a class="ocs__btn large iridescent" href="https://github.com/SFI-Foundation/Backend" target="_blank" rel="noreferrer noopener">View Backend Repository</a>
</div>
