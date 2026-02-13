---
layout: opencs
title: Game Debugging - Teacher's Guide
description: Lesson plans, assessment rubrics, and implementation strategies for teaching game debugging
permalink: /gamify/debugging-teachers-guide
---

<style>
.lesson-section {
    background: linear-gradient(135deg, rgba(100,200,255,0.1), rgba(150,100,255,0.1));
    border-left: 4px solid var(--brand);
    padding: 20px;
    margin: 20px 0;
    border-radius: 8px;
}

.time-badge {
    display: inline-block;
    background: rgba(100,150,255,0.4);
    color: #fff;
    padding: 4px 10px;
    border-radius: 20px;
    font-size: 0.85em;
    font-weight: bold;
    margin: 5px 0;
}

.standard-box {
    background: rgba(220,150,100,0.15);
    border: 1px solid rgba(220,150,100,0.3);
    padding: 12px;
    margin: 10px 0;
    border-radius: 6px;
    font-size: 0.9em;
}

.standard-label {
    color: #cc9966;
    font-weight: bold;
    margin-bottom: 4px;
}

.learning-outcome {
    background: rgba(100,255,100,0.1);
    border-left: 3px solid var(--ok);
    padding: 10px;
    margin: 8px 0;
    border-radius: 4px;
}

.activity-box {
    background: rgba(150,200,255,0.15);
    border: 1px solid rgba(150,200,255,0.3);
    padding: 15px;
    margin: 15px 0;
    border-radius: 6px;
}

.activity-title {
    color: var(--brand);
    font-weight: bold;
    font-size: 1.05em;
    margin-bottom: 8px;
}

.materials-list {
    background: rgba(0,0,0,0.2);
    padding: 12px;
    border-radius: 4px;
    margin: 10px 0;
}

.materials-list li {
    margin: 6px 0;
    padding-left: 8px;
}

.assessment-rubric {
    width: 100%;
    border-collapse: collapse;
    margin: 15px 0;
    background: rgba(0,0,0,0.2);
}

.assessment-rubric th, .assessment-rubric td {
    border: 1px solid rgba(100,200,255,0.2);
    padding: 12px;
    text-align: left;
}

.assessment-rubric th {
    background: rgba(100,200,255,0.25);
    font-weight: bold;
}

.assessment-rubric tr:nth-child(even) {
    background: rgba(100,200,255,0.05);
}

.score-excellent {
    color: var(--ok);
    font-weight: bold;
}

.score-good {
    color: var(--warn);
    font-weight: bold;
}

.score-developing {
    color: var(--warn);
    font-weight: bold;
}

.extension-box {
    background: rgba(200,150,255,0.15);
    border: 1px solid rgba(200,150,255,0.3);
    padding: 15px;
    margin: 15px 0;
    border-radius: 6px;
}

.extension-title {
    color: var(--brand-2);
    font-weight: bold;
    margin-bottom: 8px;
}

.timeline {
    margin: 20px 0;
    padding: 20px;
    background: rgba(0,0,0,0.2);
    border-radius: 8px;
}

.timeline-item {
    display: flex;
    gap: 15px;
    margin-bottom: 15px;
    padding-bottom: 15px;
    border-bottom: 1px solid rgba(100,200,255,0.2);
}

.timeline-item:last-child {
    border-bottom: none;
    margin-bottom: 0;
}

.timeline-time {
    flex-shrink: 0;
    background: rgba(100,200,255,0.3);
    padding: 8px 12px;
    border-radius: 4px;
    font-weight: bold;
    font-size: 0.9em;
    min-width: 80px;
    text-align: center;
}

.timeline-content {
    flex: 1;
}

.timeline-content-title {
    font-weight: bold;
    color: #64b4ff;
    margin-bottom: 4px;
}

.differentiation-section {
    background: rgba(100,200,100,0.1);
    border: 1px solid rgba(100,200,100,0.3);
    padding: 15px;
    margin: 15px 0;
    border-radius: 6px;
}

.diff-level {
    margin: 12px 0;
    padding: 10px;
    background: rgba(0,0,0,0.2);
    border-radius: 4px;
}

.diff-level-title {
    font-weight: bold;
    color: var(--ok);
    margin-bottom: 4px;
}

.code-example {
    background: var(--code-bg);
    color: var(--ok);
    padding: 10px;
    border-radius: 4px;
    font-family: 'Courier New', monospace;
    font-size: 0.85em;
    margin: 8px 0;
    overflow-x: auto;
}

.notes-box {
    background: rgba(200,200,100,0.1);
    border-left: 3px solid var(--warn);
    padding: 12px;
    margin: 10px 0;
    border-radius: 4px;
    font-size: 0.9em;
}
</style>

# Game Debugging - Teacher's Guide

Welcome! This guide provides everything you need to teach game debugging to CSSE students using the adventure game. Includes lesson plans, assessment rubrics, and classroom strategies.

---

## Overview

<div class="lesson-section">

### What are students learning?

This unit teaches **critical thinking and systematic problem-solving** through the lens of game programming:

<div class="learning-outcome">
✓ Understand how browser developer tools work (Console, Inspector, Sources)
</div>

<div class="learning-outcome">
✓ Learn to read and interpret error messages
</div>

<div class="learning-outcome">
✓ Debug interactive code by setting breakpoints and stepping through execution
</div>

<div class="learning-outcome">
✓ Trace event-driven code (key presses → game responses)
</div>

<div class="learning-outcome">
✓ Fix character interaction systems in a real game
</div>

### Standards Alignment

<div class="standard-box">
<div class="standard-label">AP CS Principles</div>
Big Idea 4: Programming
- Learning Objective 4.2: Program implementation requires robust code
- Skills: Testing, debugging, and iterating on programs
</div>

<div class="standard-box">
<div class="standard-label">CSTA Standards</div>
Level 3A - Algorithms & Programming
- Decompose problems into sub-problems to facilitate the design, implementation, and review
- Evaluate and refine computational artifacts
</div>

### Prerequisites

Students should have:
- Basic JavaScript knowledge (functions, objects, arrays)
- Understanding of events and event listeners
- Familiarity with the adventure game
- Access to browser DevTools (Chrome/Firefox/Safari)

</div>

---

## Lesson 1: Console Basics & Game Inspection

<div class="lesson-section">

<div class="time-badge">⏱️ 25-30 minutes</div>

### Learning Objectives

1. Students will open and navigate browser DevTools
2. Students will execute JavaScript commands in the console
3. Students will inspect game objects and their properties

### Materials

<ul class="materials-list">
<li>Computers with browser (Chrome/Firefox recommended)</li>
<li><a href="{{site.baseurl}}/gamify/basic">Adventure Game</a></li>
<li><a href="{{site.baseurl}}/gamify/debugging">Main Debugging Guide</a> (Parts 1-2)</li>
<li>Projector/screen sharing for demo</li>
</ul>

### Lesson Flow

<div class="timeline">

<div class="timeline-item">
<div class="timeline-time">0-5 min</div>
<div class="timeline-content">
<div class="timeline-content-title">Hook</div>
"I broke the game on purpose. Can you help me figure out what's wrong?" Demo the broken NPC that won't talk. Reveal that the solution is in the browser console.
</div>
</div>

<div class="timeline-item">
<div class="timeline-time">5-12 min</div>
<div class="timeline-content">
<div class="timeline-content-title">Demo: Opening DevTools</div>
<strong>Project on screen:</strong> Open F12, show console, execute simple command like `console.log("Hello!")`. Have students follow along on their computers.
</div>
</div>

<div class="timeline-item">
<div class="timeline-time">12-18 min</div>
<div class="timeline-content">
<div class="timeline-content-title">Guided Practice</div>
Students execute provided commands with you:
<div class="code-example">
// Get the game canvas
const canvas = document.getElementById('gameCanvas');

// Check the game environment
console.log(window.gameEnv);

// Find all objects in the game
console.log(window.gameEnv.gameObjects);
</div>
Discuss what each output means.
</div>
</div>

<div class="timeline-item">
<div class="timeline-time">18-25 min</div>
<div class="timeline-content">
<div class="timeline-content-title">Independent Practice</div>
Students complete the exercises in Parts 1-2 of the debugging guide. Circulate and help as needed.
</div>
</div>

<div class="timeline-item">
<div class="timeline-time">25-30 min</div>
<div class="timeline-content">
<div class="timeline-content-title">Closure</div>
Share findings: "What did you discover about the game structure?" Student volunteers share console outputs.
</div>
</div>

</div>

### Key Teaching Points

<div class="activity-box">
<div class="activity-title">The Console is Your Superpower</div>
The console lets you interrogate a running program. Instead of guessing, you ask the program directly: "Are you working? What's your value? What are you touching?"
</div>

<div class="activity-box">
<div class="activity-title">The Optional Chaining Operator (?.)</div>
Code like `window.gameEnv?.gameObjects` safely accesses nested properties. The `?` prevents crashes if something is undefined.
<div class="code-example">
// Without safe chaining (crashes if gameEnv is undefined):
window.gameEnv.gameObjects

// With safe chaining (returns undefined, doesn't crash):
window.gameEnv?.gameObjects
</div>
</div>

### Common Misconceptions to Address

- "The console is for advanced programmers only" - No! It's a tool for everyone
- "I can't modify the game from the console" - Yes you can! (Show them changing CSS)
- "Errors mean I did something wrong" - Errors help you learn!

### Assessment

Formative: Ask students to show you the output of specific commands and explain what they see.

</div>

---

## Lesson 2: Inspecting Elements & Understanding the Code

<div class="lesson-section">

<div class="time-badge">⏱️ 30-35 minutes</div>

### Learning Objectives

1. Students will use the Inspector to view HTML structure
2. Students will understand how NPC and Player objects are organized
3. Students will locate buggy code in the sources

### Materials

<ul class="materials-list">
<li><a href="{{site.baseurl}}/gamify/debugging">Main Debugging Guide</a> (Parts 3)</li>
<li><a href="{{site.baseurl}}/hacks/edtech-tools-help/debug-code-reference">Code Reference</a> (Parts A-B)</li>
<li>Text editor or IDE (for reference, not editing yet)</li>
</ul>

### Lesson Flow

<div class="timeline">

<div class="timeline-item">
<div class="timeline-time">0-3 min</div>
<div class="timeline-content">
<div class="timeline-content-title">Review Previous Lesson</div>
Quick review: "How do you open the console? What does `window.gameEnv` give you?"
</div>
</div>

<div class="timeline-item">
<div class="timeline-time">3-10 min</div>
<div class="timeline-content">
<div class="timeline-content-title">Demo: Using the Inspector</div>
Show F12 → Elements tab → right-click game canvas → Inspect. Show the HTML hierarchy. Point out `<div id="gameContainer">` and `<canvas id="gameCanvas">`.
</div>
</div>

<div class="timeline-item">
<div class="timeline-time">10-20 min</div>
<div class="timeline-content">
<div class="timeline-content-title">Code Structure Walkthrough</div>
Show the Code Reference Parts A-B. Explain:
<ul>
<li>What is a class? (NPC, Player)</li>
<li>What is a constructor?</li>
<li>Why does the NPC need initialization?</li>
</ul>
Walk through the NPC constructor line-by-line.
</div>
</div>

<div class="timeline-item">
<div class="timeline-time">20-32 min</div>
<div class="timeline-content">
<div class="timeline-content-title">Guided Code Analysis</div>
Have students find Npc.js in DevTools Sources tab. Locate the handleKeyDown() method. Discuss what each line does.
</div>
</div>

<div class="timeline-item">
<div class="timeline-time">32-35 min</div>
<div class="timeline-content">
<div class="timeline-content-title">Exit Ticket</div>
"Why would an NPC need a dialogueSystem in its constructor?" Take 3-4 student responses.
</div>
</div>

</div>

### Key Teaching Points

<div class="activity-box">
<div class="activity-title">The Interaction Flow</div>
Help students see the chain of events:
<div class="code-example">
Key Press → Event Listener Fires → Check Collision → 
Show Dialogue (if close enough & dialogueSystem exists)
</div>
Every step must work, or the whole chain breaks!
</div>

<div class="activity-box">
<div class="activity-title">Why Initialization Matters</div>
The constructor is like building a house. If you forget to install the plumbing, closing the door later won't fix it. NPCs need their key systems set up in the constructor.
</div>

### Debugging Trace (Demo for Students)

<div class="code-example">
// What we know works:
const player = window.gameEnv.gameObjects.find(o => o.id.includes('player'));
console.log(player);  // Should show a big object ✓

// What might be broken:
const npc = window.gameEnv.gameObjects.find(o => o.spriteData?.id === 'npc_merchant');
console.log(npc.dialogueSystem);  // If null, this is the bug!
</div>

</div>

---

## Lesson 3: Using Breakpoints & Stepping Through Code

<div class="lesson-section">

<div class="time-badge">⏱️ 35-45 minutes</div>

### Learning Objectives

1. Students will set breakpoints in DevTools
2. Students will step through code execution (step over/into/out)
3. Students will inspect variables during execution pause
4. Students will trace event-driven code flow

### Materials

<ul class="materials-list">
<li><a href="{{site.baseurl}}/gamify/debugging">Main Debugging Guide</a> (Part 4)</li>
<li>Npc.js source file open in DevTools</li>
<li>Game running on screen</li>
</ul>

### Advanced Topic: Understanding .bind(this)

This is critical for understanding key listeners:

<div class="activity-box">
<div class="activity-title">Why .bind(this) Matters</div>

In the NPC constructor, we see:
<div class="code-example">
this.handleKeyDownBound = this.handleKeyDown.bind(this);
document.addEventListener('keydown', this.handleKeyDownBound);
</div>

**Without .bind(this):** When the browser calls handleKeyDown(), `this` would refer to the document (wrong!)
**With .bind(this):** The method remembers that `this` = the NPC object

This is a subtle JavaScript concept that impacts debugging!
</div>

### Lesson Flow

<div class="timeline">

<div class="timeline-item">
<div class="timeline-time">0-5 min</div>
<div class="timeline-content">
<div class="timeline-content-title">Context Setting</div>
"We've looked at the game structure. Now let's FREEZE the execution and examine it step-by-step like a time machine."
</div>
</div>

<div class="timeline-item">
<div class="timeline-time">5-15 min</div>
<div class="timeline-content">
<div class="timeline-content-title">Demo: Setting Your First Breakpoint</div>
<strong>Live demo with projector:</strong>
<ol>
<li>Open DevTools (F12)</li>
<li>Go to Sources tab</li>
<li>Find Npc.js file</li>
<li>Click on a line number to set breakpoint (red dot appears)</li>
<li>Trigger the condition (press E near NPC in game)</li>
<li>Code pauses! Show the execution highlighted</li>
</ol>
Have students follow along.
</div>
</div>

<div class="timeline-item">
<div class="timeline-time">15-25 min</div>
<div class="timeline-content">
<div class="timeline-content-title">Stepping Through Code</div>
Once paused, demonstrate:
<ul>
<li><strong>Step Over (F10):</strong> Execute current line, move to next</li>
<li><strong>Step Into (F11):</strong> Jump into function calls</li>
<li><strong>Continue (F8):</strong> Resume until next breakpoint</li>
</ul>

At each step, show variable values by hovering or inspecting the Scope panel.
</div>
</div>

<div class="timeline-item">
<div class="timeline-time">25-40 min</div>
<div class="timeline-content">
<div class="timeline-content-title">Guided Practice</div>
Students work in pairs. Each pair:
<ol>
<li>Sets a breakpoint in handleKeyDown()</li>
<li>Presses E near NPC in game</li>
<li>Steps into handleKeyInteract()</li>
<li>Checks the collision state</li>
<li>Screenshots and explains findings</li>
</ol>
Circulate and help with step-into/step-over confusion.
</div>
</div>

<div class="timeline-item">
<div class="timeline-time">40-45 min</div>
<div class="timeline-content">
<div class="timeline-content-title">Gallery Walk (Optional)</div>
Have pairs share their screenshot and explanation: "What was happening when you paused execution?"
</div>
</div>

</div>

### Watch Expressions (Advanced)

Show students how to watch a specific variable throughout execution:

<div class="code-example">
// In DevTools Sources, right-click in the Watch panel and add:
this.dialogueSystem
player.state.collisionEvents
this.isInteracting

// These update as you step through code!
</div>

</div>

---

## Lesson 4: The Mini-Game Challenge

<div class="lesson-section">

<div class="time-badge">⏱️ 40-50 minutes</div>

### Learning Objectives

1. Students will apply all debugging techniques to a real problem
2. Students will fix broken code using console commands
3. Students will verify their fix works
4. Students will explain their debugging process

### Materials

<ul class="materials-list">
<li><a href="{{site.baseurl}}/gamify/debug-npc-challenge">Interactive Debug Challenge</a></li>
<li><a href="{{site.baseurl}}/hacks/edtech-tools-help/debug-code-reference">Code Reference</a> (for checking answers)</li>
<li>Debugging Guide (all parts)</li>
</ul>

### The Challenge Explained

Students are given:
1. A game with a broken NPC
2. A step-by-step challenge to find the bug
3. Hints and code examples
4. A console where they can execute commands
5. A "Check" button to verify their fix

**The Bug:** The NPC's `dialogueSystem` was never initialized to `null` instead of a real DialogueSystem.

### Lesson Flow

<div class="timeline">

<div class="timeline-item">
<div class="timeline-time">0-3 min</div>
<div class="timeline-content">
<div class="timeline-content-title">Problem Presentation</div>
"This NPC is broken. They won't talk when you press E. Your job: fix them using the console. You have 45 minutes. Go!"
</div>
</div>

<div class="timeline-item">
<div class="timeline-time">3-15 min</div>
<div class="timeline-content">
<div class="timeline-content-title">Challenge 1: Find the Bug</div>
Students navigate to the challenge page, attempt Challenge 1. Guide them to use console commands to locate the broken NPC. First students to find it call out success.
</div>
</div>

<div class="timeline-item">
<div class="timeline-time">15-25 min</div>
<div class="timeline-content">
<div class="timeline-content-title">Challenge 2-3: Identify & Analyze</div>
Students determine what's wrong. They'll discover the dialogueSystem is null. Have them click "Reveal Bug Code" and analyze why it's broken.
</div>
</div>

<div class="timeline-item">
<div class="timeline-time">25-40 min</div>
<div class="timeline-content">
<div class="timeline-content-title">Challenge 4: Fix the Bug</div>
Students implement the fix. They might:
<ol>
<li>Use console commands to create a new DialogueSystem</li>
<li>Re-bind event listeners</li>
<li>Test by pressing E in the game</li>
</ol>
Some students will succeed quickly. For others, encourage using hints or consulting code reference.
</div>
</div>

<div class="timeline-item">
<div class="timeline-time">40-50 min</div>
<div class="timeline-content">
<div class="timeline-content-title">Debrief & Documentation</div>
<strong>Reflection prompt:</strong> "Write down: (1) What was wrong? (2) How did you figure it out? (3) What command fixed it?"

Have 2-3 students share their process with the class. Emphasize the debugging steps they took!
</div>
</div>

</div>

### Teacher Tips During Challenge

<div class="notes-box">
<strong> Facilitation Tips:</strong>
<ul>
<li>Let students struggle for 5-10 minutes before offering hints</li>
<li>Encourage them to read error messages carefully</li>
<li>Ask "What does the output tell you?" rather than giving answers</li>
<li>Celebrate first person to find the bug</li>
<li>For stuck students, ask "Have you checked the dialogueSystem?"</li>
</ul>
</div>

</div>

---

## Assessment Rubric

<div class="lesson-section">

### Debugging Challenge Scoring

<table class="assessment-rubric">
<thead>
<tr>
<th>Criteria</th>
<th>Excellent (4)</th>
<th>Good (3)</th>
<th>Developing (2)</th>
<th>Beginning (1)</th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>Problem Identification</strong></td>
<td><span class="score-excellent">Correctly identified dialogueSystem is null and explained why this breaks the code</span></td>
<td><span class="score-good">Identified the null dialogueSystem but explanation was incomplete</span></td>
<td><span class="score-developing">Found something was wrong but couldn't pinpoint what</span></td>
<td>Didn't successfully identify the problem</td>
</tr>
<tr>
<td><strong>Console Command Usage</strong></td>
<td><span class="score-excellent">Used multiple console commands effectively; understood variable values and properties</span></td>
<td><span class="score-good">Used some console commands correctly; mostly understood output</span></td>
<td><span class="score-developing">Attempted console commands; needed guidance on interpretation</span></td>
<td>Struggled with console use</td>
</tr>
<tr>
<td><strong>Debugging Process</strong></td>
<td><span class="score-excellent">Systematic approach: found NPC → checked properties → isolated issue → tested fix</span></td>
<td><span class="score-good">Generally methodical; some trial-and-error but got to the fix</span></td>
<td><span class="score-developing">Somewhat random approach; eventually found fix with help</span></td>
<td>Didn't follow clear debugging steps</td>
</tr>
<tr>
<td><strong>Verification & Testing</strong></td>
<td><span class="score-excellent">Tested fix multiple ways; confirmed NPC works; explained why it works</span></td>
<td><span class="score-good">Tested fix; confirmed it works</span></td>
<td><span class="score-developing">Attempted to test; fix partially works</span></td>
<td>Didn't verify the fix</td>
</tr>
<tr>
<td><strong>Code Understanding</strong></td>
<td><span class="score-excellent">Clearly explained constructor role, dialogueSystem purpose, and event binding</span></td>
<td><span class="score-good">Understood most concepts; some gaps in explanation</span></td>
<td><span class="score-developing">Basic understanding; struggled with specific concepts</span></td>
<td>Minimal understanding of the code</td>
</tr>
</tbody>
</table>

</div>

---

## Differentiation Strategies

<div class="differentiation-section">

### For Advanced Students

<div class="diff-level">
<div class="diff-level-title"> Stretch Goals:</div>

1. **Conditional Breakpoints:** Set breakpoints that only pause when a specific condition is true
   <div class="code-example">
// Breakpoint only triggers if player collision is empty:
this.state.collisionEvents.length === 0
   </div>

2. **Create a Custom NPC Bug:** Have them intentionally introduce a bug in the game, then trade with a peer to debug

3. **Extend the Challenge:** Add an NPC that has multiple bugs (missing dialogueSystem AND missing event listener)

4. **Browser API Exploration:** Have them modify game properties from console:
   <div class="code-example">
// Change NPC position
npc.x = 300;
npc.y = 200;

// Trigger collision manually
player.state.collisionEvents.push(npc.spriteData.id);
   </div>

</div>

### For Struggling Students

<div class="diff-level">
<div class="diff-level-title">🤝 Scaffolding:</div>

1. **Buddy System:** Pair with a stronger student for the challenge

2. **Simplified Console Guide:** Provide a handout of exact commands to type:
   <div class="code-example">
Step 1: Type this exact command:
window.gameEnv.gameObjects.find(o => o.spriteData?.id === 'broken_npc')

Step 2: Look at the output. Is dialogueSystem null?
   </div>

3. **Video Walkthrough:** Record a 10-minute video of the debugging process they can rewatch

4. **Partial Solution:** Show them the first fix command, have them apply the second one independently

5. **Written Reflection:** Instead of finding all bugs, have them explain what they found in writing

</div>

### For Second-Language Learners

<div class="diff-level">
<div class="diff-level-title">🌍 Language Support:</div>

1. Pre-teach vocabulary: "null", "dialogue", "collision", "initialize"
2. Provide term definitions sheet in their native language
3. Allow them to respond in writing rather than verbally
4. Pair with peer who speaks same language for partner work
5. Use visual diagrams more liberally; less text-heavy explanations

</div>

</div>

---

## Common Debugging Mistakes Students Make

<div class="lesson-section">

### Mistake #1: Not Reading the Error Message

<div class="activity-box">
<div class="activity-title">Red Flag: Student Types Random Commands</div>

Student sees an error, panics, and types random things hoping something works. 

**Better approach:** Read the error carefully.
<div class="code-example">
TypeError: Cannot read property 'show' of null
↑ This tells you: something.show() was called on something that is null
↑ In our game: dialogueSystem.show() failed because dialogueSystem is null
</div>

Teach them: **Errors are gifts!** They pinpoint the problem.
</div>

### Mistake #2: Confusing Null vs Undefined

<div class="activity-box">
<div class="activity-title">What's the Difference?</div>

<strong>null:</strong> Variable exists but set to "nothing" intentionally
<div class="code-example">
this.dialogueSystem = null;  // Explicitly set to null
</div>

<strong>undefined:</strong> Variable was never created/initialized
<div class="code-example">
console.log(npc.nonExistentProperty);  // undefined (wasn't created)
</div>

Both break code, but the cause is different!
</div>

### Mistake #3: Not Testing the Fix

<div class="activity-box">
<div class="activity-title">Student Fixes Code but Doesn't Verify</div>

They initialize dialogueSystem, but don't test if the NPC actually talks now.

**Always ask:** "Did you test it? How do you know it works?"

Testing is a key part of debugging!
</div>

</div>

---

## Extensions & Real-World Connections

<div class="extension-box">

<div class="extension-title">🔥 Going Deeper: Professional Debugging</div>

### Real-World Connection

Professional game developers use these EXACT tools every day:
- AAA game studios (Unity, Unreal Engine plugins use browser DevTools)
- Web game companies (Phaser, Three.js developers)
- Front-end engineers (React, Vue apps have similar debugging challenges)

### Extended Project

Have students create a "Bug Documentation" report:

<div class="code-example">
BUG REPORT TEMPLATE
===================

Bug Name: Silent Merchant NPC
Severity: High (Feature doesn't work)
Reproduction Steps:
  1. Navigate to game
  2. Move next to merchant
  3. Press E
Expected: Dialogue displays
Actual: Nothing happens
Root Cause: dialogueSystem is null
Evidence: 
  npc.dialogueSystem → null
Fix Applied:
  npc.dialogueSystem = new DialogueSystem({...})
Verification:
  ✓ NPC dialogue now shows
  ✓ Dialogue closes with ESC
  ✓ Multiple NPCs still work correctly
</div>

### Career Connection

Discuss: "QA testers find bugs. Developers debug them. Both essential!" 

Debugging is a **marketable skill** in tech careers.
</div>

---

## Assessment Ideas by Lesson

### Exit Tickets / Quick Checks

After Lesson 1:
> "How do you access the game's objects from the console?"

After Lesson 2:
> "Why is initialization important in the constructor?"

After Lesson 3:
> "What's the difference between Step Over and Step Into?"

After Lesson 4:
> "Explain your debugging process in 3-4 sentences. What did you learn?"

### Practical Assessments

- **Console Mastery:** Can they write console commands to inspect game state?
- **Breakpoint Setting:** Can they set conditional breakpoints correctly?
- **Code Reading:** Can they trace code execution in their head?
- **Problem-Solving:** Did they use a systematic approach to find the bug?

---

## Resources & Links

**Student Materials:**
- [Main Debugging Guide]({{site.baseurl}}/gamify/debugging) - Comprehensive lesson
- [Code Reference]({{site.baseurl}}/hacks/edtech-tools-help/debug-code-reference) - Deep dive into code
- [Interactive Challenge]({{site.baseurl}}/gamify/debug-npc-challenge) - Hands-on practice

**Browser DevTools Documentation:**
- [Chrome DevTools Guide](https://developer.chrome.com/docs/devtools/)
- [Firefox Developer Edition](https://www.mozilla.org/en-US/firefox/developer/)

**Supplementary Videos:**
- [Debugging Techniques](https://www.youtube.com/watch?v=HTGyWLMlAqw) (Recommend showing ~5min snippet)

---

## Notes for Implementation

 **Do:**
- Start with the demo; let students see it working before trying independently
- Celebrate small wins (first person to find NPC, first breakpoint, etc.)
- Use think-pair-share: individual reflection → partner discussion → class sharing
- Emphasize the **process** not just the answer

❌ **Don't:**
- Jump straight to the challenge; students need foundation first
- Use jargon without explanation (explain "null", "event listener", etc.)
- Expect everyone to move at same pace; differentiate as needed
- Let students give up; debugging takes persistence!

---

## Classroom Tips

<div class="notes-box">

**Managing Technology:**
- Test the game loads correctly 5 min before class
- Have a backup plan if DevTools don't appear (rare browser issue)
- Circulate constantly to see student screens
- Use "pair programming" if some students lack devices

**Student Engagement:**
- Frame as "detective work" not "fixing errors"
- Celebrate debugging successes vocally
- Have "office hours" for students who want extra help
- Consider a "debugging competition" for advanced students

**Common Fixes:**
- Can't open DevTools? Try Ctrl+Shift+I or right-click → Inspect
- Game won't load? Clear browser cache, reload
- Console commands fail? Make sure game is fully loaded first

</div>

---

## Questions?

This guide is living! If you find issues or improvements:
1. Test thoroughly before using with students
2. Note what works and what doesn't
3. Share feedback to improve for other teachers

Happy debugging! 🐛

