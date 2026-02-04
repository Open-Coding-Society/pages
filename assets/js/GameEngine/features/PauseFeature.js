// PauseFeature.js
export default class PauseFeature {
    constructor(pauseMenu) {
        this.pauseMenu = pauseMenu;
        this.isPaused = false; // Track pause state
    }

    show() {
        if (!this.pauseMenu.container) return;
        
        this.isPaused = true;
        
        // Pause the game
        if (this.pauseMenu.gameControl && typeof this.pauseMenu.gameControl.pause === 'function') {
            this.pauseMenu.gameControl.pause();
        }
        
        // Don't show the pause menu UI - just pause the game silently
    }

    hide() {
        if (!this.pauseMenu.container) return;
        
        this.isPaused = false;
        
        // Resume the game
        if (this.pauseMenu.gameControl && typeof this.pauseMenu.gameControl.resume === 'function') {
            this.pauseMenu.gameControl.resume();
        }
    }

    resume() {
        this.hide();
    }

    toggle() {
        if (this.isPaused) {
            this.hide();
        } else {
            this.show();
        }
    }

    _handleKeyDown(e) {
        // No-op: ESC-based pause handling has been disabled in favor of UI controls.
    }
}
