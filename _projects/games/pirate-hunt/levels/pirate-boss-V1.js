import GameEnvBackground from './essentials/GameEnvBackground.js';
import Player from './essentials/Player.js';
import Character from './essentials/Character.js';
import Npc from './essentials/Npc.js';

// ── Boss character─────────────────────
class BlackbreadBoss extends Character {
    constructor(data, gameEnv) {
        super(data, gameEnv);
        this.velocity    = { x: 0, y: 0 };
        this.speed       = data.SPEED || 1.0;
        this.patrolAngle = 0;
        this.attackTimer = 0;
        this.attackCycle = 180;
        this.cannonballs = [];
    }

    update() {
        const W = this.gameEnv.innerWidth;
        const H = this.gameEnv.innerHeight;

        // Orbit the centre of the screen
        this.patrolAngle += 0.010;
        const r = Math.min(W, H) * 0.28;
        this.position.x = W / 2 + Math.cos(this.patrolAngle) * r - (this.width  || 80)  / 2;
        this.position.y = H / 2 + Math.sin(this.patrolAngle) * r - (this.height || 100) / 2;

        // Fire cannonballs toward the player
        this.attackTimer++;
        if (this.attackTimer >= this.attackCycle) {
            this.attackTimer = 0;
            this._fire();
        }

        this._tickCannonballs();
        this.draw();
    }

    _fire() {
        let player = null;
        this.gameEnv.gameObjects?.forEach(o => {
            if (o?.constructor?.name === 'Player') player = o;
        });
        if (!player?.position) return;

        const bx  = this.position.x + (this.width  || 80)  / 2;
        const by  = this.position.y + (this.height || 100) / 2;
        const px  = player.position.x + (player.width  || 30) / 2;
        const py  = player.position.y + (player.height || 40) / 2;
        const dx  = px - bx, dy = py - by;
        const mag = Math.sqrt(dx * dx + dy * dy) || 1;
        const spd = 3.5;

        this.cannonballs.push({ x: bx, y: by, vx: dx / mag * spd, vy: dy / mag * spd, life: 140, r: 9 });
    }

    _tickCannonballs() {
        const ctx = this.gameEnv.ctx;
        const W   = this.gameEnv.innerWidth;
        const H   = this.gameEnv.innerHeight;
        ctx.save();
        for (let i = this.cannonballs.length - 1; i >= 0; i--) {
            const cb = this.cannonballs[i];
            cb.x += cb.vx;
            cb.y += cb.vy;
            cb.life--;
            if (cb.life <= 0 || cb.x < 0 || cb.x > W || cb.y < 0 || cb.y > H) {
                this.cannonballs.splice(i, 1);
                continue;
            }
            ctx.beginPath();
            ctx.arc(cb.x, cb.y, cb.r, 0, Math.PI * 2);
            ctx.fillStyle = '#ff6600';
            ctx.fill();
            ctx.beginPath();
            ctx.arc(cb.x - cb.vx * 1.5, cb.y - cb.vy * 1.5, cb.r * 0.5, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(255,140,0,0.3)';
            ctx.fill();
        }
        ctx.restore();
    }
}

// ── Level class ───────────────────────────────────────────────────────────────
class GameLevelPirateBoss {
    // Sets up the boss fight level: initializes HP bars, HUD elements, sprite configs, and game objects array
    constructor(gameEnv) {
        const path = gameEnv.path;
        this.gameEnv = gameEnv;
        this.continue = true;

        
        this.state        = 'INTRO';   
        this.bossMaxHp    = 250;
        this.bossHp       = 250;
        this.playerMaxHp  = 100;
        this.playerHp     = 100;
        this.bossPhase    = 1;
        this.turnCount    = 0;
        this.attackIndex  = 0;
        this.frameCount   = 0;
        this.bullets      = [];
        this.soulX        = 0;
        this.soulY        = 0;
        this.soulSpd      = 4;
        this.invincFrames = 0;
        this.menuIndex    = 0;   // 0=FIGHT 1=ACT 2=ITEM 3=MERCY
        this.attackActive = false;
        this.attackTimer  = 0;
        this.attackDur    = 180; // frames per boss attack
        this.messageQueue = [];
        this.currentMsg   = '';
        this.msgTimer     = 0;
        this.itemUsed     = false;

     
        this.box = { x: 0, y: 0, w: 240, h: 200 };
       
        this.canvas = document.createElement('canvas');
        this.canvas.id = 'ut-battle-canvas';
        this.canvas.style.cssText = `
            position: fixed;
            top: 0; left: 0;
            width: 100%; height: 100%;
            z-index: 5000;
            pointer-events: none;
            image-rendering: pixelated;
        `;
        document.body.appendChild(this.canvas);
        this.ctx2 = this.canvas.getContext('2d');

    
        this.keys = {};
        this._keyDown = (e) => {
            if (['ArrowUp','ArrowDown','ArrowLeft','ArrowRight',
                 'KeyW','KeyA','KeyS','KeyD','KeyZ','KeyX',
                 'Enter','Space'].includes(e.code)) {
                e.stopPropagation();
            }
            this.keys[e.code] = true;
            this._handleMenuKey(e.code);
        };
        this._keyUp = (e) => { this.keys[e.code] = false; };
        window.addEventListener('keydown', this._keyDown);
        window.addEventListener('keyup',   this._keyUp);

   
        this.bossImg  = new Image();
        this.bossImg.src  = path + '/images/gamebuilder/sprites/Pirate.png';
        this.playerImg = new Image();
        this.playerImg.src = path + '/images/gamebuilder/sprites/mcarchie.png';

    
        this._queueMessages([
            '* A ferocious pirate blocks your path!',
            '* BLACKBREAD appeared!',
            '* His eyes glow with fury...',
        ], () => { this.state = 'MENU'; });

        
        const bgData = {
            name: 'boss_bg',
            src: path + '/images/gamebuilder/bg/Ship.jpg',
            pixels: { height: 600, width: 800 }
        };
        const playerData = {
            id: 'mcarchie',
            src: path + '/images/gamebuilder/sprites/mcarchie.png',
            SCALE_FACTOR: 999,   // effectively hidden — battle UI takes over
            STEP_FACTOR: 1000,
            ANIMATION_RATE: 30,
            INIT_POSITION: { x: 0, y: 0 },
            pixels: { height: 256, width: 256 },
            orientation: { rows: 4, columns: 4 },
            down:  { row: 0, start: 0, columns: 4 },
            right: { row: 2, start: 0, columns: 4 },
            left:  { row: 1, start: 0, columns: 4 },
            up:    { row: 3, start: 0, columns: 4 },
            hitbox: { widthPercentage: 0.1, heightPercentage: 0.1 },
            keypress: { up: 0, left: 0, down: 0, right: 0 }  // disable WASD for game engine
        };

        this.classes = [
            { class: GameEnvBackground, data: bgData    },
            { class: Player,            data: playerData }
        ];
    }


    _queueMessages(msgs, callback) {
        this.messageQueue = [...msgs];
        this._msgCallback = callback || null;
        this._nextMessage();
    }

    // ── helpers ──────────────────────────────────────────────────────────────

    _overlap(ax, ay, aw, ah, bx, by, bw, bh) {
        return ax < bx + bw && ax + aw > bx && ay < by + bh && ay + ah > by;
    }

    _setPlayerHp(hp) {
        this.playerHp = Math.max(0, Math.min(this.playerMaxHp, hp));
        const pct  = this.playerHp / this.playerMaxHp * 100;
        const fill = document.getElementById('player-hp-fill');
        const txt  = document.getElementById('player-hp-txt');
        if (fill) {
            fill.style.width      = pct + '%';
            fill.style.background = pct < 25 ? '#dd0000' : pct < 50 ? '#ffaa00' : '#3388ff';
        }
        if (txt) txt.textContent = Math.round(this.playerHp) + ' / ' + this.playerMaxHp;
    }

    _setBossHp(hp) {
        this.bossHp = Math.max(0, hp);
        const pct  = this.bossHp / this.bossMaxHp * 100;
        const fill = document.getElementById('boss-hp-fill');
        const txt  = document.getElementById('boss-hp-txt');
        const lbl  = document.getElementById('boss-phase-lbl');
        if (fill) {
            fill.style.width      = pct + '%';
            fill.style.background =
                this.bossPhase === 3 ? '#cc00ff' :
                this.bossPhase === 2 ? '#ff6600' : '#dd2200';
        }
        if (txt) txt.textContent = Math.round(this.bossHp) + ' / ' + this.bossMaxHp;
        if (lbl) lbl.textContent =
            this.bossPhase === 3 ? 'Phase III — ENRAGED' :
            this.bossPhase === 2 ? 'Phase II — Aggressive' : 'Phase I';
    }

    _flash(msg) {
        const el = document.getElementById('boss-flash');
        if (!el) return;
        el.textContent   = msg;
        el.style.opacity = '1';
        clearTimeout(this._flashTimer);
        this._flashTimer = setTimeout(() => { el.style.opacity = '0'; }, 2200);
    }

    _showResult(won) {
        this.wonGame = true;
        const popup = document.getElementById('boss-popup');
        if (!popup) return;
        popup.innerHTML = won ? `
            <div style="font-size:52px;margin-bottom:8px;">☠️🦜</div>
            <div style="color:#f5d060;font-size:26px;font-weight:bold;margin-bottom:12px;">Victory!</div>
            <div style="color:#c8e8c8;font-size:15px;line-height:1.9;margin-bottom:22px;">
                McArchie defeats Blackbread!<br>
                <span style="color:#ff8844;">The seas belong to you now.</span>
            </div>
            <button id="boss-popup-btn" style="background:#6b3d00;color:#f5d060;border:2px solid #c8a44a;padding:11px 28px;font-size:16px;font-family:Georgia,serif;border-radius:8px;cursor:pointer;">Close ✕</button>
        ` : `
            <div style="font-size:52px;margin-bottom:8px;">💀</div>
            <div style="color:#cc3300;font-size:26px;font-weight:bold;margin-bottom:12px;">Defeated!</div>
            <div style="color:#ffaaaa;font-size:15px;line-height:1.9;margin-bottom:22px;">
                Blackbread crushes McArchie...<br>
                <span style="color:#aaaaaa;">Return when you are stronger.</span>
            </div>
            <button id="boss-popup-btn" style="background:#3d0000;color:#ffaaaa;border:2px solid #8b0000;padding:11px 28px;font-size:16px;font-family:Georgia,serif;border-radius:8px;cursor:pointer;">Close ✕</button>
        `;
        popup.style.display = 'block';
        document.getElementById('boss-popup-btn').onclick = () => {
            popup.style.display = 'none';
        };
    }

    // ── main update called every frame by the engine ──────────────────────────
    update() {
        if (!this.gameEnv?.gameObjects || this.wonGame) return;

        let player = null;
        let boss   = null;

        this.gameEnv.gameObjects.forEach(obj => {
            if (obj?.constructor?.name === 'Player') player = obj;
            if (obj instanceof BlackbreadBoss)       boss   = obj;
        });

        if (!player?.position || !boss?.position) return;

        const px = player.position.x, py = player.position.y;
        const pw = player.width  || 30,  ph = player.height || 40;
        const bx = boss.position.x,      by = boss.position.y;
        const bw = boss.width    || 80,  bh = boss.height   || 100;

        // ── Phase transitions ─────────────────────────────────────────────
        const ratio    = this.bossHp / this.bossMaxHp;
        const newPhase = ratio > 0.6 ? 1 : ratio > 0.3 ? 2 : 3;
        if (newPhase !== this.bossPhase) {
            this.bossPhase = newPhase;
            const msgs = newPhase === 2
                ? ['* Blackbread\'s eye glows red!', '* His attacks are faster now!']
                : ['* Blackbread ROARS in fury!', '* Everything is shaking!', '* His power has doubled!'];
            this.messageQueue = [...msgs, ...this.messageQueue];
        }
    }

    
    _spawnBullet(x, y, vx, vy, r = 6, color = '#ff4444', type = 'circle') {
        this.bullets.push({ x, y, vx, vy, r, color, type, life: 300 });
    }

    _spawnCannonPattern(t) {
        const box = this.box;
        // volleys from the sides
        if (t % 30 === 0) {
            const side = Math.random() < 0.5 ? 'left' : 'right';
            const y    = box.y + 20 + Math.random() * (box.h - 40);
            const vx   = side === 'left' ? 3.5 : -3.5;
            this._spawnBullet(side === 'left' ? box.x - 10 : box.x + box.w + 10, y, vx, 0, 7, '#ff6600');
        }
        if (t % 45 === 0) {
            const x = box.x + 20 + Math.random() * (box.w - 40);
            this._spawnBullet(x, box.y - 10, 0, 3, 6, '#ffaa00');
        }
    }

    _spawnCutlassPattern(t) {
        const box = this.box;
        // diagonal sweeps
        if (t % 20 === 0) {
            const top = Math.random() < 0.5;
            for (let i = 0; i < 4; i++) {
                const x  = box.x + (box.w / 5) * i + 10;
                const vy = top ? 4 : -4;
                const vx = (Math.random() - 0.5) * 1.5;
                this._spawnBullet(x, top ? box.y - 8 : box.y + box.h + 8, vx, vy, 5, '#ff2222', 'diamond');
            }
        }
    }

    _spawnStormPattern(t) {
        const box = this.box;
       
        if (t % 25 === 0) {
            const cx  = box.x + box.w / 2;
            const cy  = box.y + box.h / 2;
            const num = 6;
            const off = (t / 25) * 0.4;
            for (let i = 0; i < num; i++) {
                const a   = (i / num) * Math.PI * 2 + off;
                const spd = 2.8;
                this._spawnBullet(cx, cy, Math.cos(a) * spd, Math.sin(a) * spd, 5, '#cc44ff', 'circle');
            }
        }
    }

    _spawnRagePattern(t) {
      
        const box = this.box;
        if (t % 15 === 0) {
            const x = box.x + Math.random() * box.w;
            this._spawnBullet(x, box.y - 8, (Math.random()-0.5)*2, 5, 6, '#ff0000');
        }
        if (t % 18 === 0) {
            const y = box.y + Math.random() * box.h;
            this._spawnBullet(box.x - 8, y, 5, (Math.random()-0.5)*2, 6, '#ff4400');
            this._spawnBullet(box.x + box.w + 8, y, -5, (Math.random()-0.5)*2, 6, '#ff4400');
        }
        if (t % 30 === 0) {
            const cx = box.x + box.w / 2, cy = box.y + box.h / 2;
            for (let i = 0; i < 8; i++) {
                const a = (i / 8) * Math.PI * 2 + t * 0.05;
                this._spawnBullet(cx, cy, Math.cos(a)*3.5, Math.sin(a)*3.5, 5, '#ffff00');
            }
        }
    }

    
    _updateBossTurn() {
        const t   = this.attackTimer;
        const box = this.box;

       
        if      (this.currentPattern === 0) this._spawnCannonPattern(t);
        else if (this.currentPattern === 1) this._spawnCutlassPattern(t);
        else if (this.currentPattern === 2) this._spawnStormPattern(t);
        else if (this.currentPattern === 3) this._spawnRagePattern(t);

        // move soul with arrow keys
        const spd = this.soulSpd;
        if (this.keys['ArrowLeft']  || this.keys['KeyA']) this.soulX -= spd;
        if (this.keys['ArrowRight'] || this.keys['KeyD']) this.soulX += spd;
        if (this.keys['ArrowUp']    || this.keys['KeyW']) this.soulY -= spd;
        if (this.keys['ArrowDown']  || this.keys['KeyS']) this.soulY += spd;

      
        this.soulX = Math.max(box.x + 8,  Math.min(box.x + box.w - 8,  this.soulX));
        this.soulY = Math.max(box.y + 8,  Math.min(box.y + box.h - 8,  this.soulY));

       
        if (this.invincFrames > 0) this.invincFrames--;

        for (let i = this.bullets.length - 1; i >= 0; i--) {
            const b = this.bullets[i];
            b.x += b.vx; b.y += b.vy; b.life--;

          
            if (b.life <= 0 ||
                b.x < box.x - 20 || b.x > box.x + box.w + 20 ||
                b.y < box.y - 20 || b.y > box.y + box.h + 20) {
                this.bullets.splice(i, 1); continue;
            }

           
            if (this.invincFrames === 0) {
                const dx = b.x - this.soulX, dy = b.y - this.soulY;
                if (Math.sqrt(dx*dx + dy*dy) < b.r + 5) {
                    const dmg = this.bossPhase === 3 ? 12 : this.bossPhase === 2 ? 8 : 5;
                    this.playerHp = Math.max(0, this.playerHp - dmg);
                    this.invincFrames = 40;
                    this.bullets.splice(i, 1);
                    if (this.playerHp <= 0) {
                        this.state = 'LOSE';
                        return;
                    }
                }
            }
        }

        this.attackTimer++;
        if (this.attackTimer >= this.attackDur) {
            this.attackActive = false;
            this.bullets      = [];
            this.state        = 'MENU';
        }
    }

    
    _render() {
        const cv  = this.canvas;
        const ctx = this.ctx2;
        cv.width  = window.innerWidth;
        cv.height = window.innerHeight;
        const W = cv.width, H = cv.height;

        ctx.clearRect(0, 0, W, H);

        // dark overlay
        ctx.fillStyle = 'rgba(0,0,0,0.78)';
        ctx.fillRect(0, 0, W, H);

       
        const bossW = 180, bossH = 180;
        const bossX = W / 2 - bossW / 2;
        const bossY = 30;
        if (this.bossImg.complete) {
            // flash red when hit
            if (this._bossHitFlash > 0) {
                ctx.save();
                ctx.globalCompositeOperation = 'source-over';
                ctx.drawImage(this.bossImg, 0, 0, 632, 395, bossX, bossY, bossW, bossH);
                ctx.globalAlpha = 0.6;
                ctx.fillStyle = '#ff0000';
                ctx.fillRect(bossX, bossY, bossW, bossH);
                ctx.restore();
                this._bossHitFlash--;
            } else {
                ctx.drawImage(this.bossImg, 0, 0, 632, 395, bossX, bossY, bossW, bossH);
            }
        }

       
        const barW = 300, barH = 18;
        const barX = W / 2 - barW / 2, barY = bossY + bossH + 6;
        ctx.fillStyle = '#111';
        ctx.fillRect(barX, barY, barW, barH);
        const hpPct = Math.max(0, this.bossHp / this.bossMaxHp);
        const hpColor = this.bossPhase === 3 ? '#cc00ff' : this.bossPhase === 2 ? '#ff6600' : '#ff2200';
        ctx.fillStyle = hpColor;
        ctx.fillRect(barX, barY, barW * hpPct, barH);
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(barX, barY, barW, barH);
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 12px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(`BLACKBREAD   ${Math.max(0, Math.round(this.bossHp))} / ${this.bossMaxHp}`, W/2, barY + 13);

        // phase label
        const phaseLabel = this.bossPhase === 3 ? '★ PHASE III — ENRAGED' : this.bossPhase === 2 ? '★ PHASE II' : '';
        if (phaseLabel) {
            ctx.fillStyle = hpColor;
            ctx.font = 'bold 13px monospace';
            ctx.fillText(phaseLabel, W/2, barY + barH + 16);
        }

        // ── player HP bar (bottom-left style) ────────────────────────
        const pBarX = 40, pBarY = H - 80, pBarW = 200, pBarH = 16;
        ctx.fillStyle = '#000';
        ctx.fillRect(pBarX - 2, pBarY - 2, pBarW + 4, pBarH + 4);
        const pPct = Math.max(0, this.playerHp / this.playerMaxHp);
        ctx.fillStyle = pPct < 0.25 ? '#ff2200' : pPct < 0.5 ? '#ffaa00' : '#00dd44';
        ctx.fillRect(pBarX, pBarY, pBarW * pPct, pBarH);
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 1;
        ctx.strokeRect(pBarX, pBarY, pBarW, pBarH);
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 12px monospace';
        ctx.textAlign = 'left';
        ctx.fillText(`McArchie   HP  ${Math.round(this.playerHp)} / ${this.playerMaxHp}`, pBarX, pBarY - 6);

        
        if (this.state === 'BOSS_TURN') {
            const box = this.box;
            
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth   = 3;
            ctx.strokeRect(box.x - 3, box.y - 3, box.w + 6, box.h + 6);
           
            ctx.fillStyle = '#000000';
            ctx.fillRect(box.x, box.y, box.w, box.h);

           
            this.bullets.forEach(b => {
                ctx.save();
                if (b.type === 'diamond') {
                    ctx.translate(b.x, b.y);
                    ctx.rotate(Math.PI / 4);
                    ctx.fillStyle = b.color;
                    ctx.fillRect(-b.r, -b.r, b.r * 2, b.r * 2);
                } else {
                    ctx.beginPath();
                    ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
                    ctx.fillStyle = b.color;
                    ctx.fill();
                }
                ctx.restore();
            });

           
            const alpha = this.invincFrames > 0 ? (Math.sin(this.frameCount * 0.5) > 0 ? 0.3 : 1) : 1;
            ctx.save();
            ctx.globalAlpha = alpha;
            ctx.fillStyle   = '#0088ff';
           
            const sx = this.soulX, sy = this.soulY, sr = 7;
            ctx.beginPath();
            ctx.moveTo(sx, sy + sr);
            ctx.bezierCurveTo(sx - sr*2, sy - sr, sx - sr*2, sy - sr*2.5, sx, sy - sr*0.8);
            ctx.bezierCurveTo(sx + sr*2, sy - sr*2.5, sx + sr*2, sy - sr, sx, sy + sr);
            ctx.fill();
            ctx.restore();

        
            ctx.fillStyle   = '#ffffff';
            ctx.font        = '13px monospace';
            ctx.textAlign   = 'center';
            ctx.fillText(this.currentMsg, W / 2, box.y + box.h + 22);

           
            const tPct = 1 - this.attackTimer / this.attackDur;
            ctx.fillStyle = '#333';
            ctx.fillRect(box.x, box.y + box.h + 30, box.w, 6);
            ctx.fillStyle = tPct > 0.5 ? '#00cc44' : tPct > 0.25 ? '#ffaa00' : '#ff2200';
            ctx.fillRect(box.x, box.y + box.h + 30, box.w * tPct, 6);
        }

        
        if (this.state === 'MENU') {
            const menuY = H - 130;
            // dialogue box
            ctx.fillStyle   = '#000';
            ctx.strokeStyle = '#fff';
            ctx.lineWidth   = 3;
            ctx.beginPath();
            ctx.roundRect(30, menuY - 10, W - 60, 110, 4);
            ctx.fill(); ctx.stroke();

            const opts   = ['FIGHT', 'ACT', 'ITEM', 'MERCY'];
            const colors = ['#ff4444', '#ffdd00', '#44aaff', '#ff88cc'];
            const xPos   = [W*0.15, W*0.38, W*0.61, W*0.84];
            opts.forEach((label, i) => {
                const selected = i === this.menuIndex;
                ctx.font      = selected ? 'bold 22px monospace' : '18px monospace';
                ctx.fillStyle = selected ? colors[i] : '#aaaaaa';
                ctx.textAlign = 'center';
                ctx.fillText((selected ? '❯ ' : '  ') + label, xPos[i], menuY + 30);
            });

            
            ctx.fillStyle = '#888';
            ctx.font      = '12px monospace';
            ctx.textAlign = 'left';
            ctx.fillText(this.itemUsed ? '  [Grog Flask — USED]' : '  [Grog Flask x1]', 40, menuY + 65);

            
            ctx.fillStyle = '#666';
            ctx.font      = '11px monospace';
            ctx.fillText('Z / Enter to select   ←→ to move', 40, menuY + 85);
        }

        
        if (this.state === 'MESSAGE' || this.state === 'INTRO') {
            const msgY = H - 130;
            ctx.fillStyle   = '#000';
            ctx.strokeStyle = '#fff';
            ctx.lineWidth   = 3;
            ctx.beginPath();
            ctx.roundRect(30, msgY - 10, W - 60, 110, 4);
            ctx.fill(); ctx.stroke();


            this.msgTimer++;
            const charsToShow = Math.min(this.currentMsg.length, Math.floor(this.msgTimer / 1.5));
            const displayed   = this.currentMsg.slice(0, charsToShow);

            ctx.fillStyle = '#ffffff';
            ctx.font      = '16px monospace';
            ctx.textAlign = 'left';
            const lines = displayed.split('\n');
            lines.forEach((line, i) => {
                ctx.fillText(line, 50, msgY + 22 + i * 24);
            });

           
            if (charsToShow >= this.currentMsg.length && Math.floor(this.frameCount / 20) % 2 === 0) {
                ctx.fillStyle = '#ffff00';
                ctx.fillText('▼', W - 60, msgY + 85);
            }
        }

       
        if (this.state === 'WIN') {
            ctx.fillStyle   = '#000';
            ctx.fillRect(0, 0, W, H);
            ctx.fillStyle   = '#f5d060';
            ctx.font        = 'bold 48px monospace';
            ctx.textAlign   = 'center';
            ctx.fillText('YOU WON', W/2, H/2 - 40);
            ctx.fillStyle   = '#aaffaa';
            ctx.font        = '22px monospace';
            ctx.fillText('Blackbread was defeated!', W/2, H/2 + 10);
            ctx.fillStyle   = '#888';
            ctx.font        = '14px monospace';
            ctx.fillText('The seas are yours, McArchie.', W/2, H/2 + 45);
        }

        
        if (this.state === 'LOSE') {
            ctx.fillStyle = '#000';
            ctx.fillRect(0, 0, W, H);
            ctx.fillStyle = '#ff4444';
            ctx.font      = 'bold 48px monospace';
            ctx.textAlign = 'center';
            ctx.fillText('YOU DIED', W/2, H/2 - 40);
            ctx.fillStyle = '#ffaaaa';
            ctx.font      = '18px monospace';
            ctx.fillText('Blackbread was too powerful...', W/2, H/2 + 10);
            ctx.fillStyle = '#666';
            ctx.font      = '14px monospace';
            ctx.fillText('Refresh the page to try again.', W/2, H/2 + 45);
        }
    }

   
    update() {
        this.frameCount++;
        if (this.state === 'BOSS_TURN') this._updateBossTurn();
        this._render();
    }

    // Placeholder for canvas draw — rendering is handled by individual game objects
    draw()   {}
    // Placeholder for window resize — layout adjusts automatically via CSS
    resize() {}

    // Cleans up all HUD elements from the DOM and removes the global sword flag
    destroy() {
        window.removeEventListener('keydown', this._keyDown);
        window.removeEventListener('keyup',   this._keyUp);
        document.getElementById('ut-battle-canvas')?.remove();
    }
}

export default GameLevelPirateBoss;