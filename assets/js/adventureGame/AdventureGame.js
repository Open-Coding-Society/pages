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
            buttonBar.style.top = '60px';
            buttonBar.style.left = '20px';
            buttonBar.style.display = 'flex';
            buttonBar.style.gap = '10px';
            buttonBar.style.alignItems = 'center';
            buttonBar.style.flexWrap = 'wrap';
            buttonBar.style.zIndex = '9999';

            // Settings menu button that opens a modal
            const settingsSummary = document.createElement('button');
            settingsSummary.className = 'medium filledHighlight primary';
            settingsSummary.innerText = 'Settings';
            settingsSummary.style.cssText = `
                background-color: #a46ae3ff;
                font-weight: bold;
                font-size: 12px;
                font: 'Press Start 2P', monospace;
            `;
            
            // Create Settings modal when button is clicked
            settingsSummary.addEventListener('click', () => {
                if (document.getElementById('settingsModal')) {
                    document.getElementById('settingsModal').style.display = 'flex';
                    return;
                }
                
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
                    backdrop-filter: blur(5px);
                `;
                
                const modalContent = document.createElement('div');
                modalContent.style.cssText = `
                    background: linear-gradient(145deg, #2c3e50, #34495e);
                    border: 4px solid #a46ae3ff;
                    border-radius: 15px;
                    padding: 30px;
                    max-width: 400px;
                    width: 90%;
                    box-shadow: 0 0 30px rgba(164, 106, 227, 0.5);
                    font-family: 'Press Start 2P', monospace;
                    color: #ecf0f1;
                    display: flex;
                    flex-direction: column;
                    gap: 15px;
                `;
                
                const title = document.createElement('h2');
                title.innerText = '⚙️ SETTINGS ⚙️';
                title.style.cssText = `
                    text-align: center;
                    color: #a46ae3ff;
                    margin: 0 0 15px 0;
                    font-size: 18px;
                    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
                `;
                modalContent.appendChild(title);
                
                // Save Score button
                const modalBtnSave = document.createElement('button');
                modalBtnSave.innerText = 'Save Score';
                modalBtnSave.style.cssText = `
                    background: linear-gradient(145deg, #34495e, #2c3e50);
                    color: #ecf0f1;
                    border: 2px solid #a46ae3ff;
                    border-radius: 8px;
                    padding: 10px 12px;
                    font-size: 11px;
                    font-family: 'Press Start 2P', monospace;
                    font-weight: bold;
                    cursor: pointer;
                    width: 100%;
                `;
                
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
                modalBtnSkipLevel.style.cssText = `
                    background: linear-gradient(145deg, #34495e, #2c3e50);
                    color: #ecf0f1;
                    border: 2px solid #a46ae3ff;
                    border-radius: 8px;
                    padding: 10px 12px;
                    font-size: 11px;
                    font-family: 'Press Start 2P', monospace;
                    font-weight: bold;
                    cursor: pointer;
                    width: 100%;
                `;
                
                modalBtnSkipLevel.addEventListener('click', () => {
                    if (typeof this.gameControl.endLevel === 'function') {
                        this.gameControl.endLevel();
                    } else {
                        const event = new KeyboardEvent('keydown', {
                            key: 'L', code: 'KeyL', keyCode: 76, which: 76, bubbles: true
                        });
                        document.dispatchEvent(event);
                    }
                    modal.style.display = 'none';
                });
                modalContent.appendChild(modalBtnSkipLevel);
                
                // Close button
                const closeBtn = document.createElement('button');
                closeBtn.innerText = '✕ CLOSE';
                closeBtn.style.cssText = `
                    background: linear-gradient(145deg, #34495e, #2c3e50);
                    color: #ecf0f1;
                    border: 2px solid #e67e22;
                    border-radius: 8px;
                    padding: 10px 12px;
                    font-size: 11px;
                    font-family: 'Press Start 2P', monospace;
                    font-weight: bold;
                    cursor: pointer;
                    width: 100%;
                    margin-top: 10px;
                `;
                closeBtn.addEventListener('click', () => {
                    modal.style.display = 'none';
                });
                modalContent.appendChild(closeBtn);
                
                modal.addEventListener('click', (e) => {
                    if (e.target === modal) {
                        modal.style.display = 'none';
                    }
                });
                
                modal.appendChild(modalContent);
                document.body.appendChild(modal);
            });

            // Toggle Leaderboard button
            const btnToggleLeaderboard = document.createElement('button');
            btnToggleLeaderboard.className = 'medium filledHighlight primary';
            btnToggleLeaderboard.innerText = 'Show Leaderboard';
            btnToggleLeaderboard.style.cssText = `
                background-color: #e67e22;
                font-weight: bold;
                font-size: 12px;
                font: 'Press Start 2P', monospace;
            `;
            btnToggleLeaderboard.addEventListener('click', () => {
                if (this.leaderboardInstance) {
                    this.leaderboardInstance.toggleVisibility();
                    
                    if (this.leaderboardInstance.isVisible()) {
                        btnToggleLeaderboard.innerText = 'Hide Leaderboard';
                    } else {
                        btnToggleLeaderboard.innerText = 'Show Leaderboard';
                    }
                } else {
                    console.warn('Leaderboard instance not available');
                }
            });

            buttonBar.appendChild(settingsSummary);
            buttonBar.appendChild(btnToggleLeaderboard);
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
