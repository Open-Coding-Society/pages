// AdventureGame.js - Adventure-specific game wrapper with UI controls
import { GameCore } from '../GameEngine/essentials/Game.js';

class AdventureGame extends GameCore {
    constructor(environment, GameControlClass) {
        super(environment, GameControlClass);
    }

    /**
     * Override the _createTopControls to add adventure-specific UI
     */
    _createTopControls() {
        console.log('AdventureGame _createTopControls called', 'gameControl:', this.gameControl);
        
        const parent = this.gameContainer || document.getElementById('gameContainer') || document.body;

        // Create pause menu object for features
        const pauseMenuObj = {
            gameControl: this.gameControl,
            options: { parentId: 'gameContainer' },
            counterVar: this.gameControl?.pauseMenuOptions?.counterVar || 'coinsCollected',
            counterLabelText: this.gameControl?.pauseMenuOptions?.counterLabel || 'Coins Collected',
            stats: this.gameControl?.stats || { coinsCollected: 0 },
            get score() {
                const varName = this.counterVar || 'coinsCollected';
                return (this.stats && this.stats[varName]) || 0;
            },
            scoreVar: this.gameControl?.pauseMenuOptions?.scoreVar || 'coinsCollected',
            _saveStatusNode: null
        };

        // Store references for modal function
        this.pauseMenuConfig = pauseMenuObj;
        
        // Dynamically import features
        import('../GameEngine/features/ScoreFeature.js').then(ScoreModule => {
            this.scoreFeature = new ScoreModule.default(pauseMenuObj);
            console.log('ScoreFeature initialized:', this.scoreFeature);
        }).catch(e => {
            console.warn('ScoreFeature init failed:', e);
        });
    }
    
    /**
     * Show the pause menu modal (called when ESC is pressed)
     */
    showPauseModal() {
        // Don't create duplicate modals
        if (document.getElementById('pauseModal')) return;
        
        // Pause the game
        if (this.gameControl) this.gameControl.pause();
        
        const modal = document.createElement('div');
        modal.id = 'pauseModal';
        modal.style.cssText = `
            display: flex;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.9);
            justify-content: center;
            align-items: center;
            z-index: 10000;
        `;
        
        const modalContent = document.createElement('div');
        modalContent.style.cssText = `
            background: #1a1a1a;
            color: white;
            padding: 40px;
            max-width: 500px;
            width: 90%;
            border: 3px solid white;
            display: flex;
            flex-direction: column;
            gap: 20px;
            font-family: 'Press Start 2P', monospace;
        `;
        
        const title = document.createElement('h2');
        title.innerText = 'PAUSED';
        title.style.cssText = `
            text-align: center;
            margin: 0 0 20px 0;
            font-size: 24px;
            letter-spacing: 3px;
        `;
        modalContent.appendChild(title);
        
        const buttonStyle = `
            background: black;
            color: white;
            padding: 15px 25px;
            font-size: 14px;
            border: 2px solid white;
            cursor: pointer;
            font-family: 'Press Start 2P', monospace;
            transition: all 0.3s;
        `;
        
        // Show Score button
        const showScoreBtn = document.createElement('button');
        showScoreBtn.innerText = 'Show Score';
        showScoreBtn.style.cssText = buttonStyle;
        showScoreBtn.addEventListener('mouseover', () => {
            showScoreBtn.style.background = 'white';
            showScoreBtn.style.color = 'black';
        });
        showScoreBtn.addEventListener('mouseout', () => {
            showScoreBtn.style.background = 'black';
            showScoreBtn.style.color = 'white';
        });
        showScoreBtn.addEventListener('click', () => {
            const sc = document.querySelector('.pause-score-counter');
            if (sc) {
                const isHidden = sc.style.display === 'none';
                sc.style.display = isHidden ? 'block' : 'none';
                showScoreBtn.innerText = isHidden ? 'Hide Score' : 'Show Score';
            }
        });
        modalContent.appendChild(showScoreBtn);
        
        // Save Score button
        const saveBtn = document.createElement('button');
        saveBtn.innerText = 'Save Score';
        saveBtn.style.cssText = buttonStyle;
        saveBtn.addEventListener('mouseover', () => {
            saveBtn.style.background = 'white';
            saveBtn.style.color = 'black';
        });
        saveBtn.addEventListener('mouseout', () => {
            saveBtn.style.background = 'black';
            saveBtn.style.color = 'white';
        });
        saveBtn.addEventListener('click', async () => {
            if (this.scoreFeature && typeof this.scoreFeature.saveScore === 'function') {
                await this.scoreFeature.saveScore(saveBtn);
            }
        });
        modalContent.appendChild(saveBtn);
        
        // Skip Level button
        const skipBtn = document.createElement('button');
        skipBtn.innerText = 'Skip Level';
        skipBtn.style.cssText = buttonStyle;
        skipBtn.addEventListener('mouseover', () => {
            skipBtn.style.background = 'white';
            skipBtn.style.color = 'black';
        });
        skipBtn.addEventListener('mouseout', () => {
            skipBtn.style.background = 'black';
            skipBtn.style.color = 'white';
        });
        skipBtn.addEventListener('click', () => {
            if (this.gameControl?.endLevel) {
                this.gameControl.endLevel();
            }
            modal.remove();
            if (this.gameControl) this.gameControl.resume();
        });
        modalContent.appendChild(skipBtn);
        
        // Toggle Leaderboard button
        const leaderboardBtn = document.createElement('button');
        leaderboardBtn.innerText = 'Toggle Leaderboard';
        leaderboardBtn.style.cssText = buttonStyle;
        leaderboardBtn.addEventListener('mouseover', () => {
            leaderboardBtn.style.background = 'white';
            leaderboardBtn.style.color = 'black';
        });
        leaderboardBtn.addEventListener('mouseout', () => {
            leaderboardBtn.style.background = 'black';
            leaderboardBtn.style.color = 'white';
        });
        leaderboardBtn.addEventListener('click', () => {
            if (this.leaderboardInstance) {
                this.leaderboardInstance.toggleVisibility();
            }
        });
        modalContent.appendChild(leaderboardBtn);
        
        // Close modal when clicking outside or pressing ESC
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
                if (this.gameControl) this.gameControl.resume();
            }
        });
        
        modal.appendChild(modalContent);
        document.body.appendChild(modal);
    }

    static main(environment, GameControlClass) {
        return new AdventureGame(environment, GameControlClass);
    }
}

export default {
    main: (environment, GameControlClass) => AdventureGame.main(environment, GameControlClass)
};
