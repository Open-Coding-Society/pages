// LevelSkipFeature.js
export default class LevelSkipFeature {
    constructor(pauseMenu) {
        this.pauseMenu = pauseMenu;
    }

    skipLevel() {
        try {
            if (!this.pauseMenu.gameControl) return;

            if (typeof this.pauseMenu.gameControl.hidePauseMenu === 'function') {
                this.pauseMenu.gameControl.hidePauseMenu();
            } else {
                this.pauseMenu.container.style.display = 'none';
            }

            if (typeof this.pauseMenu.gameControl.endLevel === 'function') {
                this.pauseMenu.gameControl.endLevel();
                return;
            }

            // fallback: synthesize 'L' key
            const event = new KeyboardEvent('keydown', {
                key: 'L', code: 'KeyL', keyCode: 76, which: 76, bubbles: true
            });
            document.dispatchEvent(event);
        } catch (e) { console.warn('LevelSkipFeature: could not skip level', e); }
    }
}
