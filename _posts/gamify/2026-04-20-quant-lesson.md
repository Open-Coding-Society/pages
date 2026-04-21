---
toc: true
layout: post
title: Coding Behind Quant Trading
description: Learn the backend/frontend integration and API concepts behind our quant trading bot.
type: tangibles
permalink: /gamify/fortuneFinders/quant-lesson
---

<div id="App" class="quant-lesson-container">
  <div class="app-header">
    <div class="header-content">
      <h1 class="app-title">Coding Behind Quant Trading</h1>
      <p class="subtitle">Understand how APIs, Frontend, and Backend power modern trading bots.</p>
    </div>
  </div>

  <div class="lesson-content">
    <div class="module-card">
      <h2>1. The Architecture</h2>
      <p>Our Quant Trading Bot operates on a <strong>client-server architecture</strong>:</p>
      <ul>
        <li><strong>Frontend (Client):</strong> The browser interface built with HTML, CSS, and JavaScript. It displays charts and controls.</li>
        <li><strong>Backend (Server):</strong> A Java Spring Boot application that crunches numbers, calculates indicators, and runs machine learning models.</li>
      </ul>
      <button class="btn-primary" onclick="showQuiz('arch')">Test Knowledge</button>
      <div id="quiz-arch" class="quiz-box hidden">
        <p><strong>Question:</strong> Where do machine learning models usually run in our setup?</p>
        <button onclick="checkAnswer('arch', false)">Frontend</button>
        <button onclick="checkAnswer('arch', true)">Backend</button>
        <p class="feedback" id="feedback-arch"></p>
      </div>
    </div>

    <div class="module-card">
      <h2>2. What is an API?</h2>
      <p>API stands for <strong>Application Programming Interface</strong>. It acts as a bridge between the frontend and the backend. When you type in a stock ticker and press "Load Data", the frontend sends an HTTP GET request to the backend.</p>
      <pre><code>// Example API Request (Frontend)
const response = await fetch('/bank/quant/market/history?ticker=AAPL');
const data = await response.json();
</code></pre>
      <p>The backend receives this request, fetches the stock history from its database or an external provider (like Alpha Vantage), and sends it back as JSON data.</p>
      <button class="btn-primary" onclick="showQuiz('api')">Test Knowledge</button>
      <div id="quiz-api" class="quiz-box hidden">
        <p><strong>Question:</strong> What format is commonly used to send data back from the API?</p>
        <button onclick="checkAnswer('api', true)">JSON</button>
        <button onclick="checkAnswer('api', false)">HTML</button>
        <p class="feedback" id="feedback-api"></p>
      </div>
    </div>

    <div class="module-card">
      <h2>3. Fetching and Displaying Data</h2>
      <p>Once the frontend receives the JSON data, it parses it to extract dates, open, high, low, and close prices. Then, it uses charting libraries like <strong>Plotly.js</strong> to draw candlestick charts.</p>
      <button class="btn-primary" onclick="showQuiz('chart')">Test Knowledge</button>
      <div id="quiz-chart" class="quiz-box hidden">
        <p><strong>Question:</strong> What library do we use for drawing candlestick charts?</p>
        <button onclick="checkAnswer('chart', true)">Plotly.js</button>
        <button onclick="checkAnswer('chart', false)">React.js</button>
        <p class="feedback" id="feedback-chart"></p>
      </div>
    </div>

    <div class="module-card">
      <h2>4. Machine Learning Integration</h2>
      <p>For the ML models, the frontend sends the user's parameters (like lookback and horizon) via a POST request. The backend uses Python integration or Java ML libraries to train the model and return accuracy metrics and predictions.</p>
      <pre><code>// Example POST Request
const payload = { modelType: "random_forest", lookback: 60 };
const response = await fetch('/bank/quant/ml/train', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(payload)
});
</code></pre>
    </div>
  </div>
</div>

<style>
  .quant-lesson-container {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
    color: #e2e8f0;
    background: #0a1628;
    min-height: 100vh;
    padding-bottom: 50px;
  }
  .app-header {
    background: linear-gradient(135deg, #122039 0%, #1a2f4a 100%);
    border-bottom: 2px solid #2d4a6b;
    padding: 24px 32px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.4);
  }
  .app-title {
    font-size: 32px;
    font-weight: 700;
    margin: 0;
    background: linear-gradient(135deg, #60a5fa, #3b82f6);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
  .subtitle {
    color: #94a3b8;
    margin-top: 8px;
  }
  .lesson-content {
    max-width: 800px;
    margin: 40px auto;
    padding: 0 20px;
  }
  .module-card {
    background: #152844;
    border: 1px solid #2d4a6b;
    border-radius: 12px;
    padding: 24px;
    margin-bottom: 24px;
    box-shadow: 0 4px 8px rgba(0,0,0,0.3);
  }
  .module-card h2 {
    color: #60a5fa;
    margin-top: 0;
  }
  .module-card pre {
    background: #0f172a;
    padding: 16px;
    border-radius: 8px;
    overflow-x: auto;
    border: 1px solid #334155;
  }
  .module-card code {
    color: #38bdf8;
  }
  .btn-primary {
    padding: 10px 24px;
    border-radius: 8px;
    border: none;
    background: linear-gradient(135deg, #3b82f6, #2563eb);
    color: white;
    font-weight: bold;
    cursor: pointer;
    margin-top: 10px;
  }
  .btn-primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0,0,0,0.3);
  }
  .quiz-box {
    margin-top: 15px;
    padding: 15px;
    background: #1e293b;
    border-left: 4px solid #3b82f6;
    border-radius: 4px;
  }
  .quiz-box.hidden {
    display: none;
  }
  .quiz-box button {
    padding: 8px 16px;
    margin-right: 10px;
    border-radius: 6px;
    border: 1px solid #3b82f6;
    background: transparent;
    color: #60a5fa;
    cursor: pointer;
  }
  .quiz-box button:hover {
    background: #3b82f6;
    color: white;
  }
  .feedback {
    margin-top: 10px;
    font-weight: bold;
  }
  .feedback.success { color: #10b981; }
  .feedback.error { color: #ef4444; }
</style>

<script>
  function showQuiz(id) {
    document.getElementById('quiz-' + id).classList.remove('hidden');
  }
  
  function checkAnswer(id, isCorrect) {
    const feedbackEl = document.getElementById('feedback-' + id);
    if (isCorrect) {
      feedbackEl.textContent = 'Correct! Great job.';
      feedbackEl.className = 'feedback success';
    } else {
      feedbackEl.textContent = 'Incorrect. Try again!';
      feedbackEl.className = 'feedback error';
    }
  }
</script>
