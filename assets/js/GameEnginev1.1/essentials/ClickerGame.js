import GameObject from './GameObject.js';

const SHOP_HEIGHT = 90; // pixels kept at the bottom for power-up cards
const CARD_GAP = 8;
const PIXELS_PER_SPEED = 2; // a bounce speed of 1 moves 2 pixels a frame
const PULSE_FRAMES = 6; // how long a clicked target shrinks
const AUTO_CLICK_MS = 1000;

/**
 * ClickerGame - click targets for points and spend them on power-ups.
 *
 * Data:
 * - target: { src } picture to click
 * - targetCount: how many targets are on screen (default 1)
 * - targetSpeed: 0 keeps targets still; higher numbers bounce them faster
 * - goalScore, winMessage: points to earn to win, and the message shown then
 * - powerUps: [{ name, src, cost, effect: 'per-click' | 'auto-click', amount }]
 *
 * Points earned count toward the goal even after they are spent. Power-ups
 * can be bought again; each copy adds its amount. The game draws everything on
 * the level canvas and listens for clicks or taps on the game container.
 */
export default class ClickerGame extends GameObject {
  constructor(data = {}, gameEnv = null) {
    super(gameEnv);
    this.targetImage = loadImage(data.target?.src);
    this.targetSpeed = Number.isFinite(data.targetSpeed) ? data.targetSpeed : 0;
    this.goalScore = Number.isFinite(data.goalScore) ? data.goalScore : 100;
    this.winMessage = data.winMessage || 'You win!';
    this.powerUps = (data.powerUps || []).map((powerUp) => ({ ...powerUp, image: loadImage(powerUp.src), owned: 0 }));
    this.points = 0;
    this.earned = 0;
    this.hasWon = false;
    this.autoClickMs = 0;
    this.lastFrameAt = null;
    this.targets = this.createTargets(Math.max(1, data.targetCount || 1));
    this.handlePointerDown = this.handlePointerDown.bind(this);
    // The container outlives the canvas, which the game may replace on resize.
    this.gameEnv?.container?.addEventListener('pointerdown', this.handlePointerDown);
  }

  /** Targets start spread over a grid, each heading in a different direction. */
  createTargets(count) {
    const columns = Math.ceil(Math.sqrt(count));
    const rows = Math.ceil(count / columns);
    return Array.from({ length: count }, (unused, index) => {
      const angle = index * 2.4;
      return {
        x: ((index % columns) + 0.5) / columns,
        y: (Math.floor(index / columns) + 0.5) / rows,
        dx: Math.cos(angle),
        dy: Math.sin(angle),
        pulse: 0,
      };
    });
  }

  get perClick() {
    return 1 + this.powerUpTotal('per-click');
  }

  get perSecond() {
    return this.powerUpTotal('auto-click');
  }

  powerUpTotal(effect) {
    return this.powerUps
      .filter((powerUp) => powerUp.effect === effect)
      .reduce((total, powerUp) => total + powerUp.owned * powerUp.amount, 0);
  }

  get playHeight() {
    const shop = this.powerUps.length > 0 ? SHOP_HEIGHT : 0;
    return Math.max(1, this.gameEnv.innerHeight - shop);
  }

  /** Target diameter in pixels: smaller when there are more of them. */
  get targetSize() {
    const space = Math.min(this.gameEnv.innerWidth, this.playHeight);
    return space * Math.min(0.35, 0.7 / Math.sqrt(this.targets.length));
  }

  addPoints(amount) {
    this.points += amount;
    this.earned += amount;
    if (this.earned >= this.goalScore) this.hasWon = true;
  }

  update() {
    const isPaused = Boolean(this.gameEnv?.gameControl?.isPaused);
    const now = performance.now();
    if (!isPaused) {
      for (const target of this.targets) target.pulse = Math.max(0, target.pulse - 1);
    }
    if (!isPaused && !this.hasWon) {
      this.moveTargets();
      if (this.lastFrameAt !== null) this.tick(now - this.lastFrameAt);
    }
    this.lastFrameAt = now;
    this.draw();
  }

  /** Adds automatic points for each whole second that has passed. */
  tick(ms) {
    this.autoClickMs += ms;
    while (this.autoClickMs >= AUTO_CLICK_MS) {
      this.autoClickMs -= AUTO_CLICK_MS;
      if (this.perSecond > 0) this.addPoints(this.perSecond);
    }
  }

  moveTargets() {
    const step = this.targetSpeed * PIXELS_PER_SPEED;
    const radius = this.targetSize / 2;
    const width = this.gameEnv.innerWidth;
    const height = this.playHeight;
    for (const target of this.targets) {
      if (step === 0) continue;
      let x = target.x * width + target.dx * step;
      let y = target.y * height + target.dy * step;
      // Bounce off the edges of the play area.
      if (x < radius || x > width - radius) target.dx = -target.dx;
      if (y < radius || y > height - radius) target.dy = -target.dy;
      x = Math.min(Math.max(x, radius), width - radius);
      y = Math.min(Math.max(y, radius), height - radius);
      target.x = x / width;
      target.y = y / height;
    }
  }

  handlePointerDown(event) {
    const canvas = this.gameEnv.canvas;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = (event.clientX - rect.left) * (canvas.width / rect.width);
    const y = (event.clientY - rect.top) * (canvas.height / rect.height);
    this.handlePoint(x, y);
  }

  /** A click at canvas pixel (x, y): a target scores, a shop card buys. */
  handlePoint(x, y) {
    if (this.hasWon || this.gameEnv?.gameControl?.isPaused) return;
    const radius = this.targetSize / 2;
    const target = this.targets.find((candidate) => {
      const centreX = candidate.x * this.gameEnv.innerWidth;
      const centreY = candidate.y * this.playHeight;
      return Math.hypot(x - centreX, y - centreY) <= radius;
    });
    if (target) {
      target.pulse = PULSE_FRAMES;
      this.addPoints(this.perClick);
      return;
    }
    const card = this.shopCards().find((box) => x >= box.left && x <= box.right && y >= box.top && y <= box.bottom);
    if (card) this.buy(card.powerUp);
  }

  buy(powerUp) {
    if (this.points < powerUp.cost) return false;
    this.points -= powerUp.cost;
    powerUp.owned++;
    return true;
  }

  shopCards() {
    const count = this.powerUps.length;
    if (count === 0) return [];
    const width = Math.min(180, (this.gameEnv.innerWidth - CARD_GAP) / count - CARD_GAP);
    const top = this.playHeight + CARD_GAP;
    return this.powerUps.map((powerUp, index) => {
      const left = CARD_GAP + index * (width + CARD_GAP);
      return { powerUp, left, right: left + width, top, bottom: top + SHOP_HEIGHT - CARD_GAP * 2 };
    });
  }

  draw() {
    const ctx = this.gameEnv?.ctx;
    if (!ctx) return;
    ctx.save();
    this.drawTargets(ctx);
    this.drawShop(ctx);
    this.drawPanel(ctx);
    if (this.hasWon) this.drawBanner(ctx, this.winMessage);
    ctx.restore();
  }

  drawTargets(ctx) {
    if (!isReady(this.targetImage)) return;
    for (const target of this.targets) {
      const size = this.targetSize * (target.pulse > 0 ? 0.9 : 1);
      const centreX = target.x * this.gameEnv.innerWidth;
      const centreY = target.y * this.playHeight;
      ctx.drawImage(this.targetImage, centreX - size / 2, centreY - size / 2, size, size);
    }
  }

  drawShop(ctx) {
    for (const card of this.shopCards()) {
      const { powerUp } = card;
      const canAfford = this.points >= powerUp.cost;
      ctx.fillStyle = canAfford ? 'rgba(15, 23, 42, 0.85)' : 'rgba(71, 85, 105, 0.6)';
      ctx.fillRect(card.left, card.top, card.right - card.left, card.bottom - card.top);
      if (isReady(powerUp.image)) ctx.drawImage(powerUp.image, card.left + 6, card.top + 8, 40, 40);
      ctx.fillStyle = '#f8fafc';
      ctx.textAlign = 'left';
      ctx.font = 'bold 13px sans-serif';
      ctx.fillText(powerUp.name, card.left + 52, card.top + 20);
      ctx.font = '12px sans-serif';
      const effect = powerUp.effect === 'auto-click' ? `+${powerUp.amount}/sec` : `+${powerUp.amount}/click`;
      ctx.fillText(`${effect} · cost ${powerUp.cost}`, card.left + 52, card.top + 38);
      ctx.fillText(`Owned: ${powerUp.owned}`, card.left + 52, card.top + 56);
    }
  }

  drawPanel(ctx) {
    ctx.fillStyle = 'rgba(15, 23, 42, 0.75)';
    ctx.fillRect(8, 8, 220, 50);
    ctx.textAlign = 'left';
    ctx.fillStyle = '#f8fafc';
    ctx.font = 'bold 16px sans-serif';
    ctx.fillText(`Points: ${this.points}`, 16, 28);
    ctx.font = '13px sans-serif';
    ctx.fillText(`Goal: ${Math.min(this.earned, this.goalScore)}/${this.goalScore} · +${this.perClick}/click`, 16, 48);
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
    this.gameEnv?.container?.removeEventListener('pointerdown', this.handlePointerDown);
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

function isReady(image) {
  return Boolean(image && image.complete && image.naturalWidth > 0);
}
