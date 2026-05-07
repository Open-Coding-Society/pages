/**
 * GameStats.js - Persistent game statistics singleton
 *
 * Survives level transitions by attaching state to a single shared object.
 * Manages:
 *   - Game timer (continuous across all 3 levels)
 *   - Total coins (cumulative across levels)
 *   - Lives (3 total — 0 lives triggers full game reset)
 *   - Zone Catch rounds survived (peak value)
 *   - Player name (persisted in localStorage)
 *   - Persistent HUD DOM element (top of screen, all levels)
 *   - Leaderboard widget (toggleable via 🏆 button)
 *
 * USAGE from a level:
 *   import GameStats from './essentials/GameStats.js';
 *
 *   // In level constructor / initialize (safe to call many times):
 *   GameStats.bootstrap(() => {
 *       // fires once name entry is complete (or immediately if name is saved)
 *       this.showAiBriefing();
 *   });
 *   GameStats.onLevelStart();              // resets coin baseline for this level
 *   GameStats.startTimerIfNotStarted();    // starts global timer (idempotent)
 *
 *   // In level update() each frame:
 *   GameStats.trackLevelCoins(gameEnv.stats?.coinsCollected);
 *
 *   // On death / hit:
 *   const finalOver = GameStats.loseLife(); // returns true if lives hit 0
 *
 *   // On winning the final level:
 *   GameStats.completeGame(zoneCatchRound);
 */

import NameEntry from '@assets/js/GameEnginev1.1/essentials/NameEntry.js';
import GameLeaderboard from '@assets/js/GameEnginev1.1/essentials/GameLeaderboard.js';

const MAX_LIVES = 3;
const STORAGE_KEY_NAME = 'gategame_player_name';

class GameStatsSingleton {
    constructor() {
        // ── Timer ──────────────────────────────────────────────────────
        this._timerStart   = 0;
        this._elapsedMs    = 0;
        this._timerRunning = false;

        // ── Coins / lives / rounds ────────────────────────────────────
        this.totalCoins           = 0;
        this.lives                = MAX_LIVES;
        this.peakZoneCatchRounds  = 0;

        // Coin tracking internals: we watch gameEnv.stats.coinsCollected
        // each frame and add POSITIVE deltas to totalCoins. Levels reset
        // that field to 0 on load — that's fine, we just re-baseline.
        this._lastSeenLevelCoins = 0;

        // ── Player name ───────────────────────────────────────────────
        this.playerName = localStorage.getItem(STORAGE_KEY_NAME) || '';

        // ── State flags ───────────────────────────────────────────────
        this.isGameOver    = false;   // all lives lost
        this.isGameWon     = false;   // beat zone catch
        this._bootstrapped = false;

        // ── Ready promise (resolves once name entry is done) ──────────
        this._readyCallbacks = [];
        this._ready          = false;

        // ── UI elements ───────────────────────────────────────────────
        this.hudEl       = null;
        this.leaderboard = null;
        this._hudInterval = null;
    }

    // ══════════════════════════════════════════════════════════════════
    // BOOTSTRAP
    // ══════════════════════════════════════════════════════════════════

    /**
     * Initialize the singleton (idempotent). Creates HUD, leaderboard widget,
     * and shows the name-entry modal if no name is saved yet.
     *
     * @param {Function} [onReady] - callback fired once name entry is complete
     *                               (or immediately if a name is already saved)
     */
    bootstrap(onReady) {
        if (onReady) this._readyCallbacks.push(onReady);

        if (this._bootstrapped) {
            if (this._ready) this._flushReady();
            return;
        }
        this._bootstrapped = true;

        this._createHud();
        this._injectHudStyles();
        this.leaderboard = new GameLeaderboard();

        if (!this.playerName) {
            NameEntry.show(name => {
                this._setPlayerName(name);
                this._markReady();
            });
        } else {
            this._markReady();
        }
    }

    _markReady() {
        this._ready = true;
        this._flushReady();
    }

    _flushReady() {
        while (this._readyCallbacks.length) {
            const cb = this._readyCallbacks.shift();
            try { cb(); } catch (e) { console.error('GameStats onReady callback error:', e); }
        }
    }

    _setPlayerName(name) {
        this.playerName = name;
        localStorage.setItem(STORAGE_KEY_NAME, name);
        this._updateHud();
    }

    // ══════════════════════════════════════════════════════════════════
    // TIMER
    // ══════════════════════════════════════════════════════════════════

    startTimerIfNotStarted() {
        if (this._timerRunning) return;
        this._timerRunning = true;
        this._timerStart   = performance.now() - this._elapsedMs;
    }

    stopTimer() {
        if (!this._timerRunning) return;
        this._elapsedMs    = performance.now() - this._timerStart;
        this._timerRunning = false;
    }

    getElapsedMs() {
        return this._timerRunning
            ? performance.now() - this._timerStart
            : this._elapsedMs;
    }

    // ══════════════════════════════════════════════════════════════════
    // COINS
    // ══════════════════════════════════════════════════════════════════

    /**
     * Call on each level start to reset the coin tracking baseline.
     * Since every level starts with gameEnv.stats.coinsCollected = 0,
     * we reset our watcher too so we don't get a negative "delta".
     */
    onLevelStart() {
        this._lastSeenLevelCoins = 0;
        this._updateHud();
    }

    /**
     * Call every frame (or via polling) with the current level's coin count.
     * Adds the positive delta since last seen to the global total.
     * If the level resets its count to 0 (e.g. Zone Catch soft-restart),
     * we simply re-baseline without adding anything.
     */
    trackLevelCoins(currentLevelCount) {
        if (typeof currentLevelCount !== 'number') return;

        if (currentLevelCount < this._lastSeenLevelCoins) {
            this._lastSeenLevelCoins = currentLevelCount;
            return;
        }
        const delta = currentLevelCount - this._lastSeenLevelCoins;
        if (delta > 0) {
            this.totalCoins += delta;
            this._lastSeenLevelCoins = currentLevelCount;
            this._updateHud();
        }
    }

    // ══════════════════════════════════════════════════════════════════
    // LIVES
    // ══════════════════════════════════════════════════════════════════

    /**
     * Decrement lives by 1. Returns true if this was the final life
     * (caller should suppress its own death/restart UI in that case).
     */
    loseLife() {
        if (this.isGameOver) return true;

        this.lives = Math.max(0, this.lives - 1);
        this._updateHud();
        this._flashHudLives();

        if (this.lives === 0) {
            this.isGameOver = true;
            this.stopTimer();
            this._showGameOverScreen();
            return true;
        }
        return false;
    }

    // ══════════════════════════════════════════════════════════════════
    // ZONE CATCH ROUNDS
    // ══════════════════════════════════════════════════════════════════

    setZoneCatchRounds(round) {
        if (round > this.peakZoneCatchRounds) {
            this.peakZoneCatchRounds = round;
            this._updateHud();
        }
    }

    // ══════════════════════════════════════════════════════════════════
    // GAME COMPLETE (Zone Catch won)
    // ══════════════════════════════════════════════════════════════════

    completeGame(finalRound) {
        if (this.isGameWon || this.isGameOver) return;
        this.isGameWon = true;
        this.stopTimer();
        if (typeof finalRound === 'number') {
            this.setZoneCatchRounds(finalRound);
        }

        // Save to leaderboard
        const entry = GameLeaderboard.saveRun({
            name:   this.playerName || 'Player',
            timeMs: Math.round(this.getElapsedMs()),
            coins:  this.totalCoins,
            rounds: this.peakZoneCatchRounds
        });

        this._showVictoryScreen(entry);
    }

    // ══════════════════════════════════════════════════════════════════
    // HUD
    // ══════════════════════════════════════════════════════════════════

    _createHud() {
        document.getElementById('gamestats-hud')?.remove();
        const hud = document.createElement('div');
        hud.id = 'gamestats-hud';
        hud.innerHTML = `
            <div class="gs-cell">
                <span class="gs-label">⏱</span>
                <span class="gs-value" id="gs-timer">0:00</span>
            </div>
            <div class="gs-cell">
                <span class="gs-label">🪙</span>
                <span class="gs-value" id="gs-coins">0</span>
            </div>
            <div class="gs-cell">
                <span class="gs-label">❤</span>
                <span class="gs-value" id="gs-lives">❤❤❤</span>
            </div>
        `;
        document.body.appendChild(hud);
        this.hudEl = hud;

        // Drive timer display at 10fps — cheap, smooth enough
        if (this._hudInterval) clearInterval(this._hudInterval);
        this._hudInterval = setInterval(() => this._updateHud(), 100);
    }

    _updateHud() {
        if (!this.hudEl) return;

        const timerEl = document.getElementById('gs-timer');
        if (timerEl) timerEl.textContent = this._formatTime(this.getElapsedMs());

        const coinsEl = document.getElementById('gs-coins');
        if (coinsEl) coinsEl.textContent = String(this.totalCoins);

        const livesEl = document.getElementById('gs-lives');
        if (livesEl) {
            livesEl.textContent = '❤'.repeat(this.lives) + '♡'.repeat(MAX_LIVES - this.lives);
        }
    }

    _flashHudLives() {
        const livesEl = document.getElementById('gs-lives')?.parentElement;
        if (!livesEl) return;
        livesEl.classList.add('gs-flash');
        setTimeout(() => livesEl.classList.remove('gs-flash'), 600);
    }

    _formatTime(ms) {
        const totalSecs = Math.floor(ms / 1000);
        const m = Math.floor(totalSecs / 60);
        const s = totalSecs % 60;
        return `${m}:${String(s).padStart(2, '0')}`;
    }

    // ══════════════════════════════════════════════════════════════════
    // GAME OVER / VICTORY SCREENS
    // ══════════════════════════════════════════════════════════════════

    _showGameOverScreen() {
        document.getElementById('gs-overlay')?.remove();
        const overlay = document.createElement('div');
        overlay.id = 'gs-overlay';
        overlay.className = 'gs-endscreen gs-gameover';
        overlay.innerHTML = `
            <div class="gs-end-modal">
                <div class="gs-end-title">💀 GAME OVER</div>
                <div class="gs-end-subtitle">You lost all 3 lives</div>
                <div class="gs-end-stats">
                    <div><span class="gs-end-stat-label">Time:</span> <span class="gs-end-stat-value">${this._formatTime(this.getElapsedMs())}</span></div>
                    <div><span class="gs-end-stat-label">Coins:</span> <span class="gs-end-stat-value">${this.totalCoins} 🪙</span></div>
                    <div><span class="gs-end-stat-label">Rounds:</span> <span class="gs-end-stat-value">${this.peakZoneCatchRounds}</span></div>
                </div>
                <button class="gs-end-btn" id="gs-restart-btn">🔄 Restart from the Beginning</button>
            </div>
        `;
        document.body.appendChild(overlay);
        document.getElementById('gs-restart-btn').onclick = () => {
            window.location.reload();
        };
    }

    _showVictoryScreen(savedEntry) {
        document.getElementById('gs-overlay')?.remove();
        const overlay = document.createElement('div');
        overlay.id = 'gs-overlay';
        overlay.className = 'gs-endscreen gs-victory';
        overlay.innerHTML = `
            <div class="gs-end-modal">
                <div class="gs-end-title">🎉 YOU BEAT THE GAME!</div>
                <div class="gs-end-subtitle">Well played, ${this._escape(this.playerName || 'Player')}</div>
                <div class="gs-end-stats">
                    <div><span class="gs-end-stat-label">Time:</span> <span class="gs-end-stat-value">${GameLeaderboard.formatTime(savedEntry?.timeMs || 0)}</span></div>
                    <div><span class="gs-end-stat-label">Coins:</span> <span class="gs-end-stat-value">${this.totalCoins} 🪙</span></div>
                    <div><span class="gs-end-stat-label">Rounds:</span> <span class="gs-end-stat-value">${this.peakZoneCatchRounds}</span></div>
                </div>
                <div class="gs-end-saved">Saved to leaderboard ✓</div>
                <div class="gs-end-btn-row">
                    <button class="gs-end-btn gs-end-btn-primary" id="gs-view-lb">🏆 View Leaderboard</button>
                    <button class="gs-end-btn" id="gs-play-again">🔄 Play Again</button>
                </div>
            </div>
        `;
        document.body.appendChild(overlay);

        document.getElementById('gs-view-lb').onclick = () => {
            overlay.style.display = 'none';
            this.leaderboard?.open();
        };
        document.getElementById('gs-play-again').onclick = () => {
            window.location.reload();
        };
    }

    _escape(str) {
        return String(str).replace(/[&<>"']/g, m => ({
            '&': '&amp;', '<': '&lt;', '>': '&gt;',
            '"': '&quot;', "'": '&#39;'
        })[m]);
    }

    // ══════════════════════════════════════════════════════════════════
    // STYLES
    // ══════════════════════════════════════════════════════════════════

    _injectHudStyles() {
        if (document.getElementById('gamestats-styles')) return;
        const style = document.createElement('style');
        style.id = 'gamestats-styles';
        style.textContent = `
            #gamestats-hud {
                position: fixed;
                top: 80px;
                left: 50%;
                transform: translateX(-50%);
                display: flex;
                gap: 14px;
                padding: 8px 14px;
                background: rgba(10, 25, 45, 0.88);
                border: 2px solid #6cc6ff;
                border-radius: 10px;
                z-index: 10050;
                font-family: 'Press Start 2P', cursive, monospace;
                color: #e8f4ff;
                box-shadow: 0 0 14px rgba(108, 198, 255, 0.4);
                pointer-events: none;
            }
            #gamestats-hud .gs-cell {
                display: flex;
                align-items: center;
                gap: 6px;
                padding: 4px 10px;
                background: rgba(0, 0, 0, 0.35);
                border-radius: 6px;
                min-width: 68px;
                justify-content: center;
                transition: background 0.2s;
            }
            #gamestats-hud .gs-cell.gs-flash {
                background: rgba(230, 57, 70, 0.55);
                box-shadow: 0 0 10px rgba(230, 57, 70, 0.6);
            }
            #gamestats-hud .gs-label {
                font-size: 14px;
            }
            #gamestats-hud .gs-value {
                font-size: 13px;
                color: #ffe066;
                font-weight: bold;
            }

            /* Game over / victory end screens */
            .gs-endscreen {
                position: fixed; inset: 0;
                background: rgba(5, 10, 25, 0.92);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 13000;
                font-family: 'Press Start 2P', cursive, monospace;
                backdrop-filter: blur(5px);
            }
            .gs-end-modal {
                width: min(92%, 500px);
                padding: 32px 28px;
                text-align: center;
                border-radius: 14px;
                color: #e8f4ff;
            }
            .gs-gameover .gs-end-modal {
                background: linear-gradient(135deg, #3d0000 0%, #6b1010 100%);
                border: 2px solid #e63946;
                box-shadow: 0 0 40px rgba(230, 57, 70, 0.5);
            }
            .gs-victory .gs-end-modal {
                background: linear-gradient(135deg, #1a472a 0%, #2d6a4f 100%);
                border: 2px solid #74c69d;
                box-shadow: 0 0 40px rgba(116, 198, 157, 0.5);
            }
            .gs-end-title {
                font-size: 28px;
                margin-bottom: 10px;
            }
            .gs-gameover .gs-end-title { color: #ff9e9e; }
            .gs-victory .gs-end-title  { color: #74c69d; }
            .gs-end-subtitle {
                font-size: 12px;
                color: rgba(232, 244, 255, 0.75);
                margin-bottom: 22px;
            }
            .gs-end-stats {
                display: flex;
                flex-direction: column;
                gap: 8px;
                margin-bottom: 22px;
                padding: 14px 18px;
                background: rgba(0, 0, 0, 0.35);
                border-radius: 8px;
                font-size: 12px;
                line-height: 1.8;
            }
            .gs-end-stat-label { color: rgba(232, 244, 255, 0.6); }
            .gs-end-stat-value { color: #ffe066; font-weight: bold; }
            .gs-end-saved {
                font-size: 10px;
                color: #7fe38a;
                margin-bottom: 16px;
            }
            .gs-end-btn-row {
                display: flex;
                gap: 10px;
                justify-content: center;
                flex-wrap: wrap;
            }
            .gs-end-btn {
                padding: 12px 22px;
                font-family: inherit;
                font-size: 12px;
                color: #e8f4ff;
                background: rgba(0, 0, 0, 0.45);
                border: 2px solid #6cc6ff;
                border-radius: 6px;
                cursor: pointer;
                transition: transform 0.15s, background 0.15s;
            }
            .gs-end-btn:hover {
                background: rgba(108, 198, 255, 0.15);
                transform: scale(1.04);
            }
            .gs-end-btn-primary {
                background: rgba(255, 224, 102, 0.18);
                border-color: #ffe066;
                color: #ffe066;
            }
            .gs-end-btn-primary:hover {
                background: rgba(255, 224, 102, 0.28);
            }
        `;
        document.head.appendChild(style);
    }
}

// Singleton instance — shared across all imports.
const GameStats = new GameStatsSingleton();

// Expose on window for debugging.
if (typeof window !== 'undefined') {
    window.GameStats = GameStats;
}

export default GameStats;
