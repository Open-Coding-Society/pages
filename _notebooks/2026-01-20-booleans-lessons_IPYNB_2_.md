---
layout: post
courses: {'csse': {'week': 5}}
categories: ['JavaScript', 'Booleans']
lesson_language: JavaScript
lesson_topic: Booleans
lesson_part: interactive
lesson_type: lesson
microblog: True
codemirror: True
title: Booleans
description: An intro to booleans using Code Runner
permalink: /js/booleans
author: Ahmad, Matt, Ashi
---

 Booleans

- Booleans are one of the most fundamental data types in programming
- A boolean can only have two values: `true` or `false`
- Used to make decisions in code and control the flow of programs

The basic syntax of a boolean:
```javascript
let isStudent = true;
let isRaining = false;
```


```javascript
%%js

let isActive = true;
console.log(isActive);
console.log("Boolean value: " + isActive);
console.log("Boolean value: " + isActive);
```


    <IPython.core.display.Javascript object>


### Usage: Boolean Comparisons
You can use comparison operators to create boolean values.



{% capture challenge0 %}
Run code, then change to your own conditions
{% endcapture %}

{% capture code0 %}
let hasLicense = true;
let hasCar = false;
let canDrive = hasLicense && hasCar;

console.log("Has license: " + hasLicense);
console.log("Has car: " + hasCar);
console.log("Can drive: " + canDrive);
{% endcapture %}

{% capture source0 %}
```javascript
%%js

let age = 15;
let isAdult = age >= 18;
let isTeenager = age >= 13 && age <= 19;

console.log("Is adult: " + isAdult);
console.log("Is teenager: " + isTeenager);

// Test with different ages
console.log(isAdult && isTeenager); // false - can't be both adult and teenager
console.log(isAdult || isTeenager); // true - at least one is true

```
{% endcapture %}

{% include runners/code.html
   runner_id="js-booleans-0"
   language="javascript"
   challenge=challenge0
   code=code0
   source=source0
%}



    <IPython.core.display.Javascript object>


### Boolean Operators
Booleans can be combined using **logical operators** like `&&` (and), `||` (or), and `!` (not)



{% capture challenge1 %}
Run code, then change to your own conditions
{% endcapture %}

{% capture code1 %}
function isPositiveAndEven(num) {
    let isPositive = num > 0;
    let isEven = num % 2 === 0;
    return isPositive && isEven;
}

document.body.innerHTML += isPositiveAndEven(8); // true
{% endcapture %}

{% capture source1 %}
```javascript
%%js

// CODE_RUNNER: Run code, then change to your own conditions
let hasLicense = true;
let hasCar = false;
let canDrive = hasLicense && hasCar;

console.log("Has license: " + hasLicense);
console.log("Has car: " + hasCar);
console.log("Can drive: " + canDrive);

```
{% endcapture %}

{% include runners/code.html
   runner_id="js-booleans-1"
   language="javascript"
   challenge=challenge1
   code=code1
   source=source1
%}



## HomeWork Boolean
Write a function that checks if a number is positive AND even

Test it with an input of 8

Hint: use the modulo operator (%) to check if a number is even, and comparison operators to check if it's positive.



```javascript
%%js
//code_runner: Run code, then change to your own conditions
function isPositiveAndEven(num) {
    let isPositive = num > 0;
    let isEven = num % 2 === 0;
    return isPositive && isEven;
}

document.body.innerHTML += isPositiveAndEven(8); // true

```
