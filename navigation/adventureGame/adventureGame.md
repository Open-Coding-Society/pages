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

    // Import PauseMenu TEST
    import PauseMenu from "{{site.baseurl}}/assets/js/mansionGame/ui/PauseMenu.js";
    
    // Adnventure Game assets locations
    import Game from "{{site.baseurl}}/assets/js/adventureGame/GameEngine/Game.js";
    import GameLevelWater from "{{site.baseurl}}/assets/js/adventureGame/GameLevelWater.js";
    import GameLevelDesert from "{{site.baseurl}}/assets/js/adventureGame/GameLevelDesert.js";
    import GameLevelEnd from "{{site.baseurl}}/assets/js/adventureGame/GameLevelEnd.js";
    import GameLevelOverworld from "{{site.baseurl}}/assets/js/adventureGame/GameLevelOverworld.js";
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

    // Instantiate the shared PauseMenu. The PauseMenu will register itself
    // with the game's GameControl so Escape will toggle the menu automatically.
    try {
        new PauseMenu(game.gameControl, { parentId: 'gameContainer' });
    } catch (err) {
        console.warn('PauseMenu could not be initialized on this page:', err);
    }
</script>
