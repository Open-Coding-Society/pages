---
layout: post
courses: {'csse': {'week': 5}}
categories: ['JavaScript', 'Iteration']
lesson_language: JavaScript
lesson_topic: Iteration
lesson_part: interactive
lesson_type: lesson
microblog: True
codemirror: True
title: Iterations
description: An intro to iterations using Code Runner
permalink: /js/iterations
author: Rishab Shyamal, Flora Segale, Chetan Tiduwar
---

## Intro to iterations
- The basic gist of iterations are to repeat multiple actions for a desirable result
- Used to repeat code more efficiently compared to just writing out all the functions line by line


The syntax of a for loop consists of three main parts:


```python
for (initialization; condition; increment) {
    // Code to execute
}
```

Initialization: This sets up a counter variable and runs once at the beginning of the loop.

Condition: Before each iteration, the loop checks this condition. If it's true, the loop continues; if false, the loop ends.

Increment: This updates the counter variable after each iteration.

### For Loop with Syntax Error



{% capture challenge0 %}
Run loop, the fix the Syntax Error
{% endcapture %}

{% capture code0 %}
for (let i = 1, i <= 5; i++) {
    console.log(i);
}
{% endcapture %}

{% capture source0 %}
```python
%%js 

// CODE_RUNNER: Run loop, the fix the Syntax Error

for (let i = 1, i <= 5; i++) {
    console.log(i);
}

```
{% endcapture %}

{% include runners/code.html
   runner_id="js-iterations-0"
   language="javascript"
   challenge=challenge0
   code=code0
   source=source0
%}


### Usage: Looping Through Arrays
You can use a for loop to iterate over elements in an array.



{% capture challenge1 %}
Run loop, then add another fruit to the array and print all fruits
{% endcapture %}

{% capture code1 %}
let fruits = ["Heart Shaped Herb", "Yami Yami no Mi", "Gomu Gomu no Mi"];

for (let i = 0; i < fruits.length; i++) {
    console.log(fruits[i]);
}
{% endcapture %}

{% capture source1 %}
```python
%%js 

// CODE_RUNNER: Run loop, then add another fruit to the array and print all fruits 

let fruits = ["Heart Shaped Herb", "Yami Yami no Mi", "Gomu Gomu no Mi"];

for (let i = 0; i < fruits.length; i++) {
    console.log(fruits[i]);
}

```
{% endcapture %}

{% include runners/code.html
   runner_id="js-iterations-1"
   language="javascript"
   challenge=challenge1
   code=code1
   source=source1
%}


Add two of your own fruits and try it out!

### Objects

for loops can also be used to iterate **objects** over each **key** and its **value**



{% capture challenge2 %}
Run loop, then change to your Personal Info
{% endcapture %}

{% capture code2 %}
const personInfo = { // Define an object
    name: "Rishab",
    age: 15,
    city: "San Diego",
    occupation: "High School Student"
};

for (let key in personInfo) { // Notice we are using for... in... instead of for... of...
    console.log(key + ": " + personInfo[key]);
}
{% endcapture %}

{% capture source2 %}
```python
%%js 

// CODE_RUNNER: Run loop, then change to your Personal Info

const personInfo = { // Define an object
    name: "Rishab",
    age: 15,
    city: "San Diego",
    occupation: "High School Student"
};

for (let key in personInfo) { // Notice we are using for... in... instead of for... of...
    console.log(key + ": " + personInfo[key]);
}
```
{% endcapture %}

{% include runners/code.html
   runner_id="js-iterations-2"
   language="javascript"
   challenge=challenge2
   code=code2
   source=source2
%}


# 🌿 **Understanding `while` Loops**

A **`while` loop** repeats a block of code **as long as a condition is true**.  
It’s useful when you don’t know exactly how many times something should run — you just know the rule for when it should stop.

A `while` loop always includes:

- **A starting value**  
- **A condition** checked before each loop  
- **A change** inside the loop that eventually makes the condition false  

If the condition never becomes false, the loop runs forever — an **infinite loop**.

# 🌱 **Simple Example**



{% capture challenge3 %}
Run loop, then change the starting value, condition, and increment
{% endcapture %}

{% capture code3 %}
let counter = 0;

while (counter < 5) {
  console.log("The counter is:", counter);
  counter += 1;
}
{% endcapture %}

{% capture source3 %}
```javascript
%%js

// CODE_RUNNER: Run loop, then change the starting value, condition, and increment
let counter = 0;

while (counter < 5) {
  console.log("The counter is:", counter);
  counter += 1;
}
```
{% endcapture %}

{% include runners/code.html
   runner_id="js-iterations-3"
   language="javascript"
   challenge=challenge3
   code=code3
   source=source3
%}


Try experimenting with:

- Changing the starting value  
- Changing the condition  
- Changing the increment (e.g., `counter += 2`)  
- Making it count down instead of up  

# 🌼 **Playful Example: Growing Vine**

This version is visual, fun, and great for experimenting with iteration.

Try experimenting with:

- Changing the maximum length  
- Make the vine shrink instead of grow  
- Replace the emoji with another symbol  
- Increase the growth rate (e.g., `length += 2`)  



{% capture challenge4 %}
Run loop to see growing vine
{% endcapture %}

{% capture code4 %}
// Growing vine using a while loop


let length = 1;

while (length <= 10) {
  console.log("🌿".repeat(length));
  length += 1;
}
{% endcapture %}

{% capture source4 %}
```python
%%js   
// Growing vine using a while loop

// CODE_RUNNER: Run loop to see growing vine

let length = 1;

while (length <= 10) {
  console.log("🌿".repeat(length));
  length += 1;
}

```
{% endcapture %}

{% include runners/code.html
   runner_id="js-iterations-4"
   language="javascript"
   challenge=challenge4
   code=code4
   source=source4
%}


## Challenge Iteration
Write an iteration to calculate the sum of all numbers from 1 to n 
Test it with an input of 5

Hint: use 'n' to define your condition, and replace 'n' with the number that you want to be the upper limit you are adding to your sum.



{% capture challenge5 %}
Complete function to Sum Numbers from 1 to n, and call the function with a parameter of your choice
{% endcapture %}

{% capture code5 %}
function sumNumbers(n) {
    let sum = 0;
{% endcapture %}

{% capture source5 %}
```python
%%js 

// CODE_RUNNER: Complete function to Sum Numbers from 1 to n, and call the function with a parameter of your choice

function sumNumbers(n) {
    let sum = 0;
```
{% endcapture %}

{% include runners/code.html
   runner_id="js-iterations-5"
   language="javascript"
   challenge=challenge5
   code=code5
   source=source5
%}

