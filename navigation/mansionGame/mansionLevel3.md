---
layout: opencs
title: Mansion Level 3
permalink: /gamify/mansion3
microblog: true
---

<div id="gameContainer">
    <div id="promptDropDown" class="promptDropDown" style="z-index: 9999"></div>
    <canvas id='gameCanvas'></canvas>
</div>

<script type="module">
    // Adventure Game assets locations
    import Game from "{{site.baseurl}}/assets/js/mansionGame/GameEngine/Game.js";
    import { initCheats } from "{{site.baseurl}}/assets/js/mansionGame/GameEngine/cheats.js";
    import GameLevel3 from "{{site.baseurl}}/assets/js/mansionGame/mansionLevel3.js";
    import { pythonURI, javaURI, fetchOptions } from '{{site.baseurl}}/assets/js/api/config.js';

    // Web Server Environment data
	
    const environment = {
        path:"{{site.baseurl}}",
        pythonURI: pythonURI,
        javaURI: javaURI,
        fetchOptions: fetchOptions,
        gameContainer: document.getElementById("gameContainer"),
        gameCanvas: document.getElementById("gameCanvas"),
        gameLevelClasses: [GameLevel3]

    }
    // Launch Adventure Game
    const game = Game.main(environment);
    
    // Initialize cheats/navigation buttons
    initCheats(game);
</script>