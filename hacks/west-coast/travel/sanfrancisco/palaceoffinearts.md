---
layout: post
title: "Palace of Fine Arts"
description: 
permalink: /west-coast/travel/sf/palaceoffinearts/
date: 2025-10-21
---
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Palace of Fine Arts — Continuous Scene (with Ground)</title>
<style>
  :root{
    --sky-day:#9ed0ff; --sky-dusk:#ffb5a7; --sky-night:#0b1a3a;
    --fog:#ffffff;
    --water1:#2a567b; --water2:#183a56;
    --bank1:#4e7e57; --bank2:#33533a; --bank-edge:#2b3f2f;
    --walk1:#cdb793; --walk2:#a68a63; --curb:#6e5a3f;
    --stone:#c2a777; --stone-deep:#a88c5f; --cap:#8e744e; --shadow:#5e4b33;
    --light:#ffe29a; --lamp:#ffefc3;
    --tree:#2d6b45; --trunk:#5b3a29; --reed:#376b48;
    --duck:#f7f7f7; --duckbill:#f4a261; --boat:#d9d9d9;
  }
  *{box-sizing:border-box;margin:0;padding:0}
  html,body{min-height:100%;background:#0b1a3a}
  body{font-family:system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;overflow-x:hidden;overflow-y:auto}

  /* Scene container - centered and fixed aspect */
  .scene-wrapper{width:100%;display:flex;justify-content:center;align-items:center;padding:40px 0;background:#0b1a3a;}
  .scene{position:relative;width:90vw;max-width:1400px;height:80vh;perspective:1200px;opacity:1;animation:fadeIn 1.2s ease;margin:0 auto;}
  @keyframes fadeIn{from{opacity:0}to{opacity:1}}
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
  .water{position:absolute;inset:auto 0 0 0;height:38vh;background:linear-gradient(to bottom,var(--water1),var(--water2));z-index:3}
  .ripples{position:absolute;inset:0;background:
      repeating-linear-gradient( to right, rgba(255,255,255,.10) 0 2px, transparent 2px 12px),
      radial-gradient(ellipse at 50% 20%, rgba(255,255,255,.10), transparent 60%),
      radial-gradient(ellipse at 40% 30%, rgba(255,255,255,.07), transparent 60%);
      opacity:.35;animation: drift 30s linear infinite;mix-blend-mode:screen}
  @keyframes drift{from{background-position:0 0,0 0,0 0} to{background-position:600px 0, 400px 0, 800px 0}}

  /* GROUND / SHORE */
  .bank{position:absolute;left:0;right:0;bottom:38vh;height:10vh;z-index:4;}
  .bank:before{content:"";position:absolute;inset:0;background:linear-gradient(to bottom,var(--bank1),var(--bank2));}
  .bank:after{content:"";position:absolute;left:-10vw;right:-10vw;top:-3vh;height:6vh;border-radius:0 0 50% 50%/0 0 100% 100%;background:linear-gradient(to bottom, var(--bank1), transparent 80%);} 

  /* promenade walkway */
  .prom{position:absolute;left:8vw;right:8vw;bottom:calc(38vh + 6vh);height:20px;background:linear-gradient(var(--walk1),var(--walk2));border-radius:14px;box-shadow:0 6px 10px rgba(0,0,0,.25);z-index:6}
  .curb{position:absolute;left:6vw;right:6vw;bottom:calc(38vh + 6vh - 6px);height:6px;background:var(--curb);border-radius:6px;z-index:5;opacity:.8}

  /* reeds at shoreline */
  .reeds{position:absolute;left:0;right:0;bottom:38vh;height:7vh;z-index:6;pointer-events:none}
  .reed{position:absolute;bottom:0;width:2px;height:calc(2vh + 2.5vmin);background:var(--reed);box-shadow:0 0 6px rgba(0,0,0,.25)}

  /* TREES */
  .trees{position:absolute;left:0;right:0;bottom:48vh;height:12vh;z-index:5;pointer-events:none}
  .tree{position:absolute;bottom:0;width:28px;height:28px;border-radius:50%;background:var(--tree);box-shadow:0 0 0 12px #348354 inset,0 10px 12px rgba(0,0,0,.25)}
  .tree:after{content:"";position:absolute;left:50%;transform:translateX(-50%);bottom:-16px;width:8px;height:16px;background:var(--trunk);border-radius:2px}

  /* PALACE */
  .palace{position:absolute;left:0;right:0;bottom:36vh;height:44vh;z-index:6;pointer-events:none}
  .palace svg{width:100%;height:100%}

  /* SWANS / BOATS */
  .swans{position:absolute;left:-20vw;right:-20vw;bottom:10vh;height:8vh;z-index:7}
  .swan{position:absolute;bottom:0;width:46px;height:18px}
  .swan .body{position:absolute;left:0;top:6px;width:32px;height:12px;background:var(--duck);border-radius:10px 12px 12px 10px}
  .swan .neck{position:absolute;left:26px;top:-2px;width:6px;height:18px;background:var(--duck);border-radius:6px 6px 0 0;transform:rotate(-12deg)}
  .swan .head{position:absolute;left:28px;top:-6px;width:10px;height:10px;background:var(--duck);border-radius:50%}
  .swan .bill{position:absolute;left:36px;top:-2px;width:8px;height:4px;background:var(--duckbill);border-radius:2px}

  .sail{position:absolute;bottom:2px;width:90px;height:18px;background:var(--boat);border-radius:0 0 10px 10px;box-shadow:0 8px 10px -8px rgba(0,0,0,.7);}
  .sail:before{content:"";position:absolute;left:20px;bottom:18px;width:0;height:0;border-left:12px solid transparent;border-right:12px solid transparent;border-bottom:24px solid #f7f7f7;filter:drop-shadow(0 2px 0 rgba(0,0,0,.25))}

  /* BIRDS */
  .birds{position:absolute;inset:10vh 0 auto 0;height:18vh;z-index:7}
  .gull{position:absolute;top:0;left:0;width:24px;height:12px;--t:20s;animation: fly var(--t) linear infinite}
  .gull svg{width:100%;height:100%}
  @keyframes fly{0%{offset-distance:0%}100%{offset-distance:100%}}
  .gull{offset-path:path("M 0,50 C 20,0 40,0 60,50 S 120,100 140,50 S 200,0 240,50 S 300,100 360,60")}

  /* Accessibility */
  @media (prefers-reduced-motion: reduce){
    .sky::before,.orb,.fog > span,.gull,.ripples{animation:none !important}
  }

  /* Scroll area */
  .page{position:relative;background:#0b1a3a;padding:80px 20px;}
</style>
</head>
<body>
<div class="scene-wrapper">
<!-- Scene -->
<div class="scene" id="scene" aria-label="Palace of Fine Arts scene">
  <div class="sky"></div>
  <div class="orb" aria-hidden="true"></div>

  <!-- Fog layers -->
  <div class="fog" aria-hidden="true">
    <span class="f1"></span>
    <span class="f2"></span>
    <span class="f3"></span>
  </div>

  <!-- WATER -->
  <div class="water"><div class="ripples"></div></div>

  <!-- GROUND strip & promenade -->
  <div class="bank"></div>
  <div class="curb"></div>
  <div class="prom"></div>
  <div class="reeds" id="reeds"></div>

  <!-- TREES behind the promenade for depth -->
  <div class="trees" aria-hidden="true">
    <div class="tree" style="left:6vw"></div>
    <div class="tree" style="left:14vw"></div>
    <div class="tree" style="left:78vw"></div>
    <div class="tree" style="left:86vw"></div>
  </div>

  <!-- PALACE silhouette with rotunda & colonnade -->
  <div class="palace" aria-label="Palace rotunda and colonnade">
    <svg viewBox="0 0 1600 700" preserveAspectRatio="none" role="img">
      <defs>
        <linearGradient id="stoneGrad" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stop-color="var(--stone)"/>
          <stop offset="100%" stop-color="var(--stone-deep)"/>
        </linearGradient>
        <linearGradient id="capGrad" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stop-color="var(--cap)"/>
          <stop offset="100%" stop-color="var(--shadow)"/>
        </linearGradient>
        <linearGradient id="fade" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stop-color="#fff" stop-opacity="1"/>
          <stop offset="100%" stop-color="#fff" stop-opacity="0"/>
        </linearGradient>
        <mask id="fadeMask"><rect x="0" y="360" width="1600" height="340" fill="url(#fade)"/></mask>
      </defs>

      <!-- Colonnade left -->
      <g transform="translate(140,320)" fill="url(#stoneGrad)" stroke="var(--shadow)" stroke-width="4">
        <g>
          <rect x="0" y="0" width="36" height="170" rx="8"/>
          <rect x="90" y="0" width="36" height="170" rx="8"/>
          <rect x="180" y="0" width="36" height="170" rx="8"/>
          <rect x="-16" y="-26" width="248" height="28" rx="8" fill="url(#capGrad)"/>
          <rect x="-10" y="170" width="236" height="18" rx="8" fill="url(#capGrad)"/>
        </g>
      </g>

      <!-- Rotunda center -->
      <g transform="translate(520,180)" stroke="var(--shadow)" stroke-width="4">
        <rect x="-10" y="300" width="580" height="26" rx="10" fill="url(#capGrad)"/>
        <g fill="url(#stoneGrad)">
          <rect x="0" y="120" width="40" height="190" rx="10"/>
          <rect x="90" y="120" width="40" height="190" rx="10"/>
          <rect x="180" y="120" width="40" height="190" rx="10"/>
          <rect x="270" y="120" width="40" height="190" rx="10"/>
          <rect x="360" y="120" width="40" height="190" rx="10"/>
          <rect x="450" y="120" width="40" height="190" rx="10"/>
        </g>
        <rect x="-20" y="80" width="560" height="48" rx="16" fill="url(#capGrad)"/>
        <ellipse cx="260" cy="60" rx="290" ry="60" fill="url(#capGrad)"/>
        <ellipse cx="260" cy="20" rx="220" ry="48" fill="url(#capGrad)"/>
      </g>

      <!-- Colonnade right -->
      <g transform="translate(1200,320)" fill="url(#stoneGrad)" stroke="var(--shadow)" stroke-width="4">
        <g>
          <rect x="0" y="0" width="36" height="170" rx="8"/>
          <rect x="90" y="0" width="36" height="170" rx="8"/>
          <rect x="180" y="0" width="36" height="170" rx="8"/>
          <rect x="-16" y="-26" width="248" height="28" rx="8" fill="url(#capGrad)"/>
          <rect x="-10" y="170" width="236" height="18" rx="8" fill="url(#capGrad)"/>
        </g>
      </g>

      <!-- Ground contact shadows -->
      <g class="groundShadows" opacity=".5">
        <ellipse cx="800" cy="510" rx="310" ry="10" fill="rgba(0,0,0,.28)" style="filter:blur(1.5px)"/>
        <ellipse cx="250" cy="510" rx="130" ry="9" fill="rgba(0,0,0,.28)" style="filter:blur(1.2px)"/>
        <ellipse cx="1310" cy="510" rx="130" ry="9" fill="rgba(0,0,0,.28)" style="filter:blur(1.2px)"/>
      </g>

      <!-- Reflection of palace -->
      <g mask="url(#fadeMask)" opacity=".25" transform="scale(1,-1) translate(0,-720)">
        <g transform="translate(140,320)" fill="#000">
          <rect x="0" y="0" width="36" height="170" rx="8"/>
          <rect x="90" y="0" width="36" height="170" rx="8"/>
          <rect x="180" y="0" width="36" height="170" rx="8"/>
          <rect x="-16" y="-26" width="248" height="28" rx="8"/>
          <rect x="-10" y="170" width="236" height="18" rx="8"/>
        </g>
        <g transform="translate(520,180)" fill="#000">
          <rect x="-10" y="300" width="580" height="26" rx="10"/>
          <rect x="0" y="120" width="40" height="190" rx="10"/>
          <rect x="90" y="120" width="40" height="190" rx="10"/>
          <rect x="180" y="120" width="40" height="190" rx="10"/>
          <rect x="270" y="120" width="40" height="190" rx="10"/>
          <rect x="360" y="120" width="40" height="190" rx="10"/>
          <rect x="450" y="120" width="40" height="190" rx="10"/>
          <rect x="-20" y="80" width="560" height="48" rx="16"/>
          <ellipse cx="260" cy="60" rx="290" ry="60"/>
          <ellipse cx="260" cy="20" rx="220" ry="48"/>
        </g>
        <g transform="translate(1200,320)" fill="#000">
          <rect x="0" y="0" width="36" height="170" rx="8"/>
          <rect x="90" y="0" width="36" height="170" rx="8"/>
          <rect x="180" y="0" width="36" height="170" rx="8"/>
          <rect x="-16" y="-26" width="248" height="28" rx="8"/>
          <rect x="-10" y="170" width="236" height="18" rx="8"/>
        </g>
      </g>
    </svg>
  </div>

  <!-- SWANS / BOAT -->
  <div class="swans" id="swans"></div>

  <!-- BIRDS -->
  <div class="birds" id="birds"></div>

  <!-- Interaction layer -->
  <div class="overlay" id="overlay" aria-hidden="true"></div>
</div>
</div>

<!-- Scrollable content below the scene -->
<main class="page">
  <section class="lesson-content">
    <h1 style="text-align:center;font-size:3em;color:#fff;margin-bottom:40px;text-shadow:none">🏛️ UI Hierarchy Lesson: Palace of Fine Arts</h1>
    
   <div style="padding:50px;max-width:900px;margin:0 auto 60px;">
      <h2 style="color:#fff;font-size:2.2em;margin-bottom:20px">What is UI Hierarchy?</h2>
      <p style="color:#fff;font-size:1.2em;line-height:1.8;margin-bottom:30px">
      UI hierarchy organizes elements by importance. Think of the Palace of Fine Arts—the grand rotunda dominates the landscape, with colonnades and lagoon arranged to guide visitors naturally through the architectural wonder.
      </p>
      
      <h2 style="color:#fff;font-size:2.2em;margin:40px 0 20px">The 3 Levels of Hierarchy</h2>
      
  <div style="padding:30px;margin:20px 0;">
        <h3 style="color:#fff;font-size:1.8em;margin-bottom:15px">🏛️ Primary (The Rotunda)</h3>
        <p style="color:#fff;font-size:1.15em;line-height:1.7">
          Most important content—as majestic as the 162-foot central dome.<br>
          <strong>Examples:</strong> Main headlines, key buttons, hero images
        </p>
      </div>
      
  <div style="padding:30px;margin:20px 0;">
        <h3 style="color:#fff;font-size:1.5em;margin-bottom:15px">🏛️ Secondary (The Colonnades)</h3>
        <p style="color:#fff;font-size:1.1em;line-height:1.7">
          Supporting information—like the sweeping curved colonnades that frame the space.<br>
          <strong>Examples:</strong> Subheadings, section titles, secondary buttons
        </p>
      </div>
      
  <div style="padding:30px;margin:20px 0;">
        <h3 style="color:#fff;font-size:1.2em;margin-bottom:15px">🏛️ Tertiary (Decorative Details)</h3>
        <p style="color:#fff;font-size:1em;line-height:1.7">
          Additional details—ornate sculptures, weeping maidens, and reflecting pool.<br>
          <strong>Examples:</strong> Body text, captions, metadata
        </p>
      </div>
      
  <h2 style="color:#fff;font-size:2.2em;margin:50px 0 20px">5 Tools to Create Hierarchy</h2>
      
  <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:25px;margin:30px 0">
        <div style="padding:25px;">
          <h4 style="color:#fff;font-size:1.4em;margin-bottom:10px">1️⃣ Size</h4>
          <p style="color:#fff;line-height:1.6">Like the rotunda rising above the colonnades</p>
        </div>
        <div style="padding:25px;">
          <h4 style="color:#fff;font-size:1.4em;margin-bottom:10px">2️⃣ Weight</h4>
          <p style="color:#fff;line-height:1.6">Massive Roman columns vs. delicate sculptural details</p>
        </div>
        <div style="padding:25px;">
          <h4 style="color:#fff;font-size:1.4em;margin-bottom:10px">3️⃣ Color</h4>
          <p style="color:#fff;line-height:1.6">Warm terracotta against lush greenery</p>
        </div>
        <div style="padding:25px;">
          <h4 style="color:#fff;font-size:1.4em;margin-bottom:10px">4️⃣ Spacing</h4>
          <p style="color:#fff;line-height:1.6">Open lagoon creates breathing room</p>
        </div>
        <div style="padding:25px;">
          <h4 style="color:#fff;font-size:1.4em;margin-bottom:10px">5️⃣ Position</h4>
          <p style="color:#fff;line-height:1.6">Eyes travel to the rotunda first</p>
        </div>
      </div>
      
  <div style="padding:30px;margin:50px 0 30px;">
        <h3 style="color:#fff;font-size:1.8em;margin-bottom:15px">💡 Quick Tips</h3>
        <ul style="color:#fff;font-size:1.15em;line-height:2;list-style:none;padding-left:0">
          <li>✓ Limit to 1-2 fonts</li>
          <li>✓ Create dramatic contrast (terracotta columns against sky)</li>
          <li>✓ Test by squinting—structure should still be clear</li>
          <li>✓ Use familiar patterns (entrance → colonnade → rotunda → lagoon)</li>
        </ul>
      </div>
    </div>
  </section>
</main>

<script>
(function(){
  const scene = document.getElementById('scene');

  const rnd=(a=1,b=0)=>Math.random()*(a-b)+b;

  // Add reeds at shoreline
  const reeds = document.getElementById('reeds');
  for(let i=0;i<40;i++){
    const r=document.createElement('div'); r.className='reed';
    r.style.left = `${rnd(2,98)}vw`;
    r.style.height = `calc(2vh + ${rnd(1.5,4)}vmin)`;
    r.style.opacity = rnd(.9,.4);
    reeds.appendChild(r);
  }

  // Birds
  const birdsEl = document.getElementById('birds');
  const gullSVG = `
    <svg viewBox="0 0 24 12" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
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

  // Swans & sailboat
  const swansEl = document.getElementById('swans');
  function spawnSwan(){
    const s=document.createElement('div'); s.className='swan';
    s.innerHTML = '<div class="body"></div><div class="neck"></div><div class="head"></div><div class="bill"></div>';
    s.style.left = rnd(0,100)+'vw';
    s.animate([
      { transform:`translateX(-140vw)` },
      { transform:`translateX(120vw)` }
    ], { duration: rnd(70000,40000), iterations: 1, easing:'linear' });
    swansEl.appendChild(s);
    setTimeout(()=>{ if(s.isConnected) s.remove(); }, 72000);
  }
  function spawnBoat(){
    const b=document.createElement('div'); b.className='sail';
    b.style.left = rnd(0,100)+'vw';
    b.animate([
      { transform:`translateX(-140vw)` },
      { transform:`translateX(120vw)` }
    ], { duration: rnd(80000,50000), iterations: 1, easing:'linear' });
    swansEl.appendChild(b);
    setTimeout(()=>{ if(b.isConnected) b.remove(); }, 82000);
  }
  setInterval(spawnSwan, 9000); 
  for(let i=0;i<3;i++) spawnSwan();
  setInterval(spawnBoat, 12000); 
  spawnBoat();
})();
</script>

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
  color: #000;
  margin-bottom: 35px;
  font-size: 2.3em;
  text-shadow: 0 2px 10px rgba(0,0,0,.2);
}

.completion-message p {
  color: #000;
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
  color: #000;
  margin-bottom: 20px;
  line-height: 1.2;
}

.demo-secondary {
  font-size: 24px;
  font-weight: 600;
  color: #000;
  margin-bottom: 18px;
}

.demo-tertiary {
  font-size: 16px;
  font-weight: 400;
  color: #000;
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
