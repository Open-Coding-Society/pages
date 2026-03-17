/**
 * PauseMenu.js - Creates and manages a pause menu overlay with controls
 * Includes pause/resume, skip level, save score, and leaderboard toggle functionality
 */
export default class PauseMenu {
    constructor(gameControl, options = {}) {
        this.gameControl = gameControl;
        this.options = options;
        this.container = null;
        this.overlay = null;
        this.isVisible = false;
        this.leaderboardContainer = null;
        this._saveStatusNode = null;
        
        this.init();
    }

    /**
     * Initialize the pause menu by creating styles and UI elements
     */
    init() {
        try {
            this.createStyles();
            this.createMenuUI();
        } catch (error) {
            console.error('Error initializing PauseMenu:', error);
        }
    }

    /**
     * Create and inject CSS styles for the pause menu
     */
    createStyles() {
        if (document.getElementById('pause-menu-styles')) return;

        try {
            const style = document.createElement('style');
            style.id = 'pause-menu-styles';
            style.textContent = `
            .pause-menu-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.7);
                display: none;
                z-index: 9998;
            }

            .pause-menu-overlay.visible {
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .pause-menu-container {
                background: #1a1a1a;
                border: 3px solid #333;
                border-radius: 16px;
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.9);
                max-width: 600px;
                max-height: 80vh;
                overflow-y: auto;
                font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
                z-index: 9999;
            }

            .pause-menu-header {
                padding: 24px;
                background: #2d2d2d;
                border-bottom: 2px solid #444;
                text-align: center;
                color: #fff;
                font-size: 28px;
                font-weight: 700;
            }

            .pause-menu-content {
                padding: 24px;
            }

            .pause-menu-buttons {
                display: flex;
                flex-direction: column;
                gap: 12px;
                margin-bottom: 24px;
            }

            .pause-menu-btn {
                padding: 14px 20px;
                background: #3a3a3a;
                border: 2px solid #555;
                color: #fff;
                border-radius: 8px;
                font-size: 16px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.2s ease;
            }

            .pause-menu-btn:hover:not(:disabled) {
                background: #4a9eff;
                border-color: #5aafff;
                transform: translateY(-2px);
            }

            .pause-menu-btn:disabled {
                opacity: 0.6;
                cursor: not-allowed;
            }

            .pause-menu-btn.primary {
                background: #4a9eff;
                border-color: #5aafff;
                color: #1a1a1a;
            }

            .pause-menu-btn.primary:hover:not(:disabled) {
                background: #5aafff;
            }

            .pause-menu-status {
                padding: 12px;
                background: #2d2d2d;
                border-radius: 6px;
                color: #4a9eff;
                font-size: 14px;
                text-align: center;
                margin-top: 12px;
                min-height: 22px;
            }

            .pause-menu-leaderboard-section {
                margin-top: 24px;
                padding-top: 24px;
                border-top: 2px solid #444;
            }

            .pause-menu-leaderboard-section h3 {
                color: #4a9eff;
                font-size: 18px;
                margin: 0 0 16px 0;
            }
        `;
            document.head.appendChild(style);
        } catch (error) {
            console.error('Error creating or appending styles:', error);
        }
    }

    /**
     * Create the complete pause menu UI by assembling components
     */
    createMenuUI() {
        try {
            this._createOverlay();
            this._createContainer();
            this._attachEventListeners();
        } catch (error) {
            console.error('Error creating menu UI:', error);
        }
    }

    /**
     * Create the overlay background element
     */
    _createOverlay() {
        this.overlay = document.createElement('div');
        this.overlay.className = 'pause-menu-overlay';
    }

    /**
     * Create the main container with header and content
     */
    _createContainer() {
        this.container = document.createElement('div');
        this.container.className = 'pause-menu-container';

        const header = this._createHeader();
        const content = this._createContent();

        this.container.appendChild(header);
        this.container.appendChild(content);
        this.overlay.appendChild(this.container);
        document.body.appendChild(this.overlay);
    }

    /**
     * Create the pause menu header element
     */
    _createHeader() {
        const header = document.createElement('div');
        header.className = 'pause-menu-header';
        header.textContent = '⏸ PAUSED';
        return header;
    }

    /**
     * Create the content section with buttons and status area
     */
    _createContent() {
        const content = document.createElement('div');
        content.className = 'pause-menu-content';

        const buttonsSection = this._createButtonsSection();
        const statusArea = this._createStatusArea();
        const leaderboardSection = this._createLeaderboardSection();

        content.appendChild(buttonsSection);
        content.appendChild(statusArea);
        content.appendChild(leaderboardSection);

        return content;
    }

    /**
     * Create the buttons section containing all action buttons
     */
    _createButtonsSection() {
        const buttonsDiv = document.createElement('div');
        buttonsDiv.className = 'pause-menu-buttons';

        const resumeBtn = this._createResumeButton();
        const saveScoreBtn = this._createSaveScoreButton();
        const skipBtn = this._createSkipLevelButton();
        const leaderboardBtn = this._createToggleLeaderboardButton();

        buttonsDiv.appendChild(resumeBtn);
        buttonsDiv.appendChild(saveScoreBtn);
        buttonsDiv.appendChild(skipBtn);
        buttonsDiv.appendChild(leaderboardBtn);

        return buttonsDiv;
    }

    /**
     * Create the resume/close button
     */
    _createResumeButton() {
        const resumeBtn = document.createElement('button');
        resumeBtn.className = 'pause-menu-btn primary';
        resumeBtn.textContent = '▶ Resume Game (ESC)';
        resumeBtn.addEventListener('click', () => this.hide());
        return resumeBtn;
    }

    /**
     * Create the save score button
     */
    _createSaveScoreButton() {
        const saveScoreBtn = document.createElement('button');
        saveScoreBtn.id = 'pause-menu-save-score-btn';
        saveScoreBtn.className = 'pause-menu-btn';
        saveScoreBtn.textContent = '💾 Save Score';
        saveScoreBtn.addEventListener('click', () => this.saveScore());
        return saveScoreBtn;
    }

    /**
     * Create the skip level button
     */
    _createSkipLevelButton() {
        const skipBtn = document.createElement('button');
        skipBtn.className = 'pause-menu-btn';
        skipBtn.textContent = '⏭ Skip Level';
        skipBtn.addEventListener('click', () => this.skipLevel());
        return skipBtn;
    }

    /**
     * Create the toggle leaderboard button
     */
    _createToggleLeaderboardButton() {
        const leaderboardBtn = document.createElement('button');
        leaderboardBtn.id = 'pause-menu-toggle-leaderboard-btn';
        leaderboardBtn.className = 'pause-menu-btn';
        leaderboardBtn.textContent = '📊 Toggle Leaderboard';
        leaderboardBtn.addEventListener('click', () => this.toggleLeaderboard());
        return leaderboardBtn;
    }

    /**
     * Create the status message area
     */
    _createStatusArea() {
        const statusDiv = document.createElement('div');
        statusDiv.id = 'pause-menu-status';
        statusDiv.className = 'pause-menu-status';
        this._saveStatusNode = statusDiv;
        return statusDiv;
    }

    /**
     * Create the leaderboard section container
     */
    _createLeaderboardSection() {
        const leaderboardSection = document.createElement('div');
        leaderboardSection.className = 'pause-menu-leaderboard-section';
        leaderboardSection.id = 'pause-menu-leaderboard-section';
        leaderboardSection.style.display = 'none';
        this.leaderboardContainer = leaderboardSection;
        return leaderboardSection;
    }

    /**
     * Attach event listeners to the overlay for closing
     */
    _attachEventListeners() {
        this.overlay.addEventListener('click', (e) => {
            if (e.target === this.overlay) {
                this.hide();
            }
        });
    }

    /**
     * Show the pause menu overlay and pause the game
     */
    show() {
        if (this.isVisible) return;

        try {
            this._showMenuOverlay();
            this._pauseGame();
            this.isVisible = true;
        } catch (error) {
            console.error('Error showing pause menu:', error);
        }
    }

    /**
     * Display the menu overlay
     */
    _showMenuOverlay() {
        if (!this.overlay) {
            throw new Error('Pause menu overlay not initialized');
        }
        this.overlay.classList.add('visible');
    }

    /**
     * Pause the active game control
     */
    _pauseGame() {
        if (!this.gameControl) {
            console.warn('GameControl not available for pause');
            return;
        }

        if (this.gameControl.isPaused) return;

        try {
            if (typeof this.gameControl.pause === 'function') {
                this.gameControl.pause();
            }
        } catch (error) {
            console.error('Error pausing game:', error);
        }
    }

    /**
     * Hide the pause menu overlay and resume the game
     */
    hide() {
        if (!this.isVisible) return;

        try {
            this._hideMenuOverlay();
            this._resumeGame();
            this.isVisible = false;
        } catch (error) {
            console.error('Error hiding pause menu:', error);
        }
    }

    /**
     * Hide the menu overlay
     */
    _hideMenuOverlay() {
        if (!this.overlay) {
            throw new Error('Pause menu overlay not initialized');
        }
        this.overlay.classList.remove('visible');
    }

    /**
     * Resume the active game control
     */
    _resumeGame() {
        if (!this.gameControl) {
            console.warn('GameControl not available for resume');
            return;
        }

        if (!this.gameControl.isPaused) return;

        try {
            if (typeof this.gameControl.resume === 'function') {
                this.gameControl.resume();
            }
        } catch (error) {
            console.error('Error resuming game:', error);
        }
    }

    /**
     * Save the current score using the ScoreFeature instance
     */
    saveScore() {
        try {
            this._validateScoreFeatureAvailable();
            const btn = document.getElementById('pause-menu-save-score-btn');
            window.scoreFeature.saveScore(btn);
        } catch (error) {
            console.error('Error saving score:', error);
            this._showStatusMessage('Error saving score. Please try again.');
        }
    }

    /**
     * Validate that ScoreFeature is available and accessible
     */
    _validateScoreFeatureAvailable() {
        if (!window.scoreFeature) {
            throw new Error('ScoreFeature not loaded');
        }
        if (typeof window.scoreFeature.saveScore !== 'function') {
            throw new Error('saveScore function not available on ScoreFeature');
        }
    }

    /**
     * Toggle the leaderboard section visibility
     */
    toggleLeaderboard() {
        try {
            const isCurrentlyHidden = this.leaderboardContainer.style.display === 'none';

            if (isCurrentlyHidden) {
                this._showLeaderboard();
            } else {
                this._hideLeaderboard();
            }
        } catch (error) {
            console.error('Error toggling leaderboard:', error);
            this._showStatusMessage('Error toggling leaderboard.');
        }
    }

    /**
     * Show the leaderboard section
     */
    _showLeaderboard() {
        this.leaderboardContainer.style.display = 'block';

        try {
            if (window.leaderboardInstance && typeof window.leaderboardInstance.toggle === 'function') {
                window.leaderboardInstance.toggle();
            }
        } catch (error) {
            console.warn('Error toggling leaderboard instance:', error);
        }
    }

    /**
     * Hide the leaderboard section
     */
    _hideLeaderboard() {
        try {
            if (window.leaderboardInstance && typeof window.leaderboardInstance.toggle === 'function') {
                window.leaderboardInstance.toggle();
            }
        } catch (error) {
            console.warn('Error toggling leaderboard instance:', error);
        }

        this.leaderboardContainer.style.display = 'none';
    }

    /**
     * End the current level and advance to the next one
     */
    skipLevel() {
        try {
            this._validateGameControlAvailable();
            this.hide();
            this.gameControl.endLevel();
        } catch (error) {
            console.error('Error skipping level:', error);
            this._showStatusMessage('Error skipping level. Please try again.');
        }
    }

    /**
     * Validate that GameControl is available and has the endLevel method
     */
    _validateGameControlAvailable() {
        if (!this.gameControl) {
            throw new Error('GameControl not available');
        }
        if (typeof this.gameControl.endLevel !== 'function') {
            throw new Error('endLevel function not available on GameControl');
        }
    }

    /**
     * Display a status message to the user
     */
    _showStatusMessage(message) {
        if (!this._saveStatusNode) return;

        try {
            this._saveStatusNode.textContent = message;
            // Auto-clear after 3 seconds
            setTimeout(() => {
                this._saveStatusNode.textContent = '';
            }, 3000);
        } catch (error) {
            console.error('Error displaying status message:', error);
        }
    }
}
