---
comments: True
layout: post
title: Big Idea 3.1 - Variables and Assignments
description: College Board topics 3.1-3.2
toc: True
author: Sharon, Tara, Alisha, Alara, Grace
---

# 3.1 - What are variables 
#### Sharon Kodali

Variables: an abstraction inside a program that can hold a value 

A variable can be thought of as a container or a box that holds information that your program can use or modify 

Variables help you manage and organize your work with data, making your code more organized, readable, and adaptable. 

## different data types to store variables in
- integer 
        used to store numbers that can later be used in mathematical operations
        ex: age or temperature
- Text(string)
        Used to store texts lists and words that can later be referenced 
        ex: Name, phone number, or address
-  Boolean
        used to store simply of true or false
        ex: is it raining


## Correct way to name variables

incorrect:
        my highs-coreinthegame or n
- too long and can make the code messy 
- dashes are not allowed when naming variables 
- spaces are not allowed when naming variables 
-  descriptive enough to easily recall what the variable repersents

correct:
    highscore or numstudents or israining
- short 
- descriptive
- easy to distingush type of variable


## 3.1 Hacks

### instructions: Determine what would be the the best variable name and data type for the specific prompt

- storing if someones pet is a dog
- storing someones birthday
- storing the amount of money someone is spending 
- storing if it is sunny

#### Homework: write a greeting using variables in python 

# Naming Conventions

    - Must start with a letter or an underscore
    - Cannot start with a number 
    - Can only have alphanumeric characters or underscores 
    - Are case sensitive 
    - Cannot be python keywords such as 'else'



```python
myName = "Tara"
print(myName)
```

    Tara



```python
1Tara = "16"
```


      Cell In[2], line 1
        1Tara = "16"
        ^
    SyntaxError: invalid decimal literal




```python
myAge = 16 
myage = 46

print(myAge)
print(myage)
```


```python
else = 22
```

# Primitive v. Collection Data Types 

## Primitive Data Types 
    - int 
    - string 
    - float 
    - boolean 

## Collection Data Types 
    - list 
    - dictionary 


```python
myInt = 20

myString = "My name is Tara"

myFloat = 77.29

myBool = False 
```


```python
agesOfMyFriendsList = [16, 20, 15, 12]

print(agesOfMyFriendsList)
```


```python
agesOfMyFriendsDictionary = { "Tara" : 16, "Tanisha" : 15, "Dylan" : 12, "Tara " : 17}


print(agesOfMyFriendsDictionary["Tara"])

print(agesOfMyFriendsDictionary["Tara "])

```

# Concatenation 

## 'Joining' of strings and other types 


```python
myFirstName = "Tara"

myLastName = "Sehdave"

print(myFirstName + " " + myLastName)
```


```python
myFirstInt = 5

mySecondInt = 10 

print(myFirstInt + mySecondInt)
```

# Formatting allows us to display values using pre-decided rules 


```python
message = "My first name is {0} and my last name is {1}"

print(message.format("Tara", "Sehdave"))

print(message.format("Tanisha", "Patil"))
```


```python
x = .77 

message = "Show this as a percentage {0:.0%}"

print(message.format(x))

print(message.format(.25))
```


```python
message = "The binary value of {0} is {0:b} and the binary value of {1} is {1:b}"

print(message.format(7, 6836))
```

# Conversions 


```python
import json

myDictionary = {"A": 1, "B": 2}

print(myDictionary) 

myStringDictionary = json.dumps(myDictionary)

print(myStringDictionary)

myDictionaryRecreated = json.loads(myStringDictionary)

print(myDictionaryRecreated)

```


```python
# Python Data Types in CB Pseudo Code 

## Primitive Types 

a <-- expression 
- myInt <-- 18
- myString <-- "My name is Tara"
- myFloat <-- 6.8
- myBool <-- False 

# Collection Types 

- myList <-- [1, 2, 3]
- No dictionary 
```

# Data Type Practice  

### Question 1: Integer Operation
1. Declare two integer variables, `num1Int` and `num2Int`, and assign them values of your choice.
2. Calculate the sum of `num1Int` and `num2Int`
4. Print the sum

### Question 2: Float Operation
1. Declare two float variables, `float1` and `float2`, and assign them values of your choice.
2. Calculate the quotient of 'float1' and 'float2'
3. Print the quotient 

### Question 3: Format Manipulation 
1. Write a message that equals a sentence with two placeholder variables
2. Write two strings with two placeholder variables to insert into the message 
3. Print that message 

# Answers 


```python
# Integer Operations

num1Int = 16

num2Int = 12

print(num1Int + num2Int)
```


```python
# Float Operation

float1 = 1.00

float2 = .75 

print(float1 / float2 )
```


```python
# Format Manipulation 

message = "{0} is {1} years old"

print(message.format("Tara", "16"))

print (message.format("Sharon", "8"))

print (message.format("Dylan", "80"))
```

# <code style="color: #4e804f">☆ Topic 3.2 ☆</code>
> ### <code style="color:#4e804f;">☆ Using lists as an abstraction to manage a program's complexity</code>
> ### <code style="color:#4e804f;">☆ learn about the lists section of the exam reference sheet</code>

## Things to remember
- use lists to store multiple elements 
- data abstraction provides a seperation between abstract parts of a datatype and the actual details of it
- it can be created using lists
- the exam reference sheets has list notations
- the reference sheet has a list structure with index values 1-#of elements in the list. if list index is less that 1 or greater than the list
- variables must be **bundled** together
    - strings, characters, words, numbers
- give one name to a set of cells 



```python
num =[1, 2, 3, 4]
abc = ["a", "b", "c"]
colors = ["red", "green", "blue"]
emptylist = []

#replacing
alist = [10, 20, 30, 40, 50]
blist = [20, 40, 60, 80, 100]
alist = blist

print(alist)
#what will be the output of this code?

```


```javascript
%%javascript
# Define an array with elements
const colors = ["Red", "Green", "Blue", "Yellow"];
# Access elements using indexes
const firstColor = colors[0]; // Index 0: "Red"
const secondColor = colors[1]; // Index 1: "Green"
#  Modify an element at a specific index
colors[2] = "Purple"; // Index 2 is changed from "Blue" to "Purple"
# Add a new element to the array
colors.push("Orange"); // Adds "Orange" to the end of the array
# Print elements and their indexes
console.log("First Color:", firstColor);
console.log("Second Color:", secondColor);
console.log("Updated Colors Array:", colors);
# Define a string
const greeting = "Hello, World!";
# Print the string
console.log(greeting);
```

# 3.2.3 Data Abstraction
-Manages complexity of data collection
-Program easier to develop and maintain
-Lists
-If a list index is less than 1 or greater than the length of the list, an error message will be produced
### How lists help with complexity
-Less variables (like one variable that holds multiple numbers instead of one variable for each number)
-Changes number of variables
-Consistency
-Helps readability
### Example
variable1 = 2
variable2 = 5
variable3 = 4
### Would be simplified like this!
scores = [2, 5, 4]
# Activity - Turn this into a list!
variable1 = 7
variable2 = 9
variable3 = 2
variable4 = 8
