---
layout: opencs
title: "San Francisco"
description: "Submodule 3 of Backend Development Mini-Quest"
permalink: /west-coast/backend/submodule_3/
parent: "Backend Development"
team: "Zombies"
submodule: 3
categories: [CSP, Submodule, Backend]
tags: [backend, submodule, zombies]
author: "Zombies Team"
date: 2025-10-21
microblog: True
footer:
  previous: /west-coast/backend/submodule_2/
  home: /west-coast/sports/
  next: /west-coast/backend/submodule_4/
---
 
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>San Francisco - Sending Requests & Receiving Responses</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: #f5f5f5;
            color: #333;
            padding: 20px;
            line-height: 1.6;
        }

        .container {
            max-width: 1000px;
            margin: 0 auto;
        }

        .header {
            background: linear-gradient(135deg, #AA0000 0%, #B3995D 100%);
            color: white;
            padding: 40px;
            border-radius: 15px;
            text-align: center;
            margin-bottom: 30px;
            box-shadow: 0 10px 30px rgba(170, 0, 0, 0.2);
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
            background: white;
            padding: 30px;
            border-radius: 15px;
            margin-bottom: 25px;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
        }

        .section h2 {
            color: #AA0000;
            margin-bottom: 20px;
            font-size: 1.8em;
            border-bottom: 3px solid #B3995D;
            padding-bottom: 10px;
        }

        .step-number {
            display: inline-block;
            background: #AA0000;
            color: white;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            text-align: center;
            line-height: 40px;
            font-weight: bold;
            margin-right: 15px;
            font-size: 1.2em;
        }

        .explanation {
            background: #f8f9fa;
            padding: 20px;
            border-radius: 10px;
            border-left: 5px solid #B3995D;
            margin: 20px 0;
        }

        .explanation h3 {
            color: #AA0000;
            margin-bottom: 10px;
            font-size: 1.2em;
        }

        .explanation p {
            color: #555;
            line-height: 1.8;
        }

        .stadium-cards {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            margin: 20px 0;
        }

        .stadium-card {
            background: linear-gradient(135deg, #fff 0%, #f8f9fa 100%);
            padding: 20px;
            border-radius: 10px;
            border: 3px solid #dee2e6;
            transition: all 0.3s;
        }

        .stadium-card:hover {
            border-color: #B3995D;
            transform: translateY(-5px);
            box-shadow: 0 5px 20px rgba(0, 0, 0, 0.15);
        }

        .stadium-card h3 {
            color: #AA0000;
            margin-bottom: 10px;
            font-size: 1.3em;
        }

        .stadium-card .info {
            color: #000;
            margin: 5px 0;
        }

        .interactive-box {
            background: #f8f9fa;
            padding: 25px;
            border-radius: 10px;
            margin: 20px 0;
            border: 2px dashed #B3995D;
        }

        .interactive-box h3 {
            color: #AA0000;
            margin-bottom: 15px;
        }

        .url-builder {
            margin: 20px 0;
        }

        .url-part {
            margin-bottom: 15px;
        }

        .url-part label {
            display: block;
            font-weight: bold;
            color: #AA0000;
            margin-bottom: 5px;
        }

        .url-part select {
            width: 100%;
            padding: 12px;
            border: 2px solid #dee2e6;
            border-radius: 8px;
            font-size: 1em;
        }

        .url-part select:focus {
            outline: none;
            border-color: #B3995D;
        }

        .constructed-url {
            background: #2c3e50;
            color: #00ff00;
            padding: 20px;
            border-radius: 10px;
            font-family: 'Courier New', monospace;
            font-size: 0.95em;
            word-break: break-all;
            margin-top: 15px;
            min-height: 60px;
        }

        .call-btn {
            background: #B3995D;
            color: white;
            border: none;
            padding: 15px 40px;
            border-radius: 8px;
            font-weight: bold;
            cursor: pointer;
            font-size: 1.1em;
            width: 100%;
            margin-top: 15px;
            transition: all 0.3s;
        }

        .call-btn:hover:not(:disabled) {
            background: #9d864f;
            transform: scale(1.02);
        }

        .call-btn:disabled {
            background: #ccc;
            cursor: not-allowed;
        }

        .response-area {
            margin-top: 20px;
            display: none;
        }

        .response-area.active {
            display: block;
            animation: slideIn 0.3s ease-out;
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

        .loading {
            text-align: center;
            padding: 30px;
            color: #AA0000;
            font-weight: bold;
        }

        .spinner {
            border: 4px solid #f3f3f3;
            border-top: 4px solid #AA0000;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            animation: spin 1s linear infinite;
            margin: 0 auto 15px;
        }

        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }

        .http-flow {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin: 30px 0;
            padding: 20px;
            background: white;
            border-radius: 10px;
            border: 2px solid #dee2e6;
        }

        .flow-item {
            text-align: center;
            flex: 1;
        }

        .flow-icon {
            font-size: 3em;
            margin-bottom: 10px;
        }

        .flow-label {
            font-weight: bold;
            color: #AA0000;
            margin-bottom: 5px;
        }

        .flow-arrow {
            font-size: 2em;
            color: #B3995D;
            margin: 0 10px;
        }

        .status-code-box {
            background: #2c3e50;
            color: white;
            padding: 20px;
            border-radius: 10px;
            margin: 20px 0;
            font-family: 'Courier New', monospace;
        }

        .status-success {
            color: #00ff00;
            font-size: 1.5em;
            font-weight: bold;
        }

        .status-error {
            color: #ff6b6b;
            font-size: 1.5em;
            font-weight: bold;
        }

        .json-display {
            background: #2c3e50;
            color: #00ff00;
            padding: 20px;
            border-radius: 8px;
            font-family: 'Courier New', monospace;
            font-size: 0.9em;
            white-space: pre-wrap;
            max-height: 300px;
            overflow-y: auto;
            margin: 15px 0;
        }

        .parsed-data {
            background: white;
            border: 3px solid #B3995D;
            border-radius: 10px;
            padding: 20px;
            margin-top: 15px;
        }

        .data-row {
            display: flex;
            justify-content: space-between;
            padding: 12px;
            background: #f8f9fa;
            border-radius: 6px;
            margin-bottom: 10px;
        }

        .data-label {
            font-weight: bold;
            color: #AA0000;
        }

        .data-value {
            color: #333;
            font-family: 'Courier New', monospace;
        }

        .success-message {
            background: #d4edda;
            border: 2px solid #28a745;
            padding: 15px;
            border-radius: 8px;
            color: #155724;
            margin: 15px 0;
        }

        .code-block {
            background: #2c3e50;
            color: #00ff00;
            padding: 20px;
            border-radius: 10px;
            font-family: 'Courier New', monospace;
            margin: 15px 0;
            overflow-x: auto;
        }

        .code-comment {
            color: #7f8c8d;
        }

        .key-takeaway {
            background: linear-gradient(135deg, #AA0000 0%, #B3995D 100%);
            color: white;
            padding: 30px;
            border-radius: 12px;
            text-align: center;
            font-size: 1.2em;
            line-height: 1.8;
            box-shadow: 0 10px 30px rgba(170, 0, 0, 0.2);
        }

        .highlight {
            background: rgba(255, 255, 255, 0.2);
            padding: 3px 8px;
            border-radius: 4px;
            font-weight: bold;
        }

        @media (max-width: 768px) {
            .stadium-cards {
                grid-template-columns: 1fr;
            }
            .http-flow {
                flex-direction: column;
            }
            .flow-arrow {
                transform: rotate(90deg);
                margin: 10px 0;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🚀 Stop 3: San Francisco</h1>
            <p>Sending Requests & Receiving Responses</p>
        </div>

        <div class="section">
            <h2>Meet Your San Francisco Sports Teams</h2>
            <div class="stadium-cards" id="stadium-cards"></div>
        </div>

        <div class="section">
            <h2><span class="step-number">1</span> Understanding HTTP Communication</h2>
            <div class="explanation">
                <h3>How Computers Talk to Each Other</h3>
                <p>When you want stadium data, your computer (the client) needs to communicate with the server that stores the information. This happens through HTTP (Hypertext Transfer Protocol) - the language computers use to request and send data over the internet.</p>
            </div>

            <div class="http-flow">
                <div class="flow-item">
                    <div class="flow-icon">💻</div>
                    <div class="flow-label">Your Computer</div>
                    <div style="color: #666; font-size: 0.9em;">Sends HTTP Request</div>
                </div>
                <div class="flow-arrow">→</div>
                <div class="flow-item">
                    <div class="flow-icon">🌐</div>
                    <div class="flow-label">Server</div>
                    <div style="color: #666; font-size: 0.9em;">Processes Request</div>
                </div>
                <div class="flow-arrow">→</div>
                <div class="flow-item">
                    <div class="flow-icon">📦</div>
                    <div class="flow-label">Response</div>
                    <div style="color: #666; font-size: 0.9em;">Returns Data</div>
                </div>
            </div>

            <div class="explanation">
                <h3>HTTP GET Request</h3>
                <p>A GET request is like asking the server a question: "Can I please have information about this stadium?" The server then looks up the information and sends it back to you.</p>
            </div>
        </div>

        <div class="section">
            <h2><span class="step-number">2</span> Using HTTP Client Libraries</h2>
            <div class="explanation">
                <h3>What Are HTTP Client Libraries?</h3>
                <p>HTTP client libraries are tools that make it easy to send requests and receive responses. Instead of writing complicated code, you can use simple functions like Python's <code>requests</code> library or JavaScript's <code>fetch()</code> function.</p>
            </div>

            <div class="interactive-box">
                <h3>📚 Example Code:</h3>
                <p style="color: #666; margin-bottom: 15px;"><strong>Python Example:</strong></p>
                <div class="code-block">
import requests<br><br>
<span class="code-comment"># Send GET request to API</span><br>
response = requests.get('https://api.sfsports.com/v1/stadium/levis_stadium')<br><br>
<span class="code-comment"># Check if request was successful</span><br>
if response.status_code == 200:<br>
&nbsp;&nbsp;&nbsp;&nbsp;data = response.json()  <span class="code-comment"># Convert JSON to Python dictionary</span><br>
&nbsp;&nbsp;&nbsp;&nbsp;print(data)
                </div>

                <p style="color: #666; margin: 20px 0 15px 0;"><strong>JavaScript Example:</strong></p>
                <div class="code-block">
<span class="code-comment">// Send GET request to API</span><br>
fetch('https://api.sfsports.com/v1/stadium/levis_stadium')<br>
&nbsp;&nbsp;.then(response => response.json())  <span class="code-comment">// Parse JSON</span><br>
&nbsp;&nbsp;.then(data => console.log(data))    <span class="code-comment">// Use the data</span><br>
&nbsp;&nbsp;.catch(error => console.error(error));
                </div>
            </div>
        </div>

        <div class="section">
            <h2><span class="step-number">3</span> Send a Request & See the Response</h2>
            <div class="explanation">
                <h3>Try It Yourself!</h3>
                <p>Select a stadium below and click "Send Request" to see how your computer communicates with the server. Watch for the HTTP status code and the JSON response!</p>
            </div>

            <div class="interactive-box">
                <div class="url-builder">
                    <div class="url-part">
                        <label>Select a stadium to request data:</label>
                        <select id="stadiumSelect" onchange="updateURL()">
                            <option value="">-- Choose a stadium --</option>
                        </select>
                    </div>
                    <div class="constructed-url" id="constructedURL">
                        Select a stadium above to see the request URL...
                    </div>
                </div>
            </div>

            <button class="call-btn" id="sendBtn" onclick="sendRequest()" disabled>
                🚀 Send HTTP GET Request
            </button>

            <div id="responseArea" class="response-area"></div>
        </div>

        <div class="section">
            <h2><span class="step-number">4</span> Understanding HTTP Status Codes</h2>
            <div class="explanation">
                <h3>What Are Status Codes?</h3>
                <p>Every HTTP response includes a status code that tells you whether the request was successful or if something went wrong. Here are the most common ones:</p>
            </div>

            <div class="stadium-cards">
                <div class="stadium-card">
                    <h3 style="color: #28a745;">✅ 200 OK</h3>
                    <div class="info">Success! The server found the data and is sending it to you.</div>
                </div>
                <div class="stadium-card">
                    <h3 style="color: #ffc107;">⚠️ 404 Not Found</h3>
                    <div class="info">The server couldn't find what you requested. Check your URL!</div>
                </div>
                <div class="stadium-card">
                    <h3 style="color: #dc3545;">🔒 401 Unauthorized</h3>
                    <div class="info">You don't have permission. Did you include your API key?</div>
                </div>
                <div class="stadium-card">
                    <h3 style="color: #6c757d;">⚙️ 500 Server Error</h3>
                    <div class="info">Something went wrong on the server's end. Try again later.</div>
                </div>
            </div>
        </div>

        <div class="key-takeaway">
            <p>🎯 <span class="highlight">What You Learned:</span> Sending an HTTP request is the physical act of communicating with a server. You use HTTP client libraries (like <code>requests</code> or <code>fetch</code>) to send GET requests. The server responds with a <span class="highlight">status code</span> (like 200 OK) and the requested data in <span class="highlight">JSON format</span>!</p>
        </div>
    </div>

    <script>
        // COMPLETE SF TEAMS DATABASE
        const COMPLETE_SF_TEAMS = {
            "Football - 49ers": {
                id: "levis_stadium",
                name: "Levi's Stadium",
                team: "San Francisco 49ers",
                sport: "Football - 49ers",
                capacity: 68500,
                opened: 2014,
                location: "Santa Clara, CA",
                championships: 5,
                cost: "$1.3 Billion",
                icon: "🏈"
            },
            "Basketball - Warriors": {
                id: "chase_center",
                name: "Chase Center",
                team: "Golden State Warriors",
                sport: "Basketball - Warriors",
                capacity: 18064,
                opened: 2019,
                location: "San Francisco, CA",
                championships: 7,
                cost: "$1.4 Billion",
                icon: "🏀"
            },
            "Baseball - Giants": {
                id: "oracle_park",
                name: "Oracle Park",
                team: "San Francisco Giants",
                sport: "Baseball - Giants",
                capacity: 41915,
                opened: 2000,
                location: "San Francisco, CA",
                championships: 8,
                cost: "$357 Million",
                icon: "⚾"
            },
            "Ice Hockey - Sharks": {
                id: "sap_center",
                name: "SAP Center",
                team: "San Jose Sharks",
                sport: "Ice Hockey - Sharks",
                capacity: 17562,
                opened: 1993,
                location: "San Jose, CA",
                championships: 0,
                cost: "$162 Million",
                icon: "🏒"
            },
            "Baseball - A's": {
                id: "oakland_coliseum",
                name: "Oakland Coliseum",
                team: "Oakland Athletics",
                sport: "Baseball - A's",
                capacity: 46847,
                opened: 1966,
                location: "Oakland, CA",
                championships: 9,
                cost: "$25.5 Million",
                icon: "⚾"
            }
        };

        let stadiumData = {};
        let userSports = [];
        let selectedStadium = null;

        function loadUserItinerary() {
            try {
                const itinerary = JSON.parse(localStorage.getItem('westCoastItinerary'));
                if (itinerary && itinerary.cities && itinerary.cities['San Francisco'] && 
                    itinerary.cities['San Francisco'].sports) {
                    userSports = itinerary.cities['San Francisco'].sports;
                    
                    // Map user sports to stadium data
                    userSports.forEach(sport => {
                        const teamData = COMPLETE_SF_TEAMS[sport.name];
                        if (teamData) {
                            stadiumData[teamData.id] = teamData;
                        }
                    });
                    
                    if (Object.keys(stadiumData).length === 2) {
                        displayUserStadiums();
                        populateStadiumSelect();
                    } else {
                        displayDefaultStadiums();
                    }
                } else {
                    displayDefaultStadiums();
                }
            } catch (error) {
                console.error('Error loading itinerary:', error);
                displayDefaultStadiums();
            }
        }

        function displayUserStadiums() {
            const container = document.getElementById('stadium-cards');
            let html = '';

            Object.values(stadiumData).forEach(stadium => {
                html += `
                    <div class="stadium-card">
                        <h3>${stadium.icon} ${stadium.name}</h3>
                        <div class="info"><strong>Team:</strong> ${stadium.team}</div>
                        <div class="info"><strong>Capacity:</strong> ${stadium.capacity.toLocaleString()} fans</div>
                        <div class="info"><strong>Opened:</strong> ${stadium.opened}</div>
                        <div class="info"><strong>Championships:</strong> ${stadium.championships}</div>
                    </div>
                `;
            });

            container.innerHTML = html;
        }

        function populateStadiumSelect() {
            const select = document.getElementById('stadiumSelect');
            select.innerHTML = '<option value="">-- Choose a stadium --</option>';
            
            Object.values(stadiumData).forEach(stadium => {
                select.innerHTML += `<option value="${stadium.id}">${stadium.icon} ${stadium.name} (${stadium.team})</option>`;
            });
        }

        function displayDefaultStadiums() {
            stadiumData = {
                chase_center: COMPLETE_SF_TEAMS["Basketball - Warriors"],
                levis_stadium: COMPLETE_SF_TEAMS["Football - 49ers"]
            };
            displayUserStadiums();
            populateStadiumSelect();
        }

        function updateURL() {
            const stadium = document.getElementById('stadiumSelect').value;
            selectedStadium = stadium;
            
            if (!stadium) {
                document.getElementById('constructedURL').textContent = 'Select a stadium above to see the request URL...';
                document.getElementById('sendBtn').disabled = true;
                return;
            }
            
            let url = `https://api.sfsports.com/v1/stadium/${stadium}?format=json`;
            document.getElementById('constructedURL').textContent = url;
            document.getElementById('sendBtn').disabled = false;
        }

        function sendRequest() {
            const responseArea = document.getElementById('responseArea');
            responseArea.classList.add('active');
            
            responseArea.innerHTML = `
                <div class="loading">
                    <div class="spinner"></div>
                    <p>Sending request to server...</p>
                </div>
            `;
            
            setTimeout(() => {
                const data = stadiumData[selectedStadium];
                const response = {
                    status: 200,
                    message: "Success",
                    timestamp: new Date().toISOString(),
                    data: data
                };
                
                responseArea.innerHTML = `
                    <div class="success-message">
                        ✅ <strong>Request Successful!</strong> The server found the data and sent it back.
                    </div>
                    <h3 style="color: #AA0000; margin: 20px 0 10px 0;">📥 Raw JSON Response:</h3>
                    <div class="json-display">${JSON.stringify(response, null, 2)}</div>
                    <h3 style="color: #AA0000; margin: 20px 0 10px 0;">📊 Parsed Data (Easy to Read):</h3>
                    <div class="parsed-data">
                        <div class="data-row">
                            <span class="data-label">Stadium Name:</span>
                            <span class="data-value">${data.name}</span>
                        </div>
                        <div class="data-row">
                            <span class="data-label">Team:</span>
                            <span class="data-value">${data.team}</span>
                        </div>
                        <div class="data-row">
                            <span class="data-label">Sport:</span>
                            <span class="data-value">${data.sport}</span>
                        </div>
                        <div class="data-row">
                            <span class="data-label">Capacity:</span>
                            <span class="data-value">${data.capacity.toLocaleString()} fans</span>
                        </div>
                        <div class="data-row">
                            <span class="data-label">Opened:</span>
                            <span class="data-value">${data.opened}</span>
                        </div>
                        <div class="data-row">
                            <span class="data-label">Championships:</span>
                            <span class="data-value">${data.championships}</span>
                        </div>
                        <div class="data-row">
                            <span class="data-label">Cost to Build:</span>
                            <span class="data-value">${data.cost}</span>
                        </div>
                    </div>
                    <div class="explanation" style="margin-top: 20px;">
                        <h3>💡 What Just Happened?</h3>
                        <p>The server received your request, looked up ${data.name} in its database, and sent back all the information as JSON. Your browser then converted (parsed) that JSON into a readable format!</p>
                    </div>
                `;
                
                responseArea.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }, 1500);
        }

        // Load user's itinerary on page load
        document.addEventListener('DOMContentLoaded', function() {
            loadUserItinerary();
        });
    </script>
</body>
</html>