---
layout: post
courses: {'csse': {'week': 5}}
categories: ['JavaScript', 'JSON']
lesson_language: JavaScript
lesson_topic: JSON
lesson_part: interactive
lesson_type: lesson
codemirror: True
microblog: True
title: JSON and JavaScript Objects
description: JSON Structures using Code Runner
permalink: /js/json
author: Finn Dyess, Matteo
---

# JSON and JavaScript Objects

## All About JSON and JavaScript Objects

Let's imagine this. You're in your room, with tons of stuff laid out however you want: clothes on the bed, books stacked on a shelf, maybe a backpack open with notebooks inside. You can walk around, grab things, move them, and even use them right away.

This is what a **JavaScript** object is like. It lives inside your program, and JavaScript can interact with it directly. 

Now imagine that you need to ship your stuff to someone else.

You can't just send your entire room as-is. You have to:
- Put everything to boxes
- Label everything clearly
- Follow shipping rules so nothing breaks

That is what JSON is like. JSON is how we *package data* so it can be sent, stored, or shared. It is not meant to be used directly, but instead to travel. 

In this lesson, we will go over:
- What JavaScript objects are
- What JSON is
- Why they appear similar but have different functions
- How to convert between the two

## Section 1: JavaScript Objects
A **JavaScript object** is a collection of related information stored in one variable. 

JavaScript objects:
- Live inside JavaScript code
- Can store different types of data
- Can include functions
- Are flexible

Here's a basic example of a JavaScript object:


```javascript
%%js

const student = {
    name: "Alex",
    age: 16,
    enrolled: true,
    greet: function () {
        return "Hello!";
    }
};
```

Notice a few things:
- The keys **do not** need quotes
- The object includes a function
- JavaScript understands this immediately

This only works because JavaScript is running the code.

## Code Runner 1
Here's what to do:

Run the code below, then try changing it.



{% capture challenge0 %}
Personalize your student record JSON object
{% endcapture %}

{% capture code0 %}
const student = {
    name: "Bartholomew",
    age: 15,
    grade: "9th"
};


console.log(student.name);
console.log(student.age);
{% endcapture %}

{% capture source0 %}
```javascript
%%js

// CODE_RUNNER: Personalize your student record JSON object

const student = {
    name: "Bartholomew",
    age: 15,
    grade: "9th"
};


console.log(student.name);
console.log(student.age);
```
{% endcapture %}

{% include runners/code.html
   runner_id="js-json-0"
   language="javascript"
   challenge=challenge0
   code=code0
   source=source0
%}


Try the following:
- Change the student's name to your own
- Log the entire object

Now try this:


```python
console.log(student.school);
```

This will print `undefined`.
This isn't because of an error, but instead because `student.school` was never defined. 
JavaScript objects are flexible. They do not break just because a property is undefined. 

## Section 2: What is JSON?

JSON stands for JavaScript Object Notation.

Even though it has the word *JavaScript* in the name, JSON is **not JavaScript code.**

JSON is:
- A text format
- Used to send and store data

Because JSON is meant to be shared, it has **strict rules**.

### JSON Rules
JSON:
- Required double quotes for all keys
- Does NOT allow functions
- Does NOT allow comments
- Does NOT allow trailing commas

If any rule is broken, then JSON will fail.

## Code Runner 2





{% capture challenge1 %}
Personalize your student record again and parse it from JSON
{% endcapture %}

{% capture code1 %}
const jsonData = `
{
    "name": "Finn",
    "age": 15,
    "isStudent": true
}
`;


const parsedData = JSON.parse(jsonData);
console.log(parsedData);
{% endcapture %}

{% capture source1 %}
```javascript
%%js

// CODE_RUNNER: Personalize your student record again and parse it from JSON

const jsonData = `
{
    "name": "Finn",
    "age": 15,
    "isStudent": true
}
`;


const parsedData = JSON.parse(jsonData);
console.log(parsedData);
```
{% endcapture %}

{% include runners/code.html
   runner_id="js-json-1"
   language="javascript"
   challenge=challenge1
   code=code1
   source=source1
%}


Now, intentionally break it. Try these examples:
- Remove quotes from a key
- Add a trailing comma
- Change `true` to `True`
- Add a comment

When JSON breaks, JavaScript returns an error.
This is because JSON must be readable so computers can read it reliably.

## Section 3: Converting Between JSON and JavaScript Objects



{% capture challenge2 %}
Converting a JavaScript object to JSON and back (with your own data)
{% endcapture %}

{% capture code2 %}
const user = {
    username: "coder123",
    score: 42,
    premium: false
};


const jsonString = JSON.stringify(user);
console.log(jsonString);


const parsedUser = JSON.parse(jsonString);
console.log(parsedUser);
{% endcapture %}

{% capture source2 %}
```javascript
%%js

// CODE_RUNNER: Converting a JavaScript object to JSON and back (with your own data)

const user = {
    username: "coder123",
    score: 42,
    premium: false
};


const jsonString = JSON.stringify(user);
console.log(jsonString);


const parsedUser = JSON.parse(jsonString);
console.log(parsedUser);
```
{% endcapture %}

{% include runners/code.html
   runner_id="js-json-2"
   language="javascript"
   challenge=challenge2
   code=code2
   source=source2
%}


Try the following:
- Add a new property
- Add an array
- Add a nested object


## JSON Objects Summary
- Elements are stored in a hash table (key-value)
- You can edit the hash table 
- Store different data types 
- You can nest objects
- Purpose: store related data, store/organize more complex data, transfer data in JSON format
## Homework Assignment: JSON Challenge
Create a resume containing your personal information, skills, and education and print it as a JSON string.



{% capture challenge3 %}
Create a resume as a JavaScript Object and print to the console as JSON
{% endcapture %}

{% capture code3 %}
// 1. Create a JavaScript object named `resume` with the following properties:
const resume = {
    fullName: "", // Add your full name
    email: "",    // Add your email
    education: "", // Add your grade
    address: {     // Nested object
        city: "",
        state: "",
        country: ""
    },
    skills: []     // Array of strings
};
// 2. Access and display properties for full name, email, and city using dot notation. Look at section 1.
// 3. Convert the `resume` JavaScript object into a JSON string and store it in a variable named `jsonString`, then log the JSON string to the console. Look at Section 3.
// 4. Parse the JSON string back into a JavaScript object and store it in a variable named `parsedResume`, then log the object to the console. Look at Section 3.
{% endcapture %}

{% capture source3 %}
```javascript
%%js

// CODE_RUNNER: Create a resume as a JavaScript Object and print to the console as JSON

// 1. Create a JavaScript object named `resume` with the following properties:
const resume = {
    fullName: "", // Add your full name
    email: "",    // Add your email
    education: "", // Add your grade
    address: {     // Nested object
        city: "",
        state: "",
        country: ""
    },
    skills: []     // Array of strings
};
// 2. Access and display properties for full name, email, and city using dot notation. Look at section 1.
// 3. Convert the `resume` JavaScript object into a JSON string and store it in a variable named `jsonString`, then log the JSON string to the console. Look at Section 3.
// 4. Parse the JSON string back into a JavaScript object and store it in a variable named `parsedResume`, then log the object to the console. Look at Section 3.


```
{% endcapture %}

{% include runners/code.html
   runner_id="js-json-3"
   language="javascript"
   challenge=challenge3
   code=code3
   source=source3
%}


Hint: use above code runners as examples, then edit them
