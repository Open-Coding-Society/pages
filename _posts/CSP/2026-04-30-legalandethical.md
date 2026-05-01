---
layout: opencs
title: IP & Ethics Review
description: AP CSP legal and ethical computing review
permalink: /legal_ethics/
---

<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Ethics Investigator | AP CSP</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400&family=Lora:ital,wght@0,400;0,600;1,400&family=JetBrains+Mono:wght@400;500;700&display=swap" rel="stylesheet">
<style>
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
 
:root {
  --bg:          #090a12;
  --surface:     #10111c;
  --surface-2:   #171826;
  --border:      #21233a;
  --border-soft: #1a1c30;
  --gold:        #d4a843;
  --gold-dim:    rgba(212,168,67,0.1);
  --gold-glow:   rgba(212,168,67,0.22);
  --text:        #ede5d2;
  --text-dim:    #9990b0;
  --text-muted:  #56526a;
  --correct:     #52c97e;
  --correct-dim: rgba(82,201,126,0.10);
  --wrong:       #e05c5c;
  --wrong-dim:   rgba(224,92,92,0.10);
  --accent-blue: #5a8fb0;
  --accent-blue-dim: rgba(90,143,176,0.1);
}
 
html, body {
  min-height: 100%;
  font-family: 'Lora', Georgia, serif;
  background: var(--bg);
  color: var(--text);
  overflow-x: hidden;
}
 
body::before {
  content: '';
  position: fixed;
  inset: 0;
  background:
    radial-gradient(ellipse 60% 50% at 15% 60%, rgba(212,168,67,0.04) 0%, transparent 100%),
    radial-gradient(ellipse 50% 40% at 85% 15%, rgba(80,100,200,0.04) 0%, transparent 100%);
  pointer-events: none;
  z-index: 0;
}
 
body::after {
  content: '';
  position: fixed;
  inset: 0;
  background-image:
    linear-gradient(var(--border-soft) 1px, transparent 1px),
    linear-gradient(90deg, var(--border-soft) 1px, transparent 1px);
  background-size: 48px 48px;
  opacity: 0.3;
  pointer-events: none;
  z-index: 0;
}
 
.screen {
  display: none;
  position: relative;
  z-index: 1;
  min-height: 100vh;
}
.screen.active {
  display: flex;
  flex-direction: column;
  align-items: center;
  animation: fadeIn 0.5s ease both;
}
 
@keyframes fadeIn    { from { opacity:0; transform:translateY(14px); } to { opacity:1; transform:translateY(0); } }
@keyframes slideUp   { from { opacity:0; transform:translateY(18px); } to { opacity:1; transform:translateY(0); } }
@keyframes scalePop  { 0%,100% { transform:scale(1); } 50% { transform:scale(1.12); } }
@keyframes shakeX    { 0%,100% { transform:translateX(0); } 20%,60% { transform:translateX(-5px); } 40%,80% { transform:translateX(5px); } }
@keyframes correctSlide { from { transform:translateX(-6px); opacity:0.7; } to { transform:translateX(0); opacity:1; } }
@keyframes matchGlow { from { transform:scale(1); } to { transform:scale(1.05); box-shadow: 0 0 15px rgba(82,201,126,0.4); } }
 
#home-screen { justify-content: center; padding: 60px 24px; }
.home-wrap { max-width: 700px; width: 100%; }
.home-eyebrow { font-family: 'JetBrains Mono', monospace; font-size: 10px; font-weight: 500; letter-spacing: 0.22em; text-transform: uppercase; color: var(--gold); margin-bottom: 28px; opacity: 0.75; }
.home-title { font-family: 'Playfair Display', Georgia, serif; font-size: clamp(52px, 10vw, 88px); font-weight: 900; line-height: 0.95; letter-spacing: -0.02em; color: var(--text); margin-bottom: 6px; }
.home-title .accent { color: var(--gold); }
.home-sub { font-family: 'Playfair Display', Georgia, serif; font-size: clamp(15px, 2.5vw, 19px); font-style: italic; font-weight: 400; color: var(--text-dim); margin-bottom: 40px; }
.rule { width: 56px; height: 2px; background: var(--gold); opacity: 0.55; margin-bottom: 40px; }
.home-desc { font-size: 15px; line-height: 1.82; color: var(--text-dim); margin-bottom: 48px; max-width: 580px; }
.mode-selector { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 48px; margin-top: 32px; }
.mode-card { display: flex; flex-direction: column; padding: 32px 24px; background: var(--surface); border: 1px solid var(--border); border-radius: 3px; cursor: pointer; transition: all 0.25s; text-align: center; }
.mode-card:hover { border-color: var(--gold); background: var(--gold-dim); transform: translateY(-3px); }
.mode-card.lesson { border-color: var(--accent-blue); }
.mode-card.lesson:hover { background: var(--accent-blue-dim); border-color: var(--accent-blue); }
.mode-icon { font-size: 40px; margin-bottom: 14px; }
.mode-title { font-family: 'Playfair Display', Georgia, serif; font-size: 18px; font-weight: 700; margin-bottom: 8px; color: var(--text); }
.mode-desc { font-size: 13px; line-height: 1.6; color: var(--text-muted); }
.chips { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 24px; }
.chip { font-family: 'JetBrains Mono', monospace; font-size: 9.5px; letter-spacing: 0.1em; text-transform: uppercase; padding: 5px 12px; border: 1px solid var(--border); border-radius: 2px; color: var(--text-muted); background: var(--surface); }

#lesson-screen { align-items: stretch; padding-bottom: 80px; }
.lesson-nav { width: 100%; height: 3px; background: var(--border); position: sticky; top: 0; z-index: 10; }
.lesson-nav-fill { height: 100%; background: linear-gradient(90deg, var(--accent-blue), #7da8c4); transition: width 0.55s cubic-bezier(0.4,0,0.2,1); }
.lesson-inner { width: 100%; max-width: 800px; margin: 0 auto; padding: 0 24px; }
.lesson-header { display: flex; align-items: center; justify-content: space-between; padding: 26px 0 34px; }
.lesson-label { font-family: 'JetBrains Mono', monospace; font-size: 10.5px; letter-spacing: 0.16em; text-transform: uppercase; color: var(--accent-blue); }
.lesson-section { margin-bottom: 48px; animation: slideUp 0.4s ease both; }
.section-tag { display: inline-block; font-family: 'JetBrains Mono', monospace; font-size: 9.5px; letter-spacing: 0.13em; text-transform: uppercase; padding: 4px 11px; background: var(--accent-blue-dim); border: 1px solid rgba(90,143,176,0.28); border-radius: 2px; color: var(--accent-blue); margin-bottom: 18px; }
.section-title { font-family: 'Playfair Display', Georgia, serif; font-size: clamp(28px, 5.5vw, 44px); font-weight: 700; line-height: 1.12; margin-bottom: 24px; color: var(--text); }
.lesson-body { font-size: 15px; line-height: 1.8; color: var(--text-dim); margin-bottom: 20px; }
.lesson-body strong { color: var(--text); font-weight: 600; }
.key-point { background: var(--surface); border-left: 4px solid var(--accent-blue); border-radius: 0 2px 2px 0; padding: 18px 22px; margin: 24px 0; }
.key-point-label { font-family: 'JetBrains Mono', monospace; font-size: 8.5px; letter-spacing: 0.22em; text-transform: uppercase; color: var(--accent-blue); opacity: 0.8; margin-bottom: 10px; }
.key-point-text { font-size: 14.5px; line-height: 1.8; color: var(--text); }
.definition-box { background: var(--surface-2); border: 1px solid var(--border); border-radius: 2px; padding: 20px 24px; margin: 20px 0; }
.definition-term { font-family: 'JetBrains Mono', monospace; font-size: 10px; letter-spacing: 0.14em; text-transform: uppercase; color: var(--accent-blue); margin-bottom: 8px; }
.definition-text { font-size: 14px; line-height: 1.7; color: var(--text-dim); }
.bullet-list { margin: 16px 0 24px 20px; }
.bullet-list li { margin: 10px 0; color: var(--text-dim); font-size: 14.5px; line-height: 1.6; }
.bullet-list strong { color: var(--text); }

.match-game { background: var(--surface); border: 1px solid var(--border); border-radius: 2px; padding: 24px; margin: 24px 0; }
.match-grid { display: grid; grid-template-columns: 1fr 30px 1fr; gap: 16px; align-items: center; margin-bottom: 24px; }
.match-column { display: flex; flex-direction: column; gap: 8px; }
.match-item { padding: 12px 14px; background: var(--surface-2); border: 1px solid var(--border); border-radius: 2px; cursor: pointer; font-size: 13.5px; color: var(--text-dim); text-align: center; transition: all 0.2s; }
.match-item.selected { background: var(--accent-blue-dim); border-color: var(--accent-blue); color: var(--accent-blue); }
.match-item.matched { background: var(--correct-dim); border-color: var(--correct); color: var(--correct); cursor: default; }
.match-divider { width: 2px; background: var(--border); }
.match-feedback { font-size: 14px; padding: 14px; background: var(--correct-dim); border: 1px solid var(--correct); border-radius: 2px; color: var(--correct); text-align: center; }

.lesson-nav-buttons { display: flex; gap: 12px; justify-content: space-between; margin-top: 44px; padding-top: 32px; border-top: 1px solid var(--border); }
.btn-nav { font-family: 'JetBrains Mono', monospace; font-size: 11.5px; letter-spacing: 0.14em; text-transform: uppercase; padding: 13px 24px; background: transparent; color: var(--text-muted); border: 1px solid var(--border); border-radius: 2px; cursor: pointer; transition: all 0.18s; }
.btn-nav:hover:not(:disabled) { border-color: var(--accent-blue); color: var(--accent-blue); background: var(--accent-blue-dim); }
.btn-nav:disabled { opacity: 0.4; cursor: not-allowed; }
.btn-home { font-family: 'JetBrains Mono', monospace; font-size: 11.5px; letter-spacing: 0.14em; text-transform: uppercase; padding: 13px 24px; background: transparent; color: var(--text-muted); border: 1px solid var(--border); border-radius: 2px; cursor: pointer; transition: all 0.18s; }
.btn-home:hover { border-color: var(--accent-blue); color: var(--accent-blue); background: var(--accent-blue-dim); }

#game-screen { align-items: stretch; padding-bottom: 80px; }
.prog-bar-wrap { width: 100%; height: 3px; background: var(--border); }
.prog-bar-fill { height: 100%; background: linear-gradient(90deg, var(--gold), #e8c063); transition: width 0.55s cubic-bezier(0.4,0,0.2,1); }
.game-inner { width: 100%; max-width: 760px; margin: 0 auto; padding: 0 24px; }
.game-header { display: flex; align-items: center; justify-content: space-between; padding: 26px 0 34px; }
.case-label { font-family: 'JetBrains Mono', monospace; font-size: 10.5px; letter-spacing: 0.16em; text-transform: uppercase; color: var(--text-muted); }
.score-wrap { font-family: 'JetBrains Mono', monospace; font-size: 11px; color: var(--text-muted); display: flex; align-items: center; gap: 7px; }
.score-val { font-size: 20px; font-weight: 700; color: var(--gold); transition: color 0.2s; display: inline-block; }
.score-val.pop { animation: scalePop 0.38s ease; }
.concept-tag { display: inline-block; font-family: 'JetBrains Mono', monospace; font-size: 9.5px; letter-spacing: 0.13em; text-transform: uppercase; padding: 4px 11px; background: var(--gold-dim); border: 1px solid rgba(212,168,67,0.28); border-radius: 2px; color: var(--gold); margin-bottom: 18px; }
.case-title { font-family: 'Playfair Display', Georgia, serif; font-size: clamp(28px, 5.5vw, 44px); font-weight: 700; line-height: 1.12; margin-bottom: 30px; color: var(--text); }
.narrative-box { background: var(--surface); border: 1px solid var(--border); border-left: 3px solid var(--gold); border-radius: 0 2px 2px 0; padding: 22px 26px; margin-bottom: 34px; }
.narrative-label { font-family: 'JetBrains Mono', monospace; font-size: 8.5px; letter-spacing: 0.22em; text-transform: uppercase; color: var(--gold); opacity: 0.7; margin-bottom: 12px; }
.narrative-text { font-size: 14.5px; line-height: 1.85; color: var(--text-dim); font-style: italic; }
.question-text { font-family: 'Playfair Display', Georgia, serif; font-size: 20px; font-weight: 600; line-height: 1.45; color: var(--text); margin-bottom: 22px; }
.choices { display: flex; flex-direction: column; gap: 10px; margin-bottom: 30px; }
.choice-btn { display: flex; align-items: flex-start; gap: 18px; width: 100%; padding: 19px 22px; background: var(--surface); border: 1px solid var(--border); border-radius: 2px; cursor: pointer; text-align: left; font-family: 'Lora', Georgia, serif; color: var(--text); transition: border-color 0.18s, background 0.18s, transform 0.18s, box-shadow 0.18s; }
.choice-btn:hover:not(:disabled) { border-color: rgba(212,168,67,0.5); background: var(--gold-dim); transform: translateX(4px); }
.choice-btn:disabled { cursor: default; }
.choice-lbl { font-family: 'JetBrains Mono', monospace; font-size: 11.5px; font-weight: 700; color: var(--text-muted); min-width: 18px; flex-shrink: 0; padding-top: 3px; transition: color 0.2s; }
.choice-text { font-size: 14.5px; line-height: 1.65; color: var(--text-dim); transition: color 0.2s; }
.choice-btn.is-correct { border-color: var(--correct); background: var(--correct-dim); animation: correctSlide 0.3s ease; }
.choice-btn.is-correct .choice-lbl { color: var(--correct); }
.choice-btn.is-correct .choice-text { color: var(--text); }
.choice-btn.is-wrong { border-color: var(--wrong); background: var(--wrong-dim); animation: shakeX 0.4s ease; }
.choice-btn.is-wrong .choice-lbl { color: var(--wrong); }
.feedback-panel { display: none; background: var(--surface-2); border: 1px solid var(--border); border-radius: 2px; padding: 26px 28px; margin-bottom: 24px; animation: slideUp 0.4s ease both; }
.feedback-panel.show { display: block; }
.feedback-status-badge { display: inline-block; font-family: 'JetBrains Mono', monospace; font-size: 10px; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; padding: 4px 13px; border-radius: 2px; margin-bottom: 16px; }
.feedback-status-badge.ok { background: var(--correct-dim); color: var(--correct); border: 1px solid rgba(82,201,126,0.28); }
.feedback-status-badge.no { background: var(--wrong-dim); color: var(--wrong); border: 1px solid rgba(224,92,92,0.28); }
.feedback-text { font-size: 14.5px; line-height: 1.8; color: var(--text-dim); margin-bottom: 24px; }
.concept-divider { border: none; border-top: 1px solid var(--border); margin-bottom: 20px; }
.concept-card-label { font-family: 'JetBrains Mono', monospace; font-size: 8.5px; letter-spacing: 0.22em; text-transform: uppercase; color: var(--gold); opacity: 0.75; margin-bottom: 16px; }
.term-list { display: flex; flex-direction: column; gap: 14px; }
.term-row { display: grid; grid-template-columns: auto 1fr; gap: 16px; align-items: baseline; }
.term-name { font-family: 'JetBrains Mono', monospace; font-size: 11.5px; font-weight: 700; color: var(--text); white-space: nowrap; }
.term-def { font-size: 14px; line-height: 1.65; color: var(--text-dim); }
.btn-next { display: none; width: 100%; font-family: 'JetBrains Mono', monospace; font-size: 11.5px; letter-spacing: 0.14em; text-transform: uppercase; padding: 17px 24px; background: transparent; color: var(--gold); border: 1px solid rgba(212,168,67,0.45); border-radius: 2px; cursor: pointer; transition: background 0.18s, border-color 0.18s, box-shadow 0.18s; }
.btn-next:hover { background: var(--gold-dim); border-color: var(--gold); box-shadow: 0 4px 18px var(--gold-glow); }

#results-screen { justify-content: center; padding: 60px 24px 80px; }
.results-wrap { max-width: 620px; width: 100%; }
.results-eyebrow { font-family: 'JetBrains Mono', monospace; font-size: 10px; letter-spacing: 0.22em; text-transform: uppercase; color: var(--gold); opacity: 0.75; margin-bottom: 28px; }
.results-score-row { display: flex; align-items: baseline; gap: 10px; margin-bottom: 8px; }
.results-score-big { font-family: 'Playfair Display', Georgia, serif; font-size: clamp(72px, 16vw, 110px); font-weight: 900; line-height: 1; color: var(--gold); }
.results-denom { font-family: 'JetBrains Mono', monospace; font-size: 18px; color: var(--text-muted); letter-spacing: 0.08em; align-self: flex-end; padding-bottom: 12px; }
.results-rule { width: 56px; height: 2px; background: var(--gold); opacity: 0.45; margin: 24px 0; }
.results-badge { font-family: 'Playfair Display', Georgia, serif; font-size: 26px; font-weight: 700; font-style: italic; color: var(--text); margin-bottom: 14px; }
.results-msg { font-size: 15px; line-height: 1.82; color: var(--text-dim); margin-bottom: 44px; }
.concepts-box { background: var(--surface); border: 1px solid var(--border); border-radius: 2px; padding: 24px 26px; margin-bottom: 44px; }
.concepts-box-label { font-family: 'JetBrains Mono', monospace; font-size: 8.5px; letter-spacing: 0.22em; text-transform: uppercase; color: var(--gold); opacity: 0.7; margin-bottom: 18px; }
.concepts-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 9px; }
.concept-pill { display: flex; align-items: center; gap: 9px; padding: 9px 13px; background: var(--surface-2); border-radius: 2px; font-family: 'JetBrains Mono', monospace; font-size: 10.5px; color: var(--text-dim); }
.pill-dot { width: 7px; height: 7px; border-radius: 50%; background: var(--correct); flex-shrink: 0; }
.case-results { display: flex; flex-direction: column; gap: 8px; margin-bottom: 40px; }
.case-result-row { display: flex; align-items: center; justify-content: space-between; padding: 11px 16px; background: var(--surface); border: 1px solid var(--border); border-radius: 2px; font-family: 'JetBrains Mono', monospace; font-size: 11px; }
.case-result-name { color: var(--text-dim); }
.result-mark { font-size: 12px; font-weight: 700; letter-spacing: 0.1em; }
.result-mark.yes { color: var(--correct); }
.result-mark.nope { color: var(--wrong); }
.btn-start { font-family: 'JetBrains Mono', monospace; font-size: 12px; letter-spacing: 0.14em; text-transform: uppercase; padding: 17px 52px; background: var(--gold); color: #080910; font-weight: 700; border: none; border-radius: 2px; cursor: pointer; transition: background 0.18s, transform 0.18s, box-shadow 0.18s; display: inline-block; }
.btn-start:hover { background: #e8bd55; transform: translateY(-2px); box-shadow: 0 10px 30px var(--gold-glow); }
.btn-start:active { transform: translateY(0); }

@media (max-width: 520px) {
  .concepts-grid { grid-template-columns: 1fr; }
  .term-row { grid-template-columns: 1fr; gap: 4px; }
  .game-header { flex-direction: column; align-items: flex-start; gap: 8px; }
  .mode-selector { grid-template-columns: 1fr; }
  .match-grid { grid-template-columns: 1fr; }
  .match-divider { width: 100%; height: 2px; margin: 8px 0; }
}
</style>
</head>
<body>
 
<section id="home-screen" class="screen active">
  <div class="home-wrap">
    <div class="home-eyebrow">AP Computer Science Principles</div>
    <div class="home-title">Ethics and Legal<br><span class="accent">Concerns</span></div>
    <div class="rule"></div>
    <p class="home-desc">Choose your path: learn the foundations with interactive lessons and match game, then test your knowledge against real-world cases.</p>
    
    <div class="mode-selector">
      <div class="mode-card lesson" onclick="goToLesson()">
        <div class="mode-title">Learn</div>
        <div class="mode-desc">8 interactive lessons plus terms matching game</div>
      </div>
      <div class="mode-card" onclick="startGame()">
        <div class="mode-title">Investigate</div>
        <div class="mode-desc">6 real-world cases testing your knowledge</div>
      </div>
    </div>
    
    <div class="chips">
      <span class="chip">Intellectual Property</span>
      <span class="chip">Copyright</span>
      <span class="chip">Plagiarism</span>
      <span class="chip">Creative Commons</span>
      <span class="chip">Open Source</span>
      <span class="chip">Open Access</span>
      <span class="chip">Digital Divide</span>
      <span class="chip">Algorithm Bias</span>
    </div>
  </div>
</section>

<section id="lesson-screen" class="screen">
  <div class="lesson-nav">
    <div class="lesson-nav-fill" id="lesson-nav-fill" style="width:0%"></div>
  </div>

  <div class="lesson-inner">
    <div class="lesson-header">
      <div class="lesson-label" id="lesson-label">Lesson 1 of 9</div>
      <button class="btn-home" onclick="goHome()">Back</button>
    </div>

    <div id="lesson-content"></div>

    <div class="lesson-nav-buttons">
      <button class="btn-nav" id="btn-prev-lesson" onclick="prevLesson()" disabled>Previous</button>
      <button class="btn-nav" id="btn-next-lesson" onclick="nextLesson()">Next</button>
    </div>
  </div>
</section>

<section id="game-screen" class="screen">
  <div class="prog-bar-wrap">
    <div class="prog-bar-fill" id="prog-bar" style="width:0%"></div>
  </div>
 
  <div class="game-inner">
    <div class="game-header">
      <div class="case-label" id="case-label">Case 01 of 06</div>
      <div class="score-wrap">Score <span class="score-val" id="score-val">0</span> / 6</div>
    </div>
 
    <div id="concept-tag" class="concept-tag"></div>
    <div id="case-title" class="case-title"></div>
 
    <div class="narrative-box">
      <div class="narrative-label">Case File</div>
      <div class="narrative-text" id="narrative-text"></div>
    </div>
 
    <div class="question-text" id="question-text"></div>
    <div class="choices" id="choices-container"></div>
 
    <div class="feedback-panel" id="feedback-panel">
      <div class="feedback-status-badge" id="feedback-badge"></div>
      <div class="feedback-text" id="feedback-text"></div>
      <hr class="concept-divider">
      <div class="concept-card-label">Concepts from this case</div>
      <div class="term-list" id="term-list"></div>
    </div>
 
    <button class="btn-next" id="btn-next" onclick="nextCase()">Next Case</button>
  </div>
</section>

<section id="results-screen" class="screen">
  <div class="results-wrap">
    <div class="results-eyebrow">Investigation Complete</div>
    <div class="results-score-row">
      <div class="results-score-big" id="res-score">0</div>
      <div class="results-denom">out of 6</div>
    </div>
    <div class="results-rule"></div>
    <div class="results-badge" id="res-badge"></div>
    <p class="results-msg" id="res-msg"></p>
 
    <div class="case-results" id="case-results-list"></div>
 
    <div class="concepts-box">
      <div class="concepts-box-label">Concepts Covered</div>
      <div class="concepts-grid">
        <div class="concept-pill"><span class="pill-dot"></span>Intellectual Property</div>
        <div class="concept-pill"><span class="pill-dot"></span>Copyright</div>
        <div class="concept-pill"><span class="pill-dot"></span>Plagiarism</div>
        <div class="concept-pill"><span class="pill-dot"></span>Open Source</div>
        <div class="concept-pill"><span class="pill-dot"></span>Creative Commons</div>
        <div class="concept-pill"><span class="pill-dot"></span>Digital Divide</div>
        <div class="concept-pill"><span class="pill-dot"></span>Algorithm Bias</div>
        <div class="concept-pill"><span class="pill-dot"></span>Open Access</div>
      </div>
    </div>
 
    <button class="btn-start" onclick="restartGame()">Restart Investigation</button>
    <button class="btn-start" style="background: var(--accent-blue); margin-top: 12px;" onclick="goHome()">Back to Home</button>
  </div>
</section>
 
<script>
const lessonModules = [
  {
    title: "What is Intellectual Property?",
    tag: "Foundations",
    content: `
      <div class="lesson-section">
        <div class="section-tag">Foundations</div>
        <h2 class="section-title">What is Intellectual Property?</h2>
        
        <p class="lesson-body"><strong>Intellectual property (IP)</strong> is creative work that has value. It includes software, music, art, writing, designs, and algorithms.</p>

        <div class="key-point">
          <div class="key-point-label">Why IP Matters</div>
          <div class="key-point-text">IP protects the effort and value of creativity. Without protection, creators lose control and profit incentives. IP laws encourage innovation by protecting creators' rights.</div>
        </div>

        <ul class="bullet-list">
          <li><strong>Code is IP:</strong> A programmer's months of work can be copied instantly. IP law prevents theft.</li>
          <li><strong>Ownership:</strong> You own your IP from creation. No registration needed.</li>
          <li><strong>Control:</strong> As the creator, you decide how others use your work.</li>
          <li><strong>Examples:</strong> Apps, websites, algorithms, digital art, videos, music, research.</li>
        </ul>

        <div class="definition-box">
          <div class="definition-term">Intellectual Property</div>
          <div class="definition-text">A work or invention with commercial or social value. IP is protected by law (copyright, patent, trademark) to reward creators and encourage future innovation.</div>
        </div>
      </div>
    `
  },
  {
    title: "Copyright and Attribution",
    tag: "Legal Protection",
    content: `
      <div class="lesson-section">
        <div class="section-tag">Legal Protection</div>
        <h2 class="section-title">Copyright and Attribution</h2>
        
        <p class="lesson-body"><strong>Copyright</strong> gives creators exclusive rights to their work. It applies automatically the moment you create something. You do not need to register or publish a notice.</p>

        <div class="key-point">
          <div class="key-point-label">Critical Distinction</div>
          <div class="key-point-text">Attribution (crediting someone) is NOT the same as permission. Crediting a creator by name does not give you the legal right to use their work. Copyright is about control.</div>
        </div>

        <ul class="bullet-list">
          <li><strong>Automatic:</strong> Copyright exists from creation. No paperwork needed.</li>
          <li><strong>Exclusive Rights:</strong> Only the creator can copy, distribute, or display the work.</li>
          <li><strong>Attribution ≠ Permission:</strong> You can credit someone and still break the law.</li>
          <li><strong>Legal Use Requires:</strong> Permission from the copyright holder, a license, or public domain status.</li>
          <li><strong>Violation Consequences:</strong> Fines, legal action, and content removal.</li>
        </ul>

        <div class="definition-box">
          <div class="definition-term">Copyright</div>
          <div class="definition-text">Exclusive legal rights that protect original creative works (code, music, art, writing). The creator controls how the work is used, copied, distributed, and displayed.</div>
        </div>
      </div>
    `
  },
  {
    title: "Creative Commons and Open Source",
    tag: "Sharing with Control",
    content: `
      <div class="lesson-section">
        <div class="section-tag">Sharing with Control</div>
        <h2 class="section-title">Creative Commons and Open Source</h2>
        
        <p class="lesson-body">Creators can share work while maintaining control using licenses. <strong>Creative Commons (CC)</strong> and <strong>open source</strong> licenses let creators grant specific permissions.</p>

        <div class="definition-box">
          <div class="definition-term">Creative Commons Licenses</div>
          <div class="definition-text">Public licenses that explicitly state what others can do with your work. CC BY lets people use and remix with attribution. CC BY-NC restricts commercial use. CC0 waives all rights (public domain).</div>
        </div>

        <ul class="bullet-list">
          <li><strong>CC BY:</strong> Attribution required. You can use, modify, and distribute.</li>
          <li><strong>CC BY-NC:</strong> Non-commercial only. No commercial use allowed.</li>
          <li><strong>CC BY-SA:</strong> Share-alike. Derivative works must use the same license.</li>
          <li><strong>CC0:</strong> Public domain. No restrictions at all.</li>
          <li><strong>Check the License:</strong> Always read the terms. Violating license terms is copyright infringement.</li>
        </ul>

        <div class="definition-box">
          <div class="definition-term">Open Source</div>
          <div class="definition-text">Software freely available for anyone to use, modify, and distribute. Typically licensed under GPL, MIT, or Apache licenses. Usually requires attribution and maintaining openness for derivatives.</div>
        </div>
      </div>
    `
  },
  {
    title: "Plagiarism and Academic Integrity",
    tag: "Ethics in Computing",
    content: `
      <div class="lesson-section">
        <div class="section-tag">Ethics in Computing</div>
        <h2 class="section-title">Plagiarism and Academic Integrity</h2>
        
        <p class="lesson-body"><strong>Plagiarism</strong> is using someone else's work without permission or proper credit. Many students think publicly available code is free to use without attribution. This is wrong.</p>

        <div class="key-point">
          <div class="key-point-label">Critical Misconception</div>
          <div class="key-point-text">Public code is NOT free to use without credit. Code is copyright protected from creation unless the creator grants permission through a license.</div>
        </div>

        <ul class="bullet-list">
          <li><strong>Always Cite Sources:</strong> Credit where ideas or code come from.</li>
          <li><strong>Check Licenses:</strong> Understand the terms before using code.</li>
          <li><strong>Understand Your Code:</strong> Don't copy and paste without learning.</li>
          <li><strong>No Surface Changes:</strong> Rewriting slightly does not make plagiarism legal.</li>
          <li><strong>Consequences:</strong> Failing grades, probation, expulsion, or legal action.</li>
        </ul>

        <div class="definition-box">
          <div class="definition-term">Plagiarism</div>
          <div class="definition-text">Presenting someone else's work (code, writing, ideas) as your own without permission or proper credit. Violates copyright law and academic integrity policies.</div>
        </div>
      </div>
    `
  },
  {
    title: "Open Access and Research",
    tag: "Knowledge Equity",
    content: `
      <div class="lesson-section">
        <div class="section-tag">Knowledge Equity</div>
        <h2 class="section-title">Open Access and Research</h2>
        
        <p class="lesson-body">Scientific research (climate data, medical discoveries) is often locked behind paywalls. <strong>Open Access</strong> aims to make research freely available to everyone.</p>

        <ul class="bullet-list">
          <li><strong>The Problem:</strong> Research papers cost $30-40 to access. Only wealthy institutions can afford them.</li>
          <li><strong>Equity Issue:</strong> Critical knowledge is inaccessible to students in poor countries and independent researchers.</li>
          <li><strong>Legal Alternatives Exist:</strong> Open-access repositories, school libraries, and asking authors directly.</li>
          <li><strong>Don't Use:</strong> Illegal file-sharing sites like Sci-Hub. Violates copyright even with good intentions.</li>
        </ul>

        <div class="definition-box">
          <div class="definition-term">Open Access</div>
          <div class="definition-text">Research freely available online with no or minimal restrictions on access or use. Can be read, downloaded, and distributed without payment or permission barriers.</div>
        </div>

        <ul class="bullet-list">
          <li><strong>Search:</strong> PubMed Central, arXiv, institutional archives.</li>
          <li><strong>School Access:</strong> Use your school library database.</li>
          <li><strong>Ask Authors:</strong> Email researchers directly. Most are happy to share.</li>
        </ul>
      </div>
    `
  },
  {
    title: "The Digital Divide",
    tag: "Social Equity",
    content: `
      <div class="lesson-section">
        <div class="section-tag">Social Equity</div>
        <h2 class="section-title">The Digital Divide</h2>
        
        <p class="lesson-body">The <strong>digital divide</strong> is unequal access to technology. Some people have reliable internet and devices; others have neither. This creates opportunity gaps.</p>

        <ul class="bullet-list">
          <li><strong>Schools:</strong> Wealthy districts have fiber-optic internet and laptops. Poor districts use outdated computers.</li>
          <li><strong>Geography:</strong> Urban areas have broadband. Rural communities often have no high-speed internet.</li>
          <li><strong>Economics:</strong> Families who afford devices access opportunities. Families without resources cannot.</li>
          <li><strong>Disability:</strong> Many websites lack accessibility features for people with disabilities.</li>
        </ul>

        <div class="key-point">
          <div class="key-point-label">Equity vs. Equality</div>
          <div class="key-point-text">Equal means giving everyone the same. Equitable means giving based on need. To close the digital divide, invest more in those with less.</div>
        </div>

        <div class="definition-box">
          <div class="definition-term">Digital Divide</div>
          <div class="definition-text">Unequal distribution of access to technology (computers, internet, devices, skills) and the resulting gaps in educational, economic, and civic opportunity.</div>
        </div>
      </div>
    `
  },
  {
    title: "Algorithm Bias and Fair Computing",
    tag: "Ethics in AI",
    content: `
      <div class="lesson-section">
        <div class="section-tag">Ethics in AI</div>
        <h2 class="section-title">Algorithm Bias and Fair Computing</h2>
        
        <p class="lesson-body">Algorithms make critical decisions: hiring, loans, sentencing, admissions. When they discriminate against groups, it is <strong>algorithm bias</strong>.</p>

        <div class="key-point">
          <div class="key-point-label">Misconception</div>
          <div class="key-point-text">Algorithms don't need to explicitly include protected characteristics (like gender) to discriminate. Bias is learned from historical data. Unintentional bias still causes real harm.</div>
        </div>

        <ul class="bullet-list">
          <li><strong>Bias from Data:</strong> Trained on decades of biased hiring data, algorithms perpetuate those patterns.</li>
          <li><strong>Hiring:</strong> AI rejected more women applications after learning from male-dominated hiring history.</li>
          <li><strong>Loans:</strong> Credit algorithms denied loans to minorities based on historical discrimination.</li>
          <li><strong>Justice:</strong> Risk assessment algorithms overestimated recidivism for Black defendants.</li>
        </ul>

        <div class="definition-box">
          <div class="definition-term">Algorithm Bias</div>
          <div class="definition-text">When a computing system produces discriminatory outcomes for certain groups. Often stems from biased training data, flawed design assumptions, or indirect discrimination through proxy variables.</div>
        </div>

        <ul class="bullet-list">
          <li><strong>Responsibility:</strong> Developers and organizations are responsible for their system outcomes.</li>
          <li><strong>Audit:</strong> Test for differential outcomes across demographic groups.</li>
          <li><strong>Examine Data:</strong> Is training data representative and balanced?</li>
          <li><strong>Add Oversight:</strong> Include human review for high-stakes decisions.</li>
        </ul>
      </div>
    `
  },
  {
    title: "Computing's Impact on Society",
    tag: "Big Picture",
    content: `
      <div class="lesson-section">
        <div class="section-tag">Big Picture</div>
        <h2 class="section-title">Computing's Impact on Society</h2>
        
        <p class="lesson-body">Computing systems influence public discourse, politics, privacy, and equity at massive scale. Design choices have real consequences for society.</p>

        <ul class="bullet-list">
          <li><strong>Misinformation:</strong> Algorithms amplify engaging content, even false content. Spreads falsehoods at scale.</li>
          <li><strong>Privacy:</strong> Data collection and surveillance can track, manipulate, or control people.</li>
          <li><strong>Polarization:</strong> Recommendation algorithms create echo chambers. Deepens social divisions.</li>
          <li><strong>Labor Displacement:</strong> Automation without support for workers deepens economic inequality.</li>
        </ul>

        <div class="definition-box">
          <div class="definition-term">Legal and Ethical Concerns</div>
          <div class="definition-text">Computing systems that harm individuals or groups raise legal liability (discrimination, privacy violations) and ethical obligations (fairness, transparency, protecting vulnerable groups).</div>
        </div>

        <ul class="bullet-list">
          <li><strong>Framework for Ethical Choices:</strong></li>
          <li>Identify impacts: Who benefits? Who might be harmed?</li>
          <li>Check rights: Does it respect privacy, IP, autonomy?</li>
          <li>Ensure equity: Does it exclude or disadvantage groups?</li>
          <li>Build accountability: Can people understand and contest decisions?</li>
        </ul>
      </div>
    `
  },
  {
    title: "Terms Matching Game",
    tag: "Practice",
    content: `
      <div class="lesson-section">
        <div class="section-tag">Practice</div>
        <h2 class="section-title">Test Your Knowledge</h2>
        
        <p class="lesson-body">Match each term to its definition. Click terms in the left column to select them, then click matching definitions on the right.</p>

        <div class="match-game" id="match-game">
          <div class="match-grid" id="match-grid"></div>
          <div id="match-feedback" style="display:none;"></div>
        </div>
      </div>
    `
  }
];

const matchingTerms = [
  { term: "Copyright", def: "Exclusive rights protecting creative works from creation" },
  { term: "Plagiarism", def: "Using someone's work without credit or permission" },
  { term: "Open Source", def: "Software freely available for use and modification" },
  { term: "Creative Commons", def: "System of licenses granting explicit permissions" },
  { term: "Digital Divide", def: "Unequal access to technology and resulting opportunities" },
  { term: "Algorithm Bias", def: "Discriminatory outcomes from computing systems" },
  { term: "Open Access", def: "Research freely available without access restrictions" },
  { term: "Intellectual Property", def: "Creative works with commercial or social value" }
];

const scenarios = [
  {
    caseNum: "01", total: "06",
    concept: "Intellectual Property + Copyright",
    title: "The Beat Drop",
    narrative: "Riley spent months creating a YouTube documentary about her school's robotics team. To set the right tone, she used a popular chart-topping song as the background music throughout the video. Within 48 hours of posting, YouTube flagged the video and redirected all ad revenue to the record label. Riley had no idea this would happen.",
    question: "What should Riley have done before using the song in her video?",
    choices: [
      {
        label: "A",
        text: "Credit the artist in the video description. This counts as proper attribution and satisfies copyright requirements.",
        correct: false,
        feedback: "Crediting the artist does not replace the need for permission. Copyright gives creators exclusive rights over how their work is reproduced and distributed. Attribution alone does not make it legal to use copyrighted material."
      },
      {
        label: "B",
        text: "Obtain a license from the rights holder, or use royalty-free or Creative Commons licensed music.",
        correct: true,
        feedback: "Copyright protects intellectual property. To legally use someone else's music, you must either get a license or use music explicitly free to use (royalty-free or Creative Commons licensed)."
      },
      {
        label: "C",
        text: "Keep the video set to private. Private videos are not subject to copyright law.",
        correct: false,
        feedback: "Copyright protection applies regardless of whether content is public or private. Distribution method does not affect intellectual property rights."
      }
    ],
    conceptCard: [
      { name: "Intellectual Property", def: "Creative work with value that is legally protected." },
      { name: "Copyright", def: "Exclusive rights protecting creators from the moment of creation." }
    ]
  },
  {
    caseNum: "02", total: "06",
    concept: "Plagiarism + Open Source",
    title: "The GitHub Grab",
    narrative: "Marcus is building an app for his AP CSP project and finds a perfectly written function on a public GitHub repository. He copies the code directly into his project without any attribution and submits it. His teacher runs the work through an academic integrity checker and finds the match. Marcus insists the code was on the internet and therefore free for anyone to use.",
    question: "What is wrong with Marcus's reasoning, and what should he have done?",
    choices: [
      {
        label: "A",
        text: "Nothing is wrong. Code posted publicly on the internet is in the public domain and free to use without citation.",
        correct: false,
        feedback: "This is a common misconception. Public code is NOT automatically free to use. Code is copyright protected from creation unless the author explicitly grants permission through a license."
      },
      {
        label: "B",
        text: "He should have checked the repository license and provided proper attribution to the original author.",
        correct: true,
        feedback: "Open source software has conditions. Most licenses require attribution. Using code without checking license terms and providing credit is plagiarism, even when publicly posted."
      },
      {
        label: "C",
        text: "He should have rewritten the code slightly so it would not match in an integrity checker.",
        correct: false,
        feedback: "Superficial changes do not make plagiarism legal. The problem is the absence of attribution and license compliance, not the degree of similarity."
      }
    ],
    conceptCard: [
      { name: "Plagiarism", def: "Presenting someone else's material as your own without credit." },
      { name: "Open Source", def: "Software freely available with conditions, usually requiring attribution." }
    ]
  },
  {
    caseNum: "03", total: "06",
    concept: "Creative Commons",
    title: "The Borrowed Photo",
    narrative: "Destiny is building a website for her community service project. She searches Google Images, finds beautiful photographs, and downloads them for her site. She adds captions with each photographer's name. A few weeks after launch, she receives a legal notice demanding payment from the photography agency that owns the images.",
    question: "Where did Destiny go wrong, and what is the correct approach?",
    choices: [
      {
        label: "A",
        text: "She should have gotten her teacher's permission before using images from the internet.",
        correct: false,
        feedback: "Teacher permission does not override copyright law. Photographs are protected by copyright unless the rights holder grants permission. A teacher cannot authorize someone else's intellectual property."
      },
      {
        label: "B",
        text: "She should have specifically searched for Creative Commons licensed images and attributed them according to the license terms.",
        correct: true,
        feedback: "Creative Commons licenses explicitly state permissions. Searching for CC licensed images and following license terms is both legal and ethical. Naming the photographer alone does not grant reproduction rights."
      },
      {
        label: "C",
        text: "Non-profit and school projects are exempt from copyright law under educational fair use.",
        correct: false,
        feedback: "No blanket educational exemption exists. Fair use is narrowly defined and does not cover using full commercial photographs on public websites, even for good causes."
      }
    ],
    conceptCard: [
      { name: "Creative Commons", def: "Licenses that explicitly permit sharing while respecting creator rights." }
    ]
  },
  {
    caseNum: "04", total: "06",
    concept: "Digital Divide",
    title: "Two Schools",
    narrative: "Maplewood School has fiber-optic internet, a one-to-one laptop program, and a dedicated technology lab with up-to-date equipment. Five miles away, Riverside School operates with fifteen-year-old desktops, no reliable internet access, and no upgrade budget. The city council has received a technology grant and must decide how to distribute it.",
    question: "Which decision best addresses the core ethical concern in this scenario?",
    choices: [
      {
        label: "A",
        text: "Divide the grant equally between both schools regardless of their existing resources.",
        correct: false,
        feedback: "Equal distribution does not address inequity. A school with strong infrastructure benefits far less from funds than one with critical gaps. Equity requires investing more in those with less."
      },
      {
        label: "B",
        text: "Award the grant to Riverside to provide students there with equitable access to technology.",
        correct: true,
        feedback: "The digital divide is about unequal access. When technology is essential for education, students without access fall behind. Prioritizing Riverside addresses the ethical imperative toward equitable opportunity."
      },
      {
        label: "C",
        text: "Let each school fundraise independently. Government should not choose between public institutions.",
        correct: false,
        feedback: "This ignores structural causes of the digital divide. Low-income schools cannot fundraise as effectively as wealthy ones. Independence deepens inequality rather than reducing it."
      }
    ],
    conceptCard: [
      { name: "Digital Divide", def: "Unequal access to technology and resulting opportunity gaps." }
    ]
  },
  {
    caseNum: "05", total: "06",
    concept: "Algorithm Bias + Legal/Ethical Concerns",
    title: "The Biased Bot",
    narrative: "TechHire Corp deployed an AI resume screening tool to handle thousands of job applications. After six months, a data analyst found that the algorithm was rejecting 38 percent more applications from women than from men with equivalent qualifications and experience. The company's legal team argues the system was never programmed to consider gender, so there is no liability.",
    question: "How should TechHire respond to this finding?",
    choices: [
      {
        label: "A",
        text: "Continue using the system. Since gender was never an input variable, the algorithm is neutral by design.",
        correct: false,
        feedback: "Algorithms learn and reproduce bias from historical data even without explicit inputs. A system trained on biased hiring data perpetuates patterns. Neutral intent does not guarantee neutral outcomes. Responsibility is based on harm caused."
      },
      {
        label: "B",
        text: "Audit the training data and model, retrain it with balanced data, and add a human review layer.",
        correct: true,
        feedback: "Companies have legal and ethical obligations to audit, correct, and monitor systems. Unintentional bias still causes real harm and can violate anti-discrimination laws. Responsible design requires action."
      },
      {
        label: "C",
        text: "Shut down all automated hiring tools immediately. AI cannot be used ethically for consequential decisions.",
        correct: false,
        feedback: "Avoidance is not the solution. Tools can be used ethically with proper auditing, representative data, and human oversight. The goal is responsible design, not abandonment of innovation."
      }
    ],
    conceptCard: [
      { name: "Algorithm Bias", def: "Discriminatory outcomes even without intentional programming." },
      { name: "Legal/Ethical Concerns", def: "Systems causing harm raise legal liability and ethical obligations." }
    ]
  },
  {
    caseNum: "06", total: "06",
    concept: "Open Access",
    title: "The Paywall Problem",
    narrative: "Jasmine is writing a research paper on climate change for her AP Environmental Science class. She finds the ideal peer-reviewed study but it sits behind a publisher paywall charging forty-two dollars for access. A classmate tells her the full paper can be downloaded from an unauthorized file-sharing site. Jasmine is torn between her deadline and doing the right thing.",
    question: "What is the most ethical and legal way for Jasmine to access the research?",
    choices: [
      {
        label: "A",
        text: "Download it from the unauthorized file-sharing site. Researchers want their work to be read as widely as possible.",
        correct: false,
        feedback: "Even with good intentions, downloading from illegal sites violates copyright. The copyright holder's intent is irrelevant to the legal status of the action."
      },
      {
        label: "B",
        text: "Search for an Open Access version of the paper, check her school library database, or contact the author directly.",
        correct: true,
        feedback: "Open Access papers exist in free repositories (PubMed Central, arXiv). Schools provide database access. Researchers respond to direct requests for their own work. All are legal."
      },
      {
        label: "C",
        text: "Cite only the publicly available abstract. This avoids any copyright issue and is good enough.",
        correct: false,
        feedback: "While citing only legal content is safe, it unnecessarily limits research. Open Access versions often exist and should be sought before limiting scope."
      }
    ],
    conceptCard: [
      { name: "Open Access", def: "Research freely available without access or use restrictions." }
    ]
  }
];

let currentIdx = 0;
let currentLessonIdx = 0;
let score = 0;
let answered = false;
let caseResults = [];
let matchState = { selected: null, matched: new Set() };

function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function goHome() {
  currentIdx = 0;
  currentLessonIdx = 0;
  score = 0;
  answered = false;
  caseResults = [];
  matchState = { selected: null, matched: new Set() };
  showScreen('home-screen');
}

function goToLesson() {
  currentLessonIdx = 0;
  loadLesson();
  showScreen('lesson-screen');
}

function loadLesson() {
  const lesson = lessonModules[currentLessonIdx];
  const pct = (currentLessonIdx / lessonModules.length) * 100;
  
  document.getElementById('lesson-nav-fill').style.width = pct + '%';
  document.getElementById('lesson-label').textContent = 'Lesson ' + (currentLessonIdx + 1) + ' of ' + lessonModules.length;
  document.getElementById('lesson-content').innerHTML = lesson.content;
  
  document.getElementById('btn-prev-lesson').disabled = currentLessonIdx === 0;
  document.getElementById('btn-next-lesson').textContent = currentLessonIdx === lessonModules.length - 1 ? 'Begin Investigation' : 'Next';
  
  if (currentLessonIdx === lessonModules.length - 1) {
    loadMatchGame();
  }
}

function loadMatchGame() {
  const grid = document.getElementById('match-grid');
  const shuffled = [...matchingTerms].sort(() => Math.random() - 0.5);
  
  matchState = { selected: null, matched: new Set() };
  grid.innerHTML = '';
  
  const leftCol = document.createElement('div');
  leftCol.className = 'match-column';
  
  matchingTerms.forEach((item, idx) => {
    const btn = document.createElement('div');
    btn.className = 'match-item';
    btn.textContent = item.term;
    btn.id = 'term-' + idx;
    btn.onclick = () => selectMatchTerm(idx, btn);
    leftCol.appendChild(btn);
  });
  
  grid.appendChild(leftCol);
  
  const divider = document.createElement('div');
  divider.className = 'match-divider';
  grid.appendChild(divider);
  
  const rightCol = document.createElement('div');
  rightCol.className = 'match-column';
  
  shuffled.forEach((item, idx) => {
    const btn = document.createElement('div');
    btn.className = 'match-item';
    btn.textContent = item.def;
    btn.id = 'def-' + idx;
    btn.onclick = () => matchPair(item, btn);
    rightCol.appendChild(btn);
  });
  
  grid.appendChild(rightCol);
}

function selectMatchTerm(idx, btn) {
  if (matchState.matched.has(idx)) return;
  
  document.querySelectorAll('.match-item.selected').forEach(el => el.classList.remove('selected'));
  btn.classList.add('selected');
  matchState.selected = idx;
}

function matchPair(item, defBtn) {
  if (matchState.selected === null || matchState.matched.has(matchState.selected)) return;
  
  const termBtn = document.getElementById('term-' + matchState.selected);
  const term = lessonModules[8].tag === 'Practice' ? matchingTerms[matchState.selected].term : null;
  
  if (matchingTerms[matchState.selected].term === item.term) {
    termBtn.classList.add('matched');
    defBtn.classList.add('matched');
    matchState.matched.add(matchState.selected);
    
    termBtn.classList.remove('selected');
    matchState.selected = null;
    
    if (matchState.matched.size === matchingTerms.length) {
      const feedback = document.getElementById('match-feedback');
      feedback.innerHTML = '<strong>Perfect!</strong> You matched all terms. Ready to test your knowledge with real cases?';
      feedback.style.display = 'block';
    }
  } else {
    defBtn.style.opacity = '0.5';
    setTimeout(() => { defBtn.style.opacity = '1'; }, 500);
  }
}

function prevLesson() {
  if (currentLessonIdx > 0) {
    currentLessonIdx--;
    loadLesson();
  }
}

function nextLesson() {
  if (currentLessonIdx < lessonModules.length - 1) {
    currentLessonIdx++;
    loadLesson();
  } else {
    startGame();
  }
}

function startGame() {
  currentIdx = 0;
  score = 0;
  answered = false;
  caseResults = [];
  showScreen('game-screen');
  loadCase();
}

function restartGame() { startGame(); }

function loadCase() {
  const s = scenarios[currentIdx];
  answered = false;

  const pct = (currentIdx / scenarios.length) * 100;
  document.getElementById('prog-bar').style.width = pct + '%';
  document.getElementById('case-label').textContent = 'Case ' + s.caseNum + ' of ' + s.total;
  document.getElementById('score-val').textContent = score;
  document.getElementById('concept-tag').textContent = s.concept;
  document.getElementById('case-title').textContent = s.title;
  document.getElementById('narrative-text').textContent = s.narrative;
  document.getElementById('question-text').textContent = s.question;

  const container = document.getElementById('choices-container');
  container.innerHTML = '';
  s.choices.forEach((choice, idx) => {
    const btn = document.createElement('button');
    btn.className = 'choice-btn';
    btn.innerHTML = '<span class="choice-lbl">' + choice.label + '</span><span class="choice-text">' + choice.text + '</span>';
    btn.onclick = () => selectAnswer(idx);
    container.appendChild(btn);
  });

  const fp = document.getElementById('feedback-panel');
  fp.classList.remove('show');
  document.getElementById('btn-next').style.display = 'none';
}

function selectAnswer(idx) {
  if (answered) return;
  answered = true;

  const s = scenarios[currentIdx];
  const choice = s.choices[idx];
  const buttons = document.querySelectorAll('.choice-btn');

  buttons.forEach((btn, i) => {
    btn.disabled = true;
    if (s.choices[i].correct) btn.classList.add('is-correct');
    if (i === idx && !choice.correct) btn.classList.add('is-wrong');
  });

  const isCorrect = choice.correct;
  if (isCorrect) {
    score++;
    const sv = document.getElementById('score-val');
    sv.textContent = score;
    sv.classList.remove('pop');
    void sv.offsetWidth;
    sv.classList.add('pop');
  }

  caseResults.push({ title: s.title, correct: isCorrect });

  const badge = document.getElementById('feedback-badge');
  badge.textContent = isCorrect ? 'Correct' : 'Incorrect';
  badge.className = 'feedback-status-badge ' + (isCorrect ? 'ok' : 'no');
  document.getElementById('feedback-text').textContent = choice.feedback;

  const termList = document.getElementById('term-list');
  termList.innerHTML = '';
  s.conceptCard.forEach(term => {
    const row = document.createElement('div');
    row.className = 'term-row';
    row.innerHTML = '<span class="term-name">' + term.name + '</span><span class="term-def">' + term.def + '</span>';
    termList.appendChild(row);
  });

  const fp = document.getElementById('feedback-panel');
  fp.classList.add('show');

  const nb = document.getElementById('btn-next');
  nb.style.display = 'block';
  nb.textContent = currentIdx < scenarios.length - 1 ? 'Next Case' : 'View Results';

  setTimeout(() => { fp.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); }, 150);
}

function nextCase() {
  currentIdx++;
  if (currentIdx >= scenarios.length) {
    showResults();
  } else {
    showScreen('game-screen');
    loadCase();
  }
}

function showResults() {
  showScreen('results-screen');

  document.getElementById('prog-bar').style.width = '100%';
  document.getElementById('res-score').textContent = score;

  let badge, msg;
  if (score === 6) {
    badge = "Ethics Champion";
    msg = "Perfect score. You have strong command of computing ethics and intellectual property law. Fully prepared for AP CSP ethics questions.";
  } else if (score >= 4) {
    badge = "Digital Defender";
    msg = "Solid work. You understand core principles. Review missed cases and focus on distinctions between copyright, Creative Commons, and open source.";
  } else if (score >= 2) {
    badge = "Ethical Explorer";
    msg = "Good foundation to build on. Focus on the difference between copyright, Creative Commons, and open source, and why intent does not eliminate legal responsibility.";
  } else {
    badge = "Case Reopened";
    msg = "Ethics rewards careful thinking. Review concept cards for each case and play again. Every case connects directly to AP exam material.";
  }

  document.getElementById('res-badge').textContent = badge;
  document.getElementById('res-msg').textContent = msg;

  const listEl = document.getElementById('case-results-list');
  listEl.innerHTML = '';
  caseResults.forEach((r, i) => {
    const row = document.createElement('div');
    row.className = 'case-result-row';
    row.innerHTML = '<span class="case-result-name">Case ' + String(i + 1).padStart(2, '0') + ' ' + r.title + '</span><span class="result-mark ' + (r.correct ? 'yes' : 'nope') + '">' + (r.correct ? 'Correct' : 'Incorrect') + '</span>';
    listEl.appendChild(row);
  });
}
</script>
</body>
</html>