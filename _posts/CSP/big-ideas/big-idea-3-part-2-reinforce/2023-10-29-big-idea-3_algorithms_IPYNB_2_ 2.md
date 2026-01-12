---
toc: True
comments: True
layout: post
title: Developing Algorithms
description: College Board Big Idea 3, Idea 9, Developing Algorithms
author: Imaad, Anika, Tanay, Ananya
categories: ['Python']
---

Lets start off with the basics. 
What is an algorithm? 

- An algorithm is a procedure or formula used for solving a problem. It has a sequence of events, inputs, and outputs. 


What are algorithms used for? 

- Algorithms are used in many different aspect of life. For example a form of routine is an algorithm as it is a series of specified events. 


Why are algorithms important? 

- It solves a problem in a way that it can be applied to any similar problem. It allows the computer to solve the problem on its own w/o any form of human interference. 


```python
# Psuedo Code 1
DISPLAY ("What is the temperature outside in F?")
temp <- INPUT()
IF (temp >= 90)
{
    DISPLAY("its too hot outide")
}
ELSE 
{
    IF (temp >= 65){
        DISPLAY ("sure I will play outside")
    }
    ELSE 
    {
        DISPLAY ("its too cold outside")
    }
}

# Psuedo Code 2
DISPLAY ("What is the temperature outside in F?")
temp <- INPUT()
IF (temp >= 90)
{
    DISPLAY("its too hot outide")
}
IF (temp >= 65)
{
        DISPLAY ("sure I will play outside")
}
IF (temp < 65)
{
        DISPLAY ("its too cold outside")
}
```

What is the difference between the two pieces of code in the cell above?


```python
# Code 1
print("What is the temperature outside in F?")
temp = int(input())

if temp >= 90: 
    print("its too hot outide")
else:  
    if temp >= 65:
        print("sure I will play outside")
    else: 
        print("its too cold outside")
```


```python
# Code 2
print("What is the temperature outside in F?")
temp = int(input())

if temp >= 90: 
    print("its too hot outide")
if temp >= 65:
    print("sure I will play outside")
if temp < 65:
    print("its too cold outside")
```

    What is the temperature outside in F?
    its too hot outide
    sure I will play outside


What happens if we plug 56 for the temp? What happens if we plug 95 in? 

If we plug 56 in, then it will display the text "its too cold outside." It first checks the first input, if temp is greater than or equal to 90. Which it isn't so it moves on to the next if. If temp is greater than or equal to 65, which it isn't so it checks the last if/else statement and displays the text its too cold outside. 

If we plug 95 in we get two different results. Code one displays "its too hot outide" but code two displays "its too hot outide" and "sure I will play outside." Why is this?  

### Popcorn Hack #1 
Adjust Pseudo Code #2 so that it has the same output as Code #1 for all inputs. 


```python
# Insert your code here: 

```

# Conditionals vs Booleans 

Quick reminder: 
- Conditionals: checks if a condition is true or false using statements like if, elif, and else if. 
- Booleans: Data type that conditionals use, only two: true and false

We have given an algorithm that uses conditionals and two boolean statements that should have the same output as the conditional. Which boolean statement works and which one doesn't? 

### Conditional: 


```python
# Psuedo Code
IF (isHoliday)
{
    driveWork<- False
}
ELSE
{
    IF (iswWeekday)
    {
        driveWork <_ True
    }
    ELSE
    {
        driveWork <- False
    }
}
```

### Boolean


```python
# Option 1: 
driveWork <- ( (isHoliday) AND (isWeekday))

# Option 2: 
driveWork <- ( (NOT (isHoliday)) AND (isWeekday))
```

### Answer

| <img src="https://i.ibb.co/hCtMMRH/Screenshot-2023-10-15-at-6-21-20-PM.png" width = 600px height = auto > |

Option 2 is the correct answer

### Popcorn Hack #2
Using the commands listed below, move the robot (gray triangle) through the white squares to the gray square wihtout touching the black squares in the least amount of lines as possible. 

Commands allowed: 
MOVE_FORWARD()
- moves the robot one sqaure in the direction it is facing 
ROTATE_LEFT()
- rotates the robot 90 degrees counterclockwise relative to itself 
ROTATE_RIGHT()
- rotates the robot 90 degrees clockwise relative to itself 
CAN_MOVE()
- checks if the robot can move forward in true or false (true: it can move forward. false: it can't move forward)

| <img src="https://i.ibb.co/3TzmV2b/Screen-Shot-2023-10-16-at-7-45-01-PM.png" width = 600px height = auto > |


```python
# Insert your code here: 

```

### Optional Popcorn Hack
Change your code to an algorithm that works for any given course. 

Hint: use if, elif, else, and CAN_MOVE() 


```python
# Insert your code here: 

```

# Combining Selection and/or Iteration

Create an algorithm that uses selection and/or iteration to determine the cost of one item. 
THe display at the stores says the follorwing: 
- Green tagged items: 25% off 
- Red tagged items: 60% off
- Tax on all items is 10% 


```python
# Psuedo Code
DISPLAY ("What is the cost of the item?")
cost <- INPUT()
DIPLAY ("Is the tag green or red (type "True" if it is green, type "False" for red)")
tag <- BOOL(INPUT())
IF (tag == True) # Check if it is green tag (refer to lines above)
{
    cost <- 0.75 * cost
}
IF (tag == False) # Check if it is green tag (refer to lines above)
{
    cost <- 0.40 * cost
}
cost <- 1.10 * cost 
```


```python
print("What is the cost of the item?")
cost = int(input())
print("Is the tag green or red (type "True" if it is green, type "False" for red)")
tag = bool(input())

if tag == True: # Check if it is green tag (refer to lines above)
    cost = 0.75 * cost
if tag == False: # Check if it is green tag (refer to lines above)
    cost = 0.40 * cost
cost = 1.10 * cost # accounting for tax
```

# Famous Collatz Conjecture

1. Start with any positive integer 
2. IF that number is even, divide by 2
3. If that number is odd, multiply by 3 and add 1
4. Repeat steps 2 and 3 until you reach the number 1 

6 -> 3 -> 10 -> 5 -> 16 -> 8 -> 4 -> 2 -> 1

Collatz proposed that this sequence of numbers would always terminate at 1. The problem of whether this is true or not for all positive integers is still unsolved today. 

Lets create an algorithm that will start with any positive integer "n" and display the full sequence of numbers that result from this conjecture. 


```python
# Psuedo Code 
DISPLAY ("choose a value for n")
n <- INPUT() 
DISPLAY (n)
REPEAT UNTIL (n = 1)
{
    IF (n MOD 2 = 0)
    {
        n <- n/2
    }
    ELSE 
    {
        n <- 3 * n + 1
    }
DISPLAY (n)
}
```


```python
# Code 
print("choose a value for n")
n = int(input())
print(n)
while n != 1: 
    if n % 2 == 0: 
        n = n/2
    else: 
        n = (n*3)+1
    print(n)
```

    choose a value for n
    6
    3.0
    10.0
    5.0
    16.0
    8.0
    4.0
    2.0
    1.0


### Popcorn hack #3

We are given an algorhtim (below) for a robot to move from the current square to the grey square, completing the course (below). However it doesn't work. Why does the given algorithm not work? 

Using the commands listed below, fix the algorithm

Commands allowed: 
MOVE_FORWARD()
- moves the robot one sqaure in the direction it is facing 
ROTATE_LEFT()
- rotates the robot 90 degrees counterclockwise relative to itself 
ROTATE_RIGHT()
- rotates the robot 90 degrees clockwise relative to itself 
CAN_MOVE()
- checks if the robot can move forward in true or false (true: it can move forward. false: it can't move forward)

#### Course: 

| <img src="https://i.ibb.co/cgz67XJ/Screen-Shot-2023-10-16-at-8-05-24-PM.png" width = 600px height = auto > |

#### Given Algorithm 


```python
REPEAT UNTIL (goalReached)
{
    IF (CAN_MOVE(FORWARD))
    {
        MOVE_FORWARD
    }
    ELSE
    {
        IF CAN_MOVE(RIGHT)
        {
            ROTATE_RIGHT
            MOVE_FORWARD
        }
    }
}
```

#### Put your answer to the question "Why does the given algorithm not work?" here: 




```python
# Insert your updated algorithm here: 

```

# Homework

- Create an algorithm that uses selection and/or iteration that will represent one player's turn in a game. 

- During a turn, each player gets 4 attempts/chances to get the greates number possible. 

- During each attempt the player will use a random number generator to select a random number 1-10. 

- After the player has had 4 chances, their score is the greatest number they receieved from the random number generator, and their turn is over. 

Use the following flowchart to assist you: 

| <img src="https://i.ibb.co/ZBFgwn2/Screen-Shot-2023-10-15-at-7-40-22-PM.png" width = 600px height = auto > 
