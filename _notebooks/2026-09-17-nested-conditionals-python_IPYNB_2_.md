---
layout: post
categories: [Python, Nested-Conditionals]
lesson_language: Python
lesson_topic: Nested-Conditionals
lesson_part: interactive
lesson_type: lesson
codemirror: true
microblog: true
toc: false
comments: false
title: 3.7 Nested Conditionals (PY)
description: Learn nested conditionals in Python using the five-part LxD lesson format.
permalink: /python/nested-conditionals/py
---

# 3.7 Nested Conditionals in Python

A **nested conditional** is an `if` statement inside another `if`, `elif`, or `else` block. The outer decision chooses a path first, and the inner decision checks a more specific condition inside that path. Python is the main language for this lesson. JavaScript and College Board pseudocode are only used to compare the same idea in different forms.

## 1. LxD Cycle Process

1. **Empathize:** Nested conditionals can be confusing because indentation changes which decision owns an inner branch, and students may check a detail before confirming that the larger condition applies.

2. **Define:**
- **POV:** CSP students need a clear way to trace decisions from the outside in so they can build programs with multiple levels of rules.
- **Learning Goal:** Students will be able to trace, write, test, and explain nested conditionals in Python.

3. **Ideate:**
- **HMW Question:** How might we make each path through a nested conditional visible before students write a larger program?
- **Activity:** Trace an outer and inner decision, fix incorrect indentation, translate nested logic, and build a two-level decision checker.

4. **Prototype:** Build the Tech Talk examples, three Popcorn Hacks, and one Homework Hack. The examples move from tracing a single path to creating a complete two-level decision checker.

5. **Test:** Teach the draft, check whether students can identify the path a program follows, and collect feedback. Revise any explanation or activity that causes confusion and record the change in Section 5.

---

## 2. Lesson Plan

**Learning Objective:** By the end of this lesson, you will be able to use nested `if` statements in Python when a second decision should happen only after a first condition selects a path.

**Success Criteria:** You can trace a nested conditional, explain how indentation controls its branches, write a two-level decision, and test all of its possible paths.

### Tech Talk 1: Decisions Inside Decisions

The outer condition is checked first. The inner condition is reached only when execution enters the block that contains it.

```python
has_account = True
password_correct = False

if has_account:
    if password_correct:
        print("Login approved")
    else:
        print("Incorrect password")
else:
    print("Create an account first")
```

Python checks `has_account` before it checks `password_correct`. If `has_account` is `False`, the password condition is skipped because it belongs inside the first branch.

### Tech Talk 2: Indentation Shows the Structure

Python uses indentation to show which statements belong together. Each nested level is indented one additional level.

```python
assignment_submitted = True
submitted_on_time = True

if assignment_submitted:
    if submitted_on_time:
        print("Submitted on time")
    else:
        print("Submitted late")
else:
    print("Assignment missing")
```

This example has three possible paths, but only one message prints during a run. Moving the inner `else` to the wrong indentation level would change which `if` statement it belongs to.

### Tech Talk 3: Nested and Compound Conditions Are Different

A compound condition checks multiple Boolean expressions at the same time. A nested conditional makes the second check depend on the first path.

| Purpose | Python example |
| --- | --- |
| Both rules must be true for one result | `if has_ticket and has_id:` |
| Check a detail only after entering a path | `if has_ticket:` then nested `if has_id:` |

The same nested structure appears in three forms:

| Form | Outer and inner decision |
| --- | --- |
| Python | `if condition_a:` then indented `if condition_b:` |
| JavaScript | `if (conditionA) { if (conditionB) { ... } }` |
| College Board pseudocode | `IF(conditionA) { IF(conditionB) { ... } }` |

---

## 3. Popcorn Hacks & Practice Tasks

### Popcorn Hack 1: Trace the Path

Predict the output before running the code.

{% capture challenge0 %}
Popcorn Hack 1 - Trace the nested conditional and test all three outcomes
{% endcapture %}

{% capture code0 %}
is_weekday = True
homework_finished = False

if is_weekday:
    if homework_finished:
        print("Free time")
    else:
        print("Finish homework")
else:
    print("Weekend plan")
{% endcapture %}

{% capture source0 %}
```python
# CODE_RUNNER: Popcorn Hack 1 - Trace the nested conditional and test all three outcomes

is_weekday = True
homework_finished = False

if is_weekday:
    if homework_finished:
        print("Free time")
    else:
        print("Finish homework")
else:
    print("Weekend plan")
```
{% endcapture %}

{% include runners/code.html
   runner_id="python-nested-conditionals-py-0"
   language="python"
   challenge=challenge0
   code=code0
   source=source0
%}

Do these three things:
1. Write the message that will print.
2. Name the outer branch and inner branch the program follows.
3. Change the values to reach each of the other two outcomes.

### Popcorn Hack 2: Fix the Indentation

The program should check `has_permission` only when the user is logged in, but the inner decision is not indented correctly.

{% capture challenge1 %}
Popcorn Hack 2 - Fix the indentation and test all three login outcomes
{% endcapture %}

{% capture code1 %}
logged_in = True
has_permission = False

if logged_in:
    print("Account found")
if has_permission:
    print("Page opened")
else:
    print("Permission needed")
{% endcapture %}

{% capture source1 %}
```python
# CODE_RUNNER: Popcorn Hack 2 - Fix the indentation and test all three login outcomes

logged_in = True
has_permission = False

if logged_in:
    print("Account found")
if has_permission:
    print("Page opened")
else:
    print("Permission needed")
```
{% endcapture %}

{% include runners/code.html
   runner_id="python-nested-conditionals-py-1"
   language="python"
   challenge=challenge1
   code=code1
   source=source1
%}

Do these four things:
1. Explain why the current code is not nested.
2. Move the permission check inside the logged-in branch.
3. Add an outer `else` that prints `Log in first`.
4. Test all three possible messages.

### Popcorn Hack 3: Translate the Structure

Start with this Python nested conditional:

{% capture challenge2 %}
Popcorn Hack 3 - Run the nested decision, then translate its structure
{% endcapture %}

{% capture code2 %}
club_member = True
meeting_today = False

if club_member:
    if meeting_today:
        print("Go to the meeting")
    else:
        print("Check the next meeting date")
else:
    print("Join the club first")
{% endcapture %}

{% capture source2 %}
```python
# CODE_RUNNER: Popcorn Hack 3 - Run the nested decision, then translate its structure

club_member = True
meeting_today = False

if club_member:
    if meeting_today:
        print("Go to the meeting")
    else:
        print("Check the next meeting date")
else:
    print("Join the club first")
```
{% endcapture %}

{% include runners/code.html
   runner_id="python-nested-conditionals-py-2"
   language="python"
   challenge=challenge2
   code=code2
   source=source2
%}

Write the same structure in JavaScript and College Board pseudocode. Then explain which condition is checked first and when `meeting_today` is skipped.

### Homework Hack: Two-Level Event Checker

Build a Python program for a school event. First check whether registration is complete. Only registered students should then be checked for a digital or printed pass.

Your program must:
1. use one outer `if` / `else`,
2. place an inner `if` / `else` inside the registered branch,
3. produce at least three distinct outcomes,
4. test one input for every outcome,
5. include 2–3 sentences explaining why the second check is nested.

{% capture challenge3 %}
Homework Hack - Complete and test the two-level school event checker
{% endcapture %}

{% capture code3 %}
registered = True
has_pass = False

# Change the values above to test all three outcomes.
if registered:
    if has_pass:
        print("Entry approved")
    else:
        print("Registered, but a pass is required")
else:
    print("Complete registration first")
{% endcapture %}

{% capture source3 %}
```python
# CODE_RUNNER: Homework Hack - Complete and test the two-level school event checker

registered = True
has_pass = False

# Change the values above to test all three outcomes.
if registered:
    if has_pass:
        print("Entry approved")
    else:
        print("Registered, but a pass is required")
else:
    print("Complete registration first")
```
{% endcapture %}

{% include runners/code.html
   runner_id="python-nested-conditionals-py-3"
   language="python"
   challenge=challenge3
   code=code3
   source=source3
%}

---

## 4. Grading Plan (1 Point Total)

| Activity | Points | What earns the points |
| --- | ---: | --- |
| Popcorn Hack 1 | 0.15 | Correctly predict the path and change the values to reach all outcomes. |
| Popcorn Hack 2 | 0.15 | Correctly nest the permission check, add the outer `else`, and test all outcomes. |
| Popcorn Hack 3 | 0.20 | Correctly translate the structure into JavaScript and College Board pseudocode and explain the execution order. |
| Homework Hack | 0.50 | Build a working two-level event checker, test every outcome, and explain why the inner decision depends on the outer branch. |
| **Total** | **1.0** | |

---

## 5. Lesson Revisions & Feedback Evidence

- The lesson is organized into the same numbered `1` through `5` structure used by the Boolean Expressions and Random Values lessons.
- Activity names use **Tech Talk**, **Popcorn Hack**, and **Homework Hack** as required by the Sprint 2 teaching objectives.
- Python stays the main coding language, while JavaScript and College Board pseudocode are short comparison aids.
- The examples progress from tracing one path to building and testing a complete two-level decision.
- **Feedback applied:** The LxD process was revised from a combined “Prototype & Test” entry into five explicit, numbered stages, and the final challenge was labeled as a Homework Hack to match the course requirements.
