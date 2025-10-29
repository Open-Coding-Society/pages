---
layout: opencs
title: Adventure Game
permalink: /gamify/mansion3
---

<div id="gameContainer">
    <div id="promptDropDown" class="promptDropDown" style="z-index: 9999"></div>
    <canvas id='gameCanvas'></canvas>
</div>

<script type="module">
    import Game from "{{site.baseurl}}/assets/js/mansionGame/GameEngine/Game.js";
    import GameLevel3 from "{{site.baseurl}}/assets/js/mansionGame/mansionLevel3.js";
    import { pythonURI, javaURI, fetchOptions } from '{{site.baseurl}}/assets/js/api/config.js';

    const environment = {
        path: "{{site.baseurl}}",
        pythonURI,
        javaURI,
        fetchOptions,
        gameContainer: document.getElementById("gameContainer"),
        gameCanvas: document.getElementById("gameCanvas"),
        gameLevelClasses: [GameLevel3]
    };

    Game.main(environment);
</script>
