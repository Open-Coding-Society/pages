// Adventure Game Custom Level — ZoneCatch (Platformer Edition)
//
// The player must jump across platforms to reach the safe-coloured zone
// before each round's timer expires.  Gravity pulls the player down;
// W / Space = jump, A / D = move left/right.  All original Zone Catch
// mechanics (rounds, gate, coins, AI briefing, HUD) are preserved.

import GameEnvBackground from '@assets/js/GameEnginev1.1/essentials/GameEnvBackground.js';
import Player from '@assets/js/GameEnginev1.1/essentials/Player.js';
import Barrier from '@assets/js/GameEnginev1.1/essentials/Barrier.js';
import AiNpc from '@assets/js/GameEnginev1.1/essentials/AiNpc.js';
import GameStats from '@assets/js/GameEnginev1.1/GameStats.js';
import Coin from '@assets/js/GameEnginev1.1/Coin.js';
import Clicker from '@assets/js/GameEnginev1.1/essentials/Clicker.js';

// ─────────────────────────────────────────────────────────────────────────────
// COORDINATE SPACE CONTRACT:
//
//   The overlay canvas is position:fixed and covers the full viewport.
//   ALL coordinates (circles, player, walls, banners) use CSS VIEWPORT PIXELS.
//
//   _arena() returns bounds in viewport pixels using _ox/_oy/_gW/_gH.
//   Circles are stored and drawn directly in viewport pixel coords — no transforms.
//
//   player.x/y come from the game engine in gameEnv.innerWidth/Height space,
//   which equals the CSS display dimensions of the game canvas (_gW/_gH).
//   So converting player → viewport is simply:  player.x + _ox, player.y + _oy.
//
//   _checkSurvivalAtRoundEnd compares player (viewport) vs circle (viewport).
//   They are in the same space.
//   The check is a direct, correct distance test.
// ─────────────────────────────────────────────────────────────────────────────

class ZoneCatchOverlay {
    constructor(gameEnv) {
        this.gameEnv = gameEnv;
        this.canvas  = null;
        this.ctx     = null;

        // ── Hide site navbar / header so the game canvas can fill the viewport ──
        this._hiddenEls = [];
        document.querySelectorAll('nav, header, .navbar, .site-header, #navbarNav, .top-nav, .site-nav').forEach(el => {
            if (el.style.display !== 'none') {
                this._hiddenEls.push({ el, prev: el.style.display });
                el.style.display = 'none';
            }
        });

        // ── Force the game container to fill the full viewport ──
        this._gameContainer = gameEnv.gameContainer || document.getElementById('gameContainer');
        if (this._gameContainer) {
            this._gcOrigStyle = this._gameContainer.getAttribute('style') || '';
            this._gameContainer.style.cssText =
                'position:fixed;top:0;left:0;width:100vw;height:100vh;margin:0;padding:0;overflow:hidden;z-index:1;';
        }

        document.documentElement.style.overflow = 'hidden';
        document.body.style.overflow = 'hidden';
        document.body.style.margin   = '0';
        document.body.style.padding  = '0';

        this._reset();
        this._initCanvas();

        // Bootstrap the global HUD / leaderboard / name entry (idempotent).
        GameStats.bootstrap();
        GameStats.onLevelStart();

        // Feed global coin tracker from this level's gameEnv every 100ms
        this.coinUpdateInterval = setInterval(() => {
            if (this.gameEnv && this.gameEnv.stats) {
                GameStats.trackLevelCoins(this.gameEnv.stats.coinsCollected || 0);
            }
        }, 100);
    }

    // ── State reset (first run + soft restart after death/win) ───────────────
    _reset() {
        this.round          = 0;
        this.totalRounds    = Infinity;
        this.roundActive    = false;
        if (this.gameEnv && this.gameEnv.stats) {
            this.gameEnv.stats.coinsCollected = 0;
        }
        this.breakActive    = false;
        this.gameOver       = false;
        this.won            = false;
        this.introPhase     = true;
        this.countdownPhase = false;
        this.countdownValue = 3;
        this.briefingActive = true;

        this.baseRoundDuration = 7800;
        this.baseBreakDuration = 1250;
        this.roundEndTime      = 0;

        this.circles     = [];
        this.gateCircle  = null;
        this.gateVisible = false;

        this.wallThickness = 48;

        this.colorPairs = [
            ['#e63946', '#457b9d'],
            ['#f4a261', '#2a9d8f'],
            ['#e9c46a', '#6a0572'],
            ['#ff006e', '#38b000'],
            ['#fb5607', '#3a86ff'],
            ['#ffbe0b', '#8338ec'],
        ];

        if (this._timer) {
            clearTimeout(this._timer);
            this._timer = null;
        }

        // ── Platformer physics state ──────────────────────────────────────────
        this._vy          = 0;
        this._vx          = 0;
        this._onGround    = true;    // start grounded so jump works immediately
        this._canJump     = true;
        this._physicsKeys = { w: false, a: false, d: false, space: false };
    }

    // ── Canvas setup ─────────────────────────────────────────────────────────
    _initCanvas() {
        if (!this.canvas) {
            this.canvas = document.createElement('canvas');
            this.canvas.id = 'zonecatch-overlay';
            this.canvas.style.cssText = `
                position:fixed;
                top:0; left:0;
                width:100vw; height:100vh;
                pointer-events:none; z-index:9999;
            `;
            if (!document.getElementById('zonecatch-font')) {
                const link = document.createElement('link');
                link.id = 'zonecatch-font';
                link.rel = 'stylesheet';
                link.href = 'https://fonts.googleapis.com/css2?family=Exo+2:wght@700;900&display=swap';
                document.head.appendChild(link);
            }
            document.body.appendChild(this.canvas);
            this.ctx = this.canvas.getContext('2d');
            window.addEventListener('resize', () => this._resize());
        }

        this._resize();
        this._stonePattern = null;
        this._showAiBriefing();

        if (!this._animFrame) {
            setTimeout(() => {
                this._resize();
                this._buildPlatforms();
                this._startPhysicsLoop();
                this._loop();
            }, 150);
        }
    }

    // ═══════════════════════════════════════════════════════════════════════════
    //  PLATFORMER: Platform definitions & physics
    // ═══════════════════════════════════════════════════════════════════════════

    /** Build platform layout relative to current viewport.
     *  Platforms are defined as fractions of the arena so they scale on resize.
     *  Each has {x, y, w, h} in viewport pixels, plus a color for rendering.
     */
    _buildPlatforms() {
        const a = this._arena();

        // Helper: convert arena-relative fractions → viewport pixels
        const p = (fx, fy, fw, fh, color) => ({
            x: a.x + fx * a.w,
            y: a.y + fy * a.h,
            w: fw * a.w,
            h: fh !== undefined ? fh * a.h : 14,
            color: color || '#5a7a9a',
        });

        const platH = 14 / a.h;  // ~14px platform thickness as fraction

        // ── GROUND (full floor inside walls) ──────────────────────────────────
        // The ground sits at the very bottom of the arena
        this._groundY = a.y + a.h - 14;

        // ── PLATFORMS ─────────────────────────────────────────────────────────
        // Layout: a mixture of heights so zones on different vertical levels
        // require jumping to reach.  The player starts on the ground.
        //
        //  Row 1 (low):   ~75% down
        //  Row 2 (mid):   ~50% down
        //  Row 3 (high):  ~28% down
        //  Row 4 (top):   ~12% down
        //
        this._platforms = [
            // ── GROUND ──
            p(0, 1.0 - platH, 1.0, platH, '#3a5a3a'),

            // ── Row 1 — low platforms ──
            p(0.02, 0.78, 0.18, platH, '#4a6fa5'),
            p(0.28, 0.78, 0.18, platH, '#4a6fa5'),
            p(0.55, 0.78, 0.18, platH, '#4a6fa5'),
            p(0.80, 0.78, 0.18, platH, '#4a6fa5'),

            // ── Row 2 — mid platforms ──
            p(0.08, 0.56, 0.22, platH, '#6a5acd'),
            p(0.40, 0.56, 0.22, platH, '#6a5acd'),
            p(0.72, 0.56, 0.22, platH, '#6a5acd'),

            // ── Row 3 — high platforms ──
            p(0.02, 0.36, 0.20, platH, '#cd853f'),
            p(0.30, 0.36, 0.20, platH, '#cd853f'),
            p(0.58, 0.36, 0.20, platH, '#cd853f'),
            p(0.80, 0.36, 0.18, platH, '#cd853f'),

            // ── Row 4 — top platforms ──
            p(0.12, 0.16, 0.20, platH, '#c0392b'),
            p(0.42, 0.16, 0.18, platH, '#c0392b'),
            p(0.68, 0.16, 0.20, platH, '#c0392b'),
        ];
    }

    /** Start the 60 fps physics loop that applies gravity, jumping,
     *  horizontal movement, and platform collision to the player.
     *  This OVERRIDES the engine's built-in WASD movement for a
     *  proper platformer feel.
     */
    _startPhysicsLoop() {
        // Key listeners — we track our own key state so we can
        // decouple from the engine's top-down movement model.
        this._physKeyDown = (e) => {
            const k = e.key.toLowerCase();
            if (k === 'w' || k === 'arrowup')    this._physicsKeys.w = true;
            if (k === 'a' || k === 'arrowleft')  this._physicsKeys.a = true;
            if (k === 'd' || k === 'arrowright') this._physicsKeys.d = true;
            if (k === ' ') { this._physicsKeys.space = true; e.preventDefault(); }
        };
        this._physKeyUp = (e) => {
            const k = e.key.toLowerCase();
            if (k === 'w' || k === 'arrowup')    this._physicsKeys.w = false;
            if (k === 'a' || k === 'arrowleft')  this._physicsKeys.a = false;
            if (k === 'd' || k === 'arrowright') this._physicsKeys.d = false;
            if (k === ' ') this._physicsKeys.space = false;
        };
        document.addEventListener('keydown', this._physKeyDown);
        document.addEventListener('keyup',   this._physKeyUp);

        // Physics constants (tuned for a snappy feel)
        const GRAVITY    = 0.45;
        const JUMP_FORCE = -16;
        const MOVE_SPEED = 5.5;
        const MAX_FALL   = 16;

        const self = this;

        this._physicsInterval = setInterval(() => {
            if (self.gameOver || self.won) return;
            if (self.briefingActive || self.introPhase || self.countdownPhase) return;

            const player = self._getPlayerObject();
            if (!player) return;

            // ── CRITICAL: Kill engine gravity every tick ──────────────────────
            // The engine's Player.update() applies its own gravity when
            // this.gravity === true.  Even though we set GRAVITY:false in data,
            // belt-and-suspenders: force it off and zero the engine's
            // accumulator so it can never fight our physics.
            player.gravity      = false;
            player.time         = 0;
            player.acceleration = 0;
            player.moved        = true;   // tells engine "player moved, skip gravity"

            const pw = player.width  || 40;
            const ph = player.height || 40;
            let px = player.position ? player.position.x : 0;
            let py = player.position ? player.position.y : 0;

            const keys = self._physicsKeys;

            // ── Horizontal input ──────────────────────────────────────────────
            if      (keys.a) self._vx = -MOVE_SPEED;
            else if (keys.d) self._vx =  MOVE_SPEED;
            else             self._vx =  0;

            // ── Jump ──────────────────────────────────────────────────────────
            if ((keys.w || keys.space) && self._onGround && self._canJump) {
                self._vy       = JUMP_FORCE;
                self._onGround = false;
                self._canJump  = false;
            }
            if (!keys.w && !keys.space) self._canJump = true;

            // ── Gravity ───────────────────────────────────────────────────────
            self._vy = Math.min(self._vy + GRAVITY, MAX_FALL);

            // ── Proposed position ─────────────────────────────────────────────
            let nx = px + self._vx;
            let ny = py + self._vy;

            // ── Arena bounds (wall collision) ─────────────────────────────────
            const a = self._arena();
            if (nx < a.x)              { nx = a.x;              self._vx = 0; }
            if (nx + pw > a.x + a.w)   { nx = a.x + a.w - pw;  self._vx = 0; }
            if (ny < a.y)              { ny = a.y;              self._vy = 0; }

            // ── Platform collision ────────────────────────────────────────────
            if (!self._platforms) { self._buildPlatforms(); }

            self._onGround = false;

            for (const p of self._platforms) {
                const psx = p.x, psy = p.y, psw = p.w, psh = p.h;
                const withinX = nx + pw * 0.15 < psx + psw && nx + pw * 0.85 > psx;

                // ── Top landing — generous sweep test ─────────────────────────
                // Accept landing if player feet are anywhere from slightly above
                // to partially inside the platform (up to 60% of psh).
                // This prevents "falling through" when the engine or lag nudges
                // the player a few pixels past the surface between ticks.
                if (self._vy >= 0 && withinX) {
                    const feet = ny + ph;
                    const wasAbove = (py + ph) <= psy + psh * 0.6;
                    const nowInside = feet >= psy && feet <= psy + psh + 4;
                    if (wasAbove && nowInside) {
                        ny = psy - ph;
                        self._vy = 0;
                        self._onGround = true;
                    }
                }

                // ── Safety snap: already embedded inside platform ─────────────
                // If the player somehow ended up fully inside a platform
                // (e.g. first frame, respawn, engine interference), push up.
                if (withinX && !self._onGround) {
                    const feet = ny + ph;
                    const waist = ny + ph * 0.5;
                    if (waist > psy && waist < psy + psh && feet > psy) {
                        ny = psy - ph;
                        self._vy = 0;
                        self._onGround = true;
                    }
                }

                // ── Ceiling hit (jumping into bottom of platform) ─────────────
                if (self._vy < 0) {
                    const platBottom = psy + psh;
                    const withinXCeil = nx + pw * 0.1 < psx + psw && nx + pw * 0.9 > psx;
                    if (withinXCeil && py >= platBottom - 4 && ny < platBottom) {
                        ny = platBottom;
                        self._vy = 0;
                    }
                }

                // ── Side wall collision ───────────────────────────────────────
                const vertOverlap = ny + ph * 0.05 < psy + psh && ny + ph * 0.95 > psy;
                if (vertOverlap) {
                    if (px + pw <= psx + 6 && nx + pw > psx)      { nx = psx - pw;  self._vx = 0; }
                    if (px >= psx + psw - 6 && nx < psx + psw)    { nx = psx + psw; self._vx = 0; }
                }
            }

            // ── Fall death (below arena) ──────────────────────────────────────
            if (ny > a.y + a.h + 20) {
                // Reset to ground start position
                nx = a.x + a.w * 0.1;
                ny = self._groundY - ph;
                self._vy = 0;
                self._vx = 0;
                self._onGround = true;
            }

            // ── Write resolved position ───────────────────────────────────────
            if (player.position) {
                player.position.x = nx;
                player.position.y = ny;
            }

            // ── Suppress engine velocity every tick ───────────────────────────
            // The engine's Character.update() moves the player by velocity,
            // so zeroing it prevents the engine from overriding our position.
            if (player.velocity) {
                player.velocity.x = 0;
                player.velocity.y = 0;
            }

            // Animation direction
            if      (self._vx < 0) player.direction = 'left';
            else if (self._vx > 0) player.direction = 'right';

        }, 16);
    }

    // ── AI NPC pre-level briefing ─────────────────────────────────────────────
    _showAiBriefing() {
        const path = this.gameEnv?.path || '';

        const spriteData = {
            id: 'Zone Catch Referee',
            src: path + "/images/projects/gategame/sprites/mastergate.png",
            pixels: { height: 512, width: 512 },
            orientation: { rows: 1, columns: 1 },
            down: { row: 0, start: 0, columns: 1 },

            expertise: 'zone catch survival challenge',
            chatHistory: [],
            dialogues: [
                "🎯 Welcome to Zone Catch — Platformer Edition!\n\nThis isn't your ordinary zone game. GRAVITY is active! Use W or Space to JUMP and A/D to move left and right. Platforms are scattered across the arena at different heights.\n\nEach round, two coloured zones appear — the banner tells you which colour is SAFE. You must JUMP across platforms to reach the safe zone before time runs out! Standing outside it when the timer ends = eliminated.\n\nBetween rounds, mouse-click the POWER CORE for bonus coins (every 4 clicks = +1 coin). From Round 6, a golden GATE appears — reach it and press E to escape early.\n\nAsk me anything, then click Start Level!"
            ],
            knowledgeBase: {
                'zone catch survival challenge': [
                    { question: 'How do I know which zone is safe?',
                      answer:   'Look at the white banner at the top of the arena. It tells you the SAFE color. Jump across platforms to reach the matching coloured zone before the timer runs out!' },
                    { question: 'What happens if I am not in the safe zone?',
                      answer:   'You get eliminated and lose one of your 3 lives. The game ends if you run out of lives across all levels.' },
                    { question: 'How do I move?',
                      answer:   'Use A and D (or arrow keys) to move left and right. Press W, Space, or Up Arrow to JUMP. You need to jump across platforms to reach zones at different heights!' },
                    { question: 'What is the gate and when does it appear?',
                      answer:   'Starting from round 6, a golden GATE appears somewhere in the arena. Reach it and press E to win the game instantly!' },
                    { question: 'How does gravity work?',
                      answer:   'Gravity constantly pulls you downward. When you jump, you arc upward then fall back down. You can land on any platform. If you fall off, you respawn on the ground.' },
                    { question: 'How do I win?',
                      answer:   'Either reach the golden gate (appears from round 6) or survive as many rounds as you can. The leaderboard tracks your peak rounds survived!' }
                ]
            }
        };

        AiNpc.showLevelBriefing({
            spriteData,
            gameControl: this.gameEnv?.gameControl || null,
            startButtonText: '▶  Enter the Arena',
            onStart: () => {
                this.briefingActive = false;
                this.introPhase     = false;
                this.countdownPhase = true;
                this.countdownValue = 3;
                this._runCountdown();
            }
        });
    }

    // ── _resize: Lock exactly to viewport to avoid the top-left corner bug ─────
    _resize() {
        this.canvas.width  = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this._stonePattern = null;

        this._ox = 0;
        this._oy = 0;
        this._gW = window.innerWidth;
        this._gH = window.innerHeight;

        // Rebuild platforms on resize so they stay proportional
        this._buildPlatforms();
    }

    // ── Arena bounds in CSS VIEWPORT pixels ──────────────────────────────────
    _arena() {
        const t = this.wallThickness;
        return {
            x: (this._ox || 0) + t,
            y: (this._oy || 0) + t,
            w: (this._gW || window.innerWidth)  - t * 2,
            h: (this._gH || window.innerHeight) - t * 2,
        };
    }

    // ── Intro / countdown ─────────────────────────────────────────────────────
    _bindIntroSkip() {
        const advance = () => {
            if (!this.introPhase) return;
            this.introPhase     = false;
            this.countdownPhase = true;
            this.countdownValue = 3;
            this._runCountdown();
            window.removeEventListener('keydown',     advance);
            window.removeEventListener('pointerdown', advance);
        };
        window.addEventListener('keydown',     advance);
        window.addEventListener('pointerdown', advance);
        this._advanceFn = advance;
    }

    _runCountdown() {
        if (this.countdownValue <= 0) {
            this.countdownPhase = false;
            this.breakActive    = true;
            this._scheduleNextRound(400);
            return;
        }
        this._timer = setTimeout(() => {
            this.countdownValue--;
            this._runCountdown();
        }, 1000);
    }

    // ── Round scheduling ──────────────────────────────────────────────────────
    _roundDuration() {
        return Math.max(3750, this.baseRoundDuration - (this.round - 1) * 60);
    }

    _breakDuration() {
        return Math.max(750, this.baseBreakDuration - this.round * 18);
    }

    _scheduleNextRound(delay) {
        if (this._timer) clearTimeout(this._timer);
        this._timer = setTimeout(() => this._startRound(), delay);
    }

    _startRound() {
        if (this.gameOver) return;

        this.round++;
        this.roundActive  = true;
        this.breakActive  = false;
        this.roundEndTime = performance.now() + this._roundDuration();

        this._spawnCircles();

        if (this.round >= 6) {
            this._spawnGate();
            this._bindGateKey();
        }

        this._timer = setTimeout(() => this._endRound(), this._roundDuration());
    }

    _endRound() {
        if (this.gameOver) return;

        this._checkSurvivalAtRoundEnd();

        if (this.gameOver) return;

        GameStats.setZoneCatchRounds(this.round);

        this.roundActive = false;
        this.breakActive = true;
        this.circles     = [];
        this.gateCircle  = null;
        this.gateVisible = false;

        if (this.round >= this.totalRounds) {
            this._triggerWin();
            return;
        }

        this._scheduleNextRound(this._breakDuration());
    }

    // ── Spawning — zones snap to platform surfaces so they're reachable ──────
    _spawnCircles() {
        const a    = this._arena();
        const pair = this.colorPairs[Math.floor(Math.random() * this.colorPairs.length)];
        const shuffled = Math.random() < 0.5 ? pair : [pair[1], pair[0]];
        const safeIdx  = Math.floor(Math.random() * 2);

        const baseR = 85;
        const margin = baseR + 20;

        // Pick random positions but bias toward platform surfaces
        // so the player can actually stand inside the zone
        const pickPos = () => {
            if (this._platforms && this._platforms.length > 1) {
                // Pick a random platform (skip index 0 = ground sometimes for variety)
                const idx = Math.floor(Math.random() * this._platforms.length);
                const plat = this._platforms[idx];
                // Center the circle above this platform
                const cx = plat.x + plat.w * (0.3 + Math.random() * 0.4);
                const cy = plat.y - baseR * 0.3;
                // Clamp within arena
                return {
                    x: Math.max(a.x + margin, Math.min(a.x + a.w - margin, cx)),
                    y: Math.max(a.y + margin, Math.min(a.y + a.h - margin, cy)),
                };
            }
            return {
                x: a.x + margin + Math.random() * (a.w - margin * 2),
                y: a.y + margin + Math.random() * (a.h - margin * 2),
            };
        };

        const pos0 = pickPos();
        let pos1 = pickPos();
        // Ensure the two zones are on different platforms (different Y regions)
        let attempts = 0;
        while (Math.abs(pos0.y - pos1.y) < 60 && attempts < 10) {
            pos1 = pickPos();
            attempts++;
        }

        this.circles = [
            { x: pos0.x, y: pos0.y, r: baseR, color: shuffled[0], safe: safeIdx === 0 },
            { x: pos1.x, y: pos1.y, r: baseR, color: shuffled[1], safe: safeIdx === 1 },
        ];
    }

    _spawnGate() {
        const a = this._arena();
        const r = Math.max(24, Math.min(36, Math.min(a.w, a.h) * 0.08));
        const margin = r + 20;

        this.gateCircle = {
            x: a.x + margin + Math.random() * (a.w - margin * 2),
            y: a.y + margin + Math.random() * (a.h - margin * 2 - 60),
            r,
            alpha: 1,
            fadeRate: 0.0030 + (this.round - 6) * 0.0006,
        };
        this.gateVisible = true;
    }

    // ── Player helpers ────────────────────────────────────────────────────────

    _getPlayerObject() {
        try {
            const gameObjects = this.gameEnv?.gameObjects;
            if (gameObjects) {
                return gameObjects.find(o => o && (
                    o.id === 'playerData' ||
                    o.spriteData?.id === 'playerData' ||
                    o.data?.id === 'playerData' ||
                    o.name === 'playerData' ||
                    (o.keypress && o.position)
                )) || null;
            }
        } catch (_) {}
        return null;
    }

    _getPlayerElement() {
        try {
            const player = this._getPlayerObject();
            if (player?.element) return player.element;
            if (player?.canvas)  return player.canvas;
            if (player?.sprite)  return player.sprite;

            const gameObjects = this.gameEnv?.gameObjects;
            if (gameObjects) {
                const p = gameObjects.find(o => o && (
                    o.id === 'playerData' ||
                    o.spriteData?.id === 'playerData' ||
                    o.data?.id === 'playerData' ||
                    o.name === 'playerData' ||
                    (o.keypress && o.element)
                ));

                if (p?.element) return p.element;
                if (p?.canvas)  return p.canvas;
                if (p?.sprite)  return p.sprite;
            }

            const slime = document.querySelector('img[src*="slime"], canvas[data-id="playerData"]');
            if (slime) return slime;

            const gameCanvas = document.querySelector('canvas:not(#zonecatch-overlay)');
            if (gameCanvas) {
                const siblings = gameCanvas.parentElement?.querySelectorAll('img, canvas:not(#zonecatch-overlay):not([data-bg])');
                if (siblings?.length) return siblings[siblings.length - 1];
            }
        } catch (_) {}

        return null;
    }

    _getPlayerCenter() {
        const el = this._getPlayerElement();
        if (!el) return null;

        const r = el.getBoundingClientRect();
        if (r.width === 0 && r.height === 0) return null;

        return {
            x: r.left + r.width / 2,
            y: r.top + r.height / 2
        };
    }

    _hexToRgb(hex) {
        const m = /^#([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return m ? {
            r: parseInt(m[1], 16),
            g: parseInt(m[2], 16),
            b: parseInt(m[3], 16)
        } : null;
    }

    // ── Collision helpers ─────────────────────────────────────────────────────
    _dist(ax, ay, bx, by) {
        return Math.sqrt((ax - bx) ** 2 + (ay - by) ** 2);
    }

    _inCircle(p, c) {
        return this._dist(p.x, p.y, c.x, c.y) < c.r;
    }

    _bindGateKey() {
        if (this._gateKeyBound) return;
        this._gateKeyBound = true;

        this._gateKeyHandler = (e) => {
            if (e.key !== 'e' && e.key !== 'E') return;
            if (!this.roundActive || !this.gateVisible || !this.gateCircle) return;

            const p = this._getPlayerCenter();
            if (!p) return;

            if (this._dist(p.x, p.y, this.gateCircle.x, this.gateCircle.y) < this.gateCircle.r * 1.5) {
                this._triggerWin();
            }
        };
        window.addEventListener('keydown', this._gateKeyHandler);
    }

    _unbindGateKey() {
        if (this._gateKeyHandler) {
            window.removeEventListener('keydown', this._gateKeyHandler);
            this._gateKeyHandler = null;
        }
        this._gateKeyBound = false;
    }

    _checkCollisions() {
        if (!this.roundActive) return;
    }

    _checkSurvivalAtRoundEnd() {
        const el = this._getPlayerElement();
        if (!el) {
            this._triggerDeath();
            return;
        }

        const safe = this.circles.find(c => c.safe);
        if (!safe) return;

        const playerCenter = this._getPlayerCenter();
        if (!playerCenter) {
            this._triggerDeath();
            return;
        }

        if (!this._inCircle(playerCenter, safe)) {
            this._triggerDeath();
        }
    }

    // ── Game state ────────────────────────────────────────────────────────────
    _triggerDeath() {
        if (this.gameOver) return;

        this.gameOver = true;
        this.roundActive = false;

        this._unbindGateKey();

        if (this._timer) {
            clearTimeout(this._timer);
            this._timer = null;
        }

        this.circles = [];
        this.gateCircle = null;
        this.gateVisible = false;

        GameStats.setZoneCatchRounds(Math.max(0, this.round - 1));

        const finalGameOver = GameStats.loseLife();
        this._blockSoftRestart = finalGameOver;
    }

    _triggerWin() {
        if (this.gameOver) return;

        this.gameOver = true;
        this.won = true;
        this.roundActive = false;

        this._unbindGateKey();

        if (this._timer) {
            clearTimeout(this._timer);
            this._timer = null;
        }

        this.circles = [];
        this.gateCircle = null;
        this.gateVisible = false;

        GameStats.completeGame(this.round);
        this._blockSoftRestart = true;
    }

    _softRestart() {
        if (this._timer) clearTimeout(this._timer);
        this._timer = null;

        this._reset();
        this.briefingActive = false;
        this._buildPlatforms();
        this._bindIntroSkip();

        // Reset player to ground spawn with physics in clean state
        const a = this._arena();
        const player = this._getPlayerObject();
        if (player) {
            // Force engine gravity off
            player.gravity = false;
            player.time = 0;
            player.moved = true;
            if (player.velocity) {
                player.velocity.x = 0;
                player.velocity.y = 0;
            }
            if (player.position) {
                player.position.x = a.x + a.w * 0.1;
                player.position.y = this._groundY - (player.height || 40);
            }
        }
        this._vy = 0;
        this._vx = 0;
        this._onGround = true;
    }

    _listenForRestart() {
        if (this._restartListening) return;
        if (this._blockSoftRestart) return;
        this._restartListening = true;

        const restart = () => {
            this._restartListening = false;
            this._softRestart();
            window.removeEventListener('keydown',     restart);
            window.removeEventListener('pointerdown', restart);
        };

        setTimeout(() => {
            window.addEventListener('keydown',     restart);
            window.addEventListener('pointerdown', restart);
        }, 800);
    }

    // ── Main loop ─────────────────────────────────────────────────────────────
    _loop() {
        this._animFrame = requestAnimationFrame(() => this._loop());
        this._update();
        this._draw();
    }

    _update() {
        if (this.gateVisible && this.gateCircle) {
            this.gateCircle.alpha -= this.gateCircle.fadeRate;
            if (this.gateCircle.alpha <= 0) {
                this.gateCircle.alpha = 0;
                this.gateVisible = false;
            }
        }

        if (!this.gameOver && !this.introPhase && !this.countdownPhase) {
            this._checkCollisions();
        }
    }

    // ── Draw ──────────────────────────────────────────────────────────────────
    _draw() {
        const ctx = this.ctx;
        const W = this.canvas.width, H = this.canvas.height;
        ctx.clearRect(0, 0, W, H);

        const ox = this._ox || 0, oy = this._oy || 0;
        const gW = this._gW || W,  gH = this._gH || H;

        if (this.briefingActive) {
            ctx.fillStyle = 'rgba(5,5,20,0.92)';
            ctx.fillRect(0, 0, W, H);
            return;
        }
        if (this.introPhase) {
            this._drawIntroScreen(ctx, W, H);
            return;
        }
        if (this.countdownPhase) {
            this._drawCountdownScreen(ctx, W, H);
            return;
        }
        if (this.gameOver) {
            this.won ? this._drawWinScreen(ctx, W, H) : this._drawDeathScreen(ctx, W, H);
            return;
        }

        this._drawStoneWalls(ctx, ox, oy, gW, gH);
        this._drawPlatforms(ctx);

        if (this.roundActive) {
            this._drawSpotlights(ctx);
            this._drawSafetyBanner(ctx, ox, oy, gW);
            this._drawRoundTimer(ctx, ox, oy, gW);
            if (this.gateVisible && this.gateCircle) this._drawGate(ctx);
            this._drawPlayerDot(ctx);
        } else if (this.breakActive) {
            this._drawBreakBanner(ctx, ox, oy, gW, gH);
        }

        this._drawRoundCounter(ctx, ox, oy, gW);
    }

    // ── Draw platforms on the overlay canvas ──────────────────────────────────
    _drawPlatforms(ctx) {
        if (!this._platforms) return;

        for (const p of this._platforms) {
            ctx.save();

            // Main platform body
            const grad = ctx.createLinearGradient(p.x, p.y, p.x, p.y + p.h);
            grad.addColorStop(0, p.color);
            grad.addColorStop(1, this._darken(p.color, 0.6));
            ctx.fillStyle = grad;

            ctx.beginPath();
            ctx.roundRect(p.x, p.y, p.w, p.h, 3);
            ctx.fill();

            // Top highlight
            ctx.fillStyle = 'rgba(255,255,255,0.18)';
            ctx.fillRect(p.x + 1, p.y, p.w - 2, 2);

            // Subtle border
            ctx.strokeStyle = 'rgba(255,255,255,0.12)';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.roundRect(p.x, p.y, p.w, p.h, 3);
            ctx.stroke();

            ctx.restore();
        }
    }

    /** Darken a hex color by a factor (0–1) */
    _darken(hex, factor) {
        const rgb = this._hexToRgb(hex);
        if (!rgb) return hex;
        const r = Math.round(rgb.r * factor);
        const g = Math.round(rgb.g * factor);
        const b = Math.round(rgb.b * factor);
        return `rgb(${r},${g},${b})`;
    }

    _drawIntroScreen(ctx, W, H) {
        ctx.fillStyle = 'rgba(5,5,20,0.78)';
        ctx.fillRect(0, 0, W, H);

        const bw = 580, bh = 400, bx = (W - bw) / 2, by = (H - bh) / 2;

        ctx.save();
        ctx.shadowColor = 'rgba(100,180,255,0.4)';
        ctx.shadowBlur = 30;

        const g = ctx.createLinearGradient(bx, by, bx + bw, by + bh);
        g.addColorStop(0, '#0d1b2a');
        g.addColorStop(1, '#1b2838');

        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.roundRect(bx, by, bw, bh, 18);
        ctx.fill();

        ctx.strokeStyle = 'rgba(100,180,255,0.55)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(bx, by, bw, bh, 18);
        ctx.stroke();
        ctx.restore();

        ctx.save();
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        ctx.font = "900 42px 'Exo 2', sans-serif";
        ctx.fillStyle = '#ffe066';
        ctx.fillText('ZONE CATCH', W / 2, by + 48);

        ctx.font = "bold 14px 'Exo 2', sans-serif";
        ctx.fillStyle = '#ff8866';
        ctx.fillText('⚡  PLATFORMER EDITION  ⚡', W / 2, by + 78);

        ctx.font = "bold 13px 'Exo 2', sans-serif";
        ctx.fillStyle = 'rgba(200,230,255,0.7)';
        ctx.fillText('Jump across platforms to reach the safe zone!', W / 2, by + 104);

        const rules = [
            '🎯  Two coloured zones appear each round',
            '📢  The banner tells you which colour is SAFE',
            '⬆️   W / Space = JUMP  ·  A / D = move left / right',
            '🏃  Jump across platforms to reach the safe zone',
            '⚠️   Outside the safe zone when time ends = eliminated',
            '🚪  From Round 6 a golden GATE appears — reach it + E to win',
        ];

        ctx.textAlign = 'left';
        ctx.font = "bold 13px 'Exo 2', sans-serif";
        rules.forEach((rule, i) => {
            ctx.fillStyle = i % 2 === 0 ? '#c8e6ff' : '#a0d4f5';
            ctx.fillText(rule, bx + 36, by + 142 + i * 32);
        });

        ctx.textAlign = 'center';
        const pulse = 0.6 + 0.4 * Math.sin(Date.now() / 500);
        ctx.globalAlpha = pulse;
        ctx.font = "900 16px 'Exo 2', sans-serif";
        ctx.fillStyle = '#ffe066';
        ctx.fillText('PRESS ANY KEY OR CLICK TO BEGIN', W / 2, by + bh - 24);
        ctx.restore();
    }

    _drawCountdownScreen(ctx, W, H) {
        ctx.fillStyle = 'rgba(5,5,20,0.55)';
        ctx.fillRect(0, 0, W, H);

        ctx.save();
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        const label = this.countdownValue > 0 ? String(this.countdownValue) : 'GO!';
        const color = this.countdownValue > 0 ? '#ffe066' : '#74c69d';
        const size  = this.countdownValue > 0 ? 140 : 110;

        ctx.font = `900 ${size}px 'Exo 2', sans-serif`;
        ctx.shadowColor = color;
        ctx.shadowBlur = 40;
        ctx.fillStyle = color;
        ctx.fillText(label, W / 2, H / 2);
        ctx.restore();
    }

    _drawStoneWalls(ctx, ox, oy, gW, gH) {
        const t = this.wallThickness;
        const expand = 2;

        if (!this._stonePattern) {
            this._stonePattern = this._makeStonePattern(ctx);
        }

        ctx.save();
        ctx.fillStyle = this._stonePattern || '#606060';

        ctx.fillRect(ox - expand, oy - expand, gW + expand * 2, t + expand);
        ctx.fillRect(ox - expand, oy + gH - t, gW + expand * 2, t + expand);
        ctx.fillRect(ox - expand, oy + t - expand, t + expand, gH - t * 2 + expand * 2);
        ctx.fillRect(ox + gW - t, oy + t - expand, t + expand, gH - t * 2 + expand * 2);

        this._drawBrickLines(ctx, ox - expand, oy - expand, gW + expand * 2, gH + expand * 2, t + expand);

        const ms = (rx, ry, rw, rh, gx0, gy0, gx1, gy1) => {
            const sg = ctx.createLinearGradient(gx0, gy0, gx1, gy1);
            sg.addColorStop(0, 'rgba(0,0,0,0.38)');
            sg.addColorStop(1, 'rgba(0,0,0,0)');
            ctx.fillStyle = sg;
            ctx.fillRect(rx, ry, rw, rh);
        };

        ms(ox+t,       oy+t,       12,     gH-t*2, ox+t,       oy,        ox+t+12,    oy);
        ms(ox+gW-t-12, oy+t,       12,     gH-t*2, ox+gW-t-12, oy,        ox+gW-t,    oy);
        ms(ox+t,       oy+t,       gW-t*2, 12,     ox,         oy+t,      ox,         oy+t+12);
        ms(ox+t,       oy+gH-t-12, gW-t*2, 12,     ox,         oy+gH-t-12,ox,         oy+gH-t);

        ctx.restore();
    }

    _makeStonePattern(ctx) {
        const sz = 16;
        const pc = document.createElement('canvas');
        pc.width = sz;
        pc.height = sz;

        const px = pc.getContext('2d');
        const g = px.createLinearGradient(0, 0, sz, sz);
        g.addColorStop(0, '#787878');
        g.addColorStop(0.4, '#606060');
        g.addColorStop(1, '#505050');

        px.fillStyle = g;
        px.fillRect(0, 0, sz, sz);

        for (let i = 0; i < 20; i++) {
            px.beginPath();
            px.arc(Math.random()*sz, Math.random()*sz, 1+Math.random()*2.5, 0, Math.PI*2);
            const v = Math.random() > 0.5 ? 200 : 30;
            px.fillStyle = `rgba(${v},${v},${v},${0.08+Math.random()*0.13})`;
            px.fill();
        }
        return ctx.createPattern(pc, 'repeat');
    }

    _drawBrickLines(ctx, ox, oy, gW, gH, t) {
        const bW = 34, bH = 22;
        ctx.strokeStyle = 'rgba(25,25,25,0.55)';
        ctx.lineWidth = 1.5;

        const bricks = (rx, ry, rw, rh) => {
            ctx.save();
            ctx.beginPath();
            ctx.rect(rx, ry, rw, rh);
            ctx.clip();

            for (let row = 0; row * bH < rh + bH; row++) {
                const y = ry + row * bH;
                const off = (row % 2 === 0) ? 0 : bW / 2;

                ctx.beginPath();
                ctx.moveTo(rx, y);
                ctx.lineTo(rx + rw, y);
                ctx.stroke();

                for (let col = -1; col * bW < rw + bW; col++) {
                    const x = rx + off + col * bW;
                    ctx.beginPath();
                    ctx.moveTo(x, y);
                    ctx.lineTo(x, y + bH);
                    ctx.stroke();
                }
            }
            ctx.restore();
        };

        bricks(ox,          oy,          gW, t);
        bricks(ox,          oy + gH - t, gW, t);
        bricks(ox,          oy + t,      t,  gH - t * 2);
        bricks(ox + gW - t, oy + t,      t,  gH - t * 2);

        ctx.fillStyle = 'rgba(30,30,30,0.3)';
        [[ox,oy], [ox+gW-t,oy], [ox,oy+gH-t], [ox+gW-t,oy+gH-t]].forEach(([cx, cy]) => {
            ctx.fillRect(cx, cy, t, t);
        });
    }

    _drawSpotlights(ctx) {
        for (const c of this.circles) {
            const grad = ctx.createRadialGradient(c.x, c.y - c.r*0.15, c.r*0.05, c.x, c.y, c.r);
            grad.addColorStop(0,    c.color + 'cc');
            grad.addColorStop(0.55, c.color + '88');
            grad.addColorStop(1,    c.color + '18');

            ctx.save();
            ctx.beginPath();
            ctx.arc(c.x, c.y, c.r, 0, Math.PI * 2);
            ctx.fillStyle = grad;
            ctx.fill();

            ctx.beginPath();
            ctx.arc(c.x, c.y, c.r, 0, Math.PI * 2);
            ctx.strokeStyle = c.color + 'bb';
            ctx.lineWidth = 3;
            ctx.stroke();
            ctx.restore();
        }
    }

    _drawSafetyBanner(ctx, ox, oy, gW) {
        const safe = this.circles.find(c => c.safe);
        if (!safe) return;

        const t = this.wallThickness;
        const bw = 260, bh = 46;
        const bx = ox + (gW - bw) / 2;
        const by = oy + t + 8;

        ctx.save();
        ctx.shadowColor = 'rgba(0,0,0,0.35)';
        ctx.shadowBlur = 12;
        ctx.fillStyle = 'rgba(255,255,255,0.93)';
        ctx.beginPath();
        ctx.roundRect(bx, by, bw, bh, 10);
        ctx.fill();
        ctx.restore();

        ctx.save();
        ctx.fillStyle = safe.color;
        ctx.globalAlpha = 0.92;
        ctx.beginPath();
        ctx.roundRect(bx + 12, by + 10, 26, 26, 5);
        ctx.fill();
        ctx.restore();

        ctx.save();
        ctx.fillStyle = '#1a1a2e';
        ctx.font = "bold 15px 'Exo 2', sans-serif";
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText('STAY IN:', bx + 48, by + bh / 2);
        ctx.restore();

        ctx.save();
        ctx.fillStyle = safe.color;
        ctx.font = "900 15px 'Exo 2', sans-serif";
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText(safe.color.toUpperCase(), bx + 122, by + bh / 2);
        ctx.restore();
    }

    _drawRoundTimer(ctx, ox, oy, gW) {
        const now = performance.now();
        const remaining = Math.max(0, this.roundEndTime - now);
        const total = this._roundDuration();
        const frac  = remaining / total;
        const secs  = Math.ceil(remaining / 1000);

        const t  = this.wallThickness;
        const bx = ox + t + 8;
        const by = oy + t + 64;
        const bw = Math.min(240, gW / 3);
        const bh = 14;

        ctx.save();
        ctx.fillStyle = 'rgba(0,0,0,0.45)';
        ctx.beginPath();
        ctx.roundRect(bx, by, bw, bh, 7);
        ctx.fill();

        const r = frac < 0.5 ? Math.round(255 * (1 - frac * 2)) : 255;
        const g = frac > 0.5 ? Math.round(255 * ((frac - 0.5) * 2)) : 255;
        ctx.fillStyle = `rgb(${r},${g},0)`;

        ctx.beginPath();
        ctx.roundRect(bx, by, bw * frac, bh, 7);
        ctx.fill();

        ctx.strokeStyle = 'rgba(255,255,255,0.3)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.roundRect(bx, by, bw, bh, 7);
        ctx.stroke();

        ctx.font = "bold 12px 'Exo 2', sans-serif";
        ctx.fillStyle = 'rgba(255,255,255,0.85)';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'top';
        ctx.fillText(`${secs}s`, bx + bw + 7, by + 1);
        ctx.restore();
    }

    _drawGate(ctx) {
        const g = this.gateCircle, r = g.r, a = g.alpha;

        ctx.save();
        ctx.globalAlpha = a;

        const grad = ctx.createRadialGradient(g.x, g.y - r*0.1, r*0.05, g.x, g.y, r);
        grad.addColorStop(0,   'rgba(255,230,80,0.85)');
        grad.addColorStop(0.5, 'rgba(255,200,30,0.55)');
        grad.addColorStop(1,   'rgba(255,180,0,0.10)');

        ctx.beginPath();
        ctx.arc(g.x, g.y, r, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(g.x, g.y, r*0.65, Math.PI, 0, false);
        ctx.strokeStyle = '#ffe066';
        ctx.lineWidth = 4;
        ctx.stroke();

        const pW = r*0.12, pH = r*0.6;
        ctx.fillStyle = '#ffe066';
        ctx.fillRect(g.x - r*0.65, g.y, pW, pH);
        ctx.fillRect(g.x + r*0.65 - pW, g.y, pW, pH);

        ctx.beginPath();
        ctx.arc(g.x + r*0.65 - pW*0.5 - r*0.09*1.8, g.y + pH*0.38, r*0.09, 0, Math.PI * 2);
        ctx.fillStyle = '#fff176';
        ctx.fill();

        ctx.beginPath();
        ctx.arc(g.x, g.y, r, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(255,220,50,${a*0.9})`;
        ctx.lineWidth = 3;
        ctx.stroke();

        ctx.font = `bold ${Math.max(9, Math.floor(r*0.24))}px 'Exo 2', sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = '#fff';
        ctx.fillText('GATE', g.x, g.y + r*0.88);
        ctx.restore();

        const p = this._getPlayerCenter();
        if (p && this._dist(p.x, p.y, g.x, g.y) < r * 1.5) {
            const pulse = 0.7 + 0.3 * Math.sin(Date.now() / 250);
            ctx.save();
            ctx.globalAlpha = a * pulse;
            ctx.font = "900 14px 'Exo 2', sans-serif";
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';

            ctx.fillStyle = '#ffe066';
            ctx.beginPath();
            ctx.roundRect(g.x - 26, g.y - r - 28, 52, 24, 6);
            ctx.fill();

            ctx.fillStyle = '#1a1a2e';
            ctx.fillText('Press  E', g.x, g.y - r - 16);
            ctx.restore();
        }
    }

    _drawBreakBanner(ctx, ox, oy, gW, gH) {
        const bw = 320, bh = 70;
        const bx = ox + (gW - bw) / 2;
        const by = oy + (gH - bh) / 2 - 30;

        ctx.save();
        ctx.fillStyle = 'rgba(10,10,30,0.55)';
        ctx.beginPath();
        ctx.roundRect(bx, by, bw, bh, 14);
        ctx.fill();

        ctx.font = "900 28px 'Exo 2', sans-serif";
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = '#ffe066';
        ctx.fillText(`GET READY — ROUND ${this.round + 1}`, ox + gW / 2, by + bh / 2);
        ctx.restore();
    }

    _drawRoundCounter(ctx, ox, oy, gW) {
        const t = this.wallThickness;
        ctx.save();
        ctx.font = "bold 14px 'Exo 2', sans-serif";
        ctx.textAlign = 'right';
        ctx.textBaseline = 'top';
        ctx.fillStyle = 'rgba(255,255,255,0.80)';
        ctx.fillText(`ROUND ${this.round} / ${this.totalRounds}`, ox + gW - t - 8, oy + t + 4);
        ctx.restore();
    }

    _drawPlayerDot(ctx) {
        const p = this._getPlayerCenter();
        if (!p) return;

        ctx.save();
        ctx.beginPath();
        ctx.arc(p.x, p.y, 6, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255,255,255,0.9)';
        ctx.fill();

        ctx.strokeStyle = '#ff0';
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.restore();
    }

    _drawWinScreen(ctx, W, H) {
        ctx.fillStyle = 'rgba(5,5,20,0.88)';
        ctx.fillRect(0, 0, W, H);

        const ts = Date.now()/1000;
        const pulse = 0.85 + 0.15 * Math.sin(ts * 2.5);

        const bw = 520, bh = 220;
        const bx = (W - bw) / 2;
        const by = (H - bh) / 2;

        ctx.save();
        ctx.shadowColor = `rgba(80,220,120,${pulse})`;
        ctx.shadowBlur = 40 * pulse;

        const g = ctx.createLinearGradient(bx, by, bx + bw, by + bh);
        g.addColorStop(0, '#1a472a');
        g.addColorStop(0.5, '#2d6a4f');
        g.addColorStop(1, '#1b4332');

        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.roundRect(bx, by, bw, bh, 20);
        ctx.fill();

        ctx.strokeStyle = `rgba(80,220,120,${pulse*0.9})`;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.roundRect(bx, by, bw, bh, 20);
        ctx.stroke();
        ctx.restore();

        ctx.save();
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        ctx.font = "900 54px 'Exo 2', sans-serif";
        ctx.fillStyle = '#74c69d';
        ctx.fillText('YOU ESCAPED!', W / 2, by + 62);

        ctx.font = "bold 22px 'Exo 2', sans-serif";
        ctx.fillStyle = '#b7e4c7';
        ctx.fillText('You made it to the city!', W / 2, by + 106);

        ctx.font = "bold 16px 'Exo 2', sans-serif";
        ctx.fillStyle = 'rgba(183,228,199,0.7)';
        ctx.fillText(`Escaped through the gate on Round ${this.round}`, W / 2, by + 138);

        ctx.globalAlpha = 0.6 + 0.4 * Math.sin(Date.now() / 500);
        ctx.font = "bold 16px 'Exo 2', sans-serif";
        ctx.fillStyle = '#ffe066';
        ctx.fillText('Press any key or click to play again', W / 2, by + 178);
        ctx.restore();

        this._listenForRestart();
    }

    _drawDeathScreen(ctx, W, H) {
        ctx.fillStyle = 'rgba(20,0,0,0.88)';
        ctx.fillRect(0, 0, W, H);

        const ts = Date.now()/1000;
        const pulse = 0.8 + 0.2 * Math.sin(ts * 3);

        const bw = 520, bh = 220;
        const bx = (W - bw) / 2;
        const by = (H - bh) / 2;

        ctx.save();
        ctx.shadowColor = `rgba(220,30,30,${pulse})`;
        ctx.shadowBlur = 36 * pulse;

        const g = ctx.createLinearGradient(bx, by, bx + bw, by + bh);
        g.addColorStop(0, '#3d0000');
        g.addColorStop(0.5, '#6b1010');
        g.addColorStop(1, '#3d0000');

        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.roundRect(bx, by, bw, bh, 20);
        ctx.fill();

        ctx.strokeStyle = `rgba(220,30,30,${pulse*0.9})`;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.roundRect(bx, by, bw, bh, 20);
        ctx.stroke();
        ctx.restore();

        ctx.save();
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        ctx.font = "900 54px 'Exo 2', sans-serif";
        ctx.fillStyle = '#e63946';
        ctx.fillText('ELIMINATED', W / 2, by + 72);

        ctx.font = "bold 20px 'Exo 2', sans-serif";
        ctx.fillStyle = '#f4a0a0';
        ctx.fillText(`Outside the safe zone — Round ${this.round}`, W / 2, by + 122);

        ctx.globalAlpha = 0.6 + 0.4 * Math.sin(Date.now() / 500);
        ctx.font = "bold 16px 'Exo 2', sans-serif";
        ctx.fillStyle = '#ffe066';
        ctx.fillText('Press any key or click to try again', W / 2, by + 178);
        ctx.restore();

        this._listenForRestart();
    }

    destroy() {
        if (this._timer) clearTimeout(this._timer);
        if (this._animFrame) cancelAnimationFrame(this._animFrame);
        this._animFrame = null;

        if (this._physicsInterval) {
            clearInterval(this._physicsInterval);
            this._physicsInterval = null;
        }

        if (this._physKeyDown) {
            document.removeEventListener('keydown', this._physKeyDown);
            document.removeEventListener('keyup',   this._physKeyUp);
        }

        if (this.coinUpdateInterval) {
            clearInterval(this.coinUpdateInterval);
            this.coinUpdateInterval = null;
        }

        this._unbindGateKey();

        // ── Restore navbar / header elements ──
        if (this._hiddenEls) {
            this._hiddenEls.forEach(({ el, prev }) => { el.style.display = prev; });
            this._hiddenEls = [];
        }

        // ── Restore game container style ──
        if (this._gameContainer && this._gcOrigStyle !== undefined) {
            this._gameContainer.setAttribute('style', this._gcOrigStyle);
        }

        if (this.canvas && this.canvas.parentNode) {
            this.canvas.parentNode.removeChild(this.canvas);
        }

        document.documentElement.style.overflow = '';
        document.body.style.overflow = '';
        document.body.style.margin   = '';
        document.body.style.padding  = '';
    }
}

// ─────────────────────────────────────────────────────────────────────────────
class GameLevelZonecatch {
    constructor(gameEnv) {
        // Force the internal gameEnv tracking to snap to full screen dimensions
        if (gameEnv) {
            gameEnv.innerWidth = window.innerWidth;
            gameEnv.innerHeight = window.innerHeight;
        }

        const path   = gameEnv.path;
        const width  = window.innerWidth;
        const height = window.innerHeight;

        // ── Hide navbar early so engine sees the full viewport when it measures ──
        document.querySelectorAll('nav, header, .navbar, .site-header, #navbarNav, .top-nav, .site-nav').forEach(el => {
            el.style.display = 'none';
        });

        const bgData = {
            name: "custom_bg",
            src:  path + "/images/projects/gategame/bg/SciFiConsole.png",
            pixels: { height: 772, width: 1134 }
        };

        // ── Player — engine gravity OFF, custom physics loop handles it ────────
        // STEP_FACTOR is very high so the engine's built-in movement doesn't
        // fight with our custom physics loop.  The overlay's physics loop
        // handles all actual movement (gravity, jumping, platform collision).
        const playerData = {
            id: 'playerData',
            src: path + "/images/projects/gategame/sprites/slime.png",
            SCALE_FACTOR: 14,
            STEP_FACTOR: 999999,
            ANIMATION_RATE: 50,
            INIT_POSITION: { x: 80, y: height - 62 - 50 },
            GRAVITY: false,

            pixels: { height: 225, width: 225 },
            orientation: { rows: 4, columns: 4 },
            down:      { row: 0, start: 0, columns: 3 },
            downRight: { row: 1, start: 0, columns: 3, rotate:  Math.PI/16 },
            downLeft:  { row: 0, start: 0, columns: 3, rotate: -Math.PI/16 },

            left:      { row: 2, start: 0, columns: 3 },
            right:     { row: 1, start: 0, columns: 3 },
            up:        { row: 3, start: 0, columns: 3 },
            upLeft:    { row: 2, start: 0, columns: 3, rotate:  Math.PI/16 },

            upRight:   { row: 3, start: 0, columns: 3, rotate: -Math.PI/16 },
            hitbox: { widthPercentage: 0, heightPercentage: 0 },
            keypress: { up: 87, left: 65, down: 83, right: 68 }
        };

        const t = 48;

        // ── CLICKER: Power Core bonus (cookie-clicker mechanic) ───────────────
        const powerCoreClickerData = {
            id: 'PowerCore',
            greeting: false,
            src: path + "/images/projects/gategame/sprites/mastergate.png",
            SCALE_FACTOR: 18,
            ANIMATION_RATE: 100,
            INIT_POSITION: { x: Math.round(width * 0.5) - 64, y: Math.round(height * 0.12) },
            pixels: { height: 512, width: 512 },
            orientation: { rows: 1, columns: 1 },
            down:      { row: 0, start: 0, columns: 1 },
            right:     { row: 0, start: 0, columns: 1 },
            left:      { row: 0, start: 0, columns: 1 },
            up:        { row: 0, start: 0, columns: 1 },
            upRight:   { row: 0, start: 0, columns: 1 },
            downRight: { row: 0, start: 0, columns: 1 },
            upLeft:    { row: 0, start: 0, columns: 1 },
            downLeft:  { row: 0, start: 0, columns: 1 },
            hitbox: { widthPercentage: 1.0, heightPercentage: 1.0 },
            zIndex: 400,
            interact: function (clicks) {
                const CLICKS_PER_COIN = 4;
                const MAX_BONUS       = 20;
                if (typeof this._bonusCoinsGiven !== 'number') this._bonusCoinsGiven = 0;
                if (this._bonusCoinsGiven >= MAX_BONUS) return;
                if (clicks % CLICKS_PER_COIN === 0) {
                    if (gameEnv?.stats) {
                        gameEnv.stats.coinsCollected = (gameEnv.stats.coinsCollected || 0) + 1;
                    }
                    this._bonusCoinsGiven++;
                }
            }
        };

        this.classes = [
            { class: GameEnvBackground, data: bgData },
            { class: Coin, data: { id: 'coin1', INIT_POSITION: { x: 0.2, y: 0.2 }, value: 1, SCALE_FACTOR: 20 } },
            { class: Coin, data: { id: 'coin2', INIT_POSITION: { x: 0.8, y: 0.2 }, value: 1, SCALE_FACTOR: 20 } },
            { class: Coin, data: { id: 'coin3', INIT_POSITION: { x: 0.5, y: 0.8 }, value: 1, SCALE_FACTOR: 20 } },
            { class: Clicker, data: powerCoreClickerData },
            { class: Player,  data: playerData },
            // Walls are kept as invisible barriers for the engine's collision system
            { class: Barrier, data: { name: 'wallTop',    x: 0,       y: 0,        width: width,  height: t, visible: false } },
            { class: Barrier, data: { name: 'wallBottom', x: 0,       y: height-t, width: width,  height: t, visible: false } },
            { class: Barrier, data: { name: 'wallLeft',   x: 0,       y: t,        width: t,      height: height-t*2, visible: false } },
            { class: Barrier, data: { name: 'wallRight',  x: width-t, y: t,        width: t,      height: height-t*2, visible: false } },
        ];

        setTimeout(() => {
            if (gameEnv._zoneCatchOverlay) gameEnv._zoneCatchOverlay.destroy();
            gameEnv._zoneCatchOverlay = new ZoneCatchOverlay(gameEnv);
        }, 300);
    }
}

export default GameLevelZonecatch;