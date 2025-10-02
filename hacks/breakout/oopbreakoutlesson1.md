---
layout: base_chatadpt 
title: OOP Breakout Lesson
author: Nikhil, Rohan, Pranav, Aditya, Shriya, Samhita
permalink: oopbreakoutlesson1
---

#### [Return to main OOP lesson page]({{ site.baseurl }}/oopbreakoutlesson)


## Lesson Objectives:
- Define and implement the base `GameObject` class
- Use inheritance to create Ball, Paddle, Brick, and PowerUp classes
- Explore constructor logic and shared properties
- Demonstrate how composition is used in the Game class
- Refactor game logic to leverage OOP principles
- Visualize class relationships and object interactions

## Lesson 1 — The `Game` class & how inheritance works

### Big picture

* **Inheritance** lets a class reuse and extend behavior from a parent (base) class.
* In this project, **`GameObject`** is the base class. Visual things in the game—**`Ball`**, **`Paddle`**, **`Brick`**, **`PowerUp`**—inherit from it using `extends`.
* **Composition** is also used: the **`Game`** class *has a* ball, paddle, bricks, etc., and *coordinates* them. `Game` itself doesn’t inherit from anything—it *manages* objects that do.

### Base class → `GameObject`

```js
// Base GameObject class - provides common functionality
class GameObject {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    
    draw(ctx) {
        // Base draw method - to be overridden
    }
    
    update() {
        // Base update method - to be overridden
    }
}
```

This tiny class centralizes shared position (`x`, `y`) and provides placeholder `draw`/`update` hooks for subclasses to override. Source: OOP Breakout file.&#x20;

### Subclasses → `Ball` and `Paddle` inherit

```js
// Ball class - handles ball physics and movement
class Ball extends GameObject {
    constructor(x, y, radius = 8) {
        super(x, y);
        this.radius = radius;
        this.dx = 2;
        this.dy = -2;
        this.color = "#0095DD";
    }
}
```

`Ball` inherits `x`/`y` (through `super(x, y)`) and adds its own data: size (`radius`), velocity (`dx`, `dy`), and `color`. Source: OOP Breakout file.&#x20;

```js
// Paddle class - handles paddle movement and controls
class Paddle extends GameObject {
    constructor(x, y, canvasWidth, canvasHeight) {
        super(x, y);
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        this.baseWidth = 75;
        this.width = this.baseWidth;
        this.height = 10;
        this.color = "#0095DD";
        this.speed = 7;
        this.leftPressed = false;
        this.rightPressed = false;
    }
}
```

`Paddle` also inherits from `GameObject`, adding canvas bounds, size, color, speed, and input flags. Source: OOP Breakout file.&#x20;

### The conductor → `Game` composes everything

```js
// Main Game class - controls game state and orchestrates everything
class Game {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext("2d");
        this.width = this.canvas.width;
        this.height = this.canvas.height;
        
        // Game state
        this.score = 0;
        this.lives = 3;
        this.level = 1;
        this.paused = false;
        this.gameRunning = false;
        
        // Game objects
        this.ball = new Ball(this.width / 2, this.height - 30);
        this.paddle = new Paddle((this.width - 75) / 2, this.height - 10, this.width, this.height);
        this.bricks = [];
        this.powerUps = [];
        
        // ... more: events, bricks, loop
    }
}
```

`Game` *owns* the objects and state (score, lives, level), initializes them, and later runs the loop, handles collisions, etc.—that’s composition in action. Source: OOP Breakout file.&#x20;

**Try it:** Add a new subclass (e.g., `Particle extends GameObject`) and let `Game` hold an array of particles. This shows how inheritance (shape) and composition (owning many) play together.

---

## ACTIVITY: showcase what you learned, draw out what you learned in the Whiteboard below. 

<canvas id="c" width="740" height="500" style="border:1px solid #ccc"></canvas>

<script src="https://cdnjs.cloudflare.com/ajax/libs/fabric.js/5.3.1/fabric.js" integrity="sha512-hOJ0mwaJavqi11j0XoBN1PtOJ3ykPdP6lp9n29WVVVVZxgx9LO7kMwyyhaznGJ+kbZrDN1jFZMt2G9bxkOHWFQ==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>

<script>
  const canvas = new fabric.Canvas('c');
  canvas.isDrawingMode = true; // enable free drawing
  canvas.freeDrawingBrush.color = "white";
  canvas.freeDrawingBrush.width = 5;
  document.addEventListener("keydown", e => {
    if(e.key === "r") canvas.freeDrawingBrush.color = "red";
    if(e.key === "b") canvas.freeDrawingBrush.color = "blue";
    if(e.key === "g") canvas.freeDrawingBrush.color = "green";
    if(e.key === "c") canvas.clear();
  });
</script>

<br>
Press `r` to change brush color to red.
Press `b` to change brush color to blue.
Press `g` to change brush color to green.
Press `c` to clear blackboard. 

---

#### [👉 Click this for full source code](https://github.com/code259/curators/tree/main/hacks/breakout)