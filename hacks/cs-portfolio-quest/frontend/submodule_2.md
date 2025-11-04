---
layout: cs-portfolio-lesson
title: "Markdown to HTML & Full Stack"
description: "Submodule 2 of Frontend Development Mini-Quest"
permalink: /cs-portfolio-quest/frontend/submodule_2/
parent: "Frontend Development"
team: "Creators"
submodule: 2
categories: [CSP, Submodule, HTML]
tags: [markdown, html, fullstack]
author: "Creators Team"
date: 2025-10-21
breadcumb: true 
---


<link href="https://cdn.quilljs.com/1.3.7/quill.snow.css" rel="stylesheet">
<script src="https://cdn.quilljs.com/1.3.7/quill.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>

<style>
  body {
    font-family: 'Inter', sans-serif;
    color: white;
    margin: 0;
    overflow-x: hidden;
    perspective: 1200px; /* for 3D tilt */
  }

  section {
    padding: 60px 20px;
    text-align: center;
  }

  .hero {
    background: linear-gradient(135deg, #2563eb, #9333ea, #14b8a6);
    background-size: 200% 200%;
    animation: gradientShift 8s ease infinite;
    padding: 100px 20px;
    color: white;
    border-radius: 0 0 3rem 3rem;
  }

  @keyframes gradientShift {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }

  h1, h2, h3 {
    font-weight: 700;
  }

  .infographic {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 100px;
    margin-top: 50px;
    position: relative;
    z-index: 2;
  }

  /* base info-card preserved */
  .info-card {
    position: relative;
    width: 280px;
    padding: 25px;
    border-radius: 18px;
    background: linear-gradient(145deg, #1e3a8a, #9333ea);
    color: #f3f4f6;
    box-shadow: 0 6px 20px rgba(0,0,0,0.3);
    transition: transform 0.3s ease, background 0.3s ease, box-shadow 0.3s ease;
    cursor: pointer;
    overflow: visible;
    transform-style: preserve-3d;
  }

  .info-card .inner {
    transform-style: preserve-3d;
    transition: transform 0.15s ease-out;
  }

  .info-card:hover {
    transform: translateY(-10px) scale(1.02);
    background: linear-gradient(145deg, #14b8a6, #2563eb);
    box-shadow: 0 12px 30px rgba(0,0,0,0.5);
  }

  .info-icon {
    font-size: 50px;
    margin-bottom: 15px;
    transform: translateZ(30px);
  }

  /* Tooltip (fade + scale) */
  .tooltip {
    position: absolute;
    bottom: -110px;
    left: 50%;
    transform: translateX(-50%) translateY(10px) scale(0.96);
    background: rgba(15, 23, 42, 0.95);
    color: #e2e8f0;
    padding: 10px 15px;
    border-radius: 10px;
    width: 92%;
    font-size: 14px;
    opacity: 0;
    pointer-events: none;
    transition: all 280ms cubic-bezier(.2,.9,.2,1);
    box-shadow: 0 6px 18px rgba(0,0,0,0.35);
    transform-origin: center top;
    z-index: 30;
  }

  .info-card:hover .tooltip {
    bottom: -120px;
    opacity: 1;
    pointer-events: auto;
    transform: translateX(-50%) translateY(0) scale(1);
  }

  /* subtle float animation */
  @keyframes floaty {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-6px); }
  }

  .info-card {
    animation: floaty 6s ease-in-out infinite;
  }

  .section-divider {
    margin: 60px auto;
    width: 70%;
    height: 3px;
    background: linear-gradient(90deg, #9333ea, #14b8a6);
    border-radius: 10px;
  }

  .editor-container {
    margin: 120px auto 
    background: #1e293b;
    border-radius: 16px;
    padding: 30px;
    max-width: 900px;
    box-shadow: 0 6px 20px rgba(0,0,0,0.4);
    position: relative;
  }

  #editor, #htmlPreview {
    background: #0f172a;
    border-radius: 12px;
    min-height: 200px;
    padding: 5px;
    color: #e2e8f0;
  }

  #htmlPreview {
    border: 1px solid #475569;
    margin-top: 60px;
  }

  .split-view {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    justify-content: center;
  }

  .split-view > div {
    flex: 1;
    min-width: 400px;
  }

  .card {
    background: linear-gradient(145deg, #111827, #1f2937);
    padding: 30px;
    border-radius: 16px;
    box-shadow: 0 6px 15px rgba(0,0,0,0.3);
    width: 420px;
    margin: 20px auto;
    transform-style: preserve-3d;
    transition: transform 0.18s ease, box-shadow 0.18s ease;
  }

  input, textarea, button {
    width: 100%;
    margin-top: 10px;
    padding: 12px;
    font-size: 16px;
    border-radius: 10px;
    border: 1px solid #475569;
    background: #0f172a;
    color: #f3f4f6;
  }

  button {
    background: linear-gradient(135deg, #2563eb, #9333ea);
    border: none;
    font-weight: bold;
    cursor: pointer;
    transition: transform 0.3s ease, background 0.3s ease;
  }

  button:hover {
    transform: scale(1.03);
    background: linear-gradient(135deg, #14b8a6, #2563eb);
  }

  .message {
    margin-top: 15px;
    font-weight: bold;
  }

  /* ---------------- New interactive & accessibility styles ---------------- */

  /* connecting svg lines behind infographic */
  .infographic-svg {
    position: absolute;
    inset: 0;
    pointer-events: none;
    z-index: 1;
  }

  /* card tilt highlight layer */
  .card-glow {
    position: absolute;
    inset: 0;
    pointer-events: none;
    border-radius: 18px;
    mix-blend-mode: screen;
    opacity: 0;
    transition: opacity 220ms ease;
  }

  .info-card:hover .card-glow { opacity: 0.25; }

  /* markdown source panel (syntax highlighted) */
  .md-source {
    background: rgba(2,6,23,0.6);
    border: 1px solid rgba(71,85,105,0.6);
    border-radius: 10px;
    padding: 12px;
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, "Roboto Mono", monospace;
    font-size: 13px;
    color: #e2e8f0;
    white-space: pre-wrap;
    word-break: break-word;
    display: none; /* toggleable */
    max-height: 260px;
    overflow: auto;
  }

  .md-source.show { display: block; }

  .md-h1 { color: #93c5fd; font-weight:700; }
  .md-h2 { color: #a78bfa; font-weight:700; }
  .md-strong { color: #fef08a; font-weight:700; }
  .md-em { color: #c7d2fe; font-style: italic; }
  .md-link { color: #60a5fa; text-decoration: underline; }
  .md-code { color: #34d399; background: rgba(255,255,255,0.02); padding: 2px 6px; border-radius:6px; }

  /* grammar underline & tooltip */
  .grammar-underline {
    text-decoration: underline wavy #f87171;
    text-decoration-thickness: 2px;
    cursor: help;
    position: relative;
  }

  .grammar-sugg {
    position: absolute;
    background: rgba(2,6,23,0.98);
    color: #e2e8f0;
    padding: 8px 10px;
    border-radius: 8px;
    top: -45px;
    left: 0;
    white-space: nowrap;
    font-size: 13px;
    transform: translateY(6px) scale(0.96);
    opacity: 0;
    pointer-events: none;
    transition: all 180ms ease;
    box-shadow: 0 6px 18px rgba(0,0,0,0.5);
    z-index: 60;
  }

  .grammar-underline:hover .grammar-sugg {
    opacity: 1;
    transform: translateY(0) scale(1);
    pointer-events: auto;
  }

  /* particle canvas overlay */
  #particleCanvas {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 5;
  }

  /* small UI controls for toggles */
  .interactive-controls {
    position: fixed;
    right: 18px;
    bottom: 18px;
    z-index: 200;
    display: flex;
    gap: 10px;
    flex-direction: column;
  }

  .control {
    background: linear-gradient(135deg, #111827, #0f172a);
    border-radius: 12px;
    padding: 10px;
    box-shadow: 0 8px 24px rgba(2,6,23,0.6);
    border: 1px solid rgba(71,85,105,0.25);
    color: #e2e8f0;
    font-size: 13px;
    cursor: pointer;
  }

  .control input[type="checkbox"] { margin-right: 8px; }

  /* parallax layers (subtle) */
  .parallax-layer {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    pointer-events: none;
    z-index: 0;
    opacity: 0.06;
    background-repeat: no-repeat;
    background-position: center top;
    transform: translateZ(-1px) scale(1.2);
  }

  /* responsive adjustments */
  @media (max-width: 900px) {
    .infographic-svg { display: none; }
    .parallax-layer { display: none; }
    .md-source { max-height: 180px; }
  }

</style>

## Lesson Objectives

By the end of this lesson, you will be able to:

- Explain the relationship between Markdown and HTML in web development.
- Identify key differences between Markdown syntax and HTML tags.
- Convert Markdown content into HTML manually and using automated tools.
- Understand how frontend rendering connects to backend data handling in a full-stack environment.
- Reflect on the advantages of using Markdown for project documentation and web publishing.


## Why Convert Markdown to HTML?
- Markdown is **simple and easy to read** for humans.  
- HTML is **structured and readable by browsers**.  
- Conversion makes it possible to **write quickly** while still producing **web-ready content**.  

Markdown lets writers focus on content, while HTML focuses on how that content looks on a webpage.

<section>
  <h2>Visual Infographic: Markdown → HTML Conversion</h2>

  <!-- SVG connector lines between cards -->
  <svg class="infographic-svg" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"></svg>

  <div class="infographic" id="infographic">
    <div class="info-card" data-extra="Writers use Markdown for clear, minimal syntax to focus on content rather than styling.">
      <div class="inner">
        <div class="info-icon">📝</div>
        <h3>1️⃣ Write Markdown</h3>
        <p>Simple text with symbols like <code>**bold**</code> or <code># headings</code>.</p>
        <div class="tooltip">Writers use Markdown for clear, minimal syntax to focus on content rather than styling.</div>
        <div class="card-glow"></div>
      </div>
    </div>

    <div class="info-card" data-extra="These tools translate plain text Markdown into HTML — ready to render in browsers.">
      <div class="inner">
        <div class="info-icon">⚙️</div>
        <h3>2️⃣ Conversion Tool</h3>
        <p>Engines like <strong>Jekyll</strong> or <strong>Markdown-it</strong> parse syntax and structure it.</p>
        <div class="tooltip">These tools translate plain text Markdown into HTML — ready to render in browsers.</div>
        <div class="card-glow"></div>
      </div>
    </div>

    <div class="info-card" data-extra="The output HTML is styled with CSS, responsive, and ready for deployment.">
      <div class="inner">
        <div class="info-icon">🌐</div>
        <h3>3️⃣ HTML Output</h3>
        <p>Markdown becomes styled, accessible web content — ready for browsers.</p>
        <div class="tooltip">The output HTML is styled with CSS, responsive, and ready for deployment.</div>
        <div class="card-glow"></div>
      </div>
    </div>
  </div>
</section>

## Basic Markdown Syntax

| Markdown | HTML Output | Example |
|-----------|--------------|----------|
| `# Heading 1` | `<h1>Heading 1</h1>` | Heading 1 |
| `## Heading 2` | `<h2>Heading 2</h2>` | Heading 2 |
| `**Bold Text**` | `<strong>Bold Text</strong>` | **Bold Text** |
| `*Italic Text*` | `<em>Italic Text</em>` | *Italic Text* |
| `[Link Text](https://example.com)` | `<a href="https://example.com">Link Text</a>` | [Link Text](https://example.com) |
| `- List Item` | `<ul><li>List Item</li></ul>` | - List Item |

These examples show how simple Markdown commands translate directly into HTML elements.

---

## How Conversion Works
1. You write Markdown in a `.md` file.  
2. A conversion tool (like **Jekyll**, **Markdown-it**, or **Python-Markdown**) parses the Markdown syntax.  
3. The tool automatically generates HTML output, which can then be styled with CSS or embedded into a webpage.

This process is used by platforms like **GitHub Pages**, **Notion**, and **Obsidian** to render formatted documents.

---

## Real-World Uses
- **GitHub:** README.md files automatically render as HTML.  
- **Blogging Platforms:** Markdown posts are converted to static HTML.  
- **Documentation:** Tools like MkDocs and Sphinx use Markdown for content creation.  
- **Static Site Generators:** Markdown powers entire websites when compiled into HTML.

---


<section>
  <h2>WordQuill Helper</h2>
  <p>Try typing Markdown below — watch your formatted HTML appear live!</p>

  <div class="editor-container">
    <div style="display:flex; gap:12px; align-items:center; justify-content:center; margin-bottom:12px;">
      <button id="toggleSource" class="control" title="Toggle Markdown source view">Toggle Markdown Source</button>
      <button id="toggleParticles" class="control" title="Toggle particle hover effects">Particles: <span id="particlesState">On</span></button>
      <label class="control" title="Toggle hover sound"><input type="checkbox" id="toggleSound" checked /> Sound</label>
    </div>

    <div class="split-view">
      <div style="min-width:360px;max-width:520px;">
        <h3>Markdown Editor</h3>
        <div id="editor"></div>

        <!-- Markdown source (syntax highlighted) -->
        <div id="mdSource" class="md-source" aria-hidden="true"></div>
      </div>

      <div>
        <h3> HTML Preview</h3>
        <div id="htmlPreview" aria-live="polite"></div>
      </div>
    </div>

    <!-- particle canvas overlays the whole editor container -->
    <canvas id="particleCanvas"></canvas>
  </div>
</section>

<div class="section-divider"></div>

---

## Summary
Markdown is fast to write, clean to read, and perfect for creating web content.  
HTML provides the structure that browsers need to display it properly.  
Learning how Markdown converts to HTML helps bridge writing and web development skills.

---
## Introduction to Full Stack Development (Part 1 — The Frontend)


## Overview
In full stack development, the **frontend** is the part of the system responsible for interacting with users and communicating with the backend through APIs.  
This lesson introduces how the frontend fits into a full stack workflow — including how it sends and receives data, manages user interfaces, and maintains synchronization with backend services.

---

## Learning Objectives
By the end of this lesson, you should be able to:
- Describe the role of the frontend in a full stack application.
- Understand how the frontend connects to backend endpoints (APIs).
- Identify key technologies used in full stack frontends (HTML, CSS, JS, frameworks).
- Build a simple user interface that sends data to and retrieves data from a backend.

---

## The Frontend in the Full Stack Pipeline

A **full stack application** has three main layers:

| Layer | Description | Example Technologies |
|--------|--------------|----------------------|
| **Frontend (Client)** | Displays information to users and collects input | HTML, CSS, JavaScript, React, Vue |
| **Backend (Server)** | Handles logic, authentication, and routes | Flask, Node.js, Django |
| **Database** | Stores and retrieves persistent data | SQLite, PostgreSQL, MongoDB |

The **frontend’s job** in this system is to:
1. Present data from the backend in a structured and styled way.
2. Collect user input and send it to backend routes (usually through HTTP requests).
3. React to backend responses by updating what’s shown on the page.

---
<section>
  <h2>Full Stack Infographic</h2>
  <p>Every part of a web app — from visuals to logic — plays a role.</p>

  <div class="infographic" id="infographic2" style="margin-top:12px;">
    <div class="info-card" data-extra="Responsible for layout, visuals, and data presentation.">
      <div class="inner">
        <div class="info-icon">🎨</div>
        <h3>Frontend</h3>
        <p>What users see and interact with — HTML, CSS, JavaScript.</p>
        <div class="tooltip">Responsible for layout, visuals, and data presentation.</div>
      </div>
    </div>

    <div class="info-card" data-extra="Manages authentication, logic, and communication with the database.">
      <div class="inner">
        <div class="info-icon">⚙️</div>
        <h3>Backend</h3>
        <p>Server logic, APIs, data handling with Flask or Node.js.</p>
        <div class="tooltip">Manages authentication, logic, and communication with the database.</div>
      </div>
    </div>

    <div class="info-card" data-extra="Handles all data storage and retrieval through structured queries.">
      <div class="inner">
        <div class="info-icon">🗃️</div>
        <h3>Database</h3>
        <p>Stores persistent data — SQLite, PostgreSQL, MongoDB.</p>
        <div class="tooltip">Handles all data storage and retrieval through structured queries.</div>
      </div>
    </div>
  </div>
</section>

<div class="section-divider"></div>

<section>
  <h2>Student Free Response</h2>
  <p>Review the HTML and JavaScript code from this lesson. Explain how it demonstrates *frontend–backend interaction* in a full stack system.  .</p>

  <div class="card" id="responseCard">
    <input type="text" id="name" placeholder="Your name" />
    <textarea id="response" placeholder="Type your response here..." rows="5"></textarea>
    <button id="submitBtn">Submit</button>
    <div class="message" id="message"></div>
  </div>
</section>

<script type="module">
  import { javaURI } from '/assets/js/api/config.js';

  document.addEventListener("DOMContentLoaded", () => {
    /* -------------------- Editor Setup (Quill + marked) -------------------- */
    const quill = new Quill('#editor', { theme: 'snow' });
    const htmlPreview = document.getElementById("htmlPreview");
    const mdSource = document.getElementById("mdSource");
    const toggleSourceBtn = document.getElementById("toggleSource");
    const toggleParticlesBtn = document.getElementById("toggleParticles");
    const particlesStateText = document.getElementById("particlesState");
    const toggleSoundCB = document.getElementById("toggleSound");
    const particleCanvas = document.getElementById("particleCanvas");

    // Initialize sizes for canvas overlay
    function resizeCanvas() {
      particleCanvas.width = particleCanvas.clientWidth * devicePixelRatio;
      particleCanvas.height = particleCanvas.clientHeight * devicePixelRatio;
      ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
    }
    const ctx = particleCanvas.getContext('2d');

    // Basic particle system (spawn near mouse on hover)
    let particlesEnabled = true;
    let particles = [];
    const maxParticles = 120;

    function particleTick() {
      ctx.clearRect(0, 0, particleCanvas.width, particleCanvas.height);
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.vx *= 0.99;
        p.vy *= 0.99;
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 1;
        ctx.beginPath();
        ctx.globalAlpha = Math.max(0, p.life / p.maxLife);
        const size = Math.max(0.5, p.life / p.maxLife * p.size);
        ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
        if (p.life <= 0) particles.splice(i, 1);
      }
      requestAnimationFrame(particleTick);
    }

    function spawnParticles(x, y) {
      if (!particlesEnabled) return;
      for (let i = 0; i < 8; i++) {
        if (particles.length > maxParticles) break;
        particles.push({
          x, y,
          vx: (Math.random() - 0.5) * 6,
          vy: (Math.random() - 0.5) * 6,
          life: 40 + Math.random() * 30,
          maxLife: 70 + Math.random() * 40,
          size: 6 + Math.random() * 8,
          color: `rgba(${200 + Math.floor(Math.random()*55)}, ${120 + Math.floor(Math.random()*80)}, ${200 + Math.floor(Math.random()*55)}, 1)`
        });
      }
    }

    // Sound setup (tiny hover sound)
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    function playHoverSound() {
      if (!toggleSoundCB.checked) return;
      const o = audioCtx.createOscillator();
      const g = audioCtx.createGain();
      o.type = 'sine';
      const now = audioCtx.currentTime;
      o.frequency.setValueAtTime(880, now);
      o.frequency.exponentialRampToValueAtTime(1320, now + 0.08);
      g.gain.setValueAtTime(0.0001, now);
      g.gain.exponentialRampToValueAtTime(0.08, now + 0.01);
      g.gain.exponentialRampToValueAtTime(0.0001, now + 0.12);
      o.connect(g);
      g.connect(audioCtx.destination);
      o.start(now);
      o.stop(now + 0.14);
    }

    // Resize canvas to editor container
    function attachCanvasToEditor() {
      const editorContainer = document.querySelector('.editor-container');
      particleCanvas.style.width = editorContainer.clientWidth + 'px';
      particleCanvas.style.height = editorContainer.clientHeight + 'px';
      particleCanvas.style.left = editorContainer.offsetLeft + 'px';
      particleCanvas.style.top = editorContainer.offsetTop + 'px';
      resizeCanvas();
    }
    attachCanvasToEditor();
    window.addEventListener('resize', attachCanvasToEditor);

    particleTick(); // start animation loop

    // Simple Markdown syntax highlighter using regex (safe & client-side)
    function highlightMarkdown(raw) {
      // escape HTML
      const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
      let s = esc(raw);

      // headings
      s = s.replace(/^###### (.*$)/gim, '<span class="md-h6">###### $1</span>');
      s = s.replace(/^##### (.*$)/gim, '<span class="md-h5">##### $1</span>');
      s = s.replace(/^#### (.*$)/gim, '<span class="md-h4">#### $1</span>');
      s = s.replace(/^### (.*$)/gim, '<span class="md-h3">### $1</span>');
      s = s.replace(/^## (.*$)/gim, '<span class="md-h2">## $1</span>');
      s = s.replace(/^# (.*$)/gim, '<span class="md-h1"># $1</span>');

      // bold **text**
      s = s.replace(/\*\*(.*?)\*\*/gim, '<span class="md-strong">**$1**</span>');

      // italic *text*
      s = s.replace(/\*(.*?)\*/gim, '<span class="md-em">*$1*</span>');

      // inline code `code`
      s = s.replace(/`([^`]+)`/gim, '<span class="md-code">`$1`</span>');

      // links [text](url)
      s = s.replace(/\[([^\]]+)\]\(([^)]+)\)/gim, '<span class="md-link">[$1]($2)</span>');

      // lists - or numbered
      s = s.replace(/^(\s*[-*+] .*)$/gim, '<span class="md-list">$1</span>');
      s = s.replace(/^(\s*\d+\..*)$/gim, '<span class="md-list">$1</span>');

      return s;
    }

    // Grammar checking using LanguageTool
    async function callGrammarAPI(text) {
      try {
        const res = await fetch("https://api.languagetool.org/v2/check", {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams({ text, language: "en-US" })
        });
        return await res.json();
      } catch (err) {
        console.error("Grammar API error", err);
        return null;
      }
    }

    // Convert matches to offsets and prepare mapped markup in Quill -> previewed source
    function applyGrammarToSource(rawText, matches) {
      // We will produce an HTML string for mdSource where grammar suggestions are underlined
      if (!matches || !matches.length) return highlightMarkdown(rawText);

      // sort matches by offset ascending
      const sorted = [...matches].sort((a,b)=>a.offset - b.offset);
      let out = '';
      let cursor = 0;
      for (const m of sorted) {
        if (m.offset > cursor) {
          out += escapeHtml(rawText.slice(cursor, m.offset));
        }
        const matchedText = rawText.slice(m.offset, m.offset + m.length);
        const suggestion = (m.replacements && m.replacements[0] && m.replacements[0].value) || m.message || "Suggestion";
        out += `<span class="grammar-underline">${escapeHtml(matchedText)}<span class="grammar-sugg" role="tooltip">${escapeHtml(suggestion)}</span></span>`;
        cursor = m.offset + m.length;
      }
      if (cursor < rawText.length) out += escapeHtml(rawText.slice(cursor));
      // Now run basic markdown highlighting for the rest (we will style grammar pieces already present)
      // Simple approach: wrap grammar spans back into the highlighted markup by passing through highlightMarkdown, but avoid double-escaping by temporarily marking grammar spans
      out = out.replace(/<span class="grammar-underline">/g, '___GRAM_START___');
      out = out.replace(/<span class="grammar-sugg"/g, '___GRAM_SUGG_START___');
      out = highlightMarkdown(out);
      // restore grammar markers
      out = out.replace(/___GRAM_START___/g, '<span class="grammar-underline">');
      out = out.replace(/___GRAM_SUGG_START___/g, '<span class="grammar-sugg"');
      return out;
    }

    function escapeHtml(str) {
      return str.replace(/&/g, "&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
    }

    // Keep a local debounce timer for grammar calls
    let grammarTimer;
    let lastMatches = [];

    quill.on('text-change', () => {
      const raw = quill.getText();
      // Update HTML preview (original behavior)
      htmlPreview.innerHTML = marked.parse(raw);

      // Update raw highlighted markdown source
      mdSource.innerHTML = highlightMarkdown(raw);

      // Debounced grammar check (1.2s)
      clearTimeout(grammarTimer);
      grammarTimer = setTimeout(async () => {
        const data = await callGrammarAPI(raw);
        lastMatches = (data && data.matches) || [];
        // apply grammar to mdSource HTML
        mdSource.innerHTML = applyGrammarToSource(raw, lastMatches);
      }, 1200);
    });

    // Toggle source view
    let sourceShown = false;
    toggleSourceBtn.addEventListener('click', () => {
      sourceShown = !sourceShown;
      mdSource.classList.toggle('show', sourceShown);
      toggleSourceBtn.textContent = sourceShown ? 'Hide Markdown Source' : 'Toggle Markdown Source';
    });

    // ---------------- 3D tilt and glow on cards + lines ----------------
    function mapRange(v, a, b, c, d) { return c + (d - c) * ((v - a) / (b - a)); }
    function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }

    const allInfoCards = document.querySelectorAll('.info-card');
    const svg = document.querySelector('.infographic-svg');

    // draw connecting curved lines between card centers (3 cards in first row)
    function updateConnectors() {
      const cards = Array.from(document.querySelectorAll('#infographic .info-card'));
      svg.innerHTML = '';
      // draw lines between card 0 -> 1, 1 -> 2 (centered bezier)
      for (let i = 0; i < cards.length - 1; i++) {
        const a = cards[i].getBoundingClientRect();
        const b = cards[i+1].getBoundingClientRect();
        const container = document.querySelector('section');
        const svgRect = svg.getBoundingClientRect();
        const ax = (a.left + a.right)/2 - svgRect.left;
        const ay = (a.top + a.bottom)/2 - svgRect.top;
        const bx = (b.left + b.right)/2 - svgRect.left;
        const by = (b.top + b.bottom)/2 - svgRect.top;
        const mx = (ax + bx)/2;
        const controlYOffset = clamp(Math.abs(bx - ax) * 0.14, 40, 120);
        const path = document.createElementNS('http://www.w3.org/2000/svg','path');
        const d = `M ${ax} ${ay} C ${mx} ${ay - controlYOffset} ${mx} ${by - controlYOffset} ${bx} ${by}`;
        path.setAttribute('d', d);
        path.setAttribute('stroke', 'rgba(167,139,250,0.32)');
        path.setAttribute('stroke-width', '2');
        path.setAttribute('fill', 'none');
        path.setAttribute('stroke-linecap', 'round');
        svg.appendChild(path);
      }
    }
    // initial connectors after layout stabilized
    setTimeout(updateConnectors, 300);
    window.addEventListener('resize', updateConnectors);
    window.addEventListener('scroll', updateConnectors);

    // per-card mouse move tilt + glow + particle spawn + sound
    allInfoCards.forEach(card => {
      const inner = card.querySelector('.inner');
      const glow = card.querySelector('.card-glow');
      card.addEventListener('pointermove', (ev) => {
        const rect = card.getBoundingClientRect();
        const cx = rect.left + rect.width/2;
        const cy = rect.top + rect.height/2;
        const dx = ev.clientX - cx;
        const dy = ev.clientY - cy;
        const maxTilt = 12; // degrees
        const rx = clamp((-dy / (rect.height/2)) * maxTilt, -maxTilt, maxTilt);
        const ry = clamp((dx / (rect.width/2)) * maxTilt, -maxTilt, maxTilt);
        inner.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg) translateZ(6px)`;
        // simulate a soft gradient glow following cursor
        const gx = ((dx / rect.width) * 100) + 50;
        const gy = ((dy / rect.height) * 100) + 50;
        glow.style.background = `radial-gradient(circle at ${gx}% ${gy}%, rgba(255,255,255,0.06), rgba(255,255,255,0))`;
        glow.style.opacity = 1;

        // spawn particles near the mouse inside the editor area when hovering a card
        const editorRect = document.querySelector('.editor-container').getBoundingClientRect();
        const px = clamp(ev.clientX - editorRect.left, 0, editorRect.width);
        const py = clamp(ev.clientY - editorRect.top, 0, editorRect.height);
        spawnParticles(px * devicePixelRatio, py * devicePixelRatio);
      });

      card.addEventListener('pointerenter', () => {
        playHoverSound();
      });

      card.addEventListener('pointerleave', () => {
        inner.style.transform = '';
        glow.style.opacity = 0;
      });
    });

    // ---------------- Parallax subtle background on scroll ----------------
    const parallax = document.createElement('div');
    parallax.classList.add('parallax-layer');
    parallax.style.backgroundImage = 'radial-gradient(circle at 10% 10%, rgba(255,255,255,0.02), transparent 10%), radial-gradient(circle at 90% 80%, rgba(255,255,255,0.015), transparent 10%)';
    document.body.appendChild(parallax);

    window.addEventListener('scroll', () => {
      const y = window.scrollY;
      parallax.style.transform = `translateY(${y * 0.06}px) scale(1.18)`;
    });

    // ---------------- Particle & Sound toggles ----------------
    toggleParticlesBtn.addEventListener('click', () => {
      particlesEnabled = !particlesEnabled;
      particlesStateText.textContent = particlesEnabled ? 'On' : 'Off';
      toggleParticlesBtn.style.opacity = particlesEnabled ? '1' : '0.7';
    });

    // ------------------ Grammar suggestions hover on Quill output ------------------
    // When mdSource shows grammar-underline spans, their hover tooltip is handled by CSS.

    // ------------------ Editor container mouse mapping for spawn ------------------
    const editorContainer = document.querySelector('.editor-container');
    editorContainer.addEventListener('pointermove', (ev) => {
      // Get local coords
      const rect = editorContainer.getBoundingClientRect();
      const x = (ev.clientX - rect.left);
      const y = (ev.clientY - rect.top);
      // occasionally spawn soft drifting particles based on movement
      if (particlesEnabled && Math.random() < 0.04) spawnParticles(x * devicePixelRatio, y * devicePixelRatio);
    });

    // -------------------- Fetch POST logic (unchanged) --------------------
    const submitBtn = document.getElementById("submitBtn");
    const nameInput = document.getElementById("name");
    const responseInput = document.getElementById("response");
    const messageDiv = document.getElementById("message");

    submitBtn.addEventListener("click", async () => {
      const name = nameInput.value.trim();
      const response = responseInput.value.trim();

      if (!name || !response) {
        messageDiv.textContent = "Please fill in both fields.";
        messageDiv.style.color = "#f87171";
        return;
      }

      try {
        const res = await fetch(`${javaURI}/api/responses`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, response })
        });

        if (res.ok) {
          const data = await res.json();
          messageDiv.textContent = `Response saved successfully! (ID: ${data.id})`;
          messageDiv.style.color = "#4ade80";
          responseInput.value = "";
        } else {
          messageDiv.textContent = "Error submitting response.";
          messageDiv.style.color = "#facc15";
        }
      } catch (err) {
        messageDiv.textContent = "Could not connect to server.";
        messageDiv.style.color = "#f87171";
      }
    });

    // Ensure connectors & canvas positioned correctly once everything is rendered
    setTimeout(() => {
      updateConnectors();
      attachCanvasToEditor();
    }, 600);

    // Accessibility: ensure aria labels for interactive toggles
    toggleSourceBtn.setAttribute('aria-pressed', 'false');
    toggleSourceBtn.addEventListener('click', () => toggleSourceBtn.setAttribute('aria-pressed', String(sourceShown)));

    // Clean up if needed on unload
    window.addEventListener('beforeunload', () => {
      // stop audio context
      if (audioCtx && audioCtx.state !== 'closed') {
        try { audioCtx.close(); } catch(e) {}
      }
    });

  });
</script>


