import GameEnvBackground from '/assets/js/GameEnginev1.1/essentials/GameEnvBackground.js';
import Player from '/assets/js/GameEnginev1.1/essentials/Player.js';

const LEVEL_XP = [0, 100, 250, 450, 700, 1000, 1400, 1900, 2500, 3200, 4000];
const MAX_LEVEL = LEVEL_XP.length - 1;

const RARITY_XP  = { common: 20, uncommon: 45, rare: 90, epic: 160, legendary: 280 };
const RARITY_LVL = { common: [1,3], uncommon: [3,5], rare: [5,7], epic: [7,9], legendary: [9,10] };

const RANK_TITLES = ['','Stowaway','Deckhand','Sailor','Bosun','Quartermaster',
                     'First Commander','Master Gunner','Captain','Admiral','Pirate King'];

function levelColor(lvl) {
  if (lvl <= 2) return { bg: 'rgba(80,80,80,.7)',   color: '#ccc'    };
  if (lvl <= 4) return { bg: 'rgba(20,110,35,.7)',  color: '#90ee90' };
  if (lvl <= 6) return { bg: 'rgba(25,55,150,.7)',  color: '#80b0ff' };
  if (lvl <= 8) return { bg: 'rgba(90,15,130,.7)',  color: '#dd90ff' };
  return              { bg: 'rgba(160,90,0,.7)',   color: '#ffc060' };
}

function playerStatsForLevel(lvl) {
  return { atk: 10+(lvl-1)*3, def: 3+(lvl-1)*2, maxHp: 80+(lvl-1)*10 };
}

const SHOP_DATA = {
  weapons: [
    { id:'w1', name:"Wooden Sword",       icon:'🗡',  desc:"A trusty pirate blade.",                 price:25,  rarity:'common',    stats:['+12 ATK','+5 SPD'],              minLevel:1 },
    { id:'w2', name:"Flintlock Pistol",   icon:'🔫', desc:"One shot. Make it count.",               price:55,  rarity:'uncommon',  stats:['+28 ATK','-8 SPD','Ranged'],    minLevel:2 },
    { id:'w3', name:"Blackbread's Saber", icon:'⚔',  desc:"Stolen from the feared pirate himself.", price:130, rarity:'rare',      stats:['+40 ATK','+15 SPD','Cursed'],   minLevel:4 },
    { id:'w4', name:"Trident of Davy",    icon:'🔱', desc:"Forged in the ocean abyss.",             price:280, rarity:'epic',      stats:['+65 ATK','Water DMG','+20 DEF'],minLevel:6 },
    { id:'w5', name:"The Golden Hook",    icon:'🪝',  desc:"A hook that drags fate itself.",         price:500, rarity:'legendary', stats:['+90 ATK','Fate Bind','+30 SPD'], minLevel:9 },
  ],
  armor: [
    { id:'a1', name:"Sailor's Coat",      icon:'🧥', desc:"Worn, smells of salt and adventure.",   price:20,  rarity:'common',    stats:['+8 DEF','+3 SPD'],              minLevel:1 },
    { id:'a2', name:"Leather Vest",       icon:'🦺', desc:"Supple hide from a kraken's side.",     price:45,  rarity:'uncommon',  stats:['+18 DEF','-2 SPD'],             minLevel:2 },
    { id:'a3', name:"Iron Breastplate",   icon:'🛡',  desc:"Dented but dependable.",                price:100, rarity:'rare',      stats:['+35 DEF','-10 SPD'],            minLevel:4 },
    { id:'a4', name:"Ghost Ship Armor",   icon:'👻', desc:"Phased from another realm.",            price:250, rarity:'epic',      stats:['+55 DEF','Ethereal','+10 SPD'],  minLevel:6 },
    { id:'a5', name:"Poseidon's Plate",   icon:'🌊', desc:"The ocean itself yields to its wearer.",price:480, rarity:'legendary', stats:['+80 DEF','Sea Ward','Breathe Water'],minLevel:9 },
  ],
  potions: [
    { id:'p1', name:"Monke Drink",        icon:'🍺', desc:"Tastes awful. Heals a little.",          price:5,  rarity:'common',    stats:['+8 HP','Stackable'],            minLevel:1 },
    { id:'p2', name:"Sea Witch's Brew",   icon:'🧪', desc:"Green and bubbling. Barely fine.",       price:20,  rarity:'uncommon',  stats:['+18 HP','Random Buff'],         minLevel:1 },
    { id:'p3', name:"Mermaid's Tears",    icon:'💧', desc:"Rare essence — hard to get, worth it.",  price:50,  rarity:'rare',      stats:['+35 HP','Cure Poison'],         minLevel:1 },
    { id:'p4', name:"Kraken Ink",         icon:'🦑', desc:"Grants brief invincibility + ink cloud.",price:100, rarity:'epic',      stats:['Invincible 10s','Blind Foes'],   minLevel:1 },
    { id:'p5', name:"Elixir of Eternity", icon:'⚔️', desc:"A single drop of liquid immortality.",   price:190, rarity:'legendary', stats:['Full HP','Revive','+50 All Stats'],minLevel:1 },
  ],
  maps: [
    { id:'m1', name:"Torn Map Fragment",  icon:'📄', desc:"A piece of a greater treasure map.",    price:15,  rarity:'common',    stats:['Fragment 1/4'],                 minLevel:1 },
    { id:'m2', name:"Isle of Skulls Map", icon:'🗺',  desc:"Marks a hidden cove full of gold.",     price:50,  rarity:'uncommon',  stats:['+Gold Finder','Region: North'],  minLevel:1 },
    { id:'m3', name:"Sunken City Chart",  icon:'🌐', desc:"The drowned city of Atlantis awaits.",  price:140, rarity:'rare',      stats:['Depth: 900ft','Rare Loot'],      minLevel:1 },
    { id:'m4', name:"Blackbread's Secret",icon:'☠',  desc:"His most guarded route.",               price:320, rarity:'epic',      stats:['Boss Route','All Ports'],        minLevel:1 },
    { id:'m5', name:"Map of All Seas",    icon:'🧭', desc:"Reveals every treasure hoard.",         price:600, rarity:'legendary', stats:['Global','All Secrets','Legendary Loot'],minLevel:1 },
  ],
  misc: [
    { id:'x1', name:"Ship's Parrot",      icon:'🦜', desc:"Loudmouthed but loyal.",                 price:35,  rarity:'uncommon',  stats:['+Ambush Warn','Companion'],      minLevel:1 },
    { id:'x2', name:"Spy Glass",          icon:'🔭', desc:"See enemies before they see you.",      price:50,  rarity:'uncommon',  stats:['+200 View','+Scout'],            minLevel:2 },
    { id:'x3', name:"Haunted Lantern",    icon:'🏮', desc:"Lights the way in cursed darkness.",    price:90,  rarity:'rare',      stats:['Night Vision','Ghost Talk'],     minLevel:4 },
    { id:'x4', name:"Bottled Typhoon",    icon:'🌀', desc:"Unleash a storm upon thine enemies.",   price:200, rarity:'epic',      stats:['AOE Storm','1-Use'],             minLevel:6 },
    { id:'x5', name:"Immortal's Compass", icon:'⭐', desc:"Always points to what you desire most.",price:450, rarity:'legendary', stats:['Desire Track','Never Lost'],      minLevel:9 },
  ],
};

const ENEMY_TYPES = [
  { id:'skeleton', name:'Skeleton Guard',         icon:'💀', hp:30,  atk:10, def:2,  reward:[3,6],   rarity:'common'   },
  { id:'rat',      name:'Giant Rat',              icon:'🐀', hp:20,  atk:7,  def:1,  reward:[2,4],   rarity:'common'   },
  { id:'ghost',    name:'Ghost Sailor',           icon:'👻', hp:45,  atk:14, def:4,  reward:[6,10],  rarity:'uncommon' },
  { id:'pirate',   name:'Rival Pirate',           icon:'🏴‍☠️', hp:55,  atk:18, def:5,  reward:[8,14],  rarity:'uncommon' },
  { id:'kraken',   name:'Baby Fire Bird',         icon:'🐦‍🔥', hp:80,  atk:24, def:8,  reward:[15,22], rarity:'rare'     },
  { id:'davy',     name:"Luffy the Monke's Wrath",icon:'⚓', hp:120, atk:32, def:12, reward:[25,35], rarity:'epic'     },
];

// ── CSS ───────────────────────────────────────────────────────────────────────
const BATTLE_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@400;700&family=IM+Fell+English:ital@0;1&display=swap');
#battle-overlay{position:fixed;inset:0;z-index:99999;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,0.88);backdrop-filter:blur(4px);animation:bFadeIn .22s ease}
@keyframes bFadeIn{from{opacity:0}to{opacity:1}}
#battle-panel{width:min(640px,96vw);background:linear-gradient(160deg,#110800 0%,#06030a 100%);border:3px solid #7a3a08;border-radius:18px;overflow:hidden;font-family:'IM Fell English',serif;box-shadow:0 0 80px rgba(180,80,10,.25),inset 0 0 60px rgba(0,0,0,.6)}
#battle-header{background:rgba(0,0,0,.45);border-bottom:2px solid #4a2406;padding:12px 20px;display:flex;align-items:center;justify-content:space-between}
#battle-title{font-family:'Cinzel Decorative',cursive;color:#e8a020;font-size:15px;letter-spacing:2px}
#battle-arena{display:flex;align-items:center;justify-content:space-around;padding:28px 24px 16px;gap:16px}
.b-fighter{display:flex;flex-direction:column;align-items:center;gap:6px;flex:1}
.b-fighter-icon{font-size:64px;line-height:1;filter:drop-shadow(0 4px 12px rgba(0,0,0,.7));transition:transform .15s}
.b-fighter-icon.shake{animation:bShake .35s ease}
@keyframes bShake{0%,100%{transform:translateX(0)}20%{transform:translateX(-8px)}40%{transform:translateX(10px)}60%{transform:translateX(-6px)}80%{transform:translateX(5px)}}
.b-fighter-name{font-family:'Cinzel Decorative',cursive;color:#e8a020;font-size:11px;letter-spacing:1px;text-align:center}
.b-level-badge{font-family:'Cinzel Decorative',cursive;font-size:9px;padding:2px 8px;border-radius:4px;letter-spacing:1px}
.b-hp-bar-wrap{width:100%;max-width:160px;background:rgba(0,0,0,.5);border:1.5px solid rgba(180,100,20,.3);border-radius:8px;height:14px;overflow:hidden}
.b-hp-bar{height:100%;border-radius:7px;transition:width .4s ease}
.b-hp-bar.player{background:linear-gradient(90deg,#20a050,#40e080)}
.b-hp-bar.enemy{background:linear-gradient(90deg,#c02020,#e85030)}
.b-hp-text{font-family:'Cinzel Decorative',cursive;font-size:11px;color:#c8a040}
#b-vs{font-family:'Cinzel Decorative',cursive;color:#e03020;font-size:26px;text-shadow:0 0 18px rgba(220,60,20,.7);flex-shrink:0}
#battle-log{background:rgba(0,0,0,.4);border-top:1px solid rgba(180,100,20,.2);border-bottom:1px solid rgba(180,100,20,.2);margin:0 20px 14px;border-radius:8px;padding:10px 14px;min-height:52px;max-height:72px;overflow-y:auto;font-size:13px;color:rgba(220,190,120,.85);font-style:italic;line-height:1.5}
#battle-log::-webkit-scrollbar{width:4px}#battle-log::-webkit-scrollbar-thumb{background:#5a2808;border-radius:3px}
.b-log-entry{margin-bottom:2px}.b-log-entry.hit-player{color:#ff8868}.b-log-entry.hit-enemy{color:#68e888}.b-log-entry.special{color:#f0c030}
#battle-actions{display:grid;grid-template-columns:1fr 1fr;gap:10px;padding:0 20px 20px}
.b-action-btn{padding:12px;border-radius:8px;font-family:'Cinzel Decorative',cursive;font-size:11px;cursor:pointer;letter-spacing:1px;border:1.5px solid;transition:background .15s,transform .1s,opacity .2s;display:flex;flex-direction:column;align-items:center;gap:4px}
.b-action-btn .b-action-icon{font-size:22px}
.b-action-btn .b-action-sub{font-size:9px;opacity:.7;font-family:'IM Fell English',serif}
.b-action-btn:hover:not(:disabled){transform:translateY(-2px)}
.b-action-btn:disabled{opacity:.35;cursor:not-allowed}
.b-btn-attack{background:rgba(140,30,10,.6);border-color:#b04010;color:#f08030}.b-btn-attack:hover:not(:disabled){background:rgba(200,60,20,.7)}
.b-btn-special{background:rgba(80,20,120,.6);border-color:#9040c0;color:#d080ff}.b-btn-special:hover:not(:disabled){background:rgba(120,40,180,.7)}
.b-btn-defend{background:rgba(20,60,100,.6);border-color:#3080c0;color:#60b8ff}.b-btn-defend:hover:not(:disabled){background:rgba(30,90,150,.7)}
.b-btn-flee{background:rgba(40,40,40,.6);border-color:#606060;color:#b0b0b0}.b-btn-flee:hover:not(:disabled){background:rgba(70,70,70,.7)}
#battle-reward{display:none;flex-direction:column;align-items:center;gap:14px;padding:28px 20px;text-align:center}
#battle-reward.show{display:flex}
#b-reward-icon{font-size:52px}
#b-reward-title{font-family:'Cinzel Decorative',cursive;color:#f5c030;font-size:20px;letter-spacing:2px;text-shadow:0 0 20px rgba(240,180,20,.5)}
#b-reward-rubies{display:flex;align-items:center;gap:8px;font-family:'Cinzel Decorative',cursive;font-size:28px;color:#f0c030}
.b-ruby-icon-lg{font-size:30px;filter:drop-shadow(0 0 6px rgba(255,80,60,.8))}
#b-reward-xp{font-family:'Cinzel Decorative',cursive;font-size:14px;color:#80c8ff;letter-spacing:1px}
#b-reward-btn{margin-top:8px;background:rgba(140,75,8,.7);border:1.5px solid #b07010;border-radius:8px;color:#f0c030;font-family:'Cinzel Decorative',cursive;font-size:12px;padding:11px 32px;cursor:pointer;letter-spacing:1px;transition:background .15s}
#b-reward-btn:hover{background:rgba(210,120,15,.75);color:#fff}
#battle-defeat{display:none;flex-direction:column;align-items:center;gap:14px;padding:28px 20px;text-align:center}
#battle-defeat.show{display:flex}
#b-defeat-title{font-family:'Cinzel Decorative',cursive;color:#e03030;font-size:20px;letter-spacing:2px}
#b-defeat-btn{background:rgba(80,20,10,.7);border:1.5px solid #802010;border-radius:8px;color:#f08060;font-family:'Cinzel Decorative',cursive;font-size:12px;padding:11px 32px;cursor:pointer;letter-spacing:1px;transition:background .15s}
#b-defeat-btn:hover{background:rgba(140,40,20,.8)}
.world-enemy{position:fixed;display:flex;flex-direction:column;align-items:center;gap:2px;z-index:9988;transition:opacity .3s;transform:translate(-50%,-50%);transform-origin:center center;cursor:default}
.world-enemy.defeated{opacity:0;pointer-events:none}
.world-enemy-icon{font-size:34px;animation:enemyBob 2s ease-in-out infinite;filter:drop-shadow(0 3px 8px rgba(0,0,0,.7))}
@keyframes enemyBob{0%,100%{transform:translateY(0)}50%{transform:translateY(-5px)}}
.world-enemy-label{background:rgba(0,0,0,.75);border:1px solid rgba(200,60,20,.5);border-radius:4px;padding:2px 7px;font-family:'Cinzel Decorative',cursive;font-size:9px;color:#ff8860;white-space:nowrap}
.world-enemy-hpbar{width:48px;height:5px;background:rgba(0,0,0,.5);border-radius:3px;overflow:hidden;border:1px solid rgba(200,60,20,.3)}
.world-enemy-hpfill{height:100%;background:#c02020;border-radius:3px;transition:width .3s}
.world-enemy-action{display:none;position:absolute;top:calc(100% + 8px);left:50%;transform:translateX(-50%);background:rgba(0,0,0,.92);border:1px solid rgba(200,120,40,.65);border-radius:8px;padding:7px 12px;font-family:'Cinzel Decorative',cursive;font-size:10px;color:#ffb970;white-space:nowrap;pointer-events:none;z-index:9990;text-align:center;line-height:1.7}
.world-enemy.has-hint .world-enemy-action{display:block}
#levelup-flash{position:fixed;inset:0;z-index:999998;display:flex;align-items:center;justify-content:center;pointer-events:none;opacity:0;transition:opacity .35s}
#levelup-flash.show{opacity:1}
#levelup-inner{font-family:'Cinzel Decorative',cursive;font-size:34px;color:#f5c030;text-shadow:0 0 40px rgba(255,200,0,.9),0 0 80px rgba(255,150,0,.6);letter-spacing:4px;animation:lvlPop .6s ease}
@keyframes lvlPop{0%{transform:scale(.6)}60%{transform:scale(1.15)}100%{transform:scale(1)}}
#gameover-overlay{position:fixed;inset:0;z-index:999999;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,0);backdrop-filter:blur(0px);transition:background 1.2s ease,backdrop-filter 1.2s ease;pointer-events:none}
#gameover-overlay.show{background:rgba(0,0,0,.92);backdrop-filter:blur(6px);pointer-events:all}
#gameover-panel{display:flex;flex-direction:column;align-items:center;gap:18px;padding:48px 52px;background:linear-gradient(160deg,#1a0000 0%,#060006 100%);border:3px solid #6a0000;border-radius:20px;box-shadow:0 0 100px rgba(180,0,0,.4),inset 0 0 80px rgba(0,0,0,.7);font-family:'IM Fell English',serif;opacity:0;transform:scale(.88);transition:opacity .8s ease .4s,transform .8s ease .4s}
#gameover-overlay.show #gameover-panel{opacity:1;transform:scale(1)}
#gameover-skull{font-size:80px;animation:goFloat 3s ease-in-out infinite}
@keyframes goFloat{0%,100%{transform:translateY(0) rotate(-3deg)}50%{transform:translateY(-10px) rotate(3deg)}}
#gameover-title{font-family:'Cinzel Decorative',cursive;color:#cc0000;font-size:36px;letter-spacing:4px;text-shadow:0 0 40px rgba(200,0,0,.8),0 0 80px rgba(200,0,0,.4)}
#gameover-sub{color:rgba(200,140,100,.7);font-size:14px;font-style:italic;text-align:center;line-height:1.7;max-width:320px}
#gameover-stats{display:flex;gap:28px;padding:14px 24px;background:rgba(0,0,0,.4);border:1px solid rgba(150,50,50,.3);border-radius:10px}
.go-stat{display:flex;flex-direction:column;align-items:center;gap:4px}
.go-stat-val{font-family:'Cinzel Decorative',cursive;color:#e8a020;font-size:22px}
.go-stat-lbl{color:rgba(180,130,80,.6);font-size:10px;font-family:'Cinzel Decorative',cursive;letter-spacing:1px}
#gameover-btn{margin-top:8px;background:rgba(140,0,0,.7);border:2px solid #aa0000;border-radius:10px;color:#ff6060;font-family:'Cinzel Decorative',cursive;font-size:13px;padding:13px 40px;cursor:pointer;letter-spacing:2px;transition:background .2s,transform .15s}
#gameover-btn:hover{background:rgba(200,20,20,.8);color:#fff;transform:scale(1.04)}
`;

// ── HUD CSS — single bottom bar ───────────────────────────────────────────────
const HUD_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@400;700&display=swap');
#mpg-hud-bar{
  position:fixed;
  bottom:0;left:0;right:0;
  height:64px;
  display:flex;
  align-items:stretch;
  background:rgba(6,3,1,0.97);
  border-top:1.5px solid #5a2e06;
  z-index:9990;
  font-family:'Cinzel Decorative',cursive;
}
.mpg-seg{
  display:flex;align-items:center;gap:9px;
  padding:0 16px;
  border-right:1px solid rgba(100,50,8,0.35);
  flex-shrink:0;
}
.mpg-seg:last-child{border-right:none;}
.mpg-seg-grow{flex:1;display:flex;align-items:center;justify-content:center;padding:0 12px;}
.mpg-icon{
  width:26px;height:26px;border-radius:50%;
  display:flex;align-items:center;justify-content:center;
  font-size:12px;flex-shrink:0;
}
.mpg-icon-hp  {background:rgba(20,120,50,.3); border:1.5px solid rgba(40,180,80,.45);}
.mpg-icon-ruby{background:rgba(160,20,20,.3); border:1.5px solid rgba(220,60,60,.5);}
.mpg-icon-skull{background:rgba(60,60,60,.3); border:1.5px solid rgba(140,140,140,.3);}
.mpg-col{display:flex;flex-direction:column;gap:2px;}
.mpg-lbl{font-size:8px;color:#ffffff;letter-spacing:1.5px;}
.mpg-val{font-size:13px;color:#f0c030;line-height:1;}
.mpg-val-hp   {color:#38d068;}
.mpg-val-ruby {color:#f0c030;}
.mpg-val-gray {color:#909090;}
.mpg-bar-wrap{width:82px;display:flex;flex-direction:column;gap:2px;}
.mpg-bar-track{height:5px;background:rgba(0,0,0,.65);border-radius:3px;overflow:hidden;}
.mpg-bar-fill{height:100%;border-radius:3px;transition:width .4s ease;}
.mpg-fill-hp-hi{background:linear-gradient(90deg,#1a8040,#30d060);}
.mpg-fill-hp-md{background:linear-gradient(90deg,#806018,#c09028);}
.mpg-fill-hp-lo{background:linear-gradient(90deg,#801818,#c03020);}
.mpg-fill-xp   {background:linear-gradient(90deg,#1a50a0,#4090e0);}
.mpg-bar-sub{font-size:7.5px;color:#ffffff;letter-spacing:.5px;}
.mpg-lvl-circle{
  width:36px;height:36px;border-radius:50%;
  display:flex;align-items:center;justify-content:center;
  font-size:15px;flex-shrink:0;
  transition:border-color .4s,background .4s,color .4s;
}
.mpg-rank{font-size:9px;letter-spacing:1px;}
.mpg-stat-pill{
  display:flex;flex-direction:column;align-items:center;
  gap:1px;padding:5px 9px;
  background:rgba(0,0,0,.35);
  border-radius:6px;border:1px solid rgba(180,130,40,.15);
}
.mpg-stat-pill .sv{font-size:12px;color:#f0c030;}
.mpg-stat-pill .sl{font-size:7px;color:#ffffff;letter-spacing:1px;}
.mpg-hint{
  font-size:9px;color:#9a6020;letter-spacing:1px;
  text-align:center;line-height:1.5;
}
.mpg-divider{width:1px;background:rgba(100,50,8,.35);align-self:stretch;margin:8px 0;flex-shrink:0;}
`;

// ── Menu CSS ──────────────────────────────────────────────────────────────────
const MENU_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@400;700&family=IM+Fell+English:ital@0;1&display=swap');

#mpg-menu-overlay {
  position: fixed;
  inset: 0;
  z-index: 999990;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  transition: opacity .6s ease;
}
#mpg-menu-overlay.hidden {
  opacity: 0;
  pointer-events: none;
}

/* ocean background */
#mpg-menu-ocean {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, #03040f 0%, #040d24 35%, #061830 60%, #082040 100%);
}

/* stars */
#mpg-menu-stars {
  position: absolute;
  inset: 0;
  overflow: hidden;
}
.mpg-star {
  position: absolute;
  background: #fff;
  border-radius: 50%;
  animation: starTwinkle var(--d, 3s) ease-in-out infinite;
  animation-delay: var(--delay, 0s);
  opacity: var(--op, 0.7);
}
@keyframes starTwinkle {
  0%, 100% { opacity: var(--op, 0.7); transform: scale(1); }
  50%       { opacity: 0.15;           transform: scale(0.6); }
}

/* moon */
#mpg-menu-moon {
  position: absolute;
  top: 48px;
  right: 100px;
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: radial-gradient(circle at 38% 38%, #fffbe8, #f0d060 60%, #b08820);
  box-shadow: 0 0 40px rgba(240,210,80,.35), 0 0 80px rgba(220,180,40,.15);
}
#mpg-menu-moon::after {
  content: '';
  position: absolute;
  top: 8px; right: -6px;
  width: 52px; height: 52px;
  border-radius: 50%;
  background: #061830;
}

/* SVG waves */
#mpg-menu-waves {
  position: absolute;
  bottom: 0; left: 0; right: 0;
  height: 55%;
  pointer-events: none;
}

/* boat */
#mpg-menu-boat-wrap {
  position: absolute;
  bottom: 38%;
  left: 50%;
  transform: translateX(-50%);
  animation: boatRock 4s ease-in-out infinite;
  transform-origin: center bottom;
  filter: drop-shadow(0 8px 24px rgba(0,0,0,.7));
}
@keyframes boatRock {
  0%   { transform: translateX(-50%) rotate(-2.5deg) translateY(0px); }
  25%  { transform: translateX(-50%) rotate(0deg)    translateY(-5px); }
  50%  { transform: translateX(-50%) rotate(2.5deg)  translateY(0px); }
  75%  { transform: translateX(-50%) rotate(0deg)    translateY(-5px); }
  100% { transform: translateX(-50%) rotate(-2.5deg) translateY(0px); }
}

/* panel */
#mpg-menu-panel {
  position: relative;
  z-index: 10;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 18px;
  padding: 44px 52px 36px;
  background: rgba(4, 10, 24, 0.72);
  border: 2px solid rgba(180, 130, 30, 0.45);
  border-radius: 20px;
  backdrop-filter: blur(12px);
  box-shadow: 0 0 80px rgba(180,80,10,.18), inset 0 0 60px rgba(0,0,0,.4);
  font-family: 'IM Fell English', serif;
  min-width: 340px;
  animation: panelDrift 8s ease-in-out infinite;
}
@keyframes panelDrift {
  0%, 100% { transform: translateY(0px); }
  50%       { transform: translateY(-6px); }
}

#mpg-menu-eyecatcher {
  font-size: 52px;
  line-height: 1;
  filter: drop-shadow(0 4px 16px rgba(220,140,10,.55));
  animation: skullSway 5s ease-in-out infinite;
}
@keyframes skullSway {
  0%, 100% { transform: rotate(-4deg); }
  50%       { transform: rotate(4deg); }
}

#mpg-menu-title {
  font-family: 'Cinzel Decorative', cursive;
  color: #e8a020;
  font-size: 30px;
  letter-spacing: 4px;
  text-align: center;
  text-shadow: 0 0 30px rgba(220,140,10,.5), 0 2px 0 rgba(0,0,0,.8);
  margin-bottom: -4px;
}
#mpg-menu-subtitle {
  font-family: 'IM Fell English', serif;
  color: rgba(190, 145, 70, 0.6);
  font-size: 13px;
  font-style: italic;
  letter-spacing: 2px;
  text-align: center;
}
#mpg-menu-divider {
  width: 200px;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(180,130,30,.6), transparent);
  margin: 2px 0;
}

/* animated coin row */
#mpg-menu-coins {
  display: flex;
  gap: 10px;
  align-items: center;
}
.mpg-coin {
  font-size: 18px;
  animation: coinSpin var(--dur,1.8s) ease-in-out infinite;
  animation-delay: var(--del, 0s);
}
@keyframes coinSpin {
  0%,100% { transform: rotateY(0deg) scale(1); }
  40%     { transform: rotateY(180deg) scale(0.7); }
  80%     { transform: rotateY(360deg) scale(1); }
}

#mpg-play-btn {
  font-family: 'Cinzel Decorative', cursive;
  font-size: 15px;
  letter-spacing: 3px;
  color: #f0c030;
  background: rgba(130, 65, 6, 0.8);
  border: 2px solid #c08018;
  border-radius: 10px;
  padding: 15px 56px;
  cursor: pointer;
  transition: background .18s, transform .12s, box-shadow .18s;
  position: relative;
  overflow: hidden;
}
#mpg-play-btn::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(255,200,80,.08) 0%, transparent 60%);
  pointer-events: none;
}
#mpg-play-btn:hover {
  background: rgba(200,110,12,.9);
  color: #fff;
  transform: scale(1.06);
  box-shadow: 0 0 28px rgba(200,140,20,.35);
}
#mpg-play-btn:active { transform: scale(0.97); }

#mpg-menu-hint {
  font-family: 'Cinzel Decorative', cursive;
  font-size: 8.5px;
  color: rgba(140, 90, 30, 0.5);
  letter-spacing: 1.5px;
  text-align: center;
  line-height: 1.9;
}
`;

// ── MenuScreen ─────────────────────────────────────────────────────────────────
class MenuScreen {
  constructor(onPlay) {
    this._onPlay = onPlay;
    this._raf = null;
    this._waveOffset = 0;
    if (!document.getElementById('mpg-menu-style')) {
      const s = document.createElement('style');
      s.id = 'mpg-menu-style';
      s.textContent = MENU_CSS;
      document.head.appendChild(s);
    }
    this._build();
    this._animateWaves();
  }

  _build() {
    this.overlay = document.createElement('div');
    this.overlay.id = 'mpg-menu-overlay';

    // Stars HTML
    let starsHtml = '';
    for (let i = 0; i < 80; i++) {
      const x = Math.random() * 100;
      const y = Math.random() * 55;
      const size = Math.random() * 2.2 + 0.6;
      const dur = (2 + Math.random() * 4).toFixed(1);
      const delay = (Math.random() * 4).toFixed(1);
      const op = (0.4 + Math.random() * 0.6).toFixed(2);
      starsHtml += `<div class="mpg-star" style="left:${x.toFixed(1)}%;top:${y.toFixed(1)}%;width:${size.toFixed(1)}px;height:${size.toFixed(1)}px;--d:${dur}s;--delay:${delay}s;--op:${op};"></div>`;
    }

    // Coins
    const coinDelays = [0, 0.3, 0.6, 0.9, 1.2];
    const coinsHtml = ['💎','⚓','💎','⚓','💎'].map((c, i) =>
      `<span class="mpg-coin" style="--dur:${(1.6+i*0.15).toFixed(2)}s;--del:${coinDelays[i]}s;">${c}</span>`
    ).join('');

    this.overlay.innerHTML = `
      <div id="mpg-menu-ocean"></div>
      <div id="mpg-menu-stars">${starsHtml}</div>
      <div id="mpg-menu-moon"></div>
      <svg id="mpg-menu-waves" viewBox="0 0 1440 320" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="wg1" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#0a2a50" stop-opacity="0.95"/>
            <stop offset="100%" stop-color="#051525" stop-opacity="1"/>
          </linearGradient>
          <linearGradient id="wg2" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#0d3560" stop-opacity="0.8"/>
            <stop offset="100%" stop-color="#071c38" stop-opacity="1"/>
          </linearGradient>
          <linearGradient id="wg3" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#122a4a" stop-opacity="0.6"/>
            <stop offset="100%" stop-color="#0a1e33" stop-opacity="1"/>
          </linearGradient>
        </defs>
        <path id="mpg-wave3" fill="url(#wg3)" d=""/>
        <path id="mpg-wave2" fill="url(#wg2)" d=""/>
        <path id="mpg-wave1" fill="url(#wg1)" d=""/>
        <!-- foam lines -->
        <path id="mpg-foam1" fill="none" stroke="rgba(180,220,255,0.18)" stroke-width="2" d=""/>
        <path id="mpg-foam2" fill="none" stroke="rgba(180,220,255,0.10)" stroke-width="1.5" d=""/>
      </svg>
      <div id="mpg-menu-boat-wrap">
        <svg width="180" height="120" viewBox="0 0 180 120" xmlns="http://www.w3.org/2000/svg">
          <!-- hull -->
          <path d="M20 72 Q90 92 160 72 L150 88 Q90 105 30 88 Z" fill="#5c2e08" stroke="#3a1c04" stroke-width="2"/>
          <path d="M24 76 Q90 94 156 76" fill="none" stroke="#8a4a14" stroke-width="1.5" opacity="0.6"/>
          <!-- hull band -->
          <path d="M30 88 Q90 105 150 88 L148 92 Q90 108 32 92 Z" fill="#3a1c04"/>
          <!-- deck -->
          <rect x="32" y="66" width="116" height="8" rx="3" fill="#7a3e10" stroke="#5c2e08" stroke-width="1"/>
          <!-- mast -->
          <line x1="90" y1="10" x2="90" y2="70" stroke="#4a2206" stroke-width="5" stroke-linecap="round"/>
          <line x1="90" y1="10" x2="90" y2="70" stroke="#7a3e10" stroke-width="2" stroke-linecap="round"/>
          <!-- main sail -->
          <path d="M90 14 Q130 28 128 62 L90 68 Z" fill="rgba(240,220,180,0.92)" stroke="#c8a850" stroke-width="1.5"/>
          <!-- sail shading -->
          <path d="M90 14 Q110 30 108 62 L90 68 Z" fill="rgba(200,170,110,0.3)"/>
          <!-- horizontal sail lines -->
          <line x1="90" y1="30" x2="124" y2="32" stroke="#c8a850" stroke-width="0.8" opacity="0.5"/>
          <line x1="90" y1="46" x2="126" y2="49" stroke="#c8a850" stroke-width="0.8" opacity="0.5"/>
          <!-- skull on sail -->
          <text x="112" y="46" font-size="18" text-anchor="middle" dominant-baseline="middle" opacity="0.85">☠</text>
          <!-- fore sail -->
          <path d="M90 20 Q62 34 60 62 L90 68 Z" fill="rgba(230,210,165,0.7)" stroke="#b89840" stroke-width="1"/>
          <!-- flag -->
          <line x1="90" y1="10" x2="90" y2="0" stroke="#2a0e02" stroke-width="2"/>
          <path d="M90 0 L110 5 L90 10 Z" fill="#1a0000" stroke="#300" stroke-width="0.5"/>
          <text x="100" y="7" font-size="7" text-anchor="middle" dominant-baseline="middle" fill="#c00">☠</text>
          <!-- porthole -->
          <circle cx="55" cy="78" r="5" fill="#1a0e04" stroke="#c8a020" stroke-width="1.5"/>
          <circle cx="55" cy="78" r="2.5" fill="#2a1a06" opacity="0.8"/>
          <circle cx="125" cy="78" r="5" fill="#1a0e04" stroke="#c8a020" stroke-width="1.5"/>
          <circle cx="125" cy="78" r="2.5" fill="#2a1a06" opacity="0.8"/>
          <!-- water reflection under hull -->
          <path d="M30 92 Q90 108 150 92" fill="none" stroke="rgba(80,160,220,0.2)" stroke-width="2"/>
        </svg>
      </div>
      <div id="mpg-menu-panel">
        <div id="mpg-menu-eyecatcher">☠</div>
        <div id="mpg-menu-title">Market Pirate</div>
        <div id="mpg-menu-subtitle">Port o' Thieves — Est. 1689</div>
        <div id="mpg-menu-divider"></div>
        <div id="mpg-menu-coins">${coinsHtml}</div>
        <button id="mpg-play-btn">⚓ Set Sail</button>
        <div id="mpg-menu-hint">WASD to move · E to interact · E near enemies to fight</div>
      </div>`;

    document.body.appendChild(this.overlay);
    document.getElementById('mpg-play-btn').addEventListener('click', () => this._play());
  }

  _wavePath(offset, amplitude, period, yBase, viewH) {
    const W = 1440;
    let d = `M0 ${viewH}`;
    d += ` L0 ${yBase}`;
    // build wave using cubic bezier segments
    const segs = 6;
    const segW = W / segs;
    for (let i = 0; i < segs; i++) {
      const x0 = i * segW;
      const x1 = x0 + segW * 0.5;
      const x2 = x0 + segW;
      const y0 = yBase + Math.sin((x0 / W) * period * Math.PI * 2 + offset) * amplitude;
      const y1 = yBase + Math.sin((x1 / W) * period * Math.PI * 2 + offset) * amplitude;
      const y2 = yBase + Math.sin((x2 / W) * period * Math.PI * 2 + offset) * amplitude;
      if (i === 0) d += ` Q${x1} ${y1} ${x2} ${y2}`;
      else         d += ` Q${x1} ${y1} ${x2} ${y2}`;
    }
    d += ` L${W} ${viewH} Z`;
    return d;
  }

  _animateWaves() {
    const VW = 1440, VH = 320;
    const w1 = document.getElementById('mpg-wave1');
    const w2 = document.getElementById('mpg-wave2');
    const w3 = document.getElementById('mpg-wave3');
    const f1 = document.getElementById('mpg-foam1');
    const f2 = document.getElementById('mpg-foam2');
    const boatWrap = document.getElementById('mpg-menu-boat-wrap');

    let t = 0;
    const tick = () => {
      t += 0.008;

      if (w1) w1.setAttribute('d', this._wavePath(t,       22, 2.0, 60,  VH));
      if (w2) w2.setAttribute('d', this._wavePath(t+1.2,   30, 1.6, 100, VH));
      if (w3) w3.setAttribute('d', this._wavePath(t+2.5,   18, 2.4, 140, VH));

      // foam follows wave 1 top edge
      if (f1) {
        let fd = `M0 ${60 + Math.sin(t) * 22}`;
        for (let i = 1; i <= 6; i++) {
          const x = (i / 6) * VW;
          const y = 60 + Math.sin((i / 6) * 2.0 * Math.PI * 2 + t) * 22;
          fd += ` L${x} ${y}`;
        }
        f1.setAttribute('d', fd);
      }
      if (f2) {
        let fd = `M0 ${100 + Math.sin(t + 1.2) * 30}`;
        for (let i = 1; i <= 6; i++) {
          const x = (i / 6) * VW;
          const y = 100 + Math.sin((i / 6) * 1.6 * Math.PI * 2 + (t + 1.2)) * 30;
          fd += ` L${x} ${y}`;
        }
        f2.setAttribute('d', fd);
      }

      // boat bobs with wave 1 at center x
      if (boatWrap) {
        const waveY = Math.sin(t) * 22; // wave1 amplitude at center
        const extra = waveY * 0.28; // subtle vertical nudge tied to wave
        boatWrap.style.marginBottom = `${extra.toFixed(1)}px`;
      }

      this._raf = requestAnimationFrame(tick);
    };
    this._raf = requestAnimationFrame(tick);
  }

  _play() {
    this.overlay.classList.add('hidden');
    setTimeout(() => { this.destroy(); this._onPlay?.(); }, 600);
  }

  destroy() {
    if (this._raf) cancelAnimationFrame(this._raf);
    this._raf = null;
    this.overlay?.remove();
    document.getElementById('mpg-menu-style')?.remove();
  }
}

// ── BattleUI ──────────────────────────────────────────────────────────────────
class BattleUI {
  constructor(enemyType, onClose, startingHp=80, playerLevel=1, playerAtk=10, playerDef=3, playerMaxHp=80) {
    this.onClose       = onClose;
    this.enemy         = { ...enemyType, curHp: enemyType.hp };
    this.player        = { name:'McArchie', maxHp:playerMaxHp, curHp:startingHp, atk:playerAtk, def:playerDef };
    this.playerLevel   = playerLevel;
    this.defending     = false;
    this.busy          = false;
    this._earnedRubies = 0;
    this._earnedXp     = 0;
    this._build();
    this._bind();
    this._log(`⚔ A Lv.${this.enemy.level} ${this.enemy.name} appears!`, 'special');
  }

  _build() {
    this.overlay = document.createElement('div');
    this.overlay.id = 'battle-overlay';
    const plvlC = levelColor(this.playerLevel);
    const elvlC = levelColor(this.enemy.level);
    this.overlay.innerHTML = `
      <div id="battle-panel">
        <div id="battle-header">
          <div id="battle-title">☠ COMBAT</div>
          <div id="b-rarity-badge" style="font-family:'Cinzel Decorative',cursive;font-size:10px;padding:3px 10px;border-radius:5px;letter-spacing:1px;"></div>
        </div>
        <div id="battle-arena">
          <div class="b-fighter">
            <div class="b-fighter-icon" id="b-player-icon">🏴‍☠️</div>
            <div class="b-fighter-name">McArchie</div>
            <div class="b-level-badge" style="background:${plvlC.bg};color:${plvlC.color}">LVL ${this.playerLevel}</div>
            <div class="b-hp-bar-wrap"><div class="b-hp-bar player" id="b-player-hp"></div></div>
            <div class="b-hp-text" id="b-player-hp-text">${this.player.curHp} / ${this.player.maxHp}</div>
          </div>
          <div id="b-vs">VS</div>
          <div class="b-fighter">
            <div class="b-fighter-icon" id="b-enemy-icon"></div>
            <div class="b-fighter-name" id="b-enemy-name"></div>
            <div class="b-level-badge" style="background:${elvlC.bg};color:${elvlC.color}">LVL ${this.enemy.level}</div>
            <div class="b-hp-bar-wrap"><div class="b-hp-bar enemy" id="b-enemy-hp"></div></div>
            <div class="b-hp-text" id="b-enemy-hp-text"></div>
          </div>
        </div>
        <div id="battle-log"></div>
        <div id="battle-actions">
          <button class="b-action-btn b-btn-attack"  id="b-attack"><span class="b-action-icon">⚔</span>Attack<span class="b-action-sub">Deal steady damage</span></button>
          <button class="b-action-btn b-btn-special" id="b-special"><span class="b-action-icon">💥</span>Special<span class="b-action-sub">High risk, high reward</span></button>
          <button class="b-action-btn b-btn-defend"  id="b-defend"><span class="b-action-icon">🛡</span>Defend<span class="b-action-sub">Halve next hit taken</span></button>
          <button class="b-action-btn b-btn-flee"    id="b-flee"><span class="b-action-icon">💨</span>Flee<span class="b-action-sub">50% chance to escape</span></button>
        </div>
        <div id="battle-reward">
          <div id="b-reward-icon">💰</div>
          <div id="b-reward-title">VICTORY!</div>
          <div id="b-reward-rubies"><span class="b-ruby-icon-lg">💎</span><span id="b-ruby-amount">0</span> Rubies</div>
          <div id="b-reward-xp"></div>
          <button id="b-reward-btn">Claim Reward</button>
        </div>
        <div id="battle-defeat">
          <div style="font-size:52px">💀</div>
          <div id="b-defeat-title">DEFEATED!</div>
          <div style="font-family:'IM Fell English',serif;color:rgba(200,150,100,.7);font-size:13px;">Ye fought bravely, sailor...</div>
          <button id="b-defeat-btn">Retreat</button>
        </div>
      </div>`;
    document.body.appendChild(this.overlay);
    document.getElementById('b-enemy-icon').textContent    = this.enemy.icon;
    document.getElementById('b-enemy-name').textContent    = this.enemy.name;
    document.getElementById('b-enemy-hp-text').textContent = `${this.enemy.hp} / ${this.enemy.hp}`;
    this._updateBars();
    const rc = {common:{bg:'rgba(80,80,80,.5)',color:'#ccc'},uncommon:{bg:'rgba(20,100,30,.5)',color:'#90ee90'},rare:{bg:'rgba(25,55,150,.5)',color:'#80b0ff'},epic:{bg:'rgba(90,15,130,.5)',color:'#dd90ff'},legendary:{bg:'rgba(160,90,0,.5)',color:'#ffc060'}}[this.enemy.rarity]||{bg:'rgba(80,80,80,.5)',color:'#ccc'};
    const badge = document.getElementById('b-rarity-badge');
    badge.textContent = this.enemy.rarity.toUpperCase();
    badge.style.background = rc.bg;
    badge.style.color = rc.color;
  }

  _bind() {
    document.getElementById('b-attack').addEventListener('click',  () => this._playerAction('attack'));
    document.getElementById('b-special').addEventListener('click', () => this._playerAction('special'));
    document.getElementById('b-defend').addEventListener('click',  () => this._playerAction('defend'));
    document.getElementById('b-flee').addEventListener('click',    () => this._playerAction('flee'));
    document.getElementById('b-reward-btn').addEventListener('click', () => {
      const r=this._earnedRubies, xp=this._earnedXp, hp=this.player.curHp;
      this.destroy(); this.onClose?.(r,false,hp,xp);
    });
    document.getElementById('b-defeat-btn').addEventListener('click', () => {
      this.destroy(); this.onClose?.(0,true,0,0);
    });
  }

  _log(msg, cls='') {
    const log = document.getElementById('battle-log');
    if (!log) return;
    const el = document.createElement('div');
    el.className = 'b-log-entry'+(cls?' '+cls:'');
    el.textContent = msg;
    log.appendChild(el);
    log.scrollTop = log.scrollHeight;
  }

  _updateBars() {
    const pp = Math.max(0, this.player.curHp/this.player.maxHp*100);
    const ep = Math.max(0, this.enemy.curHp /this.enemy.hp   *100);
    const pb = document.getElementById('b-player-hp');
    if (pb) { pb.style.width=pp+'%'; pb.style.background=pp>50?'linear-gradient(90deg,#20a050,#40e080)':pp>25?'linear-gradient(90deg,#a08020,#e0c030)':'linear-gradient(90deg,#a02020,#e05030)'; }
    const eb = document.getElementById('b-enemy-hp'); if(eb) eb.style.width=ep+'%';
    const pt = document.getElementById('b-player-hp-text'); if(pt) pt.textContent=`${Math.max(0,this.player.curHp)} / ${this.player.maxHp}`;
    const et = document.getElementById('b-enemy-hp-text');  if(et) et.textContent=`${Math.max(0,this.enemy.curHp)} / ${this.enemy.hp}`;
  }

  _shake(id) {
    const el=document.getElementById(id); if(!el) return;
    el.classList.remove('shake'); void el.offsetWidth; el.classList.add('shake');
    setTimeout(()=>el.classList.remove('shake'),400);
  }

  _setButtons(disabled) {
    ['b-attack','b-special','b-defend','b-flee'].forEach(id=>{const el=document.getElementById(id);if(el)el.disabled=disabled;});
  }

  async _playerAction(action) {
    if (this.busy) return;
    this.busy = true;
    this._setButtons(true);

    if (action==='attack') {
      const dmg=Math.max(1,this.player.atk+Math.floor(Math.random()*8)-this.enemy.def);
      this._shake('b-enemy-icon');
      this._log(`⚔ McArchie strikes for ${dmg} damage!`,'hit-enemy');
      this.enemy.curHp-=dmg; this._updateBars();
    } else if (action==='special') {
      if (Math.random()<0.35) { this._log(`💥 Special missed! The enemy dodged!`); }
      else {
        const dmg=Math.max(1,this.player.atk*2+Math.floor(Math.random()*14)-this.enemy.def);
        this._shake('b-enemy-icon');
        this._log(`💥 SPECIAL ATTACK for ${dmg} damage!`,'special');
        this.enemy.curHp-=dmg; this._updateBars();
      }
    } else if (action==='defend') {
      this.defending=true; this._log(`🛡 McArchie braces for the next blow!`);
    } else if (action==='flee') {
      if (Math.random()<0.5) {
        this._log(`💨 McArchie escaped!`,'special');
        await this._wait(900); this.busy=false; this.destroy();
        this.onClose?.(0,false,this.player.curHp,0); return;
      }
      this._log(`💨 Couldn't flee — the enemy blocks the way!`);
    }

    await this._wait(480);
    if (this.enemy.curHp<=0) { await this._showVictory(); this.busy=false; return; }

    const levelDiff=this.enemy.level-this.playerLevel;
    const scaleMult=Math.max(0.5,1+levelDiff*0.08);
    const isPower=Math.random()<0.2;
    let dmg=Math.max(1,Math.round((this.enemy.atk+Math.floor(Math.random()*6)-this.player.def)*scaleMult));
    if (isPower) dmg=Math.floor(dmg*1.8);
    if (this.defending) dmg=Math.floor(dmg*0.5);
    this._log(isPower?`${this.enemy.icon} ${this.enemy.name} (Lv.${this.enemy.level}) unleashes a powerful blow for ${dmg}!`:`${this.enemy.icon} ${this.enemy.name} (Lv.${this.enemy.level}) attacks for ${dmg}!`,'hit-player');
    this._shake('b-player-icon');
    this.player.curHp-=dmg; this._updateBars();
    this.defending=false;
    await this._wait(400);
    if (this.player.curHp<=0) { await this._showDefeat(); this.busy=false; return; }
    this.busy=false; this._setButtons(false);
  }

  async _showVictory() {
    const [min,max]=this.enemy.reward;
    this._earnedRubies=min+Math.floor(Math.random()*(max-min+1));
    this._earnedXp=RARITY_XP[this.enemy.rarity]||20;
    const lvlBonus=Math.max(0,this.enemy.level-this.playerLevel);
    this._earnedXp+=lvlBonus*15;
    document.getElementById('battle-actions').style.display='none';
    document.getElementById('battle-log').style.display='none';
    document.getElementById('b-ruby-amount').textContent=this._earnedRubies;
    document.getElementById('b-reward-xp').textContent=`+${this._earnedXp} XP`;
    document.getElementById('battle-reward').classList.add('show');
  }

  async _showDefeat() {
    document.getElementById('battle-actions').style.display='none';
    document.getElementById('battle-log').style.display='none';
    document.getElementById('battle-defeat').classList.add('show');
  }

  _wait(ms) { return new Promise(r=>setTimeout(r,ms)); }
  destroy()  { if(this.overlay?.parentNode) this.overlay.remove(); }
}

// ── MarketplaceUI ─────────────────────────────────────────────────────────────
const MARKETPLACE_CSS = (path) => `
@import url('https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@400;700&family=IM+Fell+English:ital@0;1&display=swap');
#marketplace-overlay{position:fixed;inset:0;z-index:99998;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,.78);backdrop-filter:blur(3px);animation:mpFadeIn .25s ease}
@keyframes mpFadeIn{from{opacity:0}to{opacity:1}}
#marketplace-panel{width:min(980px,96vw);max-height:86vh;background:linear-gradient(160deg,#1a0e04 0%,#0d0804 100%);border:3px solid #8a5010;border-radius:16px;display:flex;flex-direction:column;overflow:hidden;box-shadow:0 0 60px rgba(200,120,20,.18),inset 0 0 80px rgba(0,0,0,.5);font-family:'IM Fell English',serif}
#mp-header{display:flex;align-items:center;justify-content:space-between;padding:14px 22px;border-bottom:2px solid #5a3010;background:rgba(0,0,0,.4);gap:12px;flex-shrink:0}
#mp-title{font-family:'Cinzel Decorative',cursive;color:#e8b030;font-size:18px;letter-spacing:2px}
#mp-title small{display:block;color:#a07838;font-size:10px;letter-spacing:3px;margin-top:2px;font-family:'IM Fell English',serif}
#mp-hud{display:flex;align-items:center;gap:8px;background:rgba(0,0,0,.55);border:2px solid #6a3808;border-radius:30px;padding:6px 16px}
#mp-ruby-icon{width:28px;height:28px;background-image:url('${path}/images/gamebuilder/sprites/ruby.png');background-size:contain;background-repeat:no-repeat;background-position:center;image-rendering:pixelated;filter:drop-shadow(0 0 4px rgba(255,80,80,.55))}
#mp-ruby-count{font-family:'Cinzel Decorative',cursive;color:#f5c030;font-size:20px;min-width:40px;text-align:right}
#mp-close-btn{background:rgba(120,30,10,.5);border:1.5px solid #8a3010;border-radius:8px;color:#e8a030;font-family:'Cinzel Decorative',cursive;font-size:11px;padding:7px 14px;cursor:pointer;letter-spacing:1px;transition:background .15s}
#mp-close-btn:hover{background:rgba(200,60,20,.55);color:#fff}
#mp-tabs{display:flex;gap:5px;padding:10px 22px 0;border-bottom:2px solid rgba(180,110,30,.3);flex-shrink:0;flex-wrap:wrap}
.mp-tab{background:rgba(0,0,0,.4);border:1.5px solid rgba(180,110,30,.3);border-bottom:none;border-radius:7px 7px 0 0;color:#a07838;font-family:'Cinzel Decorative',cursive;font-size:10px;padding:7px 14px;cursor:pointer;letter-spacing:1px;transition:background .15s,color .15s}
.mp-tab:hover:not(.active){background:rgba(160,100,20,.2);color:#e0a040}
.mp-tab.active{background:rgba(140,80,10,.45);color:#f5c030;border-color:#9a6010;border-bottom-color:transparent}
#mp-shopgrid{display:grid;grid-template-columns:repeat(auto-fill,minmax(168px,1fr));gap:14px;padding:18px 22px;overflow-y:auto;flex:1}
#mp-shopgrid::-webkit-scrollbar{width:5px}#mp-shopgrid::-webkit-scrollbar-track{background:rgba(0,0,0,.3)}#mp-shopgrid::-webkit-scrollbar-thumb{background:#6a3808;border-radius:4px}
.mp-card{background:linear-gradient(160deg,rgba(44,22,5,.94) 0%,rgba(24,10,2,.96) 100%);border:2px solid rgba(140,80,20,.45);border-radius:11px;padding:14px 12px;display:flex;flex-direction:column;gap:8px;position:relative;overflow:hidden;transition:border-color .2s,transform .15s}
.mp-card::before{content:'';position:absolute;inset:0;background:radial-gradient(ellipse at 50% 0%,rgba(220,160,40,.05) 0%,transparent 65%);pointer-events:none}
.mp-card:hover:not(.locked){border-color:rgba(220,150,30,.75);transform:translateY(-3px)}
.mp-card.owned{border-color:rgba(50,170,70,.5)}.mp-card.owned::after{content:'OWNED';position:absolute;top:8px;right:8px;background:rgba(30,140,55,.85);color:#a0ffb0;font-family:'Cinzel Decorative',cursive;font-size:8px;padding:3px 7px;border-radius:4px;letter-spacing:1px}
.mp-card.locked{opacity:.5;filter:grayscale(.4)}.mp-card.locked::after{content:'LOCKED';position:absolute;top:8px;right:8px;background:rgba(80,20,20,.9);color:#ff9090;font-family:'Cinzel Decorative',cursive;font-size:8px;padding:3px 7px;border-radius:4px;letter-spacing:1px}
.mp-rarity{position:absolute;top:7px;left:9px;font-size:8px;font-family:'Cinzel Decorative',cursive;letter-spacing:1px;padding:2px 6px;border-radius:4px}
.r-common{background:rgba(90,90,90,.5);color:#ccc}.r-uncommon{background:rgba(20,110,35,.5);color:#90ee90}.r-rare{background:rgba(25,55,150,.5);color:#80b0ff}.r-epic{background:rgba(90,15,130,.5);color:#dd90ff}.r-legendary{background:rgba(160,90,0,.5);color:#ffc060}
.mp-icon{font-size:38px;text-align:center;padding-top:18px;line-height:1}
.mp-name{font-family:'Cinzel Decorative',cursive;color:#e8b030;font-size:11px;text-align:center;letter-spacing:.5px}
.mp-desc{color:rgba(210,175,115,.7);font-size:11px;font-style:italic;text-align:center;line-height:1.4}
.mp-stats{display:flex;flex-wrap:wrap;gap:4px;justify-content:center}
.mp-stat{background:rgba(0,0,0,.4);border:1px solid rgba(180,130,40,.2);border-radius:4px;padding:2px 7px;font-size:10px;color:#c49840}
.mp-stat.pos{color:#78e878;border-color:rgba(60,180,60,.25)}.mp-stat.neg{color:#e87878;border-color:rgba(180,60,60,.25)}
.mp-req-level{font-family:'Cinzel Decorative',cursive;font-size:9px;text-align:center;letter-spacing:1px;padding:1px 0}
.mp-price{display:flex;align-items:center;justify-content:center;gap:5px;padding-top:4px;border-top:1px solid rgba(180,130,40,.15)}
.mp-price-ruby{width:18px;height:18px;background-image:url('${path}/images/gamebuilder/sprites/ruby.png');background-size:contain;background-repeat:no-repeat;background-position:center;image-rendering:pixelated}
.mp-price-num{font-family:'Cinzel Decorative',cursive;color:#f0c030;font-size:15px}
.mp-buy-btn,.mp-sell-btn{width:100%;padding:7px;border-radius:6px;font-family:'Cinzel Decorative',cursive;font-size:10px;cursor:pointer;letter-spacing:1px;transition:background .15s,transform .1s}
.mp-buy-btn{background:rgba(140,75,8,.7);border:1.5px solid #b07010;color:#f0c030}
.mp-buy-btn:hover:not(:disabled){background:rgba(210,120,15,.75);color:#fff;transform:scale(1.02)}
.mp-buy-btn:disabled{opacity:.38;cursor:not-allowed}
.mp-sell-btn{background:rgba(15,70,25,.6);border:1.5px solid rgba(50,150,50,.5);color:#80ee80}
.mp-sell-btn:hover{background:rgba(30,120,40,.7)}
#mp-inv-panel{position:absolute;right:-360px;top:0;bottom:0;width:320px;background:linear-gradient(180deg,rgba(18,6,1,.99) 0%,rgba(8,4,1,1) 100%);border-left:3px solid #6a3808;z-index:10;padding:20px 16px;overflow-y:auto;transition:right .28s cubic-bezier(.4,0,.2,1)}
#mp-inv-panel.open{right:0}
#mp-inv-panel::-webkit-scrollbar{width:4px}#mp-inv-panel::-webkit-scrollbar-thumb{background:#5a2808;border-radius:3px}
#mp-inv-title{font-family:'Cinzel Decorative',cursive;color:#e8b030;font-size:14px;text-align:center;padding-bottom:12px;border-bottom:1.5px solid rgba(180,110,30,.3);margin-bottom:14px;letter-spacing:2px}
#mp-inv-close{float:right;background:none;border:none;color:#a07028;font-size:18px;cursor:pointer;margin-top:-3px;transition:color .15s}
#mp-inv-close:hover{color:#f0c030}
.mp-inv-empty{color:rgba(160,120,60,.45);font-style:italic;text-align:center;padding:20px 0;font-size:13px}
.mp-inv-item{display:flex;align-items:center;gap:9px;padding:9px;border:1px solid rgba(180,120,40,.18);border-radius:7px;margin-bottom:7px;background:rgba(35,14,3,.6)}
.mp-inv-icon{font-size:24px;flex-shrink:0;line-height:1}
.mp-inv-name{font-family:'Cinzel Decorative',cursive;color:#e0a828;font-size:11px;letter-spacing:.5px}
.mp-inv-meta{color:rgba(180,140,70,.65);font-size:10px;font-style:italic}
#mp-inv-toggle{background:rgba(25,10,2,.97);border:2px solid #7a4010;border-radius:40px;padding:9px 18px;color:#e8b030;font-family:'Cinzel Decorative',cursive;font-size:11px;cursor:pointer;letter-spacing:1px;transition:background .15s;white-space:nowrap;flex-shrink:0}
#mp-inv-toggle:hover{background:rgba(80,35,5,.97)}
#mp-toast{position:absolute;bottom:24px;left:50%;transform:translateX(-50%) translateY(60px);background:rgba(18,8,2,.97);border:2px solid #7a4010;border-radius:9px;padding:11px 26px;color:#f0c030;font-family:'Cinzel Decorative',cursive;font-size:11px;z-index:9999;opacity:0;pointer-events:none;letter-spacing:1px;text-align:center;transition:transform .3s cubic-bezier(.34,1.56,.64,1),opacity .3s;white-space:nowrap}
#mp-toast.show{transform:translateX(-50%) translateY(0);opacity:1}
#mp-toast.t-success{border-color:#30b050;color:#80ff90}
#mp-toast.t-err{border-color:#c02020;color:#ff8888}
`;

class MarketplaceUI {
  constructor(path, onClose, initialInventory=[], initialRubies=0, onHeal=null, playerLevel=1) {
    this.path=path; this.onClose=onClose; this.onHeal=onHeal;
    this.playerLevel=playerLevel; this.coins=initialRubies;
    this.inventory=[...initialInventory]; this.currentTab='weapons'; this._toastTimer=null;
    const old=document.getElementById('marketplace-style'); if(old) old.remove();
    this._injectCSS(path); this._buildDOM(); this._bindEvents();
    this._updateHUD(); this._renderShop(); this._renderInventory();
  }

  _injectCSS(path) {
    const s=document.createElement('style'); s.id='marketplace-style';
    s.textContent=MARKETPLACE_CSS(path); document.head.appendChild(s);
  }

  _buildDOM() {
    this.overlay=document.createElement('div'); this.overlay.id='marketplace-overlay';
    this.overlay.innerHTML=`
      <div id="marketplace-panel">
        <div id="mp-header">
          <div id="mp-title">☠ The Black Market<small>Port o' Thieves — Est. 1689</small></div>
          <div id="mp-hud"><div id="mp-ruby-icon"></div><div id="mp-ruby-count">0</div></div>
          <button id="mp-inv-toggle">🎒 Bag <span id="mp-inv-badge" style="display:none;background:#b02020;color:#fff;border-radius:50%;padding:1px 5px;font-size:9px;margin-left:3px;"></span></button>
          <button id="mp-close-btn">✕ Leave</button>
        </div>
        <div id="mp-tabs">
          <button class="mp-tab active" data-tab="weapons">⚔ Weapons</button>
          <button class="mp-tab" data-tab="armor">🛡 Armor</button>
          <button class="mp-tab" data-tab="potions">🧪 Potions</button>
          <button class="mp-tab" data-tab="maps">🗺 Maps</button>
          <button class="mp-tab" data-tab="misc">🔮 Misc</button>
        </div>
        <div id="mp-shopgrid"></div>
        <div id="mp-inv-panel">
          <div id="mp-inv-title"><button id="mp-inv-close">✕</button> McArchie's Bag</div>
          <div id="mp-invlist"></div>
        </div>
        <div id="mp-toast"></div>
      </div>`;
    document.body.appendChild(this.overlay);
    this.shopGrid=document.getElementById('mp-shopgrid');
    this.invList=document.getElementById('mp-invlist');
    this.invPanel=document.getElementById('mp-inv-panel');
    this.countEl=document.getElementById('mp-ruby-count');
    this.badge=document.getElementById('mp-inv-badge');
    this.toast=document.getElementById('mp-toast');
  }

  _bindEvents() {
    document.getElementById('mp-close-btn').addEventListener('click',()=>this.destroy());
    document.getElementById('mp-inv-toggle').addEventListener('click',()=>this._toggleInv());
    document.getElementById('mp-inv-close').addEventListener('click',()=>this._toggleInv());
    document.querySelectorAll('.mp-tab').forEach(btn=>{
      btn.addEventListener('click',()=>{
        document.querySelectorAll('.mp-tab').forEach(b=>b.classList.remove('active'));
        btn.classList.add('active'); this.currentTab=btn.dataset.tab; this._renderShop();
      });
    });
  }

  _updateHUD() { this.countEl.textContent=this.coins; }

  addRuby(n=1) {
    this.coins+=n; this._updateHUD(); this._renderShop();
    this._toast(`+${n} ${n===1?'Ruby':'Rubies'}!`,'success');
  }

  setPlayerLevel(lvl) { this.playerLevel=lvl; this._renderShop(); }

  _renderShop() {
    this.shopGrid.innerHTML='';
    const items=SHOP_DATA[this.currentTab]||[];
    const isPotion=this.currentTab==='potions';
    items.forEach(item=>{
      const owned=!isPotion&&this.inventory.some(i=>i.id===item.id);
      const canBuy=this.coins>=item.price;
      const minLvl=item.minLevel||1;
      const locked=!isPotion&&(this.playerLevel<minLvl);
      const lvlC=levelColor(minLvl);
      const card=document.createElement('div');
      card.className='mp-card'+(locked?' locked':owned?' owned':'');
      const statsHtml=item.stats.map(s=>`<span class="mp-stat ${s.startsWith('+')?'pos':s.startsWith('-')?'neg':''}">${s}</span>`).join('');
      const reqHtml=(!isPotion&&minLvl>1)?`<div class="mp-req-level" style="color:${lvlC.color}">⭐ Req. Lv.${minLvl}</div>`:'';
      let actionHtml;
      if (isPotion) actionHtml=`<button class="mp-buy-btn" data-id="${item.id}" data-potion="1" ${canBuy?'':'disabled'}>${canBuy?'🍺 Drink Now':'Need '+(item.price-this.coins)+' more'}</button>`;
      else if (locked) actionHtml=`<button class="mp-buy-btn" disabled>⭐ Lv.${minLvl} Required</button>`;
      else if (owned) actionHtml=`<button class="mp-sell-btn" data-id="${item.id}">Sell for ${Math.floor(item.price*0.5)} ◈</button>`;
      else actionHtml=`<button class="mp-buy-btn" data-id="${item.id}" ${canBuy?'':'disabled'}>${canBuy?'Purchase':'Need '+(item.price-this.coins)+' more'}</button>`;
      card.innerHTML=`
        <div class="mp-rarity r-${item.rarity}">${item.rarity.toUpperCase()}</div>
        <div class="mp-icon">${item.icon}</div>
        <div class="mp-name">${item.name}</div>
        <div class="mp-desc">${item.desc}</div>
        <div class="mp-stats">${statsHtml}</div>
        ${reqHtml}
        <div class="mp-price"><div class="mp-price-ruby"></div><div class="mp-price-num">${item.price}</div></div>
        ${actionHtml}`;
      if (!locked) {
        card.querySelector('[data-id]')?.addEventListener('click',(e)=>{
          if(e.currentTarget.dataset.potion) this._drinkPotion(item.id);
          else owned?this._sell(item.id):this._buy(item.id);
        });
      }
      this.shopGrid.appendChild(card);
    });
  }

  _buy(id) {
    const item=this._findItem(id);
    if(!item||this.coins<item.price){this._toast('Not enough rubies!','err');return;}
    if(this.playerLevel<(item.minLevel||1)){this._toast(`Requires Lv.${item.minLevel}!`,'err');return;}
    this.coins-=item.price; this.inventory.push(item);
    this._updateHUD(); this._renderShop(); this._renderInventory();
    this._toast(`${item.icon} ${item.name} acquired!`,'success');
  }

  _drinkPotion(id) {
    const item=this._findItem(id);
    if(!item||this.coins<item.price){this._toast('Not enough rubies!','err');return;}
    let healAmt=0;
    const fullHeal=item.stats.some(s=>s==='Full HP');
    if(!fullHeal){for(const s of item.stats){const m=s.match(/\+(\d+)\s*HP/i);if(m){healAmt=parseInt(m[1],10);break;}}}
    this.coins-=item.price; this._updateHUD(); this._renderShop();
    this.onHeal?.(healAmt,item,fullHeal);
    this._toast(`${item.icon} ${item.name} — restored ${fullHeal?'full':healAmt} HP!`,'success');
  }

  _sell(id) {
    const idx=this.inventory.findIndex(i=>i.id===id); if(idx<0) return;
    const item=this.inventory[idx]; const gain=Math.floor(item.price*0.5);
    this.coins+=gain; this.inventory.splice(idx,1);
    this._updateHUD(); this._renderShop(); this._renderInventory();
    this._toast(`Sold ${item.name} for ${gain} rubies.`);
  }

  _findItem(id) {
    for(const cat of Object.values(SHOP_DATA)){const f=cat.find(x=>x.id===id);if(f)return f;}
    return null;
  }

  _renderInventory() {
    this.badge.textContent=this.inventory.length;
    this.badge.style.display=this.inventory.length?'inline':'none';
    if(!this.inventory.length){this.invList.innerHTML='<p class="mp-inv-empty">Thy satchel is empty, sailor.</p>';return;}
    this.invList.innerHTML=this.inventory.map(item=>`
      <div class="mp-inv-item">
        <div class="mp-inv-icon">${item.icon}</div>
        <div><div class="mp-inv-name">${item.name}</div><div class="mp-inv-meta">${item.rarity} · ${item.stats[0]||''}</div></div>
      </div>`).join('');
  }

  _toggleInv() { this.invPanel.classList.toggle('open'); }

  _toast(msg,type='') {
    this.toast.textContent=msg;
    this.toast.className='mp-toast show'+(type?` t-${type}`:'');
    clearTimeout(this._toastTimer);
    this._toastTimer=setTimeout(()=>{this.toast.className='mp-toast'+(type?` t-${type}`:'');},2400);
  }

  destroy() { if(this.overlay?.parentNode) this.overlay.remove(); this.onClose?.(); }
  getInventory() { return [...this.inventory]; }
  getRubies()    { return this.coins; }
}

// ── WorldEnemy ────────────────────────────────────────────────────────────────
class WorldEnemy {
  constructor(enemyType, logicalX, logicalY, container) {
    this.type=enemyType; this.defeated=false;
    this.logicalX=logicalX; this.logicalY=logicalY;
    this._container=container; this._showingFight=false;
    this.el=document.createElement('div'); this.el.className='world-enemy';
    this.el.innerHTML=`
      <div class="world-enemy-icon">${enemyType.icon}</div>
      <div class="world-enemy-label">${enemyType.name}</div>
      <div class="world-enemy-hpbar"><div class="world-enemy-hpfill" style="width:100%"></div></div>
      <div class="world-enemy-action"></div>`;
    this.hintEl=this.el.querySelector('.world-enemy-action');
    this.el.addEventListener('mouseenter',()=>{
      if(this.defeated||this._showingFight) return;
      const c=levelColor(this.type.level);
      this.hintEl.innerHTML=`<span style="color:${c.color};font-size:11px">Lv.${this.type.level} ${this.type.name}</span><br><span style="color:#ff9870;font-size:9px">${this.type.rarity.toUpperCase()} · HP:${this.type.hp} ATK:${this.type.atk}</span><br><span style="color:#80c8ff;font-size:9px">+${RARITY_XP[this.type.rarity]||20} XP on kill</span>`;
      this.el.classList.add('has-hint');
    });
    this.el.addEventListener('mouseleave',()=>{if(!this._showingFight)this.el.classList.remove('has-hint');});
    document.body.appendChild(this.el);
    this._syncPosition();
  }

  _syncPosition() {
    const rect=this._container.getBoundingClientRect();
    this.el.style.left=(rect.left+this.logicalX)+'px';
    this.el.style.top=(rect.top+this.logicalY)+'px';
  }

  syncPosition() { this._syncPosition(); }

  markDefeated() {
    this.defeated=true; this.hideHint(); this.el.classList.add('defeated');
    setTimeout(()=>this.el.remove(),400);
  }

  showHint(text) {
    if(!this.hintEl) return;
    this._showingFight=true;
    const c=levelColor(this.type.level);
    this.hintEl.innerHTML=`<span style="color:${c.color};font-size:11px">Lv.${this.type.level} ${this.type.name}</span><br><span style="color:#ffb970;font-size:9px">${text}</span>`;
    this.el.classList.add('has-hint');
  }

  hideHint() {
    if(!this.hintEl) return;
    this._showingFight=false; this.el.classList.remove('has-hint');
  }

  remove() { this.el?.remove(); }
}

// ── Training CSS ──────────────────────────────────────────────────────────────
const TRAINING_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@400;700&family=IM+Fell+English:ital@0;1&display=swap');
#training-overlay{position:fixed;inset:0;z-index:99998;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,.88);backdrop-filter:blur(5px);animation:trFadeIn .3s ease}
@keyframes trFadeIn{from{opacity:0}to{opacity:1}}
#training-panel{width:min(520px,94vw);background:linear-gradient(160deg,#1a0f05 0%,#0d0704 100%);border:3px solid #8a5010;border-radius:18px;overflow:hidden;font-family:'IM Fell English',serif;box-shadow:0 0 80px rgba(140,80,20,.25),inset 0 0 60px rgba(0,0,0,.6);display:flex;flex-direction:column}
#training-header{background:rgba(0,0,0,.5);border-bottom:2px solid #5a3010;padding:16px 20px;display:flex;align-items:center;justify-content:space-between;flex-shrink:0}
#training-title{font-family:'Cinzel Decorative',cursive;color:#e8a020;font-size:18px;letter-spacing:2px}
#training-close-btn{background:rgba(120,30,10,.6);border:1.5px solid #8a3010;border-radius:8px;color:#e8a030;font-family:'Cinzel Decorative',cursive;font-size:11px;padding:7px 14px;cursor:pointer;transition:background .15s}
#training-close-btn:hover{background:rgba(200,60,20,.65)}
#training-content{padding:24px;display:flex;flex-direction:column;gap:20px;overflow-y:auto;flex:1}
.tr-stat-selector{display:flex;gap:12px;justify-content:center}
.tr-stat-choice{background:rgba(0,0,0,.4);border:2px solid rgba(180,110,30,.4);border-radius:10px;padding:14px 18px;cursor:pointer;transition:all .2s;text-align:center;flex:1}
.tr-stat-choice:hover{border-color:rgba(220,150,30,.7);background:rgba(0,0,0,.5)}
.tr-stat-choice.active{background:rgba(180,110,30,.4);border-color:#f0c030}
.tr-stat-label-sm{font-family:'Cinzel Decorative',cursive;color:rgba(220,180,120,.6);font-size:10px;letter-spacing:1px}
.tr-stat-val-sm{font-family:'Cinzel Decorative',cursive;color:#f0c030;font-size:16px;margin-top:4px}
#tr-minigame-area{background:rgba(0,0,0,.4);border:1.5px solid rgba(180,110,30,.4);border-radius:10px;padding:24px;display:flex;flex-direction:column;gap:14px;min-height:140px;display:none}
#tr-minigame-area.active{display:flex}
.tr-game-title{font-family:'Cinzel Decorative',cursive;color:#e8a020;font-size:13px;letter-spacing:1px;text-align:center}
.tr-progress-bar{width:100%;height:24px;background:rgba(0,0,0,.6);border:1.5px solid rgba(180,110,30,.5);border-radius:6px;position:relative;overflow:hidden}
.tr-progress-fill{height:100%;background:linear-gradient(90deg,#d04020,#f08030);position:absolute;left:0;top:0;width:20%;border-radius:5px;transition:width .05s linear;box-shadow:0 0 8px rgba(240,128,48,.6)}
.tr-target-zone{position:absolute;top:0;height:100%;background:rgba(100,200,100,.4);border-left:2px solid #60ff60;border-right:2px solid #60ff60;z-index:1}
.tr-click-btn{background:rgba(140,80,10,.7);border:2px solid #b07010;border-radius:8px;color:#f0c030;font-family:'Cinzel Decorative',cursive;font-size:13px;padding:12px 24px;cursor:pointer;letter-spacing:1px;transition:all .15s;align-self:center}
.tr-click-btn:hover{background:rgba(210,120,15,.8);transform:scale(1.05)}
.tr-result-msg{text-align:center;font-family:'Cinzel Decorative',cursive;font-size:12px;min-height:20px}
.tr-result-msg.success{color:#90ff90}
.tr-result-msg.fail{color:#ff9090}
#tr-stat-summary{background:rgba(0,0,0,.3);border:1.5px solid rgba(180,110,30,.3);border-radius:8px;padding:12px;text-align:center;font-size:11px;color:rgba(210,175,115,.8);line-height:1.5}
`;

// ── TrainingUI ────────────────────────────────────────────────────────────────
class TrainingUI {
  constructor(playerLevel, currentAtk, currentDef, atkBonus, defBonus, onClose) {
    this.playerLevel = playerLevel;
    this.currentAtk = currentAtk;
    this.currentDef = currentDef;
    this.atkBonus = atkBonus;
    this.defBonus = defBonus;
    this.onClose = onClose;
    this.selectedStat = null;
    this.gameActive = false;
    this.progress = 0;
    this.direction = 1;
    this.resultMsg = '';
    this._gameLoop = null;
    this._build();
    this._bind();
  }

  _build() {
    this.overlay = document.createElement('div');
    this.overlay.id = 'training-overlay';
    
    this.panel = document.createElement('div');
    this.panel.id = 'training-panel';
    
    this.panel.innerHTML = `
      <div id="training-header">
        <div id="training-title">⚔ COMBAT TRAINING</div>
        <button id="training-close-btn">EXIT</button>
      </div>
      <div id="training-content">
        <div class="tr-stat-selector">
          <div class="tr-stat-choice" data-stat="atk">
            <div class="tr-stat-label-sm">ATTACK</div>
            <div class="tr-stat-val-sm">${this.currentAtk}</div>
            ${this.atkBonus > 0 ? `<div style="font-size:9px;color:#90ff90;">+${this.atkBonus}</div>` : ''}
          </div>
          <div class="tr-stat-choice" data-stat="def">
            <div class="tr-stat-label-sm">DEFENSE</div>
            <div class="tr-stat-val-sm">${this.currentDef}</div>
            ${this.defBonus > 0 ? `<div style="font-size:9px;color:#90ff90;">+${this.defBonus}</div>` : ''}
          </div>
        </div>
        <div id="tr-minigame-area">
          <div class="tr-game-title">⚡ TIME YOUR CLICK!</div>
          <div class="tr-progress-bar" id="tr-progress-bar">
            <div class="tr-progress-fill" id="tr-progress-fill"></div>
            <div class="tr-target-zone" id="tr-target-zone"></div>
          </div>
          <button class="tr-click-btn" id="tr-click-btn">CLICK NOW! (SPACE)</button>
          <div class="tr-result-msg" id="tr-result-msg"></div>
        </div>
        <div id="tr-stat-summary">
          <strong>Training Mini Game:</strong><br>
          Click when the bar enters the <span style="color:#60ff60;">GREEN ZONE</span><br>
          Success = +1 to selected stat. Try again if you fail!
        </div>
      </div>
    `;
    
    this.overlay.appendChild(this.panel);
    document.body.appendChild(this.overlay);
    
    this.closeBtn = document.getElementById('training-close-btn');
    this.statChoices = this.panel.querySelectorAll('.tr-stat-choice');
    this.resultMsg = document.getElementById('tr-result-msg');
    this.clickBtn = document.getElementById('tr-click-btn');
  }

  _bind() {
    this.closeBtn.addEventListener('click', () => this._exit());
    
    this.statChoices.forEach(choice => {
      choice.addEventListener('click', () => {
        this.statChoices.forEach(c => c.classList.remove('active'));
        choice.classList.add('active');
        this.selectedStat = choice.dataset.stat;
        this._startMinigame();
      });
    });

    this.clickBtn.addEventListener('click', () => this._attemptClick());
    window.addEventListener('keydown', (e) => {
      if (e.code === 'Space' && this.gameActive) {
        e.preventDefault();
        this._attemptClick();
      }
    });
  }

  _startMinigame() {
    const area = this.panel.querySelector('#tr-minigame-area');
    area.classList.add('active');
    
    this.gameActive = true;
    this.progress = 0;
    this.direction = 1;
    this.resultMsg.textContent = '';
    this.resultMsg.className = '';
    
    if (this._gameLoop) cancelAnimationFrame(this._gameLoop);
    this._animateBar();
  }

  _animateBar() {
    const fill = document.getElementById('tr-progress-fill');
    const target = document.getElementById('tr-target-zone');
    const targetStart = 35;
    const targetWidth = 30;
    
    const tick = () => {
      if (!this.gameActive) return;
      
      this.progress += this.direction * 3;
      if (this.progress <= 0 || this.progress >= 100) {
        this.direction *= -1;
      }
      this.progress = Math.max(0, Math.min(100, this.progress));
      
      fill.style.width = this.progress + '%';
      target.style.left = targetStart + '%';
      target.style.width = targetWidth + '%';
      
      this._gameLoop = requestAnimationFrame(tick);
    };
    this._gameLoop = requestAnimationFrame(tick);
  }

  _attemptClick() {
    if (!this.gameActive) return;
    
    const targetStart = 35;
    const targetWidth = 30;
    const targetEnd = targetStart + targetWidth;
    const success = this.progress >= targetStart && this.progress <= targetEnd;
    
    if (success) {
      this.resultMsg.textContent = '✓ PERFECT! +1 ' + (this.selectedStat === 'atk' ? 'ATK' : 'DEF');
      this.resultMsg.className = 'tr-result-msg success';
      
      if (this.selectedStat === 'atk') this.atkBonus += 1;
      else this.defBonus += 1;
      
      this._updateStatDisplay();
      
      this.gameActive = false;
      if (this._gameLoop) cancelAnimationFrame(this._gameLoop);
      
      setTimeout(() => this._startMinigame(), 1200);
    } else {
      this.resultMsg.textContent = '✗ MISS! Position: ' + this.progress.toFixed(0) + '%';
      this.resultMsg.className = 'tr-result-msg fail';
      this.gameActive = false;
      if (this._gameLoop) cancelAnimationFrame(this._gameLoop);
      
      setTimeout(() => this._startMinigame(), 800);
    }
  }

  _updateStatDisplay() {
    const statChoices = this.panel.querySelectorAll('.tr-stat-choice');
    statChoices.forEach(choice => {
      if (choice.dataset.stat === 'atk') {
        const bonus = choice.querySelector('div:nth-child(3)');
        if (bonus) bonus.textContent = `+${this.atkBonus}`;
        else if (this.atkBonus > 0) {
          const newBonus = document.createElement('div');
          newBonus.style.cssText = 'font-size:9px;color:#90ff90;';
          newBonus.textContent = `+${this.atkBonus}`;
          choice.appendChild(newBonus);
        }
      } else {
        const bonus = choice.querySelector('div:nth-child(3)');
        if (bonus) bonus.textContent = `+${this.defBonus}`;
        else if (this.defBonus > 0) {
          const newBonus = document.createElement('div');
          newBonus.style.cssText = 'font-size:9px;color:#90ff90;';
          newBonus.textContent = `+${this.defBonus}`;
          choice.appendChild(newBonus);
        }
      }
    });
  }

  _exit() {
    if (this._gameLoop) cancelAnimationFrame(this._gameLoop);
    this.gameActive = false;
    this.destroy();
    this.onClose?.(this.atkBonus, this.defBonus);
  }

  destroy() {
    if (this._gameLoop) cancelAnimationFrame(this._gameLoop);
    if (this.overlay?.parentNode) this.overlay.remove();
  }
}

// ── MarketPirateGame ──────────────────────────────────────────────────────────
class MarketPirateGame {
  constructor(gameEnv) {
    this.gameEnv=gameEnv;
    const height=gameEnv.innerHeight;
    const path=gameEnv.path;

    this.classes=[
      { class:GameEnvBackground, data:{
        name:'marketplace',
        src:path+'/images/projects/enemy-death/MarketPlaceRPG.png',
        pixels:{height:580,width:1038}
      }},
      { class:Player, data:{
        id:'McArchie',
        src:path+'/images/projects/enemy-death/mcarchie.png',
        SCALE_FACTOR:8, STEP_FACTOR:1000, ANIMATION_RATE:30,
        INIT_POSITION:{x:150,y:height*0.75},
        pixels:{height:256,width:256},
        orientation:{rows:4,columns:4},
        down:{row:0,start:0,columns:4},
        downRight:{row:2,start:0,columns:3,rotate:Math.PI/16},
        downLeft:{row:1,start:0,columns:3,rotate:-Math.PI/16},
        right:{row:2,start:0,columns:4},
        left:{row:1,start:0,columns:4},
        up:{row:3,start:0,columns:4},
        upRight:{row:2,start:0,columns:3,rotate:-Math.PI/16},
        upLeft:{row:1,start:0,columns:3,rotate:Math.PI/16},
        hitbox:{widthPercentage:0.45,heightPercentage:0.2},
        keypress:{up:87,left:65,down:83,right:68}
      }},
    ];

    this._shopZoneRatios={x:0.38,y:0.30,w:0.24,h:0.40};
    this.shopZone=this._computeShopZone();
    this._trainingZoneRatios={x:0.15,y:0.65,w:0.18,h:0.18};
    this.trainingZone=this._computeTrainingZone();
    this._bagInventory=[]; this._totalRubies=0; this._bankedRubies=0;
    this._battleOpen=false; this._battleUI=null;
    this._trainingOpen=false; this._trainingUI=null;
    this._worldEnemies=[]; this._nearbyEnemy=null;
    this._open=false; this._ui=null; this._killCount=0;
    this._playerLevel=1; this._playerXp=0;
    this._trainAtkBonus=0; this._trainDefBonus=0;
    this._applyLevelStats();
    this._playerCurHp=this._playerMaxHp;
    
    // Day/Night cycle
    this._gameDay=1;
    this._dayProgress=0; // 0-100 representing time of day (0=dawn, 50=noon, 100=dusk)
    this._dayPhase='day'; // 'day' or 'night'
    this._trainSessionsToday=0;
    this._maxTrainSessions=5; // Max trainings per day
    this._dayTimer=null;
    this._lightingOverlay=null;
    this._atmosphereOverlay=null;
    this._flashlightOverlay=null;

    if (!document.getElementById('battle-style')) {
      const s=document.createElement('style'); s.id='battle-style';
      s.textContent=BATTLE_CSS; document.head.appendChild(s);
    }
    if (!document.getElementById('mpg-hud-style')) {
      const s=document.createElement('style'); s.id='mpg-hud-style';
      s.textContent=HUD_CSS; document.head.appendChild(s);
    }
    if (!document.getElementById('training-style')) {
      const s=document.createElement('style'); s.id='training-style';
      s.textContent=TRAINING_CSS; document.head.appendChild(s);
    }

    // Lighting overlay for day/night effects
    this._lightingOverlay=document.createElement('div');
    this._lightingOverlay.id='mpg-lighting-overlay';
    this._lightingOverlay.style.cssText=`
      position:fixed;top:0;left:0;width:100%;height:100%;
      pointer-events:none;z-index:5000;
      background:radial-gradient(ellipse at center, transparent 0%, rgba(0,0,0,0) 100%);
      mix-blend-mode:multiply;
    `;
    document.body.appendChild(this._lightingOverlay);

    // Atmosphere overlay for stars, etc
    this._atmosphereOverlay=document.createElement('div');
    this._atmosphereOverlay.id='mpg-atmosphere-overlay';
    this._atmosphereOverlay.style.cssText=`
      position:fixed;top:0;left:0;width:100%;height:100%;
      pointer-events:none;z-index:4999;
    `;
    document.body.appendChild(this._atmosphereOverlay);

    // Flashlight effect for night vision
    this._flashlightOverlay=document.createElement('div');
    this._flashlightOverlay.id='mpg-flashlight';
    this._flashlightOverlay.style.cssText=`
      position:fixed;top:0;left:0;width:100%;height:100%;
      pointer-events:none;z-index:5001;
      background:radial-gradient(circle 120px at 50% 50%, rgba(255,255,200,0.8), rgba(255,255,150,0.4) 40%, rgba(0,0,0,0.3) 100%);
      opacity:0;
      transition:opacity 0.6s ease;
    `;
    document.body.appendChild(this._flashlightOverlay);

    // Level-up flash
    this._lvlFlash=document.createElement('div'); this._lvlFlash.id='levelup-flash';
    this._lvlFlash.innerHTML=`<div id="levelup-inner">⭐ LEVEL UP! ⭐</div>`;
    document.body.appendChild(this._lvlFlash);

    // Single bottom HUD bar
    this.hudBar=document.createElement('div');
    this.hudBar.id='mpg-hud-bar';
    document.body.appendChild(this.hudBar);
    this._buildHUD();

    this._keyHandler=(e)=>{
      if(e.key!=='e'&&e.key!=='E') return;
      if(this._battleOpen||this._open||this._trainingOpen) return;
      if(this._nearbyEnemy) { this._startBattle(this._nearbyEnemy); }
      else {
        const player=this.gameEnv.gameObjects?.find(o=>o instanceof Player);
        if(!player) return;
        if(this._playerInZone(player)) this._openShop();
        else if(this._playerInTrainingZone(player)) this._openTraining();
      }
    };
    window.addEventListener('keydown',this._keyHandler);

    // Show menu first — game starts on Play
    this._gameStarted = false;
    this._menuScreen = new MenuScreen(() => this._startGame());
  }

  // ── Start (called from menu) ───────────────────────────────────────────────
  _startGame() {
    this._gameStarted = true;
    this._spawnEnemies(8);
    this._respawnTimer = setInterval(() => {
      this._worldEnemies = this._worldEnemies.filter(e => !e.defeated);
      if (this._worldEnemies.length < 4) this._spawnEnemies(3);
    }, 25000);
    
    // Start day/night cycle (40 seconds per in-game day) - update every 50ms for smooth transitions
    if (this._lightingOverlay) this._buildAtmosphere();
    this._dayTimer = setInterval(() => this._updateDayNightCycle(), 50);
  }

  // ── Day/Night Cycle ──────────────────────────────────────────────────────────
  _updateDayNightCycle() {
    this._dayProgress += 0.1; // Increment by 0.1% per 50ms tick (40 second full cycle)
    
    if (this._dayProgress >= 100) {
      this._dayProgress = 0;
      this._gameDay++;
      this._trainSessionsToday = 0; // Reset training sessions for new day
      this._updateWorldHP(); // Refresh HUD to show new day
    }
    
    // Determine phase: 0-25 = dawn, 25-70 = day, 70-85 = dusk, 85-100 = night
    const oldPhase = this._dayPhase;
    if (this._dayProgress < 25) {
      this._dayPhase = 'dawn';
    } else if (this._dayProgress < 70) {
      this._dayPhase = 'day';
    } else if (this._dayProgress < 85) {
      this._dayPhase = 'dusk';
    } else {
      this._dayPhase = 'night';
    }
    
    if (oldPhase !== this._dayPhase) {
      this._buildAtmosphere();
    }
    
    // Apply lighting effects every frame for smooth transitions
    this._applyDayNightEffect();
  }
  
  _applyDayNightEffect() {
    const progress = this._dayProgress;
    let brightness, hueRotate, saturation;
    let overlayColor, overlayAlpha;
    
    // Calculate values based on time of day
    if (progress < 25) { // Dawn (0-25)
      const phase = progress / 25;
      brightness = 0.4 + phase * 0.6; // 0.4 to 1.0
      hueRotate = -30 + phase * 30; // -30 to 0
      saturation = 80 + phase * 20; // 80% to 100%
      overlayColor = [255, 140, 60]; // Orange-red
      overlayAlpha = (1 - phase) * 0.3; // 0.3 to 0
    } else if (progress < 70) { // Day (25-70)
      brightness = 1.0; // Full brightness
      hueRotate = 0;
      saturation = 100;
      overlayColor = [200, 220, 255]; // Light blue
      overlayAlpha = 0;
    } else if (progress < 85) { // Dusk (70-85)
      const phase = (progress - 70) / 15;
      brightness = 1.0 - phase * 0.4; // 1.0 to 0.6
      hueRotate = phase * 15; // 0 to 15
      saturation = 100 - phase * 30; // 100% to 70%
      overlayColor = [255, 100, 50]; // Deep orange
      overlayAlpha = phase * 0.4; // 0 to 0.4
    } else { // Night (85-100)
      const phase = (progress - 85) / 15;
      brightness = 0.6 - phase * 0.25; // 0.6 to 0.35
      hueRotate = 15 - phase * 5; // 15 to 10
      saturation = 70 - phase * 20; // 70% to 50%
      overlayColor = [20, 30, 80]; // Deep blue
      overlayAlpha = 0.5 + phase * 0.2; // 0.5 to 0.7
    }
    
    // Apply filter to game background
    const bg = document.querySelector('[data-bg-layer]');
    if (bg) {
      bg.style.filter = `brightness(${brightness}) hue-rotate(${hueRotate}deg) saturate(${saturation}%)`;
    }
    
    // Apply to lighting overlay
    if (this._lightingOverlay) {
      const [r, g, b] = overlayColor;
      this._lightingOverlay.style.backgroundColor = `rgba(${r}, ${g}, ${b}, ${overlayAlpha})`;
      this._lightingOverlay.style.backgroundImage = 
        `radial-gradient(ellipse at center, transparent 0%, rgba(0, 0, 0, ${overlayAlpha * 0.5}) 100%)`;
    }
    
    // Apply shadow effect to game canvas if available
    const canvas = document.querySelector('canvas');
    if (canvas) {
      canvas.style.filter = `brightness(${brightness}) hue-rotate(${hueRotate}deg)`;
    }
  }
  
  _buildAtmosphere() {
    if (!this._atmosphereOverlay) return;
    
    if (this._dayPhase === 'night') {
      // Build starfield
      this._atmosphereOverlay.innerHTML = '';
      const starCount = 50;
      for (let i = 0; i < starCount; i++) {
        const star = document.createElement('div');
        const size = Math.random() * 2 + 0.5;
        const x = Math.random() * 100;
        const y = Math.random() * 100;
        const duration = Math.random() * 3 + 2;
        star.style.cssText = `
          position:absolute;
          left:${x}%;
          top:${y}%;
          width:${size}px;
          height:${size}px;
          background:white;
          border-radius:50%;
          opacity:${Math.random() * 0.7 + 0.3};
          box-shadow:0 0 ${size * 2}px rgba(255,255,255,0.8);
          animation:twinkle ${duration}s infinite;
        `;
        this._atmosphereOverlay.appendChild(star);
      }
      
      // Add twinkling keyframes if not present
      if (!document.getElementById('twinkle-animation')) {
        const style = document.createElement('style');
        style.id = 'twinkle-animation';
        style.textContent = `
          @keyframes twinkle {
            0%, 100% { opacity: 0.3; }
            50% { opacity: 1; }
          }
        `;
        document.head.appendChild(style);
      }
    } else if (this._dayPhase === 'dusk' || this._dayPhase === 'dawn') {
      // Atmospheric glow for sunrise/sunset
      const gradient = this._dayPhase === 'dawn' 
        ? 'linear-gradient(180deg, rgba(255,100,50,0.3) 0%, rgba(255,150,100,0.2) 30%, transparent 70%)'
        : 'linear-gradient(180deg, rgba(255,80,30,0.4) 0%, rgba(255,120,60,0.2) 40%, transparent 70%)';
      this._atmosphereOverlay.style.backgroundImage = gradient;
    } else {
      // Clear atmosphere during day
      this._atmosphereOverlay.innerHTML = '';
      this._atmosphereOverlay.style.backgroundImage = 'none';
    }
  }
  
  _getTimeOfDayDisplay() {
    if (this._dayProgress < 25) return '🌅 DAWN';
    if (this._dayProgress < 50) return '☀ MORNING';
    if (this._dayProgress < 70) return '🌤 AFTERNOON';
    if (this._dayProgress < 85) return '🌆 DUSK';
    return '🌙 NIGHT';
  }

  // ── HUD ───────────────────────────────────────────────────────────────────
  _buildHUD() {
    const lvlC   = levelColor(this._playerLevel);
    const xpPrev = LEVEL_XP[this._playerLevel-1]||0;
    const xpNext = LEVEL_XP[Math.min(this._playerLevel, MAX_LEVEL)];
    const xpPct  = this._playerLevel>=MAX_LEVEL ? 100
      : Math.max(0,Math.min(100,((this._playerXp-xpPrev)/(xpNext-xpPrev))*100));
    const hpPct  = Math.max(0,(this._playerCurHp/this._playerMaxHp)*100);
    const hpFill = hpPct>50?'mpg-fill-hp-hi':hpPct>25?'mpg-fill-hp-md':'mpg-fill-hp-lo';
    const rank   = RANK_TITLES[this._playerLevel]||'Sailor';
    const rubies = this._totalRubies+this._bankedRubies;

    this.hudBar.innerHTML = `
      <div class="mpg-seg">
        <div class="mpg-lvl-circle" style="border:2px solid ${lvlC.color};background:${lvlC.bg};color:${lvlC.color};">${this._playerLevel}</div>
        <div class="mpg-col">
          <div class="mpg-rank" style="color:${lvlC.color};">${rank}</div>
          <div class="mpg-bar-wrap">
            <div class="mpg-bar-track"><div class="mpg-bar-fill mpg-fill-xp" style="width:${xpPct.toFixed(1)}%"></div></div>
            <div class="mpg-bar-sub">${this._playerLevel>=MAX_LEVEL?'MAX LEVEL':`${this._playerXp} / ${xpNext} XP`}</div>
          </div>
        </div>
      </div>

      <div class="mpg-divider"></div>

      <div class="mpg-seg">
        <div class="mpg-icon mpg-icon-hp" style="font-size:12px;">♥</div>
        <div class="mpg-col">
          <div class="mpg-lbl">HEALTH</div>
          <div class="mpg-val mpg-val-hp">${Math.max(0,this._playerCurHp)} / ${this._playerMaxHp}</div>
          <div class="mpg-bar-wrap">
            <div class="mpg-bar-track"><div class="mpg-bar-fill ${hpFill}" style="width:${hpPct.toFixed(1)}%"></div></div>
          </div>
        </div>
      </div>

      <div class="mpg-divider"></div>

      <div class="mpg-seg" style="gap:7px;">
        <div class="mpg-stat-pill"><div class="sv">${this._playerAtk}</div><div class="sl">ATK</div></div>
        <div class="mpg-stat-pill"><div class="sv">${this._playerDef}</div><div class="sl">DEF</div></div>
        ${this._trainAtkBonus > 0 || this._trainDefBonus > 0 ? `<div class="mpg-stat-pill" style="background:rgba(100,180,100,.4);border-color:rgba(100,180,100,.5);"><div class="sv" style="color:#90ff90;">+${this._trainAtkBonus+this._trainDefBonus}</div><div class="sl">TRAIN</div></div>` : ''}
      </div>

      <div class="mpg-seg-grow">
        <div class="mpg-hint" id="mpg-hint-text"></div>
      </div>

      <div class="mpg-seg" style="margin-left:auto;">
        <div class="mpg-icon mpg-icon-ruby" style="font-size:11px;">◈</div>
        <div class="mpg-col">
          <div class="mpg-lbl">RUBIES</div>
          <div class="mpg-val mpg-val-ruby">${rubies}</div>
        </div>
      </div>

      <div class="mpg-divider"></div>

      <div class="mpg-seg">
        <div class="mpg-icon mpg-icon-day" style="font-size:11px;">${this._getTimeOfDayDisplay()}</div>
        <div class="mpg-col">
          <div class="mpg-lbl">DAY ${this._gameDay}</div>
          <div class="mpg-val mpg-val-gray">Trainings: ${this._trainSessionsToday}/${this._maxTrainSessions}</div>
        </div>
      </div>

      <div class="mpg-divider"></div>

      <div class="mpg-seg">
        <div class="mpg-icon mpg-icon-skull" style="font-size:12px;">☠</div>
        <div class="mpg-col">
          <div class="mpg-lbl">KILLS</div>
          <div class="mpg-val mpg-val-gray">${this._killCount}</div>
        </div>
      </div>
    `;
  }

  _updateWorldHP() { this._buildHUD(); }

  _setHint(text) {
    const el=document.getElementById('mpg-hint-text');
    if(el) el.textContent=text||'';
  }

  // ── Level / XP ────────────────────────────────────────────────────────────
  _applyLevelStats() {
    const s=playerStatsForLevel(this._playerLevel);
    this._playerMaxHp=s.maxHp;
    this._playerAtk=s.atk+this._trainAtkBonus;
    this._playerDef=s.def+this._trainDefBonus;
  }

  _gainXp(amount) {
    if(this._playerLevel>=MAX_LEVEL) return;
    this._playerXp+=amount;
    let levelled=false;
    while(this._playerLevel<MAX_LEVEL&&this._playerXp>=LEVEL_XP[this._playerLevel]) {
      this._playerLevel++; levelled=true; this._applyLevelStats();
      this._playerCurHp=Math.min(this._playerCurHp+20,this._playerMaxHp);
    }
    this._updateWorldHP();
    if(this._ui) this._ui.setPlayerLevel(this._playerLevel);
    if(levelled) this._flashLevelUp();
  }

  _flashLevelUp() {
    const inner=document.getElementById('levelup-inner');
    if(inner) inner.textContent=`⭐ LEVEL ${this._playerLevel}! ⭐`;
    this._lvlFlash.classList.add('show');
    setTimeout(()=>this._lvlFlash.classList.remove('show'),1800);
  }

  // ── Helpers ───────────────────────────────────────────────────────────────
  _computeShopZone() {
    const w=this.gameEnv.innerWidth, h=this.gameEnv.innerHeight, r=this._shopZoneRatios;
    return {x:w*r.x, y:h*r.y, width:w*r.w, height:h*r.h};
  }

  _computeTrainingZone() {
    const w=this.gameEnv.innerWidth, h=this.gameEnv.innerHeight, r=this._trainingZoneRatios;
    return {x:w*r.x, y:h*r.y, width:w*r.w, height:h*r.h};
  }

  _getContainer() {
    return this.gameEnv.canvas
      ||document.getElementById('gameCanvas')
      ||this.gameEnv.gameContainer
      ||document.getElementById('gameContainer')
      ||document.body;
  }

  _randomEnemyType() {
    const pool=[], weights={common:50,uncommon:30,rare:13,epic:7};
    ENEMY_TYPES.forEach(e=>{const w=weights[e.rarity]||10;for(let i=0;i<w;i++)pool.push(e);});
    const base=pool[Math.floor(Math.random()*pool.length)];
    const [minL,maxL]=RARITY_LVL[base.rarity]||[1,3];
    const level=minL+Math.floor(Math.random()*(maxL-minL+1));
    const scale=1+(level-1)*0.12;
    return {...base,level,hp:Math.round(base.hp*scale),atk:Math.round(base.atk*scale),def:Math.round(base.def*scale)};
  }

  _spawnEnemies(n) {
    const container=this._getContainer();
    const rect=container.getBoundingClientRect();
    const width=rect.width||this.gameEnv.innerWidth;
    const height=rect.height||this.gameEnv.innerHeight;
    const margin=80;
    const shopCx=this.shopZone.x+this.shopZone.width/2;
    const shopCy=this.shopZone.y+this.shopZone.height/2;
    for(let i=0;i<n;i++){
      let lx,ly,tries=0;
      do {
        lx=margin+Math.random()*Math.max(0,width-margin*2);
        ly=margin+Math.random()*Math.max(0,height-margin*2);
        tries++;
      } while(Math.hypot(lx-shopCx,ly-shopCy)<130&&tries<25);
      this._worldEnemies.push(new WorldEnemy(this._randomEnemyType(),lx,ly,container));
    }
  }

  _playerLogicalPos() {
    const p=this.gameEnv.gameObjects?.find(o=>o instanceof Player);
    if(!p?.position) return null;
    return {x:p.position.x+(p.width||0)*0.5, y:p.position.y+(p.height||0)*0.8};
  }

  _findNearbyEnemy(threshold=120) {
    const pos=this._playerLogicalPos(); if(!pos) return null;
    let closest=null, best=threshold;
    for(const e of this._worldEnemies){
      if(e.defeated) continue;
      const d=Math.hypot(pos.x-e.logicalX,pos.y-e.logicalY);
      if(d<best){best=d;closest=e;}
    }
    return closest;
  }

  _healPlayer(healAmt, fullHeal=false) {
    this._playerCurHp=fullHeal?this._playerMaxHp:Math.min(this._playerMaxHp,this._playerCurHp+healAmt);
    this._updateWorldHP();
  }

  // ── Battle ────────────────────────────────────────────────────────────────
  _startBattle(worldEnemy) {
    if(this._battleOpen) return;
    this._battleOpen=true; this._nearbyEnemy=null;
    this._worldEnemies.forEach(e=>e.hideHint());
    this._battleUI=new BattleUI(
      worldEnemy.type,
      (rubyReward,wasDefeated,remainingHp,xpGained)=>{
        this._battleOpen=false; this._battleUI=null;
        if(wasDefeated) { this._showGameOver(); }
        else {
          this._playerCurHp=Math.max(1,remainingHp); this._updateWorldHP();
          if(rubyReward>0) {
            worldEnemy.markDefeated(); this._killCount++;
            if(this._ui) this._ui.addRuby(rubyReward);
            else this._bankedRubies+=rubyReward;
          }
          if(xpGained>0) this._gainXp(xpGained);
        }
      },
      this._playerCurHp, this._playerLevel, this._playerAtk, this._playerDef, this._playerMaxHp,
    );
  }

  _playerInZone(player) {
    if(!player?.position) return false;
    const px=player.position.x+(player.width||0)*0.5;
    const py=player.position.y+(player.height||0)*0.5;
    return px>this.shopZone.x&&px<this.shopZone.x+this.shopZone.width
        &&py>this.shopZone.y&&py<this.shopZone.y+this.shopZone.height;
  }

  _playerInTrainingZone(player) {
    if(!player?.position) return false;
    const px=player.position.x+(player.width||0)*0.5;
    const py=player.position.y+(player.height||0)*0.5;
    return px>this.trainingZone.x&&px<this.trainingZone.x+this.trainingZone.width
        &&py>this.trainingZone.y&&py<this.trainingZone.y+this.trainingZone.height;
  }

  _openShop() {
    if(this._open) return;
    const player=this.gameEnv.gameObjects?.find(o=>o instanceof Player);
    if(!player||!this._playerInZone(player)) return;
    this._open=true;
    const startingRubies=this._totalRubies+this._bankedRubies;
    this._bankedRubies=0;
    this._ui=new MarketplaceUI(
      this.gameEnv.path,
      ()=>{
        this._bagInventory=this._ui.getInventory();
        this._totalRubies=this._ui.getRubies();
        this._open=false; this._ui=null;
      },
      this._bagInventory, startingRubies,
      (healAmt,item,fullHeal)=>this._healPlayer(healAmt,fullHeal),
      this._playerLevel,
    );
  }

  _openTraining() {
    if(this._trainingOpen) return;
    const player=this.gameEnv.gameObjects?.find(o=>o instanceof Player);
    if(!player||!this._playerInTrainingZone(player)) return;
    
    // Check if training limit reached for today
    if (this._trainSessionsToday >= this._maxTrainSessions) {
      this._showToast(`⛔ Training limit reached for today! (${this._trainSessionsToday}/${this._maxTrainSessions})`, 'warning');
      return;
    }
    
    this._trainingOpen=true;
    
    const baseLevelStats=playerStatsForLevel(this._playerLevel);
    const baseAtk=baseLevelStats.atk;
    const baseDef=baseLevelStats.def;
    
    this._trainingUI=new TrainingUI(
      this._playerLevel,
      baseAtk,
      baseDef,
      this._trainAtkBonus,
      this._trainDefBonus,
      (atkBonus, defBonus)=>{
        this._trainAtkBonus=atkBonus;
        this._trainDefBonus=defBonus;
        this._trainSessionsToday++; // Increment training counter
        this._applyLevelStats();
        this._updateWorldHP();
        this._trainingOpen=false;
        this._trainingUI=null;
        this._showToast(`✓ Training session complete! (${this._trainSessionsToday}/${this._maxTrainSessions})`, 'success');
      }
    );
  }

  // ── Game Over / Reset ─────────────────────────────────────────────────────
  _showGameOver() {
    if(this._ui){this._ui.destroy();this._ui=null;}
    const overlay=document.createElement('div'); overlay.id='gameover-overlay';
    overlay.innerHTML=`
      <div id="gameover-panel">
        <div id="gameover-skull">💀</div>
        <div id="gameover-title">GAME OVER</div>
        <div id="gameover-sub">The seas claimed another soul...<br>Ye fought bravely, but death waits for all pirates.</div>
        <div id="gameover-stats">
          <div class="go-stat"><div class="go-stat-val">${this._killCount}</div><div class="go-stat-lbl">Enemies Slain</div></div>
          <div class="go-stat"><div class="go-stat-val">⭐ ${this._playerLevel}</div><div class="go-stat-lbl">Level Reached</div></div>
          <div class="go-stat"><div class="go-stat-val">💎 ${this._totalRubies+this._bankedRubies}</div><div class="go-stat-lbl">Rubies Earned</div></div>
        </div>
        <button id="gameover-btn">⚓ Try Again</button>
      </div>`;
    document.body.appendChild(overlay);
    requestAnimationFrame(()=>requestAnimationFrame(()=>overlay.classList.add('show')));
    document.getElementById('gameover-btn').addEventListener('click',()=>{overlay.remove();this._hardReset();});
  }

  _hardReset() {
    this._killCount=0; this._playerLevel=1; this._playerXp=0;
    this._trainAtkBonus=0; this._trainDefBonus=0;
    this._gameDay=1;
    this._dayProgress=0;
    this._dayPhase='day';
    this._trainSessionsToday=0;
    this._applyLevelStats(); this._playerCurHp=this._playerMaxHp;
    this._totalRubies=0; this._bankedRubies=0; this._bagInventory=[];
    this._updateWorldHP();
    const existing=[...this._worldEnemies]; this._worldEnemies=[];
    existing.forEach(e=>e.remove()); this._spawnEnemies(8);
  }

  // ── Game loop ─────────────────────────────────────────────────────────────
  update() {
    if(!this._gameStarted) return;
    if(!this.gameEnv?.gameObjects) return;
    const player=this.gameEnv.gameObjects.find(o=>o instanceof Player);
    if(!player) return;
    
    // Update flashlight position during night
    this._updateFlashlightPosition(player);
    
    if(this._open||this._battleOpen||this._trainingOpen){
      this._setHint('');
      this._worldEnemies.forEach(e=>e.hideHint());
      return;
    }
    const nearby=this._findNearbyEnemy(120);
    this._nearbyEnemy=nearby;
    this._worldEnemies.forEach(e=>e.hideHint());
    if(nearby){
      nearby.showHint('Press E to fight');
      this._setHint(`⚔ ${nearby.type.name} — Lv.${nearby.type.level} · Press E to fight`);
    } else if(this._playerInZone(player)){
      this._setHint('⚓ Press E to enter the market');
    } else if(this._playerInTrainingZone(player)){
      this._setHint('💪 Press E to train and boost stats!');
    } else {
      this._setHint('');
    }
  }

  _updateFlashlightPosition(player) {
    if (!this._flashlightOverlay || !player?.position) return;
    
    // Calculate flashlight visibility based on night phase
    let flashlightOpacity = 0;
    if (this._dayPhase === 'night') {
      // During late night (85-100), full flashlight
      const nightProgress = Math.max(0, this._dayProgress - 85) / 15;
      flashlightOpacity = Math.min(1, nightProgress);
    } else if (this._dayPhase === 'dusk' && this._dayProgress > 77) {
      // Early flashlight in late dusk
      flashlightOpacity = (this._dayProgress - 77) / 8 * 0.3;
    }
    
    // Position flashlight at player location
    const playerX = player.position.x + (player.width || 0) * 0.5;
    const playerY = player.position.y + (player.height || 0) * 0.5;
    
    this._flashlightOverlay.style.backgroundImage = `
      radial-gradient(
        circle 160px at ${playerX}px ${playerY}px,
        rgba(255,255,180,0.9),
        rgba(255,255,100,0.5) 35%,
        rgba(255,200,100,0.2) 65%,
        rgba(0,0,0,0.1) 100%
      )
    `;
    this._flashlightOverlay.style.opacity = flashlightOpacity;
  }

  _showToast(msg, type='info') {
    const toast=document.createElement('div');
    toast.style.cssText=`
      position:fixed;bottom:120px;left:50%;transform:translateX(-50%);
      background:rgba(0,0,0,.9);padding:12px 20px;
      border-radius:6px;font-family:'Cinzel Decorative',cursive;font-size:12px;
      z-index:100000;letter-spacing:1px;animation:toastRise .3s ease;
      border:1.5px solid ${type==='success'?'rgba(100,180,100,.6)':type==='warning'?'rgba(200,150,80,.6)':'rgba(100,150,200,.6)'};
      color:${type==='success'?'#90ff90':type==='warning'?'#ffd070':'#90d0ff'};
    `;
    toast.innerHTML=msg;
    document.body.appendChild(toast);
    setTimeout(()=>toast.remove(),2000);
  }

  draw() {}

  resize() {
    this.shopZone=this._computeShopZone();
    this.trainingZone=this._computeTrainingZone();
    const container=this._getContainer();
    this._worldEnemies.forEach(e=>{e._container=container;e.syncPosition();});
  }

  destroy() {
    window.removeEventListener('keydown',this._keyHandler);
    if(this._respawnTimer!=null) clearInterval(this._respawnTimer);
    if(this._dayTimer!=null) clearInterval(this._dayTimer);
    const enemies=[...this._worldEnemies]; this._worldEnemies=[];
    enemies.forEach(e=>e.remove());
    if(this._battleUI)             this._battleUI.destroy();
    if(this._trainingUI)           this._trainingUI.destroy();
    if(this.hudBar?.parentNode)    this.hudBar.remove();
    if(this._lvlFlash?.parentNode) this._lvlFlash.remove();
    if(this._lightingOverlay?.parentNode) this._lightingOverlay.remove();
    if(this._atmosphereOverlay?.parentNode) this._atmosphereOverlay.remove();
    if(this._flashlightOverlay?.parentNode) this._flashlightOverlay.remove();
    if(this._ui)                   this._ui.destroy();
    if(this._menuScreen)           this._menuScreen.destroy();
    document.getElementById('gameover-overlay')?.remove();
    document.getElementById('mpg-hud-style')?.remove();
    document.getElementById('training-style')?.remove();
    document.getElementById('twinkle-animation')?.remove();
  }
}

export default MarketPirateGame;