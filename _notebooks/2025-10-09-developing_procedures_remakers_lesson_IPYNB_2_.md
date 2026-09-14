---
layout: post
courses: {'csp': {'week': 1}}
categories: ['Python', 'Developing-Procedures']
lesson_language: Python
lesson_topic: Developing-Procedures
lesson_part: interactive
lesson_type: lesson
toc: True
comments: False
title: 3.13 Developing Procedures
description: Lesson for developing procedures.
permalink: /csp/big-idea-3/developing-procedures/p4/introduction
author: Krishna Visvanath, Sloane Sommers
---

# Developing Procedures (Methods / Functions)

Learning goals:
- Understand what a procedure (method/function) is and why we use them.
- See equivalent examples in Java and Python.
- Play a short, interactive minigame that shows why good procedure names and organization matter.

## What is a procedure?
A procedure (also called a method or function) is a named block of code that does one task.
Think of a procedure like a recipe step: it has a name, inputs (ingredients), and it produces a result or performs an action.

## Story: The Dessert Robot- The Importance of Naming
Imagine a robot chef who makes desserts. If we tell the robot `makeDessert()` it needs clear sub-steps: `measureFlour()`, `mixIngredients()`, `bake()`. Additionally, if we need to review code later, it is much easier to find the series of events responsible for `makeDessert()`. If we instead call everything `doIt()` the robot — and humans reading the code — get confused. Clear names make code easier to read, test, and reuse.

### Java example (methods)
Below is a short Java-style example showing a class with methods. This cell is explanatory only — it shows syntax and structure but the procedures aren't called.


```python

function makeDessert() {
    measureFlour();
    mixIngredients();
    bake();
}

function measureFlour() {
    console.log("Measuring 2 cups of flour.");
}

function mixIngredients() {
    console.log("Mixing flour, sugar, eggs.");
}

function bake() {
    console.log("Baking at 350°F for 25 minutes.");
}

// Run the procedure
makeDessert()

```


    <IPython.core.display.Javascript object>


### Python example (functions)
Here's the same idea in Python. Functions perform small tasks and are called from a main function.


```python
def make_dessert():
    measure_flour()
    mix_ingredients()
    bake()

def measure_flour():
    print("Measuring 2 cups of flour.")

def mix_ingredients():
    print("Mixing flour, sugar, eggs.")

def bake():
    print("Baking at 350°F for 25 minutes.")

# Run the procedure
if __name__ == '__main__':
    make_dessert()
```

## Mini-game: Name the Procedures
The game below shows a list of steps the program can take, each implemented as a function. Students type a name for a new procedure and the game will call it. If your name clearly describes the steps, it's easy to understand what the game will do. If you name everything `do_step` the code is confusing. Try both and see the difference.
The cell that follows is interactive. Run it and follow the prompts in the notebook output.


```python
import random

def choose_ingredient():
    return random.choice(['flour', 'sugar', 'eggs', 'milk'])

def mix(item):
    print(f"Mixing {item} into the bowl.")

def heat():
    print('Heating the oven to a friendly temperature...')

def finish():
    print('Dessert is ready!')

def play_game():
    print('Mini-game: Name a procedure for choosing an ingredient, putting it into the bowl (mixing), heating/baking, finishing the dessert')
    name = input('Type a procedure name you want to create (e.g. prepare_ingredient): ').strip()
    if not name:
        print('No name entered — using default: prepare_ingredient')
        name = 'prepare_ingredient'

    # Create a new procedure dynamically with the given name that runs the sequence
    def dynamic_procedure():
        ingr = choose_ingredient()
        mix(ingr)
        heat()
        finish()

    # Bind it into globals so we can show how naming helps with readability
    globals()[name] = dynamic_procedure

    print(f'Created a procedure called that does multiple steps.')
    print('Now lets show two ways to look at the code:')

    print('Good name (readable):')
    print(f'   {name}()  # clearly indicates the goal is to prepare an ingredient and finish the dessert')
    print('Poor name (confusing):')
    print('   do_step()  # what does this do? you must open the function to find out')

    run = input('Type to execute your procedure now, or anything else to cancel: ').strip().lower()
    if run == 'run':
        print('Running the procedure...')
        globals()[name]()
    else:
        print('Canceled. You can run the procedure later by calling it by name.')

if __name__ == '__main__':
    play_game()
```

    Mini-game: Name a procedure for choosing an ingredient, putting it into the bowl (mixing), heating/baking, finishing the dessert
    Created a procedure called that does multiple steps.
    Now lets show two ways to look at the code:
    Good name (readable):
       prepare_ingredient()  # clearly indicates the goal is to prepare an ingredient and finish the dessert
    Poor name (confusing):
       do_step()  # what does this do? you must open the function to find out
    Canceled. You can run the procedure later by calling it by name.


### Demonstration of poor naming
Below are two short examples showing the risk of vague names. It's much harder to remember `do_step()` does choosing, mixing, heating, and finishing. Good names reduce bugs and make collaboration easier.


```python
# Example showing bad naming
def do_step():
    print('Choosing ingredient...')
    print('Mixing...')
    print('Heating...')
    print('Finished!')

# Later a collaborator sees do_step() and doesn't know what it does without opening it
print('Calling do_step() (confusing name):')
do_step()
```


```python
# Second example showing bad naming
def do_step():
    print('thing1')
    print('thing2')
    print('thing3')

# Later a collaborator is debugging code, and does not know what each procedure does without opening it, meaning they have to go through every line to debug
```

## Teaching tips and exercises
- Exercise 1: Rename the functions in the Python example to be more descriptive.
- Exercise 2: Convert the Python functions to Java methods and explain access (public/private).
- Exercise 3: Split a long procedure into smaller ones and show how tests become easier.

## How to run the mini-game
Run the Python cells in order. When you reach the mini-game cell, you'll be prompted to type a procedure name and optionally run it. If you use the notebook server (Jupyter), the input prompt will appear under the cell output.
