---
layout: post
title: Game Asset Creator
description: Helping programmers understand how to create a game
permalink: /rpg/gamebuilder
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
/* Sidebar component removed */
.wall-slot { margin-top:8px; border: 1px solid #444; padding: 10px; border-radius: 8px; background: rgba(0,0,0,0.08); }
.wall-fields label { display:block; }
</style>


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
                    <label>Name</label>
                    <input type="text" id="player-name" value="" placeholder="Player name">
                    <label>Sprite</label>
                    <select id="player-select">
                        <option value="" selected disabled>Select sprite…</option>
                        <option value="chillguy">Chill Guy</option>
                        <option value="tux">Tux</option>
                    </select>
                    <label>X Position</label>
                    <input type="range" id="player-x" min="0" max="800" value="100">
                    <label>Y Position</label>
                    <input type="range" id="player-y" min="0" max="600" value="300">
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
                    <div class="group-title">WALLS</div>
                    <button class="btn" id="add-wall">Add Wall</button>
                    <div id="walls-container" style="margin-top:8px;"></div>
                    <div style="margin-top:6px; font-size:0.8em; color: var(--text-muted);">
                        Walls are invisible in the game. <br>
                        They briefly show when a slot is <br>
                        opened for editing.
                    </div>
                </div>
                
            </div>
            <div class="button-footer">
                <button id="btn-confirm" class="btn btn-confirm">Confirm Step</button>
                <button id="btn-run" class="btn btn-run">Run Game</button>
                <div id="progress-indicator" style="font-size: 0.8em; color: var(--text-muted);">Step: background → player → freestyle</div>
                <ol class="steps-numbered" style="margin: 8px 0 0 18px; color: var(--text-muted); font-size: 0.85em;">
                    <li>Step 1: Background</li>
                    <li>Step 2: Player</li>
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
            alien: { src: "/images/gamebuilder/alien_planet.jpg", h: 600, w: 1000 },
            clouds: { src: "/images/gamebuilder/clouds.jpg", h: 720, w: 1280 }
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
        pY: document.getElementById('player-y'),
        pName: document.getElementById('player-name'),
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
        
        // Walls UI (dynamic slots)
        addWallBtn: document.getElementById('add-wall'),
        wallsContainer: document.getElementById('walls-container'),
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
                // When closing the dropdown, commit NPC and keep it present
                if (isVisible) {
                    // We are closing; lock the NPC and update header state
                    const name = (slot.nId && slot.nId.value ? slot.nId.value.trim() : 'NPC');
                    slot.locked = true;
                    slot.displayName = name;
                    slot.addBtn.classList.add('btn-confirm');
                    // Show delete when locked
                    if (slot.deleteBtn) { slot.deleteBtn.disabled = false; slot.deleteBtn.style.display = ''; }
                }
                // Update button label with caret and name
                const labelBase = slot.displayName && slot.locked ? slot.displayName : 'Add NPC';
                const caret = isVisible ? ' ▸' : ' ▾';
                slot.addBtn.textContent = labelBase + caret;
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

    // Dynamic Walls feature
    function makeWallSlot(index) {
        const slot = {
            index,
            locked: false,
            displayName: '',
            container: document.createElement('div'),
            fieldsOpen: false
        };
        slot.container.className = 'wall-slot';
        const headerBtn = document.createElement('button');
        headerBtn.className = 'btn';
        headerBtn.textContent = 'Add Wall ▸';
        const fields = document.createElement('div');
        fields.className = 'wall-fields';
        fields.style.display = 'none';
        fields.innerHTML = `
            <label>X</label>
            <input type="range" min="0" max="800" value="100" class="wall-x">
            <label>Y</label>
            <input type="range" min="0" max="600" value="100" class="wall-y">
            <label>Width</label>
            <input type="range" min="10" max="800" value="150" class="wall-w">
            <label>Height</label>
            <input type="range" min="10" max="600" value="20" class="wall-h">
            <div style="margin-top:8px; display:flex; gap:8px;">
                <button class="btn btn-sm btn-danger wall-delete">Delete</button>
            </div>
        `;
        slot.container.appendChild(headerBtn);
        slot.container.appendChild(fields);
        ui.wallsContainer.appendChild(slot.container);

        // Bind DOM refs
        slot.addBtn = headerBtn;
        slot.fieldsContainer = fields;
        slot.wX = fields.querySelector('.wall-x');
        slot.wY = fields.querySelector('.wall-y');
        slot.wW = fields.querySelector('.wall-w');
        slot.wH = fields.querySelector('.wall-h');
        slot.deleteBtn = fields.querySelector('.wall-delete');

        // Toggle open/close
        headerBtn.addEventListener('click', () => {
            const wasOpen = fields.style.display !== 'none';
            fields.style.display = wasOpen ? 'none' : '';
            slot.fieldsOpen = !wasOpen;
            const labelBase = slot.displayName && slot.locked ? slot.displayName : 'Add Wall';
            headerBtn.textContent = labelBase + (wasOpen ? ' ▸' : ' ▾');
            if (slot.locked && slot.displayName) headerBtn.classList.add('btn-confirm'); else headerBtn.classList.remove('btn-confirm');
            updateStepUI();
            syncFromControlsIfFreestyle();
        });

        // Delete
        slot.deleteBtn.addEventListener('click', () => {
            slot.container.remove();
            ui.walls = ui.walls.filter(w => w !== slot);
            updateStepUI();
            syncFromControlsIfFreestyle();
        });

        // Change listeners for freestyle sync
        ['input','change'].forEach(evt => {
            slot.wX.addEventListener(evt, syncFromControlsIfFreestyle);
            slot.wY.addEventListener(evt, syncFromControlsIfFreestyle);
            slot.wW.addEventListener(evt, syncFromControlsIfFreestyle);
            slot.wH.addEventListener(evt, syncFromControlsIfFreestyle);
        });

        ui.walls.push(slot);
        return slot;
    }

    if (ui.addWallBtn) {
        ui.addWallBtn.addEventListener('click', () => {
            const slot = makeWallSlot(ui.walls.length + 1);
            // Auto-open newly added slot for easy editing
            if (slot.fieldsContainer) slot.fieldsContainer.style.display = '';
            slot.fieldsOpen = true;
            slot.addBtn.textContent = 'Add Wall ▾';
            updateStepUI();
            syncFromControlsIfFreestyle();
        });
    }

    const LINE_HEIGHT = 20;
    const state = { persistent: null, typing: null, userEdited: false, programmaticEdit: false };
    const steps = ['background','player','freestyle'];
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
        [ui.bg, ui.pSprite, ui.pX, ui.pY, ui.pName, mv].forEach(el => { if (el) el.disabled = true; });
        ui.npcs.forEach(slot => {
            if (slot.addBtn) slot.addBtn.disabled = true;
            [slot.nId, slot.nMsg, slot.nSprite, slot.nX, slot.nY, slot.deleteBtn].forEach(el => { if (el) el.disabled = true; });
        });
        if (ui.addWallBtn) ui.addWallBtn.disabled = true;
        ui.walls.forEach(slot => {
            const fields = [slot.wX, slot.wY, slot.wW, slot.wH, slot.deleteBtn];
            if (slot.addBtn) slot.addBtn.disabled = true;
            fields.forEach(el => { if (el) el.disabled = true; });
        });
        
        if (current === 'background') {
            unlockField(ui.bg);
        } else if (current === 'player') {
            unlockField(ui.pSprite);
            unlockField(ui.pX);
            unlockField(ui.pY);
            unlockField(ui.pName);
            unlockField(mv);
            
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
            
        } else if (current === 'walls') {
            if (ui.addWallBtn) ui.addWallBtn.disabled = false;
            ui.walls.forEach(slot => {
                if (slot.addBtn) slot.addBtn.disabled = false;
                // Editable only when open
                if (slot.fieldsContainer && slot.fieldsContainer.style.display !== 'none') {
                    [slot.wX, slot.wY, slot.wW, slot.wH].forEach(el => unlockField(el));
                    if (slot.deleteBtn) { slot.deleteBtn.disabled = false; slot.deleteBtn.style.display = ''; }
                } else {
                    if (slot.deleteBtn) { slot.deleteBtn.disabled = !slot.locked; slot.deleteBtn.style.display = slot.locked ? '' : 'none'; }
                }
            });

        } else if (current === 'freestyle') {
            ui.editor.readOnly = false;
            [ui.bg, ui.pSprite, ui.pX, ui.pY, ui.pName, mv].forEach(el => { if (el) el.disabled = false; });
            ui.npcs.forEach(slot => {
                if (slot.addBtn) slot.addBtn.disabled = false;
                [slot.nId, slot.nMsg, slot.nSprite, slot.nX, slot.nY].forEach(el => { if (el) el.disabled = false; });
            });
            if (ui.addWallBtn) ui.addWallBtn.disabled = false;
            ui.walls.forEach(slot => {
                if (slot.addBtn) slot.addBtn.disabled = false;
                [slot.wX, slot.wY, slot.wW, slot.wH].forEach(el => unlockField(el));
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
    import Barrier from '/assets/js/adventureGame/GameEngine/Barrier.js';

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
import Barrier from '/assets/js/adventureGame/GameEngine/Barrier.js';
        

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
                        const name = (ui.pName && ui.pName.value ? ui.pName.value.trim() : 'Hero').replace(/'/g, "\\'");
                        const defs = `
        const bgData = {
            name: 'custom_bg',
            src: path + "${bg.src}",
            pixels: { height: ${bg.h}, width: ${bg.w} }
        };
        const playerData = {
            id: '${name}',
            src: path + "${p.src}",
            SCALE_FACTOR: 5,
            STEP_FACTOR: 1000,
            ANIMATION_RATE: 50,
            INIT_POSITION: { x: ${ui.pX.value}, y: ${ui.pY.value} },
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
                        const classes = [
            "      { class: GameEnvBackground, data: bgData }",
            "      { class: Player, data: playerData }"
                        ];
                        return header() + defs + footer(classes);
                }

                if (currentStep === 'npc') {
                    // Include all locked (previously confirmed) slots and any currently visible slots
                    const includedSlots = ui.npcs.filter(s => s.locked || (s.fieldsContainer && s.fieldsContainer.style.display !== 'none'));
                    if (includedSlots.length === 0) return null;

                        const name = (ui.pName && ui.pName.value ? ui.pName.value.trim() : 'Hero').replace(/'/g, "\\'");
                        const defsStart = `
        const bgData = {
            name: 'custom_bg',
            src: path + "${bg.src}",
            pixels: { height: ${bg.h}, width: ${bg.w} }
        };
        const playerData = {
            id: '${name}',
            src: path + "${p.src}",
            SCALE_FACTOR: 5,
            STEP_FACTOR: 1000,
            ANIMATION_RATE: 50,
            INIT_POSITION: { x: ${ui.pX.value}, y: ${ui.pY.value} },
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
                        const classes = [
            "      { class: GameEnvBackground, data: bgData }",
            "      { class: Player, data: playerData }"
                        ];
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
                        const defs = defsStart + npcDefs.join('\n');
                        return header() + defs + footer(classes);
                }

                if (currentStep === 'walls') {
                    if (!ui.bg.value || !ui.pSprite.value) return null;
                    const name = (ui.pName && ui.pName.value ? ui.pName.value.trim() : 'Hero').replace(/'/g, "\\'");
                    const defsStart = `
        const bgData = {
            name: 'custom_bg',
            src: path + "${bg.src}",
            pixels: { height: ${bg.h}, width: ${bg.w} }
        };
        const playerData = {
            id: '${name}',
            src: path + "${p.src}",
            SCALE_FACTOR: 5,
            STEP_FACTOR: 1000,
            ANIMATION_RATE: 50,
            INIT_POSITION: { x: ${ui.pX.value}, y: ${ui.pY.value} },
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
                    const classes = [
                        "      { class: GameEnvBackground, data: bgData }",
                        "      { class: Player, data: playerData }"
                    ];
                    // Add any locked/visible NPCs
                    const includedNPCs = ui.npcs.filter(s => s.locked || (s.fieldsContainer && s.fieldsContainer.style.display !== 'none'));
                    const npcDefs = [];
                    includedNPCs.forEach((slot) => {
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

                    // Add walls
                    const barrierDefs = [];
                    const includedWalls = ui.walls.filter(w => w.locked || w.fieldsOpen);
                    includedWalls.forEach((w, idx) => {
                        const x = parseInt(w.wX?.value || 100, 10);
                        const y = parseInt(w.wY?.value || 100, 10);
                        const wWidth = parseInt(w.wW?.value || 150, 10);
                        const wHeight = parseInt(w.wH?.value || 20, 10);
                        const visible = !!(w.fieldsContainer && w.fieldsContainer.style.display !== 'none');
                        const id = `wall_${idx+1}`;
                        barrierDefs.push(`
        const barrierData${idx+1} = {
            id: '${id}', x: ${x}, y: ${y}, width: ${wWidth}, height: ${wHeight}, visible: ${visible},
            hitbox: { widthPercentage: 0.0, heightPercentage: 0.0 }
        };`);
                        classes.push(`      { class: Barrier, data: barrierData${idx+1} }`);
                    });

                    const defs = defsStart + (npcDefs.length ? ('\n' + npcDefs.join('\n')) : '') + (barrierDefs.length ? ('\n' + barrierDefs.join('\n')) : '');
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
        const hasWalls = ui.walls.some(w => w.locked || w.fieldsOpen);
        const hasPlayer = !!ui.pSprite.value;
        const hasBackground = !!ui.bg.value;
        const stepToCompose = hasWalls ? 'walls' : (hasNPCs ? 'npc' : (hasPlayer ? 'player' : (hasBackground ? 'background' : null)));
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
    if (ui.pY) ui.pY.addEventListener('input', syncFromControlsIfFreestyle);
    if (ui.pName) ui.pName.addEventListener('input', syncFromControlsIfFreestyle);
    if (mvEl) mvEl.addEventListener('change', syncFromControlsIfFreestyle);
    ui.npcs.forEach(slot => {
        if (slot.nId) slot.nId.addEventListener('input', syncFromControlsIfFreestyle);
        // Reflect name changes in the dropdown header when editing
        if (slot.nId) slot.nId.addEventListener('input', () => {
            const name = slot.nId.value.trim();
            if (name.length) {
                slot.displayName = name;
                const isVisible = slot.fieldsContainer && slot.fieldsContainer.style.display !== 'none';
                const caret = isVisible ? ' ▾' : ' ▸';
                slot.addBtn.textContent = (slot.locked ? name : 'Add NPC') + caret;
            }
        });
        if (slot.nMsg) slot.nMsg.addEventListener('input', syncFromControlsIfFreestyle);
        if (slot.nSprite) slot.nSprite.addEventListener('change', syncFromControlsIfFreestyle);
        if (slot.nX) slot.nX.addEventListener('input', syncFromControlsIfFreestyle);
        if (slot.nY) slot.nY.addEventListener('input', syncFromControlsIfFreestyle);
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
            if (current === 'player') { lockField(ui.pSprite); lockField(ui.pX); lockField(ui.pY); lockField(ui.pName); lockField(document.getElementById('movement-keys')); }
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
                
                // After NPC confirmation, go to freestyle
                stepIndex = steps.indexOf('freestyle');
            } else {
                if (current === 'walls') {
                    ui.walls.forEach(w => {
                        if (w.fieldsContainer && w.fieldsContainer.style.display !== 'none') {
                            w.locked = true;
                            const name = w.displayName || `Wall ${w.index}`;
                            w.displayName = name;
                            if (w.addBtn) {
                                const open = w.fieldsContainer && w.fieldsContainer.style.display !== 'none';
                                w.addBtn.textContent = name + (open ? ' ▾' : ' ▸');
                                w.addBtn.classList.add('btn-confirm');
                            }
                            if (w.deleteBtn) { w.deleteBtn.disabled = false; w.deleteBtn.style.display = ''; }
                        }
                    });
                }
                stepIndex = Math.min(stepIndex + 1, steps.length - 1);
            }
            setIndicator();
            updateStepUI();
            runInEmbed();
        });
    });

    function safeCodeToRun() {
        const code = ui.editor.value || '';
        const hasLevels = /export\s+const\s+gameLevelClasses/.test(code);
        return hasLevels ? code : generateBaselineCode();
    }

    function runInEmbed() {
        renderOverlay();
        const code = safeCodeToRun();
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
