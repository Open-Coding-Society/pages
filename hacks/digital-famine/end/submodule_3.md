---
layout: post
title: "Autopilot Crash"
description: "Task 3 of the End Quest: Fix the crash of the autopilot element of the rocketship to get home safe."
permalink: /digital-famine/end/submodule_3/
parent: "End Quest"
team: "CodeMaxxers"
submodule: 3
categories: [CSP, Submodule, End]
tags: [end, submodule, codemaxxers]
author: "Maya"
date: 2025-10-21
---

<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
<title>Rocket Repair — Quiz RPG</title>

<style>
  /* ---------- Layout & background ---------- */
  :root{
    --bg-overlay: rgba(6,8,14,0.55);
    --card-bg: rgba(10,12,18,0.85);
    --accent: linear-gradient(90deg,#7dd3fc,#a78bfa);
    --text: #e6eef6;
    --muted: #9aa3b2;
  }
  html,body{height:100%;margin:0;font-family:Inter,ui-sans-serif,system-ui,Segoe UI,Roboto,"Helvetica Neue",Arial;}
  .game-root{
    position:relative;
    min-height:100vh;
    background-image:url('assets/end-3.png'); /* <-- Replace path if needed */
    background-size:cover;
    background-position:center;
    display:flex;
    align-items:center;
    justify-content:center;
    color:var(--text);
  }
  .overlay{
    position:absolute;inset:0;background:var(--bg-overlay);backdrop-filter: blur(3px);
  }

  /* ---------- HUD card ---------- */
  .hud-card{
    z-index:20;
    width:980px;
    max-width:calc(100% - 32px);
    border-radius:14px;
    padding:18px;
    background:linear-gradient(180deg, rgba(8,10,16,0.9), rgba(6,8,12,0.75));
    box-shadow:0 8px 30px rgba(2,6,23,0.6);
    display:grid;
    gap:12px;
  }
  .title-row{display:flex;align-items:center;gap:12px;justify-content:space-between;}
  .title-left h1{margin:0;font-size:18px;}
  .title-left p{margin:0;color:var(--muted);font-size:13px;}

  /* ---------- Meters ---------- */
  .hud{display:flex;gap:12px;flex-wrap:wrap;}
  .stat{flex:1;min-width:220px;border-radius:10px;padding:10px;background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.04);}
  .stat strong{display:block;margin-bottom:6px;}
  .meter{height:12px;background:#0c1116;border-radius:999px;overflow:hidden;}
  .meter > span{display:block;height:100%;width:0%;transition:width .45s cubic-bezier(.2,.9,.2,1);background:linear-gradient(90deg,#7dd3fc,#a78bfa);}

  /* ---------- Stage area ---------- */
  .stage-area{display:flex;gap:16px;align-items:flex-start;}
  .scene{
    position:relative; flex:1; min-height:260px; border-radius:12px; padding:12px;
    background:rgba(3,6,12,0.35); border:1px solid rgba(255,255,255,0.04);
  }

  /* ---------- Sprite ---------- */
  .sprite{
    position:absolute; right:22px; bottom:18px;
    width:110px;height:110px; cursor:pointer; user-select:none;
    display:flex; align-items:center; justify-content:center; border-radius:12px;
    transition:transform .12s ease,box-shadow .12s ease;
    box-shadow:0 8px 24px rgba(2,6,23,0.6);
    background:linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01));
  }
  .sprite img{width:92%;height:92%;object-fit:contain;pointer-events:none;}
  .sprite:hover{transform:translateY(-6px); box-shadow:0 14px 40px rgba(0,0,0,0.6);}

  /* ---------- Popup quiz modal ---------- */
  .modal-backdrop{
    position:fixed; inset:0; display:none; align-items:center; justify-content:center; z-index:999;
    background:rgba(0,0,0,0.55);
  }
  .modal{
    width:860px; max-width:calc(100% - 32px);
    background:var(--card-bg); border-radius:12px; padding:18px; color:var(--text);
    box-shadow:0 12px 40px rgba(2,6,23,0.7);
  }
  .modal .prompt{font-weight:700;margin-bottom:12px;}
  .choices{display:grid;gap:8px;margin-bottom:10px;}
  .choice-btn{
    text-align:left;padding:10px;border-radius:10px;border:1px solid rgba(255,255,255,0.05);
    background:transparent;color:var(--text);cursor:pointer;
  }
  .choice-btn:hover{transform:translateY(-3px);box-shadow:0 8px 20px rgba(0,0,0,0.45)}
  .btn-row{display:flex;gap:8px;justify-content:flex-end;margin-top:12px;}

  /* ---------- small helpers ---------- */
  .mini{font-size:13px;color:var(--muted);}
  .pill{display:inline-block;padding:4px 8px;border-radius:999px;background:rgba(255,255,255,0.02);font-size:12px;border:1px solid rgba(255,255,255,0.03);}

  /* ---------- Result board ---------- */
  .result{
    margin-top:12px;padding:12px;border-radius:10px;background:rgba(0,0,0,0.35);border:1px solid rgba(255,255,255,0.03);
  }

  /* ---------- small responsive tweaks ---------- */
  @media (max-width:720px){
    .sprite{right:12px;bottom:12px;width:86px;height:86px;}
  }
</style>
</head>
<body>

<div class="game-root" id="gameRoot">
  <div class="overlay"></div>

  <div class="hud-card" role="main" aria-labelledby="gameTitle">
    <div class="title-row">
      <div class="title-left">
        <h1 id="gameTitle">🚀 Rocket Repair — Autopilot Failure (Quiz RPG)</h1>
        <p class="mini">Click the ship sprite to approach the console and run diagnostic quizzes. Complete questions to repair systems.</p>
      </div>
      <div class="title-right mini" style="text-align:right;">
        <div><span class="pill">Single-page</span> <span class="pill">Popup Quiz</span></div>
        <div style="margin-top:6px;"><button id="saveBtn" class="pill" style="border:none;cursor:pointer;background:transparent;color:var(--muted)">Save</button></div>
      </div>
    </div>

    <div class="hud" aria-hidden="false">
      <div class="stat">
        <strong>Shield Integrity</strong>
        <div class="meter"><span id="shieldMeter"></span></div>
        <div class="mini" id="shieldTxt">0%</div>
      </div>
      <div class="stat">
        <strong>System Energy</strong>
        <div class="meter"><span id="energyMeter"></span></div>
        <div class="mini" id="energyTxt">100%</div>
      </div>
      <div class="stat">
        <strong>Quizzes Completed</strong>
        <div style="font-size:18px;margin-top:8px" id="qCount">0 / 0</div>
        <div class="mini">Correct answers increase integrity; wrong answers drain energy.</div>
      </div>
    </div>

    <div class="stage-area" style="margin-top:12px;">
      <div class="scene" aria-label="rocket cockpit">
        <div class="mini">Cockpit — Exterior view</div>
        <p style="margin-top:8px;" class="mini">Approach the diagnostic console (sprite) to run a quiz about the broken autopilot. You will get feedback immediately in the popup. The page doesn't navigate away; the quiz is a modal overlay.</p>

        <!-- sprite (clickable) -->
        <div class="sprite" id="spriteBtn" role="button" aria-pressed="false" title="Click to approach console">
          <!-- Replace sprite.png with your sprite path -->
          <img src="assets/end-3-computer.png" alt="Console sprite (click to run diagnostic)" id="spriteImg">
        </div>
      </div>

      <div class="scene" style="min-width:280px;">
        <div class="mini"><strong>Mission</strong></div>
        <div style="margin-top:8px;" class="mini">Autopilot status: <span id="apStatus">BROKEN</span></div>
        <div class="result" id="lastFeedback">No diagnostics run yet.</div>
      </div>
    </div>

    <div style="margin-top:12px;text-align:right;">
      <small class="mini">Tip: Replace `questions` array below with your quiz templates (see comments inside script).</small>
    </div>
  </div>
</div>

<!-- Modal overlay for quiz -->
<div class="modal-backdrop" id="modalBackdrop" aria-hidden="true">
  <div class="modal" role="dialog" aria-modal="true" aria-labelledby="modalTitle">
    <h2 id="modalTitle" style="margin:0 0 8px">🛠️ Diagnostic Console</h2>
    <div id="questionArea">
      <!-- dynamic content -->
    </div>

    <div class="btn-row">
      <button id="closeModal" class="choice-btn" style="background:transparent;border:1px solid rgba(255,255,255,0.04)">Close</button>
      <button id="nextBtn" class="choice-btn" style="background:var(--card-bg);">Next</button>
    </div>
  </div>
</div>

<script>
(() => {
  // ----------------------
  // Configuration / Questions
  // ----------------------
  // Replace the sample questions below with your own quiz data.
  // Each question object:
  //  - id: (string or number) unique
  //  - prompt: string (HTML allowed)
  //  - choices: array of { id, text }
  //  - correct: id (the id of the correct choice)
  //  - type: 'single' | 'multi' (defaults to single) — multi will render checkboxes
  //  - onCorrectPoints: integer (how many shield points to add)
  //  - onWrongEnergyDrain: integer (how much energy to drain)
  //
  // You can also include additional free-text prompts; the template below shows where
  // to attach a textarea for optional notes (the game will save it).
  const questions = [
    {
      id: 'q1',
      prompt: 'Diagnostic subroutine A: Which action should you take first when you see an unknown autopilot command sequence?',
      choices: [
        {id:'a', text:'Immediately reboot autopilot (power cycle).'},
        {id:'b', text:'Isolate the command source and check command provenance.'},
        {id:'c', text:'Ignore it and continue flight.'},
        {id:'d', text:'Broadcast the command to all nearby vessels.'}
      ],
      correct: 'b',
      type: 'single',
      onCorrectPoints: 20,
      onWrongEnergyDrain: 5,
      allowNotes: true
    },
    {
      id: 'q2',
      prompt: 'Diagnostic subroutine B: Which log file is most useful for checking recent autopilot inputs?',
      choices: [
        {id:'a', text:'telemetry.log (input commands + timestamps)'},
        {id:'b', text:'user-interface.log (UI clicks only)'},
        {id:'c', text:'audio-recording.mp3'},
      ],
      correct: 'a',
      onCorrectPoints: 20,
      onWrongEnergyDrain: 5
    },
    {
      id: 'q3',
      prompt: 'Select the two indicators that most likely indicate a compromised autopilot instruction (choose two):',
      choices: [
        {id:'c1', text:'Unusual timestamps outside mission window'},
        {id:'c2', text:'IP/source provenance from a trusted mission node'},
        {id:'c3', text:'Payload commands that request manual override without authorization'},
        {id:'c4', text:'Perfectly formatted JSON matching expected schema'}
      ],
      correct: ['c1','c3'],
      type: 'multi',
      onCorrectPoints: 30,
      onWrongEnergyDrain: 6
    }
  ];

  // --- End of configuration ---

  // State
  const state = {
    shield: 0, // 0..100
    energy: 100,
    idx: 0, // current question index
    answers: {}, // questionId -> { correct:true/false, notes?, selected:? }
    savedKey: 'rocket-repair-save-v1'
  };

  // DOM helpers
  const $ = (s) => document.querySelector(s);
  const $$ = (s) => Array.from(document.querySelectorAll(s));

  // UI nodes
  const spriteBtn = $('#spriteBtn');
  const modalBackdrop = $('#modalBackdrop');
  const questionArea = $('#questionArea');
  const nextBtn = $('#nextBtn');
  const closeModal = $('#closeModal');
  const shieldMeter = $('#shieldMeter');
  const energyMeter = $('#energyMeter');
  const shieldTxt = $('#shieldTxt');
  const energyTxt = $('#energyTxt');
  const qCount = $('#qCount');
  const lastFeedback = $('#lastFeedback');
  const saveBtn = $('#saveBtn');

  // Initialize HUD
  function clamp(v, a=0,b=100){ return Math.max(a, Math.min(b, v)); }
  function refreshHUD(){
    shieldMeter.style.width = clamp(Math.round(state.shield)) + '%';
    energyMeter.style.width = clamp(Math.round(state.energy)) + '%';
    shieldTxt.textContent = Math.round(state.shield) + '%';
    energyTxt.textContent = Math.round(state.energy) + '%';
    qCount.textContent = `${Object.keys(state.answers).length} / ${questions.length}`;
  }

  // Save/load simple snapshot
  function saveState(){
    const payload = {
      shield: state.shield,
      energy: state.energy,
      idx: state.idx,
      answers: state.answers,
      savedAt: new Date().toISOString()
    };
    try {
      localStorage.setItem(state.savedKey, JSON.stringify(payload));
      lastFeedback.innerHTML = `<div class="mini">Saved at ${new Date().toLocaleString()}</div>`;
    } catch (e) {
      console.warn('Save failed', e);
    }
  }
  function loadState(){
    const raw = localStorage.getItem(state.savedKey);
    if (!raw) return false;
    try {
      const p = JSON.parse(raw);
      state.shield = p.shield ?? state.shield;
      state.energy = p.energy ?? state.energy;
      state.idx = p.idx ?? state.idx;
      state.answers = p.answers ?? state.answers;
      lastFeedback.innerHTML = `<div class="mini">Loaded save from ${p.savedAt ?? 'unknown'}</div>`;
      return true;
    } catch(e){ return false; }
  }
  saveBtn.addEventListener('click', saveState);

  // Sprite click opens modal and shows current question
  spriteBtn.addEventListener('click', () => {
    openModal();
  });

  function openModal(startIndex = state.idx){
    state.idx = typeof startIndex === 'number' ? startIndex : state.idx;
    renderCurrentQuestion();
    modalBackdrop.style.display = 'flex';
    modalBackdrop.setAttribute('aria-hidden','false');
  }
  function closeModalFn(){
    modalBackdrop.style.display = 'none';
    modalBackdrop.setAttribute('aria-hidden','true');
    saveState();
    refreshHUD();
  }
  closeModal.addEventListener('click', closeModalFn);
  modalBackdrop.addEventListener('click', (e) => {
    if (e.target === modalBackdrop) closeModalFn();
  });

  // Render a question
  function renderCurrentQuestion(){
    const q = questions[state.idx];
    if (!q){
      // end screen inside modal
      questionArea.innerHTML = `
        <div class="prompt">All diagnostics run.</div>
        <div class="mini">Shield: ${state.shield}% · Energy: ${state.energy}%</div>
        <div style="margin-top:12px;" class="mini">You can close this dialog and run diagnostics again or try to save/export.</div>
      `;
      nextBtn.textContent = 'Close';
      nextBtn.onclick = closeModalFn;
      return;
    }

    // If already answered, show feedback and selected
    const answered = state.answers[q.id];
    let html = `<div class="prompt">${q.prompt}</div>`;
    html += `<div class="mini" style="margin-bottom:8px">Type: ${q.type === 'multi' ? 'multiple-choice (multi)' : 'multiple-choice (single)'}</div>`;

    if (q.type === 'multi') {
      html += `<div class="choices">`;
      q.choices.forEach(c => {
        const checked = answered && Array.isArray(answered.selected) && answered.selected.includes(c.id) ? 'checked' : '';
        html += `<label class="choice-btn"><input type="checkbox" data-choice="${c.id}" ${checked} style="margin-right:8px"/> ${c.text}</label>`;
      });
      html += `</div>`;
    } else {
      html += `<div class="choices">`;
      q.choices.forEach(c => {
        const checked = answered && answered.selected === c.id ? 'checked' : '';
        html += `<label class="choice-btn"><input type="radio" name="choice" data-choice="${c.id}" ${checked} style="margin-right:8px"/> ${c.text}</label>`;
      });
      html += `</div>`;
    }

    // Optional notes
    if (q.allowNotes || q.allowNotes === undefined) {
      const notes = (answered && answered.notes) ? answered.notes : '';
      html += `<div style="margin-top:8px"><textarea id="q-notes" rows="3" style="width:100%;border-radius:8px;border:1px solid rgba(255,255,255,0.03);background:transparent;color:var(--text);padding:8px" placeholder="Optional notes...">${escapeHtml(notes)}</textarea></div>`;
    }

    // If already answered, show feedback block
    if (answered) {
      html += `<div style="margin-top:10px;padding:10px;border-radius:8px;background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.02)"><strong>Last result:</strong><div class="mini" style="margin-top:6px">${answered.correct ? '✅ Correct' : '❌ Incorrect'}</div></div>`;
    }

    questionArea.innerHTML = html;

    nextBtn.textContent = (answered ? (state.idx < questions.length - 1 ? 'Next Question' : 'Finish') : 'Submit');
    nextBtn.onclick = onSubmitOrNext;
  }

  function onSubmitOrNext(){
    const q = questions[state.idx];
    if (!q){
      closeModalFn();
      return;
    }

    const answered = state.answers[q.id];
    // If already answered and user clicked Next, advance
    if (answered){
      if (state.idx < questions.length - 1){
        state.idx++;
        renderCurrentQuestion();
        return;
      } else {
        // all done
        questionArea.innerHTML = `<div class="prompt">Diagnostics complete.</div>`;
        nextBtn.textContent = 'Close';
        return;
      }
    }

    // Gather selected
    if (q.type === 'multi'){
      const checked = Array.from(questionArea.querySelectorAll('input[type="checkbox"]:checked')).map(i => i.getAttribute('data-choice'));
      evaluateAnswer(q, checked);
    } else {
      const sel = questionArea.querySelector('input[type="radio"]:checked');
      const selectedId = sel ? sel.getAttribute('data-choice') : null;
      evaluateAnswer(q, selectedId);
    }
  }

  // Evaluate answer: update state, meters, save notes
  function evaluateAnswer(q, selected){
    // normalize selected
    let isCorrect = false;
    if (q.type === 'multi'){
      const correctArr = Array.isArray(q.correct) ? q.correct.slice().sort() : [q.correct].sort();
      const selArr = Array.isArray(selected) ? selected.slice().sort() : [];
      // require exact match to reward full points
      isCorrect = JSON.stringify(correctArr) === JSON.stringify(selArr);
    } else {
      isCorrect = selected === q.correct;
    }

    // record answer
    state.answers[q.id] = {
      correct: isCorrect,
      selected,
      notes: (questionArea.querySelector('#q-notes') ? questionArea.querySelector('#q-notes').value.trim() : '')
    };

    // apply effects
    if (isCorrect){
      state.shield = clamp(state.shield + (q.onCorrectPoints ?? 10));
      lastFeedback.innerHTML = `<div class="mini">✅ Correct — +${q.onCorrectPoints ?? 10} integrity.</div>`;
    } else {
      state.energy = clamp(state.energy - (q.onWrongEnergyDrain ?? 5));
      lastFeedback.innerHTML = `<div class="mini">❌ Incorrect — -${q.onWrongEnergyDrain ?? 5}% energy.</div>`;
    }

    // mark question answered; update HUD and re-render to show feedback
    refreshHUD();
    // Small delay so user sees the saved feedback
    setTimeout(() => {
      // after answering, auto-advance to show result and allow Next
      renderCurrentQuestion();
    }, 200);
  }

  // Utility
  function escapeHtml(s=''){
    return (s+'').replace(/[&<>"]/g, (m)=>({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;' }[m]));
  }

  // Allow keyboard submit: Enter to submit if modal open
  document.addEventListener('keydown', (e) => {
    if (modalBackdrop.style.display === 'flex' && e.key === 'Enter'){
      e.preventDefault();
      nextBtn.click();
    }
  });

  // Initialize
  (function init(){
    // restore save if present
    loadState();
    refreshHUD();
    // if some questions already answered, set idx to first unanswered
    let firstUn = questions.findIndex(q => !(state.answers && state.answers[q.id]));
    if (firstUn >= 0) state.idx = firstUn;
    else state.idx = questions.length; // all done
    // show counts
    refreshHUD();
  })();

  // Small confetti on full repair (optional)
  function miniConfetti(){
    const N = 60;
    for (let i=0;i<N;i++){
      const el = document.createElement('div');
      el.style.position = 'fixed';
      el.style.left = Math.random()*100 + 'vw';
      el.style.top = '-10px';
      el.style.width = '8px';
      el.style.height = '12px';
      el.style.borderRadius = '2px';
      el.style.zIndex = '9999';
      el.style.background = `hsl(${Math.floor(Math.random()*360)}, 80%, 60%)`;
      document.body.appendChild(el);
      const dur = 1800 + Math.random()*1400;
      const dx = (Math.random()*2-1)*120;
      el.animate([
        { transform: 'translate(0,0) rotate(0deg)', opacity:1 },
        { transform: `translate(${dx}px, 100vh) rotate(${Math.random()*720-360}deg)`, opacity:0.95 }
      ], { duration: dur, easing: 'cubic-bezier(.2,.8,.2,1)', fill:'forwards' });
      setTimeout(()=>el.remove(), dur+80);
    }
  }

  // Expose a check to see if fully repaired
  window.checkForVictory = function(){
    if (state.shield >= 80 && state.energy >= 50 && Object.keys(state.answers).length >= questions.length){
      lastFeedback.innerHTML = `<div class="mini">🛡️ Shields nominal. Autopilot stabilized. Congratulations!</div>`;
      miniConfetti();
    }
  };

  // Periodic save every 30s
  setInterval(saveState, 30000);

  // Try to detect when user completes all questions and apply victory
  setInterval(window.checkForVictory, 2000);

})();
</script>

</body>
</html>

