---
layout: post
title: "Awareness"
description: "First line of defense from foreign invaders"
permalink: /digital-famine/media-lit/submodule_1/
footer:
  home: /digital-famine/media-lit
  next: /digital-famine/media-lit/submodule_2
parent: "Analytics/Admin"
team: "Scratchers"
submodule: 1
categories: [CSP, Submodule, Analytics/Admin]
tags: [analytics, submodule, curators]
breadcrumb: true
microblog: true
author: "Aashika Patel, Varada Vichare"
date: 2025-10-21
---

# Welcome to Media Literacy Planet 🌍🛰️

<div class="intro-text">
 <strong>Mission Log:</strong><br><br>
 You've entered the <strong>orbit of Media Literacy Planet</strong> — a critical stop in your journey to restore humanity’s understanding of truth. Across galaxies, misinformation has clouded the minds of humans, blurring the lines between fact and fiction. Your mission is to recover media literacy and bring knowledge back to Earth. <br><br>

 <strong>Types of misinformation you may encounter:</strong><br>
 - <strong>Fake news:</strong> Completely false stories designed to look like legitimate journalism.<br>
 - <strong>Clickbait:</strong> Sensational headlines crafted to get you to click, often exaggerating or distorting facts.<br>
 - <strong>Propaganda:</strong> Information selectively presented to promote a political or ideological agenda.<br>
 - <strong>Deepfakes & manipulated media:</strong> Images, videos, or audio altered to mislead viewers.<br>
 - <strong>Rumors & conspiracy theories:</strong> Unverified claims that spread rapidly, especially on social media.<br>
 - <strong>Biased reporting:</strong> Facts presented with slanted language or selective omissions to influence perception.<br><br>

 <strong>Mission Objective:</strong><br>
 Alien invaders are attacking with confusing news artifacts! Sort each artifact by its purpose: <strong>Persuade</strong>, <strong>Inform</strong>, or <strong>Sell</strong>. Each correct classification strengthens your shield. Reach a score of <strong>8</strong> to complete the mission and proceed to the next mission: <strong>Media Bias</strong>.
</div>


<style>
body {
  min-height: 100vh;
  background: url('{{ site.baseurl }}/images/digital-famine/space.jpg') no-repeat center center fixed;
  background-size: cover;
  font-family: system-ui, -apple-system, sans-serif;
  color: #ffffff;
  overflow-x: hidden;
}




.intro-text {
background: rgba(0,0,30,0.85);
padding: 20px;
border-radius: 12px;
font-family: 'Courier New', monospace;
font-size: 1.05rem;
margin-bottom: 20px;
line-height: 1.5;
}




.game-screen {
position: relative;
width: 900px;
max-width: 95%;
margin: 20px auto;
background: rgba(0,0,30,0.75);
border-radius: 20px;
padding: 30px;
box-shadow: 0 10px 30px rgba(0,0,0,0.7);
}




.game-header {
display: flex;
justify-content: space-between;
align-items: center;
margin-bottom: 25px;
}




.info-pill {
background: rgba(255,255,255,0.2);
padding: 10px 18px;
border-radius: 20px;
font-weight: 700;
font-size: 1rem;
}




.bins-container {
display: flex;
justify-content: space-around;
margin: 25px 0;
gap: 20px;
}




.bin {
flex: 1;
min-height: 160px;
background: rgba(25, 238, 231, 0.4);
border: 2px dashed #00ccff;
border-radius: 14px;
padding: 12px;
display: flex;
flex-direction: column;
align-items: center;
transition: all 0.3s ease;
}




.bin.highlight {
background: rgba(11, 193, 238, 0.25);
border-color: rgba(68, 68, 210, 0.75);
transform: translateY(-2px);
}




.bin-label {
font-weight: 800;
font-size: 1.1rem;
margin-bottom: 12px;
text-shadow: 0 0 4px #00000099;
}




.artifacts-area {
display: flex;
flex-wrap: wrap;
gap: 18px;
background: rgba(0,0,40,0.6);
padding: 25px;
border-radius: 14px;
min-height: 140px;
justify-content: center;
}




.artifact {
width: 140px;
height: 90px;
padding: 10px;
background: #111133;
border-radius: 10px;
box-shadow: 0 2px 10px rgba(0,0,0,0.5);
cursor: grab;
display: flex;
align-items: center;
justify-content: center;
text-align: center;
font-size: 0.85rem;
font-weight: 600;
color: #ffffff;
}




.artifact.dragging {
opacity: 0.7;
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
font-weight: 700;
cursor: pointer;
border: none;
transition: all 0.2s ease;
}




.btn-primary {
  /* darker teal so white text is readable */
  background: linear-gradient(180deg, #007a9e 0%, #005f7a 100%);
  color: #ffffff;
  box-shadow: 0 6px 18px rgba(0,95,122,0.22);
  border: none;
}

.btn-primary:hover,
.btn-primary:focus {
  filter: brightness(1.06);
  transform: translateY(-1px);
}




.btn-ghost {
background: rgba(255,255,255,0.2);
color: white;
}




.btn:hover {
transform: translateY(-1px);
box-shadow: 0 2px 10px rgba(0,0,0,0.5);
}




.shield {
position: fixed;
top: 50%;
left: 50%;
transform: translate(-50%, -50%) scale(0);
width: 300px;
height: 300px;
border-radius: 50%;
border: 6px solid #00ccff;
box-shadow: 0 0 120px #00ccff66, 0 0 250px #00ccff33;
transition: transform 0.3s ease, box-shadow 0.3s ease;
pointer-events: none;
z-index: 999;
display: flex;
align-items: center;
justify-content: center;
}




.shield svg {
width: 100%;
height: 100%;
opacity: 0.85; /* slightly transparent so headlines remain visible */
}




.leaderboard {
margin-top: 30px;
background: rgba(0,0,40,0.5);
padding: 15px;
border-radius: 12px;
}




.leaderboard-table {
width: 100%;
border-collapse: collapse;
color: #ffffff;
}




.leaderboard-table th,
.leaderboard-table td {
padding: 10px;
text-align: left;
}




.leaderboard-table tr:nth-child(even) {
background: rgba(255,255,255,0.05);
}




/* On-screen center notification */
.notification {
position: fixed;
top: 50%;
left: 50%;
transform: translate(-50%, -50%);
background: rgba(2, 24, 40, 0.95); /* deep, dark background */
color: #ffffff;
padding: 22px 30px;
border-radius: 12px;
font-weight: 700;
font-size: 1.3rem;
z-index: 1000;
box-shadow: 0 10px 40px rgba(0,0,0,0.6);
display: none;
text-align: center;
}


/* make the Media Bias link lighter so it stands out on the darker notification */
.notification a {
  color: #ffd36b; /* warm gold for contrast */
  font-weight: 800;
  text-decoration: underline;
}

/* add lives display + alien popup styling */
.lives {
  display: inline-flex;
  gap: 6px;
  align-items: center;
  font-size: 1.1rem;
  margin-left: 12px;
}

/* popup alien overlay for wrong / try again */
.alien-popup {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(0,0,0,0.6); /* semi-transparent backdrop so PNG (transparent) shows */
  color: #fff;
  padding: 18px 22px;
  border-radius: 10px;
  z-index: 2000;
  display: none;
  align-items: center;
  gap: 12px;
  flex-direction: column;
  text-align: center;
}
.alien-popup img {
  width: 130px;
  height: auto;
  background: transparent; /* ensure no white bg behind image */
  display: block;
}
.alien-popup.show { display: flex; }
.alien-popup .btn { margin-top: 8px; }

/* updated key popup: transparent background, placed to the right of the centered notification;
   responsive: moves below notification on small screens to avoid overlap */
.key-popup {
  position: fixed;
  top: 50%;
  left: calc(50% + 220px); /* place to the right of the centered notification */
  transform: translateY(-50%);
  background: transparent; /* ensure no box behind the key image */
  color: #fff;
  padding: 6px;
  border-radius: 10px;
  z-index: 1101; /* above the notification (notification z-index is 1000) */
  display: none;
  align-items: center;
  gap: 10px;
  flex-direction: column;
  text-align: center;
  pointer-events: auto;
}

/* subtle pop animation when key appears */
.key-popup.show {
  display: flex;
  animation: key-pop 380ms cubic-bezier(.2,.9,.2,1);
}
@keyframes key-pop {
  0%   { transform: translateY(-50%) scale(0.8); opacity: 0; }
  60%  { transform: translateY(-50%) scale(1.06); opacity: 1; }
  100% { transform: translateY(-50%) scale(1); opacity: 1; }
}

/* image styling: PNG already has transparency; drop-shadow to separate from background */
.key-popup .key-img {
  width: 88px;
  height: auto;
  background: transparent;
  display: block;
  filter: drop-shadow(0 10px 20px rgba(0,0,0,0.55));
}

/* message style */
.key-popup #key-msg {
  font-weight: 800;
  color: #fff;
  margin-top: 6px;
}

/* responsive: on narrow screens move the key below the notification (avoid overlap) */
@media (max-width: 980px) {
  .key-popup {
    left: 50%;
    top: calc(50% + 120px); /* below the notification */
    transform: translate(-50%, 0);
  }
}
</style>


<div class="game-screen">
  <div class="game-header">
    <div class="info-pill" id="player-name">Player: Guest</div>
    <div style="display:flex; align-items:center; gap:12px;">
      <div class="info-pill" id="score">Score: 0</div>
      <!-- lives shown next to score as alien emojis -->
      <div id="lives" class="lives" aria-live="polite">👾👾👾</div>
    </div>
  </div>




<div class="bins-container">
  <div class="bin" data-bin="Persuade">
    <div class="bin-label">Persuade</div>
    <div class="bin-content"></div>
  </div>
  <div class="bin" data-bin="Inform">
    <div class="bin-label">Inform</div>
    <div class="bin-content"></div>
  </div>
  <div class="bin" data-bin="Sell">
    <div class="bin-label">Sell</div>
    <div class="bin-content"></div>
  </div>
</div>




<div class="artifacts-area" id="artifacts"></div>




<div class="controls">
  <button class="btn btn-ghost" id="reset-btn">Reset</button>
  <button class="btn btn-ghost" id="autofill-btn">Autofill</button>
  <!-- use Jekyll baseurl so the link works regardless of domain -->
  <a class="btn btn-primary" id="next-mission"
     href="{{ site.baseurl }}/digital-famine/media-lit/submodule_2/"
     aria-label="Go to Media Bias (Submodule 2)" style="display:none">Next Mission</a>
</div>




<div class="shield" id="shield" aria-hidden="true">
  <!-- inline SVG shield: transparent background and outline-only -->
  <svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Shield">
    <title>Shield</title>
    <path d="M32 2 L52 10 V26 C52 40 40 52 32 60 C24 52 12 40 12 26 V10 Z"
          fill="none" stroke="#00ccff" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/>
    <!-- subtle inner glow / outline -->
    <path d="M32 8 L44 14 V26 C44 36 36 44 32 48 C28 44 20 36 20 26 V14 Z"
          fill="none" stroke="#00ccff" stroke-opacity="0.6" stroke-width="1.2" />
  </svg>
</div>




<div class="leaderboard">
  <h3>Top Players</h3>
  <table class="leaderboard-table">
    <thead>
      <tr><th>Rank</th><th>Player</th><th>Score</th></tr>
    </thead>
    <tbody id="leaderboard-body"></tbody>
  </table>
</div>


  <!-- Alien popup (image background removed via CSS). Replace src if you want a different image. -->
  <div class="alien-popup" id="alien-popup" role="dialog" aria-modal="true" aria-hidden="true">
    <img id="alien-img" src="{{ site.baseurl }}/images/digital-famine/alien.png" alt="alien">
    <div id="alien-msg">Wrong! The alien appears.</div>
    <button class="btn btn-primary" id="alien-close">Continue</button>
  </div>

  <div class="notification" id="notification">
    Congratulations. Shield Level 1 has been achieved. The number to access the vault is 2. Proceed to the next mission:
    <a id="media-bias-link" href="{{ site.baseurl }}/digital-famine/media-lit/submodule_2/" aria-label="Go to Media Bias (Submodule 2)">Media Bias</a>
  </div>
</div>


<script>
const ARTIFACTS = [
{ text: "VOTE FOR A GREENER FUTURE!", purpose: "Persuade" },
{ text: "GLOBAL WARMING RISES 1.5°C BY 2030", purpose: "Inform" },
{ text: "BUY THE NEW GALAXY SMARTPHONE TODAY!", purpose: "Sell" },
{ text: "JOIN SOCIAL MOVEMENT FOR EDUCATION REFORM", purpose: "Persuade" },
{ text: "LOCAL ELECTION RESULTS ANNOUNCED", purpose: "Inform" },
{ text: "LIMITED EDITION SNEAKERS AVAILABLE ONLINE", purpose: "Sell" },
{ text: "SUPPORT ANIMAL WELFARE CAMPAIGNS", purpose: "Persuade" },
{ text: "NASA DISCOVERS NEW EXOPLANET", purpose: "Inform" }
];




/* larger pool of headlines (add more items as you like) */
const HEADLINES_POOL = [
  { text: "VOTE FOR A GREENER FUTURE!", purpose: "Persuade" },
  { text: "GLOBAL WARMING RISES 1.5°C BY 2030", purpose: "Inform" },
  { text: "BUY THE NEW GALAXY SMARTPHONE TODAY!", purpose: "Sell" },
  { text: "JOIN SOCIAL MOVEMENT FOR EDUCATION REFORM", purpose: "Persuade" },
  { text: "LOCAL ELECTION RESULTS ANNOUNCED", purpose: "Inform" },
  { text: "LIMITED EDITION SNEAKERS AVAILABLE ONLINE", purpose: "Sell" },
  { text: "SUPPORT ANIMAL WELFARE CAMPAIGNS", purpose: "Persuade" },
  { text: "NASA DISCOVERS NEW EXOPLANET", purpose: "Inform" },
  { text: "TRY THIS DIET FOR INSTANT ENERGY!", purpose: "Sell" },
  { text: "CITY COUNCIL APPROVES NEW PARK PLAN", purpose: "Inform" },
  { text: "SIGN PETITION TO SAVE THE BEES", purpose: "Persuade" },
  { text: "FLASH SALE: 50% OFF SMARTWATCHES", purpose: "Sell" },
  { text: "LOCAL SCHOOL LAUNCHES ROBOTICS PROGRAM", purpose: "Inform" },
  { text: "JOIN NOW: FREE ONLINE COURSES", purpose: "Persuade" },
  { text: "NEW STUDY: SLEEP BOOSTS MEMORY", purpose: "Inform" },
  { text: "LIMITED OFFER - SUBSCRIBE FOR PREMIUM", purpose: "Sell" }
];

/* returns `count` random headlines from the pool (no repeats) */
function pickRandomHeadlines(count = 8) {
  const shuffled = shuffleArray(HEADLINES_POOL);
  return shuffled.slice(0, Math.min(count, shuffled.length));
}

let score = 0;
let currentPlayer = "Guest";
let placedArtifacts = new Set();
let shieldGrowing = false;

/* game-over / lives state */
let lives = 3;
let gameOver = false;

const scoreDisplay = document.getElementById("score");
const playerDisplay = document.getElementById("player-name");
const artifactsArea = document.getElementById("artifacts");
const bins = document.querySelectorAll(".bin");
const shieldEl = document.getElementById("shield");
const notification = document.getElementById("notification");
const livesDisplay = document.getElementById("lives");
const alienPopup = document.getElementById("alien-popup");
const alienMsg = document.getElementById("alien-msg");
const alienClose = document.getElementById("alien-close");
const mediaBiasLink = document.getElementById("media-bias-link");

/* make the media bias link darker so it stands out */
if (mediaBiasLink) mediaBiasLink.style.color = "#04263a";

function updateDisplays() {
  scoreDisplay.textContent = `Score: ${score}`;
  playerDisplay.textContent = `Player: ${currentPlayer}`;
  // show lives as alien emojis
  livesDisplay.textContent = '👾'.repeat(lives);
}

/* show an alien popup; if final (game over) button becomes Restart */
function showAlienPopup(message) {
  alienMsg.textContent = message;
  alienPopup.classList.add("show");
  alienPopup.setAttribute("aria-hidden", "false");

  if (lives <= 0) {
    alienClose.textContent = "Try Again";
    alienClose.onclick = () => { initGame(); alienPopup.classList.remove("show"); alienPopup.setAttribute("aria-hidden","true"); };
  } else {
    alienClose.textContent = "Continue";
    alienClose.onclick = () => { alienPopup.classList.remove("show"); alienPopup.setAttribute("aria-hidden","true"); };
    // auto-hide briefly for wrong answers
    setTimeout(() => {
      alienPopup.classList.remove("show");
      alienPopup.setAttribute("aria-hidden","true");
    }, 1400);
  }
}




function createArtifactCard(artifact, index) {
const div = document.createElement("div");
div.className = "artifact";
div.textContent = artifact.text;
div.draggable = true;
div.dataset.purpose = artifact.purpose;
div.dataset.id = `artifact-${index}`;




div.addEventListener("dragstart", (e) => {
  if (placedArtifacts.has(div.dataset.id)) { e.preventDefault(); return; }
  div.classList.add("dragging");
  e.dataTransfer.setData("text/plain", div.dataset.id);
});




div.addEventListener("dragend", () => div.classList.remove("dragging"));




return div;
}




/* add a reliable shuffle (Fisher–Yates) and use it when starting the game */
function shuffleArray(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/* initGame: pick a random subset of headlines each run and populate the UI */
function initGame() {
  artifactsArea.innerHTML = '';
  document.querySelectorAll(".bin-content").forEach(b => b.innerHTML = '');
  placedArtifacts.clear();
  score = 0;
  lives = 3;
  gameOver = false;
  shieldGrowing = false;
  shieldEl.style.transform = 'translate(-50%, -50%) scale(0)';
  shieldEl.style.display = 'none';
  notification.style.display = 'none';
  alienPopup.classList.remove("show");
  alienPopup.setAttribute("aria-hidden","true");
  // ensure Next Mission is hidden at start/reset
  const nextMission = document.getElementById("next-mission");
  if (nextMission) nextMission.style.display = 'none';
  updateDisplays();

  // choose how many headlines per run (e.g., 8). Change value to adjust length.
  const selected = pickRandomHeadlines(8);
  selected.forEach((artifact, i) => {
    artifactsArea.appendChild(createArtifactCard(artifact, i));
  });
}




bins.forEach(bin => {
bin.addEventListener("dragover", e => { e.preventDefault(); bin.classList.add("highlight"); });
bin.addEventListener("dragleave", () => bin.classList.remove("highlight"));
bin.addEventListener("drop", e => {
  e.preventDefault();
  if (gameOver) return; // ignore drops when game over
  bin.classList.remove("highlight");
  const id = e.dataTransfer.getData("text/plain");
  const artifact = document.querySelector(`[data-id="${id}"]`);
  if (!artifact || placedArtifacts.has(id)) return;




  if (artifact.dataset.purpose === bin.dataset.bin) {
    bin.querySelector(".bin-content").appendChild(artifact);
    placedArtifacts.add(id);
    score++;
    showShieldEffect();
    if (score >= 8 && !shieldGrowing) { showShieldComplete(); }
  } else {
    // wrong answer: show shake, decrement life, show alien
    artifact.animate(
      [{ transform: "translateX(0)" }, { transform: "translateX(-6px)" }, { transform: "translateX(6px)" }, { transform: "translateX(0)" }],
      { duration: 300 }
    );
    lives = Math.max(0, lives - 1);
    updateDisplays();
    if (lives <= 0) {
      gameOver = true;
      showAlienPopup("All lives lost. Try again!");
    } else {
      showAlienPopup("Wrong! An alien appears!");
    }
  }
  updateDisplays();
});
});




function showShieldEffect() {
  // Make sure the shield is visible when it grows
  shieldEl.style.display = 'flex';

  // Read current scale (fallback to 0)
  const m = shieldEl.style.transform.match(/scale\(([\d.]+)\)/);
  let currentScale = m ? parseFloat(m[1]) : 0;

  // Increase scale on each correct sort (cap to avoid runaway size)
  currentScale = Math.min(currentScale + 0.15, 14.5);
  shieldEl.style.transform = `translate(-50%, -50%) scale(${currentScale})`;

  // Brief pulse effect on correct
  const prevBox = shieldEl.style.boxShadow;
  shieldEl.style.boxShadow = '0 0 160px #00ccff88, 0 0 300px #00ccff44';
  setTimeout(() => { shieldEl.style.boxShadow = prevBox || '0 0 120px #00ccff66, 0 0 250px #00ccff33'; }, 300);
}




function showShieldComplete() {
  shieldGrowing = true;
  let scale = parseFloat(shieldEl.style.transform.match(/scale\(([\d.]+)\)/)?.[1]) || 1;
  shieldEl.style.display = 'flex';
  notification.style.display = 'block';
  // reveal Next Mission when showing the congratulations notification
  const nextMission = document.getElementById("next-mission");
  if (nextMission) {
    nextMission.href = "{{ site.baseurl }}/digital-famine/media-lit/submodule_2/";
    nextMission.style.display = 'inline-block';
  }

  function grow() {
    scale += 0.05;
    shieldEl.style.transform = `translate(-50%, -50%) scale(${scale})`;
    if (scale < 15) {
      requestAnimationFrame(grow);
    } else {
      // After 3 seconds, hide shield & notification (was 2s)
      setTimeout(() => {
        shieldEl.style.display = 'none';
        notification.style.display = 'none';
      }, 3000);
    }
  }
  grow();
}




function autofillArtifacts() {
ARTIFACTS.forEach((a, i) => {
  const bin = Array.from(bins).find(b => b.dataset.bin === a.purpose);
  const artifact = document.querySelector(`[data-id="artifact-${i}"]`);
  bin.querySelector(".bin-content").appendChild(artifact);
  placedArtifacts.add(artifact.dataset.id);
  score++;
  showShieldEffect();
});
updateDisplays();
if (score >= 8 && !shieldGrowing) { showShieldComplete(); }
}




document.getElementById("reset-btn").addEventListener("click", initGame);
document.getElementById("autofill-btn").addEventListener("click", autofillArtifacts);
// remove keyClose listener (no-op)
// if (keyClose) keyClose.addEventListener('click', () => { ... });  <-- removed


updateDisplays();
initGame();
</script>