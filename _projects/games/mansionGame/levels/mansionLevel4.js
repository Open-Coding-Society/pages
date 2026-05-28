import GameEnvBackground from '@assets/js/GameEnginev1.1/essentials/GameEnvBackground.js';
import Player from '@assets/js/GameEnginev1.1/essentials/Player.js';
import Npc from '@assets/js/GameEnginev1.1/essentials/Npc.js';
import DialogueSystem from '@assets/js/GameEnginev1.1/essentials/DialogueSystem.js';

import Barrier from './Barrier.js';
import { WaveManager } from './waveManager.js';

class MansionLevel4 {
    constructor(gameEnv) {
        let width  = gameEnv.innerWidth;
        let height = gameEnv.innerHeight;
        let path   = gameEnv.path;

        // Initialize wave manager
        this.waveManager = new WaveManager(gameEnv);

        // Background
        const image_data_background = {
            name: 'background',
            greeting: "Wave Defense! Defeat all enemies to proceed!",
            src: path + "/images/projects/mansionGame/lvl4.png",
            pixels: { height: 1600, width: 1600 }
        };

        // Player
        const sprite_data_player = {
            id: 'Spook',
            greeting: "Hi, I am Spook.",
            src: path + "/images/projects/mansionGame/spookMcWalk.png",
            SCALE_FACTOR: 6,
            STEP_FACTOR: 500,
            ANIMATION_RATE: 10,
            INIT_POSITION: { x: width * 0.1, y: height / 2 },
            pixels: { height: 2400, width: 3600 },
            orientation: { rows: 2, columns: 3 },
            down:      { row: 1, start: 0, columns: 3 },
            downRight: { row: 1, start: 0, columns: 3, rotate:  Math.PI / 16 },
            downLeft:  { row: 0, start: 0, columns: 3, rotate: -Math.PI / 16 },
            left:      { row: 0, start: 0, columns: 3 },
            right:     { row: 1, start: 0, columns: 3 },
            up:        { row: 1, start: 0, columns: 3 },
            upLeft:    { row: 0, start: 0, columns: 3, rotate:  Math.PI / 16 },
            upRight:   { row: 1, start: 0, columns: 3, rotate: -Math.PI / 16 },
            hitbox: { widthPercentage: 0.45, heightPercentage: 0.2 },
            keypress: { up: 87, left: 65, down: 83, right: 68 } // W A S D
        };

        // Boundary walls
        const barrierData = [
            { x: width * 0,          y: height * 0,           width: width * width,  height: height * 20,     visible: false }, // top
            { x: width * 0,          y: height * height - 20, width: width * width,  height: height * 20,     visible: false }, // bottom
            { x: width * 0,          y: height * 0,           width: width * 20,     height: height * height,  visible: false }, // left
            { x: width * width - 20,         y: height * 0,           width: width * 20,     height: height * height,  visible: false }  // right
        ];

        this.classes = [
            { class: GameEnvBackground, data: image_data_background },
            { class: Player, data: sprite_data_player },
            ...barrierData.map(data => ({ class: Barrier, data }))
        ];

        this.gameEnv = gameEnv;

        // Background music
        this.backgroundMusic = new Audio(path + '/assets/sounds/mansionGame/SpookieDookie.mp3');
        this.backgroundMusic.loop   = true;
        this.backgroundMusic.volume = 0.4;
        this.backgroundMusic.play();

        this.setupInputListener();
        this.showStartUI();
    }

    setupInputListener() {
        this.keysHeld = new Set();
        this.lastShootTime = 0;
        this.shootCooldown = 250; // milliseconds between shots

        this.keydownHandler = (e) => {
            this.keysHeld.add(e.code);

            if (e.code === 'Space') {
                e.preventDefault();
            }
        };

        this.keyupHandler = (e) => {
            this.keysHeld.delete(e.code);
        };

        document.addEventListener('keydown', this.keydownHandler);
        document.addEventListener('keyup',   this.keyupHandler);
    }
    showWaveMessage(message, callback) {
    const msg = document.createElement('div');

    msg.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(0,0,0,0.95);
        color: white;
        padding: 40px 60px;
        border-radius: 15px;
        border: 3px solid #ff6b6b;
        z-index: 10000;
        text-align: center;
        box-shadow: 0 0 40px rgba(255, 107, 107, 0.9);
    `;

    msg.innerHTML = `
        <h1 style="color:#ff6b6b;font-size:42px;margin-bottom:20px;">
            ${message}
        </h1>

        <button id="continue-wave-btn" style="
            padding: 15px 35px;
            font-size: 22px;
            background: #4CAF50;
            color: white;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-weight: bold;
        ">
            Continue
        </button>
    `;

    document.body.appendChild(msg);

    document.getElementById('continue-wave-btn')
        .addEventListener('click', () => {
            msg.remove();

            if (callback) callback();
        });
    }
    showStartUI() {
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
            <h1 style="color:#ff6b6b;font-size:48px;margin:0 0 20px 0;">WAVE DEFENSE</h1>
            <div style="color:white;font-size:24px;margin:20px 0;">
                <p>Defeat 3 waves of enemies!</p>
                <p style="font-size:18px;opacity:0.8;">
                    Wave 1: 5 enemies &nbsp;|&nbsp; Wave 2: 10 enemies &nbsp;|&nbsp; Wave 3: 15 enemies
                </p>
            </div>
            <div style="margin-top:30px;padding:20px;background:#ff6b6b;border-radius:10px;">
                <p style="color:white;font-size:26px;margin:0;font-weight:bold;">SPACE to Shoot (hold WASD to aim)</p>
                <p style="color:white;font-size:20px;margin:10px 0 0 0;">WASD to Move</p>
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

        document.getElementById('start-wave-btn').addEventListener('click', () => {
            startElement.remove();
            this.waveManager.startFirstWave();
        });
    }

    update() {
        // Handle continuous shooting while Space is held
        if (this.keysHeld.has('Space')) {
            const now = Date.now();
            if (now - this.lastShootTime >= this.shootCooldown) {
                this.lastShootTime = now;

                // Build direction vector from held WASD keys
                let dx = 0, dy = 0;
                if (this.keysHeld.has('KeyW')) dy -= 1;
                if (this.keysHeld.has('KeyS')) dy += 1;
                if (this.keysHeld.has('KeyA')) dx -= 1;
                if (this.keysHeld.has('KeyD')) dx += 1;

                // Default to shooting right if standing still
                if (dx === 0 && dy === 0) dx = 1;

                this.waveManager.playerShoot({ dx, dy });
            }
        }

        this.waveManager.update();

        // Show message between Wave 1 and Wave 2
        if (
            this.waveManager.currentWave === 1 &&
            this.waveManager.enemies.length === 0 &&
            !this.wave2MessageShown
        ) {
            this.wave2MessageShown = true;

            this.showWaveMessage(
                "Wave 1 Complete! Wave 2 Incoming...",
                () => {
                    this.waveManager.startWave(2);
                }
            );
        }

        if (this.waveManager.isComplete()) {
            this.winLevel();
        }
    }

    winLevel() {
        if (this.levelWon) return;
        this.levelWon = true;

        console.log("🎉 Level 4 Won!");

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
                    alert("Level 4 Complete! Key Recieved!");
                }
            }
        ]);
    }

    destroy() {
        document.removeEventListener('keydown', this.keydownHandler);
        document.removeEventListener('keyup',   this.keyupHandler);
        this.waveManager.destroy();
        if (this.backgroundMusic) {
            this.backgroundMusic.pause();
        }
    }
}

export default MansionLevel4;