---
layout: opencs
title: Connect 4
permalink: /connect4/play/
---

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

<!-- ========= OOP Logic ========= -->
<script>
// ========= PLAYER CLASS =========
class Player {
  constructor(name, color) {
    this.name = name;
    this.color = color;
    this.time = 300; // default 5 minutes
    this.coins = 21;
  }

  setTime(seconds) {
    this.time = seconds;
  }

  usesCoin() {
    if (this.coins > 0) {
      this.coins--;
      return true;
    }
    return false;
  }

  hasTimeLeft() {
    return this.time > 0;
  }

  decrementTime() {
    if (this.time > 0) {
      this.time--;
    }
  }

  reset(timeInSeconds) {
    this.time = timeInSeconds;
    this.coins = 21;
  }
}

// ========= GAME BOARD CLASS =========
class GameBoard {
  constructor(rows = 6, cols = 7) {
    this.rows = rows;
    this.cols = cols;
    this.grid = [];
    this.initialize();
  }

  initialize() {
    this.grid = Array.from({length: this.rows}, () => Array(this.cols).fill(null));
  }

  isValidColumn(col) {
    return col >= 0 && col < this.cols && this.grid[0][col] === null;
  }

  getDropRow(col) {
    if (!this.isValidColumn(col)) return -1;
    
    for (let row = this.rows - 1; row >= 0; row--) {
      if (this.grid[row][col] === null) {
        return row;
      }
    }
    return -1;
  }

  placePiece(row, col, color) {
    if (row >= 0 && row < this.rows && col >= 0 && col < this.cols) {
      this.grid[row][col] = color;
      return true;
    }
    return false;
  }

  checkWin(row, col) {
    const color = this.grid[row][col];
    if (!color) return false;

    const directions = [
      [1, 0],   // vertical
      [0, 1],   // horizontal
      [1, 1],   // diagonal \
      [1, -1]   // diagonal /
    ];

    for (const [deltaRow, deltaCol] of directions) {
      let count = 1; // count the current piece

      // Check in both directions
      for (const direction of [-1, 1]) {
        let r = row + deltaRow * direction;
        let c = col + deltaCol * direction;

        while (
          r >= 0 && r < this.rows &&
          c >= 0 && c < this.cols &&
          this.grid[r][c] === color
        ) {
          count++;
          r += deltaRow * direction;
          c += deltaCol * direction;
        }
      }

      if (count >= 4) return true;
    }

    return false;
  }

  isFull() {
    return this.grid.every(row => row.every(cell => cell !== null));
  }

  reset() {
    this.initialize();
  }
}

// ========= TIMER CLASS =========
class GameTimer {
  constructor() {
    this.intervalId = null;
    this.onTick = null;
    this.onTimeUp = null;
  }

  start(tickCallback, timeUpCallback) {
    this.onTick = tickCallback;
    this.onTimeUp = timeUpCallback;
    
    this.intervalId = setInterval(() => {
      if (this.onTick) {
        this.onTick();
      }
    }, 1000);
  }

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  reset() {
    this.stop();
  }
}

// ========= GAME UI CLASS =========
class GameUI {
  constructor() {
    this.elements = {
      start: document.getElementById('start'),
      game: document.getElementById('game'),
      boardWrap: document.getElementById('boardWrap'),
      board: document.getElementById('board'),
      fallCoin: document.getElementById('fall'),
      redTimer: document.getElementById('tRed'),
      yellowTimer: document.getElementById('tYellow'),
      redCoins: document.getElementById('cRed'),
      yellowCoins: document.getElementById('cYellow'),
      restartBtn: document.getElementById('restart')
    };
  }

  showStartScreen() {
    this.elements.start.classList.remove('hidden');
    this.elements.game.classList.add('hidden');
  }

  showGameScreen() {
    this.elements.start.classList.add('hidden');
    this.elements.game.classList.remove('hidden');
  }

  createBoard(rows, cols) {
    this.elements.board.innerHTML = '';
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const hole = document.createElement('div');
        hole.className = 'hole';
        hole.dataset.col = c;
        this.elements.board.appendChild(hole);
      }
    }
  }

  updateBoard(board) {
    const holes = [...this.elements.board.children];
    holes.forEach((hole, index) => {
      const row = Math.floor(index / board.cols);
      const col = index % board.cols;
      const piece = board.grid[row][col];
      
      hole.classList.remove('filled', 'red', 'yellow');
      if (piece) {
        hole.classList.add('filled', piece);
      }
    });
  }

  updatePlayerInfo(redPlayer, yellowPlayer) {
    this.elements.redTimer.textContent = this.formatTime(redPlayer.time);
    this.elements.yellowTimer.textContent = this.formatTime(yellowPlayer.time);
    this.elements.redCoins.textContent = redPlayer.coins;
    this.elements.yellowCoins.textContent = yellowPlayer.coins;
  }

  formatTime(seconds) {
    const minutes = Math.floor(Math.max(0, seconds) / 60);
    const secs = Math.max(0, seconds) % 60;
    return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }

  async animateFallingCoin(col, row, color) {
    const cellSize = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--cell'));
    const gap = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--gap'));
    const padding = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--boardPad'));
    
    const x = padding + col * (cellSize + gap);
    const y = padding + row * (cellSize + gap);
    
    this.elements.fallCoin.className = `coin ${color}`;
    this.elements.fallCoin.style.left = x + 'px';
    this.elements.fallCoin.style.transform = 'translate(0, -100%)';
    this.elements.fallCoin.classList.remove('hidden');
    
    // Force reflow
    void this.elements.fallCoin.offsetWidth;
    
    const duration = Math.min(120 + row * 120, 520);
    this.elements.fallCoin.style.transitionDuration = `${duration}ms`;
    this.elements.fallCoin.style.transform = `translate(0, ${y}px)`;
    
    return new Promise(resolve => {
      const onTransitionEnd = () => {
        this.elements.fallCoin.removeEventListener('transitionend', onTransitionEnd);
        this.elements.fallCoin.classList.add('hidden');
        resolve();
      };
      this.elements.fallCoin.addEventListener('transitionend', onTransitionEnd, {once: true});
    });
  }

  showWinMessage(message) {
    const winOverlay = document.createElement('div');
    winOverlay.className = 'win-overlay';
    winOverlay.innerHTML = `
      <div class="win-card">
        <h2 class="win-title">${message}</h2>
        <button class="btn win-btn" onclick="this.parentElement.parentElement.remove()">Continue</button>
      </div>
    `;
    document.body.appendChild(winOverlay);
  }
}

// ========= MAIN GAME CLASS =========
class Connect4Game {
  constructor() {
    this.board = new GameBoard(6, 7);
    this.redPlayer = new Player('Red', 'red');
    this.yellowPlayer = new Player('Yellow', 'yellow');
    this.currentPlayer = this.redPlayer;
    this.timer = new GameTimer();
    this.ui = new GameUI();
    this.isRunning = false;
    this.isAnimating = false;
    
    this.initializeEventListeners();
  }

  initializeEventListeners() {
    // Start screen buttons
    this.ui.elements.start.querySelectorAll('.btn').forEach(button => {
      button.addEventListener('click', () => {
        const timeInSeconds = parseInt(button.dataset.time);
        this.startGame(timeInSeconds);
      });
    });

    // Enter key for default time
    window.addEventListener('keydown', (e) => {
      if (!this.ui.elements.game.classList.contains('hidden') || e.key !== 'Enter') return;
      this.startGame(300);
    });

    // Board clicks
    this.ui.elements.board.addEventListener('click', (e) => {
      this.handleBoardClick(e);
    });

    // Restart button
    this.ui.elements.restartBtn.addEventListener('click', () => {
      this.restart();
    });
  }

  startGame(timeInSeconds) {
    // Reset game state
    this.board.reset();
    this.redPlayer.reset(timeInSeconds);
    this.yellowPlayer.reset(timeInSeconds);
    this.currentPlayer = this.redPlayer;
    this.isRunning = true;
    this.isAnimating = false;

    // Setup UI
    this.ui.showGameScreen();
    this.ui.createBoard(this.board.rows, this.board.cols);
    this.ui.updateBoard(this.board);
    this.ui.updatePlayerInfo(this.redPlayer, this.yellowPlayer);

    // Start timer
    this.timer.start(
      () => this.handleTimerTick(),
      (player) => this.handleTimeUp(player)
    );
  }

  async handleBoardClick(event) {
    const hole = event.target.closest('.hole');
    if (!hole || !this.isRunning || this.isAnimating) return;

    const col = parseInt(hole.dataset.col);
    const row = this.board.getDropRow(col);
    
    if (row < 0) return; // Column is full
    if (!this.currentPlayer.usesCoin()) return; // No coins left

    this.isAnimating = true;

    // Animate the falling coin
    await this.ui.animateFallingCoin(col, row, this.currentPlayer.color);

    // Place the piece on the board
    this.board.placePiece(row, col, this.currentPlayer.color);
    
    // Update UI
    this.ui.updateBoard(this.board);
    this.ui.updatePlayerInfo(this.redPlayer, this.yellowPlayer);

    this.isAnimating = false;

    // Check for win or draw
    if (this.board.checkWin(row, col)) {
      this.endGame(`${this.currentPlayer.name} wins!`);
      return;
    }

    if (this.board.isFull()) {
      this.endGame('Draw!');
      return;
    }

    // Switch players
    this.switchPlayer();
  }

  handleTimerTick() {
    if (!this.isRunning) return;
    
    this.currentPlayer.decrementTime();
    
    if (!this.currentPlayer.hasTimeLeft()) {
      const winner = this.currentPlayer === this.redPlayer ? this.yellowPlayer : this.redPlayer;
      this.endGame(`${winner.name} wins on time!`);
      return;
    }

    this.ui.updatePlayerInfo(this.redPlayer, this.yellowPlayer);
  }

  switchPlayer() {
    this.currentPlayer = this.currentPlayer === this.redPlayer ? this.yellowPlayer : this.redPlayer;
  }

  endGame(message) {
    this.isRunning = false;
    this.timer.stop();
    this.ui.showWinMessage(message);
  }

  restart() {
    this.timer.stop();
    this.ui.showStartScreen();
    this.isRunning = false;
  }
}

// ========= INITIALIZE GAME =========
(() => {
  const game = new Connect4Game();
})();
</script>