---
layout: opencs
title: Java UI v1.0
description: Build a landing page specifically for Java Users
image: /images/platformer/backgrounds/home.png
permalink: /javaUI
---

<!-- Syle is now located, as of Jan 2024 v2.0, in _sass/minima/dracula/platformer-styles.scss -->

<!-- DOM Settings Panel (sidebar id and div), managed by SettingsContro.js -->
<div id="sidebar" class="sidebar" style="z-index: 9999">
    <a href="javascript:void(0)" id="sidebar-header">&times; Settings</a>
  </div>
  <div id="leaderboardDropDown" class="leaderboardDropDown" style="z-index: 9999">
    <!-- <a href="javascript:void(0)" id="leaderboard-header">&times; Leaderboard</a> -->
  </div>

  <!-- Wrap both the controls and gameplay in a container div -->
  <div id="canvasContainer">
        <div class="submenu">
        <div class="submenu-item"> <!-- Controls -->
            <button id="settings-button">Settings</button>
        </div>
        <div class="submenu-item"> <!-- Controls -->
            <button id="leaderboard-button">Database</button>
        </div>
        </div>
        <!-- JavaScript-generated canvas items are inserted here -->
    </div>
  
  <script type="module">
      // Imports to drive game
      import GameEnv from '{{site.baseurl}}/assets/js/javaUI/GameEnv.js';
      import GameSetup from '{{site.baseurl}}/assets/js/javaUI/GameSetup.js';
      import GameControl from '{{site.baseurl}}/assets/js/javaUI/GameControl.js';
      import SettingsControl from '{{site.baseurl}}/assets/js/javaUI/SettingsControl.js';
      /* 
       * ==========================================
       * ========== Game Setup ====================
       * ==========================================
       * Game Setup prepares the Game Levels and Objects
       * 1.) There are one-to-many GameLevels in a Game
       * 2.) Each GameLevel has one-to-many GameObjects
       * ==========================================
      */
  
      // Setup game data, the objects and levels
      GameSetup.initLevels("{{site.baseurl}}");   
      /* 
       * ==========================================
       * ========== Game Control ==================
       * ==========================================
       * Game Control starts the game loop and activates game objects
       * 1.) GameControl cycles through GameLevels
       * 2.) Each GameLevel is on a looping timer, called within the game loop 
       * 3.) The game loop allows the game player (user), to interact with the game objects 
       * 4.) A timer (or score) tracks the time of user interaction within the game
       * ==========================================
      */
  
      // Start the PRIMARY game loop
     GameControl.gameLoop();
  
      /* 
      * ==========================================
      * ========== Settings Control ==============
      * ==========================================
      * Settings Control provides the ability to select game level and change game settings
      * 1.) SettingsControl must be after GameControl, it depends on GameLevels 
      * 2.) GameControl extends and implements LocalStorage to support the persistence of user data
      * 3.) Modifications can be made to User ID, GameSpeed, Gravity, and Invert(ing) screen color
      * ==========================================
      */
  
      // Construct settings sidebar, MVC variable paradigm, and async events to trigger user interaction
      SettingsControl.sidebar();

      /* 
       * ==========================================
       *  ========== Event / Listeners =============
       *  ==========================================
       * System Event listeners
       * 1.) Window resize and GameEnv.resize trigger system updates
       * 2.) Most event listeners remain near impacting functions
       * ==========================================
      */
  
      // Game refresh is required when the height and width of the screen are impacted
      window.addEventListener('resize', GameEnv.resize);
  
  </script>
