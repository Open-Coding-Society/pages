---
layout: cs-bigsix-lesson
title: "Big Six — Interactive World"
description: "An interactive game world covering all six Big Six lessons with NPC interactions and quizzes."
permalink: /bigsix/game
parent: "bigsix"
categories: [CSP, Game, Interactive]
tags: [game, interactive, lessons]
author: "Big Six Team"
date: 2025-12-02
---

<style>
  /* ── Reset & base ────────────────────────────────────────────── */
  * { box-sizing: border-box; }
  #gameContainer { font-family: 'Segoe UI', system-ui, sans-serif; }

  /* ── Game container ──────────────────────────────────────────── */
  #gameContainer { position: relative; width: 100%; height: 540px; overflow: hidden; }
  canvas { display: block; width: 100%; height: 100%; }

  /* ── HUD ─────────────────────────────────────────────────────── */
  #hud {
    position: absolute; top: 10px; left: 12px;
    font-size: 11px; color: #9aa6bf; pointer-events: none;
    background: rgba(10,14,39,0.7); padding: 4px 10px; border-radius: 6px;
  }
  #hud span { color: #a78bfa; font-weight: 700; }
  #controls {
    position: absolute; top: 10px; right: 12px;
    font-size: 10px; color: #9aa6bf; text-align: right; pointer-events: none;
    background: rgba(10,14,39,0.7); padding: 4px 10px; border-radius: 6px; line-height: 1.7;
  }

  /* ── Dialogue box ────────────────────────────────────────────── */
  #dialogue {
    position: absolute; bottom: 12px; left: 50%; transform: translateX(-50%);
    width: 92%; max-width: 700px;
    background: rgba(10,14,39,0.97); border: 1.5px solid rgba(124,58,237,0.6);
    border-radius: 14px; padding: 16px 20px 14px;
    pointer-events: all; display: none; z-index: 10;
    animation: fadeUp 0.2s ease;
  }
  @keyframes fadeUp { from { opacity:0; transform: translateX(-50%) translateY(8px); } to { opacity:1; transform: translateX(-50%) translateY(0); } }
  #dialogue h4 { color: #a78bfa; font-size: 13px; font-weight: 700; margin-bottom: 6px; letter-spacing: 0.04em; display: flex; align-items: center; gap: 8px; }
  #dialogue p  { color: #cdd9f0; font-size: 13px; line-height: 1.65; }
  #dialogue .close-x {
    position: absolute; top: 10px; right: 12px;
    background: none; border: none; color: #9aa6bf; font-size: 16px;
    cursor: pointer; line-height: 1; padding: 2px 6px; border-radius: 4px;
  }
  #dialogue .close-x:hover { background: rgba(255,255,255,0.08); color: #e6eef8; }

  /* ── Dialogue action buttons ─────────────────────────────────── */
  #dialogueActions { display: flex; gap: 8px; margin-top: 12px; flex-wrap: wrap; }
  .d-btn {
    padding: 7px 16px; border-radius: 8px; border: none;
    cursor: pointer; font-size: 12px; font-weight: 600; transition: all 0.15s;
  }
  .d-btn-primary { background: #7c3aed; color: #fff; }
  .d-btn-primary:hover { background: #6d28d9; transform: translateY(-1px); }
  .d-btn-secondary { background: #1a2340; color: #9aa6bf; border: 1px solid rgba(255,255,255,0.1); }
  .d-btn-secondary:hover { background: #253353; color: #e6eef8; }

  /* ── Wizard typing indicator ─────────────────────────────────── */
  #typingDots { display: none; gap: 4px; align-items: center; padding: 4px 0; }
  #typingDots span {
    width: 6px; height: 6px; border-radius: 50%; background: #a78bfa;
    animation: dotBounce 1.2s ease-in-out infinite;
  }
  #typingDots span:nth-child(2) { animation-delay: 0.2s; }
  #typingDots span:nth-child(3) { animation-delay: 0.4s; }
  @keyframes dotBounce { 0%,80%,100%{transform:scale(0.6);opacity:0.4} 40%{transform:scale(1);opacity:1} }

  /* ── Quiz modal ──────────────────────────────────────────────── */
  #quizModal {
    position: absolute; top: 50%; left: 50%; transform: translate(-50%,-50%);
    width: 94%; max-width: 660px; max-height: 82%;
    background: #0f1729; border: 1.5px solid rgba(124,58,237,0.5);
    border-radius: 16px; padding: 24px 24px 20px;
    pointer-events: all; display: none; z-index: 20;
    overflow-y: auto; animation: scaleIn 0.22s ease;
  }
  @keyframes scaleIn { from { opacity:0; transform: translate(-50%,-50%) scale(0.95); } to { opacity:1; transform: translate(-50%,-50%) scale(1); } }

  #quizModal h3 { color: #a78bfa; font-size: 17px; font-weight: 700; margin-bottom: 2px; }
  #quizModal .sub { color: #9aa6bf; font-size: 12px; margin-bottom: 18px; }

  /* ── Question blocks ─────────────────────────────────────────── */
  .q-block { margin-bottom: 20px; }
  .q-text {
    font-size: 13px; color: #e6eef8; font-weight: 600; margin-bottom: 8px;
    padding: 9px 13px; background: rgba(124,58,237,0.08);
    border-left: 3px solid #7c3aed; border-radius: 0 8px 8px 0; line-height: 1.55;
  }

  /* ── Answer options ──────────────────────────────────────────── */
  .opt {
    display: flex; align-items: center; gap: 10px;
    padding: 9px 13px; margin: 5px 0;
    border-radius: 9px; border: 1.5px solid rgba(255,255,255,0.09);
    cursor: pointer; font-size: 12px; color: #cdd9f0;
    background: #051226; transition: all 0.15s; user-select: none;
    position: relative;
  }
  .opt:hover:not(.locked) { border-color: rgba(124,58,237,0.55); background: rgba(124,58,237,0.08); }

  /* Selected (before grading) */
  .opt.sel {
    border-color: #7c3aed; background: rgba(124,58,237,0.14);
    color: #ddd6fe;
  }
  .opt.sel .opt-radio { background: #7c3aed; border-color: #7c3aed; }

  /* Correct answer */
  .opt.correct {
    border-color: #22c55e; background: rgba(34,197,94,0.12);
    color: #86efac;
  }
  .opt.correct .opt-radio { background: #22c55e; border-color: #22c55e; }
  .opt.correct::after { content: '✓'; position: absolute; right: 13px; font-size: 14px; font-weight: 700; color: #22c55e; }

  /* Wrong answer (player's wrong pick) */
  .opt.wrong {
    border-color: #ef4444; background: rgba(239,68,68,0.1);
    color: #fca5a5;
  }
  .opt.wrong .opt-radio { background: #ef4444; border-color: #ef4444; }
  .opt.wrong::after { content: '✗'; position: absolute; right: 13px; font-size: 14px; font-weight: 700; color: #ef4444; }

  /* Your pick label */
  .opt .your-pick {
    display: none; font-size: 10px; font-weight: 700;
    background: rgba(239,68,68,0.25); color: #fca5a5;
    padding: 1px 6px; border-radius: 4px; margin-left: 4px;
  }
  .opt.wrong .your-pick { display: inline; }

  .opt-radio {
    width: 14px; height: 14px; border-radius: 50%; border: 2px solid #4a5568;
    flex-shrink: 0; transition: all 0.15s;
  }
  .opt-label { flex: 1; }

  /* Explanation text shown after grading */
  .explanation {
    display: none; margin: 6px 0 2px 24px; padding: 7px 11px;
    background: rgba(34,197,94,0.07); border-radius: 6px;
    font-size: 11px; color: #86efac; border-left: 2px solid #22c55e;
    line-height: 1.55;
  }
  .explanation.show { display: block; }

  /* ── Score banner ────────────────────────────────────────────── */
  #scoreBanner {
    display: none; margin-top: 14px; padding: 10px 16px;
    border-radius: 10px; font-size: 13px; font-weight: 600; text-align: center;
  }
  #scoreBanner.perfect  { background: rgba(34,197,94,0.15);  color: #86efac; border: 1px solid rgba(34,197,94,0.3); }
  #scoreBanner.good     { background: rgba(245,158,11,0.12); color: #fcd34d; border: 1px solid rgba(245,158,11,0.3); }
  #scoreBanner.retry    { background: rgba(239,68,68,0.1);   color: #fca5a5; border: 1px solid rgba(239,68,68,0.3); }

  /* ── Modal bottom buttons ────────────────────────────────────── */
  .modal-btns { display: flex; gap: 10px; margin-top: 16px; justify-content: flex-end; }
  .modal-btns button {
    padding: 8px 20px; border-radius: 8px; border: none;
    cursor: pointer; font-size: 13px; font-weight: 600; transition: all 0.15s;
  }
  .btn-grade   { background: #7c3aed; color: #fff; }
  .btn-grade:hover   { background: #6d28d9; }
  .btn-retry   { background: #1a2340; color: #a78bfa; border: 1px solid rgba(124,58,237,0.3); display: none; }
  .btn-retry:hover   { background: #253353; }
  .btn-dismiss { background: #1a2340; color: #9aa6bf; border: 1px solid rgba(255,255,255,0.1); }
  .btn-dismiss:hover { background: #253353; color: #e6eef8; }
</style>

<div id="gameContainer">
  <canvas id="gameCanvas"></canvas>

  <!-- HUD overlays -->
  <div id="hud">Big Six World &nbsp;·&nbsp; <span>WASD</span> move &nbsp;·&nbsp; <span>E</span> interact</div>
  <div id="controls">
    Stations: Frontend · Backend · DataViz<br>
    Resume · AI · Analytics · 🧙 Wizard
  </div>

  <!-- ── Dialogue box ─────────────────────────────────────────── -->
  <div id="dialogue">
    <button class="close-x" id="closeDialogue">✕</button>
    <h4 id="npcName">NPC</h4>
    <div id="typingDots"><span></span><span></span><span></span></div>
    <p id="npcText"></p>
    <!-- ── Wizard AI chat (only shown when talking to wizard) ── -->
    <div id="wizardChat" style="display:none; margin-top:10px;">
      <div id="wizardChatHistory" style="max-height:120px;overflow-y:auto;margin-bottom:8px;font-size:12px;line-height:1.6;"></div>
      <div style="display:flex;gap:8px;align-items:flex-end;">
        <textarea id="wizardInput" rows="2"
          placeholder="Ask the wizard about Big Six topics…"
          style="flex:1;background:#0a0e27;border:1.5px solid rgba(245,158,11,0.4);border-radius:8px;
                 color:#e6eef8;font-size:12px;padding:7px 10px;resize:none;outline:none;
                 font-family:inherit;"></textarea>
        <button id="btnWizSend" class="d-btn d-btn-primary" style="background:#f59e0b;white-space:nowrap;">Ask ✦</button>
      </div>
    </div>

    <div id="dialogueActions">
      <button class="d-btn d-btn-primary"   id="btnQuiz" style="display:none">📝 Take Quiz</button>
      <button class="d-btn d-btn-secondary" id="btnClose">Close</button>
    </div>
  </div>

  <!-- ── Quiz modal ──────────────────────────────────────────────── -->
  <div id="quizModal">
    <h3 id="quizTitle">Quiz</h3>
    <div class="sub" id="quizSub">Answer all questions then press Grade.</div>
    <div id="quizQuestions"></div>
    <div id="scoreBanner"></div>
    <div class="modal-btns">
      <button class="btn-retry"   id="btnRetry">↺ Retry</button>
      <button class="btn-dismiss" id="btnCloseQuiz">Close</button>
      <button class="btn-grade"   id="btnGrade">Grade ✓</button>
    </div>
  </div>
</div>

<script>
/* ═══════════════════════════════════════════════════════════════
   BIG SIX GAME — Enhanced v2
   Enhancements over v1:
     • Wizard is fully interactive (proximity prompt + E key + dialogue)
     • Wizard lets you pick any lesson to quiz from
     • Quiz shows selected answer clearly with your-pick label
     • Immediate visual feedback: correct=green ✓  wrong=red ✗
     • Explanation revealed per question after grading
     • Score banner with tiered messaging
     • Retry button resets quiz without closing modal
   All existing systems (player movement, NPC proximity, dialogue,
   canvas rendering) are preserved and extended, not rewritten.
   ═══════════════════════════════════════════════════════════════ */

/* ── Canvas setup ───────────────────────────────────────────── */
const canvas    = document.getElementById('gameCanvas');
const ctx       = canvas.getContext('2d');
const container = document.getElementById('gameContainer');

function resize() {
  canvas.width  = container.clientWidth;
  canvas.height = container.clientHeight;
}
resize();
window.addEventListener('resize', resize);
const W = () => canvas.width;
const H = () => canvas.height;

/* ── Lesson data (content from all 6 lesson .md files) ─────── */
const LESSONS = [
  {
    id: 'frontend', label: 'Frontend Dev', emoji: '🎨', color: '#4a9eff', x: 0.08,
    desc: 'Frontend covers HTML, CSS, JavaScript, Markdown, Sass, and Tailwind. It\'s everything users see and interact with. The "Creators" team builds the visual layer of web apps using tools like Quill, live preview, and console sandboxes.',
    quiz: [
      { q: 'Which language structures web page content?',
        opts: ['CSS','HTML','JavaScript','Markdown'], ans: 1,
        exp: 'HTML (HyperText Markup Language) provides structure and semantic meaning to web content.' },
      { q: 'What does CSS stand for?',
        opts: ['Creative Style Sheets','Cascading Style Sheets','Coded Style Syntax','Content Styling System'], ans: 1,
        exp: 'CSS = Cascading Style Sheets — it controls layout, color, fonts, and visual presentation.' },
      { q: 'Which is a utility-first CSS framework?',
        opts: ['Bootstrap','Sass','Tailwind','jQuery'], ans: 2,
        exp: 'Tailwind CSS provides low-level utility classes you compose directly in HTML markup.' },
    ]
  },
  {
    id: 'backend', label: 'Backend Dev', emoji: '⚙️', color: '#4cae4c', x: 0.22,
    desc: 'Backend covers servers, databases, REST APIs, authentication, and frameworks. Flask (Python) is minimal and flexible; Spring Boot (Java) is opinionated and full-featured. The "Encrypters" team always validates before saving.',
    quiz: [
      { q: 'Which HTTP method CREATES a new resource?',
        opts: ['GET','DELETE','POST','PUT'], ans: 2,
        exp: 'POST creates. GET reads. PUT/PATCH updates. DELETE removes — CRUD over HTTP.' },
      { q: 'What does ORM stand for?',
        opts: ['Object Relational Mapping','Open REST Method','Output Response Model','Optional Route Manager'], ans: 0,
        exp: 'ORM maps database tables to code objects — e.g. Hibernate (Spring) or SQLAlchemy (Flask).' },
      { q: 'SQL databases use which data structure?',
        opts: ['Documents','Key-value pairs','Fixed schema tables & rows','Graph nodes'], ans: 2,
        exp: 'SQL (Relational) databases use fixed schemas with tables, rows, columns, and JOIN operations.' },
    ]
  },
  {
    id: 'dataviz', label: 'Data Viz', emoji: '📊', color: '#f59e0b', x: 0.36,
    desc: 'Data Visualization is about turning raw data into meaningful charts, tables, and dashboards. The "Applicators" team builds Spring Boot REST endpoints with JPA so the frontend can fetch, filter, sort, and paginate records — making data actually readable.',
    quiz: [
      { q: 'What does CRUD stand for?',
        opts: ['Create Read Update Delete','Copy Run Undo Deploy','Code Run Update Debug','Connect Read Use Destroy'], ans: 0,
        exp: 'CRUD = Create, Read, Update, Delete — the four fundamental database operations.' },
      { q: 'Which Spring annotation marks a REST controller?',
        opts: ['@Service','@Repository','@RestController','@Component'], ans: 2,
        exp: '@RestController combines @Controller + @ResponseBody to handle RESTful HTTP requests.' },
      { q: 'Which JPA annotation marks the primary key?',
        opts: ['@Primary','@Id','@Key','@UniqueId'], ans: 1,
        exp: '@Id marks the primary key field. @GeneratedValue auto-increments the ID.' },
    ]
  },
  {
    id: 'resume', label: 'Resume', emoji: '📄', color: '#ec4899', x: 0.50,
    desc: 'The Resume lesson covers contact info, skills, education, experiences, PDF export, and LinkedIn profiles. The "Grinders" team uses STAR format to turn weak bullet points into quantified achievements that get interviews.',
    quiz: [
      { q: 'What does STAR stand for in resume writing?',
        opts: ['Skill Task Achievement Result','Situation Task Action Result','Strong Traits and Requirements','Skills Tools Accomplishments Resume'], ans: 1,
        exp: 'STAR = Situation, Task, Action, Result — write bullets that tell a story with measurable outcomes.' },
      { q: 'Which resume bullet is strongest?',
        opts: ['Worked on website','Helped with code','Built REST API reducing load time by 40%','Did database stuff'], ans: 2,
        exp: 'Strong bullets are specific, quantified, and action-oriented with measurable impact.' },
      { q: 'What should a professional email look like?',
        opts: ['xXgamer99Xx@hotmail.com','firstname.lastname@gmail.com','cooldude@aol.com','ilovecoding@yahoo.com'], ans: 1,
        exp: 'Professional emails use your real name and a reputable provider — first.last@domain.com.' },
    ]
  },
  {
    id: 'ai', label: 'AI Dev', emoji: '🤖', color: '#a78bfa', x: 0.64,
    desc: 'AI Development covers prompt engineering, coding with AI, the SPEC framework, 4-step debugging, and the 5 security non-negotiables. The "Thinkers" team uses AI to accelerate every workflow — but knows its limits.',
    quiz: [
      { q: 'What are the 4 ingredients of a great AI prompt?',
        opts: ['Code, Test, Deploy, Review','Context, Problem, Tried, Need','Title, Body, Footer, Style','Input, Output, Model, Token'], ans: 1,
        exp: 'Great prompts: Context (what you\'re using), Problem (the issue), What You\'ve Tried, and What You Need.' },
      { q: 'Which framework is used by the "Thinkers" team to interact with Gemini?',
        opts: ['TensorFlow','PyTorch','Gemini API / Google AI SDK','OpenCV'], ans: 2,
        exp: 'The Thinkers team uses the Gemini API (Google AI SDK) to build AI-powered features into the Big Six project.' },
      { q: 'AI is best used for which task?',
        opts: ['Performing surgery','Medical diagnosis','Brainstorming and summarizing','Replacing all human judgment'], ans: 2,
        exp: 'AI excels at summarizing, brainstorming, code generation, and iteration — not replacing specialized expertise.' },
    ]
  },
  {
    id: 'analytics', label: 'Analytics', emoji: '📈', color: '#22c55e', x: 0.78,
    desc: 'Analytics covers admin dashboards, student performance metrics, sortable gradebooks, certificates, badges, LinkedIn sharing, and AI-graded free-response questions. The "Curators" team measures what matters.',
    quiz: [
      { q: 'What is the purpose of an admin analytics dashboard?',
        opts: ['Design UI colors','Track and visualize performance metrics','Write database migrations','Generate code automatically'], ans: 1,
        exp: 'Dashboards surface key metrics: class averages, top performers, modules completed, and trends.' },
      { q: 'Which format is best for sharing a certificate digitally?',
        opts: ['.txt file','.docx file','High-quality image download','Handwritten scan'], ans: 2,
        exp: 'Certificates are best as downloadable high-quality images or shared via LinkedIn integration.' },
      { q: 'What does the "Curators" analytics dashboard primarily track?',
        opts: ['Git commits per day','Student performance metrics like modules completed and scores','Server uptime','CSS color themes'], ans: 1,
        exp: 'The Curators build dashboards that track student progress, class averages, lesson completions, and top performers.' },
    ]
  },
];

/* ── Wizard NPC data ────────────────────────────────────────── */
const WIZARD = {
  label: 'Big Six Wizard',
  emoji: '🧙',
  color: '#f59e0b',
  x: 0.91,
  dialogues: [
    'Greetings, scholar! I know the secrets of all six Big Six lessons. Which would you like to explore?',
    'The path to mastery starts with a quiz. Choose your lesson, brave student!',
    'Frontend to Analytics — I\'ve seen it all. Pick a topic and test your knowledge!',
    'Six lessons, infinite wisdom. Which domain calls to you today?',
  ],
};

/* ── Player state ───────────────────────────────────────────── */
const player = { x: 40, y: 0, vx: 0, vy: 0, size: 22 };

/* ── UI state ───────────────────────────────────────────────── */
let dialogueOpen   = false;
let quizOpen       = false;
let currentNPC     = null;    // { type: 'lesson'|'wizard', data: ... }
let selectedAns    = {};      // { questionIndex: optionIndex }
let graded         = false;
let ePressed       = false;

/* ── Key map ────────────────────────────────────────────────── */
const keys = {};
document.addEventListener('keydown', e => {
  keys[e.key] = true;
  if ((e.key === 'e' || e.key === 'E') && !ePressed) {
    ePressed = true;
    handleInteract();
  }
  if (e.key === 'Escape') closeAll();
});
document.addEventListener('keyup', e => {
  keys[e.key] = false;
  if (e.key === 'e' || e.key === 'E') ePressed = false;
});

/* ═══════════════════════════════════════════════════════════
   CANVAS RENDERING
   ═══════════════════════════════════════════════════════════ */
function drawBackground() {
  const w = W(), h = H();
  ctx.fillStyle = '#070b1f';
  ctx.fillRect(0, 0, w, h);

  /* Ground strip */
  ctx.fillStyle = 'rgba(124,58,237,0.18)';
  ctx.fillRect(0, h - 28, w, 28);

  /* Horizon line */
  ctx.strokeStyle = 'rgba(76,158,255,0.08)';
  ctx.lineWidth = 1;
  ctx.setLineDash([4, 10]);
  ctx.beginPath();
  ctx.moveTo(0, h * 0.28);
  ctx.lineTo(w, h * 0.28);
  ctx.stroke();
  ctx.setLineDash([]);

  /* Stars */
  ctx.fillStyle = 'rgba(200,220,255,0.07)';
  for (let i = 0; i < 90; i++) {
    ctx.beginPath();
    ctx.arc((i * 137.5) % w, (i * 97.3) % (h * 0.26), 0.8, 0, Math.PI * 2);
    ctx.fill();
  }

  /* OSI layer labels as ambient background text */
  const layers = ['Application','Presentation','Session','Transport','Network','Data Link','Physical'];
  ctx.font = '10px monospace';
  layers.forEach((lbl, i) => {
    ctx.fillStyle = `rgba(167,139,250,0.${3 + i})`;
    ctx.fillText(lbl, w * 0.03 + i * (w * 0.136), h * 0.26);
  });
}

function drawNPCs() {
  const w = W(), h = H();
  const ground = h - 28;
  const t = Date.now();

  LESSONS.forEach((l, i) => {
    const nx  = w * l.x;
    const bob = Math.sin(t / 900 + i) * 3;
    const ny  = ground - 50 + bob;

    /* Shadow */
    ctx.fillStyle = l.color + '33';
    ctx.beginPath();
    ctx.ellipse(nx, ground - 4, 18, 5, 0, 0, Math.PI * 2);
    ctx.fill();

    /* Card */
    ctx.fillStyle   = l.color + '1a';
    ctx.strokeStyle = l.color + '66';
    ctx.lineWidth   = 1.5;
    ctx.beginPath();
    ctx.roundRect(nx - 20, ny - 34, 40, 38, 9);
    ctx.fill();
    ctx.stroke();

    /* Emoji */
    ctx.font      = '22px serif';
    ctx.textAlign = 'center';
    ctx.fillStyle = '#fff';
    ctx.fillText(l.emoji, nx, ny - 10);

    /* Label */
    ctx.font      = 'bold 9px sans-serif';
    ctx.fillStyle = l.color;
    ctx.fillText(l.label, nx, ny + 12);
  });

  /* Wizard */
  const wx  = w * WIZARD.x;
  const bob = Math.sin(t / 680) * 4;
  const wy  = ground - 50 + bob;

  ctx.fillStyle   = 'rgba(245,158,11,0.1)';
  ctx.strokeStyle = 'rgba(245,158,11,0.45)';
  ctx.lineWidth   = 1.5;
  ctx.beginPath();
  ctx.roundRect(wx - 22, wy - 38, 44, 44, 22);
  ctx.fill();
  ctx.stroke();

  ctx.font      = '26px serif';
  ctx.textAlign = 'center';
  ctx.fillText('🧙', wx, wy - 10);

  ctx.font      = 'bold 10px sans-serif';
  ctx.fillStyle = '#f59e0b';
  ctx.fillText('Wizard', wx, wy + 14);
}

function drawPlayer() {
  const h = H();
  const ground = h - 28;
  const px = player.x;
  const py = ground - 34;
  const moving = Math.abs(player.vx) > 10;
  const bob    = Math.sin(Date.now() / 200) * 2 * (moving ? 1 : 0);

  /* Shadow */
  ctx.fillStyle = 'rgba(124,58,237,0.22)';
  ctx.beginPath();
  ctx.ellipse(px, ground - 4, 12, 4, 0, 0, Math.PI * 2);
  ctx.fill();

  /* Body */
  ctx.fillStyle = '#7c3aed';
  ctx.beginPath();
  ctx.roundRect(px - 9, py + bob - 24, 18, 28, 4);
  ctx.fill();

  /* Head */
  ctx.fillStyle = '#e6eef8';
  ctx.beginPath();
  ctx.arc(px, py + bob - 30, 10, 0, Math.PI * 2);
  ctx.fill();

  /* Hair */
  ctx.fillStyle = '#7c3aed';
  ctx.beginPath();
  ctx.arc(px, py + bob - 30, 10, Math.PI, 2 * Math.PI);
  ctx.fill();

  /* Eyes */
  ctx.fillStyle = '#a78bfa';
  ctx.beginPath();
  ctx.arc(px, py + bob - 30, 4, 0, Math.PI * 2);
  ctx.fill();
}

function drawProximityHint() {
  const near = getNearbyNPC();
  if (!near || dialogueOpen || quizOpen) return;

  const w = W(), h = H();
  const nx = near.type === 'lesson' ? w * near.data.x : w * WIZARD.x;

  ctx.fillStyle = 'rgba(124,58,237,0.88)';
  ctx.beginPath();
  ctx.roundRect(nx - 24, h * 0.15, 48, 22, 7);
  ctx.fill();

  ctx.font      = 'bold 11px sans-serif';
  ctx.fillStyle = '#fff';
  ctx.textAlign = 'center';
  ctx.fillText('Press E', nx, h * 0.15 + 14);
}

/* ═══════════════════════════════════════════════════════════
   PROXIMITY DETECTION
   ═══════════════════════════════════════════════════════════ */
function getNearbyNPC() {
  const w  = W();
  const px = player.x;
  const THRESH = 44;

  for (const l of LESSONS) {
    if (Math.abs(px - w * l.x) < THRESH) return { type: 'lesson', data: l };
  }
  if (Math.abs(px - w * WIZARD.x) < THRESH) return { type: 'wizard', data: WIZARD };
  return null;
}

/* ═══════════════════════════════════════════════════════════
   INTERACTION HANDLER
   ═══════════════════════════════════════════════════════════ */
function handleInteract() {
  if (quizOpen) { closeAll(); return; }
  if (dialogueOpen) { closeDialogue(); return; }

  const near = getNearbyNPC();
  if (near) openDialogue(near);
}

/* ═══════════════════════════════════════════════════════════
   DIALOGUE SYSTEM
   ═══════════════════════════════════════════════════════════ */
function openDialogue(npc) {
  dialogueOpen = true;
  currentNPC   = npc;

  const el      = document.getElementById('dialogue');
  const nameEl  = document.getElementById('npcName');
  const textEl  = document.getElementById('npcText');
  const dots    = document.getElementById('typingDots');
  const btnQuiz = document.getElementById('btnQuiz');

  nameEl.textContent = '';
  textEl.textContent = '';
  btnQuiz.style.display = 'none';
  el.style.display = 'block';

  if (npc.type === 'lesson') {
    document.getElementById('wizardChat').style.display = 'none';
    nameEl.textContent = `${npc.data.emoji} ${npc.data.label}`;
    typeText(textEl, npc.data.desc, () => {
      btnQuiz.style.display = 'inline-block';
    });
  } else {
    /* Wizard — pure AI chatbot, no quiz picker */
    document.getElementById('wizardChat').style.display = 'block';
    document.getElementById('wizardChatHistory').innerHTML = '';
    nameEl.textContent = `${WIZARD.emoji} ${WIZARD.label}`;
    dots.style.display = 'flex';
    callGemini('Give a short in-character wizard greeting and invite the student to ask anything about the Big Six lessons.')
      .then(reply => {
        dots.style.display = 'none';
        typeText(textEl, reply);
        setTimeout(() => document.getElementById('wizardInput').focus(), 100);
      })
      .catch(() => {
        dots.style.display = 'none';
        const fallback = WIZARD.dialogues[Math.floor(Math.random() * WIZARD.dialogues.length)];
        typeText(textEl, fallback);
        setTimeout(() => document.getElementById('wizardInput').focus(), 100);
      });
  }
}

/* Typewriter effect — token cancels any in-progress animation */
let typewriterToken = 0;
function typeText(el, text, onDone) {
  const myToken = ++typewriterToken;
  el.textContent = '';
  let i = 0;
  const speed = 18;
  function tick() {
    if (typewriterToken !== myToken) return; // cancelled by newer call
    if (i < text.length) {
      el.textContent += text[i++];
      setTimeout(tick, speed);
    } else if (onDone) {
      onDone();
    }
  }
  tick();
}

function closeDialogue() {
  dialogueOpen = false;
  document.getElementById('dialogue').style.display = 'none';
}

/* ═══════════════════════════════════════════════════════════
   QUIZ SYSTEM (Enhanced)
   ═══════════════════════════════════════════════════════════ */
function openQuiz(lesson) {
  quizOpen      = true;
  selectedAns   = {};
  graded        = false;

  document.getElementById('quizTitle').textContent = `${lesson.emoji} ${lesson.label} Quiz`;
  document.getElementById('quizSub').textContent   = 'Select the best answer for each question, then press Grade.';
  document.getElementById('scoreBanner').style.display = 'none';
  document.getElementById('btnRetry').style.display    = 'none';
  document.getElementById('btnGrade').style.display    = 'inline-block';

  buildQuizDOM(lesson);
  document.getElementById('quizModal').style.display = 'block';
  closeDialogue();
}

function buildQuizDOM(lesson) {
  const container = document.getElementById('quizQuestions');
  container.innerHTML = '';

  lesson.quiz.forEach((q, qi) => {
    const block = document.createElement('div');
    block.className  = 'q-block';
    block.dataset.qi = qi;

    const qText = document.createElement('div');
    qText.className   = 'q-text';
    qText.textContent = `${qi + 1}. ${q.q}`;
    block.appendChild(qText);

    q.opts.forEach((opt, oi) => {
      const row = document.createElement('div');
      row.className  = 'opt';
      row.dataset.oi = oi;

      const radio = document.createElement('div');
      radio.className = 'opt-radio';

      const label = document.createElement('span');
      label.className   = 'opt-label';
      label.textContent = opt;

      /* "Your pick" badge (shown after grading on wrong answers) */
      const badge = document.createElement('span');
      badge.className   = 'your-pick';
      badge.textContent = 'Your pick';

      row.appendChild(radio);
      row.appendChild(label);
      row.appendChild(badge);

      row.addEventListener('click', () => {
        if (graded) return;
        selectedAns[qi] = oi;
        /* Clear siblings, mark selected */
        block.querySelectorAll('.opt').forEach(o => o.classList.remove('sel'));
        row.classList.add('sel');
      });

      block.appendChild(row);
    });

    /* Explanation (hidden until graded) */
    const exp = document.createElement('div');
    exp.className   = 'explanation';
    exp.dataset.exp = q.exp;
    block.appendChild(exp);

    container.appendChild(block);
  });
}

/* Grade the quiz — applies visual state to every option */
function gradeQuiz() {
  if (graded) return;
  graded = true;

  const lesson   = currentNPC.data;
  let score      = 0;
  const blocks   = document.getElementById('quizQuestions').querySelectorAll('.q-block');

  blocks.forEach(block => {
    const qi      = parseInt(block.dataset.qi);
    const q       = lesson.quiz[qi];
    const chosen  = selectedAns[qi];          // undefined if unanswered
    const opts    = block.querySelectorAll('.opt');

    opts.forEach(opt => {
      const oi = parseInt(opt.dataset.oi);
      opt.classList.remove('sel');             // clear hover-selection style
      opt.classList.add('locked');             // prevent further clicks

      if (oi === q.ans) {
        opt.classList.add('correct');          // always highlight the right answer green
      } else if (oi === chosen && chosen !== q.ans) {
        opt.classList.add('wrong');            // player's wrong pick → red + badge
      }
    });

    if (chosen === q.ans) score++;

    /* Show explanation under the correct answer */
    const expEl = block.querySelector('.explanation');
    expEl.textContent = q.exp;
    expEl.classList.add('show');
  });

  /* Score banner */
  const banner = document.getElementById('scoreBanner');
  banner.style.display = 'block';

  const total = lesson.quiz.length;
  if (score === total) {
    banner.className = 'perfect';
    banner.textContent = `🎉 Perfect! ${score}/${total} — Excellent work!`;
  } else if (score >= Math.ceil(total / 2)) {
    banner.className = 'good';
    banner.textContent = `📚 Good effort! ${score}/${total} — Review the explanations above.`;
  } else {
    banner.className = 'retry';
    banner.textContent = `💪 ${score}/${total} — Don't give up! Try again.`;
  }

  document.getElementById('btnGrade').style.display = 'none';
  document.getElementById('btnRetry').style.display = 'inline-block';
}

/* Retry resets the quiz DOM without closing the modal */
function retryQuiz() {
  graded = false;
  selectedAns = {};
  document.getElementById('scoreBanner').style.display = 'none';
  document.getElementById('btnRetry').style.display    = 'none';
  document.getElementById('btnGrade').style.display    = 'inline-block';
  buildQuizDOM(currentNPC.data);
}

function closeAll() {
  closeDialogue();
  quizOpen = false;
  document.getElementById('quizModal').style.display = 'none';
}

/* ═══════════════════════════════════════════════════════════
   GEMINI AI — Flask → Spring fallback (mirrors bigsix/ai/gemini.js)
   ═══════════════════════════════════════════════════════════ */
const BIG6_SYSTEM_PROMPT = `You are the Big Six Wizard, a wise and friendly guide in a CS education game.
The Big Six pillars are:
  1. Frontend — HTML, CSS, JavaScript, Tailwind, Sass, Quill editor, live preview
  2. Backend — Flask (Python), Spring Boot (Java), REST APIs, SQL, ORM, authentication
  3. Data Visualization — CRUD, @RestController, JPA, pagination, search, filtering
  4. Resume — STAR format, quantified bullets, contact info, LinkedIn, PDF export
  5. AI Dev — prompt engineering (Context/Problem/Tried/Need), security non-negotiables, Gemini API
  6. Analytics — admin dashboards, student metrics, certificates, badges, AI grading
Answer in 2-3 concise sentences. Stay in character as a wise, encouraging wizard. If the question is off-topic, gently redirect to the Big Six.`;

async function callGemini(userText) {
  const body = JSON.stringify({ text: userText, prompt: BIG6_SYSTEM_PROMPT });
  try {
    const r = await fetch('https://flask.opencodingsociety.com/api/gemini', {
      method: 'POST', credentials: 'include',
      headers: { 'Content-Type': 'application/json' }, body
    });
    if (r.ok) {
      const d = await r.json();
      if (d.success && d.text) return d.text;
    }
  } catch (_) {}
  /* Spring fallback */
  const r2 = await fetch('https://spring.opencodingsociety.com/api/chatbot/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId: 'bigsix-wizard', message: `${BIG6_SYSTEM_PROMPT}: ${userText}` })
  });
  if (!r2.ok) throw new Error('AI unavailable');
  const d2 = await r2.json();
  return d2.response || d2.text || '';
}

function appendWizardChat(role, text) {
  const el = document.getElementById('wizardChatHistory');
  const line = document.createElement('div');
  line.style.cssText = role === 'user'
    ? 'color:#a78bfa;margin-bottom:4px;'
    : 'color:#fcd34d;margin-bottom:6px;';
  line.textContent = (role === 'user' ? 'You: ' : '🧙 ') + text;
  el.appendChild(line);
  el.scrollTop = el.scrollHeight;
}

async function sendWizardMessage() {
  const input = document.getElementById('wizardInput');
  const msg = input.value.trim();
  if (!msg) return;
  input.value = '';
  appendWizardChat('user', msg);

  const sendBtn = document.getElementById('btnWizSend');
  sendBtn.disabled = true;
  sendBtn.textContent = '…';

  try {
    const reply = await callGemini(msg);
    appendWizardChat('ai', reply);
  } catch (_) {
    appendWizardChat('ai', "My crystal ball is cloudy right now — try again shortly!");
  }

  sendBtn.disabled = false;
  sendBtn.textContent = 'Ask ✦';
}

/* ── Button wiring ──────────────────────────────────────────── */
document.getElementById('closeDialogue').addEventListener('click', closeDialogue);
document.getElementById('btnClose').addEventListener('click', closeDialogue);

document.getElementById('btnQuiz').addEventListener('click', () => {
  if (currentNPC && currentNPC.type === 'lesson') openQuiz(currentNPC.data);
});

document.getElementById('btnWizSend').addEventListener('click', sendWizardMessage);
document.getElementById('wizardInput').addEventListener('keydown', e => {
  e.stopPropagation();
  if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendWizardMessage(); }
});
['keyup', 'keypress'].forEach(t =>
  document.getElementById('wizardInput').addEventListener(t, e => e.stopPropagation())
);

document.getElementById('btnCloseQuiz').addEventListener('click', () => {
  quizOpen = false;
  document.getElementById('quizModal').style.display = 'none';
});

document.getElementById('btnGrade').addEventListener('click', gradeQuiz);
document.getElementById('btnRetry').addEventListener('click', retryQuiz);

/* ═══════════════════════════════════════════════════════════
   GAME LOOP
   ═══════════════════════════════════════════════════════════ */
let lastTs = 0;

function loop(ts) {
  const dt = Math.min((ts - lastTs) / 1000, 0.05);
  lastTs = ts;

  /* Player movement — blocked while UI is open */
  if (!dialogueOpen && !quizOpen) {
    const moving = keys['a'] || keys['A'] || keys['ArrowLeft'] ||
                   keys['d'] || keys['D'] || keys['ArrowRight'];

    if (keys['a'] || keys['A'] || keys['ArrowLeft'])  { player.vx = -220; }
    else if (keys['d'] || keys['D'] || keys['ArrowRight']) { player.vx = 220;  }
    else { player.vx *= 0.72; }

    player.x = Math.max(18, Math.min(W() - 18, player.x + player.vx * dt));
  }

  ctx.clearRect(0, 0, W(), H());
  drawBackground();
  drawNPCs();
  drawProximityHint();
  drawPlayer();

  requestAnimationFrame(loop);
}

requestAnimationFrame(loop);
</script>