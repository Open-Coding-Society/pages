---
layout: post
title: Onboarding Architecture
description: How the card-based onboarding prototype uses games, profile data and saved progress.
categories: [Systems]
permalink: /systems/onboarding/architecture/
show_reading_time: false
---

## View and data source

Onboarding uses an OCS card grid and the shared page viewer, with a GameRunner
for the selected GameEngine and CS Pathway challenge, without an iframe. Card definitions come from Onboarding's
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
Each `<challenge>-game.js` combines that challenge's level with its optional
gate through `onboarding-game.js`. Identity Forge has a cookie gate; Toolchain
Trail uses a Snake gate with GameEngine Player and NPC classes. Five apples
complete it; wall or self-collision resets the score. The other games run
without a gate. The GameRunner hides
its level and engine selectors. Toolchain runs on a 1600-by-900 stage scaled to
fit the available space.

Onboarding passes a presentation host to CS Pathway with one writer per surface:
profile actions live in the expandable Game profile beside the unlock status
(the persistence bar), level scores replace the running status when present,
and toasts and proximity hints overlay the top of the game area — toasts fade
on their own, hints stay until the level clears them. The gate's counter and
instructions sit beside the runner controls, and the reset
control is part of the runner toolbar. Identity Forge is the reference level:
it routes all messages through CS Pathway's shared Present helper instead of
hand-rolled overlays, and mounts the Station Helper chat (💬, lower right of
the game box) as its page-specific help through Spring's level-aware chat
endpoint. Each challenge gets its own microblog topic as a subpath of the
viewer's permalink, and the viewer toolbar hosts the microblog button. The
redundant Next Level link is omitted
there; standalone Pathway pages keep their existing presentation.

The engine freezes each gate during its asynchronous save and advances only on
success. Progress callbacks coordinate replay with pending saves; retry repeats
the save without resetting gate progress. Stop destroys the active game,
including its loop and input handlers. Pause controls the active GameControl;
an in-game dialog must close first. Replay resets only the selected challenge's
unlock, not login cookies or other profile data.

Build and test commands are in the [Onboarding README](https://github.com/Open-Coding-Society/pages/blob/main/_projects/systems/onboarding/README.md).
