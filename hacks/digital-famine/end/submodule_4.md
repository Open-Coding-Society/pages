---
layout: post
title: "Cyber Defense Protocol"
description: "Phase 1/2 Cyber Defense & Final Sequence (Vault) – End Quest"
permalink: /digital-famine/end/submodule_4/
parent: "End Quest"
team: "CodeMaxxers"
submodule: 4
categories: [CSP, Submodule, End]
tags: [end, submodule, codemaxxers]
author: "David, Aryan"
date: 2025-10-24
microblog: true
---

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Digital Famine – Mission Control</title>
  <script src="https://cdn.tailwindcss.com"></script>

  <script>
    tailwind.config = {
      theme: {
        extend: {
          colors: {
            'cyber-dark': '#0f172a',
            'cyber-blue': '#38bdf8',
            'cyber-green': '#10b981',
            'cyber-red': '#ef4444',
            'cyber-text': '#e2e8f0',
            'cyber-turquoise': '#00ffe5',
          },
          fontFamily: { sans: ['Inter', 'sans-serif'] },
          boxShadow: {
            'cyber-glow': '0 0 15px rgba(56, 189, 248, 0.5)',
            'cyber-turq': '0 0 15px rgba(0, 255, 229, 0.6)',
          },
        },
      },
    };
  </script>

  <style>
    body {
      min-height: 100vh;
      overflow-y: auto;
      color: #e2e8f0;
      font-family: 'Inter', sans-serif;
      position: relative;
      background: radial-gradient(circle at 30% 30%, #031122 0%, #010615 60%, #000 100%);
    }

    body::before {
      content: '';
      position: fixed;
      inset: 0;
      background-image: linear-gradient(90deg, rgba(56,189,248,0.05) 1px, transparent 1px),
                        linear-gradient(rgba(56,189,248,0.05) 1px, transparent 1px);
      background-size: 50px 50px;
      animation: gridmove 20s linear infinite;
      z-index: 0;
    }

    body::after {
      content: '';
      position: fixed;
      inset: 0;
      background: radial-gradient(circle at 50% 120%, rgba(16,185,129,0.1), transparent 70%);
      z-index: 0;
      animation: pulse 10s ease-in-out infinite alternate;
    }

    @keyframes gridmove {
      0% { background-position: 0 0, 0 0; }
      100% { background-position: 50px 50px, 50px 50px; }
    }
    @keyframes pulse {
      0% { opacity: 0.3; }
      100% { opacity: 0.6; }
    }

    main {
      position: relative;
      z-index: 1;
      padding: 3rem 1rem;
    }

    .terminal-card {
      background-color: #0f172a;
      border: 2px solid #38bdf8;
      box-shadow: 0 0 40px rgba(56, 189, 248, 0.3);
      max-width: 700px;
      margin: 2rem auto;
    }

    .cyber-button { transition: all 0.2s ease; }
    .cyber-button:hover { transform: translateY(-2px); opacity: 0.9; }

    .cyber-option {
      transition: all 0.25s ease;
      border: 1px solid #38bdf8;
      border-radius: 0.5rem;
      padding: 0.75rem 1rem;
      text-align: left;
      cursor: pointer;
      color: #e2e8f0;
    }

    .cyber-option:hover {
      background-color: rgba(0,255,229,0.1);
      box-shadow: 0 0 12px rgba(0,255,229,0.4);
    }

    .cyber-option.selected {
      background-color: rgba(0,255,229,0.2);
      border-color: #00ffe5;
      box-shadow: 0 0 15px rgba(0,255,229,0.6);
      color: #00ffe5;
    }

    .cyber-input {
      background-color: #0f172a;
      border: 2px solid #38bdf8;
      color: #10b981;
      text-align: center;
      font-size: 2.5rem;
      font-weight: bold;
      letter-spacing: 0.5rem;
      box-shadow: 0 0 10px rgba(56,189,248,0.3);
      padding: 0.5rem;
    }
  </style>
</head>

<main>
  <!-- 🛰️ Mission Briefing -->
  <section class="terminal-card rounded-xl p-8 mb-12">
    <h2 class="text-3xl font-bold text-cyber-blue mb-4 text-center">
      🛰️ Mission Briefing – "Cyber Defense Protocol"
    </h2>
    <p class="text-cyber-text text-lg mb-4">
      The alien network is collapsing, and the final breach threatens to erase Earth’s digital archives.  
      Your task is to **reactivate the Cyber Defense Vault** by proving mastery of all previous modules.  
      Every correct response powers one core of the vault; once all are charged, you’ll synthesize the 4-digit vault PIN.
    </p>
    <ul class="list-disc list-inside text-cyber-green text-base">
      <li>⚡ Recover and verify all three Code Fragments (ALPHA, BRAVO, CHARLIE)</li>
      <li>🧠 Neutralize false data packets in the final diagnostic quiz</li>
      <li>⏳ Complete auxiliary mini-games (Countdown Lock & Hash Match) to fully power the vault</li>
      <li>🔐 Assemble the vault PIN and restore the Sacred Page</li>
    </ul>
  </section>

  <!-- Phase 1: Quiz -->
  <div id="quiz-container" class="terminal-card rounded-xl p-8">
    <h2 class="text-2xl font-bold text-cyber-blue text-center mb-6">🧠 Final Diagnostic Quiz</h2>

    <div id="quiz-questions" class="space-y-6"></div>

    <div class="text-center mt-6">
      <button id="submit-quiz"
        class="cyber-button bg-cyber-blue/90 text-cyber-dark py-2 px-8 rounded-lg"
        onclick="submitQuiz()">Submit Answers</button>
    </div>
  </div>

  <!-- Phase 1.5: Mini-Games -->
  <div id="minigame-container" class="terminal-card rounded-xl p-8 w-full hidden">
    <h2 class="text-3xl font-bold text-cyber-blue text-center mb-4">
      ⚡ Auxiliary Systems – Mini-Games
    </h2>

    <!-- Countdown Lock -->
    <div id="countdown-lock" class="mb-8 text-center">
      <p class="text-cyber-text mb-2">Countdown Lock – type the digits as they flash:</p>
      <div id="countdown-display" class="text-4xl font-mono text-cyber-green mb-4">7424</div>
      <input type="text" id="countdown-input" maxlength="4" class="cyber-input w-2/3" />
      <button class="cyber-button bg-cyber-green/90 text-cyber-dark py-2 px-6 rounded-lg mt-2"
              onclick="checkCountdownLock()">SUBMIT</button>
      <p id="countdown-status" class="mt-2 text-cyber-text"></p>
    </div>

    <!-- Hash Match -->
    <div id="hash-match" class="text-center">
      <p class="text-cyber-text mb-2">Hash Match – match the code fragment to its digest:</p>
      <div id="hash-table" class="mb-4 grid grid-cols-2 gap-4 max-w-md mx-auto">
      </div>
      <button class="cyber-button bg-cyber-green/90 text-cyber-dark py-2 px-6 rounded-lg"
              onclick="checkHashMatch()">CHECK MATCHES</button>
      <p id="hash-status" class="mt-2 text-cyber-text"></p>
    </div>

    <div class="text-center mt-6">
      <button class="cyber-button bg-cyber-blue/90 text-cyber-dark py-2 px-8 rounded-lg"
              onclick="startFinalSequence()">PROCEED TO FINAL VAULT</button>
    </div>
  </div>
</main>

<script>
  const questions = [
    {
      q: "What is the core principle of cybersecurity?",
      options: ["Availability", "Integrity", "Confidentiality", "All of the above"],
      answer: 3
    },
    {
      q: "What does hashing ensure in data security?",
      options: ["Data recovery", "Data transformation", "Data integrity", "Data encryption"],
      answer: 2
    },
    {
      q: "What layer does encryption primarily occur in the OSI model?",
      options: ["Application", "Presentation", "Network", "Session"],
      answer: 1
    }
  ];

  const quizDiv = document.getElementById('quiz-questions');

  questions.forEach((item, i) => {
    const qEl = document.createElement('div');
    qEl.innerHTML = `<p class="text-lg mb-2 text-cyber-text font-medium">${i + 1}. ${item.q}</p>`;
    item.options.forEach((opt, j) => {
      const btn = document.createElement('div');
      btn.className = 'cyber-option';
      btn.textContent = opt;
      btn.onclick = () => selectOption(i, j, btn);
      qEl.appendChild(btn);
    });
    quizDiv.appendChild(qEl);
  });

  const selections = {};

  function selectOption(qIdx, optIdx, element) {
    const siblings = element.parentNode.querySelectorAll('.cyber-option');
    siblings.forEach(btn => btn.classList.remove('selected'));
    element.classList.add('selected');
    selections[qIdx] = optIdx;
  }

  function submitQuiz() {
    document.getElementById('quiz-container').classList.add('hidden');
    document.getElementById('minigame-container').classList.remove('hidden');
    renderHashMatch();
  }

  // --- Countdown Lock ---
  const countdownNumber = '7424';
  function checkCountdownLock() {
    const userInput = document.getElementById('countdown-input').value;
    const statusEl = document.getElementById('countdown-status');
    if(userInput === countdownNumber) {
      statusEl.textContent = 'SUCCESS: Countdown lock sequence entered correctly!';
      statusEl.className = 'mt-2 text-cyber-green';
    } else {
      statusEl.textContent = 'ERROR: Incorrect sequence. Try again.';
      statusEl.className = 'mt-2 text-cyber-red';
    }
  }

  // --- Hash Match ---
  const hashPairs = [
    { code: 'ALPHA-7X9K', hash: 'f1a3c4b9' },
    { code: 'BRAVO-4M8Q', hash: '9b2d1e7f' },
    { code: 'CHARLIE-2N5P', hash: 'c3f7a2d1' }
  ];

  function renderHashMatch() {
    const table = document.getElementById('hash-table');
    table.innerHTML = '';
    hashPairs.forEach(pair => {
      const codeBtn = document.createElement('button');
      codeBtn.textContent = pair.code;
      codeBtn.className = 'cyber-button bg-cyber-blue/80 text-cyber-dark py-1 px-2 rounded';
      codeBtn.onclick = () => codeBtn.classList.toggle('bg-cyber-turquoise/80');
      table.appendChild(codeBtn);

      const hashBtn = document.createElement('button');
      hashBtn.textContent = pair.hash;
      hashBtn.className = 'cyber-button bg-cyber-red/80 text-cyber-dark py-1 px-2 rounded';
      hashBtn.onclick = () => hashBtn.classList.toggle('bg-cyber-turquoise/80');
      table.appendChild(hashBtn);
    });
  }

  function checkHashMatch() {
    const statusEl = document.getElementById('hash-status');
    statusEl.textContent = 'All matches secured. Hash verification complete.';
    statusEl.className = 'mt-2 text-cyber-green';
  }

  function startFinalSequence() {
    alert('Vault systems initializing... 🛰️');
  }
</script>