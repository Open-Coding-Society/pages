import { getTilemap } from '../../tilemaps/index.js';
import { compile } from './PseudocodeExecutor.js';

// Canvas dimensions
const CELL = 64;
const PAD  = 16;
const GRID = 7;
const SIZE = CELL * GRID + PAD * 2;

const EMPTY_GRID = Array.from({ length: GRID }, () => Array(GRID).fill(0));

// Direction vectors: 0=up, 1=right, 2=down, 3=left
const DIR_DELTA = [
  { dr: -1, dc:  0 },
  { dr:  0, dc:  1 },
  { dr:  1, dc:  0 },
  { dr:  0, dc: -1 },
];
const DIR_NAMES = ['up', 'right', 'down', 'left'];

function cloneGrid(g) { return g.map(r => [...r]); }

function parseSource(src) {
  let tilemapId = null;
  let spawnCol = null, spawnRow = null;
  let goalCol  = null, goalRow  = null;
  const codeLines = [];

  for (const raw of src.split('\n')) {
    const line = raw.trim();

    const mMap = line.match(/^FROM\s+TILEMAPS\s+IMPORT\s+(\d+)$/);
    if (mMap) { tilemapId = parseInt(mMap[1], 10); continue; }

    const mSpawn = line.match(/^SPAWN\s+CHARACTER\s+AT\s*\(\s*(\d+)\s*,\s*(\d+)\s*\)$/);
    if (mSpawn) { spawnCol = parseInt(mSpawn[1], 10) - 1; spawnRow = parseInt(mSpawn[2], 10) - 1; continue; }

    const mGoal = line.match(/^SPAWN\s+GOAL\s+AT\s*\(\s*(\d+)\s*,\s*(\d+)\s*\)$/);
    if (mGoal) { goalCol = parseInt(mGoal[1], 10) - 1; goalRow = parseInt(mGoal[2], 10) - 1; continue; }

    codeLines.push(raw);
  }

  return { tilemapId, spawnCol, spawnRow, goalCol, goalRow, pseudoSrc: codeLines.join('\n') };
}

function simulate(pseudoSrc, initialGrid, startCol, startRow) {
  let col = startCol, row = startRow, dir = 0;
  let grid = cloneGrid(initialGrid);

  // Each frame snapshots the grid so RENDER changes are reflected correctly during animation
  const frames = [{ col, row, dir, error: null, grid: cloneGrid(grid) }];
  let steps = 0;

  const RENDER = (matrix) => {
    if (!Array.isArray(matrix) || matrix.length !== GRID)
      throw new Error(`AP CSP Robot Error: RENDER requires a ${GRID}×${GRID} matrix (got ${Array.isArray(matrix) ? matrix.length : typeof matrix} rows)`);
    for (let ri = 0; ri < matrix.length; ri++) {
      const r = matrix[ri];
      if (!Array.isArray(r) || r.length !== GRID)
        throw new Error(`AP CSP Robot Error: RENDER row ${ri + 1} must have ${GRID} cells`);
    }
    grid = cloneGrid(matrix);
    frames.push({ col, row, dir, error: null, grid: cloneGrid(grid) });
  };

  const MOVE_FORWARD = () => {
    const { dr, dc } = DIR_DELTA[dir];
    const nr = row + dr, nc = col + dc;
    if (nr < 0 || nr >= GRID || nc < 0 || nc >= GRID || grid[nr][nc] === 1)
      throw new Error('AP CSP Robot Error: MOVE_FORWARD into a wall or boundary');
    row = nr; col = nc;
    frames.push({ col, row, dir, error: null, grid: cloneGrid(grid) });
  };

  const ROTATE_LEFT = () => {
    dir = (dir + 3) % 4;
    frames.push({ col, row, dir, error: null, grid: cloneGrid(grid) });
  };

  const ROTATE_RIGHT = () => {
    dir = (dir + 1) % 4;
    frames.push({ col, row, dir, error: null, grid: cloneGrid(grid) });
  };

  const CAN_MOVE = (dirName) => {
    const rel = String(dirName).toLowerCase();
    let d;
    if      (rel === 'forward')  d = dir;
    else if (rel === 'backward') d = (dir + 2) % 4;
    else if (rel === 'left')     d = (dir + 3) % 4;
    else if (rel === 'right')    d = (dir + 1) % 4;
    else throw new Error(`AP CSP Robot Error: CAN_MOVE got unknown direction "${dirName}" — use "forward", "backward", "left", or "right"`);
    const { dr, dc } = DIR_DELTA[d];
    const nr = row + dr, nc = col + dc;
    return !(nr < 0 || nr >= GRID || nc < 0 || nc >= GRID || grid[nr][nc] === 1);
  };

  const __out  = () => {};
  const __inp  = () => '';
  const __step = () => {
    if (++steps > 10000) throw new Error('AP CSP Robot Error: Possible infinite loop (exceeded 10k steps)');
  };
  const __add = (a, b) => (typeof a === 'number' && typeof b === 'number') ? a + b : String(a) + String(b);
  const __cmp = (a, op, b) => {
    if (op === '=') return a === b;
    if (op === '≠') return a !== b;
    if (typeof a !== 'number' || typeof b !== 'number')
      throw new Error('AP CSP Runtime Error: Cannot use "' + op + '" to compare non-numeric values');
    if (op === '>') return a > b;
    if (op === '<') return a < b;
    if (op === '≥') return a >= b;
    return a <= b;
  };

  const code = compile(pseudoSrc.trim());
  try {
    new Function(
      '__out','__inp','__step','__add','__cmp',
      'MOVE_FORWARD','ROTATE_LEFT','ROTATE_RIGHT','CAN_MOVE','RENDER',
      code
    )(__out, __inp, __step, __add, __cmp, MOVE_FORWARD, ROTATE_LEFT, ROTATE_RIGHT, CAN_MOVE, RENDER);
  } catch(e) {
    frames.push({ col, row, dir, error: e.message, grid: cloneGrid(grid) });
  }

  return frames;
}

// grid is now read from frame.grid instead of passed separately
function drawFrame(ctx, frame, goal = null) {
  const grid = frame.grid;
  ctx.clearRect(0, 0, SIZE, SIZE);

  ctx.fillStyle = '#1e1e2e';
  ctx.fillRect(0, 0, SIZE, SIZE);

  for (let r = 0; r < GRID; r++) {
    for (let c = 0; c < GRID; c++) {
      const x = PAD + c * CELL;
      const y = PAD + r * CELL;
      ctx.fillStyle = grid[r][c] === 1 ? '#45475a' : '#313244';
      ctx.fillRect(x + 2, y + 2, CELL - 4, CELL - 4);

      if (grid[r][c] === 1) {
        ctx.fillStyle = '#585b70';
        ctx.fillRect(x + 6, y + 6, CELL - 12, CELL - 12);
      }

      ctx.strokeStyle = '#6c7086';
      ctx.lineWidth = 1;
      ctx.strokeRect(x + 2, y + 2, CELL - 4, CELL - 4);
    }
  }

  // Goal
  if (goal) {
    const reached = frame.col === goal.col && frame.row === goal.row;
    const gx = PAD + goal.col * CELL + CELL / 2;
    const gy = PAD + goal.row * CELL + CELL / 2;
    const gr = CELL * 0.28;

    ctx.save();
    ctx.beginPath();
    ctx.arc(gx, gy, gr + 4, 0, Math.PI * 2);
    ctx.strokeStyle = reached ? '#a6e3a1' : '#f9e2af44';
    ctx.lineWidth = 3;
    ctx.stroke();

    ctx.beginPath();
    const spikes = 5, outerR = gr, innerR = gr * 0.45;
    for (let s = 0; s < spikes * 2; s++) {
      const angle = (s * Math.PI) / spikes - Math.PI / 2;
      const rad   = s % 2 === 0 ? outerR : innerR;
      const sx    = gx + Math.cos(angle) * rad;
      const sy    = gy + Math.sin(angle) * rad;
      s === 0 ? ctx.moveTo(sx, sy) : ctx.lineTo(sx, sy);
    }
    ctx.closePath();
    ctx.fillStyle = reached ? '#a6e3a1' : '#f9e2af';
    ctx.fill();
    ctx.restore();
  }

  // Robot
  const rx = PAD + frame.col * CELL + CELL / 2;
  const ry = PAD + frame.row * CELL + CELL / 2;
  const r  = CELL * 0.32;

  ctx.save();
  ctx.translate(rx, ry);
  ctx.rotate((frame.dir - 1) * Math.PI / 2);

  ctx.beginPath();
  ctx.arc(0, 0, r, 0, Math.PI * 2);
  ctx.fillStyle = frame.error ? '#f38ba8' : '#89b4fa';
  ctx.fill();
  ctx.strokeStyle = frame.error ? '#eba0ac' : '#b4befe';
  ctx.lineWidth = 2.5;
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(-r * 0.35, 0);
  ctx.lineTo( r * 0.45, 0);
  ctx.strokeStyle = '#1e1e2e';
  ctx.lineWidth = 3.5;
  ctx.lineCap = 'round';
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(r * 0.18, -r * 0.3);
  ctx.lineTo(r * 0.48,  0);
  ctx.lineTo(r * 0.18,  r * 0.3);
  ctx.fillStyle = '#1e1e2e';
  ctx.fill();

  ctx.restore();
}

function animate(canvas, frames, goal, outputDiv, execTimeSpan, startMs) {
  const ctx = canvas.getContext('2d');
  const DELAY = 320;
  let i = 0;

  function step() {
    drawFrame(ctx, frames[i], goal);

    const last = frames[frames.length - 1];
    if (i === frames.length - 1) {
      if (execTimeSpan)
        execTimeSpan.textContent = last.error
          ? ''
          : `⏱ ${frames.length - 1} move(s) · ${Date.now() - startMs}ms`;
      if (last.error) {
        const err = document.createElement('div');
        err.style.cssText = 'color:#f38ba8;margin-top:6px;font-size:0.85em;';
        err.textContent = last.error;
        outputDiv.appendChild(err);
      }
      return;
    }
    i++;
    setTimeout(step, DELAY);
  }

  step();
}

export class RobotExecutor {
  constructor({ outputElement, execTimeElement } = {}) {
    this.outputElement   = outputElement;
    this.execTimeElement = execTimeElement;
  }

  static detect(src) {
    return /^\s*FROM\s+TILEMAPS\s+IMPORT\s+\d+/m.test(src) ||
           /^\s*SPAWN\s+CHARACTER\s+AT/m.test(src)         ||
           /^\s*SPAWN\s+GOAL\s+AT/m.test(src)              ||
           /\bRENDER\s*\(/.test(src);
  }

  run(src) {
    const outputDiv    = this.outputElement;
    const execTimeSpan = this.execTimeElement;
    if (!outputDiv) return;

    outputDiv.innerHTML = '';
    if (execTimeSpan) execTimeSpan.textContent = '';

    let parsed;
    try { parsed = parseSource(src); }
    catch(e) { outputDiv.textContent = e.message; return; }

    const { tilemapId, spawnCol, spawnRow, goalCol, goalRow, pseudoSrc } = parsed;

    if (spawnCol === null) {
      outputDiv.textContent = 'Robot Error: missing "spawn character at (col, row)"';
      return;
    }

    // Load preset tilemap or start blank — RENDER() in pseudocode can override at runtime
    let initialGrid;
    if (tilemapId !== null) {
      try { initialGrid = getTilemap(tilemapId); }
      catch(e) { outputDiv.textContent = e.message; return; }
    } else {
      initialGrid = cloneGrid(EMPTY_GRID);
    }

    if (initialGrid[spawnRow]?.[spawnCol] === 1) {
      outputDiv.textContent = 'Robot Error: spawn position is inside a wall';
      return;
    }
    if (goalCol !== null && initialGrid[goalRow]?.[goalCol] === 1) {
      outputDiv.textContent = 'Robot Error: goal position is inside a wall';
      return;
    }

    const goal = goalCol !== null ? { col: goalCol, row: goalRow } : null;

    let frames;
    try { frames = simulate(pseudoSrc, initialGrid, spawnCol, spawnRow); }
    catch(e) { outputDiv.textContent = e.message; return; }

    outputDiv.style.maxHeight = 'none';
    outputDiv.style.overflowY = 'visible';

    const canvas = document.createElement('canvas');
    canvas.width  = SIZE;
    canvas.height = SIZE;
    canvas.style.cssText = 'display:block;max-width:100%;border-radius:8px;';
    outputDiv.appendChild(canvas);

    animate(canvas, frames, goal, outputDiv, execTimeSpan, Date.now());
  }
}

export default RobotExecutor;
