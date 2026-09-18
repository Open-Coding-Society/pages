---
microblog: true
toc: false
layout: post
title: UESL Accessible Game Maker 2.0
description: A two-week CSP frontend sprint creating a guided, accessible path from game idea to playable and saved result.
permalink: /capstone/uesl-game-maker/
sticky_rank: 1
year: "2026-2027"
---

> UESL Accessible Game Maker helps participants create and play games through a clear, accessible workflow. Our sprint focuses on making the existing editor easier to understand without replacing its game engine, accessibility tools, or save system.

<div class="ocs__links ocs__links--wide">
    <a class="ocs__btn alert-green fill large" href="https://github.com/RazorCrest00/uesl-accessible-game-maker/issues/1" target="_blank" rel="noopener noreferrer">Open Sprint Plan</a>
    <a class="ocs__btn large" href="https://github.com/RazorCrest00/uesl-accessible-game-maker" target="_blank" rel="noopener noreferrer">Team Repository</a>
    <a class="ocs__btn large" href="https://github.com/Malware-Madness/MalwareMadness" target="_blank" rel="noopener noreferrer">Original Project</a>
</div>

<br>

<div class="ocs__grid ocs__grid--card cols-3">
    <div class="ocs__grid-cell ocs__grid-cell--header">Project Direction</div>

    <div class="ocs__grid-cell ocs__grid-cell--accent">
        <strong>Current strengths</strong>
        <p>The project already includes a drag-and-drop editor, Canvas game engine, accessibility settings, preview controls, and local or account-based saves.</p>
    </div>

    <div class="ocs__grid-cell">
        <strong>User problem</strong>
        <p>First-time participants can face too many technical choices at once, making it difficult to reach a confident first playable result.</p>
    </div>

    <div class="ocs__grid-cell">
        <strong>Sprint direction</strong>
        <p>Add a guided mode that presents one meaningful choice at a time while keeping the advanced editor available. The sprint excludes multiplayer, AI generation, uploads, accounts, publishing, and new backend systems.</p>
    </div>
</div>

<br>

---

## Six-step experience

<div class="ocs__grid ocs__grid--card cols-3">
    <div class="ocs__grid-cell ocs__grid-cell--accent">
        <strong>01 · Start</strong>
        <p>Create a new game or restore a clearly labeled browser draft.</p>
        <p><strong>Done when:</strong> either path reaches the builder without losing valid work.</p>
    </div>

    <div class="ocs__grid-cell">
        <strong>02 · Choose</strong>
        <p>Name the game and select the supported platform-runner template.</p>
        <p><strong>Done when:</strong> missing fields show a useful correction and preserve other choices.</p>
    </div>

    <div class="ocs__grid-cell">
        <strong>03 · Customize</strong>
        <p>Choose a visual theme, challenge level, and game speed through clear controls.</p>
        <p><strong>Done when:</strong> Back and Continue preserve every valid selection.</p>
    </div>

    <div class="ocs__grid-cell ocs__grid-cell--accent">
        <strong>04 · Accessibility</strong>
        <p>Apply a preset, then adjust contrast, motion, control size, or speed individually.</p>
        <p><strong>Done when:</strong> at least three settings visibly change the preview.</p>
    </div>

    <div class="ocs__grid-cell ocs__grid-cell--accent">
        <strong>05 · Preview</strong>
        <p>Start, pause, reset, and exit one proven game-engine template.</p>
        <p><strong>Done when:</strong> a preview failure returns safely to the builder.</p>
    </div>

    <div class="ocs__grid-cell">
        <strong>06 · Save</strong>
        <p>Review the configuration, edit a choice, and save a compatible local draft.</p>
        <p><strong>Done when:</strong> refresh, restore, and corrupted-data recovery pass.</p>
    </div>
</div>

<br>

---

## Team ownership

> Each teammate owns implementation, testing, review, revision, and portfolio evidence for one complete part of the workflow.

<div class="ocs__grid ocs__grid--card cols-3">
    <div class="ocs__grid-cell">
        <strong>Rohan Chandra · Developer</strong>
        <p>Own the guided builder interface and navigation between the six steps.</p>
        <ul>
            <li>Build semantic, responsive builder states.</li>
            <li>Connect controls to the shared state.</li>
            <li>Test keyboard order, Back behavior, mobile, and zoom.</li>
        </ul>
        <p><strong>Done when:</strong> the full path preserves choices and never relies on color alone.</p>
        <a class="ocs__btn small" href="https://github.com/RazorCrest00/uesl-accessible-game-maker/issues/2" target="_blank" rel="noopener noreferrer">Rohan's Issue</a>
    </div>

    <div class="ocs__grid-cell ocs__grid-cell--accent">
        <strong>Ishan Srivastava · Scrum Master / Developer</strong>
        <p>Own the accessible preview while coordinating the sprint and integration checkpoints.</p>
        <ul>
            <li>Build presets and stable preview controls.</li>
            <li>Run standups and maintain the Kanban board.</li>
            <li>Lead reviews, unblock dependencies, and record revisions.</li>
        </ul>
        <p><strong>Done when:</strong> three settings affect the preview and every sprint gate has evidence.</p>
        <a class="ocs__btn small" href="https://github.com/RazorCrest00/uesl-accessible-game-maker/issues/3" target="_blank" rel="noopener noreferrer">Ishan's Issue</a>
    </div>

    <div class="ocs__grid-cell">
        <strong>Adhvay Iyer · Developer</strong>
        <p>Own configuration, validation, browser drafts, and the adapter to the existing game data.</p>
        <ul>
            <li>Define the shared builder-state contract.</li>
            <li>Build the parameterized configuration procedure.</li>
            <li>Test missing, conflicting, valid, and corrupted data.</li>
        </ul>
        <p><strong>Done when:</strong> valid input becomes a compatible preview configuration and drafts restore safely.</p>
        <a class="ocs__btn small" href="https://github.com/RazorCrest00/uesl-accessible-game-maker/issues/4" target="_blank" rel="noopener noreferrer">Adhvay's Issue</a>
    </div>
</div>

<br>

---

## Planning and iteration

<div class="ocs__grid ocs__grid--card cols-3">
    <div class="ocs__grid-cell ocs__grid-cell--header">Two-week Sprint</div>

    <div class="ocs__grid-cell ocs__grid-cell--accent">
        <strong>Week 1 · Prove the path</strong>
        <ol>
            <li>Audit reuse points and agree on the shared state.</li>
            <li>Build each teammate's smallest working slice.</li>
            <li>Integrate Start through Preview.</li>
            <li>Record teacher or peer feedback in the issue.</li>
        </ol>
    </div>

    <div class="ocs__grid-cell">
        <strong>Week 2 · Revise and verify</strong>
        <ol>
            <li>Correct interaction and integration problems.</li>
            <li>Complete save, restore, and preview recovery.</li>
            <li>Test keyboard, phone, zoom, and invalid data.</li>
            <li>Deploy, teammate-verify, demonstrate, and reflect.</li>
        </ol>
    </div>

    <div class="ocs__grid-cell">
        <strong>Kanban and reviews</strong>
        <p>Backlog → In Progress → Code Complete → Deployed → Verified.</p>
        <p>Each pull request links its issue, lists its tests, receives teammate review, and records the resulting revision.</p>
    </div>
</div>

<br>

---

## Testing and CSP evidence

<div class="ocs__grid ocs__grid--card cols-3">
    <div class="ocs__grid-cell ocs__grid-cell--header">Demo Readiness</div>

    <div class="ocs__grid-cell ocs__grid-cell--accent">
        <strong>Final demo path</strong>
        <p>Create a named game → apply an accessible preset → override one setting → preview → save → refresh → restore.</p>
    </div>

    <div class="ocs__grid-cell">
        <strong>Acceptance checks</strong>
        <p>Keyboard and focus · reduced motion · 200% zoom · phone and desktop · validation · corrupted-draft recovery · preview controls · save and restore.</p>
    </div>

    <div class="ocs__grid-cell">
        <strong>CSP evidence</strong>
        <p>Issues, commits, Kanban movement, teammate reviews, feedback, and correcting revisions document collaboration and iteration.</p>
        <p>Inputs are game and accessibility choices. Events navigate, validate, preview, save, and restore. Outputs are feedback and configured gameplay. Data is stored in one builder-state object.</p>
    </div>
</div>

<br>

<div class="ocs__links ocs__links--wide">
    <a class="ocs__btn alert-green fill" href="https://github.com/RazorCrest00/uesl-accessible-game-maker/issues/1" target="_blank" rel="noopener noreferrer">View Team Plan</a>
    <a class="ocs__btn" href="https://github.com/RazorCrest00/uesl-accessible-game-maker" target="_blank" rel="noopener noreferrer">View Repository</a>
</div>
