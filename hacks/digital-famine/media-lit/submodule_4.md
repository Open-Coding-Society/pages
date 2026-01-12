---
layout: post
title: "Bias Sort"
description: "Final line of defense from foregin invaders"
permalink: /digital-famine/media-lit/submodule_4/
footer:
  previous: /digital-famine/media-lit/submodule_3/
  home: /hacks/navigation
  next: /digital-famine/media-lit/submodule_5/
parent: "Analytics/Admin"
team: "Scratchers"
submodule: 3
categories: [CSP, Submodule, Analytics/Admin]
tags: [analytics, submodule, curators]
breadcrumb: true
microblog: true
author: "Anwita Bandaru, Nick Diaz"
date: 2025-10-28
---

<style>
body {
  min-height: 100vh;
  background: url('{{ site.baseurl }}/hacks/digital-famine/media-lit/media/assets/spacebackground.jpg') no-repeat center center fixed;
  background-size: cover;
  background-color: #061226; /* fallback */
}
.mission-container {
background: rgba(0,0,30,0.85);
padding: 20px;
border-radius: 12px;
font-family: system-ui, -apple-system, sans-serif;
font-size: 1.05rem;
margin-bottom: 20px;
line-height: 1.5;
}
</style>

<div class="mission-container">
  <h1>Bias Sort</h1>
  <h3>Wording can be Misleading</h3>

  <p>
    During an alien invasion, confusion spreads fast. One broadcast says the invaders are “approaching peacefully,” while another claims they’re “advancing on our cities.” Same event, but totally different emotions. The way words are chosen can make something sound safe or threatening, fair or biased. In moments of crisis, wording can mislead us just as easily as alien trickery. Learning to spot charged or slanted language helps us see past the panic and focus on the truth.
  </p>

  <h3>Transmission from Media Literacy Command:</h3>
  <p>
    Planet Media Literacy's communication grid has been hacked by alien misinformation drones. They’re spreading biased headlines to confuse humans and weaken your defenses.
    <strong>Your mission</strong>: analyze incoming headlines and separate reliable transmissions from corrupted ones before misinformation spreads across the galaxy.
  </p>

  <h3>Mission Briefing</h3>
  <ul>
    <li>Read each incoming headline on your dashboard.</li>
    <li>Decide if the transmission sounds balanced and factual or biased and manipulative.</li>
    <li>Drag or beam each headline into the correct containment zone on the right:</li>
  </ul>

  <ul>
    <li>🟦 <strong>Balanced / Accurate</strong> – verified signals from trusted sources.</li>
    <li>🔴 <strong>Biased / Misleading</strong> – corrupted broadcasts from alien bots.</li>
  </ul>

  <p>
    Complete your analysis to secure the communication line and see your mission score.
  </p>
</div>



<div class="game-card-wrapper">
  <style>
    /* Card + palette (light blue) */
    .game-card {
      max-width: 980px;
      margin: 28px auto;
      /* lighter blue card to match the other game */
      background: linear-gradient(135deg, #353e74ff, #9384d5ff);
      border-radius: 16px;
      padding: 22px;
      box-shadow: 0 10px 30px rgba(27,78,120,0.08);
      color: #04263a;
      font-family: system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial;
    }
    .game-header { display:flex; justify-content:space-between; align-items:center; gap:12px; margin-bottom:12px; }
    .game-title { font-size:1.15rem; margin:0; font-weight:700; color:#033e61; }
    .controls { display:flex; gap:8px; }
    .pill { background: rgba(3,62,97,0.06); padding:6px 10px; border-radius:999px; font-weight:700; color:#033e61; }
    .grid { display:grid; grid-template-columns: 1fr 320px; gap:18px; align-items:start; }
    .board {
      background: rgba(190, 192, 246, 0.75);
      border-radius:12px;
      padding:16px;
      min-height:320px;
      box-shadow: 0 4px 12px rgba(2,22,36,0.04) inset;
    }
    .items { display:flex; flex-wrap:wrap; gap:12px; margin-top:8px; }
    .headline {
      background: white;
      padding:10px 12px;
      border-radius:10px;
      box-shadow: 0 2px 6px rgba(2,22,36,0.06);
      cursor:grab;
      width: calc(50% - 12px);
      min-width: 180px;
      user-select:none;
      transition: transform .12s ease, opacity .12s ease;
      font-size:14px;
      color:#04263a;
    }
    .headline.dragging { opacity:0.6; transform:scale(.98); cursor:grabbing; }
    .side {
      display:flex;
      flex-direction:column;
      gap:12px;
    }
    .bin {
      background: rgba(176, 186, 241, 0.86);
      border: 2px dashed rgba(3,62,97,0.12);
      padding:12px;
      border-radius:10px;
      min-height:110px;
      display:flex;
      flex-direction:column;
      gap:8px;
      align-items:center;
      text-align:center;
      transition: transform .18s ease, box-shadow .18s ease, border-color .18s ease;
      color:#04334b;
    }
    .bin.highlight { transform: translateY(-4px); border-color: rgba(3,62,97,0.45); box-shadow: 0 8px 20px rgba(3,62,97,0.06); }
    .bin-label { font-weight:800; color:#033e61; margin-bottom:6px; }
    .bin .bin-contents { display:flex; flex-wrap:wrap; gap:8px; justify-content:center; width:100%; }
    .status { color: #678dc2ff; font-size:18px; margin-top:8px; }
    .controls button {
      background: #0b74b5;
      color: white;
      border: none;
      padding:8px 12px;
      border-radius:10px;
      cursor:pointer;
      font-weight:700;
    }
    .controls button.ghost { background: transparent; color:#033e61; border:1px solid rgba(3,62,97,0.08); }
    .leaderboard {
      /* darker leaderboard so header/title is readable */
      background: linear-gradient(135deg, rgba(148, 146, 215, 0.55), rgba(109, 124, 207, 0.47));
      padding:12px;
      border-radius:10px;
      color: #eaf6ff;
      border: 1px solid rgba(255,255,255,0.04);
    }
    /* refresh button inside leaderboard: more polished appearance */
    #refresh-lb.ghost {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 6px 10px;
      background: #5c7cb0ff;
      color: #eaf6ff;
      border: 1px solid rgba(255,255,255,0.06);
      border-radius: 8px;
      font-weight: 700;
      cursor: pointer;
      box-shadow: 0 6px 14px rgba(3,62,97,0.08);
      transition: transform 140ms ease, box-shadow 140ms ease, background 140ms ease;
    }
    #refresh-lb.ghost::before {
      content: "⟳";
      font-size: 14px;
      opacity: 0.95;
      transform: translateY(0);
    }
    #refresh-lb.ghost:hover {
      transform: translateY(-3px);
      box-shadow: 0 10px 24px rgba(3,62,97,0.14);
      background: linear-gradient(90deg, rgba(255,255,255,0.07), rgba(255,255,255,0.02));
    }
    @media (max-width:900px) { .grid{grid-template-columns:1fr} }
  </style>

  <div class="game-card" role="application" aria-labelledby="bias-game-title">
    <div class="game-header">
      <div>
        <h2 id="bias-game-title" class="game-title">Bias Checker — Mission</h2>
        <div class="status">Sort incoming headlines into the correct bin. You have 3 lives — wrong answers cost a life.</div>
        <!-- player pill moved here to separate from action buttons -->
        <div style="margin-top:10px;">
          <div class="pill" id="player-name">Player: Guest</div>
        </div>
      </div>
      <div class="controls" style="align-items:center;">
        <!-- action buttons grouped on the right to reduce clustering -->
        <button id="shuffle" title="Shuffle headlines">Shuffle</button>
        <button id="reset" class="ghost" title="Reset game">Reset</button>
        <button id="autofill-headlines" class="ghost" title="Autofill headlines">Autofill</button>
        <button id="submit-headlines" class="btn-primary" title="Submit answers">Submit</button>
      </div>
    </div>

    <div class="grid">
      <section class="board" aria-label="Headlines board">
        <div class="small">Incoming transmissions</div>
        <div class="items" id="items" aria-live="polite"></div>
        <div class="status" style="margin-top:12px;">
          Score: <strong id="score">0</strong> &nbsp;|&nbsp; Lives: <span id="lives">👽👽👽</span> &nbsp;|&nbsp; Total: <span id="total">0</span>
        </div>
      </section>

      <aside class="side" aria-label="Bins">
        <div class="bin" id="leftZone" data-zone="good" tabindex="0" aria-label="Balanced / Accurate">
          <div class="bin-label">Balanced / Accurate</div>
          <div class="bin-contents" aria-live="polite"></div>
        </div>

        <div class="bin" id="rightZone" data-zone="bad" tabindex="0" aria-label="Biased / Misleading">
          <div class="bin-label">Biased / Misleading</div>
          <div class="bin-contents" aria-live="polite"></div>
        </div>

        <div class="leaderboard">
          <div style="display:flex;justify-content:space-between;align-items:center;">
            <strong>Top Players</strong>
            <button id="refresh-lb" class="ghost">Refresh</button>
          </div>
          <table style="width:100%; margin-top:10px; font-size:13px;">
            <thead><tr><th>#</th><th>Player</th><th style="text-align:right">Score</th></tr></thead>
            <tbody id="leaderboard-body"><tr><td colspan="3" style="text-align:center;color:rgba(3,62,97,0.5)">Loading...</td></tr></tbody>
          </table>
        </div>
      </aside>
    </div>
  </div>

  <script>
    const TOPICS = ['technology', 'health', 'politics', 'environment', 'education', 'space', 'economy', 'science'];
    
    const GOOD_TEMPLATES = [
      'Study finds {positive} impact of {topic} on {benefit}',
      'New research reveals {topic} improvements in {location}',
      'Report: {topic} statistics show steady progress in {area}',
      'Scientists document {positive} trends in {topic} research',
      '{location} announces evidence-based {topic} initiative',
      'Data indicates {measurable} progress in {topic} sector'
    ];
    
    const BAD_TEMPLATES = [
      'SHOCKING: {topic} crisis threatens {dramatic}',
      'Opinion: Why {topic} is destroying {dramatic}',
      'Experts WARN of dangerous {topic} conspiracy',
      'You won\'t BELIEVE what {topic} is doing to {dramatic}',
      'URGENT: {dramatic} at risk from {topic} threat',
      'SECRET {topic} agenda exposed - what they don\'t want you to know'
    ];

    function generateHeadline(biased = false) {
      const templates = biased ? BAD_TEMPLATES : GOOD_TEMPLATES;
      const template = templates[Math.floor(Math.random() * templates.length)];
      const topic = TOPICS[Math.floor(Math.random() * TOPICS.length)];
      
      const variables = {
        topic: topic,
        location: ['Global', 'National', 'Regional', 'Local'][Math.floor(Math.random() * 4)],
        positive: ['beneficial', 'positive', 'promising', 'significant', 'sustainable'][Math.floor(Math.random() * 5)],
        benefit: ['public welfare', 'community development', 'future prospects', 'living standards'][Math.floor(Math.random() * 4)],
        dramatic: ['your future', 'our children', 'society', 'humanity', 'our world'][Math.floor(Math.random() * 5)],
        area: ['implementation', 'development', 'innovation', 'advancement'][Math.floor(Math.random() * 4)],
        measurable: ['quantifiable', 'substantial', 'verifiable', 'documented'][Math.floor(Math.random() * 4)]
      };
      
      return template.replace(/{(\w+)}/g, (_, key) => variables[key] || key);
    }

    function generateHeadlines(count = 8) {
      const headlines = [];
      for (let i = 0; i < count; i++) {
        const biased = Math.random() < 0.5;  
        headlines.push({
          id: i + 1,
          text: generateHeadline(biased),
          correct: biased ? 'bad' : 'good'
        });
      }
      return headlines;
    }

    const HEADLINES = generateHeadlines(8);

    const itemsEl = document.getElementById('items');
    const leftZone = document.getElementById('leftZone');
    const rightZone = document.getElementById('rightZone');
    const scoreEl = document.getElementById('score');
    const livesEl = document.getElementById('lives');
    const totalEl = document.getElementById('total');
    const shuffleBtn = document.getElementById('shuffle');
    const resetBtn = document.getElementById('reset');
    const playerNameEl = document.getElementById('player-name');
    const leaderboardBody = document.getElementById('leaderboard-body');

    // state
    let state = {
      order: [],
      placed: {},   // id -> true when placed
      score: 0,
      lives: 3
    };

    // feedback modal/message
    function showCongrats() {
      const msg = document.createElement('div');
      msg.style.position = 'fixed';
      msg.style.top = '0';
      msg.style.left = '0';
      msg.style.width = '100vw';
      msg.style.height = '100vh';
      msg.style.background = 'rgba(0,0,0,0.55)';
      msg.style.display = 'flex';
      msg.style.alignItems = 'center';
      msg.style.justifyContent = 'center';
      msg.style.zIndex = '9999';
      msg.innerHTML = `<div style="background: #6a75c8ff;padding:36px 32px 28px 32px;border-radius:18px;box-shadow:0 8px 32px #353e7444;text-align:center;max-width:420px;">
        <h2 style='color:#2b6cb0;margin-bottom:12px;'>Congratulations!</h2>
        <div style='font-size:1.1rem;color:#033e61;margin-bottom:18px;'>You successfully defended Media Literacy Planet.<br><b>The shield level is now 4 and fully capable of keeping invaders out. The number for the vault is 4.</b></div>
        <div style='font-size:1.05rem;color: #a3cbf5ff;margin-bottom:18px;'>You've earned your certificate in: <b>Media Literacy</b>!</div>
        <button style='margin-top:8px;padding:8px 18px;border-radius:8px;background:#4299e1;color:white;font-weight:700;border:none;cursor:pointer;' onclick='this.closest("div").parentNode.remove()'>Close</button>
      </div>`;
      document.body.appendChild(msg);
    }

    function renderItems() {
      itemsEl.innerHTML = '';
      state.order.forEach(h => {
        if (state.placed[h.id]) return; // skip placed
        const el = document.createElement('div');
        el.className = 'headline';
        el.draggable = true;
        el.textContent = h.text;
        el.dataset.id = h.id;
        el.dataset.correct = h.correct;
        // drag handlers
        el.addEventListener('dragstart', (e) => {
          e.dataTransfer.setData('text/plain', h.id);
          el.classList.add('dragging');
        });
        el.addEventListener('dragend', () => el.classList.remove('dragging'));
        // keyboard accessibility: Space to mark and arrows to place
        el.tabIndex = 0;
        el.addEventListener('keydown', (e) => {
          if (e.code === 'Space') {
            e.preventDefault();
            el.classList.toggle('dragging');
          } else if (e.code === 'ArrowLeft') {
            placeIntoZone(h.id, 'good');
          } else if (e.code === 'ArrowRight') {
            placeIntoZone(h.id, 'bad');
          }
        });
        itemsEl.appendChild(el);
      });
      totalEl.textContent = state.order.length;
      updateDisplays();
    }

    function shuffleOrder() {
      state.order = [...HEADLINES].sort(()=>0.5-Math.random());
      state.placed = {};
    }

    function resetGame() {
      state.score = 0;
      state.lives = 3;
      // clear any headlines already placed in the bins
      document.querySelectorAll('.bin-contents').forEach(el => el.innerHTML = '');
      shuffleOrder();
      renderItems();
    }

    function updateDisplays() {
      scoreEl.textContent = state.score;
      livesEl.textContent = '👽'.repeat(Math.max(0, state.lives));
    }

    function placeIntoZone(id, zone) {
      id = Number(id);
      // allow placement without immediate penalty; evaluate on Submit
      if (state.placed[id]) return;
      const item = HEADLINES.find(h => h.id === id);
      if (!item) return;
      const binEl = (zone === 'good') ? leftZone : rightZone;
      const contents = binEl.querySelector('.bin-contents');
      const node = document.querySelector(`.headline[data-id="${id}"]`);
      if (!node) return;
      // place into selected bin and mark placed zone
      contents.appendChild(node);
      node.style.opacity = '0.6';
      node.style.cursor = 'default';
      state.placed[id] = zone; // store placed zone string for later evaluation
      renderItems();
    }

    // drop targets
    function setupBins() {
      [leftZone, rightZone].forEach(zoneEl => {
        zoneEl.addEventListener('dragover', (e) => { e.preventDefault(); zoneEl.classList.add('highlight'); });
        zoneEl.addEventListener('dragleave', () => { zoneEl.classList.remove('highlight'); });
        zoneEl.addEventListener('drop', (e) => {
          e.preventDefault();
          zoneEl.classList.remove('highlight');
          const id = e.dataTransfer.getData('text/plain');
          const zoneKey = zoneEl.dataset.zone;
          placeIntoZone(id, zoneKey);
        });
        // keyboard: Enter places first focused headline into the bin
        zoneEl.addEventListener('keydown', (e) => {
          if (e.code === 'Enter') {
            const first = document.querySelector('.headline');
            if (first) placeIntoZone(first.dataset.id, zoneEl.dataset.zone);
          }
        });
      });
    }

    // shuffle/reset/submit controls
    shuffleBtn.addEventListener('click', () => { shuffleOrder(); renderItems(); });
    resetBtn.addEventListener('click', resetGame);
    document.getElementById('submit-headlines').addEventListener('click', () => {
      const placedCount = Object.keys(state.placed).length;
      const allPlaced = placedCount === HEADLINES.length;
      if (!allPlaced) {
        alert('Please sort all headlines before submitting!');
        return;
      }

      // Evaluate placements
      let correctCount = 0;
      let incorrectCount = 0;
      HEADLINES.forEach(h => {
        const placedZone = state.placed[h.id];
        if (placedZone === h.correct) correctCount += 1;
        else incorrectCount += 1;
      });

      // update score and deduct lives only now
      state.score = correctCount;
      state.lives -= incorrectCount;
      updateDisplays();

      if (state.lives <= 0) {
        alert(`Game Over! Final score: ${state.score}`);
        resetGame();
        return;
      }

      if (incorrectCount === 0) {
        // perfect
        showCongrats();
      } else {
        alert(`You have ${correctCount} correct and ${incorrectCount} incorrect. Lives remaining: ${state.lives}. You can adjust and resubmit.`);
      }
    });

    // minimal leaderboard fetch (keeps existing backend calls if present)
    async function fetchLeaderboard() {
      if (typeof javaURI === 'undefined') {
        leaderboardBody.innerHTML = '<tr><td colspan="3" style="text-align:center;color:rgba(3,62,97,0.5)">No backend</td></tr>';
        return;
      }
      try {
        const res = await fetch(javaURI + '/api/media/');
        if (!res.ok) throw new Error('LB fetch failed');
        const data = await res.json();
        leaderboardBody.innerHTML = '';
        data.forEach((r, i) => {
          const tr = document.createElement('tr');
          tr.innerHTML = `<td>${r.rank||i+1}</td><td>${r.username||r.user||'Unknown'}</td><td style="text-align:right">${r.score||r.points||0}</td>`;
          leaderboardBody.appendChild(tr);
        });
      } catch (err) {
        leaderboardBody.innerHTML = '<tr><td colspan="3" style="text-align:center;color:rgba(3,62,97,0.5)">Unable to load</td></tr>';
      }
    }

    // init
    setupBins();
    shuffleOrder();
    renderItems();
    updateDisplays();
    if (typeof fetchLeaderboard === 'function') { fetchLeaderboard().catch(()=>{}); }
    document.getElementById('refresh-lb').addEventListener('click', fetchLeaderboard);

    // Autofill headlines intelligently
    document.getElementById('autofill-headlines').addEventListener('click', () => {
      // Get all unplaced headlines
      const unplacedHeadlines = state.order.filter(h => !state.placed[h.id]);
      
      // Sort them into bins
      unplacedHeadlines.forEach(headline => {
        placeIntoZone(headline.id, headline.correct);
      });
    });
  </script>
</div>
