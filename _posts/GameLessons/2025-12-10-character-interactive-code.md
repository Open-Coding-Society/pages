---
layout: post
title: Character Code Interaction
permalink: /character-code-interaction/
---

<style>

.layout{
  display:grid;
  grid-template-columns:minmax(360px,1fr) minmax(340px,1fr);
  gap:18px;
  align-items:start;
}

@media (max-width: 900px){
  .layout{ grid-template-columns:1fr; }
}

.panel{
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 14px;
  margin: 0;
  box-shadow: 0 10px 30px rgba(0,0,0,0.22);
  backdrop-filter: blur(8px);
}

.left-col, .right-col{
  display:flex;
  flex-direction:column;
  gap:14px;
}

/* Canvas container looks like a product surface */
.panel-canvas{
  padding: 14px;
}

.canvas-shell{
  border-radius: calc(var(--radius) - 2px);
  border: 1px solid var(--border-strong);
  background: rgba(255,255,255,0.02);
  padding: 12px;
}

.canvas-bordered{
  border: 1px solid rgba(0,0,0,0.06);
  border-radius: var(--radius-sm);
  background: #f6f9fb;
  width: 100%;
  height: auto;
  display:block;
}

/* Titles / labels */
.hint{
  font-size: 13px;
  line-height: 1.35;
  color: var(--muted);
}

.hint strong{
  color: var(--text);
  font-weight: 600;
}

.current-display{
  font-size: 13px;
  color: var(--muted2);
}

/* Controls */
.controls{
  display:grid;
  grid-template-columns: repeat(2, minmax(0,1fr));
  gap:12px;
  align-items:end;
  margin-top: 10px;
}

@media (max-width: 1100px){
  .controls{ grid-template-columns: 1fr; }
}

.controls label{
  display:flex;
  flex-direction:column;
  gap:6px;
  font-size: 12px;
  color: var(--muted);
}

.controls input[type="text"]{
  width: 100%;
  padding: 10px 10px;
  border-radius: 12px;
  border: 1px solid var(--border);
  background: rgba(0,0,0,0.18);
  color: var(--text);
  outline: none;
}

.controls input[type="text"]:focus{
  border-color: rgba(34,197,94,0.55);
  box-shadow: 0 0 0 4px rgba(34,197,94,0.12);
}

.controls input[type="range"]{
  width: 100%;
}

.controls input[type="color"]{
  height: 42px;
  padding: 6px;
  border-radius: 12px;
  border: 1px solid var(--border);
  background: rgba(0,0,0,0.18);
}

.btn-row{
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

/* Editor-like blocks (upgraded) */
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
  max-height: 320px;sdsd
}

/* Make code feel like an editor: line numbers + per-line highlighting */
.code{
  margin: 0;
  counter-reset: ln;
}

.code-line{
  position: relative;
  padding: 2px 10px 2px 54px; /* room for line number */
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

.code-line:hover{
  background: rgba(255,255,255,0.04);
}

.code-line.active{
  background: rgba(34,197,94,0.22);            /* stronger */
  outline: 2px solid rgba(34,197,94,0.55);     /* stronger */
  box-shadow: 0 0 0 6px rgba(34,197,94,0.12);  /* stronger */
}

/* Token styling */
.tok-com { color: rgba(255,255,255,0.55); }
.tok-kw  { color: rgba(147,197,253,0.95); } /* soft blue */
.tok-id  { color: rgba(255,255,255,0.92); }
.tok-num { color: rgba(253,230,138,0.95); }
.tok-str { color: rgba(134,239,172,0.95); } /* green-ish */
.tok-sym { color: rgba(255,255,255,0.72); }

/* Control focus -> also subtly “selected” */
.controls label.is-editing{
  border-radius: 14px;
  padding: 8px;
  background: rgba(34,197,94,0.10);
  outline: 1px solid rgba(34,197,94,0.22);
}

/* Optional: tiny header row style for each panel */
.panel-title{
  display:flex;
  align-items:center;
  justify-content:space-between;
  gap:10px;
  margin-bottom:10px;
}
.panel-title .hint{ margin:0; }
.chip{
  font-size: 11px;
  padding: 4px 8px;
  border-radius: 999px;
  border: 1px solid rgba(255,255,255,0.12);
  background: rgba(255,255,255,0.06);
  color: rgba(255,255,255,0.78);
}

/* Small “status” text */
#msg{
  margin-top:10px;
  color: var(--muted2);
}

/* Optional: reduce the “all-white outline” feel */
@media (prefers-color-scheme: dark){
  .panel{
    box-shadow: 0 18px 50px rgba(0,0,0,0.35);
  }
}
</style>


<div class="layout">
  <!-- LEFT: Canvas + Live Code Snippet BELOW it -->
  <div class="left-col">
    <div class="panel panel-canvas">
      <canvas id="game" width="800" height="320" class="canvas-bordered" tabindex="0" aria-label="Movement demo canvas (click to focus)"></canvas>
    </div>

    <div class="panel">
      <div class="panel-title">
        <div class="hint"><strong>Live Code</strong> (highlights what you’re editing)</div>
        <div class="chip" id="edit-chip">Editing: none</div>
      </div>

      <pre class="snippet" aria-live="polite"><code id="code" class="code"></code></pre>
    </div>
  </div>

  <!-- RIGHT: Controls + Live Debug -->
  <div class="right-col">
    <div class="panel">
      <div class="hint">
        Controls (auto-apply). Tip: click the canvas first, then press keys.
      </div>

      <div class="controls">
        <label>Up
          <input id="key-up" type="text" maxlength="16" value="w" />
        </label>
        <label>Left
          <input id="key-left" type="text" maxlength="16" value="a" />
        </label>
        <label>Down
          <input id="key-down" type="text" maxlength="16" value="s" />
        </label>
        <label>Right
          <input id="key-right" type="text" maxlength="16" value="d" />
        </label>

        <label>Velocity
          <input id="vel" type="range" min="1" max="24" value="8" />
        </label>
        <div class="current-display">Speed: <span id="vel-display"></span></div>

        <label>Color
          <input id="color" type="color" value="#0b6b4f" />
        </label>
        <div class="current-display">Hex: <span id="color-display"></span></div>

        <button id="reset" style="padding:8px 12px;border-radius:6px;border:none;background:#334155;color:#fff;cursor:pointer;">
          Reset
        </button>

        <div class="current-display">Current: <span id="current-mapping"></span></div>
      </div>

      <div class="hint" id="msg" style="margin-top:8px;"></div>
    </div>

    <div class="panel">
      <div class="hint"><strong>Live Debug</strong> — what the program thinks is happening.</div>
      <pre id="debug" class="snippet" aria-live="polite"></pre>
    </div>
  </div>
</div>

<script>
  const canvas = document.getElementById('game');
  const ctx = canvas.getContext('2d');

  const block = {
    x: canvas.width / 2 - 20,
    y: canvas.height / 2 - 20,
    size: 40,
    color: '#0b6b4f'
  };

  let STEP = 8;
  let userKeys = { up: 'w', left: 'a', down: 's', right: 'd' };
  let keyToDir = buildKeyMap(userKeys);

  const upInput = document.getElementById('key-up');
  const leftInput = document.getElementById('key-left');
  const downInput = document.getElementById('key-down');
  const rightInput = document.getElementById('key-right');

  const velInput = document.getElementById('vel');
  const velDisplay = document.getElementById('vel-display');

  const colorInput = document.getElementById('color');
  const colorDisplay = document.getElementById('color-display');

  const resetBtn = document.getElementById('reset');
  const currentSpan = document.getElementById('current-mapping');
  const codeEl = document.getElementById('code');
  const debugEl = document.getElementById('debug');
  const msgEl = document.getElementById('msg');

  let lastKey = '(none)';
  let lastDir = '(none)';

  function normalizeToken(token) { return (token || '').trim(); }

  function buildKeyMap(user) {
    const m = {
      ArrowUp: 'up',
      ArrowLeft: 'left',
      ArrowDown: 'down',
      ArrowRight: 'right'
    };
    for (const dir of ['up','left','down','right']) {
      const val = normalizeToken(user[dir]);
      if (!val) continue;
      if (val.length === 1) m[val.toLowerCase()] = dir;
      else m[val] = dir;
    }
    return m;
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = block.color;
    ctx.fillRect(block.x, block.y, block.size, block.size);
  }

  function move(direction) {
    if (direction === 'up') block.y = Math.max(0, block.y - STEP);
    if (direction === 'down') block.y = Math.min(canvas.height - block.size, block.y + STEP);
    if (direction === 'left') block.x = Math.max(0, block.x - STEP);
    if (direction === 'right') block.x = Math.min(canvas.width - block.size, block.x + STEP);
    draw();
    updateDebug();
  }

  function updateCurrentDisplay() {
    currentSpan.textContent =
      `Up: ${userKeys.up} · Left: ${userKeys.left} · Down: ${userKeys.down} · Right: ${userKeys.right}`;
  }

  function updateVelocityDisplay() { velDisplay.textContent = STEP; }
  function updateColorDisplay() { colorDisplay.textContent = block.color; }

  function formatMappingForDebug() {
    return Object.entries(keyToDir)
      .sort((a,b) => a[0].localeCompare(b[0]))
      .map(([k,v]) => `${k} → ${v}`)
      .join('\n');
  }

  function updateDebug() {
    debugEl.textContent =
`Last key pressed: ${lastKey}
Direction chosen: ${lastDir}

Block position: (x=${Math.round(block.x)}, y=${Math.round(block.y)})
Velocity (STEP): ${STEP}
Color: ${block.color}

Active mapping table:
${formatMappingForDebug()}`;
  }

  function showMsg(text, ok = true) {
    msgEl.textContent = text;
    msgEl.style.opacity = '1';
    msgEl.style.color = ok ? 'inherit' : '#ffb4b4';
  }

  function hasDuplicates(keysObj) {
    const seen = new Set();
    for (const dir of ['up','left','down','right']) {
      const v = normalizeToken(keysObj[dir]);
      if (!v) continue;
      const norm = (v.length === 1) ? v.toLowerCase() : v;
      if (seen.has(norm)) return true;
      seen.add(norm);
    }
    return false;
  }

  const editChip = document.getElementById('edit-chip');

  function escapeHtml(s){
    return String(s)
      .replaceAll('&','&amp;')
      .replaceAll('<','&lt;')
      .replaceAll('>','&gt;')
      .replaceAll('"','&quot;')
      .replaceAll("'","&#39;");
  }

  /** field keys we’ll highlight: up,left,down,right,vel,color */
  let activeField = null;

  function setActiveField(field){
    activeField = field || null;

    // chip text
    editChip.textContent = `Editing: ${activeField || 'none'}`;

    // highlight code lines
    const lines = codeEl.querySelectorAll('.code-line');
    lines.forEach(l => l.classList.toggle('active', l.dataset.field === activeField));

    // highlight the control label
    document.querySelectorAll('.controls label').forEach(l => l.classList.remove('is-editing'));
    const label = document.querySelector(`.controls label[data-field="${activeField}"]`);
    if (label) label.classList.add('is-editing');

    // scroll the first active line into view if it exists
    const first = codeEl.querySelector(`.code-line[data-field="${activeField}"]`);
    if (first) first.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }

  /* Add data-field to your labels once (easy + robust) */
  function wireLabelFields(){
    const map = [
      ['key-up','up'],
      ['key-left','left'],
      ['key-down','down'],
      ['key-right','right'],
      ['vel','vel'],
      ['color','color']
    ];
    for (const [id, field] of map){
      const input = document.getElementById(id);
      const label = input?.closest('label');
      if (label) label.dataset.field = field;
    }
  }
  wireLabelFields();

  /* Editor-rendered snippet with line-level metadata */
  function updateCodeSnippet(){
    const kUp = escapeHtml(userKeys.up);
    const kLeft = escapeHtml(userKeys.left);
    const kDown = escapeHtml(userKeys.down);
    const kRight = escapeHtml(userKeys.right);
    const col = escapeHtml(block.color);
    const step = escapeHtml(STEP);

    const L = [];
    const push = (field, html) => L.push(
      `<div class="code-line" data-field="${field || ''}">${html}</div>`
    );

    push(null, `<span class="tok-com">// Live settings</span>`);
    push('vel', `<span class="tok-kw">let</span> <span class="tok-id">STEP</span> <span class="tok-sym">=</span> <span class="tok-num">${step}</span><span class="tok-sym">;</span> <span class="tok-com">// velocity per key press</span>`);
    push('color', `<span class="tok-kw">let</span> <span class="tok-id">color</span> <span class="tok-sym">=</span> <span class="tok-str">'${col}'</span><span class="tok-sym">;</span> <span class="tok-com">// character color</span>`);
    push(null, ``);
    push(null, `<span class="tok-com">// Key mapping (live)</span>`);
    push(null, `<span class="tok-kw">const</span> <span class="tok-id">keys</span> <span class="tok-sym">=</span> <span class="tok-sym">{</span>`);
    push('up',    `<span class="tok-id">up</span><span class="tok-sym">:</span> <span class="tok-str">'${kUp}'</span><span class="tok-sym">,</span>`);
    push('left',  `<span class="tok-id">left</span><span class="tok-sym">:</span> <span class="tok-str">'${kLeft}'</span><span class="tok-sym">,</span>`);
    push('down',  `<span class="tok-id">down</span><span class="tok-sym">:</span> <span class="tok-str">'${kDown}'</span><span class="tok-sym">,</span>`);
    push('right', `<span class="tok-id">right</span><span class="tok-sym">:</span> <span class="tok-str">'${kRight}'</span>`);
    push(null, `<span class="tok-sym">}</span><span class="tok-sym">;</span>`);
    push(null, ``);

    push(null,
`<span class="tok-kw">function</span> <span class="tok-id">buildKeyMap</span><span class="tok-sym">(</span><span class="tok-id">keys</span><span class="tok-sym">)</span> <span class="tok-sym">{</span>`);
    push(null, `  <span class="tok-kw">const</span> <span class="tok-id">m</span> <span class="tok-sym">=</span> <span class="tok-sym">{</span> <span class="tok-com">/* arrows always work */</span>`);
    push(null, `    <span class="tok-id">ArrowUp</span><span class="tok-sym">:</span> <span class="tok-str">'up'</span><span class="tok-sym">,</span> <span class="tok-id">ArrowLeft</span><span class="tok-sym">:</span> <span class="tok-str">'left'</span><span class="tok-sym">,</span> <span class="tok-id">ArrowDown</span><span class="tok-sym">:</span> <span class="tok-str">'down'</span><span class="tok-sym">,</span> <span class="tok-id">ArrowRight</span><span class="tok-sym">:</span> <span class="tok-str">'right'</span>`);
    push(null, `  <span class="tok-sym">}</span><span class="tok-sym">;</span>`);
    push(null, `  <span class="tok-kw">for</span> <span class="tok-sym">(</span><span class="tok-kw">const</span> <span class="tok-id">dir</span> <span class="tok-kw">of</span> <span class="tok-sym">[</span><span class="tok-str">'up'</span><span class="tok-sym">,</span><span class="tok-str">'left'</span><span class="tok-sym">,</span><span class="tok-str">'down'</span><span class="tok-sym">,</span><span class="tok-str">'right'</span><span class="tok-sym">]</span><span class="tok-sym">)</span> <span class="tok-sym">{</span>`);
    push(null, `    <span class="tok-kw">const</span> <span class="tok-id">val</span> <span class="tok-sym">=</span> <span class="tok-sym">(</span><span class="tok-id">keys</span><span class="tok-sym">[</span><span class="tok-id">dir</span><span class="tok-sym">]</span> <span class="tok-sym">||</span> <span class="tok-str">''</span><span class="tok-sym">)</span><span class="tok-sym">.</span><span class="tok-id">trim</span><span class="tok-sym">(</span><span class="tok-sym">)</span><span class="tok-sym">;</span>`);
    push(null, `    <span class="tok-kw">if</span> <span class="tok-sym">(</span><span class="tok-sym">!</span><span class="tok-id">val</span><span class="tok-sym">)</span> <span class="tok-kw">continue</span><span class="tok-sym">;</span>`);
    push(null, `    <span class="tok-kw">if</span> <span class="tok-sym">(</span><span class="tok-id">val</span><span class="tok-sym">.</span><span class="tok-id">length</span> <span class="tok-sym">===</span> <span class="tok-num">1</span><span class="tok-sym">)</span> <span class="tok-id">m</span><span class="tok-sym">[</span><span class="tok-id">val</span><span class="tok-sym">.</span><span class="tok-id">toLowerCase</span><span class="tok-sym">(</span><span class="tok-sym">)</span><span class="tok-sym">]</span> <span class="tok-sym">=</span> <span class="tok-id">dir</span><span class="tok-sym">;</span>`);
    push(null, `    <span class="tok-kw">else</span> <span class="tok-id">m</span><span class="tok-sym">[</span><span class="tok-id">val</span><span class="tok-sym">]</span> <span class="tok-sym">=</span> <span class="tok-id">dir</span><span class="tok-sym">;</span>`);
    push(null, `  <span class="tok-sym">}</span>`);
    push(null, `  <span class="tok-kw">return</span> <span class="tok-id">m</span><span class="tok-sym">;</span>`);
    push(null, `<span class="tok-sym">}</span>`);
    push(null, ``);

    push(null, `<span class="tok-kw">const</span> <span class="tok-id">keyToDir</span> <span class="tok-sym">=</span> <span class="tok-id">buildKeyMap</span><span class="tok-sym">(</span><span class="tok-id">keys</span><span class="tok-sym">)</span><span class="tok-sym">;</span>`);
    push(null, ``);
    push(null, `<span class="tok-id">window</span><span class="tok-sym">.</span><span class="tok-id">addEventListener</span><span class="tok-sym">(</span><span class="tok-str">'keydown'</span><span class="tok-sym">,</span> <span class="tok-sym">(</span><span class="tok-id">e</span><span class="tok-sym">)</span> <span class="tok-sym">=&gt;</span> <span class="tok-sym">{</span>`);
    push(null, `  <span class="tok-kw">const</span> <span class="tok-id">k</span> <span class="tok-sym">=</span> <span class="tok-id">e</span><span class="tok-sym">.</span><span class="tok-id">key</span><span class="tok-sym">;</span>`);
    push(null, `  <span class="tok-kw">const</span> <span class="tok-id">dir</span> <span class="tok-sym">=</span> <span class="tok-id">keyToDir</span><span class="tok-sym">[</span><span class="tok-id">k</span><span class="tok-sym">]</span> <span class="tok-sym">||</span> <span class="tok-id">keyToDir</span><span class="tok-sym">[</span><span class="tok-id">k</span><span class="tok-sym">.</span><span class="tok-id">toLowerCase</span><span class="tok-sym">(</span><span class="tok-sym">)</span><span class="tok-sym">]</span><span class="tok-sym">;</span>`);
    push(null, `  <span class="tok-kw">if</span> <span class="tok-sym">(</span><span class="tok-id">dir</span><span class="tok-sym">)</span> <span class="tok-id">move</span><span class="tok-sym">(</span><span class="tok-id">dir</span><span class="tok-sym">)</span><span class="tok-sym">;</span>`);
    push(null, `<span class="tok-sym">}</span><span class="tok-sym">)</span><span class="tok-sym">;</span>`);

    codeEl.innerHTML = L.join('');
    setActiveField(activeField); // re-apply highlight after rerender
  }

  /* Hook focus/input so we know what the user is editing */
  function addFieldListeners(el, field){
    el.addEventListener('focus', () => setActiveField(field));
    el.addEventListener('input', () => setActiveField(field));
    el.addEventListener('blur', () => setTimeout(() => setActiveField(null), 600)); // linger
  }

  addFieldListeners(upInput, 'up');
  addFieldListeners(leftInput, 'left');
  addFieldListeners(downInput, 'down');
  addFieldListeners(rightInput, 'right');
  addFieldListeners(velInput, 'vel');
  addFieldListeners(colorInput, 'color');

  function applyFromUI() {
    const nextKeys = {
      up: normalizeToken(upInput.value),
      left: normalizeToken(leftInput.value),
      down: normalizeToken(downInput.value),
      right: normalizeToken(rightInput.value)
    };

    STEP = Number(velInput.value);
    block.color = colorInput.value;

    if (hasDuplicates(nextKeys)) {
      showMsg('Duplicate keys detected. Give each direction a unique key.', false);
      updateVelocityDisplay();
      updateColorDisplay();
      updateCodeSnippet();
      updateDebug();
      draw();
      return;
    }

    userKeys = nextKeys;
    keyToDir = buildKeyMap(userKeys);

    updateCurrentDisplay();
    updateVelocityDisplay();
    updateColorDisplay();
    updateCodeSnippet();
    updateDebug();
    draw();
    showMsg('Live update applied.', true);
  }

  window.addEventListener('keydown', (e) => {
    lastKey = e.key;
    const k = e.key;
    const dir = keyToDir[k] || keyToDir[k.toLowerCase()];
    lastDir = dir || '(none)';
    if (dir) { e.preventDefault(); move(dir); }
    else { updateDebug(); }
  });

  [upInput, leftInput, downInput, rightInput].forEach(el => el.addEventListener('input', applyFromUI));
  velInput.addEventListener('input', applyFromUI);
  colorInput.addEventListener('input', applyFromUI);

  resetBtn.addEventListener('click', () => {
    block.x = canvas.width / 2 - block.size / 2;
    block.y = canvas.height / 2 - block.size / 2;
    lastKey = '(none)';
    lastDir = '(none)';
    draw();
    updateDebug();
    showMsg('Reset position.', true);
  });

  applyFromUI();
  showMsg('Click the canvas, then press keys. Everything updates automatically.', true);
</script>
