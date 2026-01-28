// PauseFeature.js
export default class PauseFeature {
    constructor(pauseMenu) {
        this.pauseMenu = pauseMenu;
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
        // No-op: ESC-based pause handling has been disabled in favor of UI controls.
    }
}
