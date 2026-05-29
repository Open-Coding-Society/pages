import GameEnvBackground from '@assets/js/GameEnginev1.1/essentials/GameEnvBackground.js';
import Player from '@assets/js/GameEnginev1.1/essentials/Player.js';
import PortfolioManager from '../model/PortfolioManager.js';
import MarketEngine from '../model/MarketEngine.js';
import PropertyDatabase from '../model/PropertyDatabase.js';

// Base class for all property negotiation battle levels
class GameLevelPropertyDeal {
  constructor(gameEnv, config) {
    this.gameEnv = gameEnv;
    this.config = config;

    const W = gameEnv.innerWidth;
    const H = gameEnv.innerHeight;
    const path = gameEnv.path;

    // ── Property selection ────────────────────────────────────
    const ownedIds = PortfolioManager.getProperties().map(p => p.id);
    const candidates = PropertyDatabase.getDealSelection(config.propertyType, ownedIds, 3);

    if (candidates.length === 0) {
      this._noDeal = 'You already own all available properties in this category!';
      this.classes = this._minimalClasses(path, config.backgroundImage);
      return;
    }

    // Pick the property for this deal first so we can check against its actual listing price
    this.property = candidates[Math.floor(Math.random() * candidates.length)];
    const multiplier = MarketEngine.getMultiplier(config.propertyType);
    this.listingPrice = Math.floor(this.property.price * multiplier);

    const minNeeded = Math.floor(this.listingPrice * 0.25);
    if (PortfolioManager.getCash() < minNeeded) {
      this._noDeal = `Not enough funds! You need at least $${_fmt(minNeeded)} to negotiate.`;
      this.classes = this._minimalClasses(path, config.backgroundImage);
      return;
    }

    // ── Battle state ──────────────────────────────────────────
    this.sellerMaxHp = config.sellerHp ?? 14;
    this.sellerHp = this.sellerMaxHp;
    this.playerCash = PortfolioManager.getCash();
    this.playerBadDeals = 0;
    this.playerMaxBadDeals = config.maxBadDeals ?? 3;
    this.dealDone = false;
    this.dealWon = false;

    // Price discount from coins: each inspection coin = 1%
    this.coinBonus = 0;
    this.coins = [];
    this.coinCount = 0;
    this.coinTotal = config.coinTotal ?? 7;

    this.floorY = H * 0.46;
    this.playerSpawn = { x: W * 0.13, y: H * 0.72 };
    this.sellerCenter = { x: W * 0.72, y: H * 0.60 };
    this.sellerW = 90;
    this.sellerH = 130;
    this.initialPositionsSet = false;

    this.lasers = [];
    this.attackRequested = false;
    this.lastAttackAt = 0;
    this.lastCounterAt = 0;
    this.attackCooldownMs = config.attackCooldownMs ?? 380;
    this.counterIntervalMs = config.counterIntervalMs ?? 1400;
    this.laserSpeed = 11;
    this.playerHitCooldownMs = 700;
    this.lastPlayerHitAt = 0;

    const image_bg = {
      id: `deal-${config.propertyType}`,
      src: `${path}/images/projects/real-estate-tycoon/${config.backgroundImage}`,
      pixels: { height: 600, width: 1200 },
    };

    const sprite_player = {
      id: 'Investor',
      greeting: 'Negotiate the deal! WASD=move, SPACE=fire offer, collect 📄 for discounts!',
      src: `${path}/images/projects/real-estate-tycoon/player_investor.svg`,
      SCALE_FACTOR: 12,
      STEP_FACTOR: 900,
      ANIMATION_RATE: 1,
      GRAVITY: false,
      INIT_POSITION: this.playerSpawn,
      pixels: { height: 64, width: 64 },
      orientation: { rows: 1, columns: 1 },
      down: { row: 0, start: 0, columns: 1 },
      hitbox: { widthPercentage: 0.35, heightPercentage: 0.6 },
      keypress: { up: 87, left: 65, down: 83, right: 68 },
    };

    this.classes = [
      { class: GameEnvBackground, data: image_bg },
      { class: Player, data: sprite_player },
    ];

    this.boundKeyDown = this.handleKeyDown.bind(this);
  }

  _minimalClasses(path, bgImage) {
    return [{
      class: GameEnvBackground,
      data: {
        id: 'nodeal-bg',
        src: `${path}/images/projects/real-estate-tycoon/${bgImage}`,
        pixels: { height: 600, width: 1200 },
      },
    }];
  }

  // ── Lifecycle ─────────────────────────────────────────────

  initialize() {
    if (this._noDeal) {
      this._showMessage(this._noDeal, true);
      return;
    }
    this._generateCoins();
    this._createHud();
    this._createLaserCanvas();
    this._createSellerDiv();
    this._createPropertyPanel();
    document.addEventListener('keydown', this.boundKeyDown);
  }

  update() {
    if (!this.property || this.dealDone) return;

    const player = this._getPlayer();
    if (!player) return;

    this._enforceSpawnPositions(player);
    this._enforceFloor(player);

    const now = Date.now();

    // Player fires offer
    if (this.attackRequested) {
      this.attackRequested = false;
      if (now - this.lastAttackAt >= this.attackCooldownMs) {
        this.lastAttackAt = now;
        const px = player.position.x + player.width / 2;
        const py = player.position.y + player.height / 2;
        this._spawnLaser(px, py, this.sellerCenter.x, this.sellerCenter.y, true);
      }
    }

    // Seller counter-offers
    if (now - this.lastCounterAt >= this.counterIntervalMs) {
      this.lastCounterAt = now;
      const px = player.position.x + player.width / 2;
      const py = player.position.y + player.height / 2;
      this._spawnLaser(this.sellerCenter.x, this.sellerCenter.y, px, py, false);
    }

    this._updateLasers(player); // internally calls _updateCoins after clearing canvas
    this._updateSellerDiv();
    this._updateHud();
  }

  destroy() {
    document.removeEventListener('keydown', this.boundKeyDown);
    [this._hud, this._laserCanvas, this._sellerDiv, this._propPanel].forEach(el => {
      if (el && el.parentNode) el.remove();
    });
    const overlays = document.querySelectorAll('.ret-deal-overlay');
    overlays.forEach(el => el.remove());
  }

  handleKeyDown(event) {
    if (event.code === 'Space') { this.attackRequested = true; event.preventDefault(); }
  }

  // ── Setup helpers ─────────────────────────────────────────

  _container() {
    return this.gameEnv.gameContainer || document.getElementById('gameContainer') || document.body;
  }

  _createHud() {
    const c = this._container();
    this._hud = document.createElement('div');
    this._hud.id = 'ret-deal-hud';
    Object.assign(this._hud.style, {
      position: 'absolute', top: '10px', right: '10px', zIndex: '9999',
      width: '220px', padding: '12px 14px', borderRadius: '12px',
      background: 'rgba(0,0,0,0.88)', border: '1px solid rgba(100,160,255,0.2)',
      color: '#fff', fontFamily: '"Segoe UI",Arial,sans-serif',
      lineHeight: '1.45', boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
    });
    c.appendChild(this._hud);
    this._updateHud();
  }

  _updateHud() {
    if (!this._hud) return;
    const finalPrice = this._getFinalPrice();
    const badDeals = this.playerBadDeals;
    const maxBad = this.playerMaxBadDeals;
    const shields = Array.from({ length: maxBad }, (_, i) => i < (maxBad - badDeals) ? '🛡️' : '💀').join(' ');

    this._hud.innerHTML = `
      <div style="font-weight:800;font-size:12px;color:#ffd700;margin-bottom:8px">
        ${this.config.title}
      </div>
      <div style="font-size:11px;color:#aaa;margin-bottom:6px">${this.property?.name || ''}</div>
      <div style="margin-bottom:8px">
        <div style="font-size:10px;color:#9ab">Listing Price</div>
        <div style="font-weight:700;color:#ff8f00;font-size:14px">$${_fmt(this.listingPrice)}</div>
      </div>
      <div style="margin-bottom:8px">
        <div style="font-size:10px;color:#9ab">Your Offer</div>
        <div style="font-weight:700;color:#4eff91;font-size:16px">$${_fmt(finalPrice)}</div>
        <div style="font-size:9px;color:#4eff91">${this.coinCount > 0 ? `-${this.coinCount}% via inspections` : 'negotiate down!'}</div>
      </div>
      <div style="margin-bottom:8px">
        <div style="font-size:10px;color:#9ab">Seller Stubbornness</div>
        <div style="height:8px;background:rgba(255,255,255,0.1);border-radius:4px;overflow:hidden;margin-top:3px">
          <div style="height:100%;width:${(this.sellerHp/this.sellerMaxHp*100).toFixed(0)}%;background:linear-gradient(90deg,#ff5b5b,#ff8f00);border-radius:4px;transition:width .15s"></div>
        </div>
        <div style="font-size:9px;color:#aaa;margin-top:2px">${this.sellerHp}/${this.sellerMaxHp} resolve remaining</div>
      </div>
      <div style="margin-bottom:6px">
        <div style="font-size:10px;color:#9ab">Negotiation Shields</div>
        <div style="font-size:12px;margin-top:2px">${shields}</div>
      </div>
      <div style="font-size:9px;color:#888;margin-top:6px">
        SPACE=offer • collect 📄 for discounts
      </div>
    `;
  }

  _createLaserCanvas() {
    const c = this._container();
    this._laserCanvas = document.createElement('canvas');
    this._laserCanvas.id = 'ret-laser-canvas';
    Object.assign(this._laserCanvas.style, {
      position: 'absolute', left: '0', top: '0', pointerEvents: 'none', zIndex: '9991',
    });
    this._laserCanvas.width = this.gameEnv.innerWidth;
    this._laserCanvas.height = this.gameEnv.innerHeight;
    c.appendChild(this._laserCanvas);
  }

  _createSellerDiv() {
    const c = this._container();
    this._sellerDiv = document.createElement('div');
    this._sellerDiv.id = 'ret-seller';
    Object.assign(this._sellerDiv.style, {
      position: 'absolute',
      left: `${this.sellerCenter.x - this.sellerW / 2}px`,
      top: `${this.sellerCenter.y - this.sellerH / 2}px`,
      width: `${this.sellerW}px`, height: `${this.sellerH}px`,
      zIndex: '9992', textAlign: 'center', pointerEvents: 'none',
      fontFamily: '"Segoe UI",Arial,sans-serif',
    });
    c.appendChild(this._sellerDiv);
    this._updateSellerDiv();
  }

  _updateSellerDiv() {
    if (!this._sellerDiv) return;
    const hpPct = (this.sellerHp / this.sellerMaxHp * 100).toFixed(0);
    const shake = this.sellerHp < this.sellerMaxHp * 0.4 ? 'animation:shake .1s infinite' : '';
    this._sellerDiv.innerHTML = `
      <div style="font-size:56px;${shake}">${this.config.sellerEmoji || '🧑‍💼'}</div>
      <div style="font-size:10px;color:#fff;font-weight:700;margin-bottom:4px">${this.config.sellerName || 'Seller'}</div>
      <div style="height:8px;background:rgba(255,255,255,0.15);border-radius:4px;overflow:hidden">
        <div style="height:100%;width:${hpPct}%;background:linear-gradient(90deg,#ff5b5b,#ff9800);transition:width .2s;border-radius:4px"></div>
      </div>
      <div style="font-size:9px;color:#aaa;margin-top:2px">${this.sellerHp} resolve left</div>
    `;
  }

  _createPropertyPanel() {
    const c = this._container();
    const W = this.gameEnv.innerWidth;
    this._propPanel = document.createElement('div');
    this._propPanel.id = 'ret-prop-panel';
    Object.assign(this._propPanel.style, {
      position: 'absolute', bottom: '38px', left: '10px', zIndex: '9999',
      width: '220px', padding: '12px 14px', borderRadius: '12px',
      background: 'rgba(0,0,0,0.88)', border: '1px solid rgba(100,160,255,0.2)',
      color: '#fff', fontFamily: '"Segoe UI",Arial,sans-serif', fontSize: '11px',
    });
    const prop = this.property;
    const riskColor = prop.risk === 'low' ? '#4eff91' : prop.risk === 'medium' ? '#ff9800' : '#ff5b5b';
    this._propPanel.innerHTML = `
      <div style="font-weight:800;font-size:13px;margin-bottom:6px;color:#ffd700">${prop.emoji} ${prop.name}</div>
      <div style="color:#aaa;margin-bottom:8px;line-height:1.4">${prop.desc}</div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:4px">
        <div><div style="color:#9ab;font-size:9px">Type</div><div style="font-weight:700;text-transform:capitalize">${prop.type}</div></div>
        <div><div style="color:#9ab;font-size:9px">Risk</div><div style="font-weight:700;color:${riskColor}">${prop.risk}</div></div>
        <div><div style="color:#9ab;font-size:9px">Base Price</div><div style="font-weight:700">$${_fmt(prop.price)}</div></div>
        <div><div style="color:#9ab;font-size:9px">Market Price</div><div style="font-weight:700;color:#ff8f00">$${_fmt(this.listingPrice)}</div></div>
        <div><div style="color:#9ab;font-size:9px">Monthly Rent</div><div style="font-weight:700;color:#4eff91">$${_fmt(prop.monthlyRent)}</div></div>
        <div><div style="color:#9ab;font-size:9px">ROI/Year</div><div style="font-weight:700;color:#64b5f6">${(prop.roi * 100).toFixed(1)}%</div></div>
      </div>
    `;
    c.appendChild(this._propPanel);
  }

  // ── Coin generation ───────────────────────────────────────

  _generateCoins() {
    const W = this.gameEnv.innerWidth;
    const H = this.gameEnv.innerHeight;
    this.coins = [];
    for (let i = 0; i < this.coinTotal; i++) {
      let tries = 0, x, y;
      do {
        x = W * 0.08 + Math.random() * W * 0.84;
        y = this.floorY + 20 + Math.random() * (H - this.floorY - 60);
        tries++;
      } while (tries < 30 && (
        Math.hypot(x - this.playerSpawn.x, y - this.playerSpawn.y) < 80 ||
        Math.hypot(x - this.sellerCenter.x, y - this.sellerCenter.y) < 80
      ));
      this.coins.push({ x, y, collected: false, spin: Math.random() * Math.PI * 2 });
    }
  }

  _updateCoins(player) {
    const ctx = this._laserCanvas?.getContext('2d');
    if (!ctx) return;
    for (const coin of this.coins) {
      if (coin.collected) continue;
      coin.spin += 0.08;

      // Draw document/inspection icon
      ctx.save();
      ctx.translate(coin.x, coin.y);
      ctx.beginPath();
      ctx.arc(0, 0, 13, 0, Math.PI * 2);
      ctx.fillStyle = '#4a90e2';
      ctx.fill();
      ctx.strokeStyle = '#2860b0';
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 11px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('📄', 0, 1);
      ctx.restore();

      if (!player) continue;
      const px = player.position.x + player.width / 2;
      const py = player.position.y + player.height / 2;
      if (Math.hypot(px - coin.x, py - coin.y) < 30) {
        coin.collected = true;
        this.coinCount++;
        this._showFloatingText(coin.x, coin.y, '-1% price!', '#4eff91');
      }
    }
  }

  // ── Laser system ──────────────────────────────────────────

  _spawnLaser(fx, fy, tx, ty, isPlayer) {
    const dx = tx - fx, dy = ty - fy;
    const len = Math.hypot(dx, dy) || 1;
    this.lasers.push({
      x: fx, y: fy,
      vx: (dx / len) * this.laserSpeed,
      vy: (dy / len) * this.laserSpeed,
      isPlayer, life: 70, maxLife: 70,
    });
  }

  _updateLasers(player) {
    const canvas = this._laserCanvas;
    if (!canvas) return;
    canvas.width = this.gameEnv.innerWidth;
    canvas.height = this.gameEnv.innerHeight;
    const ctx = canvas.getContext('2d');

    // Redraw coins after clearing
    this._updateCoins(player);

    for (let i = this.lasers.length - 1; i >= 0; i--) {
      const L = this.lasers[i];
      L.x += L.vx; L.y += L.vy; L.life--;

      if (L.life <= 0 || L.x < 0 || L.x > canvas.width || L.y < 0 || L.y > canvas.height) {
        this.lasers.splice(i, 1); continue;
      }

      // Draw laser beam
      ctx.save();
      ctx.translate(L.x, L.y);
      ctx.rotate(Math.atan2(L.vy, L.vx));
      ctx.globalAlpha = L.life / L.maxLife;
      const grad = ctx.createLinearGradient(-22, 0, 22, 0);
      const col = L.isPlayer ? 'rgba(0,220,255,.95)' : 'rgba(255,80,50,.95)';
      grad.addColorStop(0, 'transparent');
      grad.addColorStop(0.3, col);
      grad.addColorStop(0.7, col);
      grad.addColorStop(1, 'transparent');
      ctx.fillStyle = grad;
      ctx.shadowColor = L.isPlayer ? 'cyan' : 'red';
      ctx.shadowBlur = 7;
      ctx.fillRect(-22, -3, 44, 6);
      ctx.restore();

      const HW = 18, HH = 18;
      const hl = L.x - HW / 2, ht = L.y - HH / 2;
      const now = Date.now();

      if (L.isPlayer) {
        // Check hit on seller
        const sx = this.sellerCenter.x - this.sellerW / 2;
        const sy = this.sellerCenter.y - this.sellerH / 2;
        if (hl < sx + this.sellerW && hl + HW > sx && ht < sy + this.sellerH && ht + HH > sy) {
          this.sellerHp = Math.max(0, this.sellerHp - 1);
          this.lasers.splice(i, 1);
          this._showFloatingText(this.sellerCenter.x, this.sellerCenter.y - 20, '-1 resolve', '#ff9800');

          if (this.sellerHp <= 0 && !this.dealDone) {
            this.dealDone = true;
            this.dealWon = true;
            this._onDealWon();
          }
          continue;
        }
      } else {
        // Check hit on player
        if (!player) continue;
        if (
          hl < player.position.x + player.width && hl + HW > player.position.x &&
          ht < player.position.y + player.height && ht + HH > player.position.y
        ) {
          if (now - this.lastPlayerHitAt >= this.playerHitCooldownMs) {
            this.lastPlayerHitAt = now;
            this.playerBadDeals++;
            this.lasers.splice(i, 1);
            this._showFloatingText(player.position.x, player.position.y - 15, 'Bad Terms!', '#ff5b5b');

            if (this.playerBadDeals >= this.playerMaxBadDeals && !this.dealDone) {
              this.dealDone = true;
              this.dealWon = false;
              this._onDealFailed();
            }
          }
          continue;
        }
      }
    }
  }

  // ── Physics ───────────────────────────────────────────────

  _enforceSpawnPositions(player) {
    if (this.initialPositionsSet) return;
    if (!player) return;
    player.position.x = this.playerSpawn.x;
    player.position.y = Math.min(this.gameEnv.innerHeight - player.height, Math.max(this.floorY, this.playerSpawn.y));
    player.velocity = { x: 0, y: 0 };
    this.initialPositionsSet = true;
  }

  _enforceFloor(player) {
    if (!player) return;
    const H = this.gameEnv.innerHeight;
    if (player.position.y < this.floorY) { player.position.y = this.floorY; if (player.velocity) player.velocity.y = 0; }
    if (player.position.y + player.height > H) { player.position.y = H - player.height; if (player.velocity) player.velocity.y = 0; }
  }

  // ── Deal outcomes ─────────────────────────────────────────

  _getFinalPrice() {
    const discount = Math.min(0.30, this.coinCount * 0.01);
    return Math.floor(this.listingPrice * (1 - discount));
  }

  _onDealWon() {
    const finalPrice = this._getFinalPrice();
    if (PortfolioManager.getCash() < finalPrice) {
      this._showDealScreen(false, `Not enough cash! You need $${_fmt(finalPrice)} but only have $${_fmt(PortfolioManager.getCash())}.`);
      return;
    }
    const owned = PortfolioManager.addProperty(this.property, finalPrice);
    const saved = this.listingPrice - finalPrice;
    this._showDealScreen(true,
      `Deal closed at $${_fmt(finalPrice)}!\nSaved $${_fmt(saved)} (${this.coinCount}% discount from inspections).\n+$${_fmt(this.property.monthlyRent)}/mo rental income added.`,
      finalPrice, saved
    );
  }

  _onDealFailed() {
    this._showDealScreen(false, 'Negotiations collapsed! Too many bad terms accepted. The seller walked away.');
  }

  _showDealScreen(won, message, finalPrice = 0, saved = 0) {
    const existing = document.querySelector('.ret-deal-overlay');
    if (existing) existing.remove();

    const overlay = document.createElement('div');
    overlay.className = 'ret-deal-overlay';
    Object.assign(overlay.style, {
      position: 'absolute', inset: '0', zIndex: '99999',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      background: won ? 'rgba(0,20,0,0.92)' : 'rgba(20,0,0,0.92)',
      color: '#fff', fontFamily: '"Segoe UI",Arial,sans-serif', textAlign: 'center',
    });

    overlay.innerHTML = `
      <div style="animation:ret-deal-enter .35s ease;text-align:center;padding:0 20px">
        <div style="font-size:52px;font-weight:800;margin-bottom:14px;${won ? 'color:#ffd700;text-shadow:0 0 32px rgba(255,215,0,.8)' : 'color:#ff5b5b;text-shadow:0 0 24px rgba(255,50,50,.6)'}">
          ${won ? '🏠 DEAL CLOSED!' : '❌ DEAL FAILED'}
        </div>
        <div style="font-size:18px;margin-bottom:12px;max-width:520px;line-height:1.6;white-space:pre-line">${message}</div>
        ${won ? `
          <div style="font-size:15px;color:#4eff91;margin-bottom:4px">✅ Property added to portfolio!</div>
          <div style="font-size:14px;color:#64b5f6;margin-bottom:4px">Net Worth: $${_fmt(PortfolioManager.getNetWorth(MarketEngine.getSummary()))}</div>
        ` : `
          <div style="font-size:14px;color:#ff8f00;margin-bottom:4px">Brush up your negotiation skills and try again!</div>
        `}
        <button id="ret-deal-return" style="margin-top:28px;padding:14px 36px;background:linear-gradient(135deg,#ffd700,#ff9800);border:none;border-radius:12px;color:#000;font-weight:800;font-size:16px;cursor:pointer;animation:ret-pulse-btn 1.4s infinite">
          ↩ Return to City
        </button>
      </div>
    `;

    let onKey;
    const finish = () => {
      overlay.remove();
      document.removeEventListener('keydown', onKey);
      if (this.gameEnv?.gameControl?.currentLevel) {
        this.gameEnv.gameControl.currentLevel.continue = false;
      }
    };
    onKey = (e) => { if (e.key !== 'Escape') finish(); };
    overlay.querySelector('#ret-deal-return')?.addEventListener('click', finish);
    document.addEventListener('keydown', onKey, { once: true });

    this._container().appendChild(overlay);
  }

  _showMessage(msg, withReturn = false) {
    const c = this._container();
    const div = document.createElement('div');
    div.className = 'ret-deal-overlay';
    Object.assign(div.style, {
      position: 'absolute', inset: '0', zIndex: '99999',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      background: 'rgba(0,0,0,0.85)', color: '#fff',
      fontFamily: '"Segoe UI",Arial,sans-serif', textAlign: 'center',
    });
    div.innerHTML = `
      <div style="font-size:24px;margin-bottom:12px;max-width:400px">${msg}</div>
      <div style="font-size:13px;opacity:.7">Click or press any key to return</div>
    `;
    const dismiss = () => {
      div.remove();
      if (this.gameEnv?.gameControl?.currentLevel) {
        this.gameEnv.gameControl.currentLevel.continue = false;
      }
    };
    div.addEventListener('click', dismiss);
    document.addEventListener('keydown', dismiss, { once: true });
    c.appendChild(div);
  }

  _showFloatingText(x, y, text, color) {
    const c = this._container();
    const el = document.createElement('div');
    Object.assign(el.style, {
      position: 'absolute', left: `${x}px`, top: `${y}px`, zIndex: '10000',
      color, fontFamily: '"Segoe UI",Arial,sans-serif', fontWeight: '700', fontSize: '13px',
      pointerEvents: 'none', transform: 'translateX(-50%)',
      animation: 'floatUp .8s ease forwards',
    });
    el.textContent = text;
    c.appendChild(el);
    setTimeout(() => el.remove(), 900);
  }

  // ── Player lookup ─────────────────────────────────────────

  _getPlayer() {
    return this.gameEnv?.gameObjects?.find(obj => obj?.constructor?.name === 'Player');
  }
}

// CSS for floating text and shake animations — guard against duplicate injection
if (!document.getElementById('ret-deal-styles')) {
  const style = document.createElement('style');
  style.id = 'ret-deal-styles';
  style.textContent = `
    @keyframes floatUp { from { opacity:1; transform:translateX(-50%) translateY(0); } to { opacity:0; transform:translateX(-50%) translateY(-40px); } }
    @keyframes shake { 0%,100%{transform:translateX(0)} 25%{transform:translateX(-3px)} 75%{transform:translateX(3px)} }
    @keyframes ret-deal-enter { from { opacity:0; transform:scale(.96); } to { opacity:1; transform:scale(1); } }
    @keyframes ret-pulse-btn { 0%,100%{box-shadow:0 0 0 0 rgba(255,215,0,.5)} 60%{box-shadow:0 0 0 10px rgba(255,215,0,0)} }
  `;
  document.head.appendChild(style);
}

function _fmt(n) {
  if (n === undefined || n === null) return '0';
  const abs = Math.abs(Math.floor(n));
  const sign = n < 0 ? '-' : '';
  if (abs >= 1000000) return `${sign}${(abs / 1000000).toFixed(1)}M`;
  if (abs >= 1000) return `${sign}${(abs / 1000).toFixed(0)}K`;
  return `${sign}${abs}`;
}

export default GameLevelPropertyDeal;
