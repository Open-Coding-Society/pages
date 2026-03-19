---
toc: True
layout: post
title: Game API
description: This guide help you understand how to use the Game API to manage your stats within the game
permalink: /game/API
author: Avika Prasad, John Mortensen
courses: {'csse': {'week': 15}}
---

<div class="api-docs">
    
    <div class="api-header">
        <h2>Building Leaderboards with CRUD</h2>
        <p>Learn to implement dynamic and elementary leaderboard systems</p>
    </div>
    
    <div class="api-content">
        
        <!-- Two Types of Leaderboards -->
        <section>
            <h3 class="orange">Two Types of Leaderboards</h3>
            
            <div class="grid-two-col">
                <!-- Dynamic Leaderboard -->
                <div class="panel border-all accent">
                    <div class="panel-title accent">Dynamic Leaderboard</div>
                    <ul>
                        <li><strong>Real-time updates</strong> as players improve</li>
                        <li><strong>Tracks progress</strong> over time</li>
                        <li><strong>Uses UPDATE</strong> to modify scores</li>
                        <li><strong>Best for:</strong> Games with multiple attempts</li>
                    </ul>
                    <div class="panel-example">
                        <strong>Example:</strong> High score tracking, speed runs, skill progression
                    </div>
                </div>
                
                <!-- Elementary Leaderboard -->
                <div class="panel border-all teal">
                    <div class="panel-title teal">Elementary Leaderboard</div>
                    <ul>
                        <li><strong>One-time submission</strong> per user</li>
                        <li><strong>Fixed rankings</strong> after completion</li>
                        <li><strong>Uses POST only</strong> to submit</li>
                        <li><strong>Best for:</strong> Quizzes, competitions, challenges</li>
                    </ul>
                    <div class="panel-example">
                        <strong>Example:</strong> Quiz scores, contest entries, test results
                    </div>
                </div>
            </div>
        </section>
        
        <!-- Setup Steps -->
        <div class="panel border-left green">
            <h3 class="green">Setup Steps</h3>
            <ol>
                <li><strong>Log in</strong> to your account at <a href="https://pages.opencodingsociety.com/login">pages.opencodingsociety.com/login</a></li>
                <li><strong>Play the game!</strong> Then press <code>esc</code> to save your score</li>
                <li><strong>Toggle the leaderboard.</strong> Choose <code>Dynamic Leaderboard</code> to see your saved score ranked!</li>
            </ol>
            <div class="info-box warning">
                <strong>⚠️ Important:</strong> <span>You must be logged in! Without authentication, the database won't know who owns the stats.</span>
            </div>
        </div>
        
        <!-- HTTP Methods Reference -->
        <section>
            <h3 class="accent">HTTP Methods (CRUD Operations)</h3>
            
            <!-- GET Method -->
            <div class="http-method get">
                <div class="method-header">
                    <div>
                        <span class="method-name get">GET<span class="arrow">→ Retrieve / Read</span></span>
                    </div>
                    <div class="method-badge get">BOTH LEADERBOARDS</div>
                </div>
                <p class="method-description">
                    <strong>Purpose:</strong> Retrieve data from the server. Think of this as asking the database for your stats.<br>
                    <strong>Use case:</strong> Displaying current leaderboard rankings, checking user scores, loading game state.
                </p>
                <details>
                    <summary class="get">View Code Example</summary>
                    <pre><code><span class="comment">// Import javaURI and fetchOptions from config.js</span>
<span class="keyword">import</span> { javaURI, fetchOptions } <span class="keyword">from</span> <span class="string">'/assets/js/api/config.js'</span>;

<span class="comment">// GET request - fetchOptions includes authentication automatically</span>
<span class="keyword">const</span> res = <span class="keyword">await</span> <span class="function">fetch</span>(
    <span class="string">`${javaURI}/api/events/SCORE_COUNTER`</span>,
    fetchOptions
);</code></pre>
                </details>
            </div>
            
            <!-- POST Method -->
            <div class="http-method post">
                <div class="method-header">
                    <div>
                        <span class="method-name post">POST<span class="arrow">→ Create</span></span>
                    </div>
                    <div class="method-badge post">BOTH LEADERBOARDS</div>
                </div>
                <p class="method-description">
                    <strong>Purpose:</strong> Send data to create a new resource. This adds you to the database initially.<br>
                    <strong>Use case:</strong> First-time user registration, initial score submission, creating new game entry.
                </p>
                <div class="info-box success">
                    <strong>Elementary Leaderboard:</strong> <span>This is the ONLY method you need! One POST per user.</span>
                </div>
                <details>
                    <summary class="post">View Code Example</summary>
                    <pre><code><span class="comment">// Import javaURI and fetchOptions from config.js</span>
<span class="keyword">import</span> { javaURI, fetchOptions } <span class="keyword">from</span> <span class="string">'/assets/js/api/config.js'</span>;

<span class="keyword">const</span> endpoint = <span class="string">'/api/events/ELEMENTARY_LEADERBOARD'</span>;
<span class="keyword">const</span> url = <span class="string">`${javaURI}${endpoint}`</span>;

<span class="comment">// Create payload matching Java backend AlgorithmicEvent structure</span>
<span class="keyword">const</span> requestBody = {
    payload: {
        user: name,
        score: score,
        gameName: <span class="keyword">this</span>.gameName
    }
};

<span class="comment">// POST - only specify method and body, fetchOptions handles headers</span>
<span class="keyword">const</span> res = <span class="keyword">await</span> <span class="function">fetch</span>(
    url,
    {
        ...fetchOptions,
        method: <span class="string">'POST'</span>,
        body: JSON.<span class="function">stringify</span>(requestBody)
    }
);</code></pre>
                </details>
            </div>
            
            <!-- DELETE Method -->
            <div class="http-method delete">
                <div class="method-header">
                    <div>
                        <span class="method-name delete">DELETE<span class="arrow">→ Remove</span></span>
                    </div>
                    <div class="method-badge delete">BOTH LEADERBOARDS</div>
                </div>
                <p class="method-description">
                    <strong>Purpose:</strong> Remove data from the server. Permanently delete a user's entry or stats.<br>
                    <strong>Use case:</strong> User requests account deletion, removing invalid entries, clearing old data, resetting progress.
                </p>
                <div class="info-box warning">
                    <strong>⚠️ Warning:</strong> <span>DELETE is permanent! Always confirm before deleting user data.</span>
                </div>
                <details>
                    <summary class="delete">View Code Example</summary>
                    <pre><code><span class="comment">// Import javaURI and fetchOptions from config.js</span>
<span class="keyword">import</span> { javaURI, fetchOptions } <span class="keyword">from</span> <span class="string">'/assets/js/api/config.js'</span>;

<span class="keyword">const</span> url = <span class="string">`${javaURI}/api/events/ELEMENTARY_LEADERBOARD/${id}`</span>;

<span class="comment">// DELETE - only specify method, fetchOptions handles authentication</span>
<span class="keyword">const</span> res = <span class="keyword">await</span> <span class="function">fetch</span>(
    url,
    {
        ...fetchOptions,
        method: <span class="string">'DELETE'</span>
    }
);</code></pre>
                </details>
            </div>
        </section>
        
        <!-- Integration Guide -->
        <div class="integration-guide">
            <h3 class="accent">How to Add Leaderboard to Your Game</h3>
            
            <!-- Architecture Flow (Text Description) -->
            <div class="architecture-flow">
                <h4 class="teal">Architecture Flow</h4>
                <div class="flow-box">
                    <p>
                        <span class="step" style="color: var(--orange);">1. Game Objects (Coin.js, NPC.js)</span> 
                        <span class="arrow">→</span> write to 
                        <span class="step" style="color: var(--accent);">GameEnv.stats</span>
                    </p>
                    <p>
                        <span class="step" style="color: var(--accent);">2. GameEnv.stats</span> 
                        <span class="arrow">→</span> read by 
                        <span class="step" style="color: var(--teal);">GameEnvScore</span> (Score Manager)
                    </p>
                    <p>
                        <span class="step" style="color: var(--teal);">3. GameEnvScore</span> 
                        <span class="arrow">→</span> displays in 
                        <span class="step" style="color: var(--green);">Score Counter UI</span>
                    </p>
                    <p>
                        <span class="step" style="color: var(--teal);">4. GameEnvScore</span> 
                        <span class="arrow">→</span> saves via POST to 
                        <span class="step" style="color: #fd79a8;">Backend API</span> 
                        <span class="arrow">→</span> stores in 
                        <span class="step" style="color: #fdcb6e;">Database</span>
                    </p>
                    <p>
                        <span class="step" style="color: #00b894;">5. Leaderboard.js</span> 
                        <span class="arrow">→</span> fetches via GET from 
                        <span class="step" style="color: #fd79a8;">Backend API</span> 
                        <span class="arrow">→</span> displays in 
                        <span class="step" style="color: #6c5ce7;">Leaderboard UI</span>
                    </p>
                </div>
            </div>
            
            <!-- Step-by-Step Integration -->
            <div class="integration-steps">
                <h4 class="orange">Integration Steps</h4>
                
                <div class="step">
                    <div class="step-header">
                        <span class="step-number step-1">1</span>
                        <strong class="step-1">Update GameEnv with Score Configuration</strong>
                    </div>
                    <pre><code><span class="comment">// In GameEnv constructor</span>
<span class="keyword">this</span>.stats = { coinsCollected: <span class="string">0</span>, levelsCompleted: <span class="string">0</span> };
<span class="keyword">this</span>.scoreConfig = {
    counterVar: <span class="string">'coinsCollected'</span>,
    counterLabel: <span class="string">'Coins Collected'</span>,
    scoreVar: <span class="string">'coinsCollected'</span>
};
<span class="keyword">this</span>.scoreManager = <span class="keyword">null</span>;</code></pre>
                </div>
                
                <div class="step">
                    <div class="step-header">
                        <span class="step-number step-2">2</span>
                        <strong class="step-2">Update Game Objects to Write to GameEnv.stats</strong>
                    </div>
                    <pre><code><span class="comment">// In Coin.js collect() method</span>
<span class="keyword">this</span>.gameEnv.stats.coinsCollected++;</code></pre>
                </div>
                
                <div class="step">
                    <div class="step-header">
                        <span class="step-number step-3">3</span>
                        <strong class="step-3">Import Leaderboard in Your Game Initialization</strong>
                    </div>
                    <pre><code><span class="comment">// In Game.js or your main game file</span>
<span class="keyword">import</span> Leaderboard <span class="keyword">from</span> <span class="string">'../Leaderboard.js'</span>;

<span class="comment">// Create leaderboard instance (inside your game setup)</span>
<span class="keyword">this</span>.leaderboardInstance = <span class="keyword">new</span> <span class="function">Leaderboard</span>(<span class="keyword">this</span>.gameControl, {
    gameName: <span class="string">'AdventureGame'</span>,
    parentId: <span class="string">'gameContainer'</span>,
    initiallyHidden: <span class="keyword">false</span> <span class="comment">// Set to true to hide on load</span>
});</code></pre>
                </div>
                
                <div class="step">
                    <div class="step-header">
                        <span class="step-number step-4">4</span>
                        <strong class="step-4">Access Score and Leaderboard via Pause Menu</strong>
                    </div>
                    <p>
                        Press <code>ESC</code> during gameplay to open the pause menu. This gives you access to:
                    </p>
                    <ul>
                        <li><strong>Toggle Score</strong> - Show/hide the score counter</li>
                        <li><strong>Save Score</strong> - Submit your score to the backend</li>
                        <li><strong>Toggle Leaderboard</strong> - Show/hide the leaderboard</li>
                    </ul>
                </div>
            </div>
        </div>
        
        <!-- Auto-Enable Section -->
        <div class="auto-enable">
            <h3 class="green">Turn Score & Leaderboard On By Default</h3>
            
            <div class="option-panel">
                <h4 class="option-1">Option 1: Auto-Initialize Score Counter (Recommended)</h4>
                <p>Add this to your Game.js constructor or initialization method:</p>
                <pre><code><span class="comment">// In Game.js constructor, after gameControl is created</span>
<span class="keyword">if</span> (<span class="keyword">this</span>.gameControl?.gameEnv) {
    <span class="keyword">this</span>.gameControl.gameEnv.<span class="function">initScoreManager</span>().<span class="function">then</span>(() => {
        <span class="comment">// Auto-show score counter on game start</span>
        <span class="keyword">this</span>.gameControl.gameEnv.scoreManager.<span class="function">toggleScoreDisplay</span>();
    });
}</code></pre>
            </div>
            
            <div class="option-panel">
                <h4 class="option-2">Option 2: Show Leaderboard on Load</h4>
                <p>Set <code>initiallyHidden: false</code> when creating the leaderboard:</p>
                <pre><code><span class="comment">// In your game initialization</span>
<span class="keyword">this</span>.leaderboardInstance = <span class="keyword">new</span> <span class="function">Leaderboard</span>(<span class="keyword">this</span>.gameControl, {
    gameName: <span class="string">'AdventureGame'</span>,
    parentId: <span class="string">'gameContainer'</span>,
    initiallyHidden: <span class="keyword">false</span>  <span class="comment">// ← Change to false to show on load</span>
});

<span class="comment">// Optional: Force positioning for consistent display</span>
<span class="function">setTimeout</span>(() => {
    <span class="keyword">const</span> container = document.<span class="function">getElementById</span>(<span class="string">'leaderboard-container'</span>);
    <span class="keyword">if</span> (container) {
        container.style.position = <span class="string">'fixed'</span>;
        container.style.top = <span class="string">'80px'</span>;
        container.style.right = <span class="string">'20px'</span>;
        container.style.zIndex = <span class="string">'1000'</span>;
    }
}, <span class="string">100</span>);</code></pre>
            </div>
            
            <div class="pro-tip">
                <strong>Pro Tip:</strong> 
                <span>You can combine both options to show score counter AND leaderboard on game start. This is great for competitive games where players want to see rankings immediately!</span>
            </div>
        </div>
        
    </div>
</div>
