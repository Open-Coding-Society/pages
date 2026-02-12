---
layout: opencs
title: Murder Mystery Game 
permalink: /gamify/murdermysteryL1S1
---

<div id="gameContainer">
    <div id="promptDropDown" class="promptDropDown" style="z-index: 9999"></div>
    <canvas id='gameCanvas'></canvas>
</div>

<script type="module">

    // Adnventure Game assets locations
    import Game from "/assets/js/GameEnginev1/essentials/Game.js";
    import MurderMysteryL1S1 from "/assets/js/murderMystery/MurderMysteryL1S1.js";
    import { pythonURI, javaURI, fetchOptions } from '/assets/js/api/config.js';

    const gameLevelClasses = [MurderMysteryL1S1];

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
    // Launch Adventure Game and keep the returned Game instance
    const game = Game.main(environment);

</script>
