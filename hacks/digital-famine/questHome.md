---
layout: opencs
title: Platformer
permalink: /digital-famine/
---

<!-- Game Container -->
<div id="gameContainer" style="width: 100%; height: calc(100vh - 80px); display: flex; justify-content: center; align-items: center; background: black; margin: 0; padding: 0;">
    <div id="promptDropDown" class="promptDropDown" style="z-index: 9999;"></div>
    <canvas id="gameCanvas" style="width: 90%; height: auto; max-height: 90%; border: 2px solid #00ffcc; border-radius: 12px;"></canvas>
</div>

<!-- Footer for Planet Navigation Buttons -->
<footer id="masterFooter" style="position: fixed; bottom: 0; left: 0; right: 0; width: 100%; height: 80px; background: rgba(26, 26, 46, 0.95); padding: 15px 20px; box-sizing: border-box; border-top: 2px solid #00ffcc; z-index: 1000; backdrop-filter: blur(10px);">
    <!-- Navigation buttons will be inserted here by planetNavigation.js -->
</footer>

<!-- Remove any padding/margin that might create black space -->
<style>
    body {
        margin: 0 !important;
        padding: 0 !important;
    }
    #gameContainer {
        margin: 0 !important;
        padding: 0 !important;
        min-height: 0 !important;
    }
    /* Ensure footer is always visible */
    #masterFooter {
        display: block !important;
        visibility: visible !important;
        opacity: 1 !important;
        position: relative !important;
        z-index: 100 !important;
    }
    /* Remove any default spacing from the layout */
    .page-content, .wrapper {
        padding-bottom: 0 !important;
        margin-bottom: 0 !important;
    }
    /* Target the main content area */
    main, article {
        padding-bottom: 0 !important;
        margin-bottom: 0 !important;
    }
</style>

<!-- Game Script -->
<script type="module">
import Core from "{{ site.baseurl }}/assets/js/GameEngine/Game.js";
import GameControl from "{{ site.baseurl }}/assets/js/adventureGame/GameEngine/GameControl.js";
import GameLevelHomePage from "{{ site.baseurl }}/assets/js/digitalFamine/GameLevelHomePage.js";
import { pythonURI, javaURI, fetchOptions } from "{{ site.baseurl }}/assets/js/api/config.js";

const environment = {
    path: "{{ site.baseurl }}",
    pythonURI: pythonURI,
    javaURI: javaURI,
    fetchOptions: fetchOptions,
    gameContainer: document.getElementById("gameContainer"),
    gameCanvas: document.getElementById("gameCanvas"),
    gameLevelClasses: [GameLevelHomePage]
};

Core.main(environment, GameControl);
</script>
<!-- 6..7 -->