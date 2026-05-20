---
layout: opencs
title: Our game 
permalink: /TestGame
---

<div id="gameContainer">
    <div id="promptDropDown" class="promptDropDown" style="z-index: 9999"></div>
    <!-- GameEnv will create canvas dynamically -->
</div>

<script type="module">
    // Adnventure Game assets locations
    import Core from "{{site.baseurl}}/assets/js/GameEnginev1.1/essentials/Game.js";
    import GameControl from "{{site.baseurl}}/assets/js/GameEnginev1.1/essentials/GameControl.js";
    import GameLevelprologue from "{{site.baseurl}}/assets/js/projects/teamtestgame/levels/GameLevelprologue.js";
    import GameLeveltest from "{{site.baseurl}}/assets/js/projects/teamtestgame/levels/GameLeveltest.js";
    import GameLevel2 from "{{site.baseurl}}/assets/js/projects/teamtestgame/levels/GameLevel2.js";
    import GameLevelfinal from "{{site.baseurl}}/assets/js/projects/teamtestgame/levels/GameLevelfinal.js";
    import Leaderboard from "{{site.baseurl}}/assets/js/GameEnginev1.1/essentials/Leaderboard.js";


    import { pythonURI, javaURI, fetchOptions } from '{{site.baseurl}}/assets/js/api/config.js';

    const gameLevelClasses = [GameLevelprologue, GameLeveltest, GameLevel2, GameLevelfinal];

    // Web Server Environment data
    const environment = {
        path:"{{site.baseurl}}",
        gameName: "TestGame",
        pythonURI: pythonURI,
        javaURI: javaURI,
        fetchOptions: fetchOptions,
        gameContainer: document.getElementById("gameContainer"),
        gameLevelClasses: gameLevelClasses,
        disableAutoLeaderboard: true

    }
    // Launch Adventure Game using the central core and adventure GameControl
    const game = Core.main(environment, GameControl);
    const leaderboard = new Leaderboard(game.gameControl, {
        gameName: environment.gameName,
        javaURI: environment.javaURI,
        fetchOptions: environment.fetchOptions,
        initiallyHidden: false
    });
    window.leaderboardInstance = leaderboard;
</script>
