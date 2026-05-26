import GameEnvBackground from '@assets/js/GameEnginev1.1/essentials/GameEnvBackground.js';
import Player from '@assets/js/GameEnginev1.1/essentials/Player.js';
import Npc from '@assets/js/GameEnginev1.1/essentials/Npc.js';
import DialogueSystem from '@assets/js/GameEnginev1.1/essentials/DialogueSystem.js';
import MansionLevel6 from './mansionLevel6.js';
import WheelOfFortuneGameManager from './WheelOfFortune.js';

class MansionLevel5 {
    constructor(gameEnv) {
        this.gameEnv = gameEnv;
        this.width = gameEnv.innerWidth;
        this.height = gameEnv.innerHeight;
        this.path = gameEnv.path;
        this.promptElement = null;
        this.puzzleSolved = false;
        this.finishDoor = null;

        this.pauseDomAudio();
        this.wheelManager = new WheelOfFortuneGameManager(gameEnv, {
            phraseBank: [
                "SECRET PASSAGE",
                "HIDDEN STAIRCASE",
                "MIRROR CHAMBER",
                "BENEATH THE STAIRS",
                "LOCKED PANEL",
                "DUSTY ARCHWAY"
            ],
            category: "Mansion Mystery",
            onWin: () => this.winLevel()
        });

        const backgroundData = this.createBackgroundData();
        const playerData = this.createPlayerData();
        const wheelHostData = this.createWheelHostData();

        this.classes = [
            { class: GameEnvBackground, data: backgroundData },
            { class: Player, data: playerData },
            { class: Npc, data: wheelHostData }
        ];

        this.backgroundMusic = new Audio(this.path + '/assets/sounds/mansionGame/SpookieDookie.mp3');
        this.backgroundMusic.loop = true;
        this.backgroundMusic.volume = 0.25;
        this.backgroundMusic.play().catch((error) => console.warn('Level 5 music failed to play:', error));
    }

    pauseDomAudio() {
        try {
            const audioElements = document.querySelectorAll('audio');
            audioElements.forEach((audio) => {
                try {
                    if (!audio.paused) audio.pause();
                } catch (error) {
                    console.warn('Audio pause failed:', error);
                }
            });
        } catch (error) {
            console.warn('Audio lookup failed:', error);
        }
    }

    createBackgroundData() {
        return {
            name: 'background',
            greeting: "This is the hidden parlor. Solve the wheel phrase to claim the key.",
            src: this.path + "/images/projects/mansionGame/background_lvl5.png",
            pixels: { height: 1280, width: 720 },
            mode: 'stretch'
        };
    }

    createPlayerData() {
        return {
            id: 'Player',
            greeting: "I am the player for level 5",
            src: this.path + "/images/projects/mansionGame/full_anims_spook.png",
            SCALE_FACTOR: 5,
            STEP_FACTOR: 800,
            ANIMATION_RATE: 20,
            INIT_POSITION: { x: this.width * 0.45, y: this.height * 0.74 },
            pixels: { width: 1500, height: 120 },
            orientation: { rows: 2, columns: 25 },
            down: { row: 1, start: 0, columns: 3 },
            downRight: { row: 1, start: 0, columns: 3, mirror: true, rotate: Math.PI / 16 },
            downLeft: { row: 1, start: 0, columns: 3, rotate: -Math.PI / 16 },
            left: { row: 1, start: 0, columns: 3 },
            right: { row: 1, start: 0, columns: 3, mirror: true },
            up: { row: 1, start: 0, columns: 3 },
            upLeft: { row: 0, start: 0, columns: 3, rotate: Math.PI / 16 },
            upRight: { row: 1, start: 0, columns: 3, mirror: true, rotate: Math.PI / -16 },
            hitbox: { widthPercentage: 0.45, heightPercentage: 0.2 },
            keypress: { up: 87, left: 65, down: 83, right: 68 }
        };
    }

    createWheelHostData() {
        return {
            id: 'WheelTable',
            greeting: "Press E to play Mansion Wheel.",
            // Using the skeleton key sprite as an inviting "prize" marker over the table
            src: this.path + "/images/projects/mansionGame/skeleton_key.png", 
            SCALE_FACTOR: 8,
            ANIMATION_RATE: 100,
            pixels: { width: 680, height: 362 },
            INIT_POSITION: { x: this.width * 0.45, y: this.height * 0.28 },
            orientation: { rows: 1, columns: 1 },
            down: { row: 0, start: 0, columns: 1 },
            hitbox: { widthPercentage: 0.35, heightPercentage: 0.35 },
            dialogues: ["Spin for consonants, buy vowels, then solve the phrase to reveal the key."],
            reaction: () => {},
            interact: () => {
                if (this.puzzleSolved) {
                    this.showSolvedMessage();
                    return;
                }
                this.hidePrompt();
                this.wheelManager.startGame();
            }
        };
    }

    createFinishDoorData() {
        const levelGameEnv = this.gameEnv;

        return {
            id: 'Level6Door',
            greeting: "You found the Level 5 key. Press E to enter Level 6.",
            src: this.path + "/images/projects/mansionGame/door_lvl5.png",
            SCALE_FACTOR: 1,
            ANIMATION_RATE: 100,
            pixels: { width: 256, height: 256 },
            INIT_POSITION: { x: this.width * 0.12, y: this.height * 0.16 },
            orientation: { rows: 1, columns: 1 },
            down: { row: 0, start: 0, columns: 1 },
            hitbox: { widthPercentage: 0.2, heightPercentage: 0.3 },
            dialogues: ["Level 6 awaits. Do you wish to enter?"],
            reaction: () => {},
            interact: function() {
                if (this.dialogueSystem && this.dialogueSystem.isDialogueOpen()) this.dialogueSystem.closeDialogue();
                if (!this.dialogueSystem) this.dialogueSystem = new DialogueSystem();
                this.dialogueSystem.showDialogue("Would you like to enter Level 6?", "Level 6", this.spriteData.src);
                this.dialogueSystem.addButtons([
                    {
                        text: "Enter",
                        primary: true,
                        action: () => {
                            this.dialogueSystem.closeDialogue();
                            if (levelGameEnv?.gameControl) {
                                const gameControl = levelGameEnv.gameControl;
                                gameControl._originalLevelClasses = gameControl.levelClasses;
                                gameControl.levelClasses = [MansionLevel6];
                                gameControl.currentLevelIndex = 0;
                                gameControl.isPaused = false;
                                gameControl.transitionToLevel();
                            }
                        }
                    },
                    { text: "Not Now", action: () => this.dialogueSystem.closeDialogue() }
                ]);
            }
        };
    }

    initialize() {
        this.showPrompt();

        // Add a glowing pulse effect to the WheelTable to make it stand out
        if (!document.getElementById('wheel-marker-style')) {
            const style = document.createElement('style');
            style.id = 'wheel-marker-style';
            style.innerHTML = `
                canvas#WheelTable {
                    animation: pulse-table-glow 1.5s infinite alternate !important;
                }
                @keyframes pulse-table-glow {
                    0% { filter: drop-shadow(0 0 5px rgba(214, 179, 95, 0.4)); transform: translateY(0px); }
                    100% { filter: drop-shadow(0 0 15px rgba(214, 179, 95, 0.9)); transform: translateY(-10px); }
                }
            `;
            document.head.appendChild(style);
        }
    }

    showPrompt() {
        if (this.promptElement || this.puzzleSolved) return;

        this.promptElement = document.createElement('div');
        this.promptElement.id = 'mansion-wheel-prompt';
        this.promptElement.style.cssText = `
            position: fixed;
            top: 24px;
            left: 50%;
            transform: translateX(-50%);
            z-index: 9999;
            width: min(560px, calc(100% - 32px));
            padding: 16px 20px;
            border: 2px solid #d6b35f;
            border-radius: 8px;
            background: rgba(12, 9, 16, 0.92);
            color: white;
            text-align: center;
            font-family: Arial, sans-serif;
            box-shadow: 0 0 18px rgba(214, 179, 95, 0.45);
        `;
        this.promptElement.innerHTML = `
            <strong style="display: block; color: #d6b35f; margin-bottom: 6px;">Mansion Wheel</strong>
            Walk to the wheel table and press E. Spin for consonants, buy vowels, and solve the phrase to earn the key.
        `;

        document.body.appendChild(this.promptElement);
    }

    hidePrompt() {
        if (this.promptElement?.parentNode) {
            this.promptElement.parentNode.removeChild(this.promptElement);
        }
        this.promptElement = null;
    }

    winLevel() {
        if (this.puzzleSolved) return;

        this.puzzleSolved = true;
        this.hidePrompt();

        const dialogueSystem = new DialogueSystem();
        dialogueSystem.showDialogue(
            'You solved "SECRET PASSAGE" and earned the hidden wing key.',
            'Level 5 Complete',
            this.path + '/images/projects/mansionGame/key_lvl3.png'
        );

        dialogueSystem.addButtons([
            {
                text: 'Continue',
                primary: true,
                action: () => {
                    dialogueSystem.closeDialogue();
                    this.spawnFinishDoor();
                }
            }
        ]);
    }

    showSolvedMessage() {
        const dialogueSystem = new DialogueSystem();
        dialogueSystem.showDialogue(
            'The wheel is already solved. Use the door that appeared to continue.',
            'Mansion Wheel',
            this.path + '/images/projects/mansionGame/objective.png'
        );
    }

    spawnFinishDoor() {
        if (this.finishDoor) return;

        this.finishDoor = new Npc(this.createFinishDoorData(), this.gameEnv);
        this.gameEnv.gameObjects.push(this.finishDoor);
    }

    destroy() {
        this.hidePrompt();
        if (this.wheelManager) {
            this.wheelManager.destroy();
        }
        if (this.backgroundMusic) {
            this.backgroundMusic.pause();
            this.backgroundMusic.currentTime = 0;
        }
    }
}

export default MansionLevel5;
