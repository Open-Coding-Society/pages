
import GameEnvBackground from '@assets/js/GameEnginev1.1/essentials/GameEnvBackground.js';

/**
 * Maze Game with Head Tracking Control
 * 
 * Player controls a circle with head tracking (via mouse events).
 * Navigate through the maze without hitting walls.
 * Hit a wall and it's game over. Reach the exit to win!
 */

class MazeRenderer {
  constructor(gameEnv, width, height) {
    this.gameEnv = gameEnv;
    this.width = width;
    this.height = height;
    this.canvas = null;
    this.ctx = null;
    this.walls = [];
    this.generateMaze();
  }

  generateMaze() {
    // Simple maze layout: array of wall rectangles
    // Format: { x, y, w, h }
    // Outer boundaries
    this.walls = [
      // Outer walls
      { x: 0, y: 0, w: this.width, h: 20 },           // Top
      { x: 0, y: this.height - 20, w: this.width, h: 20 },  // Bottom
      { x: 0, y: 0, w: 20, h: this.height },          // Left
      { x: this.width - 20, y: 0, w: 20, h: this.height },  // Right

      // Interior maze walls
      { x: 150, y: 80, w: 200, h: 20 },     // Wall 1
      { x: 300, y: 80, w: 20, h: 150 },     // Wall 2
      { x: 80, y: 180, w: 200, h: 20 },     // Wall 3
      { x: 80, y: 180, w: 20, h: 150 },     // Wall 4
      { x: 250, y: 280, w: 150, h: 20 },    // Wall 5
      { x: 150, y: 250, w: 20, h: 80 },     // Wall 6
      { x: 350, y: 250, w: 20, h: 100 },    // Wall 7
      { x: 80, y: 380, w: 300, h: 20 },     // Wall 8
      { x: 450, y: 150, w: 20, h: 200 },    // Wall 9
      { x: 200, y: 420, w: 200, h: 20 },    // Wall 10
    ];
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

    // Draw exit zone (top right corner)
    this.ctx.fillStyle = '#2ecc71';
    this.ctx.fillRect(this.width - 80, 20, 60, 60);
    this.ctx.fillStyle = '#fff';
    this.ctx.font = 'bold 12px Arial';
    this.ctx.fillText('EXIT', this.width - 70, 55);
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
    const exitY = 50;
    const exitRadius = 40;
    const dist = Math.sqrt((x - exitX) ** 2 + (y - exitY) ** 2);
    return dist < radius + exitRadius;
  }
}

class GameHUD {
  constructor(gameEnv) {
    this.gameEnv = gameEnv;
    this.statusEl = null;
    this.timerEl = null;
    this.startTime = Date.now();
    this.gameOver = false;
    this.createHUD();
  }

  createHUD() {
this.statusEl = document.createElement('div');
    this.statusEl.id = 'maze-status';
    this.statusEl.style.cssText = `
      position: absolute; 
      top: 20px;
      left: 20px;
      background: rgba(0,0,0,0.85);
      color: #00ff00;
      padding: 15px 20px;
      border-radius: 8px;
      font-family: 'Courier New', monospace;
      font-size: 16px;
      font-weight: bold;
      z-index: 1002;
      border: 2px solid #00ff00;
      min-width: 200px;
    `;
    this.gameEnv.gameContainer.appendChild(this.statusEl);
    this.update();
  }

  update() {
    if (this.gameOver) return;
    const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
    this.statusEl.innerHTML = `
      🎮 MAZE RUNNER<br>
      ⏱️ Time: ${elapsed}s<br>
      📍 Navigate to GREEN exit<br>
      ⚠️ Avoid RED walls!
    `;
  }

  setGameOver(won) {
    this.gameOver = true;
    const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
    if (won) {
      this.statusEl.style.color = '#2ecc71';
      this.statusEl.style.borderColor = '#2ecc71';
      this.statusEl.innerHTML = `
        🎮 MAZE RUNNER<br>
        ✅ YOU WIN!<br>
        ⏱️ Time: ${elapsed}s<br>
        🔄 Refresh to play again
      `;
    } else {
      this.statusEl.style.color = '#e74c3c';
      this.statusEl.style.borderColor = '#e74c3c';
      this.statusEl.innerHTML = `
        🎮 MAZE RUNNER<br>
        ❌ GAME OVER!<br>
        Hit a wall after ${elapsed}s<br>
        🔄 Refresh to try again
      `;
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
    this.speed = 1.2;
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
    const width = gameEnv.innerWidth;
    const height = gameEnv.innerHeight;

    // Track mouse for head tracking
    window.targetMouseX = width * 0.5;
    window.targetMouseY = height * 0.5;
    if (!window.nodMouseTrackerEnabled) {
      window.nodMouseTrackerEnabled = true;
      window.addEventListener('mousemove', (e) => {
        window.targetMouseX = e.clientX;
        window.targetMouseY = e.clientY;
      });
    }

    // Create maze
    const maze = new MazeRenderer(gameEnv, width, height);
    maze.render();

    // Create player
    const player = new MazePlayer(gameEnv, width, height);
    player.render();

    // Create HUD
    const hud = new GameHUD(gameEnv);

    // Game state
    let gameActive = true;

    // Game loop
    const gameLoop = setInterval(() => {
      if (!gameActive) {
        clearInterval(gameLoop);
        return;
      }

      // Update player position based on head tracking
      if (window.targetMouseX !== undefined && window.targetMouseY !== undefined) {
        player.update(window.targetMouseX, window.targetMouseY);
      }

      const pos = player.getPosition();

      // Check collision with walls
      if (maze.checkCollision(pos.x, pos.y, player.radius)) {
        gameActive = false;
        hud.setGameOver(false);
        clearInterval(gameLoop);
        return;
      }

      // Check if reached exit
      if (maze.checkExit(pos.x, pos.y, player.radius)) {
        gameActive = false;
        hud.setGameOver(true);
        clearInterval(gameLoop);
        return;
      }

      // Update HUD timer
      hud.update();

      // Render
      player.render();
    }, 1000 / 60); // 60 FPS

    // Store reference for cleanup
    gameEnv.mazeGameLoop = gameLoop;

    // Simplified classes array (GameControl still expects this)
    this.classes = [
      {
        class: GameEnvBackground,
        data: {
          id: 'MazeBackground',
          src: '', // We're drawing our own
          pixels: { height: height, width: width }
        }
      }
    ];
  }
}


export default GameLevelNod;

