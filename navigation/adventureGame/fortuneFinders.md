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
    import FinTech from "{{site.baseurl}}/assets/js/adventureGame/FinTech.js";
    import GameLevelAirport from "{{site.baseurl}}/assets/js/adventureGame/GameLevelAirport.js";
    import GameLevelWallstreet from "{{site.baseurl}}/assets/js/adventureGame/GameLevelWallstreet.js";
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