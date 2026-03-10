// PauseFeature.js (copied from GameEnginev2)
export default class PauseFeature {
    constructor(pauseMenu) {
        this.pauseMenu = pauseMenu;
        this.gameControl = pauseMenu?.gameControl;
        this.isPaused = false;
    }

    /**
     * Pause the game: stop game logic but keep rendering
     */
    show() {
        if (!this.gameControl) return;
        
        this.isPaused = true;
        this.gameControl.isPaused = true;
        
        // Remove exit key listener to prevent interference
        if (typeof this.gameControl.removeExitKeyListener === 'function') {
            this.gameControl.removeExitKeyListener();
        }
        
        // Save interaction handlers before cleaning up (for game-in-game scenarios)
        if (typeof this.gameControl.cleanupInteractionHandlers === 'function') {
            this.gameControl.cleanupInteractionHandlers(true);
        }
    }

    /**
     * Resume the game: restart game logic
     */
    hide() {
        if (!this.gameControl) return;
        
        this.isPaused = false;
        this.gameControl.isPaused = false;
        
        // Restore exit key listener
        if (typeof this.gameControl.addExitKeyListener === 'function') {
            this.gameControl.addExitKeyListener();
        }
        
        // Restore interaction handlers for outer game
        if (typeof this.gameControl.restoreInteractionHandlers === 'function') {
            this.gameControl.restoreInteractionHandlers();
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
