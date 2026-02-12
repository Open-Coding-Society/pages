---
layout: opencs
title: Murder Mystery Game 
permalink: /gamify/murdermystery
---

<div id="gameContainer">
    <div id="promptDropDown" class="promptDropDown" style="z-index: 9999"></div>
    <canvas id='gameCanvas'></canvas>
</div>

<script type="module">

    // Adnventure Game assets locations
    import Game from "/assets/js/GameEnginev1/essentials/Game.js";
    import MurderMysteryL1S1 from "/assets/js/murderMystery/MurderMysteryL1S1.js";
    import MurderMysteryL1 from "/assets/js/murderMystery/MurderMysteryL1.js";
    import MurderMysteryL2 from "/assets/js/murderMystery/MurderMysteryL2.js";
    import MurderMysteryL3 from "/assets/js/murderMystery/MurderMysteryL3.js";
    import MurderMysteryL4 from "/assets/js/murderMystery/MurderMysteryL4.js";
    import { pythonURI, javaURI, fetchOptions } from '/assets/js/api/config.js';

    const gameLevelClasses = [MurderMysteryL1S1, MurderMysteryL1, MurderMysteryL2, MurderMysteryL3, MurderMysteryL4];

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
