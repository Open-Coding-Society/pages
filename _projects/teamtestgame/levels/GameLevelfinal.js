import GameEnvBackground from '/assets/js/GameEnginev1/essentials/GameEnvBackground.js';
import Player from '/assets/js/GameEnginev1/essentials/Player.js';
import Npc from '/assets/js/GameEnginev1/essentials/Npc.js';
import Barrier from '/assets/js/GameEnginev1/essentials/Barrier.js';
import Coin from '/assets/js/GameEnginev1.1/Coin.js';

class GameLevelfinal {
    constructor(gameEnv) {
        const path = gameEnv.path;
        const self = this;

        this.gameEnv = gameEnv;
        this.path = path;
        this.killerStarted = false;
        this.playerDead = false;
        this.killerImg = null;

        const bgData = {
            name: "custom_bg",
            src: path + "/projects/teamtestgame/images/pixelgameimgforgame.jpg",
            pixels: { height: 772, width: 1134 }
        };

        const playerData = {
            id: 'playerData',
            src: path + "/projects/teamtestgame/images/astro.png",
            SCALE_FACTOR: 8,
            STEP_FACTOR: 1000,
            ANIMATION_RATE: 50,
            INIT_POSITION: { x: 100, y: 300 },
            pixels: { height: 770, width: 513 },
            orientation: { rows: 4, columns: 4 },

            down: { row: 0, start: 0, columns: 3 },
            right: { row: 1, start: 0, columns: 3 },
            left: { row: 2, start: 0, columns: 3 },
            up: { row: 3, start: 0, columns: 3 },

            downRight: { row: 1, start: 0, columns: 3, rotate: Math.PI / 16 },
            downLeft: { row: 2, start: 0, columns: 3, rotate: -Math.PI / 16 },
            upRight: { row: 3, start: 0, columns: 3, rotate: -Math.PI / 16 },
            upLeft: { row: 3, start: 0, columns: 3, rotate: Math.PI / 16 },

            hitbox: { widthPercentage: 0.2, heightPercentage: 0.2 },
            keypress: { up: 87, left: 65, down: 83, right: 68 }
        };

        const npcData1 = {
            id: 'AI',
            greeting: 'ah',
            src: path + "/projects/teamtestgame/images/chillguy.png",
            SCALE_FACTOR: 8,
            ANIMATION_RATE: 50,
            INIT_POSITION: { x: 500, y: 300 },
            pixels: { height: 512, width: 384 },
            orientation: { rows: 4, columns: 3 },

            down: { row: 0, start: 0, columns: 3 },
            right: { row: 1, start: 0, columns: 3 },
            left: { row: 2, start: 0, columns: 3 },
            up: { row: 3, start: 0, columns: 3 },

            upRight: { row: 3, start: 0, columns: 3 },
            downRight: { row: 1, start: 0, columns: 3 },
            upLeft: { row: 2, start: 0, columns: 3 },
            downLeft: { row: 0, start: 0, columns: 3 },

            hitbox: { widthPercentage: 0.1, heightPercentage: 0.2 },
            dialogues: [
                'Nice moonwalk. It would be a shame to lose that walk of perfection but too bad. Die. Not all games have a happy ending!!!🔥🔥🔥'
            ],

            reaction: function () {
                if (this.dialogueSystem) {
                    this.showReactionDialogue();
                } else {
                    console.log(this.greeting);
                }
            },

            interact: function () {
                if (this.dialogueSystem) {
                    this.showRandomDialogue();
                }

                if (!self.killerStarted && !self.playerDead) {
                    self.killerStarted = true;
                    // 6 second delay — enough time to read the full dialogue
                    setTimeout(() => {
                        self.spawnKiller();
                    }, 6000);
                }
            }
        };

        const coinData = {
            id: 'coin-final',
            greeting: false,
            INIT_POSITION: { x: 0.72, y: 0.58 },
            width: 40,
            height: 70,
            color: '#FFD700',
            hitbox: { widthPercentage: 0.0, heightPercentage: 0.0 },
            zIndex: 20,
            value: 1
        };

        this.classes = [
            { class: GameEnvBackground, data: bgData },
            { class: Player, data: playerData },
            { class: Npc, data: npcData1 },
            { class: Coin, data: coinData }
        ];

        /* BUILDER_ONLY_START */
        try {
            setTimeout(() => {
                try {
                    const objs = Array.isArray(gameEnv?.gameObjects) ? gameEnv.gameObjects : [];
                    const summary = objs.map(o => ({
                        cls: o?.constructor?.name || 'Unknown',
                        id: o?.canvas?.id || '',
                        z: o?.canvas?.style?.zIndex || ''
                    }));

                    if (window && window.parent) {
                        window.parent.postMessage({ type: 'rpg:objects', summary }, '*');
                    }
                } catch (_) {}
            }, 250);
        } catch (_) {}

        try {
            if (window && window.parent) {
                try {
                    const rect =
                        (gameEnv && gameEnv.container && gameEnv.container.getBoundingClientRect)
                            ? gameEnv.container.getBoundingClientRect()
                            : { top: gameEnv.top || 0, left: 0 };

                    window.parent.postMessage(
                        { type: 'rpg:env-metrics', top: rect.top, left: rect.left },
                        '*'
                    );
                } catch (_) {
                    try {
                        window.parent.postMessage(
                            { type: 'rpg:env-metrics', top: gameEnv.top, left: 0 },
                            '*'
                        );
                    } catch (__ ) {}
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
                } else if (e.data.type === 'rpg:set-drawn-barriers') {
                    const arr = Array.isArray(e.data.barriers) ? e.data.barriers : [];

                    window.__overlayBarriers = window.__overlayBarriers || [];

                    try {
                        for (const ob of window.__overlayBarriers) {
                            if (ob && typeof ob.destroy === 'function') {
                                ob.destroy();
                            }
                        }
                    } catch (_) {}

                    window.__overlayBarriers = [];

                    for (const bd of arr) {
                        try {
                            const data = {
                                id: bd.id,
                                x: bd.x,
                                y: bd.y,
                                width: bd.width,
                                height: bd.height,
                                visible: !!bd.visible,
                                hitbox: { widthPercentage: 0.0, heightPercentage: 0.0 },
                                fromOverlay: true
                            };

                            const bobj = new Barrier(data, gameEnv);
                            gameEnv.gameObjects.push(bobj);
                            window.__overlayBarriers.push(bobj);
                        } catch (_) {}
                    }
                }
            });
        } catch (_) {}
        /* BUILDER_ONLY_END */
    }

    getPlayerObject() {
        const objs = Array.isArray(this.gameEnv?.gameObjects) ? this.gameEnv.gameObjects : [];

        for (const obj of objs) {
            if (obj && obj.canvas && obj.canvas.id === 'playerData') {
                return obj;
            }
        }

        for (const obj of objs) {
            if (obj && obj.constructor && obj.constructor.name === 'Player') {
                return obj;
            }
        }

        return null;
    }

    spawnKiller() {
        if (this.playerDead) return;

        const playerObj = this.getPlayerObject();
        if (!playerObj || !playerObj.canvas) {
            console.log("Killer could not spawn: player not found.");
            return;
        }

        const killerChoices = [
            path + "/images/projects/teamtestgame/meteorforgame.jpg"
        ];

        const killerSrc = killerChoices[Math.floor(Math.random() * killerChoices.length)];

        const killer = document.createElement("img");
        killer.src = killerSrc;
        killer.style.position = "fixed";
        killer.style.width = "70px";
        killer.style.height = "70px";
        killer.style.maxWidth = "70px";
        killer.style.maxHeight = "70px";
        killer.style.left = "0px";
        killer.style.top = "0px";
        killer.style.zIndex = "9999";
        killer.style.pointerEvents = "none";
        killer.style.objectFit = "contain";

        document.body.appendChild(killer);
        this.killerImg = killer;

        let killerX;
        let killerY;

        const side = Math.floor(Math.random() * 4);

        if (side === 0) {
            killerX = -80;
            killerY = Math.random() * (window.innerHeight - 80);
        } else if (side === 1) {
            killerX = window.innerWidth + 10;
            killerY = Math.random() * (window.innerHeight - 80);
        } else if (side === 2) {
            killerX = Math.random() * (window.innerWidth - 80);
            killerY = -80;
        } else {
            killerX = Math.random() * (window.innerWidth - 80);
            killerY = window.innerHeight + 10;
        }

        killer.style.left = killerX + "px";
        killer.style.top = killerY + "px";

        const speed = 10;

        const chase = () => {
            if (this.playerDead) return;
            if (!playerObj.canvas || !document.body.contains(killer)) return;

            const playerRect = playerObj.canvas.getBoundingClientRect();
            const playerX = playerRect.left + (playerRect.width / 2);
            const playerY = playerRect.top + (playerRect.height / 2);

            const dx = playerX - killerX;
            const dy = playerY - killerY;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < 35) {
                this.killPlayer();
                return;
            }

            if (dist > 0) {
                killerX += (dx / dist) * speed;
                killerY += (dy / dist) * speed;
            }

            killer.style.left = killerX + "px";
            killer.style.top = killerY + "px";
            killer.style.transform = dx < 0 ? "scaleX(-1)" : "scaleX(1)";

            requestAnimationFrame(chase);
        };

        requestAnimationFrame(chase);
    }

    killPlayer() {
        if (this.playerDead) return;
        this.playerDead = true;

        if (this.killerImg) {
            this.killerImg.remove();
            this.killerImg = null;
        }

        const overlay = document.createElement("div");
        overlay.style.position = "fixed";
        overlay.style.top = "0";
        overlay.style.left = "0";
        overlay.style.width = "100vw";
        overlay.style.height = "100vh";
        overlay.style.backgroundColor = "rgba(0, 0, 0, 0.75)";
        overlay.style.zIndex = "10000";
        overlay.style.display = "flex";
        overlay.style.flexDirection = "column";
        overlay.style.alignItems = "center";
        overlay.style.justifyContent = "center";
        overlay.style.color = "white";
        overlay.style.fontFamily = "monospace";
        overlay.style.textAlign = "center";
        overlay.style.pointerEvents = "none"; 

        overlay.innerHTML = `
            <div style="font-size: 56px; color: red; font-weight: bold;">YOU DIED!!!🔥</div>
            <div style="font-size: 20px; margin-top: 12px;">A homing missile has killed you.</div>
        `;

        document.body.appendChild(overlay);
    }
}

export const gameLevelClasses = [GameLevelfinal];
export default GameLevelfinal;
