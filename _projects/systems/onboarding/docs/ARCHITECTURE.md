---
layout: post
title: Onboarding Architecture
description: How the card-based onboarding prototype uses games, profile data and saved progress.
categories: [Systems]
permalink: /systems/onboarding/architecture/
show_reading_time: false
---

## View and data source

Onboarding uses an OCS card grid and the shared page viewer, with embedded
GameEngine and CS Pathway challenges. Card definitions come from Onboarding's
JavaScript; guest unlocks live in browser storage and signed-in unlocks in the
Flask game profile through Profile's backend. Game Workbench and UI Builder open
directly without a gate, occupying the full page.

## Boundaries

Onboarding owns its pages, styles, unlock game, progress store and Profile
evidence component. CS Pathway owns its existing levels, avatar and theme.
Profile conditionally hosts the evidence component and supplies the backend used
to read and update game progress. Evidence is not a skill self-rating; unfinished stations
are not labeled as failures.

Each account unlock is a distinct top-level `onboarding_unlock_<id>` field, so
updates do not replace the game profile. Guest unlocks are removed only after
successful transfer. The gate is not an authorization boundary.
Start and stop mount or unload the active iframe. Pause and resume use a
same-origin, parent-checked bridge to GameEngine's active control; an in-game
dialog must close first. Replay resets only the selected challenge's unlock,
not login cookies or other profile data.

Build and test commands are in the [Onboarding README](https://github.com/Open-Coding-Society/pages/blob/main/_projects/systems/onboarding/README.md).
