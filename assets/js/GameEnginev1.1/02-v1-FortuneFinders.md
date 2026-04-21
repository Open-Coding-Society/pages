---
layout: opencs
title: Fortune Finders
permalink: /gamify/fortuneFindersv1-1
---

<div id="gameContainer">
    <div id="promptDropDown" class="promptDropDown" style="z-index: 9999"></div>
    <!-- Engine creates its own canvases; hide legacy canvas to avoid visual artifacts -->
    <canvas id='gameCanvas' style="display:none"></canvas>
</div>

<script type="module">
    function showStartupError(error) {
        const container = document.getElementById("gameContainer");
        if (!container) return;

        const details = error?.stack || error?.message || String(error);
        const panel = document.createElement("div");
        panel.style.cssText = `
            color: #fff;
            background: #2b0000;
            border: 1px solid #ff5c5c;
            border-radius: 8px;
            margin: 12px 0;
            padding: 12px;
            font-family: monospace;
            white-space: pre-wrap;
            line-height: 1.4;
        `;
        panel.textContent = `Fortune Finders failed to start.\n${details}`;
        container.prepend(panel);
    }

    window.addEventListener("unhandledrejection", (event) => {
        console.error("Unhandled startup rejection:", event.reason);
        showStartupError(event.reason);
    });

    (async () => {
        try {
            const [{ default: FinTech }, { default: GameLevelAirport }, { default: GameLevelFuturesExchange }, { default: GameLevelOptionsHub }, { default: GameLevelWallstreet }, config] = await Promise.all([
                import("{{site.baseurl}}/assets/js/GameEnginev1.1/FinTech.js"),
                import("{{site.baseurl}}/assets/js/GameEnginev1.1/GameLevelAirport.js"),
                import("{{site.baseurl}}/assets/js/GameEnginev1.1/GameLevelFuturesExchange.js"),
                import("{{site.baseurl}}/assets/js/GameEnginev1.1/GameLevelOptionsHub.js"),
                import("{{site.baseurl}}/assets/js/GameEnginev1.1/GameLevelWallstreet.js"),
                import("{{site.baseurl}}/assets/js/api/config.js"),
            ]);

            const gameLevelClasses = [GameLevelAirport, GameLevelFuturesExchange, GameLevelOptionsHub, GameLevelWallstreet];

            const environment = {
                path: "{{site.baseurl}}",
                pythonURI: config.pythonURI,
                javaURI: config.javaURI,
                fetchOptions: config.fetchOptions,
                gameContainer: document.getElementById("gameContainer"),
                gameCanvas: document.getElementById("gameCanvas"),
                gameLevelClasses: gameLevelClasses
            };

            FinTech.main(environment);
        } catch (error) {
            console.error("Fortune Finders startup error:", error);
            showStartupError(error);
        }
    })();
</script>