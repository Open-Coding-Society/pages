// Imports
import GamEnvBackground from '@assets/js/GameEnginev1.1/essentials/GameEnvBackground.js';
import Player from '@assets/js/GameEnginev1.1/essentials/Player.js';
import Npc from '@assets/js/GameEnginev1.1/essentials/Npc.js';
import GameLevelCsPathIdentity from './GameLevelCsPathIdentity.js';

// ── Code Hub Progress (localStorage) ─────────────────────────────────────────
const CH_KEY = 'code_hub_progress';
function getCHProgress() {
  try { return JSON.parse(localStorage.getItem(CH_KEY)) || {}; } catch { return {}; }
}
function saveCHProgress(updates) {
  const p = getCHProgress();
  Object.assign(p, updates);
  localStorage.setItem(CH_KEY, JSON.stringify(p));
}

// ── CSS animations (injected once) ───────────────────────────────────────────
function ensureCHStyles() {
  if (document.getElementById('ch-styles')) return;
  const s = document.createElement('style');
  s.id = 'ch-styles';
  s.textContent = `
    @keyframes chBounce    { 0%,100%{transform:translateX(-50%) translateY(0)} 50%{transform:translateX(-50%) translateY(-10px)} }
    @keyframes chFall      { 0%{top:-12px;opacity:1;transform:rotate(0deg)} 100%{top:110vh;opacity:0;transform:rotate(720deg)} }
    @keyframes chLockPulse { 0%,100%{opacity:1} 50%{opacity:0.55} }
    @keyframes chSlideIn   { 0%{opacity:0;transform:translateX(-50%) translateY(12px)} 100%{opacity:1;transform:translateX(-50%) translateY(0)} }
    @keyframes chFadeOut   { 0%{opacity:1} 100%{opacity:0;transform:translateX(-50%) translateY(-12px)} }
  `;
  document.body.appendChild(s);
}

// ── Canvas-relative overlay positioning ───────────────────────────────────────
// All overlays are positioned by reading the game canvas's bounding rect so they
// stay glued to the robots regardless of window size or scroll position.
let _chCanvas = null;
const _chOverlayMap = {}; // id → { el, xPct, yPct }

function _placeCHEl(el, xPct, yPct) {
  if (!_chCanvas) return;
  const r = _chCanvas.getBoundingClientRect();
  el.style.left = `${r.left + r.width  * xPct}px`;
  el.style.top  = `${r.top  + r.height * yPct}px`;
}

function _chResizeAll() {
  Object.values(_chOverlayMap).forEach(({ el, xPct, yPct }) => {
    if (document.body.contains(el)) _placeCHEl(el, xPct, yPct);
  });
  const sign = document.getElementById('ch-guide-sign');
  if (sign && _chCanvas) {
    const r = _chCanvas.getBoundingClientRect();
    sign.style.left = `${r.left + r.width * 0.50}px`;
    sign.style.top  = `${r.top  + r.height * 0.31}px`;
  }
}

function initCHCanvas(canvas) {
  _chCanvas = canvas;
  window.removeEventListener('resize', _chResizeAll);
  window.addEventListener('resize', _chResizeAll);
}

// ── Floating guide sign ───────────────────────────────────────────────────────
function showGuideSign() {
  ensureCHStyles();
  if (document.getElementById('ch-guide-sign')) return;
  const el = document.createElement('div');
  el.id = 'ch-guide-sign';
  el.className = 'ch-overlay';
  el.innerHTML = `<div style="font-size:12px;letter-spacing:0.06em;">START HERE</div><div style="font-size:20px;margin-top:2px;">⬇</div>`;
  Object.assign(el.style, {
    position:'fixed', transform:'translateX(-50%)',
    background:'linear-gradient(135deg,#ff6b35,#f7931e)',
    color:'#1a0800', padding:'8px 18px', borderRadius:'10px',
    fontWeight:'800', fontFamily:'system-ui,sans-serif',
    zIndex:'8995', pointerEvents:'none', textAlign:'center',
    animation:'chBounce 1.2s ease-in-out infinite',
    boxShadow:'0 4px 20px rgba(255,107,53,0.6)',
  });
  document.body.appendChild(el);
  _placeCHEl(el, 0.50, 0.31);
}
function removeGuideSign() { document.getElementById('ch-guide-sign')?.remove(); }

// ── Lock overlays ─────────────────────────────────────────────────────────────
function showLockOverlay(id, xPct, yPct, label) {
  ensureCHStyles();
  if (document.getElementById(`ch-lock-${id}`)) return;
  const el = document.createElement('div');
  el.id = `ch-lock-${id}`;
  el.className = 'ch-overlay';
  el.innerHTML = `
    <div style="font-size:24px;line-height:1;">🔒</div>
    <div style="font-size:8px;color:#94a3b8;font-weight:700;text-transform:uppercase;letter-spacing:0.04em;margin-top:3px;white-space:pre-line;text-align:center;">${label}</div>
  `;
  Object.assign(el.style, {
    position:'fixed', transform:'translate(-50%,-50%)',
    background:'rgba(8,12,24,0.92)', border:'2px solid rgba(100,116,139,0.35)',
    borderRadius:'50%', width:'72px', height:'72px',
    display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
    zIndex:'8994', pointerEvents:'none',
    animation:'chLockPulse 2.5s ease-in-out infinite',
    fontFamily:'system-ui,sans-serif', boxShadow:'0 0 0 6px rgba(100,116,139,0.12)',
  });
  document.body.appendChild(el);
  _placeCHEl(el, xPct, yPct);
  _chOverlayMap[id] = { el, xPct, yPct };
}
function removeLockOverlay(id) {
  document.getElementById(`ch-lock-${id}`)?.remove();
  delete _chOverlayMap[id];
}
function removeAllCHOverlays() {
  document.querySelectorAll('.ch-overlay').forEach(el => el.remove());
  Object.keys(_chOverlayMap).forEach(k => delete _chOverlayMap[k]);
  window.removeEventListener('resize', _chResizeAll);
  _chCanvas = null;
}

// ── Confetti burst ────────────────────────────────────────────────────────────
function spawnConfetti() {
  ensureCHStyles();
  const colors = ['#4caef0','#86efac','#fbbf24','#c084fc','#f87171','#ffffff'];
  for (let i = 0; i < 72; i++) {
    const el = document.createElement('div');
    const sz = Math.random() * 9 + 4;
    el.className = 'ch-overlay';
    Object.assign(el.style, {
      position:'fixed', left:`${Math.random()*100}vw`, top:'-12px',
      width:`${sz}px`, height:`${sz}px`,
      background:colors[Math.floor(Math.random()*colors.length)],
      borderRadius: Math.random()>0.5 ? '50%' : '2px',
      zIndex:'99998', pointerEvents:'none',
      animation:`chFall ${1.4+Math.random()*1.8}s ease-in forwards`,
      animationDelay:`${Math.random()*0.7}s`,
    });
    document.body.appendChild(el);
    el.addEventListener('animationend', () => el.remove());
  }
}

// ── Unlock badge toast ────────────────────────────────────────────────────────
function showUnlockBadge(msg) {
  ensureCHStyles();
  const el = document.createElement('div');
  el.className = 'ch-overlay';
  el.textContent = msg;
  Object.assign(el.style, {
    position:'fixed', left:'50vw', top:'12vh', transform:'translateX(-50%)',
    background:'linear-gradient(135deg,#86efac,#4caef0)',
    color:'#0d1526', padding:'12px 28px', borderRadius:'12px',
    fontWeight:'800', fontSize:'14px', fontFamily:'system-ui,sans-serif',
    zIndex:'99997', pointerEvents:'none', letterSpacing:'0.04em',
    animation:'chSlideIn 0.4s ease forwards',
    boxShadow:'0 6px 24px rgba(134,239,172,0.5)',
  });
  document.body.appendChild(el);
  setTimeout(() => {
    el.style.animation = 'chFadeOut 0.5s ease forwards';
    el.addEventListener('animationend', () => el.remove());
  }, 2500);
}

// ── Frontend Mini-Game ────────────────────────────────────────────────────────
function openFrontendGame(gameControl, onWin) {
  document.getElementById('code-hub-panel')?.remove();
  const body = createPanel('🎮 Frontend Challenge — Markdown Decoder', '#4caef0', gameControl);

  const questions = [
    {
      html: '<strong style="color:#e2e8f0;font-size:17px;">Hello World</strong>',
      prompt: 'Which Markdown produces this bold text?',
      options: ['*Hello World*', '**Hello World**', '# Hello World', '> Hello World'],
      answer: 1,
    },
    {
      html: '<h1 style="color:#4caef0;font-size:22px;margin:0;">Big Title</h1>',
      prompt: 'Which Markdown creates an H1 heading?',
      options: ['## Big Title', '# Big Title', '### Big Title', '> Big Title'],
      answer: 1,
    },
    {
      html: '<ul style="margin:0;padding-left:18px;"><li style="color:#cbd5e1;">List item</li></ul>',
      prompt: 'Which Markdown creates an unordered list item?',
      options: ['1. List item', '> List item', '** List item **', '- List item'],
      answer: 3,
    },
    {
      html: '<blockquote style="border-left:3px solid #4caef0;padding:4px 10px;color:#94a3b8;background:rgba(76,175,239,0.06);margin:0;">Important note</blockquote>',
      prompt: 'Which Markdown creates a blockquote?',
      options: ['- Important note', '## Important note', '> Important note', '`Important note`'],
      answer: 2,
    },
    {
      html: '<code style="background:rgba(76,175,239,0.15);color:#4caef0;padding:2px 7px;border-radius:3px;font-size:14px;">myFunction()</code>',
      prompt: 'Which Markdown creates inline code?',
      options: ['*myFunction()*', '**myFunction()**', '> myFunction()', '`myFunction()`'],
      answer: 3,
    },
  ];

  let current = 0, score = 0;

  const render = () => {
    const q = questions[current];
    body.innerHTML = `
      <div style="text-align:center;margin-bottom:14px;">
        <div style="font-size:10px;color:#64748b;text-transform:uppercase;letter-spacing:0.06em;">Question ${current+1} of ${questions.length} &nbsp;·&nbsp; Score: ${score}/${current}</div>
        <div style="display:flex;gap:5px;justify-content:center;margin-top:8px;">
          ${questions.map((_,i)=>`<div style="width:30px;height:5px;border-radius:3px;background:${i<current?'#4caef0':i===current?'rgba(76,175,239,0.3)':'rgba(255,255,255,0.08)'}"></div>`).join('')}
        </div>
      </div>
      <div style="background:rgba(76,175,239,0.07);border:1px solid rgba(76,175,239,0.2);border-radius:10px;padding:22px;margin-bottom:16px;text-align:center;min-height:56px;display:flex;align-items:center;justify-content:center;">${q.html}</div>
      <div style="font-size:13px;color:#94a3b8;margin-bottom:14px;text-align:center;">${q.prompt}</div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;" id="fg-opts"></div>
      <div id="fg-fb" style="margin-top:14px;min-height:28px;text-align:center;font-size:13px;font-weight:700;"></div>
    `;
    const grid = document.getElementById('fg-opts');
    q.options.forEach((opt, i) => {
      const btn = document.createElement('button');
      btn.style.cssText = `background:rgba(76,175,239,0.06);border:1px solid rgba(76,175,239,0.2);border-radius:8px;color:#e2e8f0;padding:12px 14px;font-size:12px;cursor:pointer;font-family:'Fira Code',monospace;text-align:left;transition:background 0.12s,border-color 0.12s;`;
      btn.textContent = opt;
      btn.onmouseover = () => { btn.style.background='rgba(76,175,239,0.15)'; btn.style.borderColor='rgba(76,175,239,0.5)'; };
      btn.onmouseout  = () => { btn.style.background='rgba(76,175,239,0.06)'; btn.style.borderColor='rgba(76,175,239,0.2)'; };
      btn.onclick = () => {
        const correct = i === q.answer;
        if (correct) score++;
        grid.querySelectorAll('button').forEach((b,j) => {
          b.style.pointerEvents = 'none';
          if (j === q.answer) { b.style.background='rgba(134,239,172,0.18)'; b.style.borderColor='#86efac'; b.style.color='#86efac'; }
          else if (j === i && !correct) { b.style.background='rgba(248,113,113,0.18)'; b.style.borderColor='#f87171'; b.style.color='#f87171'; }
        });
        document.getElementById('fg-fb').innerHTML = correct
          ? '<span style="color:#86efac;">✓ Correct!</span>'
          : `<span style="color:#f87171;">✗ Answer: <code style="color:#4caef0;">${q.options[q.answer]}</code></span>`;
        setTimeout(() => { current++; current < questions.length ? render() : showFGResult(); }, 1300);
      };
      grid.appendChild(btn);
    });
  };

  const showFGResult = () => {
    const passed = score >= 4;
    body.innerHTML = `
      <div style="text-align:center;padding:28px 16px;">
        <div style="font-size:52px;margin-bottom:12px;">${passed?'🎉':'📚'}</div>
        <div style="font-size:20px;font-weight:700;color:${passed?'#86efac':'#fbbf24'};margin-bottom:8px;">${passed?'Frontend Unlocked!':'Keep Practicing!'}</div>
        <div style="font-size:13px;color:#94a3b8;margin-bottom:6px;">Score: ${score} / ${questions.length}</div>
        <div style="font-size:12px;color:${passed?'#86efac':'#64748b'};margin-bottom:22px;">${passed?'Markdown mastered — Backend Terminal is now open.':'You need 4/5 to unlock the Backend Terminal.'}</div>
        <div style="display:flex;gap:10px;justify-content:center;">
          ${!passed?`<button id="fg-retry" style="background:rgba(76,175,239,0.12);border:1px solid rgba(76,175,239,0.35);border-radius:8px;color:#4caef0;padding:10px 22px;font-size:13px;font-weight:700;cursor:pointer;">↺ Try Again</button>`:''}
          <button id="fg-done" style="background:${passed?'#4caef0':'rgba(255,255,255,0.06)'};border:1px solid ${passed?'#4caef0':'rgba(255,255,255,0.1)'};border-radius:8px;color:${passed?'#0d1526':'#aaa'};padding:10px 22px;font-size:13px;font-weight:700;cursor:pointer;">${passed?'→ Continue':'Back to Lesson'}</button>
        </div>
      </div>`;
    if (passed) { onWin(); spawnConfetti(); }
    document.getElementById('fg-retry')?.addEventListener('click', () => { current=0; score=0; render(); });
    document.getElementById('fg-done').addEventListener('click', () => {
      document.getElementById('code-hub-panel')?.remove();
      gameControl?.resume?.();
    });
  };

  render();
}

// ── Backend Mini-Game ─────────────────────────────────────────────────────────
function openBackendGame(gameControl, onWin) {
  document.getElementById('code-hub-panel')?.remove();
  const body = createPanel('🎮 Backend Challenge — API Architect', '#86efac', gameControl);

  const questions = [
    { scenario:'Fetch all products from the database',     answer:'GET',    hint:'Reading data always uses GET.' },
    { scenario:'Add a brand-new user account',             answer:'POST',   hint:'Creating resources uses POST.' },
    { scenario:"Update a user's email address",            answer:'PUT',    hint:'Updating existing records uses PUT.' },
    { scenario:'Remove an expired product listing',        answer:'DELETE', hint:'Deleting resources uses DELETE.' },
    { scenario:'Retrieve a single order by its ID',        answer:'GET',    hint:'Even a single-record read uses GET.' },
  ];
  const methodColors = { GET:'#4caef0', POST:'#86efac', PUT:'#fbbf24', DELETE:'#f87171' };
  let current = 0, score = 0;

  const render = () => {
    const q = questions[current];
    body.innerHTML = `
      <div style="text-align:center;margin-bottom:14px;">
        <div style="font-size:10px;color:#64748b;text-transform:uppercase;letter-spacing:0.06em;">Question ${current+1} of ${questions.length} &nbsp;·&nbsp; Score: ${score}/${current}</div>
        <div style="display:flex;gap:5px;justify-content:center;margin-top:8px;">
          ${questions.map((_,i)=>`<div style="width:30px;height:5px;border-radius:3px;background:${i<current?'#86efac':i===current?'rgba(134,239,172,0.3)':'rgba(255,255,255,0.08)'}"></div>`).join('')}
        </div>
      </div>
      <div style="background:rgba(10,15,30,0.55);border:1px solid rgba(134,239,172,0.2);border-radius:10px;padding:22px;margin-bottom:16px;text-align:center;">
        <div style="font-size:10px;color:#64748b;text-transform:uppercase;letter-spacing:0.06em;margin-bottom:8px;">Scenario</div>
        <div style="font-size:16px;color:#e2e8f0;font-weight:600;">${q.scenario}</div>
        <div style="font-family:'Fira Code',monospace;font-size:12px;color:#64748b;margin-top:10px;">??? /api/resource</div>
      </div>
      <div style="font-size:13px;color:#94a3b8;margin-bottom:14px;text-align:center;">Which HTTP method?</div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;" id="bg-opts"></div>
      <div id="bg-fb" style="margin-top:14px;min-height:28px;text-align:center;font-size:13px;font-weight:700;"></div>
    `;
    const grid = document.getElementById('bg-opts');
    ['GET','POST','PUT','DELETE'].forEach(method => {
      const c = methodColors[method];
      const btn = document.createElement('button');
      btn.style.cssText = `background:${c}14;border:1px solid ${c}35;border-radius:8px;color:${c};padding:14px;font-size:15px;font-weight:700;cursor:pointer;letter-spacing:0.05em;transition:background 0.12s,border-color 0.12s;`;
      btn.textContent = method;
      btn.onmouseover = () => { btn.style.background=`${c}28`; btn.style.borderColor=`${c}80`; };
      btn.onmouseout  = () => { btn.style.background=`${c}14`; btn.style.borderColor=`${c}35`; };
      btn.onclick = () => {
        const correct = method === q.answer;
        if (correct) score++;
        grid.querySelectorAll('button').forEach(b => { b.style.pointerEvents='none'; });
        btn.style.background = correct ? 'rgba(134,239,172,0.22)' : 'rgba(248,113,113,0.18)';
        btn.style.borderColor = correct ? '#86efac' : '#f87171';
        btn.style.color = correct ? '#86efac' : '#f87171';
        if (!correct) {
          grid.querySelectorAll('button').forEach(b => {
            if (b.textContent === q.answer) {
              const ac = methodColors[q.answer];
              b.style.background=`${ac}28`; b.style.borderColor=`${ac}80`; b.style.color=ac;
            }
          });
        }
        document.getElementById('bg-fb').innerHTML = correct
          ? `<span style="color:#86efac;">✓ ${q.hint}</span>`
          : `<span style="color:#f87171;">✗ ${q.hint}</span>`;
        setTimeout(() => { current++; current < questions.length ? render() : showBGResult(); }, 1400);
      };
      grid.appendChild(btn);
    });
  };

  const showBGResult = () => {
    const passed = score >= 4;
    body.innerHTML = `
      <div style="text-align:center;padding:28px 16px;">
        <div style="font-size:52px;margin-bottom:12px;">${passed?'🎉':'📚'}</div>
        <div style="font-size:20px;font-weight:700;color:${passed?'#86efac':'#fbbf24'};margin-bottom:8px;">${passed?'Backend Unlocked!':'Keep Practicing!'}</div>
        <div style="font-size:13px;color:#94a3b8;margin-bottom:6px;">Score: ${score} / ${questions.length}</div>
        <div style="font-size:12px;color:${passed?'#86efac':'#64748b'};margin-bottom:22px;">${passed?'REST API expert — Dataviz Terminal is now open.':'You need 4/5 to unlock the Dataviz Terminal.'}</div>
        <div style="display:flex;gap:10px;justify-content:center;">
          ${!passed?`<button id="bg-retry" style="background:rgba(134,239,172,0.12);border:1px solid rgba(134,239,172,0.35);border-radius:8px;color:#86efac;padding:10px 22px;font-size:13px;font-weight:700;cursor:pointer;">↺ Try Again</button>`:''}
          <button id="bg-done" style="background:${passed?'#86efac':'rgba(255,255,255,0.06)'};border:1px solid ${passed?'#86efac':'rgba(255,255,255,0.1)'};border-radius:8px;color:${passed?'#0d1526':'#aaa'};padding:10px 22px;font-size:13px;font-weight:700;cursor:pointer;">${passed?'→ Continue':'Back to Lesson'}</button>
        </div>
      </div>`;
    if (passed) { onWin(); spawnConfetti(); }
    document.getElementById('bg-retry')?.addEventListener('click', () => { current=0; score=0; render(); });
    document.getElementById('bg-done').addEventListener('click', () => {
      document.getElementById('code-hub-panel')?.remove();
      gameControl?.resume?.();
    });
  };

  render();
}

// ── Dataviz Mini-Game ─────────────────────────────────────────────────────────
function openDatavizGame(gameControl, onWin) {
  document.getElementById('code-hub-panel')?.remove();
  const body = createPanel('🎮 Dataviz Challenge — Query Quest', '#c084fc', gameControl);

  const fullSet = [
    { name:'TechCorp',   industry:'Software',   location:'San Francisco', size:500 },
    { name:'HealthPlus', industry:'Healthcare', location:'Boston',         size:120 },
    { name:'EduWorld',   industry:'Education',  location:'San Diego',      size:80  },
    { name:'DataStream', industry:'Software',   location:'Seattle',        size:340 },
    { name:'GreenEnergy',industry:'Energy',     location:'Denver',         size:60  },
    { name:'MediCare',   industry:'Healthcare', location:'Chicago',        size:210 },
    { name:'CloudNine',  industry:'Software',   location:'Austin',         size:900 },
    { name:'LearnFast',  industry:'Education',  location:'Boston',         size:45  },
    { name:'PowerGrid',  industry:'Energy',     location:'Houston',        size:380 },
    { name:'ByteWorks',  industry:'Software',   location:'San Francisco',  size:150 },
    { name:'CareFirst',  industry:'Healthcare', location:'New York',       size:95  },
    { name:'SolarTech',  industry:'Energy',     location:'Phoenix',        size:270 },
  ];

  const challenges = [
    {
      prompt: 'Find all Software companies',
      endpoint: 'GET /api/companies?industry=???',
      type: 'industry', answer: 'Software',
      options: ['Software','Healthcare','Education','Energy'],
      hint: 'Filter by industry = "Software"',
      targets: fullSet.filter(r => r.industry === 'Software').map(r => r.name),
    },
    {
      prompt: 'Find companies with more than 200 employees',
      endpoint: 'GET /api/companies?minSize=???',
      type: 'minSize', answer: '200',
      options: ['50','100','200','400'],
      hint: 'minSize = 200 keeps companies with size > 200',
      targets: fullSet.filter(r => r.size > 200).map(r => r.name),
    },
    {
      prompt: 'Find all companies located in Boston',
      endpoint: 'GET /api/companies?location=???',
      type: 'location', answer: 'Boston',
      options: ['Boston','Seattle','Chicago','Austin'],
      hint: 'Filter by location = "Boston"',
      targets: fullSet.filter(r => r.location === 'Boston').map(r => r.name),
    },
  ];

  let current = 0, score = 0;

  const render = () => {
    const ch = challenges[current];
    body.innerHTML = `
      <div style="text-align:center;margin-bottom:14px;">
        <div style="font-size:10px;color:#64748b;text-transform:uppercase;letter-spacing:0.06em;">Challenge ${current+1} of ${challenges.length} &nbsp;·&nbsp; Score: ${score}/${current}</div>
        <div style="display:flex;gap:5px;justify-content:center;margin-top:8px;">
          ${challenges.map((_,i)=>`<div style="width:30px;height:5px;border-radius:3px;background:${i<current?'#c084fc':i===current?'rgba(192,132,252,0.3)':'rgba(255,255,255,0.08)'}"></div>`).join('')}
        </div>
      </div>
      <div style="background:rgba(192,132,252,0.07);border:1px solid rgba(192,132,252,0.2);border-radius:10px;padding:16px 18px;margin-bottom:16px;">
        <div style="font-size:15px;color:#e2e8f0;font-weight:600;margin-bottom:10px;">${ch.prompt}</div>
        <div style="display:flex;flex-wrap:wrap;gap:6px;">
          ${ch.targets.map(n=>`<span style="background:rgba(192,132,252,0.1);border:1px solid rgba(192,132,252,0.25);border-radius:5px;padding:3px 9px;font-size:11px;color:#c084fc;">${n}</span>`).join('')}
        </div>
      </div>
      <div style="font-family:'Fira Code',monospace;font-size:12px;color:#64748b;text-align:center;margin-bottom:14px;">${ch.endpoint}</div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;" id="dg-opts"></div>
      <div id="dg-fb" style="margin-top:14px;min-height:28px;text-align:center;font-size:13px;font-weight:700;"></div>
    `;
    const grid = document.getElementById('dg-opts');
    ch.options.forEach(opt => {
      const btn = document.createElement('button');
      btn.style.cssText = `background:rgba(192,132,252,0.06);border:1px solid rgba(192,132,252,0.2);border-radius:8px;color:#e2e8f0;padding:12px;font-size:14px;font-weight:600;cursor:pointer;font-family:'Fira Code',monospace;transition:background 0.12s,border-color 0.12s;`;
      btn.textContent = opt;
      btn.onmouseover = () => { btn.style.background='rgba(192,132,252,0.16)'; btn.style.borderColor='rgba(192,132,252,0.5)'; };
      btn.onmouseout  = () => { btn.style.background='rgba(192,132,252,0.06)'; btn.style.borderColor='rgba(192,132,252,0.2)'; };
      btn.onclick = () => {
        const correct = opt === ch.answer;
        if (correct) score++;
        grid.querySelectorAll('button').forEach(b => {
          b.style.pointerEvents = 'none';
          if (b.textContent === ch.answer) { b.style.background='rgba(134,239,172,0.18)'; b.style.borderColor='#86efac'; b.style.color='#86efac'; }
          else if (b === btn && !correct) { b.style.background='rgba(248,113,113,0.18)'; b.style.borderColor='#f87171'; b.style.color='#f87171'; }
        });
        document.getElementById('dg-fb').innerHTML = correct
          ? `<span style="color:#86efac;">✓ ${ch.hint}</span>`
          : `<span style="color:#f87171;">✗ ${ch.hint}</span>`;
        setTimeout(() => { current++; current < challenges.length ? render() : showDGResult(); }, 1400);
      };
      grid.appendChild(btn);
    });
  };

  const showDGResult = () => {
    const passed = score >= 2;
    body.innerHTML = `
      <div style="text-align:center;padding:28px 16px;">
        <div style="font-size:52px;margin-bottom:12px;">${passed?'🏆':'📚'}</div>
        <div style="font-size:20px;font-weight:700;color:${passed?'#86efac':'#fbbf24'};margin-bottom:8px;">${passed?'Code Hub Complete!':'Keep Practicing!'}</div>
        <div style="font-size:13px;color:#94a3b8;margin-bottom:6px;">Score: ${score} / ${challenges.length}</div>
        <div style="font-size:12px;color:${passed?'#86efac':'#64748b'};margin-bottom:22px;">${passed?'You\'ve mastered all three terminals!':'You need 2/3 to complete the Code Hub.'}</div>
        <div style="display:flex;gap:10px;justify-content:center;">
          ${!passed?`<button id="dg-retry" style="background:rgba(192,132,252,0.12);border:1px solid rgba(192,132,252,0.35);border-radius:8px;color:#c084fc;padding:10px 22px;font-size:13px;font-weight:700;cursor:pointer;">↺ Try Again</button>`:''}
          <button id="dg-done" style="background:${passed?'#c084fc':'rgba(255,255,255,0.06)'};border:1px solid ${passed?'#c084fc':'rgba(255,255,255,0.1)'};border-radius:8px;color:${passed?'#0d1526':'#aaa'};padding:10px 22px;font-size:13px;font-weight:700;cursor:pointer;">${passed?'→ Finish':'Back to Lesson'}</button>
        </div>
      </div>`;
    if (passed) { onWin(); spawnConfetti(); }
    document.getElementById('dg-retry')?.addEventListener('click', () => { current=0; score=0; render(); });
    document.getElementById('dg-done').addEventListener('click', () => {
      document.getElementById('code-hub-panel')?.remove();
      gameControl?.resume?.();
    });
  };

  render();
}

// ── Shared panel shell ────────────────────────────────────────────────────────
// Pauses the game on open and resumes on close, matching DialogueSystem behavior.
function createPanel(title, accentColor, gameControl) {
  document.getElementById('code-hub-panel')?.remove();

  // Pause the game while the panel is open
  if (gameControl && typeof gameControl.pause === 'function' && !gameControl.isPaused) {
    gameControl.pause();
  }

  const panel = document.createElement('div');
  panel.id = 'code-hub-panel';
  Object.assign(panel.style, {
    position:     'fixed',
    top:          '4%',
    left:         '50%',
    transform:    'translateX(-50%)',
    width:        'min(720px, 80vw)',
    maxHeight:    '68vh',
    overflowY:    'auto',
    background:   '#0d1526',
    border:       `1px solid ${accentColor}55`,
    borderRadius: '12px',
    zIndex:       '9998',
    fontFamily:   'system-ui, sans-serif',
    boxShadow:    '0 8px 40px rgba(0,0,0,0.75)',
  });

  const header = document.createElement('div');
  Object.assign(header.style, {
    display:        'flex',
    alignItems:     'center',
    justifyContent: 'space-between',
    padding:        '9px 16px',
    background:     `${accentColor}18`,
    borderBottom:   `1px solid ${accentColor}33`,
    position:       'sticky',
    top:            '0',
    zIndex:         '1',
    backdropFilter: 'blur(8px)',
  });
  header.innerHTML = `
    <span style="font-size:11px;font-weight:700;letter-spacing:0.07em;text-transform:uppercase;color:${accentColor};">${title}</span>
    <button id="panel-close" style="background:rgba(255,255,255,0.07);border:1px solid rgba(255,255,255,0.12);border-radius:6px;color:#aaa;padding:4px 10px;font-size:12px;cursor:pointer;">✕ Close</button>
  `;

  const body = document.createElement('div');
  body.id = 'panel-body';
  Object.assign(body.style, { padding: '18px' });

  panel.appendChild(header);
  panel.appendChild(body);
  document.body.appendChild(panel);

  // Resume game when panel is closed
  const closePanel = () => {
    panel.remove();
    if (gameControl && typeof gameControl.resume === 'function') {
      gameControl.resume();
    }
  };
  document.getElementById('panel-close').onclick = closePanel;

  return body;
}

// ── Frontend Panel — Markdown Converter + CSS Playground ─────────────────────
function openFrontendPanel(gameControl) {
  const body = createPanel('⌨ Frontend Terminal — Markdown & CSS', '#4caef0', gameControl);

  body.innerHTML = `
    <!-- Reference box -->
    <div style="background:rgba(76,175,239,0.08);border:1px solid rgba(76,175,239,0.2);border-radius:8px;padding:12px 16px;margin-bottom:16px;">
      <div style="font-size:10px;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;color:#4caef0;margin-bottom:8px;">Markdown Cheat Sheet <span style="background:#4caef022;border:1px solid #4caef044;border-radius:4px;padding:1px 6px;font-size:9px;">REFERENCE</span></div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:4px 24px;font-size:12px;color:#94a3b8;line-height:1.8;">
        <span><code style="color:#e2e8f0;"># H1</code> → &lt;h1&gt; &nbsp;·&nbsp; <code style="color:#e2e8f0;">## H2</code> → &lt;h2&gt;</span>
        <span><code style="color:#e2e8f0;">**bold**</code> → <strong style="color:#e2e8f0;">bold</strong> &nbsp;·&nbsp; <code style="color:#e2e8f0;">*italic*</code> → <em style="color:#e2e8f0;">italic</em></span>
        <span><code style="color:#e2e8f0;">- item</code> → unordered list</span>
        <span><code style="color:#e2e8f0;">[text](url)</code> → link</span>
        <span><code style="color:#e2e8f0;">&gt; text</code> → blockquote</span>
        <span><code style="color:#e2e8f0;">\`code\`</code> → inline code</span>
      </div>
      <div style="margin-top:8px;font-size:11px;color:#4caef0;">💡 Pro tip: Jekyll and GitHub Pages auto-convert <code>.md</code> files to HTML.</div>
    </div>

    <!-- Markdown converter -->
    <div style="margin-bottom:6px;font-size:11px;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;color:#4caef0;">Markdown → HTML Converter</div>
    <div style="font-size:12px;color:#64748b;margin-bottom:10px;">Write Markdown on the left, click Convert, see the rendered HTML on the right.</div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:6px;">
      <div>
        <div style="font-size:10px;font-weight:700;color:#555;text-transform:uppercase;margin-bottom:4px;">✏️ Markdown Input</div>
        <div style="background:#0a0f1e;border:1px solid rgba(76,175,239,0.2);border-radius:8px;overflow:hidden;">
          <div style="display:flex;gap:5px;padding:6px 10px;background:rgba(76,175,239,0.06);border-bottom:1px solid rgba(76,175,239,0.1);">
            <span style="width:9px;height:9px;border-radius:50%;background:#f87171;display:inline-block;"></span>
            <span style="width:9px;height:9px;border-radius:50%;background:#fbbf24;display:inline-block;"></span>
            <span style="width:9px;height:9px;border-radius:50%;background:#86efac;display:inline-block;"></span>
            <span style="margin-left:auto;font-size:10px;color:#4caef0;font-weight:700;">markdown</span>
          </div>
          <textarea id="md-input" spellcheck="false" style="display:block;width:100%;height:150px;background:transparent;border:none;color:#e2e8f0;font-family:'Fira Code',monospace;font-size:12px;padding:10px;resize:none;outline:none;box-sizing:border-box;">## Hello Frontend!

Write your **Markdown** here and hit Convert.

### Why Markdown?
- HTML structures pages
- CSS styles them
- JavaScript makes them *interactive*

> Markdown is faster to write than raw HTML.</textarea>
        </div>
        <div style="display:flex;gap:8px;margin-top:8px;">
          <button id="md-convert" style="background:#4caef0;border:none;border-radius:6px;color:#fff;padding:6px 16px;font-size:12px;font-weight:700;cursor:pointer;flex:1;">Convert to HTML</button>
          <button id="md-reset" style="background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.1);border-radius:6px;color:#aaa;padding:6px 12px;font-size:12px;cursor:pointer;">Reset</button>
        </div>
      </div>
      <div>
        <div style="font-size:10px;font-weight:700;color:#555;text-transform:uppercase;margin-bottom:4px;">👁️ Rendered HTML Preview</div>
        <div style="background:#0a0f1e;border:1px solid rgba(76,175,239,0.2);border-radius:8px;overflow:hidden;">
          <div style="padding:6px 10px;background:rgba(76,175,239,0.06);border-bottom:1px solid rgba(76,175,239,0.1);font-size:10px;color:#4caef0;font-weight:700;">Live Preview</div>
          <div id="md-output" style="padding:10px;font-size:13px;color:#e2e8f0;min-height:172px;line-height:1.7;overflow-y:auto;"><span style="color:#555;font-style:italic;">Click "Convert to HTML" to see output here.</span></div>
        </div>
      </div>
    </div>

    <hr style="border:none;border-top:1px solid rgba(255,255,255,0.07);margin:18px 0;">

    <!-- CSS Reference -->
    <div style="background:rgba(76,175,239,0.08);border:1px solid rgba(76,175,239,0.2);border-radius:8px;padding:12px 16px;margin-bottom:16px;">
      <div style="font-size:10px;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;color:#4caef0;margin-bottom:8px;">Key CSS Concepts <span style="background:#4caef022;border:1px solid #4caef044;border-radius:4px;padding:1px 6px;font-size:9px;">REFERENCE</span></div>
      <div style="font-size:12px;color:#94a3b8;line-height:1.9;">
        <div><strong style="color:#e2e8f0;">Selector</strong> — targets elements: <code style="color:#4caef0;">.class</code> <code style="color:#4caef0;">#id</code> <code style="color:#4caef0;">element:hover</code></div>
        <div><strong style="color:#e2e8f0;">Box model</strong> — margin → border → padding → content</div>
        <div><strong style="color:#e2e8f0;">Flexbox</strong> — <code style="color:#4caef0;">display:flex</code> aligns items in a row or column</div>
        <div><strong style="color:#e2e8f0;">Transitions</strong> — <code style="color:#4caef0;">transition: all 0.3s ease</code> animates property changes</div>
        <div><strong style="color:#e2e8f0;">Gradients</strong> — <code style="color:#4caef0;">background: linear-gradient(135deg, #667eea, #764ba2)</code></div>
      </div>
    </div>

    <!-- CSS Playground -->
    <div style="margin-bottom:6px;font-size:11px;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;color:#4caef0;">CSS Styling Playground</div>
    <div style="font-size:12px;color:#64748b;margin-bottom:10px;">Edit the rules and click Apply CSS to see changes instantly on the right.</div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
      <div>
        <div style="font-size:10px;font-weight:700;color:#555;text-transform:uppercase;margin-bottom:4px;">✏️ CSS Editor</div>
        <div style="background:#0a0f1e;border:1px solid rgba(76,175,239,0.2);border-radius:8px;overflow:hidden;">
          <div style="display:flex;gap:5px;padding:6px 10px;background:rgba(76,175,239,0.06);border-bottom:1px solid rgba(76,175,239,0.1);">
            <span style="width:9px;height:9px;border-radius:50%;background:#f87171;display:inline-block;"></span>
            <span style="width:9px;height:9px;border-radius:50%;background:#fbbf24;display:inline-block;"></span>
            <span style="width:9px;height:9px;border-radius:50%;background:#86efac;display:inline-block;"></span>
            <span style="margin-left:auto;font-size:10px;color:#4caef0;font-weight:700;">css</span>
          </div>
          <textarea id="css-input" spellcheck="false" style="display:block;width:100%;height:160px;background:transparent;border:none;color:#e2e8f0;font-family:'Fira Code',monospace;font-size:12px;padding:10px;resize:none;outline:none;box-sizing:border-box;">.box {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 32px 24px;
  border-radius: 12px;
  color: white;
  text-align: center;
  font-size: 18px;
  font-weight: 700;
  box-shadow: 0 8px 24px rgba(0,0,0,0.4);
  transition: transform 0.3s ease;
  cursor: pointer;
  max-width: 280px;
  margin: 0 auto;
}</textarea>
        </div>
        <div style="display:flex;gap:8px;margin-top:8px;">
          <button id="css-apply" style="background:#4caef0;border:none;border-radius:6px;color:#fff;padding:6px 14px;font-size:12px;font-weight:700;cursor:pointer;flex:1;">Apply CSS</button>
          <button id="css-reset" style="background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.1);border-radius:6px;color:#aaa;padding:6px 12px;font-size:12px;cursor:pointer;">Reset</button>
        </div>
      </div>
      <div>
        <div style="font-size:10px;font-weight:700;color:#555;text-transform:uppercase;margin-bottom:4px;">👁️ Live Preview</div>
        <div id="css-preview" style="background:#0a0f1e;border:1px solid rgba(76,175,239,0.2);border-radius:8px;display:flex;align-items:center;justify-content:center;min-height:196px;padding:16px;box-sizing:border-box;">
          <div id="css-box" style="background:linear-gradient(135deg,#667eea,#764ba2);padding:32px 24px;border-radius:12px;color:white;text-align:center;font-size:18px;font-weight:700;box-shadow:0 8px 24px rgba(0,0,0,0.4);transition:transform 0.3s ease;cursor:pointer;max-width:280px;margin:0 auto;">Hover over me ✨</div>
        </div>
      </div>
    </div>
  `;

  const mdDefault = `## Hello Frontend!\n\nWrite your **Markdown** here and hit Convert.\n\n### Why Markdown?\n- HTML structures pages\n- CSS styles them\n- JavaScript makes them *interactive*\n\n> Markdown is faster to write than raw HTML.`;

  document.getElementById('md-convert').onclick = () => {
    const raw = document.getElementById('md-input').value;
    let html = raw
      .replace(/^### (.+)$/gm,   '<h3 style="color:#4caef0;margin:8px 0 4px;font-size:14px;">$1</h3>')
      .replace(/^## (.+)$/gm,    '<h2 style="color:#4caef0;margin:10px 0 6px;font-size:16px;">$1</h2>')
      .replace(/^# (.+)$/gm,     '<h1 style="color:#4caef0;margin:12px 0 8px;font-size:20px;">$1</h1>')
      .replace(/\*\*(.+?)\*\*/g, '<strong style="color:#e2e8f0;">$1</strong>')
      .replace(/\*(.+?)\*/g,     '<em style="color:#cbd5e1;">$1</em>')
      .replace(/`(.+?)`/g,       '<code style="background:rgba(76,175,239,0.15);color:#4caef0;padding:1px 5px;border-radius:3px;">$1</code>')
      .replace(/^> (.+)$/gm,     '<blockquote style="border-left:3px solid #4caef0;padding:4px 10px;color:#94a3b8;margin:6px 0;background:rgba(76,175,239,0.05);">$1</blockquote>')
      .replace(/^- (.+)$/gm,     '<li style="margin:3px 0;color:#cbd5e1;">$1</li>')
      .replace(/(<li[^>]*>.*<\/li>\n?)+/g, s => `<ul style="padding-left:18px;margin:6px 0;">${s}</ul>`)
      .replace(/\n\n/g, '<br>');
    document.getElementById('md-output').innerHTML = html;
  };

  document.getElementById('md-reset').onclick = () => {
    document.getElementById('md-input').value = mdDefault;
    document.getElementById('md-output').innerHTML = '<span style="color:#555;font-style:italic;">Click "Convert to HTML" to see output here.</span>';
  };

  const cssDefault = `.box {\n  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);\n  padding: 32px 24px;\n  border-radius: 12px;\n  color: white;\n  text-align: center;\n  font-size: 18px;\n  font-weight: 700;\n  box-shadow: 0 8px 24px rgba(0,0,0,0.4);\n  transition: transform 0.3s ease;\n  cursor: pointer;\n  max-width: 280px;\n  margin: 0 auto;\n}`;

  document.getElementById('css-apply').onclick = () => {
    const rules = document.getElementById('css-input').value;
    const el = document.getElementById('css-box');
    const match = rules.match(/\.box\s*\{([^}]*)\}/s);
    if (match) {
      el.removeAttribute('style');
      match[1].split(';').forEach(decl => {
        const [prop, val] = decl.split(':').map(s => s.trim());
        if (prop && val) el.style[prop.replace(/-([a-z])/g, (_, c) => c.toUpperCase())] = val;
      });
    }
  };

  document.getElementById('css-reset').onclick = () => {
    document.getElementById('css-input').value = cssDefault;
    const el = document.getElementById('css-box');
    el.setAttribute('style', 'background:linear-gradient(135deg,#667eea,#764ba2);padding:32px 24px;border-radius:12px;color:white;text-align:center;font-size:18px;font-weight:700;box-shadow:0 8px 24px rgba(0,0,0,0.4);transition:transform 0.3s ease;cursor:pointer;max-width:280px;margin:0 auto;');
    el.textContent = 'Hover over me ✨';
  };

  // ── Challenge CTA ──────────────────────────────────────────────────────────
  const feChallengeDiv = document.createElement('div');
  feChallengeDiv.style.cssText = 'margin-top:20px;padding:16px 18px;background:rgba(76,175,239,0.06);border:1px solid rgba(76,175,239,0.2);border-radius:10px;text-align:center;';
  const feP = getCHProgress();
  if (feP.frontendCompleted) {
    feChallengeDiv.innerHTML = `<div style="font-size:13px;color:#86efac;font-weight:700;">✓ Frontend Challenge Complete — Backend Terminal unlocked!</div>`;
  } else {
    feChallengeDiv.innerHTML = `
      <div style="font-size:12px;color:#94a3b8;margin-bottom:10px;">Reviewed the lesson? Prove your Markdown skills to unlock the Backend terminal.</div>
      <button id="fe-challenge-btn" style="background:#4caef0;border:none;border-radius:8px;color:#0d1526;padding:10px 28px;font-size:13px;font-weight:700;cursor:pointer;">🎮 Play Challenge</button>
    `;
    body.appendChild(feChallengeDiv);
    document.getElementById('fe-challenge-btn').onclick = () => {
      openFrontendGame(gameControl, () => {
        saveCHProgress({ frontendCompleted: true });
        removeLockOverlay('backend');
        showUnlockBadge('🔓 Backend Terminal Unlocked!');
        feChallengeDiv.innerHTML = `<div style="font-size:13px;color:#86efac;font-weight:700;">✓ Frontend Challenge Complete — Backend Terminal unlocked!</div>`;
      });
    };
    return;
  }
  body.appendChild(feChallengeDiv);
}

// ── Backend Panel — REST API Simulator ───────────────────────────────────────
function openBackendPanel(gameControl) {
  const body = createPanel('⌨ Backend Terminal — REST API Simulator', '#86efac', gameControl);

  const db = [
    { id:1, name:'TechCorp',    industry:'Software',  location:'San Francisco', size:150, skills:['Java','Spring'] },
    { id:2, name:'HealthPlus',  industry:'Healthcare',location:'Boston',         size:80,  skills:['Python','Flask'] },
    { id:3, name:'EduWorld',    industry:'Education', location:'San Diego',      size:45,  skills:['JavaScript','React'] },
  ];
  let nextId = 4;
  let activeMethod = 'POST';

  const methods = {
    'POST':   { label:'POST — Create',      color:'#86efac', endpoint:'POST /api/companies',       showBody:true,  showId:false },
    'GETALL': { label:'GET — All',           color:'#4caef0', endpoint:'GET /api/companies',        showBody:false, showId:false },
    'GETONE': { label:'GET — One',           color:'#4caef0', endpoint:'GET /api/companies/{id}',   showBody:false, showId:true  },
    'PUT':    { label:'PUT — Update',        color:'#fbbf24', endpoint:'PUT /api/companies/{id}',   showBody:true,  showId:true  },
    'DELETE': { label:'DELETE — Remove',     color:'#f87171', endpoint:'DELETE /api/companies/{id}',showBody:false, showId:true  },
  };

  const renderDbList = () => {
    if (!db.length) return '<div style="color:#555;font-style:italic;padding:8px;">Database is empty.</div>';
    return db.map(r => `
      <div style="display:flex;gap:10px;align-items:center;padding:7px 10px;background:#0a0f1e;border-radius:6px;margin-bottom:5px;font-size:12px;">
        <span style="color:#555;min-width:22px;">#${r.id}</span>
        <span style="color:#e2e8f0;flex:1;">${r.name}</span>
        <span style="color:#86efac;min-width:90px;">${r.industry}</span>
        <span style="color:#94a3b8;min-width:100px;">${r.location}</span>
        <span style="color:#fbbf24;">${r.size} emp.</span>
      </div>`).join('');
  };

  const log = (status, color, msg) => {
    document.getElementById('api-status').textContent = `HTTP ${status}`;
    document.getElementById('api-status').style.background = `${color}22`;
    document.getElementById('api-status').style.color = color;
    document.getElementById('api-output').style.color = color;
    document.getElementById('api-output').textContent = msg;
    document.getElementById('db-list').innerHTML = renderDbList();
  };

  body.innerHTML = `
    <!-- Reference box -->
    <div style="background:rgba(134,239,172,0.08);border:1px solid rgba(134,239,172,0.2);border-radius:8px;padding:12px 16px;margin-bottom:16px;">
      <div style="font-size:10px;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;color:#86efac;margin-bottom:8px;">REST Methods <span style="background:#86efac22;border:1px solid #86efac44;border-radius:4px;padding:1px 6px;font-size:9px;">REFERENCE</span></div>
      <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:6px;font-size:12px;text-align:center;">
        <div style="background:#86efac18;border:1px solid #86efac33;border-radius:6px;padding:6px;"><div style="color:#86efac;font-weight:700;font-size:13px;">POST</div><div style="color:#94a3b8;font-size:11px;">Create</div></div>
        <div style="background:#4caef018;border:1px solid #4caef033;border-radius:6px;padding:6px;"><div style="color:#4caef0;font-weight:700;font-size:13px;">GET</div><div style="color:#94a3b8;font-size:11px;">Read</div></div>
        <div style="background:#fbbf2418;border:1px solid #fbbf2433;border-radius:6px;padding:6px;"><div style="color:#fbbf24;font-weight:700;font-size:13px;">PUT</div><div style="color:#94a3b8;font-size:11px;">Update</div></div>
        <div style="background:#f8717118;border:1px solid #f8717133;border-radius:6px;padding:6px;"><div style="color:#f87171;font-weight:700;font-size:13px;">DELETE</div><div style="color:#94a3b8;font-size:11px;">Remove</div></div>
      </div>
    </div>

    <!-- Method tabs -->
    <div id="method-tabs" style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:12px;"></div>

    <!-- Endpoint display -->
    <div style="font-size:10px;font-weight:700;color:#555;text-transform:uppercase;margin-bottom:4px;">Endpoint</div>
    <div id="api-endpoint" style="background:#0a0f1e;border:1px solid rgba(134,239,172,0.2);border-radius:6px;padding:8px 12px;font-family:'Fira Code',monospace;font-size:13px;color:#86efac;margin-bottom:12px;"></div>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:12px;">
      <div id="id-wrap">
        <div style="font-size:10px;font-weight:700;color:#555;text-transform:uppercase;margin-bottom:4px;">Path ID</div>
        <input id="api-id" type="number" placeholder="e.g. 1" style="width:100%;background:#0a0f1e;border:1px solid rgba(134,239,172,0.2);border-radius:6px;color:#e2e8f0;font-size:13px;padding:8px 10px;outline:none;box-sizing:border-box;">
      </div>
      <div id="body-wrap">
        <div style="font-size:10px;font-weight:700;color:#555;text-transform:uppercase;margin-bottom:4px;">Request Body (JSON)</div>
        <textarea id="api-body" rows="4" style="width:100%;background:#0a0f1e;border:1px solid rgba(134,239,172,0.2);border-radius:6px;color:#e2e8f0;font-family:'Fira Code',monospace;font-size:12px;padding:8px 10px;resize:none;outline:none;box-sizing:border-box;">{\n  "name": "TechCorp",\n  "industry": "Software",\n  "location": "San Francisco",\n  "size": 150,\n  "skills": ["Java","Spring"]\n}</textarea>
      </div>
    </div>

    <div style="display:flex;gap:8px;margin-bottom:14px;align-items:center;">
      <button id="api-send" style="background:#86efac;border:none;border-radius:6px;color:#0d1526;padding:7px 20px;font-size:12px;font-weight:700;cursor:pointer;">▶ Send Request</button>
      <button id="api-db-reset" style="background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.1);border-radius:6px;color:#aaa;padding:7px 14px;font-size:12px;cursor:pointer;">↺ Reset DB</button>
      <span id="api-status" style="font-size:11px;font-weight:700;padding:4px 10px;border-radius:6px;margin-left:auto;"></span>
    </div>

    <div style="font-size:10px;font-weight:700;color:#555;text-transform:uppercase;margin-bottom:6px;">Response</div>
    <pre id="api-output" style="background:#0a0f1e;border:1px solid rgba(134,239,172,0.15);border-radius:6px;padding:12px;font-size:12px;color:#86efac;min-height:60px;white-space:pre-wrap;margin:0 0 14px;">Send a request to see the response here.</pre>

    <div style="font-size:10px;font-weight:700;color:#555;text-transform:uppercase;margin-bottom:6px;">Current Database</div>
    <div id="db-list"></div>
  `;

  const defaultBody = `{\n  "name": "TechCorp",\n  "industry": "Software",\n  "location": "San Francisco",\n  "size": 150,\n  "skills": ["Java","Spring"]\n}`;
  document.getElementById('api-body').value = defaultBody;
  document.getElementById('db-list').innerHTML = renderDbList();

  // Build method tabs
  const tabsEl = document.getElementById('method-tabs');
  Object.entries(methods).forEach(([key, m]) => {
    const btn = document.createElement('button');
    btn.textContent = m.label;
    btn.dataset.key = key;
    Object.assign(btn.style, {
      background: key === 'POST' ? `${m.color}22` : 'rgba(255,255,255,0.05)',
      border: `1px solid ${key === 'POST' ? m.color + '55' : 'rgba(255,255,255,0.1)'}`,
      borderRadius: '6px', color: key === 'POST' ? m.color : '#aaa',
      padding: '5px 12px', fontSize: '12px', fontWeight: '700', cursor: 'pointer',
    });
    btn.onclick = () => {
      activeMethod = key;
      document.getElementById('api-endpoint').textContent = m.endpoint;
      document.getElementById('id-wrap').style.display   = m.showId   ? 'block' : 'none';
      document.getElementById('body-wrap').style.display = m.showBody ? 'block' : 'none';
      tabsEl.querySelectorAll('button').forEach(b => {
        const bm = methods[b.dataset.key];
        b.style.background = b.dataset.key === key ? `${bm.color}22` : 'rgba(255,255,255,0.05)';
        b.style.border = `1px solid ${b.dataset.key === key ? bm.color + '55' : 'rgba(255,255,255,0.1)'}`;
        b.style.color = b.dataset.key === key ? bm.color : '#aaa';
      });
    };
    tabsEl.appendChild(btn);
  });
  document.getElementById('api-endpoint').textContent = methods['POST'].endpoint;

  const initialDb = [
    { id:1, name:'TechCorp',    industry:'Software',  location:'San Francisco', size:150, skills:['Java','Spring'] },
    { id:2, name:'HealthPlus',  industry:'Healthcare',location:'Boston',         size:80,  skills:['Python','Flask'] },
    { id:3, name:'EduWorld',    industry:'Education', location:'San Diego',      size:45,  skills:['JavaScript','React'] },
  ];

  document.getElementById('api-db-reset').onclick = () => {
    db.length = 0; db.push(...initialDb.map(r => ({...r, skills:[...r.skills]})));
    nextId = 4;
    log(200, '#86efac', 'Database reset to initial state.');
  };

  document.getElementById('api-send').onclick = () => {
    const id = parseInt(document.getElementById('api-id').value) || null;
    let bodyData = null;
    try {
      if (methods[activeMethod].showBody) bodyData = JSON.parse(document.getElementById('api-body').value);
    } catch(e) { log(400, '#f87171', 'Bad Request: invalid JSON body.\n' + e.message); return; }

    if (activeMethod === 'POST') {
      if (!bodyData?.name) { log(400, '#f87171', 'Bad Request: "name" is required.'); return; }
      const rec = { id: nextId++, ...bodyData };
      db.push(rec);
      log(201, '#86efac', JSON.stringify(rec, null, 2));
    } else if (activeMethod === 'GETALL') {
      log(200, '#4caef0', JSON.stringify(db, null, 2));
    } else if (activeMethod === 'GETONE') {
      const rec = db.find(r => r.id === id);
      if (!rec) { log(404, '#f87171', `Not Found: no record with id ${id}.`); return; }
      log(200, '#4caef0', JSON.stringify(rec, null, 2));
    } else if (activeMethod === 'PUT') {
      const rec = db.find(r => r.id === id);
      if (!rec) { log(404, '#f87171', `Not Found: no record with id ${id}.`); return; }
      Object.assign(rec, bodyData);
      log(200, '#fbbf24', JSON.stringify(rec, null, 2));
    } else if (activeMethod === 'DELETE') {
      const idx = db.findIndex(r => r.id === id);
      if (idx === -1) { log(404, '#f87171', `Not Found: no record with id ${id}.`); return; }
      const removed = db.splice(idx, 1)[0];
      log(200, '#f87171', `Deleted:\n${JSON.stringify(removed, null, 2)}`);
    }
  };

  // ── Challenge CTA ──────────────────────────────────────────────────────────
  const beChallengeDiv = document.createElement('div');
  beChallengeDiv.style.cssText = 'margin-top:20px;padding:16px 18px;background:rgba(134,239,172,0.06);border:1px solid rgba(134,239,172,0.2);border-radius:10px;text-align:center;';
  const beP = getCHProgress();
  if (beP.backendCompleted) {
    beChallengeDiv.innerHTML = `<div style="font-size:13px;color:#86efac;font-weight:700;">✓ Backend Challenge Complete — Dataviz Terminal unlocked!</div>`;
  } else {
    beChallengeDiv.innerHTML = `
      <div style="font-size:12px;color:#94a3b8;margin-bottom:10px;">Tested the API? Prove your REST knowledge to unlock the Dataviz terminal.</div>
      <button id="be-challenge-btn" style="background:#86efac;border:none;border-radius:8px;color:#0d1526;padding:10px 28px;font-size:13px;font-weight:700;cursor:pointer;">🎮 Play Challenge</button>
    `;
    body.appendChild(beChallengeDiv);
    document.getElementById('be-challenge-btn').onclick = () => {
      openBackendGame(gameControl, () => {
        saveCHProgress({ backendCompleted: true });
        removeLockOverlay('dataviz');
        showUnlockBadge('🔓 Dataviz Terminal Unlocked!');
        beChallengeDiv.innerHTML = `<div style="font-size:13px;color:#86efac;font-weight:700;">✓ Backend Challenge Complete — Dataviz Terminal unlocked!</div>`;
      });
    };
    return;
  }
  body.appendChild(beChallengeDiv);
}

// ── Dataviz Panel — Filtering + Pagination + Query Builder ───────────────────
function openDatavizPanel(gameControl) {
  const body = createPanel('⌨ Dataviz Terminal — Filtering, Pagination & Queries', '#c084fc', gameControl);

  const dataset = [
    { id:1,  name:'TechCorp',    industry:'Software',      location:'San Francisco', size:500,  skills:['Java','Spring'] },
    { id:2,  name:'HealthPlus',  industry:'Healthcare',    location:'Boston',         size:120,  skills:['Python','ML'] },
    { id:3,  name:'EduWorld',    industry:'Education',     location:'San Diego',      size:80,   skills:['JavaScript','React'] },
    { id:4,  name:'DataStream',  industry:'Software',      location:'Seattle',        size:340,  skills:['Python','Spark'] },
    { id:5,  name:'GreenEnergy', industry:'Energy',        location:'Denver',         size:60,   skills:['Java','IoT'] },
    { id:6,  name:'MediCare',    industry:'Healthcare',    location:'Chicago',        size:210,  skills:['Python','Flask'] },
    { id:7,  name:'CloudNine',   industry:'Software',      location:'Austin',         size:900,  skills:['Go','Kubernetes'] },
    { id:8,  name:'LearnFast',   industry:'Education',     location:'Boston',         size:45,   skills:['JavaScript','Vue'] },
    { id:9,  name:'PowerGrid',   industry:'Energy',        location:'Houston',        size:380,  skills:['C++','Embedded'] },
    { id:10, name:'ByteWorks',   industry:'Software',      location:'San Francisco',  size:150,  skills:['Java','Spring'] },
    { id:11, name:'CareFirst',   industry:'Healthcare',    location:'New York',       size:95,   skills:['Python','Django'] },
    { id:12, name:'SolarTech',   industry:'Energy',        location:'Phoenix',        size:270,  skills:['Java','IoT'] },
  ];

  let page = 1;
  const PAGE_SIZE = 4;
  let filtered = [...dataset];

  body.innerHTML = `
    <!-- Reference box -->
    <div style="background:rgba(192,132,252,0.08);border:1px solid rgba(192,132,252,0.2);border-radius:8px;padding:12px 16px;margin-bottom:16px;">
      <div style="font-size:10px;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;color:#c084fc;margin-bottom:8px;">Query & Pagination Patterns <span style="background:#c084fc22;border:1px solid #c084fc44;border-radius:4px;padding:1px 6px;font-size:9px;">REFERENCE</span></div>
      <div style="font-size:12px;color:#94a3b8;line-height:1.9;">
        <div><strong style="color:#e2e8f0;">Filter by field</strong> — <code style="color:#c084fc;">GET /api/companies?industry=Software</code></div>
        <div><strong style="color:#e2e8f0;">Min size</strong> — <code style="color:#c084fc;">GET /api/companies?minSize=100</code></div>
        <div><strong style="color:#e2e8f0;">Paginate</strong> — <code style="color:#c084fc;">GET /api/companies?page=1&size=4</code></div>
        <div><strong style="color:#e2e8f0;">Spring JPA</strong> — <code style="color:#c084fc;">findBySizeGreaterThan(int min)</code></div>
        <div><strong style="color:#e2e8f0;">JPQL</strong> — <code style="color:#c084fc;">SELECT c FROM Company c WHERE c.size &gt; :min</code></div>
      </div>
    </div>

    <!-- Filters -->
    <div style="font-size:11px;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;color:#c084fc;margin-bottom:10px;">Search & Data Filtering</div>
    <div style="display:grid;grid-template-columns:1fr 1fr 1fr auto auto;gap:10px;align-items:end;margin-bottom:14px;">
      <div>
        <div style="font-size:10px;font-weight:700;color:#555;text-transform:uppercase;margin-bottom:4px;">Industry</div>
        <select id="dv-industry" style="width:100%;background:#0a0f1e;border:1px solid rgba(192,132,252,0.3);border-radius:6px;color:#e2e8f0;font-size:13px;padding:7px 10px;outline:none;">
          <option value="">All Industries</option>
          <option>Software</option><option>Healthcare</option><option>Education</option><option>Energy</option>
        </select>
      </div>
      <div>
        <div style="font-size:10px;font-weight:700;color:#555;text-transform:uppercase;margin-bottom:4px;">Location</div>
        <input id="dv-location" placeholder="e.g. Boston" style="width:100%;background:#0a0f1e;border:1px solid rgba(192,132,252,0.3);border-radius:6px;color:#e2e8f0;font-size:13px;padding:7px 10px;outline:none;box-sizing:border-box;">
      </div>
      <div>
        <div style="font-size:10px;font-weight:700;color:#555;text-transform:uppercase;margin-bottom:4px;">Min Size</div>
        <input id="dv-size" type="number" placeholder="e.g. 100" style="width:100%;background:#0a0f1e;border:1px solid rgba(192,132,252,0.3);border-radius:6px;color:#e2e8f0;font-size:13px;padding:7px 10px;outline:none;box-sizing:border-box;">
      </div>
      <button id="dv-filter" style="background:#c084fc;border:none;border-radius:6px;color:#0d1526;padding:7px 16px;font-size:12px;font-weight:700;cursor:pointer;">Apply</button>
      <button id="dv-reset"  style="background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.1);border-radius:6px;color:#aaa;padding:7px 12px;font-size:12px;cursor:pointer;">Reset</button>
    </div>

    <!-- Generated query display -->
    <div style="font-size:10px;font-weight:700;color:#555;text-transform:uppercase;margin-bottom:4px;">Generated JPQL</div>
    <pre id="dv-jpql" style="background:#0a0f1e;border:1px solid rgba(192,132,252,0.15);border-radius:6px;padding:8px 12px;font-size:12px;color:#c084fc;margin:0 0 14px;white-space:pre-wrap;">SELECT c FROM Company c</pre>

    <!-- Table -->
    <div id="dv-table-wrap"></div>

    <!-- Pagination -->
    <div style="display:flex;align-items:center;justify-content:space-between;margin-top:12px;">
      <div id="dv-info" style="font-size:12px;color:#94a3b8;"></div>
      <div style="display:flex;gap:8px;">
        <button id="dv-prev" style="background:rgba(192,132,252,0.12);border:1px solid rgba(192,132,252,0.3);border-radius:6px;color:#c084fc;padding:6px 14px;font-size:12px;cursor:pointer;">← Prev</button>
        <button id="dv-next" style="background:rgba(192,132,252,0.12);border:1px solid rgba(192,132,252,0.3);border-radius:6px;color:#c084fc;padding:6px 14px;font-size:12px;cursor:pointer;">Next →</button>
      </div>
    </div>
  `;

  const buildJpql = () => {
    const ind  = document.getElementById('dv-industry').value;
    const loc  = document.getElementById('dv-location').value.trim();
    const size = document.getElementById('dv-size').value;
    const clauses = [];
    if (ind)  clauses.push(`c.industry = '${ind}'`);
    if (loc)  clauses.push(`c.location = '${loc}'`);
    if (size) clauses.push(`c.size > ${size}`);
    return clauses.length
      ? `SELECT c FROM Company c\nWHERE ${clauses.join('\n  AND ')}`
      : 'SELECT c FROM Company c';
  };

  const renderTable = () => {
    const total = filtered.length;
    const pages = Math.ceil(total / PAGE_SIZE) || 1;
    page = Math.min(page, pages);
    const slice = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    document.getElementById('dv-info').textContent =
      `${total} result${total !== 1 ? 's' : ''} — Page ${page} of ${pages}`;

    const rows = slice.map(r => `
      <tr>
        <td style="padding:7px 12px;border-bottom:1px solid rgba(255,255,255,0.05);color:#555;">${r.id}</td>
        <td style="padding:7px 12px;border-bottom:1px solid rgba(255,255,255,0.05);color:#e2e8f0;font-weight:600;">${r.name}</td>
        <td style="padding:7px 12px;border-bottom:1px solid rgba(255,255,255,0.05);color:#c084fc;">${r.industry}</td>
        <td style="padding:7px 12px;border-bottom:1px solid rgba(255,255,255,0.05);color:#94a3b8;">${r.location}</td>
        <td style="padding:7px 12px;border-bottom:1px solid rgba(255,255,255,0.05);color:#86efac;">${r.size}</td>
        <td style="padding:7px 12px;border-bottom:1px solid rgba(255,255,255,0.05);color:#4caef0;font-size:11px;">${r.skills.join(', ')}</td>
      </tr>`).join('');

    document.getElementById('dv-table-wrap').innerHTML = `
      <table style="width:100%;border-collapse:collapse;background:#0a0f1e;border-radius:8px;overflow:hidden;font-size:12px;">
        <thead><tr style="background:rgba(192,132,252,0.1);">
          <th style="padding:7px 12px;text-align:left;font-size:10px;font-weight:700;letter-spacing:0.05em;text-transform:uppercase;color:#c084fc;">ID</th>
          <th style="padding:7px 12px;text-align:left;font-size:10px;font-weight:700;letter-spacing:0.05em;text-transform:uppercase;color:#c084fc;">Name</th>
          <th style="padding:7px 12px;text-align:left;font-size:10px;font-weight:700;letter-spacing:0.05em;text-transform:uppercase;color:#c084fc;">Industry</th>
          <th style="padding:7px 12px;text-align:left;font-size:10px;font-weight:700;letter-spacing:0.05em;text-transform:uppercase;color:#c084fc;">Location</th>
          <th style="padding:7px 12px;text-align:left;font-size:10px;font-weight:700;letter-spacing:0.05em;text-transform:uppercase;color:#c084fc;">Size</th>
          <th style="padding:7px 12px;text-align:left;font-size:10px;font-weight:700;letter-spacing:0.05em;text-transform:uppercase;color:#c084fc;">Skills</th>
        </tr></thead>
        <tbody>${rows}</tbody>
      </table>`;
  };

  renderTable();

  document.getElementById('dv-filter').onclick = () => {
    const ind  = document.getElementById('dv-industry').value;
    const loc  = document.getElementById('dv-location').value.trim().toLowerCase();
    const size = parseInt(document.getElementById('dv-size').value) || 0;
    filtered = dataset.filter(r =>
      (!ind  || r.industry === ind) &&
      (!loc  || r.location.toLowerCase().includes(loc)) &&
      (!size || r.size >= size)
    );
    page = 1;
    document.getElementById('dv-jpql').textContent = buildJpql();
    renderTable();
  };

  document.getElementById('dv-reset').onclick = () => {
    document.getElementById('dv-industry').value = '';
    document.getElementById('dv-location').value = '';
    document.getElementById('dv-size').value = '';
    filtered = [...dataset];
    page = 1;
    document.getElementById('dv-jpql').textContent = 'SELECT c FROM Company c';
    renderTable();
  };

  document.getElementById('dv-prev').onclick = () => { if (page > 1) { page--; renderTable(); } };
  document.getElementById('dv-next').onclick = () => {
    if (page < Math.ceil(filtered.length / PAGE_SIZE)) { page++; renderTable(); }
  };

  // ── Challenge CTA ──────────────────────────────────────────────────────────
  const dvChallengeDiv = document.createElement('div');
  dvChallengeDiv.style.cssText = 'margin-top:20px;padding:16px 18px;background:rgba(192,132,252,0.06);border:1px solid rgba(192,132,252,0.2);border-radius:10px;text-align:center;';
  const dvP = getCHProgress();
  if (dvP.datavizCompleted) {
    dvChallengeDiv.innerHTML = `<div style="font-size:13px;color:#86efac;font-weight:700;">✓ Dataviz Challenge Complete — Code Hub mastered!</div>`;
  } else {
    dvChallengeDiv.innerHTML = `
      <div style="font-size:12px;color:#94a3b8;margin-bottom:10px;">Explored the data? Complete the final challenge to master the Code Hub!</div>
      <button id="dv-challenge-btn" style="background:#c084fc;border:none;border-radius:8px;color:#0d1526;padding:10px 28px;font-size:13px;font-weight:700;cursor:pointer;">🎮 Play Challenge</button>
    `;
    body.appendChild(dvChallengeDiv);
    document.getElementById('dv-challenge-btn').onclick = () => {
      openDatavizGame(gameControl, () => {
        saveCHProgress({ datavizCompleted: true });
        showUnlockBadge('🏆 Code Hub Mastered!');
        dvChallengeDiv.innerHTML = `<div style="font-size:13px;color:#86efac;font-weight:700;">✓ Dataviz Challenge Complete — Code Hub mastered!</div>`;
      });
    };
    return;
  }
  body.appendChild(dvChallengeDiv);
}
// ─────────────────────────────────────────────────────────────────────────────


/**
 * GameLevel — Code Hub
 */
class GameLevelCsPath1CodeHub extends GameLevelCsPathIdentity {
  static levelId      = 'code-hub';
  static displayName  = 'Code Hub';

  constructor(gameEnv) {
    super(gameEnv, {
      levelDisplayName: GameLevelCsPath1CodeHub.displayName,
      logPrefix:        'Code Hub',
    });

    let { width, height, path } = this.getLevelDimensions();

    const bg_data = {
      name:     GameLevelCsPath1CodeHub.displayName,
      greeting: 'Welcome to the Code Hub.',
      src:      path + '/images/projects/cs-pathway-game/bg-codehub/tech_hub_rpg_map.png',
    };

    this.primeAssetGate({ backgroundSrc: bg_data.src, playerSrc: path + '/images/projects/cs-pathway-game/player/minimalist.png' });

    this.profileReady.then(async (restored) => {
      const sprite = restored?.profileData?.spriteMeta;
      if (sprite) await this.applyAvatarOptions({ sprite });
      this.finishLoadingWork();
    }).catch(() => this.finishLoadingWork());

    const SCALE = 5;
    const player_data = {
      id:             'Minimalist_Identity',
      greeting:       'I am ready to learn!',
      src:            path + '/images/projects/cs-pathway-game/player/minimalist.png',
      SCALE_FACTOR:   SCALE,
      STEP_FACTOR:    1000,
      ANIMATION_RATE: 50,
      INIT_POSITION:  { x: width * 0.48, y: height * 0.55 },
      pixels:         { height: 1024, width: 1024 },
      orientation:    { rows: 2, columns: 2 },
      down:      { row: 0, start: 0, columns: 1 },
      downRight: { row: 0, start: 0, columns: 1, rotate:  Math.PI / 16 },
      downLeft:  { row: 0, start: 0, columns: 1, rotate: -Math.PI / 16 },
      left:      { row: 1, start: 0, columns: 1, mirror: true },
      right:     { row: 1, start: 0, columns: 1 },
      up:        { row: 0, start: 1, columns: 1 },
      upLeft:    { row: 1, start: 0, columns: 1, mirror: true, rotate:  Math.PI / 16 },
      upRight:   { row: 1, start: 0, columns: 1, rotate: -Math.PI / 16 },
      hitbox:    { widthPercentage: 0.4, heightPercentage: 0.4 },
      keypress:  { up: 87, left: 65, down: 83, right: 68 },
    };

    const npcBase = {
      src:            path + '/images/projects/cs-pathway-game/npc/robotcharacter.png',
      SCALE_FACTOR:   SCALE,
      ANIMATION_RATE: 50,
      pixels:         { width: 1024, height: 1024 },
      orientation:    { rows: 1, columns: 1 },
      down:           { row: 0, start: 0, columns: 1, wiggle: 0.005 },
      up:             { row: 0, start: 1, columns: 1 },
      left:           { row: 1, start: 0, columns: 1 },
      right:          { row: 1, start: 1, columns: 1 },
      hitbox:         { widthPercentage: 0.4, heightPercentage: 0.4 },
      interactDistance: 120,
    };

    const positions = {
      center:   { x: 0.50, y: 0.45 },
      frontend: { x: 0.19, y: 0.28 },
      backend:  { x: 0.82, y: 0.28 },
      dataviz:  { x: 0.82, y: 0.72 },
      exit:     { x: 0.19, y: 0.72 },
    };

    // ── Central Guide ──────────────────────────────────────────────────────
    const npc_guide = {
      ...npcBase,
      id:            'CodeHubGuide',
      greeting:      'Talk to me to unlock the terminals!',
      INIT_POSITION: { x: width * positions.center.x, y: height * positions.center.y },
      interact: function() {
        document.getElementById('code-hub-panel')?.remove();
        const p = getCHProgress();
        if (!p.guideVisited) {
          saveCHProgress({ guideVisited: true });
          removeGuideSign();
          removeLockOverlay('frontend');
          this.dialogueSystem.dialogues = [
            'Hey! Welcome to the Code Hub — I run this place.',
            'Three terminals surround you: Frontend, Backend, and Dataviz.',
            'They were locked — but since you talked to me, the Frontend terminal is now open!',
            'Complete each terminal\'s challenge to unlock the next one.',
            'Frontend (top-left) → Backend (top-right) → Dataviz (bottom-right).',
            'Head to the Frontend terminal and start learning!',
          ];
        } else {
          const unlocked = [
            p.guideVisited    ? '✓ Frontend' : '🔒 Frontend',
            p.frontendCompleted ? '✓ Backend'  : '🔒 Backend',
            p.backendCompleted  ? '✓ Dataviz'  : '🔒 Dataviz',
          ];
          this.dialogueSystem.dialogues = [
            `Progress: ${unlocked.join('  ·  ')}`,
            'Complete each terminal\'s challenge to unlock the next one.',
          ];
        }
        this.dialogueSystem.lastShownIndex = -1;
        this.dialogueSystem.showRandomDialogue('Code Hub Guide');
      },
    };

    // ── Frontend Terminal ──────────────────────────────────────────────────
    const npc_frontend = {
      ...npcBase,
      id:            'FrontendTerminal',
      greeting:      'Frontend — HTML, CSS, Markdown.',
      INIT_POSITION: { x: width * positions.frontend.x, y: height * positions.frontend.y },
      interact: function() {
        document.getElementById('code-hub-panel')?.remove();
        if (!getCHProgress().guideVisited) {
          this.dialogueSystem.dialogues = ['🔒 Terminal locked! Talk to the guide in the center first.'];
          this.dialogueSystem.lastShownIndex = -1;
          this.dialogueSystem.showRandomDialogue('Frontend Terminal');
          return;
        }
        this.dialogueSystem.dialogues = [
          'Frontend is everything the user sees.',
          'HTML gives the page structure — headings, divs, links, images.',
          'CSS styles it — colors, fonts, Flexbox, transitions, gradients.',
          'Markdown converts plain text to HTML — used for blogs and lessons like Big Six.',
          'JavaScript makes it interactive — DOM events, fetch, and logic.',
        ];
        this.dialogueSystem.lastShownIndex = -1;
        this.dialogueSystem.showRandomDialogue('Frontend Terminal');
        this.dialogueSystem.addButtons([
          {
            text:    '⌨ Open Terminal',
            primary: true,
            action:  () => {
              this.dialogueSystem.closeDialogue();
              openFrontendPanel(this.gameEnv.gameControl);
            },
          },
        ]);
      },
    };

    // ── Backend Terminal ───────────────────────────────────────────────────
    const npc_backend = {
      ...npcBase,
      id:            'BackendTerminal',
      greeting:      'Backend — REST APIs, databases, CRUD.',
      INIT_POSITION: { x: width * positions.backend.x, y: height * positions.backend.y },
      interact: function() {
        document.getElementById('code-hub-panel')?.remove();
        if (!getCHProgress().frontendCompleted) {
          this.dialogueSystem.dialogues = ['🔒 Terminal locked! Complete the Frontend challenge first.'];
          this.dialogueSystem.lastShownIndex = -1;
          this.dialogueSystem.showRandomDialogue('Backend Terminal');
          return;
        }
        this.dialogueSystem.dialogues = [
          'The backend is everything the user does NOT see.',
          'REST APIs expose your data through URL endpoints.',
          'GET reads, POST creates, PUT updates, DELETE removes.',
          'SQL databases use fixed tables. NoSQL uses flexible documents.',
          'Flask (Python) is minimal. Spring Boot (Java) is full-featured.',
        ];
        this.dialogueSystem.lastShownIndex = -1;
        this.dialogueSystem.showRandomDialogue('Backend Terminal');
        this.dialogueSystem.addButtons([
          {
            text:    '⌨ Open Terminal',
            primary: true,
            action:  () => {
              this.dialogueSystem.closeDialogue();
              openBackendPanel(this.gameEnv.gameControl);
            },
          },
        ]);
      },
    };

    // ── Dataviz Terminal ───────────────────────────────────────────────────
    const npc_dataviz = {
      ...npcBase,
      id:            'DatavizTerminal',
      greeting:      'Dataviz — filtering, pagination, queries.',
      INIT_POSITION: { x: width * positions.dataviz.x, y: height * positions.dataviz.y },
      interact: function() {
        document.getElementById('code-hub-panel')?.remove();
        if (!getCHProgress().backendCompleted) {
          this.dialogueSystem.dialogues = ['🔒 Terminal locked! Complete the Backend challenge first.'];
          this.dialogueSystem.lastShownIndex = -1;
          this.dialogueSystem.showRandomDialogue('Dataviz Terminal');
          return;
        }
        this.dialogueSystem.dialogues = [
          'Data visualization turns raw data into something humans can read.',
          'Every data API is built on CRUD — Create, Read, Update, Delete.',
          'Filter with query params: /api/companies?industry=Software',
          'Paginate to keep responses fast: /api/companies?page=1&size=4',
          'Spring JPA lets you write: findBySizeGreaterThan(min)',
        ];
        this.dialogueSystem.lastShownIndex = -1;
        this.dialogueSystem.showRandomDialogue('Dataviz Terminal');
        this.dialogueSystem.addButtons([
          {
            text:    '⌨ Open Terminal',
            primary: true,
            action:  () => {
              this.dialogueSystem.closeDialogue();
              openDatavizPanel(this.gameEnv.gameControl);
            },
          },
        ]);
      },
    };

    // ── Exit Portal ────────────────────────────────────────────────────────
    const npc_exit = {
      ...npcBase,
      id:            'ExitPortal',
      greeting:      'Head back to the Wayfinding World.',
      INIT_POSITION: { x: width * positions.exit.x, y: height * positions.exit.y },
      interact: function() {
        document.getElementById('code-hub-panel')?.remove();
        this.dialogueSystem.dialogues = ['Ready to head back to the Wayfinding World?'];
        this.dialogueSystem.lastShownIndex = -1;
        this.dialogueSystem.showRandomDialogue('Exit');
        this.dialogueSystem.addButtons([
          {
            text:    '← Back to Wayfinding',
            primary: true,
            action:  () => {
              this.dialogueSystem.closeDialogue();
              removeAllCHOverlays();
              const gc = this.gameEnv.gameControl;
              gc.levelClasses.splice(gc.currentLevelIndex, 1);
              gc.currentLevelIndex = Math.max(0, gc.currentLevelIndex - 1);
              gc.transitionToLevel();
            },
          },
        ]);
      },
    };

    this.classes = [
      { class: GamEnvBackground, data: bg_data },
      { class: Player,           data: player_data },
      { class: Npc,              data: npc_guide },
      { class: Npc,              data: npc_frontend },
      { class: Npc,              data: npc_backend },
      { class: Npc,              data: npc_dataviz },
      { class: Npc,              data: npc_exit },
    ];

    // ── Restore progress overlays ──────────────────────────────────────────
    queueMicrotask(() => {
      removeAllCHOverlays(); // clear any stale overlays from prior visit
      initCHCanvas(this.gameEnv.canvas);
      const p = getCHProgress();
      if (!p.guideVisited)      showGuideSign();
      if (!p.guideVisited)      showLockOverlay('frontend', positions.frontend.x, positions.frontend.y, 'TALK TO\nGUIDE FIRST');
      if (!p.frontendCompleted) showLockOverlay('backend',  positions.backend.x,  positions.backend.y,  'COMPLETE\nFRONTEND FIRST');
      if (!p.backendCompleted)  showLockOverlay('dataviz',  positions.dataviz.x,  positions.dataviz.y,  'COMPLETE\nBACKEND FIRST');
    });
  }
}

export default GameLevelCsPath1CodeHub;
