---
layout: opencs
title: "Seattle"
description: "Submodule 4 of Backend Development Mini-Quest"
permalink: /west-coast/backend/submodule_4/
parent: "Backend Development"
team: "Zombies"
submodule: 4
categories: [CSP, Submodule, Backend]
tags: [backend, submodule, zombies]
author: "Zombies Team"
date: 2025-10-21
microblog: True
footer:
  previous: /west-coast/backend/submodule_3/
  home: /west-coast/sports/
---


<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Stop 4: Seattle — Parsing and Utilizing the Data</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            padding: 20px;
            min-height: 100vh;
       
        }



        .container {
            max-width: 1100px;
            margin: 0 auto;
           
            background: white;
            border-radius: 20px;
         
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            overflow: hidden;
        }

        .header {
            background: linear-gradient(135deg, #002244 0%, #69BE28 100%);
            color: white;
            padding: 30px;
            text-align: center;
        }

        .header h1 {
            font-size: 2.2em;
            margin-bottom: 10px;
        }

        .header p {
            opacity: 0.9;
            font-size: 1.1em;
        }

        .concept-box {
            background: #ffffff;
            padding: 25px;
            border-left: 5px solid #69BE28;
            margin: 25px;
            border-radius: 8px;
        }



        .concept-box h2 {
            color: #002244 !important;
            margin-bottom: 10px;
            font-weight: 600;
        }

        .concept-box p {
            color: #000000 !important;
            line-height: 1.6;
            font-weight: 500;
        }

        .concept-box li {
            color: #000000 !important;
            line-height: 1.8;
        }

        .concept-box p strong {
            color: #000000 !important;
        }

        .concept-box code {
            background: #e9ecef;
            padding: 3px 8px;
            border-radius: 4px;
            color: #d63384;
            font-family: 'Courier New', monospace;
        }

        .analogy-box {
            background: white;
            padding: 35px;
            margin: 25px;
            border-radius: 15px;
            box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
            border: 3px solid #69BE28;
        }

        .analogy-box h2 {
            color: #002244 !important;
            text-align: center;
            margin-bottom: 30px;
            font-size: 1.8em;
        }



        .analogy-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
            margin-top: 20px;
        }

        .analogy-card {
            background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
            padding: 25px;
            border-radius: 12px;
            text-align: center;
            transition: transform 0.3s, box-shadow 0.3s;
            border: 2px solid #dee2e6;
        }



        .analogy-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
        }

        .highlight-card {
            background: linear-gradient(135deg, #002244 0%, #69BE28 100%);
            border-color: #002244;
        }

        .highlight-card h3,
        .highlight-card p {
            color: white !important;
        }

        .analogy-icon {
            font-size: 1.2em;
            margin-bottom: 15px;
            font-weight: bold;
            color: #002244;
            text-transform: uppercase;
            letter-spacing: 1px;
        }

        .highlight-card .analogy-icon {
            color: white;
        }

        .analogy-card h3 {
            color: #002244 !important;
            margin-bottom: 12px;
            font-size: 1.2em;
        }

        .analogy-card p {
            color: #495057 !important;
            line-height: 1.6;
            font-size: 0.95em;
        }

        .interactive-section {
            background: white;
            padding: 35px;
            margin: 25px;
            border-radius: 15px;
            box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
            border: 3px solid #002244;
        }

        .interactive-section h2 {
            color: #002244 !important;
            text-align: center;
            margin-bottom: 15px;
            font-size: 1.8em;
        }

        .section-description {
            text-align: center;
            color: #495057 !important;
            margin-bottom: 25px;
            font-size: 1.05em;
        }

        .team-buttons {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 15px;
            margin-bottom: 20px;
        }

        .team-btn {
            background: white;
            color: #002244;
            border: 3px solid #dee2e6;
            padding: 15px;
            border-radius: 10px;
            cursor: pointer;
            font-size: 1em;
            font-weight: bold;
            transition: all 0.3s;
            text-align: center;
        }

        .team-btn:hover {
            border-color: #69BE28;
            transform: translateY(-3px);
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
        }

        .team-btn.football:hover {
            background: linear-gradient(135deg, #002244 0%, #69BE28 100%);
            color: white;
        }

        .team-btn.baseball:hover {
            background: linear-gradient(135deg, #0C2C56 0%, #005C5C 100%);
            color: white;
        }

        .team-btn.hockey:hover {
            background: linear-gradient(135deg, #001628 0%, #96D8D8 100%);
            color: white;
        }

        .team-btn.college:hover {
            background: linear-gradient(135deg, #4B2E83 0%, #B7A57A 100%);
            color: white;
        }

        .json-display {
            background: #2c3e50;
            color: #00ff00;
            padding: 20px;
            border-radius: 10px;
            font-family: 'Courier New', monospace;
            font-size: 0.9em;
            white-space: pre-wrap;
            max-height: 400px;
            overflow-y: auto;
            margin: 20px 0;
        }

        .parsed-display {
            background: #f8f9fa;
            padding: 20px;
            border-radius: 10px;
            border: 2px solid #69BE28;
            margin: 20px 0;
        }

        .parsed-display h3 {
            color: #002244 !important;
            margin-bottom: 15px;
        }

        .stat-row {
            display: flex;
            justify-content: space-between;
            padding: 10px;
            margin: 5px 0;
            background: white;
            border-radius: 5px;
            border-left: 3px solid #69BE28;
        }

        .stat-label {
            color: #002244 !important;
            font-weight: bold;
        }

        .stat-value {
            color: #495057 !important;
            font-family: 'Courier New', monospace;
        }

        .action-btn {
            background: linear-gradient(135deg, #002244 0%, #69BE28 100%);
            color: white;
            border: none;
            padding: 15px 30px;
            border-radius: 10px;
            font-size: 1em;
            font-weight: bold;
            cursor: pointer;
            transition: all 0.3s;
            margin: 10px 5px;
        }

        .action-btn:hover {
            transform: translateY(-3px);
            box-shadow: 0 5px 15px rgba(0, 34, 68, 0.3);
        }

        .key-learning {
            background: linear-gradient(135deg, #002244 0%, #69BE28 100%);
            color: white;
            padding: 25px;
            margin: 25px;
            border-radius: 12px;
            text-align: center;
        }

        .key-learning h3 {
            margin-bottom: 10px;
            font-size: 1.3em;
        }

        .calculation-box {
            background: white;
            padding: 20px;
            border-radius: 10px;
            margin: 20px 0;
            border: 2px solid #002244;
        }

        .calculation-box h4 {
            color: #002244 !important;
            margin-bottom: 10px;
        }

        .calculation-result {
            background: #69BE28;
            color: white;
            padding: 15px;
            border-radius: 8px;
            font-size: 1.2em;
            font-weight: bold;
            text-align: center;
            margin-top: 10px;
        }

        .code-example {
            background: #2c3e50;
            color: #ffffff;
            padding: 15px;
            border-radius: 8px;
            font-family: 'Courier New', monospace;
            font-size: 0.85em;
            margin: 15px 0;
            overflow-x: auto;
        }

        .code-comment {
            color: #7f8c8d;
        }

        .code-keyword {
            color: #3498db;
        }

        .code-string {
            color: #2ecc71;
        }

        .code-number {
            color: #e74c3c;
        }

        .no-sports-message {
            background: #fff3cd;
            color: #856404;
            padding: 20px;
            border-radius: 10px;
            border: 2px solid #ffc107;
            text-align: center;
            margin: 20px 0;
        }

        .debug-info {
            background: #e3f2fd;
            border: 2px solid #2196F3;
            padding: 15px;
            margin: 20px 0;
            border-radius: 8px;
            font-family: monospace;
            font-size: 0.85em;
        }
    </style>
</head>
<body>
   
    <div class="container">
        <div class="header">
            <h1>Stop 4: Seattle — "Parsing and Utilizing the Data"</h1>
            <p>Transform JSON into Actionable Insights</p>
        </div>

        <div class="concept-box">
            <h2>Coding Concept: JSON Parsing & Data Utilization</h2>
            <p><strong>The raw response data needs to be converted into a usable format for analysis.</strong></p>
            <ul style="margin-top: 10px; margin-left: 20px; line-height: 1.8;">
                <li><strong>Action:</strong> The received JSON text is parsed (converted) into a native data structure (like a list of dictionaries/objects)</li>
                <li><strong>Purpose:</strong> Once parsed, you can easily access specific stats (e.g., team wins, player points per game) by referencing the correct keys and indexes</li>
                <li><strong>Usage:</strong> Use this data for calculations, visualizations, or storing it in a database for your statistical analysis</li>
            </ul>
        </div>

        <div class="analogy-box">
            <h2>Understanding JSON Parsing: The Sports Statistics Analogy</h2>
            <div class="analogy-grid">
                <div class="analogy-card">
                    <div class="analogy-icon">Raw Data</div>
                    <h3>The Game Footage</h3>
                    <p>Raw JSON is like unprocessed game footage - contains all the data but needs organization</p>
                </div>
                <div class="analogy-card">
                    <div class="analogy-icon">Parser</div>
                    <h3>The Stats Crew</h3>
                    <p>JSON parser is like the statistics crew that watches and organizes every play into categories</p>
                </div>
                <div class="analogy-card">
                    <div class="analogy-icon">Structure</div>
                    <h3>The Stat Sheet</h3>
                    <p>Parsed data becomes an organized stat sheet - easy to read and analyze specific metrics</p>
                </div>
                <div class="analogy-card highlight-card">
                    <div class="analogy-icon">Access</div>
                    <h3>Quick Lookup</h3>
                    <p>You can now instantly find any stat: "Show me rushing yards" or "What's the win percentage?"</p>
                </div>
                <div class="analogy-card">
                    <div class="analogy-icon">Calculate</div>
                    <h3>Advanced Analytics</h3>
                    <p>Perform calculations like averages, totals, and trends from the organized data</p>
                </div>
                <div class="analogy-card">
                    <div class="analogy-icon">Visualize</div>
                    <h3>Create Graphics</h3>
                    <p>Transform parsed stats into charts, graphs, and visual reports for analysis</p>
                </div>
            </div>
        </div>

        <div class="interactive-section">
            <h2>Interactive JSON Parsing Demo</h2>
            <p class="section-description">Select a Seattle sports team to see raw JSON and how it's parsed</p>
            
            <!-- Debug info -->
            <div class="debug-info" id="debugInfo" style="display: none;"></div>
            
            <div class="team-buttons" id="teamButtons">
                <!-- Team buttons will be dynamically inserted here -->
            </div>

            <div id="rawJsonSection" style="display: none;">
                <h3 style="color: #002244; margin: 20px 0 10px 0;">Step 1: Raw JSON Response from API</h3>
                <div class="json-display" id="rawJson"></div>
            </div>

            <div id="parseSection" style="display: none;">
                <button class="action-btn" onclick="parseData()">📊 Parse JSON into Usable Data</button>
                <div class="code-example" id="codeExample"></div>
            </div>

            <div id="parsedSection" style="display: none;">
                <div class="parsed-display">
                    <h3>Step 2: Parsed Data Structure</h3>
                    <div id="parsedData"></div>
                </div>
            </div>

            <div id="utilizationSection" style="display: none;">
                <h3 style="color: #002244; margin: 20px 0;">Step 3: Utilizing the Data</h3>
                <button class="action-btn" onclick="calculateWinPercentage()">Calculate Win %</button>
                <button class="action-btn" onclick="calculateAveragePoints()">Calculate Avg Points</button>
                <button class="action-btn" onclick="getTotalAttendance()">Get Total Attendance</button>
                
                <div class="calculation-box" id="calculationResult" style="display: none;"></div>
            </div>
        </div>

        <div class="interactive-section">
            <h2>Practical JSON Parsing Examples</h2>
            <p class="section-description">See how different programming concepts extract and use the data</p>

            <div class="calculation-box">
                <h4>Example 1: Accessing Nested Data</h4>
                <div class="code-example"><span class="code-comment">// Access team name from parsed JSON</span>
<span class="code-keyword">const</span> teamName = parsedData.<span class="code-string">team</span>.<span class="code-string">name</span>;
<span class="code-comment">// Result: "Seattle Seahawks"</span></div>
            </div>

            <div class="calculation-box">
                <h4>Example 2: Iterating Through Arrays</h4>
                <div class="code-example"><span class="code-comment">// Loop through all games to find total points</span>
<span class="code-keyword">let</span> totalPoints = <span class="code-number">0</span>;
parsedData.<span class="code-string">games</span>.<span class="code-keyword">forEach</span>(game => {
    totalPoints += game.<span class="code-string">points</span>;
});
<span class="code-comment">// Calculate average</span>
<span class="code-keyword">const</span> average = totalPoints / parsedData.<span class="code-string">games</span>.<span class="code-string">length</span>;</div>
            </div>

            <div class="calculation-box">
                <h4>Example 3: Filtering Data</h4>
                <div class="code-example"><span class="code-comment">// Find only winning games</span>
<span class="code-keyword">const</span> wins = parsedData.<span class="code-string">games</span>.<span class="code-keyword">filter</span>(
    game => game.<span class="code-string">result</span> === <span class="code-string">"Win"</span>
);
<span class="code-comment">// Result: array of only winning games</span></div>
            </div>
       
        </div>

        <div class="key-learning">
            <h3>Key Learning</h3>
            <p>JSON parsing transforms raw text data into structured objects you can navigate, calculate with, and analyze - just like converting raw game footage into organized statistics that coaches can actually use to make decisions!</p>
        </div>
    </div>

    <script>
        const teamDatabase = {
            football: {
                sportName: 'Football - Seahawks',
                team: {
                    name: "Seattle Seahawks",
                    sport: "Football",
                    league: "NFL",
                    stadium: "Lumen Field",
                    capacity: 68740
                },
                season: {
                    year: 2024,
                    wins: 7,
                    losses: 3,
                    gamesPlayed: 10
                },
                games: [
                    { week: 1, opponent: "Broncos", points: 26, opponentPoints: 20, result: "Win", attendance: 68740 },
                    { week: 2, opponent: "Patriots", points: 23, opponentPoints: 20, result: "Win", attendance: 65878 },
                    { week: 3, opponent: "Dolphins", points: 24, opponentPoints: 3, result: "Win", attendance: 68231 },
                    { week: 4, opponent: "Lions", points: 29, opponentPoints: 42, result: "Loss", attendance: 68654 },
                    { week: 5, opponent: "Giants", points: 29, opponentPoints: 20, result: "Win", attendance: 68122 }
                ]
            },
            baseball: {
                sportName: 'Baseball - Mariners',
                team: {
                    name: "Seattle Mariners",
                    sport: "Baseball",
                    league: "MLB",
                    stadium: "T-Mobile Park",
                    capacity: 47929
                },
                season: {
                    year: 2024,
                    wins: 85,
                    losses: 77,
                    gamesPlayed: 162
                },
                games: [
                    { game: 1, opponent: "Red Sox", runs: 5, opponentRuns: 3, result: "Win", attendance: 44128 },
                    { game: 2, opponent: "Red Sox", runs: 2, opponentRuns: 4, result: "Loss", attendance: 42567 },
                    { game: 3, opponent: "Angels", runs: 7, opponentRuns: 2, result: "Win", attendance: 38934 },
                    { game: 4, opponent: "Angels", runs: 3, opponentRuns: 5, result: "Loss", attendance: 41223 },
                    { game: 5, opponent: "Astros", runs: 6, opponentRuns: 4, result: "Win", attendance: 47929 }
                ]
            },
            hockey: {
                sportName: 'Ice Hockey - Kraken',
                team: {
                    name: "Seattle Kraken",
                    sport: "Hockey",
                    league: "NHL",
                    stadium: "Climate Pledge Arena",
                    capacity: 17151
                },
                season: {
                    year: 2024,
                    wins: 8,
                    losses: 5,
                    gamesPlayed: 13
                },
                games: [
                    { game: 1, opponent: "Blues", goals: 3, opponentGoals: 2, result: "Win", attendance: 17151 },
                    { game: 2, opponent: "Predators", goals: 3, opponentGoals: 0, result: "Win", attendance: 17151 },
                    { game: 3, opponent: "Avalanche", goals: 2, opponentGoals: 5, result: "Loss", attendance: 17023 },
                    { game: 4, opponent: "Hurricanes", goals: 4, opponentGoals: 1, result: "Win", attendance: 17151 },
                    { game: 5, opponent: "Islanders", goals: 3, opponentGoals: 2, result: "Win", attendance: 16987 }
                ]
            },
            college: {
                sportName: 'College Football - Huskies',
                team: {
                    name: "Washington Huskies",
                    sport: "Football",
                    league: "NCAA",
                    stadium: "Husky Stadium",
                    capacity: 70138
                },
                season: {
                    year: 2024,
                    wins: 5,
                    losses: 4,
                    gamesPlayed: 9
                },
                games: [
                    { week: 1, opponent: "Weber State", points: 35, opponentPoints: 3, result: "Win", attendance: 65234 },
                    { week: 2, opponent: "Eastern Michigan", points: 30, opponentPoints: 9, result: "Win", attendance: 58432 },
                    { week: 3, opponent: "Washington State", points: 24, opponentPoints: 19, result: "Win", attendance: 70138 },
                    { week: 4, opponent: "Northwestern", points: 24, opponentPoints: 5, result: "Win", attendance: 52341 },
                    { week: 5, opponent: "Rutgers", points: 21, opponentPoints: 18, result: "Win", attendance: 61287 }
                ]
            },

        };

        let currentTeam = null;
        let parsedDataGlobal = null;

        // Load user's selected sports from itinerary - EXACT COPY from first file
        function loadUserSports() {
            try {
                const itinerary = JSON.parse(localStorage.getItem('westCoastItinerary'));
                if (itinerary && itinerary.cities && itinerary.cities.Seattle) {
                    const seattleSports = itinerary.cities.Seattle.sports;
                    return seattleSports.map(sport => sport.name);
                }
            } catch (e) {
                console.error('Error loading itinerary:', e);
            }
            return null;
        }

        // Map sport names to team keys - EXACT COPY from first file
        function mapSportToKey(sportName) {
            const sportMap = {
                'Football - Seahawks': 'football',
                'Baseball - Mariners': 'baseball',
                'Ice Hockey - Kraken': 'hockey',
                'College Football - Huskies': 'college'
            };
            return sportMap[sportName];
        }

        // Initialize team buttons - EXACT LOGIC from first file
        function initializeTeamButtons() {
            const teamButtonsContainer = document.getElementById('teamButtons');
            const userSports = loadUserSports();
            
            // Debug info
            const debugDiv = document.getElementById('debugInfo');
            let debugText = `localStorage data: ${localStorage.getItem('westCoastItinerary')}\n\n`;
            debugText += `User sports found: ${userSports ? userSports.join(', ') : 'None'}\n`;
            debugDiv.textContent = debugText;
            debugDiv.style.display = 'block';
            
            if (userSports && userSports.length > 0) {
                // Show only user's selected sports
                userSports.forEach(sportName => {
                    const sportKey = mapSportToKey(sportName);
                    if (sportKey && teamDatabase[sportKey]) {
                        const sport = teamDatabase[sportKey];
                        const button = document.createElement('button');
                        button.className = `team-btn ${sportKey}`;
                        button.onclick = () => loadTeamData(sportKey);
                        
                        let emoji = '🏈';
                        if (sportKey === 'baseball') emoji = '⚾';
                        else if (sportKey === 'hockey') emoji = '🏒';
                        
                        button.innerHTML = `${emoji} ${sport.team.name}<br><small>${sportName}</small>`;
                        teamButtonsContainer.appendChild(button);
                    }
                });
            } else {
                // Fallback: show all teams if no itinerary found
                Object.keys(teamDatabase).forEach(key => {
                    const sport = teamDatabase[key];
                    const button = document.createElement('button');
                    button.className = `team-btn ${key}`;
                    button.onclick = () => loadTeamData(key);
                    
                    let emoji = '🏈';
                    if (key === 'baseball') emoji = '⚾';
                    else if (key === 'hockey') emoji = '🏒';
                    
                    button.innerHTML = `${emoji} ${sport.team.name}<br><small>${sport.sportName}</small>`;
                    teamButtonsContainer.appendChild(button);
                });
            }
        }

        function loadTeamData(team) {
            currentTeam = team;
            const data = teamDatabase[team];
            
            // Show raw JSON
            document.getElementById('rawJsonSection').style.display = 'block';
            document.getElementById('rawJson').textContent = JSON.stringify(data, null, 2);
            
            // Show parse button
            document.getElementById('parseSection').style.display = 'block';
            document.getElementById('codeExample').innerHTML = `<span class="code-comment">// Code to parse the JSON:</span>
<span class="code-keyword">const</span> response = <span class="code-keyword">await</span> fetch(<span class="code-string">'/api/team/${team}'</span>);
<span class="code-keyword">const</span> rawText = <span class="code-keyword">await</span> response.<span class="code-string">text</span>();
<span class="code-keyword">const</span> parsedData = JSON.<span class="code-string">parse</span>(rawText);

<span class="code-comment">// Now parsedData is a JavaScript object!</span>`;
            
            // Hide other sections
            document.getElementById('parsedSection').style.display = 'none';
            document.getElementById('utilizationSection').style.display = 'none';
            document.getElementById('calculationResult').style.display = 'none';
        }

        function parseData() {
            if (!currentTeam) return;
            
            parsedDataGlobal = teamDatabase[currentTeam];
            
            // Show parsed structure
            document.getElementById('parsedSection').style.display = 'block';
            
            let parsedHTML = `
                <div class="stat-row">
                    <span class="stat-label">Team Name:</span>
                    <span class="stat-value">${parsedDataGlobal.team.name}</span>
                </div>
                <div class="stat-row">
                    <span class="stat-label">Sport:</span>
                    <span class="stat-value">${parsedDataGlobal.team.sport}</span>
                </div>
                <div class="stat-row">
                    <span class="stat-label">Stadium:</span>
                    <span class="stat-value">${parsedDataGlobal.team.stadium}</span>
                </div>
                <div class="stat-row">
                    <span class="stat-label">Season Record:</span>
                    <span class="stat-value">${parsedDataGlobal.season.wins}W - ${parsedDataGlobal.season.losses}L</span>
                </div>
                <div class="stat-row">
                    <span class="stat-label">Games in Dataset:</span>
                    <span class="stat-value">${parsedDataGlobal.games.length} games</span>
                </div>
            `;
            
            document.getElementById('parsedData').innerHTML = parsedHTML;
            document.getElementById('utilizationSection').style.display = 'block';
        }

        function calculateWinPercentage() {
            if (!parsedDataGlobal) return;
            
            const wins = parsedDataGlobal.season.wins;
            const total = parsedDataGlobal.season.gamesPlayed;
            const percentage = ((wins / total) * 100).toFixed(1);
            
            const resultBox = document.getElementById('calculationResult');
            resultBox.style.display = 'block';
            resultBox.innerHTML = `
                <h4>Win Percentage Calculation</h4>
                <div class="code-example"><span class="code-comment">// Accessing parsed data:</span>
<span class="code-keyword">const</span> wins = parsedData.season.wins;  <span class="code-comment">// ${wins}</span>
<span class="code-keyword">const</span> total = parsedData.season.gamesPlayed;  <span class="code-comment">// ${total}</span>
<span class="code-keyword">const</span> percentage = (wins / total) * <span class="code-number">100</span>;</div>
                <div class="calculation-result">
                    ${parsedDataGlobal.team.name} Win Percentage: ${percentage}%
                </div>
            `;
        }

        function calculateAveragePoints() {
            if (!parsedDataGlobal) return;
            
            const pointsKey = parsedDataGlobal.team.sport === 'Baseball' ? 'runs' : 
                            parsedDataGlobal.team.sport === 'Hockey' ? 'goals' : 'points';
            
            let total = 0;
            parsedDataGlobal.games.forEach(game => {
                total += game[pointsKey];
            });
            const average = (total / parsedDataGlobal.games.length).toFixed(1);
            
            const resultBox = document.getElementById('calculationResult');
            resultBox.style.display = 'block';
            resultBox.innerHTML = `
                <h4>Average ${pointsKey.charAt(0).toUpperCase() + pointsKey.slice(1)} Calculation</h4>
                <div class="code-example"><span class="code-comment">// Loop through games array:</span>
<span class="code-keyword">let</span> total = <span class="code-number">0</span>;
parsedData.games.<span class="code-keyword">forEach</span>(game => {
    total += game.${pointsKey};
});
<span class="code-keyword">const</span> average = total / parsedData.games.length;</div>
                <div class="calculation-result">
                    Average ${pointsKey.charAt(0).toUpperCase() + pointsKey.slice(1)} per Game: ${average}
                </div>
            `;
        }

        function getTotalAttendance() {
            if (!parsedDataGlobal) return;
            
            let total = 0;
            parsedDataGlobal.games.forEach(game => {
                total += game.attendance;
            });
            
            const resultBox = document.getElementById('calculationResult');
            resultBox.style.display = 'block';
            resultBox.innerHTML = `
                <h4>Total Attendance Calculation</h4>
                <div class="code-example"><span class="code-comment">// Sum attendance from all games:</span>
<span class="code-keyword">let</span> totalAttendance = <span class="code-number">0</span>;
parsedData.games.<span class="code-keyword">forEach</span>(game => {
    totalAttendance += game.attendance;
});
<span class="code-comment">// Result: ${total.toLocaleString()}</span></div>
                <div class="calculation-result">
                    Total Attendance (${parsedDataGlobal.games.length} games): ${total.toLocaleString()} fans
                </div>
            `;
        }

        // Initialize on page load
        window.addEventListener('DOMContentLoaded', initializeTeamButtons);
    </script>
</body>
</html>