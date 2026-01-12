---
layout: post
title: LessonPhysics-Based Movement in Games
comments: True
permalink: /movement/lessons
authors: Ahaan Vaidyanathan, Nikhil Naryan, Arnav Mittal, Xavier Thompson, Spencer Lyons, Sharuya Singh
---

# Lesson: Physics-Based Movement in Games

### Objective

Students will learn how to implement physics-based movement in a game by:

1. Defining a player object with position and velocity.
2. Making the player face toward a point.
3. Moving the player using angles, velocity, and friction.
4. Handling collisions with knockback.

---

## 1. The Player Object

### Explanation

The **player object** stores all the important information about the player.

```js
export const player = {
    x: 0,      // Player's X position
    y: 0,      // Player's Y position
    xv: 0,     // X velocity
    yv: 0,     // Y velocity
    speed: 0.4,// Base movement speed
    dir: 0,    // Direction facing
    health: 100,
    coins: 0,
};
```

Think of this like a backpack. It holds **where the player is**, **how fast they’re moving**, and **basic stats**.

### Quick Check

* Which properties control where the player is on the screen?
* What does `dir` store?

---

## 2. Facing an Object (`pointAt()`)

### Explanation

We often want the player to face toward something, like a wall or enemy.

```js
export function pointAt(x, y) {
    const dx = x - player.x;
    const dy = y - player.y;
    player.dir = Math.atan2(dy, dx) * (180 / Math.PI);
};
```

Steps:

1. Find the difference (`dx`, `dy`) between player and target.
2. Use `Math.atan2()` to calculate the angle.
3. Convert from radians to degrees.

Now the player turns to face `(x, y)`.

### Activity

Change the code so the player always faces the mouse pointer.

---

## 3. Moving the Player (`move()`)

### Explanation

Once the player knows their direction, we can move them forward or backward.

```js
export function move(speed) {
    const angle = player.dir * (Math.PI / 180);
    player.xv += Math.cos(angle) * speed;
    player.yv += Math.sin(angle) * speed;
};
```

* `Math.cos(angle)` → movement along X.
* `Math.sin(angle)` → movement along Y.
* `speed` decides if they go forward (`+`) or backward (`-`).

### Example

* `move(1)` → step forward.
* `move(-1)` → knockback effect.

### Quick Check

What happens if you call `move(2)` instead of `move(1)`?

---

## 4. Smoother Movement with Friction

### Explanation

Without friction, the player would slide forever.
We reduce velocity a little each frame:

```js
player.xv *= 0.95;  
player.yv *= 0.95;  

player.x += player.xv; 
player.y += player.yv; 
```

This makes movement **smooth and natural**.

### Activity

Try changing `0.95` to `0.5`. What happens?

---

## 5. Collisions and Knockback

### Explanation

When the player hits an object, we combine everything:

```js
if (updCollide(player, t, 20)) {
    player.health -= 15;    
    pointAt(t.x, t.y);      
    move(-1);               
}
```

Effects:

1. Player loses health.
2. Turns to face the object.
3. Gets pushed backward.

This creates a realistic "bump."

### Quick Check

Why do we call `move(-1)` instead of `move(1)` here?

---

## 6. Wrap-Up

By now, students should understand that:

1. The **player object** stores movement data.
2. `pointAt()` makes the player face things.
3. `move()` changes velocity based on direction.
4. Friction makes motion realistic.
5. Collisions + knockback combine it all.

---

## 7. Extension Challenge

* Increase `player.speed` for a faster player.
* Use `move(2)` to create a **dash ability**.
* Try making enemies use the same functions!