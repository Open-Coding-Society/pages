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
---

# Submodule 3

<style>
    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }

    body {
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
        padding: 20px;
        min-height: 100vh;
    }

    .container {
        max-width: 1400px;
        margin: 0 auto;
    }

    .header {
        background: linear-gradient(135deg, #0a1929 0%, #1e3a5f 100%);
        color: white;
        padding: 40px;
        text-align: center;
        border-radius: 20px;
        margin-bottom: 30px;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.4);
    }

    .header h1 {
        font-size: 2.5em;
        margin-bottom: 10px;
    }

    .header p {
        font-size: 1.2em;
        opacity: 0.9;
    }

    .concept-box {
        background: white;
        padding: 30px;
        border-radius: 15px;
        margin-bottom: 30px;
        box-shadow: 0 5px 20px rgba(0, 0, 0, 0.3);
        border-left: 6px solid #FDB927;
    }

    .concept-box h2 {
        color: #2c3e50 !important;
        margin-bottom: 20px;
        font-size: 1.8em;
    }

    .concept-box .concept-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 20px;
        margin-top: 20px;
    }

    .concept-item {
        background: #f8f9fa;
        padding: 20px;
        border-radius: 10px;
        border-left: 4px solid #3498db;
    }

    .concept-item h3 {
        color: #2c3e50 !important;
        margin-bottom: 10px;
        font-size: 1.2em;
    }

    .concept-item p {
        color: #555 !important;
        line-height: 1.6;
    }

    .api-demo-section {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 30px;
        margin-bottom: 30px;
    }

    .api-panel {
        background: white;
        border-radius: 15px;
        overflow: hidden;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
    }

    .panel-header {
        background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
        color: white;
        padding: 25px;
        text-align: center;
    }

    .panel-header h2 {
        font-size: 1.8em;
        margin-bottom: 10px;
    }

    .panel-body {
        padding: 30px;
    }

    .code-block {
        background: #2c3e50;
        color: #00ff00;
        padding: 20px;
        border-radius: 10px;
        font-family: 'Courier New', monospace;
        font-size: 0.9em;
        white-space: pre-wrap;
        margin-bottom: 20px;
        max-height: 400px;
        overflow-y: auto;
    }

    .code-comment {
        color: #95a5a6;
    }

    .code-keyword {
        color: #e74c3c;
    }

    .code-string {
        color: #f39c12;
    }

    .code-function {
        color: #3498db;
    }

    .api-call-btn {
        background: linear-gradient(135deg, #3498db 0%, #2980b9 100%);
        color: white;
        border: none;
        padding: 15px 30px;
        border-radius: 10px;
        cursor: pointer;
        font-size: 1.1em;
        font-weight: bold;
        width: 100%;
        margin-bottom: 20px;
        transition: all 0.3s;
        box-shadow: 0 5px 15px rgba(52, 152, 219, 0.3);
    }

    .api-call-btn:hover {
        transform: translateY(-3px);
        box-shadow: 0 8px 20px rgba(52, 152, 219, 0.4);
    }

    .response-area {
        background: #f8f9fa;
        padding: 20px;
        border-radius: 10px;
        border: 2px solid #ddd;
        min-height: 150px;
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

    .response-header {
        color: #27ae60 !important;
        font-weight: bold;
        margin-bottom: 10px;
        font-size: 1.1em;
    }

    .json-display {
        background: white;
        padding: 15px;
        border-radius: 8px;
        font-family: 'Courier New', monospace;
        font-size: 0.9em;
        color: #2c3e50;
        white-space: pre-wrap;
    }

    .stadium-cards {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
        gap: 30px;
        margin-bottom: 30px;
    }

    .stadium-card {
        background: white;
        border-radius: 20px;
        overflow: hidden;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        transition: transform 0.3s;
    }

    .stadium-card:hover {
        transform: translateY(-10px);
    }

    .warriors-header {
        background: linear-gradient(135deg, #1D428A 0%, #FDB927 100%);
        padding: 30px;
        text-align: center;
        color: white;
    }

    .niners-header {
        background: linear-gradient(135deg, #AA0000 0%, #B3995D 100%);
        padding: 30px;
        text-align: center;
        color: white;
    }

    .stadium-card h2 {
        font-size: 2em;
        margin-bottom: 10px;
    }

    .stadium-body {
        padding: 30px;
    }

    .warriors-card .stadium-body {
        background: linear-gradient(to bottom, rgba(29, 66, 138, 0.05) 0%, white 100%);
    }

    .niners-card .stadium-body {
        background: linear-gradient(to bottom, rgba(170, 0, 0, 0.05) 0%, white 100%);
    }

    .stat-row {
        display: flex;
        justify-content: space-between;
        padding: 15px;
        border-bottom: 1px solid #ecf0f1;
        background: white;
        margin-bottom: 5px;
        border-radius: 8px;
    }

    .stat-row:last-child {
        border-bottom: none;
    }

    .warriors-card .stat-label {
        font-weight: bold;
        color: #1D428A;
    }

    .warriors-card .stat-value {
        color: #FDB927;
        font-weight: bold;
        font-size: 1.1em;
    }

    .niners-card .stat-label {
        font-weight: bold;
        color: #AA0000;
    }

    .niners-card .stat-value {
        color: #B3995D;
        font-weight: bold;
        font-size: 1.1em;
    }

    .data-interpretation {
        background: white;
        padding: 40px;
        border-radius: 20px;
        margin-bottom: 30px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
    }

    .data-interpretation h2 {
        color: #2c3e50 !important;
        margin-bottom: 25px;
        font-size: 2em;
        text-align: center;
    }

    .insight-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 20px;
        margin-top: 20px;
    }

    .insight-card {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 25px;
        border-radius: 15px;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
    }

    .insight-card h3 {
        margin-bottom: 15px;
        font-size: 1.3em;
    }

    .insight-card p {
        line-height: 1.6;
        opacity: 0.95;
    }

    .lessons-learned {
        background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
        color: white;
        padding: 40px;
        border-radius: 20px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
    }

    .lessons-learned h2 {
        text-align: center;
        margin-bottom: 25px;
        font-size: 2em;
    }

    .lessons-learned ul {
        line-height: 2;
        font-size: 1.1em;
        list-style: none;
    }

    .lessons-learned li {
        margin-bottom: 15px;
        padding-left: 30px;
        position: relative;
    }

    .lessons-learned li:before {
        content: "✓";
        position: absolute;
        left: 0;
        font-weight: bold;
        font-size: 1.2em;
    }

    .chart-container {
        background: white;
        padding: 30px;
        border-radius: 15px;
        margin-bottom: 30px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
    }

    .chart-container h2 {
        color: #2c3e50 !important;
        text-align: center;
        margin-bottom: 20px;
    }

    @media (max-width: 1024px) {
        .api-demo-section {
            grid-template-columns: 1fr;
        }
    }
</style>

<div class="container">
    <div class="header">
        <h1> Step 3: Create / Call the API</h1>
        <p>San Francisco Bay Area - Chase Center & Levi's Stadium</p>
    </div>

    <div class="concept-box">
        <h2> Key Concepts</h2>
        <div class="concept-grid">
            <div class="concept-item">
                <h3> Making the API</h3>
                <p>Write code to handle requests, pull data, and return it (usually in JSON format)</p>
            </div>
            <div class="concept-item">
                <h3> Calling the API</h3>
                <p>Use another program or code to request data from the API</p>
            </div>
            <div class="concept-item">
                <h3> Data Collection</h3>
                <p>Gathering real-world sports stadium data from Chase Center (Basketball) and Levi's Stadium (Football)</p>
            </div>
        </div>
    </div>

    <div class="api-demo-section">
        <div class="api-panel">
            <div class="panel-header">
                <h2>1️ Creating the API</h2>
                <p>Backend Code - Handling Requests</p>
            </div>
            <div class="panel-body">
                <div class="code-block"><span class="code-comment">// API Backend Code (Python/Flask)</span>

<span class="code-keyword">from</span> flask <span class="code-keyword">import</span> Flask, jsonify

app = Flask(__name__)

<span class="code-comment"># Stadium database</span>
stadiums = {
    <span class="code-string">"chase_center"</span>: {
        <span class="code-string">"name"</span>: <span class="code-string">"Chase Center"</span>,
        <span class="code-string">"team"</span>: <span class="code-string">"Golden State Warriors"</span>,
        <span class="code-string">"sport"</span>: <span class="code-string">"Basketball"</span>,
        <span class="code-string">"capacity"</span>: 18064,
        <span class="code-string">"opened"</span>: 2019,
        <span class="code-string">"location"</span>: <span class="code-string">"San Francisco"</span>,
        <span class="code-string">"championships"</span>: 7
    },
    <span class="code-string">"levis_stadium"</span>: {
        <span class="code-string">"name"</span>: <span class="code-string">"Levi's Stadium"</span>,
        <span class="code-string">"team"</span>: <span class="code-string">"San Francisco 49ers"</span>,
        <span class="code-string">"sport"</span>: <span class="code-string">"Football"</span>,
        <span class="code-string">"capacity"</span>: 68500,
        <span class="code-string">"opened"</span>: 2014,
        <span class="code-string">"location"</span>: <span class="code-string">"Santa Clara"</span>,
        <span class="code-string">"championships"</span>: 5
    }
}

<span class="code-comment"># API Endpoint</span>
@app.route(<span class="code-string">'/api/stadium/&lt;stadium_id&gt;'</span>)
<span class="code-keyword">def</span> <span class="code-function">get_stadium</span>(stadium_id):
    <span class="code-keyword">if</span> stadium_id <span class="code-keyword">in</span> stadiums:
        <span class="code-keyword">return</span> jsonify(stadiums[stadium_id])
    <span class="code-keyword">else</span>:
        <span class="code-keyword">return</span> jsonify({<span class="code-string">"error"</span>: <span class="code-string">"Not found"</span>}), 404</div>
            </div>
        </div>

        <div class="api-panel">
            <div class="panel-header">
                <h2> Calling the API</h2>
                <p>Frontend Code - Requesting Data</p>
            </div>
            <div class="panel-body">
                <div class="code-block"><span class="code-comment">// JavaScript - Calling the API</span>

<span class="code-keyword">async function</span> <span class="code-function">fetchStadiumData</span>(stadiumId) {
    <span class="code-keyword">try</span> {
        <span class="code-comment">// Make API request</span>
        <span class="code-keyword">const</span> response = <span class="code-keyword">await</span> fetch(
            <span class="code-string">`/api/stadium/${stadiumId}`</span>
        );
        
        <span class="code-comment">// Parse JSON response</span>
        <span class="code-keyword">const</span> data = <span class="code-keyword">await</span> response.json();
        
        <span class="code-comment">// Display the data</span>
        console.log(data);
        <span class="code-keyword">return</span> data;
        
    } <span class="code-keyword">catch</span> (error) {
        console.error(<span class="code-string">"Error:"</span>, error);
    }
}

<span class="code-comment">// Example usage:</span>
<span class="code-function">fetchStadiumData</span>(<span class="code-string">'chase_center'</span>);
<span class="code-function">fetchStadiumData</span>(<span class="code-string">'levis_stadium'</span>);</div>
            </div>
        </div>
    </div>

    <div class="api-panel" style="margin-bottom: 30px;">
        <div class="panel-header">
            <h2> Try It Live - Call the API!</h2>
            <p>Click the buttons to simulate API calls</p>
        </div>
        <div class="panel-body">
            <button class="api-call-btn" onclick="callAPI('chase_center')">
                 GET /api/stadium/chase_center
            </button>
            <div id="chase-response" class="response-area"></div>

            <button class="api-call-btn" onclick="callAPI('levis_stadium')">
                 GET /api/stadium/levis_stadium
            </button>
            <div id="levis-response" class="response-area"></div>
        </div>
    </div>

    <div class="stadium-cards">
        <div class="stadium-card warriors-card">
            <div class="warriors-header">
                <h2> Chase Center</h2>
                <p>Home of the Golden State Warriors</p>
            </div>
            <div class="stadium-body">
                <div class="stat-row">
                    <span class="stat-label">Capacity</span>
                    <span class="stat-value">18,064</span>
                </div>
                <div class="stat-row">
                    <span class="stat-label">Opened</span>
                    <span class="stat-value">2019</span>
                </div>
                <div class="stat-row">
                    <span class="stat-label">Location</span>
                    <span class="stat-value">San Francisco, CA</span>
                </div>
                <div class="stat-row">
                    <span class="stat-label">Sport</span>
                    <span class="stat-value">Basketball (NBA)</span>
                </div>
                <div class="stat-row">
                    <span class="stat-label">Championships</span>
                    <span class="stat-value">7 Titles</span>
                </div>
                <div class="stat-row">
                    <span class="stat-label">Cost</span>
                    <span class="stat-value">$1.4 Billion</span>
                </div>
            </div>
        </div>

        <div class="stadium-card niners-card">
            <div class="niners-header">
                <h2> Levi's Stadium</h2>
                <p>Home of the San Francisco 49ers</p>
            </div>
            <div class="stadium-body">
                <div class="stat-row">
                    <span class="stat-label">Capacity</span>
                    <span class="stat-value">68,500</span>
                </div>
                <div class="stat-row">
                    <span class="stat-label">Opened</span>
                    <span class="stat-value">2014</span>
                </div>
                <div class="stat-row">
                    <span class="stat-label">Location</span>
                    <span class="stat-value">Santa Clara, CA</span>
                </div>
                <div class="stat-row">
                    <span class="stat-label">Sport</span>
                    <span class="stat-value">Football (NFL)</span>
                </div>
                <div class="stat-row">
                    <span class="stat-label">Championships</span>
                    <span class="stat-value">5 Super Bowls</span>
                </div>
                <div class="stat-row">
                    <span class="stat-label">Cost</span>
                    <span class="stat-value">$1.3 Billion</span>
                </div>
            </div>
        </div>
    </div>

    <div class="chart-container">
        <h2> Stadium Comparison Chart</h2>
        <canvas id="comparisonChart"></canvas>
    </div>

    <div class="data-interpretation">
        <h2> Data Interpretation & Conclusions</h2>
        <div class="insight-grid">
            <div class="insight-card">
                <h3> Capacity Difference</h3>
                <p>Levi's Stadium holds 68,500 fans compared to Chase Center's 18,064. Football stadiums are typically 3-4x larger than basketball arenas due to field size and outdoor vs indoor design.</p>
            </div>
            <div class="insight-card">
                <h3> Similar Investment</h3>
                <p>Both venues cost over $1 billion to build, showing that modern sports facilities require massive investment regardless of sport or size.</p>
            </div>
            <div class="insight-card">
                <h3> Championship Legacy</h3>
                <p>The Warriors (7) and 49ers (5) are both historic franchises. The data shows these new stadiums continue a winning tradition.</p>
            </div>
            <div class="insight-card">
                <h3> Recent Construction</h3>
                <p>Both stadiums opened in the 2010s, featuring cutting-edge technology, sustainability features, and modern fan experiences.</p>
            </div>
            <div class="insight-card">
                <h3> Bay Area Location</h3>
                <p>Chase Center is in San Francisco proper while Levi's is in Santa Clara, showing how teams balance urban vs suburban locations.</p>
            </div>
            <div class="insight-card">
                <h3> API Use Case</h3>
                <p>This demonstrates how APIs can collect, organize, and present sports data in a structured format that's easy to analyze and compare.</p>
            </div>
        </div>
    </div>

    <div class="lessons-learned">
        <h2>💡 Lessons Learned</h2>
        <ul>
            <li>How APIs work and can be used in the real world to collect data</li>
            <li>How to create APIs that handle requests and return structured JSON data</li>
            <li>How to call APIs using JavaScript fetch requests</li>
            <li>How to interpret collected data by comparing statistics and finding patterns</li>
            <li>How to make conclusions from collected data through analysis and visualization</li>
            <li>Understanding the difference between creating (backend) and calling (frontend) APIs</li>
        </ul>
    </div>
</div>

<script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/3.9.1/chart.min.js"></script>
<script>
    const stadiumData = {
        chase_center: {
            name: "Chase Center",
            team: "Golden State Warriors",
            sport: "Basketball",
            capacity: 18064,
            opened: 2019,
            location: "San Francisco, CA",
            championships: 7,
            cost: "$1.4 Billion"
        },
        levis_stadium: {
            name: "Levi's Stadium",
            team: "San Francisco 49ers",
            sport: "Football",
            capacity: 68500,
            opened: 2014,
            location: "Santa Clara, CA",
            championships: 5,
            cost: "$1.3 Billion"
        }
    };

    function callAPI(stadiumId) {
        const responseDiv = document.getElementById(`${stadiumId === 'chase_center' ? 'chase' : 'levis'}-response`);
        
        setTimeout(() => {
            const data = stadiumData[stadiumId];
            const response = {
                status: 200,
                message: "Success",
                data: data
            };

            responseDiv.innerHTML = `
                <div class="response-header">✓ API Response (200 OK)</div>
                <div class="json-display">${JSON.stringify(response, null, 2)}</div>
            `;
            responseDiv.classList.add('active');
            
            responseDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 500);
    }

    const ctx = document.getElementById('comparisonChart').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Capacity', 'Year Opened', 'Championships'],
            datasets: [
                {
                    label: 'Chase Center',
                    data: [18064, 2019, 7],
                    backgroundColor: 'rgba(29, 66, 138, 0.8)',
                    borderColor: 'rgba(29, 66, 138, 1)',
                    borderWidth: 2
                },
                {
                    label: "Levi's Stadium",
                    data: [68500, 2014, 5],
                    backgroundColor: 'rgba(170, 0, 0, 0.8)',
                    borderColor: 'rgba(170, 0, 0, 1)',
                    borderWidth: 2
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: true,
                    position: 'top'
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
</script>
