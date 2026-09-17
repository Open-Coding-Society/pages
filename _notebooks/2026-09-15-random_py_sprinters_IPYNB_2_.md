---
layout: post
categories: [Python, Random-Values]
lesson_language: Python
lesson_topic: Random-Values
lesson_part: interactive
lesson_type: lesson
codemirror: true
microblog: true
toc: false
comments: false
title: 3.15 Random Values (PY)
description: Learn random values in Python using the five-part LxD lesson format.
permalink: /csp/big-idea-3/RandomPY/p3/Lesson
authors: Ruhaan Bansal, Deyar Raissadat, Arya Taghavi Zargar
---

# 3.15 Random Values in Python

A **random value** is selected from a set or range of possible values. Python is the main language for this lesson. JavaScript and College Board pseudocode are only used to compare the same idea in different forms.

## 1. LxD Cycle Process

**Empathize:** Random code can be confusing because students may expect every result to appear once before a repeat, forget that `randint` includes both endpoints, or choose a range with the wrong values.

**Define:**
- **POV:** CSP students need a simple way to connect familiar random events, such as dice rolls, to the code that creates random values.
- **Learning Goal:** Students will be able to generate, test, and explain random values in Python.

**Ideate:**
- **HMW Question:** How might we show randomness in a way that students can predict the possible outputs even though they cannot predict the exact next result?
- **Activity:** Predict ranges, use `random.choice`, fix a wrong range, and build a small dice game.

**Prototype & Test:** Use the Popcorn Hacks below to check whether students can list possible outputs, recognize valid ranges, and use a random result inside a decision.

---

## 2. Lesson Plan

**Learning Objective:** By the end of this lesson, you will be able to use Python's `random` module to generate random integers, choose random list items, and use random results in a program.

**Success Criteria:** You can identify every possible output of a random expression, choose the correct range, and explain why repeated results are allowed.

### Tech Talk 1: Random Integers

Python's built-in `random` module gives us tools for random values.

```python
import random

die_roll = random.randint(1, 6)
print("Die roll:", die_roll)
```

`random.randint(a, b)` can return any whole number from `a` through `b`, including both endpoints.

For a normal die, the possible results are `1`, `2`, `3`, `4`, `5`, and `6`.

### Tech Talk 2: Random Choices

Python can choose directly from a list.

```python
import random

activities = ["study", "stretch", "walk", "get water"]
pick = random.choice(activities)

print("Random activity:", pick)
```

The result must be one item from the list.

The same random-integer idea looks like this in the three forms:

| Form | Random integer from 1 through 6 |
| --- | --- |
| Python | `random.randint(1, 6)` |
| JavaScript | `Math.floor(Math.random() * 6) + 1` |
| College Board pseudocode | `RANDOM(1, 6)` |

### Tech Talk 3: Use Random Values in Decisions

A program can generate a random value and then use that result in an `if` statement.

```python
import random

flip = random.randint(1, 2)

if flip == 1:
    print("Heads")
else:
    print("Tails")
```

Random does **not** mean every possible result appears once before a repeat. Repeats are normal.

---

## 3. Popcorn Hacks & Practice Tasks

### Popcorn Hack 1: Predict the Range

Before running this expression:

```python
random.randint(3, 7)
```

answer:
1. What is the smallest possible result?
2. What is the largest possible result?
3. List every possible integer.
4. Could it return `2`?
5. Could it return `7`?

Then test it several times.

### Popcorn Hack 2: Random Choice

```python
import random

snacks = ["chips", "fruit", "cookies", "popcorn"]
snack = random.choice(snacks)

print("Selected snack:", snack)
```

Do these five things:
1. List every value that can be printed.
2. Add one new snack.
3. Run the code at least five times.
4. Explain why the same snack can appear more than once.
5. Replace the list with your own category.

### Popcorn Hack 3: Fix the Range

This is supposed to simulate a six-sided die, but the range is wrong.

```python
import random

die = random.randint(0, 5)
print(die)
```

List the current possible results, fix the range so it returns `1` through `6`, and write the corrected random expression in JavaScript and College Board pseudocode.

### Popcorn Hack 4: Random Game Challenge

Build a small Python program using randomness. You can make a dice game, random prize, activity picker, opponent move, or another simple idea.

Your program must:
1. use `random.randint(...)` or `random.choice(...)`,
2. have at least three possible random results,
3. use the random result in an `if` / `elif` / `else` or another meaningful action,
4. still work when a value repeats,
5. include 2–3 sentences explaining the possible outputs.

---

## 4. Grading Plan (1 Point Total)

| Activity | Points | What earns the points |
| --- | ---: | --- |
| Popcorn Hack 1 | 0.2 | Correctly identify the smallest, largest, and all possible values in the random range. |
| Popcorn Hack 2 | 0.2 | Use `random.choice()` correctly, modify the list, and explain why repeats are possible. |
| Popcorn Hack 3 | 0.2 | Fix the six-sided die range and correctly write the equivalent JavaScript and College Board pseudocode. |
| Popcorn Hack 4 | 0.4 | Build a working random program with at least three possible outcomes, use the random result in a meaningful decision or action, handle repeats, and explain the possible outputs. |
| **Total** | **1.0** | |

---

## 5. Lesson Revisions & Feedback Evidence

- The lesson is organized into the same numbered `1` through `5` structure used by the reference lesson.
- Activity names use **Tech Talk** for instruction and **Popcorn Hack** for practice tasks.
- Python stays the main coding language, while JavaScript and College Board pseudocode are short comparison aids.
- Feedback from a practice run can be added here with the specific change that was made because of it.
