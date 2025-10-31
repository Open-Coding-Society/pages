---
layout: cs-portfolio-lesson
title: "Prompt Engineering"
description: "Master the art of specific prompts by including context, the problem, what you've tried, and desired outcomes. Practice iterative refinement to get better AI responses."
permalink: /cs-portfolio-quest/ai/submodule_1/
parent: "AI Usage"
team: "Thinkers"
submodule: 1
categories: [CSP, Submodule, AIUsage]
tags: [ai, submodule, thinkers]
author: "Thinkers Team"
date: 2025-10-21
---

<style>
    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }

    .comic-container {
        max-width: 1000px;
        margin: 40px auto;
        padding: 20px;
        position: relative;
    }

    .comic-header {
        text-align: center;
        margin-bottom: 40px;
        animation: fadeIn 1s ease-in;
    }

    .comic-header h1 {
        font-size: 48px;
        color: #FFD700;
        text-shadow: 3px 3px 0px #FF6B6B, 6px 6px 0px #4ECDC4;
        margin-bottom: 10px;
        letter-spacing: 2px;
        font-family: 'Comic Sans MS', cursive;
    }

    .comic-header p {
        font-size: 18px;
        color: #333;
        font-style: italic;
        font-family: 'Comic Sans MS', cursive;
    }

    .comic-page {
        display: none;
        animation: slideIn 0.5s ease-out;
        min-height: 600px;
    }

    .comic-page.active {
        display: block;
    }

    .comic-panel {
        background: #fff;
        border: 5px solid #000;
        border-radius: 15px;
        padding: 30px;
        margin: 20px 0;
        box-shadow: 8px 8px 0px rgba(0,0,0,0.3);
        position: relative;
    }

    .comic-panel::before {
        content: '';
        position: absolute;
        top: -15px;
        right: -15px;
        width: 30px;
        height: 30px;
        background: #FFD700;
        border-radius: 50%;
        border: 3px solid #000;
    }

    .speech-bubble {
        background: #fff;
        border: 3px solid #000;
        border-radius: 20px;
        padding: 20px;
        margin: 15px 0;
        position: relative;
        box-shadow: 4px 4px 0px rgba(0,0,0,0.2);
    }

    .speech-bubble.bad {
        background: #ffe0e0;
        border-color: #ff4444;
    }

    .speech-bubble.good {
        background: #e0f7fa;
        border-color: #00bcd4;
    }

    .speech-bubble::after {
        content: '';
        position: absolute;
        bottom: -20px;
        left: 30px;
        width: 0;
        height: 0;
        border-left: 20px solid transparent;
        border-right: 0px solid transparent;
        border-top: 20px solid #000;
    }

    .speech-bubble.bad::after {
        border-top-color: #ff4444;
    }

    .speech-bubble.good::after {
        border-top-color: #00bcd4;
    }

    .speech-bubble h3 {
        color: #000;
        margin-bottom: 10px;
        font-size: 24px;
        font-family: 'Comic Sans MS', cursive;
    }

    .speech-bubble p {
        color: #000;
        line-height: 1.6;
        font-size: 16px;
    }

    .prompt-builder {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        border: 4px solid #000;
        border-radius: 15px;
        padding: 25px;
        margin: 20px 0;
        box-shadow: 6px 6px 0px rgba(0,0,0,0.3);
        color: #fff;
    }

    .prompt-builder h3 {
        color: #FFD700;
        font-size: 28px;
        margin-bottom: 15px;
        text-shadow: 2px 2px 0px rgba(0,0,0,0.3);
        font-family: 'Comic Sans MS', cursive;
    }

    .prompt-builder label {
        display: block;
        margin-top: 15px;
        margin-bottom: 5px;
        font-weight: bold;
        font-size: 16px;
    }

    .prompt-builder select,
    .prompt-builder input[type="text"],
    .prompt-builder textarea {
        width: 100%;
        padding: 12px;
        border: 3px solid #000;
        border-radius: 10px;
        font-family: 'Comic Sans MS', cursive;
        font-size: 14px;
        margin-bottom: 10px;
    }

    .prompt-builder textarea {
        min-height: 80px;
        resize: vertical;
    }

    .checkbox-group {
        margin: 10px 0;
    }

    .checkbox-group label {
        display: inline-block;
        margin-right: 15px;
        font-weight: normal;
    }

    .checkbox-group input[type="checkbox"] {
        margin-right: 5px;
        width: auto;
    }

    .prompt-preview {
        background: #fff;
        border: 3px dashed #FFD700;
        border-radius: 10px;
        padding: 20px;
        margin: 20px 0;
        color: #000;
        min-height: 100px;
        font-family: monospace;
        white-space: pre-wrap;
    }

    .prompt-preview h4 {
        color: #FFD700;
        margin-bottom: 10px;
        font-family: 'Comic Sans MS', cursive;
    }

    .feedback-badge {
        display: inline-block;
        padding: 5px 15px;
        border-radius: 20px;
        margin: 5px;
        font-weight: bold;
        border: 2px solid #000;
    }

    .feedback-badge.good {
        background: #28a745;
        color: #fff;
    }

    .feedback-badge.bad {
        background: #dc3545;
        color: #fff;
    }

    .iteration-example {
        background: #f8f9fa;
        border-left: 6px solid #6c757d;
        padding: 20px;
        margin: 15px 0;
        border-radius: 10px;
        box-shadow: 3px 3px 0px rgba(0,0,0,0.1);
    }

    .iteration-example strong {
        color: #000;
        font-size: 18px;
        display: block;
        margin-bottom: 10px;
        font-family: 'Comic Sans MS', cursive;
    }

    .iteration-example em {
        color: #333;
        font-size: 16px;
    }

    .quality-meter {
        background: #e0e0e0;
        border: 3px solid #000;
        border-radius: 20px;
        height: 30px;
        margin: 15px 0;
        position: relative;
        overflow: hidden;
    }

    .quality-meter-fill {
        background: linear-gradient(90deg, #ff4444 0%, #ffa500 50%, #28a745 100%);
        height: 100%;
        width: 0%;
        transition: width 0.5s ease;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        padding-right: 10px;
        color: #fff;
        font-weight: bold;
    }

    .phase-card {
        background: linear-gradient(135deg, #4ECDC4 0%, #44A08D 100%);
        border: 4px solid #000;
        border-radius: 15px;
        padding: 25px;
        margin: 20px 0;
        box-shadow: 6px 6px 0px rgba(0,0,0,0.3);
        color: #fff;
    }

    .phase-card h4 {
        color: #FFD700;
        font-size: 24px;
        margin-bottom: 15px;
        text-shadow: 2px 2px 0px rgba(0,0,0,0.3);
        font-family: 'Comic Sans MS', cursive;
    }

    .navigation {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 40px;
        padding: 20px;
    }

    .nav-button {
        background: linear-gradient(135deg, #FF6B6B 0%, #FF8E53 100%);
        color: #fff;
        border: 4px solid #000;
        border-radius: 50px;
        padding: 15px 40px;
        font-size: 20px;
        font-weight: bold;
        cursor: pointer;
        box-shadow: 5px 5px 0px rgba(0,0,0,0.3);
        transition: all 0.3s ease;
        font-family: 'Comic Sans MS', cursive;
        text-transform: uppercase;
    }

    .nav-button:hover:not(:disabled) {
        transform: translate(-2px, -2px);
        box-shadow: 7px 7px 0px rgba(0,0,0,0.3);
    }

    .nav-button:active:not(:disabled) {
        transform: translate(2px, 2px);
        box-shadow: 2px 2px 0px rgba(0,0,0,0.3);
    }

    .nav-button:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }

    .page-indicator {
        background: #FFD700;
        color: #000;
        border: 3px solid #000;
        border-radius: 30px;
        padding: 10px 25px;
        font-size: 18px;
        font-weight: bold;
        box-shadow: 3px 3px 0px rgba(0,0,0,0.3);
        font-family: 'Comic Sans MS', cursive;
    }

    .submit-area {
        background: #fff3cd;
        border: 4px dashed #ffc107;
        border-radius: 15px;
        padding: 25px;
        margin: 20px 0;
    }

    .submit-area h3 {
        color: #856404;
        margin-bottom: 15px;
        font-size: 24px;
        font-family: 'Comic Sans MS', cursive;
    }

    .submit-area textarea {
        width: 100%;
        min-height: 120px;
        padding: 15px;
        border: 3px solid #000;
        border-radius: 10px;
        font-family: 'Comic Sans MS', cursive;
        font-size: 14px;
        margin: 10px 0;
        resize: vertical;
    }

    .action-button {
        background: linear-gradient(135deg, #4ECDC4 0%, #44A08D 100%);
        color: #fff;
        border: 3px solid #000;
        border-radius: 25px;
        padding: 12px 25px;
        font-size: 16px;
        font-weight: bold;
        cursor: pointer;
        box-shadow: 4px 4px 0px rgba(0,0,0,0.3);
        transition: all 0.3s ease;
        font-family: 'Comic Sans MS', cursive;
        margin: 5px;
    }

    .action-button:hover {
        transform: translate(-2px, -2px);
        box-shadow: 6px 6px 0px rgba(0,0,0,0.3);
    }

    .action-button:active {
        transform: translate(1px, 1px);
        box-shadow: 2px 2px 0px rgba(0,0,0,0.3);
    }

    .status-box {
        background: #d4edda;
        border: 3px solid #28a745;
        border-radius: 15px;
        padding: 15px;
        margin: 15px 0;
        color: #155724;
        font-weight: bold;
        display: none;
        box-shadow: 3px 3px 0px rgba(0,0,0,0.2);
    }

    .comparison-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 20px;
        margin: 20px 0;
    }

    @media (max-width: 768px) {
        .comparison-grid {
            grid-template-columns: 1fr;
        }

        .comic-header h1 {
            font-size: 32px;
        }

        .nav-button {
            padding: 12px 25px;
            font-size: 16px;
        }
    }

    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }

    @keyframes slideIn {
        from { 
            opacity: 0;
            transform: translateX(50px);
        }
        to { 
            opacity: 1;
            transform: translateX(0);
        }
    }

    .pow-effect {
        display: inline-block;
        animation: bounce 2s infinite;
    }

    @keyframes bounce {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-10px); }
    }

    /* High-specificity overrides so this lesson's styles take precedence
       over global theme rules that may use `!important`. We scope to
       `.post-content .comic-container` to avoid impacting other pages. */
    .post-content .comic-container h1,
    .post-content .comic-container h2,
    .post-content .comic-container h3,
    .post-content .comic-container h4,
    .post-content .comic-container p,
    .post-content .comic-container li,
    .post-content .comic-container a,
    .post-content .comic-container .speech-bubble h3,
    .post-content .comic-container .speech-bubble p,
    .post-content .comic-container .prompt-preview,
    .post-content .comic-container .prompt-preview h4,
    .post-content .comic-container .comic-panel,
    .post-content .comic-container .phase-card {
        color: #000 !important;
    }

    /* Ensure white panels/backgrounds remain visible against dark theme */
    .post-content .comic-container .comic-panel,
    .post-content .comic-container .prompt-preview,
    .post-content .comic-container .submit-area,
    .post-content .comic-container .iteration-example {
        background-color: #fff !important;
        border-color: #000 !important;
        color: #000 !important;
    }

    /* Keep comic header accents */
    .post-content .comic-container .comic-header h1 {
        color: #FFD700 !important;
        text-shadow: 3px 3px 0px #FF6B6B, 6px 6px 0px #4ECDC4 !important;
    }

    /* Ensure inline code and pre blocks are readable inside lesson panels */
    .post-content .comic-container code,
    .post-content .comic-container pre,
    .post-content .comic-container kbd,
    .post-content .comic-container samp {
        background-color: #f5f5f5 !important;
        color: #111 !important;
        padding: 2px 6px !important;
        border-radius: 6px !important;
        border: 1px solid rgba(0,0,0,0.08) !important;
        font-family: monospace !important;
        font-size: 0.95em !important;
    }

    .post-content .comic-container pre {
        padding: 12px !important;
        overflow: auto !important;
    }

    /* Form control overrides to prevent black-on-black from theme rules */
    .post-content #lesson-container .prose .comic-container select,
    .post-content #lesson-container .prose .comic-container input,
    .post-content #lesson-container .prose .comic-container textarea,
    .post-content #lesson-container .prose .comic-container option,
    .post-content #lesson-container .prose .comic-container .prompt-builder select,
    .post-content #lesson-container .prose .comic-container .prompt-builder input,
    .post-content #lesson-container .prose .comic-container .prompt-builder textarea {
        background-color: #ffffff !important;
        color: #000000 !important;
        border-color: #000000 !important;
        -webkit-text-fill-color: #000000 !important; /* Safari/Chrome */
    }

    /* Placeholder text color (inputs/textareas) */
    .post-content #lesson-container .prose .comic-container input::placeholder,
    .post-content #lesson-container .prose .comic-container textarea::placeholder {
        color: #6c6c6c !important;
        opacity: 1 !important;
    }

    /* Checkbox labels and inline text should be visible */
    .post-content #lesson-container .prose .comic-container .checkbox-group label,
    .post-content #lesson-container .prose .comic-container label {
        color: #000 !important;
    }

    /* Ensure select options in dropdowns are visible */
    .post-content #lesson-container .prose .comic-container option {
        background-color: #fff !important;
        color: #000 !important;
    }

</style>

<div class="comic-container">
    <div class="comic-header">
        <h1 class="pow-effect">MASTERING AI PROMPTS!</h1>
        <!-- Fixed invalid color value and force high contrast against dark theme -->
        <p style="color: #f3f3f3 !important; font-style: italic;">Learn to write prompts that actually work and iterate until you get what you need</p>
    </div>

    <!-- PAGE 1: The Prompt Formula -->
    <div class="comic-page active" id="page-1">
        <div class="comic-panel">
            <h2 style="color: #000; font-size: 32px; margin-bottom: 20px;">Comic Strip 1: The Prompt Formula</h2>
            <p style="color: #000; font-size: 18px; line-height: 1.8;">
                Bad prompts get you nowhere. Good prompts follow a formula: <strong>Context + Problem + What You Tried + What You Need</strong>
            </p>
        </div>

        <img src="{{site.baseurl}}/images/docx/Quests_QuestOfCode-AIUsage-Thinkers_image3.png" height="625">

        <div class="comparison-grid">
            <div class="speech-bubble bad">
                <h3>Bad Prompt</h3>
                <p><em>"My API doesn't work"</em></p>
                <p style="margin-top: 15px;"><strong>Why it fails:</strong> No context, no specifics, no information to help diagnose.</p>
            </div>

            <div class="speech-bubble good">
                <h3>Good Prompt</h3>
                <p><em>"I'm getting a 404 error in my Flask app when trying to POST to /api/login. The route exists and works in Postman but fails from my React frontend. Here's the fetch call: [code]. Here's my Flask route: [code]. What's the likely issue?"</em></p>
                <p style="margin-top: 15px;"><strong>Why it works:</strong> Has context, specific error, what works vs doesn't, and code provided.</p>
            </div>
        </div>

        <div class="prompt-builder">
            <h3>Prompt Builder Tool</h3>
            <p style="margin-bottom: 20px;">Build your prompt step-by-step and see it improve in real-time!</p>

            <label>1. I'm working with:</label>
            <select id="tech-stack" onchange="updatePromptPreview()">
                <option value="">Select technology...</option>
                <option value="Flask">Flask</option>
                <option value="React">React</option>
                <option value="Python">Python</option>
                <option value="Node.js">Node.js</option>
                <option value="Express">Express</option>
                <option value="Django">Django</option>
            </select>

            <label>2. I'm getting this error:</label>
            <input type="text" id="error-msg" placeholder="e.g., 404 Not Found, CORS policy error..." oninput="updatePromptPreview()">

            <label>3. I've tried:</label>
            <div class="checkbox-group">
                <label><input type="checkbox" onchange="updatePromptPreview()"> Checking documentation</label>
                <label><input type="checkbox" onchange="updatePromptPreview()"> Testing in isolation</label>
                <label><input type="checkbox" onchange="updatePromptPreview()"> Adding console.logs</label>
                <label><input type="checkbox" onchange="updatePromptPreview()"> Searching Stack Overflow</label>
            </div>

            <label>4. I need:</label>
            <textarea id="need-result" placeholder="Describe what you're trying to achieve..." oninput="updatePromptPreview()"></textarea>

            <div class="prompt-preview">
                <h4 style="color: #667eea;">Your Prompt Preview:</h4>
                <div id="preview-text" style="color: #333;">Start filling out the fields above to see your prompt build...</div>
            </div>

            <div id="feedback-badges"></div>
        </div>

        <div class="submit-area">
            <h3>Submit Your Prompt</h3>
            <p style="color: #000; margin-bottom: 15px;">Write a prompt for a real coding problem you're facing right now. Include all 4 parts!</p>
            <textarea id="submit-prompt-1" placeholder="Write your complete prompt here..."></textarea>
            <button class="action-button" onclick="saveSubmission(1)">Save Submission</button>
            <button class="action-button load-example-btn" data-example="1" title="Load example prompt for this page">Load Example</button>
            <div id="status-1" class="status-box"></div>
        </div>
    </div>

    <!-- PAGE 2: Iterate Don't Quit -->
    <div class="comic-page" id="page-2">
        <div class="comic-panel">
            <h2 style="color: #000; font-size: 32px; margin-bottom: 20px;">Comic Strip 2: Iterate, Don't Quit</h2>
            <p style="color: #000; font-size: 18px; margin-bottom: 20px;">
                <strong>Most people give up after one bad response. Winners iterate 3-5 times.</strong>
            </p>
        </div>

        <div class="iteration-example">
            <strong>Round 1 - Generic Prompt:</strong>
            <em>You: "Explain JWT authentication"</em><br>
            <span style="color: #6c757d;">AI: [Gives generic overview of JWTs and basic concepts]</span>
        </div>

        <div class="iteration-example">
            <strong>Round 2 - Add Specifics:</strong>
            <em>You: "Show me JWT auth for React + Flask that persists across page refreshes"</em><br>
            <span style="color: #0c5460;">AI: [Gives better code with localStorage examples]</span>
        </div>

        <div class="iteration-example">
            <strong>Round 3 - Refine Further:</strong>
            <em>You: "This expires in 15 min. How do I implement refresh tokens to keep users logged in?"</em><br>
            <span style="color: #155724;">AI: [Gives exactly what you need - refresh token implementation]</span>
        </div>

        <div class="comic-panel" style="margin-top: 20px;">
            <h3 style="color: #000; font-size: 24px; margin-bottom: 15px;">Iteration Practice Game</h3>
            <p style="color: #000; margin-bottom: 15px;">You got a mediocre AI response. Write follow-up prompts to improve it!</p>
            
            <div style="background: #f0f0f0; padding: 15px; border-radius: 10px; margin: 15px 0;">
                <strong>AI's Initial Response:</strong>
                <p style="color: #666; margin-top: 10px; font-style: italic;">
                    "Here's a basic database query in Python: <code>cursor.execute("SELECT * FROM users")</code>. 
                    This will get all users from your database."
                </p>
            </div>

            <label style="color: #000; font-weight: bold; display: block; margin-top: 20px;">Your Follow-up Prompt #1:</label>
            <textarea id="iteration-1" placeholder="Make it more specific to your needs..." style="width: 100%; min-height: 80px; padding: 10px; border: 2px solid #ccc; border-radius: 8px; margin: 10px 0;"></textarea>

            <label style="color: #000; font-weight: bold; display: block; margin-top: 15px;">Your Follow-up Prompt #2:</label>
            <textarea id="iteration-2" placeholder="Add even more detail based on the first follow-up..." style="width: 100%; min-height: 80px; padding: 10px; border: 2px solid #ccc; border-radius: 8px; margin: 10px 0;"></textarea>

            <button class="action-button" onclick="analyzeIteration()">Analyze My Prompts</button>

            <div class="quality-meter">
                <div class="quality-meter-fill" id="quality-fill">0%</div>
            </div>
            <div id="iteration-feedback" style="margin-top: 15px; color: #000;"></div>
        </div>

        <div class="submit-area">
            <h3>Submit Your Iteration</h3>
            <p style="color: #000; margin-bottom: 15px;">Take the AI response from your Comic 1 prompt. Write a follow-up prompt that would get you closer to what you actually need. Explain what you added.</p>
            <textarea id="submit-prompt-2" placeholder="Write your follow-up prompt and explanation..."></textarea>
            <button class="action-button" onclick="saveSubmission(2)">Save Submission</button>
            <button class="action-button load-example-btn" data-example="2" title="Load example follow-up prompt">Load Example</button>
            <div id="status-2" class="status-box"></div>
        </div>
    </div>

    <!-- PAGE 3: Real Project Breakdown -->
    <div class="comic-page" id="page-3">
        <div class="comic-panel">
            <h2 style="color: #000; font-size: 32px; margin-bottom: 20px;">Comic Strip 3: Real Project Breakdown</h2>
            <p style="color: #000; font-size: 18px; margin-bottom: 20px;">
                <strong>Case Study:</strong> Overcomplicated Flask + Spring backend, messy login system
            </p>
        </div>

        <div class="phase-card">
            <h4>Phase 1: Understand</h4>
            <p><strong>Prompt:</strong> "Explain how this login system works [paste code]"</p>
            <p><strong>Result:</strong> AI mapped the entire data flow and identified redundancies</p>
        </div>

        <div class="phase-card">
            <h4>Phase 2: Plan</h4>
            <p><strong>Prompt:</strong> "How do I consolidate into Flask-only? What Spring functionality needs to be replicated?"</p>
            <p><strong>Result:</strong> Got a clear migration plan with step-by-step approach</p>
        </div>

        <div class="phase-card">
            <h4>Phase 3: Implement</h4>
            <p><strong>Prompt:</strong> "Implement session-based auth in Flask with these requirements: [list]"</p>
            <p><strong>Result:</strong> Got working code that replaced the old system</p>
        </div>

        <div class="phase-card">
            <h4>Phase 4: Debug</h4>
            <p><strong>Prompt:</strong> "React isn't maintaining Flask session. Fetch calls work first time but lose auth after. Here's my setup: [code]"</p>
            <p><strong>Result:</strong> AI found CORS + credentials issue immediately</p>
        </div>

        <div class="comic-panel" style="margin-top: 20px;">
            <h3 style="color: #000; text-align: center; font-size: 28px;">Time Saved</h3>
            <p style="color: #000; text-align: center; font-size: 24px; margin-top: 15px;">
                <strong style="color: #dc3545;">2 weeks</strong> of reading docs → <strong style="color: #28a745;">3 days</strong> with AI
            </p>
            <p style="color: #000; text-align: center; margin-top: 15px; font-style: italic;">
                Key Lesson: Break complex problems into phases. Ask AI to explain before you start changing things.
            </p>
        </div>

        <div class="submit-area">
            <h3>Submit Your Project Plan</h3>
            <p style="color: #000; margin-bottom: 15px;">Describe a project/feature that feels overcomplicated. Break it into 3 phases. For each phase, write one AI prompt you'd use.</p>
            <textarea id="submit-prompt-3" placeholder="Phase 1: [Description] - Prompt: [Your prompt]&#10;Phase 2: [Description] - Prompt: [Your prompt]&#10;Phase 3: [Description] - Prompt: [Your prompt]" style="min-height: 200px;"></textarea>
            <button class="action-button" onclick="saveSubmission(3)">Save Submission</button>
            <button class="action-button load-example-btn" data-example="3" title="Load example project plan">Load Example</button>
            <div id="status-3" class="status-box"></div>
        </div>
    </div>

    <!-- Navigation -->
    <div class="navigation">
        <button class="nav-button" id="prevBtn" onclick="changePage(-1)">◄ PREV</button>
        <div class="page-indicator">
            <span id="currentPage">1</span> / <span id="totalPages">3</span>
        </div>
        <button class="nav-button" id="nextBtn" onclick="changePage(1)">NEXT ►</button>
    </div>
</div>

<script>
    let currentPage = 1;
    const totalPages = 3;

    function showPage(pageNum) {
        document.querySelectorAll('.comic-page').forEach(page => {
            page.classList.remove('active');
        });
        document.getElementById(`page-${pageNum}`).classList.add('active');
        document.getElementById('currentPage').textContent = pageNum;

        document.getElementById('prevBtn').disabled = pageNum === 1;
        document.getElementById('nextBtn').disabled = pageNum === totalPages;

        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function changePage(direction) {
        currentPage += direction;
        if (currentPage < 1) currentPage = 1;
        if (currentPage > totalPages) currentPage = totalPages;
        showPage(currentPage);
    }

    document.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowLeft') changePage(-1);
        if (e.key === 'ArrowRight') changePage(1);
    });

    function updatePromptPreview() {
        const tech = document.getElementById('tech-stack').value;
        const error = document.getElementById('error-msg').value;
        const need = document.getElementById('need-result').value;
        const checkboxes = document.querySelectorAll('.checkbox-group input[type="checkbox"]:checked');
        
        let tried = [];
        checkboxes.forEach(cb => {
            tried.push(cb.parentElement.textContent.trim());
        });

        let prompt = "";
        let feedback = [];

        if (tech) {
            prompt += `I'm working with ${tech}. `;
            feedback.push('<span class="feedback-badge good">Added context</span>');
        } else {
            feedback.push('<span class="feedback-badge bad">Missing: technology/context</span>');
        }

        if (error) {
            prompt += `I'm getting this error: "${error}". `;
            feedback.push('<span class="feedback-badge good">Specified problem</span>');
        } else {
            feedback.push('<span class="feedback-badge bad">Missing: specific error</span>');
        }

        if (tried.length > 0) {
            prompt += `I've tried: ${tried.join(', ')}. `;
            feedback.push('<span class="feedback-badge good">Showed what you tried</span>');
        } else {
            feedback.push('<span class="feedback-badge bad">Missing: what you tried</span>');
        }

        if (need) {
            prompt += `I need: ${need}`;
            feedback.push('<span class="feedback-badge good">Stated desired outcome</span>');
        } else {
            feedback.push('<span class="feedback-badge bad">Missing: what you need</span>');
        }

        document.getElementById('preview-text').textContent = prompt || "Start filling out the fields above to see your prompt build...";
        document.getElementById('feedback-badges').innerHTML = feedback.join('');
    }

    function analyzeIteration() {
        const iter1 = document.getElementById('iteration-1').value.trim();
        const iter2 = document.getElementById('iteration-2').value.trim();

        let score = 0;
        let feedback = [];

        if (iter1.length > 50) {
            score += 30;
            feedback.push("First prompt has good detail");
        }

        if (iter1.toLowerCase().includes('flask') || iter1.toLowerCase().includes('python') || 
            iter1.toLowerCase().includes('sqlite') || iter1.toLowerCase().includes('database')) {
            score += 20;
            feedback.push("Added specific technology");
        }

        if (iter2.length > 50) {
            score += 30;
            feedback.push("Second prompt builds on the first");
        }

        if (iter2.toLowerCase().includes('error') || iter2.toLowerCase().includes('issue') ||
            iter2.toLowerCase().includes('tried') || iter2.toLowerCase().includes('need')) {
            score += 20;
            feedback.push("Included problem/need specifics");
        }

        document.getElementById('quality-fill').style.width = score + '%';
        document.getElementById('quality-fill').textContent = score + '%';
        
        let message = '';
        if (score >= 80) {
            message = 'Excellent iteration! You\'re adding specifics and building on previous responses.';
        } else if (score >= 50) {
            message = 'Good progress! Try adding more: specific tech, error messages, or what you\'ve tried.';
        } else {
            message = 'Keep refining! Reference the previous response and add more context about your actual needs.';
        }

        document.getElementById('iteration-feedback').innerHTML = '<strong>' + message + '</strong><br>' + feedback.join('<br>');
    }

    function loadExample(pageNum) {
        const examples = {
            1: `I'm working with Flask and React. I'm getting a 404 Not Found when posting to /api/login from my React frontend, but the same route works from Postman. I've tried verifying the Flask route exists and testing the fetch call in Postman; CORS is configured, and the network tab shows a 404 response. I need a checklist of likely causes and a minimal fix to get the React app to successfully POST and receive a JSON response.`,

            2: `Follow-up Prompt: I tried inspecting the network tab and saw the request going to /api/login with method POST and Content-Type: application/json, but the server responds 404 immediately. I also confirmed the Flask route decorator is @app.route('/api/login', methods=['POST']). I suspect the React app might be hitting a different base path or missing a trailing slash. Please suggest targeted debugging steps and a minimal code patch for the React fetch and Flask route to ensure they match and handle JSON.` +
               `\n\nWhy I changed it: I added details from the network tab and a hypothesis (path mismatch) so the AI can suggest actionable debugging and a small code change.`,

                // Iteration practice examples (page 2)
                iteration1: `Please make this prompt more specific: Show a parameterized SQL query in Python (using sqlite3 or psycopg2) that selects only active users (WHERE active = 1) and limits results (e.g., LIMIT 100). Provide the exact Python code using cursor.execute with placeholders, explain why parameterization prevents SQL injection, and include expected output example.`,

                iteration2: `Refine further: Adapt the previous example into a Flask route that safely fetches users with pagination (page & per_page), uses connection pooling or scoped sessions, and returns JSON. Include error handling for empty results and a small test case that asserts the JSON structure.`,

            3: `Phase 1: Understand - Inventory current auth stack (Flask backend, Spring remnants, React frontend). Prompt: "List all pieces involved in this login flow and point out where duplication or legacy Spring code is likely causing state loss."\n\nPhase 2: Plan - Create a migration plan to consolidate to Flask-only. Prompt: "Given this inventory [paste findings], provide a step-by-step migration plan prioritizing minimal user downtime and preserving session semantics."\n\nPhase 3: Implement - Roll out Flask session-based auth with refresh tokens. Prompt: "Provide a small Flask implementation for session-based auth with refresh tokens and example React fetch calls, highlighting where to set credentials and handle token refreshes."`
        };

        const textarea = document.getElementById('submit-prompt-' + pageNum);
        if (!textarea) return;
        textarea.value = examples[pageNum] || '';
        // If loading examples for page 2, also populate the iteration practice boxes
        if (pageNum === 2) {
            const it1 = document.getElementById('iteration-1');
            const it2 = document.getElementById('iteration-2');
            if (it1 && examples.iteration1) it1.value = examples.iteration1;
            if (it2 && examples.iteration2) it2.value = examples.iteration2;
        }
        // Optionally show a tiny status message
        const statusDiv = document.getElementById('status-' + pageNum);
        if (statusDiv) {
            statusDiv.textContent = 'Loaded example. Edit as needed then Save.';
            statusDiv.style.backgroundColor = '#fff3cd';
            statusDiv.style.color = '#856404';
            statusDiv.style.borderColor = '#ffc107';
            statusDiv.style.display = 'block';
            setTimeout(() => statusDiv.style.display = 'none', 3500);
        }
    }

    function saveSubmission(pageNum) {
        const textarea = document.getElementById('submit-prompt-' + pageNum);
        const statusDiv = document.getElementById('status-' + pageNum);
        const content = textarea.value.trim();

        if (!content) {
            statusDiv.textContent = "Please write something before saving!";
            statusDiv.style.backgroundColor = "#fff3cd";
            statusDiv.style.color = "#856404";
            statusDiv.style.borderColor = "#ffc107";
            statusDiv.style.display = "block";
            setTimeout(() => statusDiv.style.display = "none", 3000);
            return;
        }

        const data = {
            page: pageNum,
            content: content,
            timestamp: new Date().toISOString()
        };

        try {
            localStorage.setItem('ai-submodule-1-page-' + pageNum, JSON.stringify(data));
            statusDiv.textContent = "Submission saved successfully!";
            statusDiv.style.backgroundColor = "#d4edda";
            statusDiv.style.color = "#155724";
            statusDiv.style.borderColor = "#28a745";
            statusDiv.style.display = "block";
            setTimeout(() => statusDiv.style.display = "none", 3000);
        } catch (error) {
            statusDiv.textContent = "Failed to save: " + error.message;
            statusDiv.style.backgroundColor = "#f8d7da";
            statusDiv.style.color = "#721c24";
            statusDiv.style.borderColor = "#dc3545";
            statusDiv.style.display = "block";
        }
    }

    function loadSubmissions() {
        for (let i = 1; i <= 3; i++) {
            try {
                const saved = localStorage.getItem('ai-submodule-1-page-' + i);
                if (saved) {
                    const data = JSON.parse(saved);
                    const textarea = document.getElementById('submit-prompt-' + i);
                    if (textarea) {
                        textarea.value = data.content;
                    }
                }
            } catch (error) {
                console.error('Error loading page ' + i, error);
            }
        }
    }

    document.addEventListener('DOMContentLoaded', function() {
        showPage(1);
        loadSubmissions();

        // Attach listeners to example buttons (use delegation-safe handlers)
        document.querySelectorAll('.load-example-btn').forEach(btn => {
            btn.addEventListener('click', function (e) {
                const pageNum = parseInt(this.dataset.example, 10);
                if (!isNaN(pageNum)) loadExample(pageNum);
            });
        });
    });

    // Save completion status
    localStorage.setItem('ai-submodule-1-completed', 'true');
</script>