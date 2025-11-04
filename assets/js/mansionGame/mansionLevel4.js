// To build GameLevels, each contains GameObjects from below imports
import GameEnvBackground from './GameEngine/GameEnvBackground.js';
import Player from './GameEngine/Player.js';
import GameObject from './GameEngine/GameObject.js';
import DialogueSystem from './GameEngine/DialogueSystem.js';

//Import custom classes from select files
import Barrier from './CustomGameClasses/Barrier.js';
import BlackjackGameManager from './CustomGameClasses/Blackjack.js';
import TriggerZone from './CustomGameClasses/TriggerZone.js';

class MansionLevel4 {
    constructor(gameEnv) {
        let width = gameEnv.innerWidth;
        let height = gameEnv.innerHeight;
        let path = gameEnv.path;

        // Initialize blackjack manager
        this.blackjackManager = new BlackjackGameManager(gameEnv);
        
        // Set up win callback for when player wins the blackjack game
        this.blackjackManager.onWin = () => {
            this.winLevel();
        };
        
        // Track if player is in trigger zone
        this.inTriggerZone = false;
        this.promptVisible = false;

        // Background data
        const image_background = path + "/images/mansionGame/image_lvl4.png";
        const image_data_background = {
            name: 'background',
            greeting: "This is the casino, you will try to gamble your way out of the level, survive as long as possible.",
            src: image_background,
            pixels: {height: 1280, width: 720}
        };

        const sprite_src_mc = path + "/images/gamify/spookMcWalk.png";
        const MC_SCALE_FACTOR = 6;
        const sprite_data_chillguy = {
            id: 'Spook',
            greeting: "Hi, I am Spook.",
            src: sprite_src_mc,
            SCALE_FACTOR: MC_SCALE_FACTOR,
            STEP_FACTOR: 800,
            ANIMATION_RATE: 10,
            INIT_POSITION: { x: (width / 2 - width / (5 * MC_SCALE_FACTOR)), y: height - (height / MC_SCALE_FACTOR)},
            pixels: {height: 2400, width: 3600},
            orientation: {rows: 2, columns: 3},
            down: {row: 1, start: 0, columns: 3},
            downRight: {row: 1, start: 0, columns: 3, rotate: Math.PI/16},
            downLeft: {row: 0, start: 0, columns: 3, rotate: -Math.PI/16},
            left: {row: 0, start: 0, columns: 3},
            right: {row: 1, start: 0, columns: 3},
            up: {row: 1, start: 0, columns: 3},
            upLeft: {row: 0, start: 0, columns: 3, rotate: Math.PI/16},
            upRight: {row: 1, start: 0, columns: 3, rotate: -Math.PI/16},
            hitbox: { widthPercentage: 0.45, heightPercentage: 0.2 },
            keypress: {up: 87, left: 65, down: 83, right: 68} // W, A, S, D
        };

        // Store reference to blackjack manager for use in trigger zone
        const blackjackManager = this.blackjackManager;
        const levelContext = this;

        // Define trigger zone in the illuminated center area
        const triggerZoneData = {
            x: width * 0.35,
            y: height * 0.15,
            width: width * 0.30,
            height: height * 0.40,
            color: 'rgba(255, 215, 0, 0.2)',
            visible: false,
            message: '🎰 Welcome to the Casino! Step into the light to start gambling!',
            onEnter: () => {
                levelContext.inTriggerZone = true;
                levelContext.showPrompt();
            },
            onExit: () => {
                levelContext.inTriggerZone = false;
                levelContext.hidePrompt();
            }
        };

        // Define barrier locations - Creating a simple pathway to the center
        const barrierData = [
            // Outer walls only - keep player contained
            { x: 0, y: 0, width: width, height: 20, visible: true },                    // Top wall
            { x: 0, y: height - 20, width: width, height: 20, visible: true },          // Bottom wall
            { x: 0, y: 0, width: 20, height: height, visible: true },                   // Left wall
            { x: width - 20, y: 0, width: 20, height: height, visible: true }           // Right wall
        ];

        // Initialize game objects
        this.classes = [
            { class: GameEnvBackground, data: image_data_background },
            { class: Player, data: sprite_data_chillguy },
            { class: TriggerZone, data: triggerZoneData },
            ...barrierData.map(data => ({ class: Barrier, data }))
        ];

        this.gameEnv = gameEnv;
        
        // Adding Music
        this.backgroundMusic = new Audio(path + '/audio/mansionGame/SpookieDookie.mp3');
        this.backgroundMusic.loop = true;
        this.backgroundMusic.volume = 0.3;
        this.backgroundMusic.play();
        
        // Setup E key listener
        this.setupKeyListener();
    }

    setupKeyListener() {
        this.keyHandler = (e) => {
            // Check if E key is pressed (key code 69)
            if (e.keyCode === 69 && this.inTriggerZone && !this.blackjackManager.gameActive) {
                this.blackjackManager.startGame();
                this.hidePrompt();
            }
        };
        
        document.addEventListener('keydown', this.keyHandler);
    }

    showPrompt() {
        if (this.promptVisible || this.blackjackManager.gameActive) return;
        
        this.promptVisible = true;
        
        // Create prompt overlay
        this.promptElement = document.createElement('div');
        this.promptElement.id = 'casino-prompt';
        this.promptElement.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0, 0, 0, 0.9);
            border: 3px solid #f39c12;
            border-radius: 15px;
            padding: 30px 50px;
            z-index: 9999;
            text-align: center;
            box-shadow: 0 0 30px rgba(243, 156, 18, 0.8);
            animation: pulse 2s infinite;
        `;
        
        this.promptElement.innerHTML = `
            <style>
                @keyframes pulse {
                    0%, 100% { box-shadow: 0 0 30px rgba(243, 156, 18, 0.8); }
                    50% { box-shadow: 0 0 50px rgba(243, 156, 18, 1); }
                }
            </style>
            <div style="font-size: 48px; margin-bottom: 15px;">🎰</div>
            <h2 style="color: #f39c12; font-size: 32px; margin: 0 0 15px 0; font-weight: bold;">BLACKJACK TABLE</h2>
            <p style="color: white; font-size: 20px; margin: 10px 0;">Win $10,000 to escape!</p>
            <div style="margin-top: 25px; padding: 15px; background: #f39c12; border-radius: 10px;">
                <p style="color: white; font-size: 24px; margin: 0; font-weight: bold;">Press [E] to Enter</p>
            </div>
        `;
        
        document.body.appendChild(this.promptElement);
    }

    hidePrompt() {
        if (!this.promptVisible) return;
        
        this.promptVisible = false;
        
        if (this.promptElement && this.promptElement.parentNode) {
            document.body.removeChild(this.promptElement);
            this.promptElement = null;
        }
    }

    update() {
        // Collision detection removed - it was causing player to be stuck
        // The player now moves freely, only blocked by canvas boundaries
    }
    
    winLevel() {
        console.log("🎉 Level 4 Won!");
        
        // Create victory dialogue with key image
        const dialogueSystem = new DialogueSystem();
        dialogueSystem.showDialogue(
            'You won $10,000 at the casino and earned the golden key! Congratulations!',
            'Victory!',
            this.gameEnv.path + '/images/mansionGame/key_lvl3.png'
        );
        
        dialogueSystem.addButtons([
            {
                text: 'Continue',
                primary: true,
                action: () => {
                    dialogueSystem.closeDialogue();
                    
                    // TODO: Transition to next level (Level 5)
                    // Uncomment when Level 5 is ready
                    /*
                    if (this.gameEnv && this.gameEnv.gameControl) {
                        const gameControl = this.gameEnv.gameControl;
                        // Import Level 5 at the top: import MansionLevel5 from './mansionLevel5.js';
                        gameControl.levelClasses = [MansionLevel5];
                        gameControl.currentLevelIndex = 0;
                        gameControl.transitionToLevel();
                    }
                    */
                    
                    // For now, just show a message
                    alert("Level 4 Complete! (Next level not yet connected)");
                }
            }
        ]);
    }
    
    // Clean up when level is destroyed
    destroy() {
        document.removeEventListener('keydown', this.keyHandler);
        this.hidePrompt();
        if (this.backgroundMusic) {
            this.backgroundMusic.pause();
        }
    }
}

export default MansionLevel4;