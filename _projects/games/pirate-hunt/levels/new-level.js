import GameEnvBackground from '@assets/js/GameEnginev1.1/essentials/GameEnvBackground.js';
import Player from '@assets/js/GameEnginev1.1/essentials/Player.js';


const TILE   = 48;
const GRAV   = 0.58;
const JUMP_V = -13.8;
const PSPEED = 5.0;
const PSPEED_AIR = 4.2;

const DIFF_CFG = {
  easy:   { bbSpeed:1.6, bbAccel:0.06, beamFreq:14000, beamDmg:1, playerHp:5, bbJumpPower:0.75 },
  normal: { bbSpeed:2.4, bbAccel:0.09, beamFreq:8500,  beamDmg:1, playerHp:3, bbJumpPower:0.90 },
  hard:   { bbSpeed:3.2, bbAccel:0.13, beamFreq:5000,  beamDmg:1, playerHp:2, bbJumpPower:1.00 },
};

const ZONE_COLORS = [
  null,
  { sky:['#0a0018','#180830'], fog:'rgba(60,10,90,0.18)' },   // Zone 1 – purple night
  { sky:['#001018','#001830'], fog:'rgba(0,60,100,0.18)' },   // Zone 2 – ocean dark
  { sky:['#180800','#300800'], fog:'rgba(180,40,0,0.12)' },   // Zone 3 – hellfire
  { sky:['#000000','#0a0000'], fog:'rgba(200,0,0,0.18)' },    // Zone 4 – endgame
];

const RANK_TITLES = ['','Stowaway','Deckhand','Sailor','Bosun','Quartermaster',
                     'First Commander','Master Gunner','Captain','Admiral','Pirate King'];

const LEADERBOARD_KEY = 'pirate-hunt-leaderboard-v1';
const LEADERBOARD_SIZE = 5;

// ══════════════════════════════════════════════════════════════════════════════
// CSS — injected once, mirrors MarketPirateGame style conventions
// ══════════════════════════════════════════════════════════════════════════════
const GAME_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@400;700&family=IM+Fell+English:ital@0;1&display=swap');

/* ── SCREENS ─────────────────────────────────────────────────────────────── */
.bbc-screen{
  position:absolute;top:0;left:0;right:0;bottom:0;
  display:flex;align-items:center;justify-content:center;
  font-family:'IM Fell English',serif;z-index:9000;
}
.bbc-screen.bbc-hidden{display:none;}

/* MENU */
#bbc-menu-screen{
  background:radial-gradient(ellipse at 50% 30%,#1a0800 0%,#000 70%);
}
#bbc-menu-panel{
  display:flex;flex-direction:column;align-items:center;gap:20px;
  padding:48px 56px;
  background:linear-gradient(160deg,#1a0e04 0%,#090510 100%);
  border:3px solid #7a3a08;border-radius:20px;
  width:min(440px,92vw);
  box-shadow:0 0 100px rgba(200,120,20,.2),inset 0 0 80px rgba(0,0,0,.6);
}
#bbc-skull{font-size:72px;animation:bbcSkull 3s ease-in-out infinite;}
@keyframes bbcSkull{0%,100%{transform:translateY(0) rotate(-4deg)}50%{transform:translateY(-9px) rotate(4deg)}}
.bbc-title{
  font-family:'Cinzel Decorative',cursive;color:#e8b030;
  font-size:24px;letter-spacing:3px;text-align:center;
  text-shadow:0 0 30px rgba(240,180,20,.3);
}
.bbc-sub{color:rgba(200,160,80,.6);font-size:13px;font-style:italic;text-align:center;line-height:1.7;}
.bbc-divider{width:55%;height:1px;background:rgba(180,110,30,.25);}
.bbc-lbl{
  font-family:'Cinzel Decorative',cursive;color:#a07028;
  font-size:9px;letter-spacing:2px;align-self:flex-start;width:100%;
}
.bbc-input{
  width:100%;padding:12px 16px;
  background:rgba(0,0,0,.5);border:1.5px solid #7a4010;border-radius:8px;
  color:#f0c030;font-family:'Cinzel Decorative',cursive;
  font-size:14px;letter-spacing:1px;outline:none;transition:border-color .2s;
  box-sizing:border-box;
}
.bbc-input:focus{border-color:#e8a020;}
.bbc-input::placeholder{color:rgba(180,120,40,.35);}
.bbc-diff-row{display:flex;gap:8px;width:100%;}
.bbc-diff-btn{
  flex:1;padding:9px 4px;
  background:rgba(0,0,0,.4);border:1.5px solid rgba(180,110,30,.3);border-radius:8px;
  color:#a07028;font-family:'Cinzel Decorative',cursive;font-size:9px;
  cursor:pointer;letter-spacing:1px;transition:all .15s;
}
.bbc-diff-btn.bbc-active{
  background:rgba(140,75,8,.6);border-color:#b07010;color:#f0c030;
}
.bbc-play-btn{
  width:100%;padding:14px;
  background:rgba(140,75,8,.7);border:2px solid #b07010;border-radius:9px;
  color:#f0c030;font-family:'Cinzel Decorative',cursive;
  font-size:14px;cursor:pointer;letter-spacing:2px;
  transition:background .15s,transform .1s;
}
.bbc-play-btn:hover{background:rgba(210,120,15,.8);color:#fff;transform:scale(1.02);}
.bbc-controls{
  color:rgba(160,120,60,.45);font-size:11px;font-style:italic;
  text-align:center;line-height:1.8;
}

/* GAME OVER / WIN */
#bbc-go-screen,#bbc-win-screen{
  background:rgba(0,0,0,0);
  transition:background .8s ease;
  pointer-events:none;
}
#bbc-go-screen.bbc-show,#bbc-win-screen.bbc-show{
  background:rgba(0,0,0,.92);pointer-events:all;
}
.bbc-end-panel{
  display:flex;flex-direction:column;align-items:center;gap:16px;
  padding:48px 52px;
  background:linear-gradient(160deg,#1a0000 0%,#060006 100%);
  border:3px solid #6a0000;border-radius:20px;
  box-shadow:0 0 100px rgba(180,0,0,.4);
  opacity:0;transform:scale(.85);
  transition:opacity .7s ease .3s,transform .7s ease .3s;
}
.bbc-win-panel{
  background:linear-gradient(160deg,#001a0a 0%,#000608 100%);
  border-color:#006a30;box-shadow:0 0 100px rgba(0,180,80,.3);
}
#bbc-go-screen.bbc-show .bbc-end-panel,
#bbc-win-screen.bbc-show .bbc-end-panel{opacity:1;transform:scale(1);}
.bbc-end-icon{font-size:70px;animation:bbcSkull 3s ease-in-out infinite;}
.bbc-end-title{
  font-family:'Cinzel Decorative',cursive;font-size:26px;letter-spacing:3px;
  color:#cc0000;text-shadow:0 0 40px rgba(200,0,0,.8);
}
.bbc-win-title{color:#30cc70;text-shadow:0 0 40px rgba(0,200,80,.8);}
.bbc-end-sub{color:rgba(200,140,100,.7);font-size:13px;font-style:italic;text-align:center;line-height:1.7;max-width:300px;}
.bbc-end-stats{
  display:flex;gap:24px;padding:14px 20px;
  background:rgba(0,0,0,.4);border:1px solid rgba(150,50,50,.3);border-radius:10px;
}
.bbc-e-stat{display:flex;flex-direction:column;align-items:center;gap:4px;}
.bbc-e-val{font-family:'Cinzel Decorative',cursive;color:#e8a020;font-size:20px;}
.bbc-e-lbl{color:rgba(180,130,80,.6);font-size:9px;font-family:'Cinzel Decorative',cursive;letter-spacing:1px;}
.bbc-end-btn{
  margin-top:6px;padding:13px 40px;
  background:rgba(140,0,0,.7);border:2px solid #aa0000;border-radius:10px;
  color:#ff6060;font-family:'Cinzel Decorative',cursive;
  font-size:13px;cursor:pointer;letter-spacing:2px;
  transition:background .2s,transform .15s;
}
.bbc-win-btn{background:rgba(0,120,50,.7);border-color:#00aa50;color:#60ff90;}
.bbc-end-btn:hover{background:rgba(200,20,20,.8);color:#fff;transform:scale(1.04);}
.bbc-win-btn:hover{background:rgba(0,180,70,.8);color:#fff;}

/* HUD BAR */
#bbc-hud{
  position:absolute;bottom:0;left:0;right:0;height:60px;
  display:none;align-items:stretch;
  background:rgba(6,3,1,0.97);border-top:1.5px solid #5a2e06;
  z-index:8900;font-family:'Cinzel Decorative',cursive;
}
#bbc-hud.bbc-hud-visible{display:flex;}
.bbc-h-seg{display:flex;align-items:center;gap:9px;padding:0 16px;border-right:1px solid rgba(100,50,8,0.35);flex-shrink:0;}
.bbc-h-grow{flex:1;display:flex;align-items:center;justify-content:center;padding:0 12px;}
.bbc-h-col{display:flex;flex-direction:column;gap:2px;}
.bbc-h-lbl{font-size:8px;color:#aaa;letter-spacing:1.5px;}
.bbc-h-val{font-size:13px;color:#f0c030;line-height:1;}
.bbc-h-green{color:#38d068;}.bbc-h-red{color:#e03020;}.bbc-h-blue{color:#4090e0;}
.bbc-h-bar-wrap{width:90px;}
.bbc-h-track{height:6px;background:rgba(0,0,0,.65);border-radius:3px;overflow:hidden;}
.bbc-h-fill{height:100%;border-radius:3px;transition:width .25s ease;}
.bbc-fill-hp-hi{background:linear-gradient(90deg,#1a8040,#30d060);}
.bbc-fill-hp-md{background:linear-gradient(90deg,#806018,#c09028);}
.bbc-fill-hp-lo{background:linear-gradient(90deg,#801818,#c03020);}
.bbc-fill-bb{background:linear-gradient(90deg,#8a1010,#e03020);}
.bbc-fill-prog{background:linear-gradient(90deg,#1a50a0,#4090e0);}
.bbc-h-sub{font-size:7.5px;color:#888;letter-spacing:.5px;}
.bbc-h-icon{width:26px;height:26px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:13px;}
.bbc-h-icon-hp{background:rgba(20,120,50,.3);border:1.5px solid rgba(40,180,80,.45);}
.bbc-h-icon-bb{background:rgba(160,20,20,.3);border:1.5px solid rgba(220,60,60,.5);}
.bbc-h-divider{width:1px;background:rgba(100,50,8,.35);align-self:stretch;margin:8px 0;flex-shrink:0;}
.bbc-h-hint{font-size:9px;color:#9a6020;letter-spacing:1px;text-align:center;line-height:1.5;}

/* BEAM WARNING */
#bbc-beam-warn{
  position:absolute;top:20px;left:50%;transform:translateX(-50%);
  font-family:'Cinzel Decorative',cursive;font-size:13px;letter-spacing:2px;
  color:#ff4020;text-shadow:0 0 20px rgba(255,80,20,.8);
  padding:7px 20px;background:rgba(120,10,0,.88);
  border:1.5px solid #c03010;border-radius:8px;
  z-index:8950;opacity:0;transition:opacity .2s;pointer-events:none;
}
#bbc-beam-warn.bbc-warn-show{opacity:1;}

.bbc-leaderboard-wrapper{
  width:100%;max-width:340px;
  border:1px solid rgba(180,140,80,0.25);
  border-radius:14px;
  padding:14px 16px;
  display:flex;
  flex-direction:column;
  gap:10px;
  background:rgba(0,0,0,0.33);
}
.bbc-leaderboard-title{
  font-family:'Cinzel Decorative',cursive;
  font-size:13px;
  letter-spacing:1.5px;
  text-align:center;
  color:#f0c030;
}
.bbc-leaderboard-list{
  display:flex;
  flex-direction:column;
  gap:8px;
}
.bbc-leaderboard-entry{
  display:grid;
  grid-template-columns:24px minmax(0,1fr) auto;
  gap:10px;
  align-items:center;
  font-size:12px;
  color:#f4e2a3;
}
.bbc-leaderboard-rank{
  font-weight:700;
  color:#ffd670;
}
.bbc-leaderboard-meta{
  text-align:right;
  color:#d7c28c;
}
.bbc-leaderboard-empty{
  color:rgba(235,215,175,0.75);
  font-size:12px;
  text-align:center;
}

/* FLOATING LEADERBOARD */
#bbc-floating-lb{
  position:fixed;right:16px;top:60px;z-index:8880;
  width:320px;max-height:calc(100vh - 90px);
  background:linear-gradient(145deg,rgba(20,10,5,0.94),rgba(10,5,2,0.96));
  border:2px solid rgba(200,140,60,0.4);border-radius:12px;
  padding:12px;display:flex;flex-direction:column;gap:10px;
  box-shadow:0 0 40px rgba(0,0,0,0.7),inset 0 0 20px rgba(200,100,0,0.05);
  font-family:'IM Fell English',serif;color:#f4e2a3;
  transition:right 0.3s ease,opacity 0.3s ease;
}
#bbc-floating-lb-header{
  display:flex;align-items:center;justify-content:center;gap:8px;
  padding-bottom:8px;border-bottom:1px solid rgba(200,140,60,0.2);
}
#bbc-floating-lb-title{
  font-family:'Cinzel Decorative',cursive;font-size:13px;letter-spacing:1.5px;
  color:#f0c030;text-shadow:0 0 15px rgba(255,200,0,0.2);
}
#bbc-floating-lb-body{
  display:flex;flex-direction:column;gap:6px;overflow-y:auto;max-height:280px;
  padding-right:4px;
}
#bbc-floating-lb-body::-webkit-scrollbar{width:6px;}
#bbc-floating-lb-body::-webkit-scrollbar-track{background:rgba(0,0,0,0.2);border-radius:3px;}
#bbc-floating-lb-body::-webkit-scrollbar-thumb{background:rgba(200,140,60,0.3);border-radius:3px;}
#bbc-floating-lb-body::-webkit-scrollbar-thumb:hover{background:rgba(200,140,60,0.5);}
.bbc-floating-entry{
  display:grid;grid-template-columns:20px minmax(0,1fr) auto;gap:8px;
  align-items:center;font-size:11px;padding:8px;background:rgba(0,0,0,0.3);
  border:1px solid rgba(200,140,60,0.15);border-radius:6px;transition:background 0.2s;
}
.bbc-floating-entry:hover{background:rgba(200,140,60,0.15);}
.bbc-floating-rank{font-weight:700;color:#ffd670;width:20px;text-align:center;}
.bbc-floating-name{color:#f0c030;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
.bbc-floating-score{color:#d7c28c;text-align:right;white-space:nowrap;font-size:10px;}
.bbc-floating-empty{
  color:rgba(235,215,175,0.5);font-size:10px;text-align:center;padding:20px 8px;
  font-style:italic;
}

/* ZONE FLASH */
#bbc-zone-flash{
  position:absolute;inset:0;z-index:8960;
  display:flex;align-items:center;justify-content:center;
  pointer-events:none;opacity:0;transition:opacity .3s;
}
#bbc-zone-flash.bbc-flash-show{opacity:1;}
#bbc-zone-inner{
  font-family:'Cinzel Decorative',cursive;font-size:32px;
  color:#f5c030;letter-spacing:4px;
  text-shadow:0 0 40px rgba(255,200,0,.9);
  animation:bbcZonePop .6s ease;
}
@keyframes bbcZonePop{0%{transform:scale(.5)}60%{transform:scale(1.14)}100%{transform:scale(1)}}

/* CANVAS */
#bbc-canvas{
  display:none;
  position:absolute;
  top:0;left:0;
  width:100%;
  height:100%;
  image-rendering:pixelated;
  background:#000;
  border:2px solid #333;
}
#bbc-canvas.bbc-canvas-visible{display:block;}
`;

// ══════════════════════════════════════════════════════════════════════════════
// SPLINE HELPERS
// ══════════════════════════════════════════════════════════════════════════════
function catmullRom(t, p0, p1, p2, p3) {
  const t2 = t*t, t3 = t*t*t;
  return {
    x: 0.5*((2*p1.x)+(-p0.x+p2.x)*t+(2*p0.x-5*p1.x+4*p2.x-p3.x)*t2+(-p0.x+3*p1.x-3*p2.x+p3.x)*t3),
    y: 0.5*((2*p1.y)+(-p0.y+p2.y)*t+(2*p0.y-5*p1.y+4*p2.y-p3.y)*t2+(-p0.y+3*p1.y-3*p2.y+p3.y)*t3),
  };
}

function buildBeamSpline(from, to) {
  // Catmull-Rom needs 4 control points; we synthesise dramatic curve points
  const dx = to.x - from.x, dy = to.y - from.y;
  const perp = { x: -dy * 0.3, y: dx * 0.3 };
  const p0 = { x: from.x - dx*0.1, y: from.y - dy*0.1 };
  const p1 = { x: from.x, y: from.y };
  const p2 = { x: from.x + dx*0.4 + perp.x, y: from.y + dy*0.4 + perp.y };
  const p3 = { x: from.x + dx*0.75 - perp.x*0.5, y: from.y + dy*0.75 - perp.y*0.5 };
  const p4 = { x: to.x, y: to.y };
  const p5 = { x: to.x + dx*0.1, y: to.y + dy*0.1 };
  return [p0, p1, p2, p3, p4, p5]; // sample between indices 1..4
}

function sampleBeam(spline, t) {
  // t in [0,1] — samples segments p1→p2→p3→p4
  const seg = Math.min(2, Math.floor(t * 3));
  const lt  = (t * 3) - seg;
  return catmullRom(lt, spline[seg], spline[seg+1], spline[seg+2], spline[seg+3]);
}

// ══════════════════════════════════════════════════════════════════════════════
// LEVEL BUILDER
// ══════════════════════════════════════════════════════════════════════════════
function buildLevel() {
  const platforms = [];
  const spikes    = [];
  const coins     = [];

  const ground = (x, w)    => platforms.push({ x, y:560, w, h:TILE, solid:true });
  const plat   = (x, y, w) => platforms.push({ x, y, w, h:TILE/2, solid:true });
  const spike  = (x, y, w) => spikes.push({ x, y, w, h:22 });
  const coin   = (x, y)    => coins.push({ x, y, r:11, col:false });
  const endPlat= (x, y, w) => platforms.push({ x, y, w, h:TILE, solid:true, isEnd:true });

  // ── Zone 1: Introduction ──────────────────────────────────────────────────
  for (let i = 0; i < 13; i++) ground(i*TILE, TILE);
  plat(2*TILE,  420, 3*TILE); coin(2.5*TILE, 392);
  plat(6*TILE,  340, 2*TILE); coin(6.5*TILE, 312);
  plat(9*TILE,  260, 3*TILE); coin(10*TILE,  232);
  ground(12*TILE, 4*TILE);
  spike(13*TILE, 560-22, TILE);
  plat(17*TILE, 380, 2*TILE); coin(17.5*TILE, 352);
  ground(18*TILE, 4*TILE);
  spike(19*TILE, 560-22, TILE);

  // Gap crossing
  plat(23*TILE, 510, 3*TILE); coin(23.5*TILE, 482);
  plat(27*TILE, 450, 2*TILE);
  plat(30*TILE, 380, 2*TILE); coin(30.5*TILE, 352);
  plat(33*TILE, 320, TILE);
  plat(35*TILE, 260, 2*TILE); coin(35.5*TILE, 232);
  ground(36*TILE, 5*TILE);
  spike(37*TILE, 560-22, TILE);
  spike(38*TILE, 560-22, TILE);

  // ── Zone 2: Rope bridges + tighter jumps ─────────────────────────────────
  ground(43*TILE, 3*TILE);
  plat(47*TILE, 490, 2*TILE); coin(47.5*TILE, 462);
  plat(50*TILE, 410, 3*TILE); coin(51*TILE,   382);
  plat(54*TILE, 330, 2*TILE);
  plat(57*TILE, 250, 3*TILE); coin(58*TILE,   222);
  plat(61*TILE, 310, 2*TILE);
  ground(63*TILE, 4*TILE);
  spike(64*TILE, 560-22, TILE); spike(65*TILE, 560-22, TILE);
  plat(68*TILE, 430, 2*TILE); coin(68.5*TILE, 402);
  plat(71*TILE, 350, 2*TILE);
  plat(74*TILE, 270, 2*TILE); coin(74.5*TILE, 242);
  ground(75*TILE, 3*TILE);
  spike(76*TILE, 560-22, TILE);

  // ── Zone 3: Hellfire — tricky single-tile hops ───────────────────────────
  plat(80*TILE, 510, 2*TILE); coin(80.5*TILE, 482);
  plat(83*TILE, 450, TILE);   coin(83.5*TILE, 422);
  plat(85*TILE, 385, TILE);   coin(85.5*TILE, 357);
  plat(87*TILE, 310, TILE);
  plat(89*TILE, 245, 2*TILE); coin(89.5*TILE, 217);
  plat(92*TILE, 290, TILE);
  plat(94*TILE, 335, 2*TILE);
  ground(96*TILE, 3*TILE);
  spike(97*TILE, 560-22, TILE); spike(98*TILE, 560-22, TILE); spike(99*TILE, 560-22, TILE);
  plat(101*TILE, 490, 2*TILE);
  plat(104*TILE, 410, 2*TILE); coin(104.5*TILE, 382);
  plat(107*TILE, 330, 2*TILE); coin(107.5*TILE, 302);
  plat(110*TILE, 250, 2*TILE); coin(110.5*TILE, 222);
  ground(111*TILE, 3*TILE);

  // ── Zone 4: Final gauntlet ────────────────────────────────────────────────
  plat(116*TILE, 490, TILE); coin(116.5*TILE, 462);
  plat(118*TILE, 415, TILE);
  plat(120*TILE, 335, TILE);
  plat(122*TILE, 255, TILE); coin(122.5*TILE, 227);
  plat(124*TILE, 315, TILE);
  plat(126*TILE, 375, 2*TILE);
  ground(128*TILE, 2*TILE);
  spike(129*TILE, 560-22, TILE);
  plat(131*TILE, 430, 2*TILE); coin(131.5*TILE, 402);
  plat(134*TILE, 350, 2*TILE); coin(134.5*TILE, 322);
  plat(137*TILE, 270, 2*TILE); coin(137.5*TILE, 242);
  ground(139*TILE, 4*TILE);
  spike(140*TILE, 560-22, TILE); spike(141*TILE, 560-22, TILE);

  // End platform + flag zone
  endPlat(144*TILE, 390, 5*TILE);
  ground(144*TILE, 5*TILE);

  const WORLD_W = 150*TILE;
  const END_X   = 146*TILE;
  const END_Y   = 340;
  return { platforms, spikes, coins, worldW: WORLD_W, endX: END_X, endY: END_Y };
}

// ══════════════════════════════════════════════════════════════════════════════
// AABB collision
// ══════════════════════════════════════════════════════════════════════════════
function rectsOverlap(ax,ay,aw,ah, bx,by,bw,bh) {
  return ax < bx+bw && ax+aw > bx && ay < by+bh && ay+ah > by;
}

// ══════════════════════════════════════════════════════════════════════════════
// BLACKBEARD CHASE GAME
// ══════════════════════════════════════════════════════════════════════════════
class newlevel {
  constructor(gameEnv) {
    this.gameEnv = gameEnv;
    this.path    = gameEnv.path;

    // These satisfy the game engine's class-scanning expectations
    this.classes = [
      { class: GameEnvBackground, data: {
        name: 'blackbeard-chase',
        src:  this.path + '/images/MarketPlaceRPG.png',
        pixels: { height: 580, width: 1038 },
      }},
    ];

    this._injectCSS();
    this._buildDOM();
    this._bindMenuEvents();

    this._gameActive  = false;
    this._playerName  = 'Sailor';
    this._difficulty  = 'normal';
    this._raf         = null;
    this._lastTs      = 0;

    // Input state
    this._keys = {};
    this._keyDown = (e) => { this._keys[e.code] = true; };
    this._keyUp   = (e) => { this._keys[e.code] = false; };
    window.addEventListener('keydown', this._keyDown);
    window.addEventListener('keyup',   this._keyUp);
  }

  // ── CSS & DOM ─────────────────────────────────────────────────────────────
  _injectCSS() {
    if (document.getElementById('bbc-style')) return;
    const s = document.createElement('style');
    s.id = 'bbc-style';
    s.textContent = GAME_CSS;
    document.head.appendChild(s);
  }

  _loadLeaderboard() {
    try {
      return JSON.parse(localStorage.getItem(LEADERBOARD_KEY) || '[]');
    } catch (e) {
      console.warn('Leaderboard load failed:', e);
      return [];
    }
  }

  _saveLeaderboard(scores) {
    try {
      localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(scores.slice(0, LEADERBOARD_SIZE)));
    } catch (e) {
      console.warn('Leaderboard save failed:', e);
    }
  }

  _addLeaderboardEntry(name, time, coins, difficulty) {
    const entry = { name, time, coins, difficulty, when: Date.now() };
    const scores = this._loadLeaderboard();
    scores.push(entry);
    scores.sort((a, b) => {
      if (a.time !== b.time) return a.time - b.time;
      return b.coins - a.coins;
    });
    this._saveLeaderboard(scores);
    return scores.slice(0, LEADERBOARD_SIZE);
  }

  _renderLeaderboard() {
    const list = document.getElementById('bbc-leaderboard-list');
    if (!list) return;
    const scores = this._loadLeaderboard();
    if (!scores.length) {
      list.innerHTML = '<div class="bbc-leaderboard-empty">No results yet. Finish the game to add a score.</div>';
      return;
    }

    list.innerHTML = scores.map((entry, index) => {
      return `
        <div class="bbc-leaderboard-entry">
          <div class="bbc-leaderboard-rank">${index + 1}</div>
          <div class="bbc-leaderboard-name">${entry.name}</div>
          <div class="bbc-leaderboard-meta">${Math.floor(entry.time)}s · ${entry.coins}⚓</div>
        </div>
      `;
    }).join('');
  }

  _submitLeaderboard() {
    const name = this._playerName || 'Sailor';
    const scores = this._addLeaderboardEntry(name, Math.floor(this._elapsed), this._coinsGot, this._difficulty);
    this._renderLeaderboard();
    this._updateFloatingLeaderboard();
    const top = scores[0];
    if (top && top.name === name && top.time === Math.floor(this._elapsed) && top.coins === this._coinsGot) {
      document.getElementById('bbc-win-sub').textContent = `New leaderboard entry! ${name} — ${Math.floor(this._elapsed)}s, ${this._coinsGot}⚓`;
    } else {
      document.getElementById('bbc-win-sub').textContent = `Score saved: ${name} — ${Math.floor(this._elapsed)}s, ${this._coinsGot}⚓`;
    }
  }

  _updateFloatingLeaderboard() {
    const body = document.getElementById('bbc-floating-lb-body');
    if (!body) return;
    const scores = this._loadLeaderboard();
    if (!scores.length) {
      body.innerHTML = '<div class="bbc-floating-empty">No scores yet</div>';
      return;
    }
    body.innerHTML = scores.map((entry, index) => {
      return `
        <div class="bbc-floating-entry">
          <div class="bbc-floating-rank">${index + 1}</div>
          <div class="bbc-floating-name">${entry.name.substring(0, 12)}</div>
          <div class="bbc-floating-score">${Math.floor(entry.time)}s</div>
        </div>
      `;
    }).join('');
  }

  _buildDOM() {
    this._root = this.gameEnv?.gameContainer || document.body;

    // ── Menu ──
    this._menuScreen = this._el('div', 'bbc-screen', 'bbc-menu-screen');
    this._menuScreen.innerHTML = `
      <div id="bbc-menu-panel">
        <div id="bbc-skull">☠️</div>
        <div class="bbc-title">Blackbeard's Wrath</div>
        <div class="bbc-sub">The cursed captain has risen.<br>Run, sailor — or be consumed by darkness.</div>
        <div class="bbc-divider"></div>
        <div class="bbc-lbl">YOUR PIRATE NAME</div>
        <input class="bbc-input" id="bbc-name-input" type="text" maxlength="16"
               placeholder="Enter thy name..." autocomplete="off" spellcheck="false">
        <div class="bbc-lbl" style="margin-top:4px;">DIFFICULTY</div>
        <div class="bbc-diff-row">
          <button class="bbc-diff-btn" data-diff="easy">🌊 Easy</button>
          <button class="bbc-diff-btn bbc-active" data-diff="normal">⚔ Normal</button>
          <button class="bbc-diff-btn" data-diff="hard">☠ Hard</button>
        </div>
        <button class="bbc-play-btn" id="bbc-start-btn">⚓ Set Sail</button>
        <div class="bbc-leaderboard-wrapper" id="bbc-leaderboard-wrapper">
          <div class="bbc-leaderboard-title">Leader Board</div>
          <div id="bbc-leaderboard-list" class="bbc-leaderboard-list"></div>
          <button class="bbc-end-btn bbc-reset-lb-btn" id="bbc-reset-lb-btn">🗑️ Clear Leaderboard</button>
        </div>
        <div class="bbc-controls">
          WASD / Arrow Keys · Space / W to jump · Double-jump allowed<br>
          Reach the <span style="color:#f0c030">⚑ END FLAG</span> to escape Blackbeard!
        </div>
      </div>`;
    this._root.appendChild(this._menuScreen);

    // ── Game Over ──
    this._goScreen = this._el('div', 'bbc-screen bbc-hidden', 'bbc-go-screen');
    this._goScreen.innerHTML = `
      <div class="bbc-end-panel">
        <div class="bbc-end-icon">💀</div>
        <div class="bbc-end-title">DEFEATED</div>
        <div class="bbc-end-sub" id="bbc-go-sub">Blackbeard's curse consumed thee...</div>
        <div class="bbc-end-stats">
          <div class="bbc-e-stat"><div class="bbc-e-val" id="bbc-go-zone">1</div><div class="bbc-e-lbl">Zone</div></div>
          <div class="bbc-e-stat"><div class="bbc-e-val" id="bbc-go-time">0s</div><div class="bbc-e-lbl">Survived</div></div>
          <div class="bbc-e-stat"><div class="bbc-e-val" id="bbc-go-coins">0</div><div class="bbc-e-lbl">Coins</div></div>
        </div>
        <button class="bbc-end-btn" id="bbc-retry-btn">⚓ Try Again</button>
      </div>`;
    this._root.appendChild(this._goScreen);

    // ── Win ──
    this._winScreen = this._el('div', 'bbc-screen bbc-hidden', 'bbc-win-screen');
    this._winScreen.innerHTML = `
      <div class="bbc-end-panel bbc-win-panel">
        <div class="bbc-end-icon">🏴‍☠️</div>
        <div class="bbc-end-title bbc-win-title">ESCAPED!</div>
        <div class="bbc-end-sub">Ye outran the cursed captain!<br>The seas are yours, <span id="bbc-win-name">sailor</span>.</div>
        <div class="bbc-end-stats">
          <div class="bbc-e-stat"><div class="bbc-e-val" id="bbc-win-time">0s</div><div class="bbc-e-lbl">Time</div></div>
          <div class="bbc-e-stat"><div class="bbc-e-val" id="bbc-win-coins">0</div><div class="bbc-e-lbl">Coins</div></div>
          <div class="bbc-e-stat"><div class="bbc-e-val" id="bbc-win-hits">0</div><div class="bbc-e-lbl">Hits Taken</div></div>
        </div>
        <button class="bbc-end-btn bbc-win-btn" id="bbc-again-btn">🌊 Play Again</button>
      </div>`;
    this._root.appendChild(this._winScreen);

    // ── Canvas ──
    this._canvas = this._el('canvas', '', 'bbc-canvas');
    this._root.appendChild(this._canvas);
    this._ctx = this._canvas.getContext('2d');

    // ── HUD ──
    this._hud = this._el('div', '', 'bbc-hud');
    this._hud.innerHTML = `
      <div class="bbc-h-seg">
        <div class="bbc-h-icon bbc-h-icon-hp">♥</div>
        <div class="bbc-h-col">
          <div class="bbc-h-lbl">HEALTH</div>
          <div class="bbc-h-bar-wrap">
            <div class="bbc-h-track"><div class="bbc-h-fill bbc-fill-hp-hi" id="bbc-hp-bar" style="width:100%"></div></div>
          </div>
          <div class="bbc-h-sub" id="bbc-hp-text">3 / 3</div>
        </div>
      </div>
      <div class="bbc-h-divider"></div>
      <div class="bbc-h-seg">
        <div class="bbc-h-icon bbc-h-icon-bb">☠</div>
        <div class="bbc-h-col">
          <div class="bbc-h-lbl">BLACKBEARD</div>
          <div class="bbc-h-bar-wrap">
            <div class="bbc-h-track"><div class="bbc-h-fill bbc-fill-bb" id="bbc-bb-bar" style="width:5%"></div></div>
          </div>
          <div class="bbc-h-sub" id="bbc-bb-text">Far away</div>
        </div>
      </div>
      <div class="bbc-h-divider"></div>
      <div class="bbc-h-seg">
        <div class="bbc-h-col">
          <div class="bbc-h-lbl">ZONE</div>
          <div class="bbc-h-val" id="bbc-zone-val">1</div>
        </div>
      </div>
      <div class="bbc-h-divider"></div>
      <div class="bbc-h-seg">
        <div class="bbc-h-col">
          <div class="bbc-h-lbl">TIME</div>
          <div class="bbc-h-val" id="bbc-time-val">0s</div>
        </div>
      </div>
      <div class="bbc-h-divider"></div>
      <div class="bbc-h-seg">
        <div class="bbc-h-col">
          <div class="bbc-h-lbl">COINS</div>
          <div class="bbc-h-val bbc-h-green" id="bbc-coin-val">0</div>
        </div>
      </div>
      <div class="bbc-h-divider"></div>
      <div class="bbc-h-seg" style="margin-left:auto;">
        <div class="bbc-h-col">
          <div class="bbc-h-lbl">PROGRESS</div>
          <div class="bbc-h-bar-wrap">
            <div class="bbc-h-track"><div class="bbc-h-fill bbc-fill-prog" id="bbc-prog-bar" style="width:0%"></div></div>
          </div>
          <div class="bbc-h-sub" id="bbc-prog-text">0%</div>
        </div>
      </div>`;
    this._root.appendChild(this._hud);

    // ── Beam warning ──
    this._beamWarn = this._el('div', '', 'bbc-beam-warn');
    this._beamWarn.textContent = '☠ BEAM INCOMING ☠';
    this._root.appendChild(this._beamWarn);

    // ── Zone flash ──
    this._zoneFlash = this._el('div', '', 'bbc-zone-flash');
    this._zoneFlash.innerHTML = '<div id="bbc-zone-inner"></div>';
    this._root.appendChild(this._zoneFlash);

    // ── Floating leaderboard ──
    this._floatingLb = this._el('div', '', 'bbc-floating-lb');
    this._floatingLb.innerHTML = `
      <div id="bbc-floating-lb-header">
        <div id="bbc-floating-lb-title">⚓ Leaderboard</div>
      </div>
      <div id="bbc-floating-lb-body"></div>
    `;
    this._root.appendChild(this._floatingLb);

    this._renderLeaderboard();
  }

  _el(tag, cls, id) {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (id)  e.id = id;
    return e;
  }

  // ── Menu events ───────────────────────────────────────────────────────────
  _bindMenuEvents() {
    setTimeout(() => document.getElementById('bbc-name-input')?.focus(), 80);

    document.getElementById('bbc-start-btn').addEventListener('click', () => this._startGame());
    document.getElementById('bbc-name-input').addEventListener('keydown', e => {
      if (e.key === 'Enter') this._startGame();
    });

    this._menuScreen.querySelectorAll('.bbc-diff-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this._menuScreen.querySelectorAll('.bbc-diff-btn').forEach(b => b.classList.remove('bbc-active'));
        btn.classList.add('bbc-active');
        this._difficulty = btn.dataset.diff;
      });
    });

    const resetBtn = document.getElementById('bbc-reset-lb-btn');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        this._saveLeaderboard([]);
        this._renderLeaderboard();
      });
    }
  }

  _startGame() {
    try {
      const raw = document.getElementById('bbc-name-input')?.value?.trim() || '';
      this._playerName = (raw.length > 0 && /[a-zA-Z0-9]/.test(raw)) ? raw : 'Sailor';

      const menu = document.getElementById('bbc-menu-screen');
      const canvas = document.getElementById('bbc-canvas');
      const hud = document.getElementById('bbc-hud');
      if (!menu || !canvas || !hud) {
        console.error('Game elements not found');
        return;
      }

      menu.classList.add('bbc-hidden');
      canvas.classList.add('bbc-canvas-visible');
      hud.classList.add('bbc-hud-visible');

      this._updateFloatingLeaderboard();
      this._resizeCanvas();
      this._initGameState();
      this._gameActive = true;
      this._lastTs = performance.now();
      this._startTs = performance.now();
      cancelAnimationFrame(this._raf);
      this._raf = requestAnimationFrame(ts => this._tick(ts));
    } catch (e) {
      console.error('Failed to start game:', e);
    }
  }

  _resizeCanvas() {
    const parent = this._canvas.parentElement;
    if (parent) {
      const bounds = parent.getBoundingClientRect();
      this._canvas.width  = Math.max(320, Math.floor(bounds.width));
      this._canvas.height = Math.max(240, Math.floor(bounds.height));
    } else {
      this._canvas.width  = window.innerWidth;
      this._canvas.height = window.innerHeight - 60;
    }
    this._W = this._canvas.width;
    this._H = this._canvas.height;
  }

  // ── Game State Init ───────────────────────────────────────────────────────
  _initGameState() {
    const cfg = DIFF_CFG[this._difficulty] || DIFF_CFG.normal;
    this._cfg = cfg;

    const lvl = buildLevel();
    this._platforms = lvl.platforms;
    this._spikes    = lvl.spikes;
    this._coins     = lvl.coins.map(c => ({ ...c, col: false }));
    this._worldW    = lvl.worldW;
    this._endX      = lvl.endX;
    this._endY      = lvl.endY;

    // Player
    this._p = {
      x: 80, y: 470,
      vx: 0, vy: 0,
      w: 30, h: 40,
      onGround: false,
      jumpsLeft: 2,
      hp: cfg.playerHp, maxHp: cfg.playerHp,
      iframes: 0,
      facing: 1,
      animFrame: 0, animTimer: 0,
      zone: 1,
    };

    // Smooth camera
    this._cam = { x: 0, y: 0, tx: 0, ty: 0 };

    // Blackbeard
    this._bb = {
      x: -200, y: 470,
      vx: 0, vy: 0,
      w: 44, h: 56,
      onGround: false,
      speed: cfg.bbSpeed,
      facing: 1,
      animFrame: 0, animTimer: 0,
      jumpCooldown: 0,
      stuckTimer: 0,
      lastX: -200,
      rage: 1.0,   // increases as player progresses
    };

    // Beam
    this._beamCharge  = null;  // { timer, maxTimer, targetX, targetY }
    this._beam        = null;  // { spline, timer, maxTimer, width }
    this._lastBeamTs  = performance.now() + 4000; // grace period at start
    this._beamParticles = [];

    // Particles
    this._particles = [];

    // Stars (background)
    this._stars = Array.from({length:80}, () => ({
      x: Math.random() * this._worldW,
      y: Math.random() * 300,
      r: Math.random() * 1.8 + 0.3,
      b: Math.random(),
    }));

    // Timers / stats
    this._startTs  = performance.now();
    this._elapsed  = 0;
    this._hitsTaken = 0;
    this._coinsGot  = 0;
    this._won       = false;
    this._dead      = false;
    this._deathCause = '';

    this._showZoneFlash(1);
    this._updateHUD();
  }

  // ══════════════════════════════════════════════════════════════════════════
  // MAIN LOOP
  // ══════════════════════════════════════════════════════════════════════════
  _tick(ts) {
    if (!this._gameActive) return;
    const dt = Math.min((ts - this._lastTs) / 16.67, 3); // normalised to 60fps
    this._lastTs = ts;
    this._elapsed = (ts - this._startTs) / 1000;

    this._update(dt);
    this._draw();
    this._updateHUD();

    if (!this._dead && !this._won) {
      this._raf = requestAnimationFrame(ts2 => this._tick(ts2));
    }
  }

  // ══════════════════════════════════════════════════════════════════════════
  // UPDATE
  // ══════════════════════════════════════════════════════════════════════════
  _update(dt) {
    this._updatePlayer(dt);
    this._updateBlackbeard(dt);
    this._updateBeam(dt);
    this._updateParticles(dt);
    this._checkZone();
    this._updateCamera(dt);
  }

  // ── Player ────────────────────────────────────────────────────────────────
  _updatePlayer(dt) {
    const p = this._p;
    const left  = this._keys['ArrowLeft']  || this._keys['KeyA'];
    const right = this._keys['ArrowRight'] || this._keys['KeyD'];
    const jump  = this._keys['Space']      || this._keys['ArrowUp'] || this._keys['KeyW'];

    // Horizontal — smooth acceleration
    const targetVx = right ? PSPEED : left ? -PSPEED : 0;
    const accel = p.onGround ? 0.22 : 0.12;
    p.vx += (targetVx - p.vx) * accel * dt;
    if (Math.abs(p.vx) < 0.05) p.vx = 0;
    if (right) p.facing =  1;
    if (left)  p.facing = -1;

    // Walking particles — spawn dust when moving on ground
    if (p.onGround && Math.abs(p.vx) > 1.5 && Math.random() < 0.15) {
      const dustX = p.x + p.w/2 + (Math.random()-0.5)*10;
      const dustY = p.y + p.h + 2;
      this._spawnParticles(dustX, dustY, '#9a7d6e', 2, 0.3);
    }

    // Jump — jump buffer so it feels snappy
    if (jump && !this._jumpHeld && p.jumpsLeft > 0) {
      p.vy = JUMP_V * (p.jumpsLeft === 2 ? 1.0 : 0.88);
      p.jumpsLeft--;
      p.onGround = false;
    }
    this._jumpHeld = jump;

    // Gravity
    p.vy += GRAV * dt;
    if (p.vy > 22) p.vy = 22;

    // Move & collide
    p.x += p.vx * dt;
    this._collideH(p);
    p.y += p.vy * dt;
    p.onGround = false;
    this._collideV(p);

    // World bounds
    if (p.x < 0) p.x = 0;
    if (p.x + p.w > this._worldW) p.x = this._worldW - p.w;

    // Fell off world
    if (p.y > 700) {
      this._die('The abyss claimed thee...');
      return;
    }

    // Spikes
    for (const s of this._spikes) {
      if (rectsOverlap(p.x, p.y, p.w, p.h, s.x, s.y, s.w, s.h)) {
        this._hitPlayer('Impaled on cursed spikes...', true);
        break;
      }
    }

    // Coins
    for (const c of this._coins) {
      if (!c.col && Math.hypot(p.x+p.w/2-c.x, p.y+p.h/2-c.y) < c.r + 18) {
        c.col = true;
        this._coinsGot++;
        this._spawnParticles(c.x, c.y, '#f0c030', 10, 0.8);
      }
    }

    // End flag
    if (!this._won && p.x + p.w > this._endX && p.x < this._endX + 80
     && p.y + p.h > this._endY && p.y < this._endY + 120) {
      this._win();
    }

    // Iframes tick
    if (p.iframes > 0) p.iframes -= dt;

    // Animation
    p.animTimer += dt;
    if (p.animTimer > 6) { p.animTimer = 0; p.animFrame = (p.animFrame+1) % 4; }
  }

  _collideH(obj) {
    for (const plat of this._platforms) {
      if (rectsOverlap(obj.x, obj.y+2, obj.w, obj.h-4, plat.x, plat.y, plat.w, plat.h)) {
        if (obj.vx > 0) obj.x = plat.x - obj.w;
        else if (obj.vx < 0) obj.x = plat.x + plat.w;
        obj.vx = 0;
      }
    }
  }

  _collideV(obj) {
    for (const plat of this._platforms) {
      if (rectsOverlap(obj.x+2, obj.y, obj.w-4, obj.h, plat.x, plat.y, plat.w, plat.h)) {
        if (obj.vy > 0 && obj.y + obj.h - obj.vy*2 <= plat.y + 4) {
          obj.y = plat.y - obj.h;
          obj.vy = 0;
          obj.onGround = true;
          if (obj === this._p) obj.jumpsLeft = 2;
        } else if (obj.vy < 0) {
          obj.y = plat.y + plat.h;
          obj.vy = 0;
        }
      }
    }
  }

  // ── Blackbeard AI ─────────────────────────────────────────────────────────
  _updateBlackbeard(dt) {
    const bb = this._bb;
    const p  = this._p;

    // Rage scales with player's progress through world
    const progress = Math.min(1, p.x / (this._endX - 100));
    bb.rage = 1.0 + progress * 0.6;

    const effectiveSpeed = bb.speed * bb.rage;

    // Horizontal chase — smooth acceleration
    const targetVx = p.x > bb.x ? effectiveSpeed : -effectiveSpeed;
    bb.vx += (targetVx - bb.vx) * this._cfg.bbAccel * dt;

    // Stuck detection — if Blackbeard hasn't moved in 40 frames, jump
    bb.stuckTimer += dt;
    if (bb.stuckTimer > 40) {
      if (Math.abs(bb.x - bb.lastX) < 4) {
        // Jump over obstacle
        if (bb.onGround || bb.jumpsLeft > 0) {
          bb.vy = JUMP_V * this._cfg.bbJumpPower;
          bb.onGround = false;
        }
      }
      bb.lastX = bb.x;
      bb.stuckTimer = 0;
    }

    // Jump if player is significantly above and nearby
    const vertDiff = bb.y - p.y;
    const horizDist = Math.abs(bb.x - p.x);
    bb.jumpCooldown -= dt;
    if (vertDiff > 80 && horizDist < 500 && bb.onGround && bb.jumpCooldown <= 0) {
      bb.vy = JUMP_V * this._cfg.bbJumpPower * (vertDiff > 200 ? 1.15 : 0.95);
      bb.onGround = false;
      bb.jumpCooldown = 35;
    }

    // Gravity
    bb.vy += GRAV * dt;
    if (bb.vy > 22) bb.vy = 22;

    // Move & collide
    bb.x += bb.vx * dt;
    bb.facing = bb.vx > 0 ? 1 : -1;
    this._collideH(bb);
    bb.y += bb.vy * dt;
    bb.onGround = false;
    this._collideV(bb);
    if (bb.onGround) bb.jumpsLeft = 1;

    // World bounds
    if (bb.x < -300) bb.x = -300;

    // Touch damage
    if (p.iframes <= 0 && rectsOverlap(p.x, p.y, p.w, p.h, bb.x+6, bb.y, bb.w-12, bb.h)) {
      this._hitPlayer(`${this._playerName} was caught by Blackbeard!`);
    }

    // Animation
    bb.animTimer += dt;
    if (bb.animTimer > 5) { bb.animTimer = 0; bb.animFrame = (bb.animFrame+1) % 4; }
  }

  // ── Beam system ───────────────────────────────────────────────────────────
  _updateBeam(dt) {
    const now = performance.now();
    const p   = this._p;
    const bb  = this._bb;

    // Schedule beam if not charging or firing
    if (!this._beamCharge && !this._beam) {
      const dist = Math.hypot(p.x - bb.x, p.y - bb.y);
      if (now - this._lastBeamTs > this._cfg.beamFreq && dist < 1400 && dist > 200) {
        // Begin charge
        const chargeTime = 90; // frames
        this._beamCharge = {
          timer: 0, maxTimer: chargeTime,
          targetX: p.x + p.w/2 + p.vx*18,  // lead prediction
          targetY: p.y + p.h/2,
        };
        this._beamWarn.classList.add('bbc-warn-show');
        setTimeout(() => this._beamWarn.classList.remove('bbc-warn-show'), 2200);
      }
    }

    // Tick charge
    if (this._beamCharge) {
      this._beamCharge.timer += dt;
      // Charge particles from Blackbeard
      if (Math.random() < 0.35) {
        this._spawnParticles(
          bb.x + bb.w/2 + (Math.random()-0.5)*30,
          bb.y + bb.h/2 + (Math.random()-0.5)*20,
          '#ff6020', 3, 0.3
        );
      }
      if (this._beamCharge.timer >= this._beamCharge.maxTimer) {
        this._fireBeam();
      }
    }

    // Tick active beam
    if (this._beam) {
      this._beam.timer += dt;
      const frac = this._beam.timer / this._beam.maxTimer;

      // Beam particle trail along spline
      for (let i = 0; i < 4; i++) {
        const t = Math.random();
        const pt = sampleBeam(this._beam.spline, t);
        this._beamParticles.push({
          x: pt.x - this._cam.x, y: pt.y - this._cam.y,
          vx: (Math.random()-0.5)*2,
          vy: (Math.random()-0.5)*2 - 1,
          life: 1, maxLife: 1,
          r: Math.random()*4+2,
          col: `hsla(${10+Math.random()*30},100%,60%,`,
        });
      }

      // Hit detection — sample along beam and check player overlap
      if (p.iframes <= 0) {
        for (let t = 0; t <= 1; t += 0.05) {
          const pt = sampleBeam(this._beam.spline, t);
          // pt is in world coords; convert back
          const sx = pt.x;
          const sy = pt.y;
          if (rectsOverlap(p.x, p.y, p.w, p.h, sx-8, sy-8, 16, 16)) {
            this._hitPlayer('Scorched by the cursed beam!');
            break;
          }
        }
      }

      if (this._beam.timer >= this._beam.maxTimer) {
        this._beam = null;
        this._lastBeamTs = performance.now();
      }
    }

    // Beam particles
    this._beamParticles = this._beamParticles.filter(bp => {
      bp.x += bp.vx * dt;
      bp.y += bp.vy * dt;
      bp.life -= 0.05 * dt;
      return bp.life > 0;
    });
  }

  _fireBeam() {
    const bb = this._bb;
    const tc = this._beamCharge;
    this._beamCharge = null;

    const from = { x: bb.x + bb.w/2, y: bb.y + bb.h*0.3 };
    const to   = { x: tc.targetX, y: tc.targetY };
    const spline = buildBeamSpline(from, to);

    this._beam = {
      spline,
      timer: 0, maxTimer: 40,
      width: 10,
      fromW: from, toW: to,
    };

    this._spawnParticles(to.x, to.y, '#ff4000', 20, 1.2);
  }

  // ── Particles ─────────────────────────────────────────────────────────────
  _spawnParticles(wx, wy, col, count, speed) {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const spd   = speed * (0.5 + Math.random());
      this._particles.push({
        wx, wy,                        // world coords
        vx: Math.cos(angle)*spd,
        vy: Math.sin(angle)*spd - 1,
        life: 1, maxLife: 1,
        r: Math.random()*4+2,
        col,
      });
    }
  }

  _updateParticles(dt) {
    this._particles = this._particles.filter(pt => {
      pt.wx += pt.vx * dt;
      pt.wy += pt.vy * dt;
      pt.vy += 0.12 * dt;
      pt.life -= 0.04 * dt;
      return pt.life > 0;
    });
  }

  // ── Camera ────────────────────────────────────────────────────────────────
  _updateCamera(dt) {
    const p = this._p;
    // Target keeps player slightly left-of-centre so they see more ahead
    const tx = p.x - this._W * 0.35;
    const ty = p.y - this._H * 0.5;

    this._cam.x += (tx - this._cam.x) * 0.10 * dt;
    this._cam.y += (ty - this._cam.y) * 0.10 * dt;

    // Clamp
    this._cam.x = Math.max(0, Math.min(this._worldW - this._W, this._cam.x));
    this._cam.y = Math.max(-50, Math.min(150, this._cam.y));
  }

  // ── Zone detection ────────────────────────────────────────────────────────
  _checkZone() {
    const p  = this._p;
    const ox = p.x;
    let zone = 1;
    if (ox > 42*TILE)  zone = 2;
    if (ox > 79*TILE)  zone = 3;
    if (ox > 115*TILE) zone = 4;
    if (zone !== p.zone) {
      p.zone = zone;
      this._showZoneFlash(zone);
    }
  }

  _showZoneFlash(zone) {
    const inner = document.getElementById('bbc-zone-inner');
    if (!inner) return;
    const names = ['','The Docks','The High Sea','Davy Jones','Final Stretch'];
    inner.textContent = `⚓ Zone ${zone}: ${names[zone] || ''}`;
    this._zoneFlash.classList.add('bbc-flash-show');
    setTimeout(() => this._zoneFlash.classList.remove('bbc-flash-show'), 2000);
  }

  // ── Damage / Death / Win ──────────────────────────────────────────────────
  _hitPlayer(cause, instant=false) {
    const p = this._p;
    if (p.iframes > 0) return;
    if (instant) {
      this._die(cause);
      return;
    }
    p.hp   -= this._cfg.beamDmg;
    p.iframes = 90; // ~1.5s grace
    this._hitsTaken++;
    this._spawnParticles(p.x+p.w/2, p.y+p.h/2, '#ff3020', 14, 1.5);

    if (p.hp <= 0) this._die(cause);
  }

  _die(cause) {
    if (this._dead) return;
    this._dead = true;
    this._gameActive = false;

    setTimeout(() => {
      document.getElementById('bbc-go-sub').textContent  = cause;
      document.getElementById('bbc-go-zone').textContent = this._p.zone;
      document.getElementById('bbc-go-time').textContent = Math.floor(this._elapsed) + 's';
      document.getElementById('bbc-go-coins').textContent = this._coinsGot;

      this._goScreen.classList.remove('bbc-hidden');
      requestAnimationFrame(() => this._goScreen.classList.add('bbc-show'));

      document.getElementById('bbc-retry-btn').addEventListener('click', () => {
        this._goScreen.classList.remove('bbc-show', 'bbc-hidden');
        this._goScreen.classList.add('bbc-hidden');
        this._restartGame();
      }, { once: true });
    }, 600);
  }

  _win() {
    if (this._won) return;
    this._won = true;
    this._gameActive = false;
    this._spawnParticles(this._endX+40, this._endY+60, '#f0c030', 40, 3);

    setTimeout(() => {
      document.getElementById('bbc-win-name').textContent  = this._playerName;
      document.getElementById('bbc-win-time').textContent  = Math.floor(this._elapsed) + 's';
      document.getElementById('bbc-win-coins').textContent = this._coinsGot;
      document.getElementById('bbc-win-hits').textContent  = this._hitsTaken;

      this._submitLeaderboard();
      this._winScreen.classList.remove('bbc-hidden');
      requestAnimationFrame(() => this._winScreen.classList.add('bbc-show'));

      document.getElementById('bbc-again-btn').addEventListener('click', () => {
        this._winScreen.classList.remove('bbc-show');
        this._winScreen.classList.add('bbc-hidden');
        this._restartGame();
      }, { once: true });
    }, 700);
  }

  _restartGame() {
    this._canvas.classList.add('bbc-canvas-visible');
    this._hud.classList.add('bbc-hud-visible');
    this._initGameState();
    this._gameActive = true;
    this._lastTs = performance.now();
    cancelAnimationFrame(this._raf);
    this._raf = requestAnimationFrame(ts => this._tick(ts));
  }

  // ══════════════════════════════════════════════════════════════════════════
  // DRAW
  // ══════════════════════════════════════════════════════════════════════════
  _draw() {
    const ctx  = this._ctx;
    const cam  = this._cam;
    const W    = this._W, H = this._H;
    const zone = this._p.zone;
    const zc   = ZONE_COLORS[zone] || ZONE_COLORS[1];

    ctx.clearRect(0, 0, W, H);

    // Sky gradient
    const grad = ctx.createLinearGradient(0,0,0,H);
    grad.addColorStop(0, zc.sky[0]);
    grad.addColorStop(1, zc.sky[1]);
    ctx.fillStyle = grad;
    ctx.fillRect(0,0,W,H);

    // Stars (parallax at 0.3x)
    ctx.save();
    for (const star of this._stars) {
      const sx = ((star.x - cam.x * 0.3) % W + W) % W;
      const sy = star.y;
      const alpha = 0.3 + 0.5 * Math.abs(Math.sin(this._elapsed + star.b*6));
      ctx.fillStyle = `rgba(255,255,255,${alpha})`;
      ctx.beginPath(); ctx.arc(sx, sy, star.r, 0, Math.PI*2); ctx.fill();
    }
    ctx.restore();

    // Fog overlay
    ctx.fillStyle = zc.fog;
    ctx.fillRect(0, 0, W, H);

    // ── World space ──────────────────────────────────────────────────────────
    ctx.save();
    ctx.translate(-cam.x, -cam.y);

    // Platforms
    for (const plat of this._platforms) {
      if (plat.x + plat.w < cam.x - 10 || plat.x > cam.x + W + 10) continue;
      if (plat.isEnd) {
        // Golden end platform
        const g = ctx.createLinearGradient(plat.x, plat.y, plat.x, plat.y+plat.h);
        g.addColorStop(0, '#c89020');
        g.addColorStop(1, '#6a4a00');
        ctx.fillStyle = g;
        ctx.fillRect(plat.x, plat.y, plat.w, plat.h);
        ctx.strokeStyle = '#f0c030';
        ctx.lineWidth = 2;
        ctx.strokeRect(plat.x, plat.y, plat.w, plat.h);
      } else {
        const isGround = plat.h >= TILE;
        const topCol   = isGround ? '#3a2208' : '#4a2a08';
        const botCol   = isGround ? '#1a0c02' : '#2a1404';
        const g = ctx.createLinearGradient(plat.x, plat.y, plat.x, plat.y+plat.h);
        g.addColorStop(0, topCol);
        g.addColorStop(1, botCol);
        ctx.fillStyle = g;
        ctx.fillRect(plat.x, plat.y, plat.w, plat.h);
        // Top edge highlight
        ctx.fillStyle = '#6a3c10';
        ctx.fillRect(plat.x, plat.y, plat.w, 3);
        // Plank lines
        ctx.strokeStyle = 'rgba(0,0,0,0.3)';
        ctx.lineWidth = 1;
        for (let px = plat.x; px < plat.x+plat.w; px += 24) {
          ctx.beginPath(); ctx.moveTo(px, plat.y); ctx.lineTo(px, plat.y+plat.h); ctx.stroke();
        }
      }
    }

    // Spikes
    for (const s of this._spikes) {
      if (s.x + s.w < cam.x - 10 || s.x > cam.x + W + 10) continue;
      ctx.fillStyle = '#8a1010';
      const count = Math.floor(s.w / 12);
      for (let i = 0; i < count; i++) {
        const sx = s.x + i * 12 + 6;
        ctx.beginPath();
        ctx.moveTo(sx - 5, s.y + s.h);
        ctx.lineTo(sx, s.y);
        ctx.lineTo(sx + 5, s.y + s.h);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = '#c03030';
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    }

    // Coins
    for (const c of this._coins) {
      if (c.col) continue;
      if (c.x < cam.x - 30 || c.x > cam.x + W + 30) continue;
      const bob = Math.sin(this._elapsed * 3 + c.x) * 3;
      ctx.save();
      ctx.shadowColor = '#f0c030';
      ctx.shadowBlur  = 8;
      ctx.fillStyle   = '#f0c030';
      ctx.beginPath(); ctx.arc(c.x, c.y + bob, c.r, 0, Math.PI*2); ctx.fill();
      ctx.fillStyle   = '#fff8c0';
      ctx.beginPath(); ctx.arc(c.x - 2, c.y + bob - 2, 3, 0, Math.PI*2); ctx.fill();
      ctx.restore();
    }

    // End flag
    if (!this._won) {
      const fx = this._endX, fy = this._endY;
      const wave = Math.sin(this._elapsed * 4) * 8;
      // Pole
      ctx.strokeStyle = '#8a6020';
      ctx.lineWidth = 4;
      ctx.beginPath(); ctx.moveTo(fx, fy + 100); ctx.lineTo(fx, fy); ctx.stroke();
      // Flag
      ctx.fillStyle = '#c03020';
      ctx.beginPath();
      ctx.moveTo(fx, fy);
      ctx.lineTo(fx + 40 + wave, fy + 12);
      ctx.lineTo(fx, fy + 30);
      ctx.closePath(); ctx.fill();
      // ⚑ text
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 18px serif';
      ctx.fillText('⚑', fx + 6, fy + 22);
      // Glow
      ctx.save();
      ctx.shadowColor = '#f0c030';
      ctx.shadowBlur  = 20 + Math.sin(this._elapsed*3)*8;
      ctx.fillStyle   = 'rgba(240,192,48,0.15)';
      ctx.beginPath(); ctx.arc(fx+20, fy+40, 40, 0, Math.PI*2); ctx.fill();
      ctx.restore();
    }

    // Particles (world space)
    for (const pt of this._particles) {
      const alpha = pt.life;
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.fillStyle = pt.col;
      ctx.shadowColor = pt.col;
      ctx.shadowBlur  = 6;
      ctx.beginPath(); ctx.arc(pt.wx, pt.wy, pt.r, 0, Math.PI*2); ctx.fill();
      ctx.restore();
    }

    // ── BEAM ──────────────────────────────────────────────────────────────
    if (this._beam) {
      const frac = this._beam.timer / this._beam.maxTimer;
      const sp   = this._beam.spline;

      // Draw multiple layers for glow effect
      const layers = [
        { width: 18, alpha: 0.15, col: '#ff8040' },
        { width: 10, alpha: 0.4,  col: '#ff5020' },
        { width:  5, alpha: 0.8,  col: '#ff9060' },
        { width:  2, alpha: 1.0,  col: '#ffffff' },
      ];

      for (const layer of layers) {
        ctx.save();
        ctx.strokeStyle = layer.col;
        ctx.lineWidth   = layer.width;
        ctx.globalAlpha = layer.alpha * (1 - frac * 0.5);
        ctx.shadowColor = '#ff4000';
        ctx.shadowBlur  = 20;
        ctx.lineCap     = 'round';
        ctx.lineJoin    = 'round';
        ctx.beginPath();
        let first = true;
        const steps = 60;
        for (let i = 0; i <= steps; i++) {
          const pt = sampleBeam(sp, i/steps);
          if (first) { ctx.moveTo(pt.x, pt.y); first = false; }
          else ctx.lineTo(pt.x, pt.y);
        }
        ctx.stroke();
        ctx.restore();
      }

      // Impact flash at target
      if (frac < 0.3) {
        ctx.save();
        const imp = sampleBeam(sp, 1);
        ctx.globalAlpha  = (0.3 - frac) / 0.3;
        ctx.fillStyle    = '#ff8040';
        ctx.shadowColor  = '#ff4000';
        ctx.shadowBlur   = 40;
        ctx.beginPath(); ctx.arc(imp.x, imp.y, 24*(1-frac/0.3)+4, 0, Math.PI*2); ctx.fill();
        ctx.restore();
      }
    }

    // ── Beam charge indicator (orb growing on Blackbeard) ──
    if (this._beamCharge) {
      const bb  = this._bb;
      const frac = this._beamCharge.timer / this._beamCharge.maxTimer;
      const r   = frac * 28;
      ctx.save();
      ctx.globalAlpha = 0.7;
      ctx.fillStyle   = `hsl(${30-frac*30},100%,${50+frac*20}%)`;
      ctx.shadowColor = '#ff4000';
      ctx.shadowBlur  = 30;
      ctx.beginPath(); ctx.arc(bb.x + bb.w/2, bb.y + bb.h*0.3, r, 0, Math.PI*2); ctx.fill();
      ctx.restore();
    }

    // ── BLACKBEARD ────────────────────────────────────────────────────────
    this._drawBlackbeard();

    // ── PLAYER ────────────────────────────────────────────────────────────
    this._drawPlayer();

    ctx.restore(); // end world space

    // Screen-space beam particles
    for (const bp of this._beamParticles) {
      ctx.save();
      ctx.globalAlpha = bp.life;
      ctx.fillStyle   = bp.col + bp.life + ')';
      ctx.shadowColor = '#ff4000';
      ctx.shadowBlur  = 8;
      ctx.beginPath(); ctx.arc(bp.x, bp.y, bp.r, 0, Math.PI*2); ctx.fill();
      ctx.restore();
    }

    // Damage vignette
    if (this._p.iframes > 0) {
      const v = Math.sin(this._elapsed * 18) * 0.5 + 0.5;
      ctx.save();
      const vig = ctx.createRadialGradient(W/2,H/2,H*0.2, W/2,H/2,H*0.85);
      vig.addColorStop(0, 'rgba(200,0,0,0)');
      vig.addColorStop(1, `rgba(200,0,0,${0.35 * v})`);
      ctx.fillStyle = vig;
      ctx.fillRect(0,0,W,H);
      ctx.restore();
    }
  }

  _drawPlayer() {
    const ctx = this._ctx;
    const p   = this._p;

    // Blink during iframes
    if (p.iframes > 0 && Math.floor(p.iframes / 5) % 2 === 0) return;

    ctx.save();
    ctx.translate(p.x + p.w/2, p.y + p.h/2);
    if (p.facing === -1) ctx.scale(-1, 1);

    // Body
    const bodyGrad = ctx.createLinearGradient(-p.w/2, -p.h/2, p.w/2, p.h/2);
    bodyGrad.addColorStop(0, '#4a2808');
    bodyGrad.addColorStop(1, '#2a1404');
    ctx.fillStyle = bodyGrad;
    ctx.beginPath();
    ctx.roundRect(-p.w/2, -p.h/2, p.w, p.h, 5);
    ctx.fill();

    // Coat accent
    ctx.fillStyle = '#8a4010';
    ctx.fillRect(-p.w/2, p.h/8, p.w, p.h/2 - 2);

    // Belt
    ctx.fillStyle = '#1a0a02';
    ctx.fillRect(-p.w/2, p.h/8 - 3, p.w, 6);
    ctx.fillStyle = '#c8a020';
    ctx.fillRect(-4, p.h/8 - 4, 8, 8);

    // Head
    ctx.fillStyle = '#c8a070';
    ctx.beginPath(); ctx.arc(0, -p.h/2 - 8, 10, 0, Math.PI*2); ctx.fill();

    // Hat
    ctx.fillStyle = '#1a0a02';
    ctx.fillRect(-12, -p.h/2 - 20, 24, 10);
    ctx.beginPath();
    ctx.moveTo(-14, -p.h/2 - 10);
    ctx.lineTo(14, -p.h/2 - 10);
    ctx.lineTo(10, -p.h/2 - 20);
    ctx.lineTo(-10, -p.h/2 - 20);
    ctx.closePath(); ctx.fill();

    // Sword (animated)
    const swingAngle = p.onGround ? Math.sin(this._elapsed * 8) * 0.15 : -0.4;
    ctx.rotate(swingAngle);
    ctx.strokeStyle = '#c0c0d0';
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(p.w/2 - 4, 0);
    ctx.lineTo(p.w/2 + 18, -14);
    ctx.stroke();
    ctx.strokeStyle = '#8a6020';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(p.w/2 - 8, 2);
    ctx.lineTo(p.w/2 + 2, -4);
    ctx.stroke();

    // Running leg animation
    if (Math.abs(p.vx) > 0.5 && p.onGround) {
      const legSwing = Math.sin(this._elapsed * 14) * 8;
      ctx.fillStyle = '#2a1404';
      ctx.fillRect(-6,  p.h/2 - 8, 8, 10);
      ctx.fillRect(-6 + legSwing, p.h/2 - 4, 8, 10);
    }

    ctx.restore();

    // Name tag
    ctx.save();
    ctx.font = '700 9px "Cinzel Decorative", cursive';
    ctx.fillStyle  = 'rgba(240,192,48,0.85)';
    ctx.textAlign  = 'center';
    ctx.fillText(this._playerName, p.x + p.w/2, p.y - 14);
    ctx.restore();
  }

  _drawBlackbeard() {
    const ctx = this._ctx;
    const bb  = this._bb;

    ctx.save();
    ctx.translate(bb.x + bb.w/2, bb.y + bb.h/2);
    if (bb.facing === -1) ctx.scale(-1, 1);

    // Shadow
    ctx.globalAlpha = 0.25;
    ctx.fillStyle   = '#000';
    ctx.beginPath(); ctx.ellipse(0, bb.h/2+4, bb.w*0.55, 8, 0, 0, Math.PI*2); ctx.fill();
    ctx.globalAlpha = 1;

    // Cape / cloak — flowing
    const capeSwing = Math.sin(this._elapsed * 4) * 5;
    ctx.fillStyle = '#0d0010';
    ctx.beginPath();
    ctx.moveTo(-bb.w/2 - 4, -bb.h/4);
    ctx.quadraticCurveTo(-bb.w/2 - 14 - capeSwing, bb.h/6, -bb.w/2 - 8, bb.h/2 + 4);
    ctx.lineTo(-bb.w/2 + 4, bb.h/2);
    ctx.lineTo(-bb.w/2, -bb.h/4);
    ctx.closePath(); ctx.fill();

    // Body — dark coat
    const bodyG = ctx.createLinearGradient(-bb.w/2, -bb.h/2, bb.w/2, bb.h/2);
    bodyG.addColorStop(0, '#1a0a14');
    bodyG.addColorStop(1, '#08020a');
    ctx.fillStyle = bodyG;
    ctx.beginPath();
    ctx.roundRect(-bb.w/2, -bb.h/2, bb.w, bb.h, 6);
    ctx.fill();

    // Coat trim — deep red
    ctx.strokeStyle = '#6a0010';
    ctx.lineWidth   = 2;
    ctx.strokeRect(-bb.w/2, -bb.h/2, bb.w, bb.h);

    // Beard (iconic)
    ctx.fillStyle = '#0a0608';
    ctx.beginPath();
    ctx.moveTo(-8, -bb.h/2 + 8);
    ctx.lineTo(8, -bb.h/2 + 8);
    ctx.lineTo(6, -bb.h/2 + 26);
    ctx.lineTo(-6, -bb.h/2 + 26);
    ctx.closePath(); ctx.fill();
    // Beard fuses
    ctx.strokeStyle = '#1a0a10';
    ctx.lineWidth = 1.5;
    for (let i = -6; i <= 6; i += 4) {
      ctx.beginPath();
      ctx.moveTo(i, -bb.h/2 + 18);
      ctx.lineTo(i + (Math.sin(this._elapsed*6+i)*2), -bb.h/2 + 28);
      ctx.stroke();
    }

    // Head
    ctx.fillStyle = '#8a6050';
    ctx.beginPath(); ctx.arc(0, -bb.h/2 - 2, 14, 0, Math.PI*2); ctx.fill();

    // Hat — large tricorn
    ctx.fillStyle = '#08040a';
    ctx.beginPath();
    ctx.moveTo(-20, -bb.h/2 - 10);
    ctx.lineTo(20, -bb.h/2 - 10);
    ctx.lineTo(14, -bb.h/2 - 28);
    ctx.lineTo(-14, -bb.h/2 - 28);
    ctx.closePath(); ctx.fill();
    ctx.fillRect(-22, -bb.h/2 - 14, 44, 6); // brim

    // Eyes — glowing
    const eyeGlow = 0.6 + 0.4 * Math.sin(this._elapsed * 5);
    ctx.shadowColor = '#ff2000';
    ctx.shadowBlur  = 10 * eyeGlow;
    ctx.fillStyle   = `rgba(255,${30 + 20*eyeGlow|0},0,${eyeGlow})`;
    ctx.beginPath(); ctx.arc(-5, -bb.h/2 - 2, 3, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc( 5, -bb.h/2 - 2, 3, 0, Math.PI*2); ctx.fill();
    ctx.shadowBlur  = 0;

    // Hook hand
    ctx.strokeStyle = '#909090';
    ctx.lineWidth   = 3;
    ctx.lineCap     = 'round';
    ctx.beginPath();
    ctx.moveTo(bb.w/2 - 2, 2);
    ctx.lineTo(bb.w/2 + 10, -4);
    ctx.arcTo(bb.w/2+18, -4, bb.w/2+18, 4, 8);
    ctx.stroke();

    // Sword (off hand)
    ctx.strokeStyle = '#b0b0c0';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(-bb.w/2 + 2, 0);
    ctx.lineTo(-bb.w/2 - 20, -20);
    ctx.stroke();
    ctx.strokeStyle = '#7a5010';
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(-bb.w/2 + 4, 2);
    ctx.lineTo(-bb.w/2 - 4, -8);
    ctx.stroke();

    ctx.restore();

    // "Blackbeard" label
    ctx.save();
    ctx.font = '700 9px "Cinzel Decorative", cursive';
    ctx.fillStyle  = 'rgba(200,60,20,0.9)';
    ctx.textAlign  = 'center';
    ctx.shadowColor = '#ff2000';
    ctx.shadowBlur  = 6;
    ctx.fillText('☠ Blackbeard', bb.x + bb.w/2, bb.y - 10);
    ctx.restore();
  }

  // ── HUD Update ────────────────────────────────────────────────────────────
  _updateHUD() {
    const p  = this._p;
    const bb = this._bb;

    // HP bar
    const hpPct = Math.max(0, p.hp / p.maxHp * 100);
    const hpBar = document.getElementById('bbc-hp-bar');
    const hpTxt = document.getElementById('bbc-hp-text');
    if (hpBar) {
      hpBar.style.width = hpPct + '%';
      hpBar.className = 'bbc-h-fill ' +
        (hpPct > 60 ? 'bbc-fill-hp-hi' : hpPct > 30 ? 'bbc-fill-hp-md' : 'bbc-fill-hp-lo');
    }
    if (hpTxt) hpTxt.textContent = `${Math.ceil(p.hp)} / ${p.maxHp}`;

    // Blackbeard proximity
    const dist  = Math.max(0, p.x - bb.x);
    const bbPct = Math.max(2, Math.min(100, 100 - (dist / 600) * 100));
    const bbBar = document.getElementById('bbc-bb-bar');
    const bbTxt = document.getElementById('bbc-bb-text');
    if (bbBar) bbBar.style.width = bbPct + '%';
    if (bbTxt) bbTxt.textContent = dist < 100 ? 'VERY CLOSE!' : dist < 250 ? 'Closing in...' : dist < 500 ? 'Nearby' : 'Far away';

    // Zone, time, coins, progress
    const zEl = document.getElementById('bbc-zone-val');
    if (zEl) zEl.textContent = p.zone;
    const tEl = document.getElementById('bbc-time-val');
    if (tEl) tEl.textContent = Math.floor(this._elapsed) + 's';
    const cEl = document.getElementById('bbc-coin-val');
    if (cEl) cEl.textContent = this._coinsGot;

    const prog    = Math.min(100, Math.max(0, (p.x / (this._endX)) * 100));
    const progBar = document.getElementById('bbc-prog-bar');
    const progTxt = document.getElementById('bbc-prog-text');
    if (progBar) progBar.style.width = prog.toFixed(1) + '%';
    if (progTxt) progTxt.textContent = Math.floor(prog) + '%';
  }

  // ══════════════════════════════════════════════════════════════════════════
  // Game engine interface — called by the engine's loop
  // ══════════════════════════════════════════════════════════════════════════
  update() { /* driven by internal RAF */ }
  draw()   { /* driven by internal RAF */ }

  resize() {
    if (this._canvas) {
      this._resizeCanvas();
    }
  }

  destroy() {
    this._gameActive = false;
    cancelAnimationFrame(this._raf);
    window.removeEventListener('keydown', this._keyDown);
    window.removeEventListener('keyup',   this._keyUp);

    // Remove all DOM nodes
    [
      this._menuScreen,
      this._goScreen,
      this._winScreen,
      this._canvas,
      this._hud,
      this._beamWarn,
      this._zoneFlash,
    ].forEach(el => el?.parentNode && el.remove());

    document.getElementById('bbc-style')?.remove();
  }
}

export default newlevel;

