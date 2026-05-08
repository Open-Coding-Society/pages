import GameEnvBackground from '@assets/js/GameEnginev1.1/essentials/GameEnvBackground.js';
import Player from '@assets/js/GameEnginev1.1/essentials/Player.js';
import GameObject from '@assets/js/GameEnginev1.1/essentials/GameObject.js';
import SplineBarrier from '@assets/js/projects/spline-barriers/levels/SplineBarrier.js';

class RemotePlayerVisualizer extends GameObject {
    constructor(data = null, gameEnv = null) {
        super(gameEnv);
        this.remotePlayersRef = data?.remotePlayers || {};
        this.tagStateRef = data.tagState;
        this.myIdRef = data.myIdRef;
        this.SCALE_FACTOR = 3.5;
        this.frameWidth = 569 / 13;
        this.frameHeight = 36;
        this.spriteImage = null;
    }

    update() {
        if (!this.spriteImage) {
            const img = new Image();
            img.src = "/images/gamebuilder/sprites/kirby.png";
            this.spriteImage = img;
        }
        this.draw();
    }

    draw() {
        if (!this.spriteImage?.complete) return;
        const ctx = this.gameEnv.ctx;
        const drawWidth = this.frameWidth * this.SCALE_FACTOR;
        const drawHeight = this.frameHeight * this.SCALE_FACTOR;

        for (const sid in this.remotePlayersRef) {
            const p = this.remotePlayersRef[sid];
            const isIt = this.tagStateRef.taggerId === sid;

            ctx.drawImage(
                this.spriteImage,
                0, 0,
                this.frameWidth, this.frameHeight,
                p.x, p.y,
                drawWidth, drawHeight
            );

            if (isIt) {
                ctx.save();
                ctx.globalAlpha = 0.45;
                ctx.fillStyle = 'red';
                ctx.fillRect(p.x, p.y, drawWidth, drawHeight);
                ctx.restore();

                ctx.save();
                ctx.setTransform(1, 0, 0, 1, 0, 0);
                ctx.globalAlpha = 1.0;
                ctx.font = 'bold 14px Arial';
                ctx.textAlign = 'left';
                ctx.textBaseline = 'top';
                ctx.fillStyle = 'red';
                ctx.fillText('IT', p.x + drawWidth / 2 - 8, p.y - 18);
                ctx.restore();
            }
        }
    }

    resize() {}
    destroy() { this.spriteImage = null; }
}

class TagHUD extends GameObject {
    constructor(data = null, gameEnv = null) {
        super(gameEnv);
        this.tagStateRef = data.tagState;
        this.myIdRef = data.myIdRef;
        this._flashStart = null;
        this._wasIt = false;
    }

    update() {
        const isIt = this.tagStateRef.taggerId === this.myIdRef.value;
        if (isIt && !this._wasIt) {
            this._flashStart = Date.now();
        }
        this._wasIt = isIt;
        this.draw();
    }

    draw() {
        const isIt = this.tagStateRef.taggerId === this.myIdRef.value;
        const ctx = this.gameEnv.ctx;
        const W = this.gameEnv.innerWidth;
        const H = this.gameEnv.innerHeight;
        const now = Date.now();
        const gracePeriod = 2000;
        const timeSinceIt = now - (this.tagStateRef.becameItAt ?? 0);
        const inGrace = timeSinceIt < gracePeriod;

        if (isIt) {
            // Pulsing red border
            const pulse = 0.5 + 0.5 * Math.sin(now / 300);
            ctx.save();
            ctx.strokeStyle = `rgba(255, 30, 30, ${0.4 + 0.5 * pulse})`;
            ctx.lineWidth = 18;
            ctx.strokeRect(0, 0, W, H);
            ctx.restore();

            // Flash on tag transfer
            if (this._flashStart) {
                const elapsed = now - this._flashStart;
                const flashDuration = 600;
                if (elapsed < flashDuration) {
                    const alpha = 0.45 * (1 - elapsed / flashDuration);
                    ctx.save();
                    ctx.fillStyle = `rgba(255, 0, 0, ${alpha})`;
                    ctx.fillRect(0, 0, W, H);
                    ctx.restore();
                } else {
                    this._flashStart = null;
                }
            }

            // "YOU ARE IT" banner
            ctx.save();
            ctx.setTransform(1, 0, 0, 1, 0, 0);
            ctx.globalAlpha = 1.0;
            ctx.globalCompositeOperation = 'source-over';
            ctx.font = 'bold 28px Arial';
            ctx.textAlign = 'left';
            ctx.textBaseline = 'top';
            const bannerText = '👆 YOU ARE IT';
            const bannerX = W / 2 - 100;
            const bannerY = 16;
            const bannerMetrics = ctx.measureText(bannerText);
            ctx.fillStyle = 'rgba(0, 0, 0, 0.55)';
            ctx.fillRect(bannerX - 10, bannerY - 4, bannerMetrics.width + 20, 36);
            ctx.fillStyle = '#ff2222';
            ctx.fillText(bannerText, bannerX, bannerY);
            ctx.restore();

            // Grace period countdown
            if (inGrace) {
                const secondsLeft = Math.ceil((gracePeriod - timeSinceIt) / 1000);
                ctx.save();
                ctx.setTransform(1, 0, 0, 1, 0, 0);
                ctx.globalAlpha = 1.0;
                ctx.globalCompositeOperation = 'source-over';
                ctx.font = 'bold 22px Arial';
                ctx.textAlign = 'left';
                ctx.textBaseline = 'top';
                const graceText = `🛡️ grace period: ${secondsLeft}s`;
                const graceMetrics = ctx.measureText(graceText);
                const graceX = W / 2 - 110;
                const graceY = 58;
                ctx.fillStyle = 'rgba(0, 0, 0, 0.55)';
                ctx.fillRect(graceX - 10, graceY - 4, graceMetrics.width + 20, 32);
                ctx.fillStyle = '#ffcc00';
                ctx.fillText(graceText, graceX, graceY);
                ctx.restore();
            }

        } else {
            ctx.save();
            ctx.setTransform(1, 0, 0, 1, 0, 0);
            ctx.globalAlpha = 1.0;
            ctx.globalCompositeOperation = 'source-over';
            ctx.font = '16px Arial';
            ctx.textAlign = 'left';
            ctx.textBaseline = 'top';
            ctx.fillStyle = 'rgba(255,255,255,0.7)';
            ctx.fillText('✅ safe', W / 2 - 28, 12);
            ctx.restore();
        }
    }

    resize() {}
    destroy() {}
}

class TagCollisionDetector extends GameObject {
    constructor(data = null, gameEnv = null) {
        super(gameEnv);
        this.socket = data.socket;
        this.remotePlayersRef = data.remotePlayers;
        this.tagStateRef = data.tagState;
        this.myIdRef = data.myIdRef;
        this.playerInstance = null;
        this.tagCooldownUntil = 0;
        this.tagCooldownDuration = 2000;
        this.hitRadius = 30;
    }

    _getCenter(x, y, w, h) {
        return { cx: x + w / 2, cy: y + h / 2 };
    }

    update() {
        if (!this.playerInstance) {
            this.playerInstance = this.gameEnv?.gameObjects?.find(
                obj => obj instanceof Player
            );
        }
        if (!this.playerInstance) return;

        const myId = this.myIdRef.value;
        if (!myId || this.tagStateRef.taggerId !== myId) return;

        const now = Date.now();

        // Block tagging during grace period
        const timeSinceIt = now - (this.tagStateRef.becameItAt ?? 0);
        if (timeSinceIt < 2000) return;

        if (now < this.tagCooldownUntil) return;

        const px = this.playerInstance.position?.x ?? this.playerInstance.x;
        const py = this.playerInstance.position?.y ?? this.playerInstance.y;
        const pw = this.playerInstance.width ?? 50;
        const ph = this.playerInstance.height ?? 50;
        const local = this._getCenter(px, py, pw, ph);

        const spriteW = (569 / 13) * 3.5;
        const spriteH = 36 * 3.5;
        const shrink = 0.2;
        const shrunkW = spriteW * shrink;
        const shrunkH = spriteH * shrink;

        for (const sid in this.remotePlayersRef) {
            const rp = this.remotePlayersRef[sid];
            const remote = this._getCenter(
                rp.x + (spriteW - shrunkW) / 2,
                rp.y + (spriteH - shrunkH) / 2,
                shrunkW,
                shrunkH
            );

            const dx = local.cx - remote.cx;
            const dy = local.cy - remote.cy;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < this.hitRadius * 2) {
                console.log(`[TAG] Tagged ${sid} at distance ${dist.toFixed(1)}`);
                this.socket.emit("tag", { taggedId: sid });
                this.tagCooldownUntil = now + this.tagCooldownDuration;
                break;
            }
        }
    }

    draw() {}
    resize() {}
    destroy() {}
}

class NetworkSynchronizer extends GameObject {
    constructor(data = null, gameEnv = null) {
        super(gameEnv);
        this.socket = data?.socket;
        this.playerInstance = null;
        this.lastEmit = 0;
        this.emitDelay = 50;
    }

    update() {
        if (!this.playerInstance) {
            this.playerInstance = this.gameEnv?.gameObjects?.find(
                obj => obj instanceof Player
            );
        }
        if (!this.playerInstance || !this.socket) return;

        const now = Date.now();
        if (now - this.lastEmit < this.emitDelay) return;

        this.socket.emit("move", {
            x: this.playerInstance.position?.x ?? this.playerInstance.x,
            y: this.playerInstance.position?.y ?? this.playerInstance.y
        });
        this.lastEmit = now;
    }

    draw() {}
    resize() {}
    destroy() {}
}

class GameLevelMultiplayer {
    constructor(gameEnv) {

        const path = gameEnv.path;
        const width = gameEnv.innerWidth;
        const height = gameEnv.innerHeight;

        // const socket = io("ws://localhost:8590", { transports: ["websocket"] });
        const socket = io("wss://flask-ws.opencodingsociety.com", { transports: ["websocket"] });

        const myIdRef = { value: null };
        const remotePlayers = {};
        const tagState = { taggerId: null, becameItAt: 0 };

        socket.on("connect", () => {
            console.log("connected:", socket.id);
            myIdRef.value = socket.id;
        });

        socket.on("player_update", (data) => {
            if (!data?.players) return;
            const players = data.players;

            if (data.taggerId !== undefined) {
                tagState.taggerId = data.taggerId;
            }

            for (const sid in players) {
                if (sid === socket.id) continue;
                if (!remotePlayers[sid]) {
                    remotePlayers[sid] = { x: players[sid].x, y: players[sid].y };
                } else {
                    remotePlayers[sid].x = players[sid].x;
                    remotePlayers[sid].y = players[sid].y;
                }
            }

            for (const sid in remotePlayers) {
                if (!players[sid]) delete remotePlayers[sid];
            }
        });

        socket.on("tag_update", (data) => {
            tagState.taggerId = data.taggerId;
            if (data.taggerId === myIdRef.value) {
                tagState.becameItAt = Date.now();
                console.log("You are now IT!");
            }
        });

        socket.on("player_left", (data) => {
            delete remotePlayers[data.sid];
        });

        socket.on("disconnect", () => {
            console.log("disconnected from server");
        });

        const bgData = {
            name: "custom_bg",
            src: path + "/images/projects/tag-game-multiplayer/Arena.png",
            pixels: { height: 720, width: 1280 }
        };

        const playerData = {
            id: 'playerData',
            greeting: 'Hi',
            src: '/images/gamebuilder/sprites/kirby.png',
            SCALE_FACTOR: 10,
            STEP_FACTOR: 900,
            ANIMATION_RATE: 20,
            INIT_POSITION: { x: width * 0.5, y: height * 0.5 },
            pixels: { height: 36, width: 569 },
            orientation: { rows: 1, columns: 13 },
            down:    { row: 0, start: 0, columns: 3 },
            left:    { row: 0, start: 0, columns: 3 },
            right:   { row: 0, start: 0, columns: 3 },
            up:      { row: 0, start: 0, columns: 3 },
            upLeft:  { row: 0, start: 0, columns: 3 },
            upRight: { row: 0, start: 0, columns: 3 },
            hitbox: { widthPercentage: 0.2, heightPercentage: 0.2 },
            keypress: { up: 87, left: 65, down: 83, right: 68 },
        };

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

        const arenaBarrierData = {
            id: 'arena-wall',
            visible: false,
            color: 'rgb(248, 39, 39)',
            lineWidth: 4,
            splinePoints: [
                { x: 100, y: 235 },
                { x: 115, y: 165 },
                { x: 155, y: 110 },
                { x: 225, y: 70 },
                { x: 320, y: 48 },
                { x: 435, y: 38 },
                { x: 650, y: 90 },
                { x: 630, y: 350 },
                { x: 435, y: 452 },
                { x: 320, y: 440 },
                { x: 225, y: 400 },
                { x: 155, y: 340 },
                { x: 115, y: 325 },
                { x: 90, y: 275 },
                { x: 100, y: 235 },
            ]
        };

        this.classes = [
            { class: GameEnvBackground, data: bgData },
            { class: SplineBarrier,     data: arenaBarrierData },
            { class: Player,            data: playerData },
            { class: NetworkSynchronizer,   data: { socket } },
            { class: TagCollisionDetector,  data: { socket, remotePlayers, tagState, myIdRef } },
            { class: RemotePlayerVisualizer, data: { remotePlayers, tagState, myIdRef } },
            { class: TagHUD,            data: { tagState, myIdRef } },
        ];
    }
}

export default GameLevelMultiplayer;