
import GameEnvBackground from '@assets/js/GameEnginev1.1/essentials/GameEnvBackground.js';

/**
 * Maze Game with Head Tracking Control
 * 
 * Player controls a circle with head tracking (via mouse events).
 * Navigate through the maze without hitting walls.
 * Hit a wall and it's game over. Reach the exit to win!
 */

class MazeRenderer {
  constructor(gameEnv, width, height, level = 1) {
    this.gameEnv = gameEnv;
    this.width = width;
    this.height = height;
    this.level = level;
    this.canvas = null;
    this.ctx = null;
    this.walls = [];
    this.generateMaze();
  }

  generateMaze() {
    // Standard Outer Boundaries for all levels
    this.walls = [
      { x: 0, y: 0, w: this.width, h: 20 },
      { x: 0, y: this.height - 20, w: this.width, h: 20 },
      { x: 0, y: 0, w: 20, h: this.height },
      { x: this.width - 20, y: 0, w: 20, h: this.height },
    ];

    if (this.level === 1) {
      // Level 1: Horizontal Barriers
      this.walls.push(
        { x: 20, y: 150, w: this.width - 150, h: 20 },
        { x: 150, y: 300, w: this.width - 170, h: 20 },
        { x: 20, y: 450, w: this.width - 150, h: 20 }
      );
    } else if (this.level === 2) {
      // Level 2: Vertical Barriers (Requires moving left/right)
      this.walls.push(
        { x: this.width * 0.25, y: 20, w: 20, h: this.height - 150 },
        { x: this.width * 0.50, y: 130, w: 20, h: this.height - 150 },
        { x: this.width * 0.75, y: 20, w: 20, h: this.height - 150 }
      );
    } else if (this.level === 3) {
      // Level 3: The Mix (Hardest)
      this.walls.push(
        { x: 20, y: 150, w: this.width - 250, h: 20 }, // Horizontal
        { x: this.width - 150, y: 150, w: 20, h: this.height - 300 }, // Vertical
        { x: 150, y: this.height - 150, w: this.width - 170, h: 20 }, // Horizontal
        { x: 300, y: 150, w: 20, h: 140 } // Vertical blocker
      );
    }
  }

  render() {
    if (!this.canvas) {
      this.canvas = document.createElement('canvas');
      this.canvas.width = this.width;
      this.canvas.height = this.height;
      this.canvas.style.position = 'absolute';
      this.canvas.style.top = '0';
      this.canvas.style.left = '0';
      this.canvas.style.zIndex = '1';
      this.canvas.style.pointerEvents = 'none';
      this.gameEnv.gameContainer.appendChild(this.canvas);
      this.ctx = this.canvas.getContext('2d');
    }

    // Clear canvas
    this.ctx.fillStyle = '#1a1a2e';
    this.ctx.fillRect(0, 0, this.width, this.height);

    // Draw walls
    this.ctx.fillStyle = '#e74c3c';
    for (const wall of this.walls) {
      this.ctx.fillRect(wall.x, wall.y, wall.w, wall.h);
    }

    // Draw exit zone (Bottom Right)
    this.ctx.fillStyle = '#2ecc71';
    this.ctx.fillRect(this.width - 80, this.height - 80, 60, 60);
    this.ctx.fillStyle = '#fff';
    this.ctx.font = 'bold 12px Arial';
    this.ctx.fillText(`EXIT L${this.level}`, this.width - 75, this.height - 45);
  }

  checkCollision(x, y, radius) {
    // Check against all walls
    for (const wall of this.walls) {
      if (
        x + radius > wall.x &&
        x - radius < wall.x + wall.w &&
        y + radius > wall.y &&
        y - radius < wall.y + wall.h
      ) {
        return true; // Collision detected
      }
    }
    return false;
  }

  checkExit(x, y, radius) {
    const exitX = this.width - 50;
    const exitY = this.height - 50;
    const exitRadius = 40;
    const dist = Math.sqrt((x - exitX) ** 2 + (y - exitY) ** 2);
    return dist < radius + exitRadius;
  }
}

class GameHUD {
  constructor(gameEnv, onRestart) {
    this.gameEnv = gameEnv;
    this.onRestart = onRestart;
    this.lives = 5;
    this.statusEl = null;
    this.startTime = Date.now();
    this.gameOver = false;
    this.createHUD();
  }

  createHUD() {
    this.statusEl = document.createElement('div');
    this.statusEl.style.cssText = `
            position: absolute; 
            bottom: 20px; 
            left: 20px;
            color: #00ff00;
            font-family: 'Courier New', monospace; 
            font-size: 14px;
            text-align: left;
            z-index: 1002;
            pointer-events: none; /* Mouse moves 'through' the text */
        `;
    this.gameEnv.gameContainer.appendChild(this.statusEl);
    this.update(1); // Initialize with Level 1
  }

  update(level = 1) {
    if (this.gameOver) return;
    const elapsed = Math.floor((Date.now() - this.startTime) / 1000);

    this.statusEl.innerHTML = `
            L1-L3 | LEVEL: ${level} | LIVES: ${this.lives} | TIME: ${elapsed}s<br>
            <span id="restart-btn" style="cursor:pointer; pointer-events: auto; text-decoration: underline; font-size: 12px;">[RESTART GAME]</span>
        `;

    const btn = document.getElementById('restart-btn');
    if (btn) {
      btn.onclick = (e) => {
        e.stopPropagation();
        this.onRestart();
      };
    }
  }

  setGameOver(won) {
    this.gameOver = true;
    this.statusEl.style.fontSize = '20px';
    this.statusEl.innerHTML = won ? "🏆 MISSION COMPLETE!" : "❌ GAME OVER";
    this.statusEl.innerHTML += `
            <br><span id="restart-btn" style="cursor:pointer; pointer-events: auto; text-decoration: underline; font-size: 14px;">[PLAY AGAIN]</span>
        `;

    const btn = document.getElementById('restart-btn');
    if (btn) {
      btn.onclick = () => this.onRestart();
    }
  }
}

class MazePlayer {
  constructor(gameEnv, width, height) {
    this.gameEnv = gameEnv;
    this.width = width;
    this.height = height;
    this.x = 50;
    this.y = 50;
    this.radius = 12;
    this.speed = 2.5;
    this.canvas = null;
    this.ctx = null;
    this.createCanvas();
  }

  createCanvas() {
    this.canvas = document.createElement('canvas');
    this.canvas.width = this.width;
    this.canvas.height = this.height;
    this.canvas.style.position = 'absolute';
    this.canvas.style.top = '0';
    this.canvas.style.left = '0';
    this.canvas.style.zIndex = '10';
    this.canvas.style.pointerEvents = 'none';
    this.gameEnv.gameContainer.appendChild(this.canvas);
    this.ctx = this.canvas.getContext('2d');
  }

  update(targetX, targetY) {
    // Move towards target (from head tracking)
    const dx = targetX - this.x;
    const dy = targetY - this.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist > 5) {
      const angle = Math.atan2(dy, dx);
      this.x += Math.cos(angle) * this.speed;
      this.y += Math.sin(angle) * this.speed;
    }

    // Keep in bounds
    this.x = Math.max(this.radius, Math.min(this.width - this.radius, this.x));
    this.y = Math.max(this.radius, Math.min(this.height - this.radius, this.y));
  }

  render() {
    this.ctx.clearRect(0, 0, this.width, this.height);

    // Draw player circle
    this.ctx.fillStyle = '#00ffff';
    this.ctx.beginPath();
    this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    this.ctx.fill();

    // Draw glow
    this.ctx.strokeStyle = 'rgba(0, 255, 255, 0.5)';
    this.ctx.lineWidth = 2;
    this.ctx.beginPath();
    this.ctx.arc(this.x, this.y, this.radius + 5, 0, Math.PI * 2);
    this.ctx.stroke();
  }

  getPosition() {
    return { x: this.x, y: this.y };
  }
}

// GAME LEVEL
class GameLevelNod {
  constructor(gameEnv) {
    this.gameEnv = gameEnv; // Store for cleanup
    const width = gameEnv.innerWidth;
    const height = gameEnv.innerHeight;

    let currentLevel = 1;
    let gameActive = true;

    // 1. Setup Tracking
    window.targetMouseX = width * 0.5;
    window.targetMouseY = height * 0.5;
    if (!window.nodMouseTrackerEnabled) {
      window.nodMouseTrackerEnabled = true;
      window.addEventListener('mousemove', (e) => {
        window.targetMouseX = e.clientX;
        window.targetMouseY = e.clientY;
      });
    }

    // 2. Initialize Game Objects
    let maze = new MazeRenderer(gameEnv, width, height);
    maze.render();

    const player = new MazePlayer(gameEnv, width, height);

    // Define the reset function BEFORE the HUD so the HUD can use it
    const resetGame = () => {

      currentLevel = 1;
      // Reset player position
      player.x = 50;
      player.y = 50;

      // Reset HUD state
      hud.lives = 5;
      hud.gameOver = false;
      hud.startTime = Date.now();

      // Resume game logic
      maze = new MazeRenderer(gameEnv, width, height, currentLevel);
      maze.render();
      gameActive = true;

      // Clear old loop and start a new one to prevent "double speed" bugs
      if (this.gameEnv.mazeGameLoop) clearInterval(this.gameEnv.mazeGameLoop);
      this.gameEnv.mazeGameLoop = setInterval(runLoop, 1000 / 60);
    };

    // 3. Create HUD (Passing the resetGame function as a callback)
    const hud = new GameHUD(gameEnv, resetGame);

    // 4. The Loop Logic
    const runLoop = () => {
      if (!gameActive) return;

      if (window.targetMouseX !== undefined && window.targetMouseY !== undefined) {
        player.update(window.targetMouseX, window.targetMouseY);
      }

      const pos = player.getPosition();

      // COLLISION
      if (maze.checkCollision(pos.x, pos.y, player.radius)) {
        hud.lives -= 1;

        if (hud.lives <= 0) {
          gameActive = false;
          hud.setGameOver(false);
          return;
        } else {
          // Soft Reset: Send player back to start
          player.x = 50;
          player.y = 50;
        }
      }

      if (maze.checkExit(pos.x, pos.y, player.radius)) {
        if (currentLevel < 3) {
          currentLevel++;
          player.x = 50;
          player.y = 50;
          maze = new MazeRenderer(gameEnv, width, height, currentLevel);
          maze.render();
        } else {
          gameActive = false;
          hud.setGameOver(true);
        }
      }

      hud.update(currentLevel);
      player.render();
    };

    // Start the loop
    this.gameEnv.mazeGameLoop = setInterval(runLoop, 1000 / 60);

    this.classes = [
      {
        class: GameEnvBackground,
        data: { id: 'MazeBackground', src: '', pixels: { height: height, width: width } }
      }
    ];
  }
  destroy() {
    if (this.gameEnv.mazeGameLoop) {
        clearInterval(this.gameEnv.mazeGameLoop);
    }
    window.removeEventListener('mousemove', this.mouseHandler);
    if (this.maze && this.maze.canvas) this.maze.canvas.remove();
    if (this.player && this.player.canvas) this.player.canvas.remove();
    if (this.hud && this.hud.statusEl) this.hud.statusEl.remove();
}
}


export default GameLevelNod;

