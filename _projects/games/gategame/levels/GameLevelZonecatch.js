// Adventure Game Custom Level — ZoneCatch

import GameEnvBackground from '@assets/js/GameEnginev1.1/essentials/GameEnvBackground.js';
import Player from '@assets/js/GameEnginev1.1/essentials/Player.js';
import Barrier from '@assets/js/GameEnginev1.1/essentials/Barrier.js';
import AiNpc from '@assets/js/GameEnginev1.1/essentials/AiNpc.js';
import GameStats from '@assets/js/GameEnginev1.1/essentials/GameStats.js';
import Coin from '@assets/js/GameEnginev1.1/Coin.js';

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
        // The HUD shows timer + coins + lives across all 3 levels.
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
        this.briefingActive = true;    // NEW: block intro + countdown until AI briefing dismissed

        this.baseRoundDuration = 7000;
        this.baseBreakDuration = 2800;
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
        // Show AI NPC briefing instead of immediately binding the skip-intro keys.
        // After the player clicks "Start Level", we jump straight to the countdown.
        this._showAiBriefing();

        if (!this._animFrame) {
            setTimeout(() => { 
                this._resize(); 
                this._loop(); 
            }, 150);
        }
    }

    // ── AI NPC pre-level briefing ─────────────────────────────────────────────
    _showAiBriefing() {
        const path = this.gameEnv?.path || '';

        const spriteData = {
            id: 'Zone Catch Referee',
            src: path + "@assets/js/projects/gategame/images/sprites/mastergate.png",
            pixels: { height: 512, width: 512 },
            orientation: { rows: 1, columns: 1 },
            down: { row: 0, start: 0, columns: 1 },

            expertise: 'zone catch survival challenge',
            chatHistory: [],
            dialogues: [
                "🎯 Welcome to Zone Catch! Each round, two coloured zones appear — a banner tells you which colour is SAFE. Move into the safe zone with W, A, S, D before the timer runs out. Standing outside it when time ends = eliminated! Survive, and from Round 6 a golden GATE will appear somewhere on the map. Reach it and press E to escape early. Ask me anything, then click Start Level!"
            ],
            knowledgeBase: {
                'zone catch survival challenge': [
                    { question: 'How do I know which zone is safe?',
                      answer:   'Look at the white banner at the top of the arena. It tells you the SAFE color. Move into the matching coloured zone before the timer runs out!' },
                    { question: 'What happens if I am not in the safe zone?',
                      answer:   'You get eliminated and lose one of your 3 lives. The game ends if you run out of lives across all levels.' },
                    { question: 'How do I move?',
                      answer:   'Use W, A, S, D to move in any direction. Speed matters — zones can be on opposite sides of the arena!' },
                    { question: 'What is the gate and when does it appear?',
                      answer:   'Starting from round 6, a golden GATE appears somewhere in the arena. Reach it and press E to win the game instantly — before you have to survive more rounds!' },
                    { question: 'How do I win?',
                      answer:   'Either reach the golden gate (appears from round 6) or survive as many rounds as you can. The leaderboard tracks your peak rounds survived!' }
                ]
            }
        };

        AiNpc.showLevelBriefing({
            spriteData,
            // Zone Catch's canvas overlay isn't a GameControl level — no pause needed.
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

        // Force exact window dimensions to guarantee walls wrap the true edges
        this._ox = 0;
        this._oy = 0;
        this._gW = window.innerWidth;
        this._gH = window.innerHeight;
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
        return Math.max(3800, this.baseRoundDuration - (this.round - 1) * 200);
    }

    _breakDuration()  { 
        return Math.max(1000, this.baseBreakDuration - this.round * 80);
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

        // Survived this round — record it as new peak if it exceeds prior record
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

    // ── Spawning — stored in CSS VIEWPORT pixels ──────────────────────────────
    _spawnCircles() {
        const a    = this._arena();
        const pair = this.colorPairs[Math.floor(Math.random() * this.colorPairs.length)];
        const shuffled = Math.random() < 0.5 ? pair : [pair[1], pair[0]];
        const safeIdx  = Math.floor(Math.random() * 2);

        // Fixed consistent base radius for original look
        const baseR = 85; 
        const margin = baseR + 20;

        // Fully random map spread
        let x0 = a.x + margin + Math.random() * (a.w - margin * 2);
        let y0 = a.y + margin + Math.random() * (a.h - margin * 2);
        
        let x1 = a.x + margin + Math.random() * (a.w - margin * 2);
        let y1 = a.y + margin + Math.random() * (a.h - margin * 2);

        this.circles = [
            { x: x0, y: y0, r: baseR, color: shuffled[0], safe: safeIdx === 0 },
            { x: x1, y: y1, r: baseR, color: shuffled[1], safe: safeIdx === 1 },
        ];
    }

    _spawnGate() {
        const a = this._arena();
        // Scale gate radius to arena size
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

    _getPlayerElement() {
        try {
            const gameObjects = this.gameEnv?.gameObjects;
            if (gameObjects) {
                const player = gameObjects.find(o => o && (
                    o.id             === 'playerData' ||
                    o.spriteData?.id === 'playerData' ||
                    o.data?.id       === 'playerData' ||
                    o.name           === 'playerData' ||
                    (o.keypress && o.element)
                ));

                if (player?.element) return player.element;
                if (player?.canvas) return player.canvas;
                if (player?.sprite) return player.sprite;
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

        const safe = this.circles.find(c =>  c.safe);
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

        // Record peak rounds survived (this round doesn't count since we died in it)
        GameStats.setZoneCatchRounds(Math.max(0, this.round - 1));

        // Lose a life. If this was the final life, GameStats shows its own
        // fullscreen game-over overlay — suppress our soft-restart listener
        // so the player can't accidentally bypass it.
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

        // Record the round we won on as the peak, then mark the full game complete.
        // GameStats.completeGame stops the timer, saves the run to the
        // leaderboard, and shows a victory overlay.
        GameStats.completeGame(this.round);

        // Suppress click-to-restart — the victory overlay has its own buttons.
        this._blockSoftRestart = true;
    }

    _softRestart() {
        if (this._timer) clearTimeout(this._timer);
        this._timer = null;
        
        this._reset();
        // User already saw the briefing on first load; skip it on restart
        this.briefingActive = false;
        this._bindIntroSkip();
    }

    _listenForRestart() {
        if (this._restartListening) return;
        // If the full game is over (all lives lost OR victory), don't offer
        // a soft restart — GameStats's overlay has the only way forward.
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
        this._resize();
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
            // Briefing is up — just draw a dark, clean background under the dialogue box
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

    _drawIntroScreen(ctx, W, H) {
        ctx.fillStyle = 'rgba(5,5,20,0.78)';
        ctx.fillRect(0, 0, W, H);
        
        const bw = 560, bh = 360, bx = (W - bw) / 2, by = (H - bh) / 2;
        
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
        ctx.fillText('ZONE CATCH', W / 2, by + 52);
        
        ctx.font = "bold 15px 'Exo 2', sans-serif"; 
        ctx.fillStyle = 'rgba(200,230,255,0.7)';
        ctx.fillText('Survive all 10 rounds to escape', W / 2, by + 88);
        
        const rules = [
            '🎯  Two coloured zones appear each round',
            '📢  The banner tells you which colour is SAFE',
            '🏃  Move into the safe zone before time runs out',
            '⚠️   Standing outside it when time ends = eliminated',
            '🚪  From Round 6 a golden GATE appears — reach it to win early',
        ];
        
        ctx.textAlign = 'left'; 
        ctx.font = "bold 14px 'Exo 2', sans-serif";
        rules.forEach((rule, i) => {
            ctx.fillStyle = i % 2 === 0 ? '#c8e6ff' : '#a0d4f5';
            ctx.fillText(rule, bx + 36, by + 134 + i * 34);
        });
        
        ctx.textAlign = 'center'; 
        ctx.font = "bold 13px 'Exo 2', sans-serif";
        ctx.fillStyle = 'rgba(180,200,220,0.6)';
        ctx.fillText('Move with  W A S D', W / 2, by + 318);
        
        const pulse = 0.6 + 0.4 * Math.sin(Date.now() / 500);
        ctx.globalAlpha = pulse; 
        ctx.font = "900 16px 'Exo 2', sans-serif";
        ctx.fillStyle = '#ffe066';
        ctx.fillText('PRESS ANY KEY OR CLICK TO BEGIN', W / 2, by + 348);
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
            src:  path + "@assets/js/projects/gategame/images/bg/SciFiConsole.png",
            pixels: { height: 772, width: 1134 }
        };

        const playerData = {
            id: 'playerData',
            src: path + "@assets/js/projects/gategame/images/sprites/slime.png",
            SCALE_FACTOR: 7, 
            STEP_FACTOR: 1400,
            ANIMATION_RATE: 50,
            INIT_POSITION: { x: 80, y: 247 },
            
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
        const makeWall = (name, x, y, w, h) => ({
            name, src: path + "@assets/js/projects/gategame/images/bg/SciFiConsole.png",
            SCALE_FACTOR: 1, pixels: { height: 1, width: 1 },
            INIT_POSITION: { x, y }, width: w, height: h, isBarrier: true
        });

        this.classes = [
            { class: GameEnvBackground, data: bgData },
            { class: Coin, data: { id: 'coin1', INIT_POSITION: { x: 0.2, y: 0.2 }, value: 1, SCALE_FACTOR: 20 } },
            { class: Coin, data: { id: 'coin2', INIT_POSITION: { x: 0.8, y: 0.2 }, value: 1, SCALE_FACTOR: 20 } },
            { class: Coin, data: { id: 'coin3', INIT_POSITION: { x: 0.5, y: 0.8 }, value: 1, SCALE_FACTOR: 20 } },
            { class: Player,            data: playerData },
            { class: Barrier, data: makeWall('wallTop',    0,        0,        width,  t) },
            { class: Barrier, data: makeWall('wallBottom', 0,        height-t, width,  t) },
            { class: Barrier, data: makeWall('wallLeft',   0,        t,        t,      height-t*2) },
            { class: Barrier, data: makeWall('wallRight',  width-t,  t,        t,      height-t*2) },
        ];

        setTimeout(() => {
            if (gameEnv._zoneCatchOverlay) gameEnv._zoneCatchOverlay.destroy();
            gameEnv._zoneCatchOverlay = new ZoneCatchOverlay(gameEnv);
        }, 300);
    }
}

export default GameLevelZonecatch;