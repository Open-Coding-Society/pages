---
layout: post
title: Connect 4 Lesson
search_exclude: true
permalink: /connect4lesson/
---
<html lang="en">
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Connect 4 Development Lesson</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: #e2e8f0;
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
            background: #000000;
            min-height: 100vh;
        }
        .container {
            background: transparent;
            border-radius: 20px;
            padding: 2rem;
        }
        /* Navigation */
        .nav-tabs {
            display: flex;
            background: #1a202c;
            border-radius: 12px;
            padding: 8px;
            margin: 2rem 0;
            flex-wrap: wrap;
            gap: 8px;
            border: 1px solid #2d3748;
        }
        .nav-tab {
            flex: 1;
            min-width: 180px;
            padding: 12px 20px;
            border: none;
            background: transparent;
            border-radius: 8px;
            cursor: pointer;
            font-weight: 600;
            text-align: center;
            transition: all 0.3s ease;
            color: #a0aec0;
        }
        .nav-tab:hover {
            background: rgba(66, 153, 225, 0.2);
            color: #63b3ed;
        }
        .nav-tab.active {
            background: linear-gradient(135deg, #4299e1, #3182ce);
            color: white;
            box-shadow: 0 4px 12px rgba(66, 153, 225, 0.4);
        }
        /* Content sections */
        .content-section {
            display: none;
            animation: fadeIn 0.3s ease-in;
        }
        .content-section.active {
            display: block;
        }
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        /* Header */
        .lesson-header {
            text-align: center;
            padding: 2rem 0;
            background: linear-gradient(135deg, #4a5568 0%, #2d3748 100%);
            color: white;
            border-radius: 16px;
            margin-bottom: 2rem;
        }
        .lesson-header h1 {
            margin: 0;
            font-size: 2.5rem;
            font-weight: 700;
        }
        .lesson-header p {
            margin: 0.5rem 0 0 0;
            font-size: 1.2rem;
            opacity: 0.9;
        }
        /* Progress indicator */
        .progress-indicator {
            display: flex;
            justify-content: space-between;
            align-items: center;
            background: #1a202c;
            padding: 1rem 2rem;
            border-radius: 12px;
            margin: 1rem 0 2rem 0;
            border: 1px solid #2d3748;
        }
        .progress-step {
            display: flex;
            align-items: center;
            gap: 8px;
            font-weight: 600;
            color: #4a5568;
            transition: color 0.3s ease;
        }
        .progress-step.active {
            color: #63b3ed;
        }
        .progress-step.completed {
            color: #68d391;
        }
        .progress-dot {
            width: 12px;
            height: 12px;
            border-radius: 50%;
            background: #2d3748;
            transition: background 0.3s ease;
        }
        .progress-step.active .progress-dot {
            background: #4299e1;
        }
        .progress-step.completed .progress-dot {
            background: #38a169;
        }
        /* Cards and content */
        .concept-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 1.5rem;
            margin: 2rem 0;
        }
        .concept-card {
            background: linear-gradient(135deg, #1a202c, #2d3748);
            padding: 1.5rem;
            border-radius: 12px;
            border-left: 4px solid #4299e1;
            transition: transform 0.2s ease, box-shadow 0.2s ease;
            border: 1px solid #2d3748;
        }
        .concept-card:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(66, 153, 225, 0.2);
            border-color: #4299e1;
        }
        .concept-card h4 {
            margin: 0 0 0.5rem 0;
            color: #e2e8f0;
            font-size: 1.2rem;
        }
        .concept-card p {
            margin: 0;
            color: #a0aec0;
        }
        /* Challenge section */
        .challenge-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            gap: 1.5rem;
            margin: 2rem 0;
        }
        .challenge-card {
            background: #1a202c;
            border: 2px solid #2d3748;
            border-radius: 12px;
            padding: 1.5rem;
            transition: all 0.3s ease;
            position: relative;
            overflow: hidden;
        }
        .challenge-card:hover {
            border-color: #4299e1;
            transform: translateY(-4px);
            box-shadow: 0 12px 30px rgba(66, 153, 225, 0.2);
        }
        .challenge-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 4px;
            background: linear-gradient(135deg, #4299e1, #3182ce);
        }
        .challenge-card h4 {
            margin: 0 0 0.5rem 0;
            color: #e2e8f0;
            font-size: 1.1rem;
        }
        .challenge-card p {
            margin: 0 0 1rem 0;
            color: #a0aec0;
            font-size: 0.95rem;
        }
        .difficulty-badge {
            display: inline-block;
            padding: 4px 8px;
            font-size: 0.75rem;
            font-weight: 600;
            border-radius: 12px;
            margin-right: 0.5rem;
        }
        .easy { background: #c6f6d5; color: #22543d; }
        .medium { background: #fed7aa; color: #9c4221; }
        .hard { background: #feb2b2; color: #742a2a; }
        /* Code blocks */
        pre {
            background: #2d3748;
            color: #e2e8f0;
            padding: 1.5rem;
            border-radius: 8px;
            overflow-x: auto;
            font-size: 0.9rem;
            margin: 1rem 0;
        }
        code {
            background: #edf2f7;
            padding: 0.2rem 0.4rem;
            border-radius: 4px;
            font-size: 0.9em;
            color: #4a5568;
        }
        pre code {
            background: none;
            padding: 0;
            color: #e2e8f0;
        }
        .insight-box {
            background: #1a365d;
            border: 1px solid #2c5282;
            border-radius: 8px;
            padding: 1rem;
            margin: 1rem 0;
        }
        .insight-box strong {
            color: #63b3ed;
        }
        /* Update all the colored background sections to work with black theme */
        .section-dark {
            background: linear-gradient(135deg, #2d3748 0%, #1a202c 100%);
            color: #e2e8f0;
            padding: 2rem;
            border-radius: 12px;
            margin: 2rem 0;
            text-align: center;
        }
        .section-light {
            background: #1a202c;
            padding: 2rem;
            border-radius: 12px;
            margin: 2rem 0;
            border: 1px solid #2d3748;
        }
        .section-accent {
            background: #1a365d;
            border-left: 4px solid #4299e1;
            padding: 2rem;
            border-radius: 8px;
            margin: 2rem 0;
        }
        h1, h2, h3, h4 { 
            color: #e2e8f0; 
        }
        /* Update text colors throughout */
        .text-primary { color: #e2e8f0; }
        .text-secondary { color: #a0aec0; }
        .text-muted { color: #718096; }
        /* Walkthrough polishing */
        #concepts .section-dark,
        #concepts .section-light,
        #concepts .section-accent {
            padding: 1.5rem 1.75rem;
            margin: 1.5rem 0;
        }
        #concepts h3 { margin: 0 0 0.5rem 0; }
        #concepts p.text-secondary { margin: 0.25rem 0 0.75rem 0; line-height: 1.8; }
        #concepts pre { margin: 0.75rem 0 0.5rem 0; }
        #concepts ul { margin: 0.25rem 0 0.5rem 1rem; }
        #concepts li { margin: 0.15rem 0; }
        /* Responsive design */
        @media (max-width: 768px) {
            .nav-tabs {
                flex-direction: column;
            }
            .nav-tab {
                min-width: auto;
            }
            .progress-indicator {
                flex-direction: column;
                gap: 1rem;
            }
        }
    </style>
    <div class="container">
        <div class="lesson-header">
            <h1>🎯 Connect 4 Development Mastery</h1>
            <p>Build a complete game while learning essential programming concepts</p>
        </div>
        <div class="progress-indicator">
            <div class="progress-step" data-step="overview">
                <div class="progress-dot"></div>
                <span>Overview</span>
            </div>
            <div class="progress-step" data-step="hands-on">
                <div class="progress-dot"></div>
                <span>Hands-On</span>
            </div>
            <div class="progress-step" data-step="concepts">
                <div class="progress-dot"></div>
                <span>Build It</span>
            </div>
            <div class="progress-step" data-step="oop">
                <div class="progress-dot"></div>
                <span>OOP Intro</span>
            </div>
            <div class="progress-step" data-step="challenges">
                <div class="progress-dot"></div>
                <span>Change It</span>
            </div>
        </div>
        <nav class="nav-tabs">
            <button class="nav-tab active" data-section="overview">
                📋 What You'll Learn
            </button>
            <button class="nav-tab" data-section="hands-on">
                🎮 Play & Explore
            </button>
            <button class="nav-tab" data-section="concepts">
                🧭 Walkthrough
            </button>
            <button class="nav-tab" data-section="oop">
                🏗️ OOP Explained
            </button>
            <button class="nav-tab" data-section="challenges">
                🚀 Build Challenges
            </button>
        </nav>
        <!-- Overview Section -->
        <section id="overview" class="content-section active">
            <h2>🎯 Learning Journey Overview</h2>
            <div style="background: linear-gradient(135deg, #2d3748 0%, #1a202c 100%); color: #e2e8f0; padding: 2rem; border-radius: 12px; margin: 2rem 0; text-align: center;">
                <h3 style="margin: 0 0 1rem 0;">Why Connect 4?</h3>
                <p style="margin: 0; font-size: 1.1rem;">Connect 4 is the perfect learning project because it combines essential programming concepts in a familiar, engaging format. You'll master real-world development skills while building something fun!</p>
            </div>
            <div class="concept-grid">
                <div class="concept-card">
                    <h4>🧠 State Management</h4>
                    <p>Learn how applications track and update multiple pieces of information simultaneously - player turns, game board, timers, and win conditions.</p>
                </div>
                <div class="concept-card">
                    <h4>🎨 Layout Systems</h4>
                    <p>Master CSS Grid to create responsive, professional-looking game boards and user interfaces that work on any device.</p>
                </div>
                <div class="concept-card">
                    <h4>✨ Animation & Timing</h4>
                    <p>Coordinate smooth animations with game logic using modern CSS transitions and JavaScript promises.</p>
                </div>
                <div class="concept-card">
                    <h4>🏆 Algorithm Design</h4>
                    <p>Build efficient win-detection algorithms that check patterns in 2D arrays - skills that transfer to many programming challenges.</p>
                </div>
                <div class="concept-card">
                    <h4>🎮 Event-Driven Programming</h4>
                    <p>Handle user interactions, timer events, and game state changes in a coordinated, responsive system.</p>
                </div>
                <div class="concept-card">
                    <h4>🔄 Game Loop Architecture</h4>
                    <p>Understand the fundamental pattern behind all interactive applications - initialization, input handling, state updates, and rendering.</p>
                </div>
            </div>
            <div class="section-light">
                <h3 style="margin:0 0 .5rem 0; color:#e2e8f0;">What You'll Do</h3>
                <ul class="text-secondary" style="margin:0; padding-left:1.2rem; line-height:1.8;">
                    <li>Play a polished Connect 4 built with HTML/CSS/JS</li>
                    <li>Understand game state, grid logic, and event handling</li>
                    <li>Add animations and a win-check algorithm</li>
                    <li>Enhance UX with timers, restart, and challenges</li>
                </ul>
            </div>
                <div style="background: #1a365d; border-left: 4px solid #4299e1; padding: 2rem; border-radius: 8px; margin: 2rem 0;">
                    <h3 style="margin: 0 0 1rem 0; color: #63b3ed;">🎯 Learning Path</h3>
                <ol style="color: #a0aec0; line-height: 1.8;">
                    <li><strong style="color: #e2e8f0;">Play & Explore:</strong> Experience the game mechanics firsthand to understand what you're building</li>
                    <li><strong style="color: #e2e8f0;">Analyze Concepts:</strong> Break down the code architecture and understand how each piece works</li>
                    <li><strong style="color: #e2e8f0;">Build Features:</strong> Apply your knowledge by implementing new features and improvements</li>
                    <li><strong style="color: #e2e8f0;">Extend & Customize:</strong> Make it your own with personal touches and advanced features</li>
                </ol>
            </div>
        </section>
        <!-- Hands-On Section -->
        <section id="hands-on" class="content-section">
            <h2>🎮 Hands-On Exploration</h2>
            <div style="background: linear-gradient(135deg, #2d3748 0%, #1a202c 100%); color: #e2e8f0; padding: 2rem; border-radius: 12px; margin: 2rem 0; text-align: center;">
                <h3 style="margin: 0 0 1rem 0;">Experience Before You Code</h3>
                <p style="margin: 0; font-size: 1.1rem;">The best way to understand what you're building is to use it first. Play Connect 4, notice the details, and think like both a user and a developer.</p>
            </div>
            <div style="background: #1a202c; padding: 2rem; border-radius: 12px; margin: 2rem 0; border: 1px solid #2d3748;">
                <h3 style="color: #e2e8f0;">🔍 Developer's Eye Checklist</h3>
                <p style="margin-bottom: 1.5rem; color: #a0aec0;">As you play, pay attention to these technical details:</p>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem;">
                    <div>
                        <h4 style="color: #e2e8f0; margin-bottom: 0.5rem;">🎯 Game Flow</h4>
                        <ul style="color: #a0aec0; line-height: 1.6;">
                            <li>How does player switching work?</li>
                            <li>What happens when you click invalid areas?</li>
                            <li>How does the timer affect gameplay?</li>
                            <li>When does the game end?</li>
                        </ul>
                    </div>
                    <div>
                        <h4 style="color: #e2e8f0; margin-bottom: 0.5rem;">✨ Visual Feedback</h4>
                        <ul style="color: #a0aec0; line-height: 1.6;">
                            <li>How smooth is the piece-dropping animation?</li>
                            <li>What visual cues show whose turn it is?</li>
                            <li>How are wins displayed?</li>
                            <li>What UI elements update automatically?</li>
                        </ul>
                    </div>
                </div>
            </div>
            <div style="background: #1a365d; border: 1px solid #2c5282; border-radius: 8px; padding: 1rem; margin: 1rem 0;">
                <strong style="color: #63b3ed;">💡 Pro Tip:</strong> 
                <span style="color: #a0aec0;">Try to break the game! Click rapidly, try invalid moves, let the timer run out. Understanding edge cases is crucial for building robust applications.</span>
            </div>
            <!-- Embedded Connect 4 from index.md -->
            <div id="app" class="wrap">
              <!-- Start Screen -->
              <section id="start" class="card center">
                <h1 class="title">Connect 4</h1>
                <p class="muted">Choose a timer per player</p>
                <div class="row">
                  <button class="btn" data-time="180">3 Minutes</button>
                  <button class="btn" data-time="300">5 Minutes</button>
                  <button class="btn" data-time="600">10 Minutes</button>
                </div>
                <p class="press">…or press <kbd>Enter</kbd> to start with 5:00</p>
              </section>
              <!-- Game Screen - Board Overlay -->
              <section id="game" class="hidden game-overlay">
                <div class="hud">
                  <!-- Red panel -->
                  <div class="panel red-side">
                    <h2>Red</h2>
                    <div class="timer" id="tRed">05:00</div>
                    <div class="stash">
                      <div class="dot red"></div>
                      <span>Coins: <b id="cRed">21</b></span>
                    </div>
                  </div>
                  <!-- Board -->
                  <div id="boardWrap">
                    <div id="board"></div>
                    <!-- falling coin overlay -->
                    <div id="fall" class="coin hidden"></div>
                  </div>
                  <!-- Yellow panel -->
                  <div class="panel yellow-side">
                    <h2>Yellow</h2>
                    <div class="timer" id="tYellow">05:00</div>
                    <div class="stash">
                      <div class="dot yellow"></div>
                      <span>Coins: <b id="cYellow">21</b></span>
                    </div>
                  </div>
                </div>
                <br><br><br>
                <div class="row center">
                  <button id="restart" class="btn danger">Restart</button>
                </div>
              </section>
            </div>
            <style>
              :root{
                --bg:#0f0f10;
                --card:#17181c;
                --muted:#a9b0be;
                --blue:#1658e5;
                --red:#ef4444;
                --yellow:#facc15;
                --cell:76px;      /* cell size */
                --gap:12px;       /* hole spacing */
                --radius:50%;
                --boardPad:18px;
                --boardCols:7;
                --boardRows:6;
              }
              *{box-sizing:border-box}
              .wrap{
                min-height:100vh; display:flex; align-items:center; justify-content:center;
                background:var(--bg); color:#fff; font-family:system-ui,Segoe UI,Roboto,Inter,Arial;
                padding:24px; position: relative;
              }
              .hidden{display:none}
              .center{justify-content:center; text-align:center}
              .row{display:flex; gap:12px; align-items:center; flex-wrap:wrap}
              .card{ background:var(--card); padding:28px; border-radius:18px; box-shadow:0 10px 30px #0006; width:min(720px,95vw); }
              .title{font-size:42px; margin:0 0 8px}
              .muted{color:var(--muted); margin:0 0 18px}
              .press{color:var(--muted); margin-top:14px; font-size:14px}
              kbd{background:#222; padding:2px 6px; border-radius:6px; border:1px solid #333}
              .btn{ background:#2b2f3a; border:1px solid #3a4151; color:#fff; padding:10px 16px; border-radius:12px; cursor:pointer; font-weight:600; transition:transform .06s ease, background .2s, border .2s; }
              .btn:hover{transform:translateY(-1px); background:#323849}
              .btn:active{transform:translateY(0)}
              .btn.danger{background:#b71c1c; border-color:#c72a2a}
              .btn.danger:hover{background:#d32626}
              /* Game Overlay */
              .game-overlay{ position: fixed; top:0; left:0; width:100vw; height:100vh; background: var(--bg); z-index:1000; display:flex; flex-direction:column; align-items:center; justify-content:center; padding:24px; }
              .game-overlay.hidden{ display:none; }
              .hud{display:grid; grid-template-columns:1fr auto 1fr; gap:18px; align-items:center}
              .panel{ background:#14161b; border:1px solid #272c38; border-radius:16px; padding:16px; display:flex; flex-direction:column; align-items:center; gap:10px; min-width:160px; }
              .panel h2{margin:0; letter-spacing:.5px}
              .red-side h2{color:var(--red)} .yellow-side h2{color:#f4d34a}
              .timer{font-size:38px; font-variant-numeric:tabular-nums}
              .stash{display:flex; align-items:center; gap:10px; color:#d6dbe6}
              .dot{width:18px; height:18px; border-radius:50%}
              .red{background:var(--red)} .yellow{background:var(--yellow)}
              #boardWrap{position:relative; padding:var(--boardPad); background:var(--blue); border-radius:22px; box-shadow:inset 0 0 0 6px #0e3ea3, 0 12px 24px #0007}
              #board{ display:grid; gap:var(--gap); grid-template-columns:repeat(var(--boardCols), var(--cell)); grid-template-rows:repeat(var(--boardRows), var(--cell)); }
              #board .hole{ width:var(--cell); height:var(--cell); border-radius:var(--radius); background:#f1f5f9; position:relative; overflow:hidden; box-shadow:inset 0 0 0 6px #0e3ea3; cursor:pointer; transition:filter .2s; }
              #board .hole:hover{filter:brightness(0.95)}
              #board .hole.filled::after{ content:""; position:absolute; inset:0; border-radius:var(--radius); }
              #board .hole.red::after{background:var(--red)}
              #board .hole.yellow::after{background:var(--yellow)}
              .coin{ position:absolute; width:var(--cell); height:var(--cell); border-radius:50%; left:0; top:0; transform:translate(0,-100%); background:var(--red); box-shadow:0 12px 24px #0007; transition: transform .18s ease; }
              .coin.yellow{background:var(--yellow)}
              .win-overlay{ position: fixed; inset: 0; background: rgba(0,0,0,0.7); display: grid; place-items: center; z-index: 2000; animation: fadeIn 0.2s ease-out; }
              .win-card{ background: #1b1f2a; padding: 28px; border-radius: 16px; min-width: 280px; text-align: center; box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5); transform: scale(0.9); animation: popIn 0.4s ease-out 0.1s forwards; border: 2px solid #3a4151; }
              .win-title{ font-size: 36px; margin: 0 0 24px; color: #fff; text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3); }
              .win-btn{ font-size: 18px; padding: 12px 24px; background: var(--blue); border-color: #1658e5; }
              .win-btn:hover{ background: #1d6bf0; }
              @keyframes fadeIn{ from{ opacity: 0; } to{ opacity: 1; } }
              @keyframes popIn{ from{ transform: scale(0.8); opacity: 0; } to{ transform: scale(1); opacity: 1; } }
            </style>
            <script>
            (() => {
              // Elements
              const start = document.getElementById('start');
              const game  = document.getElementById('game');
              const boardEl = document.getElementById('board');
              const fallEl  = document.getElementById('fall');
              const tRedEl = document.getElementById('tRed');
              const tYellowEl = document.getElementById('tYellow');
              const cRedEl = document.getElementById('cRed');
              const cYellowEl = document.getElementById('cYellow');
              const restartBtn = document.getElementById('restart');
              const ROWS = 6, COLS = 7, MAX_COINS = 21;
              let board, player, redTime, yellowTime, tick, redCoins, yellowCoins, running, animating;
              const fmt = s => { const m = Math.floor(s/60), r = s % 60; return `${String(m).padStart(2,'0')}:${String(r).padStart(2,'0')}`; };
              const cellPx = () => parseInt(getComputedStyle(document.documentElement).getPropertyValue('--cell'));
              const gapPx  = () => parseInt(getComputedStyle(document.documentElement).getPropertyValue('--gap'));
              const boardPad = () => parseInt(getComputedStyle(document.documentElement).getPropertyValue('--boardPad'));
              function drawEmptyBoard(){ boardEl.innerHTML=''; for(let r=0;r<ROWS;r++){ for(let c=0;c<COLS;c++){ const d=document.createElement('div'); d.className='hole'; d.dataset.col=c; boardEl.appendChild(d);} } }
              function paint(){ [...boardEl.children].forEach((el,i)=>{ const r=Math.floor(i/COLS), c=i%COLS; el.classList.remove('filled','red','yellow'); const v=board[r][c]; if(v){ el.classList.add('filled',v); } }); cRedEl.textContent=redCoins; cYellowEl.textContent=yellowCoins; tRedEl.textContent=fmt(redTime); tYellowEl.textContent=fmt(yellowTime); }
              function landingRow(col){ for(let r=ROWS-1;r>=0;r--) if(!board[r][col]) return r; return -1; }
              async function dropAnimated(col,row,color){
                animating = true;
                const size=cellPx(), gap=gapPx(), pad=boardPad();
                const x = pad + col*(size+gap); const y = pad + row*(size+gap);
                fallEl.className = `coin ${color}`; fallEl.style.left = x+'px'; fallEl.style.transform = `translate(0,-100%)`; fallEl.classList.remove('hidden');
                void fallEl.offsetWidth; // reflow
                fallEl.style.transitionDuration = `${Math.min(120 + row*120, 520)}ms`;
                fallEl.style.transform = `translate(0, ${y}px)`;
                await new Promise(res=>{ const done=()=>{ fallEl.removeEventListener('transitionend',done); res(); }; fallEl.addEventListener('transitionend',done,{once:true}); });
                fallEl.classList.add('hidden'); board[row][col]=color; paint(); animating=false;
              }
              function checkWin(r,c){ const color = board[r][c]; const dirs=[[1,0],[0,1],[1,1],[1,-1]]; for(const [dr,dc] of dirs){ let count=1; for(const sign of [-1,1]){ let rr=r+dr*sign, cc=c+dc*sign; while(board[rr] && board[rr][cc]===color){ count++; rr+=dr*sign; cc+=dc*sign; } } if(count>=4) return true; } return false; }
              function boardFull(){ return board.every(row=>row.every(v=>v)); }
              function endGame(msg){ running=false; clearInterval(tick); showWinMessage(msg); }
              function showWinMessage(msg){ const winOverlay=document.createElement('div'); winOverlay.className='win-overlay'; winOverlay.innerHTML=`<div class="win-card"><h2 class="win-title">${msg}</h2><button class="btn win-btn" onclick="this.parentElement.parentElement.remove()">Continue</button></div>`; document.body.appendChild(winOverlay); }
              function switchTurn(){ player = (player==='red') ? 'yellow' : 'red'; }
              function startTimers(){ clearInterval(tick); tick=setInterval(()=>{ if(!running) return; if(player==='red'){ redTime--; if(redTime<0){ endGame('Yellow wins on time!'); } } else { yellowTime--; if(yellowTime<0){ endGame('Red wins on time!'); } } tRedEl.textContent=fmt(Math.max(0,redTime)); tYellowEl.textContent=fmt(Math.max(0,yellowTime)); },1000); }
              boardEl.addEventListener('click', async (e)=>{ const target=e.target.closest('.hole'); if(!target||!running||animating) return; const col=+target.dataset.col; const row=landingRow(col); if(row<0) return; if(player==='red'&&redCoins<=0) return; if(player==='yellow'&&yellowCoins<=0) return; if(player==='red') redCoins--; else yellowCoins--; await dropAnimated(col,row,player); if(checkWin(row,col)){ endGame(`${player[0].toUpperCase()+player.slice(1)} wins!`); return; } if(boardFull()){ endGame('Draw!'); return; } switchTurn(); });
              function startGame(seconds){ start.classList.add('hidden'); game.classList.remove('hidden'); board=Array.from({length:ROWS},()=>Array(COLS).fill(null)); player='red'; redTime=yellowTime=seconds; redCoins=yellowCoins=MAX_COINS; running=true; animating=false; drawEmptyBoard(); paint(); startTimers(); }
              start.querySelectorAll('.btn').forEach(b=>{ b.addEventListener('click', ()=>startGame(+b.dataset.time)); });
              window.addEventListener('keydown',(e)=>{ if(!game.classList.contains('hidden')||e.key!=='Enter') return; startGame(300); });
              restartBtn.addEventListener('click', ()=>{ clearInterval(tick); game.classList.add('hidden'); start.classList.remove('hidden'); });
            })();
            </script>
        </section>
        <!-- Walkthrough Section -->
        <section id="concepts" class="content-section">
            <h2>🧭 Step-by-Step Walkthrough</h2>
            <div class="section-dark">
                <h3 style="margin:0 0 .5rem 0;">Goal</h3>
                <p class="text-secondary" style="margin:0;">Build a simple, working Connect 4. We’ll explain every piece and tell you exactly where code goes. No prior experience required.</p>
            </div>
            <div class="section-accent">
                <h3 style="margin:0 0 .5rem 0;">Where Your Code Lives</h3>
                <ul class="text-secondary" style="margin:0; padding-left:1.2rem; line-height:1.8;">
                    <li><b>HTML</b>: already in Play & Explore (the game UI).</li>
                    <li><b>CSS</b>: the game’s styles are in a <code>&lt;style&gt;</code> block right under the UI.</li>
                    <li><b>JavaScript</b>: behavior is inside a <code>&lt;script&gt;</code> at the end. You’ll add functions there.</li>
                </ul>
            </div>
            <div class="section-light">
                <h3 style="margin-top:0">1) Make a Board (HTML)</h3>
                <p class="text-secondary">The board is a grid of holes. In HTML we use a <code>&lt;div id="board"&gt;</code> and fill it with smaller <code>&lt;div class="hole"&gt;</code> elements.</p>
<pre><code>&lt;!-- Inside the Play &amp; Explore game UI --&gt;
&lt;div id="boardWrap"&gt;
  &lt;div id="board"&gt;&lt;/div&gt;
  &lt;div id="fall" class="coin hidden"&gt;&lt;/div&gt;
&lt;/div&gt;</code></pre>
                <p class="text-secondary"><b>What it does:</b> empty containers that we’ll fill from JavaScript.</p>
            </div>
            <div class="section-light">
                <h3 style="margin-top:0">2) Remember Game State (JS)</h3>
                <p class="text-secondary">State is just variables that store what’s happening.</p>
<pre><code>const ROWS = 6, COLS = 7, MAX_COINS = 21;
let board, player, redTime, yellowTime, redCoins, yellowCoins, running, animating;</code></pre>
                <p class="text-secondary"><b>Where:</b> put this at the top of the game <code>&lt;script&gt;</code> block.</p>
            </div>
            <div class="section-light">
                <h3 style="margin-top:0">3) Draw the Board (JS)</h3>
                <p class="text-secondary">Create 6 × 7 holes in the HTML so we can click them.</p>
<pre><code>function drawEmptyBoard(){
  boardEl.innerHTML = '';
  for(let r=0; r&lt;ROWS; r++){
    for(let c=0; c&lt;COLS; c++){
      const d = document.createElement('div');
      d.className = 'hole';
      d.dataset.col = c;      // remember which column it is
      boardEl.appendChild(d);
    }
  }
}</code></pre>
                <p class="text-secondary"><b>What it does:</b> builds clickable holes you see on screen.</p>
            </div>
            <div class="section-light">
                <h3 style="margin-top:0">4) Drop Logic (JS)</h3>
                <p class="text-secondary">Find the lowest empty row in a column.</p>
<pre><code>function landingRow(col){
  for(let r = ROWS-1; r &gt;= 0; r--) if(!board[r][col]) return r;
  return -1; // column is full
}</code></pre>
                <p class="text-secondary"><b>Why:</b> tokens fall to the lowest available spot.</p>
            </div>
            <div class="section-light">
                <h3 style="margin-top:0">5) Paint the Board (JS)</h3>
                <p class="text-secondary">Show tokens on screen based on what’s in <code>board</code>.</p>
<pre><code>function paint(){
  [...boardEl.children].forEach((el, i) =&gt; {
    const r = Math.floor(i / COLS), c = i % COLS;
    el.classList.remove('filled','red','yellow');
    const v = board[r][c];
    if(v) el.classList.add('filled', v);
  });
  // also update timers and coin counts if you have them
}</code></pre>
                <p class="text-secondary"><b>Tip:</b> classes like <code>red</code> / <code>yellow</code> color the holes with CSS.</p>
            </div>
            <div class="section-light">
                <h3 style="margin-top:0">6) Handle Clicks (JS)</h3>
                <p class="text-secondary">When you click a column, compute the landing row and place a token.</p>
<pre><code>boardEl.addEventListener('click', (e) =&gt; {
  const hole = e.target.closest('.hole');
  if(!hole || !running) return;
  const col = +hole.dataset.col;
  const row = landingRow(col);
  if(row &lt; 0) return;           // column full
  board[row][col] = player;     // place token in memory
  paint();                      // show it
  // switch player here (red &lt;-&gt; yellow)
});</code></pre>
                <p class="text-secondary"><b>Beginner note:</b> <code>dataset.col</code> gives you the column number we stored earlier.</p>
            </div>
            <div class="section-light">
                <h3 style="margin-top:0">7) Winning Lines (JS)</h3>
                <p class="text-secondary">Check 4 in a row in 4 directions: horizontal, vertical, and 2 diagonals.</p>
<pre><code>function checkWin(r,c){
  const color = board[r][c];
  const dirs = [[1,0],[0,1],[1,1],[1,-1]];
  for(const [dr,dc] of dirs){
    let count = 1;
    for(const sign of [-1,1]){
      let rr=r+dr*sign, cc=c+dc*sign;
      while(board[rr] &amp;&amp; board[rr][cc]===color){ count++; rr+=dr*sign; cc+=dc*sign; }
    }
    if(count &gt;= 4) return true;
  }
  return false;
}</code></pre>
                <p class="text-secondary"><b>What it does:</b> counts same‑color neighbors on both sides.</p>
            </div>
            <div class="section-light">
                <h3 style="margin-top:0">8) Start/Restart (JS)</h3>
                <p class="text-secondary">Create a new empty board and show the game screen.</p>
<pre><code>function startGame(seconds){
  board = Array.from({length: ROWS}, () =&gt; Array(COLS).fill(null));
  player = 'red'; running = true;  // set defaults
  drawEmptyBoard(); paint();
}</code></pre>
                <p class="text-secondary"><b>Try it:</b> call <code>startGame(300)</code> to begin a 5‑minute game (timers are optional).</p>
            </div>
            <div class="section-accent">
                <h3 style="margin:0 0 .5rem 0;">You've Got This</h3>
                <ul class="text-secondary" style="margin:0; padding-left:1.2rem; line-height:1.8;">
                    <li>If something doesn't show up, add a <code>console.log()</code> in your function to see what's happening.</li>
                    <li>Build in small steps: draw the board → place one token → then add win checks.</li>
                    <li>Open Play & Explore and compare with your code as you go.</li>
                </ul>
            </div>
            <div class="section-dark">
                <h3 style="margin:0 0 .5rem 0;">🏗️ Object-Oriented Programming (OOP)</h3>
                <p class="text-secondary" style="margin:0.25rem 0 0.75rem 0;">The current Connect 4 uses <strong>procedural programming</strong> (functions + global variables). Let's explore how <strong>Object-Oriented Programming</strong> organizes code differently.</p>
            </div>
            <div class="section-light">
                <h3 style="margin-top:0">What is OOP?</h3>
                <p class="text-secondary">OOP organizes code into <strong>classes</strong> (blueprints) and <strong>objects</strong> (instances). Instead of scattered functions and variables, you group related data and behavior together.</p>
<pre><code>// Current approach: scattered variables and functions
let board, player, redTime, yellowTime;
function startGame() { ... }
function checkWin() { ... }

// OOP approach: organized into classes
class Connect4Game {
  constructor() {
    this.board = [];
    this.currentPlayer = 'red';
    this.timers = { red: 300, yellow: 300 };
  }
  startGame() { ... }
  checkWin() { ... }
}</code></pre>
            </div>
            <div class="section-light">
                <h3 style="margin-top:0">OOP in Connect 4: Class Design</h3>
                <p class="text-secondary">Here's how our Connect 4 could be structured with classes:</p>
<pre><code>class Player {
  constructor(name, color) {
    this.name = name;
    this.color = color;
    this.timeLeft = 300;
    this.coinsLeft = 21;
  }
}

class GameBoard {
  constructor(rows = 6, cols = 7) {
    this.rows = rows;
    this.cols = cols;
    this.grid = Array.from({length: rows}, () => Array(cols).fill(null));
  }
  
  dropPiece(col, color) { /* find landing spot and place */ }
  checkWin(row, col) { /* check 4 in a row */ }
  isFull() { /* check if board is full */ }
}

class Connect4Game {
  constructor() {
    this.board = new GameBoard();
    this.players = [new Player('Red', 'red'), new Player('Yellow', 'yellow')];
    this.currentPlayerIndex = 0;
    this.gameRunning = false;
  }
  
  startGame() { /* initialize game state */ }
  makeMove(col) { /* handle player move */ }
  switchPlayer() { /* toggle current player */ }
}</code></pre>
            </div>
            <div class="section-light">
                <h3 style="margin-top:0">Benefits of OOP Structure</h3>
                <ul class="text-secondary" style="margin:0.25rem 0 0.75rem 1rem; line-height:1.8;">
                    <li><strong>Encapsulation:</strong> Player data (time, coins) stays together in the Player class</li>
                    <li><strong>Single Responsibility:</strong> GameBoard only handles board logic, Player only handles player data</li>
                    <li><strong>Reusability:</strong> Want a different board size? Just <code>new GameBoard(8, 8)</code></li>
                    <li><strong>Easier Testing:</strong> Test each class independently</li>
                    <li><strong>Scalability:</strong> Adding features like AI players or multiplayer becomes cleaner</li>
                </ul>
            </div>
            <div class="section-accent">
                <h3 style="margin:0 0 .5rem 0;">OOP vs Procedural: When to Use Which?</h3>
                <ul class="text-secondary" style="margin:0; padding-left:1.2rem; line-height:1.8;">
                    <li><strong>Procedural (current):</strong> Great for simple scripts, quick prototypes, linear workflows</li>
                    <li><strong>OOP:</strong> Better for complex applications, team projects, code that needs to grow</li>
                    <li><strong>Real World:</strong> Most large applications use OOP or functional programming with objects</li>
                    <li><strong>Learning:</strong> Understanding both approaches makes you a more versatile developer</li>
                </ul>
            </div>
        </section>
        <!-- OOP Section -->
        <section id="oop" class="content-section">
            <h2>🏗️ Object-Oriented Programming Explained</h2>
            <div class="section-dark">
                <h3 style="margin:0 0 .5rem 0;">What is Object-Oriented Programming?</h3>
                <p class="text-secondary" style="margin:0;">Think of your bedroom. Instead of throwing clothes, books, and electronics everywhere, you organize them: clothes in the closet, books on shelves, electronics on your desk. Each "container" holds related items and has specific purposes. OOP does the same thing with code!</p>
            </div>
            <div class="section-light">
                <h3 style="margin-top:0">🚗 Real-World Example: Cars</h3>
                <p class="text-secondary">Every car has the same basic blueprint, but each individual car is unique:</p>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem; margin: 1rem 0;">
                    <div>
                        <h4 style="color: #e2e8f0; margin-bottom: 0.5rem;">🏭 The Blueprint (Class)</h4>
                        <ul style="color: #a0aec0; line-height: 1.6; font-size: 0.9rem;">
                            <li>Has 4 wheels</li>
                            <li>Has an engine</li>
                            <li>Can start/stop</li>
                            <li>Can accelerate/brake</li>
                            <li>Has a color (to be decided)</li>
                        </ul>
                    </div>
                    <div>
                        <h4 style="color: #e2e8f0; margin-bottom: 0.5rem;">🚙 Actual Cars (Objects)</h4>
                        <ul style="color: #a0aec0; line-height: 1.6; font-size: 0.9rem;">
                            <li>Your red Honda Civic</li>
                            <li>Your friend's blue Tesla</li>
                            <li>Your neighbor's white truck</li>
                            <li>Each has unique properties</li>
                            <li>But all work the same way</li>
                        </ul>
                    </div>
                </div>
<pre><code>// The blueprint for making cars
class Car {
  constructor(color, brand) {
    this.color = color;       // Each car has its own color
    this.brand = brand;       // Each car has its own brand  
    this.speed = 0;           // All cars start at 0 speed
    this.isRunning = false;   // All cars start turned off
  }
  
  start() {                   // All cars can start
    this.isRunning = true;
    console.log(`${this.color} ${this.brand} started!`);
  }
  
  accelerate() {              // All cars can speed up
    if (this.isRunning) {
      this.speed += 10;
      console.log(`Now going ${this.speed} mph`);
    }
  }
}

// Making actual cars from the blueprint
const myCar = new Car('red', 'Honda');     // Creates MY car
const yourCar = new Car('blue', 'Tesla');  // Creates YOUR car

myCar.start();        // Only MY car starts
yourCar.accelerate(); // Only YOUR car speeds up</code></pre>
            </div>
            <div class="section-light">
                <h3 style="margin-top:0">📚 The Four Pillars of OOP</h3>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1.5rem; margin: 1rem 0;">
                    <div style="background: #1a365d; padding: 1rem; border-radius: 8px; border-left: 4px solid #4299e1;">
                        <h4 style="color: #63b3ed; margin: 0 0 0.5rem 0;">🔒 Encapsulation</h4>
                        <p style="color: #a0aec0; margin: 0; font-size: 0.9rem;">Keep related data and functions together. A car's speed belongs WITH the car, not floating around somewhere else.</p>
                    </div>
                    <div style="background: #1a365d; padding: 1rem; border-radius: 8px; border-left: 4px solid #4299e1;">
                        <h4 style="color: #63b3ed; margin: 0 0 0.5rem 0;">👨‍👩‍👧‍👦 Inheritance</h4>
                        <p style="color: #a0aec0; margin: 0; font-size: 0.9rem;">Create specialized versions. A SportsCar inherits from Car but adds turbo() method.</p>
                    </div>
                    <div style="background: #1a365d; padding: 1rem; border-radius: 8px; border-left: 4px solid #4299e1;">
                        <h4 style="color: #63b3ed; margin: 0 0 0.5rem 0;">🎭 Polymorphism</h4>
                        <p style="color: #a0aec0; margin: 0; font-size: 0.9rem;">Same action, different results. car.start() works for Honda, Tesla, or truck, but each starts differently.</p>
                    </div>
                    <div style="background: #1a365d; padding: 1rem; border-radius: 8px; border-left: 4px solid #4299e1;">
                        <h4 style="color: #63b3ed; margin: 0 0 0.5rem 0;">🔍 Abstraction</h4>
                        <p style="color: #a0aec0; margin: 0; font-size: 0.9rem;">Hide complexity. You call car.start() without knowing about spark plugs, fuel injection, etc.</p>
                    </div>
                </div>
            </div>
            <div class="section-accent">
                <h3 style="margin:0 0 .5rem 0;">🤔 Why Is This Better?</h3>
                <p class="text-secondary" style="margin:0.25rem 0 0.75rem 0;">Compare the two approaches:</p>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem;">
                    <div>
                        <h4 style="color: #e2e8f0; margin-bottom: 0.5rem;">❌ Procedural Problems</h4>
                        <ul style="color: #a0aec0; line-height: 1.6; font-size: 0.9rem;">
                            <li>Hard to track what affects what</li>
                            <li>Can't easily have multiple games</li>
                            <li>Functions scattered everywhere</li>
                            <li>Global variables can be changed anywhere</li>
                            <li>Adding features gets messy</li>
                        </ul>
                    </div>
                    <div>
                        <h4 style="color: #e2e8f0; margin-bottom: 0.5rem;">✅ OOP Benefits</h4>
                        <ul style="color: #a0aec0; line-height: 1.6; font-size: 0.9rem;">
                            <li>Everything is organized and contained</li>
                            <li>Easy to create multiple games: <code>new Connect4Game()</code></li>
                            <li>Related functions stay with their data</li>
                            <li>Can't accidentally mess up other game's data</li>
                            <li>Adding features is cleaner and safer</li>
                        </ul>
                    </div>
                </div>
            </div>
            <div class="section-light">
                <h3 style="margin-top:0">🧠 Step-by-Step Thinking Process</h3>
                <p class="text-secondary">When designing OOP, ask yourself these questions:</p>
                <div style="background: #1a365d; padding: 1.5rem; border-radius: 8px; margin: 1rem 0;">
                    <h4 style="color: #63b3ed; margin: 0 0 1rem 0;">1️⃣ What "things" exist in my program?</h4>
                    <p style="color: #a0aec0; margin: 0;">For Connect 4: <em>Players, Game Board, The Game itself, maybe Timer</em></p>
                </div>
                <div style="background: #1a365d; padding: 1.5rem; border-radius: 8px; margin: 1rem 0;">
                    <h4 style="color: #63b3ed; margin: 0 0 1rem 0;">2️⃣ What does each "thing" know about itself?</h4>
                    <p style="color: #a0aec0; margin: 0;">Player knows: <em>name, color, time left, coins left</em><br>
                    Board knows: <em>size, which spots are filled</em><br>
                    Game knows: <em>current player, if game is running</em></p>
                </div>
                <div style="background: #1a365d; padding: 1.5rem; border-radius: 8px; margin: 1rem 0;">
                    <h4 style="color: #63b3ed; margin: 0 0 1rem 0;">3️⃣ What can each "thing" do?</h4>
                    <p style="color: #a0aec0; margin: 0;">Player can: <em>use coins, lose time, check if they have resources</em><br>
                    Board can: <em>find landing spots, place pieces, check for wins</em><br>
                    Game can: <em>start, end, switch players, make moves</em></p>
                </div>
            </div>
            <div class="section-light">
                <h3 style="margin-top:0">💡 Interactive Example: Building a Player</h3>
                <p class="text-secondary">Let's build the Player class step by step:</p>
<pre><code>// Step 1: Create the blueprint
class Player {
  // Step 2: What happens when we create a new player?
  constructor(name, color) {
    this.name = name;        // Store the player's name
    this.color = color;      // Store the player's color
    this.timeLeft = 300;     // Everyone starts with 5 minutes
    this.coinsLeft = 21;     // Everyone starts with 21 coins
    this.wins = 0;           // Track victories
  }
}

// Step 3: Now we can make players!
const alice = new Player('Alice', 'red');
const bob = new Player('Bob', 'yellow');

// Each player has their own data:
console.log(alice.name);     // "Alice"
console.log(bob.name);       // "Bob"
console.log(alice.timeLeft); // 300
console.log(bob.timeLeft);   // 300 (separate from Alice!)

// Step 4: Add things players can DO
class Player {
  constructor(name, color) {
    this.name = name;
    this.color = color;
    this.timeLeft = 300;
    this.coinsLeft = 21;
    this.wins = 0;
  }
  
  // Method: something the player can do
  dropCoin() {
    if (this.coinsLeft > 0) {
      this.coinsLeft--;
      console.log(`${this.name} has ${this.coinsLeft} coins left`);
    }
  }
  
  loseSecond() {
    if (this.timeLeft > 0) {
      this.timeLeft--;
    }
  }
  
  winGame() {
    this.wins++;
    console.log(`${this.name} now has ${this.wins} wins!`);
  }
}

// Now players can DO things:
alice.dropCoin();  // "Alice has 20 coins left"
bob.dropCoin();    // "Bob has 20 coins left"
alice.winGame();   // "Alice now has 1 wins!"</code></pre>
            </div>
            <div class="section-accent">
                <h3 style="margin:0 0 .5rem 0;">🎯 When Should You Use OOP?</h3>
                <ul class="text-secondary" style="margin:0; padding-left:1.2rem; line-height:1.8;">
                    <li><strong>You have "things" with properties:</strong> Players, Cars, Bank Accounts, Monsters</li>
                    <li><strong>You need multiple instances:</strong> 100 users, 50 enemies, 10 games running</li>
                    <li><strong>Your code is getting complex:</strong> More than ~200 lines, multiple files</li>
                    <li><strong>You're working with a team:</strong> OOP makes it easier to divide work</li>
                    <li><strong>You want to reuse code:</strong> Make a Player class once, use it everywhere</li>
                </ul>
            </div>
            <div class="section-dark">
                <h3 style="margin:0 0 .5rem 0;">🎓 Practice Exercise</h3>
                <p class="text-secondary" style="margin:0.25rem 0 0.75rem 0;">Try this: Design a simple <code>Pet</code> class. What properties would it have? What actions could it perform?</p>
                <details style="margin-top: 1rem;">
                    <summary style="cursor: pointer; color: #4299e1; font-weight: 600;">💡 Possible Solution</summary>
                    <div style="margin-top: 1rem;">
<pre><code>class Pet {
  constructor(name, type, age) {
    this.name = name;           // "Fluffy"
    this.type = type;           // "cat" or "dog"
    this.age = age;             // 3
    this.hunger = 0;            // 0 = full, 10 = starving
    this.happiness = 10;        // 10 = very happy
    this.energy = 10;           // 10 = full energy
  }
  
  feed() {
    this.hunger = Math.max(0, this.hunger - 3);
    this.happiness += 1;
    console.log(`${this.name} is eating! Hunger: ${this.hunger}`);
  }
  
  play() {
    if (this.energy > 2) {
      this.energy -= 2;
      this.happiness += 2;
      this.hunger += 1;
      console.log(`${this.name} is playing! Energy: ${this.energy}`);
    } else {
      console.log(`${this.name} is too tired to play!`);
    }
  }
  
  sleep() {
    this.energy = 10;
    console.log(`${this.name} is fully rested!`);
  }
}

// Create pets and interact with them
const myDog = new Pet('Buddy', 'dog', 5);
const myCat = new Pet('Whiskers', 'cat', 3);

myDog.play();   // "Buddy is playing!"
myCat.feed();   // "Whiskers is eating!"</code></pre>
                    </div>
                </details>
            </div>
        </section>
        <!-- Challenges Section -->
        <section id="challenges" class="content-section">
            <h2>🚀 Build-It Challenges</h2>           
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 2rem; border-radius: 12px; margin: 2rem 0; text-align: center;">
                <h3 style="margin: 0 0 1rem 0;">Level Up Your Skills</h3>
                <p style="margin: 0;">Now that you understand the concepts, it's time to build! These challenges will help you apply what you've learned and add your own creative touches.</p>
            </div>
            <div class="challenge-grid">
                <div class="challenge-card">
                    <h4>⚙️ Settings Panel</h4>
                    <p>Create a settings modal where players can customize team names, colors, and save preferences to localStorage.</p>
                    <div>
                        <span class="difficulty-badge medium">Medium</span>
                        <span class="difficulty-badge" style="background: #fef5e7; color: #744210;">State</span>
                    </div>
                    <details style="margin-top: 1rem;">
                        <summary style="cursor: pointer; color: #3182ce; font-weight: 600;">💡 Implementation Hints</summary>
                        <ul style="margin-top: 0.5rem; color: #4a5568; font-size: 0.9rem;">
                            <li>Build a modal with inputs for names and colors</li>
                            <li>Persist with <code>localStorage.setItem()</code>/<code>getItem()</code></li>
                            <li>Load and apply saved settings on page load</li>
                        </ul>
                    </details>
                </div>
                <div class="challenge-card">
                    <h4>👻 Hover Preview</h4>
                    <p>Show a semi-transparent ghost piece above the column when hovering so players can preview their move.</p>
                    <div>
                        <span class="difficulty-badge medium">Medium</span>
                        <span class="difficulty-badge" style="background: #e6fffa; color: #285e61;">UX</span>
                    </div>
                    <details style="margin-top: 1rem;">
                        <summary style="cursor: pointer; color: #3182ce; font-weight: 600;">💡 Implementation Hints</summary>
                        <ul style="margin-top: 0.5rem; color: #4a5568; font-size: 0.9rem;">
                            <li>Track hovered column with <code>mouseover</code>/<code>mouseleave</code></li>
                            <li>Position a semi-transparent piece via absolute positioning</li>
                            <li>Hide the preview when not hovering or game over</li>
                        </ul>
                    </details>
                </div>
                <div class="challenge-card">
                    <h4>📊 Win Counter</h4>
                    <p>Track wins for each player across multiple games and display a scoreboard that persists between sessions.</p>
                    <div>
                        <span class="difficulty-badge medium">Medium</span>
                        <span class="difficulty-badge" style="background: #fef5e7; color: #744210;">State</span>
                    </div>
                    <details style="margin-top: 1rem;">
                        <summary style="cursor: pointer; color: #3182ce; font-weight: 600;">💡 Implementation Hints</summary>
                        <ul style="margin-top: 0.5rem; color: #4a5568; font-size: 0.9rem;">
                            <li>Maintain counts in <code>{ red: 0, yellow: 0 }</code></li>
                            <li>Increment and save to <code>localStorage</code> on win</li>
                            <li>Render a small scoreboard widget</li>
                        </ul>
                    </details>
                </div>
                <div class="challenge-card">
                    <h4>⏪ Undo Move</h4>
                    <p>Add an undo button that removes the last played piece and returns to the previous game state.</p>
                    <div>
                        <span class="difficulty-badge medium">Medium</span>
                        <span class="difficulty-badge" style="background: #fed7d7; color: #742a2a;">Logic</span>
                    </div>
                    <details style="margin-top: 1rem;">
                        <summary style="cursor: pointer; color: #3182ce; font-weight: 600;">💡 Implementation Hints</summary>
                        <ul style="margin-top: 0.5rem; color: #4a5568; font-size: 0.9rem;">
                            <li>Keep a move stack: <code>[{ row, col, player }]</code></li>
                            <li>On undo: pop, clear cell, switch player</li>
                            <li>Disable when no moves or game over</li>
                        </ul>
                    </details>
                </div>
                <div class="challenge-card">
                    <h4>🎯 Highlight Winner</h4>
                    <p>When someone wins, visually highlight the four connected pieces with a glow or outline effect.</p>
                    <div>
                        <span class="difficulty-badge easy">Easy</span>
                        <span class="difficulty-badge" style="background: #e6fffa; color: #285e61;">UI</span>
                    </div>
                    <details style="margin-top: 1rem;">
                        <summary style="cursor: pointer; color: #3182ce; font-weight: 600;">💡 Implementation Hints</summary>
                        <ul style="margin-top: 0.5rem; color: #4a5568; font-size: 0.9rem;">
                            <li>Make <code>checkWin</code> return winning coordinates</li>
                            <li>Add a <code>.winning-piece</code> CSS glow</li>
                            <li>Apply the class to the four winning cells</li>
                        </ul>
                    </details>
                </div>
                <div class="challenge-card">
                    <h4>⌨️ Keyboard Controls</h4>
                    <p>Let players use keyboard shortcuts: 1–7 to drop, R to restart, spacebar to pause.</p>
                    <div>
                        <span class="difficulty-badge easy">Easy</span>
                        <span class="difficulty-badge" style="background: #e6f3ff; color: #1e3a8a;">A11y</span>
                    </div>
                    <details style="margin-top: 1rem;">
                        <summary style="cursor: pointer; color: #3182ce; font-weight: 600;">💡 Implementation Hints</summary>
                        <ul style="margin-top: 0.5rem; color: #4a5568; font-size: 0.9rem;">
                            <li>Listen for <code>keydown</code> on <code>document</code></li>
                            <li>Map '1'–'7' to column indices</li>
                            <li>Respect game state to prevent invalid moves</li>
                        </ul>
                    </details>
                </div>
            </div>
            <div style="background: #f0fff4; border-left: 4px solid #38a169; padding: 2rem; border-radius: 8px; margin: 2rem 0;">
                <h3 style="margin: 0 0 1rem 0; color: #22543d;">🎯 Challenge Progression Strategy</h3>
                <p style="color: #4a5568; margin-bottom: 1rem;">Tackle these challenges in order for the best learning experience:</p>
                <ol style="color: #4a5568; line-height: 1.8;">
                    <li><strong>Start with UI challenges</strong> (Highlight Winner) - they're visual and immediately rewarding</li>
                    <li><strong>Move to interaction improvements</strong> (Hover Preview, Keyboard Controls) - enhance the user experience</li>
                    <li><strong>Add state management features</strong> (Settings, Win Counter, Undo) - practice data persistence</li>
                </ol>
            </div>
            <div style="background: #ebf8ff; padding: 2rem; border-radius: 12px; margin: 2rem 0;">
                <h3 style="color: #2c5282; margin-top: 0;">📈 Track Your Progress</h3>
                <p style="color: #4a5568; margin-bottom: 1rem;">Check off challenges as you complete them:</p>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 0.5rem;">
                    <label style="display: flex; align-items: center; padding: 0.5rem; cursor: pointer;">
                        <input type="checkbox" style="margin-right: 0.5rem; transform: scale(1.2);">
                        <span style="color: #4a5568;">⚙️ Settings Panel</span>
                    </label>
                    <label style="display: flex; align-items: center; padding: 0.5rem; cursor: pointer;">
                        <input type="checkbox" style="margin-right: 0.5rem; transform: scale(1.2);">
                        <span style="color: #4a5568;">👻 Hover Preview</span>
                    </label>
                    <label style="display: flex; align-items: center; padding: 0.5rem; cursor: pointer;">
                        <input type="checkbox" style="margin-right: 0.5rem; transform: scale(1.2);">
                        <span style="color: #4a5568;">📊 Win Counter</span>
                    </label>
                    <label style="display: flex; align-items: center; padding: 0.5rem; cursor: pointer;">
                        <input type="checkbox" style="margin-right: 0.5rem; transform: scale(1.2);">
                        <span style="color: #4a5568;">⏪ Undo Move</span>
                    </label>
                    <label style="display: flex; align-items: center; padding: 0.5rem; cursor: pointer;">
                        <input type="checkbox" style="margin-right: 0.5rem; transform: scale(1.2);">
                        <span style="color: #4a5568;">🎯 Highlight Winner</span>
                    </label>
                    <label style="display: flex; align-items: center; padding: 0.5rem; cursor: pointer;">
                        <input type="checkbox" style="margin-right: 0.5rem; transform: scale(1.2);">
                        <span style="color: #4a5568;">⌨️ Keyboard Controls</span>
                    </label>
                </div>
            </div>
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 2rem; border-radius: 12px; margin: 2rem 0; text-align: center;">
                <h3 style="margin: 0 0 1rem 0;">🎉 Beyond the Challenges</h3>
                <p style="margin: 0;">Once you've mastered these features, you'll have the skills to build any interactive web application. The patterns you've learned - state management, event handling, animations, and algorithms - are the foundation of modern web development!</p>
            </div>
        </section>
    </div>
    <script>
        document.addEventListener('DOMContentLoaded', function() {
            // Tab navigation
            const navTabs = document.querySelectorAll('.nav-tab');
            const contentSections = document.querySelectorAll('.content-section');
            const progressSteps = document.querySelectorAll('.progress-step');
            function showSection(sectionId) {
                // Update content sections
                contentSections.forEach(section => {
                    section.classList.remove('active');
                });
                document.getElementById(sectionId).classList.add('active');
                // Update nav tabs
                navTabs.forEach(tab => {
                    tab.classList.remove('active');
                });
                document.querySelector(`[data-section="${sectionId}"]`).classList.add('active');
                // Update progress indicator
                progressSteps.forEach(step => {
                    step.classList.remove('active', 'completed');
                });
                const stepMapping = {
                    'overview': 'overview',
                    'hands-on': 'hands-on', 
                    'concepts': 'concepts',
                    'oop': 'oop',
                    'challenges': 'challenges'
                };
                const currentStepName = stepMapping[sectionId];
                const currentStep = document.querySelector(`[data-step="${currentStepName}"]`);
                if (currentStep) {
                    currentStep.classList.add('active');                    
                    // Mark previous steps as completed
                    const stepOrder = ['overview', 'hands-on', 'concepts', 'oop', 'challenges'];
                    const currentIndex = stepOrder.indexOf(currentStepName);
                    for (let i = 0; i < currentIndex; i++) {
                        const prevStep = document.querySelector(`[data-step="${stepOrder[i]}"]`);
                        if (prevStep) {
                            prevStep.classList.add('completed');
                        }
                    }
                }
                // Smooth scroll to top of content
                document.querySelector('.container').scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'start' 
                });
            }
            // Add click event listeners
            navTabs.forEach(tab => {
                tab.addEventListener('click', function(e) {
                    e.preventDefault();
                    const sectionId = this.getAttribute('data-section');
                    showSection(sectionId);
                });
            });
            // Progress tracking for challenges
            const checkboxes = document.querySelectorAll('input[type="checkbox"]');            
            // Load saved progress from localStorage
            checkboxes.forEach((checkbox, index) => {
                const savedState = localStorage.getItem(`challenge-${index}`);
                if (savedState === 'true') {
                    checkbox.checked = true;
                }               
                // Save progress when changed
                checkbox.addEventListener('change', function() {
                    localStorage.setItem(`challenge-${index}`, this.checked);
                });
            });
            // Initialize with first section
            showSection('overview');
        });
    </script>
