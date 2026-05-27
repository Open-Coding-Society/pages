import GameEnvBackground from '@assets/js/GameEnginev1.1/essentials/GameEnvBackground.js';
import GameObject from '@assets/js/GameEnginev1.1/essentials/GameObject.js';
import Player from '@assets/js/GameEnginev1.1/essentials/Player.js';
import Npc from '@assets/js/GameEnginev1.1/essentials/Npc.js';
import DialogueSystem from '@assets/js/GameEnginev1.1/essentials/DialogueSystem.js';
import MansionLevel2_Cemetery from './mansionLevel2_Cemetery.js';

class Reaper extends Npc {
    update() {
        if (this.gameEnv?.gameControl?.isPaused) {
            this.draw();
            return;
        }

        if (this.isKilling) {
            super.update();
            return;
        }

        const players = this.gameEnv.gameObjects.filter(
            obj => obj instanceof Player
        );

        if (players.length > 0) {
            let nearest = players[0];
            let minDist = Infinity;

            for (const player of players) {
                const dx = player.position.x - this.position.x;
                const dy = player.position.y - this.position.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < minDist) {
                    minDist = dist;
                    nearest = player;
                }
            }

            const speed = this.spriteData?.speed ?? 1.1;
            const dx = nearest.position.x - this.position.x;
            const dy = nearest.position.y - this.position.y;
            const angle = Math.atan2(dy, dx);

            this.position.x += Math.cos(angle) * speed;
            this.position.y += Math.sin(angle) * speed;
        }

        super.update();
    }

}

class HealthPlayer extends Player {
    constructor(data = null, gameEnv = null) {
        super(data, gameEnv);
        this.health = 100;
        this.reaperCollisionActive = false;
    }

    updateHealthDisplay() {
        if (this.healthDisplayElement) {
            this.healthDisplayElement.textContent = `Health: ${Math.max(0, this.health)}`;
        }
    }

    triggerScreenShake() {
        const container = this.gameEnv?.container;
        if (!container || this.shakeInProgress) return;

        this.shakeInProgress = true;
        const intensity = 8;
        const frames = 8;
        let count = 0;

        const originalTransform = container.style.transform || '';
        const intervalId = setInterval(() => {
            const offsetX = Math.round((Math.random() - 0.5) * intensity);
            const offsetY = Math.round((Math.random() - 0.5) * intensity);
            container.style.transform = `${originalTransform} translate(${offsetX}px, ${offsetY}px)`;
            count += 1;
            if (count >= frames) {
                clearInterval(intervalId);
                container.style.transform = originalTransform;
                this.shakeInProgress = false;
            }
        }, 16);
    }

    handleCollisionReaction(other) {
        const hitReaper = other?.id === 'Reaper' || other?.id === 'Reaper2';
        if (hitReaper && !this.reaperCollisionActive) {
            this.reaperCollisionActive = true;
            this.health = Math.max(0, this.health - 10);
            this.updateHealthDisplay();
            this.triggerScreenShake();
        }
        super.handleCollisionReaction(other);
    }

    update() {
        super.update();
        if (this.reaperCollisionActive && !this.state.collisionEvents.includes('Reaper') && !this.state.collisionEvents.includes('Reaper2')) {
            this.reaperCollisionActive = false;
        }
    }

    handleCollisionState() {
        if (this.state.collisionEvents.includes('Reaper') || this.state.collisionEvents.includes('Reaper2')) {
            this.state.movement = { up: true, down: true, left: true, right: true };
            return;
        }
        if (typeof super.handleCollisionState === 'function') {
            super.handleCollisionState();
        }
    }
}

// Mansion Level 2 Game with WASD character movement.
class MansionLevel2 {
    constructor(gameEnv) {
        this.gameEnv = gameEnv;
        let width = gameEnv.innerWidth;
        let height = gameEnv.innerHeight;
        let path = gameEnv.path;

        // Background
        const image_background = path + "/images/projects/mansionGame/background.jpg";

        const image_data_background = {
            name: 'background',
            greeting: "You have entered the haunted graveyard. Beware!",
            src: image_background,
            pixels: { height: 1280, width: 720 }
        };

        // Player
        const sprite_src_mc = path + "/images/projects/mansionGame/spookMcWalk.png";
        const MC_SCALE_FACTOR = 6;

        const sprite_data_player = {
            id: 'Spook',
            greeting: "Hi, I am Spook.",
            src: sprite_src_mc,
            SCALE_FACTOR: MC_SCALE_FACTOR,
            STEP_FACTOR: 800,
            ANIMATION_RATE: 10,

            INIT_POSITION: {
                x: 50,
                y: height - (height / MC_SCALE_FACTOR)
            },

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

            hitbox: {
                widthPercentage: 0.45,
                heightPercentage: 0.2
            },

            keypress: {
                up: 87,
                left: 65,
                down: 83,
                right: 68
            }
        };

        // REAPER ENEMY
        const sprite_src_reaper = path + "/images/projects/mansionGame/Reaper.png";

        const sprite_data_reaper = {
            id: "Reaper",
            greeting: "The Reaper is hunting you...",
            src: sprite_src_reaper,

            SCALE_FACTOR: 5,
            ANIMATION_RATE: 0,
            speed: 1.1,

            pixels: {
                height: 256,
                width: 256
            },

            INIT_POSITION: {
                x: width * 0.8,
                y: height * 0.2
            },

            orientation: {
                rows: 1,
                columns: 1
            },

            hitbox: {
                widthPercentage: 0.4,
                heightPercentage: 0.4
            },

            zIndex: 10,
            isKilling: false,
        };

        const sprite_data_reaper_slow = {
            id: "Reaper2",
            greeting: "A second reaper stalks you...",
            src: sprite_src_reaper,

            SCALE_FACTOR: 5,
            ANIMATION_RATE: 0,
            speed: 0.3,

            pixels: {
                height: 256,
                width: 256
            },

            INIT_POSITION: {
                x: width * 0.2,
                y: height * 0.5
            },

            orientation: {
                rows: 1,
                columns: 1
            },

            hitbox: {
                widthPercentage: 0.4,
                heightPercentage: 0.4
            },

            zIndex: 10,
            isKilling: false,
        };

        // Background + player + reapers
        this.classes = [
            { class: GameEnvBackground, data: image_data_background },
            { class: HealthPlayer, data: sprite_data_player },
            { class: Reaper, data: sprite_data_reaper },
            { class: Reaper, data: sprite_data_reaper_slow }
        ];
    }

    initialize() {
        this.setupHealthDisplay();
        console.log("MansionLevel2 initialized");
    }

    setupHealthDisplay() {
        const player = this.gameEnv.gameObjects.find(obj => obj instanceof HealthPlayer);
        if (!player) return;

        const healthElement = document.createElement('div');
        healthElement.style.position = 'absolute';
        healthElement.style.top = '16px';
        healthElement.style.left = '16px';
        healthElement.style.padding = '8px 12px';
        healthElement.style.color = '#fff';
        healthElement.style.background = 'rgba(0, 0, 0, 0.65)';
        healthElement.style.borderRadius = '8px';
        healthElement.style.fontFamily = 'sans-serif';
        healthElement.style.fontSize = '16px';
        healthElement.style.zIndex = '9999';
        healthElement.style.pointerEvents = 'none';
        healthElement.textContent = `Health: ${player.health}`;

        this.gameEnv.container.appendChild(healthElement);
        player.healthDisplayElement = healthElement;
        this.healthDisplayElement = healthElement;
    }

    destroy() {
        if (this.gameEnv && this.gameEnv.container && this.gameEnv.container.contains(this.healthDisplayElement)) {
            this.gameEnv.container.removeChild(this.healthDisplayElement);
        }
    }
}

export default MansionLevel2;
