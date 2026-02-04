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
        
        // Ensure pause-menu.css is loaded for button styling
        const cssPath = '/assets/css/pause-menu.css';
        if (!document.querySelector(`link[href="${cssPath}"]`)) {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = cssPath;
            document.head.appendChild(link);
        }
        
        const parent = this.gameContainer || document.getElementById('gameContainer') || document.body;
        console.log('Parent element for buttons:', parent);

        // Create pause menu object for features
        const pauseMenuObj = {
            gameControl: this.gameControl,
            options: { parentId: 'gameContainer' },
            counterVar: this.gameControl?.pauseMenuOptions?.counterVar || 'levelsCompleted',
            counterLabelText: this.gameControl?.pauseMenuOptions?.counterLabel || 'Score',
            stats: this.gameControl?.stats || { levelsCompleted: 0, points: 0 },
            get score() {
                const varName = this.counterVar || 'levelsCompleted';
                return (this.stats && this.stats[varName]) || 0;
            },
            scoreVar: this.gameControl?.pauseMenuOptions?.scoreVar || 'levelsCompleted',
            _saveStatusNode: null
        };

        // Dynamically import features
        Promise.all([
            import('../GameEngine/features/ScoreFeature.js'),
            import('../GameEngine/features/PauseFeature.js'),
            import('../GameEngine/features/LevelSkipFeature.js')
        ]).then(([ScoreModule, PauseModule, LevelSkipModule]) => {
            
            console.log('Adventure game features loaded, creating buttons');
            
            // Initialize score feature once
            let scoreFeature = null;
            try {
                scoreFeature = new ScoreModule.default(pauseMenuObj);
                console.log('ScoreFeature initialized:', scoreFeature);
            } catch (e) {
                console.warn('ScoreFeature init failed:', e);
            }
            
            // Create button bar
            const buttonBar = document.createElement('div');
            buttonBar.className = 'pause-button-bar';
            buttonBar.style.position = 'fixed';
            buttonBar.style.top = '80px';
            buttonBar.style.left = '10px';
            buttonBar.style.display = 'flex';
            buttonBar.style.gap = '10px';
            buttonBar.style.alignItems = 'center';
            buttonBar.style.flexWrap = 'wrap';
            buttonBar.style.zIndex = '9999';

            // Settings menu button that opens a modal
            const settingsSummary = document.createElement('button');
            settingsSummary.innerText = 'Settings';
            settingsSummary.style.background = 'black';
            settingsSummary.style.color = 'white';
            settingsSummary.style.padding = '12px 20px';
            settingsSummary.style.fontSize = '16px';
            settingsSummary.style.border = '2px solid white';
            settingsSummary.style.cursor = 'pointer';
            settingsSummary.style.fontFamily = "'Press Start 2P', monospace";
            
            // Create Settings modal when button is clicked
            settingsSummary.addEventListener('click', () => {
                const modal = document.createElement('div');
                modal.id = 'settingsModal';
                modal.style.cssText = `
                    display: flex;
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background-color: rgba(0, 0, 0, 0.8);
                    justify-content: center;
                    align-items: center;
                    z-index: 10000;
                `;
                
                const modalContent = document.createElement('div');
                modalContent.style.background = 'black';
                modalContent.style.color = 'white';
                modalContent.style.padding = '30px';
                modalContent.style.maxWidth = '400px';
                modalContent.style.width = '90%';
                modalContent.style.display = 'flex';
                modalContent.style.flexDirection = 'column';
                modalContent.style.gap = '15px';
                
                const title = document.createElement('h2');
                title.innerText = 'SETTINGS';
                title.style.cssText = `
                    text-align: center;
                    margin: 0 0 15px 0;
                `;
                modalContent.appendChild(title);
                
                // Save Score button
                const modalBtnSave = document.createElement('button');
                modalBtnSave.innerText = 'Save Score';
                modalBtnSave.style.background = 'black';
                
                modalBtnSave.addEventListener('click', async () => {
                    console.log('Save Score clicked, scoreFeature:', scoreFeature);
                    if (scoreFeature && typeof scoreFeature.saveScore === 'function') {
                        await scoreFeature.saveScore(modalBtnSave);
                    } else {
                        console.warn('ScoreFeature saveScore not available');
                    }
                });
                modalContent.appendChild(modalBtnSave);
                
                // Skip Level button
                const modalBtnSkipLevel = document.createElement('button');
                modalBtnSkipLevel.innerText = 'Skip Level';
                modalBtnSkipLevel.style.background = 'black';
                
                modalBtnSkipLevel.addEventListener('click', () => {
                    if (typeof this.gameControl.endLevel === 'function') {
                        this.gameControl.endLevel();
                    } else {
                        const event = new KeyboardEvent('keydown', {
                            key: 'L', code: 'KeyL', keyCode: 76, which: 76, bubbles: true
                        });
                        document.dispatchEvent(event);
                    }
                    modal.remove();
                });
                modalContent.appendChild(modalBtnSkipLevel);
                
                // Toggle Leaderboard button
                const modalBtnLeaderboard = document.createElement('button');
                modalBtnLeaderboard.innerText = 'Show Leaderboard';
                modalBtnLeaderboard.style.background = 'black';
                modalBtnLeaderboard.addEventListener('click', () => {
                    if (this.leaderboardInstance) {
                        this.leaderboardInstance.toggleVisibility();
                        if (this.leaderboardInstance.isVisible()) {
                            modalBtnLeaderboard.innerText = 'Hide Leaderboard';
                        } else {
                            modalBtnLeaderboard.innerText = 'Show Leaderboard';
                        }
                    } else {
                        console.warn('Leaderboard instance not available');
                    }
                });
                modalContent.appendChild(modalBtnLeaderboard);
                
                // Toggle Score Counter button
                const modalBtnScore = document.createElement('button');
                modalBtnScore.innerText = 'Show Score';
                modalBtnScore.style.background = 'black';
                modalBtnScore.addEventListener('click', () => {
                    const sc = document.querySelector('.pause-score-counter');
                    if (sc) {
                        const isHidden = sc.style.display === 'none';
                        sc.style.display = isHidden ? 'block' : 'none';
                        modalBtnScore.innerText = isHidden ? 'Hide Score' : 'Show Score';
                    }
                });
                modalContent.appendChild(modalBtnScore);
                
                // Close button
                const closeBtn = document.createElement('button');
                closeBtn.innerText = 'CLOSE';
                closeBtn.style.background = 'black';
                closeBtn.addEventListener('click', () => {
                    modal.remove();
                });
                modalContent.appendChild(closeBtn);
                
                // Close modal when clicking outside
                modal.addEventListener('click', (e) => {
                    if (e.target === modal) {
                        modal.remove();
                    }
                });
                
                modal.appendChild(modalContent);
                document.body.appendChild(modal);
            });

            buttonBar.appendChild(settingsSummary);
            parent.appendChild(buttonBar);
            
            console.log('Adventure game buttons added to DOM. ButtonBar:', buttonBar, 'Parent:', parent);
            
        }).catch(err => {
            console.warn('Failed to load control features:', err);
        });
    }

    static main(environment, GameControlClass) {
        return new AdventureGame(environment, GameControlClass);
    }
}

export default {
    main: (environment, GameControlClass) => AdventureGame.main(environment, GameControlClass)
};
