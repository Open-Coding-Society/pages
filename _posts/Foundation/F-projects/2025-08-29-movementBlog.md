---
layout: post
title: Physics Based Movement
comments: True
permalink: /together/lessons
authors: Ahaan Vaidyanathan, Nikhil Naryan, Arnav Mittal, Xavier Thompson, Spencer Lyons, Sharuya Singh
---



# Physics Based Movement

In our *Bumper Cars* game, the file **`move.js`** is where we handle all the code that makes the player move.  
It might look short, but it’s actually very powerful because it controls **how the player moves, which way they’re facing, and how collisions push them back**.

Let’s go through it step by step.

---

## The Player Object

The first thing in `move.js` is the `player` object:

```js
export const player = {
    x: 0,      // Player's X position
    y: 0,      // Player's Y position
    xv: 0,     // X velocity (how fast player moves sideways)
    yv: 0,     // Y velocity (how fast player moves up/down)
    speed: 0.4,// Base movement speed
    dir: 0,    // Direction the player is facing
    health: 100,
    coins: 0,
};
````

Think of this like the **player’s backpack** that stores all the important information:

* `x` and `y` → where the player is on the screen.
* `xv` and `yv` → how fast they’re moving left/right or up/down.
* `speed` → how quickly the player accelerates.
* `dir` → which way the player is facing.
* `health` and `coins` → basic stats for the game.

---

## Making the Player Face Something

Sometimes the player needs to face another object—for example, when bumping into a wall or enemy. That’s what `pointAt()` does:

```js
export function pointAt(x, y) {
    const dx = x - player.x;
    const dy = y - player.y;
    player.dir = Math.atan2(dy, dx) * (180 / Math.PI);
};
```

What’s happening here?

1. `dx` and `dy` measure the difference between the object and the player.
2. `Math.atan2(dy, dx)` calculates the angle between them (in radians).
3. Multiply by `180 / Math.PI` to turn that into **degrees**.

In simple terms: this makes the player **face the thing at `(x, y)`**.

---

## Moving the Player Forward or Backward

Now that the player knows which way they’re facing, how do they actually move? That’s where `move()` comes in:

```js
export function move(speed) {
    const angle = player.dir * (Math.PI / 180); // Turn degrees into radians
    player.xv += Math.cos(angle) * speed;
    player.yv += Math.sin(angle) * speed;
};
```

Here’s the breakdown:

* `player.dir` (the angle we set earlier) tells us which way the player is pointing.
* `Math.cos(angle)` and `Math.sin(angle)` turn that angle into movement on the X and Y axes.
* Multiplying by `speed` controls how strong the movement is.

If `speed` is positive, the player moves forward.
If `speed` is negative, the player gets pushed backward (like knockback when hitting something).

---

## How It Fits in the Game

Inside our main game file (`game.md`), we use these functions to update the player.

For example, each frame we apply friction and then move the player:

```js
player.xv *= 0.95;  // Slowly reduce X velocity (friction)
player.yv *= 0.95;  // Slowly reduce Y velocity (friction)

player.x += player.xv; // Update X position
player.y += player.yv; // Update Y position
```

This makes movement feel **smooth and natural**, instead of instantly stopping.

---

## Example: Collisions with Tiles

When the player collides with something (like a wall or enemy), we use `pointAt()` and `move()` together:

```js
if (updCollide(player, t, 20)) {
    player.health -= 15;    // Take damage
    pointAt(t.x, t.y);      // Face the object we hit
    move(-1);               // Push player backward
}
```

What happens here?

* The player **loses health**.
* They **turn to face** the object they hit.
* They get **pushed backward**, simulating a “bump.”

---

## Putting It All Together

With just a few functions, `move.js` gives us:

1. A way to **store all the player’s information**.
2. A way to **face toward any object**.
3. A way to **move in the direction the player is facing**.
4. A way to **simulate knockback** when colliding.

Even though the file is small, it’s the backbone of how the player moves and interacts in *Bumper Cars*.

---

**Next step for beginners:** Try changing the `player.speed` value to make movement faster or slower. Or, experiment with using `move(2)` for a dash ability!