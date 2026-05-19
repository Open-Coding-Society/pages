import GameEnvBackground from '@assets/js/GameEnginev1.1/essentials/GameEnvBackground.js';
import Player from '@assets/js/GameEnginev1.1/essentials/Player.js';
import Npc from '@assets/js/GameEnginev1.1/essentials/Npc.js';
import GameControl from '@assets/js/GameEnginev1.1/essentials/GameControl.js';
import PortfolioManager from '../model/PortfolioManager.js';
import MarketEngine from '../model/MarketEngine.js';
import GameLevelResidential from './GameLevelResidential.js';
import GameLevelCommercial from './GameLevelCommercial.js';
import GameLevelLuxury from './GameLevelLuxury.js';

// Ground level: background SVG has sidewalk at 81.7% of height (490/600).
// Characters stand ON the sidewalk. INIT_POSITION.y = ground - charHeight.
// With SCALE_FACTOR=11 on a 700px screen: charHeight ≈ 64px → top at ~508px.
// groundFrac = 0.82, so y = H*(0.82 - 1/SCALE_FACTOR)
const GROUND = 0.82;
const NPC_SCALE = 11;
const PLAYER_SCALE = 10;

// Helper: y-position for a character's top edge to stand on the ground
const groundY = (H, scale) => H * (GROUND - 1 / scale);

class GameLevelMarketHub {
  constructor(gameEnv) {
    this.gameEnv = gameEnv;
    const W = gameEnv.innerWidth;
    const H = gameEnv.innerHeight;
    const path = gameEnv.path;

    // ── First-run name prompt ─────────────────────────────────
    if (!PortfolioManager.exists()) {
      let name = localStorage.getItem('ret_player_name') || '';
      if (!name.trim()) {
        name = window.prompt(
          '🏢 REAL ESTATE TYCOON\n\nStart with $500,000.\nBuy properties, collect rent, reach $5M to win!\n\nYour investor name:',
          'Investor'
        ) || 'Investor';
        localStorage.setItem('ret_player_name', name.trim().slice(0, 20));
      }
      PortfolioManager.initialize(name.trim().slice(0, 20));
    }

    MarketEngine.initialize();

    // ── Background ────────────────────────────────────────────
    const image_data_city = {
      id: 'CityHub',
      src: `${path}/images/projects/real-estate-tycoon/city_background.svg`,
      pixels: { height: 600, width: 1200 },
    };

    // ── Shared sprite config for single-frame SVG characters ──
    // All character SVGs are 64×64 single-frame images.
    // orientation rows:1 cols:1 means drawImage renders the full image.
    const singleFrame = {
      pixels: { height: 64, width: 64 },
      orientation: { rows: 1, columns: 1 },
      down: { row: 0, start: 0, columns: 1 },
    };

    // ── Player ────────────────────────────────────────────────
    const sprite_data_player = {
      id: 'Investor',
      name: 'mainplayer',
      greeting: 'Use WASD to move and E to interact with brokers!',
      src: `${path}/images/projects/real-estate-tycoon/player_investor.svg`,
      SCALE_FACTOR: PLAYER_SCALE,
      STEP_FACTOR: 800,
      ANIMATION_RATE: 1,
      GRAVITY: false,
      INIT_POSITION: { x: W * 0.05, y: groundY(H, PLAYER_SCALE) },
      ...singleFrame,
      hitbox: { widthPercentage: 0.35, heightPercentage: 0.6 },
      keypress: { up: 87, left: 65, down: 83, right: 68 },
    };

    // ── Residential Broker – Sarah ────────────────────────────
    const sprite_data_res_broker = {
      id: 'ResidentialBroker',
      greeting: '🏠 Hi! I\'m Sarah, Residential Broker. Homes, condos, apartments. Press E to browse deals!',
      src: `${path}/images/projects/real-estate-tycoon/broker_residential.svg`,
      SCALE_FACTOR: NPC_SCALE,
      ANIMATION_RATE: 1,
      INIT_POSITION: { x: W * 0.18, y: groundY(H, NPC_SCALE) },
      ...singleFrame,
      hitbox: { widthPercentage: 0.3, heightPercentage: 0.55 },
      interact: () => {
        const primaryGame = gameEnv.gameControl;
        this._setUiVisible(false);
        primaryGame.pause();
        const _origRes = primaryGame.resume.bind(primaryGame);
        primaryGame.resume = (...a) => { primaryGame.resume = _origRes; this._setUiVisible(true); _origRes(...a); };
        new GameControl(gameEnv.game, [GameLevelResidential], { parentControl: primaryGame }).start();
      },
    };

    // ── Property Manager – Alex ───────────────────────────────
    const sprite_data_prop_mgr = {
      id: 'PropertyManager',
      greeting: '📋 Alex here — Property Manager. Press E to view your portfolio, collect rent & upgrade!',
      src: `${path}/images/projects/real-estate-tycoon/property_manager.svg`,
      SCALE_FACTOR: NPC_SCALE,
      ANIMATION_RATE: 1,
      INIT_POSITION: { x: W * 0.33, y: groundY(H, NPC_SCALE) },
      ...singleFrame,
      hitbox: { widthPercentage: 0.3, heightPercentage: 0.55 },
      interact: () => { this._showPortfolioModal(); },
    };

    // ── Commercial Broker – Marcus ────────────────────────────
    const sprite_data_com_broker = {
      id: 'CommercialBroker',
      greeting: '🏢 Marcus, Commercial Broker. Offices, retail, warehouses — high ROI awaits! Press E!',
      src: `${path}/images/projects/real-estate-tycoon/broker_commercial.svg`,
      SCALE_FACTOR: NPC_SCALE,
      ANIMATION_RATE: 1,
      INIT_POSITION: { x: W * 0.50, y: groundY(H, NPC_SCALE) },
      ...singleFrame,
      hitbox: { widthPercentage: 0.3, heightPercentage: 0.55 },
      interact: () => {
        if (PortfolioManager.getMarketLevel() < 2) {
          this._showToast('🔒 Own 3+ properties to unlock Commercial Market!', '#ff9800', 3500);
          return;
        }
        const primaryGame = gameEnv.gameControl;
        this._setUiVisible(false);
        primaryGame.pause();
        const _origRes = primaryGame.resume.bind(primaryGame);
        primaryGame.resume = (...a) => { primaryGame.resume = _origRes; this._setUiVisible(true); _origRes(...a); };
        new GameControl(gameEnv.game, [GameLevelCommercial], { parentControl: primaryGame }).start();
      },
    };

    // ── Luxury Broker – Victoria ──────────────────────────────
    const sprite_data_lux_broker = {
      id: 'LuxuryBroker',
      greeting: '💎 Victoria, Luxury Estates. Penthouses, resorts, trophy assets. Press E if you dare!',
      src: `${path}/images/projects/real-estate-tycoon/broker_luxury.svg`,
      SCALE_FACTOR: NPC_SCALE,
      ANIMATION_RATE: 1,
      INIT_POSITION: { x: W * 0.67, y: groundY(H, NPC_SCALE) },
      ...singleFrame,
      hitbox: { widthPercentage: 0.3, heightPercentage: 0.55 },
      interact: () => {
        if (PortfolioManager.getMarketLevel() < 3) {
          this._showToast('🔒 Own 6+ properties to unlock Luxury Market!', '#ffd700', 3500);
          return;
        }
        const primaryGame = gameEnv.gameControl;
        this._setUiVisible(false);
        primaryGame.pause();
        const _origRes = primaryGame.resume.bind(primaryGame);
        primaryGame.resume = (...a) => { primaryGame.resume = _origRes; this._setUiVisible(true); _origRes(...a); };
        new GameControl(gameEnv.game, [GameLevelLuxury], { parentControl: primaryGame }).start();
      },
    };

    // ── Bank Manager – First National ────────────────────────
    const sprite_data_bank = {
      id: 'BankManager',
      greeting: '🏦 First National Bank. Need leverage? Press E for loans & debt management.',
      src: `${path}/images/projects/real-estate-tycoon/bank_manager.svg`,
      SCALE_FACTOR: NPC_SCALE,
      ANIMATION_RATE: 1,
      INIT_POSITION: { x: W * 0.84, y: groundY(H, NPC_SCALE) },
      ...singleFrame,
      hitbox: { widthPercentage: 0.3, heightPercentage: 0.55 },
      interact: () => { this._showBankModal(); },
    };

    this.classes = [
      { class: GameEnvBackground, data: image_data_city },
      { class: Player,            data: sprite_data_player },
      { class: Npc,               data: sprite_data_res_broker },
      { class: Npc,               data: sprite_data_prop_mgr },
      { class: Npc,               data: sprite_data_com_broker },
      { class: Npc,               data: sprite_data_lux_broker },
      { class: Npc,               data: sprite_data_bank },
    ];

    // ── Internal state ────────────────────────────────────────
    this._hud = null;
    this._ticker = null;
    this._tickerInner = null;
    this._tickerOffset = 0;
    this._eventBanner = null;
    this._coinCanvas = null;
    this._promptEl = null;
    this._rentCoins = [];
    this._rafId = null;
    this._lastMarketTick = Date.now();
    this._lastHudUpdate = Date.now();
    this._lastRentSpawn = Date.now();
    this._lastGoalPct = 0;
    this._boundListener = this._onMarketEvent.bind(this);
  }

  // ── Lifecycle ─────────────────────────────────────────────

  initialize() {
    MarketEngine.addListener(this._boundListener);
    this._injectStyles();
    this._setupHud();
    this._setupTicker();
    this._setupEventBanner();
    this._setupCoinCanvas();
    this._setupInteractPrompt();
    this._collectRentOnLoad();
    this._showWelcomeBack();
    this._startLoop();
  }

  update() {
    const count = PortfolioManager.getProperties().length;
    if (count >= 3 && PortfolioManager.getMarketLevel() < 2) {
      PortfolioManager.unlockMarketLevel(2);
      this._showUnlockBanner('🏢 Commercial Market Unlocked! Find Marcus!');
    }
    if (count >= 6 && PortfolioManager.getMarketLevel() < 3) {
      PortfolioManager.unlockMarketLevel(3);
      this._showUnlockBanner('💎 Luxury Market Unlocked! Find Victoria!');
    }

    const nw = PortfolioManager.getNetWorth(MarketEngine.getSummary());
    const pct = Math.floor(nw / 50000); // milestone every $50K
    if (pct > this._lastGoalPct && this._lastGoalPct > 0) {
      this._lastGoalPct = pct;
      if (Math.floor(nw / 500000) > Math.floor((nw - 50000) / 500000)) {
        this._showUnlockBanner(`💰 Net worth milestone: $${_fmt(nw)}! Keep going!`);
      }
    } else if (this._lastGoalPct === 0) {
      this._lastGoalPct = pct;
    }

    if (nw >= 5000000) {
      if (this.gameEnv?.gameControl?.currentLevel) {
        this.gameEnv.gameControl.currentLevel.continue = false;
      }
    }
  }

  destroy() {
    MarketEngine.removeListener(this._boundListener);
    if (this._rafId) cancelAnimationFrame(this._rafId);
    [this._hud, this._ticker, this._eventBanner, this._coinCanvas, this._promptEl].forEach(el => {
      if (el?.parentNode) el.remove();
    });
    document.getElementById('ret-portfolio-modal')?.remove();
    document.getElementById('ret-bank-modal')?.remove();
  }

  // ── Helpers ───────────────────────────────────────────────

  _container() {
    return this.gameEnv.gameContainer || document.getElementById('gameContainer') || document.body;
  }

  _collectRentOnLoad() {
    const result = PortfolioManager.collectRent();
    if (result.totalRent > 100) this._showRentPopup(result);
  }

  // ── HUD ───────────────────────────────────────────────────

  _setupHud() {
    const c = this._container();
    c.style.position = 'relative';
    this._hud = document.createElement('div');
    this._hud.id = 'ret-hud';
    Object.assign(this._hud.style, {
      position: 'absolute', top: '8px', right: '8px', zIndex: '9999',
      width: '260px', padding: '14px 16px', borderRadius: '16px',
      background: 'linear-gradient(150deg, rgba(5,10,22,0.96), rgba(10,20,44,0.97))',
      border: '1px solid rgba(80,130,255,0.25)',
      color: '#fff', fontFamily: '"Segoe UI",Arial,sans-serif',
      lineHeight: '1.5', boxShadow: '0 8px 36px rgba(0,0,0,0.7)',
      backdropFilter: 'blur(14px)',
    });
    c.appendChild(this._hud);
    this._renderHud();
  }

  _renderHud() {
    if (!this._hud) return;
    const p = PortfolioManager.getPortfolio();
    const mkt = MarketEngine.getSummary();
    const nw = PortfolioManager.getNetWorth(mkt); // market-adjusted live net worth
    const inc = PortfolioManager.getMonthlyIncome();
    const goal = 5000000;
    const pct = Math.min(1, nw / goal);
    const lvl = PortfolioManager.getMarketLevel();

    const col = (v, up = true) => v ? (up ? '#4eff91' : '#ff5b5b') : '#888';
    const arrow = v => v ? '▲' : '▼';

    this._hud.innerHTML = `
      <div style="font-weight:800;font-size:13px;color:#ffd700;letter-spacing:.6px;margin-bottom:6px;display:flex;justify-content:space-between;align-items:center">
        🏢 REAL ESTATE TYCOON
        <span style="font-size:10px;color:#888;font-weight:400">Lv.${lvl} Market</span>
      </div>
      <div style="font-size:10px;color:#888;margin-bottom:2px">👤 ${p.playerName}</div>
      <div style="margin-bottom:10px;padding-bottom:10px;border-bottom:1px solid rgba(255,255,255,0.07)">
        <div style="font-size:9px;color:#8aa;text-transform:uppercase;letter-spacing:.5px">Net Worth</div>
        <div style="font-size:24px;font-weight:800;color:#ffd700;line-height:1.2">$${_fmt(nw)}</div>
        <div style="height:6px;background:rgba(255,255,255,0.08);border-radius:4px;margin-top:5px;overflow:hidden">
          <div style="height:100%;width:${(pct*100).toFixed(1)}%;background:linear-gradient(90deg,#ffd700,#ff9800);border-radius:4px;transition:width .6s ease"></div>
        </div>
        <div style="font-size:9px;color:#666;margin-top:3px">Goal: $5M — ${(pct*100).toFixed(1)}% complete</div>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:7px;margin-bottom:10px;font-size:11px">
        <div style="background:rgba(255,255,255,0.04);padding:7px 8px;border-radius:8px">
          <div style="font-size:8.5px;color:#8aa;text-transform:uppercase">Cash</div>
          <div style="font-weight:700;color:#4eff91;font-size:13px">$${_fmt(p.cash)}</div>
        </div>
        <div style="background:rgba(255,255,255,0.04);padding:7px 8px;border-radius:8px">
          <div style="font-size:8.5px;color:#8aa;text-transform:uppercase">Mo. Income</div>
          <div style="font-weight:700;color:${inc>=0?'#4eff91':'#ff5b5b'};font-size:13px">${inc>=0?'+':''}$${_fmt(inc)}</div>
        </div>
        <div style="background:rgba(255,255,255,0.04);padding:7px 8px;border-radius:8px">
          <div style="font-size:8.5px;color:#8aa;text-transform:uppercase">Properties</div>
          <div style="font-weight:700;color:#64b5f6;font-size:13px">${p.properties.length} owned</div>
        </div>
        <div style="background:rgba(255,255,255,0.04);padding:7px 8px;border-radius:8px">
          <div style="font-size:8.5px;color:#8aa;text-transform:uppercase">Debt</div>
          <div style="font-weight:700;color:${p.totalDebt>0?'#ff8f00':'#666'};font-size:13px">$${_fmt(p.totalDebt)}</div>
        </div>
      </div>
      <div style="border-top:1px solid rgba(255,255,255,0.07);padding-top:8px">
        <div style="font-size:8.5px;color:#8aa;text-transform:uppercase;letter-spacing:.5px;margin-bottom:5px">Live Market</div>
        <div style="font-size:10.5px;display:flex;justify-content:space-between;margin-bottom:3px">
          <span>🏠 Residential</span>
          <span style="font-weight:600;color:${col(mkt.residential>=1,'up')}">${arrow(mkt.residential>=1)} ${(mkt.residential*100).toFixed(1)}%</span>
        </div>
        <div style="font-size:10.5px;display:flex;justify-content:space-between;margin-bottom:3px">
          <span>🏢 Commercial ${lvl<2?'🔒':''}</span>
          <span style="font-weight:600;color:${col(mkt.commercial>=1,'up')}">${arrow(mkt.commercial>=1)} ${(mkt.commercial*100).toFixed(1)}%</span>
        </div>
        <div style="font-size:10.5px;display:flex;justify-content:space-between">
          <span>💎 Luxury ${lvl<3?'🔒':''}</span>
          <span style="font-weight:600;color:${col(mkt.luxury>=1,'up')}">${arrow(mkt.luxury>=1)} ${(mkt.luxury*100).toFixed(1)}%</span>
        </div>
      </div>
      <div style="font-size:8.5px;color:#555;margin-top:8px;padding-top:7px;border-top:1px solid rgba(255,255,255,0.05)">
        WASD = move &nbsp;|&nbsp; E = interact
      </div>
    `;
  }

  // ── Market Ticker ─────────────────────────────────────────

  _setupTicker() {
    const c = this._container();
    this._ticker = document.createElement('div');
    Object.assign(this._ticker.style, {
      position: 'absolute', bottom: '0', left: '0', right: '0',
      height: '30px', background: 'rgba(0,0,0,0.92)',
      borderTop: '1px solid rgba(255,200,0,0.2)', overflow: 'hidden', zIndex: '9998',
    });
    this._tickerInner = document.createElement('div');
    Object.assign(this._tickerInner.style, {
      position: 'absolute', whiteSpace: 'nowrap', top: '0',
      lineHeight: '30px', color: '#ffd700',
      fontFamily: '"Courier New",monospace', fontSize: '12px', fontWeight: '700',
    });
    this._ticker.appendChild(this._tickerInner);
    c.appendChild(this._ticker);
    this._updateTicker();
  }

  _updateTicker() {
    if (this._tickerInner) this._tickerInner.textContent = MarketEngine.getTickerText();
  }

  // ── Event Banner ──────────────────────────────────────────

  _setupEventBanner() {
    const c = this._container();
    this._eventBanner = document.createElement('div');
    Object.assign(this._eventBanner.style, {
      position: 'absolute', top: '8px', left: '10%', right: '10%',
      zIndex: '10000',
      padding: '12px 28px', borderRadius: '14px',
      color: '#fff', fontFamily: '"Segoe UI",Arial,sans-serif', fontWeight: '700',
      fontSize: '15px', textAlign: 'center', display: 'none',
      lineHeight: '1.4', boxShadow: '0 4px 28px rgba(0,0,0,0.5)',
    });
    c.appendChild(this._eventBanner);
  }

  _showEventBanner(event) {
    if (!this._eventBanner) return;
    const bg = event.color || '#ff9800';
    this._eventBanner.style.background = `linear-gradient(135deg, ${bg}dd, ${bg}99)`;
    this._eventBanner.innerHTML = `
      <div style="font-size:19px;margin-bottom:3px">${event.title}</div>
      <div style="font-size:11.5px;font-weight:400;opacity:.9">${event.desc || ''}</div>
    `;
    this._eventBanner.style.display = 'block';
    clearTimeout(this._bannerTimer);
    this._bannerTimer = setTimeout(() => {
      if (this._eventBanner) this._eventBanner.style.display = 'none';
    }, 5500);
  }

  // ── Interact Prompt ───────────────────────────────────────

  _setupInteractPrompt() {
    const c = this._container();
    this._promptEl = document.createElement('div');
    Object.assign(this._promptEl.style, {
      position: 'absolute', bottom: '40px', left: '0', right: '0',
      margin: '0 auto', width: 'fit-content',
      zIndex: '9995', display: 'none',
      background: 'rgba(0,0,0,0.75)', border: '1px solid rgba(255,215,0,0.4)',
      borderRadius: '8px', padding: '5px 14px',
      color: '#ffd700', fontFamily: '"Segoe UI",Arial,sans-serif',
      fontSize: '12px', fontWeight: '600', whiteSpace: 'nowrap',
    });
    this._promptEl.textContent = 'Press E to interact';
    c.appendChild(this._promptEl);
  }

  // ── Rent Coin Canvas ──────────────────────────────────────

  _setupCoinCanvas() {
    const c = this._container();
    this._coinCanvas = document.createElement('canvas');
    Object.assign(this._coinCanvas.style, {
      position: 'absolute', left: '0', top: '0',
      pointerEvents: 'none', zIndex: '9990',
    });
    c.appendChild(this._coinCanvas);
  }

  // ── Main Loop ─────────────────────────────────────────────

  _startLoop() {
    const loop = () => {
      const now = Date.now();

      if (now - this._lastMarketTick > 500) {
        MarketEngine.tick();
        this._lastMarketTick = now;
      }
      if (now - this._lastHudUpdate > 1000) {
        this._renderHud();
        this._updateTicker();
        this._lastHudUpdate = now;
      }

      // Scroll ticker
      this._tickerOffset -= 1.4;
      if (this._tickerInner) {
        const w = this._tickerInner.scrollWidth / 4;
        if (Math.abs(this._tickerOffset) >= w) this._tickerOffset = 0;
        this._tickerInner.style.left = `${this._tickerOffset}px`;
      }

      // Spawn rent coins passively
      if (now - this._lastRentSpawn > 2000 && PortfolioManager.getProperties().length > 0) {
        this._lastRentSpawn = now;
        this._spawnRentCoin();
        const inc = PortfolioManager.getMonthlyIncome();
        if (inc > 0) PortfolioManager.addCash(inc / (30 * 24 * 3600 / 2.0));
      }

      // Show/hide interact prompt based on proximity
      this._updateInteractPrompt();

      this._drawCoins();
      this._rafId = requestAnimationFrame(loop);
    };
    this._rafId = requestAnimationFrame(loop);
  }

  _updateInteractPrompt() {
    if (!this._promptEl) return;
    const player = this.gameEnv?.gameObjects?.find(o => o?.constructor?.name === 'Player');
    if (!player) return;

    const px = player.position.x + player.width / 2;
    const py = player.position.y + player.height / 2;
    const nearNpc = this.gameEnv?.gameObjects?.some(o => {
      if (o?.constructor?.name !== 'Npc') return false;
      const nx = o.position.x + o.width / 2;
      const ny = o.position.y + o.height / 2;
      return Math.hypot(px - nx, py - ny) < player.width * 2.5;
    });

    this._promptEl.style.display = nearNpc ? 'block' : 'none';
  }

  _spawnRentCoin() {
    const W = this.gameEnv.innerWidth;
    const H = this.gameEnv.innerHeight;
    const inc = PortfolioManager.getMonthlyIncome();
    const value = Math.max(50, Math.floor(inc / 30 / 24 * 2.0));
    this._rentCoins.push({
      x: W * 0.1 + Math.random() * W * 0.6,
      y: H * 0.7 + Math.random() * H * 0.08,
      vy: -3.2 - Math.random() * 1.8,
      vx: (Math.random() - 0.5) * 2.4,
      life: 1.0, value,
      spin: Math.random() * Math.PI * 2,
    });
  }

  _drawCoins() {
    const canvas = this._coinCanvas;
    if (!canvas) return;
    const W = this.gameEnv.innerWidth;
    const H = this.gameEnv.innerHeight;
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext('2d');

    for (let i = this._rentCoins.length - 1; i >= 0; i--) {
      const c = this._rentCoins[i];
      c.x += c.vx; c.y += c.vy; c.vy += 0.07;
      c.spin += 0.12; c.life -= 0.008;
      if (c.life <= 0) { this._rentCoins.splice(i, 1); continue; }

      ctx.save();
      ctx.globalAlpha = Math.min(1, c.life * 1.5);
      ctx.translate(c.x, c.y);
      ctx.rotate(c.spin);

      // Coin body
      ctx.beginPath(); ctx.arc(0, 0, 15, 0, Math.PI * 2);
      const g = ctx.createRadialGradient(-5, -5, 2, 0, 0, 15);
      g.addColorStop(0, '#ffe066'); g.addColorStop(0.6, '#ffc107'); g.addColorStop(1, '#e6a000');
      ctx.fillStyle = g; ctx.fill();
      ctx.strokeStyle = '#c07800'; ctx.lineWidth = 2; ctx.stroke();

      // $ symbol
      ctx.rotate(-c.spin);
      ctx.fillStyle = '#7a4800'; ctx.font = 'bold 12px Arial';
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText('$', 0, 1);
      ctx.restore();

      // Value label
      ctx.save();
      ctx.globalAlpha = Math.min(1, c.life * 1.4);
      ctx.fillStyle = '#ffd700'; ctx.font = 'bold 11px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(`+$${c.value}`, c.x, c.y - 22);
      ctx.restore();
    }
  }

  // ── Portfolio Modal ───────────────────────────────────────

  _showPortfolioModal() {
    document.getElementById('ret-portfolio-modal')?.remove();
    const p = PortfolioManager.getPortfolio();
    const props = p.properties;
    const nw = PortfolioManager.getNetWorth(MarketEngine.getSummary());
    const inc = PortfolioManager.getMonthlyIncome();

    // Full-screen backdrop — clicking it closes the modal
    const backdrop = document.createElement('div');
    backdrop.id = 'ret-portfolio-modal';
    Object.assign(backdrop.style, {
      position: 'fixed', inset: '0', zIndex: '2147483647',
      background: 'rgba(0,0,0,0.6)', display: 'flex',
      alignItems: 'center', justifyContent: 'center',
    });

    const modal = document.createElement('div');
    Object.assign(modal.style, {
      width: '500px', maxHeight: '72vh', overflowY: 'auto',
      background: 'linear-gradient(145deg,#06091a,#0d1428)',
      border: '1px solid rgba(100,160,255,0.28)', borderRadius: '18px',
      color: '#fff', fontFamily: '"Segoe UI",Arial,sans-serif',
      boxShadow: '0 10px 60px rgba(0,0,0,0.8)', padding: '22px',
    });

    const propRows = props.length === 0
      ? '<div style="color:#555;text-align:center;padding:24px;font-size:13px">No properties yet.<br>Visit a broker to make your first deal!</div>'
      : props.map(pr => {
          const curVal = Math.floor(pr.purchasePrice * MarketEngine.getMultiplier(pr.type));
          const gain = curVal - pr.purchasePrice;
          return `
            <div style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.06);border-radius:12px;padding:12px 14px;margin-bottom:9px;display:flex;justify-content:space-between;align-items:center;gap:10px">
              <div style="flex:1;min-width:0">
                <div style="font-weight:700;font-size:13px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${pr.emoji||'🏠'} ${pr.name}</div>
                <div style="font-size:10px;color:#8aa;margin-top:3px">Bought $${_fmt(pr.purchasePrice)} • Rent $${_fmt(pr.monthlyRent)}/mo</div>
                <div style="font-size:10px;margin-top:2px">
                  <span style="color:${gain>=0?'#4eff91':'#ff5b5b'}">
                    ${gain>=0?'▲':'▼'} Market value $${_fmt(curVal)} (${gain>=0?'+':''}${_fmt(gain)})
                  </span>
                  <span style="color:#ffd700;margin-left:8px">★ Lv ${pr.upgradeLevel}/3</span>
                </div>
              </div>
              <div style="display:flex;flex-direction:column;gap:5px;flex-shrink:0">
                <button onclick="window._retUpgrade('${pr.ownedId}')"
                  style="background:#0d2a4a;border:1px solid #1a5a9a;color:#64b5f6;padding:5px 12px;border-radius:8px;cursor:pointer;font-size:11px;font-weight:600">
                  ⬆ Upgrade
                </button>
                <button onclick="window._retSell('${pr.ownedId}')"
                  style="background:#3a1010;border:1px solid #6a2020;color:#ff7070;padding:5px 12px;border-radius:8px;cursor:pointer;font-size:11px;font-weight:600">
                  💰 Sell
                </button>
              </div>
            </div>
          `;
        }).join('');

    modal.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px">
        <div style="font-size:17px;font-weight:800;color:#ffd700">📋 Property Portfolio</div>
        <button class="ret-modal-close-btn"
          style="background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.12);color:#ccc;width:30px;height:30px;border-radius:50%;cursor:pointer;font-size:15px;line-height:1">✕</button>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:9px;margin-bottom:16px;font-size:11px;text-align:center">
        <div style="background:rgba(255,215,0,0.07);padding:9px;border-radius:10px;border:1px solid rgba(255,215,0,0.15)">
          <div style="color:#8aa;font-size:9px;text-transform:uppercase;margin-bottom:3px">Net Worth</div>
          <div style="font-weight:700;color:#ffd700;font-size:14px">$${_fmt(nw)}</div>
        </div>
        <div style="background:rgba(78,255,145,0.07);padding:9px;border-radius:10px;border:1px solid rgba(78,255,145,0.15)">
          <div style="color:#8aa;font-size:9px;text-transform:uppercase;margin-bottom:3px">Mo. Income</div>
          <div style="font-weight:700;color:#4eff91;font-size:14px">${inc>=0?'+':''}$${_fmt(inc)}</div>
        </div>
        <div style="background:rgba(100,181,246,0.07);padding:9px;border-radius:10px;border:1px solid rgba(100,181,246,0.15)">
          <div style="color:#8aa;font-size:9px;text-transform:uppercase;margin-bottom:3px">Rent Earned</div>
          <div style="font-weight:700;color:#64b5f6;font-size:14px">$${_fmt(p.totalRentCollected||0)}</div>
        </div>
      </div>
      <div style="font-size:11px;font-weight:700;color:#666;margin-bottom:10px;text-transform:uppercase;letter-spacing:.5px">
        Your Properties (${props.length})
      </div>
      ${propRows}
      <div style="margin-top:14px;display:flex;gap:8px">
        <button onclick="window._retCollectRent()"
          style="flex:1;background:linear-gradient(135deg,#1a4a1a,#1a3a0a);border:1px solid #2e6a1e;color:#4eff91;padding:10px;border-radius:10px;cursor:pointer;font-size:12px;font-weight:700">
          💵 Collect Rent
        </button>
        <button onclick="window._retResetPortfolio()"
          style="background:rgba(255,50,50,0.1);border:1px solid rgba(255,50,50,0.2);color:#ff7070;padding:10px 16px;border-radius:10px;cursor:pointer;font-size:11px">
          🔄 Reset
        </button>
      </div>
    `;

    const closeModal = () => backdrop.remove();
    modal.querySelector('.ret-modal-close-btn').addEventListener('click', closeModal);
    backdrop.addEventListener('click', e => { if (e.target === backdrop) closeModal(); });

    window._retUpgrade = (ownedId) => {
      const pr = PortfolioManager.getProperties().find(x => x.ownedId === ownedId);
      if (!pr) return;
      if (pr.upgradeLevel >= 3) { alert('Already at max upgrade (Level 3)!'); return; }
      const cost = Math.floor(pr.purchasePrice * 0.15 * (pr.upgradeLevel + 1));
      if (PortfolioManager.getCash() < cost) { alert(`Need $${_fmt(cost)} to upgrade.`); return; }
      if (confirm(`Upgrade ${pr.name} for $${_fmt(cost)}?\n+30% rent increase.`)) {
        PortfolioManager.upgradeProperty(ownedId);
        backdrop.remove(); this._showPortfolioModal();
      }
    };
    window._retSell = (ownedId) => {
      const pr = PortfolioManager.getProperties().find(x => x.ownedId === ownedId);
      if (!pr) return;
      const mult = MarketEngine.getMultiplier(pr.type);
      const sale = Math.floor(pr.purchasePrice * mult);
      if (confirm(`Sell ${pr.name} for $${_fmt(sale)}?\n(Bought at $${_fmt(pr.purchasePrice)})`)) {
        PortfolioManager.sellProperty(ownedId, sale);
        backdrop.remove(); this._showPortfolioModal();
      }
    };
    window._retCollectRent = () => {
      const result = PortfolioManager.collectRent();
      if (result.totalRent > 0) {
        backdrop.remove();
        this._showRentPopup(result);
      } else {
        this._showToast('No rent due yet — come back later!', '#ffd700');
      }
    };
    window._retResetPortfolio = () => {
      if (confirm('Reset your portfolio? All properties and cash will be cleared.')) {
        PortfolioManager.clear();
        localStorage.removeItem('ret_player_name');
        backdrop.remove();
        window.location.reload();
      }
    };

    backdrop.appendChild(modal);
    this._container().appendChild(backdrop);
  }

  // ── Bank Modal ────────────────────────────────────────────

  _showBankModal() {
    document.getElementById('ret-bank-modal')?.remove();
    const p = PortfolioManager.getPortfolio();
    const nw = PortfolioManager.getNetWorth(MarketEngine.getSummary());
    const maxLoan = Math.floor(nw * 0.65);
    const avail = Math.max(0, maxLoan - p.totalDebt);

    const backdrop = document.createElement('div');
    backdrop.id = 'ret-bank-modal';
    Object.assign(backdrop.style, {
      position: 'fixed', inset: '0', zIndex: '2147483647',
      background: 'rgba(0,0,0,0.6)', display: 'flex',
      alignItems: 'center', justifyContent: 'center',
    });

    const modal = document.createElement('div');
    Object.assign(modal.style, {
      width: '420px',
      background: 'linear-gradient(145deg,#06091a,#0d1428)',
      border: '1px solid rgba(100,160,255,0.28)', borderRadius: '18px',
      color: '#fff', fontFamily: '"Segoe UI",Arial,sans-serif',
      boxShadow: '0 10px 60px rgba(0,0,0,0.8)', padding: '24px',
    });

    modal.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:18px">
        <div style="font-size:17px;font-weight:800;color:#ffd700">🏦 First National Bank</div>
        <button id="ret-bank-close"
          style="background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.12);color:#ccc;width:30px;height:30px;border-radius:50%;cursor:pointer;font-size:15px">✕</button>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:9px;margin-bottom:18px">
        <div style="background:rgba(255,255,255,0.04);padding:10px;border-radius:10px">
          <div style="font-size:9px;color:#8aa;text-transform:uppercase">Net Worth</div>
          <div style="font-weight:700;color:#ffd700;font-size:14px">$${_fmt(nw)}</div>
        </div>
        <div style="background:rgba(255,255,255,0.04);padding:10px;border-radius:10px">
          <div style="font-size:9px;color:#8aa;text-transform:uppercase">Current Debt</div>
          <div style="font-weight:700;color:${p.totalDebt>0?'#ff8f00':'#666'};font-size:14px">$${_fmt(p.totalDebt)}</div>
        </div>
        <div style="background:rgba(78,255,145,0.06);padding:10px;border-radius:10px;border:1px solid rgba(78,255,145,0.15)">
          <div style="font-size:9px;color:#8aa;text-transform:uppercase">Available Credit</div>
          <div style="font-weight:700;color:#4eff91;font-size:14px">$${_fmt(avail)}</div>
        </div>
        <div style="background:rgba(255,255,255,0.04);padding:10px;border-radius:10px">
          <div style="font-size:9px;color:#8aa;text-transform:uppercase">Interest Rate</div>
          <div style="font-weight:700;color:#64b5f6;font-size:14px">6.5% / yr</div>
        </div>
      </div>
      <div style="margin-bottom:14px">
        <label style="display:block;font-size:11px;color:#8aa;margin-bottom:6px;text-transform:uppercase">
          Amount (positive = borrow, negative = repay)
        </label>
        <input id="ret-bank-amount" type="number" placeholder="e.g. 100000"
          style="width:100%;box-sizing:border-box;background:rgba(255,255,255,0.07);border:1px solid rgba(255,255,255,0.15);
          border-radius:8px;padding:10px 12px;color:#fff;font-size:13px;outline:none;"/>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:9px">
        <button id="ret-bank-borrow"
          style="background:linear-gradient(135deg,#1a3a6e,#0d2044);border:1px solid #2a5aa0;color:#64b5f6;padding:12px;border-radius:10px;cursor:pointer;font-size:13px;font-weight:700">
          💳 Borrow
        </button>
        <button id="ret-bank-repay"
          style="background:linear-gradient(135deg,#1a4a1a,#0d2a0a);border:1px solid #2a6a1a;color:#4eff91;padding:12px;border-radius:10px;cursor:pointer;font-size:13px;font-weight:700">
          ✅ Repay
        </button>
      </div>
    `;

    const closeBank = () => backdrop.remove();
    modal.querySelector('#ret-bank-close').addEventListener('click', closeBank);
    modal.querySelector('#ret-bank-borrow').addEventListener('click', () => {
      const amt = Math.abs(parseInt(modal.querySelector('#ret-bank-amount').value));
      if (!amt || isNaN(amt)) return;
      if (PortfolioManager.takeLoan(amt, nw)) {
        this._showToast(`✅ Loan of $${_fmt(amt)} approved!`, '#4eff91', 3000);
        backdrop.remove(); this._showBankModal();
      } else {
        this._showToast(`❌ Loan denied. Available credit: $${_fmt(avail)}`, '#ff5b5b', 3500);
      }
    });
    modal.querySelector('#ret-bank-repay').addEventListener('click', () => {
      const amt = Math.abs(parseInt(modal.querySelector('#ret-bank-amount').value));
      if (!amt || isNaN(amt)) return;
      const repaid = PortfolioManager.repayLoan(amt);
      if (repaid) {
        this._showToast(`✅ Repaid $${_fmt(repaid)}`, '#4eff91', 3000);
        backdrop.remove(); this._showBankModal();
      } else {
        this._showToast('❌ Insufficient cash to repay', '#ff5b5b', 3000);
      }
    });
    backdrop.addEventListener('click', e => { if (e.target === backdrop) closeBank(); });

    backdrop.appendChild(modal);
    this._container().appendChild(backdrop);
  }

  // ── Notifications ─────────────────────────────────────────

  _showUnlockBanner(msg) {
    const c = this._container();
    const div = document.createElement('div');
    Object.assign(div.style, {
      position: 'absolute', top: '80px', left: '50%',
      transform: 'translateX(-50%)', zIndex: '10001',
      background: 'linear-gradient(135deg,#1a1a3e,#0d0d2e)',
      border: '2px solid #ffd700', borderRadius: '14px',
      padding: '14px 30px', color: '#ffd700', fontWeight: '700',
      fontSize: '16px', fontFamily: '"Segoe UI",Arial,sans-serif',
      textAlign: 'center', boxShadow: '0 4px 36px rgba(255,215,0,0.3)',
    });
    div.textContent = msg;
    c.appendChild(div);
    setTimeout(() => div.remove(), 5500);
  }

  _showRentPopup(result) {
    const c = this._container();
    const div = document.createElement('div');
    Object.assign(div.style, {
      position: 'absolute', top: '50%', left: '50%',
      transform: 'translate(-50%,-50%)', zIndex: '10002',
      background: 'linear-gradient(145deg,#0a1f0a,#142814)',
      border: '2px solid #4eff91', borderRadius: '18px',
      padding: '26px 40px', color: '#fff',
      fontFamily: '"Segoe UI",Arial,sans-serif', textAlign: 'center',
      boxShadow: '0 8px 52px rgba(78,255,145,0.3)',
    });
    div.innerHTML = `
      <div style="font-size:32px;margin-bottom:10px">💰</div>
      <div style="font-size:16px;font-weight:700;color:#4eff91;margin-bottom:4px">+$${_fmt(result.totalRent)} Rent Income!</div>
      ${result.interestOwed > 10 ? `<div style="font-size:13px;color:#ff8f00">-$${_fmt(result.interestOwed)} Loan Interest</div>` : ''}
      <div style="font-size:20px;font-weight:800;margin-top:10px;color:#ffd700">
        Net ${result.netRent >= 0 ? '+' : ''}$${_fmt(result.netRent)}
      </div>
      <div style="font-size:11px;color:#555;margin-top:16px">Click or press any key to dismiss</div>
    `;
    c.appendChild(div);
    const dismiss = () => {
      div.remove();
      document.removeEventListener('keydown', dismiss, { once: true });
    };
    div.addEventListener('click', dismiss);
    document.addEventListener('keydown', dismiss, { once: true });
  }

  _setUiVisible(visible) {
    [this._hud, this._ticker, this._eventBanner, this._coinCanvas, this._promptEl].forEach(el => {
      if (el) el.style.visibility = visible ? '' : 'hidden';
    });
  }

  // ── Styles / Welcome / Toast ──────────────────────────────

  _injectStyles() {
    if (document.getElementById('ret-styles')) return;
    const s = document.createElement('style');
    s.id = 'ret-styles';
    s.textContent = `
      @keyframes ret-fade-in { from { opacity:0; transform:translate(-50%,-60%) } to { opacity:1; transform:translate(-50%,-50%) } }
      @keyframes ret-slide-up { from { opacity:0; transform:translateX(-50%) translateY(10px) } to { opacity:1; transform:translateX(-50%) translateY(0) } }
      @keyframes ret-toast-in { from { opacity:0; transform:translate(-50%,6px) } to { opacity:1; transform:translate(-50%,0) } }
      @keyframes ret-pulse { 0%,100% { box-shadow:0 0 8px rgba(255,215,0,0.2) } 50% { box-shadow:0 0 22px rgba(255,215,0,0.6) } }
      #ret-hud { animation: ret-fade-in .3s ease; }
      #ret-portfolio-modal, #ret-bank-modal { animation: ret-fade-in .2s ease; }
    `;
    document.head.appendChild(s);
  }

  _showWelcomeBack() {
    const name = localStorage.getItem('ret_player_name') || 'Investor';
    const p = PortfolioManager.getPortfolio();
    const isNew = p.properties.length === 0 && p.cash <= 500000;
    if (isNew) return; // skip for first-time players — don't double with the name prompt
    const msg = `Welcome back, ${name}! 💼  ${p.properties.length} propert${p.properties.length === 1 ? 'y' : 'ies'} in your portfolio.`;
    this._showToast(msg, '#64b5f6', 4000);
  }

  _showToast(msg, color = '#ffd700', duration = 3000) {
    const c = this._container();
    const el = document.createElement('div');
    Object.assign(el.style, {
      position: 'absolute', bottom: '44px', left: '50%',
      transform: 'translateX(-50%)',
      zIndex: '10002', padding: '8px 20px',
      background: 'rgba(5,10,22,0.95)',
      border: `1px solid ${color}44`,
      borderRadius: '10px',
      color, fontFamily: '"Segoe UI",Arial,sans-serif',
      fontSize: '12.5px', fontWeight: '600',
      whiteSpace: 'nowrap', pointerEvents: 'none',
      animation: 'ret-toast-in .2s ease',
    });
    el.textContent = msg;
    c.appendChild(el);
    setTimeout(() => {
      el.style.transition = 'opacity .4s';
      el.style.opacity = '0';
      setTimeout(() => el.remove(), 420);
    }, duration);
  }

  // ── Market events ─────────────────────────────────────────

  _onMarketEvent(type, event) {
    if (type === 'event') {
      this._showEventBanner(event);
      this._updateTicker();
    } else if (type === 'event-end') {
      this._updateTicker();
    }
  }
}

function _fmt(n) {
  if (n === undefined || n === null) return '0';
  const abs = Math.abs(Math.floor(n));
  const sign = n < 0 ? '-' : '';
  if (abs >= 1000000) return `${sign}${(abs / 1000000).toFixed(1)}M`;
  if (abs >= 1000) return `${sign}${(abs / 1000).toFixed(0)}K`;
  return `${sign}${abs}`;
}

export default GameLevelMarketHub;
