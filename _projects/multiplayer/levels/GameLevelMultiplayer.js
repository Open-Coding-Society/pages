// Adventure Game Custom Level
// Exported from GameBuilder on 2026-03-05T17:15:10.295Z
// How to use this file:
// 1) Save as assets/js/adventureGame/GameLevelTimmy.js in your repo.
// 2) Reference it in your runner or level selector. Examples:
//    import GameLevelPlanets from '/assets/js/GameEnginev1/GameLevelPlanets.js';
//    import GameLevelTimmy from '/assets/js/adventureGame/GameLevelTimmy.js';
//    export const gameLevelClasses = [GameLevelPlanets, GameLevelTimmy];
//    // or pass it directly to your GameControl as the only level.
// 3) Ensure images exist and paths resolve via 'path' provided by the engine.
// 4) You can add more objects to this.classes inside the constructor.

import GameEnvBackground from '/assets/js/GameEnginev1/essentials/GameEnvBackground.js';
import Player from '/assets/js/GameEnginev1/essentials/Player.js';
import GameObject from '/assets/js/GameEnginev1/essentials/GameObject.js';

class RemotePlayerVisualizer extends GameObject {
    constructor(data = null, gameEnv = null) {
        super(gameEnv);
        this.remotePlayersRef = data?.remotePlayers || {};
        this.SCALE_FACTOR = 3.5;
        this.frameWidth = 569 / 13;   // sprite sheet width / columns
        this.frameHeight = 36;         // sprite sheet height (1 row)
        this.spriteImage = null;
    }

    update() {
        // Load the sprite image once on first call
        if (!this.spriteImage) {
            const img = new Image();
            img.src = "/images/gamebuilder/sprites/kirby.png";
            this.spriteImage = img;
        }
        this.draw();
    }

    draw() {
        // Don't draw until the image is loaded
        if (!this.spriteImage?.complete) return;

        const ctx = this.gameEnv.ctx;

        const drawWidth = this.frameWidth * this.SCALE_FACTOR;
        const drawHeight = this.frameHeight * this.SCALE_FACTOR;

        for (const sid in this.remotePlayersRef) {
            const p = this.remotePlayersRef[sid];
            console.log("drawing remote player at:", p.x, p.y);
            ctx.drawImage(
                this.spriteImage,
                0, 0,  
                this.frameWidth, 
                this.frameHeight,
                p.x, p.y, 
                drawWidth,  
                drawHeight 
            );
        }
    }

    resize() {}
    destroy() { this.spriteImage = null; }
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

        const socket = io("ws://localhost:8590", { transports: ["websocket"] });

        let myId = null;
        const remotePlayers = {};

        socket.on("connect", () => {
            console.log("connected:", socket.id);
            myId = socket.id;
        });

        const bgData = {
            name: "custom_bg",
            src: path + "/images/gamebuilder/bg/blackandwhite.jpg",
            pixels: { height: 720, width: 1280 }
        };

        const playerData = {
            id: "playerData",
            src: path + "/images/gamebuilder/sprites/kirby.png",
            SCALE_FACTOR: 3.5,
            STEP_FACTOR: 1000,
            ANIMATION_RATE: 50,
            INIT_POSITION: { x: 700, y: 300 },
            pixels: { height: 36, width: 569 },
            orientation: { rows: 1, columns: 13 },
            down: { row: 0, start: 0, columns: 3 },
            downRight: { row: 0, start: 0, columns: 3, rotate: Math.PI / 16 },
            downLeft: { row: 0, start: 0, columns: 3, rotate: -Math.PI / 16 },
            left: { row: 0, start: 0, columns: 3 },
            right: { row: 0, start: 0, columns: 3 },
            up: { row: 0, start: 0, columns: 3 },
            upLeft: { row: 0, start: 0, columns: 3, rotate: Math.PI / 16 },
            upRight: { row: 0, start: 0, columns: 3, rotate: -Math.PI / 16 },
            hitbox: { widthPercentage: 0, heightPercentage: 0 },
            keypress: { up: 38, left: 37, down: 40, right: 39 }
        };

        socket.on("player_update", (data) => {
            if (!data?.players) return;

            const players = data.players;

            for (const sid in players) {
                if (sid === socket.id) continue;

                if (!remotePlayers[sid]) {
                    remotePlayers[sid] = {
                        x: players[sid].x,
                        y: players[sid].y,
                        color: this.getRandomColor(),
                    };
                } else {
                    remotePlayers[sid].x = players[sid].x;
                    remotePlayers[sid].y = players[sid].y;
                }
            }

            for (const sid in remotePlayers) {
                if (!players[sid]) {
                    delete remotePlayers[sid];
                }
            }
        });
        socket.on("player_left", (data) => {
            if (remotePlayers[data.sid]) {
                delete remotePlayers[data.sid];
            }
        });
        socket.on("disconnect", () => {
            console.log("disconnected from server");
        });

        this.classes = [
            { class: GameEnvBackground, data: bgData },
            { class: Player, data: playerData },
            { class: NetworkSynchronizer, data: { socket: socket } },
            { class: RemotePlayerVisualizer, data: { remotePlayers: remotePlayers } }
        ];
    }
    getRandomColor() {
    const colors = [
        '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A',
        '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E2'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
}
}

export default GameLevelMultiplayer;