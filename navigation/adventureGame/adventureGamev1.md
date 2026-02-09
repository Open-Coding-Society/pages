---
layout: opencs
title: Adventure Game
permalink: /gamify/adventureGamev1
---

<style>
body {
    margin: 0;
    padding: 0;
}

#gameContainer {
    display: flex;
    justify-content: center;
    align-items: flex-start;
    width: 100%;
    padding-top: 20px;
    position: relative;
    background: #000;
}

#gameCanvas {
    display: block;
    max-width: 100%;
    height: auto;
}
</style>

<div id="gameContainer">
    <div id="promptDropDown" class="promptDropDown" style="z-index: 9999"></div>
    <canvas id='gameCanvas'></canvas>
</div>

<script type="module">

    // Adventure Game assets locations (use AdventureGame wrapper + GameControl)
    import Game from "{{site.baseurl}}/assets/js/GameEnginev1/Game.js";
    import GameControl from "{{site.baseurl}}/assets/js/GameEnginev1/GameControl.js";
    import GameLevelWater from "{{site.baseurl}}/assets/js/GameEnginev1/GameLevelWater.js";
    import GameLevelDesert from "{{site.baseurl}}/assets/js/GameEnginev1/GameLevelDesert.js";
    import GameLevelOverworld from "{{site.baseurl}}/assets/js/GameEnginev1/GameLevelOverworld.js";
    import { pythonURI, javaURI, fetchOptions } from '{{site.baseurl}}/assets/js/api/config.js';

    const gameLevelClasses = [GameLevelDesert, GameLevelWater, GameLevelOverworld ];

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
    // Launch Adventure Game using the central core and adventure GameControl
    const game = Game.main(environment, GameControl);

    // PauseMenu is auto-initialized by the game's Game module.
</script>
