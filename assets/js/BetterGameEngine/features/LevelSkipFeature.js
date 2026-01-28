// LevelSkipFeature.js
export default class LevelSkipFeature {
    constructor(pauseMenu) {
        this.pauseMenu = pauseMenu;
    }

    skipLevel() {
        try {
            if (!this.pauseMenu.gameControl) return;

            // First hide the pause menu
            if (typeof this.pauseMenu.pauseFeature.hide === 'function') {
                this.pauseMenu.pauseFeature.hide();
            } else if (this.pauseMenu.container) {
                this.pauseMenu.container.style.display = 'none';
            }

            // Then end/skip the level
            if (typeof this.pauseMenu.gameControl.endLevel === 'function') {
                this.pauseMenu.gameControl.endLevel();
                return;
            }

            // Fallback: try to resume first, then synthesize 'L' key for skip
            if (typeof this.pauseMenu.gameControl.resume === 'function') {
                this.pauseMenu.gameControl.resume();
            }

            // Synthesize 'L' key event (expected by some game controls for level skip)
            const event = new KeyboardEvent('keydown', {
                key: 'L', code: 'KeyL', keyCode: 76, which: 76, bubbles: true
            });
            document.dispatchEvent(event);
        } catch (e) { console.warn('LevelSkipFeature: could not skip level', e); }
    }
}
