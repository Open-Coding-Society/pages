---
layout: opencs
title: Platformer
permalink: /digital-famine/planets
---
 
<div id="gameContainer">
    <div id="promptDropDown" class="promptDropDown" style="z-index: 9999"></div>
    <canvas id='gameCanvas'></canvas>
</div>

<script type="module">
    import Core from "{{site.baseurl}}/assets/js/GameEngine/essentials/Game.js";
    import GameControl from "{{site.baseurl}}/assets/js/GameEngine/essentials/GameControl.js";
    import GameLevelHomePage from "{{site.baseurl}}/assets/js/digitalFamine/GameLevelHomePage.js";
    import { pythonURI, javaURI, fetchOptions } from '{{site.baseurl}}/assets/js/api/config.js';

    // Web Server Environment data
    const environment = {
        path:"{{site.baseurl}}",
        pythonURI: pythonURI,
        javaURI: javaURI,
        fetchOptions: fetchOptions,
        gameContainer: document.getElementById("gameContainer"),
        gameCanvas: document.getElementById("gameCanvas"),
        gameLevelClasses: [GameLevelHomePage]

    }
    // Launch Adventure Game using the central core and adventure GameControl
    Core.main(environment, GameControl);
</script>
