---
layout: post
title: "Submodule 2 — Media Literacy: Signal of Deception"
description: "End Module RPG-style final test: repair the ship using media literacy."
permalink: /digital-famine/end/submodule_2/
parent: "End Quest"
team: "CodeMaxxers"
submodule: 2
categories: [CSP, Submodule, End]
tags: [end, submodule, codemaxxers, media-literacy]
author: "Cyrus Zhang"
date: 2025-10-24
breadcrumb: true
---

<style>
  :root {
    --card-bg: rgba(20,22,30,0.75);
    --card-border: rgba(255,255,255,0.08);
    --accent: #7dd3fc;
    --accent-2: #a78bfa;
    --good: #22c55e;
    --bad: #ef4444;
    --warn: #f59e0b;
    --text: #e5e7eb;
    --muted: #9ca3af;
  }
  .rpg-wrap {
    max-width: 980px; margin: 1.5rem auto; padding: 0 1rem; color: var(--text);
  }
  .hud {
    display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin: 10px 0 18px;
  }
  .hud .stat {
    border: 1px solid var(--card-border); background: var(--card-bg);
    border-radius: 10px; padding: 10px 12px; display: grid; gap: 6px;
  }
  .meter { height: 10px; background: #111827; border-radius: 999px; overflow: hidden; }
  .meter > span { display: block; height: 100%; background: linear-gradient(90deg, var(--accent), var(--accent-2)); width: 0%; transition: width .4s ease; }
  .console {
    border: 1px solid var(--card-border); background: linear-gradient(180deg, rgba(15,15,25,.9), rgba(15,15,25,.7));
    border-radius: 14px; padding: 18px; box-shadow: 0 6px 20px rgba(0,0,0,.25); margin-bottom: 14px;
  }
  .stage-card {
    border: 1px solid var(--card-border); background: rgba(25,27,39,.75);
    border-radius: 14px; padding: 18px; margin: 16px 0; position: relative;
  }
  .stage-badge {
    position: absolute; top: -10px; right: 12px; background: var(--accent-2);
    color: #0b1020; font-weight: 700; padding: 2px 10px; border-radius: 999px; font-size: 12px;
    box-shadow: 0 2px 10px rgba(167,139,250,.45);
  }
  .prompt { font-weight: 700; margin: 8px 0 10px; }
  .choices { display: grid; gap: 8px; margin: 10px 0; }
  .btn {
    cursor: pointer; user-select: none; border: 1px solid var(--card-border); background: #0b1020;
    color: var(--text); padding: 10px 12px; border-radius: 10px; transition: transform .06s ease, box-shadow .2s ease;
  }
  .btn:hover { box-shadow: 0 4px 16px rgba(125,211,252,.15); transform: translateY(-1px); }
  .btn.choice { text-align: left; }
  .btn.primary { background: linear-gradient(90deg, var(--accent), var(--accent-2)); color: #0b1020; font-weight: 800; }
  .btn.ghost { background: transparent; }
  .btn.good { border-color: rgba(34,197,94,.6); }
  .btn.bad { border-color: rgba(239,68,68,.6); }
  .mini { font-size: 12px; color: var(--muted); }
  .feedback {
    border-left: 4px solid var(--accent); background: rgba(125,211,252,.08);
    padding: 10px 12px; border-radius: 8px; margin-top: 10px; display: none;
  }
  .feedback.good { border-left-color: var(--good); background: rgba(34,197,94,.08); }
  .feedback.bad { border-left-color: var(--bad); background: rgba(239,68,68,.08); }
  .pill {
    display: inline-block; padding: 2px 8px; border-radius: 999px; background: #0f172a; color: var(--muted); font-size: 12px;
    border: 1px solid var(--card-border); margin-right: 6px;
  }
  .divider { height: 1px; background: var(--card-border); margin: 18px 0; }
  .shield {
    border: 1px solid var(--card-border); background: radial-gradient(1200px 300px at center, rgba(124,58,237,.06), rgba(2,6,23,.8));
    border-radius: 16px; padding: 20px; text-align: center; margin-top: 10px;
  }
  .hidden { display: none !important; }
  .notice { border: 1px dashed var(--card-border); background: rgba(2,6,23,.6); padding: 10px 12px; border-radius: 10px; color: var(--muted); }
  .kbd { font-family: ui-monospace, SFMono-Regular, Menlo, monospace; padding: 1px 6px; border-radius: 6px; border: 1px solid var(--card-border); background: #0b1020; }

  @keyframes shieldPulse {
    0% { transform: scale(2); opacity: 0; border-width: 1px; }
    50% { opacity: 0.5; }
    100% { transform: scale(1); opacity: 0; border-width: 15px; }
  }

  .shield-effect {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 9999;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .shield-pulse {
    width: 150px;
    height: 150px;
    border-radius: 50%;
    border: 1px solid var(--accent);
    animation: shieldPulse 1s ease-out forwards;
  }

  .shield-icon {
    position: absolute;
    font-size: 60px;
    animation: fadeInOut 1s ease-out forwards;
  }

  @keyframes fadeInOut {
    0% { transform: scale(0.5); opacity: 0; }
    50% { transform: scale(1.2); opacity: 1; }
    100% { transform: scale(1); opacity: 0; }
  }
</style>

<style>
@keyframes alertFlash {
  0% { background: rgba(239,68,68,0.1); }
  50% { background: rgba(239,68,68,0.3); }
  100% { background: rgba(239,68,68,0.1); }
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
  20%, 40%, 60%, 80% { transform: translateX(5px); }
}

@keyframes glitch {
  0% { clip-path: inset(40% 0 61% 0); }
  20% { clip-path: inset(92% 0 1% 0); }
  40% { clip-path: inset(43% 0 1% 0); }
  60% { clip-path: inset(25% 0 58% 0); }
  80% { clip-path: inset(54% 0 7% 0); }
  100% { clip-path: inset(58% 0 43% 0); }
}

.alert-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.8);
  z-index: 9999;
  display: flex;
  justify-content: center;
  align-items: center;
  animation: alertFlash 2s infinite;
}

.alert-box {
  background: rgba(20,22,30,0.95);
  border: 2px solid var(--bad);
  border-radius: 16px;
  padding: 30px;
  max-width: 600px;
  text-align: center;
  position: relative;
  overflow: hidden;
}

.alert-box::before {
  content: "ALERT";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  text-align: center;
  font-size: 40px;
  color: var(--bad);
  opacity: 0.1;
  animation: glitch 1s infinite;
}

.alert-title {
  color: var(--bad);
  font-size: 24px;
  margin: 0 0 20px;
  text-transform: uppercase;
  font-weight: bold;
}

.alert-icon {
  font-size: 48px;
  margin-bottom: 20px;
}

.alert-message {
  color: var(--text);
  margin-bottom: 25px;
  font-size: 18px;
  line-height: 1.5;
}

.alert-button {
  background: var(--bad);
  color: white;
  border: none;
  padding: 12px 30px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: transform 0.2s;
}

.alert-button:hover {
  transform: scale(1.05);
}
</style>

<div id="alien-alert" class="alert-overlay" style="display: none;">
  <div class="alert-box">
    <div class="alert-icon">🚨</div>
    <h2 class="alert-title">Alien Cyberattack Detected!</h2>
    <p class="alert-message">
      EMERGENCY: Your ship's shields are under attack from hostile alien disinformation!<br><br>
      Shield Status: CRITICAL<br>
      Defensive Action Required: Complete 5 security challenges to restore shield integrity.<br><br>
      <span style="color: var(--warn)">⚠️ WARNING: Each wrong answer drains shield power! Choose wisely.</span>
    </p>
    <button class="alert-button" onclick="startChallenge()">Initialize Defense Protocol</button>
  </div>
</div>

<div class="rpg-wrap">
  <div class="console" id="intro">
    <h2 style="margin:0 0 8px">🪐 End Quest — Submodule 2: <span style="color:var(--accent)">Signal of Deception</span></h2>
    <p class="mini">Mission: Your rocket is jammed by alien misinformation. Repair the <span class="pill">Information Circuits</span>, purge <span class="pill">Clickbait Virus</span>, and restore <span class="pill">Shield Integrity</span> with media-literacy skills.</p>
    <div class="hud">
      <div class="stat">
        <div><strong>Shield Integrity</strong> <span class="mini">(score)</span></div>
        <div class="meter"><span id="meter-shield"></span></div>
        <div class="mini" id="meter-shield-txt">0%</div>
      </div>
      <div class="stat">
        <div><strong>System Energy</strong> <span class="mini">(wrong answers drain 2%)</span></div>
        <div class="meter"><span id="meter-energy"></span></div>
        <div class="mini" id="meter-energy-txt">100%</div>
      </div>
    </div>
    <div class="button-row" style="display:flex; gap:8px; flex-wrap:wrap">
      <button class="btn primary" id="start">Launch Final Test</button>
      <button class="btn ghost" id="load">Load Save</button>
      <button class="btn ghost" id="reset">Full Reset</button>
    </div>
    <div class="divider"></div>
    <div class="notice mini">Autosaves after each stage to <span class="kbd">localStorage</span> under key <span class="kbd">ml-end-submodule-2</span>.</div>
  </div>

  <!-- Stage 1 -->
  <div class="stage-card hidden" id="stage-1">
    <div class="stage-badge">Stage 1 — Intercepted Transmission</div>
    <div class="prompt">Headline appears: “BREAKING: Alien armada confirmed by anonymous space blogger — evacuation underway!” What’s your first move?</div>
    <div class="choices">
      <button class="btn choice" data-choice="a">A) Blast it to all crew channels now.</button>
      <button class="btn choice" data-choice="b" data-correct>B) Check the source’s credentials and corroborate with multiple outlets.</button>
      <button class="btn choice" data-choice="c">C) Ignore everything online; it’s all fake.</button>
      <button class="btn choice" data-choice="d">D) Ask ship AI to rewrite it to sound calmer.</button>
    </div>
    <div class="feedback" id="fb-1"></div>
    <div class="mini">Mini task: Name two signs a source is unreliable.</div>
    <textarea id="mini-1" rows="3" style="width:100%;margin-top:6px;border-radius:8px;border:1px solid var(--card-border);background:#0b1020;color:var(--text);padding:8px" placeholder="e.g., emotional language, no citations, no author page, mismatched dates, broken ‘About’ link..."></textarea>
    <div style="margin-top:10px; display:flex; gap:8px; flex-wrap:wrap">
      <button class="btn" data-next="stage-2">Lock & Continue</button>
    </div>
  </div>

  <!-- Stage 2 -->
  <div class="stage-card hidden" id="stage-2">
    <div class="stage-badge">Stage 2 — Echo Chamber Core</div>
    <div class="prompt">Your feed shows the same opinion everywhere from “different” users. Diagnosis?</div>
    <div class="choices">
      <button class="btn choice" data-choice="a" data-correct>A) Algorithmic filter bubble / echo chamber.</button>
      <button class="btn choice" data-choice="b">B) Pure coincidence.</button>
      <button class="btn choice" data-choice="c">C) Government blackout.</button>
      <button class="btn choice" data-choice="d">D) Stable data equilibrium.</button>
    </div>
    <div class="feedback" id="fb-2"></div>
    <div class="mini">Challenge: Add 3 credible perspectives to rebalance. Name the types:</div>
    <input id="stage2-src1" class="src" placeholder="e.g., peer-reviewed journal" style="width:100%;margin-top:6px;border-radius:8px;border:1px solid var(--card-border);background:#0b1020;color:var(--text);padding:8px">
    <input id="stage2-src2" class="src" placeholder="e.g., reputable wire service (AP/Reuters)" style="width:100%;margin-top:6px;border-radius:8px;border:1px solid var(--card-border);background:#0b1020;color:var(--text);padding:8px">
    <input id="stage2-src3" class="src" placeholder="e.g., official agency / primary dataset" style="width:100%;margin-top:6px;border-radius:8px;border:1px solid var(--card-border);background:#0b1020;color:var(--text);padding:8px">
    <div style="margin-top:10px; display:flex; gap:8px; flex-wrap:wrap">
      <button class="btn" data-next="stage-3">Lock & Continue</button>
    </div>
  </div>

  <!-- Stage 3 -->
  <div class="stage-card hidden" id="stage-3">
    <div class="stage-badge">Stage 3 — Deepfake Distortion</div>
    <div class="prompt">A viral image shows an alien fleet; your scanner shows empty space. How to verify the image?</div>
    <div class="choices">
      <button class="btn choice" data-choice="a" data-correct>A) Reverse image search + metadata/EXIF checks.</button>
      <button class="btn choice" data-choice="b">B) Repost and ask for votes.</button>
      <button class="btn choice" data-choice="c">C) Poll your followers.</button>
      <button class="btn choice" data-choice="d">D) Wipe the ship memory.</button>
    </div>
    <div class="feedback" id="fb-3"></div>
    <div class="mini">Bonus: In 1–2 sentences, explain how AI-generated media can fool viewers.</div>
    <textarea id="mini-3" rows="3" style="width:100%;margin-top:6px;border-radius:8px;border:1px solid var(--card-border);background:#0b1020;color:var(--text);padding:8px" placeholder="Note realism of diffusion models, voice cloning ‘grain’, lighting/shadow inconsistencies, lack of provenance, etc."></textarea>
    <div style="margin-top:10px; display:flex; gap:8px; flex-wrap:wrap">
      <button class="btn" data-next="stage-4">Lock & Continue</button>
    </div>
  </div>

  <!-- Stage 4 -->
  <div class="stage-card hidden" id="stage-4">
    <div class="stage-badge">Stage 4 — Viral Frequency Virus</div>
    <div class="prompt">Clickbait drains 2% energy per headline. Pick the two clickbait traits.</div>
    <div class="choices">
      <label class="btn choice"><input type="checkbox" class="cb" data-id="cb1" style="margin-right:8px">“You won’t BELIEVE what this alien said next!”</label>
      <label class="btn choice"><input type="checkbox" class="cb" data-id="cb2" style="margin-right:8px">“Scientists quietly admit the truth about teleportation.”</label>
      <label class="btn choice"><input type="checkbox" class="cb" data-id="cb3" style="margin-right:8px">“Confirmed: Space Council bans all space trade.”</label>
    </div>
    <button class="btn" id="check-4">Check Selection</button>
    <div class="feedback" id="fb-4"></div>
    <div class="mini">Rewrite one headline credibly:</div>
    <textarea id="mini-4" rows="2" style="width:100%;margin-top:6px;border-radius:8px;border:1px solid var(--card-border);background:#0b1020;color:var(--text);padding:8px" placeholder="e.g., “Space Council announces new trade restrictions; details pending official release.”"></textarea>
    <div style="margin-top:10px; display:flex; gap:8px; flex-wrap:wrap">
      <button class="btn" data-next="stage-5">Lock & Continue</button>
    </div>
  </div>

  <!-- Stage 5 -->
  <div class="stage-card hidden" id="stage-5">
    <div class="stage-badge">Stage 5 — Final Firewall</div>
    <div class="prompt">Choose the most credible report and explain why.</div>
    <div class="choices">
      <button class="btn choice" data-choice="1" data-correct>1) Peer-reviewed scientific journal article.</button>
      <button class="btn choice" data-choice="2">2) Viral meme with 10M shares.</button>
      <button class="btn choice" data-choice="3">3) Emotional post by a political influencer.</button>
    </div>
    <div class="feedback" id="fb-5"></div>
    <textarea id="mini-5" rows="3" style="width:100%;margin-top:6px;border-radius:8px;border:1px solid var(--card-border);background:#0b1020;color:var(--text);padding:8px" placeholder="Explain credibility (peer review, methods, citations) and how bias affects the others."></textarea>
    <div style="margin-top:10px; display:flex; gap:8px; flex-wrap:wrap">
      <button class="btn primary" id="finish">Finish & Compute Shield</button>
    </div>
  </div>

  <!-- Results -->
  <div class="shield hidden" id="results">
    <h3 style="margin:0 0 6px">🚀 Mission Summary</h3>
    <div id="summary" class="mini" style="margin-bottom:10px"></div>
    <div class="hud">
      <div class="stat">
        <div><strong>Total Score → Shield Integrity</strong></div>
        <div class="meter"><span id="meter-final"></span></div>
        <div class="mini" id="meter-final-txt">0%</div>
      </div>
      <div class="stat">
        <div><strong>Energy Remaining</strong></div>
        <div class="meter"><span id="meter-final-energy"></span></div>
        <div class="mini" id="meter-final-energy-txt">0%</div>
      </div>
    </div>
    <div id="passnote" class="notice" style="margin-top:10px"></div>
    <div style="margin-top:12px; display:flex; gap:8px; justify-content:center; flex-wrap:wrap">
      <button class="btn" id="save">Save Run</button>
      <button class="btn ghost" id="try-again">Try Again</button>
      <button class="btn ghost" id="export">Export Results (JSON)</button>
    </div>
  </div>
</div>

<script>
(() => {
  const KEY = 'ml-end-submodule-2';
  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => Array.from(document.querySelectorAll(sel));

  const state = {
    score: 0, // 0–100
    energy: 100,
    stages: {
      1: { answered: false, correct: false, mini: '' },
      2: { answered: false, correct: false, sources: [] },
      3: { answered: false, correct: false, mini: '' },
      4: { answered: false, correct: false, picks: [] , rewrite: ''},
      5: { answered: false, correct: false, rationale: '' }
    },
    version: 1
  };

  function clamp(v, min, max){ return Math.max(min, Math.min(max, v)); }

  function save() {
    const payload = { ...state, savedAt: new Date().toISOString() };
    localStorage.setItem(KEY, JSON.stringify(payload));
  }
  function load() {
    const raw = localStorage.getItem(KEY);
    if (!raw) return false;
    try {
      const data = JSON.parse(raw);
      Object.assign(state, data);
      return true;
    } catch(e){ console.warn(e); return false; }
  }
  function reset() {
    localStorage.removeItem(KEY);
    location.reload();
  }

  function setMeter(idSpan, idTxt, pct) {
    $(idSpan).style.width = pct + '%';
    $(idTxt).textContent = pct + '%';
  }
  function refreshHUD() {
    setMeter('#meter-shield', '#meter-shield-txt', clamp(Math.round(state.score),0,100));
    setMeter('#meter-energy', '#meter-energy-txt', clamp(Math.round(state.energy),0,100));
  }

  function show(id){ $(id).classList.remove('hidden'); }
  function hide(id){ $(id).classList.add('hidden'); }

  function drainEnergy(n=2){ state.energy = clamp(state.energy - n, 0, 100); refreshHUD(); }
  function addScore(n){ 
    // Add score and ensure it can reach 100
    const newScore = state.score + n;
    state.score = clamp(newScore, 0, 100); 
    refreshHUD(); 
    if (n > 0) showShieldEffect();
    console.log('Score updated:', state.score); // Debug logging
  }

  function showShieldEffect() {
    // Create shield effect container
    const shieldEffect = document.createElement('div');
    shieldEffect.className = 'shield-effect';
    
    // Create pulse circle
    const pulse = document.createElement('div');
    pulse.className = 'shield-pulse';
    
    // Create shield icon
    const icon = document.createElement('div');
    icon.className = 'shield-icon';
    icon.textContent = '🛡️';
    
    // Assemble and show effect
    shieldEffect.appendChild(pulse);
    shieldEffect.appendChild(icon);
    document.body.appendChild(shieldEffect);
    
    // Play shield sound
    const shieldSound = new Audio('data:audio/wav;base64,UklGRqQIAABXQVZFZm10IBAAAAABAAEAQB8AAIA+AAACABAAZGF0YYAIAACBhYqFhoJ8bXJpa2BaZWl1eICHjomPipCVi4eCfHl9f4OLkpOZoqWppKWprK2yubW2vru/vb28vLW6uK+us6quttbU1tHT0c3JyMC+vru7vr7CwMfDysjByMLJwcrN0s3IztDLy8fNy83JzcrOzdLP0dXY1NfT1NHK4vn8+vr69/Hx6+nq7urs8fDx9PLw8u7s7+rr7Onp7Ojm5+Pi4+Pi4uLl5eTn6Obn6Onq7O3r7vLu8PHv8O7s6urp7Ovt7fDw8vX19vj6/Pz9/f39+/r6+Pf29PP19PHx8vDu7u7s7Ozr6+ro6ejo5+fn5uXm5eTk4+Pi4uHh4ODf39/e3t7d3d3c29zb29va2trZ2dnY2NjX19fW1tbV1dXU1NTT09PS0tLR0dHQ0NDPz8/Ozs7Nzc3MzMzLy8vKysrJycnIyMjHx8fGxsbFxcXExMTDw8PCwsLBwcHAwMC/v7++vr69vb28vLy7u7u6urq5ubm4uLi3t7e2tra1tbW0tLSzs7OysrKxsbGwsLCvr6+urq6tra2srKyrq6uqqqqpqamoqKinp6empqalpaWkpKSjo6OioqKhoaGgoKCfn5+enp6dnZ2cnJybm5uam5qZmZmYmJiXl5eWlpaVlZWUlJSTk5OSkpKRkZGQkJCPj4+Oj4+Njo6MjYyMjIyLi4uKioqJiYmIiIiHh4eGhoaFhYWEhISEg4ODgoKCgYGBgICAfX19fHx8eXl5dnZ2c3NzcXFxbm5ubGxsamRjYmBfXl1cWlhYVlZVU1JSUVBPTk1MS0pJSEdGRkVEQ0NCQkFAP0A/Pj4+PT08Ozw7Ojk5ODg3NjY2NTU0MzQzMjIyMTExMDAwLy8vLi4uLS0tLCwsKysrKioqKSkpKCgoJycnJiYmJSUlJCQkIyMjIiIiISEhICAgHx8fHh4eHR0dHBwcGxsbGhoaGRkZGBgYFxcXFhYWFRUVFBQUExMTEhISEREREBAQDw8PDg4ODQ0NDAwMCwsLCgoKCQkJCAgIBwcHBgYGBQUFBAQEAwMDAgICAQEBAAAA//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////8AAP//');
    shieldSound.volume = 0.2;
    shieldSound.play();
    
    // Remove effect after animation
    setTimeout(() => {
      document.body.removeChild(shieldEffect);
    }, 1000);
  }

  function lockStage(n){
    // basic autosave
    save();
    // advance
    const nextId = '#stage-' + n;
    // keep stage visible but choices disabled
    $$('#stage-' + n + ' .btn.choice').forEach(b => b.disabled = true);
  }

  // Intro controls
  $('#start').addEventListener('click', () => {
    hide('#intro'); show('#stage-1');
    refreshHUD(); save();
  });
  $('#load').addEventListener('click', () => {
    const ok = load();
    if (!ok) { alert('No save found.'); return; }
    hide('#intro'); refreshHUD();
    // Reveal completed or next stage
    let next = 1;
    for (let i=1;i<=5;i++){
      if (state.stages[i].answered) { show('#stage-' + i); lockStage(i); next = i+1; }
      else { show('#stage-' + i); next = i; break; }
    }
    if (next>5) { hideAllStages(); show('#results'); finalize(); }
  });
  $('#reset').addEventListener('click', reset);

  function hideAllStages(){ for (let i=1;i<=5;i++){ hide('#stage-' + i); } }

  // Stage 1
  $$('#stage-1 .btn.choice').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      const correct = btn.hasAttribute('data-correct');
      const fb = $('#fb-1');
      state.stages[1].answered = true; state.stages[1].correct = correct;
      if (correct){ fb.className = 'feedback good'; fb.innerHTML = '✅ Correct. First verify the source: author, credentials, publication reputation, timestamps. Then corroborate across independent outlets.'; addScore(20); }
      else { fb.className = 'feedback bad'; fb.innerHTML = '❌ Not quite. Sharing or rewriting without verification spreads possible misinformation.'; drainEnergy(2); }
      fb.style.display = 'block';
      lockStage(1);
    });
  });
  $('#stage-1 [data-next]').addEventListener('click', (e)=>{
    state.stages[1].mini = $('#mini-1').value.trim();
    hide('#stage-1'); show('#stage-2'); save();
  });

  // Stage 2
  $$('#stage-2 .btn.choice').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      const correct = btn.hasAttribute('data-correct');
      const fb = $('#fb-2');
      state.stages[2].answered = true; state.stages[2].correct = correct;
      if (correct){ fb.className = 'feedback good'; fb.innerHTML = '✅ Correct. Algorithmic personalization can create echo chambers; diversify inputs deliberately.'; addScore(20); }
      else { fb.className = 'feedback bad'; fb.innerHTML = '❌ Feeds rarely homogenize by coincidence; algorithms prioritize engagement-aligned content.'; drainEnergy(2); }
      fb.style.display = 'block';
      lockStage(2);
    });
  });
  $('#stage-2 [data-next]').addEventListener('click', ()=>{
    const s1 = $('#stage2-src1').value.trim();
    const s2 = $('#stage2-src2').value.trim();
    const s3 = $('#stage2-src3').value.trim();
    state.stages[2].sources = [s1,s2,s3].filter(Boolean);
    hide('#stage-2'); show('#stage-3'); save();
  });

  // Stage 3
  $$('#stage-3 .btn.choice').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      const correct = btn.hasAttribute('data-correct');
      const fb = $('#fb-3');
      state.stages[3].answered = true; state.stages[3].correct = correct;
      if (correct){ fb.className = 'feedback good'; fb.innerHTML = '✅ Correct. Use reverse image search, check timestamps, EXIF/provenance, lighting/shadows, and report lineage.'; addScore(20); }
      else { fb.className = 'feedback bad'; fb.innerHTML = '❌ Crowd opinion ≠ verification. Use digital forensics and provenance checks.'; drainEnergy(2); }
      fb.style.display = 'block';
      lockStage(3);
    });
  });
  $('#stage-3 [data-next]').addEventListener('click', ()=>{
    state.stages[3].mini = $('#mini-3').value.trim();
    hide('#stage-3'); show('#stage-4'); save();
  });

  // Stage 4
  $('#check-4').addEventListener('click', ()=>{
    const picks = $$('#stage-4 .cb:checked').map(cb=>cb.getAttribute('data-id'));
    const fb = $('#fb-4');
    state.stages[4].answered = true;
    state.stages[4].picks = picks;
    const isCorrect = picks.includes('cb1') && picks.includes('cb2') && picks.length===2;
    state.stages[4].correct = isCorrect;
    
    // Disable checkboxes after answering
    $$('#stage-4 .cb').forEach(cb => cb.disabled = true);
    
    if (isCorrect){
      fb.className = 'feedback good';
      fb.innerHTML = '✅ Correct. #1 is sensational; #2 implies secret knowledge. #3 may be factual (depending on source), not inherently clickbait.';
      addScore(20);
      showShieldEffect(); // Explicitly trigger shield effect
    } else {
      fb.className = 'feedback bad';
      fb.innerHTML = '❌ Not quite. Select the sensational/emotive or conspiratorial framing (#1 and #2).';
      drainEnergy(2);
    }
    fb.style.display = 'block';
    
    // Disable the check button after answering
    $('#check-4').disabled = true;
    
    // Ensure stage is properly locked and progress is saved
    lockStage(4);
    save();
  });
  $('#stage-4 [data-next]').addEventListener('click', ()=>{
    state.stages[4].rewrite = $('#mini-4').value.trim();
    hide('#stage-4'); show('#stage-5'); save();
  });

  // Stage 5
  $$('#stage-5 .btn.choice').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      const correct = btn.hasAttribute('data-correct');
      const fb = $('#fb-5');
      state.stages[5].answered = true; state.stages[5].correct = correct;
      if (correct){
        fb.className = 'feedback good';
        fb.innerHTML = '✅ Correct. Peer-reviewed work provides methods, citations, and accountability. Virality or emotion ≠ evidence.';
        addScore(20);
      } else {
        fb.className = 'feedback bad';
        fb.innerHTML = '❌ Popularity and emotion can bias interpretation; they don’t validate claims.';
        drainEnergy(2);
      }
      fb.style.display = 'block';
      lockStage(5);
    });
  });
  $('#finish').addEventListener('click', ()=>{
    state.stages[5].rationale = $('#mini-5').value.trim();
    hideAllStages(); show('#results'); finalize(); save();
  });

  function finalize(){
    // Score already accumulated: 5 stages × 20 pts each
    const finalScore = clamp(Math.round(state.score),0,100);
    const energy = clamp(Math.round(state.energy),0,100);

    setMeter('#meter-final', '#meter-final-txt', finalScore);
    setMeter('#meter-final-energy', '#meter-final-energy-txt', energy);

    const passed = finalScore >= 60 && energy >= 70; // Adjusted pass condition to be more reasonable
    const stagesAnswered = Object.values(state.stages).filter(s=>s.answered).length;
    const stagesCorrect = Object.values(state.stages).filter(s=>s.correct).length;
    const notesSaved = (state.stages[1].mini?1:0) + 
                      (state.stages[3].mini?1:0) + 
                      (state.stages[4].rewrite?1:0) + 
                      (state.stages[5].rationale?1:0);
    
    console.log('Stage completion:', state.stages); // Debug log
    
    const summary = `
      Stages cleared: ${stagesAnswered}/5 •
      Correct: ${stagesCorrect}/5 •
      Notes saved: ${notesSaved}
    `;
    $('#summary').textContent = summary;

    $('#passnote').innerHTML = passed
      ? '🛡️ <strong>PASS</strong>: Media Literacy Module complete. Shield Integrity restored. Alien cyberattack collapses under verified data.'
      : '🔧 <strong>RETRY</strong>: Strengthen verification and bias checks. Review feedback and attempt again.';

    // tiny confetti if pass (no external libs)
    if (passed) miniConfetti();
  }

  $('#save').addEventListener('click', save);
  $('#try-again').addEventListener('click', ()=>location.reload());
  $('#export').addEventListener('click', ()=>{
    const blob = new Blob([JSON.stringify(state, null, 2)], {type:'application/json'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'media-literacy-end-module-result.json'; a.click();
    URL.revokeObjectURL(url);
  });

  function miniConfetti(){
    const N=80;
    for (let i=0;i<N;i++){
      const p=document.createElement('div');
      p.style.position='fixed';
      p.style.left=(Math.random()*100)+'vw';
      p.style.top='-10px';
      p.style.width='6px'; p.style.height='10px';
      p.style.background = `hsl(${Math.floor(Math.random()*360)},80%,60%)`;
      p.style.borderRadius='2px';
      p.style.opacity='0.9';
      p.style.zIndex='9999';
      document.body.appendChild(p);
      const fall=()=>{
        const dur = 2000 + Math.random()*2000;
        const dx = (Math.random()*2-1)*60;
        p.animate([
          { transform:`translate(0,0) rotate(0deg)` },
          { transform:`translate(${dx}px, 100vh) rotate(${Math.random()*720-360}deg)` }
        ], { duration: dur, easing:'cubic-bezier(.2,.8,.2,1)', fill:'forwards' });
        setTimeout(()=>p.remove(), dur+50);
      };
      setTimeout(fall, Math.random()*300);
    }
  }

  // Initialize meters
  refreshHUD();

  // Alien Alert Functionality
  window.startChallenge = function() {
    const alert = document.getElementById('alien-alert');
    alert.style.animation = 'fadeOut 0.5s forwards';
    setTimeout(() => {
      alert.style.display = 'none';
    }, 500);
  }

  // Show alien alert when page loads
  document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
      const alert = document.getElementById('alien-alert');
      alert.style.display = 'flex';
      
      // Add some dynamic effects
      const alertBox = alert.querySelector('.alert-box');
      alertBox.style.transform = 'scale(0)';
      void alertBox.offsetWidth; // Force reflow
      alertBox.style.transition = 'transform 0.5s cubic-bezier(0.2, 1.5, 0.3, 1)';
      alertBox.style.transform = 'scale(1)';
      
      // Add shake animation for 1 second
      alertBox.style.animation = 'shake 0.5s cubic-bezier(.36,.07,.19,.97) infinite';
      setTimeout(() => {
        alertBox.style.animation = 'none';
      }, 1000);

      // Add some sound effects (optional - comment out if not wanted)
      const alertSound = new Audio('data:audio/wav;base64,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qJrx4KOQjahZxWbcZgztj2c49nKmkId44S71j0c8eV9yDK6uPRzx5X18eDvjvQ6yKo9ZSS6l//8elePK/Lf//IInrOF/FvDoADYAGBMGb7FtErm5MXMlmPAJQVgWta7Zx2go+8xJ0UiCb8LHHdftWyLJE0QIAIsI+UbXu67dZMjmgDGCGl1H+vpF4NSDckSIkk7Vd+sxEhBQMRU8j/12UIRhzSaUdQ+rQU5kGeFxm+hb1oh6pWWmv3uvmReDl0UnvtapVaIzo1jZbf/pD6ElLqSX+rUmOQNpJFa/r+sa4e/pBlAABoAAAAA3CUgShLdGIxsY7AUABPRrgCABdDuQ5GC7DqPQCgbbJUAoRSUj+NIEig0YfyWUho1VBBBA//uQZB4ABZx5zfMakeAAAAmwAAAAF5F3P0w9GtAAACfAAAAAwLhMDmAYWMgVEG1U0FIGCBgXBXAtfMH10000EEEEEECUBYln03TTTdNBDZopopYvrTTdNa325mImNg3TTPV9q3pmY0xoO6bv3r00y+IDGid/9aaaZTGMuj9mpu9Mpio1dXrr5HERTZSmqU36A3CumzN/9Robv/Xx4v9ijkSRSNLQhAWumap82WRSBUqXStV/YcS+XVLnSS+WLDroqArFkMEsAS+eWmrUzrO0oEmE40RlMZ5+ODIkAyKAGUwZ3mVKmcamcJnMW26MRPgUw6j+LkhyHGVGYjSUUKNpuJUQoOIAyDvEyG8S5yfK6dhZc0Tx1KI/gviKL6qvvFs1+bWtaz58uUNnryq6kt5RzOCkPWlVqVX2a/EEBUdU1KrXLf40GoiiFXK///qpoiDXrOgqDR38JB0bw7SoL+ZB9o1RCkQjQ2CBYZKd/+VJxZRRZlqSkKiws0WFxUyCwsKiMy7hUVFhIaCrNQsKkTIsLivwKKigsj8XYlwt/WKi2N4d//uQRCSAAjURNIHpMZBGYiaQPSYyAAABLAAAAAAAACWAAAAApUF/Mg+0aohSIRobBAsMlO//Kk4soosy1JSFRYWaLC4qZBYWFRGZdwqKiwkNBVmoWFSJkWFxX4FFRQWR+LsS4W/rFRb/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////VEFHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAU291bmRib3kuZGUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMjAwNGh0dHA6Ly93d3cuc291bmRib3kuZGUAAAAAAAAAACU=');
      alertSound.play();
    }, 1000);
  });

  // Start button handler
  $('#start').addEventListener('click', () => {
    hide('#intro');
    show('#stage-1');
    refreshHUD();
    save();
  });
})();
</script>
    
















































































