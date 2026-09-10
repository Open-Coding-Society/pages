---
layout: opencs
title: Murder Mystery Game 
permalink: /gamify/murderMystery
---

<div id="gameContainer">
    <div id="promptDropDown" class="promptDropDown" style="z-index: 9999"></div>
    <canvas id='gameCanvas'></canvas>
</div>

<script type="module">

    // Adventure Game assets locations
    import Game from "/assets/js/GameEnginev1/essentials/Game.js";
    import MurderMysteryL0 from "/assets/js/murderMystery/MurderMysteryL0.js";
    import MurderMysteryL1 from "/assets/js/murderMystery/MurderMysteryL1.js";
    import MurderMysteryL2 from "/assets/js/murderMystery/murderMysteryL2.js";
    import MurderMysteryL3 from "/assets/js/murderMystery/MurderMysteryL3.js";
    import MurderMysteryL4 from "/assets/js/murderMystery/MurderMysteryL4.js";
    import MurderMysteryL5 from "/assets/js/murderMystery/MurderMysteryL5.js";
    import MurderMysteryL6 from "/assets/js/murderMystery/MurderMysteryL6.js";
    import { pythonURI, javaURI, fetchOptions } from '/assets/js/api/config.js';

    const gameLevelClasses = [MurderMysteryL0, MurderMysteryL1, MurderMysteryL2, MurderMysteryL3, MurderMysteryL4, MurderMysteryL5, MurderMysteryL6];

    // Web Server Environment datas
    const environment = {
        path: "{{site.baseurl}}",
        pythonURI: pythonURI,
        javaURI: javaURI,
        fetchOptions: fetchOptions,
        gameContainer: document.getElementById("gameContainer"),
        gameCanvas: document.getElementById("gameCanvas"),
        gameLevelClasses: gameLevelClasses,
        // Game UI configuration
        gameUI: {
            showNavigation: true,
            showLevelSelect: true,
            showInfo: true,
            homeUrl: "/gamify/murderMystery",
            gameInfo: {
                title: "Murder Mystery Game",
                version: "1.0",
                developer: "DNHS CSSE Feb 2026",
                controls: "Use WASD keys to move your character."
            }
        }
    }

    // Launch Adventure Game
    const game = Game.main(environment);
</script>