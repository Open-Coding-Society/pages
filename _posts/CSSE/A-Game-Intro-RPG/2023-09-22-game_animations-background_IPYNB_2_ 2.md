---
toc: True
layout: post
title: Background
description: A guide to OOP using Javascript using the Background.js code.
menu: nav/game_intro.html
permalink: /game/intro/background
---

## Popcorn Hack

Find your own background for the game, get it running.

## Setting up a Background

This background code focuses on displaying a background within the extents of a canvas.

> Using `drawImage` to draw a background image

```js
ctx.drawImage(this.image, 0, 0, width, height);
```

- **ctx**: A reference to the canvas.
- **ctx.drawImage()**: Runs the draw image method on the canvas.
- **parameters to drawImage**
  - **this.image**:  Represents an attribute within the object; the image is from JSON object data.
  - **0, 0, width, height**: Placement of the image within the canvas.


> Using fillRect to draw a background as a colored rectangle (default behavior).

```js
ctx.fillStyle = '#87CEEB';
ctx.fillRect(0, 0, width, height);

- **fillStyle**:  Sets a blue-ish hexadecimal color code `#87CEEB` to work with fillRect.
- **fillRect**: Uses `fillStyle` to draw a rectangle on the screen.
```

## OOP parts of Background

In Object-Oriented programming you will have dependencies, a constructor, attributes, method and exports.

### Depenencies

Dependencies are external modules that contain methods or attributes that your class relies on.

> The backgrouund depends on canvas context, innerWidth, and innerHeight

```js
import GameEnv from './GameEnv.js';

export class Background {

// ... other code

draw() {
    const ctx = GameEnv.ctx; // canvas context
    const width = GameEnv.innerWidth; // width of the game within the context of the web page
    const height = GameEnv.innerHeight; // height of the game within the context of the web page
```

### Constructor and Attributes

The constructor initializes the object and sets up its attributes, specifically the image properties.

> A constructor instantiates an object of the class with its customized attributes.

```js
export class Background {
    constructor(imageSrc = null) { // receives a JSON object for the image, defaults to null if not provided
        if (imageSrc) {
            this.image = new Image();
            this.image.src = imageSrc.src; // source for the image used in drawImage()
        } else {
            this.image = null; // no image, which will be used in fillRect()
        }
    }
}

### Methods

Methods are functions that define the behavior of the object. In the game, the `draw()` method is called from `gameLoop`.

> A method encapsulates logic related to the class.

```js
draw() {
    const ctx = GameEnv.ctx;
    const width = GameEnv.innerWidth;
    const height = GameEnv.innerHeight;

    if (this.image) {
        // Draw the background image scaled to the canvas size
        ctx.drawImage(this.image, 0, 0, width, height);
    } else {
        // Fill the canvas with a blue color if no background image is provided
        ctx.fillStyle = '#87CEEB';
        ctx.fillRect(0, 0, width, height);
    }
}

### Exports

Exports make your class available for use in other modules.

> An export is used to share the `Background` class with the game loop.

```js
export default Background;
