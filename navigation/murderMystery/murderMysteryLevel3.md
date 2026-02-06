---
layout: opencs
title: Mansion Level 3
permalink: /murdermystery3
microblog: true
---

<div id="gameContainer" style="position: relative;">
    <div id="promptDropDown" class="promptDropDown" style="z-index: 9999"></div>
    <canvas id='gameCanvas'></canvas>
</div>

<script type="module">
    // Mansion Game assets locations (use central core + GameControl)
    import Core from "{{site.baseurl}}/assets/js/murderMysteryGame/murderMysteryGameLogic/Game.js";
    import GameControl from "{{site.baseurl}}/assets/js/murderMysteryGame/murderMysteryGameLogic/GameControl.js";
    import { initCheats } from "{{site.baseurl}}/assets/js/murderMysteryGame/cheats.js";
    import GameLevel3 from "{{site.baseurl}}/assets/js/murderMysteryGame/mansionLevel3.js";
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
    // Launch Mansion Game using the central core and mansion GameControl
    const game = Core.main(environment, GameControl);
    
    // Initialize cheats/navigation buttons
    initCheats(game);
</script>