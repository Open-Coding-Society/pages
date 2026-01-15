---
layout: opencs
title: RPG
permalink: /rpg/latest
---

<style>
.embedded .site-header,
.embedded .post-header,
.embedded .site-footer,
.embedded .page-description { display: none !important; }
.embedded body { margin: 0 !important; }
.embedded .page-content .wrapper { max-width: 100% !important; padding: 0 !important; margin: 0 !important; }
.embedded .page-content, .embedded .post-content, .embedded main, .embedded .page { margin: 0 !important; padding: 0 !important; }
html.embedded, html.embedded body { overflow: hidden !important; }

html, body { height: 100%; }
#gameContainer { width: 100%; height: 85vh; margin: 0; position: relative; }
.embedded #gameContainer { height: 100vh; position: fixed; top: 0; left: 0; right: 0; }
#gameCanvas { width: 100%; height: 100%; display: block; }

/* Ensure a black screen when the engine is not started */
#gameContainer, #gameCanvas { background: #000; }

/* Overlay to block interactions and ensure black screen when stopped */
#engine-blocker {
    position: absolute;
    inset: 0;
    background: #000;
    z-index: 10;
    display: none; /* shown when engine is stopped */
}

.custom-alert {
    display: none;
    position: fixed;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    z-index: 1000;
}

.custom-alert button {
    background-color: transparent; /* Fully transparent background */
    display: flex; /* Use flexbox for layout */
    align-items: center; /* Center items vertically */
    justify-content: center; /* Center items horizontally */
    width: 100%; /* Adjust width to fit content */
    height: 100%; /* Adjust height to fit content */
    position: absolute; /* Position the button relative to the alert box */
}

</style>

<script>
// Enable embed mode when inside an iframe or with ?embed=1
(function() {
    try {
        const params = new URLSearchParams(window.location.search);
        if (params.get('embed') === '1' || window.self !== window.top) {
            document.documentElement.classList.add('embedded');
        }
    } catch (e) {
        // no-op
    }
})();

function closeCustomAlert() {
    try {
        const el = document.getElementById('custom-alert');
        if (el) el.style.display = 'none';
    } catch (_) {}
}
</script>

<div id="gameContainer">
    <canvas id='gameCanvas'></canvas>
    <div id="engine-blocker" aria-hidden="true"></div>
</div>

<div id="custom-alert" class="custom-alert">
    <button onclick="closeCustomAlert()" id="custom-alert-message"></button>
    </div>

<script type="module">
    const path = "{{site.baseurl}}";
    const origin = window.location.origin;

    // Proactively unregister any service workers to avoid stale/cached HTML
    if (navigator.serviceWorker && navigator.serviceWorker.getRegistrations) {
        try {
            const regs = await navigator.serviceWorker.getRegistrations();
            for (const r of regs) { try { await r.unregister(); } catch (_) {} }
        } catch (_) {}
    }

    // Lazy-load AdventureGame to avoid early import errors and allow cache busting
    let AdventureGame = null;
    async function loadAdventureGame() {
        if (AdventureGame) return AdventureGame;
        const url = `${origin}${path || ''}/assets/js/adventureGame/GameEngine/Game.js?v=${Date.now()}`;
        const mod = await import(url);
        AdventureGame = mod?.default ?? mod;
        return AdventureGame;
    }

    // Respect autostart query parameter (default: true)
    const params = new URLSearchParams(window.location.search);
    const autostartParam = (params.get('autostart') || '').toLowerCase();
    const autoStart = !(autostartParam === '0' || autostartParam === 'false' || autostartParam === 'no');

    // Blockers: prevent all input when engine inactive
    let engineActive = !!autoStart;
    const blockerEl = document.getElementById('engine-blocker');
    const blockEvents = [
        'keydown','keyup','keypress',
        'mousedown','mouseup','mousemove','contextmenu',
        'wheel','touchstart','touchmove','touchend','pointerdown','pointermove','pointerup'
    ];
    const handlers = new Map();

    function enableBlockers() {
        if (blockerEl) blockerEl.style.display = 'block';
        blockEvents.forEach(type => {
            if (!handlers.has(type)) {
                const h = (e) => { e.preventDefault(); e.stopPropagation(); };
                document.addEventListener(type, h, { capture: true, passive: false });
                handlers.set(type, h);
            }
        });
    }

    function disableBlockers() {
        if (blockerEl) blockerEl.style.display = 'none';
        handlers.forEach((h, type) => {
            document.removeEventListener(type, h, { capture: true });
        });
        handlers.clear();
    }

    // Try to import RPG GameControl dynamically (may not exist in this repo)
    async function tryStartDefault() {
        try {
            const mod = await import(`${origin}${path || ''}/assets/js/rpg/latest/GameControl.js?v=${Date.now()}`);
            const GameControl = mod?.default ?? mod?.GameControl ?? null;
            if (GameControl && typeof GameControl.start === 'function') {
                GameControl.start(path);
                return true;
            }
        } catch (e) {
            // GameControl not available; continue without autostart
            console.warn('RPG GameControl not found; running without default start.', e);
        }
        return false;
    }

    if (!engineActive) {
        enableBlockers();
    } else {
        // Start game engine by default, if RPG GameControl exists
        tryStartDefault().then((started) => {
            if (started) {
                disableBlockers();
            } else {
                enableBlockers();
            }
        });
    }

    // Track live Adventure engine instance (from code runner)
    let liveAdventure = null;

    // Expose simple control handling for parent pages via postMessage
    let isPaused = false;
    window.addEventListener('message', (event) => {
        const data = event?.data;
        if (!data || data.type !== 'rpg:control') return;
        const action = data.action;
        try {
            switch (action) {
                case 'start':
                    if (document.documentElement.classList.contains('embedded')) {
                        // In embedded/live mode, parent will send rpg:run-code. No default turtle.
                        // Keep blockers until code arrives.
                        engineActive = false;
                        enableBlockers();
                        isPaused = false;
                    } else {
                        tryStartDefault().then((started) => {
                            engineActive = !!started;
                            if (started) disableBlockers(); else enableBlockers();
                            isPaused = false;
                        });
                    }
                    break;
                case 'pause':
                    if (liveAdventure && liveAdventure.gameControl && typeof liveAdventure.gameControl.pause === 'function') {
                        liveAdventure.gameControl.pause();
                        isPaused = true;
                    }
                    break;
                case 'resume':
                    if (liveAdventure && liveAdventure.gameControl && typeof liveAdventure.gameControl.resume === 'function') {
                        liveAdventure.gameControl.resume();
                        isPaused = false;
                    }
                    break;
                case 'stop':
                    // For consistency and clean teardown, reload.
                    location.reload();
                    engineActive = false;
                    // Ensure black screen and block all input
                    enableBlockers();
                    break;
                case 'reset':
                    // Reload resets the canvas/game state safely
                    location.reload();
                    break;
            }
        } catch (err) {
            console.error('Runner control error:', err);
        }
    });

    // Live code runner: accept code string, dynamic-import, and start engine
    window.addEventListener('message', async (event) => {
        const data = event?.data;
        if (!data || data.type !== 'rpg:run-code') return;
        let code = String(data.code || '');
        if (!code.trim()) return;
        try {
            // Show blockers during load
            enableBlockers();
            engineActive = false;

            // Rewrite import specifiers to fully-qualified URLs
            const origin = window.location.origin;
            const basePrefix = `${origin}${path || ''}`;
            const fromAbsRe = /(from\s*["'])(\/[^"']+)(["'])/g; // import ... from '/x/y'
            const dynImpAbsRe = /(import\(\s*["'])(\/[^"']+)(["']\s*\))/g; // import('/x/y')
            const fromRelRe = /(from\s*["'])(?!https?:)(\.?\.?[^"']+)(["'])/g; // import ... from './x' or 'x'
            const dynImpRelRe = /(import\(\s*["'])(?!https?:)(\.?\.?[^"']+)(["']\s*\))/g; // import('./x') or import('x')
            code = code
                // Absolute root paths
                .replace(fromAbsRe, (m, p1, p2, p3) => `${p1}${basePrefix}${p2}${p3}`)
                .replace(dynImpAbsRe, (m, p1, p2, p3) => `${p1}${basePrefix}${p2}${p3}`)
                // Relative paths -> prefix with base
                .replace(fromRelRe, (m, p1, p2, p3) => `${p1}${basePrefix}/${p2}${p3}`)
                .replace(dynImpRelRe, (m, p1, p2, p3) => `${p1}${basePrefix}/${p2}${p3}`);

            // Ensure AdventureGame is loaded before running
            const AG = await loadAdventureGame();

            // Create module blob and import
            const blob = new Blob([code], { type: 'application/javascript' });
            const url = URL.createObjectURL(blob);
            let mod = null;
            try {
                mod = await import(url);
            } finally {
                URL.revokeObjectURL(url);
            }

            // Prepare environment references
            const env = {
                path,
                gameContainer: document.getElementById('gameContainer'),
                gameCanvas: document.getElementById('gameCanvas'),
                pythonURI: '',
                javaURI: '',
                fetchOptions: {}
            };

            const levelClasses = Array.isArray(mod.gameLevelClasses) ? mod.gameLevelClasses : [];

            let started = false;
            // Preferred: Use Adventure Game engine entrypoint with provided levels
            if (levelClasses.length > 0 && AG && typeof AG.main === 'function') {
                try {
                    liveAdventure = AG.main({
                        path: env.path,
                        gameContainer: env.gameContainer,
                        gameCanvas: env.gameCanvas,
                        pythonURI: env.pythonURI,
                        javaURI: env.javaURI,
                        fetchOptions: env.fetchOptions,
                        gameLevelClasses: levelClasses
                    });
                    started = true;
                } catch (e) {
                    console.warn('Adventure Game main failed, trying fallbacks:', e);
                }
            }

            if (started) {
                engineActive = true;
                disableBlockers();
            } else {
                throw new Error('Could not start game from provided code. Ensure it exports gameLevelClasses.');
            }
        } catch (err) {
            console.error('Live code run error:', err);
            try {
                const el = document.getElementById('custom-alert');
                const msgBtn = document.getElementById('custom-alert-message');
                if (el && msgBtn) {
                    msgBtn.textContent = `Error: ${err.message || err}`;
                    el.style.display = 'block';
                    enableBlockers();
                }
            } catch (_) {}
        }
    });
</script>
