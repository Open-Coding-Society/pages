---
toc: True
layout: post
title: Anatomy of RPG Game
description: A guide to using Javascript, and to learning how to build, edit and change the RPG game.
menu: nav/game_intro.html
permalink: /game/intro/anatomy
---

## Setting up RPG Game

This guide will walk you through the steps to set up and modify a starter [RPG Player Game]({{site.baseurl}}/images/rpg/turtle.png) as a demonstration.

> Download the assets to your personal instance of the `student_2025` repository.

Ensure that the code and assets are copied into the correct locations in your project for everything to work seamlessly.

- **_config.yml**: References `navigation/rpg.md` for navigation.
- **assets/js/rpg**: JavaScript files for the game.
- **images/rpg**: Images for background and sprite.
- **navigation/rpg.md**: File that loads the game.

### Game Starting Code (rpg.md)

Here are the highlights of this file:
- The `rpg.md` file is converted to HTML.
- All visuals of the game are rendered into the canvas (`<canvas></canvas>`).
- The script section performs two key functions:
    - Defines data for assets in the game.
    - Starts the game.

> Let's play with the game to see behavior differences by including assets.


```python
<canvas id='gameCanvas'></canvas>

<script type="module">
    import GameControl from '{{site.baseurl}}/assets/js/rpg/GameControl.js';

    // Background data
    const image_src = "{{site.baseurl}}/images/rpg/water.png";
    const image_data = {
        pixels: {height: 580, width: 1038}
    };
    const image = {src: image_src, data: image_data};

    // Sprite data
    const sprite_src = "{{site.baseurl}}/images/rpg/turtle.png";
    const sprite_data = {
        SCALE_FACTOR: 10,
        STEP_FACTOR: 1000,
        ANIMATION_RATE: 50,
        pixels: {height: 280, width: 256},
        orientation: {rows: 4, columns: 3 },
        down: {row: 0, start: 0, columns: 3 },
        left: {row: 1, start: 0, columns: 3 },
        right: {row: 2, start: 0, columns: 3 },
        up: {row: 3, start: 0, columns: 3 },
    };
    const sprite = {src: sprite_src, data: sprite_data};

    // Uncomment 1 of the 4 lines to change assets being used
    //const assets = {}
    //const assets = {image: image}
    //const assets = {sprite: sprite}
    const assets = {image: image, sprite: sprite}

    // Start game engine
    GameControl.start(assets);
</script>
```

## Using Object Oriented Programming 

### Game Control (assets/js/rpg/GameControl.js)

This code uses the JavaScript **object literal pattern** to centralize control logic. This pattern allows key events to be concise and managed in one location.

> Review central logic of the game

- **start**: Code that starts the game.
- **gameLoop**: Recursive code that keeps the game running.
- **resize**: Code that adjusts the game when you resize the screen, demonstrating dynamic sizing.


```python
import GameEnv from './GameEnv.js';
import Background from './Background.js';
import Player from './Player.js';

/**
 * The GameControl object manages the game.
 * 
 * This code uses the JavaScript "object literal pattern" which is nice for centralizing control logic.
 * 
 * The object literal pattern is a simple way to create singleton objects in JavaScript.
 * It allows for easy grouping of related functions and properties, making the code more organized and readable.
 * In the context of GameControl, this pattern helps centralize the game's control logic, 
 * making it easier to manage game states, handle events, and maintain the overall flow of the game.
 * 
 * @type {Object}
 * @property {Player} player - The player object.
 * @property {function} start - Initialize game assets and start the game loop.
 * @property {function} gameLoop - The game loop.
 * @property {function} resize - Resize the canvas and player object when the window is resized.
 */
const GameControl = {

    start: function(assets = {}) {
        GameEnv.create(); // Create the Game World, this is pre-requisite for all game objects.
        this.background = new Background(assets.image || null);
        this.player = new Player(assets.sprite || null);
        this.gameLoop();
    },

    gameLoop: function() {
        GameEnv.clear(); // Clear the canvas
        this.background.draw();
        this.player.update();
        requestAnimationFrame(this.gameLoop.bind(this));
    },

    resize: function() {
        GameEnv.resize(); // Adapts the canvas to the new window size, ie a new Game World.
        this.player.resize();
    }
};

// Detect window resize events and call the resize function.
window.addEventListener('resize', GameControl.resize.bind(GameControl));

export default GameControl;
```

### Game Environment (assets/js/rpg/GameEnv.js)

`GameEnv` is a static class that manages the game environment. This code uses a **classic Java static class pattern**, which is effective for managing centralized data.

> Review JavaScript `GameEnv` properties used to manage the canvas and context (`ctx`)

- Creation of the canvas.
- Usage of `<header>` and `<footer>` tags to size the canvas.
- Size and resize methods that define canvas properties.


```python
/**
 * GameEnv is a static class that manages the game environment.
 * 
 * The focus of the file is the canvas management and the calculation of the game area dimensions. 
 * All calculations are based on the window size, header, and footer.
 * 
 * This code uses a classic Java static class pattern, which is nice for managing centralized data.
 * 
 * The static class pattern ensures that there is only one instance of the game environment,
 * providing a single point of reference for all game objects. This approach helps maintain
 * consistency and simplifies the management of shared resources like the canvas and its dimensions.
 * 
 * @class GameEnv
 * @property {Object} canvas - The canvas element.
 * @property {Object} ctx - The 2D rendering context of the canvas.
 * @property {number} innerWidth - The inner width of the game area.
 * @property {number} innerHeight - The inner height of the game area.
 * @property {number} top - The top offset of the game area.
 * @property {number} bottom - The bottom offset of the game area.
 */
class GameEnv {
    static canvas;
    static ctx;
    static innerWidth;
    static innerHeight;
    static top;
    static bottom;

    /**
     * Private constructor to prevent instantiation.
     * 
     * @constructor
     * @throws {Error} Throws an error if an attempt is made to instantiate the class.
     */
    constructor() {
        throw new Error('GameEnv is a static class and cannot be instantiated.');
    }

    /**
     * Create the game environment by setting up the canvas and calculating dimensions.
     * 
     * This method sets the canvas element, calculates the top and bottom offsets,
     * and determines the inner width and height of the game area. It then sizes the canvas
     * to fit within the calculated dimensions.
     * 
     * @static
     */
    static create() {
        this.setCanvas();
        this.setTop();
        this.setBottom();
        this.innerWidth = window.innerWidth;
        this.innerHeight = window.innerHeight - this.top - this.bottom;
        this.size();
    }

    /**
     * Sets the canvas element and its 2D rendering context.
     * 
     * @static
     */
    static setCanvas() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
    }

    /**
     * Sets the top offset based on the height of the header element.
     * 
     * @static
     */
    static setTop() {
        const header = document.querySelector('header');
        this.top = header ? header.offsetHeight : 0;
    }

    /**
     * Sets the bottom offset based on the height of the footer element.
     * 
     * @static
     */
    static setBottom() {
        const footer = document.querySelector('footer');
        this.bottom = footer ? footer.offsetHeight : 0;
    }

    /**
     * Sizes the canvas to fit within the calculated dimensions.
     * 
     * @static
     */
    static size() {
        this.canvas.width = this.innerWidth;
        this.canvas.height = this.innerHeight;
        this.canvas.style.width = `${this.innerWidth}px`;
        this.canvas.style.height = `${this.innerHeight}px`;
        this.canvas.style.position = 'absolute';
        this.canvas.style.left = '0px';
        this.canvas.style.top = `${this.top}px`;
    }

    /**
     * Resizes the game environment by re-creating it.
     * 
     * @static
     */
    static resize() {
        this.create();
    }

    /**
     * Clears the canvas.
     * 
     * This method clears the entire canvas, making it ready for the next frame.
     * 
     * @static
     */
    static clear() {
        this.ctx.clearRect(0, 0, this.innerWidth, this.innerHeight);
    }
}

export default GameEnv;
```

### Classic Object Oriented Programming

Object Oriented Programming is a model of programming which **creates 'objects' from code that is called ' class'**. Specific data, parameters are sent to the **class constructor** which defines an instance of the class, an object. The classes are essentially 'blueprints', which can be used to create one or more instances of the same class. This makes code easy to reuse, but data is still very specific to needs.

> Review OOP classes in RPG Game Project

**assets/js/rpg/Backgroud.js** - Creates the background.
**assets/js/rpg/Player.js** -- Creates the player.


```python
import GameEnv from './GameEnv.js';

export class Background {
    constructor(imageSrc = null) {
        if (imageSrc) {
            this.image = new Image();
            this.image.src = imageSrc.src;
        } else {
            this.image = null;
        }
    }

    /* To draws are used to capture primary frame and wrap around to next frame
     * x to y is primary draw
     * x + width to y is wrap around draw
    */
    draw() {
        const ctx = GameEnv.ctx;
        const width = GameEnv.innerWidth;
        const height = GameEnv.innerHeight;

        if (this.image) {
            // Draw the background image scaled to the canvas size
            ctx.drawImage(this.image, 0, 0, width, height);
        } else {
            // Fill the canvas with white if no background image is provided
            ctx.fillStyle = '#87CEEB';
            ctx.fillRect(0, 0, width, height);
        }
    }
}

export default Background;
```
