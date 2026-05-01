import GameEnvBackground from '@assets/js/GameEnginev1.1/essentials/GameEnvBackground.js';

class GameLevelVoidStriker {
  constructor(gameEnv) {
    let width  = gameEnv.innerWidth;
    let height = gameEnv.innerHeight;
    let path   = gameEnv.path;

    const image_data_space = {
      id:     'VoidStriker-Background',
      src:    '',
      pixels: { height: 570, width: 1025 }
    };

    // Pass the full gameEnv so init() can find the engine's container
    setTimeout(() => VoidStrikerGame.init(gameEnv), 200);

    this.classes = [
      { class: GameEnvBackground, data: image_data_space },
    ];
  }
}

const VoidStrikerGame = (() => {

  let canvas, ctx, bgCanvas, bgCtx;
  let container;
  let W, H;
  let gameState = 'title';
  let wave = 1, lives = 3;
  let bestKills = 0;
  let frameId;

  const BG_SCENES  = ['nebula', 'deepspace', 'supernova'];
  let   bgSceneIdx = 0;

  let layerNebula, layerFarStars, layerMidStars, layerNearStars, layerDust;
  let shootingStars = [];

  let ship, bullets = [], enemies = [], asteroids = [], particles = [];
  let enemyBullets = [];
  let boss = null;
  // While the Boss Alien is alive, all other moving objects (enemies, asteroids,
  // enemy bullets) tick at this fraction of their normal speed. Restored to 1
  // the instant the boss dies.
  let worldSpeed = 1;
  // Boss respawn loop: first boss on wave 3, then every 2 waves after each kill.
  let bossesDefeated = 0;
  let nextBossWave = 3;

  // Rotating boss color palettes — each entry is one full re-skin cycled
  // through as bosses are defeated and respawned.
  const BOSS_PALETTES = [
    { glow: '255,40,80',    bodyHi: '#ff7799', bodyLo: '#660022', tentacle: '#aa1144', eye: '#ffee44' }, // crimson
    { glow: '120,255,140',  bodyHi: '#aaffaa', bodyLo: '#003322', tentacle: '#22aa44', eye: '#ddff66' }, // toxic green
    { glow: '120,160,255',  bodyHi: '#99bbff', bodyLo: '#00224a', tentacle: '#3355cc', eye: '#88eeff' }, // void blue
    { glow: '255,180,40',   bodyHi: '#ffd577', bodyLo: '#553300', tentacle: '#cc7722', eye: '#fff0aa' }, // solar
    { glow: '220,80,255',   bodyHi: '#dd99ff', bodyLo: '#330044', tentacle: '#9933cc', eye: '#ffccff' }, // amethyst
  ];

  // Hue base for the small enemies — rotates with wave so each wave's mob
  // color shifts. Combined with a randomized per-enemy spread for variety.
  const ENEMY_HUE_BANDS = [0, 200, 120, 280, 40, 160, 320];

  const keys = {};

  const rand  = (min, max) => Math.random() * (max - min) + min;
  const randI = (min, max) => Math.floor(rand(min, max));

  let totalKills = 0;

  // ── console / cheat overlay state ────────────────────────────────────────
  let consoleActive = false;
  const CHEAT_CODE  = 'teambob';

  function openConsole() {
    if (document.getElementById('vs-cheat')) return;
    consoleActive = true;

    const overlay = document.createElement('div');
    overlay.id = 'vs-cheat';
    Object.assign(overlay.style, {
      position:      'absolute',
      top:           '50%',
      left:          '50%',
      transform:     'translate(-50%, -50%)',
      background:    'rgba(0,0,0,0.88)',
      border:        '1px solid rgba(0,200,255,0.3)',
      borderRadius:  '8px',
      padding:       '22px 32px',
      fontFamily:    '"Courier New", monospace',
      color:         'rgba(0,200,255,0.7)',
      fontSize:      '13px',
      zIndex:        '20000',
      pointerEvents: 'auto',
      textAlign:     'center',
      letterSpacing: '2px',
      minWidth:      '220px',
    });

    // Unpause button at the top
    const unpauseBtn = document.createElement('button');
    unpauseBtn.textContent = '▶  RESUME';
    Object.assign(unpauseBtn.style, {
      display:       'block',
      width:         '100%',
      marginBottom:  '18px',
      background:    'transparent',
      border:        '1px solid rgba(0,200,255,0.4)',
      borderRadius:  '4px',
      color:         'rgba(0,200,255,0.8)',
      fontFamily:    '"Courier New", monospace',
      fontSize:      '13px',
      letterSpacing: '3px',
      padding:       '7px 0',
      cursor:        'pointer',
    });
    unpauseBtn.addEventListener('click', closeConsole);
    overlay.appendChild(unpauseBtn);

    // Divider label
    const label = document.createElement('div');
    label.textContent = 'ACCESS CODE';
    label.style.marginBottom = '10px';
    overlay.appendChild(label);

    // Code input
    const input = document.createElement('input');
    input.id   = 'vs-cheat-input';
    input.type = 'password';
    input.placeholder = '··········';
    Object.assign(input.style, {
      display:       'block',
      margin:        '0 auto',
      background:    'transparent',
      border:        'none',
      borderBottom:  '1px solid rgba(0,200,255,0.35)',
      color:         'rgba(0,200,255,0.8)',
      fontFamily:    '"Courier New", monospace',
      fontSize:      '14px',
      textAlign:     'center',
      outline:       'none',
      width:         '140px',
      letterSpacing: '3px',
    });
    overlay.appendChild(input);
    container.appendChild(overlay);

    setTimeout(() => input.focus(), 30);

    input.addEventListener('keydown', e => {
      e.stopPropagation();
      if (e.key === 'Escape' || e.key === 'p' || e.key === 'P') {
        closeConsole();
      } else if (e.key === 'Enter') {
        const val = input.value.trim().toLowerCase();
        closeConsole();
        if (val === CHEAT_CODE) applyCheat();
      }
    });
  }

  function closeConsole() {
    const el = document.getElementById('vs-cheat');
    if (el) el.remove();
    consoleActive = false;
  }

  function applyCheat() {
    totalKills = Math.max(totalKills, 30);
    updateHUD();
    window.dispatchEvent(new CustomEvent('vs-kills', { detail: { total: totalKills } }));
  }
  // ── end console ───────────────────────────────────────────────────────────

  function init(gameEnv) {
    let engineCanvas = (gameEnv && gameEnv.canvas)
      || document.querySelector('canvas[id]')
      || document.querySelector('.game-container canvas')
      || document.querySelector('canvas');

    container = engineCanvas
      ? (engineCanvas.parentElement || document.body)
      : (document.querySelector('.game-container') || document.body);

    const rect = container.getBoundingClientRect();
    W = rect.width  || (gameEnv && gameEnv.innerWidth)  || 800;
    H = rect.height || (gameEnv && gameEnv.innerHeight) || 500;

    const cs = window.getComputedStyle(container);
    if (cs.position === 'static') container.style.position = 'relative';
    container.style.overflow = 'hidden';

    canvas = document.createElement('canvas');
    canvas.id     = 'voidstriker-canvas';
    canvas.width  = W;
    canvas.height = H;
    Object.assign(canvas.style, {
      position: 'absolute',
      top:      '0',
      left:     '0',
      width:    '100%',
      height:   '100%',
      zIndex:   '9999',
      cursor:   'none',
    });
    container.appendChild(canvas);
    ctx = canvas.getContext('2d');

    bgCanvas = document.createElement('canvas');
    bgCanvas.width  = W;
    bgCanvas.height = H;
    bgCtx = bgCanvas.getContext('2d');

    buildBackgroundScene();
    buildLayers();
    buildShip();
    buildUI();
    attachInput();
    spawnWave();

    frameId = requestAnimationFrame(loop);
  }

  function buildBackgroundScene() {
    const scene = BG_SCENES[bgSceneIdx];
    bgCtx.clearRect(0, 0, W, H);

    if (scene === 'nebula') {
      bgCtx.fillStyle = '#000000';
      bgCtx.fillRect(0, 0, W, H);
      const clouds = [
        { x: W*0.15, y: H*0.3,  r: W*0.35, c: 'rgba(80,0,160,0.18)' },
        { x: W*0.75, y: H*0.6,  r: W*0.4,  c: 'rgba(0,40,120,0.15)' },
        { x: W*0.5,  y: H*0.15, r: W*0.25, c: 'rgba(120,0,80,0.12)' },
        { x: W*0.3,  y: H*0.8,  r: W*0.3,  c: 'rgba(0,80,160,0.1)'  },
      ];
      clouds.forEach(({ x, y, r, c }) => {
        const g = bgCtx.createRadialGradient(x, y, 0, x, y, r);
        g.addColorStop(0, c);
        g.addColorStop(1, 'transparent');
        bgCtx.fillStyle = g;
        bgCtx.fillRect(0, 0, W, H);
      });

    } else if (scene === 'deepspace') {
      bgCtx.fillStyle = '#000000';
      bgCtx.fillRect(0, 0, W, H);
      const g = bgCtx.createRadialGradient(W*0.5, H*0.5, 0, W*0.5, H*0.5, W*0.7);
      g.addColorStop(0,   'rgba(0,15,40,0.45)');
      g.addColorStop(1,   'transparent');
      bgCtx.fillStyle = g;
      bgCtx.fillRect(0, 0, W, H);

    } else if (scene === 'supernova') {
      bgCtx.fillStyle = '#000000';
      bgCtx.fillRect(0, 0, W, H);
      const g = bgCtx.createRadialGradient(W*0.5, H*0.4, 0, W*0.5, H*0.4, W*0.55);
      g.addColorStop(0,    'rgba(255,160,20,0.25)');
      g.addColorStop(0.35, 'rgba(200,40,0,0.18)');
      g.addColorStop(0.7,  'rgba(80,0,40,0.1)');
      g.addColorStop(1,    'transparent');
      bgCtx.fillStyle = g;
      bgCtx.fillRect(0, 0, W, H);
    }
  }

  function cycleBackground() {
    bgSceneIdx = (bgSceneIdx + 1) % BG_SCENES.length;
    buildBackgroundScene();
    layerDust.forEach(d => {
      if (bgSceneIdx === 2) { d.baseColor = `rgba(255,${randI(80,160)},20,`; }
      else                  { d.baseColor = `rgba(80,200,255,`;             }
    });
    updateBgLabel();
  }

  function updateBgLabel() {
    const el = document.getElementById('vs-bg-label');
    if (el) el.textContent = ['🌌 Nebula','🌑 Deep Space','💥 Supernova'][bgSceneIdx];
  }

  function buildLayers() {
    layerNebula = { offsetY: 0, speed: 0.04 };

    layerFarStars = Array.from({ length: 200 }, () => ({
      x:     rand(0, W),
      y:     rand(0, H),
      r:     rand(0.3, 0.9),
      alpha: rand(0.2, 0.5),
      speed: rand(0.08, 0.18),
    }));

    layerMidStars = Array.from({ length: 80 }, () => ({
      x:           rand(0, W),
      y:           rand(0, H),
      r:           rand(0.8, 1.5),
      alpha:       rand(0.5, 0.9),
      speed:       rand(0.25, 0.5),
      twinkleRate: rand(0.02, 0.06),
      twinkleT:    rand(0, Math.PI * 2),
    }));

    layerNearStars = Array.from({ length: 30 }, () => ({
      x:     rand(0, W),
      y:     rand(0, H),
      r:     rand(1.5, 3),
      alpha: rand(0.7, 1),
      speed: rand(0.8, 1.6),
      color: Math.random() > 0.5 ? '#aaddff' : '#ffffff',
      trail: rand(4, 12),
    }));

    layerDust = Array.from({ length: 55 }, () => ({
      x:         rand(0, W),
      y:         rand(0, H),
      r:         rand(1.2, 3.5),
      alpha:     rand(0.15, 0.45),
      speed:     rand(1.5, 3.2),
      baseColor: 'rgba(80,200,255,',
    }));

    shootingStars = [];
  }

  function maybeSpawnShootingStar() {
    if (Math.random() < 0.003 && shootingStars.length < 6) {
      shootingStars.push({
        x:     rand(0, W),
        y:     rand(-20, H * 0.4),
        vx:    rand(-3, 3),
        vy:    rand(6, 14),
        len:   rand(60, 140),
        alpha: 1,
        color: Math.random() > 0.5 ? '#fff' : '#88ccff',
      });
    }
  }

  function updateLayers() {
    layerNebula.offsetY = (layerNebula.offsetY + layerNebula.speed) % H;
    layerFarStars.forEach(s => { s.y = (s.y + s.speed) % H; });
    layerMidStars.forEach(s => {
      s.y        = (s.y + s.speed) % H;
      s.twinkleT += s.twinkleRate;
    });
    layerNearStars.forEach(s => { s.y = (s.y + s.speed) % H; });
    layerDust.forEach(d => { d.y = (d.y + d.speed) % H; });

    maybeSpawnShootingStar();
    shootingStars = shootingStars.filter(s => s.alpha > 0.02);
    shootingStars.forEach(s => {
      s.x     += s.vx;
      s.y     += s.vy;
      s.alpha -= 0.018;
    });
  }

  function drawLayers() {
    ctx.globalAlpha = 0.92;
    ctx.drawImage(bgCanvas, 0, layerNebula.offsetY - H);
    ctx.drawImage(bgCanvas, 0, layerNebula.offsetY);

    ctx.globalAlpha = 1;
    layerFarStars.forEach(s => {
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(200,210,255,${s.alpha})`;
      ctx.fill();
    });

    layerMidStars.forEach(s => {
      const a = s.alpha * (0.6 + 0.4 * Math.sin(s.twinkleT));
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(230,235,255,${a})`;
      ctx.fill();
    });

    layerNearStars.forEach(s => {
      const grad = ctx.createLinearGradient(s.x, s.y - s.trail, s.x, s.y);
      grad.addColorStop(0, 'transparent');
      grad.addColorStop(1, s.color);
      ctx.strokeStyle = grad;
      ctx.lineWidth   = s.r * 0.7;
      ctx.globalAlpha = s.alpha * 0.6;
      ctx.beginPath();
      ctx.moveTo(s.x, s.y - s.trail);
      ctx.lineTo(s.x, s.y);
      ctx.stroke();
      ctx.globalAlpha = s.alpha;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = s.color;
      ctx.fill();
    });

    ctx.globalAlpha = 1;
    layerDust.forEach(d => {
      const glow = ctx.createRadialGradient(d.x, d.y, 0, d.x, d.y, d.r * 3);
      glow.addColorStop(0, d.baseColor + d.alpha + ')');
      glow.addColorStop(1, 'transparent');
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(d.x, d.y, d.r * 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = `rgba(200,240,255,${d.alpha * 1.5})`;
      ctx.beginPath();
      ctx.arc(d.x, d.y, d.r * 0.6, 0, Math.PI * 2);
      ctx.fill();
    });

    shootingStars.forEach(s => {
      ctx.save();
      const g = ctx.createLinearGradient(s.x, s.y - s.len, s.x + s.vx * 4, s.y);
      g.addColorStop(0, 'transparent');
      g.addColorStop(1, s.color);
      ctx.strokeStyle = g;
      ctx.lineWidth   = 1.5;
      ctx.globalAlpha = s.alpha;
      ctx.beginPath();
      ctx.moveTo(s.x - s.vx * 4, s.y - s.len);
      ctx.lineTo(s.x, s.y);
      ctx.stroke();
      ctx.restore();
    });
  }

  function buildShip() {
    ship = {
      x: W / 2, y: H * 0.78,
      w: 28, h: 38,
      speed: 4.5,
      shootCooldown: 0,
      invincible: 0,
      thrustFlicker: 0,
    };
  }

  function updateShip() {
    // WASD = movement only
    if (keys['a'] || keys['A']) ship.x -= ship.speed;
    if (keys['d'] || keys['D']) ship.x += ship.speed;
    if (keys['w'] || keys['W']) ship.y -= ship.speed;
    if (keys['s'] || keys['S']) ship.y += ship.speed;

    ship.x = Math.max(ship.w, Math.min(W - ship.w, ship.x));
    ship.y = Math.max(ship.h, Math.min(H - ship.h, ship.y));

    if (ship.shootCooldown > 0) ship.shootCooldown--;
    if (ship.invincible    > 0) ship.invincible--;
    ship.thrustFlicker = (ship.thrustFlicker + 1) % 6;

    // Arrow keys = directional shooting. Combine pressed arrows into a single
    // direction vector so diagonals work too (e.g. Up+Right shoots up-right).
    // This matters most once the Boss Alien gets behind the ship.
    if (ship.shootCooldown === 0) {
      let sx = 0, sy = 0;
      if (keys['ArrowLeft'])  sx -= 1;
      if (keys['ArrowRight']) sx += 1;
      if (keys['ArrowUp'])    sy -= 1;
      if (keys['ArrowDown'])  sy += 1;
      if (sx !== 0 || sy !== 0) {
        fireDirected(sx, sy);
        ship.shootCooldown = 12;
      }
    }
  }

  function drawShip() {
    if (ship.invincible > 0 && Math.floor(ship.invincible / 4) % 2 === 0) return;
    const { x, y, w, h, thrustFlicker } = ship;
    ctx.save();
    ctx.translate(x, y);

    if (thrustFlicker < 4) {
      const fl = h * 0.35 + rand(-4, 4);
      const tg = ctx.createLinearGradient(0, h * 0.4, 0, h * 0.4 + fl);
      tg.addColorStop(0, 'rgba(0,200,255,0.9)');
      tg.addColorStop(1, 'transparent');
      ctx.fillStyle = tg;
      ctx.beginPath();
      ctx.moveTo(-w * 0.25, h * 0.35);
      ctx.lineTo(0, h * 0.4 + fl);
      ctx.lineTo(w * 0.25, h * 0.35);
      ctx.fill();
    }

    ctx.fillStyle = '#a0d8ff';
    ctx.beginPath();
    ctx.moveTo(0, -h / 2);
    ctx.lineTo(w / 2, h / 2);
    ctx.lineTo(0, h * 0.3);
    ctx.lineTo(-w / 2, h / 2);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#00eeff';
    ctx.beginPath();
    ctx.ellipse(0, -h * 0.1, w * 0.18, h * 0.22, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = 'rgba(0,200,255,0.5)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(-w * 0.5, h * 0.3);
    ctx.lineTo(-w * 0.15, 0);
    ctx.moveTo(w * 0.5, h * 0.3);
    ctx.lineTo(w * 0.15, 0);
    ctx.stroke();

    ctx.restore();
  }

  function fireDirected(sx, sy) {
    const len = Math.hypot(sx, sy) || 1;
    const nx = sx / len, ny = sy / len;
    const angle = Math.atan2(ny, nx);
    // Three-way spread: center bullet at full speed, two side bullets fanned
    // out by ~9° on each side at slightly slower speed (matches the old
    // upward triple-shot feel, just rotated to fire whichever direction the
    // player pressed).
    const spread = 0.15;
    // While the Boss Alien is alive the player's spread is nerfed to 2
    // bullets (no center shot) — the boss is supposed to be hard.
    const shots = boss
      ? [
          { a: angle - spread, speed: 10 },
          { a: angle + spread, speed: 10 },
        ]
      : [
          { a: angle - spread, speed: 10 },
          { a: angle,          speed: 11 },
          { a: angle + spread, speed: 10 },
        ];
    shots.forEach(s => {
      bullets.push({
        x: ship.x + nx * 18,
        y: ship.y + ny * 18,
        vx: Math.cos(s.a) * s.speed,
        vy: Math.sin(s.a) * s.speed,
        life: 60,
      });
    });
  }

  function updateBullets() {
    bullets = bullets.filter(b => b.life-- > 0);
    bullets.forEach(b => { b.x += b.vx; b.y += b.vy; });
  }

  function drawBullets() {
    bullets.forEach(b => {
      const g = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, 5);
      g.addColorStop(0, '#fff');
      g.addColorStop(0.4, '#00eeff');
      g.addColorStop(1, 'transparent');
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(b.x, b.y, 5, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  // ── Boss Alien (peer lesson: chasing-enemy update() loop) ───────────────
  // Adapted from the "ocean" lesson on Math.atan2-based pursuit. Each frame,
  // compute the angle from the boss to the ship and step toward the ship along
  // (cos, sin). The boss eats 30 hits and counts as 5 kills on death.
  function spawnBoss() {
    // Tier = how many bosses have been defeated already. Each return is
    // tougher: more HP, slightly faster, and wears a new color palette.
    const tier = bossesDefeated;
    const hp = 55 + tier * 30;
    boss = {
      x: W / 2,
      y: -80,
      r: 40 + tier * 2,
      hp,
      maxHp: hp,
      speed: 2.7 + tier * 0.45,
      pulse: 0,
      tier,
      palette: BOSS_PALETTES[tier % BOSS_PALETTES.length],
    };
    worldSpeed = 0.4; // slow everything else while boss is loose
    const bar = document.getElementById('vs-boss-bar');
    if (bar) bar.style.display = 'block';
    // Tint the bar to match the current boss
    const fill = document.getElementById('vs-boss-fill');
    if (fill) {
      const p = boss.palette;
      fill.style.background = `linear-gradient(90deg, rgba(${p.glow},1), ${p.bodyHi})`;
    }
  }

  function updateBoss() {
    if (!boss) return;
    boss.pulse += 0.08;
    // Distance + angle to player (peer lesson: distance/atan2)
    const dx = ship.x - boss.x;
    const dy = ship.y - boss.y;
    const angle = Math.atan2(dy, dx); // dy first, then dx — easy to flip!
    boss.x += Math.cos(angle) * boss.speed;
    boss.y += Math.sin(angle) * boss.speed;
    // Reflect health bar
    const fill = document.getElementById('vs-boss-fill');
    if (fill) fill.style.width = (Math.max(0, boss.hp) / boss.maxHp * 100) + '%';
  }

  function drawBoss() {
    if (!boss) return;
    const p = boss.palette;
    const r = boss.r + Math.sin(boss.pulse) * 2.5;
    ctx.save();
    ctx.translate(boss.x, boss.y);
    // Outer glow
    const glow = ctx.createRadialGradient(0, 0, 0, 0, 0, r * 1.8);
    glow.addColorStop(0, `rgba(${p.glow},0.55)`);
    glow.addColorStop(1, 'transparent');
    ctx.fillStyle = glow;
    ctx.beginPath(); ctx.arc(0, 0, r * 1.8, 0, Math.PI * 2); ctx.fill();
    // Body
    const body = ctx.createRadialGradient(0, -r * 0.3, 2, 0, 0, r);
    body.addColorStop(0, p.bodyHi);
    body.addColorStop(1, p.bodyLo);
    ctx.fillStyle = body;
    ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI * 2); ctx.fill();
    // Tentacles
    ctx.strokeStyle = p.tentacle;
    ctx.lineWidth = 4;
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * Math.PI * 2 + Math.sin(boss.pulse + i) * 0.2;
      ctx.beginPath();
      ctx.moveTo(Math.cos(a) * r * 0.7, Math.sin(a) * r * 0.7);
      ctx.lineTo(Math.cos(a) * r * 1.5, Math.sin(a) * r * 1.5);
      ctx.stroke();
    }
    // Eye
    ctx.fillStyle = p.eye;
    ctx.beginPath(); ctx.arc(0, 0, r * 0.42, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#220000';
    ctx.beginPath(); ctx.arc(0, 0, r * 0.2, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
  }

  function killBoss() {
    if (!boss) return;
    spawnExplosion(boss.x, boss.y, `rgb(${boss.palette.glow})`);
    spawnExplosion(boss.x, boss.y, boss.palette.eye);
    // Boss is worth 5 kills toward the unlock counter
    totalKills += 5;
    window.dispatchEvent(new CustomEvent('vs-kills', { detail: { total: totalKills } }));
    bossesDefeated++;
    nextBossWave = wave + 2; // back in 2 waves, stronger
    boss = null;
    worldSpeed = 1; // resume full speed for everything else
    const bar = document.getElementById('vs-boss-bar');
    if (bar) bar.style.display = 'none';
  }

  function spawnWave() {
    if (wave === nextBossWave && !boss) spawnBoss();
    const count = 5 + wave * 3;
    // Each wave gets its own hue band so the mob color rotates as you progress.
    const hueBase = ENEMY_HUE_BANDS[wave % ENEMY_HUE_BANDS.length];
    for (let i = 0; i < count; i++) {
      enemies.push({
        x:         rand(40, W - 40),
        y:         rand(-200, -30) - i * 35,
        r:         18,
        speed:     rand(1.0, 1.8 + wave * 0.25),
        vx:        rand(-0.8, 0.8),
        hp:        1 + Math.floor(wave / 2),
        color:     `hsl(${(hueBase + randI(-15, 15) + 360) % 360},85%,55%)`,
        shootTimer: wave >= 5 ? randI(40, 120) : Infinity,
      });
    }

    const aCount = 1 + wave;
    for (let i = 0; i < aCount; i++) {
      asteroids.push({
        x:     rand(40, W - 40),
        y:     -40 - i * 60,
        r:     rand(18, 34 + Math.min(wave * 1.5, 20)),
        // Gravity-driven fall (lesson: Gravity System).
        // verticalVelocity is positive = up; gravityAcceleration is subtracted each frame.
        // Seed slight upward velocity so asteroids accelerate from drift to fall.
        verticalVelocity:    rand(0.2, 0.8),
        gravityAcceleration: 0.05 + wave * 0.005,
        terminalVelocity:    3.5 + wave * 0.15,
        vx:    rand(-0.6, 0.6),
        rot:   0,
        rotV:  rand(-0.03, 0.03),
        points: Array.from({ length: 9 }, (_, i) => ({
          a: (i / 9) * Math.PI * 2,
          r: rand(0.6, 1.0),
        })),
      });
    }
  }

  function updateEnemies() {
    // worldSpeed scales every non-player movement: 1 normally, 0.4 while the
    // Boss Alien is alive. The instant the boss dies it snaps back to 1.
    enemies.forEach(e => {
      e.y  += e.speed * worldSpeed;
      e.x  += e.vx    * worldSpeed;
      if (e.x < 20 || e.x > W - 20) e.vx *= -1;

      if (e.shootTimer !== Infinity) {
        e.shootTimer -= worldSpeed;
        if (e.shootTimer <= 0) {
          enemyBullets.push({ x: e.x, y: e.y + e.r, vx: 0, vy: 4 + wave * 0.3, life: 80 });
          e.shootTimer = randI(60, 140);
        }
      }
    });
    enemies = enemies.filter(e => e.y < H + 60);

    asteroids.forEach(a => {
      // Per-frame gravity loop (lesson: Gravity System):
      // 1. Subtract gravity from vertical velocity (pulls asteroid down)
      a.verticalVelocity -= a.gravityAcceleration;
      // 2. Clamp at terminal velocity so asteroids don't fall infinitely fast
      if (-a.verticalVelocity > a.terminalVelocity) {
        a.verticalVelocity = -a.terminalVelocity;
      }
      // 3. Convert to engine velocity (flip sign): negative verticalVelocity = downward y motion
      a.y   += -a.verticalVelocity * worldSpeed;
      a.x   += a.vx                * worldSpeed;
      a.rot += a.rotV               * worldSpeed;
      if (a.x < 20 || a.x > W - 20) a.vx *= -1;
    });
    asteroids = asteroids.filter(a => a.y < H + 80);

    enemyBullets = enemyBullets.filter(b => b.life-- > 0 && b.y < H + 20);
    enemyBullets.forEach(b => { b.x += b.vx * worldSpeed; b.y += b.vy * worldSpeed; });
  }

  function drawEnemies() {
    enemies.forEach(e => {
      ctx.save();
      ctx.translate(e.x, e.y);
      const g = ctx.createRadialGradient(0, -4, 2, 0, 0, e.r);
      g.addColorStop(0, '#ff8888');
      g.addColorStop(1, e.color);
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.ellipse(0, 0, e.r, e.r * 0.45, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#ff2020';
      ctx.beginPath();
      ctx.ellipse(0, -e.r * 0.25, e.r * 0.45, e.r * 0.3, 0, 0, Math.PI * 2);
      ctx.fill();
      const eg = ctx.createRadialGradient(0, e.r * 0.2, 0, 0, e.r * 0.2, e.r * 0.6);
      eg.addColorStop(0, 'rgba(255,60,0,0.5)');
      eg.addColorStop(1, 'transparent');
      ctx.fillStyle = eg;
      ctx.beginPath();
      ctx.arc(0, e.r * 0.2, e.r * 0.6, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });

    asteroids.forEach(a => {
      ctx.save();
      ctx.translate(a.x, a.y);
      ctx.rotate(a.rot);
      ctx.beginPath();
      a.points.forEach((p, i) => {
        const px = Math.cos(p.a) * a.r * p.r;
        const py = Math.sin(p.a) * a.r * p.r;
        i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
      });
      ctx.closePath();
      ctx.fillStyle = '#4a3f35';
      ctx.fill();
      ctx.strokeStyle = '#7a6a5a';
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.restore();
    });

    enemyBullets.forEach(b => {
      const g = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, 4);
      g.addColorStop(0, '#fff');
      g.addColorStop(0.4, '#ff6666');
      g.addColorStop(1, 'transparent');
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(b.x, b.y, 4, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  function spawnExplosion(x, y, color) {
    for (let i = 0; i < 18; i++) {
      const angle = rand(0, Math.PI * 2);
      const speed = rand(1, 5);
      particles.push({
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        r:  rand(1.5, 4),
        alpha: 1,
        color,
      });
    }
  }

  function updateParticles() {
    particles = particles.filter(p => p.alpha > 0.02);
    particles.forEach(p => {
      p.x     += p.vx;
      p.y     += p.vy;
      p.vx    *= 0.94;
      p.vy    *= 0.94;
      p.alpha -= 0.03;
      p.r     *= 0.97;
    });
  }

  function drawParticles() {
    particles.forEach(p => {
      ctx.globalAlpha = p.alpha;
      ctx.fillStyle   = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.globalAlpha = 1;
  }

  function checkCollisions() {
    // ── bullet vs enemies / asteroids / boss ─────────────────────────────
    // Iterate backwards so splicing doesn't skip elements
    for (let bi = bullets.length - 1; bi >= 0; bi--) {
      const b = bullets[bi];
      if (b.life <= 0) continue;

      let bulletConsumed = false;

      // Check the boss first — it's the priority target
      if (boss) {
        const dx = b.x - boss.x, dy = b.y - boss.y;
        if (Math.sqrt(dx * dx + dy * dy) < boss.r + 4) {
          boss.hp--;
          b.life = 0;
          bulletConsumed = true;
          if (boss.hp <= 0) killBoss();
        }
      }

      if (bulletConsumed) continue;

      for (let ei = enemies.length - 1; ei >= 0; ei--) {
        const e = enemies[ei];
        const dx = b.x - e.x, dy = b.y - e.y;
        if (Math.sqrt(dx * dx + dy * dy) < e.r + 4) {
          e.hp--;
          b.life = 0;
          bulletConsumed = true;
          if (e.hp <= 0) {
            spawnExplosion(e.x, e.y, e.color);
            totalKills++;
            enemies.splice(ei, 1);
            window.dispatchEvent(new CustomEvent('vs-kills', { detail: { total: totalKills } }));
          }
          break; // one bullet hits one enemy
        }
      }

      if (bulletConsumed) continue;

      for (let ai = asteroids.length - 1; ai >= 0; ai--) {
        const a = asteroids[ai];
        const dx = b.x - a.x, dy = b.y - a.y;
        if (Math.sqrt(dx * dx + dy * dy) < a.r + 4) {
          b.life = 0;
          spawnExplosion(a.x, a.y, '#aa8866');
          totalKills++;
          asteroids.splice(ai, 1);
          window.dispatchEvent(new CustomEvent('vs-kills', { detail: { total: totalKills } }));
          break;
        }
      }
    }

    // ── enemy bullets vs ship ─────────────────────────────────────────────
    // Only check if the ship is not already invincible
    if (ship.invincible <= 0) {
      for (let bi = enemyBullets.length - 1; bi >= 0; bi--) {
        const b = enemyBullets[bi];
        const dx = ship.x - b.x, dy = ship.y - b.y;
        if (Math.sqrt(dx * dx + dy * dy) < 20) {
          enemyBullets.splice(bi, 1);
          lives--;
          ship.invincible = 90;
          spawnExplosion(ship.x, ship.y, '#00eeff');
          if (lives <= 0) gameState = 'dead';
          break; // one hit per frame is enough
        }
      }
    }

    // ── contact collision (enemies / asteroids / boss touching ship) ─────
    // Guard with the same invincible check — including any invincibility
    // just granted above in this same frame
    if (ship.invincible <= 0) {
      const contacts = boss ? [...enemies, ...asteroids, boss] : [...enemies, ...asteroids];
      for (const e of contacts) {
        const dx = ship.x - e.x, dy = ship.y - e.y;
        if (Math.sqrt(dx * dx + dy * dy) < (e.r || 24) + 20) {
          lives--;
          ship.invincible = 90;
          spawnExplosion(ship.x, ship.y, '#00eeff');
          if (lives <= 0) gameState = 'dead';
          break; // one contact hit per frame
        }
      }
    }

    // Wave only advances when everything (including the boss) is cleared
    if (enemies.length === 0 && asteroids.length === 0 && !boss && gameState === 'playing') {
      wave++;
      updateHUD();
      spawnWave();
    }
  }

  function buildUI() {
    ['vs-ui','vs-title','vs-dead','vs-lives','vs-boss-bar'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.remove();
    });

    const hud = document.createElement('div');
    hud.id = 'vs-ui';
    Object.assign(hud.style, {
      position:       'absolute',
      top:            '0',
      left:           '0',
      width:          '100%',
      display:        'flex',
      justifyContent: 'space-between',
      alignItems:     'center',
      padding:        '10px 20px',
      boxSizing:      'border-box',
      fontFamily:     '"Courier New", monospace',
      fontSize:       '16px',
      color:          '#00eeff',
      zIndex:         '10001',
      pointerEvents:  'none',
      textShadow:     '0 0 8px #00eeff',
    });
    hud.innerHTML = `
      <span id="vs-score">KILLS: 0</span>
      <div style="pointer-events:auto; display:flex; gap:10px; align-items:center;">
        <button id="vs-bg-btn" style="
          background: rgba(0,30,60,0.8);
          border: 1px solid #00eeff;
          color: #00eeff;
          padding: 5px 14px;
          font-family: 'Courier New', monospace;
          font-size: 13px;
          cursor: pointer;
          border-radius: 4px;
          text-shadow: 0 0 6px #00eeff;
          box-shadow: 0 0 10px rgba(0,200,255,0.3);
        ">🌌 Nebula</button>
        <span id="vs-bg-label" style="display:none"></span>
      </div>
      <span id="vs-wave">WAVE: 1</span>
    `;
    container.appendChild(hud);
    document.getElementById('vs-bg-btn').addEventListener('click', () => {
      cycleBackground();
      document.getElementById('vs-bg-btn').textContent =
        ['🌌 Nebula','🌑 Deep Space','💥 Supernova'][bgSceneIdx];
    });

    const livesEl = document.createElement('div');
    livesEl.id = 'vs-lives';
    Object.assign(livesEl.style, {
      position:      'absolute',
      bottom:        '14px',
      left:          '20px',
      fontFamily:    '"Courier New", monospace',
      color:         '#00eeff',
      fontSize:      '18px',
      zIndex:        '10001',
      pointerEvents: 'none',
      textShadow:    '0 0 8px #00eeff',
    });
    livesEl.textContent = '▲ ▲ ▲';
    container.appendChild(livesEl);

    // Boss Alien health bar — hidden until the boss spawns on wave 3
    const bossBar = document.createElement('div');
    bossBar.id = 'vs-boss-bar';
    Object.assign(bossBar.style, {
      position:      'absolute',
      top:           '46px',
      left:          '12%',
      right:         '12%',
      height:        '16px',
      background:    'rgba(40,0,0,0.75)',
      border:        '1px solid #ff4060',
      borderRadius:  '3px',
      boxShadow:     '0 0 12px rgba(255,40,80,0.5)',
      display:       'none',
      zIndex:        '10001',
      pointerEvents: 'none',
    });
    bossBar.innerHTML = `
      <div id="vs-boss-fill" style="
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, #ff2040, #ff7090);
        border-radius: 2px;
        transition: width 0.1s linear;
      "></div>
      <span style="
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-family: 'Courier New', monospace;
        font-size: 12px;
        letter-spacing: 3px;
        color: #fff;
        text-shadow: 0 0 6px #ff2040;
      ">⚠ BOSS ALIEN</span>
    `;
    container.appendChild(bossBar);

    buildTitleScreen();
  }

  function updateHUD() {
    const s = document.getElementById('vs-score');
    const w = document.getElementById('vs-wave');
    const l = document.getElementById('vs-lives');
    if (s) s.textContent = `KILLS: ${totalKills}`;
    if (w) w.textContent = `WAVE: ${wave}`;
    if (l) l.textContent = Array.from({ length: lives }, () => '▲').join(' ');
  }

  function buildTitleScreen() {
    const div = document.createElement('div');
    div.id = 'vs-title';
    Object.assign(div.style, {
      position:      'absolute',
      top:           '50%',
      left:          '50%',
      transform:     'translate(-50%, -50%)',
      textAlign:     'center',
      fontFamily:    '"Courier New", monospace',
      color:         '#00eeff',
      zIndex:        '10002',
      pointerEvents: 'auto',
    });
    div.innerHTML = `
      <div style="font-size:40px; letter-spacing:8px; text-shadow:0 0 20px #00eeff; font-weight:bold; margin-bottom:10px;">VOID STRIKER</div>
      <div style="font-size:14px; opacity:0.7; margin-bottom:28px; letter-spacing:2px;">WASD to move &nbsp;•&nbsp; Arrow keys to shoot (any direction) &nbsp;•&nbsp; P to pause</div>
      <button id="vs-launch" style="
        background: transparent;
        border: 2px solid #00eeff;
        color: #00eeff;
        padding: 12px 40px;
        font-family: 'Courier New', monospace;
        font-size: 18px;
        letter-spacing: 4px;
        cursor: pointer;
        text-shadow: 0 0 10px #00eeff;
        box-shadow: 0 0 20px rgba(0,200,255,0.4), inset 0 0 20px rgba(0,200,255,0.05);
        transition: all 0.2s;
      ">LAUNCH</button>
    `;
    container.appendChild(div);
    document.getElementById('vs-launch').addEventListener('click', startGame);
  }

  function startGame() {
    const title = document.getElementById('vs-title');
    if (title) title.remove();
    const dead  = document.getElementById('vs-dead');
    if (dead)  dead.remove();
    closeConsole();
    wave = 1; lives = 3; totalKills = 0;
    bullets = []; enemies = []; asteroids = []; particles = []; enemyBullets = [];
    boss = null; worldSpeed = 1;
    bossesDefeated = 0; nextBossWave = 3;
    const bar = document.getElementById('vs-boss-bar');
    if (bar) bar.style.display = 'none';
    buildShip();
    spawnWave();
    gameState = 'playing';
    updateHUD();
  }

  function showDeadScreen() {
    if (totalKills > bestKills) bestKills = totalKills;

    const old = document.getElementById('vs-dead');
    if (old) old.remove();
    const div = document.createElement('div');
    div.id = 'vs-dead';
    Object.assign(div.style, {
      position:      'absolute',
      top:           '50%',
      left:          '50%',
      transform:     'translate(-50%,-50%)',
      textAlign:     'center',
      fontFamily:    '"Courier New", monospace',
      color:         '#ff4444',
      zIndex:        '10002',
      pointerEvents: 'auto',
    });
    div.innerHTML = `
      <div style="font-size:36px; letter-spacing:6px; text-shadow:0 0 20px #ff4444; font-weight:bold; margin-bottom:8px;">SHIP DESTROYED</div>
      <div style="font-size:20px; color:#00eeff; margin-bottom:4px;">KILLS: ${totalKills}</div>
      <div style="font-size:16px; color:#ffdd44; margin-bottom:4px; text-shadow:0 0 8px #ffdd44;">BEST: ${bestKills}</div>
      <div style="font-size:16px; color:#00eeff; opacity:0.7; margin-bottom:28px;">Reached Wave ${wave}</div>
      <button id="vs-retry" style="
        background: transparent;
        border: 2px solid #ff4444;
        color: #ff4444;
        padding: 10px 36px;
        font-family: 'Courier New', monospace;
        font-size: 16px;
        letter-spacing: 3px;
        cursor: pointer;
        text-shadow: 0 0 10px #ff4444;
        box-shadow: 0 0 20px rgba(255,68,68,0.3);
      ">RETRY</button>
    `;
    container.appendChild(div);
    document.getElementById('vs-retry').addEventListener('click', startGame);
  }

  function attachInput() {
    window.addEventListener('keydown', e => {
      if (e.key === 'p' || e.key === 'P') {
        if (gameState !== 'playing') return;
        if (consoleActive) {
          closeConsole();
        } else {
          openConsole();
        }
        return;
      }
      if (!consoleActive) {
        keys[e.key] = true;
      }
      // Stop arrow keys / space from scrolling the host page while the game
      // has focus — they're game inputs, not navigation.
      if (e.key === ' ' || e.key === 'ArrowUp' || e.key === 'ArrowDown' ||
          e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        e.preventDefault();
      }
    });
    window.addEventListener('keyup', e => { keys[e.key] = false; });
  }

  function loop() {
    ctx.clearRect(0, 0, W, H);

    updateLayers();
    drawLayers();

    if (gameState === 'playing' && !consoleActive) {
      updateShip();
      updateBullets();
      updateEnemies();
      updateBoss();
      updateParticles();
      checkCollisions();
      updateHUD();

      drawEnemies();
      drawBoss();
      drawBullets();
      drawParticles();
      drawShip();

      if (lives <= 0) {
        gameState = 'dead';
        showDeadScreen();
      }
    } else if (gameState === 'playing' && consoleActive) {
      // Game paused — draw last frame frozen
      drawEnemies();
      drawBoss();
      drawBullets();
      drawParticles();
      drawShip();
    }

    frameId = requestAnimationFrame(loop);
  }

  return { init };
})();

export default GameLevelVoidStriker;
