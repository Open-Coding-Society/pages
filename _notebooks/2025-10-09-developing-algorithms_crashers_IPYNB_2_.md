---
layout: post
courses: {'csp': {'week': 1}}
categories: ['Python', 'Algorithms']
lesson_language: Python
lesson_topic: Developing-Algorithms
lesson_part: interactive
lesson_type: lesson
toc: True
comments: False
title: 3.9 Developing Algorithms
tags: ['python', 'javascript', 'variables', 'assignment', 'beginner']
description: Learn how to develop algorithms through the Peppa Pig Maze game
permalink: /csp/developing-algorithms/crashers
---

# Peppa Pig Algorithm Adventures

Peppa Pig wants to reach the end of a maze! Along the way, we'll explore what **algorithms** are — step-by-step sets of instructions to solve problems — and how computers use them to make decisions and perform actions.

## What Is an Algorithm?

An **algorithm** is a clear, step-by-step process for solving a problem. You can think of it like a recipe: each instruction must be followed in order to reach the correct result.

For example, if Peppa wants to reach her toy chest, her algorithm might be:

1. Walk forward three steps
2. Turn left
3. Walk two steps
4. Open the chest

In programming, algorithms are written using code so that computers can follow similar logical steps automatically.

## 1. Simple Algorithm Examples in Python

Let's start with a basic example showing two ways to add two numbers. Both are simple algorithms that achieve the same goal differently.


```python
# Example 1: Two different algorithms to add two numbers
a = 3
b = 5

# Algorithm 1: Step-by-step addition
def add_numbers_manual(x, y):
    total = 0       # start from 0
    total += x      # add first number
    total += y      # add second number
    return total

# Algorithm 2: Direct addition (different approach)
def add_numbers_direct(x, y):
    return x + y    # simply add them in one step

print('Sum using step-by-step addition:', add_numbers_manual(a, b))
print('Sum using direct addition:', add_numbers_direct(a, b))
```

    Sum using method A: 8
    Sum using method B: 8


Both methods produce the same result. The first shows a clear step-by-step algorithm, while the second uses a simpler Python expression.

## 2. Boolean Expressions and Conditional Statements

Algorithms often make decisions. A **conditional statement** tells the computer to do something *only if* a certain condition is true. This uses **Boolean logic** (true or false values).


```python
x = 10
y = 5

# Conditional statement algorithm
if x > y:
    print('x is greater than y')
else:
    print('y is greater or equal to x')

# Equivalent Boolean expression
print('x is greater than y' if x > y else 'y is greater or equal to x')
```

    x is greater than y
    x is greater than y


Here, the algorithm checks whether one number is greater than another and prints a message accordingly — just like a maze game might check whether Peppa can move in a direction before she takes a step.


```javascript
%%javascript
// Boolean algorithm example in JavaScript
function isEven(num) { 
  return num % 2 === 0;  // returns true or false
}

let value = 7;

// Use the Boolean result in a conditional statement
let result = isEven(value);  // result is true if even, false if odd

if (result) {
  console.log(value + ' is even');
} else {
  console.log(value + ' is odd');
}

// You can also directly print the Boolean value
console.log('Is ' + value + ' even? ' + result);

```


    <IPython.core.display.Javascript object>


This JavaScript code defines a function called `isEven` that checks if a number is even using the modulo operator. It then uses this function to determine if the variable `value` is even or odd, printing a message to the console. 

## 3. Peppa Pig Maze Algorithm (JavaScript Example)

Now let’s look at a JavaScript version that uses an algorithm to control Peppa’s movement through a maze. Each time you press a button, the algorithm checks whether the move is allowed (no walls or boundaries) and updates Peppa’s position.


```python
from IPython.display import display, HTML

display(HTML("""
<style>
 /* --- Container setup to center everything --- */
 .maze-demo-container {
   display: flex;
   flex-direction: column;
   align-items: center;
   justify-content: center;
   text-align: center;
   margin-top: 20px;
   margin-bottom: 20px;
 }

 /* --- Maze grid layout --- */
 .maze-demo-grid {
   display: grid;
   grid-template-columns: repeat(5, 40px);
   grid-template-rows: repeat(5, 40px);
   gap: 2px;
   margin: 10px auto;
   justify-content: center;
 }

 /* --- Each cell in the maze --- */
 .maze-demo-cell {
   width: 40px;
   height: 40px;
   background: #fff;
   border: 1px solid #ccc;
   display: flex;
   align-items: center;
   justify-content: center;
 }

 /* --- Wall cells are darker --- */
 .maze-demo-wall {
   background: #444;
 }

 /* --- Peppa's character appearance --- */
 .maze-demo-peppa {
   background: #ff69b4;
   border-radius: 50%;
   width: 30px;
   height: 30px;
 }

 /* --- Button control styling --- */
 .maze-demo-controls {
   text-align: center;
   margin-top: 10px;
 }

 .maze-demo-controls button {
   margin: 3px;
   padding: 6px 12px;
   border-radius: 6px;
   border: none;
   background: #ffb6c1;
   cursor: pointer;
   font-size: 14px;
   transition: 0.2s;
 }

 /* --- Button hover effect --- */
 .maze-demo-controls button:hover {
   background: #ff69b4;
   color: white;
 }

 /* --- Message text styling --- */
 #maze-demo-msg {
   margin-top: 10px;
   font-weight: bold;
 }
</style>

<!-- Main HTML layout for the demo -->
<div class="maze-demo-container">
 <h4>🐷 Peppa's Mini Maze Algorithm Demo</h4>

 <!-- Maze grid will be dynamically drawn here -->
 <div id="maze-demo-grid" class="maze-demo-grid"></div>

 <!-- Arrow buttons for movement -->
 <div class="maze-demo-controls">
   <button id="peppa-up">⬆️ Up</button>
   <button id="peppa-down">⬇️ Down</button>
   <button id="peppa-left">⬅️ Left</button>
   <button id="peppa-right">➡️ Right</button>
 </div>

 <!-- Message area for feedback -->
 <div id="maze-demo-msg"></div>
</div>

<script>
(function() {

 // Define the maze grid (1 = wall, 0 = open space)
 const maze = [
   [0, 0, 1, 0, 0],
   [1, 0, 1, 0, 1],
   [0, 0, 0, 0, 0],
   [0, 1, 1, 1, 0],
   [0, 0, 0, 1, 0]
 ];

 // Starting position for Peppa
 let peppa = {x:0, y:0};

 // --- Function to draw the maze on screen ---
 function drawMaze() {
   const grid = document.getElementById('maze-demo-grid');
   if (!grid) return;
   grid.innerHTML = ''; // Clear previous maze state

   // Loop through each cell to build grid
   for (let y=0; y<5; y++) {
     for (let x=0; x<5; x++) {
       let cell = document.createElement('div');
       cell.className = 'maze-demo-cell';

       // If wall, darken cell
       if (maze[y][x] === 1) cell.classList.add('maze-demo-wall');

       // If Peppa is here, draw her
       if (peppa.x === x && peppa.y === y) {
         let peppaDiv = document.createElement('div');
         peppaDiv.className = 'maze-demo-peppa';
         cell.appendChild(peppaDiv);
       }
       grid.appendChild(cell);
     }
   }
 }

 // --- Function to check if Peppa can move ---
 function canPeppaMove(x, y) {
   // Disallow movement outside maze boundaries
   if (x < 0 || x >= 5 || y < 0 || y >= 5) return false;

   // Disallow movement into wall cells
   if (maze[y][x] === 1) return false;

   return true;
 }

 // --- Function to handle movement logic ---
 function movePeppa(dir) {
   let dx = 0, dy = 0;

   // Determine direction offsets
   if (dir === 'up') dy = -1;
   if (dir === 'down') dy = 1;
   if (dir === 'left') dx = -1;
   if (dir === 'right') dx = 1;

   // Calculate new coordinates
   let newX = peppa.x + dx, newY = peppa.y + dy;
   let msg = document.getElementById('maze-demo-msg');

   // Check if move is valid, then update position or warn
   if (canPeppaMove(newX, newY)) {
     peppa.x = newX; peppa.y = newY;
     msg.textContent = "✅ Peppa moved " + dir + "!";
   } else {
     msg.textContent = "❌ Can't move " + dir + " (wall or edge)!";
   }

   // Redraw maze after each move
   drawMaze();
 }

 // --- Attach button events after DOM is ready ---
 setTimeout(function() {
   document.getElementById('peppa-up').onclick = function() { movePeppa('up'); };
   document.getElementById('peppa-down').onclick = function() { movePeppa('down'); };
   document.getElementById('peppa-left').onclick = function() { movePeppa('left'); };
   document.getElementById('peppa-right').onclick = function() { movePeppa('right'); };

   // Draw the initial maze when loaded
   drawMaze();
 }, 100);

})();
</script>
"""))

```



<style>
 /* --- Container setup to center everything --- */
 .maze-demo-container {
   display: flex;
   flex-direction: column;
   align-items: center;
   justify-content: center;
   text-align: center;
   margin-top: 20px;
   margin-bottom: 20px;
 }

 /* --- Maze grid layout --- */
 .maze-demo-grid {
   display: grid;
   grid-template-columns: repeat(5, 40px);
   grid-template-rows: repeat(5, 40px);
   gap: 2px;
   margin: 10px auto;
   justify-content: center;
 }

 /* --- Each cell in the maze --- */
 .maze-demo-cell {
   width: 40px;
   height: 40px;
   background: #fff;
   border: 1px solid #ccc;
   display: flex;
   align-items: center;
   justify-content: center;
 }

 /* --- Wall cells are darker --- */
 .maze-demo-wall {
   background: #444;
 }

 /* --- Peppa's character appearance --- */
 .maze-demo-peppa {
   background: #ff69b4;
   border-radius: 50%;
   width: 30px;
   height: 30px;
 }

 /* --- Button control styling --- */
 .maze-demo-controls {
   text-align: center;
   margin-top: 10px;
 }

 .maze-demo-controls button {
   margin: 3px;
   padding: 6px 12px;
   border-radius: 6px;
   border: none;
   background: #ffb6c1;
   cursor: pointer;
   font-size: 14px;
   transition: 0.2s;
 }

 /* --- Button hover effect --- */
 .maze-demo-controls button:hover {
   background: #ff69b4;
   color: white;
 }

 /* --- Message text styling --- */
 #maze-demo-msg {
   margin-top: 10px;
   font-weight: bold;
 }
</style>

<!-- Main HTML layout for the demo -->
<div class="maze-demo-container">
 <h4>🐷 Peppa's Mini Maze Algorithm Demo</h4>

 <!-- Maze grid will be dynamically drawn here -->
 <div id="maze-demo-grid" class="maze-demo-grid"></div>

 <!-- Arrow buttons for movement -->
 <div class="maze-demo-controls">
   <button id="peppa-up">⬆️ Up</button>
   <button id="peppa-down">⬇️ Down</button>
   <button id="peppa-left">⬅️ Left</button>
   <button id="peppa-right">➡️ Right</button>
 </div>

 <!-- Message area for feedback -->
 <div id="maze-demo-msg"></div>
</div>

<script>
(function() {

 // Define the maze grid (1 = wall, 0 = open space)
 const maze = [
   [0, 0, 1, 0, 0],
   [1, 0, 1, 0, 1],
   [0, 0, 0, 0, 0],
   [0, 1, 1, 1, 0],
   [0, 0, 0, 1, 0]
 ];

 // Starting position for Peppa
 let peppa = {x:0, y:0};

 // --- Function to draw the maze on screen ---
 function drawMaze() {
   const grid = document.getElementById('maze-demo-grid');
   if (!grid) return;
   grid.innerHTML = ''; // Clear previous maze state

   // Loop through each cell to build grid
   for (let y=0; y<5; y++) {
     for (let x=0; x<5; x++) {
       let cell = document.createElement('div');
       cell.className = 'maze-demo-cell';

       // If wall, darken cell
       if (maze[y][x] === 1) cell.classList.add('maze-demo-wall');

       // If Peppa is here, draw her
       if (peppa.x === x && peppa.y === y) {
         let peppaDiv = document.createElement('div');
         peppaDiv.className = 'maze-demo-peppa';
         cell.appendChild(peppaDiv);
       }
       grid.appendChild(cell);
     }
   }
 }

 // --- Function to check if Peppa can move ---
 function canPeppaMove(x, y) {
   // Disallow movement outside maze boundaries
   if (x < 0 || x >= 5 || y < 0 || y >= 5) return false;

   // Disallow movement into wall cells
   if (maze[y][x] === 1) return false;

   return true;
 }

 // --- Function to handle movement logic ---
 function movePeppa(dir) {
   let dx = 0, dy = 0;

   // Determine direction offsets
   if (dir === 'up') dy = -1;
   if (dir === 'down') dy = 1;
   if (dir === 'left') dx = -1;
   if (dir === 'right') dx = 1;

   // Calculate new coordinates
   let newX = peppa.x + dx, newY = peppa.y + dy;
   let msg = document.getElementById('maze-demo-msg');

   // Check if move is valid, then update position or warn
   if (canPeppaMove(newX, newY)) {
     peppa.x = newX; peppa.y = newY;
     msg.textContent = "✅ Peppa moved " + dir + "!";
   } else {
     msg.textContent = "❌ Can't move " + dir + " (wall or edge)!";
   }

   // Redraw maze after each move
   drawMaze();
 }

 // --- Attach button events after DOM is ready ---
 setTimeout(function() {
   document.getElementById('peppa-up').onclick = function() { movePeppa('up'); };
   document.getElementById('peppa-down').onclick = function() { movePeppa('down'); };
   document.getElementById('peppa-left').onclick = function() { movePeppa('left'); };
   document.getElementById('peppa-right').onclick = function() { movePeppa('right'); };

   // Draw the initial maze when loaded
   drawMaze();
 }, 100);

})();
</script>



Here, the algorithm: 
- Checks if Peppa can move (Boolean condition).
- Updates her position if the move is valid.
- Redraws the maze after each action.

This demonstrates how logical checks and movement rules form the backbone of many game algorithms.

## 4. Different Algorithms for the Same Problem (Python)

Let's compare two numbers to find the larger one using two different approaches.


```python
a = 7
b = 9

# Algorithm 1: Using if-else
if a > b:
    max_val = a
else:
    max_val = b
print('Max using if statement:', max_val)

# Algorithm 2: Using Python's built-in max()
print('Max using built-in max:', max(a, b))
```

    Max using if statement: 9
    Max using built-in max: 9


Both algorithms solve the same problem but in different ways — one step-by-step using an `if` statement, the other using a built-in function for simplicity. The built-in max() function quickly compares the values you give it and returns the largest one.

## Key Takeaways

- Algorithms are clear, step-by-step instructions to solve problems.
- The same problem can be solved with different algorithms that vary in speed, clarity, or efficiency.
- Boolean logic and conditionals let programs make smart decisions.
- Python and JavaScript both show how algorithms control logic and visuals — from adding numbers to moving Peppa through her maze.
- Try modifying the examples to see how algorithm changes affect behavior!
