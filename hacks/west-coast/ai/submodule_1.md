---
layout: post
title: "Submodule 1"
description: "Key 1 of AI Usage Mini-Quest about AI functionality"
permalink: /west-coast/ai/submodule_1/
parent: "AI Usage"
team: "TheSprinters"
microblog: True
submodule: 1
categories: [CSP, Submodule, AIUsage]
tags: [AI, submodule, AI_Functionality]
author: "TheSprinters"
date: 2025-10-21
footer:
  home: /west-coast/ai/
  next: /west-coast/ai/submodule_2/
---
<style>
    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }

    body {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: #eee;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        line-height: 1.7;
        padding: 40px 20px;
        min-height: 100vh;
    }

    .container {
        max-width: 900px;
        margin: 0 auto;
        padding-bottom: 60px;
    }

    h1 {
        color: #7dd3fc;
        font-size: 2.5em;
        margin-bottom: 40px;
        text-align: center;
        font-weight: 600;
        letter-spacing: -0.5px;
        animation: fadeInDown 0.6s ease-out;
    }

    @keyframes fadeInDown {
        from {
            opacity: 0;
            transform: translateY(-20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    h2 {
        color: #4ecca3;
        font-size: 1.8em;
        margin-top: 50px;
        margin-bottom: 20px;
        font-weight: 500;
        border-bottom: 2px solid #667eea;
        padding-bottom: 10px;
        cursor: pointer;
        transition: color 0.3s;
        position: relative;
        padding-left: 30px;
    }

    h2:hover {
        color: #93c5fd;
    }

    h2::before {
        content: '▼';
        position: absolute;
        left: 0;
        transition: transform 0.3s;
    }

    h2.collapsed::before {
        transform: rotate(-90deg);
    }

    h3 {
        color: #93c5fd;
        font-size: 1.3em;
        margin-top: 30px;
        margin-bottom: 15px;
        font-weight: 500;
    }

    p {
        margin-bottom: 20px;
        font-size: 1.05em;
        color: #d1d5db;
    }

    .section {
        background: rgba(30, 41, 59, 0.6);
        border-left: 4px solid #667eea;
        padding: 25px;
        margin: 20px 0;
        border-radius: 12px;
        backdrop-filter: blur(10px);
        transition: all 0.3s;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }

    .section.collapsed {
        display: none;
    }

    .workflow-step {
        background: rgba(30, 41, 59, 0.4);
        padding: 20px;
        margin: 15px 0;
        border-radius: 12px;
        border-left: 3px solid #4ecca3;
        transition: transform 0.2s, box-shadow 0.2s;
        cursor: pointer;
    }

    .workflow-step:hover {
        transform: translateX(5px);
        box-shadow: 0 4px 12px rgba(78, 204, 163, 0.3);
    }

    .workflow-step strong {
        color: #93c5fd;
        font-size: 1.1em;
    }

    .activity-box {
        background: rgba(30, 41, 59, 0.5);
        padding: 30px;
        margin: 30px 0;
        border-radius: 12px;
        border: 2px solid #667eea;
        transition: all 0.3s;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }

    .activity-box.completed {
        border-color: #10b981;
        box-shadow: 0 4px 12px rgba(16, 185, 129, 0.2);
    }

    .activity-box h3 {
        color: #7dd3fc;
        margin-top: 0;
        margin-bottom: 15px;
        display: flex;
        align-items: center;
        gap: 10px;
    }

    .checkmark {
        display: inline-block;
        width: 20px;
        height: 20px;
        border: 2px solid #667eea;
        border-radius: 4px;
        transition: all 0.3s;
    }

    .checkmark.checked {
        background: #10b981;
        border-color: #10b981;
        position: relative;
    }

    .checkmark.checked::after {
        content: '✓';
        position: absolute;
        color: white;
        font-size: 14px;
        top: -2px;
        left: 3px;
    }

    textarea {
        width: 100%;
        padding: 15px;
        margin-top: 10px;
        background: rgba(15, 23, 42, 0.8);
        color: #eee;
        border: 2px solid #0f3460;
        border-radius: 12px;
        font-family: inherit;
        font-size: 1em;
        resize: vertical;
        transition: border-color 0.3s;
    }

    textarea:focus {
        outline: none;
        border-color: #667eea;
        box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    }

    .label {
        color: #cbd5e1;
        font-size: 0.95em;
        margin-bottom: 5px;
        display: block;
    }

    .progress-bar {
        background: rgba(30, 41, 59, 0.6);
        height: 30px;
        border-radius: 15px;
        overflow: hidden;
        margin: 30px 0;
        box-shadow: inset 0 2px 4px rgba(0,0,0,0.3);
        border: none;
    }

    .progress-fill {
        height: 100%;
        background: linear-gradient(90deg, #4ecca3, #38f9d7);
        transition: width 0.5s ease;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #1a1a2e;
        font-weight: 600;
        font-size: 0.95em;
    }

    .word-count {
        text-align: right;
        color: #94a3b8;
        font-size: 0.9em;
        margin-top: 8px;
    }

    .save-indicator {
        color: #10b981;
        font-size: 0.9em;
        text-align: right;
        margin-top: 5px;
        opacity: 0;
        transition: opacity 0.3s;
    }

    .save-indicator.show {
        opacity: 1;
    }

    .quiz-question {
        background: rgba(30, 41, 59, 0.5);
        padding: 25px;
        margin: 25px 0;
        border-radius: 12px;
        border: 2px solid #667eea;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }

    .quiz-option {
        background: rgba(15, 23, 42, 0.6);
        padding: 15px 20px;
        margin: 10px 0;
        border-radius: 12px;
        border: 2px solid #475569;
        cursor: pointer;
        transition: all 0.3s;
    }

    .quiz-option:hover {
        border-color: #667eea;
        transform: translateX(5px);
    }

    .quiz-option.selected {
        border-color: #667eea;
        background: rgba(102, 126, 234, 0.2);
    }

    .quiz-option.correct {
        border-color: #10b981;
        background: rgba(16, 185, 129, 0.2);
    }

    .quiz-option.incorrect {
        border-color: #ef4444;
        background: rgba(239, 68, 68, 0.2);
    }

    .submit-btn {
        background: linear-gradient(135deg, #4ecca3, #38f9d7);
        color: #1a1a2e;
        padding: 12px 30px;
        border: none;
        border-radius: 12px;
        cursor: pointer;
        font-size: 1em;
        font-weight: 600;
        margin-top: 15px;
        transition: all 0.3s;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    }

    .submit-btn:hover:not(:disabled) {
        transform: translateY(-2px);
        box-shadow: 0 5px 15px rgba(78, 204, 163, 0.4);
    }

    .submit-btn:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }

    .feedback {
        margin-top: 15px;
        padding: 15px;
        border-radius: 12px;
        font-weight: 500;
        border: none;
    }

    .feedback.success {
        background: rgba(16, 185, 129, 0.2);
        border-left: 4px solid #10b981;
        color: #10b981;
    }

    .feedback.error {
        background: rgba(239, 68, 68, 0.2);
        border-left: 4px solid #ef4444;
        color: #ef4444;
    }

    .completion-banner {
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 15px 25px;
        border-radius: 10px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.3);
        z-index: 1000;
        animation: slideIn 0.5s ease-out;
        border: none;
    }

    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
</style>

<div class="container">
    <h1>🤖 Understanding Artificial Intelligence</h1>
    
    <div class="progress-bar">
        <div class="progress-fill" id="progressFill">0% Complete</div>
    </div>

    <h2 id="section1Header">What is AI?</h2>
    <div class="section" id="section1">
        <p>Artificial Intelligence (AI) refers to computer systems designed to perform tasks that typically require human intelligence. These tasks include learning, problem-solving, understanding language, recognizing patterns, and making decisions.</p>
        
        <h3>Key Concepts:</h3>
        <div class="workflow-step">
            <strong>Machine Learning:</strong> A subset of AI where systems learn from data and improve their performance over time without being explicitly programmed.
        </div>
        <div class="workflow-step">
            <strong>Neural Networks:</strong> Computing systems inspired by biological neural networks that process information in layers, similar to how the human brain works.
        </div>
        <div class="workflow-step">
            <strong>Natural Language Processing (NLP):</strong> The ability of computers to understand, interpret, and generate human language in a valuable way.
        </div>
    </div>

    <h2 id="section2Header">Types of AI</h2>
    <div class="section" id="section2">
        <h3>1. Narrow AI (Weak AI)</h3>
        <p>Designed and trained for specific tasks. Examples include virtual assistants, image recognition systems, and recommendation algorithms. This is the only type of AI that currently exists.</p>

        <h3>2. General AI (Strong AI)</h3>
        <p>Theoretical AI that would have human-like intelligence and the ability to understand, learn, and apply knowledge across different domains. This doesn't exist yet.</p>

        <h3>3. Super AI</h3>
        <p>Hypothetical AI that would surpass human intelligence in all aspects. This is purely speculative and far from current reality.</p>
    </div>

    <h2 id="section3Header">How AI Works</h2>
    <div class="section" id="section3">
        <h3>The Learning Process:</h3>
        <div class="workflow-step">
            <strong>Step 1: Data Collection</strong><br>
            AI systems need large amounts of data to learn patterns and make predictions.
        </div>
        <div class="workflow-step">
            <strong>Step 2: Training</strong><br>
            The AI analyzes the data, identifies patterns, and adjusts its internal parameters to improve accuracy.
        </div>
        <div class="workflow-step">
            <strong>Step 3: Testing</strong><br>
            The trained model is tested on new data to verify its performance and accuracy.
        </div>
        <div class="workflow-step">
            <strong>Step 4: Deployment</strong><br>
            Once validated, the AI model can be used to make predictions or decisions on real-world data.
        </div>
    </div>

    <h2 id="section4Header">Quick Quiz</h2>
    <div class="section" id="section4">
        <div class="quiz-question">
            <p><strong>Question 1:</strong> What is the main concept behind AI?</p>
            <div class="quiz-options" id="quiz1Options">
                <div class="quiz-option" data-answer="wrong" data-quiz="1">A) Creating human-like robots</div>
                <div class="quiz-option" data-answer="correct" data-quiz="1">B) Systems learning from data and improving over time</div>
                <div class="quiz-option" data-answer="wrong" data-quiz="1">C) Replacing all human workers</div>
                <div class="quiz-option" data-answer="wrong" data-quiz="1">D) Programming computers with fixed rules</div>
            </div>
            <button class="submit-btn" id="quizSubmit1" disabled>Check Answer</button>
            <div id="quizFeedback1"></div>
        </div>

        <div class="quiz-question">
            <p><strong>Question 2:</strong> Which type of AI is currently in use today?</p>
            <div class="quiz-options" id="quiz2Options">
                <div class="quiz-option" data-answer="correct" data-quiz="2">A) Narrow AI</div>
                <div class="quiz-option" data-answer="wrong" data-quiz="2">B) General AI</div>
                <div class="quiz-option" data-answer="wrong" data-quiz="2">C) Super AI</div>
                <div class="quiz-option" data-answer="wrong" data-quiz="2">D) Universal AI</div>
            </div>
            <button class="submit-btn" id="quizSubmit2" disabled>Check Answer</button>
            <div id="quizFeedback2"></div>
        </div>
    </div>

    <h2 id="section5Header">Activities</h2>
    <div class="section" id="section5">
        <div class="activity-box" data-activity="1">
            <h3>
                <span class="checkmark" id="check1"></span>
                Activity 1: AI in Everyday Life
            </h3>
            <p>Make a list of all the ways you use AI in your everyday life. This could include things like virtual assistants, image recognition software, language translation apps, and more.</p>
            <label class="label">Type your answers here:</label>
            <textarea rows="10" id="activity1" placeholder="Start typing your answer..."></textarea>
            <div class="word-count" id="count1">0 words</div>
            <div class="save-indicator" id="save1">Saved ✓</div>
        </div>

        <div class="activity-box" data-activity="2">
            <h3>
                <span class="checkmark" id="check2"></span>
                Activity 2: Machine Learning Algorithms
            </h3>
            <p>Research and write a short description of three different machine learning algorithms. How do they work? What are their strengths and weaknesses?</p>
            <label class="label">Type your answers here:</label>
            <textarea rows="10" id="activity2" placeholder="Start typing your answer..."></textarea>
            <div class="word-count" id="count2">0 words</div>
            <div class="save-indicator" id="save2">Saved ✓</div>
        </div>

        <div class="activity-box" data-activity="3">
            <h3>
                <span class="checkmark" id="check3"></span>
                Activity 3: AI in Healthcare
            </h3>
            <p>Research and write a short description of how AI is being used in the healthcare industry. What are the benefits and drawbacks of using AI in healthcare?</p>
            <label class="label">Type your answers here:</label>
            <textarea rows="10" id="activity3" placeholder="Start typing your answer..."></textarea>
            <div class="word-count" id="count3">0 words</div>
            <div class="save-indicator" id="save3">Saved ✓</div>
        </div>
    </div>
</div>

<script>
    document.querySelectorAll('h2').forEach(header => {
        header.addEventListener('click', function() {
            const sectionId = this.id.replace('Header', '');
            const section = document.getElementById(sectionId);
            
            this.classList.toggle('collapsed');
            section.classList.toggle('collapsed');
        });
    });

    let selectedAnswer1 = null;
    let selectedAnswer2 = null;
    
    const quiz1Options = document.querySelectorAll('[data-quiz="1"]');
    const submitBtn1 = document.getElementById('quizSubmit1');
    const feedback1 = document.getElementById('quizFeedback1');

    quiz1Options.forEach(option => {
        option.addEventListener('click', function() {
            if (this.classList.contains('correct') || this.classList.contains('incorrect')) {
                return;
            }
            
            quiz1Options.forEach(opt => opt.classList.remove('selected'));
            this.classList.add('selected');
            selectedAnswer1 = this.dataset.answer;
            submitBtn1.disabled = false;
        });
    });

    submitBtn1.addEventListener('click', function() {
        if (selectedAnswer1 === 'correct') {
            quiz1Options.forEach(opt => {
                if (opt.dataset.answer === 'correct') {
                    opt.classList.add('correct');
                }
            });
            feedback1.className = 'feedback success';
            feedback1.textContent = '🎉 Correct! Machine learning is all about systems learning from data and improving their performance over time.';
        } else {
            quiz1Options.forEach(opt => {
                if (opt.classList.contains('selected')) {
                    opt.classList.add('incorrect');
                }
                if (opt.dataset.answer === 'correct') {
                    opt.classList.add('correct');
                }
            });
            feedback1.className = 'feedback error';
            feedback1.textContent = '❌ Not quite. The main concept of AI is about machines learning from data and improving over time. Try again!';
        }
        submitBtn1.disabled = true;
        updateProgress();
    });

    const quiz2Options = document.querySelectorAll('[data-quiz="2"]');
    const submitBtn2 = document.getElementById('quizSubmit2');
    const feedback2 = document.getElementById('quizFeedback2');

    quiz2Options.forEach(option => {
        option.addEventListener('click', function() {
            if (this.classList.contains('correct') || this.classList.contains('incorrect')) {
                return;
            }
            
            quiz2Options.forEach(opt => opt.classList.remove('selected'));
            this.classList.add('selected');
            selectedAnswer2 = this.dataset.answer;
            submitBtn2.disabled = false;
        });
    });

    submitBtn2.addEventListener('click', function() {
        if (selectedAnswer2 === 'correct') {
            quiz2Options.forEach(opt => {
                if (opt.dataset.answer === 'correct') {
                    opt.classList.add('correct');
                }
            });
            feedback2.className = 'feedback success';
            feedback2.textContent = '🎉 Correct! Narrow AI is designed for specific tasks and is the only type currently in use.';
        } else {
            quiz2Options.forEach(opt => {
                if (opt.classList.contains('selected')) {
                    opt.classList.add('incorrect');
                }
                if (opt.dataset.answer === 'correct') {
                    opt.classList.add('correct');
                }
            });
            feedback2.className = 'feedback error';
            feedback2.textContent = '❌ Not quite. Narrow AI is the only type of AI we have today - it handles specific tasks like voice recognition.';
        }
        submitBtn2.disabled = true;
        updateProgress();
    });

    const activities = ['activity1', 'activity2', 'activity3'];

    activities.forEach((activityId, index) => {
        const textarea = document.getElementById(activityId);
        const wordCount = document.getElementById(`count${index + 1}`);
        const saveIndicator = document.getElementById(`save${index + 1}`);
        const checkmark = document.getElementById(`check${index + 1}`);

        textarea.addEventListener('input', function() {
            const text = this.value.trim();
            const words = text ? text.split(/\s+/).length : 0;
            wordCount.textContent = `${words} words`;
            
            saveIndicator.classList.add('show');
            setTimeout(() => saveIndicator.classList.remove('show'), 2000);

            if (words >= 20) {
                checkmark.classList.add('checked');
                textarea.closest('.activity-box').classList.add('completed');
            } else {
                checkmark.classList.remove('checked');
                textarea.closest('.activity-box').classList.remove('completed');
            }

            updateProgress();
        });
    });

    function updateProgress() {
        let completed = 0;
        const total = 5;

        activities.forEach((activityId) => {
            const textarea = document.getElementById(activityId);
            const words = textarea.value.trim() ? textarea.value.trim().split(/\s+/).length : 0;
            if (words >= 20) completed++;
        });

        if (feedback1.textContent && feedback1.classList.contains('success')) {
            completed++;
        }
        if (feedback2.textContent && feedback2.classList.contains('success')) {
            completed++;
        }

        const percentage = Math.round((completed / total) * 100);
        const progressFill = document.getElementById('progressFill');
        progressFill.style.width = percentage + '%';
        progressFill.textContent = percentage + '% Complete';
    }

    document.addEventListener("DOMContentLoaded", function() {
        const storageKey = 'ai-module-c1-completed';
        
        if (localStorage.getItem(storageKey) === 'true') {
            return;
        }
        
        let hasScrolledToBottom = false;
        
        function checkScrollPosition() {
            const scrollTop = window.scrollY;
            const windowHeight = window.innerHeight;
            const documentHeight = document.documentElement.scrollHeight;
            
            if (scrollTop + windowHeight >= documentHeight - 100) {
                if (!hasScrolledToBottom) {
                    hasScrolledToBottom = true;
                    
                    localStorage.setItem(storageKey, 'true');
                    
                    const banner = document.createElement('div');
                    banner.className = 'completion-banner';
                    banner.innerHTML = `
                        <h3 style="margin: 0; font-size: 18px; font-weight: bold;">🎉 Module 1 Completed!</h3>
                        <p style="margin: 5px 0 0 0; font-size: 14px;">Module 2 unlocked!</p>
                    `;
                    document.body.appendChild(banner);
                    
                    setTimeout(() => {
                        banner.style.animation = 'slideIn 0.5s ease-out reverse';
                        setTimeout(() => banner.remove(), 500);
                    }, 4000);
                    
                    window.removeEventListener('scroll', checkScrollPosition);
                }
            }
        }
        
        window.addEventListener('scroll', checkScrollPosition);
        checkScrollPosition();
    });
</script>