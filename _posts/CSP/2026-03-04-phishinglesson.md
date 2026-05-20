---
layout: post
title: 5.6 Safe Computing
description: IOC-2 — threats, defenses, and encryption
type: lessons
permalink: /attacks
---
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
<title>5.6 Safe Computing — Threats, Defenses & Encryption</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Barlow+Condensed:wght@400;700;900&display=swap" rel="stylesheet">
<style>
/* ── RESET ── */
*, *::before, *::after { box-sizing: border-box; }
* { -webkit-tap-highlight-color: transparent; }

:root {
  --page:        #0b0b18;
  --card:        #111128;
  --panel:       #1a1938;
  --panel-hi:    #242248;
  --panel-deep:  #0e0e22;
  --border:      #2e2c6a;
  --border-hi:   #7b74e8;
  --accent:      #5548d9;
  --accent-glow: rgba(85,72,217,.35);
  --accent-hi:   #9d96f5;
  --red:         #e05555;
  --red-dim:     #8a2020;
  --red-bg:      #1f0d0d;
  --green:       #3ecf82;
  --green-bg:    #0d1f14;
  --amber:       #f0a340;
  --amber-bg:    #1e1200;
  --teal:        #3edfc8;
  --white:       #ffffff;
  --soft:        #d8d4ff;
  --muted:       #8880c0;
  --mono:        'Share Tech Mono', monospace;
  --display:     'Barlow Condensed', system-ui, sans-serif;
}

body {
  margin: 0;
  padding: 28px 16px 48px;
  background: var(--page);
  background-image:
    radial-gradient(ellipse 80% 40% at 15% 0%,   rgba(85,72,217,.18) 0%, transparent 70%),
    radial-gradient(ellipse 60% 30% at 85% 100%,  rgba(62,207,200,.08) 0%, transparent 70%);
  min-height: 100vh;
  font-family: var(--display);
  display: flex;
  justify-content: center;
  color: var(--soft);
}

#app {
  width: 100%;
  max-width: 1100px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* ═══════════════════════════════
   LESSON CARD
═══════════════════════════════ */
.lesson-card {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 20px;
  padding: 26px 28px;
  box-shadow: 0 0 0 1px rgba(85,72,217,.08), 0 12px 40px rgba(0,0,0,.5);
}
.lesson-header h2 {
  font-size: 30px; font-weight: 900; letter-spacing: .5px;
  color: var(--white); margin: 0 0 8px;
}
.lesson-header p {
  color: var(--muted); font-size: 14px; line-height: 1.65;
  margin: 0 0 22px; font-family: system-ui, sans-serif;
}

/* Tabs */
.tab-nav { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 22px; }
.sc-tab {
  padding: 6px 16px; border-radius: 20px; border: 1px solid var(--border);
  background: var(--panel); cursor: pointer; font-size: 13px; font-weight: 700;
  color: var(--muted); font-family: var(--display); letter-spacing: .5px; transition: all .15s;
}
.sc-tab:hover  { background: var(--panel-hi); color: var(--soft); border-color: var(--border-hi); }
.sc-tab.active { background: var(--accent); color: #fff; border-color: var(--accent-hi); box-shadow: 0 0 12px var(--accent-glow); }

.sc-section        { display: none; }
.sc-section.active { display: block; }

.sc-label {
  font-size: 11px; font-weight: 700; letter-spacing: .12em; text-transform: uppercase;
  color: var(--muted); margin-bottom: 14px; font-family: var(--mono);
}
.sc-chevron { transition: transform .2s; flex-shrink: 0; }

/* Threats */
.sc-threat-btn {
  width: 100%; text-align: left; background: var(--panel); border: 1px solid var(--border);
  border-radius: 8px; padding: 12px 16px; cursor: pointer;
  display: flex; align-items: center; gap: 12px;
  transition: background .15s, border-color .15s; margin-bottom: 6px; font-family: var(--display);
}
.sc-threat-btn:hover  { background: var(--panel-hi); }
.sc-threat-btn.active { border-color: var(--border-hi); background: var(--panel-hi); margin-bottom: 0; border-radius: 8px 8px 0 0; }

.sc-threat-body {
  display: none; margin-bottom: 6px; border: 1px solid var(--border); border-top: none;
  border-radius: 0 0 8px 8px; padding: 16px; background: var(--panel-deep); font-family: system-ui, sans-serif;
}
.sc-threat-body.open { display: block; }
.sc-pill { display: inline-block; font-size: 11px; font-weight: 600; padding: 2px 9px; border-radius: 20px; letter-spacing: .03em; }

/* Layers */
.sc-layer-row {
  display: flex; align-items: center; gap: 12px; padding: 10px 14px; border-radius: 8px;
  border: 1px solid var(--border); margin-bottom: 6px; cursor: pointer;
  transition: background .15s; background: var(--panel);
}
.sc-layer-row:hover  { background: var(--panel-hi); }
.sc-layer-row.active { border-color: var(--border-hi); border-radius: 8px 8px 0 0; margin-bottom: 0; }
.sc-layer-detail {
  display: none; font-size: 13px; color: var(--soft); line-height: 1.6;
  padding: 12px 16px 14px 48px; background: var(--panel-deep);
  border: 1px solid var(--border); border-top: none;
  border-radius: 0 0 8px 8px; margin-bottom: 6px; font-family: system-ui, sans-serif;
}
.sc-layer-detail.open { display: block; }

/* Encryption */
.enc-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 12px; margin-bottom: 20px; }
.enc-card { background: var(--panel); border: 1px solid var(--border); border-radius: 12px; padding: 16px 20px; }
.enc-card.featured { border-color: var(--border-hi); border-width: 2px; }
.enc-icon { width: 32px; height: 32px; border-radius: 8px; background: var(--panel-hi); display: flex; align-items: center; justify-content: center; font-size: 16px; flex-shrink: 0; }
.enc-flow { display: flex; align-items: center; gap: 6px; font-size: 12px; flex-wrap: wrap; margin-top: 12px; }
.enc-node { background: var(--panel-hi); border-radius: 4px; padding: 2px 8px; color: var(--soft); }
.enc-arrow { color: var(--muted); }
.ca-box { background: var(--panel); border-left: 3px solid var(--border-hi); padding: 14px 18px; border-radius: 4px; }

/* Quiz */
.quiz-wrap { border: 1px solid var(--border); border-radius: 12px; overflow: hidden; }
.sc-quiz-q {
  padding: 14px 16px; cursor: pointer; display: flex; justify-content: space-between;
  align-items: center; gap: 8px; border-bottom: 1px solid var(--border);
  background: var(--panel); transition: background .15s; font-family: system-ui, sans-serif;
}
.sc-quiz-q:hover { background: var(--panel-hi); }
.sc-quiz-a {
  display: none; padding: 14px 16px; font-size: 14px; line-height: 1.6;
  color: var(--soft); background: var(--panel-deep); border-bottom: 1px solid var(--border);
  font-family: system-ui, sans-serif;
}
.sc-quiz-a.open { display: block; }
.score-bar-lesson {
  display: none; margin-top: 16px; padding: 14px 16px; background: var(--panel);
  border-radius: 8px; font-size: 14px; color: var(--soft); border: 1px solid var(--border);
}
.vocab-footer {
  margin-top: 20px; border-top: 1px solid var(--border); padding-top: 16px;
  font-size: 13px; color: var(--muted); line-height: 1.6; font-family: system-ui, sans-serif;
}

/* ═══════════════════════════════
   CLASS GAME CARD
═══════════════════════════════ */
.class-game-card {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 0 0 1px rgba(85,72,217,.08), 0 12px 40px rgba(0,0,0,.5);
}

.cg-header {
  padding: 20px 24px 0;
}
.cg-eyebrow {
  font-family: var(--mono); font-size: 11px; letter-spacing: .15em;
  text-transform: uppercase; color: var(--muted); margin-bottom: 6px;
}
.cg-title {
  font-size: 24px; font-weight: 900; color: var(--white);
  letter-spacing: .5px; margin-bottom: 4px;
}
.cg-sub {
  font-size: 13px; color: var(--muted); margin-bottom: 18px;
  font-family: system-ui, sans-serif; line-height: 1.5;
}

/* mode toggle */
.cg-mode-bar {
  display: flex; gap: 8px; padding: 0 24px 16px; flex-wrap: wrap; align-items: center;
}
.cg-mode-btn {
  padding: 5px 14px; border-radius: 20px; border: 1px solid var(--border);
  background: var(--panel); color: var(--muted); cursor: pointer;
  font-family: var(--display); font-size: 12px; letter-spacing: .5px; transition: all .15s;
}
.cg-mode-btn:hover  { background: var(--panel-hi); color: var(--soft); }
.cg-mode-btn.active { background: var(--accent); color: #fff; border-color: var(--accent-hi); }

/* scoreboard */
.cg-scores {
  display: flex; gap: 10px; padding: 0 24px 16px; flex-wrap: wrap;
}
.cg-score-chip {
  background: var(--panel); border: 1px solid var(--border); border-radius: 8px;
  padding: 8px 16px; font-family: var(--mono); font-size: 11px; color: var(--muted);
}
.cg-score-chip b { color: var(--white); font-size: 18px; display: block; }

/* timer bar */
.cg-timer-wrap { height: 4px; background: var(--panel-deep); }
.cg-timer-bar  { height: 100%; background: var(--accent); transition: width .1s linear, background .5s; }
.cg-timer-bar.warn   { background: var(--amber); }
.cg-timer-bar.urgent { background: var(--red); }

/* question area */
.cg-question-area { padding: 20px 24px 0; }

.cg-question-box {
  background: var(--panel-deep); border: 1px solid var(--border); border-radius: 14px;
  padding: clamp(16px,3vw,28px) clamp(16px,3vw,28px);
  font-size: clamp(15px,2.5vw,22px); color: var(--soft); line-height: 1.6;
  min-height: 90px; display: flex; align-items: center;
  margin-bottom: 16px; font-family: system-ui, sans-serif;
}

/* vote bars — shown in class mode */
.cg-vote-display {
  display: none; background: var(--panel-deep); border: 1px solid var(--border);
  border-radius: 12px; padding: 14px 18px; margin-bottom: 16px;
}
.cg-vote-display.show { display: block; }
.cg-vote-row { display: flex; align-items: center; gap: 12px; margin-bottom: 8px; }
.cg-vote-label { font-family: var(--mono); font-size: 12px; width: 56px; flex-shrink: 0; }
.cg-vote-track { flex: 1; height: 26px; background: var(--panel); border-radius: 6px; overflow: hidden; position: relative; }
.cg-vote-fill  { height: 100%; border-radius: 6px; transition: width .5s ease; display: flex; align-items: center; padding-left: 10px; }
.cg-vote-count { font-family: var(--display); font-size: 14px; color: #fff; font-weight: 700; }

/* TF buttons */
.cg-tf-btns { display: flex; gap: 12px; margin-bottom: 14px; }
.cg-tf-btn {
  flex: 1; padding: clamp(12px,2vw,20px); border-radius: 12px; border: none;
  font-family: var(--display); font-size: clamp(18px,3vw,30px); letter-spacing: 1px;
  cursor: pointer; transition: all .15s;
}
.cg-tf-btn.true-btn  { background: var(--green-bg); color: var(--green); border: 2px solid #1a5030; }
.cg-tf-btn.true-btn:hover  { background: #0d2a1a; }
.cg-tf-btn.false-btn { background: var(--red-bg);   color: var(--red);   border: 2px solid var(--red-dim); }
.cg-tf-btn.false-btn:hover { background: #2a0808; }
.cg-tf-btn:disabled  { opacity: .35; cursor: default; }
.cg-tf-btn.flash-correct { background: var(--green) !important; color: #fff !important; }
.cg-tf-btn.flash-wrong   { background: var(--red)   !important; color: #fff !important; }

/* reveal button */
.cg-reveal-btn {
  width: 100%; padding: 13px; border-radius: 10px; border: none;
  background: var(--accent); color: #fff; font-family: var(--display);
  font-size: 15px; letter-spacing: .5px; cursor: pointer; transition: .15s;
  margin-bottom: 12px; display: none;
}
.cg-reveal-btn:hover { background: #6658e8; }
.cg-reveal-btn.show  { display: block; }

/* feedback */
.cg-feedback {
  font-size: clamp(12px,1.8vw,15px); min-height: 20px; line-height: 1.55;
  padding: 11px 14px; border-radius: 10px; margin: 0 24px 16px;
  display: none; font-family: system-ui, sans-serif;
}
.cg-feedback.show          { display: block; }
.cg-feedback.correct       { background: var(--green-bg); color: var(--green); border: 1px solid #1a5030; }
.cg-feedback.incorrect     { background: var(--red-bg);   color: var(--red);   border: 1px solid var(--red-dim); }

/* game result */
.cg-result {
  text-align: center; padding: 32px 24px; display: none;
}
.cg-result.show    { display: block; }
.cg-result-emoji   { font-size: 52px; margin-bottom: 12px; }
.cg-result-title   { font-size: 26px; font-weight: 900; color: var(--white); margin-bottom: 8px; }
.cg-result-sub     { font-size: 14px; color: var(--muted); margin-bottom: 22px; line-height: 1.6; max-width: 420px; margin-left: auto; margin-right: auto; font-family: system-ui, sans-serif; }
.cg-play-btn {
  padding: 10px 28px; border-radius: 10px; border: none; background: var(--accent);
  color: #fff; font-family: var(--display); font-size: 14px; letter-spacing: .5px;
  cursor: pointer; transition: .15s; margin: 4px;
}
.cg-play-btn:hover { background: #6658e8; }
.cg-play-btn.sec   { background: var(--panel); color: var(--soft); border: 1px solid var(--border); }
.cg-play-btn.sec:hover { background: var(--panel-hi); }

/* ═══════════════════════════════
   PHISHING LAKE GAME
   position:relative is KEY so
   modal stays inside the game
═══════════════════════════════ */
#gameRoot {
  position: relative;          /* modal anchors here, NOT the page */
  background: #0d1520;
  border: 1px solid var(--border);
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 0 0 1px rgba(85,72,217,.08), 0 12px 40px rgba(0,0,0,.6);
}

canvas {
  display: block; width: 100%; height: auto;
  aspect-ratio: 900 / 420; cursor: crosshair;
}

#infoBar {
  padding: 10px 18px 12px; background: rgba(17,17,40,.95);
  border-bottom: 1px solid var(--border); min-height: 72px;
  transition: background .3s, border-color .3s; font-family: system-ui, sans-serif;
}
#infoBar.safe   { background: rgba(13,31,20,.95); border-bottom-color: #2a7a50; }
#infoBar.danger { background: rgba(31,13,13,.95); border-bottom-color: var(--red-dim); }

#infoTitle {
  font-size: 11px; font-weight: 700; letter-spacing: 2.5px; color: var(--muted);
  margin-bottom: 4px; font-family: var(--mono); text-transform: uppercase;
}
#infoTitle.safe   { color: var(--green); }
#infoTitle.danger { color: var(--red); }
#infoBody { font-size: 13px; color: var(--soft); line-height: 1.5; max-width: 700px; }
#infoTip  { font-size: 11px; color: var(--muted); margin-top: 4px; font-family: var(--mono); letter-spacing: .3px; }

#hud {
  display: flex; justify-content: space-between; align-items: center;
  padding: 8px 18px; background: rgba(14,14,28,.95);
  border-top: 1px solid var(--border); flex-wrap: wrap; gap: 8px;
}
.stat { font-size: 13px; color: var(--muted); letter-spacing: .5px; font-family: var(--mono); }
.stat span      { font-size: 16px; margin-left: 6px; color: var(--soft); }
.stat.bad  span { color: var(--red); }
.stat.good span { color: var(--green); }
#resetBtn {
  background: var(--panel); border: 1px solid var(--border); color: var(--soft);
  font-family: var(--display); font-weight: 700; font-size: 13px;
  letter-spacing: 1px; padding: 5px 18px; border-radius: 5px; cursor: pointer; transition: .15s;
}
#resetBtn:hover { background: var(--panel-hi); border-color: var(--border-hi); color: var(--white); }

/* ── MODAL: absolute inside #gameRoot so it covers ONLY the game ── */
#modal {
  position: absolute;   /* relative to #gameRoot */
  inset: 0;
  display: none;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: rgba(8,8,20,.82);
  z-index: 10;
  backdrop-filter: blur(4px);
}
#modal.show { display: flex; }

#modalBox {
  background: var(--card); border: 1px solid var(--border-hi);
  border-radius: 12px; padding: 22px 26px; max-width: 440px; width: 90%;
  animation: popIn .18s ease-out;
  box-shadow: 0 0 40px rgba(85,72,217,.25), 0 8px 32px rgba(0,0,0,.6);
  font-family: system-ui, sans-serif;
}
@keyframes popIn { from { transform: scale(.9); opacity: 0; } to { transform: scale(1); opacity: 1; } }

#modalHeader     { font-size: 10px; letter-spacing: 3px; color: var(--red); font-family: var(--mono); margin-bottom: 6px; text-transform: uppercase; }
#modalThreatName { font-size: 22px; font-weight: 900; color: var(--white); letter-spacing: .5px; margin-bottom: 4px; font-family: var(--display); }
#modalTagline    { font-size: 13px; color: var(--muted); margin-bottom: 10px; font-style: italic; }
#modalExplain    { font-size: 13px; color: var(--soft); line-height: 1.55; margin-bottom: 12px; border-left: 3px solid var(--red-dim); padding-left: 12px; }
#modalPrompt     { font-size: 13px; font-weight: 700; color: var(--soft); margin-bottom: 12px; }
.mc-line {
  font-family: var(--mono); font-size: 11px; color: #e08080; background: var(--red-bg);
  border-radius: 4px; padding: 8px 12px; margin-bottom: 12px; line-height: 1.5;
  border-left: 3px solid var(--red-dim);
}
.modal-btns { display: flex; gap: 10px; }
.modal-btns button {
  flex: 1; padding: 9px 0; font-family: var(--display); font-weight: 900;
  font-size: 14px; letter-spacing: 1px; border: none; border-radius: 5px; cursor: pointer; transition: .12s;
}
#btnGiveIn       { background: var(--red); color: #fff; }
#btnGiveIn:hover { background: #f07070; }
#btnReject       { background: var(--green-bg); color: var(--green); border: 1px solid #1e6040; }
#btnReject:hover { background: #132b1e; }

@media (max-width: 700px) {
  body { padding: 12px 12px 32px; }
  .lesson-card, .class-game-card { padding: 16px; }
  .cg-question-area, .cg-mode-bar, .cg-scores, .cg-header { padding-left: 16px; padding-right: 16px; }
  .cg-feedback { margin-left: 16px; margin-right: 16px; }
}
</style>
</head>
<body>
<div id="app">

  <!-- ══════════════════════════════
       1. LESSON
  ══════════════════════════════ -->
  <div class="lesson-card">
    <div class="lesson-header">
      <h2>5.6 Safe Computing</h2>
      <p>Knowing <em>what</em> PII is (from 5.5) is only half the picture. Now we look at <strong>how it gets stolen</strong>, <strong>how systems get compromised</strong>, and <strong>how to defend against it</strong> — all part of College Board's IOC-2 standards.</p>
    </div>

    <nav class="tab-nav" id="tabNav">
      <button class="sc-tab active" data-tab="sc-threats">Threats</button>
      <button class="sc-tab" data-tab="sc-defense">Defense layers</button>
      <button class="sc-tab" data-tab="sc-encryption">Encryption</button>
      <button class="sc-tab" data-tab="sc-quiz">Knowledge check</button>
    </nav>

    <div id="sc-threats" class="sc-section active">
      <p class="sc-label">IOC-2.C — how attackers get in</p>
      <div id="threatList"></div>
    </div>

    <div id="sc-defense" class="sc-section">
      <p class="sc-label">IOC-2.B — defense in depth</p>
      <p style="font-size:14px;color:var(--soft);margin-bottom:16px;line-height:1.6;font-family:system-ui,sans-serif">Good security is layered — if one fails, the next holds. Click each layer to expand.</p>
      <div id="layerList"></div>
    </div>

    <div id="sc-encryption" class="sc-section">
      <p class="sc-label">IOC-2.B.5 — encryption types</p>
      <div class="enc-grid">
        <div class="enc-card">
          <div style="display:flex;align-items:center;gap:10px;margin-bottom:12px">
            <div class="enc-icon">🔐</div>
            <span style="font-weight:700;font-size:15px;color:var(--white)">Symmetric</span>
            <span class="sc-pill" style="background:var(--panel-hi);color:var(--soft);margin-left:auto">1 key</span>
          </div>
          <p style="font-size:13px;color:var(--soft);line-height:1.6;margin:0;font-family:system-ui,sans-serif">One shared key handles both encryption and decryption. Fast and efficient, but both parties must securely share the key beforehand.</p>
          <div class="enc-flow">
            <span class="enc-node">Sender</span><span class="enc-arrow">— key →</span>
            <span class="enc-node">encrypt</span><span class="enc-arrow">— key →</span>
            <span class="enc-node">decrypt</span>
          </div>
        </div>
        <div class="enc-card featured">
          <div style="display:flex;align-items:center;gap:10px;margin-bottom:12px">
            <div class="enc-icon">🔑</div>
            <span style="font-weight:700;font-size:15px;color:var(--white)">Public key</span>
            <span class="sc-pill" style="background:var(--panel-hi);color:var(--soft);margin-left:auto">2 keys</span>
          </div>
          <p style="font-size:13px;color:var(--soft);line-height:1.6;margin:0;font-family:system-ui,sans-serif">A public key encrypts, a private key decrypts. Anyone can encrypt a message for you — only you can read it with your private key.</p>
          <div class="enc-flow">
            <span class="enc-node">public key</span><span class="enc-arrow">→ encrypt</span>
            <span style="color:var(--muted)">·</span>
            <span class="enc-node">private key</span><span class="enc-arrow">→ decrypt</span>
          </div>
        </div>
      </div>
      <div class="ca-box">
        <p style="font-weight:700;font-size:14px;color:var(--white);margin:0 0 6px;font-family:var(--display);letter-spacing:.3px">Certificate authorities (CAs)</p>
        <p style="font-size:13px;color:var(--soft);line-height:1.6;margin:0;font-family:system-ui,sans-serif">CAs issue digital certificates that prove a public key genuinely belongs to who claims to own it. This trust model is what makes HTTPS work — your browser checks the certificate before trusting the connection.</p>
      </div>
    </div>

    <div id="sc-quiz" class="sc-section">
      <p class="sc-label">5 questions — click to reveal</p>
      <div class="quiz-wrap" id="quizList"></div>
      <div class="score-bar-lesson" id="scoreBar"></div>
    </div>

    <div class="vocab-footer">
      <strong style="color:var(--soft)">Key Vocabulary</strong> — Phishing, Keylogging, Rogue access point, Malware, Virus, MFA, Symmetric encryption, Public key encryption, Certificate authority.<br>
      Remember: Security isn't about being paranoid — it's about being intentional.
    </div>
  </div>

  <!-- ══════════════════════════════
       2. CLASS MINI GAME — True or False
       Works both solo & projected
  ══════════════════════════════ -->
  <div class="class-game-card" id="classGameCard">

    <div class="cg-header">
      <div class="cg-eyebrow">Class activity · IOC-2</div>
      <div class="cg-title">✅ True or False — Cyber Attacks</div>
      <div class="cg-sub">Solo: answer before the timer runs out. Class projected: teacher reads the question aloud, students vote, then click <strong>Reveal Answer</strong>.</div>
    </div>

    <div class="cg-mode-bar">
      <span style="font-family:var(--mono);font-size:11px;color:var(--muted);margin-right:4px;text-transform:uppercase;letter-spacing:.1em">Mode:</span>
      <button class="cg-mode-btn active" id="btnModeSolo"  onclick="setCGMode('solo')">Solo</button>
      <button class="cg-mode-btn"        id="btnModeClass" onclick="setCGMode('class')">📽️ Class Projected</button>
      <span style="flex:1"></span>
      <button class="cg-mode-btn" onclick="startCG()" style="border-color:var(--border-hi);color:var(--soft);">↺ New round</button>
    </div>

    <div class="cg-scores">
      <div class="cg-score-chip"><b id="cgCorrect">0</b>Correct</div>
      <div class="cg-score-chip"><b id="cgWrong">0</b>Wrong</div>
      <div class="cg-score-chip"><b id="cgQNum">1</b>/ 10</div>
      <div class="cg-score-chip" id="cgTimerChip" style="display:none"><b id="cgTimerNum">10</b>Seconds</div>
    </div>

    <div class="cg-timer-wrap"><div class="cg-timer-bar" id="cgTimerBar" style="width:100%"></div></div>

    <div class="cg-question-area">
      <div class="cg-question-box" id="cgQuestion">Loading…</div>

      <div class="cg-vote-display" id="cgVoteDisplay">
        <div class="cg-vote-row">
          <span class="cg-vote-label" style="color:var(--green);">TRUE</span>
          <div class="cg-vote-track"><div class="cg-vote-fill" id="cgVoteFillT" style="width:0%;background:var(--green);"><span class="cg-vote-count" id="cgVoteCountT">0</span></div></div>
        </div>
        <div class="cg-vote-row">
          <span class="cg-vote-label" style="color:var(--red);">FALSE</span>
          <div class="cg-vote-track"><div class="cg-vote-fill" id="cgVoteFillF" style="width:0%;background:var(--red);"><span class="cg-vote-count" id="cgVoteCountF">0</span></div></div>
        </div>
      </div>

      <div class="cg-tf-btns" id="cgTFBtns">
        <button class="cg-tf-btn true-btn"  id="cgBtnTrue"  onclick="answerCG(true)">✓ TRUE</button>
        <button class="cg-tf-btn false-btn" id="cgBtnFalse" onclick="answerCG(false)">✗ FALSE</button>
      </div>

      <button class="cg-reveal-btn" id="cgRevealBtn" onclick="revealCG()">👁️ Reveal Answer to Class</button>
    </div>

    <div class="cg-feedback" id="cgFeedback"></div>

    <div class="cg-result" id="cgResult">
      <div class="cg-result-emoji" id="cgResultEmoji">🎯</div>
      <div class="cg-result-title" id="cgResultTitle">Round complete!</div>
      <div class="cg-result-sub"   id="cgResultSub"></div>
      <button class="cg-play-btn"     onclick="startCG()">Play Again</button>
      <button class="cg-play-btn sec" onclick="document.getElementById('cgResult').classList.remove('show');document.getElementById('cgQuestionWrap').style.display=''">Close</button>
    </div>

  </div>

  <!-- ══════════════════════════════
       3. PHISHING LAKE GAME
       modal is INSIDE #gameRoot
  ══════════════════════════════ -->
  <div id="gameRoot">
    <div id="infoBar">
      <div id="infoTitle">PHISHING LAKE — SECURITY TRAINING</div>
      <div id="infoBody">Click on fish to intercept threats. Red fish carry cyberattacks — green fish are safe behaviors. React fast before threats swim past.</div>
      <div id="infoTip">TIP: Real phishers use urgency, fear, and fake authority to steal your data.</div>
    </div>
    <canvas id="gc" width="900" height="420"></canvas>
    <div id="hud">
      <div class="stat good">SECURE <span id="ss">0</span></div>
      <div class="stat bad">BREACHED <span id="bs">0</span></div>
      <button id="resetBtn">NEW SESSION</button>
    </div>

    <!-- Modal INSIDE #gameRoot — covers only the canvas game -->
    <div id="modal">
      <div id="modalBox">
        <div id="modalHeader">THREAT INTERCEPTED</div>
        <div id="modalThreatName"></div>
        <div id="modalTagline"></div>
        <div id="modalExplain"></div>
        <div class="mc-line" id="mcLine"></div>
        <div id="modalPrompt"></div>
        <div class="modal-btns">
          <button id="btnGiveIn">Hand Over PII</button>
          <button id="btnReject">Reject &amp; Report</button>
        </div>
      </div>
    </div>
  </div>

</div><!-- /#app -->

<script>
// ═══════════════════════════
// LESSON LOGIC
// ═══════════════════════════
(function () {
  const threats = [
    { icon:"🎣", name:"Phishing",         tag:"Credential theft",  tagBg:"#2a0d0d", tagColor:"#ff9090",
      what:"Fake emails or sites impersonating trusted sources to harvest your login credentials or PII.",
      example:"An email from 'your bank' leads to a pixel-perfect fake login page. You enter your password — and the attacker has it.",
      tip:"Always inspect the actual URL in the address bar, not just the display text of a hyperlink." },
    { icon:"⌨️", name:"Keylogging",        tag:"Surveillance",      tagBg:"#1e1200", tagColor:"#f0a340",
      what:"Malware that silently records every keystroke to capture passwords and sensitive messages.",
      example:"A free pirated app bundles a keylogger that streams every password you type to an attacker's server.",
      tip:"Only install software from official, trusted sources. Run regular antivirus scans." },
    { icon:"📶", name:"Rogue access point",tag:"Network intercept", tagBg:"#0a1e1a", tagColor:"#3edfc8",
      what:"A fake Wi-Fi hotspot set up by an attacker to intercept and read traffic passing through it.",
      example:"'Free_Airport_WiFi' is run by an attacker capturing every unencrypted request you send.",
      tip:"Use a VPN on public Wi-Fi. Verify hotspot names with staff before connecting." },
    { icon:"🔗", name:"Malicious links",   tag:"Drive-by install",  tagBg:"#1e1200", tagColor:"#f0a340",
      what:"Links or files that install malware, redirect to phishing pages, or exploit browser bugs when clicked.",
      example:"A hacked friend's account DMs you a 'Google Doc' link that silently installs spyware.",
      tip:"Hover over links to preview their real destination URL before clicking." },
    { icon:"🦠", name:"Malware & viruses", tag:"System compromise", tagBg:"#2a0d0d", tagColor:"#ff9090",
      what:"Software that damages systems or grants attackers control. Viruses self-replicate by attaching to legitimate programs.",
      example:"A virus bundled in a software installer copies itself to every USB drive plugged into the infected machine.",
      tip:"Keep your OS and all apps updated — most attacks exploit already-patched vulnerabilities." }
  ];
  const layers = [
    { icon:"🔑", label:"Layer 1 — Strong passwords",        detail:"Easy for you to recall, hard for others to guess. Avoid birthdays or dictionary words. A passphrase like 'correct-horse-battery-staple' beats 'P@ssw0rd' every time. Use a password manager." },
    { icon:"📱", label:"Layer 2 — Multi-factor auth (MFA)", detail:"Combines something you know (password), something you have (phone/token), and/or something you are (biometric). Even a leaked password can't unlock your account without the second factor." },
    { icon:"🔒", label:"Layer 3 — Encryption",              detail:"Scrambles data in transit and at rest so unauthorized parties can't read it. Symmetric uses one shared key; public key encryption uses a key pair — public to encrypt, private to decrypt." },
    { icon:"⬆️", label:"Layer 4 — Software updates",        detail:"Most successful attacks exploit known vulnerabilities that already have patches available. Enabling automatic updates closes those doors before attackers walk through them." },
    { icon:"🛡️", label:"Layer 5 — Antivirus & permissions", detail:"Antivirus scans for known malware signatures and quarantines threats. Review app permissions regularly — does your flashlight app really need access to your contacts and microphone?" }
  ];
  const questions = [
    { q:"An email asks you to click a link and verify your bank account. What attack type is this?",  a:"Phishing — the attacker impersonates a trusted institution to trick you into entering credentials on a fake site." },
    { q:"What is the difference between a virus and malware?",                                        a:"Malware is the broad category — any software that damages or takes control of a system. A virus is a specific kind that self-replicates by attaching to legitimate programs." },
    { q:"You log in with a password and a code sent to your phone. What is this called?",             a:"Multi-factor authentication (MFA) — combining something you know (password) with something you have (your phone)." },
    { q:"Why is connecting to free public Wi-Fi risky?",                                              a:"Attackers can set up rogue access points. Data sent through them can be intercepted, read, and modified — especially without a VPN or HTTPS." },
    { q:"In public key encryption, what does the sender use to encrypt a message?",                   a:"The receiver's public key. Only the receiver's matching private key can decrypt it, so the message is secure even if the public key is widely shared." }
  ];

  const tl = document.getElementById('threatList');
  threats.forEach(t => {
    const wrap = document.createElement('div');
    const btn  = document.createElement('button');
    btn.className = 'sc-threat-btn';
    btn.innerHTML = `<span style="font-size:18px">${t.icon}</span><span style="font-weight:700;font-size:14px;color:#fff;flex:1">${t.name}</span><span class="sc-pill" style="background:${t.tagBg};color:${t.tagColor}">${t.tag}</span><svg class="sc-chevron" width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 5l4 4 4-4" stroke="#8880c0" stroke-width="1.5" stroke-linecap="round"/></svg>`;
    const body = document.createElement('div');
    body.className = 'sc-threat-body';
    body.innerHTML = `<p style="font-size:13px;color:#d8d4ff;line-height:1.6;margin-bottom:12px">${t.what}</p><div style="background:#1a1938;border:1px solid #2e2c6a;border-radius:8px;padding:10px 14px;margin-bottom:12px"><p style="font-size:11px;font-weight:700;color:#8880c0;text-transform:uppercase;letter-spacing:.07em;margin-bottom:5px;font-family:'Share Tech Mono',monospace">Example</p><p style="font-size:13px;color:#d8d4ff;line-height:1.5;margin:0">${t.example}</p></div><p style="font-size:13px;color:#d8d4ff;line-height:1.5;margin:0"><span style="font-weight:700;color:#9d96f5">💡 Tip:</span> ${t.tip}</p>`;
    btn.addEventListener('click', () => {
      const open = body.classList.contains('open');
      document.querySelectorAll('.sc-threat-body.open').forEach(b => b.classList.remove('open'));
      document.querySelectorAll('.sc-threat-btn.active').forEach(b => { b.classList.remove('active'); b.querySelector('.sc-chevron').style.transform = ''; });
      if (!open) { body.classList.add('open'); btn.classList.add('active'); btn.querySelector('.sc-chevron').style.transform = 'rotate(180deg)'; }
    });
    wrap.append(btn, body); tl.appendChild(wrap);
  });

  const ll = document.getElementById('layerList');
  layers.forEach(l => {
    const row = document.createElement('div'); row.className = 'sc-layer-row';
    row.innerHTML = `<div style="width:28px;height:28px;border-radius:50%;background:#242248;display:flex;align-items:center;justify-content:center;font-size:14px;flex-shrink:0">${l.icon}</div><span style="font-weight:700;font-size:14px;color:#fff;flex:1">${l.label}</span><svg class="sc-chevron" width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 5l4 4 4-4" stroke="#8880c0" stroke-width="1.5" stroke-linecap="round"/></svg>`;
    const detail = document.createElement('div'); detail.className = 'sc-layer-detail'; detail.textContent = l.detail;
    row.addEventListener('click', () => {
      const open = detail.classList.contains('open');
      document.querySelectorAll('.sc-layer-detail.open').forEach(d => d.classList.remove('open'));
      document.querySelectorAll('.sc-layer-row.active').forEach(r => { r.classList.remove('active'); r.querySelector('.sc-chevron').style.transform = ''; });
      if (!open) { detail.classList.add('open'); row.classList.add('active'); row.querySelector('.sc-chevron').style.transform = 'rotate(180deg)'; }
    });
    ll.append(row, detail);
  });

  let revealed = 0;
  const ql = document.getElementById('quizList');
  questions.forEach((q, i) => {
    const qDiv = document.createElement('div'); qDiv.className = 'sc-quiz-q';
    qDiv.innerHTML = `<span style="font-size:14px;color:#d8d4ff;line-height:1.5">Q${i+1}: ${q.q}</span><span style="font-size:12px;color:#8880c0;white-space:nowrap;flex-shrink:0;font-family:'Share Tech Mono',monospace">Reveal</span>`;
    const aDiv = document.createElement('div'); aDiv.className = 'sc-quiz-a';
    aDiv.innerHTML = `<span style="font-weight:700;color:#9d96f5">Answer:</span> ${q.a}`;
    let open = false;
    qDiv.addEventListener('click', () => {
      open = !open; aDiv.classList.toggle('open', open);
      qDiv.querySelector('span:last-child').textContent = open ? 'Hide' : 'Reveal';
      if (open && ++revealed === questions.length) {
        const sb = document.getElementById('scoreBar'); sb.style.display = 'block';
        sb.innerHTML = '<span style="font-weight:700;color:#fff">All done!</span> Great work reviewing 5.6.';
      }
    });
    ql.append(qDiv, aDiv);
  });

  document.getElementById('tabNav').addEventListener('click', e => {
    const tab = e.target.closest('.sc-tab'); if (!tab) return;
    document.querySelectorAll('.sc-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.sc-section').forEach(s => s.classList.remove('active'));
    tab.classList.add('active');
    document.getElementById(tab.dataset.tab).classList.add('active');
  });
})();

// ═══════════════════════════
// CLASS GAME — TRUE OR FALSE
// ═══════════════════════════
const CG_QUESTIONS = [
  { q:"Phishing attacks always contain spelling errors that make them easy to spot.", answer:false, explain:"Modern phishing emails are often polished and pixel-perfect. The real giveaway is the sender's actual domain and suspicious URLs." },
  { q:"Ransomware encrypts your files and demands payment to restore them.", answer:true, explain:"Correct. Ransomware is designed to encrypt data and extort victims. Offline backups are the only reliable defense." },
  { q:"A rogue access point is a legitimate Wi-Fi hotspot provided by a business.", answer:false, explain:"A rogue access point is a FAKE hotspot created by an attacker to intercept all your traffic." },
  { q:"Social engineering attacks rely on technical software exploits to get in.", answer:false, explain:"Social engineering uses psychological manipulation, not technical hacks. It targets human behavior and trust." },
  { q:"A virus requires a user to open or run an infected file in order to spread.", answer:true, explain:"Unlike worms, viruses need human action — opening a file or running a program — to execute and replicate." },
  { q:"Paying a ransomware demand always guarantees you will get your files back.", answer:false, explain:"Paying rarely guarantees recovery. Attackers often demand more or disappear. Only offline backups are reliable." },
  { q:"Using HTTPS helps protect against man-in-the-middle attacks.", answer:true, explain:"HTTPS encrypts the connection end-to-end, making it much harder for an attacker to read or alter intercepted traffic." },
  { q:"Keyloggers can only be installed by someone with physical access to your computer.", answer:false, explain:"Keyloggers are often installed remotely via malicious downloads, email attachments, or browser exploits." },
  { q:"Multi-factor authentication (MFA) can stop most phishing attacks from succeeding.", answer:true, explain:"Even if phishing steals your password, MFA requires a second factor — your phone — that the attacker doesn't have." },
  { q:"Malware is a specific type of virus.", answer:false, explain:"It's the other way around. Malware is the broad category. A virus is one specific type alongside ransomware, spyware, worms, etc." },
];

let cgState = {};

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function updateCGTimer(pct) {
  const bar = document.getElementById('cgTimerBar');
  bar.style.width = pct + '%';
  bar.className = 'cg-timer-bar' + (pct < 30 ? ' urgent' : pct < 60 ? ' warn' : '');
}

function setCGMode(mode) {
  cgState.mode = mode;
  document.getElementById('btnModeSolo').classList.toggle('active',  mode === 'solo');
  document.getElementById('btnModeClass').classList.toggle('active', mode === 'class');
  document.getElementById('cgTimerChip').style.display = mode === 'solo' ? '' : 'none';
  startCG();
}

function startCG() {
  clearInterval(cgState.timerInterval);
  document.getElementById('cgResult').classList.remove('show');

  cgState = {
    ...cgState,
    pool: shuffle([...CG_QUESTIONS]).slice(0, 10),
    idx: 0, correct: 0, wrong: 0,
    answered: false, revealed: false,
    timerInterval: null, timeLeft: 10,
    mode: cgState.mode || 'solo'
  };

  document.getElementById('cgCorrect').textContent = 0;
  document.getElementById('cgWrong').textContent   = 0;
  document.getElementById('cgQNum').textContent    = 1;
  document.getElementById('cgFeedback').className  = 'cg-feedback';
  document.getElementById('cgFeedback').textContent = '';
  renderCGQ();
}

function renderCGQ() {
  const s = cgState;
  if (s.idx >= s.pool.length) { endCG(); return; }

  const q = s.pool[s.idx];
  document.getElementById('cgQuestion').textContent = q.q;
  document.getElementById('cgFeedback').className = 'cg-feedback';
  document.getElementById('cgFeedback').textContent = '';
  document.getElementById('cgBtnTrue').disabled  = false;
  document.getElementById('cgBtnFalse').disabled = false;
  document.getElementById('cgBtnTrue').className  = 'cg-tf-btn true-btn';
  document.getElementById('cgBtnFalse').className = 'cg-tf-btn false-btn';
  document.getElementById('cgVoteDisplay').classList.remove('show');
  document.getElementById('cgQNum').textContent = s.idx + 1;
  s.answered = false; s.revealed = false;

  const isClass = s.mode === 'class';
  const revBtn  = document.getElementById('cgRevealBtn');

  if (isClass) {
    // Class mode: no timer, show Reveal button
    updateCGTimer(100);
    revBtn.classList.add('show');
    revBtn.textContent = '👁️ Reveal Answer to Class';
  } else {
    // Solo mode: 10-second timer, hide Reveal button
    revBtn.classList.remove('show');
    clearInterval(s.timerInterval);
    s.timeLeft = 10;
    document.getElementById('cgTimerNum').textContent = 10;
    updateCGTimer(100);
    s.timerInterval = setInterval(() => {
      s.timeLeft -= 0.1;
      document.getElementById('cgTimerNum').textContent = Math.ceil(s.timeLeft);
      updateCGTimer(Math.max(0, s.timeLeft / 10 * 100));
      if (s.timeLeft <= 0) { clearInterval(s.timerInterval); if (!s.answered) answerCG(null); }
    }, 100);
  }
}

function revealCG() {
  const s = cgState;
  // After reveal, button advances to next question
  if (s.revealed) {
    s.idx++;
    document.getElementById('cgCorrect').textContent = s.correct;
    document.getElementById('cgWrong').textContent   = s.wrong;
    setTimeout(renderCGQ, 200);
    return;
  }
  s.revealed = true;

  // Simulated class vote for visual engagement
  const tv = Math.floor(Math.random() * 14) + 3;
  const fv = Math.floor(Math.random() * 14) + 3;
  const total = tv + fv;
  document.getElementById('cgVoteDisplay').classList.add('show');
  document.getElementById('cgVoteFillT').style.width = (tv / total * 100) + '%';
  document.getElementById('cgVoteFillF').style.width = (fv / total * 100) + '%';
  document.getElementById('cgVoteCountT').textContent = tv;
  document.getElementById('cgVoteCountF').textContent = fv;

  const q = s.pool[s.idx];
  showCGFeedback(q.answer, q.explain);

  document.getElementById('cgBtnTrue').disabled  = true;
  document.getElementById('cgBtnFalse').disabled = true;
  if (q.answer) document.getElementById('cgBtnTrue').classList.add('flash-correct');
  else          document.getElementById('cgBtnFalse').classList.add('flash-correct');

  document.getElementById('cgRevealBtn').textContent = '→ Next Question';
}

function answerCG(given) {
  const s = cgState;
  if (s.mode === 'class') { revealCG(); return; }
  if (s.answered) return;
  s.answered = true;
  clearInterval(s.timerInterval);

  const q       = s.pool[s.idx];
  const correct = given === q.answer;

  if (given === true)  document.getElementById('cgBtnTrue').classList.add(correct ? 'flash-correct' : 'flash-wrong');
  if (given === false) document.getElementById('cgBtnFalse').classList.add(correct ? 'flash-correct' : 'flash-wrong');
  if (given === null)  {
    document.getElementById('cgBtnTrue').classList.add('flash-wrong');
    document.getElementById('cgBtnFalse').classList.add('flash-wrong');
  }

  document.getElementById('cgBtnTrue').disabled  = true;
  document.getElementById('cgBtnFalse').disabled = true;

  if (correct) s.correct++; else s.wrong++;
  document.getElementById('cgCorrect').textContent = s.correct;
  document.getElementById('cgWrong').textContent   = s.wrong;

  showCGFeedback(correct, (given === null ? 'Time up! ' : '') + (correct ? '' : 'Incorrect. ') + q.explain, correct);
  s.idx++;
  setTimeout(renderCGQ, 2500);
}

function showCGFeedback(correct, text, isCorrect) {
  // when called from revealCG, correct is the answer boolean
  const fb = document.getElementById('cgFeedback');
  const q  = cgState.pool[cgState.idx];
  const ans = (typeof isCorrect !== 'undefined') ? isCorrect : correct;
  fb.className = 'cg-feedback show ' + (ans ? 'correct' : 'incorrect');
  fb.textContent = (correct === true || correct === false)
    ? (q ? (correct ? '✓ TRUE — ' : '✗ FALSE — ') + q.explain : text)
    : text;
  // Handle revealCG calling pattern
  if (typeof text === 'string' && text.length > 3) fb.textContent = (q && typeof correct === 'boolean' ? (correct ? '✓ TRUE — ' : '✗ FALSE — ') : '') + text;
}

function endCG() {
  clearInterval(cgState.timerInterval);
  document.getElementById('cgResult').classList.add('show');
  const isClass = cgState.mode === 'class';
  if (isClass) {
    document.getElementById('cgResultEmoji').textContent = '📽️';
    document.getElementById('cgResultTitle').textContent = 'Class round complete!';
    document.getElementById('cgResultSub').textContent   = 'All 10 questions covered. Start a new round with a fresh shuffle, or move on to Phishing Lake below.';
  } else {
    const pct = Math.round(cgState.correct / cgState.pool.length * 100);
    document.getElementById('cgResultEmoji').textContent = pct >= 80 ? '🎯' : pct >= 60 ? '👍' : '📚';
    document.getElementById('cgResultTitle').textContent = pct >= 80 ? 'Excellent!' : pct >= 60 ? 'Not bad!' : 'Keep reviewing!';
    document.getElementById('cgResultSub').textContent   = `You got ${cgState.correct} / ${cgState.pool.length} correct (${pct}%). Now try Phishing Lake below!`;
  }
}

// init game on load
window.addEventListener('DOMContentLoaded', () => {
  cgState.mode = 'solo';
  startCG();
});

// ═══════════════════════════
// PHISHING LAKE CANVAS GAME
// ═══════════════════════════
(function () {
  const canvas = document.getElementById('gc');
  const ctx    = canvas.getContext('2d');
  const W = 900, H = 420;
  let secureScore = 0, breaches = 0, gameActive = true;
  let fish = [], spawnTimer = 20, pendingFish = null;

  const threats = [
    { label:"PHISH",  full:"Phishing Email",     tagline:"Impersonates a trusted brand to steal credentials",
      explain:"Attackers spoof logos and sender addresses. The link leads to a cloned login page that harvests your username and password. Credentials are sold or used immediately.",
      mc:'"Your account is suspended. Verify your identity NOW or lose access permanently."',
      piiAsk:'They ask: "Enter your email and password to verify your account." — What do you do?' },
    { label:"RANSOM", full:"Ransomware",          tagline:"Encrypts all your files and demands payment",
      explain:"Once executed, ransomware silently encrypts every document on your system. A ransom note demands Bitcoin within 72 hours. Paying rarely recovers data.",
      mc:'"Your files are encrypted. Send 0.5 BTC to this wallet in 72 hours or they are deleted."',
      piiAsk:'They ask: "Enter your Bitcoin wallet to negotiate a reduced ransom." — What do you do?' },
    { label:"TROJAN", full:"Trojan Horse",        tagline:"Disguised as legitimate software — opens a backdoor",
      explain:"Looks like a PDF or free utility. When opened, it installs a remote-access trojan. Attackers gain full control: webcam, files, keystrokes, and banking.",
      mc:'"Hello, I am from IT Support. Please run this diagnostic tool so we can fix your connection."',
      piiAsk:'They ask: "Enter your employee ID and admin credentials to authorize the tool." — What do you do?' },
    { label:"SPYWARE",full:"Spyware / Keylogger", tagline:"Records every keystroke and screen — invisibly",
      explain:"Spyware runs silently, logging every key typed — capturing SSNs, credit cards, and passwords — then transmits them to a remote server.",
      mc:'"Unusual login activity. Re-enter your social security number and PIN to confirm your identity."',
      piiAsk:'They ask: "Provide your SSN and banking PIN to unlock your account." — What do you do?' },
    { label:"WORM",   full:"Network Worm",        tagline:"Self-replicates across every device on your network",
      explain:"Worms need no user action. Once inside one machine, they scan and infect every reachable device.",
      mc:'"This urgent security patch must be installed on all company devices now. Your manager approved this."',
      piiAsk:'They ask: "Enter your network login to authorize the patch deployment." — What do you do?' },
    { label:"FAKE",   full:"Fake Invoice / BEC",  tagline:"Business email compromise — redirects wire transfers",
      explain:"Attackers impersonate a CEO or vendor, requesting urgent wire transfers. No malware needed — just social engineering.",
      mc:'"Urgent: Update our bank account details for tomorrow\'s $48,000 wire. Do not call — I am in a meeting."',
      piiAsk:'They ask: "Confirm your company bank account number to process the transfer." — What do you do?' }
  ];
  const goodTypes = [
    { label:"MFA",    full:"Multi-Factor Auth",  tagline:"Second factor blocks stolen-credential attacks",
      explain:"Even if your password is captured, MFA requires a physical device or biometric. Stops over 99% of credential-stuffing attacks." },
    { label:"VERIFY", full:"Verify Sender",      tagline:"Check the real domain before clicking anything",
      explain:"Hover over links to reveal the true URL. Attackers use domains like 'paypa1.com'. One second of checking prevents total account compromise." },
    { label:"REPORT", full:"Report Phishing",    tagline:"Forward suspicious emails to your security team",
      explain:"Reporting protects every colleague who may receive the same lure. Security teams can block the domain before a breach." },
    { label:"BACKUP", full:"Offline Backup",     tagline:"Isolated backups defeat ransomware completely",
      explain:"Ransomware can only encrypt drives it can reach. Air-gapped backups let you restore everything with zero ransom paid." },
    { label:"FREEZE", full:"Credit Freeze",      tagline:"Prevents new accounts being opened in your name",
      explain:"After a breach, a freeze at all three credit bureaus blocks attackers from opening new accounts in your name instantly." }
  ];

  function rnd(a, b) { return a + Math.random() * (b - a); }
  function spawnFish() {
    const bad  = Math.random() < 0.55;
    const pool = bad ? threats : goodTypes;
    const data = {...pool[Math.floor(Math.random() * pool.length)]};
    const fl   = Math.random() < 0.5;
    return { id:Math.random(), x:fl?-55:W+55, y:rnd(265,H-60), r:36,
             type:bad?'bad':'good', data, facingRight:fl,
             vx:fl?rnd(.45,.85):rnd(-.85,-.45), phase:rnd(0,Math.PI*2), active:true };
  }
  function removeFish(f) { const i = fish.indexOf(f); if (i !== -1) fish.splice(i, 1); }
  function setInfoBar(title, body, tip, mode) {
    document.getElementById('infoBar').className = mode || '';
    const t = document.getElementById('infoTitle'); t.className = mode || ''; t.textContent = title;
    document.getElementById('infoBody').textContent = body;
    document.getElementById('infoTip').textContent  = tip;
  }
  function openModal(f) {
    pendingFish = f; const d = f.data;
    document.getElementById('modalHeader').textContent     = 'THREAT INTERCEPTED — ' + d.full.toUpperCase();
    document.getElementById('modalThreatName').textContent = d.label + ' — ' + d.full;
    document.getElementById('modalTagline').textContent    = d.tagline;
    document.getElementById('modalExplain').textContent    = d.explain;
    document.getElementById('mcLine').textContent          = 'Attacker says: ' + d.mc;
    document.getElementById('modalPrompt').textContent     = d.piiAsk;
    document.getElementById('modal').classList.add('show');
    gameActive = false;
  }
  function closeModal() {
    document.getElementById('modal').classList.remove('show');
    pendingFish = null;
    if (breaches < 8) gameActive = true;
  }

  document.getElementById('btnGiveIn').onclick = function () {
    if (!pendingFish) return;
    breaches++; document.getElementById('bs').textContent = breaches;
    const d = pendingFish.data; removeFish(pendingFish);
    setInfoBar('PII LEAKED — '+d.full.toUpperCase(), 'You handed over your information. '+d.explain,
      'Defense: verify every request. Never give PII under pressure or urgency.', 'danger');
    closeModal();
    if (breaches >= 8) {
      gameActive = false;
      setInfoBar('IDENTITY COMPROMISED — PRESS NEW SESSION',
        'You fell for '+breaches+' attacks. Your personal data is at risk. Review each threat type and try again.',
        'Core rule: Stop. Think. Verify. Never share PII under pressure.', 'danger');
    }
    canvas.style.transform = 'translateX(4px)'; setTimeout(() => { canvas.style.transform = ''; }, 100);
  };
  document.getElementById('btnReject').onclick = function () {
    if (!pendingFish) return;
    secureScore++; document.getElementById('ss').textContent = secureScore;
    const d = pendingFish.data; removeFish(pendingFish);
    setInfoBar('THREAT BLOCKED — '+d.full.toUpperCase(), 'Correct. You recognized and rejected the attack. '+d.explain,
      'Keep it up: report this to your security team so colleagues are protected too.', 'safe');
    closeModal();
  };

  canvas.addEventListener('click', function (e) {
    if (!gameActive) return;
    const rect = canvas.getBoundingClientRect();
    const sx = canvas.width / rect.width, sy = canvas.height / rect.height;
    const cx = (e.clientX - rect.left) * sx, cy = (e.clientY - rect.top) * sy;
    for (let i = fish.length - 1; i >= 0; i--) {
      const f = fish[i]; if (!f.active) continue;
      if (Math.hypot(cx - f.x, cy - f.y) <= f.r + 8) {
        f.active = false;
        if (f.type === 'bad') { openModal(f); }
        else {
          secureScore++; document.getElementById('ss').textContent = secureScore; removeFish(f);
          setInfoBar('SECURE ACTION — '+f.data.full.toUpperCase(), f.data.explain,
            'Well done. Secure behaviors protect you and your entire organization.', 'safe');
        }
        break;
      }
    }
  });
  canvas.addEventListener('touchstart', function (e) {
    e.preventDefault(); const t = e.touches[0];
    canvas.dispatchEvent(new MouseEvent('click', { clientX:t.clientX, clientY:t.clientY }));
  }, { passive:false });

  document.getElementById('resetBtn').onclick = function () {
    secureScore=0; breaches=0; fish=[]; gameActive=true;
    document.getElementById('ss').textContent = 0; document.getElementById('bs').textContent = 0;
    document.getElementById('modal').classList.remove('show'); pendingFish = null;
    setInfoBar('PHISHING LAKE — SECURITY TRAINING',
      'Click on fish to intercept threats. Red fish carry cyberattacks — green fish are safe behaviors. React fast before threats swim past.',
      'TIP: Real phishers use urgency, fear, and fake authority to steal your data.', '');
    for (let i = 0; i < 4; i++) fish.push(spawnFish()); spawnTimer = 20;
  };

  function drawFish(f) {
    const bob = Math.sin(Date.now() * .0025 + f.phase) * 4;
    const x = f.x, y = f.y + bob, bad = f.type === 'bad';
    ctx.save();
    if (!f.facingRight) { ctx.translate(x,y); ctx.scale(-1,1); ctx.translate(-x,-y); }
    ctx.beginPath(); ctx.ellipse(x,y,f.r,f.r*.62,0,0,Math.PI*2);
    ctx.fillStyle = bad ? '#c84040' : '#1e8a58'; ctx.fill();
    ctx.strokeStyle = bad ? '#ff7070' : '#3ecf82'; ctx.lineWidth = 2; ctx.stroke();
    ctx.beginPath(); ctx.moveTo(x-f.r+5,y); ctx.lineTo(x-f.r-15,y-14); ctx.lineTo(x-f.r-15,y+14);
    ctx.closePath(); ctx.fillStyle = bad ? '#8a2020' : '#126638'; ctx.fill();
    ctx.beginPath(); ctx.arc(x+f.r*.38,y-f.r*.2,5,0,Math.PI*2); ctx.fillStyle='#fff'; ctx.fill();
    ctx.beginPath(); ctx.arc(x+f.r*.42,y-f.r*.22,2.5,0,Math.PI*2); ctx.fillStyle='#111'; ctx.fill();
    ctx.restore();
    ctx.save();
    ctx.font = "bold 12px 'Share Tech Mono',monospace"; ctx.textAlign='center'; ctx.textBaseline='middle';
    ctx.fillStyle='#fff'; ctx.shadowColor='rgba(0,0,0,.8)'; ctx.shadowBlur=4;
    ctx.fillText(f.data.label, x, y); ctx.shadowBlur=0; ctx.restore();
  }

  function drawScene() {
    ctx.clearRect(0,0,W,H); const t = Date.now();
    const sky = ctx.createLinearGradient(0,0,0,215);
    sky.addColorStop(0,'#060812'); sky.addColorStop(1,'#0e1628');
    ctx.fillStyle = sky; ctx.fillRect(0,0,W,215);
    for (let s=0; s<60; s++) {
      ctx.globalAlpha = .2+.5*(.5+.5*Math.sin(t*.002+s));
      ctx.fillStyle='#fff'; ctx.fillRect(((s*137+t*.003)%W), 8+((s*97)%190), 1, 1);
    }
    ctx.globalAlpha=1;
    ctx.save(); const mx=W-80,my=52;
    ctx.shadowColor='rgba(160,180,255,.5)'; ctx.shadowBlur=28;
    ctx.fillStyle='#c8d4f8'; ctx.beginPath(); ctx.arc(mx,my,22,0,Math.PI*2); ctx.fill();
    ctx.fillStyle='#0e1628'; ctx.beginPath(); ctx.arc(mx+9,my-4,17,0,Math.PI*2); ctx.fill();
    ctx.shadowBlur=0; ctx.restore();
    ctx.fillStyle='#0a1a10';
    [[W*.12,215,80,44],[W*.28,218,60,36],[W*.5,212,90,50],[W*.72,216,70,40],[W*.88,218,66,38]].forEach(([hx,hy,rw,rh])=>{
      ctx.beginPath(); ctx.ellipse(hx,hy,rw,rh,0,0,Math.PI*2); ctx.fill();
    });
    ctx.fillStyle='#0c1a10'; ctx.fillRect(0,208,W,18);
    ctx.fillStyle='#0a1208'; ctx.fillRect(0,218,W,12);
    const water = ctx.createLinearGradient(0,228,0,H);
    water.addColorStop(0,'#0e1e38'); water.addColorStop(1,'#060e20');
    ctx.fillStyle=water; ctx.fillRect(0,228,W,H-228);
    const ref = ctx.createLinearGradient(W-100,228,W-100,H);
    ref.addColorStop(0,'rgba(200,212,255,.1)'); ref.addColorStop(1,'rgba(200,212,255,0)');
    ctx.fillStyle=ref; ctx.fillRect(W-160,228,160,H-228);
    ctx.strokeStyle='rgba(160,180,255,.1)'; ctx.lineWidth=1;
    for (let i=0; i<18; i++) {
      const rx=((i*130+t*.04)%W), ry=248+Math.sin(t*.0012+i*.8)*7;
      ctx.beginPath(); ctx.ellipse(rx,ry,32,5,0,0,Math.PI*2); ctx.stroke();
    }
    ctx.fillStyle='#1a1208'; ctx.fillRect(0,224,180,14);
    ctx.fillStyle='#100e06'; for(let p=0;p<6;p++) ctx.fillRect(p*32+8,225,6,28);
    // phisher figure
    const bx=115,by=185;
    ctx.fillStyle='#1a3a20'; ctx.beginPath(); ctx.ellipse(bx,by+8,24,36,0,0,Math.PI*2); ctx.fill();
    ctx.fillStyle='#c49060'; ctx.beginPath(); ctx.arc(bx,by-28,21,0,Math.PI*2); ctx.fill();
    ctx.fillStyle='#0e1e0c'; ctx.fillRect(bx-28,by-44,56,7); ctx.fillRect(bx-18,by-64,36,24);
    ctx.fillStyle='#0a0a0a';
    ctx.beginPath(); ctx.arc(bx-7,by-31,3,0,Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(bx+7,by-31,3,0,Math.PI*2); ctx.fill();
    ctx.strokeStyle='#1a3a20'; ctx.lineWidth=9;
    ctx.beginPath(); ctx.moveTo(bx+16,by-4); ctx.lineTo(bx+42,by-44); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(bx+40,by-46); ctx.lineTo(bx+240,by-88);
    ctx.lineWidth=7; ctx.strokeStyle='#6a4820'; ctx.stroke();
    ctx.lineWidth=2.5; ctx.strokeStyle='#b88830'; ctx.stroke();
    ctx.font="bold 11px 'Share Tech Mono',monospace"; ctx.textAlign='center';
    ctx.fillStyle='#3ecf82'; ctx.fillText('THE PHISHER',bx,by-72);
    ctx.textAlign='left';
    for (const f of fish) drawFish(f);
    const bx2=272+Math.sin(t*.006)*8, by2=208+Math.sin(t*.008)*5;
    ctx.beginPath(); ctx.moveTo(248,97); ctx.quadraticCurveTo(275,150,bx2,by2);
    ctx.strokeStyle='rgba(160,140,80,.4)'; ctx.lineWidth=1.5; ctx.stroke();
    ctx.beginPath(); ctx.arc(bx2,by2-4,6,Math.PI,0); ctx.fillStyle='#e04040'; ctx.fill();
    ctx.beginPath(); ctx.arc(bx2,by2+2,6,0,Math.PI);  ctx.fillStyle='#c0c0d8'; ctx.fill();
    if (!gameActive && breaches >= 8) {
      ctx.fillStyle='rgba(6,6,18,.9)'; ctx.fillRect(0,0,W,H);
      ctx.textAlign='center';
      ctx.font="bold 34px 'Barlow Condensed',sans-serif"; ctx.fillStyle='#e05555';
      ctx.fillText('IDENTITY COMPROMISED',W/2,H/2-18);
      ctx.font="15px 'Share Tech Mono',monospace"; ctx.fillStyle='#8880c0';
      ctx.fillText('Press NEW SESSION to try again',W/2,H/2+18);
      ctx.textAlign='left';
    }
  }

  function loop() {
    if (gameActive) {
      spawnTimer--;
      if (spawnTimer <= 0 && fish.length < 9) { fish.push(spawnFish()); spawnTimer = 55; }
      if (fish.length < 3) spawnTimer = Math.min(spawnTimer, 20);
      for (let i = fish.length - 1; i >= 0; i--) {
        fish[i].x += fish[i].vx;
        if (fish[i].x < -90 || fish[i].x > W + 90) fish.splice(i, 1);
      }
    }
    drawScene();
    requestAnimationFrame(loop);
  }

  for (let i = 0; i < 4; i++) fish.push(spawnFish());
  loop();
})();
</script>
</body>
</html>