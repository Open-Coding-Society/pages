import Player from '@assets/js/GameEnginev1.1/essentials/Player.js';
import Npc from '@assets/js/GameEnginev1.1/essentials/Npc.js';

const COLUMNS = 20;
const ROWS = 12;
const STEP_MS = 220;
const DIRECTIONS = {
  87: { x: 0, y: -1 }, 38: { x: 0, y: -1 },
  65: { x: -1, y: 0 }, 37: { x: -1, y: 0 },
  83: { x: 0, y: 1 }, 40: { x: 0, y: 1 },
  68: { x: 1, y: 0 }, 39: { x: 1, y: 0 },
};

function board(env) {
  const cell = Math.floor(Math.min(env.innerWidth / COLUMNS, env.innerHeight / ROWS) * 0.9);
  return {
    cell,
    left: (env.innerWidth - COLUMNS * cell) / 2,
    top: (env.innerHeight - ROWS * cell) / 2,
  };
}

function sameCell(a, b) {
  return a.x === b.x && a.y === b.y;
}

export class SnakePlayer extends Player {
  constructor(data, env) {
    super(data, env);
    this.gate = data.gate;
    this.segments = [{ x: 4, y: Math.floor(ROWS / 2) }];
    this.direction = { x: 1, y: 0 };
    this.nextDirection = this.direction;
    this.resetAnimationClock();
    const interact = this.touchControls.controlsContainer.querySelector('.interact-button');
    if (interact) interact.style.display = 'none';
  }

  handleKeyDown(event) {
    const next = DIRECTIONS[event.keyCode];
    const editing = event.target?.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(event.target?.tagName || '');
    if (!next || editing || event.altKey || event.ctrlKey || event.metaKey ||
        this.gameEnv.gameControl.isPaused || this.gate?.isComplete()) return;
    event.preventDefault();
    if (next.x !== -this.direction.x || next.y !== -this.direction.y) this.nextDirection = next;
  }

  handleKeyUp() {}

  resetAnimationClock() {
    this.lastStep = performance.now();
  }

  update() {
    if (!this.gameEnv.gameControl.isPaused && !this.gate.isComplete()) {
      const now = performance.now();
      if (now - this.lastStep >= STEP_MS) {
        this.lastStep = now;
        this.step();
      }
    }
    this.draw();
  }

  step() {
    this.direction = this.nextDirection;
    const head = { x: this.segments[0].x + this.direction.x, y: this.segments[0].y + this.direction.y };
    const apple = this.gameEnv.gameObjects.find(object => object instanceof SnakeApple);
    const eating = sameCell(head, apple.cell);
    const body = eating ? this.segments : this.segments.slice(0, -1);
    if (head.x < 0 || head.x >= COLUMNS || head.y < 0 || head.y >= ROWS ||
        body.some(segment => sameCell(segment, head))) {
      this.segments = [{ x: 4, y: Math.floor(ROWS / 2) }];
      this.direction = { x: 1, y: 0 };
      this.nextDirection = this.direction;
      this.gate.resetScore();
      apple.relocate(this.segments);
      return;
    }
    this.segments.unshift(head);
    if (eating) {
      this.gate.recordApple();
      if (!this.gate.isComplete()) apple.relocate(this.segments);
    } else {
      this.segments.pop();
    }
  }

  resize() {
    const { cell, left, top } = board(this.gameEnv);
    this.canvas.width = COLUMNS * cell;
    this.canvas.height = ROWS * cell;
    Object.assign(this.canvas.style, {
      position: 'absolute', left: `${left}px`, top: `${top}px`,
      width: `${this.canvas.width}px`, height: `${this.canvas.height}px`, zIndex: '1',
    });
  }

  draw() {
    const cell = this.canvas.width / COLUMNS;
    this.ctx.fillStyle = '#224c97';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.segments.forEach((segment, index) => {
      this.ctx.fillStyle = index === 0 ? '#a7f36a' : '#58c64b';
      this.ctx.fillRect(segment.x * cell + 2, segment.y * cell + 2, cell - 4, cell - 4);
    });
  }
}

export class SnakeApple extends Npc {
  constructor(data, env) {
    super(data, env);
    this.relocate([{ x: 4, y: Math.floor(ROWS / 2) }]);
  }

  relocate(segments) {
    const available = [];
    for (let y = 0; y < ROWS; y++) {
      for (let x = 0; x < COLUMNS; x++) {
        if (!segments.some(segment => segment.x === x && segment.y === y)) available.push({ x, y });
      }
    }
    if (!available.length) throw new Error('No open cell remains for the snake apple.');
    this.cell = available[Math.floor(Math.random() * available.length)];
  }

  update() {
    this.draw();
  }

  resize() {
    const { cell } = board(this.gameEnv);
    this.canvas.width = cell;
    this.canvas.height = cell;
    this.canvas.style.position = 'absolute';
    this.canvas.style.width = `${cell}px`;
    this.canvas.style.height = `${cell}px`;
    this.canvas.style.zIndex = '2';
  }

  draw() {
    const { cell, left, top } = board(this.gameEnv);
    this.canvas.style.left = `${left + this.cell.x * cell}px`;
    this.canvas.style.top = `${top + this.cell.y * cell}px`;
    this.ctx.clearRect(0, 0, cell, cell);
    this.ctx.fillStyle = '#f13c35';
    this.ctx.beginPath();
    this.ctx.arc(cell / 2, cell * 0.56, cell * 0.34, 0, Math.PI * 2);
    this.ctx.fill();
    this.ctx.fillStyle = '#5abf44';
    this.ctx.fillRect(cell * 0.48, cell * 0.08, cell * 0.12, cell * 0.2);
  }
}
