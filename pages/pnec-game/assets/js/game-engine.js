/**
 * game-engine.js — Core game loop, rendering, and physics for the PNEC Preparedness Explorer
 *
 * Architecture overview:
 *   GameEngine.init()  → sets up canvas, pre-renders background, starts rAF loop
 *   GameEngine.update()→ handles input, moves player, checks proximity, updates particles
 *   GameEngine.render()→ draws bg (offscreen canvas), particles, stations, player, HUD
 *
 * Teammates (Aneesh, Ethan):
 *   • Adjust PLAYER_SPEED / CAMERA_LERP at the top of this file for feel tweaks.
 *   • To replace the procedural background with a real image:
 *       1. Drop your image at pages/pnec-game/assets/images/game-bg.png
 *       2. Uncomment the loadBackgroundImage() call in init()
 *       3. Station worldX/worldY are in pixels; recalibrate to match the new image.
 *   • Station positions and system prompts live in stations.js.
 */

import { STATIONS, WORLD_WIDTH, WORLD_HEIGHT, PLAYER_START } from './stations.js';
import { ChatBot } from './chatbot.js';

// ─── Tuning Constants ──────────────────────────────────────────────────────────
const PLAYER_SPEED   = 220;   // pixels per second
const CAMERA_LERP    = 0.09;  // camera smoothing  (smaller = smoother but laggier)
const PLAYER_SIZE    = 44;    // hitbox / sprite radius
const INTERACT_KEY   = 'e';
const PARTICLE_COUNT = 48;

// ─────────────────────────────────────────────────────────────────────────────

class GameEngine {
    constructor(canvasEl) {
        this.canvas = canvasEl;
        this.ctx    = canvasEl.getContext('2d');

        this.worldWidth  = WORLD_WIDTH;
        this.worldHeight = WORLD_HEIGHT;

        // Camera — top-left corner of viewport in world space
        this.camera = { x: 0, y: 0, targetX: 0, targetY: 0 };

        // Player
        this.player = {
            x:             PLAYER_START.x,
            y:             PLAYER_START.y,
            speed:         PLAYER_SPEED,
            size:          PLAYER_SIZE,
            direction:     'down',   // 'up' | 'down' | 'left' | 'right'
            moving:        false,
            frame:         0,
            frameTimer:    0,
            frameDuration: 0.13,     // seconds between animation frames
        };

        // Keyboard state { 'arrowup': true, 'w': true, … }
        this.keys = {};

        // Deep-copy stations so we don't mutate the exported module array
        this.stations = STATIONS.map(s => ({ ...s }));

        // Interaction state
        this.nearStation     = null;
        this.chatOpen        = false;
        this.chatBot         = null;
        this.interactCooldown = 0;

        // Ambient particles
        this.particles = [];

        // Offscreen canvas for the static background (drawn once, reused every frame)
        this.bgCanvas = null;
        this.bgCtx    = null;

        // Optional custom background image (replace procedural art)
        this.bgImage       = null;
        this.bgImageLoaded = false;

        // Loop state
        this.running       = false;
        this.lastTimestamp = 0;
        this.animFrameId   = null;

        // Public — set by index.html after construction
        this.playerName  = 'Neighbor';
        this.visitedCount = 0;
    }

    // ─── Public API ────────────────────────────────────────────────────────────

    init() {
        this._sizeCanvas();
        this._preRenderBackground();
        this._initParticles();
        this._bindEvents();

        // Uncomment to use a real background image instead of the procedural art:
        // this._loadBackgroundImage('./assets/images/game-bg.png');

        this.running       = true;
        this.lastTimestamp = performance.now();
        this.animFrameId   = requestAnimationFrame(ts => this._loop(ts));
    }

    stop() {
        this.running = false;
        if (this.animFrameId) cancelAnimationFrame(this.animFrameId);
    }

    // ─── Initialisation Helpers ────────────────────────────────────────────────

    _sizeCanvas() {
        const resize = () => {
            this.canvas.width  = this.canvas.parentElement?.clientWidth  || window.innerWidth;
            this.canvas.height = this.canvas.parentElement?.clientHeight || window.innerHeight;
            this._preRenderBackground();
        };
        resize();
        window.addEventListener('resize', resize);
    }

    _preRenderBackground() {
        this.bgCanvas        = document.createElement('canvas');
        this.bgCanvas.width  = this.worldWidth;
        this.bgCanvas.height = this.worldHeight;
        this.bgCtx           = this.bgCanvas.getContext('2d');

        if (this.bgImageLoaded && this.bgImage) {
            this.bgCtx.drawImage(this.bgImage, 0, 0, this.worldWidth, this.worldHeight);
        } else {
            this._drawProceduralBg(this.bgCtx);
        }
    }

    _loadBackgroundImage(src) {
        const img  = new Image();
        img.onload = () => {
            this.bgImage       = img;
            this.bgImageLoaded = true;
            this._preRenderBackground();
        };
        img.onerror = () => console.warn('[PNEC Game] Background image not found — using procedural art.');
        img.src = src;
    }

    _initParticles() {
        this.particles = [];
        for (let i = 0; i < PARTICLE_COUNT; i++) {
            this.particles.push(this._spawnParticle(true));
        }
    }

    _spawnParticle(randomLife = false) {
        const colors = ['#e67e2266', '#c0392b55', '#2980b966', '#27ae6066', '#f39c1255'];
        return {
            x:     Math.random() * this.worldWidth,
            y:     Math.random() * this.worldHeight,
            vx:    (Math.random() - 0.5) * 18,
            vy:    -(Math.random() * 28 + 8),
            size:  Math.random() * 3 + 1,
            color: colors[Math.floor(Math.random() * colors.length)],
            life:  randomLife ? Math.random() : 1,
            decay: Math.random() * 0.0018 + 0.0008,
        };
    }

    _bindEvents() {
        window.addEventListener('keydown', e => {
            const k = e.key.toLowerCase();
            this.keys[k] = true;

            // Interact with nearby station
            if (k === INTERACT_KEY && this.nearStation && !this.chatOpen) {
                this._openStation(this.nearStation);
                e.preventDefault();
            }

            // Escape closes chat
            if (e.key === 'Escape' && this.chatOpen) {
                this.chatBot?.close();
            }

            // Prevent page scroll from arrow keys / spacebar
            if (['arrowup','arrowdown','arrowleft','arrowright',' '].includes(k)) {
                e.preventDefault();
            }
        });

        window.addEventListener('keyup', e => {
            this.keys[e.key.toLowerCase()] = false;
        });

        // Pause game loop when tab is hidden; reset dt on return to avoid huge jump
        document.addEventListener('visibilitychange', () => {
            if (!document.hidden) this.lastTimestamp = performance.now();
        });
    }

    // ─── Game Loop ─────────────────────────────────────────────────────────────

    _loop(timestamp) {
        if (!this.running) return;

        const dt = Math.min((timestamp - this.lastTimestamp) / 1000, 0.05); // cap at 50 ms
        this.lastTimestamp = timestamp;

        if (!this.chatOpen) this._update(dt);
        this._render();

        this.animFrameId = requestAnimationFrame(ts => this._loop(ts));
    }

    // ─── Update ────────────────────────────────────────────────────────────────

    _update(dt) {
        this._handleInput(dt);
        this._updateCamera();
        this._updateParticles(dt);
        this._checkProximity();
        if (this.interactCooldown > 0) this.interactCooldown -= dt;
    }

    _handleInput(dt) {
        const up    = this.keys['arrowup']    || this.keys['w'];
        const down  = this.keys['arrowdown']  || this.keys['s'];
        const left  = this.keys['arrowleft']  || this.keys['a'];
        const right = this.keys['arrowright'] || this.keys['d'];

        let dx = 0, dy = 0;
        if (up)    dy -= 1;
        if (down)  dy += 1;
        if (left)  dx -= 1;
        if (right) dx += 1;

        // Normalise diagonal
        if (dx !== 0 && dy !== 0) { dx *= 0.7071; dy *= 0.7071; }

        this.player.moving = (dx !== 0 || dy !== 0);

        if (this.player.moving) {
            // Update facing direction
            if (Math.abs(dx) >= Math.abs(dy)) {
                this.player.direction = dx > 0 ? 'right' : 'left';
            } else {
                this.player.direction = dy > 0 ? 'down' : 'up';
            }

            // Move and clamp
            this.player.x += dx * this.player.speed * dt;
            this.player.y += dy * this.player.speed * dt;

            const half = this.player.size * 0.5;
            this.player.x = Math.max(half, Math.min(this.worldWidth  - half, this.player.x));
            this.player.y = Math.max(half, Math.min(this.worldHeight - half, this.player.y));

            // Walk cycle
            this.player.frameTimer += dt;
            if (this.player.frameTimer >= this.player.frameDuration) {
                this.player.frameTimer = 0;
                this.player.frame = (this.player.frame + 1) % 4;
            }
        } else {
            this.player.frame = 0;
        }
    }

    _updateCamera() {
        const vw = this.canvas.width;
        const vh = this.canvas.height;

        this.camera.targetX = Math.max(0, Math.min(this.worldWidth  - vw, this.player.x - vw / 2));
        this.camera.targetY = Math.max(0, Math.min(this.worldHeight - vh, this.player.y - vh / 2));

        this.camera.x += (this.camera.targetX - this.camera.x) * CAMERA_LERP;
        this.camera.y += (this.camera.targetY - this.camera.y) * CAMERA_LERP;
    }

    _updateParticles(dt) {
        for (let i = 0; i < this.particles.length; i++) {
            const p = this.particles[i];
            p.x    += p.vx * dt;
            p.y    += p.vy * dt;
            p.life -= p.decay;
            if (p.life <= 0) this.particles[i] = this._spawnParticle(false);
        }
    }

    _checkProximity() {
        let best = null, bestDist = Infinity;
        const half = this.player.size * 0.5;

        for (const s of this.stations) {
            const dx   = this.player.x - s.worldX;
            const dy   = this.player.y - s.worldY;
            const dist = Math.hypot(dx, dy);
            const threshold = s.radius + half + 20;
            if (dist < threshold && dist < bestDist) {
                best     = s;
                bestDist = dist;
            }
        }
        this.nearStation = best;
    }

    // ─── Render ────────────────────────────────────────────────────────────────

    _render() {
        const ctx = this.ctx;
        const vw  = this.canvas.width;
        const vh  = this.canvas.height;

        ctx.clearRect(0, 0, vw, vh);

        // Apply camera — everything below draws in world space
        ctx.save();
        ctx.translate(-Math.round(this.camera.x), -Math.round(this.camera.y));

        this._renderBg();
        this._renderParticles(ctx);
        this._renderStations(ctx);
        this._renderPlayer(ctx);

        ctx.restore();
        // ─── Screen-space HUD (no camera transform) ───
        this._renderHUD(ctx, vw, vh);

        if (this.nearStation && !this.chatOpen) {
            this._renderInteractPrompt(ctx, vw, vh);
        }
    }

    _renderBg() {
        if (this.bgCanvas) {
            this.ctx.drawImage(this.bgCanvas, 0, 0);
        }
    }

    _renderParticles(ctx) {
        for (const p of this.particles) {
            ctx.save();
            ctx.globalAlpha = Math.max(0, p.life * 0.7);
            ctx.fillStyle   = p.color;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }
    }

    _renderStations(ctx) {
        const now = performance.now();

        for (const s of this.stations) {
            const sx = s.worldX;
            const sy = s.worldY;
            const r  = s.radius;
            const isNear = this.nearStation?.id === s.id;

            // Outer pulsing glow
            const pulse = r + 12 + Math.sin(now / 700 + sx) * 8;
            const grd   = ctx.createRadialGradient(sx, sy, r * 0.5, sx, sy, pulse + 30);
            grd.addColorStop(0, s.color + '55');
            grd.addColorStop(1, 'transparent');
            ctx.fillStyle = grd;
            ctx.beginPath();
            ctx.arc(sx, sy, pulse + 30, 0, Math.PI * 2);
            ctx.fill();

            // Pulsing ring
            ctx.strokeStyle = s.color + (isNear ? 'ff' : '88');
            ctx.lineWidth   = isNear ? 3.5 : 1.5;
            ctx.beginPath();
            ctx.arc(sx, sy, pulse, 0, Math.PI * 2);
            ctx.stroke();

            // Station emoji icon
            ctx.font         = '34px serif';
            ctx.textAlign    = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(s.icon, sx, sy - 6);

            // Visited checkmark badge
            if (s.visited) {
                ctx.fillStyle = '#27ae60';
                ctx.beginPath();
                ctx.arc(sx + r * 0.65, sy - r * 0.65, 11, 0, Math.PI * 2);
                ctx.fill();
                ctx.fillStyle    = '#fff';
                ctx.font         = 'bold 13px sans-serif';
                ctx.textAlign    = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText('✓', sx + r * 0.65, sy - r * 0.65);
            }

            // Name label
            const labelY = sy + r + 16;
            ctx.font      = 'bold 13px "Chakra Petch", monospace';
            ctx.textAlign = 'center';
            const labelW  = ctx.measureText(s.name).width + 18;

            ctx.fillStyle    = 'rgba(8, 18, 32, 0.88)';
            ctx.strokeStyle  = s.color + '55';
            ctx.lineWidth    = 1;
            this._roundRect(ctx, sx - labelW / 2, labelY - 1, labelW, 22, 4);
            ctx.fill();
            ctx.stroke();

            ctx.fillStyle    = s.color;
            ctx.textBaseline = 'top';
            ctx.fillText(s.name, sx, labelY + 2);
        }
    }

    _renderPlayer(ctx) {
        const px    = this.player.x;
        const py    = this.player.y;
        const s     = this.player.size;
        const dir   = this.player.direction;
        const now   = performance.now();
        const bob   = this.player.moving ? Math.sin(now / 110) * 2.5 : 0;
        const swing = this.player.moving ? Math.sin(now / 140) * 12  : 0;
        const by    = py + bob; // body Y with bobbing

        // Ground shadow
        ctx.fillStyle = 'rgba(0,0,0,0.28)';
        ctx.beginPath();
        ctx.ellipse(px, py + s * 0.48, s * 0.38, s * 0.12, 0, 0, Math.PI * 2);
        ctx.fill();

        // ── Legs ──
        const legOffset = this.player.moving ? Math.sin(now / 140) * 7 : 0;
        ctx.fillStyle = '#1a3560';
        ctx.fillRect(px - 9,  by + s * 0.12, 9,  s * 0.38);           // left leg
        ctx.fillRect(px,      by + s * 0.12 + legOffset, 9, s * 0.38); // right leg

        // ── Shoes ──
        ctx.fillStyle = '#111';
        ctx.fillRect(px - 11, by + s * 0.50, 11, 7);
        ctx.fillRect(px,      by + s * 0.50 + legOffset, 11, 7);

        // ── Torso / PNEC vest ──
        ctx.fillStyle = '#c0392b';
        ctx.fillRect(px - s * 0.36, by - s * 0.22, s * 0.72, s * 0.46);
        // Reflective vest stripe (emergency worker aesthetic)
        ctx.fillStyle = '#f39c12';
        ctx.fillRect(px - s * 0.36, by - s * 0.01, s * 0.72, 5);

        // ── Arms ──
        ctx.fillStyle = '#e8c89a';
        ctx.save();
        ctx.translate(px - s * 0.36, by - s * 0.1);
        ctx.rotate((-18 + swing) * Math.PI / 180);
        ctx.fillRect(-5, 0, 9, s * 0.32);
        ctx.restore();

        ctx.save();
        ctx.translate(px + s * 0.36, by - s * 0.1);
        ctx.rotate((18 - swing) * Math.PI / 180);
        ctx.fillRect(-4, 0, 9, s * 0.32);
        ctx.restore();

        // ── Head ──
        ctx.fillStyle = '#e8c89a';
        ctx.beginPath();
        ctx.arc(px, by - s * 0.38, s * 0.21, 0, Math.PI * 2);
        ctx.fill();

        // Hard hat (emergency worker)
        ctx.fillStyle = '#f1c40f';
        ctx.beginPath();
        ctx.arc(px, by - s * 0.41, s * 0.23, Math.PI, Math.PI * 2);
        ctx.fill();
        ctx.fillRect(px - s * 0.30, by - s * 0.41, s * 0.60, 6);
        // Hat brim highlight
        ctx.fillStyle = 'rgba(255,255,255,0.25)';
        ctx.fillRect(px - s * 0.28, by - s * 0.41, s * 0.56, 3);

        // ── Eyes ── (shift slightly in facing direction)
        const eyeShift = dir === 'left' ? -3 : dir === 'right' ? 3 : 0;
        ctx.fillStyle = '#2c3e50';
        ctx.beginPath();
        ctx.arc(px + eyeShift - 4, by - s * 0.38, 2.5, 0, Math.PI * 2);
        ctx.arc(px + eyeShift + 4, by - s * 0.38, 2.5, 0, Math.PI * 2);
        ctx.fill();
        // Eye whites
        ctx.fillStyle = 'rgba(255,255,255,0.5)';
        ctx.beginPath();
        ctx.arc(px + eyeShift - 4, by - s * 0.38 - 0.5, 1, 0, Math.PI * 2);
        ctx.arc(px + eyeShift + 4, by - s * 0.38 - 0.5, 1, 0, Math.PI * 2);
        ctx.fill();
    }

    _renderHUD(ctx, vw, vh) {
        // ── Player profile card (top-left) ──────────────────────────────
        const cardX = 12, cardY = 12, cardW = 195, cardH = 82;

        ctx.fillStyle   = 'rgba(8, 18, 32, 0.88)';
        ctx.strokeStyle = '#2980b9';
        ctx.lineWidth   = 1.2;
        this._roundRect(ctx, cardX, cardY, cardW, cardH, 8);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle    = '#2980b9';
        ctx.font         = 'bold 10px "Chakra Petch", monospace';
        ctx.textAlign    = 'left';
        ctx.textBaseline = 'top';
        ctx.fillText('PNEC FIRST RESPONDER', cardX + 10, cardY + 11);

        ctx.fillStyle = '#f8f5f0';
        ctx.font      = 'bold 15px "Chakra Petch", monospace';
        ctx.fillText(this.playerName.slice(0, 18), cardX + 10, cardY + 27);

        // Progress bar
        const barX = cardX + 10, barY = cardY + 54, barW = cardW - 20, barH = 11;
        const pct  = this.visitedCount / this.stations.length;

        ctx.fillStyle = '#0d1e33';
        ctx.fillRect(barX, barY, barW, barH);
        ctx.fillStyle = pct < 0.5 ? '#e67e22' : pct < 1 ? '#27ae60' : '#f1c40f';
        ctx.fillRect(barX, barY, barW * pct, barH);

        // Progress bar border
        ctx.strokeStyle = 'rgba(255,255,255,0.15)';
        ctx.lineWidth   = 1;
        ctx.strokeRect(barX, barY, barW, barH);

        ctx.fillStyle    = '#aab7c4';
        ctx.font         = '10px "IBM Plex Sans", sans-serif';
        ctx.textBaseline = 'top';
        ctx.fillText(`${this.visitedCount} / ${this.stations.length} stations visited`, barX, barY + 15);

        // ── Mini-map (top-right) ─────────────────────────────────────────
        const mmW = 130, mmH = 88;
        const mmX = vw - mmW - 12;
        const mmY = 12;
        const sx  = mmW / this.worldWidth;
        const sy  = mmH / this.worldHeight;

        ctx.fillStyle   = 'rgba(8, 18, 32, 0.88)';
        ctx.strokeStyle = '#2980b9';
        ctx.lineWidth   = 1.2;
        this._roundRect(ctx, mmX, mmY, mmW, mmH, 6);
        ctx.fill();
        ctx.stroke();

        // Station dots
        for (const s of this.stations) {
            const dotX = mmX + s.worldX * sx;
            const dotY = mmY + s.worldY * sy;
            ctx.fillStyle = s.visited ? '#27ae60' : s.color;
            ctx.beginPath();
            ctx.arc(dotX, dotY, 4, 0, Math.PI * 2);
            ctx.fill();
        }

        // Viewport rectangle
        ctx.strokeStyle = 'rgba(255,255,255,0.35)';
        ctx.lineWidth   = 1;
        ctx.strokeRect(
            mmX + this.camera.x * sx,
            mmY + this.camera.y * sy,
            this.canvas.width  * sx,
            this.canvas.height * sy,
        );

        // Player blip
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(mmX + this.player.x * sx, mmY + this.player.y * sy, 3, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle    = '#4a7fa8';
        ctx.font         = 'bold 8px "Chakra Petch", monospace';
        ctx.textAlign    = 'right';
        ctx.textBaseline = 'bottom';
        ctx.fillText('MAP', vw - 15, mmY + mmH - 2);

        // ── Controls hint (bottom-center) ───────────────────────────────
        const hintW = 294, hintH = 26;
        const hintX = Math.round(vw / 2 - hintW / 2);
        const hintY = vh - 38;

        ctx.fillStyle   = 'rgba(8, 18, 32, 0.78)';
        ctx.strokeStyle = 'rgba(41,128,185,0.3)';
        ctx.lineWidth   = 1;
        this._roundRect(ctx, hintX, hintY, hintW, hintH, 5);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle    = '#7f9ab0';
        ctx.font         = '11.5px "IBM Plex Sans", sans-serif';
        ctx.textAlign    = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('WASD / Arrow Keys  •  E to enter a station', Math.round(vw / 2), hintY + 13);
    }

    _renderInteractPrompt(ctx, vw, vh) {
        const s    = this.nearStation;
        const text = `Press  E  →  ${s.name}`;

        ctx.font = 'bold 14px "Chakra Petch", monospace';
        const tw = ctx.measureText(text).width;
        const pw = tw + 40, ph = 40;
        const px = Math.round(vw / 2 - pw / 2);
        const py = vh - 84;

        // Panel
        ctx.fillStyle   = 'rgba(8, 18, 32, 0.93)';
        ctx.strokeStyle = s.color;
        ctx.lineWidth   = 2;
        this._roundRect(ctx, px, py, pw, ph, 8);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle    = s.color;
        ctx.textAlign    = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(text, vw / 2, py + ph / 2);
    }

    // ─── Procedural Background ─────────────────────────────────────────────────
    /**
     * Draws a stylised aerial-view neighbourhood.
     * Replace this entire method (or skip it) if you're loading a real image.
     *
     * Layout:
     *   World: 2400 × 1600 px
     *   Road grid — vertical dividers at x: 0, 660, 1140, 1720, 2320
     *                horizontal dividers at y: 0,  490, 1010, 1520
     *   Road width: 70 px
     *   Station positions match the open areas in each corner / centre block.
     */
    _drawProceduralBg(ctx) {
        const W = this.worldWidth;
        const H = this.worldHeight;

        // ── Ground base ─────────────────────────────────────────────────
        ctx.fillStyle = '#0b1e30';
        ctx.fillRect(0, 0, W, H);

        // ── Grass / open land blocks (between road grid) ────────────────
        const GRASS_COLOR  = '#152b15';
        const GRASS_DARK   = '#112211';
        const blocks = [
            // top row
            { x: 70,   y: 70,   w: 550, h: 390 },
            { x: 730,  y: 70,   w: 370, h: 390 },
            { x: 1210, y: 70,   w: 470, h: 390 },
            { x: 1790, y: 70,   w: 530, h: 390 },
            // middle row
            { x: 70,   y: 560,  w: 550, h: 410 },
            { x: 730,  y: 560,  w: 370, h: 410 },   // central park
            { x: 1210, y: 560,  w: 470, h: 410 },
            { x: 1790, y: 560,  w: 530, h: 410 },
            // bottom row
            { x: 70,   y: 1080, w: 550, h: 390 },
            { x: 730,  y: 1080, w: 370, h: 390 },
            { x: 1210, y: 1080, w: 470, h: 390 },
            { x: 1790, y: 1080, w: 530, h: 390 },
        ];

        blocks.forEach(b => {
            ctx.fillStyle = GRASS_COLOR;
            ctx.fillRect(b.x, b.y, b.w, b.h);
            // Subtle texture stippling (deterministic using block coords as seed-like offsets)
            ctx.fillStyle = GRASS_DARK;
            for (let r = 0; r < 18; r++) {
                for (let c = 0; c < 18; c++) {
                    const ox = ((b.x * 7 + c * 113 + r * 53) % b.w);
                    const oy = ((b.y * 11 + r * 97 + c * 43) % b.h);
                    ctx.fillRect(b.x + ox, b.y + oy, 2, 2);
                }
            }
        });

        // ── Roads ────────────────────────────────────────────────────────
        const ROAD_FILL  = '#1a2635';
        const ROAD_MARK  = '#c8a84466';
        const vRoads     = [0, 660, 1140, 1720, 2320];
        const hRoads     = [0, 490, 1010, 1520];
        const RW         = 70;

        vRoads.forEach(rx => {
            ctx.fillStyle = ROAD_FILL;
            ctx.fillRect(rx, 0, RW, H);
            // Centre-line dashes
            ctx.strokeStyle = ROAD_MARK;
            ctx.lineWidth   = 2;
            ctx.setLineDash([36, 28]);
            ctx.beginPath(); ctx.moveTo(rx + RW / 2, 0); ctx.lineTo(rx + RW / 2, H); ctx.stroke();
            ctx.setLineDash([]);
            // Kerb / pavement edges
            ctx.fillStyle = '#1e2e3e';
            ctx.fillRect(rx, 0, 5, H);
            ctx.fillRect(rx + RW - 5, 0, 5, H);
        });

        hRoads.forEach(ry => {
            ctx.fillStyle = ROAD_FILL;
            ctx.fillRect(0, ry, W, RW);
            ctx.strokeStyle = ROAD_MARK;
            ctx.lineWidth   = 2;
            ctx.setLineDash([36, 28]);
            ctx.beginPath(); ctx.moveTo(0, ry + RW / 2); ctx.lineTo(W, ry + RW / 2); ctx.stroke();
            ctx.setLineDash([]);
            ctx.fillStyle = '#1e2e3e';
            ctx.fillRect(0, ry, W, 5);
            ctx.fillRect(0, ry + RW - 5, W, 5);
        });

        // Intersection highlights
        vRoads.forEach(rx => {
            hRoads.forEach(ry => {
                ctx.fillStyle = '#232f3e';
                ctx.fillRect(rx, ry, RW, RW);
            });
        });

        // ── Buildings (hardcoded for visual consistency) ─────────────────
        const buildings = [
            // — top-left block (around Emergency Kit station @ 360,300) —
            { x:  95, y:  95, w: 110, h: 80,  c: '#1d3557' },
            { x: 220, y:  95, w:  80, h: 80,  c: '#1b4332' },
            { x: 315, y:  95, w: 100, h: 75,  c: '#3a0d0d' },
            { x:  95, y: 195, w: 155, h: 70,  c: '#1d3557' },
            { x: 465, y:  95, w:  90, h: 150, c: '#1b4332' },
            { x: 440, y: 260, w: 115, h: 75,  c: '#3a0d0d' },
            { x:  95, y: 285, w:  80, h: 80,  c: '#2d4a1e' },
            { x: 190, y: 285, w: 100, h: 80,  c: '#1d3557' },
            { x:  95, y: 385, w: 200, h: 60,  c: '#1d3557' },
            // — top-right block (around Earthquake station @ 2040,300) —
            { x: 1815, y:  95, w: 115, h: 80,  c: '#1d3557' },
            { x: 1945, y:  95, w:  95, h: 80,  c: '#3a0d0d' },
            { x: 2055, y:  95, w: 105, h: 75,  c: '#1b4332' },
            { x: 2175, y:  95, w: 115, h: 80,  c: '#1d3557' },
            { x: 1815, y: 195, w: 180, h: 70,  c: '#2d4a1e' },
            { x: 2010, y: 195, w: 110, h: 70,  c: '#1d3557' },
            { x: 2135, y: 195, w: 155, h: 80,  c: '#3a0d0d' },
            { x: 1815, y: 285, w: 100, h: 80,  c: '#1d3557' },
            { x: 1930, y: 310, w: 80,  h: 55,  c: '#1b4332' },
            // — central block (around First Aid @ 1200,760) —
            { x:  755, y: 580, w: 120, h: 90,  c: '#1d3557' },
            { x: 890,  y: 580, w:  80, h: 85,  c: '#1b4332' },
            { x: 985,  y: 610, w:  95, h: 60,  c: '#3a0d0d' },
            { x: 755,  y: 690, w: 155, h: 65,  c: '#2d4a1e' },
            { x: 755,  y: 775, w: 105, h: 80,  c: '#1d3557' },
            { x: 875,  y: 785, w:  90, h: 75,  c: '#3a0d0d' },
            { x: 755,  y: 875, w: 260, h: 60,  c: '#1b4332' },
            // — bottom-left block (around Wildfire @ 360,1300) —
            { x:  95, y:1105, w: 120, h: 90,  c: '#3a0d0d' },
            { x: 230, y:1105, w:  95, h: 90,  c: '#1d3557' },
            { x: 340, y:1105, w: 105, h: 75,  c: '#1b4332' },
            { x: 460, y:1105, w:  90, h: 90,  c: '#2d4a1e' },
            { x:  95, y:1215, w: 175, h: 70,  c: '#1d3557' },
            { x: 285, y:1215, w: 130, h: 70,  c: '#3a0d0d' },
            { x: 435, y:1215, w: 115, h: 85,  c: '#1d3557' },
            { x:  95, y:1405, w: 290, h: 65,  c: '#1b4332' },
            { x: 400, y:1405, w: 150, h: 65,  c: '#1d3557' },
            // — bottom-right block (around Communication Hub @ 2040,1300) —
            { x: 1815, y:1105, w: 115, h: 90,  c: '#1d3557' },
            { x: 1945, y:1105, w:  90, h: 90,  c: '#2d4a1e' },
            { x: 2050, y:1105, w: 105, h: 80,  c: '#1d3557' },
            { x: 2170, y:1105, w: 120, h: 90,  c: '#3a0d0d' },
            { x: 1815, y:1215, w: 160, h: 70,  c: '#1b4332' },
            { x: 1990, y:1215, w: 110, h: 70,  c: '#1d3557' },
            { x: 2115, y:1215, w: 175, h: 80,  c: '#2d4a1e' },
            { x: 1815, y:1405, w: 300, h: 65,  c: '#1d3557' },
            { x: 2130, y:1405, w: 160, h: 65,  c: '#3a0d0d' },
            // — mid-left —
            { x: 95,  y: 580, w: 130, h: 100, c: '#1d3557' },
            { x: 240, y: 580, w: 110, h:  90, c: '#1b4332' },
            { x: 365, y: 610, w:  90, h:  70, c: '#3a0d0d' },
            { x: 475, y: 580, w:  90, h:  90, c: '#2d4a1e' },
            { x: 95,  y: 700, w: 140, h:  80, c: '#1d3557' },
            { x: 250, y: 710, w: 120, h:  75, c: '#3a0d0d' },
            { x: 95,  y: 800, w: 180, h:  70, c: '#1b4332' },
            { x: 290, y: 800, w: 155, h:  70, c: '#1d3557' },
            { x: 95,  y: 890, w: 300, h:  60, c: '#2d4a1e' },
            // — mid-right —
            { x: 1240, y: 580, w: 140, h: 100, c: '#1d3557' },
            { x: 1395, y: 580, w:  80, h:  90, c: '#3a0d0d' },
            { x: 1490, y: 580, w: 100, h:  90, c: '#1b4332' },
            { x: 1605, y: 580, w: 100, h:  80, c: '#1d3557' },
            { x: 1720, y: 580, w:  60, h: 100, c: '#2d4a1e' },
            { x: 1240, y: 700, w: 150, h:  80, c: '#1d3557' },
            { x: 1405, y: 700, w: 120, h:  75, c: '#3a0d0d' },
            { x: 1240, y: 800, w: 200, h:  70, c: '#1b4332' },
            { x: 1455, y: 800, w: 145, h:  70, c: '#1d3557' },
            { x: 1240, y: 890, w: 320, h:  60, c: '#2d4a1e' },
            // — far-right middle —
            { x: 1815, y: 580, w: 130, h: 100, c: '#1d3557' },
            { x: 1960, y: 580, w: 100, h:  90, c: '#1b4332' },
            { x: 2075, y: 610, w:  90, h:  70, c: '#3a0d0d' },
            { x: 2180, y: 580, w: 110, h:  90, c: '#2d4a1e' },
            { x: 1815, y: 700, w: 200, h:  80, c: '#1d3557' },
            { x: 2030, y: 700, w: 130, h:  75, c: '#3a0d0d' },
            { x: 1815, y: 800, w: 175, h:  70, c: '#1b4332' },
            { x: 2005, y: 800, w: 155, h:  70, c: '#1d3557' },
            { x: 1815, y: 890, w: 280, h:  60, c: '#2d4a1e' },
            // — top-center blocks —
            { x: 760,  y:  95, w: 100, h: 80,  c: '#1d3557' },
            { x: 875,  y:  95, w:  90, h: 80,  c: '#3a0d0d' },
            { x: 980,  y:  95, w:  80, h: 75,  c: '#1b4332' },
            { x: 1075, y:  95, w:  60, h: 160, c: '#1d3557' },
            { x: 760,  y: 195, w: 200, h: 65,  c: '#2d4a1e' },
            { x: 760,  y: 280, w: 155, h: 80,  c: '#1d3557' },
            { x: 760,  y: 380, w: 280, h: 60,  c: '#3a0d0d' },
            { x: 1240, y:  95, w: 120, h: 80,  c: '#1d3557' },
            { x: 1375, y:  95, w:  95, h: 80,  c: '#1b4332' },
            { x: 1485, y:  95, w: 100, h: 75,  c: '#3a0d0d' },
            { x: 1600, y:  95, w: 100, h: 80,  c: '#2d4a1e' },
            { x: 1240, y: 195, w: 180, h: 70,  c: '#1d3557' },
            { x: 1240, y: 280, w: 140, h: 80,  c: '#3a0d0d' },
            { x: 1240, y: 380, w: 250, h: 60,  c: '#1b4332' },
            // — bottom-center —
            { x: 760,  y:1105, w: 105, h: 90,  c: '#1d3557' },
            { x: 880,  y:1105, w:  90, h: 90,  c: '#2d4a1e' },
            { x: 985,  y:1105, w:  80, h: 85,  c: '#3a0d0d' },
            { x: 760,  y:1215, w: 170, h: 70,  c: '#1d3557' },
            { x: 945,  y:1215, w: 120, h: 70,  c: '#1b4332' },
            { x: 760,  y:1405, w: 280, h: 65,  c: '#2d4a1e' },
            { x: 1240, y:1105, w: 130, h: 90,  c: '#1d3557' },
            { x: 1385, y:1105, w: 100, h: 80,  c: '#3a0d0d' },
            { x: 1500, y:1105, w: 100, h: 90,  c: '#1b4332' },
            { x: 1615, y:1105, w: 100, h: 80,  c: '#2d4a1e' },
            { x: 1240, y:1215, w: 200, h: 70,  c: '#1d3557' },
            { x: 1455, y:1215, w: 145, h: 70,  c: '#3a0d0d' },
            { x: 1240, y:1405, w: 300, h: 65,  c: '#1d3557' },
        ];

        buildings.forEach(b => {
            // Drop shadow
            ctx.fillStyle = 'rgba(0,0,0,0.45)';
            ctx.fillRect(b.x + 5, b.y + 5, b.w, b.h);

            // Body
            ctx.fillStyle = b.c;
            ctx.fillRect(b.x, b.y, b.w, b.h);

            // Roof highlight
            ctx.fillStyle = 'rgba(255,255,255,0.07)';
            ctx.fillRect(b.x, b.y, b.w, 7);

            // Windows (deterministic pseudo-random using building coords)
            ctx.fillStyle = 'rgba(255,230,100,0.35)';
            const cols = Math.max(1, Math.floor(b.w / 26));
            const rows = Math.max(1, Math.floor(b.h / 26));
            for (let r = 0; r < rows; r++) {
                for (let c = 0; c < cols; c++) {
                    // Use a hash of b.x, b.y, r, c to decide if window is lit
                    const hash = ((b.x * 13 + b.y * 7 + r * 31 + c * 17) % 100);
                    if (hash > 25) {
                        ctx.fillRect(b.x + 7 + c * 26, b.y + 9 + r * 24, 11, 13);
                    }
                }
            }
        });

        // ── Trees ───────────────────────────────────────────────────────
        const trees = [
            {x:165,y:455},{x:235,y:455},{x:315,y:455},{x:415,y:455},{x:515,y:455},
            {x:165,y:530},{x:280,y:540},{x:400,y:530},{x:530,y:540},
            {x:1815,y:455},{x:1890,y:455},{x:1980,y:455},{x:2080,y:455},{x:2200,y:455},
            {x:1820,y:530},{x:1920,y:540},{x:2040,y:530},{x:2160,y:530},
            {x:165,y:975},{x:265,y:985},{x:380,y:975},{x:500,y:975},
            {x:1820,y:975},{x:1940,y:975},{x:2060,y:975},{x:2180,y:975},
            {x:760,y:455},{x:840,y:455},{x:920,y:455},{x:1000,y:455},
            {x:1240,y:455},{x:1330,y:455},{x:1440,y:455},{x:1560,y:455},{x:1680,y:455},
            {x:760,y:975},{x:850,y:975},{x:980,y:975},{x:1070,y:975},
            {x:1250,y:975},{x:1370,y:975},{x:1490,y:975},{x:1620,y:975},
            {x:165,y:1480},{x:285,y:1480},{x:420,y:1480},{x:535,y:1480},
            {x:1820,y:1480},{x:1950,y:1480},{x:2100,y:1480},{x:2250,y:1480},
            {x:760,y:1480},{x:880,y:1480},{x:1010,y:1480},
            {x:1250,y:1480},{x:1380,y:1480},{x:1520,y:1480},{x:1660,y:1480},
            // Central park trees
            {x:760,y:640},{x:820,y:720},{x:890,y:800},{x:950,y:860},{x:1030,y:640},
            {x:1080,y:720},{x:760,y:940},{x:830,y:890},{x:960,y:940},{x:1060,y:850},
        ];

        trees.forEach(t => {
            // Trunk
            ctx.fillStyle = '#6b4226';
            ctx.fillRect(t.x - 4, t.y - 6, 8, 18);
            // Canopy shadow
            ctx.fillStyle = 'rgba(0,0,0,0.28)';
            ctx.beginPath();
            ctx.arc(t.x + 3, t.y - 14, 20, 0, Math.PI * 2);
            ctx.fill();
            // Canopy main
            ctx.fillStyle = '#1e5c1e';
            ctx.beginPath();
            ctx.arc(t.x, t.y - 16, 21, 0, Math.PI * 2);
            ctx.fill();
            // Canopy highlight
            ctx.fillStyle = '#2e7a2e';
            ctx.beginPath();
            ctx.arc(t.x - 5, t.y - 21, 14, 0, Math.PI * 2);
            ctx.fill();
        });

        // ── Central park feature ──────────────────────────────────────
        // Footpath
        ctx.fillStyle = '#1c2c3c';
        ctx.fillRect(895, 755, 20, 470); // vertical path
        ctx.fillRect(660, 775, 460, 20); // horizontal path
        // Fountain / feature
        ctx.fillStyle = '#0d2b4a';
        ctx.beginPath(); ctx.arc(905, 775, 35, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#1a4f7a';
        ctx.beginPath(); ctx.arc(905, 775, 25, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#2980b9';
        ctx.beginPath(); ctx.arc(905, 775, 12, 0, Math.PI * 2); ctx.fill();

        // ── Station ground clearings ──────────────────────────────────
        for (const s of this.stations) {
            const sx = s.worldX, sy = s.worldY, r = s.radius;

            // Cleared ground
            ctx.fillStyle = '#0d1e30';
            ctx.beginPath(); ctx.arc(sx, sy, r + 24, 0, Math.PI * 2); ctx.fill();

            // Coloured tinted pad
            ctx.fillStyle = s.color + '18';
            ctx.beginPath(); ctx.arc(sx, sy, r + 8, 0, Math.PI * 2); ctx.fill();

            // Station building structure
            const bw = 72, bh = 58;
            ctx.fillStyle = 'rgba(0,0,0,0.55)';
            ctx.fillRect(sx - bw / 2 + 4, sy - bh / 2 + 4, bw, bh);
            ctx.fillStyle = s.color + 'cc';
            ctx.fillRect(sx - bw / 2, sy - bh / 2, bw, bh);

            // Roof peak
            ctx.fillStyle = s.color;
            ctx.beginPath();
            ctx.moveTo(sx - bw / 2 - 6, sy - bh / 2);
            ctx.lineTo(sx + bw / 2 + 6, sy - bh / 2);
            ctx.lineTo(sx, sy - bh / 2 - 22);
            ctx.closePath();
            ctx.fill();

            // Door
            ctx.fillStyle = 'rgba(0,0,0,0.65)';
            ctx.fillRect(sx - 9, sy + 5, 18, 27);

            // Path to nearest road (simple straight line)
            ctx.strokeStyle = '#1e2c3c';
            ctx.lineWidth   = 14;
            ctx.lineCap     = 'round';
            ctx.beginPath();
            ctx.moveTo(sx, sy + bh / 2 + 5);
            ctx.lineTo(sx, sy + r + 45);
            ctx.stroke();
        }

        // ── World border ──────────────────────────────────────────────
        ctx.strokeStyle = '#c0392b33';
        ctx.lineWidth   = 10;
        ctx.strokeRect(5, 5, W - 10, H - 10);
    }

    // ─── Station Interaction ───────────────────────────────────────────────────

    _openStation(station) {
        if (this.interactCooldown > 0) return;

        this.chatOpen = true;
        this.chatBot  = new ChatBot(station, () => this._onChatClose());
        this.chatBot.open();

        if (!station.visited) {
            station.visited = true;
            this.visitedCount++;
        }

        this.interactCooldown = 0.5;
    }

    _onChatClose() {
        this.chatOpen        = false;
        this.chatBot         = null;
        this.interactCooldown = 0.4;
    }

    // ─── Utility ───────────────────────────────────────────────────────────────

    _roundRect(ctx, x, y, w, h, r) {
        ctx.beginPath();
        ctx.moveTo(x + r, y);
        ctx.lineTo(x + w - r, y);
        ctx.quadraticCurveTo(x + w, y, x + w, y + r);
        ctx.lineTo(x + w, y + h - r);
        ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
        ctx.lineTo(x + r, y + h);
        ctx.quadraticCurveTo(x, y + h, x, y + h - r);
        ctx.lineTo(x, y + r);
        ctx.quadraticCurveTo(x, y, x + r, y);
        ctx.closePath();
    }
}

export { GameEngine };
