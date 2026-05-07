// Cannonball Dodge Challenge
import GameEnvBackground from '@assets/js/GameEnginev1.1/essentials/GameEnvBackground.js';
import Player from '@assets/js/GameEnginev1.1/essentials/Player.js';
import AiNpc from '@assets/js/GameEnginev1.1/essentials/AiNpc.js';
import GameStats from '@assets/js/GameEnginev1.1/essentials/GameStats.js';
import Coin from '@assets/js/GameEnginev1.1/Coin.js';

class GameLevelCannonball {
    constructor(gameEnv) {
        this.gameEnv = gameEnv;
        this.path    = gameEnv.path;

        // ── Game state ──────────────────────────────────────────────────────
        this.roundRunning      = false;
        this.dodgeWindowOpen   = false;
        this.collisionHappened = false;
        this.briefingComplete  = false;   // NEW: don't start until AI briefing is dismissed

        // ── Cannonball ───────────────────────────────────────────────────────
        this.cannonballEl    = null;
        this.cannonballX     = -300;
        this.cannonballY     = 400;
        this.cannonballSpeed = 20;
        this.cannonballSize  = 64;

        // ── Gate (plain DOM img, no canvas/Npc class) ────────────────────────
        this.gateEl      = null;
        this._eKeyHandler = null;

        // ── Scene objects ───────────────────────────────────────────────────
        const bgData = {
            name: "custom_bg",
            src:  this.path + "@assets/js/projects/gategame/images/bg/CannonDefense.png",
            pixels: { height: 772, width: 1134 }
        };

        const playerData = {
            id: 'playerData',
            src: this.path + "@assets/js/projects/gategame/images/sprites/slime.png",
            SCALE_FACTOR:   5,
            STEP_FACTOR:    1000,
            ANIMATION_RATE: 50,
            INIT_POSITION:  { x: 100, y: 400 },
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

        // ── Coins ─ aligned to the 3 cannonball lanes (y) AND spread across the
        // player's dodge path (x). Player stops at x≈100, 400, 700, 900 in DOM
        // pixels, so coin x-percentages 0.15-0.80 all fall within reach. ──
        const coinPositions = [
            // Top lane
            { x: 0.20, y: 0.20 },
            { x: 0.40, y: 0.20 },
            { x: 0.60, y: 0.20 },
            { x: 0.80, y: 0.20 },
            // Middle lane
            { x: 0.20, y: 0.50 },
            { x: 0.40, y: 0.50 },
            { x: 0.60, y: 0.50 },
            { x: 0.80, y: 0.50 },
            // Bottom lane
            { x: 0.30, y: 0.75 },
            { x: 0.55, y: 0.75 },
            { x: 0.80, y: 0.75 },
        ];

        const coinClasses = coinPositions.map((pos, i) => ({
            class: Coin,
            data: {
                id: `coin_cannon_${i}`,
                greeting: false,
                INIT_POSITION: pos,
                SCALE_FACTOR: 18,
                hitbox: { widthPercentage: 1.0, heightPercentage: 1.0 },
                value: 1,
                zIndex: 450
            }
        }));

        this.classes = [
            { class: GameEnvBackground, data: bgData },
            { class: Player,            data: playerData },
            ...coinClasses
        ];

        // ── V1.1 compatibility: defer initialize() until game objects exist ──
        setTimeout(() => this.initialize(), 300);
    }

    // ── Helpers ──────────────────────────────────────────────────────────────

    getPlayer() {
        if (!this.gameEnv?.gameObjects) return null;
        return this.gameEnv.gameObjects.find(o => o.constructor.name === 'Player');
    }

    // ── Lifecycle ─────────────────────────────────────────────────────────────

    initialize() {
        this._createCannonballElement();
        this._createGateElement();
        this._registerEKey();

        const player = this.getPlayer();
        if (player) this._lockPlayerToVertical(player);

        // Bootstrap the persistent HUD, leaderboard, and (first time only) name entry.
        // The briefing + gameplay wait until name entry is complete.
        GameStats.bootstrap(() => {
            GameStats.onLevelStart();
            setTimeout(() => this.showAiBriefing(), 400);
        });
    }

    destroy() {
        this.cannonballEl?.remove();
        this.cannonballEl = null;

        this.gateEl?.remove();
        this.gateEl = null;

        if (this._eKeyHandler) {
            document.removeEventListener('keydown', this._eKeyHandler);
            this._eKeyHandler = null;
        }
    }

    // ── AI NPC pre-level briefing ─────────────────────────────────────────────

    showAiBriefing() {
        const spriteData = {
            id: 'Cannonball Coach',
            src: this.path + "@assets/js/projects/gategame/images/sprites/mastergate.png",
            // Sprite sheet hints (not required, used if avatar wants cropping)
            pixels: { height: 512, width: 512 },
            orientation: { rows: 1, columns: 1 },
            down: { row: 0, start: 0, columns: 1 },

            expertise: 'cannonball dodge challenge',
            chatHistory: [],
            dialogues: [
                "💣 Welcome to the Cannonball Dodge Challenge! Cannonballs fire from the right — dodge them to advance 300 pixels. Get hit and you're sent back to the start AND lose one of your 3 lives! Use W and S to move up and down. Collect golden coins along the way, then reach the gate, press E, and hit Esc to continue. Ask me anything, then hit Start Level when you're ready!"
            ],
            knowledgeBase: {
                'cannonball dodge challenge': [
                    { question: 'How do I move in this level?',
                      answer:   'Use W to move up and S to move down. You can only move vertically in this level — left and right are locked.' },
                    { question: 'What happens if a cannonball hits me?',
                      answer:   'You get reset to the start of the level AND lose one of your 3 lives. Watch the hearts at the top of the screen!' },
                    { question: 'How do I collect coins?',
                      answer:   'Just walk into them. The golden coins are scattered along your path and collect automatically when you touch them.' },
                    { question: 'How do I finish and go to the next level?',
                      answer:   'Reach the big gate on the right side of the screen, stand near it, press E, and then press Esc to advance.' },
                    { question: 'Any tips for dodging?',
                      answer:   'Cannonballs fire in one of 3 vertical lanes (top, middle, bottom). Watch the incoming cannonball and move to a different lane before it reaches you.' }
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
            }
        });
    }

    // ── Coin HUD ──────────────────────────────────────────────────────────────
    // (Removed — the global GameStats HUD at the top of the screen handles this now.)

    // ── Gate DOM element ──────────────────────────────────────────────────────

    _createGateElement() {
        document.getElementById('game-gate')?.remove();

        const img = document.createElement('img');
        img.id  = 'game-gate';
        img.src = this.path + "@assets/js/projects/gategame/images/sprites/mastergate.png";
        const size = Math.round(window.innerHeight * 0.20);
        Object.assign(img.style, {
            position:      'fixed',
            width:         size + 'px',
            height:        size + 'px',
            objectFit:     'contain',
            left:          Math.round(window.innerWidth * 0.62) + 'px',
            top:           Math.round(window.innerHeight * 0.35) + 'px',
            zIndex:        '500',
            pointerEvents: 'none'
        });
        document.body.appendChild(img);
        this.gateEl = img;
    }

    // ── E key → show dialogue in promptDropDown ───────────────────────────────

    _registerEKey() {
        this._eKeyHandler = (e) => {
            if (e.key !== 'e' && e.key !== 'E') return;

            const player = this.getPlayer();
            if (!player || !this.gateEl) return;

            // Get centres of player and gate
            const pr = player.canvas?.getBoundingClientRect();
            const gr = this.gateEl.getBoundingClientRect();
            if (!pr) return;

            const dist = Math.hypot(
                (pr.left + pr.width  / 2) - (gr.left + gr.width  / 2),
                (pr.top  + pr.height / 2) - (gr.top  + gr.height / 2)
            );

            if (dist < 250) {
                this._showGateDialogue();
            }
        };
        document.addEventListener('keydown', this._eKeyHandler);
    }

    _showGateDialogue() {
        // Use the game's built-in promptDropDown div from the page
        const dropdown = document.getElementById('promptDropDown');
        if (dropdown) {
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
    }

    // ── Cannonball DOM element ────────────────────────────────────────────────

    _createCannonballElement() {
        document.getElementById('game-cannonball')?.remove();

        const img = document.createElement('img');
        img.id  = 'game-cannonball';
        img.src = this.path + "/@assets/js/projects/gategame/images/sprites/Cannonball.png";
        Object.assign(img.style, {
            position:      'fixed',
            width:         this.cannonballSize + 'px',
            height:        this.cannonballSize + 'px',
            objectFit:     'contain',
            left:          '-300px',
            top:           '400px',
            zIndex:        '600',
            display:       'none',
            pointerEvents: 'none'
        });
        document.body.appendChild(img);
        this.cannonballEl = img;
    }

    _showCannonball(x, y) {
        this.cannonballX = x;
        this.cannonballY = y;
        if (this.cannonballEl) {
            this.cannonballEl.style.left    = x + 'px';
            this.cannonballEl.style.top     = y + 'px';
            this.cannonballEl.style.display = 'block';
        }
    }

    _hideCannonball() {
        if (this.cannonballEl) this.cannonballEl.style.display = 'none';
        this.cannonballX = -300;
    }

    // ── Player movement lock (up / down only) ─────────────────────────────────

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

    // ── UI overlays ───────────────────────────────────────────────────────────

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

    // ── Round logic ───────────────────────────────────────────────────────────

    startRound() {
        this.roundRunning      = true;
        this.dodgeWindowOpen   = false;
        this.collisionHappened = false;
        this.showCountdown(3, () => this.fireCannonball());
    }

    fireCannonball() {
        const vh    = window.innerHeight;
        const lanes = [
            Math.round(vh * 0.20),
            Math.round(vh * 0.50),
            Math.round(vh * 0.75)
        ];
        const targetY = lanes[Math.floor(Math.random() * lanes.length)];
        this._showCannonball(window.innerWidth + 20, targetY);
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
            player.x = 100;
            if (player.position) player.position.x = 100;
            this.showMessage('💥 HIT!  Reset to start. -1 life', 'error');
            GameStats.loseLife();
        } else {
            const advance = player.x >= 700 ? 200 : 300;
            player.x += advance;
            if (player.position) player.position.x = player.x;
            this.showMessage(`✅ DODGED!  +${advance} px!`, 'success');
        }

        this.roundRunning = false;
        // If all lives are lost, stop looping new rounds
        if (GameStats.isGameOver) return;
        setTimeout(() => this.startRound(), 2000);
    }

    // ── Game loop ─────────────────────────────────────────────────────────────

    update() {
        // Update global coin counter from this level's gameEnv stats
        GameStats.trackLevelCoins(this.gameEnv?.stats?.coinsCollected ?? 0);

        // Don't update anything until the AI briefing has been dismissed
        if (!this.briefingComplete) return;
        // Stop all further logic if game is over (all lives lost)
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
        const cb = {
            x:  this.cannonballX,
            y:  this.cannonballY,
            x2: this.cannonballX + this.cannonballSize,
            y2: this.cannonballY + this.cannonballSize
        };

        let px, py, pw, ph;
        if (player.canvas) {
            const r = player.canvas.getBoundingClientRect();
            px = r.left; py = r.top; pw = r.width; ph = r.height;
        } else {
            px = player.x ?? 0; py = player.y ?? 0; pw = 50; ph = 50;
        }

        const hbW = player.spriteData?.hitbox?.widthPercentage  ?? 0.4;
        const hbH = player.spriteData?.hitbox?.heightPercentage ?? 0.4;
        const sx  = pw * (1 - hbW) / 2;
        const sy  = ph * (1 - hbH) / 2;
        const pb  = { x: px + sx, y: py + sy, x2: px + pw - sx, y2: py + ph - sy };

        return !(cb.x2 < pb.x || cb.x > pb.x2 || cb.y2 < pb.y || cb.y > pb.y2);
    }
}

export default GameLevelCannonball;
