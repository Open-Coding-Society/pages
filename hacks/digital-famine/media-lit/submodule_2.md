---
layout: post
title: "Bias Checker"
description: "Second line of defense against foreign invaders"
permalink: /digital-famine/media-lit/submodule_2/
parent: "Analytics/Admin"
team: "Scratchers"
submodule: 2
categories: [CSP, Submodule, Analytics/Admin]
tags: [analytics, submodule, curators]
author: "Anwita Bandaru and Nick Diaz"
date: 2025-10-21
---

# Bias Checker

### Why is checking for bias Important?
The alien misinformation swarm doesn’t invade with lasers or ships — it attacks minds.
Every distorted headline, every emotional post, every half-true story is a signal designed to scramble human judgment. Once people can’t tell what’s real, they stop trusting reliable information. Biased language can make ordinary events sound urgent or frightening, pushing people to react before they think. When that happens, truth fades and manipulation spreads.
--- 
**By identifying bias, you decode the signal. You learn to notice when words are chosen to provoke rather than inform.**

## Media Bias Training 
Before you recieve your mission to protect Media Literacy Planet, you'll need to undergo training. Test your knowledge of media bias by sorting news outlets into their typical editorial positions. This training will help you understand the different biases present in major news sources to defeat the invaders. 

<style>
body {
  min-height: 100vh;
  /* use the image placed under hacks/digital-famine/media-lit/media/assets/ */
  background: url('/hacks/digital-famine/media-lit/media/assets/spacebackground.jpg') no-repeat center center fixed;
  background-size: cover;
  background-color: #061226; /* fallback */
}
.game-container {
    background: linear-gradient(135deg, #353e74ff, #9384d5ff);
    border-radius: 15px;
    padding: 25px;
    box-shadow: 0 10px 30px rgba(0,0,0,0.1);
    margin: 20px 0;
    font-family: system-ui, -apple-system, sans-serif;
}

.game-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    padding-bottom: 15px;
    border-bottom: 2px solid rgba(255,255,255,0.5);
}

.player-info {
    display: flex;
    gap: 20px;
    align-items: center;
}

.info-pill {
    background: rgba(255,255,255,0.5);
    padding: 8px 15px;
    border-radius: 20px;
    font-weight: 600;
    color: #2c5282;
}

.bins-container {
    display: flex;
    justify-content: space-between;
    gap: 20px;
    margin: 20px 0;
}

.bin {
    flex: 1;
    min-height: 150px;
    background: rgba(255,255,255,0.4);
    border: 2px dashed #4299e1;
    border-radius: 10px;
    padding: 15px;
    transition: all 0.3s ease;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.bin.highlight {
    background: rgba(255,255,255,0.6);
    border-color: #2b6cb0;
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(66,153,225,0.2);
}

.bin-label {
    font-weight: 600;
    color: #2c5282;
    margin-bottom: 10px;
}

.images-area {
    display: flex;
    flex-wrap: wrap;
    gap: 15px;
    padding: 20px;
    background: rgba(255,255,255,0.3);
    border-radius: 10px;
    min-height: 100px;
}

.image {
    width: 80px;
    height: 80px;
    padding: 8px;
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 5px rgba(0,0,0,0.1);
    cursor: grab;
    transition: transform 0.2s ease, opacity 0.2s ease;
}

.image:hover {
    transform: translateY(-2px);
}

.image.dragging {
    opacity: 0.5;
    transform: scale(0.95);
}

.controls {
    display: flex;
    justify-content: flex-end;
    gap: 15px;
    margin-top: 20px;
}

.btn {
    padding: 10px 20px;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
    border: none;
}

.btn-primary {
    background: #4299e1;
    color: white;
}

.btn-ghost {
    background: rgba(255,255,255,0.5);
    color: #2c5282;
}

.btn:hover {
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(66,153,225,0.2);
}

.leaderboard {
  /* darker, more visible card for leaderboard */
  background: linear-gradient(180deg, rgba(95, 73, 174, 0.18), rgba(60, 97, 156, 0.4));
  border-radius: 10px;
  padding: 20px;
  margin-top: 20px;
  color: #eaf6ff; /* light text on darker background */
  border: 1px solid rgba(255,255,255,0.04);
}

.leaderboard-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
}

.leaderboard-table {
    width: 100%;
    border-collapse: collapse;
}

.leaderboard-table th,
.leaderboard-table td {
  padding: 10px;
  text-align: left;
  color: inherit; /* use leaderboard color (light) */
}

.leaderboard-table tr:nth-child(even) {
  background: rgba(255,255,255,0.02);
}
</style>

<div class="game-container">
    <div class="game-header">
        <div class="player-info">
            <div class="info-pill" id="player-name">Player: Guest</div>
            <div class="info-pill" id="lives">Lives: 👽👽👽</div>
            <div class="info-pill" id="score">Score: 0</div>
        </div>
    </div>

    <div class="bins-container">
        <div class="bin" data-bin="Left">
            <div class="bin-label">Left</div>
            <div class="bin-content"></div>
        </div>
        <div class="bin" data-bin="Center">
            <div class="bin-label">Center</div>
            <div class="bin-content"></div>
        </div>
        <div class="bin" data-bin="Right">
            <div class="bin-label">Right</div>
            <div class="bin-content"></div>
        </div>
    </div>

    <div class="images-area" id="images"></div>

    <div class="controls">
        <button class="btn btn-ghost" id="reset-btn">Reset</button>
        <button class="btn btn-primary" id="submit-btn">Submit Score</button>
    </div>

    <div class="leaderboard">
        <div class="leaderboard-header">
            <h3>Top Players</h3>
            <button class="btn btn-ghost" id="refresh-lb">Refresh</button>
        </div>
        <table class="leaderboard-table">
            <thead>
                <tr>
                    <th>Rank</th>
                    <th>Player</th>
                    <th>Score</th>
                </tr>
            </thead>
            <tbody id="leaderboard-body">
                <!-- Leaderboard data will be inserted here -->
            </tbody>
        </table>
    </div>
</div>

<script type="module">
    import { javaURI, fetchOptions } from '{{site.baseurl}}/assets/js/api/config.js';
    
    // Configuration
    const IMAGE_BASE = '{{site.baseurl}}/media/assets/';
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

    let lives = 3;
    let score = 0;
    let currentPlayer = "Guest";
    let placedImages = new Set();

    const scoreDisplay = document.getElementById('score');
    const livesDisplay = document.getElementById('lives');
    const playerDisplay = document.getElementById('player-name');
    const bins = document.querySelectorAll('.bin');
    const imagesArea = document.getElementById('images');

    function updateDisplays() {
        scoreDisplay.textContent = `Score: ${score}`;
        livesDisplay.textContent = `Lives: ${"👽".repeat(Math.max(0, lives))}`;
        playerDisplay.textContent = `Player: ${currentPlayer}`;
    }

    function createImageCard(file, index) {
        const img = document.createElement('img');
        img.src = IMAGE_BASE + file.src;
        img.alt = file.company;
        img.className = 'image';
        img.draggable = true;
        img.dataset.bin = file.bin;
        img.dataset.company = file.company;
        img.dataset.id = `img-${index}`;

        img.addEventListener('dragstart', (e) => {
            if (placedImages.has(e.target.dataset.id)) {
                e.preventDefault();
                return;
            }
            e.target.classList.add('dragging');
            e.dataTransfer.setData('text/plain', e.target.dataset.id);
        });

        img.addEventListener('dragend', (e) => {
            e.target.classList.remove('dragging');
        });

        return img;
    }

    function initGame() {
    imagesArea.innerHTML = '';
    // clear any previously placed images inside the bins for the image game
    document.querySelectorAll('.bin-content').forEach(el => el.innerHTML = '');
    placedImages.clear();
    score = 0;
    lives = 3;
    updateDisplays();

        const getRandomSubset = (arr, count) => {
            return [...arr]
                .sort(() => 0.5 - Math.random())
                .slice(0, count);
        };

        const leftImages = imageFiles.filter(img => img.bin === "Left");
        const centerImages = imageFiles.filter(img => img.bin === "Center");
        const rightImages = imageFiles.filter(img => img.bin === "Right");

        const selectedImages = [
            ...getRandomSubset(leftImages, 7),
            ...getRandomSubset(centerImages, 7),
            ...getRandomSubset(rightImages, 7)
        ].sort(() => 0.5 - Math.random());

        selectedImages.forEach((file, index) => {
            const card = createImageCard(file, index);
            imagesArea.appendChild(card);
        });
    }

    bins.forEach(bin => {
        bin.addEventListener('dragover', e => {
            e.preventDefault();
            bin.classList.add('highlight');
        });

        bin.addEventListener('dragleave', () => {
            bin.classList.remove('highlight');
        });

        bin.addEventListener('drop', e => {
            e.preventDefault();
            bin.classList.remove('highlight');
            
            const id = e.dataTransfer.getData('text/plain');
            const img = document.querySelector(`[data-id="${id}"]`);
            
            if (!img || placedImages.has(id)) return;

            if (img.dataset.bin === bin.dataset.bin) {
                bin.querySelector('.bin-content').appendChild(img);
                score++;
                placedImages.add(id);
                img.style.opacity = '0.6';
                img.style.cursor = 'default';
            } else {
                lives--;
                if (lives <= 0) {
                    alert(`Game Over! Final score: ${score}`);
                    postScore(currentPlayer, score);
                    initGame();
                    return;
                }
                img.animate([
                    {transform: 'translateX(0)'},
                    {transform: 'translateX(-5px)'},
                    {transform: 'translateX(5px)'},
                    {transform: 'translateX(0)'}
                ], {duration: 300});
            }
            
            updateDisplays();
        });
    });

    async function fetchUser() {
        try {
            const response = await fetch(javaURI + '/api/person/get', fetchOptions);
            if (response.ok) {
                const data = await response.json();
                currentPlayer = data.name || data.username || 'Guest';
            }
        } catch (err) {
            console.warn('Failed to fetch user:', err);
        }
        updateDisplays();
    }

    async function postScore(username, finalScore) {
        try {
            const response = await fetch(`${javaURI}/api/media/score/${encodeURIComponent(username)}/${finalScore}`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'}
            });
            if (!response.ok) throw new Error('Failed to save score');
            fetchLeaderboard();
        } catch (err) {
            console.error('Error saving score:', err);
        }
    }

    async function fetchLeaderboard() {
        const tbody = document.getElementById('leaderboard-body');
        try {
            const response = await fetch(javaURI + '/api/media/');
            if (!response.ok) throw new Error('Failed to fetch leaderboard');
            const data = await response.json();
            
            tbody.innerHTML = '';
            data.forEach((entry, index) => {
                const row = tbody.insertRow();
                row.insertCell().textContent = entry.rank || (index + 1);
                row.insertCell().textContent = entry.username || 'Unknown';
                row.insertCell().textContent = entry.score || 0;
            });
        } catch (err) {
            console.error('Error fetching leaderboard:', err);
            tbody.innerHTML = '<tr><td colspan="3">Unable to load leaderboard</td></tr>';
        }
    }

    document.getElementById('reset-btn').addEventListener('click', initGame);
    document.getElementById('submit-btn').addEventListener('click', () => {
        postScore(currentPlayer, score);
        alert(`Score submitted! Final score: ${score}`);
        initGame();
    });
    document.getElementById('refresh-lb').addEventListener('click', fetchLeaderboard);

    // Initialize
    fetchUser();
    initGame();
    fetchLeaderboard();
    setInterval(fetchLeaderboard, 30000); // Refresh every 30 seconds
</script>

### Transmission from Media Literacy Command:
Planet Media Literacy's communication grid has been hacked by alien misinformation drones. They’re spreading biased headlines to confuse humans and weaken your defenses.
**Your mission**: analyze incoming headlines and separate reliable transmissions from corrupted ones before misinformation spreads across the galaxy.

### Mission Briefing
- Read each incoming headline on your dashboard.
- Decide if the transmission sounds balanced and factual or biased and manipulative.
- Drag or beam each headline into the correct containment zone on the right:

    - 🟦 Balanced / Accurate — verified signals from trusted sources.

    - 🔴 Biased / Misleading — corrupted broadcasts from alien bots.

Complete your analysis to secure the communication line and see your mission score.

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
    // HEADLINES data (you can expand)
    const HEADLINES = [
      {id:1, text:'Study finds coffee linked to lower heart disease risk', correct:'good'},
      {id:2, text:'Celebrity says x — experts warn of rising trend', correct:'bad'},
      {id:3, text:'Government releases budget with small tax relief for families', correct:'good'},
      {id:4, text:'Opinion: this frightening trend will destroy your neighborhood', correct:'bad'},
      {id:5, text:'Local school wins national science award', correct:'good'},
      {id:6, text:'Shocking footage suggests new conspiracy about vaccines', correct:'bad'},
      {id:7, text:'Leader of planet, growing old, allows invaders to come into planetary space', correct:'bad'},
    ];

    // DOM
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
        <div style='font-size:1.1rem;color:#033e61;margin-bottom:18px;'>You defended Media Literacy Planet.<br><b>The shield level is now 2.</b></div>
        <div style='font-size:1.05rem;color: #a3cbf5ff;margin-bottom:18px;'>Continue to the <b>Truth Scanner</b>!</div>
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
  </script>
</div>
