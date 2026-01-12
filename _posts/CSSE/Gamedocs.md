---
title: Game Documentation
comments: false
toc: true
layout: tailwindPost
title: Documentation for changes made to the game
authors: Nikhil Ekambaram

---

<div class="flex items-center justify-center">
  <h1 class="text-center text-4xl font-bold text-gray-100">Game Documentation</h1>
</div>
<br />
<div class="mb-4 flex flex-col items-center justify-center space-y-4">
  <div class="flex w-1/2 max-w-sm items-center justify-center rounded bg-gray-400 drop-shadow-lg">
    <h2 class="text-center text-3xl font-semibold text-white">Addition 1: End Portal</h2>
  </div>
</div>
<p class="mb-4 font-medium text-gray-100">- The End Portal is a NPC located in GameLevelDesert that takes the player to GameLevelEnd</p>
<div class="mb-5 overflow-auto rounded-lg bg-gray-800 p-4 font-mono text-sm text-gray-200 drop-shadow-xl">
  <pre>
    <code>
        const sprite_src_endportal = path + "/images/gamify/exitportalfull.png"; // be sure to include the path
        const sprite_greet_endportal = "Teleport to the End? Press E";
        const sprite_data_endportal = {
        id: 'End Portal',
        greeting: sprite_greet_endportal,
        src: sprite_src_endportal,
        SCALE_FACTOR: 6,  // smaller = baller
        ANIMATION_RATE: 100,
        pixels: {width: 2029, height: 2025},
        INIT_POSITION: { x: (width * 2 / 5), y: (height * 1 / 10)}, // Adjusted position
        orientation: {rows: 1, columns: 1 },
        down: {row: 0, start: 0, columns: 1 },  // This is the stationary npc, down is default 
        }
      </code>
    </pre>
</div>

<p class="mb-4 font-medium text-gray-100">- This part is just standard code that lets the NPC be displayed with Mr. Mortensen's system</p>

<div class="mb-4 overflow-auto rounded-lg bg-gray-800 p-4 font-mono text-sm text-gray-200 drop-shadow-xl">
  <pre>
    <code>
      reaction: function() {
        alert(sprite_greet_endportal);
      },
      /* Interact function
       *  This function is called when the player interacts with the NPC
      *  It pauses the main game, creates a new GameControl instance with the End level,
      */
      interact: function() {
        // Set a primary game reference from the game environment
        let primaryGame = gameEnv.gameControl;
        // Define the game in game level
        let levelArray = [GameLevelEnd];
        // Define a new GameControl instance with the End level
        let gameInGame = new GameControl(gameEnv.game, levelArray);
        // Pause the primary game 
        primaryGame.pause();
        // Start the game in game
        gameInGame.start();
        // Setup "callback" function to allow transition from game in game to the underlying game
        gameInGame.gameOver = function() {
        // Call .resume on primary game
        primaryGame.resume();
        }
      }
      </code>
    </pre>
</div>

<p class="mb-4 font-medium text-gray-100">- The reaction: function displays a message on collision. <br />- The interact function creates a game-in-game instance which loads another gameControl instance and allows the player to complete the End level without losing their progress on the main game line.</p>

<div class="1/4 mb-4 flex items-center justify-center rounded bg-gray-400">
  <p class="font-medium text-gray-100">Now here's the full character code</p>
</div>
<div class="mb-4 overflow-auto rounded-lg bg-gray-800 p-4 font-mono text-sm text-gray-200 drop-shadow-xl">
  <pre>
    <code>
      const sprite_src_endportal = path + "/images/gamify/exitportalfull.png"; // be sure to include the path
      const sprite_greet_endportal = "Teleport to the End? Press E";
      const sprite_data_endportal = {
          id: 'End Portal',
          greeting: sprite_greet_endportal,
          src: sprite_src_endportal,
          SCALE_FACTOR: 6,  // smaller = baller
          ANIMATION_RATE: 100,
          pixels: {width: 2029, height: 2025},
          INIT_POSITION: { x: (width * 2 / 5), y: (height * 1 / 10)}, // Adjusted position
          orientation: {rows: 1, columns: 1 },
          down: {row: 0, start: 0, columns: 1 },  // This is the stationary npc, down is default 
          hitbox: { widthPercentage: 0.1, heightPercentage: 0.2 },
          /* Reaction function
          *  This function is called when the player collides with the NPC
          *  It displays an alert with the greeting message
          */
          reaction: function() {
            alert(sprite_greet_endportal);
          },
          /* Interact function
          *  This function is called when the player interacts with the NPC
          *  It pauses the main game, creates a new GameControl instance with the End level,
          */
          interact: function() {
            // Set a primary game reference from the game environment
            let primaryGame = gameEnv.gameControl;
            // Define the game in game level
            let levelArray = [GameLevelEnd];
            // Define a new GameControl instance with the End level
            let gameInGame = new GameControl(gameEnv.game, levelArray);
            // Pause the primary game 
            primaryGame.pause();
            // Start the game in game
            gameInGame.start();
            // Setup "callback" function to allow transition from game in game to the underlying game
            gameInGame.gameOver = function() {
              // Call .resume on primary game
              primaryGame.resume();
            }
          }
    
        };
      </code>
    </pre>
</div>
<br />
<div class="mb-4 flex flex-col items-center justify-center space-y-4">
  <div class="flex w-1/2 max-w-sm items-center justify-center rounded bg-gray-400 drop-shadow-lg">
    <h2 class="text-center text-3xl font-semibold text-white">Addition 2: Sprite-Based Movement Keys To Allow Two Player</h2>
  </div>
</div>
<p class="mb-4 font-medium text-gray-100">
  -Main problem with two player is that one set of keys controls both players when using one player file
  <br />- To solve this, we changed the player movement system to use key mappings from sprite data instead of hardcoded keys
</p>
<div class="mb-5 overflow-auto rounded-lg bg-gray-800 p-4 font-mono text-sm text-gray-200 drop-shadow-xl">
  <pre>
    <code>
        if (this.pressedKeys[this.keypress.up] && this.pressedKeys[this.keypress.left]) {
            this.velocity.y -= this.yVelocity;
            this.velocity.x -= this.xVelocity;
            this.direction = 'upLeft';
        } else if (this.pressedKeys[this.keypress.up] && this.pressedKeys[this.keypress.right]) {
            this.velocity.y -= this.yVelocity;
            this.velocity.x += this.xVelocity;
            this.direction = 'upRight';
        }
    </code>
  </pre>
</div>

<p class="mb-4 font-medium text-gray-100">- The code uses this.keypress properties (up, left, right, down) which are loaded from the sprite data instead of being hardcoded key values</p>

<div class="mb-4 overflow-auto rounded-lg bg-gray-800 p-4 font-mono text-sm text-gray-200 drop-shadow-xl">
  <pre>
    <code>
        else if (this.pressedKeys[this.keypress.down] && this.pressedKeys[this.keypress.left]) {
            this.velocity.y += this.yVelocity;
            this.velocity.x -= this.xVelocity;
            this.direction = 'downLeft';
        } else if (this.pressedKeys[this.keypress.down] && this.pressedKeys[this.keypress.right]) {
            this.velocity.y += this.yVelocity;
            this.velocity.x += this.xVelocity;
            this.direction = 'downRight';
        }
    </code>
  </pre>
</div>

<p class="mb-4 font-medium text-gray-100">- This approach makes player counts more scalable since key bindings can be changed in the sprite configuration<br />- The system still supports both cardinal and diagonal movement</p>
<div class="mb-4 overflow-auto rounded-lg bg-gray-800 p-4 font-mono text-sm text-gray-200 drop-shadow-xl">
  <pre>
    <code>
      this.classes = [
        { class: BackgroundParallax, data: image_data_parallax },  // Add parallax background first
        { class: GamEnvBackground, data: image_data_end },         // Then regular background
        { class: Player, data: sprite_data_chillguy },
        { class: Npc, data: sprite_data_tux },
        { class: Collectible, data: sprite_data_eye },
        { class: Player, data: sprite_data_alex }
      ];
    </code>
  </pre>
</div>
<p class="mb-4 font-medium text-gray-100">- This is where we instantiate the two players using the same class file</p>

<div class="1/4 mb-4 flex items-center justify-center rounded bg-gray-400">
  <p class="font-medium text-gray-100">Now, here's the full code</p>
</div>
<div class="mb-4 overflow-auto rounded-lg bg-gray-800 p-4 font-mono text-sm text-gray-200 drop-shadow-xl">
  <pre>
    <code>
        if (this.pressedKeys[this.keypress.up] && this.pressedKeys[this.keypress.left]) {
            this.velocity.y -= this.yVelocity;
            this.velocity.x -= this.xVelocity;
            this.direction = 'upLeft';
        } else if (this.pressedKeys[this.keypress.up] && this.pressedKeys[this.keypress.right]) {
            this.velocity.y -= this.yVelocity;
            this.velocity.x += this.xVelocity;
            this.direction = 'upRight';
        } else if (this.pressedKeys[this.keypress.down] && this.pressedKeys[this.keypress.left]) {
            this.velocity.y += this.yVelocity;
            this.velocity.x -= this.xVelocity;
            this.direction = 'downLeft';
        } else if (this.pressedKeys[this.keypress.down] && this.pressedKeys[this.keypress.right]) {
            this.velocity.y += this.yVelocity;
            this.velocity.x += this.xVelocity;
            this.direction = 'downRight';
        // Single key movements (left, right, up, down) 
        } else if (this.pressedKeys[this.keypress.up]) {
            this.velocity.y -= this.yVelocity;
            this.direction = 'up';
            this.moved = true;
        } else if (this.pressedKeys[this.keypress.left]) {
            this.velocity.x -= this.xVelocity;
            this.direction = 'left';
            this.moved = true;
        } else if (this.pressedKeys[this.keypress.down]) {
            this.velocity.y += this.yVelocity;
            this.direction = 'down';
            this.moved = true;
        } else if (this.pressedKeys[this.keypress.right]) {
            this.velocity.x += this.xVelocity;
            this.direction = 'right';
            this.moved = true;
        } else{
            this.moved = false;
        }
    </code>
  </pre>
</div>
<div class="mb-4 flex flex-col items-center justify-center space-y-4">
  <div class="flex w-1/2 max-w-sm items-center justify-center rounded bg-gray-400 drop-shadow-lg">
    <h2 class="text-center text-3xl font-semibold text-white">Addition 3: Custom Parallax Background</h2>
  </div>
</div>
<p class="mb-4 font-medium text-gray-100">- Implemented a custom parallax scrolling background using the BackgroundParallax file with our own custom image</p>

<p class="mb-4 font-medium text-gray-100">- We treat this just like any other sprite and set it up with its own data</p>

<div class="mb-4 overflow-auto rounded-lg bg-gray-800 p-4 font-mono text-sm text-gray-200 drop-shadow-xl">
  <pre>
    <code>
        velocity: 0.2,  // Slower velocity for a more subtle effect
        layer: 0,  // Explicitly set the layer to 0 (furthest back)
        zIndex: 1  // Use positive z-index but keep it low
    </code>
  </pre>
</div>

<p class="mb-4 font-medium text-gray-100">- The velocity is set to 0.2 for a slower scroll that isn't distracting<br />- We set the layer to 0 (furthest back) to put it behind all game elements<br />- The zIndex is kept at a low positive value to keep the render order</p>

<div class="1/4 mb-4 flex items-center justify-center rounded bg-gray-400">
  <p class="font-medium text-gray-100">Now, here's the full code</p>
</div>
<div class="mb-4 overflow-auto rounded-lg bg-gray-800 p-4 font-mono text-sm text-gray-200 drop-shadow-xl">
  <pre>
    <code>
        const image_src_parallax = path + "/images/gamify/parallaxbg.png";
        const image_data_parallax = {
            name: 'parallax_background',
            id: 'parallax-background',
            greeting: "A mysterious parallax effect in the background.",
            src: image_src_parallax,
            pixels: {height: 1140, width: 2460},
            position: { x: 0, y: 0 },
            velocity: 0.2,  // Slower velocity for a more subtle effect
            layer: 0,  // Explicitly set the layer to 0 (furthest back)
            zIndex: 1  // Use positive z-index but keep it low
        };
    </code>
  </pre>
</div>
