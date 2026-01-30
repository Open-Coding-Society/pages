// Adventure Game - Game Core

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
    
    // If GameControlClass provided, use it immediately
    if (GameControlClass) {
        this.gameControl = new GameControlClass(this, gameLevelClasses);
        this.gameControl.start();
    } else {
        // For gamebuilder: defer initialization until GameControl is loaded
        this._initializeGameControlAsync(gameLevelClasses);
        return;
    }

    // Create top control buttons directly using features
    if (!this.environment.disablePauseMenu) {
        this._createTopControls();
    }

    // Try to dynamically load Scoreboard (for adventure game stats syncing)
    import('../../assets/js/adventureGame/Scoreboard.js')
        .then(mod => {
            try {
                const Scoreboard = mod.default || mod.Scoreboard;
                // Set gameControl reference so Scoreboard can update stats
                Scoreboard.gameControl = this.gameControl;
                console.log('Scoreboard gameControl reference set');
            }
            catch (e) { console.debug('Scoreboard init (optional):', e); }
        })
        .catch(() => {
            // no-op: Scoreboard is optional
        });

    // Try to dynamically load the Leaderboard
    import('../features/Leaderboard.js')
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
                    gameName: 'AdventureGame',
                    parentId: parentId
                }); 
            }
            catch (e) { console.warn('Leaderboard init failed:', e); }
        })
        .catch(() => {
            // no-op: Leaderboard is optional
        });
    }

    async _initializeGameControlAsync(gameLevelClasses) {
        try {
            const mod = await import('./GameControl.js');
            const DefaultGameControl = mod.default || mod;
            this.gameControl = new DefaultGameControl(this, gameLevelClasses);
            this.gameControl.start();
            
            // Create top control buttons after GameControl is ready
            if (!this.environment.disablePauseMenu) {
                this._createTopControls();
            }

            // Try to dynamically load the Leaderboard
            import('../features/Leaderboard.js')
                .then(mod => {
                    try {
                        let parentId = 'gameContainer';
                        if (typeof this.gameContainer === 'string') {
                            parentId = this.gameContainer;
                        } else if (this.gameContainer instanceof HTMLElement) {
                            parentId = this.gameContainer.id || 'gameContainer';
                        }
                        // Store leaderboard instance
                        this.leaderboardInstance = new mod.default(this.gameControl, { 
                            gameName: 'AdventureGame',
                            parentId: parentId
                        }); 
                    }
                    catch (e) { console.warn('Leaderboard init failed:', e); }
                })
                .catch(() => {
                    // no-op: Leaderboard is optional
                });
        } catch (err) {
            console.error('Failed to initialize GameControl:', err);
        }
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
                this.gameControl.currentLevel.destroy();
                this.gameControl.cleanupInteractionHandlers();
            } catch (error) {
                console.error("Error during cleanup when returning home:", error);
            }
            this.gameControl.currentLevelIndex--;
            this.gameControl.transitionToLevel();
        } else {
            console.warn("No previous level to load");
        }
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
            import('../features/ScoreFeature.js'),
            import('../features/PauseFeature.js'),
            import('../features/LevelSkipFeature.js')
        ]).then(([ScoreModule, PauseModule, LevelSkipModule]) => {
            const parent = this.gameContainer || document.getElementById('gameContainer') || document.body;
            
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
            
            // Create button bar
            const buttonBar = document.createElement('div');
            buttonBar.className = 'pause-button-bar';
            buttonBar.style.position = 'fixed';
            buttonBar.style.top = '60px';
            buttonBar.style.left = '20px';
            buttonBar.style.display = 'flex';
            buttonBar.style.gap = '10px';
            buttonBar.style.zIndex = '9999';

            // Pause button
            const btnPause = document.createElement('button');
            btnPause.className = 'pause-btn pause-toggle';
            btnPause.innerText = 'Pause';
            btnPause.addEventListener('click', () => {
                if (this.gameControl.isPaused) {
                    this.gameControl.resume();
                    btnPause.innerText = 'Pause';
                } else {
                    this.gameControl.pause();
                    btnPause.innerText = 'Resume';
                }
            });

            // Save Score button - with real save functionality
            const btnSave = document.createElement('button');
            btnSave.className = 'pause-btn save-score';
            btnSave.innerText = 'Save Score';
            
            // Instantiate ScoreFeature for real save functionality
            let scoreFeature = null;
            try {
                scoreFeature = new ScoreModule.default(pauseMenuObj);
            } catch (e) {
                console.warn('ScoreFeature init failed:', e);
            }
            
            // Wire the save button to ScoreFeature.saveScore
            btnSave.addEventListener('click', async () => {
                if (scoreFeature && typeof scoreFeature.saveScore === 'function') {
                    await scoreFeature.saveScore(btnSave);
                } else {
                    console.warn('ScoreFeature saveScore not available');
                }
            });

            // Skip Level button
            const btnSkipLevel = document.createElement('button');
            btnSkipLevel.className = 'pause-btn skip-level';
            btnSkipLevel.innerText = 'Skip Level';
            btnSkipLevel.addEventListener('click', () => {
                if (typeof this.gameControl.endLevel === 'function') {
                    this.gameControl.endLevel();
                } else {
                    // Fallback: synthesize 'L' key
                    const event = new KeyboardEvent('keydown', {
                        key: 'L', code: 'KeyL', keyCode: 76, which: 76, bubbles: true
                    });
                    document.dispatchEvent(event);
                }
            });

            // NEW: Toggle Leaderboard button
            const btnToggleLeaderboard = document.createElement('button');
            btnToggleLeaderboard.className = 'pause-btn toggle-leaderboard';
            btnToggleLeaderboard.innerText = 'Hide Leaderboard';
            btnToggleLeaderboard.addEventListener('click', () => {
                if (this.leaderboardInstance) {
                    this.leaderboardInstance.toggleVisibility();
                    
                    // Update button text based on visibility
                    if (this.leaderboardInstance.isVisible()) {
                        btnToggleLeaderboard.innerText = 'Hide Leaderboard';
                    } else {
                        btnToggleLeaderboard.innerText = 'Show Leaderboard';
                    }
                } else {
                    console.warn('Leaderboard instance not available');
                }
            });

            buttonBar.appendChild(btnPause);
            buttonBar.appendChild(btnSave);
            buttonBar.appendChild(btnSkipLevel);
            buttonBar.appendChild(btnToggleLeaderboard);
            parent.appendChild(buttonBar);
            
        }).catch(err => {
            console.warn('Failed to load control features:', err);
        });
    }

    initUser() {
        // Skip user initialization if no backend URIs are configured (e.g., in gamebuilder embed mode)
        if (!this.pythonURI || this.pythonURI === '') {
            console.log('Skipping user initialization - no backend configured');
            return;
        }

        const pythonURL = this.pythonURI + '/api/id';
        fetch(pythonURL, this.fetchOptions)
            .then(response => {
                if (response.status !== 200) {
                    console.warn("Could not fetch user ID (HTTP " + response.status + "), continuing without user data");
                    return null;
                }
                return response.json();
            })
            .then(data => {
                if (!data) {
                    console.log('No user data available, continuing game without user tracking');
                    return;
                }
                this.uid = data.uid;

                const javaURL = this.javaURI + '/rpg_answer/person/' + this.uid;
                return fetch(javaURL, this.fetchOptions);
            })
            .then(response => {
                if (!response) return;
                if (!response.ok) {
                    console.warn(`Spring server unavailable (${response.status}), continuing without user data`);
                    return null;
                }
                return response.json();
            })
            .then(data => {
                if (!data) return;
                this.id = data.id;
            })
            .catch(error => {
                console.warn("User initialization failed (non-critical):", error.message);
                // Don't stop the game - user tracking is optional
            });
    }
}

export default {
    main: (environment, GameControlClass) => GameCore.main(environment, GameControlClass)
};