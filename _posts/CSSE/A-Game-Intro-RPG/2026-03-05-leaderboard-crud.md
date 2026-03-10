---
toc: True
layout: post
title: Game API
description: This post ensures that you know how to use the Game API to manage your stats within the game
permalink: /game/API
author: Avika Prasad
courses: {'csse': {'week': 9}}
type: ccc 
---

<div style="font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 900px; margin: 0 auto;">
    
    <!-- Header -->
    <div style="background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); padding: 25px; border-radius: 12px 12px 0 0; border-bottom: 3px solid #00d4ff;">
        <h2 style="margin: 0; color: #00d4ff; font-weight: 700; font-size: 24px;">Building Leaderboards with CRUD</h2>
        <p style="margin: 8px 0 0 0; color: rgba(255,255,255,0.85); font-size: 15px;">Learn to implement dynamic and elementary leaderboard systems</p>
    </div>
    
    <div style="background: #0f0f1e; padding: 30px; border-radius: 0 0 12px 12px;">
        
        <!-- Two Types of Leaderboards -->
        <div style="margin-bottom: 30px;">
            <h3 style="color: #ff6b9d; font-weight: 600; font-size: 20px; margin: 0 0 20px 0;">Two Types of Leaderboards</h3>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">
                <!-- Dynamic Leaderboard -->
                <div style="background: #1a1a2e; border: 2px solid #00d4ff; border-radius: 8px; padding: 20px;">
                    <div style="color: #00d4ff; font-weight: 700; font-size: 16px; margin-bottom: 10px;">Dynamic Leaderboard</div>
                    <ul style="color: #aaa; margin: 0; padding-left: 20px; line-height: 1.8; font-size: 14px;">
                        <li><strong style="color: #fff;">Real-time updates</strong> as players improve</li>
                        <li><strong style="color: #fff;">Tracks progress</strong> over time</li>
                        <li><strong style="color: #fff;">Uses UPDATE</strong> to modify scores</li>
                        <li><strong style="color: #fff;">Best for:</strong> Games with multiple attempts</li>
                    </ul>
                    <div style="margin-top: 15px; padding: 12px; background: #0f0f1e; border-radius: 6px; font-size: 13px; color: #888;">
                        <strong style="color: #00d4ff;">Example:</strong> High score tracking, speed runs, skill progression
                    </div>
                </div>
                
                <!-- Elementary Leaderboard -->
                <div style="background: #1a1a2e; border: 2px solid #4ecdc4; border-radius: 8px; padding: 20px;">
                    <div style="color: #4ecdc4; font-weight: 700; font-size: 16px; margin-bottom: 10px;">Elementary Leaderboard</div>
                    <ul style="color: #aaa; margin: 0; padding-left: 20px; line-height: 1.8; font-size: 14px;">
                        <li><strong style="color: #fff;">One-time submission</strong> per user</li>
                        <li><strong style="color: #fff;">Fixed rankings</strong> after completion</li>
                        <li><strong style="color: #fff;">Uses POST only</strong> to submit</li>
                        <li><strong style="color: #fff;">Best for:</strong> Quizzes, competitions, challenges</li>
                    </ul>
                    <div style="margin-top: 15px; padding: 12px; background: #0f0f1e; border-radius: 6px; font-size: 13px; color: #888;">
                        <strong style="color: #4ecdc4;">Example:</strong> Quiz scores, contest entries, test results
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Setup Steps -->
        <div style="background: #1a1a2e; border-left: 4px solid #a29bfe; border-radius: 8px; padding: 20px; margin-bottom: 30px;">
            <h3 style="color: #a29bfe; font-weight: 600; font-size: 18px; margin: 0 0 15px 0;">Setup Steps</h3>
            <ol style="color: #aaa; margin: 0; padding-left: 20px; line-height: 2; font-size: 14px;">
                <li><strong style="color: #fff;">Log in</strong> to your account at <a href="https://pages.opencodingsociety.com/login" style="color: #00d4ff; text-decoration: none;">pages.opencodingsociety.com/login</a></li>
                <li><strong style="color: #fff;">Play the game!</strong> Then press <code style="background: #0f0f1e; padding: 2px 6px; border-radius: 3px; color: #ff6b9d;">esc</code> to save your score</li>
                <li><strong style="color: #fff;">Toggle the leaderboard.</strong> Choose <code style="background: #0f0f1e; padding: 2px 6px; border-radius: 3px; color: #ff6b9d;">Dynamic Leaderboard</code> to see your saved score ranked!</li>
            </ol>
            <div style="margin-top: 15px; padding: 12px; background: #2d1b3d; border-radius: 6px;">
                <strong style="color: #a29bfe;">⚠️ Important:</strong> <span style="color: #aaa; font-size: 14px;">You must be logged in! Without authentication, the database won't know who owns the stats.</span>
            </div>
        </div>
        
        <!-- HTTP Methods Reference -->
        <div style="margin-bottom: 30px;">
            <h3 style="color: #00d4ff; font-weight: 600; font-size: 20px; margin: 0 0 20px 0;">HTTP Methods (CRUD Operations)</h3>
            
            <!-- GET Method -->
            <div style="background: #1a1a2e; border-left: 4px solid #4ecdc4; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                    <div>
                        <span style="color: #4ecdc4; font-weight: 700; font-size: 18px;">GET</span>
                        <span style="color: #888; font-size: 14px; margin-left: 10px;">→ Retrieve / Read</span>
                    </div>
                    <div style="background: #4ecdc4; color: #1a1a2e; padding: 4px 12px; border-radius: 4px; font-weight: 600; font-size: 12px;">BOTH LEADERBOARDS</div>
                </div>
                <p style="color: #aaa; margin: 0 0 15px 0; font-size: 14px; line-height: 1.6;">
                    <strong style="color: #fff;">Purpose:</strong> Retrieve data from the server. Think of this as asking the database for your stats.<br>
                    <strong style="color: #fff;">Use case:</strong> Displaying current leaderboard rankings, checking user scores, loading game state.
                </p>
                <details style="cursor: pointer;">
                    <summary style="color: #4ecdc4; font-weight: 600; font-size: 14px; margin-bottom: 10px;">View Code Example</summary>
                    <pre style="background: #0f0f1e; padding: 15px; border-radius: 6px; margin: 10px 0 0 0; overflow-x: auto;"><code style="color: #ffffff; font-family: 'Courier New', monospace; font-size: 13px; line-height: 1.5;"><span style="color: #c44569;">const</span> base =
    window.javaBackendUrl ||
    (location.hostname === <span style="color: #4ecdc4;">'localhost'</span> ? <span style="color: #4ecdc4;">'http://localhost:8585'</span> : javaURI);

<span style="color: #c44569;">const</span> res = <span style="color: #c44569;">await</span> <span style="color: #a29bfe;">fetch</span>(
    <span style="color: #4ecdc4;">`${base.replace(/\/$/, '')}/api/events/SCORE_COUNTER`</span>,
    { 
        ...fetchOptions, 
        method: <span style="color: #4ecdc4;">'GET'</span>
    }
);</code></pre>
                </details>
            </div>
            
            <!-- POST Method -->
            <div style="background: #1a1a2e; border-left: 4px solid #00d4ff; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                    <div>
                        <span style="color: #00d4ff; font-weight: 700; font-size: 18px;">POST</span>
                        <span style="color: #888; font-size: 14px; margin-left: 10px;">→ Create</span>
                    </div>
                    <div style="background: #00d4ff; color: #1a1a2e; padding: 4px 12px; border-radius: 4px; font-weight: 600; font-size: 12px;">BOTH LEADERBOARDS</div>
                </div>
                <p style="color: #aaa; margin: 0 0 15px 0; font-size: 14px; line-height: 1.6;">
                    <strong style="color: #fff;">Purpose:</strong> Send data to create a new resource. This adds you to the database initially.<br>
                    <strong style="color: #fff;">Use case:</strong> First-time user registration, initial score submission, creating new game entry.
                </p>
                <div style="background: #2d1b3d; border-left: 3px solid #a29bfe; padding: 12px; border-radius: 4px; margin-bottom: 15px;">
                    <strong style="color: #a29bfe;">Elementary Leaderboard:</strong> <span style="color: #aaa; font-size: 13px;">This is the ONLY method you need! One POST per user.</span>
                </div>
                <details style="cursor: pointer;">
                    <summary style="color: #00d4ff; font-weight: 600; font-size: 14px; margin-bottom: 10px;">View Code Example</summary>
                    <pre style="background: #0f0f1e; padding: 15px; border-radius: 6px; margin: 10px 0 0 0; overflow-x: auto;"><code style="color: #ffffff; font-family: 'Courier New', monospace; font-size: 13px; line-height: 1.5;"><span style="color: #c44569;">const</span> endpoint = <span style="color: #4ecdc4;">'/api/events/ELEMENTARY_LEADERBOARD'</span>;
console.<span style="color: #a29bfe;">log</span>(<span style="color: #4ecdc4;">'POST endpoint:'</span>, endpoint);

<span style="color: #c44569;">const</span> base =
    window.javaBackendUrl ||
    (location.hostname === <span style="color: #4ecdc4;">'localhost'</span> ? <span style="color: #4ecdc4;">'http://localhost:8585'</span> : javaURI);

<span style="color: #c44569;">const</span> url = <span style="color: #4ecdc4;">`${base.replace(/\/$/, '')}${endpoint}`</span>;
console.<span style="color: #a29bfe;">log</span>(<span style="color: #4ecdc4;">'Full URL:'</span>, url);

<span style="color: #888;">// Create payload matching Java backend AlgorithmicEvent structure</span>
<span style="color: #c44569;">const</span> requestBody = {
    payload: {
        user: name,
        score: score,
        gameName: <span style="color: #c44569;">this</span>.gameName
    }
};
console.<span style="color: #a29bfe;">log</span>(<span style="color: #4ecdc4;">'Payload:'</span>, JSON.<span style="color: #a29bfe;">stringify</span>(requestBody));

<span style="color: #888;">// POST to backend - using fetchOptions for proper authentication</span>
<span style="color: #c44569;">const</span> res = <span style="color: #c44569;">await</span> <span style="color: #a29bfe;">fetch</span>(
    url,
    {
        ...fetchOptions,
        method: <span style="color: #4ecdc4;">'POST'</span>,
        headers: {
            ...fetchOptions?.headers,
            <span style="color: #4ecdc4;">'Content-Type'</span>: <span style="color: #4ecdc4;">'application/json'</span>,
        },
        body: JSON.<span style="color: #a29bfe;">stringify</span>(requestBody)
    }
);</code></pre>
                </details>
            </div>
            
            <!-- DELETE Method -->
            <div style="background: #1a1a2e; border-left: 4px solid #ff6b9d; border-radius: 8px; padding: 20px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                    <div>
                        <span style="color: #ff6b9d; font-weight: 700; font-size: 18px;">DELETE</span>
                        <span style="color: #888; font-size: 14px; margin-left: 10px;">→ Remove</span>
                    </div>
                    <div style="background: #ff6b9d; color: #1a1a2e; padding: 4px 12px; border-radius: 4px; font-weight: 600; font-size: 12px;">BOTH LEADERBOARDS</div>
                </div>
                <p style="color: #aaa; margin: 0 0 15px 0; font-size: 14px; line-height: 1.6;">
                    <strong style="color: #fff;">Purpose:</strong> Remove data from the server. Permanently delete a user's entry or stats.<br>
                    <strong style="color: #fff;">Use case:</strong> User requests account deletion, removing invalid entries, clearing old data, resetting progress.
                </p>
                <div style="background: #3a1a1a; border-left: 3px solid #c44569; padding: 12px; border-radius: 4px; margin-bottom: 15px;">
                    <strong style="color: #c44569;">⚠️ Warning:</strong> <span style="color: #aaa; font-size: 13px;">DELETE is permanent! Always confirm before deleting user data.</span>
                </div>
                <details style="cursor: pointer;">
                    <summary style="color: #ff6b9d; font-weight: 600; font-size: 14px; margin-bottom: 10px;">View Code Example</summary>
                    <pre style="background: #0f0f1e; padding: 15px; border-radius: 6px; margin: 10px 0 0 0; overflow-x: auto;"><code style="color: #ffffff; font-family: 'Courier New', monospace; font-size: 13px; line-height: 1.5;"><span style="color: #c44569;">const</span> base =
    window.javaBackendUrl ||
    (location.hostname === <span style="color: #4ecdc4;">'localhost'</span> ? <span style="color: #4ecdc4;">'http://localhost:8585'</span> : javaURI);

<span style="color: #c44569;">const</span> url = <span style="color: #4ecdc4;">`${base.replace(/\/$/, '')}/api/events/ELEMENTARY_LEADERBOARD/${id}`</span>;
console.<span style="color: #a29bfe;">log</span>(<span style="color: #4ecdc4;">'DELETE URL:'</span>, url);

<span style="color: #888;">// DELETE from backend - using fetchOptions for proper authentication</span>
<span style="color: #c44569;">const</span> res = <span style="color: #c44569;">await</span> <span style="color: #a29bfe;">fetch</span>(
    url,
    {
        ...fetchOptions,
        method: <span style="color: #4ecdc4;">'DELETE'</span>
    }
);</code></pre>
                </details>
            </div>
        </div>
        
        <!-- Interactive HTTP Methods Game -->
        <div style="margin-bottom: 30px;">
            <h3 style="color: #ff6b9d; font-weight: 600; font-size: 20px; margin: 0 0 15px 0;">Interactive: API Restaurant Simulator</h3>
            <p style="color: #aaa; font-size: 14px; margin-bottom: 20px;">You're a waiter at API Restaurant! Match each customer request to the correct HTTP method</p>
            
            <canvas id="httpGame" width="860" height="400" style="border-radius: 8px; cursor: pointer;"></canvas>
            
            <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 15px; padding: 15px; background: #1a1a2e; border-radius: 8px;">
                <div>
                    <span style="color: #aaa; font-size: 14px;">Tips Earned: </span>
                    <strong id="httpScore" style="color: #00d4ff; font-size: 20px;">$0</strong>
                    <span style="color: #aaa; font-size: 14px;"> / </span>
                    <span id="httpTotal" style="color: #aaa; font-size: 16px;">$5</span>
                </div>
                <button onclick="resetHTTPGame()" style="background: #ff6b9d; color: #1a1a2e; border: none; padding: 10px 24px; border-radius: 6px; cursor: pointer; font-weight: 600; font-size: 14px;">New Shift</button>
            </div>
        </div>
        
        <!-- Quick Reference Table -->
        <div style="background: #1a1a2e; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
            <h4 style="color: #a29bfe; font-weight: 600; font-size: 16px; margin: 0 0 15px 0;">Quick Reference: CRUD Operations</h4>
            <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
                <thead>
                    <tr style="background: #0f0f1e;">
                        <th style="padding: 12px; text-align: left; color: #00d4ff; border-bottom: 2px solid #333;">Operation</th>
                        <th style="padding: 12px; text-align: left; color: #00d4ff; border-bottom: 2px solid #333;">HTTP Method</th>
                        <th style="padding: 12px; text-align: left; color: #00d4ff; border-bottom: 2px solid #333;">Purpose</th>
                        <th style="padding: 12px; text-align: left; color: #00d4ff; border-bottom: 2px solid #333;">Example</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td style="padding: 12px; color: #4ecdc4; font-weight: 600; border-bottom: 1px solid #333;">Read</td>
                        <td style="padding: 12px; color: #fff; border-bottom: 1px solid #333;">GET</td>
                        <td style="padding: 12px; color: #aaa; border-bottom: 1px solid #333;">Retrieve data</td>
                        <td style="padding: 12px; color: #888; font-size: 13px; border-bottom: 1px solid #333;">View leaderboard</td>
                    </tr>
                    <tr>
                        <td style="padding: 12px; color: #00d4ff; font-weight: 600; border-bottom: 1px solid #333;">Create</td>
                        <td style="padding: 12px; color: #fff; border-bottom: 1px solid #333;">POST</td>
                        <td style="padding: 12px; color: #aaa; border-bottom: 1px solid #333;">Add new data</td>
                        <td style="padding: 12px; color: #888; font-size: 13px; border-bottom: 1px solid #333;">Submit first score</td>
                    </tr>
                    <tr>
                        <td style="padding: 12px; color: #a29bfe; font-weight: 600; border-bottom: 1px solid #333;">Update</td>
                        <td style="padding: 12px; color: #fff; border-bottom: 1px solid #333;">PUT</td>
                        <td style="padding: 12px; color: #aaa; border-bottom: 1px solid #333;">Modify existing</td>
                        <td style="padding: 12px; color: #888; font-size: 13px; border-bottom: 1px solid #333;">Beat high score</td>
                    </tr>
                    <tr>
                        <td style="padding: 12px; color: #ff6b9d; font-weight: 600;">Delete</td>
                        <td style="padding: 12px; color: #fff;">DELETE</td>
                        <td style="padding: 12px; color: #aaa;">Remove data</td>
                        <td style="padding: 12px; color: #888; font-size: 13px;">Clear account</td>
                    </tr>
                </tbody>
            </table>
        </div>
        
    </div>
</div>

<script>
const canvas = document.getElementById('httpGame');
const ctx = canvas.getContext('2d');

let score = 0;
let currentQuestion = 0;

const scenarios = [
    {
        text: "'Can I see the menu please?'",
        correct: "GET",
        explanation: "Looking at the menu = GET (reading data without changing anything)"
    },
    {
        text: "'I'd like to place a new order for a burger'",
        correct: "POST",
        explanation: "New order = POST (creating a new entry in the system)"
    },
    {
        text: "'Actually, can I change my order to add fries?'",
        correct: "PUT",
        explanation: "Modifying existing order = PUT (updating existing data)"
    },
    {
        text: "'Cancel my order please, I need to leave'",
        correct: "DELETE",
        explanation: "Canceling order = DELETE (removing the entry completely)"
    },
    {
        text: "'Is my order ready yet? Can I check the status?'",
        correct: "GET",
        explanation: "Checking status = GET (retrieving current information)"
    }
];

const methods = ["GET", "POST", "PUT", "DELETE"];
const methodColors = { 
    "GET": "#4ecdc4", 
    "POST": "#00d4ff", 
    "PUT": "#a29bfe",
    "DELETE": "#ff6b9d" 
};

function drawHTTPGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    if (currentQuestion >= scenarios.length) {
        // Game over
        ctx.fillStyle = "#4ecdc4";
        ctx.font = "700 24px Inter, sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(`Shift Complete! Tips: $${score}`, 430, 150);
        
        ctx.fillStyle = "#aaa";
        ctx.font = "500 16px Inter, sans-serif";
        const percentage = (score / scenarios.length * 100).toFixed(0);
        ctx.fillText(`${percentage}% customer satisfaction!`, 430, 190);
        
        ctx.fillStyle = "#888";
        ctx.font = "400 14px Inter, sans-serif";
        if (score === scenarios.length) {
            ctx.fillText("Perfect service! You're an API master!", 430, 230);
        } else if (score >= 3) {
            ctx.fillText("Good work! Keep practicing those HTTP methods", 430, 230);
        } else {
            ctx.fillText("Click 'New Shift' to try again", 430, 230);
        }
        return;
    }
    
    const scenario = scenarios[currentQuestion];
    
    // Question number
    ctx.fillStyle = "#888";
    ctx.font = "600 14px Inter, sans-serif";
    ctx.textAlign = "left";
    ctx.fillText(`Customer ${currentQuestion + 1} of ${scenarios.length}`, 30, 30);
    
    // Restaurant badge
    ctx.fillStyle = "#00d4ff";
    ctx.fillRect(700, 15, 130, 25);
    ctx.fillStyle = "#1a1a2e";
    ctx.font = "600 12px Inter, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("API Restaurant", 765, 32);
    
    // Customer request
    ctx.fillStyle = "#fff";
    ctx.font = "600 18px Inter, sans-serif";
    ctx.textAlign = "left";
    ctx.fillText("Customer says:", 30, 70);
    
    ctx.fillStyle = "#00d4ff";
    ctx.font = "500 16px Inter, sans-serif";
    wrapText(ctx, scenario.text, 30, 100, 800, 24);
    
    // Instruction
    ctx.fillStyle = "#888";
    ctx.font = "500 13px Inter, sans-serif";
    ctx.fillText("Which HTTP method should you use?", 30, 150);
    
    // Method buttons (2x2 grid)
    methods.forEach((method, index) => {
        const col = index % 2;
        const row = Math.floor(index / 2);
        const x = 30 + col * 420;
        const y = 180 + row * 100;
        
        // Shadow
        ctx.shadowColor = 'rgba(0, 212, 255, 0.15)';
        ctx.shadowBlur = 10;
        ctx.shadowOffsetY = 3;
        
        // Button
        ctx.fillStyle = "#1a1a2e";
        ctx.beginPath();
        roundRect(ctx, x, y, 400, 80, 8);
        ctx.fill();
        
        // Border
        ctx.strokeStyle = methodColors[method];
        ctx.lineWidth = 2;
        ctx.beginPath();
        roundRect(ctx, x, y, 400, 80, 8);
        ctx.stroke();
        
        ctx.shadowBlur = 0;
        ctx.shadowOffsetY = 0;
        
        // Method name
        ctx.fillStyle = methodColors[method];
        ctx.font = "700 20px Inter, sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(method, x + 200, y + 35);
        
        // Description
        ctx.fillStyle = "#888";
        ctx.font = "400 12px Inter, sans-serif";
        const desc = method === "GET" ? "Read/View" : 
                     method === "POST" ? "Create/Add" : 
                     method === "PUT" ? "Update/Change" : 
                     "Remove/Cancel";
        ctx.fillText(desc, x + 200, y + 58);
    });
}

canvas.addEventListener('click', (e) => {
    if (currentQuestion >= scenarios.length) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    methods.forEach((method, index) => {
        const col = index % 2;
        const row = Math.floor(index / 2);
        const btnX = 30 + col * 420;
        const btnY = 180 + row * 100;
        
        if (x >= btnX && x <= btnX + 400 && y >= btnY && y <= btnY + 80) {
            const scenario = scenarios[currentQuestion];
            
            if (method === scenario.correct) {
                score++;
                alert(`Correct! +$1 tip\n\n${scenario.explanation}`);
            } else {
                alert(`Wrong method! No tip this time\n\nCorrect answer: ${scenario.correct}\n\n${scenario.explanation}`);
            }
            
            currentQuestion++;
            document.getElementById('httpScore').textContent = `$${score}`;
            drawHTTPGame();
        }
    });
});

function resetHTTPGame() {
    score = 0;
    currentQuestion = 0;
    document.getElementById('httpScore').textContent = '$0';
    drawHTTPGame();
}

function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
    const words = text.split(' ');
    let line = '';
    
    for (let n = 0; n < words.length; n++) {
        const testLine = line + words[n] + ' ';
        const metrics = ctx.measureText(testLine);
        const testWidth = metrics.width;
        
        if (testWidth > maxWidth && n > 0) {
            ctx.fillText(line, x, y);
            line = words[n] + ' ';
            y += lineHeight;
        } else {
            line = testLine;
        }
    }
    ctx.fillText(line, x, y);
}

function roundRect(ctx, x, y, width, height, radius) {
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
}

drawHTTPGame();
</script>