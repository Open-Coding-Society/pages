---
layout: opencs
title: Game Debugging - Detailed Code Reference
description: Deep dive into the NPC and Player code, understanding how character interactions work
permalink: /gamify/debug-code-reference
categories: [Hacks, Game Development, CSSE]
---

<style>
.code-section {
    background: rgba(0,0,0,0.4);
    border-left: 4px solid var(--brand);
    padding: 20px;
    margin: 20px 0;
    border-radius: 8px;
}

.code-block {
    background: var(--code-bg);
    color: var(--ok);
    padding: 15px;
    border-radius: 6px;
    overflow-x: auto;
    font-family: 'Fira Code', monospace;
    font-size: 0.9em;
    line-height: 1.5;
    border: 1px solid var(--code-border);
    margin: 10px 0;
}

.code-explanation {
    background: rgba(100,150,255,0.1);
    border: 1px solid rgba(100,150,255,0.3);
    padding: 12px;
    margin: 10px 0;
    border-radius: 4px;
    font-size: 0.95em;
}

.line-numbers {
    color: var(--text);
    margin-right: 15px;
    user-select: none;
}

.highlight-line {
    background: rgba(255,150,0,0.2);
    padding: 2px 8px;
}

.method-card {
    background: rgba(50,80,120,0.2);
    border: 1px solid rgba(100,150,255,0.3);
    padding: 15px;
    margin: 10px 0;
    border-radius: 6px;
}

.method-name {
    font-family: 'Courier New', monospace;
    color: var(--ok);
    font-weight: bold;
    font-size: 0.95em;
}

.method-desc {
    color: var(--text);
    font-size: 0.9em;
    margin-top: 6px;
}

.diagram {
    background: rgba(0,0,0,0.3);
    border: 1px solid rgba(100,200,255,0.2);
    padding: 15px;
    margin: 15px 0;
    border-radius: 6px;
    font-family: monospace;
    font-size: 0.85em;
    color: var(--ok);
    overflow-x: auto;
}

.flow-diagram {
    text-align: center;
    padding: 20px;
    background: rgba(0,0,0,0.2);
    border-radius: 6px;
    margin: 15px 0;
}

.flow-item {
    display: inline-block;
    background: rgba(100,200,255,0.2);
    border: 1px solid rgba(100,200,255,0.4);
    padding: 10px 15px;
    margin: 5px;
    border-radius: 6px;
    font-size: 0.9em;
}

.flow-arrow {
    display: inline-block;
    margin: 0 10px;
    color: var(--brand);
    font-weight: bold;
}

.breakpoint-marker {
    color: var(--danger);
    font-weight: bold;
    margin-right: 8px;
}

.important-box {
    background: rgba(255,100,100,0.1);
    border: 2px solid rgba(255,100,100,0.4);
    padding: 15px;
    border-radius: 6px;
    margin: 15px 0;
}

.important-title {
    color: var(--danger);
    font-weight: bold;
    margin-bottom: 8px;
}

.comparison-table {
    width: 100%;
    border-collapse: collapse;
    margin: 15px 0;
}

.comparison-table th, .comparison-table td {
    border: 1px solid rgba(100,200,255,0.3);
    padding: 12px;
    text-align: left;
}

.comparison-table th {
    background: rgba(100,200,255,0.2);
    font-weight: bold;
}

.comparison-table tr:nth-child(even) {
    background: rgba(0,0,0,0.2);
}

.quiz-section {
    background: rgba(100,150,255,0.15);
    border: 2px solid rgba(100,150,255,0.3);
    padding: 15px;
    border-radius: 6px;
    margin: 15px 0;
}

.quiz-q {
    font-weight: bold;
    color: var(--brand);
    margin: 10px 0 8px 0;
}

.quiz-a {
    background: rgba(0,0,0,0.3);
    padding: 8px 12px;
    margin: 6px 0;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.2s;
}

.quiz-a:hover {
    background: rgba(100,200,255,0.2);
}

.answer-key {
    display: none;
    background: rgba(100,255,100,0.1);
    border: 1px solid rgba(100,255,100,0.3);
    padding: 10px;
    margin-top: 8px;
    border-radius: 4px;
    color: var(--ok);
}

.answer-key.shown {
    display: block;
}
</style>

# Game Debugging - Code Reference for CSSE Students

This guide deep-dives into how the adventure game works, specifically focusing on character interactions and the code you need to understand for debugging.

---

## Part A: The NPC Class - Your Target for Debugging

<div class="code-section">

### File Location: `/assets/js/GameEnginev1.5/Npc.js`

NPCs (Non-Player Characters) are characters that:
- Stand in fixed positions on the map
- Can display dialogue when the player presses E
- Respond to collision detection
- Have unique personality and messages

### Class Definition

<div class="code-block">
import Character from "./Character.js";
import DialogueSystem from "./DialogueSystem.js";

class Npc extends Character {
    constructor(data = null, gameEnv = null) {
        super(data, gameEnv);
        // NPC-specific properties:
        this.interact = data?.interact;
        this.currentQuestionIndex = 0;
        this.isInteracting = false;
        // ... more initialization
    }
}
</div>

### What Each Property Does

| Property | Type | Purpose | Example |
|----------|------|---------|---------|
| `id` | String | Unique NPC identifier | `"merchant"`, `"broken_npc"` |
| `spriteData` | Object | Image and animation info | `{src: "npc.png", rows: 4, cols: 3}` |
| `dialogueSystem` | DialogueSystem | Manages NPC speech | Created in constructor |
| `isInteracting` | Boolean | Whether player is currently talking | `true` or `false` |
| `handleKeyDownBound` | Function | Bound key listener | `this.handleKeyDown.bind(this)` |

### **CRITICAL: The Constructor - Where Bugs Happen**

<div class="code-block">
constructor(data = null, gameEnv = null) {
    super(data, gameEnv);
    
    // 1. Initialize unique ID
    this.uniqueId = data?.id + "_" + Math.random().toString(36).substr(2, 9);
    
    // 2. Create DialogueSystem (THIS CAN BE NULL IF MISSING!)
    if (data?.dialogues) {
        this.dialogueSystem = new DialogueSystem({
            dialogues: data.dialogues,
            id: this.uniqueId
        });
    } else {
        // Creates default dialogue
        this.dialogueSystem = new DialogueSystem({...});
    }
    
    // 3. Bind key listeners (MUST happen after initialization)
    this.handleKeyDownBound = this.handleKeyDown.bind(this);
    this.handleKeyUpBound = this.handleKeyUp.bind(this);
    this.bindInteractKeyListeners();
}
</div>

<div class="important-box">
<div class="important-title">Common Bug #1: Missing DialogueSystem</div>
If the DialogueSystem is never initialized, calling `this.dialogueSystem.show()` will crash with `TypeError: Cannot read property 'show' of null`.
</div>

</div>

---

## Part B: How Interaction Works - The Flow

<div class="code-section">

### The Complete Interaction Pipeline

<div class="flow-diagram">
<div class="flow-item">Player presses E key</div>
<div class="flow-arrow">→</div>
<div class="flow-item">handleKeyDown() fires</div>
<div class="flow-arrow">→</div>
<div class="flow-item">Check collision</div>
<div class="flow-arrow">→</div>
<div class="flow-item">Show dialogue</div>
</div>

### Step 1: Key Listener Setup

<div class="code-block">
bindInteractKeyListeners() {
    // Register this NPC's handler with the document
    document.addEventListener('keydown', this.handleKeyDownBound);
    document.addEventListener('keyup', this.handleKeyUpBound);
}
</div>

<div class="code-explanation">
<strong>What this does:</strong> When ANY key is pressed on the page, this NPC's <code>handleKeyDown()</code> method will be invoked. The <code>.bind(this)</code> ensures that inside the handler, <code>this</code> refers to the NPC object (not the window or document).
</div>

### Step 2: Handle the Keypress Event

<div class="code-block">
handleKeyDown(event) {
    // Check if the key pressed is 'E' (key code 69)
    if (event.key === 'e' || event.key === 'u') {
        this.handleKeyInteract();
    }
}
</div>

<div class="code-explanation">
<strong>Key codes:</strong> 'e' or 'u' are the interact keys. The game checks the string key name, not a numeric code. This is why you need to press 'E'.
</div>

### Step 3: Check Collision and Show Dialogue

<div class="code-block">
<span class="breakpoint-marker"></span>handleKeyInteract() {
    // Is the player close enough to this NPC?
    const nearPlayer = this.state?.collisionEvents?.includes('player_id');
    
    if (nearPlayer && this.dialogueSystem) {
        this.isInteracting = true;
        this.dialogueSystem.show();  // Show the dialogue
    }
}
</div>

<div class="code-explanation">
<strong>Critical checks:</strong>
<ol>
<li><code>this.state?.collisionEvents</code> - A list of what the NPC is currently touching. If it includes the player, they're close enough.</li>
<li><code>this.dialogueSystem</code> - Must exist! If it's <code>null</code>, this line crashes.</li>
<li><code>.show()</code> - Displays the dialogue UI to the player.</li>
</ol>
</div>

<div class="important-box">
<div class="important-title">Common Bug #2: Missing Collision Check</div>
If the NPC shows dialogue even when far away, something's wrong with collision detection. Check: <code>this.state.collisionEvents</code>
</div>

</div>

---

## Part C: Debugging Points - Where to Set Breakpoints

<div class="code-section">

### Recommended Breakpoint Locations

<table class="comparison-table">
<thead>
<tr>
<th>Line to Debug</th>
<th>Why Set Breakpoint Here</th>
<th>What to Check</th>
</tr>
</thead>
<tbody>
<tr>
<td><code>handleKeyDown(event)</code></td>
<td>Verify key press is detected</td>
<td><code>event.key</code> should be 'e' or 'u'</td>
</tr>
<tr>
<td><code>handleKeyInteract()</code></td>
<td>Check if collision works</td>
<td><code>this.state.collisionEvents</code> should have player</td>
</tr>
<tr>
<td><code>dialogueSystem.show()</code></td>
<td>Verify dialogue system exists</td>
<td><code>this.dialogueSystem</code> should NOT be null</td>
</tr>
<tr>
<td>Constructor</td>
<td>Check initialization</td>
<td><code>this.dialogueSystem</code>, <code>this.handleKeyDownBound</code> should exist</td>
</tr>
</tbody>
</table>

### How to Set a Breakpoint

<div class="code-block">
// In VS Code DevTools, locate this line in Npc.js:
handleKeyDown(event) {
    if (event.key === 'e' || event.key === 'u') {
        this.handleKeyInteract();  // ← Click line number here to set breakpoint
    }
}
</div>

**Steps:**
1. Open DevTools (F12)
2. Go to **Sources** tab
3. Find `Npc.js` file
4. Click the line number (you'll see a red dot)
5. Press E near the NPC in the game
6. Execution pauses at that line!

</div>

---

## Part D: The Player Class - What the NPC Interacts With

<div class="code-section">

### File Location: `/assets/js/GameEnginev1.5/Player.js`

The Player is the character YOU control. NPCs need to detect when the player is close.

### Key Player Properties for Debugging

<div class="code-block">
class Player extends Character {
    constructor(data) {
        super(data);
        this.id = data?.id?.toLowerCase() || `player1`;
        this.keypress = data?.keypress;  // WASD key codes
        this.pressedKeys = {};  // Track which keys are currently held
        this.state.collisionEvents = [];  // Array of NPCs/objects touching player
    }
}
</div>

### How Collision Works

<div class="code-block">
// When player touches an NPC, this array is updated:
this.state.collisionEvents = ['npc_merchant', 'npc_guard', ...];

// The NPC checks if it's in this list:
if (this.state.collisionEvents.includes(this.spriteData.id)) {
    console.log("We're touching the player!");
}
</div>

### Debug Commands for Player

<div class="code-block" style="background: var(--code-bg);">
// Get the player object
const player = window.gameEnv.gameObjects.find(o => o.id?.includes('player'));

// Check player position
console.log(player.x, player.y);

// Check what player is touching
console.log(player.state.collisionEvents);

// Check player's pressed keys (WASD movement)
console.log(player.pressedKeys);
</div>

</div>

---

## Part E: The DialogueSystem - What Displays Text

<div class="code-section">

### File Location: `/assets/js/GameEnginev1.5/DialogueSystem.js`

This system manages the dialogue UI that appears when you talk to an NPC.

### Creating a DialogueSystem

<div class="code-block">
const dialogueSystem = new DialogueSystem({
    dialogues: [
        "Hello, adventurer!",
        "I have a quest for you.",
        "Will you help?"
    ],
    id: "npc_merchant"
});
</div>

### Methods You Can Call

<div class="method-card">
<div class="method-name">dialogueSystem.show()</div>
<div class="method-desc">Display the dialogue UI with the next message</div>
</div>

<div class="method-card">
<div class="method-name">dialogueSystem.hideDialogue()</div>
<div class="method-desc">Close the dialogue UI (player presses escape or clicks)</div>
</div>

<div class="method-card">
<div class="method-name">dialogueSystem.isDialogueOpen()</div>
<div class="method-desc">Returns true if dialogue is currently showing</div>
</div>

### Debugging Dialogue

<div class="code-block" style="background: var(--code-bg);">
// Check if dialogue system exists
const npc = window.gameEnv.gameObjects.find(o => o.spriteData?.id === 'npc_merchant');
console.log(npc.dialogueSystem);  // Should NOT be null

// Check the dialogues array
console.log(npc.dialogueSystem.dialogues);

// Manually show dialogue
npc.dialogueSystem.show();

// Check if dialogue is open
console.log(npc.dialogueSystem.isDialogueOpen());
</div>

</div>

---

## Part F: Common Bugs and How to Find Them

<div class="code-section">

### Bug #1: "TypeError: Cannot read property 'show' of null"

<div class="important-box">
<div class="important-title">Symptoms</div>
Red error in console when you press E near NPC. The dialogue never shows.
</div>

**Root Cause:** `this.dialogueSystem` is `null`

**How to Debug:**
<div class="code-block" style="background: var(--code-bg);">
const npc = window.gameEnv.gameObjects.find(o => o.spriteData?.id === 'npc_name');
console.log(npc.dialogueSystem);  // If null, this is the problem!
</div>

**Fix:**
<div class="code-block">
// Manually create it:
const DialogueSystem = window.DialogueSystem; // Get the class
npc.dialogueSystem = new DialogueSystem({
    dialogues: ["Hello!"],
    id: npc.uniqueId
});
</div>

---

### Bug #2: Key Press Not Detected

<div class="important-box">
<div class="important-title">Symptoms</div>
You press E but nothing happens. No error in console.
</div>

**Root Cause:** Event listener not bound properly

**How to Debug:**
<div class="code-block" style="background: var(--code-bg);">
// Check if the bound handler exists
const npc = window.gameEnv.gameObjects.find(o => o.spriteData?.id === 'npc_name');
console.log(npc.handleKeyDownBound);  // Should be a function, not undefined

// Check if it's registered
console.log(npc.isInteracting);  // Track state
</div>

**Fix:**
<div class="code-block">
// Re-bind the event listener:
npc.handleKeyDownBound = npc.handleKeyDown.bind(npc);
document.addEventListener('keydown', npc.handleKeyDownBound);

// Or reset the NPC entirely
npc.removeInteractKeyListeners();
npc.bindInteractKeyListeners();
</div>

---

### Bug #3: Dialogue Shows Everywhere (No Collision Check)

<div class="important-box">
<div class="important-title">Symptoms</div>
NPC dialogue appears even when you're far away from them.
</div>

**Root Cause:** Collision detection broken or skipped

**How to Debug:**
<div class="code-block" style="background: var(--code-bg);">
// Check collision array
const player = window.gameEnv.gameObjects.find(o => o.id?.includes('player'));
const npc = window.gameEnv.gameObjects.find(o => o.spriteData?.id === 'npc_name');

console.log(player.state.collisionEvents);  // Does it include NPC?
console.log(player.x, player.y);  // Where is player?
console.log(npc.x, npc.y);  // Where is NPC?
</div>

**Fix:**
<div class="code-block">
// Add collision check if missing:
if (npc.state?.collisionEvents?.includes(player.spriteData.id)) {
    npc.dialogueSystem.show();
}
</div>

</div>

---

## Part G: Quiz - Test Your Understanding

<div class="quiz-section">

### Question 1: What Happens When Constructor Fails?

<div class="quiz-q">What is the main issue if the NPC constructor doesn't create a DialogueSystem?</div>
<div class="quiz-a" onclick="toggleAnswer(this)">A) The NPC won't spawn</div>
<div class="quiz-a" onclick="toggleAnswer(this)">B) Pressing E will crash with an error</div>
<div class="quiz-a" onclick="toggleAnswer(this)">C) The NPC will talk automatically</div>
<div class="quiz-a" onclick="toggleAnswer(this)">D) Nothing bad happens</div>
<div class="answer-key">
<strong>Answer: B</strong> - If dialogueSystem is null, calling .show() on it throws "Cannot read property 'show' of null"
</div>

---

### Question 2: Trace the Interaction Flow

<div class="quiz-q">In what order do these happen when you press E next to an NPC?</div>
<div class="quiz-a" onclick="toggleAnswer(this)">1) Show dialogue → 2) Check collision → 3) handleKeyDown() called</div>
<div class="quiz-a" onclick="toggleAnswer(this)">1) handleKeyDown() called → 2) Check collision → 3) Show dialogue</div>
<div class="quiz-a" onclick="toggleAnswer(this)">1) Check collision → 2) handleKeyDown() called → 3) Show dialogue</div>
<div class="quiz-a" onclick="toggleAnswer(this)">1) Show dialogue → 3) handleKeyDown() called</div>
<div class="answer-key">
<strong>Answer #2</strong> - The browser detects the key press first, then the NPC checks if you're close, THEN shows dialogue.
</div>

---

### Question 3: Debugging in the Console

<div class="quiz-q">What does this command check?</div>
<div style="background: var(--code-bg); padding: 8px; margin: 8px 0; border-radius: 4px; font-family: monospace; font-size: 0.9em;">npc.state.collisionEvents.includes(player.spriteData.id)</div>

<div class="quiz-a" onclick="toggleAnswer(this)">A) If the NPC is touching the player</div>
<div class="quiz-a" onclick="toggleAnswer(this)">B) If the player hit the NPC</div>
<div class="quiz-a" onclick="toggleAnswer(this)">C) If both A and B</div>
<div class="quiz-a" onclick="toggleAnswer(this)">D) If the NPC is visible</div>
<div class="answer-key">
<strong>Answer: A</strong> - This checks if the NPC's collision list includes the player, which means they're touching.
</div>

</div>

---

## Part H: Console Commands Cheat Sheet

<div class="code-section">

### Essential Commands for Game Debugging

<div class="code-block" style="background: var(--code-bg); color: var(--ok);">
// ===== EXPLORATION =====
// Get all game objects
window.gameEnv.gameObjects

// Find a specific NPC by name
const npc = window.gameEnv.gameObjects.find(o => o.spriteData?.id === 'npc_name')

// Find the player
const player = window.gameEnv.gameObjects.find(o => o.id?.includes('player'))

// ===== INSPECTION =====
// Check NPC properties
console.log(npc)
console.log(npc.dialogueSystem)
console.log(npc.state)

// Check collision detection
console.log(npc.state.collisionEvents)
console.log(player.state.collisionEvents)

// ===== TESTING =====
// Manually trigger interaction
npc.handleKeyInteract()

// Manually show dialogue
npc.dialogueSystem?.show()

// ===== LOGGING =====
// Log detailed NPC info
console.table(window.gameEnv.gameObjects.map(o => ({
    id: o.id || o.spriteData?.id,
    type: o.constructor.name,
    x: o.x,
    y: o.y
})))
</div>

</div>

---

## Resources for Further Learning

- [JavaScript Object Destructuring (?.)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Optional_chaining)
- [Event Listeners and .bind()](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener)
- [Array.includes() Method](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/includes)
- [DevTools Sources Debugging](https://developer.chrome.com/docs/devtools/sources/)

</script>

<script>
function toggleAnswer(element) {
    const answerKey = element.parentElement.querySelector('.answer-key');
    if (answerKey) {
        answerKey.classList.toggle('shown');
    }
}
</script>
