---
layout: opencs
title: Escape the Tower 
permalink: /gamify/escapethetower
---

<div id="gameContainer">
    <div id="promptDropDown" class="promptDropDown" style="z-index: 9999"></div>
    <!-- GameEnv will create canvas dynamically -->
</div>

<script type="module">
    // Adventure Game assets locations
    import Core from "{{site.baseurl}}/assets/js/GameEnginev1.1/essentials/Game.js";
    import GameControl from "{{site.baseurl}}/assets/js/GameEnginev1.1/essentials/GameControl.js";
    import GameLevelMaze from "{{site.baseurl}}/assets/js/GameEnginev1.1/GameLevelMaze.js";
    import GameLevelDoors from "{{site.baseurl}}/assets/js/GameEnginev1.1/GameLevelDoors.js";
    import GameLevelForest from "{{site.baseurl}}/assets/js/GameEnginev1.1/GameLevelForest.js";
    import { pythonURI, javaURI, fetchOptions } from '{{site.baseurl}}/assets/js/api/config.js';

    const gameLevelClasses = [GameLevelMaze, GameLevelDoors, GameLevelForest];

    // Web Server Environment data
    const environment = {
        path:"{{site.baseurl}}",
        pythonURI: pythonURI,
        javaURI: javaURI,
        fetchOptions: fetchOptions,
        gameContainer: document.getElementById("gameContainer"),
        gameLevelClasses: gameLevelClasses

    }
    // Launch Adventure Game using the central core and adventure GameControl
    Core.main(environment, GameControl);
</script>