---
toc: false
layout: post
title: The Brick-Source — Crowdsourcing Interactive Lesson
permalink: /bricksource/
---
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>The Brick-Source — Crowdsourcing Games</title>
<link href="https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Outfit:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
<style>
:root {
  --bg: #0a0a0f;
  --surface: #111118;
  --surface2: #1a1a24;
  --surface3: #22222f;
  --border: rgba(255,255,255,0.07);
  --border2: rgba(255,255,255,0.13);
  --accent: #f0b429;
  --accent2: #e85d4a;
  --teal: #3ecfb2;
  --blue: #5b8dee;
  --text: #eeedf5;
  --muted: #6b6a7e;
  --good: #3ecfb2;
  --bad: #e85d4a;
  --radius: 12px;
}
*{box-sizing:border-box;margin:0;padding:0;}
body{background:var(--bg);color:var(--text);font-family:'Outfit',sans-serif;min-height:100vh;overflow-x:hidden;line-height:1.5;}
h1,h2,h3,.mono{font-family:'Space Mono',monospace;}

/* TOPBAR */
.topbar{
  display:flex;align-items:center;gap:14px;
  padding:12px 28px;border-bottom:1px solid var(--border);
  position:sticky;top:0;z-index:100;
  background:rgba(10,10,15,0.92);backdrop-filter:blur(16px);
}
.logo{
  font-family:'Space Mono',monospace;font-size:13px;font-weight:700;
  color:var(--accent);letter-spacing:-0.5px;white-space:nowrap;
}
.nav-pills{display:flex;gap:6px;flex:1;flex-wrap:wrap;}
.npill{
  font-size:10px;padding:4px 11px;border-radius:20px;
  border:1px solid var(--border);color:var(--muted);
  font-family:'Space Mono',monospace;transition:all 0.25s;white-space:nowrap;
}
.npill.done{border-color:var(--good);color:var(--good);}
.home-btn{
  padding:6px 16px;border-radius:8px;border:1px solid var(--border2);
  background:transparent;color:var(--muted);cursor:pointer;
  font-size:12px;font-family:'Outfit',sans-serif;
  transition:all 0.2s;white-space:nowrap;
}
.home-btn:hover{color:var(--text);border-color:var(--accent);}

/* SCREENS */
.screen{display:none;animation:fadeUp 0.3s ease;}
.screen.active{display:block;}
@keyframes fadeUp{from{opacity:0;transform:translateY(10px);}to{opacity:1;transform:translateY(0);}}

/* SPLASH */
#splash{padding:56px 24px 40px;max-width:800px;margin:0 auto;}
.splash-kicker{
  display:inline-block;font-family:'Space Mono',monospace;font-size:10px;
  letter-spacing:0.14em;text-transform:uppercase;color:var(--accent);
  border:1px solid rgba(240,180,41,0.25);padding:5px 14px;border-radius:20px;
  margin-bottom:22px;
}
.splash-title{
  font-family:'Space Mono',monospace;
  font-size:clamp(28px,5vw,52px);font-weight:700;line-height:1.15;
  margin-bottom:6px;
}
.splash-title .hi{color:var(--accent);}
.splash-authors{
  font-size:12px;color:var(--muted);font-family:'Space Mono',monospace;
  margin-bottom:10px;letter-spacing:0.05em;
}
.splash-sub{font-size:15px;color:var(--muted);max-width:500px;margin-bottom:36px;line-height:1.7;}

/* LEGO SLIDE PREVIEW */
.slide-preview{
  background:var(--surface);border:1px solid var(--border2);border-radius:16px;
  padding:16px 20px;margin-bottom:32px;display:flex;align-items:center;gap:16px;
}
.slide-icon{font-size:28px;}
.slide-text{flex:1;}
.slide-label{font-size:10px;text-transform:uppercase;letter-spacing:0.1em;color:var(--muted);margin-bottom:4px;}
.slide-designs{display:flex;gap:8px;flex-wrap:wrap;}
.design-chip{
  padding:5px 14px;border-radius:8px;font-size:12px;font-family:'Space Mono',monospace;
  border:1px solid var(--border2);color:var(--text);
}
.design-chip.a{border-color:rgba(240,180,41,0.4);color:var(--accent);}
.design-chip.b{border-color:rgba(94,141,238,0.4);color:var(--blue);}
.design-chip.c{border-color:rgba(62,207,178,0.4);color:var(--teal);}

/* GAME GRID */
.game-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(170px,1fr));gap:12px;margin-bottom:28px;}
.gc{
  background:var(--surface);border:1px solid var(--border);border-radius:14px;
  padding:20px 16px 16px;cursor:pointer;text-align:center;
  transition:all 0.2s;position:relative;overflow:hidden;
}
.gc:hover{border-color:var(--accent);transform:translateY(-3px);}
.gc.completed{border-color:var(--good);}
.gc-pts{position:absolute;top:10px;right:12px;font-size:10px;color:var(--good);font-family:'Space Mono',monospace;display:none;}
.gc.completed .gc-pts{display:block;}
.gc-icon{font-size:30px;margin-bottom:10px;}
.gc-name{font-family:'Space Mono',monospace;font-size:12px;font-weight:700;margin-bottom:6px;}
.gc-badge{
  font-size:9px;letter-spacing:0.08em;text-transform:uppercase;
  padding:3px 9px;border-radius:20px;display:inline-block;font-family:'Outfit',sans-serif;font-weight:600;
}
.splash-note{font-size:12px;color:var(--muted);font-family:'Space Mono',monospace;}

/* GAME WRAPPER */
.gw{max-width:780px;margin:0 auto;padding:28px 24px;}
.gtag{font-size:10px;font-family:'Space Mono',monospace;letter-spacing:0.1em;text-transform:uppercase;color:var(--accent);margin-bottom:8px;}
.gh{font-family:'Space Mono',monospace;font-size:20px;font-weight:700;margin-bottom:6px;}
.gsub{font-size:13px;color:var(--muted);line-height:1.65;margin-bottom:20px;}

/* FEEDBACK */
.fb{padding:13px 16px;border-radius:10px;font-size:13px;line-height:1.5;margin-top:14px;display:none;}
.fb.show{display:block;}
.fb.good{background:rgba(62,207,178,0.1);border:1px solid rgba(62,207,178,0.28);color:var(--good);}
.fb.bad{background:rgba(232,93,74,0.1);border:1px solid rgba(232,93,74,0.25);color:var(--bad);}

/* BUTTONS */
.arow{display:flex;gap:10px;margin-top:18px;flex-wrap:wrap;align-items:center;}
.btn{
  padding:10px 22px;border-radius:10px;border:1px solid var(--border2);
  background:transparent;color:var(--text);cursor:pointer;
  font-size:13px;font-weight:500;font-family:'Outfit',sans-serif;transition:all 0.18s;
}
.btn:hover{background:var(--surface2);}
.btn.primary{background:var(--accent);border-color:var(--accent);color:#0a0a0f;font-weight:700;}
.btn.primary:hover{background:#e0a520;}
.rmsg{font-size:12px;color:var(--muted);font-family:'Space Mono',monospace;}

/* ===== PHASE VIEWER (Game 1) ===== */
.phases{display:flex;flex-direction:column;gap:12px;}
.phase-card{
  background:var(--surface);border:1px solid var(--border);border-radius:14px;
  overflow:hidden;cursor:pointer;transition:border-color 0.2s;
}
.phase-card:hover{border-color:var(--border2);}
.phase-card.open{border-color:var(--accent);}
.phase-head{
  display:flex;align-items:center;gap:14px;padding:14px 18px;
}
.phase-num{
  width:32px;height:32px;border-radius:8px;
  display:flex;align-items:center;justify-content:center;
  font-family:'Space Mono',monospace;font-size:12px;font-weight:700;
  background:var(--surface2);color:var(--accent);flex-shrink:0;
}
.phase-info{flex:1;}
.phase-title{font-family:'Space Mono',monospace;font-size:13px;font-weight:700;margin-bottom:2px;}
.phase-meta{font-size:11px;color:var(--muted);}
.phase-arrow{color:var(--muted);font-size:14px;transition:transform 0.2s;}
.phase-card.open .phase-arrow{transform:rotate(90deg);}
.phase-body{display:none;border-top:1px solid var(--border);padding:16px 18px;}
.phase-card.open .phase-body{display:block;}
.line{display:flex;gap:12px;margin-bottom:12px;padding:12px 14px;background:var(--surface2);border-radius:10px;}
.speaker{
  font-family:'Space Mono',monospace;font-size:11px;font-weight:700;
  min-width:60px;color:var(--accent);padding-top:1px;
}
.speech{font-size:13px;color:var(--text);line-height:1.65;}
.action-note{
  font-size:12px;color:var(--muted);font-style:italic;
  border-left:2px solid var(--border2);padding-left:12px;margin-top:8px;
}

/* ===== DRAG GAME (Game 2) ===== */
.dbank{
  display:flex;flex-wrap:wrap;gap:8px;padding:14px;
  background:var(--surface);border:1px solid var(--border);border-radius:12px;min-height:56px;margin-bottom:16px;
}
.dtag{
  padding:8px 14px;background:var(--surface2);border:1px solid var(--border2);
  border-radius:8px;font-size:12px;cursor:grab;user-select:none;color:var(--text);
  transition:opacity 0.2s;line-height:1.4;font-family:'Outfit',sans-serif;
}
.dtag:active{opacity:0.5;cursor:grabbing;}
.dtag.placed{opacity:0.2;cursor:default;pointer-events:none;}
.dlayer{background:var(--surface);border:1px solid var(--border);border-radius:14px;padding:14px;margin-bottom:10px;}
.dlayer-name{font-family:'Space Mono',monospace;font-size:10px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:var(--accent);margin-bottom:10px;}
.dzone{
  min-height:52px;border:1.5px dashed var(--border2);border-radius:10px;
  padding:8px;display:flex;flex-wrap:wrap;gap:6px;align-items:flex-start;transition:background 0.15s;
}
.dzone.over{background:rgba(240,180,41,0.06);border-color:var(--accent);}
.dchip{
  padding:7px 11px;background:var(--surface2);border-radius:8px;
  font-size:12px;color:var(--text);display:flex;align-items:center;gap:6px;line-height:1.4;
}
.dchip.c{background:rgba(62,207,178,0.12);color:var(--good);}
.dchip.w{background:rgba(232,93,74,0.1);color:var(--bad);}
.drem{cursor:pointer;color:var(--muted);font-size:16px;line-height:1;flex-shrink:0;}

/* ===== MATCH GAME (Game 3) ===== */
.mgrid{display:grid;grid-template-columns:1fr 1fr;gap:14px;}
.mcol-lbl{font-size:10px;font-family:'Space Mono',monospace;letter-spacing:0.1em;text-transform:uppercase;color:var(--muted);margin-bottom:8px;}
.mcol{display:flex;flex-direction:column;gap:6px;}
.mitem{
  padding:12px 14px;border-radius:10px;border:1px solid var(--border);
  font-size:13px;cursor:pointer;line-height:1.5;background:var(--surface);color:var(--text);
  transition:all 0.15s;
}
.mitem:hover{border-color:var(--border2);}
.mitem.sel{background:rgba(240,180,41,0.1);border-color:var(--accent);color:var(--accent);}
.mitem.done{background:rgba(62,207,178,0.08);border-color:rgba(62,207,178,0.3);color:var(--good);cursor:default;pointer-events:none;}
.mitem.err{background:rgba(232,93,74,0.08);border-color:var(--bad);color:var(--bad);}
.match-count{font-size:13px;color:var(--muted);margin-top:12px;font-family:'Space Mono',monospace;}
.match-count span{color:var(--text);}

/* ===== FILL GAME (Game 4) ===== */
.wbank{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:16px;}
.wchip{
  padding:8px 16px;background:var(--surface);border:1px solid var(--border2);
  border-radius:20px;font-size:13px;cursor:pointer;color:var(--text);transition:all 0.15s;
}
.wchip:hover{border-color:var(--accent);}
.wchip.sel{background:rgba(240,180,41,0.1);border-color:var(--accent);color:var(--accent);}
.wchip.used{opacity:0.2;pointer-events:none;}
.fcard{background:var(--surface);border:1px solid var(--border);border-radius:14px;padding:16px 18px;margin-bottom:10px;}
.ftext{font-size:14px;color:var(--text);line-height:2.4;}
.blank{
  display:inline-block;min-width:130px;border-bottom:2px solid var(--accent);
  padding:0 6px;color:var(--accent);font-weight:600;cursor:pointer;
  text-align:center;vertical-align:bottom;transition:all 0.15s;
  font-family:'Space Mono',monospace;font-size:12px;
}
.blank:hover{border-bottom-color:var(--blue);}
.blank.correct{color:var(--good);border-bottom-color:var(--good);}
.blank.wrong{color:var(--bad);border-bottom-color:var(--bad);}

/* ===== WIN ===== */
#winScreen{padding:60px 24px;max-width:600px;margin:0 auto;text-align:center;}
.win-badge{
  width:96px;height:96px;border-radius:50%;display:flex;align-items:center;justify-content:center;
  font-family:'Space Mono',monospace;font-size:32px;font-weight:700;
  margin:0 auto 20px;border:3px solid;
}
.win-pts{font-family:'Space Mono',monospace;font-size:44px;font-weight:700;color:var(--text);margin-bottom:8px;}
.win-msg{font-size:15px;color:var(--muted);max-width:380px;margin:0 auto 28px;line-height:1.7;}
.wscores{display:flex;gap:10px;justify-content:center;flex-wrap:wrap;margin-bottom:28px;}
.wsc{background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:12px 18px;text-align:center;}
.wsc-v{font-family:'Space Mono',monospace;font-size:16px;font-weight:700;color:var(--text);}
.wsc-l{font-size:10px;color:var(--muted);text-transform:uppercase;letter-spacing:0.06em;margin-top:3px;}
</style>
</head>
<body>

<!-- TOPBAR -->
<div class="topbar">
  <div class="logo">BRICK-SOURCE</div>
  <div class="nav-pills">
    <div class="npill" id="np-script">Script</div>
    <div class="npill" id="np-drag">Drag Sort</div>
    <div class="npill" id="np-match">Match</div>
    <div class="npill" id="np-fill">Fill Blank</div>
  </div>
  <button class="home-btn" onclick="go('splash')">Home</button>
</div>

<!-- SPLASH -->
<div id="splash" class="screen active">
  <div style="max-width:800px;margin:0 auto;padding:56px 24px 40px;">
    <div class="splash-kicker">AP CSP · Crowdsourcing</div>
    <h1 class="splash-title">The <span class="hi">Brick-Source</span><br>Learning Games</h1>
    <div class="splash-authors">Presenters: Anika · Jaynee · Lilian</div>
    <p class="splash-sub">An interactive lesson on crowdsourcing, distributed networks, and human computation — simulated through the LEGO Ideas model.</p>

    <div class="slide-preview">
      <div class="slide-icon">🧱</div>
      <div class="slide-text">
        <div class="slide-label">Slideshow Designs — vote for the best-seller</div>
        <div class="slide-designs">
          <div class="design-chip a">A — Submarine</div>
          <div class="design-chip b">B — Ramen Shop</div>
          <div class="design-chip c">C — Monopoly Set</div>
        </div>
      </div>
    </div>

    <div class="game-grid">
      <div class="gc" id="gc-script" onclick="go('script')">
        <div class="gc-pts" id="gp-script"></div>
        <div class="gc-icon">📜</div>
        <div class="gc-name">The Script</div>
        <div class="gc-badge" style="background:rgba(240,180,41,0.12);color:var(--accent);">Read + Learn</div>
      </div>
      <div class="gc" id="gc-drag" onclick="go('drag')">
        <div class="gc-pts" id="gp-drag"></div>
        <div class="gc-icon">🎯</div>
        <div class="gc-name">Drag &amp; Sort</div>
        <div class="gc-badge" style="background:rgba(94,141,238,0.12);color:var(--blue);">Drag & Drop</div>
      </div>
      <div class="gc" id="gc-match" onclick="go('match')">
        <div class="gc-pts" id="gp-match"></div>
        <div class="gc-icon">🔗</div>
        <div class="gc-name">Connect Terms</div>
        <div class="gc-badge" style="background:rgba(62,207,178,0.12);color:var(--teal);">Matching</div>
      </div>
      <div class="gc" id="gc-fill" onclick="go('fill')">
        <div class="gc-pts" id="gp-fill"></div>
        <div class="gc-icon">✏️</div>
        <div class="gc-name">Fill the Blank</div>
        <div class="gc-badge" style="background:rgba(232,93,74,0.12);color:var(--bad);">Fill in Blank</div>
      </div>
    </div>
    <p class="splash-note">// complete all four activities to unlock your grade</p>
  </div>
</div>

<!-- SCRIPT VIEWER -->
<div id="scriptScreen" class="screen">
  <div class="gw">
    <div class="gtag">Activity 1 · Read</div>
    <h2 class="gh">The Brick-Source Script</h2>
    <p class="gsub">Read through each phase of the simulation. Click a phase header to expand it.</p>
    <div class="phases" id="phases"></div>
    <div class="arow" style="margin-top:24px;">
      <button class="btn primary" onclick="markScript()">Mark as read ✓</button>
    </div>
  </div>
</div>

<!-- DRAG GAME -->
<div id="dragScreen" class="screen">
  <div class="gw">
    <div class="gtag">Activity 2 · Drag &amp; Drop</div>
    <h2 class="gh">Sort the Concepts</h2>
    <p class="gsub">Drag each concept from the bank and drop it into the correct crowdsourcing category. Click × to remove a card.</p>
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

<!-- MATCH GAME -->
<div id="matchScreen" class="screen">
  <div class="gw">
    <div class="gtag">Activity 3 · Matching</div>
    <h2 class="gh">Connect the Terms</h2>
    <p class="gsub">Tap a term on the left, then tap its matching definition on the right.</p>
    <div class="mgrid">
      <div><div class="mcol-lbl">// Terms</div><div class="mcol" id="mleft"></div></div>
      <div><div class="mcol-lbl">// Definitions</div><div class="mcol" id="mright"></div></div>
    </div>
    <div class="match-count">Matched: <span id="matchCount">0</span> / 6</div>
    <div class="fb" id="mfb"></div>
  </div>
</div>

<!-- FILL GAME -->
<div id="fillScreen" class="screen">
  <div class="gw">
    <div class="gtag">Activity 4 · Fill in the Blank</div>
    <h2 class="gh">Fill the Gap</h2>
    <p class="gsub">Tap a word from the bank, then tap a blank to place it. Tap a filled blank to remove it.</p>
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
  <div id="win-inner" style="padding:60px 24px;max-width:600px;margin:0 auto;text-align:center;">
    <div class="win-badge" id="wg"></div>
    <div class="win-pts" id="wpts"></div>
    <div class="win-msg" id="wmsg"></div>
    <div class="wscores" id="wscores"></div>
    <button class="btn primary" onclick="resetAll()">Play again</button>
  </div>
</div>

<script>
// ── STATE ────────────────────────────────────────────────────────
const scores = {script:null, drag:null, match:null, fill:null};

function go(id){
  document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active'));
  const map = {splash:'splash',script:'scriptScreen',drag:'dragScreen',match:'matchScreen',fill:'fillScreen',win:'winScreen'};
  const el = document.getElementById(map[id]||'splash');
  if(el) el.classList.add('active');
  if(id==='script') setupScript();
  if(id==='drag')   setupDrag();
  if(id==='match')  setupMatch();
  if(id==='fill')   setupFill();
}

function shuf(a){for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
function showFb(id,cls,txt){const el=document.getElementById(id);el.className='fb show '+cls;el.textContent=txt;}
function hideFb(id){const el=document.getElementById(id);el.className='fb';el.textContent='';}

function markDone(game, pts, max){
  scores[game] = pts;
  const labels = {script:'Script',drag:'Drag Sort',match:'Match',fill:'Fill Blank'};
  const np = document.getElementById('np-'+game);
  if(np){ np.textContent = labels[game]+': '+pts+'/'+max; np.classList.add('done'); }
  document.getElementById('gc-'+game).classList.add('completed');
  document.getElementById('gp-'+game).textContent = pts+'/'+max+' pts';
  if(Object.values(scores).every(v=>v!==null)) setTimeout(showWin, 700);
}

// ── SCRIPT ───────────────────────────────────────────────────────
const PHASES = [
  {
    num:'01', title:'The Model', time:'1 Minute',
    lines:[
      {speaker:'Anika', text:'We are simulating the LEGO Ideas crowdsourcing model. In this system, LEGO doesn\'t design products in a vacuum — they use a distributed network of fans to determine which designs have the highest market potential.'},
      {speaker:'Lilian', text:'Crowdsourcing allows a central organization to offload the problem of \'predicting success\' to a large group of people. By aggregating your input, we create a public data set that is more reliable than a single expert\'s opinion.'},
      {speaker:'Jaynee', text:'You are acting as distributed individuals. Individually, you are nodes providing a single data point. Collectively, you are a human-powered algorithm performing human computation — tasks that are easy for people but difficult for computers, like judging creativity.'},
    ]
  },
  {
    num:'02', title:'The Data Transmission', time:'2 Minutes',
    lines:[
      {speaker:'Anika', text:'Look at the screen. Evaluate Designs A, B, and C. You have 10 seconds to decide which one is a global best-seller.'},
      {speaker:'Jaynee', text:'We will now collect the data. When I point to your table, please walk up and use the markers at the board to place a single tally mark on the note under your chosen design.'},
    ],
    action:'Jaynee and Lilian gesture for rows to come up. They stand by the board to keep notes in neat columns. Fast, constant flow of people.'
  },
  {
    num:'03', title:'Analysis & Logic', time:'1.5 Minutes',
    lines:[
      {speaker:'Anika', text:'The data transmission is complete. As the \'Server,\' I can see a clear winner. We have successfully filtered the crowd\'s opinions into one actionable result.'},
      {speaker:'Lilian', text:'This demonstrates collaboration. No one here designed the sets, and no one person decided the winner. The final decision emerged from the community.'},
      {speaker:'Jaynee', text:'We must account for bias. In a physical simulation, you might have been influenced by seeing where your peers placed their notes. In a digital crowdsourcing platform, inputs are often kept private until the end to ensure data integrity and independent thought.'},
    ]
  },
  {
    num:'04', title:'Conclusion', time:'30 Seconds',
    lines:[
      {speaker:'Anika', text:'In under five minutes, we processed a complex data set and reached a production-ready decision. This is the core of crowdsourcing: using distributed networks to solve problems at a scale and speed impossible for individuals.'},
      {speaker:'All', text:'Mission complete. Thank you.'},
    ]
  }
];

function setupScript(){
  const container = document.getElementById('phases');
  container.innerHTML = '';
  PHASES.forEach((phase, i) => {
    const card = document.createElement('div');
    card.className = 'phase-card' + (i===0?' open':'');
    card.innerHTML = `
      <div class="phase-head" onclick="togglePhase(this.parentElement)">
        <div class="phase-num">${phase.num}</div>
        <div class="phase-info">
          <div class="phase-title">${phase.title}</div>
          <div class="phase-meta">${phase.time}</div>
        </div>
        <div class="phase-arrow">▶</div>
      </div>
      <div class="phase-body">
        ${phase.lines.map(l=>`
          <div class="line">
            <div class="speaker">${l.speaker}</div>
            <div class="speech">${l.text}</div>
          </div>
        `).join('')}
        ${phase.action ? `<div class="action-note">📋 ${phase.action}</div>` : ''}
      </div>`;
    container.appendChild(card);
  });
}

function togglePhase(card){
  card.classList.toggle('open');
}

function markScript(){
  markDone('script', 25, 25);
  const btn = event.target;
  btn.textContent = '✓ Read!';
  btn.disabled = true;
}

// ── DRAG ─────────────────────────────────────────────────────────
const DITEMS = [
  {id:'d0', t:'A fan submits a LEGO design idea online for others to vote on', a:'Distributed Input'},
  {id:'d1', t:'10,000 fans vote independently, generating a reliable dataset', a:'Aggregation'},
  {id:'d2', t:'LEGO uses vote totals to decide which set to manufacture', a:'Actionable Result'},
  {id:'d3', t:'Each voter acts as a node providing one data point', a:'Distributed Input'},
  {id:'d4', t:'Inputs are kept private until voting ends to prevent copying peers', a:'Data Integrity'},
  {id:'d5', t:'The crowd judges creativity — something algorithms struggle with', a:'Human Computation'},
  {id:'d6', t:'No single expert chose the winner — the community did', a:'Aggregation'},
  {id:'d7', t:'Votes are combined into one final score for each design', a:'Actionable Result'},
];
const DLAYERS = ['Distributed Input','Human Computation','Aggregation','Data Integrity','Actionable Result'];
let dDrag = null, dPlaced = {};

function setupDrag(){
  dDrag = null; dPlaced = {};
  hideFb('dfb'); document.getElementById('drmsg').textContent = '';
  const bank = document.getElementById('dbank'); bank.innerHTML = '';
  shuf([...DITEMS]).forEach(item=>{
    const el = document.createElement('div');
    el.className = 'dtag'; el.textContent = item.t; el.id = 'dt-'+item.id; el.draggable = true;
    el.ondragstart = e => { dDrag = item.id; e.dataTransfer.effectAllowed='move'; };
    bank.appendChild(el);
  });
  const layers = document.getElementById('dlayers'); layers.innerHTML = '';
  DLAYERS.forEach(layer=>{
    const wrap = document.createElement('div'); wrap.className = 'dlayer';
    const name = document.createElement('div'); name.className = 'dlayer-name'; name.textContent = layer;
    const zone = document.createElement('div'); zone.className = 'dzone'; zone.id = 'dz-'+layer;
    zone.ondragover = e => { e.preventDefault(); zone.classList.add('over'); };
    zone.ondragleave = () => zone.classList.remove('over');
    zone.ondrop = e => {
      e.preventDefault(); zone.classList.remove('over');
      if(!dDrag) return;
      if(dPlaced[dDrag]){
        const oz = document.getElementById('dz-'+dPlaced[dDrag]);
        const oc = oz && oz.querySelector('[data-id="'+dDrag+'"]');
        if(oc) oc.remove();
      }
      dPlaced[dDrag] = layer;
      const chip = document.createElement('div'); chip.className = 'dchip'; chip.dataset.id = dDrag;
      const item = DITEMS.find(i=>i.id===dDrag);
      chip.innerHTML = `<span>${item.t}</span><span class="drem" onclick="dRem('${dDrag}')">×</span>`;
      zone.appendChild(chip);
      const tag = document.getElementById('dt-'+dDrag);
      if(tag) tag.classList.add('placed');
      dDrag = null;
    };
    wrap.appendChild(name); wrap.appendChild(zone); layers.appendChild(wrap);
  });
}

function dRem(id){
  const layer = dPlaced[id]; if(!layer) return;
  const zone = document.getElementById('dz-'+layer);
  const chip = zone && zone.querySelector('[data-id="'+id+'"]');
  if(chip) chip.remove();
  delete dPlaced[id];
  const tag = document.getElementById('dt-'+id);
  if(tag) tag.classList.remove('placed');
}

function checkDrag(){
  let c = 0;
  DITEMS.forEach(item=>{
    const placed = dPlaced[item.id];
    if(!placed) return;
    const zone = document.getElementById('dz-'+placed);
    const chip = zone && zone.querySelector('[data-id="'+item.id+'"]');
    if(!chip) return;
    if(placed===item.a){ c++; chip.classList.add('c'); }
    else chip.classList.add('w');
  });
  const pts = c * 12;
  document.getElementById('drmsg').textContent = pts+' / 96 pts';
  showFb('dfb', c===DITEMS.length?'good':'bad',
    c===DITEMS.length ? `All ${c} correct! Excellent sorting.` : `${c}/${DITEMS.length} correct — red cards are in the wrong category.`);
  markDone('drag', pts, 96);
}

// ── MATCH ─────────────────────────────────────────────────────────
const MPAIRS = [
  {term:'Crowdsourcing',    def:'Using a large distributed group to solve problems at scale'},
  {term:'Node',             def:'An individual participant contributing one data point to the network'},
  {term:'Human Computation',def:'Tasks that are easy for humans but difficult for computers, like judging creativity'},
  {term:'Aggregation',      def:'Combining many individual inputs into one collective result'},
  {term:'Data Integrity',   def:'Keeping inputs private and independent to ensure accurate results'},
  {term:'Bias',             def:'A skew in results caused by social influence, like seeing peers\' votes'},
];
let mSel = null, mDone = new Set(), mScore = 0;

function setupMatch(){
  mSel = null; mDone = new Set(); mScore = 0;
  hideFb('mfb'); document.getElementById('matchCount').textContent = '0';
  const terms = shuf([...MPAIRS]); const defs = shuf([...MPAIRS]);
  document.getElementById('mleft').innerHTML = '';
  document.getElementById('mright').innerHTML = '';
  terms.forEach(p=>document.getElementById('mleft').appendChild(mkMI(p.term,'T',p.term)));
  defs.forEach(p=>document.getElementById('mright').appendChild(mkMI(p.def,'D',p.term)));
}

function mkMI(text, side, key){
  const el = document.createElement('div');
  el.className = 'mitem'; el.textContent = text;
  el.dataset.key = key; el.dataset.side = side;
  el.onclick = () => handleMatch(el); return el;
}

function handleMatch(el){
  if(el.classList.contains('done')) return;
  if(!mSel){
    document.querySelectorAll('.mitem.sel').forEach(e=>e.classList.remove('sel'));
    el.classList.add('sel'); mSel = el;
  } else {
    if(mSel===el){ el.classList.remove('sel'); mSel=null; return; }
    if(mSel.dataset.side===el.dataset.side){ mSel.classList.remove('sel'); el.classList.add('sel'); mSel=el; return; }
    if(mSel.dataset.key===el.dataset.key){
      [mSel,el].forEach(e=>{ e.classList.remove('sel'); e.classList.add('done'); e.onclick=null; });
      mDone.add(el.dataset.key); mScore+=17;
      document.getElementById('matchCount').textContent = mDone.size;
      hideFb('mfb');
      if(mDone.size===MPAIRS.length){
        showFb('mfb','good','All 6 pairs matched! Perfect.');
        markDone('match', mScore, 102);
      }
    } else {
      [mSel,el].forEach(e=>e.classList.add('err'));
      showFb('mfb','bad','Not a match — try again!');
      setTimeout(()=>{ [mSel,el].forEach(e=>e.classList.remove('err','sel')); mSel=null; }, 650);
      return;
    }
    mSel = null;
  }
}

// ── FILL ──────────────────────────────────────────────────────────
const FDATA = [
  {before:'Crowdsourcing offloads the problem of predicting success to a large group, making results more reliable than a single', blank:'expert', after:"'s opinion."},
  {before:'Each individual participant is a', blank:'node', after:'providing a single data point to the system.'},
  {before:'Collectively, the crowd acts as a human-powered', blank:'algorithm', after:'performing tasks at scale.'},
  {before:'Judging creativity is an example of', blank:'human computation', after:'— easy for people, hard for computers.'},
  {before:'Keeping votes hidden until the end ensures', blank:'data integrity', after:'and prevents voters from copying peers.'},
  {before:'Seeing where peers voted in a physical simulation introduces', blank:'bias', after:'into the results.'},
  {before:'The final winner emerged from the community — no one', blank:'person', after:'made the decision alone.'},
];
const FWORDS = shuf(['expert','node','algorithm','human computation','data integrity','bias','person','aggregation','server','distributed']);
let fSel = null, fAns = {};

function setupFill(){
  fSel = null; fAns = {};
  hideFb('ffb'); document.getElementById('frmsg').textContent = '';
  const wb = document.getElementById('wbank'); wb.innerHTML = '';
  FWORDS.forEach(w=>{
    const chip = document.createElement('div');
    chip.className='wchip'; chip.textContent=w; chip.dataset.w=w;
    chip.id='wc-'+w.replace(/[^a-zA-Z]/g,'');
    chip.onclick = () => {
      if(chip.classList.contains('used')) return;
      document.querySelectorAll('.wchip.sel').forEach(c=>c.classList.remove('sel'));
      chip.classList.add('sel'); fSel = w;
    };
    wb.appendChild(chip);
  });
  const fc = document.getElementById('fcards'); fc.innerHTML = '';
  FDATA.forEach((item,i)=>{
    const card = document.createElement('div'); card.className='fcard';
    const p = document.createElement('p'); p.className='ftext';
    p.appendChild(document.createTextNode(item.before+' '));
    const blank = document.createElement('span'); blank.className='blank'; blank.id='bl-'+i; blank.textContent='________';
    blank.onclick = () => {
      if(fAns[i]){
        const old = fAns[i];
        const oc = document.getElementById('wc-'+old.replace(/[^a-zA-Z]/g,''));
        if(oc){ oc.classList.remove('used','sel'); }
        delete fAns[i]; blank.textContent='________'; blank.className='blank'; return;
      }
      if(!fSel) return;
      fAns[i] = fSel; blank.textContent = fSel; blank.className='blank';
      const chip = document.getElementById('wc-'+fSel.replace(/[^a-zA-Z]/g,''));
      if(chip) chip.classList.add('used');
      document.querySelectorAll('.wchip.sel').forEach(c=>c.classList.remove('sel'));
      fSel = null;
    };
    p.appendChild(blank); p.appendChild(document.createTextNode(' '+item.after));
    card.appendChild(p); fc.appendChild(card);
  });
}

function checkFill(){
  let c = 0;
  FDATA.forEach((item,i)=>{
    const blank = document.getElementById('bl-'+i); if(!blank) return;
    if(fAns[i]===item.blank){ c++; blank.classList.add('correct'); }
    else if(fAns[i]){ blank.classList.add('wrong'); }
  });
  const pts = c * 15;
  document.getElementById('frmsg').textContent = pts+' / 105 pts';
  showFb('ffb', c===FDATA.length?'good':'bad',
    c===FDATA.length ? 'All blanks correct! Great recall.' : `${c}/${FDATA.length} correct — wrong ones are highlighted in red.`);
  markDone('fill', pts, 105);
}

// ── WIN ───────────────────────────────────────────────────────────
function showWin(){
  const total = Object.values(scores).reduce((a,b)=>a+b,0);
  const max = 25+96+102+105;
  const pct = Math.round((total/max)*100);
  let g,bg,tc,border,msg;
  if(pct>=90){g='A+';bg='rgba(62,207,178,0.12)';tc='#3ecfb2';border='#3ecfb2';msg='Flawless understanding of crowdsourcing, distributed networks, and human computation. Mission complete.';}
  else if(pct>=80){g='A';bg='rgba(62,207,178,0.1)';tc='#3ecfb2';border='#3ecfb2';msg='Strong grasp of the core concepts. You clearly followed the simulation.';}
  else if(pct>=70){g='B';bg='rgba(94,141,238,0.12)';tc='#5b8dee';border='#5b8dee';msg='Good job. Re-read the phases you found tricky and retry.';}
  else{g='C';bg='rgba(240,180,41,0.1)';tc='#f0b429';border='#f0b429';msg='Go back to the script and focus on the key terms: node, aggregation, bias, human computation.';}
  document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active'));
  document.getElementById('winScreen').classList.add('active');
  const wg = document.getElementById('wg');
  wg.style.cssText = `background:${bg};color:${tc};border-color:${border};`;
  wg.textContent = g;
  document.getElementById('wpts').textContent = total+' / '+max;
  document.getElementById('wmsg').textContent = msg;
  document.getElementById('wscores').innerHTML = [
    ['Script Read', scores.script, 25],
    ['Drag Sort',   scores.drag,   96],
    ['Connect Terms', scores.match, 102],
    ['Fill the Blank', scores.fill, 105],
  ].map(([n,s,m])=>`<div class="wsc"><div class="wsc-v">${s}/${m}</div><div class="wsc-l">${n}</div></div>`).join('');
}

function resetAll(){
  Object.keys(scores).forEach(k=>scores[k]=null);
  document.querySelectorAll('.gc').forEach(el=>el.classList.remove('completed'));
  document.querySelectorAll('.npill').forEach(el=>{ el.classList.remove('done'); el.textContent=el.textContent.split(':')[0]; });
  document.querySelectorAll('.gc-pts').forEach(el=>el.textContent='');
  go('splash');
}

// init
setupScript();
</script>
</body>
</html>