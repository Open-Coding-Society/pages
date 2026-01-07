---
layout: post
title: Player.js Lesson 1 — Player is a System (extends Character)
permalink: /player-lesson-one/
---

<style>
:root{
  --bg: rgba(255,255,255,0.03);
  --card: rgba(255,255,255,0.04);
  --border: rgba(255,255,255,0.10);
  --border-strong: rgba(255,255,255,0.16);
  --text: rgba(255,255,255,0.92);
  --muted: rgba(255,255,255,0.68);
  --muted2: rgba(255,255,255,0.55);
  --accent: #22c55e;
  --radius: 14px;
  --radius-sm: 10px;
}

/* Layout */
.layout{
  display:grid;
  grid-template-columns:minmax(420px,1.2fr) minmax(360px,0.8fr);
  gap:18px;
  align-items:start;
}
@media (max-width: 980px){
  .layout{ grid-template-columns:1fr; }
}

/* Panels */
.panel{
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 14px;
  margin: 0;
  box-shadow: 0 12px 34px rgba(0,0,0,0.28);
  backdrop-filter: blur(8px);
}
.panel-title{
  display:flex;
  align-items:center;
  justify-content:space-between;
  gap:10px;
  margin-bottom:10px;
}
.hint{
  font-size: 13px;
  line-height: 1.35;
  color: var(--muted);
}
.hint strong{
  color: var(--text);
  font-weight: 650;
}
.chip{
  font-size: 11px;
  padding: 4px 8px;
  border-radius: 999px;
  border: 1px solid rgba(255,255,255,0.12);
  background: rgba(255,255,255,0.06);
  color: rgba(255,255,255,0.78);
}

/* Lesson header (full-width feel) */
.lesson-header{
  grid-column: 1 / -1;
  display:flex;
  gap:12px;
  align-items:center;
  justify-content:space-between;
}
.lesson-left{
  display:flex;
  gap:10px;
  flex-direction:column;
}
.lesson-kicker{
  font-size: 12px;
  color: var(--muted2);
}
.lesson-title{
  font-size: 18px;
  color: var(--text);
  font-weight: 750;
  letter-spacing: 0.2px;
}
.lesson-actions{
  display:flex;
  gap:10px;
  align-items:center;
  flex-wrap:wrap;
}

button{
  padding: 10px 12px;
  border-radius: 12px;
  border: 1px solid rgba(255,255,255,0.12);
  background: rgba(255,255,255,0.06);
  color: var(--text);
  cursor: pointer;
  transition: transform .06s ease, background .18s ease, border-color .18s ease;
}
button:hover{
  background: rgba(255,255,255,0.09);
  border-color: rgba(255,255,255,0.18);
}
button:active{ transform: translateY(1px); }
button.primary{
  background: rgba(34,197,94,0.18);
  border-color: rgba(34,197,94,0.35);
}
button.primary:hover{
  background: rgba(34,197,94,0.24);
  border-color: rgba(34,197,94,0.45);
}

/* Canvas surface */
.panel-canvas{ padding: 14px; }
.canvas-shell{
  border-radius: calc(var(--radius) - 2px);
  border: 1px solid var(--border-strong);
  background: rgba(255,255,255,0.02);
  padding: 12px;
  position: relative;
}
.canvas-bordered{
  border: 1px solid rgba(0,0,0,0.06);
  border-radius: var(--radius-sm);
  background: #f6f9fb;
  width: 100%;
  height: auto;
  display:block;
}
#overlay{
  position:absolute;
  inset: 12px;
  pointer-events:none;
  display:flex;
  align-items:flex-start;
  justify-content:flex-start;
}
.overlay-badge{
  margin: 10px;
  padding: 6px 10px;
  border-radius: 999px;
  font-size: 12px;
  border: 1px solid rgba(0,0,0,0.08);
  background: rgba(255,255,255,0.78);
  color: rgba(0,0,0,0.72);
}

/* Controls */
.controls{
  display:grid;
  grid-template-columns: 1fr;
  gap:12px;
  align-items:end;
}
.controls .row{
  display:flex;
  gap:10px;
  flex-wrap:wrap;
  align-items:center;
}
.controls label{
  display:flex;
  align-items:center;
  justify-content:space-between;
  gap:10px;
  padding: 10px 12px;
  border-radius: 14px;
  border: 1px solid rgba(255,255,255,0.10);
  background: rgba(0,0,0,0.12);
}
.controls label .meta{
  display:flex;
  flex-direction:column;
  gap:2px;
}
.controls label .meta .t{
  font-size: 12px;
  color: var(--text);
  font-weight: 650;
}
.controls label .meta .s{
  font-size: 12px;
  color: var(--muted);
}
.toggle{
  width: 44px;
  height: 26px;
  border-radius: 999px;
  border: 1px solid rgba(255,255,255,0.16);
  background: rgba(255,255,255,0.08);
  position: relative;
  flex: 0 0 auto;
}
.toggle::after{
  content:"";
  position:absolute;
  top: 3px;
  left: 3px;
  width: 20px;
  height: 20px;
  border-radius: 999px;
  background: rgba(255,255,255,0.80);
  transition: left .16s ease, background .16s ease;
}
input[type="checkbox"]{ display:none; }
input[type="checkbox"]:checked + .toggle{
  background: rgba(34,197,94,0.25);
  border-color: rgba(34,197,94,0.35);
}
input[type="checkbox"]:checked + .toggle::after{
  left: 21px;
  background: rgba(255,255,255,0.92);
}

/* Editor blocks */
.snippet{
  background: linear-gradient(180deg, rgba(10,14,24,0.82), rgba(8,12,20,0.72));
  border: 1px solid rgba(255,255,255,0.12);
  box-shadow: inset 0 1px 0 rgba(255,255,255,0.06);
  color: rgba(255,255,255,0.92);
  padding: 12px 12px;
  border-radius: 14px;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace;
  font-size: 12.75px;
  line-height: 1.55;
  overflow:auto;
  max-height: 360px;
}
.code{ margin: 0; counter-reset: ln; }
.code-line{
  position: relative;
  padding: 2px 10px 2px 54px;
  border-radius: 10px;
  scroll-margin: 90px;
  white-space: pre;
}
.code-line::before{
  counter-increment: ln;
  content: counter(ln);
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 44px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding-right: 10px;
  color: rgba(255,255,255,0.34);
  user-select: none;
}
.code-line:hover{ background: rgba(255,255,255,0.04); }
.code-line.focus{
  background: rgba(34,197,94,0.18);
  outline: 2px solid rgba(34,197,94,0.48);
  box-shadow: 0 0 0 6px rgba(34,197,94,0.10);
}
.code-line.soft{
  background: rgba(34,197,94,0.08);
}

/* Token styling */
.tok-com { color: rgba(255,255,255,0.55); }
.tok-kw  { color: rgba(147,197,253,0.95); }
.tok-id  { color: rgba(255,255,255,0.92); }
.tok-num { color: rgba(253,230,138,0.95); }
.tok-str { color: rgba(134,239,172,0.95); }
.tok-sym { color: rgba(255,255,255,0.72); }

/* Debug */
.kv{
  display:grid;
  grid-template-columns: 1fr;
  gap:8px;
}
.kv .item{
  padding: 10px 12px;
  border-radius: 14px;
  border: 1px solid rgba(255,255,255,0.10);
  background: rgba(0,0,0,0.12);
}
.kv .k{
  font-size: 11px;
  color: var(--muted);
  margin-bottom: 2px;
}
.kv .v{
  font-size: 13px;
  color: var(--text);
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace;
}

/* Checkpoints */
.checks{
  display:grid;
  grid-template-columns: 1fr;
  gap:8px;
}
.check{
  display:flex;
  align-items:center;
  justify-content:space-between;
  gap:10px;
  padding: 10px 12px;
  border-radius: 14px;
  border: 1px solid rgba(255,255,255,0.10);
  background: rgba(0,0,0,0.12);
}
.check .label{
  font-size: 12px;
  color: var(--text);
}
.check .status{
  font-size: 12px;
  color: var(--muted);
}
.check.pass{
  border-color: rgba(34,197,94,0.28);
  background: rgba(34,197,94,0.08);
}
.check.pass .status{ color: rgba(134,239,172,0.95); }
</style>

<div class="layout">

  <!-- Lesson header -->
  <div class="panel lesson-header">
    <div class="lesson-left">
      <div class="lesson-kicker">Player.js Interactive Series</div>
      <div class="lesson-title" id="lessonTitle">Lesson 1 of 5 — Player is a System (extends Character)</div>
      <div class="hint" id="bigIdea"><strong>Big idea:</strong> <span>Character handles physics/rendering; Player adds human intent (input) without rewriting the engine.</span></div>
    </div>

    <div class="lesson-actions">
      <div class="chip" id="modeChip">Mode: Character-only</div>
      <button id="resetBtn">Reset</button>
      <button class="primary" id="pulseFocusBtn">Show Lesson Focus</button>
    </div>
  </div>

  <!-- LEFT COLUMN -->
  <div style="display:flex;flex-direction:column;gap:14px;">
    <div class="panel panel-canvas">
      <div class="panel-title">
        <div class="hint"><strong>Canvas</strong> — try moving with WASD</div>
        <div class="chip" id="inputChip">Input: off</div>
      </div>
      <div class="canvas-shell">
        <canvas id="game" width="820" height="340" class="canvas-bordered" tabindex="0"
          aria-label="Player lesson canvas (click to focus, then press keys)"></canvas>
        <div id="overlay">
          <div class="overlay-badge" id="overlayBadge">Character-only: no input</div>
        </div>
      </div>
      <div class="hint" style="margin-top:10px;" id="msg">Tip: Click the canvas first so it receives keyboard focus.</div>
    </div>

    <div class="panel">
      <div class="panel-title">
        <div class="hint"><strong>Live Code</strong> — highlights the “system boundary” (Character vs Player)</div>
        <div class="chip" id="codeChip">Focus: architecture</div>
      </div>
      <pre class="snippet" aria-live="polite"><code id="code" class="code"></code></pre>
    </div>
  </div>

  <!-- RIGHT COLUMN -->
  <div style="display:flex;flex-direction:column;gap:14px;">
    <div class="panel">
      <div class="panel-title">
        <div class="hint"><strong>Lesson Controls</strong></div>
        <div class="chip">Lesson 1</div>
      </div>

      <div class="controls">
        <label data-field="mode">
          <div class="meta">
            <div class="t">Character-only mode</div>
            <div class="s">Turn this OFF to enable Player input behavior</div>
          </div>
          <div class="row">
            <input id="toggleCharacterOnly" type="checkbox" checked />
            <span class="toggle" aria-hidden="true"></span>
          </div>
        </label>

        <label data-field="input">
          <div class="meta">
            <div class="t">Enable Player Input</div>
            <div class="s">When ON, Player listens to keys and moves the Character</div>
          </div>
          <div class="row">
            <input id="toggleInput" type="checkbox" />
            <span class="toggle" aria-hidden="true"></span>
          </div>
        </label>

        <div class="hint">
          <strong>Goal:</strong> Understand that <em>Player</em> doesn’t replace Character — it <em>extends</em> it by adding input.
        </div>
      </div>
    </div>

    <div class="panel">
      <div class="panel-title">
        <div class="hint"><strong>Checkpoints</strong> — auto-verify understanding</div>
        <div class="chip" id="checkChip">0/2</div>
      </div>
      <div class="checks">
        <div class="check" id="checkA">
          <div class="label">You can switch between Character-only and Player</div>
          <div class="status" id="checkAStatus">pending</div>
        </div>
        <div class="check" id="checkB">
          <div class="label">Player input changes movement without changing draw/physics</div>
          <div class="status" id="checkBStatus">pending</div>
        </div>
      </div>
    </div>

    <div class="panel">
      <div class="panel-title">
        <div class="hint"><strong>Live Debug</strong> — what the program thinks</div>
        <div class="chip" id="debugChip">ready</div>
      </div>
      <div class="kv">
        <div class="item">
          <div class="k">Entity Type</div>
          <div class="v" id="dbgType">Character</div>
        </div>
        <div class="item">
          <div class="k">Input Enabled</div>
          <div class="v" id="dbgInput">false</div>
        </div>
        <div class="item">
          <div class="k">Last key</div>
          <div class="v" id="dbgLastKey">(none)</div>
        </div>
        <div class="item">
          <div class="k">Position</div>
          <div class="v" id="dbgPos">(x=?, y=?)</div>
        </div>
        <div class="item">
          <div class="k">Velocity</div>
          <div class="v" id="dbgVel">(x=0, y=0)</div>
        </div>
      </div>
    </div>
  </div>

</div>

<script>
/** ---------------------------
 *  Lesson 1 Engine (minimal)
 *  Teaches “Player extends Character”
 *  ---------------------------
 */

/* Canvas */
const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

/* UI */
const msgEl = document.getElementById('msg');
const modeChip = document.getElementById('modeChip');
const inputChip = document.getElementById('inputChip');
const overlayBadge = document.getElementById('overlayBadge');

const toggleCharacterOnly = document.getElementById('toggleCharacterOnly');
const toggleInput = document.getElementById('toggleInput');

const codeEl = document.getElementById('code');
const codeChip = document.getElementById('codeChip');
const pulseFocusBtn = document.getElementById('pulseFocusBtn');

const dbgType = document.getElementById('dbgType');
const dbgInput = document.getElementById('dbgInput');
const dbgLastKey = document.getElementById('dbgLastKey');
const dbgPos = document.getElementById('dbgPos');
const dbgVel = document.getElementById('dbgVel');

const checkChip = document.getElementById('checkChip');
const checkA = document.getElementById('checkA');
const checkB = document.getElementById('checkB');
const checkAStatus = document.getElementById('checkAStatus');
const checkBStatus = document.getElementById('checkBStatus');

const resetBtn = document.getElementById('resetBtn');

/* State for checkpointing */
let switchedModesOnce = false;
let movedWithInputOnce = false;

function showMsg(text, ok=true){
  msgEl.textContent = text;
  msgEl.style.opacity = '1';
  msgEl.style.color = ok ? 'inherit' : '#ffb4b4';
}

/* Helpers */
function clamp(n, a, b){ return Math.max(a, Math.min(b, n)); }
function escapeHtml(s){
  return String(s)
    .replaceAll('&','&amp;')
    .replaceAll('<','&lt;')
    .replaceAll('>','&gt;')
    .replaceAll('"','&quot;')
    .replaceAll("'","&#39;");
}

/** ---------------------------
 * Minimal Character class
 * ---------------------------
 * Think of this like your engine base:
 * - position
 * - velocity
 * - update & draw
 */
class Character {
  constructor(gameEnv){
    this.gameEnv = gameEnv;
    this.size = 36;
    this.position = { x: canvas.width/2 - this.size/2, y: canvas.height/2 - this.size/2 };
    this.velocity = { x: 0, y: 0 };
    this.color = '#0b6b4f';
  }
  update(){
    // Physics-ish: apply velocity, clamp to bounds
    this.position.x = clamp(this.position.x + this.velocity.x, 0, canvas.width - this.size);
    this.position.y = clamp(this.position.y + this.velocity.y, 0, canvas.height - this.size);
  }
  draw(){
    ctx.clearRect(0,0,canvas.width,canvas.height);

    // subtle ground grid
    ctx.save();
    ctx.globalAlpha = 0.12;
    for(let x=0;x<canvas.width;x+=40){
      ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,canvas.height); ctx.stroke();
    }
    for(let y=0;y<canvas.height;y+=40){
      ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(canvas.width,y); ctx.stroke();
    }
    ctx.restore();

    // character
    ctx.fillStyle = this.color;
    ctx.fillRect(this.position.x, this.position.y, this.size, this.size);

    // label
    ctx.font = '12px ui-monospace, Menlo, Consolas, monospace';
    ctx.fillStyle = 'rgba(0,0,0,0.55)';
    ctx.fillText(this.constructor.name, 10, 18);
  }
}

/** ---------------------------
 * Minimal Player class (Lesson 1 scope)
 * ---------------------------
 * Teaches: Player extends Character and adds input intent.
 * (We keep the full Player.js behavior for later lessons.)
 */
class Player extends Character {
  static playerCount;
  constructor(data=null, gameEnv=null){
    super(gameEnv);

    Player.playerCount = (Player.playerCount || 0) + 1;
    this.id = data?.id ? data.id.toLowerCase() : `player${Player.playerCount}`;

    // WASD keyCodes
    this.keypress = data?.keypress || { up: 87, left: 65, down: 83, right: 68 };

    this.pressedKeys = {};
    this.inputEnabled = true;

    // velocities (pretend these come from Character config)
    this.xVelocity = 4;
    this.yVelocity = 4;

    this.bindMovementKeyListners();
  }

  bindMovementKeyListners(){
    addEventListener('keydown', this.handleKeyDown.bind(this));
    addEventListener('keyup', this.handleKeyUp.bind(this));
  }

  handleKeyDown({ keyCode, key }){
    if (!this.inputEnabled) return;
    this.pressedKeys[keyCode] = true;
    lastKey = key || String(keyCode);
    this.updateVelocity();
  }

  handleKeyUp({ keyCode }){
    if (!this.inputEnabled) return;
    if (keyCode in this.pressedKeys) delete this.pressedKeys[keyCode];
    this.updateVelocity();
  }

  updateVelocity(){
    // Lesson 1: simplest possible translation
    this.velocity.x = 0;
    this.velocity.y = 0;

    if (this.pressedKeys[this.keypress.right]) this.velocity.x += this.xVelocity;
    if (this.pressedKeys[this.keypress.left])  this.velocity.x -= this.xVelocity;
    if (this.pressedKeys[this.keypress.down])  this.velocity.y += this.yVelocity;
    if (this.pressedKeys[this.keypress.up])    this.velocity.y -= this.yVelocity;
  }
}

/** ---------------------------
 * Lesson runtime: swap modes
 * ---------------------------
 */
let entity = new Character();
let lastKey = '(none)';

function setMode(){
  const characterOnly = toggleCharacterOnly.checked;
  const inputOn = toggleInput.checked;

  // Switching modes is the “learning moment”
  if (characterOnly){
    entity = new Character();
    modeChip.textContent = 'Mode: Character-only';
    inputChip.textContent = 'Input: off';
    overlayBadge.textContent = 'Character-only: no input';
    dbgType.textContent = 'Character';
    dbgInput.textContent = 'false';
  } else {
    entity = new Player();
    modeChip.textContent = 'Mode: Player';
    inputChip.textContent = `Input: ${inputOn ? 'on' : 'off'}`;
    overlayBadge.textContent = `Player: input ${inputOn ? 'enabled' : 'disabled'}`;
    dbgType.textContent = 'Player';
    dbgInput.textContent = String(!!inputOn);

    // enable/disable input without changing Character/physics
    entity.inputEnabled = !!inputOn;
    entity.updateVelocity?.();
  }

  // Lesson focus highlight update
  renderLessonCode(characterOnly, inputOn);

  // checkpoint: switched at least once
  switchedModesOnce = switchedModesOnce || !characterOnly;
  updateCheckpoints();

  showMsg('Mode updated. Click canvas, then press keys.', true);
  entity.draw();
  updateDebug();
}

function updateDebug(){
  dbgLastKey.textContent = lastKey;
  dbgPos.textContent = `(x=${Math.round(entity.position?.x ?? 0)}, y=${Math.round(entity.position?.y ?? 0)})`;
  dbgVel.textContent = `(x=${Math.round(entity.velocity?.x ?? 0)}, y=${Math.round(entity.velocity?.y ?? 0)})`;
}

function updateCheckpoints(){
  // A: they switched modes at least once
  if (switchedModesOnce){
    checkA.classList.add('pass');
    checkAStatus.textContent = 'pass';
  } else {
    checkA.classList.remove('pass');
    checkAStatus.textContent = 'pending';
  }

  // B: moved using input at least once (only counts if Player + input on)
  if (movedWithInputOnce){
    checkB.classList.add('pass');
    checkBStatus.textContent = 'pass';
  } else {
    checkB.classList.remove('pass');
    checkBStatus.textContent = 'pending';
  }

  const score = (switchedModesOnce?1:0) + (movedWithInputOnce?1:0);
  checkChip.textContent = `${score}/2`;
}

/* Loop */
function tick(){
  entity.update?.();
  entity.draw?.();
  updateDebug();
  requestAnimationFrame(tick);
}

/** ---------------------------
 * Live Code Renderer (Lesson 1)
 * Focus: architecture boundary
 * ---------------------------
 */
function line(field, html, cls=''){
  return `<div class="code-line ${cls}" data-field="${field||''}">${html}</div>`;
}

function renderLessonCode(characterOnly, inputOn){
  const L = [];
  const isPlayer = !characterOnly;

  // soft highlight: “system boundary”
  const focusCls = (f) => `soft${(f==='extends' || f==='constructor' || f==='listeners') ? '' : ''}`;

  L.push(line(null, `<span class="tok-com">// Lesson 1: Player is a system that extends Character</span>`));
  L.push(line('extends',
    `<span class="tok-kw">class</span> <span class="tok-id">Player</span> <span class="tok-kw">extends</span> <span class="tok-id">Character</span> <span class="tok-sym">{</span>`,
    isPlayer ? 'focus' : 'soft'
  ));
  L.push(line(null, `  <span class="tok-com">// Character handles draw/update; Player adds input intent</span>`));
  L.push(line('constructor',
    `  <span class="tok-kw">constructor</span><span class="tok-sym">(</span><span class="tok-id">data</span><span class="tok-sym">=</span><span class="tok-kw">null</span><span class="tok-sym">)</span> <span class="tok-sym">{</span>`,
    isPlayer ? 'soft' : ''
  ));
  L.push(line('constructor',
    `    <span class="tok-kw">super</span><span class="tok-sym">(</span><span class="tok-id">data</span><span class="tok-sym">)</span><span class="tok-sym">;</span> <span class="tok-com">// keep engine behavior</span>`,
    isPlayer ? 'soft' : ''
  ));
  L.push(line('constructor',
    `    <span class="tok-id">this</span><span class="tok-sym">.</span><span class="tok-id">keypress</span> <span class="tok-sym">=</span> <span class="tok-sym">{</span> <span class="tok-id">up</span><span class="tok-sym">:</span> <span class="tok-num">87</span><span class="tok-sym">,</span> <span class="tok-id">left</span><span class="tok-sym">:</span> <span class="tok-num">65</span><span class="tok-sym">,</span> <span class="tok-id">down</span><span class="tok-sym">:</span> <span class="tok-num">83</span><span class="tok-sym">,</span> <span class="tok-id">right</span><span class="tok-sym">:</span> <span class="tok-num">68</span> <span class="tok-sym">}</span><span class="tok-sym">;</span>`,
    isPlayer ? 'soft' : ''
  ));
  L.push(line('constructor',
    `    <span class="tok-id">this</span><span class="tok-sym">.</span><span class="tok-id">pressedKeys</span> <span class="tok-sym">=</span> <span class="tok-sym">{}</span><span class="tok-sym">;</span>`,
    isPlayer ? 'soft' : ''
  ));
  L.push(line('listeners',
    `    <span class="tok-id">this</span><span class="tok-sym">.</span><span class="tok-id">bindMovementKeyListners</span><span class="tok-sym">(</span><span class="tok-sym">)</span><span class="tok-sym">;</span>`,
    isPlayer ? 'focus' : ''
  ));
  L.push(line(null, `  <span class="tok-sym">}</span>`));
  L.push(line(null, ``));
  L.push(line('listeners',
    `  <span class="tok-id">bindMovementKeyListners</span><span class="tok-sym">(</span><span class="tok-sym">)</span> <span class="tok-sym">{</span>`,
    isPlayer ? 'soft' : ''
  ));
  L.push(line('listeners',
    `    <span class="tok-id">addEventListener</span><span class="tok-sym">(</span><span class="tok-str">'keydown'</span><span class="tok-sym">,</span> <span class="tok-id">this</span><span class="tok-sym">.</span><span class="tok-id">handleKeyDown</span><span class="tok-sym">.</span><span class="tok-id">bind</span><span class="tok-sym">(</span><span class="tok-id">this</span><span class="tok-sym">)</span><span class="tok-sym">)</span><span class="tok-sym">;</span>`,
    isPlayer ? 'soft' : ''
  ));
  L.push(line('listeners',
    `    <span class="tok-id">addEventListener</span><span class="tok-sym">(</span><span class="tok-str">'keyup'</span><span class="tok-sym">,</span> <span class="tok-id">this</span><span class="tok-sym">.</span><span class="tok-id">handleKeyUp</span><span class="tok-sym">.</span><span class="tok-id">bind</span><span class="tok-sym">(</span><span class="tok-id">this</span><span class="tok-sym">)</span><span class="tok-sym">)</span><span class="tok-sym">;</span>`,
    isPlayer ? 'soft' : ''
  ));
  L.push(line(null, `  <span class="tok-sym">}</span>`));
  L.push(line(null, `<span class="tok-sym">}</span>`));

  // add a tiny “state” line that mirrors UI
  L.push(line(null, ``));
  L.push(line(null,
    `<span class="tok-com">// Live state</span> <span class="tok-id">mode</span><span class="tok-sym">:</span> <span class="tok-str">'${escapeHtml(isPlayer ? 'Player' : 'Character')}'</span><span class="tok-sym">,</span> <span class="tok-id">input</span><span class="tok-sym">:</span> <span class="tok-str">'${escapeHtml(isPlayer && inputOn ? 'on' : 'off')}'</span>`
  ));

  codeEl.innerHTML = L.join('');
  codeChip.textContent = 'Focus: architecture';
}

/* “Show Lesson Focus” pulse */
function pulseFocus(){
  const targets = codeEl.querySelectorAll('.code-line[data-field="extends"], .code-line[data-field="listeners"]');
  targets.forEach(el => {
    el.classList.add('focus');
    setTimeout(() => el.classList.remove('focus'), 900);
    el.scrollIntoView({ block:'nearest', behavior:'smooth' });
  });
}

/* Event wiring */
toggleCharacterOnly.addEventListener('change', () => {
  // If you switch to Character-only, force input off (because there is no Player)
  if (toggleCharacterOnly.checked) toggleInput.checked = false;
  setMode();
});
toggleInput.addEventListener('change', () => {
  // If they enable input, force Player mode
  if (toggleInput.checked) toggleCharacterOnly.checked = false;
  setMode();
});

pulseFocusBtn.addEventListener('click', pulseFocus);
resetBtn.addEventListener('click', () => {
  switchedModesOnce = false;
  movedWithInputOnce = false;
  lastKey = '(none)';
  toggleCharacterOnly.checked = true;
  toggleInput.checked = false;
  setMode();
  updateCheckpoints();
  showMsg('Reset complete. Try toggling Player mode, then enable input.', true);
});

canvas.addEventListener('click', () => canvas.focus());

/* Detect movement for checkpoint B */
addEventListener('keydown', (e) => {
  // checkpoint only counts when Player mode + input enabled
  const playerMode = !toggleCharacterOnly.checked;
  const inputOn = toggleInput.checked;
  if (!playerMode || !inputOn) return;

  // consider a move key press as “success” once it causes velocity change
  const before = `${entity.velocity.x},${entity.velocity.y}`;
  // let Player handle, then check after a tiny delay
  setTimeout(() => {
    const after = `${entity.velocity.x},${entity.velocity.y}`;
    if (before !== after && after !== '0,0'){
      movedWithInputOnce = true;
      updateCheckpoints();
    }
  }, 0);
});

/* Init */
setMode();
tick();
</script>
