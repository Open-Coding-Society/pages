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
If the account service is unreachable, play uses browser-only guest unlocks;
the viewer reports this and disables replay until account progress is available.
Identity Forge pauses its GameEngine control and starts a nested cookie level.
The mini-game saves completion before ending, so a failed save can be retried
without losing the collected cookies; GameEngine resumes the Forge.
The separate cookie gate declares its completion condition and asynchronous save
sequence on its GameEngine level. Its definition supplies the game ID, title
and goal, and its progress object includes the challenge ID and current count.
The engine reports generic progress snapshots; the gate's iframe bridge sends
them as `ocs-game-progress` messages. The viewer uses completion status to
coordinate the save with replay. The engine stops level updates while saving,
then exits the level; saved progress reaches the viewer only after the exit.
On failure the viewer's retry button asks the gate to retry that same sequence
without resetting the cookie count. The viewer remains responsible for hosting
the separate challenge pages and playback controls.
Start and stop mount or unload the active iframe. Pause and resume use a
same-origin, parent-checked bridge to GameEngine's active control; an in-game
dialog must close first. Replay resets only the selected challenge's unlock,
not login cookies or other profile data.

Build and test commands are in the [Onboarding README](https://github.com/Open-Coding-Society/pages/blob/main/_projects/systems/onboarding/README.md).
