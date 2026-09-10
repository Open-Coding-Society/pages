// Adventure Game Custom Level
// Exported from GameBuilder on 2026-03-05T17:24:14.526Z
// How to use this file:
// 1) Save as assets/js/adventureGame/GameLevelGamelevelmaze.js in your repo.
// 2) Reference it in your runner or level selector. Examples:
//    import GameLevelPlanets from '@assets/js/GameEnginev1/GameLevelPlanets.js';
//    import GameLevelGamelevelmaze from '@assets/js/adventureGame/GameLevelGamelevelmaze.js';
//    export const gameLevelClasses = [GameLevelPlanets, GameLevelGamelevelmaze];
//    // or pass it directly to your GameControl as the only level.
// 3) Ensure images exist and paths resolve via 'path' provided by the engine.
// 4) You can add more objects to this.classes inside the constructor.

import GameEnvBackground from '@assets/js/GameEnginev1.1/essentials/GameEnvBackground.js';
import Player from '@assets/js/GameEnginev1.1/essentials/Player.js';
import Npc from '@assets/js/GameEnginev1.1/essentials/Npc.js';
import DeathBarrier from './DeathBarrier.js';
import showEndScreen from "./EndScreen.js"; // Not currently used, instead the level just transitions
import showDeathScreen from './DeathScreen.js';
import GameLevelFortress from './GameLevelFortress.js';
import Ghost from './Ghost.js';

class GameLevelMaze {

    static friendlyName = "Level 3: The Maze";

    constructor(gameEnv) {
        // Reset grace period when level starts
        DeathBarrier.resetLevelStartTime();

        const path = gameEnv.path;
        const width = gameEnv.innerWidth;
        const height = gameEnv.innerHeight;

        console.log("Width:", width, "Height:", height);

        const bgData = {
            name: "custom_bg",
            src: path + "/images/projects/castle-game/dungeonMaze.png",
            pixels: { height: 772, width: 1134 }
        };

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
        const MC_SCALE_FACTOR = 20;
        const sprite_data_mc = {
            id: 'Knight',
            greeting: "Hi, I am a Knight.",
            src: sprite_src_mc,
            SCALE_FACTOR: MC_SCALE_FACTOR,
            STEP_FACTOR: 1750,
            ANIMATION_RATE: 100,
            INIT_POSITION: {
                x: 202 / 1911 * width,
                y: 760 / 851 * height
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
            keypress: { up: 87, left: 65, down: 83, right: 68 } // W, A, S, D

        };

        const mortyData = {
            id: 'morty',
            greeting: 'Hey there!',
            src: path + "/images/projects/castle-game/morty.png",
            SCALE_FACTOR: 13,
            INIT_POSITION: {
                x: 250 / 1911 * width,
                y: 760 / 851 * height
            },
            orientation: { rows: 1, columns: 1 },
            down: { row: 0, start: 0, columns: 1 },
            pixels: { height: 895, width: 577 },
            hitbox: { widthPercentage: 0.1, heightPercentage: 0.2 },
            dialogues: ["a"],
            reaction: function () { console.log('test (reaction)'); },
            interact: function () {

                // Clear any existing dialogue first to prevent duplicates
                if (this.dialogueSystem && this.dialogueSystem.isDialogueOpen()) {
                    this.dialogueSystem.closeDialogue();
                }

                // Create a new dialogue system if needed - lazy initialization
                if (!this.dialogueSystem) {
                    try {
                        this.dialogueSystem = new DialogueSystem();
                    } catch (error) {
                        console.error('Error creating DialogueSystem:', error);
                        return;
                    }
                }

                // Select random dialogue message - provides variety for repeated interactions
                const whattosay = "Welcome to the coolest maze this side of the atlantic ocean, escape or get rekt lol"

                // Display dialogue with NPC sprite - shows entire sprite sheet as background
                try {
                    this.dialogueSystem.showDialogue(
                        whattosay,
                        "mr portensen",
                        this.spriteData.src, // Full sprite sheet displayed (legacy behavior),
                        {
                            columns: 3,
                            rows: 4,
                            frameX: 0,
                            frameY: 0,
                            frameWidth: 78,
                            frameHeight: 108
                        }
                    );

                    this.dialogueSystem.addButtons([
                        {
                            text: "Enter the maze",
                            primary: true,
                            action: () => {
                                this.dialogueSystem.closeDialogue();

                                this.destroy();
                            }
                        }
                    ]);


                } catch (error) {
                    console.error('Error calling showDialogue:', error);
                }
            }
        };

        const ghostData = {
            id: 'Ghost',
            greeting: false,
            src: path + "/images/projects/castle-game/ghost.png",
            SCALE_FACTOR: 12,
            ANIMATION_RATE: 20,
            INIT_POSITION: { x: 0.8 * width, y: 0.2 * height },
            pixels: { width: 3000, height: 1000 },
            orientation: { rows: 2, columns: 6 },
            down: { row: 0, start: 0, columns: 6 },
            left: { row: 1, start: 0, columns: 6 },
            right: { row: 1, start: 0, columns: 6 },
            hitbox: { widthPercentage: 0.15, heightPercentage: 0.2 },
            followSpeedFactor: 0.4,
            followStopDistance: 12,
            zIndex: 12,
            canvasFilter: 'drop-shadow(0 0 8px rgba(150, 220, 255, 0.7))'
        };

        const dbarrier_1 = {
            id: 'dbarrier_1', x: 498 / 505 * width, y: 0 / 291 * height, width: 6 / 505 * width, height: 295 / 291 * height, visible: false /* BUILDER_DEFAULT */,
            hitbox: { widthPercentage: 0.0, heightPercentage: 0.0 },
            fromOverlay: true
        };

        const dbarrier_2 = {
            id: 'dbarrier_2', x: 0 / 505 * width, y: 0 / 291 * height, width: 7 / 505 * width, height: 296 / 291 * height, visible: false /* BUILDER_DEFAULT */,
            hitbox: { widthPercentage: 0.0, heightPercentage: 0.0 },
            fromOverlay: true
        };

        const dbarrier_3 = {
            id: 'dbarrier_3', x: 7 / 505 * width, y: 71 / 291 * height, width: 14 / 505 * width, height: 225 / 291 * height, visible: false /* BUILDER_DEFAULT */,
            hitbox: { widthPercentage: 0.0, heightPercentage: 0.0 },
            fromOverlay: true
        };

        const dbarrier_4 = {
            id: 'dbarrier_4', x: 20 / 505 * width, y: 72 / 291 * height, width: 13 / 505 * width, height: 188 / 291 * height, visible: false /* BUILDER_DEFAULT */,
            hitbox: { widthPercentage: 0.0, heightPercentage: 0.0 },
            fromOverlay: true
        };

        const dbarrier_5 = {
            id: 'dbarrier_5', x: 33 / 505 * width, y: 200 / 291 * height, width: 56 / 505 * width, height: 60 / 291 * height, visible: false /* BUILDER_DEFAULT */,
            hitbox: { widthPercentage: 0.0, heightPercentage: 0.0 },
            fromOverlay: true
        };

        const dbarrier_6 = {
            id: 'dbarrier_6', x: 63 / 505 * width, y: 71 / 291 * height, width: 26 / 505 * width, height: 129 / 291 * height, visible: false /* BUILDER_DEFAULT */,
            hitbox: { widthPercentage: 0.0, heightPercentage: 0.0 },
            fromOverlay: true
        };

        const dbarrier_7 = {
            id: 'dbarrier_7', x: 88 / 505 * width, y: 71 / 291 * height, width: 191 / 505 * width, height: 64 / 291 * height, visible: false /* BUILDER_DEFAULT */,
            hitbox: { widthPercentage: 0.0, heightPercentage: 0.0 },
            fromOverlay: true
        };

        const dbarrier_8 = {
            id: 'dbarrier_8', x: 117 / 505 * width, y: 156 / 291 * height, width: 54 / 505 * width, height: 64 / 291 * height, visible: false /* BUILDER_DEFAULT */,
            hitbox: { widthPercentage: 0.0, heightPercentage: 0.0 },
            fromOverlay: true
        };

        const dbarrier_9 = {
            id: 'dbarrier_9', x: 144 / 505 * width, y: 220 / 291 * height, width: 27 / 505 * width, height: 38 / 291 * height, visible: false /* BUILDER_DEFAULT */,
            hitbox: { widthPercentage: 0.0, heightPercentage: 0.0 },
            fromOverlay: true
        };

        const dbarrier_10 = {
            id: 'dbarrier_10', x: 199 / 505 * width, y: 134 / 291 * height, width: 27 / 505 * width, height: 125 / 291 * height, visible: false /* BUILDER_DEFAULT */,
            hitbox: { widthPercentage: 0.0, heightPercentage: 0.0 },
            fromOverlay: true
        };

        const dbarrier_11 = {
            id: 'dbarrier_11', x: 226 / 505 * width, y: 199 / 291 * height, width: 162 / 505 * width, height: 60 / 291 * height, visible: false /* BUILDER_DEFAULT */,
            hitbox: { widthPercentage: 0.0, heightPercentage: 0.0 },
            fromOverlay: true
        };

        const dbarrier_12 = {
            id: 'dbarrier_12', x: 444 / 505 * width, y: 71 / 291 * height, width: 54 / 505 * width, height: 81 / 291 * height, visible: false /* BUILDER_DEFAULT */,
            hitbox: { widthPercentage: 0.0, heightPercentage: 0.0 },
            fromOverlay: true
        };

        const dbarrier_13 = {
            id: 'dbarrier_13', x: 444 / 505 * width, y: 152 / 291 * height, width: 28 / 505 * width, height: 108 / 291 * height, visible: false /* BUILDER_DEFAULT */,
            hitbox: { widthPercentage: 0.0, heightPercentage: 0.0 },
            fromOverlay: true
        };

        const dbarrier_14 = {
            id: 'dbarrier_14', x: 418 / 505 * width, y: 201 / 291 * height, width: 24 / 505 * width, height: 58 / 291 * height, visible: false /* BUILDER_DEFAULT */,
            hitbox: { widthPercentage: 0.0, heightPercentage: 0.0 },
            fromOverlay: true
        };

        const dbarrier_15 = {
            id: 'dbarrier_15', x: 20 / 505 * width, y: 286 / 291 * height, width: 476 / 505 * width, height: 10 / 291 * height, visible: false /* BUILDER_DEFAULT */,
            hitbox: { widthPercentage: 0.0, heightPercentage: 0.0 },
            fromOverlay: true
        };

        const dbarrier_16 = {
            id: 'dbarrier_16', x: 7 / 505 * width, y: 1 / 291 * height, width: 437 / 505 * width, height: 38 / 291 * height, visible: false /* BUILDER_DEFAULT */,
            hitbox: { widthPercentage: 0.0, heightPercentage: 0.0 },
            fromOverlay: true
        };

        const dbarrier_17 = {
            id: 'dbarrier_17', x: 472 / 505 * width, y: 0 / 291 * height, width: 27 / 505 * width, height: 37 / 291 * height, visible: false /* BUILDER_DEFAULT */,
            hitbox: { widthPercentage: 0.0, heightPercentage: 0.0 },
            fromOverlay: true
        };

        const dbarrier_18 = {
            id: 'dbarrier_18', x: 308 / 505 * width, y: 40 / 291 * height, width: 26 / 505 * width, height: 131 / 291 * height, visible: false /* BUILDER_DEFAULT */,
            hitbox: { widthPercentage: 0.0, heightPercentage: 0.0 },
            fromOverlay: true
        };

        const dbarrier_19 = {
            id: 'dbarrier_19', x: 391 / 505 * width, y: 39 / 291 * height, width: 25 / 505 * width, height: 133 / 291 * height, visible: false /* BUILDER_DEFAULT */,
            hitbox: { widthPercentage: 0.0, heightPercentage: 0.0 },
            fromOverlay: true
        };


        const sprite_src_invis = path + "/images/projects/castle-game/invisDoorCollisionSprite.png";
        const sprite_greet_invis = "Start the game? Press E";
        const sprite_data_invis = {
            id: 'Villager',
            greeting: sprite_greet_invis,
            src: sprite_src_invis,
            SCALE_FACTOR: 9,
            ANIMATION_RATE: 100,
            pixels: { width: 70, height: 90 },
            INIT_POSITION: { x: 0.88 * width, y: 0.05 * height },
            orientation: { rows: 1, columns: 1 },
            down: { row: 0, start: 0, columns: 1 },
            hitbox: { widthPercentage: 0.1, heightPercentage: 0.2 },
            dialogues: [
                "Are you ready to play some archery?"
            ],
            reaction: function () {
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

                const switchToFortressLevel = () => {
                    try {
                        gameControl._originalLevelClasses = gameControl.levelClasses;
                        gameControl.levelClasses = [GameLevelFortress];
                        gameControl.currentLevelIndex = 0;
                        gameControl.isPaused = false;
                        gameControl.transitionToLevel(); // defined by game engine most likely, forces the level to switch immediately
                    } catch (err) {
                        console.warn('Failed to transition to fortress level:', err);
                    }
                };

                requestAnimationFrame(() => {
                    fadeOverlay.style.opacity = '1';
                });

                setTimeout(() => {
                    try { fadeOverlay.remove(); } catch (err) { /* ignore */ }

                    switchToFortressLevel();

                    setTimeout(() => {
                        fadeOverlay.style.transition = `opacity ${fadeOutMs}ms ease-in-out`;
                        fadeOverlay.style.opacity = '0';

                        setTimeout(() => {
                            try { fadeOverlay.remove(); } catch (err) { /* ignore */ }
                        }, fadeOutMs + 100);
                    }, 220);
                }, fadeInMs + 30); // fade in and fade out for the transition to gamelevelfortress
            }
        };



        this.classes = [
            { class: GameEnvBackground, data: bgData },
            { class: Player, data: sprite_data_mc },
            { class: Npc, data: mortyData },
            { class: Npc, data: sprite_data_invis },
            { class: Ghost, data: ghostData },
            { class: DeathBarrier, data: dbarrier_1 },
            { class: DeathBarrier, data: dbarrier_2 },
            { class: DeathBarrier, data: dbarrier_3 },
            { class: DeathBarrier, data: dbarrier_4 },
            { class: DeathBarrier, data: dbarrier_5 },
            { class: DeathBarrier, data: dbarrier_6 },
            { class: DeathBarrier, data: dbarrier_7 },
            { class: DeathBarrier, data: dbarrier_8 },
            { class: DeathBarrier, data: dbarrier_9 },
            { class: DeathBarrier, data: dbarrier_10 },
            { class: DeathBarrier, data: dbarrier_11 },
            { class: DeathBarrier, data: dbarrier_12 },
            { class: DeathBarrier, data: dbarrier_13 },
            { class: DeathBarrier, data: dbarrier_14 },
            { class: DeathBarrier, data: dbarrier_15 },
            { class: DeathBarrier, data: dbarrier_16 },
            { class: DeathBarrier, data: dbarrier_17 },
            { class: DeathBarrier, data: dbarrier_18 },
            { class: DeathBarrier, data: dbarrier_19 }
        ];

    }

}

export default GameLevelMaze;