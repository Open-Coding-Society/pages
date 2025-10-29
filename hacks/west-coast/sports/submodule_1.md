---
layout: post
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
---

# Submodule 1

<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>San Diego Sports API Demo</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 20px;
            min-height: 100vh;
        }

        .container {
            max-width: 900px;
            margin: 0 auto;
            background: white;
            border-radius: 20px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            overflow: hidden;
        }

        .header {
            background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
            color: white;
            padding: 30px;
            text-align: center;
        }

        .header h1 {
            font-size: 2.2em;
            margin-bottom: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
        }

        .header p {
            opacity: 0.9;
            font-size: 1.1em;
        }

        .concept-box {
            background: #f8f9fa;
            padding: 25px;
            border-left: 5px solid #667eea;
            margin: 25px;
            border-radius: 8px;
        }

        .concept-box h2 {
            color: #2c3e50 !important;
            margin-bottom: 10px;
            font-weight: 600;
        }

        .concept-box p {
            color: #2c3e50 !important;
            line-height: 1.6;
            font-weight: 500;
        }

        .concept-box p strong {
            color: #2c3e50 !important;
        }

        .api-section {
            padding: 30px;
        }

        .api-section h2 {
            color: #2c3e50 !important;
        }

        .endpoint-card {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white !important;
            padding: 20px;
            border-radius: 12px;
            margin-bottom: 20px;
            cursor: pointer;
            transition: transform 0.3s, box-shadow 0.3s;
        }

        .endpoint-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 30px rgba(102, 126, 234, 0.4);
        }

        .endpoint-card h3 {
            font-size: 1.4em;
            margin-bottom: 10px;
            display: flex;
            align-items: center;
            gap: 10px;
            color: #ffffff !important;
            font-weight: 600;
        }

        .endpoint-path {
            background: rgba(255, 255, 255, 0.2);
            padding: 8px 15px;
            border-radius: 6px;
            font-family: 'Courier New', monospace;
            margin: 10px 0;
            font-size: 0.95em;
            color: #ffffff !important;
            font-weight: 500;
        }

        .endpoint-card p {
            color: #ffffff !important;
            opacity: 0.95;
        }

        .response-area {
            background: #2c3e50;
            color: #00ff00;
            padding: 20px;
            border-radius: 8px;
            margin-top: 15px;
            font-family: 'Courier New', monospace;
            font-size: 0.9em;
            white-space: pre-wrap;
            max-height: 300px;
            overflow-y: auto;
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

        .key-learning {
            background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
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

        .stadium-icon {
            display: inline-block;
            font-size: 1.5em;
        }

        .btn {
            background: white;
            color: #667eea;
            border: none;
            padding: 10px 20px;
            border-radius: 6px;
            cursor: pointer;
            font-weight: bold;
            margin-top: 10px;
            transition: all 0.3s;
        }

        .btn:hover {
            background: #f0f0f0;
            transform: scale(1.05);
        }

        .info-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 15px;
            margin-top: 15px;
        }

        .info-item {
            background: rgba(255, 255, 255, 0.1);
            padding: 12px;
            border-radius: 6px;
        }

        .info-label {
            font-size: 0.85em;
            opacity: 0.8;
            margin-bottom: 5px;
        }

        .info-value {
            font-size: 1.2em;
            font-weight: bold;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1><span class="stadium-icon">⚾</span> Stop 1: San Diego — "Connecting to the Data Field"</h1>
            <p>Petco Park (Baseball – Padres) & Snapdragon Stadium (Soccer – SDFC)</p>
        </div>

        <div class="concept-box">
            <h2>🎯 Coding Concept: Making APIs (Part 1)</h2>
            <p><strong>Define</strong> the Purpose / Endpoints — Decide what the API does and what data it provides. Endpoints are like "doors" to access different types of data.</p>
        </div>

        <div class="api-section">
            <h2 style="color: #2c3e50; margin-bottom: 20px;">API Endpoints - Click to Try!</h2>

            <div class="endpoint-card" onclick="callEndpoint('petco')">
                <h3>⚾ Petco Park Info</h3>
                <div class="endpoint-path">GET /api/getStadiumInfo?venue=petco</div>
                <p>Returns detailed information about Petco Park including capacity, team, and location.</p>
                <button class="btn">🔍 Fetch Data</button>
                <div id="response-petco" class="response-area"></div>
            </div>

            <div class="endpoint-card" onclick="callEndpoint('snapdragon')">
                <h3>⚽ Snapdragon Stadium Info</h3>
                <div class="endpoint-path">GET /api/getStadiumInfo?venue=snapdragon</div>
                <p>Returns detailed information about Snapdragon Stadium including capacity, team, and location.</p>
                <button class="btn">🔍 Fetch Data</button>
                <div id="response-snapdragon" class="response-area"></div>
            </div>

            <div class="endpoint-card" onclick="callEndpoint('all')">
                <h3>📊 All San Diego Venues</h3>
                <div class="endpoint-path">GET /api/getAllVenues?city=sandiego</div>
                <p>Returns a list of all sports venues in San Diego with summary information.</p>
                <button class="btn">🔍 Fetch Data</button>
                <div id="response-all" class="response-area"></div>
            </div>
        </div>

        <div class="key-learning">
            <h3>💡 Key Learning</h3>
            <p>APIs are like scouts — they know exactly where to find stats and bring back only the data you ask for through specific "doors" called endpoints.</p>
        </div>
    </div>

    <script>
        const stadiumData = {
            petco: {
                name: "Petco Park",
                sport: "Baseball",
                team: "San Diego Padres",
                capacity: 40209,
                location: "Downtown San Diego",
                opened: 2004,
                surface: "Grass",
                nickname: "The Park at the Park"
            },
            snapdragon: {
                name: "Snapdragon Stadium",
                sport: "Soccer",
                team: "San Diego FC",
                capacity: 35000,
                location: "San Diego State University",
                opened: 2022,
                surface: "Grass",
                nickname: "The Dragon's Lair"
            }
        };

        function callEndpoint(type) {
            let response;
            let responseDiv;

            if (type === 'petco') {
                responseDiv = document.getElementById('response-petco');
                response = {
                    status: 200,
                    message: "Success",
                    data: stadiumData.petco
                };
            } else if (type === 'snapdragon') {
                responseDiv = document.getElementById('response-snapdragon');
                response = {
                    status: 200,
                    message: "Success",
                    data: stadiumData.snapdragon
                };
            } else if (type === 'all') {
                responseDiv = document.getElementById('response-all');
                response = {
                    status: 200,
                    message: "Success",
                    data: {
                        city: "San Diego",
                        total_venues: 2,
                        venues: [stadiumData.petco, stadiumData.snapdragon]
                    }
                };
            }

            responseDiv.textContent = JSON.stringify(response, null, 2);
            responseDiv.classList.add('active');

            setTimeout(() => {
                responseDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }, 100);
        }
    </script>
</body>
</html>