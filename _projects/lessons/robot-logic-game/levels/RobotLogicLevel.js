/**
 * RobotLogicLevel.js
 * Generic level engine — consumes a config object that defines the grid,
 * walls, start/goal, available blocks, tutorial steps, and star thresholds.
 *
 * Blocks supported: forward, backward, turnLeft, turnRight, repeat, ifCanMove.
 */

import { saveLevelStars } from './progress.js';
import { levelConfigs } from './levelConfigs.js';

const DIRS = [
  { dx: 1,  dy: 0  },
  { dx: 0,  dy: 1  },
  { dx: -1, dy: 0  },
  { dx: 0,  dy: -1 },
];

const BLOCK_DEFS = {
  forward:   { label: 'Move Forward',        color: '#4f9dff' },
  backward:  { label: 'Move Backward',       color: '#5ad1d1' },
  turnLeft:  { label: 'Turn Left',           color: '#ffb347' },
  turnRight: { label: 'Turn Right',          color: '#ffb347' },
  repeat:    { label: 'Repeat N times',      color: '#b78cff' },
  ifCanMove: { label: 'If Can Move Forward', color: '#e98acc' },
};

const MOVE_MS = 280;
const TURN_MS = 220;
const MIN_CELL = 48;
const MAX_CELL = 140;

const STYLE_ID = 'rlg-styles';
const STYLE_SHEET = `
  @keyframes rlg-drift-a {
    0%, 100% { transform: translate(0, 0) rotate(0deg); }
    50%      { transform: translate(60px, -40px) rotate(40deg); }
  }
  @keyframes rlg-drift-b {
    0%, 100% { transform: translate(0, 0) rotate(0deg); }
    50%      { transform: translate(-50px, 50px) rotate(-30deg); }
  }
  @keyframes rlg-drift-c {
    0%, 100% { transform: translate(0, 0) rotate(45deg); }
    50%      { transform: translate(40px, 60px) rotate(95deg); }
  }
  @keyframes rlg-drift-d {
    0%, 100% { transform: translate(0, 0) rotate(0deg); }
    50%      { transform: translate(-40px, -30px) rotate(-70deg); }
  }
  @keyframes rlg-drift-e {
    0%, 100% { transform: translate(0, 0) rotate(0deg); }
    50%      { transform: translate(30px, 20px) rotate(20deg); }
  }
  .rlg-shape { position: absolute; pointer-events: none; will-change: transform; }
  @keyframes rlg-pulse {
    0%, 100% { box-shadow: 0 0 0 0 rgba(79,157,255,0.7); }
    50%      { box-shadow: 0 0 0 10px rgba(79,157,255,0); }
  }
  .rlg-pulse { animation: rlg-pulse 1.4s ease-in-out infinite; }
  @keyframes rlg-fade-in {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
  @keyframes rlg-modal-in {
    from { opacity: 0; transform: scale(0.92) translateY(12px); }
    to   { opacity: 1; transform: scale(1) translateY(0); }
  }
  @keyframes rlg-star-pop {
    0%   { transform: scale(0) rotate(-30deg); opacity: 0; }
    60%  { transform: scale(1.25) rotate(8deg); opacity: 1; }
    100% { transform: scale(1) rotate(0deg); opacity: 1; }
  }
`;

class RobotLogicLevel {
  constructor(config, gameEnv) {
    if (!config) throw new Error('RobotLogicLevel requires a config object');
    this.config = config;
    this.gameEnv = gameEnv || {};
    this.isRunning = false;

    this.levelId = config.id;
    this.levelName = config.name;
    this.gridSize = config.gridSize;
    this.cellSize = MIN_CELL;   // placeholder; resizeCanvas() picks the real value after DOM mounts

    this.walls = new Set((config.walls || []).map(([c, r]) => `${c},${r}`));
    this.startState = { ...config.start };
    this.goal = { ...config.goal };
    this.availableBlocks = config.availableBlocks;
    this.starThresholds = config.starThresholds || { three: 5, two: 8 };

    this.robot = { ...this.startState };
    this.dx = this.robot.col;
    this.dy = this.robot.row;
    this.dAngle = this.robot.dir * (Math.PI / 2);

    this.program = [];
    this.executing = false;
    this.onExit = null;
    this.onContinue = null;
    this.draggedRef = null;

    this.hasRun = false;
    this.hasWon = false;
    this.currentStep = 0;
    this.tutorialSteps = (config.tutorialSteps || []).map((step) => ({
      text: step.text,
      highlight: step.highlight || null,
      check: this.interpretCheck(step.check),
    }));
  }

  interpretCheck(spec) {
    if (typeof spec === 'function') return () => spec(this);
    if (spec === 'hasRun') return () => this.hasRun;
    if (spec === 'hasWon') return () => this.hasWon;
    if (typeof spec === 'string' && spec.startsWith('hasBlock:')) {
      const type = spec.slice('hasBlock:'.length);
      return () => this.programIncludes(type);
    }
    return () => false;
  }

  start() {
    if (this.isRunning) return;
    this.isRunning = true;
    this.injectStyles();
    this.lockScroll();
    this.buildDOM();
    this.resetRobot();
    this.updateTutorial();
    this.setStatus('idle', 'Drag blocks into the Program panel, then press Run.');
    this.resizeHandler = () => this.resizeCanvas();
    window.addEventListener('resize', this.resizeHandler);
    requestAnimationFrame(() => this.resizeCanvas());
  }

  lockScroll() {
    this.scrollLock = {
      bodyOverflow: document.body.style.overflow,
      htmlOverflow: document.documentElement.style.overflow,
      bodyTouchAction: document.body.style.touchAction,
      keyHandler: (e) => {
        // Block keys that would scroll the underlying page (Space, PgUp/Dn,
        // Home/End, Arrows). Stay out of the way when the user is typing
        // into a Repeat-count input.
        const tag = (e.target && e.target.tagName) || '';
        if (tag === 'INPUT' || tag === 'TEXTAREA' || e.target?.isContentEditable) return;
        const blocked = [' ', 'Spacebar', 'PageUp', 'PageDown', 'Home', 'End',
                         'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];
        if (blocked.includes(e.key)) e.preventDefault();
      },
    };
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    document.body.style.touchAction = 'none';
    window.addEventListener('keydown', this.scrollLock.keyHandler, { passive: false });
  }

  unlockScroll() {
    if (!this.scrollLock) return;
    document.body.style.overflow = this.scrollLock.bodyOverflow;
    document.documentElement.style.overflow = this.scrollLock.htmlOverflow;
    document.body.style.touchAction = this.scrollLock.bodyTouchAction;
    window.removeEventListener('keydown', this.scrollLock.keyHandler);
    this.scrollLock = null;
  }

  resizeCanvas() {
    if (!this.isRunning || !this.canvas || !this.canvasWrap) return;
    const r = this.canvasWrap.getBoundingClientRect();
    const side = Math.floor(Math.min(r.width, r.height));
    if (side <= 0) return;
    const cell = Math.max(MIN_CELL, Math.min(MAX_CELL, Math.floor(side / this.gridSize)));
    if (cell === this.cellSize && this.canvas.width === cell * this.gridSize) {
      this.draw();
      return;
    }
    this.cellSize = cell;
    const px = cell * this.gridSize;
    this.canvas.width = px;
    this.canvas.height = px;
    this.snapDisplay();
    this.draw();
  }

  stop() {
    if (!this.isRunning) return;
    this.isRunning = false;
    this.executing = false;
    if (this.resizeHandler) {
      window.removeEventListener('resize', this.resizeHandler);
      this.resizeHandler = null;
    }
    this.unlockScroll();
    if (this.overlay?.parentNode) {
      this.overlay.parentNode.removeChild(this.overlay);
    }
    this.overlay = null;
    this.canvas = null;
    this.canvasWrap = null;
    this.ctx = null;
    if (this.onExit) this.onExit();
  }

  resetRobot() {
    this.robot = { ...this.startState };
    this.snapDisplay();
  }

  snapDisplay() {
    this.dx = this.robot.col;
    this.dy = this.robot.row;
    this.dAngle = this.robot.dir * (Math.PI / 2);
  }

  injectStyles() {
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = STYLE_SHEET;
    document.head.appendChild(style);
  }

  /* ---------- DOM ---------- */

  buildDOM() {
    this.overlay = document.createElement('div');
    Object.assign(this.overlay.style, {
      position: 'fixed',
      inset: '0',
      zIndex: '10000',
      background: 'radial-gradient(ellipse at top, #1a2046 0%, #11162a 50%, #0a0d1e 100%)',
      color: '#f2f2f2',
      fontFamily: 'system-ui, -apple-system, Segoe UI, sans-serif',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
    });

    this.overlay.appendChild(this.buildBackground());
    this.overlay.appendChild(this.buildHeader());
    this.overlay.appendChild(this.buildTutorialBanner());
    this.overlay.appendChild(this.buildStatusBar());

    const body = document.createElement('div');
    Object.assign(body.style, {
      flex: '1',
      display: 'flex',
      gap: '20px',
      padding: '20px',
      overflow: 'hidden',
      position: 'relative',
      zIndex: '1',
    });
    body.appendChild(this.buildPalette());
    body.appendChild(this.buildProgramPanel());
    body.appendChild(this.buildGridPanel());
    this.overlay.appendChild(body);

    document.body.appendChild(this.overlay);
  }

  buildHeader() {
    const header = document.createElement('div');
    Object.assign(header.style, {
      padding: '14px 24px',
      borderBottom: '1px solid #2c3347',
      display: 'flex',
      alignItems: 'center',
      gap: '14px',
      position: 'relative',
      zIndex: '1',
      background: 'linear-gradient(180deg, rgba(38,45,80,0.5), rgba(38,45,80,0))',
    });

    const numBadge = document.createElement('div');
    numBadge.textContent = String(this.levelId);
    Object.assign(numBadge.style, {
      width: '34px',
      height: '34px',
      borderRadius: '10px',
      background: 'linear-gradient(135deg, #4f9dff, #b78cff)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontWeight: '800',
      fontSize: '17px',
      color: '#0f1524',
      boxShadow: '0 3px 10px rgba(79,157,255,0.35)',
      flexShrink: '0',
    });
    header.appendChild(numBadge);

    const titleCol = document.createElement('div');
    Object.assign(titleCol.style, { display: 'flex', flexDirection: 'column', gap: '2px' });
    const eyebrow = document.createElement('div');
    eyebrow.textContent = 'ROBOT LOGIC';
    Object.assign(eyebrow.style, {
      fontSize: '10px',
      letterSpacing: '0.18em',
      opacity: '0.55',
      fontWeight: '700',
    });
    titleCol.appendChild(eyebrow);
    const title = document.createElement('h2');
    title.textContent = this.levelName;
    Object.assign(title.style, { margin: '0', fontSize: '19px', fontWeight: '700' });
    titleCol.appendChild(title);
    header.appendChild(titleCol);

    const backBtn = document.createElement('button');
    backBtn.textContent = '✕ Close';
    Object.assign(backBtn.style, {
      marginLeft: 'auto',
      background: 'rgba(255,255,255,0.06)',
      color: '#f2f2f2',
      border: '1px solid #444c66',
      borderRadius: '8px',
      cursor: 'pointer',
      padding: '8px 16px',
      fontSize: '13px',
      fontWeight: '600',
    });
    backBtn.addEventListener('mouseenter', () => {
      backBtn.style.background = 'rgba(255,107,115,0.18)';
      backBtn.style.borderColor = '#ff6b73';
    });
    backBtn.addEventListener('mouseleave', () => {
      backBtn.style.background = 'rgba(255,255,255,0.06)';
      backBtn.style.borderColor = '#444c66';
    });
    backBtn.addEventListener('click', () => this.stop());
    header.appendChild(backBtn);
    return header;
  }

  buildTutorialBanner() {
    const root = document.createElement('div');
    Object.assign(root.style, {
      padding: '14px 24px',
      borderBottom: '1px solid #2c3347',
      background: 'linear-gradient(90deg, rgba(79,157,255,0.18), rgba(183,140,255,0.12))',
      display: 'flex',
      alignItems: 'center',
      gap: '18px',
      position: 'relative',
      zIndex: '1',
      minHeight: '56px',
    });

    const badge = document.createElement('div');
    Object.assign(badge.style, {
      flexShrink: '0',
      width: '36px',
      height: '36px',
      borderRadius: '50%',
      background: '#4f9dff',
      color: '#0f1524',
      fontWeight: '700',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '15px',
    });
    this.tutorialBadge = badge;
    root.appendChild(badge);

    const textCol = document.createElement('div');
    Object.assign(textCol.style, {
      flex: '1',
      display: 'flex',
      flexDirection: 'column',
      gap: '2px',
    });
    const label = document.createElement('div');
    Object.assign(label.style, {
      fontSize: '11px',
      textTransform: 'uppercase',
      letterSpacing: '0.12em',
      opacity: '0.65',
    });
    this.tutorialLabel = label;
    textCol.appendChild(label);

    const msg = document.createElement('div');
    Object.assign(msg.style, {
      fontSize: '15px',
      fontWeight: '500',
      lineHeight: '1.3',
    });
    this.tutorialMsg = msg;
    textCol.appendChild(msg);
    root.appendChild(textCol);

    const dots = document.createElement('div');
    Object.assign(dots.style, {
      display: 'flex',
      gap: '6px',
      flexShrink: '0',
    });
    this.tutorialDots = [];
    const nSteps = Math.max(this.tutorialSteps.length, 1);
    for (let i = 0; i < nSteps; i++) {
      const d = document.createElement('div');
      Object.assign(d.style, {
        width: '10px',
        height: '10px',
        borderRadius: '50%',
        background: '#3a4466',
        transition: 'background 180ms, transform 180ms',
      });
      this.tutorialDots.push(d);
      dots.appendChild(d);
    }
    root.appendChild(dots);

    return root;
  }

  buildBackground() {
    const bg = document.createElement('div');
    Object.assign(bg.style, {
      position: 'absolute',
      inset: '0',
      overflow: 'hidden',
      pointerEvents: 'none',
      zIndex: '0',
    });
    const shapes = [
      { size: 360, top: '-120px', left: '-100px', radius: '50%',
        bg: 'radial-gradient(circle, rgba(79,157,255,0.18), transparent 70%)',
        anim: 'rlg-drift-a 28s ease-in-out infinite' },
      { size: 300, top: '30%', right: '-120px', radius: '24%',
        bg: 'radial-gradient(circle, rgba(183,140,255,0.16), transparent 70%)',
        anim: 'rlg-drift-b 36s ease-in-out infinite' },
      { size: 240, bottom: '-90px', left: '22%', radius: '12%',
        bg: 'conic-gradient(from 0deg, rgba(46,166,106,0.12), rgba(46,166,106,0) 55%, rgba(46,166,106,0.12))',
        anim: 'rlg-drift-c 44s linear infinite' },
      { size: 180, top: '18%', left: '32%', radius: '8%',
        border: '1px solid rgba(255,255,255,0.06)',
        anim: 'rlg-drift-d 34s ease-in-out infinite' },
      { size: 140, bottom: '14%', right: '22%', radius: '50%',
        border: '1px solid rgba(255,179,71,0.08)',
        anim: 'rlg-drift-e 40s ease-in-out infinite' },
    ];
    for (const s of shapes) {
      const el = document.createElement('div');
      el.className = 'rlg-shape';
      el.style.width = `${s.size}px`;
      el.style.height = `${s.size}px`;
      el.style.borderRadius = s.radius;
      if (s.top) el.style.top = s.top;
      if (s.left) el.style.left = s.left;
      if (s.right) el.style.right = s.right;
      if (s.bottom) el.style.bottom = s.bottom;
      if (s.bg) el.style.background = s.bg;
      if (s.border) el.style.border = s.border;
      el.style.animation = s.anim;
      bg.appendChild(el);
    }
    return bg;
  }

  buildPalette() {
    const panel = this.makePanel('Blocks');
    panel.root.style.width = '190px';
    panel.root.style.flexShrink = '0';
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
      this.draggedRef = null;
      e.dataTransfer.setData('text/block-type', key);
      e.dataTransfer.effectAllowed = 'copy';
    });
    return el;
  }

  buildProgramPanel() {
    const panel = this.makePanel('Program');
    panel.root.style.width = '280px';
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
    this.installDropZone(dropZone, this.program);
    this.dropZone = dropZone;
    panel.body.appendChild(dropZone);

    const controls = document.createElement('div');
    Object.assign(controls.style, {
      display: 'flex',
      gap: '8px',
      marginTop: '12px',
    });

    const runBtn = document.createElement('button');
    runBtn.textContent = 'Run';
    runBtn.dataset.action = 'run';
    this.styleButton(runBtn, '#2ea66a');
    runBtn.addEventListener('click', () => this.run());
    controls.appendChild(runBtn);

    const resetBtn = document.createElement('button');
    resetBtn.textContent = 'Reset';
    this.styleButton(resetBtn, '#b7474a');
    resetBtn.addEventListener('click', () => {
      this.executing = false;
      this.program.length = 0;
      this.resetRobot();
      this.renderProgram();
      this.draw();
      this.setStatus('idle', 'Program cleared.');
    });
    controls.appendChild(resetBtn);

    panel.body.appendChild(controls);
    this.renderProgram();
    return panel.root;
  }

  installDropZone(el, list) {
    el.addEventListener('dragover', (e) => {
      e.preventDefault();
      e.stopPropagation();
      e.dataTransfer.dropEffect = this.draggedRef ? 'move' : 'copy';
      el.style.borderColor = '#4f9dff';
    });
    el.addEventListener('dragleave', (e) => {
      e.stopPropagation();
      el.style.borderColor = '#444c66';
    });
    el.addEventListener('drop', (e) => {
      e.preventDefault();
      e.stopPropagation();
      el.style.borderColor = '#444c66';
      const insertIdx = this.computeInsertIndex(el, e.clientY);

      if (this.draggedRef) {
        const { list: srcList, index: srcIdx } = this.draggedRef;
        const block = srcList[srcIdx];
        this.draggedRef = null;
        if (!block) return;
        if (this.listIsInside(list, block)) return;
        srcList.splice(srcIdx, 1);
        let targetIdx = insertIdx;
        if (srcList === list && srcIdx < insertIdx) targetIdx--;
        list.splice(targetIdx, 0, block);
        this.renderProgram();
        return;
      }

      const type = e.dataTransfer.getData('text/block-type');
      if (!type || !BLOCK_DEFS[type]) return;
      list.splice(insertIdx, 0, this.makeBlockEntry(type));
      this.renderProgram();
    });
  }

  computeInsertIndex(zone, clientY) {
    const rows = Array.from(zone.children).filter((c) => c.dataset && c.dataset.blockRow === '1');
    for (let i = 0; i < rows.length; i++) {
      const rect = rows[i].getBoundingClientRect();
      if (clientY < rect.top + rect.height / 2) return i;
    }
    return rows.length;
  }

  listIsInside(targetList, block) {
    if (!block || !Array.isArray(block.body)) return false;
    if (targetList === block.body) return true;
    for (const child of block.body) {
      if (this.listIsInside(targetList, child)) return true;
    }
    return false;
  }

  makeReorderable(el, list, idx) {
    el.draggable = true;
    el.dataset.blockRow = '1';
    el.style.cursor = 'grab';
    el.addEventListener('dragstart', (e) => {
      e.stopPropagation();
      this.draggedRef = { list, index: idx };
      e.dataTransfer.effectAllowed = 'move';
      try { e.dataTransfer.setData('text/plain', 'rlg-move'); } catch (_) {}
      el.style.opacity = '0.4';
    });
    el.addEventListener('dragend', () => {
      this.draggedRef = null;
      el.style.opacity = '';
    });
  }

  makeBlockEntry(type) {
    if (type === 'repeat') return { type: 'repeat', count: 2, body: [] };
    if (type === 'ifCanMove') return { type: 'ifCanMove', body: [] };
    return { type };
  }

  renderProgram() {
    if (!this.dropZone) return;
    this.renderBlockList(this.program, this.dropZone);
    this.updateTutorial();
  }

  renderBlockList(list, parent) {
    parent.innerHTML = '';
    if (list.length === 0) {
      const ph = document.createElement('div');
      ph.textContent = 'Drop blocks here';
      Object.assign(ph.style, {
        opacity: '0.4',
        fontSize: '13px',
        textAlign: 'center',
        padding: '18px 0',
      });
      parent.appendChild(ph);
      return;
    }
    list.forEach((block, idx) => {
      parent.appendChild(this.renderBlockItem(block, list, idx));
    });
  }

  renderBlockItem(block, list, idx) {
    if (block.type === 'repeat') return this.renderRepeatBlock(block, list, idx);
    if (block.type === 'ifCanMove') return this.renderIfCanMoveBlock(block, list, idx);
    return this.renderSimpleBlock(block, list, idx);
  }

  renderSimpleBlock(block, list, idx) {
    const def = BLOCK_DEFS[block.type];
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
    const label = document.createElement('span');
    label.textContent = def.label;
    label.style.flex = '1';
    row.appendChild(label);
    row.appendChild(this.makeRemoveButton(() => {
      list.splice(idx, 1);
      this.renderProgram();
    }));
    this.makeReorderable(row, list, idx);
    return row;
  }

  renderRepeatBlock(block, list, idx) {
    const def = BLOCK_DEFS.repeat;
    const wrap = document.createElement('div');
    Object.assign(wrap.style, {
      background: def.color,
      borderRadius: '6px',
      padding: '8px',
      marginBottom: '6px',
      color: '#0f1524',
    });

    const header = document.createElement('div');
    Object.assign(header.style, {
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      fontWeight: '600',
      marginBottom: '6px',
    });
    const leading = document.createElement('span');
    leading.textContent = 'Repeat';
    header.appendChild(leading);

    const countInput = document.createElement('input');
    countInput.type = 'number';
    countInput.min = '1';
    countInput.max = '20';
    countInput.value = String(block.count);
    Object.assign(countInput.style, {
      width: '48px',
      padding: '4px 6px',
      borderRadius: '4px',
      border: '1px solid rgba(0,0,0,0.25)',
      background: '#fff',
      color: '#0f1524',
      fontWeight: '600',
      fontSize: '13px',
    });
    countInput.draggable = false;
    countInput.addEventListener('mousedown', (e) => e.stopPropagation());
    countInput.addEventListener('input', () => {
      const n = parseInt(countInput.value, 10);
      block.count = Number.isFinite(n) ? Math.min(20, Math.max(1, n)) : 1;
    });
    header.appendChild(countInput);

    const trailing = document.createElement('span');
    trailing.textContent = 'times';
    header.appendChild(trailing);

    const spacer = document.createElement('span');
    spacer.style.flex = '1';
    header.appendChild(spacer);

    header.appendChild(this.makeRemoveButton(() => {
      list.splice(idx, 1);
      this.renderProgram();
    }));
    wrap.appendChild(header);

    const bodyZone = document.createElement('div');
    Object.assign(bodyZone.style, {
      border: '2px dashed rgba(15, 21, 36, 0.35)',
      borderRadius: '4px',
      padding: '6px',
      minHeight: '40px',
      background: 'rgba(255,255,255,0.12)',
    });
    this.installDropZone(bodyZone, block.body);
    this.renderBlockList(block.body, bodyZone);
    wrap.appendChild(bodyZone);

    this.makeReorderable(wrap, list, idx);
    return wrap;
  }

  renderIfCanMoveBlock(block, list, idx) {
    const def = BLOCK_DEFS.ifCanMove;
    const wrap = document.createElement('div');
    Object.assign(wrap.style, {
      background: def.color,
      borderRadius: '6px',
      padding: '8px',
      marginBottom: '6px',
      color: '#0f1524',
    });

    const header = document.createElement('div');
    Object.assign(header.style, {
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      fontWeight: '600',
      marginBottom: '6px',
    });
    const label = document.createElement('span');
    label.textContent = 'If Can Move Forward';
    header.appendChild(label);

    const spacer = document.createElement('span');
    spacer.style.flex = '1';
    header.appendChild(spacer);

    header.appendChild(this.makeRemoveButton(() => {
      list.splice(idx, 1);
      this.renderProgram();
    }));
    wrap.appendChild(header);

    const bodyZone = document.createElement('div');
    Object.assign(bodyZone.style, {
      border: '2px dashed rgba(15, 21, 36, 0.35)',
      borderRadius: '4px',
      padding: '6px',
      minHeight: '40px',
      background: 'rgba(255,255,255,0.15)',
    });
    this.installDropZone(bodyZone, block.body);
    this.renderBlockList(block.body, bodyZone);
    wrap.appendChild(bodyZone);

    this.makeReorderable(wrap, list, idx);
    return wrap;
  }

  makeRemoveButton(onClick) {
    const btn = document.createElement('button');
    btn.textContent = '✕';
    Object.assign(btn.style, {
      background: 'transparent',
      border: 'none',
      cursor: 'pointer',
      fontWeight: '700',
      color: '#0f1524',
      fontSize: '14px',
    });
    btn.draggable = false;
    btn.addEventListener('mousedown', (e) => e.stopPropagation());
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      onClick();
    });
    return btn;
  }

  buildGridPanel() {
    const panel = this.makePanel('Grid');
    Object.assign(panel.root.style, {
      flex: '1',
      minWidth: '0',
      minHeight: '0',
    });
    Object.assign(panel.body.style, {
      minWidth: '0',
      minHeight: '0',
    });
    this.canvas = document.createElement('canvas');
    this.canvas.width = this.gridSize * this.cellSize;
    this.canvas.height = this.gridSize * this.cellSize;
    Object.assign(this.canvas.style, {
      background: '#0f1524',
      borderRadius: '12px',
      border: '1px solid rgba(79,157,255,0.18)',
      boxShadow: '0 12px 40px rgba(0,0,0,0.45), 0 0 0 1px rgba(255,255,255,0.04)',
      display: 'block',
    });
    this.ctx = this.canvas.getContext('2d');

    const wrap = document.createElement('div');
    Object.assign(wrap.style, {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      flex: '1',
      minWidth: '0',
      minHeight: '0',
      overflow: 'hidden',
    });
    wrap.appendChild(this.canvas);
    panel.body.appendChild(wrap);
    this.canvasWrap = wrap;
    return panel.root;
  }

  makePanel(titleText) {
    const root = document.createElement('div');
    Object.assign(root.style, {
      background: 'linear-gradient(180deg, rgba(46,54,84,0.85), rgba(34,40,62,0.85))',
      backdropFilter: 'blur(6px)',
      WebkitBackdropFilter: 'blur(6px)',
      borderRadius: '12px',
      border: '1px solid rgba(255,255,255,0.06)',
      padding: '16px',
      display: 'flex',
      flexDirection: 'column',
      minWidth: '150px',
      boxShadow: '0 6px 24px rgba(0,0,0,0.3)',
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

  buildStatusBar() {
    const bar = document.createElement('div');
    Object.assign(bar.style, {
      padding: '12px 24px',
      borderBottom: '1px solid #2c3347',
      background: '#1a2035',
      color: '#e8eef8',
      fontSize: '15px',
      fontWeight: '600',
      textAlign: 'center',
      position: 'relative',
      zIndex: '1',
      transition: 'background 220ms, color 220ms',
      minHeight: '28px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '10px',
    });
    const dot = document.createElement('div');
    Object.assign(dot.style, {
      width: '10px',
      height: '10px',
      borderRadius: '50%',
      background: '#6b7896',
      flexShrink: '0',
    });
    bar.appendChild(dot);
    const text = document.createElement('span');
    bar.appendChild(text);
    this.statusBar = bar;
    this.statusDot = dot;
    this.statusText = text;
    return bar;
  }

  setStatus(kind, message) {
    if (!this.statusBar) return;
    const palette = {
      idle:    { bg: '#1a2035', dot: '#6b7896', fg: '#e8eef8' },
      running: { bg: '#1c3356', dot: '#4f9dff', fg: '#e8f1ff' },
      blocked: { bg: '#3a1f23', dot: '#ff6b73', fg: '#ffecee' },
      success: { bg: '#1d3b2c', dot: '#2ea66a', fg: '#e6f7ee' },
    };
    const p = palette[kind] || palette.idle;
    this.statusBar.style.background = p.bg;
    this.statusBar.style.color = p.fg;
    this.statusDot.style.background = p.dot;
    this.statusText.textContent = message;
  }

  /* ---------- Tutorial ---------- */

  programIncludes(type, list) {
    const source = list || this.program;
    for (const b of source) {
      if (b.type === type) return true;
      if (Array.isArray(b.body) && this.programIncludes(type, b.body)) return true;
    }
    return false;
  }

  updateTutorial() {
    if (!this.tutorialBadge) return;
    if (this.tutorialSteps.length === 0) {
      this.tutorialBadge.textContent = '—';
      this.tutorialLabel.textContent = '';
      this.tutorialMsg.textContent = '';
      return;
    }
    while (
      this.currentStep < this.tutorialSteps.length &&
      this.tutorialSteps[this.currentStep].check()
    ) {
      this.currentStep++;
    }

    const done = this.currentStep >= this.tutorialSteps.length;
    const step = done
      ? this.tutorialSteps[this.tutorialSteps.length - 1]
      : this.tutorialSteps[this.currentStep];

    this.tutorialBadge.textContent = done ? '✓' : String(this.currentStep + 1);
    this.tutorialBadge.style.background = done ? '#2ea66a' : '#4f9dff';
    this.tutorialLabel.textContent = done
      ? 'Objective Complete'
      : `Step ${this.currentStep + 1} of ${this.tutorialSteps.length}`;
    this.tutorialMsg.textContent = done
      ? 'Nice work — you finished this level.'
      : step.text;

    for (let i = 0; i < this.tutorialDots.length; i++) {
      const d = this.tutorialDots[i];
      if (i < this.currentStep) {
        d.style.background = '#2ea66a';
        d.style.transform = 'scale(1)';
      } else if (i === this.currentStep && !done) {
        d.style.background = '#4f9dff';
        d.style.transform = 'scale(1.35)';
      } else {
        d.style.background = '#3a4466';
        d.style.transform = 'scale(1)';
      }
    }

    this.applyTutorialHighlight(done ? null : step.highlight);
  }

  applyTutorialHighlight(selector) {
    if (!this.overlay) return;
    this.overlay.querySelectorAll('.rlg-pulse').forEach((el) => {
      el.classList.remove('rlg-pulse');
    });
    if (!selector) return;
    const target = this.overlay.querySelector(selector);
    if (target) target.classList.add('rlg-pulse');
  }

  /* ---------- Execution ---------- */

  async run() {
    if (this.executing) return;
    if (this.program.length === 0) {
      this.setStatus('idle', 'Your program is empty — drag some blocks first.');
      return;
    }
    this.executing = true;
    this.hasRun = true;
    this.resetRobot();
    this.draw();
    this.setStatus('running', 'Running program…');
    this.updateTutorial();

    const result = await this.executeBlocks(this.program);
    this.executing = false;

    if (result === 'stopped') return;
    if (result === 'blocked') {
      this.setStatus('blocked', 'Blocked by a wall or edge. Adjust your program and try again.');
      return;
    }
    if (this.robot.col === this.goal.col && this.robot.row === this.goal.row) {
      this.hasWon = true;
      this.setStatus('success', 'Level complete! The robot reached the goal.');
      this.updateTutorial();
      setTimeout(() => this.showSuccessScreen(), 450);
    } else {
      this.setStatus('blocked', 'Program finished, but the robot did not reach the goal.');
    }
  }

  async executeBlocks(blocks) {
    for (const block of blocks) {
      if (!this.isRunning || !this.executing) return 'stopped';
      if (block.type === 'repeat') {
        const count = Math.min(20, Math.max(1, Math.floor(block.count || 1)));
        for (let i = 0; i < count; i++) {
          const r = await this.executeBlocks(block.body);
          if (r !== 'done') return r;
        }
      } else if (block.type === 'ifCanMove') {
        if (this.canMoveForward()) {
          const r = await this.executeBlocks(block.body);
          if (r !== 'done') return r;
        }
      } else {
        const r = await this.executePrimitive(block.type);
        if (r !== 'done') return r;
      }
    }
    return 'done';
  }

  canMoveForward() {
    const d = DIRS[this.robot.dir];
    return this.canMoveTo(this.robot.col + d.dx, this.robot.row + d.dy);
  }

  async executePrimitive(type) {
    if (type === 'forward') {
      const d = DIRS[this.robot.dir];
      const nc = this.robot.col + d.dx;
      const nr = this.robot.row + d.dy;
      if (!this.canMoveTo(nc, nr)) return 'blocked';
      this.robot.col = nc;
      this.robot.row = nr;
      await this.tween({ dx: nc, dy: nr }, MOVE_MS);
      return 'done';
    }
    if (type === 'backward') {
      const d = DIRS[this.robot.dir];
      const nc = this.robot.col - d.dx;
      const nr = this.robot.row - d.dy;
      if (!this.canMoveTo(nc, nr)) return 'blocked';
      this.robot.col = nc;
      this.robot.row = nr;
      await this.tween({ dx: nc, dy: nr }, MOVE_MS);
      return 'done';
    }
    if (type === 'turnLeft') {
      this.robot.dir = (this.robot.dir + 3) % 4;
      await this.tween({ dAngle: this.dAngle - Math.PI / 2 }, TURN_MS);
      return 'done';
    }
    if (type === 'turnRight') {
      this.robot.dir = (this.robot.dir + 1) % 4;
      await this.tween({ dAngle: this.dAngle + Math.PI / 2 }, TURN_MS);
      return 'done';
    }
    return 'done';
  }

  tween(target, duration) {
    return new Promise((resolve) => {
      const from = { dx: this.dx, dy: this.dy, dAngle: this.dAngle };
      const to = {
        dx: target.dx ?? this.dx,
        dy: target.dy ?? this.dy,
        dAngle: target.dAngle ?? this.dAngle,
      };
      const t0 = performance.now();
      const step = (now) => {
        if (!this.isRunning || !this.executing) return resolve();
        const t = Math.min(1, (now - t0) / duration);
        const e = easeInOutQuad(t);
        this.dx = from.dx + (to.dx - from.dx) * e;
        this.dy = from.dy + (to.dy - from.dy) * e;
        this.dAngle = from.dAngle + (to.dAngle - from.dAngle) * e;
        this.draw();
        if (t < 1) requestAnimationFrame(step);
        else resolve();
      };
      requestAnimationFrame(step);
    });
  }

  canMoveTo(c, r) {
    if (c < 0 || c >= this.gridSize || r < 0 || r >= this.gridSize) return false;
    if (this.walls.has(`${c},${r}`)) return false;
    return true;
  }

  /* ---------- Success screen ---------- */

  countBlocks(list) {
    let n = 0;
    for (const b of list) {
      n++;
      if (Array.isArray(b.body)) n += this.countBlocks(b.body);
    }
    return n;
  }

  calculateStars(count) {
    if (count <= this.starThresholds.three) return 3;
    if (count <= this.starThresholds.two) return 2;
    return 1;
  }

  getStarFeedback(stars) {
    if (stars === 3) return 'Perfect — most efficient solution possible.';
    if (stars === 2) return 'Well done. Can you shrink it further with loops?';
    return 'Goal reached. Try condensing repeated blocks with Repeat.';
  }

  showSuccessScreen() {
    if (!this.overlay || this.successScreenEl) return;

    const totalBlocks = this.countBlocks(this.program);
    const stars = this.calculateStars(totalBlocks);
    const bestStars = saveLevelStars(this.levelId, stars);
    const isNewBest = stars >= bestStars && stars > 0;

    const backdrop = document.createElement('div');
    Object.assign(backdrop.style, {
      position: 'absolute',
      inset: '0',
      background: 'rgba(6, 10, 22, 0.72)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: '20',
      animation: 'rlg-fade-in 0.25s ease forwards',
      backdropFilter: 'blur(3px)',
    });
    this.successScreenEl = backdrop;

    const card = document.createElement('div');
    Object.assign(card.style, {
      background: 'linear-gradient(180deg, #2a3250, #1c2238)',
      border: '1px solid #3a4466',
      borderRadius: '14px',
      padding: '32px 44px',
      textAlign: 'center',
      minWidth: '400px',
      maxWidth: '480px',
      boxShadow: '0 22px 60px rgba(0,0,0,0.5)',
      animation: 'rlg-modal-in 0.45s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
    });

    const title = document.createElement('h2');
    title.textContent = 'Level Complete';
    Object.assign(title.style, {
      margin: '0 0 6px 0',
      fontSize: '26px',
      fontWeight: '700',
      color: '#ffffff',
    });
    card.appendChild(title);

    const subtitle = document.createElement('p');
    subtitle.textContent = this.getStarFeedback(stars);
    Object.assign(subtitle.style, {
      margin: '0 0 6px 0',
      fontSize: '14px',
      opacity: '0.8',
      lineHeight: '1.4',
    });
    card.appendChild(subtitle);

    if (isNewBest && bestStars > 0) {
      const badge = document.createElement('div');
      badge.textContent = 'New Best!';
      Object.assign(badge.style, {
        display: 'inline-block',
        margin: '0 auto 16px',
        padding: '3px 10px',
        background: 'rgba(255,216,74,0.15)',
        color: '#ffd84a',
        border: '1px solid rgba(255,216,74,0.4)',
        borderRadius: '12px',
        fontSize: '11px',
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: '0.1em',
      });
      card.appendChild(badge);
    } else {
      const spacer = document.createElement('div');
      spacer.style.height = '16px';
      card.appendChild(spacer);
    }

    const starsRow = document.createElement('div');
    Object.assign(starsRow.style, {
      display: 'flex',
      gap: '14px',
      justifyContent: 'center',
      marginBottom: '24px',
    });
    for (let i = 0; i < 3; i++) {
      starsRow.appendChild(this.makeStar(i < stars, 220 + i * 220));
    }
    card.appendChild(starsRow);

    const stats = document.createElement('div');
    Object.assign(stats.style, {
      display: 'flex',
      gap: '32px',
      justifyContent: 'center',
      marginBottom: '24px',
    });
    stats.appendChild(this.makeStat('Blocks used', String(totalBlocks)));
    stats.appendChild(this.makeStat('Best possible', String(this.starThresholds.three)));
    stats.appendChild(this.makeStat('Stars', `${stars} / 3`));
    card.appendChild(stats);

    const buttons = document.createElement('div');
    Object.assign(buttons.style, {
      display: 'flex',
      gap: '10px',
      justifyContent: 'center',
    });

    const againBtn = document.createElement('button');
    againBtn.textContent = 'Try Again';
    this.styleSuccessButton(againBtn, '#4f9dff');
    againBtn.addEventListener('click', () => {
      this.dismissSuccessScreen();
      this.program.length = 0;
      this.resetRobot();
      this.renderProgram();
      this.draw();
      this.setStatus('idle', 'Build a more efficient program and run it again.');
    });
    buttons.appendChild(againBtn);

    const continueBtn = document.createElement('button');
    continueBtn.textContent = this.onContinue ? 'Next Level' : 'Continue';
    this.styleSuccessButton(continueBtn, '#2ea66a');
    continueBtn.addEventListener('click', () => {
      this.dismissSuccessScreen();
      if (this.onContinue) {
        const cb = this.onContinue;
        this.stop();
        cb();
      }
    });
    buttons.appendChild(continueBtn);

    card.appendChild(buttons);
    backdrop.appendChild(card);
    this.overlay.appendChild(backdrop);
  }

  dismissSuccessScreen() {
    if (this.successScreenEl?.parentNode) {
      this.successScreenEl.parentNode.removeChild(this.successScreenEl);
    }
    this.successScreenEl = null;
  }

  makeStar(filled, delayMs) {
    const svgNS = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(svgNS, 'svg');
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('width', '72');
    svg.setAttribute('height', '72');
    Object.assign(svg.style, {
      opacity: '0',
      transformOrigin: 'center',
      animation: `rlg-star-pop 0.55s cubic-bezier(0.34, 1.56, 0.64, 1) ${delayMs}ms forwards`,
      filter: filled ? 'drop-shadow(0 0 14px rgba(255,216,74,0.55))' : 'none',
    });
    const path = document.createElementNS(svgNS, 'path');
    path.setAttribute(
      'd',
      'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z'
    );
    path.setAttribute('fill', filled ? '#ffd84a' : '#2a3047');
    path.setAttribute('stroke', filled ? '#ffb800' : '#3a4466');
    path.setAttribute('stroke-width', '0.6');
    path.setAttribute('stroke-linejoin', 'round');
    svg.appendChild(path);
    return svg;
  }

  makeStat(label, value) {
    const wrap = document.createElement('div');
    const l = document.createElement('div');
    l.textContent = label;
    Object.assign(l.style, {
      opacity: '0.6',
      fontSize: '11px',
      textTransform: 'uppercase',
      letterSpacing: '0.1em',
    });
    wrap.appendChild(l);
    const v = document.createElement('div');
    v.textContent = value;
    Object.assign(v.style, {
      fontSize: '22px',
      fontWeight: '700',
      marginTop: '4px',
      color: '#fff',
    });
    wrap.appendChild(v);
    return wrap;
  }

  styleSuccessButton(btn, bg) {
    Object.assign(btn.style, {
      padding: '11px 22px',
      background: bg,
      color: '#fff',
      border: 'none',
      borderRadius: '6px',
      cursor: 'pointer',
      fontWeight: '600',
      fontSize: '14px',
    });
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
          ctx.fillStyle = 'rgba(255,255,255,0.08)';
          ctx.fillRect(x + 2, y + 2, s - 4, Math.floor((s - 4) * 0.3));
        }
      }
    }

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

    this.drawGoal();
    this.drawRobot();
  }

  drawGoal() {
    const ctx = this.ctx;
    const s = this.cellSize;
    const gx = this.goal.col * s;
    const gy = this.goal.row * s;
    ctx.fillStyle = '#2ea66a';
    ctx.fillRect(gx + 6, gy + 6, s - 12, s - 12);
    ctx.fillStyle = 'rgba(255,255,255,0.18)';
    ctx.fillRect(gx + 12, gy + 12, s - 24, s - 24);
  }

  drawRobot() {
    const ctx = this.ctx;
    const s = this.cellSize;
    const cx = this.dx * s + s / 2;
    const cy = this.dy * s + s / 2;
    const radius = s * 0.35;

    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(this.dAngle);

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

function easeInOutQuad(t) {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
}

export function mountLevel({ levelId, onClose } = {}) {
  const cfg = levelConfigs.find((c) => c.id === levelId);
  if (!cfg) {
    console.error(`[robot-logic-game] No level config for id ${levelId}`);
    return null;
  }
  const level = new RobotLogicLevel(cfg);
  if (typeof onClose === 'function') level.onExit = onClose;
  level.start();
  return level;
}

export default RobotLogicLevel;
