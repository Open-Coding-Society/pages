---
layout: opencs
title: Our game
permalink: /astronaut-platformer-game
---

<div id="gameContainer">
    <div id="promptDropDown" class="promptDropDown" style="z-index: 9999"></div>
    <!-- GameEnv will create canvas dynamically -->
</div>

<script type="module">
    // Adventure Game assets locations
    import Core from "@assets/js/GameEnginev1.1/essentials/Game.js";
    import GameControl from "@assets/js/GameEnginev1.1/essentials/GameControl.js";
    import GameLevelprologue from "@assets/js/projects/astronaut-platformer-game/levels/GameLevelprologue.js";
    import GameLeveltest from "@assets/js/projects/astronaut-platformer-game/levels/GameLeveltest.js";
    import GameLevel2 from "@assets/js/projects/astronaut-platformer-game/levels/GameLevel2.js";
    import GameLevelfinal from "@assets/js/projects/astronaut-platformer-game/levels/GameLevelfinal.js";
    import Leaderboard from "@assets/js/GameEnginev1.1/essentials/Leaderboard.js";

    import { pythonURI, javaURI, fetchOptions } from "@assets/js/api/config.js";

    const gameLevelClasses = [GameLevelprologue, GameLeveltest, GameLevel2, GameLevelfinal];

    const environment = {
        path: "{{site.baseurl}}",
        gameName: "astronaut-platformer-game",
        pythonURI: pythonURI,
        javaURI: javaURI,
        fetchOptions: fetchOptions,
        gameContainer: document.getElementById("gameContainer"),
        gameLevelClasses: gameLevelClasses,
        disableAutoLeaderboard: true
    };

    const game = Core.main(environment, GameControl);
    const leaderboard = new Leaderboard(game.gameControl, {
        gameName: environment.gameName,
        javaURI: environment.javaURI,
        fetchOptions: environment.fetchOptions,
        initiallyHidden: false
    });
    window.leaderboardInstance = leaderboard;
</script>
