---
toc: True
layout: post
title: Player
description: A guide to understand the Player.js algorithms.
menu: nav/game_intro.html
permalink: /game/intro/player
---

## Popcorn Hack

Provide example code from `Player.js` to define and and illustrate terms discussed in `Background.js`

> The `Player.js` has the same Object-Oriented definitions as Background.js

1. **Dependencies**

2. **Constructor**

3. **Attributes**

4. **Methods**

5. **Exports**

## Player and Algorithms

This remainder of the article will review the `Player.js` algoritmic code.

> **Encapsulation** of algorithmic code is a key reason to write int the Object-Oriented Programming style.


### Asynchronous Response to Keypress

A keypress is considered an event. Since the event is asynchronous to the `gameLoop`, the algorithm changes object-encapsulated data that alters the behavior of the player.

> Asynchronous events alter the object's encapsulated data.

```js
/**
     * Handles key down events to change the player's velocity.
     * 
     * This method updates the player's velocity based on the key pressed.
     * 
     * @param {Object} event - The keydown event object.
     */
    handleKeyDown({ keyCode }) {
        switch (keyCode) {
            case 87: // 'W' key
                this.velocity.y -= this.yVelocity;
                this.direction = 'up';
                break;
            case 65: // 'A' key
                this.velocity.x -= this.xVelocity;
                this.direction = 'left';
                break;
            case 83: // 'S' key
                this.velocity.y += this.yVelocity;
                this.direction = 'down';
                break;
            case 68: // 'D' key
                this.velocity.x += this.xVelocity;
                this.direction = 'right';
                break;
        }
    }
```

- **keyCode** - Identification data of the keypress event.
- **this.velocity** - An encapsulated variable in the player object that impacts speed.
- **this.direction** - An encapsulated variable that changes direction and changes the row for sprite animations.

### Asynchronous Response to Resize

A window resize is considered an event. This event typically occurs within the game environment. A `resize()` method definition is common for most objects, as the object knows what to do when its game environment is altered.

> The algorithm for resizing an object is adjusted proportionally to the game environment to stay in **scale**.

```js
/**
     * Resizes the player based on the game environment.
     * 
     * This method adjusts the player's size and velocity based on the scale of the game environment.
     * It also adjusts the player's position proportionally based on the previous and current scale.
     */
    resize() {
        // Calculate the new scale resulting from the window resize
        const newScale = { width: GameEnv.innerWidth, height: GameEnv.innerHeight };

        // Adjust the player's position proportionally
        this.position.x = (this.position.x / this.scale.width) * newScale.width;
        this.position.y = (this.position.y / this.scale.height) * newScale.height;

        // Update the player's scale to the new scale
        this.scale = newScale;

        // Recalculate the player's size based on the new scale
        this.size = this.scale.height / this.scaleFactor; 

        // Recalculate the player's velocity steps based on the new scale
        this.xVelocity = this.scale.width / this.stepFactor;
        this.yVelocity = this.scale.height / this.stepFactor;

        // Set the player's width and height to the new size (object is a square)
        this.width = this.size;
        this.height = this.size;
```

**this.position**: Scaled using the relationship of the object to the game environment.
**this.xVelocity**: Speed is also scaled in relation to the game environment.

### Synchronous Algorithms and `update()`

The `update()` method is a synchronous method called from the `gameLoop`. It is invoked every time the browser recursively activates the `gameLoop`.

> The `update()` method keeps the player object within bounds.

```js
/**
     * Updates the player's position and ensures it stays within the canvas boundaries.
     * 
     * This method updates the player's position based on its velocity and ensures that the player
     * stays within the boundaries of the canvas.
     */
    update() {
        // Update begins by drawing the player object
        this.draw();

        // Update or change position according to velocity events
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;

        // Ensure the player stays within the canvas boundaries
        // Bottom of the canvas
        if (this.position.y + this.height > GameEnv.innerHeight) {
            this.position.y = GameEnv.innerHeight - this.height;
            this.velocity.y = 0;
        }
        // Top of the canvas
        if (this.position.y < 0) {
            this.position.y = 0;
            this.velocity.y = 0;
        }
        // Right of the canvas
        if (this.position.x + this.width > GameEnv.innerWidth) {
            this.position.x = GameEnv.innerWidth - this.width;
            this.velocity.x = 0;
        }
        // Left of the canvas
        if (this.position.x < 0) {
            this.position.x = 0;
            this.velocity.x = 0;
        }
    }
```

**if conditions** Each `if` condition checks the boundaries of the canvas.
**this.position** The `position` attribute in the object is changed to allow the player to move directionally.

### Animation Algorithm

Most coders and users favor the sprite sheet animation algorithm. This is called from `update()`, thus it runs synchronously and at the browser's framerate.

> The animation algorithm cycles through and renders each frame of the sprite sheet according to the browser's framerate cycle.

```js
/**
 * Draws the player on the canvas.
 * 
 * This method renders the player using the sprite sheet if provided, otherwise a red square.
 */
draw() {
    if (this.spriteSheet) {
        // Sprite Sheet frame size: pixels = total pixels / total frames
        const frameWidth = this.spriteData.pixels.width / this.spriteData.orientation.columns;
        const frameHeight = this.spriteData.pixels.height / this.spriteData.orientation.rows;

        // Sprite Sheet direction data source (e.g., front, left, right, back)
        const directionData = this.spriteData[this.direction];

        // Sprite Sheet x and y declarations to store coordinates of current frame
        let frameX, frameY;
        // Sprite Sheet x and y current frame: coordinate = (index) * (pixels)
        frameX = (directionData.start + this.frameIndex) * frameWidth;
        frameY = directionData.row * frameHeight;

        // Draw the current frame of the sprite sheet
        GameEnv.ctx.drawImage(
            this.spriteSheet,
            frameX, frameY, frameWidth, frameHeight, // Source rectangle
            this.position.x, this.position.y, this.width, this.height // Destination rectangle
        );

        // Update the frame index for animation at a slower rate
        this.frameCounter++;
        if (this.frameCounter % this.animationRate === 0) {
            this.frameIndex = (this.frameIndex + 1) % directionData.columns;
        }
    } else {
        // Draw default red square
        GameEnv.ctx.fillStyle = 'red';
        GameEnv.ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
    }
```

**if (this.spriteSheet) or else**: This condition performs drawImage or fillRect according to sprite sheet availability.
**frameX and frameY** The algorithm calculates the position of the frame using `directionData` and `frameIndex`.
**frameWidth and frameHeight** The algorithm uses these to determine the dimensions of the sprite sheet offset; the dimensions form a rectangle, not a point.
