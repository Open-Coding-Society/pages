---
layout: opencs
title: Algorithm Arena - Sorting Algorithms
permalink: /gamify/algorithm-arena
---

<style>
#gameContainer { width: 100%; height: 85vh; margin: 0; position: relative; }
#gameContainer { background: #000; }
</style>

<div id="gameContainer">
    <div id="promptDropDown" class="promptDropDown" style="z-index: 9999"></div>
    <canvas id='gameCanvas'></canvas>
</div>

<script type="module">
    import Game from "{{site.baseurl}}/assets/js/GameEnginev1.1/essentials/Game.js";
    import GameLevelAlgorithmArena from "{{site.baseurl}}/assets/js/GameEnginev1.1/GameLevelAlgorithmArena.js";
    import { pythonURI, javaURI, fetchOptions } from '{{site.baseurl}}/assets/js/api/config.js';

    const gameLevelClasses = [GameLevelAlgorithmArena];

    const environment = {
        path: "{{site.baseurl}}",
        pythonURI: pythonURI,
        javaURI: javaURI,
        fetchOptions: fetchOptions,
        gameContainer: document.getElementById("gameContainer"),
        gameCanvas: document.getElementById("gameCanvas"),
        gameLevelClasses: gameLevelClasses
    }

    Game.main(environment);
</script>
