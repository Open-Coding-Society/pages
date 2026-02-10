---
layout: opencs 
title: GameBuilder
description: Helping programmers understand how to create a game
permalink: /rpg/gamebuilder
---

<!-- page-level styles and UI layout for the GameBuilder interface -->
<style>
.page-content .wrapper { max-width: 100% !important; padding: 0 !important; }

/* Hide BetterGameEngine control buttons in gamebuilder iframe */
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

.icon-btn.staged {
    box-shadow: 0 0 10px rgba(0,200,0,0.9);
    border-color: rgba(0,200,0,0.9);
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
.btn-sm {
    padding: 6px;
    border-radius: 4px;
    font-size: 0.7em;
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
    background: rgba(255, 230, 0, 0.6); /* Opaque yellow highlight for added code */
    border: 2px solid #ffdd00;
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

/* drawing overlay for walls/pass zones */
.game-frame {
    position: relative;
}
.draw-overlay {
    position: absolute;
    inset: 0;
    pointer-events: none; 
    z-index: 50;
}
.draw-overlay.active { pointer-events: auto; }
.draw-overlay.mode-barrier { cursor: crosshair; }
.draw-rect {
    position: absolute;
    box-sizing: border-box;
}
.draw-rect.barrier {
    border: 2px solid #ff2d2d; 
    background: rgba(255,0,0,0.05);
}
.draw-toolbar {
    display: flex;
    gap: 8px;
    margin-top: 8px;
}
.draw-btn {
    padding: 8px;
    border-radius: 6px;
    border: 1px solid rgba(255,255,255,0.2);
    background: rgba(0,0,0,0.3);
    cursor: pointer;
    font-size: 0.8em;
}
.draw-btn.active {
    border-color: var(--pref-accent-color);
    background: rgba(255,255,255,0.08);
}

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

<!-- title banner for the GameBuilder page -->
<div class="gamebuilder-title">{{page.title}}</div>

<!-- main builder layout: left (assets) + right (code and game) -->
<div class="creator-layout">
    <div class="col-asset">
        <!-- assets panel: background, player, NPCs, and walls inputs -->
        <div class="glass-panel creator-panel" style="position: relative;">
            <div class="panel-header">
                <span>Assets</span>
                <div class="panel-controls">
                    <span class="step-indicator" id="step-indicator-mini">Step 1/2</span>
                    <button id="btn-confirm" class="icon-btn" data-tooltip="Confirm Step">✓</button>
                    <button id="btn-run" class="icon-btn" data-tooltip="Run Game">▶</button>
                    <button id="btn-export" class="icon-btn" data-tooltip="Export Code">⤓</button>
                    <button id="btn-help" class="icon-btn" data-tooltip="Help">?</button>
                    <button id="btn-refresh-assets" class="icon-btn" data-tooltip="Refresh Assets">⟳</button>
                </div>
            </div>
            <!-- help panel: shows step-by-step guidance and tips -->
            <div class="help-panel" id="help-panel">
                <strong>Steps:</strong><br>
                1. Background - Select environment<br>
                2. Player - Configure character<br>
                3. Freestyle - Add NPCs, Walls, etc<br><br>
                <strong>Tips:</strong> Draw red barriers directly on the game view. Barriers collide. Walls are visible in-game by default; use the Walls toggle to hide them while testing.
            </div>
            <!-- scrollable form: asset configuration sections -->
            <div class="scroll-form">
                <div class="asset-group">
                    <!-- environment selection and upload instructions -->
                    <div class="group-title">ENVIRONMENT</div>
                    <label>Background Selection</label>
                    <select id="bg-select">
                        <option value="" selected disabled>Select background…</option>
                        <option value="desert">Desert Dunes</option>
                        <option value="alien">Alien Planet</option>
                        <option value="skykingdom">Sky Kingdom</option>
                    </select>
                    <div class="upload-instructions" style="margin-top:6px;">
                        <button id="bg-instructions-btn" class="btn btn-sm">Upload Instructions ▸</button>
                        <div id="bg-instructions-panel" class="instructions-panel" style="display:none; font-size:0.75em; color: var(--text-muted); margin-top:6px;">
                            To add your own backgrounds, place files under <code>images/gamebuilder/bg</code> and then press the Refresh Assets button. See <a href="{{ site.baseurl }}/gamebuilder-upload-instructions">upload instructions</a>.
                            <div style="margin-top:4px;">Backgrounds json: <a href="{{ site.baseurl }}/images/gamebuilder/bg/index.json">images/gamebuilder/bg/index.json</a></div>
                        </div>
                    </div>
                </div>
                <div class="asset-group">
                    <!-- player configuration: name, sprite, position, controls, advanced settings -->
                    <div class="group-title">PLAYER</div>
                    <label>Name</label>
                    <input type="text" id="player-name" value="" placeholder="Player name">
                    <label>Sprite</label>
                    <select id="player-select">
                        <option value="" selected disabled>Select sprite…</option>
                        <option value="chillguy">Chill Guy</option>
                        <option value="tux">Tux</option>
                    </select>
                    <div class="upload-instructions" style="margin-top:6px;">
                        <button id="sprite-instructions-btn" class="btn btn-sm">Upload Instructions ▸</button>
                        <div id="sprite-instructions-panel" class="instructions-panel" style="display:none; font-size:0.75em; color: var(--text-muted); margin-top:6px;">
                            To add your own spritesheets, place files under <code>images/gamebuilder/sprites</code> (and set rows/cols in index.json). Then press Refresh Assets. See <a href="{{ site.baseurl }}/gamebuilder-upload-instructions">upload instructions</a>.
                            <div style="margin-top:4px;">Sprites json: <a href="{{ site.baseurl }}/images/gamebuilder/sprites/index.json">images/gamebuilder/sprites/index.json</a></div>
                        </div>
                    </div>
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
                    <div class="upload-instructions" style="margin-top:6px;">
                        <button id="player-advanced-btn" class="btn btn-sm">Advanced ▸</button>
                        <div id="player-advanced-panel" class="instructions-panel" style="display:none; font-size:0.85em; color: var(--text-muted); margin-top:6px;">
                            <div style="display:grid; grid-template-columns: 1fr 1fr; gap:8px; align-items:end;">
                                <div>
                                    <label>Scale Factor</label>
                                    <input type="number" id="player-scale" min="1" max="20" value="5">
                                </div>
                                <div>
                                    <label>Step Factor</label>
                                    <input type="number" id="player-step" min="100" max="5000" value="1000">
                                </div>
                                <div>
                                    <label>Animation Rate (ms)</label>
                                    <input type="number" id="player-anim" min="10" max="500" value="50">
                                </div>
                                <div>
                                    <label>Rows</label>
                                    <input type="number" id="player-rows" min="1" value="1">
                                </div>
                                <div>
                                    <label>Columns</label>
                                    <input type="number" id="player-cols" min="1" value="1">
                                </div>
                            </div>
                            <div style="margin-top:8px; padding-top:8px; border-top:1px solid rgba(255,255,255,0.1);">
                                <div style="font-weight:600; margin-bottom:6px;">Directional Rows</div>
                                <div style="display:grid; grid-template-columns: repeat(4, 1fr); gap:8px; align-items:end;">
                                    <div>
                                        <label>Down Row</label>
                                        <input type="number" id="player-dir-down-row" min="0" value="0">
                                    </div>
                                    <div>
                                        <label>Right Row</label>
                                        <input type="number" id="player-dir-right-row" min="0" value="1">
                                    </div>
                                    <div>
                                        <label>Left Row</label>
                                        <input type="number" id="player-dir-left-row" min="0" value="2">
                                    </div>
                                    <div>
                                        <label>Up Row</label>
                                        <input type="number" id="player-dir-up-row" min="0" value="3">
                                    </div>
                                    <div>
                                        <label>Up-Right Row</label>
                                        <input type="number" id="player-dir-upright-row" min="0" value="3">
                                    </div>
                                    <div>
                                        <label>Down-Right Row</label>
                                        <input type="number" id="player-dir-downright-row" min="0" value="1">
                                    </div>
                                    <div>
                                        <label>Up-Left Row</label>
                                        <input type="number" id="player-dir-upleft-row" min="0" value="2">
                                    </div>
                                    <div>
                                        <label>Down-Left Row</label>
                                        <input type="number" id="player-dir-downleft-row" min="0" value="0">
                                    </div>
                                </div>
                                <div style="display:grid; grid-template-columns: 1fr; gap:8px; align-items:end; margin-top:8px;">
                                    <div>
                                        <label>Direction Frames (columns)</label>
                                        <input type="number" id="player-dir-columns" min="1" value="3">
                                    </div>
                                </div>
                                <div style="margin-top:12px; padding-top:8px; border-top:1px solid rgba(255,255,255,0.1);">
                                    <div style="font-weight:600; margin-bottom:6px;">Hitbox (collision box)</div>
                                    <div style="display:grid; grid-template-columns: 1fr 1fr; gap:8px; align-items:end;">
                                        <div>
                                            <label>Width Reduction (%)</label>
                                            <input type="number" id="player-hitbox-width" min="0" max="0.9" step="0.01" value="0.00">
                                        </div>
                                        <div>
                                            <label>Height Reduction (%)</label>
                                            <input type="number" id="player-hitbox-height" min="0" max="0.9" step="0.01" value="0.00">
                                        </div>
                                    </div>
                                    <div style="margin-top:6px; font-size:0.75em; color: var(--text-muted);">
                                        Smaller values mean a larger collision box (closer to sprite edges). Larger values trim the box inward symmetrically.
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="asset-group">
                    <!-- NPC builder: dynamic slots with sprite and dialogue -->
                    <div class="group-title">
                        <span>NPC</span>
                        <button class="add-item-btn" id="add-npc">+</button>
                    </div>
                    <div class="upload-instructions" style="margin-top:6px;">
                        <button id="npc-sprite-instructions-btn" class="btn btn-sm">Upload Instructions ▸</button>
                        <div id="npc-sprite-instructions-panel" class="instructions-panel" style="display:none; font-size:0.75em; color: var(--text-muted); margin-top:6px;">
                            NPCs use the same spritesheet system as the Player. Place files under <code>images/gamebuilder/sprites</code> and set <code>rows</code>/<code>cols</code> in index.json, then press Refresh Assets. See <a href="{{ site.baseurl }}/gamebuilder-upload-instructions">upload instructions</a>.
                            <div style="margin-top:4px;">Sprites json: <a href="{{ site.baseurl }}/images/gamebuilder/sprites/index.json">images/gamebuilder/sprites/index.json</a></div>
                            <div style="margin-top:6px;">
                                Interaction: Walk up to an NPC and press <strong>E</strong> to open their dialogue. Interactions trigger on collision or close proximity. Ensure the NPC has either a <code>greeting</code> or <code>dialogues</code> set for text to appear.
                            </div>
                        </div>
                    </div>
                    <div id="npcs-container"></div>
                </div>
                <div class="asset-group">
                    <!-- walls: toggle visibility, draw barriers, clear shapes -->
                    <div class="group-title">
                        <span>WALLS</span>
                    </div>
                    <div class="draw-toolbar">
                        <button id="toggle-walls-game" class="draw-btn">Show Walls (Game)</button>
                        <button id="draw-barrier" class="draw-btn">Draw Collision Wall</button>
                        <button id="draw-clear" class="draw-btn">Clear All Walls</button>
                    </div>
                    <div id="walls-container"></div>
                </div>
            </div>
        </div>
    </div>
    <div class="col-main view-split">
        <!-- view controls: switch between code, game, or split view -->
        <div class="view-controls">
            <button class="view-btn" data-view="code">Code</button>
            <button class="view-btn" data-view="game">Game</button>
            <button class="view-btn active" data-view="split">Split</button>
        </div>
        <div class="main-content">
            <!-- game panel: iframe runner + drawing overlay -->
            <div class="glass-panel panel-game">
                <div class="panel-header">Game View</div>
                <div class="game-frame">
                    <iframe id="game-iframe" src="{{ site.baseurl }}/rpg/latest?embed=1&autostart=0"></iframe>
                    <div id="draw-overlay" class="draw-overlay"></div>
                </div>
            </div>
            <!-- code panel: live JS editor with highlight -->
            <div class="glass-panel code-panel panel-code">
                <div class="panel-header">Code View (JS)</div>
                <div class="editor-container" id="editor-container">
                    <div id="highlight-layer" class="highlight-layer"></div>
                    <textarea id="code-editor" class="code-layer" spellcheck="false"></textarea>
                </div>
            </div>
        </div>
    </div>
</div>

<script>
/* builder bootstrapping and asset scanning */
document.addEventListener('DOMContentLoaded', () => {
    const SITE_BASE = "{{ site.baseurl }}" || "";
    const assets = {
        bg: {
            desert: { src: "/images/gamify/desert.png", h: 580, w: 1038 },
            alien: { src: "/images/gamebuilder/bg/alien_planet.jpg", h: 600, w: 1000 },
            skykingdom: { src: "/images/gamebuilder/bg/clouds.jpg", h: 720, w: 1280 }
        },
        sprites: {
            tux: { src: "/images/gamify/tux.png", h:256, w:352, rows:8, cols:11 },
            chillguy: { src: "/images/gamify/chillguy.png", h:512, w:384, rows:4, cols:3 },
            r2d2: { src: "/images/gamify/r2_idle.png", h:223, w:505, rows:1, cols:3 }
        }
    };
    const GB_BG_DIRS = ['/images/gamebuilder/bg'];
    const GB_SPR_DIRS = ['/images/gamebuilder/sprites'];
    const IMG_EXT_RE = /\.(png|jpg|jpeg|gif|webp|bmp)$/i;

    async function fetchJson(url) {
        try {
            const res = await fetch((SITE_BASE ? (SITE_BASE + url) : url), { cache: 'no-store' });
            if (!res.ok) return null;
            const ct = res.headers.get('content-type') || '';
            if (ct.includes('application/json')) return await res.json();
            return null;
        } catch (_) { return null; }
    }

    async function fetchText(url) {
        try {
            const res = await fetch((SITE_BASE ? (SITE_BASE + url) : url), { cache: 'no-store' });
            if (!res.ok) return null;
            const ct = res.headers.get('content-type') || '';
            if (ct.includes('text/html')) return await res.text();
            return null;
        } catch (_) { return null; }
    }

    // label normalization
    function sanitizeKey(name) {
        return String(name || '')
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '_')
            .replace(/^_+|_+$/g, '');
    }

    // select option management
    function clearSelectOptions(selectEl) {
        if (!selectEl) return;
        const opts = Array.from(selectEl.options || []);
        for (const opt of opts) {
            if (!opt.disabled) {
                opt.remove();
            }
        }
    }

    // asset discovery: scan directory listing for image files
    async function scanDirForImages(dirUrl) {
        const html = await fetchText(dirUrl);
        const results = [];
        if (!html) return results;
        const aRe = /href\s*=\s*"([^"]+)"/gi;
        let m;
        while ((m = aRe.exec(html)) !== null) {
            const href = m[1];
            const fullRel = href.startsWith('http') ? href : (dirUrl.replace(/\/$/, '') + '/' + href.replace(/^\//, ''));
            const full = SITE_BASE ? (SITE_BASE + fullRel) : fullRel;
            if (IMG_EXT_RE.test(full)) results.push(full);
        }
        return results;
    }

    // asset metadata: ensure image dimensions by loading it
    async function ensureImageDims(src) {
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => resolve({ h: img.naturalHeight, w: img.naturalWidth });
            img.onerror = () => resolve({ h: undefined, w: undefined });
            img.src = SITE_BASE ? (SITE_BASE + src) : src;
        });
    }

    function dedupSelectOptions(selectEl) {
        if (!selectEl) return;
        const seen = new Set();
        for (let i = 0; i < selectEl.options.length; i++) {
            const opt = selectEl.options[i];
            const label = (opt.textContent || '').trim().toLowerCase();
            if (opt.disabled) continue;
            if (seen.has(label)) {
                selectEl.removeChild(opt);
                i--;
            } else {
                seen.add(label);
            }
        }
    }

    /* server asset scan → populate background/sprite selectors */
    async function scanServerAssets() {
        clearSelectOptions(ui.bg);
        clearSelectOptions(ui.pSprite);
        document.querySelectorAll('.npc-sprite').forEach(sel => clearSelectOptions(sel));

        for (const dir of GB_BG_DIRS) {
            const manifestUrls = [dir + '/index.json', dir + '/manifest.json'];
            let data = null;
            for (const u of manifestUrls) { data = await fetchJson(u); if (data) break; }
            if (data && Array.isArray(data)) {
                for (const item of data) {
                    const name = item.name || item.key || item.src;
                    const key = sanitizeKey(name);
                    const srcRel = item.src?.startsWith('/') ? item.src : (dir.replace(/\/$/, '') + '/' + (item.src || ''));
                    const src = srcRel; 
                    const dims = (item.h && item.w) ? { h: item.h, w: item.w } : await ensureImageDims(src);
                    if (!assets.bg[key]) assets.bg[key] = { src, h: dims.h, w: dims.w };
                    const opt = document.createElement('option'); opt.value = key; opt.textContent = name; ui.bg.appendChild(opt);
                }
            } else {
                const imgs = await scanDirForImages(dir);
                for (const src of imgs) {
                    const base = src.split('/').pop();
                    const name = base.replace(/\.[^.]+$/, '');
                    const key = sanitizeKey(name);
                    if (assets.bg[key]) continue;
                    const relSrc = src.replace(SITE_BASE, '');
                    const dims = await ensureImageDims(relSrc);
                    assets.bg[key] = { src: relSrc, h: dims.h, w: dims.w };
                    const opt = document.createElement('option'); opt.value = key; opt.textContent = name; ui.bg.appendChild(opt);
                }
            }
        }

        dedupSelectOptions(ui.bg);

        for (const dir of GB_SPR_DIRS) {
            const manifestUrls = [dir + '/index.json', dir + '/manifest.json'];
            let data = null;
            for (const u of manifestUrls) { data = await fetchJson(u); if (data) break; }
            if (data && Array.isArray(data)) {
                for (const item of data) {
                    const name = item.name || item.key || item.src;
                    const key = sanitizeKey(name);
                    const srcRel = item.src?.startsWith('/') ? item.src : (dir.replace(/\/$/, '') + '/' + (item.src || ''));
                    const src = srcRel; 
                    const dims = (item.h && item.w) ? { h: item.h, w: item.w } : await ensureImageDims(src);
                    const rows = item.rows || 4; const cols = item.cols || 3;
                    if (!assets.sprites[key]) assets.sprites[key] = { src, h: dims.h, w: dims.w, rows, cols };
                    const opt = document.createElement('option'); opt.value = key; opt.textContent = name; ui.pSprite.appendChild(opt);
                    document.querySelectorAll('.npc-sprite').forEach(sel => {
                        const o = document.createElement('option'); o.value = key; o.textContent = name; sel.appendChild(o);
                    });
                }
            } else {
                const imgs = await scanDirForImages(dir);
                for (const src of imgs) {
                    const base = src.split('/').pop();
                    const name = base.replace(/\.[^.]+$/, '');
                    const key = sanitizeKey(name);
                    if (assets.sprites[key]) continue;
                    const relSrc = src.replace(SITE_BASE, '');
                    const dims = await ensureImageDims(relSrc);
                    const rows = 4, cols = 3; 
                    assets.sprites[key] = { src: relSrc, h: dims.h, w: dims.w, rows, cols };
                    const opt = document.createElement('option'); opt.value = key; opt.textContent = name; ui.pSprite.appendChild(opt);
                    document.querySelectorAll('.npc-sprite').forEach(sel => {
                        const o = document.createElement('option'); o.value = key; o.textContent = name; sel.appendChild(o);
                    });
                }
            }
        }

        dedupSelectOptions(ui.pSprite);
        document.querySelectorAll('.npc-sprite').forEach(sel => dedupSelectOptions(sel));
    }

    /*  UI element references and state containers */
    const ui = {
        bg: document.getElementById('bg-select'),
        bgInstructionsBtn: document.getElementById('bg-instructions-btn'),
        bgInstructionsPanel: document.getElementById('bg-instructions-panel'),
        pSprite: document.getElementById('player-select'),
        spriteInstructionsBtn: document.getElementById('sprite-instructions-btn'),
        spriteInstructionsPanel: document.getElementById('sprite-instructions-panel'),
        pScale: document.getElementById('player-scale'),
        pStep: document.getElementById('player-step'),
        pAnim: document.getElementById('player-anim'),
        pRows: document.getElementById('player-rows'),
        pCols: document.getElementById('player-cols'),
        pHitboxW: document.getElementById('player-hitbox-width'),
        pHitboxH: document.getElementById('player-hitbox-height'),
        pDownRow: document.getElementById('player-dir-down-row'),
        pRightRow: document.getElementById('player-dir-right-row'),
        pLeftRow: document.getElementById('player-dir-left-row'),
        pUpRow: document.getElementById('player-dir-up-row'),
        pUpRightRow: document.getElementById('player-dir-upright-row'),
        pDownRightRow: document.getElementById('player-dir-downright-row'),
        pUpLeftRow: document.getElementById('player-dir-upleft-row'),
        pDownLeftRow: document.getElementById('player-dir-downleft-row'),
        pDirCols: document.getElementById('player-dir-columns'),
        
        playerAdvancedBtn: document.getElementById('player-advanced-btn'),
        playerAdvancedPanel: document.getElementById('player-advanced-panel'),
        npcSpriteInstructionsBtn: document.getElementById('npc-sprite-instructions-btn'),
        npcSpriteInstructionsPanel: document.getElementById('npc-sprite-instructions-panel'),
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
        drawOverlay: document.getElementById('draw-overlay'),
        drawBarrierBtn: document.getElementById('draw-barrier'),
        drawClearBtn: document.getElementById('draw-clear'),
        drawState: { mode: null, isDrawing: false, startX: 0, startY: 0, activeBarrier: null },
        drawShapes: [],
        toggleWallsGameBtn: document.getElementById('toggle-walls-game'),
        gameWallsVisible: true,
        overlayConfirmed: false,

        editor: document.getElementById('code-editor'),
        hLayer: document.getElementById('highlight-layer'),
        iframe: document.getElementById('game-iframe'),
        
        colMain: document.querySelector('.col-main'),
        viewBtns: document.querySelectorAll('.view-btn')
    };

    // view switching: preview/game/code panels
    ui.viewBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const view = btn.dataset.view;
            ui.colMain.className = `col-main view-${view}`;
            ui.viewBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });

    let envTopOffset = 0;
    let envLeftOffset = 0;
    // live game container dimensions (from iframe)
    let envWidth = 0;
    let envHeight = 0;
    // track overlay size to rescale drawn shapes on container changes
    let overlayPrevW = 0;
    let overlayPrevH = 0;
    /* rceive live game container metrics (from iframe) */
    window.addEventListener('message', (e) => {
        try {
            if (e && e.data && e.data.type === 'rpg:env-metrics') {
                envTopOffset = Number(e.data.top) || 0;
                envLeftOffset = Number(e.data.left) || 0;
                envWidth = Number(e.data.width) || envWidth || 0;
                envHeight = Number(e.data.height) || envHeight || 0;
                try { renderDrawShapes(); } catch (_) {}
                try { syncOverlayBarriersToRunner(); } catch (_) {}
            }
        } catch (_) { /* ignore */ }
    });

    // simple toggler for disclosure panels
    function toggle(el) {
        if (!el) return;
        const isHidden = el.style.display === 'none';
        el.style.display = isHidden ? '' : 'none';
    }
    if (ui.bgInstructionsPanel) ui.bgInstructionsPanel.style.display = 'none';
    if (ui.spriteInstructionsPanel) ui.spriteInstructionsPanel.style.display = 'none';
    if (ui.npcSpriteInstructionsPanel) ui.npcSpriteInstructionsPanel.style.display = 'none';
    if (ui.playerAdvancedPanel) ui.playerAdvancedPanel.style.display = 'none';

    if (ui.bgInstructionsBtn) ui.bgInstructionsBtn.addEventListener('click', () => toggle(ui.bgInstructionsPanel));
    if (ui.spriteInstructionsBtn) ui.spriteInstructionsBtn.addEventListener('click', () => toggle(ui.spriteInstructionsPanel));
    if (ui.npcSpriteInstructionsBtn) ui.npcSpriteInstructionsBtn.addEventListener('click', () => toggle(ui.npcSpriteInstructionsPanel));
    if (ui.playerAdvancedBtn) ui.playerAdvancedBtn.addEventListener('click', () => toggle(ui.playerAdvancedPanel));

    /* overlay drawing (barriers) */
    function removePreview() {
        if (!ui.drawOverlay) return;
        const preview = ui.drawOverlay.querySelector('.draw-rect.preview');
        if (preview) preview.remove();
    }

    function setDrawMode(mode) {
        if (ui.drawState.mode === mode) {
            mode = null;
        }
        ui.drawState.mode = mode;
        if (ui.drawBarrierBtn) ui.drawBarrierBtn.classList.toggle('active', mode === 'barrier');
        if (ui.drawOverlay) {
            ui.drawOverlay.classList.toggle('active', !!mode);
            ui.drawOverlay.classList.toggle('mode-barrier', mode === 'barrier');
        }
        if (!mode) removePreview();
    }
    if (ui.drawBarrierBtn) ui.drawBarrierBtn.addEventListener('click', () => { state.lastEdited = 'walls'; setDrawMode('barrier'); });
    if (ui.drawClearBtn) ui.drawClearBtn.addEventListener('click', () => { state.lastEdited = 'walls'; ui.drawShapes = []; ui.overlayConfirmed = false; renderDrawShapes(); syncFromControlsIfFreestyle(); });

    // show/hide overlay per game walls visibility
    function updateOverlayVisibility() {
        if (!ui.drawOverlay) return;
        ui.drawOverlay.style.display = ui.gameWallsVisible ? '' : 'none';
    }

    // render overlay rectangles and sync to game
    function renderDrawShapes() {
        if (!ui.drawOverlay) return;
        const rect = ui.drawOverlay.getBoundingClientRect();
        // auto-rescale shapes when overlay size changes (before confirmation)
        if (!ui.overlayConfirmed && overlayPrevW && overlayPrevH && rect.width && rect.height && (rect.width !== overlayPrevW || rect.height !== overlayPrevH)) {
            const scaleX = rect.width / overlayPrevW;
            const scaleY = rect.height / overlayPrevH;
            ui.drawShapes = ui.drawShapes.map(s => ({
                ...s,
                x: Math.round((s.x || 0) * scaleX),
                y: Math.round((s.y || 0) * scaleY),
                width: Math.round((s.width || 0) * scaleX),
                height: Math.round((s.height || 0) * scaleY)
            }));
        }
        overlayPrevW = rect.width || overlayPrevW;
        overlayPrevH = rect.height || overlayPrevH;
        ui.drawOverlay.innerHTML = '';
        const frag = document.createDocumentFragment();
        ui.drawShapes.forEach(shape => {
            const el = document.createElement('div');
            el.className = `draw-rect ${shape.type}`;
            el.style.left = shape.x + 'px';
            el.style.top = shape.y + 'px';
            el.style.width = Math.max(0, shape.width) + 'px';
            el.style.height = Math.max(0, shape.height) + 'px';
            frag.appendChild(el);
        });
        ui.drawOverlay.appendChild(frag);
        syncOverlayBarriersToRunner();
    }

    function currentPreviewEl() {
        if (!ui.drawOverlay) return null;
        let el = ui.drawOverlay.querySelector('.draw-rect.preview');
        if (!el) {
            el = document.createElement('div');
            el.className = 'draw-rect preview';
            ui.drawOverlay.appendChild(el);
        }
        return el;
    }

    function updatePreview(clientX, clientY) {
        const mode = ui.drawState.mode;
        if (!mode) return;
        const bounds = ui.drawOverlay.getBoundingClientRect();
        let x = Math.min(Math.max(0, ui.drawState.startX), bounds.width);
        let y = Math.min(Math.max(0, ui.drawState.startY), bounds.height);
        let cx = Math.min(Math.max(0, clientX - bounds.left), bounds.width);
        let cy = Math.min(Math.max(0, clientY - bounds.top), bounds.height);
        const left = Math.min(x, cx);
        const top = Math.min(y, cy);
        const width = Math.abs(cx - x);
        const height = Math.abs(cy - y);
        const el = currentPreviewEl();
        el.className = `draw-rect ${mode} preview`;
        el.style.left = left + 'px';
        el.style.top = top + 'px';
        el.style.width = width + 'px';
        el.style.height = height + 'px';
    }

    function finalizeShape(clientX, clientY) {
        const mode = ui.drawState.mode;
        if (!mode) return;
        const bounds = ui.drawOverlay.getBoundingClientRect();
        let x = Math.min(Math.max(0, ui.drawState.startX), bounds.width);
        let y = Math.min(Math.max(0, ui.drawState.startY), bounds.height);
        let cx = Math.min(Math.max(0, clientX - bounds.left), bounds.width);
        let cy = Math.min(Math.max(0, clientY - bounds.top), bounds.height);
        const left = Math.min(x, cx);
        const top = Math.min(y, cy);
        const width = Math.abs(cx - x);
        const height = Math.abs(cy - y);
        removePreview();
        if (width >= 4 && height >= 4) {
            ui.drawShapes.push({ type: mode, x: Math.round(left), y: Math.round(top), width: Math.round(width), height: Math.round(height) });
            ui.overlayConfirmed = false;
            renderDrawShapes();
            syncFromControlsIfFreestyle();
        }
    }

    if (ui.drawOverlay) {
        ui.drawOverlay.addEventListener('mousedown', (e) => {
            if (!ui.drawState.mode) return;
            const bounds = ui.drawOverlay.getBoundingClientRect();
            const localX = e.clientX - bounds.left;
            const localY = e.clientY - bounds.top;
            ui.drawState.activeBarrier = null;
            ui.drawState.isDrawing = true;
            ui.drawState.startX = localX;
            ui.drawState.startY = localY;
        });
        window.addEventListener('mousemove', (e) => {
            if (!ui.drawState.isDrawing) return;
            updatePreview(e.clientX, e.clientY);
        });
        window.addEventListener('mouseup', (e) => {
            if (!ui.drawState.isDrawing) return;
            ui.drawState.isDrawing = false;
            finalizeShape(e.clientX, e.clientY);
            ui.drawState.activeBarrier = null;
        });
    }

    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            setDrawMode(null);
        }
    });

    /* NPC UI slots and interactions */
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
            <select class="npc-sprite"></select>
            <div style="display:grid; grid-template-columns: 1fr 1fr; gap:8px; align-items:end;">
                <div>
                    <label>Rows</label>
                    <input type="number" min="1" value="1" class="npc-rows">
                </div>
                <div>
                    <label>Columns</label>
                    <input type="number" min="1" value="1" class="npc-cols">
                </div>
            </div>
            <div style="display:grid; grid-template-columns: 1fr 1fr; gap:8px; align-items:end; margin-top:8px;">
                <div>
                    <label>Scale Factor</label>
                    <input type="number" min="1" max="20" value="8" class="npc-scale">
                </div>
                <div>
                    <label>Animation Rate (ms)</label>
                    <input type="number" min="10" max="500" value="50" class="npc-anim">
                </div>
            </div>
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
        if (!ui.npcsContainer) {
            ui.npcsContainer = document.createElement('div');
            ui.npcsContainer.id = 'npcs-container';
            document.body.appendChild(ui.npcsContainer);
        }
        ui.npcsContainer.appendChild(slot.container);

        slot.addBtn = headerBtn;
        slot.fieldsContainer = fields;
        slot.nId = fields.querySelector('.npc-id');
        slot.nMsg = fields.querySelector('.npc-msg');
        slot.nSprite = fields.querySelector('.npc-sprite');
        slot.nRows = fields.querySelector('.npc-rows');
        slot.nCols = fields.querySelector('.npc-cols');
        slot.nScale = fields.querySelector('.npc-scale');
        slot.nAnim = fields.querySelector('.npc-anim');
        if (slot.nSprite) {
            const none = document.createElement('option'); none.value = ''; none.disabled = true; none.selected = true; none.textContent = 'Select sprite…'; slot.nSprite.appendChild(none);
            if (assets && assets.sprites) {
                Object.keys(assets.sprites).forEach((key) => {
                    const opt = document.createElement('option');
                    opt.value = key; opt.textContent = key;
                    slot.nSprite.appendChild(opt);
                });
            }
        }
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

        // NPC deletion handler
        // removes the slot, updates UI, rescans assets, and re-syncs code.
        slot.deleteBtn.addEventListener('click', () => {
            slot.container.remove();
            ui.npcs = ui.npcs.filter(n => n !== slot);
            updateStepUI();
            scanServerAssets();
            syncFromControlsIfFreestyle();
        });

        ['input','change'].forEach(evt => {
            // Stage changes only; do not reload game until Confirm is pressed
            const rerun = () => { try { syncFromControlsIfFreestyle(); } catch (_) {} };
            slot.nId?.addEventListener(evt, () => { rerun(); });
            slot.nMsg?.addEventListener(evt, () => { rerun(); });
            slot.nSprite?.addEventListener(evt, (e) => {
                const key = slot.nSprite.value;
                const spr = assets && assets.sprites ? assets.sprites[key] : null;
                if (spr) {
                    if (slot.nRows) slot.nRows.value = spr.rows ?? 1;
                    if (slot.nCols) slot.nCols.value = spr.cols ?? 1;
                }
                rerun();
            });
            slot.nRows?.addEventListener(evt, () => { rerun(); });
            slot.nCols?.addEventListener(evt, () => { rerun(); });
            slot.nScale?.addEventListener(evt, () => { rerun(); });
            slot.nAnim?.addEventListener(evt, () => { rerun(); });
            slot.nX?.addEventListener(evt, () => { rerun(); });
            slot.nY?.addEventListener(evt, () => { rerun(); });
        });

        if (!ui.npcs) ui.npcs = [];
        ui.npcs.push(slot);
        updateStepUI();
        return slot;
    }

    if (ui.addNpcBtn) {
        ui.addNpcBtn.addEventListener('click', () => {
            if (typeof state !== 'undefined') state.userEdited = false;
            const slot = makeNpcSlot(ui.npcs.length + 1);
            if (slot.fieldsContainer) slot.fieldsContainer.style.display = '';
            slot.fieldsOpen = true;
            slot.addBtn.textContent = `NPC ${ui.npcs.length} ▾`;
            updateStepUI();
        });
    }

    /* wall UI slots and interactions */
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
            scanServerAssets();
            syncFromControlsIfFreestyle();
        });

        ['input','change'].forEach(evt => {
            slot.wX.addEventListener(evt, () => { state.lastEdited = 'walls'; syncFromControlsIfFreestyle(); });
            slot.wY.addEventListener(evt, () => { state.lastEdited = 'walls'; syncFromControlsIfFreestyle(); });
            slot.wW.addEventListener(evt, () => { state.lastEdited = 'walls'; syncFromControlsIfFreestyle(); });
            slot.wH.addEventListener(evt, () => { state.lastEdited = 'walls'; syncFromControlsIfFreestyle(); });
        });

        ui.walls.push(slot);
        return slot;
    }

    if (ui.addWallBtn) {
        ui.addWallBtn.addEventListener('click', () => {
            if (typeof state !== 'undefined') state.userEdited = false;
            state.lastEdited = 'walls';
            const slot = makeWallSlot(ui.walls.length + 1);
            if (slot.fieldsContainer) slot.fieldsContainer.style.display = '';
            slot.fieldsOpen = true;
            slot.addBtn.textContent = `Wall ${ui.walls.length} ▾`;
            updateStepUI();
            scanServerAssets();
            syncFromControlsIfFreestyle();
        });
    }

    /* editor overlay + state */
    const LINE_HEIGHT = 20;
    const state = { persistent: null, typing: null, userEdited: false, programmaticEdit: false, lastEdited: null };
    let stagedCode = null;
    let stagedStep = null;
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
        const freestyleIndex = steps.indexOf('freestyle');
        if (stepIndicatorMini) {
            if (stepIndex < freestyleIndex) {
                stepIndicatorMini.textContent = `Step ${stepIndex + 1}/${freestyleIndex}`;
            } else {
                stepIndicatorMini.textContent = 'Freestyle';
            }
        }
    }

    // field lock/unlock helpers for step gating
    function lockField(el) { if (el) { el.disabled = true; el.classList.add('locked'); } }
    function unlockField(el) { if (el) { el.disabled = false; el.classList.remove('locked'); } }

    function updateStepUI() {
        const current = steps[stepIndex];
        ui.editor.readOnly = false;
        const mv = document.getElementById('movement-keys');
        [ui.bg, ui.pSprite, ui.pX, ui.pY, ui.pName, mv].forEach(el => { if (el) el.disabled = true; });
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
            unlockField(ui.pScale);
            unlockField(ui.pStep);
            unlockField(ui.pAnim);
            unlockField(ui.pRows);
            unlockField(ui.pCols);
            [ui.pDownRow, ui.pRightRow, ui.pLeftRow, ui.pUpRow, ui.pUpRightRow, ui.pDownRightRow, ui.pUpLeftRow, ui.pDownLeftRow, ui.pDirCols, ui.pHitboxW, ui.pHitboxH]
                .forEach(el => unlockField(el));

        } else if (current === 'npc') {
            if (ui.addNpcBtn) ui.addNpcBtn.disabled = false;
            ui.npcs.forEach(slot => {
                if (slot.addBtn) slot.addBtn.disabled = false;
                if (slot.fieldsContainer && slot.fieldsContainer.style.display !== 'none') {
                    [slot.nId, slot.nMsg, slot.nSprite, slot.nRows, slot.nCols, slot.nScale, slot.nAnim, slot.nX, slot.nY].forEach(el => unlockField(el));
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
            [ui.pScale, ui.pStep, ui.pAnim, ui.pRows, ui.pCols].forEach(el => { if (el) el.disabled = false; });
            [ui.pDownRow, ui.pRightRow, ui.pLeftRow, ui.pUpRow, ui.pUpRightRow, ui.pDownRightRow, ui.pUpLeftRow, ui.pDownLeftRow, ui.pDirCols, ui.pHitboxW, ui.pHitboxH]
                .forEach(el => { if (el) el.disabled = false; });
            if (ui.addNpcBtn) ui.addNpcBtn.disabled = false;
            ui.npcs.forEach(slot => {
                if (slot.addBtn) slot.addBtn.disabled = false;
                [slot.nId, slot.nMsg, slot.nSprite, slot.nRows, slot.nCols, slot.nScale, slot.nAnim, slot.nX, slot.nY].forEach(el => { if (el) el.disabled = false; });
                if (slot.deleteBtn) { slot.deleteBtn.disabled = false; slot.deleteBtn.style.display = ''; }
            });
            if (ui.addWallBtn) ui.addWallBtn.disabled = false;
            ui.walls.forEach(slot => {
                if (slot.addBtn) slot.addBtn.disabled = false;
                [slot.wX, slot.wY, slot.wW, slot.wH].forEach(el => unlockField(el));
                if (slot.deleteBtn) { slot.deleteBtn.disabled = false; slot.deleteBtn.style.display = ''; }
            });

        }

        // Always allow NPC edits, even after confirmation
        ui.npcs.forEach(slot => {
            if (slot.addBtn) slot.addBtn.disabled = false;
            if (slot.fieldsContainer && slot.fieldsContainer.style.display !== 'none') {
                [slot.nId, slot.nMsg, slot.nSprite, slot.nRows, slot.nCols, slot.nScale, slot.nAnim, slot.nX, slot.nY]
                    .forEach(el => unlockField(el));
                if (slot.deleteBtn) { slot.deleteBtn.disabled = false; slot.deleteBtn.style.display = ''; }
            } else {
                if (slot.deleteBtn) { slot.deleteBtn.disabled = !slot.locked; slot.deleteBtn.style.display = slot.locked ? '' : 'none'; }
            }
        });
    }

        /* code generation (baseline and steps) */
        function generateBaselineCode() {
            return `import GameEnvBackground from '{{ site.baseurl }}/assets/js/GameEnginev1.5/GameEnvBackground.js';
    import Player from '{{ site.baseurl }}/assets/js/GameEnginev1.5/Player.js';
    import Npc from '{{ site.baseurl }}/assets/js/GameEnginev1.5/Npc.js';
    import Barrier from '{{ site.baseurl }}/assets/js/adventureGame/Barrier.js';

class GameLevelCustom {
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

export const gameLevelClasses = [GameLevelCustom];`;
        }

        function generateStepCode(currentStep) {
            const bg = assets.bg[ui.bg.value];
            const p = assets.sprites[ui.pSprite.value];
            const mvElGen = document.getElementById('movement-keys');
            const movement = (mvElGen && mvElGen.value) ? mvElGen.value : 'wasd';
                const keypress = movement === 'arrows'
                        ? '{ up: 38, left: 37, down: 40, right: 39 }'
                        : '{ up: 87, left: 65, down: 83, right: 68 }';

                function header() {
                    return `import GameEnvBackground from '{{ site.baseurl }}/assets/js/GameEnginev1.5/GameEnvBackground.js';
        import Player from '{{ site.baseurl }}/assets/js/GameEnginev1.5/Player.js';
        import Npc from '{{ site.baseurl }}/assets/js/GameEnginev1.5/Npc.js';
        import Barrier from '{{ site.baseurl }}/assets/js/adventureGame/Barrier.js';

class GameLevelCustom {
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
        /* BUILDER_ONLY_START */
        // Post object summary to builder (debugging visibility of NPCs/walls)
        try {
            setTimeout(() => {
                try {
                    const objs = Array.isArray(gameEnv?.gameObjects) ? gameEnv.gameObjects : [];
                    const summary = objs.map(o => ({ cls: o?.constructor?.name || 'Unknown', id: o?.canvas?.id || '', z: o?.canvas?.style?.zIndex || '' }));
                    if (window && window.parent) window.parent.postMessage({ type: 'rpg:objects', summary }, '*');
                } catch (_) {}
            }, 250);
        } catch (_) {}
        // Report environment metrics (like top offset) to builder
        try {
            if (window && window.parent) {
                try {
                    const rect = (gameEnv && gameEnv.container && gameEnv.container.getBoundingClientRect) ? gameEnv.container.getBoundingClientRect() : { top: gameEnv.top || 0, left: 0 };
                    window.parent.postMessage({ type: 'rpg:env-metrics', top: rect.top, left: rect.left }, '*');
                } catch (_) {
                    try { window.parent.postMessage({ type: 'rpg:env-metrics', top: gameEnv.top, left: 0 }, '*'); } catch (__){ }
                }
            }
        } catch (_) {}
        // Listen for in-game wall visibility toggles from builder
        try {
            window.addEventListener('message', (e) => {
                if (!e || !e.data) return;
                if (e.data.type === 'rpg:toggle-walls') {
                    const show = !!e.data.visible;
                    if (Array.isArray(gameEnv?.gameObjects)) {
                        for (const obj of gameEnv.gameObjects) {
                            if (obj instanceof Barrier) {
                                obj.visible = show;
                            }
                        }
                    }
                } else if (e.data.type === 'rpg:set-drawn-barriers') {
                    const arr = Array.isArray(e.data.barriers) ? e.data.barriers : [];
                    // Track overlay barriers locally so we can remove/replace
                    window.__overlayBarriers = window.__overlayBarriers || [];
                    // Remove previous overlay barriers
                    try {
                        for (const ob of window.__overlayBarriers) {
                            if (ob && typeof ob.destroy === 'function') ob.destroy();
                        }
                    } catch (_) {}
                    window.__overlayBarriers = [];
                    // Add new overlay barriers
                    for (const bd of arr) {
                        try {
                            const data = {
                                id: bd.id,
                                x: bd.x,
                                y: bd.y,
                                width: bd.width,
                                height: bd.height,
                                visible: !!bd.visible,
                                hitbox: { widthPercentage: 0.0, heightPercentage: 0.0 },
                                fromOverlay: true
                            };
                            const bobj = new Barrier(data, gameEnv);
                            gameEnv.gameObjects.push(bobj);
                            window.__overlayBarriers.push(bobj);
                        } catch (_) {}
                    }
                }
            });
        } catch (_) {}
        /* BUILDER_ONLY_END */
    }
}

export const gameLevelClasses = [GameLevelCustom];`;
                }

                if (currentStep === 'background') {
                        if (!ui.bg.value) return null;
                        const bgIsData = bg && bg.src && bg.src.startsWith('data:');
                        const bgSrcVal = bgIsData ? `'${bg.src.replace(/'/g, "\\'")}'` : `path + "${bg.src}"`;
                        let defs = `
        const bgData = {
            name: 'custom_bg',
            src: ${bgSrcVal},
            pixels: { height: ${bg.h}, width: ${bg.w} }
        };`;
                        const classes = [
            "      { class: GameEnvBackground, data: bgData }"
                        ];
                        const barrierDefsB = [];
                        const includedWallsB = ui.walls.slice();
                        includedWallsB.forEach((w, idx) => {
                            const x = parseInt(w.wX?.value || 100, 10);
                            const y = parseInt(w.wY?.value || 100, 10);
                            const wWidth = parseInt(w.wW?.value || 150, 10);
                            const wHeight = parseInt(w.wH?.value || 20, 10);
                            const visible = true; 
                            const id = `wall_${idx+1}`;
                            barrierDefsB.push(`
        const barrierData${idx+1} = {
            id: '${id}', x: ${x}, y: ${y}, width: ${wWidth}, height: ${wHeight}, visible: ${visible},
            hitbox: { widthPercentage: 0.0, heightPercentage: 0.0 }
        };`);
                            classes.push(`      { class: Barrier, data: barrierData${idx+1} }`);
                        });
                        const drawnBarriersB = ui.drawShapes.filter(s => s.type === 'barrier');
                        const rectB = ui.drawOverlay?.getBoundingClientRect?.() || { width: 0, height: 0 };
                        const scaleXB = (envWidth && rectB.width) ? (envWidth / rectB.width) : 1;
                        const scaleYB = (envHeight && rectB.height) ? (envHeight / rectB.height) : 1;
                        drawnBarriersB.forEach((b, bIdx) => {
                            const id = `dbarrier_${bIdx+1}`;
                            const bx = Math.max(0, Math.round((b.x || 0) * scaleXB));
                            const by = Math.max(0, Math.round((b.y || 0) * scaleYB));
                            const bw = Math.max(0, Math.round((b.width || 0) * scaleXB));
                            const bh = Math.max(0, Math.round((b.height || 0) * scaleYB));
                            barrierDefsB.push(`
        const ${id} = {
            id: '${id}', x: ${bx}, y: ${by}, width: ${bw}, height: ${bh}, visible: true /* BUILDER_DEFAULT */,
            hitbox: { widthPercentage: 0.0, heightPercentage: 0.0 },
            fromOverlay: true
        };`);
                            classes.push(`      { class: Barrier, data: ${id} }`);
                        });
                        if (barrierDefsB.length) defs += ('\n' + barrierDefsB.join('\n'));
                        return header() + defs + footer(classes);
                }

                if (currentStep === 'player') {
                        if (!ui.bg.value || !ui.pSprite.value) return null;
                        const name = (ui.pName && ui.pName.value ? ui.pName.value.trim() : 'Hero').replace(/'/g, "\\'");
                        const bgIsData = bg && bg.src && bg.src.startsWith('data:');
                        const bgSrcVal = bgIsData ? `'${bg.src.replace(/'/g, "\\'")}'` : `path + "${bg.src}"`;
                        const pIsData = p && p.src && p.src.startsWith('data:');
                        const pSrcVal = pIsData ? `'${p.src.replace(/'/g, "\\'")}'` : `path + "${p.src}"`;
                        const pScaleVal = parseInt(ui.pScale?.value || '5', 10);
                        const pStepVal = parseInt(ui.pStep?.value || '1000', 10);
                        const pAnimVal = parseInt(ui.pAnim?.value || '50', 10);
                        const pRowsVal = Math.max(1, parseInt((ui.pRows?.value ?? '').trim() || '3', 10));
                        const pColsVal = Math.max(1, parseInt((ui.pCols?.value ?? '').trim() || '4', 10));
                        const dirRowsTotal = pRowsVal;
                        const clamp = (v) => {
                            const maxIndex = Math.max(0, (dirRowsTotal|0) - 1);
                            return Math.max(0, Math.min(maxIndex, v|0));
                        };
                        const dirCols = Math.max(1, parseInt(ui.pDirCols?.value || 3, 10));
                        const dRow = clamp(parseInt(ui.pDownRow?.value ?? 0));
                        const dDefault = 0;
                        const rDefault = 1;
                        const lDefault = 2;
                        const uDefault = 3;
                        const rRow = clamp(parseInt(ui.pRightRow?.value ?? rDefault));
                        const lRow = clamp(parseInt(ui.pLeftRow?.value ?? lDefault));
                        const uRow = clamp(parseInt(ui.pUpRow?.value ?? uDefault));
                        const urRow = clamp(parseInt(ui.pUpRightRow?.value ?? uRow));
                        const drRow = clamp(parseInt(ui.pDownRightRow?.value ?? rRow));
                        const ulRow = clamp(parseInt(ui.pUpLeftRow?.value ?? lRow));
                        const dlRow = clamp(parseInt(ui.pDownLeftRow?.value ?? dRow));
                        const hbW = Math.max(0, Math.min(parseFloat(ui.pHitboxW?.value || '0'), 0.9));
                        const hbH = Math.max(0, Math.min(parseFloat(ui.pHitboxH?.value || '0'), 0.9));

                        const defs = `
        const bgData = {
            name: 'custom_bg',
            src: ${bgSrcVal},
            pixels: { height: ${bg.h}, width: ${bg.w} }
        };
        const playerData = {
            id: '${name}',
            src: ${pSrcVal},
            SCALE_FACTOR: ${pScaleVal},
            STEP_FACTOR: ${pStepVal},
            ANIMATION_RATE: ${pAnimVal},
            INIT_POSITION: { x: ${ui.pX.value}, y: ${ui.pY.value} },
            pixels: { height: ${p.h}, width: ${p.w} },
            orientation: { rows: ${pRowsVal}, columns: ${pColsVal} },
            down: { row: ${dRow}, start: 0, columns: ${dirCols} },
            downRight: { row: ${drRow}, start: 0, columns: ${dirCols}, rotate: Math.PI/16 },
            downLeft: { row: ${dlRow}, start: 0, columns: ${dirCols}, rotate: -Math.PI/16 },
            left: { row: ${lRow}, start: 0, columns: ${dirCols} },
            right: { row: ${rRow}, start: 0, columns: ${dirCols} },
            up: { row: ${uRow}, start: 0, columns: ${dirCols} },
            upLeft: { row: ${ulRow}, start: 0, columns: ${dirCols}, rotate: Math.PI/16 },
            upRight: { row: ${urRow}, start: 0, columns: ${dirCols}, rotate: -Math.PI/16 },
            hitbox: { widthPercentage: ${hbW}, heightPercentage: ${hbH} },
            keypress: ${keypress}
        };`;
                        const classes = [
            "      { class: GameEnvBackground, data: bgData }",
            "      { class: Player, data: playerData }"
                        ];

                        const barrierDefs = [];
                        const includedWallsP = ui.walls.slice();
                        includedWallsP.forEach((w, idx) => {
                            const x = parseInt(w.wX?.value || 100, 10);
                            const y = parseInt(w.wY?.value || 100, 10);
                            const wWidth = parseInt(w.wW?.value || 150, 10);
                            const wHeight = parseInt(w.wH?.value || 20, 10);
                            const visible = true; 
                            const id = `wall_${idx+1}`;
                            barrierDefs.push(`
        const barrierData${idx+1} = {
            id: '${id}', x: ${x}, y: ${y}, width: ${wWidth}, height: ${wHeight}, visible: ${visible},
            hitbox: { widthPercentage: 0.0, heightPercentage: 0.0 }
        };`);
                            classes.push(`      { class: Barrier, data: barrierData${idx+1} }`);
                        });

                        const drawnBarriersP = ui.drawShapes.filter(s => s.type === 'barrier');
                        const rectP = ui.drawOverlay?.getBoundingClientRect?.() || { width: 0, height: 0 };
                        const scaleXP = (envWidth && rectP.width) ? (envWidth / rectP.width) : 1;
                        const scaleYP = (envHeight && rectP.height) ? (envHeight / rectP.height) : 1;
                        drawnBarriersP.forEach((b, bIdx) => {
                            const id = `dbarrier_${bIdx+1}`;
                            const bx = Math.max(0, Math.round((b.x || 0) * scaleXP));
                            const by = Math.max(0, Math.round((b.y || 0) * scaleYP));
                            const bw = Math.max(0, Math.round((b.width || 0) * scaleXP));
                            const bh = Math.max(0, Math.round((b.height || 0) * scaleYP));
                            barrierDefs.push(`
        const ${id} = {
            id: '${id}', x: ${bx}, y: ${by}, width: ${bw}, height: ${bh}, visible: true /* BUILDER_DEFAULT */,
            hitbox: { widthPercentage: 0.0, heightPercentage: 0.0 },
            fromOverlay: true
        };`);
                            classes.push(`      { class: Barrier, data: ${id} }`);
                        });

                        const fullDefs = defs + (barrierDefs.length ? ('\n' + barrierDefs.join('\n')) : '');
                        return header() + fullDefs + footer(classes);
                }

                if (currentStep === 'npc') {
                    const includedSlots = ui.npcs.slice();
                    if (includedSlots.length === 0) return null;

                        const name = (ui.pName && ui.pName.value ? ui.pName.value.trim() : 'Hero').replace(/'/g, "\\'");
                        const bgIsData = bg && bg.src && bg.src.startsWith('data:');
                        const bgSrcVal = bgIsData ? `'${bg.src.replace(/'/g, "\\'")}'` : `path + "${bg.src}"`;
                        const pIsData = p && p.src && p.src.startsWith('data:');
                        const pSrcVal = pIsData ? `'${p.src.replace(/'/g, "\\'")}'` : `path + "${p.src}"`;
                        const pScaleValN = parseInt(ui.pScale?.value || '5', 10);
                        const pStepValN = parseInt(ui.pStep?.value || '1000', 10);
                        const pAnimValN = parseInt(ui.pAnim?.value || '50', 10);
                        const pRowsValN = Math.max(1, parseInt(ui.pRows?.value || p.rows || 1, 10));
                        const pColsValN = Math.max(1, parseInt(ui.pCols?.value || p.cols || 1, 10));
                        const hbWN = Math.max(0, Math.min(parseFloat(ui.pHitboxW?.value || '0'), 0.9));
                        const hbHN = Math.max(0, Math.min(parseFloat(ui.pHitboxH?.value || '0'), 0.9));
                        
                        const defsStart = `
        const bgData = {
            name: 'custom_bg',
            src: ${bgSrcVal},
            pixels: { height: ${bg.h}, width: ${bg.w} }
        };
        const playerData = {
            id: '${name}',
            src: ${pSrcVal},
            SCALE_FACTOR: ${pScaleValN},
            STEP_FACTOR: ${pStepValN},
            ANIMATION_RATE: ${pAnimValN},
            INIT_POSITION: { x: ${ui.pX.value}, y: ${ui.pY.value} },
            pixels: { height: ${p.h}, width: ${p.w} },
            orientation: { rows: ${pRowsValN}, columns: ${pColsValN} },
            down: { row: 0, start: 0, columns: 3 },
            downRight: { row: 1, start: 0, columns: 3, rotate: Math.PI/16 },
            downLeft: { row: 2, start: 0, columns: 3, rotate: -Math.PI/16 },
            left: { row: 2, start: 0, columns: 3 },
            right: { row: 1, start: 0, columns: 3 },
            up: { row: 3, start: 0, columns: 3 },
            upLeft: { row: 2, start: 0, columns: 3, rotate: Math.PI/16 },
            upRight: { row: 1, start: 0, columns: 3, rotate: -Math.PI/16 },
            hitbox: { widthPercentage: ${hbWN}, heightPercentage: ${hbHN} },
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
                            const nMsgSafe = nMsg && nMsg.length ? nMsg : 'Hello!';
                            const nSpriteKey = (slot.nSprite && slot.nSprite.value) ? slot.nSprite.value : 'chillguy';
                            const nSprite = assets.sprites[nSpriteKey] || assets.sprites['chillguy'];
                            const nX = (slot.nX && slot.nX.value) ? parseInt(slot.nX.value, 10) : 500;
                            const nY = (slot.nY && slot.nY.value) ? parseInt(slot.nY.value, 10) : 300;
                            const nIsData = nSprite && nSprite.src && nSprite.src.startsWith('data:');
                            const nSrcVal = nIsData ? `'${(nSprite.src||'').replace(/'/g, "\\'")}'` : `path + "${nSprite.src}"`;
                            const nRows = Math.max(1, parseInt(slot.nRows?.value || nSprite.rows || 1, 10));
                            const nCols = Math.max(1, parseInt(slot.nCols?.value || nSprite.cols || 1, 10));
                            const nScale = Math.max(1, parseInt(slot.nScale?.value || 8, 10));
                            const nAnim = Math.max(1, parseInt(slot.nAnim?.value || 50, 10));
                            npcDefs.push(`
        const npcData${index} = {
            id: '${nId}',
            greeting: '${nMsgSafe}',
            src: ${nSrcVal},
            SCALE_FACTOR: ${nScale},
            ANIMATION_RATE: ${nAnim},
            INIT_POSITION: { x: ${nX}, y: ${nY} },
            pixels: { height: ${nSprite.h}, width: ${nSprite.w} },
            orientation: { rows: ${nRows}, columns: ${nCols} },
            down: { row: 0, start: 0, columns: 3 },
            right: { row: Math.min(1, ${nRows} - 1), start: 0, columns: 3 },
            left: { row: Math.min(2, ${nRows} - 1), start: 0, columns: 3 },
            up: { row: Math.min(3, ${nRows} - 1), start: 0, columns: 3 },
            upRight: { row: Math.min(3, ${nRows} - 1), start: 0, columns: 3 },
            downRight: { row: Math.min(1, ${nRows} - 1), start: 0, columns: 3 },
            upLeft: { row: Math.min(2, ${nRows} - 1), start: 0, columns: 3 },
            downLeft: { row: 0, start: 0, columns: 3 },
            hitbox: { widthPercentage: 0.1, heightPercentage: 0.2 },
            dialogues: ['${nMsgSafe}'],
            reaction: function() { if (this.dialogueSystem) { this.showReactionDialogue(); } else { console.log(this.greeting); } },
            interact: function() {
                if (this.dialogueSystem) {
                    this.showRandomDialogue();
                } else if (this.greeting) {
                    alert(this.greeting);
                } else {
                    alert('Hello!');
                }
            }
        };`);
                            classes.push(`      { class: Npc, data: npcData${index} }`);
                        });
                        const barrierDefsN = [];
                        const includedWallsN = ui.walls.slice();
                        includedWallsN.forEach((w, idx) => {
                            const x = parseInt(w.wX?.value || 100, 10);
                            const y = parseInt(w.wY?.value || 100, 10);
                            const wWidth = parseInt(w.wW?.value || 150, 10);
                            const wHeight = parseInt(w.wH?.value || 20, 10);
                            const visible = true; 
                            const id = `wall_${idx+1}`;
                            barrierDefsN.push(`
        const barrierData${idx+1} = {
            id: '${id}', x: ${x}, y: ${y}, width: ${wWidth}, height: ${wHeight}, visible: ${visible},
            hitbox: { widthPercentage: 0.0, heightPercentage: 0.0 }
        };`);
                            classes.push(`      { class: Barrier, data: barrierData${idx+1} }`);
                        });
                        const drawnBarriersN = ui.drawShapes.filter(s => s.type === 'barrier');
                        const rectN = ui.drawOverlay?.getBoundingClientRect?.() || { width: 0, height: 0 };
                        const scaleXN = (envWidth && rectN.width) ? (envWidth / rectN.width) : 1;
                        const scaleYN = (envHeight && rectN.height) ? (envHeight / rectN.height) : 1;
                        drawnBarriersN.forEach((b, bIdx) => {
                            const id = `dbarrier_${bIdx+1}`;
                            const bx = Math.max(0, Math.round((b.x || 0) * scaleXN));
                            const by = Math.max(0, Math.round((b.y || 0) * scaleYN));
                            const bw = Math.max(0, Math.round((b.width || 0) * scaleXN));
                            const bh = Math.max(0, Math.round((b.height || 0) * scaleYN));
                            barrierDefsN.push(`
        const ${id} = {
            id: '${id}', x: ${bx}, y: ${by}, width: ${bw}, height: ${bh}, visible: true /* BUILDER_DEFAULT */,
            hitbox: { widthPercentage: 0.0, heightPercentage: 0.0 },
            fromOverlay: true
        };`);
                            classes.push(`      { class: Barrier, data: ${id} }`);
                        });

                        const defs = defsStart + npcDefs.join('\n') + (barrierDefsN.length ? ('\n' + barrierDefsN.join('\n')) : '');
                        return header() + defs + footer(classes);
                }

                if (currentStep === 'walls') {
                    if (!ui.bg.value || !ui.pSprite.value) return null;
                    const name = (ui.pName && ui.pName.value ? ui.pName.value.trim() : 'Hero').replace(/'/g, "\\'");
                    const bgIsData = bg && bg.src && bg.src.startsWith('data:');
                    const bgSrcVal = bgIsData ? `'${bg.src.replace(/'/g, "\\'")}'` : `path + "${bg.src}"`;
                    const pIsData = p && p.src && p.src.startsWith('data:');
                    const pSrcVal = pIsData ? `'${p.src.replace(/'/g, "\\'")}'` : `path + "${p.src}"`;
                    const pScaleValW = parseInt(ui.pScale?.value || '5', 10);
                    const pStepValW = parseInt(ui.pStep?.value || '1000', 10);
                    const pAnimValW = parseInt(ui.pAnim?.value || '50', 10);
                    const pRowsValW = Math.max(1, parseInt((ui.pRows?.value ?? '').trim() || '3', 10));
                    const pColsValW = Math.max(1, parseInt((ui.pCols?.value ?? '').trim() || '4', 10));
                    
                    const defsStart = `
        const bgData = {
            name: 'custom_bg',
            src: ${bgSrcVal},
            pixels: { height: ${bg.h}, width: ${bg.w} }
        };
        const playerData = {
            id: '${name}',
            src: ${pSrcVal},
            SCALE_FACTOR: ${pScaleValW},
            STEP_FACTOR: ${pStepValW},
            ANIMATION_RATE: ${pAnimValW},
            INIT_POSITION: { x: ${ui.pX.value}, y: ${ui.pY.value} },
            pixels: { height: ${p.h}, width: ${p.w} },
            orientation: { rows: ${pRowsValW}, columns: ${pColsValW} },
            down: { row: 0, start: 0, columns: 3 },
            downRight: { row: 1, start: 0, columns: 3, rotate: Math.PI/16 },
            downLeft: { row: 2, start: 0, columns: 3, rotate: -Math.PI/16 },
            left: { row: 2, start: 0, columns: 3 },
            right: { row: 1, start: 0, columns: 3 },
            up: { row: 3, start: 0, columns: 3 },
            upLeft: { row: 2, start: 0, columns: 3, rotate: Math.PI/16 },
            upRight: { row: 1, start: 0, columns: 3, rotate: -Math.PI/16 },
            hitbox: { widthPercentage: ${Math.max(0, Math.min(parseFloat(ui.pHitboxW?.value || '0'), 0.9))}, heightPercentage: ${Math.max(0, Math.min(parseFloat(ui.pHitboxH?.value || '0'), 0.9))} },
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
                        const nMsgSafe = nMsg && nMsg.length ? nMsg : 'Hello!';
                        const nSpriteKey = (slot.nSprite && slot.nSprite.value) ? slot.nSprite.value : 'chillguy';
                        const nSprite = assets.sprites[nSpriteKey] || assets.sprites['chillguy'];
                        const nX = (slot.nX && slot.nX.value) ? parseInt(slot.nX.value, 10) : 500;
                        const nY = (slot.nY && slot.nY.value) ? parseInt(slot.nY.value, 10) : 300;
                        const nIsData = nSprite && nSprite.src && nSprite.src.startsWith('data:');
                        const nSrcVal = nIsData ? `'${(nSprite.src||'').replace(/'/g, "\\'")}'` : `path + "${nSprite.src}"`;
                        const nScale = Math.max(1, parseInt(slot.nScale?.value || 8, 10));
                        const nAnim = Math.max(1, parseInt(slot.nAnim?.value || 50, 10));
                        npcDefs.push(`
        const npcData${index} = {
            id: '${nId}',
            greeting: '${nMsgSafe}',
            src: ${nSrcVal},
            SCALE_FACTOR: ${nScale},
            ANIMATION_RATE: ${nAnim},
            INIT_POSITION: { x: ${nX}, y: ${nY} },
            pixels: { height: ${nSprite.h}, width: ${nSprite.w} },
            orientation: { rows: ${Math.max(1, parseInt(slot.nRows?.value || nSprite.rows || 1, 10))}, columns: ${Math.max(1, parseInt(slot.nCols?.value || nSprite.cols || 1, 10))} },
            down: { row: 0, start: 0, columns: 3 },
            right: { row: Math.min(1, ${Math.max(1, parseInt(slot.nRows?.value || nSprite.rows || 1, 10))} - 1), start: 0, columns: 3 },
            left: { row: Math.min(2, ${Math.max(1, parseInt(slot.nRows?.value || nSprite.rows || 1, 10))} - 1), start: 0, columns: 3 },
            up: { row: Math.min(3, ${Math.max(1, parseInt(slot.nRows?.value || nSprite.rows || 1, 10))} - 1), start: 0, columns: 3 },
            upRight: { row: Math.min(3, ${Math.max(1, parseInt(slot.nRows?.value || nSprite.rows || 1, 10))} - 1), start: 0, columns: 3 },
            downRight: { row: Math.min(1, ${Math.max(1, parseInt(slot.nRows?.value || nSprite.rows || 1, 10))} - 1), start: 0, columns: 3 },
            upLeft: { row: Math.min(2, ${Math.max(1, parseInt(slot.nRows?.value || nSprite.rows || 1, 10))} - 1), start: 0, columns: 3 },
            downLeft: { row: 0, start: 0, columns: 3 },
            hitbox: { widthPercentage: 0.1, heightPercentage: 0.2 },
            dialogues: ['${nMsgSafe}'],
            reaction: function() { if (this.dialogueSystem) { this.showReactionDialogue(); } else { console.log(this.greeting); } },
            interact: function() { if (this.dialogueSystem) { this.showRandomDialogue(); } }
        };`);
                        classes.push(`      { class: Npc, data: npcData${index} }`);
                    });

                    const barrierDefs = [];

                    const includedWalls = ui.walls.slice();
                    includedWalls.forEach((w, idx) => {
                        const x = parseInt(w.wX?.value || 100, 10);
                        const y = parseInt(w.wY?.value || 100, 10);
                        const wWidth = parseInt(w.wW?.value || 150, 10);
                        const wHeight = parseInt(w.wH?.value || 20, 10);
                        const visible = true;
                        const id = `wall_${idx+1}`;
                        barrierDefs.push(`
        const barrierData${idx+1} = {
            id: '${id}', x: ${x}, y: ${y}, width: ${wWidth}, height: ${wHeight}, visible: ${visible},
            hitbox: { widthPercentage: 0.0, heightPercentage: 0.0 }
        };`);
                        classes.push(`      { class: Barrier, data: barrierData${idx+1} }`);
                    });
                    
                    const drawnBarriers = ui.drawShapes.filter(s => s.type === 'barrier');
                    const rectW = ui.drawOverlay?.getBoundingClientRect?.() || { width: 0, height: 0 };
                    const scaleXW = (envWidth && rectW.width) ? (envWidth / rectW.width) : 1;
                    const scaleYW = (envHeight && rectW.height) ? (envHeight / rectW.height) : 1;
                    drawnBarriers.forEach((b, bIdx) => {
                        const id = `dbarrier_${bIdx+1}`;
                        const bx = Math.max(0, Math.round((b.x || 0) * scaleXW));
                        const by = Math.max(0, Math.round((b.y || 0) * scaleYW));
                        const bw = Math.max(0, Math.round((b.width || 0) * scaleXW));
                        const bh = Math.max(0, Math.round((b.height || 0) * scaleYW));
                        barrierDefs.push(`
        const ${id} = {
            id: '${id}', x: ${bx}, y: ${by}, width: ${bw}, height: ${bh}, visible: true /* BUILDER_DEFAULT */,
            hitbox: { widthPercentage: 0.0, heightPercentage: 0.0 },
            fromOverlay: true
        };`);
                        classes.push(`      { class: Barrier, data: ${id} }`);
                    });

                    const defs = defsStart + (npcDefs.length ? ('\n' + npcDefs.join('\n')) : '') + (barrierDefs.length ? ('\n' + barrierDefs.join('\n')) : '');
                    return header() + defs + footer(classes);
                }

                return ui.editor.value;
        }

    /* SECTION: Diff computation for typed highlights */
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

    // Render highlight overlay for typing and persistent blocks
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
    ui.editor.addEventListener('input', () => {
        if (!state.programmaticEdit) {
            state.userEdited = true;
            const btn = document.getElementById('btn-confirm');
            if (btn) btn.classList.add('staged');
        }
    });

    function syncFromControlsIfFreestyle() {
        const current = steps[stepIndex];
        // Allow control-driven updates in freestyle even after manual edits
        if (state.userEdited && current === 'freestyle' && !state.lastEdited) return;
        const hasNPCs = ui.npcs.length > 0;
        const hasWalls = (ui.walls.length > 0) || (ui.drawShapes && ui.drawShapes.some(s => s.type === 'barrier'));
        const hasPlayer = !!ui.pSprite.value;
        const hasBackground = !!ui.bg.value;
        let stepToCompose;
        if (current === 'freestyle' && state.lastEdited) {
            stepToCompose = state.lastEdited;
        } else {
            stepToCompose = hasWalls ? 'walls' : (hasNPCs ? 'npc' : (hasPlayer ? 'player' : (hasBackground ? 'background' : null)));
        }
        // Stage changes only; do not update editor or reload game until Confirm
        const oldCode = ui.editor.value;
        let composed = null;
        let composedStep = stepToCompose;
        if (stepToCompose === 'npc') {
            const ins = buildNpcInsertText();
            composed = mergeDefsAndClasses(oldCode, ins.defs, ins.classes);
        } else if (stepToCompose === 'walls') {
            const ins = buildBarrierInsertText();
            composed = mergeDefsAndClasses(oldCode, ins.defs, ins.classes);
        } else {
            composed = stepToCompose ? generateStepCode(stepToCompose) : generateBaselineCode();
        }
        if (composed) {
            stagedCode = composed;
            stagedStep = composedStep;
            const btn = document.getElementById('btn-confirm');
            if (btn) btn.classList.add('staged');
            // Do not call simulateTypingChange here; wait for Confirm
        }
    }

    /* SECTION: Typing animation (simulate code being typed, then persist highlight) */
    function simulateTypingChange(oldCode, newCode, onDone) {
        const { startLine, lineCount } = computeChangeRange(oldCode, newCode);
        // If no visible change, just swap and persist
        if (!lineCount || lineCount < 1) {
            state.programmaticEdit = true;
            ui.editor.value = newCode;
            state.typing = null;
            state.persistent = null;
            renderOverlay();
            state.programmaticEdit = false;
            if (typeof onDone === 'function') onDone();
            return;
        }

        const newLines = newCode.split('\n');
        const before = newLines.slice(0, startLine).join('\n');
        const changed = newLines.slice(startLine, startLine + lineCount).join('\n');
        const after = newLines.slice(startLine + lineCount).join('\n');

        const join3 = (a, b, c) => {
            const s1 = a ? a + (b ? '\n' : (c ? '\n' : '')) : '';
            const s2 = b ? b + (c ? '\n' : '') : '';
            const s3 = c || '';
            return s1 + s2 + s3;
        };

        const TICK_MS = 16;
        const CHARS_PER_TICK = 50;
        let idx = 0;

        state.programmaticEdit = true;
        state.typing = { startLine, lineCount: Math.max(1, lineCount) };
        renderOverlay();

        const typeStep = () => {
            const nextIdx = Math.min(changed.length, idx + CHARS_PER_TICK);
            const typedSegment = changed.slice(0, nextIdx);
            ui.editor.value = join3(before, typedSegment, after);
            renderOverlay();
            idx = nextIdx;
            if (idx < changed.length) {
                window.setTimeout(typeStep, TICK_MS);
            } else {
                // Finished typing; set final value to ensure exact match
                ui.editor.value = newCode;
                state.typing = null;
                state.persistent = { startLine, lineCount: Math.max(1, lineCount) };
                renderOverlay();
                state.programmaticEdit = false;
                if (typeof onDone === 'function') onDone();
            }
        };

        // Initialize the editor with the unchanged prefix and empty typed region
        ui.editor.value = join3(before, '', after);
        window.setTimeout(typeStep, TICK_MS);
    }

    /* SECTION: NPC and Barrier code inserts for confirm merges */
    function buildNpcInsertText() {
        const includedSlots = ui.npcs.slice();
        if (!includedSlots.length) return { defs: '', classes: [] };
        const classes = [];
        const defs = includedSlots.map((slot) => {
            const index = slot.index;
            const nId = (slot.nId && slot.nId.value ? slot.nId.value.trim() : 'NPC').replace(/'/g, "\\'");
            const nMsg = (slot.nMsg && slot.nMsg.value ? slot.nMsg.value.trim() : '').replace(/'/g, "\\'") || 'Hello!';
            const nSpriteKey = (slot.nSprite && slot.nSprite.value) ? slot.nSprite.value : 'chillguy';
            const nSprite = assets.sprites[nSpriteKey] || assets.sprites['chillguy'];
            const nX = (slot.nX && slot.nX.value) ? parseInt(slot.nX.value, 10) : 500;
            const nY = (slot.nY && slot.nY.value) ? parseInt(slot.nY.value, 10) : 300;
            const nScale = Math.max(1, parseInt(slot.nScale?.value || 8, 10));
            const nAnim = Math.max(1, parseInt(slot.nAnim?.value || 50, 10));
            return `\n        const npcData${index} = {\n            id: '${nId}',\n            greeting: '${nMsg}',\n            src: path + "${nSprite.src}",\n            SCALE_FACTOR: ${nScale},\n            ANIMATION_RATE: ${nAnim},\n            INIT_POSITION: { x: ${nX}, y: ${nY} },\n            pixels: { height: ${nSprite.h}, width: ${nSprite.w} },\n            orientation: { rows: ${nSprite.rows}, columns: ${nSprite.cols} },\n            down: { row: 0, start: 0, columns: 3 },\n            right: { row: Math.min(1, ${nSprite.rows} - 1), start: 0, columns: 3 },\n            left: { row: Math.min(2, ${nSprite.rows} - 1), start: 0, columns: 3 },\n            up: { row: Math.min(3, ${nSprite.rows} - 1), start: 0, columns: 3 },\n            upRight: { row: Math.min(3, ${nSprite.rows} - 1), start: 0, columns: 3 },\n            downRight: { row: Math.min(1, ${nSprite.rows} - 1), start: 0, columns: 3 },\n            upLeft: { row: Math.min(2, ${nSprite.rows} - 1), start: 0, columns: 3 },\n            downLeft: { row: 0, start: 0, columns: 3 },\n            hitbox: { widthPercentage: 0.1, heightPercentage: 0.2 },\n            zIndex: 12,\n            dialogues: ['${nMsg}'],\n            reaction: function() { if (this.dialogueSystem) { this.showReactionDialogue(); } else { console.log(this.greeting); } },\n            interact: function() { if (this.dialogueSystem) { this.showRandomDialogue(); } }\n        };`;
        }).join('\n');
        includedSlots.forEach((slot) => {
            classes.push(`      { class: Npc, data: npcData${slot.index} }`);
        });
        return { defs, classes };
    }

    function buildBarrierInsertText() {
        const includedWalls = ui.walls.slice();
        const classes = [];
        const defs = includedWalls.map((w, idx) => {
            const x = parseInt(w.wX?.value || 100, 10);
            const y = parseInt(w.wY?.value || 100, 10);
            const wWidth = parseInt(w.wW?.value || 150, 10);
            const wHeight = parseInt(w.wH?.value || 20, 10);
            const id = `wall_${idx+1}`;
            classes.push(`      { class: Barrier, data: barrierData${idx+1} }`);
            return `\n        const barrierData${idx+1} = {\n            id: '${id}', x: ${x}, y: ${y}, width: ${wWidth}, height: ${wHeight}, visible: true,\n            hitbox: { widthPercentage: 0.0, heightPercentage: 0.0 }\n        };`;
        }).join('\n');
        return { defs, classes };
    }

    /* SECTION: Code merge utilities (defs + classes into editor content) */
    function mergeDefsAndClasses(oldCode, insertDefs, insertClasses) {
        let code = oldCode;
        try {
            const exportRe = /export\s+const\s+gameLevelClasses\s*=\s*\[CustomLevel\];/;
            const m = exportRe.exec(code);
            if (m) {
                code = code.slice(0, m.index + m[0].length);
            }
        } catch (_) {}

        try {
            const varNames = [];
            const varRe = /\bconst\s+(npcData\d+)\s*=\s*\{/g;
            let mm;
            const scan = insertDefs || '';
            while ((mm = varRe.exec(scan)) !== null) { varNames.push(mm[1]); }
            if (varNames.length) {
                varNames.forEach(vn => {
                    const blockRe = new RegExp("\\n\\s*const\\s+" + vn + "\\s*=\\s*\\{[\\s\\S]*?\\};\\s*", 'g');
                    code = code.replace(blockRe, '\n');
                });
            }
            const barrierVarNames = [];
            const bVarRe = /\bconst\s+(barrierData\d+)\s*=\s*\{/g;
            let bm;
            while ((bm = bVarRe.exec(scan)) !== null) { barrierVarNames.push(bm[1]); }
            if (barrierVarNames.length) {
                barrierVarNames.forEach(vn => {
                    const blockRe = new RegExp("\\n\\s*const\\s+" + vn + "\\s*=\\s*\\{[\\s\\S]*?\\};\\s*", 'g');
                    code = code.replace(blockRe, '\n');
                });
            }
        } catch (_) {}

        const ctorRe = /(class\s+CustomLevel[\s\S]*?constructor\s*\(gameEnv\)\s*\{[\s\S]*?)(this\.classes\s*=\s*\[)/;
        code = code.replace(ctorRe, (m, p1, p2) => p1 + (insertDefs || '') + '\n' + p2);

        const classesRe = /(this\.classes\s*=\s*\[)([\s\S]*?)(\]\s*;)/;
        code = code.replace(classesRe, (m, p1, inner, p3) => {
            const toClean = s => s.replace(/,\s*$/, '').trim();
            const existingLines = inner.split('\n').map(l => toClean(l)).filter(l => l.length);
            const existingSet = new Set(existingLines);
            const newLines = (insertClasses || []).map(l => toClean(l));
            const combined = [...existingLines];
            for (const nl of newLines) {
                if (!existingSet.has(nl)) {
                    combined.push(nl);
                    existingSet.add(nl);
                }
            }
            if (!combined.length) return p1 + p3;
            const rebuilt = combined.map(l => '      ' + l).join(',\n');
            return p1 + rebuilt + '\n' + p3;
        });
        return code;
    }

    const mvEl = document.getElementById('movement-keys');
    const rerunPlayer = () => { syncFromControlsIfFreestyle(); };
    function updatePlayerPositionInEditor() {
        // Stage player position changes; no live reload until Confirm
        state.lastEdited = 'player';
        rerunPlayer();
    }
    if (ui.bg) ui.bg.addEventListener('change', () => { state.lastEdited = 'background'; rerunPlayer(); });
    if (ui.pSprite) ui.pSprite.addEventListener('change', () => {
        try {
            const key = ui.pSprite.value;
            const spr = assets && assets.sprites ? assets.sprites[key] : null;
            if (spr) {
                if (ui.pRows) ui.pRows.value = spr.rows ?? 1;
                if (ui.pCols) ui.pCols.value = spr.cols ?? 1;
                const rows = Math.max(1, parseInt(ui.pRows?.value || spr.rows || 1, 10));
                const clamp = (v) => Math.max(0, Math.min(rows - 1, v));
                if (ui.pDownRow) ui.pDownRow.value = clamp(0);
                if (ui.pRightRow) ui.pRightRow.value = clamp(1);
                if (ui.pLeftRow) ui.pLeftRow.value = clamp(2);
                if (ui.pUpRow) ui.pUpRow.value = clamp(3);
                if (ui.pUpRightRow) ui.pUpRightRow.value = clamp(3);
                if (ui.pDownRightRow) ui.pDownRightRow.value = clamp(1);
                if (ui.pUpLeftRow) ui.pUpLeftRow.value = clamp(2);
                if (ui.pDownLeftRow) ui.pDownLeftRow.value = clamp(0);
                if (ui.pDirCols && !ui.pDirCols.value) ui.pDirCols.value = 3;
            }
        } finally {
            state.lastEdited = 'player';
            rerunPlayer();
        }
    });
    if (ui.pX) ui.pX.addEventListener('input', updatePlayerPositionInEditor);
    if (ui.pY) ui.pY.addEventListener('input', updatePlayerPositionInEditor);
    if (ui.pName) ui.pName.addEventListener('input', () => { state.lastEdited = 'player'; rerunPlayer(); });
    if (mvEl) mvEl.addEventListener('change', () => { state.lastEdited = 'player'; rerunPlayer(); });
    if (ui.pScale) ui.pScale.addEventListener('input', () => { state.lastEdited = 'player'; rerunPlayer(); });
    if (ui.pStep) ui.pStep.addEventListener('input', () => { state.lastEdited = 'player'; rerunPlayer(); });
    if (ui.pAnim) ui.pAnim.addEventListener('input', () => { state.lastEdited = 'player'; rerunPlayer(); });
    if (ui.pRows) ui.pRows.addEventListener('input', () => { state.lastEdited = 'player'; rerunPlayer(); });
    if (ui.pCols) ui.pCols.addEventListener('input', () => { state.lastEdited = 'player'; rerunPlayer(); });
    if (ui.pHitboxW) ui.pHitboxW.addEventListener('input', () => { state.lastEdited = 'player'; rerunPlayer(); });
    if (ui.pHitboxH) ui.pHitboxH.addEventListener('input', () => { state.lastEdited = 'player'; rerunPlayer(); });
    [ui.pDownRow, ui.pRightRow, ui.pLeftRow, ui.pUpRow, ui.pUpRightRow, ui.pDownRightRow, ui.pUpLeftRow, ui.pDownLeftRow, ui.pDirCols]
        .forEach(el => { if (el) el.addEventListener('input', () => { state.lastEdited = 'player'; rerunPlayer(); }); });
    
    ui.npcs.forEach(slot => {
        if (slot.nId) slot.nId.addEventListener('input', () => { state.lastEdited = 'npc'; syncFromControlsIfFreestyle(); });
        if (slot.nId) slot.nId.addEventListener('input', () => {
            const name = slot.nId.value.trim();
            if (name.length) {
                slot.displayName = name;
                const isVisible = slot.fieldsContainer && slot.fieldsContainer.style.display !== 'none';
                const caret = isVisible ? ' ▾' : ' ▸';
                slot.addBtn.textContent = (slot.locked ? name : 'NPC') + caret;
            }
        });
        if (slot.nMsg) slot.nMsg.addEventListener('input', () => { state.lastEdited = 'npc'; syncFromControlsIfFreestyle(); });
        if (slot.nSprite) slot.nSprite.addEventListener('change', () => { state.lastEdited = 'npc'; syncFromControlsIfFreestyle(); });
        if (slot.nX) slot.nX.addEventListener('input', () => { state.lastEdited = 'npc'; syncFromControlsIfFreestyle(); });
        if (slot.nY) slot.nY.addEventListener('input', () => { state.lastEdited = 'npc'; syncFromControlsIfFreestyle(); });
    });

    /* SECTION: Confirm handler (apply staged code via typing, then lock fields) */
    document.getElementById('btn-confirm').addEventListener('click', () => {
        const btn = document.getElementById('btn-confirm');
        const oldCode = ui.editor.value;
        const current = steps[stepIndex];

        try {
            const npcInsAll = buildNpcInsertText();
            const wallInsAll = buildBarrierInsertText();
            const hasNpcAll = (npcInsAll.defs && npcInsAll.defs.trim().length) || (npcInsAll.classes && npcInsAll.classes.length);
            const hasWallAll = (wallInsAll.defs && wallInsAll.defs.trim().length) || (wallInsAll.classes && wallInsAll.classes.length);
            if (hasNpcAll || hasWallAll) {
                const merged = mergeDefsAndClasses(oldCode, (npcInsAll.defs || '') + (wallInsAll.defs || ''), [...(npcInsAll.classes || []), ...(wallInsAll.classes || [])]);
                simulateTypingChange(oldCode, merged, () => {
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
                            if (slot.deleteBtn) { slot.deleteBtn.disabled = false; slot.deleteBtn.style.display = ''; }
                        }
                    });
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
                    stepIndex = steps.indexOf('freestyle');
                    setIndicator();
                    updateStepUI();
                    ui.overlayConfirmed = ui.overlayConfirmed || hasWallAll;
                    stagedCode = null; stagedStep = null;
                    runInEmbed();
                    if (btn) btn.classList.remove('staged');
                });
                return;
            }
        } catch (_) {}

        if (state.userEdited) {
            const npcIns = buildNpcInsertText();
            const hasNpcIns = (npcIns.defs && npcIns.defs.trim().length) || (npcIns.classes && npcIns.classes.length);
            if (hasNpcIns) {
                const merged = mergeDefsAndClasses(oldCode, npcIns.defs, npcIns.classes);
                simulateTypingChange(oldCode, merged, () => {
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
                    // Stay in Freestyle after inserting NPCs
                    stepIndex = steps.indexOf('freestyle');
                    setIndicator();
                    updateStepUI();
                    runInEmbed();
                    const btnDone = document.getElementById('btn-confirm');
                    if (btnDone) btnDone.classList.remove('staged');
                });
                return;
            }
            if (current === 'walls') {
                const ins = buildBarrierInsertText();
                const merged = mergeDefsAndClasses(oldCode, ins.defs, ins.classes);
                simulateTypingChange(oldCode, merged, () => {
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
                    stepIndex = Math.min(stepIndex + 1, steps.length - 1);
                    setIndicator();
                    updateStepUI();
                    ui.overlayConfirmed = true;
                    runInEmbed();
                    const btnDone = document.getElementById('btn-confirm');
                    if (btnDone) btnDone.classList.remove('staged');
                });
                return;
            }
            alert('You have manual code edits. To avoid resetting them, configure background/player directly in code or clear edits before confirming.');
            return;
        }

        if (stagedCode) {
            const applyingStep = stagedStep || current;
            if (applyingStep === 'npc') {
                const ins = buildNpcInsertText();
                const merged = mergeDefsAndClasses(oldCode, ins.defs, ins.classes);
                simulateTypingChange(oldCode, merged, () => {
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
                    // Stay in Freestyle after confirming NPCs
                    stepIndex = steps.indexOf('freestyle');
                    stagedCode = null; stagedStep = null;
                    if (btn) btn.classList.remove('staged');
                    setIndicator();
                    updateStepUI();
                    runInEmbed();
                });
                return;
            }
            if (applyingStep === 'walls') {
                const ins = buildBarrierInsertText();
                const merged = mergeDefsAndClasses(oldCode, ins.defs, ins.classes);
                simulateTypingChange(oldCode, merged, () => {
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
                    stepIndex = Math.min(stepIndex + 1, steps.length - 1);
                    stagedCode = null; stagedStep = null;
                    if (btn) btn.classList.remove('staged');
                    setIndicator();
                    updateStepUI();
                    ui.overlayConfirmed = true;
                    runInEmbed();
                });
                return;
            }
            const codeToApply = stagedCode;
            simulateTypingChange(oldCode, codeToApply, () => {
                if (applyingStep === 'background') { lockField(ui.bg); }
                if (applyingStep === 'player') { lockField(ui.pSprite); lockField(ui.pX); lockField(ui.pY); lockField(ui.pName); lockField(document.getElementById('movement-keys')); }
                if (applyingStep === 'walls') {
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

                stagedCode = null; stagedStep = null;
                if (btn) btn.classList.remove('staged');

                setIndicator();
                updateStepUI();
                if (applyingStep === 'walls') ui.overlayConfirmed = true;
                runInEmbed();
            });
            return;
        }

        const newCode = generateStepCode(current);
        if (!newCode) {
            if (current === 'background') alert('Select a Background, then Confirm Step.');
            else if (current === 'player') alert('Select a Player sprite (and optional keys), then Confirm Step.');
            else alert('Add at least one NPC, then Confirm Step.');
            return;
        }
        simulateTypingChange(oldCode, newCode, () => {
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

                // Stay in Freestyle after confirming NPCs
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
            if (current === 'walls') ui.overlayConfirmed = true;
            runInEmbed();
        });
    });

    /* SECTION: Runtime + iframe comms */
    function safeCodeToRun() {
        // Prefer staged for background/player, but not for npc/walls so live engine uses editor merges
        const preferStaged = (typeof stagedStep !== 'undefined' && !['npc','walls'].includes(stagedStep));
        const preferred = (preferStaged && typeof stagedCode === 'string' && stagedCode.length) ? stagedCode : (ui.editor.value || '');
        const hasLevels = /export\s+const\s+gameLevelClasses/.test(preferred);
        return hasLevels ? preferred : generateBaselineCode();
    }

    function syncOverlayBarriersToRunner() {
        try {
            const shapes = Array.isArray(ui.drawShapes) ? ui.drawShapes : [];
            const rect = ui.drawOverlay?.getBoundingClientRect?.() || { width: 0, height: 0 };
            const scaleX = (envWidth && rect.width) ? (envWidth / rect.width) : 1;
            const scaleY = (envHeight && rect.height) ? (envHeight / rect.height) : 1;
            const barriers = shapes
                .filter(s => s && s.type === 'barrier')
                .map((s, i) => ({
                    id: `dbarrier_rt_${i+1}`,
                    x: Math.max(0, Math.round(((s.x || 0)) * scaleX)),
                    y: Math.max(0, Math.round(((s.y || 0)) * scaleY)),
                    width: Math.max(0, Math.round((s.width || 0) * scaleX)),
                    height: Math.max(0, Math.round((s.height || 0) * scaleY)),
                    visible: !!ui.gameWallsVisible
                }));
            ui.iframe?.contentWindow?.postMessage({ type: 'rpg:set-drawn-barriers', barriers }, '*');
        } catch (_) { /* ignore */ }
    }

    function runInEmbed() {
        renderOverlay();
        const code = safeCodeToRun();
        const currentSrc = ui.iframe.src;
        ui.iframe.onload = () => {
            setTimeout(() => {
                try {
                    ui.iframe.contentWindow.postMessage({ type: 'rpg:run-code', code: code }, '*');
                } catch (_) {}
            }, 100);
        };
        try {
            const urlObj = new URL(currentSrc, window.location.origin);
            urlObj.searchParams.set('t', Date.now());
            ui.iframe.src = urlObj.toString();
        } catch (_) {
            ui.iframe.src = currentSrc;
        }
    }

    document.getElementById('btn-run').addEventListener('click', runInEmbed);
    if (ui.toggleWallsGameBtn) {
        const refreshToggleLabel = () => {
            ui.toggleWallsGameBtn.textContent = ui.gameWallsVisible ? 'Hide Walls (Game)' : 'Show Walls (Game)';
        };
        refreshToggleLabel();
        ui.toggleWallsGameBtn.addEventListener('click', () => {
            ui.gameWallsVisible = !ui.gameWallsVisible;
            refreshToggleLabel();
            updateOverlayVisibility();
            try {
                ui.iframe?.contentWindow?.postMessage({ type: 'rpg:toggle-walls', visible: ui.gameWallsVisible }, '*');
            } catch (e) { /* ignore */ }
        });
    }

    /* export composed level code */
    function exportCode() {
        let code = stagedCode || safeCodeToRun();
        if (!/export\s+const\s+gameLevelClasses/.test(code)) {
            code = generateBaselineCode();
        }
        code = code.replace(/visible:\s*true\s*\/\*\s*BUILDER_DEFAULT\s*\*\//g, 'visible: false');
        // remove any builder-only diagnostics and comms blocks
        code = code.replace(/\/\*\s*BUILDER_ONLY_START\s*\*\/[\s\S]*?\/\*\s*BUILDER_ONLY_END\s*\*\//g, '');
        // fallback cleanup if markers are missing in the current editor content
        code = code.replace(/^.*window\.parent\.postMessage\([^\n]*\)\s*;?\s*$/gm, '');
        code = code.replace(/try\s*\{\s*window\.addEventListener\(\s*'message'[\s\S]*?\}\s*catch\s*\(_\)\s*\{\}\s*/g, '');
        code = code.replace(/\/\* BUILDER_HOOKS_START \*\/[\s\S]*?\/\* BUILDER_HOOKS_END \*\//g, '');
        code = code.replace(/import\s+GameControl\s+from\s+[^\n]+\n/g, '');
        code = code.replace(/export\s*\{\s*GameControl\s*\};?/g, '');
        code = code.replace(/export\s+const\s+gameLevelClasses\s*=\s*\[\s*GameLevelCustom\s*\];?/g, 'export default GameLevelCustom;');
        const header = `// Adventure Game Custom Level\n// Exported from GameBuilder on ${(new Date()).toISOString()}\n// How to use this file:\n// 1) Save as assets/js/adventureGame/GameLevelCustom.js in your repo.\n// 2) Reference it in your runner or level selector. Examples:\n//    import GameLevelCustom from '/assets/js/adventureGame/GameLevelCustom.js';\n//    export const gameLevelClasses = [GameLevelBasic, GameLevelCustom];\n//    // or pass it directly to your GameControl as the only level.\n// 3) Ensure images exist and paths resolve via 'path' provided by the engine.\n// 4) You can add more objects to this.classes inside the constructor.\n`;
        code = header + code;
        const blob = new Blob([code], { type: 'text/javascript;charset=utf-8' });
        const a = document.createElement('a');
        const url = URL.createObjectURL(blob);
        a.href = url;
        const suggestedName = (ui.pName && ui.pName.value ? ui.pName.value.trim() : 'GameLevelCustom')
            .replace(/[^a-zA-Z0-9_-]+/g, '_') || 'GameLevelCustom';
        a.download = `${suggestedName}.js`;
        document.body.appendChild(a);
        a.click();
        setTimeout(() => {
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }, 0);
    }

    const exportBtn = document.getElementById('btn-export');
    if (exportBtn) exportBtn.addEventListener('click', exportCode);

    const refreshBtn = document.getElementById('btn-refresh-assets');
    if (refreshBtn) refreshBtn.addEventListener('click', () => { scanServerAssets(); });

    try { scanServerAssets(); } catch (_) {}


    ui.editor.value = generateBaselineCode();
    setIndicator();
    updateStepUI();
    renderOverlay();
});
</script>

<script>
window.addEventListener('keydown', function(e) {
    const keys = [32, 37, 38, 39, 40];
    if (!keys.includes(e.keyCode)) return;
    const tgt = e.target;
    const isForm = tgt && (tgt.tagName === 'INPUT' || tgt.tagName === 'TEXTAREA' || tgt.isContentEditable);
    const active = document.activeElement;
    const isGameFocused = active && active.tagName === 'IFRAME' && active.id === 'game-iframe';
    if (!isForm && !isGameFocused) {
        e.preventDefault();
    }
}, { passive: false });

document.querySelector('.game-frame')?.addEventListener('click', () => {
    const iframe = document.getElementById('game-iframe');
    if (iframe) {
        iframe.setAttribute('tabindex', '0');
        iframe.focus();
    }
});
</script>

<script>
function forwardInteractKey(ev, type) {
    const tgt = ev.target;
    const isForm = tgt && (tgt.tagName === 'INPUT' || tgt.tagName === 'TEXTAREA' || tgt.isContentEditable);
    if (isForm) return;
    const isInteract = (ev.key === 'e' || ev.key === 'E' || ev.code === 'KeyE' || ev.key === 'u' || ev.key === 'U');
    if (!isInteract) return;
    const iframe = document.getElementById('game-iframe');
    try {
        iframe?.contentWindow?.postMessage({
            type: 'rpg:simulate-key',
            evType: type,
            key: ev.key,
            keyCode: ev.keyCode,
            code: ev.code
        }, '*');
    } catch (_) {}
}

window.addEventListener('keydown', function(e) {
    forwardInteractKey(e, 'keydown');
    try {
        const iframe = document.getElementById('game-iframe');
        iframe?.contentWindow?.postMessage({ type: 'rpg:trigger-interact' }, '*');
    } catch (_) {}
});
window.addEventListener('keyup', function(e) {
    forwardInteractKey(e, 'keyup');
});
</script>


