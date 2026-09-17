---
layout: post
categories: [Python, Boolean-Expressions]
lesson_language: Python
lesson_topic: Boolean-Expressions
lesson_part: interactive
lesson_type: lesson
codemirror: true
microblog: true
toc: false
comments: false
title: 3.5 Boolean Expressions (PY)
description: Learn Boolean expressions in Python using the five-part LxD lesson format.
permalink: /python/boolean/py
---

# 3.5 Boolean Expressions in Python

A **Boolean expression** is a question that evaluates to only `True` or `False`. Python is the main language for this lesson. JavaScript and College Board pseudocode are only used to compare the same idea in different forms.

## 1. LxD Cycle Process

**Empathize:** Boolean expressions can look simple, but it is easy to mix up `and` and `or`, forget a boundary such as `>=`, or write a condition that does not match the rule in normal English.

**Define:**
- **POV:** CSP students need a clear way to turn real-world rules into Boolean expressions so their programs make the correct decisions.
- **Learning Goal:** Students will be able to evaluate, write, test, and explain Boolean expressions in Python.

**Ideate:**
- **HMW Question:** How might we make Boolean logic easier to understand before students have to write a full program?
- **Activity:** Predict Boolean results, fix an incorrect condition, and then build one complete decision checker.

**Prototype & Test:** Use the Popcorn Hacks below to check whether students can predict results before running code, choose the correct Boolean operator, and explain why their expression matches the rule.

---

## 2. Lesson Plan

**Learning Objective:** By the end of this lesson, you will be able to use comparisons, `and`, `or`, and `not` to create Boolean expressions and use them in Python decisions.

**Success Criteria:** You can predict whether an expression is `True` or `False`, write a condition from a rule in normal English, and test the condition with more than one set of values.

### Tech Talk 1: Comparisons Create Booleans

Python comparison operators return `True` or `False`.

| Python | Meaning | Example |
| --- | --- | --- |
| `==` | equal to | `score == 90` |
| `!=` | not equal to | `score != 0` |
| `>` | greater than | `score > 70` |
| `<` | less than | `age < 18` |
| `>=` | greater than or equal to | `score >= 70` |
| `<=` | less than or equal to | `age <= 18` |

```python
score = 82

print(score >= 70)
print(score == 100)
print(score != 0)
```

Remember:
- `score = 90` assigns a value.
- `score == 90` compares two values.

### Tech Talk 2: `and`, `or`, and `not`

Sometimes one comparison is not enough.

| Idea | Python | JavaScript | College Board pseudocode |
| --- | --- | --- | --- |
| both must be true | `and` | `&&` | `AND` |
| at least one is true | `or` | `||` | `OR` |
| reverse true/false | `not` | `!` | `NOT` |

```python
has_id = True
has_ticket = False

print(has_id and has_ticket)
print(has_id or has_ticket)
print(not has_ticket)
```

A longer expression can be read one part at a time:

```python
age = 16
is_teenager = age >= 13 and age <= 19
print(is_teenager)
```

### Tech Talk 3: Booleans Control `if` Statements

An `if` statement runs when its condition is true.

```python
temperature = 72

if temperature >= 70:
    print("It is warm outside.")
else:
    print("It is not warm outside.")
```

The same basic decision in College Board pseudocode is:

```text
IF(temperature ≥ 70)
{
    DISPLAY("It is warm outside.")
}
ELSE
{
    DISPLAY("It is not warm outside.")
}
```

---

## 3. Popcorn Hacks & Practice Tasks

### Popcorn Hack 1: Predict Before You Run

Predict each result first. Then run the code and compare.

```python
print(8 > 5)
print(4 == 7)
print("cat" != "dog")
print(10 <= 10)
```

For each line, write `True` or `False` and one short reason.

### Popcorn Hack 2: Fix the Logic

A level should unlock only when the player has **at least 10 coins AND has found the key**.

```python
coins = 12
has_key = False

# Fix the condition so both requirements are needed.
can_unlock = coins >= 10 or has_key

if can_unlock:
    print("Level unlocked")
else:
    print("Keep looking")
```

Do these four things:
1. Predict what the current code prints.
2. Fix the Boolean expression.
3. Test at least three combinations of `coins` and `has_key`.
4. Explain why the rule needs `and` or `or`.

### Popcorn Hack 3: Translate the Logic

Start with this Python expression:

```python
has_ticket or on_guest_list
```

Write the same Boolean expression in JavaScript and College Board pseudocode. Then explain what word in **"ticket or guest list"** tells you which operator to use.

### Popcorn Hack 4: Boolean Decision Checker

A student can use a study room when:
- they are logged in,
- they reserved the room **or** a teacher gave permission,
- and the room is **not** closed.

```python
logged_in = True
reserved_room = False
teacher_permission = True
room_closed = False

# Replace False with one Boolean expression.
can_use_room = False

if can_use_room:
    print("Study room access approved")
else:
    print("Study room access denied")
```

Test at least four cases, including one where the room is closed and one where the student is not logged in. Then explain your Boolean expression in 2–3 sentences.

---

## 4. Grading Plan (1 Point Total)

| Activity | Points | What earns the points |
| --- | ---: | --- |
| Popcorn Hack 1 | 0.2 | Correctly predict each Boolean result and include a short explanation. |
| Popcorn Hack 2 | 0.2 | Fix the Boolean logic and test at least three combinations. |
| Popcorn Hack 3 | 0.2 | Correctly translate the Boolean expression into JavaScript and College Board pseudocode. |
| Popcorn Hack 4 | 0.4 | Build the study-room Boolean expression using all required conditions, test at least four cases, and explain the final expression in 2–3 sentences. |
| **Total** | **1.0** | |

---

## 5. Lesson Revisions & Feedback Evidence

- The lesson is organized into the same numbered `1` through `5` structure used by the reference lesson.
- Activity names use **Tech Talk** for instruction and **Popcorn Hack** for practice tasks.
- Python stays the main coding language, while JavaScript and College Board pseudocode are short comparison aids.
- Feedback from a practice run can be added here with the specific change that was made because of it.
