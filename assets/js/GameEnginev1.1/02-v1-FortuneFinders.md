---
layout: opencs
title: Fortune Finders
permalink: /gamify/fortuneFinders
---

<div id="gameContainer">
    <div id="promptDropDown" class="promptDropDown" style="z-index: 9999"></div>
    <canvas id='gameCanvas'></canvas>
</div>

<script type="module">
    // Adnventure Game assets locations
    import FinTech from "/assets/js/GameEnginev1.1/FinTech.js";
    import GameLevelAirport from "/assets/js/GameEnginev1.1/GameLevelAirport.js";
    import GameLevelWallstreet from "/assets/js/GameEnginev1.1/GameLevelWallstreet.js";
    import { pythonURI, javaURI, fetchOptions } from '{{site.baseurl}}/assets/js/api/config.js';

    const gameLevelClasses = [GameLevelAirport, GameLevelWallstreet];

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
    FinTech.main(environment);
</script>