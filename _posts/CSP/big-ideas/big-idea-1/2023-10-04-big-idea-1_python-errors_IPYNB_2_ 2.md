---
layout: post
title: Big Idea 1.4 - Correcting errors
description: Practice with identifying and correcting code blocks
categories: ['Python']
author: Sean Yeung
---

[College Board Big Idea 1](https://apclassroom.collegeboard.org/103/home?unit=1)

## Identifying and Correcting Errors (Unit 1.4)
> Become familiar with types of errors and strategies to fixing them
- Lightly Review Videos and take notes on topics with Blog
- Complete assigned MCQ questions

# Here are some code segments you can practice fixing:


```python
#Create a list of the alphabet

alphabet = "abcdefghijklmnopqrstuvwxyz"

alphabetList = []

for i in alphabet:
    alphabetList.append(i)

print(alphabetList)
```

The intended outcome is to determine where the letter is in the alphabet using a while loop
- What is a good test case to check the current outcome? Why?
- Make changes to get the intended outcome.


```python


letter = input("What letter would you like to check?")

i = 0

while i < 26:
    if alphabetList[i] == letter:
        print("The letter " + letter + " is the " + str(i) + " letter in the alphabet")
    i += 1


```

The intended outcome is to determine where the letter is in the alphabet using a for loop
- What is a good test case to check the current outcome? Why?
- Make changes to get the intended outcome.


```python


letter = input("What letter would you like to check?")

for i in alphabetList:
    count = 0
    if i == letter:
        print("The letter " + letter + " is the " + str(count) + " letter in the alphabet")
    count += 1


```

This code outputs the even numbers from 0 - 10 using a while loop.
- Analyze this code to determine what can be changed to get the outcome to be odd numbers. (Code block below)



```python

evens = []
i = 0

while i <= 10:
    evens.append(i)
    i += 2

print(evens)    


```

This code should output the odd numbers from 0 - 10 using a while loop.


```python

odds = []
i = 0

while i <= 10:
    odds.append(i)
    i += 2

print(odds)
```

This code outputs the even numbers from 0 - 10 using a for loop.
- Analyze this code to determine what can be changed to get the outcome to be odd numbers. (Code block below)


```python

numbers = [0,1,2,3,4,5,6,7,8,9,10]
evens = []

for i in numbers:
    if (numbers[i] % 2 == 0):
        evens.append(numbers[i])

print(evens)


```

This code should output the odd numbers from 0 - 10 using a for loop.


```python

numbers = [0,1,2,3,4,5,6,7,8,9,10]
odds = []

for i in numbers:
    if (numbers[i] % 2 == 0):
        odds.append(numbers[i])

print(odds)
```

The intended outcome is printing a number between 1 and 100 once, if it is a multiple of 2 or 5 
- What values are outputted incorrectly. Why?
- Make changes to get the intended outcome.


```python

numbers = []
newNumbers = []
i = 0

while i < 100:
    numbers.append(i)
    i += 1

for i in numbers:
    if numbers[i] % 5 == 0:
        newNumbers.append(numbers[i])
    if numbers[i] % 2 == 0:
        newNumbers.append(numbers[i])

print(newNumbers) 


```

# Challenge

This code segment is at a very early stage of implementation.
- What are some ways to (user) error proof this code?
- The code should be able to calculate the cost of the meal of the user

Hint:
- write a “single” test describing an expectation of the program of the program
- test - input burger, expect output of burger price
- run the test, which should fail because the program lacks that feature
- write “just enough” code, the simplest possible, to make the test pass

Then repeat this process until you get program working like you want it to work.


```python
menu =  {"burger": 3.99,
         "fries": 1.99,
         "drink": 0.99}
total = 0

#shows the user the menu and prompts them to select an item
print("Menu")
for k,v in menu.items():
    print(k + "  $" + str(v)) #why does v have "str" in front of it?

#ideally the code should prompt the user multiple times
item = input("Please select an item from the menu")

#code should add the price of the menu items selected by the user 
print(total)
```

## Hacks
> Now is a good time to think about Testing of your teams final project...
- What errors may arise in your project?
- What are some test cases that can be used?
- Make sure to document any bugs you encounter and how you solved the problem.
- What are “single” tests that you will perform on your project? Or, your part of the project?
    * As Hack Design and Test plan action … Divide these “single” tests into Issues for Scrum Board prior to coding. FYI, related tests could be in same Issue by using markdown checkboxes to separate tests.
