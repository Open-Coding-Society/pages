---
layout: post
courses: {'csse': {'week': 5}}
categories: ['JavaScript', 'Mathematical-Expressions']
lesson_language: JavaScript
lesson_topic: Mathematical-Expressions
lesson_part: interactive
lesson_type: lesson
codemirror: True
microblog: True
title: Mathematical Expressions
permalink: /js/math
author: Samaghna Deshatty, Isha Chaturvedi, Ayden Dudley
---

## JS Lessons

<img src="{{site.baseurl}}/images/Penguins-jslessons/steam_locomotive.gif">



### **Introduction to Mathematical Expresions**

📌 What are Mathematical Expressions?
Mathematical expressions in coding are combintations of numbers, varibles, and operators that are used to calculate given values or solve problems in a program.

For Example:

`1 + 2 * 3;`

> **Key Ideas:** Mathematical expressions in programming are almost idnetical to the mathematical expresions done in your math class, it is just a difference of how they are written.

---

### **Key Mathematical Operators**

| Operator         | Symbol | Example     | Result | Example use case       |
|------------------|--------|-------------|--------|-----------------------------|
| Addition         | `+`    | `2 + 3`     | `5`    | `console.log(2 + 3);`       |
| Subtraction      | `-`    | `5 - 2`     | `3`    | `console.log(5 - 2);`       |
| Multiplication   | `*`    | `4 * 3`     | `12`   | `console.log(4 * 3);`       |
| Division         | `/`    | `10 / 2`    | `5`    | `console.log(10 / 2);`      |
| Modulo        | `%` | `7 % 3`     | `1`    | `console.log(7 % 3);`       |
| Exponentiation   | `**`   | `2 ** 3`    | `8`    | `console.log(2 ** 3);`      |

You can also use inequality operators in if statements (>, <, ==, <=, =>)

---

### **Variables in Expressions**
You can use variables to store values and build expressions:

`let x = 5` 

---

### **Order of Operations**
Order of operations is used in programming just as it is used in regular math, any equation given to the cell will be done using PEMDAS
- Parentheses
- Exponents
- Multiplication/Division
- Addition/Subtraction 

In any equation that is inputed to the coding cell all eqaution will use order of operation to correctly solve the information given.



{% capture challenge0 %}
Identitfy the error in the following code and fix it.
{% endcapture %}

{% capture code0 %}
let number = 5; 

console.log(number;);// hint: there's a syntax error here
{% endcapture %}

{% capture source0 %}
```javascript
%%js

// CODE_RUNNER: Identitfy the error in the following code and fix it. 

let number = 5; 

console.log(number;);// hint: there's a syntax error here
```
{% endcapture %}

{% include runners/code.html
   runner_id="js-math-0"
   language="javascript"
   challenge=challenge0
   code=code0
   source=source0
%}




{% capture challenge1 %}
How does changing the value of variables affect the output? Try changing the values of x and y below and see what happens to total1 and total2.
{% endcapture %}

{% capture code1 %}
let x = 10;
let y = 3;
let total1 = x + y + 2; // total = 10 + 3 + 2 = 15

console.log("The total is: " + total1); // final output
{% endcapture %}

{% capture source1 %}
```javascript
%%js

// CODE_RUNNER: How does changing the value of variables affect the output? Try changing the values of x and y below and see what happens to total1 and total2.

let x = 10;
let y = 3;
let total1 = x + y + 2; // total = 10 + 3 + 2 = 15

console.log("The total is: " + total1); // final output
```
{% endcapture %}

{% include runners/code.html
   runner_id="js-math-1"
   language="javascript"
   challenge=challenge1
   code=code1
   source=source1
%}




{% capture challenge2 %}
Modulo is used to check the divisibility of certain numbers.It can also be used to see if number are even or odd, using the code below change the values of x to see how modulo works.
{% endcapture %}

{% capture code2 %}
let x = 17;
let total = x % 2;

console.log(x + " % 2 = "  + total);

if (x % 2 === 0) {
    console.log(x + " number is even");
} else {
    console.log(x + " number is odd");
}
{% endcapture %}

{% capture source2 %}
```javascript
%%js

// CODE_RUNNER: Modulo is used to check the divisibility of certain numbers.It can also be used to see if number are even or odd, using the code below change the values of x to see how modulo works.

let x = 17;
let total = x % 2;

console.log(x + " % 2 = "  + total);

if (x % 2 === 0) {
    console.log(x + " number is even");
} else {
    console.log(x + " number is odd");
}

```
{% endcapture %}

{% include runners/code.html
   runner_id="js-math-2"
   language="javascript"
   challenge=challenge2
   code=code2
   source=source2
%}


## Advanced Code ( optional )
The below code cell is built into the page.  The cell shows advanced ways of building a custom runner. You must run the cell to ensure code is in page when running make or view in deployed actions.  FYI, this uses most common elements you need to understand when building an interactive web page.


- Style for text area and buttons
- HTML Document Object Model (DOM) definitions
- Event handling
- Evaluation of the textarea example code


```python
<!-- Penguins custom code runner using an HTML cell -->
<style>
 /* Basic styling for javascript */
 textarea { width: 100%; height: 200px; }
 button { margin-top: 10px; padding: 8px 16px; font-size: 14px; cursor: pointer; }
</style>

<!-- Basic HTML structure for the challenge -->
<h2>JavaScript - Math Challenge user conventional Style, HTML, and JS</h2>
<p>Set a variable <code>x</code> to any number. Then calculate:</p>
<ul>
 <li><code>x + 5</code></li>
 <li><code>x * 2</code></li>
 <li><code>x % 3</code> (remainder when x is divided by 3)</li>
</ul>
<p>Print all three results in a single line. Try different values of <code>x</code>!</p>

<!-- Code editor for user input -->
<textarea id="code">
// Example: change the value of x and run the code
let x = 4;
let addResult = x + 5;
let multiplyResult = x * 2;
let moduloResult = x % 3;


document.getElementById('output').textContent = addResult + ' ' + multiplyResult + ' ' + moduloResult;
</textarea>
<br>
<!--Run code action button-->
<button id="run-button">Run Code</button>
<h3>Output:</h3>
<div id="output"></div>


<script>
 // Attach event listener in JS to the run button
 document.getElementById('run-button').addEventListener('click', function() {
   const code = document.getElementById('code').value;
   const outputDiv = document.getElementById('output');
   outputDiv.textContent = '';
   try {
     eval(code);  // execute student code
   } catch (err) {
     outputDiv.textContent = 'Error: ' + err.message;
   }
 });
</script>
```

## Homework Problems



{% capture challenge3 %}
Homework Problem #1. Create a program that check if a number y is divisible by 5 or not, use modulo in this!
{% endcapture %}

{% capture code3 %}
// hint: use challenge problem #3 code above to help you!
{% endcapture %}

{% capture source3 %}
```javascript
%%js

// CODE_RUNNER: Homework Problem #1. Create a program that check if a number y is divisible by 5 or not, use modulo in this!
// hint: use challenge problem #3 code above to help you!

```
{% endcapture %}

{% include runners/code.html
   runner_id="js-math-3"
   language="javascript"
   challenge=challenge3
   code=code3
   source=source3
%}




{% capture challenge4 %}
Homework Problem #1. Create a program that has three variables, a,b,and sum, which adds them together, use console.log to print the final output.
{% endcapture %}

{% capture code4 %}
// hint: use challenge problem #2 code above to help you!
{% endcapture %}

{% capture source4 %}
```javascript
%%js

// CODE_RUNNER: Homework Problem #1. Create a program that has three variables, a,b,and sum, which adds them together, use console.log to print the final output.
// hint: use challenge problem #2 code above to help you!
```
{% endcapture %}

{% include runners/code.html
   runner_id="js-math-4"
   language="javascript"
   challenge=challenge4
   code=code4
   source=source4
%}

