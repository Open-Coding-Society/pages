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
            color: #333;
        }

        .container {
            max-width: 1400px;
            margin: 0 auto;
        }

        .header {
            background: linear-gradient(135deg, #552583 0%, #FDB927 100%);
            color: white;
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
            text-shadow: 3px 3px 6px rgba(0,0,0,0.3);
        }

        .header p {
            font-size: 1.4em;
            opacity: 0.95;
        }

        .step-badge {
            display: inline-block;
            background: rgba(255,255,255,0.25);
            padding: 12px 30px;
            border-radius: 30px;
            margin-top: 20px;
            font-size: 1.2em;
            font-weight: bold;
            border: 2px solid rgba(255,255,255,0.4);
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
            color: #552583;
            margin-bottom: 25px;
            font-size: 2.5em;
            display: flex;
            align-items: center;
            gap: 20px;
        }

        .concept-section p {
            color: #2c3e50;
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

        .data-sources-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(380px, 1fr));
            gap: 30px;
            margin-bottom: 40px;
        }

        .source-card {
            background: white;
            border-radius: 25px;
            overflow: hidden;
            box-shadow: 0 12px 35px rgba(0, 0, 0, 0.25);
            transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }

        .source-card:hover {
            transform: translateY(-12px) scale(1.02);
            box-shadow: 0 20px 50px rgba(0, 0, 0, 0.35);
        }

        .source-header {
            padding: 40px;
            text-align: center;
            color: white;
            font-size: 4em;
        }

        .database-header {
            background: linear-gradient(135deg, #3498db 0%, #2980b9 100%);
        }

        .json-header {
            background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%);
        }

        .live-header {
            background: linear-gradient(135deg, #2ecc71 0%, #27ae60 100%);
        }

        .source-body {
            padding: 35px;
        }

        .source-body h3 {
            color: #2c3e50;
            margin-bottom: 20px;
            font-size: 1.8em;
        }

        .source-body p {
            color: #555;
            line-height: 1.8;
            margin-bottom: 20px;
            font-size: 1.05em;
        }

        .example-box {
            background: #1e1e1e;
            color: #d4d4d4;
            padding: 20px;
            border-radius: 12px;
            margin: 20px 0;
            font-family: 'Courier New', monospace;
            font-size: 0.95em;
            overflow-x: auto;
            border: 2px solid #3498db;
        }

        .pros-cons {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 12px;
            margin-top: 20px;
        }

        .pro {
            background: #d5f4e6;
            padding: 12px 18px;
            border-radius: 10px;
            color: #27ae60;
            font-size: 0.95em;
            font-weight: 600;
        }

        .con {
            background: #fadbd8;
            padding: 12px 18px;
            border-radius: 10px;
            color: #e74c3c;
            font-size: 0.95em;
            font-weight: 600;
        }

        .la-teams-showcase {
            background: linear-gradient(135deg, #0f3460 0%, #16213e 100%);
            padding: 50px;
            border-radius: 25px;
            margin-bottom: 40px;
            box-shadow: 0 15px 50px rgba(0, 0, 0, 0.4);
            color: white;
        }

        .la-teams-showcase h2 {
            text-align: center;
            margin-bottom: 40px;
            font-size: 2.5em;
        }

        .teams-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 30px;
            margin-bottom: 40px;
        }

        .team-card {
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(10px);
            padding: 30px;
            border-radius: 20px;
            border: 2px solid rgba(255, 255, 255, 0.2);
            transition: all 0.3s;
        }

        .team-card:hover {
            background: rgba(255, 255, 255, 0.15);
            transform: scale(1.05);
        }

        .team-icon {
            font-size: 4em;
            text-align: center;
            margin-bottom: 20px;
        }

        .team-name {
            font-size: 1.8em;
            text-align: center;
            margin-bottom: 20px;
            font-weight: bold;
        }

        .team-stats {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 15px;
        }

        .stat-box {
            background: rgba(255, 255, 255, 0.1);
            padding: 15px;
            border-radius: 10px;
            text-align: center;
        }

        .stat-label {
            font-size: 0.9em;
            opacity: 0.8;
            margin-bottom: 8px;
        }

        .stat-value {
            font-size: 1.6em;
            font-weight: bold;
        }

        .data-structure-demo {
            background: white;
            padding: 50px;
            border-radius: 25px;
            margin-bottom: 40px;
            box-shadow: 0 12px 40px rgba(0, 0, 0, 0.25);
        }

        .data-structure-demo h2 {
            color: #552583;
            text-align: center;
            margin-bottom: 30px;
            font-size: 2.5em;
        }

        .data-structure-demo p {
            text-align: center;
            color: #555;
            margin-bottom: 30px;
            font-size: 1.15em;
        }

        .json-display {
            background: #1e1e1e;
            color: #d4d4d4;
            padding: 35px;
            border-radius: 15px;
            font-family: 'Courier New', monospace;
            font-size: 1em;
            overflow-x: auto;
            border: 3px solid #552583;
            line-height: 1.8;
        }

        .json-key { color: #9cdcfe; }
        .json-string { color: #ce9178; }
        .json-number { color: #b5cea8; }

        .interactive-coding {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 50px;
            border-radius: 25px;
            margin-bottom: 40px;
            box-shadow: 0 15px 50px rgba(118, 75, 162, 0.4);
            color: white;
        }

        .interactive-coding h2 {
            text-align: center;
            margin-bottom: 20px;
            font-size: 2.5em;
        }

        .interactive-coding > p {
            text-align: center;
            margin-bottom: 40px;
            font-size: 1.2em;
            opacity: 0.95;
        }

        .coding-workspace {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 30px;
            margin-top: 30px;
        }

        .code-editor {
            background: rgba(255, 255, 255, 0.1);
            border-radius: 15px;
            padding: 25px;
            backdrop-filter: blur(10px);
        }

        .code-editor h3 {
            margin-bottom: 20px;
            font-size: 1.5em;
        }

        .editor-header {
            background: rgba(0, 0, 0, 0.3);
            padding: 10px 15px;
            border-radius: 8px 8px 0 0;
            font-size: 0.9em;
            margin-bottom: 0;
        }

        #codeInput {
            width: 100%;
            min-height: 250px;
            background: #1e1e1e;
            color: #d4d4d4;
            border: none;
            border-radius: 0 0 8px 8px;
            padding: 20px;
            font-family: 'Courier New', monospace;
            font-size: 1em;
            resize: vertical;
            line-height: 1.6;
        }

        .run-button {
            background: #FDB927;
            color: #552583;
            border: none;
            padding: 15px 40px;
            border-radius: 30px;
            font-size: 1.2em;
            font-weight: bold;
            cursor: pointer;
            margin-top: 20px;
            transition: all 0.3s;
            box-shadow: 0 5px 15px rgba(253, 185, 39, 0.4);
        }

        .run-button:hover {
            transform: scale(1.05);
            box-shadow: 0 8px 25px rgba(253, 185, 39, 0.6);
        }

        .output-panel {
            background: rgba(255, 255, 255, 0.1);
            border-radius: 15px;
            padding: 25px;
            backdrop-filter: blur(10px);
        }

        .output-panel h3 {
            margin-bottom: 20px;
            font-size: 1.5em;
        }

        #output {
            background: #1e1e1e;
            color: #4af626;
            padding: 20px;
            border-radius: 8px;
            min-height: 300px;
            font-family: 'Courier New', monospace;
            font-size: 1em;
            line-height: 1.8;
            white-space: pre-wrap;
            word-wrap: break-word;
        }

        .hint-box {
            background: rgba(253, 185, 39, 0.2);
            border-left: 5px solid #FDB927;
            padding: 20px;
            border-radius: 10px;
            margin-top: 20px;
            color: white;
        }

        .hint-box h4 {
            margin-bottom: 10px;
            font-size: 1.2em;
        }

        .key-takeaways {
            background: linear-gradient(135deg, #552583 0%, #FDB927 100%);
            color: white;
            padding: 50px;
            border-radius: 25px;
            box-shadow: 0 15px 50px rgba(253, 185, 39, 0.4);
        }

        .key-takeaways h2 {
            text-align: center;
            margin-bottom: 30px;
            font-size: 2.5em;
        }

        .key-takeaways ul {
            line-height: 2.2;
            font-size: 1.15em;
        }

        .key-takeaways li {
            margin-bottom: 18px;
        }

        @media (max-width: 1000px) {
            .coding-workspace {
                grid-template-columns: 1fr;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🌟 Los Angeles Sports API</h1>
            <p>Building Your Backend Data Foundation</p>
            <div class="step-badge">📊 Step 2: Set Up the Data Source</div>
        </div>

        <div class="concept-section">
            <h2>📦 Step 2: Set Up the Data Source / Backend</h2>
            <p>Before your API can serve data to users, it needs somewhere to get that data from! This is like preparing a well-stocked library for your API to fetch information.</p>
            <ul>
                <li><strong>Decide where the API will get its data</strong> — database, CSV/JSON file, or live sports stats</li>
                <li><strong>Organize the data</strong> so it's easy for the API to access and retrieve quickly</li>
                <li><strong>Structure your data properly</strong> — use clear keys, consistent formatting, and logical organization</li>
                <li><strong>Choose the right storage method</strong> based on your project's size and requirements</li>
            </ul>
        </div>

        <div class="data-sources-grid">
            <div class="source-card">
                <div class="source-header database-header">🗄️</div>
                <div class="source-body">
                    <h3>Database Storage</h3>
                    <p>A structured system that stores large amounts of organized data. Perfect for complex queries and relationships between different data types.</p>
                    <div class="example-box">
SELECT team_name, stadium, capacity<br>
FROM la_sports_teams<br>
WHERE sport = 'Basketball'<br>
ORDER BY championships DESC;
                    </div>
                    <div class="pros-cons">
                        <div class="pro">✓ Lightning-fast queries</div>
                        <div class="con">✗ Requires setup time</div>
                        <div class="pro">✓ Handles massive data</div>
                        <div class="con">✗ More complex to learn</div>
                        <div class="pro">✓ Data relationships</div>
                        <div class="con">✗ Needs maintenance</div>
                    </div>
                </div>
            </div>

            <div class="source-card">
                <div class="source-header json-header">📄</div>
                <div class="source-body">
                    <h3>JSON/CSV Files</h3>
                    <p>Simple text files that store data in a readable format. Excellent for smaller datasets, prototypes, and getting started quickly.</p>
                    <div class="example-box">
{<br>
&nbsp;&nbsp;"team": "Lakers",<br>
&nbsp;&nbsp;"stadium": "Crypto.com Arena",<br>
&nbsp;&nbsp;"capacity": 19068,<br>
&nbsp;&nbsp;"championships": 17<br>
}
                    </div>
                    <div class="pros-cons">
                        <div class="pro">✓ Super easy to set up</div>
                        <div class="con">✗ Slower for big datasets</div>
                        <div class="pro">✓ Human-readable format</div>
                        <div class="con">✗ Limited query options</div>
                        <div class="pro">✓ No installation needed</div>
                        <div class="con">✗ Hard to scale up</div>
                    </div>
                </div>
            </div>

            <div class="source-card">
                <div class="source-header live-header">📡</div>
                <div class="source-body">
                    <h3>Live API Connections</h3>
                    <p>Connect to another API in real-time to get the freshest data. Your API becomes a middle layer that processes external data.</p>
                    <div class="example-box">
fetch('sports-api.com/teams/lakers')<br>
&nbsp;&nbsp;.then(response => response.json())<br>
&nbsp;&nbsp;.then(data => processData(data))<br>
&nbsp;&nbsp;.catch(error => console.error(error));
                    </div>
                    <div class="pros-cons">
                        <div class="pro">✓ Always up-to-date</div>
                        <div class="con">✗ Depends on external API</div>
                        <div class="pro">✓ No storage needed</div>
                        <div class="con">✗ Can have delays</div>
                        <div class="pro">✓ Real-time updates</div>
                        <div class="con">✗ May have rate limits</div>
                    </div>
                </div>
            </div>
        </div>

        <div class="la-teams-showcase">
            <h2>🏆 Los Angeles Sports Teams Data</h2>
            <div class="teams-grid">
                <div class="team-card">
                    <div class="team-icon">🏀</div>
                    <div class="team-name">Lakers</div>
                    <div class="team-stats">
                        <div class="stat-box">
                            <div class="stat-label">Stadium</div>
                            <div class="stat-value" style="font-size: 1em;">Crypto.com</div>
                        </div>
                        <div class="stat-box">
                            <div class="stat-label">Capacity</div>
                            <div class="stat-value">19,068</div>
                        </div>
                        <div class="stat-box">
                            <div class="stat-label">Founded</div>
                            <div class="stat-value">1947</div>
                        </div>
                        <div class="stat-box">
                            <div class="stat-label">Championships</div>
                            <div class="stat-value">17</div>
                        </div>
                    </div>
                </div>

                <div class="team-card">
                    <div class="team-icon">⚾</div>
                    <div class="team-name">Dodgers</div>
                    <div class="team-stats">
                        <div class="stat-box">
                            <div class="stat-label">Stadium</div>
                            <div class="stat-value" style="font-size: 0.9em;">Dodger Stadium</div>
                        </div>
                        <div class="stat-box">
                            <div class="stat-label">Capacity</div>
                            <div class="stat-value">56,000</div>
                        </div>
                        <div class="stat-box">
                            <div class="stat-label">Founded</div>
                            <div class="stat-value">1883</div>
                        </div>
                        <div class="stat-box">
                            <div class="stat-label">Championships</div>
                            <div class="stat-value">7</div>
                        </div>
                    </div>
                </div>

                <div class="team-card">
                    <div class="team-icon">🏈</div>
                    <div class="team-name">Rams</div>
                    <div class="team-stats">
                        <div class="stat-box">
                            <div class="stat-label">Stadium</div>
                            <div class="stat-value" style="font-size: 0.9em;">SoFi Stadium</div>
                        </div>
                        <div class="stat-box">
                            <div class="stat-label">Capacity</div>
                            <div class="stat-value">70,240</div>
                        </div>
                        <div class="stat-box">
                            <div class="stat-label">Founded</div>
                            <div class="stat-value">1936</div>
                        </div>
                        <div class="stat-box">
                            <div class="stat-label">Championships</div>
                            <div class="stat-value">2</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="data-structure-demo">
            <h2>📊 How LA Sports Data is Organized</h2>
            <p>This is how your API's data source might be structured as a JSON file. Each team has organized properties that the API can easily access:</p>
            <div class="json-display">
{<br>
&nbsp;&nbsp;<span class="json-key">"la_teams"</span>: [<br>
&nbsp;&nbsp;&nbsp;&nbsp;{<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="json-key">"id"</span>: <span class="json-number">1</span>,<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="json-key">"name"</span>: <span class="json-string">"Los Angeles Lakers"</span>,<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="json-key">"sport"</span>: <span class="json-string">"Basketball"</span>,<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="json-key">"stadium"</span>: <span class="json-string">"Crypto.com Arena"</span>,<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="json-key">"capacity"</span>: <span class="json-number">19068</span>,<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="json-key">"founded"</span>: <span class="json-number">1947</span>,<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="json-key">"championships"</span>: <span class="json-number">17</span><br>
&nbsp;&nbsp;&nbsp;&nbsp;},<br>
&nbsp;&nbsp;&nbsp;&nbsp;{<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="json-key">"id"</span>: <span class="json-number">2</span>,<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="json-key">"name"</span>: <span class="json-string">"Los Angeles Dodgers"</span>,<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="json-key">"sport"</span>: <span class="json-string">"Baseball"</span>,<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="json-key">"stadium"</span>: <span class="json-string">"Dodger Stadium"</span>,<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="json-key">"capacity"</span>: <span class="json-number">56000</span>,<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="json-key">"founded"</span>: <span class="json-number">1883</span>,<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="json-key">"championships"</span>: <span class="json-number">7</span><br>
&nbsp;&nbsp;&nbsp;&nbsp;},<br>
&nbsp;&nbsp;&nbsp;&nbsp;{<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="json-key">"id"</span>: <span class="json-number">3</span>,<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="json-key">"name"</span>: <span class="json-string">"Los Angeles Rams"</span>,<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="json-key">"sport"</span>: <span class="json-string">"Football"</span>,<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="json-key">"stadium"</span>: <span class="json-string">"SoFi Stadium"</span>,<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="json-key">"capacity"</span>: <span class="json-number">70240</span>,<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="json-key">"founded"</span>: <span class="json-number">1936</span>,<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="json-key">"championships"</span>: <span class="json-number">2</span><br>
&nbsp;&nbsp;&nbsp;&nbsp;}<br>
&nbsp;&nbsp;]<br>
}
            </div>
        </div>

        <div class="interactive-coding">
            <h2>💻 Interactive: Access the Data Source</h2>
            <p>Write code to retrieve data from the LA sports teams data source. Try accessing different teams and their stats!</p>
            
            <div class="coding-workspace">
                <div class="code-editor">
                    <h3>Code Editor</h3>
                    <div class="editor-header">JavaScript</div>
                    <textarea id="codeInput" placeholder="// Write your code here to access the data...
// Example:
// const lakers = laTeams[0];
// console.log(lakers.name);
// console.log(lakers.championships);"></textarea>
                    <button class="run-button" id="runButton">▶ Run Code</button>
                    
                    <div class="hint-box">
                        <h4>💡 Try these challenges:</h4>
                        • Access and display the Lakers' championship count<br>
                        • Find which stadium has the largest capacity<br>
                        • Calculate the total championships of all LA teams<br>
                        • Display all team names in a list
                    </div>
                </div>

                <div class="output-panel">
                    <h3>Output Console</h3>
                    <div id="output">Ready to run your code...

The 'laTeams' data is available for you to access!

Try: console.log(laTeams);</div>
                </div>
            </div>
        </div>

        <div class="key-takeaways">
            <h2>💡 Key Takeaways</h2>
            <ul>
                <li><strong>Data sources are the foundation</strong> of any API — without organized data, there's nothing to serve to users!</li>
                <li><strong>Three main storage types:</strong> Databases (powerful but complex), Files (simple but limited), Live APIs (current but dependent)</li>
                <li><strong>Organization matters</strong> — well-structured data with clear keys and consistent formatting makes your API fast and reliable</li>
                <li><strong>JSON is the standard</strong> — it's both human-readable and machine-friendly, making it perfect for APIs</li>
                <li><strong>Choose the right tool</strong> — small projects use files, large projects need databases, real-time needs require live connections</li>
                <li><strong>Think like a librarian</strong> — organize your data so it's easy to find, access, and understand</li>
            </ul>
        </div>
    </div>

    <script>
        const laTeams = [
            {
                id: 1,
                name: "Los Angeles Lakers",
                sport: "Basketball",
                stadium: "Crypto.com Arena",
                capacity: 19068,
                founded: 1947,
                championships: 17
            },
            {
                id: 2,
                name: "Los Angeles Dodgers",
                sport: "Baseball",
                stadium: "Dodger Stadium",
                capacity: 56000,
                founded: 1883,
                championships: 7
            },
            {
                id: 3,
                name: "Los Angeles Rams",
                sport: "Football",
                stadium: "SoFi Stadium",
                capacity: 70240,
                founded: 1936,
                championships: 2
            }
        ];

        function runCode() {
            const code = document.getElementById('codeInput').value;
            const output = document.getElementById('output');
            output.textContent = '';

            // Create a custom console.log
            const logs = [];
            const customConsole = {
                log: function(...args) {
                    logs.push(args.map(arg => {
                        if (typeof arg === 'object') {
                            return JSON.stringify(arg, null, 2);
                        }
                        return String(arg);
                    }).join(' '));
                }
            };

            try {
                // Create a function with the user's code
                const userFunction = new Function('laTeams', 'console', code);
                userFunction(laTeams, customConsole);
                
                if (logs.length > 0) {
                    output.textContent = logs.join('\n');
                } else {
                    output.textContent = 'Code executed successfully! (No output)\n\nTip: Use console.log() to see results.';
                }
            } catch (error) {
                output.textContent = '❌ Error: ' + error.message + '\n\nCheck your code and try again!';
                output.style.color = '#ff6b6b';
                setTimeout(() => {
                    output.style.color = '#4af626';
                }, 3000);
            }
        }
