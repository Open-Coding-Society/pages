import GameEnvBackground from './GameEngine/GameEnvBackground.js'
import Player from './GameEngine/Player.js'
import Npc from './GameEngine/Npc.js'
import DialogueSystem from './GameEngine/DialogueSystem.js'
import MansionLevel2_Cemetery from './mansionLevel2_Cemetery.js'

// Mansion Level 2 Game with WASD character movement.
class MansionLevel2 {
    constructor(gameEnv) {
        let width = gameEnv.innerWidth;
        let height = gameEnv.innerHeight;
        let path = gameEnv.path;

        // Background data - TEMPORARILY USING LEVEL 4 BACKGROUND FOR TESTING
        const image_background = path + "/images/gamify/MansionLevel2MainBackground.jpeg";
        const image_data_background = {
            name: 'background',
            greeting: "You have entered the haunted graveyard. Beware!",
            src: image_background,
            pixels: {height: 1280, width: 720}
        };

        const sprite_src_mc = path + "/images/gamify/spookMcWalk.png";
        const MC_SCALE_FACTOR = 6;
        const sprite_data_player = {
            id: 'Spook',
            greeting: "Hi, I am Spook.",
            src: sprite_src_mc,
            SCALE_FACTOR: MC_SCALE_FACTOR,
            STEP_FACTOR: 800,
            ANIMATION_RATE: 10,
            INIT_POSITION: { x: 50, y: height - (height / MC_SCALE_FACTOR)},
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
            keypress: { 
                up: 87,    // W key
                left: 65,  // A key
                down: 83,  // S key
                right: 68  // D key
            }
        };

        // Invisible cemetery entrance door (like Level 6)
        const sprite_src_cemetery_door = path + "/images/mansionGame/invisDoorCollisionSprite.png";
        const sprite_data_cemetery_door = {
            id: 'CemeteryDoor',
            greeting: "Enter the cemetery? Press E",
            src: sprite_src_cemetery_door,
            SCALE_FACTOR: 6,
            ANIMATION_RATE: 100,
            pixels: {width: 2029, height: 2025},
            INIT_POSITION: {x: (width * 0.35), y: (height * 0.30)},  // Moved up higher for longer height
            orientation: {rows: 1, columns: 1},
            down: {row: 0, start: 0, columns: 1},
            hitbox: {widthPercentage: 0.5, heightPercentage: 0.9},  // Made much bigger (width: 0.3→0.5, height: 0.7→0.9)
            reaction: function() {
                // Don't show reaction on touch
            },
            interact: function() {
                // Clear any existing dialogue first to prevent duplicates
                if (this.dialogueSystem && this.dialogueSystem.isDialogueOpen()) {
                    this.dialogueSystem.closeDialogue();
                }
                
                // Create a new dialogue system if needed
                if (!this.dialogueSystem) {
                    this.dialogueSystem = new DialogueSystem();
                }
                
                // Show dialogue with buttons (like Level 6)
                this.dialogueSystem.showDialogue(
                    "You've reached the cemetery entrance. Do you dare to enter?",
                    "Cemetery Door",
                    this.spriteData.src
                );
                
                // Add buttons directly to the dialogue
                this.dialogueSystem.addButtons([
                    {
                        text: "Enter Cemetery",
                        primary: true,
                        action: () => {
                            this.dialogueSystem.closeDialogue();
                            
                            // Clean up the current game state
                            if (gameEnv && gameEnv.gameControl) {
                                const gameControl = gameEnv.gameControl;
                                
                                // Show transition screen (like Level 6)
                                const fadeOverlay = document.createElement('div');
                                const fadeInMs = 1500;
                                const fadeOutMs = 1000;
                                Object.assign(fadeOverlay.style, {
                                    position: 'fixed',
                                    top: '0',
                                    left: '0',
                                    width: '100%',
                                    height: '100%',
                                    backgroundColor: 'black',
                                    zIndex: '9999',
                                    opacity: '0',
                                    transition: `opacity ${fadeInMs}ms ease-in-out`,
                                    pointerEvents: 'all'
                                });
                                
                                const transitionText = document.createElement('div');
                                const fullText = 'PREPARE TO FACE A CHALLENGE';
                                transitionText.textContent = fullText;
                                Object.assign(transitionText.style, {
                                    position: 'fixed',
                                    top: '50%',
                                    left: '50%',
                                    transform: 'translate(-50%, -50%)',
                                    color: 'rgba(255, 0, 0, 1)',
                                    fontSize: '6vw',
                                    fontWeight: '800',
                                    textAlign: 'center',
                                    zIndex: '10000',
                                    pointerEvents: 'none',
                                    opacity: '0',
                                    transition: 'opacity 500ms ease-in-out',
                                    textShadow: '0 3px 8px rgba(181, 0, 0, 0.85)',
                                    letterSpacing: '0.05em'
                                });
                                
                                document.body.appendChild(fadeOverlay);
                                document.body.appendChild(transitionText);
                                
                                // Fade in
                                requestAnimationFrame(() => {
                                    fadeOverlay.style.opacity = '1';
                                    transitionText.style.opacity = '1';
                                });

                                setTimeout(() => {
                                    // Clean up current level properly
                                    if (gameControl.currentLevel) {
                                        console.log("Destroying current level...");
                                        gameControl.currentLevel.destroy();
                                    }
                                    
                                    console.log("Setting up Cemetery level...");
                                    
                                    // Store the original level classes for return journey
                                    gameControl._originalLevelClasses = gameControl.levelClasses;
                                    
                                    // Change the level classes to Cemetery
                                    gameControl.levelClasses = [MansionLevel2_Cemetery];
                                    gameControl.currentLevelIndex = 0;
                                    
                                    // Make sure game is not paused
                                    gameControl.isPaused = false;
                                    
                                    // Fade out overlay after transition
                                    setTimeout(() => {
                                        fadeOverlay.style.transition = `opacity ${fadeOutMs}ms ease-in-out`;
                                        transitionText.style.transition = `opacity ${fadeOutMs}ms ease-in-out`;
                                        fadeOverlay.style.opacity = '0';
                                        transitionText.style.opacity = '0';
                                        
                                        setTimeout(() => {
                                            try { document.body.removeChild(fadeOverlay); } catch (e) {}
                                            try { document.body.removeChild(transitionText); } catch (e) {}
                                        }, fadeOutMs + 150);
                                    }, 500);
                                    
                                    // Transition to Cemetery level
                                    console.log("Transitioning to Cemetery level...");
                                    gameControl.transitionToLevel();
                                }, fadeInMs + 500);
                            }
                        }
                    },
                    {
                        text: "Not yet",
                        primary: false,
                        action: () => {
                            this.dialogueSystem.closeDialogue();
                        }
                    }
                ]);
            }
        };

        // Game objects
        this.classes = [
            { class: GameEnvBackground, data: image_data_background },
            { class: Player, data: sprite_data_player },
            { class: Npc, data: sprite_data_cemetery_door }
        ];
    }

    initialize() {
        // Optional: Add any initialization logic here
        console.log("MansionLevel2 initialized");
    }
}

export default MansionLevel2
