// combined game.js files from adventure and mansion games

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

    this.initUser();
    const gameLevelClasses = environment.gameLevelClasses;
    // create GameControl using the engine-provided class
    this.gameControl = new GameControlClass(this, gameLevelClasses);
    this.gameControl.start();

    // Try to dynamically load the centralized PauseMenu (prefer the shared one)
    import('./PauseMenu.js')
        .then(mod => {
            try {
                // Allow GameControl to specify PauseMenu options (like counterVar/counterLabel)
                const pmOptions = Object.assign({ parentId: 'gameContainer' }, this.gameControl.pauseMenuOptions || {});
                new mod.default(this.gameControl, pmOptions);
            } catch (e) { console.warn('PauseMenu init failed:', e); }
        })
        .catch(() => {
            // no-op: PauseMenu is optional
        });

    // Try to dynamically load the Leaderboard
    import('../mansionGame/ui/Leaderboard.js')  // Adjust path as needed
        .then(mod => {
            try { 
                new mod.default(this.gameControl, { 
                    apiBaseUrl: 'http://localhost:8585/api/gamer'  // Adjust as needed
                }); 
            }
            catch (e) { console.warn('Leaderboard init failed:', e); }
        })
        .catch(() => {
            // no-op: Leaderboard is optional
        });
}

    static main(environment, GameControlClass) {
        return new GameCore(environment, GameControlClass);
    }

    returnHome() {
        if (this.gameControl && !this.gameControl.currentLevelIndex == 0) {
            try {
                this.gameControl.currentLevel.destroy();
                this.gameControl.cleanupInteractionHandlers();
            } catch (error) {
                console.error("Error during cleanup when returning home:", error);
            }
            this.gameControl.currentLevelIndex = 0;
            this.gameControl.transitionToLevel();
        } else {
            console.warn("Failed to load home level");
        }
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
