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

/* Hide Engine leaderboard when running inside Game Builder iframe */
.embedded .leaderboard-widget { display: none !important; visibility: hidden !important; }

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

    // Dynamically resolve a working base prefix for assets (handles empty or mismatched baseurl)
    let basePrefix = null;
    async function ensureBasePrefix() {
        if (basePrefix) return basePrefix;
        const candidates = [];
        const siteBase = path || '';
        if (siteBase) candidates.push(`${origin}${siteBase}`);
        candidates.push(`${origin}`);
        // Derive first path segment (e.g., '/gamebuilder') if siteBase is empty
        try {
            const seg = '/' + (window.location.pathname.split('/').filter(Boolean)[0] || '');
            if (seg && seg !== '/') candidates.push(`${origin}${seg}`);
        } catch (_) {}
        // Deduplicate
        const uniq = [...new Set(candidates)];
        let lastErr = null;
        for (const cand of uniq) {
            try {
                const testUrl = `${cand}/assets/js/GameEngine/essentials/Game.js?v=${Date.now()}`;
                const res = await fetch(testUrl, { method: 'GET', credentials: 'same-origin', cache: 'no-store' });
                if (res && res.ok) {
                    const ctype = (res.headers.get('content-type') || '').toLowerCase();
                    // Prefer JS MIME types; if ambiguous, inspect body
                    if (ctype.includes('javascript') || ctype.includes('ecmascript') || ctype.includes('module')) {
                        basePrefix = cand; return basePrefix;
                    }
                    const text = await res.text();
                    // Reject HTML responses (which cause "Unexpected token '<'")
                    if (text.trim().startsWith('<')) {
                        lastErr = new Error(`Probe returned HTML @ ${testUrl}`);
                    } else {
                        basePrefix = cand; return basePrefix;
                    }
                } else {
                    lastErr = new Error(`Probe failed: ${res?.status} @ ${testUrl}`);
                }
            } catch (e) {
                lastErr = e;
            }
        }
        // Fallback to origin + siteBase even if probe failed
        basePrefix = `${origin}${siteBase}`;
        console.warn('[RPG] Falling back to basePrefix:', basePrefix, 'Last probe error:', lastErr);
        return basePrefix;
    }

    // Proactively unregister any service workers to avoid stale/cached HTML
    if (navigator.serviceWorker && navigator.serviceWorker.getRegistrations) {
        try {
            const regs = await navigator.serviceWorker.getRegistrations();
            for (const r of regs) { try { await r.unregister(); } catch (_) {} }
        } catch (_) {}
    }

    // Lazy-load engine (Prefer GameEngine, fallback to Adventure)
    let EngineModule = null;
    let engineType = null;
    async function loadEngine() {
        if (EngineModule) return EngineModule;
        // Prefer Adventure engine first (present in this workspace), fallback to Better
        try {
            const prefix = await ensureBasePrefix();
            const advUrl = `${prefix}/assets/js/GameEngine/essentials/Game.js?v=${Date.now()}`;
            // Prefetch to validate MIME/content to avoid HTML imports
            try {
                const r = await fetch(advUrl, { method: 'GET', credentials: 'same-origin', cache: 'no-store' });
                const ct = (r.headers.get('content-type') || '').toLowerCase();
                const body = r.ok ? await r.text() : '';
                if (!r.ok || body.trim().startsWith('<') || !(ct.includes('javascript') || ct.includes('ecmascript') || ct.includes('module') || ct === '')) {
                    throw new Error(`Adventure engine not served as JS (status ${r.status || 'unknown'})`);
                }
            } catch (prefetchErr) {
                throw prefetchErr;
            }
            const advMod = await import(advUrl);
            EngineModule = advMod?.default ?? advMod;
            engineType = 'adventure';
            return EngineModule;
        } catch (eAdv) {
            console.warn('Adventure engine load failed, trying GameEngine:', eAdv);
            try {
                const prefix = await ensureBasePrefix();
                const betterUrl = `${prefix}/assets/js/mansionGame/MansionLogic/Game.js?v=${Date.now()}`;
                // Prefetch and validate Better engine too
                try {
                    const r = await fetch(betterUrl, { method: 'GET', credentials: 'same-origin', cache: 'no-store' });
                    const ct = (r.headers.get('content-type') || '').toLowerCase();
                    const body = r.ok ? await r.text() : '';
                    if (!r.ok || body.trim().startsWith('<') || !(ct.includes('javascript') || ct.includes('ecmascript') || ct.includes('module') || ct === '')) {
                        throw new Error(`Better engine not served as JS (status ${r.status || 'unknown'})`);
                    }
                } catch (prefetchErr2) {
                    throw prefetchErr2;
                }
                const betterMod = await import(betterUrl);
                EngineModule = betterMod?.default ?? betterMod;
                engineType = 'better';
                return EngineModule;
            } catch (eBetter) {
                console.error('Both engine loads failed:', { adventureError: eAdv, betterError: eBetter });
                throw eBetter;
            }
        }
    }

    // Explicit loader for Adventure engine for runtime fallback from Better
    async function loadAdventureEngine() {
        try {
            const prefix = await ensureBasePrefix();
            const url = `${prefix}/assets/js/GameEngine/essentials/Game.js?v=${Date.now()}`;
            // Prefetch and validate response isn't HTML
            try {
                const r = await fetch(url, { method: 'GET', credentials: 'same-origin', cache: 'no-store' });
                const ct = (r.headers.get('content-type') || '').toLowerCase();
                const body = r.ok ? await r.text() : '';
                if (!r.ok || body.trim().startsWith('<') || !(ct.includes('javascript') || ct.includes('ecmascript') || ct.includes('module') || ct === '')) {
                    throw new Error(`Adventure fallback not served as JS (status ${r.status || 'unknown'})`);
                }
            } catch (prefetchErr) {
                throw prefetchErr;
            }
            const mod = await import(url);
            EngineModule = mod?.default ?? mod;
            engineType = 'adventure';
            return EngineModule;
        } catch (e) {
            console.error('Failed to load Adventure engine fallback:', e);
            throw e;
        }
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
            await ensureBasePrefix();
            const basePrefixLocal = basePrefix;
            const fromAbsRe = /(from\s*["'])(\/[^"']+)(["'])/g; // import ... from '/x/y'
            const dynImpAbsRe = /(import\(\s*["'])(\/[^"']+)(["']\s*\))/g; // import('/x/y')
            const fromRelRe = /(from\s*["'])(?!https?:)(\.?\.?[^"']+)(["'])/g; // import ... from './x' or 'x'
            const dynImpRelRe = /(import\(\s*["'])(?!https?:)(\.?\.?[^"']+)(["']\s*\))/g; // import('./x') or import('x')
            code = code
                // Absolute root paths
                .replace(fromAbsRe, (m, p1, p2, p3) => `${p1}${basePrefixLocal}${p2}${p3}`)
                .replace(dynImpAbsRe, (m, p1, p2, p3) => `${p1}${basePrefixLocal}${p2}${p3}`)
                // Relative paths -> prefix with base
                .replace(fromRelRe, (m, p1, p2, p3) => `${p1}${basePrefixLocal}/${p2}${p3}`)
                .replace(dynImpRelRe, (m, p1, p2, p3) => `${p1}${basePrefixLocal}/${p2}${p3}`);

            // Ensure engine is loaded before running
            const Engine = await loadEngine();

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

            // Accept both named and default exports for gameLevelClasses
            let levelClasses = Array.isArray(mod.gameLevelClasses)
                ? mod.gameLevelClasses
                : Array.isArray(mod?.default?.gameLevelClasses)
                ? mod.default.gameLevelClasses
                : [];
            // Fallback: single exported level class
            if (!levelClasses.length) {
                const candidates = [];
                if (typeof mod?.default === 'function') candidates.push(mod.default);
                if (typeof mod.CustomLevel === 'function') candidates.push(mod.CustomLevel);
                // Heuristic: any named export ending with 'Level' and is a function
                try {
                    Object.keys(mod || {}).forEach(k => {
                        if (k !== 'default' && /Level$/i.test(k) && typeof mod[k] === 'function') {
                            candidates.push(mod[k]);
                        }
                    });
                } catch (_) {}
                if (candidates.length) levelClasses = [candidates[0]];
            }

            // Diagnostics: surface what we detected from the module
            try {
                console.debug('[Runner] Module export diagnostics', {
                    hasNamedGameLevelClasses: Array.isArray(mod?.gameLevelClasses),
                    hasDefaultGameLevelClasses: Array.isArray(mod?.default?.gameLevelClasses),
                    detectedLevelCount: levelClasses.length,
                    hasDefaultFunction: typeof mod?.default === 'function',
                    hasCustomLevel: typeof mod?.CustomLevel === 'function',
                    engineType
                });
            } catch (_) {}

            let started = false;
            let lastStartError = null;
            // Always use Adventure engine for gamebuilder code (which only exports gameLevelClasses)
            if (levelClasses.length > 0 && Engine && typeof Engine.main === 'function') {
                try {
                    // Force Adventure engine for all code coming through rpg.md (gamebuilder uses this)
                    const containerWidth = env.gameContainer?.clientWidth || window.innerWidth;
                    const containerHeight = Math.min(580, window.innerHeight);
                    try {
                        liveAdventure = Engine.main({
                        path: env.path,
                        gameContainer: env.gameContainer,
                        gameCanvas: env.gameCanvas,
                        pythonURI: env.pythonURI,
                        javaURI: env.javaURI,
                        fetchOptions: env.fetchOptions,
                        innerWidth: containerWidth,
                        innerHeight: containerHeight,
                        gameLevelClasses: levelClasses
                        });
                    } catch (startErr) {
                        lastStartError = startErr;
                        throw startErr;
                    }
                    started = true;
                } catch (e) {
                    console.error('Game start failed:', e);
                    lastStartError = e;
                }
            }

            if (started) {
                engineActive = true;
                disableBlockers();
            } else {
                // Provide clearer error message based on detected conditions
                const noLevels = !levelClasses || levelClasses.length === 0;
                const msg = noLevels
                    ? 'No levels detected. Export array `gameLevelClasses` or a default/named level class (e.g., `CustomLevel`).'
                    : `Engine start failed. ${lastStartError?.message ? 'Reason: ' + lastStartError.message : 'Check import paths and ensure assets exist under base.'} Base: ${basePrefix || (origin + (path || ''))}`;
                // Show message without throwing to keep the app responsive
                try {
                    const el = document.getElementById('custom-alert');
                    const msgBtn = document.getElementById('custom-alert-message');
                    if (el && msgBtn) {
                        msgBtn.textContent = msg;
                        el.style.display = 'block';
                        enableBlockers();
                    }
                } catch (_) {}
                return;
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
