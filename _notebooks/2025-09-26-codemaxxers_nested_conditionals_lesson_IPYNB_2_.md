---
layout: post
courses: {'csp': {'week': 1}}
categories: ['Python', 'Nested-Conditionals']
lesson_language: Python
lesson_topic: Nested-Conditionals
lesson_part: interactive
lesson_type: lesson
toc: True
comments: False
title: 3.7 Nested Conditionals
description: Explore how to use nested conditionals in JavaScript and Python to make complex, hierarchical decisions in code.
permalink: /csp/codemaxxers/nested-conditionals-lesson
---

# Nested Conditionals Lesson

## What are Nested Conditionals?

Nested conditionals are **conditionals within conditionals**. They allow us to check multiple conditions in a hierarchical way, where the result of one condition determines which other conditions we check next.

## Pseudocode Structure

Here's the basic structure of nested conditionals:

```
if (condition) {
    if (condition) {
        // code
    } else {
        // code
    }
} else {
    if (condition) {
        // code
    } else {
        // code
    }
}
```

In this structure, we check an initial condition. Depending on whether it's true or false, we move to one segment of code and check another conditional. **Going down one path means you do not go down another.**

## Example 1: Game Level Completion

Let's look at a real-world example. Imagine we're playing a game that checks if we've completed a level by satisfying two requirements:
- **TIME** is less than 3 seconds
- **SCORE** is greater than 1000

If both conditions are met, we add 3 lives and increase the level.


```javascript
%%js
// Initial game state
let score = 1200;
let time = 2.5;
let level = 2;
let lives = 3;

console.log(`Starting state: Score=${score}, Time=${time}, Level=${level}, Lives=${lives}`);

// Simple condition (not complete yet)
if (time < 3 && score > 1000) {
    lives = lives + 3;
    level = level + 1;
    console.log("Both conditions met! +3 lives, +1 level");
}

console.log(`Final state: Score=${score}, Time=${time}, Level=${level}, Lives=${lives}`);
```

### Problem: What if the conditions aren't met?

The above code doesn't tell the game what to do if:
- Only one condition is met
- Neither condition is met

Let's fix this with **nested conditionals**!

## Complete Nested Conditional Example


```javascript
%%js
// Initial game state
let score = 1200;
let time = 4.2;
let level = 2;
let lives = 3;

console.log(`Starting state: Score=${score}, Time=${time}, Level=${level}, Lives=${lives}`);

// Complete nested conditional
if (time < 3 && score > 1000) {
    // Both conditions met
    lives = lives + 3;
    level = level + 1;
    console.log("Both conditions met! +3 lives, +1 level");
} else {
    // At least one condition was NOT met
    if (time < 3 || score > 1000) {
        // At least one condition is met
        lives = lives + 1;
        console.log("One condition met! +1 life");
    } else {
        // Neither condition is met
        lives = lives - 1;
        console.log("No conditions met! -1 life");
    }
}

console.log(`Final state: Score=${score}, Time=${time}, Level=${level}, Lives=${lives}`);
```

### 🤔 Prediction Exercise

Before you ran the code above, what did you predict would happen?

**Answer:** Since `time = 4.2` (NOT less than 3) and `score = 1200` (IS greater than 1000), only ONE condition is met. So we take the `else` branch, then the inner `if` branch is true, giving us +1 life. The player ends with 4 lives and stays at level 2.

## Example 2: Temperature and Weather Advisory System

Let's look at another real-world application: a weather advisory system that gives recommendations based on temperature and whether it's raining.


```javascript
%%js
let temperature = 85;
let isRaining = false;

console.log(`Current conditions: ${temperature}°F, Raining: ${isRaining}`);
console.log("\nWeather Advisory:");

if (temperature > 80) {
    // It's hot
    if (isRaining) {
        console.log("It's hot and rainy - stay hydrated and bring an umbrella!");
    } else {
        console.log("It's hot and sunny - wear sunscreen and stay hydrated!");
    }
} else {
    // It's not hot
    if (isRaining) {
        console.log("It's cool and rainy - bring a jacket and umbrella!");
    } else {
        console.log("It's cool and clear - perfect weather for outdoor activities!");
    }
}
```

## Try It Yourself!

Modify the temperature and `isRaining` values in the cell above and run it again to see different advisories.

## Example 3: Student Grade Calculator

Here's a more complex example that determines a student's grade and eligibility for honors based on their test score and homework completion.


```javascript
%%js
let testScore = 88;
let homeworkCompleted = 0.95;  // 95% of homework completed

console.log(`Test Score: ${testScore}`);
console.log(`Homework Completion: ${homeworkCompleted * 100}%`);
console.log("\nGrade Evaluation:");

if (testScore >= 90) {
    // A grade territory
    if (homeworkCompleted >= 0.9) {
        console.log("Grade: A");
        console.log("Status: Honors eligible! Excellent work!");
    } else {
        console.log("Grade: A");
        console.log("Status: Great test score, but complete more homework for honors.");
    }
} else {
    // Below A grade
    if (testScore >= 80) {
        // B grade territory
        if (homeworkCompleted >= 0.9) {
            console.log("Grade: B+");
            console.log("Status: Good work! A little more effort on tests for honors.");
        } else {
            console.log("Grade: B");
            console.log("Status: Solid performance. Focus on homework completion.");
        }
    } else {
        // Below B grade
        console.log("Grade: C or below");
        console.log("Status: Let's meet to discuss how to improve your grade.");
    }
}
```

## 🎯 Quick Check: Test Your Understanding

What would happen in the grade calculator if:
1. `testScore = 92` and `homeworkCompleted = 0.85`?
2. `testScore = 85` and `homeworkCompleted = 0.95`?
3. `testScore = 75` and `homeworkCompleted = 0.80`?

Try changing the values above and running the code to check your predictions!

## Real-World Applications

Nested conditionals are used everywhere in programming:

1. **Video Games**: Checking player state, inventory, and abilities
2. **E-commerce**: Determining shipping costs, discounts, and eligibility
3. **Social Media**: Filtering content based on user preferences and privacy settings
4. **Banking Apps**: Validating transactions based on balance, limits, and security checks
5. **Fitness Apps**: Providing workout recommendations based on fitness level and goals

The key is that nested conditionals let you make **hierarchical decisions** where one choice determines what other choices you need to make next.

## Summary

- **Nested conditionals** are conditionals inside other conditionals
- They allow us to create complex decision-making logic
- Each path through the nested structure is exclusive - you only go down one path
- Use nested conditionals when the conditions you need to check depend on previous conditions
- Remember to handle all possible cases (including edge cases!)
