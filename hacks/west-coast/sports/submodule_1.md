---
layout: opencs
title: "San Diego"
description: "Stop 1: San Diego — “Connecting to the Data Field”"
permalink: /west-coast/backend/submodule_1/
parent: "Backend Development"
team: "Zombies"
submodule: 1
categories: [CSP, Submodule, Backend]
tags: [backend, submodule, zombies]
author: "Zombies Team"
date: 2025-10-21
microblog: True
footer:
  previous: /west-coast/sports/
  home: /west-coast/sports/
  next: /west-coast/backend/submodule_2/
---

<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>San Diego - Understanding APIs</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            color: #333;
            padding: 20px;
            line-height: 1.6;
        }

        .container {
            max-width: 1000px;
            margin: 0 auto;
        }

        .header {
            background: linear-gradient(135deg, #1a237e 0%, #ffa000 100%);
            color: white;
            padding: 40px;
            border-radius: 15px;
            text-align: center;
            margin-bottom: 30px;
            box-shadow: 0 10px 40px rgba(255, 160, 0, 0.3);
        }

        .header h1 {
            font-size: 2.5em;
            margin-bottom: 10px;
        }

        .header p {
            font-size: 1.2em;
            opacity: 0.95;
        }

        .section {
            background: #1a1f3a;
            padding: 30px;
            border-radius: 15px;
            margin-bottom: 25px;
            box-shadow: 0 5px 20px rgba(0, 0, 0, 0.3);
            border: 1px solid #2d3561;
        }

        .section h2 {
            color: #ffa000;
            margin-bottom: 20px;
            font-size: 1.8em;
            border-bottom: 3px solid #ffa000;
            padding-bottom: 10px;
        }

        .simple-explanation {
            background: #242b4d;
            padding: 20px;
            border-radius: 10px;
            border-left: 5px solid #ffa000;
            margin-bottom: 20px;
        }

        .simple-explanation h3 {
            color: #ffa000;
            margin-bottom: 10px;
            font-size: 1.2em;
        }

        .simple-explanation p {
            line-height: 1.8;
            color: #b0b0b0;
            font-size: 1.05em;
        }

        .analogy-box {
            background: linear-gradient(135deg, #1a237e 0%, #2d3561 100%);
            padding: 25px;
            border-radius: 12px;
            margin: 20px 0;
            border: 2px solid #ffa000;
        }

        .analogy-box h3 {
            color: #ffa000;
            margin-bottom: 15px;
            text-align: center;
            font-size: 1.4em;
        }

        .steps {
            display: grid;
            gap: 15px;
            margin-top: 20px;
        }

        .step {
            background: #242b4d;
            padding: 20px;
            border-radius: 10px;
            border-left: 5px solid #ffa000;
            transition: all 0.3s;
        }

        .step:hover {
            transform: translateX(10px);
            box-shadow: 0 5px 20px rgba(255, 160, 0, 0.3);
        }

        .step-number {
            display: inline-block;
            background: #ffa000;
            color: #0a0e27;
            width: 35px;
            height: 35px;
            border-radius: 50%;
            text-align: center;
            line-height: 35px;
            font-weight: bold;
            margin-right: 15px;
        }

        .step strong {
            color: #ffa000;
            font-size: 1.1em;
        }

        .venue-card {
            background: #242b4d;
            border: 2px solid #2d3561;
            border-radius: 12px;
            padding: 25px;
            margin-bottom: 20px;
            cursor: pointer;
            transition: all 0.3s;
        }

        .venue-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 30px rgba(255, 160, 0, 0.3);
            border-color: #ffa000;
        }

        .venue-card h3 {
            color: #ffa000;
            font-size: 1.5em;
            margin-bottom: 10px;
        }

        .venue-info {
            color: #b0b0b0;
            margin: 5px 0;
            font-size: 1.05em;
        }

        .api-endpoint {
            background: #1a1f3a;
            padding: 12px;
            border-radius: 6px;
            font-family: 'Courier New', monospace;
            margin: 15px 0;
            color: #4fc3f7;
            font-size: 0.95em;
            border: 1px solid #2d3561;
        }

        .fetch-btn {
            background: linear-gradient(135deg, #1a237e 0%, #ffa000 100%);
            color: white;
            border: none;
            padding: 12px 30px;
            border-radius: 8px;
            font-weight: bold;
            cursor: pointer;
            transition: all 0.3s;
            margin-top: 10px;
            font-size: 1em;
        }

        .fetch-btn:hover {
            transform: scale(1.05);
            box-shadow: 0 5px 20px rgba(255, 160, 0, 0.5);
        }

        .response-box {
            margin-top: 15px;
            display: none;
        }

        .response-box.active {
            display: block;
            animation: slideIn 0.3s ease-out;
        }

        .loading-animation {
            text-align: center;
            padding: 20px;
        }

        .loading-text {
            color: #ffa000;
            font-weight: bold;
            margin-bottom: 10px;
            font-size: 1.1em;
        }

        .progress-bar {
            width: 100%;
            height: 8px;
            background: #1a1f3a;
            border-radius: 10px;
            overflow: hidden;
            margin: 15px 0;
        }

        .progress-fill {
            height: 100%;
            background: linear-gradient(90deg, #1a237e 0%, #ffa000 100%);
            width: 0%;
            transition: width 0.5s ease;
        }

        .data-reveal {
            background: #242b4d;
            border: 2px solid #ffa000;
            border-radius: 10px;
            padding: 20px;
        }

        .data-item {
            display: flex;
            justify-content: space-between;
            padding: 12px;
            margin: 8px 0;
            background: #1a1f3a;
            border-radius: 6px;
            opacity: 0;
            transform: translateX(-20px);
            animation: slideInItem 0.5s forwards;
        }

        .data-item:nth-child(1) { animation-delay: 0.1s; }
        .data-item:nth-child(2) { animation-delay: 0.2s; }
        .data-item:nth-child(3) { animation-delay: 0.3s; }
        .data-item:nth-child(4) { animation-delay: 0.4s; }
        .data-item:nth-child(5) { animation-delay: 0.5s; }
        .data-item:nth-child(6) { animation-delay: 0.6s; }
        .data-item:nth-child(7) { animation-delay: 0.7s; }

        @keyframes slideInItem {
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }

        @keyframes slideIn {
            from {
                opacity: 0;
                transform: translateY(-10px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        .data-label {
            font-weight: bold;
            color: #ffa000;
            font-size: 1.05em;
        }

        .data-value {
            color: #e0e0e0;
            font-family: 'Courier New', monospace;
            background: #0a0e27;
            padding: 4px 8px;
            border-radius: 4px;
        }

        .api-explanation {
            background: linear-gradient(135deg, #1a237e 0%, #2d3561 100%);
            border: 2px solid #ffa000;
            border-radius: 8px;
            padding: 15px;
            margin-top: 15px;
            font-size: 0.95em;
            color: #b0b0b0;
        }

        .api-explanation strong {
            color: #ffa000;
        }

        .request-preview {
            background: #0a0e27;
            color: #4fc3f7;
            padding: 12px;
            border-radius: 6px;
            font-family: 'Courier New', monospace;
            font-size: 0.85em;
            margin: 10px 0;
            border: 1px solid #2d3561;
        }

        .key-takeaway {
            background: linear-gradient(135deg, #1a237e 0%, #ffa000 100%);
            color: white;
            padding: 30px;
            border-radius: 12px;
            text-align: center;
            font-size: 1.2em;
            line-height: 1.8;
            box-shadow: 0 10px 40px rgba(255, 160, 0, 0.3);
        }

        .highlight {
            background: rgba(255, 255, 255, 0.2);
            padding: 3px 8px;
            border-radius: 4px;
            font-weight: bold;
        }

        /* Quiz Styles */
        .quiz-section {
            background: #1a1f3a;
            padding: 30px;
            border-radius: 15px;
            margin-top: 30px;
            border: 2px solid #ffa000;
            box-shadow: 0 5px 20px rgba(255, 160, 0, 0.3);
        }

        .quiz-section h2 {
            color: #ffa000;
            text-align: center;
            margin-bottom: 30px;
            font-size: 2em;
        }

        .quiz-question {
            background: #242b4d;
            padding: 25px;
            border-radius: 12px;
            margin-bottom: 25px;
            border: 2px solid #2d3561;
            display: none;
        }

        .quiz-question.active {
            display: block;
            animation: slideIn 0.3s ease-out;
        }

        .question-number {
            background: #ffa000;
            color: #0a0e27;
            padding: 5px 15px;
            border-radius: 20px;
            font-weight: bold;
            display: inline-block;
            margin-bottom: 15px;
        }

        .question-text {
            color: #e0e0e0;
            font-size: 1.3em;
            margin-bottom: 20px;
            line-height: 1.6;
        }

        .quiz-options {
            display: grid;
            gap: 12px;
            margin-top: 20px;
        }

        .quiz-option {
            background: #1a1f3a;
            padding: 15px 20px;
            border-radius: 8px;
            border: 2px solid #2d3561;
            cursor: pointer;
            transition: all 0.3s;
            color: #b0b0b0;
            font-size: 1.05em;
        }

        .quiz-option:hover {
            border-color: #ffa000;
            background: #242b4d;
            transform: translateX(5px);
        }

        .quiz-option.selected {
            border-color: #4fc3f7;
            background: #1a237e;
            color: #fff;
        }

        .quiz-option.correct {
            border-color: #4caf50;
            background: #1b5e20;
            color: #fff;
        }

        .quiz-option.incorrect {
            border-color: #f44336;
            background: #b71c1c;
            color: #fff;
        }

        .quiz-feedback {
            margin-top: 20px;
            padding: 15px;
            border-radius: 8px;
            display: none;
            font-size: 1.05em;
        }

        .quiz-feedback.show {
            display: block;
            animation: slideIn 0.3s ease-out;
        }

        .quiz-feedback.correct {
            background: #1b5e20;
            border: 2px solid #4caf50;
            color: #fff;
        }

        .quiz-feedback.incorrect {
            background: #b71c1c;
            border: 2px solid #f44336;
            color: #fff;
        }

        .interactive-task {
            background: #0a0e27;
            padding: 20px;
            border-radius: 8px;
            margin: 15px 0;
            border: 2px dashed #ffa000;
        }

        .drag-drop-area {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            margin-top: 15px;
        }

        .draggable-item {
            background: #1a237e;
            padding: 12px;
            border-radius: 6px;
            text-align: center;
            cursor: move;
            border: 2px solid #ffa000;
            color: #fff;
            font-weight: bold;
            transition: all 0.3s;
        }

        .draggable-item:hover {
            transform: scale(1.05);
            box-shadow: 0 5px 15px rgba(255, 160, 0, 0.4);
        }

        .draggable-item.dragging {
            opacity: 0.5;
        }

        .drop-zone {
            background: #242b4d;
            padding: 15px;
            border-radius: 8px;
            min-height: 60px;
            border: 2px dashed #2d3561;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #666;
        }

        .drop-zone.drag-over {
            border-color: #ffa000;
            background: #1a1f3a;
        }

        .drop-zone.filled {
            border-color: #4caf50;
            background: #1b5e20;
        }

        .input-task {
            margin-top: 15px;
        }

        .api-input {
            width: 100%;
            padding: 15px;
            background: #1a1f3a;
            border: 2px solid #2d3561;
            border-radius: 8px;
            color: #e0e0e0;
            font-size: 1em;
            font-family: 'Courier New', monospace;
            margin-top: 10px;
        }

        .api-input:focus {
            outline: none;
            border-color: #ffa000;
        }

        .submit-btn {
            background: #ffa000;
            color: #0a0e27;
            border: none;
            padding: 12px 30px;
            border-radius: 8px;
            font-weight: bold;
            cursor: pointer;
            margin-top: 15px;
            font-size: 1em;
            transition: all 0.3s;
        }

        .submit-btn:hover {
            background: #ff8f00;
            transform: scale(1.05);
        }

        .submit-btn:disabled {
            background: #666;
            cursor: not-allowed;
            transform: none;
        }

        .next-btn {
            background: linear-gradient(135deg, #1a237e 0%, #ffa000 100%);
            color: white;
            border: none;
            padding: 12px 30px;
            border-radius: 8px;
            font-weight: bold;
            cursor: pointer;
            margin-top: 20px;
            font-size: 1em;
            display: none;
        }

        .next-btn.show {
            display: inline-block;
        }

        .next-btn:hover {
            transform: scale(1.05);
            box-shadow: 0 5px 20px rgba(255, 160, 0, 0.5);
        }

        .quiz-complete {
            text-align: center;
            padding: 40px;
            display: none;
        }

        .quiz-complete.show {
            display: block;
            animation: slideIn 0.5s ease-out;
        }

        .quiz-score {
            font-size: 3em;
            color: #ffa000;
            font-weight: bold;
            margin: 20px 0;
        }

        .restart-btn {
            background: #ffa000;
            color: #0a0e27;
            border: none;
            padding: 15px 40px;
            border-radius: 8px;
            font-weight: bold;
            cursor: pointer;
            margin-top: 20px;
            font-size: 1.1em;
        }

        .restart-btn:hover {
            background: #ff8f00;
            transform: scale(1.05);
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🏟️ Stop 1: San Diego</h1>
            <p>Learn How APIs Work Using Real Stadium Data</p>
        </div>

        <div class="section">
            <h2>What is an API?</h2>
            <div class="simple-explanation">
                <h3>Simple Definition:</h3>
                <p>An <strong>API (Application Programming Interface)</strong> is like a football game. The coach will tell the quarterback what you want (make a request), the coach goes to the playbook (database), and brings back your play (data).</p>
            </div>

            <div class="simple-explanation">
                <h3>Why Do We Need APIs?</h3>
                <p>Imagine if every app had to store ALL data itself - weather, sports scores, maps, etc. That would be impossible! Instead, apps use APIs to ask other services for the data they need, exactly when they need it.</p>
            </div>
        </div>

        <div class="section">
            <h2>How APIs Work: Step by Step</h2>
            <div class="analogy-box">
                <h3>🏈 The Stadium Information Request</h3>
                <div class="steps">
                    <div class="step">
                        <span class="step-number">1</span>
                        <strong>You want information</strong><br>
                        Example: "I need to know about Petco Park"
                    </div>
                    <div class="step">
                        <span class="step-number">2</span>
                        <strong>You make a request to the API</strong><br>
                        Example: Send GET request to <code>/api/stadium?name=petco</code>
                    </div>
                    <div class="step">
                        <span class="step-number">3</span>
                        <strong>The API finds the data</strong><br>
                        API looks in the database for Petco Park information
                    </div>
                    <div class="step">
                        <span class="step-number">4</span>
                        <strong>API sends back the data</strong><br>
                        You receive: name, capacity, team, location, etc.
                    </div>
                </div>
            </div>
        </div>

        <div class="section" id="venues-section">
            <h2>Try It: Your San Diego Sports Venues</h2>
            <p style="margin-bottom: 20px; color: #b0b0b0;">These are the sports venues from YOUR personalized itinerary! Click on any venue card below to fetch its data using an API call.</p>
            <div id="venue-cards-container"></div>
        </div>

        <div class="section">
            <h2>What Did You Just Learn?</h2>
            <div class="simple-explanation">
                <p><strong>1. APIs are messengers</strong> - They fetch specific data you request</p>
            </div>
            <div class="simple-explanation">
                <p><strong>2. Endpoints are like addresses</strong> - Each endpoint gives you different data</p>
            </div>
            <div class="simple-explanation">
                <p><strong>3. Responses are structured</strong> - Data comes back in an organized format (usually JSON)</p>
            </div>
            <div class="simple-explanation">
                <p><strong>4. You only get what you ask for</strong> - APIs return exactly the data you request, nothing more</p>
            </div>
        </div>

        <div class="section">
            <h2>API Keys: Your Access Pass</h2>
            <div class="simple-explanation">
                <h3>What is an API Key?</h3>
                <p>Most real-world APIs require an <strong>API key</strong> - think of it like a membership card or password that proves you have permission to use the API. When you want to use a popular API (like Google Maps, weather services, or sports data), you typically need to sign up for an account, and the service will give you a unique API key. You include this key with every request you make, usually in the URL or request header. This helps API providers track who's using their service, prevent abuse, and sometimes charge for usage based on how many requests you make. For example, a request might look like: <code>/api/stadium?venue=petco&key=YOUR_API_KEY_HERE</code>. The API keys in this demo are simplified for learning purposes, but in real applications, keeping your API key secure and not sharing it publicly is crucial!</p>
            </div>
        </div>

        <div class="key-takeaway">
            <p>🎯 <span class="highlight">Key Takeaway:</span> APIs let different programs talk to each other. You ask for data (request), and the API brings it back (response). It's that simple!</p>
        </div>

        <!-- Interactive Quiz Section -->
        <div class="quiz-section">
            <h2>🎯 Test Your Knowledge: Interactive Quiz</h2>
            
            <!-- Question 1: Multiple Choice -->
            <div class="quiz-question active" id="q1">
                <div class="question-number">Question 1 of 4</div>
                <div class="question-text">What does API stand for?</div>
                <div class="quiz-options">
                    <div class="quiz-option" onclick="selectOption(1, 0, false)">A) Application Programming Internet</div>
                    <div class="quiz-option" onclick="selectOption(1, 1, true)">B) Application Programming Interface</div>
                    <div class="quiz-option" onclick="selectOption(1, 2, false)">C) Advanced Programming Interface</div>
                    <div class="quiz-option" onclick="selectOption(1, 3, false)">D) Automatic Program Integration</div>
                </div>
                <div class="quiz-feedback" id="feedback1"></div>
                <button class="next-btn" id="next1" onclick="nextQuestion(2)">Next Question →</button>
            </div>

            <!-- Question 2: Drag and Drop -->
            <div class="quiz-question" id="q2">
                <div class="question-number">Question 2 of 4</div>
                <div class="question-text">Drag the steps to put the API process in the correct order:</div>
                <div class="interactive-task">
                    <div style="margin-bottom: 15px; color: #ffa000; font-weight: bold;">Drag items into the correct order (1-4):</div>
                    <div style="display: grid; gap: 10px; margin-bottom: 20px;" id="draggable-container">
                        <div class="draggable-item" draggable="true" data-step="3">API finds the data in database</div>
                        <div class="draggable-item" draggable="true" data-step="1">You want specific information</div>
                        <div class="draggable-item" draggable="true" data-step="4">API sends back the data</div>
                        <div class="draggable-item" draggable="true" data-step="2">You make a request to API</div>
                    </div>
                    <div style="color: #b0b0b0; margin-bottom: 10px;">Drop zones (in order):</div>
                    <div style="display: grid; gap: 10px;">
                        <div class="drop-zone" data-position="1">Step 1: Drop here</div>
                        <div class="drop-zone" data-position="2">Step 2: Drop here</div>
                        <div class="drop-zone" data-position="3">Step 3: Drop here</div>
                        <div class="drop-zone" data-position="4">Step 4: Drop here</div>
                    </div>
                </div>
                <button class="submit-btn" onclick="checkDragDrop()" id="submit-q2">Check Answer</button>
                <div class="quiz-feedback" id="feedback2"></div>
                <button class="next-btn" id="next2" onclick="nextQuestion(3)">Next Question →</button>
            </div>

            <!-- Question 3: Type the API Endpoint -->
            <div class="quiz-question" id="q3">
                <div class="question-number">Question 3 of 4</div>
                <div class="question-text" id="q3-text">If you want to get information about Snapdragon Stadium, what endpoint should you use?</div>
                <div class="interactive-task">
                    <div style="color: #b0b0b0; margin-bottom: 10px;">Type the correct API endpoint below:</div>
                    <input type="text" class="api-input" id="endpoint-input" placeholder="GET /api/stadium?venue=_____">
                    <div style="margin-top: 10px; color: #666; font-size: 0.9em;" id="q3-hint">Hint: Look at the examples above! Remember the venue name for Snapdragon Stadium.</div>
                </div>
                <button class="submit-btn" onclick="checkEndpoint()" id="submit-q3">Check Answer</button>
                <div class="quiz-feedback" id="feedback3"></div>
                <button class="next-btn" id="next3" onclick="nextQuestion(4)">Next Question →</button>
            </div>

            <!-- Question 4: Click the Correct Data Field -->
            <div class="quiz-question" id="q4">
                <div class="question-number">Question 4 of 4</div>
                <div class="question-text">You made an API request and got this response. Click on the field that shows the stadium capacity:</div>
                <div class="interactive-task">
                    <div style="background: #0a0e27; padding: 20px; border-radius: 8px; font-family: 'Courier New', monospace; color: #4fc3f7;" id="q4-response">
                        {<br>
                        &nbsp;&nbsp;<span class="quiz-option" onclick="selectDataField(0, false)" style="display: inline; padding: 5px; margin: 2px; cursor: pointer;">"venue": "Petco Park"</span>,<br>
                        &nbsp;&nbsp;<span class="quiz-option" onclick="selectDataField(1, false)" style="display: inline; padding: 5px; margin: 2px; cursor: pointer;">"team": "San Diego Padres"</span>,<br>
                        &nbsp;&nbsp;<span class="quiz-option" onclick="selectDataField(2, true)" style="display: inline; padding: 5px; margin: 2px; cursor: pointer;">"capacity": 40209</span>,<br>
                        &nbsp;&nbsp;<span class="quiz-option" onclick="selectDataField(3, false)" style="display: inline; padding: 5px; margin: 2px; cursor: pointer;">"location": "Downtown"</span><br>
                        }
                    </div>
                </div>
                <div class="quiz-feedback" id="feedback4"></div>
                <button class="next-btn" id="next4" onclick="showResults()">See Results →</button>
            </div>

            <!-- Quiz Complete -->
            <div class="quiz-complete" id="quiz-complete">
                <h3 style="color: #ffa000; font-size: 2em; margin-bottom: 20px;">🎉 Quiz Complete!</h3>
                <div class="quiz-score" id="final-score">4/4</div>
                <p style="color: #b0b0b0; font-size: 1.2em; margin-bottom: 20px;" id="score-message">Perfect score! You're an API expert!</p>
                <button class="restart-btn" onclick="restartQuiz()">🔄 Retake Quiz</button>
            </div>
        </div>
    </div>

    <script>
        // COMPLETE STADIUM DATABASE
        const COMPLETE_STADIUM_DATA = {
            petco: {
                venue: "Petco Park",
                team: "San Diego Padres",
                sport: "Baseball - Padres",
                capacity: 40209,
                location: "Downtown",
                opened: 2004,
                surface: "Natural Grass"
            },
            snapdragon: {
                venue: "Snapdragon Stadium",
                team: "San Diego FC / San Diego Wave FC",
                sport: "Soccer - SDFC",
                capacity: 35000,
                location: "Mission Valley",
                opened: 2022,
                surface: "Natural Grass"
            },
            pechanga: {
                venue: "Pechanga Arena",
                team: "San Diego Gulls",
                sport: "AHL Hockey - Gulls",
                capacity: 12920,
                location: "Midway District",
                opened: 1966,
                surface: "Ice"
            },
            viejas: {
                venue: "Viejas Arena",
                team: "San Diego State Aztecs",
                sport: "Basketball - Aztecs",
                capacity: 12414,
                location: "SDSU Campus",
                opened: 1997,
                surface: "Hardwood"
            },
            torero: {
                venue: "Torero Stadium",
                team: "University of San Diego",
                sport: "Football - USD",
                capacity: 6000,
                location: "USD Campus",
                opened: 1961,
                surface: "FieldTurf"
            }
        };

        // MAPPING FROM SPORT NAMES TO VENUE KEYS
        const SPORT_TO_VENUE = {
            "Baseball - Padres": "petco",
            "Soccer - SDFC": "snapdragon",
            "AHL Hockey - Gulls": "pechanga",
            "Basketball - Aztecs": "viejas",
            "Football - USD": "torero"
        };

        // Get user's sports from localStorage
        let userSports = [];
        let userVenues = [];
        let quizScore = 0;
        let currentQ = 1;

        function loadUserItinerary() {
            try {
                const itinerary = localStorage.getItem('westCoastItinerary');
                if (itinerary) {
                    const data = JSON.parse(itinerary);
                    if (data.cities && data.cities['San Diego'] && data.cities['San Diego'].sports) {
                        userSports = data.cities['San Diego'].sports;
                        
                        // Map sports to venue keys
                        userVenues = userSports.map(sport => SPORT_TO_VENUE[sport.name]).filter(v => v);
                        
                        if (userVenues.length === 2) {
                            displayUserVenues();
                            updateQuizForUserSports();
                        } else {
                            displayDefaultVenues();
                        }
                    } else {
                        displayDefaultVenues();
                    }
                } else {
                    displayDefaultVenues();
                }
            } catch (error) {
                console.error('Error loading itinerary:', error);
                displayDefaultVenues();
            }
        }

        function displayUserVenues() {
            const container = document.getElementById('venue-cards-container');
            let html = '';

            userVenues.forEach(venueKey => {
                const data = COMPLETE_STADIUM_DATA[venueKey];
                html += `
                    <div class="venue-card" onclick="fetchVenue('${venueKey}')">
                        <h3>🏟️ ${data.venue}</h3>
                        <div class="venue-info">Home of ${data.team}</div>
                        <div class="api-endpoint">GET /api/stadium?venue=${venueKey}</div>
                        <button class="fetch-btn">📡 Fetch Stadium Data</button>
                        <div id="response-${venueKey}" class="response-box"></div>
                    </div>
                `;
            });

            container.innerHTML = html;
        }

        function displayDefaultVenues() {
            const container = document.getElementById('venue-cards-container');
            container.innerHTML = `
                <div class="venue-card" onclick="fetchVenue('petco')">
                    <h3>⚾ Petco Park</h3>
                    <div class="venue-info">Home of the San Diego Padres (MLB Baseball)</div>
                    <div class="api-endpoint">GET /api/stadium?venue=petco</div>
                    <button class="fetch-btn">📡 Fetch Stadium Data</button>
                    <div id="response-petco" class="response-box"></div>
                </div>

                <div class="venue-card" onclick="fetchVenue('snapdragon')">
                    <h3>⚽ Snapdragon Stadium</h3>
                    <div class="venue-info">Home of San Diego FC (MLS) & San Diego Wave FC (NWSL)</div>
                    <div class="api-endpoint">GET /api/stadium?venue=snapdragon</div>
                    <button class="fetch-btn">📡 Fetch Stadium Data</button>
                    <div id="response-snapdragon" class="response-box"></div>
                </div>

                <div class="venue-card" onclick="fetchVenue('pechanga')">
                    <h3>🏒 Pechanga Arena</h3>
                    <div class="venue-info">Home of the San Diego Gulls (AHL Hockey)</div>
                    <div class="api-endpoint">GET /api/stadium?venue=pechanga</div>
                    <button class="fetch-btn">📡 Fetch Stadium Data</button>
                    <div id="response-pechanga" class="response-box"></div>
                </div>
            `;
            // Use default venues
            userVenues = ['petco', 'snapdragon'];
        }

        function updateQuizForUserSports() {
            // Update Question 3 based on first user venue
            const firstVenue = userVenues[0];
            const firstVenueData = COMPLETE_STADIUM_DATA[firstVenue];
            
            document.getElementById('q3-text').textContent = 
                `If you want to get information about ${firstVenueData.venue}, what endpoint should you use?`;
            document.getElementById('q3-hint').textContent = 
                `Hint: Look at the examples above! Remember the venue name for ${firstVenueData.venue}.`;

            // Update Question 4 based on second user venue
            const secondVenue = userVenues[1];
            const secondVenueData = COMPLETE_STADIUM_DATA[secondVenue];
            
            document.getElementById('q4-response').innerHTML = `
                {<br>
                &nbsp;&nbsp;<span class="quiz-option" onclick="selectDataField(0, false)" style="display: inline; padding: 5px; margin: 2px; cursor: pointer;">"venue": "${secondVenueData.venue}"</span>,<br>
                &nbsp;&nbsp;<span class="quiz-option" onclick="selectDataField(1, false)" style="display: inline; padding: 5px; margin: 2px; cursor: pointer;">"team": "${secondVenueData.team}"</span>,<br>
                &nbsp;&nbsp;<span class="quiz-option" onclick="selectDataField(2, true)" style="display: inline; padding: 5px; margin: 2px; cursor: pointer;">"capacity": ${secondVenueData.capacity}</span>,<br>
                &nbsp;&nbsp;<span class="quiz-option" onclick="selectDataField(3, false)" style="display: inline; padding: 5px; margin: 2px; cursor: pointer;">"location": "${secondVenueData.location}"</span><br>
                }
            `;
        }

        function fetchVenue(venueKey) {
            const responseBox = document.getElementById('response-' + venueKey);
            
            responseBox.innerHTML = `
                <div class="loading-animation">
                    <div class="loading-text">🔍 Fetching data from API...</div>
                    <div class="progress-bar">
                        <div class="progress-fill" id="progress-${venueKey}"></div>
                    </div>
                </div>
            `;
            responseBox.classList.add('active');

            const progressBar = document.getElementById('progress-' + venueKey);
            let progress = 0;
            const interval = setInterval(() => {
                progress += 10;
                progressBar.style.width = progress + '%';
                if (progress >= 100) {
                    clearInterval(interval);
                    displayData(venueKey);
                }
            }, 100);
        }

        function displayData(venueKey) {
            const responseBox = document.getElementById('response-' + venueKey);
            const data = COMPLETE_STADIUM_DATA[venueKey];

            let html = '<div class="data-reveal">';
            html += '<div class="data-item"><span class="data-label">Venue:</span><span class="data-value">' + data.venue + '</span></div>';
            html += '<div class="data-item"><span class="data-label">Team:</span><span class="data-value">' + data.team + '</span></div>';
            html += '<div class="data-item"><span class="data-label">Capacity:</span><span class="data-value">' + data.capacity.toLocaleString() + '</span></div>';
            html += '<div class="data-item"><span class="data-label">Location:</span><span class="data-value">' + data.location + '</span></div>';
            html += '<div class="data-item"><span class="data-label">Opened:</span><span class="data-value">' + data.opened + '</span></div>';
            html += '<div class="data-item"><span class="data-label">Surface:</span><span class="data-value">' + data.surface + '</span></div>';
            html += '</div>';

            html += '<div class="api-explanation">';
            html += '<strong>What just happened?</strong><br>';
            html += '1. You clicked the button (made an API request)<br>';
            html += '2. The "API" searched the database for <code>' + venueKey + '</code><br>';
            html += '3. It found the data and sent it back to you<br>';
            html += '4. Now you can see all the stadium information!';
            html += '</div>';

            responseBox.innerHTML = html;
        }

        // Quiz Functions
        function selectOption(questionNum, optionIdx, isCorrect) {
            const question = document.getElementById('q' + questionNum);
            const options = question.querySelectorAll('.quiz-option');
            const feedback = document.getElementById('feedback' + questionNum);
            const nextBtn = document.getElementById('next' + questionNum);

            options.forEach(opt => {
                opt.style.pointerEvents = 'none';
                opt.classList.remove('selected');
            });

            options[optionIdx].classList.add('selected');

            if (isCorrect) {
                options[optionIdx].classList.add('correct');
                feedback.textContent = '✓ Correct! An API (Application Programming Interface) allows applications to communicate with each other.';
                feedback.className = 'quiz-feedback correct show';
                quizScore++;
            } else {
                options[optionIdx].classList.add('incorrect');
                feedback.textContent = '✗ Not quite. API stands for Application Programming Interface - it\'s how programs talk to each other!';
                feedback.className = 'quiz-feedback incorrect show';
            }

            nextBtn.classList.add('show');
        }

        // Drag and Drop
        let draggedElement = null;

        document.addEventListener('DOMContentLoaded', function() {
            loadUserItinerary();
            setupDragDrop();
        });

        function setupDragDrop() {
            const draggables = document.querySelectorAll('.draggable-item');
            const dropZones = document.querySelectorAll('.drop-zone');

            draggables.forEach(item => {
                item.addEventListener('dragstart', function(e) {
                    draggedElement = this;
                    this.classList.add('dragging');
                });

                item.addEventListener('dragend', function() {
                    this.classList.remove('dragging');
                });
            });

            dropZones.forEach(zone => {
                zone.addEventListener('dragover', function(e) {
                    e.preventDefault();
                    this.classList.add('drag-over');
                });

                zone.addEventListener('dragleave', function() {
                    this.classList.remove('drag-over');
                });

                zone.addEventListener('drop', function(e) {
                    e.preventDefault();
                    this.classList.remove('drag-over');
                    
                    if (draggedElement) {
                        if (this.children.length === 0) {
                            this.appendChild(draggedElement);
                            this.classList.add('filled');
                        }
                    }
                });
            });
        }

        function checkDragDrop() {
            const dropZones = document.querySelectorAll('.drop-zone');
            let correct = true;

            dropZones.forEach(zone => {
                const expectedStep = zone.dataset.position;
                const droppedItem = zone.querySelector('.draggable-item');
                
                if (!droppedItem || droppedItem.dataset.step !== expectedStep) {
                    correct = false;
                }
            });

            const feedback = document.getElementById('feedback2');
            const nextBtn = document.getElementById('next2');
            const submitBtn = document.getElementById('submit-q2');

            submitBtn.disabled = true;

            if (correct) {
                feedback.textContent = '✓ Perfect! You correctly ordered the API request process!';
                feedback.className = 'quiz-feedback correct show';
                quizScore++;
            } else {
                feedback.textContent = '✗ Not quite right. Remember: You want info → Make request → API finds data → API returns data';
                feedback.className = 'quiz-feedback incorrect show';
            }

            nextBtn.classList.add('show');
        }

        function checkEndpoint() {
            const input = document.getElementById('endpoint-input').value.trim().toLowerCase();
            const firstVenue = userVenues[0];
            const correctAnswers = [
                `get /api/stadium?venue=${firstVenue}`,
                `/api/stadium?venue=${firstVenue}`,
                `api/stadium?venue=${firstVenue}`
            ];

            const feedback = document.getElementById('feedback3');
            const nextBtn = document.getElementById('next3');
            const submitBtn = document.getElementById('submit-q3');

            submitBtn.disabled = true;

            if (correctAnswers.includes(input)) {
                feedback.textContent = `✓ Correct! GET /api/stadium?venue=${firstVenue} is the right endpoint!`;
                feedback.className = 'quiz-feedback correct show';
                quizScore++;
            } else {
                feedback.textContent = `✗ Not quite. The correct endpoint is: GET /api/stadium?venue=${firstVenue}`;
                feedback.className = 'quiz-feedback incorrect show';
            }

            nextBtn.classList.add('show');
        }

        let q4answered = false;

        function selectDataField(idx, isCorrect) {
            if (q4answered) return;
            
            q4answered = true;
            const feedback = document.getElementById('feedback4');
            const nextBtn = document.getElementById('next4');

            if (isCorrect) {
                feedback.textContent = '✓ Correct! "capacity" shows how many people the stadium can hold!';
                feedback.className = 'quiz-feedback correct show';
                quizScore++;
            } else {
                feedback.textContent = '✗ Not quite. The capacity field shows the stadium\'s seating capacity!';
                feedback.className = 'quiz-feedback incorrect show';
            }

            nextBtn.classList.add('show');
        }

        function nextQuestion(num) {
            document.querySelectorAll('.quiz-question').forEach(q => q.classList.remove('active'));
            document.getElementById('q' + num).classList.add('active');
            currentQ = num;
        }

        function showResults() {
            document.querySelectorAll('.quiz-question').forEach(q => q.classList.remove('active'));
            const complete = document.getElementById('quiz-complete');
            complete.classList.add('show');

            document.getElementById('final-score').textContent = quizScore + '/4';
            
            const message = document.getElementById('score-message');
            if (quizScore === 4) {
                message.textContent = 'Perfect score! You\'re an API expert! 🎉';
            } else if (quizScore === 3) {
                message.textContent = 'Great job! You understand APIs well! 👏';
            } else if (quizScore === 2) {
                message.textContent = 'Good effort! Review the material and try again! 📚';
            } else {
                message.textContent = 'Keep learning! APIs take practice to understand! 💪';
            }
        }

        function restartQuiz() {
            quizScore = 0;
            currentQ = 1;
            q4answered = false;

            document.querySelectorAll('.quiz-question').forEach(q => q.classList.remove('active'));
            document.getElementById('q1').classList.add('active');
            document.getElementById('quiz-complete').classList.remove('show');

            document.querySelectorAll('.quiz-option').forEach(opt => {
                opt.style.pointerEvents = 'auto';
                opt.classList.remove('selected', 'correct', 'incorrect');
            });

            document.querySelectorAll('.quiz-feedback').forEach(f => {
                f.classList.remove('show');
            });

            document.querySelectorAll('.next-btn').forEach(btn => {
                btn.classList.remove('show');
            });

            document.querySelectorAll('.submit-btn').forEach(btn => {
                btn.disabled = false;
            });

            document.getElementById('endpoint-input').value = '';

            const draggableContainer = document.getElementById('draggable-container');
            const dropZones = document.querySelectorAll('.drop-zone');
            
            dropZones.forEach(zone => {
                const item = zone.querySelector('.draggable-item');
                if (item) {
                    draggableContainer.appendChild(item);
                }
                zone.classList.remove('filled');
            });
        }