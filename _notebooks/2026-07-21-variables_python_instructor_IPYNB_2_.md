---
layout: post
courses: {'csp': {'week': 1}}
categories: ['Python', 'Variables-and-Assignments']
lesson_language: Python
lesson_topic: Variables-and-Assignments
lesson_part: interactive
lesson_type: lesson
codemirror: True
title: 3.1 Variables and Assignments
description: Learn about the different variables assignments and data types in Python and compare with JavaScript.
permalink: /python/variables
type: lesson
author: John Mortensen
---

## Python Variables

Welcome! 

In this lesson, you'll learn about Python variables and assignments. 

**Lesson Goal:**
- Understand how Python variables and assignments work, and how they compare to JavaScript.
- See how Python's approach to variables, types, and objects is similar to and different from JavaScript.

**JavaScript versus Python**
Learning Python is easier when you see the parallels. The Python and JavaScript languages both use variables, data types, and objects; the concepts are the same but the syntax often looks different.

---

## Review Primitive and Reference "Data Types"

Just like JavaScript, Python has two main categories of data types: **primitive types** (which store simple values directly) and **reference types** (which store references to more complex data).

### Primitive Data Types

**In JavaScript:** You learned about `Number`, `String`, `Boolean`, `Undefined`, `Null`, `Symbol`, and `BigInt` as primitive types.

**In Python:** The most common primitive types are:
- `int` (integer numbers, like `42`)
- `float` (decimal numbers, like `3.14`)
- `str` (strings, like `'hello'`)
- `bool` (Boolean values: `True` or `False`)
- `NoneType` (the special value `None`, similar to JavaScript's `null`)

Python does not have `undefined`, `symbol`, or `bigint` types, but the core idea is the same: these types hold simple, single values.

### Reference Data Types

**In JavaScript:** You used `Object`, `Array`, and `Function` as reference types. These store references (links) to more complex data structures.

**In Python:** The most common reference types are:
- `list` (like JavaScript arrays: `[1, 2, 3]`)
- `dict` (like JavaScript objects: `{'name': 'Mario', 'score': 0}`)
- `set` (a collection of unique values: `{'apple', 'banana'}`)
- `function` (functions are also objects in Python)

When you assign a reference type in Python, you are assigning a reference (a link) to the object, not a copy of the object—just like in JavaScript.

**Why does this matter?**
Understanding the difference between primitive and reference types helps you predict how variables behave when you assign, copy, or modify them.

## Hack: Python Dictionary Key-Value 

**Why?**

Defining user properties in key-value format is a requirement of most computer languages. In the user_profile modify code to track a new property (for example, a user's favorite color, login count, or last activity).




{% capture challenge0 %}
Dictionary Key-Value Hack
{% endcapture %}

{% capture code0 %}
# --- Primitive Types ---
user_id = 101            # int: unique user ID
user_name = 'Alice'      # str: user name
user_email = 'alice@example.com' # str: user email
is_active = True         # bool: is the user active?
last_login = None        # NoneType: no login yet

print('user_id:', user_id, '| type:', type(user_id))
print('user_name:', user_name, '| type:', type(user_name))
print('user_email:', user_email, '| type:', type(user_email))
print('is_active:', is_active, '| type:', type(is_active))
print('last_login:', last_login, '| type:', type(last_login))

# --- Reference Types ---
user_profile = { # dict: user profile as a dictionary
    'id': user_id,
    'name': user_name,
    'email': user_email,
    'active': is_active,
    'scores': [0.91, 0.87, 0.76, 0.55, 0.92], # reference to a list of float: user scores
    'roles': ['student', 'scrummer'], # reference to a list of str: user roles
    'last_login': last_login
}  # dict: user profile as a dictionary

print('user_profile:', user_profile, '| type:', type(user_profile))

# list: login history (empty to start)
login_history = []
print('login_history:', login_history, '| type:', type(login_history))

# set: unique permissions
permissions = set(['read', 'write', 'delete'])
print('permissions:', permissions, '| type:', type(permissions))

# function: a simple function to greet the user
def greet(user):
    print(f"Hello, {user['name']}!")

print('greet:', greet, '| type:', type(greet))
greet(user_profile)
{% endcapture %}

{% capture source0 %}
```python
# CODE_RUNNER: Dictionary Key-Value Hack

# --- Primitive Types ---
user_id = 101            # int: unique user ID
user_name = 'Alice'      # str: user name
user_email = 'alice@example.com' # str: user email
is_active = True         # bool: is the user active?
last_login = None        # NoneType: no login yet

print('user_id:', user_id, '| type:', type(user_id))
print('user_name:', user_name, '| type:', type(user_name))
print('user_email:', user_email, '| type:', type(user_email))
print('is_active:', is_active, '| type:', type(is_active))
print('last_login:', last_login, '| type:', type(last_login))

# --- Reference Types ---
user_profile = { # dict: user profile as a dictionary
    'id': user_id,
    'name': user_name,
    'email': user_email,
    'active': is_active,
    'scores': [0.91, 0.87, 0.76, 0.55, 0.92], # reference to a list of float: user scores
    'roles': ['student', 'scrummer'], # reference to a list of str: user roles
    'last_login': last_login
}  # dict: user profile as a dictionary

print('user_profile:', user_profile, '| type:', type(user_profile))

# list: login history (empty to start)
login_history = []
print('login_history:', login_history, '| type:', type(login_history))

# set: unique permissions
permissions = set(['read', 'write', 'delete'])
print('permissions:', permissions, '| type:', type(permissions))

# function: a simple function to greet the user
def greet(user):
    print(f"Hello, {user['name']}!")

print('greet:', greet, '| type:', type(greet))
greet(user_profile)
```
{% endcapture %}

{% include runners/code.html
   runner_id="python-variables-0"
   language="python"
   challenge=challenge0
   code=code0
   source=source0
%}


---

## Review Python "Classes" and "Objects"

### Classes
Define a class ```class User```
Define a constructor ```def __init__(self, user_id, name, email, active, scores, roles, last_login)```

### Define methods
Define procedures inside the class (methods) that enable interaction with the object" ```def add_score(self, score)```

### Create a variable
Define an instance of the class: ```alice = User(101, 'Alice', 'alice@example.com', True, [0.91, 0.87, 0.76, 0.55, 0.92], ['student', 'scrummer'], None) ```

## Hack: Python Class and Instances 

**Why?**  

Defining user object is a key to most programming languages. Think about and add something you would want to track in a user class (for example, use the properties you defined in previous hack).

Define multiple user objects.




{% capture challenge1 %}
Python-Class Hack
{% endcapture %}

{% capture code1 %}
'''
# --- Object Type ---
# Define a User class to encapsulate user data and behavior
'''
class User:
    # Constructor to initialize user properties in the object
    def __init__(self, user_id, name, email, active, scores, roles, last_login):
        self.id = user_id
        self.name = name
        self.email = email
        self.active = active
        self.scores = scores
        self.roles = roles
        self.last_login = last_login

    # String representation of the User object  
    def __repr__(self): 
        return (
            f'User(id={self.id}, name={self.name}, email={self.email}, active={self.active}, ' f'scores={self.scores}, roles={self.roles}, last_login={self.last_login})'
        )
        
    def add_score(self, score):
        self.scores.append(score)
        
    def average_score(self):
        return sum(self.scores) / len(self.scores) if self.scores else 0

alice = User(101, 'Alice', 'alice@example.com', True, [0.91, 0.87, 0.76, 0.55, 0.92], ['student', 'scrummer'], None)
john = User(102, 'John', 'john@example.com', True, [0.85, 0.80, 0.78, 0.90, 0.88], ['student'], None) 
print(alice)
print(alice.name, round(alice.average_score(), 2), alice.scores)
alice.name = 'Alice Smith'
alice.add_score(0.95)
print(alice.name, round(alice.average_score(), 2), alice.scores)
print(john)
print(john.name, round(john.average_score(), 2), john.scores)
{% endcapture %}

{% capture source1 %}
```python
# CODE_RUNNER: Python-Class Hack

'''
# --- Object Type ---
# Define a User class to encapsulate user data and behavior
'''
class User:
    # Constructor to initialize user properties in the object
    def __init__(self, user_id, name, email, active, scores, roles, last_login):
        self.id = user_id
        self.name = name
        self.email = email
        self.active = active
        self.scores = scores
        self.roles = roles
        self.last_login = last_login

    # String representation of the User object  
    def __repr__(self): 
        return (
            f'User(id={self.id}, name={self.name}, email={self.email}, active={self.active}, ' f'scores={self.scores}, roles={self.roles}, last_login={self.last_login})'
        )
        
    def add_score(self, score):
        self.scores.append(score)
        
    def average_score(self):
        return sum(self.scores) / len(self.scores) if self.scores else 0

alice = User(101, 'Alice', 'alice@example.com', True, [0.91, 0.87, 0.76, 0.55, 0.92], ['student', 'scrummer'], None)
john = User(102, 'John', 'john@example.com', True, [0.85, 0.80, 0.78, 0.90, 0.88], ['student'], None) 
print(alice)
print(alice.name, round(alice.average_score(), 2), alice.scores)
alice.name = 'Alice Smith'
alice.add_score(0.95)
print(alice.name, round(alice.average_score(), 2), alice.scores)
print(john)
print(john.name, round(john.average_score(), 2), john.scores)
```
{% endcapture %}

{% include runners/code.html
   runner_id="python-variables-1"
   language="python"
   challenge=challenge1
   code=code1
   source=source1
%}


---
