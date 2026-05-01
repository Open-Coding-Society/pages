---
layout: opencs
title: IP & Ethics Review
description: AP CSP legal and ethical computing review
permalink: /legal_ethics/
---

<html lang="en">
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
@keyframes slideInLeft { from { opacity:0; transform:translateX(-20px); } to { opacity:1; transform:translateX(0); } }
@keyframes slideInRight { from { opacity:0; transform:translateX(20px); } to { opacity:1; transform:translateX(0); } }
@keyframes pulse { 0%, 100% { opacity:1; } 50% { opacity:0.6; } }
 
/* ────────────────────────────────────────────
   HOME / MENU SCREEN
──────────────────────────────────────────── */
#home-screen {
  justify-content: center;
  padding: 60px 24px;
}
 
.home-wrap {
  max-width: 700px;
  width: 100%;
}
 
.home-eyebrow {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  font-weight: 500;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--gold);
  margin-bottom: 28px;
  opacity: 0.75;
}
 
.home-title {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: clamp(52px, 10vw, 88px);
  font-weight: 900;
  line-height: 0.95;
  letter-spacing: -0.02em;
  color: var(--text);
  margin-bottom: 6px;
}
 
.home-title .accent { color: var(--gold); }
 
.home-sub {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: clamp(15px, 2.5vw, 19px);
  font-style: italic;
  font-weight: 400;
  color: var(--text-dim);
  margin-bottom: 40px;
}
 
.rule {
  width: 56px;
  height: 2px;
  background: var(--gold);
  opacity: 0.55;
  margin-bottom: 40px;
}
 
.home-desc {
  font-size: 15px;
  line-height: 1.82;
  color: var(--text-dim);
  margin-bottom: 48px;
  max-width: 580px;
}
 
.mode-selector {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 48px;
  margin-top: 32px;
}
 
.mode-card {
  display: flex;
  flex-direction: column;
  padding: 32px 24px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 3px;
  cursor: pointer;
  transition: all 0.25s;
  text-align: center;
}
 
.mode-card:hover {
  border-color: var(--gold);
  background: var(--gold-dim);
  transform: translateY(-3px);
}
 
.mode-card.lesson { border-color: var(--accent-blue); }
.mode-card.lesson:hover { 
  background: var(--accent-blue-dim);
  border-color: var(--accent-blue);
}
 
.mode-icon {
  font-size: 40px;
  margin-bottom: 14px;
}
 
.mode-title {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 8px;
  color: var(--text);
}
 
.mode-desc {
  font-size: 13px;
  line-height: 1.6;
  color: var(--text-muted);
}
 
.chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 24px;
}
 
.chip {
  font-family: 'JetBrains Mono', monospace;
  font-size: 9.5px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  padding: 5px 12px;
  border: 1px solid var(--border);
  border-radius: 2px;
  color: var(--text-muted);
  background: var(--surface);
}
 
/* ────────────────────────────────────────────
   LESSON SCREEN
──────────────────────────────────────────── */
#lesson-screen {
  align-items: stretch;
  padding-bottom: 80px;
}
 
.lesson-nav {
  width: 100%;
  height: 3px;
  background: var(--border);
  position: sticky;
  top: 0;
  z-index: 10;
}
.lesson-nav-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--accent-blue), #7da8c4);
  transition: width 0.55s cubic-bezier(0.4,0,0.2,1);
}
 
.lesson-inner {
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  padding: 0 24px;
}
 
.lesson-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 26px 0 34px;
}
 
.lesson-label {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10.5px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--accent-blue);
}
 
.lesson-progress {
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  color: var(--text-muted);
}
 
.lesson-section {
  margin-bottom: 48px;
  animation: slideUp 0.4s ease both;
}
 
.section-tag {
  display: inline-block;
  font-family: 'JetBrains Mono', monospace;
  font-size: 9.5px;
  letter-spacing: 0.13em;
  text-transform: uppercase;
  padding: 4px 11px;
  background: var(--accent-blue-dim);
  border: 1px solid rgba(90,143,176,0.28);
  border-radius: 2px;
  color: var(--accent-blue);
  margin-bottom: 18px;
}
 
.section-title {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: clamp(28px, 5.5vw, 44px);
  font-weight: 700;
  line-height: 1.12;
  margin-bottom: 24px;
  color: var(--text);
}
 
.lesson-body {
  font-size: 15.5px;
  line-height: 1.88;
  color: var(--text-dim);
  margin-bottom: 28px;
}
 
.lesson-body strong {
  color: var(--text);
  font-weight: 600;
}
 
.lesson-body em {
  color: var(--accent-blue);
  font-style: italic;
}
 
.key-point {
  background: var(--surface);
  border-left: 4px solid var(--accent-blue);
  border-radius: 0 2px 2px 0;
  padding: 18px 22px;
  margin: 24px 0;
  position: relative;
}
 
.key-point-label {
  font-family: 'JetBrains Mono', monospace;
  font-size: 8.5px;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--accent-blue);
  opacity: 0.8;
  margin-bottom: 10px;
}
 
.key-point-text {
  font-size: 15px;
  line-height: 1.8;
  color: var(--text);
}
 
.key-point-text em {
  color: var(--accent-blue);
}
 
.definition-box {
  background: var(--surface-2);
  border: 1px solid var(--border);
  border-radius: 2px;
  padding: 20px 24px;
  margin: 24px 0;
}
 
.definition-term {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10.5px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--accent-blue);
  margin-bottom: 8px;
}
 
.definition-text {
  font-size: 14.5px;
  line-height: 1.7;
  color: var(--text-dim);
}
 
.example-block {
  background: var(--surface);
  border: 1px dashed var(--border);
  border-radius: 2px;
  padding: 22px 24px;
  margin: 24px 0;
  position: relative;
}
 
.example-label {
  font-family: 'JetBrains Mono', monospace;
  font-size: 8.5px;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--text-muted);
  opacity: 0.7;
  margin-bottom: 12px;
}
 
.example-text {
  font-size: 14.5px;
  line-height: 1.8;
  color: var(--text-dim);
  font-style: italic;
}
 
.concept-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
  margin: 24px 0;
}
 
.concept-item {
  background: var(--surface);
  border: 1px solid var(--border);
  border-left: 3px solid var(--accent-blue);
  border-radius: 0 2px 2px 0;
  padding: 16px 18px;
}
 
.concept-item-name {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--accent-blue);
  margin-bottom: 8px;
}
 
.concept-item-def {
  font-size: 13.5px;
  line-height: 1.65;
  color: var(--text-dim);
}
 
.lesson-nav-buttons {
  display: flex;
  gap: 12px;
  justify-content: space-between;
  margin-top: 44px;
  padding-top: 32px;
  border-top: 1px solid var(--border);
}
 
.btn-nav {
  font-family: 'JetBrains Mono', monospace;
  font-size: 11.5px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  padding: 13px 24px;
  background: transparent;
  color: var(--text-muted);
  border: 1px solid var(--border);
  border-radius: 2px;
  cursor: pointer;
  transition: all 0.18s;
}
 
.btn-nav:hover:not(:disabled) {
  border-color: var(--accent-blue);
  color: var(--accent-blue);
  background: var(--accent-blue-dim);
}
 
.btn-nav:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
 
.btn-home {
  font-family: 'JetBrains Mono', monospace;
  font-size: 11.5px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  padding: 13px 24px;
  background: transparent;
  color: var(--text-muted);
  border: 1px solid var(--border);
  border-radius: 2px;
  cursor: pointer;
  transition: all 0.18s;
}
 
.btn-home:hover {
  border-color: var(--accent-blue);
  color: var(--accent-blue);
  background: var(--accent-blue-dim);
}
 
/* ────────────────────────────────────────────
   GAME SCREEN
──────────────────────────────────────────── */
#game-screen {
  align-items: stretch;
  padding-bottom: 80px;
}
 
.prog-bar-wrap {
  width: 100%;
  height: 3px;
  background: var(--border);
}
.prog-bar-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--gold), #e8c063);
  transition: width 0.55s cubic-bezier(0.4,0,0.2,1);
}
 
.game-inner {
  width: 100%;
  max-width: 760px;
  margin: 0 auto;
  padding: 0 24px;
}
 
.game-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 26px 0 34px;
}
 
.case-label {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10.5px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--text-muted);
}
 
.score-wrap {
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  color: var(--text-muted);
  display: flex;
  align-items: center;
  gap: 7px;
}
.score-val {
  font-size: 20px;
  font-weight: 700;
  color: var(--gold);
  transition: color 0.2s;
  display: inline-block;
}
.score-val.pop { animation: scalePop 0.38s ease; }
 
.concept-tag {
  display: inline-block;
  font-family: 'JetBrains Mono', monospace;
  font-size: 9.5px;
  letter-spacing: 0.13em;
  text-transform: uppercase;
  padding: 4px 11px;
  background: var(--gold-dim);
  border: 1px solid rgba(212,168,67,0.28);
  border-radius: 2px;
  color: var(--gold);
  margin-bottom: 18px;
}
 
.case-title {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: clamp(28px, 5.5vw, 44px);
  font-weight: 700;
  line-height: 1.12;
  margin-bottom: 30px;
  color: var(--text);
}
 
.narrative-box {
  background: var(--surface);
  border: 1px solid var(--border);
  border-left: 3px solid var(--gold);
  border-radius: 0 2px 2px 0;
  padding: 22px 26px;
  margin-bottom: 34px;
  position: relative;
}
 
.narrative-label {
  font-family: 'JetBrains Mono', monospace;
  font-size: 8.5px;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--gold);
  opacity: 0.7;
  margin-bottom: 12px;
}
 
.narrative-text {
  font-size: 14.5px;
  line-height: 1.85;
  color: var(--text-dim);
  font-style: italic;
}
 
.question-text {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 20px;
  font-weight: 600;
  line-height: 1.45;
  color: var(--text);
  margin-bottom: 22px;
}
 
.choices {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 30px;
}
 
.choice-btn {
  display: flex;
  align-items: flex-start;
  gap: 18px;
  width: 100%;
  padding: 19px 22px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 2px;
  cursor: pointer;
  text-align: left;
  font-family: 'Lora', Georgia, serif;
  color: var(--text);
  transition: border-color 0.18s, background 0.18s, transform 0.18s, box-shadow 0.18s;
}
 
.choice-btn:hover:not(:disabled) {
  border-color: rgba(212,168,67,0.5);
  background: var(--gold-dim);
  transform: translateX(4px);
}
 
.choice-btn:disabled { cursor: default; }
 
.choice-lbl {
  font-family: 'JetBrains Mono', monospace;
  font-size: 11.5px;
  font-weight: 700;
  color: var(--text-muted);
  min-width: 18px;
  flex-shrink: 0;
  padding-top: 3px;
  transition: color 0.2s;
}
 
.choice-text {
  font-size: 14.5px;
  line-height: 1.65;
  color: var(--text-dim);
  transition: color 0.2s;
}
 
.choice-btn.is-correct {
  border-color: var(--correct);
  background: var(--correct-dim);
  animation: correctSlide 0.3s ease;
}
.choice-btn.is-correct .choice-lbl { color: var(--correct); }
.choice-btn.is-correct .choice-text { color: var(--text); }
 
.choice-btn.is-wrong {
  border-color: var(--wrong);
  background: var(--wrong-dim);
  animation: shakeX 0.4s ease;
}
.choice-btn.is-wrong .choice-lbl { color: var(--wrong); }
 
.feedback-panel {
  display: none;
  background: var(--surface-2);
  border: 1px solid var(--border);
  border-radius: 2px;
  padding: 26px 28px;
  margin-bottom: 24px;
  animation: slideUp 0.4s ease both;
}
.feedback-panel.show { display: block; }
 
.feedback-status-badge {
  display: inline-block;
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  padding: 4px 13px;
  border-radius: 2px;
  margin-bottom: 16px;
}
.feedback-status-badge.ok {
  background: var(--correct-dim);
  color: var(--correct);
  border: 1px solid rgba(82,201,126,0.28);
}
.feedback-status-badge.no {
  background: var(--wrong-dim);
  color: var(--wrong);
  border: 1px solid rgba(224,92,92,0.28);
}
 
.feedback-text {
  font-size: 14.5px;
  line-height: 1.8;
  color: var(--text-dim);
  margin-bottom: 24px;
}
 
.concept-divider {
  border: none;
  border-top: 1px solid var(--border);
  margin-bottom: 20px;
}
 
.concept-card-label {
  font-family: 'JetBrains Mono', monospace;
  font-size: 8.5px;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--gold);
  opacity: 0.75;
  margin-bottom: 16px;
}
 
.term-list { display: flex; flex-direction: column; gap: 14px; }
 
.term-row {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 16px;
  align-items: baseline;
}
 
.term-name {
  font-family: 'JetBrains Mono', monospace;
  font-size: 11.5px;
  font-weight: 700;
  color: var(--text);
  white-space: nowrap;
}
 
.term-def {
  font-size: 14px;
  line-height: 1.65;
  color: var(--text-dim);
}
 
.btn-next {
  display: none;
  width: 100%;
  font-family: 'JetBrains Mono', monospace;
  font-size: 11.5px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  padding: 17px 24px;
  background: transparent;
  color: var(--gold);
  border: 1px solid rgba(212,168,67,0.45);
  border-radius: 2px;
  cursor: pointer;
  transition: background 0.18s, border-color 0.18s, box-shadow 0.18s;
}
.btn-next:hover {
  background: var(--gold-dim);
  border-color: var(--gold);
  box-shadow: 0 4px 18px var(--gold-glow);
}
 
/* ────────────────────────────────────────────
   RESULTS SCREEN
──────────────────────────────────────────── */
#results-screen {
  justify-content: center;
  padding: 60px 24px 80px;
}
 
.results-wrap {
  max-width: 620px;
  width: 100%;
}
 
.results-eyebrow {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--gold);
  opacity: 0.75;
  margin-bottom: 28px;
}
 
.results-score-row {
  display: flex;
  align-items: baseline;
  gap: 10px;
  margin-bottom: 8px;
}
 
.results-score-big {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: clamp(72px, 16vw, 110px);
  font-weight: 900;
  line-height: 1;
  color: var(--gold);
}
 
.results-denom {
  font-family: 'JetBrains Mono', monospace;
  font-size: 18px;
  color: var(--text-muted);
  letter-spacing: 0.08em;
  align-self: flex-end;
  padding-bottom: 12px;
}
 
.results-rule {
  width: 56px;
  height: 2px;
  background: var(--gold);
  opacity: 0.45;
  margin: 24px 0;
}
 
.results-badge {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 26px;
  font-weight: 700;
  font-style: italic;
  color: var(--text);
  margin-bottom: 14px;
}
 
.results-msg {
  font-size: 15px;
  line-height: 1.82;
  color: var(--text-dim);
  margin-bottom: 44px;
}
 
.concepts-box {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 2px;
  padding: 24px 26px;
  margin-bottom: 44px;
}
 
.concepts-box-label {
  font-family: 'JetBrains Mono', monospace;
  font-size: 8.5px;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--gold);
  opacity: 0.7;
  margin-bottom: 18px;
}
 
.concepts-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 9px;
}
 
.concept-pill {
  display: flex;
  align-items: center;
  gap: 9px;
  padding: 9px 13px;
  background: var(--surface-2);
  border-radius: 2px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 10.5px;
  color: var(--text-dim);
}
 
.pill-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--correct);
  flex-shrink: 0;
}
 
.case-results {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 40px;
}
 
.case-result-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 11px 16px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 2px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
}
 
.case-result-name { color: var(--text-dim); }
 
.result-mark {
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.1em;
}
.result-mark.yes { color: var(--correct); }
.result-mark.nope { color: var(--wrong); }
 
.btn-start {
  font-family: 'JetBrains Mono', monospace;
  font-size: 12px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  padding: 17px 52px;
  background: var(--gold);
  color: #080910;
  font-weight: 700;
  border: none;
  border-radius: 2px;
  cursor: pointer;
  transition: background 0.18s, transform 0.18s, box-shadow 0.18s;
  display: inline-block;
}
.btn-start:hover {
  background: #e8bd55;
  transform: translateY(-2px);
  box-shadow: 0 10px 30px var(--gold-glow);
}
.btn-start:active { transform: translateY(0); }
 
@media (max-width: 520px) {
  .concepts-grid { grid-template-columns: 1fr; }
  .term-row { grid-template-columns: 1fr; gap: 4px; }
  .game-header { flex-direction: column; align-items: flex-start; gap: 8px; }
  .mode-selector { grid-template-columns: 1fr; }
  .concept-grid { grid-template-columns: 1fr; }
}
</style>
</head>
<body>
 
<!-- ══════════════════════════════
     HOME / MENU SCREEN
════════════════════════════════ -->
<section id="home-screen" class="screen active">
  <div class="home-wrap">
    <div class="home-eyebrow">AP Computer Science Principles</div>
    <div class="home-title">Ethics and Legal<br><span class="accent">Concerns</span></div>
    <div class="rule"></div>
    <p class="home-desc">Choose your path: learn the foundations with our interactive lesson, then test your knowledge against real-world cases.</p>
    
    <div class="mode-selector">
      <div class="mode-card" onclick="goToLesson()">
        <div class="mode-title">Learn</div>
        <div class="mode-desc">Interactive lesson covering all key concepts from intellectual property to algorithm bias</div>
      </div>
      <div class="mode-card" onclick="startGame()">
        <div class="mode-title">Investigate</div>
        <div class="mode-desc">Six real-world cases testing your ethical reasoning and knowledge of AP concepts</div>
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

 
<!-- ══════════════════════════════
     LESSON SCREEN
════════════════════════════════ -->
<section id="lesson-screen" class="screen">
  <div class="lesson-nav">
    <div class="lesson-nav-fill" id="lesson-nav-fill" style="width:0%"></div>
  </div>

  <div class="lesson-inner">
    <div class="lesson-header">
      <div class="lesson-label" id="lesson-label">Lesson 1 of 8</div>
      <button class="btn-home" onclick="goHome()">← Back</button>
    </div>

    <div id="lesson-content"></div>

    <div class="lesson-nav-buttons">
      <button class="btn-nav" id="btn-prev-lesson" onclick="prevLesson()" disabled>← Previous</button>
      <button class="btn-nav" id="btn-next-lesson" onclick="nextLesson()">Next →</button>
    </div>
  </div>
</section>

 
<!-- ══════════════════════════════
     GAME SCREEN
════════════════════════════════ -->
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
 
 
<!-- ══════════════════════════════
     RESULTS SCREEN
════════════════════════════════ -->
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
      <div class="concepts-box-label">Concepts Covered in This Investigation</div>
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
    <button class="btn-start" style="background: var(--accent-blue); margin-top: 12px;" onclick="goHome()">← Back to Home</button>
  </div>
</section>
 
 
<script>
/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   LESSON DATA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
const lessonModules = [
  {
    title: "What is Intellectual Property?",
    tag: "Foundations",
    content: `
      <div class="lesson-section">
        <div class="section-tag">Foundations</div>
        <h2 class="section-title">What is Intellectual Property?</h2>
        
        <p class="lesson-body">
          <strong>Intellectual property (IP)</strong> refers to creations of the mind that have commercial or social value. In computing, this includes software code, applications, algorithms, designs, and digital media. Just as a company owns a building or inventory, creators own their intellectual work. This ownership carries legal rights and protections.
        </p>

        <div class="key-point">
          <div class="key-point-label">Key Concept</div>
          <div class="key-point-text">IP protects the value and effort behind creative work. Without protection, creators could not control how their work is used, modified, or profited from—removing incentives for innovation.</div>
        </div>

        <p class="lesson-body">
          Think of a mobile app developer who spends months writing code. That code is their intellectual property. They decide whether others can use it, copy it, or build on it. This control is enforced through copyright, patents, and licenses.
        </p>

        <div class="definition-box">
          <div class="definition-term">Intellectual Property</div>
          <div class="definition-text">A work or invention that is the result of creativity or innovation. It includes code, music, art, writing, designs, and business processes. IP is protected by law to reward creators and encourage innovation.</div>
        </div>

        <p class="lesson-body">
          In computing, IP protection is crucial because code can be copied perfectly and shared globally in seconds. Without legal protections, a programmer's months of work could be stolen and distributed instantly. IP law prevents this.
        </p>

        <div class="example-block">
          <div class="example-label">Real-World Example</div>
          <div class="example-text">Microsoft owns the intellectual property to Windows. They decide who can install it, modify it, and how they profit from it. When you buy Windows, you're licensing their IP—you don't own it outright.</div>
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
        
        <p class="lesson-body">
          <strong>Copyright</strong> is a form of legal protection that gives creators exclusive rights to their work. Copyright applies <em>automatically</em> the moment a creative work is fixed in a tangible medium—you don't need to register it, publish a notice, or fill out forms. The moment you write a song, take a photograph, or write code, you own the copyright.
        </p>

        <div class="key-point">
          <div class="key-point-label">Critical Distinction</div>
          <div class="key-point-text"><strong>Attribution is not the same as permission.</strong> You can credit a creator by name, but this doesn't give you the legal right to use their work. Copyright is about control over how the work is used. Attribution alone does not satisfy copyright requirements.</div>
        </div>

        <div class="definition-box">
          <div class="definition-term">Copyright</div>
          <div class="definition-text">Protects original creative works (writing, code, music, art) by giving the creator exclusive rights to copy, distribute, display, and create derivative works. Copyright exists automatically upon creation and prevents others from using the work without permission.</div>
        </div>

        <p class="lesson-body">
          To use someone's copyrighted work, you must either obtain a <em>license</em> (permission) from the copyright holder, or the work must be in the public domain, or the creator must have granted permission through a license like Creative Commons.
        </p>

        <div class="example-block">
          <div class="example-label">Common Mistake</div>
          <div class="example-text">A student finds a beautiful photograph on Google Images and uses it in a presentation. She credits the photographer by name. However, this is still copyright infringement. Crediting the photographer doesn't make it legal—she needed permission or a license first.</div>
        </div>

        <p class="lesson-body">
          Copyright violations can result in legal action, including fines and removal of content. Respect copyright by seeking permission, using licensed content, or using content explicitly placed in the public domain.
        </p>
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
        
        <p class="lesson-body">
          Creators don't always want to keep their work completely locked down. <strong>Creative Commons (CC) licenses</strong> and <strong>open source licenses</strong> allow creators to share their work while still maintaining control and receiving attribution.
        </p>

        <div class="definition-box">
          <div class="definition-term">Creative Commons</div>
          <div class="definition-text">A system of public licenses that lets creators explicitly grant permissions to others. A CC license specifies exactly what you can and cannot do with the work—use it freely, modify it, share it commercially, etc.—while still respecting the creator's rights.</div>
        </div>

        <p class="lesson-body">
          Common CC licenses include:
        </p>

        <div class="concept-grid">
          <div class="concept-item">
            <div class="concept-item-name">CC BY</div>
            <div class="concept-item-def">Attribution required. You can use, modify, and distribute the work as long as you credit the creator.</div>
          </div>
          <div class="concept-item">
            <div class="concept-item-name">CC BY-NC</div>
            <div class="concept-item-def">Non-commercial use only. You can use and share for non-commercial purposes with attribution.</div>
          </div>
          <div class="concept-item">
            <div class="concept-item-name">CC BY-SA</div>
            <div class="concept-item-def">Share-alike. You can modify and distribute, but derivative works must use the same license.</div>
          </div>
          <div class="concept-item">
            <div class="concept-item-name">CC0</div>
            <div class="concept-item-def">Public domain. No restrictions—creators waive all rights.</div>
          </div>
        </div>

        <div class="definition-box">
          <div class="definition-term">Open Source</div>
          <div class="definition-text">Software made freely available for anyone to use, modify, and redistribute, typically under specific license conditions (like GPL, MIT, Apache). Open source promotes collaboration while requiring attribution and often requiring derivative works to remain open.</div>
        </div>

        <div class="example-block">
          <div class="example-label">Practical Example</div>
          <div class="example-text">A photographer releases an image under CC BY license. You can use it in your website, poster, or presentation—but you must credit the photographer. If she used CC BY-NC, you cannot use it commercially, even with attribution.</div>
        </div>

        <p class="lesson-body">
          When using CC or open source material, always check the license carefully. The permissions vary, and violating the license terms is still copyright infringement.
        </p>
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
        
        <p class="lesson-body">
          <strong>Plagiarism</strong> is presenting someone else's work or ideas as your own without proper credit. In computing, plagiarism often involves copying code, algorithms, or documentation. Many students mistakenly believe that code on the internet is free to use without attribution—this is a fundamental misconception.
        </p>

        <div class="key-point">
          <div class="key-point-label">Critical Truth</div>
          <div class="key-point-text">Publicly available code is NOT automatically free to use. Code is intellectual property protected by copyright from the moment it's written, unless the creator explicitly grants permission.</div>
        </div>

        <div class="definition-box">
          <div class="definition-term">Plagiarism</div>
          <div class="definition-text">Using someone else's material (code, writing, ideas) without permission or proper credit, presenting it as your own work. Plagiarism violates both copyright law and academic integrity policies.</div>
        </div>

        <p class="lesson-body">
          Plagiarism has serious consequences: academic probation, failing grades, expulsion from school, or even legal action. Beyond the penalties, plagiarism undermines the trust and integrity that computing communities depend on.
        </p>

        <div class="concept-grid">
          <div class="concept-item">
            <div class="concept-item-name">How to Avoid Plagiarism</div>
            <div class="concept-item-def">Always cite sources. Use quotation marks for direct excerpts. Paraphrase with attribution. Check your school's honor code.</div>
          </div>
          <div class="concept-item">
            <div class="concept-item-name">With Code</div>
            <div class="concept-item-def">Cite the source in comments. Understand what you copy. Modify it meaningfully. Check the license. Never copy-paste without documentation.</div>
          </div>
        </div>

        <div class="example-block">
          <div class="example-label">Plagiarism in Code</div>
          <div class="example-text">A student finds a perfect sorting algorithm on GitHub and copies it directly into their project without any credit or license check. This is plagiarism, even though the code was publicly posted. The correct approach: check the license, understand the code, cite it properly, and ensure your use complies with the license terms.</div>
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
        
        <p class="lesson-body">
          Scientific and academic research often provides society with critical knowledge—climate data, medical discoveries, public health findings. When research is locked behind expensive paywalls, it's only accessible to wealthy institutions and individuals. <strong>Open Access</strong> seeks to change this.
        </p>

        <div class="definition-box">
          <div class="definition-term">Open Access</div>
          <div class="definition-text">Research that is freely available online with no or minimal restrictions on access or use. Open Access research can be read, downloaded, distributed, and often used for research or teaching without payment or permission barriers.</div>
        </div>

        <p class="lesson-body">
          Many academic publishers charge steep subscription fees or per-article fees. A single research paper might cost $30–40 to access, creating a barrier for students and researchers without institutional funding. This is an ethical concern: knowledge that could save lives or advance society sits behind paywalls.
        </p>

        <div class="key-point">
          <div class="key-point-label">The Ethics Problem</div>
          <div class="key-point-text">When critical research is inaccessible to those who need it most—students in low-income countries, small organizations, independent researchers—it deepens inequality and slows innovation.</div>
        </div>

        <p class="lesson-body">
          How to access research ethically and legally:
        </p>

        <div class="concept-grid">
          <div class="concept-item">
            <div class="concept-item-name">Search for Open Access</div>
            <div class="concept-item-def">Many papers exist in open-access repositories like PubMed Central, arXiv, or institutional archives.</div>
          </div>
          <div class="concept-item">
            <div class="concept-item-name">Use Your Library</div>
            <div class="concept-item-def">Schools and universities subscribe to academic databases. Use your school's library access.</div>
          </div>
          <div class="concept-item">
            <div class="concept-item-name">Ask the Author</div>
            <div class="concept-item-def">Researchers are usually happy to share their own published work. Email them directly.</div>
          </div>
          <div class="concept-item">
            <div class="concept-item-name">Avoid Illegal Sharing</div>
            <div class="concept-item-def">Sites like Sci-Hub violate copyright. Use legal paths instead.</div>
          </div>
        </div>

        <div class="example-block">
          <div class="example-label">Real Scenario</div>
          <div class="example-text">A student needs a research paper locked behind a $42 paywall. Instead of paying or using an illegal site, she searches PubMed Central (free), checks her school library database, or emails the researcher asking for a copy. All three approaches are legal and often work.</div>
        </div>
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
        
        <p class="lesson-body">
          The <strong>digital divide</strong> is the gap between those with reliable access to computers, the internet, and digital skills, and those without. In the 21st century, digital access is increasingly necessary for education, employment, healthcare, and civic participation. When some populations lack this access, they fall further behind.
        </p>

        <div class="definition-box">
          <div class="definition-term">Digital Divide</div>
          <div class="definition-text">The unequal distribution of access to technology (computers, internet, devices), digital skills, and the resulting gaps in educational, economic, and civic opportunity.</div>
        </div>

        <p class="lesson-body">
          Consider these disparities:
        </p>

        <div class="concept-grid">
          <div class="concept-item">
            <div class="concept-item-name">Schools</div>
            <div class="concept-item-def">Wealthy districts have fiber-optic internet and one-to-one laptops. Low-income schools share outdated computers and lack reliable connectivity.</div>
          </div>
          <div class="concept-item">
            <div class="concept-item-name">Geographic</div>
            <div class="concept-item-def">Urban and suburban areas have broadband access. Rural communities often lack high-speed internet entirely.</div>
          </div>
          <div class="concept-item">
            <div class="concept-item-name">Economic</div>
            <div class="concept-item-def">Families who can afford devices and subscriptions access online resources, healthcare, and opportunities. Families without resources cannot.</div>
          </div>
          <div class="concept-item">
            <div class="concept-item-name">Disability</div>
            <div class="concept-item-def">Websites and apps often lack accessibility features for people with disabilities, creating another form of exclusion.</div>
          </div>
        </div>

        <div class="key-point">
          <div class="key-point-label">Equity vs. Equality</div>
          <div class="key-point-text">Giving everyone the same resources (equality) isn't fair when starting positions are unequal. Addressing the digital divide requires <em>equity</em>: investing more in populations that have less to create genuinely fair opportunity.</div>
        </div>

        <div class="example-block">
          <div class="example-label">Policy Example</div>
          <div class="example-text">A city has a technology grant. Dividing it equally gives both rich and poor schools the same amount. But the rich school already has infrastructure; the poor school is missing basics. Equity would prioritize the school with the greatest need, creating genuinely fair access.</div>
        </div>

        <p class="lesson-body">
          Bridging the digital divide is an ethical and social imperative. It requires investment in infrastructure, affordability, digital literacy training, and accessible design.
        </p>
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
        
        <p class="lesson-body">
          Algorithms increasingly make or influence critical decisions: hiring, loans, criminal sentencing, college admissions, content recommendations. When algorithms exhibit <strong>bias</strong>, they discriminate against protected classes—producing unfair outcomes based on race, gender, age, disability, or other characteristics.
        </p>

        <div class="definition-box">
          <div class="definition-term">Algorithm Bias</div>
          <div class="definition-text">When a computing system produces discriminatory outcomes for certain groups. Bias often stems from biased training data, flawed assumptions in design, or indirect discrimination through proxy variables.</div>
        </div>

        <p class="lesson-body">
          A critical misconception: <em>An algorithm doesn't need to explicitly include a protected characteristic (like gender) to discriminate.</em> Bias can be learned from historical data or emerge through proxy variables. For example, a hiring algorithm trained on decades of biased hiring decisions will perpetuate those patterns, even if "gender" is never an input.
        </p>

        <div class="key-point">
          <div class="key-point-label">Responsibility Principle</div>
          <div class="key-point-text">Developers and organizations are responsible for the outcomes their systems produce. <em>Unintentional bias still causes real harm and violates anti-discrimination laws.</em> Intent doesn't eliminate responsibility.</div>
        </div>

        <p class="lesson-body">
          Historical examples of algorithm bias:
        </p>

        <div class="concept-grid">
          <div class="concept-item">
            <div class="concept-item-name">Hiring</div>
            <div class="concept-item-def">A recruiting AI rejected more applications from women, having learned from historical data where men predominated in the field.</div>
          </div>
          <div class="concept-item">
            <div class="concept-item-name">Loans</div>
            <div class="concept-item-def">A credit-scoring algorithm denied loans to minorities at higher rates, reflecting historical discrimination in lending.</div>
          </div>
          <div class="concept-item">
            <div class="concept-item-name">Criminal Justice</div>
            <div class="concept-item-def">Risk assessment algorithms used in sentencing showed racial bias, overestimating recidivism for Black defendants.</div>
          </div>
          <div class="concept-item">
            <div class="concept-item-name">Healthcare</div>
            <div class="concept-item-def">An algorithm for allocating medical resources underserved Black patients, using healthcare spending as a proxy for medical need (problematic due to historical inequality).</div>
          </div>
        </div>

        <div class="example-block">
          <div class="example-label">How Bias Emerges</div>
          <div class="example-text">A company builds a resume-screening algorithm trained on its past hiring data. Historically, men were hired more often in tech roles. The algorithm learns this pattern and begins rejecting qualified women at higher rates, even though gender is never explicitly programmed. This is bias learned from data.</div>
        </div>

        <p class="lesson-body">
          How to address algorithm bias:
        </p>

        <div class="concept-grid">
          <div class="concept-item">
            <div class="concept-item-name">Audit</div>
            <div class="concept-item-def">Test algorithms for differential outcomes across demographic groups.</div>
          </div>
          <div class="concept-item">
            <div class="concept-item-name">Examine Data</div>
            <div class="concept-item-def">Is training data representative and balanced? Does it reflect historical biases?</div>
          </div>
          <div class="concept-item">
            <div class="concept-item-name">Add Oversight</div>
            <div class="concept-item-def">Include human review for high-stakes decisions. Don't fully automate consequential choices.</div>
          </div>
          <div class="concept-item">
            <div class="concept-item-name">Monitor Continuously</div>
            <div class="concept-item-def">Bias can emerge over time. Regular audits catch drift early.</div>
          </div>
        </div>
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
        
        <p class="lesson-body">
          Computing innovations raise broad legal and ethical concerns that extend beyond individual rights. Technology influences public discourse, political participation, privacy, and social equity at scale. Developers and organizations must consider the downstream consequences of their creations.
        </p>

        <div class="key-point">
          <div class="key-point-label">The Responsibility</div>
          <div class="key-point-text">When computing is used to amplify voices, spread information, influence decisions, or collect data at scale, the ethical bar rises. Small design choices can have massive societal consequences.</div>
        </div>

        <p class="lesson-body">
          Examples of societal concerns:
        </p>

        <div class="concept-grid">
          <div class="concept-item">
            <div class="concept-item-name">Misinformation</div>
            <div class="concept-item-def">Algorithms that amplify engaging content, even if false, can spread falsehoods at scale, harming public health and democracy.</div>
          </div>
          <div class="concept-item">
            <div class="concept-item-name">Privacy</div>
            <div class="concept-item-def">Data collection and surveillance can be used to track, manipulate, or control individuals and groups.</div>
          </div>
          <div class="concept-item">
            <div class="concept-item-name">Polarization</div>
            <div class="concept-item-def">Recommendation algorithms can create echo chambers, deepening social divisions and preventing productive dialogue.</div>
          </div>
          <div class="concept-item">
            <div class="concept-item-name">Labor Displacement</div>
            <div class="concept-item-def">Automation can displace workers without support for retraining or transition, deepening economic inequality.</div>
          </div>
        </div>

        <div class="definition-box">
          <div class="definition-term">Legal and Ethical Concerns</div>
          <div class="definition-text">Computing systems that harm individuals or groups raise both legal liability (violating laws against discrimination, privacy rights, consumer protection) and ethical obligations (treating people fairly, protecting vulnerable populations, being transparent).</div>
        </div>

        <div class="example-block">
          <div class="example-label">Structural Concerns</div>
          <div class="example-text">A social media algorithm optimizes for engagement, which means controversial and polarizing content spreads faster. This isn't intentional harm, but the system design has societal consequences: increased polarization, mental health impacts, and democratic dysfunction. Addressing this requires the company to choose values other than pure engagement.</div>
        </div>

        <p class="lesson-body">
          As a computing professional, you'll face ethical choices. Here's a framework:
        </p>

        <div class="concept-grid">
          <div class="concept-item">
            <div class="concept-item-name">Identify Impacts</div>
            <div class="concept-item-def">Who benefits from this system? Who might be harmed? What are the unintended consequences?</div>
          </div>
          <div class="concept-item">
            <div class="concept-item-name">Check Rights</div>
            <div class="concept-item-def">Does the system respect privacy, intellectual property, and individual autonomy?</div>
          </div>
          <div class="concept-item">
            <div class="concept-item-name">Ensure Equity</div>
            <div class="concept-item-def">Does it exclude or disadvantage certain groups? Is access fair?</div>
          </div>
          <div class="concept-item">
            <div class="concept-item-name">Build Accountability</div>
            <div class="concept-item-def">Can people understand and contest decisions? Is there oversight?</div>
          </div>
        </div>

        <p class="lesson-body">
          Ethical computing isn't about being perfect—it's about thinking carefully, taking responsibility, and making intentional choices that reflect your values.
        </p>
      </div>
    `
  }
];

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   SCENARIO DATA (for game)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
const scenarios = [
  {
    caseNum: "01", total: "06",
    concept: "Intellectual Property + Copyright",
    title: "The Beat Drop",
    narrative:
      "Riley spent months creating a YouTube documentary about her school's robotics team. To set the right tone, she used a popular chart-topping song as the background music throughout the video. Within 48 hours of posting, YouTube flagged the video and redirected all ad revenue to the record label. Riley had no idea this would happen.",
    question: "What should Riley have done before using the song in her video?",
    choices: [
      {
        label: "A",
        text: "Credit the artist in the video description. This counts as proper attribution and satisfies copyright requirements.",
        correct: false,
        feedback: "Crediting the artist does not replace the need for permission. Copyright gives creators exclusive rights over how their work is reproduced and distributed. Attribution alone does not make it legal to use copyrighted material. Permission from the rights holder is required."
      },
      {
        label: "B",
        text: "Obtain a license from the rights holder, or use royalty-free or Creative Commons licensed music.",
        correct: true,
        feedback: "Copyright protects intellectual property and gives creators exclusive control over how their work is used. To legally use someone else's music, you must either get a license or use music that is explicitly free to use, such as royalty-free tracks or music with a Creative Commons license that permits your type of use."
      },
      {
        label: "C",
        text: "Keep the video set to private. Private videos are not subject to copyright law.",
        correct: false,
        feedback: "Whether a video is public or private does not affect copyright protection. Intellectual property rights apply regardless of how widely content is distributed or who can access it."
      }
    ],
    conceptCard: [
      { name: "Intellectual Property", def: "A work or invention that is the result of creativity, to which one has legal rights. Includes code, music, art, and written works." },
      { name: "Copyright",             def: "Protects your intellectual property and prevents anyone from using it without your permission. It is automatic upon creation of the work." }
    ]
  },
 
  {
    caseNum: "02", total: "06",
    concept: "Plagiarism + Open Source",
    title: "The GitHub Grab",
    narrative:
      "Marcus is building an app for his AP CSP project and finds a perfectly written function on a public GitHub repository. He copies the code directly into his project without any attribution and submits it. His teacher runs the work through an academic integrity checker and finds the match. Marcus insists the code was on the internet and therefore free for anyone to use.",
    question: "What is wrong with Marcus's reasoning, and what should he have done?",
    choices: [
      {
        label: "A",
        text: "Nothing is wrong. Code posted publicly on the internet is in the public domain and free to use without citation.",
        correct: false,
        feedback: "This is one of the most common misconceptions in computing. Publicly available code is not automatically free to use without attribution. Code is intellectual property protected by copyright from the moment it is created, unless the author explicitly grants permission through a license."
      },
      {
        label: "B",
        text: "He should have checked the repository license and provided proper attribution to the original author.",
        correct: true,
        feedback: "Open source software is made freely available for use and often modification, but it comes with conditions. Most open source licenses require attribution to the original author. Using code without checking the license terms and providing credit is plagiarism, even when the code is publicly posted."
      },
      {
        label: "C",
        text: "He should have rewritten the code slightly so it would not match in an integrity checker.",
        correct: false,
        feedback: "Paraphrasing or superficially modifying someone else's work without credit is still plagiarism. The issue is the absence of attribution and license compliance, not the degree of textual similarity."
      }
    ],
    conceptCard: [
      { name: "Plagiarism",   def: "Presenting someone else's material as your own without permission or proper credit, including code copied from the internet." },
      { name: "Open Source",  def: "Programs made freely available for anyone to use, and may be redistributed and modified, typically under specific license conditions that require attribution." }
    ]
  },
 
  {
    caseNum: "03", total: "06",
    concept: "Creative Commons",
    title: "The Borrowed Photo",
    narrative:
      "Destiny is building a website for her community service project. She searches Google Images, finds beautiful photographs, and downloads them for her site. She adds captions with each photographer's name. A few weeks after launch, she receives a legal notice demanding payment from the photography agency that owns the images.",
    question: "Where did Destiny go wrong, and what is the correct approach?",
    choices: [
      {
        label: "A",
        text: "She should have gotten her teacher's permission before using images from the internet.",
        correct: false,
        feedback: "Teacher permission does not override copyright law. Photographs found through a general image search are protected by copyright unless the rights holder has explicitly granted permission for reuse. A teacher cannot authorize someone else's intellectual property."
      },
      {
        label: "B",
        text: "She should have specifically searched for Creative Commons licensed images and attributed them according to the license terms.",
        correct: true,
        feedback: "Creative Commons provides free licenses that clearly tell others what they can and cannot do with a creator's work. Searching for images with a CC license that allows reuse, and attributing them correctly, is both the ethical and legal path. Simply naming the photographer in a caption does not grant the right to reproduce their copyrighted image."
      },
      {
        label: "C",
        text: "Non-profit and school projects are exempt from copyright law under educational fair use.",
        correct: false,
        feedback: "There is no blanket educational or non-profit exemption from copyright. Fair use allows limited use in some narrow contexts, but it does not extend to using full commercial photographs on a public-facing website, even for a good cause."
      }
    ],
    conceptCard: [
      { name: "Creative Commons", def: "Free licenses that tell others exactly what they can and cannot do with your intellectual property, enabling sharing while respecting the creator's rights." }
    ]
  },
 
  {
    caseNum: "04", total: "06",
    concept: "Digital Divide",
    title: "Two Schools",
    narrative:
      "Maplewood School has fiber-optic internet, a one-to-one laptop program, and a dedicated technology lab with up-to-date equipment. Five miles away, Riverside School operates with fifteen-year-old desktops, no reliable internet access, and no upgrade budget. The city council has received a technology grant and must decide how to distribute it.",
    question: "Which decision best addresses the core ethical concern in this scenario?",
    choices: [
      {
        label: "A",
        text: "Divide the grant equally between both schools regardless of their existing resources.",
        correct: false,
        feedback: "Equal distribution does not address underlying inequity. A school that already has strong infrastructure benefits far less from additional funding than one with critical gaps. Equity sometimes requires investing more in those who have less to produce genuinely fair outcomes."
      },
      {
        label: "B",
        text: "Award the grant to Riverside to provide students there with equitable access to technology.",
        correct: true,
        feedback: "The digital divide is the unequal distribution of access to technology. When technology is essential for education and future opportunity, students without access fall further behind. Prioritizing Riverside addresses the ethical imperative of working toward equitable participation in the digital world."
      },
      {
        label: "C",
        text: "Let each school fundraise independently. Government should not choose between public institutions.",
        correct: false,
        feedback: "This approach ignores the structural causes of the digital divide. Schools in lower-income areas have far less capacity to fundraise than those in wealthier communities, which deepens existing inequalities rather than reducing them."
      }
    ],
    conceptCard: [
      { name: "Digital Divide", def: "The unequal distribution of access to technology, particularly computers and the internet, and the resulting gap in educational, economic, and civic opportunity." }
    ]
  },
 
  {
    caseNum: "05", total: "06",
    concept: "Algorithm Bias + Legal/Ethical Concerns",
    title: "The Biased Bot",
    narrative:
      "TechHire Corp deployed an AI resume screening tool to handle thousands of job applications. After six months, a data analyst found that the algorithm was rejecting 38 percent more applications from women than from men with equivalent qualifications and experience. The company's legal team argues the system was never programmed to consider gender, so there is no liability.",
    question: "How should TechHire respond to this finding?",
    choices: [
      {
        label: "A",
        text: "Continue using the system. Since gender was never an input variable, the algorithm is neutral by design.",
        correct: false,
        feedback: "Algorithms can learn and reproduce bias from historical training data even when protected characteristics are not explicit inputs. For example, a system trained on decades of biased hiring data will perpetuate those patterns. Neutral intent does not guarantee neutral outcomes, and legal and ethical responsibility is based on the harm caused."
      },
      {
        label: "B",
        text: "Audit the training data and model, retrain it with balanced data, and add a human review layer.",
        correct: true,
        feedback: "Algorithm bias occurs when a system produces discriminatory outcomes for certain groups, even without intentional programming. Companies have both a legal and ethical obligation to audit, correct, and monitor the systems they deploy. Unintentional bias still causes real harm to real people, and can violate anti-discrimination laws."
      },
      {
        label: "C",
        text: "Shut down all automated hiring tools immediately. AI cannot be used ethically for consequential decisions.",
        correct: false,
        feedback: "Discontinuing the tool avoids the problem rather than solving it. Automated tools can be used ethically with proper auditing, representative training data, and meaningful human oversight. The goal is responsible and accountable design, not avoidance of innovation entirely."
      }
    ],
    conceptCard: [
      { name: "Algorithm Bias",      def: "When a computing system produces discriminatory outcomes for certain groups, often because of biased training data or flawed assumptions in the design." },
      { name: "Legal/Ethical Concerns", def: "Using computing in ways that harm individuals or groups raises both legal liability and ethical obligations. Developers and companies are responsible for the outcomes their systems produce." }
    ]
  },
 
  {
    caseNum: "06", total: "06",
    concept: "Open Access",
    title: "The Paywall Problem",
    narrative:
      "Jasmine is writing a research paper on climate change for her AP Environmental Science class. She finds the ideal peer-reviewed study but it sits behind a publisher paywall charging forty-two dollars for access. A classmate tells her the full paper can be downloaded from an unauthorized file-sharing site. Jasmine is torn between her deadline and doing the right thing.",
    question: "What is the most ethical and legal way for Jasmine to access the research?",
    choices: [
      {
        label: "A",
        text: "Download it from the unauthorized file-sharing site. Researchers want their work to be read as widely as possible.",
        correct: false,
        feedback: "Even if researchers hope for broad readership, downloading from an unauthorized site infringes on the publisher's copyright. The good intention behind the action does not change its legal status. Using assumed author intent to justify a copyright violation is not a sound ethical or legal argument."
      },
      {
        label: "B",
        text: "Search for an Open Access version of the paper, check her school library database, or contact the author directly.",
        correct: true,
        feedback: "Open Access refers to research that is free of restrictions on access and many restrictions on use. Many authors deposit their own work in open repositories such as PubMed Central or institutional archives. School libraries frequently provide legal access to academic databases. Emailing an author to request a copy of their own published paper is also a fully recognized and legal practice."
      },
      {
        label: "C",
        text: "Cite only the publicly available abstract. This avoids any copyright issue and is good enough.",
        correct: false,
        feedback: "While citing only content you can legally access is the right instinct, this option stops short of pursuing genuinely available legal paths. Open Access versions often exist and should be sought before unnecessarily limiting the scope of research."
      }
    ],
    conceptCard: [
      { name: "Open Access", def: "Online research output that is free of any and all restrictions on access, and free of many restrictions on use such as copyright or license restrictions." }
    ]
  }
];

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   GAME STATE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
let currentIdx  = 0;
let currentLessonIdx = 0;
let score       = 0;
let answered    = false;
let caseResults = [];

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   SCREEN MANAGEMENT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  const el = document.getElementById(id);
  el.classList.add('active');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function goHome() {
  currentIdx = 0;
  currentLessonIdx = 0;
  score = 0;
  answered = false;
  caseResults = [];
  showScreen('home-screen');
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   LESSON NAVIGATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function goToLesson() {
  currentLessonIdx = 0;
  loadLesson();
  showScreen('lesson-screen');
}

function loadLesson() {
  const lesson = lessonModules[currentLessonIdx];
  const pct = (currentLessonIdx / lessonModules.length) * 100;
  
  document.getElementById('lesson-nav-fill').style.width = pct + '%';
  document.getElementById('lesson-label').textContent = 
    'Lesson ' + (currentLessonIdx + 1) + ' of ' + lessonModules.length;
  document.getElementById('lesson-content').innerHTML = lesson.content;
  
  document.getElementById('btn-prev-lesson').disabled = currentLessonIdx === 0;
  document.getElementById('btn-next-lesson').textContent = 
    currentLessonIdx === lessonModules.length - 1 ? 'Begin Investigation →' : 'Next →';
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

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   GAME START / RESTART
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function startGame() {
  currentIdx  = 0;
  score       = 0;
  answered    = false;
  caseResults = [];
  showScreen('game-screen');
  loadCase();
}

function restartGame() { startGame(); }

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   LOAD A CASE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function loadCase() {
  const s = scenarios[currentIdx];
  answered = false;

  const pct = (currentIdx / scenarios.length) * 100;
  document.getElementById('prog-bar').style.width = pct + '%';

  document.getElementById('case-label').textContent =
    'Case ' + s.caseNum + ' of ' + s.total;
  const sv = document.getElementById('score-val');
  sv.textContent = score;

  document.getElementById('concept-tag').textContent  = s.concept;
  document.getElementById('case-title').textContent   = s.title;
  document.getElementById('narrative-text').textContent = s.narrative;
  document.getElementById('question-text').textContent  = s.question;

  const container = document.getElementById('choices-container');
  container.innerHTML = '';
  s.choices.forEach((choice, idx) => {
    const btn = document.createElement('button');
    btn.className = 'choice-btn';
    btn.setAttribute('data-idx', idx);
    btn.innerHTML =
      '<span class="choice-lbl">' + choice.label + '</span>' +
      '<span class="choice-text">' + choice.text + '</span>';
    btn.addEventListener('click', () => selectAnswer(idx));
    container.appendChild(btn);
  });

  const fp = document.getElementById('feedback-panel');
  fp.classList.remove('show');
  fp.style.animation = 'none';
  fp.offsetHeight;
  fp.style.animation = '';

  const nb = document.getElementById('btn-next');
  nb.style.display = 'none';
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   HANDLE ANSWER SELECTION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function selectAnswer(idx) {
  if (answered) return;
  answered = true;

  const s      = scenarios[currentIdx];
  const choice = s.choices[idx];
  const buttons = document.querySelectorAll('.choice-btn');

  buttons.forEach((btn, i) => {
    btn.disabled = true;
    if (s.choices[i].correct)           btn.classList.add('is-correct');
    if (i === idx && !choice.correct)   btn.classList.add('is-wrong');
  });

  const isCorrect = choice.correct;
  if (isCorrect) {
    score++;
    const sv = document.getElementById('score-val');
    sv.textContent = score;
    sv.classList.remove('pop');
    void sv.offsetWidth;
    sv.classList.add('pop');
    setTimeout(() => sv.classList.remove('pop'), 400);
  }

  caseResults.push({ title: s.title, correct: isCorrect });

  const badge = document.getElementById('feedback-badge');
  badge.textContent = isCorrect ? 'Correct' : 'Incorrect';
  badge.className   = 'feedback-status-badge ' + (isCorrect ? 'ok' : 'no');

  document.getElementById('feedback-text').textContent = choice.feedback;

  const termList = document.getElementById('term-list');
  termList.innerHTML = '';
  s.conceptCard.forEach(term => {
    const row = document.createElement('div');
    row.className = 'term-row';
    row.innerHTML =
      '<span class="term-name">' + term.name + '</span>' +
      '<span class="term-def">'  + term.def  + '</span>';
    termList.appendChild(row);
  });

  const fp = document.getElementById('feedback-panel');
  fp.classList.add('show');

  const nb = document.getElementById('btn-next');
  nb.style.display = 'block';
  nb.textContent = currentIdx < scenarios.length - 1 ? 'Next Case' : 'View Results';

  setTimeout(() => {
    fp.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, 150);
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   ADVANCE TO NEXT CASE OR RESULTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function nextCase() {
  currentIdx++;
  if (currentIdx >= scenarios.length) {
    showResults();
  } else {
    showScreen('game-screen');
    loadCase();
  }
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   RESULTS SCREEN
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function showResults() {
  showScreen('results-screen');

  document.getElementById('prog-bar').style.width = '100%';
  document.getElementById('res-score').textContent = score;

  let badge, msg;
  if (score === 6) {
    badge = "Ethics Champion";
    msg   = "A perfect score. You have a strong command of computing ethics, intellectual property law, and the social implications of technology. You are fully prepared for any AP CSP ethics question.";
  } else if (score >= 4) {
    badge = "Digital Defender";
    msg   = "Solid work. You understand the core principles of computing ethics. Review the cases you missed and pay close attention to the distinctions between similar concepts, such as attribution vs. licensing and equal vs. equitable access.";
  } else if (score >= 2) {
    badge = "Ethical Explorer";
    msg   = "You have a foundation to build on. Go back through the feedback for each case and focus especially on the difference between Copyright, Creative Commons, and Open Source, and on why intent does not eliminate legal responsibility.";
  } else {
    badge = "Case Reopened";
    msg   = "Ethics in computing rewards careful, precise thinking. Read through the concept cards for each case and play again. Every case connects directly to something you will encounter on the AP exam.";
  }

  document.getElementById('res-badge').textContent = badge;
  document.getElementById('res-msg').textContent   = msg;

  const listEl = document.getElementById('case-results-list');
  listEl.innerHTML = '';
  caseResults.forEach((r, i) => {
    const row = document.createElement('div');
    row.className = 'case-result-row';
    row.innerHTML =
      '<span class="case-result-name">Case ' + String(i + 1).padStart(2, '0') + ' &mdash; ' + r.title + '</span>' +
      '<span class="result-mark ' + (r.correct ? 'yes' : 'nope') + '">' + (r.correct ? 'Correct' : 'Incorrect') + '</span>';
    listEl.appendChild(row);
  });
}
</script>
 
</body>
</html>