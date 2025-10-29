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
author: "CodeMaxxer's Team"
date: 2025-10-24
---

<style>
  :root {
    --card-bg: rgba(20,22,30,0.75);
    --card-border: rgba(255,255,255,0.08);
    --accent: #7dd3fc;
    --accent-2: #a78bfa;
    --good: #22c55e;
    --bad: #ef4444;
    --text: #e5e7eb;
    --muted: #9ca3af;
  }
  .rpg-wrap {
    max-width: 980px; margin: 1.5rem auto; padding: 0 1rem; color: var(--text);
    font-family: system-ui, -apple-system, sans-serif;
  }
  .hud {
    display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin: 10px 0 18px;
  }
  .hud .stat {
    border: 1px solid var(--card-border); background: var(--card-bg);
    border-radius: 10px; padding: 10px 12px;
  }
  .meter { height: 10px; background: #111827; border-radius: 999px; overflow: hidden; margin: 6px 0; }
  .meter > span { display: block; height: 100%; background: linear-gradient(90deg, var(--accent), var(--accent-2)); width: 0%; transition: width .4s ease; }
  .console {
    border: 1px solid var(--card-border); background: linear-gradient(180deg, rgba(15,15,25,.9), rgba(15,15,25,.7));
    border-radius: 14px; padding: 18px; box-shadow: 0 6px 20px rgba(0,0,0,.25); margin-bottom: 14px;
  }
  .transmission {
    border: 1px solid var(--card-border); background: rgba(25,27,39,.75);
    border-radius: 14px; padding: 18px; margin: 16px 0; position: relative;
  }
  .transmission.hidden { display: none; }
  .badge {
    position: absolute; top: -10px; right: 12px; background: var(--accent-2);
    color: #0b1020; font-weight: 700; padding: 2px 10px; border-radius: 999px; font-size: 12px;
  }
  .post {
    background: #0b1020; border: 1px solid var(--card-border); border-radius: 10px;
    padding: 14px; margin: 12px 0; font-size: 15px; line-height: 1.5;
  }
  .post-meta {
    font-size: 12px; color: var(--muted); margin-bottom: 8px;
  }
  .choices {
    display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin: 14px 0;
  }
  .btn {
    cursor: pointer; user-select: none; border: 1px solid var(--card-border); background: #0b1020;
    color: var(--text); padding: 12px 16px; border-radius: 10px; transition: all .15s ease;
    font-weight: 600; text-align: center;
  }
  .btn:hover:not(:disabled) { box-shadow: 0 4px 16px rgba(125,211,252,.15); transform: translateY(-1px); }
  .btn:disabled { opacity: 0.5; cursor: not-allowed; }
  .btn.safe { border-color: rgba(34,197,94,.6); }
  .btn.unsafe { border-color: rgba(239,68,68,.6); }
  .btn.primary { background: linear-gradient(90deg, var(--accent), var(--accent-2)); color: #0b1020; }
  .feedback {
    border-left: 4px solid var(--accent); background: rgba(125,211,252,.08);
    padding: 12px; border-radius: 8px; margin-top: 12px; display: none;
  }
  .feedback.good { border-left-color: var(--good); background: rgba(34,197,94,.08); }
  .feedback.bad { border-left-color: var(--bad); background: rgba(239,68,68,.08); }
  .mini { font-size: 12px; color: var(--muted); }
  .results {
    border: 1px solid var(--card-border); background: radial-gradient(1200px 300px at center, rgba(124,58,237,.06), rgba(2,6,23,.8));
    border-radius: 16px; padding: 24px; text-align: center; margin-top: 16px;
  }
  .hidden { display: none !important; }
  .next-btn-container {
    margin-top: 16px; display: none;
  }
</style>

<div class="rpg-wrap">
  <div class="console" id="intro">
    <h2 style="margin:0 0 8px">📡 Space Transmission Scanner: <span style="color:var(--accent)">Microblog Edition</span></h2>
    <p class="mini">Mission: Scan 10 space microblogs and determine if each transmission is SAFE or MALICIOUS. Your accuracy determines fleet security status.</p>
    <div class="hud">
      <div class="stat">
        <div><strong>Progress</strong></div>
        <div class="meter"><span id="meter-progress"></span></div>
        <div class="mini" id="meter-progress-txt">0/10</div>
      </div>
      <div class="stat">
        <div><strong>Scanner Accuracy</strong></div>
        <div class="meter"><span id="meter-accuracy"></span></div>
        <div class="mini" id="meter-accuracy-txt">0%</div>
      </div>
    </div>
    <button class="btn primary" id="start">Begin Transmission Scan</button>
  </div>

  <div class="transmission hidden" id="question-card">
    <div class="badge" id="q-badge">Transmission 1/10</div>
    <div class="post">
      <div class="post-meta" id="post-meta"></div>
      <div id="post-content"></div>
    </div>
    <div class="mini" style="margin-bottom:10px">Scan Result:</div>
    <div class="choices">
      <button class="btn safe" id="btn-safe">✅ SAFE</button>
      <button class="btn unsafe" id="btn-unsafe">⚠️ MALICIOUS</button>
    </div>
    <div class="feedback" id="feedback"></div>
    <div class="next-btn-container">
      <button class="btn primary" id="btn-next">Next Transmission →</button>
    </div>
  </div>

  <div class="results hidden" id="results">
    <h3 style="margin:0 0 12px">🛸 Scan Complete</h3>
    <div id="final-score" style="font-size:24px; font-weight:700; margin:12px 0"></div>
    <div class="hud" style="max-width:400px; margin:16px auto">
      <div class="stat">
        <div><strong>Final Accuracy</strong></div>
        <div class="meter"><span id="meter-final"></span></div>
        <div class="mini" id="meter-final-txt">0%</div>
      </div>
    </div>
    <div id="verdict" style="margin:16px 0; padding:12px; border-radius:10px"></div>
    <button class="btn primary" onclick="location.reload()" style="margin-top:12px">Scan Again</button>
  </div>
</div>

<script>
(() => {
  const questions = [
    {
      id: 1,
      user: "@SpaceNewsDaily",
      verified: true,
      post: "🚨 BREAKING: Unconfirmed reports of alien fleet spotted near Mars. Source: anonymous tip from dark web forum. SHARE NOW before they delete this!!!",
      answer: "unsafe",
      explanation: "RED FLAGS: Anonymous source, dark web origin, urgent 'share now' pressure, sensational language without verification. Classic misinformation pattern."
    },
    {
      id: 2,
      user: "@NASA_Official",
      verified: true,
      post: "Today's Mars rover update: Collected 3 new rock samples from Jezero Crater. Data available at nasa.gov/mars2025. Team analysis ongoing.",
      answer: "safe",
      explanation: "SAFE: Official verified source, specific details, verifiable link to primary data, measured tone, no urgency manipulation."
    },
    {
      id: 3,
      user: "@TruthSeeker88",
      verified: false,
      post: "They don't want you to know this but the asteroid mining ban is a LIE to control you. Wake up sheeple! DM me for the REAL documents (small fee).",
      answer: "unsafe",
      explanation: "RED FLAGS: Conspiracy framing, 'they' vagueness, antagonistic tone, requests payment for 'truth', unverified account."
    },
    {
      id: 4,
      user: "@Dr_Chen_Astrophysics",
      verified: true,
      post: "New peer-reviewed paper in Nature: exoplanet atmospheric analysis shows methane signatures. Preprint: arxiv.org/abs/2025... Full methods in supplementary materials.",
      answer: "safe",
      explanation: "SAFE: Credentialed expert, peer-reviewed source cited, preprint link provided, transparent methodology. Gold standard for scientific communication."
    },
    {
      id: 5,
      user: "@ViralSpaceFacts",
      verified: false,
      post: "You won't BELIEVE what scientists are hiding about black holes!!! 🤯 Click link in bio for shocking revelation that will change EVERYTHING!!!",
      answer: "unsafe",
      explanation: "RED FLAGS: Pure clickbait format, emotional manipulation, vague claims, no specific information, link bait, multiple exclamation marks."
    },
    {
      id: 6,
      user: "@ESA_Operations",
      verified: true,
      post: "Satellite constellation maintenance scheduled 0300-0500 UTC tomorrow. Expected brief signal interruptions in Northern Europe. Updates: esa.int/ops",
      answer: "safe",
      explanation: "SAFE: Official agency, specific timing, clear scope of impact, reference link, informational purpose without manipulation."
    },
    {
      id: 7,
      user: "@QuickCash_Crypto",
      verified: false,
      post: "🚀 URGENT: Space Mining Token going 10000x THIS WEEK! Elon just bought in (insider confirmed). Last chance before moon! Link: bit.ly/scam123",
      answer: "unsafe",
      explanation: "RED FLAGS: Financial scam indicators, false celebrity endorsement, artificial urgency, unrealistic promises, shortened suspicious link."
    },
    {
      id: 8,
      user: "@Space_Daily_Reporter",
      verified: false,
      post: "Interesting analysis from @Dr_Martinez_MIT on propulsion efficiency trends. Full thread explores trade-offs between ion vs chemical systems. Worth a read for space nerds!",
      answer: "safe",
      explanation: "SAFE: Attributes source appropriately, describes content clearly, acknowledges nuance, personal recommendation without manipulation."
    },
    {
      id: 9,
      user: "@AnonLeaks999",
      verified: false,
      post: "LEAKED classified docs prove government hiding alien contact for 50 years. Can't share here but everyone's talking about it on encrypted channels. Trust NO official sources.",
      answer: "unsafe",
      explanation: "RED FLAGS: Claims classified leak without evidence, directs to unverifiable channels, attacks all official sources, conspiracy pattern."
    },
    {
      id: 10,
      user: "@SpaceWeatherLive",
      verified: true,
      post: "Solar flare M2.3 detected at 14:23 UTC. Minor radio blackouts possible in Pacific region next 1-2 hours. Data: spaceweather.gov Real-time aurora forecasts in next tweet.",
      answer: "safe",
      explanation: "SAFE: Specific technical data, verifiable official source, clear timeframes, actionable information, reference to authoritative site."
    }
  ];

  let currentIdx = 0;
  let correctCount = 0;
  let hasAnswered = false;

  const $ = (s) => document.querySelector(s);

  const updateMeters = () => {
    const progress = ((currentIdx) / 10) * 100;
    const accuracy = currentIdx > 0 ? Math.round((correctCount / currentIdx) * 100) : 0;
    
    $('#meter-progress').style.width = `${progress}%`;
    $('#meter-progress-txt').textContent = `${currentIdx}/10`;
    $('#meter-accuracy').style.width = `${accuracy}%`;
    $('#meter-accuracy-txt').textContent = `${accuracy}%`;
  };

  const showQuestion = () => {
    if (currentIdx >= questions.length) {
      showResults();
      return;
    }

    const q = questions[currentIdx];
    hasAnswered = false;

    $('#q-badge').textContent = `Transmission ${currentIdx + 1}/10`;
    $('#post-meta').innerHTML = `<strong>${q.user}</strong> ${q.verified ? '✓' : ''}`;
    $('#post-content').textContent = q.post;
    $('#feedback').style.display = 'none';
    $('.next-btn-container').style.display = 'none';

    $('#btn-safe').disabled = false;
    $('#btn-unsafe').disabled = false;
  };

  const handleAnswer = (userAnswer) => {
    if (hasAnswered) return;
    hasAnswered = true;

    const q = questions[currentIdx];
    const correct = userAnswer === q.answer;
    const fb = $('#feedback');

    $('#btn-safe').disabled = true;
    $('#btn-unsafe').disabled = true;

    if (correct) {
      correctCount++;
      fb.className = 'feedback good';
      fb.innerHTML = `✅ <strong>CORRECT!</strong> ${q.explanation}`;
    } else {
      fb.className = 'feedback bad';
      fb.innerHTML = `❌ <strong>INCORRECT.</strong> This was ${q.answer.toUpperCase()}. ${q.explanation}`;
    }
    
    fb.style.display = 'block';
    $('.next-btn-container').style.display = 'block';

    currentIdx++;
    updateMeters();
  };

  const showResults = () => {
    $('#intro').classList.add('hidden');
    $('#question-card').classList.add('hidden');
    $('#results').classList.remove('hidden');

    const pct = Math.round((correctCount / 10) * 100);
    $('#final-score').textContent = `${correctCount} / 10 Correct`;
    $('#meter-final').style.width = `${pct}%`;
    $('#meter-final-txt').textContent = `${pct}%`;

    const verdict = $('#verdict');
    if (pct >= 90) {
      verdict.style.background = 'rgba(34,197,94,.15)';
      verdict.style.border = '1px solid rgba(34,197,94,.4)';
      verdict.innerHTML = '🛡️ <strong>ELITE SCANNER</strong>: Fleet security systems optimal. You identified threats with expert precision.';
    } else if (pct >= 70) {
      verdict.style.background = 'rgba(251,191,36,.15)';
      verdict.style.border = '1px solid rgba(251,191,36,.4)';
      verdict.innerHTML = '⚡ <strong>PROFICIENT</strong>: Good threat detection. Review missed transmissions to improve accuracy.';
    } else {
      verdict.style.background = 'rgba(239,68,68,.15)';
      verdict.style.border = '1px solid rgba(239,68,68,.4)';
      verdict.innerHTML = '🔧 <strong>RECALIBRATION NEEDED</strong>: Scanner accuracy below threshold. Study feedback and rescan.';
    }
  };

  $('#start').addEventListener('click', () => {
    $('#intro').classList.add('hidden');
    $('#question-card').classList.remove('hidden');
    showQuestion();
  });

  $('#btn-safe').addEventListener('click', () => handleAnswer('safe'));
  $('#btn-unsafe').addEventListener('click', () => handleAnswer('unsafe'));
  $('#btn-next').addEventListener('click', showQuestion);

  updateMeters();
})();
</script>