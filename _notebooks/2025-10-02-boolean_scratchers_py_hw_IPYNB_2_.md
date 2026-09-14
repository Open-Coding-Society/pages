---
layout: post
courses: {'csp': {'week': 1}}
categories: ['Python', 'Boolean-Expressions']
lesson_language: Python
lesson_topic: Boolean-Expressions
lesson_part: interactive
lesson_type: lesson
toc: True
comments: False
title: 3.5 Boolean Expressions (PY)
description: Boolean Hacks For Students To Try In Python
permalink: /python/boolean/py
---

# 🔑 Boolean Hacks in Python: A Few New Codes!

This notebook has short Boolean challenges. Edit the code where it says `TODO` to make it work.

## Challenge 1: Positive Number
Fix the condition so it prints `num is positive` if the number is greater than 0.


```python
num = 3  # Try changing this number!

# TODO: change the condition
if num < 0:  # <-- wrong, fix this
    print(num, "is positive")
else:
    print(num, "is NOT positive")
```

    3 is NOT positive


## Challenge 2: Is Even?
Change the condition so it prints `num is even` when the number is divisible by 2.


```python
num = 7

# TODO: check if num is even
if num % 2 == 0:  # <-- not correct
    print(num, "is even")
else:
    print(num, "is odd")
```

    7 is odd


## Challenge 3: Teenager Check
Print `Teenager` if age is between 13 and 19 (inclusive). Otherwise print `Not Teenager`. Fix the condition.


```python
age = 20

# TODO: fix the condition
if age > 12 and age < 20:  # <-- wrong
    print("Teenager")
else:
    print("Not Teenager")
```

    Not Teenager


## Challenge 4: Lamp Logic
We have two switches: `a` and `b`. The lamp should turn ON if **at least one** is True.

Fix the condition.


```python
a, b = True, False

# TODO: fix condition for at least one True
if a or b:  # <-- wrong
    print("Lamp is ON")
else:
    print("Lamp is OFF")
```

    Lamp is ON

