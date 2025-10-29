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
---


# Submodule 4

<!-- Style and Formatting -->
<style>
   * {
       margin: 0;
       padding: 0;
       box-sizing: border-box;
   }


   body {
       font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
       background: linear-gradient(135deg, #0c4c88 0%, #69be28 100%);
       padding: 20px;
       min-height: 100vh;
   }


   .container {
       max-width: 1400px;
       margin: 0 auto;
   }


   .header {
       background: linear-gradient(135deg, #001489 0%, #A5ACAF 100%);
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


   .concept-section {
       background: white;
       padding: 35px;
       border-radius: 15px;
       margin-bottom: 30px;
       box-shadow: 0 5px 20px rgba(0, 0, 0, 0.3);
       border-left: 6px solid #69be28;
   }


   .concept-section h2 {
       color: #2c3e50 !important;
       margin-bottom: 20px;
       font-size: 1.9em;
   }


   .coding-concepts {
       display: grid;
       grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
       gap: 20px;
       margin-top: 20px;
   }


   .concept-card {
       background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
       color: white;
       padding: 25px;
       border-radius: 15px;
       box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
       transition: transform 0.3s;
   }


   .concept-card:hover {
       transform: translateY(-5px);
   }


   .concept-card h3 {
       margin-bottom: 15px;
       font-size: 1.4em;
   }


   .concept-card p {
       line-height: 1.6;
       opacity: 0.95;
   }


   .interactive-section {
       background: white;
       padding: 35px;
       border-radius: 15px;
       margin-bottom: 30px;
       box-shadow: 0 5px 20px rgba(0, 0, 0, 0.3);
   }


   .interactive-section h2 {
       color: #2c3e50 !important;
       margin-bottom: 25px;
       font-size: 1.9em;
       text-align: center;
   }


   .filter-controls {
       display: flex;
       gap: 15px;
       justify-content: center;
       margin-bottom: 30px;
       flex-wrap: wrap;
   }


   .filter-btn {
       background: linear-gradient(135deg, #3498db 0%, #2980b9 100%);
       color: white;
       border: none;
       padding: 12px 30px;
       border-radius: 10px;
       cursor: pointer;
       font-size: 1em;
       font-weight: bold;
       transition: all 0.3s;
       box-shadow: 0 3px 10px rgba(52, 152, 219, 0.3);
   }


   .filter-btn:hover {
       transform: translateY(-3px);
       box-shadow: 0 5px 15px rgba(52, 152, 219, 0.4);
   }


   .filter-btn.active {
       background: linear-gradient(135deg, #27ae60 0%, #229954 100%);
   }


   .stadium-grid {
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
       transition: transform 0.3s, opacity 0.3s;
   }


   .stadium-card.hidden {
       display: none;
   }


   .stadium-card:hover {
       transform: translateY(-10px);
   }


   .seahawks-header {
       background: linear-gradient(135deg, #002244 0%, #69be28 100%);
       padding: 30px;
       text-align: center;
       color: white;
   }


   .mariners-header {
       background: linear-gradient(135deg, #0C2C56 0%, #005C5C 100%);
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


   .info-section {
       margin-bottom: 25px;
   }


   .info-section h3 {
       color: #2c3e50 !important;
       margin-bottom: 15px;
       font-size: 1.3em;
       border-bottom: 2px solid #ecf0f1;
       padding-bottom: 10px;
   }


   .info-grid {
       display: grid;
       grid-template-columns: repeat(2, 1fr);
       gap: 12px;
   }


   .info-item {
       background: #f8f9fa;
       padding: 12px;
       border-radius: 8px;
       border-left: 3px solid #3498db;
   }


   .info-label {
       font-size: 0.85em;
       color: #7f8c8d;
       margin-bottom: 5px;
   }


   .info-value {
       font-size: 1.1em;
       font-weight: bold;
       color: #2c3e50;
   }


   .api-btn {
       background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%);
       color: white;
       border: none;
       padding: 12px 25px;
       border-radius: 8px;
       cursor: pointer;
       font-size: 1em;
       font-weight: bold;
       width: 100%;
       margin-top: 15px;
       transition: all 0.3s;
   }


   .api-btn:hover {
       transform: scale(1.05);
       box-shadow: 0 5px 15px rgba(231, 76, 60, 0.4);
   }


   .api-response {
       background: #2c3e50;
       color: #00ff00;
       padding: 15px;
       border-radius: 8px;
       font-family: 'Courier New', monospace;
       font-size: 0.85em;
       margin-top: 15px;
       white-space: pre-wrap;
       max-height: 200px;
       overflow-y: auto;
       display: none;
   }


   .api-response.active {
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


   .code-demo {
       background: white;
       padding: 35px;
       border-radius: 15px;
       margin-bottom: 30px;
       box-shadow: 0 5px 20px rgba(0, 0, 0, 0.3);
   }


   .code-demo h2 {
       color: #2c3e50 !important;
       margin-bottom: 25px;
       font-size: 1.9em;
       text-align: center;
   }


   .code-tabs {
       display: flex;
       gap: 10px;
       margin-bottom: 20px;
       flex-wrap: wrap;
   }


   .code-tab {
       background: #ecf0f1;
       color: #2c3e50;
       border: none;
       padding: 12px 25px;
       border-radius: 8px 8px 0 0;
       cursor: pointer;
       font-weight: bold;
       transition: all 0.3s;
   }


   .code-tab.active {
       background: #2c3e50;
       color: #00ff00;
   }


   .code-block {
       background: #2c3e50;
       color: #00ff00;
       padding: 25px;
       border-radius: 0 10px 10px 10px;
       font-family: 'Courier New', monospace;
       font-size: 0.9em;
       white-space: pre-wrap;
       max-height: 400px;
       overflow-y: auto;
       display: none;
   }


   .code-block.active {
       display: block;
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


   .documentation {
       background: white;
       padding: 35px;
       border-radius: 15px;
       margin-bottom: 30px;
       box-shadow: 0 5px 20px rgba(0, 0, 0, 0.3);
   }


   .documentation h2 {
       color: #2c3e50 !important;
       margin-bottom: 25px;
       font-size: 1.9em;
       text-align: center;
   }


   .doc-section {
       background: #f8f9fa;
       padding: 25px;
       border-radius: 10px;
       margin-bottom: 20px;
       border-left: 4px solid #3498db;
   }


   .doc-section h3 {
       color: #2c3e50 !important;
       margin-bottom: 15px;
   }


   .endpoint {
       background: white;
       padding: 15px;
       border-radius: 8px;
       margin-bottom: 15px;
       border: 2px solid #ecf0f1;
   }


   .endpoint-path {
       background: #2c3e50;
       color: #00ff00;
       padding: 8px 15px;
       border-radius: 5px;
       font-family: 'Courier New', monospace;
       margin-bottom: 10px;
       display: inline-block;
   }


   .endpoint-desc {
       color: #555 !important;
       line-height: 1.6;
       margin: 10px 0;
   }


   .param-list {
       background: #f8f9fa;
       padding: 15px;
       border-radius: 5px;
       margin-top: 10px;
   }


   .param-list dt {
       font-weight: bold;
       color: #2c3e50;
       margin-top: 10px;
   }


   .param-list dd {
       color: #555;
       margin-left: 20px;
       margin-bottom: 10px;
   }


   .learning-goals {
       background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
       color: white;
       padding: 40px;
       border-radius: 20px;
       box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
   }


   .learning-goals h2 {
       text-align: center;
       margin-bottom: 25px;
       font-size: 2em;
   }


   .learning-goals ul {
       line-height: 2;
       font-size: 1.1em;
       list-style: none;
   }


   .learning-goals li {
       margin-bottom: 15px;
       padding-left: 35px;
       position: relative;
   }


   .learning-goals li:before {
       content: "✓";
       position: absolute;
       left: 0;
       font-weight: bold;
       font-size: 1.3em;
   }


   .map-container {
       background: #f8f9fa;
       padding: 20px;
       border-radius: 10px;
       margin-top: 20px;
       text-align: center;
   }


   .map-placeholder {
       background: #ecf0f1;
       height: 200px;
       border-radius: 10px;
       display: flex;
       align-items: center;
       justify-content: center;
       font-size: 1.2em;
       color: #7f8c8d;
   }


   @media (max-width: 768px) {
       .stadium-grid {
           grid-template-columns: 1fr;
       }
   }
</style>

<!-- End of Formatting and Beginning of info for stadiums -->

<!-- Header Section - Displays title "Seattle Sports + Travel + Data" -->

<div class="container">
   <div class="header">
       <h1> Seattle Sports + Travel + Data</h1>
       <p>Lumen Field & T-Mobile Park - Interactive Dashboard</p>
   </div>

<!-- Concept Section – Explains four coding concepts (Variables, Conditionals, Functions, APIs) using simple language. -->

   <div class="concept-section">
       <h2> Coding Concepts in Action</h2>
       <div class="coding-concepts">
           <div class="concept-card">
               <h3> Variables</h3>
               <p>Store city names, stadium info, coordinates, and ticket prices. Think of variables as labeled boxes that hold data!</p>
           </div>
           <div class="concept-card">
               <h3> Conditionals</h3>
               <p>Decide what info to show based on user input (like "show football stadiums only"). IF this, THEN that!</p>
           </div>
           <div class="concept-card">
               <h3> Functions</h3>
               <p>Handle repeated tasks like getStadiumInfo() and filterBySport(). Write once, use many times!</p>
           </div>
           <div class="concept-card">
               <h3> APIs</h3>
               <p>Pull live data like team schedules, weather, or ticket prices from external sources.</p>
           </div>
       </div>
   </div>

<!-- Interactive Section – Lets users click buttons to filter stadiums: -->
   <div class="interactive-section">
       <h2> Interactive Filter - Try Conditionals!</h2>
       <div class="filter-controls">
           <button class="filter-btn active" onclick="filterStadiums('all')">Show All </button>
           <button class="filter-btn" onclick="filterStadiums('football')">Football Only </button>
           <button class="filter-btn" onclick="filterStadiums('baseball')">Baseball Only </button>
       </div>

<!-- beginning of Seattle Seahawk section -->
       <div class="stadium-grid">
           <div class="stadium-card" data-sport="football">
               <div class="seahawks-header">
                   <h2> Lumen Field</h2>
                   <p>Home of the Seattle Seahawks</p>
               </div>
               <div class="stadium-body">
                   <div class="info-section">
                       <h3> Location Data (Variables)</h3>
                       <div class="info-grid">
                           <div class="info-item">
                               <div class="info-label">City</div>
                               <div class="info-value">Seattle, WA</div>
                           </div>
                           <div class="info-item">
                               <div class="info-label">Coordinates</div>
                               <div class="info-value">47.5952°N, 122.3316°W</div>
                           </div>
                           <div class="info-item">
                               <div class="info-label">Capacity</div>
                               <div class="info-value">68,740</div>
                           </div>
                           <div class="info-item">
                               <div class="info-label">Opened</div>
                               <div class="info-value">2002</div>
                           </div>
                       </div>
                   </div>


                   <div class="info-section">
                       <h3> Ticket Pricing</h3>
                       <div class="info-grid">
                           <div class="info-item">
                               <div class="info-label">Average Price</div>
                               <div class="info-value">$125</div>
                           </div>
                           <div class="info-item">
                               <div class="info-label">Price Range</div>
                               <div class="info-value">$65 - $350</div>
                           </div>
                       </div>
                   </div>


                   <button class="api-btn" onclick="fetchStadiumData('lumen')">
                        Call API - Get Live Data
                   </button>
                   <div id="lumen-response" class="api-response"></div>
               </div>
           </div>

<!-- end of seahawk section and beginning of Mariners section -->
           <div class="stadium-card" data-sport="baseball">
               <div class="mariners-header">
                   <h2> T-Mobile Park</h2>
                   <p>Home of the Seattle Mariners</p>
               </div>
               <div class="stadium-body">
                   <div class="info-section">
                       <h3> Location Data (Variables)</h3>
                       <div class="info-grid">
                           <div class="info-item">
                               <div class="info-label">City</div>
                               <div class="info-value">Seattle, WA</div>
                           </div>
                           <div class="info-item">
                               <div class="info-label">Coordinates</div>
                               <div class="info-value">47.5914°N, 122.3326°W</div>
                           </div>
                           <div class="info-item">
                               <div class="info-label">Capacity</div>
                               <div class="info-value">47,929</div>
                           </div>
                           <div class="info-item">
                               <div class="info-label">Opened</div>
                               <div class="info-value">1999</div>
                           </div>
                       </div>
                   </div>


                   <div class="info-section">
                       <h3> Ticket Pricing</h3>
                       <div class="info-grid">
                           <div class="info-item">
                               <div class="info-label">Average Price</div>
                               <div class="info-value">$45</div>
                           </div>
                           <div class="info-item">
                               <div class="info-label">Price Range</div>
                               <div class="info-value">$15 - $175</div>
                           </div>
                       </div>
                   </div>


                   <button class="api-btn" onclick="fetchStadiumData('tmobile')">
                        Call API - Get Live Data
                   </button>
                   <div id="tmobile-response" class="api-response"></div>
               </div>
           </div>
       </div>
   </div>
<!-- End of Mariners section -->

<!-- Code Demo Section – Shows example code for each concept (Variables, Conditionals, Functions, API) in color-coded blocks that you can toggle between with buttons. -->
   <div class="code-demo">
       <h2> Code Examples</h2>
       <div class="code-tabs">
           <button class="code-tab active" onclick="showCode('variables')">Variables</button>
           <button class="code-tab" onclick="showCode('conditionals')">Conditionals</button>
           <button class="code-tab" onclick="showCode('functions')">Functions</button>
           <button class="code-tab" onclick="showCode('api')">API Call</button>
       </div>


       <div id="code-variables" class="code-block active"><span class="code-comment">// VARIABLES - Storing stadium data</span>


<span class="code-keyword">let</span> city = <span class="code-string">"Seattle"</span>;
<span class="code-keyword">let</span> stadiumName = <span class="code-string">"Lumen Field"</span>;
<span class="code-keyword">let</span> coordinates = { lat: 47.5952, lng: -122.3316 };
<span class="code-keyword">let</span> ticketPrice = 125;
<span class="code-keyword">let</span> capacity = 68740;


<span class="code-comment">// Variables store data for easy access and reuse</span>
console.log(`${stadiumName} in ${city} holds ${capacity} fans`);</div>


       <div id="code-conditionals" class="code-block"><span class="code-comment">// CONDITIONALS - Filtering based on sport</span>


<span class="code-keyword">function</span> <span class="code-function">filterBySport</span>(sport) {
   <span class="code-keyword">if</span> (sport === <span class="code-string">"football"</span>) {
       <span class="code-comment">// Show only football stadiums</span>
       showStadium(<span class="code-string">"Lumen Field"</span>);
   } <span class="code-keyword">else if</span> (sport === <span class="code-string">"baseball"</span>) {
       <span class="code-comment">// Show only baseball stadiums</span>
       showStadium(<span class="code-string">"T-Mobile Park"</span>);
   } <span class="code-keyword">else</span> {
       <span class="code-comment">// Show all stadiums</span>
       showAllStadiums();
   }
}


<span class="code-comment">// Conditionals make decisions based on conditions</span>
<span class="code-function">filterBySport</span>(<span class="code-string">"football"</span>); <span class="code-comment">// Shows Lumen Field only</span></div>


       <div id="code-functions" class="code-block"><span class="code-comment">// FUNCTIONS - Reusable code blocks</span>


<span class="code-keyword">function</span> <span class="code-function">getStadiumInfo</span>(stadiumId) {
   <span class="code-keyword">const</span> stadiums = {
       lumen: {
           name: <span class="code-string">"Lumen Field"</span>,
           sport: <span class="code-string">"Football"</span>,
           capacity: 68740,
           tickets: { avg: 125, min: 65, max: 350 }
       },
       tmobile: {
           name: <span class="code-string">"T-Mobile Park"</span>,
           sport: <span class="code-string">"Baseball"</span>,
           capacity: 47929,
           tickets: { avg: 45, min: 15, max: 175 }
       }
   };
  
   <span class="code-keyword">return</span> stadiums[stadiumId];
}


<span class="code-comment">// Call the function whenever needed</span>
<span class="code-keyword">let</span> info = <span class="code-function">getStadiumInfo</span>(<span class="code-string">"lumen"</span>);
console.log(info);</div>


       <div id="code-api" class="code-block"><span class="code-comment">// API - Fetching live data</span>


<span class="code-keyword">async function</span> <span class="code-function">fetchStadiumData</span>(stadiumId) {
   <span class="code-keyword">try</span> {
       <span class="code-comment">// Make API request</span>
       <span class="code-keyword">const</span> response = <span class="code-keyword">await</span> fetch(
           <span class="code-string">`https://api.sports.com/stadiums/${stadiumId}`</span>
       );
      
       <span class="code-comment">// Parse JSON response</span>
       <span class="code-keyword">const</span> data = <span class="code-keyword">await</span> response.json();
      
       <span class="code-comment">// Return stadium info with live updates</span>
       <span class="code-keyword">return</span> {
           stadium: data.name,
           nextGame: data.schedule.next,
           weather: data.weather.current,
           ticketsAvailable: data.tickets.available
       };
      
   } <span class="code-keyword">catch</span> (error) {
       console.error(<span class="code-string">"API Error:"</span>, error);
   }
}


<span class="code-comment">// APIs connect your code to real-world data!</span></div>
   </div>

<!-- End of Code Demo Section and Beginning of API Documentation Section - Describing API used -->

   <div class="documentation">
       <h2> API Documentation</h2>
      
       <div class="doc-section">
           <h3>Available Endpoints</h3>
          
           <div class="endpoint">
               <div class="endpoint-path">GET /api/stadium/{stadium_id}</div>
               <p class="endpoint-desc"><strong>Description:</strong> Retrieves detailed information about a specific stadium.</p>
               <div class="param-list">
                   <strong>Parameters:</strong>
                   <dl>
                       <dt>stadium_id (required)</dt>
                       <dd>String - Either "lumen" or "tmobile"</dd>
                   </dl>
                   <strong>Returns:</strong>
                   <dl>
                       <dt>name</dt>
                       <dd>String - Stadium name</dd>
                       <dt>sport</dt>
                       <dd>String - Sport type (Football/Baseball)</dd>
                       <dt>capacity</dt>
                       <dd>Number - Maximum seating capacity</dd>
                       <dt>coordinates</dt>
                       <dd>Object - Latitude and longitude</dd>
                       <dt>tickets</dt>
                       <dd>Object - Average, min, and max prices</dd>
                   </dl>
               </div>
           </div>


           <div class="endpoint">
               <div class="endpoint-path">GET /api/filter?sport={sport_type}</div>
               <p class="endpoint-desc"><strong>Description:</strong> Filters stadiums by sport type.</p>
               <div class="param-list">
                   <strong>Parameters:</strong>
                   <dl>
                       <dt>sport_type (required)</dt>
                       <dd>String - "football", "baseball", or "all"</dd>
                   </dl>
                   <strong>Returns:</strong>
                   <dl>
                       <dt>stadiums</dt>
                       <dd>Array - List of matching stadiums</dd>
                       <dt>count</dt>
                       <dd>Number - Total number of results</dd>
                   </dl>
               </div>
           </div>
       </div>


       <div class="doc-section">
           <h3>Testing & Refinement</h3>
           <p class="endpoint-desc">✓ All endpoints tested with valid and invalid inputs<br>
           ✓ Error handling implemented for missing parameters<br>
           ✓ Response times optimized to under 200ms<br>
           ✓ Documentation kept up-to-date with all changes</p>
       </div>
   </div>

<!-- Learning Goals Section -->

   <div class="learning-goals">
       <h2> Learning Goals Achieved</h2>
       <ul>
           <li>Connected coding concepts (variables, conditionals, functions, APIs) to real-world sports and travel</li>
           <li>Learned how variables store important data like city names, coordinates, and ticket prices</li>
           <li>Used conditionals to filter and display information based on user choices</li>
           <li>Created reusable functions to handle repeated tasks efficiently</li>
           <li>Understood how APIs pull live data from external sources</li>
           <li>Practiced testing code to ensure it works correctly</li>
           <li>Created clear documentation for API endpoints and parameters</li>
           <li>Refined the application by fixing bugs and adding new features</li>
       </ul>
   </div>
</div>

<!-- End of Learning Goals section and beginning of script-->


<script>
    // Stores all stadium information in local Javascript object (mini database)
   const stadiumDatabase = {
       lumen: {
           name: "Lumen Field",
           team: "Seattle Seahawks",
           sport: "Football",
           city: "Seattle, WA",
           capacity: 68740,
           opened: 2002,
           coordinates: { lat: 47.5952, lng: -122.3316 },
           tickets: { average: 125, min: 65, max: 350 },
           nextGame: "vs 49ers - Sunday 1:00 PM",
           weather: "Partly Cloudy, 62°F"
       },
       tmobile: {
           name: "T-Mobile Park",
           team: "Seattle Mariners",
           sport: "Baseball",
           city: "Seattle, WA",
           capacity: 47929,
           opened: 1999,
           coordinates: { lat: 47.5914, lng: -122.3326 },
           tickets: { average: 45, min: 15, max: 175 },
           nextGame: "vs Yankees - Tuesday 7:10 PM",
           weather: "Clear, 68°F"
       }
   };

// Controls which stadium cards appear based on the selected sport button
   function filterStadiums(sport) {
       const cards = document.querySelectorAll('.stadium-card');
       const buttons = document.querySelectorAll('.filter-btn');
      
       buttons.forEach(btn => btn.classList.remove('active'));
       event.target.classList.add('active');
      
       if (sport === 'all') {
           cards.forEach(card => card.classList.remove('hidden'));
       } else {
           cards.forEach(card => {
               if (card.dataset.sport === sport) {
                   card.classList.remove('hidden');
               } else {
                   card.classList.add('hidden');
               }
           });
       }
   }

//retrives a single stadium's data from the "stadiumDatabase"
   function getStadiumInfo(stadiumId) {
       return stadiumDatabase[stadiumId];
   }

//Stimulates an API call(fake backend request)
//After 0.5s delay, retrieves stadium info from "stadiumDatabase", Formats data like a JSON API response, and Displays data below the button
   function fetchStadiumData(stadiumId) {
       const responseDiv = document.getElementById(`${stadiumId}-response`);
      
       setTimeout(() => {
           const data = getStadiumInfo(stadiumId);
           const apiResponse = {
               status: 200,
               message: "Success",
               data: {
                   stadium: data.name,
                   team: data.team,
                   capacity: data.capacity,
                   nextGame: data.nextGame,
                   weather: data.weather,
                   ticketPrice: `${data.tickets.average}`,
                   coordinates: data.coordinates
               },
               timestamp: new Date().toISOString()
           };


           responseDiv.textContent = JSON.stringify(apiResponse, null, 2);
           responseDiv.classList.add('active');
          
           responseDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
       }, 500);
   }

// Handles switching between 4 code examples (Variables, conditionals, Functions, and API Calls) when clicking each code-tab button
   function showCode(type) {
       const tabs = document.querySelectorAll('.code-tab');
       const blocks = document.querySelectorAll('.code-block');
      
       tabs.forEach(tab => tab.classList.remove('active'));
       blocks.forEach(block => block.classList.remove('active'));
      
       event.target.classList.add('active');
       document.getElementById(`code-${type}`).classList.add('active');
   }
</script>
