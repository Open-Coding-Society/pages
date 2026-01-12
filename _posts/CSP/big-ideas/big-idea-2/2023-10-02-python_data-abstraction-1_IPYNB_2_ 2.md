---
comments: True
layout: post
title: Big Idea 3.1 - Variables and Assignments
description: College Board topics 3.1-3.2
author: Nikki, Ankit, Monika, Varun
---

# 3.1 Variables and Assignments

### Variables

What is a variable?
- An abstraction inside a program that can hold value/store information
- Note: a variable should be concise but not too short (i.e. one letter), and it shouldn't have spaces or any special characters
    - Ex: "highScore" is more concise than "highestscoreinthegame"
    - Ex: "name" is more specific than "n"
    - Ex: "isitraining" doesn't have spaces in between the words
    - Ex: "phonenumber" doesn't have a hyphen like "555-number"

#### Examples


```python
numStudents = 26
print(numStudents)

car = "Tesla"
print(car)
```

    26
    Tesla


#### <font color = "4895EF"> Popcorn Hack 1 </font>

<font color = "4895EF"> Define your own variable and print it in a separate code cell using Python. Make it relate to one of your hobbies or interests. </font>

### Data Types

A data type is a type of variable, and these are 3 of the 4 main types: 
- integer: a mathematical number
- boolean: a yes/no or true/false statement
- text (or string): for any text-based variable (including phone numbers)

#### Examples
- Note that for Python you need to classify anything other than a string as a string (or "str") in order to print
- the following examples represent the storing of data within a variable 


```python
highScore = 9 
isRaining = False
firstName = "Nikki"
print(str(highScore) + " is an integer")
print(str(isRaining) + " is a boolean")
print(firstName + " is a string")
```

    9 is an integer
    False is a boolean
    Nikki is a string


#### <font color = "4895EF"> Popcorn Hack 2 </font>

<font color = "4895EF"> Define a string, boolean, and integer. Print all 3 together like so. </font>

### Changing Values

A variable itself isn't static, so you can change it to give different or more updated information. An example of this is having a variable that calculates changing age.

#### Examples
The following examples shows how you can replace one variable with another. See if you can figure out what data will be printed out before it runs!


```python
currentScore = 10
highScore = currentScore
currentScore = 7
print(str(highScore))
```

    10



```python
num1 = 25
num2 = 15
num3 = 30
num2 = num3 
num3 = num1
num1 = num2
print(str(num1))
print(str(num2))
print(str(num3))
```

    30
    30
    25


#### <font color = "4895EF"> Popcorn Hack 3 </font>

<font color = "4895EF"> Write a program to equate the value of a first variable to a second variable. Print the second variable, and you should see the same content as the first variable. </font>

# 3.2 Data Abstraction

### New Types of Variables
- Strings
    - an ordered sequence of characters
    - may contain letters, numbers, and all other special characters
    - Ex: words, phrases, sentences, ID numbers
- Lists
    - an ordered sequence of elements
    - each element is a variable
    - Ex: playlist of songs, names of students in a class, contacts in your phone

### List Index
- Each element of a string is referenced by an index
- For the AP test an index will start at 1 (example image below), but in actuality it starts at 0 (the following examples)

![listindex.png](listindex.png)

#### Examples


```python
groupNames = ["Nikki", "Ankit", "Varun", "Monika"]
print(groupNames[0])
print(groupNames[1])
print(groupNames[2])
print(groupNames[3])
```

    Nikki
    Ankit
    Varun
    Monika


#### <font color = "4895EF"> Popcorn Hack 4 </font>

<font color = "4895EF"> Create a list with your current schedule of classes. Print only the 2nd class in your schedule. </font>

### Data Abstraction - Lists
- lists allow for data abstraction
    - bundle variables together
      - strings, numbers, characters, etc.
    - give one name to a set of memory cells
      - do not need to know how many variables will be needed
    - do not need to know how the elements are stored together

#### Examples
The following example showcases the concept of changing values but with lists instead.


```python
scores1 = [89, 72, 34, 56, 83]
scores2 = [23, 25, 96, 55]
scores1 = scores2
print(str(scores1))
```

    [23, 25, 96, 55]


### How Lists Manage Complexity of a Program
- May not need as many variables (improves readability)
    - Ex: variable for each student is more tedious than one variable that holds all students
- Change the number of variables
    - Ex: if a student transfers in/out of school, you won't need to add/delete an entire variable (you're just deleting one element from a list)
- Consistent computations
    - Ex: a list of test scores can be curved with the same calculation for all scores (you can do it to everything all at once)

#### Examples
The following example showcases the convenience a list offers. The first series of scores would require more time to print out versus the second version (in list form). We would be able to curve the scores of a class all at once more easily using the second version.


```python
score1 = 23
score2 = 35
score3 = 25
score4 = 44
score5 = 56
score6 = 78
score7 = 62
score8 = 92
score9 = 94
score10 = 47

scores = [23, 35, 25, 44, 56, 78, 62, 92, 94, 47]
print(str(scores))
```

    [23, 35, 25, 44, 56, 78, 62, 92, 94, 47]


### Converting Data Types to and from JSON

This is useful for converting Python lists containing integers to a string. It can be used when connecting backend code (Python) to frontend code (JavaScript)

The following shows us assigning a variable "a" to a list of integers that has been converted to a string using `json.dumps`


```python
import json
lst = [1,2,3,4]
print(type(lst))
a = json.dumps(lst)
print(a)
print(type(a))
```

    <class 'list'>
    [1, 2, 3, 4]
    <class 'str'>


#### <font color = "4895EF"> Popcorn Hack 5 </font>

<font color = "4895EF"> Convert a list of integers in Python to a string using JSON. Assign a new variable to the newly converted string and print it. Also print the type of the new variable to ensure it is a string. </font>

### <font color = "FFC0CB"> Hack 1 </font>

<font color = "FFC0CB"> Sort the variables in the code cell below into these categories and write the adjoining numbers for each type: </font>

- <font color = "FFC0CB"> Integer: </font>
- <font color = "FFC0CB"> List: </font>
- <font color = "FFC0CB"> Boolean: </font>
- <font color = "FFC0CB"> String: </font>





```python
# Variable 1

numStudents = 26
print(numStudents)

# Variable 2

car = "Tesla"
print(car)

# Variable 3

groupMates = ["Nikki", "Monika", "Ankit", "Varun"]
print(groupMates)

# Variable 4

dogsbeatcats = True
print(dogsbeatcats)
```

    26
    Tesla
    ['Nikki', 'Monika', 'Ankit', 'Varun']
    True


### <font color = "FFC0CB"> Hack 2 </font>

<font color = "FFC0CB"> Now in a separate code cell, define one variable for each type above! Make them unique to your interests and be creative. For your list, convert it to a string using JSON and print it out. </font>
