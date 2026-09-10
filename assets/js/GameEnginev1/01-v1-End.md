---
layout: opencs
title: End Game
permalink: /gamify/end
---

<div id="gameContainer">
    <div id="promptDropDown" class="promptDropDown" style="z-index: 9999"></div>
    <!-- GameEnv will create canvas dynamically --> 
</div>

<script type="module">
    // Adnventure Game assets locations
    import Core from "/assets/js/GameEnginev1/essentials/Game.js";
    import GameControl from "/assets/js/GameEnginev1/essentials/GameControl.js";
    import GameLevelEnd from "/assets/js/GameEnginev1/GameLevelEnd.js";
    import { pythonURI, javaURI, fetchOptions } from '{{site.baseurl}}/assets/js/api/config.js';

    const gameLevelClasses = [GameLevelEnd];

    // Web Server Environment data
    const environment = {
        path: "{{site.baseurl}}",
        pythonURI: pythonURI,
        javaURI: javaURI,
        fetchOptions: fetchOptions,
        gameContainer: document.getElementById("gameContainer"),
        gameLevelClasses: gameLevelClasses
    }

    // Launch Adventure Game using the central core and adventure GameControl
    Core.main(environment, GameControl);
</script>
