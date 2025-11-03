---
layout: cs-portfolio-lesson
title: "Coding with AI"
description: "Practice writing SPEC prompts for code generation, debugging, and security best practices to get the most accurate AI-generated code."
permalink: /cs-portfolio-quest/ai/submodule_2/
parent: "AI Usage"
team: "Thinkers"
submodule: 2
categories: [CSP, Submodule, AIUsage]
tags: [ai, submodule, thinkers]
author: "Thinkers Team"
date: 2025-10-21
breadcrumb: true
microblog: true
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
        background: transparent;
    }

    .comic-header {
        text-align: center;
        margin-bottom: 40px;
        animation: fadeIn 1s ease-in;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        padding: 30px;
        border-radius: 10px;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    }

    .comic-header h1 {
        font-size: 48px;
        color: white;
        text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
        margin-bottom: 10px;
        margin-top: 0;
        letter-spacing: 2px;
        font-family: 'Comic Sans MS', cursive;
    }

    .comic-header p {
        font-size: 18px;
        color: white;
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
        background: #2C3E50;
        border: 3px solid #34495e;
        border-radius: 15px;
        padding: 30px;
        margin: 20px 0;
        box-shadow: 8px 8px 0px rgba(0, 0, 0, 0.3);
        position: relative;
    }

    .comic-panel::before {
        content: '';
        position: absolute;
        top: -15px;
        right: -15px;
        width: 30px;
        height: 30px;
        background: #4a9eff;
        border-radius: 50%;
        border: 3px solid #34495e;
    }

    .speech-bubble {
        background: #2C3E50;
        border: 3px solid #34495e;
        border-radius: 20px;
        padding: 20px;
        margin: 15px 0;
        position: relative;
        box-shadow: 4px 4px 0px rgba(0, 0, 0, 0.2);
    }

    .speech-bubble.bad {
        background: #9B3434;
        border-color: #c24444;
    }

    .speech-bubble.good {
        background: #1a7f37;
        border-color: #2ea44f;
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
        border-top: 20px solid #34495e;
    }

    .speech-bubble.bad::after {
        border-top-color: #c24444;
    }

    .speech-bubble.good::after {
        border-top-color: #2ea44f;
    }

    .speech-bubble h3 {
        color: #fff;
        margin-bottom: 10px;
        font-size: 24px;
        font-family: 'Comic Sans MS', cursive;
    }

    .speech-bubble p {
        color: #ccc;
        line-height: 1.6;
        font-size: 16px;
    }

    .spec-builder {
        background: #1e5287;
        border: 3px solid #4a9eff;
        border-radius: 15px;
        padding: 25px;
        margin: 20px 0;
        box-shadow: 6px 6px 0px rgba(0, 0, 0, 0.3);
        color: #ffffff;
    }

    .spec-builder h3 {
        color: #4a9eff;
        font-size: 28px;
        margin-bottom: 15px;
        text-shadow: 2px 2px 0px rgba(0,0,0,0.5);
        font-family: 'Comic Sans MS', cursive;
    }

    .spec-section {
        background: rgba(0,0,0,0.3);
        border: 2px solid rgba(255,255,255,0.1);
        border-radius: 10px;
        padding: 15px;
        margin: 15px 0;
    }

    .spec-section h4 {
        color: #4a9eff;
        font-size: 20px;
        margin-bottom: 10px;
        cursor: pointer;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .spec-section h4:hover {
        color: #FFF;
    }

    .spec-content {
        margin-top: 10px;
    }

    .spec-builder label {
        display: block;
        margin-top: 10px;
        margin-bottom: 5px;
        font-weight: bold;
        font-size: 16px;
    }

    .spec-builder input[type="text"],
    .spec-builder textarea,
    .spec-builder select {
        width: 100%;
        padding: 12px;
        border: 3px solid #34495e;
        border-radius: 10px;
        font-family: 'Comic Sans MS', cursive;
        font-size: 14px;
        margin-bottom: 10px;
        background: #1a1a1a;
        color: #fff;
    }

    .spec-builder textarea {
        min-height: 80px;
        resize: vertical;
    }

    .completeness-meter {
        background: #2a2a2a;
        border: 3px solid #34495e;
        border-radius: 20px;
        height: 30px;
        margin: 15px 0;
        position: relative;
        overflow: hidden;
    }

    .completeness-fill {
        background: linear-gradient(90deg, #c24444 0%, #f39c12 50%, #2ea44f 100%);
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

    .code-example {
        background: #1a1a1a;
        border: 3px solid #34495e;
        border-radius: 10px;
        padding: 15px;
        margin: 15px 0;
        font-family: monospace;
        overflow-x: auto;
    }

    .code-example.bad {
        border-color: #c24444;
        background: #9B3434;
    }

    .code-example.good {
        border-color: #2ea44f;
        background: #1a7f37;
    }

    .comparison-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 20px;
        margin: 20px 0;
    }

    .debug-template {
        background: #2C3E50;
        border: 3px solid #34495e;
        border-radius: 15px;
        padding: 20px;
        margin: 20px 0;
        box-shadow: 4px 4px 0px rgba(0,0,0,0.2);
    }

    .debug-template h4 {
        color: #4a9eff;
        font-size: 20px;
        margin-bottom: 15px;
        font-family: 'Comic Sans MS', cursive;
    }

    .debug-step {
        margin: 15px 0;
        padding: 15px;
        background: #1a1a1a;
        border-left: 5px solid #4a9eff;
        border-radius: 5px;
    }

    .debug-step strong {
        color: #fff;
        display: block;
        margin-bottom: 8px;
        font-size: 16px;
    }

    .security-checklist {
        background: #2C3E50;
        border: 4px solid #c24444;
        border-radius: 15px;
        padding: 25px;
        margin: 20px 0;
        box-shadow: 6px 6px 0px rgba(0,0,0,0.3);
    }

    .security-checklist h4 {
        color: #c24444;
        font-size: 24px;
        margin-bottom: 20px;
        font-family: 'Comic Sans MS', cursive;
    }

    .security-item {
        background: #1a1a1a;
        border: 2px solid #34495e;
        border-radius: 10px;
        padding: 15px;
        margin: 10px 0;
        cursor: pointer;
        transition: all 0.3s ease;
    }

    .security-item:hover {
        background: #2a2a2a;
        transform: translateX(5px);
    }

    .security-item.found {
        background: #1a7f37;
        border-color: #2ea44f;
    }

    .security-item.missed {
        background: #9B3434;
        border-color: #c24444;
    }

    .security-item h5 {
        color: #fff;
        font-size: 18px;
        margin-bottom: 10px;
    }

    .bug-hunter {
        background: #2C3E50;
        border: 3px solid #34495e;
        border-radius: 15px;
        padding: 20px;
        margin: 20px 0;
    }

    .code-line {
        padding: 8px 12px;
        margin: 2px 0;
        border-left: 3px solid transparent;
        cursor: pointer;
        font-family: monospace;
        transition: all 0.2s ease;
        border-radius: 3px;
    }

    .code-line:hover {
        background: #1a1a1a;
    }

    .code-line.vulnerable {
        border-left-color: #f39c12;
    }

    .code-line.clicked-correct {
        background: #1a7f37;
        border-left-color: #2ea44f;
    }

    .code-line.clicked-wrong {
        background: #9B3434;
        border-left-color: #c24444;
    }

    .score-display {
        background: linear-gradient(135deg, #34495e 0%, #4a9eff 100%);
        border: 3px solid #34495e;
        border-radius: 15px;
        padding: 15px;
        margin: 15px 0;
        text-align: center;
        font-size: 20px;
        font-weight: bold;
        color: #fff;
        box-shadow: 4px 4px 0px rgba(0,0,0,0.3);
    }

    .submit-area {
        background: #2a2a2a;
        border: 4px dashed #c24444;
        border-radius: 15px;
        padding: 25px;
        margin: 20px 0;
    }

    .submit-area h3 {
        color: #c24444;
        margin-bottom: 15px;
        font-size: 24px;
        font-family: 'Comic Sans MS', cursive;
    }

    .submit-area textarea {
        width: 100%;
        min-height: 120px;
        padding: 15px;
        border: 3px solid #34495e;
        border-radius: 10px;
        font-family: 'Comic Sans MS', cursive;
        font-size: 14px;
        margin: 10px 0;
        resize: vertical;
        background: #1a1a1a;
        color: #fff;
    }

    .action-button {
        background: linear-gradient(135deg, #2ea44f 0%, #2ea44f 100%);
        color: #fff;
        border: 3px solid #1a7f37;
        border-radius: 25px;
        padding: 12px 25px;
        font-size: 16px;
        font-weight: bold;
        cursor: pointer;
        box-shadow: 4px 4px 0px rgba(30, 132, 73, 0.5);
        transition: all 0.3s ease;
        font-family: 'Comic Sans MS', cursive;
        margin: 5px;
    }

    .action-button:hover {
        transform: translate(-2px, -2px);
        box-shadow: 6px 6px 0px rgba(30, 132, 73, 0.5);
    }

    .action-button:active {
        transform: translate(1px, 1px);
        box-shadow: 2px 2px 0px rgba(30, 132, 73, 0.5);
    }

    .status-box {
        background: #1e5631;
        border: 3px solid #2ea44f;
        border-radius: 15px;
        padding: 15px;
        margin: 15px 0;
        color: #a8e6cf;
        font-weight: bold;
        display: none;
        box-shadow: 3px 3px 0px rgba(39, 174, 96, 0.3);
    }

    .navigation {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 40px;
        padding: 20px;
        gap: 12px;
    }

    .nav-button {
        background: #374151;
        color: #fff;
        border: 1px solid #4b5563;
        border-radius: 8px;
        padding: 10px 20px;
        font-size: 16px;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s ease;
        font-family: inherit;
    }

    .nav-button:hover:not(:disabled) {
        background: #1f2937;
        transform: translateY(-1px);
    }

    .nav-button:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }

    .page-indicator {
        background: #1f2937;
        color: #fff;
        border: 1px solid #374151;
        border-radius: 8px;
        padding: 8px 16px;
        font-size: 14px;
        font-weight: 500;
    }

    .example-toggle {
        background: #34495e;
        color: #fff;
        border: 2px solid #4a9eff;
        border-radius: 15px;
        padding: 8px 15px;
        font-size: 14px;
        font-weight: bold;
        cursor: pointer;
        margin: 10px 0;
        display: inline-block;
    }

    .example-toggle:hover {
        background: #4a9eff;
    }

    .example-content {
        display: none;
        background: rgba(0,0,0,0.2);
        border-radius: 8px;
        padding: 15px;
        margin-top: 10px;
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

    .post-content .comic-container h1,
    .post-content .comic-container h2,
    .post-content .comic-container h3,
    .post-content .comic-container h4 {
        color: #fff !important;
    }

    .post-content .comic-container p,
    .post-content .comic-container li,
    .post-content .comic-container a {
        color: #ccc !important;
    }

    .post-content .comic-container .comic-panel,
    .post-content .comic-container .debug-template,
    .post-content .comic-container .bug-hunter,
    .post-content .comic-container .security-checklist {
        background-color: #2C3E50 !important;
        border-color: #34495e !important;
    }

    .post-content .comic-container code,
    .post-content .comic-container pre {
        background-color: #1a1a1a !important;
        color: #ccc !important;
    }

    .post-content #lesson-container .prose .comic-container select,
    .post-content #lesson-container .prose .comic-container input,
    .post-content #lesson-container .prose .comic-container textarea,
    .post-content #lesson-container .prose .comic-container option {
        background-color: #1a1a1a !important;
        color: #fff !important;
        border-color: #34495e !important;
        -webkit-text-fill-color: #fff !important;
    }

    .post-content #lesson-container .prose .comic-container input::placeholder,
    .post-content #lesson-container .prose .comic-container textarea::placeholder {
        color: #777 !important;
        opacity: 1 !important;
    }

    .post-content #lesson-container .prose .comic-container option {
        background-color: #1a1a1a !important;
        color: #fff !important;
    }
</style>

<div class="comic-container">
    <div class="comic-header">
        <h1 class="pow-effect">CODING WITH AI!</h1>
        <p style="color: #f3f3f3 !important; font-style: italic;">Generate better code with SPEC, debug efficiently, and stay secure</p>
    </div>

    <!-- PAGE 1: The SPEC Framework -->
    <div class="comic-page active" id="page-1">
      <img src="{{site.baseurl}}/images/docx/Quests_QuestOfCode-AIUsage-Thinkers_image4.png" height="625">
        <div class="comic-panel">
            <h2 style="color: #000; font-size: 32px; margin-bottom: 20px;">Comic Strip 1: The SPEC Framework</h2>
            <p style="color: #000; font-size: 18px; line-height: 1.8;">
                Vague prompts get you vague code. Use <strong>SPEC</strong> to generate exactly what you need:
            </p>
            <ul style="color: #000; margin: 20px 0; padding-left: 20px;">
                <li><strong>S</strong>pecific: What exactly should it do?</li>
                <li><strong>P</strong>latform: What language/version/libraries?</li>
                <li><strong>E</strong>xamples: Show input/output samples</li>
                <li><strong>C</strong>onstraints: What are the rules and limits?</li>
            </ul>
        </div>

        <div class="comparison-grid">
            <div class="speech-bubble bad">
                <h3>Bad Prompt</h3>
                <p><em>"Write a login function"</em></p>
                <p style="margin-top: 15px;"><strong>Result:</strong> Generic code that doesn't fit your needs</p>
            </div>
            <div class="speech-bubble good">
                <h3>Good SPEC Prompt</h3>
                <p><strong>S:</strong> Validate user registration with username, email, password</p>
                <p><strong>P:</strong> Python 3.11, only 're' library for regex</p>
                <p><strong>E:</strong> Input: {'username': 'ab', 'email': 'invalid'} → Output: (False, ['Username too short', 'Invalid email'])</p>
                <p><strong>C:</strong> Username 3-20 chars, valid email, password 8+ chars with uppercase+lowercase+number</p>
            </div>
        </div>

        <div class="spec-builder">
            <h3>SPEC Builder Interactive</h3>
            <p style="margin-bottom: 20px;">Build your prompt section by section and watch the completeness score!</p>
            
            <div class="completeness-meter">
                <div class="completeness-fill" id="completeness-fill">0%</div>
            </div>

            <div class="spec-section">
                <h4 onclick="toggleSection('specific')">
                    <span>S - Specific (What exactly?)</span>
                    <span>▼</span>
                </h4>
                <div class="spec-content" id="specific-content">
                    <button class="example-toggle" onclick="toggleExamples('specific-examples')">Show Examples</button>
                    <div class="example-content" id="specific-examples">
                        <p style="color: #fff;">"Validate users" (bad) vs "Validate user registration data including username, email, and password" (good)</p>
                    </div>
                    <textarea id="spec-specific" placeholder="Describe exactly what your code should do..." oninput="updateCompleteness()"></textarea>
                </div>
            </div>

            <div class="spec-section">
                <h4 onclick="toggleSection('platform')">
                    <span>P - Platform (Language/Version/Libraries)</span>
                    <span>▼</span>
                </h4>
                <div class="spec-content" id="platform-content">
                    <button class="example-toggle" onclick="toggleExamples('platform-examples')">Show Examples</button>
                    <div class="example-content" id="platform-examples">
                        <p style="color: #fff;">"Python" (bad) vs "Python 3.11, no external libraries except 're' for regex" (good)</p>
                    </div>
                    <textarea id="spec-platform" placeholder="Specify language, version, and allowed libraries..." oninput="updateCompleteness()"></textarea>
                </div>
            </div>

            <div class="spec-section">
                <h4 onclick="toggleSection('examples')">
                    <span>E - Examples (Input/Output)</span>
                    <span>▼</span>
                </h4>
                <div class="spec-content" id="examples-content">
                    <button class="example-toggle" onclick="toggleExamples('examples-examples')">Show Examples</button>
                    <div class="example-content" id="examples-examples">
                        <p style="color: #fff;">Show concrete test cases: Input: {'username': 'ab'} → Output: (False, ['Username too short (min 3)'])</p>
                    </div>
                    <textarea id="spec-examples" placeholder="Provide input/output examples..." oninput="updateCompleteness()"></textarea>
                </div>
            </div>

            <div class="spec-section">
                <h4 onclick="toggleSection('constraints')">
                    <span>C - Constraints (Rules/Limits)</span>
                    <span>▼</span>
                </h4>
                <div class="spec-content" id="constraints-content">
                    <button class="example-toggle" onclick="toggleExamples('constraints-examples')">Show Examples</button>
                    <div class="example-content" id="constraints-examples">
                        <p style="color: #fff;">Define all validation rules: Username 3-20 chars alphanumeric, Email standard format, Password 8+ with upper+lower+number</p>
                    </div>
                    <textarea id="spec-constraints" placeholder="List all constraints and validation rules..." oninput="updateCompleteness()"></textarea>
                </div>
            </div>

            <button class="action-button" onclick="generatePrompt()">Generate Complete Prompt</button>
            <div id="generated-prompt" style="display:none; background: #fff; color: #000; padding: 20px; border-radius: 10px; margin-top: 15px; border: 3px dashed #FFD700;">
                <h4 style="color: #667eea;">Your Complete SPEC Prompt:</h4>
                <pre id="prompt-output" style="white-space: pre-wrap; font-family: monospace; color: #000; background: transparent; border: none;"></pre>
                <button class="action-button" onclick="copyPrompt()">Copy to Clipboard</button>
            </div>
        </div>

        <div class="submit-area">
            <h3>Submit Your SPEC Prompt</h3>
            <p style="color: #000; margin-bottom: 15px;">Use the SPEC framework to write a prompt for code you actually need. Fill out all 4 sections.</p>
            <textarea id="submit-prompt-1" placeholder="Write your complete SPEC prompt here..."></textarea>
            <button class="action-button" onclick="saveSubmission(1)">Save Submission</button>
            <button class="action-button" onclick="loadExample(1)">Load Example</button>
            <div id="status-1" class="status-box"></div>
        </div>
    </div>

    <!-- PAGE 2: Debug Like You Mean It -->
    <div class="comic-page" id="page-2">
      <img src="{{site.baseurl}}/images/docx/Quests_QuestOfCode-AIUsage-Thinkers_image6.png" height="625">
        <div class="comic-panel">
            <h2 style="color: #000; font-size: 32px; margin-bottom: 20px;">Comic Strip 2: Debug Like You Mean It</h2>
            <p style="color: #000; font-size: 18px; margin-bottom: 20px;">
                AI can help debug, but only if you give it what it needs. Use the <strong>4-Step Template</strong>:
            </p>
        </div>

        <div class="debug-template">
            <h4>4-Step Debugging Template</h4>
            <div class="debug-step">
                <strong>1. Problem (One specific sentence)</strong>
                <p style="color: #666;">"It's broken" (bad) vs "Function returns None instead of calculated average" (good)</p>
            </div>
            <div class="debug-step">
                <strong>2. Expected vs Actual</strong>
                <p style="color: #666;">Expected: Returns float average of list<br>Actual: Returns None</p>
            </div>
            <div class="debug-step">
                <strong>3. Minimal Code (Only relevant parts)</strong>
                <p style="color: #666;">Just the function + test case, not 500 lines of unrelated code</p>
            </div>
            <div class="debug-step">
                <strong>4. What You Tried</strong>
                <p style="color: #666;">Checked if list is empty<br>Added print statements<br>Tested with simple data</p>
            </div>
        </div>

        <div class="comic-panel">
            <h3 style="color: #000; font-size: 24px; margin-bottom: 15px;">Debug Template Builder</h3>
            <p style="color: #000; margin-bottom: 15px;">Fill out the 4-step template for your debugging challenge:</p>
            
            <label style="color: #000; font-weight: bold; display: block; margin-top: 20px;">1. Problem Statement:</label>
            <input type="text" id="debug-problem" placeholder="One specific sentence about what's wrong..." style="width: 100%; padding: 10px; margin: 10px 0; border: 2px solid #667eea; border-radius: 8px;">
            
            <label style="color: #000; font-weight: bold; display: block; margin-top: 15px;">2. Expected vs Actual:</label>
            <textarea id="debug-expected" placeholder="Expected: [what should happen]&#10;Actual: [what's happening]" style="width: 100%; min-height: 80px; padding: 10px; margin: 10px 0; border: 2px solid #667eea; border-radius: 8px;"></textarea>
            
            <label style="color: #000; font-weight: bold; display: block; margin-top: 15px;">3. Minimal Code:</label>
            <textarea id="debug-code" placeholder="Paste only the relevant function/code..." style="width: 100%; min-height: 100px; padding: 10px; margin: 10px 0; border: 2px solid #667eea; border-radius: 8px; font-family: monospace;"></textarea>
            
            <label style="color: #000; font-weight: bold; display: block; margin-top: 15px;">4. What You Tried:</label>
            <textarea id="debug-tried" placeholder="List everything you've tried..." style="width: 100%; min-height: 80px; padding: 10px; margin: 10px 0; border: 2px solid #667eea; border-radius: 8px;"></textarea>
            
            <button class="action-button" onclick="analyzeDebugPrompt()">Analyze My Debug Prompt</button>
            <div id="debug-feedback" style="margin-top: 15px; padding: 15px; background: #f8f9fa; border-radius: 10px; display: none;">
                <h4 style="color: #000;">Feedback:</h4>
                <div id="debug-feedback-content" style="color: #000;"></div>
            </div>
        </div>

        <div class="submit-area">
            <h3>Submit Your Debug Prompt</h3>
            <p style="color: #000; margin-bottom: 15px;">Use the 4-step template to debug actual code you're stuck on. Fill out all 4 sections.</p>
            <textarea id="submit-prompt-2" placeholder="Write your complete debug prompt here..."></textarea>
            <button class="action-button" onclick="saveSubmission(2)">Save Submission</button>
            <button class="action-button" onclick="loadExample(2)">Load Example</button>
            <div id="status-2" class="status-box"></div>
        </div>
    </div>

    <!-- PAGE 3: Security - The 5 Non-Negotiables -->
    <div class="comic-page" id="page-3">
        <div class="comic-panel">
            <h2 style="color: #000; font-size: 32px; margin-bottom: 20px;">Comic Strip 3: Security - The 5 Non-Negotiables</h2>
            <p style="color: #000; font-size: 18px; margin-bottom: 20px;">
                AI generates code fast. But it also generates vulnerabilities. <strong>Run these 5 checks EVERY TIME:</strong>
            </p>
        </div>

        <div class="security-checklist">
            <h4>The 5 Security Checks</h4>
            
            <div class="security-item" onclick="showSecurityDetails(1)">
                <h5>1. SQL Injection - Use Parameterized Queries</h5>
                <div class="comparison-grid" style="margin-top: 10px;">
                    <div class="code-example bad">
                        <strong>Vulnerable:</strong><br>
                        <code>f"SELECT * FROM users WHERE name = '{username}'"</code>
                    </div>
                    <div class="code-example good">
                        <strong>Safe:</strong><br>
                        <code>cursor.execute("SELECT * FROM users WHERE name = ?", (username,))</code>
                    </div>
                </div>
            </div>

            <div class="security-item" onclick="showSecurityDetails(2)">
                <h5>2. Hardcoded Secrets - Use Environment Variables</h5>
                <div class="comparison-grid" style="margin-top: 10px;">
                    <div class="code-example bad">
                        <strong>Vulnerable:</strong><br>
                        <code>API_KEY = "sk_live_1234abcd"</code>
                    </div>
                    <div class="code-example good">
                        <strong>Safe:</strong><br>
                        <code>API_KEY = os.getenv("API_KEY")</code>
                    </div>
                </div>
            </div>

            <div class="security-item" onclick="showSecurityDetails(3)">
                <h5>3. Input Validation - Never Trust User Input</h5>
                <div class="comparison-grid" style="margin-top: 10px;">
                    <div class="code-example bad">
                        <strong>Vulnerable:</strong><br>
                        <code>email = request.form['email']<br># immediately use it</code>
                    </div>
                    <div class="code-example good">
                        <strong>Safe:</strong><br>
                        <code>email = request.form['email']<br>if validate_email(email):<br>&nbsp;&nbsp;# then use it</code>
                    </div>
                </div>
            </div>

            <div class="security-item" onclick="showSecurityDetails(4)">
                <h5>4. XSS Protection - Escape Output, Sanitize HTML</h5>
                <div class="comparison-grid" style="margin-top: 10px;">
                    <div class="code-example bad">
                        <strong>Vulnerable:</strong><br>
                        <code>f"&lt;div&gt;{user_comment}&lt;/div&gt;"</code>
                    </div>
                    <div class="code-example good">
                        <strong>Safe:</strong><br>
                        <code>f"&lt;div&gt;{escape(user_comment)}&lt;/div&gt;"</code>
                    </div>
                </div>
            </div>

            <div class="security-item" onclick="showSecurityDetails(5)">
                <h5>5. Auth/Authorization - Verify Who Can Access What</h5>
                <div class="comparison-grid" style="margin-top: 10px;">
                    <div class="code-example bad">
                        <strong>Vulnerable:</strong><br>
                        <code>@app.route('/admin')<br>def admin():<br>&nbsp;&nbsp;# no checks</code>
                    </div>
                    <div class="code-example good">
                        <strong>Safe:</strong><br>
                        <code>@app.route('/admin')<br>@login_required<br>@admin_required<br>def admin():</code>
                    </div>
                </div>
            </div>
        </div>

        <div class="bug-hunter">
            <h3 style="color: #000; font-size: 24px; margin-bottom: 15px;">Security Bug Hunter Game</h3>
            <p style="color: #000; margin-bottom: 15px;">Click on lines you think are vulnerable. Find all 5 security issues!</p>
            
            <div class="score-display" id="bug-score">Found: 0/5 vulnerabilities</div>
            
            <div style="background: #f5f5f5; padding: 15px; border-radius: 10px; border: 2px solid #000;">
                <div class="code-line" data-vulnerable="false" onclick="checkVulnerability(this, 1)">1: from flask import Flask, request</div>
                <div class="code-line" data-vulnerable="true" data-vuln-type="hardcoded-secret" onclick="checkVulnerability(this, 2)">2: API_KEY = "sk_live_abc123xyz"  # API key for payments</div>
                <div class="code-line" data-vulnerable="false" onclick="checkVulnerability(this, 3)">3: app = Flask(__name__)</div>
                <div class="code-line" data-vulnerable="false" onclick="checkVulnerability(this, 4)">4: </div>
                <div class="code-line" data-vulnerable="true" data-vuln-type="no-auth" onclick="checkVulnerability(this, 5)">5: @app.route('/admin/delete_user')</div>
                <div class="code-line" data-vulnerable="false" onclick="checkVulnerability(this, 6)">6: def delete_user():</div>
                <div class="code-line" data-vulnerable="true" data-vuln-type="no-validation" onclick="checkVulnerability(this, 7)">7: &nbsp;&nbsp;&nbsp;&nbsp;user_id = request.args.get('id')</div>
                <div class="code-line" data-vulnerable="true" data-vuln-type="sql-injection" onclick="checkVulnerability(this, 8)">8: &nbsp;&nbsp;&nbsp;&nbsp;db.execute(f"DELETE FROM users WHERE id = {user_id}")</div>
                <div class="code-line" data-vulnerable="false" onclick="checkVulnerability(this, 9)">9: &nbsp;&nbsp;&nbsp;&nbsp;return "User deleted"</div>
                <div class="code-line" data-vulnerable="false" onclick="checkVulnerability(this, 10)">10: </div>
                <div class="code-line" data-vulnerable="false" onclick="checkVulnerability(this, 11)">11: @app.route('/comment')</div>
                <div class="code-line" data-vulnerable="false" onclick="checkVulnerability(this, 12)">12: def post_comment():</div>
                <div class="code-line" data-vulnerable="false" onclick="checkVulnerability(this, 13)">13: &nbsp;&nbsp;&nbsp;&nbsp;comment = request.form['comment']</div>
                <div class="code-line" data-vulnerable="true" data-vuln-type="xss" onclick="checkVulnerability(this, 14)">14: &nbsp;&nbsp;&nbsp;&nbsp;return f"&lt;div&gt;{comment}&lt;/div&gt;"</div>
            </div>
            
            <button class="action-button" onclick="resetBugHunter()" style="margin-top: 15px;">Reset Game</button>
        </div>

        <div class="submit-area">
            <h3>Submit Your Security Analysis</h3>
            <p style="color: #000; margin-bottom: 15px;">Paste code (yours or AI-generated). Run through the 5-point security checklist. List any vulnerabilities you found and how to fix them.</p>
            <textarea id="submit-prompt-3" placeholder="Paste your code and security analysis here..."></textarea>
            <button class="action-button" onclick="saveSubmission(3)">Save Submission</button>
            <button class="action-button" onclick="loadExample(3)">Load Example</button>
            <div id="status-3" class="status-box"></div>
        </div>
    </div>

    <!-- Navigation -->
    <div class="navigation">
        <button class="nav-button" id="prevBtn" onclick="changePage(-1)">← Previous</button>
        <div class="page-indicator">
            Page <span id="currentPage">1</span> of <span id="totalPages">3</span>
        </div>
        <button class="nav-button" id="nextBtn" onclick="changePage(1)">Next →</button>
    </div>
</div>

<script>
    let currentPage = 1;
    const totalPages = 3;
    let bugHunterFound = 0;
    let bugHunterClicked = new Set();

    // Navigation
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

    // SPEC Builder Functions
    function toggleSection(sectionId) {
        const content = document.getElementById(sectionId + '-content');
        content.style.display = content.style.display === 'none' ? 'block' : 'none';
    }

    function toggleExamples(exampleId) {
        const examples = document.getElementById(exampleId);
        examples.style.display = examples.style.display === 'none' ? 'block' : 'none';
    }

    function updateCompleteness() {
        const specific = document.getElementById('spec-specific').value.trim();
        const platform = document.getElementById('spec-platform').value.trim();
        const examples = document.getElementById('spec-examples').value.trim();
        const constraints = document.getElementById('spec-constraints').value.trim();
        
        let score = 0;
        if (specific.length > 20) score += 25;
        if (platform.length > 10) score += 25;
        if (examples.length > 20) score += 25;
        if (constraints.length > 20) score += 25;
        
        document.getElementById('completeness-fill').style.width = score + '%';
        document.getElementById('completeness-fill').textContent = score + '%';
    }

    function generatePrompt() {
        const specific = document.getElementById('spec-specific').value.trim();
        const platform = document.getElementById('spec-platform').value.trim();
        const examples = document.getElementById('spec-examples').value.trim();
        const constraints = document.getElementById('spec-constraints').value.trim();
        
        if (!specific || !platform || !examples || !constraints) {
            alert('Please fill out all 4 sections of the SPEC framework!');
            return;
        }
        
        const prompt = `SPECIFIC: ${specific}\n\nPLATFORM: ${platform}\n\nEXAMPLES:\n${examples}\n\nCONSTRAINTS:\n${constraints}`;
        
        document.getElementById('prompt-output').textContent = prompt;
        document.getElementById('generated-prompt').style.display = 'block';
    }

    function copyPrompt() {
        const text = document.getElementById('prompt-output').textContent;
        navigator.clipboard.writeText(text).then(() => {
            alert('Prompt copied to clipboard!');
        });
    }

    // Debug Template Functions
    function analyzeDebugPrompt() {
        const problem = document.getElementById('debug-problem').value.trim();
        const expected = document.getElementById('debug-expected').value.trim();
        const code = document.getElementById('debug-code').value.trim();
        const tried = document.getElementById('debug-tried').value.trim();
        
        let feedback = [];
        let score = 0;
        
        if (problem.length > 20) {
            feedback.push('Good problem statement');
            score += 25;
        } else {
            feedback.push('Problem statement needs more detail');
        }
        
        if (expected.includes('Expected') && expected.includes('Actual')) {
            feedback.push('Clear expected vs actual comparison');
            score += 25;
        } else {
            feedback.push('Need clear "Expected" and "Actual" sections');
        }
        
        if (code.length > 30 && code.length < 500) {
            feedback.push('Good code length - focused and minimal');
            score += 25;
        } else if (code.length === 0) {
            feedback.push('Missing code sample');
        } else if (code.length > 500) {
            feedback.push('Code might be too long - try to minimize');
            score += 15;
        }
        
        if (tried.length > 30) {
            feedback.push('Showed what you tried');
            score += 25;
        } else {
            feedback.push('List what debugging steps you\'ve already taken');
        }
        
        document.getElementById('debug-feedback-content').innerHTML = 
            `<strong>Score: ${score}%</strong><br><br>` + feedback.join('<br>');
        document.getElementById('debug-feedback').style.display = 'block';
    }

    // Security Functions
    function showSecurityDetails(num) {
        // Visual feedback when clicked
        const items = document.querySelectorAll('.security-item');
        items[num-1].style.transform = 'scale(1.02)';
        setTimeout(() => {
            items[num-1].style.transform = 'scale(1)';
        }, 200);
    }

    function checkVulnerability(element, lineNum) {
        if (bugHunterClicked.has(lineNum)) return; // Already clicked
        
        bugHunterClicked.add(lineNum);
        const isVulnerable = element.dataset.vulnerable === 'true';
        
        if (isVulnerable) {
            element.classList.add('clicked-correct');
            bugHunterFound++;
            const vulnType = element.dataset.vulnType;
            let message = '';
            switch(vulnType) {
                case 'hardcoded-secret':
                    message = 'Hardcoded API key!';
                    break;
                case 'no-auth':
                    message = 'No authentication check!';
                    break;
                case 'no-validation':
                    message = 'No input validation!';
                    break;
                case 'sql-injection':
                    message = 'SQL injection vulnerability!';
                    break;
                case 'xss':
                    message = 'XSS vulnerability - unescaped output!';
                    break;
            }
            element.title = `✓ ${message}`;
        } else {
            element.classList.add('clicked-wrong');
            element.title = '✗ This line is safe';
        }
        
        document.getElementById('bug-score').textContent = `Found: ${bugHunterFound}/5 vulnerabilities`;
        
        if (bugHunterFound === 5) {
            setTimeout(() => {
                alert('Congratulations! You found all 5 security vulnerabilities!');
            }, 300);
        }
    }

    function resetBugHunter() {
        bugHunterFound = 0;
        bugHunterClicked.clear();
        document.querySelectorAll('.code-line').forEach(line => {
            line.classList.remove('clicked-correct', 'clicked-wrong');
            line.title = '';
        });
        document.getElementById('bug-score').textContent = 'Found: 0/5 vulnerabilities';
    }

    // Local Storage Functions
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
            localStorage.setItem('ai-submodule-2-page-' + pageNum, JSON.stringify(data));
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

    function loadExample(pageNum) {
        const examples = {
            1: `SPECIFIC: Create a user registration validator that checks username, email, and password fields and returns all validation errors at once.

PLATFORM: Python 3.11, only use the 're' library for regex validation. No external dependencies.

EXAMPLES:
Input: {'username': 'ab', 'email': 'notanemail', 'password': 'weak'}
Output: (False, ['Username must be 3-20 characters', 'Invalid email format', 'Password must be 8+ characters with uppercase, lowercase, and number'])

Input: {'username': 'validuser', 'email': 'user@example.com', 'password': 'SecurePass123'}
Output: (True, [])

CONSTRAINTS:
- Username: 3-20 characters, alphanumeric only (no special characters)
- Email: Must match standard email regex pattern
- Password: Minimum 8 characters, must contain at least one uppercase letter, one lowercase letter, and one number
- Return ALL errors in a list, not just the first one found
- Return tuple of (is_valid: bool, errors: list)`,
            
            2: `PROBLEM: Function returns None instead of the calculated average when given a list of numbers.

EXPECTED VS ACTUAL:
Expected: calculate_average([10, 20, 30]) should return 20.0
Actual: calculate_average([10, 20, 30]) returns None

MINIMAL CODE:
def calculate_average(numbers):
    if len(numbers) == 0:
        return 0
    total = sum(numbers)
    average = total / len(numbers)
    # Missing return statement here

# Test case
result = calculate_average([10, 20, 30])
print(result)  # Prints: None

WHAT I TRIED:
Verified the list is not empty
Added print statements - total and average variables calculate correctly
Tested with simple data [1, 2, 3] - still returns None
Checked for indentation issues
Haven't figured out why it's not returning the value`,
            
            3: `CODE ANALYSIS:

from flask import Flask, request
import sqlite3

app = Flask(__name__)

@app.route('/user/profile')
def get_profile():
    user_id = request.args.get('id')
    conn = sqlite3.connect('users.db')
    cursor = conn.cursor()
    cursor.execute(f"SELECT * FROM users WHERE id = {user_id}")
    user = cursor.fetchone()
    return f"<h1>Welcome {user[1]}</h1>"

SECURITY CHECKLIST:

1. SQL Injection: VULNERABLE - Using f-string in SQL query on line 10
   FIX: cursor.execute("SELECT * FROM users WHERE id = ?", (user_id,))

2. Hardcoded Secrets: Not applicable in this snippet

3. Input Validation: VULNERABLE - No validation of user_id parameter
   FIX: Validate user_id is a positive integer before query

4. XSS Protection: VULNERABLE - Unescaped user data in HTML on line 12
   FIX: from markupsafe import escape; return f"<h1>Welcome {escape(user[1])}</h1>"

5. Auth/Authorization: VULNERABLE - No login check, any user can view any profile
   FIX: Add @login_required decorator and verify current_user.id == user_id

VULNERABILITIES FOUND: 4 out of 5 categories have issues`
        };
        
        const textarea = document.getElementById('submit-prompt-' + pageNum);
        if (!textarea) return;
        
        textarea.value = examples[pageNum] || '';
        
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

    function loadSubmissions() {
        for (let i = 1; i <= 3; i++) {
            try {
                const saved = localStorage.getItem('ai-submodule-2-page-' + i);
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

    // Initialize on page load
    document.addEventListener('DOMContentLoaded', function() {
        showPage(1);
        loadSubmissions();
        
        // Open all SPEC sections by default
        ['specific', 'platform', 'examples', 'constraints'].forEach(section => {
            document.getElementById(section + '-content').style.display = 'block';
        });
    });

    // Save completion status
    localStorage.setItem('ai-submodule-2-completed', 'true');
</script>


