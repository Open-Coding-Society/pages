---
layout: post 
title: Game Page Styling w/ Sass
description: 
author: 
hide: true
---

# Styling Game Pages with HTML, JS, and Sass

## 1. HTML Structure

HTML defines the **structure and elements** of your game page. Each element has a purpose, whether for rendering the game, showing scores, or providing interactive menus.

Example:

```html
<!-- Game Canvas: where the actual game graphics appear -->
<canvas id="gameCanvas" width="800" height="600"></canvas>

<!-- HUD (Heads-Up Display): shows player information like score and lives -->
<div class="hud">
  <div class="score">Score: 0</div>
  <div class="lives">Lives: 3</div>
</div>

<!-- Menu Overlay: start screen or settings menu -->
<div class="menu hidden">
  <h1>My Game</h1>
  <button id="startBtn">Start Game</button>
  <button id="settingsBtn">Settings</button>
</div>

<!-- Stylesheet -->
<link rel="stylesheet" href="styles.css">

<!-- JavaScript to handle game logic and UI -->
<script src="game.js"></script>
```

**Explanation of Elements:**

1. **`<canvas>`**

   * This is where the game renders graphics.
   * Width and height define the resolution.
   * The canvas acts like a “drawing board” that JavaScript can control.

2. **`.hud`**

   * Displays information on top of the canvas.
   * Could include score, lives, health bars, timers, or power-ups.
   * Styling ensures it floats over the canvas without affecting the game area.

3. **`.menu`**

   * Used for start screens, pause menus, or settings.
   * Initially hidden with the `hidden` class.
   * Contains interactive elements like buttons.

4. **`<link>` and `<script>`**

   * `link` includes the compiled CSS from Sass.
   * `script` loads the game logic and allows interactivity.

---

## 2. Styling with Sass

Sass adds **powerful features** to CSS like variables, nesting, and reusable components. This makes your game styling cleaner and easier to manage.

Example Sass (`styles.scss`):

```scss
// -----------------------
// Variables
// -----------------------
$primary-color: #0ff; // Main accent color
$secondary-color: #111; // Background color
$font: 'Press Start 2P', sans-serif; // Pixel-style font

// -----------------------
// Canvas Styles
// -----------------------
#gameCanvas {
  display: block;       // removes inline spacing
  margin: 0 auto;       // centers the canvas horizontally
  background: $secondary-color; // dark background for contrast
  border: 3px solid $primary-color; // frame around the game
}

// -----------------------
// HUD Styles
// -----------------------
.hud {
  position: absolute;    // floats above the canvas
  top: 10px; 
  left: 10px;
  color: $primary-color;
  font-family: $font;

  .score, .lives {
    background: rgba(0,0,0,0.7); // semi-transparent background
    padding: 5px 10px;
    border-radius: 8px;           // rounded corners
    margin-bottom: 5px;           // spacing between elements
  }
}

// -----------------------
// Menu Styles
// -----------------------
.menu {
  position: absolute;
  top: 0; left: 0;
  width: 100%; height: 100%;
  background: rgba(0,0,0,0.8);  // dark overlay
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;

  &.hidden {
    display: none;               // hide menu by default
  }

  h1 {
    font-family: $font;
    color: $primary-color;
    margin-bottom: 20px;
  }

  button {
    margin: 10px;
    padding: 12px 20px;
    font-family: $font;
    font-size: 16px;
    border: none;
    border-radius: 10px;
    background: $primary-color;
    color: $secondary-color;
    cursor: pointer;
    transition: 0.2s;

    &:hover {
      background: lighten($primary-color, 20%); // hover effect
    }
  }
}
```

**Explanation of Styling Choices:**

* **Variables** (`$primary-color`, `$secondary-color`)
  Makes it easy to change the game’s color scheme globally.

* **Canvas styling**
  Ensures the game area is centered and visually separated from UI overlays.

* **HUD styling**
  Uses **absolute positioning** so it doesn’t interfere with the canvas.
  Semi-transparent backgrounds make text readable but allow seeing the game behind it.

* **Menu styling**
  Full-screen overlay using flexbox for **centering**.
  Smooth hover transitions make buttons feel interactive.

---

## 3. Adding Interactivity with JavaScript

JavaScript allows the UI to **react to player input** and update dynamically.

```js
// Select elements
const menu = document.querySelector('.menu');
const startBtn = document.getElementById('startBtn');
const scoreDisplay = document.querySelector('.score');

// Start button logic
startBtn.addEventListener('click', () => {
  menu.classList.add('hidden'); // Hide the menu
  startGame();                   // Start the game loop
});

// Update score dynamically
let score = 0;
function updateScore(points) {
  score += points;
  scoreDisplay.textContent = `Score: ${score}`; // Update HUD
}

// Pause functionality (ESC key)
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    menu.classList.toggle('hidden'); // Show or hide menu
    pauseGame();
  }
});

// Example dummy functions
function startGame() { console.log("Game started!"); }
function pauseGame() { console.log("Game paused!"); }
```

**Explanation of JS Roles:**

1. **Menu toggling**
   `classList.add` / `toggle` controls visibility of menus.

2. **Dynamic HUD updates**
   Functions like `updateScore()` show how UI responds to game events.

3. **Keyboard input handling**
   Allows in-game controls to open menus, pause, or interact with the game.

4. **Separation of concerns**

   * Canvas handles rendering.
   * HUD handles player info.
   * Menu handles navigation.

---

## 4. Best Practices for Game Page Styling

1. **Overlay Management**
   HUD and menus should use `absolute` positioning above the canvas.

2. **Font Choice**
   Pixel fonts (`Press Start 2P`) give retro or arcade style.

3. **Color Scheme**
   Use high contrast for readability. Sass variables make it easy to tweak.

4. **Interactivity Feedback**
   Buttons should respond visually to hover or click.

5. **Responsive Layouts**
   Consider using `%`, `vh`, `vw` so HUD and menus scale with screen size.

6. **Animations**
   CSS transitions or keyframe animations make menus and notifications feel polished.