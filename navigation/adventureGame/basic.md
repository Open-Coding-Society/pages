---
layout: opencs
title: Adventure Game
permalink: /gamify/basic
---

<div id="gameContainer">
    <div id="promptDropDown" class="promptDropDown" style="z-index: 9999"></div>
    <canvas id='gameCanvas'></canvas>
</div>

<script type="module">
    // Adnventure Game assets locations
    import Game from "{{site.baseurl}}/assets/js/adventureGame/GameEngine/Game.js";
    import GameLevelBasic from "{{site.baseurl}}/assets/js/adventureGame/GameLevelBasic.js";
    import GameLevelBasicWater from "{{site.baseurl}}/assets/js/adventureGame/GameLevelBasicWater.js";
    import { pythonURI, javaURI, fetchOptions } from '{{site.baseurl}}/assets/js/api/config.js';

    // Web Server Environment data
    const environment = {
        path:"{{site.baseurl}}",
        pythonURI: pythonURI,
        javaURI: javaURI,
        fetchOptions: fetchOptions,
        gameContainer: document.getElementById("gameContainer"),
        gameCanvas: document.getElementById("gameCanvas"),
        gameLevelClasses: [GameLevelBasic, GameLevelBasicWater]

    }
    // Launch Adventure Game
    Game.main(environment);
</script>
