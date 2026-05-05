---
layout: post
title: 4.2 - Fault Tolerance
description: A fun interactive lesson about fault tolerance for AP CSP - Big Idea 4
categories: [AP CSP, Big Idea 4]
author: Shayan Bhatti, Arnav Pallapotu, Tanay Paranjpe
permalink: /csp/FaultTolerance/p3/lessons
---

<style>
  .ft-wrap {
    position: relative;
    width: 100%;
    height: 90vh;
    overflow: hidden;
    background: #0d0d0f;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'DM Sans', sans-serif;
  }

  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@400;600&display=swap');

  .ft-wrap * { box-sizing: border-box; margin: 0; padding: 0; }

  .ft-slide {
    display: none;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    width: 100%;
    height: 100%;
    padding: 40px 60px;
    color: #f0eeea;
    animation: ftFade 0.4s ease;
    position: absolute;
    top: 0; left: 0;
  }
  .ft-slide.active { display: flex; }

  @keyframes ftFade {
    from { opacity: 0; transform: translateY(12px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .ft-wrap h1 {
    font-family: 'Bebas Neue', sans-serif;
    font-size: clamp(3rem, 9vw, 7rem);
    line-height: 1;
    letter-spacing: 2px;
    color: #f0eeea;
  }
  .ft-wrap h2 {
    font-family: 'Bebas Neue', sans-serif;
    font-size: clamp(1.2rem, 2.4vw, 2.6rem);
    letter-spacing: 1px;
    color: #f0eeea;
    max-width: 860px;
  }
  .ft-wrap p, .ft-wrap li {
    font-size: clamp(0.95rem, 2vw, 1.4rem);
    line-height: 1.5;
    color: #ccc;
    max-width: 780px;
    font-family: 'DM Sans', sans-serif;
  }
  .ft-tag {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 0.9rem;
    letter-spacing: 4px;
    color: #f5c400;
    margin-bottom: 10px;
    text-transform: uppercase;
  }
  .ft-accent { color: #f5c400; }
  .ft-red    { color: #ff3c3c; }
  .ft-green  { color: #3cffa0; }

  /* NAV */
  .ft-nav {
    position: absolute;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    gap: 12px;
    z-index: 10;
  }
  .ft-btn {
    font-family: 'Bebas Neue', sans-serif !important;
    font-size: 1rem !important;
    letter-spacing: 2px;
    padding: 8px 24px !important;
    border: 2px solid #f5c400 !important;
    background: transparent !important;
    color: #f5c400 !important;
    cursor: pointer;
    border-radius: 4px;
    transition: all 0.2s;
    line-height: 1.2 !important;
  }
  .ft-btn:hover { background: #f5c400 !important; color: #0d0d0f !important; }
  .ft-btn:disabled { opacity: 0.2 !important; cursor: default; }
  .ft-btn:disabled:hover { background: transparent !important; color: #f5c400 !important; }

  /* BOXES */
  .ft-row { display: flex; gap: 20px; flex-wrap: wrap; justify-content: center; margin-top: 20px; }
  .ft-box {
    background: #161618;
    border: 2px solid #2a2a2a;
    border-radius: 8px;
    padding: 20px 26px;
    min-width: 160px;
    max-width: 240px;
    font-size: clamp(0.85rem, 1.4vw, 1.1rem);
    color: #ccc;
    font-family: 'DM Sans', sans-serif;
  }

  /* ACTIVITY */
  .ft-activity {
    background: #161618;
    border: 3px solid #f5c400;
    border-radius: 14px;
    padding: 28px 40px;
    margin-top: 18px;
    max-width: 800px;
    font-size: clamp(0.95rem, 1.8vw, 1.3rem);
    color: #ddd;
    line-height: 1.7;
    font-family: 'DM Sans', sans-serif;
  }
  .ft-activity strong { color: #f0eeea; }

  /* STEPS */
  .ft-steps { list-style: none; text-align: left; margin-top: 16px; display: flex; flex-direction: column; gap: 12px; }
  .ft-steps li { display: flex; align-items: flex-start; gap: 12px; }
  .ft-step-num {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 1.5rem;
    color: #f5c400;
    min-width: 28px;
    line-height: 1.2;
  }

  /* ANSWERS */
  .ft-answers { display: flex; gap: 16px; flex-wrap: wrap; justify-content: center; margin-top: 18px; }
  .ft-ans {
    background: #161618;
    border-radius: 8px;
    border-left: 4px solid #3cffa0;
    padding: 14px 20px;
    font-size: clamp(0.85rem, 1.4vw, 1.1rem);
    color: #bbb;
    max-width: 300px;
    text-align: left;
    font-family: 'DM Sans', sans-serif;
  }

  /* DOTS */
  .ft-dots {
    position: absolute;
    top: 0; left: 0; right: 0; bottom: 0;
    pointer-events: none;
    z-index: 0;
    overflow: hidden;
    border-radius: 12px;
  }
  .ft-dots span {
    position: absolute;
    width: 3px; height: 3px;
    background: #1e1e20;
    border-radius: 50%;
  }
  .ft-slide > * { position: relative; z-index: 1; }

  /* DEFS */
  .ft-def-grid { display: flex; gap: 16px; flex-wrap: wrap; justify-content: center; margin-top: 18px; }
  .ft-def-card {
    background: #161618;
    border: 2px solid #2a2a2a;
    border-radius: 10px;
    padding: 18px 22px;
    max-width: 260px;
    text-align: left;
  }
  .ft-def-term {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 1.3rem;
    letter-spacing: 1px;
    color: #f5c400;
    margin-bottom: 6px;
  }
  .ft-def-body {
    font-size: clamp(0.82rem, 1.3vw, 1rem);
    color: #bbb;
    line-height: 1.5;
    font-family: 'DM Sans', sans-serif;
  }
  .ft-def-body strong { color: #f0eeea; }
</style>
<div class="ft-wrap" id="ftWrap">
  <div class="ft-dots" id="ftDots"></div>
  <!-- SLIDE 1: TITLE -->
  <div class="ft-slide active" id="fts1">
    <div class="ft-tag">AP CSP · 4.2</div>
    <h1>Fault<br><span class="ft-accent">Tolerance</span></h1>
    <p style="margin-top:16px;">What happens when something breaks?</p>
  </div>
  <!-- SLIDE 2: BIG IDEA -->
  <div class="ft-slide" id="fts2">
    <div class="ft-tag">The Big Idea</div>
    <h2>The internet <span class="ft-accent">never</span> has a single point of failure</h2>
    <div class="ft-row">
      <div class="ft-box">Multiple paths<br>between every node</div>
      <div class="ft-box">One path dies?<br>Data reroutes</div>
      <div class="ft-box">System keeps<br>working</div>
    </div>
  </div>
  <!-- SLIDE 3: ACTIVITY INTRO -->
  <div class="ft-slide" id="fts3">
    <div class="ft-tag">Class Activity</div>
    <h2>You <span class="ft-accent">are</span> the network</h2>
    <div class="ft-activity">
      Everyone stands up.<br>
      <strong>You = a router.</strong><br>
      You have connections to the people near you.
    </div>
  </div>
  <!-- SLIDE 4: RULES -->
  <div class="ft-slide" id="fts4">
    <div class="ft-tag">How To Play</div>
    <h2>Pass the <span class="ft-accent">message</span></h2>
    <ul class="ft-steps">
      <li><span class="ft-step-num">1</span><p>Pick two people: <strong style="color:#f0eeea">Sender</strong> &amp; <strong style="color:#f0eeea">Receiver</strong></p></li>
      <li><span class="ft-step-num">2</span><p>Sender passes a folded note through the "network" (classmates) to Receiver</p></li>
      <li><span class="ft-step-num">3</span><p>Tap someone <span class="ft-red">offline</span> — they sit down &amp; can't pass</p></li>
      <li><span class="ft-step-num">4</span><p>Can the message still get through? <strong style="color:#f0eeea">Find another path!</strong></p></li>
    </ul>
  </div>
  <!-- SLIDE 5: PLAY -->
  <div class="ft-slide" id="fts5">
    <div class="ft-tag">Go!</div>
    <h1 style="font-size:clamp(5rem,18vw,12rem);">&#9654;</h1>
    <h2>Play it <span class="ft-accent">3 rounds</span></h2>
    <p style="margin-top:10px;">Each round, knock out <span class="ft-red">one more router</span>.<br>See when the message can't get through.</p>
  </div>
  <!-- SLIDE 6: DEBRIEF -->
  <div class="ft-slide" id="fts6">
    <div class="ft-tag">Debrief</div>
    <h2>What did you notice?</h2>
    <div class="ft-answers">
      <div class="ft-ans"><strong style="color:#f0eeea">Redundancy</strong> — extra paths = backup options</div>
      <div class="ft-ans"><strong style="color:#f0eeea">Failure</strong> — the system can absorb it</div>
      <div class="ft-ans"><strong style="color:#f0eeea">Rerouting</strong> — data finds a new way</div>
      <div class="ft-ans"><strong style="color:#f0eeea">Limit</strong> — remove enough nodes and it finally breaks</div>
    </div>
  </div>
  <!-- SLIDE 7: NETWORK – ALL PATHS -->
  <div class="ft-slide" id="fts7">
    <div class="ft-tag">Redundant Routing</div>
    <h2>Many paths, <span class="ft-accent">one fails</span> — still works</h2>
    <svg viewBox="0 0 700 300" xmlns="http://www.w3.org/2000/svg" style="width:min(680px,88vw);margin-top:16px;">
      <line x1="100" y1="150" x2="250" y2="70"  stroke="#3cffa0" stroke-width="2.5" stroke-dasharray="6 3"/>
      <line x1="100" y1="150" x2="250" y2="150" stroke="#3cffa0" stroke-width="2.5" stroke-dasharray="6 3"/>
      <line x1="100" y1="150" x2="250" y2="230" stroke="#3cffa0" stroke-width="2.5" stroke-dasharray="6 3"/>
      <line x1="250" y1="70"  x2="450" y2="70"  stroke="#3cffa0" stroke-width="2.5" stroke-dasharray="6 3"/>
      <line x1="250" y1="150" x2="450" y2="150" stroke="#3cffa0" stroke-width="2.5" stroke-dasharray="6 3"/>
      <line x1="250" y1="230" x2="450" y2="230" stroke="#3cffa0" stroke-width="2.5" stroke-dasharray="6 3"/>
      <line x1="450" y1="70"  x2="600" y2="150" stroke="#3cffa0" stroke-width="2.5" stroke-dasharray="6 3"/>
      <line x1="450" y1="150" x2="600" y2="150" stroke="#3cffa0" stroke-width="2.5" stroke-dasharray="6 3"/>
      <line x1="450" y1="230" x2="600" y2="150" stroke="#3cffa0" stroke-width="2.5" stroke-dasharray="6 3"/>
      <line x1="250" y1="70"  x2="250" y2="230" stroke="#333" stroke-width="1.5"/>
      <line x1="450" y1="70"  x2="450" y2="230" stroke="#333" stroke-width="1.5"/>
      <circle cx="100" cy="150" r="18" fill="#1a1a1c" stroke="#f5c400" stroke-width="2.5"/>
      <text x="100" y="155" text-anchor="middle" fill="#f5c400" font-size="10" font-family="DM Sans,sans-serif">S</text>
      <circle cx="250" cy="70"  r="14" fill="#1a1a1c" stroke="#3cffa0" stroke-width="2"/>
      <circle cx="250" cy="150" r="14" fill="#1a1a1c" stroke="#3cffa0" stroke-width="2"/>
      <circle cx="250" cy="230" r="14" fill="#1a1a1c" stroke="#3cffa0" stroke-width="2"/>
      <circle cx="450" cy="70"  r="14" fill="#1a1a1c" stroke="#3cffa0" stroke-width="2"/>
      <circle cx="450" cy="150" r="14" fill="#1a1a1c" stroke="#3cffa0" stroke-width="2"/>
      <circle cx="450" cy="230" r="14" fill="#1a1a1c" stroke="#3cffa0" stroke-width="2"/>
      <circle cx="600" cy="150" r="18" fill="#1a1a1c" stroke="#f5c400" stroke-width="2.5"/>
      <text x="600" y="155" text-anchor="middle" fill="#f5c400" font-size="10" font-family="DM Sans,sans-serif">R</text>
      <text x="100" y="178" text-anchor="middle" fill="#888" font-size="11" font-family="DM Sans,sans-serif">Sender</text>
      <text x="600" y="178" text-anchor="middle" fill="#888" font-size="11" font-family="DM Sans,sans-serif">Receiver</text>
      <text x="350" y="292" text-anchor="middle" fill="#555" font-size="12" font-family="DM Sans,sans-serif">All paths active — 3 routes available</text>
    </svg>
  </div>
  <!-- SLIDE 8: NETWORK – NODE FAILS -->
  <div class="ft-slide" id="fts8">
    <div class="ft-tag">Redundant Routing</div>
    <h2>One node <span class="ft-red">dies</span> — data reroutes</h2>
    <svg viewBox="0 0 700 300" xmlns="http://www.w3.org/2000/svg" style="width:min(680px,88vw);margin-top:16px;">
      <line x1="100" y1="150" x2="250" y2="150" stroke="#ff3c3c" stroke-width="2" stroke-dasharray="5 4" opacity="0.35"/>
      <line x1="250" y1="150" x2="450" y2="150" stroke="#ff3c3c" stroke-width="2" stroke-dasharray="5 4" opacity="0.35"/>
      <line x1="450" y1="150" x2="600" y2="150" stroke="#ff3c3c" stroke-width="2" stroke-dasharray="5 4" opacity="0.35"/>
      <line x1="100" y1="150" x2="250" y2="70"  stroke="#3cffa0" stroke-width="3" stroke-dasharray="6 3"/>
      <line x1="250" y1="70"  x2="450" y2="70"  stroke="#3cffa0" stroke-width="3" stroke-dasharray="6 3"/>
      <line x1="450" y1="70"  x2="600" y2="150" stroke="#3cffa0" stroke-width="3" stroke-dasharray="6 3"/>
      <line x1="100" y1="150" x2="250" y2="230" stroke="#3cffa0" stroke-width="2.5" stroke-dasharray="6 3" opacity="0.45"/>
      <line x1="250" y1="230" x2="450" y2="230" stroke="#3cffa0" stroke-width="2.5" stroke-dasharray="6 3" opacity="0.45"/>
      <line x1="450" y1="230" x2="600" y2="150" stroke="#3cffa0" stroke-width="2.5" stroke-dasharray="6 3" opacity="0.45"/>
      <line x1="250" y1="70"  x2="250" y2="230" stroke="#333" stroke-width="1.5"/>
      <line x1="450" y1="70"  x2="450" y2="230" stroke="#333" stroke-width="1.5"/>
      <circle cx="250" cy="150" r="14" fill="#2a0a0a" stroke="#ff3c3c" stroke-width="2" opacity="0.5"/>
      <line x1="242" y1="142" x2="258" y2="158" stroke="#ff3c3c" stroke-width="2" opacity="0.5"/>
      <line x1="258" y1="142" x2="242" y2="158" stroke="#ff3c3c" stroke-width="2" opacity="0.5"/>
      <circle cx="450" cy="150" r="14" fill="#2a0a0a" stroke="#ff3c3c" stroke-width="2" opacity="0.5"/>
      <line x1="442" y1="142" x2="458" y2="158" stroke="#ff3c3c" stroke-width="2" opacity="0.5"/>
      <line x1="458" y1="142" x2="442" y2="158" stroke="#ff3c3c" stroke-width="2" opacity="0.5"/>
      <circle cx="100" cy="150" r="18" fill="#1a1a1c" stroke="#f5c400" stroke-width="2.5"/>
      <text x="100" y="155" text-anchor="middle" fill="#f5c400" font-size="10" font-family="DM Sans,sans-serif">S</text>
      <circle cx="250" cy="70"  r="14" fill="#1a1a1c" stroke="#3cffa0" stroke-width="2"/>
      <circle cx="250" cy="230" r="14" fill="#1a1a1c" stroke="#3cffa0" stroke-width="2" opacity="0.6"/>
      <circle cx="450" cy="70"  r="14" fill="#1a1a1c" stroke="#3cffa0" stroke-width="2"/>
      <circle cx="450" cy="230" r="14" fill="#1a1a1c" stroke="#3cffa0" stroke-width="2" opacity="0.6"/>
      <circle cx="600" cy="150" r="18" fill="#1a1a1c" stroke="#f5c400" stroke-width="2.5"/>
      <text x="600" y="155" text-anchor="middle" fill="#f5c400" font-size="10" font-family="DM Sans,sans-serif">R</text>
      <text x="100" y="178" text-anchor="middle" fill="#888" font-size="11" font-family="DM Sans,sans-serif">Sender</text>
      <text x="600" y="178" text-anchor="middle" fill="#888" font-size="11" font-family="DM Sans,sans-serif">Receiver</text>
      <text x="350" y="292" text-anchor="middle" fill="#3cffa0" font-size="12" font-family="DM Sans,sans-serif">Middle routers failed — top path still delivers</text>
    </svg>
  </div>
  <!-- SLIDE 9: DEFINITIONS -->
  <div class="ft-slide" id="fts9">
    <div class="ft-tag">Definitions</div>
    <h2><span class="ft-accent">Key Terms</span></h2>
    <div class="ft-def-grid">
      <div class="ft-def-card">
        <div class="ft-def-term">Fault Tolerance</div>
        <div class="ft-def-body">The ability of a system to <strong>continue operating correctly</strong> even when one or more components fail.</div>
      </div>
      <div class="ft-def-card">
        <div class="ft-def-term">Redundancy</div>
        <div class="ft-def-body">Having <strong>duplicate paths or components</strong> so that if one fails, another takes over.</div>
      </div>
      <div class="ft-def-card">
        <div class="ft-def-term">Router</div>
        <div class="ft-def-body">A device that <strong>forwards data packets</strong> between networks, choosing the best available path.</div>
      </div>
      <div class="ft-def-card">
        <div class="ft-def-term">Packet Switching</div>
        <div class="ft-def-body">Data is broken into small packets that can each take <strong>different routes</strong> to reach the destination.</div>
      </div>
    </div>
  </div>
  <!-- NAV -->
  <div class="ft-nav">
    <button class="ft-btn" id="ftPrev" onclick="ftGo(-1)" disabled>← BACK</button>
    <button class="ft-btn" id="ftNext" onclick="ftGo(1)">NEXT →</button>
  </div>
</div>
<script>
  (function() {
    // Dot background
    const dotsEl = document.getElementById('ftDots');
    for (let i = 0; i < 100; i++) {
      const s = document.createElement('span');
      s.style.left = Math.random() * 100 + '%';
      s.style.top  = Math.random() * 100 + '%';
      dotsEl.appendChild(s);
    }

    const slides = document.querySelectorAll('.ft-slide');
    let cur = 0;

    window.ftGo = function(dir) {
      slides[cur].classList.remove('active');
      cur = Math.max(0, Math.min(slides.length - 1, cur + dir));
      slides[cur].classList.add('active');
      document.getElementById('ftPrev').disabled = cur === 0;
      document.getElementById('ftNext').disabled = cur === slides.length - 1;
    };

    document.addEventListener('keydown', function(e) {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') ftGo(1);
      if (e.key === 'ArrowLeft'  || e.key === 'ArrowUp')   ftGo(-1);
    });
  })();
</script>