import GameEnvBackground from '../../../GameEnginev1.1/essentials/GameEnvBackground.js';
import Player from '../../../GameEnginev1.1/essentials/Player.js';
import Npc from '../../../GameEnginev1.1/essentials/Npc.js';
import Coin from '../../../GameEnginev1.1/Coin.js';
import Barrier from '../../../GameEnginev1.1/essentials/Barrier.js';
import Leaderboard from '../../../GameEnginev1.1/essentials/Leaderboard.js';
import DialogueSystem from '../../../GameEnginev1.1/essentials/DialogueSystem.js';

class GameLevelBasketball {
  constructor(gameEnv) {
    this.gameEnv = gameEnv;
    const width = gameEnv.innerWidth;
    const height = gameEnv.innerHeight;
    const path = gameEnv.path;
    this.playerStart = { x: Math.round(width * 0.12), y: Math.round(height * 0.68) };
    this.chaserStart = { x: Math.round(width * 0.72), y: Math.round(height * 0.55) };

    this.caught = false;
    this.caughtAt = 0; 
    this.roundResetDelayMs = 1400; 
    this.startTime = 0;
    this.currentTime = 0;
    this.bestTime = this.loadBestTime();
    this.bestCoins = this.loadBestCoins();
    this.timeHud = null;
    this.messageHud = null;
    this.bottomNav = null; 
    this.leaderboard = null;
    this.introDialogue = null; 
    this.preGameLocked = true; 
    this.scoreSubmittedThisRound = false; 
    this.handleRestartKey = this.handleRestartKey.bind(this); 
    this.handleShootKey = this.handleShootKey.bind(this); 
    this.projectiles = [];
    this.projectileSpeed = 9; 
    this.projectileRadius = 10; 
    this.projectileLifeMs = 2200; 
    this.shootCooldownMs = 5000; 
    this.lastShotAt = -Infinity; 
    this.lebronStunUntil = 0;
    this.lebronStunDurationMs = 3000;

    const image_src_court = path + '/images/projects/characters/BaskCourt.png';
    const image_data_court = {
      id: 'BasketballCourt',
      src: image_src_court,
      pixels: { height: 720, width: 1478 }
    };

    const sprite_src_player = path + '/images/projects/characters/astro.png';
    const sprite_data_player = {
      id: 'BasketballPlayer',
      greeting: 'Ball handler ready.',
      src: sprite_src_player,
      SCALE_FACTOR: 11,
      STEP_FACTOR: 1000,
      ANIMATION_RATE: 110,
      INIT_POSITION: { ...this.playerStart },
      pixels: { height: 770, width: 513 },
      orientation: { rows: 4, columns: 4 },
      down:      { row: 0, start: 0, columns: 4 },
      left:      { row: 1, start: 0, columns: 4 },
      right:     { row: 2, start: 0, columns: 4 },
      up:        { row: 3, start: 0, columns: 4 },
      downRight: { row: 2, start: 0, columns: 4 },
      downLeft:  { row: 1, start: 0, columns: 4 },
      upRight:   { row: 2, start: 0, columns: 4 },
      upLeft:    { row: 1, start: 0, columns: 4 },
      hitbox: { widthPercentage: 0.45, heightPercentage: 0.5 },
      keypress: { up: 87, left: 65, down: 83, right: 68 }
    };

    const sprite_src_chaser = path + '/images/projects/characters/kirby.png';
    const sprite_data_chaser = {
      id: 'LeBron',
      greeting: 'You reached LeBron.',
      src: sprite_src_chaser,
      SCALE_FACTOR: 7,
      ANIMATION_RATE: 8,
      INIT_POSITION: { ...this.chaserStart },
      pixels: { height: 36, width: 569 },
      orientation: { rows: 1, columns: 13 },
      down:      { row: 0, start: 0, columns: 13 },
      left:      { row: 0, start: 0, columns: 13 },
      right:     { row: 0, start: 0, columns: 13 },
      up:        { row: 0, start: 0, columns: 13 },
      downRight: { row: 0, start: 0, columns: 13 },
      downLeft:  { row: 0, start: 0, columns: 13 },
      upRight:   { row: 0, start: 0, columns: 13 },
      upLeft:    { row: 0, start: 0, columns: 13 },
      hitbox: { widthPercentage: 0.2, heightPercentage: 0.2 },
      dialogues: ['LeBron is in the gym.'],
      reaction: function () {
        if (this.dialogueSystem) this.showReactionDialogue();
      },
      interact: function () {
        if (this.dialogueSystem) this.showRandomDialogue();
      }
    };

    const coin_1 = {
      id: 'coin_1',
      INIT_POSITION: { x: Math.round(width * 0.25), y: Math.round(height * 0.35) },
      SCALE_FACTOR: 18,
      value: 1
    };

    const coin_2 = {
      id: 'coin_2',
      INIT_POSITION: { x: Math.round(width * 0.50), y: Math.round(height * 0.65) },
      SCALE_FACTOR: 18,
      value: 1
    };

    const coin_3 = {
      id: 'coin_3',
      INIT_POSITION: { x: Math.round(width * 0.72), y: Math.round(height * 0.28) },
      SCALE_FACTOR: 18,
      value: 1
    };

    const barrier_bench_top = {
      id: 'barrier_bench_top',
      x: 0.07,
      y: 0.07,
      width: 0.86,
      height: 0.10,
      visible: false,
      hitbox: { widthPercentage: 0, heightPercentage: 0 }
    };

    const barrier_bench_bottom = {
      id: 'barrier_bench_bottom',
      x: 0.07,
      y: 0.83,
      width: 0.86,
      height: 0.10,
      visible: false,
      hitbox: { widthPercentage: 0, heightPercentage: 0 }
    };

    const barrier_gatorade_left = {
      id: 'barrier_gatorade_left',
      x: 0.03,
      y: 0.38,
      width: 0.05,
      height: 0.22,
      visible: false,
      hitbox: { widthPercentage: 0, heightPercentage: 0 }
    };

    const barrier_gatorade_right = {
      id: 'barrier_gatorade_right',
      x: 0.92,
      y: 0.38,
      width: 0.05,
      height: 0.22,
      visible: false,
      hitbox: { widthPercentage: 0, heightPercentage: 0 }
    };

    this.classes = [
      { class: GameEnvBackground, data: image_data_court },
      { class: Player, data: sprite_data_player },
      { class: Npc, data: sprite_data_chaser },
      { class: Coin, data: coin_1 },
      { class: Coin, data: coin_2 },
      { class: Coin, data: coin_3 },
      { class: Barrier, data: barrier_bench_top },
      { class: Barrier, data: barrier_bench_bottom },
      { class: Barrier, data: barrier_gatorade_left },
      { class: Barrier, data: barrier_gatorade_right }
    ];
  }

  initialize() {
    if (!this.gameEnv.stats) this.gameEnv.stats = {};
    this.gameEnv.stats.coinsCollected = 0;
    this.updateCoinSpawnBounds();
    this.applyCoinSpawnRules();
    this.startTime = 0;
    this.currentTime = 0;
    this.createHud();
    this.createBottomNav();
    this.updateHud();
    this.initLeaderboard();
    this.showIntroDialogue();
    document.addEventListener('keydown', this.handleRestartKey);
    document.addEventListener('keydown', this.handleShootKey);
  }

  update() {
    const player = this.findById('BasketballPlayer');
    const lebron = this.findById('LeBron');
    if (!player || !lebron) return;
    const now = performance.now();
    this.updateProjectiles(now, lebron);
    if (this.preGameLocked) return;

    if (!this.caught) {
      this.currentTime = (now - this.startTime) / 1000;
      this.updateHud();
    }

    if (this.caught) {
      if (now - this.caughtAt >= this.roundResetDelayMs) {
        this.resetRound();
      }
      return;
    }

    if (now < this.lebronStunUntil) {
      lebron.velocity.x = 0;
      lebron.velocity.y = 0;
      return;
    }

    // Calculate the direction from LeBron to the player so LeBron can chase
    const dx = player.position.x - lebron.position.x;
    const dy = player.position.y - lebron.position.y;
    const dist = Math.hypot(dx, dy);
    if (dist < 1) return;

    // Speed curve -> LeBron gets slightly faster over time but has a cap to keep the game fair
    const speed = Math.min(2.1 + this.currentTime * 0.03, 2.8);
    lebron.position.x += (dx / dist) * speed;
    lebron.position.y += (dy / dist) * speed;

    // Clamp LeBron's position so he can't leave the visible game area
    lebron.position.x = Math.max(0, Math.min(lebron.position.x, this.gameEnv.innerWidth - (lebron.width || 0)));
    lebron.position.y = Math.max(0, Math.min(lebron.position.y, this.gameEnv.innerHeight - (lebron.height || 0)));

    // Update LeBron's facing direction based on which axis he's moving more along
    if (Math.abs(dx) > Math.abs(dy)) {
      lebron.direction = dx >= 0 ? 'right' : 'left';
    } else {
      lebron.direction = dy >= 0 ? 'down' : 'up';
    }

    if (this.isHitboxCollision(player, lebron)) {
      this.caught = true;
      this.caughtAt = now;
      this.bestTime = Math.max(this.bestTime, this.currentTime);
      this.bestCoins = Math.max(this.bestCoins, this.getCoinsCollected());
      this.saveBestTime();
      this.saveBestCoins();
      this.submitRoundScore();
      this.showCaughtMessage();
      this.updateHud();
    }
  }

  handleShootKey(event) {
    if (event.key.toLowerCase() !== 'e' || event.repeat) return;
    if (this.preGameLocked || this.caught) return;
    const now = performance.now();
    if (now - this.lastShotAt < this.shootCooldownMs) return;

    const player = this.findById('BasketballPlayer');
    if (!player) return;

    this.lastShotAt = now;
    this.spawnProjectileFromPlayer(player, now);
  }

  spawnProjectileFromPlayer(player, now) {
    const container = this.gameEnv.container || this.gameEnv.gameContainer;
    if (!container) return;

    const directionVector = this.getFacingDirectionVector(player);
    const projectile = {
      x: player.position.x + (player.width || 0) / 2,
      y: player.position.y + (player.height || 0) / 2,
      vx: directionVector.x * this.projectileSpeed,
      vy: directionVector.y * this.projectileSpeed,
      radius: this.projectileRadius,
      bornAt: now,
      canvas: document.createElement('canvas')
    };

    projectile.canvas.width = 64;
    projectile.canvas.height = 64;
    const ctx = projectile.canvas.getContext('2d');
    if (ctx) this.drawProjectileSprite(ctx, projectile.canvas.width, projectile.canvas.height);

    Object.assign(projectile.canvas.style, {
      position: 'absolute',
      width: `${projectile.radius * 2}px`,
      height: `${projectile.radius * 2}px`,
      left: `${projectile.x - projectile.radius}px`,
      top: `${(this.gameEnv.top || 0) + projectile.y - projectile.radius}px`,
      zIndex: '1002',
      pointerEvents: 'none',
      imageRendering: 'pixelated'
    });

    container.appendChild(projectile.canvas);
    this.projectiles.push(projectile);
  }

  getFacingDirectionVector(player) {
    const direction = String(player?.direction || 'down');
    const vectors = {
      up:        { x: 0,              y: -1             },
      down:      { x: 0,              y: 1              },
      left:      { x: -1,             y: 0              },
      right:     { x: 1,              y: 0              },
      upLeft:    { x: -Math.SQRT1_2,  y: -Math.SQRT1_2  },
      downLeft:  { x: -Math.SQRT1_2,  y: Math.SQRT1_2   },
      upRight:   { x: Math.SQRT1_2,   y: -Math.SQRT1_2  },
      downRight: { x: Math.SQRT1_2,   y: Math.SQRT1_2   }
    };
    return vectors[direction] || vectors.down;
  }

  drawProjectileSprite(ctx, width, height) {
    const cx = width / 2;
    const cy = height / 2;
    const r = Math.min(width, height) * 0.42;

    ctx.clearRect(0, 0, width, height);

    // Draws the main orange circle (the ball body)
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fillStyle = '#f68b1f';
    ctx.fill();
    ctx.lineWidth = 4;
    ctx.strokeStyle = '#8a3d00';
    ctx.stroke();

    // Draws the horizontal seam line
    ctx.beginPath();
    ctx.moveTo(cx - r, cy);
    ctx.quadraticCurveTo(cx, cy - 8, cx + r, cy);
    ctx.strokeStyle = '#8a3d00';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Draws the vertical seam line
    ctx.beginPath();
    ctx.moveTo(cx, cy - r);
    ctx.quadraticCurveTo(cx - 8, cy, cx, cy + r);
    ctx.stroke();
  }

  updateProjectiles(now, lebron) {
    for (let i = this.projectiles.length - 1; i >= 0; i -= 1) {
      const projectile = this.projectiles[i];
      projectile.x += projectile.vx;
      projectile.y += projectile.vy;

      if (this.isProjectileOutOfBounds(projectile) || now - projectile.bornAt > this.projectileLifeMs) {
        this.removeProjectileAt(i);
        continue;
      }

      projectile.canvas.style.left = `${projectile.x - projectile.radius}px`;
      projectile.canvas.style.top = `${(this.gameEnv.top || 0) + projectile.y - projectile.radius}px`;

      if (lebron && this.isCircleHittingObject(projectile, lebron)) {
        this.lebronStunUntil = Math.max(this.lebronStunUntil, now + this.lebronStunDurationMs);
        lebron.velocity.x = 0;
        lebron.velocity.y = 0;
        this.removeProjectileAt(i);
      }
    }
  }

  isProjectileOutOfBounds(projectile) {
    const margin = projectile.radius * 2;
    return (
      projectile.x < -margin ||
      projectile.y < -margin ||
      projectile.x > this.gameEnv.innerWidth + margin ||
      projectile.y > this.gameEnv.innerHeight + margin
    );
  }

  isCircleHittingObject(projectile, obj) {
    const rect = this.getHitboxRect(obj);
    const nearestX = Math.max(rect.left, Math.min(projectile.x, rect.right));
    const nearestY = Math.max(rect.top,  Math.min(projectile.y, rect.bottom));
    const dx = projectile.x - nearestX;
    const dy = projectile.y - nearestY;
    return (dx * dx + dy * dy) <= (projectile.radius * projectile.radius);
  }

  removeProjectileAt(index) {
    const projectile = this.projectiles[index];
    if (projectile?.canvas) projectile.canvas.remove();
    this.projectiles.splice(index, 1);
  }

  findById(id) {
    return this.gameEnv.gameObjects.find((obj) => obj?.spriteData?.id === id) || null;
  }

  getHitboxRect(obj) {
    const width  = obj.width  || 0;
    const height = obj.height || 0;
    const pos = obj.position || { x: 0, y: 0 };
    const widthReduction  = width  * 0.2;
    const heightReduction = height * 0.2;

    return {
      left:   pos.x + widthReduction,
      right:  pos.x + width - widthReduction,
      top:    pos.y + heightReduction,
      bottom: pos.y + height
    };
  }

  isHitboxCollision(a, b) {
    const ar = this.getHitboxRect(a);
    const br = this.getHitboxRect(b);
    return (
      ar.left   < br.right  &&
      ar.right  > br.left   &&
      ar.top    < br.bottom &&
      ar.bottom > br.top
    );
  }

  createHud() {
    const container = this.gameEnv.container || this.gameEnv.gameContainer;
    if (!container) return;
    const safeTop = Math.max(16, (this.gameEnv.top || 0) + 72);

    const oldTimer = container.querySelector('#basketball-time-hud');
    if (oldTimer) oldTimer.remove();
    const oldMessage = container.querySelector('#basketball-message-hud');
    if (oldMessage) oldMessage.remove();

    this.timeHud = document.createElement('div');
    this.timeHud.id = 'basketball-time-hud';
    Object.assign(this.timeHud.style, {
      position: 'fixed',
      top: `${safeTop}px`,
      left: '16px',
      zIndex: '20000',
      padding: '10px 14px',
      color: '#fff',
      background: 'rgba(0,0,0,0.78)',
      borderRadius: '8px',
      fontFamily: 'monospace',
      fontSize: '15px',
      fontWeight: '700',
      border: '1px solid rgba(255,255,255,0.2)',
      boxShadow: '0 6px 18px rgba(0,0,0,0.35)',
      pointerEvents: 'none'
    });
    container.appendChild(this.timeHud);

    this.messageHud = document.createElement('div');
    this.messageHud.id = 'basketball-message-hud';
    Object.assign(this.messageHud.style, {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      zIndex: '1001',
      padding: '14px 18px',
      color: '#fdb927',
      background: 'rgba(0,0,0,0.75)',
      border: '2px solid #fdb927',
      borderRadius: '10px',
      fontFamily: 'monospace',
      fontSize: '18px',
      fontWeight: '700',
      display: 'none',
      textAlign: 'center'
    });
    container.appendChild(this.messageHud);
  }

  createBottomNav() {
    const oldNav = document.getElementById('basketball-bottom-nav');
    if (oldNav) oldNav.remove();

    const basePath = (this.gameEnv?.path || '').replace(/\/$/, '');
    const aquaticUrl = `${basePath}/games/aquatic.html`;
    const seekUrl    = `${basePath}/gamify/seek.html`;

    this.bottomNav = document.createElement('div');
    this.bottomNav.id = 'basketball-bottom-nav';
    Object.assign(this.bottomNav.style, {
      position: 'fixed',
      left: '0',
      right: '0',
      bottom: '10px',
      zIndex: '20001',
      display: 'flex',
      justifyContent: 'center',
      gap: '10px',
      pointerEvents: 'auto'
    });

    const createNavButton = (label, url) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.textContent = label;
      Object.assign(button.style, {
        background: 'rgba(255,255,255,0.12)',
        color: '#fff',
        border: '1px solid rgba(255,255,255,0.35)',
        borderRadius: '8px',
        padding: '8px 14px',
        fontFamily: 'monospace',
        fontSize: '13px',
        fontWeight: '700',
        cursor: 'pointer',
        backdropFilter: 'blur(2px)'
      });
      button.addEventListener('click', () => {
        window.location.href = url;
      });
      return button;
    };

    this.bottomNav.appendChild(createNavButton('Go to Aquatic', aquaticUrl));
    this.bottomNav.appendChild(createNavButton('Go to Seek', seekUrl));
    document.body.appendChild(this.bottomNav);
  }

  updateHud() {
    if (!this.timeHud) return;
    this.timeHud.textContent =
      `Time: ${this.currentTime.toFixed(1)}s | Best: ${this.bestTime.toFixed(1)}s | ` +
      `Coins: ${this.getCoinsCollected()} | Best Coins: ${this.bestCoins}`;
  }

  showCaughtMessage() {
    if (!this.messageHud) return;
    this.messageHud.innerHTML = 'Kirby stole the ball!<br>Resetting round...';
    this.messageHud.style.display = 'block';
  }

  initLeaderboard() {
    if (this.leaderboard) return;
    this.leaderboard = new Leaderboard(this.gameEnv.gameControl, {
      gameName: 'Basketball',
      initiallyHidden: false
    });
    const container = document.getElementById('leaderboard-container');
    if (container) {
      container.style.left  = 'auto';
      container.style.right = '20px';
      container.style.top   = '80px';
    }
  }

  submitRoundScore() {
    if (!this.leaderboard || this.scoreSubmittedThisRound) return;
    const score = Math.round((this.currentTime * 10) + (this.getCoinsCollected() * 50));
    const username = (this.gameEnv?.game?.uid && String(this.gameEnv.game.uid)) || 'Player';
    this.scoreSubmittedThisRound = true;

    this.leaderboard.submitScore(username, score, 'Basketball')
      .catch((err) => console.warn('Leaderboard score submit failed:', err));
  }

  handleRestartKey(event) {
    if (event.key.toLowerCase() !== 'r' || !this.caught) return;
    this.resetRound();
  }

  resetRound() {
    const player = this.findById('BasketballPlayer');
    const lebron = this.findById('LeBron');
    const coins = this.gameEnv.gameObjects.filter((obj) => String(obj?.spriteData?.id || '').startsWith('coin_'));

    if (player) {
      player.position.x  = this.playerStart.x;
      player.position.y  = this.playerStart.y;
      player.velocity.x  = 0;
      player.velocity.y  = 0;
      player.direction   = 'down';
    }

    if (lebron) {
      lebron.position.x = this.chaserStart.x;
      lebron.position.y = this.chaserStart.y;
      lebron.velocity.x = 0;
      lebron.velocity.y = 0;
      lebron.direction  = 'left';
    }

    coins.forEach((coin) => {
      if (typeof coin.randomizePosition === 'function') {
        coin.randomizePosition();
      }
    });

    this.caught               = false;
    this.caughtAt             = 0;
    this.scoreSubmittedThisRound = false;
    this.lebronStunUntil      = 0;
    this.updateCoinSpawnBounds();
    this.applyCoinSpawnRules();
    this.startTime = performance.now();
    this.currentTime = 0;
    if (!this.gameEnv.stats) this.gameEnv.stats = {};
    this.gameEnv.stats.coinsCollected = 0;
    if (this.messageHud) this.messageHud.style.display = 'none';
    this.clearProjectiles();
    this.updateHud();
  }

  showIntroDialogue() {
    this.introDialogue = new DialogueSystem({
      dialogues: ['Foreign explorer? Try to survive as long as you can by keeping the Ball safe!'],
      id: 'basketball_boss_intro'
    });

    this.introDialogue.showDialogue(
      'Foreign explorer? Try to survive as long as you can by keeping the Ball safe!',
      'Boss Level'
    );
    if (this.introDialogue.closeBtn) {
      this.introDialogue.closeBtn.style.display = 'none';
    }

    this.introDialogue.addButtons([
      {
        text: 'Start',
        primary: true,
        action: () => {
          this.preGameLocked = false;
          this.startTime = performance.now();
          this.currentTime = 0;
          this.updateHud();
          this.introDialogue.closeDialogue();
        }
      }
    ]);
  }

  updateCoinSpawnBounds() {
    if (!this.gameEnv.stats) this.gameEnv.stats = {};
    this.gameEnv.stats.coinSpawnBounds = {
      xMin: this.gameEnv.innerWidth  * 0.10,
      xMax: this.gameEnv.innerWidth  * 0.88,
      yMin: this.gameEnv.innerHeight * 0.19,
      yMax: this.gameEnv.innerHeight * 0.80
    };
  }

  applyCoinSpawnRules() {
    const bounds = this.gameEnv?.stats?.coinSpawnBounds;
    if (!bounds) return;
    const coins = this.gameEnv.gameObjects.filter((obj) => String(obj?.spriteData?.id || '').startsWith('coin_'));

    coins.forEach((coin) => {
      if (!coin._originalRandomizePosition && typeof coin.randomizePosition === 'function') {
        coin._originalRandomizePosition = coin.randomizePosition.bind(coin);
      }

      coin.randomizePosition = () => {
        const xMin = bounds.xMin;
        const xMax = bounds.xMax;
        const yMin = bounds.yMin;
        const yMax = bounds.yMax;
        coin.position.x = xMin + Math.random() * Math.max(1, xMax - xMin);
        coin.position.y = yMin + Math.random() * Math.max(1, yMax - yMin);
      };

      coin.randomizePosition();
    });
  }

  getCoinsCollected() {
    return Number(this.gameEnv?.stats?.coinsCollected || 0);
  }

  loadBestTime() {
    try {
      return Number(localStorage.getItem('basketball_best_time') || 0);
    } catch (_) {
      return 0;
    }
  }

  saveBestTime() {
    try {
      localStorage.setItem('basketball_best_time', String(this.bestTime));
    } catch (_) {}
  }

  loadBestCoins() {
    try {
      return Number(localStorage.getItem('basketball_best_coins') || 0);
    } catch (_) {
      return 0;
    }
  }

  saveBestCoins() {
    try {
      localStorage.setItem('basketball_best_coins', String(this.bestCoins));
    } catch (_) {}
  }

  destroy() {
    document.removeEventListener('keydown', this.handleRestartKey);
    document.removeEventListener('keydown', this.handleShootKey);
    if (this.timeHud)    this.timeHud.remove();
    if (this.messageHud) this.messageHud.remove();
    if (this.bottomNav)  this.bottomNav.remove();
    this.clearProjectiles();
    if (this.leaderboard && typeof this.leaderboard.destroy === 'function') {
      this.leaderboard.destroy();
    }
    if (this.introDialogue && typeof this.introDialogue.closeDialogue === 'function') {
      this.introDialogue.closeDialogue();
    }

    this.timeHud       = null;
    this.messageHud    = null;
    this.bottomNav     = null;
    this.leaderboard   = null;
    this.introDialogue = null;
  }

  clearProjectiles() {
    this.projectiles.forEach((projectile) => projectile?.canvas?.remove());
    this.projectiles = [];
  }
}

export default GameLevelBasketball;
export const gameLevelClasses = [GameLevelBasketball];
