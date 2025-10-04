---
layout: post
title: 3.15 Escape Room
description: AP CSP 3.15 — Random Values
type: objectives
comments: false
permalink: /3.15/homepage
---

# 🗝️ CSP Escape Room — 3.15 Random Values

<p class="tagline">Choose a door to enter a lesson section.</p>

<div class="room">
  <!-- Door 1: CSP Pseudocode -->
  <a class="door" href="level1-pseudocode" aria-label="Door 1: Random Values — CSP Pseudocode">
    <div class="door-frame">
      <div class="door-leaf">
        <span class="knob" aria-hidden="true"></span>
      </div>
    </div>
    <div class="door-label">
      <div class="badge">Door 1</div>
      <h3>Random Values — CSP Pseudocode</h3>
      <p>AP CSP expectations, <code>RANDOM(a,b)</code> behavior, Level 1 lock</p>
    </div>
  </a>

  <!-- Door 2: Python -->
  <a class="door" href="level2-python" aria-label="Door 2: Python — Random Lab & Quiz">
    <div class="door-frame">
      <div class="door-leaf">
        <span class="knob" aria-hidden="true"></span>
      </div>
    </div>
    <div class="door-label">
      <div class="badge">Door 2</div>
      <h3>Python — Random Lab & Quiz</h3>
      <p><code>randint</code>, list sampling/shuffle, mini-quiz, small sandbox</p>
    </div>
  </a>

  <!-- Door 3: JavaScript -->
  <a class="door" href="level3-javascript" aria-label="Door 3: JavaScript — Spinner Builder">
    <div class="door-frame">
      <div class="door-leaf">
        <span class="knob" aria-hidden="true"></span>
      </div>
    </div>
    <div class="door-label">
      <div class="badge">Door 3</div>
      <h3>JavaScript — Spinner Builder</h3>
      <p><code>Math.random()</code>, if/else mapping, drag-and-drop final lock</p>
    </div>
  </a>
<style>
:root{
  --bg: #0e1220;
  --wall: #111735;
  --mold: #1a2148;
  --card: #141a2f;
  --text: #e9eefc;
  --muted: #bac7e8;
  --accent: #8ab4ff;
  --badge: rgba(138,180,255,.14);
}

/* Page */
body, .jp-RenderedHTMLCommon { color: var(--text); }
.tagline { color: var(--muted); margin: .25rem 0 1.25rem; }

/* Room / wall background */
.room{
  background:
    radial-gradient(800px 400px at 80% -10%, #1b2347 0%, var(--bg) 60%),
    linear-gradient(180deg, var(--wall) 0%, #0b1026 100%);
  border: 1px solid rgba(255,255,255,.06);
  border-radius: 24px;
  padding: 20px;
  display: grid;
  gap: 18px;
  grid-template-columns: repeat(12, 1fr);
  box-shadow: 0 18px 40px rgba(0,0,0,.45);
}
@media (max-width: 1100px){ .room{ grid-template-columns: repeat(8,1fr); } }
@media (max-width: 820px){  .room{ grid-template-columns: repeat(4,1fr); } }

/* Door card */
.door{
  grid-column: span 4; /* 3 per row on desktop */
  text-decoration: none; color: inherit;
  background: linear-gradient(145deg, rgba(255,255,255,.04), rgba(255,255,255,.02));
  border: 1px solid rgba(255,255,255,.08);
  border-radius: 20px;
  overflow: hidden;
  display: grid;
  grid-template-rows: 220px auto;
  transition: transform .18s ease, box-shadow .18s ease, border-color .18s ease;
}
.door:hover{
  transform: translateY(-4px);
  border-color: rgba(255,255,255,.14);
  box-shadow: 0 14px 32px rgba(0,0,0,.45);
}

/* Physical door illustration */
.door-frame{
  background: linear-gradient(180deg, var(--mold) 0%, #0f1536 100%);
  padding: 18px;
  display: flex; align-items: center; justify-content: center;
}
.door-leaf{
  width: 70%; height: 90%;
  background: linear-gradient(160deg, #2a356e 0%, #1c2553 70%);
  border: 2px solid rgba(255,255,255,.14);
  border-radius: 8px;
  position: relative;
  transform-origin: left center;
  transition: transform .3s ease;
  box-shadow: inset 0 0 0 1px rgba(0,0,0,.35), 0 8px 18px rgba(0,0,0,.45);
}
.door:hover .door-leaf{
  transform: perspective(800px) rotateY(-14deg);
}
.knob{
  position: absolute; right: 12px; top: 50%; transform: translateY(-50%);
  width: 12px; height: 12px; border-radius: 50%;
  background: radial-gradient(circle at 30% 30%, #ffd27a, #b8860b 70%);
  box-shadow: 0 0 6px rgba(255,210,122,.6);
}

/* Labels */
.door-label{ padding: 14px 16px 16px; }
.badge{
  display: inline-block; font-size: 12px; letter-spacing: .6px; text-transform: uppercase;
  color: #cfe7ff; background: var(--badge); padding: 6px 10px; border-radius: 999px;
  border: 1px solid rgba(138,180,255,.32);
}
.door-label h3{ margin: 8px 0 2px; font-size: 1.15rem; }
.door-label p{ margin: 0; color: var(--muted); font-size: .92rem; }

/* Helper note */
.help{
  margin-top: 14px; padding: 12px 14px; border-radius: 12px;
  background: rgba(255,255,255,.04); border: 1px solid rgba(255,255,255,.08);
  color: var(--muted); font-size: .95rem;
}

/* Jupyter/VS Code preview tweaks (optional safety) */
.jp-RenderedHTMLCommon .room a { cursor: pointer; }
</style>
