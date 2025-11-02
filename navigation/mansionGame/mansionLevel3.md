---
layout: opencs
title: Dungeon Escape - Level 3
permalink: /gamify/mansion3-restructured
microblog: true
---

<div id="gameContainer">
    <div id="promptDropDown" class="promptDropDown" style="z-index: 9999"></div>
    <canvas id='gameCanvas'></canvas>
</div>

<script type="module">
    // Adventure Game assets locations
    import Game from "{{site.baseurl}}/assets/js/mansionGame/GameEngine/Game.js";
    import MansionLevel3_Restructured from "{{site.baseurl}}/assets/js/mansionGame/mansionLevel3_Restructured.js";
    import { pythonURI, javaURI, fetchOptions } from '{{site.baseurl}}/assets/js/api/config.js';

    // Web Server Environment data
    const environment = {
        path:"{{site.baseurl}}",
        pythonURI: pythonURI,
        javaURI: javaURI,
        fetchOptions: fetchOptions,
        gameContainer: document.getElementById("gameContainer"),
        gameCanvas: document.getElementById("gameCanvas"),
        gameLevelClasses: [MansionLevel3_Restructured]
    }
    
    // Launch Adventure Game
    Game.main(environment);
</script>
