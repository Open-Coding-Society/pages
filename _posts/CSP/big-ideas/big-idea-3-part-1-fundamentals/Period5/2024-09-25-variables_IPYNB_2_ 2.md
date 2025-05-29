---
layout: post
title: 3.2 - Data Abstraction - Variables
description: Nolan & Jacob's Data Abstraction Presentation
author: Nolan
toc: True
comments: True
menu: nav/csp_units/csp_unit3_p5_fundamentals.html
permalink: /csp/big-idea/p5/3-2-1
---

```python
from IPython.core.display import HTML; set_custom_css = lambda: HTML('<style>:root {--light-pink: #ffccdd; --medium-pink: #ff66b3; --dark-pink: #ff3385; --accent-pink: #ff99cc; --background-pink: #ffe6f0;} body {background-color: var(--background-pink) !important; color: var(--dark-pink) !important;} article {background-color: var(--light-pink) !important; color: var(--dark-pink) !important; border: 2px solid var(--medium-pink) !important; padding: 20px !important; border-radius: 8px !important;} a {color: var(--accent-pink) !important;} a:hover {color: var(--dark-pink) !important;} h1, h2, h3, h4 {color: white !important;} blockquote {background-color: #272726 !important; border-left: 4px solid var(--medium-pink) !important; color: var(--dark-pink) !important; padding: 10px 20px !important; margin: 10px 0 !important; border-radius: 4px !important;} code {background-color: var(--accent-pink) !important; color: white !important; padding: 2px 4px !important; border-radius: 4px !important;} .site-nav {background-color: var(--medium-pink) !important;} table td {background-color: var(--dark-pink) !important;}</style>'); set_custom_css()

```




<style>:root {--light-pink: #ffccdd; --medium-pink: #ff66b3; --dark-pink: #ff3385; --accent-pink: #ff99cc; --background-pink: #ffe6f0;} body {background-color: var(--background-pink) !important; color: var(--dark-pink) !important;} header {background-color: var(--medium-pink) !important; color: white !important; padding: 10px 20px !important; border-radius: 8px !important; border-bottom: 2px solid var(--dark-pink) !important;} article {background-color: var(--light-pink) !important; color: var(--dark-pink) !important; border: 2px solid var(--medium-pink) !important; padding: 20px !important; border-radius: 8px !important;} a {color: var(--accent-pink) !important;} a:hover {color: var(--dark-pink) !important;} h1, h2, h3, h4 {color: white !important;} blockquote {background-color: #272726 !important; border-left: 4px solid var(--medium-pink) !important; color: var(--dark-pink) !important; padding: 10px 20px !important; margin: 10px 0 !important; border-radius: 4px !important;} code {background-color: var(--accent-pink) !important; color: white !important; padding: 2px 4px !important; border-radius: 4px !important;} .site-nav {background-color: var(--medium-pink) !important;} table td {background-color: var(--dark-pink) !important;}</style>



| [3.2.1](/pages/csp/big-idea/p5/3-2-1) | [3.2.2](/pages/csp/big-idea/p5/3-2-2) | [3.2.3](/pages/csp/big-idea/p5/3-2-3) |


# Nolan & Jacob's Presentation

**Data Abstraction** is the way that complex data of many types is simplified and interacted with.

## Variable Types

**Integers (int)**

> A number **without** decimals/fractions. Good for simple math & counting

```python
three = 3
print(three)
# -> 3
```

JS:

```javascript
var three = 3;
console.log(three);
// -> 3
```

**Floating-Point Numbers (float)**

> A number **with** decimals. Good for math.

```python
deci = 2.5
print(deci - 2)
# -> 0.5
```

JS:

```javascript
var deci = 2.5;
console.log(deci - 2);
// -> 0.5
```

**Strings (str)**

> Basically Text. Good for when you need to use words, like names.

```python
name = "Nolan"
print("This was written by " + name)
# -> This was written by Nolan
```

JS:

```javascript
var name = "Jacob";
console.log("This was written by " + name);
// -> This was written by Jacob
```

**Lists (list)**

> A list of different variables that **is editable**. Also know as an _array_ in Javascript and other languages.

```python
classes = ["Math", "Spanish", "Photo"]
print(classes[0])
print(classes[1])
print(classes[2])
print(classes)
# note: indexes in Python and Javascript start at 0, not one
#-> Math
# -> Spanish
# -> Photo
# -> ['Math', 'Spanish', 'Photo']

classes[1] = "NOT Spanish >:)"
classes.append("AP Lunch")
print(classes)
# -> ['Math', 'NOT Spanish >:)', 'Photo', 'AP Lunch']
```

JS:

```javascript
var classes = ["AP World", "IDK"];
classes[1] = "Chem";
console.log(classes[1]);
// -> Chem

classes.push("Bio");
console.log(classes);
// -> [ "AP World", "Chem", "Bio" ]
```

**Tuples (tuple)**

> A list, but can't change the keys in it **(immutable)**

`thingsyoucantchange = ("your height", "your middle name")`

Javascript:

```javascript
const thingsyoucantchange = ["t", "a"]; // you cant change a key in a constant variable
```

**Dictionaries (dict)**

> Think of it like a two column table, one side has the name of a varable, and the other side its value. Basically a list, but also with the names of the values/keys. Known as an _object_ in Javascript and other languages.

```python
jacob = {
    "age": 15, # int
    "school": "Del Norte", # str
    "classes": ["Math", "English", "CSP"] # list
}

print(jacob)
# important note: in both python and js, you put commas at the end of a key if there is a key after, and unlike js, in python you NEED to use quotes around the key's name.
# -> {'age': 15, 'school': 'Del Norte', 'classes': ['Math', 'English', 'CSP']}
print(jacob["age"])
# -> 15
print(jacob["classes"][1])
# -> English
```

JS:

```javascript
const nolan = {
  age: 15,
  school: "not delnorte",
};

nolan.school = "Westview"; // -> changes it to Westview
nolan["school"] = "Del Norte"; // -> changes it to Del Norte
```

**Sets (set)**

> A list, but you can't change any of the values (immutable) and you can't access certain values in it with an **index.**

```python
thingsyouwillalwayshave = {"small height", "an unchangable middlename", "brainrot"}
```

JS:

```javascript
var morethings = new Set();
morethings.add("ugh");
console.log(morethings);
console.log(morethings.has("ugh"));
// -> [ "ugh" ]
// -> true
```

**Booleans (bool)**

> True or false **(binary)**.

```python
facts = True
print("Magic 8 Ball, does Nolan deserve an A in this class?")
print("[8] Magic 8 Ball is thinking ...")
print("[8] The ball has decided, that is " + str(facts))

'''
Magic 8 Ball, does Nolan deserve an A in this class?
[8] Magic 8 Ball is thinking ...
[8] The ball has decided, that is True
'''
# Also, make sure that True and False have the first letter capitalized.
```

### Popcorn Hack!

Make an 8ball with a different output/prompt

JS:

```javascript
let timmy = true;
console.log(timmy); // -> true
timmy = false;
console.log(timmy); // -> false
```

**None (NoneType)**

> A variable with no type / value. Good for a placeholder &/or to show no value.

`x = None #capital letter`
**Javascript:**
`var timmy;`

