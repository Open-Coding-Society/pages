// PauseFeature.js
export default class PauseFeature {
    constructor(pauseMenu) {
        this.pauseMenu = pauseMenu;
        // Properly bind the key handler so 'this' refers to the PauseFeature instance
        this._boundKeyHandler = (e) => this._handleKeyDown(e);
    }

    show() {
        if (!this.pauseMenu.container) return;
        
        // Pause the game
        if (this.pauseMenu.gameControl && typeof this.pauseMenu.gameControl.pause === 'function') {
            this.pauseMenu.gameControl.pause();
        }
        
        this.pauseMenu.container.style.display = 'flex';
        this.pauseMenu.container.style.zIndex = '10000'; // Ensure overlay is on top
        this.pauseMenu.container.setAttribute('aria-hidden', 'false');
        document.addEventListener('keydown', this._boundKeyHandler);
        const btn = this.pauseMenu.container.querySelector('button');
        if (btn) btn.focus();
        if (typeof this.pauseMenu._updateStatsDisplay === 'function') {
            this.pauseMenu._updateStatsDisplay();
        }
    }

    hide() {
        if (!this.pauseMenu.container) return;
        this.pauseMenu.container.style.display = 'none';
        this.pauseMenu.container.setAttribute('aria-hidden', 'true');
        document.removeEventListener('keydown', this._boundKeyHandler);
        
        // Resume the game
        if (this.pauseMenu.gameControl && typeof this.pauseMenu.gameControl.resume === 'function') {
            this.pauseMenu.gameControl.resume();
        }
    }

    resume() {
        this.hide();
    }

    toggle() {
        if (!this.pauseMenu.container) return;
        if (this.pauseMenu.container.style.display === 'flex') {
            this.hide();
        } else {
            this.show();
        }
    }

    _handleKeyDown(e) {
        if (e.key === 'Escape' || e.key === 'Esc') {
            e.preventDefault();
            this.toggle();
        }
    }
}
