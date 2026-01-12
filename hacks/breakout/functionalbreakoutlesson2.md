---
layout: base_chatadpt
title: Functional Breakout Blocks Lesson 2
author: Nikhil, Rohan, Pranav, Aditya, Shriya, Samhita
permalink: functionalbreakoutlesson2
---

#### [Return to Main Functional Lesson Page]({{ site.baseurl }}/functionalbreakoutlesson)

## **Lesson 2: Power-Up Block + Timer**

### Lesson Objectives
- Add power-up blocks to the Breakout game
- Implement random assignment of power-ups to bricks
- Handle power-up activation and effects (e.g., paddle size, speed)
- Draw and animate falling power-up objects
- Integrate timers and temporary effects into game logic
- Practice functional decomposition for new game features

**Goal:** Add a special block that gives a temporary boost when hit.

### Step 1: Add special bricks that drop a power-up when broken.

* We randomly give some bricks a powerUp property:

```js
let bricks = [];
const powerUpChance = 0.3; // 30% chance
for (let c = 0; c < brickColumnCount; c++) {
  bricks[c] = [];
  for (let r = 0; r < brickRowCount; r++) {
    const hasPowerUp = Math.random() < powerUpChance;
    bricks[c][r] = { x: 0, y: 0, status: 1, powerUp: hasPowerUp };
  }
}
```

When a power-up brick is hit, it spawns a falling power-up:
```js
if (b.powerUp) {
  powerUps.push({ x: b.x + brickWidth/2, y: b.y, active: true });
}
```

### Step 2: Draw and drop the power-up

* Each power-up is drawn as a glowing circle with “P” inside, and it falls down.

```js
let powerUps = [];
let activePowerUp = null;
let powerUpTimer = 0;
const powerUpDuration = 5000; // 5 seconds

function drawPowerUps() {
  for (let p of powerUps) {
    if (p.active) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, 10, 0, Math.PI * 2);
      ctx.fillStyle = "gold";
      ctx.fill();
      ctx.closePath();

      ctx.fillStyle = "black";
      ctx.font = "bold 14px Arial";
      ctx.textAlign = "center";
      ctx.fillText("P", p.x, p.y);

      // Make it fall
      p.y += 1.5;

      // If paddle catches it
      if (p.y >= canvas.height - paddleHeight &&
          p.x > paddleX && p.x < paddleX + paddleWidth) {
        p.active = false;
        paddleWidth = basePaddleWidth + 40; // widen paddle
        activePowerUp = "Wide Paddle";
        powerUpTimer = Date.now(); // start timer
      }
    }
  }
}
```

### Step 3: Show timer

* Draw the time left on screen.

```js
function drawPowerUpTimer() {
  if (activePowerUp) {
    let elapsed = Date.now() - powerUpTimer;
    let remaining = Math.max(0, powerUpDuration - elapsed);

    // Draw bar
    ctx.fillStyle = "gray";
    ctx.fillRect(canvas.width - 20, 20, 10, 100);

    ctx.fillStyle = "lime";
    let fillHeight = (remaining / powerUpDuration) * 100;
    ctx.fillRect(canvas.width - 20, 120 - fillHeight, 10, fillHeight);

    if (remaining <= 0) {
      activePowerUp = null;
      paddleWidth = basePaddleWidth; // reset
    }
  }
}

```

**Explore:**
* Make the timer 10 seconds instead of 5..
* Try different effects (ex: double player speed).

---

#### [👉 Click this for full source code](https://github.com/code259/curators/tree/main/hacks/breakout)