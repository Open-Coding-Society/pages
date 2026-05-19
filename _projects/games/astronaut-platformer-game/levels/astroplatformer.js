import GameEnvBackground from '../../../GameEnginev1.1/essentials/GameEnvBackground.js';
import Player from '../../../GameEnginev1.1/essentials/Player.js';
import Coin from '../../../GameEnginev1.1/Coin.js';
import Leaderboard from '../../../GameEnginev1.1/essentials/Leaderboard.js';

class FixedPlatformerCoin extends Coin {
  update() {
    if (this.collected) return;
    this.draw();
  }

  collect() {
    if (this.collected) return;
    this.collected = true;  // Mark as collected first to prevent re-triggering
    if (typeof this.interact === 'function') {
      this.interact.call(this);
    }
    if (this.canvas) {
      this.canvas.style.opacity = '0';
      this.canvas.style.transition = 'opacity 0.3s';
      setTimeout(() => this.canvas?.remove(), 350);
    }
  }
}


// ─────────────────────────────────────────────────────────────────────────────
//  AstroPlatformer - "Crater Falls"
//
//  HOW THE PLATFORM SYSTEM WORKS
//  ─────────────────────────────
//  Every 16ms the physics loop runs:
//
//  1. HORIZONTAL VELOCITY  — set from held A/D keys, instantly (no friction).
//     Moving-platform bonus is added separately below.
//
//  2. JUMP — if W/Space pressed while _onGround, kick _vy to JUMP_FORCE (<0).
//     _canJump prevents re-triggering while key is held.
//
//  3. GRAVITY — add GRAVITY to _vy each frame, clamp to MAX_FALL so the
//     player doesn't accelerate forever through platforms.
//
//  4. PROPOSED POSITION — nx = px + vx, ny = py + vy.
//
//  5. PLATFORM COLLISION — for every platform (including moving one):
//       TOP:     player's bottom swept from above-to-below the platform top
//                this frame → snap ny to platTop - playerHeight, zero vy,
//                set _onGround = true.
//       CEILING: player's top swept from below-to-above the platform bottom
//                while jumping → snap ny to platBottom, zero vy.
//       WALLS:   player's vertical extent overlaps platform and they moved
//                into its left or right side → push nx back, zero vx.
//     _onGround resets to false before the loop each frame.
//
//  6. MOVING PLATFORM CARRY — if the player just landed on the moving
//     platform this frame (_onMovingPlat flag), _movingPlatVelX (the
//     platform's velocity that frame) is added to nx. This makes the player
//     slide with the platform instead of falling off.
//
//  7. SPIKE DEATH — checked using the player's resolved (post-collision) feet
//     position: bottom edge = ny + ph. Spikes are thin triangles; we check
//     whether the player's feet box overlaps the spike's hitbox.
//     (Using feet rather than center prevents the "platform snaps you above
//     the spike so center never overlaps" bug from the previous version.)
//
//  8. FALL DEATH — ny > screen height.
//
//  9. COIN / FLAG collection — player center vs object box.
//
//  COMPLETABLE ROUTE (left to right, all upward):
//    START (ground, x≈30)
//    → run right → jump onto p1 (y=290, x=40-160)
//    → jump right onto p2 (y=230, x=190-310)  [wider gap, lower platform]
//    → jump right onto moving platform p3 (y=200, oscillates x=310-480)
//    → jump right onto p4 (y=155, x=490-590)
//    → jump LEFT onto p5 (y=105, x=350-470)   [backtrack one step up]
//    → jump left onto p6 (y=60,  x=170-290)
//    → jump right across to goal shelf (y=60, x=500-620) + flag
//
// ─────────────────────────────────────────────────────────────────────────────

class AstroPlatformer {

constructor(gameEnv) {

const path   = gameEnv.path;
const width  = gameEnv.innerWidth;
const height = gameEnv.innerHeight;

const baseWidth  = 650;
const baseHeight = 400;
const scaleX = width  / baseWidth;
const scaleY = height / baseHeight;

// ── Cleanup refs ─────────────────────────────────────────────────────────
this._physicsInterval  = null;
this._overlays         = [];
this._styleEl          = null;
this._hud              = null;
this._deathScreen      = null;
this._leaderboard      = null;
this._isDead           = false;
this._won              = false;

// ── Physics state ─────────────────────────────────────────────────────────
this._vy             = 0;
this._vx             = 0;
this._onGround       = false;
this._canJump        = true;
this._onMovingPlat   = false;   // true when player is standing on moving plat
this._movingPlatVelX = 0;       // moving platform's velocity this frame
this._lives          = 3;
this._coins          = 0;

const baseLayout = {
  width:  baseWidth,
  height: baseHeight,
  playerStart: { x: 30, y: 320 },
  flag: { x: 540, y: 18 },
  movingPlat: { id:'p3_move', x:310, y:200, w:80, h:12, color:'#ff44aa', minX:300, maxX:470, spd:1.4 },
  platforms: [
    { id:'ground',  x:0,   y:370, w:650, h:30, color:'#2a5a2a' },
    { id:'wall_l',  x:0,   y:0,   w:10,  h:400, color:'#1a3a1a' },
    { id:'wall_r',  x:640, y:0,   w:10,  h:400, color:'#1a3a1a' },
    { id:'ceil',    x:0,   y:0,   w:650, h:8,   color:'#1a3a1a' },
    { id:'p1',      x:40,  y:290, w:120, h:12,  color:'#4a9eff' },
    { id:'p2',      x:190, y:230, w:120, h:12,  color:'#4a9eff' },
    { id:'p4',      x:490, y:155, w:100, h:12,  color:'#ff9944' },
    { id:'p5',      x:330, y:105, w:130, h:12,  color:'#4a9eff' },
    { id:'p6',      x:150, y:60,  w:130, h:12,  color:'#ff9944' },
    { id:'goal',    x:500, y:60,  w:125, h:12,  color:'#c8a84b' },
  ],
  spikes: [
    { x:355, y:350, w:20, h:20 },
    { x:385, y:350, w:20, h:20 },
    { x:415, y:350, w:20, h:20 },
    { x:445, y:350, w:20, h:20 },
    { x:475, y:350, w:20, h:20 },
  ],
  coins: [
    { id:'coin_p1',   x:90,  y:268 },
    { id:'coin_p2',   x:240, y:208 },
    { id:'coin_move', x:375, y:178 },
    { id:'coin_p4',   x:525, y:133 },
    { id:'coin_p5',   x:385, y:83  },
    { id:'coin_p6',   x:195, y:38  },
    { id:'coin_goal', x:555, y:38  },
  ],
};

const scalePlatform = (source, sx, sy) => ({
  id: source.id,
  color: source.color,
  sx: source.x * sx,
  sy: source.y * sy,
  sw: source.w * sx,
  sh: source.h * sy,
  base: source,
});
const scaleSpike = (source, sx, sy) => ({
  x: source.x * sx,
  y: source.y * sy,
  w: source.w * sx,
  h: source.h * sy,
  killY: (source.y + source.h * 0.4) * sy,
  base: source,
});
const scaleCoin = (source, sx, sy) => ({
  id: source.id,
  x: source.x * sx,
  y: source.y * sy,
  w: 14 * sx,
  h: 14 * sy,
  value: 1,
  collected: false,
  interact: function () {
    if (!this.collected) {
      this.collected = true;
      const savedCoins = parseInt(localStorage.getItem('coinsCollected') || '0') || 0;
      const newTotal = savedCoins + this.value;
      localStorage.setItem('coinsCollected', newTotal);
      if (!gameEnv.stats) gameEnv.stats = {};
      gameEnv.stats.coinsCollected = newTotal;
      console.log(`Coin collected! Total coins: ${newTotal}`);
    }
  },
  base: source,
});

const rebuildLayout = (sx, sy) => {
  this._scaleX = sx;
  this._scaleY = sy;
  this._gravity   = 0.52 * sy;
  this._jumpForce = -11 * sy;
  this._moveSpeed = 3.8 * sx;
  this._maxFall   = 15 * sy;

  this._platforms = baseLayout.platforms.map(p => scalePlatform(p, sx, sy));
  this._movingPlat = scalePlatform(baseLayout.movingPlat, sx, sy);
  this._movingDir = this._movingDir || 1;
  this._movingMinX = baseLayout.movingPlat.minX * sx;
  this._movingMaxX = baseLayout.movingPlat.maxX * sx;
  this._movingSpd = baseLayout.movingPlat.spd * sx;
  this._spikes = baseLayout.spikes.map(s => scaleSpike(s, sx, sy));
  this._coinPositions = baseLayout.coins.map(c => scaleCoin(c, sx, sy));
  this._flagX = baseLayout.flag.x * sx;
  this._flagY = baseLayout.flag.y * sy;
  this._playerStart = { x: baseLayout.playerStart.x * sx, y: baseLayout.playerStart.y * sy };
};

rebuildLayout(scaleX, scaleY);

// ── Key state ─────────────────────────────────────────────────────────────
const keys = { w:false, a:false, d:false, space:false };
this._keyDown = e => {
  if (e.key==='w'||e.key==='W'||e.key==='ArrowUp')    keys.w=true;
  if (e.key==='a'||e.key==='A'||e.key==='ArrowLeft')  keys.a=true;
  if (e.key==='d'||e.key==='D'||e.key==='ArrowRight') keys.d=true;
  if (e.key===' ') { keys.space=true; e.preventDefault(); }
};
this._keyUp = e => {
  if (e.key==='w'||e.key==='W'||e.key==='ArrowUp')    keys.w=false;
  if (e.key==='a'||e.key==='A'||e.key==='ArrowLeft')  keys.a=false;
  if (e.key==='d'||e.key==='D'||e.key==='ArrowRight') keys.d=false;
  if (e.key===' ') keys.space=false;
};
document.addEventListener('keydown', this._keyDown);
document.addEventListener('keyup',   this._keyUp);

// ── STATIC PLATFORMS ───────────────────────────────────────────────────────
//  Route flows: START → p1 → p2 → moving p3 → p4 → p5 → p6 → GOAL
//  Every jump gap is ≤ 120px on base grid (very jumpable).
//  Heights step up by ~40-50px each time.
//
//  x ranges and gaps:
//    ground: 0–650  (full floor, minus pit hole 255–335)
//    p1:     40–160   gap from ground right edge: jump up ~80px
//    p2:     190–310  gap from p1 right edge: 30px horizontal, -60px height
//    p3 mov: 310–470  (oscillates, so player times jump)
//    p4:     490–590  gap from p3 right edge: ~20px, -45px height
//    p5:     330–460  gap from p4 left: jump left ~50px, up ~50px
//    p6:     150–280  gap from p5 left: jump left ~80px, -45px height
//    goal:   500–625  jump right from p6: ~220px — requires a running jump!
//            (this is the skill challenge at the end)

// ── MOVING PLATFORM ────────────────────────────────────────────────────────
// Oscillates between x=300 and x=470 (base grid)

// ── SPIKES ─────────────────────────────────────────────────────────────────
// All on the ground between the pit and p4.
// Player MUST platform over this zone — no walking through.
// Stored in scaled pixels. Hitbox is the bottom 60% of the triangle
// (the wide base) — that's what actually stabs you.

// ── COINS ──────────────────────────────────────────────────────────────────

// Flag position (on goal shelf)
// _flagX and _flagY are set by rebuildLayout()

// ── Background ────────────────────────────────────────────────────────────
const bgData = {
  name: 'crater_bg',
  src:  path + '/images/gamebuilder/bg/alien_planet.jpg',
  pixels: { height:772, width:1134 }
};

// ── Player — same astro sprite ─────────────────────────────────────────────
// STEP_FACTOR set absurdly high so the engine doesn't fight our position control
const playerData = {
  id: 'playerData',
  src: path + '/images/gamebuilder/sprites/astro.png',
  SCALE_FACTOR:   10,
  STEP_FACTOR:    999999,
  ANIMATION_RATE: 60,
  INIT_POSITION:  { x: 30*scaleX, y: 320*scaleY },
  pixels:      { height:770, width:513 },
  orientation: { rows:4, columns:4 },
  down:      { row:0, start:0, columns:3 },
  downRight: { row:2, start:0, columns:3 },
  downLeft:  { row:1, start:0, columns:3 },
  left:      { row:1, start:0, columns:3 },
  right:     { row:2, start:0, columns:3 },
  up:        { row:3, start:0, columns:3 },
  upLeft:    { row:1, start:0, columns:3 },
  upRight:   { row:3, start:0, columns:3 },
  hitbox: { widthPercentage:0.3, heightPercentage:0.3 },
  keypress: { up:87, left:65, down:83, right:68 }
};

const coinClasses = this._coinPositions.map((coin) => ({
  class: FixedPlatformerCoin,
  data: {
    id: coin.id,
    INIT_POSITION: { x: coin.x, y: coin.y },
    SCALE_FACTOR: 28.5,
    hitbox: { widthPercentage: 0.2, heightPercentage: 0.2 },
    zIndex: 11,
    value: coin.value,
    color: '#FFD700',
    interact: coin.interact,
  }
}));

this.classes = [
  { class: GameEnvBackground, data: bgData    },
  { class: Player,            data: playerData },
  ...coinClasses,
];

// ═══════════════════════════════════════════════════════════════════════════
//  initialize() — called after game objects exist
// ═══════════════════════════════════════════════════════════════════════════
this.initialize = () => {
  const container = gameEnv.container || gameEnv.gameContainer;
  if (!container) return;

  gameEnv.stats = gameEnv.stats || {};
  const storedCoins = parseInt(localStorage.getItem('coinsCollected') || '0') || 0;
  gameEnv.stats.coinsCollected = storedCoins;
  this._coins = 0;

  this._leaderboard = window.leaderboardInstance || new Leaderboard(gameEnv.gameControl, {
    gameName: 'astronaut-platformer-game',
    initiallyHidden: false
  });

  // Drive "Coins Collected" on the leaderboard widget from gameEnv.stats (updates every 100ms).
  if (typeof gameEnv.initScoreManager === 'function') {
    gameEnv
      .initScoreManager()
      .then((sm) => {
        if (sm && typeof sm.updateScoreDisplay === 'function') {
          sm.updateScoreDisplay(gameEnv.stats.coinsCollected);
          sm.toggleScoreDisplay();
        }
      })
      .catch((err) => console.warn('AstroPlatformer: initScoreManager failed', err));
  }

  // CSS animations
  const style = document.createElement('style');
  style.textContent = `
    @keyframes flagWave {
      0%,100%{ transform:skewX(0deg);  }
      40%    { transform:skewX(-8deg); }
      70%    { transform:skewX(6deg);  }
    }
    @keyframes coinSpin {
      0%  { transform:scaleX(1);   }
      50% { transform:scaleX(0.1); }
      100%{ transform:scaleX(1);   }
    }
    @keyframes movGlow {
      0%,100%{ box-shadow:0 0 8px rgba(255,68,170,0.6); }
      50%    { box-shadow:0 0 20px rgba(255,68,170,1.0);}
    }
    .l3-mov { animation: movGlow 1.5s ease-in-out infinite; }
    .l3-coin { animation: coinSpin 1.4s linear infinite; border-radius:50%; }
  `;
  document.head.appendChild(style);
  this._styleEl = style;

  const top = gameEnv.top || 0;

  // ── Draw static platforms ──────────────────────────────────────────────
  for (const p of this._platforms) {
    const el = document.createElement('div');
    Object.assign(el.style, {
      position:'absolute',
      left: p.sx + 'px', top: (top + p.sy) + 'px',
      width: p.sw + 'px', height: p.sh + 'px',
      background: p.color,
      borderRadius: (p.id==='ground'||p.id==='ceil') ? '0' : '4px',
      zIndex: '8', pointerEvents: 'none',
      boxShadow: p.color==='#2a5a2a' ? 'inset 0 3px 0 rgba(100,200,100,0.3)'
               : p.color==='#c8a84b' ? '0 0 14px rgba(200,168,75,0.7)'
               : p.color==='#1a3a1a' ? 'none'
               : 'inset 0 2px 0 rgba(255,255,255,0.2)',
      border: p.color==='#c8a84b' ? '1px solid rgba(200,168,75,0.9)'
            : p.color==='#1a3a1a' ? 'none'
            : '1px solid rgba(255,255,255,0.1)',
    });
    container.appendChild(el);
    this._overlays.push(el);
    p._el = el;
  }

  // ── Draw moving platform ───────────────────────────────────────────────
  const mp = this._movingPlat;
  const mpEl = document.createElement('div');
  Object.assign(mpEl.style, {
    position:'absolute', left: mp.sx+'px', top: (top+mp.sy)+'px',
    width: mp.sw+'px', height: mp.sh+'px',
    background: mp.color, borderRadius:'4px', zIndex:'8',
    pointerEvents:'none', border:'1px solid rgba(255,100,200,0.5)',
  });
  mpEl.classList.add('l3-mov');
  container.appendChild(mpEl);
  this._overlays.push(mpEl);
  mp._el = mpEl;

  const mpLbl = document.createElement('div');
  Object.assign(mpLbl.style, {
    position:'absolute', top:(top+mp.sy-18*scaleY)+'px', left:mp.sx+'px',
    width:mp.sw+'px', fontSize: Math.round(6*Math.min(scaleX,scaleY))+'px',
    color:'#ff88cc', textAlign:'center', pointerEvents:'none',
    fontFamily:"'Press Start 2P',monospace", zIndex:'9',
    textShadow:'0 0 6px rgba(255,68,170,0.8)',
  });
  mpLbl.textContent = '~ MOVING ~';
  container.appendChild(mpLbl);
  this._overlays.push(mpLbl);
  mp._lblEl = mpLbl;

  // ── Draw spikes ────────────────────────────────────────────────────────
  for (const sp of this._spikes) {
    const el = document.createElement('div');
    Object.assign(el.style, {
      position:'absolute',
      left: sp.x+'px', top: (top+sp.y)+'px',
      width: sp.w+'px', height: sp.h+'px',
      background: '#ff3333',
      clipPath: 'polygon(0% 100%, 50% 0%, 100% 100%)',
      zIndex:'9', pointerEvents:'none',
      filter:'drop-shadow(0 0 5px rgba(255,50,50,0.9))',
    });
    container.appendChild(el);
    this._overlays.push(el);
    sp._el = el;
  }

  // ── Draw pit hole (visual darkness) ────────────────────────────────────
  const pitEl = document.createElement('div');
  Object.assign(pitEl.style, {
    position:'absolute',
    left: (250*scaleX)+'px', top: (top + 340*scaleY)+'px',
    width: (80*scaleX)+'px', height: (32*scaleY)+'px',
    background:'#000', zIndex:'7', pointerEvents:'none',
  });
  container.appendChild(pitEl);
  this._overlays.push(pitEl);
  this._pitEl = pitEl;

  // ── Draw flag ──────────────────────────────────────────────────────────
  const pole = document.createElement('div');
  Object.assign(pole.style, {
    position:'absolute', left: this._flagX+'px',
    top: (top+this._flagY)+'px',
    width:(3*scaleX)+'px', height:(42*scaleY)+'px',
    background:'#aaa', zIndex:'10', pointerEvents:'none',
    boxShadow:'0 0 6px rgba(200,200,200,0.4)',
  });
  container.appendChild(pole);
  this._overlays.push(pole);
  this._flagPoleEl = pole;

  const banner = document.createElement('div');
  Object.assign(banner.style, {
    position:'absolute',
    left: (this._flagX + 3*scaleX)+'px',
    top:  (top + this._flagY)+'px',
    width:(24*scaleX)+'px', height:(16*scaleY)+'px',
    background:'#00ff88', borderRadius:'0 3px 3px 0',
    zIndex:'10', pointerEvents:'none',
    transformOrigin:'left center',
    animation:'flagWave 1.2s ease-in-out infinite',
    boxShadow:'0 0 12px rgba(0,255,136,0.8)',
  });
  container.appendChild(banner);
  this._overlays.push(banner);
  this._flagBannerEl = banner;

  const goalLbl = document.createElement('div');
  Object.assign(goalLbl.style, {
    position:'absolute',
    left:(this._flagX - 8*scaleX)+'px',
    top:(top + this._flagY + 46*scaleY)+'px',
    width:(50*scaleX)+'px',
    fontFamily:"'Press Start 2P',monospace",
    fontSize: Math.round(7*Math.min(scaleX,scaleY))+'px',
    color:'#c8a84b', textAlign:'center', pointerEvents:'none', zIndex:'10',
    textShadow:'0 0 8px rgba(200,168,75,0.9)',
  });
  goalLbl.textContent = 'GOAL';
  container.appendChild(goalLbl);
  this._overlays.push(goalLbl);
  this._flagGoalLabelEl = goalLbl;

  // ── Connect Coin.js objects to the custom platformer collision boxes ───
  for (const c of this._coinPositions) {
    const coinObject = gameEnv.gameObjects.find(
      obj => obj instanceof FixedPlatformerCoin && obj.spriteData?.id === c.id
    );
    c._coinObject = coinObject || null;
    if (coinObject?.canvas) {
      coinObject.canvas.classList.add('l3-coin');
      coinObject.canvas.style.boxShadow = '0 0 8px rgba(255,215,0,0.8)';
      coinObject.canvas.style.pointerEvents = 'none';
    }
  }

  this.resize = () => {
    const newScaleX = gameEnv.innerWidth / baseWidth;
    const newScaleY = gameEnv.innerHeight / baseHeight;
    if (newScaleX === this._scaleX && newScaleY === this._scaleY) return;

    const ratioX = newScaleX / this._scaleX;
    const ratioY = newScaleY / this._scaleY;
    rebuildLayout(newScaleX, newScaleY);

    const top = gameEnv.top || 0;

    for (const p of this._platforms) {
      if (p._el) {
        Object.assign(p._el.style, {
          left: p.sx + 'px',
          top: (top + p.sy) + 'px',
          width: p.sw + 'px',
          height: p.sh + 'px',
        });
      }
    }

    if (this._movingPlat._el) {
      Object.assign(this._movingPlat._el.style, {
        left: this._movingPlat.sx + 'px',
        top: (top + this._movingPlat.sy) + 'px',
        width: this._movingPlat.sw + 'px',
        height: this._movingPlat.sh + 'px',
      });
    }
    if (this._movingPlat._lblEl) {
      this._movingPlat._lblEl.style.left = this._movingPlat.sx + 'px';
      this._movingPlat._lblEl.style.top = (top + this._movingPlat.sy - 18 * this._scaleY) + 'px';
    }

    for (const sp of this._spikes) {
      if (sp._el) {
        Object.assign(sp._el.style, {
          left: sp.x + 'px',
          top: (top + sp.y) + 'px',
          width: sp.w + 'px',
          height: sp.h + 'px',
        });
      }
    }

    if (this._pitEl) {
      Object.assign(this._pitEl.style, {
        left: (250 * this._scaleX) + 'px',
        top: (top + 340 * this._scaleY) + 'px',
        width: (80 * this._scaleX) + 'px',
        height: (32 * this._scaleY) + 'px',
      });
    }

    if (this._flagPoleEl) {
      Object.assign(this._flagPoleEl.style, {
        left: this._flagX + 'px',
        top: (top + this._flagY) + 'px',
        width: (3 * this._scaleX) + 'px',
        height: (42 * this._scaleY) + 'px',
      });
    }
    if (this._flagBannerEl) {
      Object.assign(this._flagBannerEl.style, {
        left: (this._flagX + 3 * this._scaleX) + 'px',
        top: (top + this._flagY) + 'px',
        width: (24 * this._scaleX) + 'px',
        height: (16 * this._scaleY) + 'px',
      });
    }
    if (this._flagGoalLabelEl) {
      Object.assign(this._flagGoalLabelEl.style, {
        left: (this._flagX - 8 * this._scaleX) + 'px',
        top: (top + this._flagY + 46 * this._scaleY) + 'px',
        width: (50 * this._scaleX) + 'px',
        fontSize: Math.round(7 * Math.min(this._scaleX, this._scaleY)) + 'px',
      });
    }

    if (this._hud) {
      this._hud.style.fontSize = Math.round(10 * Math.min(this._scaleX, this._scaleY)) + 'px';
    }
    if (this._movingPlat._lblEl) {
      this._movingPlat._lblEl.style.fontSize = Math.round(6 * Math.min(this._scaleX, this._scaleY)) + 'px';
    }

    for (const c of this._coinPositions) {
      if (c._coinObject) {
        c._coinObject.position.x = c.x;
        c._coinObject.position.y = c.y;
        if (typeof c._coinObject.resize === 'function') {
          c._coinObject.resize();
        }
      }
    }

    const player = gameEnv.gameObjects.find(o => o instanceof Player);
    if (player) {
      player.position.x *= ratioX;
      player.position.y *= ratioY;
      if (typeof player.resize === 'function') {
        player.resize();
      }
    }
  };

  // ── HUD ────────────────────────────────────────────────────────────────
  const hud = document.createElement('div');
  Object.assign(hud.style, {
    position:'fixed', top:'12px', left:'12px',
    fontFamily:"'Press Start 2P',monospace",
    fontSize: Math.round(10*Math.min(scaleX,scaleY))+'px',
    color:'#e8ffe8', zIndex:'100001', pointerEvents:'none',
    textShadow:'0 0 6px rgba(0,0,0,0.8)', lineHeight:'2.2',
  });
  document.body.appendChild(hud);
  this._hud = hud;
  this._updateHud();

  // Title flash
  const titleEl = document.createElement('div');
  Object.assign(titleEl.style, {
    position:'fixed', top:'50%', left:'50%',
    transform:'translate(-50%,-50%)',
    fontFamily:"'Press Start 2P',monospace",
    fontSize: Math.round(18*Math.min(scaleX,scaleY))+'px',
    color:'#00ff88', textAlign:'center', zIndex:'200000',
    textShadow:'0 0 20px rgba(0,255,136,0.9)',
    pointerEvents:'none', transition:'opacity 1s',
  });
  titleEl.innerHTML = `
    <div>CRATER FALLS</div>
    <div style="font-size:0.5em;color:#aaffcc;margin-top:10px">
      W / ↑ jump &nbsp;·&nbsp; A D / ← → move
    </div>`;
  document.body.appendChild(titleEl);
  this._overlays.push(titleEl);
  setTimeout(()=>{ titleEl.style.opacity='0'; }, 2200);
  setTimeout(()=>{ titleEl.remove(); this._overlays=this._overlays.filter(e=>e!==titleEl); }, 3300);

  // ═════════════════════════════════════════════════════════════════════════
  //  PHYSICS LOOP
  // ═════════════════════════════════════════════════════════════════════════
  const self = this;

  this._physicsInterval = setInterval(() => {
    if (self._isDead || self._won) return;

    const player = gameEnv.gameObjects.find(o => o instanceof Player);
    if (!player) return;

    const pw = player.width  || 32;
    const ph = player.height || 42;
    let px = player.position.x;
    let py = player.position.y;

    // ── 1. Move moving platform first, capture its velocity ────────────────
    const mp = self._movingPlat;
    const prevMpX = mp.sx;
    mp.sx += self._movingSpd * self._movingDir;
    if (mp.sx >= self._movingMaxX) { mp.sx = self._movingMaxX; self._movingDir = -1; }
    if (mp.sx <= self._movingMinX) { mp.sx = self._movingMinX; self._movingDir =  1; }
    self._movingPlatVelX = mp.sx - prevMpX;  // actual displacement this frame
    if (mp._el) {
      mp._el.style.left  = mp.sx + 'px';
      mp._lblEl.style.left = mp.sx + 'px';
    }

    // ── 2. Horizontal input ─────────────────────────────────────────────────
    if      (keys.a) self._vx = -this._moveSpeed;
    else if (keys.d) self._vx =  this._moveSpeed;
    else             self._vx =  0;

    // ── 3. Jump ─────────────────────────────────────────────────────────────
    if ((keys.w || keys.space) && self._onGround && self._canJump) {
      self._vy     = this._jumpForce;
      self._onGround = false;
      self._canJump  = false;
    }
    if (!keys.w && !keys.space) self._canJump = true;

    // ── 4. Gravity ──────────────────────────────────────────────────────────
    self._vy = Math.min(self._vy + this._gravity, this._maxFall);

    // ── 5. Proposed position ────────────────────────────────────────────────
    let nx = px + self._vx;
    let ny = py + self._vy;

    // ── 6. Platform collision ────────────────────────────────────────────────
    const allPlats = [...self._platforms, mp];
    self._onGround     = false;
    self._onMovingPlat = false;

    for (const p of allPlats) {
      const psx = p.sx;
      const psy = p.sy;
      const psw = p.sw;
      const psh = p.sh;

      // ── Top landing (falling down onto platform surface) ──────────────────
      if (self._vy >= 0) {
        const prevFeet = py + ph;
        const newFeet  = ny + ph;
        const withinX  = nx + pw*0.15 < psx+psw && nx + pw*0.85 > psx;
        if (withinX && prevFeet <= psy+2 && newFeet >= psy) {
          ny = psy - ph;
          self._vy = 0;
          self._onGround = true;
          if (p.id === 'p3_move') self._onMovingPlat = true;
        }
      }

      // ── Ceiling hit (jumping up into platform bottom) ─────────────────────
      if (self._vy < 0) {
        const platBottom = psy + psh;
        const withinX    = nx + pw*0.1 < psx+psw && nx + pw*0.9 > psx;
        if (withinX && py+0 >= platBottom && ny < platBottom) {
          ny = platBottom;
          self._vy = 0;
        }
      }

      // ── Wall collision (horizontal) ────────────────────────────────────────
      // Only collide if player is vertically inside the platform's slab
      const vertOverlap = ny + ph*0.05 < psy+psh && ny + ph*0.95 > psy;
      if (vertOverlap) {
        if (px+pw <= psx+6  && nx+pw > psx)     { nx = psx-pw;     self._vx=0; }
        if (px    >= psx+psw-6 && nx < psx+psw) { nx = psx+psw;    self._vx=0; }
      }
    }

    // ── 7. Moving platform carries player ────────────────────────────────────
    // Add the platform's own velocity to nx so player moves with it.
    // Only applied when standing on it (not when jumping from it).
    if (self._onMovingPlat) {
      nx += self._movingPlatVelX;
    }

    // ── 8. Fall death ────────────────────────────────────────────────────────
    if (ny > height + 20) {
      self._die('Fell into the crater!');
      return;
    }

    // ── 9. Spike death ───────────────────────────────────────────────────────
    // Use the player's resolved feet position (bottom edge) and foot-width.
    // This avoids the bug where platform collision snaps the player up and
    // the center-based check no longer overlaps the spikes.
    const feetY  = ny + ph;            // bottom edge of player
    const footL  = nx + pw * 0.2;      // left foot
    const footR  = nx + pw * 0.8;      // right foot

    for (const sp of self._spikes) {
      // Spike kill zone: from killY (40% down) to the base
      const spikeBase = sp.y + sp.h;
      if (feetY >= sp.killY && feetY <= spikeBase + 4 &&
          footR  > sp.x     && footL  < sp.x + sp.w) {
        self._die('Spiked!');
        return;
      }
    }

    // ── 10. Coin collection ──────────────────────────────────────────────────
    const pcx = nx + pw/2;
    const pcy = ny + ph/2;
    for (const c of self._coinPositions) {
      if (c.collected) continue;
      if (pcx > c.x && pcx < c.x+c.w && pcy > c.y && pcy < c.y+c.h) {
        c.collected = true;
        if (c._coinObject) {
          c._coinObject.collect();
        } else if (typeof c.interact === 'function') {
          c.interact();
        }
        self._coins += c.value;
        const totalCoins = gameEnv.stats.coinsCollected || 0;
        if (gameEnv.scoreManager?.updateScoreDisplay) {
          gameEnv.scoreManager.updateScoreDisplay(totalCoins);
        }
        self._updateHud();
      }
    }

    // ── 11. Goal flag ────────────────────────────────────────────────────────
    const fx = self._flagX, fy = self._flagY;
    if (pcx > fx-14*this._scaleX && pcx < fx+30*this._scaleX && pcy > fy && pcy < fy+58*this._scaleY) {
      self._winLevel();
      return;
    }

    // ── 12. Write resolved position ──────────────────────────────────────────
    player.position.x = nx;
    player.position.y = ny;

    if      (self._vx < 0) player.setAnimation && player.setAnimation('left');
    else if (self._vx > 0) player.setAnimation && player.setAnimation('right');

  }, 16);
};

// ── HUD ──────────────────────────────────────────────────────────────────────
this._updateHud = () => {
  if (!this._hud) return;
  const hearts = '❤️'.repeat(this._lives) + '🖤'.repeat(Math.max(0,3-this._lives));
  const totalCoinsCollected = parseInt(localStorage.getItem('coinsCollected') || '0');
  this._hud.innerHTML = `
    <div>${hearts}</div>
    <div style="color:#FFD700">🪙 ${this._coins} / ${this._coinPositions.length}</div>
    <div style="color:#ffe88a;font-size:0.7em">TOTAL ${totalCoinsCollected}</div>
    <div style="color:#aaffcc;font-size:0.7em;margin-top:2px">CRATER FALLS</div>`;
};

// ── Die ───────────────────────────────────────────────────────────────────────
this._die = (reason) => {
  if (this._isDead || this._won) return;
  this._lives--;
  this._updateHud();

  if (this._lives <= 0) {
    this._isDead = true;
    const screen = document.createElement('div');
    Object.assign(screen.style, {
      position:'fixed', inset:'0', background:'rgba(0,0,0,0.92)',
      zIndex:'300000', display:'flex', flexDirection:'column',
      alignItems:'center', justifyContent:'center',
      fontFamily:"'Press Start 2P',monospace", color:'#fff', textAlign:'center',
    });
    screen.innerHTML = `
      <div style="font-size:44px;margin-bottom:16px">💀</div>
      <div style="font-size:18px;color:#ff4444;letter-spacing:4px;margin-bottom:12px">GAME OVER</div>
      <div style="font-size:9px;color:#cc6655;line-height:2.2;margin-bottom:24px">${reason}<br>No lives remaining.</div>
      <div style="font-size:8px;color:#444">Restarting...</div>`;
    document.body.appendChild(screen);
    this._deathScreen = screen;
    setTimeout(()=>location.reload(), 2500);
    return;
  }

  // Flash red, respawn
  const flash = document.createElement('div');
  Object.assign(flash.style, {
    position:'fixed', inset:'0',
    background:'rgba(255,50,50,0.45)', zIndex:'300000',
    pointerEvents:'none', transition:'opacity 0.4s',
  });
  document.body.appendChild(flash);
  setTimeout(()=>{ flash.style.opacity='0'; }, 50);
  setTimeout(()=>{ flash.remove(); }, 500);

  const player = gameEnv.gameObjects.find(o => o instanceof Player);
  if (player) {
    player.position.x = this._playerStart?.x ?? player.position.x;
    player.position.y = this._playerStart?.y ?? player.position.y;
  }
  this._vy = 0; this._vx = 0; this._onGround = false;
};

// ── Win ───────────────────────────────────────────────────────────────────────
this._winLevel = () => {
  if (this._won) return;
  this._won = true;

  const screen = document.createElement('div');
  Object.assign(screen.style, {
    position:'fixed', inset:'0', background:'#000', zIndex:'300000',
    display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
    fontFamily:"'Press Start 2P',monospace", color:'#fff', textAlign:'center',
    opacity:'0', transition:'opacity 1s',
  });
  const total = this._coinPositions.length;
  const pct   = Math.round((this._coins/total)*100);
  const grade = pct===100 ? '★ PERFECT ★' : pct>=70 ? 'GREAT!' : pct>=40 ? 'GOOD' : 'CLEAR';
  const totalCoinsCollected = parseInt(localStorage.getItem('coinsCollected') || '0');
  const username = (gameEnv?.game?.uid && String(gameEnv.game.uid)) || 'Player';
  if (this._leaderboard?.submitScore) {
    this._leaderboard
      .submitScore(username, totalCoinsCollected, 'astronaut-platformer-game')
      .catch((error) => console.warn('Leaderboard score submit failed:', error));
  }
  screen.innerHTML = `
    <div style="font-size:50px;margin-bottom:18px">🚀</div>
    <div style="font-size:16px;color:#00ff88;letter-spacing:4px;margin-bottom:14px">LEVEL CLEAR!</div>
    <div style="font-size:11px;color:#c8a84b;letter-spacing:2px;margin-bottom:20px">${grade}</div>
    <div style="font-size:9px;color:#88ccaa;line-height:2.6;margin-bottom:8px">
      Coins: ${this._coins} / ${total}<br>
      Total Coins: ${totalCoinsCollected}<br>
      Lives: ${'❤️'.repeat(this._lives)}
    </div>
    <div style="font-size:8px;color:#334433;margin-top:16px">Proceeding...</div>`;
  document.body.appendChild(screen);
  requestAnimationFrame(()=>requestAnimationFrame(()=>{ screen.style.opacity='1'; }));
  setTimeout(()=>{
    if      (typeof gameEnv.nextLevel==='function')       gameEnv.nextLevel();
    else if (typeof gameEnv.loadNextLevel==='function')   gameEnv.loadNextLevel();
    else if (gameEnv.gameControl?.next)                   gameEnv.gameControl.next();
    else location.reload();
  }, 3200);
};

// ── destroy() ─────────────────────────────────────────────────────────────────
this.destroy = () => {
  if (this._physicsInterval) { clearInterval(this._physicsInterval); this._physicsInterval=null; }
  document.removeEventListener('keydown', this._keyDown);
  document.removeEventListener('keyup',   this._keyUp);
  for (const el of this._overlays) { try { el.remove(); } catch(_){} }
  this._overlays = [];
  if (this._styleEl)     { this._styleEl.remove();     this._styleEl=null;     }
  if (this._hud)         { this._hud.remove();         this._hud=null;         }
  if (this._deathScreen) { this._deathScreen.remove(); this._deathScreen=null; }
};

} // end constructor
} // end class

export const gameLevelClasses = [AstroPlatformer];
export default AstroPlatformer;
