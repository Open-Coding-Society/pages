import GameControl from './GameControl.js';
import Multiplayer from './Multiplayer.js';

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
        this.username = null;
        this.gameName = this._extractGameName();

        // Preserve original level set so we can return to start (plains/zombie) after final levels
        this.initialLevelClasses = environment.gameLevelClasses;

        this.initUser();
        const gameLevelClasses = environment.gameLevelClasses;
        this.gameControl = new GameControl(this, gameLevelClasses);
        this.gameControl.start();
        
        // Initialize multiplayer after a short delay to ensure user is loaded
        setTimeout(() => this.initMultiplayer(), 500);
    }

    static main(environment) {
        return new Game(environment);
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
                this.username = data.username || `player_${this.uid}`;

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

    initMultiplayer() {
        // Initialize multiplayer with your Java backend
        this.multiplayer = new Multiplayer(this, 4, {
            apiUrl: this.javaURI,
            useWebSocket: false,
            useLocal: true
        });
        this.multiplayer.init();
        console.log('[Game] Multiplayer initialized');
    }

    // Return to the first level sequence when all levels are done or skip is used on the final level
    returnHome() {
        if (!this.gameControl || !this.initialLevelClasses || !this.initialLevelClasses.length) return;
        this.gameControl.levelClasses = this.initialLevelClasses;
        this.gameControl.currentLevelIndex = 0;
        this.gameControl.isPaused = false;
        this.gameControl.transitionToLevel();
    }

    // Extract game name from the current URL pathname
    _extractGameName() {
        if (typeof window === 'undefined') return 'unknown';
        const pathname = window.location.pathname;
        // Extract game name from URL like /gamify/adventureGame or /gamify/mansionGame
        const match = pathname.match(/\/(\w+Game)/);
        return match ? match[1] : 'unknown';
    }
}

export default Game;