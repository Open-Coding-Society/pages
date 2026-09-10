import GameEnvBackground from "@assets/js/GameEnginev1.1/essentials/GameEnvBackground.js";
import Player from "@assets/js/GameEnginev1.1/essentials/Player.js";
import Npc from '@assets/js/GameEnginev1.1/essentials/Npc.js';
import DialogueSystem from '@assets/js/GameEnginev1.1/essentials/DialogueSystem.js';
import MansionLevel6_BattleRoom from './mansionLevel6_BattleRoom.js';
import GameObject from '@assets/js/GameEnginev1.1/essentials/GameObject.js';

class DoorPrompt extends GameObject {
    constructor(data = null, gameEnv = null) {
        super(gameEnv);
        this.doorId = data?.doorId || 'Door';
        this.size = data?.size || 36;
        this.offsetY = data?.offsetY || -18;
        this.icon = null;
        this._cachedDoor = null;
        this._cachedPlayer = null;
    }

    update() {
        if (!this.gameEnv || typeof document === 'undefined') return;
        if (!this.icon) {
            this.icon = document.createElement('img');
            this.icon.src = `${this.gameEnv.path}/images/projects/mansionGame/eKey.png`;
            this.icon.alt = 'Press E';
            Object.assign(this.icon.style, {
                position: 'absolute',
                width: `${this.size}px`,
                height: `${this.size}px`,
                display: 'none',
                pointerEvents: 'none',
                zIndex: '250'
            });
            const container = document.querySelector('canvas')?.parentElement || document.body;
            container.appendChild(this.icon);
        }

        if (!this._cachedDoor) {
            this._cachedDoor = this.gameEnv.gameObjects.find(obj => obj?.spriteData?.id === this.doorId);
        }
        if (!this._cachedPlayer) {
            this._cachedPlayer = this.gameEnv.gameObjects.find(obj => obj?.constructor?.name === 'Player');
        }

        const door = this._cachedDoor;
        const player = this._cachedPlayer;
        if (!door || !player) {
            this.icon.style.display = 'none';
            return;
        }

        const touchingDoor = !!player?.state?.collisionEvents?.includes(this.doorId);
        if (!touchingDoor) {
            this.icon.style.display = 'none';
            return;
        }

        const doorCenterX = door.position.x + (door.width || 0) / 2;
        const doorTopY = door.position.y;
        const left = doorCenterX - (this.size / 2);
        const top = this.gameEnv.top + doorTopY + this.offsetY;

        this.icon.style.left = `${left}px`;
        this.icon.style.top = `${top}px`;
        this.icon.style.display = 'block';
    }

    draw() {}

    resize() {}

    destroy() {
        if (this.icon && this.icon.parentNode) {
            this.icon.parentNode.removeChild(this.icon);
        }
    }
}

class MansionLevel6 {
    constructor(gameEnv) {

        // upon mansion level6 construction, 

        // keep reference to gameEnv for lifecycle methods
        this.gameEnv = gameEnv;

        let width = gameEnv.innerWidth;
        let height = gameEnv.innerHeight;
        let path = gameEnv.path;


        // Pause DOM audio elements
        try {
            const audioElements = document.querySelectorAll('audio'); // Selects all <audio> elements
            audioElements.forEach(audio => {
                try { if (!audio.paused) audio.pause(); } catch (e) { }
            });
        } catch (e) { /* ignore */ }

        // Level music: play Legend of Zelda theme when entering this level
        // update: now changed to mario castle theme
        // Will be stopped when transitioning to the battle room below
        let randomSong = ["marioCastle.mp3", "legendZelda.mp3"][Math.floor(Math.random() * 2)]
        const levelMusic = new Audio(path + `/assets/sounds/mansionGame/${randomSong}`);
        levelMusic.loop = true;
        levelMusic.volume = 0.3;
        levelMusic.play().catch(err => console.warn('Level music failed to play:', err));
        // Expose the level music so other modules (end screen, etc.) can stop it
        try { if (typeof window !== 'undefined') window._levelMusic = levelMusic; } catch (e) { }

        // This is the background image data
        const image_src_chamber = path + "/images/projects/mansionGame/bgBossIntroChamber.png"
        const image_data_chamber = {
            name: 'bossintro',
            greeting: "You hear a faint echo from behind the ebony doors.",
            src: image_src_chamber,
            pixels: { height: 580, width: 1038 },
            mode: 'stretch'
        };

        const fullscreenMessage = document.createElement('div');
        fullscreenMessage.id = 'fullscreen-recommended-message';
        fullscreenMessage.textContent = 'Fullscreen recommended';
        Object.assign(fullscreenMessage.style, {
            position: 'absolute',
            top: '18px',
            left: '50%',
            transform: 'translateX(-50%)',
            color: '#ffffff',
            fontFamily: "'Press Start 2P', sans-serif",
            fontSize: '14px',
            textShadow: '2px 2px 4px rgba(0, 0, 0, 0.6)',
            zIndex: '100'
        });

        const chamberContainer = document.querySelector('canvas')?.parentElement || document.body;
        chamberContainer.appendChild(fullscreenMessage);

        // This is the data for the player
        const sprite_src_mc = path + "/images/projects/mansionGame/spookMcWalk.png"; // be sure to include the path
        const MC_SCALE_FACTOR = 6;
        const sprite_data_mc = {
            id: 'Spook',
            greeting: "Hi, I am Spook.",
            src: sprite_src_mc,
            SCALE_FACTOR: MC_SCALE_FACTOR,
            STEP_FACTOR: 300,
            ANIMATION_RATE: 10,
            INIT_POSITION: { x: (width / 2 - width / (5 * MC_SCALE_FACTOR)), y: height - (height / MC_SCALE_FACTOR) },
            pixels: { height: 2400, width: 3600 },
            orientation: { rows: 2, columns: 3 },
            down: { row: 1, start: 0, columns: 3 },
            downRight: { row: 1, start: 0, columns: 3, rotate: Math.PI / 16 },
            downLeft: { row: 0, start: 0, columns: 3, rotate: -Math.PI / 16 },
            left: { row: 0, start: 0, columns: 3 },
            right: { row: 1, start: 0, columns: 3 },
            up: { row: 1, start: 0, columns: 3 },
            upLeft: { row: 0, start: 0, columns: 3, rotate: Math.PI / 16 },
            upRight: { row: 1, start: 0, columns: 3, rotate: -Math.PI / 16 },
            hitbox: { widthPercentage: 0.45, heightPercentage: 0.2 },
            keypress: { up: 87, left: 65, down: 83, right: 68 } // W, A, S, D
        };

        // Thiss is the base zombie data
        const sprite_src_zombie = path + "/images/projects/mansionGame/zombieNpc.png";
        const sprite_greet_zombie = "Hi, I'm a zombie.";
        const zombie_base_data = {
            greeting: sprite_greet_zombie,
            src: sprite_src_zombie,
            SCALE_FACTOR: 4,
            ANIMATION_RATE: 30,
            pixels: { width: 3600, height: 1200 },
            orientation: { rows: 1, columns: 3 },
            hitbox: { widthPercentage: 0.4, heightPercentage: 0.2 },
            reaction: function () { },
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
                const whattosay = this.data.dialogues[Math.floor(Math.random() * this.data.dialogues.length)];
                this.dialogueSystem.showDialogue(
                    whattosay,
                    "Zombie",
                    this.spriteData.src
                );
            }
        }

        // This is the zombie npc
        const sprite_data_zombie1 = {
            ...zombie_base_data,
            id: 'ZombieNPC1',
            zombie_name: 'Zombie',
            INIT_POSITION: { x: (width * 0.53), y: (height * 0.25) },
            down: { row: 0, start: 0, columns: 3 },
            // Add dialogues array for random messages
            dialogues: [
                "I heard the boss is waiting for you...",
                "Enter if you dare... he's waiting for you...",
                "I heard the Reaper himself was in there.",
                "You have no chance... his power is unstoppable...",
                "No one has survived a battle against the Reaper.",
                "Haha! You want to battle my boss? You'll die within the first minute...",
                "Go ahead. I aint stoppin' you. The Reaper'll finish you clean.",
                "You are a fool to challenge the Reaper.",
                "You will end up like me once you face the Reaper.",
                "Are you the next opponent for my master? That's unfortunate for you.",
            ]
        };

        // Data for the coding god zombie
        const sprite_data_zombie2 = {
            ...zombie_base_data,
            id: 'ZombieNPC2',
            zombie_name: 'Coding God Zombie',
            INIT_POSITION: { x: (width * 0.28), y: (height * 0.25) },
            down: { row: 0, start: 0, columns: 3, mirror: true },
            // Add dialogues array for random messages
            dialogues: [
                "Boss.js inherits and extends Enemy.js to add more danger.",
                "When you enter the battle room, your player becomes a FightingPlayer object, which extends the Player class.",
                "The arrows and fireballs that you fight with are all Projectile objects.",
                "The Reaper's scythe is a Boomerang object- meaning, it moves in an ellipse.",
                "I was supposed to be a harmless NPC... then they gave me dialogue arrays.",
                "All of this runs in a continuous update loop — one tick at a time.",
                "Both the arrows and fireballs are Projectile objects. Code reuse is peak!",
                "If I ever freeze, check the console. I might've thrown an error.",
                "The Reaper's attack is so powerful, it takes a Desmos graph to understand its power.", // reference to the desmos graph we used to calculate the scythe path!
                "*brains*"
            ]
        };


        // invisible sprite for door collision that handles going to lv6 battle room
        const sprite_src_bossdoor = path + "/images/projects/mansionGame/invisDoorCollisionSprite.png";
        const sprite_greet_bossdoor = "Battle the Reaper? Press E";
        const sprite_data_bossdoor = {
            id: 'Door',
            greeting: sprite_greet_bossdoor,
            src: sprite_src_bossdoor,
            SCALE_FACTOR: 6,
            ANIMATION_RATE: 100,
            pixels: { width: 2029, height: 2025 },
            INIT_POSITION: { x: (width * 0.44), y: (height * 0.17) },
            orientation: { rows: 1, columns: 1 },
            down: { row: 0, start: 0, columns: 1 },
            hitbox: { widthPercentage: 0.1, heightPercentage: 0.2 },
            dialogues: [
                "Many have entered. Few have returned.",
                "Dangerous things await you beyond this door..",
                "Prepare yourself. The journey beyond won't be easy."
            ],
            reaction: function () { },
            // Ask the player whether they want to enter the doors-- if they do, move to the battle room
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
                    "Are you ready to battle the Reaper?",
                    "Door",
                    this.spriteData.src
                );

                // Add buttons directly to the dialogue
                this.dialogueSystem.addButtons([
                    {
                        text: "Enter doors",
                        primary: true,
                        action: () => {
                            this.dialogueSystem.closeDialogue();

                            const fullscreenBanner = document.getElementById('fullscreen-recommended-message');
                            if (fullscreenBanner && fullscreenBanner.parentNode) {
                                fullscreenBanner.parentNode.removeChild(fullscreenBanner);
                            }

                            // Clean up the current game state
                            if (gameEnv && gameEnv.gameControl) {
                                // Store reference to the current game control
                                const gameControl = gameEnv.gameControl;

                                // Create fade overlay for transition
                                const fadeOverlay = document.createElement('div');
                                const fadeInMs = 2000; // longer fade in
                                const fadeOutMs = 1200; // fade out duration
                                // Reset the battle room fade flag
                                window.__battleRoomFadeComplete = false;
                                Object.assign(fadeOverlay.style, {
                                    position: 'fixed',
                                    top: '0',
                                    left: '0',
                                    width: '100%',
                                    height: '100%',
                                    backgroundColor: '#000',
                                    opacity: '0',
                                    transition: `opacity ${fadeInMs}ms ease-in-out`,
                                    zIndex: '9999'
                                });
                                document.body.appendChild(fadeOverlay);

                                function fadeOutAudio(audioElement, duration) {
                                    const initialVolume = audioElement.volume;
                                    const intervalTime = 50; // Milliseconds between volume adjustments
                                    const steps = duration / intervalTime;
                                    const volumeDecreasePerStep = initialVolume / steps;

                                    const fadeInterval = setInterval(() => {
                                        if (audioElement.volume - volumeDecreasePerStep > 0) {
                                            audioElement.volume -= volumeDecreasePerStep;
                                        } else {
                                            audioElement.volume = 0;
                                            audioElement.pause(); // Optionally pause the audio when volume reaches zero
                                            clearInterval(fadeInterval);
                                        }
                                    }, intervalTime);
                                }

                                // Stop the level (overworld) music before starting battle music
                                try {
                                    if (levelMusic && typeof levelMusic.pause === 'function') {
                                        fadeOutAudio(levelMusic, 500);
                                        levelMusic.pause();
                                        levelMusic.currentTime = 0;
                                    }
                                } catch (e) { console.warn('Failed to stop level music:', e); }

                                // Start the music for the battle room
                                console.log("Starting battle music...");
                                const audio = new Audio(path + "/assets/sounds/mansionGame/SkeletonLord.mp3");
                                audio.loop = true;
                                audio.volume = 0.4;
                                // Expose battle music so end screen can stop it later
                                try { if (typeof window !== 'undefined') window._battleMusic = audio; } catch (e) { }
                                audio.play().catch(error => console.error('Failed to play audio:', error));

                                console.log("Starting battle level transition...");

                                // Fade in
                                requestAnimationFrame(() => {
                                    fadeOverlay.style.opacity = '1';

                                    // Mark that the battle-room fade-complete flag is not yet set.
                                    // This flag will be set to true once the overlay is fully removed
                                    // so enemies in the battle room can wait for the screen to finish
                                    // fading before they begin moving/attacking.
                                    try { window.__battleRoomFadeComplete = false; } catch (e) { }

                                    // Create a centered transition text that will type itself
                                    const transitionText = document.createElement('div');
                                    const fullText = 'YOUR FATE HAS BEEN SEALED';
                                    transitionText.textContent = '';
                                    const typingSpeed = 20; // ms per char -- CHANGE TO 80 WHEN FINISHED THE SLOW SPEED IS FOR DEVELOPMENT
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
                                        transition: `opacity ${Math.min(600, fadeOutMs)}ms ease-in-out`,
                                        textShadow: '0 3px 8px rgba(181, 0, 0, 0.85)',
                                        letterSpacing: '0.05em'
                                    });

                                    document.body.appendChild(transitionText);

                                    // Fade the text in so characters appear as they type
                                    requestAnimationFrame(() => {
                                        transitionText.style.opacity = '1';
                                    });

                                    // Typewriter effect
                                    let charIndex = 0;
                                    let typingInterval = null;
                                    const startTyping = () => {
                                        typingInterval = setInterval(() => {
                                            transitionText.textContent += fullText.charAt(charIndex);
                                            charIndex++;
                                            if (charIndex >= fullText.length) {
                                                clearInterval(typingInterval);
                                                typingInterval = null;
                                            }
                                        }, typingSpeed);
                                    };

                                    startTyping();

                                    // Compute when to perform the level transition: wait until both fadeIn and typing complete
                                    const typingDuration = fullText.length * typingSpeed;
                                    const waitMs = Math.max(fadeInMs, typingDuration) + 200; // small hold after -- CHANGE TO 800 WHEN FINISHED THE SLOW SPEED IS FOR DEVELOPMENT

                                    setTimeout(() => {
                                        // Clean up current level properly
                                        if (gameControl.currentLevel) {
                                            // Properly destroy the current level
                                            console.log("Destroying current level...");
                                            gameControl.currentLevel.destroy();

                                            // Force cleanup of any remaining canvases
                                            const gameContainer = gameControl.gameContainer || document.getElementById('gameContainer');
                                            if (gameContainer && gameContainer.querySelectorAll) {
                                                const oldCanvases = gameContainer.querySelectorAll('canvas:not(#gameCanvas)');
                                                oldCanvases.forEach(canvas => {
                                                    console.log("Removing old canvas:", canvas.id);
                                                    canvas.parentNode.removeChild(canvas);
                                                });
                                            } else {
                                                console.warn('gameContainer not found; skipping canvas cleanup');
                                            }
                                        }

                                        console.log("Setting up battle room level...");

                                        // IMPORTANT: Store the original level classes for return journey
                                        gameControl._originalLevelClasses = gameControl.levelClasses;

                                        // Change the level classes to GameLevelEnd
                                        gameControl.levelClasses = [MansionLevel6_BattleRoom];
                                        gameControl.currentLevelIndex = 0;

                                        // Make sure game is not paused
                                        gameControl.isPaused = false;


                                        // Fade out overlay after transition (with untype animation)
                                        setTimeout(() => {
                                            const untypeSpeed = 50; // ms per character removal
                                            let untypeIndex = fullText.length - 1;

                                            const untypeInterval = setInterval(() => {
                                                if (untypeIndex >= 0) {
                                                    transitionText.textContent = fullText.substring(0, untypeIndex);
                                                    untypeIndex--;
                                                } else {
                                                    clearInterval(untypeInterval);

                                                    // Once untyped, fade everything out
                                                    fadeOverlay.style.transition = `opacity ${fadeOutMs}ms ease-in-out`;
                                                    transitionText.style.transition = `opacity ${fadeOutMs}ms ease-in-out`;
                                                    fadeOverlay.style.opacity = '0';
                                                    transitionText.style.opacity = '0';

                                                    // Remove both elements after fade-out completes
                                                    setTimeout(() => {
                                                        try { document.body.removeChild(fadeOverlay); } catch (e) { }
                                                        try { document.body.removeChild(transitionText); } catch (e) { }
                                                        // Now the battle room visuals have finished fading in for the player.
                                                        // Signal to in-level enemies that it's OK to start moving.
                                                        try { window.__battleRoomFadeComplete = true; } catch (e) { }
                                                    }, fadeOutMs + 150);
                                                }
                                            }, untypeSpeed);
                                        }, waitMs + 300);

                                        // Start the boss fight with the same control
                                        console.log("Transitioning to battle room level...");
                                        gameControl.transitionToLevel();


                                    }, waitMs);
                                });
                            }
                        }
                    },
                    {
                        text: "Not Ready",
                        action: () => {
                            this.dialogueSystem.closeDialogue();
                        }
                    }
                ]);
            }
        };

        const sprite_src_chairs = path + "/images/projects/mansionGame/invisDoorCollisionSprite.png";
        const sprite_data_chair = {
            id: 'Chair',
            greeting: "Don't sit on me!",
            src: sprite_src_chairs,
            SCALE_FACTOR: 6,
            ANIMATION_RATE: 100,
            pixels: { width: 2029, height: 2025 },
            INIT_POSITION: { x: (width * 0.07), y: (height * 0.36) },
            orientation: { rows: 1, columns: 1 },
            down: { row: 0, start: 0, columns: 1 },
            hitbox: { widthPercentage: 0.1, heightPercentage: 0.2 }
        };

        const sprite_data_chair2 = {
            id: 'Chair 2',
            greeting: "Don't sit on me!",
            src: sprite_src_chairs,
            SCALE_FACTOR: 6,
            ANIMATION_RATE: 100,
            pixels: { width: 2029, height: 2025 },
            INIT_POSITION: { x: (width * 0.86), y: (height * 0.36) },
            orientation: { rows: 1, columns: 1 },
            down: { row: 0, start: 0, columns: 1 },
            hitbox: { widthPercentage: 0.1, heightPercentage: 0.2 }
        };

        // This is every sprite we want the game engine to render, and with whatever data
        this.classes = [
            { class: GameEnvBackground, data: image_data_chamber },
            { class: Player, data: sprite_data_mc },
            { class: Npc, data: sprite_data_zombie1 },
            { class: Npc, data: sprite_data_zombie2 }, // The second zombie is the one that talks about the code
            { class: Npc, data: sprite_data_bossdoor },
            { class: DoorPrompt, data: { doorId: 'Door', size: 36, offsetY: -22 } },
            { class: Npc, data: sprite_data_chair },
            { class: Npc, data: sprite_data_chair2 }
        ];

    };
}

export default MansionLevel6;
