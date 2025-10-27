---
layout: opencs
title: Mansion Graveyard Level
permalink: /gamify/mansion
---

<div id="gameContainer">
    <div id="promptDropDown" class="promptDropDown" style="z-index: 9999"></div>
    <canvas id='gameCanvas'></canvas>
</div>

<script type="module">
    // Adventure Game assets locations
    import Game from "{{site.baseurl}}/assets/js/adventureGame/Game.js";
    import MansionLevel2 from "{{site.baseurl}}/assets/js/adventureGame/mansionLevel2.js";
    import { pythonURI, javaURI, fetchOptions } from '{{site.baseurl}}/assets/js/api/config.js';

    const gameLevelClasses = [MansionLevel2];

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
        border: 3px solid #8b0000;
        box-shadow: 0 0 20px rgba(139, 0, 0, 0.5);
    `;

    // Create the content
    const instructionsHTML = `
        <h2 style="color: #8b0000; margin-bottom: 15px; text-align: center;">Welcome to the Haunted Mansion!</h2>
        <div style="margin-bottom: 15px;">
            <h3 style="color: #8b0000;">Controls:</h3>
            <p>• WASD - Move</p>
            <p>• E/U - Interact with NPCs</p>
            <p>• ESC - Exit mini-games</p>
        </div>
        <div style="margin-bottom: 15px;">
            <p style="color: #ff6666;">Beware of the spirits in the graveyard...</p>
        </div>
        <div style="text-align: center;">
            <button id="startGameBtn" style="
                background: #8b0000;
                color: white;
                border: none;
                padding: 8px 16px;
                border-radius: 5px;
                cursor: pointer;
                font-family: 'Press Start 2P', cursive;
                font-size: 12px;
                transition: all 0.3s ease;
            ">Enter Mansion</button>
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
