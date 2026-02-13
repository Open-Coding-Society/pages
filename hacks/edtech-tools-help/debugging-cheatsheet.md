---
layout: opencs
title: Debugging Cheat Sheet
description: Quick reference guide - DevTools keyboard shortcuts, console commands, and debugging workflow
permalink: /gamify/debugging-cheatsheet
---

<style>
body {
    background: #f9f9f9;
    color: #333;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.page-content {
    max-width: 1000px;
}

.cheatsheet-header {
    background: linear-gradient(135deg, #0066cc, #0099ff);
    color: white;
    padding: 30px;
    border-radius: 8px;
    margin-bottom: 20px;
    text-align: center;
}

.cheatsheet-title {
    font-size: 2em;
    font-weight: bold;
    margin-bottom: 10px;
}

.cheatsheet-subtitle {
    font-size: 0.95em;
    opacity: 0.95;
}

.section {
    background: white;
    border: 2px solid #ddd;
    border-radius: 8px;
    padding: 20px;
    margin-bottom: 15px;
    page-break-inside: avoid;
}

.section-title {
    font-size: 1.3em;
    font-weight: bold;
    color: #0066cc;
    margin-bottom: 15px;
    border-bottom: 3px solid #0066cc;
    padding-bottom: 8px;
}

.command-block {
    background: #f5f5f5;
    border-left: 4px solid #0099ff;
    padding: 12px;
    margin: 10px 0;
    font-family: 'Courier New', monospace;
    font-size: 0.9em;
    overflow-x: auto;
}

.command-description {
    color: #666;
    font-size: 0.9em;
    margin-top: 6px;
    font-style: italic;
}

.shortcut-table {
    width: 100%;
    border-collapse: collapse;
    margin: 10px 0;
}

.shortcut-table th, .shortcut-table td {
    border: 1px solid #ddd;
    padding: 10px;
    text-align: left;
}

.shortcut-table th {
    background: #f0f0f0;
    font-weight: bold;
    color: #333;
}

.shortcut-table code {
    background: #f9f9f9;
    padding: 2px 6px;
    border-radius: 3px;
    font-family: 'Courier New', monospace;
}

.shortcut-key {
    background: #0099ff;
    color: white;
    padding: 4px 8px;
    border-radius: 4px;
    font-weight: bold;
    font-size: 0.85em;
    font-family: 'Courier New', monospace;
    display: inline-block;
}

.info-box {
    background: #e3f2fd;
    border-left: 4px solid #2196f3;
    padding: 12px;
    margin: 10px 0;
    border-radius: 4px;
}

.warning-box {
    background: #fff3e0;
    border-left: 4px solid #ff9800;
    padding: 12px;
    margin: 10px 0;
    border-radius: 4px;
}

.success-box {
    background: #e8f5e9;
    border-left: 4px solid #4caf50;
    padding: 12px;
    margin: 10px 0;
    border-radius: 4px;
}

.tip {
    color: #006600;
    font-weight: bold;
    margin-top: 8px;
}

.two-column {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 15px;
    margin: 15px 0;
}

.workflow-step {
    background: #f0f7ff;
    border: 1px solid #cce5ff;
    border-radius: 6px;
    padding: 12px;
    margin: 8px 0;
}

.step-number {
    display: inline-block;
    background: #0099ff;
    color: white;
    width: 28px;
    height: 28px;
    border-radius: 50%;
    text-align: center;
    line-height: 28px;
    font-weight: bold;
    margin-right: 10px;
}

.quick-links {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 10px;
    margin: 15px 0;
}

.quick-link {
    background: #f0f7ff;
    border: 1px solid #0099ff;
    padding: 10px;
    border-radius: 6px;
    text-decoration: none;
    color: #0066cc;
    font-weight: bold;
    text-align: center;
    transition: all 0.2s;
}

.quick-link:hover {
    background: #0099ff;
    color: white;
}

.common-bugs {
    background: #fce4ec;
    border-left: 4px solid #e91e63;
    padding: 12px;
    margin: 10px 0;
    border-radius: 4px;
}

.bug-title {
    font-weight: bold;
    color: #c2185b;
    margin-bottom: 6px;
}

.print-friendly {
    page-break-inside: avoid;
}

@media print {
    body {
        background: white;
    }
    .page-content {
        margin: 0;
        padding: 0;
    }
    .section {
        page-break-inside: avoid;
        break-inside: avoid;
    }
    .cheatsheet-header {
        page-break-after: avoid;
    }
}

@media (max-width: 768px) {
    .two-column {
        grid-template-columns: 1fr;
    }
    .cheatsheet-header {
        padding: 20px;
    }
    .cheatsheet-title {
        font-size: 1.5em;
    }
}
</style>

<div class="cheatsheet-header">
    <div class="cheatsheet-title">🔧 Debugging Cheat Sheet</div>
    <div class="cheatsheet-subtitle">Quick Reference for DevTools, Console Commands, and Bug Fixes</div>
</div>

---

##  Quick Start (30 Seconds)

1. Press <span class="shortcut-key">F12</span> to open DevTools
2. Click the **Console** tab
3. Type: `const npc = window.gameEnv?.gameObjects?.find(o => o.spriteData?.id === 'npc_name')`
4. Inspect the output to find bugs

---

<div class="section">
<div class="section-title">⌨️ Essential Keyboard Shortcuts</div>

<table class="shortcut-table">
<thead>
<tr>
<th>Action</th>
<th>Windows/Linux</th>
<th>Mac</th>
<th>Purpose</th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>Open DevTools</strong></td>
<td><span class="shortcut-key">F12</span></td>
<td><span class="shortcut-key">Cmd+Option+I</span></td>
<td>Open browser developer tools</td>
</tr>
<tr>
<td><strong>Inspect Element</strong></td>
<td><span class="shortcut-key">Ctrl+Shift+C</span></td>
<td><span class="shortcut-key">Cmd+Shift+C</span></td>
<td>Click elements to inspect them</td>
</tr>
<tr>
<td><strong>Go to Console</strong></td>
<td><span class="shortcut-key">Ctrl+Shift+J</span></td>
<td><span class="shortcut-key">Cmd+Option+J</span></td>
<td>Jump straight to console tab</td>
</tr>
<tr>
<td><strong>Step Over</strong></td>
<td><span class="shortcut-key">F10</span></td>
<td><span class="shortcut-key">F10</span></td>
<td>Execute current line, move to next</td>
</tr>
<tr>
<td><strong>Step Into</strong></td>
<td><span class="shortcut-key">F11</span></td>
<td><span class="shortcut-key">F11</span></td>
<td>Jump inside function calls</td>
</tr>
<tr>
<td><strong>Step Out</strong></td>
<td><span class="shortcut-key">Shift+F11</span></td>
<td><span class="shortcut-key">Shift+F11</span></td>
<td>Exit current function</td>
</tr>
<tr>
<td><strong>Continue</strong></td>
<td><span class="shortcut-key">F8</span></td>
<td><span class="shortcut-key">F8</span></td>
<td>Resume until next breakpoint</td>
</tr>
<tr>
<td><strong>Pause Execution</strong></td>
<td><span class="shortcut-key">Ctrl+</span></td>
<td><span class="shortcut-key">Cmd+</span></td>
<td>Pause running code</td>
</tr>
</tbody>
</table>

</div>

---

<div class="section print-friendly">
<div class="section-title"> Game Debugging Commands</div>

<div class="info-box">
<strong>📌 Remember:</strong> Type these in the Console tab (not in the game!)
</div>

### Find Game Objects

<div class="command-block">
// Get the game environment
window.gameEnv

// Get all objects in game
window.gameEnv.gameObjects

// Find a specific NPC
const npc = window.gameEnv?.gameObjects?.find(o => o.spriteData?.id === 'npc_name');

// Find the player
const player = window.gameEnv?.gameObjects?.find(o => o.id?.includes('player'));
</div>

### Inspect Object Properties

<div class="command-block">
// Check NPC details
console.log(npc)

// Check dialogue system
console.log(npc.dialogueSystem)

// Check position
console.log(npc.x, npc.y)

// Check collision detection
console.log(npc.state.collisionEvents)
</div>

### Debug Interaction Flow

<div class="command-block">
// Check if NPC has event listener
console.log(npc.handleKeyDownBound)

// Check if player is touching NPC
console.log(player.state.collisionEvents.includes(npc.spriteData.id))

// Check if dialogue is open
console.log(npc.dialogueSystem?.isDialogueOpen())
</div>

### Fix Common Bugs

<div class="command-block">
// Create missing dialogue system
npc.dialogueSystem = new DialogueSystem({
    dialogues: ["Hello!"],
    id: npc.uniqueId
});

// Re-bind key listeners
npc.handleKeyDownBound = npc.handleKeyDown.bind(npc);
document.addEventListener('keydown', npc.handleKeyDownBound);

// Manually trigger dialogue
npc.dialogueSystem?.show();
</div>

<div class="success-box">
<strong>✓ After fixing:</strong> Press E next to the NPC in the game to test!
</div>

</div>

---

<div class="section print-friendly">
<div class="section-title">🐛 Common Bugs & Quick Fixes</div>

<div class="common-bugs">
<div class="bug-title">❌ TypeError: Cannot read property 'show' of null</div>
<strong>Problem:</strong> NPC's dialogueSystem is null
<div class="command-block">
// Check it:
console.log(npc.dialogueSystem)

// Fix it:
npc.dialogueSystem = new DialogueSystem({
    dialogues: ["Hello!"],
    id: npc.uniqueId
});
</div>
</div>

<div class="common-bugs">
<div class="bug-title">❌ NPC won't talk (no error in console)</div>
<strong>Problem:</strong> Event listener didn't bind properly
<div class="command-block">
// Check it:
console.log(npc.handleKeyDownBound)

// Fix it:
npc.bindInteractKeyListeners();
</div>
</div>

<div class="common-bugs">
<div class="bug-title">❌ Dialogue shows when far away</div>
<strong>Problem:</strong> Missing collision check
<div class="command-block">
// Check it:
console.log(player.state.collisionEvents)

// The NPC should check collision before showing dialogue
</div>
</div>

<div class="common-bugs">
<div class="bug-title">❌ Breakpoint won't set</div>
<strong>Problem:</strong> 
• Make sure you're on the right line (not a comment)
• Refresh the page after opening DevTools
• Look for red circle on line number
</div>
</div>

</div>

---

<div class="section print-friendly">
<div class="section-title">🔍 Debugging Workflow</div>

<div class="workflow-step">
<span class="step-number">1</span>
<strong>Identify the problem:</strong> What's NOT working? (NPC won't talk? Game crashes?)
</div>

<div class="workflow-step">
<span class="step-number">2</span>
<strong>Form a hypothesis:</strong> What do you think went wrong? (Missing object? Bad event binding? Wrong collision check?)
</div>

<div class="workflow-step">
<span class="step-number">3</span>
<strong>Use console to test:</strong> Run commands to check properties and states. What do you see?
</div>

<div class="workflow-step">
<span class="step-number">4</span>
<strong>Locate the bug:</strong> Using console output, pinpoint exactly what's null, undefined, or broken
</div>

<div class="workflow-step">
<span class="step-number">5</span>
<strong>Apply the fix:</strong> Create missing objects, re-bind listeners, or fix broken logic in the console
</div>

<div class="workflow-step">
<span class="step-number">6</span>
<strong>Verify the fix:</strong> Test in the game (press E, look for dialogue). Does it work?
</div>

</div>

---

<div class="section print-friendly">
<div class="section-title">📚 Understanding the Error Messages</div>

<table class="shortcut-table">
<thead>
<tr>
<th>Error Message</th>
<th>Means</th>
<th>Solution</th>
</tr>
</thead>
<tbody>
<tr>
<td><code>TypeError: Cannot read property 'X' of null</code></td>
<td>You tried to access property X on something that is null</td>
<td>Check if the object exists: <code>console.log(obj)</code></td>
</tr>
<tr>
<td><code>undefined</code></td>
<td>A variable or property doesn't exist</td>
<td>Check if it was initialized: <code>console.log(obj?.property)</code></td>
</tr>
<tr>
<td><code>ReferenceError: X is not defined</code></td>
<td>You used a variable that doesn't exist</td>
<td>Check spelling and scope. Did you create it first?</td>
</tr>
<tr>
<td><code>SyntaxError: Unexpected token</code></td>
<td>Your code has a typo or wrong syntax</td>
<td>Check for: missing parentheses, quotes, semicolons</td>
</tr>
</tbody>
</table>

<div class="tip"> <strong>Pro tip:</strong> Red errors in console are your friends! They tell you exactly what went wrong and on which line!</div>

</div>

---

<div class="section print-friendly">
<div class="section-title"> Console.log() Examples</div>

<table class="shortcut-table">
<thead>
<tr>
<th>Command</th>
<th>What It Shows</th>
</tr>
</thead>
<tbody>
<tr>
<td><code>console.log(npc)</code></td>
<td>The entire NPC object with all properties</td>
</tr>
<tr>
<td><code>console.log(npc.id)</code></td>
<td>Just the NPC's ID string</td>
</tr>
<tr>
<td><code>console.log(typeof npc)</code></td>
<td>What type of thing it is (object, string, function, etc.)</td>
</tr>
<tr>
<td><code>console.log(!!npc)</code></td>
<td>Is it truthy? (true = exists, false = null/undefined)</td>
</tr>
<tr>
<td><code>console.table(items)</code></td>
<td>Shows an array as a nice formatted table</td>
</tr>
<tr>
<td><code>console.error("text")</code></td>
<td>Print an error message (shows in red)</td>
</tr>
</tbody>
</table>

</div>

---

<div class="section print-friendly">
<div class="section-title">🔑 Key Debugging Concepts</div>

<div class="info-box">
<strong>null:</strong> A variable that intentionally holds nothing / doesn't refer to anything
<div class="command-block">
obj = null;  // Explicitly set to "nothing"
</div>
</div>

<div class="info-box">
<strong>undefined:</strong> A variable that was never initialized / doesn't exist
<div class="command-block">
console.log(obj.nonExistentProperty);  // undefined
</div>
</div>

<div class="info-box">
<strong>Event Listener:</strong> Code that "listens" for an event (like a key press) and runs when it happens
<div class="command-block">
// This listens for keydown events
document.addEventListener('keydown', function() {
    console.log("A key was pressed!");
});
</div>
</div>

<div class="info-box">
<strong>.bind(this):</strong> Makes sure `this` refers to the right object inside a function
<div class="command-block">
// Without .bind: this = document
// With .bind(npc): this = the NPC object
npc.handleKeyDown.bind(npc);
</div>
</div>

<div class="info-box">
<strong>Optional Chaining (?.):</strong> Safely access properties without crashing if something is undefined
<div class="command-block">
// Without ?.: crashes if gameEnv is undefined
window.gameEnv.gameObjects

// With ?.: returns undefined, doesn't crash
window.gameEnv?.gameObjects
</div>
</div>

</div>

---

<div class="section print-friendly">
<div class="section-title"> The Debugging Checklist</div>

Before asking for help, verify:

<div class="success-box">
☐ I opened DevTools (F12)<br>
☐ I went to the Console tab<br>
☐ I read any red error messages carefully<br>
☐ I ran console.log() to inspect the object<br>
☐ I checked if the key property is null or undefined<br>
☐ I looked at the Code Reference guide<br>
☐ I tried the console commands shown in the guide<br>
☐ I tested the fix in the actual game<br>
</div>

</div>

---

<div class="section print-friendly">
<div class="section-title">📖 Links to Full Resources</div>

<div class="quick-links">
<a href="{{site.baseurl}}/gamify/debugging" class="quick-link">Main Guide</a>
<a href="{{site.baseurl}}/hacks/edtech-tools-help/debug-code-reference" class="quick-link">Code Reference</a>
<a href="{{site.baseurl}}/gamify/debug-npc-challenge" class="quick-link">Challenge</a>
<a href="{{site.baseurl}}/hacks/edtech-tools-help/debugging-teachers-guide" class="quick-link">Teacher Guide</a>
</div>

</div>

---

<div style="text-align: center; margin-top: 30px; padding: 20px; background: #f0f7ff; border-radius: 8px;">
<strong>💬 Need Help?</strong><br>
Ask your teacher or classmates. Debugging is a team activity!<br><br>
<strong>🎓 Want to Learn More?</strong><br>
Check out the full <a href="{{site.baseurl}}/gamify/debugging">Debugging Guide</a> for detailed explanations.
</div>

---

**📌 Print This Page:** Use your browser's Print function (Ctrl+P or Cmd+P) to create a physical reference card!

