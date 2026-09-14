---
layout: post
courses: {'csp': {'week': 1}}
categories: ['Python', 'Strings']
lesson_language: Python
lesson_topic: Strings
lesson_part: interactive
lesson_type: lesson
title: 3.4 Strings
description: This page will teach you about strings in programming.
permalink: /csp/strings/zombies
breadcrumb: True
Author: Ethan Patel, Tanay Paranjpe, Neil Manjrekar
---

## Strings
---
### What are Strings?
- A **string** is a sequence of characters **(letters, numbers, symbols, spaces)** enclosed in quotes.
##### Examples:

- ``"Hello"``

- ``"12345"``

- ``"Good Morning"``

### **Python**


```python
myName = "Neil" # <-- Here, we define a string variable called myName and assign it the value "Aneesh".
myNameType = type(myName).__name__ # <-- Here, we use the type() function to get the data type of myName, which is str (string). The __name__ attribute gives us the name of the type as a string.

print(f"{myName} is a {myNameType} data type.") # <-- This line prints out the value of myName and its data type in a formatted string.
```

### **JavaScript**


```javascript
%%javascript

let myName = "Tanay";  // <-- Define a string variable called myName and assign it "Tanay"
let myNameType = typeof myName;  // <-- typeof gives the data type (string)

console.log(`${myName} is a ${myNameType} data type.`);  // Makes the two variables into a sentence

```


    <IPython.core.display.Javascript object>


### Defining Strings
- In most programming languages, you can make a string with either single (') or double (") quotes:

### **Python**


```python
word = "hello" # <-- Here, we use double quotes instead of single quotes
sentence = 'Python is fun!' # <-- Here, we use single quotes instead of double quotes
# Both are valid ways to define strings in Python
multiline = """This is 
a multi-line
string.""" # <-- Triple quotes allow for multi-line strings
print(word)
print(sentence)
print(multiline) 
```

### **JavaScript**


```javascript
%%javascript

let word = "hello" // Single quotes
let sentence = 'JavaScript is better than Python!' // Double quotes
// Similar to Python, it does not matter whether you use double or single quotes
let multiLine = `Multiline strings
are
very
cool!` // Use ` in JavaScript for multi line quotes

console.log(word)
console.log(sentence)
console.log(multiLine)
```


    <IPython.core.display.Javascript object>


## Common String Operations
---

### **Python**


```python
name = "Aneesh"

print(name.upper())     # "ANEESH"
print(name.lower())     # "aneesh"
print(len(name))        # 6
print(name[0])          # "A" (first character)
print(name[-1])         # "h" (last character)
print(name[1:3])        # "ne" (slice)
```

### **JavaScript**


```javascript
%%javascript

let food = "Pizza"

console.log(food.toUpperCase()); // prints pizza in all upper case
console.log(food.toLowerCase()); // prints pizza in all lower case
console.log(food.length) // prints the number of characters in the word pizza
console.log(food[0]); // prints the first character in pizza
console.log(food[food.length - 1]); // prints the last character in pizza
console.log(food.substring(1,4)); // substring slices the word to get a chunk, the index/numbers are assigned to letters
// pizza = 01234
```


    <IPython.core.display.Javascript object>


## Concatenation (Combining Strings)
---

### **Python**


```python
first = "Hello"
second = "World"

print(first + " " + second)        # "Hello World"
print(first + ", " + second + "!") # "Hello, World!"
print("{} {}".format(first, second))       # "Hello World" (str.format)
print(f"{first}, {second}!")       # "Hello, World!" (f-string) 
```

### **JavaScript**


```javascript
%%javascript

let first = "Goodbye";
let second = "Universe";

// Using concat()
console.log(first.concat(" ", second));        // uses concat to combine strings
console.log(first.concat(", ", second, "!"));  // also uses concat but adds a ! at the end
console.log(second.concat(first)); // can use concat to combine strings any way

```


    <IPython.core.display.Javascript object>


### Practice Questions!

1. What will the command **concat** do in JavaScript?
2. Is the **substring** command used in?
3. How do you do **multiline** strings in JavaScript?

---
### MCQ
Go as fast as you can to try to win!

[Click here for qualifying](https://whitelunarium.github.io/Aneesh_2026/mcq_strings)

[Click here for final](https://whitelunarium.github.io/Aneesh_2026/mcq_strings2)
