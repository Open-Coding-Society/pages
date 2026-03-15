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
                    <pre style="background: #0f0f1e; padding: 15px; border-radius: 6px; margin: 10px 0 0 0; overflow-x: auto;"><code style="color: #ffffff; font-family: 'Courier New', monospace; font-size: 13px; line-height: 1.5;"><span style="color: #888;">// Import javaURI and fetchOptions from config.js</span>
<span style="color: #c44569;">import</span> { javaURI, fetchOptions } <span style="color: #c44569;">from</span> <span style="color: #4ecdc4;">'/assets/js/api/config.js'</span>;

<span style="color: #888;">// GET request - fetchOptions includes authentication automatically</span>
<span style="color: #c44569;">const</span> res = <span style="color: #c44569;">await</span> <span style="color: #a29bfe;">fetch</span>(
    <span style="color: #4ecdc4;">`${javaURI}/api/events/SCORE_COUNTER`</span>,
    fetchOptions
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
                    <pre style="background: #0f0f1e; padding: 15px; border-radius: 6px; margin: 10px 0 0 0; overflow-x: auto;"><code style="color: #ffffff; font-family: 'Courier New', monospace; font-size: 13px; line-height: 1.5;"><span style="color: #888;">// Import javaURI and fetchOptions from config.js</span>
<span style="color: #c44569;">import</span> { javaURI, fetchOptions } <span style="color: #c44569;">from</span> <span style="color: #4ecdc4;">'/assets/js/api/config.js'</span>;

<span style="color: #c44569;">const</span> endpoint = <span style="color: #4ecdc4;">'/api/events/ELEMENTARY_LEADERBOARD'</span>;
<span style="color: #c44569;">const</span> url = <span style="color: #4ecdc4;">`${javaURI}${endpoint}`</span>;

<span style="color: #888;">// Create payload matching Java backend AlgorithmicEvent structure</span>
<span style="color: #c44569;">const</span> requestBody = {
    payload: {
        user: name,
        score: score,
        gameName: <span style="color: #c44569;">this</span>.gameName
    }
};

<span style="color: #888;">// POST - only specify method and body, fetchOptions handles headers</span>
<span style="color: #c44569;">const</span> res = <span style="color: #c44569;">await</span> <span style="color: #a29bfe;">fetch</span>(
    url,
    {
        ...fetchOptions,
        method: <span style="color: #4ecdc4;">'POST'</span>,
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
                    <pre style="background: #0f0f1e; padding: 15px; border-radius: 6px; margin: 10px 0 0 0; overflow-x: auto;"><code style="color: #ffffff; font-family: 'Courier New', monospace; font-size: 13px; line-height: 1.5;"><span style="color: #888;">// Import javaURI and fetchOptions from config.js</span>
<span style="color: #c44569;">import</span> { javaURI, fetchOptions } <span style="color: #c44569;">from</span> <span style="color: #4ecdc4;">'/assets/js/api/config.js'</span>;

<span style="color: #c44569;">const</span> url = <span style="color: #4ecdc4;">`${javaURI}/api/events/ELEMENTARY_LEADERBOARD/${id}`</span>;

<span style="color: #888;">// DELETE - only specify method, fetchOptions handles authentication</span>
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
        
        <!-- Integration Guide -->
        <div style="background: linear-gradient(135deg, #1a2a3a 0%, #1a1a2e 100%); border: 2px solid #00d4ff; border-radius: 12px; padding: 25px; margin-bottom: 30px;">
            <h3 style="color: #00d4ff; font-weight: 600; font-size: 20px; margin: 0 0 20px 0;">🎮 How to Add Leaderboard to Your Game</h3>
            
            <!-- Architecture Flow (Text Description) -->
            <div style="background: #0f0f1e; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
                <h4 style="color: #4ecdc4; font-weight: 600; font-size: 16px; margin: 0 0 15px 0;">Architecture Flow</h4>
                <div style="background: #1a1a2e; padding: 15px; border-left: 4px solid #00d4ff; border-radius: 4px;">
                    <p style="color: #aaa; margin: 0 0 10px 0; font-size: 14px; line-height: 1.8;">
                        <span style="color: #ff6b9d; font-weight: 600;">1. Game Objects (Coin.js, NPC.js)</span> 
                        <span style="color: #888;">→</span> write to 
                        <span style="color: #00d4ff; font-weight: 600;">GameEnv.stats</span>
                    </p>
                    <p style="color: #aaa; margin: 0 0 10px 0; font-size: 14px; line-height: 1.8;">
                        <span style="color: #00d4ff; font-weight: 600;">2. GameEnv.stats</span> 
                        <span style="color: #888;">→</span> read by 
                        <span style="color: #4ecdc4; font-weight: 600;">GameEnvScore</span> (Score Manager)
                    </p>
                    <p style="color: #aaa; margin: 0 0 10px 0; font-size: 14px; line-height: 1.8;">
                        <span style="color: #4ecdc4; font-weight: 600;">3. GameEnvScore</span> 
                        <span style="color: #888;">→</span> displays in 
                        <span style="color: #a29bfe; font-weight: 600;">Score Counter UI</span>
                    </p>
                    <p style="color: #aaa; margin: 0 0 10px 0; font-size: 14px; line-height: 1.8;">
                        <span style="color: #4ecdc4; font-weight: 600;">4. GameEnvScore</span> 
                        <span style="color: #888;">→</span> saves via POST to 
                        <span style="color: #fd79a8; font-weight: 600;">Backend API</span> 
                        <span style="color: #888;">→</span> stores in 
                        <span style="color: #fdcb6e; font-weight: 600;">Database</span>
                    </p>
                    <p style="color: #aaa; margin: 0; font-size: 14px; line-height: 1.8;">
                        <span style="color: #00b894; font-weight: 600;">5. Leaderboard.js</span> 
                        <span style="color: #888;">→</span> fetches via GET from 
                        <span style="color: #fd79a8; font-weight: 600;">Backend API</span> 
                        <span style="color: #888;">→</span> displays in 
                        <span style="color: #6c5ce7; font-weight: 600;">Leaderboard UI</span>
                    </p>
                </div>
            </div>
            
            <!-- Step-by-Step Integration -->
            <div style="background: #1a1a2e; border-radius: 8px; padding: 20px;">
                <h4 style="color: #ff6b9d; font-weight: 600; font-size: 16px; margin: 0 0 15px 0;">Integration Steps</h4>
                
                <div style="margin-bottom: 20px;">
                    <div style="display: flex; align-items: center; margin-bottom: 10px;">
                        <span style="background: #00d4ff; color: #1a1a2e; width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; margin-right: 12px;">1</span>
                        <strong style="color: #00d4ff; font-size: 15px;">Update GameEnv with Score Configuration</strong>
                    </div>
                    <pre style="background: #0f0f1e; padding: 12px; border-radius: 6px; margin-left: 40px; overflow-x: auto;"><code style="color: #ffffff; font-family: 'Courier New', monospace; font-size: 12px;"><span style="color: #888;">// In GameEnv constructor</span>
<span style="color: #c44569;">this</span>.stats = { coinsCollected: <span style="color: #4ecdc4;">0</span>, levelsCompleted: <span style="color: #4ecdc4;">0</span> };
<span style="color: #c44569;">this</span>.scoreConfig = {
    counterVar: <span style="color: #4ecdc4;">'coinsCollected'</span>,
    counterLabel: <span style="color: #4ecdc4;">'Coins Collected'</span>,
    scoreVar: <span style="color: #4ecdc4;">'coinsCollected'</span>
};
<span style="color: #c44569;">this</span>.scoreManager = <span style="color: #c44569;">null</span>;</code></pre>
                </div>
                
                <div style="margin-bottom: 20px;">
                    <div style="display: flex; align-items: center; margin-bottom: 10px;">
                        <span style="background: #4ecdc4; color: #1a1a2e; width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; margin-right: 12px;">2</span>
                        <strong style="color: #4ecdc4; font-size: 15px;">Update Game Objects to Write to GameEnv.stats</strong>
                    </div>
                    <pre style="background: #0f0f1e; padding: 12px; border-radius: 6px; margin-left: 40px; overflow-x: auto;"><code style="color: #ffffff; font-family: 'Courier New', monospace; font-size: 12px;"><span style="color: #888;">// In Coin.js collect() method</span>
<span style="color: #c44569;">this</span>.gameEnv.stats.coinsCollected++;</code></pre>
                </div>
                
                <div style="margin-bottom: 20px;">
                    <div style="display: flex; align-items: center; margin-bottom: 10px;">
                        <span style="background: #a29bfe; color: #1a1a2e; width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; margin-right: 12px;">3</span>
                        <strong style="color: #a29bfe; font-size: 15px;">Import Leaderboard in Your Game Initialization</strong>
                    </div>
                    <pre style="background: #0f0f1e; padding: 12px; border-radius: 6px; margin-left: 40px; overflow-x: auto;"><code style="color: #ffffff; font-family: 'Courier New', monospace; font-size: 12px;"><span style="color: #888;">// In Game.js or your main game file</span>
<span style="color: #c44569;">import</span> Leaderboard <span style="color: #c44569;">from</span> <span style="color: #4ecdc4;">'../Leaderboard.js'</span>;

<span style="color: #888;">// Create leaderboard instance (inside your game setup)</span>
<span style="color: #c44569;">this</span>.leaderboardInstance = <span style="color: #c44569;">new</span> <span style="color: #a29bfe;">Leaderboard</span>(<span style="color: #c44569;">this</span>.gameControl, {
    gameName: <span style="color: #4ecdc4;">'AdventureGame'</span>,
    parentId: <span style="color: #4ecdc4;">'gameContainer'</span>,
    initiallyHidden: <span style="color: #c44569;">false</span> <span style="color: #888;">// Set to true to hide on load</span>
});</code></pre>
                </div>
                
                <div>
                    <div style="display: flex; align-items: center; margin-bottom: 10px;">
                        <span style="background: #ff6b9d; color: #1a1a2e; width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; margin-right: 12px;">4</span>
                        <strong style="color: #ff6b9d; font-size: 15px;">Access Score and Leaderboard via Pause Menu</strong>
                    </div>
                    <p style="color: #aaa; margin: 0 0 10px 40px; font-size: 13px; line-height: 1.6;">
                        Press <code style="background: #0f0f1e; padding: 2px 6px; border-radius: 3px; color: #00d4ff;">ESC</code> during gameplay to open the pause menu. This gives you access to:
                    </p>
                    <ul style="color: #888; margin: 0 0 0 60px; padding: 0; font-size: 13px; line-height: 1.8;">
                        <li><strong style="color: #fff;">Toggle Score</strong> - Show/hide the score counter</li>
                        <li><strong style="color: #fff;">Save Score</strong> - Submit your score to the backend</li>
                        <li><strong style="color: #fff;">Toggle Leaderboard</strong> - Show/hide the leaderboard</li>
                    </ul>
                </div>
            </div>
        </div>
        
        <!-- NEW SECTION: Enable by Default -->
        <div style="background: linear-gradient(135deg, #2d1b3d 0%, #1a1a2e 100%); border: 2px solid #a29bfe; border-radius: 12px; padding: 25px; margin-bottom: 30px;">
            <h3 style="color: #a29bfe; font-weight: 600; font-size: 20px; margin: 0 0 20px 0;">⚙️ Turn Score & Leaderboard On By Default</h3>
            
            <div style="background: #1a1a2e; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
                <h4 style="color: #00d4ff; font-weight: 600; font-size: 16px; margin: 0 0 15px 0;">Option 1: Auto-Initialize Score Counter (Recommended)</h4>
                <p style="color: #aaa; margin: 0 0 15px 0; font-size: 14px;">Add this to your Game.js constructor or initialization method:</p>
                <pre style="background: #0f0f1e; padding: 15px; border-radius: 6px; overflow-x: auto;"><code style="color: #ffffff; font-family: 'Courier New', monospace; font-size: 12px;"><span style="color: #888;">// In Game.js constructor, after gameControl is created</span>
<span style="color: #c44569;">if</span> (<span style="color: #c44569;">this</span>.gameControl?.gameEnv) {
    <span style="color: #c44569;">this</span>.gameControl.gameEnv.<span style="color: #a29bfe;">initScoreManager</span>().<span style="color: #a29bfe;">then</span>(() => {
        <span style="color: #888;">// Auto-show score counter on game start</span>
        <span style="color: #c44569;">this</span>.gameControl.gameEnv.scoreManager.<span style="color: #a29bfe;">toggleScoreDisplay</span>();
    });
}</code></pre>
            </div>
            
            <div style="background: #1a1a2e; border-radius: 8px; padding: 20px;">
                <h4 style="color: #4ecdc4; font-weight: 600; font-size: 16px; margin: 0 0 15px 0;">Option 2: Show Leaderboard on Load</h4>
                <p style="color: #aaa; margin: 0 0 15px 0; font-size: 14px;">Set <code style="background: #0f0f1e; padding: 2px 6px; border-radius: 3px; color: #ff6b9d;">initiallyHidden: false</code> when creating the leaderboard:</p>
                <pre style="background: #0f0f1e; padding: 15px; border-radius: 6px; overflow-x: auto;"><code style="color: #ffffff; font-family: 'Courier New', monospace; font-size: 12px;"><span style="color: #888;">// In your game initialization</span>
<span style="color: #c44569;">this</span>.leaderboardInstance = <span style="color: #c44569;">new</span> <span style="color: #a29bfe;">Leaderboard</span>(<span style="color: #c44569;">this</span>.gameControl, {
    gameName: <span style="color: #4ecdc4;">'AdventureGame'</span>,
    parentId: <span style="color: #4ecdc4;">'gameContainer'</span>,
    initiallyHidden: <span style="color: #c44569;">false</span>  <span style="color: #888;">// ← Change to false to show on load</span>
});

<span style="color: #888;">// Optional: Force positioning for consistent display</span>
<span style="color: #a29bfe;">setTimeout</span>(() => {
    <span style="color: #c44569;">const</span> container = document.<span style="color: #a29bfe;">getElementById</span>(<span style="color: #4ecdc4;">'leaderboard-container'</span>);
    <span style="color: #c44569;">if</span> (container) {
        container.style.position = <span style="color: #4ecdc4;">'fixed'</span>;
        container.style.top = <span style="color: #4ecdc4;">'80px'</span>;
        container.style.right = <span style="color: #4ecdc4;">'20px'</span>;
        container.style.zIndex = <span style="color: #4ecdc4;">'1000'</span>;
    }
}, <span style="color: #4ecdc4;">100</span>);</code></pre>
            </div>
            
            <div style="background: #2d1b3d; border-left: 3px solid #a29bfe; padding: 15px; border-radius: 6px; margin-top: 20px;">
                <strong style="color: #a29bfe;">💡 Pro Tip:</strong> 
                <span style="color: #aaa; font-size: 13px;">You can combine both options to show score counter AND leaderboard on game start. This is great for competitive games where players want to see rankings immediately!</span>
            </div>
        </div>
        
    </div>
</div>