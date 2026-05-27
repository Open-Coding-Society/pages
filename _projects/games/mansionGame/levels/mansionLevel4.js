// To build GameLevels, each contains GameObjects from below imports
import GameEnvBackground from '@assets/js/GameEnginev1.1/essentials/GameEnvBackground.js';
import Player from '@assets/js/GameEnginev1.1/essentials/Player.js';
import Npc from '@assets/js/GameEnginev1.1/essentials/Npc.js';
import DialogueSystem from '@assets/js/GameEnginev1.1/essentials/DialogueSystem.js';

//Import custom classes from select files
import Barrier from './Barrier.js';
import { WaveManager } from './waveManager.js';

class MansionLevel4 {
    constructor(gameEnv) {
        let width = gameEnv.innerWidth;
        let height = gameEnv.innerHeight;
        let path = gameEnv.path;

        // Initialize wave manager
        this.waveManager = new WaveManager(gameEnv);

        // Background data
        const image_background = path + "/images/projects/mansionGame/background.jpg";
        const image_data_background = {
            name: 'background',
            greeting: "Wave Defense! Defeat all enemies to proceed!",
            src: image_background,
            pixels: { height: 1600, width: 1600 }
        };

        const sprite_src_mc = path + "/images/projects/mansionGame/spookMcWalk.png";
        const MC_SCALE_FACTOR = 6;
        const sprite_data_player = {
            id: 'Spook',
            greeting: "Hi, I am Spook.",
            src: sprite_src_mc,
            SCALE_FACTOR: MC_SCALE_FACTOR,
            STEP_FACTOR: 800,
            ANIMATION_RATE: 10,
            INIT_POSITION: { x: width * 0.1, y: height / 2 },
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

        // Define barrier locations - boundary walls
        const barrierData = [
            { x: 0, y: 0, width: width, height: 20, visible: true },                    // Top wall
            { x: 0, y: height - 20, width: width, height: 20, visible: true },          // Bottom wall
            { x: 0, y: 0, width: 20, height: height, visible: true },                   // Left wall
            { x: width - 20, y: 0, width: 20, height: height, visible: true }           // Right wall
        ];

        // Initialize game objects
        this.classes = [
            { class: GameEnvBackground, data: image_data_background },
            { class: Player, data: sprite_data_player },
            ...barrierData.map(data => ({ class: Barrier, data }))
        ];

        this.gameEnv = gameEnv;

        // Adding Music
        this.backgroundMusic = new Audio(path + '/assets/sounds/mansionGame/SpookieDookie.mp3');
        this.backgroundMusic.loop = true;
        this.backgroundMusic.volume = 0.3;
        this.backgroundMusic.play();

        // Setup input listeners for shooting and starting waves
        this.setupInputListener();

        // Show starting UI
        this.showStartUI();
    }

    setupInputListener() {
        this.inputHandler = (e) => {
            // Space key to shoot
            if (e.code === 'Space') {
                e.preventDefault();
                this.waveManager.playerShoot();
            }
        };

        document.addEventListener('keydown', this.inputHandler);
    }

    showStartUI() {
        // Create start prompt
        const startElement = document.createElement('div');
        startElement.id = 'wave-start-prompt';
        startElement.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0, 0, 0, 0.95);
            border: 3px solid #ff6b6b;
            border-radius: 15px;
            padding: 40px 60px;
            z-index: 9999;
            text-align: center;
            box-shadow: 0 0 40px rgba(255, 107, 107, 0.9);
        `;

        startElement.innerHTML = `
            <h1 style="color: #ff6b6b; font-size: 48px; margin: 0 0 20px 0;">WAVE DEFENSE</h1>
            <div style="color: white; font-size: 24px; margin: 20px 0;">
                <p>Defeat 3 waves of enemies!</p>
                <p style="font-size: 18px; opacity: 0.8;">Wave 1: 5 enemies | Wave 2: 10 enemies | Wave 3: 15 enemies</p>
            </div>
            <div style="margin-top: 30px; padding: 20px; background: #ff6b6b; border-radius: 10px;">
                <p style="color: white; font-size: 26px; margin: 0; font-weight: bold;">Press SPACE to Shoot</p>
                <p style="color: white; font-size: 20px; margin: 10px 0 0 0;">Use WASD to Move</p>
            </div>
            <button id="start-wave-btn" style="
                margin-top: 30px;
                padding: 15px 40px;
                font-size: 24px;
                background: #4CAF50;
                color: white;
                border: none;
                border-radius: 8px;
                cursor: pointer;
                font-weight: bold;
            ">Start Waves</button>
        `;

        document.body.appendChild(startElement);

        // Add button click handler
        const startBtn = document.getElementById('start-wave-btn');
        startBtn.addEventListener('click', () => {
            startElement.remove();
            this.waveManager.startFirstWave();
        });
    }

    update() {
        // Update wave manager
        this.waveManager.update();

        // Check if all waves are complete
        if (this.waveManager.isComplete()) {
            this.winLevel();
        }
    }

    winLevel() {
        if (this.levelWon) return;
        this.levelWon = true;

        console.log("🎉 Level 4 Won!");

        // Show victory message
        const dialogueSystem = new DialogueSystem();
        dialogueSystem.showDialogue(
            'You have defeated all waves! You are a true warrior!',
            'Victory!',
            this.gameEnv.path + '/images/projects/mansionGame/key_lvl3.png'
        );

        dialogueSystem.addButtons([
            {
                text: 'Continue',
                primary: true,
                action: () => {
                    dialogueSystem.closeDialogue();
                    // TODO: Transition to next level
                    alert("Level 4 Complete!");
                }
            }
        ]);
    }

    // Clean up when level is destroyed
    destroy() {
        document.removeEventListener('keydown', this.inputHandler);
        this.waveManager.destroy();
        if (this.backgroundMusic) {
            this.backgroundMusic.pause();
        }
    }
}

export default MansionLevel4;
