---
layout: post
title: "San Francisco"
description: "Roadtrip through SF and learn UI while you're there!"
permalink: /west-coast/analytics/sanfrancisco/
parent: "Analytics/Admin"
team: "Cool Collaborators"
submodule: 2
author: "Cool Collaborators"
date: 2025-10-21
microblog: true
footer: 
    previous:  /west-coast/analytics/sandiego/
    home: /west-coast/travel/
    next: /west-coast/analytics/seattle/
---


<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>San Francisco UI Hierarchy Tour</title>
<style>
:root{
  --sky-day:#94c8ff; --sky-dusk:#ffb8a7; --sky-night:#081a36;
  --fog:#ffffff;
  --water1:#2b5f8a; --water2:#173a57;
  --rock1:#5c6b78; --rock2:#3c4a57; --rock-edge:#22303b;
  --building:#d7d0bf; --building-deep:#bfb6a0; --roof:#8c7a63; --trim:#6e6555;
  --lighthouse:#f1f1f1; --lamp:#fff6b0;
  --vegetation:#2e6b48;
  --bridge:#c03a2b; --cable:#9a2d23;
  --stone:#c2a777; --stone-deep:#a88c5f; --cap:#8e744e; --shadow:#5e4b33;
  --bank1:#4e7e57; --bank2:#33533a; --walk1:#cdb793;
  --house1:#f6d5a9; --trim1:#5e4637; --roof1:#a67649;
  --house2:#cde4ff; --trim2:#3c5a7a; --roof2:#5b7da4;
  --house3:#ffe0e0; --trim3:#9b5c63; --roof3:#7a3e45;
  --lawn:#2f8f5b; --street:#2a2a2a;
}
*{box-sizing:border-box;margin:0;padding:0}
html{scroll-behavior:smooth}
body{font-family:system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;overflow-x:hidden;background:#0b1a3a}

/* Hero Section */
.hero{
  position:relative;
  width:100%;
  height:100vh;
  background:linear-gradient(135deg, #1a2a44 0%, #0d1b2a 100%);
  display:flex;
  flex-direction:column;
  align-items:center;
  justify-content:center;
  color:#fff;
  text-align:center;
  overflow:hidden;
}
.hero::before{
  content:'';
  position:absolute;
  inset:0;
  background:radial-gradient(circle at 50% 50%, rgba(255,215,155,0.05), transparent 70%);
  animation:pulse 4s ease-in-out infinite;
}
@keyframes pulse{0%,100%{opacity:0.3}50%{opacity:0.6}}
.hero h1{
  font-size:4em;
  margin-bottom:20px;
  background:linear-gradient(135deg, #ffd89b, #ff9a76);
  -webkit-background-clip:text;
  -webkit-text-fill-color:transparent;
  background-clip:text;
  z-index:1;
}
.hero p{
  font-size:1.5em;
  color:#e0e6ed;
  z-index:1;
}

/* Navigation */
.nav{
  position:sticky;
  top:0;
  background:rgba(13,27,42,0.95);
  backdrop-filter:blur(10px);
  padding:20px 0;
  z-index:100;
  box-shadow:0 4px 20px rgba(0,0,0,0.3);
}
.nav-links{
  display:flex;
  justify-content:center;
  gap:30px;
  list-style:none;
  flex-wrap:wrap;
}
.nav-links a{
  color:#ffd89b;
  text-decoration:none;
  font-weight:600;
  padding:10px 20px;
  border-radius:8px;
  transition:all 0.3s ease;
}
.nav-links a:hover{
  background:rgba(255,216,155,0.2);
  transform:translateY(-2px);
}
.nav-links a.hidden-nav{
  display:none;
}

/* Location Sections */
.location{
  background:#0b1a3a;
  padding:80px 20px;
  min-height:100vh;
}
.location:nth-child(even){
  background:#1a2a44;
}
.location.hidden-location{
  display:none;
}
.location-header{
  text-align:center;
  margin-bottom:60px;
}
.location-header h2{
  font-size:3.5em;
  color:#ffd89b;
  margin-bottom:15px;
}
.location-header p{
  font-size:1.3em;
  color:#e0e6ed;
}

/* Scene container */
.scene{
  position:relative;
  width:100%;
  max-width:1400px;
  height:70vh;
  margin:0 auto 60px;
  perspective:1200px;
  background:linear-gradient(to bottom,var(--sky-day),#bfe3ff 60%, #e4f1ff 100%);
  border-radius:20px;
  overflow:hidden;
  box-shadow:0 20px 60px rgba(0,0,0,0.4);
}

.sky{position:absolute;inset:0;z-index:0;}
.sky::before{content:"";position:absolute;inset:0;
  background:linear-gradient(to bottom,var(--sky-day),#bfe3ff 60%, #e4f1ff 100%);
  animation: skyCycle 60s linear infinite;
}
@keyframes skyCycle{
  0%{background:linear-gradient(to bottom,var(--sky-day),#bfe3ff 60%, #e4f1ff)}
  25%{background:linear-gradient(to bottom,var(--sky-dusk),#ffd6c9 60%, #ffe9e2)}
  50%{background:linear-gradient(to bottom,var(--sky-night),#102a57 60%, #1a3a6b)}
  75%{background:linear-gradient(to bottom,#1c3b6f 0%, #a6c6ff 60%, #d9ecff)}
  100%{background:linear-gradient(to bottom,var(--sky-day),#bfe3ff 60%, #e4f1ff)}
}

.orb{position:absolute;left:-10vmin;top:10vmin;width:12vmin;height:12vmin;border-radius:50%;
     background:radial-gradient(circle at 35% 35%, #fff, #ffd27d 60%, rgba(255,210,125,0) 70%);
     filter:blur(0.5px);mix-blend-mode:screen;animation: orbPath 60s linear infinite;z-index:1}
@keyframes orbPath{
  0%{transform:translate(5vw,10vh)}
  25%{transform:translate(35vw,-5vh)}
  50%{transform:translate(75vw,8vh)}
  75%{transform:translate(45vw,20vh)}
  100%{transform:translate(5vw,10vh)}
}

.fog{position:absolute;inset:0;z-index:2;pointer-events:none}
.fog > span{position:absolute;left:-40vw;width:140vw;height:30vh;background:radial-gradient(ellipse at 50% 50%, rgba(255,255,255,.7), rgba(255,255,255,0) 60%);filter:blur(10px);animation: fogMove 90s linear infinite;}
.fog .f1{top:8vh;animation-duration:95s;opacity:.25}
.fog .f2{top:18vh;animation-duration:85s;opacity:.18}
.fog .f3{top:4vh; animation-duration:75s;opacity:.15}
@keyframes fogMove{from{transform:translateX(0)} to{transform:translateX(60vw)}}

.water{position:absolute;inset:auto 0 0 0;height:42vh;background:linear-gradient(to bottom,var(--water1),var(--water2));z-index:3}
.ripples{position:absolute;inset:0;background:
    repeating-linear-gradient( to right, rgba(255,255,255,.10) 0 2px, transparent 2px 12px),
    radial-gradient(ellipse at 50% 20%, rgba(255,255,255,.10), transparent 60%);
    opacity:.35;animation: drift 30s linear infinite;mix-blend-mode:screen}
@keyframes drift{from{background-position:0 0,0 0} to{background-position:600px 0, 400px 0}}

.hint{position:absolute;right:12px;bottom:12px;background:rgba(0,0,0,.45);color:#fff;padding:8px 12px;border-radius:12px;font-size:12px;backdrop-filter:blur(4px);z-index:9}

/* Lesson Content */
.lesson-content {
  max-width: 1000px;
  margin: 0 auto;
  color: #fff;
  padding:40px;
  background:rgba(255,255,255,0.05);
  border-radius:20px;
}

.lesson-content h3 {
  font-size: 2.2em;
  color: #ffd89b;
  margin: 40px 0 20px;
  border-left: 5px solid #ff9a76;
  padding-left: 20px;
}

.lesson-content p {
  font-size: 1.2em;
  line-height: 1.8;
  color: #e0e6ed;
  margin-bottom: 20px;
}

.lesson-content ul{
  list-style:none;
  padding-left:0;
  color:#e0e6ed;
  font-size:1.1em;
  line-height:1.8;
}

.lesson-content li::before{
  content:"▸";
  color:#ff9a76;
  font-weight:bold;
  margin-right:10px;
}

.hierarchy-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 25px;
  margin: 40px 0;
}

.hierarchy-card {
  background: rgba(255, 255, 255, 0.08);
  padding: 30px;
  border-radius: 15px;
  border: 2px solid rgba(255, 216, 155, 0.3);
  transition: all 0.3s ease;
}

.hierarchy-card:hover {
  transform: translateY(-8px);
  border-color: #ffd89b;
  box-shadow: 0 15px 35px rgba(255, 154, 118, 0.3);
}

.hierarchy-card h4 {
  color: #ffd89b;
  font-size: 1.5em;
  margin-bottom: 15px;
}

.hierarchy-card ul {
  list-style: none;
  padding: 0;
}

.hierarchy-card li {
  padding: 8px 0;
  color: #e0e6ed;
  font-size: 1.1em;
}

.hierarchy-card li::before {
  content: "▸";
  color: #ff9a76;
  font-weight: bold;
  margin-right: 10px;
}

.tip-box {
  background: linear-gradient(135deg, rgba(255, 154, 118, 0.2), rgba(255, 216, 155, 0.2));
  padding: 25px;
  border-radius: 12px;
  border-left: 5px solid #ff9a76;
  margin: 30px 0;
}

.tip-box strong {
  color: #ffd89b;
  font-size: 1.3em;
  display: block;
  margin-bottom: 12px;
}

/* Quiz Section */
.quiz-section {
  background: linear-gradient(135deg, #8b5e3c 0%, #6b4423 100%);
  padding: 60px 40px;
  margin-top: 40px;
  border-radius:20px;
  max-width:1200px;
  margin-left:auto;
  margin-right:auto;
}

.quiz-section h3 {
  font-size: 2.8em;
  text-align: center;
  margin-bottom: 15px;
  color: #f4e4d7;
}

.subtitle {
  color: #f4e4d7;
  text-align: center;
  margin-bottom: 50px;
  font-size: 1.3em;
}

.question {
  background: rgba(255,255,255,.97);
  padding: 35px;
  border-radius: 16px;
  margin: 0 auto 25px;
  max-width: 800px;
  box-shadow: 0 10px 40px rgba(0,0,0,.25);
  transition: all 0.3s ease;
}

.question:hover {
  transform: translateY(-3px);
  box-shadow: 0 15px 50px rgba(0,0,0,.3);
}

.question.correct {
  background: linear-gradient(135deg, #e8f5e9, #c8e6c9);
  border: 3px solid #4caf50;
}

.question-number {
  color: #8b5e3c;
  font-weight: 800;
  font-size: 1.1em;
  margin-bottom: 15px;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.question-text {
  color: #333;
  font-size: 1.15em;
  line-height: 1.7;
  margin-bottom: 20px;
  font-weight: 500;
}

.fill-blank {
  display: inline-block;
  background: #faf8f5;
  border: 3px solid #c17767;
  border-radius: 10px;
  padding: 12px 20px;
  color: #333;
  font-size: 1em;
  min-width: 140px;
  text-align: center;
  outline: none;
  transition: all 0.3s ease;
  font-weight: 600;
  margin-top: 15px;
}

.fill-blank:focus {
  border-color: #8b5e3c;
  background: #fff;
  box-shadow: 0 0 0 4px rgba(193,119,103,.15);
  transform: scale(1.05);
}

.fill-blank.correct {
  border-color: #4caf50;
  background: #e8f5e9;
}

.feedback {
  margin-top: 20px;
  padding: 16px 20px;
  border-radius: 10px;
  font-weight: 700;
  display: none;
  font-size: 1.05em;
}

.feedback.show {
  display: block;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}

.feedback.correct {
  background: linear-gradient(135deg, #4caf50, #66bb6a);
  color: white;
  box-shadow: 0 4px 15px rgba(76,175,80,.4);
}

.feedback.incorrect {
  background: linear-gradient(135deg, #ef5350, #e53935);
  color: white;
  box-shadow: 0 4px 15px rgba(239,83,80,.4);
}

.check-button-container {
  text-align: center;
  margin-top: 35px;
}

.check-answers-btn {
  padding: 18px 50px;
  font-size: 1.2em;
  font-weight: 700;
  color: white;
  background: linear-gradient(135deg, #c17767, #8b5e3c);
  border: none;
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 8px 25px rgba(139,94,60,.4);
  text-transform: uppercase;
  letter-spacing: 1.5px;
}

.check-answers-btn:hover:not(:disabled) {
  transform: translateY(-3px);
  box-shadow: 0 12px 35px rgba(193,119,103,.5);
  background: linear-gradient(135deg, #d4917f, #9d6b49);
}

.check-answers-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.completion-message {
  background: linear-gradient(135deg, #4caf50, #66bb6a);
  padding: 50px;
  border-radius: 18px;
  text-align: center;
  display: none;
  margin: 40px auto 0;
  max-width: 800px;
  box-shadow: 0 20px 60px rgba(76,175,80,.4);
}

.completion-message.show {
  display: block;
  animation: bounceIn 0.6s ease;
}

@keyframes bounceIn {
  0% { transform: scale(0.8); opacity: 0; }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); opacity: 1; }
}

.completion-message h4 {
  color: #ffffff;
  margin-bottom: 35px;
  font-size: 2.3em;
  text-shadow: 0 2px 10px rgba(0,0,0,.2);
}

.completion-message p {
  color: #ffffff;
  font-size: 1.25em;
}

.hierarchy-demo {
  background: rgba(255,255,255,0.2);
  padding: 45px 35px;
  border-radius: 15px;
  margin: 30px auto;
  max-width: 600px;
  box-shadow: 0 10px 40px rgba(0,0,0,.2);
}

.demo-secondary, .demo-tertiary {
  color: #ffffff;
  margin-bottom: 18px;
}

.personalization-notice {
  background: rgba(78, 204, 163, 0.2);
  border: 2px solid #4ecca3;
  padding: 20px;
  border-radius: 12px;
  margin: 30px auto;
  max-width: 800px;
  text-align: center;
}

.personalization-notice h3 {
  color: #4ecca3;
  margin-bottom: 10px;
  font-size: 1.8em;
}

.personalization-notice p {
  color: #e0e6ed;
  font-size: 1.1em;
}

@media (max-width: 768px) {
  .hero h1{font-size:2.5em}
  .location-header h2{font-size:2.5em}
  .nav-links{gap:15px;padding:0 20px}
  .scene{height:50vh}
}
</style>
</head>
<body>

<div class="hero">
  <h1>🌉 San Francisco UI Hierarchy Tour</h1>
  <p>Learn UI design principles through iconic SF landmarks</p>
</div>

<nav class="nav">
  <ul class="nav-links">
    <li><a href="#alcatraz" id="nav-alcatraz">🏛️ Alcatraz</a></li>
    <li><a href="#golden-gate" id="nav-golden-gate">🌉 Golden Gate</a></li>
    <li><a href="#palace" id="nav-palace">🏛️ Palace of Fine Arts</a></li>
    <li><a href="#painted-ladies" id="nav-painted-ladies">🏠 Painted Ladies</a></li>
  </ul>
</nav>

<div class="personalization-notice" id="personalization-notice" style="display:none;">
  <h3>✨ Personalized for You!</h3>
  <p>Based on your itinerary quiz, we're showing you your selected San Francisco destinations.</p>
</div>

<!-- ALCATRAZ -->
<div class="location" id="alcatraz">
  <div class="location-header">
    <h2>🏛️ Alcatraz Island</h2>
    <p>UI Hierarchy Lesson</p>
  </div>

  <div class="scene">
    <div class="sky"></div>
    <div class="orb"></div>
    <div class="fog">
      <span class="f1"></span>
      <span class="f2"></span>
      <span class="f3"></span>
    </div>
    <div class="water"><div class="ripples"></div></div>
    <svg viewBox="0 0 1600 500" preserveAspectRatio="none" style="position:absolute;left:8vw;right:8vw;bottom:calc(42vh - 64px);height:24vh;z-index:5">
      <defs>
        <linearGradient id="rockGrad" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stop-color="var(--rock1)"/>
          <stop offset="100%" stop-color="var(--rock2)"/>
        </linearGradient>
      </defs>
      <path d="M0,300 C200,270 320,280 520,260 C700,245 880,240 1080,255 C1280,270 1400,290 1600,280 L1600,360 L0,360 Z" fill="url(#rockGrad)" stroke="var(--rock-edge)" stroke-width="3"/>
      <g fill="var(--vegetation)">
        <ellipse cx="260" cy="250" rx="40" ry="24"/>
        <ellipse cx="1240" cy="250" rx="34" ry="20"/>
      </g>
      <g transform="translate(520,150)">
        <rect x="0" y="0" width="520" height="90" rx="6" fill="var(--building)" stroke="var(--trim)" stroke-width="4"/>
        <rect x="20" y="-22" width="160" height="22" rx="4" fill="var(--roof)"/>
        <g fill="#8f8777">
          <rect x="36" y="24" width="28" height="28" rx="4"/>
          <rect x="230" y="24" width="28" height="28" rx="4"/>
        </g>
      </g>
      <g transform="translate(1080,110)">
        <rect x="-60" y="70" width="120" height="50" rx="6" fill="var(--building)" stroke="var(--trim)" stroke-width="4"/>
        <rect x="0" y="-5" width="28" height="130" rx="8" fill="var(--lighthouse)" stroke="#cfcfcf" stroke-width="4"/>
        <circle cx="14" cy="-6" r="16" fill="var(--lamp)" stroke="#e1d48f" stroke-width="4"/>
      </g>
    </svg>
    <div class="hint">Alcatraz: Isolation creates hierarchy</div>
  </div>

  <div class="lesson-content">
    <h3>UI Hierarchy: Alcatraz Island</h3>
    <p>UI hierarchy organizes elements by importance—just like Alcatraz Island, where the main cellhouse dominates while guard towers and smaller structures support the overall design.</p>

    <h3>The 3 Levels of Hierarchy</h3>
    <div class="hierarchy-grid">
      <div class="hierarchy-card">
        <h4>Primary (Main Cellhouse)</h4>
        <p>Most important content—as dominant as the main prison building.</p>
        <ul>
          <li>Main headlines</li>
          <li>Key call-to-action buttons</li>
          <li>Hero images</li>
        </ul>
      </div>
      <div class="hierarchy-card">
        <h4>Secondary (Guard Towers)</h4>
        <p>Supporting information—like D-Block and the watchtowers.</p>
        <ul>
          <li>Subheadings</li>
          <li>Section titles</li>
          <li>Secondary buttons</li>
        </ul>
      </div>
      <div class="hierarchy-card">
        <h4>Tertiary (Cell Details)</h4>
        <p>Additional details—individual stories and daily life.</p>
        <ul>
          <li>Body text</li>
          <li>Captions</li>
          <li>Metadata</li>
        </ul>
      </div>
    </div>

    <div class="tip-box">
      <strong>Size</strong>
      <p>Like the cellhouse towering over smaller buildings. Primary: 32-48px, Secondary: 24-32px, Tertiary: 14-16px</p>
    </div>
    <div class="tip-box">
      <strong>Spacing</strong>
      <p>Isolation cells created maximum separation—use white space the same way to emphasize importance.</p>
    </div>
  </div>

  <div class="quiz-section">
    <h3>🏛️ Build Your Hierarchy</h3>
    <p class="subtitle">Create a custom design component!</p>
    
    <div class="question" id="alc-q1">
      <div class="question-number">Question 1 - Primary Size</div>
      <div class="question-text">
        What font size (in pixels) for your PRIMARY heading? Choose a size that will dominate (32-48px).
        <input type="text" class="fill-blank" id="alc-a1" placeholder="e.g., 40">
      </div>
      <div class="feedback" id="alc-f1"></div>
    </div>
    
    <div class="question" id="alc-q2">
      <div class="question-number">Question 2 - Secondary Size</div>
      <div class="question-text">
        What font size for your SECONDARY subheading? Smaller than primary but noticeable (24-32px).
        <input type="text" class="fill-blank" id="alc-a2" placeholder="e.g., 24">
      </div>
      <div class="feedback" id="alc-f2"></div>
    </div>
    
    <div class="check-button-container">
      <button class="check-answers-btn" id="alc-check">Build My Component</button>
    </div>
    
    <div class="completion-message" id="alc-complete">
      <h4>🏆 Component Built!</h4>
      <div class="hierarchy-demo">
        <h2 class="demo-secondary" id="alc-demo-p">Primary Level</h2>
        <p class="demo-tertiary" id="alc-demo-s">Secondary Level</p>
      </div>
      <p>Your sizes work together to guide users naturally! 🎯</p>
    </div>
  </div>
</div>

<!-- GOLDEN GATE BRIDGE -->
<div class="location" id="golden-gate">
  <div class="location-header">
    <h2>🌉 Golden Gate Bridge</h2>
    <p>Heading Hierarchy Lesson</p>
  </div>

  <div class="scene">
    <div class="sky"></div>
    <div class="orb"></div>
    <div class="fog">
      <span class="f1"></span>
      <span class="f2"></span>
    </div>
    <div class="water" style="height:40vh"><div class="ripples"></div></div>
    <svg viewBox="0 0 1600 600" preserveAspectRatio="none" style="position:absolute;left:0;right:0;bottom:30vh;height:40vh;z-index:4">
      <rect x="0" y="320" width="1600" height="6" fill="#222" opacity=".8"/>
      <g fill="var(--bridge)">
        <rect x="300" y="160" width="44" height="200" rx="6"/>
        <rect x="1100" y="140" width="44" height="220" rx="6"/>
      </g>
      <path d="M0,320 L300,160 C 500,300 900,300 1100,140 L1600,320" stroke="var(--cable)" stroke-width="6" fill="none"/>
    </svg>
    <div class="hint">Golden Gate: Strong structure</div>
  </div>

  <div class="lesson-content">
    <h3>Heading Hierarchy: # to ###</h3>
    <p>The Golden Gate's iconic towers command attention. In Markdown and HTML, headings work the same way—# is biggest, ## is medium, ### is smaller.</p>

    <h3># H1: Primary (The Towers)</h3>
    <p>Most important—commanding like the 746-foot Art Deco towers. Use # for your main page title.</p>
    <ul>
      <li>Markdown: # Main Page Title</li>
      <li>HTML: &lt;h1&gt;Main Page Title&lt;/h1&gt;</li>
      <li>Use only once per page</li>
    </ul>

    <h3>## H2: Secondary (The Cables)</h3>
    <p>Supporting sections—like the suspension cables. Use ## for major sections.</p>

    <h3>### H3: Tertiary (The Roadway)</h3>
    <p>Subsections and details. Use ### for subsections within H2 areas.</p>

    <div class="tip-box">
      <strong>Why It Matters</strong>
      <p>The number of hashtags determines importance. One # is biggest. Two ## is smaller. Three ### is smallest. Always start with # and nest logically: # → ## → ###. Never skip levels!</p>
    </div>
  </div>

  <div class="quiz-section">
    <h3>🌉 Build Your Hierarchy</h3>
    <p class="subtitle">Create proper heading structure!</p>
    
    <div class="question" id="gg-q1">
      <div class="question-number">Question 1 - Primary Size</div>
      <div class="question-text">
        What font size (in pixels) for your PRIMARY heading (32-48px)?
        <input type="text" class="fill-blank" id="gg-a1" placeholder="e.g., 40">
      </div>
      <div class="feedback" id="gg-f1"></div>
    </div>
    
    <div class="question" id="gg-q2">
      <div class="question-number">Question 2 - Secondary Size</div>
      <div class="question-text">
        What font size for your SECONDARY subheading (24-32px)?
        <input type="text" class="fill-blank" id="gg-a2" placeholder="e.g., 24">
      </div>
      <div class="feedback" id="gg-f2"></div>
    </div>
    
    <div class="check-button-container">
      <button class="check-answers-btn" id="gg-check">Build Component</button>
    </div>
    
    <div class="completion-message" id="gg-complete">
      <h4>🎉 Success!</h4>
      <div class="hierarchy-demo">
        <h2 class="demo-secondary" id="gg-demo-p">Primary Level</h2>
        <p class="demo-tertiary" id="gg-demo-s">Secondary Level</p>
      </div>
      <p>Your heading structure is solid! 🌉</p>
    </div>
  </div>
</div>

<!-- PALACE OF FINE ARTS -->
<div class="location" id="palace">
  <div class="location-header">
    <h2>🏛️ Palace of Fine Arts</h2>
    <p>Visual Hierarchy Lesson</p>
  </div>

  <div class="scene">
    <div class="sky"></div>
    <div class="orb"></div>
    <div class="fog">
      <span class="f1"></span>
      <span class="f2"></span>
    </div>
    <div class="water" style="height:38vh"><div class="ripples"></div></div>
    <div style="position:absolute;left:0;right:0;bottom:38vh;height:10vh;z-index:4;background:linear-gradient(to bottom,var(--bank1),var(--bank2))"></div>
    <svg viewBox="0 0 1600 700" preserveAspectRatio="none" style="position:absolute;left:0;right:0;bottom:36vh;height:44vh;z-index:6">
      <defs>
        <linearGradient id="stoneGrad" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stop-color="var(--stone)"/>
          <stop offset="100%" stop-color="var(--stone-deep)"/>
        </linearGradient>
        <linearGradient id="capGrad" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stop-color="var(--cap)"/>
          <stop offset="100%" stop-color="var(--shadow)"/>
        </linearGradient>
      </defs>
      <g transform="translate(140,320)" fill="url(#stoneGrad)" stroke="var(--shadow)" stroke-width="4">
        <rect x="0" y="0" width="36" height="170" rx="8"/>
        <rect x="90" y="0" width="36" height="170" rx="8"/>
        <rect x="180" y="0" width="36" height="170" rx="8"/>
        <rect x="-16" y="-26" width="248" height="28" rx="8" fill="url(#capGrad)"/>
      </g>
      <g transform="translate(520,180)" stroke="var(--shadow)" stroke-width="4">
        <rect x="-10" y="300" width="580" height="26" rx="10" fill="url(#capGrad)"/>
        <g fill="url(#stoneGrad)">
          <rect x="0" y="120" width="40" height="190" rx="10"/>
          <rect x="180" y="120" width="40" height="190" rx="10"/>
          <rect x="360" y="120" width="40" height="190" rx="10"/>
        </g>
        <rect x="-20" y="80" width="560" height="48" rx="16" fill="url(#capGrad)"/>
        <ellipse cx="260" cy="60" rx="290" ry="60" fill="url(#capGrad)"/>
      </g>
      <g transform="translate(1200,320)" fill="url(#stoneGrad)" stroke="var(--shadow)" stroke-width="4">
        <rect x="0" y="0" width="36" height="170" rx="8"/>
        <rect x="90" y="0" width="36" height="170" rx="8"/>
        <rect x="180" y="0" width="36" height="170" rx="8"/>
        <rect x="-16" y="-26" width="248" height="28" rx="8" fill="url(#capGrad)"/>
      </g>
    </svg>
    <div class="hint">Palace: Rotunda dominates</div>
  </div>

  <div class="lesson-content">
    <h3>Visual Hierarchy Principles</h3>
    <p>UI hierarchy organizes elements by importance. Think of the Palace of Fine Arts—the grand rotunda dominates the landscape, with colonnades and lagoon arranged to guide visitors naturally through the architectural wonder.</p>

    <h3>The 3 Levels of Hierarchy</h3>
    <div class="hierarchy-grid">
      <div class="hierarchy-card">
        <h4>🏛️ Primary (The Rotunda)</h4>
        <p>Most important content—as majestic as the 162-foot central dome.</p>
        <ul>
          <li>Main headlines</li>
          <li>Key buttons</li>
          <li>Hero images</li>
        </ul>
      </div>
      <div class="hierarchy-card">
        <h4>🏛️ Secondary (The Colonnades)</h4>
        <p>Supporting information—like the sweeping curved colonnades that frame the space.</p>
        <ul>
          <li>Subheadings</li>
          <li>Section titles</li>
          <li>Secondary buttons</li>
        </ul>
      </div>
      <div class="hierarchy-card">
        <h4>🏛️ Tertiary (Decorative Details)</h4>
        <p>Additional details—ornate sculptures, weeping maidens, and reflecting pool.</p>
        <ul>
          <li>Body text</li>
          <li>Captions</li>
          <li>Metadata</li>
        </ul>
      </div>
    </div>

    <div class="tip-box">
      <strong>5 Tools to Create Hierarchy</strong>
      <p>1. Size - Like the rotunda rising above the colonnades<br>
      2. Weight - Massive Roman columns vs. delicate sculptural details<br>
      3. Color - Warm terracotta against lush greenery<br>
      4. Spacing - Open lagoon creates breathing room<br>
      5. Position - Eyes travel to the rotunda first</p>
    </div>
  </div>

  <div class="quiz-section">
    <h3>🏛️ Build Your Hierarchy</h3>
    <p class="subtitle">Create a custom design component!</p>
    
    <div class="question" id="palace-q1">
      <div class="question-number">Question 1 - Primary Size</div>
      <div class="question-text">
        What font size (in pixels) for your PRIMARY heading (32-48px)?
        <input type="text" class="fill-blank" id="palace-a1" placeholder="e.g., 40">
      </div>
      <div class="feedback" id="palace-f1"></div>
    </div>
    
    <div class="question" id="palace-q2">
      <div class="question-number">Question 2 - Secondary Size</div>
      <div class="question-text">
        What font size for your SECONDARY subheading (24-32px)?
        <input type="text" class="fill-blank" id="palace-a2" placeholder="e.g., 24">
      </div>
      <div class="feedback" id="palace-f2"></div>
    </div>
    
    <div class="check-button-container">
      <button class="check-answers-btn" id="palace-check">Build Component</button>
    </div>
    
    <div class="completion-message" id="palace-complete">
      <h4>🏆 Magnificent!</h4>
      <div class="hierarchy-demo">
        <h2 class="demo-secondary" id="palace-demo-p">Primary Level</h2>
        <p class="demo-tertiary" id="palace-demo-s">Secondary Level</p>
      </div>
      <p>Your hierarchy is as beautiful as the Palace! 🎨</p>
    </div>
  </div>
</div>

<!-- PAINTED LADIES -->
<div class="location" id="painted-ladies">
  <div class="location-header">
    <h2>🏠 Painted Ladies</h2>
    <p>Color & Contrast Hierarchy</p>
  </div>

  <div class="scene">
    <div class="sky"></div>
    <div class="orb"></div>
    <div class="fog">
      <span class="f1"></span>
      <span class="f2"></span>
    </div>
    <div style="position:absolute;inset:auto 0 16vh 0;height:28vh;background:radial-gradient(120% 60% at 50% 0%, #3fa36e, var(--lawn));z-index:4"></div>
    <div style="position:absolute;left:10vw;right:10vw;bottom:26vh;height:28px;background:linear-gradient(#cdb793,#a68a63);border-radius:18px;box-shadow:0 6px 10px rgba(0,0,0,.25);z-index:5"></div>
    <svg viewBox="0 0 1600 600" preserveAspectRatio="none" style="position:absolute;left:0;right:0;bottom:20vh;height:40vh;z-index:7">
      <defs>
        <linearGradient id="shadow" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stop-color="#000" stop-opacity=".18"/>
          <stop offset="1" stop-color="#000" stop-opacity="0"/>
        </linearGradient>
      </defs>
      <g transform="translate(140,120)">
        <g transform="translate(0,50)" style="filter:drop-shadow(0 6px 10px rgba(0,0,0,.35))">
          <polygon points="0,80 80,0 160,80" fill="var(--roof1)"/>
          <rect x="10" y="80" width="140" height="150" fill="var(--house1)" stroke="var(--trim1)" stroke-width="4"/>
          <rect x="55" y="100" width="50" height="70" fill="var(--house1)" stroke="var(--trim1)" stroke-width="4"/>
          <g fill="#333">
            <rect x="25" y="110" width="20" height="28" rx="3"/>
            <rect x="115" y="110" width="20" height="28" rx="3"/>
          </g>
        </g>
        <g transform="translate(190,30)" style="filter:drop-shadow(0 6px 10px rgba(0,0,0,.35))">
          <polygon points="0,80 90,0 180,80" fill="var(--roof2)"/>
          <rect x="10" y="80" width="160" height="160" fill="var(--house2)" stroke="var(--trim2)" stroke-width="4"/>
          <rect x="65" y="105" width="50" height="70" fill="var(--house2)" stroke="var(--trim2)" stroke-width="4"/>
          <g fill="#333">
            <rect x="28" y="115" width="22" height="30" rx="3"/>
            <rect x="138" y="115" width="22" height="30" rx="3"/>
          </g>
        </g>
        <g transform="translate(400,40)" style="filter:drop-shadow(0 6px 10px rgba(0,0,0,.35))">
          <polygon points="0,80 90,0 180,80" fill="var(--roof3)"/>
          <rect x="10" y="80" width="160" height="155" fill="var(--house3)" stroke="var(--trim3)" stroke-width="4"/>
          <rect x="65" y="105" width="50" height="70" fill="var(--house3)" stroke="var(--trim3)" stroke-width="4"/>
          <g fill="#333">
            <rect x="28" y="115" width="22" height="30" rx="3"/>
            <rect x="138" y="115" width="22" height="30" rx="3"/>
          </g>
        </g>
      </g>
    </svg>
    <div style="position:absolute;left:0;right:0;bottom:12vh;height:10vh;background:linear-gradient(#383838,#1f1f1f);z-index:8;box-shadow:0 -4px 14px rgba(0,0,0,.35) inset"></div>
    <div class="hint">Painted Ladies: Color creates contrast</div>
  </div>

  <div class="lesson-content">
    <h3>Color & Contrast in Hierarchy</h3>
    <p>UI hierarchy organizes elements by importance—just like the Painted Ladies dominate Alamo Square with their colorful Victorian facades, your design should guide users' eyes naturally through content.</p>

    <h3>The 3 Levels of Hierarchy</h3>
    <div class="hierarchy-grid">
      <div class="hierarchy-card">
        <h4>🏛️ Primary: The Victorian Facades</h4>
        <p>Your most important content—as striking as those colorful Queen Anne mansions.</p>
        <ul>
          <li>Main headlines</li>
          <li>Hero images</li>
          <li>Primary CTAs</li>
        </ul>
      </div>
      <div class="hierarchy-card">
        <h4>🏛️ Secondary: Architectural Details</h4>
        <p>Supporting information—like ornate bay windows and decorative trim.</p>
        <ul>
          <li>Subheadings</li>
          <li>Section titles</li>
          <li>Secondary buttons</li>
        </ul>
      </div>
      <div class="hierarchy-card">
        <h4>🏛️ Tertiary: Paint & Accents</h4>
        <p>Additional details—individual colors, spindles, flourishes.</p>
        <ul>
          <li>Body text</li>
          <li>Captions</li>
          <li>Metadata</li>
        </ul>
      </div>
    </div>

    <div class="tip-box">
      <strong>Quick Tips</strong>
      <p>✓ Limit to 1-2 fonts maximum<br>
      ✓ Create dramatic contrast like pastel homes against city skyline<br>
      ✓ Test by squinting—hierarchy should still be clear<br>
      ✓ Use consistent patterns throughout your design</p>
    </div>
  </div>

  <div class="quiz-section">
    <h3>🏠 Build Your Hierarchy</h3>
    <p class="subtitle">Create a custom design component!</p>
    
    <div class="question" id="ladies-q1">
      <div class="question-number">Question 1 - Primary Size</div>
      <div class="question-text">
        What font size (in pixels) for your PRIMARY heading (32-48px)?
        <input type="text" class="fill-blank" id="ladies-a1" placeholder="e.g., 40">
      </div>
      <div class="feedback" id="ladies-f1"></div>
    </div>
    
    <div class="question" id="ladies-q2">
      <div class="question-number">Question 2 - Secondary Size</div>
      <div class="question-text">
        What font size for your SECONDARY subheading (24-32px)?
        <input type="text" class="fill-blank" id="ladies-a2" placeholder="e.g., 24">
      </div>
      <div class="feedback" id="ladies-f2"></div>
    </div>
    
    <div class="check-button-container">
      <button class="check-answers-btn" id="ladies-check">Build Component</button>
    </div>
    
    <div class="completion-message" id="ladies-complete">
      <h4>🎨 Beautiful Work!</h4>
      <div class="hierarchy-demo">
        <h2 class="demo-secondary" id="ladies-demo-p">Primary Level</h2>
        <p class="demo-tertiary" id="ladies-demo-s">Secondary Level</p>
      </div>
      <p>Your design is as iconic as the Painted Ladies! 🏠</p>
    </div>
  </div>
</div>

<script>
// Destination mapping
const DESTINATION_MAP = {
  'Alcatraz': 'alcatraz',
  'Golden Gate Bridge': 'golden-gate',
  'Palace of Fine Arts': 'palace',
  'The Painted Ladies': 'painted-ladies'
};

// Load itinerary from localStorage and filter destinations
function loadItineraryAndFilter() {
  try {
    const itineraryData = localStorage.getItem('westCoastItinerary');
    
    if (itineraryData) {
      const itinerary = JSON.parse(itineraryData);
      
      // Check if San Francisco exists in the itinerary
      if (itinerary.cities && itinerary.cities['San Francisco']) {
        const sfData = itinerary.cities['San Francisco'];
        const selectedDestinations = sfData.destinations || [];
        
        if (selectedDestinations.length > 0) {
          // Show personalization notice
          document.getElementById('personalization-notice').style.display = 'block';
          
          // Hide all destinations first
          const allDestinations = ['alcatraz', 'golden-gate', 'palace', 'painted-ladies'];
          allDestinations.forEach(dest => {
            const section = document.getElementById(dest);
            const navLink = document.getElementById('nav-' + dest);
            if (section) section.classList.add('hidden-location');
            if (navLink) navLink.classList.add('hidden-nav');
          });
          
          // Show only selected destinations
          selectedDestinations.forEach(destName => {
            const destId = DESTINATION_MAP[destName];
            if (destId) {
              const section = document.getElementById(destId);
              const navLink = document.getElementById('nav-' + destId);
              if (section) section.classList.remove('hidden-location');
              if (navLink) navLink.classList.remove('hidden-nav');
            }
          });
          
          console.log('Filtered to show destinations:', selectedDestinations);
        }
      }
    }
  } catch (error) {
    console.error('Error loading itinerary:', error);
    // If there's an error, show all destinations (default behavior)
  }
}

// Run on page load
loadItineraryAndFilter();

function setupQuiz(location) {
  const checkBtn = document.getElementById(`${location}-check`);
  
  checkBtn.addEventListener('click', function() {
    const input1 = document.getElementById(`${location}-a1`);
    const input2 = document.getElementById(`${location}-a2`);
    const feedback1 = document.getElementById(`${location}-f1`);
    const feedback2 = document.getElementById(`${location}-f2`);
    const question1 = document.getElementById(`${location}-q1`);
    const question2 = document.getElementById(`${location}-q2`);
    
    const primarySize = parseInt(input1.value.trim());
    const secondarySize = parseInt(input2.value.trim());
    
    let allCorrect = true;
    
    if (primarySize >= 32 && primarySize <= 48) {
      feedback1.textContent = `✓ Great choice! ${primarySize}px is a strong primary size!`;
      feedback1.className = 'feedback correct show';
      input1.className = 'fill-blank correct';
      question1.className = 'question correct';
      input1.disabled = true;
    } else {
      feedback1.textContent = '✗ Primary size should be between 32-48px for best hierarchy!';
      feedback1.className = 'feedback incorrect show';
      allCorrect = false;
    }
    
    if (secondarySize >= 24 && secondarySize <= 32 && secondarySize < primarySize) {
      feedback2.textContent = `✓ Perfect! ${secondarySize}px creates great contrast with your primary!`;
      feedback2.className = 'feedback correct show';
      input2.className = 'fill-blank correct';
      question2.className = 'question correct';
      input2.disabled = true;
    } else if (secondarySize >= primarySize) {
      feedback2.textContent = '✗ Secondary must be smaller than your primary size to create hierarchy!';
      feedback2.className = 'feedback incorrect show';
      allCorrect = false;
    } else {
      feedback2.textContent = '✗ Secondary size should be between 24-32px for best results!';
      feedback2.className = 'feedback incorrect show';
      allCorrect = false;
    }
    
    if (allCorrect) {
      setTimeout(() => {
        const completion = document.getElementById(`${location}-complete`);
        completion.className = 'completion-message show';
        
        document.getElementById(`${location}-demo-p`).style.fontSize = primarySize + 'px';
        document.getElementById(`${location}-demo-p`).textContent = `Primary Level (${primarySize}px)`;
        
        document.getElementById(`${location}-demo-s`).style.fontSize = secondarySize + 'px';
        document.getElementById(`${location}-demo-s`).textContent = `Secondary Level (${secondarySize}px)`;
        
        checkBtn.disabled = true;
        checkBtn.textContent = '✓ Component Built!';
        checkBtn.style.background = 'linear-gradient(135deg, #4caf50, #66bb6a)';
      }, 500);
    }
  });
}

setupQuiz('alc');
setupQuiz('gg');
setupQuiz('palace');
setupQuiz('ladies');
</script>
<!-- 🌍 Destination Finder Tool -->
<div style="padding: 15px; border-radius: 6px; margin-bottom: 20px; border: 1px solid #dee2e6;">
  <h3 style="margin-top: 0; color: #495057;">AI-Powered Destination Finder</h3>

  <label>Search a Place or Interest:</label>
  <textarea id="user-search-input" placeholder="e.g., beaches, hiking, Paris, ancient history..." style="min-height: 80px; width: 100%; padding: 8px; resize: vertical;"></textarea>
  
  <div style="display: flex; gap: 10px; margin-top: 10px; flex-wrap: wrap;">
    <button class="iridescent flex-1 text-white text-center py-2 rounded-lg font-semibold transition" style="background-color: #007bff;" onclick="generateDestination()">
      🔍 Search Destination
    </button>
    <button class="iridescent flex-1 text-white text-center py-2 rounded-lg font-semibold transition" style="background-color: #28a745;" onclick="saveDestination()">
      💾 Save Destination
    </button>
    <button class="iridescent flex-1 text-white text-center py-2 rounded-lg font-semibold transition" style="background-color: #17a2b8;" onclick="loadDestination()">
      📂 Load Saved
    </button>
  </div>

  <div id="ai-status" style="margin-top: 10px; padding: 8px; border-radius: 4px; display: none;"></div>

  <!-- Destination Info -->
  <div id="destination-info" style="margin-top: 15px; display: none; border-left: 4px solid #007bff; padding: 12px; border-radius: 4px;">
    <h4 id="dest-name" style="margin: 0; color: #007bff;"></h4>
    <p id="dest-country" style="font-weight: bold; margin: 5px 0;"></p>
    <p id="dest-description" style="color: #495057;"></p>
    <p><strong>🗓 Best Time to Visit:</strong> <span id="dest-best-time"></span></p>
    <p><strong>🌤️ Climate:</strong> <span id="dest-climate"></span></p>
    <p><strong>📍 Suggested Activities:</strong> <span id="dest-activities"></span></p>
  </div>
</div>

<script>
// 🌍 Status message helper
function showAIStatus(message, type) {
  const statusDiv = document.getElementById("ai-status");
  statusDiv.textContent = message;
  statusDiv.style.display = "block";

  switch (type) {
    case "loading":
      statusDiv.style.backgroundColor = "#cce5ff";
      statusDiv.style.color = "#004085";
      break;
    case "success":
      statusDiv.style.backgroundColor = "#d1ecf1";
      statusDiv.style.color = "#0c5460";
      break;
    case "error":
      statusDiv.style.backgroundColor = "#f8d7da";
      statusDiv.style.color = "#721c24";
      break;
  }

  if (type !== "loading") {
    setTimeout(() => (statusDiv.style.display = "none"), 5000);
  }
}

// 🌍 Example destinations (can be replaced with AI/Gemini API later)
const DESTINATIONS = [
  {
    keywords: ["beach", "tropical", "ocean"],
    name: "Maui",
    country: "Hawaii, USA",
    description: "A lush island paradise famous for golden beaches, waterfalls, and volcanic landscapes.",
    bestTime: "April to October",
    climate: "Warm tropical",
    activities: "Snorkeling, hiking Haleakalā, surfing, scenic drives along Hana Highway"
  },
  {
    keywords: ["mountain", "hiking", "nature", "alps"],
    name: "Zermatt",
    country: "Switzerland",
    description: "A picturesque alpine village located at the base of the iconic Matterhorn mountain.",
    bestTime: "June to September (hiking), December to March (skiing)",
    climate: "Cool mountain climate",
    activities: "Hiking, skiing, cable car rides, glacier tours"
  },
  {
    keywords: ["history", "ancient", "ruins"],
    name: "Athens",
    country: "Greece",
    description: "The birthplace of democracy and home to ancient landmarks like the Parthenon.",
    bestTime: "April to June, September to October",
    climate: "Mediterranean",
    activities: "Museum visits, walking tours, exploring Acropolis, Greek cuisine"
  },
  {
    keywords: ["art", "romantic", "europe"],
    name: "Florence",
    country: "Italy",
    description: "A Renaissance treasure known for its art, architecture, and cuisine.",
    bestTime: "May to September",
    climate: "Warm Mediterranean",
    activities: "Visiting the Uffizi Gallery, Duomo climb, wine tasting in Tuscany"
  },
  {
    keywords: ["wildlife", "adventure", "africa", "safari"],
    name: "Serengeti National Park",
    country: "Tanzania",
    description: "A vast ecosystem renowned for the Great Migration and diverse African wildlife.",
    bestTime: "June to October",
    climate: "Warm dry savanna",
    activities: "Safari drives, wildlife photography, balloon safaris"
  }
];

// 🌍 Generate Destination
function generateDestination() {
  const query = document.getElementById("user-search-input").value.trim().toLowerCase();
  if (!query) {
    showAIStatus("⚠️ Please enter a place or theme to search.", "error");
    return;
  }

  showAIStatus("🔍 Searching destinations...", "loading");

  // Find matching destination
  const found = DESTINATIONS.find(dest =>
    dest.keywords.some(k => query.includes(k))
  );

  if (found) {
    displayDestination(found);
    showAIStatus("✅ Destination found!", "success");
  } else {
    // Fallback destination
    displayDestination({
      name: "Kyoto",
      country: "Japan",
      description:
        "A serene city known for its traditional temples, cherry blossoms, and tea culture.",
      bestTime: "March to May, October to November",
      climate: "Mild temperate",
      activities: "Temple visits, tea ceremonies, exploring Arashiyama bamboo forest"
    });
    showAIStatus("🌸 No exact match found, but here's a great suggestion: Kyoto!", "success");
  }
}

// 🌍 Display destination info
function displayDestination(dest) {
  document.getElementById("destination-info").style.display = "block";
  document.getElementById("dest-name").textContent = dest.name;
  document.getElementById("dest-country").textContent = dest.country;
  document.getElementById("dest-description").textContent = dest.description;
  document.getElementById("dest-best-time").textContent = dest.bestTime;
  document.getElementById("dest-climate").textContent = dest.climate;
  document.getElementById("dest-activities").textContent = dest.activities;
}

// 🌍 Save to localStorage
function saveDestination() {
  const data = {
    input: document.getElementById("user-search-input").value.trim(),
    name: document.getElementById("dest-name").textContent,
    country: document.getElementById("dest-country").textContent,
    description: document.getElementById("dest-description").textContent,
    bestTime: document.getElementById("dest-best-time").textContent,
    climate: document.getElementById("dest-climate").textContent,
    activities: document.getElementById("dest-activities").textContent,
    timestamp: new Date().toISOString()
  };

  if (!data.name) {
    showAIStatus("⚠️ Please generate a destination before saving.", "error");
    return;
  }

  localStorage.setItem("destination-finder-saved", JSON.stringify(data));
  showAIStatus("✅ Destination saved successfully!", "success");
}

// 🌍 Load saved destination
function loadDestination() {
  const saved = localStorage.getItem("destination-finder-saved");
  if (!saved) {
    showAIStatus("⚠️ No saved destination found.", "error");
    return;
  }

  const data = JSON.parse(saved);
  displayDestination(data);
  document.getElementById("user-search-input").value = data.input;
  const saveDate = new Date(data.timestamp).toLocaleString();
  showAIStatus(`📂 Loaded saved destination (Saved: ${saveDate})`, "success");
}
</script>
Share your experiences on the microblog!
</body>
</html>