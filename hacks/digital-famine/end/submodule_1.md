---
layout: post
title: "Task 1 for End Quest"
description: "Submodule 1 for End Quest"
permalink: /digital-famine/end/submodule_1/
parent: "End Quest"
team: "CodeMaxxers"
submodule: 1
categories: [CSP, Submodule, Backend]
tags: [end, submodule, codemaxxers]
author: "William Windle"
microblog: true
date: 2025-10-24
---
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Satellite Repair Mission</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    
    :root {
      --bg-primary: #0a0e27;
      --bg-secondary: #141b3d;
      --card-bg: rgba(20,27,61,0.85);
      --card-border: rgba(100,140,255,0.2);
      --accent: #60a5fa;
      --accent-glow: #3b82f6;
      --success: #10b981;
      --danger: #ef4444;
      --warning: #f59e0b;
      --text: #e5e7eb;
      --text-muted: #9ca3af;
      --signal-good: #22c55e;
      --signal-bad: #dc2626;
    }

    body {
      background: linear-gradient(135deg, var(--bg-primary) 0%, #1a1f4d 100%);
      color: var(--text);
      font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
      min-height: 100vh;
      overflow-x: hidden;
      position: relative;
    }

    body::before {
      content: '';
      position: fixed;
      top: 0; left: 0; right: 0; bottom: 0;
      background: 
        radial-gradient(circle at 20% 50%, rgba(59,130,246,0.1) 0%, transparent 50%),
        radial-gradient(circle at 80% 80%, rgba(139,92,246,0.08) 0%, transparent 50%);
      pointer-events: none;
    }

    .stars {
      position: fixed;
      top: 0; left: 0; right: 0; bottom: 0;
      background: transparent;
      pointer-events: none;
    }

    .star {
      position: absolute;
      width: 2px;
      height: 2px;
      background: white;
      border-radius: 50%;
      animation: twinkle 3s infinite;
    }

    @keyframes twinkle {
      0%, 100% { opacity: 0.3; }
      50% { opacity: 1; }
    }

    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem 1.5rem;
      position: relative;
      z-index: 1;
    }

    .mission-header {
      text-align: center;
      margin-bottom: 2rem;
      animation: fadeInDown 0.6s ease;
    }

    @keyframes fadeInDown {
      from { opacity: 0; transform: translateY(-20px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .mission-header h1 {
      font-size: 2.5rem;
      font-weight: 700;
      background: linear-gradient(90deg, var(--accent), #8b5cf6);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      margin-bottom: 0.5rem;
      text-shadow: 0 0 30px rgba(96,165,250,0.3);
    }

    .mission-header .subtitle {
      color: var(--text-muted);
      font-size: 1.1rem;
    }

    .hud-container {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 1rem;
      margin-bottom: 2rem;
      animation: fadeIn 0.8s ease 0.2s both;
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    .hud-card {
      background: var(--card-bg);
      border: 1px solid var(--card-border);
      border-radius: 16px;
      padding: 1.5rem;
      backdrop-filter: blur(10px);
      box-shadow: 0 8px 32px rgba(0,0,0,0.3);
      transition: all 0.3s ease;
    }

    .hud-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 12px 40px rgba(96,165,250,0.2);
      border-color: var(--accent);
    }

    .hud-card h3 {
      font-size: 0.9rem;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: var(--text-muted);
      margin-bottom: 0.75rem;
    }

    .hud-value {
      font-size: 2rem;
      font-weight: 700;
      color: var(--accent);
      margin-bottom: 0.5rem;
    }

    .progress-bar {
      height: 12px;
      background: rgba(0,0,0,0.4);
      border-radius: 999px;
      overflow: hidden;
      position: relative;
    }

    .progress-fill {
      height: 100%;
      background: linear-gradient(90deg, var(--accent-glow), #8b5cf6);
      border-radius: 999px;
      transition: width 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      box-shadow: 0 0 10px rgba(96,165,250,0.5);
      position: relative;
    }

    .progress-fill::after {
      content: '';
      position: absolute;
      top: 0; left: 0; right: 0; bottom: 0;
      background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
      animation: shimmer 2s infinite;
    }

    @keyframes shimmer {
      0% { transform: translateX(-100%); }
      100% { transform: translateX(100%); }
    }

    .console-card {
      background: var(--card-bg);
      border: 1px solid var(--card-border);
      border-radius: 20px;
      padding: 2rem;
      backdrop-filter: blur(10px);
      box-shadow: 0 12px 48px rgba(0,0,0,0.4);
      animation: fadeInUp 0.6s ease;
    }

    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .transmission-card {
      background: linear-gradient(135deg, rgba(20,27,61,0.9), rgba(30,41,59,0.9));
      border: 1px solid var(--card-border);
      border-radius: 16px;
      padding: 2rem;
      margin-bottom: 1.5rem;
      position: relative;
      overflow: hidden;
    }

    .transmission-card::before {
      content: '';
      position: absolute;
      top: 0; left: 0; right: 0;
      height: 3px;
      background: linear-gradient(90deg, var(--accent), #8b5cf6);
      animation: scanline 3s infinite;
    }

    @keyframes scanline {
      0%, 100% { opacity: 0.3; }
      50% { opacity: 1; }
    }

    .transmission-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
      padding-bottom: 1rem;
      border-bottom: 1px solid var(--card-border);
    }

    .signal-status {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 1rem;
      background: rgba(0,0,0,0.3);
      border-radius: 999px;
      font-weight: 600;
      font-size: 0.9rem;
    }

    .signal-dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      animation: pulse 2s infinite;
    }

    @keyframes pulse {
      0%, 100% { transform: scale(1); opacity: 1; }
      50% { transform: scale(1.2); opacity: 0.7; }
    }

    .transmission-data {
      background: rgba(0,0,0,0.4);
      border: 1px solid rgba(255,255,255,0.05);
      border-radius: 12px;
      padding: 1.5rem;
      margin: 1rem 0;
      font-family: 'Courier New', monospace;
      font-size: 0.95rem;
      line-height: 1.6;
    }

    .data-label {
      color: var(--accent);
      font-weight: 600;
      margin-bottom: 0.5rem;
      display: block;
    }

    .diagnostic-prompt {
      color: var(--text-muted);
      font-size: 0.9rem;
      margin: 1.5rem 0 1rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    .choices-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
      margin: 1rem 0;
    }

    .choice-btn {
      padding: 1.25rem 1.5rem;
      border: 2px solid var(--card-border);
      background: rgba(20,27,61,0.6);
      color: var(--text);
      border-radius: 12px;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      position: relative;
      overflow: hidden;
    }

    .choice-btn::before {
      content: '';
      position: absolute;
      top: 50%; left: 50%;
      width: 0; height: 0;
      border-radius: 50%;
      background: rgba(96,165,250,0.2);
      transform: translate(-50%, -50%);
      transition: width 0.3s, height 0.3s;
    }

    .choice-btn:hover:not(:disabled)::before {
      width: 300px;
      height: 300px;
    }

    .choice-btn:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 8px 24px rgba(96,165,250,0.3);
      border-color: var(--accent);
    }

    .choice-btn.correct {
      border-color: var(--success);
      background: rgba(16,185,129,0.1);
    }

    .choice-btn.incorrect {
      border-color: var(--danger);
      background: rgba(239,68,68,0.1);
    }

    .choice-btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .feedback-panel {
      margin-top: 1.5rem;
      padding: 1.5rem;
      border-radius: 12px;
      border-left: 4px solid;
      animation: slideIn 0.3s ease;
    }

    @keyframes slideIn {
      from { opacity: 0; transform: translateX(-20px); }
      to { opacity: 1; transform: translateX(0); }
    }

    .feedback-panel.correct {
      background: rgba(16,185,129,0.1);
      border-color: var(--success);
    }

    .feedback-panel.incorrect {
      background: rgba(239,68,68,0.1);
      border-color: var(--danger);
    }

    .feedback-title {
      font-weight: 700;
      font-size: 1.1rem;
      margin-bottom: 0.5rem;
    }

    .btn-primary {
      background: linear-gradient(90deg, var(--accent-glow), #8b5cf6);
      color: white;
      border: none;
      padding: 1rem 2.5rem;
      border-radius: 12px;
      font-size: 1.1rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      box-shadow: 0 4px 20px rgba(96,165,250,0.3);
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    .btn-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 32px rgba(96,165,250,0.5);
    }

    .btn-primary:active {
      transform: translateY(0);
    }

    .results-panel {
      text-align: center;
      padding: 3rem 2rem;
    }

    .results-score {
      font-size: 4rem;
      font-weight: 700;
      background: linear-gradient(90deg, var(--accent), #8b5cf6);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      margin: 1rem 0;
    }

    .results-verdict {
      padding: 2rem;
      border-radius: 16px;
      margin: 2rem 0;
      border: 2px solid;
    }

    .btn-container {
      display: flex;
      gap: 1rem;
      justify-content: center;
      flex-wrap: wrap;
      margin-top: 2rem;
    }

    .hidden { display: none !important; }

    @media (max-width: 768px) {
      .mission-header h1 { font-size: 1.8rem; }
      .choices-grid { grid-template-columns: 1fr; }
      .hud-container { grid-template-columns: 1fr; }
    }
  </style>
</head>
<body>
  <div class="stars" id="stars"></div>
  
  <div class="container">
    <div class="mission-header">
      <h1>🛰️ SATELLITE LINK REPAIR PROTOCOL</h1>
      <p class="subtitle">Mission: Diagnose and repair corrupted communication signals between Ground Control and RSV-Phoenix</p>
    </div>

    <div id="intro-section">
      <div class="hud-container">
        <div class="hud-card">
          <h3>⚡ SYSTEMS STATUS</h3>
          <div class="hud-value" id="intro-progress">0/5</div>
          <div class="progress-bar">
            <div class="progress-fill" id="intro-progress-bar" style="width: 0%"></div>
          </div>
        </div>
        <div class="hud-card">
          <h3>🎯 DIAGNOSTIC ACCURACY</h3>
          <div class="hud-value" id="intro-accuracy">0%</div>
          <div class="progress-bar">
            <div class="progress-fill" id="intro-accuracy-bar" style="width: 0%"></div>
          </div>
        </div>
        <div class="hud-card">
          <h3>📡 SIGNAL INTEGRITY</h3>
          <div class="hud-value">DEGRADED</div>
          <p style="color: var(--warning); font-size: 0.9rem; margin-top: 0.5rem;">⚠️ Multiple transmission anomalies detected</p>
        </div>
      </div>

      <div class="console-card">
        <h2 style="margin-bottom: 1rem;">🚀 Mission Brief</h2>
        <p style="line-height: 1.8; color: var(--text-muted); margin-bottom: 1.5rem;">
          The RSV-Phoenix has lost primary satellite connection during its Mars approach sequence. 
          You are receiving 5 diagnostic transmissions through backup channels. Each transmission 
          may contain <strong style="color: var(--success)">VALID signal data</strong> or 
          <strong style="color: var(--danger)">CORRUPTED interference</strong>.
        </p>
        <p style="line-height: 1.8; color: var(--text-muted); margin-bottom: 2rem;">
          Your task: Analyze signal patterns, source authenticity, data integrity markers, and 
          protocol compliance to identify which transmissions are safe to route to the ship's 
          navigation system. One wrong diagnosis could send false coordinates to the crew.
        </p>
        <div style="text-align: center;">
          <button class="btn-primary" id="start-btn">Initialize Diagnostic Sequence</button>
          <div style="margin-top: 1rem;">
            <button class="btn-primary" id="test-btn" style="background: linear-gradient(90deg, var(--warning), #f97316); font-size: 0.9rem; padding: 0.75rem 1.5rem;">⚡ Test Mode (Auto-Complete)</button>
          </div>
        </div>
      </div>
    </div>

    <div id="mission-section" class="hidden">
      <div class="hud-container">
        <div class="hud-card">
          <h3>⚡ SIGNALS PROCESSED</h3>
          <div class="hud-value" id="mission-progress">0/5</div>
          <div class="progress-bar">
            <div class="progress-fill" id="mission-progress-bar" style="width: 0%"></div>
          </div>
        </div>
        <div class="hud-card">
          <h3>🎯 REPAIR ACCURACY</h3>
          <div class="hud-value" id="mission-accuracy">0%</div>
          <div class="progress-bar">
            <div class="progress-fill" id="mission-accuracy-bar" style="width: 0%"></div>
          </div>
        </div>
      </div>

      <div class="console-card">
        <div class="transmission-card">
          <div class="transmission-header">
            <div>
              <div style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 0.25rem;">TRANSMISSION ID</div>
              <div style="font-size: 1.3rem; font-weight: 700;" id="signal-id">#001</div>
            </div>
            <div class="signal-status">
              <div class="signal-dot" id="signal-dot" style="background: var(--signal-good)"></div>
              <span id="signal-count">Signal 1/5</span>
            </div>
          </div>

          <div class="transmission-data">
            <span class="data-label">SOURCE:</span>
            <div id="signal-source" style="margin-bottom: 1rem;"></div>
            
            <span class="data-label">SIGNAL DATA:</span>
            <div id="signal-content"></div>
          </div>

          <div class="diagnostic-prompt">⚙️ Diagnostic Assessment Required:</div>
          <div class="choices-grid">
            <button class="choice-btn" id="btn-valid">
              <span>✅</span>
              <span>VALID SIGNAL</span>
            </button>
            <button class="choice-btn" id="btn-corrupted">
              <span>⚠️</span>
              <span>CORRUPTED DATA</span>
            </button>
          </div>

          <div id="feedback" class="hidden"></div>

          <div id="next-container" class="hidden" style="text-align: center; margin-top: 1.5rem;">
            <button class="btn-primary" id="btn-next">Next Transmission →</button>
          </div>
        </div>
      </div>
    </div>

    <div id="results-section" class="hidden">
      <div class="console-card">
        <div class="results-panel">
          <h2 style="font-size: 2rem; margin-bottom: 1rem;">🛰️ REPAIR SEQUENCE COMPLETE</h2>
          <div class="results-score" id="final-score">0/5</div>
          
          <div class="hud-container" style="max-width: 500px; margin: 2rem auto;">
            <div class="hud-card">
              <h3>📊 FINAL ACCURACY RATING</h3>
              <div class="hud-value" id="final-accuracy">0%</div>
              <div class="progress-bar">
                <div class="progress-fill" id="final-accuracy-bar" style="width: 0%"></div>
              </div>
            </div>
          </div>

          <div id="verdict" class="results-verdict"></div>

          <div class="btn-container">
            <button class="btn-primary" onclick="location.reload()">🔄 Run Diagnostics Again</button>
            <button class="btn-primary hidden" id="return-mission-btn">🚀 Return to Mission</button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <script>
    // Generate stars
    (function() {
      const starsContainer = document.getElementById('stars');
      for (let i = 0; i < 100; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        star.style.left = Math.random() * 100 + '%';
        star.style.top = Math.random() * 100 + '%';
        star.style.animationDelay = Math.random() * 3 + 's';
        starsContainer.appendChild(star);
      }
    })();

    // Only 5 signals now
    const signals = [
      {
        id: "RSV-PHX-001",
        source: "@NASA_DeepSpace • Verified Ground Control Station • Houston, TX",
        content: "RSV-Phoenix trajectory update: Orbital insertion burn scheduled T-minus 72 hours. Delta-V requirement: 1,247 m/s. Telemetry nominal. Full burn sequence uploaded to primary nav computer. Verification code: MARS-2025-PHX-ALPHA.",
        answer: "valid",
        explanation: "VALID: Official NASA source with verification badge, specific technical parameters (Delta-V, timing), procedural language, verification code included. Standard mission update protocol followed."
      },
      {
        id: "ANON-LEAK-447",
        source: "@SpaceLeaks_Insider • Unverified Account • Location Hidden",
        content: "🚨 URGENT: Phoenix crew in DANGER! NASA hiding critical system failures. Thermal shielding compromised but they won't abort mission. SHARE before they silence this! Anonymous source inside mission control confirms coverup. Trust NO official statements!",
        answer: "corrupted",
        explanation: "CORRUPTED: Unverified source, sensational fear language, conspiracy framing, no technical specifics, urgency manipulation tactics, attacks official sources without evidence. Classic misinformation signature."
      },
      {
        id: "MIT-AERO-229",
        source: "@Dr_Rodriguez_MIT • Verified Aerospace Professor • Cambridge, MA",
        content: "Fascinating engineering challenge with Phoenix's entry corridor. New paper analyzing hypersonic thermal dynamics during Mars EDL available on arXiv:2025.10847. Peer review pending. Models suggest Phoenix's ablative shield design offers 15% safety margin improvement over Curiosity.",
        answer: "valid",
        explanation: "VALID: Credentialed academic expert, specific technical content, peer-review transparency mentioned, arXiv preprint reference (verifiable), measured claims with percentage specifics. Scholarly communication standard."
      },
      {
        id: "VIRAL-SPACE-334",
        source: "@CosmicTruths88 • Unverified Account • Anonymous",
        content: "You WON'T BELIEVE what Phoenix cameras captured near Mars!! 😱 Structures that NASA is HIDING from public! Ancient alien technology confirmed! Click for SHOCKING images they don't want you to see! Government knows but won't tell you!!! #TruthSeekers #WakeUp",
        answer: "corrupted",
        explanation: "CORRUPTED: Pure clickbait structure, multiple exclamation marks, vague sensational claims, 'they don't want you to know' conspiracy framing, no specific evidence, manipulation tactics, unverified anonymous source."
      },
      {
        id: "SPACEX-COORD-203",
        source: "@SpaceX_Tracking • Verified SpaceX Operations • Hawthorne, CA",
        content: "Starlink constellation providing comm relay support for RSV-Phoenix during trans-Mars coast phase. Network handoff to NASA DSN for Mars orbit insertion sequence. Anticipate brief signal dropout during atmospheric entry (expected ~7min blackout per mission profile).",
        answer: "valid",
        explanation: "VALID: Verified SpaceX source, explains technical coordination role, realistic details (7min blackout is standard for Mars entry), professional cooperation between private and government space entities."
      }
    ];

    let currentIndex = 0;
    let correctCount = 0;
    let hasAnswered = false;

    const updateMeters = () => {
      const progress = (currentIndex / 5) * 100;
      const accuracy = currentIndex > 0 ? Math.round((correctCount / currentIndex) * 100) : 0;
      
      ['intro', 'mission'].forEach(prefix => {
        const progressBar = document.getElementById(`${prefix}-progress-bar`);
        const progressText = document.getElementById(`${prefix}-progress`);
        const accuracyBar = document.getElementById(`${prefix}-accuracy-bar`);
        const accuracyText = document.getElementById(`${prefix}-accuracy`);
        
        if (progressBar) progressBar.style.width = `${progress}%`;
        if (progressText) progressText.textContent = `${currentIndex}/5`;
        if (accuracyBar) accuracyBar.style.width = `${accuracy}%`;
        if (accuracyText) accuracyText.textContent = `${accuracy}%`;
      });
    };

    const showSignal = () => {
      if (currentIndex >= signals.length) {
        showResults();
        return;
      }

      const signal = signals[currentIndex];
      hasAnswered = false;

      document.getElementById('signal-id').textContent = signal.id;
      document.getElementById('signal-count').textContent = `Signal ${currentIndex + 1}/5`;
      document.getElementById('signal-source').textContent = signal.source;
      document.getElementById('signal-content').textContent = signal.content;
      
      const signalDot = document.getElementById('signal-dot');
      signalDot.style.background = signal.answer === 'valid' ? 'var(--signal-good)' : 'var(--signal-bad)';
      
      document.getElementById('feedback').classList.add('hidden');
      document.getElementById('next-container').classList.add('hidden');
      
      document.getElementById('btn-valid').disabled = false;
      document.getElementById('btn-corrupted').disabled = false;
      document.getElementById('btn-valid').classList.remove('correct', 'incorrect');
      document.getElementById('btn-corrupted').classList.remove('correct', 'incorrect');
    };

    const handleAnswer = (userAnswer) => {
      if (hasAnswered) return;
      hasAnswered = true;

      const signal = signals[currentIndex];
      const correct = userAnswer === signal.answer;
      const feedback = document.getElementById('feedback');
      
      document.getElementById('btn-valid').disabled = true;
      document.getElementById('btn-corrupted').disabled = true;

      if (correct) {
        correctCount++;
        feedback.className = 'feedback-panel correct';
        feedback.innerHTML = `<div class="feedback-title">✅ CORRECT DIAGNOSIS</div><p>${signal.explanation}</p>`;
        
        if (userAnswer === 'valid') {
          document.getElementById('btn-valid').classList.add('correct');
        } else {
          document.getElementById('btn-corrupted').classList.add('correct');
        }
      } else {
        feedback.className = 'feedback-panel incorrect';
        feedback.innerHTML = `<div class="feedback-title">❌ INCORRECT DIAGNOSIS</div><p>This was ${signal.answer.toUpperCase()}. ${signal.explanation}</p>`;
        
        if (userAnswer === 'valid') {
          document.getElementById('btn-valid').classList.add('incorrect');
          document.getElementById('btn-corrupted').classList.add('correct');
        } else {
          document.getElementById('btn-corrupted').classList.add('incorrect');
          document.getElementById('btn-valid').classList.add('correct');
        }
      }
      
      feedback.classList.remove('hidden');
      document.getElementById('next-container').classList.remove('hidden');

      currentIndex++;
      updateMeters();
    };

    const showResults = () => {
      document.getElementById('intro-section').classList.add('hidden');
      document.getElementById('mission-section').classList.add('hidden');
      document.getElementById('results-section').classList.remove('hidden');

      const pct = Math.round((correctCount / 5) * 100);

      if (pct >= 70 && window.markCurrentModuleComplete) {
        window.markCurrentModuleComplete();
      }

      document.getElementById('final-score').textContent = `${correctCount} / 5 Correct`;
      document.getElementById('final-accuracy').textContent = `${pct}%`;
      document.getElementById('final-accuracy-bar').style.width = `${pct}%`;

      const verdict = document.getElementById('verdict');
      const returnBtn = document.getElementById('return-mission-btn');
      
      if (pct >= 90) {
        verdict.style.background = 'rgba(16,185,129,0.15)';
        verdict.style.borderColor = 'var(--success)';
        verdict.innerHTML = '🛡️ <strong>ELITE TECHNICIAN</strong><br>Outstanding performance! All critical systems restored. The RSV-Phoenix navigation is secure and mission-ready.';
        returnBtn.classList.remove('hidden');
      } else if (pct >= 70) {
        verdict.style.background = 'rgba(251,191,36,0.15)';
        verdict.style.borderColor = 'var(--warning)';
        verdict.innerHTML = '⚡ <strong>PROFICIENT OPERATOR</strong><br>Good diagnostic work! Most threats neutralized. Review the missed signals to achieve expert certification.';
        returnBtn.classList.remove('hidden');
      } else {
        verdict.style.background = 'rgba(239,68,68,0.15)';
        verdict.style.borderColor = 'var(--danger)';
        verdict.innerHTML = '🔧 <strong>ADDITIONAL TRAINING REQUIRED</strong><br>System vulnerability remains high. Study the signal patterns and re-attempt diagnostic sequence for mission clearance.';
        returnBtn.classList.add('hidden');
      }
    };

    // Event listeners
    document.getElementById('start-btn').addEventListener('click', () => {
      document.getElementById('intro-section').classList.add('hidden');
      document.getElementById('mission-section').classList.remove('hidden');
      showSignal();
    });

    document.getElementById('test-btn').addEventListener('click', () => {
      // Auto-complete with 100% score
      currentIndex = 5;
      correctCount = 5;
      updateMeters();
      showResults();
      
      // Mark module as complete through progression system
      if (window.markCurrentModuleComplete) {
        window.markCurrentModuleComplete();
      }
    });

    document.getElementById('btn-valid').addEventListener('click', () => handleAnswer('valid'));
    document.getElementById('btn-corrupted').addEventListener('click', () => handleAnswer('corrupted'));
    document.getElementById('btn-next').addEventListener('click', showSignal);
    
    document.getElementById('return-mission-btn').addEventListener('click', () => {
      window.location.href = '/digital-famine/end';
    });

    updateMeters();
  </script>

  <script type="module">
    import { initEndModuleProgression } from '{{site.baseurl}}/assets/js/digitalFamine/endModuleProgression.js';
    
    // Initialize progression system for this module
    initEndModuleProgression();
  </script>
</body>
</html>