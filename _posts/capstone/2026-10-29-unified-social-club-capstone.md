---
microblog: true
toc: false
layout: post
title: Unified Social Club
description: "Club games for Unified Social Club, a free social club for adults with special needs in Poway: Club Bingo, Club Trivia Live, and Club Jeopardy, with big print and hands-free Nod to select."
permalink: /capstone/unified-social-club/
year: "2026-2027"
capstone_project:
  course: CSP
  school_year: "2026-2027"
  title: "Unified Social Club"
  image: "/images/capstone/unified-social-club.png"
  description: "Club games for Poway's free social club for adults with special needs: Club Bingo, Club Trivia Live (like Kahoot), and Club Jeopardy, played together at club night or at home, with big print and hands-free Nod to select."
  team: "Triple T (Chetan Tiduwar, Aaditya Prem, Kashyap Tubati)"
  links:
    frontend: "https://github.com/Unified-Social-Club-CSP/usc-pages"
    backend: "https://github.com/Unified-Social-Club-CSP/usc-flask"
---

> [Unified Social Club](https://www.unifiedsocialclub.com/) gives adults with special needs in Poway a free, safe place to make friends: board and card games, arts and crafts, karaoke, and sports at the Mickey Cafagna Community Center (13094 Civic Center Dr, Poway). Games are the heart of every club night, so Team Triple T is building three club games members can play together on the big screen or on their own phones.

{% assign usc_board = site.data.unified_social_club.Board %}
{% include ocs_kanban_board.html url=usc_board.url filter=usc_board.filter columns=usc_board.columns %}

<div class="ocs__links ocs__links--wide">
    <a class="ocs__btn alert-green fill large" href="https://github.com/Unified-Social-Club-CSP/usc-pages/issues/1" target="_blank" rel="noopener noreferrer">Open Sprint Plan</a>
    <a class="ocs__btn large" href="https://unified-social-club-csp.github.io/usc-pages/" target="_blank" rel="noopener noreferrer">Our Live Site</a>
    <a class="ocs__btn large" href="https://www.unifiedsocialclub.com/" target="_blank" rel="noopener noreferrer">Their Website</a>
</div>

<br>

<div class="ocs__grid ocs__grid--card cols-3">
    <div class="ocs__grid-cell ocs__grid-cell--header">Who We Serve</div>
    <div class="ocs__grid-cell ocs__grid-cell--accent">
        <strong>Current strengths</strong>
        <p>Free for members, with refreshments covered by sponsors. Strong support from the City of Poway and community partners, and a clear FAQ on aides, service animals, and photo consent.</p>
    </div>
    <div class="ocs__grid-cell">
        <strong>User problem</strong>
        <p>Club dates are listed out of order with no times, there is no phone or email on the site, and nothing online lets members take part between club nights.</p>
    </div>
    <div class="ocs__grid-cell">
        <strong>Contact and history</strong>
        <p>We reach the club through the <a href="https://www.unifiedsocialclub.com/blank-4" target="_blank" rel="noopener noreferrer">volunteer registration</a> and <a href="https://www.unifiedsocialclub.com/event-list" target="_blank" rel="noopener noreferrer">club dates</a> pages. Every conversation is recorded in the microblog on this page.</p>
    </div>
</div>

<br>

---

## Three club games

> Each teammate owns one game from design through testing. Every game works on the big screen at club night and on one phone at home.

<div class="ocs__grid ocs__grid--card cols-3">
    <div class="ocs__grid-cell ocs__grid-cell--accent">
        <strong>Club Bingo · Kashyap</strong>
        <p>Big-print Bingo with a caller that reads every number out loud. Play solo or join friends with a 4-digit room code.</p>
        <p><strong>Done when:</strong> the server checks every BINGO claim and wins show on the member's profile.</p>
        <a class="ocs__btn small" href="https://github.com/Unified-Social-Club-CSP/usc-pages/issues/13" target="_blank" rel="noopener noreferrer">Kashyap's Issue</a>
    </div>
    <div class="ocs__grid-cell">
        <strong>Club Trivia Live · Chetan</strong>
        <p>A live game show like Kahoot. The host shows each question on the big screen and members answer with four big picture buttons on their phones.</p>
        <p><strong>Done when:</strong> a room of players sees one timer and one live scoreboard.</p>
        <a class="ocs__btn small" href="https://github.com/Unified-Social-Club-CSP/usc-pages/issues/14" target="_blank" rel="noopener noreferrer">Chetan's Issue</a>
    </div>
    <div class="ocs__grid-cell ocs__grid-cell--accent">
        <strong>Club Jeopardy · Aaditya</strong>
        <p>Teams take turns picking club-life categories and points. Volunteers write their own boards, and finished games are saved.</p>
        <p><strong>Done when:</strong> a volunteer's new board is playable and the server checks every saved score.</p>
        <a class="ocs__btn small" href="https://github.com/Unified-Social-Club-CSP/usc-pages/issues/15" target="_blank" rel="noopener noreferrer">Aaditya's Issue</a>
    </div>
</div>

<br>

---

## Built into every game

<div class="ocs__grid ocs__grid--card cols-3">
    <div class="ocs__grid-cell ocs__grid-cell--header">Shared Features</div>
    <div class="ocs__grid-cell ocs__grid-cell--accent">
        <strong>Nod to select</strong>
        <p>A head nod presses the highlighted button, so members who can't use a mouse play on their own.</p>
    </div>
    <div class="ocs__grid-cell">
        <strong>Easy to read</strong>
        <p>Text-size buttons that use the OCS font-size preference, plain words, pictures on every answer, and clues read out loud.</p>
    </div>
    <div class="ocs__grid-cell">
        <strong>One OCS account</strong>
        <p>OCS login with roles for members, families, and volunteers, a tap-only interest survey, and saved progress for every game.</p>
    </div>
</div>

<br>

---

## System design

> The frontend is our OCS portfolio site on GitHub Pages; the backend is OCS Flask. Each game has its own API, and all three share the OCS user table.

```mermaid
flowchart LR
    Member[Member, family, or volunteer] --> Pages[usc-pages<br>OCS portfolio site]
    Pages -->|fetch with OCS login cookie| Flask[usc-flask<br>OCS Flask API]
    Flask --> Bingo[/api/usc/bingo/]
    Flask --> Trivia[/api/usc/trivia/]
    Flask --> Jeopardy[/api/usc/jeopardy/]
    Flask --> Shared[/api/usc/profile · progress · dm/]
    Bingo --> DB[(SQLite)]
    Trivia --> DB
    Jeopardy --> DB
    Shared --> DB
```

```mermaid
erDiagram
    USERS ||--o{ USC_GAME_PROGRESS : saves
    USERS ||--o{ USC_BINGO_PLAYERS : joins
    USC_BINGO_ROOMS ||--o{ USC_BINGO_PLAYERS : has
    USERS ||--o{ USC_JEOPARDY_BOARDS : writes
    USC_JEOPARDY_BOARDS ||--o{ USC_JEOPARDY_RESULTS : records
    USERS ||--o{ USC_INTEREST_SURVEYS : answers
```

---

## Planning and iteration

<div class="ocs__grid ocs__grid--card cols-3">
    <div class="ocs__grid-cell ocs__grid-cell--header">Sprint 3</div>
    <div class="ocs__grid-cell ocs__grid-cell--accent">
        <strong>Ideate, define, prototype</strong>
        <ol>
            <li>Empathy notes and how-might-we questions for each game.</li>
            <li>Home, Login, and Survey working full-stack.</li>
            <li>A playable first version of each game.</li>
        </ol>
    </div>
    <div class="ocs__grid-cell">
        <strong>Night at the Museum</strong>
        <ol>
            <li>Talk with visitors first; demo second, under a minute.</li>
            <li>Run usability tests on all three games.</li>
            <li>Record feedback in issues and the microblog.</li>
        </ol>
    </div>
    <div class="ocs__grid-cell">
        <strong>Kanban and reviews</strong>
        <p>Backlog → To do → In progress → In review → Done, with Quick and Formal issue templates.</p>
        <p>Each pull request links its issue, lists its tests, and gets a teammate review.</p>
    </div>
</div>

<br>

---

## Testing and CSP evidence

<div class="ocs__grid ocs__grid--card cols-3">
    <div class="ocs__grid-cell ocs__grid-cell--header">Demo Readiness</div>
    <div class="ocs__grid-cell ocs__grid-cell--accent">
        <strong>Final demo path</strong>
        <p>Sign in → answer the survey → turn on Nod to select → play a round of each game → see progress saved on the profile.</p>
    </div>
    <div class="ocs__grid-cell">
        <strong>Acceptance checks</strong>
        <p>Keyboard and Nod to select · large text · phone and big screen · server-checked scores · signed-out play still works.</p>
    </div>
    <div class="ocs__grid-cell">
        <strong>CSP procedures</strong>
        <p>Kashyap: <code>checkBingo(card, called)</code>. Chetan: <code>scoreRound(answers, correctIndex, timeLimit)</code>. Aaditya: <code>scoreAnswer(teams, teamIndex, clue, choiceIndex)</code>. Each uses a list, a loop, and a condition.</p>
    </div>
</div>

<br>

<div class="ocs__links ocs__links--wide">
    <a class="ocs__btn alert-green fill" href="https://github.com/orgs/Unified-Social-Club-CSP/projects/2" target="_blank" rel="noopener noreferrer">View Kanban</a>
    <a class="ocs__btn" href="https://github.com/Unified-Social-Club-CSP/usc-pages" target="_blank" rel="noopener noreferrer">Frontend Repository</a>
    <a class="ocs__btn" href="https://github.com/Unified-Social-Club-CSP/usc-flask" target="_blank" rel="noopener noreferrer">Backend Repository</a>
</div>
