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
.game-container {
    background: linear-gradient(135deg, #2a455fff, #9384d5ff);
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
    background: rgba(255,255,255,0.4);
    border-radius: 10px;
    padding: 20px;
    margin-top: 20px;
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
    color: #2c5282;
}

.leaderboard-table tr:nth-child(even) {
    background: rgba(255,255,255,0.3);
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
---
**Mission Briefing**
- Read each incoming headline on your dashboard.
- Decide if the transmission sounds balanced and factual or biased and manipulative.
- Drag or beam each headline into the correct containment zone on the right:

    - 🟦 Balanced / Accurate — verified signals from trusted sources.

    - 🔴 Biased / Misleading — corrupted broadcasts from alien bots.

Complete your analysis to secure the communication line and see your mission score.

<div style="background-color:background: linear-gradient(135deg, #2a455fff, #9384d5ff);color:white;padding:0;margin:0;font-family:system-ui,sans-serif;min-height:100vh;">

<style>
  :root{--bg:#0f1720;--card:#0b1220;--accent:#4dc3ff;--muted:#9aa6b2}
  html,body{height:100%;margin:0}
  .wrap{max-width:980px;margin:32px auto;padding:20px}
  header{display:flex;align-items:center;justify-content:space-between;margin-bottom:18px}
  h1{font-size:1.25rem;margin:0}
  .controls{display:flex;gap:8px}
  button{background:var(--accent);border:none;padding:8px 12px;border-radius:8px;color:#05232d;font-weight:600;cursor:pointer}

  .game{display:grid;grid-template-columns:1fr 320px;gap:18px}
  .board{background:var(--card);padding:18px;border-radius:12px;min-height:360px}
  .items{display:flex;flex-wrap:wrap;gap:10px}

  .draggable{background:#071426;padding:10px 12px;border-radius:8px;border:1px solid rgba(255,255,255,0.03);cursor:grab;user-select:none}
  .draggable[aria-pressed="true"]{outline:3px solid rgba(77,195,255,0.15)}

  .side{background:transparent}
  .zone{background:#071826;border:2px dashed rgba(255,255,255,0.03);min-height:80px;padding:12px;border-radius:10px;margin-bottom:12px}
  .zone.good{border-color:rgba(77,195,255,0.25)}
  .zone.bad{border-color:rgba(255,110,110,0.15)}
  .zone.empty{opacity:.6}

  .status{color:var(--muted);font-size:.95rem;margin-top:10px}
  .footer{margin-top:14px;color:var(--muted);font-size:.9rem}

  @media (max-width:880px){.game{grid-template-columns:1fr;margin:0}.side{order:2}}
</style>

<div class="wrap">
  <header>
    <h1>Media Bias Game — Base</h1>
    <div class="controls">
      <button id="shuffle">Shuffle</button>
      <button id="reset">Reset</button>
    </div>
  </header>

  <main class="game">
    <section class="board" aria-label="game board">
      <p class="status">Drag headlines into the zone you think they belong to.</p>
      <div class="items" id="items" aria-live="polite"></div>
    </section>
    <aside class="side">
      <div class="zone good" id="leftZone" data-zone="good" tabindex="0" aria-label="Accurate / Balanced reporting">
        <strong>Balanced / Accurate</strong>
        <div class="zone-contents"></div>
      </div>
      <div class="zone bad" id="rightZone" data-zone="bad" tabindex="0" aria-label="Biased / Misleading reporting">
        <strong>Biased / Misleading</strong>
        <div class="zone-contents"></div>
      </div>
      <div class="footer">
        <div>Score: <span id="score">0</span> / <span id="total">0</span></div>
        <div style="margin-top:6px">Hints: <small>Use keyboard: TAB to focus, SPACE to select, arrow keys to move.</small></div>
      </div>
    </aside>
  </main>
</div>
<script>
  const HEADLINES = [
    {id:1, text:'Study finds coffee linked to lower heart disease risk', correct:'good'},
    {id:2, text:'Celebrity says x — experts warn of rising trend', correct:'bad'},
    {id:3, text:'Government releases budget with small tax relief for families', correct:'good'},
    {id:4, text:'Opinion: this frightening trend will destroy your neighborhood', correct:'bad'},
    {id:5, text:'Local school wins national science award', correct:'good'},
    {id:6, text:'Shocking footage suggests new conspiracy about vaccines', correct:'bad'}
  ];
  const itemsEl = document.getElementById('items');
  const leftZone = document.getElementById('leftZone');
  const rightZone = document.getElementById('rightZone');
  const scoreEl = document.getElementById('score');
  const totalEl = document.getElementById('total');
  const shuffleBtn = document.getElementById('shuffle');
  const resetBtn = document.getElementById('reset');
  let state = { order: [], placed: {} };
  function makeDraggable(item){
    const btn = document.createElement('button');
    btn.className = 'draggable';
    btn.type = 'button';
    btn.draggable = true;
    btn.id = 'item-'+item.id;
    btn.textContent = item.text;
    btn.setAttribute('data-id', item.id);
    btn.setAttribute('aria-pressed','false');
    btn.addEventListener('dragstart', e => {
      e.dataTransfer.setData('text/plain', item.id);
      btn.style.opacity = '0.6';
    });
    btn.addEventListener('dragend', () => btn.style.opacity = '');
    btn.addEventListener('keydown', e => {
      if(e.code === 'Space'){
        e.preventDefault();
        const pressed = btn.getAttribute('aria-pressed') === 'true';
        btn.setAttribute('aria-pressed', String(!pressed));
      }
      if(['ArrowLeft','ArrowRight'].includes(e.code)){
        e.preventDefault();
        const zone = e.code === 'ArrowLeft' ? leftZone : rightZone;
        placeIntoZone(item.id, zone.dataset.zone);
      }
    });


