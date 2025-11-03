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
    <title>Seattle Sports API Explorer</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: #1a1a2e;
            min-height: 100vh;
            padding: 20px;
            color: #ffffff;
            transition: background-color 0.3s ease;
        }



        .container {
            max-width: 1200px;
            margin: 0 auto;
        }
        
        header {
            text-align: center;
            padding: 30px 0;
            background: #16213e;
            border-radius: 15px;
            margin-bottom: 30px;
            box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
        }



        h1 {
            font-size: 2.5em;
            color: #0ea5e9;
            margin-bottom: 10px;
        }

        .subtitle {
            color: #94a3b8;
            font-size: 1.1em;
        }



        .learning-section {
            background: #16213e;
            padding: 25px;
            border-radius: 12px;
            margin-bottom: 20px;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        }



        .learning-section h2 {
            color: #0ea5e9;
            margin-bottom: 15px;
            font-size: 1.8em;
        }

        .learning-section p, .learning-section li {
            color: #e2e8f0;
            line-height: 1.6;
            margin-bottom: 10px;
        }

        .learning-section ul {
            margin-left: 20px;
            margin-top: 10px;
        }

        .code-editor {
            background: #0f172a;
            color: #e2e8f0;
            padding: 20px;
            border-radius: 8px;
            font-family: 'Courier New', monospace;
            margin: 15px 0;
            overflow-x: auto;
            border: 2px solid #0ea5e9;
        }



        .button-group {
            display: flex;
            gap: 10px;
            flex-wrap: wrap;
            margin: 15px 0;
        }

        button {
            background: #0ea5e9;
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 8px;
            cursor: pointer;
            font-size: 1em;
            font-weight: bold;
            transition: all 0.3s ease;
        }

        button:hover {
            background: #0284c7;
            transform: translateY(-2px);
        }

        .output {
            background: #0f172a;
            border: 2px solid #0ea5e9;
            border-radius: 8px;
            padding: 20px;
            margin-top: 15px;
            color: #e2e8f0;
            min-height: 100px;
            font-family: monospace;
            white-space: pre-wrap;
        }



        .stadium-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            gap: 20px;
            margin-top: 20px;
        }

        .stadium-card {
            background: #1e293b;
            padding: 20px;
            border-radius: 12px;
            cursor: pointer;
            transition: all 0.3s ease;
            border: 2px solid #334155;
        }



        .stadium-card:hover {
            transform: translateY(-5px);
            border-color: #0ea5e9;
        }

        .stadium-card h3 {
            color: #0ea5e9;
            margin-bottom: 10px;
            font-size: 1.4em;
        }

        .stadium-card p {
            color: #94a3b8;
            margin: 8px 0;
        }



        .input-group {
            margin: 15px 0;
        }

        .input-group label {
            display: block;
            color: #94a3b8;
            margin-bottom: 8px;
            font-weight: 600;
        }



        input[type="text"], select {
            width: 100%;
            max-width: 400px;
            padding: 12px;
            border-radius: 8px;
            border: 2px solid #334155;
            background: #1e293b;
            color: #e2e8f0;
            font-size: 1em;
        }

        body.light-mode input[type="text"],
        body.light-mode select {
            background: #ffffff;
            color: #000000;
            border-color: #cbd5e1;
        }

        .info-box {
            background: rgba(14, 165, 233, 0.1);
            border-left: 4px solid #0ea5e9;
            padding: 15px;
            margin: 15px 0;
            border-radius: 5px;
        }

        .info-box p {
            color: #e2e8f0;
            margin: 5px 0;
        }

        body.light-mode .info-box p {
            color: #000000;
        }

        .step-number {
            display: inline-block;
            background: #0ea5e9;
            color: white;
            width: 30px;
            height: 30px;
            border-radius: 50%;
            text-align: center;
            line-height: 30px;
            margin-right: 10px;
            font-weight: bold;
        }

        strong {
            color: #0ea5e9;
        }

        body.light-mode strong {
            color: #0284c7;
        }
    </style>
</head>
<body>
    <button class="theme-toggle" onclick="toggleTheme()">Toggle Light/Dark Mode</button>

    <div class="container">
        <header>
            <h1>Seattle Sports API Tour</h1>
            <p class="subtitle">Understanding APIs Through the Coach and Team Analogy</p>
        </header>

        <div class="learning-section">
            <h2>Welcome to the API Playbook</h2>
            <p><strong>The Coach and Team Analogy:</strong></p>
            <ul>
                <li><strong>The Coach (You):</strong> Decides what information is needed</li>
                <li><strong>The Playbook (Database):</strong> Contains all available plays and data</li>
                <li><strong>The Play (User Input):</strong> Your specific request for data</li>
                <li><strong>The Team (API):</strong> Executes the play and retrieves the data</li>
                <li><strong>The Response:</strong> The data returned to the coach</li>
            </ul>
        </div>

        <div class="learning-section">
            <h2><span class="step-number">1</span>The Coach Selects a Stadium</h2>
            <p>First, you (the coach) need to decide which stadium you want information about. Click on any stadium card below:</p>
            <div class="stadium-grid" id="stadiumGrid">
                <!-- Stadium cards will be dynamically inserted here -->
            </div>
        </div>

        <div class="learning-section">
            <h2><span class="step-number">2</span>The Coach Calls the Play</h2>
            <p>Now that you've selected a stadium, choose what information you want (the play you're calling):</p>
            <div class="input-group">
                <label>Select the play from the playbook:</label>
                <select id="playSelect" onchange="updatePlay()">
                    <option value="">Choose a play...</option>
                    <option value="basic">Get Basic Info</option>
                    <option value="capacity">Get Stadium Capacity</option>
                    <option value="tickets">Get Ticket Prices</option>
                    <option value="location">Get Location</option>
                </select>
            </div>
            <div class="info-box">
                <p><strong>The API Request (Your Play Call):</strong></p>
                <div class="code-editor" id="apiRequest">Select a stadium and play above to see the API request</div>
            </div>
        </div>

        <div class="learning-section">
            <h2><span class="step-number">3</span>The Team Executes</h2>
            <p>The API (team) processes your request and retrieves the data from the database (playbook):</p>
            <div class="info-box">
                <p><strong>The API Response (Team's Execution):</strong></p>
                <div class="output" id="apiResponse">The team's response will appear here after you select a stadium and play</div>
            </div>
        </div>

        <div class="learning-section">
            <h2>Understanding API Endpoints</h2>
            <p>APIs have different endpoints (different types of plays in the playbook). Each endpoint serves a specific purpose:</p>
            
            <div class="info-box">
                <p><strong>GET /stadiums/:sport</strong></p>
                <p>Retrieves information about a specific stadium by sport type</p>
            </div>

            <div class="info-box">
                <p><strong>GET /schedules</strong></p>
                <p>Retrieves game schedules for all Seattle teams</p>
            </div>

            <div class="info-box">
                <p><strong>GET /weather</strong></p>
                <p>Retrieves current weather conditions in Seattle</p>
            </div>

            <div class="info-box">
                <p><strong>GET /tickets</strong></p>
                <p>Retrieves ticket pricing information for all teams</p>
            </div>

            <p style="margin-top: 20px;">Try calling these different plays:</p>
            <div class="button-group">
                <button onclick="callEndpoint('schedules')">Get Schedules</button>
                <button onclick="callEndpoint('weather')">Get Weather</button>
                <button onclick="callEndpoint('tickets')">Get Tickets</button>
            </div>
            <div class="output" id="endpointOutput"></div>
        </div>

        <div class="learning-section">
            <h2>How the Playbook (Database) Works</h2>
            <p>The playbook stores all the data that the API can access. Here's a simplified view:</p>
            <div class="code-editor">const playbook = {
  football: {
    team: "Seahawks",
    stadium: "Lumen Field",
    capacity: 68740,
    location: "47.5952° N, 122.3316° W",
    tickets: "$85-$250"
  },
  baseball: {
    team: "Mariners",
    stadium: "T-Mobile Park",
    capacity: 47929,
    location: "47.5914° N, 122.3325° W",
    tickets: "$15-$180"
  }
  // ... more data
}</div>
            <p style="margin-top: 15px;">When you call a play, the API looks up the information in this playbook and returns it to you.</p>
        </div>
    </div>

    <script>
        let selectedSport = null;

        const playbook = {
            football: { 
                team: "Seahawks", 
                stadium: "Lumen Field", 
                capacity: 68740,
                location: "47.5952° N, 122.3316° W",
                tickets: "$85-$250",
                sportKey: "Football - Seahawks"
            },
            baseball: { 
                team: "Mariners", 
                stadium: "T-Mobile Park", 
                capacity: 47929,
                location: "47.5914° N, 122.3325° W",
                tickets: "$15-$180",
                sportKey: "Baseball - Mariners"
            },
            hockey: { 
                team: "Kraken", 
                stadium: "Climate Pledge Arena", 
                capacity: 17151,
                location: "47.6221° N, 122.3540° W",
                tickets: "$50-$300",
                sportKey: "Ice Hockey - Kraken"
            },
            college: { 
                team: "Huskies", 
                stadium: "Husky Stadium", 
                capacity: 70138,
                location: "47.6501° N, 122.3016° W",
                tickets: "$35-$150",
                sportKey: "College Football - Huskies"
            },
            cricket: { 
                team: "Orcas", 
                stadium: "Marymoor Park", 
                capacity: 5000,
                location: "47.6634° N, 122.1146° W",
                tickets: "$10-$40",
                sportKey: "Cricket - Orcas"
            }
        };

        // Load user's selected sports from itinerary
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

        // Map sport names to playbook keys
        function mapSportToKey(sportName) {
            const sportMap = {
                'Football - Seahawks': 'football',
                'Baseball - Mariners': 'baseball',
                'Ice Hockey - Kraken': 'hockey',
                'College Football - Huskies': 'college',
                'Cricket - Orcas': 'cricket'
            };
            return sportMap[sportName];
        }

        // Initialize stadium grid with user's selected sports
        function initializeStadiums() {
            const stadiumGrid = document.getElementById('stadiumGrid');
            const userSports = loadUserSports();
            
            if (userSports && userSports.length > 0) {
                // Show only user's selected sports
                userSports.forEach(sportName => {
                    const sportKey = mapSportToKey(sportName);
                    if (sportKey && playbook[sportKey]) {
                        const sport = playbook[sportKey];
                        const card = document.createElement('div');
                        card.className = 'stadium-card';
                        card.onclick = () => selectStadium(sportKey);
                        card.innerHTML = `
                            <h3>${sport.stadium}</h3>
                            <p><strong>Team:</strong> ${sport.team}</p>
                            <p><strong>Sport:</strong> ${sportName}</p>
                        `;
                        stadiumGrid.appendChild(card);
                    }
                });
            } else {
                // Fallback: show all stadiums if no itinerary found
                Object.keys(playbook).forEach(key => {
                    const sport = playbook[key];
                    const card = document.createElement('div');
                    card.className = 'stadium-card';
                    card.onclick = () => selectStadium(key);
                    card.innerHTML = `
                        <h3>${sport.stadium}</h3>
                        <p><strong>Team:</strong> ${sport.team}</p>
                        <p><strong>Sport:</strong> ${sport.sportKey}</p>
                    `;
                    stadiumGrid.appendChild(card);
                });
            }
        }

        function toggleTheme() {
            document.body.classList.toggle('light-mode');
        }

        function selectStadium(sport) {
            selectedSport = sport;
            document.getElementById('playSelect').value = '';
            document.getElementById('apiRequest').textContent = 'Stadium selected: ' + playbook[sport].stadium + '\nNow select a play from the dropdown above.';
            document.getElementById('apiResponse').textContent = 'Waiting for you to call a play...';
        }

        function updatePlay() {
            const play = document.getElementById('playSelect').value;
            if (!selectedSport) {
                alert('Please select a stadium first!');
                return;
            }

            const team = playbook[selectedSport];
            let request = 'GET /api/stadiums/' + selectedSport;
            let response = '';

            if (play === 'basic') {
                request += '/info';
                response = JSON.stringify({
                    team: team.team,
                    stadium: team.stadium
                }, null, 2);
            } else if (play === 'capacity') {
                request += '/capacity';
                response = JSON.stringify({
                    stadium: team.stadium,
                    capacity: team.capacity
                }, null, 2);
            } else if (play === 'tickets') {
                request += '/tickets';
                response = JSON.stringify({
                    team: team.team,
                    priceRange: team.tickets
                }, null, 2);
            } else if (play === 'location') {
                request += '/location';
                response = JSON.stringify({
                    stadium: team.stadium,
                    coordinates: team.location
                }, null, 2);
            }

            document.getElementById('apiRequest').textContent = 'Coach calls the play:\n\n' + request + '\nHost: api.seattlesports.com';
            document.getElementById('apiResponse').textContent = 'Team executes and returns:\n\n' + response;
        }

        function callEndpoint(endpoint) {
            const output = document.getElementById('endpointOutput');
            output.textContent = 'Calling play: GET /api/' + endpoint + '\n\nTeam is executing...\n';
            
            setTimeout(() => {
                let response = '';
                const userSports = loadUserSports();
                
                if (endpoint === 'schedules') {
                    const scheduleData = {
                        "Seahawks": ["vs 49ers - Nov 3", "@ Rams - Nov 10"],
                        "Mariners": ["Season starts March 2026"],
                        "Kraken": ["vs Canucks - Nov 5", "@ Flames - Nov 7"],
                        "Huskies": ["vs Oregon - Nov 8", "@ Stanford - Nov 15"],
                        "Orcas": ["vs Mumbai Indians - Nov 4", "vs Delhi Capitals - Nov 6"]
                    };
                    
                    if (userSports && userSports.length > 0) {
                        const filteredSchedules = {};
                        userSports.forEach(sportName => {
                            const sportKey = mapSportToKey(sportName);
                            if (sportKey && playbook[sportKey]) {
                                const team = playbook[sportKey].team;
                                if (scheduleData[team]) {
                                    filteredSchedules[team] = scheduleData[team];
                                }
                            }
                        });
                        response = JSON.stringify(filteredSchedules, null, 2);
                    } else {
                        response = JSON.stringify(scheduleData, null, 2);
                    }
                } else if (endpoint === 'weather') {
                    response = JSON.stringify({
                        "location": "Seattle, WA",
                        "temperature": "54°F",
                        "conditions": "Partly Cloudy",
                        "precipitation": "20%"
                    }, null, 2);
                } else if (endpoint === 'tickets') {
                    const ticketData = {
                        "Seahawks": "$85-$250",
                        "Mariners": "$15-$180",
                        "Kraken": "$50-$300",
                        "Huskies": "$35-$150",
                        "Orcas": "$10-$40"
                    };
                    
                    if (userSports && userSports.length > 0) {
                        const filteredTickets = {};
                        userSports.forEach(sportName => {
                            const sportKey = mapSportToKey(sportName);
                            if (sportKey && playbook[sportKey]) {
                                const team = playbook[sportKey].team;
                                if (ticketData[team]) {
                                    filteredTickets[team] = ticketData[team];
                                }
                            }
                        });
                        response = JSON.stringify(filteredTickets, null, 2);
                    } else {
                        response = JSON.stringify(ticketData, null, 2);
                    }
                }
                output.textContent = 'Team\'s response:\n\n' + response;
            }, 800);
        }

        // Initialize stadiums on page load
        initializeStadiums();
    </script>
</body>
</html>