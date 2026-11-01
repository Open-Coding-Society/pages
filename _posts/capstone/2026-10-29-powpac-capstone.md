---
microblog: true
toc: false
layout: post
title: PowPAC - Poway Performing Arts Company
description: >
  CSP capstone helping PowPAC improve their website with cleaner UI,
  production galleries, and an improved navbar and search experience.
categories: [Capstone]
permalink: /capstone/powpac/
---

PowPAC, the Poway Performing Arts Company, is Poway's only community theatre. Established in 1981 and celebrating 45 years, this volunteer-run 501(c)(3) nonprofit produces diverse and balanced works at its home in the Lively Center on Poway Road. Its season includes plays, musicals, and special events, with auditions, ticket information, and visit details published on the site, all supported by members, donors, and volunteers who handle everything from the box office and hospitality to sets, costumes, lighting, and stage management.

> Helping PowPAC improve their website. This means cleaner UI, galleries instead of long sheets of images, and improved navbar and search features. This is a student capstone, not an official PowPAC product or a replacement for the official theatre site.

<div class="ocs__grid ocs__grid--color cols-2" style="margin-bottom: 1.5rem;">
    <div class="ocs__grid-cell ocs__grid-cell--header">Core Experience</div>

    <div class="ocs__grid-cell ocs__grid-cell--accent">
        <strong>Browse Content</strong>
        <p>Browse productions, auditions, ticket information, visit details, and support pages or search site content in plain language instead of scrolling through long sheets of content.</p>
    </div>
    <div class="ocs__grid-cell">
        <strong>View Galleries</strong>
        <p>Photo galleries organize production and behind-the-scenes images into browsable collections instead of long sheets of images.</p>
    </div>

    <div class="ocs__grid-cell ocs__grid-cell--accent">
        <strong>Navigate Easily</strong>
        <p>An improved navbar guides visitors to shows, tickets, auditions, plan-your-visit details, and support pages across responsive layouts.</p>
    </div>
    <div class="ocs__grid-cell">
        <strong>Search and Revisit</strong>
        <p>Users search site content, revisit shows and galleries, and find how to buy tickets, audition, volunteer, or donate.</p>
    </div>
</div>

<div class="ocs__grid ocs__grid--standard cols-2" style="margin-bottom: 1.5rem;">
    <div class="ocs__grid-cell ocs__grid-cell--header">Problem vs Direction</div>

    <div class="ocs__grid-cell ocs__grid-cell--accent">
        <strong>Current Challenge</strong>
        <p>Visitors face dense pages, long sheets of images, and hard-to-navigate menus when trying to find show details, tickets, auditions, visit information, and ways to support the theatre.</p>
    </div>
    <div class="ocs__grid-cell">
        <strong>Project Direction</strong>
        <p>Combine cleaner UI, organized production galleries, an improved navbar, and plain-language search into one consistent frontend, possibly backed by a backend (Flask API?).</p>
    </div>
</div>

<div class="ocs__grid ocs__grid--holographic cols-2" style="margin-bottom: 1.5rem;">
    <div class="ocs__grid-cell ocs__grid-cell--header">Technical Plan</div>

    <div class="ocs__grid-cell ocs__grid-cell--accent">
        <strong>Frontend</strong>
        <p>Jekyll and JavaScript for static content plus interactive client-side features, including production galleries and search.</p>
    </div>
    <div class="ocs__grid-cell">
        <strong>Backend + Data</strong>
        <p>Python Flask APIs with SQLAlchemy persistence and a SQLite development database.</p>
    </div>

    <div class="ocs__grid-cell ocs__grid-cell--accent">
        <strong>Organized Media</strong>
        <p>Production and behind-the-scenes gallery collections replace long image sheets with structured, browsable sets.</p>
    </div>
    <div class="ocs__grid-cell">
        <strong>Navigation + Search</strong>
        <p>An improved navbar and search help visitors reach shows, tickets, auditions, visit information, and support quickly.</p>
    </div>
</div>

> The capstone spans the browser experience and backend services so the team can iterate on a complete full-stack workflow.

<div class="ocs__grid ocs__grid--card cols-2" style="margin-bottom: 1.5rem;">
    <div class="ocs__grid-cell ocs__grid-cell--header">System Flow (Planned)</div>

    <div class="ocs__grid-cell ocs__grid-cell--accent">
        <strong>Jekyll + JavaScript</strong>
        <p>Cleaner show pages, galleries, navbar, search, and ticket, visit, and support views across responsive pages.</p>
    </div>
    <div class="ocs__grid-cell">
        <strong>(Possibly) Flask API</strong>
        <p>Show, gallery, search, ticket, audition, and contact endpoints.</p>
    </div>

    <div class="ocs__grid-cell ocs__grid-cell--accent">
        <strong>(Possibly) SQLAlchemy + SQLite</strong>
        <p>Structured show and season records and user-linked prototype data.</p>
    </div>
    <div class="ocs__grid-cell">
        <strong>UI helpers</strong>
        <p>Gallery browsing, navbar navigation, and search-assisted discovery.</p>
    </div>
</div>

<!-- Sprint Board: live from the team's GitHub project, like Communication Systems -->
{% assign powpac_data = site.data.powpac %}
{% if powpac_data.Board %}
{% include ocs_kanban_board.html url=powpac_data.Board.url filter=powpac_data.Board.filter %}
{% endif %}

<p style="display:flex;flex-wrap:wrap;gap:.7rem;margin-bottom:1.5rem;">
    <a class="glowOnHover" style="padding:.65rem 1.15rem;text-decoration:none;display:inline-block;" href="https://www.powpac.org/">The Current Site ↗</a>
</p>

**Scrum Master:** Samarth Hande

**Technologists / Developers:** Rohan Sharma, Rigved Reddy Gaddam

**Powered by OCS grids and buttons**

[Buttons]({{ '/navigation/sass/buttons/' | relative_url }}) | [Grids]({{ '/navigation/sass/grids/' | relative_url }})
