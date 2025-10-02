---
layout: post
title: Sprint 2 - Introduction to Javascript for RNG Interactive
description:  Lesson for Javascript For RNG
breadcrumbs: True
permalink: /csp/big-idea-3/RandomJS/p3/LiveDemo
---

<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Learn About Random Module & RNG</title>
  <style>
    body {
      font-family: "Segoe UI", Tahoma, sans-serif;
      margin: 20px;
      background: #1e1e2f;
      color: #e4e4e4;
    }
    h1 {
      text-align: center;
      color: #ffb347;
    }
    .section {
      background: #2c2c3c;
      padding: 20px;
      margin: 20px 0;
      border-radius: 10px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.5);
    }
    h2 {
      color: #50fa7b;
    }
    button {
      padding: 10px 20px;
      margin: 5px;
      border: none;
      border-radius: 5px;
      background: #ff7f50;
      color: #fff;
      font-weight: bold;
      cursor: pointer;
      transition: all 0.2s;
    }
    button:hover {
      background: #ff5c1a;
      transform: translateY(-2px);
    }
    button:disabled {
      background: #555;
      cursor: not-allowed;
      transform: none;
    }
    .dice-container {
      display: flex;
      justify-content: center;
      gap: 20px;
      margin: 20px 0;
      flex-wrap: wrap;
    }
    .die {
      width: 80px;
      height: 80px;
      background: #fff;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 40px;
      font-weight: bold;
      color: #1e1e2f;
      box-shadow: 0 4px 8px rgba(0,0,0,0.3);
      animation: roll 0.5s ease;
    }
    @keyframes roll {
      0%, 100% { transform: rotateX(0deg) rotateY(0deg); }
      25% { transform: rotateX(180deg) rotateY(90deg); }
      50% { transform: rotateX(360deg) rotateY(180deg); }
      75% { transform: rotateX(540deg) rotateY(270deg); }
    }
    .stats {
      background: #1e1e2f;
      padding: 15px;
      border-radius: 5px;
      margin-top: 15px;
    }
    .stat-item {
      margin: 8px 0;
      color: #ffb347;
    }
    input[type="number"] {
      padding: 8px;
      margin: 5px;
      width: 60px;
      border-radius: 5px;
      border: 1px solid #555;
      background: #1e1e2f;
      color: #e4e4e4;
      text-align: center;
    }
    .result-box {
      font-size: 24px;
      font-weight: bold;
      color: #50fa7b;
      margin: 15px 0;
      padding: 15px;
      background: #1e1e2f;
      border-radius: 5px;
      text-align: center;
    }
    .history {
      max-height: 150px;
      overflow-y: auto;
      background: #1e1e2f;
      padding: 10px;
      border-radius: 5px;
      margin-top: 10px;
    }
    .history-item {
      padding: 5px;
      border-bottom: 1px solid #444;
    }
    code {
      background: #444;
      padding: 3px 6px;
      border-radius: 4px;
      color: #ffb347;
    }
    .controls {
      display: flex;
      align-items: center;
      gap: 10px;
      flex-wrap: wrap;
      margin: 10px 0;
    }
  </style>
</head>
<body>

  <h1>Interactive Dice Rolling & RNG Demo</h1>

  <div class="section">
    <h2>About Random Number Generation in Dice Games</h2>
    <p>Dice rolling is a perfect example of random number generation (RNG). In JavaScript, we use <code>Math.random()</code> to simulate rolling dice:</p>
    <ul>
      <li><code>Math.random()</code>: Generates a float between 0 (inclusive) and 1 (exclusive)</li>
      <li><code>Math.floor(Math.random() * 6) + 1</code>: Generates integers 1-6 for a standard die</li>
      <li>Multiple dice rolls demonstrate independent random events</li>
      <li>Statistics over many rolls show probability distributions</li>
    </ul>
  </div>

  <div class="section">
    <h2>🎲 Standard Dice Roller</h2>
    <div class="controls">
      <label>Number of Dice: 
        <input type="number" id="numDice" value="2" min="1" max="10">
      </label>
      <label>Sides per Die: 
        <input type="number" id="diceSides" value="6" min="2" max="20">
      </label>
      <button onclick="rollDice()">Roll Dice!</button>
    </div>
    <div class="dice-container" id="diceDisplay"></div>
    <div class="result-box" id="diceResult">Click "Roll Dice!" to start</div>
  </div>

  <div class="section">
    <h2>🎯 Dice Statistics Tracker</h2>
    <p>Roll multiple times to see probability in action!</p>
    <button onclick="rollAndTrack()">Roll & Track</button>
    <button onclick="resetStats()">Reset Stats</button>
    <div class="stats">
      <div class="stat-item">Total Rolls: <span id="totalRolls">0</span></div>
      <div class="stat-item">Total Sum: <span id="totalSum">0</span></div>
      <div class="stat-item">Average Roll: <span id="avgRoll">0</span></div>
      <div class="stat-item">Highest Roll: <span id="highRoll">-</span></div>
      <div class="stat-item">Lowest Roll: <span id="lowRoll">-</span></div>
    </div>
  </div>

  <div class="section">
    <h2>🔮 Loaded Dice Simulator</h2>
    <p>Simulate weighted/biased dice to understand how RNG can be manipulated!</p>
    <div class="controls">
      <label>Bias Towards: 
        <input type="number" id="biasNumber" value="6" min="1" max="6">
      </label>
      <label>Bias Strength (0-100%): 
        <input type="number" id="biasStrength" value="30" min="0" max="90">
      </label>
      <button onclick="rollLoadedDice()">Roll Loaded Die</button>
    </div>
    <div class="dice-container" id="loadedDiceDisplay"></div>
    <div class="result-box" id="loadedResult">Try rolling a loaded die!</div>
    <div class="history" id="loadedHistory"></div>
  </div>

  <script>
    let stats = {
      rolls: 0,
      sum: 0,
      highest: -Infinity,
      lowest: Infinity
    };
    let loadedHistory = [];

    function rollDice() {
      const numDice = parseInt(document.getElementById("numDice").value);
      const sides = parseInt(document.getElementById("diceSides").value);
      
      if (numDice < 1 || numDice > 10) {
        alert("Please enter 1-10 dice");
        return;
      }
      
      const display = document.getElementById("diceDisplay");
      display.innerHTML = "";
      
      let total = 0;
      let rolls = [];
      
      for (let i = 0; i < numDice; i++) {
        const roll = Math.floor(Math.random() * sides) + 1;
        rolls.push(roll);
        total += roll;
        
        const die = document.createElement("div");
        die.className = "die";
        die.textContent = roll;
        display.appendChild(die);
      }
      
      document.getElementById("diceResult").textContent = 
        `Rolled: [${rolls.join(", ")}] = Total: ${total}`;
    }

    function rollAndTrack() {
      const numDice = parseInt(document.getElementById("numDice").value);
      const sides = parseInt(document.getElementById("diceSides").value);
      
      let total = 0;
      for (let i = 0; i < numDice; i++) {
        const roll = Math.floor(Math.random() * sides) + 1;
        total += roll;
      }
      
      stats.rolls++;
      stats.sum += total;
      stats.highest = Math.max(stats.highest, total);
      stats.lowest = Math.min(stats.lowest, total);
      
      updateStats();
      rollDice();
    }

    function updateStats() {
      document.getElementById("totalRolls").textContent = stats.rolls;
      document.getElementById("totalSum").textContent = stats.sum;
      document.getElementById("avgRoll").textContent = 
        stats.rolls > 0 ? (stats.sum / stats.rolls).toFixed(2) : "0";
      document.getElementById("highRoll").textContent = 
        stats.highest === -Infinity ? "-" : stats.highest;
      document.getElementById("lowRoll").textContent = 
        stats.lowest === Infinity ? "-" : stats.lowest;
    }

    function resetStats() {
      stats = {
        rolls: 0,
        sum: 0,
        highest: -Infinity,
        lowest: Infinity
      };
      updateStats();
    }

    function rollLoadedDice() {
      const biasNum = parseInt(document.getElementById("biasNumber").value);
      const biasStrength = parseInt(document.getElementById("biasStrength").value) / 100;
      
      let result;
      if (Math.random() < biasStrength) {
        result = biasNum;
      } else {
        result = Math.floor(Math.random() * 6) + 1;
      }
      
      const display = document.getElementById("loadedDiceDisplay");
      display.innerHTML = "";
      
      const die = document.createElement("div");
      die.className = "die";
      die.textContent = result;
      display.appendChild(die);
      
      document.getElementById("loadedResult").textContent = 
        `Rolled: ${result}`;
      
      loadedHistory.unshift(result);
      if (loadedHistory.length > 20) loadedHistory.pop();
      
      const historyDiv = document.getElementById("loadedHistory");
      historyDiv.innerHTML = "<strong>Last 20 rolls:</strong> " + loadedHistory.join(", ");
    }
  </script>

</body>
</html>