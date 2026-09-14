---
layout: post
categories: ['JavaScript', 'Data-Abstraction']
lesson_language: JavaScript
lesson_topic: Data-Abstraction
lesson_part: interactive
lesson_type: lesson
title: Data Abstraction!
courses: {'csse': {'week': 5}}
codemirror: True
microblog: True
permalink: /js/data-abstraction
description: How Data Abstraction is used in Programming
author: Rashi Gaurav, Rigved Reddy Gaddam, and Jasan Boparai
---

## What is Data Abstraction??
<font color="blue"> IMAGINE </font> 
Simply driving a steering wheel without understanding how the parts inside work. This is exactly what Data Abstraction is. 

Data Abstraction simplifies complex systems by showing <font color= "red"> only </font> the essential features and hiding complex details, so users can easily understand and interact with systems or apps! 

<font color="green"> It focuses on *what* something does rather than *how* it does it. </font>

### Example #1: Rounding numbers
One example is <font color="red"> built-in functions </font> in JavaScript, because they allow you to use one simple, clear command to run a type of function, but don't show *how* the built-in function was coded.



{% capture challenge0 %}
Try out Data Abstraction with Math.round()
{% endcapture %}

{% capture code0 %}
// Abstraction in Action: Math.round()

// The Complex Data (Input)
const messyNumber = 7.84236;


// We call the built-in function. 
// We don't care *how* it calculates the rounding

// only that it *does* the rounding
const roundedResult = Math.round(messyNumber);

// The Simple Result (Output)
console.log(`The original messy number was: ${messyNumber}`);
console.log(`The simplified, rounded result is: ${roundedResult}`);
// Expected output: 8
{% endcapture %}

{% capture source0 %}
```javascript
%%js
// CODE_RUNNER: Try out Data Abstraction with Math.round()

// Abstraction in Action: Math.round()

// The Complex Data (Input)
const messyNumber = 7.84236;


// We call the built-in function. 
// We don't care *how* it calculates the rounding

// only that it *does* the rounding
const roundedResult = Math.round(messyNumber);

// The Simple Result (Output)
console.log(`The original messy number was: ${messyNumber}`);
console.log(`The simplified, rounded result is: ${roundedResult}`);
// Expected output: 8

```
{% endcapture %}

{% include runners/code.html
   runner_id="js-data-abstraction-0"
   language="javascript"
   challenge=challenge0
   code=code0
   source=source0
%}


#### What's hidden:
The internal logic the JavaScript uses to look at the decimal part (.84236), determine it's >= 0.5, and then round the integer part (7 -> 8). All of this is abstracted away!

### Example #2: Adding two numbers
The user should be able to call addNumbers(a, b) and trust it works <font color="yellow"> without </font> needing to see the math inside.

<font color="red"> YOUR JOB: </font>
The code below is "broken". Complete the function so that it successfully returns the sum of the two inputs. 

<font color="yellow"> hint: </font> use the *return* keyword inside the function



{% capture challenge1 %}
Display two numbers, and add them!
{% endcapture %}

{% capture code1 %}
// The Abstraction (The Function)
function addNumbers(num1, num2) {
    // Add code here
}

let a = 2
let b = 3

// Use the abstraction to get the result
let result = addNumbers(a, b);

console.log(result);
{% endcapture %}

{% capture source1 %}
```javascript
%%js
// CODE_RUNNER: Display two numbers, and add them!

// The Abstraction (The Function)
function addNumbers(num1, num2) {
    // Add code here
}

let a = 2
let b = 3

// Use the abstraction to get the result
let result = addNumbers(a, b);

console.log(result);
```
{% endcapture %}

{% include runners/code.html
   runner_id="js-data-abstraction-1"
   language="javascript"
   challenge=challenge1
   code=code1
   source=source1
%}


## Data Abstraction with Classes
Secondly, Data Abstraction can be seen in Object Oriented Programming, specifically with <font color="red"> Classes and Objects </font>. Classes are essential tools for <font color="red"> simplifying how we handle data. </font>

### Example #3: Checking Account Balance



{% capture challenge2 %}
Use the abstraction to deposit $200
{% endcapture %}

{% capture code2 %}
class BankAccount {
    constructor() {
        this.balance = 500;
    }

    deposit(amount) {
        this.balance = this.balance + amount;
        console.log("💰 Deposited: $" + amount);
    }
}

const myAccount = new BankAccount();

// Write code here
// Hint: myAccount.______();

// 3. Check the result
console.log("Final Balance: $" + myAccount.balance);
{% endcapture %}

{% capture source2 %}
```javascript
%%js
// CODE_RUNNER: Use the abstraction to deposit $200
class BankAccount {
    constructor() {
        this.balance = 500;
    }

    deposit(amount) {
        this.balance = this.balance + amount;
        console.log("💰 Deposited: $" + amount);
    }
}

const myAccount = new BankAccount();

// Write code here
// Hint: myAccount.______();

// 3. Check the result
console.log("Final Balance: $" + myAccount.balance);
```
{% endcapture %}

{% include runners/code.html
   runner_id="js-data-abstraction-2"
   language="javascript"
   challenge=challenge2
   code=code2
   source=source2
%}


## Inheritance
In programming, Inheritance allows one class (called a subclass / child class) to <font color="red">"borrow" </font> features (properties and methods) from another class (the adult). 

<font color="yellow">Real World Example: Smartphone </font>

The Parent Class: A basic phone that can make calls 

The Child Class: An iPhone that <b> inherits </b> the ability to make phone calls, but adds its own features



{% capture challenge3 %}
Use the inherited methods to make a call and take a photo
{% endcapture %}

{% capture code3 %}
class Phone {
    makeCall() {
        console.log("Making a phone call");
    }
}

// Child class
class SmartPhone extends Phone {
    takePhoto() {
        console.log("Taking a photo");
    }
}

const myNewPhone = new SmartPhone();

// Hint: const_name.method();
{% endcapture %}

{% capture source3 %}
```javascript
%%js
// CODE_RUNNER: Use the inherited methods to make a call and take a photo
class Phone {
    makeCall() {
        console.log("Making a phone call");
    }
}

// Child class
class SmartPhone extends Phone {
    takePhoto() {
        console.log("Taking a photo");
    }
}

const myNewPhone = new SmartPhone();

// Hint: const_name.method();
```
{% endcapture %}

{% include runners/code.html
   runner_id="js-data-abstraction-3"
   language="javascript"
   challenge=challenge3
   code=code3
   source=source3
%}


## HOMEWORK

1. This is a code of a calculator. Please read through the code first to try and understand what it does. There are many unnecessary lines within the code. Please identify the unnecessary lines and delete them.



{% capture challenge4 %}
Homework for data abstraction
{% endcapture %}

{% capture code4 %}
function calculator(num1, num2, operator) {
    let nothing = 0;
    let randomText = "calculator running";
    let temp = null;

    nothing = nothing + 0;
    nothing = nothing * 1;

    let result;

    if (randomText === "calculator running") {
        temp = "still running";
    }

    if (operator === "+") {
        result = num1 + num2;
    } else if (operator === "-") {
        result = num1 - num2;
    } else if (operator === "*") {
        result = num1 * num2;
    } else if (operator === "/") {
        result = num1 / num2;
    } else {
        result = "Invalid operator";
    }

    for (let i = 0; i < 3; i++) {
        nothing += 0;
    }

    result = result;

    return result;
}

console.log(calculator(10, 5, "+"));
console.log(calculator(10, 5, "-"));
console.log(calculator(10, 5, "*"));
console.log(calculator(10, 5, "/"));
{% endcapture %}

{% capture source4 %}
```javascript
%%js
// CODE_RUNNER: Homework for data abstraction
function calculator(num1, num2, operator) {
    let nothing = 0;
    let randomText = "calculator running";
    let temp = null;

    nothing = nothing + 0;
    nothing = nothing * 1;

    let result;

    if (randomText === "calculator running") {
        temp = "still running";
    }

    if (operator === "+") {
        result = num1 + num2;
    } else if (operator === "-") {
        result = num1 - num2;
    } else if (operator === "*") {
        result = num1 * num2;
    } else if (operator === "/") {
        result = num1 / num2;
    } else {
        result = "Invalid operator";
    }

    for (let i = 0; i < 3; i++) {
        nothing += 0;
    }

    result = result;

    return result;
}

console.log(calculator(10, 5, "+"));
console.log(calculator(10, 5, "-"));
console.log(calculator(10, 5, "*"));
console.log(calculator(10, 5, "/"));
```
{% endcapture %}

{% include runners/code.html
   runner_id="js-data-abstraction-4"
   language="javascript"
   challenge=challenge4
   code=code4
   source=source4
%}


2. Below a pet class is given.
Your Job is to add a new subclass,<font color="red"> Dog</font>, that <font color="red">inherits</font> from the Pet Class 



{% capture challenge5 %}
Add a Dog subclass
{% endcapture %}

{% capture code5 %}
class Pet {
    eat() {
        console.log("Nom nom nom");
    }
}

// Create the Dog class that extends Pet

// We would also like you to create a method like eat() but called bark() that prints "Woof woof!"

// Refer back to the syntax of the classes examples such as phone and smartphone if you need help!

// Write your code here
{% endcapture %}

{% capture source5 %}
```python
%%js 

// CODE_RUNNER: Add a Dog subclass
class Pet {
    eat() {
        console.log("Nom nom nom");
    }
}

// Create the Dog class that extends Pet

// We would also like you to create a method like eat() but called bark() that prints "Woof woof!"

// Refer back to the syntax of the classes examples such as phone and smartphone if you need help!

// Write your code here

```
{% endcapture %}

{% include runners/code.html
   runner_id="js-data-abstraction-5"
   language="javascript"
   challenge=challenge5
   code=code5
   source=source5
%}

