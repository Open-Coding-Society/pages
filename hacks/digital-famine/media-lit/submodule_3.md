---
layout: post
title: "Truth Scanner"
description: "Third line of defense from foregin invaders"
permalink: /digital-famine/media-lit/submodule_3/
footer:
  previous: /digital-famine/media-lit/submodule_2
  home: /hacks/navigation
  next: /digital-famine/media-lit/submodule_4
parent: "Analytics/Admin"
team: "Scratchers"
submodule: 3
categories: [CSP, Submodule, Analytics/Admin]
tags: [analytics, submodule, curators]
breadcrumb: true
microblog: true
author: "Adhav, Ethan, Rishabh"
date: 2025-10-28
---
<style>
body {
  min-height: 100vh;
  background: url('{{ site.baseurl }}/hacks/digital-famine/media-lit/media/assets/spacebackground.jpg') no-repeat center center fixed;
  background-size: cover;
  background-color: #061226; /* fallback */
}
</style>

<div class="intro-text">
<h3>Finding the truth</h3>
  As the invasion intensifies, the aliens have shifted tactics. They’re no longer attacking with lasers, they’re attacking with lies. Distorted transmissions are flooding human news networks, spreading confusion and chaos. Your mission: operate the Truth Scanner to protect the planet from misinformation.

  <br><br>

  Each signal that appears is disguised as a news headline. Some are real and straight from trusted Earth sources like CNN, BBC, or Reuters. Others are fabricated distortions broadcast by the alien disinformation network.

  <br><br>

  Your job is to analyze each transmission and decide:
  <ul>
    <li><strong>True:</strong> a verified human report</li>
    <li><strong>False:</strong> an alien-generated fake</li>
  </ul>

  Every correct answer strengthens Earth’s media defense shield. Each mistake weakens it. Stay sharp — the aliens are adapting, and their fakes will grow more convincing as the game progresses.
</div>

<style>
  .game-container {
    background: linear-gradient(135deg, #353e74ff, #9384d5ff);
    color: #222;
    font-family: "Inter", system-ui, sans-serif;
    min-height: 50vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 28px;
    border-radius: 24px;
    margin: 28px auto;
    box-shadow: 0 15px 35px rgba(0,0,0,0.15);
  }
  .intro-text {
  background: rgba(0,0,30,0.85);
  padding: 20px;
  border-radius: 12px;
  font-family: "Inter", system-ui, sans-serif;
  font-size: 1.05rem;
  margin-bottom: 20px;
  line-height: 1.5;
}
  h1 {
    margin-bottom: 1rem;
    font-weight: 700;
  }

  .headline-card {
    background: white;
    border: 1px solid #ccc;
    border-radius: 12px;
    box-shadow: 0 4px 10px rgba(0,0,0,0.08);
    width: 95%;
    max-width: 480px;
    margin: 1rem 0;
    overflow: hidden;
  }

  .browser-bar {
    background: #e9ecf1;
    display: flex;
    align-items: center;
    padding: 6px 10px;
  }

  .dot {
    height: 10px;
    width: 10px;
    border-radius: 50%;
    margin-right: 6px;
  }

  .red { background: #dc8b86ff; }
  .yellow { background: #ecc778ff; }
  .green { background: #85c68fff; }

  .url-bar {
    background: white;
    border-radius: 6px;
    padding: 4px 10px;
    font-size: 0.85rem;
    color: #555;
    flex: 1;
    border: 1px solid #ccc;
  }

  .headline-content {
    padding: 1.5rem;
  }

  .headline-title {
    font-size: 1.2rem;
    font-weight: 600;
    margin-bottom: 0.8rem;
  }

  .source {
    font-size: 0.9rem;
    color: #666;
  }

  .buttons {
    display: flex;
    justify-content: space-between;
    margin-top: 1.2rem;
  }

  button {
    padding: 0.6rem 1.5rem;
    border: none;
    border-radius: 8px;
    font-size: 1rem;
    cursor: pointer;
    transition: background 0.2s;
    font-family: inherit;
  }

  .true-btn {
    background-color: #44a45dff;
    color: white;
    padding: 0.9rem 2.2rem;
    font-size: 1.1rem;
    border-radius: 10px;
    border: none;
    cursor: pointer;
    transition: transform 0.2s ease, background-color 0.2s ease;
  }

  .false-btn {
    background-color: #ad4747ff;
    color: white;
    padding: 0.9rem 2.2rem;
    font-size: 1.1rem;
    border-radius: 10px;
    border: none;
    cursor: pointer;
    transition: transform 0.2s ease, background-color 0.2s ease;
  }

  button:hover {
    opacity: 0.9;
  }

  .leaderboard {
    /* darker leaderboard so header/title is readable */
    background: linear-gradient(135deg, rgba(148, 146, 215, 0.55), rgba(109, 124, 207, 0.47));
    padding: 20px;
    border-radius: 10px;
    margin-top: 20px;
    color: #eaf6ff; /* light text on darker background */
    border: 1px solid rgba(255,255,255,0.04);
    width: 90%;
    max-width: 380px;
  }

  .leaderboard-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
  }

  .leaderboard-table {
    width: 100%;
    border-collapse: collapse;
  }

  .leaderboard-table th,
  .leaderboard-table td {
    padding: 10px;
    text-align: left;
    color: inherit; /* use leaderboard color (light) */
  }

  .leaderboard-table tr:nth-child(even) {
    background: rgba(255,255,255,0.02);
  }

  #refresh-lb.ghost {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 6px 10px;
    background: #5c7cb0ff;
    color: #eaf6ff;
    border: 1px solid rgba(255,255,255,0.06);
    border-radius: 8px;
    font-weight: 700;
    cursor: pointer;
    box-shadow: 0 6px 14px rgba(3,62,97,0.08);
    transition: transform 140ms ease, box-shadow 140ms ease, background 140ms ease;
  }

  #refresh-lb.ghost:hover {
    transform: translateY(-3px);
    box-shadow: 0 10px 24px rgba(3,62,97,0.14);
    background: linear-gradient(90deg, rgba(255,255,255,0.07), rgba(255,255,255,0.02));
  }

  .score-display {
    margin-top: 1rem;
    font-size: 1rem;
    color: #333;
  }
</style>

<div class="game-container">
  <h1>Truth or Fake?</h1>

  <div class="headline-card" id="headline-card">
    <div class="browser-bar">
      <div class="dot red"></div>
      <div class="dot yellow"></div>
      <div class="dot green"></div>
      <div class="url-bar" id="url-bar">https://news.example.com</div>
    </div>
    <div class="headline-content">
      <div class="headline-title" id="headline"></div>
      <div class="source" id="source"></div>
      <div id="feedback" style="text-align: center; margin: 10px 0; font-weight: bold; min-height: 24px;"></div>
      <div class="buttons">
        <button class="true-btn" onclick="checkAnswer(true)">True</button>
        <button class="false-btn" onclick="checkAnswer(false)">False</button>
      </div>
    </div>
  </div>

  <div class="leaderboard">
    <div class="leaderboard-header">
      <strong>Top Players</strong>
      <button id="refresh-lb" class="ghost">Refresh</button>
    </div>
    <table class="leaderboard-table">
      <thead>
        <tr>
          <th>#</th>
          <th>Player</th>
          <th style="text-align:right">Score</th>
        </tr>
      </thead>
      <tbody id="leaderboard-body">
        <tr><td colspan="3" style="text-align:center;color:rgba(3,62,97,0.5)">Loading...</td></tr>
      </tbody>
    </table>
  </div>

  <div class="score-display">Score: <span id="score">0</span></div>
</div>

<script>
  const API_BASE = "https://your-api-url.com/api"; // <-- Change this to your backend API base

    // Headline generation system
  const TOPICS = ['science', 'technology', 'space', 'health', 'environment', 'politics', 'education', 'entertainment'];
  
  const REAL_SOURCES = ['CNN', 'BBC News', 'Reuters', 'Associated Press', 'The Guardian', 'Scientific American', 'Nature', 'NPR'];
  const FAKE_SOURCES = ['Daily Buzz', 'The Cosmic Chronicle', 'Future Times', 'World Weekly Wonder', 'Global Gossip', 'The Daily Whisper'];

  const TRUE_TEMPLATES = [
    'Scientists discover {discovery} in {location}',
    'New research reveals {finding} about {topic}',
    'Study shows link between {topic} and {effect}',
    'Experts confirm {topic} breakthrough in {field}',
    '{organization} announces successful {achievement}',
    'Researchers develop new {technology} for {purpose}'
  ];

  const FALSE_TEMPLATES = [
    'SHOCKING: {topic} causes unexpected {bizarre_effect}',
    'You won\'t BELIEVE what {topic} does to {bizarre_target}',
    'Scientists extremely confused by {impossible_event}',
    'Breaking: {topic} found to enable {impossible_ability}',
    'Secret {organization} plan to use {topic} for {bizarre_purpose}',
    '{location} residents report {impossible_phenomenon}'
  ];

  function generateHeadline(makeFake = false) {
    const templates = makeFake ? FALSE_TEMPLATES : TRUE_TEMPLATES;
    const sources = makeFake ? FAKE_SOURCES : REAL_SOURCES;
    const template = templates[Math.floor(Math.random() * templates.length)];
    const topic = TOPICS[Math.floor(Math.random() * TOPICS.length)];
    
    const variables = {
      topic: topic,
      discovery: ['groundbreaking evidence', 'new species', 'remarkable patterns', 'key mechanisms'][Math.floor(Math.random() * 4)],
      location: ['deep ocean', 'distant galaxy', 'remote region', 'ancient site'][Math.floor(Math.random() * 4)],
      finding: ['significant impact', 'positive correlation', 'important role', 'beneficial effects'][Math.floor(Math.random() * 4)],
      effect: ['human health', 'environmental protection', 'sustainable development', 'scientific understanding'][Math.floor(Math.random() * 4)],
      field: ['medicine', 'renewable energy', 'space exploration', 'conservation'][Math.floor(Math.random() * 4)],
      organization: ['International Research Team', 'Global Science Institute', 'Space Agency', 'Environmental Council'][Math.floor(Math.random() * 4)],
      achievement: ['breakthrough', 'discovery', 'innovation', 'development'][Math.floor(Math.random() * 4)],
      technology: ['sustainable solution', 'advanced system', 'innovative method', 'efficient process'][Math.floor(Math.random() * 4)],
      purpose: ['environmental protection', 'healthcare improvement', 'scientific research', 'space exploration'][Math.floor(Math.random() * 4)],
      bizarre_effect: ['time travel', 'telepathy', 'antigravity', 'dimensional shifts'][Math.floor(Math.random() * 4)],
      bizarre_target: ['your memories', 'reality itself', 'the space-time continuum', 'human evolution'][Math.floor(Math.random() * 4)],
      impossible_event: ['floating cities', 'talking plants', 'spontaneous teleportation', 'mind control waves'][Math.floor(Math.random() * 4)],
      impossible_ability: ['invisibility', 'time manipulation', 'thought transmission', 'reality bending'][Math.floor(Math.random() * 4)],
      bizarre_purpose: ['mind control', 'weather manipulation', 'time travel experiments', 'reality distortion'][Math.floor(Math.random() * 4)],
      impossible_phenomenon: ['floating objects', 'spontaneous rainbows', 'time loops', 'reality glitches'][Math.floor(Math.random() * 4)]
    };
    
    const title = template.replace(/{(\w+)}/g, (_, key) => variables[key] || key);
    const source = sources[Math.floor(Math.random() * sources.length)];
    const url = `https://www.${source.toLowerCase().replace(/\s+/g, '')}.com/${topic}-${Math.random().toString(36).substr(2, 8)}`;
    
    return {
      title: title,
      source: source,
      url: url,
      correct: !makeFake
    };
  }

  // Generate initial set of headlines
  const headlines = Array(6).fill(null).map(() => generateHeadline(Math.random() < 0.5));

  let score = 0;
  let current = {};

      async function fetchUser() {
        try {
            const response = await fetch(javaURI + '/api/person/get', fetchOptions);
            if (response.ok) {
                const data = await response.json();
                currentPlayer = data.name || data.username || 'Guest';
            }
        } catch (err) {
            console.warn('Failed to fetch user:', err);
        }
        updateDisplays();
    }

    async function postScore(username, finalScore) {
        try {
            const response = await fetch(`${javaURI}/api/media/score/${encodeURIComponent(username)}/${finalScore}`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'}
            });
            if (!response.ok) throw new Error('Failed to save score');
            fetchLeaderboard();
        } catch (err) {
            console.error('Error saving score:', err);
        }
    }

    async function fetchLeaderboard() {
        const tbody = document.getElementById('leaderboard-body');
        try {
            const response = await fetch(javaURI + '/api/media/');
            if (!response.ok) throw new Error('Failed to fetch leaderboard');
            const data = await response.json();
            
            tbody.innerHTML = '';
            data.forEach((entry, index) => {
                const row = tbody.insertRow();
                row.insertCell().textContent = entry.rank || (index + 1);
                row.insertCell().textContent = entry.username || 'Unknown';
                row.insertCell().textContent = entry.score || 0;
            });
        } catch (err) {
            console.error('Error fetching leaderboard:', err);
            tbody.innerHTML = '<tr><td colspan="3">Unable to load leaderboard</td></tr>';
        }
    }

  function showFeedback(message, isCorrect) {
    const feedbackEl = document.getElementById("feedback");
    feedbackEl.textContent = message;
    feedbackEl.style.color = isCorrect ? "#418152ff" : "#7a3434ff";
  }

  function newHeadline() {
    setTimeout(() => {
      // Clear feedback before showing new headline
      document.getElementById("feedback").textContent = "";
      // Generate a new headline each time instead of reusing from array
      current = generateHeadline(Math.random() < 0.5);  // 50% chance of being fake
      document.getElementById("headline").textContent = current.title;
      document.getElementById("source").textContent = "Source: " + current.source;
      document.getElementById("url-bar").textContent = current.url;
    }, 1500); // Wait 1.5 seconds before showing new headline
  }

  // feedback modal/message
  function showCongrats() {
    const msg = document.createElement('div');
    msg.style.position = 'fixed';
    msg.style.top = '0';
    msg.style.left = '0';
    msg.style.width = '100vw';
    msg.style.height = '100vh';
    msg.style.background = 'rgba(0,0,0,0.55)';
    msg.style.display = 'flex';
    msg.style.alignItems = 'center';
    msg.style.justifyContent = 'center';
    msg.style.zIndex = '9999';
    msg.innerHTML = `<div style="background: #6a75c8ff;padding:36px 32px 28px 32px;border-radius:18px;box-shadow:0 8px 32px #353e7444;text-align:center;max-width:420px;">
    <h2 style='color:#2b6cb0;margin-bottom:12px;'>Congratulations!</h2>
    <div style='font-size:1.1rem;color:#033e61;margin-bottom:18px;'>You defended Media Literacy Planet again.<br><b>The shield level is now 3. The number for the vault is 9</b></div>
    <div style='font-size:1.05rem;color:#a3cbf5ff;margin-bottom:18px;'>
    Continue to the final defense: 
    <b><a href="{{ site.baseurl }}/digital-famine/media-lit/submodule_4/" style="color:#a3cbf5ff;text-decoration:underline;">Bias Sort</a></b>!
    </div>
    <button style='margin-top:8px;padding:8px 18px;border-radius:8px;background:#4299e1;color:white;font-weight:700;border:none;cursor:pointer;' 
    onclick='window.location.href="{{ site.baseurl }}/digital-famine/media-lit/submodule_4/"'>
    Continue
    </button>
    </div>`;
    document.body.appendChild(msg);
  }

  function checkAnswer(answer) {
    if (answer === current.correct) {
      score++;
      // Check if player has reached 15 correct answers
      if (score === 15) {
        document.getElementById("score").textContent = score;
        postScore("Player", score);
        showCongrats();
        return;
      }
      showFeedback("Signal verified: truth detected.", true);
    } else {
      showFeedback("Alert: false signal detected!", false);
    }
    document.getElementById("score").textContent = score;
    postScore("Player", score);
    newHeadline();
  }

  newHeadline();
  fetchLeaderboard();
</script>
