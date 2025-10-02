---
layout: base_chatadpt 
title: OOP Breakout Lesson
author: Nikhil, Rohan, Pranav, Aditya, Shriya, Samhita
permalink: oopbreakoutlesson2
---

#### [Return to main OOP lesson page]({{ site.baseurl }}/oopbreakoutlesson)


## Lesson Objectives:
- Deep dive into the Paddle class: attributes vs. methods
- Implement movement, input handling, and rendering for Paddle
- Explore how inheritance enables code reuse
- Add advanced paddle features (e.g., power-ups, resizing)
- Practice overriding methods and customizing behavior
- Analyze the impact of OOP design on game extensibility

## Lesson 2 — The `Paddle` class: attributes vs. methods

### What are attributes?

Attributes (also called **properties/fields**) are the data on an object—things the object *has*. In the `Paddle` constructor, the following are the attributes:

```js
constructor(x, y, canvasWidth, canvasHeight) {
    super(x, y);
    this.canvasWidth = canvasWidth;   // attribute: bounds
    this.canvasHeight = canvasHeight; // attribute: bounds
    this.baseWidth = 75;              // attribute: base size
    this.width = this.baseWidth;      // attribute: current size (can change)
    this.height = 10;
    this.color = "#0095DD";
    this.speed = 7;                   // attribute: movement speed
    this.leftPressed = false;         // attribute: input state
    this.rightPressed = false;        // attribute: input state
}
```

Each `this.something = ...` sets an attribute on the Paddle instance. Source: OOP Breakout file.&#x20;

### What are methods?

Methods are **functions attached to the class** that use or change those attributes—things the object *does*.

**Rendering & movement**

```js
draw(ctx) {
    ctx.beginPath();
    ctx.rect(this.x, this.canvasHeight - this.height, this.width, this.height);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.closePath();
}

update() {
    if (this.rightPressed && this.x < this.canvasWidth - this.width) {
        this.x += this.speed;
    } else if (this.leftPressed && this.x > 0) {
        this.x -= this.speed;
    }
}
```

`draw` uses drawing APIs and your current attributes; `update` reads `leftPressed/rightPressed` and moves the paddle within bounds. Source: OOP Breakout file.&#x20;

**Convenience & game mechanics**

```js
setPosition(x) {
    if (x > 0 && x < this.canvasWidth) {
        this.x = x - this.width / 2;
    }
}

reset() {
    this.x = (this.canvasWidth - this.width) / 2;
    this.width = this.baseWidth;
}

applyPowerUp(type) {
    if (type === "wide") {
        this.width = this.baseWidth + 40;
    }
}

resetPowerUp() {
    this.width = this.baseWidth;
}
```

These methods set position (e.g., via mouse move), center and resize the paddle, and handle power-up effects in a clean, encapsulated way. Source: OOP Breakout file.&#x20;

**Try it:** Add a new method `shrink()` that sets `this.width = this.baseWidth - 25`, and call it from a new “shrink” power-up type.

---

## Wrap-up: how the pieces fit

* **Inheritance:** `Ball`, `Paddle`, `Brick`, `PowerUp` extend `GameObject` to share position and override `draw/update`.&#x20;
* **Composition:** `Game` builds the world—instantiates objects, tracks score/lives/level, and runs the loop.&#x20;

---

## ACTIVITY: showcase what you learned, draw out what you learned in the Whiteboard below. 

 - Draw your “class” as a box → properties inside (like health and lives), methods outside (like move(), hitBrick()).

 - Draw inheritance → a Paddle class, then draw a “PowerPaddle” subclass that has an extra feature (like shooting lasers).


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