---
layout: opencs
title: 5.3 - Computing Bias
description: A fun interactive lesson about computing bias for AP CSP
permalink: /csp/ComputingBias/p3/lessons/
breadcrumb: True
Author: Shayan Bhatti, Arnav Pallapotu, Tanay Paranjpe
---

<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Cabin:wght@400;600;700&family=Lato:wght@300;400&display=swap" rel="stylesheet">

<style>
  /* ── Dark-theme only the content containers (NOT site-header .wrapper) ── */
  main.page-content { background: #0a110c !important; padding: 0 !important; }
  main.page-content > .wrapper {
    max-width: none !important;
    padding: 0 !important;
    margin: 0 !important;
    background: #0a110c !important;
  }
  .opencs_root { background: #0a110c !important; padding: 0 !important; margin: 0 !important; }

  body { overflow-x: hidden; }

  /* ── Full-width breakout ── */
  .cb-page {
    width: 100vw;
    position: relative;
    left: 50%;
    right: 50%;
    margin-left: -50vw;
    margin-right: -50vw;
    background: #0a110c;
    font-family: 'Lato', sans-serif;
    color: #e0e0e0;
    padding: 0;
    box-sizing: border-box;
  }

  /* ── Grain overlay ── */
  .cb-grain {
    position: fixed; inset: 0;
    pointer-events: none; z-index: 9999;
    opacity: 0.03;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
    background-size: 200px 200px;
  }

  /* ── Particles ── */
  .cb-particles { position: fixed; inset: 0; pointer-events: none; z-index: 0; overflow: hidden; }
  .cb-particle {
    position: absolute;
    font-family: 'Libre Baskerville', serif;
    color: rgba(212,168,83,0.10);
    animation: cb-float linear infinite;
    user-select: none; pointer-events: none;
  }
  @keyframes cb-float {
    0%   { transform: translateY(105vh) rotate(0deg);   opacity: 0; }
    8%   { opacity: 1; }
    92%  { opacity: 1; }
    100% { transform: translateY(-10vh) rotate(360deg); opacity: 0; }
  }

  /* ── Sticky timer bar - sits just below the site nav ── */
  .cb-timer-bar {
    position: sticky;
    top: 0;
    z-index: 9999999999;
    background: rgba(10,17,12,0.92);
    backdrop-filter: blur(18px);
    -webkit-backdrop-filter: blur(18px);
    border-bottom: 1px solid rgba(212,168,83,0.15);
    padding: 10px 28px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
  }
  .cb-timer-bar-left {
    display: flex;
    align-items: center;
    gap: 14px;
  }
  .cb-lesson-tag {
    font-family: 'Cabin', sans-serif;
    font-weight: 700;
    font-size: 0.6rem;
    text-transform: uppercase;
    letter-spacing: 0.22em;
    color: rgba(212,168,83,0.6);
  }
  .cb-timer-display {
    font-family: 'Cabin', sans-serif;
    font-weight: 700;
    font-size: 1.1rem;
    color: #d4a853;
    letter-spacing: 0.04em;
    min-width: 52px;
    transition: color 0.3s;
  }
  .cb-timer-display.urgent { color: #e8878c; animation: cb-pulse-red 0.8s ease-in-out infinite; }
  @keyframes cb-pulse-red {
    0%, 100% { opacity: 1; }
    50%       { opacity: 0.5; }
  }
  .cb-timer-btn {
    padding: 6px 18px;
    background: rgba(212,168,83,0.12);
    border: 1px solid rgba(212,168,83,0.35);
    border-radius: 20px;
    color: #d4a853;
    font-family: 'Cabin', sans-serif;
    font-weight: 700;
    font-size: 0.62rem;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    cursor: pointer;
    transition: background 0.25s, transform 0.25s;
  }
  .cb-timer-btn:hover { background: rgba(212,168,83,0.22); transform: scale(1.04); }
  .cb-timer-bar-right {
    display: flex;
    align-items: center;
    gap: 12px;
  }
  .cb-score-display {
    font-family: 'Cabin', sans-serif;
    font-weight: 700;
    font-size: 0.78rem;
    color: rgba(255,255,255,0.5);
    letter-spacing: 0.04em;
  }
  .cb-score-val {
    color: #d4a853;
    font-size: 1rem;
    transition: transform 0.3s cubic-bezier(0.16,1,0.3,1);
  }
  .cb-score-val.bump { transform: scale(1.6); color: #7ed49b; }
  .cb-progress-track {
    width: 120px;
    height: 3px;
    background: rgba(255,255,255,0.07);
    border-radius: 2px;
    overflow: hidden;
  }
  .cb-progress-fill {
    height: 100%;
    background: linear-gradient(90deg, #d4a853, #7ed49b);
    border-radius: 2px;
    width: 0%;
    transition: width 0.6s cubic-bezier(0.16,1,0.3,1);
  }

  /* ── Scroll-reveal ── */
  .cb-reveal {
    opacity: 0;
    transform: translateY(36px);
    transition: opacity 0.75s cubic-bezier(0.16,1,0.3,1), transform 0.75s cubic-bezier(0.16,1,0.3,1);
  }
  .cb-reveal.visible { opacity: 1; transform: translateY(0); }

  /* ── Sections ── */
  .cb-section {
    max-width: 900px;
    margin: 0 auto;
    padding: 64px 40px;
    position: relative;
    z-index: 2;
  }

  /* ── Section tag ── */
  .cb-tag {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    font-family: 'Cabin', sans-serif;
    font-weight: 700;
    font-size: 0.6rem;
    text-transform: uppercase;
    letter-spacing: 0.28em;
    color: rgba(212,168,83,0.55);
    margin-bottom: 20px;
  }
  .cb-tag::after {
    content: '';
    display: inline-block;
    width: 40px;
    height: 1px;
    background: rgba(212,168,83,0.25);
  }

  /* ── Hero - compact lesson header ── */
  .cb-hero {
    background: #0a110c;
    padding: 36px 40px 32px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 28px;
    position: relative;
    overflow: hidden;
    border-bottom: 1px solid rgba(212,168,83,0.12);
    flex-wrap: wrap;
  }
  .cb-hero::before {
    content: '';
    position: absolute; inset: -50%;
    background:
      radial-gradient(ellipse at 10% 50%, rgba(212,168,83,0.07) 0%, transparent 40%),
      radial-gradient(ellipse at 90% 50%, rgba(45,184,77,0.04) 0%, transparent 40%);
    animation: cb-mesh 18s ease-in-out infinite alternate;
    pointer-events: none; z-index: 0;
  }
  @keyframes cb-mesh {
    0%   { transform: scale(1) rotate(0deg); }
    100% { transform: scale(1.1) rotate(2deg); }
  }
  .cb-hero > * { position: relative; z-index: 2; }
  .cb-hero-left { flex: 1; min-width: 220px; }

  .cb-hero-eyebrow {
    font-family: 'Cabin', sans-serif;
    font-size: 0.56rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.3em;
    color: rgba(212,168,83,0.55) !important;
    margin: 0 0 8px;
    display: block;
  }

  .cb-hero h1 {
    font-family: 'Libre Baskerville', serif;
    font-size: 2.2rem;
    font-weight: 700;
    letter-spacing: -0.02em;
    color: #fff !important;
    margin: 0 0 8px;
    border: none !important;
    line-height: 1.1;
  }
  .cb-hero-accent { color: #d4a853 !important; }

  .cb-hero-sub {
    font-size: 0.85rem;
    color: rgba(255,255,255,0.4) !important;
    margin: 0;
    line-height: 1.65;
    font-family: 'Lato', sans-serif;
    font-weight: 300;
  }

  /* Right side: chips + button */
  .cb-hero-right {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 14px;
    flex-shrink: 0;
  }
  .cb-hero-chips {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
    justify-content: flex-end;
  }
  .cb-hero-chip {
    display: inline-flex;
    flex-direction: column;
    align-items: center;
    padding: 8px 14px;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 10px;
    min-width: 60px;
  }
  .cb-hero-chip-num {
    font-family: 'Cabin', sans-serif;
    font-weight: 700;
    font-size: 1.2rem;
    color: #d4a853;
    line-height: 1;
  }
  .cb-hero-chip-lbl {
    font-family: 'Cabin', sans-serif;
    font-weight: 700;
    font-size: 0.5rem;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: rgba(255,255,255,0.3) !important;
    margin-top: 4px;
  }

  /* Start button */
  .cb-start-btn {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 11px 24px;
    background: #d4a853;
    color: #0a110c;
    font-family: 'Cabin', sans-serif;
    font-weight: 700;
    font-size: 0.66rem;
    text-transform: uppercase;
    letter-spacing: 0.14em;
    border: none;
    border-radius: 24px;
    cursor: pointer;
    transition: background 0.25s, transform 0.3s cubic-bezier(0.16,1,0.3,1), box-shadow 0.25s;
  }
  .cb-start-btn:hover {
    background: #e0bd70;
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(212,168,83,0.28);
  }
  .cb-start-btn svg { width: 13px; height: 13px; flex-shrink: 0; }

  /* Stats strip - hidden, info moved into hero chips */
  .cb-stats { display: none !important; }
  /* Keep stat vars for JS counter targets */
  .cb-stat-num { font-family: 'Cabin', sans-serif; font-size: 0.6rem; font-weight: 700; }
  .cb-stat-lbl { font-family: 'Cabin', sans-serif; font-size: 0.6rem; font-weight: 700; }

  /* ── Glass card ── */
  .cb-card {
    background: rgba(255,255,255,0.045);
    backdrop-filter: blur(14px);
    -webkit-backdrop-filter: blur(14px);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 20px;
    padding: 38px 34px;
    margin-bottom: 18px;
    position: relative;
    overflow: hidden;
    transition: border-color 0.4s, box-shadow 0.4s, background 0.4s;
  }
  .cb-card::before {
    content: '';
    position: absolute; inset: 0;
    border-radius: 20px;
    background: linear-gradient(135deg, rgba(212,168,83,0.055) 0%, transparent 50%);
    opacity: 0;
    transition: opacity 0.4s;
    pointer-events: none;
  }
  .cb-card:hover {
    border-color: rgba(212,168,83,0.22);
    box-shadow: 0 14px 44px rgba(0,0,0,0.25);
    background: rgba(255,255,255,0.065);
  }
  .cb-card:hover::before { opacity: 1; }

  .cb-card h2 {
    font-family: 'Libre Baskerville', serif;
    font-size: 1.55rem;
    font-weight: 700;
    color: #fff;
    margin: 0 0 14px;
    border: none;
    line-height: 1.2;
  }
  .cb-card p, .cb-card li {
    font-family: 'Lato', sans-serif;
    font-weight: 300;
    font-size: 0.95rem;
    color: rgba(255,255,255,0.6);
    line-height: 1.9;
    margin: 0 0 10px;
  }
  .cb-card ul { padding-left: 20px; margin: 12px 0 0; }
  .cb-card li { margin-bottom: 8px; }

  /* ── Gold callout ── */
  .cb-callout {
    background: rgba(212,168,83,0.07);
    border-left: 3px solid rgba(212,168,83,0.5);
    border-radius: 0 12px 12px 0;
    padding: 16px 20px;
    margin: 18px 0;
    font-family: 'Lato', sans-serif;
    font-size: 0.93rem;
    color: rgba(212,168,83,0.9);
    font-style: italic;
    line-height: 1.75;
  }

  /* ── BIG QUESTION card ── */
  .cb-big-q {
    background: rgba(212,168,83,0.06);
    border: 1px solid rgba(212,168,83,0.2);
    border-radius: 20px;
    padding: 44px 40px;
    text-align: center;
    position: relative;
    overflow: hidden;
    margin-bottom: 18px;
  }
  .cb-big-q::before {
    content: '?';
    position: absolute;
    font-family: 'Libre Baskerville', serif;
    font-size: 18rem;
    font-weight: 700;
    color: rgba(212,168,83,0.04);
    right: -20px; top: -40px;
    line-height: 1;
    pointer-events: none;
  }
  .cb-big-q h2 {
    font-family: 'Libre Baskerville', serif;
    font-size: 1.9rem;
    color: #fff;
    margin: 0 0 14px;
    border: none;
    line-height: 1.3;
    position: relative;
    z-index: 1;
  }
  .cb-big-q p {
    font-family: 'Lato', sans-serif;
    font-weight: 300;
    font-size: 0.95rem;
    color: rgba(255,255,255,0.5);
    max-width: 520px;
    margin: 0 auto;
    line-height: 1.85;
    position: relative;
    z-index: 1;
  }

  /* ── Team vote ── */
  .cb-vote-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 14px;
    margin-top: 22px;
  }
  .cb-vote-btn {
    padding: 22px 16px;
    border-radius: 16px;
    font-family: 'Cabin', sans-serif;
    font-weight: 700;
    font-size: 0.78rem;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    border: 1px solid;
    cursor: pointer;
    transition: transform 0.35s cubic-bezier(0.16,1,0.3,1), box-shadow 0.35s, opacity 0.3s;
    text-align: center;
    position: relative;
    overflow: hidden;
  }
  .cb-vote-btn .cb-vote-emoji { display: none; }
  .cb-vote-btn.team-a {
    background: rgba(212,168,83,0.08);
    border-color: rgba(212,168,83,0.3);
    color: #d4a853;
  }
  .cb-vote-btn.team-a:hover {
    background: rgba(212,168,83,0.16);
    transform: translateY(-4px);
    box-shadow: 0 10px 32px rgba(212,168,83,0.18);
  }
  .cb-vote-btn.team-b {
    background: rgba(126,203,214,0.07);
    border-color: rgba(126,203,214,0.25);
    color: rgba(126,203,214,0.9);
  }
  .cb-vote-btn.team-b:hover {
    background: rgba(126,203,214,0.14);
    transform: translateY(-4px);
    box-shadow: 0 10px 32px rgba(126,203,214,0.12);
  }
  .cb-vote-btn.voted { transform: scale(1.05); }
  .cb-vote-btn.faded { opacity: 0.35; pointer-events: none; }
  .cb-vote-count {
    display: block;
    font-size: 2rem;
    font-weight: 700;
    font-family: 'Cabin', sans-serif;
    margin-top: 8px;
    letter-spacing: -0.02em;
  }

  /* ── BIAS DETECTED banner ── */
  .cb-verdict {
    display: none;
    text-align: center;
    margin-top: 22px;
    padding: 24px;
    border-radius: 16px;
    animation: cb-pop 0.5s cubic-bezier(0.16,1,0.3,1);
  }
  @keyframes cb-pop {
    0%   { transform: scale(0.7); opacity: 0; }
    100% { transform: scale(1);   opacity: 1; }
  }
  .cb-verdict.correct {
    display: block;
    background: rgba(126,212,155,0.1);
    border: 1px solid rgba(126,212,155,0.3);
  }
  .cb-verdict.wrong {
    display: block;
    background: rgba(232,135,140,0.08);
    border: 1px solid rgba(232,135,140,0.25);
  }
  .cb-verdict-title {
    font-family: 'Libre Baskerville', serif;
    font-size: 1.6rem;
    font-weight: 700;
    margin: 0 0 8px;
  }
  .cb-verdict.correct .cb-verdict-title { color: #7ed49b; }
  .cb-verdict.wrong   .cb-verdict-title { color: #e8878c; }
  .cb-verdict p {
    font-family: 'Lato', sans-serif;
    font-size: 0.9rem;
    color: rgba(255,255,255,0.6);
    margin: 0;
    line-height: 1.75;
  }

  /* ── Shake ── */
  @keyframes cb-shake {
    0%, 100% { transform: translateX(0); }
    15%  { transform: translateX(-8px); }
    30%  { transform: translateX(8px); }
    45%  { transform: translateX(-6px); }
    60%  { transform: translateX(6px); }
    75%  { transform: translateX(-3px); }
    90%  { transform: translateX(3px); }
  }
  .cb-shake { animation: cb-shake 0.5s ease-in-out; }

  /* ── Quick-fire round ── */
  .cb-qf-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
    margin-top: 20px;
  }
  .cb-qf-item {
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 14px;
    padding: 20px 18px;
    cursor: pointer;
    transition: border-color 0.3s, background 0.3s, transform 0.35s cubic-bezier(0.16,1,0.3,1);
    position: relative;
    overflow: hidden;
  }
  .cb-qf-item:hover {
    border-color: rgba(212,168,83,0.3);
    background: rgba(212,168,83,0.05);
    transform: translateY(-3px);
  }
  .cb-qf-item.bias {
    border-color: rgba(232,135,140,0.45) !important;
    background: rgba(232,135,140,0.08) !important;
    transform: none !important;
  }
  .cb-qf-item.no-bias {
    border-color: rgba(126,212,155,0.45) !important;
    background: rgba(126,212,155,0.07) !important;
    transform: none !important;
  }
  .cb-qf-icon {
    font-size: 1.8rem;
    margin-bottom: 10px;
    display: block;
  }
  .cb-qf-text {
    font-family: 'Lato', sans-serif;
    font-size: 0.86rem;
    color: rgba(255,255,255,0.65);
    line-height: 1.6;
    font-weight: 300;
  }
  .cb-qf-verdict {
    display: none;
    margin-top: 10px;
    font-family: 'Cabin', sans-serif;
    font-weight: 700;
    font-size: 0.65rem;
    text-transform: uppercase;
    letter-spacing: 0.1em;
  }
  .cb-qf-item.bias .cb-qf-verdict { display: block; color: #e8878c; }
  .cb-qf-item.no-bias .cb-qf-verdict { display: block; color: #7ed49b; }

  /* ── Concept badges ── */
  .cb-badges {
    display: flex; flex-wrap: wrap; gap: 10px;
    margin-top: 18px;
  }
  .cb-badge {
    display: inline-flex; align-items: center; gap: 8px;
    padding: 9px 18px;
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 24px;
    font-family: 'Cabin', sans-serif;
    font-weight: 700;
    font-size: 0.68rem;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: rgba(255,255,255,0.7);
    transition: border-color 0.3s, background 0.3s, transform 0.3s;
  }
  .cb-badge:hover {
    border-color: rgba(212,168,83,0.4);
    background: rgba(212,168,83,0.08);
    transform: translateY(-2px);
  }
  .cb-dot {
    width: 7px; height: 7px;
    border-radius: 50%;
    background: #d4a853;
    flex-shrink: 0;
  }

  /* ── Final challenge textarea ── */
  .cb-textarea {
    width: 100%; box-sizing: border-box;
    margin-top: 16px;
    padding: 16px 18px;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 14px;
    font-family: 'Lato', sans-serif;
    font-size: 0.92rem;
    color: #e0e0e0;
    resize: vertical;
    min-height: 88px;
    outline: none;
    transition: border-color 0.3s, background 0.3s;
    line-height: 1.7;
  }
  .cb-textarea:focus {
    border-color: rgba(212,168,83,0.4);
    background: rgba(255,255,255,0.065);
  }
  .cb-textarea::placeholder { color: rgba(255,255,255,0.22); }

  .cb-submit-btn {
    margin-top: 12px;
    padding: 12px 30px;
    background: #d4a853;
    color: #0a110c;
    border: none;
    border-radius: 26px;
    font-family: 'Cabin', sans-serif;
    font-weight: 700;
    font-size: 0.7rem;
    text-transform: uppercase;
    letter-spacing: 0.14em;
    cursor: pointer;
    transition: background 0.3s, transform 0.35s cubic-bezier(0.16,1,0.3,1), box-shadow 0.3s;
  }
  .cb-submit-btn:hover {
    background: #e0bd70;
    transform: translateY(-3px);
    box-shadow: 0 8px 28px rgba(212,168,83,0.22);
  }
  .cb-submit-msg {
    display: none;
    margin-top: 12px;
    font-size: 0.85rem;
    font-family: 'Cabin', sans-serif;
    font-weight: 700;
    color: #d4a853;
  }

  /* ── Key takeaway ── */
  .cb-takeaway {
    padding: 64px 48px;
    max-width: 820px;
    margin: 0 auto;
    text-align: center;
    background: rgba(255,255,255,0.03);
    backdrop-filter: blur(10px);
    border-radius: 22px;
    border: 1px solid rgba(255,255,255,0.07);
    position: relative; z-index: 2;
    transition: border-color 0.5s, background 0.5s;
  }
  .cb-takeaway:hover {
    border-color: rgba(212,168,83,0.18);
    background: rgba(255,255,255,0.05);
  }
  .cb-takeaway-lbl {
    font-family: 'Cabin', sans-serif;
    font-size: 0.6rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.28em;
    color: rgba(212,168,83,0.6);
    margin: 0 0 24px;
  }
  .cb-takeaway-quote {
    position: relative; padding: 0 28px;
  }
  .cb-takeaway-quote::before {
    content: '\201C';
    font-family: 'Libre Baskerville', serif;
    font-size: 4rem;
    color: rgba(212,168,83,0.18);
    position: absolute;
    top: -20px; left: -4px;
    line-height: 1;
  }
  .cb-takeaway p {
    font-size: 1.05rem;
    color: rgba(255,255,255,0.62);
    line-height: 2;
    font-family: 'Libre Baskerville', serif;
    font-style: italic;
    max-width: 540px;
    margin: 0 auto;
  }

  /* ── Divider ── */
  .cb-divider {
    display: flex; align-items: center; justify-content: center;
    padding: 24px 40px; position: relative; z-index: 2;
  }
  .cb-divider-line {
    width: 100%; max-width: 700px; height: 1px;
    background: linear-gradient(90deg, transparent, rgba(212,168,83,0.18), transparent);
    position: relative;
  }
  .cb-divider-icon {
    position: absolute; top: 50%; left: 50%;
    transform: translate(-50%,-50%);
    padding: 4px 14px;
    background: #0a110c;
    font-size: 0.9rem;
  }

  /* ── Confetti canvas ── */
  #cb-confetti { position: fixed; inset: 0; pointer-events: none; z-index: 9990; }

  /* ── Bias-o-meter corner widget ── */
  .cb-meter-corner {
    position: fixed;
    top: 80px;
    left: 18px;
    z-index: 999999;
    background: rgba(10,17,12,0.92);
    backdrop-filter: blur(14px);
    -webkit-backdrop-filter: blur(14px);
    border: 1px solid rgba(212,168,83,0.18);
    border-radius: 12px;
    padding: 10px 12px;
    width: 260px;
  }
  .cb-meter-label {
    font-family: 'Cabin', sans-serif;
    font-size: 0.48rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.18em;
    color: rgba(212,168,83,0.55);
    margin-bottom: 7px;
    display: block;
  }
  .cb-meter-track {
    width: 100%; height: 6px;
    background: rgba(255,255,255,0.06);
    border-radius: 4px;
    overflow: hidden;
  }
  .cb-meter-fill {
    height: 100%;
    border-radius: 4px;
    background: linear-gradient(90deg, #7ed49b, #d4a853, #e8878c);
    width: 0%;
    transition: width 1.4s cubic-bezier(0.16,1,0.3,1);
  }
  .cb-meter-btns {
    display: flex;
    gap: 6px;
    margin-top: 8px;
  }
  .cb-meter-btn {
    flex: 1;
    padding: 4px 0;
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 6px;
    color: rgba(255,255,255,0.5);
    font-family: 'Cabin', sans-serif;
    font-weight: 700;
    font-size: 0.85rem;
    cursor: pointer;
    transition: background 0.2s, color 0.2s;
    line-height: 1;
  }
  .cb-meter-btn:hover { background: rgba(212,168,83,0.12); color: #d4a853; }
  .cb-meter-complete {
    display: none;
    margin-top: 8px;
    font-family: 'Cabin', sans-serif;
    font-size: 0.48rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: #7ed49b;
    line-height: 1.4;
    text-align: center;
  }

  /* ── Hotkey pill ── */
  .cb-hotkey {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 4px 12px;
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.12);
    border-radius: 6px;
    font-family: 'Cabin', sans-serif;
    font-size: 0.62rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: rgba(255,255,255,0.4);
    margin-left: 10px;
    vertical-align: middle;
  }

  /* ── Footer pad ── */
  .cb-footer-pad { height: 80px; }

  /* ── Responsive ── */
  @media (max-width: 900px) {
    .cb-hero { padding: 28px 24px; }
    .cb-hero h1 { font-size: 1.8rem; }
    .cb-section { padding: 40px 22px; }
  }
  @media (max-width: 640px) {
    .cb-hero { flex-direction: column; align-items: flex-start; padding: 24px 18px; gap: 20px; }
    .cb-hero h1 { font-size: 1.6rem; }
    .cb-hero-right { align-items: flex-start; }
    .cb-vote-row, .cb-qf-grid { grid-template-columns: 1fr; }
    .cb-takeaway { padding: 36px 20px; }
    .cb-card { padding: 24px 18px; }
    .cb-progress-track { display: none; }
  }
</style>

<!-- Confetti canvas -->
<canvas id="cb-confetti"></canvas>

<!-- Fixed overlays -->
<div class="cb-grain"></div>
<div class="cb-particles" id="cb-particles"></div>

<!-- Bias-O-Meter corner widget -->
<div class="cb-meter-corner">
  <span class="cb-meter-label">Bias-O-Meter</span>
  <div class="cb-meter-track">
    <div class="cb-meter-fill" id="cb-meter"></div>
  </div>
  <div class="cb-meter-btns">
    <button class="cb-meter-btn" onclick="bumpMeter(10)">+</button>
    <button class="cb-meter-btn" onclick="bumpMeter(-10)">-</button>
  </div>
  <div class="cb-meter-complete" id="cb-meter-complete">Congratulations on mastering identifying bias!</div>
</div>

<!-- ── Sticky timer bar ── -->
<div class="cb-timer-bar">
  <div class="cb-timer-bar-left">
    <span class="cb-lesson-tag">AP CSP · 5.3</span>
    <span class="cb-timer-display" id="cb-timer">5:00</span>
    <button class="cb-timer-btn" id="cb-timer-btn" onclick="toggleTimer()">Start</button>
  </div>
  <div class="cb-timer-bar-right">
    <span class="cb-score-display">Class Points: <span class="cb-score-val" id="cb-score">0</span></span>
    <div class="cb-progress-track"><div class="cb-progress-fill" id="cb-prog"></div></div>
  </div>
</div>

<div class="cb-page">

  <!-- ══════════════════════════════════════════
       HERO
  ═══════════════════════════════════════════ -->
  <div class="cb-hero">
    <div class="cb-hero-left">
      <span class="cb-hero-eyebrow">AP CSP · Unit 5.3 · Computing & Society</span>
      <h1>Is Your AI <span class="cb-hero-accent">Racist?</span></h1>
      <p class="cb-hero-sub">(Maybe. Let's find out in 5 minutes.)</p>
    </div>
    <div class="cb-hero-right">
      <div class="cb-hero-chips">
        <div class="cb-hero-chip">
          <span class="cb-hero-chip-num">5</span>
          <span class="cb-hero-chip-lbl">Sections</span>
        </div>
        <div class="cb-hero-chip">
          <span class="cb-hero-chip-num">3</span>
          <span class="cb-hero-chip-lbl">Challenges</span>
        </div>
        <div class="cb-hero-chip">
          <span class="cb-hero-chip-num">AP</span>
          <span class="cb-hero-chip-lbl">Exam Ready</span>
        </div>
      </div>
      <button class="cb-start-btn" onclick="startLesson()">
        <svg viewBox="0 0 24 24" fill="currentColor"><polygon points="5,3 19,12 5,21"/></svg>
        Start Lesson
      </button>
    </div>
  </div>

  <!-- ══════════════════════════════════════════
       SECTION 1 - WARM-UP
  ═══════════════════════════════════════════ -->
  <div class="cb-section">
    <div class="cb-tag cb-reveal">0:00 – 1:00 · Warm-Up</div>

    <div class="cb-big-q cb-reveal">
      <h2>Raise your hand if you've ever been recommended something online - a video, a song, an ad.</h2>
      <div id="algo-reveal-box" onclick="revealAlgo()" style="display:inline-block; padding:10px 28px; background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.12); border-radius:10px; font-family:'Cabin',sans-serif; font-weight:700; font-size:1.1rem; color:rgba(255,255,255,0.3); cursor:pointer; transition:background 0.2s, color 0.2s; margin-top:8px;">???</div>
      <p id="algo-reveal-text" style="display:none; margin-top:12px;">That was an algorithm deciding what you see. Now keep that in mind.</p>
    </div>

    <div class="cb-card cb-reveal">
      <h2>Here's the twist...</h2>
      <p>
        Computers don't have opinions. They don't have feelings. They don't discriminate <em>on purpose</em>.
        But they absolutely can, and do, produce unfair results. Here are two real examples:
      </p>
      <ul>
        <li><strong style="color:#d4a853;">Amazon</strong> built a hiring AI that learned to downrank resumes containing the word "women's" (like "women's chess club") because it was trained on 10 years of mostly male hires.</li>
        <li><strong style="color:#d4a853;">Facial recognition</strong> used by US police departments misidentified Black faces up to 35 times more often than white faces, leading to wrongful arrests.</li>
      </ul>
      <div class="cb-callout">
        Hot take: A biased AI isn't evil. It's just a mirror reflecting biased humans and biased data.
      </div>
      <p>So the question isn't "is the computer evil?" It's <strong style="color:#d4a853;">"where did the bias come from?"</strong></p>
    </div>
  </div>

  <div class="cb-divider"><div class="cb-divider-line"></div></div>

  <!-- ══════════════════════════════════════════
       SECTION 2 - WHAT IS COMPUTING BIAS
  ═══════════════════════════════════════════ -->
  <div class="cb-section">
    <div class="cb-tag cb-reveal">1:00 – 2:00 · Core Concept</div>

    <div class="cb-card cb-reveal">
      <h2>Computing Bias, Defined</h2>
      <p>
        <strong style="color:#d4a853;">Computing bias</strong> = when a system produces unfair or skewed results
        because of flawed data or flawed design.
      </p>
      <div class="cb-callout">
        Garbage in → Garbage (or biased) out
      </div>
      <p>Bias has three culprits. Every single time:</p>
      <div class="cb-badges">
        <span class="cb-badge"><span class="cb-dot"></span>Data - who &amp; what was included</span>
        <span class="cb-badge"><span class="cb-dot"></span>Design - how the system was built</span>
        <span class="cb-badge"><span class="cb-dot"></span>Humans - the decisions behind both</span>
      </div>
    </div>

  </div>

  <div class="cb-divider"><div class="cb-divider-line"></div></div>

  <!-- ══════════════════════════════════════════
       SECTION 3 - TEAM VOTE CHALLENGE
  ═══════════════════════════════════════════ -->
  <div class="cb-section">
    <div class="cb-tag cb-reveal">2:00 – 3:00 · Team Challenge · +25 pts</div>

    <div class="cb-big-q cb-reveal">
      <h2>Honors Class AI Scenario</h2>
      <p>
        A school uses an AI to decide who gets into the honors class.
        The AI was trained on 10 years of past data - but historically, most honors students were
        athletes and STEM students.
      </p>
    </div>

    <div class="cb-card cb-reveal">
      <h2>What's happening here?</h2>
      <p>Split the room. Left side vs. right side. Vote:</p>
      <div class="cb-vote-row" id="vote-row-1">
        <button class="cb-vote-btn team-a" onclick="teamVote('vote-row-1','a')">
          <strong>The AI is broken</strong>
          <span class="cb-vote-count" id="vote-1a-count">0</span>
          <span style="font-size:0.65rem; font-weight:400; margin-top:4px; display:block; opacity:0.7;">Team Left - click to vote</span>
        </button>
        <button class="cb-vote-btn team-b" onclick="teamVote('vote-row-1','b')">
          <strong>It's data bias</strong>
          <span class="cb-vote-count" id="vote-1b-count">0</span>
          <span style="font-size:0.65rem; font-weight:400; margin-top:4px; display:block; opacity:0.7;">Team Right - click to vote</span>
        </button>
      </div>
      <button class="cb-submit-btn" style="margin-top:16px;" onclick="revealVote('vote-row-1','verdict-1')">Reveal Answer</button>
      <div class="cb-verdict" id="verdict-1">
        <div class="cb-verdict-title" id="verdict-1-title"></div>
        <p id="verdict-1-text"></p>
      </div>
    </div>
  </div>

  <div class="cb-divider"><div class="cb-divider-line"></div></div>

  <!-- ══════════════════════════════════════════
       SECTION 4 - QUICK FIRE ROUND
  ═══════════════════════════════════════════ -->
  <div class="cb-section">
    <div class="cb-tag cb-reveal">3:00 – 4:00 · Quick-Fire Round · +10 pts each</div>

    <div class="cb-card cb-reveal">
      <h2>Biased or Not? <span class="cb-hotkey">Click each one</span></h2>
      <div class="cb-qf-grid" id="qf-grid">

        <div class="cb-qf-item" id="qf-1" onclick="revealQF('qf-1','bias',10)">
          <div class="cb-qf-text">Facial recognition works worse on darker skin tones.</div>
          <div class="cb-qf-verdict">Biased - Skewed training data</div>
        </div>

        <div class="cb-qf-item" id="qf-2" onclick="revealQF('qf-2','no-bias',10)">
          <div class="cb-qf-text">A calculator gives everyone the same answer.</div>
          <div class="cb-qf-verdict">Not biased - Pure logic, no data</div>
        </div>

        <div class="cb-qf-item" id="qf-3" onclick="revealQF('qf-3','no-bias',10)">
          <div class="cb-qf-text">A weather app gives the same forecast every time.</div>
          <div class="cb-qf-verdict">Not biased - Deterministic model</div>
        </div>

        <div class="cb-qf-item" id="qf-4" onclick="revealQF('qf-4','bias',10)">
          <div class="cb-qf-text">A hiring AI keeps rejecting women's resumes.</div>
          <div class="cb-qf-verdict">Biased - Historical data encoded bias</div>
        </div>

      </div>
    </div>
  </div>

  <div class="cb-divider"><div class="cb-divider-line"></div></div>

  <!-- ══════════════════════════════════════════
       SECTION 5 - FINAL BOSS CHALLENGE
  ═══════════════════════════════════════════ -->
  <div class="cb-section">
    <div class="cb-tag cb-reveal">4:00 – 5:00 · Final Boss · +25 pts</div>

    <div class="cb-big-q cb-reveal">
      <h2>One Sentence. That's All We Need.</h2>
      <p>
        Why does computing bias matter in real systems like hiring, school admissions, or medical diagnosis?
        Write your best one-sentence AP exam answer.
      </p>
    </div>

    <div class="cb-card cb-reveal">
      <h2>Your Answer</h2>
      <div class="cb-callout">
        AP Hint: Think <strong>fairness + real-world harm to real people</strong>.
        Don't just say "it's unfair" - say <em>why</em> and <em>who gets hurt</em>.
      </div>
      <textarea class="cb-textarea" id="cb-final" placeholder="Computing bias matters because..."></textarea>
      <br>
      <button class="cb-submit-btn" onclick="submitFinal()">Submit for +25 pts</button>
      <div class="cb-submit-msg" id="cb-final-msg"></div>
    </div>

    <!-- Answer reveal -->
    <div class="cb-card cb-reveal">
      <h2>A+ Sample Answer</h2>
      <p style="color:rgba(255,255,255,0.3); font-style:italic; font-size:0.85rem;">
        Reveal after students submit ↓
      </p>
      <button class="cb-submit-btn" style="background:transparent; border:1px solid rgba(212,168,83,0.3); color:#d4a853; margin-top: 0;" onclick="revealSample()">
        Reveal Sample Answer
      </button>
      <div id="sample-answer" style="display:none; margin-top:18px;">
        <div class="cb-callout">
          Computing bias matters because biased algorithms make real decisions about real people, and those decisions systematically hurt already-marginalized groups.
        </div>
      </div>
    </div>
  </div>

  <!-- ══════════════════════════════════════════
       TAKEAWAY
  ═══════════════════════════════════════════ -->
  <div class="cb-section">
    <div class="cb-takeaway cb-reveal">
      <p class="cb-takeaway-lbl">The One Thing to Remember</p>
      <div class="cb-takeaway-quote">
        <p>
          Computers aren't neutral. Bias enters through data and design decisions made by humans —
          and its effects are felt by real people in the real world. That's why AP CSP calls this
          a <em>societal</em> issue, not just a technical one.
        </p>
      </div>
    </div>
  </div>

  <div class="cb-footer-pad"></div>

</div><!-- end .cb-page -->

<script>
(function () {

  /* ─────────────────────────────────────────
     PARTICLES
  ───────────────────────────────────────── */
  var pc = document.getElementById('cb-particles');
  var glyphs = ['B','p','§','0','1','A','r','k','d','R','¶','N','f','m','T','&'];
  for (var i = 0; i < 20; i++) {
    var el = document.createElement('div');
    el.className = 'cb-particle';
    el.textContent = glyphs[i % glyphs.length];
    el.style.fontSize  = (9 + Math.random() * 15) + 'px';
    el.style.left      = Math.random() * 100 + '%';
    el.style.animationDuration = (16 + Math.random() * 28) + 's';
    el.style.animationDelay   = -(Math.random() * 32) + 's';
    el.style.opacity   = 0.05 + Math.random() * 0.09;
    pc.appendChild(el);
  }

  /* ─────────────────────────────────────────
     SCROLL REVEAL
  ───────────────────────────────────────── */
  var revEls = document.querySelectorAll('.cb-reveal');
  if ('IntersectionObserver' in window) {
    var revObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('visible'); revObs.unobserve(e.target); }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
    revEls.forEach(function (el) { revObs.observe(el); });
  } else {
    revEls.forEach(function (el) { el.classList.add('visible'); });
  }

  /* ─────────────────────────────────────────
     HERO H1 3D TILT
  ───────────────────────────────────────── */
  var h1 = document.querySelector('.cb-hero h1');
  if (h1) {
    h1.addEventListener('mousemove', function (e) {
      var r = h1.getBoundingClientRect();
      var x = (e.clientX - r.left) / r.width  - 0.5;
      var y = (e.clientY - r.top)  / r.height - 0.5;
      h1.style.transform = 'perspective(800px) rotateY(' + (x*7) + 'deg) rotateX(' + (-y*4) + 'deg)';
    });
    h1.addEventListener('mouseleave', function () { h1.style.transform = ''; });
  }

  /* ─────────────────────────────────────────
     COUNTER ANIMATION
  ───────────────────────────────────────── */
  var counters = document.querySelectorAll('.cb-stat-num[data-target]');
  if ('IntersectionObserver' in window) {
    var cObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        var el = e.target;
        var target = parseInt(el.getAttribute('data-target'), 10);
        var start = performance.now();
        var dur = 1600;
        function step(now) {
          var t = Math.min((now - start) / dur, 1);
          var eased = 1 - Math.pow(1 - t, 3);
          el.textContent = Math.floor(eased * target);
          if (t < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
        cObs.unobserve(el);
      });
    }, { threshold: 0.4 });
    counters.forEach(function (el) { cObs.observe(el); });
  }

  /* ─────────────────────────────────────────
     PROGRESS BAR (scroll-based)
  ───────────────────────────────────────── */
  var progFill = document.getElementById('cb-prog');
  window.addEventListener('scroll', function () {
    var doc = document.documentElement;
    var scrolled = doc.scrollTop;
    var total = doc.scrollHeight - doc.clientHeight;
    if (total > 0) progFill.style.width = Math.min(100, (scrolled / total) * 100) + '%';
  }, { passive: true });

})();

/* ─────────────────────────────────────────
   SCORE
───────────────────────────────────────── */
var classScore = 0;
function addScore(pts) {
  classScore += pts;
  var el = document.getElementById('cb-score');
  el.textContent = classScore;
  el.classList.remove('bump');
  void el.offsetWidth; // reflow
  el.classList.add('bump');
  setTimeout(function () { el.classList.remove('bump'); }, 500);
}
window.addScore = addScore;

/* ─────────────────────────────────────────
   TIMER
───────────────────────────────────────── */
var timerSeconds = 300;
var timerRunning = false;
var timerInterval = null;

function toggleTimer() {
  if (timerRunning) {
    clearInterval(timerInterval);
    timerRunning = false;
    document.getElementById('cb-timer-btn').textContent = 'Resume';
  } else {
    timerRunning = true;
    document.getElementById('cb-timer-btn').textContent = 'Pause';
    timerInterval = setInterval(function () {
      timerSeconds--;
      var m = Math.floor(timerSeconds / 60);
      var s = timerSeconds % 60;
      var disp = document.getElementById('cb-timer');
      disp.textContent = m + ':' + (s < 10 ? '0' : '') + s;
      if (timerSeconds <= 30) disp.classList.add('urgent');
      if (timerSeconds <= 0) {
        clearInterval(timerInterval);
        timerRunning = false;
        document.getElementById('cb-timer-btn').textContent = 'Time\'s Up!';
        document.getElementById('cb-timer-btn').disabled = true;
        confettiBurst(200);
      }
    }, 1000);
  }
}
window.toggleTimer = toggleTimer;

function startLesson() {
  // Start the timer
  if (!timerRunning) toggleTimer();
  // Scroll to the first section
  var firstSection = document.querySelector('.cb-section');
  if (firstSection) {
    firstSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}
window.startLesson = startLesson;

/* ─────────────────────────────────────────
   TEAM VOTE
───────────────────────────────────────── */
var votes = {};
var correctAnswers = { 'vote-row-1': 'b' };

function teamVote(rowId, choice) {
  if (!votes[rowId]) votes[rowId] = { a: 0, b: 0 };
  votes[rowId][choice]++;
  document.getElementById('vote-1a-count').textContent = votes[rowId].a;
  document.getElementById('vote-1b-count').textContent = votes[rowId].b;
}
window.teamVote = teamVote;

function revealVote(rowId, verdictId) {
  var v = votes[rowId] || { a: 0, b: 0 };
  var correct = correctAnswers[rowId];
  var winning = v.a >= v.b ? 'a' : 'b';
  var verdict = document.getElementById(verdictId);
  var title   = document.getElementById(verdictId + '-title');
  var text    = document.getElementById(verdictId + '-text');

  if (correct === 'b') {
    verdict.className = 'cb-verdict correct';
    title.textContent = winning === 'b'
      ? 'Team Right got it!'
      : 'Team Left had it wrong - Team Right had it!';
    text.textContent = 'It\'s data bias, not a broken AI. The system learned from historically skewed data. Artists, musicians, and humanities students get left out because they were never well-represented in the training set. The AP exam loves this distinction.';
    addScore(25);
    bumpMeter(30);
    confettiBurst(120);
  }
}
window.revealVote = revealVote;

/* ─────────────────────────────────────────
   QUICK-FIRE
───────────────────────────────────────── */
var qfRevealed = {};
function revealQF(id, result, pts) {
  if (qfRevealed[id]) return;
  qfRevealed[id] = true;
  var el = document.getElementById(id);
  el.classList.add(result);
  el.style.pointerEvents = 'none';
  if (result === 'bias') {
    bumpMeter(12);
    addScore(pts);
  } else {
    addScore(pts);
  }
  // Check if all revealed
  var ids = ['qf-1','qf-2','qf-3','qf-4'];
  if (ids.every(function(i){ return qfRevealed[i]; })) {
    confettiBurst(100);
  }
}
window.revealQF = revealQF;

/* ─────────────────────────────────────────
   FINAL CHALLENGE
───────────────────────────────────────── */
function submitFinal() {
  var val = (document.getElementById('cb-final').value || '').trim();
  var msg = document.getElementById('cb-final-msg');
  if (!val) {
    msg.style.display = 'block';
    msg.style.color   = 'rgba(232,135,140,0.9)';
    msg.textContent   = 'Type at least one sentence first!';
    return;
  }
  msg.style.display = 'block';
  msg.style.color   = '#d4a853';
  msg.textContent   = 'Nice! +25 points to the class.';
  addScore(25);
  bumpMeter(25);
  confettiBurst(140);
}
window.submitFinal = submitFinal;

function revealAlgo() {
  document.getElementById('algo-reveal-box').style.display = 'none';
  document.getElementById('algo-reveal-text').style.display = 'block';
}
window.revealAlgo = revealAlgo;

function revealSample() {
  document.getElementById('sample-answer').style.display = 'block';
}
window.revealSample = revealSample;

/* ─────────────────────────────────────────
   BIAS-O-METER
───────────────────────────────────────── */
var meterVal = 0;
function bumpMeter(amount) {
  meterVal = Math.min(100, Math.max(0, meterVal + amount));
  document.getElementById('cb-meter').style.width = meterVal + '%';
  var complete = document.getElementById('cb-meter-complete');
  if (meterVal >= 100) {
    complete.style.display = 'block';
  } else {
    complete.style.display = 'none';
  }
}
window.bumpMeter = bumpMeter;

/* ─────────────────────────────────────────
   CONFETTI
───────────────────────────────────────── */
function confettiBurst(count) {
  var canvas = document.getElementById('cb-confetti');
  var ctx    = canvas.getContext('2d');
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;

  var pieces = [];
  var colors = ['#d4a853','#7ed49b','#7ecbd6','#e8878c','#fff','#f0c341'];
  for (var i = 0; i < count; i++) {
    pieces.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height * 0.4 - 20,
      vx: (Math.random() - 0.5) * 8,
      vy: Math.random() * -10 - 2,
      w: 6 + Math.random() * 8,
      h: 3 + Math.random() * 5,
      color: colors[Math.floor(Math.random() * colors.length)],
      rot: Math.random() * Math.PI * 2,
      rotV: (Math.random() - 0.5) * 0.2,
      alpha: 1
    });
  }

  var raf;
  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    var alive = false;
    pieces.forEach(function (p) {
      p.x  += p.vx;
      p.y  += p.vy;
      p.vy += 0.3;
      p.rot += p.rotV;
      p.alpha -= 0.012;
      if (p.alpha > 0) {
        alive = true;
        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.w/2, -p.h/2, p.w, p.h);
        ctx.restore();
      }
    });
    if (alive) raf = requestAnimationFrame(draw);
    else ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
  cancelAnimationFrame(raf);
  draw();
}
window.confettiBurst = confettiBurst;
</script>
