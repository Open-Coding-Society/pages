import GameControl from './GameControl.js';
import GameUI from './GameUI.js';
import PauseMenu from './PauseMenu.js';

class Game {
    constructor(environment) {
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

        this.initUser();
        const gameLevelClasses = environment.gameLevelClasses;
        this.gameControl = new GameControl(this, gameLevelClasses);
        
        // Initialize GameUI if configuration is provided
        if (environment.gameUI) {
            this.gameUI = new GameUI(this, environment.gameUI);
            this.gameUI.init();
        }
        
        this.gameControl.start();
        
        // Remove GameControl's escape listener since we're handling it with pauseMenu
        this.gameControl.removeExitKeyListener();
        
        // Create pause menu
        this.pauseMenu = new PauseMenu(this.gameControl);
        
        // Setup Escape key for pause menu toggle
        this._setupEscapeKey();
        
        // Load features from GameEnginev1.5
        this._loadFeatures();
    }



    static main(environment) {
        return new Game(environment);
    }

    initUser() {
        const pythonURL = this.pythonURI + '/api/id';
        fetch(pythonURL, this.fetchOptions)
            .then(response => {
                if (response.status !== 200) {
                    console.warn("HTTP status code: " + response.status + ". User data will not be available.");
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
                    console.warn(`Spring server response: ${response?.status}. User data will not be available.`);
                    return null;
                }
                return response.json();
            })
            .then(data => {
                if (!data) return;
                this.id = data.id;
            })
            .catch(error => {
                console.warn("Could not fetch user data:", error.message, ". Game will continue without user tracking.");
            });
    }

    /**
     * Setup Escape key listener for pause menu toggle
     */
    _setupEscapeKey() {
        if (this.escapeKeyHandler) {
            return; // Already set up
        }
        
        this.escapeKeyHandler = (e) => {
            if (e.key === 'Escape') {
                e.preventDefault();
                
                // Toggle pause menu
                if (this.pauseMenu) {
                    if (this.pauseMenu.isVisible) {
                        this.pauseMenu.hide();
                    } else {
                        this.pauseMenu.show();
                    }
                }
            }
        };
        
        document.addEventListener('keydown', this.escapeKeyHandler);
    }

    /**
     * Load feature modules from GameEnginev1.5
     */
    _loadFeatures() {
        // Load leaderboard
        import('../../GameEnginev1.5/leaderboard.js')
            .then(mod => {
                const Leaderboard = mod.default;
                const parentId = typeof this.gameContainer === 'string' ? this.gameContainer : this.gameContainer?.id || 'gameContainer';
                
                const leaderboardInstance = new Leaderboard(this.gameControl, {
                    gameName: 'Game',
                    parentId: parentId,
                    initiallyHidden: true
                });
                // Store globally for pause menu access
                window.leaderboardInstance = leaderboardInstance;
                this.leaderboardInstance = leaderboardInstance;
                
                // After a brief delay, move the leaderboard widget into pause menu container
                setTimeout(() => {
                    const widget = document.querySelector('.leaderboard-widget');
                    const leaderboardContainer = this.pauseMenu?.leaderboardContainer;
                    if (widget && leaderboardContainer && !leaderboardContainer.contains(widget)) {
                        leaderboardContainer.innerHTML = '';
                        leaderboardContainer.appendChild(widget);
                        widget.classList.remove('initially-hidden');
                    }
                }, 100);
                
                console.log('Leaderboard loaded from GameEnginev1.5');
            })
            .catch(err => console.warn('Could not load Leaderboard:', err));
        
        // Load pause feature
        import('../../GameEnginev1.5/pausefeature.js')
            .then(mod => {
                const PauseFeature = mod.default;
                const pauseMenuObj = {
                    gameControl: this.gameControl,
                    container: this.pauseMenu?.container
                };
                this.gameControl.pauseFeature = new PauseFeature(pauseMenuObj);
                console.log('PauseFeature loaded from GameEnginev1.5');
            })
            .catch(err => console.warn('Could not load PauseFeature:', err));
        
        // Load score feature
        import('../../GameEnginev1.5/scorefeature.js')
            .then(mod => {
                const ScoreFeature = mod.default;
                const pauseMenuObj = {
                    gameControl: this.gameControl,
                    counterLabelText: 'Score',
                    counterVar: 'score',
                    options: {},
                    stats: this.pauseMenu.stats,
                    score: 0,
                    _saveStatusNode: this.pauseMenu._saveStatusNode
                };
                
                const scoreFeature = new ScoreFeature(pauseMenuObj);
                this.gameControl.scoreFeature = scoreFeature;
                // Store globally for pause menu access
                window.scoreFeature = scoreFeature;
                
                console.log('ScoreFeature loaded from GameEnginev1.5');
            })
            .catch(err => console.warn('Could not load ScoreFeature:', err));
        
        // Load level skip feature
        import('../../GameEnginev1.5/levelskipfeature.js')
            .then(mod => {
                const LevelSkipFeature = mod.default;
                const pauseMenuObj = {
                    gameControl: this.gameControl,
                    pauseFeature: this.gameControl?.pauseFeature
                };
                this.gameControl.levelSkipFeature = new LevelSkipFeature(pauseMenuObj);
                console.log('LevelSkipFeature loaded from GameEnginev1.5');
            })
            .catch(err => console.warn('Could not load LevelSkipFeature:', err));
    }
}

export default Game;