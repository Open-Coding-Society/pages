// Adventure Game Custom Level
// Exported from GameBuilder on 2026-03-17T15:05:33.106Z
// How to use this file:
// 1) Save as assets/js/adventureGame/GameLevelEscaperoom.js in your repo.
// 2) Reference it in your runner or level selector.
// 3) Ensure images exist and paths resolve via 'path' provided by the engine.


import GameEnvBackground from '@assets/js/GameEnginev1.1/essentials/GameEnvBackground.js';
import Player from '@assets/js/GameEnginev1.1/essentials/Player.js';
import Npc from '@assets/js/GameEnginev1.1/essentials/Npc.js';
import Barrier from '@assets/js/GameEnginev1.1/essentials/Barrier.js';
import AiNpc from '@assets/js/GameEnginev1.1/essentials/AiNpc.js';
import GameStats from '@assets/js/GameEnginev1.1/essentials/GameStats.js';
import Coin from '@assets/js/GameEnginev1.1/Coin.js';


// ─────────────────────────────────────────────────────────────────────────────
// FOG-OF-WAR CONSTANTS  (tweak these to taste)
// ─────────────────────────────────────────────────────────────────────────────
const VISION_RADIUS  = 160;   // fully-lit radius in CSS px
const FEATHER_WIDTH  = 70;    // soft-edge width in CSS px
const FOG_ALPHA      = 0.94;  // darkness of fog (0–1)


class GameLevelEscaperoom {
    constructor(gameEnv) {
        const path   = gameEnv.path;
        const width  = gameEnv.innerWidth;
        const height = gameEnv.innerHeight;

        // ── Background ──────────────────────────────────────────────────────────
        const bgData = {
            name: "custom_bg",
            src: path + "@assets/js/projects/gategame/images/bg/Slab.png",
            pixels: { height: 772, width: 1134 }
        };

        // ── Player ──────────────────────────────────────────────────────────────
        const playerData = {
            id: 'playerData',
            src: path + "@assets/js/projects/gategame/images/sprites/slime.png",
            SCALE_FACTOR: 15,
            STEP_FACTOR: 1000,
            ANIMATION_RATE: 50,
            INIT_POSITION: { x: 60, y: 247 },
            pixels: { height: 225, width: 225 },
            orientation: { rows: 4, columns: 4 },
            down:      { row: 0, start: 0, columns: 3 },
            downRight: { row: 1, start: 0, columns: 3, rotate:  Math.PI/16 },
            downLeft:  { row: 0, start: 0, columns: 3, rotate: -Math.PI/16 },
            left:      { row: 2, start: 0, columns: 3 },
            right:     { row: 1, start: 0, columns: 3 },
            up:        { row: 3, start: 0, columns: 3 },
            upLeft:    { row: 2, start: 0, columns: 3, rotate:  Math.PI/16 },
            upRight:   { row: 3, start: 0, columns: 3, rotate: -Math.PI/16 },
            hitbox:    { widthPercentage: 0, heightPercentage: 0 },
            keypress:  { up: 87, left: 65, down: 83, right: 68 }
        };

        // ── NPC ─────────────────────────────────────────────────────────────────
        const npcData1 = {
            id: 'Cannonball',
            greeting: 'Door Unlocked',
            src: path + "@assets/js/projects/gategame/images/sprites/mastergate.png",
            SCALE_FACTOR: 11,
            ANIMATION_RATE: 50,
            INIT_POSITION: { x: 920, y: 600 },
            pixels: { height: 512, width: 512 },
            orientation: { rows: 1, columns: 1 },
            down:      { row: 0, start: 0, columns: 1 },
            right:     { row: 0, start: 0, columns: 1 },
            left:      { row: 0, start: 0, columns: 1 },
            up:        { row: 0, start: 0, columns: 1 },
            upRight:   { row: 0, start: 0, columns: 1 },
            downRight: { row: 0, start: 0, columns: 1 },
            upLeft:    { row: 0, start: 0, columns: 1 },
            downLeft:  { row: 0, start: 0, columns: 1 },
            hitbox: { widthPercentage: 0.1, heightPercentage: 0.2 },
            dialogues: ['Door Unlocked'],
            reaction: function() { if (this.dialogueSystem) { this.showReactionDialogue(); } else { console.log(this.greeting); } },
            interact: function() { if (this.dialogueSystem) { this.showRandomDialogue(); } }
        };

        // ── Barriers ────────────────────────────────────────────────────────────
        const barrier1  = { id:'wall_left',   x:0,    y:0,   width:50,   height:772, visible:true, hitbox:{widthPercentage:0,heightPercentage:0}, fromOverlay:true };
        const barrier2  = { id:'wall_right',  x:1084, y:0,   width:50,   height:772, visible:true, hitbox:{widthPercentage:0,heightPercentage:0}, fromOverlay:true };
        const barrier3  = { id:'wall_top',    x:0,    y:0,   width:1134, height:50,  visible:true, hitbox:{widthPercentage:0,heightPercentage:0}, fromOverlay:true };
        const barrier4  = { id:'wall_bottom', x:0,    y:722, width:1134, height:50,  visible:true, hitbox:{widthPercentage:0,heightPercentage:0}, fromOverlay:true };
        const barrier5  = { id:'internal_v',  x:450,  y:150, width:50,   height:400, visible:true, hitbox:{widthPercentage:0,heightPercentage:0}, fromOverlay:true };
        const barrier6  = { id:'internal_h',  x:500,  y:400, width:500,  height:50,  visible:true, hitbox:{widthPercentage:0,heightPercentage:0}, fromOverlay:true };
        const barrier7  = { id:'barrier7',    x:250,  y:0,   width:50,   height:550, visible:true, hitbox:{widthPercentage:0,heightPercentage:0}, fromOverlay:true };
        const barrier8  = { id:'barrier8',    x:750,  y:250, width:50,   height:350, visible:true, hitbox:{widthPercentage:0,heightPercentage:0}, fromOverlay:true };
        const barrier9  = { id:'barrier9',    x:500,  y:500, width:200,  height:50,  visible:true, hitbox:{widthPercentage:0,heightPercentage:0}, fromOverlay:true };
        const barrier10 = { id:'barrier10',   x:850,  y:150, width:50,   height:150, visible:true, hitbox:{widthPercentage:0,heightPercentage:0}, fromOverlay:true };
        const barrier11 = { id:'barrier11',   x:550,  y:250, width:50,   height:200, visible:true, hitbox:{widthPercentage:0,heightPercentage:0}, fromOverlay:true };
        const barrier12 = { id:'barrier12',   x:650,  y:450, width:200,  height:50,  visible:true, hitbox:{widthPercentage:0,heightPercentage:0}, fromOverlay:true };
        const barrier13 = { id:'barrier13',   x:150,  y:350, width:50,   height:150, visible:true, hitbox:{widthPercentage:0,heightPercentage:0}, fromOverlay:true };
        const barrier14 = { id:'barrier14',   x:900,  y:300, width:50,   height:250, visible:true, hitbox:{widthPercentage:0,heightPercentage:0}, fromOverlay:true };
        const barrier15 = { id:'barrier15',   x:100,  y:100, width:50,   height:150, visible:true, hitbox:{widthPercentage:0,heightPercentage:0}, fromOverlay:true };
        const barrier16 = { id:'barrier16',   x:950,  y:100, width:50,   height:150, visible:true, hitbox:{widthPercentage:0,heightPercentage:0}, fromOverlay:true };
        const barrier17 = { id:'barrier17',   x:400,  y:300, width:50,   height:100, visible:true, hitbox:{widthPercentage:0,heightPercentage:0}, fromOverlay:true };

        // ── Coins ───────────────────────────────────────────────────────────────
        const coinConfigs = [
            { id:'coin_escape_0', INIT_POSITION:{ x:0.09, y:0.25 } },
            { id:'coin_escape_1', INIT_POSITION:{ x:0.09, y:0.60 } },
            { id:'coin_escape_2', INIT_POSITION:{ x:0.17, y:0.80 } },
            { id:'coin_escape_3', INIT_POSITION:{ x:0.32, y:0.15 } },
            { id:'coin_escape_4', INIT_POSITION:{ x:0.32, y:0.72 } },
            { id:'coin_escape_5', INIT_POSITION:{ x:0.60, y:0.15 } },
            { id:'coin_escape_6', INIT_POSITION:{ x:0.60, y:0.65 } },
            { id:'coin_escape_7', INIT_POSITION:{ x:0.82, y:0.85 } },
            { id:'coin_escape_8', INIT_POSITION:{ x:0.90, y:0.55 } },
        ];

        const coinClasses = coinConfigs.map(cfg => ({
            class: Coin,
            data: {
                ...cfg,
                greeting: false,
                SCALE_FACTOR: 22,
                hitbox: { widthPercentage:0.8, heightPercentage:0.8 },
                value: 1,
                zIndex: 450
            }
        }));

        // ── HUD ─────────────────────────────────────────────────────────────────
        // Coin HUD is now handled globally by GameStats — bootstrapping is idempotent
        GameStats.bootstrap();
        GameStats.onLevelStart();

        // ── Class list ──────────────────────────────────────────────────────────
        this.classes = [
            { class: GameEnvBackground, data: bgData },
            { class: Player,   data: playerData },
            { class: Npc,      data: npcData1 },
            { class: Barrier,  data: barrier1  },
            { class: Barrier,  data: barrier2  },
            { class: Barrier,  data: barrier3  },
            { class: Barrier,  data: barrier4  },
            { class: Barrier,  data: barrier5  },
            { class: Barrier,  data: barrier6  },
            { class: Barrier,  data: barrier7  },
            { class: Barrier,  data: barrier8  },
            { class: Barrier,  data: barrier9  },
            { class: Barrier,  data: barrier10 },
            { class: Barrier,  data: barrier11 },
            { class: Barrier,  data: barrier12 },
            { class: Barrier,  data: barrier13 },
            { class: Barrier,  data: barrier14 },
            { class: Barrier,  data: barrier15 },
            { class: Barrier,  data: barrier16 },
            { class: Barrier,  data: barrier17 },
            ...coinClasses
        ];

        this._gameEnv     = gameEnv;
        this._hudInterval = setInterval(() => {
            GameStats.trackLevelCoins(this._gameEnv?.stats?.coinsCollected ?? 0);
        }, 250);

        // ── Fog-of-war ───────────────────────────────────────────────────────────
        this._fogRunning  = true;
        this._fogCanvas   = null;
        this._fogCtx      = null;
        this._gameCanvas  = null;
        this._waitForGameCanvas();

        // ── AI NPC pre-level briefing ───────────────────────────────────────────
        // Shown after level objects are created. DialogueSystem auto-pauses the
        // game while the briefing is open, so the player can't move around yet.
        setTimeout(() => this._showAiBriefing(), 500);
    }


    // ════════════════════════════════════════════════════════════════════════════
    // AI NPC BRIEFING
    // ════════════════════════════════════════════════════════════════════════════

    _showAiBriefing() {
        const path = this._gameEnv?.path || '';

        const spriteData = {
            id: 'Escape Room Guide',
            src: path + "@assets/js/projects/gategame/images/sprites/mastergate.png",
            pixels: { height: 512, width: 512 },
            orientation: { rows: 1, columns: 1 },
            down: { row: 0, start: 0, columns: 1 },

            expertise: 'escape room fog dungeon',
            chatHistory: [],
            dialogues: [
                "🔦 Welcome to the Escape Room! You're trapped in a dark dungeon and can only see a small circle of light around you. Use W, A, S, D to move through the walls and find the gate. Grab coins on the way — they're scattered across the map. When you reach the gate (bottom-right), interact with it to escape to the next level. Ask me anything, then hit Start Level when you're ready!"
            ],
            knowledgeBase: {
                'escape room fog dungeon': [
                    { question: 'How do I see in the dark?',
                      answer:   'You have a small circle of light around you. Walk to explore — the fog lifts wherever you go, revealing walls and coins.' },
                    { question: 'How do I move around?',
                      answer:   'Use W, A, S, D to move in all four directions. The walls in the dungeon will block you, so navigate carefully.' },
                    { question: 'Where is the exit gate?',
                      answer:   'The exit gate is in the bottom-right area of the map. Head right and down from your starting position in the top-left.' },
                    { question: 'Are there coins to collect?',
                      answer:   'Yes! There are 9 coins scattered across the dungeon. Explore carefully to find them all before you escape.' },
                    { question: 'How do I escape to the next level?',
                      answer:   'Walk up to the gate NPC in the bottom-right, press E or space to interact, and then press Esc to advance to the final level.' }
                ]
            }
        };

        AiNpc.showLevelBriefing({
            spriteData,
            gameControl: this._gameEnv?.gameControl || null,
            startButtonText: '▶  Enter the Dungeon',
            onStart: () => {
                // DialogueSystem auto-resumes the game on close — nothing else needed
                console.log('[EscapeRoom] Briefing closed — gameplay resumed.');
            }
        });
    }


    // ════════════════════════════════════════════════════════════════════════════
    // COIN HUD
    // ════════════════════════════════════════════════════════════════════════════
    // (Removed — the global GameStats HUD at the top of the screen handles this now.)


    // ════════════════════════════════════════════════════════════════════════════
    // FOG-OF-WAR
    // ════════════════════════════════════════════════════════════════════════════

    _waitForGameCanvas() {
        const attempt = () => {
            if (!this._fogRunning) return;

            const canvases = [...document.querySelectorAll('canvas')];
            const candidates = canvases.filter(c => c.id !== 'escaperoom-fog');

            if (candidates.length === 0) {
                requestAnimationFrame(attempt);
                return;
            }

            const gameCanvas = candidates.sort(
                (a, b) => (b.width * b.height) - (a.width * a.height)
            )[0];

            this._gameCanvas = gameCanvas;
            this._buildFogCanvas(gameCanvas);
            this._fogLoop();
        };
        requestAnimationFrame(attempt);
    }

    _buildFogCanvas(gameCanvas) {
        document.getElementById('escaperoom-fog')?.remove();

        const fog = document.createElement('canvas');
        fog.id = 'escaperoom-fog';
        Object.assign(fog.style, {
            position:      'fixed',
            pointerEvents: 'none',
            zIndex:        '9000',
            imageRendering: 'pixelated'
        });

        document.body.appendChild(fog);

        this._fogCanvas = fog;
        this._fogCtx    = fog.getContext('2d');

        this._resizeHandler = () => this._syncFogCanvas();
        window.addEventListener('resize', this._resizeHandler);
        this._syncFogCanvas();
    }

    _syncFogCanvas() {
        if (!this._fogCanvas || !this._gameCanvas) return;
        const r = this._gameCanvas.getBoundingClientRect();
        Object.assign(this._fogCanvas.style, {
            left:   r.left   + 'px',
            top:    r.top    + 'px',
            width:  r.width  + 'px',
            height: r.height + 'px'
        });
        this._fogCanvas.width  = this._gameCanvas.width  || r.width;
        this._fogCanvas.height = this._gameCanvas.height || r.height;
    }

    _getPlayerLogicalPos() {
        const gc = this._gameCanvas;
        if (!gc) return { x: 500, y: 386 };

        const gcRect = gc.getBoundingClientRect();
        const scaleX = (gc.width  || gcRect.width)  / gcRect.width;
        const scaleY = (gc.height || gcRect.height) / gcRect.height;

        const toLogical = (cssX, cssY) => ({
            x: (cssX - gcRect.left) * scaleX,
            y: (cssY - gcRect.top ) * scaleY
        });

        const domEl =
            document.getElementById('playerData') ??
            document.querySelector('canvas[id*="player" i]') ??
            document.querySelector('[id*="player" i]:not(#escaperoom-fog):not(#escaperoom-coin-hud)');

        if (domEl) {
            const r = domEl.getBoundingClientRect();
            return toLogical(r.left + r.width / 2, r.top + r.height / 2);
        }

        const env = this._gameEnv;
        const objects = env?.gameObjects ?? env?.objects ?? [];
        for (const obj of objects) {
            const name = (obj?.id ?? obj?.constructor?.name ?? '').toLowerCase();
            if (!name.includes('player')) continue;

            if (typeof obj?.x === 'number') {
                return {
                    x: obj.x + (obj.width  ?? 0) / 2,
                    y: obj.y + (obj.height ?? 0) / 2
                };
            }
            if (typeof obj?.position?.x === 'number') {
                return { x: obj.position.x, y: obj.position.y };
            }

            const el = obj?.canvas ?? obj?.element ?? obj?.sprite;
            if (el instanceof Element) {
                const r = el.getBoundingClientRect();
                return toLogical(r.left + r.width / 2, r.top + r.height / 2);
            }
        }

        const p = env?.player ?? env?.playerObj;
        if (p) {
            if (typeof p?.x === 'number') return { x: p.x, y: p.y };
            if (typeof p?.position?.x === 'number') return { x: p.position.x, y: p.position.y };
            const el = p?.canvas ?? p?.element;
            if (el instanceof Element) {
                const r = el.getBoundingClientRect();
                return toLogical(r.left + r.width / 2, r.top + r.height / 2);
            }
        }

        return { x: (gc.width || gcRect.width) / 2, y: (gc.height || gcRect.height) / 2 };
    }

    _drawFog() {
        const ctx = this._fogCtx;
        const fc  = this._fogCanvas;
        const gc  = this._gameCanvas;
        if (!ctx || !fc || !gc) return;

        this._syncFogCanvas();

        const W = fc.width;
        const H = fc.height;
        if (W === 0 || H === 0) return;

        const { x, y } = this._getPlayerLogicalPos();

        const gcRect = gc.getBoundingClientRect();
        const scale  = (gc.width || gcRect.width) / gcRect.width;
        const innerR = VISION_RADIUS              * scale;
        const outerR = (VISION_RADIUS + FEATHER_WIDTH) * scale;

        ctx.clearRect(0, 0, W, H);

        ctx.globalCompositeOperation = 'source-over';
        ctx.fillStyle = `rgba(0,0,0,${FOG_ALPHA})`;
        ctx.fillRect(0, 0, W, H);

        ctx.globalCompositeOperation = 'destination-out';

        ctx.beginPath();
        ctx.arc(x, y, innerR, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0,0,0,1)';
        ctx.fill();

        const grad = ctx.createRadialGradient(x, y, innerR * 0.5, x, y, outerR);
        grad.addColorStop(0,    'rgba(0,0,0,1)');
        grad.addColorStop(0.5,  'rgba(0,0,0,0.75)');
        grad.addColorStop(1,    'rgba(0,0,0,0)');

        ctx.beginPath();
        ctx.arc(x, y, outerR, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();

        ctx.globalCompositeOperation = 'source-over';
        const glow = ctx.createRadialGradient(x, y, 0, x, y, innerR);
        glow.addColorStop(0,   'rgba(255,200,80,0.10)');
        glow.addColorStop(0.6, 'rgba(255,150,30,0.05)');
        glow.addColorStop(1,   'rgba(255,100,0, 0.00)');

        ctx.beginPath();
        ctx.arc(x, y, innerR, 0, Math.PI * 2);
        ctx.fillStyle = glow;
        ctx.fill();

        ctx.globalCompositeOperation = 'source-over';
    }

    _fogLoop() {
        if (!this._fogRunning) return;
        this._drawFog();
        this._fogRAF = requestAnimationFrame(() => this._fogLoop());
    }


    // ════════════════════════════════════════════════════════════════════════════
    // LIFECYCLE
    // ════════════════════════════════════════════════════════════════════════════

    destroy() {
        // Coin tracking interval (feeds the global GameStats HUD)
        if (this._hudInterval) clearInterval(this._hudInterval);

        // Fog overlay
        this._fogRunning = false;
        if (this._fogRAF) cancelAnimationFrame(this._fogRAF);
        if (this._resizeHandler) window.removeEventListener('resize', this._resizeHandler);
        this._fogCanvas?.remove();
        this._fogCanvas = null;
        this._fogCtx    = null;
    }
}


export default GameLevelEscaperoom;
