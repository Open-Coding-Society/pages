---
layout: opencs
title: Connect 4
permalink: /connect4/
---

<!-- ========= UI ========= -->
<div id="app" class="wrap">
  <!-- Start Screen -->
  <section id="start" class="card center">
    <h1 class="title">Connect 4</h1>
    <p class="muted">Choose a timer per player</p>
    <div class="row">
      <button class="btn" data-time="180">3 Minutes</button>
      <button class="btn" data-time="300">5 Minutes</button>
      <button class="btn" data-time="600">10 Minutes</button>
    </div>
    <p class="press">…or press <kbd>Enter</kbd> to start with 5:00</p>
  </section>

  <!-- Game Screen - Board Overlay -->
  <section id="game" class="hidden game-overlay">
    <div class="hud">
      <!-- Red panel -->
      <div class="panel red-side">
        <h2>Red</h2>
        <div class="timer" id="tRed">05:00</div>
        <div class="stash">
          <div class="dot red"></div>
          <span>Coins: <b id="cRed">21</b></span>
        </div>
      </div>
      <!-- Board -->
      <div id="boardWrap">
        <div id="board"></div>
        <!-- falling coin overlay -->
        <div id="fall" class="coin hidden"></div>
      </div>
      <!-- Yellow panel -->
      <div class="panel yellow-side">
        <h2>Yellow</h2>
        <div class="timer" id="tYellow">05:00</div>
        <div class="stash">
          <div class="dot yellow"></div>
          <span>Coins: <b id="cYellow">21</b></span>
        </div>
      </div>
    </div>
    <br>
    <br>
    <br>
    <div class="row center">
      <button id="restart" class="btn danger">Restart</button>
    </div>
  </section>
</div>

<!-- ========= Styles ========= -->
<style>
  :root{
    --bg:#0f0f10;
    --card:#17181c;
    --muted:#a9b0be;
    --blue:#1658e5;
    --red:#ef4444;
    --yellow:#facc15;
    --cell:76px;      /* cell size */
    --gap:12px;       /* hole spacing */
    --radius:50%;
    --boardPad:18px;
    --boardCols:7;
    --boardRows:6;
  }
  *{box-sizing:border-box}
  .wrap{
    min-height:100vh; display:flex; align-items:center; justify-content:center;
    background:var(--bg); color:#fff; font-family:system-ui,Segoe UI,Roboto,Inter,Arial;
    padding:24px;
    position: relative;
  }
  .hidden{display:none}
  .center{justify-content:center; text-align:center}
  .row{display:flex; gap:12px; align-items:center; flex-wrap:wrap}
  .card{
    background:var(--card); padding:28px; border-radius:18px; box-shadow:0 10px 30px #0006; width:min(720px,95vw);
  }
  .title{font-size:42px; margin:0 0 8px}
  .muted{color:var(--muted); margin:0 0 18px}
  .press{color:var(--muted); margin-top:14px; font-size:14px}
  kbd{background:#222; padding:2px 6px; border-radius:6px; border:1px solid #333}

  .btn{
    background:#2b2f3a; border:1px solid #3a4151; color:#fff;
    padding:10px 16px; border-radius:12px; cursor:pointer; font-weight:600;
    transition:transform .06s ease, background .2s, border .2s;
  }
  .btn:hover{transform:translateY(-1px); background:#323849}
  .btn:active{transform:translateY(0)}
  .btn.danger{background:#b71c1c; border-color:#c72a2a}
  .btn.danger:hover{background:#d32626}

  /* Game Overlay - positioned on top */
  .game-overlay{
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: var(--bg);
    z-index: 1000;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 24px;
  }
  .game-overlay.hidden{
    display: none;
  }

  .hud{display:grid; grid-template-columns:1fr auto 1fr; gap:18px; align-items:center}
  .panel{
    background:#14161b; border:1px solid #272c38; border-radius:16px; padding:16px;
    display:flex; flex-direction:column; align-items:center; gap:10px; min-width:160px;
  }
  .panel h2{margin:0; letter-spacing:.5px}
  .red-side h2{color:var(--red)} .yellow-side h2{color:#f4d34a}
  .timer{font-size:38px; font-variant-numeric:tabular-nums}
  .stash{display:flex; align-items:center; gap:10px; color:#d6dbe6}
  .dot{width:18px; height:18px; border-radius:50%}
  .red{background:var(--red)} .yellow{background:var(--yellow)}

  /* Board (blue plate with circular holes) */
  #boardWrap{position:relative; padding:var(--boardPad); background:var(--blue);
    border-radius:22px; box-shadow:inset 0 0 0 6px #0e3ea3, 0 12px 24px #0007}
  #board{
    display:grid; gap:var(--gap);
    grid-template-columns:repeat(var(--boardCols), var(--cell));
    grid-template-rows:repeat(var(--boardRows), var(--cell));
  }
  /* Holes are white circles; when filled, we color them */
  #board .hole{
    width:var(--cell); height:var(--cell); border-radius:var(--radius);
    background:#f1f5f9; position:relative; overflow:hidden;
    box-shadow:inset 0 0 0 6px #0e3ea3;
    cursor:pointer; transition:filter .2s;
  }
  #board .hole:hover{filter:brightness(0.95)}
  #board .hole.filled::after{
    content:""; position:absolute; inset:0; border-radius:var(--radius);
  }
  #board .hole.red::after{background:var(--red)}
  #board .hole.yellow::after{background:var(--yellow)}

  /* Falling coin overlay */
  .coin{
    position:absolute; width:var(--cell); height:var(--cell); border-radius:50%;
    left:0; top:0; transform:translate(0,-100%); will-change:transform;
    box-shadow:0 4px 10px #0007, inset 0 -6px 0 #0003;
    transition:transform .28s cubic-bezier(.2,.9,.2,1);
  }
  .coin.red{background:var(--red)}
  .coin.yellow{background:var(--yellow)}

  /* Win Overlay */
  .win-overlay{
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.8);
    z-index: 2000;
    display: flex;
    align-items: center;
    justify-content: center;
    backdrop-filter: blur(8px);
    animation: fadeIn 0.3s ease-out;
  }
  .win-card{
    background: var(--card);
    padding: 40px;
    border-radius: 20px;
    text-align: center;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
    transform: scale(0.9);
    animation: popIn 0.4s ease-out 0.1s forwards;
    border: 2px solid #3a4151;
  }
  .win-title{
    font-size: 36px;
    margin: 0 0 24px;
    color: #fff;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  }
  .win-btn{
    font-size: 18px;
    padding: 12px 24px;
    background: var(--blue);
    border-color: #1658e5;
  }
  .win-btn:hover{
    background: #1d6bf0;
  }
  @keyframes fadeIn{
    from{ opacity: 0; }
    to{ opacity: 1; }
  }
  @keyframes popIn{
    from{ transform: scale(0.8); opacity: 0; }
    to{ transform: scale(1); opacity: 1; }
  }
</style>

<!-- ========= Logic ========= -->
<script>
(() => {
  // --- Elements ---
  const start = document.getElementById('start');
  const game  = document.getElementById('game');
  const boardWrap = document.getElementById('boardWrap');
  const boardEl = document.getElementById('board');
  const fallEl  = document.getElementById('fall');
  const tRedEl = document.getElementById('tRed');
  const tYellowEl = document.getElementById('tYellow');
  const cRedEl = document.getElementById('cRed');
  const cYellowEl = document.getElementById('cYellow');
  const restartBtn = document.getElementById('restart');

  // --- Game constants ---
  const ROWS = 6, COLS = 7, MAX_COINS = 21;

  // --- State ---
  let board, player, redTime, yellowTime, tick, redCoins, yellowCoins, running, animating;

  // Helpers
  const fmt = s => {
    const m = Math.floor(s/60), r = s % 60;
    return `${String(m).padStart(2,'0')}:${String(r).padStart(2,'0')}`;
  };
  const cellPx = () => parseInt(getComputedStyle(document.documentElement).getPropertyValue('--cell'));
  const gapPx  = () => parseInt(getComputedStyle(document.documentElement).getPropertyValue('--gap'));
  const boardPad = () => parseInt(getComputedStyle(document.documentElement).getPropertyValue('--boardPad'));

  // Build empty board UI - only when game starts
  function drawEmptyBoard(){
    boardEl.innerHTML = '';
    for(let r=0;r<ROWS;r++){
      for(let c=0;c<COLS;c++){
        const d = document.createElement('div');
        d.className = 'hole';
        d.dataset.col = c;
        boardEl.appendChild(d);
      }
    }
  }

  // Render tokens
  function paint(){
    [...boardEl.children].forEach((el, i) => {
      const r = Math.floor(i / COLS), c = i % COLS;
      el.classList.remove('filled','red','yellow');
      const v = board[r][c];
      if(v){
        el.classList.add('filled', v);
      }
    });
    cRedEl.textContent = redCoins;
    cYellowEl.textContent = yellowCoins;
    tRedEl.textContent = fmt(redTime);
    tYellowEl.textContent = fmt(yellowTime);
  }

  // Find landing row in column
  function landingRow(col){
    for(let r=ROWS-1; r>=0; r--) if(!board[r][col]) return r;
    return -1;
  }

  // Animate falling coin overlay, then commit to board
  async function dropAnimated(col, row, color){
    animating = true;
    const size = cellPx(), gap = gapPx(), pad = boardPad();
    const x = pad + col*(size+gap);
    const y = pad + row*(size+gap);
    fallEl.className = `coin ${color}`;
    fallEl.style.left = x + 'px';
    fallEl.style.transform = `translate(0,-100%)`;
    fallEl.classList.remove('hidden');

    // Trigger layout, then animate to target Y
    void fallEl.offsetWidth; // reflow
    const tx = `translate(0, ${y}px)`;
    fallEl.style.transitionDuration = `${Math.min(120 + row*120, 520)}ms`;
    fallEl.style.transform = tx;

    // wait for transition end
    await new Promise(res => {
      const done = () => { fallEl.removeEventListener('transitionend', done); res(); };
      fallEl.addEventListener('transitionend', done, {once:true});
    });

    fallEl.classList.add('hidden');
    board[row][col] = color;
    paint();
    animating = false;
  }

  // Check win (4 in a row)
  function checkWin(r,c){
    const color = board[r][c];
    const dirs = [[1,0],[0,1],[1,1],[1,-1]];
    for(const [dr,dc] of dirs){
      let count = 1;
      for(const sign of [-1,1]){
        let rr=r+dr*sign, cc=c+dc*sign;
        while(board[rr] && board[rr][cc]===color){
          count++; rr+=dr*sign; cc+=dc*sign;
        }
      }
      if(count>=4) return true;
    }
    return false;
  }

  function boardFull(){
    return board.every(row => row.every(v => v));
  }

  function endGame(msg){
    running = false;
    clearInterval(tick);
    showWinMessage(msg);
  }

  function showWinMessage(msg){
    // Create win overlay
    const winOverlay = document.createElement('div');
    winOverlay.className = 'win-overlay';
    winOverlay.innerHTML = `
      <div class="win-card">
        <h2 class="win-title">${msg}</h2>
        <button class="btn win-btn" onclick="this.parentElement.parentElement.remove()">Continue</button>
      </div>
    `;
    document.body.appendChild(winOverlay);
  }

  function switchTurn(){
    player = (player === 'red') ? 'yellow' : 'red';
  }

  // Timers (chess style: only active player's countdown)
  function startTimers(){
    clearInterval(tick);
    tick = setInterval(()=>{
      if(!running) return;
      if(player==='red'){ redTime--; if(redTime<0){ endGame('Yellow wins on time!'); } }
      else { yellowTime--; if(yellowTime<0){ endGame('Red wins on time!'); } }
      tRedEl.textContent = fmt(Math.max(0,redTime));
      tYellowEl.textContent = fmt(Math.max(0,yellowTime));
    },1000);
  }

  // --- Interactions ---
  boardEl.addEventListener('click', async (e)=>{
    const target = e.target.closest('.hole');
    if(!target || !running || animating) return;

    const col = +target.dataset.col;
    const row = landingRow(col);
    if(row < 0) return; // full column

    // Check coin stash
    if(player==='red' && redCoins<=0) return;
    if(player==='yellow' && yellowCoins<=0) return;

    // animate drop
    if(player==='red') redCoins--; else yellowCoins--;
    await dropAnimated(col, row, player);

    // win/draw checks
    if(checkWin(row,col)){ endGame(`${player[0].toUpperCase()+player.slice(1)} wins!`); return; }
    if(boardFull()){ endGame('Draw!'); return; }

    switchTurn(); // toggle whose clock is ticking
  });

  // Start game with selected time
  function startGame(seconds){
    // Hide start screen and show game overlay
    start.classList.add('hidden');
    game.classList.remove('hidden');

    board = Array.from({length:ROWS}, ()=>Array(COLS).fill(null));
    player = 'red';
    redTime = yellowTime = seconds;
    redCoins = yellowCoins = MAX_COINS;
    running = true; animating = false;

    // Build board only when game starts
    drawEmptyBoard();
    paint();
    startTimers();
  }

  // Start screen buttons
  start.querySelectorAll('.btn').forEach(b=>{
    b.addEventListener('click', ()=>startGame(+b.dataset.time));
  });
  // Enter defaults to 5 minutes
  window.addEventListener('keydown', (e)=>{
    if(!game.classList.contains('hidden') || e.key!=='Enter') return;
    startGame(300);
  });

  // Restart to start screen
  restartBtn.addEventListener('click', ()=>{
    clearInterval(tick);
    game.classList.add('hidden');
    start.classList.remove('hidden');
  });
})();
</script>