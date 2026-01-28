import { javaURI, fetchOptions } from '/assets/js/api/config.js';
import PauseFeature from './pause/PauseFeature.js';
import ScoreFeature from './pause/ScoreFeature.js';
import LevelSkipFeature from './pause/LevelSkipFeature.js';

export default class PauseMenu {
    constructor(gameControl, options = {}) {
        this.gameControl = gameControl;
        this.container = null;

        this.options = Object.assign({
            parentId: 'gameContainer',
            cssPath: '/assets/css/pause-menu.css',
            backendUrl: null,
            playerName: 'guest',
            gameType: 'unknown'
        }, options);

        this.counterVar = this.options.counterVar || 'levelsCompleted';
        this.counterLabelText = this.options.counterLabel || 'Levels completed';
        this.scoreVar = this.options.scoreVar || this.counterVar;
        this.score = 0;

        // Load CSS and DOM
        this._ensureCssLoaded();
        this._createDom();

        // Features
        this.pauseFeature = new PauseFeature(this);
        this.scoreFeature = new ScoreFeature(this);
        this.levelSkipFeature = new LevelSkipFeature(this);

        // Stats init
        if (this.gameControl) {
            if (!this.gameControl.stats) this.gameControl.stats = { levelsCompleted: 0, points: 0 };
            this.stats = this.gameControl.stats;
        }

        // -------------------------
        // GLOBAL ESC TO OPEN MENU
        // -------------------------
        this._globalEscHandler = (e) => {
            if (e.key === 'Escape' || e.key === 'Esc') {
                // Only toggle if not already focused on an input
                const active = document.activeElement;
                if (active && ['INPUT', 'TEXTAREA'].includes(active.tagName)) return;
                this.pauseFeature.toggle();
            }
        };
        document.addEventListener('keydown', this._globalEscHandler);
    }

    // -----------------------
    // WRAPPERS TO FEATURES
    // -----------------------
    show() { this.pauseFeature.show(); }
    hide() { this.pauseFeature.hide(); }
    resume() { this.pauseFeature.resume(); }
    saveScore(buttonEl) { return this.scoreFeature.saveScore(buttonEl); }
    skipLevel() { this.levelSkipFeature.skipLevel(); }

    // -----------------------
    // DOM BUILDING
    // -----------------------
    _ensureCssLoaded() {
        const href = this.options.cssPath;
        if (!document.querySelector(`link[href="${href}"]`)) {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = href;
            document.head.appendChild(link);
        }
    }

    _createDom() {
        const parent = (this.gameControl && this.gameControl.gameContainer) 
            || document.getElementById(this.options.parentId) 
            || document.body;

        const overlay = document.createElement('div');
        overlay.className = 'pause-overlay';
        overlay.style.display = 'none';

        const panel = document.createElement('div');
        panel.className = 'pause-panel';

        const counterWrap = document.createElement('div');
        counterWrap.className = 'pause-counter-wrap';
        const counterLabel = document.createElement('div');
        counterLabel.className = 'pause-counter-label';
        counterLabel.innerText = this.counterLabelText;
        const counterNumber = document.createElement('div');
        counterNumber.className = 'pause-counter-number';
        counterNumber.innerText = '0';
        counterWrap.appendChild(counterLabel);
        counterWrap.appendChild(counterNumber);

        const title = document.createElement('h2');
        title.className = 'pause-title';
        title.innerText = 'Paused';

        // Save Score Button
        const btnSave = document.createElement('button');
        btnSave.className = 'pause-btn save-score';
        btnSave.innerText = 'Save Score';
        btnSave.addEventListener('click', () => this.saveScore(btnSave));

        // Save Status Message
        const saveStatus = document.createElement('div');
        saveStatus.className = 'pause-save-status';
        saveStatus.style.marginTop = '10px';
        saveStatus.style.minHeight = '20px';
        saveStatus.style.color = '#999';
        saveStatus.style.fontSize = '14px';
        saveStatus.innerText = '';

        panel.appendChild(counterWrap);
        panel.appendChild(title);
        panel.appendChild(btnSave);
        panel.appendChild(saveStatus);
        overlay.appendChild(panel);

        parent.appendChild(overlay);
        this.container = overlay;

        this._counterNumber = counterNumber;
        this._saveStatusNode = saveStatus;
    }

    _updateStatsDisplay() {
        const cv = this.counterVar || 'levelsCompleted';
        let val = (this.stats && typeof this.stats[cv] !== 'undefined') ? this.stats[cv] : 0;
        this.score = val;
        if (this._counterNumber) this._counterNumber.innerText = String(val);
    }
}
