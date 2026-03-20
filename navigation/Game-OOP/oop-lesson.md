---
layout: post 
title: OOP Game Intro
description: 
author: 
hide: true
---

# Object-Oriented Programming in JavaScript Games

This lesson introduces **Object-Oriented Programming (OOP)** in JavaScript by exploring three game-related classes:

* `Transform` → handles position, velocity, and direction
* `Sprite` → manages images and animation
* `PlayerController` → combines input, movement, and rendering

We’ll go through each class **method by method** to see how they work and how to use them.

---

## 1. The `Transform` Class

The `Transform` class is used for storing and updating an object’s **position**, **velocity**, and **direction** in a 2D world.

### Constructor

```js
constructor(x = 0, y = 0, xv = 0, yv = 0, dir = 0) {
    this.position = {x: x, y: y};
    this.velocity = {xv: xv, yv: yv};
    this.direction = dir;
}
```

* Creates a new `Transform` with:

  * `position` → where the object is (`x`, `y`)
  * `velocity` → how fast it moves (`xv`, `yv`)
  * `direction` → angle the object is facing

**Example:**

```js
const t = new Transform(10, 20, 1, 0, 90);
console.log(t.position); // {x: 10, y: 20}
```

---

### `goTo(x1, y1)`

```js
goTo(x1, y1) {
    this.position = {x: x1, y: y1};
}
```

* Instantly moves the object to a new position.

**Example:**

```js
t.goTo(100, 200);
console.log(t.position); // {x: 100, y: 200}
```

---

### `goTo3(x1, z1, camera)`

```js
goTo3(x1, z1, camera) {
    const { s, c } = camera.trig();
    const rotz = z1 * -c - x1 * -s;
    const rotx = z1 * -s + x1 * -c;
    return {x: rotx * camera.zoom, y: rotz * 0.5 * camera.zoom};
}
```

* Converts **3D coordinates** `(x1, z1)` into a **2D projection** based on camera rotation and zoom.
* Useful for rendering 3D-like effects on a 2D canvas.

**Example (pseudo-code):**

```js
const camera = { trig: () => ({ s: Math.sin(0), c: Math.cos(0) }), zoom: 2 };
console.log(t.goTo3(5, 10, camera)); 
// returns projected 2D coordinates
```

---

### `distance(x1, y1, x2, y2)`

```js
distance(x1,y1,x2,y2) {
    const dx = x2-x1;
    const dy = y2-y1;
    return Math.sqrt(Math.pow(dx,2)+Math.pow(dy,2));
}
```

* Calculates the distance between two points.

**Example:**

```js
console.log(t.distance(0, 0, 3, 4)); // 5
```

---

## 2. The `Sprite` Class

The `Sprite` class handles **images and animations**.

### Constructor

```js
constructor(src, frameCount, fps) {
    this.image = new Image();
    this.image.src = src;
    this.frameWidth = 64;
    this.frameHeight = 64;
    this.frameCount = frameCount;
    this.fps = fps;
}
```

* Loads a sprite sheet from `src`.
* Divides it into frames (`frameCount`) and controls animation speed (`fps`).

**Example:**

```js
const walk = new Sprite("./walk.png", 6, 10);
```

---

### `draw(ctx, frame, row, x, y, scale = 1, canvas)`

```js
draw(ctx, frame, row, x, y, scale = 1, canvas) {
    const newFrame = (Math.floor(frame/this.fps)) % this.frameCount;
    const sx = newFrame * this.frameWidth;
    const sy = row * this.frameHeight;
    const sw = this.frameWidth;
    const sh = this.frameHeight;
    const dw = this.frameWidth * scale;
    const dh = this.frameHeight * scale;

    ctx.drawImage(this.image, sx, sy, sw, sh, x + canvas.width/2, y + canvas.height/2, dw, dh);
}
```

* Chooses the correct animation frame and draws it at `(x, y)` on the canvas.
* `row` selects which row of the sprite sheet to use.
* `scale` controls size.

**Example:**

```js
walk.draw(ctx, frameCount, 0, 100, 200, 1, canvas);
```

---

## 3. The `PlayerController` Class

The `PlayerController` class ties together **movement**, **input**, and **sprites** to control the player.

### Constructor

```js
constructor(startX, startY, roomID = 0) {
    this.transform = new Transform(startX, startY);
    this.speed = 0.1;
    this.walk = new Sprite("./art/mushroom-player.png", 6, 10);
    this.stand = new Sprite("./art/mushroom-player.png", 1, 10);
}
```

* Creates a player at `(startX, startY)` with movement speed and two sprites (walking & standing).

**Example:**

```js
const player = new PlayerController(50, 50);
```

---

### `moveVel(speed)`

```js
moveVel(speed) {
    const rad = (this.transform.direction * Math.PI) / 180;
    this.transform.velocity.xv += speed * Math.cos(rad);
    this.transform.velocity.yv += speed * Math.sin(rad);
}
```

* Adjusts velocity based on the current facing direction.

---

### `move(xv, yv)`

```js
move(xv,yv) {
    this.transform.position.x += xv * Math.cos(rad);
    this.transform.position.y += yv * Math.cos(rad);
    if (boxCollide(this.transform.position)) {
        this.transform.position.x += -xv * Math.cos(rad);
        this.transform.position.y += -yv * Math.cos(rad);
    }
}
```

* Moves the player while checking collisions.

---

### `controls(speed)`

```js
controls(speed) {
    if (keys.w) {
        this.transform.direction.dir = 0;
        this.moveVel(speed);
    } else if (keys.s) {
        this.transform.direction.dir = 180;
        this.moveVel(speed);
    } else if (keys.a) {
        this.transform.direction.dir = 270;
        this.moveVel(speed);
    } else if (keys.d) {
        this.transform.direction.dir = 90;
        this.moveVel(speed);
    }
}
```

* Reads keyboard input (`w`, `a`, `s`, `d`) and changes movement direction.

---

### `update(deltaTime)`

```js
update(deltaTime) {
    this.controls(this.speed);

    this.transform.velocity.xv *= 0.9;
    this.transform.velocity.yv *= 0.9;

    this.move(this.transform.velocity.xv * deltaTime, 0);
    this.move(0, this.transform.velocity.yv * deltaTime);
}
```

* Updates movement each frame, applies friction, and moves the player.

---

### `draw(ctx, frame, camera, canvas)`

```js
draw(ctx, frame, camera, canvas) {
    const pos = {
        x: this.transform.position.x,
        y: this.transform.position.y,
    }

    const d = this.transform.distance(0,0,this.transform.velocity.xv,this.transform.velocity.yv);
    if (d <= 1e-3) {
        this.stand.draw(ctx, frame, 0, pos.x, pos.y, 1, canvas);
    } else {
        this.walk.draw(ctx, 1, 0, pos.x, pos.y, 1, canvas);
    }
}
```

* Chooses between `stand` and `walk` animations based on velocity.

---

## Example: Using All Classes Together

```js
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const player = new PlayerController(50, 50);

let frame = 0;
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    player.update(1);
    player.draw(ctx, frame, null, canvas);

    frame++;
    requestAnimationFrame(gameLoop);
}

gameLoop();
```