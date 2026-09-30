---
layout: post
courses: {'csse': {'week': 5}}
categories: ['JavaScript', 'Variables']
lesson_language: JavaScript
lesson_topic: Variables
lesson_part: interactive
lesson_type: lesson
codemirror: True
microblog: True
title: Variables
description: HTML Domain and Variables lesson
permalink: /js/variables/
author: Aadi Saini, Daniel Livitz, Kashyap Tubati
---

### What are variables?
A variable is a container where you store stuff. Think of it like your lunchbox: `let lunchbox = "sandwich";`

Meaning: 
let → When creating a new variable you use let

lunchbox → the name of the variable

"sandwich" → the value or info that is stored in the variable



### Why are variables helpful? 
Instead of repeating the same thing again and again, you store it once and reuse it. 

### 1. let vs const 

When you create variables, you use let or const.

Let is used when the value can change 
**Examples:** your points in a video game, your age 

`let points = 0; points = points + 1;`

Const is used when the value should NOT change.
**Examples:** your student ID, your birthday, your permanent username 

`const studentID = "S12345";` 
`const birthday = "2012-08-19";` 
`const username = "Daniel_the_Miner";`
 Now you go ahead and try!



{% capture challenge0 %}
Create 2 variables. One of your birthday and one of a point system that adds by 3. (Look at the reading above for help)
{% endcapture %}

{% capture code0 %}
let // Put a variable here
const // Put another variable here

console.log(Points)
console.log(Birthday)
{% endcapture %}

{% capture source0 %}
```javascript
%%js

// CODE_RUNNER: Create 2 variables. One of your birthday and one of a point system that adds by 3. (Look at the reading above for help)

let // Put a variable here
const // Put another variable here

console.log(Points)
console.log(Birthday)
```
{% endcapture %}

{% include runners/code.html
   runner_id="js-variables-0"
   language="javascript"
   challenge=challenge0
   code=code0
   source=source0
%}



### Data Types 

**A data type is what kind of value is stored in the variable. Here are the main ones:** 



`let pencils = 12;` Number → how many(quantitative) 

`let teacherName = "Mr. Lee";`String → text (You only need double quotes when writing strings) 

`let isPresent = true;` Boolean → true or false value

`let homework;` Undefined → declared but not filled yet

`let deskItem = null;` Null → intentionally empty

### Reference Data Types (Bigger containers) 

**When you need to store multiple varibles together into category.**

Object → a bundle of related info
Array → a list of the same type of data

**Objects**

Instead of storing everything separately: 
`let name = "Ava";` `let grade = 7;` `let hasPencil = true;` 

You can group it into one object: 
`const student = { name: "Ava", grade: 7, hasPencil: true };` 

**Arrays:**

Instead of storing every item separately:
`let snack1 = "chips";` `let snack2 = "apple";` `let snack3 = "cookie";`

You can group it into one array:
 `let snacks = ["chips", "apple", "cookie"];`



{% capture challenge1 %}
Make an an object of your favorite food, color and movie. (Refer above for help)
{% endcapture %}

{% capture code1 %}
console.log(FavoriteThings)
{% endcapture %}

{% capture source1 %}
```javascript
%%js

// CODE_RUNNER: Make an an object of your favorite food, color and movie. (Refer above for help)

console.log(FavoriteThings)
```
{% endcapture %}

{% include runners/code.html
   runner_id="js-variables-1"
   language="javascript"
   challenge=challenge1
   code=code1
   source=source1
%}


## HTML DOM (Document Object Model)

Now, to go to HTML DOM. Imagine HTML DOM like this: It's essentially the HTML code, but with changes applied to it. Here's a better way to visualize that: You are playing the Pong Game on the `pages.opencodingsociety.com` website, and you are playing against an AI paddle. Now, imagine a score tracker on the top that counts the points that each side has. Javascript would change the HTML DOM in this scenario by changing the amount of points each side has.

### So how does HTML DOM connect to variables?

It's very simple actually. Taking something like the ping pong game, Javascript would store data like a variable for `player score` and then the DOM would just take the value of that variable and then output it to the rendered site.


<div class="ui-runner">


<!--
Update the player and AI scores when the buttons are clicked.
-->

<button onclick="playerScores()">Player Clicker: <span id="playerScore">0</span></button>
<button onclick="aiScores()">AI Clicker: <span id="aiScore">0</span></button>

<script>
(function() {

function playerScores() {
    let playerPoints = parseInt(document.getElementById("playerScore").textContent);
    playerPoints += 1;
    document.getElementById("playerScore").textContent = playerPoints;
}

function aiScores() {
    let aiPoints = parseInt(document.getElementById("aiScore").textContent);
    aiPoints += 1;
    document.getElementById("aiScore").textContent = aiPoints;
}
})();
</script>
</div>




<!-- UI_RUNNER:  DOM change -->

<!--
Update the player and AI scores when the buttons are clicked.
-->

<button onclick="playerScores()">Player Clicker: <span id="playerScore">0</span></button>
<button onclick="aiScores()">AI Clicker: <span id="aiScore">0</span></button>

<script>

function playerScores() {
    // Get the current player's points from the DOM
    let playerPoints = parseInt(document.getElementById("playerScore").textContent);
    // Increment the player's points and update the DOM
    playerPoints += 1;
    document.getElementById("playerScore").textContent = playerPoints;
}

function aiScores() {
    // Get the current AI's points from the DOM
    let aiPoints = parseInt(document.getElementById("aiScore").textContent);
    // Increment the AI's points and update the DOM
    aiPoints += 1;
    document.getElementById("aiScore").textContent = aiPoints;
}
</script>



1. The first part of the code is the HTML button, text and DOM id →  `<button>`, `<span id =>` 

2. onclick functions → `playerScores()`, `aiScores()`

3. Click happens (button click, respective fuction is colled)

  - get value of DOM and assign variable `let playerPoints = parseInt(document.getElementById("playerScore").textContent)`, or `let aiPoints = parseInt(document.getElementById("aiScore").textContent)`
  - increment varaible → `playerPoints += 1`, or `aiPoints += 1`;

  -  set value of updat to the DOM → `document.getElementById("playerScore").textContent = playerPoints;`, or `parseInt(document.getElementById("aiScore").textContent) = aiPoints`

## HOMEWORK



{% capture challenge2 %}
Create a const object called student with your name, grade, and favorite subject.
{% endcapture %}

{% capture code2 %}
console.log(student);
console.log(scores);
{% endcapture %}

{% capture source2 %}
```javascript
%%js

// CODE_RUNNER: Create a const object called student with your name, grade, and favorite subject.

console.log(student);
console.log(scores);
```
{% endcapture %}

{% include runners/code.html
   runner_id="js-variables-2"
   language="javascript"
   challenge=challenge2
   code=code2
   source=source2
%}



<div class="ui-runner">



<script>
(function() {

})();
</script>
</div>

