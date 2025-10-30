---
layout: cs-portfolio-lesson
title: "JavaScript Guide"
description: Guide on and how to code in JavaScript
permalink: /cs-portfolio-quest/frontend/submodule_5/
parent: "Frontend Development"
team: "Creators"
submodule: 5
microblog: True
breadcrumb: True

categories: [CSP, Submodule, Frontend]
tags: [javascript]
author: "Creators Team"
date: 2025-10-21
---

<style>
    .exercise-section {
        background-color: blue;
        opacity: 0.6;
        border-color: red;
        border-style: solid;
    }
</style>

# JavaScript Section

## Purpose

Considering you're on this section, you likely have learned that HTML is what structures website and CSS is what styles and adds design to websites. JavaScript add to this list: **It makes the website interactive.**

## Variables

Variables are essentially how data is stored in usable containers in code.

There are 4 ways this can be done, but only two are recommended.

The first of these methods is **let**. It allows the variable to be changed after it is defined:

```
let x = 5;
x = 6; // Successfully changes value
```

The second of these methods is **const**. After the variable is defined, it cannot be changed:

```
const x = 5;
x = 6; // WILL NOT WORK
```

## Operators

Mathematical operators are often used in JavaScript and other programming languages. Below is a handful of operators:

**Addition operator:**

```
let x = 5;
let y = 3;

let z = x + y

// z will output 8
console.log(z);
```

**Subtraction operator:**

```
let x = 5;
let y = 3;

let z = x - y;

// z will output 3
console.log(z);
```

**Multiplication operator:**

```
let x = 5;
let y = 2;

let z = x * y;

// z will output 10
console.log(z);

```

**Division operator:**

```
let x = 10;
let y = 2;

let z = x / y;

// z will output 20
console.log(z);
```

**Modulus operator:**

```
let x = 10;
let y = 2;

let z = x % y;

// z will output 0
console.log(z);
```

**Exponential operator:**

```
let x = 2;
let y = 4;

let z = 2**4;

// z will output 16
console.log(z);

```

<div class="exercise-section">
    <h4>Exercises</h4>
    <p width="100%">Define two variables and define new variables by using operators on those two variables</p>
    <textarea rows="10" cols="70" placeholder="code goes here"></textarea>
</div>

<a href="{{site.baseurl}}/cs-portfolio-quest/frontend/submodule_4" 
   style="display:inline-block; background-color:#1e3a8a; color:white; text-decoration:none; 
          padding:10px 20px; border-radius:8px; border:none; cursor:pointer; 
          text-align:center; transition:background-color 0.2s;"
   onmouseover="this.style.backgroundColor='#1d4ed8'" 
   onmouseout="this.style.backgroundColor='#1e3a8a'">
  Previous
</a>
<a href="{{site.baseurl}}/cs-portfolio-quest/frontend/submodule_6" 
   style="display:inline-block; background-color:#1e3a8a; color:white; text-decoration:none; 
          padding:10px 20px; border-radius:8px; border:none; cursor:pointer; 
          text-align:center; transition:background-color 0.2s;"
   onmouseover="this.style.backgroundColor='#1d4ed8'" 
   onmouseout="this.style.backgroundColor='#1e3a8a'">
  Next
</a>