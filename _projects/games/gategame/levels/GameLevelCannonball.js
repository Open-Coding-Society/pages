// Cannonball Dodge Challenge — Gate Game level
// Rewritten to match v1.1 Adventure pattern used by EscapeRoom + ZoneCatch.
// Coin model for this level:
//   - NO walk-over coins. The only coin source is the BLINKING COIN-CLICKER
//     that appears and disappears around the arena every couple seconds.
//   - Click it while dodging cannonballs to rack up coins.
//
// ── LESSON INTEGRATION: collision_mechanics ───────────────────────────────────
// Adds visual collision feedback (red screen flash) and a hit counter when the
// cannonball strikes the player. Demonstrates the "collision response" pattern
// from the Enemy.js / Guard.js lesson — detecting overlap and reacting to it
// with game-state changes and visual effects.
// Reference: https://pages.opencodingsociety.com/collision_mechanics
// ──────────────────────────────────────────────────────────────────────────────

import GameEnvBackground from '@assets/js/GameEnginev1.1/essentials/GameEnvBackground.js';
import Player            from '@assets/js/GameEnginev1.1/essentials/Player.js';
import AiNpc             from '@assets/js/GameEnginev1.1/essentials/AiNpc.js';
import GameStats         from '@assets/js/GameEnginev1.1/GameStats.js';
import Clicker           from '@assets/js/GameEnginev1.1/essentials/Clicker.js';

class GameLevelCannonball {
    constructor(gameEnv) {
        this.gameEnv = gameEnv;
        this.path    = gameEnv.path;

        const width  = gameEnv.innerWidth  || 1134;
        const height = gameEnv.innerHeight || 772;

        // ── Game state ─────────────────────────────────────────────────────
        this.roundRunning      = false;
        this.dodgeWindowOpen   = false;
        this.collisionHappened = false;
        this.briefingComplete  = false;

        // ── Cannonball (lives in game-coord space; drawn inside container) ─
        this.cannonballEl    = null;
        this.cannonballSize  = Math.max(48, Math.round(height * 0.085));
        this.cannonballX     = -this.cannonballSize;
        this.cannonballY     = Math.round(height * 0.5);
        // Tuned so the ball sweeps the arena in ~1s at 60fps.
        this.cannonballSpeed = Math.max(10, Math.round(width / 70));

        // ── Gate / E-key / misc ────────────────────────────────────────────
        this.gateEl        = null;
        this._eKeyHandler  = null;
        this._coinInterval = null;

        // ── Blinking coin-clicker state ────────────────────────────────────
        this._blinkActive   = false;
        this._blinkTimeouts = [];
        this._blinkClicker  = null;

        // ── LESSON: collision_mechanics — hit counter & visual flash state ───
        this._totalHits  = 0;      // counts every cannonball collision
        this._flashEl    = null;   // DOM overlay for the red flash effect

        // ── Advance / reset geometry (all in game-coord space) ─────────────
        this.playerStartX = Math.round(width * 0.08);
        this.gateX        = Math.round(width * 0.68);                  // ← moved closer
        this.advanceStep  = Math.round((this.gateX - this.playerStartX) / 4);

        // ── Scene definitions ──────────────────────────────────────────────
        const bgData = {
            name: 'custom_bg',
            src:  this.path + '/images/projects/gategame/bg/CannonDesert.png',
            pixels: { height: 772, width: 1134 }
        };

        const playerData = {
            id: 'playerData',
            src: this.path + '/images/projects/gategame/sprites/slime.png',
            SCALE_FACTOR:   5,
            STEP_FACTOR:    1000,
            ANIMATION_RATE: 50,
            INIT_POSITION:  { x: this.playerStartX, y: Math.round(height * 0.5) },
            pixels:         { height: 225, width: 225 },
            orientation:    { rows: 4, columns: 4 },
            down:      { row: 0, start: 0, columns: 3 },
            downRight: { row: 1, start: 0, columns: 3, rotate:  Math.PI / 16 },
            downLeft:  { row: 0, start: 0, columns: 3, rotate: -Math.PI / 16 },
            left:      { row: 2, start: 0, columns: 3 },
            right:     { row: 1, start: 0, columns: 3 },
            up:        { row: 3, start: 0, columns: 3 },
            upLeft:    { row: 2, start: 0, columns: 3, rotate:  Math.PI / 16 },
            upRight:   { row: 3, start: 0, columns: 3, rotate: -Math.PI / 16 },
            hitbox:    { widthPercentage: 0.4, heightPercentage: 0.4 },
            keypress:  { up: 87, left: 65, down: 83, right: 68 }
        };

        // ── Blinking Coin Clicker (the ONLY coin source this level) ───────
        // 3 clicks = +1 coin, cap 40. Cycles: visible 2s → hidden 0.8s →
        // reposition + reappear. Clicker.draw() already renders a click
        // count overlay so the player can see progress at a glance.
        const clickerData = {
            id: 'BonusChest',
            greeting: false,
            src: this.path + '/images/projects/gategame/sprites/coin.png',
            SCALE_FACTOR: 30,                        // smaller — coin-sized
            ANIMATION_RATE: 100,
            INIT_POSITION: { x: 0.45, y: 0.30 },
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
            zIndex: 550,
            interact: function (clicks) {
                const CLICKS_PER_COIN = 3;
                const MAX_BONUS       = 40;
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
            { class: Player,            data: playerData },
            { class: Clicker,           data: clickerData }
        ];

        // Defer DOM / briefing setup until game objects exist.
        // NOTE: intentionally NO `initialize()` method — the engine
        // auto-calls initialize() which caused double-setup in the old code.
        setTimeout(() => this._boot(), 300);
    }

    // ── Helpers ────────────────────────────────────────────────────────────

    getPlayer() {
        if (!this.gameEnv?.gameObjects) return null;
        return this.gameEnv.gameObjects.find(o => o.constructor.name === 'Player');
    }

    getClicker() {
        if (!this.gameEnv?.gameObjects) return null;
        return this.gameEnv.gameObjects.find(
            o => o.constructor.name === 'Clicker' || o.spriteData?.id === 'BonusChest'
        );
    }

    // ── Lifecycle ──────────────────────────────────────────────────────────

    _boot() {
        this._createCannonballElement();
        this._createGateElement();
        this._registerEKey();

        // LESSON: collision_mechanics — create the red flash overlay & hit counter
        this._createCollisionFlash();
        this._createHitCounterHud();

        const player = this.getPlayer();
        if (player) this._lockPlayerToVertical(player);

        // Throttled coin tracking (matches EscapeRoom / ZoneCatch).
        this._coinInterval = setInterval(() => {
            GameStats.trackLevelCoins(this.gameEnv?.stats?.coinsCollected ?? 0);
        }, 150);

        // HUD / leaderboard / name entry → briefing → round loop.
        GameStats.bootstrap(() => {
            GameStats.onLevelStart();
            setTimeout(() => this._showAiBriefing(), 400);
        });
    }

    destroy() {
        this._stopClickerBlink();

        if (this._coinInterval) {
            clearInterval(this._coinInterval);
            this._coinInterval = null;
        }
        this.cannonballEl?.remove();
        this.cannonballEl = null;
        this.gateEl?.remove();
        this.gateEl = null;
        if (this._eKeyHandler) {
            document.removeEventListener('keydown', this._eKeyHandler);
            this._eKeyHandler = null;
        }

        // LESSON: collision_mechanics — remove flash overlay & hit counter
        this._flashEl?.remove();
        document.getElementById('cannonball-hitcount')?.remove();
    }

    // ── LESSON: collision_mechanics — visual collision feedback ────────────
    //
    // These methods implement the "collision response" pattern from the lesson:
    // when the cannonball AABB overlaps the player's hitbox, the game reacts
    // with a brief red screen flash (handleCollisionEvent analogy) and
    // increments a visible hit counter.

    /** Create a full-screen red overlay (hidden by default). */
    _createCollisionFlash() {
        document.getElementById('cannonball-flash')?.remove();
        const el = document.createElement('div');
        el.id = 'cannonball-flash';
        Object.assign(el.style, {
            position: 'fixed', inset: '0',
            background: 'rgba(230, 57, 70, 0.45)',
            pointerEvents: 'none',
            zIndex: '9998',
            opacity: '0',
            transition: 'opacity 0.25s ease-out'
        });
        document.body.appendChild(el);
        this._flashEl = el;
    }

    /** Flash the red overlay briefly — mirrors handleCollisionEvent(). */
    _triggerCollisionFlash() {
        if (!this._flashEl) return;
        this._flashEl.style.opacity = '1';
        setTimeout(() => {
            if (this._flashEl) this._flashEl.style.opacity = '0';
        }, 200);
    }

    /** Create a small hit-counter badge in the top-left. */
    _createHitCounterHud() {
        document.getElementById('cannonball-hitcount')?.remove();
        const el = document.createElement('div');
        el.id = 'cannonball-hitcount';
        Object.assign(el.style, {
            position: 'fixed', top: '120px', left: '18px',
            padding: '4px 12px',
            background: 'rgba(10, 25, 45, 0.85)',
            border: '1px solid #e63946',
            borderRadius: '6px',
            fontFamily: "'Press Start 2P', cursive, monospace",
            fontSize: '10px',
            color: '#ff9e9e',
            zIndex: '10050',
            pointerEvents: 'none'
        });
        el.textContent = 'Hits: 0';
        document.body.appendChild(el);
        this._hitCounterEl = el;
    }

    /** Update the hit counter display. */
    _updateHitCounter() {
        if (this._hitCounterEl) {
            this._hitCounterEl.textContent = `Hits: ${this._totalHits}`;
        }
    }

    // ── AI NPC pre-level briefing ─────────────────────────────────────────

    _showAiBriefing() {
        const spriteData = {
            id: 'Cannonball Coach',
            src: this.path + '/images/projects/gategame/sprites/mastergate.png',
            pixels: { height: 512, width: 512 },
            orientation: { rows: 1, columns: 1 },
            down: { row: 0, start: 0, columns: 1 },

            expertise: 'cannonball dodge challenge',
            chatHistory: [],
            dialogues: [
                "💣 Welcome to the Cannonball Dodge Challenge! Cannonballs fire from the right — dodge them with W and S to advance toward the gate. Get hit and you reset AND lose one of your 3 lives! All your coins come from the BLINKING COIN that pops up around the arena every couple seconds — mouse-click it fast before it disappears (every 3 clicks = +1 coin). Reach the gate, press E, then hit Esc to continue. Ask me anything, then hit Start Level!"
            ],
            knowledgeBase: {
                'cannonball dodge challenge': [
                    { question: 'How do I move in this level?',
                      answer:   'Use W to move up and S to move down. You can only move vertically — left and right are locked.' },
                    { question: 'What happens if a cannonball hits me?',
                      answer:   'You get reset to the start AND lose one of your 3 lives. Watch the hearts at the top of the screen.' },
                    { question: 'How do I collect coins?',
                      answer:   'The only coin source is the blinking coin. It appears somewhere random for about 2 seconds, then disappears. Mouse-click it — every 3 clicks awards 1 coin.' },
                    { question: 'How do I finish and go to the next level?',
                      answer:   'Reach the gate on the right, stand near it, press E, then press Esc to advance.' },
                    { question: 'Any tips for dodging?',
                      answer:   'Cannonballs fire in one of 3 vertical lanes. Watch the incoming lane and move before it reaches you. Keep an eye on the blinking coin between shots.' }
                ]
            }
        };

        AiNpc.showLevelBriefing({
            spriteData,
            gameControl: this.gameEnv?.gameControl || null,
            startButtonText: '▶  Start Dodging',
            onStart: () => {
                this.briefingComplete = true;
                GameStats.startTimerIfNotStarted();
                this.startRound();
                this._startClickerBlink();
            }
        });
    }

    // ── Blinking coin-clicker behavior ────────────────────────────────────

    _startClickerBlink() {
        const clicker = this.getClicker();
        if (!clicker || !clicker.canvas) {
            // Retry once the object is ready (sprite sheet may still be loading).
            this._blinkTimeouts.push(setTimeout(() => this._startClickerBlink(), 300));
            return;
        }

        this._blinkClicker = clicker;
        this._blinkActive  = true;

        // Start hidden, then fire the first appearance after a short grace
        // period so the player isn't ambushed at t=0.
        clicker.canvas.style.display = 'none';
        this._blinkTimeouts.push(setTimeout(() => this._blinkAppear(), 1500));
    }

    _stopClickerBlink() {
        this._blinkActive = false;
        this._blinkTimeouts.forEach(t => clearTimeout(t));
        this._blinkTimeouts = [];
        if (this._blinkClicker?.canvas) {
            this._blinkClicker.canvas.style.display = 'none';
        }
    }

    _blinkAppear() {
        if (!this._blinkActive || GameStats.isGameOver) return;
        const c = this._blinkClicker;
        if (!c || !c.canvas) return;

        // Pick a fresh random spot inside the arena (avoid gate + far edges).
        const w = this.gameEnv.innerWidth  || 1134;
        const h = this.gameEnv.innerHeight || 772;
        const xPct = 0.18 + Math.random() * 0.50;   // 0.18 → 0.68
        const yPct = 0.15 + Math.random() * 0.65;   // 0.15 → 0.80
        c.position.x = Math.round(xPct * w - (c.width  || 0) / 2);
        c.position.y = Math.round(yPct * h - (c.height || 0) / 2);

        // Show and schedule disappearance.
        c.canvas.style.display = 'block';
        this._blinkTimeouts.push(setTimeout(() => this._blinkDisappear(), 2000));
    }

    _blinkDisappear() {
        if (!this._blinkActive) return;
        const c = this._blinkClicker;
        if (c && c.canvas) c.canvas.style.display = 'none';
        this._blinkTimeouts.push(setTimeout(() => this._blinkAppear(), 800));
    }

    // ── Cannonball DOM element (anchored inside game container) ───────────

    _createCannonballElement() {
        const container = this.gameEnv?.container || document.body;
        document.getElementById('game-cannonball')?.remove();

        const img = document.createElement('img');
        img.id  = 'game-cannonball';
        img.src = this.path + '/images/projects/gategame/sprites/Cannonball.png';
        Object.assign(img.style, {
            position:      'absolute',
            width:         this.cannonballSize + 'px',
            height:        this.cannonballSize + 'px',
            objectFit:     'contain',
            left:          '-9999px',
            top:           '0px',
            zIndex:        '600',
            display:       'none',
            pointerEvents: 'none'
        });
        container.appendChild(img);
        this.cannonballEl = img;
    }

    _showCannonball(x, y) {
        this.cannonballX = x;
        this.cannonballY = y;
        if (this.cannonballEl) {
            this.cannonballEl.style.left    = x + 'px';
            this.cannonballEl.style.top     = ((this.gameEnv?.top || 0) + y) + 'px';
            this.cannonballEl.style.display = 'block';
        }
    }

    _hideCannonball() {
        if (this.cannonballEl) this.cannonballEl.style.display = 'none';
        this.cannonballX = -this.cannonballSize;
    }

    // ── Gate DOM element (anchored inside game container) ────────────────

    _createGateElement() {
        const container = this.gameEnv?.container || document.body;
        document.getElementById('game-gate')?.remove();

        const img = document.createElement('img');
        img.id  = 'game-gate';
        img.src = this.path + '/images/projects/gategame/sprites/mastergate.png';

        const innerH = this.gameEnv?.innerHeight || 772;
        const size   = Math.round(innerH * 0.22);
        const top    = Math.round(innerH * 0.38);

        Object.assign(img.style, {
            position:      'absolute',
            width:         size + 'px',
            height:        size + 'px',
            objectFit:     'contain',
            left:          this.gateX + 'px',
            top:           ((this.gameEnv?.top || 0) + top) + 'px',
            zIndex:        '500',
            pointerEvents: 'none'
        });
        container.appendChild(img);
        this.gateEl = img;
    }

    // ── Player movement lock (up / down only) ─────────────────────────────

    _lockPlayerToVertical(player) {
        player.updateVelocity = function () {
            this.velocity.x = 0;
            this.velocity.y = 0;
            this.moved = false;
            if (this.pressedKeys[this.keypress.up]) {
                this.velocity.y -= this.yVelocity;
                this.moved = true;
            } else if (this.pressedKeys[this.keypress.down]) {
                this.velocity.y += this.yVelocity;
                this.moved = true;
            }
        };
    }

    // ── E key → gate dialogue (all distances in game-coord space) ────────

    _registerEKey() {
        this._eKeyHandler = (e) => {
            if (e.key !== 'e' && e.key !== 'E') return;
            const player = this.getPlayer();
            if (!player || !this.gateEl) return;

            const gateW = parseInt(this.gateEl.style.width,  10) || 0;
            const gateH = parseInt(this.gateEl.style.height, 10) || 0;
            const gateStyleTop = parseInt(this.gateEl.style.top, 10) || 0;

            const gateCenterX   = this.gateX + gateW / 2;
            const gateCenterY   = (gateStyleTop - (this.gameEnv?.top || 0)) + gateH / 2;
            const playerCenterX = player.position.x + (player.width  || 0) / 2;
            const playerCenterY = player.position.y + (player.height || 0) / 2;

            const dist = Math.hypot(gateCenterX - playerCenterX, gateCenterY - playerCenterY);
            if (dist < 220) this._showGateDialogue();
        };
        document.addEventListener('keydown', this._eKeyHandler);
    }

    _showGateDialogue() {
        const dropdown = document.getElementById('promptDropDown');
        if (!dropdown) return;
        const coins = GameStats.totalCoins;
        dropdown.textContent = `Press Esc to go to the next level! (Total coins: ${coins} 🪙)`;
        Object.assign(dropdown.style, {
            display:         'block',
            padding:         '12px 20px',
            backgroundColor: 'rgba(0,0,0,0.85)',
            color:           'white',
            fontSize:        '18px',
            fontFamily:      'Arial, sans-serif',
            borderRadius:    '8px',
            position:        'fixed',
            bottom:          '80px',
            left:            '50%',
            transform:       'translateX(-50%)',
            zIndex:          '9999'
        });
        setTimeout(() => { dropdown.style.display = 'none'; }, 3000);
    }

    // ── UI overlays ───────────────────────────────────────────────────────

    showCountdown(seconds, callback) {
        const overlay = document.createElement('div');
        Object.assign(overlay.style, {
            position: 'fixed', top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: 'rgba(0,0,0,0.7)', color: 'white',
            padding: '40px 60px', borderRadius: '10px',
            fontSize: '72px', fontWeight: 'bold',
            fontFamily: 'Arial, sans-serif',
            zIndex: '9999', minWidth: '150px', textAlign: 'center'
        });
        overlay.textContent = seconds;
        document.body.appendChild(overlay);

        let count = seconds;
        const interval = setInterval(() => {
            count--;
            if (count > 0) {
                overlay.textContent = count;
            } else {
                clearInterval(interval);
                overlay.parentNode?.removeChild(overlay);
                callback?.();
            }
        }, 1000);
    }

    showMessage(text, type) {
        const msg = document.createElement('div');
        Object.assign(msg.style, {
            position: 'fixed', top: '60px', left: '50%',
            transform: 'translateX(-50%)',
            padding: '14px 32px', borderRadius: '6px',
            fontSize: '20px', fontWeight: 'bold',
            zIndex: '9998', fontFamily: 'Arial, sans-serif', color: 'white',
            backgroundColor: type === 'success' ? '#4CAF50' : '#e74c3c',
            boxShadow: '0 4px 12px rgba(0,0,0,0.4)'
        });
        msg.textContent = text;
        document.body.appendChild(msg);
        setTimeout(() => msg.parentNode?.removeChild(msg), 2000);
    }

    // ── Round logic ───────────────────────────────────────────────────────

    startRound() {
        if (GameStats.isGameOver) return;
        this.roundRunning      = true;
        this.dodgeWindowOpen   = false;
        this.collisionHappened = false;
        this.showCountdown(3, () => this.fireCannonball());
    }

    fireCannonball() {
        const h = this.gameEnv?.innerHeight || 772;
        const lanes = [
            Math.round(h * 0.22),
            Math.round(h * 0.50),
            Math.round(h * 0.78)
        ];
        const targetY = lanes[Math.floor(Math.random() * lanes.length)];
        const startX  = (this.gameEnv?.innerWidth || 1134) + 20;
        this._showCannonball(startX, targetY);
        this.dodgeWindowOpen   = true;
        this.collisionHappened = false;
    }

    _endRound() {
        if (!this.dodgeWindowOpen) return;
        this.dodgeWindowOpen = false;
        this._hideCannonball();

        const player = this.getPlayer();
        if (!player) return;

        if (this.collisionHappened) {
            // LESSON: collision_mechanics — visual feedback on collision
            this._totalHits++;
            this._triggerCollisionFlash();   // red screen flash
            this._updateHitCounter();        // update the Hits: N badge

            player.position.x = this.playerStartX;
            this.showMessage('💥 HIT!  Reset to start. -1 life', 'error');
            GameStats.loseLife();
        } else {
            const remaining = this.gateX - player.position.x;
            const advance   = Math.min(this.advanceStep, Math.max(0, remaining));
            player.position.x = Math.min(player.position.x + advance, this.gateX);
            this.showMessage(`✅ DODGED!  +${Math.round(advance)} px!`, 'success');
        }

        this.roundRunning = false;
        if (GameStats.isGameOver) return;
        setTimeout(() => this.startRound(), 1500);
    }

    // ── Game loop (engine calls this every frame via gameLevel.update) ────

    update() {
        if (!this.briefingComplete) return;
        if (GameStats.isGameOver) return;
        if (!this.dodgeWindowOpen) return;

        this.cannonballX -= this.cannonballSpeed;
        if (this.cannonballEl) {
            this.cannonballEl.style.left = this.cannonballX + 'px';
        }

        if (this.cannonballX < -(this.cannonballSize + 20)) {
            this._endRound();
            return;
        }

        if (!this.collisionHappened) {
            const player = this.getPlayer();
            if (player && this._collidesWithPlayer(player)) {
                this.collisionHappened = true;
                this._endRound();
            }
        }
    }

    _collidesWithPlayer(player) {
        // Both AABBs are in the same (game-coord) space now, so this is a
        // plain overlap test — no viewport/canvas coordinate mixing.
        const cb = {
            x:  this.cannonballX,
            y:  this.cannonballY,
            x2: this.cannonballX + this.cannonballSize,
            y2: this.cannonballY + this.cannonballSize
        };

        const pw = player.width  || 50;
        const ph = player.height || 50;
        const px = player.position.x;
        const py = player.position.y;

        const hbW = player.spriteData?.hitbox?.widthPercentage  ?? 0.4;
        const hbH = player.spriteData?.hitbox?.heightPercentage ?? 0.4;
        const sx  = pw * (1 - hbW) / 2;
        const sy  = ph * (1 - hbH) / 2;
        const pb  = { x: px + sx, y: py + sy, x2: px + pw - sx, y2: py + ph - sy };

        return !(cb.x2 < pb.x || cb.x > pb.x2 || cb.y2 < pb.y || cb.y > pb.y2);
    }
}

export default GameLevelCannonball;