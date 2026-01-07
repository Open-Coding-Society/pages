---
layout: cs-portfolio-lesson
title: "AI Development — All-in-One Interactive Lesson"
description: "A multi-step interactive lesson on using AI for prompt engineering, coding, and professional development."
permalink: /bigsix/ai_lesson
parent: "AI Usage"
team: "Thinkers"
categories: [CSP, AI, Interactive]
tags: [ai, prompt-engineering, interactive]
author: "Thinkers Team"
date: 2025-12-02
---

<link href="https://cdn.tailwindcss.com" rel="stylesheet">

<style>
  :root {
    --bg: #0a0e27;
    --panel: #0f1729;
    --border: rgba(255, 255, 255, 0.08);
    --text: #e6eef8;
    --muted: #9aa6bf;
    --accent: #7c3aed;
  }
  * { box-sizing: border-box; }
  .container { max-width: 1000px; margin: 0 auto; padding: 24px 16px 40px; }
  .header { margin-bottom: 32px; }
  .header h1 { font-size: 28px; font-weight: 800; margin: 0 0 4px 0; }
  .header p { color: var(--muted); font-size: 14px; margin: 0; }
  .progress-bar { display: flex; gap: 8px; margin: 20px 0; justify-content: space-between; align-items: center; }
  .progress-bar .step { flex: 1; height: 4px; background: rgba(255, 255, 255, 0.1); border-radius: 2px; cursor: pointer; transition: 0.2s; }
  .progress-bar .step.active { background: var(--accent); height: 6px; }
  .section { display: none; }
  .section.active { display: block; }
  .card { background: var(--panel); border: 1px solid var(--border); border-radius: 12px; padding: 20px; margin-bottom: 16px; }
  .card h2 { margin-top: 0; font-size: 20px; color: #a6c9ff; }
  .nav-buttons { display: flex; gap: 12px; margin-top: 24px; justify-content: space-between; }
  button { appearance: none; border: 1px solid var(--border); background: var(--accent); color: #fff; padding: 8px 14px; border-radius: 8px; cursor: pointer; font-size: 14px; font-weight: 500; transition: 0.2s; }
  button:hover { background: #6d28d9; transform: translateY(-1px); }
  button.secondary { background: #334155; }
  button.secondary:hover { background: #1e293b; }

  /* Styles from ai_lesson.md */
    .comic-container { max-width: 1000px; margin: 0 auto; padding: 0; position: relative; background: transparent; }
    .comic-panel { background: #2C3E50; border: 3px solid #34495e; border-radius: 15px; padding: 30px; margin: 20px 0; box-shadow: 8px 8px 0px rgba(0, 0, 0, 0.3); position: relative; }
    .speech-bubble { background: #2C3E50; border: 3px solid #34495e; border-radius: 20px; padding: 20px; margin: 15px 0; position: relative; box-shadow: 4px 4px 0px rgba(0, 0, 0, 0.2); }
    .speech-bubble.bad { background: #9B3434; border-color: #c24444; }
    .speech-bubble.good { background: #1a7f37; border-color: #2ea44f; }
    .speech-bubble h3 { color: #fff; margin-bottom: 10px; font-size: 24px; }
    .speech-bubble p { color: #ccc; line-height: 1.6; font-size: 16px; }
    .star-method-box { background: #1e5287; border: 4px solid #4a9eff; border-radius: 15px; padding: 25px; margin: 20px 0; box-shadow: 6px 6px 0px rgba(0, 0, 0, 0.3); color: #fff; }
    .star-method-box h3 { color: #4a9eff; font-size: 28px; margin-bottom: 15px; }
    .star-method-box .star-component { background: rgba(0,0,0,0.3); border-radius: 10px; padding: 15px; margin: 10px 0; border-left: 5px solid #4a9eff; }
    .star-component strong { color: #4a9eff; font-size: 20px; display: block; margin-bottom: 5px; }
    .comparison-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 20px 0; }
    .transformer-tool { background: #1e5287; border: 4px solid #4a9eff; border-radius: 15px; padding: 25px; margin: 20px 0; box-shadow: 6px 6px 0px rgba(0, 0, 0, 0.3); color: #fff; }
    .transformer-tool h3 { color: #4a9eff; font-size: 28px; margin-bottom: 15px; }
    .transformer-tool textarea { width: 100%; min-height: 100px; padding: 15px; border: 3px solid #34495e; border-radius: 10px; font-size: 14px; margin: 10px 0; resize: vertical; background: #1a1a1a; color: #fff; }
    .version-card { background: #2C3E50; border: 3px solid #34495e; border-radius: 10px; padding: 20px; margin: 15px 0; box-shadow: 4px 4px 0px rgba(0,0,0,0.2); }
    .version-card h4 { color: #4a9eff; font-size: 20px; margin-bottom: 10px; }
    .interview-question-box { background: #1e5287; border: 4px solid #4a9eff; border-radius: 15px; padding: 25px; margin: 20px 0; box-shadow: 6px 6px 0px rgba(0, 0, 0, 0.3); color: #fff; }
    .interview-analyzer { background: #1e5287; border: 4px solid #4a9eff; border-radius: 15px; padding: 25px; margin: 20px 0; box-shadow: 6px 6px 0px rgba(0, 0, 0, 0.3); color: #fff; }
    .analysis-result { background: #2C3E50; border: 3px solid #34495e; border-radius: 10px; padding: 20px; margin: 15px 0; color: #ccc; display: none; }
    .use-case-sorter { background: #1e5287; border: 4px solid #4a9eff; border-radius: 15px; padding: 25px; margin: 20px 0; box-shadow: 6px 6px 0px rgba(0, 0, 0, 0.3); color: #fff; }
    .scenario-card { background: #2C3E50; border: 3px solid #34495e; border-radius: 10px; padding: 15px; margin: 10px 0; cursor: pointer; transition: all 0.3s ease; color: #ccc; user-select: none; }
    .scenario-card:hover { transform: translateY(-3px); box-shadow: 5px 5px 0px rgba(0,0,0,0.3); }
    .scenario-card.correct { background: #1a7f37; border-color: #2ea44f; }
    .scenario-card.incorrect { background: #9B3434; border-color: #c24444; }
    .action-button { background: linear-gradient(135deg, #2ea44f 0%, #2ea44f 100%); color: #fff; border: 3px solid #1a7f37; border-radius: 25px; padding: 12px 25px; font-size: 16px; font-weight: bold; cursor: pointer; box-shadow: 4px 4px 0px rgba(30, 132, 73, 0.5); transition: all 0.3s ease; margin: 5px; }
    .action-button:hover { transform: translate(-2px, -2px); box-shadow: 6px 6px 0px rgba(30, 132, 73, 0.5); }
</style>

<div class="container">
  <div class="header">
    <h1>AI Development — All-in-One</h1>
    <p>A multi-step interactive lesson on using AI for prompt engineering, coding, and professional development.</p>
    <a href="../" class="button back-btn">Back</a>
  </div>

  <div class="progress-bar" id="progressBar"></div>

  <!-- Step 1: Prompt Engineering -->
  <div class="section active" id="step1">
    <div class="card">
      <h2>1 — Prompt Engineering</h2>
      <p>Mastering the art of communication with AI is the first step. A great prompt includes four key ingredients: Context, Problem, What You've Tried, and What You Need.</p>
        <ul>
            <li><strong>The Prompt Formula</strong>: A great prompt includes four key ingredients:
                <ol>
                    <li><strong>Context</strong>: What are you working with? (e.g., Python, Flask, a specific library)</li>
                    <li><strong>Problem</strong>: What is the specific issue? (e.g., "I'm getting a 404 error")</li>
                    <li><strong>What You've Tried</strong>: Show your work. (e.g., "I've checked the routes and tested with Postman")</li>
                    <li><strong>What You Need</strong>: What is your desired outcome? (e.g., "I need a checklist of likely causes")</li>
                </ol>
            </li>
            <li><strong>Iterate, Don't Quit</strong>: The first response from an AI is rarely perfect. The key to success is to refine your prompt based on the AI's output. Add more specifics, clarify your needs, and guide the AI to the correct solution. Winners iterate 3-5 times.</li>
        </ul>
    </div>
  </div>

  <!-- Step 2: Coding with AI -->
  <div class="section" id="step2">
    <div class="card">
      <h2>2 — Coding with AI</h2>
      <p>When it comes to generating code, specificity is everything. Use frameworks and checklists to ensure your AI-generated code is safe and effective.</p>
        <ul>
            <li><strong>The SPEC Framework</strong>: To get useful code, your prompt must be a detailed specification: Specific, Platform, Examples, and Constraints.</li>
            <li><strong>4-Step Debugging Template</strong>: When you're stuck, give the AI the information it needs: Problem, Expected vs. Actual, Minimal Code, and What You Tried.</li>
            <li><strong>The 5 Security Non-Negotiables</strong>: Always check for SQL Injection, Hardcoded Secrets, Input Validation, XSS, and improper Authentication/Authorization.</li>
        </ul>
    </div>
  </div>

  <!-- Step 3: Professional Applications -->
  <div class="section" id="step3">
      <div class="card">
        <h2>3 — Professional Applications</h2>
        <p>Leverage AI to accelerate your career, but know its limits. Use it for resume building, interview prep, and more.</p>
        <ul>
            <li><strong>Resume Transformation with STAR</strong>: Turn weak resume points into compelling, quantified achievements (Situation, Task, Action, Result).</li>
            <li><strong>Interview Preparation</strong>: Practice answering crucial questions about failure, project architecture, and your interest in the company.</li>
            <li><strong>Know When to Use AI</strong>: It's great for summarizing and brainstorming, but bad for highly specialized or sensitive topics where accuracy is critical.</li>
        </ul>
      </div>
  </div>

  <!-- Step 4: Resume Transformer -->
  <div class="section" id="step4">
      <div class="card">
          <h2>4 — Interactive: Resume Transformer</h2>
          <div class="comic-container">
              <div class="transformer-tool">
                  <h3>Resume Bullet Transformer</h3>
                  <p style="margin-bottom: 15px;">Paste your weak bullet point and we'll generate 3 STAR versions!</p>
                  <label style="display: block; margin-top: 15px; font-weight: bold;">Your Current Bullet:</label>
                  <textarea id="weak-bullet" placeholder="e.g., 'Worked on website development'"></textarea>
                  <button class="action-button" onclick="generateVersions()">Transform to STAR Format</button>
                  <div id="versions-container" style="display: none; margin-top: 20px;">
                      <div class="version-card"><h4>Version 1: Conservative</h4><p id="version-conservative"></p></div>
                      <div class="version-card"><h4>Version 2: Balanced</h4><p id="version-balanced"></p></div>
                      <div class="version-card"><h4>Version 3: Bold</h4><p id="version-bold"></p></div>
                  </div>
              </div>
          </div>
      </div>
  </div>

  <!-- Step 5: Interview Analyzer -->
  <div class="section" id="step5">
      <div class="card">
          <h2>5 — Interactive: Interview Analyzer</h2>
          <div class="comic-container">
              <div class="interview-analyzer">
                  <h3>Mock Interview Analyzer</h3>
                  <p style="margin-bottom: 15px;">Type your answer to ONE of the 3 questions above (250 words max)</p>
                  <label style="display: block; margin-top: 15px; font-weight: bold;">Which question are you answering?</label>
                  <select id="question-choice" style="width: 100%; padding: 10px; border: 3px solid #34495e; border-radius: 10px; margin: 10px 0; background: #1a1a1a; color: #fff;">
                      <option value="1">Question 1: Tell me about a time you failed</option>
                      <option value="2">Question 2: Walk me through your architecture</option>
                      <option value="3">Question 3: Why this company?</option>
                  </select>
                  <label style="display: block; margin-top: 15px; font-weight: bold;">Your Answer:</label>
                  <textarea id="interview-answer" placeholder="Type your answer here..." style="width: 100%; min-height: 150px; padding: 15px; border: 3px solid #34495e; border-radius: 10px; margin: 10px 0; background: #1a1a1a; color: #fff;"></textarea>
                  <button class="action-button" onclick="analyzeInterview()">Analyze My Answer</button>
                  <div class="analysis-result" id="analysis-result">
                      <h4 style="color: #4ECDC4; margin-bottom: 15px;">Analysis Results</h4>
                      <div id="analysis-content"></div>
                  </div>
              </div>
          </div>
      </div>
  </div>

  <!-- Step 6: AI Use Case Sorter -->
  <div class="section" id="step6">
      <div class="card">
          <h2>6 — Interactive: AI Use Case Sorter</h2>
          <div class="comic-container">
              <div class="use-case-sorter">
                  <h3>Use Case Sorter Game</h3>
                  <p style="margin-bottom: 15px;">Click each scenario card to sort it into "Good AI Use" or "Bad AI Use"</p>
                  <p style="margin-bottom: 20px; font-style: italic;">Score: <span id="game-score">0/12</span> correct</p>
                  <div id="scenarios-container"></div>
                  <button class="action-button" onclick="resetGame()" style="margin-top: 20px;">Reset Game</button>
              </div>
          </div>
      </div>
  </div>

  <!-- Navigation -->
  <div class="nav-buttons">
    <button id="prevBtn" onclick="prevStep()" class="secondary">← Previous</button>
    <div style="display: flex; gap: 8px;">
      <span id="stepIndicator" style="color: var(--muted); font-size: 12px; align-self: center;">Step 1 / 6</span>
      <button id="nextBtn" onclick="nextStep()">Next →</button>
    </div>
  </div>
</div>

<script>
// ========== State & Navigation ==========
let currentStep = 0;
const steps = ['step1', 'step2', 'step3', 'step4', 'step5', 'step6'];
const STORAGE_KEY = 'ai_combined_v1';

function showStep(n) {
  currentStep = Math.max(0, Math.min(steps.length - 1, n));
  steps.forEach((s, i) => {
      const el = document.getElementById(s);
      if (el) el.classList.toggle('active', i === currentStep);
  });
  
  const bar = document.getElementById('progressBar');
  if (bar) bar.innerHTML = steps.map((_, i) => `<div class="step ${i <= currentStep ? 'active' : ''}" onclick="showStep(${i})"></div>`).join('');
  
  const indicator = document.getElementById('stepIndicator');
  if (indicator) indicator.textContent = `Step ${currentStep + 1} / ${steps.length}`;

  const prevBtn = document.getElementById('prevBtn');
  if (prevBtn) prevBtn.disabled = currentStep === 0;

  const nextBtn = document.getElementById('nextBtn');
  if (nextBtn) nextBtn.disabled = currentStep === steps.length - 1;

  persist();
}

function prevStep() { showStep(currentStep - 1); }
function nextStep() { showStep(currentStep + 1); }
window.prevStep = prevStep;
window.nextStep = nextStep;
window.showStep = showStep;

// ========== AI Interactives Script ==========
// This combines the logic for the three interactive tools from the original ai_lesson.md

// --- Resume Transformer ---
function generateVersions() {
    const weakBullet = document.getElementById('weak-bullet').value.trim();
    if (!weakBullet) { alert('Please enter a resume bullet point first!'); return; }
    document.getElementById('version-conservative').textContent = `Contributed to team project using web technologies, implementing core features and collaborating with 3-4 team members to meet project deadlines.`;
    document.getElementById('version-balanced').textContent = `Developed web application as part of a 4-person team, implementing 5+ key features and improving system performance by 25% through code optimization.`;
    document.getElementById('version-bold').textContent = `Led development of a web platform serving 5,000+ monthly users, architecting scalable backend infrastructure and reducing load times by 40%.`;
    document.getElementById('versions-container').style.display = 'block';
}
window.generateVersions = generateVersions;

// --- Interview Analyzer ---
function analyzeInterview() {
    const answer = document.getElementById('interview-answer').value.trim();
    if (!answer) { alert('Please write your interview answer first!'); return; }
    const wordCount = answer.split(/\s+/).length;
    const hasMetrics = /\d+/.test(answer);
    let analysisHTML = `<div><span class="score-badge good">Length: ${wordCount} words</span></div>`;
    analysisHTML += `<div><span class="score-badge ${hasMetrics ? 'good' : 'bad'}">Metrics: ${hasMetrics ? 'Present' : 'Missing'}</span></div>`;
    document.getElementById('analysis-content').innerHTML = analysisHTML;
    document.getElementById('analysis-result').style.display = 'block';
}
window.analyzeInterview = analyzeInterview;

// --- Use Case Sorter Game ---
let gameScore = 0;
const scenarios = [
    { text: "Summarize 50-page research paper", correct: "good" },
    { text: "Generate legal contract for startup", correct: "bad" },
    { text: "Write SQL query for database", correct: "good" },
    { text: "Diagnose chest pain symptoms", correct: "bad" },
    { text: "Brainstorm app feature ideas", correct: "good" },
    { text: "Calculate structural load for bridge", correct: "bad" },
];
function initializeGame() {
    const container = document.getElementById('scenarios-container');
    if (!container) return;
    container.innerHTML = '';
    gameScore = 0;
    scenarios.forEach((scenario) => {
        const card = document.createElement('div');
        card.className = 'scenario-card';
        card.textContent = scenario.text;
        card.onclick = () => handleScenarioClick(card, scenario.correct);
        container.appendChild(card);
    });
    updateScore();
}
function handleScenarioClick(card, correctAnswer) {
    if (card.classList.contains('correct') || card.classList.contains('incorrect')) return;
    const userChoice = confirm(`Is "${card.textContent}" a GOOD use of AI?\n\nClick OK for YES (good use)\nClick Cancel for NO (bad use)`);
    const choice = userChoice ? 'good' : 'bad';
    if (choice === correctAnswer) {
        card.classList.add('correct');
        gameScore++;
    } else {
        card.classList.add('incorrect');
    }
    updateScore();
}
function updateScore() {
    const scoreEl = document.getElementById('game-score');
    if(scoreEl) scoreEl.textContent = `${gameScore}/${scenarios.length}`;
}
function resetGame() { initializeGame(); }
window.resetGame = resetGame;

// ========== Persistence ==========
function persist() {
  const data = {
    step: currentStep,
    weakBullet: document.getElementById('weak-bullet')?.value,
    interviewAnswer: document.getElementById('interview-answer')?.value,
  };
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); } catch (e) {}
}

function restore() {
  try {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (!data) return;
    const weakBulletEl = document.getElementById('weak-bullet');
    if (weakBulletEl && data.weakBullet) weakBulletEl.value = data.weakBullet;
    const interviewAnswerEl = document.getElementById('interview-answer');
    if (interviewAnswerEl && data.interviewAnswer) interviewAnswerEl.value = data.interviewAnswer;
    showStep(data.step || 0);
  } catch (e) {}
}

// ========== Boot ==========
document.addEventListener('DOMContentLoaded', () => {
  restore();
  initializeGame();
});
</script>

<script>
// Back button handler: prefer history.back() when possible, fall back to parent path
(function(){
  document.addEventListener('DOMContentLoaded', function(){
    document.querySelectorAll('a.back-btn').forEach(function(a){
      a.addEventListener('click', function(e){
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.button === 1) return;
        e.preventDefault();
        try{ if (document.referrer && new URL(document.referrer).origin === location.origin){ history.back(); return; } }catch(err){}
        var p = location.pathname.replace(/\/$/,'').split('/');
        if (p.length>1){ p.pop(); window.location.href = p.join('/') + '/'; } else { window.location.href = '/'; }
      });
    });
  });
})();
</script>