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

// ── Space Invaders — question banks (one per terminal) ───────────────────────
const LESSON_QUESTIONS = {
  frontend: [
    { q: 'Which language gives a web page STRUCTURE?',     ans: 'HTML',                     wrong: ['CSS', 'JavaScript', 'Python'] },
    { q: 'CSS stands for…?',                               ans: 'Cascading Style Sheets',    wrong: ['Creative Style System', 'Coded Style Syntax', 'Content Style Script'] },
    { q: 'Which format converts plain text → HTML?',       ans: 'Markdown',                  wrong: ['TypeScript', 'Sass', 'Tailwind'] },
    { q: 'CSS property for flexible row/column layout?',   ans: 'display: flex',             wrong: ['float: left', 'position: fixed', 'display: block'] },
    { q: 'HTML stands for…?',                              ans: 'HyperText Markup Language', wrong: ['High Text Markup Language', 'HyperText Making Language', 'High Transfer Markup Link'] },
  ],
  backend: [
    { q: 'HTTP method that CREATES a new resource?',       ans: 'POST',                      wrong: ['GET', 'PUT', 'DELETE'] },
    { q: 'HTTP method that READS data?',                   ans: 'GET',                       wrong: ['POST', 'PUT', 'PATCH'] },
    { q: 'HTTP method that REMOVES a resource?',           ans: 'DELETE',                    wrong: ['GET', 'REMOVE', 'DROP'] },
    { q: 'ORM stands for…?',                               ans: 'Object Relational Mapping', wrong: ['Open REST Method', 'Output Response Model', 'Object Request Manager'] },
    { q: 'CRUD stands for…?',                              ans: 'Create Read Update Delete', wrong: ['Copy Run Undo Deploy', 'Code Route Use Debug', 'Commit Read Undo Drop'] },
  ],
  dataviz: [
    { q: 'Spring annotation for a REST controller?',       ans: '@RestController',                wrong: ['@Service', '@Component', '@Repository'] },
    { q: 'JPA annotation that marks the primary key?',     ans: '@Id',                            wrong: ['@Primary', '@Key', '@PrimaryKey'] },
    { q: 'JPQL stands for…?',                              ans: 'Java Persistence Query Language', wrong: ['Java Primary Query Layer', 'Java Package Query Logic', 'Java Persistence Quick Layer'] },
    { q: 'Query param to paginate API results?',           ans: 'page=1&size=4',                  wrong: ['limit=4&offset=1', 'results=4&index=1', 'count=4&start=1'] },
    { q: 'Spring JPA method to filter by minimum size?',   ans: 'findBySizeGreaterThan',           wrong: ['findWhereSize', 'querySizeAbove', 'getSizeMore'] },
  ],
};

// ── Space Invaders game panel ─────────────────────────────────────────────────
// Scoring:  shoot WRONG → +pts (combo scales)  |  shoot CORRECT → −50 pts
//           WRONG passes bottom → −75 pts, −1 life  |  CORRECT passes → +50 pts
//           5 lives · score can go negative · hi-score per lesson in localStorage
function openSpaceInvadersGame(lessonKey, accentColor, gameControl) {
  const label = { frontend: 'Frontend', backend: 'Backend', dataviz: 'Dataviz' }[lessonKey];
  const body  = createPanel(`🎮 ${label} — Space Invaders`, accentColor, gameControl);

  /* expand panel for the larger play area */
  const panelEl = document.getElementById('code-hub-panel');
  Object.assign(panelEl.style, { width: 'min(940px, 94vw)', maxHeight: '93vh', top: '2%' });

  const CW = 880, CH = 580;
  const questions = LESSON_QUESTIONS[lessonKey];
  const HI_KEY    = `si-hi-${lessonKey}`;

  body.innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:center;
                margin-bottom:8px;font-size:12px;">
      <span style="color:#64748b;font-size:11px;">
        Shoot <span style="color:#f87171;font-weight:700;">WRONG</span> ·
        Let <span style="color:#86efac;font-weight:700;">CORRECT</span> pass
      </span>
      <div style="display:flex;gap:12px;font-size:13px;font-weight:700;align-items:center;">
        <span id="si-lives"></span>
        <span style="color:${accentColor};">Score: <span id="si-score">0</span></span>
        <span style="color:#fbbf24;">Best: <span id="si-hi">${parseInt(localStorage.getItem(HI_KEY)) || 0}</span></span>
        <button id="si-fullscreen"
          style="background:rgba(255,255,255,0.07);border:1px solid rgba(255,255,255,0.15);
                 border-radius:6px;color:#94a3b8;padding:4px 10px;font-size:11px;cursor:pointer;
                 font-weight:600;">⛶ Fullscreen</button>
      </div>
    </div>
    <canvas id="si-canvas" width="${CW}" height="${CH}"
      style="display:block;width:100%;border-radius:10px;background:#060d1a;
             border:1px solid ${accentColor}33;cursor:default;"></canvas>
    <div style="display:flex;justify-content:space-between;align-items:center;
                margin-top:8px;font-size:11px;color:#475569;">
      <span>← → / A D  move  ·  SPACE  shoot</span>
      <button id="si-restart"
        style="background:${accentColor}22;border:1px solid ${accentColor}55;border-radius:6px;
               color:${accentColor};padding:4px 14px;font-size:11px;font-weight:700;cursor:pointer;">
        ↺ Restart</button>
    </div>`;

  const canvas = document.getElementById('si-canvas');
  const ctx    = canvas.getContext('2d');

  /* ── state ── */
  let lives = 5, score = 0, hi = parseInt(localStorage.getItem(HI_KEY)) || 0;
  let qIdx  = 0, combo = 0;
  let enemies = [], bullets = [], particles = [], floaters = [];
  let player  = { x: CW / 2, speed: 320, thruster: 0 };
  const PY    = CH - 34;
  let keys    = {}, lastShot = 0;
  let gameState  = 'intro';
  let waveBanner = { text: '', alpha: 0, timer: 0 };
  let shake      = { x: 0, y: 0, timer: 0 };
  let toast      = { text: '', color: '#fff', alpha: 0 };

  /* ── helpers ── */
  const shuffled = arr => {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };

  const updateHUD = () => {
    document.getElementById('si-lives').textContent =
      '❤️'.repeat(Math.max(0, lives)) + '🖤'.repeat(Math.max(0, 5 - lives));
    document.getElementById('si-score').textContent = score;
    document.getElementById('si-hi').textContent    = hi;
  };

  const showToast = (text, color) => { toast = { text, color, alpha: 1 }; };

  const spawnParticles = (x, y, color, n = 14, burst = false) => {
    for (let i = 0; i < n; i++) {
      const angle = burst ? (Math.PI * 2 * i / n) : Math.random() * Math.PI * 2;
      const spd   = burst ? (80 + Math.random() * 160) : (60 + Math.random() * 200);
      particles.push({
        x, y, vx: Math.cos(angle) * spd, vy: Math.sin(angle) * spd,
        life: 0.7, maxLife: 0.7, size: burst ? (3 + Math.random() * 5) : (2 + Math.random() * 4), color,
      });
    }
  };

  const addFloater = (x, y, text, color) =>
    floaters.push({ x, y: y - 10, text, color, life: 1.2, maxLife: 1.2, vy: -48 });

  const doShake = (i = 6) => { shake = { x: 0, y: 0, timer: i * 0.016 }; };

  const spawnWave = () => {
    const q    = questions[qIdx];
    const opts = shuffled([{ text: q.ans, correct: true }, ...q.wrong.map(w => ({ text: w, correct: false }))]);
    const colW = CW / 4;
    enemies = opts.map((opt, i) => ({
      x: colW * i + colW / 2, y: -70 - i * 28,
      w: colW - 18, h: 52,
      text: opt.text, correct: opt.correct,
      vy: 52 + qIdx * 8,
      alive: true, passed: false,
      phase: Math.random() * Math.PI * 2,
    }));
  };

  const startNextWave = () => {
    gameState  = 'wave-banner';
    waveBanner = { text: `WAVE ${qIdx + 1}`, alpha: 1, timer: 1.2 };
  };

  /* ── input ── */
  const onKeyDown = e => {
    keys[e.code] = true;
    if (['Space','ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(e.code)) e.preventDefault();
    e.stopPropagation();
    if (e.code === 'Space' && gameState === 'intro') { gameState = 'playing'; spawnWave(); }
  };
  const onKeyUp = e => { keys[e.code] = false; e.stopPropagation(); };
  window.addEventListener('keydown', onKeyDown);
  window.addEventListener('keyup',   onKeyUp);

  /* ── fullscreen toggle (CSS-based, keeps HUD visible) ── */
  let isFullscreen = false;
  document.getElementById('si-fullscreen').onclick = () => {
    isFullscreen = !isFullscreen;
    if (isFullscreen) {
      Object.assign(panelEl.style, {
        position: 'fixed', top: '0', left: '0', right: '0', bottom: '0',
        width: '100vw', maxHeight: '100vh', borderRadius: '0',
        transform: 'none', zIndex: '99999',
      });
      document.getElementById('si-fullscreen').textContent = '⛶ Exit';
    } else {
      Object.assign(panelEl.style, {
        position: 'fixed', top: '2%', left: '50%', right: '', bottom: '',
        width: 'min(940px,94vw)', maxHeight: '93vh',
        borderRadius: '12px', transform: 'translateX(-50%)', zIndex: '9998',
      });
      document.getElementById('si-fullscreen').textContent = '⛶ Fullscreen';
    }
  };

  /* ── game loop ── */
  let raf, lastTs = 0;

  const loop = ts => {
    if (!document.getElementById('si-canvas')) {
      cancelAnimationFrame(raf);
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup',   onKeyUp);
      return;
    }
    raf = requestAnimationFrame(loop);
    const dt = Math.min((ts - lastTs) / 1000, 0.05);
    lastTs = ts;

    /* wave banner countdown */
    if (gameState === 'wave-banner') {
      waveBanner.timer -= dt;
      waveBanner.alpha  = Math.min(1, waveBanner.timer * 2.5);
      if (waveBanner.timer <= 0) { gameState = 'playing'; spawnWave(); }
    }

    if (gameState === 'playing') {
      /* player movement */
      const moving = keys['ArrowLeft'] || keys['KeyA'] || keys['ArrowRight'] || keys['KeyD'];
      player.thruster = moving
        ? Math.min(1, player.thruster + dt * 5)
        : Math.max(0, player.thruster - dt * 7);

      if (keys['ArrowLeft']  || keys['KeyA']) player.x = Math.max(26,      player.x - player.speed * dt);
      if (keys['ArrowRight'] || keys['KeyD']) player.x = Math.min(CW - 26, player.x + player.speed * dt);

      /* shoot */
      if (keys['Space'] && ts - lastShot > 240) {
        lastShot = ts;
        bullets.push({ x: player.x, y: PY - 20, trail: [] });
      }

      /* move bullets */
      bullets.forEach(b => {
        b.trail.unshift({ x: b.x, y: b.y });
        if (b.trail.length > 7) b.trail.pop();
        b.y -= 600 * dt;
      });
      bullets = bullets.filter(b => b.y > -12);

      /* enemies */
      enemies.forEach(e => {
        if (!e.alive || e.passed) return;
        e.y    += e.vy * dt;
        e.phase += dt * 2.2;

        /* bullet collision */
        for (let i = bullets.length - 1; i >= 0; i--) {
          const b = bullets[i];
          if (b.x >= e.x - e.w / 2 && b.x <= e.x + e.w / 2 &&
              b.y >= e.y && b.y <= e.y + e.h) {
            bullets.splice(i, 1);
            e.alive = false;

            if (e.correct) {
              /* shot the right answer — lose points */
              const pen = 50;
              score -= pen; combo = 0;
              showToast('❌ That was correct! −50 pts', '#f87171');
              spawnParticles(e.x, e.y + 26, '#f87171', 16, true);
              addFloater(e.x, e.y + 10, `−${pen}`, '#f87171');
              doShake(5);
            } else {
              /* shot a wrong answer — gain points with combo */
              const mult = 1 + Math.floor(combo / 3) * 0.5;
              const pts  = Math.round((100 + qIdx * 12) * mult);
              score += pts; combo++;
              if (score > hi) { hi = score; localStorage.setItem(HI_KEY, hi); }
              const tag = combo >= 3 ? ` 🔥×${combo}` : '';
              showToast(`✓ +${pts}${tag}`, '#86efac');
              spawnParticles(e.x, e.y + 26, '#86efac', 16, true);
              addFloater(e.x, e.y + 10, `+${pts}`, '#86efac');
            }
            updateHUD();
            break;
          }
        }

        /* enemy exits bottom */
        if (e.y > CH + 30) {
          e.passed = true;
          if (!e.correct) {
            /* wrong answer got through — lose points AND a life */
            const pen = 75;
            score -= pen; combo = 0; lives = Math.max(0, lives - 1);
            showToast('💥 Missed wrong answer! −75 pts −1 ❤️', '#f87171');
            spawnParticles(player.x, PY, '#f87171', 12);
            addFloater(player.x, PY - 24, `−${pen}`, '#f87171');
            doShake(8);
          } else {
            /* correct answer passed through — gain points */
            const pts = 50;
            score += pts;
            if (score > hi) { hi = score; localStorage.setItem(HI_KEY, hi); }
            showToast('✓ Correct passed! +50 pts', '#86efac');
            addFloater(CW / 2, CH - 70, '+50', '#86efac');
          }
          updateHUD();
          if (lives <= 0) gameState = 'lose';
        }
      });

      /* wave complete */
      if (enemies.length > 0 && enemies.every(e => !e.alive || e.passed)) {
        qIdx++;
        if (qIdx >= questions.length) gameState = 'win';
        else startNextWave();
      }
    }

    /* shake decay */
    if (shake.timer > 0) {
      shake.timer -= dt;
      const s = shake.timer * 28;
      shake.x = (Math.random() - 0.5) * s;
      shake.y = (Math.random() - 0.5) * s;
    } else { shake.x = 0; shake.y = 0; }

    /* particles */
    particles.forEach(p => { p.x += p.vx * dt; p.y += p.vy * dt; p.life -= dt; p.vy += 50 * dt; });
    particles = particles.filter(p => p.life > 0);

    /* floaters */
    floaters.forEach(f => { f.y += f.vy * dt; f.life -= dt; });
    floaters = floaters.filter(f => f.life > 0);

    /* toast fade */
    if (toast.alpha > 0) toast.alpha = Math.max(0, toast.alpha - dt * 0.85);

    draw();
  };

  /* ── draw ── */
  const draw = () => {
    const t = Date.now();
    ctx.save();
    ctx.translate(shake.x, shake.y);

    /* background */
    ctx.fillStyle = '#060d1a';
    ctx.fillRect(-4, -4, CW + 8, CH + 8);

    /* nebula blobs */
    [
      { cx: CW * 0.15, cy: CH * 0.25, r: 180, col: accentColor + '0a' },
      { cx: CW * 0.82, cy: CH * 0.65, r: 220, col: '#7c3aed0a' },
      { cx: CW * 0.5,  cy: CH * 0.08, r: 140, col: accentColor + '07' },
    ].forEach(nb => {
      const g = ctx.createRadialGradient(nb.cx, nb.cy, 0, nb.cx, nb.cy, nb.r);
      g.addColorStop(0, nb.col); g.addColorStop(1, 'transparent');
      ctx.fillStyle = g; ctx.fillRect(0, 0, CW, CH);
    });

    /* two-layer parallax stars */
    for (let i = 0; i < 110; i++) {
      const near = i < 35;
      const sx   = (i * 137.5 + 11) % CW;
      const sy   = ((i * 97.3 + t * (near ? 0.018 : 0.007)) % CH + CH) % CH;
      ctx.globalAlpha = near ? 0.65 : 0.28;
      ctx.fillStyle   = near ? '#ffffff' : accentColor;
      ctx.beginPath();
      ctx.arc(sx, sy, near ? 1.3 : 0.8, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;

    /* ── intro screen ── */
    if (gameState === 'intro') {
      drawIntro(t);
      ctx.restore();
      return;
    }

    /* danger zone glow near bottom */
    if (enemies.some(e => e.alive && !e.passed && e.y > CH * 0.55)) {
      const dg = ctx.createLinearGradient(0, CH - 100, 0, CH);
      dg.addColorStop(0, 'transparent');
      dg.addColorStop(1, 'rgba(239,68,68,0.14)');
      ctx.fillStyle = dg; ctx.fillRect(0, CH - 100, CW, 100);
    }

    /* question banner pill */
    if (qIdx < questions.length) {
      const q = questions[qIdx];
      ctx.save();
      ctx.font = 'bold 13px system-ui, sans-serif';
      const qw = Math.min(CW - 32, ctx.measureText(q.q).width + 140);
      ctx.fillStyle   = 'rgba(8,15,38,0.88)';
      ctx.strokeStyle = accentColor + '55'; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.roundRect((CW - qw) / 2, 7, qw, 28, 14); ctx.fill(); ctx.stroke();
      ctx.fillStyle = accentColor; ctx.textAlign = 'center';
      ctx.fillText(`Q${qIdx + 1}/${questions.length}: ${q.q}`, CW / 2, 26);
      ctx.restore();
    }

    /* ground line with gradient ends */
    const gl = ctx.createLinearGradient(0, 0, CW, 0);
    gl.addColorStop(0,   'transparent');
    gl.addColorStop(0.2, accentColor + '66');
    gl.addColorStop(0.8, accentColor + '66');
    gl.addColorStop(1,   'transparent');
    ctx.strokeStyle = gl; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(0, PY + 12); ctx.lineTo(CW, PY + 12); ctx.stroke();

    /* player thruster flame */
    if (player.thruster > 0.05) {
      const fl  = (10 + Math.sin(t / 45) * 5) * player.thruster;
      const tfg = ctx.createLinearGradient(player.x, PY + 10, player.x, PY + 10 + fl);
      tfg.addColorStop(0, accentColor + 'dd');
      tfg.addColorStop(1, 'transparent');
      ctx.fillStyle = tfg;
      ctx.beginPath();
      ctx.moveTo(player.x - 6, PY + 10);
      ctx.lineTo(player.x + 6, PY + 10);
      ctx.lineTo(player.x, PY + 10 + fl);
      ctx.closePath(); ctx.fill();
    }

    /* player ship */
    ctx.save();
    ctx.shadowColor = accentColor; ctx.shadowBlur = 20;
    ctx.fillStyle   = accentColor;
    ctx.beginPath();
    ctx.moveTo(player.x,      PY - 20);
    ctx.lineTo(player.x - 24, PY + 10);
    ctx.lineTo(player.x - 10, PY + 3);
    ctx.lineTo(player.x,      PY + 9);
    ctx.lineTo(player.x + 10, PY + 3);
    ctx.lineTo(player.x + 24, PY + 10);
    ctx.closePath(); ctx.fill();
    ctx.shadowBlur = 0;
    /* cockpit highlight */
    ctx.fillStyle = 'rgba(255,255,255,0.22)';
    ctx.beginPath(); ctx.ellipse(player.x, PY - 7, 5, 8, 0, 0, Math.PI * 2); ctx.fill();
    ctx.restore();

    /* bullets with trails */
    ctx.save();
    bullets.forEach(b => {
      b.trail.forEach((pt, i) => {
        ctx.globalAlpha = (1 - i / b.trail.length) * 0.55;
        ctx.fillStyle   = accentColor;
        ctx.fillRect(pt.x - 2, pt.y, 4, 9);
      });
      ctx.globalAlpha = 1;
      ctx.fillStyle   = '#ffffff';
      ctx.shadowColor = accentColor; ctx.shadowBlur = 12;
      ctx.fillRect(b.x - 2, b.y - 14, 4, 14);
      ctx.shadowBlur = 0;
    });
    ctx.restore();

    /* enemies */
    enemies.forEach(e => {
      if (!e.alive || e.passed) return;
      ctx.save();

      const dangerPct = Math.max(0, Math.min(1, (e.y - CH * 0.45) / (CH * 0.45)));
      const glowSz    = 5 + dangerPct * 14 + Math.sin(e.phase) * 3;
      ctx.shadowColor = dangerPct > 0.6 ? '#ef4444' : accentColor;
      ctx.shadowBlur  = glowSz;

      /* body */
      ctx.fillStyle   = 'rgba(12,20,44,0.96)';
      ctx.strokeStyle = dangerPct > 0.6
        ? `rgba(239,68,68,${0.5 + dangerPct * 0.45})`
        : accentColor + '88';
      ctx.lineWidth   = 1.5;
      ctx.beginPath(); ctx.roundRect(e.x - e.w / 2, e.y, e.w, e.h, 9);
      ctx.fill(); ctx.stroke();
      ctx.shadowBlur = 0;

      /* robot head */
      const eyeColor = dangerPct > 0.6 ? '#ef4444' : accentColor;
      const fx = e.x, fy = e.y + 6;
      ctx.fillStyle = eyeColor + 'cc'; ctx.fillRect(fx - 9, fy, 18, 14);
      ctx.fillStyle = '#060d1a';
      ctx.fillRect(fx - 7, fy + 3, 5, 5);
      ctx.fillRect(fx + 2,  fy + 3, 5, 5);
      /* blinking danger eyes */
      if (dangerPct > 0.6 && Math.sin(t / 100) > 0.2) {
        ctx.fillStyle = '#ef4444';
        ctx.fillRect(fx - 7, fy + 3, 5, 5); ctx.fillRect(fx + 2, fy + 3, 5, 5);
      }
      ctx.fillStyle = eyeColor + '88'; ctx.fillRect(fx - 5, fy + 10, 10, 2);

      /* antenna */
      ctx.strokeStyle = eyeColor + 'aa'; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(fx, fy); ctx.lineTo(fx, fy - 5); ctx.stroke();
      ctx.beginPath(); ctx.arc(fx, fy - 7, 2, 0, Math.PI * 2);
      ctx.fillStyle = eyeColor; ctx.fill();

      /* answer label */
      const fs = Math.min(11.5, Math.floor(e.w / 8));
      ctx.font  = `bold ${fs}px system-ui, sans-serif`;
      ctx.fillStyle    = dangerPct > 0.6 ? '#fca5a5' : '#e2e8f0';
      ctx.textAlign    = 'center';
      ctx.textBaseline = 'bottom';
      let txt = e.text;
      while (ctx.measureText(txt).width > e.w - 14 && txt.length > 4) txt = txt.slice(0, -2) + '…';
      ctx.fillText(txt, e.x, e.y + e.h - 4);

      ctx.restore();
    });

    /* particles */
    ctx.save();
    particles.forEach(p => {
      ctx.globalAlpha = Math.max(0, p.life / p.maxLife);
      ctx.fillStyle   = p.color;
      ctx.beginPath(); ctx.arc(p.x, p.y, Math.max(0.1, p.size * (p.life / p.maxLife)), 0, Math.PI * 2); ctx.fill();
    });
    ctx.globalAlpha = 1; ctx.restore();

    /* floating score text */
    ctx.save();
    floaters.forEach(f => {
      ctx.globalAlpha = Math.min(1, f.life / f.maxLife * 1.8);
      ctx.font        = 'bold 15px system-ui, sans-serif';
      ctx.textAlign   = 'center';
      ctx.fillStyle   = f.color;
      ctx.shadowColor = f.color; ctx.shadowBlur = 8;
      ctx.fillText(f.text, f.x, f.y);
      ctx.shadowBlur = 0;
    });
    ctx.globalAlpha = 1; ctx.restore();

    /* combo display */
    if (combo >= 3) {
      ctx.save();
      ctx.font      = `bold ${Math.min(18, 12 + combo)}px system-ui`;
      ctx.fillStyle = '#fbbf24';
      ctx.textAlign = 'right';
      ctx.shadowColor = '#fbbf24'; ctx.shadowBlur = 10;
      ctx.fillText(`🔥 COMBO ×${combo}`, CW - 12, 26);
      ctx.shadowBlur = 0; ctx.restore();
    }

    /* toast */
    if (toast.alpha > 0) {
      ctx.save();
      ctx.globalAlpha = toast.alpha;
      ctx.font        = 'bold 15px system-ui, sans-serif';
      ctx.textAlign   = 'center';
      ctx.fillStyle   = toast.color;
      ctx.shadowColor = toast.color; ctx.shadowBlur = 12;
      ctx.fillText(toast.text, CW / 2, CH * 0.43);
      ctx.shadowBlur = 0; ctx.restore();
    }

    /* wave-banner overlay */
    if (gameState === 'wave-banner' && waveBanner.alpha > 0) {
      ctx.save();
      ctx.globalAlpha = waveBanner.alpha;
      ctx.textAlign   = 'center';
      ctx.fillStyle   = accentColor;
      ctx.font        = 'bold 46px system-ui';
      ctx.shadowColor = accentColor; ctx.shadowBlur = 34;
      ctx.fillText(waveBanner.text, CW / 2, CH / 2 - 10);
      ctx.shadowBlur  = 0;
      ctx.font        = '15px system-ui'; ctx.fillStyle = '#94a3b8';
      ctx.fillText(`Score: ${score}   Lives: ${'❤️'.repeat(lives)}`, CW / 2, CH / 2 + 30);
      ctx.restore();
    }

    /* end screen */
    if (gameState === 'win' || gameState === 'lose') {
      ctx.save();
      ctx.fillStyle = 'rgba(3,6,18,0.92)'; ctx.fillRect(0, 0, CW, CH);
      const ec = gameState === 'win' ? '#86efac' : '#f87171';
      const eg = ctx.createRadialGradient(CW / 2, CH / 2, 10, CW / 2, CH / 2, 200);
      eg.addColorStop(0, ec + '28'); eg.addColorStop(1, 'transparent');
      ctx.fillStyle = eg; ctx.fillRect(0, 0, CW, CH);
      ctx.textAlign   = 'center';
      ctx.fillStyle   = ec; ctx.shadowColor = ec; ctx.shadowBlur = 30;
      ctx.font = 'bold 46px system-ui';
      ctx.fillText(gameState === 'win' ? '🏆 VICTORY!' : '💀 GAME OVER', CW / 2, CH / 2 - 55);
      ctx.shadowBlur = 0;
      ctx.font = '17px system-ui'; ctx.fillStyle = '#94a3b8';
      ctx.fillText(`Final Score: ${score}   ·   Best: ${hi}`, CW / 2, CH / 2);
      ctx.font = '13px system-ui'; ctx.fillStyle = '#475569';
      ctx.fillText('Press ↺ Restart or close', CW / 2, CH / 2 + 40);
      ctx.restore();
    }

    ctx.restore(); /* end shake */
  };

  /* ── intro screen drawn on canvas ── */
  const drawIntro = t => {
    ctx.textAlign = 'center';

    /* title */
    ctx.fillStyle = accentColor; ctx.shadowColor = accentColor; ctx.shadowBlur = 24;
    ctx.font = 'bold 38px system-ui, sans-serif';
    ctx.fillText(`⚡ ${label.toUpperCase()} INVADERS`, CW / 2, 72);
    ctx.shadowBlur = 0;
    ctx.font = '14px system-ui'; ctx.fillStyle = '#475569';
    ctx.fillText('Knowledge-based Space Shooter', CW / 2, 100);

    /* rule cards */
    const rules = [
      { icon: '🎯', line1: 'Shoot WRONG answers',    line2: '+100 pts (scales + combo)', col: '#86efac' },
      { icon: '✓',        line1: 'Let CORRECT pass',       line2: '+50 pts bonus',             col: '#86efac' },
      { icon: '❌',        line1: 'Shoot CORRECT answer',   line2: '−50 pts penalty',      col: '#f87171' },
      { icon: '💥', line1: 'Miss WRONG answer',      line2: '−75 pts + −1 ❤', col: '#f87171' },
    ];
    const cw2 = 182, ch2 = 80, gap2 = 12;
    const rx0  = CW / 2 - (rules.length * (cw2 + gap2) - gap2) / 2;

    rules.forEach((r, i) => {
      const rx = rx0 + i * (cw2 + gap2), ry = 126;
      ctx.fillStyle   = r.col + '14';
      ctx.strokeStyle = r.col + '55'; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.roundRect(rx, ry, cw2, ch2, 10); ctx.fill(); ctx.stroke();

      ctx.font = '22px serif'; ctx.fillStyle = '#fff';
      ctx.fillText(r.icon, rx + cw2 / 2, ry + 26);

      ctx.font = 'bold 11px system-ui'; ctx.fillStyle = r.col;
      ctx.fillText(r.line1, rx + cw2 / 2, ry + 46);

      ctx.font = '10px system-ui'; ctx.fillStyle = '#64748b';
      ctx.fillText(r.line2, rx + cw2 / 2, ry + 62);
    });

    /* controls box */
    const bx = CW / 2 - 250, by = 232, bw = 500, bh = 80;
    ctx.fillStyle   = 'rgba(10,18,40,0.75)';
    ctx.strokeStyle = 'rgba(255,255,255,0.08)'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.roundRect(bx, by, bw, bh, 10); ctx.fill(); ctx.stroke();

    ctx.font = 'bold 11px system-ui'; ctx.fillStyle = '#64748b';
    ctx.fillText('CONTROLS', CW / 2, by + 17);

    [
      { label: '← → or A D', desc: 'Move ship', ox: -118 },
      { label: 'SPACE',                desc: 'Shoot',     ox:  118 },
    ].forEach(c => {
      const kx = CW / 2 + c.ox;
      ctx.fillStyle   = accentColor + '22';
      ctx.strokeStyle = accentColor + '55'; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.roundRect(kx - 80, by + 28, 160, 36, 7); ctx.fill(); ctx.stroke();
      ctx.font = 'bold 12px system-ui'; ctx.fillStyle = '#e2e8f0';
      ctx.fillText(c.label, kx, by + 43);
      ctx.font = '10px system-ui'; ctx.fillStyle = '#64748b';
      ctx.fillText(c.desc, kx, by + 57);
    });

    /* extra info */
    ctx.font = '12px system-ui'; ctx.fillStyle = '#f87171';
    ctx.fillText('You start with 5 ❤️  —  lose one each time a WRONG answer reaches you', CW / 2, by + 100);
    ctx.fillStyle = '#475569';
    ctx.fillText(`${questions.length} waves · enemies speed up each wave · chain kills for a combo bonus`, CW / 2, by + 118);

    /* blinking start prompt */
    if (Math.sin(t / 380) > 0) {
      ctx.fillStyle   = accentColor; ctx.shadowColor = accentColor; ctx.shadowBlur = 16;
      ctx.font        = 'bold 17px system-ui';
      ctx.fillText('▶  PRESS SPACE OR CLICK TO START', CW / 2, by + 148);
      ctx.shadowBlur = 0;
    }
  };

  /* ── init ── */
  updateHUD();
  raf = requestAnimationFrame(loop);

  /* canvas click starts game from intro */
  canvas.addEventListener('click', () => {
    if (gameState === 'intro') { gameState = 'playing'; spawnWave(); }
  });

  /* restart */
  document.getElementById('si-restart').onclick = () => {
    lives = 5; score = 0; qIdx = 0; combo = 0;
    enemies = []; bullets = []; particles = []; floaters = [];
    player.x = CW / 2; player.thruster = 0;
    gameState  = 'intro';
    toast      = { text: '', color: '#fff', alpha: 0 };
    shake      = { x: 0, y: 0, timer: 0 };
    waveBanner = { text: '', alpha: 0, timer: 0 };
    updateHUD();
  };

  /* clean up on close */
  const closeBtn = document.getElementById('panel-close');
  closeBtn.onclick = () => {
    cancelAnimationFrame(raf);
    window.removeEventListener('keydown', onKeyDown);
    window.removeEventListener('keyup',   onKeyUp);
    panelEl.remove();
    gameControl?.resume?.();
  };
}
// ─────────────────────────────────────────────────────────────────────────────────


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
      src:      path + '/images/projects/cs-pathway/bg-codehub/tech_hub_rpg_map.png',
    };

    this.primeAssetGate({ backgroundSrc: bg_data.src, playerSrc: path + '/images/projects/cs-pathway/player/minimalist.png' });

    this.profileReady.then(async (restored) => {
      const sprite = restored?.profileData?.spriteMeta;
      if (sprite) await this.applyAvatarOptions({ sprite });
      this.finishLoadingWork();
    }).catch(() => this.finishLoadingWork());

    const SCALE = 5;
    const player_data = {
      id:             'Minimalist_Identity',
      greeting:       'I am ready to learn!',
      src:            path + '/images/projects/cs-pathway/player/minimalist.png',
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
      src:            path + '/images/projects/cs-pathway/npc/robotcharacter.png',
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
          {
            text:    '🎮 Play Game',
            primary: false,
            action:  () => {
              this.dialogueSystem.closeDialogue();
              openSpaceInvadersGame('frontend', '#4caef0', this.gameEnv.gameControl);
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
          {
            text:    '🎮 Play Game',
            primary: false,
            action:  () => {
              this.dialogueSystem.closeDialogue();
              openSpaceInvadersGame('backend', '#86efac', this.gameEnv.gameControl);
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
          {
            text:    '🎮 Play Game',
            primary: false,
            action:  () => {
              this.dialogueSystem.closeDialogue();
              openSpaceInvadersGame('dataviz', '#c084fc', this.gameEnv.gameControl);
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
