---
layout: lessonbase
title: "OOP Breakout — Lesson 1: Game class & inheritance"
permalink: /oopbreakoutlesson1
author: ["Nikhil", "Rohan", "Pranav", "Aditya", "Shriya", "Samhita"]

# Sidebar & nav
sidebar: true
sidebar_title: "OOP Breakout"
lesson_links:
  - { text: "Main OOP page", url: "/oopbreakoutlesson" }
  - { text: "Lesson 1 (you are here)", url: "/oopbreakoutlesson1" }

# Built-in toggles
enable_timer: true
enable_progress: true
enable_badges: true

# Interactive blocks
enable_blackboard: true        # shared Fabric.js drawing board (keys: w/r/b/g, c to clear)
enable_demo: true              # live canvas + show/hide code
enable_sandbox: true           # mini editor/runner
enable_flashcards: false       # turn on later if you add _data/oop_l1.yml

# Quick reflection
enable_quiz: true
quiz_prompt: "In one sentence, explain the difference between inheritance and composition in this project."

# --- DEMO (runs on page) ---
demo_runtime_code: |
  const canvas = document.getElementById("demo-canvas");
  const ctx = canvas.getContext("2d");
  canvas.width = 740; canvas.height = 240;
  
  class GameObject { constructor(x,y){ this.x=x; this.y=y; } draw(ctx){} update(){} }

  class Ball extends GameObject {
    constructor(x,y,r=10){ super(x,y); this.r=r; this.dx=2.2; this.dy=-2.4; }
    draw(ctx){
      ctx.beginPath(); ctx.arc(this.x,this.y,this.r,0,Math.PI*2); ctx.fill();
    }
    update(w,h){
      this.x += this.dx; this.y += this.dy;
      if (this.x < this.r || this.x > w - this.r) this.dx *= -1;
      if (this.y < this.r || this.y > h - this.r) this.dy *= -1;
    }
  }

  class Paddle extends GameObject {
    constructor(x,y){ super(x,y); this.w=100; this.h=12; }
    draw(ctx){ ctx.fillRect(this.x-this.w/2, this.y-this.h/2, this.w, this.h); }
  }

  const ball = new Ball(120,120,10);
  const paddle = new Paddle(370,210);

  function loop(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    ball.update(canvas.width, canvas.height);
    ball.draw(ctx); paddle.draw(ctx);
    requestAnimationFrame(loop);
  }
  loop();

# --- DEMO (pretty-printed code shown when toggled) ---
demo_display_code: |
  // Base class shared by visible objects
  class GameObject {
    constructor(x, y) { this.x = x; this.y = y; }
    draw(ctx) {}           // to be overridden
    update() {}            // to be overridden
  }

  // Ball extends GameObject (inheritance)
  class Ball extends GameObject {
    constructor(x, y, r = 8) {
      super(x, y);
      this.r = r; this.dx = 2; this.dy = -2;
    }
    draw(ctx) { ctx.beginPath(); ctx.arc(this.x, this.y, this.r, 0, Math.PI*2); ctx.fill(); }
    update(w,h){ /* physics + wall bounces */ }
  }

  // Paddle extends GameObject (inheritance)
  class Paddle extends GameObject {
    constructor(x, y) { super(x, y); this.w = 90; this.h = 12; }
    draw(ctx) { ctx.fillRect(this.x-this.w/2, this.y-this.h/2, this.w, this.h); }
  }

  // Game composes/owns objects (composition)
  class Game {
    constructor(canvas){
      this.canvas = canvas; this.ctx = canvas.getContext("2d");
      this.ball = new Ball(100,120,10);
      this.paddle = new Paddle(canvas.width/2, canvas.height-20);
      // ... input, collisions, score, lives, loop
    }
  }

# --- SANDBOX starter code ---
sandbox_code: |
  // Try tweaking values, then click Run.
  class GameObject { constructor(x,y){ this.x=x; this.y=y; } }
  class Ball extends GameObject { constructor(x,y,r=8){ super(x,y); this.r=r; this.dx=3; this.dy=-3; } }
  console.log("✔ Inheritance + composition scaffold ready.");

# Helpful links
resources:
  - { text: "MDN: Classes", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes" }
  - { text: "MDN: 2D Canvas API", url: "https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D" }
  - { text: "Repo: code259/curators breakout", url: "https://github.com/code259/curators/tree/main/hacks/breakout" }
---

#### [Return to main OOP lesson page]({{ site.baseurl }}/oopbreakoutlesson)

---

## Lesson 1 — The `Game` class & how inheritance works

### Big picture
- **Inheritance**: `Ball`, `Paddle`, `Brick`, `PowerUp` all **extend** `GameObject` to reuse `x/y` and hook methods (`draw`, `update`).
- **Composition**: `Game` **has** a ball, paddle, bricks, etc., and **orchestrates** them (state, loop, collisions). `Game` doesn’t extend— it **owns**.

### Base class → `GameObject`

```js
class GameObject {
  constructor(x, y) { this.x = x; this.y = y; }
  draw(ctx) {}
  update() {}
}

class Ball extends GameObject {
  constructor(x, y, radius = 8) {
    super(x, y);
    this.radius = radius; this.dx = 2; this.dy = -2; this.color = "#0095DD";
  }
}

class Paddle extends GameObject {
  constructor(x, y, canvasWidth, canvasHeight) {
    super(x, y);
    this.canvasWidth = canvasWidth; this.canvasHeight = canvasHeight;
    this.baseWidth = 75; this.width = this.baseWidth; this.height = 10;
    this.color = "#0095DD"; this.speed = 7;
  }
}

class Game {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext("2d");
    this.width = this.canvas.width; this.height = this.canvas.height;

    this.score = 0; this.lives = 3; this.level = 1; this.paused = false;

    this.ball = new Ball(this.width/2, this.height-30);
    this.paddle = new Paddle((this.width-75)/2, this.height-10, this.width, this.height);
    this.bricks = []; this.powerUps = [];
    // … events, brick grid, game loop
  }
}
