---
layout: opencs
title: Adventure Game
permalink: /gamify/adventureGamev1-1
---

<div id="gameContainer">
    <div id="promptDropDown" class="promptDropDown" style="z-index: 9999"></div>
    <canvas id='gameCanvas'></canvas>
</div>

<script type="module">

    // Adnventure Game assets locations
    import Game from "{{site.baseurl}}/assets/js/GameEnginev1.1/essentials/Game.js";
    import GameLevelWater from "{{site.baseurl}}/assets/js/GameEnginev1.1/GameLevelWater.js";
    import GameLevelDesert from "{{site.baseurl}}/assets/js/GameEnginev1.1/GameLevelDesert.js";
    import GameLevelEnd from "{{site.baseurl}}/assets/js/GameEnginev1.1/GameLevelEnd.js";
    import GameLevelOverworld from "{{site.baseurl}}/assets/js/GameEnginev1.1/GameLevelOverworld.js";
    import { pythonURI, javaURI, fetchOptions } from '{{site.baseurl}}/assets/js/api/config.js';

    // One-word switch: change only this word to swap leaderboard backend.
    // Options: 'python' | 'java'
    const leaderboardVariant = 'java';
    const leaderboardModule = await import("{{site.baseurl}}/assets/js/GameEnginev1.1/essentials/leaderboard.js");
    const Leaderboard = leaderboardModule.default || leaderboardModule;

    const gameLevelClasses = [ GameLevelDesert, GameLevelWater, GameLevelEnd, GameLevelOverworld ];

    // Web Server Environment data
    const environment = {
        path:"{{site.baseurl}}",
        pythonURI: pythonURI,
        javaURI: javaURI,
        fetchOptions: fetchOptions,
        gameContainer: document.getElementById("gameContainer"),
        gameCanvas: document.getElementById("gameCanvas"),
        gameLevelClasses: gameLevelClasses,
        leaderboardClass: Leaderboard,
        leaderboardOptions: {
            // Change to 'on' to show leaderboard by default.
            initialVisibility: 'off',
            // Keep backend in sync with the selected variant.
            backend: leaderboardVariant
        }

    }
    // Launch Adventure Game and keep the returned Game instance
    const game = Game.main(environment);

</script>
