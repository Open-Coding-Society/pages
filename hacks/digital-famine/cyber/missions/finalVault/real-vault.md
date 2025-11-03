---
layout: post
title: "Final Sequence — The Vault"
description: "Unlock the Sacred Vault — assemble the three code fragments, authenticate, and retrieve the Sacred Page."
permalink: /digital-famine/cybersecurity-game/vault-final
categories: [CSP, Submodule, Vault]
tags: [vault, final, mission, security]
author: Arnav Pallapotu, Sathwik Kintada
date: 2025-10-26
microblog: True
breadcrumb: True
footer:
  previous: /digital-famine/cybersecurity-game/vault-quiz
  home: /digital-famine/cybersecurity-game
  next: /digital-famine
---

<style>
    .vault-game-wrapper {
        font-family: Arial, sans-serif;
        max-width: 1200px;
        margin: 0 auto;
        padding: 20px;
        background-color: #1a1a1a;
        color: #e0e0e0;
    }
    .vault-game-wrapper .container {
        background-color: #2a2a2a;
        border: 2px solid #444;
        border-radius: 8px;
        padding: 30px;
        margin-bottom: 20px;
    }
    .vault-game-wrapper h1 {
        text-align: center;
        color: #4a9eff;
    }
    .vault-game-wrapper h2 {
        color: #6ab7ff;
        border-bottom: 1px solid #444;
        padding-bottom: 10px;
    }
    .vault-game-wrapper .terminals {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 20px;
        margin: 20px 0;
    }
    .vault-game-wrapper .terminal {
        background-color: #333;
        border: 2px solid #555;
        border-radius: 5px;
        padding: 20px;
    }
    .vault-game-wrapper .terminal.authenticated {
        border-color: #4caf50;
    }
    .vault-game-wrapper .terminal h3 {
        margin-top: 0;
        color: #4a9eff;
    }
    .vault-game-wrapper input[type="text"] {
        width: 100%;
        padding: 10px;
        margin: 10px 0;
        background-color: #1a1a1a;
        border: 1px solid #555;
        color: #4caf50;
        font-family: monospace;
        font-size: 16px;
        border-radius: 3px;
        box-sizing: border-box;
    }
    .vault-game-wrapper button {
        width: 100%;
        padding: 12px;
        background-color: #4a9eff;
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        font-size: 16px;
        font-weight: bold;
    }
    .vault-game-wrapper button:hover {
        background-color: #3a8eef;
    }
    .vault-game-wrapper button:disabled {
        background-color: #555;
        cursor: not-allowed;
    }
    .vault-game-wrapper .status {
        text-align: center;
        margin-top: 10px;
        font-weight: bold;
    }
    .vault-game-wrapper .status.authenticated {
        color: #4caf50;
    }
    .vault-game-wrapper .error {
        background-color: #5a1a1a;
        border: 1px solid #ff4444;
        color: #ff6666;
        padding: 10px;
        border-radius: 5px;
        margin: 10px 0;
    }
    .vault-game-wrapper .code-display {
        background-color: #1a1a1a;
        border: 1px solid #555;
        padding: 15px;
        border-radius: 5px;
        margin: 10px 0;
        font-family: monospace;
    }
    .vault-game-wrapper .code-display .suffix {
        color: #ffd700;
        font-weight: bold;
    }
    .vault-game-wrapper .proceed-btn {
        background-color: #4caf50;
        margin-top: 20px;
    }
    .vault-game-wrapper .proceed-btn:hover {
        background-color: #45a049;
    }
    .vault-game-wrapper .hint-btn {
        background-color: #666;
        margin-top: 10px;
    }
    .vault-game-wrapper .hint-box {
        background-color: #2a3a5a;
        border: 1px solid #4a7aaa;
        padding: 15px;
        border-radius: 5px;
        margin: 10px 0;
    }
    .vault-game-wrapper .master-input {
        text-align: center;
        font-size: 24px;
        letter-spacing: 2px;
    }
    .vault-game-wrapper .attempts {
        text-align: center;
        color: #ffa500;
        font-size: 18px;
        font-weight: bold;
        margin: 15px 0;
    }
    .vault-game-wrapper .success {
        background-color: #1a3a1a;
        border: 3px solid #4caf50;
        padding: 30px;
        border-radius: 10px;
        text-align: center;
    }
    .vault-game-wrapper .success h1 {
        color: #4caf50;
    }
    .vault-game-wrapper .mission-summary {
        text-align: left;
        max-width: 600px;
        margin: 20px auto;
    }
    .vault-game-wrapper .mission-item {
        background-color: #2a2a2a;
        border: 1px solid #4caf50;
        padding: 15px;
        margin: 10px 0;
        border-radius: 5px;
    }
    .vault-game-wrapper .hidden {
        display: none;
    }
    .vault-game-wrapper .code-vault {
        background-color: #1a1a1a;
        border: 1px solid #555;
        padding: 10px;
        border-radius: 5px;
        margin-top: 20px;
    }
    .vault-game-wrapper .code-vault h4 {
        margin-top: 0;
        color: #888;
        font-size: 12px;
    }
</style>

<div class="vault-game-wrapper">
    <!-- Stage 1: Fragment Authentication -->
    <div id="stage1" class="container">
        <h1>THE NEXUS CHAMBER</h1>
        <h2>Stage 1: Fragment Authentication</h2>
        <p>Enter the codes from your completed missions</p>
        <div class="terminals">
            <div class="terminal" id="terminal-alpha">
                <h3>ALPHA TERMINAL</h3>
                <input type="text" id="alpha-input" placeholder="ALPHA-XXXX">
                <button onclick="authenticateFragment('alpha')">Authenticate</button>
                <div class="status" id="alpha-status"></div>
            </div>
            <div class="terminal" id="terminal-bravo">
                <h3>BRAVO TERMINAL</h3>
                <input type="text" id="bravo-input" placeholder="BRAVO-XXXX">
                <button onclick="authenticateFragment('bravo')">Authenticate</button>
                <div class="status" id="bravo-status"></div>
            </div>
            <div class="terminal" id="terminal-charlie">
                <h3>CHARLIE TERMINAL</h3>
                <input type="text" id="charlie-input" placeholder="CHARLIE-XXXX">
                <button onclick="authenticateFragment('charlie')">Authenticate</button>
                <div class="status" id="charlie-status"></div>
            </div>
        </div>
        <div id="stage1-error" class="error hidden"></div>
        <button id="proceed-stage2" class="proceed-btn hidden" onclick="showStage(2)">
            Proceed to Code Synthesis →
        </button>
    </div>
    <!-- Stage 2: Code Synthesis -->
    <div id="stage2" class="container hidden">
        <h1>CODE SYNTHESIS</h1>
        <h2>Stage 2: Extract Master Code</h2>
        <div class="code-display">
            <p>Fragment Alpha: ALPHA-<span class="suffix">7X9K</span></p>
        </div>
        <div class="code-display">
            <p>Fragment Bravo: BRAVO-<span class="suffix">4M2P</span></p>
        </div>
        <div class="code-display">
            <p>Fragment Charlie: CHARLIE-<span class="suffix">9R5T</span></p>
        </div>
        <div style="background-color: #2a2a4a; padding: 20px; border-radius: 5px; margin: 20px 0; text-align: center;">
            <p><strong>SYNTHESIS RULE:</strong> Extract the suffix from each fragment and combine in order</p>
            <p style="color: #aaa;">Format: XXXX-XXXX-XXXX</p>
        </div>
        <button class="hint-btn" onclick="toggleHint()">Need a hint?</button>
        <div id="hint-box" class="hint-box hidden">
            <strong>Hint:</strong> Remove the mission prefixes (ALPHA-, BRAVO-, CHARLIE-) and join the remaining codes with hyphens
        </div>
        <button class="proceed-btn" onclick="showStage(3)">
            Proceed to Master Lock →
        </button>
    </div>
    <!-- Stage 3: Master Lock -->
    <div id="stage3" class="container hidden">
        <h1>MASTER LOCK</h1>
        <h2>Stage 3: Final Authentication</h2>
        <div class="attempts" id="attempts">ATTEMPTS REMAINING: 3</div>
        <div style="text-align: center; margin: 30px 0;">
            <p style="font-size: 18px;">Enter Master Code</p>
            <input type="text" id="master-input" class="master-input" placeholder="XXXX-XXXX-XXXX">
            <button onclick="checkMasterCode()" style="margin-top: 20px;">UNLOCK VAULT</button>
        </div>
        <div id="stage3-error" class="error hidden"></div>
        <div class="code-vault">
            <h4>CODE VAULT - Your Fragments:</h4>
            <p style="font-family: monospace; color: #4caf50; font-size: 12px;">
                ALPHA-7X9K | BRAVO-4M2P | CHARLIE-9R5T
            </p>
        </div>
    </div>
    <!-- Success: Sacred Page -->
    <div id="success" class="container success hidden">
        <h1>VAULT UNLOCKED</h1>
        <p style="font-size: 24px; color: #4caf50;">The Sacred Page Has Been Retrieved</p>
        <div style="border: 2px solid #4caf50; background-color: #1a1a1a; padding: 30px; margin: 30px 0; border-radius: 5px;">
            <h2 style="color: #4caf50; text-align: center;">EARTH DEFENSE GRID: RESTORED</h2>
            <div class="mission-summary">
                <div class="mission-item">
                    <strong>MISSION ALPHA: Phishing Defense ✓</strong>
                    <p style="font-family: monospace; color: #4caf50; margin: 5px 0;">CODE: ALPHA-7X9K</p>
                </div>
                <div class="mission-item">
                    <strong>MISSION BRAVO: Password Security ✓</strong>
                    <p style="font-family: monospace; color: #4caf50; margin: 5px 0;">CODE: BRAVO-4M2P</p>
                </div>
                <div class="mission-item">
                    <strong>MISSION CHARLIE: Encryption Mastery ✓</strong>
                    <p style="font-family: monospace; color: #4caf50; margin: 5px 0;">CODE: CHARLIE-9R5T</p>
                </div>
                <div style="background-color: #1a3a1a; border: 2px solid #4caf50; padding: 15px; margin: 20px 0; border-radius: 5px;">
                    <strong>MASTER UNLOCK CODE:</strong>
                    <p style="font-family: monospace; font-size: 20px; color: #4caf50;">7X9K-4M2P-9R5T</p>
                </div>
                <div style="background-color: #1a2a3a; border: 1px solid #4a9eff; padding: 15px; border-radius: 5px;">
                    <strong>SENTINEL STATUS:</strong>
                    <p style="font-size: 24px; color: #4caf50;">✓ CERTIFIED</p>
                </div>
            </div>
            <p style="font-style: italic; color: #4caf50; font-size: 18px; margin-top: 30px;">"Cyber vigilance is eternal."</p>
        </div>
        <button onclick="resetGame()">Reset Simulation</button>
    </div>
</div>

<script>
    const correctCodes = {
        alpha: 'ALPHA-7X9K',
        bravo: 'BRAVO-4M2P',
        charlie: 'CHARLIE-9R5T'
    };
    const correctMasterCode = '7X9K-4M2P-9R5T';
    
    let authenticated = {
        alpha: false,
        bravo: false,
        charlie: false
    };
    let attempts = 3;

    function authenticateFragment(terminal) {
        const input = document.getElementById(`${terminal}-input`);
        const status = document.getElementById(`${terminal}-status`);
        const terminalDiv = document.getElementById(`terminal-${terminal}`);
        const errorDiv = document.getElementById('stage1-error');

        if (input.value.toUpperCase() === correctCodes[terminal]) {
            authenticated[terminal] = true;
            status.textContent = 'AUTHENTICATED';
            status.className = 'status authenticated';
            terminalDiv.className = 'terminal authenticated';
            input.disabled = true;
            errorDiv.classList.add('hidden');

            if (authenticated.alpha && authenticated.bravo && authenticated.charlie) {
                document.getElementById('proceed-stage2').classList.remove('hidden');
            }
        } else {
            errorDiv.textContent = `Invalid ${terminal.toUpperCase()} code format`;
            errorDiv.classList.remove('hidden');
        }
    }

    function showStage(stageNum) {
        document.getElementById('stage1').classList.add('hidden');
        document.getElementById('stage2').classList.add('hidden');
        document.getElementById('stage3').classList.add('hidden');
        document.getElementById(`stage${stageNum}`).classList.remove('hidden');
    }

    function toggleHint() {
        document.getElementById('hint-box').classList.toggle('hidden');
    }

    function checkMasterCode() {
        const input = document.getElementById('master-input');
        const errorDiv = document.getElementById('stage3-error');

        if (input.value.toUpperCase() === correctMasterCode) {
            document.getElementById('stage3').classList.add('hidden');
            document.getElementById('success').classList.remove('hidden');

            let progress = JSON.parse(localStorage.getItem('planetProgression')) || {
                microblog: false,
                medialit: false,
                ai: false,
                cyber: false,
                current: 'microblog'
            };

            progress.cyber = true; // this page = Cyber planet

            localStorage.setItem('planetProgression', JSON.stringify(progress));
        } else {
            attempts--;
            document.getElementById('attempts').textContent = `ATTEMPTS REMAINING: ${attempts}`;

            if (attempts <= 0) {
                errorDiv.textContent = 'VAULT LOCKDOWN INITIATED. Resetting in 5 seconds...';
                errorDiv.classList.remove('hidden');
                setTimeout(resetGame, 5000);
            } else {
                errorDiv.textContent = `INCORRECT CODE. ${attempts} attempts remaining.`;
                errorDiv.classList.remove('hidden');
            }
        }
    }

    function resetGame() {
        authenticated = { alpha: false, bravo: false, charlie: false };
        attempts = 3;

        document.getElementById('alpha-input').value = '';
        document.getElementById('bravo-input').value = '';
        document.getElementById('charlie-input').value = '';
        document.getElementById('master-input').value = '';

        document.getElementById('alpha-input').disabled = false;
        document.getElementById('bravo-input').disabled = false;
        document.getElementById('charlie-input').disabled = false;

        document.getElementById('alpha-status').textContent = '';
        document.getElementById('bravo-status').textContent = '';
        document.getElementById('charlie-status').textContent = '';

        document.getElementById('terminal-alpha').className = 'terminal';
        document.getElementById('terminal-bravo').className = 'terminal';
        document.getElementById('terminal-charlie').className = 'terminal';

        document.getElementById('proceed-stage2').classList.add('hidden');
        document.getElementById('stage1-error').classList.add('hidden');
        document.getElementById('stage3-error').classList.add('hidden');
        document.getElementById('hint-box').classList.add('hidden');

        document.getElementById('attempts').textContent = 'ATTEMPTS REMAINING: 3';

        document.getElementById('success').classList.add('hidden');
        document.getElementById('stage1').classList.remove('hidden');
    }
</script>