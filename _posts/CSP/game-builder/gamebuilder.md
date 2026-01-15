---
layout: post
title: Game Asset Creator
description: Helping programmers understand how to creater a game
permalink: /rpg/gamebuilder
comments: True
---
<style>
/* --- Theme: Deep Space Nebula --- */
:root {
    --space-bg: #0b0d17;
    --glass-bg: rgba(15, 20, 35, 0.85);
    --glass-border: rgba(255, 255, 255, 0.1);
    --neon-blue: #00f3ff;
    --neon-purple: #bc13fe;
    --text-main: #e0e6ed;
    --text-muted: #94a3b8;
}

body {
    background: radial-gradient(circle at 50% 50%, #1f253a 0%, #000000 100%);
    background-attachment: fixed;
    color: var(--text-main);
    font-family: 'Inter', sans-serif;
    margin: 0;
}

.page-content .wrapper { max-width: 100% !important; padding: 0 !important; }

/* --- Main Layout --- */
.creator-layout {
    display: flex;
    gap: 20px;
    padding: 20px;
    height: 92vh;
    box-sizing: border-box;
}

.col-game { flex: 0 0 45%; display: flex; flex-direction: column; gap: 15px; }
.col-tools { flex: 1; display: flex; gap: 15px; min-width: 0; }

.glass-panel {
    background: var(--glass-bg);
    backdrop-filter: blur(20px);
    border: 1px solid var(--glass-border);
    border-radius: 12px;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    box-shadow: 0 15px 35px rgba(0,0,0,0.7);
}

.panel-header {
    padding: 16px;
    background: rgba(0,0,0,0.3);
    border-bottom: 1px solid var(--glass-border);
    color: var(--neon-blue);
    font-weight: 700;
    text-transform: uppercase;
    font-size: 0.9em;
    letter-spacing: 1px;
}

.scroll-form { flex: 1; overflow-y: auto; padding: 15px; }
.asset-group {
    background: rgba(255,255,255,0.02);
    border: 1px solid rgba(255,255,255,0.05);
    border-radius: 8px;
    padding: 14px;
    margin-bottom: 15px;
}
.group-title { font-size: 0.8em; color: var(--neon-purple); font-weight: bold; margin-bottom: 12px; }

label { display: block; font-size: 0.7em; color: var(--text-muted); margin-bottom: 5px; }
select, input {
    width: 100%; background: #000; border: 1px solid #333;
    color: #fff; padding: 8px; border-radius: 4px; font-size: 0.85em; margin-bottom: 10px;
}

/* --- Control Buttons --- */
.button-footer { padding: 15px; display: flex; flex-direction: column; gap: 10px; background: rgba(0,0,0,0.2); }
.btn {
    padding: 12px; border-radius: 6px; border: none; font-weight: bold; cursor: pointer;
    transition: all 0.2s; text-transform: uppercase; font-size: 0.85em;
}
.btn-confirm { background: #333; color: var(--neon-blue); border: 1px solid var(--neon-blue); }
.btn-run { background: var(--neon-blue); color: #000; box-shadow: 0 0 15px rgba(0,243,255,0.3); }
.btn-danger { background: #ff4d4f; color: #fff; border: 1px solid #ff4d4f; }

/* --- Code Editor & Surgical Highlights --- */
.code-panel { flex: 1; position: relative; }
.editor-container { 
    position: relative; 
    flex: 1; 
    width: 100%; 
    overflow: hidden; 
    background: #0c0f16; 
}
.code-layer {
    position: absolute; top: 0; left: 0; width: 100%; height: 100%;
    padding: 20px; box-sizing: border-box;
    font-family: 'Fira Code', 'Courier New', monospace; 
    font-size: 13px; 
    line-height: 20px; /* Crucial: Must match JS offset */
    color: #d4d4d4; 
    background: transparent; 
    border: none; 
    resize: none; 
    outline: none;
    z-index: 2; 
    white-space: pre; 
    overflow: auto;
}
.highlight-layer {
    position: absolute; 
    top: 0; 
    left: 0; 
    width: 100%; 
    height: 100%;
    padding: 20px; /* Must match textarea padding */
    box-sizing: border-box; 
    pointer-events: none; 
    z-index: 1;
}
.highlight-box {
    position: absolute; 
    background: rgba(255, 215, 0, 0.25);
    border-left: 4px solid #ffd700;
    left: 10px; 
    width: calc(100% - 20px);
    display: block !important; /* Ensure visibility */
}

/* Persistent box after typing completes (bordered, minimal fill) */
.highlight-persistent-block {
    position: absolute;
    background: rgba(255, 215, 0, 0.12);
    border: 2px solid #ffd700;
    border-left-width: 4px;
    left: 10px;
    width: calc(100% - 20px);
}

/* Typing state highlight (more vivid while animating) */
.typing-highlight {
    position: absolute;
    background: rgba(255, 235, 59, 0.25);
    border-left: 4px solid #ffeb3b;
    left: 10px;
    width: calc(100% - 20px);
}

.game-frame { flex: 1; background: #000; }
iframe { width: 100%; height: 100%; border: none; }

/* RPG Navigation Sidebar Styles */
        .rpg-nav-sidebar {
            position: fixed;
            left: 0;
            top: 0;
            height: 100vh;
            width: 280px;
            background: linear-gradient(145deg, rgba(20, 20, 40, 0.98), rgba(10, 10, 20, 0.98));
            backdrop-filter: blur(10px);
            box-shadow: 4px 0 20px rgba(0, 0, 0, 0.5);
            transform: translateX(-280px);
            transition: transform 0.3s ease;
            z-index: 1000;
            border-right: 2px solid rgba(255, 215, 0, 0.3);
        }

        .rpg-nav-sidebar.open {
            transform: translateX(0);
        }

        .nav-toggle {
            position: absolute;
            right: -50px;
            top: 20px;
            width: 50px;
            height: 50px;
            background: linear-gradient(145deg, rgba(20, 20, 40, 0.98), rgba(10, 10, 20, 0.98));
            border: 2px solid rgba(255, 215, 0, 0.3);
            border-left: none;
            border-radius: 0 10px 10px 0;
            color: #ffd700;
            font-size: 24px;
            cursor: pointer;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .nav-toggle:hover {
            background: rgba(255, 215, 0, 0.1);
            box-shadow: 0 0 15px rgba(255, 215, 0, 0.3);
        }

        .nav-dashboard {
            padding: 30px 20px;
            height: 100%;
            overflow-y: auto;
        }

        .nav-title {
            color: #ffd700;
            font-size: 1.5em;
            font-family: 'Cinzel', 'Georgia', serif;
            text-align: center;
            margin-bottom: 10px;
            text-shadow: 0 0 10px rgba(255, 215, 0, 0.5);
        }

        .nav-divider {
            height: 2px;
            background: linear-gradient(90deg, transparent, #ffd700, transparent);
            margin-bottom: 20px;
        }

        .nav-links {
            display: flex;
            flex-direction: column;
            gap: 10px;
        }

        .nav-link {
            display: flex;
            align-items: center;
            padding: 15px;
            background: rgba(0, 0, 0, 0.3);
            border: 2px solid rgba(255, 215, 0, 0.2);
            border-radius: 10px;
            color: #c0c0c0;
            text-decoration: none;
            transition: all 0.3s ease;
            position: relative;
        }

        .nav-link:hover:not(.locked) {
            background: rgba(255, 215, 0, 0.1);
            border-color: #ffd700;
            transform: translateX(5px);
        }

        .nav-link.active {
            background: rgba(255, 215, 0, 0.15);
            border-color: #ffd700;
            box-shadow: 0 0 15px rgba(255, 215, 0, 0.2);
        }

        .nav-link.visited .nav-check {
            display: inline;
        }

        .nav-link.locked {
            opacity: 0.5;
            cursor: not-allowed;
            pointer-events: none;
        }

        .nav-link.locked .nav-lock {
            display: inline;
        }

        .nav-link:not(.locked) .nav-lock {
            display: none;
        }

        .nav-number {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 30px;
            height: 30px;
            background: rgba(255, 215, 0, 0.2);
            border-radius: 50%;
            color: #ffd700;
            font-weight: bold;
            margin-right: 12px;
            flex-shrink: 0;
        }

        .nav-text {
            flex: 1;
            font-size: 0.95em;
        }

        .nav-check {
            color: #4cc9f0;
            font-size: 1.2em;
            display: none;
            margin-left: 8px;
        }

        .nav-lock {
            color: #ff6b6b;
            font-size: 1em;
            margin-left: 8px;
        }

        @media (max-width: 768px) {
            .rpg-nav-sidebar {
                width: 240px;
                transform: translateX(-240px);
            }
        }
</style>

<!-- RPG Navigation Sidebar -->
<div id="rpg-nav-sidebar" class="rpg-nav-sidebar">
  <button id="nav-toggle" class="nav-toggle">☰</button>
  <div class="nav-dashboard">
    <h3 class="nav-title">🎮 RPG Creator</h3>
    <div class="nav-divider"></div>
    <nav class="nav-links">
      <a href="/rpg/login" class="nav-link" data-page="1">
        <span class="nav-number">1</span>
        <span class="nav-text">Login</span>
      </a>
      <a href="/rpg/dashboard" class="nav-link" data-page="2">
        <span class="nav-number">2</span>
        <span class="nav-text">Dashboard</span>
        <span class="nav-check">✓</span>
      </a>
      <a href="/rpg/story" class="nav-link active" data-page="3">
        <span class="nav-number">3</span>
        <span class="nav-text">Story & Narrative</span>
        <span class="nav-check">✓</span>
      </a>
      <a href="/rpg/game-creator" class="nav-link" data-page="4">
        <span class="nav-number">4</span>
        <span class="nav-text">Game creator</span>
        <span class="nav-check">✓</span>
      </a>
      <a href="/rpg/keybindings" class="nav-link" data-page="5">
        <span class="nav-number">5</span>
        <span class="nav-text">Controls</span>
        <span class="nav-check">✓</span>
      </a>
      <a href="/rpg/systems" class="nav-link" data-page="6">
        <span class="nav-number">6</span>
        <span class="nav-text">Game Systems</span>
        <span class="nav-check">✓</span>
      </a>
      <a href="/rpg/review" class="nav-link" data-page="6" id="review-link">
        <span class="nav-number">6</span>
        <span class="nav-text">Review</span>
        <span class="nav-lock">✓</span>
        <span class="nav-check">✓</span>
      </a>
    </nav>
  </div>
  
</div>

<div class="creator-layout">
    <div class="col-tools">
        <div class="glass-panel creator-panel">
            <div class="panel-header">Asset Configurations</div>
            <div class="scroll-form">
                <div class="asset-group">
                    <div class="group-title">ENVIRONMENT</div>
                    <label>Background Selection</label>
                    <select id="bg-select">
                        <option value="" selected disabled>Select background…</option>
                        <option value="desert">Desert Dunes</option>
                        <option value="alien">Alien Planet</option>
                        <option value="clouds">Sky Kingdom</option>
                    </select>
                </div>
                
                <div class="asset-group">
                    <div class="group-title">PLAYER</div>
                    <label>Sprite</label>
                    <select id="player-select">
                        <option value="" selected disabled>Select sprite…</option>
                        <option value="chillguy">Chill Guy</option>
                        <option value="tux">Tux</option>
                    </select>
                    <label>X Position</label>
                    <input type="range" id="player-x" min="0" max="800" value="100">
                    <label>Movement Keys</label>
                    <select id="movement-keys">
                        <option value="" selected disabled>Select keys…</option>
                        <option value="wasd">WASD</option>
                        <option value="arrows">Arrow Keys</option>
                    </select>
                </div>
                <div class="asset-group">
                    <div class="group-title">NPC</div>
                    <div class="npc-slots">
                        <div class="npc-slot" id="npc-slot-1">
                            <button class="btn" id="add-npc-1">Add NPC</button>
                            <div class="npc-fields" id="npc-fields-1" style="display:none; margin-top:8px; border: 1px solid #444; padding: 10px; border-radius: 8px; background: rgba(0,0,0,0.08);">
                                <label>ID</label>
                                <input type="text" id="npc1-id" value="" placeholder="NPC id">
                                <label>Message</label>
                                <input type="text" id="npc1-msg" value="" placeholder="Message when interacted with">
                                <label>Sprite</label>
                                <select id="npc1-sprite">
                                    <option value="" selected disabled>Select sprite…</option>
                                    <option value="chillguy">Chill Guy</option>
                                    <option value="tux">Tux (penguin)</option>
                                    <option value="r2d2">R2D2</option>
                                </select>
                                <label>Position X</label>
                                <input type="range" id="npc1-x" min="0" max="800" value="500">
                                <label>Position Y</label>
                                <input type="range" id="npc1-y" min="0" max="600" value="300">
                                <div class="npc-actions" style="margin-top:8px; display:flex; gap:8px;">
                                    <button class="btn btn-sm btn-danger" id="npc1-delete">Delete</button>
                                </div>
                            </div>
                        </div>
                        <div class="npc-slot" id="npc-slot-2">
                            <button class="btn" id="add-npc-2">Add NPC</button>
                            <div class="npc-fields" id="npc-fields-2" style="display:none; margin-top:8px; border: 1px solid #444; padding: 10px; border-radius: 8px; background: rgba(0,0,0,0.08);">
                                <label>ID</label>
                                <input type="text" id="npc2-id" value="" placeholder="NPC id">
                                <label>Message</label>
                                <input type="text" id="npc2-msg" value="" placeholder="Message when interacted with">
                                <label>Sprite</label>
                                <select id="npc2-sprite">
                                    <option value="" selected disabled>Select sprite…</option>
                                    <option value="chillguy">Chill Guy</option>
                                    <option value="tux">Tux (penguin)</option>
                                    <option value="r2d2">R2D2</option>
                                </select>
                                <label>Position X</label>
                                <input type="range" id="npc2-x" min="0" max="800" value="500">
                                <label>Position Y</label>
                                <input type="range" id="npc2-y" min="0" max="600" value="300">
                                <div class="npc-actions" style="margin-top:8px; display:flex; gap:8px;">
                                    <button class="btn btn-sm btn-danger" id="npc2-delete">Delete</button>
                                </div>
                            </div>
                        </div>
                        <div class="npc-slot" id="npc-slot-3">
                            <button class="btn" id="add-npc-3">Add NPC</button>
                            <div class="npc-fields" id="npc-fields-3" style="display:none; margin-top:8px; border: 1px solid #444; padding: 10px; border-radius: 8px; background: rgba(0,0,0,0.08);">
                                <label>ID</label>
                                <input type="text" id="npc3-id" value="" placeholder="NPC id">
                                <label>Message</label>
                                <input type="text" id="npc3-msg" value="" placeholder="Message when interacted with">
                                <label>Sprite</label>
                                <select id="npc3-sprite">
                                    <option value="" selected disabled>Select sprite…</option>
                                    <option value="chillguy">Chill Guy</option>
                                    <option value="tux">Tux (penguin)</option>
                                    <option value="r2d2">R2D2</option>
                                </select>
                                <label>Position X</label>
                                <input type="range" id="npc3-x" min="0" max="800" value="500">
                                <label>Position Y</label>
                                <input type="range" id="npc3-y" min="0" max="600" value="300">
                                <div class="npc-actions" style="margin-top:8px; display:flex; gap:8px;">
                                    <button class="btn btn-sm btn-danger" id="npc3-delete">Delete</button>
                                </div>
                            </div>
                        </div>
                        <div class="npc-slot" id="npc-slot-4">
                            <button class="btn" id="add-npc-4">Add NPC</button>
                            <div class="npc-fields" id="npc-fields-4" style="display:none; margin-top:8px; border: 1px solid #444; padding: 10px; border-radius: 8px; background: rgba(0,0,0,0.08);">
                                <label>ID</label>
                                <input type="text" id="npc4-id" value="" placeholder="NPC id">
                                <label>Message</label>
                                <input type="text" id="npc4-msg" value="" placeholder="Message when interacted with">
                                <label>Sprite</label>
                                <select id="npc4-sprite">
                                    <option value="" selected disabled>Select sprite…</option>
                                    <option value="chillguy">Chill Guy</option>
                                    <option value="tux">Tux (penguin)</option>
                                    <option value="r2d2">R2D2</option>
                                </select>
                                <label>Position X</label>
                                <input type="range" id="npc4-x" min="0" max="800" value="500">
                                <label>Position Y</label>
                                <input type="range" id="npc4-y" min="0" max="600" value="300">
                                <div class="npc-actions" style="margin-top:8px; display:flex; gap:8px;">
                                    <button class="btn btn-sm btn-danger" id="npc4-delete">Delete</button>
                                </div>
                            </div>
                        </div>
                        <div class="npc-slot" id="npc-slot-5">
                            <button class="btn" id="add-npc-5">Add NPC</button>
                            <div class="npc-fields" id="npc-fields-5" style="display:none; margin-top:8px; border: 1px solid #444; padding: 10px; border-radius: 8px; background: rgba(0,0,0,0.08);">
                                <label>ID</label>
                                <input type="text" id="npc5-id" value="" placeholder="NPC id">
                                <label>Message</label>
                                <input type="text" id="npc5-msg" value="" placeholder="Message when interacted with">
                                <label>Sprite</label>
                                <select id="npc5-sprite">
                                    <option value="" selected disabled>Select sprite…</option>
                                    <option value="chillguy">Chill Guy</option>
                                    <option value="tux">Tux (penguin)</option>
                                    <option value="r2d2">R2D2</option>
                                </select>
                                <label>Position X</label>
                                <input type="range" id="npc5-x" min="0" max="800" value="500">
                                <label>Position Y</label>
                                <input type="range" id="npc5-y" min="0" max="600" value="300">
                                <div class="npc-actions" style="margin-top:8px; display:flex; gap:8px;">
                                    <button class="btn btn-sm btn-danger" id="npc5-delete">Delete</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="asset-group">
                    <div class="group-title">COLLISION WALLS</div>
                    <div style="margin-bottom:10px;">
                        <button class="btn" id="add-wall">Add Wall</button>
                    </div>
                    <div id="wall-list" style="display:flex; flex-direction:column; gap:10px;"></div>
                </div>
            </div>
            <div class="button-footer">
                <button id="btn-confirm" class="btn btn-confirm">Confirm Step</button>
                <button id="btn-run" class="btn btn-run">Run Game</button>
                <div id="progress-indicator" style="font-size: 0.8em; color: var(--text-muted);">Step: background → player → npc → freestyle</div>
                <ol class="steps-numbered" style="margin: 8px 0 0 18px; color: var(--text-muted); font-size: 0.85em;">
                    <li>Step 1: Background</li>
                    <li>Step 2: Player</li>
                    <li>Step 3: Add NPC</li>
                </ol>
                <div id="freestyle-notice" style="display:none; margin-top: 4px; padding: 6px; border: 1px solid var(--neon-blue); border-radius: 6px; color: var(--neon-blue); background: rgba(0,243,255,0.08); font-size: 0.85em; line-height: 1.2;">
                    freestyle unlocked !<br>
                    you can edit whatever you want
                </div>
            </div>
        </div>

        <div class="glass-panel code-panel">
            <div class="panel-header">Level Logic (JS)</div>
            <div class="editor-container" id="editor-container">
                <div id="highlight-layer" class="highlight-layer"></div>
                <textarea id="code-editor" class="code-layer" readonly spellcheck="false"></textarea>
            </div>
        </div>
    </div>

    <div class="col-game">
        <div class="glass-panel" style="flex:1;">
            <div class="panel-header">Game Preview</div>
            <div class="game-frame">
                <iframe id="game-iframe" src="{{ site.baseurl }}/rpg/latest?embed=1&autostart=0"></iframe>
            </div>
        </div>
    </div>
</div>

<script>
document.addEventListener('DOMContentLoaded', () => {
    const assets = {
        bg: {
            desert: { src: "/images/gamify/desert.png", h: 580, w: 1038 },
            alien: { src: "/images/gamify/alien_planet.jpg", h: 600, w: 1000 },
            clouds: { src: "/images/gamify/clouds.jpg", h: 720, w: 1280 }
        },
        sprites: {
            tux: { src: "/images/gamify/tux.png", h:256, w:352, rows:8, cols:11 },
            chillguy: { src: "/images/gamify/chillguy.png", h:512, w:384, rows:4, cols:3 },
            r2d2: { src: "/images/gamify/r2_idle.png", h:223, w:505, rows:1, cols:3 }
        }
    };

    const ui = {
        bg: document.getElementById('bg-select'),
        pSprite: document.getElementById('player-select'),
        pX: document.getElementById('player-x'),
        npcs: [1,2,3,4,5].map(i => ({
            addBtn: document.getElementById(`add-npc-${i}`),
            fieldsContainer: document.getElementById(`npc-fields-${i}`),
            nId: document.getElementById(`npc${i}-id`),
            nMsg: document.getElementById(`npc${i}-msg`),
            nSprite: document.getElementById(`npc${i}-sprite`),
            nX: document.getElementById(`npc${i}-x`),
            nY: document.getElementById(`npc${i}-y`),
            deleteBtn: document.getElementById(`npc${i}-delete`),
            locked: false,
            index: i,
            displayName: ''
        })),
        walls: [1,2,3].map(i => ({
            addBtn: document.getElementById(`add-wall-${i}`),
            fieldsContainer: document.getElementById(`wall-fields-${i}`),
            wId: document.getElementById(`wall${i}-id`),
            wX: document.getElementById(`wall${i}-x`),
            wY: document.getElementById(`wall${i}-y`),
            wW: document.getElementById(`wall${i}-w`),
            wH: document.getElementById(`wall${i}-h`),
            deleteBtn: document.getElementById(`wall${i}-delete`),
            locked: false,
            index: i,
            displayName: ''
        })),
        addWallBtn: document.getElementById('add-wall'),
        wallList: document.getElementById('wall-list'),
        walls: [],
        editor: document.getElementById('code-editor'),
        hLayer: document.getElementById('highlight-layer'),
        iframe: document.getElementById('game-iframe'),
        notice: document.getElementById('freestyle-notice')
    };

    // Toggle NPC fields on 'Add NPC' click (open/close)
    ui.npcs.forEach(slot => {
        if (slot.addBtn && slot.fieldsContainer) {
            slot.addBtn.addEventListener('click', () => {
                const isVisible = slot.fieldsContainer.style.display !== 'none';
                // Toggle dropdown visibility
                slot.fieldsContainer.style.display = isVisible ? 'none' : '';
                // Allow editing when open
                if (!isVisible) slot.locked = false;
                // Update button label with caret and name
                const labelBase = slot.displayName && slot.locked ? slot.displayName : 'Add NPC';
                const caret = isVisible ? ' ▸' : ' ▾';
                slot.addBtn.textContent = labelBase + caret;
                // Added style if slot was confirmed
                if (slot.locked && slot.displayName) slot.addBtn.classList.add('btn-confirm');
                else slot.addBtn.classList.remove('btn-confirm');
                updateStepUI();
                syncFromControlsIfFreestyle();
            });
        }
        // Ensure delete starts hidden until NPC is created
        if (slot.deleteBtn) slot.deleteBtn.style.display = 'none';
        // Delete action
        if (slot.deleteBtn) {
            slot.deleteBtn.addEventListener('click', () => {
                // Clear values and hide panel
                if (slot.nId) slot.nId.value = '';
                if (slot.nMsg) slot.nMsg.value = '';
                if (slot.nSprite) slot.nSprite.value = '';
                if (slot.nX) slot.nX.value = 500;
                if (slot.nY) slot.nY.value = 300;
                slot.locked = false;
                slot.displayName = '';
                if (slot.fieldsContainer) slot.fieldsContainer.style.display = 'none';
                if (slot.addBtn) {
                    slot.addBtn.textContent = 'Add NPC ▸';
                    slot.addBtn.classList.remove('btn-confirm');
                }
                if (slot.deleteBtn) {
                    slot.deleteBtn.disabled = true;
                    slot.deleteBtn.style.display = 'none';
                }
                updateStepUI();
                syncFromControlsIfFreestyle();
            });
        }
    });

    // Dynamic Collision Walls: create on demand via single Add Wall button
    let wallCounter = 0;

    function hookWallSlotListeners(slot) {
        if (slot.wId) slot.wId.addEventListener('input', syncFromControlsIfFreestyle);
        // Toggle dropdown open/close
        if (slot.addBtn && slot.fieldsContainer) {
            slot.addBtn.addEventListener('click', () => {
                const isVisible = slot.fieldsContainer.style.display !== 'none';
                // Toggle visibility
                slot.fieldsContainer.style.display = isVisible ? 'none' : '';
                // Allow editing when open
                if (!isVisible) slot.locked = false;
                // Update button label with caret and name
                const labelBase = slot.displayName && slot.locked ? slot.displayName : 'Add Wall';
                const caret = isVisible ? ' ▸' : ' ▾';
                slot.addBtn.textContent = labelBase + caret;
                // Added style if slot was confirmed
                if (slot.locked && slot.displayName) slot.addBtn.classList.add('btn-confirm');
                else slot.addBtn.classList.remove('btn-confirm');
                updateStepUI();
                syncFromControlsIfFreestyle();
            });
        }
        // Ensure delete starts hidden until wall is created/confirmed
        if (slot.deleteBtn) slot.deleteBtn.style.display = 'none';
        const getWallInstance = (id) => {
            const win = ui.iframe?.contentWindow;
            const reg = win && win.__adventureGameRegistry && win.__adventureGameRegistry.walls;
            return reg ? reg[id] : null;
        };
        // X position slider: update wall's position.x only
        if (slot.wX) slot.wX.addEventListener('input', () => {
            const wall = ui.walls.find(w => w.index === slot.index);
            if (wall) {
                wall.wX.value = slot.wX.value;
                const gameWall = getWallInstance(wall.wId.value);
                if (gameWall) gameWall.position.x = parseInt(slot.wX.value, 10);
                syncFromControlsIfFreestyle();
                ui.editor.value = generateStepCode('player');
            }
        });
        // Y position slider: update wall's position.y only
        if (slot.wY) slot.wY.addEventListener('input', () => {
            const wall = ui.walls.find(w => w.index === slot.index);
            if (wall) {
                wall.wY.value = slot.wY.value;
                const gameWall = getWallInstance(wall.wId.value);
                if (gameWall) gameWall.position.y = parseInt(slot.wY.value, 10);
                syncFromControlsIfFreestyle();
                ui.editor.value = generateStepCode('player');
            }
        });
        // Width slider: adjust wall dimensions
        if (slot.wW) slot.wW.addEventListener('input', () => {
            const wall = ui.walls.find(w => w.index === slot.index);
            if (wall) {
                wall.wW.value = slot.wW.value;
                const gameWall = getWallInstance(wall.wId.value);
                if (gameWall && typeof gameWall.setDimensions === 'function') {
                    gameWall.setDimensions(parseInt(slot.wW.value, 10), parseInt(slot.wH.value, 10));
                }
                syncFromControlsIfFreestyle();
                ui.editor.value = generateStepCode('player');
            }
        });
        // Height slider: adjust wall dimensions
        if (slot.wH) slot.wH.addEventListener('input', () => {
            const wall = ui.walls.find(w => w.index === slot.index);
            if (wall) {
                wall.wH.value = slot.wH.value;
                const gameWall = getWallInstance(wall.wId.value);
                if (gameWall && typeof gameWall.setDimensions === 'function') {
                    gameWall.setDimensions(parseInt(slot.wW.value, 10), parseInt(slot.wH.value, 10));
                }
                syncFromControlsIfFreestyle();
                ui.editor.value = generateStepCode('player');
            }
        });
        if (slot.deleteBtn) {
            slot.deleteBtn.addEventListener('click', () => {
                // Remove from DOM and UI list
                if (slot.root) slot.root.remove();
                ui.walls = ui.walls.filter(w => w.index !== slot.index);
                syncFromControlsIfFreestyle();
            });
        }
    }

    function createWallSlot() {
        wallCounter += 1;
        const idx = wallCounter;
        const root = document.createElement('div');
        root.className = 'wall-slot';
        root.id = `wall-slot-${idx}`;
        // Header with dropdown toggle
        const header = document.createElement('div');
        header.className = 'wall-header';
        header.style.cssText = 'display:flex; align-items:center; gap:8px;';
        header.innerHTML = `
            <button class="btn" id="wall${idx}-toggle">Add Wall ▸</button>
        `;

        // Fields panel (collapsed by default)
        const fields = document.createElement('div');
        fields.className = 'wall-fields';
        fields.style.cssText = 'margin-top:8px; border: 1px solid #444; padding: 10px; border-radius: 8px; background: rgba(0,0,0,0.08);';
        fields.style.display = 'none';
        fields.innerHTML = `
            <label>ID</label>
            <input type="text" id="wall${idx}-id" value="Wall${idx}" placeholder="Wall id">
            <label>X</label>
            <input type="range" id="wall${idx}-x" min="0" max="800" value="100">
            <label>Y</label>
            <input type="range" id="wall${idx}-y" min="0" max="600" value="100">
            <label>Width</label>
            <input type="range" id="wall${idx}-w" min="10" max="800" value="200">
            <label>Height</label>
            <input type="range" id="wall${idx}-h" min="10" max="600" value="20">
            <div class="wall-actions" style="margin-top:8px; display:flex; gap:8px;">
                <button class="btn btn-danger" id="wall${idx}-delete">Delete</button>
            </div>
        `;

        root.appendChild(header);
        root.appendChild(fields);
        ui.wallList.appendChild(root);

        const slot = {
            root,
            fieldsContainer: fields,
            addBtn: header.querySelector(`#wall${idx}-toggle`),
            wId: fields.querySelector(`#wall${idx}-id`),
            wX: fields.querySelector(`#wall${idx}-x`),
            wY: fields.querySelector(`#wall${idx}-y`),
            wW: fields.querySelector(`#wall${idx}-w`),
            wH: fields.querySelector(`#wall${idx}-h`),
            deleteBtn: fields.querySelector(`#wall${idx}-delete`),
            locked: true,
            index: idx,
            displayName: `Wall${idx}`
        };
        ui.walls.push(slot);
        hookWallSlotListeners(slot);
        updateStepUI();
        syncFromControlsIfFreestyle();
    }

    if (ui.addWallBtn) {
        ui.addWallBtn.addEventListener('click', createWallSlot);
    }

    const LINE_HEIGHT = 20;
    const state = { persistent: null, typing: null, userEdited: false, programmaticEdit: false };
    const steps = ['background','player','npc','freestyle'];
    let stepIndex = 0; // start at 'background'
    const indicator = document.getElementById('progress-indicator');

    function setIndicator() {
        const current = steps[stepIndex];
        indicator.textContent = `Step: ${current}`;
    }

    function lockField(el) { if (el) { el.disabled = true; el.classList.add('locked'); } }
    function unlockField(el) { if (el) { el.disabled = false; el.classList.remove('locked'); } }

    function updateStepUI() {
        const current = steps[stepIndex];
        const mv = document.getElementById('movement-keys');
        // Default: disable all inputs/buttons
        [ui.bg, ui.pSprite, ui.pX, mv].forEach(el => { if (el) el.disabled = true; });
        ui.npcs.forEach(slot => {
            if (slot.addBtn) slot.addBtn.disabled = true;
            [slot.nId, slot.nMsg, slot.nSprite, slot.nX, slot.nY, slot.deleteBtn].forEach(el => { if (el) el.disabled = true; });
        });
        ui.walls.forEach(slot => {
            [slot.wId, slot.wX, slot.wY, slot.wW, slot.wH, slot.deleteBtn].forEach(el => { if (el) el.disabled = true; });
        });
        if (current === 'background') {
            unlockField(ui.bg);
        } else if (current === 'player') {
            unlockField(ui.pSprite);
            unlockField(ui.pX);
            unlockField(mv);
            ui.walls.forEach(slot => {
                if (slot.deleteBtn) {
                    slot.deleteBtn.disabled = false;
                    slot.deleteBtn.style.display = '';
                }
                [slot.wId, slot.wX, slot.wY, slot.wW, slot.wH].forEach(el => unlockField(el));
            });
        } else if (current === 'npc') {
            // Enable add buttons and manage NPC fields based on locked state
            ui.npcs.forEach(slot => {
                if (slot.addBtn) slot.addBtn.disabled = false;
                if (slot.deleteBtn) {
                    slot.deleteBtn.disabled = !slot.locked;
                    slot.deleteBtn.style.display = slot.locked ? '' : 'none';
                }
                if (slot.fieldsContainer && slot.fieldsContainer.style.display !== 'none') {
                    // Fields are editable when dropdown is open
                    unlockField(slot.nId);
                    unlockField(slot.nMsg);
                    unlockField(slot.nSprite);
                    unlockField(slot.nX);
                    unlockField(slot.nY);
                }
            });
            ui.walls.forEach(slot => {
                if (slot.deleteBtn) {
                    slot.deleteBtn.disabled = false;
                    slot.deleteBtn.style.display = '';
                }
                [slot.wId, slot.wX, slot.wY, slot.wW, slot.wH].forEach(el => unlockField(el));
            });
        } else if (current === 'freestyle') {
            ui.editor.readOnly = false;
            [ui.bg, ui.pSprite, ui.pX, mv].forEach(el => { if (el) el.disabled = false; });
            ui.npcs.forEach(slot => {
                if (slot.addBtn) slot.addBtn.disabled = false;
                [slot.nId, slot.nMsg, slot.nSprite, slot.nX, slot.nY].forEach(el => { if (el) el.disabled = false; });
            });
            ui.walls.forEach(slot => {
                [slot.wId, slot.wX, slot.wY, slot.wW, slot.wH].forEach(el => { if (el) el.disabled = false; });
                if (slot.deleteBtn) { slot.deleteBtn.disabled = false; slot.deleteBtn.style.display = ''; }
            });
        }
        // Show or hide freestyle unlocked notice
        if (ui.notice) {
            ui.notice.style.display = (current === 'freestyle') ? '' : 'none';
        }
    }

        // Baseline skeleton: include all imports to minimize diff across steps
        function generateBaselineCode() {
                return `import GameControl from '/assets/js/adventureGame/GameEngine/GameControl.js';
import GameEnvBackground from '/assets/js/adventureGame/GameEngine/GameEnvBackground.js';
import Player from '/assets/js/adventureGame/GameEngine/Player.js';
import Npc from '/assets/js/adventureGame/GameEngine/Npc.js';

class CustomLevel {
    constructor(gameEnv) {
        const path = gameEnv.path;
        const width = gameEnv.innerWidth;
        const height = gameEnv.innerHeight;

        // Definitions will be added here per step

        // Define objects for this level progressively via Confirm Step
        this.classes = [
            // Step 1: add GameEnvBackground
            // Step 2: add Player
            // Step 3: add Npc
        ];
    }
}

export { GameControl };
export const gameLevelClasses = [CustomLevel];`;
        }

        function generateStepCode(currentStep) {
                const bg = assets.bg[ui.bg.value];
                const p = assets.sprites[ui.pSprite.value];
                const movement = document.getElementById('movement-keys').value || 'wasd';
                const keypress = movement === 'arrows'
                        ? '{ up: 38, left: 37, down: 40, right: 39 }'
                        : '{ up: 87, left: 65, down: 83, right: 68 }';

                function header() {
                        return `import GameControl from '/assets/js/adventureGame/GameEngine/GameControl.js';
import GameEnvBackground from '/assets/js/adventureGame/GameEngine/GameEnvBackground.js';
import Player from '/assets/js/adventureGame/GameEngine/Player.js';
import Npc from '/assets/js/adventureGame/GameEngine/Npc.js';
        import Wall from '/assets/js/adventureGame/GameEngine/Wall.js';

class CustomLevel {
    constructor(gameEnv) {
        const path = gameEnv.path;
        const width = gameEnv.innerWidth;
        const height = gameEnv.innerHeight;`;
                }
                function footer(classesArray) {
                        return `

        this.classes = [
            ${classesArray.join(',\n')}
        ];
    }
}

export { GameControl };
export const gameLevelClasses = [CustomLevel];`;
                }

                if (currentStep === 'background') {
                        if (!ui.bg.value) return null;
                        const defs = `
        const bgData = {
            name: 'custom_bg',
            src: path + "${bg.src}",
            pixels: { height: ${bg.h}, width: ${bg.w} }
        };`;
                        const classes = [
            "      { class: GameEnvBackground, data: bgData }"
                        ];
                        return header() + defs + footer(classes);
                }

                if (currentStep === 'player') {
                        if (!ui.bg.value || !ui.pSprite.value) return null;
                        const defs = `
        const bgData = {
            name: 'custom_bg',
            src: path + "${bg.src}",
            pixels: { height: ${bg.h}, width: ${bg.w} }
        };
        const playerData = {
            id: 'Hero',
            src: path + "${p.src}",
            SCALE_FACTOR: 5,
            STEP_FACTOR: 1000,
            ANIMATION_RATE: 50,
            INIT_POSITION: { x: ${ui.pX.value}, y: height - Math.floor(height/5) },
            pixels: { height: ${p.h}, width: ${p.w} },
            orientation: { rows: ${p.rows}, columns: ${p.cols} },
            down: { row: 0, start: 0, columns: 3 },
            downRight: { row: Math.min(1, ${p.rows} - 1), start: 0, columns: 3, rotate: Math.PI/16 },
            downLeft: { row: Math.min(2, ${p.rows} - 1), start: 0, columns: 3, rotate: -Math.PI/16 },
            right: { row: Math.min(1, ${p.rows} - 1), start: 0, columns: 3 },
            left: { row: Math.min(2, ${p.rows} - 1), start: 0, columns: 3 },
            up: { row: Math.min(3, ${p.rows} - 1), start: 0, columns: 3 },
            upRight: { row: Math.min(1, ${p.rows} - 1), start: 0, columns: 3, rotate: -Math.PI/16 },
            upLeft: { row: Math.min(2, ${p.rows} - 1), start: 0, columns: 3, rotate: Math.PI/16 },
            hitbox: { widthPercentage: 0.45, heightPercentage: 0.2 },
            keypress: ${keypress}
        };`;
                        const wallDefs = [];
                        const classes = [
            "      { class: GameEnvBackground, data: bgData }",
            "      { class: Player, data: playerData }"
                        ];
                        ui.walls.forEach(slot => {
                            const name = (slot.wId && slot.wId.value ? slot.wId.value.trim() : `Wall${slot.index}`).replace(/'/g, "\\'");
                            const x = parseInt(slot.wX?.value || '100', 10);
                            const y = parseInt(slot.wY?.value || '100', 10);
                            const w = parseInt(slot.wW?.value || '200', 10);
                            const h = parseInt(slot.wH?.value || '20', 10);
                            wallDefs.push(`
        const wallData${slot.index} = {
            id: '${name}',
            INIT_POSITION: { x: ${x}, y: ${y} },
            pixels: { width: ${w}, height: ${h} },
            hitbox: { widthPercentage: 0.0, heightPercentage: 0.0 },
            zIndex: 9,
            fillStyle: 'rgba(255, 215, 0, 0.35)'
        };`);
                            classes.push(`      { class: Wall, data: wallData${slot.index} }`);
                        });
                        const defsWithWalls = defs + (wallDefs.length ? ('\n' + wallDefs.join('\n')) : '');
                        return header() + defsWithWalls + footer(classes);
                }

                if (currentStep === 'npc') {
                    // Include all locked (previously confirmed) slots and any currently visible slots
                    const includedSlots = ui.npcs.filter(s => s.locked || (s.fieldsContainer && s.fieldsContainer.style.display !== 'none'));
                    if (includedSlots.length === 0) return null;

                        const defsStart = `
        const bgData = {
            name: 'custom_bg',
            src: path + "${bg.src}",
            pixels: { height: ${bg.h}, width: ${bg.w} }
        };
        const playerData = {
            id: 'Hero',
            src: path + "${p.src}",
            SCALE_FACTOR: 5,
            STEP_FACTOR: 1000,
            ANIMATION_RATE: 50,
            INIT_POSITION: { x: ${ui.pX.value}, y: height - Math.floor(height/5) },
            pixels: { height: ${p.h}, width: ${p.w} },
            orientation: { rows: ${p.rows}, columns: ${p.cols} },
            down: { row: 0, start: 0, columns: 3 },
            downRight: { row: Math.min(1, ${p.rows} - 1), start: 0, columns: 3, rotate: Math.PI/16 },
            downLeft: { row: Math.min(2, ${p.rows} - 1), start: 0, columns: 3, rotate: -Math.PI/16 },
            right: { row: Math.min(1, ${p.rows} - 1), start: 0, columns: 3 },
            left: { row: Math.min(2, ${p.rows} - 1), start: 0, columns: 3 },
            up: { row: Math.min(3, ${p.rows} - 1), start: 0, columns: 3 },
            upRight: { row: Math.min(1, ${p.rows} - 1), start: 0, columns: 3, rotate: -Math.PI/16 },
            upLeft: { row: Math.min(2, ${p.rows} - 1), start: 0, columns: 3, rotate: Math.PI/16 },
            hitbox: { widthPercentage: 0.45, heightPercentage: 0.2 },
            keypress: ${keypress}
        };`;
                        const npcDefs = [];
                        const wallDefs = [];
                        const classes = [
            "      { class: GameEnvBackground, data: bgData }",
            "      { class: Player, data: playerData }"
                        ];
                        ui.walls.forEach(slot => {
                            const name = (slot.wId && slot.wId.value ? slot.wId.value.trim() : `Wall${slot.index}`).replace(/'/g, "\\'");
                            const x = parseInt(slot.wX?.value || '100', 10);
                            const y = parseInt(slot.wY?.value || '100', 10);
                            const w = parseInt(slot.wW?.value || '200', 10);
                            const h = parseInt(slot.wH?.value || '20', 10);
                            wallDefs.push(`
        const wallData${slot.index} = {
            id: '${name}',
            INIT_POSITION: { x: ${x}, y: ${y} },
            pixels: { width: ${w}, height: ${h} },
            hitbox: { widthPercentage: 0.0, heightPercentage: 0.0 },
            zIndex: 9,
            fillStyle: 'rgba(255, 215, 0, 0.35)'
        };`);
                            classes.push(`      { class: Wall, data: wallData${slot.index} }`);
                        });
                        includedSlots.forEach((slot) => {
                            const index = slot.index;
                            const nId = (slot.nId && slot.nId.value ? slot.nId.value.trim() : 'NPC').replace(/'/g, "\\'");
                            const nMsg = (slot.nMsg && slot.nMsg.value ? slot.nMsg.value.trim() : '').replace(/'/g, "\\'");
                            const nSpriteKey = (slot.nSprite && slot.nSprite.value) ? slot.nSprite.value : 'chillguy';
                            const nSprite = assets.sprites[nSpriteKey] || assets.sprites['chillguy'];
                            const nX = (slot.nX && slot.nX.value) ? parseInt(slot.nX.value, 10) : 500;
                            const nY = (slot.nY && slot.nY.value) ? parseInt(slot.nY.value, 10) : 300;
                            npcDefs.push(`
        const npcData${index} = {
            id: '${nId}',
            greeting: '${nMsg}',
            src: path + "${nSprite.src}",
            SCALE_FACTOR: 8,
            ANIMATION_RATE: 50,
            INIT_POSITION: { x: ${nX}, y: ${nY} },
            pixels: { height: ${nSprite.h}, width: ${nSprite.w} },
            orientation: { rows: ${nSprite.rows}, columns: ${nSprite.cols} },
            down: { row: 0, start: 0, columns: 3 },
            hitbox: { widthPercentage: 0.1, heightPercentage: 0.2 },
            dialogues: ['${nMsg}'],
            reaction: function() { if (this.dialogueSystem) { this.showReactionDialogue(); } else { console.log(this.greeting); } },
            interact: function() { if (this.dialogueSystem) { this.showRandomDialogue(); } }
        };`);
                            classes.push(`      { class: Npc, data: npcData${index} }`);
                        });
                        const defs = defsStart + (wallDefs.length ? ('\n' + wallDefs.join('\n')) : '') + npcDefs.join('\n');
                        return header() + defs + footer(classes);
                }

                // Freestyle: keep last generated, allow edits; return current editor code
                return ui.editor.value;
        }

    // Compute diff range (line-based)
    function computeChangeRange(oldCode, newCode) {
        const oldLines = oldCode.split('\n');
        const newLines = newCode.split('\n');
        let start = 0;
        while (start < oldLines.length && start < newLines.length && oldLines[start] === newLines[start]) start++;
        let endOld = oldLines.length - 1;
        let endNew = newLines.length - 1;
        while (endOld >= start && endNew >= start && oldLines[endOld] === newLines[endNew]) { endOld--; endNew--; }
        const lineCount = Math.max(0, endNew - start + 1);
        return { startLine: start, lineCount };
    }

    function clearOverlay() { ui.hLayer.innerHTML = ''; }

    function renderOverlay() {
        clearOverlay();
        // Keep highlight aligned with scrolled content
        ui.hLayer.style.transform = `translateY(${-ui.editor.scrollTop}px)`;
        const addBox = (cls, start, count) => {
            if (!count || count < 1) return;
            const box = document.createElement('div');
            box.className = cls;
            box.style.top = (start * LINE_HEIGHT) + 'px';
            box.style.height = (count * LINE_HEIGHT) + 'px';
            ui.hLayer.appendChild(box);
        };
        if (state.typing) addBox('typing-highlight', state.typing.startLine, state.typing.lineCount);
        if (state.persistent) addBox('highlight-persistent-block', state.persistent.startLine, state.persistent.lineCount);
    }

    // Sync overlay with editor scroll
    ui.editor.addEventListener('scroll', renderOverlay);
    // Track manual edits in freestyle to avoid auto-overwriting code
    ui.editor.addEventListener('input', () => { if (!state.programmaticEdit) state.userEdited = true; });

    function syncFromControlsIfFreestyle() {
        const current = steps[stepIndex];
        if (current !== 'freestyle') return;
        if (state.userEdited) return; // don't overwrite user's manual edits
        const hasNPCs = ui.npcs.some(s => s.locked || (s.fieldsContainer && s.fieldsContainer.style.display !== 'none'));
        const hasPlayer = !!ui.pSprite.value;
        const hasBackground = !!ui.bg.value;
        const stepToCompose = hasNPCs ? 'npc' : (hasPlayer ? 'player' : (hasBackground ? 'background' : null));
        const newCode = stepToCompose ? generateStepCode(stepToCompose) : generateBaselineCode();
        if (newCode) {
            const oldCode = ui.editor.value;
            animateTypingDiff(oldCode, newCode, () => {
                runInEmbed();
            });
        }
    }

    function animateTypingDiff(oldCode, newCode, onDone) {
        state.programmaticEdit = true;
        const { startLine, lineCount } = computeChangeRange(oldCode, newCode);
        const oldLines = oldCode.split('\n');
        const newLines = newCode.split('\n');
        let current = oldLines.slice();
        const targetBlock = newLines.slice(startLine, startLine + lineCount).join('\n');
        let typed = '';
        state.persistent = null;
        state.typing = { startLine, lineCount: Math.max(1, lineCount) };
        renderOverlay();
        const speed = 6; // chars per frame (faster)
        function step() {
            for (let i = 0; i < speed && typed.length < targetBlock.length; i++) typed += targetBlock[typed.length];
            const partial = typed.split('\n');
            for (let i = 0; i < Math.max(1, lineCount); i++) {
                current[startLine + i] = partial[i] !== undefined ? partial[i] : '';
            }
            ui.editor.value = current.join('\n');
            renderOverlay();
            if (typed.length < targetBlock.length) {
                requestAnimationFrame(step);
            } else {
                ui.editor.value = newCode;
                state.programmaticEdit = false;
                state.typing = null;
                state.persistent = { startLine, lineCount: Math.max(1, lineCount) };
                renderOverlay();
                if (typeof onDone === 'function') onDone();
            }
        }
        requestAnimationFrame(step);
    }

    // Auto-sync controls in freestyle when changed
    const mvEl = document.getElementById('movement-keys');
    if (ui.bg) ui.bg.addEventListener('change', syncFromControlsIfFreestyle);
    if (ui.pSprite) ui.pSprite.addEventListener('change', syncFromControlsIfFreestyle);
    if (ui.pX) ui.pX.addEventListener('input', syncFromControlsIfFreestyle);
    if (mvEl) mvEl.addEventListener('change', syncFromControlsIfFreestyle);
    ui.npcs.forEach(slot => {
        if (slot.nId) slot.nId.addEventListener('input', syncFromControlsIfFreestyle);
        if (slot.nMsg) slot.nMsg.addEventListener('input', syncFromControlsIfFreestyle);
        if (slot.nSprite) slot.nSprite.addEventListener('change', syncFromControlsIfFreestyle);
        if (slot.nX) slot.nX.addEventListener('input', syncFromControlsIfFreestyle);
        if (slot.nY) slot.nY.addEventListener('input', syncFromControlsIfFreestyle);
    });
    ui.walls.forEach(slot => {
        if (slot.wId) slot.wId.addEventListener('input', syncFromControlsIfFreestyle);
        if (slot.wX) slot.wX.addEventListener('input', syncFromControlsIfFreestyle);
        if (slot.wY) slot.wY.addEventListener('input', syncFromControlsIfFreestyle);
        if (slot.wW) slot.wW.addEventListener('input', syncFromControlsIfFreestyle);
        if (slot.wH) slot.wH.addEventListener('input', syncFromControlsIfFreestyle);
    });

    document.getElementById('btn-confirm').addEventListener('click', () => {
        const oldCode = ui.editor.value;
        const current = steps[stepIndex];
        const newCode = generateStepCode(current);
        if (!newCode) {
            if (current === 'background') alert('Select a Background, then Confirm Step.');
            else if (current === 'player') alert('Select a Player sprite (and optional keys), then Confirm Step.');
            else alert('Add at least one NPC, then Confirm Step.');
            return;
        }
        animateTypingDiff(oldCode, newCode, () => {
            // Lock fields for completed step and (optionally) advance
            if (current === 'background') { lockField(ui.bg); }
            if (current === 'player') { lockField(ui.pSprite); lockField(ui.pX); lockField(document.getElementById('movement-keys')); }
            if (current === 'npc') {
                ui.npcs.forEach(slot => {
                    if (slot.fieldsContainer && slot.fieldsContainer.style.display !== 'none') {
                        // Mark as locked so updateStepUI keeps fields disabled until edited
                        slot.locked = true;
                        // Update Add NPC button to show user-named NPC and highlight
                        const name = (slot.nId && slot.nId.value ? slot.nId.value.trim() : 'NPC');
                        slot.displayName = name;
                        if (slot.addBtn) {
                            const open = slot.fieldsContainer && slot.fieldsContainer.style.display !== 'none';
                            slot.addBtn.textContent = name + (open ? ' ▾' : ' ▸');
                            slot.addBtn.classList.add('btn-confirm');
                        }
                        if (slot.deleteBtn) {
                            slot.deleteBtn.disabled = false;
                            slot.deleteBtn.style.display = '';
                        }
                    }
                });
                // Lock any visible walls
                ui.walls.forEach(slot => {
                    if (slot.fieldsContainer && slot.fieldsContainer.style.display !== 'none') {
                        slot.locked = true;
                        const name = (slot.wId && slot.wId.value ? slot.wId.value.trim() : 'Wall');
                        slot.displayName = name;
                        if (slot.addBtn) {
                            const open = slot.fieldsContainer && slot.fieldsContainer.style.display !== 'none';
                            slot.addBtn.textContent = name + (open ? ' ▾' : ' ▸');
                            slot.addBtn.classList.add('btn-confirm');
                        }
                        if (slot.deleteBtn) {
                            slot.deleteBtn.disabled = false;
                            slot.deleteBtn.style.display = '';
                        }
                    }
                });
                // Move to freestyle after first NPC is added so users can edit anything
                stepIndex = steps.indexOf('freestyle');
            } else {
                stepIndex = Math.min(stepIndex + 1, steps.length - 1);
            }
            setIndicator();
            updateStepUI();
            runInEmbed();
        });
    });

    function runInEmbed() {
        renderOverlay();
        const code = ui.editor.value;
        ui.iframe.src = ui.iframe.src;
        ui.iframe.onload = () => {
            setTimeout(() => {
                ui.iframe.contentWindow.postMessage({ type: 'rpg:run-code', code: code }, '*');
            }, 100);
        };
    }

    document.getElementById('btn-run').addEventListener('click', runInEmbed);

    // No forced defaults: keep all selects blank on initial load

    // Initial: show baseline skeleton and set step gating
    ui.editor.value = generateBaselineCode();
    setIndicator();
    updateStepUI();
    renderOverlay();
});
</script>

<script>
// Prevent arrow keys and space from scrolling the page during gameplay
window.addEventListener('keydown', function(e) {
    const keys = [32, 37, 38, 39, 40]; // space, left, up, right, down
    if (keys.includes(e.keyCode)) {
        // Only prevent if focus is not in an input/textarea
        if (!(e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.isContentEditable)) {
            e.preventDefault();
        }
    }
}, { passive: false });
</script>

<script>
    const navToggle = document.getElementById('nav-toggle');
    const sidebar = document.getElementById('rpg-nav-sidebar');
    if (navToggle && sidebar) {
        navToggle.addEventListener('click', () => sidebar.classList.toggle('open'));
    }
</script>