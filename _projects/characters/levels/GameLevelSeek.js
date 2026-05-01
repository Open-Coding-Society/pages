import GameEnvBackground from '@assets/js/GameEnginev1.1/essentials/GameEnvBackground.js';
import Player from '@assets/js/GameEnginev1.1/essentials/Player.js';
import Npc from '@assets/js/GameEnginev1.1/essentials/Npc.js';
import Barrier from '@assets/js/GameEnginev1.1/essentials/Barrier.js';
import Collectible from '@assets/js/GameEnginev1.1/essentials/Collectible.js';

console.log('GameLevelSeek.js loaded:', new Date().toISOString());

class GameLevelSeek {
    constructor(gameEnv) {
        this.gameEnv = gameEnv;
        this.levelCompleted = false;
        this.completionTriggered = false;
        this.spriteSwapScrollTriggered = false;

        const path = gameEnv.path;
        const width = gameEnv.innerWidth;
        const height = gameEnv.innerHeight;

        // ---------------- BACKGROUND ----------------
        const bgData = {
            name: "custom_bg",
            src: path + "/images/projects/characters/tagplayground.png",
            pixels: { height: 400, width: 560 }
        };

        // ---------------- PLAYER ----------------
        const playerData = {
            id: 'playerData',
            src: path + "/images/projects/characters/boysprite.png",
            SCALE_FACTOR: 5,
            STEP_FACTOR: 1000,
            ANIMATION_RATE: 50,
            INIT_POSITION: { x: 32, y: 300 },
            pixels: { height: 612, width: 408 },
            orientation: { rows: 4, columns: 3 },
            down: { row: 0, start: 0, columns: 3 },
            downRight: { row: 1, start: 0, columns: 3 },
            downLeft: { row: 0, start: 0, columns: 3 },
            left: { row: 2, start: 0, columns: 3 },
            right: { row: 1, start: 0, columns: 3 },
            up: { row: 3, start: 0, columns: 3 },
            upLeft: { row: 2, start: 0, columns: 3 },
            upRight: { row: 3, start: 0, columns: 3 },
            hitbox: { widthPercentage: 0, heightPercentage: 0 },
            keypress: { up: 87, left: 65, down: 83, right: 68 }
        };

        // ---------------- GAME STATE ----------------
        const coinState = {
            total: 6,
            collected: 0,
            kirbySpawned: false
        };

        // =====================================================
        // SPRITE MENU SYSTEM (PRESS Q)
        // =====================================================
        const spriteOptions = [
            {
                label: "Boy",
                src: path + "/images/projects/characters/boysprite.png",
                pixels: { height: 612, width: 408 },
                SCALE_FACTOR: 5,
                ANIMATION_RATE: 50,
                orientation: { rows: 4, columns: 3 },
                down: { row: 0, start: 0, columns: 3 },
                downRight: { row: 1, start: 0, columns: 3 },
                downLeft: { row: 0, start: 0, columns: 3 },
                left: { row: 2, start: 0, columns: 3 },
                right: { row: 1, start: 0, columns: 3 },
                up: { row: 3, start: 0, columns: 3 },
                upLeft: { row: 2, start: 0, columns: 3 },
                upRight: { row: 3, start: 0, columns: 3 }
            },
            {
                label: "Scuba Diver",
                src: path + "/images/projects/characters/scubadiver.png",
                pixels: { height: 948, width: 632 },
                SCALE_FACTOR: 5,
                ANIMATION_RATE: 50,
                orientation: { rows: 4, columns: 3 },
                down: { row: 0, start: 0, columns: 3 },
                downRight: { row: 1, start: 0, columns: 3, rotate: Math.PI / 16 },
                downLeft: { row: 0, start: 0, columns: 3, rotate: -Math.PI / 16 },
                left: { row: 2, start: 0, columns: 3 },
                right: { row: 1, start: 0, columns: 3 },
                up: { row: 3, start: 0, columns: 3 },
                upLeft: { row: 2, start: 0, columns: 3, rotate: Math.PI / 16 },
                upRight: { row: 3, start: 0, columns: 3, rotate: -Math.PI / 16 }
            },
            {
                label: "Astro",
                src: path + "/images/projects/characters/astro.png",
                pixels: { height: 770, width: 513 },
                SCALE_FACTOR: 11,
                ANIMATION_RATE: 110,
                orientation: { rows: 4, columns: 4 },
                down: { row: 0, start: 0, columns: 4 },
                left: { row: 1, start: 0, columns: 4 },
                right: { row: 2, start: 0, columns: 4 },
                up: { row: 3, start: 0, columns: 4 },
                downRight: { row: 2, start: 0, columns: 4 },
                downLeft: { row: 1, start: 0, columns: 4 },
                upRight: { row: 2, start: 0, columns: 4 },
                upLeft: { row: 1, start: 0, columns: 4 }
            },
            {
                label: "Kirby",
                src: path + "/images/projects/characters/kirby.png",
                pixels: { height: 36, width: 569 },
                SCALE_FACTOR: 7,
                ANIMATION_RATE: 8,
                orientation: { rows: 1, columns: 13 },
                down: { row: 0, start: 0, columns: 13 },
                downRight: { row: 0, start: 0, columns: 13 },
                downLeft: { row: 0, start: 0, columns: 13 },
                left: { row: 0, start: 0, columns: 13 },
                right: { row: 0, start: 0, columns: 13 },
                up: { row: 0, start: 0, columns: 13 },
                upLeft: { row: 0, start: 0, columns: 13 },
                upRight: { row: 0, start: 0, columns: 13 }
            }
        ];

        let currentSprite = 0;

        const getPlayer = () => {
            return gameEnv.gameObjects.find(obj => obj.id === 'playerdata');
        };

        const setSprite = (spriteOption) => {
            const player = getPlayer();
            if (!player || !spriteOption) return;

            currentSprite = spriteOptions.findIndex(option => option.src === spriteOption.src);
            if (currentSprite < 0) currentSprite = 0;

            player.data.src = spriteOption.src;
            player.data.pixels = { ...spriteOption.pixels };
            player.data.SCALE_FACTOR = spriteOption.SCALE_FACTOR;
            player.data.ANIMATION_RATE = spriteOption.ANIMATION_RATE;
            player.data.orientation = { ...spriteOption.orientation };

            [
                'down',
                'downRight',
                'downLeft',
                'left',
                'right',
                'up',
                'upLeft',
                'upRight'
            ].forEach(direction => {
                player.data[direction] = spriteOption[direction]
                    ? { ...spriteOption[direction] }
                    : { row: 0, start: 0, columns: 1 };
            });

            player.spriteData = player.data;
            player.scaleFactor = spriteOption.SCALE_FACTOR;
            player.animationRate = spriteOption.ANIMATION_RATE;
            player.frameIndex = 0;
            player.frameCounter = 0;
            player.direction = 'down';
            player.resize();

            if (!player.spriteSheet) {
                player.spriteSheet = new Image();
            }

            player.spriteReady = false;
            player.spriteSheet.onload = () => {
                player.spriteReady = true;
                player.resize();
            };
            player.spriteSheet.src = spriteOption.src;

            console.log("Sprite switched:", spriteOption.label);
        };

        const menuId = 'seek-sprite-menu';
        const hintId = 'seek-sprite-hint';

        const existingMenu = document.getElementById(menuId);
        if (existingMenu) {
            existingMenu.remove();
        }

        const existingHint = document.getElementById(hintId);
        if (existingHint) {
            existingHint.remove();
        }

        const spriteMenu = document.createElement('div');
        spriteMenu.id = menuId;
        spriteMenu.style.position = 'fixed';
        spriteMenu.style.top = '50%';
        spriteMenu.style.left = '50%';
        spriteMenu.style.transform = 'translate(-50%, -50%)';
        spriteMenu.style.padding = '18px';
        spriteMenu.style.borderRadius = '14px';
        spriteMenu.style.background = 'rgba(16, 22, 31, 0.92)';
        spriteMenu.style.border = '2px solid #ffd166';
        spriteMenu.style.color = '#ffffff';
        spriteMenu.style.fontFamily = 'monospace';
        spriteMenu.style.zIndex = '9999';
        spriteMenu.style.display = 'none';
        spriteMenu.style.minWidth = '280px';
        spriteMenu.style.boxShadow = '0 20px 50px rgba(0, 0, 0, 0.4)';

        const menuTitle = document.createElement('div');
        menuTitle.textContent = 'Choose your sprite';
        menuTitle.style.fontSize = '18px';
        menuTitle.style.marginBottom = '8px';
        menuTitle.style.fontWeight = 'bold';

        const menuText = document.createElement('div');
        menuText.textContent = 'Press Q to close, or click a character below.';
        menuText.style.fontSize = '12px';
        menuText.style.marginBottom = '14px';
        menuText.style.opacity = '0.85';

        const buttonGrid = document.createElement('div');
        buttonGrid.style.display = 'grid';
        buttonGrid.style.gridTemplateColumns = 'repeat(2, minmax(110px, 1fr))';
        buttonGrid.style.gap = '10px';

        const setMenuVisibility = (isOpen) => {
            spriteMenu.style.display = isOpen ? 'block' : 'none';
        };

        const toggleMenu = () => {
            const isOpen = spriteMenu.style.display === 'block';
            setMenuVisibility(!isOpen);
        };

        spriteOptions.forEach((option, index) => {
            const button = document.createElement('button');
            button.type = 'button';
            button.textContent = option.label;
            button.style.padding = '10px 12px';
            button.style.borderRadius = '10px';
            button.style.border = '1px solid #ffd166';
            button.style.background = index === currentSprite ? '#ffd166' : '#243447';
            button.style.color = index === currentSprite ? '#111827' : '#ffffff';
            button.style.cursor = 'pointer';
            button.style.fontFamily = 'monospace';
            button.style.fontSize = '13px';

            button.addEventListener('click', () => {
                setSprite(option);
                Array.from(buttonGrid.children).forEach((child, childIndex) => {
                    child.style.background = childIndex === currentSprite ? '#ffd166' : '#243447';
                    child.style.color = childIndex === currentSprite ? '#111827' : '#ffffff';
                });
                setMenuVisibility(false);
            });

            buttonGrid.appendChild(button);
        });

        spriteMenu.appendChild(menuTitle);
        spriteMenu.appendChild(menuText);
        spriteMenu.appendChild(buttonGrid);
        document.body.appendChild(spriteMenu);

        const hint = document.createElement('div');
        hint.id = hintId;
        hint.textContent = 'Press Q to open the sprite menu';
        hint.style.position = 'fixed';
        hint.style.left = '16px';
        hint.style.bottom = '16px';
        hint.style.padding = '8px 12px';
        hint.style.borderRadius = '999px';
        hint.style.background = 'rgba(16, 22, 31, 0.8)';
        hint.style.color = '#ffffff';
        hint.style.fontFamily = 'monospace';
        hint.style.fontSize = '12px';
        hint.style.zIndex = '9998';
        hint.style.border = '1px solid rgba(255, 209, 102, 0.8)';
        document.body.appendChild(hint);

        this._menuKeyHandler = (e) => {
            if (e.key.toLowerCase() === "q") {
                e.preventDefault();
                toggleMenu();
            }
        };
        document.removeEventListener("keydown", this._menuKeyHandler);
        document.addEventListener("keydown", this._menuKeyHandler);
        // =====================================================

        // ---------------- COIN SPRITE ----------------
        const createPixelCoin = () => {
            const size = 12;
            const scale = 3;

            const canvas = document.createElement('canvas');
            canvas.width = size;
            canvas.height = size;

            const ctx = canvas.getContext('2d');
            ctx.imageSmoothingEnabled = false;

            const p = (x, y, color) => {
                ctx.fillStyle = color;
                ctx.fillRect(x, y, 1, 1);
            };

            const coinPixels = [
                [4,0],[5,0],[6,0],[7,0],
                [2,1],[3,1],[4,1],[5,1],[6,1],[7,1],[8,1],[9,1],
                [1,2],[2,2],[3,2],[4,2],[5,2],[6,2],[7,2],[8,2],[9,2],[10,2],
                [0,4],[1,4],[2,4],[3,4],[4,4],[5,4],[6,4],[7,4],[8,4],[9,4],[10,4],[11,4],
                [0,5],[1,5],[2,5],[3,5],[4,5],[5,5],[6,5],[7,5],[8,5],[9,5],[10,5],[11,5],
            ];

            coinPixels.forEach(([x, y]) => p(x, y, '#FFD700'));

            const scaled = document.createElement('canvas');
            scaled.width = size * scale;
            scaled.height = size * scale;

            const sctx = scaled.getContext('2d');
            sctx.imageSmoothingEnabled = false;
            sctx.drawImage(canvas, 0, 0, scaled.width, scaled.height);

            return scaled.toDataURL();
        };

        const coinSprite = createPixelCoin();

        // ---------------- SPAWN COINS ----------------
        const spawnCoins = () => {
            const padding = 80;
            const positions = [];

            while (positions.length < coinState.total) {
                positions.push({
                    x: Math.random() * (width - padding),
                    y: Math.random() * (height - padding)
                });
            }

            positions.forEach((pos, i) => {
                const coin = new Collectible({
                    id: `coin_${i}`,
                    src: coinSprite,
                    SCALE_FACTOR: 15,
                    INIT_POSITION: pos,
                    pixels: { height: 36, width: 36 },
                    orientation: { rows: 1, columns: 1 },
                    down: { row: 0, start: 0, columns: 1 },
                    left: { row: 0, start: 0, columns: 1 },
                    right: { row: 0, start: 0, columns: 1 },
                    up: { row: 0, start: 0, columns: 1 },
                    downRight: { row: 0, start: 0, columns: 1 },
                    downLeft: { row: 0, start: 0, columns: 1 },
                    upRight: { row: 0, start: 0, columns: 1 },
                    upLeft: { row: 0, start: 0, columns: 1 },
                    interact: function () {
                        coinState.collected++;
                        this.destroy();

                        if (coinState.collected >= coinState.total) {
                            coinState.kirbySpawned = true;
                            console.log("All coins collected!");
                        }
                    }
                }, gameEnv);

                gameEnv.gameObjects.push(coin);
            });
        };

        // ---------------- GAME OBJECTS ----------------
        this.classes = [
            { class: GameEnvBackground, data: bgData },
            { class: Player, data: playerData },
            { class: Barrier, data: { id: 'b1', x: 100, y: 100, width: 50, height: 50 } }
        ];

        this.coinState = coinState;
        this.menuId = menuId;
        this.hintId = hintId;

        // ---------------- START ----------------
        spawnCoins();
    }

    initialize() {
        this.levelCompleted = false;
        this.completionTriggered = false;

        if (!this.spriteSwapScrollTriggered) {
            this.spriteSwapScrollTriggered = true;
            setTimeout(() => {
                try {
                    window.dispatchEvent(new CustomEvent('characters:concept-focus', {
                        detail: { level: 'seek', trigger: 'level-start' }
                    }));
                } catch (err) {
                    console.warn('Failed to emit seek concept focus event:', err);
                }
            }, 250);
        }
    }

    update() {
        if (this.completionTriggered) return;
        if (!this.coinState) return;

        if (this.coinState.collected >= this.coinState.total) {
            this.completionTriggered = true;
            this.levelCompleted = true;

            try {
                window.dispatchEvent(new CustomEvent('characters:level-complete', {
                    detail: { level: 'seek' }
                }));
            } catch (err) {
                console.warn('Failed to emit seek completion event:', err);
            }

            const level = this.gameEnv?.gameControl?.currentLevel;
            if (level) {
                setTimeout(() => {
                    level.continue = false;
                }, 350);
            }
        }
    }

    destroy() {
        if (this.menuId) {
            const menu = document.getElementById(this.menuId);
            if (menu) menu.remove();
        }

        if (this.hintId) {
            const hint = document.getElementById(this.hintId);
            if (hint) hint.remove();
        }

        if (this._menuKeyHandler) {
            document.removeEventListener("keydown", this._menuKeyHandler);
        }
    }
}

export default GameLevelSeek;
