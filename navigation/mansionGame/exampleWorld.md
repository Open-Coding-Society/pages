---
layout: opencs
title: Mansion Game
permalink: /gamify/testWorld
---

<div id="gameContainer">
    <div id="promptDropDown" class="promptDropDown" style="z-index: 9999"></div>
    <canvas id='gameCanvas'></canvas>
</div>

<script type="module">
    // Mansion Game assets locations
    import Game from "{{site.baseurl}}/assets/js/mansionGame/GameEngine/Game.js";
    import { initCheats } from "{{site.baseurl}}/assets/js/mansionGame/GameEngine/cheats.js";
    import GameLevelMain from "{{site.baseurl}}/assets/js/mansionGame/mansionLevelMain.js";
    import GameLevel1 from "{{site.baseurl}}/assets/js/mansionGame/mansionLevel1.js";
    //import GameLevel2 from "{{site.baseurl}}/assets/js/mansionGame/mansionLevel2.js";
    //import GameLevel3 from "{{site.baseurl}}/assets/js/mansionGame/mansionLevel3.js";
    import GameLevel4 from "{{site.baseurl}}/assets/js/mansionGame/mansionLevel4.js";
    import GameLevel5 from "{{site.baseurl}}/assets/js/mansionGame/mansionLevel5.js";
    //import GameLevel6 from "{{site.baseurl}}/assets/js/mansionGame/mansionLevel6.js";
    import { pythonURI, javaURI, fetchOptions } from '{{site.baseurl}}/assets/js/api/config.js';

    const gameLevelClasses = [GameLevel1, GameLevel4, GameLevel5];
    //const gameLevelClasses = [GameLevel1, GameLevel2, GameLevel3, GameLevel4, GameLevel5, GameLevel6 ];

    // Web Server Environment data
    const environment = {
        path:"{{site.baseurl}}",
        pythonURI: pythonURI,
        javaURI: javaURI,
        fetchOptions: fetchOptions,
        gameContainer: document.getElementById("gameContainer"),
        gameCanvas: document.getElementById("gameCanvas"),
        gameLevelClasses: gameLevelClasses
        ,
        // Global photographic background for the entire game. Replace with your local image if desired.
        globalBackgroundData: {
            src: "{{site.baseurl}}/images/mansionGame/mansion_outside_photo.png",
            mode: 'cover',
            crossOrigin: 'anonymous'
        }

    }

    /*
    * All this logic below is required, you need to change Game.main(environment); to const game = Game.main(environment); just like it is below.
    * All other logic is controlled in the Cheats.js file.
    */
    
    // Launch Mansion Game
    const game = Game.main(environment);
    
    // Initialize cheats/debug features
    initCheats(game);
</script>