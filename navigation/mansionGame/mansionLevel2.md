layout: opencs
title: Adventure Game
permalink: /gamify/mansion2
<div id="gameContainer">
    <div id="promptDropDown" class="promptDropDown" style="z-index: 9999"></div>
    <canvas id='gameCanvas'></canvas>
</div>
<script type="module">
    // Adnventure Game assets locations
    import Core from "{{site.baseurl}}/assets/js/GameEngine/Game.js";
    import GameControl from "{{site.baseurl}}/assets/js/mansionGame/GameEngine/GameControl.js";
    import GameLevel1 from "{{site.baseurl}}/assets/js/mansionGame/mansionLevel2.js";
    import { pythonURI, javaURI, fetchOptions } from '{{site.baseurl}}/assets/js/api/config.js';
    // Web Server Environment data
    const environment = {
        path:"{{site.baseurl}}",
        pythonURI: pythonURI,
        javaURI: javaURI,
        fetchOptions: fetchOptions,
        gameContainer: document.getElementById("gameContainer"),
        gameCanvas: document.getElementById("gameCanvas"),
        gameLevelClasses: [MansionLevel2]
    }
    // Launch Mansion Game using the central core and mansion GameControl
    Core.main(environment, GameControl);
</script>