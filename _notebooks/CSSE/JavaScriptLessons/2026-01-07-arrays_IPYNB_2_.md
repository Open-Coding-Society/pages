---
layout: post
courses: {'csse': {'week': 5}}
categories: ['JavaScript', 'Arrays']
lesson_language: JavaScript
lesson_topic: Arrays
lesson_part: interactive
lesson_type: lesson
codemirror: True
microblog: True
title: Arrays
description: Learn about arrays in JavaScript, including how to create, access, and manipulate them.
permalink: /js/arrays
author: Sadaf, Sujay, Arjun, Joshika
---

## What are Arrays?



An **array** is a collection of elements (values) stored in a single variable. Each element in an array can be accessed by its **index** (position), starting from 0.

Think of an array like a row of boxes, each containing a value:
- Box 0 contains the first element
- Box 1 contains the second element  
- Box 2 contains the third element
- And so on...

### Why Use Arrays?
- Store multiple values in one variable
- Easy to access values by position
- Useful for loops (process many items at once)
- Organize related data together



{% capture challenge0 %}
Add or remove a new value in the array and see what happens!
{% endcapture %}

{% capture code0 %}
let fruits = ["apple", "banana", "orange", "grape"];

console.log("My array of fruits:");
console.log(fruits);
console.log();

console.log("First fruit (index 0):", fruits[0]);
console.log("Third fruit (index 2):", fruits[2]);
console.log();


console.log("Number of fruits:", fruits.length);
{% endcapture %}

{% capture source0 %}
```javascript
%%js

// CODE_RUNNER: Add or remove a new value in the array and see what happens!

let fruits = ["apple", "banana", "orange", "grape"];

console.log("My array of fruits:");
console.log(fruits);
console.log();

console.log("First fruit (index 0):", fruits[0]);
console.log("Third fruit (index 2):", fruits[2]);
console.log();


console.log("Number of fruits:", fruits.length);
```
{% endcapture %}

{% include runners/code.html
   runner_id="js-arrays-0"
   language="javascript"
   challenge=challenge0
   code=code0
   source=source0
%}


## Modifying Arrays

You can change, add, or remove elements from an array:



{% capture challenge1 %}
Practice modifying arrays by changing, adding, and removing elements!
{% endcapture %}

{% capture code1 %}
// Start with an array
let colors = ["red", "blue", "green"];
console.log(colors);
console.log();

// Change an element
colors[1] = "yellow";
console.log(colors);
console.log();

// Add an element
colors.push("purple");
console.log(colors);
console.log();

// Remove an element
colors.splice(colors.indexOf("red"), 1);
console.log(colors);
{% endcapture %}

{% capture source1 %}
```javascript
%%js

// CODE_RUNNER: Practice modifying arrays by changing, adding, and removing elements!

// Start with an array
let colors = ["red", "blue", "green"];
console.log(colors);
console.log();

// Change an element
colors[1] = "yellow";
console.log(colors);
console.log();

// Add an element
colors.push("purple");
console.log(colors);
console.log();

// Remove an element
colors.splice(colors.indexOf("red"), 1);
console.log(colors);
```
{% endcapture %}

{% include runners/code.html
   runner_id="js-arrays-1"
   language="javascript"
   challenge=challenge1
   code=code1
   source=source1
%}


## Looping Through Arrays

Arrays are powerful when combined with loops. You can process each element without writing it by hand:



{% capture challenge2 %}
Modify the numbers array to see different outputs
{% endcapture %}

{% capture code2 %}
// Using a for loop to go through each element
let numbers = [10, 20, 30, 40, 50];

console.log("Numbers in the array:");
for (let num of numbers) {
    console.log(num);
}

console.log();
console.log("Double each number:");
for (let num of numbers) {
    console.log(num * 2);
}

console.log();
console.log("Using index to access elements:");
for (let i = 0; i < numbers.length; i++) {
    // conversion fails with template literals
    console.log(`Index ${i}: ${numbers[i]}`);
    // conversion works with concat
    console.log("Index " + i + ": " + numbers[i] );

}
{% endcapture %}

{% capture source2 %}
```javascript
%%js

// CODE_RUNNER: Modify the numbers array to see different outputs

// Using a for loop to go through each element
let numbers = [10, 20, 30, 40, 50];

console.log("Numbers in the array:");
for (let num of numbers) {
    console.log(num);
}

console.log();
console.log("Double each number:");
for (let num of numbers) {
    console.log(num * 2);
}

console.log();
console.log("Using index to access elements:");
for (let i = 0; i < numbers.length; i++) {
    // conversion fails with template literals
    console.log(`Index ${i}: ${numbers[i]}`);
    // conversion works with concat
    console.log("Index " + i + ": " + numbers[i] );

}
```
{% endcapture %}

{% include runners/code.html
   runner_id="js-arrays-2"
   language="javascript"
   challenge=challenge2
   code=code2
   source=source2
%}


## Real-World Example: Student Grades

Let's calculate the average grade of students:



{% capture challenge3 %}
Change the student grades to yours in the array to see different results
{% endcapture %}

{% capture code3 %}
// Array of student grades
let grades = [85, 92, 78, 95, 88, 91];

// Calculate the sum
let total = 0;
for (let grade of grades) {
    total = total + grade;
}

// Calculate the average
let average = total / grades.length;

console.log(`Student grades: ${grades}`);
console.log(`Total points: ${total}`);
console.log(`Number of students: ${grades.length}`);
console.log(`Average grade: ${average.toFixed(1)}`);
console.log();

// Find the highest and lowest grades
console.log(`Highest grade: ${Math.max(...grades)}`);
console.log(`Lowest grade: ${Math.min(...grades)}`);
{% endcapture %}

{% capture source3 %}
```javascript
%%js

// CODE_RUNNER: Change the student grades to yours in the array to see different results

// Array of student grades
let grades = [85, 92, 78, 95, 88, 91];

// Calculate the sum
let total = 0;
for (let grade of grades) {
    total = total + grade;
}

// Calculate the average
let average = total / grades.length;

console.log(`Student grades: ${grades}`);
console.log(`Total points: ${total}`);
console.log(`Number of students: ${grades.length}`);
console.log(`Average grade: ${average.toFixed(1)}`);
console.log();

// Find the highest and lowest grades
console.log(`Highest grade: ${Math.max(...grades)}`);
console.log(`Lowest grade: ${Math.min(...grades)}`);
```
{% endcapture %}

{% include runners/code.html
   runner_id="js-arrays-3"
   language="javascript"
   challenge=challenge3
   code=code3
   source=source3
%}


## Key Takeaways

✅ **Arrays** store multiple values in a single variable  
✅ **Index** starts at 0 for the first element  
✅ Access elements using `array[index]`  
✅ Use **loops** to process all elements  
✅ Common operations: append, remove, change, loop, sum, average  

Arrays are one of the most important data structures in programming. Master them and you'll be able to solve many problems efficiently!

# Arrays Homework 🎯

Welcome to the Arrays homework! These exercises will help you practice the key array concepts from the lesson: accessing elements, modifying arrays, looping through arrays, and performing calculations.

Complete all exercises below. Good luck! 💪

---

## Exercise 1: Array Basics - Access Elements

Create an array with 5 different items (could be favorite movies, books, games, etc.). Then:
1. Print the entire array
2. Access and print the first element (index 0)
3. Access and print the last element
4. Print the total number of items in the array



{% capture challenge4 %}
Exercise 1 - Array Basics
{% endcapture %}

{% capture code4 %}
// TODO: Write your code here for Exercise 1
// Create an array with 5 items
// Print the array
// Print the first element
// Print the last element
// Print the length
{% endcapture %}

{% capture source4 %}
```javascript
%%js

// CODE_RUNNER: Exercise 1 - Array Basics

// TODO: Write your code here for Exercise 1
// Create an array with 5 items
// Print the array
// Print the first element
// Print the last element
// Print the length

```
{% endcapture %}

{% include runners/code.html
   runner_id="js-arrays-4"
   language="javascript"
   challenge=challenge4
   code=code4
   source=source4
%}


## Exercise 2: Modify Arrays

Start with this shopping list: `["milk", "eggs", "bread", "cheese"]`
Then perform these operations:
1. Print the original array
2. Change the second item to "butter"
3. Add "yogurt" to the end using push()
4. Remove "bread" from the array
5. Print the final array



{% capture challenge5 %}
Exercise 2 - Arrays Manipulation
{% endcapture %}

{% capture code5 %}
// TODO: Write your code here for Exercise 2
// Start with the shopping list
// Modify it as described above
{% endcapture %}

{% capture source5 %}
```javascript
%%js

// CODE_RUNNER: Exercise 2 - Arrays Manipulation

// TODO: Write your code here for Exercise 2
// Start with the shopping list
// Modify it as described above
```
{% endcapture %}

{% include runners/code.html
   runner_id="js-arrays-5"
   language="javascript"
   challenge=challenge5
   code=code5
   source=source5
%}


## Exercise 3: Loop Through an Array

Create an array with 5 numbers: `[10, 25, 30, 15, 20]`

Write a loop that:
1. Prints each number with a message (e.g., "Number: 10")
2. Prints each number multiplied by 2
3. Calculates and prints the sum of all numbers



{% capture challenge6 %}
Exercise 3 - Arrays Manipulation
{% endcapture %}

{% capture code6 %}
// TODO: Write your code here for Exercise 3
// Create the numbers array
// Loop through and print each number
// Print each number multiplied by 2
// Calculate and print the sum
{% endcapture %}

{% capture source6 %}
```javascript
%%js

// CODE_RUNNER: Exercise 3 - Arrays Manipulation

// TODO: Write your code here for Exercise 3
// Create the numbers array
// Loop through and print each number
// Print each number multiplied by 2
// Calculate and print the sum

```
{% endcapture %}

{% include runners/code.html
   runner_id="js-arrays-6"
   language="javascript"
   challenge=challenge6
   code=code6
   source=source6
%}


Google form link is here: https://forms.gle/X47CB92yKuLVRHq98 
