---
layout: opencs
title: Debugging Games with Browser DevTools
description: Learn how to use console, inspectors, and breakpoints to debug the adventure game
permalink: /gamify/debugging
categories: [Hacks, Game Development]
---

<h1>Debugging Games with Browser DevTools</h1>

<p>Welcome to the Debugging Games lesson! This guide teaches you how to use the browser's developer tools to understand, inspect, and fix code in the adventure game. By the end, you'll be able to debug game issues like character interactions and understand how the game works under the hood.</p>

<hr>

<h2>Part 1: Opening DevTools and Using the Console</h2>

<h3>Step 1: Open DevTools</h3>

<p><strong>What to do:</strong></p>
<ol>
    <li>Press <code>F12</code> or <code>Ctrl+Shift+I</code> (Windows/Linux) / <code>Cmd+Option+I</code> (Mac)</li>
    <li>You'll see the Developer Tools panel appear at the bottom or side of your screen</li>
</ol>

<h3>Step 2: Find the Console Tab</h3>

<p><strong>What to look for:</strong></p>
<ul>
    <li>Look for the tab labeled <strong>Console</strong> in the DevTools panel</li>
    <li>Click it to open the console where you can type JavaScript commands</li>
</ul>

<h3>The Console: Your Debugging Playground</h3>

<p>The console serves three main purposes:</p>

<ul>
    <li><strong>View Logs:</strong> See messages the game sends to help debug</li>
    <li><strong>Execute Code:</strong> Run JavaScript commands to inspect and modify the game</li>
    <li><strong>Inspect Objects:</strong> Explore the game's internal data structures</li>
</ul>

<h3>Try This First:</h3>

<p>Type this into the console and press Enter:</p>

<pre><code>console.log("Hello, Debugger!");</code></pre>

<p>You should see <code>Hello, Debugger!</code> printed back to you. This is how the game communicates with developers!</p>

<p><strong>Tip:</strong> You can see what the game itself is logging. Look in the console for messages like "Game started" or "NPC spawned". These help you understand what's happening.</p>

<hr>

<h2>Part 2: Inspecting the Game Canvas and Elements</h2>

<h3>Understanding the Page Structure</h3>

<p>The game has several key elements you can inspect:</p>

<ol>
    <li><strong>The Canvas</strong> (<code>&lt;canvas id='gameCanvas'&gt;</code>) - Where the game actually draws</li>
    <li><strong>The Game Container</strong> - The div that holds everything</li>
    <li><strong>UI Elements</strong> - Buttons, dropdowns, and score displays</li>
</ol>

<h3>Step 1: Inspect the Canvas</h3>

<p><strong>What to do:</strong></p>
<ol>
    <li>Press <code>Ctrl+Shift+C</code> (Inspect Element tool)</li>
    <li>Click on the game canvas area</li>
    <li>You'll see the HTML highlighted showing <code>&lt;canvas id='gameCanvas'&gt;&lt;/canvas&gt;</code></li>
</ol>

<h3>Step 2: View Element Properties</h3>

<p><strong>In the Inspector (Elements tab), you can see:</strong></p>
<ul>
    <li><strong>HTML Structure</strong> - How elements are organized</li>
    <li><strong>CSS Styles</strong> - The visual styling applied</li>
    <li><strong>Attributes</strong> - Properties like <code>id</code>, <code>width</code>, <code>height</code></li>
</ul>

<pre><code>&lt;div id="gameContainer"&gt;
    &lt;div id="promptDropDown"&gt;&lt;/div&gt;
    &lt;canvas id="gameCanvas"&gt;&lt;/canvas&gt;
&lt;/div&gt;</code></pre>

<h3>Access Game Objects from Console</h3>

<p>You can access and manipulate page elements directly from the console:</p>

<pre><code>// Get the canvas element
const canvas = document.getElementById('gameCanvas');

// Get the container
const gameContainer = document.getElementById('gameContainer');

// Check the canvas size
console.log(canvas.width, canvas.height);</code></pre>

<p><strong>Tip:</strong> You can modify elements on the fly! Try: <code>canvas.style.border = '2px solid red';</code> to add a border around the game.</p>

<hr>

<h2>Part 3: Understanding Game Objects</h2>

<h3>What's Running Behind the Scenes?</h3>

<p>The adventure game has several key JavaScript files working together:</p>

<p><strong>Game Architecture:</strong></p>

<pre><code>Player (character you control)
  ├─ velocity (speed of movement)
  ├─ direction (which way facing)
  ├─ position (x, y coordinates)
  └─ collisionEvents (what the player is touching)

NPC (characters you can talk to)
  ├─ position (x, y on the map)
  ├─ dialogueSystem (what they say)
  ├─ collisionEvents (detection with player)
  └─ interact() method (what happens when you press E)

GameEnv (the game environment)
  ├─ gameObjects (all objects in the world)
  ├─ gameControl (controls game flow)
  └─ collisionDetection (checks what touches what)</code></pre>

<h3>Finding Instances in the Console</h3>

<p>Modern games store instances globally so developers can debug them. Try typing:</p>

<pre><code>// Find the player object
const player = window.gameEnv?.gameObjects?.find(obj => obj.id?.includes('player'));
console.log(player);</code></pre>

<p>If this works, you'll see all the player's properties displayed!</p>

<p><strong>Note:</strong> If the game hasn't fully initialized yet, these objects might not exist. Wait for the game to load completely!</p>

<hr>

<h2>Part 4: Using Breakpoints to Pause Execution</h2>

<h3>What Are Breakpoints?</h3>

<p>A breakpoint is like a <strong>stop sign</strong> in your code. When the code hits a breakpoint, execution <strong>pauses</strong>, and you can:</p>
<ul>
    <li>See what variables contain at that moment</li>
    <li>Step through code line by line</li>
    <li>Understand the flow of execution</li>
</ul>

<h3>Method 1: Set Breakpoints in DevTools</h3>

<p><strong>Steps:</strong></p>
<ol>
    <li>Open DevTools (F12)</li>
    <li>Go to the <strong>Sources</strong> tab</li>
    <li>Find the file you want to debug (e.g., <code>Player.js</code> or <code>Npc.js</code>)</li>
    <li>Click on the line number to set a breakpoint (a red dot appears)</li>
    <li>When that line executes, the code will pause</li>
</ol>

<pre><code>class Player {
    handleKeyDown({ keyCode }) {         // ← Click line number to set breakpoint
        this.pressedKeys[keyCode] = true; // Code pauses here
        this.updateVelocityAndDirection();
    }
}</code></pre>

<h3>Method 2: Breakpoints with Conditions</h3>

<p>Right-click a line number and select "Add conditional breakpoint" to pause only when a condition is true:</p>

<pre><code>// Only pause if the player is trying to move up
keyCode === 87</code></pre>

<h3>Stepping Through Code</h3>

<p>Once paused at a breakpoint, use these buttons:</p>

<ul>
    <li><strong>Step Over (F10):</strong> Execute current line, move to next</li>
    <li><strong>Step Into (F11):</strong> Jump inside function calls to see details</li>
    <li><strong>Step Out (Shift+F11):</strong> Exit the current function</li>
    <li><strong>Continue (F8):</strong> Resume execution until next breakpoint</li>
</ul>

<p><strong>Tip:</strong> When paused, hover over variables to see their current values. Or use the Watch panel to track specific variables throughout execution.</p>

<hr>

<h2>Part 5: Debugging Character Interactions</h2>

<h3>How NPC Interactions Work</h3>

<p>When you press <strong>E</strong> near an NPC, this is what happens:</p>

<pre><code>1. Game detects key press (keyCode === 69 for 'E')
2. Checks if player is colliding with an NPC
3. If yes → calls NPC's interact() method
4. Interact() opens dialogue system to show NPC's text</code></pre>

<h3>The Interaction Flow</h3>

<pre><code>// In Npc.js
handleKeyDown(event) {
    if (event.key === 'e') {
        this.handleKeyInteract();  // ← Set breakpoint here!
    }
}

handleKeyInteract() {
    // Check if player is overlapping with this NPC
    const isColliding = this.state.collisionEvents?.includes(this.spriteData.id);
    
    if (isColliding && this.dialogueSystem) {
        this.dialogueSystem.show(); // ← Opens the dialogue
    }
}</code></pre>

<h3>Common Issues to Debug</h3>

<p><strong>Issue: NPC won't talk when you press E</strong></p>

<p>Debug checklist:</p>
<ol>
    <li>Is the E key actually being detected? (check <code>event.key</code>)</li>
    <li>Is the player close enough? (check <code>isColliding</code>)</li>
    <li>Does the dialogueSystem exist? (check <code>this.dialogueSystem</code>)</li>
</ol>

<h3>Console Commands to Check NPC State</h3>

<pre><code>// Find all NPCs in the game
const npcs = window.gameEnv?.gameObjects?.filter(obj => obj.spriteData?.id?.includes('npc'));
console.log(npcs);

// Check a specific NPC's dialogue system
console.log(npcs[0]?.dialogueSystem);

// Check if player is colliding with an NPC
console.log(npcs[0]?.state?.collisionEvents);

// Manually trigger dialogue (for testing!)
npcs[0]?.dialogueSystem?.show();</code></pre>

<hr>

<h2>Part 6: Mini-Game - Debug the Silent NPC!</h2>

<h3>The Challenge</h3>

<p>An NPC in the game world is <strong>broken</strong>. They won't talk when you press E, even though you're standing right next to them! Your mission:</p>

<p><strong>Use the browser console and DevTools to find the bug and fix it.</strong></p>

<style>
  #debugMiniGameFrame {
    background: #161b22;
    border: 2px solid #7c3aed;
    border-radius: 18px;
    padding: 2rem;
    margin: 1.5rem 0;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
    font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto;
  }

  .game-canvas {
    position: relative;
    width: 100%;
    height: 400px;
    background: #0d1117;
    border: 2px solid #7c3aed;
    border-radius: 12px;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 1rem 0;
    box-shadow: inset 0 2px 8px rgba(0, 0, 0, 0.3);
  }

  .game-entity {
    position: absolute;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;
    transition: transform 0.1s ease;
  }

  .sprite {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 2rem;
    font-weight: bold;
    border: 3px solid;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  }

  .player-sprite {
    background: #06b6d4;
    border-color: #06b6d4;
  }

  .npc-sprite {
    background: #a855f7;
    border-color: #a855f7;
  }

  .npc-sprite.broken {
    opacity: 0.6;
    background: #ef4444;
    border-color: #ef4444;
    animation: flicker 0.4s infinite;
  }

  @keyframes flicker {
    0%, 100% { opacity: 0.6; }
    50% { opacity: 0.4; }
  }

  .entity-label {
    font-size: 0.8rem;
    color: #f0f6fc;
    font-weight: 600;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
    letter-spacing: 0.5px;
  }

  .interaction-prompt {
    position: absolute;
    bottom: 10px;
    left: 50%;
    transform: translateX(-50%);
    background: #10b981;
    color: #f0f6fc;
    padding: 0.5rem 1rem;
    border-radius: 999px;
    font-size: 0.85rem;
    font-weight: 600;
    border: 1px solid #10b981;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.3s ease;
  }

  .interaction-prompt.show {
    opacity: 1;
  }

  .broken-prompt {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: #ef4444;
    color: #f0f6fc;
    padding: 1rem;
    border-radius: 8px;
    font-size: 0.9rem;
    font-weight: 600;
    border: 2px solid #ef4444;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.3s ease;
    text-align: center;
  }

  .broken-prompt.show {
    opacity: 1;
  }

  .game-info {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
    margin-top: 1rem;
    font-size: 0.9rem;
  }

  .info-card {
    background: #161b22;
    border: 1px solid #7c3aed;
    border-radius: 8px;
    padding: 0.75rem;
    color: #c9d1d9;
  }

  .info-label {
    color: #8b949e;
    font-size: 0.8rem;
    text-transform: uppercase;
    letter-spacing: 1px;
    margin-bottom: 0.3rem;
  }

  .info-value {
    color: #f0f6fc;
    font-weight: 600;
    font-size: 0.95rem;
  }

  .game-instructions {
    background: #161b22;
    border: 1px solid #7c3aed;
    border-radius: 8px;
    padding: 1rem;
    margin-top: 1rem;
    color: #c9d1d9;
    font-size: 0.9rem;
  }

  .game-instructions strong {
    color: #f0f6fc;
  }

  .console-hint {
    background: #0d1117;
    border: 1px solid #30363d;
    border-radius: 8px;
    padding: 0.75rem;
    margin-top: 0.5rem;
    color: #7ee787;
    font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, "Liberation Mono";
    font-size: 0.8rem;
    overflow-x: auto;
  }

  .console-hint code {
    background: transparent;
    border: none;
    padding: 0;
    color: #79c0ff;
  }

  .status-ok {
    color: #10b981;
  }

  .status-broken {
    color: #ef4444;
  }

  .status-fixed {
    color: #10b981;
  }

  .npc-sprite.fixed {
    opacity: 1;
    background: #10b981;
    border-color: #10b981;
    animation: none;
  }

  .success-popup {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: #10b981;
    border: 3px solid #10b981;
    border-radius: 12px;
    padding: 2.5rem;
    color: #0d1117;
    text-align: center;
    box-shadow: 0 20px 60px rgba(16, 185, 129, 0.5);
    z-index: 1000;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.3s ease;
    max-width: 400px;
  }

  .success-popup.show {
    opacity: 1;
    pointer-events: auto;
  }

  .success-popup h2 {
    margin: 0 0 0.75rem 0;
    font-size: 1.8rem;
    color: #0d1117;
    font-weight: 700;
  }

  .success-popup p {
    margin: 0.75rem 0;
    color: #0d1117;
    font-weight: 500;
  }

  .npc-message {
    position: absolute;
    top: -80px;
    left: 50%;
    transform: translateX(-50%);
    background: #10b981;
    color: #0d1117;
    padding: 0.75rem 1.2rem;
    border-radius: 8px;
    font-size: 0.9rem;
    font-weight: 600;
    white-space: nowrap;
    opacity: 0;
    transition: opacity 0.3s ease;
    pointer-events: none;
    border: 2px solid #10b981;
  }

  .npc-message.show {
    opacity: 1;
  }

  .npc-sprite.human {
    animation: none;
  }
</style>

<div id="debugMiniGameFrame">
  <div class="game-canvas" id="gameCanvas">
    <div class="game-entity player" id="player">
      <div class="sprite player-sprite">👤</div>
      <div class="entity-label">You (Press E)</div>
    </div>

    <div class="game-entity npc broken" id="npc">
      <div class="sprite npc-sprite broken">🤖</div>
      <div class="entity-label">Broken NPC</div>
      <div class="npc-message" id="npcMessage">Hi, nice to meet you. My name is Alex.</div>
    </div>

    <div class="interaction-prompt" id="interactionPrompt">
      Press <strong>E</strong> to interact
    </div>

    <div class="broken-prompt" id="brokenPrompt">
      NPC is broken!<br>
      Check the console
    </div>
  </div>

  <div class="game-info">
    <div class="info-card">
      <div class="info-label">Distance to NPC</div>
      <div class="info-value" id="distanceDisplay">Calculating...</div>
    </div>
    <div class="info-card">
      <div class="info-label">NPC Status</div>
      <div class="info-value status-broken" id="npcStatusDisplay">BROKEN</div>
    </div>
  </div>

  <div class="game-instructions">
    <strong>How to Play:</strong>
    <ul style="margin: 0.5rem 0; padding-left: 1.2rem;">
      <li>Use <strong>WASD</strong> or <strong>Arrow Keys</strong> to move</li>
      <li>Get close to the NPC and press <strong>E</strong> to interact</li>
      <li>The NPC is broken - they won't respond!</li>
      <li>Open DevTools (F12) and use the console to discover and fix the bug</li>
    </ul>
    <div class="console-hint">
      Try: <code>const npc = window.gameEnv.gameObjects[0]; console.log(npc);</code>
    </div>
  </div>

  <p id="gameLoadStatus" style="text-align: center; color: #7ee787; margin-top: 1rem;">
    ✓ Game ready! Start moving and debugging.
  </p>

  <div class="success-popup" id="successPopup">
    <h2>Success!</h2>
    <p>NPC Fixed</p>
    <p style="font-size: 0.95rem;">Press E to talk to the NPC now</p>
  </div>
</div>

<script>
  // Initialize game environment
  window.gameEnv = {
    gameObjects: [],
    gameControl: {
      collisionDetection: true
    }
  };

  // Game configuration
  const GAME_CONFIG = {
    INTERACTION_DISTANCE: 120,
    MOVE_SPEED: 5,
    CANVAS_PADDING: 30
  };

  // Dialogue System class
  class DialogueSystem {
    constructor(config) {
      this.id = config.id;
      this.dialogues = config.dialogues || ["Hello!"];
      this.currentIndex = 0;
    }

    show() {
      console.log(`[NPC ${this.id}]: ${this.dialogues[this.currentIndex]}`);
      this.currentIndex = (this.currentIndex + 1) % this.dialogues.length;
    }
  }

  // NPC class
  class NPC {
    constructor(id, x, y) {
      this.uniqueId = id;
      this.spriteData = { id: 'broken_npc' };
      this.x = x;
      this.y = y;
      this.width = 60;
      this.height = 60;
      this.dialogueSystem = null; // BUG: Not initialized!
      this.handleKeyDownBound = null;
      this.state = { collisionEvents: [] };
    }

    interact() {
      try {
        if (this.dialogueSystem && this.dialogueSystem.show) {
          this.dialogueSystem.show();
          return true;
        }
        if (!this.dialogueSystem) {
          console.error(`[NPC ${this.uniqueId}] Error: dialogueSystem is null!`);
        }
        return false;
      } catch (err) {
        console.error(`[NPC ${this.uniqueId}] Interaction error:`, err);
        return false;
      }
    }

    handleKeyDown(event) {
      if (event.key.toLowerCase() === 'e') {
        this.interact();
      }
    }

    render() {
      const npcEl = document.getElementById('npc');
      if (npcEl) {
        npcEl.style.left = (this.x - this.width / 2) + 'px';
        npcEl.style.top = (this.y - this.height / 2) + 'px';
      }
    }
  }

  // Player class
  class Player {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.width = 60;
      this.height = 60;
      this.velocityX = 0;
      this.velocityY = 0;
      this.keysPressed = {};
    }

    update() {
      this.velocityX = 0;
      this.velocityY = 0;

      if (this.keysPressed['w'] || this.keysPressed['arrowup']) this.velocityY = -GAME_CONFIG.MOVE_SPEED;
      if (this.keysPressed['s'] || this.keysPressed['arrowdown']) this.velocityY = GAME_CONFIG.MOVE_SPEED;
      if (this.keysPressed['a'] || this.keysPressed['arrowleft']) this.velocityX = -GAME_CONFIG.MOVE_SPEED;
      if (this.keysPressed['d'] || this.keysPressed['arrowright']) this.velocityX = GAME_CONFIG.MOVE_SPEED;

      this.x += this.velocityX;
      this.y += this.velocityY;

      // Keep player in bounds
      const canvas = document.getElementById('gameCanvas');
      this.x = Math.max(GAME_CONFIG.CANVAS_PADDING, Math.min(canvas.offsetWidth - GAME_CONFIG.CANVAS_PADDING, this.x));
      this.y = Math.max(GAME_CONFIG.CANVAS_PADDING, Math.min(canvas.offsetHeight - GAME_CONFIG.CANVAS_PADDING, this.y));
    }

    render() {
      const playerEl = document.getElementById('player');
      if (playerEl) {
        playerEl.style.left = (this.x - this.width / 2) + 'px';
        playerEl.style.top = (this.y - this.height / 2) + 'px';
      }
    }
  }

  // Game state
  const gameState = {
    player: new Player(150, 200),
    npc: new NPC('npc_1', 450, 200),
    running: true,
    isFixed: false
  };

  // Add to global scope for debugging
  window.gameEnv.gameObjects = [gameState.npc];
  window.gameEnv.gameControl.player = gameState.player;
  window.DialogueSystem = DialogueSystem;

  // Distance calculation
  function calculateDistance(obj1, obj2) {
    const dx = obj1.x - obj2.x;
    const dy = obj1.y - obj2.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  // Check proximity and show prompt
  function updateProximity() {
    const distance = calculateDistance(gameState.player, gameState.npc);
    const prompt = document.getElementById('interactionPrompt');
    const brokenPrompt = document.getElementById('brokenPrompt');
    const distDisplay = document.getElementById('distanceDisplay');

    distDisplay.textContent = Math.round(distance) + ' pixels';

    if (distance < GAME_CONFIG.INTERACTION_DISTANCE) {
      prompt.classList.add('show');
    } else {
      prompt.classList.remove('show');
      brokenPrompt.classList.remove('show');
    }
  }

  // Handle keyboard input
  document.addEventListener('keydown', (e) => {
    gameState.player.keysPressed[e.key.toLowerCase()] = true;

    if (e.key.toLowerCase() === 'e') {
      const distance = calculateDistance(gameState.player, gameState.npc);
      if (distance < GAME_CONFIG.INTERACTION_DISTANCE) {
        const result = gameState.npc.interact();
        // Only show broken prompt if NPC is not fixed
        if (!result && !gameState.isFixed) {
          document.getElementById('brokenPrompt').classList.add('show');
          setTimeout(() => {
            document.getElementById('brokenPrompt').classList.remove('show');
          }, 2500);
        }
      }
    }
  });

  document.addEventListener('keyup', (e) => {
    gameState.player.keysPressed[e.key.toLowerCase()] = false;
  });

  // Game loop
  function gameLoop() {
    gameState.player.update();
    gameState.player.render();
    gameState.npc.render();
    updateProximity();

    if (gameState.running) {
      requestAnimationFrame(gameLoop);
    }
  }

  // Initialize
  document.addEventListener('DOMContentLoaded', () => {
    gameState.player.render();
    gameState.npc.render();
    gameLoop();

    console.log('%c[Debugging Game Initialized]', 'color: #7ee787; font-weight: bold;');
    console.log('Try these commands in the console:');
    console.log('  window.gameEnv - See all game objects');
    console.log('  window.gameEnv.gameObjects[0] - Get the broken NPC');
    console.log('  window.gameEnv.gameObjects[0].dialogueSystem - Check dialogue system');
  });
</script>

<h3>Debug Steps</h3>

<h4>Challenge 1: Find the Broken Code</h4>

<p><strong>What to do:</strong></p>
<ol>
    <li>Open DevTools (F12)</li>
    <li>Go to the <strong>Console</strong> tab</li>
    <li>Type this command to find the broken NPC:</li>
</ol>

<pre><code>const brokenNpc = window.gameEnv?.gameObjects
    ?.find(obj => obj.spriteData?.id === 'broken_npc');
console.log(brokenNpc);</code></pre>

<p>What do you see? Check each property:</p>
<ul>
    <li>Does <code>brokenNpc</code> exist?</li>
    <li>Does it have a <code>dialogueSystem</code>?</li>
    <li>Is the <code>dialogueSystem</code> null or undefined?</li>
</ul>

<button onclick="revealHint(1)">Show Hint 1</button>
<div id="hint1" style="display:none;">
    <p><strong>Hint:</strong> Try logging different properties. Do this in console: <code>console.log(brokenNpc?.dialogueSystem);</code></p>
</div>

<h4>Challenge 2: Identify the Bug</h4>

<p><strong>Bug Types to Look For:</strong></p>

<pre><code>// Bug 1: dialogueSystem is null
brokenNpc.dialogueSystem // shows: null

// Bug 2: interact method is broken
brokenNpc.interact // shows: undefined

// Bug 3: keypress listener not working
// (check the console for errors when you press E)

// Bug 4: collision detection broken
brokenNpc.state.collisionEvents // shows: empty array when near player</code></pre>

<p><strong>Your task:</strong> Figure out which bug it is by testing commands in the console.</p>

<button onclick="revealHint(2)">Show Hint 2</button>
<div id="hint2" style="display:none;">
    <p><strong>Hint:</strong> Errors in the console are very helpful! Look for ANY red error messages when you press E next to the NPC.</p>
</div>

<h4>Challenge 3: Reveal the Bug Code</h4>

<p>Click below to see the buggy line that needs fixing:</p>

<button onclick="revealBugCode()" id="revealBtn">Reveal Buggy Code</button>
<div id="bugCodeContainer" style="display:none;">
    <p><strong>Buggy Code (Line 45 in Npc.js):</strong></p>
    <pre><code>// BUG: Missing initialization!
this.dialogueSystem = null;  // Should have actually created it!

// The broken handleKeyDownBound binding
this.handleKeyDownBound = this.handleKeyDown.bind(this);
// But we never attached the listener!
// Missing: document.addEventListener('keydown', this.handleKeyDownBound);</code></pre>
    <p><strong>Why it breaks:</strong></p>
    <p>The NPC object was created without initializing its dialogue system, so when you press E, the code tries to call a method on <code>null</code>.</p>
</div>

<h4>Challenge 4: Fix It with Console Commands</h4>

<p>Now that you know the bug, fix it directly in the console! Type:</p>

<button onclick="revealFixCode()" id="fixBtn">Show Fix Code</button>
<div id="fixCodeDisplay" style="display:none;">
    <p><strong>How to Fix:</strong></p>
    <p>The issue was that the NPC's <code>dialogueSystem</code> was never initialized! We need to:</p>
    <ol>
        <li>Create a DialogueSystem for the NPC</li>
        <li>Make sure event listeners are bound properly</li>
        <li>Test by pressing E when near the NPC</li>
    </ol>
</div>

<div id="fixCode" style="display:none;">
    <pre><code>// Step 1: Get the broken NPC
const npc = window.gameEnv.gameObjects.find(o => o.spriteData?.id === 'broken_npc');

// Step 2: Create the missing dialogue system
const DialogueSystem = window.DialogueSystem || await import('...dialogueSystem.js');
npc.dialogueSystem = new DialogueSystem({
    dialogues: ["Hello! Thanks for fixing me!"],
    id: npc.uniqueId
});

// Step 3: Re-bind the key listener
npc.handleKeyDownBound = npc.handleKeyDown.bind(npc);
document.addEventListener('keydown', npc.handleKeyDownBound);</code></pre>
</div>

<p><strong>Try pressing E next to the NPC now. Did it work?</strong></p>

<h3>Complete the Challenge!</h3>

<button onclick="checkDebugSuccess()" id="checkBtn">Check If NPC is Fixed!</button>
<div id="successMessage" style="display:none;">
    <p><strong>Success!</strong> You've successfully debugged the NPC!</p>
    <p>The NPC now responds when you press E. This is the same process game developers use to find and fix bugs!</p>
</div>

<h3>Progress</h3>

<div>
    <div id="debugProgress" style="width: 0%;"></div>
</div>

<hr>

<h2>Part 7: Key Takeaways</h2>

<h3>What You've Learned</h3>

<ul>
    <li><strong>Console:</strong> Use it to log, inspect, and execute code</li>
    <li><strong>Inspector:</strong> Right-click and Inspect to see HTML and CSS</li>
    <li><strong>Breakpoints:</strong> Pause code execution to debug step-by-step</li>
    <li><strong>Game Objects:</strong> Access game entities through JavaScript</li>
    <li><strong>Interaction Debugging:</strong> Trace how key presses to game events</li>
</ul>

<h3>Debugging Mindset</h3>

<p>When something breaks in a game:</p>

<ol>
    <li><strong>Observe</strong> - What's not working?</li>
    <li><strong>Hypothesis</strong> - What do you think is wrong?</li>
    <li><strong>Test</strong> - Use console commands to verify</li>
    <li><strong>Fix</strong> - Modify the code or object state</li>
    <li><strong>Verify</strong> - Test that it works now</li>
</ol>

<h3>Try These Commands</h3>

<p>Save these for future debugging:</p>

<pre><code>// General game info
console.log(window.gameEnv);

// Find player
window.gameEnv.gameObjects.find(o => o.id?.includes('player'));

// Find all NPCs
window.gameEnv.gameObjects.filter(o => o.spriteData?.id?.includes('npc'));

// Check collisions
window.gameEnv.gameControl.collisionDetection;

// Enable detailed logging
window.DEBUG_MODE = true;</code></pre>

<hr>

<h2>Resources</h2>

<ul>
    <li><a href="https://developer.mozilla.org/en-US/docs/Learn/Common_questions/Tools_and_setup/What_are_browser_developer_tools">MDN Web Docs: Browser DevTools</a></li>
    <li><a href="https://developer.chrome.com/docs/devtools/">Google Chrome DevTools Guide</a></li>
    <li><a href="https://www.mozilla.org/en-US/firefox/developer/">Firefox Developer Edition</a></li>
</ul>

<script>
// Mini-game helper functions
function revealHint(num) {
    const hint = document.getElementById('hint' + num);
    if (hint) {
        hint.style.display = hint.style.display === 'none' ? 'block' : 'none';
    }
}

function revealBugCode() {
    const container = document.getElementById('bugCodeContainer');
    if (container) {
        container.style.display = container.style.display === 'none' ? 'block' : 'none';
        document.getElementById('revealBtn').textContent = 'Hide Buggy Code';
    }
}

function revealFixCode() {
    const container = document.getElementById('fixCodeDisplay');
    const codeBlock = document.getElementById('fixCode');
    if (container) {
        container.style.display = container.style.display === 'none' ? 'block' : 'none';
        if (codeBlock) codeBlock.style.display = container.style.display;
        document.getElementById('fixBtn').textContent = container.style.display === 'none' ? 'Show Fix Code' : 'Hide Fix Code';
    }
}

function updateProgress(percent) {
    const progress = document.getElementById('debugProgress');
    if (progress) {
        progress.style.width = percent + '%';
    }
}

function checkDebugSuccess() {
    if (gameState.isFixed) {
        console.log('NPC is already fixed!');
        return;
    }

    // Fix the NPC by initializing its dialogue system
    gameState.npc.dialogueSystem = new window.DialogueSystem({
        dialogues: [
            "Hey! Thanks for fixing me!",
            "I can talk now! 🎉",
            "You're a great debugger!",
            "Want to hear a joke about debugging?",
            "Always check the console logs!",
            "This is what proper initialization looks like!"
        ],
        id: gameState.npc.uniqueId
    });

    // Make sure dialogueSystem is properly set
    if (!gameState.npc.dialogueSystem || typeof gameState.npc.dialogueSystem.show !== 'function') {
        console.error('Failed to initialize dialogue system properly');
        return;
    }

    // Mark as fixed
    gameState.isFixed = true;

    // Update visual state - remove broken class and add fixed
    const npcElement = document.getElementById('npc');
    const npcSprite = npcElement.querySelector('.npc-sprite');
    const npcLabel = npcElement.querySelector('.entity-label');
    const npcMessage = document.getElementById('npcMessage');
    
    npcElement.classList.remove('broken');
    npcSprite.classList.remove('broken');
    npcSprite.classList.add('fixed', 'human');
    npcSprite.textContent = '👨';
    npcLabel.textContent = 'Alex';
    
    // Show the NPC message
    if (npcMessage) {
        setTimeout(() => {
            npcMessage.classList.add('show');
        }, 300);
    }

    // Update status display
    const statusDisplay = document.getElementById('npcStatusDisplay');
    statusDisplay.textContent = 'FIXED';
    statusDisplay.className = 'info-value status-fixed';

    // Hide any broken prompts
    const brokenPrompt = document.getElementById('brokenPrompt');
    if (brokenPrompt) {
        brokenPrompt.classList.remove('show');
        brokenPrompt.style.pointerEvents = 'none';
    }

    // Show success popup
    const popup = document.getElementById('successPopup');
    popup.classList.add('show');

    // Log to console with styling
    console.log('%cNPC FIXED!', 'color: #10b981; font-weight: bold; font-size: 14px;');
    console.log('%cThe NPC dialogue system has been initialized!', 'color: #7ee787;');
    console.log('%cTry pressing E next to the NPC to hear them talk!', 'color: #d1fae5;');
    console.log('window.gameEnv.gameObjects[0].interact();');

    // Hide popup after 3 seconds
    setTimeout(() => {
        popup.classList.remove('show');
    }, 3000);
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    updateProgress(15);
    const statusEl = document.getElementById('gameLoadStatus');
    if (statusEl) {
        statusEl.textContent = 'Debug scenario ready! Open DevTools (F12) and start debugging.';
    }
});
</script>