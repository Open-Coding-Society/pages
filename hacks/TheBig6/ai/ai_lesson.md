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
  .page-content {
    --bg:       var(--bg-1);
    --panel:    var(--panel);
    --panel-2:  var(--bg-3);
    --panel-3:  var(--surface);
    --border:   rgba(255,255,255,0.08);
    --border-b: rgba(255,255,255,0.14);
    --border-ac:rgba(76,175,239,0.4);
    --txt:      var(--text);
    --muted:    var(--text-muted);
    --ac:       var(--accent);
    --ac2:      var(--accent);
    --ok:       var(--green);
    --ok-bg:    var(--green-bg);
    --err:      var(--red);
    --err-bg:   var(--warn-bg);
    --code-bg:  var(--bg-0);
    --hover-bg: rgba(76,175,239,0.1);
  }

  * { box-sizing: border-box; margin: 0; padding: 0; }
  .container { max-width: 1000px; margin: 0 auto; padding: 28px 16px 64px; }

  .lesson-header { margin-bottom: 32px; padding-bottom: 20px; border-bottom: 1px solid var(--border); }
  .lesson-header .badge { display: inline-flex; align-items: center; gap: 6px; background: var(--panel-2); border: 1px solid var(--border-b); border-radius: 20px; padding: 3px 12px; font-size: 11px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; color: var(--ac2); margin-bottom: 10px; }
  .lesson-header .badge::before { content: ''; width: 6px; height: 6px; border-radius: 50%; background: var(--ac); box-shadow: 0 0 8px var(--ac); display: inline-block; }
  .lesson-header h1 { font-size: 30px; font-weight: 800; letter-spacing: -0.02em; margin-bottom: 6px; color: var(--txt); }
  .lesson-header p  { color: var(--muted); font-size: 14px; }
  .back-btn { display: inline-flex; align-items: center; gap: 6px; margin-top: 12px; font-size: 12px; font-weight: 600; color: var(--muted); text-decoration: none; background: var(--panel-2); border: 1px solid var(--border); border-radius: 6px; padding: 5px 12px; transition: 0.2s; }
  .back-btn:hover { color: var(--txt); border-color: var(--border-b); }

  .progress-bar { display: flex; gap: 6px; margin: 20px 0 28px; align-items: center; }
  .progress-bar .step { flex: 1; height: 4px; background: rgba(255,255,255,0.08); border-radius: 2px; cursor: pointer; transition: 0.2s; }
  .progress-bar .step.active { background: var(--ac); height: 6px; }
  .progress-bar .step:hover  { background: var(--border-ac); }

  .section        { display: none; }
  .section.active { display: block; animation: fadeIn 0.3s ease; }
  @keyframes fadeIn { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }

  .card { background: var(--panel); border: 1px solid var(--border); border-radius: 14px; padding: 24px; margin-bottom: 16px; position: relative; overflow: hidden; }
  .card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px; background: linear-gradient(90deg, var(--ac), var(--ac2)); opacity: 0.6; }
  .card h2 { font-size: 20px; font-weight: 800; color: var(--txt); margin-bottom: 12px; display: flex; align-items: center; gap: 10px; }
  .card h2 .step-num { width: 28px; height: 28px; border-radius: 8px; background: var(--ac); color: #fff; font-size: 12px; font-weight: 800; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
  .card h3 { font-size: 15px; color: var(--ac2); margin: 20px 0 8px; }
  .block-desc { background: rgba(76,175,239,0.06); border-left: 3px solid var(--ac); padding: 12px 16px; border-radius: 0 8px 8px 0; color: var(--txt); font-size: 14px; margin: 0 0 20px; line-height: 1.7; }

  .concept-grid { display: grid; grid-template-columns: repeat(auto-fit,minmax(180px,1fr)); gap: 12px; margin-bottom: 20px; }
  .concept-tile { background: var(--panel-2); border: 1px solid var(--border); border-radius: 10px; padding: 14px 16px; transition: border-color 0.2s, transform 0.2s; }
  .concept-tile:hover { border-color: var(--border-ac); transform: translateY(-2px); }
  .concept-tile .tile-icon  { font-size: 22px; margin-bottom: 6px; }
  .concept-tile .tile-title { font-size: 13px; font-weight: 700; color: var(--ac2); margin-bottom: 4px; }
  .concept-tile .tile-body  { font-size: 12px; color: var(--muted); line-height: 1.55; }

  /* Tool panel — interactive area */
  .tool-panel { background: var(--panel-2); border: 1px solid var(--border); border-radius: 12px; padding: 20px; margin-top: 16px; }
  .tool-panel h3 { font-size: 15px; font-weight: 700; color: var(--ac2); margin: 0 0 6px; }
  .tool-panel p  { font-size: 13px; color: var(--muted); margin: 0 0 14px; line-height: 1.6; }
  label { display: block; font-size: 11px; font-weight: 700; letter-spacing: 0.07em; text-transform: uppercase; color: var(--muted); margin-bottom: 5px; margin-top: 12px; }

  /* Split view for input/output */
  .split-view { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
  @media (max-width: 720px) { .split-view { grid-template-columns: 1fr; } }

  /* AI response output */
  .ai-output { background: var(--code-bg); border: 1px solid var(--border); border-radius: 10px; overflow: hidden; margin-top: 14px; }
  .ai-output-header { background: var(--panel-2); border-bottom: 1px solid var(--border); padding: 7px 14px; font-size: 11px; color: var(--muted); font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; display: flex; align-items: center; gap: 8px; }
  .ai-output-header::before { content: ''; display: inline-block; width: 8px; height: 8px; border-radius: 50%; background: #28c840; box-shadow: 0 0 6px #28c840; }
  .ai-output-body { padding: 14px; font-size: 13px; color: var(--txt); line-height: 1.7; min-height: 80px; }

  textarea, input { background: var(--code-bg); border: 1px solid var(--border); border-radius: 8px; color: var(--txt); font-size: 13px; padding: 10px 12px; width: 100%; font-family: inherit; resize: vertical; }
  textarea:focus, input:focus { outline: none; border-color: var(--ac); box-shadow: 0 0 0 2px rgba(76,175,239,0.15); }
  select { background: var(--panel-2); border: 1px solid var(--border); border-radius: 8px; color: var(--txt); padding: 8px 12px; font-size: 13px; cursor: pointer; width: 100%; }
  select:focus { outline: none; box-shadow: 0 0 0 2px rgba(76,175,239,0.3); }

  button { appearance: none; border: 1px solid var(--border); background: var(--ac); color: #fff; padding: 8px 18px; border-radius: 8px; cursor: pointer; font-size: 13px; font-weight: 600; transition: all 0.2s; }
  button:hover { background: var(--accent-700); transform: translateY(-1px); box-shadow: 0 4px 14px rgba(76,175,239,0.3); }
  button:active { transform: translateY(0); }
  button:disabled { opacity: 0.4; cursor: not-allowed; transform: none; box-shadow: none; }
  button.secondary { background: var(--panel-2); color: var(--txt); }
  button.secondary:hover { background: var(--panel-3); box-shadow: none; }
  .btn-row { display: flex; gap: 8px; flex-wrap: wrap; margin-top: 14px; align-items: center; }
  .action-button { margin-top: 10px; }

  /* Sorter game */
  .sorter-card { background: var(--panel-2); border: 1px solid var(--border); border-radius: 10px; padding: 14px 16px; margin: 8px 0; cursor: pointer; transition: all 0.2s; font-size: 13px; color: var(--txt); line-height: 1.5; }
  .sorter-card:hover { border-color: var(--border-ac); transform: translateY(-1px); }
  .sorter-card.correct { border-color: var(--ok); background: var(--ok-bg); color: var(--ok); }
  .sorter-card.wrong   { border-color: var(--err); background: var(--err-bg); color: var(--err); }

  /* Analysis result */
  .analysis-result { background: var(--panel-2); border: 1px solid var(--border); border-radius: 10px; padding: 16px; margin-top: 14px; display: none; }
  .analysis-result.show { display: block; }
  .analysis-result h4 { font-size: 14px; font-weight: 700; color: var(--ac2); margin-bottom: 10px; }

  /* Version cards */
  .version-card { background: var(--panel-3); border: 1px solid var(--border); border-radius: 8px; padding: 14px; margin: 8px 0; }
  .version-card h4 { font-size: 12px; font-weight: 700; color: var(--ac); margin-bottom: 6px; text-transform: uppercase; letter-spacing: 0.05em; }
  .version-card p  { font-size: 13px; color: var(--txt); line-height: 1.6; margin: 0; }

  .tip { font-size: 12px; color: var(--muted); padding: 8px 14px; background: var(--panel-2); border-radius: 6px; border-left: 2px solid var(--ac); line-height: 1.5; margin-top: 14px; }
  .tip::before { content: '💡 '; }

  .nav-buttons { display: flex; gap: 12px; margin-top: 28px; justify-content: space-between; align-items: center; }
  #stepIndicator { font-size: 12px; color: var(--muted); }
</style>

<div class="container page-content">
  <div class="lesson-header">
    <div class="badge">Module 5 · Thinkers Team</div>
    <h1>AI Development</h1>
    <p>Prompt engineering, resume transformation, interview coaching, and AI use case classification — all interactive.</p>
    <a href="../" class="back-btn">← Back to Big Six</a>
  </div>

  <div class="progress-bar" id="progressBar"></div>

  <!-- Step 1: Prompt Engineering -->
  <div class="section active" id="step1">
    <div class="card">
      <h2><span class="step-num">1</span> Prompt Engineering</h2>
      <div class="block-desc">Mastering the art of communication with AI is the first step. A great prompt includes four key ingredients: Context, Problem, What You've Tried, and What You Need.</div>

      <div class="concept-grid">
        <div class="concept-tile"><div class="tile-icon">🧠</div><div class="tile-title">LLMs</div><div class="tile-body">Large Language Models predict the next token based on patterns in training data.</div></div>
        <div class="concept-tile"><div class="tile-icon">✍️</div><div class="tile-title">Prompt Engineering</div><div class="tile-body">The art of writing inputs that reliably produce useful AI outputs.</div></div>
        <div class="concept-tile"><div class="tile-icon">🔗</div><div class="tile-title">API Integration</div><div class="tile-body">Call Gemini, GPT, or Claude from your backend to add AI features.</div></div>
        <div class="concept-tile"><div class="tile-icon">⚡</div><div class="tile-title">Use Cases</div><div class="tile-body">Summarization, classification, generation, code review, and more.</div></div>
      </div>

      <ul style="padding-left:20px; color:var(--txt); font-size:14px;">
        <li style="margin-bottom:6px;"><strong style="color:var(--ac2);">The Prompt Formula</strong>:
          <ol style="padding-left:18px; margin-top:6px;">
            <li style="margin-bottom:4px;"><strong style="color:var(--ac2);">Context</strong>: What are you working with? (e.g., Python, Flask, a specific library)</li>
            <li style="margin-bottom:4px;"><strong style="color:var(--ac2);">Problem</strong>: What is the specific issue? (e.g., "I'm getting a 404 error")</li>
            <li style="margin-bottom:4px;"><strong style="color:var(--ac2);">What You've Tried</strong>: Show your work. (e.g., "I've checked the routes and tested with Postman")</li>
            <li style="margin-bottom:4px;"><strong style="color:var(--ac2);">What You Need</strong>: What is your desired outcome? (e.g., "I need a checklist of likely causes")</li>
          </ol>
        </li>
        <li style="margin-bottom:6px;"><strong style="color:var(--ac2);">Iterate, Don't Quit</strong>: The first response from an AI is rarely perfect. Refine your prompt based on the AI's output. Winners iterate 3–5 times.</li>
      </ul>

      <div class="tip">Start every prompt with a role: "You are a senior Python engineer." It anchors the AI's response style and expertise level.</div>
    </div>
  </div>

  <!-- Step 2: Coding with AI -->
  <div class="section" id="step2">
    <div class="card">
      <h2><span class="step-num">2</span> Coding with AI</h2>
      <div class="block-desc">When it comes to generating code, specificity is everything. The right framework turns a vague request into a precise, actionable prompt.</div>

      <ul style="padding-left:20px; color:var(--txt); font-size:14px;">
        <li style="margin-bottom:6px;"><strong style="color:var(--ac2);">The SPEC Framework</strong>: Specific, Platform, Examples, and Constraints.</li>
        <li style="margin-bottom:6px;"><strong style="color:var(--ac2);">4-Step Debugging Template</strong>: Problem, Expected vs. Actual, Minimal Code, and What You Tried.</li>
        <li style="margin-bottom:6px;"><strong style="color:var(--ac2);">The 5 Security Non-Negotiables</strong>: SQL Injection, Hardcoded Secrets, Input Validation, XSS, and Authentication/Authorization.</li>
      </ul>

      <div class="tip">Always ask the AI to explain its code. If it can't, the code probably isn't doing what you think.</div>
    </div>
  </div>

  <!-- Step 3: Professional Applications -->
  <div class="section" id="step3">
    <div class="card">
      <h2><span class="step-num">3</span> Professional Applications</h2>
      <div class="block-desc">Leverage AI to accelerate your career, but know its limits. AI shines at structuring and drafting — your experience and authenticity make it real.</div>

      <ul style="padding-left:20px; color:var(--txt); font-size:14px;">
        <li style="margin-bottom:6px;"><strong style="color:var(--ac2);">Resume Transformation with STAR</strong>: Turn weak resume points into compelling, quantified achievements.</li>
        <li style="margin-bottom:6px;"><strong style="color:var(--ac2);">Interview Preparation</strong>: Practice answering crucial questions about failure, project architecture, and your interest in the company.</li>
        <li style="margin-bottom:6px;"><strong style="color:var(--ac2);">Know When to Use AI</strong>: Great for summarizing and brainstorming, bad for highly specialized or sensitive topics.</li>
      </ul>

      <div class="tip">Never submit AI-generated content verbatim. Edit it to reflect your voice and verify every factual claim.</div>
    </div>
  </div>

  <!-- Step 4: Resume Transformer -->
  <div class="section" id="step4">
    <div class="card">
      <h2><span class="step-num">4</span> Interactive: Resume Transformer</h2>
      <div class="block-desc">Paste a weak bullet point and generate three STAR-formatted versions — conservative, balanced, and bold — to see how framing changes impact.</div>

      <div class="tool-panel">
        <h3>Resume Bullet Transformer</h3>
        <p>Paste your weak bullet point and we'll generate 3 STAR versions!</p>
        <label>Your Current Bullet:</label>
        <textarea id="weak-bullet" placeholder="e.g., 'Worked on website development'" rows="3"></textarea>
        <button class="action-button" data-action="generate-versions">✦ Transform to STAR Format</button>
        <div id="versions-container" style="display:none; margin-top:16px;">
          <div class="version-card"><h4>Version 1 — Conservative</h4><p id="version-conservative"></p></div>
          <div class="version-card"><h4>Version 2 — Balanced</h4><p id="version-balanced"></p></div>
          <div class="version-card"><h4>Version 3 — Bold</h4><p id="version-bold"></p></div>
        </div>
      </div>

      <div class="tip">The STAR method: Situation, Task, Action, Result. Lead with action verbs and end with a measurable outcome.</div>
    </div>
  </div>

  <!-- Step 5: Interview Analyzer -->
  <div class="section" id="step5">
    <div class="card">
      <h2><span class="step-num">5</span> Interactive: Interview Analyzer</h2>
      <div class="block-desc">Practice answering common interview questions and get instant AI feedback on structure, specificity, and how well your answer addresses the question.</div>

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
        <button class="action-button" data-action="analyze-interview">🔍 Analyze My Answer</button>
        <div class="analysis-result" id="analysis-result">
          <h4>Analysis Results</h4>
          <div id="analysis-content"></div>
        </div>
      </div>

      <div class="tip">Use the STAR format for behavioral questions. Keep your answer under 2 minutes when spoken aloud — about 250–300 words.</div>
    </div>
  </div>

  <!-- Step 6: AI Use Case Sorter -->
  <div class="section" id="step6">
    <div class="card">
      <h2><span class="step-num">6</span> Interactive: AI Use Case Sorter</h2>
      <div class="block-desc">Not every task is a good fit for AI. Test your instincts by sorting real-world scenarios — click each card to reveal whether it's a smart or poor use of AI.</div>

      <div class="tool-panel">
        <h3>Use Case Sorter Game</h3>
        <p>Click each scenario card to sort it — confirm if it's a <strong style="color:var(--ok);">good</strong> or <strong style="color:var(--err);">bad</strong> use of AI.</p>
        <p>Score: <span id="game-score">0/6</span> correct</p>
        <div id="scenarios-container"></div>
        <button class="action-button" onclick="resetGame()" style="margin-top:16px;" data-action="reset-game">↺ Reset Game</button>
      </div>

      <div class="tip">AI works best when tasks are well-defined, repeatable, and don't require real-time or highly sensitive data.</div>
    </div>
  </div>

  <div class="nav-buttons">
    <button id="prevBtn" onclick="prevStep()" class="secondary">← Previous</button>
    <div style="display:flex; gap:12px; align-items:center;">
      <span id="stepIndicator">Step 1 / 6</span>
      <button id="nextBtn" onclick="nextStep()">Next →</button>
    </div>
  </div>
</div>

<script type="module">
  import { Navigator }        from '/assets/js/bigsix/shared/navigation.js';
  import { Persistence }      from '/assets/js/bigsix/shared/persistence.js';
  import { SorterGame }        from '/assets/js/bigsix/ai/sorter.js';
  import { InterviewAnalyzer } from '/assets/js/bigsix/ai/interview.js';
  import { ResumeGenerator }   from '/assets/js/bigsix/ai/resume.js';

  function markLessonComplete() {
    const key = 'bigsix:ai_lesson:lesson:5';
    if (localStorage.getItem(key) !== 'done') {
      localStorage.setItem(key, 'done');
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    const nav   = new Navigator({ onComplete: markLessonComplete });
    const store = new Persistence('ai_combined_v1', { fields: ['weak-bullet', 'interview-answer'] });
    nav.init(() => store.persist());
    store.restore((n, s) => nav.showStep(n, s));
    new SorterGame().init();
    new InterviewAnalyzer().init();
    new ResumeGenerator().init();
  });
</script>

<script>
(function(){
  document.addEventListener('DOMContentLoaded', function(){
    document.querySelectorAll('a.back-btn').forEach(function(a){
      a.addEventListener('click', function(e){
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.button === 1) return;
        e.preventDefault();
        try { if (document.referrer && new URL(document.referrer).origin === location.origin) { history.back(); return; } } catch(err) {}
        var p = location.pathname.replace(/\/$/, '').split('/');
        if (p.length > 1) { p.pop(); window.location.href = p.join('/') + '/'; } else { window.location.href = '/'; }
      });
    });
  });
})();
</script>
<script src="/assets/js/lesson-completion-bigsix.js"></script>
