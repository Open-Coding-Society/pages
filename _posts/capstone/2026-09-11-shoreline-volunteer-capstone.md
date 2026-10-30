---
microblog: true
toc: false
layout: post
title: Shoreline Community Services, Volunteer Page
permalink: /capstone/shoreline-volunteer/
---
{% assign shoreline_data = site.data.shoreline_volunteer %}
<!-- markdownlint-disable MD033 -->
<style>
.shoreline-capstone-card .ocs__grid-cell:not(.ocs__grid-cell--header) {
    text-align: center;
    font-size: 0.82rem;
    line-height: 1.4;
}
.shoreline-capstone-card .ocs__grid-cell:not(.ocs__grid-cell--header) strong {
    font-size: 1rem;
}
</style>

<div class="shoreline-capstone-card" markdown="1">

<div class="ocs__grid ocs__grid--card cols-3">
    <div class="ocs__grid-cell ocs__grid-cell--header">About Shoreline Community Services</div>
    <div class="ocs__grid-cell ocs__grid-cell--accent">
        <strong>Mission</strong>
        <p>Shoreline Community Services works toward "an interdependent community aligned with a common goal — a thriving, safe and welcoming neighborhood for everyone," addressing the unmet needs of unsheltered individuals and families in San Diego's Central Beach Area.</p>
    </div>
    <div class="ocs__grid-cell">
        <strong>Programs</strong>
        <p>The Compass Station (a drop-in resource center), Volunteer Community Outreach, the Medical Respite Hotel Program, and the Community Care Crew transitional employment program.</p>
    </div>
    <div class="ocs__grid-cell ocs__grid-cell--accent">
        <strong>Main People</strong>
        <p>Caryn Blanton, Executive Director<br>Angie Veliz, Assistant Director</p>
    </div>
    <div class="ocs__grid-cell">
        <strong>Contact</strong>
        <p>(858) 900-7024<br><a href="mailto:info@shorelinecs.org">info@shorelinecs.org</a><br>1004 Chalcedony St, San Diego, CA 92109</p>
        <p style="font-size: 0.72rem; opacity: 0.7;">Individual staff contacts are not publicly listed; this is the organization's official line.</p>
    </div>
    <div class="ocs__grid-cell ocs__grid-cell--accent">
        <strong>Current Gap</strong>
        <p>Strong programs and a clear mission, but the volunteer page undersells them — there is opportunity to guide volunteers with real scheduling, real forms, and a clearer picture of where help is needed most.</p>
    </div>
    <div class="ocs__grid-cell">
        <strong>Source</strong>
        <p><a href="https://shorelinecs.org/" target="_blank" rel="noopener">shorelinecs.org</a> / <a href="https://shorelinecs.org/leadership" target="_blank" rel="noopener">Leadership page</a></p>
    </div>
</div>

## Shoreline Community Services, Volunteer Page 2026-27

<a class="ocs__btn large" href="https://github.com/vanshikak210/shorelineproject.git">
    Github Repository
</a>

<div class="ocs__grid ocs__grid--card cols-3">
    <div class="ocs__grid-cell ocs__grid-cell--header">How We Are Going to Change the Website</div>
    <div class="ocs__grid-cell ocs__grid-cell--accent">
        <strong>Homelessness Hotspot</strong>
        <p>Selecting the "volunteer" option shows a homelessness hotspot map highlighting the most concentrated homeless areas and the places most in need of volunteers, directing them to greater need instead of random centers and automating the process instead of a human contacting each volunteer.</p>
    </div>
    <div class="ocs__grid-cell">
        <strong>Volunteer Shift Calendar</strong>
        <p>Volunteers can see which shift slots are already taken instead of being contacted by a team member, and fewer available spots create urgency that encourages more people to sign up.</p>
    </div>
    <div class="ocs__grid-cell ocs__grid-cell--accent">
        <strong>Donations Page</strong>
        <p>Currently, the only way to donate is through an Instagram link in their bio. Adding a donation page makes it easier to contribute, with amounts tied to impact like "$50 = 1 meal + supplies" and "$200 = 1 night hotel stay," so donors see exactly what their money does and want to give more.</p>
    </div>
    <div class="ocs__grid-cell">
        <strong>Needs Right Now Page</strong>
        <p>Money doesn't have to be the only thing people donate. A "needs right now" page opens up more ways to give, since most people can afford to donate items like toys, old clothes, or food, showing exactly what nearby shelters need most and guiding donors on how to give it.</p>
    </div>
    <div class="ocs__grid-cell ocs__grid-cell--accent">
        <strong>Service Navigation</strong>
        <p>A homeless person visiting the website can click a "Need Help?" button to get detailed directions to the nearest shelter and its facilities, plus the outreach team's contact information for extra support.</p>
    </div>
    <div class="ocs__grid-cell">
        <strong>Dashboard (Impact Made)</strong>
        <p>A dashboard shows stats on impact made over a selectable time interval (last 30 days, last week, etc.), with a graph of how many people have been helped over the past year, showing real impact instead of just listing programs.</p>
    </div>
</div>

*Homelessness Hotspot and Volunteer Shift Calendar can go together to create one combined idea.*

*Donations Page and Needs Right Now Page can go together to create one combined idea (Needs Right Now can be a part of the donations page).*

---

## Project Kanban Board

Follow our team's actual issues, assignments, and progress on GitHub.

{% if shoreline_data.Board %}
{% include ocs_kanban_board.html url=shoreline_data.Board.url filter=shoreline_data.Board.filter title=shoreline_data.Board.title %}
{% endif %}

<a class="ocs__btn small pill" href="{{ shoreline_data.Board.project_url | escape }}" target="_blank" rel="noopener noreferrer">Open personal GitHub Project ↗</a>

---

<div class="ocs__grid ocs__grid--card cols-3">
    <div class="ocs__grid-cell ocs__grid-cell--header">Teammates/Collaborators</div>
    <div class="ocs__grid-cell ocs__grid-cell--accent">
        <strong>Nitya Hamsini Kasse</strong>
        <p>Technologist/Developer</p>
        <a class="ocs__btn alert-green iridescent fill small" href="https://github.com/nkasse12">
            GitHub
        </a>
    </div>
    <div class="ocs__grid-cell ocs__grid-cell--accent">
        <strong>Vanshika Keswani</strong>
        <p>Technologist/Developer</p>
        <a class="ocs__btn alert-green iridescent fill small" href="https://github.com/vanshikak210">
            GitHub
        </a>
    </div>
    <div class="ocs__grid-cell ocs__grid-cell--accent">
        <strong>Hsu-Cheng Lin</strong>
        <p>Technologist/Developer</p>
    </div>
</div>

</div>
<!-- markdownlint-enable MD033 -->
