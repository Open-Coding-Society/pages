---
layout: opencs
title: Mansion Level 1
permalink: /gamify/mansion1
microblog: true
---

<div id="gameContainer">
    <div id="promptDropDown" class="promptDropDown" style="z-index: 9999"></div>
    <canvas id='gameCanvas'></canvas>
</div>

<script type="module">
    // Mansion Game assets locations (use central core + GameControl)
    import Core from "{{site.baseurl}}/assets/js/GameEngine/Game.js";
    import GameControl from "{{site.baseurl}}/assets/js/mansionGame/GameEngine/GameControl.js";
    import { initCheats } from "{{site.baseurl}}/assets/js/mansionGame/GameEngine/cheats.js";
    import GameLevel1 from "{{site.baseurl}}/assets/js/mansionGame/mansionLevel1.js";
    import GameLevel2 from "{{site.baseurl}}/assets/js/mansionGame/mansionLevel2.js";
    import { pythonURI, javaURI, fetchOptions } from '{{site.baseurl}}/assets/js/api/config.js';

    // Web Server Environment data
	
    const environment = {
        path:"{{site.baseurl}}",
        pythonURI: pythonURI,
        javaURI: javaURI,
        fetchOptions: fetchOptions,
        gameContainer: document.getElementById("gameContainer"),
        gameCanvas: document.getElementById("gameCanvas"),
        gameLevelClasses: [GameLevel1, GameLevel2]

    }
    // Launch Mansion Game using the central core and mansion GameControl
    const game = Core.main(environment, GameControl);
    
    // Initialize cheats/navigation buttons
    initCheats(game);
</script>