---
layout: opencs
title: Adventure Game
permalink: /gamify/adventureGame
---

<div id="gameContainer">
    <div id="promptDropDown" class="promptDropDown" style="z-index: 9999"></div>
    <canvas id='gameCanvas'></canvas>
</div>

<script type="module">
    // Adnventure Game assets locations
    import Game from "{{site.baseurl}}/assets/js/adventureGame/GameEngine/Game.js";
    import GameLevelWater from "{{site.baseurl}}/assets/js/adventureGame/GameLevelWater.js";
    import GameLevelDesert from "{{site.baseurl}}/assets/js/adventureGame/GameLevelDesert.js";
    import GameLevelEnd from "{{site.baseurl}}/assets/js/adventureGame/GameLevelEnd.js";
    import GameLevelOverworld from "{{site.baseurl}}/assets/js/adventureGame/GameLevelOverworld.js";
    
    // Import PauseMenu TEST
    import PauseMenu from "{{site.baseurl}}/assets/js/mansionGame/ui/PauseMenu.js";
    import { pythonURI, javaURI, fetchOptions } from '{{site.baseurl}}/assets/js/api/config.js';

    const gameLevelClasses = [GameLevelDesert, GameLevelWater, GameLevelEnd, GameLevelOverworld ];

    // Web Server Environment data
    const environment = {
        path:"{{site.baseurl}}",
        pythonURI: pythonURI,
        javaURI: javaURI,
        fetchOptions: fetchOptions,
        gameContainer: document.getElementById("gameContainer"),
        gameCanvas: document.getElementById("gameCanvas"),
        gameLevelClasses: gameLevelClasses

    }
    // Launch Adventure Game and keep the returned Game instance
    const game = Game.main(environment);

    // Instantiate the shared PauseMenu and wire a simple Escape toggle here
    // (the PauseMenu module contains show/hide/restart/exit behavior)
    try {
        const pauseMenu = new PauseMenu(game.gameControl, { parentId: 'gameContainer' });

        // Toggle the menu with Escape: open when closed, close when open
        document.addEventListener('keydown', (e) => {
            // ignore when typing in inputs
            const tag = e.target && e.target.tagName;
            if (tag === 'INPUT' || tag === 'TEXTAREA') return;
            if (e.key === 'Escape') {
                const isHidden = pauseMenu.container && pauseMenu.container.getAttribute('aria-hidden') === 'true';
                if (isHidden) {
                    pauseMenu.show();
                } else {
                    pauseMenu.hide();
                }
            }
        });
    } catch (err) {
        console.warn('PauseMenu could not be initialized on this page:', err);
    }
</script>
