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
    // Adventure Game assets locations (use AdventureGame wrapper + GameControl)
    import Game from "/assets/js/GameEnginev1.1/essentials/Game.js";
    import GameControl from "/assets/js/GameEnginev1.1/essentials/GameControl.js";
    import GameLevelBasic from "/assets/js/GameEnginev1.1/GameLevelBasic.js";
    import GameLevelBasicWater from "/assets/js/GameEnginev1.1/GameLevelBasicWater.js";
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
    // Launch Adventure Game using the central core and adventure GameControl
    Game.main(environment, GameControl);
</script>
