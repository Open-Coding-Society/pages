---
layout: opencs
title: End Game
permalink: /gamify/end
---

<div id="gameContainer">
    <div id="promptDropDown" class="promptDropDown" style="z-index: 9999"></div>
    <canvas id='gameCanvas'></canvas>
</div>

<script type="module">
    // Adnventure Game assets locations
    import Game from "{{site.baseurl}}/assets/js/adventureGame/GameEngine/Game.js";
    import GameLevelEnd from "{{site.baseurl}}/assets/js/adventureGame/GameLevelEnd.js";
    import { pythonURI, javaURI, fetchOptions } from '{{site.baseurl}}/assets/js/api/config.js';

    const gameLevelClasses = [GameLevelEnd];

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

    // Launch Adventure Game
    Game.main(environment);
</script>
