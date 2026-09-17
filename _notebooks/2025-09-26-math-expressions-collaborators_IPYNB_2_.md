---
layout: post
courses: {'csp': {'week': 1}}
categories: ['Python', 'Mathematical-Expressions']
lesson_language: Python
lesson_topic: Mathematical-Expressions
lesson_part: reference
lesson_type: lesson
title: 3.3 Math Expressions
permalink: /csp/big-idea-3/p3/math-expressions/lesson
Authors: Nitya R, Brandon C, Alice L
---

<div id="csp-lessons" class="ui-root">
<!-- LESSON 3.3: ALGORITHMS & EXPRESSIONS -->
<section id="l3x" class="lesson">
  <header class="hero">
    <div class="hero-inner">
      <h1>3.3 — Math Expressions</h1>
      <p class="sub">Sequencing, Selection, Iteration, and Arithmetic Operations.</p>
    </div>
  </header>

  <aside class="toc" aria-label="Section navigation">
    <nav>
      <ol>
        <li><a href="#l3x-obj">Learning Objectives</a></li>
        <li><a href="#l3x-algo">What is an Algorithm?</a></li>
        <li><a href="#l3x-ex">Example Algorithms</a></li>
        <li><a href="#l3x-hack">💡 Hack 1</a></li>
        <li><a href="#l3x-code">Code Statements & Expressions</a></li>
        <li><a href="#l3x-hack2">💡 Hack 2</a></li>
        <li><a href="#l3x-ops">Arithmetic Operators & Order of Operations</a></li>
        <li><a href="#l3x-hack3">💡 Hack 3</a></li>
      </ol>
    </nav>
  </aside>

  <main class="content">
    <article id="l3x-obj" class="card">
      <h2>Learning Objectives</h2>
      <ul>
        <li>Express an algorithm that uses <strong>sequencing</strong> without a programming language.</li>
        <li>Represent a step-by-step algorithmic process using <strong>sequential code statements</strong>.</li>
        <li>Evaluate expressions that use <strong>arithmetic operators</strong>.</li>
      </ul>
    </article>

    <article id="l3x-algo" class="card">
      <h2>What is an Algorithm?</h2>
      <p>An <strong>algorithm</strong> is a finite set of instructions that accomplish a specific task.</p>
      <p>Key concepts:</p>
      <ul>
        <li><strong>Sequencing:</strong> first step → second step → third step</li>
        <li><strong>Selection:</strong> decision-making (yes/no) → different steps depending on outcome</li>
        <li><strong>Iteration:</strong> repeat steps until a condition is met</li>
      </ul>
    </article>



    <article id="l3x-ex" class="card">
      <h2>Example Algorithm: Count Even Numbers in a List</h2>
      <ol>
        <li>Set <code>count ← 0</code></li>
        <li>Get next number from the user</li>
        <li>check if its even, if yes then count ← count + 1</li>
        <li>If more numbers in list, go back to Step 2</li>
        <li>Display <code>count</code></li>
      </ol>
      <p><strong>Sequencing:</strong> Steps 1 → 2 → 3 → 4 → 5</p>
      <p><strong>Selection:</strong> Step 3 (even or odd decision)</p>
      <p><strong>Iteration:</strong> Step 4 (loop until list exhausted)</p>
    </article>

    <article id="l3x-hack" class="card">
      <h2>💡 Hack 1: Identify Sequencing, Selection, and Iteration</h2>
      <p>Analyze the following algorithm and identify which parts demonstrate <strong>sequencing</strong>, <strong>selection</strong>, and <strong>iteration</strong>:</p>
    <ol>
      <li>Set <code>item</code> to the number to search for</li>
      <li>Get next number in the list</li>
      <li>If number = <code>item</code>, display “item found”</li>
      <li>If there are more numbers in the list, go back to Step 2</li>
      <li>Display “item not found”</li>
    </ol>
    </article>

    <article id="l3x-code" class="card">
      <h2>Code Statements & Expressions</h2>
      <p>Store values in variables and compute results:</p>
      <pre><code>Grade ← 82
highScore ← currentScore
Name ← firstName + lastName
Average ← calcAverage(10, 20, 30)</code></pre>
    </article>

    <article id="l3x-hack2" class="card">
      <h2>Hack 2: Predict the Output</h2>
      <p>Identify what is displayed after running the following code segment:</p>
      <pre><code>num1 ← 2
num2 ← 4
num3 ← 5
num1 ← num2 + num3
num3 ← num1 + 5
num2 ← (num1 + num3) / 5
DISPLAY(num1)
DISPLAY(num2)
DISPLAY(num3)</code></pre>

      <p><strong>Hints / Thought Process:</strong></p>
    <ul>
    <li>Step 1: Track how <code>num1</code>, <code>num2</code>, and <code>num3</code> change at each line.</li>
    <li>Step 2: Apply arithmetic operations carefully and in order.</li>
    <li>Step 3: Remember that assignment updates the variable immediately.</li>
    </ul>
    </article>

    <article id="l3x-ops" class="card">
      <h2>Arithmetic Operators & Order of Operations</h2>
      <div class="grid">
        <div class="snippet">
          <pre><code>+  addition (a + b, grade + 10)
-  subtraction (a - b, 100 - pointsDeducted)
*  multiplication (a * b, base * height)
/  division  (a / b, sum / 28)
MOD  modulus (remainder) (a MOD b, 17 MOD 2)</code></pre>
          <p>note: Python MOD is <code>%</code></p>
        </div>
      </div>
    </article>

    <article id="l3x-hack3" class="card">
  <h2>Hack 3: Practice</h2>
  <p>Predict the value of <code>result</code> after executing the code:</p>
  <pre><code>num1 ← 40
num2 ← num1 / 2
num3 ← 5 * num2 + 3
result ← num2 MOD 3 * num1 + 4 - num3 / 2
DISPLAY(result)</code></pre>
    </article>

  </main>
</section>


<!-- Floating back-to-top button -->
  <button class="to-top" aria-label="Back to top" title="Back to top">↑</button>
</div>

<style>
/* ---------- DARK LOCK (prevents any light fallback) ---------- */
:root{
  /* Tell the UA we are dark-only for native widgets, form controls, etc. */
  color-scheme: dark;
}
html, body{
  background:#0b0c0f !important;
  color:#f6f7fb !important;
}
@media (prefers-color-scheme: light){
  /* If the OS says light, we still render dark. */
  :root{ color-scheme: dark !important; }
  html, body{ background:#0b0c0f !important; color:#f6f7fb !important; }
}
/* Optional: darker scrollbars for WebKit + Firefox */
*{
  scrollbar-color: #2a2d36 #0b0c0f; /* Firefox */
}
*::-webkit-scrollbar{ width:12px; height:12px; }
*::-webkit-scrollbar-track{ background:#0b0c0f; }
*::-webkit-scrollbar-thumb{ background:#2a2d36; border-radius:10px; border:2px solid #0b0c0f; }
*::-webkit-scrollbar-thumb:hover{ background:#3a3e49; }

/* ---------- Global theme (dark-only) ---------- */
:root{
  --bg:#0b0c0f; --panel:#12141a; --ink:#f6f7fb; --muted:#c9cbd4;
  --accentH:205;
  --accent: hsl(var(--accentH) 100% 64%);
  --accent2: hsl(calc(var(--accentH) + 40) 100% 66%);
  --border:1px solid rgba(255,255,255,0.08);
  --radius:18px; --shadow:0 18px 40px rgba(0,0,0,.35);
  --glow:0 8px 24px rgba(62,166,255,0.25);
}

/* ---------- Full-screen container ---------- */
.ui-root{ position:relative; color:var(--ink); background:var(--bg); min-height:100vh; }
.ui-root::before{
  content:""; position:fixed; inset:-20vh -10vw -10vh -10vw; z-index:0;
  background: radial-gradient(900px 360px at var(--mx,60%) var(--my,10%), rgba(255,255,255,0.06), transparent 42%);
  pointer-events:none; transition: background-position .2s ease;
}

/* ---------- Home bar ---------- */
.ui-home{ position:sticky; top:0; z-index:50;
  backdrop-filter:saturate(140%) blur(8px);
  background:linear-gradient(to bottom, rgba(11,13,18,0.92), rgba(11,13,18,0.5) 60%, transparent);
  border-bottom:1px solid rgba(255,255,255,0.06);
}
.home-inner{ max-width:1200px; margin:0 auto; padding:14px 20px; display:flex; gap:18px; align-items:center; justify-content:space-between; }
.brand{ color:var(--ink); text-decoration:none; font-weight:700; letter-spacing:.2px; }
.home-nav{ display:flex; flex-wrap:wrap; gap:10px; }
.home-nav a{ color:var(--muted); text-decoration:none; padding:8px 10px; border-radius:12px; border:var(--border); background:rgba(255,255,255,0.04); }
.home-nav a:hover{ color:var(--ink); background:rgba(255,255,255,0.08); }

/* ---------- Global progress ---------- */
.ui-progress{ height:4px; background:rgba(255,255,255,0.08); }
.ui-progress-bar{ height:100%; width:0%; background:linear-gradient(90deg, var(--accent), var(--accent2)); box-shadow:0 0 12px rgba(62,166,255,0.6); transition: width .1s linear; }

/* ---------- Lesson layout ---------- */
.lesson{ position:relative; z-index:1; max-width:1200px; margin:0 auto; padding:28px 20px 80px; display:grid; grid-template-columns: 270px 1fr; gap:24px; }
.hero{ grid-column:1/-1; position:relative; margin-top:6px; }
.hero-inner{ padding:26px 18px; border-radius:16px; border:var(--border); background:rgba(255,255,255,0.04); box-shadow:var(--shadow); }
.hero h1{ margin:0 0 6px; font-size: clamp(26px,3vw,38px); }
.sub{ margin:0; color:var(--muted); }
.toc{ position:sticky; top:92px; align-self:start; height:max-content; border:var(--border); border-radius:var(--radius); background:rgba(255,255,255,0.05); box-shadow:var(--shadow); padding:14px; }
.toc ol{ list-style:none; margin:0; padding:0; display:grid; gap:4px; }
.toc a{ display:block; padding:8px 10px; border-radius:10px; color:var(--muted); text-decoration:none; transition: background .15s ease, color .15s ease, transform .12s; }
.toc a:hover{ color:var(--ink); background:rgba(255,255,255,0.08); transform: translateX(2px); }
.toc a.active{ color:var(--ink); background:linear-gradient(180deg, rgba(62,166,255,0.25), rgba(155,140,255,0.2)); }
.content{ display:grid; gap:22px; }
.card{ border:var(--border); border-radius:18px; background:rgba(18,20,26,0.72); backdrop-filter:saturate(120%) blur(2px); position:relative; overflow:hidden; padding:18px; transform: translateY(8px); opacity:0; transition: transform .45s ease, opacity .45s ease, box-shadow .35s ease; }
.card::after{ content:""; position:absolute; inset:0; pointer-events:none; background: radial-gradient(120% 60% at 10% -10%, rgba(62,166,255,0.08), transparent 40%), radial-gradient(120% 60% at 110% 10%, rgba(155,140,255,0.07), transparent 42%);}
.card.inview{ box-shadow:0 20px 50px rgba(0,0,0,0.35), 0 0 0 1px rgba(255,255,255,0.08) inset; }
.card.reveal{ transform: translateY(0); opacity:1; }

/* ---------- Code blocks ---------- */
pre{ position:relative; margin:12px 0; border-radius:14px; overflow:auto; border:var(--border); background:rgba(10,12,18,0.92); box-shadow: inset 0 0 0 1px rgba(255,255,255,0.03); }
pre code{ display:block; padding:14px; font-family: SFMono-Regular, Consolas, Menlo, Monaco, Liberation Mono, monospace; font-size:13.5px; line-height:1.5; color:#e3f2ff; }
.copy-btn{ position:absolute; top:8px; right:8px; padding:6px 10px; font-size:12px; border-radius:10px; border:var(--border); background:rgba(255,255,255,0.08); color:var(--ink); cursor:pointer; }
.copy-btn:hover{ background:rgba(255,255,255,0.14); }

/* ---------- Grids ---------- */
.grid{ display:grid; grid-template-columns: repeat(auto-fit, minmax(260px,1fr)); gap:12px; }
.snippet{ border:var(--border); background:rgba(255,255,255,0.05); border-radius:14px; padding:12px; }
.snippet h3{ margin:4px 0 8px; font-size:14px; color:var(--muted); font-weight:600; }

/* ---------- Back to top ---------- */
.to-top{ position:fixed; right:24px; bottom:24px; z-index:70; opacity:0; transform: translateY(10px); transition: opacity .2s ease, transform .2s ease; border:var(--border); border-radius:999px; padding:10px 12px; background:rgba(255,255,255,0.08); color:var(--ink); cursor:pointer; }
.to-top.show{ opacity:1; transform: translateY(0); }

/* ---------- Responsive ---------- */
@media (max-width: 980px){
  .lesson{ grid-template-columns: 1fr; }
  .toc{ position:static; order:-1; margin-top:10px; }
}
</style>

<script>
(function(){
  const root = document.getElementById('csp-lessons');
  if(!root) return;

  // Parallax shimmer follows cursor (global)
  root.addEventListener('mousemove', (e)=>{
    const r = root.getBoundingClientRect();
    const mx = ((e.clientX - r.left)/r.width * 100).toFixed(2) + '%';
    const my = ((e.clientY - r.top)/r.height * 100).toFixed(2) + '%';
    root.style.setProperty('--mx', mx);
    root.style.setProperty('--my', my);
  });

  // Reveal cards on scroll
  const cards = root.querySelectorAll('.card');
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
      if(e.isIntersecting){ e.target.classList.add('reveal','inview'); }
      else { e.target.classList.remove('inview'); }
    });
  }, { threshold: 0.35 });
  cards.forEach(c=>io.observe(c));

  // Global scroll progress + accent hue shift
  const progressBar = root.querySelector('.ui-progress-bar');
  const onScroll = ()=>{
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const pct = Math.max(0, Math.min(1, window.scrollY / max));
    if(progressBar) progressBar.style.width = (pct*100).toFixed(1)+'%';
    const hue = 205 + pct*120;
    root.style.setProperty('--accentH', hue.toFixed(1));
  };
  window.addEventListener('scroll', onScroll, { passive:true });
  onScroll();

  // Per-lesson sticky TOC highlighting
  const tocLinks = Array.from(root.querySelectorAll('.toc a'));
  const sectionTargets = tocLinks.map(a => document.querySelector(a.getAttribute('href')));
  const tocIO = new IntersectionObserver((entries)=>{
    entries.forEach(ent=>{
      if(ent.isIntersecting){
        const id = '#' + ent.target.id;
        tocLinks.forEach(l => l.classList.toggle('active', l.getAttribute('href')===id));
      }
    });
  }, { rootMargin: '-40% 0px -50% 0px', threshold: 0.01 });
  sectionTargets.forEach(s => s && tocIO.observe(s));

  // Add copy buttons to all <pre>
  root.querySelectorAll('pre').forEach(pre=>{
    const btn = document.createElement('button');
    btn.className = 'copy-btn';
    btn.type = 'button';
    btn.textContent = 'Copy';
    btn.addEventListener('click', async ()=>{
      const code = pre.innerText.replace(/^\s+|\s+$/g,'');
      try { await navigator.clipboard.writeText(code); btn.textContent = 'Copied!'; }
      catch { btn.textContent = 'Error'; }
      setTimeout(()=> btn.textContent = 'Copy', 1100);
    });
    pre.appendChild(btn);
  });

  // Back-to-top visibility + smooth scroll
  const topBtn = root.querySelector('.to-top');
  const onScrollTop = ()=>{
    const show = window.scrollY > 600; if(topBtn) topBtn.classList.toggle('show', show);
  };
  window.addEventListener('scroll', onScrollTop, { passive:true });
  onScrollTop();
  if(topBtn) topBtn.addEventListener('click', ()=> window.scrollTo({ top:0, behavior:'smooth' }));
})();
</script>


<!-- =======================
🎮 Flappy Math — Classic Theme (Fullscreen + Robust sizing)
Paste this single block in Markdown. No external libraries.
======================= -->

<section id="flappy-math" style="max-width:1000px;margin:0 auto;">
  <header style="padding:14px 0;">
    <h1 style="margin:0;font:600 28px/1.2 ui-sans-serif,system-ui">🎮 Flappy Math — Expressions</h1>
    <p style="margin:.4rem 0 0;color:#c9cbd4">Fly through 10 gates. Each gate asks a tiny math/code question. Answer right to keep going! Click game or press <kbd>F</kbd> for <strong>fullscreen</strong>.</p>
  </header>

  <div class="fm-card">
    <div class="fm-wrap" id="fmWrap">
      <canvas id="fmCanvas" width="960" height="480" aria-label="Flappy Math"></canvas>

      <!-- HUD -->
      <div class="fm-hud">
        <div class="fm-score">Score: <span id="fmScore">0</span> / 10</div>
        <div class="fm-ctrls">
          <button id="fmStart" class="fm-btn">Start</button>
          <button id="fmPause" class="fm-btn" disabled>Pause</button>
          <button id="fmFS" class="fm-btn" title="Fullscreen (F)">Fullscreen</button>
        </div>
        <div class="fm-hint">Press <kbd>Space</kbd> / click / tap to flap • <kbd>F</kbd> to toggle fullscreen</div>
      </div>

      <!-- Question modal (dialog with fallback) -->
      <dialog id="fmQ" class="fm-modal">
        <form method="dialog" class="fm-sheet">
          <h3 id="fmQTitle">Checkpoint</h3>
          <p id="fmQPrompt"></p>

          <div id="fmQMcq" class="fm-block" hidden></div>

          <div id="fmQInputWrap" class="fm-block" hidden>
            <input id="fmQInput" class="fm-input" placeholder="Type your answer…" />
          </div>

          <div class="fm-actions">
            <button id="fmSubmit" class="fm-btn">Check</button>
            <button id="fmSkip" class="fm-btn ghost" value="cancel">Skip</button>
            <span id="fmQFeedback" class="fm-note" aria-live="polite"></span>
          </div>
        </form>
      </dialog>

      <!-- End modal -->
      <dialog id="fmEnd" class="fm-modal">
        <div class="fm-sheet">
          <h2 id="fmEndTitle">You Win!</h2>
          <p id="fmEndMsg"></p>
          <div class="fm-actions">
            <button id="fmRestart" class="fm-btn">Play Again</button>
            <button id="fmCloseEnd" class="fm-btn ghost">Close</button>
          </div>
        </div>
      </dialog>

      <!-- Tap-to-start overlay -->
      <div id="fmOverlay" class="fm-overlay">
        <div class="fm-bubble">
          <p>Click / tap to flap. Pass a pipe ➜ answer a quick expression question. Get to <strong>10</strong>!</p>
          <p style="opacity:.8;margin:.4rem 0 0">Tip: please don't use full screen! <kbd>PRESS SPACE BAR FIRST, THEN CLICK START TO START THE GAME</kbd></p>
        </div>
      </div>
    </div>
  </div>
</section>

<style>
:root{color-scheme:dark}
.fm-card{border:1px solid rgba(255,255,255,.08);border-radius:18px;background:#12141a;padding:12px}
.fm-wrap{position:relative;background:#111}
#fmCanvas{display:block;width:100%;height:auto;border-radius:14px;border:1px solid rgba(255,255,255,.08);background:#7ec8ff}

/* HUD */
.fm-hud{display:flex;flex-wrap:wrap;gap:10px;align-items:center;margin-top:10px}
.fm-score{padding:6px 10px;border-radius:10px;border:1px solid rgba(255,255,255,.08);background:rgba(255,255,255,.05)}
.fm-ctrls{display:flex;gap:8px}
.fm-btn{padding:8px 12px;border-radius:10px;border:1px solid rgba(255,255,255,.12);background:rgba(255,255,255,.08);color:#f6f7fb;cursor:pointer}
.fm-btn:hover{background:rgba(255,255,255,.14)}
.fm-btn[disabled]{opacity:.5;cursor:not-allowed}
.fm-btn.ghost{background:transparent}
.fm-hint{color:#c9cbd4}
kbd{border:1px solid rgba(255,255,255,.18);border-bottom:2px solid rgba(255,255,255,.25);border-radius:6px;padding:2px 6px;background:rgba(255,255,255,.06)}

/* Dialogs */
.fm-modal::backdrop{background:rgba(0,0,0,.6)}
.fm-sheet{max-width:640px;border:1px solid rgba(255,255,255,.12);border-radius:16px;background:#141824;box-shadow:0 18px 40px rgba(0,0,0,.35);padding:16px}
.fm-block{margin:10px 0}
.fm-choice{display:block;margin:6px 0;padding:8px 10px;border-radius:10px;border:1px solid rgba(255,255,255,.12);background:rgba(255,255,255,.06);cursor:pointer}
.fm-choice input{margin-right:8px}
.fm-input{width:100%;padding:10px;border-radius:10px;border:1px solid rgba(255,255,255,.12);background:#0e1016;color:#f6f7fb}
.fm-actions{display:flex;gap:10px;align-items:center;margin-top:8px}
.fm-note{min-height:1.2em;color:#c9cbd4}

/* Start overlay */
.fm-overlay{position:absolute;inset:0;display:grid;place-items:center;pointer-events:auto}
.fm-bubble{max-width:560px;background:rgba(18,20,26,.85);border:1px solid rgba(255,255,255,.12);border-radius:12px;padding:14px;color:#e8edff;box-shadow:0 10px 30px rgba(0,0,0,.4)}

/* ★ Fullscreen fixes: wrapper + canvas truly fill screen and never collapse */
#fmWrap:fullscreen { width:100vw !important; height:100vh !important; }
#fmWrap:fullscreen #fmCanvas { width:100vw !important; height:100vh !important; border-radius:0 !important; }
:fullscreen #fmCanvas { width:100vw !important; height:100vh !important; border-radius:0 !important; } /* extra safety */
</style>

<script>
(()=>{
/* ---------- helpers: dialog fallback ---------- */
function modalOpen(d){ if(d?.showModal){ d.showModal(); } else if(d){ d.setAttribute('open',''); } }
function modalClose(d){ if(d?.close){ try{ d.close(); }catch{} } d?.removeAttribute('open'); }

/* ---------- elements ---------- */
const wrap = document.getElementById('fmWrap');
const canvas = document.getElementById('fmCanvas');
const ctx = canvas.getContext('2d');
const scoreEl = document.getElementById('fmScore');
const btnStart = document.getElementById('fmStart');
const btnPause = document.getElementById('fmPause');
const btnFS = document.getElementById('fmFS');
const overlay = document.getElementById('fmOverlay');

/* dialogs */
const qDlg = document.getElementById('fmQ');
const qTitle = document.getElementById('fmQTitle');
const qPrompt = document.getElementById('fmQPrompt');
const qMCQ = document.getElementById('fmQMcq');
const qInputWrap = document.getElementById('fmQInputWrap');
const qInput = document.getElementById('fmQInput');
const qFeedback = document.getElementById('fmQFeedback');
const btnSubmit = document.getElementById('fmSubmit');
const btnSkip = document.getElementById('fmSkip');

const endDlg = document.getElementById('fmEnd');
const endTitle = document.getElementById('fmEndTitle');
const endMsg = document.getElementById('fmEndMsg');
const btnRestart = document.getElementById('fmRestart');
const btnCloseEnd = document.getElementById('fmCloseEnd');

/* ---------- robust canvas sizing ---------- */
const DPR = Math.max(1, window.devicePixelRatio || 1);

function fitCanvas() {
  // Use bounding box; in fullscreen, fall back to viewport to avoid 0 height
  const fs = document.fullscreenElement || document.webkitFullscreenElement;
  const rect = canvas.getBoundingClientRect();
  let cssW, cssH;
  if (fs) {
    cssW = Math.max(rect.width || 0, window.innerWidth || 0, 960);
    cssH = Math.max(rect.height || 0, window.innerHeight || 0, 480);
  } else {
    cssW = rect.width || canvas.width / DPR || 960;
    cssH = rect.height || canvas.height / DPR || 480;
  }
  canvas.width  = Math.round(cssW * DPR);
  canvas.height = Math.round(cssH * DPR);
}
fitCanvas();
addEventListener('resize', ()=>{ fitCanvas(); render(); });

/* Refit after fullscreen transitions + observe wrapper */
function onFSChange(){ setTimeout(()=>{ fitCanvas(); render(); }, 50); }
document.addEventListener('fullscreenchange', onFSChange);
document.addEventListener('webkitfullscreenchange', onFSChange);
if ('ResizeObserver' in window) {
  new ResizeObserver(()=>{ fitCanvas(); render(); }).observe(wrap);
}

/* ---------- game state ---------- */
const G = 0.38, FLAP = -6.2, PIPE_GAP = 150, PIPE_W = 72, PIPE_SP = 240, SPEED = 2.6;

let running=false, paused=false, askPending=false, askedId=null, frame=0;
let score=0, target=10;
const bird = { x: 180, y: 200, vy: 0, r: 16 };
let pipes=[], groundX=0;

/* visuals */
const skyGrad = ()=>{ const g=ctx.createLinearGradient(0,0,0,canvas.height); g.addColorStop(0,'#4ec0ff'); g.addColorStop(1,'#aee5ff'); return g; };
function drawGround(){
  const gh = Math.max(40*DPR, Math.round(canvas.height*0.12));
  groundX = (groundX - SPEED*DPR) % (120*DPR);
  ctx.fillStyle = '#ded37c';
  ctx.fillRect(0, canvas.height - gh, canvas.width, gh);
  ctx.fillStyle = '#6cc43f';
  ctx.fillRect(0, canvas.height - gh - 6*DPR, canvas.width, 6*DPR);
  ctx.fillStyle = '#c4ba5d';
  for(let x=groundX; x<canvas.width; x+=120*DPR){
    ctx.fillRect(x, canvas.height - gh + 6*DPR, 60*DPR, 10*DPR);
  }
}
function drawBird(){
  ctx.save();
  ctx.translate(bird.x*DPR, bird.y*DPR);
  ctx.rotate(Math.max(-0.35, Math.min(0.8, bird.vy/12)));
  // body
  ctx.fillStyle = '#ffd200';
  ctx.beginPath(); ctx.arc(0,0,bird.r*DPR,0,Math.PI*2); ctx.fill();
  // beak
  ctx.fillStyle = '#ff8c00'; ctx.beginPath();
  ctx.moveTo(bird.r*DPR*0.6,0); ctx.lineTo(bird.r*DPR*1.2, -3*DPR); ctx.lineTo(bird.r*DPR*1.2, 3*DPR); ctx.closePath(); ctx.fill();
  // eye
  ctx.fillStyle = '#000'; ctx.beginPath(); ctx.arc(4*DPR,-4*DPR,3*DPR,0,Math.PI*2); ctx.fill();
  ctx.restore();
}
function drawPipe(p){
  const x = p.x*DPR, gapTop=p.top, gapBot=p.top + PIPE_GAP*DPR;
  ctx.fillStyle = '#2ecc40';
  ctx.fillRect(x, 0, PIPE_W*DPR, gapTop);
  ctx.fillRect(x, gapBot, PIPE_W*DPR, canvas.height - gapBot);
  ctx.fillStyle = '#28b737';
  ctx.fillRect(x-4*DPR, gapTop-10*DPR, (PIPE_W+8)*DPR, 10*DPR);
  ctx.fillRect(x-4*DPR, gapBot, (PIPE_W+8)*DPR, 10*DPR);
}

function makePipe(px){
  const minTop = 60*DPR, maxTop = canvas.height - (PIPE_GAP*DPR) - 140*DPR;
  const top = Math.max(minTop, Math.min(maxTop, (80 + Math.random()*(canvas.height/DPR - PIPE_GAP - 180))*DPR));
  return { x:px, top, passed:false, asked:false, id:Math.random().toString(36).slice(2) };
}
function resetPipes(){
  pipes.length=0;
  let x = (canvas.width/DPR) + 280;
  for(let i=0;i<6;i++){ pipes.push(makePipe(x)); x += PIPE_SP + Math.random()*60; }
}

/* ---------- questions ---------- */
const BANK = [
  {type:'mcq', prompt:'10 + 5 * 2 = ?', choices:['30','20','15'], correctIdx:1},
  {type:'input', prompt:'(12 / 6) * 3 + 1 = ?', answer:'7', checker:'eval'},
  {type:'input', prompt:'average ← (10 + 14) / 2 → average = ?', answer:'12', checker:'eval'},
  {type:'mcq', prompt:'First to evaluate in 8 + (6 / 3) * 4 ?', choices:['8 + 6','(6 / 3)','* 4'], correctIdx:1},
  {type:'input', prompt:'20 / 5 * 2 (left→right) = ?', answer:'8', checker:'eval'},
  {type:'input', prompt:'(2 + 9) * 7 = ?', answer:'77', checker:'eval'},
  {type:'mcq', prompt:'x * 2 == 0 ? x=7 →', answer:"14", checker: 'eval'},,
  {type:'input', prompt:'a=3; b=a+4; b = ?', answer:'7', checker:'text'},
  {type:'input', prompt:'(10 + 5) * 2 = ?', answer:'30', checker:'eval'},
  {type:'input', prompt:'(20 / 5) + 3 * 2 = ?', answer:'10', checker:'eval'},
];
function safeEval(str){
  const s = String(str).replace(/\bMOD\b/gi, '%');
  if(!/^[0-9+\-*/()%\s.]+$/.test(s)) return false;
  try{ const v = Function('"use strict";return ('+s+')')(); return Number.isFinite(v) ? String(v) : false; }
  catch{ return false; }
}
function askQuestion(pipe){
  if(pipe.asked) return;
  pipe.asked = true; askedId = pipe.id;
  pause(true);
  const q = BANK[Math.floor(Math.random()*BANK.length)];
  qTitle.textContent = 'Checkpoint';
  qPrompt.textContent = q.prompt;
  qFeedback.textContent = '';
  qMCQ.innerHTML = ''; qMCQ.hidden = true; qInputWrap.hidden = true; qInput.value='';

  if(q.type==='mcq'){
    qMCQ.hidden = false;
    q.choices.forEach((t,i)=>{
      const lab = document.createElement('label'); lab.className='fm-choice';
      lab.innerHTML = `<input type="radio" name="q" value="${i}"> ${t}`;
      qMCQ.appendChild(lab);
    });
  }else{
    qInputWrap.hidden = false;
  }
  modalOpen(qDlg);

  btnSubmit.onclick = (ev)=>{
    ev.preventDefault();
    let ok=false;
    if(q.type==='mcq'){
      const picked = qMCQ.querySelector('input[name="q"]:checked');
      if(!picked){ qFeedback.textContent='Pick an option.'; return; }
      ok = Number(picked.value)===q.correctIdx;
    }else{
      const val = qInput.value.trim();
      if(!val){ qFeedback.textContent='Enter an answer.'; return; }
      if(q.checker==='eval'){ const got = safeEval(val); ok = (got!==false && got===q.answer); }
      else { ok = (val===q.answer); }
    }
    if(ok){ qFeedback.textContent='✅ Correct!'; setTimeout(()=>{ modalClose(qDlg); resume(); }, 280); }
    else { qFeedback.textContent='❌ Try again or Skip.'; }
  };
  btnSkip.onclick = ()=>{
    modalClose(qDlg);
    if(score>0){ score--; updateScore(); }
    resume();
  };
}

/* ---------- controls ---------- */
function flap(){ if(!running||paused) return; bird.vy = -6.2; }
canvas.addEventListener('pointerdown', ()=>{ if(overlay.style.display!=='none') overlay.style.display='none'; flap(); });
addEventListener('keydown', (e)=>{ if(e.code==='Space'){ e.preventDefault(); overlay.style.display='none'; flap(); } });

btnStart.onclick = ()=> start(true);
btnPause.onclick = ()=>{
  if(!running) return;
  paused = !paused;
  btnPause.textContent = paused ? 'Resume' : 'Pause';
  fitCanvas(); render();            // ensure repaint when toggling pause
  if(!paused) loop();
};

function toggleFullscreen(){
  const el = wrap;
  const isFS = document.fullscreenElement || document.webkitFullscreenElement;
  if (!isFS) {
    (el.requestFullscreen || el.webkitRequestFullscreen || el.msRequestFullscreen || el.mozRequestFullScreen)?.call(el);
  } else {
    (document.exitFullscreen || document.webkitExitFullscreen || document.msExitFullscreen || document.mozCancelFullScreen)?.call(document);
  }
  setTimeout(()=>{ fitCanvas(); render(); }, 50); // repaint after transition
}
btnFS.onclick = toggleFullscreen;
wrap.addEventListener('dblclick', toggleFullscreen);
addEventListener('keydown', (e)=>{ if(e.key==='f'||e.key==='F') toggleFullscreen(); });

btnRestart.onclick = ()=>{ modalClose(endDlg); start(true); };
btnCloseEnd.onclick = ()=> modalClose(endDlg);

/* ---------- lifecycle ---------- */
function start(resetAll){
  overlay.style.display='none';
  btnPause.disabled = false; btnPause.textContent='Pause';
  if(resetAll){
    score=0; updateScore();
    bird.y = canvas.height/DPR*0.45; bird.vy=0;
    resetPipes(); groundX=0; frame=0; askPending=false; askedId=null;
    modalClose(endDlg); modalClose(qDlg);
  }
  running=true; paused=false; loop();
}
function pause(hard=false){ paused=true; running=!hard && running; }
function resume(){ paused=false; running=true; loop(); }

/* ---------- game loop ---------- */
function update(){
  frame++;
  // gravity
  bird.vy += G; bird.y += bird.vy;

  // pipes
  for(const p of pipes){
    p.x -= SPEED;
    if(!p.passed && p.x + PIPE_W < bird.x){
      p.passed = true; score++; updateScore(); askPending=true; askedId=p.id;
    }
  }
  // spawn
  const last = pipes[pipes.length-1];
  if(last && last.x < canvas.width/DPR - 3*PIPE_SP){
    const x = pipes[pipes.length-1].x + PIPE_SP + Math.random()*60;
    pipes.push(makePipe(x));
  }
  // cull
  if(pipes[0] && pipes[0].x + PIPE_W < -20){ pipes.shift(); }

  // collisions
  const topBound = 0 + bird.r, botBound = canvas.height/DPR - (Math.max(40, canvas.height/DPR*0.12)) - 6 - 2;
  if(bird.y - bird.r < 0 || bird.y + bird.r > botBound){ return gameOver('Ground/ceiling hit!'); }
  for(const p of pipes){
    const withinX = bird.x + bird.r > p.x && bird.x - bird.r < p.x + PIPE_W;
    const gapTop = p.top/DPR, gapBot = gapTop + PIPE_GAP;
    if(withinX && (bird.y - bird.r < gapTop || bird.y + bird.r > gapBot)){ return gameOver('Pipe collision!'); }
  }

  // ask question after pass
  if(askPending){
    const target = pipes.find(pp=>pp.id===askedId);
    if(target){ askPending=false; askQuestion(target); }
  }

  if(score>=target){ return win(); }
}
function render(){
  // sky
  ctx.fillStyle = skyGrad(); ctx.fillRect(0,0,canvas.width,canvas.height);
  // clouds
  ctx.save(); ctx.globalAlpha=.2;
  for(let i=0;i<18;i++){
    const x = (i*311 + frame*1.1*DPR) % canvas.width;
    const y = (i*137) % (canvas.height*0.6);
    ctx.fillStyle='#fff';
    ctx.beginPath(); ctx.ellipse(x,y,28*DPR,16*DPR,0,0,Math.PI*2); ctx.fill();
  }
  ctx.restore();

  // pipes & bird
  for(const p of pipes) drawPipe(p);
  drawGround();
  drawBird();

  // score on canvas
  ctx.save(); ctx.scale(DPR,DPR);
  ctx.fillStyle='#073b4c'; ctx.fillRect(10,10,110,28);
  ctx.fillStyle='#ffd166'; ctx.font='bold 16px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace';
  ctx.fillText(`Score: ${score}/${target}`, 16, 30);
  ctx.restore();
}
function loop(){
  if(!running || paused) return;
  const res = update();
  if(res==='stop') return;
  render();
  requestAnimationFrame(loop);
}
function updateScore(){ scoreEl.textContent=String(score); }
function win(){ running=false; paused=true; endTitle.textContent='🏆 You Win!'; endMsg.textContent='You passed all 10 gates and solved the expressions.'; modalOpen(endDlg); return 'stop'; }
function gameOver(msg){ running=false; paused=true; endTitle.textContent='💥 Game Over'; endMsg.textContent=msg+` Final: ${score}/${target}`; modalOpen(endDlg); return 'stop'; }

/* first paint + overlay */
render();
overlay.style.display='grid';
})();
</script>

