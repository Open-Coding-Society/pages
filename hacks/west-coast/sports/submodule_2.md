---
layout: opencs
title: "Los Angeles"
description: "Submodule 2 of Backend Development Mini-Quest"
permalink: /west-coast/backend/submodule_2/
parent: "Backend Development"
team: "Zombies"
submodule: 2
categories: [CSP, Submodule, Backend]
tags: [backend, submodule, zombies]
author: "Zombies Team"
date: 2025-10-21
microblog: True
footer:
  previous: /west-coast/backend/submodule_1/
  home: /west-coast/sports/
  next: /west-coast/backend/submodule_3/
---

<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>LA Sports API - Step 2: Backend Setup</title>
    <style>
    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }

    body {
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
        padding: 20px;
        min-height: 100vh;
        /* FIX 1: REMOVED: color: #333; */
    }

    /* FIX 2: ADDED a general color rule for content inside the container */
    .container {
        max-width: 1400px;
        margin: 0 auto;
        color: #333; /* Default dark text color for all main content */
    }

    .header {
        background: linear-gradient(135deg, #552583 0%, #FDB927 100%);
        color: #000 !important;
        padding: 60px 40px;
        text-align: center;
        border-radius: 25px;
        margin-bottom: 40px;
        box-shadow: 0 15px 50px rgba(253, 185, 39, 0.4);
        position: relative;
        overflow: hidden;
    }

    .header::before {
        content: '🌴';
        position: absolute;
        font-size: 180px;
        opacity: 0.1;
        top: -30px;
        left: 80px;
        animation: sway 3s ease-in-out infinite;
    }

    .header::after {
        content: '🌴';
        position: absolute;
        font-size: 180px;
        opacity: 0.1;
        bottom: -30px;
        right: 80px;
        animation: sway 3s ease-in-out infinite reverse;
    }

    @keyframes sway {
        0%, 100% { transform: rotate(-2deg); }
        50% { transform: rotate(2deg); }
    }

    .header h1 {
        font-size: 3.5em;
        margin-bottom: 15px;
        text-shadow: 3px 3px 6px rgba(255,255,255,0.3);
        color: #000000ff !important;
    }

    .header p {
        font-size: 1.4em;
        opacity: 0.95;
        color: #000000ff !important;
    }

    .step-badge {
        display: inline-block;
        background: rgba(0,0,0,0.1);
        padding: 12px 30px;
        border-radius: 30px;
        margin-top: 20px;
        font-size: 1.2em;
        font-weight: bold;
        border: 2px solid rgba(0,0,0,0.2);
        color: #000 !important;
    }

    .concept-section {
        background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
        padding: 50px;
        border-radius: 25px;
        margin-bottom: 40px;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
        border-left: 10px solid #FDB927;
    }

    .concept-section h2 {
        color: #552583 !important;
        margin-bottom: 25px;
        font-size: 2.5em;
        display: flex;
        align-items: center;
        gap: 20px;
    }

    /* Text color for concept section paragraph is already good: #2c3e50 */
    .concept-section p {
        color: #2c3e50 !important;
        line-height: 2;
        font-size: 1.15em;
        margin-bottom: 20px;
    }

    .concept-section ul {
        color: #2c3e50;
        line-height: 2;
        margin-left: 30px;
        font-size: 1.1em;
    }

    .concept-section li {
        margin-bottom: 15px;
    }

    .concept-section strong {
        color: #552583;
    }

    .concept-section h3 {
        color: #552583 !important;
        font-size: 1.8em;
        margin: 30px 0 15px 0;
    }

    .la-teams-showcase {
        background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
        padding: 50px;
        border-radius: 25px;
        margin-bottom: 40px;
        box-shadow: 0 15px 50px rgba(0, 0, 0, 0.4);
        /* REMOVED: color: #000 !important; */
    }

    .la-teams-showcase h2 {
        text-align: center;
        margin-bottom: 40px;
        font-size: 2.5em;
        color: #000 !important;
    }

    /* REMOVED: .la-teams-showcase > p { color: #000 !important; } */

    .teams-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 30px;
        margin-bottom: 40px;
    }

    .team-card {
        background: #ffffff;
        padding: 30px;
        border-radius: 20px;
        border: 2px solid #dee2e6;
        transition: all 0.3s;
    }

    .team-card:hover {
        background: #f8f9fa;
        transform: scale(1.05);
        box-shadow: 0 5px 20px rgba(0, 0, 0, 0.15);
    }

    .team-icon {
        font-size: 4em;
        text-align: center;
        margin-bottom: 20px;
    }

    .team-name {
        font-size: 1.8em;
        text-align: center;
        margin-bottom: 15px;
        font-weight: bold;
        color: #000 !important;
    }

    .stadium-name {
        text-align: center;
        font-size: 1.1em;
        color: #333 !important;
        margin-bottom: 20px;
    }

    .team-url {
        background: #f8f9fa;
        padding: 15px;
        border-radius: 10px;
        font-family: 'Courier New', monospace;
        font-size: 0.85em;
        word-break: break-all;
        margin-top: 15px;
        color: #000 !important;
        border: 2px solid #dee2e6;
    }

    .copy-button {
        background: #FDB927;
        color: #552583;
        border: none;
        padding: 10px 20px;
        border-radius: 20px;
        font-size: 0.9em;
        font-weight: bold;
        cursor: pointer;
        width: 100%;
        margin-top: 10px;
        transition: all 0.3s;
    }

    .copy-button:hover {
        transform: scale(1.05);
        box-shadow: 0 5px 15px rgba(253, 185, 39, 0.4);
    }

    .code-box {
        background: #f8f9fa;
        color: #000 !important;
        padding: 15px;
        border-radius: 10px;
        font-family: 'Courier New', monospace;
        margin: 10px 0;
        overflow-x: auto;
        white-space: pre-wrap;
        word-break: break-all;
        user-select: all;
        cursor: text;
        border: 2px solid #FDB927;
    }

    .practice-section {
        background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
        padding: 50px;
        border-radius: 25px;
        margin-bottom: 40px;
        box-shadow: 0 15px 50px rgba(118, 75, 162, 0.4);
        /* REMOVED: color: #000 !important; */
    }

    .practice-section h2 {
        text-align: center;
        margin-bottom: 30px;
        font-size: 2.5em;
        color: #000 !important;
    }

    .build-area {
        background: #ffffff;
        padding: 30px;
        border-radius: 15px;
        margin-bottom: 20px;
        border: 2px solid #dee2e6;
    }

    /* REMOVED: .build-area > p { color: #000 !important; } */

    .build-step {
        margin-bottom: 25px;
    }

    .step-label {
        font-size: 1.2em;
        margin-bottom: 10px;
        font-weight: bold;
        color: #000 !important;
    }

    .step-input {
        width: 100%;
        padding: 12px;
        border-radius: 10px;
        border: 2px solid #dee2e6;
        font-size: 1em;
        font-family: 'Courier New', monospace;
        transition: border-color 0.3s;
        background: #fff;
        color: #000 !important;
    }

    .step-input:focus {
        outline: none;
        border-color: #FDB927;
    }

    .step-input::placeholder {
        color: rgba(0, 0, 0, 0.5) !important;
    }

    .url-output {
        background: #f8f9fa;
        color: #000 !important;
        padding: 20px;
        border-radius: 15px;
        font-family: 'Courier New', monospace;
        font-size: 1.1em;
        margin: 20px 0;
        word-break: break-all;
        min-height: 60px;
        user-select: all;
        cursor: text;
        border: 2px solid #dee2e6;
    }

    .check-button {
        background: #FDB927;
        color: #552583;
        border: none;
        padding: 15px 30px;
        border-radius: 25px;
        font-size: 1.1em;
        font-weight: bold;
        cursor: pointer;
        transition: all 0.3s;
        width: 100%;
    }

    .check-button:hover {
        transform: scale(1.05);
        box-shadow: 0 5px 15px rgba(253, 185, 39, 0.4);
    }

    .feedback {
        margin-top: 15px;
        padding: 15px;
        border-radius: 10px;
        font-weight: bold;
        display: none;
    }

    .feedback.correct {
        background: #d5f4e6;
        color: #27ae60;
        display: block;
    }

    .feedback.incorrect {
        background: #fadbd8;
        color: #e74c3c;
        display: block;
    }

    .hint {
        background: rgba(253, 185, 39, 0.2);
        padding: 15px;
        border-radius: 10px;
        margin-top: 15px;
        font-style: italic;
        border-left: 4px solid #FDB927;
        /* REMOVED: color: #000 !important; */
    }

    .challenge-section {
        background: white;
        padding: 50px;
        border-radius: 25px;
        margin-bottom: 40px;
        box-shadow: 0 12px 40px rgba(0, 0, 0, 0.25);
    }

    .challenge-section h2 {
        text-align: center;
        margin-bottom: 30px;
        font-size: 2.5em;
        color: #552583 !important;
    }

    .challenge-card {
        background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
        padding: 25px;
        border-radius: 15px;
        margin-bottom: 20px;
        border: 2px solid #dee2e6;
        transition: transform 0.3s, box-shadow 0.3s;
    }

    .challenge-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
    }

    .challenge-card h3 {
        margin-bottom: 15px;
        font-size: 1.5em;
        color: #552583 !important;
    }

    /* REMOVED: .challenge-card p { color: #2c3e50 !important; } */

    .challenge-input {
        width: 100%;
        padding: 12px;
        border-radius: 10px;
        border: 2px solid #dee2e6;
        font-size: 1em;
        font-family: 'Courier New', monospace;
        margin: 15px 0;
        transition: border-color 0.3s;
        color: #38d907ff !important;
    }

    .challenge-input:focus {
        outline: none;
        border-color: #FDB927;
    }

    .challenge-button {
        background: linear-gradient(135deg, #552583 0%, #FDB927 100%);
        color: #000 !important;
        border: none;
        padding: 12px 30px;
        border-radius: 25px;
        font-size: 1em;
        font-weight: bold;
        cursor: pointer;
        transition: all 0.3s;
    }

    .challenge-button:hover {
        transform: scale(1.05);
        box-shadow: 0 5px 15px rgba(253, 185, 39, 0.3);
    }

    .key-takeaways {
        background: linear-gradient(135deg, #552583 0%, #FDB927 100%);
        color: #000 !important;
        padding: 50px;
        border-radius: 25px;
        box-shadow: 0 15px 50px rgba(253, 185, 39, 0.4);
    }

    .key-takeaways h2 {
        text-align: center;
        margin-bottom: 30px;
        font-size: 2.5em;
        color: #000 !important;
    }

    .key-takeaways ul {
        line-height: 2.2;
        font-size: 1.15em;
        color: #000 !important;
    }

    .key-takeaways li {
        margin-bottom: 18px;
        color: #000 !important;
    }

    @media (max-width: 768px) {
        .header h1 {
            font-size: 2em;
        }

        .teams-grid {
            grid-template-columns: 1fr;
        }
    }
</style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🌟 Los Angeles Sports API</h1>
            <p>Learn to Build API URLs Like a Pro!</p>
            <div class="step-badge">📊 Step 2: Understanding API URLs</div>
        </div>

        <div class="concept-section">
            <h2>📚 Understanding API URLs</h2>
            <p>Just like finding seats at Dodger Stadium, API URLs have specific parts that tell you exactly where to go. Let's break down how to build the perfect API URL to get LA sports team data!</p>
            
            <h3>🏠 Base URL</h3>
            <p>The foundation - like the stadium address</p>
            <div class="code-box">https://www.thesportsdb.com/api/v1/json/</div>

            <h3>🔑 API Key</h3>
            <p>Your ticket to access the data</p>
            <div class="code-box">3</div>

            <h3>📍 Endpoint</h3>
            <p>What section you're looking for</p>
            <div class="code-box">searchteams.php</div>

            <h3>🎯 Parameters</h3>
            <p>Your specific seat number</p>
            <div class="code-box">?t=Dodgers</div>

            <h3 style="margin-top: 30px;">Complete URL Example:</h3>
            <div class="code-box" style="font-size: 1.1em;">https://www.thesportsdb.com/api/v1/json/3/searchteams.php?t=Dodgers</div>
        </div>

        <div class="la-teams-showcase">
            <h2>🏟️ Your LA Sports Teams & Their API URLs</h2>
            <div class="teams-grid" id="teams-grid"></div>
        </div>

        <div class="practice-section">
            <h2>✏️ Practice: Build Your Own URL</h2>
            <button class="check-button" style="margin-bottom: 30px;" onclick="autofillAll()">⚙️ Autofill All Fields</button>
            <div id="practice-container"></div>
        </div>

        <div class="challenge-section">
            <h2>🎯 Challenge Time!</h2>
            
            <div class="challenge-card">
                <h3>Challenge 1: Build a URL for the LA Rams</h3>
                <input type="text" class="challenge-input" id="challenge1" placeholder="Type your URL here...">
                <button class="challenge-button" onclick="checkChallenge(1)">Check Answer</button>
                <div class="feedback" id="feedback1"></div>
                <div class="hint">💡 Hint: Replace "Dodgers" with "Rams" in the example URL</div>
            </div>

            <div class="challenge-card">
                <h3>Challenge 2: Get ALL NBA Teams</h3>
                <input type="text" class="challenge-input" id="challenge2" placeholder="Type your URL here...">
                <button class="challenge-button" onclick="checkChallenge(2)">Check Answer</button>
                <div class="feedback" id="feedback2"></div>
                <div class="hint">💡 Hint: Use endpoint "search_all_teams.php" with parameter "?l=NBA"</div>
            </div>

            <div class="challenge-card">
                <h3>Challenge 3: Search for USC Trojans Players</h3>
                <input type="text" class="challenge-input" id="challenge3" placeholder="Type your URL here...">
                <button class="challenge-button" onclick="checkChallenge(3)">Check Answer</button>
                <div class="feedback" id="feedback3"></div>
                <div class="hint">💡 Hint: Use endpoint "searchplayers.php" with parameter "?t=USC_Trojans" (use underscore for spaces)</div>
            </div>
        </div>

        <div class="key-takeaways">
            <h2>💡 Key Takeaways</h2>
            <ul>
                <li><strong>API URLs have four main parts:</strong> Base URL, API Key, Endpoint, and Parameters — each serves a specific purpose</li>
                <li><strong>Base URL is the foundation</strong> — it's like the street address of the API server</li>
                <li><strong>API Keys authenticate requests</strong> — they're your ticket to access the data</li>
                <li><strong>Endpoints specify what data you want</strong> — different endpoints return different types of information</li>
                <li><strong>Parameters filter and customize results</strong> — use them to get exactly the data you need</li>
                <li><strong>Practice building URLs</strong> — understanding URL structure is essential for working with any API</li>
            </ul>
        </div>
    </div>

    <script>
        // COMPLETE LA TEAMS DATABASE
        const COMPLETE_LA_TEAMS = {
            "Basketball - Clippers": {
                id: 1,
                name: "Los Angeles Clippers",
                sport: "Basketball - Clippers",
                stadium: "Intuit Dome",
                capacity: 18000,
                founded: 1970,
                championships: 0,
                icon: "🏀",
                searchName: "Los%20Angeles%20Clippers"
            },
            "Football - Chargers": {
                id: 2,
                name: "Los Angeles Chargers",
                sport: "Football - Chargers",
                stadium: "SoFi Stadium",
                capacity: 70240,
                founded: 1960,
                championships: 0,
                icon: "🏈",
                searchName: "Chargers"
            },
            "Football - USC": {
                id: 3,
                name: "USC Trojans",
                sport: "Football - USC",
                stadium: "LA Memorial Coliseum",
                capacity: 77500,
                founded: 1888,
                championships: 11,
                icon: "🏈",
                searchName: "USC"
            },
            "Baseball - Dodgers": {
                id: 4,
                name: "Los Angeles Dodgers",
                sport: "Baseball - Dodgers",
                stadium: "Dodger Stadium",
                capacity: 56000,
                founded: 1883,
                championships: 7,
                icon: "⚾",
                searchName: "Dodgers"
            },
            "Soccer - LA Galaxy": {
                id: 5,
                name: "LA Galaxy",
                sport: "Soccer - LA Galaxy",
                stadium: "Dignity Health Sports Park",
                capacity: 27000,
                founded: 1995,
                championships: 5,
                icon: "⚽",
                searchName: "LA%20Galaxy"
            }
        };

        let userTeams = [];

        // Load user's itinerary from localStorage
        function loadUserItinerary() {
            try {
                const itinerary = JSON.parse(localStorage.getItem('westCoastItinerary'));
                if (itinerary && itinerary.cities && itinerary.cities['Los Angeles'] && 
                    itinerary.cities['Los Angeles'].sports) {
                    const userSports = itinerary.cities['Los Angeles'].sports;
                    
                    // Map user sports to team data
                    userTeams = userSports.map(sport => COMPLETE_LA_TEAMS[sport.name]).filter(t => t);
                    
                    if (userTeams.length === 2) {
                        displayUserTeams();
                        createPracticeAreas();
                    }
                }
            } catch (error) {
                console.error('Error loading itinerary:', error);
            }
        }

        // Display user's selected teams
        function displayUserTeams() {
            const grid = document.getElementById('teams-grid');
            let html = '';

            userTeams.forEach(team => {
                const teamUrl = `https://www.thesportsdb.com/api/v1/json/3/searchteams.php?t=${team.searchName}`;
                const elementId = team.sport.toLowerCase().replace(/\s+/g, '-').replace(/-+/g, '-') + '-url';
                html += `
                    <div class="team-card">
                        <div class="team-icon">${team.icon}</div>
                        <div class="team-name">${team.name}</div>
                        <div class="stadium-name">${team.stadium}</div>
                        <div class="team-url" id="${elementId}">${teamUrl}</div>
                        <button class="copy-button" onclick="copyURL('${elementId}')">📋 Copy URL</button>
                    </div>
                `;
            });

            grid.innerHTML = html;
        }

        // Create practice areas dynamically based on user teams
        function createPracticeAreas() {
            const container = document.getElementById('practice-container');
            let html = '';

            userTeams.forEach((team, index) => {
                const num = index + 1;
                html += `
                    <div class="build-area">
                        <p>Now it's your turn! Fill in the blanks to create an API URL for the ${team.name}.</p>
                        
                        <div class="build-step">
                            <div class="step-label">Step 1: Base URL</div>
                            <input type="text" class="step-input" id="base-url-${num}" placeholder="Enter the base URL...">
                        </div>

                        <div class="build-step">
                            <div class="step-label">Step 2: API Key</div>
                            <input type="text" class="step-input" id="api-key-${num}" placeholder="Enter your API key...">
                        </div>

                        <div class="build-step">
                            <div class="step-label">Step 3: Endpoint</div>
                            <input type="text" class="step-input" id="endpoint-${num}" placeholder="Enter the endpoint...">
                        </div>

                        <div class="build-step">
                            <div class="step-label">Step 4: Team Parameter</div>
                            <input type="text" class="step-input" id="parameter-${num}" placeholder="Enter ?t=TeamName...">
                        </div>

                        <div class="build-step">
                            <div class="step-label">Your Complete URL:</div>
                            <div class="url-output" id="built-url-${num}">Fill in the fields above to build your URL...</div>
                        </div>

                        <button class="check-button" onclick="checkBuiltURL(${num})">✅ Check My URL</button>
                        <div class="feedback" id="build-feedback-${num}"></div>
                    </div>
                `;
            });

            container.innerHTML = html;

            // Add event listeners for dynamic inputs
            userTeams.forEach((team, index) => {
                const num = index + 1;
                document.getElementById(`base-url-${num}`)?.addEventListener('input', () => updateBuiltURL(num));
                document.getElementById(`api-key-${num}`)?.addEventListener('input', () => updateBuiltURL(num));
                document.getElementById(`endpoint-${num}`)?.addEventListener('input', () => updateBuiltURL(num));
                document.getElementById(`parameter-${num}`)?.addEventListener('input', () => updateBuiltURL(num));
            });
        }

        function copyURL(elementId) {
            const urlElement = document.getElementById(elementId);
            const url = urlElement.textContent;
            
            navigator.clipboard.writeText(url).then(() => {
                alert('✅ URL copied to clipboard!\n\nNow paste it in your browser address bar to test it!');
            }).catch(err => {
                alert('Please select and copy the URL manually: ' + url);
            });
        }

        function updateBuiltURL(num) {
            const base = document.getElementById(`base-url-${num}`)?.value || '';
            const key = document.getElementById(`api-key-${num}`)?.value || '';
            const endpoint = document.getElementById(`endpoint-${num}`)?.value || '';
            const param = document.getElementById(`parameter-${num}`)?.value || '';
            
            let url = '';
            if (base) url += base;
            if (key) url += key + '/';
            if (endpoint) url += endpoint;
            if (param) url += param;
            
            const outputElement = document.getElementById(`built-url-${num}`);
            if (outputElement) {
                outputElement.textContent = url || 'Fill in the fields above to build your URL...';
            }
        }

        function checkBuiltURL(num) {
            const builtURL = document.getElementById(`built-url-${num}`).textContent.trim();
            const feedback = document.getElementById(`build-feedback-${num}`);
            
            if (num <= userTeams.length) {
                const team = userTeams[num - 1];
                const correctURL = `https://www.thesportsdb.com/api/v1/json/3/searchteams.php?t=${team.searchName}`;
                const teamName = team.name;
                
                const alt1 = correctURL.replace(/%20/g, '+');
                const alt2 = correctURL.replace(/%20/g, ' ');
                
                if (builtURL.toLowerCase() === correctURL.toLowerCase() || 
                    builtURL.toLowerCase() === alt1.toLowerCase() || 
                    builtURL.toLowerCase() === alt2.toLowerCase()) {
                    feedback.className = 'feedback correct';
                    feedback.textContent = `🎉 Perfect! You built the ${teamName} API URL correctly! Try copying and testing it in your browser.`;
                } else {
                    feedback.className = 'feedback incorrect';
                    feedback.textContent = `❌ Not quite right. The correct answer is: ${correctURL}`;
                }
            }
        }

        function checkChallenge(challengeNum) {
            const input = document.getElementById(`challenge${challengeNum}`).value.trim();
            const feedback = document.getElementById(`feedback${challengeNum}`);
            
            let correct = false;
            let correctAnswer = '';

            switch(challengeNum) {
                case 1:
                    correctAnswer = 'https://www.thesportsdb.com/api/v1/json/3/searchteams.php?t=Rams';
                    correct = input.toLowerCase() === correctAnswer.toLowerCase();
                    break;
                case 2:
                    correctAnswer = 'https://www.thesportsdb.com/api/v1/json/3/search_all_teams.php?l=NBA';
                    correct = input.toLowerCase() === correctAnswer.toLowerCase();
                    break;
                case 3:
                    correctAnswer = 'https://www.thesportsdb.com/api/v1/json/3/searchplayers.php?t=USC_Trojans';
                    correct = input.toLowerCase() === correctAnswer.toLowerCase();
                    break;
            }

            if (correct) {
                feedback.className = 'feedback correct';
                feedback.textContent = '🎉 Correct! Great job! Copy this URL and test it in your browser to see the data.';
            } else {
                feedback.className = 'feedback incorrect';
                feedback.textContent = `❌ Not quite right. The correct answer is: ${correctAnswer}`;
            }
        }

        // Load user's itinerary on page load
        document.addEventListener('DOMContentLoaded', loadUserItinerary);
        function autofillAll() {
            userTeams.forEach((team, index) => {
                const num = index + 1;

        // Autofill correct values
                document.getElementById(`base-url-${num}`).value = 'https://www.thesportsdb.com/api/v1/json/';
                document.getElementById(`api-key-${num}`).value = '3';
                document.getElementById(`endpoint-${num}`).value = 'searchteams.php';
                document.getElementById(`parameter-${num}`).value = `?t=${team.searchName.replace(/%20/g, ' ')}`;

        // Update display and feedback
                updateBuiltURL(num);
                const feedback = document.getElementById(`build-feedback-${num}`);
                feedback.className = 'feedback correct';
                feedback.textContent = `✅ Autofilled successfully for ${team.name}!`;
    });
}

    </script>
</body>
</html>