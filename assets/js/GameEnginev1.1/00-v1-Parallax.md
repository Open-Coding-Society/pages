---
layout: opencs
title: RPG Baseline with Squares 
permalink: /gamify/parallax
---

<div id="gameContainer">
    <div id="promptDropDown" class="promptDropDown" style="z-index: 9999"></div>
    <canvas id='gameCanvas'></canvas>
</div>

<script type="module">
    // Adnventure Game assets locations
    import Core from "/assets/js/GameEnginev1.1/essentials/Game.js";
    import GameControl from "/assets/js/GameEnginev1.1/essentials/GameControl.js";
    import GameLevelParallaxFish from "/assets/js/GameEnginev1.1/GameLevelParallaxFish.js";
    import GameLevelParallaxStairs from "/assets/js/GameEnginev1.1/GameLevelParallaxStairs.js";
    import { pythonURI, javaURI, fetchOptions } from '{{site.baseurl}}/assets/js/api/config.js';

    const gameLevelClasses = [GameLevelParallaxFish, GameLevelParallaxStairs];

    // Web Server Environment data
    const environment = {
        path: "{{site.baseurl}}",
        pythonURI: pythonURI,
        javaURI: javaURI,
        fetchOptions: fetchOptions,
        gameContainer: document.getElementById("gameContainer"),
        gameCanvas: document.getElementById("gameCanvas"),
        gameLevelClasses: gameLevelClasses

    }
    // Launch Adventure Game using the central core and adventure GameControl
    Core.main(environment, GameControl);
</script>
