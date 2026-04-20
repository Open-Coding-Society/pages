import GameEnvBackground from '/assets/js/GameEnginev1/essentials/GameEnvBackground.js';
import Player from '/assets/js/GameEnginev1/essentials/Player.js';
import Npc from '/assets/js/GameEnginev1/essentials/Npc.js';
import Barrier from '/assets/js/GameEnginev1/essentials/Barrier.js';
import AiNpc from '/assets/js/GameEnginev1.1/essentials/AiNpc.js';
import Coin from '/assets/js/GameEnginev1.1/Coin.js';

class GameLevelprologue {
    constructor(gameEnv) {
        const path = gameEnv.path;
        const width = gameEnv.innerWidth;
        const height = gameEnv.innerHeight;

        // Floor is roughly 58% down the canvas based on the background image
        const floorY = Math.floor(height * 0.72);

        const bgData = {
            name: "custom_bg",
            src: path + "//_projects/teamtestgame/images/newgamebg.jpeg",
            pixels: { height: 720, width: 1280 }
        };

        const playerData = {
            id: 'playerData',
            src: path + "/images/projects/teamtestgame/gamebuilder/sprites/astro.png",
            SCALE_FACTOR: 5,
            STEP_FACTOR: 1000,
            ANIMATION_RATE: 50,
            // height/SCALE_FACTOR = rendered height; subtract from floorY to place feet on floor
            INIT_POSITION: { x: 100, y: floorY - Math.floor(height / 5) },
            pixels: { height: 770, width: 513 },
            orientation: { rows: 4, columns: 4 },
            down: { row: 0, start: 0, columns: 3 },
            downRight: { row: 1, start: 0, columns: 3 },
            downLeft: { row: 2, start: 0, columns: 3 },
            right: { row: 1, start: 0, columns: 3 },
            left: { row: 2, start: 0, columns: 3 },
            up: { row: 3, start: 0, columns: 3 },
            upRight: { row: 1, start: 0, columns: 3 },
            upLeft: { row: 2, start: 0, columns: 3 },
            hitbox: { widthPercentage: 0, heightPercentage: 0 },
            keypress: { up: 87, left: 65, down: 83, right: 68 }
        };

        const npcData1 = {
            id: 'guy',
            greeting: 'Hi Astro. You are being sent on a mission to see if planet - B34FG is save to live on. Good luck.',
            src: path + "/images/projects/teamtestgame/gamify/chillguy.png",
            SCALE_FACTOR: 8,
            ANIMATION_RATE: 50,
            INIT_POSITION: { x: 500, y: floorY - Math.floor(height / 8) },
            pixels: { height: 512, width: 384 },
            orientation: { rows: 4, columns: 3 },
            down: { row: 0, start: 0, columns: 3 },
            right: { row: Math.min(1, 4 - 1), start: 0, columns: 3 },
            left: { row: Math.min(2, 4 - 1), start: 0, columns: 3 },
            up: { row: Math.min(3, 4 - 1), start: 0, columns: 3 },
            upRight: { row: Math.min(3, 4 - 1), start: 0, columns: 3 },
            downRight: { row: Math.min(1, 4 - 1), start: 0, columns: 3 },
            upLeft: { row: Math.min(2, 4 - 1), start: 0, columns: 3 },
            downLeft: { row: 0, start: 0, columns: 3 },
            hitbox: { widthPercentage: 0.1, heightPercentage: 0.2 },
            dialogues: ['Hi Astro. You are being sent on a mission to see if planet - B34FG is save to live on. Good luck. Also, nice moonwalk!'],
            reaction: function() { if (this.dialogueSystem) { this.showReactionDialogue(); } else { console.log(this.greeting); } },
            interact: function() { if (this.dialogueSystem) { this.showRandomDialogue(); } }
        };

        const npcData2 = {
            id: 'ship',
            greeting: 'BORADING NOW.',
            src: path + "/images/projects/teamtestgame/gamebuilder/sprites/pew.png",
            SCALE_FACTOR: 8,
            ANIMATION_RATE: 50,
            INIT_POSITION: { x: 679, y: floorY - Math.floor(height / 8) },
            pixels: { height: 320, width: 320 },
            orientation: { rows: 4, columns: 4 },
            down: { row: 0, start: 0, columns: 3 },
            right: { row: Math.min(1, 4 - 1), start: 0, columns: 3 },
            left: { row: Math.min(2, 4 - 1), start: 0, columns: 3 },
            up: { row: Math.min(3, 4 - 1), start: 0, columns: 3 },
            upRight: { row: Math.min(3, 4 - 1), start: 0, columns: 3 },
            downRight: { row: Math.min(1, 4 - 1), start: 0, columns: 3 },
            upLeft: { row: Math.min(2, 4 - 1), start: 0, columns: 3 },
            downLeft: { row: 0, start: 0, columns: 3 },
            hitbox: { widthPercentage: 0.1, heightPercentage: 0.2 },
            dialogues: ['BORADING NOW.'],
            reaction: function() { if (this.dialogueSystem) { this.showReactionDialogue(); } else { console.log(this.greeting); } },
            interact: function() {
                if (this.dialogueSystem) { this.showRandomDialogue(); }
                setTimeout(() => {
                    if (this.gameEnv?.gameControl?.currentLevel) {
                        this.gameEnv.gameControl.currentLevel.continue = false;
                    }
                }, 1500);
            }
        };

        const sprite_src_chilldude = path + "/images/projects/teamtestgame/r2_idle.png";
        const sprite_greet_chilldude = "Beep boop. I'm R2-D2, and I can answer questions about this mission!";
        const npcData3 = {
            id: "ChillDude",
            greeting: sprite_greet_chilldude,
            src: sprite_src_chilldude,
            SCALE_FACTOR: 4,
            ANIMATION_RATE: 10,
            pixels: { height: 223, width: 505 },
            INIT_POSITION: { x: width * 0.53, y: height * 0.28 },
            orientation: { rows: 1, columns: 3 },
            down: { row: 0, start: 0, columns: 3, wiggle: { angle: 0.03, speed: 0.1 } },
            up: { row: 0, start: 0, columns: 3, wiggle: { angle: 0.03, speed: 0.1 } },
            left: { row: 0, start: 0, columns: 3, wiggle: { angle: 0.025, speed: 0.1 } },
            right: { row: 0, start: 0, columns: 3, wiggle: { angle: 0.025, speed: 0.1 } },
            downLeft: { row: 0, start: 0, columns: 3, wiggle: { angle: 0.03, speed: 0.1 } },
            downRight: { row: 0, start: 0, columns: 3, wiggle: { angle: 0.03, speed: 0.1 } },
            upLeft: { row: 0, start: 0, columns: 3, wiggle: { angle: 0.03, speed: 0.1 } },
            upRight: { row: 0, start: 0, columns: 3, wiggle: { angle: 0.03, speed: 0.1 } },
            hitbox: { widthPercentage: 0.2, heightPercentage: 0.3 },
            expertise: "history",
            chatHistory: [],
            dialogues: [
                "Ask me anything about this game!",
                "I have a depth of knowledge of this game...",
                "Do you want to learn about this game?",
                "Try out my chat session feature on this game!",
                "Are you curious about this game? Talk to me!"
            ],
            knowledgeBase: {
                history: [
                    {
                        question: "What is this game?",
                        answer: "This is a game that was made by our creators, Krish, Jasan, and Aarnav."
                    },
                    {
                        question: "Tell me about the next level",
                        answer: "The next level is a space adventure where you will have to avoid asteroids, in your ship to survive"
                    },
                    {
                        question: "",
                        answer: "Sorry didn't quite catch that. Try asking about the game or the next level!"
                    },
                    {
                        question: "Hi",
                        answer: "Hello young space traveler! Welcome to our game. Feel free to ask me anything about the game or the next level!"
                    }
                ]
            },
            reaction: function() {
                if (this.dialogueSystem) {
                    this.showReactionDialogue();
                } else {
                    console.log(sprite_greet_chilldude);
                }
            },
            interact: function() {
                AiNpc.showInteraction(this);
            }
        };

        const coinData = {
            id: 'coin-prologue',
            greeting: false,
            INIT_POSITION: { x: 0.18, y: 0.58 },
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
            { class: Npc, data: npcData2 },
            { class: Npc, data: npcData3 },
            { class: Coin, data: coinData }
        ];

        /* BUILDER_ONLY_START */
        try {
            setTimeout(() =>  {
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
                    try { window.parent.postMessage({ type: 'rpg:env-metrics', top: gameEnv.top, left: 0 }, '*'); } catch (__){ }
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
                            if (ob && typeof ob.destroy === 'function') ob.destroy();
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
}

export const gameLevelClasses = [GameLevelprologue];
export default GameLevelprologue;
