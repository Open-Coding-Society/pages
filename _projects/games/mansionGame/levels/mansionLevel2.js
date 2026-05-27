import GameEnvBackground from '@assets/js/GameEnginev1.1/essentials/GameEnvBackground.js';
import GameObject from '@assets/js/GameEnginev1.1/essentials/GameObject.js';
import Player from '@assets/js/GameEnginev1.1/essentials/Player.js';
import Npc from '@assets/js/GameEnginev1.1/essentials/Npc.js';
import DialogueSystem from '@assets/js/GameEnginev1.1/essentials/DialogueSystem.js';
import MansionLevel2_Cemetery from './mansionLevel2_Cemetery.js';

// ─── Reaper ────────────────────────────────────────────────────────────────────
class Reaper extends Npc {
    /**
     * Override to suppress any greeting / dialogue when the Reaper hits something.
     * Returning early before any super call that might open dialogue keeps the
     * game screen clean.
     */
    handleCollisionStart(other) {
        // Do nothing — intentionally blocks dialogue on collision.
    }

    update() {
        if (this.gameEnv?.gameControl?.isPaused) {
            this.draw();
            return;
        }

        if (this.isKilling) {
            super.update();
            return;
        }

        const players = this.gameEnv.gameObjects.filter(
            obj => obj instanceof Player
        );

        if (players.length > 0) {
            let nearest = players[0];
            let minDist = Infinity;

            for (const player of players) {
                const dx = player.position.x - this.position.x;
                const dy = player.position.y - this.position.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < minDist) {
                    minDist = dist;
                    nearest = player;
                }
            }

            const speed = this.spriteData?.speed ?? 1.1;
            const dx = nearest.position.x - this.position.x;
            const dy = nearest.position.y - this.position.y;
            const angle = Math.atan2(dy, dx);

            this.position.x += Math.cos(angle) * speed;
            this.position.y += Math.sin(angle) * speed;
        }

        super.update();
    }
}

// ─── HealthPlayer ──────────────────────────────────────────────────────────────
class HealthPlayer extends Player {
    constructor(data = null, gameEnv = null) {
        super(data, gameEnv);
        this.health = 100;
        this.reaperCollisionActive = false;

        // Push / repel ability — 5-second cooldown
        this.pushCooldown = 5000;        // ms
        this.lastPushTime = -Infinity;   // allow immediate first push
        this.pushRadius = 200;           // pixels
        this.pushForce = 300;            // pixels ejected per activation

        this._bindSpaceKey();
    }

    // ── Key binding ────────────────────────────────────────────────────────────
    _bindSpaceKey() {
        this._onKeyDown = (e) => {
            if (e.code === 'Space' || e.keyCode === 32) {
                e.preventDefault();
                this._activatePush();
            }
        };
        window.addEventListener('keydown', this._onKeyDown);
    }

    _unbindSpaceKey() {
        if (this._onKeyDown) {
            window.removeEventListener('keydown', this._onKeyDown);
            this._onKeyDown = null;
        }
    }

    // ── Push / repel ───────────────────────────────────────────────────────────
    _activatePush() {
        const now = performance.now();
        const elapsed = now - this.lastPushTime;
        const remaining = Math.ceil((this.pushCooldown - elapsed) / 1000);

        if (elapsed < this.pushCooldown) {
            this._showPushCooldownFeedback(remaining);
            return;
        }

        this.lastPushTime = now;

        const reapers = this.gameEnv.gameObjects.filter(
            obj => obj instanceof Reaper
        );

        for (const reaper of reapers) {
            const dx = reaper.position.x - this.position.x;
            const dy = reaper.position.y - this.position.y;
            const dist = Math.sqrt(dx * dx + dy * dy) || 1;

            if (dist <= this.pushRadius) {
                // Normalise and apply force
                reaper.position.x += (dx / dist) * this.pushForce;
                reaper.position.y += (dy / dist) * this.pushForce;
            }
        }

        this._showPushEffect();
        this._updatePushCooldownDisplay(true);

        // Refresh cooldown bar
        let start = performance.now();
        const tick = () => {
            const pct = Math.min((performance.now() - start) / this.pushCooldown, 1);
            this._updatePushCooldownDisplay(false, pct);
            if (pct < 1) requestAnimationFrame(tick);
            else this._updatePushCooldownDisplay(false, 1);
        };
        requestAnimationFrame(tick);
    }

    // ── HUD helpers ────────────────────────────────────────────────────────────
    updateHealthDisplay() {
        if (this.healthBarFill) {
            const pct = Math.max(0, this.health);
            this.healthBarFill.style.width = `${pct}%`;
            // colour shifts: green → yellow → red
            if (pct > 60) this.healthBarFill.style.background = '#4ade80';
            else if (pct > 30) this.healthBarFill.style.background = '#facc15';
            else this.healthBarFill.style.background = '#f87171';
        }
        if (this.healthLabel) {
            this.healthLabel.textContent = `HP: ${Math.max(0, this.health)}`;
        }
    }

    _updatePushCooldownDisplay(justActivated, pct = 0) {
        if (!this.pushReadyLabel || !this.pushCooldownFill) return;
        if (justActivated) {
            this.pushReadyLabel.textContent = 'PUSH [SPACE]';
            this.pushReadyLabel.style.opacity = '0.45';
            this.pushCooldownFill.style.width = '0%';
        } else {
            this.pushCooldownFill.style.width = `${pct * 100}%`;
            if (pct >= 1) {
                this.pushReadyLabel.textContent = '⚡ PUSH READY';
                this.pushReadyLabel.style.opacity = '1';
            }
        }
    }

    _showPushEffect() {
        const container = this.gameEnv?.container;
        if (!container) return;

        const ring = document.createElement('div');
        const size = this.pushRadius * 2;
        const cx = this.position.x + (this.width ?? 32) / 2;
        const cy = this.position.y + (this.height ?? 32) / 2;

        Object.assign(ring.style, {
            position: 'absolute',
            left: `${cx - this.pushRadius}px`,
            top: `${cy - this.pushRadius}px`,
            width: `${size}px`,
            height: `${size}px`,
            borderRadius: '50%',
            border: '3px solid rgba(139,92,246,0.85)',
            boxShadow: '0 0 20px rgba(139,92,246,0.6)',
            pointerEvents: 'none',
            zIndex: '9998',
            animation: 'pushRingExpand 0.4s ease-out forwards',
        });

        container.appendChild(ring);
        setTimeout(() => ring.remove(), 450);
    }

    _showPushCooldownFeedback(remaining) {
        if (!this.pushReadyLabel) return;
        this.pushReadyLabel.textContent = `⏳ ${remaining}s`;
        this.pushReadyLabel.style.color = '#f87171';
        setTimeout(() => {
            if (this.pushReadyLabel) {
                this.pushReadyLabel.style.color = '#c4b5fd';
            }
        }, 600);
    }

    // ── Screen shake ───────────────────────────────────────────────────────────
    triggerScreenShake() {
        const container = this.gameEnv?.container;
        if (!container || this.shakeInProgress) return;

        this.shakeInProgress = true;
        const intensity = 8;
        const frames = 8;
        let count = 0;

        const originalTransform = container.style.transform || '';
        const intervalId = setInterval(() => {
            const offsetX = Math.round((Math.random() - 0.5) * intensity);
            const offsetY = Math.round((Math.random() - 0.5) * intensity);
            container.style.transform = `${originalTransform} translate(${offsetX}px, ${offsetY}px)`;
            count += 1;
            if (count >= frames) {
                clearInterval(intervalId);
                container.style.transform = originalTransform;
                this.shakeInProgress = false;
            }
        }, 16);
    }

    // ── Collision ──────────────────────────────────────────────────────────────
    handleCollisionReaction(other) {
        const hitReaper = other?.id === 'Reaper' || other?.id === 'Reaper2';
        if (hitReaper && !this.reaperCollisionActive) {
            this.reaperCollisionActive = true;
            this.health = Math.max(0, this.health - 10);
            this.updateHealthDisplay();
            this.triggerScreenShake();

            if (this.health <= 0) {
                this.gameEnv._triggerGameOver?.();
            }
        }
        super.handleCollisionReaction(other);
    }

    update() {
        super.update();
        if (
            this.reaperCollisionActive &&
            !this.state.collisionEvents.includes('Reaper') &&
            !this.state.collisionEvents.includes('Reaper2')
        ) {
            this.reaperCollisionActive = false;
        }
    }

    handleCollisionState() {
        if (
            this.state.collisionEvents.includes('Reaper') ||
            this.state.collisionEvents.includes('Reaper2')
        ) {
            this.state.movement = { up: true, down: true, left: true, right: true };
            return;
        }
        if (typeof super.handleCollisionState === 'function') {
            super.handleCollisionState();
        }
    }

    destroy() {
        this._unbindSpaceKey();
        super.destroy?.();
    }
}

// ─── MansionLevel2 ────────────────────────────────────────────────────────────
class MansionLevel2 {
    constructor(gameEnv) {
        this.gameEnv = gameEnv;
        let width = gameEnv.innerWidth;
        let height = gameEnv.innerHeight;
        let path = gameEnv.path;

        // ── Background ─────────────────────────────────────────────────────────
        const image_background = path + "/images/projects/mansionGame/background.jpg";

        const image_data_background = {
            name: 'background',
            greeting: "You have entered the haunted graveyard. Beware!",
            src: image_background,
            pixels: { height: 1280, width: 720 }
        };

        // ── Player ─────────────────────────────────────────────────────────────
        const sprite_src_mc = path + "/images/projects/mansionGame/spookMcWalk.png";
        const MC_SCALE_FACTOR = 6;

        const sprite_data_player = {
            id: 'Spook',
            greeting: "Hi, I am Spook.",
            src: sprite_src_mc,
            SCALE_FACTOR: MC_SCALE_FACTOR,
            STEP_FACTOR: 800,
            ANIMATION_RATE: 10,

            INIT_POSITION: {
                x: 50,
                y: height - (height / MC_SCALE_FACTOR)
            },

            pixels: { height: 2400, width: 3600 },
            orientation: { rows: 2, columns: 3 },

            down: { row: 1, start: 0, columns: 3 },
            downRight: { row: 1, start: 0, columns: 3, rotate: Math.PI / 16 },
            downLeft: { row: 0, start: 0, columns: 3, rotate: -Math.PI / 16 },

            left: { row: 0, start: 0, columns: 3 },
            right: { row: 1, start: 0, columns: 3 },

            up: { row: 1, start: 0, columns: 3 },
            upLeft: { row: 0, start: 0, columns: 3, rotate: Math.PI / 16 },
            upRight: { row: 1, start: 0, columns: 3, rotate: -Math.PI / 16 },

            hitbox: {
                widthPercentage: 0.45,
                heightPercentage: 0.2
            },

            keypress: {
                up: 87,
                left: 65,
                down: 83,
                right: 68
            }
        };

        // ── Reapers ────────────────────────────────────────────────────────────
        const sprite_src_reaper = path + "/images/projects/mansionGame/Reaper.png";

        const sprite_data_reaper = {
            id: "Reaper",
            greeting: "",          // silenced
            src: sprite_src_reaper,
            SCALE_FACTOR: 5,
            ANIMATION_RATE: 0,
            speed: 1.1,
            pixels: { height: 256, width: 256 },
            INIT_POSITION: { x: width * 0.8, y: height * 0.2 },
            orientation: { rows: 1, columns: 1 },
            hitbox: { widthPercentage: 0.4, heightPercentage: 0.4 },
            zIndex: 10,
            isKilling: false,
        };

        const sprite_data_reaper_slow = {
            id: "Reaper2",
            greeting: "",          // silenced
            src: sprite_src_reaper,
            SCALE_FACTOR: 5,
            ANIMATION_RATE: 0,
            speed: 0.3,
            pixels: { height: 256, width: 256 },
            INIT_POSITION: { x: width * 0.2, y: height * 0.5 },
            orientation: { rows: 1, columns: 1 },
            hitbox: { widthPercentage: 0.4, heightPercentage: 0.4 },
            zIndex: 10,
            isKilling: false,
        };

        this.classes = [
            { class: GameEnvBackground, data: image_data_background },
            { class: HealthPlayer, data: sprite_data_player },
            { class: Reaper, data: sprite_data_reaper },
            { class: Reaper, data: sprite_data_reaper_slow }
        ];

        // Survival timer state
        this._survivalDuration = 30_000;  // 30 seconds in ms
        this._startTime = null;
        this._timerInterval = null;
        this._gameEnded = false;
    }

    // ── Lifecycle ──────────────────────────────────────────────────────────────
    initialize() {
        this._injectGlobalStyles();
        this.setupHUD();

        // Expose game-over callback on gameEnv so HealthPlayer can call it
        this.gameEnv._triggerGameOver = () => this._showGameOver();

        // Start survival countdown
        this._startTime = performance.now();
        this._timerInterval = setInterval(() => {
            if (this._gameEnded) return;

            const elapsed = performance.now() - this._startTime;
            const remaining = Math.max(0, Math.ceil((this._survivalDuration - elapsed) / 1000));

            if (this.timerLabel) {
                this.timerLabel.textContent = `⏱ ${remaining}s`;
            }

            if (elapsed >= this._survivalDuration) {
                clearInterval(this._timerInterval);
                this._showWin();
            }
        }, 250);

        console.log("MansionLevel2 initialized");
    }

    destroy() {
        clearInterval(this._timerInterval);
        this._gameEnded = true;
        this._removeOverlay();
        if (this.gameEnv?.container && this.hudElement) {
            if (this.gameEnv.container.contains(this.hudElement)) {
                this.gameEnv.container.removeChild(this.hudElement);
            }
        }
    }

    // ── Global CSS injected once ───────────────────────────────────────────────
    _injectGlobalStyles() {
        if (document.getElementById('mansion-level2-styles')) return;
        const style = document.createElement('style');
        style.id = 'mansion-level2-styles';
        style.textContent = `
            @import url('https://fonts.googleapis.com/css2?family=Creepster&family=Raleway:wght@400;700&display=swap');

            @keyframes pushRingExpand {
                from { transform: scale(0.3); opacity: 1; }
                to   { transform: scale(1.6); opacity: 0; }
            }

            @keyframes overlayFadeIn {
                from { opacity: 0; transform: scale(0.94); }
                to   { opacity: 1; transform: scale(1); }
            }

            @keyframes flicker {
                0%, 100% { opacity: 1; }
                45%       { opacity: 0.85; }
                50%       { opacity: 0.55; }
                55%       { opacity: 0.9; }
            }

            @keyframes hudSlideIn {
                from { opacity: 0; transform: translateY(-12px); }
                to   { opacity: 1; transform: translateY(0); }
            }

            .mansion-overlay {
                position: absolute;
                inset: 0;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                z-index: 99999;
                animation: overlayFadeIn 0.5s ease-out forwards;
                font-family: 'Creepster', cursive;
            }

            .mansion-overlay-title {
                font-size: clamp(48px, 10vw, 96px);
                letter-spacing: 6px;
                text-shadow: 0 0 30px currentColor;
                animation: flicker 3s infinite;
                margin-bottom: 16px;
            }

            .mansion-overlay-sub {
                font-family: 'Raleway', sans-serif;
                font-size: clamp(14px, 2.5vw, 20px);
                letter-spacing: 2px;
                opacity: 0.75;
                margin-bottom: 40px;
                text-align: center;
                padding: 0 24px;
            }

            .mansion-overlay-btn {
                font-family: 'Raleway', sans-serif;
                font-size: 16px;
                font-weight: 700;
                letter-spacing: 3px;
                text-transform: uppercase;
                padding: 14px 36px;
                border: 2px solid currentColor;
                border-radius: 4px;
                cursor: pointer;
                background: transparent;
                transition: background 0.2s, color 0.2s;
            }

            .mansion-hud {
                position: absolute;
                top: 16px;
                left: 16px;
                display: flex;
                flex-direction: column;
                gap: 8px;
                z-index: 9999;
                pointer-events: none;
                animation: hudSlideIn 0.4s ease-out forwards;
                font-family: 'Raleway', sans-serif;
            }

            .mansion-hud-row {
                display: flex;
                align-items: center;
                gap: 8px;
                background: rgba(0,0,0,0.6);
                border-radius: 6px;
                padding: 6px 10px;
                backdrop-filter: blur(4px);
            }

            .mansion-hud-label {
                font-size: 12px;
                color: #e2e8f0;
                letter-spacing: 1px;
                text-transform: uppercase;
                min-width: 44px;
            }

            .mansion-bar-track {
                width: 120px;
                height: 8px;
                background: rgba(255,255,255,0.12);
                border-radius: 4px;
                overflow: hidden;
            }

            .mansion-bar-fill {
                height: 100%;
                border-radius: 4px;
                transition: width 0.2s ease, background 0.4s ease;
            }

            .mansion-timer-label {
                font-size: 14px;
                color: #cbd5e1;
                letter-spacing: 2px;
                min-width: 60px;
            }

            .mansion-push-label {
                font-size: 11px;
                letter-spacing: 1px;
                color: #c4b5fd;
                min-width: 96px;
                transition: color 0.3s;
            }
        `;
        document.head.appendChild(style);
    }

    // ── HUD ────────────────────────────────────────────────────────────────────
    setupHUD() {
        const player = this.gameEnv.gameObjects.find(obj => obj instanceof HealthPlayer);

        const hud = document.createElement('div');
        hud.className = 'mansion-hud';

        // — Health bar row
        const healthRow = document.createElement('div');
        healthRow.className = 'mansion-hud-row';

        const healthLabel = document.createElement('span');
        healthLabel.className = 'mansion-hud-label';
        healthLabel.textContent = 'HP';

        const healthTrack = document.createElement('div');
        healthTrack.className = 'mansion-bar-track';

        const healthFill = document.createElement('div');
        healthFill.className = 'mansion-bar-fill';
        healthFill.style.width = '100%';
        healthFill.style.background = '#4ade80';

        const healthNum = document.createElement('span');
        healthNum.className = 'mansion-hud-label';
        healthNum.textContent = '100';

        healthTrack.appendChild(healthFill);
        healthRow.append(healthLabel, healthTrack, healthNum);

        // — Timer row
        const timerRow = document.createElement('div');
        timerRow.className = 'mansion-hud-row';

        const timerLabel = document.createElement('span');
        timerLabel.className = 'mansion-timer-label';
        timerLabel.textContent = '⏱ 30s';

        timerRow.appendChild(timerLabel);

        // — Push cooldown row
        const pushRow = document.createElement('div');
        pushRow.className = 'mansion-hud-row';

        const pushReadyLabel = document.createElement('span');
        pushReadyLabel.className = 'mansion-push-label';
        pushReadyLabel.textContent = '⚡ PUSH READY';

        const pushTrack = document.createElement('div');
        pushTrack.className = 'mansion-bar-track';

        const pushFill = document.createElement('div');
        pushFill.className = 'mansion-bar-fill';
        pushFill.style.width = '100%';
        pushFill.style.background = '#a78bfa';

        pushTrack.appendChild(pushFill);
        pushRow.append(pushReadyLabel, pushTrack);

        hud.append(healthRow, timerRow, pushRow);
        this.gameEnv.container.appendChild(hud);

        this.hudElement = hud;
        this.timerLabel = timerLabel;

        if (player) {
            player.healthBarFill = healthFill;
            player.healthLabel = healthNum;
            player.pushReadyLabel = pushReadyLabel;
            player.pushCooldownFill = pushFill;
        }
    }

    // ── Game Over ──────────────────────────────────────────────────────────────
    _showGameOver() {
        if (this._gameEnded) return;
        this._gameEnded = true;
        clearInterval(this._timerInterval);

        // Pause the game if possible
        if (this.gameEnv?.gameControl) {
            this.gameEnv.gameControl.isPaused = true;
        }

        const overlay = document.createElement('div');
        overlay.className = 'mansion-overlay';
        overlay.id = 'mansion-overlay';
        overlay.style.background = 'radial-gradient(ellipse at center, rgba(80,0,0,0.97) 0%, rgba(10,0,0,0.98) 100%)';

        const title = document.createElement('div');
        title.className = 'mansion-overlay-title';
        title.style.color = '#ff4444';
        title.textContent = 'GAME OVER';

        const sub = document.createElement('div');
        sub.className = 'mansion-overlay-sub';
        sub.style.color = '#ffaaaa';
        sub.textContent = 'The Reaper claimed your soul. You were not ready for the graveyard.';

        const btn = document.createElement('button');
        btn.className = 'mansion-overlay-btn';
        btn.style.color = '#ff4444';
        btn.textContent = 'TRY AGAIN';
        btn.addEventListener('mouseenter', () => {
            btn.style.background = '#ff4444';
            btn.style.color = '#000';
        });
        btn.addEventListener('mouseleave', () => {
            btn.style.background = 'transparent';
            btn.style.color = '#ff4444';
        });
        btn.addEventListener('click', () => this._resetGame());

        overlay.append(title, sub, btn);
        this.gameEnv.container.appendChild(overlay);
    }

    // ── Reset / Retry ──────────────────────────────────────────────────────────
    _resetGame() {
        this._removeOverlay();
        this._gameEnded = false;

        // ── Reset player health + collision state ──────────────────────────────
        const player = this.gameEnv.gameObjects.find(obj => obj instanceof HealthPlayer);
        if (player) {
            player.health = 100;
            player.reaperCollisionActive = false;
            player.lastPushTime = -Infinity;           // push ready immediately
            player.updateHealthDisplay();
            player._updatePushCooldownDisplay(false, 1); // bar full

            // Return player to start position
            const initPos = player.spriteData?.INIT_POSITION;
            if (initPos) {
                player.position.x = initPos.x;
                player.position.y = initPos.y;
            }
        }

        // ── Return reapers to their start positions ────────────────────────────
        const reapers = this.gameEnv.gameObjects.filter(obj => obj instanceof Reaper);
        for (const reaper of reapers) {
            const initPos = reaper.spriteData?.INIT_POSITION;
            if (initPos) {
                reaper.position.x = initPos.x;
                reaper.position.y = initPos.y;
            }
        }

        // ── Reset survival timer ───────────────────────────────────────────────
        clearInterval(this._timerInterval);
        this._startTime = performance.now();

        if (this.timerLabel) this.timerLabel.textContent = '⏱ 30s';

        this._timerInterval = setInterval(() => {
            if (this._gameEnded) return;

            const elapsed = performance.now() - this._startTime;
            const remaining = Math.max(0, Math.ceil((this._survivalDuration - elapsed) / 1000));

            if (this.timerLabel) this.timerLabel.textContent = `⏱ ${remaining}s`;

            if (elapsed >= this._survivalDuration) {
                clearInterval(this._timerInterval);
                this._showWin();
            }
        }, 250);

        // ── Unpause ────────────────────────────────────────────────────────────
        if (this.gameEnv?.gameControl) {
            this.gameEnv.gameControl.isPaused = false;
        }
    }

    // ── You Win ────────────────────────────────────────────────────────────────
    _showWin() {
        if (this._gameEnded) return;
        this._gameEnded = true;

        if (this.gameEnv?.gameControl) {
            this.gameEnv.gameControl.isPaused = true;
        }

        const overlay = document.createElement('div');
        overlay.className = 'mansion-overlay';
        overlay.id = 'mansion-overlay';
        overlay.style.background = 'radial-gradient(ellipse at center, rgba(0,50,20,0.97) 0%, rgba(0,10,5,0.98) 100%)';

        const title = document.createElement('div');
        title.className = 'mansion-overlay-title';
        title.style.color = '#4ade80';
        title.textContent = 'YOU SURVIVED';

        const sub = document.createElement('div');
        sub.className = 'mansion-overlay-sub';
        sub.style.color = '#bbf7d0';
        sub.textContent = 'Against all odds, you endured 30 seconds in the haunted graveyard. The Reapers retreat… for now.';

        const btn = document.createElement('button');
        btn.className = 'mansion-overlay-btn';
        btn.style.color = '#4ade80';
        btn.textContent = 'NEXT LEVEL';
        btn.addEventListener('mouseenter', () => {
            btn.style.background = '#4ade80';
            btn.style.color = '#000';
        });
        btn.addEventListener('mouseleave', () => {
            btn.style.background = 'transparent';
            btn.style.color = '#4ade80';
        });
        btn.addEventListener('click', () => {
            this._removeOverlay();
            const gc = this.gameEnv?.gameControl;
            if (!gc) return;

            gc.isPaused = false;

            const hasNextLevel = gc.currentLevelIndex < gc.levelClasses.length - 1;
            if (hasNextLevel) {
                // Advance to the next level in GameControl's ordered list,
                // then call transitionToLevel() which destroys the current
                // level, creates the next one, and restarts the game loop —
                // exactly what GameControl.handleLevelEnd() does internally.
                gc.currentLevelIndex++;
                gc.transitionToLevel();
            } else {
                // This was the last level — signal normal game completion so
                // GameControl.handleLevelEnd() can fire the gameOver callback.
                if (gc.currentLevel) gc.currentLevel.continue = false;
            }
        });

        overlay.append(title, sub, btn);
        this.gameEnv.container.appendChild(overlay);
    }

    _removeOverlay() {
        const overlay = document.getElementById('mansion-overlay');
        if (overlay) overlay.remove();
    }
}

export default MansionLevel2;