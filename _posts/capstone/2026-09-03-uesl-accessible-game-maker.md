---
microblog: true
toc: false
layout: post
title: UESL Accessible Game Maker 2.0
description: An accessible game-building prototype for UESL, with a visual project overview, frontend/backend architecture, community contact, and live team Kanban.
permalink: /capstone/uesl-game-maker/
sticky_rank: 1
year: "2026-2027"
---

> We are Adhvay, Rohan, and Ishan. We are building an accessible space where UESL participants can create and play their own games, learn through experimentation, and eventually share those experiences with others.

<div class="ocs__links ocs__links--wide">
    <a class="ocs__btn alert-green fill large" href="#two-minute-demo">Explore the project</a>
    <a class="ocs__btn large" href="#team-kanban">Team Kanban</a>
    <a class="ocs__btn large" href="https://www.unifiedesl.com/" target="_blank" rel="noopener noreferrer">Visit UESL</a>
</div>

## Community contact

<div class="ocs__grid ocs__grid--card cols-3">
    <div class="ocs__grid-cell ocs__grid-cell--accent">
        <strong>Matthew Iske · UESL</strong>
        <p>Founder and CEO; Programs and Partnerships contact.</p>
        <p><a href="mailto:matthew@unifiedesl.com">matthew@unifiedesl.com</a></p>
        <a class="ocs__btn small" href="https://www.unifiedesl.com/about" target="_blank" rel="noopener noreferrer">Meet the UESL team</a>
    </div>
    <div class="ocs__grid-cell">
        <strong>Why UESL?</strong>
        <p>UESL connects people with intellectual and developmental disabilities through gaming and technology. Our proposed contribution is a game-making activity where participants can create, experiment, and learn at their own pace.</p>
        <a class="ocs__btn small" href="https://www.unifiedesl.com/" target="_blank" rel="noopener noreferrer">UESL website</a>
    </div>
    <div class="ocs__grid-cell">
        <strong>What we want to learn</strong>
        <p>Which activities, controls, and accessibility settings would help your participants most?</p>
        <p>We are seeking Matthew's feedback on the prototype and its fit for UESL. A rollout or partnership has not been confirmed.</p>
    </div>
</div>

<h2 id="two-minute-demo">How GameMaker works</h2>

**Create → play → keep improving.** Choose a builder, try an idea, and see it come to life. Our goal is to make game creation an approachable way for UESL participants to experiment and learn.

<div class="ocs__grid ocs__grid--col2" markdown="1">
<div class="ocs__grid-cell" markdown="1">

**How it connects**

```mermaid
flowchart TB
    accTitle: GameMaker frontend and backend
    accDescr: The frontend saves game workspaces in browser storage. Login and profile requests go to Flask, which uses SQLAlchemy models to read and update SQLite.
    frontend["Frontend<br/>Jekyll + shared OCS<br/>Play · Login · Profile"]
    local[("Browser storage<br/>Game workspaces")]
    api["Flask backend<br/>Login + profile APIs"]
    models["SQLAlchemy models<br/>Read and write data"]
    db[("SQLite database<br/>Account data")]

    frontend <-->|Game saves| local
    frontend <-->|Account data| api
    api <--> models
    models <--> db
```

The **frontend** runs the builder and gameplay. **Flask** handles login and profile requests, and **SQLAlchemy models** read and update the **SQLite database**. Game workspaces currently stay in browser storage; connecting them to accounts is planned.

</div>
<div class="ocs__grid-cell">
<strong>01 · Create a game</strong>
<p>Choose OpenCS Workbench, Open World, or Racing. Customize characters, environments, and settings in one workspace.</p>
<hr>
<strong>02 · Play and improve</strong>
<p>In OpenCS Workbench, turn your choices into code and run the game alongside it. Stop, adjust a choice, and try again to see what changes.</p>
<hr>
<strong>03 · Save and return</strong>
<p>Keep a workspace in the current browser and return to it later. Login and profile updates are stored separately through the backend.</p>
<hr>
<strong>Next · Build together</strong>
<p>Guided controls, account-connected game saves, multiplayer, and chat are planned. Feedback from UESL participants will help shape what comes next.</p>
</div>
</div>

<h2 id="team-kanban">Team Kanban</h2>

{% assign game_maker_board = site.data.uesl_game_maker.Board %}
{% include ocs_kanban_board.html url=game_maker_board.url filter=game_maker_board.filter %}

<div class="ocs__links ocs__links--wide">
    <a class="ocs__btn alert-green fill large" href="https://github.com/GameMaker-CSP/Frontend/issues/1" target="_blank" rel="noopener noreferrer">Open Sprint Plan</a>
    <a class="ocs__btn large" href="https://github.com/GameMaker-CSP/Frontend" target="_blank" rel="noopener noreferrer">Team Repository</a>
    <a class="ocs__btn large" href="https://github.com/Malware-Madness/MalwareMadness" target="_blank" rel="noopener noreferrer">Original Project</a>
</div>

<br>

<div class="ocs__grid ocs__grid--card cols-3">
    <div class="ocs__grid-cell ocs__grid-cell--header">Project Direction</div>

    <div class="ocs__grid-cell ocs__grid-cell--accent">
        <strong>Current strengths</strong>
        <p>The local prototype brings OpenCS Workbench, Open World, and Racing together with previews and browser saves. Flask login and profile updates connect to SQLite; inherited builder account saving still needs integration.</p>
    </div>

    <div class="ocs__grid-cell">
        <strong>User problem</strong>
        <p>First-time participants can face too many technical choices at once, making it difficult to reach a confident first playable result.</p>
    </div>

    <div class="ocs__grid-cell">
        <strong>Sprint direction</strong>
        <p>The original guided-mode sprint below remains a plan: one meaningful choice at a time while keeping the advanced editor available. Login/profile work is tracked separately; multiplayer and chat are future ideas, outside the current demo.</p>
    </div>
</div>

<br>

---

## Planned six-step experience

These are acceptance criteria for the guided mode, not the current Play walkthrough above.

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
        <a class="ocs__btn small" href="https://github.com/GameMaker-CSP/Frontend/issues/2" target="_blank" rel="noopener noreferrer">Rohan's Issue</a>
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
        <a class="ocs__btn small" href="https://github.com/GameMaker-CSP/Frontend/issues/3" target="_blank" rel="noopener noreferrer">Ishan's Issue</a>
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
        <a class="ocs__btn small" href="https://github.com/GameMaker-CSP/Frontend/issues/4" target="_blank" rel="noopener noreferrer">Adhvay's Issue</a>
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
        <p>To do → In progress → In review → Done. Future work stays in Backlog.</p>
        <p>Each pull request links its issue, lists its tests, receives teammate review, and records the resulting revision.</p>
    </div>
</div>

<br>

---

## Testing and CSP evidence

<div class="ocs__grid ocs__grid--card cols-3">
    <div class="ocs__grid-cell ocs__grid-cell--header">Demo Readiness</div>

    <div class="ocs__grid-cell ocs__grid-cell--accent">
        <strong>Guided-mode acceptance target</strong>
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
    <a class="ocs__btn alert-green fill" href="https://github.com/GameMaker-CSP/Frontend/issues/1" target="_blank" rel="noopener noreferrer">View Team Plan</a>
    <a class="ocs__btn" href="https://github.com/GameMaker-CSP/Frontend" target="_blank" rel="noopener noreferrer">View Repository</a>
</div>
