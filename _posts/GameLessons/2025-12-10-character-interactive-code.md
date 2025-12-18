---
layout: post
title: Character Code Interaction
permalink: /character-code-interaction/
---

<style>
.panel {
  background: transparent;
  border: 2px solid #ffffff;
  padding: 12px;
  margin: 12px 0;
  border-radius: 6px;
}

.panel-canvas {
  display: flex;
  justify-content: center;
  align-items: center;
}

.canvas-bordered {
  box-sizing: border-box;
  border: 4px solid #ffffff;
  border-radius: 6px;
  background: #f6f9fb;
  max-width: 100%;
}

.controls { display:flex; gap:12px; align-items:flex-end; flex-wrap:wrap; }
.controls label { display:flex; flex-direction:column; font-size:13px; }
.controls input[type="text"] { width:96px; padding:6px 8px; border-radius:6px; border:1px solid rgba(0,0,0,0.08); }

.snippet {
  background:#0b1321;
  color:#dbeafe;
  padding:12px;
  border-radius:6px;
  font-family:monospace;
  white-space:pre;
  overflow:auto;
  max-height:300px;
}

.hint { font-size:13px; color:inherit; }
.current-display { margin-left:8px; font-size:13px; color:inherit; }

/* two-column layout */
.layout {
  display: grid;
  grid-template-columns: minmax(360px, 1fr) minmax(340px, 1fr);
  gap: 16px;
  align-items: start;
}

.left-col .panel { margin-top: 0; }
.right-col .panel { margin-top: 0; }

/* responsive canvas */
#game { width: 100%; height: auto; }

@media (max-width: 900px) {
  .layout { grid-template-columns: 1fr; }
}

@media (prefers-color-scheme: dark) {
  .panel, .canvas-bordered { box-shadow:0 1px 2px rgba(0,0,0,0.4); }
}
</style>

<div class="layout">
  <!-- LEFT: Canvas + Live Code Snippet BELOW it -->
  <div class="left-col">
    <div class="panel panel-canvas">
      <canvas id="game" width="800" height="320" class="canvas-bordered" tabindex="0" aria-label="Movement demo canvas (click to focus)"></canvas>
    </div>

    <div class="panel">
      <div class="hint"><strong>Live Code Snippet</strong> (matches current settings)</div>
      <pre id="code" class="snippet" aria-live="polite"></pre>
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

  function updateCodeSnippet() {
    codeEl.textContent = `// Live settings
let STEP = ${STEP};                 // velocity per key press
let color = '${block.color}';       // character color

// Key mapping (live)
const keys = {
  up: '${userKeys.up}',
  left: '${userKeys.left}',
  down: '${userKeys.down}',
  right: '${userKeys.right}'
};

function buildKeyMap(keys) {
  const m = {
    ArrowUp: 'up',
    ArrowLeft: 'left',
    ArrowDown: 'down',
    ArrowRight: 'right'
  };
  for (const dir of ['up','left','down','right']) {
    const val = (keys[dir] || '').trim();
    if (!val) continue;
    if (val.length === 1) m[val.toLowerCase()] = dir;
    else m[val] = dir;
  }
  return m;
}

const keyToDir = buildKeyMap(keys);

window.addEventListener('keydown', (e) => {
  const k = e.key;
  const dir = keyToDir[k] || keyToDir[k.toLowerCase()];
  if (dir) move(dir);
});`;
  }

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
