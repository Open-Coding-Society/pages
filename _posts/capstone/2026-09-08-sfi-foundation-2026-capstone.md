---
microblog: true
sfi_correspondence_microblog: true
toc: false
layout: post
title: SFI Foundation 2026–27
description: >
  The SFI Foundation writes and administers safety specifications for racing
  equipment. This CSP 2026–27 capstone makes those standards easier to search,
  understand, and track.
categories: [Capstone]
permalink: /capstone/sfi-foundation/
---

> **Student capstone · In development.** This project explores a clearer way to discover and organize motorsports safety information. It is not an official SFI Foundation product and does not replace official SFI standards, labels, or PDF documents.

<div class="ocs__grid ocs__grid--standard cols-2">
    <div class="ocs__grid-cell ocs__grid-cell--header">About the SFI Foundation</div>

    <div class="ocs__grid-cell ocs__grid-cell--accent">
        <strong>Safety standards for motorsports equipment</strong>
        <p>SFI Foundation, Inc. is a nonprofit that writes and administers quality-assurance specifications for racing and performance equipment, from driver suits and harnesses to roll cages and drivetrain parts. It began in 1978, when the Specialty Equipment Market Association (SEMA) spun off its service bureau. SFI now runs independently and is based in Poway, California.</p>
        <p><strong>Its goal:</strong> give racers, manufacturers, and race organizers one shared, tested standard for safety gear.</p>
    </div>

    <div class="ocs__grid-cell">
        <img src="{{ '/images/capstone/sfi-foundation-2026-27.png' | relative_url }}" alt="SFI Foundation capstone project logo" loading="lazy">
        <p><strong>By the numbers:</strong> SFI maintains more than 100 specifications, and hundreds of sanctioning bodies around the world use them.</p>
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

## Client conversation history

Use the **💬 Microblog** button on this page to view the five dated October 22–28, 2026 SFI partnership email summaries, including Jennifer Faye's interest in continuing the prototype, Katie Salo's follow-up, and the November 2 Electives Fair invitation. They are marked **archived** so they cannot be mistaken for newly submitted user posts. The existing client introduction, contacts, and technical project plan remain below.

---

## Core experience
## What SFI does

> SFI does not race or sell parts. It sets the bar that safety equipment must clear and checks that products keep clearing it.

<div class="ocs__grid ocs__grid--card">
    <div class="ocs__grid-cell ocs__grid-cell--accent">
        <strong>Writes specifications</strong>
        <p>SFI works with manufacturers, engineers, and sanctioning bodies to define the minimum performance and test procedure for each type of equipment.</p>
    </div>

    <div class="ocs__grid-cell">
        <strong>Certifies products</strong>
        <p>Manufacturers test their products against a specification. Products that pass can carry an official SFI label showing which spec they meet.</p>
    </div>

    <div class="ocs__grid-cell">
        <strong>Runs follow-up testing</strong>
        <p>SFI buys labeled products from retailers and retests them. It also retests when a manufacturer changes production or suppliers, so certified gear stays at the standard.</p>
    </div>

    <div class="ocs__grid-cell ocs__grid-cell--accent">
        <strong>Operates a test lab</strong>
        <p>SFI runs its own laboratory in San Diego County and works with outside test facilities, such as one for head and neck restraints.</p>
    </div>
</div>

<br>

---

## How a standard reaches the track

> SFI writes the standard, and race organizers decide when their rules require it.

<div class="ocs__grid ocs__grid--standard cols-4">
    <div class="ocs__grid-cell ocs__grid-cell--header">From specification to tech inspection</div>

    <div class="ocs__grid-cell ocs__grid-cell--accent">
        <strong>1 · Specification</strong>
        <p>An SFI committee publishes a numbered spec with its test requirements.</p>
    </div>

    <div class="ocs__grid-cell">
        <strong>2 · Certification</strong>
        <p>A manufacturer tests the product, meets the spec, and labels it.</p>
    </div>

    <div class="ocs__grid-cell">
        <strong>3 · Rulebooks</strong>
        <p>Sanctioning bodies such as NHRA, NASCAR, IndyCar, SCCA, and USAC list SFI specs their competitors must meet.</p>
    </div>

    <div class="ocs__grid-cell ocs__grid-cell--accent">
        <strong>4 · Tech inspection</strong>
        <p>At the event, inspectors check each car and driver for current SFI labels.</p>
    </div>
</div>

> Labels often carry a date. Some gear, such as restraint harnesses, has to be replaced or recertified a set time after it was made. Gear damaged in a crash or fire should be replaced right away.

<br>

---

## Specifications racers see every day

<div class="ocs__grid ocs__grid--card">
    <div class="ocs__grid-cell ocs__grid-cell--accent">
        <strong>SFI 3.2A · Driver suits</strong>
        <p>Fire-resistant suits rated by thermal protection, from /1 up to /20. A higher number means more protection from heat.</p>
    </div>

    <div class="ocs__grid-cell">
        <strong>SFI 16.1 · Restraint harnesses</strong>
        <p>Seat belt and harness assemblies that hold the driver in place during a crash.</p>
    </div>

    <div class="ocs__grid-cell">
        <strong>SFI 38.1 · Head and neck restraints</strong>
        <p>Devices that limit head movement in a sudden stop to reduce neck and skull injuries.</p>
    </div>

    <div class="ocs__grid-cell ocs__grid-cell--accent">
        <strong>And 100+ more</strong>
        <p>Specs also cover parts such as fuel cells, clutches, flywheels, transmission shields, and roll cage padding.</p>
    </div>
</div>

<br>

---

## Official SFI Foundation contact

For technical questions, specification information, or product certification inquiries, contact SFI Foundation directly.

- **Email:** [sfi@sfifoundation.com](mailto:sfi@sfifoundation.com)
- **Phone:** [(858) 451-8868](tel:+18584518868)
- **Website:** [Official SFI contact page](https://sfifoundation.com/contact/)

This is SFI Foundation's public contact information. For feedback on this student capstone, use the [project's GitHub organization](https://github.com/SFI-Foundation).

<br>

---

## How our capstone supports SFI's mission

> SFI's information is detailed and spread across many specification numbers and documents. Our prototype helps people find the spec that applies to their gear and keep track of it.

<div class="ocs__grid ocs__grid--card">
    <div class="ocs__grid-cell ocs__grid-cell--accent">
        <strong>Search standards</strong>
        <p>Search in plain language instead of needing the exact spec number.</p>
    </div>

    <div class="ocs__grid-cell">
        <strong>Describe a part</strong>
        <p>A text classifier suggests specs that likely match a description of a part.</p>
    </div>

    <div class="ocs__grid-cell">
        <strong>Inspect equipment</strong>
        <p>Image recognition that runs in the browser helps identify equipment from a photo or camera.</p>
    </div>

    <div class="ocs__grid-cell ocs__grid-cell--accent">
        <strong>Track gear</strong>
        <p>Save your gear, check its certification details again later, and ask the chatbot about the specification data.</p>
    </div>
</div>

<br>

---

## Team

<div class="ocs__grid ocs__grid--card">
    <div class="ocs__grid-cell ocs__grid-cell--accent">
        <strong>Ruhaan Bansal</strong>
        <p>Scrum Master</p>
    </div>
    <div class="ocs__grid-cell ocs__grid-cell--accent">
        <strong>Ishan Jha</strong>
        <p>Scrum Master</p>
    </div>
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
