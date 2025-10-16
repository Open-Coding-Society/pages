---
layout: opencs
title: Adventure Game
permalink: /gamify/adventureGame
---

<div id="gameContainer">
    <div id="promptDropDown" class="promptDropDown" style="z-index: 9999"></div>
    <canvas id='gameCanvas'></canvas>
</div>

<script type="module">
    // Adnventure Game assets locations
    import Game from "{{site.baseurl}}/assets/js/adventureGame/Game.js";
    import GameLevelWater from "{{site.baseurl}}/assets/js/adventureGame/GameLevelWater.js";
    import GameLevelDesert from "{{site.baseurl}}/assets/js/adventureGame/GameLevelDesert.js";
    import GameLevelEnd from "{{site.baseurl}}/assets/js/adventureGame/GameLevelEnd.js";
    import GameLevelOverworld from "{{site.baseurl}}/assets/js/adventureGame/GameLevelOverworld.js";
    import { pythonURI, javaURI, fetchOptions } from '{{site.baseurl}}/assets/js/api/config.js';

    const gameLevelClasses = [GameLevelDesert, GameLevelEnd, GameLevelOverworld];

    const instructionsStyle = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(0, 0, 0, 0.9);
        color: white;
        padding: 30px;
        border-radius: 15px;
        z-index: 1000;
        max-width: 600px;
        width: 90%;
        font-family: 'Press Start 2P', cursive;
        border: 3px solid #f5c207;
        box-shadow: 0 0 20px rgba(245, 194, 7, 0.5);
    `;

    // Create the content
    const instructionsHTML = `
        <h2 style="color: #f5c207; margin-bottom: 15px; text-align: center;">Welcome!</h2>
        <div style="margin-bottom: 15px;">
            <h3 style="color: #f5c207;">Controls:</h3>
            <p>• WASD - Move</p>
            <p>• E/U - Interact with NPCs</p>
            <p>• ESC - Exit mini-games</p>
        </div>
        <div style="margin-bottom: 15px;">
            <h3 style="color: #f5c207;">NPCs:</h3>
            <p>• Robot - Meteor Blaster game</p>
            <p>• R2D2 - Star Wars game</p>
            <p>• Tux/Octocat - Quizzes</p>
            <p>• Stock Guy - Stock Market</p>
            <p>• Bitcoin - Casino</p>
        </div>
        <div style="text-align: center;">
            <button id="startGameBtn" style="
                background: #f5c207;
                color: black;
                border: none;
                padding: 8px 16px;
                border-radius: 5px;
                cursor: pointer;
                font-family: 'Press Start 2P', cursive;
                font-size: 12px;
                transition: all 0.3s ease;
            ">Start Game</button>
        </div>
    `;

    // Web Server Environment data
    const environment = {
        path:"{{site.baseurl}}",
        pythonURI: pythonURI,
        javaURI: javaURI,
        fetchOptions: fetchOptions,
        gameContainer: document.getElementById("gameContainer"),
        gameCanvas: document.getElementById("gameCanvas"),
        instructionsStyle: instructionsStyle,
        instructionsHTML: instructionsHTML,
        gameLevelClasses: gameLevelClasses

    }
    // Launch Adventure Game
    Game.main(environment);
</script>
