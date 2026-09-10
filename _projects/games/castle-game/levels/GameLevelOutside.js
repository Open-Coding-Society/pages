
import GameEnvBackground from '@assets/js/GameEnginev1.1/essentials/GameEnvBackground.js';
import Player from '@assets/js/GameEnginev1.1/essentials/Player.js';
import Npc from '@assets/js/GameEnginev1.1/essentials/Npc.js';
import AiNpc from '@assets/js/GameEnginev1.1/essentials/AiNpc.js';
import GameLevelArchery from './GameLevelArchery.js';
import SpriteSheetCoin from './SpriteSheetCoin.js';
import SplineBarrier from './SplineBarrier.js';

/**
 * GameLevelOutside
 * 
 * Defines the configuration for the Outside mini-game level.
 * This class constructs the objects that will exist in the level,
 * including the background, player, NPC, barrier, and moving target.
 * 
 * Each object is described with a configuration object that determines
 * sprite properties, positioning, animations, and gameplay behavior.
 */
class GameLevelOutside {


    /**
     * Friendly name of the game level
     * @static
     * @type {string}
     */
    static friendlyName = "Level 1: Castle Grounds";

    /**
     * Creates a new Outside level configuration.
     *
     * @param {GameEnvironment} gameEnv - The main game env object
     */
    constructor(gameEnv) {
        const width = gameEnv.innerWidth;
        const height = gameEnv.innerHeight;
        const path = gameEnv.path;

        // --- Floor ---
        const image_src_floor = path + "/images/projects/castle-game/castleOutsideV2.png";
        const image_data_floor = {
            name: 'floor',
            src: image_src_floor,
            pixels: { height: 989, width: 1582 }
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
        const setStoredPlayerSkinKey = (skinKey) => {
            try {
                if (typeof window === 'undefined' || !window.localStorage) {
                    return;
                }
                const normalized = playerSpriteOptions[skinKey] ? skinKey : 'gray';
                window.localStorage.setItem(playerSkinStorageKey, normalized);
            } catch (error) {
                // Ignore storage errors (e.g., private mode)
            }
        };
        const applyPlayerSprite = (player, skinKey) => {
            const spriteSrc = getPlayerSpriteSrc(skinKey);
            if (!player || !spriteSrc) return;
            if (player.spriteData?.src === spriteSrc) {
                setStoredPlayerSkinKey(skinKey);
                return;
            }

            const newSpriteSheet = new Image();
            newSpriteSheet.onload = () => {
                player.spriteSheet = newSpriteSheet;
                player.spriteReady = true;
                player.spriteData = { ...(player.spriteData || {}), src: spriteSrc };
                player.data = player.spriteData;
                player.frameIndex = 0;
                player.frameCounter = 0;
                player.resize();
                setStoredPlayerSkinKey(skinKey);
            };
            newSpriteSheet.onerror = (error) => {
                console.warn('Failed to load player spritesheet:', spriteSrc, error);
            };
            newSpriteSheet.src = spriteSrc;
        };
        const sprite_src_mc = getPlayerSpriteSrc(getStoredPlayerSkinKey());
        const MC_SCALE_FACTOR = 15;
        const sprite_data_mc = {
            id: 'Knight',
            greeting: "Hi, I am a Knight.",
            src: sprite_src_mc,
            SCALE_FACTOR: MC_SCALE_FACTOR,
            STEP_FACTOR: 1500,
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


        const sir_morty = path + "/images/projects/castle-game/mortyKnight.png";
        const sir_morty_greeting = "Hello! I'm Sir Morty!";
        const sir_morty_data = {
            id: "Sir Morty",
            greeting: sir_morty_greeting,
            src: sir_morty,
            SCALE_FACTOR: 7,
            ANIMATION_RATE: 40,
            pixels: { height: 864, width: 468 },
            INIT_POSITION: { x: 1259/1667 * width, y: 430/1137 * height },    
            interactDistance: 20,        
            orientation: { rows: 4, columns: 3 },
            // LOCK: use ONLY the 4th row (index 3) for every direction/state
            down: { row: 0, start: 0, columns: 3 },
            hitbox: { widthPercentage: 0.2, heightPercentage: 0.2 },
            // AI-specific properties (required for AiNpc utility)
            expertise: "default",              // Topic area for backend
            chatHistory: [],                   // Conversation memory
            dialogues: [                       // Random greetings
                "Enter the castle if you dare!",
                "The Dark Knight awaits inside.",
                "I heard there's a treasure in the castle.",
                "Beware of the traps in the castle!",
                "The castle has stood for centuries."
            ],
            knowledgeBase: {                   // Context hints for AI
                default: [
                    {
                        question: "What is inside the castle?",
                        answer: "Inside the castle lays a prisoner who has been locked away for years. The Dark Knight guards the castle and challenges anyone who dares to enter with an archery test, a maze, and a showdown inside the fortress."
                    },
                    {
                        question: "Who are you?",
                        answer: "I am Sir Morty, a brave knight of the castle. Enter or recieve a .55! Code code code!"
                    },
                    {
                        question: "How do I win the game?",
                        answer: "To win the game, you need to successfully navigate through the castle grounds, complete the archery challenge, solve the maze, and defeat the Dark Knight in the fortress. Only then will you be able to free the prisoner and claim victory!"
                    },
                    {
                        question: "Any tips for the archery challenge?",
                        answer: "In the archery challenge, timing and precision are key. Pay attention to the movement patterns of the targets and try to anticipate their next move. Practice your aim and don't be afraid to take a few shots to get a feel for the mechanics. Good luck!"
                    },
                    {
                        question: "What can you tell me about the Dark Knight?",
                        answer: "The Dark Knight is a formidable opponent who guards the castle's inner sanctum. He is known for his archery skills and strategic mind. To defeat him, you'll need to be quick on your feet and have a solid strategy. Study his movements and look for openings to strike. Stay determined and you might just come out victorious!"
                    },
                    {
                        question: "Can you give me a hint for the maze?",
                        answer: "The maze can be tricky, but keep an eye out for subtle visual cues that might indicate the correct path. Sometimes the walls themselves can give you hints, like cracks or moss. Take your time and don't rush through it. If you get lost, try retracing your steps and look for patterns in the layout. You can do it!"
                    },
                    {
                        question: "Is there anything else I should know about the castle?",
                        answer: "The castle is full of secrets and hidden passages. Explore every nook and cranny, and you might find something that gives you an edge in your quest. Also, remember that the castle has a rich history, and learning about it might provide insights into how to navigate its challenges. Stay curious and keep exploring!"
                    }
                ]
            },
            // Orchestrator: Handle collision/proximity reactions
            reaction: function () {
                if (this.dialogueSystem) {
                    this.showReactionDialogue();
                } else {
                    console.log(sir_morty_greeting);
                }
            },
            // Orchestrator: Handle player interaction (E key press)
            interact: function () {
                // Delegate to AiNpc utility for full AI conversation interface
                AiNpc.showInteraction(this);
            }
        };


        /**
         * DarkKnight NPC configuration:
         *
         * Acts as the  trigger to start the archery mini-game.
         * When the player interacts (presses E), a dialogue appears allowing the player to start or cancel the game.
         */
        const sprite_src_darkKnight = path + "/images/projects/castle-game/darkKnight.png";
        const sprite_greet_darkKnight = "Start the game? Press E";
        const sprite_data_darkKnight = {
            id: 'DarkKnight',
            greeting: sprite_greet_darkKnight,
            src: sprite_src_darkKnight,
            SCALE_FACTOR: 12,
            ANIMATION_RATE: 40,
            pixels: { width: 242, height: 432 },
            INIT_POSITION: { x: 0.49 * width, y: 0.33 * height },
            orientation: { rows: 4, columns: 3 },
            down: { row: 0, start: 0, columns: 3 },
            left: { row: 1, start: 0, columns: 3 },
            right: { row: 2, start: 0, columns: 3 },
            up: { row: 3, start: 0, columns: 3 },
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

                // Show portal dialogue with buttons
                this.dialogueSystem.showDialogue(
                    "Are you ready to enter the castle?",
                    "DarkKnight",
                    this.spriteData.src
                );

                // Add buttons directly to the dialogue
                this.dialogueSystem.addButtons([
                    {
                        text: "Start",
                        primary: true,
                        action: () => {
                            this.dialogueSystem.closeDialogue();

                            this.dialogueSystem.closeDialogue();

                            // Clean up the current game state
                            if (gameEnv && gameEnv.gameControl) {
                                // Store reference to the current game control
                                const gameControl = gameEnv.gameControl;

                                // Create fade overlay for transition
                                const fadeOverlay = document.createElement('div');
                                const fadeInMs = 2000; // longer fade in
                                const fadeOutMs = 1200; // fade out duration
                                let starFrameId = null;
                                let starResizeHandler = null;
                                // Reset the battle room fade flag
                                window.__startFadeComplete = false;
                                Object.assign(fadeOverlay.style, {
                                    position: 'fixed',
                                    top: '0',
                                    left: '0',
                                    width: '100%',
                                    height: '100%',
                                    backgroundColor: 'rgba(0, 0, 0, 0.35)',
                                    opacity: '0',
                                    transition: `opacity ${fadeInMs}ms ease-in-out`,
                                    zIndex: '9999'
                                });
                                document.body.appendChild(fadeOverlay);

                                // Parallax starfield backdrop for the transition screen.
                                const starCanvas = document.createElement('canvas');
                                const starCtx = starCanvas.getContext('2d');
                                Object.assign(starCanvas.style, {
                                    position: 'fixed',
                                    top: '0',
                                    left: '0',
                                    width: '100%',
                                    height: '100%',
                                    zIndex: '9998',
                                    pointerEvents: 'none',
                                    opacity: '0',
                                    transition: 'opacity 600ms ease-in-out'
                                });
                                document.body.appendChild(starCanvas);

                                const starLayers = [
                                    { count: 140, speed: 0.25, size: [0.6, 1.4], alpha: [0.2, 0.5] },
                                    { count: 80, speed: 0.6, size: [1.0, 2.2], alpha: [0.4, 0.8] },
                                    { count: 35, speed: 1.1, size: [1.6, 3.4], alpha: [0.5, 0.9] }
                                ];

                                const starState = starLayers.map(layer => ({
                                    speed: layer.speed,
                                    stars: Array.from({ length: layer.count }, () => ({
                                        x: Math.random(),
                                        y: Math.random(),
                                        r: layer.size[0] + Math.random() * (layer.size[1] - layer.size[0]),
                                        a: layer.alpha[0] + Math.random() * (layer.alpha[1] - layer.alpha[0])
                                    }))
                                }));

                                const resizeStars = () => {
                                    starCanvas.width = window.innerWidth;
                                    starCanvas.height = window.innerHeight;
                                };

                                const drawStars = () => {
                                    if (!starCtx) return;
                                    const w = starCanvas.width;
                                    const h = starCanvas.height;
                                    starCtx.clearRect(0, 0, w, h);

                                    const gradient = starCtx.createRadialGradient(
                                        w * 0.5, h * 0.35, 0, w * 0.5, h * 0.35, Math.max(w, h) * 0.7
                                    );
                                    gradient.addColorStop(0, 'rgba(40, 70, 120, 0.35)');
                                    gradient.addColorStop(1, 'rgba(0, 0, 10, 0.95)');
                                    starCtx.fillStyle = gradient;
                                    starCtx.fillRect(0, 0, w, h);

                                    starState.forEach(layer => {
                                        layer.stars.forEach(star => {
                                            star.y += layer.speed / h;
                                            if (star.y > 1) {
                                                star.y = 0;
                                                star.x = Math.random();
                                            }
                                            starCtx.fillStyle = `rgba(200, 220, 255, ${star.a})`;
                                            starCtx.beginPath();
                                            starCtx.arc(star.x * w, star.y * h, star.r, 0, Math.PI * 2);
                                            starCtx.fill();
                                        });
                                    });

                                    starFrameId = requestAnimationFrame(drawStars);
                                };

                                resizeStars();
                                starResizeHandler = () => resizeStars();
                                window.addEventListener('resize', starResizeHandler);
                                drawStars();


                                console.log("Starting battle level transition...");

                                // Start the starfield and text first, then fade in the backdrop.
                                requestAnimationFrame(() => {

                                    // Mark that the battle-room fade-complete flag is not yet set.
                                    // This flag will be set to true once the overlay is fully removed
                                    // so enemies in the battle room can wait for the screen to finish
                                    // fading before they begin moving/attacking.
                                    try { window.__startFadeComplete = false; } catch (e) { }

                                    // Load decorative medieval fonts once so transition dialogue is on-theme.
                                    if (!document.getElementById('castle-medieval-fonts')) {
                                        const fontLink = document.createElement('link');
                                        fontLink.id = 'castle-medieval-fonts';
                                        fontLink.rel = 'stylesheet';
                                        fontLink.href = 'https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@700;900&family=Uncial+Antiqua&display=swap';
                                        document.head.appendChild(fontLink);
                                    }

                                    // Create a centered transition text that will type and erase each dialogue.
                                    const transitionText = document.createElement('div');
                                    transitionText.textContent = '';
                                    const transitionDialogues = [
                                        'Welcome to the castle.',
                                        'Your job is to break in and free the prisoner.',
                                        'Use your bow to pass the archery challenge.',
                                        'Good luck, brave knight.'
                                    ];
                                    const typingSpeed = 45;
                                    const erasingSpeed = 35;
                                    const letterFadeMs = 1000;
                                    const lineHoldMs = 1200;
                                    Object.assign(transitionText.style, {
                                        position: 'fixed',
                                        top: '50%',
                                        left: '50%',
                                        transform: 'translate(-50%, -50%)',
                                        color: '#f5e6c8',
                                        fontSize: '6vw',
                                        fontWeight: '800',
                                        textAlign: 'center',
                                        zIndex: '10000',
                                        pointerEvents: 'none',
                                        opacity: '0',
                                        fontFamily: "'Cinzel Decorative', 'Uncial Antiqua', 'Old English Text MT', serif",
                                        transition: `opacity ${Math.min(600, fadeOutMs)}ms ease-in-out`,
                                        letterSpacing: '0.04em',
                                        textShadow: '0 0 12px rgba(0, 0, 0, 0.7), 0 0 24px rgba(166, 124, 82, 0.35)',
                                        maxWidth: '80vw',
                                        lineHeight: '1.25'
                                    });

                                    document.body.appendChild(transitionText);

                                    // Fade the text in so characters appear as they type
                                    requestAnimationFrame(() => {
                                        transitionText.style.opacity = '1';
                                    });

                                    // Fade in the backdrop after typing begins to avoid the initial flash.
                                    setTimeout(() => {
                                        fadeOverlay.style.opacity = '1';
                                        starCanvas.style.opacity = '1';
                                    }, 100);

                                    const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

                                    const typeLine = (line) => new Promise((resolve) => {
                                        let i = 0;
                                        transitionText.innerHTML = '';
                                        const interval = setInterval(() => {
                                            const span = document.createElement('span');
                                            span.textContent = line.charAt(i);
                                            span.style.opacity = '0';
                                            span.style.transition = `opacity ${letterFadeMs}ms ease-out`;
                                            transitionText.appendChild(span);
                                            requestAnimationFrame(() => {
                                                span.style.opacity = '1';
                                            });

                                            i++;
                                            if (i >= line.length) {
                                                clearInterval(interval);
                                                resolve();
                                            }
                                        }, typingSpeed);
                                    });

                                    const eraseLine = () => new Promise((resolve) => {
                                        let text = transitionText.textContent;
                                        const interval = setInterval(() => {
                                            text = text.slice(0, -1);
                                            transitionText.textContent = text;
                                            if (text.length === 0) {
                                                clearInterval(interval);
                                                resolve();
                                            }
                                        }, erasingSpeed);
                                    });

                                    const runTransitionDialogue = async () => {
                                        for (let i = 0; i < transitionDialogues.length; i++) {
                                            await typeLine(transitionDialogues[i]);
                                            await sleep(lineHoldMs);
                                            await eraseLine();
                                            await sleep(120);
                                        }
                                    };

                                    (async () => {
                                        // Keep sync with fade-in so both effects complete before changing levels.
                                        await Promise.all([
                                            runTransitionDialogue(),
                                            sleep(fadeInMs)
                                        ]);

                                        // Clean up current level properly
                                        if (gameControl.currentLevel) {
                                            // Properly destroy the current level
                                            console.log("Destroying current level...");
                                            gameControl.currentLevel.destroy();

                                            // Force cleanup of any remaining canvases
                                            const gameContainer = document.getElementById('gameContainer');
                                            if (gameContainer) {
                                                const oldCanvases = gameContainer.querySelectorAll('canvas:not(#gameCanvas)');
                                                oldCanvases.forEach(canvas => {
                                                    console.log("Removing old canvas:", canvas.id);
                                                    canvas.parentNode.removeChild(canvas);
                                                });
                                            }
                                        }

                                        console.log("Setting up battle room level...");

                                        // IMPORTANT: Store the original level classes for return journey
                                        gameControl._originalLevelClasses = gameControl.levelClasses;

                                        // Change the level classes to GameLevelEnd
                                        gameControl.levelClasses = [GameLevelArchery];
                                        gameControl.currentLevelIndex = 0;

                                        // Make sure game is not paused
                                        gameControl.isPaused = false;


                                        // Fade out overlay after transition.
                                        setTimeout(() => {
                                            fadeOverlay.style.transition = `opacity ${fadeOutMs}ms ease-in-out`;
                                            transitionText.style.transition = `opacity ${fadeOutMs}ms ease-in-out`;
                                            fadeOverlay.style.opacity = '0';
                                            transitionText.style.opacity = '0';

                                            // Remove both elements after fade-out completes
                                            setTimeout(() => {
                                                try { document.body.removeChild(fadeOverlay); } catch (e) { }
                                                try { document.body.removeChild(transitionText); } catch (e) { }
                                                try { document.body.removeChild(starCanvas); } catch (e) { }
                                                if (starFrameId) cancelAnimationFrame(starFrameId);
                                                if (starResizeHandler) {
                                                    window.removeEventListener('resize', starResizeHandler);
                                                }
                                                // Now the archery level visuals have finished fading in for the player.
                                                // Signal to in-level enemies that it's OK to start moving.
                                                try { window.__startFadeComplete = true; } catch (e) { }
                                            }, fadeOutMs + 150);
                                        }, 200);

                                        // Start the boss fight with the same control
                                        console.log("Transitioning to archery level...");
                                        gameControl.transitionToLevel();

                                    })();
                                });
                            }
                        }
                    }
                ]);
            }
        };

        // Randomly select a gem from the 2x4 spritesheet (8 gems total: 0-7)
        const gem_data = {
            id: 'gem',
            INIT_POSITION: { x: 0.5, y: 0.5 },
            SCALE_FACTOR: 30,
            value: 5,
            spriteImagePath: path + '/images/projects/castle-game/gems.png',
            spriteFrames: { rows: 2, columns: 4, frameIndex: Math.floor(Math.random() * 8) },
            spawnLocations: [
                { x: 340/1110*width, y: 447/760*height },
                { x: 490/1110*width, y: 510/760*height },
                { x: 481/1110*width, y: 594/760*height },
                { x: (1110-340)/1110*width, y: 447/760*height },
                { x: (1110-490)/1110*width, y: 510/760*height },
                { x: (1110-481)/1110*width, y: 594/760*height }
            ]
        }

        const sprite_src_closet = path + "/images/projects/castle-game/closet.png";
        const sprite_data_closet = {
            id: 'Closet',
            greeting: "Need a new suit of armor?",
            src: sprite_src_closet,
            SCALE_FACTOR: 6,
            ANIMATION_RATE: 40,
            interactDistance: 20, // Reduce interaction distance
            pixels: { width: 895, height: 895 },
            INIT_POSITION: { x: 250/1667 * width, y: 420/1137 * height },
            orientation: { rows: 1, columns: 1 },
            down: { row: 0, start: 0, columns: 1 },
            hitbox: { widthPercentage: 0.1, heightPercentage: 0.2 },
            dialogues: [
                "Pick a knight look."
            ],
            reaction: function () {
                // Don't show any reaction dialogue - this prevents the first alert
                // The interact function will handle all dialogue instead
            },

            // This is where the interactions for starting the game are handled
            interact: function () {
                if (this.dialogueSystem && this.dialogueSystem.isDialogueOpen()) {
                    this.dialogueSystem.closeDialogue();
                }

                if (!this.dialogueSystem) {
                    this.dialogueSystem = new DialogueSystem();
                }

                this.dialogueSystem.showDialogue(
                    "Pick a knight look.",
                    "Closet",
                    this.spriteData.src
                );

                this.dialogueSystem.addButtons([
                    {
                        text: "Green Knight",
                        primary: true,
                        action: () => {
                            const player = this.gameEnv?.gameObjects?.find(
                                obj => obj.constructor?.name === 'Player'
                            );
                            applyPlayerSprite(player, 'green');
                            this.dialogueSystem.closeDialogue();
                        }
                    },
                    {
                        text: "Gray Knight",
                        action: () => {
                            const player = this.gameEnv?.gameObjects?.find(
                                obj => obj.constructor?.name === 'Player'
                            );
                            applyPlayerSprite(player, 'gray');
                            this.dialogueSystem.closeDialogue();
                        }
                    },
                    {
                        text: "Dark Knight",
                        action: () => {
                            const player = this.gameEnv?.gameObjects?.find(
                                obj => obj.constructor?.name === 'Player'
                            );
                            applyPlayerSprite(player, 'dark');
                            this.dialogueSystem.closeDialogue();
                        }
                    }
                ]);
            }
        };

        const left_wall = {
            id: 'left-wall-1',
            greeting: "This is a curved barrier, you cannot pass through it!",
            splinePoints: [
                { x: 318/1110*width, y: 749/760*height },
                { x: 435/1110*width, y: 587/760*height },
                { x: 293/1110*width, y: 497/760*height },
                { x: 273/1110*width, y: 436/760*height },
                { x: 142/1110*width, y: 402/760*height },
                { x: 98/1110*width, y: 332/760*height },
                { x: 233/1110*width, y: 246/760*height },
                { x: 342/1110*width, y: 302/760*height },
                { x: 355/1110*width, y: 361/760*height },
                { x: 447/1110*width, y: 435/760*height },
                { x: 506/1110*width, y: 327/760*height }
            ],
            // Optional: Add visual properties if you want to render the barrier
            visible: false,
            color: '#8B4513',  // Brown color for wooden barrier
            lineWidth: 5        // Line thickness for visual representation
        };

        const right_wall = {
            id: 'right-wall-1',
            greeting: "This is a curved barrier, you cannot pass through it!",
            splinePoints: [
                // all points mirrored on the right half of the screen compared to the left wall
                { x: (1110-318)/1110*width, y: 749/760*height },
                { x: (1110-435)/1110*width, y: 587/760*height },
                { x: (1110-293)/1110*width, y: 497/760*height },
                { x: (1110-273)/1110*width, y: 436/760*height },
                { x: (1110-142)/1110*width, y: 402/760*height },
                { x: (1110-98)/1110*width, y: 332/760*height },
                { x: (1110-233)/1110*width, y: 246/760*height },
                { x: (1110-342)/1110*width, y: 302/760*height },
                { x: (1110-355)/1110*width, y: 361/760*height },
                { x: (1110-447)/1110*width, y: 435/760*height },
                { x: (1110-506)/1110*width, y: 327/760*height }
            ],
            // Optional: Add visual properties if you want to render the barrier
            visible: false,
            color: '#8B4513',  // Brown color for wooden barrier
            lineWidth: 5        // Line thickness for visual representation
        };

        this.classes = [
            { class: GameEnvBackground, data: image_data_floor },
            { class: Player, data: sprite_data_mc },
            { class: Npc, data: sprite_data_darkKnight },
            { class: Npc, data: sir_morty_data },
            { class: Npc, data: sprite_data_closet },
            { class: SpriteSheetCoin, data: gem_data },
            { class: SplineBarrier, data: left_wall },
            { class: SplineBarrier, data: right_wall }
        ];
    }
}

export default GameLevelOutside;
