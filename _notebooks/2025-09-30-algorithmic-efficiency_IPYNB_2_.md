---
layout: post
courses: {'csp': {'week': 1}}
categories: ['Python', 'Algorithmic-Efficiency']
lesson_language: Python
lesson_topic: Algorithmic-Efficiency
lesson_part: interactive
lesson_type: lesson
toc: True
comments: False
title: 3.17 Algorithmic Efficiency
description: Learn about algorithms and how they can be more or less efficient
permalink: /peppa-maze/algorithmic-efficiency
---

## Computer Science Principles Lesson 3.17 - Algorithmic Efficiency

We all love video games - getting to do things that you could never in real life. Some games are simple, 2D games with basic mechanics. Others have complex 3D graphics with ray-tracing, collisions, and a whole bunch of game mechanics that are hard to wrap your head around! Have you ever wondered how these games are able to do so much, so fast? While processing power is a part of it, one of the biggest factors is completely in the hands of the developer - algorithmic efficiency.

### Nice Yap, but What Does "Algorithmic Efficiency" Even Mean?

Okay, so this "algorithmic efficiency" thing is <i>important</i>, but what even is it?

To put it simply, <strong>algorithmic efficiency refers to the speed and memory usage of a computer algorithm</strong>, which is important to keep track of when coding. The quicker and less memory-intensive an algorithm is, the more efficient it is considered.

### What's So Important About Algorithmic Efficiency?

Considering the efficiency of algorithms is important in computer science <strong>because processing power and time are limited</strong>. It is much better to have an algorithm finish quickly while using little RAM then for it to take 10 minutes and a few fire extinguishers to get the task done!

### How do We Measure Algorithmic Efficiency?

Algorithmic efficiency is mainly dependent on time complexity and memory usage. Time complexity can be measured using <strong>Big-O Notation</strong>. Big-O notation is a representation of the average amount of extra steps a computer has to take for input as it grows. Big-O notation does not necessarily show the exact amount of steps a computer takes to complete an algorithm, but it gives a good estimate based on the average input. Memory usage is mostly dependent on time complexity, and can be derived from an algorithm's Big-O representation. You'll see some examples of Big-O notation later on in this lesson.

### Example: Designing Algorithms and Measuring Their Efficiency Using Python

Let's create an algorithm and see how algorithmically efficient it is using Big-O notation.


```python
# Define some simple variables
index = 0
amount = 10

# The algorithm we'll be analyzing:
while index < amount:
    print("I love Python!")
    index += 1
```

In this example, we repeat some code while the "index" variable is less than the "amount" variable. Each time, we increment "index" by 1. How algorithmically efficient is this algorithm? Let's use Big-O notation to show it:

First, let's look at the outermost loop. The loop will execute "amount" times, so the computer will have to take one extra step for every extra value of "amount". The Big-O notation for this would be <strong>O(n)</strong>, because the computer needs to take n steps for every n inputs, which in this case is the value of "amount". Because "print()" and "index += 1" are things that the computer can do in one step, they have O(1) time complexity (time complexity refers to how many steps a computer takes on average to complate an algorithm, which is what Big-O notation represents). All together, this algorithm has O(n) time complexity.

### Example: Designing Algorithms and Measuring Their Efficiency Using Javascript

Let's create an algorithm and see how algorithmically efficient it is using Big-O notation, however this time we'll use Javascript.


```javascript
%%js
// Define variables
const amount = 8;
let outerIndex = 0;
let innerIndex = 0;
let overallIndex = 0;

// The algorithm we'll be analyzing:
while (outerIndex < amount) { //Outer loop
    innerIndex = 0;
    while (innerIndex < amount) { //Inner loop
        overallIndex++;
        console.log(`Iteration #${overallIndex}`);
        innerIndex++;
    }
    outerIndex++;
}
```


    <IPython.core.display.Javascript object>


This one is a little more complicated. The outer loop runs "amount" times, but so does the inner loop. This means that the whole thing runs "amout" times, "amount" times! In terms of Big-O notation, the outer loop has a time complexity of O(n), and within this loop, another loop of O(n) time complexity runs. To figure out the time complexity of the whole algorithm, we need to multiply the inner time complexity by the outer one. What we get is O(n * n), or O(n^2). <strong>So, this algorithm's time complexity is O(n^2).</strong>
