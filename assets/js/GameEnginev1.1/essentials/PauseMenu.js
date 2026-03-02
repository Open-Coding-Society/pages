/**
 * PauseMenu.js - Creates and manages a pause menu overlay with controls
 * Includes pause/resume, skip level, save score, and leaderboard toggle functionality
 */
export default class PauseMenu {
    constructor(gameControl, options = {}) {
        this.gameControl = gameControl;
        this.options = options;
        this.container = null;
        this.isVisible = false;
        this.leaderboard = null;
        this.scoreFeature = null;
        this.score = 0;
        this.stats = {};
        
        this.init();
    }

    init() {
        this.createStyles();
        this.createMenuUI();
    }

    createStyles() {
        if (document.getElementById('pause-menu-styles')) return;

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
    }

    createMenuUI() {
        // Create overlay
        this.overlay = document.createElement('div');
        this.overlay.className = 'pause-menu-overlay';

        // Create menu container
        this.container = document.createElement('div');
        this.container.className = 'pause-menu-container';

        // Header
        const header = document.createElement('div');
        header.className = 'pause-menu-header';
        header.textContent = '⏸ PAUSED';

        // Content
        const content = document.createElement('div');
        content.className = 'pause-menu-content';

        // Buttons section
        const buttonsDiv = document.createElement('div');
        buttonsDiv.className = 'pause-menu-buttons';

        // Resume button
        const resumeBtn = document.createElement('button');
        resumeBtn.className = 'pause-menu-btn primary';
        resumeBtn.textContent = '▶ Resume Game (ESC)';
        resumeBtn.addEventListener('click', () => this.hide());

        // Save Score button
        const saveScoreBtn = document.createElement('button');
        saveScoreBtn.id = 'pause-menu-save-score-btn';
        saveScoreBtn.className = 'pause-menu-btn';
        saveScoreBtn.textContent = '💾 Save Score';
        saveScoreBtn.addEventListener('click', () => this.saveScore());

        // Skip level button
        const skipBtn = document.createElement('button');
        skipBtn.className = 'pause-menu-btn';
        skipBtn.textContent = '⏭ Skip Level';
        skipBtn.addEventListener('click', () => this.skipLevel());

        // Toggle leaderboard button
        const leaderboardBtn = document.createElement('button');
        leaderboardBtn.id = 'pause-menu-toggle-leaderboard-btn';
        leaderboardBtn.className = 'pause-menu-btn';
        leaderboardBtn.textContent = '📊 Toggle Leaderboard';
        leaderboardBtn.addEventListener('click', () => this.toggleLeaderboard());

        buttonsDiv.appendChild(resumeBtn);
        buttonsDiv.appendChild(saveScoreBtn);
        buttonsDiv.appendChild(skipBtn);
        buttonsDiv.appendChild(leaderboardBtn);

        // Status message
        const statusDiv = document.createElement('div');
        statusDiv.id = 'pause-menu-status';
        statusDiv.className = 'pause-menu-status';
        this._saveStatusNode = statusDiv;

        content.appendChild(buttonsDiv);
        content.appendChild(statusDiv);

        // Leaderboard section (will be populated if leaderboard exists)
        const leaderboardSection = document.createElement('div');
        leaderboardSection.className = 'pause-menu-leaderboard-section';
        leaderboardSection.id = 'pause-menu-leaderboard-section';
        leaderboardSection.style.display = 'none';
        content.appendChild(leaderboardSection);
        this.leaderboardContainer = leaderboardSection;

        // Assemble
        this.container.appendChild(header);
        this.container.appendChild(content);
        this.overlay.appendChild(this.container);
        document.body.appendChild(this.overlay);

        // Close on overlay click
        this.overlay.addEventListener('click', (e) => {
            if (e.target === this.overlay) {
                this.hide();
            }
        });
    }

    show() {
        if (this.isVisible) return;
        
        this.isVisible = true;
        this.overlay.classList.add('visible');
        
        // Pause the game
        if (this.gameControl && !this.gameControl.isPaused) {
            this.gameControl.pause();
        }
    }

    hide() {
        if (!this.isVisible) return;
        
        this.isVisible = false;
        this.overlay.classList.remove('visible');
        
        // Resume the game
        if (this.gameControl && this.gameControl.isPaused) {
            this.gameControl.resume();
        }
    }

    saveScore() {
        // Try to use ScoreFeature if available
        if (window.scoreFeature && typeof window.scoreFeature.saveScore === 'function') {
            const btn = document.getElementById('pause-menu-save-score-btn');
            window.scoreFeature.saveScore(btn);
        } else {
            alert('Score feature not yet loaded. Please try again in a moment.');
        }
    }

    toggleLeaderboard() {
        const section = this.leaderboardContainer;
        const isHidden = section.style.display === 'none';
        
        if (isHidden) {
            // Show leaderboard
            section.style.display = 'block';
            if (window.leaderboardInstance && typeof window.leaderboardInstance.toggle === 'function') {
                window.leaderboardInstance.toggle();
            }
        } else {
            // Hide leaderboard
            if (window.leaderboardInstance && typeof window.leaderboardInstance.toggle === 'function') {
                window.leaderboardInstance.toggle();
            }
            section.style.display = 'none';
        }
    }

    skipLevel() {
        if (this.gameControl && typeof this.gameControl.endLevel === 'function') {
            this.hide(); // Hide menu first
            this.gameControl.endLevel();
        }
    }
}
