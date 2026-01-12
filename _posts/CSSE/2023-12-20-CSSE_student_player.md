---
comments: true
toc: true
layout: post
title: Player | Student
authors: Maryam Abdul-Aziz, Zidane Ahmed, Abi Besufekad, Gavin Ireland
---

## Player

Add different features to your Mario game to make it appear more like an RPG (role-playing game).

## Part 1: Dash function

We are going to tie a function to the 's' key to utilize all four WASD keys by increasing the speed of the key down.

### Step 1

First, we need to be able to check if the player is facing left or right to ensure that it dashes in the correct direction. Go to `Player.js` then `update`()` and add the following code

````js

update() {
    if (this.isAnimation("a")) {
            if (this.movement.left) this.x -= this.speed;  // Move to left
            this.facingLeft = true; // Add this!
        }
        if (this.isAnimation("d")) {
            if (this.movement.right) this.x += this.speed;  // Move to right
            this.facingLeft = false; // Add this!
        }
}
````

Next, we are going to add the functionality of s itself.

````js
        //previous code

        if (this.isAnimation("s")) {
            if (this.movement) {  // Check if movement is allowed
                const moveSpeed = this.speed * 2;
                this.x += this.facingLeft ? -moveSpeed : moveSpeed;
            }
        }
        //previous code
````

### Step 2

The dash function is complete! But it could be cooler. We're going to invert Mario's color when he is dashing. Scroll down to `handleKeyDown(event)` and `handleKeyUp(event)` and add this code.

````js
handleKeyDown(event) {
        //previous code

        //dash events
        if (event.key === "s") {
            this.canvas.style.filter = 'invert(1)';
        }
    }
````

````js
handleKeyUp(event) {
        //previous code

        //dash events
        if (event.key === "s") {
            this.canvas.style.filter = 'invert(0)'; //revert to default coloring
    }
}
````

### Step 3

The dash function could easily be abused by the mediocre gamer. We need to fix that by forcing it to stop after a certain number of seconds. Add these two variables somewhere in the Player class but before the update function.

````js
    //variables for dash cooldown
    dashTimer;
    cooldownTimer;
````

### Step 4

Go back to `update()` and add the following `if` statement under `if (this.movement)`

````js
if(this.dashTimer)
````

Your code under the `update()` should look like this now

````js
if (this.isAnimation("s")) {
            if (this.movement) {  // Check if movement is allowed
                if(this.dashTimer){
                    const moveSpeed = this.speed * 2;
                    this.x += this.facingLeft ? -moveSpeed : moveSpeed;
                }
            }
        }
````

### Step 5

Now add the following to your event listeners

````js
handleKeyDown(event) {

if (event.key === "s") {
            //previous code

            this.dashTimer = setTimeout(() => {
                // Stop the player's running functions
                clearTimeout(this.dashTimer);
                this.dashTimer = null;

                // Start cooldown timer
                this.cooldownTimer = setTimeout(() => {
                    clearTimeout(this.cooldownTimer);
                    this.cooldownTimer = null;
                }, 4000);
            }, 1000);
        }
}
````

<!--ADD OTHER PARTS OF LESSON HERE     !!!!!!!!!!-->

## Homework

- Implement all features into your code
- Fix a bug that comes from conflict with Parallax!
    - When you dash, the background doesn't move. If you then move left, you reach the edge of the background! How would you fix this? Ask Maryam for help if you are stuck.
- Add another ability to the game

### Challenge

- Add another RPG element (ex: add a 2nd ability tied to some key, create an NPC interaction, add story, etc.)
- Have you noticed the timeout feature is jittery? Try and make it smooth! By implementing a clock for the timeout, we are interfering with the game's own clock. Try your best to fix this. This could also be thought of as a "stamina" feature.
