// Mansion Game - Game Core

class GameCore {
    constructor(environment, GameControlClass) {
    this.environment = environment;
    this.path = environment.path;
    this.gameContainer = environment.gameContainer;
    this.gameCanvas = environment.gameCanvas;
    this.pythonURI = environment.pythonURI;
    this.javaURI = environment.javaURI;
    this.fetchOptions = environment.fetchOptions;
    this.uid = null;
    this.id = null;
    this.gname = null;

    // Snapshot the starting level list so we can reliably reset after the final level
    this.initialLevelClasses = [...(environment.gameLevelClasses || [])];

    this.initUser();
    const gameLevelClasses = [...this.initialLevelClasses];
    
    // Store leaderboard instance reference
    this.leaderboardInstance = null;
    
    // create GameControl using the engine-provided class
    this.gameControl = new GameControlClass(this, gameLevelClasses);
    this.gameControl.start();
    // Initialize PauseFeature for handling pause/resume
    this._initializePauseFeature();
    // Setup Escape key for pause/resume
    this._setupEscapeKey();

    // Create top control buttons (unless disabled for game runner/builder)
    if (!this.environment.disablePauseMenu) {
        this._createTopControls();
    }

    // Try to dynamically load the Leaderboard
    import('../../GameEngine/features/Leaderboard.js')
        .then(mod => {
            try {
                // Get the actual container element from gameContainer
                let parentId = 'gameContainer'; // default
                
                // If gameContainer is a string ID, use it directly
                if (typeof this.gameContainer === 'string') {
                    parentId = this.gameContainer;
                }
                // If gameContainer is an HTMLElement, get its ID
                else if (this.gameContainer instanceof HTMLElement) {
                    parentId = this.gameContainer.id || 'gameContainer';
                }
                
                // Store leaderboard instance
                this.leaderboardInstance = new mod.default(this.gameControl, { 
                    gameName: 'MansionGame',
                    parentId: parentId
                }); 
            }
            catch (e) { console.warn('Leaderboard init failed:', e); }
        })
        .catch(() => {
            // no-op: Leaderboard is optional
        });
}

    /**
     * Initialize PauseFeature for handling pause/resume logic
     */
    _initializePauseFeature() {
        if (!this.gameControl) return;
        
        try {
            import('../../GameEngine/features/PauseFeature.js').then(mod => {
                const PauseFeature = mod.default;
                const pauseMenuObj = {
                    gameControl: this.gameControl,
                    container: null
                };
                this.gameControl.pauseFeature = new PauseFeature(pauseMenuObj);
            }).catch(err => {
                console.warn('Failed to load PauseFeature:', err);
            });
        } catch (err) {
            console.warn('Error initializing PauseFeature:', err);
        }
    }

    /**
     * Setup Escape key listener for pause/resume functionality.
     * This always works regardless of whether pause control buttons are enabled.
     */
    _setupEscapeKey() {
        if (this.escapeKeyHandler) {
            // Already set up, don't add duplicate listeners
            return;
        }
        
        this.escapeKeyHandler = (f) => {
            if (f.key === 'Escape') {
                f.preventDefault();
                if (this.gameControl && this.gameControl.isPaused) {
                    this.gameControl.resume();
                } else if (this.gameControl) {
                    this.gameControl.pause();
                }
            }
        };
        
        document.addEventListener('keydown', this.escapeKeyHandler);
    }

    _createTopControls() {
        // Ensure pause-menu.css is loaded for button styling
        const cssPath = '/assets/css/pause-menu.css';
        if (!document.querySelector(`link[href="${cssPath}"]`)) {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = cssPath;
            document.head.appendChild(link);
        }

        // Dynamically import the features and create controls
        Promise.all([
            import('../../GameEngine/features/ScoreFeature.js'),
            import('../../GameEngine/features/PauseFeature.js'),
            import('../../GameEngine/features/LevelSkipFeature.js'),
            import('./cheats.js')
        ]).then(([ScoreModule, PauseModule, LevelSkipModule, CheatsModule]) => {
            const parent = this.gameContainer || document.getElementById('gameContainer') || document.body;            
            // Ensure parent has proper positioning context for fixed elements
            if (parent !== document.body) {
                parent.style.position = 'relative';
            }
            
            // Initialize footer layout with level navigation and cheats menu
            CheatsModule.addLevelNavigationButtons(this);
            
            // Create a lightweight pause menu object that ScoreFeature can use
            const pauseMenuObj = {
                gameControl: this.gameControl,
                options: { parentId: 'gameContainer' },
                counterVar: this.gameControl.pauseMenuOptions?.counterVar || 'levelsCompleted',
                counterLabelText: this.gameControl.pauseMenuOptions?.counterLabel || 'Score',
                stats: this.gameControl.stats || { levelsCompleted: 0, points: 0 },
                // Use getter to dynamically pull score from stats
                get score() {
                    const varName = this.counterVar || 'levelsCompleted';
                    return (this.stats && this.stats[varName]) || 0;
                },
                scoreVar: this.gameControl.pauseMenuOptions?.scoreVar || 'levelsCompleted',
                _saveStatusNode: null
            };

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
                if (document.getElementById('settingsModal')) return;

                const pauseGame = () => {
                    if (this.gameControl?.pauseFeature?.show) {
                        this.gameControl.pauseFeature.show();
                    } else if (this.gameControl) {
                        this.gameControl.pause();
                    }
                };

                const resumeGame = () => {
                    if (this.gameControl?.pauseFeature?.hide) {
                        this.gameControl.pauseFeature.hide();
                    } else if (this.gameControl) {
                        this.gameControl.resume();
                    }
                };

                pauseGame();

                // Create modal overlay
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
                
                // Create modal content
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
                
                // Modal title
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
                
                // Save Score button for modal
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
                
                // Instantiate ScoreFeature for real save functionality
                let scoreFeature = null;
                try {
                    scoreFeature = new ScoreModule.default(pauseMenuObj);
                } catch (e) {
                    console.warn('ScoreFeature init failed:', e);
                }
                
                modalBtnSave.addEventListener('click', async () => {
                    if (scoreFeature && typeof scoreFeature.saveScore === 'function') {
                        await scoreFeature.saveScore(modalBtnSave);
                    } else {
                        console.warn('ScoreFeature saveScore not available');
                    }
                });
                modalContent.appendChild(modalBtnSave);
                
                // Skip Level button for modal
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
                    modal.remove();
                    resumeGame();
                });
                modalContent.appendChild(modalBtnSkipLevel);
                
                // Toggle Leaderboard button
                const modalBtnLeaderboard = document.createElement('button');
                modalBtnLeaderboard.innerText = 'Show Leaderboard';
                modalBtnLeaderboard.style.cssText = `
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
                modalBtnScore.style.cssText = `
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
                    modal.remove();
                    resumeGame();
                });
                modalContent.appendChild(closeBtn);
                
                // Close modal when clicking outside
                modal.addEventListener('click', (e) => {
                    if (e.target === modal) {
                        modal.remove();
                        resumeGame();
                    }
                });
                
                modal.appendChild(modalContent);
                document.body.appendChild(modal);
            });

            // Place Settings button in the left-of-home container
            const leftContainer = document.getElementById('mansion-game-controls-container');
            if (leftContainer) {
                leftContainer.appendChild(settingsSummary);
                console.log('Settings modal placed in footer left container');
            } else {
                console.warn('mansion-game-controls-container not found, using default placement');
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
                buttonBar.appendChild(settingsSummary);
                parent.appendChild(buttonBar);
            }
            
        }).catch(err => {
            console.warn('Failed to load control features:', err);
        });
    }

    static main(environment, GameControlClass) {
        return new GameCore(environment, GameControlClass);
    }

    returnHome() {
        if (!this.gameControl || !this.initialLevelClasses.length) return;

        try {
            if (this.gameControl.currentLevel && typeof this.gameControl.currentLevel.destroy === 'function') {
                this.gameControl.currentLevel.destroy();
            }
            this.gameControl.cleanupInteractionHandlers();
        } catch (error) {
            console.error("Error during cleanup when returning home:", error);
        }

        // Restore the original level order and restart from the first one
        this.gameControl.levelClasses = [...this.initialLevelClasses];
        this.gameControl.currentLevelIndex = 0;
        this.gameControl.isPaused = false;
        this.gameControl.transitionToLevel();
    }

    loadNextLevel() {
        if (this.gameControl && this.gameControl.currentLevel) {
            this.gameControl.currentLevel.continue = false;
            console.log("Loading next level...");
        } else {
            console.warn("GameControl or currentLevel not available");
        }
    }

    loadPreviousLevel() {
        if (this.gameControl && this.gameControl.currentLevelIndex > 0) {
            try {
                if (this.gameControl.currentLevel && typeof this.gameControl.currentLevel.destroy === 'function') {
                    this.gameControl.currentLevel.destroy();
                }
                this.gameControl.cleanupInteractionHandlers();
            } catch (error) {
                console.error("Error during cleanup when loading previous level:", error);
            }
            this.gameControl.currentLevelIndex--;
            this.gameControl.transitionToLevel();
        } else {
            console.warn("No previous level to load");
        }
    }

    initUser() {
        const pythonURL = this.pythonURI + '/api/id';
        fetch(pythonURL, this.fetchOptions)
            .then(response => {
                if (response.status !== 200) {
                    console.error("HTTP status code: " + response.status);
                    return null;
                }
                return response.json();
            })
            .then(data => {
                if (!data) return;
                this.uid = data.uid;

                const javaURL = this.javaURI + '/rpg_answer/person/' + this.uid;
                return fetch(javaURL, this.fetchOptions);
            })
            .then(response => {
                if (!response || !response.ok) {
                    throw new Error(`Spring server response: ${response?.status}`);
                }
                return response.json();
            })
            .then(data => {
                if (!data) return;
                this.id = data.id;
            })
            .catch(error => {
                console.error("Error:", error);
            });
    }
}

export default {
    main: (environment, GameControlClass) => GameCore.main(environment, GameControlClass)
};