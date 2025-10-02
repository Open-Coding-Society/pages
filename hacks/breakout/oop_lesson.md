---
layout: base_chatadpt 
title: OOP Breakout Lesson
author: Nikhil, Rohan, Pranav, Aditya, Shriya, Samhita
permalink: oopbreakoutlesson
---

### [👉 Click this for full source code](https://github.com/code259/curators/tree/main/hacks/breakout)

# OOP Breakout (3-Part Mini-Lesson)

---

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

## Lesson 2 — The `Paddle` class: attributes vs. methods

### What are attributes?

Attributes (also called **properties/fields**) are the data on an object—things the object *has*. In the `Paddle` constructor, these are the attributes:

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

## Lesson 3 — The `Ball` class & what constructors are

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


<canvas id="c" width="800" height="500" style="border:1px solid #ccc"></canvas>

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


# ✅ Checkpoint Quizzes.

<div id="oop-breakout-quizzes">
<style>
  #oop-breakout-quizzes { --ok:#118a00; --bad:#b00020; }
  #oop-breakout-quizzes .quiz-card{
    background:#fff;border:2px solid #ddd;border-radius:14px;
    padding:1.2rem;margin:1.2rem 0;box-shadow:0 4px 12px rgba(0,0,0,.05);
    color:#000;
  }
  #oop-breakout-quizzes .quiz-title{font-size:1.2rem;font-weight:700;margin-bottom:.25rem}
  #oop-breakout-quizzes .quiz-sub{margin-bottom:.9rem;color:#333}
  #oop-breakout-quizzes .q{border-radius:10px;padding:.9rem;margin:.7rem 0;border:1px solid #eee}
  #oop-breakout-quizzes .q:nth-child(odd){background:#f7f3ff;}
  #oop-breakout-quizzes .q:nth-child(even){background:#f3fff7;}
  #oop-breakout-quizzes .prompt{font-weight:700;margin-bottom:.4rem}
  #oop-breakout-quizzes .option{display:flex;gap:.45rem;align-items:flex-start;margin:.3rem 0}
  #oop-breakout-quizzes button{
    background:#f7f7f7;color:#000;border:2px solid #000;
    border-radius:999px;padding:.45rem 1rem;
    font-weight:700;cursor:pointer;margin-top:.6rem
  }
  #oop-breakout-quizzes button:hover{background:#000;color:#fff}
  #oop-breakout-quizzes .feedback{margin-top:.5rem;font-weight:700}
  #oop-breakout-quizzes .feedback.ok{color:var(--ok)}
  #oop-breakout-quizzes .feedback.bad{color:var(--bad)}
  #oop-breakout-quizzes .score{margin-top:1rem;font-weight:800}
  #oop-breakout-quizzes code{
    background:#f4f4f4;color:#000;padding:2px 5px;border-radius:4px
  }
</style>


  <!-- Quiz 1 -->
  <div class="quiz-card" data-quiz="1">
    <div class="quiz-title">Lesson 1 Checkpoint</div>
    <div class="quiz-sub">Inheritance vs. Composition</div>
    <div class="q">
      <div class="prompt">1) Which classes inherit from <code>GameObject</code>?</div>
      <label class="option"><input type="checkbox" value="Ball">Ball</label>
      <label class="option"><input type="checkbox" value="Paddle">Paddle</label>
      <label class="option"><input type="checkbox" value="Game">Game</label>
      <label class="option"><input type="checkbox" value="Brick">Brick</label>
    </div>
    <div class="q">
      <div class="prompt">2) What is composition in the <code>Game</code> class?</div>
      <label class="option"><input type="radio" name="q2">Game extends GameObject</label>
      <label class="option"><input type="radio" name="q2">Game owns and manages Ball, Paddle, Bricks</label>
      <label class="option"><input type="radio" name="q2">Game overrides draw()</label>
    </div>
    <button class="check">Check Answers</button>
    <button class="clear">Clear</button>
    <div class="feedback"></div>
  </div>

  <!-- Quiz 2 -->
  <div class="quiz-card" data-quiz="2">
    <div class="quiz-title">Lesson 2 Checkpoint</div>
    <div class="quiz-sub">Attributes vs. Methods</div>
    <div class="q">
      <div class="prompt">1) Which of these are attributes of Paddle?</div>
      <label class="option"><input type="checkbox" value="width">width</label>
      <label class="option"><input type="checkbox" value="color">color</label>
      <label class="option"><input type="checkbox" value="draw()">draw()</label>
      <label class="option"><input type="checkbox" value="update()">update()</label>
    </div>
    <div class="q">
      <div class="prompt">2) Which method makes the paddle respond to keyboard input?</div>
      <label class="option"><input type="radio" name="q2p">reset()</label>
      <label class="option"><input type="radio" name="q2p">update()</label>
      <label class="option"><input type="radio" name="q2p">applyPowerUp()</label>
    </div>
    <button class="check">Check Answers</button>
    <button class="clear">Clear</button>
    <div class="feedback"></div>
  </div>

  <!-- Quiz 3 -->
  <div class="quiz-card" data-quiz="3">
    <div class="quiz-title">Lesson 3 Checkpoint</div>
    <div class="quiz-sub">Constructors & Ball</div>
    <div class="q">
      <div class="prompt">1) What does <code>super(x, y)</code> do in Ball’s constructor?</div>
      <label class="option"><input type="radio" name="q3a">Calls the Game class</label>
      <label class="option"><input type="radio" name="q3a">Calls GameObject constructor</label>
      <label class="option"><input type="radio" name="q3a">Sets speed to default</label>
    </div>
    <div class="q">
      <div class="prompt">2) What does <code>speedUp()</code> change?</div>
      <label class="option"><input type="radio" name="q3b">Ball size only</label>
      <label class="option"><input type="radio" name="q3b">Velocity magnitude</label>
      <label class="option"><input type="radio" name="q3b">Direction and color</label>
    </div>
    <button class="check">Check Answers</button>
    <button class="clear">Clear</button>
    <div class="feedback"></div>
  </div>
</div>

<script>
const answers = {
  1: {multi:["Ball","Paddle","Brick"],single:"Game owns and manages Ball, Paddle, Bricks"},
  2: {multi:["width","color"],single:"update()"},
  3: {multi:[], single:["Calls GameObject constructor","Velocity magnitude"]}
};

document.querySelectorAll('#oop-breakout-quizzes .quiz-card').forEach(card=>{
  card.querySelector('.check').onclick=()=>{
    let id=card.dataset.quiz;
    let fb=card.querySelector('.feedback');
    let correct=true;
    if(id=="1"){
      let chosen=[...card.querySelectorAll('input[type=checkbox]:checked')].map(x=>x.value);
      if(JSON.stringify(chosen.sort())!==JSON.stringify(answers[1].multi.sort())) correct=false;
      let radio=card.querySelector('input[name=q2]:checked');
      if(!radio||radio.parentNode.textContent.trim()!==answers[1].single) correct=false;
    }
    if(id=="2"){
      let chosen=[...card.querySelectorAll('input[type=checkbox]:checked')].map(x=>x.value);
      if(JSON.stringify(chosen.sort())!==JSON.stringify(answers[2].multi.sort())) correct=false;
      let radio=card.querySelector('input[name=q2p]:checked');
      if(!radio||radio.parentNode.textContent.trim()!==answers[2].single) correct=false;
    }
    if(id=="3"){
      let r1=card.querySelector('input[name=q3a]:checked');
      let r2=card.querySelector('input[name=q3b]:checked');
      if(!r1||r1.parentNode.textContent.trim()!==answers[3].single[0]) correct=false;
      if(!r2||r2.parentNode.textContent.trim()!==answers[3].single[1]) correct=false;
    }
    fb.textContent=correct?"✅ Correct!":"❌ Try again.";    
    fb.className="feedback "+(correct?"ok":"bad");
  };
  card.querySelector('.clear').onclick=()=>{
    card.querySelectorAll('input').forEach(x=>x.checked=false);
    let fb=card.querySelector('.feedback'); fb.textContent="";
  };
});
</script>