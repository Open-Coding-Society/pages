import GameEnvBackground from '@assets/js/GameEnginev1.1/essentials/GameEnvBackground.js';
import Player from '@assets/js/GameEnginev1.1/essentials/Player.js';
import Npc from '@assets/js/GameEnginev1.1/essentials/Npc.js';
import DialogueSystem from '@assets/js/GameEnginev1.1/essentials/DialogueSystem.js';

import { WaveManager } from './WaveManager.js';
 
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

        this.classes = [
            { class: GameEnvBackground, data: image_data_background },
            { class: Player, data: sprite_data_player }
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

    initialize() {
        const player = this.getPlayer();
        if (!player) return;

        // Level 4 has lots of overlapping combat objects. Keep held WASD keys
        // alive across incidental collisions so the player cannot get stuck.
        player.clearPressedKeysOnCollision = false;
    }

    setupInputListener() {
        this.keysHeld = new Set();
        this.lastHorizontalAim = 'KeyD';
        this.lastVerticalAim = null;
        this.lastAimDirection = { dx: 1, dy: 0 };
        this.lastShootTime = 0;
        this.shootCooldown = 250; // milliseconds between shots

        this.keydownHandler = (e) => {
            this.keysHeld.add(e.code);
            this.updateAimIntent(e.code);

            if (e.code === 'Space') {
                e.preventDefault();
            }
        };

        this.keyupHandler = (e) => {
            this.keysHeld.delete(e.code);
            this.refreshAimIntent(e.code);
        };

        document.addEventListener('keydown', this.keydownHandler);
        document.addEventListener('keyup',   this.keyupHandler);
    }

    updateAimIntent(code) {
        if (code === 'KeyA' || code === 'KeyD') {
            this.lastHorizontalAim = code;
        }

        if (code === 'KeyW' || code === 'KeyS') {
            this.lastVerticalAim = code;
        }
    }

    refreshAimIntent(releasedCode) {
        if (releasedCode === this.lastHorizontalAim) {
            if (this.keysHeld.has('KeyA')) {
                this.lastHorizontalAim = 'KeyA';
            } else if (this.keysHeld.has('KeyD')) {
                this.lastHorizontalAim = 'KeyD';
            } else {
                this.lastHorizontalAim = null;
            }
        }

        if (releasedCode === this.lastVerticalAim) {
            if (this.keysHeld.has('KeyW')) {
                this.lastVerticalAim = 'KeyW';
            } else if (this.keysHeld.has('KeyS')) {
                this.lastVerticalAim = 'KeyS';
            } else {
                this.lastVerticalAim = null;
            }
        }
    }

    getShootDirection() {
        let dx = 0;
        let dy = 0;

        if (this.lastHorizontalAim && this.keysHeld.has(this.lastHorizontalAim)) {
            dx = this.lastHorizontalAim === 'KeyA' ? -1 : 1;
        } else if (this.keysHeld.has('KeyA') !== this.keysHeld.has('KeyD')) {
            dx = this.keysHeld.has('KeyA') ? -1 : 1;
        }

        if (this.lastVerticalAim && this.keysHeld.has(this.lastVerticalAim)) {
            dy = this.lastVerticalAim === 'KeyW' ? -1 : 1;
        } else if (this.keysHeld.has('KeyW') !== this.keysHeld.has('KeyS')) {
            dy = this.keysHeld.has('KeyW') ? -1 : 1;
        }

        if (dx !== 0 || dy !== 0) {
            this.lastAimDirection = { dx, dy };
        }

        return this.lastAimDirection;
    }

    getPlayer() {
        return this.gameEnv.gameObjects.find(obj => obj instanceof Player);
    }

    syncPlayerMovementInput() {
        const player = this.getPlayer();
        if (!player || !player.pressedKeys) return;

        const movementKeys = [
            ['KeyW', player.keypress.up],
            ['KeyA', player.keypress.left],
            ['KeyS', player.keypress.down],
            ['KeyD', player.keypress.right]
        ];

        for (const [code, keyCode] of movementKeys) {
            if (this.keysHeld.has(code)) {
                player.pressedKeys[keyCode] = true;
            } else {
                delete player.pressedKeys[keyCode];
            }
        }

        player.updateVelocity();
        player.updateDirection();
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
        this.syncPlayerMovementInput();

        // Handle continuous shooting while Space is held
        if (this.keysHeld.has('Space')) {
            const now = Date.now();
            if (now - this.lastShootTime >= this.shootCooldown) {
                this.lastShootTime = now;

                this.waveManager.playerShoot(this.getShootDirection());
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
