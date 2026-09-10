
import GameEnvBackground from '@assets/js/GameEnginev1.1/essentials/GameEnvBackground.js';
import FightingPlayer from './FightingPlayer.js';
import Npc from '@assets/js/GameEnginev1.1/essentials/Npc.js';
import Barrier from '@assets/js/GameEnginev1.1/essentials/Barrier.js';
import Enemy from '@assets/js/GameEnginev1.1/essentials/Enemy.js';
import GameLevelMaze from './GameLevelMaze.js';

/**
 * GameLevelArchery
 * 
 * Defines the configuration for the Archery mini-game level.
 * This class constructs the objects that will exist in the level,
 * including the background, player, NPC, barrier, and moving target.
 * 
 * Each object is described with a configuration object that determines
 * sprite properties, positioning, animations, and gameplay behavior.
 */
class GameLevelArchery {

    /**
     * Friendly name of the game level
     * @static
     * @type {string}
     */
    static friendlyName = "Level 2: Archery";


    /**
     * Creates a new Archery level configuration.
     *
     * @param {GameEnvironment} gameEnv - The main game env object
     */
    constructor(gameEnv) {
        const width = gameEnv.innerWidth;
        const height = gameEnv.innerHeight;
        const path = gameEnv.path;

        const archeryStorageKey = 'castleGame.archeryCompleted';
        const getArcheryCompletion = () => {
            try {
                if (typeof window === 'undefined' || !window.localStorage) {
                    return false;
                }
                const stored = window.localStorage.getItem(archeryStorageKey);
                return stored === 'true';
            } catch (error) {
                return false;
            }
        };
        const setArcheryCompletion = (value) => {
            try {
                if (typeof window === 'undefined' || !window.localStorage) {
                    return;
                }
                window.localStorage.setItem(archeryStorageKey, value ? 'true' : 'false');
            } catch (error) {
                // Ignore storage errors (e.g., private mode)
            }
        };

        if (typeof window !== 'undefined' && window.localStorage) {
            if (window.localStorage.getItem(archeryStorageKey) === null) {
                setArcheryCompletion(false);
            }
        }

        window.archeryGameStarted = false;

        // --- Floor ---
        const image_src_floor = path + "/images/projects/castle-game/grassBackground.png";
        const image_data_floor = {
            name: 'floor',
            src: image_src_floor,
            pixels: { height: 341, width: 498 }
        };

        /**
         * Player character sprite configuration.
         *
         * Represents the main controllable character (knight)
         * The player can move around the map and interact with NPCs. It can also shoot arrows.
         */
        const playerSpriteOptions = {
            gray: path + "/images/projects/castle-game/grayKnight.png",
            green: path + "/images/projects/castle-game/greenKnight.png",
            dark: path + "/images/projects/castle-game/darkKnight.png"
        };
        const playerSkinStorageKey = 'castleGame.playerSkin';
        const getPlayerSpriteSrc = (skinKey) => playerSpriteOptions[skinKey] || playerSpriteOptions.gray;
        const getStoredPlayerSkinKey = () => {
            try {
                if (typeof window === 'undefined' || !window.localStorage) {
                    return 'gray';
                }
                const stored = window.localStorage.getItem(playerSkinStorageKey);
                if (stored && playerSpriteOptions[stored]) {
                    return stored;
                }
                window.localStorage.setItem(playerSkinStorageKey, 'gray');
                return 'gray';
            } catch (error) {
                return 'gray';
            }
        };
        const sprite_src_mc = getPlayerSpriteSrc(getStoredPlayerSkinKey());
        const MC_SCALE_FACTOR = 7;
        const sprite_data_mc = {
            id: 'Knight',
            greeting: "Hi, I am a Knight.",
            src: sprite_src_mc,
            SCALE_FACTOR: MC_SCALE_FACTOR,
            STEP_FACTOR: 500,
            ANIMATION_RATE: 40,
            INIT_POSITION: {
                x: 0.5 * width,
                y: 0.75 * height
            },
            pixels: { height: 432, width: 234 },
            orientation: { rows: 4, columns: 3 },
            down: { row: 0, start: 0, columns: 3 },
            downRight: { row: 2, start: 0, columns: 3, rotate: Math.PI / 16 },
            downLeft: { row: 1, start: 0, columns: 3, rotate: -Math.PI / 16 },
            left: { row: 1, start: 0, columns: 3 },
            right: { row: 2, start: 0, columns: 3 },
            up: { row: 3, start: 0, columns: 3 },
            upLeft: { row: 1, start: 0, columns: 3, rotate: Math.PI / 16 },
            upRight: { row: 2, start: 0, columns: 3, rotate: -Math.PI / 16 },
            hitbox: { widthPercentage: 0.1, heightPercentage: 0.15 },
            keypress: { up: 87, left: 65, down: 83, right: 68 }, // W, A, S, D
        };


        /**
         * Villager NPC configuration:
         *
         * Acts as the  trigger to start the archery mini-game.
         * When the player interacts (presses E), a dialogue appears allowing the player to start or cancel the game.
         */
        const sprite_src_villager = path + "/images/projects/castle-game/villager.png";
        const sprite_greet_villager = "Start the game? Press E";
        const sprite_data_villager = {
            id: 'Villager',
            greeting: sprite_greet_villager,
            src: sprite_src_villager,
            SCALE_FACTOR: 6,
            ANIMATION_RATE: 100,
            pixels: { width: 181, height: 272 },
            INIT_POSITION: { x: 0.75 * width, y: 0.75 * height },
            orientation: { rows: 1, columns: 1 },
            down: { row: 0, start: 0, columns: 1 },
            hitbox: { widthPercentage: 0.1, heightPercentage: 0.2 },
            dialogues: [
                "Are you ready to play some archery?"
            ],
            reaction: function () {
                // Don't show any reaction dialogue - this prevents the first alert
                // The interact function will handle all dialogue instead
            },

            // This is where the interactions for starting the game are handled
            interact: function () {
                // Clear any existing dialogue first to prevent duplicates
                if (this.dialogueSystem && this.dialogueSystem.isDialogueOpen()) {
                    this.dialogueSystem.closeDialogue();
                }

                // Create a new dialogue system if needed
                if (!this.dialogueSystem) {
                    this.dialogueSystem = new DialogueSystem();
                }

                const alreadyCompleted = getArcheryCompletion();

                if (alreadyCompleted) {
                    this.dialogueSystem.showDialogue(
                        "You already beat the archery challenge. Would you like to play again?",
                        "Villager",
                        this.spriteData.src
                    );

                    this.dialogueSystem.addButtons([
                        {
                            text: "Play again",
                            primary: true,
                            action: () => {
                                this.dialogueSystem.closeDialogue();
                                // Remove the barrier
                                const barrier = this.gameEnv.gameObjects.find(obj => obj.canvas && obj.canvas.id === 'archery_barrier');
                                if (barrier) {
                                    barrier.destroy();
                                }

                                // Start the target moving continuously left/right
                                const target = this.gameEnv.gameObjects.find(obj => obj.canvas && obj.canvas.id === 'archery_target');
                                if (target) {
                                    target.velocity = { x: 2, y: 0 }; // Start moving right
                                }

                                // Make the NPC disappear after interaction
                                this.destroy();

                                window.archeryGameStarted = true;
                                window.timeStarted = Date.now() / 1000.0;
                            }
                        },
                        {
                            text: "Continue to the maze",
                            action: () => {
                                this.dialogueSystem.closeDialogue();
                                // Clean up the archery hits counter if it exists
                                if (window.archeryHitsCounter && window.archeryHitsCounter.parentNode) {
                                    window.archeryHitsCounter.parentNode.removeChild(window.archeryHitsCounter);
                                }
                                window.archeryHitsCounter = null;
                                const gameControl = gameEnv.gameControl;
                                const fadeOverlay = document.createElement('div');
                                const fadeInMs = 700;
                                const fadeOutMs = 700;

                                Object.assign(fadeOverlay.style, {
                                    position: 'fixed',
                                    top: '0',
                                    left: '0',
                                    width: '100%',
                                    height: '100%',
                                    backgroundColor: '#000000',
                                    opacity: '0',
                                    zIndex: '10002',
                                    pointerEvents: 'none',
                                    transition: `opacity ${fadeInMs}ms ease-in-out`
                                });

                                try { document.body.appendChild(fadeOverlay); } catch (err) { console.warn('Could not append fade overlay:', err); }

                                const switchToMazeLevel = () => {
                                    try {
                                        // Clean up the archery hits counter before switching levels
                                        if (window.archeryHitsCounter && window.archeryHitsCounter.parentNode) {
                                            window.archeryHitsCounter.parentNode.removeChild(window.archeryHitsCounter);
                                        }
                                        window.archeryHitsCounter = null;
                                        gameControl._originalLevelClasses = gameControl.levelClasses;
                                        gameControl.levelClasses = [GameLevelMaze];
                                        gameControl.currentLevelIndex = 0;
                                        gameControl.isPaused = false;
                                        gameControl.transitionToLevel(); // defined by game engine most likely, forces the level to switch immediately
                                    } catch (err) {
                                        console.warn('Failed to transition to maze level:', err);
                                    }
                                };

                                requestAnimationFrame(() => {
                                    fadeOverlay.style.opacity = '1';
                                });

                                setTimeout(() => {
                                    try { fadeOverlay.remove(); } catch (err) { /* ignore */ }

                                    switchToMazeLevel();

                                    setTimeout(() => {
                                        fadeOverlay.style.transition = `opacity ${fadeOutMs}ms ease-in-out`;
                                        fadeOverlay.style.opacity = '0';

                                        setTimeout(() => {
                                            try { fadeOverlay.remove(); } catch (err) { /* ignore */ }
                                        }, fadeOutMs + 100);
                                    }, 220);
                                }, fadeInMs + 30);
                            }
                        }
                    ]);
                } else {
                    // Show portal dialogue with buttons
                    this.dialogueSystem.showDialogue(
                        "Would you like to start the game?",
                        "Villager",
                        this.spriteData.src
                    );

                    // Add buttons directly to the dialogue
                    this.dialogueSystem.addButtons([
                        {
                            text: "Start",
                            primary: true,
                            action: () => {
                                this.dialogueSystem.closeDialogue();
                                // Remove the barrier
                                const barrier = this.gameEnv.gameObjects.find(obj => obj.canvas && obj.canvas.id === 'archery_barrier');
                                if (barrier) {
                                    barrier.destroy();
                                }

                                // Start the target moving continuously left/right
                                const target = this.gameEnv.gameObjects.find(obj => obj.canvas && obj.canvas.id === 'archery_target');
                                if (target) {
                                    target.velocity = { x: 2, y: 0 }; // Start moving right
                                }

                                // Make the NPC disappear after interaction
                                this.destroy();

                                window.archeryGameStarted = true;
                                window.timeStarted = Date.now() / 1000.0;
                            }
                        }
                    ]);
                }
            }
        };

        /**
         * Invisible barrier preventing the player from accessing the
         * archery range before the game begins.
         */
        const barrier_data = {
            id: 'archery_barrier',
            x: 0,
            y: 0.5 * height,
            width: width,
            height: 20,
            color: 'rgba(0, 0, 0, 0.8)',
            visible: false,
            hitbox: { widthPercentage: 0.0, heightPercentage: 0.0 }
        };

        /**
         * Moving archery target.
         * The object the player must hit with projectiles.
         *
         * - Moves horizontally once the game begins.
         * - Bounces off screen edges.
         * - Gradually increases speed tom ake the challenge harder.
         * - Displays a counter showing remaining hits needed.
         */
        const target_data = {
            id: 'archery_target',
            greeting: "Target",
            src: path + "/images/projects/castle-game/target.png",
            SCALE_FACTOR: 5,
            ANIMATION_RATE: 100,
            pixels: { width: 178, height: 169 },
            INIT_POSITION: { x: 0.5 * width, y: 0.25 * height },
            orientation: { rows: 1, columns: 1 },
            down: { row: 0, start: 0, columns: 1 },
            hitbox: { widthPercentage: 0.0, heightPercentage: 0.0 },
            // Override stayWithinCanvas to prevent default boundary checking
            stayWithinCanvas: function () {
                // Custom boundary handling in update function
            },

            // This is where interactions between the target and projectiles are handled!
            update: function () {
                if (typeof window !== 'undefined' && window.archeryVictory) {
                    if (!this.victoryStored) {
                        setArcheryCompletion(true);
                        this.victoryStored = true;
                    }
                    if (this.counterEl && this.counterEl.parentNode) {
                        this.counterEl.parentNode.removeChild(this.counterEl);
                    }
                    this.counterEl = null;
                    return;
                }
                // Initialize hitsRemaining if not set
                if (this.hitsRemaining === undefined) {
                    this.hitsRemaining = 30;
                }

                // Move the target left/right only if game has started
                if (window.archeryGameStarted) {

                    if (!this.speed) {
                        this.speed = 3;
                    }

                    if (!this.velocity) {
                        this.velocity = { x: this.speed, y: 0 }; // Start moving right
                    }

                    this.position.x += this.velocity.x;

                    // Bounce off edges - check position boundaries
                    // console.log(`Position: ${this.position.x}, Velocity: ${this.velocity.x}, Canvas width: ${this.gameEnv.innerWidth}, Target width: ${this.width}`);

                    if (this.position.x <= 0) {
                        this.velocity.x = this.speed;
                        this.speed += 0.5;
                    } else if (this.position.x + this.width >= this.gameEnv.innerWidth) {
                        this.velocity.x = -this.speed;
                        this.speed += 0.5;
                    }

                    if (this.speed > 7) {
                        this.speed = 7; // cap the speed
                    }
                }

                // counter element
                if (!this.counterEl) {
                    this.counterEl = document.createElement('div');
                    this.counterEl.id = 'archery-hits-remaining';
                    this.counterEl.style.position = 'absolute';
                    this.counterEl.style.right = '24px';
                    this.counterEl.style.bottom = '20px';
                    this.counterEl.style.color = 'red';
                    this.counterEl.style.font = 'bold 18px monospace';
                    this.counterEl.style.textAlign = 'right';
                    this.counterEl.style.pointerEvents = 'none';
                    this.counterEl.style.userSelect = 'none';
                    this.counterEl.style.zIndex = '10001';
                    const container =
                        this.gameEnv?.container ||
                        this.gameEnv?.gameContainer ||
                        document.getElementById('gameContainer') ||
                        document.body;
                    if (container) {
                        const computed = window.getComputedStyle(container);
                        if (computed.position === 'static') {
                            container.style.position = 'relative';
                        }
                        container.appendChild(this.counterEl);
                    }
                    if (typeof window !== 'undefined') {
                        window.archeryHitsCounter = this.counterEl;
                    }
                }

                // Update counter text without moving it around
                this.counterEl.innerText = this.hitsRemaining;
            }
        };

        this.classes = [
            { class: GameEnvBackground, data: image_data_floor },
            { class: FightingPlayer, data: sprite_data_mc },
            { class: Npc, data: sprite_data_villager },
            { class: Barrier, data: barrier_data },
            { class: Enemy, data: target_data },
        ];
    }
}

export default GameLevelArchery;
