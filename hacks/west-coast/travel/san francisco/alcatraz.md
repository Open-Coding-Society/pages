---
layout: post
title: "Alcatraz"
description: 
permalink: /west-coast/travel/sf/alca
date: 2025-10-21
---
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>Alcatraz Island — UI Hierarchy</title>
<style>
:root{
  --sky-day:#94c8ff; --sky-dusk:#ffb8a7; --sky-night:#081a36;
  --fog:#ffffff;
  --water1:#2b5f8a; --water2:#173a57;
  --rock1:#5c6b78; --rock2:#3c4a57; --rock-edge:#22303b;
  --building:#d7d0bf; --building-deep:#bfb6a0; --roof:#8c7a63; --trim:#6e6555;
  --lighthouse:#f1f1f1; --lamp:#fff6b0; --beam:rgba(255,250,186,.22);
  --vegetation:#2e6b48; --trunk:#5a3a28;
  --boat:#e7eaee; --ferry:#e9eef4; --ferry-stripe:#3a6ea5;
}
*{box-sizing:border-box;margin:0;padding:0}
html,body{min-height:100%;background:#0b1a3a}
body{font-family:system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;overflow-x:hidden}

/* Scene - centered and sized appropriately */
.scene{
  position:relative;
  width:100%;
  max-width:1400px;
  height:80vh;
  margin:0 auto;
  perspective:1200px;
  background:linear-gradient(to bottom,var(--sky-day),#bfe3ff 60%, #e4f1ff 100%);
}

.overlay{position:absolute;inset:0;z-index:9;}
.hint{position:absolute;right:12px;bottom:12px;background:rgba(0,0,0,.45);color:#fff;padding:8px 12px;border-radius:12px;font-size:12px;backdrop-filter:blur(4px);z-index:9}

/* Sky cycle */
.sky{position:absolute;inset:0;z-index:0;}
.sky::before{content:"";position:absolute;inset:0;
  background:linear-gradient(to bottom,var(--sky-day),#bfe3ff 60%, #e4f1ff 100%);
  animation: skyCycle 60s linear infinite;will-change:background;
}
@keyframes skyCycle{
  0%{background:linear-gradient(to bottom,var(--sky-day),#bfe3ff 60%, #e4f1ff)}
  25%{background:linear-gradient(to bottom,var(--sky-dusk),#ffd6c9 60%, #ffe9e2)}
  50%{background:linear-gradient(to bottom,var(--sky-night),#102a57 60%, #1a3a6b)}
  75%{background:linear-gradient(to bottom,#1c3b6f 0%, #a6c6ff 60%, #d9ecff)}
  100%{background:linear-gradient(to bottom,var(--sky-day),#bfe3ff 60%, #e4f1ff)}
}

/* Sun/Moon */
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

/* Fog */
.fog{position:absolute;inset:0;z-index:2;pointer-events:none}
.fog > span{position:absolute;left:-40vw;width:140vw;height:30vh;background:radial-gradient(ellipse at 50% 50%, rgba(255,255,255,.7), rgba(255,255,255,0) 60%);filter:blur(10px);animation: fogMove 90s linear infinite;}
.fog .f1{top:8vh;animation-duration:95s;opacity:.25}
.fog .f2{top:18vh;animation-duration:85s;opacity:.18}
.fog .f3{top:4vh; animation-duration:75s;opacity:.15}
@keyframes fogMove{from{transform:translateX(0)} to{transform:translateX(60vw)}}

/* WATER */
.water{position:absolute;inset:auto 0 0 0;height:42vh;background:linear-gradient(to bottom,var(--water1),var(--water2));z-index:3}
.ripples{position:absolute;inset:0;background:
    repeating-linear-gradient( to right, rgba(255,255,255,.10) 0 2px, transparent 2px 12px),
    radial-gradient(ellipse at 50% 20%, rgba(255,255,255,.10), transparent 60%),
    radial-gradient(ellipse at 40% 30%, rgba(255,255,255,.07), transparent 60%);
    opacity:.35;animation: drift 30s linear infinite;mix-blend-mode:screen}
@keyframes drift{from{background-position:0 0,0 0,0 0} to{background-position:600px 0, 400px 0, 800px 0}}

/* ISLAND */
.island{position:absolute;left:8vw;right:8vw;bottom:calc(42vh - 64px);height:24vh;z-index:5;pointer-events:none}
.island svg{width:100%;height:100%}

/* Boats / ferries */
.boats{position:absolute;left:-20vw;right:-20vw;bottom:8vh;height:10vh;z-index:4}
.boat{position:absolute;bottom:0;width:94px;height:20px;background:var(--boat);border-radius:4px 4px 10px 10px;box-shadow:0 8px 10px -8px rgba(0,0,0,.7);}
.ferry{position:absolute;bottom:0;width:140px;height:34px;background:var(--ferry);border-radius:4px 4px 12px 12px;box-shadow:0 10px 12px -10px rgba(0,0,0,.75)}
.ferry:before{content:"";position:absolute;left:12px;right:12px;top:16px;height:6px;background:var(--ferry-stripe);border-radius:3px}
.ferry:after{content:"";position:absolute;left:20px;top:-10px;width:0;height:0;border-left:12px solid transparent;border-right:12px solid transparent;border-bottom:18px solid #eaeaea}

/* Birds */
.birds{position:absolute;inset:10vh 0 auto 0;height:18vh;z-index:6}
.gull{position:absolute;top:0;left:0;width:24px;height:12px;--t:20s;animation: fly var(--t) linear infinite}
.gull svg{width:100%;height:100%}
@keyframes fly{0%{offset-distance:0%}100%{offset-distance:100%}}
.gull{offset-path:path("M 0,50 C 20,0 40,0 60,50 S 120,100 140,50 S 200,0 240,50 S 300,100 360,60")}

/* Lesson Content */
.lesson-wrapper {
  background: linear-gradient(135deg, #1a2a44 0%, #0d1b2a 100%);
  padding: 80px 40px;
  color: #fff;
}

.lesson-content {
  max-width: 1000px;
  margin: 0 auto;
}

.lesson-content h1 {
  font-size: 3em;
  text-align: center;
  margin-bottom: 20px;
  background: linear-gradient(135deg, #ffd89b, #ff9a76);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.lesson-content h2 {
  font-size: 2.2em;
  color: #ffd89b;
  margin: 40px 0 20px;
  border-left: 5px solid #ff9a76;
  padding-left: 20px;
}

.lesson-content h3 {
  font-size: 1.6em;
  color: #ffb88c;
  margin: 30px 0 15px;
}

.lesson-content p {
  font-size: 1.2em;
  line-height: 1.8;
  color: #e0e6ed;
  margin-bottom: 20px;
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

code {
  background: rgba(0, 0, 0, 0.3);
  padding: 3px 8px;
  border-radius: 4px;
  font-family: 'Courier New', monospace;
  color: #ffd89b;
}

/* Quiz Section - Updated styling */
.quiz-section {
  background: linear-gradient(135deg, #8b5e3c 0%, #6b4423 100%);
  padding: 60px 40px;
  margin-top: 0;
}

.quiz-section h1 {
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

.completion-message h2 {
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
</style>
</head>
<body>

<!-- Centered Scene -->
<div class="scene" id="scene" aria-label="Alcatraz Island scene">
  <div class="sky"></div>
  <div class="orb" aria-hidden="true"></div>

  <div class="fog" aria-hidden="true">
    <span class="f1"></span>
    <span class="f2"></span>
    <span class="f3"></span>
  </div>

  <div class="water"><div class="ripples"></div></div>

  <div class="island" aria-label="Alcatraz Island">
    <svg viewBox="0 0 1600 500" preserveAspectRatio="none" role="img">
      <defs>
        <linearGradient id="rockGrad" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stop-color="var(--rock1)"/>
          <stop offset="100%" stop-color="var(--rock2)"/>
        </linearGradient>
        <filter id="softBlur"><feGaussianBlur stdDeviation="1.2"/></filter>
      </defs>

      <path d="M0,300 C200,270 320,280 520,260 C700,245 880,240 1080,255 C1280,270 1400,290 1600,280 L1600,360 L0,360 Z" fill="url(#rockGrad)" stroke="var(--rock-edge)" stroke-width="3"/>
      <path d="M0,300 C200,270 320,280 520,260 C700,245 880,240 1080,255 C1280,270 1400,290 1600,280" fill="none" stroke="rgba(255,255,255,.55)" stroke-width="2" style="filter:url(#softBlur)"/>

      <g fill="var(--vegetation)">
        <ellipse cx="260" cy="250" rx="40" ry="24"/>
        <ellipse cx="330" cy="240" rx="26" ry="18"/>
        <ellipse cx="1240" cy="250" rx="34" ry="20"/>
        <ellipse cx="1160" cy="238" rx="24" ry="16"/>
      </g>

      <g transform="translate(520,150)">
        <rect x="0" y="0" width="520" height="90" rx="6" fill="var(--building)" stroke="var(--trim)" stroke-width="4"/>
        <rect x="20" y="-22" width="160" height="22" rx="4" fill="var(--roof)"/>
        <rect x="200" y="-22" width="160" height="22" rx="4" fill="var(--roof)"/>
        <rect x="380" y="-22" width="120" height="22" rx="4" fill="var(--roof)"/>
        <g fill="#8f8777">
          <rect x="36" y="24" width="28" height="28" rx="4"/>
          <rect x="84" y="24" width="28" height="28" rx="4"/>
          <rect x="132" y="24" width="28" height="28" rx="4"/>
          <rect x="230" y="24" width="28" height="28" rx="4"/>
          <rect x="278" y="24" width="28" height="28" rx="4"/>
          <rect x="326" y="24" width="28" height="28" rx="4"/>
          <rect x="418" y="24" width="28" height="28" rx="4"/>
          <rect x="466" y="24" width="28" height="28" rx="4"/>
        </g>
      </g>

      <g transform="translate(1080,110)">
        <rect x="-60" y="70" width="120" height="50" rx="6" fill="var(--building)" stroke="var(--trim)" stroke-width="4"/>
        <polygon points="-70,70 0,40 70,70" fill="var(--roof)"/>
        <rect x="0" y="-5" width="28" height="130" rx="8" fill="var(--lighthouse)" stroke="#cfcfcf" stroke-width="4"/>
        <circle cx="14" cy="-6" r="16" fill="var(--lamp)" stroke="#e1d48f" stroke-width="4"/>
      </g>

      <g class="beam" transform="translate(1094,104)">
        <path d="M0,0 L360,-40 L360,40 Z" fill="var(--beam)" style="transform-origin:0px 0px;animation: sweep 7.5s linear infinite"/>
      </g>

      <rect x="420" y="260" width="140" height="10" rx="4" fill="#8e8065"/>
      <rect x="410" y="270" width="160" height="8" rx="4" fill="#7a6b52"/>
    </svg>
  </div>

  <div class="boats" id="boats"></div>
  <div class="birds" id="birds"></div>
  <div class="overlay" id="overlay" aria-hidden="true"></div>
  <div class="hint">Move mouse: parallax effect</div>
</div>

<!-- Lesson Content -->
<div class="lesson-wrapper">
  <div class="lesson-content">
    <h1>UI Hierarchy Lesson: Alcatraz Island</h1>
    
    <p>UI hierarchy organizes elements by importance—just like Alcatraz Island, where the main cellhouse dominates while guard towers and smaller structures support the overall design.</p>

    <h2>The 3 Levels of Hierarchy</h2>
    
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

    <h2>5 Tools to Create Hierarchy</h2>

    <div class="tip-box">
      <strong>1. Size</strong>
      <p>Like the cellhouse towering over smaller buildings. Primary: 32-48px, Secondary: 24-32px, Tertiary: 14-16px</p>
    </div>

    <div class="tip-box">
      <strong>2. Weight</strong>
      <p>Thick steel bars vs. thinner mesh. Primary: Bold (700), Secondary: Semi-bold (600), Tertiary: Regular (400)</p>
    </div>

    <div class="tip-box">
      <strong>3. Color</strong>
      <p>Stark gray concrete against blue San Francisco Bay. Use high contrast for primary, medium for secondary, low for tertiary.</p>
    </div>

    <div class="tip-box">
      <strong>4. Spacing</strong>
      <p>Isolation cells created maximum separation—use white space the same way to emphasize importance.</p>
    </div>

    <div class="tip-box">
      <strong>5. Position</strong>
      <p>Visitors look up at the main building first—top and center naturally draw attention.</p>
    </div>

    <h2>Common Mistakes to Avoid</h2>
    <p>❌ Making everything important—nothing stands out<br>
    ❌ Too many font sizes—stick to 3-4 maximum<br>
    ❌ Ignoring spacing—use isolation for impact<br>
    ❌ Inconsistent styling—maintain order<br>
    ❌ Poor contrast—you need clarity</p>
  </div>
</div>

<script>
(function(){
  const rnd=(a=1,b=0)=>Math.random()*(a-b)+b;

  // Birds
  const birdsEl = document.getElementById('birds');
  const gullSVG = `
    <svg viewBox="0 0 24 12" xmlns="http://www.w3.org/2000/svg">
      <path d="M1 6 Q6 1 12 6 Q18 1 23 6" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round">
        <animate attributeName="d" dur="1.2s" repeatCount="indefinite"
          values="M1 6 Q6 1 12 6 Q18 1 23 6; M1 6 Q6 11 12 6 Q18 11 23 6; M1 6 Q6 1 12 6 Q18 1 23 6" />
      </path>
    </svg>`;
  function spawnGull(){
    const g=document.createElement('div'); g.className='gull'; g.innerHTML=gullSVG;
    g.style.left=rnd(2,10)+'vw'; g.style.top=rnd(2,10)+'vh';
    g.style.setProperty('--t', rnd(28,16)+'s');
    g.style.animationDelay = (-Math.random()*6)+'s';
    birdsEl.appendChild(g);
    setTimeout(()=>{ if(g.isConnected) g.remove(); }, 30000);
  }
  setInterval(spawnGull, 5000);
  for(let i=0;i<5;i++) spawnGull();

  // Boats
  const boatsEl = document.getElementById('boats');
  function spawnBoat(){
    const dir = Math.random()<0.5?1:-1;
    const el = document.createElement('div');
    const isFerry = Math.random()<0.45;
    el.className = isFerry ? 'ferry' : 'boat';
    const dur = rnd(70,40)*1000;
    el.style.left = (dir>0? -20 : 110)+'vw';
    el.animate([
      { transform:`translateX(0)` },
      { transform:`translateX(${dir>0? '140vw' : '-140vw'})` }
    ], { duration: dur, iterations: 1, easing:'linear' });
    boatsEl.appendChild(el);
    setTimeout(()=>{ if(el.isConnected) el.remove(); }, dur+1000);
  }
  setInterval(spawnBoat, 8000); 
  for(let i=0;i<3;i++) spawnBoat();

  // Lighthouse sweep
  const styleSweep = document.createElement('style');
  styleSweep.textContent = `@keyframes sweep{0%{transform:rotate(-10deg)}50%{transform:rotate(12deg)}100%{transform:rotate(-10deg)}}`;
  document.head.appendChild(styleSweep);

  // Parallax
const scene = document.getElementById('scene');
let targetRX=0,targetRY=0,rx=0,ry=0;
function onMove(x,y){
  const cx=window.innerWidth/2, cy=window.innerHeight/2;
  targetRY = (x-cx)/cx * 4;
  targetRX = -(y-cy)/cy * 3;
}
window.addEventListener('mousemove', e=> onMove(e.clientX,e.clientY));
window.addEventListener('touchmove', e=>{ if(e.touches[0]) onMove(e.touches[0].clientX,e.touches[0].clientY); }, {passive:true});
function raf(){
  rx += (targetRX - rx)*0.05; ry += (targetRY - ry)*0.05;
  scene.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg)`;
  requestAnimationFrame(raf);
}
requestAnimationFrame(raf);
})();
</script>
</body>
</html>
<!-- Quiz Section -->
<div class="quiz-section">
  <h1>🏛️ Build Your Own Hierarchy</h1>
  <p class="subtitle">Answer the questions to create a custom design component!</p>
  
  <div class="question" id="q1">
    <div class="question-number">Question 1 - Choose Your Primary Size</div>
    <div class="question-text">
      What font size (in pixels) do you want for your PRIMARY heading? Choose a size that will dominate the design.
      <input type="text" class="fill-blank" id="answer1" placeholder="e.g., 40">
    </div>
    <div class="feedback" id="feedback1"></div>
  </div>
  
  <div class="question" id="q2">
    <div class="question-number">Question 2 - Choose Your Secondary Size</div>
    <div class="question-text">
      What font size (in pixels) do you want for your SECONDARY subheading? It should be smaller than primary but still noticeable.
      <input type="text" class="fill-blank" id="answer2" placeholder="e.g., 24">
    </div>
    <div class="feedback" id="feedback2"></div>
  </div>
  
  <div class="check-button-container">
    <button class="check-answers-btn" id="checkBtn">Build My Component</button>
  </div>
  
  <div class="completion-message" id="completion">
    <h2>🏆 Component Built Successfully!</h2>
    <div class="hierarchy-demo">
      <h2 class="demo-secondary" id="demoSecondary">Primary Level</h2>
      <p class="demo-tertiary" id="demoTertiary">Secondary Level</p>
    </div>
    <p style="margin-top: 25px;">You've created a custom design with proper visual hierarchy!</p>
    <p style="margin-top: 10px; font-size: 1.1em;">Your sizes work together to guide users naturally! 🎯</p>
  </div>
</div>

<style>
.quiz-section {
  padding: 60px 80px;
  background: linear-gradient(135deg, #8b5e3c 0%, #6b4423 100%);
  color: #fff;
  position: relative;
  overflow: hidden;
}

.quiz-section::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(255,255,255,0.03) 1px, transparent 1px);
  background-size: 40px 40px;
  animation: moveGrid 30s linear infinite;
}

@keyframes moveGrid {
  0% { transform: translate(0, 0) rotate(0deg); }
  100% { transform: translate(40px, 40px) rotate(360deg); }
}

.quiz-section h1 {
  font-size: 2.8em;
  background: linear-gradient(135deg, #f4e4d7, #c17767);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 15px;
  text-align: center;
  position: relative;
  z-index: 1;
  text-shadow: 0 2px 20px rgba(0,0,0,.3);
}

.subtitle {
  color: #f4e4d7;
  text-align: center;
  margin-bottom: 50px;
  font-size: 1.3em;
  position: relative;
  z-index: 1;
}

.question {
  background: rgba(255,255,255,.97);
  padding: 35px;
  border-radius: 16px;
  margin-bottom: 25px;
  border: none;
  box-shadow: 0 10px 40px rgba(0,0,0,.25);
  transition: all 0.3s ease;
  position: relative;
  z-index: 1;
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
}

.fill-blank::placeholder {
  color: #999;
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
  border: none;
  box-shadow: 0 4px 15px rgba(76,175,80,.4);
}

.feedback.incorrect {
  background: linear-gradient(135deg, #ef5350, #e53935);
  color: white;
  border: none;
  box-shadow: 0 4px 15px rgba(239,83,80,.4);
}

.check-button-container {
  text-align: center;
  margin-top: 35px;
  position: relative;
  z-index: 1;
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
  margin-top: 40px;
  box-shadow: 0 20px 60px rgba(76,175,80,.4);
  position: relative;
  z-index: 1;
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

.completion-message h2 {
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
  background: linear-gradient(135deg, #4caf50, #66bb6a);
  padding: 45px 35px;
  border-radius: 15px;
  margin: 30px auto;
  max-width: 600px;
  box-shadow: 0 10px 40px rgba(0,0,0,.2);
}

.demo-primary {
  font-size: 40px;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 20px;
  line-height: 1.2;
}

.demo-secondary {
  font-size: 24px;
  font-weight: 600;
  color: #ffffff;
  margin-bottom: 18px;
}

.demo-tertiary {
  font-size: 16px;
  font-weight: 400;
  color: #ffffff;
  line-height: 1.6;
  margin: 0;
}

.hint {
  color: #c17767;
  font-size: 0.95em;
  font-style: italic;
  margin-top: 12px;
  font-weight: 500;
}

@media (max-width: 768px) {
  .quiz-section {
    padding: 40px 20px;
  }
  
  .quiz-section h1 {
    font-size: 2.2em;
  }
  
  .demo-primary {
    font-size: 32px !important;
  }
  
  .demo-secondary {
    font-size: 20px !important;
  }
}
</style>

<script>
document.getElementById('checkBtn').addEventListener('click', function() {
  const input1 = document.getElementById('answer1');
  const input2 = document.getElementById('answer2');
  const feedback1 = document.getElementById('feedback1');
  const feedback2 = document.getElementById('feedback2');
  const question1 = document.getElementById('q1');
  const question2 = document.getElementById('q2');
  
  const answer1 = input1.value.trim();
  const answer2 = input2.value.trim();
  
  // Extract numbers from inputs
  const primarySize = parseInt(answer1);
  const secondarySize = parseInt(answer2);
  
  let allCorrect = true;
  
  // Check answer 1 - Primary size (32-48px)
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
  
  // Check answer 2 - Secondary size (24-32px and must be smaller than primary)
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
  
  // Show reward if both correct
  if (allCorrect) {
    setTimeout(() => {
      // Show completion with user's chosen sizes
      const completion = document.getElementById('completion');
      completion.className = 'completion-message show';
      
      // Apply user's chosen sizes to the demo
      document.getElementById('demoSecondary').style.fontSize = primarySize + 'px';
      document.getElementById('demoSecondary').textContent = `Primary Level (${primarySize}px)`;
      
      document.getElementById('demoTertiary').style.fontSize = secondarySize + 'px';
      document.getElementById('demoTertiary').textContent = `Secondary Level (${secondarySize}px)`;
      
      // Disable the button
      this.disabled = true;
      this.textContent = '✓ Component Built!';
      this.style.background = 'linear-gradient(135deg, #4caf50, #66bb6a)';
    }, 500);
  }
});
</script>
