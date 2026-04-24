/**
 * RobotLogicLevel1.js
 * Drag-and-drop robot programming puzzle — Level 1.
 *
 * Grid: 7x7, no walls.
 * Robot starts at (0, 3) facing east, goal flag at (6, 0).
 * Intended solution: forward x6, turnLeft, forward x3.
 *
 * Blocks available: forward, turnLeft, turnRight.
 */

const DIRS = [
  { dx: 1,  dy: 0,  label: 'E' },
  { dx: 0,  dy: 1,  label: 'S' },
  { dx: -1, dy: 0,  label: 'W' },
  { dx: 0,  dy: -1, label: 'N' },
];

const BLOCK_DEFS = {
  forward:   { label: 'Move Forward', color: '#4f9dff' },
  turnLeft:  { label: 'Turn Left',    color: '#ffb347' },
  turnRight: { label: 'Turn Right',   color: '#ffb347' },
};

const STEP_MS = 350;

class RobotLogicLevel1 {
  constructor(gameEnv) {
    this.gameEnv = gameEnv || {};
    this.isRunning = false;

    this.gridSize = 7;
    this.cellSize = 64;

    this.walls = new Set();
    this.startState = { col: 0, row: 3, dir: 0 };
    this.goal = { col: 6, row: 0 };
    this.availableBlocks = ['forward', 'turnLeft', 'turnRight'];

    this.robot = { ...this.startState };
    this.program = [];
    this.executing = false;
    this.onExit = null;
  }

  start() {
    if (this.isRunning) return;
    this.isRunning = true;
    this.buildDOM();
    this.resetRobot();
    this.draw();
  }

  stop() {
    if (!this.isRunning) return;
    this.isRunning = false;
    this.executing = false;
    if (this.overlay?.parentNode) {
      this.overlay.parentNode.removeChild(this.overlay);
    }
    this.overlay = null;
    this.canvas = null;
    this.ctx = null;
    if (this.onExit) this.onExit();
  }

  resetRobot() {
    this.robot = { ...this.startState };
    this.setStatus('Ready. Drag blocks into the program, then press Run.');
  }

  /* ---------- DOM ---------- */

  buildDOM() {
    this.overlay = document.createElement('div');
    Object.assign(this.overlay.style, {
      position: 'fixed',
      inset: '0',
      zIndex: '10000',
      backgroundColor: '#1d2230',
      color: '#f2f2f2',
      fontFamily: 'system-ui, -apple-system, Segoe UI, sans-serif',
      display: 'flex',
      flexDirection: 'column',
    });

    const header = document.createElement('div');
    Object.assign(header.style, {
      padding: '12px 20px',
      borderBottom: '1px solid #2c3347',
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
    });
    const title = document.createElement('h2');
    title.textContent = 'Robot Logic — Level 1';
    title.style.margin = '0';
    title.style.fontSize = '18px';
    header.appendChild(title);

    const goalText = document.createElement('span');
    goalText.textContent = 'Program the robot to reach the green flag.';
    goalText.style.opacity = '0.8';
    goalText.style.fontSize = '14px';
    header.appendChild(goalText);

    const closeBtn = document.createElement('button');
    closeBtn.textContent = '✕';
    Object.assign(closeBtn.style, {
      marginLeft: 'auto',
      background: 'transparent',
      color: '#f2f2f2',
      border: '1px solid #444c66',
      borderRadius: '4px',
      cursor: 'pointer',
      width: '32px',
      height: '32px',
      fontSize: '16px',
    });
    closeBtn.addEventListener('click', () => this.stop());
    header.appendChild(closeBtn);

    this.overlay.appendChild(header);

    const body = document.createElement('div');
    Object.assign(body.style, {
      flex: '1',
      display: 'flex',
      gap: '20px',
      padding: '20px',
      overflow: 'hidden',
    });
    this.overlay.appendChild(body);

    body.appendChild(this.buildPalette());
    body.appendChild(this.buildProgramPanel());
    body.appendChild(this.buildGridPanel());

    const footer = document.createElement('div');
    Object.assign(footer.style, {
      padding: '8px 20px',
      borderTop: '1px solid #2c3347',
      fontSize: '13px',
      minHeight: '20px',
    });
    this.statusEl = footer;
    this.overlay.appendChild(footer);

    document.body.appendChild(this.overlay);
  }

  buildPalette() {
    const panel = this.makePanel('Blocks');
    const hint = document.createElement('p');
    hint.textContent = 'Drag a block into the program on the right.';
    hint.style.fontSize = '12px';
    hint.style.opacity = '0.7';
    hint.style.margin = '0 0 12px 0';
    panel.body.appendChild(hint);

    for (const key of this.availableBlocks) {
      panel.body.appendChild(this.makePaletteBlock(key));
    }
    return panel.root;
  }

  makePaletteBlock(key) {
    const def = BLOCK_DEFS[key];
    const el = document.createElement('div');
    el.textContent = def.label;
    el.draggable = true;
    el.dataset.blockType = key;
    Object.assign(el.style, {
      padding: '10px 14px',
      marginBottom: '8px',
      background: def.color,
      color: '#0f1524',
      fontWeight: '600',
      borderRadius: '6px',
      cursor: 'grab',
      userSelect: 'none',
      boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
    });
    el.addEventListener('dragstart', (e) => {
      e.dataTransfer.setData('text/block-type', key);
      e.dataTransfer.effectAllowed = 'copy';
    });
    return el;
  }

  buildProgramPanel() {
    const panel = this.makePanel('Program');
    panel.root.style.width = '240px';
    panel.root.style.flexShrink = '0';

    const dropZone = document.createElement('div');
    Object.assign(dropZone.style, {
      flex: '1',
      minHeight: '200px',
      border: '2px dashed #444c66',
      borderRadius: '6px',
      padding: '8px',
      overflowY: 'auto',
    });
    dropZone.addEventListener('dragover', (e) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'copy';
      dropZone.style.borderColor = '#4f9dff';
    });
    dropZone.addEventListener('dragleave', () => {
      dropZone.style.borderColor = '#444c66';
    });
    dropZone.addEventListener('drop', (e) => {
      e.preventDefault();
      dropZone.style.borderColor = '#444c66';
      const type = e.dataTransfer.getData('text/block-type');
      if (!type || !BLOCK_DEFS[type]) return;
      this.program.push(type);
      this.renderProgram();
    });
    this.dropZone = dropZone;
    panel.body.appendChild(dropZone);

    const controls = document.createElement('div');
    Object.assign(controls.style, {
      display: 'flex',
      gap: '8px',
      marginTop: '12px',
    });

    const runBtn = document.createElement('button');
    runBtn.textContent = '▶ Run';
    this.styleButton(runBtn, '#2ea66a');
    runBtn.addEventListener('click', () => this.run());
    controls.appendChild(runBtn);

    const resetBtn = document.createElement('button');
    resetBtn.textContent = 'Reset';
    this.styleButton(resetBtn, '#b7474a');
    resetBtn.addEventListener('click', () => {
      this.program = [];
      this.resetRobot();
      this.renderProgram();
      this.draw();
    });
    controls.appendChild(resetBtn);

    panel.body.appendChild(controls);
    this.renderProgram();
    return panel.root;
  }

  renderProgram() {
    if (!this.dropZone) return;
    this.dropZone.innerHTML = '';
    if (this.program.length === 0) {
      const ph = document.createElement('div');
      ph.textContent = 'Drop blocks here';
      Object.assign(ph.style, {
        opacity: '0.4',
        fontSize: '13px',
        textAlign: 'center',
        padding: '24px 0',
      });
      this.dropZone.appendChild(ph);
      return;
    }
    this.program.forEach((type, idx) => {
      const def = BLOCK_DEFS[type];
      const row = document.createElement('div');
      Object.assign(row.style, {
        display: 'flex',
        alignItems: 'center',
        background: def.color,
        color: '#0f1524',
        padding: '8px 10px',
        borderRadius: '6px',
        marginBottom: '6px',
        fontWeight: '600',
      });
      const num = document.createElement('span');
      num.textContent = `${idx + 1}.`;
      num.style.width = '22px';
      num.style.opacity = '0.6';
      row.appendChild(num);

      const label = document.createElement('span');
      label.textContent = def.label;
      label.style.flex = '1';
      row.appendChild(label);

      const remove = document.createElement('button');
      remove.textContent = '✕';
      Object.assign(remove.style, {
        background: 'transparent',
        border: 'none',
        cursor: 'pointer',
        fontWeight: '700',
        color: '#0f1524',
        fontSize: '14px',
      });
      remove.addEventListener('click', () => {
        this.program.splice(idx, 1);
        this.renderProgram();
      });
      row.appendChild(remove);
      this.dropZone.appendChild(row);
    });
  }

  buildGridPanel() {
    const panel = this.makePanel('Grid');
    panel.root.style.flex = '1';
    const size = this.gridSize * this.cellSize;
    this.canvas = document.createElement('canvas');
    this.canvas.width = size;
    this.canvas.height = size;
    Object.assign(this.canvas.style, {
      background: '#0f1524',
      borderRadius: '6px',
      alignSelf: 'center',
    });
    this.ctx = this.canvas.getContext('2d');
    const wrap = document.createElement('div');
    Object.assign(wrap.style, {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      flex: '1',
    });
    wrap.appendChild(this.canvas);
    panel.body.appendChild(wrap);
    return panel.root;
  }

  makePanel(titleText) {
    const root = document.createElement('div');
    Object.assign(root.style, {
      background: '#262d42',
      borderRadius: '8px',
      padding: '14px',
      display: 'flex',
      flexDirection: 'column',
      minWidth: '180px',
    });
    const h = document.createElement('h3');
    h.textContent = titleText;
    Object.assign(h.style, {
      margin: '0 0 10px 0',
      fontSize: '14px',
      textTransform: 'uppercase',
      letterSpacing: '0.08em',
      opacity: '0.7',
    });
    root.appendChild(h);
    const body = document.createElement('div');
    body.style.display = 'flex';
    body.style.flexDirection = 'column';
    body.style.flex = '1';
    root.appendChild(body);
    return { root, body };
  }

  styleButton(btn, bg) {
    Object.assign(btn.style, {
      flex: '1',
      padding: '10px',
      background: bg,
      color: '#fff',
      border: 'none',
      borderRadius: '6px',
      cursor: 'pointer',
      fontWeight: '600',
      fontSize: '14px',
    });
  }

  setStatus(text) {
    if (this.statusEl) this.statusEl.textContent = text;
  }

  /* ---------- Execution ---------- */

  async run() {
    if (this.executing) return;
    if (this.program.length === 0) {
      this.setStatus('Program is empty — drag some blocks first.');
      return;
    }
    this.executing = true;
    this.resetRobot();
    this.draw();
    this.setStatus('Running...');
    for (let i = 0; i < this.program.length; i++) {
      if (!this.isRunning) return;
      const block = this.program[i];
      const result = this.executeBlock(block);
      this.draw();
      if (result === 'blocked') {
        this.setStatus(`Step ${i + 1}: blocked by wall or edge. Try again.`);
        this.executing = false;
        return;
      }
      await sleep(STEP_MS);
    }
    if (this.robot.col === this.goal.col && this.robot.row === this.goal.row) {
      this.setStatus('🎉 You reached the flag! Level complete.');
    } else {
      this.setStatus('Program finished, but the robot is not on the flag.');
    }
    this.executing = false;
  }

  executeBlock(block) {
    if (block === 'forward') {
      const d = DIRS[this.robot.dir];
      const nc = this.robot.col + d.dx;
      const nr = this.robot.row + d.dy;
      if (!this.canMoveTo(nc, nr)) return 'blocked';
      this.robot.col = nc;
      this.robot.row = nr;
      return 'moved';
    }
    if (block === 'turnLeft') {
      this.robot.dir = (this.robot.dir + 3) % 4;
      return 'turned';
    }
    if (block === 'turnRight') {
      this.robot.dir = (this.robot.dir + 1) % 4;
      return 'turned';
    }
    return 'noop';
  }

  canMoveTo(c, r) {
    if (c < 0 || c >= this.gridSize || r < 0 || r >= this.gridSize) return false;
    if (this.walls.has(`${c},${r}`)) return false;
    return true;
  }

  /* ---------- Rendering ---------- */

  draw() {
    if (!this.ctx) return;
    const ctx = this.ctx;
    const s = this.cellSize;

    ctx.fillStyle = '#0f1524';
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    for (let r = 0; r < this.gridSize; r++) {
      for (let c = 0; c < this.gridSize; c++) {
        const x = c * s;
        const y = r * s;
        ctx.fillStyle = (r + c) % 2 === 0 ? '#1b2236' : '#202846';
        ctx.fillRect(x, y, s, s);
        if (this.walls.has(`${c},${r}`)) {
          ctx.fillStyle = '#555c7a';
          ctx.fillRect(x + 2, y + 2, s - 4, s - 4);
        }
      }
    }

    const gx = this.goal.col * s;
    const gy = this.goal.row * s;
    ctx.fillStyle = '#2ea66a';
    ctx.fillRect(gx + 6, gy + 6, s - 12, s - 12);
    ctx.fillStyle = '#fff';
    ctx.font = `${Math.floor(s * 0.5)}px system-ui`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('⚑', gx + s / 2, gy + s / 2 + 2);

    this.drawRobot();

    ctx.strokeStyle = '#2c3347';
    ctx.lineWidth = 1;
    for (let i = 0; i <= this.gridSize; i++) {
      ctx.beginPath();
      ctx.moveTo(i * s, 0);
      ctx.lineTo(i * s, this.gridSize * s);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i * s);
      ctx.lineTo(this.gridSize * s, i * s);
      ctx.stroke();
    }
  }

  drawRobot() {
    const ctx = this.ctx;
    const s = this.cellSize;
    const cx = this.robot.col * s + s / 2;
    const cy = this.robot.row * s + s / 2;
    const radius = s * 0.35;

    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate((this.robot.dir * Math.PI) / 2);

    ctx.fillStyle = '#4f9dff';
    ctx.strokeStyle = '#e8f1ff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(radius, 0);
    ctx.lineTo(-radius * 0.8, radius * 0.7);
    ctx.lineTo(-radius * 0.4, 0);
    ctx.lineTo(-radius * 0.8, -radius * 0.7);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  }
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export default RobotLogicLevel1;
