---
layout: opencs
title: Mansion Level 5
permalink: /gamify/mansion5
microblog: true
---

<div id="gameContainer">
    <div id="promptDropDown" class="promptDropDown" style="z-index: 9999"></div>
    <canvas id='gameCanvas' width="800" height="600"></canvas>
</div>

<style>
html, body {
  margin: 0;
  padding: 0;
  overflow: hidden;
  width: 100%;
  height: 100%;
}
</style>

<script type="module">
    // Adnventure Game assets locations
    import Game from "{{site.baseurl}}/assets/js/mansionGame/GameEngine/Game.js";
    import MansionLevel5 from "{{site.baseurl}}/assets/js/mansionGame/mansionLevel5.js";
    import { pythonURI, javaURI, fetchOptions } from '{{site.baseurl}}/assets/js/api/config.js';

    // Web Server Environment data

    const environment = {
        path:"{{site.baseurl}}",
        pythonURI: pythonURI,
        javaURI: javaURI,
        fetchOptions: fetchOptions,
        gameContainer: document.getElementById("gameContainer"),
        gameCanvas: document.getElementById("gameCanvas"),
        gameLevelClasses: [MansionLevel5]

    }
    // Launch Adventure Game
    Game.main(environment);
</script>