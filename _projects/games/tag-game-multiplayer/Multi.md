---
layout: opencs
title: Multiplayer
permalink: /sprintingsnails-multiplayer-game
socket_io: true
---


<div id="gameContainer">
    <div id="promptDropDown" class="promptDropDown" style="z-index: 9999"></div>
    <!-- GameEnv will create canvas dynamically -->
</div>


<script type="module">
    import Core from "{{site.baseurl}}/assets/js/GameEnginev1/essentials/Game.js";
    import GameControl from "{{site.baseurl}}/assets/js/GameEnginev1/essentials/GameControl.js";
    import GameLevelMultiplayer from "{{site.baseurl}}/assets/js/projects/multiplayer/levels/GameLevelMultiplayer.js";
    import { pythonURI, javaURI, fetchOptions } from '{{site.baseurl}}/assets/js/api/config.js';


    const gameLevelClasses = [GameLevelMultiplayer];


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


