---
toc: false
layout: post
title: Digital Divide Interactive learning 
permalink: /digidivide/
---

<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>The Digital Divide — Learning Games</title>
<link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;500;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap" rel="stylesheet">
<style>
:root {
  --bg: #0e0e12;
  --surface: #16161c;
  --surface2: #1e1e26;
  --border: rgba(255,255,255,0.08);
  --border2: rgba(255,255,255,0.14);
  --accent: #7c6fff;
  --accent2: #50e3c2;
  --warn: #ff6b6b;
  --gold: #f5c842;
  --text: #f0eff8;
  --muted: #7c7a8e;
  --good: #50e3c2;
  --bad: #ff6b6b;
}
*{box-sizing:border-box;margin:0;padding:0;}
body{background:var(--bg);color:var(--text);font-family:'DM Sans',sans-serif;min-height:100vh;overflow-x:hidden;}
h1,h2,h3{font-family:'Syne',sans-serif;}

/* NAV */
.topbar{display:flex;align-items:center;gap:16px;padding:14px 24px;border-bottom:1px solid var(--border);position:sticky;top:0;background:rgba(14,14,18,0.95);backdrop-filter:blur(12px);z-index:100;}
.logo{font-family:'Syne',sans-serif;font-weight:800;font-size:15px;color:var(--accent);letter-spacing:-0.3px;}
.nav-scores{display:flex;gap:8px;flex:1;}
.nscore{font-size:11px;padding:3px 10px;border-radius:20px;border:1px solid var(--border);color:var(--muted);transition:all 0.3s;}
.nscore.done{border-color:var(--good);color:var(--good);}
.home-btn{padding:6px 14px;border-radius:8px;border:1px solid var(--border2);background:transparent;color:var(--muted);cursor:pointer;font-size:12px;font-family:'DM Sans',sans-serif;transition:all 0.2s;}
.home-btn:hover{color:var(--text);border-color:var(--border2);}

/* SCREENS */
.screen{display:none;animation:fadeUp 0.35s ease;}
.screen.active{display:block;}
@keyframes fadeUp{from{opacity:0;transform:translateY(12px);}to{opacity:1;transform:translateY(0);}}

/* SPLASH */
#splash{padding:60px 24px;max-width:720px;margin:0 auto;text-align:center;}
.splash-eyebrow{font-size:11px;letter-spacing:0.12em;text-transform:uppercase;color:var(--accent);margin-bottom:16px;}
.splash-title{font-family:'Syne',sans-serif;font-size:clamp(32px,5vw,52px);font-weight:800;line-height:1.1;margin-bottom:14px;}
.splash-title span{color:var(--accent);}
.splash-sub{font-size:15px;color:var(--muted);line-height:1.7;max-width:420px;margin:0 auto 40px;}
.game-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:12px;margin-bottom:32px;}
.gc{background:var(--surface);border:1px solid var(--border);border-radius:16px;padding:20px 16px;cursor:pointer;text-align:center;transition:all 0.2s;position:relative;overflow:hidden;}
.gc::before{content:'';position:absolute;inset:0;background:var(--accent);opacity:0;transition:opacity 0.2s;}
.gc:hover{border-color:var(--accent);transform:translateY(-2px);}
.gc:hover::before{opacity:0.04;}
.gc.completed{border-color:var(--good);}
.gc-icon{font-size:28px;margin-bottom:10px;}
.gc-name{font-family:'Syne',sans-serif;font-size:13px;font-weight:700;color:var(--text);margin-bottom:4px;}
.gc-type{font-size:10px;letter-spacing:0.08em;text-transform:uppercase;padding:3px 8px;border-radius:20px;display:inline-block;margin-top:4px;}
.gc-pts{position:absolute;top:10px;right:10px;font-size:10px;color:var(--good);font-weight:500;display:none;}
.gc.completed .gc-pts{display:block;}
.splash-note{font-size:12px;color:var(--muted);}

/* GAME WRAPPER */
.game-wrap{max-width:760px;margin:0 auto;padding:24px;}
.game-header{margin-bottom:20px;}
.game-tag{font-size:10px;letter-spacing:0.1em;text-transform:uppercase;color:var(--accent);margin-bottom:6px;}
.game-h{font-family:'Syne',sans-serif;font-size:22px;font-weight:700;margin-bottom:4px;}
.game-sub{font-size:13px;color:var(--muted);line-height:1.6;}

/* FEEDBACK */
.fb{padding:12px 16px;border-radius:10px;font-size:13px;line-height:1.5;margin-top:14px;display:none;}
.fb.show{display:block;}
.fb.good{background:rgba(80,227,194,0.12);border:1px solid rgba(80,227,194,0.3);color:var(--good);}
.fb.bad{background:rgba(255,107,107,0.1);border:1px solid rgba(255,107,107,0.25);color:var(--bad);}

/* ACTION ROW */
.arow{display:flex;gap:10px;margin-top:16px;flex-wrap:wrap;align-items:center;}
.btn{padding:9px 22px;border-radius:10px;border:1px solid var(--border2);background:transparent;color:var(--text);cursor:pointer;font-size:13px;font-weight:500;font-family:'DM Sans',sans-serif;transition:all 0.18s;}
.btn:hover{background:var(--surface2);border-color:var(--border2);}
.btn.primary{background:var(--accent);border-color:var(--accent);color:#fff;}
.btn.primary:hover{background:#6b5ef0;}
.rmsg{font-size:12px;color:var(--muted);}

/* ===== DRAG GAME ===== */
.dbank{display:flex;flex-wrap:wrap;gap:8px;padding:12px;background:var(--surface);border:1px solid var(--border);border-radius:12px;min-height:52px;margin-bottom:16px;}
.dtag{padding:7px 13px;background:var(--surface2);border:1px solid var(--border2);border-radius:8px;font-size:12px;cursor:grab;user-select:none;color:var(--text);transition:opacity 0.2s;line-height:1.4;}
.dtag:active{opacity:0.5;cursor:grabbing;}
.dtag.placed{opacity:0.25;cursor:default;pointer-events:none;}
.dlayer{background:var(--surface);border:1px solid var(--border);border-radius:14px;padding:14px;margin-bottom:10px;}
.dlayer-name{font-family:'Syne',sans-serif;font-size:11px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:var(--accent);margin-bottom:10px;}
.dzone{min-height:50px;border:1.5px dashed var(--border2);border-radius:10px;padding:8px;display:flex;flex-wrap:wrap;gap:6px;align-items:flex-start;transition:background 0.15s;}
.dzone.over{background:rgba(124,111,255,0.08);border-color:var(--accent);}
.dchip{padding:6px 10px;background:var(--surface2);border-radius:8px;font-size:12px;color:var(--text);display:flex;align-items:center;gap:6px;line-height:1.4;}
.dchip.c{background:rgba(80,227,194,0.15);color:var(--good);}
.dchip.w{background:rgba(255,107,107,0.12);color:var(--bad);}
.drem{cursor:pointer;color:var(--muted);font-size:15px;line-height:1;flex-shrink:0;}

/* ===== MATCH GAME ===== */
.mgrid{display:grid;grid-template-columns:1fr 1fr;gap:12px;}
.mcol-lbl{font-size:10px;letter-spacing:0.1em;text-transform:uppercase;color:var(--muted);margin-bottom:8px;padding-left:2px;}
.mcol{display:flex;flex-direction:column;gap:6px;}
.mitem{padding:11px 14px;border-radius:10px;border:1px solid var(--border);font-size:13px;cursor:pointer;line-height:1.45;background:var(--surface);color:var(--text);transition:all 0.15s;}
.mitem:hover{border-color:var(--border2);}
.mitem.sel{background:rgba(124,111,255,0.12);border-color:var(--accent);color:var(--accent);}
.mitem.done{background:rgba(80,227,194,0.1);border-color:rgba(80,227,194,0.35);color:var(--good);cursor:default;pointer-events:none;}
.mitem.err{background:rgba(255,107,107,0.1);border-color:var(--bad);color:var(--bad);}
.match-count{font-size:13px;color:var(--muted);margin-top:12px;}
.match-count span{color:var(--text);font-weight:500;}

/* ===== SORT GAME ===== */
.sbank{display:flex;flex-wrap:wrap;gap:8px;padding:12px;background:var(--surface);border:1px solid var(--border);border-radius:12px;min-height:48px;margin-bottom:16px;}
.scard{padding:7px 12px;background:var(--surface2);border:1px solid var(--border2);border-radius:8px;font-size:12px;cursor:grab;user-select:none;color:var(--text);line-height:1.4;transition:opacity 0.2s;}
.scard:active{opacity:0.5;cursor:grabbing;}
.scard.c{background:rgba(80,227,194,0.12);border-color:rgba(80,227,194,0.3);color:var(--good);cursor:default;}
.scard.w{background:rgba(255,107,107,0.1);border-color:rgba(255,107,107,0.3);color:var(--bad);}
.scols{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;}
.scol-wrap{}
.scol-lbl{font-size:11px;font-weight:700;font-family:'Syne',sans-serif;padding:7px 10px;border-radius:8px 8px 0 0;text-align:center;letter-spacing:0.04em;}
.sdrop{min-height:180px;border:1.5px dashed var(--border2);border-radius:0 0 10px 10px;padding:8px;display:flex;flex-direction:column;gap:6px;transition:background 0.15s;}
.sdrop.over{background:rgba(124,111,255,0.06);}

/* ===== FILL GAME ===== */
.wbank{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:16px;}
.wchip{padding:7px 15px;background:var(--surface);border:1px solid var(--border2);border-radius:20px;font-size:13px;cursor:pointer;color:var(--text);transition:all 0.15s;}
.wchip:hover{border-color:var(--accent);}
.wchip.sel{background:rgba(124,111,255,0.15);border-color:var(--accent);color:var(--accent);}
.wchip.used{opacity:0.25;pointer-events:none;}
.fcard{background:var(--surface);border:1px solid var(--border);border-radius:14px;padding:16px 18px;margin-bottom:10px;}
.ftext{font-size:15px;color:var(--text);line-height:2.2;}
.blank{display:inline-block;min-width:120px;border-bottom:2px solid var(--accent);padding:0 6px;color:var(--accent);font-weight:500;cursor:pointer;text-align:center;vertical-align:bottom;transition:all 0.15s;}
.blank:hover{border-bottom-color:var(--accent2);}
.blank.correct{color:var(--good);border-bottom-color:var(--good);}
.blank.wrong{color:var(--bad);border-bottom-color:var(--bad);}

/* ===== WIN ===== */
#winScreen{padding:60px 24px;max-width:600px;margin:0 auto;text-align:center;}
.win-grade{width:100px;height:100px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-family:'Syne',sans-serif;font-size:36px;font-weight:800;margin:0 auto 20px;border:3px solid;}
.win-pts{font-family:'Syne',sans-serif;font-size:48px;font-weight:800;color:var(--text);margin-bottom:8px;}
.win-msg{font-size:15px;color:var(--muted);max-width:380px;margin:0 auto 28px;line-height:1.7;}
.wscores{display:flex;gap:10px;justify-content:center;flex-wrap:wrap;margin-bottom:28px;}
.wsc{background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:10px 18px;text-align:center;}
.wsc-v{font-family:'Syne',sans-serif;font-size:18px;font-weight:700;color:var(--text);}
.wsc-l{font-size:10px;color:var(--muted);text-transform:uppercase;letter-spacing:0.06em;margin-top:2px;}
</style>
</head>
<body>

<div class="topbar">
  <div class="logo">DD Games</div>
  <div class="nav-scores">
    <div class="nscore" id="ns-drag">Drag the Layer</div>
    <div class="nscore" id="ns-match">Connect Terms</div>
    <div class="nscore" id="ns-sort">Sort Barriers</div>
    <div class="nscore" id="ns-fill">Fill the Gap</div>
  </div>
  <button class="home-btn" onclick="go('splash')">Home</button>
</div>

<!-- SPLASH -->
<div id="splash" class="screen active">
  <div class="splash-eyebrow">AP CSP · Digital Divide</div>
  <h1 class="splash-title">The Digital<br><span>Divide</span> Games</h1>
  <p class="splash-sub">Four interactive mini-games based on the Connection Games skit. Master the concepts, earn your grade.</p>
  <div class="game-grid">
    <div class="gc" id="gc-drag" onclick="go('drag')">
      <div class="gc-pts" id="gp-drag"></div>
      <div class="gc-icon">🎯</div>
      <div class="gc-name">Drag the Layer</div>
      <div class="gc-type" style="background:rgba(124,111,255,0.15);color:#7c6fff;">Drag & Drop</div>
    </div>
    <div class="gc" id="gc-match" onclick="go('match')">
      <div class="gc-pts" id="gp-match"></div>
      <div class="gc-icon">🔗</div>
      <div class="gc-name">Connect Terms</div>
      <div class="gc-type" style="background:rgba(80,227,194,0.12);color:#50e3c2;">Matching</div>
    </div>
    <div class="gc" id="gc-sort" onclick="go('sort')">
      <div class="gc-pts" id="gp-sort"></div>
      <div class="gc-icon">📦</div>
      <div class="gc-name">Sort Barriers</div>
      <div class="gc-type" style="background:rgba(245,200,66,0.12);color:#f5c842;">Sorting</div>
    </div>
    <div class="gc" id="gc-fill" onclick="go('fill')">
      <div class="gc-pts" id="gp-fill"></div>
      <div class="gc-icon">✏️</div>
      <div class="gc-name">Fill the Gap</div>
      <div class="gc-type" style="background:rgba(255,107,107,0.12);color:#ff6b6b;">Fill in Blank</div>
    </div>
  </div>
  <p class="splash-note">Complete all four to unlock your final grade</p>
</div>

<!-- DRAG -->
<div id="dragScreen" class="screen">
  <div class="game-wrap">
    <div class="game-header">
      <div class="game-tag">Game 1 · Drag & Drop</div>
      <h2 class="game-h">Drag the Layer</h2>
      <p class="game-sub">Drag each scenario from the bank and drop it into the correct layer of the Digital Divide. Click × to remove a card.</p>
    </div>
    <div class="dbank" id="dbank"></div>
    <div id="dlayers"></div>
    <div class="fb" id="dfb"></div>
    <div class="arow">
      <button class="btn primary" onclick="checkDrag()">Check answers</button>
      <button class="btn" onclick="setupDrag()">Reset</button>
      <span class="rmsg" id="drmsg"></span>
    </div>
  </div>
</div>

<!-- MATCH -->
<div id="matchScreen" class="screen">
  <div class="game-wrap">
    <div class="game-header">
      <div class="game-tag">Game 2 · Matching</div>
      <h2 class="game-h">Connect the Terms</h2>
      <p class="game-sub">Tap a term on the left, then tap its matching definition on the right. Match all 6 pairs to win.</p>
    </div>
    <div class="mgrid">
      <div><div class="mcol-lbl">Terms</div><div class="mcol" id="mleft"></div></div>
      <div><div class="mcol-lbl">Definitions</div><div class="mcol" id="mright"></div></div>
    </div>
    <div class="match-count">Matched: <span id="matchCount">0</span> / 6</div>
    <div class="fb" id="mfb"></div>
  </div>
</div>

<!-- SORT -->
<div id="sortScreen" class="screen">
  <div class="game-wrap">
    <div class="game-header">
      <div class="game-tag">Game 3 · Sorting</div>
      <h2 class="game-h">Sort the Barriers</h2>
      <p class="game-sub">Drag each barrier from the bank into the correct category: Geographic, Socioeconomic, or Demographic.</p>
    </div>
    <div class="sbank" id="sbank"></div>
    <div class="scols" id="scols"></div>
    <div class="fb" id="sfb"></div>
    <div class="arow">
      <button class="btn primary" onclick="checkSort()">Check answers</button>
      <button class="btn" onclick="setupSort()">Reset</button>
      <span class="rmsg" id="srmsg"></span>
    </div>
  </div>
</div>

<!-- FILL -->
<div id="fillScreen" class="screen">
  <div class="game-wrap">
    <div class="game-header">
      <div class="game-tag">Game 4 · Fill in the Blank</div>
      <h2 class="game-h">Fill the Gap</h2>
      <p class="game-sub">Tap a word from the bank, then tap a blank to place it. Tap a filled blank again to remove it.</p>
    </div>
    <div class="wbank" id="wbank"></div>
    <div id="fcards"></div>
    <div class="fb" id="ffb"></div>
    <div class="arow">
      <button class="btn primary" onclick="checkFill()">Check answers</button>
      <button class="btn" onclick="setupFill()">Reset</button>
      <span class="rmsg" id="frmsg"></span>
    </div>
  </div>
</div>

<!-- WIN -->
<div id="winScreen" class="screen">
  <div class="win-grade" id="wg"></div>
  <div class="win-pts" id="wpts"></div>
  <div class="win-msg" id="wmsg"></div>
  <div class="wscores" id="wscores"></div>
  <button class="btn primary" onclick="resetAll()">Play again</button>
</div>

<script>
const scores={drag:null,match:null,sort:null,fill:null};

function go(id){
  document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active'));
  const el=document.getElementById(id==='splash'?'splash':id+'Screen');
  if(el)el.classList.add('active');
  if(id==='drag')setupDrag();
  if(id==='match')setupMatch();
  if(id==='sort')setupSort();
  if(id==='fill')setupFill();
}
function shuf(a){for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
function showFb(id,cls,txt){const el=document.getElementById(id);el.className='fb show '+cls;el.textContent=txt;}
function hideFb(id){const el=document.getElementById(id);el.className='fb';el.textContent='';}

function markDone(game,pts,max){
  scores[game]=pts;
  const ns=document.getElementById('ns-'+game);
  ns.textContent=`${game==='drag'?'Drag':game==='match'?'Match':game==='sort'?'Sort':'Fill'}: ${pts}/${max}`;
  ns.classList.add('done');
  document.getElementById('gc-'+game).classList.add('completed');
  document.getElementById('gp-'+game).textContent=pts+'/'+max+' pts';
  if(Object.values(scores).every(v=>v!==null))setTimeout(showWin,700);
}

/* ======== DRAG ======== */
const DITEMS=[
  {id:'d0',t:'Student does homework in a Taco Bell parking lot for Wi-Fi',a:'Access Divide'},
  {id:'d1',t:'Senior can\'t figure out how to attach a file to an email',a:'Use Divide'},
  {id:'d2',t:'No cell towers within 20 miles of a rural town',a:'Access Divide'},
  {id:'d3',t:'Patient can\'t use telehealth — connection is too slow',a:'Opportunity Divide'},
  {id:'d4',t:'Family cancels internet service to afford groceries',a:'Access Divide'},
  {id:'d5',t:'Job applicant can\'t install the plug-in the portal requires',a:'Use Divide'},
  {id:'d6',t:'Screen reader cannot parse the app\'s navigation buttons',a:'Opportunity Divide'},
];
const DLAYERS=['Access Divide','Use Divide','Opportunity Divide'];
let dDrag=null,dPlaced={};

function setupDrag(){
  dDrag=null;dPlaced={};
  hideFb('dfb');document.getElementById('drmsg').textContent='';
  const bank=document.getElementById('dbank');bank.innerHTML='';
  shuf([...DITEMS]).forEach(item=>{
    const el=document.createElement('div');
    el.className='dtag';el.textContent=item.t;el.id='dt-'+item.id;el.draggable=true;
    el.ondragstart=e=>{dDrag=item.id;e.dataTransfer.effectAllowed='move';};
    bank.appendChild(el);
  });
  const layers=document.getElementById('dlayers');layers.innerHTML='';
  DLAYERS.forEach(layer=>{
    const wrap=document.createElement('div');wrap.className='dlayer';
    const name=document.createElement('div');name.className='dlayer-name';name.textContent=layer;
    const zone=document.createElement('div');zone.className='dzone';zone.id='dz-'+layer;
    zone.ondragover=e=>{e.preventDefault();zone.classList.add('over');};
    zone.ondragleave=()=>zone.classList.remove('over');
    zone.ondrop=e=>{
      e.preventDefault();zone.classList.remove('over');
      if(!dDrag)return;
      if(dPlaced[dDrag]){
        const oz=document.getElementById('dz-'+dPlaced[dDrag]);
        const oc=oz&&oz.querySelector('[data-id="'+dDrag+'"]');
        if(oc)oc.remove();
      }
      dPlaced[dDrag]=layer;
      const chip=document.createElement('div');chip.className='dchip';chip.dataset.id=dDrag;
      const item=DITEMS.find(i=>i.id===dDrag);
      chip.innerHTML=`<span>${item.t}</span><span class="drem" onclick="dRem('${dDrag}')">×</span>`;
      zone.appendChild(chip);
      const tag=document.getElementById('dt-'+dDrag);
      if(tag)tag.classList.add('placed');
      dDrag=null;
    };
    wrap.appendChild(name);wrap.appendChild(zone);layers.appendChild(wrap);
  });
}

function dRem(id){
  const layer=dPlaced[id];if(!layer)return;
  const zone=document.getElementById('dz-'+layer);
  const chip=zone&&zone.querySelector('[data-id="'+id+'"]');
  if(chip)chip.remove();
  delete dPlaced[id];
  const tag=document.getElementById('dt-'+id);
  if(tag)tag.classList.remove('placed');
}

function checkDrag(){
  let c=0;
  DITEMS.forEach(item=>{
    const placed=dPlaced[item.id];
    if(!placed)return;
    const zone=document.getElementById('dz-'+placed);
    const chip=zone&&zone.querySelector('[data-id="'+item.id+'"]');
    if(!chip)return;
    if(placed===item.a){c++;chip.classList.add('c');}
    else chip.classList.add('w');
  });
  const pts=c*14;
  document.getElementById('drmsg').textContent=pts+' / 98 pts';
  showFb('dfb',c===DITEMS.length?'good':'bad',c===DITEMS.length?`All ${c} correct! Perfect.`:`${c}/${DITEMS.length} correct — red ones are in the wrong layer.`);
  markDone('drag',pts,98);
}

/* ======== MATCH ======== */
const MPAIRS=shuf([
  {term:'Digital Divide',def:'The gap between those with and without reliable internet and device access'},
  {term:'Access Divide',def:'Layer 1 — lacking a device or connection entirely'},
  {term:'Use Divide',def:'Layer 2 — having access but not the skills to use it effectively'},
  {term:'Opportunity Divide',def:'Layer 3 — unable to use the internet to actually improve your life'},
  {term:'Homework Gap',def:'Students without home internet who can\'t complete digital schoolwork'},
  {term:'Digital Literacy',def:'The ability to navigate, evaluate, and create using digital tools'},
]);
let mSel=null,mDone=new Set(),mScore=0;

function setupMatch(){
  mSel=null;mDone=new Set();mScore=0;
  hideFb('mfb');document.getElementById('matchCount').textContent='0';
  const terms=shuf([...MPAIRS]);const defs=shuf([...MPAIRS]);
  document.getElementById('mleft').innerHTML='';document.getElementById('mright').innerHTML='';
  terms.forEach(p=>{document.getElementById('mleft').appendChild(mkMI(p.term,'T',p.term));});
  defs.forEach(p=>{document.getElementById('mright').appendChild(mkMI(p.def,'D',p.term));});
}

function mkMI(text,side,key){
  const el=document.createElement('div');
  el.className='mitem';el.textContent=text;el.dataset.key=key;el.dataset.side=side;
  el.onclick=()=>handleMatch(el);return el;
}

function handleMatch(el){
  if(el.classList.contains('done'))return;
  if(!mSel){
    document.querySelectorAll('.mitem.sel').forEach(e=>e.classList.remove('sel'));
    el.classList.add('sel');mSel=el;
  } else {
    if(mSel===el){el.classList.remove('sel');mSel=null;return;}
    if(mSel.dataset.side===el.dataset.side){mSel.classList.remove('sel');el.classList.add('sel');mSel=el;return;}
    if(mSel.dataset.key===el.dataset.key){
      [mSel,el].forEach(e=>{e.classList.remove('sel');e.classList.add('done');e.onclick=null;});
      mDone.add(el.dataset.key);mScore+=17;
      document.getElementById('matchCount').textContent=mDone.size;
      hideFb('mfb');
      if(mDone.size===MPAIRS.length){
        showFb('mfb','good','All 6 pairs matched! Perfect score.');
        markDone('match',mScore,102);
      }
    } else {
      [mSel,el].forEach(e=>e.classList.add('err'));
      showFb('mfb','bad','Not a match — try again!');
      setTimeout(()=>{[mSel,el].forEach(e=>{e.classList.remove('err','sel');});mSel=null;},650);
      return;
    }
    mSel=null;
  }
}

/* ======== SORT ======== */
const SITEMS=shuf([
  {id:'s0',t:'No cell towers in rural county',cat:'Geographic'},
  {id:'s1',t:'Family can\'t afford the monthly internet bill',cat:'Socioeconomic'},
  {id:'s2',t:'Seniors excluded by complex interfaces',cat:'Demographic'},
  {id:'s3',t:'Island village has no undersea cable connection',cat:'Geographic'},
  {id:'s4',t:'School district can\'t buy laptops for students',cat:'Socioeconomic'},
  {id:'s5',t:'People with disabilities face inaccessible websites',cat:'Demographic'},
  {id:'s6',t:'Mountains block all signal in remote valley',cat:'Geographic'},
  {id:'s7',t:'Low-income family chooses food over data plan',cat:'Socioeconomic'},
  {id:'s8',t:'Non-English speakers excluded by English-only tools',cat:'Demographic'},
]);
const SCATS=[
  {name:'Geographic',bg:'rgba(124,111,255,0.15)',tc:'#7c6fff'},
  {name:'Socioeconomic',bg:'rgba(245,200,66,0.12)',tc:'#f5c842'},
  {name:'Demographic',bg:'rgba(80,227,194,0.12)',tc:'#50e3c2'},
];
let sDrag=null,sPlaced={};

function setupSort(){
  sDrag=null;sPlaced={};
  hideFb('sfb');document.getElementById('srmsg').textContent='';
  const bank=document.getElementById('sbank');bank.innerHTML='';
  shuf([...SITEMS]).forEach(item=>{
    const el=document.createElement('div');el.className='scard';el.textContent=item.t;el.id='sc-'+item.id;el.draggable=true;
    el.ondragstart=e=>{sDrag=item.id;e.dataTransfer.effectAllowed='move';};
    bank.appendChild(el);
  });
  const cols=document.getElementById('scols');cols.innerHTML='';
  SCATS.forEach(cat=>{
    const wrap=document.createElement('div');wrap.className='scol-wrap';
    const lbl=document.createElement('div');lbl.className='scol-lbl';
    lbl.style.cssText=`background:${cat.bg};color:${cat.tc};`;lbl.textContent=cat.name;
    const drop=document.createElement('div');drop.className='sdrop';drop.id='sd-'+cat.name;drop.dataset.cat=cat.name;
    drop.style.borderColor=cat.tc+'44';
    drop.ondragover=e=>{e.preventDefault();drop.classList.add('over');};
    drop.ondragleave=()=>drop.classList.remove('over');
    drop.ondrop=e=>{
      e.preventDefault();drop.classList.remove('over');
      if(!sDrag)return;
      const el=document.getElementById('sc-'+sDrag);if(!el)return;
      sPlaced[sDrag]=cat.name;
      el.classList.remove('c','w');
      drop.appendChild(el);
      sDrag=null;
    };
    wrap.appendChild(lbl);wrap.appendChild(drop);cols.appendChild(wrap);
  });
}

function checkSort(){
  let c=0;
  SITEMS.forEach(item=>{
    const el=document.getElementById('sc-'+item.id);if(!el)return;
    if(sPlaced[item.id]===item.cat){c++;el.classList.add('c');el.classList.remove('w');}
    else if(sPlaced[item.id]){el.classList.add('w');el.classList.remove('c');}
  });
  const pts=c*11;
  document.getElementById('srmsg').textContent=pts+' / 99 pts';
  showFb('sfb',c===SITEMS.length?'good':'bad',c===SITEMS.length?'Perfect! All 9 barriers sorted correctly.':`${c}/${SITEMS.length} correct — red cards are in the wrong column.`);
  markDone('sort',pts,99);
}

/* ======== FILL ======== */
const FDATA=[
  {before:'The Digital Divide is shaped by three factors: Geography, Economics, and',blank:'Demographics',after:'.'},
  {before:'Access without skills is like having a car but no',blank:"driver's license",after:'.'},
  {before:'Layer Three of the Digital Divide is the',blank:'Opportunity Divide',after:'— can you use the internet to improve your life?'},
  {before:'Students without home internet who struggle with assignments face the',blank:'Homework Gap',after:'.'},
  {before:'One solution is to treat the internet like a public',blank:'utility',after:', just like water or electricity.'},
  {before:'The most important design question is: "Who are we',blank:'leaving behind',after:'?"'},
];
const FWORDS=shuf(['Demographics',"driver's license",'Opportunity Divide','Homework Gap','utility','leaving behind','infrastructure','Access Divide','digital literacy','geography']);
let fSel=null,fAns={};

function setupFill(){
  fSel=null;fAns={};
  hideFb('ffb');document.getElementById('frmsg').textContent='';
  const wb=document.getElementById('wbank');wb.innerHTML='';
  FWORDS.forEach(w=>{
    const chip=document.createElement('div');chip.className='wchip';chip.textContent=w;chip.dataset.w=w;
    chip.id='wc-'+w.replace(/[^a-zA-Z]/g,'');
    chip.onclick=()=>{
      if(chip.classList.contains('used'))return;
      document.querySelectorAll('.wchip.sel').forEach(c=>c.classList.remove('sel'));
      chip.classList.add('sel');fSel=w;
    };
    wb.appendChild(chip);
  });
  const fc=document.getElementById('fcards');fc.innerHTML='';
  FDATA.forEach((item,i)=>{
    const card=document.createElement('div');card.className='fcard';
    const p=document.createElement('p');p.className='ftext';
    p.appendChild(document.createTextNode(item.before+' '));
    const blank=document.createElement('span');blank.className='blank';blank.id='bl-'+i;blank.textContent='_______';
    blank.onclick=()=>{
      if(fAns[i]){
        const old=fAns[i];
        const oc=document.getElementById('wc-'+old.replace(/[^a-zA-Z]/g,''));
        if(oc){oc.classList.remove('used','sel');}
        delete fAns[i];blank.textContent='_______';blank.className='blank';return;
      }
      if(!fSel)return;
      fAns[i]=fSel;blank.textContent=fSel;blank.className='blank';
      const chip=document.getElementById('wc-'+fSel.replace(/[^a-zA-Z]/g,''));
      if(chip)chip.classList.add('used');
      document.querySelectorAll('.wchip.sel').forEach(c=>c.classList.remove('sel'));
      fSel=null;
    };
    p.appendChild(blank);p.appendChild(document.createTextNode(' '+item.after));
    card.appendChild(p);fc.appendChild(card);
  });
}

function checkFill(){
  let c=0;
  FDATA.forEach((item,i)=>{
    const blank=document.getElementById('bl-'+i);if(!blank)return;
    if(fAns[i]===item.blank){c++;blank.classList.add('correct');}
    else if(fAns[i]){blank.classList.add('wrong');}
  });
  const pts=c*17;
  document.getElementById('frmsg').textContent=pts+' / 102 pts';
  showFb('ffb',c===FDATA.length?'good':'bad',c===FDATA.length?'All blanks correct! Great recall.':`${c}/${FDATA.length} correct — wrong ones are highlighted in red.`);
  markDone('fill',pts,102);
}

/* ======== WIN ======== */
function showWin(){
  const total=Object.values(scores).reduce((a,b)=>a+b,0);
  const max=98+102+99+102;
  const pct=Math.round((total/max)*100);
  let g,bg,tc,border,msg;
  if(pct>=90){g='A+';bg='rgba(80,227,194,0.12)';tc='#50e3c2';border='#50e3c2';msg='Flawless. You know the Digital Divide inside out. Your teacher has zero excuse not to give you that A.';}
  else if(pct>=80){g='A';bg='rgba(80,227,194,0.1)';tc='#50e3c2';border='#50e3c2';msg='Strong performance. You clearly understand the layers, barriers, and solutions. Solid AP CSP work.';}
  else if(pct>=70){g='B';bg='rgba(124,111,255,0.12)';tc='#7c6fff';border='#7c6fff';msg='Good job. A few gaps — go back and redo the game you struggled with most.';}
  else{g='C';bg='rgba(245,200,66,0.1)';tc='#f5c842';border='#f5c842';msg='Keep at it. Re-read the skit focusing on the three layers and three factors, then retry.';}
  document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active'));
  document.getElementById('winScreen').classList.add('active');
  const wg=document.getElementById('wg');
  wg.style.cssText=`background:${bg};color:${tc};border-color:${border};`;wg.textContent=g;
  document.getElementById('wpts').textContent=total+' / '+max;
  document.getElementById('wmsg').textContent=msg;
  document.getElementById('wscores').innerHTML=[
    ['Drag the Layer',scores.drag,98],
    ['Connect Terms',scores.match,102],
    ['Sort Barriers',scores.sort,99],
    ['Fill the Gap',scores.fill,102]
  ].map(([n,s,m])=>`<div class="wsc"><div class="wsc-v">${s}/${m}</div><div class="wsc-l">${n}</div></div>`).join('');
}

function resetAll(){
  Object.keys(scores).forEach(k=>scores[k]=null);
  document.querySelectorAll('.gc').forEach(el=>el.classList.remove('completed'));
  document.querySelectorAll('.nscore').forEach(el=>{el.classList.remove('done');el.textContent=el.textContent.split(':')[0];});
  document.querySelectorAll('.gc-pts').forEach(el=>el.textContent='');
  go('splash');
}
</script>
</body>
</html>