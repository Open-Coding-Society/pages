import { javaURI, fetchOptions } from '/assets/js/api/config.js';
import PauseFeature from '../../BetterGameEngine/features/PauseFeature.js';
import ScoreFeature from '../../BetterGameEngine/features/ScoreFeature.js';
import LevelSkipFeature from '../../BetterGameEngine/features/LevelSkipFeature.js';

export default class PauseMenu {
    constructor(gameControl, options = {}) {
        this.gameControl = gameControl;
        this.container = null;

        // Register this PauseMenu with the GameControl so it can interact with ESC key handling
        if (this.gameControl) {
            this.gameControl.pauseMenu = this;
        }

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

        // Disable global ESC pause handling when possible. GameControl may have
        // registered an exit key listener; remove it so ESC no longer toggles pause.
        if (this.gameControl && typeof this.gameControl.removeExitKeyListener === 'function') {
            try { this.gameControl.removeExitKeyListener(); } catch (e) { /* ignore */ }
        }
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

        // ========================
        // ALWAYS-VISIBLE BUTTON BAR
        // ========================
        const buttonBar = document.createElement('div');
        buttonBar.className = 'pause-button-bar';
        buttonBar.style.position = 'fixed';
        buttonBar.style.top = '60px';
        buttonBar.style.left = '20px';
        buttonBar.style.display = 'flex';
        buttonBar.style.gap = '10px';
        buttonBar.style.zIndex = '9999';

        // Pause Toggle Button (always visible)
        const btnPause = document.createElement('button');
        btnPause.className = 'pause-btn pause-toggle';
        btnPause.innerText = 'Pause';
        btnPause.addEventListener('click', () => {
            if (this.pauseFeature && typeof this.pauseFeature.toggle === 'function') {
                this.pauseFeature.toggle();
                // Update label to reflect new state (pause overlay visible -> 'Resume')
                setTimeout(() => {
                    const paused = this.container && this.container.style.display === 'flex';
                    btnPause.innerText = paused ? 'Resume' : 'Pause';
                }, 0);
            }
        });

        // Save Score Button (always visible)
        const btnSave = document.createElement('button');
        btnSave.className = 'pause-btn save-score';
        btnSave.innerText = 'Save Score';
        btnSave.addEventListener('click', () => this.saveScore(btnSave));

        // Skip Level Button (always visible)
        const btnSkipLevel = document.createElement('button');
        btnSkipLevel.className = 'pause-btn skip-level';
        btnSkipLevel.innerText = 'Skip Level';
        btnSkipLevel.addEventListener('click', () => this.skipLevel());

        buttonBar.appendChild(btnPause);
        buttonBar.appendChild(btnSave);
        buttonBar.appendChild(btnSkipLevel);
        parent.appendChild(buttonBar);

        // ========================
        // PAUSE OVERLAY (modal)
        // ========================
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