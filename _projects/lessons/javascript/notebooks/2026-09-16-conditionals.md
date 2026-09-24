---
layout: post
courses: {'csse': {'week': 5}}
categories: ['JavaScript', 'Nested-Conditionals']
lesson_language: JavaScript
lesson_topic: Nested-Conditionals
lesson_source: CS111
lesson_type: lesson
codemirror: True
microblog: True
title: Conditionals & Nested Conditionals 
description: Conditionals using Code Runner
permalink: /js/conditionals
author: Indira Viswesh and Angel Bulatao
---




## Define & Lesson Plan Overview

**POV**: CSSE students need a way to build games using multiple true/false statements to make  game more interactive

**Learning Goal**: Students will get a brief understanding on how to use nested conitionals & **IF** and **THEN** statements 

**Learning Objective**: By the end of this lesson, you should be able to understand nested conditionals

## Introduction (1-3 minutes)


**Conditionals**

Conditionals allow dynamic responses to different blocks of code depending on wheater it is true or false. This allows user interaction with code.

Types: if, if-else. else if, (+switch)

1. **If** executes a block of code if it's true
2. **If...else** is similar to a true/false, executes one block of code if the output is true and another if the output is false
3. **Else... if** 
Executes a block of code if the preceding if condition evaluates to false, **AND** its own specified condition evaluates to true. 
4. **Switch** 
Compares multiple possible outcomes, more complex than true/false.

____________________________________________________

**Think**: Imagine your morning alarm rings and you must decide whether to get up, snooze for 5 more minutes, or go back to sleep.

First, you would check whether it is a school weekday or a weekend, along with a few other details.

**IF** it is a school weekday:
- Check the alarm to see whether you can squeeze in 5 more minutes of sleep. But what if you have a test to study for?
  - **IF** it is a school weekday **AND** you have a test to study for, you get up and study.
  - **ELSE** (if it is a school weekday but you do not have a test), you snooze your alarm for 5 more minutes.

**ELSE** (if it is a weekend):
- You can ignore the alarm, **BUT** you still need to check whether you have homework.
  - **IF** you have homework, you get up and do it.
  - **ELSE**, you go back to sleep.

See how you're making decisions **INSIDE** other decisions? That's a **nested conditional**!




## Nested Conditional Code 

Now let's look at an example of the nested conditional code using the analogy above.

~~~js
// Decide what to do when the morning alarm rings
if (weekday) {
  // On a school weekday, check whether you have a test to study for.
    
    if (test) {
        study();
    console.log("Wake up and study for the test.");
    } else {
    snoozeAlarm();
    console.log("Snooze the alarm for 5 more minutes.");
    }
    
} else {
  // On a weekend, check whether you have homework.
  if (homework) {
    doHomework();
    console.log("Wake up and do your homework.");
    } else {
    goBackToSleep();
    console.log("Go back to sleep.");
    }
}
~~~

In the code example above, there are 2 nested conditionals: one inside the weekday branch and one inside the weekend branch. If it is a weekday, the code checks whether you have a test. If it is a weekend, it skips the weekday branch and checks whether you have homework.

**Now you go ahead and try!** (3 minutes)

*Extra info*: Using 'const'' lets us to store data and control variables

{% capture challenge0 %}
Complete the nested conditional to make it list if the numbers 1-10 are odd or even and if they are divisible by 3.
{% endcapture %}

{% capture code0 %}
const NUMBERS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

for (let number of NUMBERS) {
    if (number % 2 === 0) {
        console.log(number + " is even");
        
        // TODO: Add a nested if statement here to check if divisible by 3
        
    } else {
        console.log(number + " is odd");
        
        // TODO: Add a nested if statement here to check if divisible by 3
        
    }
}

// Expected output:
// 1 is odd
// 2 is even
// 3 is odd
// 3 is also divisible by 3
// 4 is even
// 5 is odd
// 6 is even
// 6 is also divisible by 3
// 7 is odd
// 8 is even
// 9 is odd
// 9 is also divisible by 3
// 10 is even
{% endcapture %}

{% capture source0 %}
```javascript
%%js

// CODE_RUNNER: Complete the nested conditional to make it list if the numbers 1-10 are odd or even and if they are divisible by 3.

const NUMBERS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

for (let number of NUMBERS) {
    if (number % 2 === 0) {
        console.log(number + " is even");
        
        // TODO: Add a nested if statement here to check if divisible by 3
        
    } else {
        console.log(number + " is odd");
        
        // TODO: Add a nested if statement here to check if divisible by 3
        
    }
}

// Expected output:
// 1 is odd
// 2 is even
// 3 is odd
// 3 is also divisible by 3
// 4 is even
// 5 is odd
// 6 is even
// 6 is also divisible by 3
// 7 is odd
// 8 is even
// 9 is odd
// 9 is also divisible by 3
// 10 is even
```
{% endcapture %}

{% include runners/code.html
   runner_id="js-nested-conditionals-0"
   language="javascript"
   challenge=challenge0
   code=code0
   source=source0
%}




{% capture challenge1 %}
Now, you're a bouncer at a nightclub. You need to make a for loop with a nested conditional that will check if people are of the correct age, and if they aren't, it should check if they wear sunglasses. If they are underage but they still have sunglasses, they should be let in.
{% endcapture %}

{% capture code1 %}
// List of people trying to get into the nightclub
const fruits = [
  { name: 'jimmy', age: 15, wearsSunglasses: false },
  { name: 'sara', age: 5, wearsSunglasses: true },
  { name: 'alex', age: 22, wearsSunglasses: true },
  { name: 'morgan', age: 18, wearsSunglasses: false },
  { name: 'dakota', age: 21, wearsSunglasses: false },
  { name: 'casey', age: 25, wearsSunglasses: true }
];

// Check everyone at the door
for (const person of people) {
  if (person.age >= 21) {
    // TODO: Add nested conditional to check if person wears sunglasses
    // If they do, print: person.name + " is free to enter because they're over 21 and they have sunglasses"
    // Otherwise, print: person.name + " is free to enter"

  } else {
    // TODO: Add nested conditional to check if person wears sunglasses
    // If they do, print: person.name + " is free to enter because they have sunglasses"
    // Otherwise, print: person.name + " is not free to enter because they are underage"

  }
}
{% endcapture %}

{% capture source1 %}
```javascript
%%js

// CODE_RUNNER: Now, you're a bouncer at a nightclub. You need to make a for loop with a nested conditional that will check if people are of the correct age, and if they aren't, it should check if they wear sunglasses. If they are underage but they still have sunglasses, they should be let in.

// List of people trying to get into the nightclub
const people = [
  { name: 'jimmy', age: 15, wearsSunglasses: false },
  { name: 'sara', age: 5, wearsSunglasses: true },
  { name: 'alex', age: 22, wearsSunglasses: true },
  { name: 'morgan', age: 18, wearsSunglasses: false },
  { name: 'dakota', age: 21, wearsSunglasses: false },
  { name: 'casey', age: 25, wearsSunglasses: true }
];

// Check everyone at the door
for (const person of people) {
  if (person.age >= 21) {
    // TODO: Add nested conditional to check if person wears sunglasses
    // If they do, print: person.name + " is free to enter because they're over 21 and they have sunglasses"
    // Otherwise, print: person.name + " is free to enter"

  } else {
    // TODO: Add nested conditional to check if person wears sunglasses
    // If they do, print: person.name + " is free to enter because they have sunglasses"
    // Otherwise, print: person.name + " is not free to enter because they are underage"

  }
}
```
{% endcapture %}

{% include runners/code.html
   runner_id="js-nested-conditionals-1"
   language="javascript"
   challenge=challenge1
   code=code1
   source=source1
%}


## Homework
Make a nested conditional that does the following: 
1. contains more than 1 nested conditional
2. use the numbers 1-100
3. check if each number is divisible by each factor of 5



{% capture challenge2 %}
Make a nested conditional homework
{% endcapture %}

{% capture code2 %}

{% endcapture %}

{% capture source2 %}
```javascript
%%js

// CODE_RUNNER: Make a nested conditional homework
```
{% endcapture %}

{% include runners/code.html
   runner_id="js-nested-conditionals-2"
   language="javascript"
   challenge=challenge2
   code=code2
   source=source2
%}

