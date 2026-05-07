/**
 * GameLeaderboard.js - 3-column leaderboard widget for the GateGame
 *
 * Displays top scores in three categories:
 *   1. Fastest Time  (lowest ms to beat the entire game)
 *   2. Most Coins    (highest total across all 3 levels)
 *   3. Most Rounds   (Zone Catch only)
 *
 * Uses localStorage for persistence (no backend required).
 * Renders as a small trigger button in the top-right; clicking opens a modal.
 */

const STORAGE_KEY = 'gategame_leaderboard_v1';
const TOP_N = 10;

class GameLeaderboard {
    constructor() {
        this._injectStyles();
        this._createTrigger();
        this._createModal();
        this.isOpen = false;
    }

    /**
     * Public: save a completed run to the leaderboard.
     * @param {Object} run - { name, timeMs, coins, rounds }
     */
    static saveRun(run) {
        if (!run || !run.name) return null;
        const entries = GameLeaderboard.getEntries();
        const entry = {
            id: 'run-' + Date.now() + '-' + Math.random().toString(36).slice(2, 8),
            name: run.name,
            timeMs: run.timeMs || 0,
            coins: run.coins || 0,
            rounds: run.rounds || 0,
            timestamp: Date.now()
        };
        entries.push(entry);
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
        } catch (e) {
            console.error('Failed to save leaderboard entry:', e);
        }
        return entry;
    }

    static getEntries() {
        try {
            return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
        } catch (e) {
            return [];
        }
    }

    static clearEntries() {
        localStorage.removeItem(STORAGE_KEY);
    }

    static formatTime(ms) {
        if (!ms || ms < 0) return '--:--';
        const totalSecs = Math.floor(ms / 1000);
        const m = Math.floor(totalSecs / 60);
        const s = totalSecs % 60;
        const cs = Math.floor((ms % 1000) / 10); // centiseconds for precision
        return `${m}:${String(s).padStart(2, '0')}.${String(cs).padStart(2, '0')}`;
    }

    /** Open the leaderboard modal */
    open() {
        if (!this.modal) return;
        this._renderColumns();
        this.modal.style.display = 'flex';
        this.isOpen = true;
    }

    /** Close the leaderboard modal */
    close() {
        if (!this.modal) return;
        this.modal.style.display = 'none';
        this.isOpen = false;
    }

    toggle() {
        this.isOpen ? this.close() : this.open();
    }

    _createTrigger() {
        document.getElementById('gl-trigger')?.remove();

        const btn = document.createElement('button');
        btn.id = 'gl-trigger';
        btn.className = 'gl-trigger';
        btn.title = 'Show Leaderboard';
        btn.innerHTML = '🏆';
        btn.onclick = () => this.toggle();
        document.body.appendChild(btn);
        this.trigger = btn;
    }

    _createModal() {
        document.getElementById('gl-modal')?.remove();

        const modal = document.createElement('div');
        modal.id = 'gl-modal';
        modal.className = 'gl-modal';
        modal.innerHTML = `
            <div class="gl-content">
                <div class="gl-header">
                    <div class="gl-title">🏆 Leaderboard</div>
                    <button class="gl-close" id="gl-close-btn">✕</button>
                </div>
                <div class="gl-columns">
                    <div class="gl-column" id="gl-col-time">
                        <div class="gl-col-header">⏱ Fastest Time</div>
                        <div class="gl-col-body"></div>
                    </div>
                    <div class="gl-column" id="gl-col-coins">
                        <div class="gl-col-header">🪙 Most Coins</div>
                        <div class="gl-col-body"></div>
                    </div>
                    <div class="gl-column" id="gl-col-rounds">
                        <div class="gl-col-header">🎯 Most Rounds <span class="gl-col-subheader">(Zone Catch)</span></div>
                        <div class="gl-col-body"></div>
                    </div>
                </div>
                <div class="gl-footer">
                    <button class="gl-reset" id="gl-reset-btn">Clear Leaderboard</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        this.modal = modal;

        document.getElementById('gl-close-btn').onclick = () => this.close();
        document.getElementById('gl-reset-btn').onclick = () => {
            if (confirm('Clear all leaderboard entries? This cannot be undone.')) {
                GameLeaderboard.clearEntries();
                this._renderColumns();
            }
        };

        // Click outside modal content to close
        modal.addEventListener('click', e => {
            if (e.target === modal) this.close();
        });

        // Escape to close
        document.addEventListener('keydown', e => {
            if (e.key === 'Escape' && this.isOpen) this.close();
        });
    }

    _renderColumns() {
        const entries = GameLeaderboard.getEntries();

        // Sort for each column
        // Only runs that completed the game count for Time column (timeMs > 0)
        const byTime   = entries.filter(e => e.timeMs > 0)
                                .slice().sort((a, b) => a.timeMs - b.timeMs)
                                .slice(0, TOP_N);
        const byCoins  = entries.slice().sort((a, b) => b.coins - a.coins)
                                .slice(0, TOP_N);
        const byRounds = entries.slice().sort((a, b) => b.rounds - a.rounds)
                                .slice(0, TOP_N);

        this._fillColumn('gl-col-time',   byTime,   e => GameLeaderboard.formatTime(e.timeMs));
        this._fillColumn('gl-col-coins',  byCoins,  e => `${e.coins} 🪙`);
        this._fillColumn('gl-col-rounds', byRounds, e => `${e.rounds} rounds`);
    }

    _fillColumn(columnId, sortedEntries, valueFormatter) {
        const body = document.querySelector(`#${columnId} .gl-col-body`);
        if (!body) return;

        if (sortedEntries.length === 0) {
            body.innerHTML = '<div class="gl-empty">No entries yet</div>';
            return;
        }

        body.innerHTML = sortedEntries.map((e, i) => {
            const rank = i + 1;
            const medal = rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : `#${rank}`;
            return `
                <div class="gl-entry ${rank <= 3 ? 'gl-entry-top' : ''}">
                    <span class="gl-rank">${medal}</span>
                    <span class="gl-name">${this._escape(e.name)}</span>
                    <span class="gl-value">${valueFormatter(e)}</span>
                </div>
            `;
        }).join('');
    }

    _escape(str) {
        return String(str).replace(/[&<>"']/g, m => ({
            '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
        })[m]);
    }

    _injectStyles() {
        if (document.getElementById('gl-styles')) return;
        const style = document.createElement('style');
        style.id = 'gl-styles';
        style.textContent = `
            .gl-trigger {
                position: fixed;
                top: 80px;
                right: 18px;
                width: 44px;
                height: 44px;
                background: rgba(10, 25, 45, 0.92);
                color: #ffe066;
                border: 2px solid #ffe066;
                border-radius: 8px;
                font-size: 22px;
                cursor: pointer;
                z-index: 10050;
                box-shadow: 0 0 12px rgba(255, 224, 102, 0.4);
                transition: transform 0.15s, background 0.15s;
            }
            .gl-trigger:hover {
                transform: scale(1.08);
                background: rgba(20, 40, 65, 0.95);
            }
            .gl-modal {
                position: fixed; inset: 0;
                background: rgba(5, 10, 25, 0.88);
                display: none;
                align-items: center; justify-content: center;
                z-index: 11000;
                font-family: 'Press Start 2P', cursive, monospace;
                backdrop-filter: blur(3px);
            }
            .gl-content {
                width: min(94%, 900px);
                max-height: 86vh;
                overflow-y: auto;
                padding: 24px 28px;
                background: linear-gradient(135deg, #0d1b2a 0%, #1b2838 100%);
                border: 2px solid #ffe066;
                border-radius: 14px;
                box-shadow: 0 0 50px rgba(255, 224, 102, 0.4);
                color: #e8f4ff;
            }
            .gl-header {
                display: flex; justify-content: space-between; align-items: center;
                margin-bottom: 22px;
                border-bottom: 2px solid rgba(255, 224, 102, 0.3);
                padding-bottom: 14px;
            }
            .gl-title {
                font-size: 22px;
                color: #ffe066;
            }
            .gl-close {
                background: transparent;
                color: #ff9e9e;
                border: 2px solid #ff9e9e;
                border-radius: 6px;
                width: 34px; height: 34px;
                font-size: 14px;
                cursor: pointer;
                font-family: inherit;
            }
            .gl-close:hover { background: rgba(255, 158, 158, 0.15); }
            .gl-columns {
                display: grid;
                grid-template-columns: 1fr 1fr 1fr;
                gap: 16px;
            }
            @media (max-width: 720px) {
                .gl-columns { grid-template-columns: 1fr; }
            }
            .gl-column {
                background: rgba(0, 0, 0, 0.3);
                border: 2px solid #6cc6ff;
                border-radius: 8px;
                padding: 12px 10px;
                min-height: 240px;
            }
            .gl-col-header {
                font-size: 13px;
                color: #ffe066;
                text-align: center;
                padding-bottom: 10px;
                margin-bottom: 10px;
                border-bottom: 1px solid rgba(108, 198, 255, 0.3);
            }
            .gl-col-subheader {
                display: block;
                font-size: 8px;
                color: rgba(200, 220, 255, 0.55);
                margin-top: 4px;
            }
            .gl-entry {
                display: grid;
                grid-template-columns: 38px 1fr auto;
                align-items: center;
                gap: 8px;
                padding: 7px 6px;
                font-size: 10px;
                border-radius: 4px;
            }
            .gl-entry:nth-child(even) {
                background: rgba(108, 198, 255, 0.06);
            }
            .gl-entry-top {
                background: rgba(255, 224, 102, 0.10) !important;
                color: #ffe066;
            }
            .gl-rank { text-align: center; font-size: 12px; }
            .gl-name {
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
            .gl-value {
                text-align: right;
                color: #7fe38a;
                font-weight: bold;
            }
            .gl-entry-top .gl-value { color: #ffe066; }
            .gl-empty {
                text-align: center;
                font-size: 10px;
                color: rgba(200, 220, 255, 0.4);
                padding: 30px 10px;
            }
            .gl-footer {
                margin-top: 22px;
                padding-top: 14px;
                border-top: 1px solid rgba(108, 198, 255, 0.2);
                text-align: center;
            }
            .gl-reset {
                padding: 8px 18px;
                font-family: inherit;
                font-size: 10px;
                color: #ff9e9e;
                background: transparent;
                border: 1px solid rgba(255, 158, 158, 0.5);
                border-radius: 5px;
                cursor: pointer;
            }
            .gl-reset:hover {
                background: rgba(255, 158, 158, 0.1);
            }
        `;
        document.head.appendChild(style);
    }
}

export default GameLeaderboard;
