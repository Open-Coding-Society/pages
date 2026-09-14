---
layout: post
title: SASS Containers Grammar
description: Explore the Open Coding Society container grammar through living examples.
categories: [SASS, Containers]
lesson_language: SASS
lesson_topic: Containers
lesson_part: interactive
lesson_type: lesson
permalink: /navigation/sass/containers/
---

<!-- markdownlint-disable MD033 MD046 -->

> Build a complete page with OCS grammar before writing custom CSS. Containers establish the page boundary; cards, grids, tables, images, and buttons organize the content inside it.

<div class="ocs__links ocs__links--wide">
    <a class="ocs__btn" href="{{ '/navigation/sass/buttons/' | relative_url }}">Button Grammar</a>
    <a class="ocs__btn" href="{{ '/navigation/sass/grids/' | relative_url }}">Grid Grammar</a>
    <a class="ocs__btn accent fill" href="{{ '/navigation/sass/containers/' | relative_url }}">Container Grammar</a>
</div>

## The Container Relationship

> Use one `ocs__container` for the page. Add navigation, section titles, cards, grids, tables, and actions as children. The composition provides structure without page-specific CSS.

```text
ocs__container
|- navigation or ocs__links
|- ocs__section-title
|- ocs__card
|  |- ocs__grid
|  |  `- ocs__grid-cell
|  |     |- image content
|  |     |- text and status
|  |     `- ocs__btn action
|  `- ocs__table-wrap
|     `- ocs__table
`- ocs__pager or footer
```

## Example 1: Project Landing

<div class="ocs__container" style="margin-bottom: 1.5rem;">
    <div class="ocs__capstone-nav">
        <div class="ocs__links ocs__links--wide">
            <a class="ocs__btn pill accent fill" href="#overview">Overview</a>
            <a class="ocs__btn pill" href="#work">Work</a>
            <a class="ocs__btn pill" href="#team">Team</a>
        </div>
    </div>

    <div class="ocs__badge">Design-Based Research Hub</div>
    <h1 id="overview">Classroom Presence</h1>
    <p class="ocs__description">A preference-aware project page assembled from shared OCS elements.</p>

    <div class="ocs__card" id="work">
        <h3 class="ocs__section-title">What the project does</h3>
        <div class="ocs__grid ocs__grid--card">
            <div class="ocs__grid-cell">
                <img class="ocs__image-frame" src="{{ '/images/capstone/powaynec-logo-white.png' | relative_url }}" alt="Project placeholder logo">
                <h4>Detect</h4>
                <p>Collect useful signals from the environment.</p>
                <a class="ocs__btn accent fill" href="#details">Project details</a>
            </div>
            <div class="ocs__grid-cell">
                <h4>Correlate</h4>
                <p>Combine evidence into a clear, testable state.</p>
                <span class="ocs__status-pill ocs__status-pill--good">In progress</span>
            </div>
            <div class="ocs__grid-cell">
                <h4>Explain</h4>
                <p>Make the result understandable to the person using it.</p>
                <span class="ocs__status-pill ocs__status-pill--neutral">Planned</span>
            </div>
        </div>
    </div>
</div>

## Example 2: Card, Grid, and Table

<div class="ocs__container" style="margin-bottom: 1.5rem;">
    <h2 class="ocs__section-title">Hardware Plan</h2>
    <div class="ocs__card">
        <div class="ocs__grid ocs__grid--standard cols-2">
            <div class="ocs__grid-cell ocs__grid-cell--accent">
                <strong>Current hardware</strong><br>
                Already available for the first prototype.
            </div>
            <div class="ocs__grid-cell">
                <strong>Next hardware</strong><br>
                Purchased only after the first test proves the need.
            </div>
        </div>

        <div class="ocs__table-wrap" style="margin-top: 1.25rem;">
            <table class="ocs__table">
                <thead>
                    <tr><th>Item</th><th>Status</th><th>Purpose</th></tr>
                </thead>
                <tbody>
                    <tr><td>Camera</td><td><span class="ocs__status-pill ocs__status-pill--good">Current</span></td><td>Capture the room.</td></tr>
                    <tr><td>Reader</td><td><span class="ocs__status-pill ocs__status-pill--warn">Planned</span></td><td>Collect a second signal.</td></tr>
                </tbody>
            </table>
        </div>

        <div class="ocs__callout">
            The same structure adapts to the active user preference theme. No page-specific color CSS is needed.
        </div>
    </div>
</div>

## Example 3: Nonprofit Capstone Hub

> A useful hub gives people context before navigation: a few meaningful signals, clear filters, and cards that explain the next step.

<div class="ocs__container" style="margin-bottom: 1.5rem;">
    <div class="ocs__capstone-nav">
        <div class="ocs__links ocs__links--wide">
            <a class="ocs__btn pill accent fill" href="#hub-overview">Hub</a>
            <a class="ocs__btn pill" href="#programs">Programs</a>
            <a class="ocs__btn pill" href="#get-involved">Get Involved</a>
            <a class="ocs__btn pill" href="#impact">Impact</a>
        </div>
    </div>

    <div class="ocs__badge">Community Organization</div>
    <h1 id="hub-overview">Scripps Ranch Fire Safe Council</h1>
    <p class="ocs__description">A nonprofit hub that helps neighbors understand local wildfire risk, find programs, and choose a practical way to help.</p>

    <div class="ocs__grid ocs__grid--standard cols-3" style="margin-bottom: 1.5rem;">
        <div class="ocs__grid-cell ocs__grid-cell--accent"><strong>12</strong><br>Active programs</div>
        <div class="ocs__grid-cell"><strong>4</strong><br>Upcoming events</div>
        <div class="ocs__grid-cell"><strong>3</strong><br>Ways to volunteer</div>
    </div>

    <div class="ocs__card" id="programs">
        <h2 class="ocs__section-title">Find a starting point</h2>
        <div class="ocs__links" style="margin-bottom: 1rem;">
            <a class="ocs__btn pill accent fill" href="#programs">All</a>
            <a class="ocs__btn pill" href="#programs">Prepare</a>
            <a class="ocs__btn pill" href="#programs">Volunteer</a>
            <a class="ocs__btn pill" href="#programs">Learn</a>
        </div>
        <div class="ocs__grid ocs__grid--card">
            <div class="ocs__grid-cell">
                <h3>Prepare Your Home</h3>
                <p>Practical home-hardening steps, local guidance, and a clear first action.</p>
                <span class="ocs__status-pill ocs__status-pill--good">Start here</span>
            </div>
            <div class="ocs__grid-cell">
                <h3>Join a Workday</h3>
                <p>See upcoming neighborhood fuel-reduction events and sign up for a role.</p>
                <a class="ocs__btn accent fill" href="#get-involved">See events</a>
            </div>
            <div class="ocs__grid-cell">
                <h3>Learn the Risk</h3>
                <p>Understand local wildfire conditions through short explainers and updates.</p>
                <span class="ocs__status-pill ocs__status-pill--neutral">Explore</span>
            </div>
        </div>
    </div>

    <div class="ocs__card" id="get-involved">
        <h2 class="ocs__section-title">Make the next action obvious</h2>
        <div class="ocs__callout">
            Visitors should not have to guess whether to donate, volunteer, attend an event, or prepare their home. Give each path a short explanation and one clear action.
        </div>
        <div class="ocs__links" style="margin-top: 1rem;">
            <a class="ocs__btn accent fill" href="#impact">Donate</a>
            <a class="ocs__btn" href="#programs">Volunteer</a>
            <a class="ocs__btn" href="#programs">View events</a>
        </div>
    </div>
</div>

## Rules of Thumb

- Start with `ocs__container` for page width and typography.
- Use `ocs__card` for a framed section of related content.
- Use `ocs__grid` when content needs comparison or repeated layout.
- Put images in the card or grid cell that explains them.
- Use `ocs__table` for structured comparison data.
- Use `ocs__btn`, `ocs__status-pill`, and `ocs__callout` for actions and state.
- Use preference tokens through the shared grammar instead of choosing fixed colors.
- Add custom CSS only when the shared grammar cannot express the required behavior.

<!-- markdownlint-enable MD033 MD046 -->
