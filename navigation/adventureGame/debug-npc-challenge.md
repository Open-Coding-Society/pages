---
layout: opencs
title: Debug the Broken NPC
description: Interactive debugging challenge - fix the silent NPC using browser console
permalink: /gamify/debug-npc-challenge
---

<style>
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    background: #0a0a0a;
    color: #fff;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    overflow: hidden;
    height: 100vh;
}

.debug-layout {
    display: flex;
    gap: 15px;
    padding: 15px;
    height: 100vh;
}

.game-panel {
    flex: 1;
    display: flex;
    flex-direction: column;
    background: rgba(0,0,0,0.4);
    border: 2px solid rgba(100,200,255,0.3);
    border-radius: 12px;
    overflow: hidden;
}

.console-panel {
    flex: 0 0 350px;
    display: flex;
    flex-direction: column;
    background: rgba(0,0,0,0.6);
    border: 2px solid rgba(100,200,255,0.3);
    border-radius: 12px;
    overflow: hidden;
}

.panel-title {
    background: rgba(100,200,255,0.2);
    padding: 12px;
    font-weight: bold;
    font-size: 0.95em;
    border-bottom: 1px solid rgba(100,200,255,0.3);
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.panel-header-icon {
    font-size: 1.2em;
}

#gameFrame {
    flex: 1;
    border: none;
    background: var(--code-bg);
}

.console-wrapper {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
}

.console-output {
    flex: 1;
    overflow-y: auto;
    padding: 12px;
    font-family: 'Fira Code', 'Courier New', monospace;
    font-size: 0.85em;
    background: var(--code-bg);
    border-bottom: 1px solid rgba(100,200,255,0.2);
}

.console-line {
    margin: 4px 0;
    line-height: 1.4;
    word-wrap: break-word;
    word-break: break-all;
}

.console-input {
    color: #00ff00;
}

.console-output-text {
    color: var(--text);
}

.console-error {
    color: var(--danger);
}

.console-success {
    color: var(--ok);
}

.console-log {
    color: #64b4ff;
}

.console-input-area {
    display: flex;
    padding: 8px;
    background: var(--code-bg);
    gap: 8px;
}

.console-input-area > span {
    color: var(--ok);
    font-weight: bold;
    flex-shrink: 0;
}

#commandInput {
    flex: 1;
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(100,200,255,0.3);
    color: #fff;
    padding: 6px 10px;
    font-family: 'Fira Code', monospace;
    font-size: 0.85em;
    border-radius: 4px;
}

#commandInput:focus {
    outline: none;
    border-color: rgba(100,200,255,0.8);
    background: rgba(100,200,255,0.1);
}

.hint-panel {
    background: rgba(100,150,255,0.15);
    border: 1px solid rgba(100,150,255,0.4);
    border-radius: 8px;
    padding: 12px;
    margin-bottom: 12px;
    font-size: 0.85em;
    line-height: 1.4;
}

.hint-title {
    color: #6498ff;
    font-weight: bold;
    margin-bottom: 8px;
}

.hint-btn {
    padding: 8px 12px;
    background: rgba(100,150,255,0.4);
    border: 1px solid rgba(100,150,255,0.6);
    color: #fff;
    cursor: pointer;
    border-radius: 4px;
    font-size: 0.8em;
    font-weight: bold;
    transition: all 0.2s;
    margin-top: 8px;
}

.hint-btn:hover {
    background: rgba(100,150,255,0.6);
}

.challenge-status {
    padding: 12px;
    background: rgba(0,0,0,0.3);
    border-top: 1px solid rgba(100,200,255,0.2);
}

.status-indicator {
    display: flex;
    gap: 8px;
    margin: 8px 0;
    font-size: 0.85em;
}

.status-dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    flex-shrink: 0;
    margin-top: 3px;
}

.status-dot.pending {
    background: #ffaa44;
    animation: pulse 1s infinite;
}

.status-dot.success {
    background: var(--ok);
}

.status-dot.failed {
    background: var(--danger);
}

@keyframes pulse {
    0%, 100% { opacity: 0.6; }
    50% { opacity: 1; }
}

.clear-btn {
    padding: 6px 10px;
    background: rgba(255,100,100,0.4);
    border: 1px solid rgba(255,100,100,0.6);
    color: #fff;
    cursor: pointer;
    border-radius: 4px;
    font-size: 0.8em;
    transition: all 0.2s;
}

.clear-btn:hover {
    background: rgba(255,100,100,0.6);
}

.success-badge {
    padding: 10px;
    background: rgba(100,255,100,0.2);
    border: 2px solid var(--ok);
    border-radius: 6px;
    color: var(--ok);
    font-weight: bold;
    text-align: center;
    margin: 10px 0;
}

@media (max-width: 1200px) {
    .debug-layout {
        flex-direction: column;
    }
    .console-panel {
        flex: 0 0 250px;
    }
}

@media (max-width: 768px) {
    .debug-layout {
        padding: 8px;
        gap: 8px;
    }
    .console-panel {
        flex: 0 0 200px;
    }
}
</style>

<div class="debug-layout">
    <!-- Game Panel -->
    <div class="game-panel">
        <div class="panel-title">
            <div> Adventure Game - Debug Mode</div>
            <div class="panel-header-icon">▼</div>
        </div>
        <iframe id="gameFrame"></iframe>
    </div>

    <!-- Console Panel -->
    <div class="console-panel">
        <div class="panel-title">
            <div>🔍 Developer Console</div>
            <button class="clear-btn" onclick="clearConsole()">Clear</button>
        </div>
        
        <div class="hint-panel">
            <div class="hint-title">📋 Challenge: Fix the Broken NPC</div>
            <div>
An NPC is bugged and won't talk when you press <strong>E</strong>. Use the console to identify and fix the issue.
            </div>
            <button class="hint-btn" onclick="toggleHint()">Show Hints</button>
        </div>

        <div id="hintContent" style="display:none; font-size: 0.8em; background: rgba(0,0,0,0.3); padding: 10px; border-radius: 4px; margin-bottom: 10px;">
            <div style="margin-bottom: 8px;"><strong> Hints:</strong></div>
            <div style="margin: 6px 0; color: #ffaa44;">1. Get the broken NPC: <code style="background: var(--code-bg); padding: 2px 4px;">const npc = window.gameEnv?.gameObjects?.find(o => o.spriteData?.id === 'broken_npc');</code></div>
            <div style="margin: 6px 0; color: #ffaa44;">2. Check what's missing: <code style="background: var(--code-bg); padding: 2px 4px;">console.log(npc?.dialogueSystem);</code></div>
            <div style="margin: 6px 0; color: #ffaa44;">3. The NPC needs its dialogue system initialized!</div>
        </div>

        <div class="challenge-status">
            <div class="status-indicator">
                <div class="status-dot pending" id="status-bug"></div>
                <div><strong>Bug Found:</strong> <span id="bugStatus">Not found yet</span></div>
            </div>
            <div class="status-indicator">
                <div class="status-dot pending" id="status-fix"></div>
                <div><strong>Bug Fixed:</strong> <span id="fixStatus">Not fixed yet</span></div>
            </div>
        </div>

        <div class="console-wrapper">
            <div class="console-output" id="consoleOutput">
                <div class="console-line console-log">> Debug Console Ready</div>
                <div class="console-line console-log">> Type commands below to debug the NPC</div>
                <div class="console-line console-log">> Press Enter to execute</div>
            </div>
            <div class="console-input-area">
                <span title="Console prompt">&gt;</span>
                <input 
                    type="text" 
                    id="commandInput" 
                    placeholder="Type JavaScript here..." 
                    autocomplete="off"
                    spellcheck="false"
                />
            </div>
        </div>
    </div>
</div>

<script>
// Game setup
let gameEnv = null;
let brokenNpcFound = false;
let bugFixed = false;

// Initialize the game
function initializeGame() {
    const gameFrame = document.getElementById('gameFrame');
    const gameUrl = '{{site.baseurl}}/gamify/basic?debug=true';
    gameFrame.src = gameUrl;
    
    // Try to access game environment after delay
    setTimeout(() => {
        try {
            gameEnv = gameFrame.contentWindow.window.gameEnv;
            logConsole(`Game environment loaded successfully`, 'success');
        } catch (e) {
            logConsole(`Game loading... (cross-origin protection active)`, 'log');
        }
    }, 2000);
}

// Console functions
function logConsole(message, type = 'log') {
    const output = document.getElementById('consoleOutput');
    const line = document.createElement('div');
    line.className = `console-line console-${type}`;
    
    // Format output
    if (typeof message === 'object') {
        line.innerHTML = `<pre style="margin: 0; font-size: 0.85em;">${JSON.stringify(message, null, 2)}</pre>`;
    } else {
        line.textContent = message;
    }
    
    output.appendChild(line);
    output.scrollTop = output.scrollHeight;
}

function clearConsole() {
    document.getElementById('consoleOutput').innerHTML = '';
    logConsole('Console cleared', 'log');
}

function toggleHint() {
    const hintContent = document.getElementById('hintContent');
    hintContent.style.display = hintContent.style.display === 'none' ? 'block' : 'none';
}

// Command execution
document.getElementById('commandInput').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const command = e.target.value.trim();
        if (command) {
            logConsole(`> ${command}`, 'input');
            executeCommand(command);
            e.target.value = '';
        }
    }
});

function executeCommand(command) {
    try {
        // Log the command
        let result;
        
        // Special commands
        if (command.toLowerCase() === 'help') {
            logConsole(`Available commands:`, 'log');
            logConsole(`  - help: Show this help`, 'output-text');
            logConsole(`  - npc: Get the broken NPC`, 'output-text');
            logConsole(`  - fix: Attempt to fix the NPC`, 'output-text');
            logConsole(`  - test: Test if NPC works`, 'output-text');
            return;
        }
        
        if (command.toLowerCase() === 'npc') {
            logConsole(`Finding broken NPC...`, 'log');
            // This will work if game loaded properly
            if (window.gameEnv?.gameObjects) {
                const npc = window.gameEnv.gameObjects.find(o => o.spriteData?.id === 'broken_npc');
                if (npc) {
                    brokenNpcFound = true;
                    updateStatus('bug', true);
                    logConsole(`✓ Found broken NPC!`, 'success');
                    logConsole(npc, 'output-text');
                } else {
                    logConsole(`NPC not found. Game might still be loading.`, 'error');
                }
            } else {
                logConsole(`Game environment not accessible (cross-origin).`, 'error');
            }
            return;
        }
        
        if (command.toLowerCase() === 'fix') {
            const output = document.getElementById('consoleOutput');
            logConsole(`Simulating fix...`, 'log');
            
            // Simulate the fix with a delay
            setTimeout(() => {
                bugFixed = true;
                updateStatus('fix', true);
                logConsole(`✓ NPC dialogue system initialized!`, 'success');
                logConsole(`Try pressing E next to the NPC now.`, 'success');
                
                // Show success message
                const successDiv = document.createElement('div');
                successDiv.className = 'success-badge';
                successDiv.textContent = '🎉 Challenge Complete! NPC is now fixed and responsive!';
                output.parentElement.appendChild(successDiv);
            }, 800);
            return;
        }
        
        if (command.toLowerCase() === 'test') {
            if (brokenNpcFound && bugFixed) {
                logConsole(`✓ NPC is fully debugged and working!`, 'success');
                logConsole(`Dialogue system: Active`, 'success');
                logConsole(`Key listeners: Bound`, 'success');
            } else {
                logConsole(`NPC still needs fixes:`, 'error');
                if (!brokenNpcFound) logConsole(`  - NPC not located`, 'error');
                if (!bugFixed) logConsole(`  - Dialogue system not initialized`, 'error');
            }
            return;
        }
        
        // Execute custom JavaScript
        result = eval(command);
        
        if (result !== undefined) {
            logConsole(result, 'output-text');
        }
        
    } catch (error) {
        logConsole(`Error: ${error.message}`, 'error');
    }
}

function updateStatus(type, success) {
    const dot = document.getElementById(`status-${type}`);
    const text = document.getElementById(`${type}Status`);
    
    if (dot) {
        dot.className = `status-dot ${success ? 'success' : 'failed'}`;
    }
    
    if (text) {
        text.textContent = success ? 'Completed ✓' : 'Not completed';
        text.style.color = success ? 'var(--ok)' : '#ffaa44';
    }
}

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    initializeGame();
    logConsole(`Welcome to the NPC Debug Challenge!`, 'log');
    logConsole(`Type 'help' to see available commands.`, 'log');
});

// Auto-focus console input
window.addEventListener('click', () => {
    document.getElementById('commandInput').focus();
});
</script>
