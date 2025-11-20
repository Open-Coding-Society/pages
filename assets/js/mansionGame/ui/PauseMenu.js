// PauseMenu.js - reusable pause menu component for mansion games
export default class PauseMenu {
    constructor(gameControl, options = {}) {
        this.gameControl = gameControl;
        this.container = null;
        this.options = Object.assign({
            parentId: 'gameContainer',
            cssPath: '/assets/css/pause-menu.css'
        }, options);

        this._ensureCssLoaded();
        this._createDom();
        // Register ourselves on the provided GameControl so Escape can toggle the menu
        try {
            if (this.gameControl) {
                this.gameControl.pauseMenu = this;
            }
        } catch (e) {
            console.warn('PauseMenu: could not register with gameControl', e);
        }
    }

    _ensureCssLoaded() {
        // Add stylesheet if not already present
        const href = this.options.cssPath;
        if (!document.querySelector(`link[href="${href}"]`)) {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = href;
            document.head.appendChild(link);
        }
    }

    _createDom() {
        const parent = document.getElementById(this.options.parentId) || document.body;

        // Main overlay container
        const overlay = document.createElement('div');
        overlay.className = 'pause-overlay';
        overlay.setAttribute('aria-hidden', 'true');
        overlay.style.display = 'none';

        const panel = document.createElement('div');
        panel.className = 'pause-panel';

        const title = document.createElement('h2');
        title.className = 'pause-title';
        title.innerText = 'Paused';

        const btnResume = document.createElement('button');
        btnResume.className = 'pause-btn resume';
        btnResume.innerText = 'Resume';
        btnResume.addEventListener('click', () => this._onResume());

    const btnRestart = document.createElement('button');
    btnRestart.className = 'pause-btn restart';
    btnRestart.innerText = 'Restart Level';
    btnRestart.addEventListener('click', () => this._onRestart());

    const btnSkipLevel = document.createElement('button');
    btnSkipLevel.className = 'pause-btn skip-level';
    btnSkipLevel.innerText = 'Skip Level';
    btnSkipLevel.addEventListener('click', () => this._onEndLevel());

    const btnExit = document.createElement('button');
    btnExit.className = 'pause-btn exit';
    btnExit.innerText = 'Exit to Home';
    btnExit.addEventListener('click', () => this._onExit());

    panel.appendChild(title);
    panel.appendChild(btnResume);
    panel.appendChild(btnRestart);
    panel.appendChild(btnSkipLevel);
    panel.appendChild(btnExit);
        overlay.appendChild(panel);

        parent.appendChild(overlay);
        this.container = overlay;

        // keyboard handler: Esc to close, P to toggle
        this._boundKeyHandler = (e) => {
            if (e.key === 'Escape' || e.key === 'Esc') {
                this._onResume();
            }
        };
    }

    show() {
        if (!this.container) return;
        this.container.style.display = 'flex';
        this.container.setAttribute('aria-hidden', 'false');
        document.addEventListener('keydown', this._boundKeyHandler);
        // trap focus to first button
        const btn = this.container.querySelector('button');
        if (btn) btn.focus();
    }

    hide() {
        if (!this.container) return;
        this.container.style.display = 'none';
        this.container.setAttribute('aria-hidden', 'true');
        document.removeEventListener('keydown', this._boundKeyHandler);
    }

    _onResume() {
        if (this.gameControl && typeof this.gameControl.hidePauseMenu === 'function') {
            this.gameControl.hidePauseMenu();
        } else if (this.gameControl && typeof this.gameControl.resume === 'function') {
            this.hide();
            this.gameControl.resume();
        }
    }

    _onRestart() {
        if (this.gameControl && typeof this.gameControl.restartLevel === 'function') {
            this.hide();
            this.gameControl.restartLevel();
        }
    }

    _onEndLevel() {
        // End the current level by signaling the GameControl's public API.
        // Preferred: call `gameControl.endLevel()` if available (Adventure uses this).
        // Fallback: dispatch a synthetic 'L' keydown event so controllers that listen
        // for the skip key behave identically without modifying controller code.
        try {
            if (!this.gameControl) return;
            // Prefer controller-level hide & resume so the game loop resumes and
            // can process the level-ending logic immediately.
            if (typeof this.gameControl.hidePauseMenu === 'function') {
                try { this.gameControl.hidePauseMenu(); } catch (e) { /* ignore */ }
            } else if (typeof this.gameControl.resume === 'function') {
                try { this.gameControl.resume(); } catch (e) { /* ignore */ }
            } else {
                // fallback to hiding our UI if controller doesn't provide resume helper
                this.hide();
            }

            if (typeof this.gameControl.endLevel === 'function') {
                this.gameControl.endLevel();
                return;
            }

            // Fallback: if controllers listen for the 'L' key to skip levels,
            // synthesize a keydown event. This preserves existing controller behavior
            // without requiring changes to GameControl.
            const event = new KeyboardEvent('keydown', {
                key: 'L',
                code: 'KeyL',
                keyCode: 76,
                which: 76,
                bubbles: true,
            });
            document.dispatchEvent(event);
        } catch (e) {
            console.warn('PauseMenu: could not end level:', e);
        }
    }

    _onExit() {
        // return home via Game instance if available
        if (this.gameControl && this.gameControl.game && typeof this.gameControl.game.returnHome === 'function') {
            this.hide();
            this.gameControl.game.returnHome();
        } else {
            window.location.href = '/';
        }
    }
}
