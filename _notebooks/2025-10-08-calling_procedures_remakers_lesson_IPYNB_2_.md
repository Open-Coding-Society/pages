---
layout: post
courses: {'csp': {'week': 1}}
categories: ['Python', 'Calling-Procedures']
lesson_language: Python
lesson_topic: Calling-Procedures
lesson_part: interactive
lesson_type: lesson
toc: True
comments: False
title: 3.12 Calling Procedures
description: 3.12 Calling Procedures
permalink: /csp/big-idea-3/calling-procedures/p4/lesson
author: Sathwik Kintada
---

## 3.12 Calling Procedures

Every morning you brush your teeth, wash your face, and eat breakfast. You don’t rewrite those steps every day — you just do them. That’s what calling a procedure is: you already have the steps (the function), and you just call it whenever you need it.

What is it?
- A procedure is a reusable group of instructions.
- Also called a function in Python or JavaScript.
- Procedures allow you to avoid rewriting the same code.
What does it mean?
- Calling a procedure means telling the computer to run the instructions in that procedure.
- You can call a procedure multiple times with different input values without rewriting it.
- This is different from defining the procedure — defining is creating it, calling is using it.


Python Example:
- Use def to define a procedure
- You can use the name of the functionand paranthesis after to call it


```python
# Define a procedure
def show_message():
    print("Welcome to the program!")

# Call the procedure
show_message()  # Output: Welcome to the program!
```

    Welcome to the program!


Javascript Example:
- You use function to define a procedure
- Just like python if you type the name of the function with parenthesis right after it, you can call the procedure


```javascript
%%js
// Define a procedure
function showMessage() {
    console.log("Welcome to the program!");
}

// Call the procedure
showMessage();  // Output: Welcome to the program!
```

### Calling A Procedure Inside Another Procedure

Why?
- Large problems can often be broken into smaller steps (decomposition).
- Each step can be a procedure, and one procedure can call another.
- This makes programs easier to read, debug, and reuse.

Python Example:
- Calling the procedure format_name returns the formatted name so the other procedure can use it


```python
def format_name(first, last):
    return first + " " + last

def greet_person(first, last):
    full_name = format_name(first, last)
    print("Hello, " + full_name + "!")

greet_person("Sathwik", "Kintada")  # Output: Hello, Sathwik Kintada!

```

    Hello, Sathwik Kintada!


JavaScript Example:
- Calling the procedure formatName returns the formatted name so the other procedure can use it


```javascript
%%js
function formatName(first, last) {
    return first + " " + last;
}

function greetPerson(first, last) {
    let fullName = formatName(first, last);
    console.log("Hello, " + fullName + "!");
}

greetPerson("Lucas", "Masterson"); // Output: Hello, Lucas Masterson!
```


    <IPython.core.display.Javascript object>


### Key Takeaways
- Helper procedures do one simple task.
- Outer procedures call helpers to combine or display results.
- This is decomposition — breaking a problem into smaller steps.
- Calling procedures inside procedures makes code reusable and organized.
