import GameObject from './GameObject.js';
import PlayerPlatformer from './PlayerPlatformer.js';

const ENEMY_PATROL_SPEED = 0.02; // patrol phase step per frame
const MESSAGE_FRAMES = 90; // how long a short message stays up

/**
 * PlatformChallenge - coins to collect and enemies to avoid in a platform level.
 *
 * Data (positions and sizes are 0-1 of the canvas; x, y is the item's centre):
 * - coins: [{ src, x, y, size, frame }]
 * - enemies: [{ src, x, y, size, frame, patrol }], where patrol is how far
 *   the enemy walks left and right of x
 * - frame (optional): { rows, columns, row, column } picks one picture from a sprite sheet
 *
 * It draws the coins, enemies and a score panel on the level canvas. Touching
 * a coin collects it; collecting every coin wins and stops the player. Touching
 * an enemy sends the player back to where they started.
 */
export default class PlatformChallenge extends GameObject {
  constructor(data = {}, gameEnv = null) {
    super(gameEnv);
    this.coins = (data.coins || []).map((coin) => ({ ...coin, image: loadImage(coin.src), collected: false }));
    this.enemies = (data.enemies || []).map((enemy) => ({ ...enemy, image: loadImage(enemy.src) }));
    this.patrolPhase = 0;
    this.hits = 0;
    this.hasWon = false;
    this.message = '';
    this.messageFrames = 0;
    this.startPositions = new Map();
  }

  getPlayers() {
    return (this.gameEnv?.gameObjects || []).filter((object) => object instanceof PlayerPlatformer);
  }

  get coinsCollected() {
    return this.coins.filter((coin) => coin.collected).length;
  }

  update() {
    const isPaused = Boolean(this.gameEnv?.gameControl?.isPaused);
    if (!isPaused) {
      this.patrolPhase += ENEMY_PATROL_SPEED;
      this.checkPlayers();
      if (this.messageFrames > 0) this.messageFrames--;
    }
    this.draw();
  }

  checkPlayers() {
    for (const player of this.getPlayers()) {
      if (!this.startPositions.has(player)) this.startPositions.set(player, { ...player.position });
      if (this.hasWon) {
        player.pressedKeys = {};
        continue;
      }
      const bounds = player.getWorldCollisionBounds();
      for (const coin of this.coins) {
        if (!coin.collected && overlaps(bounds, this.boxFor(coin, coin.x))) coin.collected = true;
      }
      if (this.coins.length > 0 && this.coinsCollected === this.coins.length) {
        this.hasWon = true;
        player.pressedKeys = {};
        return;
      }
      const touchedEnemy = this.enemies.some((enemy) => overlaps(bounds, this.boxFor(enemy, this.enemyX(enemy))));
      if (touchedEnemy) this.sendToStart(player);
    }
  }

  sendToStart(player) {
    const start = this.startPositions.get(player);
    player.position.x = start.x;
    player.position.y = start.y;
    player.verticalVelocity = 0;
    player.velocity.y = 0;
    this.hits++;
    this.showMessage('Ouch! Back to the start.');
  }

  showMessage(text) {
    this.message = text;
    this.messageFrames = MESSAGE_FRAMES;
  }

  enemyX(enemy) {
    return enemy.x + (enemy.patrol || 0) * Math.sin(this.patrolPhase);
  }

  /** Pixel box for an item centred on (x, item.y); its height is size × canvas height. */
  boxFor(item, x) {
    const height = (item.size || 0.08) * this.gameEnv.innerHeight;
    const width = height * frameAspect(item);
    const centreX = x * this.gameEnv.innerWidth;
    const centreY = item.y * this.gameEnv.innerHeight;
    return { left: centreX - width / 2, right: centreX + width / 2, top: centreY - height / 2, bottom: centreY + height / 2 };
  }

  draw() {
    const ctx = this.gameEnv?.ctx;
    if (!ctx) return;
    ctx.save();
    for (const coin of this.coins) {
      if (!coin.collected) drawItem(ctx, coin, this.boxFor(coin, coin.x));
    }
    for (const enemy of this.enemies) drawItem(ctx, enemy, this.boxFor(enemy, this.enemyX(enemy)));
    this.drawPanel(ctx);
    if (this.hasWon) {
      this.drawBanner(ctx, 'You collected every coin. You win!');
    } else if (this.messageFrames > 0) {
      this.drawBanner(ctx, this.message);
    }
    ctx.restore();
  }

  drawPanel(ctx) {
    ctx.fillStyle = 'rgba(15, 23, 42, 0.75)';
    ctx.fillRect(8, 8, 190, 50);
    ctx.textAlign = 'left';
    ctx.fillStyle = '#f8fafc';
    ctx.font = 'bold 15px sans-serif';
    ctx.fillText(`Coins: ${this.coinsCollected}/${this.coins.length}`, 16, 28);
    ctx.font = '13px sans-serif';
    ctx.fillText(`Enemy hits: ${this.hits}`, 16, 48);
  }

  drawBanner(ctx, text) {
    const centreX = this.gameEnv.innerWidth / 2;
    const centreY = this.gameEnv.innerHeight / 2;
    ctx.font = 'bold 20px sans-serif';
    const width = ctx.measureText(text).width + 40;
    ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
    ctx.fillRect(centreX - width / 2, centreY - 24, width, 48);
    ctx.fillStyle = '#facc15';
    ctx.textAlign = 'center';
    ctx.fillText(text, centreX, centreY + 7);
  }

  resize() {
    this.draw();
  }

  destroy() {
    const gameObjects = this.gameEnv?.gameObjects;
    const index = gameObjects ? gameObjects.indexOf(this) : -1;
    if (index !== -1) gameObjects.splice(index, 1);
  }
}

function loadImage(src) {
  if (typeof Image === 'undefined' || !src) return null;
  const image = new Image();
  image.src = src;
  return image;
}

function overlaps(a, b) {
  return a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top;
}

/** Width ÷ height of one frame, from the item's pixels and sheet layout (square when unknown). */
function frameAspect(item) {
  const pixels = item.pixels;
  if (!pixels) return 1;
  const frame = item.frame || {};
  return (pixels.width / (frame.columns || 1)) / (pixels.height / (frame.rows || 1));
}

function drawItem(ctx, item, box) {
  const image = item.image;
  if (!image || !image.complete || image.naturalWidth === 0) return;
  const frame = item.frame || {};
  const frameWidth = image.naturalWidth / (frame.columns || 1);
  const frameHeight = image.naturalHeight / (frame.rows || 1);
  ctx.drawImage(
    image,
    (frame.column || 0) * frameWidth, (frame.row || 0) * frameHeight, frameWidth, frameHeight,
    box.left, box.top, box.right - box.left, box.bottom - box.top
  );
}
