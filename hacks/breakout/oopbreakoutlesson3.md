---
layout: base_chatadpt 
title: OOP Breakout Lesson
author: Nikhil, Rohan, Pranav, Aditya, Shriya, Samhita
permalink: oopbreakoutlesson3
---

#### [Return to main OOP lesson page]({{ site.baseurl }}/oopbreakoutlesson)


## Lesson Objectives:
- Understand constructors and object instantiation in OOP
- Implement the Ball class with velocity, position, and collision logic
- Use inheritance to extend GameObject functionality
- Add advanced ball features (e.g., speed changes, effects)
- Integrate ball movement and collision into the game loop
- Visualize object creation and lifecycle in Breakout

### What is a constructor?

A **constructor** is a special method that runs when you create an instance of a class with `new`. It sets the initial state for that object.

Here’s the `Ball` constructor:

```js
class Ball extends GameObject {
    constructor(x, y, radius = 8) {
        super(x, y);
        this.radius = radius; // size
        this.dx = 2;          // horizontal velocity
        this.dy = -2;         // vertical velocity
        this.color = "#0095DD";
    }
}
```

* `super(x, y)` calls the parent (`GameObject`) constructor to initialize shared fields.
* The default parameter `radius = 8` makes the ball small unless you specify otherwise.
* Setting `dx`/`dy` gives the ball an initial velocity. Source: OOP Breakout file.&#x20;

### From simple to nuanced

**1) Drawing the ball**

```js
draw(ctx) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.closePath();
}
```

This renders a filled circle at the ball’s current position. Source: OOP Breakout file.&#x20;

**2) Basic movement & wall collisions**

```js
update(canvasWidth, canvasHeight) {
    // Wall collision
    if (this.x + this.dx > canvasWidth - this.radius || this.x + this.dx < this.radius) {
        this.dx = -this.dx;
    }
    if (this.y + this.dy < this.radius) {
        this.dy = -this.dy;
    }
    
    this.x += this.dx;
    this.y += this.dy;
}
```

Reversing `dx`/`dy` bounces the ball off walls/ceiling. Source: OOP Breakout file.&#x20;

**3) Smarter resets (keep speed, randomize angle)**

```js
reset(canvasWidth, canvasHeight) {
    this.x = canvasWidth / 2;
    this.y = canvasHeight - 30;
    const speed = Math.hypot(this.dx, this.dy);
    const angle = (Math.PI / 6) + Math.random() * (Math.PI / 3);
    const sign = Math.random() < 0.5 ? -1 : 1;
    this.dx = sign * speed * Math.cos(angle);
    this.dy = -Math.abs(speed * Math.sin(angle));
}
```

This keeps the *speed* but varies the *direction* within a range for fresh restarts. Source: OOP Breakout file.&#x20;

**4) Controlled speed-ups (preserve direction)**

```js
speedUp(multiplier = 1.12) {
    const currentSpeed = Math.hypot(this.dx, this.dy) * multiplier;
    const theta = Math.atan2(this.dy, this.dx);
    this.dx = currentSpeed * Math.cos(theta);
    this.dy = currentSpeed * Math.sin(theta);
}
```

This scales velocity magnitude without changing direction (`theta`). Great for difficulty curves. Source: OOP Breakout file.&#x20;

**5) Collision helpers**

```js
collidesWith(obj) {
    return (
        this.x > obj.x &&
        this.x < obj.x + obj.width &&
        this.y > obj.y &&
        this.y < obj.y + obj.height
    );
}

collidesWithPaddle(paddle) {
    return (
        this.y + this.dy > paddle.canvasHeight - paddle.height &&
        this.x > paddle.x &&
        this.x < paddle.x + paddle.width
    );
}
```

These helpers keep the `Game` logic clean by packaging collision checks inside the ball. Source: OOP Breakout file.&#x20;

**Try it:** Add a `slowDown(multiplier = 0.5)` method mirroring `speedUp`, then bind it to a temporary “slow-mo” key for testing.

---

## Wrap-up: how the pieces fit

* **Inheritance:** `Ball`, `Paddle`, `Brick`, `PowerUp` extend `GameObject` to share position and override `draw/update`.&#x20;
* **Composition:** `Game` builds the world—instantiates objects, tracks score/lives/level, and runs the loop.&#x20;

---

## ACTIVITY: showcase what you learned, draw out what you learned in the Whiteboard below. 

 - Draw your “class” as a box → properties inside (like health, lives), methods outside (like move(), hitBrick()).

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