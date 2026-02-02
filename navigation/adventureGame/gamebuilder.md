---
layout: opencs 
title: GameBuilder
description: Helping programmers understand how to create a game
permalink: /rpg/gamebuilder
---

<style>
.page-content .wrapper { max-width: 100% !important; padding: 0 !important; }

/* Hide GameEngine control buttons in gamebuilder iframe */
iframe .pause-button-bar,
iframe button.pause-btn,
iframe .leaderboard-widget {
    display: none !important;
    visibility: hidden !important;
}

.gamebuilder-title {
    text-align: center;
    font-size: 2em;
    font-weight: bold;
    letter-spacing: 2px;
}

.creator-layout {
    display: flex;
    gap: 10px;
    padding: 10px;
    height: 92vh;
    box-sizing: border-box;
}

.col-asset { 
    flex: 0 0 20%; 
    display: flex; 
    flex-direction: column; 
}

.col-main { 
    flex: 1; 
    display: flex; 
    flex-direction: column; 
    min-width: 0;
    position: relative;
}

.col-main.view-code .panel-game { display: none; }
.col-main.view-game .panel-code { display: none; }

.col-main.view-code .panel-code,
.col-main.view-game .panel-game {
    flex: 1;
}

/* Split view: side-by-side layout */
.col-main.view-split .main-content {
    flex-direction: row;
}

.col-main.view-split .panel-game {
    flex: 0 0 55%;
}

.col-main.view-split .panel-code {
    flex: 1;
}

.view-controls {
    display: flex;
    gap: 5px;
    margin-bottom: 10px;
}

.view-btn {
    flex: 1;
    padding: 8px;
    border: 1px solid rgba(255,255,255,0.2);
    border-radius: 6px;
    background: rgba(0,0,0,0.3);
    cursor: pointer;
    font-size: 0.8em;
    text-transform: uppercase;
    transition: all 0.2s;
}

.view-btn.active {
    background: rgba(255,255,255,0.1);
    border-color: var(--pref-accent-color);
}

.view-btn:hover:not(.active) {
    background: rgba(255,255,255,0.05);
}

.main-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 10px;
    min-height: 0;
}

.glass-panel {
    background: rgba(0,0,0,0.3);
    backdrop-filter: blur(20px);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 12px;
    display: flex;
    flex-direction: column;
    overflow: hidden;
}

.panel-header {
    padding: 16px;
    background: rgba(0,0,0,0.3);
    border-bottom: 1px solid rgba(255,255,255,0.1);
    font-weight: 700;
    text-transform: uppercase;
    font-size: 0.9em;
    letter-spacing: 1px;
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.panel-controls {
    display: flex;
    gap: 8px;
    align-items: center;
}

.icon-btn {
    width: 32px;
    height: 32px;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-size: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
    position: relative;
}

.icon-btn:hover::after {
    content: attr(data-tooltip);
    position: absolute;
    bottom: -30px;
    left: 50%;
    transform: translateX(-50%);
    background: rgba(0,0,0,0.9);
    color: white;
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 11px;
    white-space: nowrap;
    z-index: 1000;
    pointer-events: none;
}

.step-indicator {
    font-size: 11px;
    color: var(--text-muted);
    margin-right: 4px;
}

.scroll-form { flex: 1; overflow-y: auto; padding: 15px; }
.asset-group {
    background: rgba(255,255,255,0.02);
    border: 1px solid rgba(255,255,255,0.05);
    border-radius: 8px;
    padding: 14px;
    margin-bottom: 15px;
}
.group-title { 
    font-size: 0.8em; 
    font-weight: bold; 
    margin-bottom: 12px;
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.add-item-btn {
    width: 24px;
    height: 24px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 18px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
    line-height: 1;
    padding: 0;
}

label { display: block; font-size: 0.7em; margin-bottom: 5px; }
select, input {
    width: 100%;
    padding: 8px;
    border-radius: 4px;
    font-size: 0.85em;
    margin-bottom: 10px;
    color: #fff;
    background: #000;
    border: 1px solid rgba(255,255,255,0.2);
}
select { color: #fff; background: #000; }
option { color: #fff; background: #000; }
.asset-group select,
.wall-fields select { color: #fff; }
select:disabled, option[disabled] { color: #fff; }

.btn {
    padding: 12px;
    border-radius: 6px;
    border: none;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.2s;
    text-transform: uppercase;
    font-size: 0.85em;
}
.btn-confirm { }
.btn-run { }
.btn-danger { }

.help-panel {
    display: none;
    position: absolute;
    top: 50px;
    right: 16px;
    background: rgba(0,0,0,0.95);
    border: 1px solid rgba(255,255,255,0.2);
    border-radius: 8px;
    padding: 12px;
    max-width: 300px;
    z-index: 100;
    font-size: 0.85em;
    line-height: 1.4;
}

.help-panel.active { display: block; }

.code-panel { flex: 1; position: relative; }
.editor-container {
    position: relative;
    flex: 1;
    width: 100%;
    overflow: hidden;
}
.code-layer {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    padding: 20px;
    box-sizing: border-box;
    font-family: 'Fira Code', 'Courier New', monospace;
    font-size: 13px;
    line-height: 20px; 
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
    padding: 20px; 
    box-sizing: border-box;
    pointer-events: none;
    z-index: 1;
}
.highlight-box {
    position: absolute;
    background: color-mix(in srgb, var(--pref-accent-color) 25%, transparent);
    border-left: 4px solid var(--pref-accent-color);
    left: 10px;
    width: calc(100% - 20px);
    display: block !important; 
}

.highlight-persistent-block {
    position: absolute;
    background: color-mix(in srgb, var(--pref-accent-color) 12%, transparent);
    border: 2px solid var(--pref-accent-color);
    border-left-width: 4px;
    left: 10px;
    width: calc(100% - 20px);
}

.typing-highlight {
    position: absolute;
    background: color-mix(in srgb, var(--pref-accent-color) 25%, transparent);
    border-left: 4px solid var(--pref-accent-color);
    left: 10px;
    width: calc(100% - 20px);
}

.game-frame { flex: 1; }
iframe { width: 100%; height: 100%; border: none; }
.wall-slot { margin-top:8px; border: 1px solid rgba(255,255,255,0.1); padding: 10px; border-radius: 8px; background: rgba(0,0,0,0.08); }
.wall-fields label { display:block; }

@media (max-width: 768px) {
    .creator-layout {
        flex-direction: column;
        height: auto;
    }
    
    .col-asset { 
        flex: none; 
        max-height: 300px; 
    }
    
    .col-main {
        flex: none;
        min-height: 600px;
    }
    
    .col-main.view-code,
    .col-main.view-game {
    }
    
    .col-main.view-code .panel-game,
    .col-main.view-game .panel-code {
        display: flex !important;
    }
    
    .col-main .main-content {
        flex-direction: column !important;
    }
    
    .col-main .panel-game { 
        flex: 0 0 45% !important;
    }
    
    .col-main .panel-code { 
        flex: 1 !important;
    }
    
    .view-controls {
        display: none;
    }
    
    .gamebuilder-title {
        font-size: 1.2em;
    }
}

</style>

<div class="gamebuilder-title">{{page.title}}</div>

<div class="creator-layout">
    <div class="col-asset">
        <div class="glass-panel creator-panel" style="position: relative;">
            <div class="panel-header">
                <span>Assets</span>
                <div class="panel-controls">
                    <span class="step-indicator" id="step-indicator-mini">Step 1/2</span>
                    <button id="btn-confirm" class="icon-btn" data-tooltip="Confirm Step">✓</button>
                    <button id="btn-run" class="icon-btn" data-tooltip="Run Game">▶</button>
                    <button id="btn-help" class="icon-btn" data-tooltip="Help">?</button>
                </div>
            </div>
            <div class="help-panel" id="help-panel">
                <strong>Steps:</strong><br>
                1. Background - Select environment<br>
                2. Player - Configure character<br>
                3. Freestyle - Add NPCs, Walls, etc<br><br>
                <strong>Tips:</strong> Walls are invisible in-game. They show briefly when editing.
            </div>
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
                    <div class="group-title">
                        <span>NPC</span>
                        <button class="add-item-btn" id="add-npc">+</button>
                    </div>
                    <div id="npcs-container"></div>
                </div>
                <div class="asset-group">
                    <div class="group-title">
                        <span>WALLS</span>
                        <button class="add-item-btn" id="add-wall">+</button>
                    </div>
                    <div id="walls-container"></div>
                </div>
            </div>
        </div>
    </div>
    <div class="col-main view-split">
        <div class="view-controls">
            <button class="view-btn" data-view="code">Code</button>
            <button class="view-btn" data-view="game">Game</button>
            <button class="view-btn active" data-view="split">Split</button>
        </div>
        <div class="main-content">
            <div class="glass-panel panel-game">
                <div class="panel-header">Game View</div>
                <div class="game-frame">
                    <iframe id="game-iframe" src="{{ site.baseurl }}/rpg/latest?embed=1&autostart=0"></iframe>
                </div>
            </div>
            <div class="glass-panel code-panel panel-code">
                <div class="panel-header">Code View (JS)</div>
                <div class="editor-container" id="editor-container">
                    <div id="highlight-layer" class="highlight-layer"></div>
                    <textarea id="code-editor" class="code-layer" readonly spellcheck="false"></textarea>
                </div>
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
        
        // NPCs UI 
        addNpcBtn: document.getElementById('add-npc'),
        npcsContainer: document.getElementById('npcs-container'),
        npcs: [],

        // Walls UI 
        addWallBtn: document.getElementById('add-wall'),
        wallsContainer: document.getElementById('walls-container'),
        walls: [],

        editor: document.getElementById('code-editor'),
        hLayer: document.getElementById('highlight-layer'),
        iframe: document.getElementById('game-iframe'),
        
        //  controls
        colMain: document.querySelector('.col-main'),
        viewBtns: document.querySelectorAll('.view-btn')
    };

    ui.viewBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const view = btn.dataset.view;
            ui.colMain.className = `col-main view-${view}`;
            ui.viewBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    
            // NOTE: removed preloading/inlining of full engine sources to keep the editor focused
            // Students only need the import lines and asset/JSON definitions; no fetching here.
    });

    // npcs
    function makeNpcSlot(index) {
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
        headerBtn.textContent = `NPC ${index} ▸`;
        const fields = document.createElement('div');
        fields.className = 'wall-fields';
        fields.style.display = 'none';
        fields.innerHTML = `
            <label>ID</label>
            <input type="text" placeholder="NPC id" class="npc-id">
            <label>Message</label>
            <input type="text" placeholder="Message when interacted with" class="npc-msg">
            <label>Sprite</label>
            <select class="npc-sprite">
                <option value="" selected disabled>Select sprite…</option>
                <option value="chillguy">Chill Guy</option>
                <option value="tux">Tux (penguin)</option>
                <option value="r2d2">R2D2</option>
            </select>
            <label>Position X</label>
            <input type="range" min="0" max="800" value="500" class="npc-x">
            <label>Position Y</label>
            <input type="range" min="0" max="600" value="300" class="npc-y">
            <div style="margin-top:8px; display:flex; gap:8px;">
                <button class="btn btn-sm btn-danger npc-delete">Delete</button>
            </div>
        `;
        slot.container.appendChild(headerBtn);
        slot.container.appendChild(fields);
        ui.npcsContainer.appendChild(slot.container);

        slot.addBtn = headerBtn;
        slot.fieldsContainer = fields;
        slot.nId = fields.querySelector('.npc-id');
        slot.nMsg = fields.querySelector('.npc-msg');
        slot.nSprite = fields.querySelector('.npc-sprite');
        slot.nX = fields.querySelector('.npc-x');
        slot.nY = fields.querySelector('.npc-y');
        slot.deleteBtn = fields.querySelector('.npc-delete');

        headerBtn.addEventListener('click', () => {
            const wasOpen = fields.style.display !== 'none';
            fields.style.display = wasOpen ? 'none' : '';
            slot.fieldsOpen = !wasOpen;
            const labelBase = slot.displayName && slot.locked ? slot.displayName : `NPC ${index}`;
            headerBtn.textContent = labelBase + (wasOpen ? ' ▸' : ' ▾');
            if (slot.locked && slot.displayName) headerBtn.classList.add('btn-confirm'); else headerBtn.classList.remove('btn-confirm');
            updateStepUI();
            syncFromControlsIfFreestyle();
        });

        slot.deleteBtn.addEventListener('click', () => {
            slot.container.remove();
            ui.npcs = ui.npcs.filter(n => n !== slot);
            updateStepUI();
            syncFromControlsIfFreestyle();
        });

        ['input','change'].forEach(evt => {
            slot.nId.addEventListener(evt, syncFromControlsIfFreestyle);
            slot.nMsg.addEventListener(evt, syncFromControlsIfFreestyle);
            slot.nSprite.addEventListener(evt, syncFromControlsIfFreestyle);
            slot.nX.addEventListener(evt, syncFromControlsIfFreestyle);
            slot.nY.addEventListener(evt, syncFromControlsIfFreestyle);
        });

        ui.npcs.push(slot);
        return slot;
    }

    if (ui.addNpcBtn) {
        ui.addNpcBtn.addEventListener('click', () => {
            const slot = makeNpcSlot(ui.npcs.length + 1);
            if (slot.fieldsContainer) slot.fieldsContainer.style.display = '';
            slot.fieldsOpen = true;
            slot.addBtn.textContent = `NPC ${ui.npcs.length} ▾`;
            updateStepUI();
            syncFromControlsIfFreestyle();
        });
    }

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
        headerBtn.textContent = `Wall ${index} ▸`;
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

        slot.addBtn = headerBtn;
        slot.fieldsContainer = fields;
        slot.wX = fields.querySelector('.wall-x');
        slot.wY = fields.querySelector('.wall-y');
        slot.wW = fields.querySelector('.wall-w');
        slot.wH = fields.querySelector('.wall-h');
        slot.deleteBtn = fields.querySelector('.wall-delete');

        headerBtn.addEventListener('click', () => {
            const wasOpen = fields.style.display !== 'none';
            fields.style.display = wasOpen ? 'none' : '';
            slot.fieldsOpen = !wasOpen;
            const labelBase = slot.displayName && slot.locked ? slot.displayName : `Wall ${index}`;
            headerBtn.textContent = labelBase + (wasOpen ? ' ▸' : ' ▾');
            if (slot.locked && slot.displayName) headerBtn.classList.add('btn-confirm'); else headerBtn.classList.remove('btn-confirm');
            updateStepUI();
            syncFromControlsIfFreestyle();
        });

        slot.deleteBtn.addEventListener('click', () => {
            slot.container.remove();
            ui.walls = ui.walls.filter(w => w !== slot);
            updateStepUI();
            syncFromControlsIfFreestyle();
        });

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
            if (slot.fieldsContainer) slot.fieldsContainer.style.display = '';
            slot.fieldsOpen = true;
            slot.addBtn.textContent = `Wall ${ui.walls.length} ▾`;
            updateStepUI();
            syncFromControlsIfFreestyle();
        });
    }

    const LINE_HEIGHT = 20;
    const state = { persistent: null, typing: null, userEdited: false, programmaticEdit: false };
    const steps = ['background','player','freestyle'];
    let stepIndex = 0; 
    const stepIndicatorMini = document.getElementById('step-indicator-mini');
    const helpBtn = document.getElementById('btn-help');
    const helpPanel = document.getElementById('help-panel');

    if (helpBtn && helpPanel) {
        helpBtn.addEventListener('click', () => {
            helpPanel.classList.toggle('active');
        });
        document.addEventListener('click', (e) => {
            if (!helpBtn.contains(e.target) && !helpPanel.contains(e.target)) {
                helpPanel.classList.remove('active');
            }
        });
    }

    function setIndicator() {
        const current = steps[stepIndex];
        if (stepIndicatorMini) {
            if (stepIndex < 2) {
                stepIndicatorMini.textContent = `Step ${stepIndex + 1}/2`;
            } else {
                stepIndicatorMini.textContent = 'Freestyle';
            }
        }
    }

    function lockField(el) { if (el) { el.disabled = true; el.classList.add('locked'); } }
    function unlockField(el) { if (el) { el.disabled = false; el.classList.remove('locked'); } }

    function updateStepUI() {
        const current = steps[stepIndex];
        const mv = document.getElementById('movement-keys');
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
            if (ui.addNpcBtn) ui.addNpcBtn.disabled = false;
            ui.npcs.forEach(slot => {
                if (slot.addBtn) slot.addBtn.disabled = false;
                if (slot.fieldsContainer && slot.fieldsContainer.style.display !== 'none') {
                    [slot.nId, slot.nMsg, slot.nSprite, slot.nX, slot.nY].forEach(el => unlockField(el));
                    if (slot.deleteBtn) { slot.deleteBtn.disabled = false; slot.deleteBtn.style.display = ''; }
                } else {
                    if (slot.deleteBtn) { slot.deleteBtn.disabled = !slot.locked; slot.deleteBtn.style.display = slot.locked ? '' : 'none'; }
                }
            });

        } else if (current === 'walls') {
            if (ui.addWallBtn) ui.addWallBtn.disabled = false;
            ui.walls.forEach(slot => {
                if (slot.addBtn) slot.addBtn.disabled = false;
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
            if (ui.addNpcBtn) ui.addNpcBtn.disabled = false;
            ui.npcs.forEach(slot => {
                if (slot.addBtn) slot.addBtn.disabled = false;
                [slot.nId, slot.nMsg, slot.nSprite, slot.nX, slot.nY].forEach(el => { if (el) el.disabled = false; });
                if (slot.deleteBtn) { slot.deleteBtn.disabled = false; slot.deleteBtn.style.display = ''; }
            });
            if (ui.addWallBtn) ui.addWallBtn.disabled = false;
            ui.walls.forEach(slot => {
                if (slot.addBtn) slot.addBtn.disabled = false;
                [slot.wX, slot.wY, slot.wW, slot.wH].forEach(el => unlockField(el));
                if (slot.deleteBtn) { slot.deleteBtn.disabled = false; slot.deleteBtn.style.display = ''; }
            });

        }
    }

        function generateBaselineCode() {
                    const importBlock = getImportsBlock();
                    return `${importBlock}class CustomLevel {
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

    export const gameLevelClasses = [CustomLevel];`;
        }

            function getImportsBlock() {
                // Keep the editor focused for learners: only show the minimal import lines
                return `import GameEnvBackground from '/assets/js/GameEngine/essentials/GameEnvBackground.js';\nimport Player from '/assets/js/GameEngine/gameObjects/Player.js';\nimport Npc from '/assets/js/GameEngine/gameObjects/Npc.js';\nimport Barrier from '/assets/js/adventureGame/Barrier.js';\n\n`;
            }

        function generateStepCode(currentStep) {
                const bg = assets.bg[ui.bg.value];
                const p = assets.sprites[ui.pSprite.value];
                const movement = document.getElementById('movement-keys').value || 'wasd';
                const keypress = movement === 'arrows'
                        ? '{ up: 38, left: 37, down: 40, right: 39 }'
                        : '{ up: 87, left: 65, down: 83, right: 68 }';

                function header() {
                    const ib = getImportsBlock();
                    return `${ib}class CustomLevel {
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
                    const includedSlots = ui.npcs.slice();
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
                    const includedNPCs = ui.npcs.slice();
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

                    // add walls
                    const barrierDefs = [];
                    const includedWalls = ui.walls.slice();
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

                return ui.editor.value;
        }

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

    ui.editor.addEventListener('scroll', renderOverlay);
    ui.editor.addEventListener('input', () => { if (!state.programmaticEdit) state.userEdited = true; });

    function syncFromControlsIfFreestyle() {
        const current = steps[stepIndex];
        if (current !== 'freestyle') return;
        if (state.userEdited) return; 
        const hasNPCs = ui.npcs.length > 0;
        const hasWalls = ui.walls.length > 0;
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
        const speed = (startLine === 0 ? 60 : 6);
        function step() {
            for (let i = 0; i < speed && typed.length < targetBlock.length; i++) typed += targetBlock[typed.length];
            const partial = typed.split('\n');
            for (let i = 0; i < Math.max(1, lineCount); i++) {
                current[startLine + i] = partial[i] !== undefined ? partial[i] : '';
            }
            ui.editor.value = current.join('\n');
            // Auto-scroll editor so the typing area stays visible
            try {
                const visibleLine = startLine + Math.max(0, partial.length - 1);
                const scrollTarget = Math.max(0, (visibleLine * LINE_HEIGHT) - (ui.editor.clientHeight - LINE_HEIGHT));
                ui.editor.scrollTop = scrollTarget;
            } catch (e) {}
            renderOverlay();
            if (typed.length < targetBlock.length) {
                requestAnimationFrame(step);
            } else {
                ui.editor.value = newCode;
                // Ensure final code is visible
                try { ui.editor.scrollTop = ui.editor.scrollHeight; } catch (e) {}
                state.programmaticEdit = false;
                state.typing = null;
                state.persistent = { startLine, lineCount: Math.max(1, lineCount) };
                renderOverlay();
                if (typeof onDone === 'function') onDone();
            }
        }
        requestAnimationFrame(step);
    }

    const mvEl = document.getElementById('movement-keys');
    if (ui.bg) ui.bg.addEventListener('change', syncFromControlsIfFreestyle);
    if (ui.pSprite) ui.pSprite.addEventListener('change', syncFromControlsIfFreestyle);
    if (ui.pX) ui.pX.addEventListener('input', syncFromControlsIfFreestyle);
    if (ui.pY) ui.pY.addEventListener('input', syncFromControlsIfFreestyle);
    if (ui.pName) ui.pName.addEventListener('input', syncFromControlsIfFreestyle);
    if (mvEl) mvEl.addEventListener('change', syncFromControlsIfFreestyle);
    ui.npcs.forEach(slot => {
        if (slot.nId) slot.nId.addEventListener('input', syncFromControlsIfFreestyle);
        if (slot.nId) slot.nId.addEventListener('input', () => {
            const name = slot.nId.value.trim();
            if (name.length) {
                slot.displayName = name;
                const isVisible = slot.fieldsContainer && slot.fieldsContainer.style.display !== 'none';
                const caret = isVisible ? ' ▾' : ' ▸';
                slot.addBtn.textContent = (slot.locked ? name : 'NPC') + caret;
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
            if (current === 'background') { lockField(ui.bg); }
            if (current === 'player') { lockField(ui.pSprite); lockField(ui.pX); lockField(ui.pY); lockField(ui.pName); lockField(document.getElementById('movement-keys')); }
            if (current === 'npc') {
                ui.npcs.forEach(slot => {
                    if (slot.fieldsContainer && slot.fieldsContainer.style.display !== 'none') {
                        slot.locked = true;
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
        const source = hasLevels ? code : generateBaselineCode();
        // If editor inlined engine sources as commented blocks, convert them to imports for runtime
        return prepareRunnableCode(source);
    }

    function prepareRunnableCode(code) {
        if (!code) return code;
        // Replace inlined commented module blocks of form:
        // // --- /path/to/module.js ---\n/*\n...src...\n*/\n
        const inlineRe = /\/\/ --- (\/[\w\-\/\.]+\.js) ---\n\/\*[\s\S]*?\*\/\n*/g;
        const imports = new Set();
        const transformed = code.replace(inlineRe, (m, p) => {
            try {
                const name = p.split('/').pop().replace(/\.js$/, '');
                imports.add(`import ${name} from '${p}';`);
                return '';
            } catch (e) {
                return '';
            }
        });
        // If we collected imports, prepend them to the file
        if (imports.size > 0) {
            return Array.from(imports).join('\n') + '\n\n' + transformed;
        }
        return transformed;
    }

    function runInEmbed() {
        renderOverlay();
        const code = safeCodeToRun();
        const currentSrc = ui.iframe.src;
        
        // Set up message handler first
        ui.iframe.onload = () => {
            setTimeout(() => {
                try {
                    ui.iframe.contentWindow.postMessage({ type: 'rpg:run-code', code: code }, '*');
                } catch (e) {
                    console.error('Failed to send code to iframe:', e);
                }
            }, 200);
        };
        
        // Force iframe reload by changing src to self with cache bust
        const urlObj = new URL(currentSrc, window.location.origin);
        urlObj.searchParams.set('t', Date.now());
        ui.iframe.src = urlObj.toString();
    }

    document.getElementById('btn-run').addEventListener('click', runInEmbed);


    ui.editor.value = generateBaselineCode();
    setIndicator();
    updateStepUI();
    renderOverlay();
    
    // Hide control buttons in the iframe by injecting CSS
    ui.iframe.addEventListener('load', () => {
        try {
            const style = ui.iframe.contentDocument.createElement('style');
            style.textContent = `
                .pause-button-bar { display: none !important; }
                .leaderboard-widget { display: none !important; }
                .score-display { display: none !important; }
                .score-counter { display: none !important; }
                .stats-display { display: none !important; }
                #scoreDisplay { display: none !important; }
                #score { display: none !important; }
                .hud { display: none !important; }
                [id*="score" i] { display: none !important; }
                [class*="score" i] { display: none !important; }
            `;
            ui.iframe.contentDocument.head.appendChild(style);
        } catch (e) {
            // Cross-origin restriction, ignore
            console.debug('Cannot inject CSS into iframe:', e);
        }
    });
});
</script>

<script>
window.addEventListener('keydown', function(e) {
    const keys = [32, 37, 38, 39, 40]; 
    if (keys.includes(e.keyCode)) {
        if (!(e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.isContentEditable)) {
            e.preventDefault();
        }
    }
}, { passive: false });
</script>
