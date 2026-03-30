---
layout: cs-bigsix-lesson
title: "AI Development — All-in-One Interactive Lesson"
description: "A multi-step interactive lesson on using AI for prompt engineering, coding, and professional development."
permalink: /bigsix/ai_lesson
parent: "bigsix"
lesson_number: 5
team: "Thinkers"
categories: [CSP, AI, Interactive]
tags: [ai, prompt-engineering, interactive]
author: "Thinkers Team"
date: 2025-12-02
---

<style>
  :root {
    --bg: #0a0e27;
    --panel: #0f1729;
    --border: rgba(255, 255, 255, 0.08);
    --text: #e6eef8;
    --muted: #9aa6bf;
    --accent: #7c3aed;
    --accent-soft: rgba(124, 58, 237, 0.15);
    --accent-border: rgba(124, 58, 237, 0.4);
    --blue: #4a9eff;
    --blue-bg: rgba(74, 158, 255, 0.08);
    --blue-border: rgba(74, 158, 255, 0.25);
    --good: rgba(46, 164, 79, 0.15);
    --good-border: rgba(46, 164, 79, 0.5);
    --bad: rgba(155, 52, 52, 0.2);
    --bad-border: rgba(194, 68, 68, 0.5);
  }

  * { box-sizing: border-box; }
  body { margin: 0; padding: 0; background: var(--bg); color: var(--text); font-family: Inter, system-ui, sans-serif; line-height: 1.5; }

  .container { max-width: 1000px; margin: 0 auto; padding: 24px 16px 40px; }
  .header { margin-bottom: 32px; }
  .header h1 { font-size: 28px; font-weight: 800; margin: 0 0 4px 0; }
  .header p { color: var(--muted); font-size: 14px; margin: 0; }

  .progress-bar { display: flex; gap: 8px; margin: 20px 0; justify-content: space-between; align-items: center;
    border: 1px solid var(--border); border-radius: 12px; padding: 12px; }
  .progress-bar .step { flex: 1; height: 4px; background: rgba(255,255,255,0.1); border-radius: 2px; cursor: pointer; transition: 0.2s; }
  .progress-bar .step.active { background: var(--accent); height: 6px; }

  #stepIndicator { color: var(--muted); font-size: 12px; align-self: center; }

  .section { display: none; }
  .section.active { display: block; }

  .card { background: var(--panel); border: 1px solid var(--border); border-radius: 12px; padding: 20px; margin-bottom: 16px; }
  .card h2 { margin-top: 0; font-size: 20px; color: #a6c9ff; }
  .card h3 { margin-top: 16px; font-size: 16px; color: #a6c9ff; }
  .card p, .card li { color: var(--text); font-size: 14px; }
  .card ul, .card ol { padding-left: 20px; }
  .card li { margin-bottom: 6px; }
  .card strong { color: #a6c9ff; }

  .nav-buttons { display: flex; gap: 12px; margin-top: 24px; justify-content: space-between; }

  button {
    appearance: none; border: 1px solid var(--border); background: var(--panel); color: var(--text);
    padding: 8px 14px; border-radius: 8px; cursor: pointer; font-size: 13px;
    font-family: Inter, system-ui, sans-serif; font-weight: 500;
    transition: background 0.15s, border-color 0.15s, transform 0.1s;
  }
  button:hover { background: #1a2340; border-color: var(--accent-border); }
  button:disabled { opacity: 0.4; cursor: not-allowed; transform: none; }
  button.primary { background: var(--accent); border-color: var(--accent-border); color: #fff; }
  button.primary:hover { background: #6d28d9; }
  button.secondary { background: #1a2340; border-color: var(--border); }

  input, textarea, select {
    background: #051226; border: 1px solid var(--border); border-radius: 10px;
    padding: 12px; color: #dce9ff; font-family: Inter, system-ui, sans-serif;
    font-size: 14px; width: 100%; margin-bottom: 8px;
  }
  input:focus, textarea:focus, select:focus { outline: none; box-shadow: 0 0 8px rgba(124,58,237,0.3); }
  select option { background: #0f1729; color: #dce9ff; }

  .back-btn {
    display: inline-block; margin-top: 8px; padding: 5px 12px;
    background: var(--panel); border: 1px solid var(--border); border-radius: 8px;
    color: var(--muted); font-size: 13px; text-decoration: none;
  }
  .back-btn:hover { border-color: var(--accent-border); color: var(--text); }

  .tool-panel { background: var(--blue-bg); border: 1px solid var(--blue-border); border-radius: 12px; padding: 20px; margin: 16px 0; }
  .tool-panel h3 { color: var(--blue); font-size: 18px; margin-top: 0; margin-bottom: 8px; }
  .tool-panel p { color: var(--muted); font-size: 13px; margin-bottom: 12px; }
  .tool-panel label { display: block; font-size: 13px; font-weight: 600; color: #a6c9ff; margin-top: 14px; margin-bottom: 4px; }

  .version-card { background: var(--panel); border: 1px solid var(--border); border-radius: 10px; padding: 16px; margin: 10px 0; }
  .version-card h4 { color: var(--blue); font-size: 14px; margin: 0 0 8px 0; }
  .version-card p { color: var(--text); font-size: 13px; margin: 0; line-height: 1.6; white-space: pre-wrap; }

  .analysis-result { background: var(--panel); border: 1px solid var(--border); border-radius: 10px; padding: 16px; margin: 14px 0; display: none; white-space: pre-wrap; }
  .analysis-result h4 { color: #4ecdc4; font-size: 14px; margin: 0 0 12px 0; }

  .scenario-card {
    background: var(--panel); border: 1px solid var(--border); border-radius: 10px;
    padding: 14px 16px; margin: 8px 0; cursor: pointer; font-size: 13px; color: var(--text);
    user-select: none; transition: background 0.15s, border-color 0.15s, transform 0.1s;
  }
  .scenario-card:hover { background: #1a2340; border-color: var(--accent-border); transform: translateY(-2px); }
  .scenario-card.correct  { background: var(--good); border-color: var(--good-border); color: #4ade80; }
  .scenario-card.incorrect { background: var(--bad);  border-color: var(--bad-border);  color: #f87171; }

  .action-button {
    background: var(--accent); border: 1px solid var(--accent-border); border-radius: 8px;
    color: #fff; padding: 10px 20px; font-size: 14px; font-weight: 600; cursor: pointer;
    font-family: Inter, system-ui, sans-serif; transition: background 0.15s, transform 0.1s; margin: 8px 4px 4px 0;
  }
  .action-button:hover { background: #6d28d9; transform: translateY(-1px); }

  #game-score { color: var(--blue); font-weight: 700; }
  .flex-row { display: flex; gap: 8px; flex-wrap: wrap; align-items: center; }

  .ai-loading { display: flex; align-items: center; gap: 10px; color: var(--muted); font-size: 13px; padding: 12px 0; }
  .ai-spinner { width: 16px; height: 16px; border-radius: 50%; border: 2px solid var(--border); border-top-color: var(--accent); animation: spin 0.7s linear infinite; flex-shrink: 0; }
  @keyframes spin { to { transform: rotate(360deg); } }

  .ai-error { background: var(--bad); border: 1px solid var(--bad-border); border-radius: 8px; padding: 10px 14px; color: #f87171; font-size: 13px; margin-top: 8px; }
</style>

<div class="container page-content">
  <div class="header">
    <h1>AI Development — All-in-One</h1>
    <p>A multi-step interactive lesson on using AI for prompt engineering, coding, and professional development.</p>
    <a href="../" class="button back-btn">← Back</a>
  </div>

  <div class="progress-bar" id="progressBar"></div>

  <!-- Step 1: Prompt Engineering -->
  <div class="section active" id="step1">
    <div class="card">
      <h2>1 — Prompt Engineering</h2>
      <p>Mastering the art of communication with AI is the first step. A great prompt includes four key ingredients: Context, Problem, What You've Tried, and What You Need.</p>
      <ul>
        <li><strong>The Prompt Formula</strong>:
          <ol>
            <li><strong>Context</strong>: What are you working with? (e.g., Python, Flask, a specific library)</li>
            <li><strong>Problem</strong>: What is the specific issue? (e.g., "I'm getting a 404 error")</li>
            <li><strong>What You've Tried</strong>: Show your work. (e.g., "I've checked the routes and tested with Postman")</li>
            <li><strong>What You Need</strong>: What is your desired outcome? (e.g., "I need a checklist of likely causes")</li>
          </ol>
        </li>
        <li><strong>Iterate, Don't Quit</strong>: The first response from an AI is rarely perfect. Refine your prompt based on the AI's output. Winners iterate 3–5 times.</li>
      </ul>
    </div>
  </div>

  <!-- Step 2: Coding with AI -->
  <div class="section" id="step2">
    <div class="card">
      <h2>2 — Coding with AI</h2>
      <p>When it comes to generating code, specificity is everything.</p>
      <ul>
        <li><strong>The SPEC Framework</strong>: Specific, Platform, Examples, and Constraints.</li>
        <li><strong>4-Step Debugging Template</strong>: Problem, Expected vs. Actual, Minimal Code, and What You Tried.</li>
        <li><strong>The 5 Security Non-Negotiables</strong>: SQL Injection, Hardcoded Secrets, Input Validation, XSS, and Authentication/Authorization.</li>
      </ul>
    </div>
  </div>

  <!-- Step 3: Professional Applications -->
  <div class="section" id="step3">
    <div class="card">
      <h2>3 — Professional Applications</h2>
      <p>Leverage AI to accelerate your career, but know its limits.</p>
      <ul>
        <li><strong>Resume Transformation with STAR</strong>: Turn weak resume points into compelling, quantified achievements.</li>
        <li><strong>Interview Preparation</strong>: Practice answering crucial questions about failure, project architecture, and your interest in the company.</li>
        <li><strong>Know When to Use AI</strong>: Great for summarizing and brainstorming, bad for highly specialized or sensitive topics.</li>
      </ul>
    </div>
  </div>

  <!-- Step 4: Resume Transformer -->
  <div class="section" id="step4">
    <div class="card">
      <h2>4 — Interactive: Resume Transformer</h2>
      <div class="tool-panel">
        <h3>Resume Bullet Transformer</h3>
        <p>Paste your weak bullet point and we'll generate 3 STAR versions!</p>
        <label>Your Current Bullet:</label>
        <textarea id="weak-bullet" placeholder="e.g., 'Worked on website development'" rows="3"></textarea>
        <button class="action-button" onclick="generateVersions()">✦ Transform to STAR Format</button>
        <div id="versions-container" style="display:none; margin-top:16px;">
          <div class="version-card"><h4>Version 1 — Conservative</h4><p id="version-conservative"></p></div>
          <div class="version-card"><h4>Version 2 — Balanced</h4><p id="version-balanced"></p></div>
          <div class="version-card"><h4>Version 3 — Bold</h4><p id="version-bold"></p></div>
        </div>
      </div>
    </div>
  </div>

  <!-- Step 5: Interview Analyzer -->
  <div class="section" id="step5">
    <div class="card">
      <h2>5 — Interactive: Interview Analyzer</h2>
      <div class="tool-panel">
        <h3>Mock Interview Analyzer</h3>
        <p>Type your answer to one of the questions below (250 words max).</p>
        <label>Which question are you answering?</label>
        <select id="question-choice">
          <option value="1">Question 1: Tell me about a time you failed</option>
          <option value="2">Question 2: Walk me through your architecture</option>
          <option value="3">Question 3: Why this company?</option>
        </select>
        <label>Your Answer:</label>
        <textarea id="interview-answer" placeholder="Type your answer here..." rows="6"></textarea>
        <button class="action-button" onclick="analyzeInterview()">🔍 Analyze My Answer</button>
        <div class="analysis-result" id="analysis-result">
          <h4>Analysis Results</h4>
          <div id="analysis-content"></div>
        </div>
      </div>
    </div>
  </div>

  <!-- Step 6: AI Use Case Sorter -->
  <div class="section" id="step6">
    <div class="card">
      <h2>6 — Interactive: AI Use Case Sorter</h2>
      <div class="tool-panel">
        <h3>Use Case Sorter Game</h3>
        <p>Click each scenario card to sort it — confirm if it's a <strong style="color:#4ade80;">good</strong> or <strong style="color:#f87171;">bad</strong> use of AI.</p>
        <p>Score: <span id="game-score">0/6</span> correct</p>
        <div id="scenarios-container"></div>
        <button class="action-button" onclick="resetGame()" style="margin-top:16px;">↺ Reset Game</button>
      </div>
    </div>
  </div>

  <!-- Navigation -->
  <div class="nav-buttons">
    <button id="prevBtn" onclick="prevStep()" class="secondary">← Previous</button>
    <div class="flex-row">
      <span id="stepIndicator">Step 1 / 6</span>
      <button id="nextBtn" onclick="nextStep()" class="primary">Next →</button>
    </div>
  </div>
</div>

<!-- Boot: import all modules, restore state, and init each feature -->
<script type="module">
  import { showStep }        from '{{ site.baseurl }}/assets/js/bigsix/ai/navigation.js';
  import { restoreState }    from '{{ site.baseurl }}/assets/js/bigsix/ai/persistence.js';
  import { initSorter }      from '{{ site.baseurl }}/assets/js/bigsix/ai/sorter.js';

  // resume.js and interview.js self-register window.generateVersions / window.analyzeInterview on import
  import '{{ site.baseurl }}/assets/js/bigsix/ai/resume.js';
  import '{{ site.baseurl }}/assets/js/bigsix/ai/interview.js';

  document.addEventListener('DOMContentLoaded', () => {
    const saved = restoreState();

    // Restore persisted textarea values
    const weakBulletEl      = document.getElementById('weak-bullet');
    const interviewAnswerEl = document.getElementById('interview-answer');
    if (weakBulletEl      && saved.weakBullet)      weakBulletEl.value      = saved.weakBullet;
    if (interviewAnswerEl && saved.interviewAnswer) interviewAnswerEl.value = saved.interviewAnswer;

    // Init features
    initSorter();

    // Restore step last so DOM is fully ready
    showStep(saved.step || 0);
  });
</script>

<script>
// Back button handler
(function(){
  document.addEventListener('DOMContentLoaded', function(){
    document.querySelectorAll('a.back-btn').forEach(function(a){
      a.addEventListener('click', function(e){
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.button === 1) return;
        e.preventDefault();
        try {
          if (document.referrer && new URL(document.referrer).origin === location.origin) {
            history.back(); return;
          }
        } catch(err) {}
        var p = location.pathname.replace(/\/$/, '').split('/');
        if (p.length > 1) { p.pop(); window.location.href = p.join('/') + '/'; }
        else { window.location.href = '/'; }
      });
    });
  });
})();
</script>

<script src="/assets/js/lesson-completion-bigsix.js"></script>