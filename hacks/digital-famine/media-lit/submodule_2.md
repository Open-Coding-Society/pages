---
layout: post
title: "Bias Checker"
description: "First line of defense agaisnt foreign invaders
permalink: /digital-famine/media-lit/submodule_2/
parent: "Analytics/Admin"
team: "Curators"
submodule: 2
categories: [CSP, Submodule, Analytics/Admin]
tags: [analytics, submodule, curators]
author: "Curators Team"
date: 2025-10-21
---

# Bias Checker

## Content Coming Soon
This submodule will be developed by the Curators team.

<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
<title>Media Bias Game — Blue Card</title>
<style>
  :root{
    --bg:#0b1220;
    --card:#071229;
    --muted:#9fb4d9;
    --accent: #7ec1e8ff;* bright cyan-blue */
    --accent-2: #1a5c9aff;* deep blue */
    --glass: rgba(255,255,255,0.04);
    --success: #22c55e;
    --danger: #ff5c5c;
    --rounded: 14px;
  }
  html,body{height:100%; margin:0; font-family:Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial;}
  body{
    background: linear-gradient(180deg, rgba(7,18,41,1) 0%, rgba(11,18,32,1) 100%), var(--bg);
    color: #E8F2FF;
    display:flex;
    align-items:center;
    justify-content:center;
    padding:32px;
  }
  /* card container */
  .game-card{
    width: min(1100px, 96%);
    background: linear-gradient(180deg, rgba(8,18,40,0.85), rgba(6,12,23,0.9));
    border-radius: var(--rounded);
    box-shadow: 0 10px 30px rgba(2,6,23,0.8), 0 1px 0 1px rgba(43,118,193,0.06) inset;
    padding: 22px;
    border: 1px solid rgba(43,118,193,0.08);
    overflow: hidden;
  }
  .card-header{
    display:flex;
    align-items:center;
    gap:16px;
    margin-bottom:16px;
  }
  .logo {
    width:56px;height:56px;border-radius:10px;
    background: linear-gradient(135deg,var(--accent),var(--accent-2));
    box-shadow: 0 6px 18px rgba(43,118,193,0.18);
    display:flex;align-items:center;justify-content:center;font-weight:700;color:#041426;font-size:20px;
  }
  h1{font-size:20px;margin:0}
  .subtitle{color:var(--muted); font-size:13px;}
  .top-row{
    display:flex;
    gap:18px;
    align-items:flex-start;
    flex-wrap:wrap;
  }
  .game-area{
    flex:1 1 600px;
    min-width: 300px;
    background: linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01));
    padding:18px;
    border-radius: 12px;
    border: 1px solid rgba(255,255,255,0.02);
  }
  /* right: scoreboard / leaderboard */
  .side-panel{
    width:320px;
    min-width:260px;
    display:flex;
    flex-direction:column;
    gap:12px;
  }
  .info-bar{
    display:flex;
    justify-content:space-between;
    align-items:center;
    gap:12px;
    margin-bottom:12px;
  }
  .pill{
    background: var(--glass);
    padding:8px 12px;
    border-radius:999px;
    font-weight:600;
    color:var(--muted);
    border: 1px solid rgba(255,255,255,0.02);
    display:flex;
    gap:8px;
    align-items:center;
  }
  .score-value { color:var(--accent); font-weight:700; }
  .lives-value { color:var(--danger); font-weight:700; }
  /* bins row */
  .bins{
    display:flex;
    gap:12px;
    justify-content:space-between;
    margin-top:8px;
    margin-bottom:16px;
  }
  .bin{
    flex:1 1 0;
    min-height:120px;
    border-radius:10px;
    background: linear-gradient(180deg, rgba(255,255,255,0.01), rgba(255,255,255,0.00));
    border: 2px dashed rgba(43,118,193,0.08);
    display:flex;
    align-items:flex-start;
    justify-content:center;
    padding:12px;
    box-sizing:border-box;
    transition: all 180ms ease;
    gap:8px;
    flex-direction:column;
    text-align:center;
  }
  .bin-label{
    font-size:13px;
    color:var(--muted);
    margin-bottom:6px;
  }
  .bin.highlight{
    border-color: rgba(43,118,193,0.9);
    box-shadow: 0 6px 18px rgba(43,118,193,0.08);
    transform: translateY(-3px);
    background: linear-gradient(180deg, rgba(43,118,193,0.02), rgba(43,118,193,0.01));
  }
  /* images area */
  .images-area{
    display:flex;
    flex-wrap:wrap;
    gap:10px;
    align-items:flex-start;
    padding:6px;
    border-radius:10px;
    min-height:120px;
  }
  .image-card{
    width:88px;
    height:88px;
    border-radius:10px;
    background: linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.00));
    display:flex;
    align-items:center;
    justify-content:center;
    padding:6px;
    box-sizing:border-box;
    border:1px solid rgba(255,255,255,0.02);
    cursor:grab;
    transition: transform 120ms ease, box-shadow 120ms ease;
  }
  .image-card.dragging { opacity:0.6; transform: scale(0.98); cursor:grabbing; }
  .image-card img{ max-width:100%; max-height:100%; border-radius:6px; display:block; }
  .image-card.placed { opacity:0.5; filter:grayscale(0.2); cursor:default; }
  /* buttons */
  .controls{
    display:flex;
    gap:12px;
    margin-top:12px;
  }
  .btn{
    background: linear-gradient(180deg, var(--accent), var(--accent-2));
    color:#041426;
    padding:10px 14px;
    border-radius:10px;
    border:none;
    cursor:pointer;
    font-weight:700;
    box-shadow: 0 8px 24px rgba(43,118,193,0.10);
  }
  .btn.ghost{
    background:transparent;
    color:var(--muted);
    border:1px solid rgba(255,255,255,0.02);
    box-shadow:none;
  }

  /* leaderboard */
  .leaderboard-card{
    background: linear-gradient(180deg, rgba(255,255,255,0.015), rgba(255,255,255,0.01));
    padding:12px;
    border-radius:10px;
    border: 1px solid rgba(255,255,255,0.02);
  }
  .collapsible {
    width:100%;
  }
  .collapsible-btn{
    width:100%;
    display:flex;
    justify-content:space-between;
    align-items:center;
    gap:8px;
    background:transparent;
    border:none;
    color:var(--muted);
    font-weight:700;
    padding:8px 6px;
    cursor:pointer;
  }
  .leaderboard-table{
    width:100%;
    border-collapse:collapse;
    margin-top:8px;
    font-size:13px;
  }
  .leaderboard-table th, .leaderboard-table td{
    padding:6px;
    text-align:left;
  }
  .leaderboard-table tbody tr:nth-child(odd){ background: rgba(255,255,255,0.01); }

  /* small helpers */
  .muted { color:var(--muted); font-size:13px; }
  .small { font-size:13px; color:var(--muted); }

  /* responsive */
  @media (max-width:880px){
    .top-row{ flex-direction:column-reverse; }
    .side-panel{ width:100%; }
  }

</style>
</head>
<body>
  <div class="game-card" role="application" aria-labelledby="game-title">
    <div class="card-header">
      <div class="logo">MB</div>
      <div>
        <h1 id="game-title">Media Bias Game</h1>
        <div class="subtitle">Drag each logo to the bin that best matches its typical editorial tilt.</div>
      </div>
    </div>

    <div class="top-row">
      <!-- MAIN GAME -->
      <section class="game-area" aria-label="Game Area">
        <div class="info-bar">
          <div class="pill">Player: <strong style="margin-left:8px" id="current-username">Guest</strong></div>
          <div style="display:flex; gap:10px;">
            <div class="pill">Lives: <span id="lives" class="lives-value" style="margin-left:6px">😺😺😺</span></div>
            <div class="pill">Score: <span id="score" class="score-value" style="margin-left:6px">0</span></div>
          </div>
        </div>

        <div>
          <div class="small">Bins</div>
          <div class="bins" id="bins">
            <div class="bin" data-bin="Left" id="bin-left" aria-label="Left bin">
              <div class="bin-label">Left</div>
              <div class="bin-content" aria-hidden="false"></div>
            </div>
            <div class="bin" data-bin="Center" id="bin-center" aria-label="Center bin">
              <div class="bin-label">Center</div>
              <div class="bin-content"></div>
            </div>
            <div class="bin" data-bin="Right" id="bin-right" aria-label="Right bin">
              <div class="bin-label">Right</div>
              <div class="bin-content"></div>
            </div>
          </div>
        </div>

        <div style="margin-top:10px;">
          <div class="small" style="margin-bottom:6px;">Logos</div>
          <div class="images-area" id="images" aria-live="polite" aria-label="Draggable images">
            <!-- images injected here -->
          </div>
        </div>

        <div class="controls" style="justify-content:flex-end;">
          <button class="btn ghost" id="reset-btn">Reset</button>
          <button class="btn" id="submit-btn">Submit Score</button>
        </div>
      </section>

      <!-- SIDE PANEL -->
      <aside class="side-panel" aria-label="Side Panel">
        <div class="leaderboard-card">
          <div style="display:flex;justify-content:space-between;align-items:center;">
            <div>
              <div class="small">Leaderboard</div>
              <div style="font-weight:800; font-size:16px;">Top Players</div>
            </div>
            <button class="collapsible-btn" id="toggle-leaderboard" aria-expanded="true">Hide ▲</button>
          </div>

          <div id="leaderboard-wrapper" style="margin-top:8px;">
            <table class="leaderboard-table" id="leaderboard-table" aria-label="Leaderboard table">
              <thead>
                <tr>
                  <th style="width:10%;">#</th>
                  <th>Username</th>
                  <th style="text-align:right;">Score</th>
                </tr>
              </thead>
              <tbody id="leaderboard-body">
                <!-- fetched rows go here -->
              </tbody>
            </table>
          </div>
        </div>

        <div class="leaderboard-card">
          <div class="small">How to play</div>
          <div class="muted" style="margin-top:6px;">
            Drag a logo into Left / Center / Right. You have 3 lives — incorrect placement costs a life. Correct placement earns 1 point and locks the logo in place.
          </div>
        </div>

      </aside>
    </div>
  </div>

  <!-- SCRIPT: main logic (module so we can import javaURI + fetchOptions) -->
  <script type="module">
    import { javaURI, fetchOptions } from '{{site.baseurl}}/assets/js/api/config.js';

    // ---------- Configuration ----------
    const IMAGE_BASE = '{{site.baseurl}}/media/assets/'; // update if needed
    const imageFiles = [
        { src: "atlanticL.png", company: "Atlantic", bin: "Left" },
        { src: "buzzfeedL.png", company: "Buzzfeed", bin: "Left" },
        { src: "cnnL.png", company: "CNN", bin: "Left" },
        { src: "epochR.png", company: "Epoch Times", bin: "Right" },
        { src: "forbesC.png", company: "Forbes", bin: "Center" },
        { src: "hillC.png", company: "The Hill", bin: "Center" },
        { src: "nbcL.png", company: "NBC", bin: "Left" },
        { src: "newsweekC.png", company: "Newsweek", bin: "Center" },
        { src: "nytL.png", company: "NY Times", bin: "Left" },
        { src: "voxL.png", company: "Vox", bin: "Left" },
        { src: "wtR.png", company: "Washington Times", bin: "Right" },
        { src: "bbcC.png", company: "BBC", bin: "Center" },
        { src: "callerR.png", company: "The Daily Caller", bin: "Right" },
        { src: "dailywireR.png", company: "Daily Wire", bin: "Right" },
        { src: "federalistR.png", company: "Federalist", bin: "Right" },
        { src: "foxR.png", company: "Fox News", bin: "Right" },
        { src: "marketwatchC.png", company: "MarketWatch", bin: "Center" },
        { src: "newsmaxR.png", company: "Newsmax", bin: "Right" },
        { src: "nprL.png", company: "NPR", bin: "Left" },
        { src: "reutersC.png", company: "Reuters", bin: "Center" },
        { src: "wsjC.png", company: "Wall Street Journal", bin: "Center" },
        { src: "abcL.png", company: "ABC", bin: "Left"},
        { src: "timeL.png", company: "Time", bin: "Left"},
        { src: "yahooL.png", company: "Yahoo News", bin: "Left"},
        { src: "newsnationC.png", company: "News Nation", bin: "Center"},
        { src: "reasonC.png", company: "Reason News", bin: "Center"},
        { src: "sanC.png", company: "SAN News", bin: "Center"},
        { src: "nypR.png", company: "New York Post", bin: "Right"},
        { src: "upwardR.png", company: "Upward News", bin: "Right"},
        { src: "cbnR.png", company: "CBN", bin: "Right"}
    ];

    // ---------- State ----------
    let lives = 3;
    let score = 0;
    let currentPlayer = "Guest";
    const placedSet = new Set(); // track placed image ids so they cannot be dragged again

    // ---------- DOM ----------
    const imagesArea = document.getElementById('images');
    const scoreEl = document.getElementById('score');
    const livesEl = document.getElementById('lives');
    const currentUsernameEl = document.getElementById('current-username');
    const bins = {
      Left: document.getElementById('bin-left'),
      Center: document.getElementById('bin-center'),
      Right: document.getElementById('bin-right')
    };
    const leaderboardBody = document.getElementById('leaderboard-body');
    const toggleLbBtn = document.getElementById('toggle-leaderboard');

    // ---------- Helpers ----------
    function updateScoreDisplay(){
      scoreEl.textContent = score;
    }
    function updateLivesDisplay(){
      livesEl.textContent = "😺".repeat(Math.max(0, lives));
    }
    function endGame(){
      // send score, alert and reload (like original behavior)
      postScore(currentPlayer, score).finally(() => {
        setTimeout(()=> {
          alert(`Game over! ${currentPlayer}, your final score: ${score}`);
          location.reload();
        }, 80);
      });
    }

    function lockImage(imageCard){
      imageCard.classList.add('placed');
      imageCard.setAttribute('draggable','false');
      placedSet.add(imageCard.dataset.id);
    }

    // ---------- Drag & Drop ----------
    function makeImageCard(file, idx){
      const container = document.createElement('div');
      container.className = 'image-card';
      container.draggable = true;
      container.dataset.bin = file.bin;
      container.dataset.company = file.company;
      container.dataset.id = `img-${idx}`;

      const img = document.createElement('img');
      img.src = IMAGE_BASE + file.src;
      img.alt = file.company;
      img.loading = 'lazy';

      container.appendChild(img);

      // events
      container.addEventListener('dragstart', (e) => {
        if (placedSet.has(container.dataset.id)) {
          e.preventDefault(); // prevent dragging locked images
          return;
        }
        container.classList.add('dragging');
        e.dataTransfer.setData('text/plain', container.dataset.id);
        // set ghost image if desired:
        if (e.dataTransfer.setDragImage) {
          // use the element itself as drag image (offset center)
          e.dataTransfer.setDragImage(container, container.clientWidth/2, container.clientHeight/2);
        }
      });
      container.addEventListener('dragend', () => {
        container.classList.remove('dragging');
      });

      return container;
    }

    function initImages(){
      imagesArea.innerHTML = '';
      placedSet.clear();
      const leftImages = imageFiles.filter(i=>i.bin==="Left");
      const centerImages = imageFiles.filter(i=>i.bin==="Center");
      const rightImages = imageFiles.filter(i=>i.bin==="Right");

      // function to pick up to 7 random items from an array
      function pickN(arr, n){
        const copy = [...arr].sort(()=>0.5 - Math.random());
        return copy.slice(0, Math.min(n, copy.length));
      }

      const chosen = [
        ...pickN(leftImages,7),
        ...pickN(centerImages,7),
        ...pickN(rightImages,7)
      ].sort(()=>0.5 - Math.random());

      chosen.forEach((file, idx) => {
        const card = makeImageCard(file, idx);
        imagesArea.appendChild(card);
      });
    }

    // bins as drop targets — use pointer events for highlight
    function setupBins(){
      Object.values(bins).forEach(binEl => {
        binEl.addEventListener('dragover', (e) => {
          e.preventDefault();
        });
        binEl.addEventListener('dragenter', (e) => {
          e.preventDefault();
          binEl.classList.add('highlight');
        });
        binEl.addEventListener('dragleave', () => {
          binEl.classList.remove('highlight');
        });
        binEl.addEventListener('drop', (e) => {
          e.preventDefault();
          binEl.classList.remove('highlight');
          const id = e.dataTransfer.getData('text/plain');
          if(!id) return;
          const dragged = document.querySelector(`[data-id="${id}"]`);
          // if we couldn't find by data-id, fallback to getElementById
          const fallback = document.getElementById(id);
          const imageCard = dragged || fallback;
          if(!imageCard) return;

          // if already placed, ignore
          if(placedSet.has(id)) return;

          const expectedBin = imageCard.dataset.bin;
          const targetBin = binEl.dataset.bin;

          if(expectedBin === targetBin){
            // correct
            binEl.querySelector('.bin-content').appendChild(imageCard);
            score++;
            updateScoreDisplay();
            lockImage(imageCard);
          } else {
            // incorrect
            lives--;
            updateLivesDisplay();
            // small shake animation
            imageCard.animate([
              { transform: 'translateX(0)' },
              { transform: 'translateX(-6px)' },
              { transform: 'translateX(6px)' },
              { transform: 'translateX(0)' }
            ], { duration: 300 });
            if(lives <= 0){
              endGame();
            }
          }
        });
      });
    }

    // allow clicking a placed image to show company name (tiny UX)
    imagesArea.addEventListener('click', (e) => {
      const card = e.target.closest('.image-card');
      if(card) {
        const name = card.dataset.company || 'Logo';
        // small unobtrusive tooltip (native)
        alert(name);
      }
    });

    // ---------- Leaderboard ----------
    async function fetchLeaderboard(){
      leaderboardBody.innerHTML = `<tr><td colspan="3" class="small">Loading...</td></tr>`;
      try{
        const res = await fetch(javaURI + '/api/media/');
        if(!res.ok) throw new Error('Leaderboard fetch failed');
        const data = await res.json();
        // assume data is array of entries with rank, username, score
        leaderboardBody.innerHTML = '';
        data.forEach((entry, idx) => {
          const tr = document.createElement('tr');
          const rankTd = document.createElement('td');
          rankTd.textContent = entry.rank ?? (idx + 1);
          const userTd = document.createElement('td');
          userTd.textContent = entry.username ?? entry.user ?? 'Unknown';
          const scoreTd = document.createElement('td');
          scoreTd.textContent = entry.score ?? entry.points ?? 0;
          scoreTd.style.textAlign = 'right';
          tr.appendChild(rankTd); tr.appendChild(userTd); tr.appendChild(scoreTd);
          leaderboardBody.appendChild(tr);
        });

        if(data.length === 0){
          leaderboardBody.innerHTML = `<tr><td colspan="3" class="small">No scores yet.</td></tr>`;
        }
      } catch(err){
        console.error(err);
        leaderboardBody.innerHTML = `<tr><td colspan="3" class="small">Unable to load leaderboard.</td></tr>`;
      }
    }

    // ---------- Player fetch and score posting ----------
    async function fetchUser(){
      try {
        const response = await fetch(javaURI + `/api/person/get`, fetchOptions);
        if (response.ok) {
          const userInfo = await response.json();
          const person = userInfo.name || userInfo.username || 'Guest';
          currentPlayer = person;
          currentUsernameEl.textContent = person;
        } else {
          // if unauthorized or something — show Guest
          currentPlayer = "Guest";
          currentUsernameEl.textContent = "Guest";
        }
      } catch (err) {
        console.warn('User fetch failed', err);
        currentPlayer = "Guest";
        currentUsernameEl.textContent = "Guest";
      }
    }

    async function postScore(username, finalScore){
      // graceful: if username contains spaces, encodeURI
      const encoded = encodeURIComponent(username);
      try {
        const res = await fetch(`${javaURI}/api/media/score/${encoded}/${finalScore}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          }
        });
        if (!res.ok) {
          console.error('Failed to save score', res.status);
        } else {
          console.log('Score saved');
        }
      } catch (err) {
        console.error('Error saving score:', err);
      }
    }

    // ---------- Controls ----------
    document.getElementById('reset-btn').addEventListener('click', () => {
      lives = 3;
      score = 0;
      updateLivesDisplay();
      updateScoreDisplay();
      initImages();
    });

    document.getElementById('submit-btn').addEventListener('click', async () => {
      await postScore(currentPlayer, score);
      alert(`${currentPlayer}, your final score: ${score}`);
      // refresh leaderboard after submit
      fetchLeaderboard();
    });

    toggleLbBtn.addEventListener('click', () => {
      const wrapper = document.getElementById('leaderboard-wrapper');
      const expanded = toggleLbBtn.getAttribute('aria-expanded') === 'true';
      if(expanded){
        wrapper.style.display = 'none';
        toggleLbBtn.setAttribute('aria-expanded', 'false');
        toggleLbBtn.innerText = 'Show ▼';
      } else {
        wrapper.style.display = '';
        toggleLbBtn.setAttribute('aria-expanded', 'true');
        toggleLbBtn.innerText = 'Hide ▲';
      }
    });

    // ---------- Init ----------
    function init(){
      updateLivesDisplay();
      updateScoreDisplay();
      initImages();
      setupBins();
      fetchUser();
      fetchLeaderboard();
    }

    init();

    // refresh leaderboard every 40 seconds (optional)
    setInterval(fetchLeaderboard, 40000);

  </script>
</body>
</html>