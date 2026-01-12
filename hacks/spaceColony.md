---
layout: opencs
title: Space Colony
permalink: /spaceColony
---

<style>
    body, html {
        margin: 0;
        padding: 0;
        height: 100%;
        width: 100%;
        overflow: hidden; /* Prevent scrolling */
    }
    
    main.page-content {
        padding: 0 !important;
        margin: 0 !important;
        max-width: none !important;
        width: 100% !important;
        position: relative;
    }
    
    #gameContainer {
        position: fixed;
        top: 60px; /* Adjust this to match your navbar height */
        left: 0;
        width: 100vw;
        height: calc(100vh - 60px); /* Full height minus navbar */
        margin: 0;
        padding: 0;
        background: black;
        overflow: hidden;
        z-index: 100; /* Ensure it's above other content including footer */
    }
    
    #gameCanvas {
        display: block;
        width: 100%;
        height: 100%;
        margin: 0;
        padding: 0;
    }
    
    .promptDropDown {
        position: absolute;
        z-index: 9999;
    }
</style>

<div id="gameContainer">
    <div id="promptDropDown" class="promptDropDown" style="z-index: 9999"></div>
    <canvas id='gameCanvas'></canvas>
</div>

<script src="{{site.baseurl}}/assets/js/spaceColony/Game.js"></script>