import GameEnvBackground from '/assets/js/GameEnginev1/essentials/GameEnvBackground.js';
import Player from '/assets/js/GameEnginev1/essentials/Player.js';
import Npc from '/assets/js/GameEnginev1/essentials/Npc.js';
import Barrier from '/assets/js/GameEnginev1/essentials/Barrier.js';

class GameLevelCustom {
    constructor(gameEnv) {
        const path = gameEnv.path;
        const width = gameEnv.innerWidth;
        const height = gameEnv.innerHeight;

        const bgData = {
            name: "custom_bg",
            src: path + "/images/gamebuilder/bg/alien_planet.jpg",
            pixels: { height: 772, width: 1134 }
        };

        const playerData = {
            id: 'playerData',
            src: path + "/images/gamebuilder/sprites/astro.png",
            SCALE_FACTOR: 5,
            STEP_FACTOR: 1000,
            ANIMATION_RATE: 50,
            INIT_POSITION: { x: 100, y: 52 },
            pixels: { height: 770, width: 513 },
            orientation: { rows: 4, columns: 4 },
            down: { row: 0, start: 0, columns: 3 },
            downRight: { row: 1, start: 0, columns: 3, rotate: Math.PI/16 },
            downLeft: { row: 0, start: 0, columns: 3, rotate: -Math.PI/16 },
            left: { row: 2, start: 0, columns: 3 },
            right: { row: 1, start: 0, columns: 3 },
            up: { row: 3, start: 0, columns: 3 },
            upLeft: { row: 2, start: 0, columns: 3, rotate: Math.PI/16 },
            upRight: { row: 3, start: 0, columns: 3, rotate: -Math.PI/16 },
            hitbox: { widthPercentage: 0, heightPercentage: 0 },
            keypress: { up: 87, left: 65, down: 83, right: 68 },
            GRAVITY: false
        };

        const platformData = {
            id: 'platform',
            x: 0,
            y: height * 0.6,
            width: width,
            height: 20,
            visible: true,
            color: 'rgba(180, 120, 40, 0.9)',
            hitbox: { widthPercentage: 0.0, heightPercentage: 0.0 },
            fromOverlay: true
        };

        this.classes = [
            { class: GameEnvBackground, data: bgData },
            { class: Player, data: playerData },
            { class: Barrier, data: platformData }
        ];

        // ── Gravity + Grounded Jumping ───────────────────────────────
        this.initialize = () => {
            const player = gameEnv.gameObjects.find(obj => obj instanceof Player);
            if (!player) return;

            let vy = 0;
            let isGrounded = false;
            const gravity = 0.5;

            function jump() {
                if (isGrounded) {
                    vy = -10;
                    isGrounded = false;
                }
            }

            const _originalUpdate = player.update.bind(player);

            player.update = function () {
                const wDown = this.pressedKeys?.[87];
                if (wDown && !this._wWasDown) {
                    jump();
                }
                this._wWasDown = !!wDown;

                const maxFall = 10;
                vy = Math.min(vy + gravity, maxFall);

                this.velocity.y = 0;
                this.position.y += vy;

                // assume airborne each frame
                isGrounded = false;

                // platform collision
                const platformTop = gameEnv.innerHeight * 0.6;
                if (this.position.y + this.height >= platformTop && vy >= 0) {
                    this.position.y = platformTop - this.height;
                    vy = 0;
                    isGrounded = true;
                }

                // floor collision
                const floor = gameEnv.innerHeight - this.height;
                if (this.position.y >= floor) {
                    this.position.y = floor;
                    vy = 0;
                    isGrounded = true;
                }

                // ceiling clamp
                if (this.position.y < 0) {
                    this.position.y = 0;
                    vy = 0;
                }

                _originalUpdate();
                this.velocity.y = 0;
            };
        };

        /* BUILDER_ONLY_START */
        try {
            setTimeout(() => {
                try {
                    const objs = Array.isArray(gameEnv?.gameObjects) ? gameEnv.gameObjects : [];
                    const summary = objs.map(o => ({ cls: o?.constructor?.name || 'Unknown', id: o?.canvas?.id || '', z: o?.canvas?.style?.zIndex || '' }));
                    if (window && window.parent) window.parent.postMessage({ type: 'rpg:objects', summary }, '*');
                } catch (_) {}
            }, 250);
        } catch (_) {}

        try {
            if (window && window.parent) {
                try {
                    const rect = (gameEnv && gameEnv.container && gameEnv.container.getBoundingClientRect) ? gameEnv.container.getBoundingClientRect() : { top: gameEnv.top || 0, left: 0 };
                    window.parent.postMessage({ type: 'rpg:env-metrics', top: rect.top, left: rect.left }, '*');
                } catch (_) {
                    try { window.parent.postMessage({ type: 'rpg:env-metrics', top: gameEnv.top, left: 0 }, '*'); } catch (__){}
                }
            }
        } catch (_) {}

        try {
            window.addEventListener('message', (e) => {
                if (!e || !e.data) return;

                if (e.data.type === 'rpg:toggle-walls') {
                    const show = !!e.data.visible;
                    if (Array.isArray(gameEnv?.gameObjects)) {
                        for (const obj of gameEnv.gameObjects) {
                            if (obj instanceof Barrier) {
                                obj.visible = show;
                            }
                        }
                    }
                }
            });
        } catch (_) {}
        /* BUILDER_ONLY_END */
    }
}

export const gameLevelClasses = [GameLevelCustom];