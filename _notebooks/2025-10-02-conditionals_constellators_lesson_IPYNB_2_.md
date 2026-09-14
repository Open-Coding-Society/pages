---
layout: post
courses: {'csse': {'week': 5}}
categories: ['JavaScript', 'Conditions']
lesson_language: JavaScript
lesson_topic: Conditions
lesson_part: reference
lesson_type: lesson
title: Conditions
description: This is the JavaScript Conditionals Lesson, taught by the Constellators.
permalink: /csse/javascript/constellators/conditionals-lesson
author: Constellators - Adya S, Niharika B, Salma Z, Anika S, Sophie H
---

<style>
.glowing-text {
  color: #fff; /* Set the text color to white or a light color for better contrast */
  text-shadow: 0 0 10px #581696ff, /* Purple glow */
               0 0 20px #4a147cff, /* Deeper purple glow */
               0 0 30px #2248baff, /* Blue glow */
               0 0 40px #092780ff; /* Deeper blue glow */

  font-weight: bold;
  margin-top: 0;
}
</style>

Presented by the
<h4 class="glowing-text">CONSTELLATORS</h4>

<hr>

## **Conditionals**

In JavaScript, conditionals are essential aspects of programming that are used to control the flow of code based on whether certain conditions are met. They're necessary to make decisions within game code and run different actions based on different conditions.

TO FIND THIS LESSON (pages repository): Search -> "Constellators - Conditionals Lesson" -> Select the most recent one (should be 10/02/25)

### <u>What are Conditionals?</u>
- Allows the execution of different blocks of code based on whether a specified condition evaluates to true or false
- This enables programs to make decisions and respond dynamically to various situations
- Analogy: depending on the weather, you either bring outside an umbrella (rain) or a hat (sunny)
- Types: if, if-else, else if, (+switch)

<br>

### <u>Types of Conditionals</u>

#### 1. If

- Executes code if a given condition is true

Example:
```js
if (condition) {
    // Code to execute if condition is true
}
```

#### 2. If ... Else

- Basically a true/false --> executes one thing if the condition is true, and a different thing if the condition is false

Else statement:
- Executes a block of code only if the preceding if (or else if) condition evaluates to false.
- It must always follow an if or else if statement.
- No condition

Example:
```js
if (condition) {
    // Code to execute if condition is true
} else {
    // Code to execute if condition is false
}
```

#### 3. Else ... If

- JavaScript's equivalent of elif
- Executes a block of code if the preceding if condition (or any preceding else if conditions) evaluates to false, AND its own specified condition evaluates to true.
- Only the first true condition's block is executed
- Must always follow an if or another else if statement

Example:
```js
if (condition1) {
        // Code to execute if condition1 is true
    } else if (condition2) {
        // Code to execute if condition2 is true
    } else {
        // Code to execute if none of the above conditions are true
    }
```

#### 4. Switch

- Compares multiple possible outcomes
- More complex than just true/false

Example:
```js
switch (expression) {
        case value1:
            // Code to execute if expression matches value1
            break;
        case value2:
            // Code to execute if expression matches value2
            break;
        default:
            // Code to execute if no match is found
    }
```

#### 5. Nested If (Nested Conditionals)

- An if statement within another conditional.
- Analogy: if-else statement to determine whether it's raining. If it's raining, check if you have an umbrella.

Example:
```js
if (condition1) {
    if (extracondition1) {
        // Code to execute if both condition 1 and extra condition are true
    }
    else {
        // Code to execute if condition 1 is true, but extra condition is false
    }
} else {
    // Code to execute if condition 1 is false
}
```

<br>

**Summary**

“if” checks a condition
<br>“else if" checks another condition if the previous ones were false
<br>“else” runs if none of the above conditions were true.

### <u>Popcorn Hack 1</u>

Go to the HW file that you can access [here](https://github.com/AdyaShipekar/code-constellations/blob/main/_notebooks/CSSE/JavaScriptLessons/Conditionals/2025-10-02-conditionals_constellators_js_hw.ipynb). Download to your student/portfolio repository and complete Popcorn Hack 1.

### <u>Examples of Conditionals in OOP Breakout</u>

To Recap: A **conditional** in code is any statement where the program checks a condition (using `if, else, or else if ` statements) to decide what to do next. Throughout the OOP BREAKOUT game, there are many examples of conditionals and conditional expressions that help the game run smoothly. 

In our OOP Breakout game, you can consider the conditionals the rules of the game world! They let the code make decisions.

If the ball hits a wall → it bounces back.
If the ball hits a brick → the brick disappears.
If the ball hits the bottom → a life is lost.
Else (if none of those things happen) → the ball just keeps moving.

**Inside the update() method for the ball:**

```js
update(canvasWidth, canvasHeight) {
// Wall collision (left/right)
if (this.x + this.dx > canvasWidth - this.radius || this.x + this.dx < this.radius) {
this.dx = -this.dx;
}
// Top
if (this.y + this.dy < this.radius) {
 this.dy = -this.dy;
 }
this.x += this.dx;
this.y += this.dy;
}
```

**Explanation:**

First conditional: ```if (this.x + this.dx > canvasWidth - this.radius || this.x + this.dx < this.radius)```
- Checks if the ball is about to hit the left or right wall!
- If true, the ball bounces back by flipping its horizontal direction (```this.dx = -this.dx```).

Second conditional: ```if (this.y + this.dy < this.radius) ```
- Checks if the ball is about to hit the top wall!
- If true, it flips the vertical direction (```this.dy = -this.dy```).

Without these if statements, the ball would fly off the screen forever. The conditionals keep the ball bouncing around, making the game actually playable!

### <u>Popcorn Hack 2</u>

Go to the HW file from before and complete Popcorn Hack 2.

### <u>Homework</u>

Complete the homework and submit to [this form](https://docs.google.com/forms/d/e/1FAIpQLSccjujB0DqCnCy5mOE2r4Py8cYuvzmyBk9X-gWSn8XUNQvlDw/viewform?usp=header). 

