---
layout: base
title: Adventure Game
permalink: /gamify/end
---

<div id="gameContainer">
    <div id="promptDropDown" class="promptDropDown" style="z-index: 9999"></div>
    <canvas id='gameCanvas'></canvas>
</div>

<script type="module">
    // Adnventure Game assets locations
    import Game from "{{site.baseurl}}/assets/js/adventureGame/Game.js";
    import GameLevelEnd from "{{site.baseurl}}/assets/js/adventureGame/GameLevelEnd.js";
    import { pythonURI, javaURI, fetchOptions } from '{{site.baseurl}}/assets/js/api/config.js';

    const gameLevelClasses = [GameLevelEnd];

    const instructionsStyle = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: linear-gradient(135deg, black, purple);
        color: white;
        padding: 30px;
        border-radius: 15px;
        z-index: 1000;
        max-width: 600px;
        width: 90%;
        font-family: 'Press Start 2P', cursive;
        border: 3px solid purple;
        box-shadow: 0 0 20px rgba(128, 0, 128, 0.5);
    `;

    const instructionsHTML = `
        <h2 style="color: purple; margin-bottom: 15px; text-align: center;">Welcome to the END!!!!</h2>
        <div style="margin-bottom: 15px;">
            <h3 style="color: purple;">Controls:</h3>
            <p>• WASD - Move (Steve)</p>
            <p>• IJKL - Move (Alex)</p>
            <p>• E/U - Interact with NPCs</p>
            <p>• ESC - Exit mini-games/End the level (no pun intended)</p>
        </div>
        <div style="margin-bottom: 15px;">
            <h3 style="color: purple;">NPCs:</h3>
            <p>• Tux: ...</p>
        </div>
        <div style="text-align: center;">
            <button id="startGameBtn" style="
                background: purple;
                color: white;
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
    // Create the content

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
