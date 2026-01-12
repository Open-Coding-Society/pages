---
toc: True
comments: True
layout: post
title: Procedures
description: Lesson for developing procedures in Python
author: Eric, Gurshawn, Hanlun, Yeongsu
categories: ['Python']
---

<h1>- CB 3.12,3.13 Developing Procedures</h1>


What is a procedure?

A procedure is a named group of code that has paramaters and return values. Procedures are known as methods or functions depending on the language.

A procedure executes the statements within it on the parameters to provide a return value.

What are parameters?

Paramaters are input values of a procedure that are specified by arguments.Arguments specify the values of the parameters when a procedure is called.

By creating theses algorithms the readibility of code increases and the complexity decreases. This is becasue a function's name can tell the reader what action it will perform, and by calling it, the code becomes more clean and easy to understand.



<h1>What is a return value?</h1>
<h3>A return value is the value that is returned when a function or a method is called.</h3>
<h3>That return value can be assigned or printed</h3>

<img src = "/passionProject/_notebooks/images.png">

Procedures are used to create algorthims that can perform certain actions or return values. When a procedure returns a value, theis information must be stored in a variable for later use. However some procedures like the MOVE_FORWARD() perform an action, and don't return a value. The image above provides an example of where procedures that don't output a value would be used.


```python
A 60$ item recieves a 20% discount and taxed at 8%.
PROCEDURE applyDiscount(cost, percentDiscounted)
{
    temp ← 100 - percentDiscounted
    temp← temp/ 100
    cost ← cost *temp
    RETURN(cost)
}

price ← applyDiscount(60, 20)
This is how we get the final price with the discount by calling the procedure and assigning it to the price variable.


PROCEDURE applyTax(cost, percentTaxed)
{
    temp ← 100 + percentTaxed
    temp← temp/ 100
    cost ← cost *temp
    RETURN(cost)
}
price ← applyTax(price, 8)
This applys the 8% tax to the price determined after the discount.
```

<h3>Popcorn Hack 1</h3>
Given the applyTax procedure above:
How would you call the procedure to get it to find the price using cost = 50, and percentTaxed = 10, and what value will it return?


```python
#code here
```

<h1>What Are Functions?</h1>
<ul>
    <li>Collections of code</li>
    <li>Divides large program into smaller chunks</li>
    <li>Better readability</li>
    <li>Less repetitive code</li>
    <li>More efficient code</li>
    <li>Good organization</li>
</ul>



<h1>What Are The Components of a Function?</h1>
<ul>
    <li>The function declaration</li>
    <li>The parameters (input). This is also referred to as an argument when a value is being passed to the actual function.</li>
    <li>The functionality</li>
    <li>The return value (output)</li>
    <li>Calling the function</li>
</ul>


```python
# Defining Functions
#
# def function_name(parameter1, parameter2, etc..):
#     code here...
#
#     return return_value;

# return the value of parameter1 plus parameter2;
def add(parameter1, parameter2): # creates a function that takes in two parameters
    solution = parameter1 + parameter2; # sets solution to the sum of parameter1 and parameter2
    return solution; # return solution
    
print(add(5, 5)); # prints the return value of add(5,5)
```

<h2 style="font-weight:bold">Popcorn Hack 2:</h2>
<h3>1. Make a function that returns the difference of two numbers</h3>


```python
# Code here
```

<h1>What is a Class?</h1>
<ul>
    <li>A class is an outline for a set of nested functions and variables.</li>
    <li>There are instance variables</li>
    <li>Functions</li>
    <ul>
        <li>Constructor method (Required)</li>
        <li>To String method</li>
        <li>Getter method</li>
        <li>Setter method</li>
    </ul>
</ul>
<h1>How Does a Class Work?</h1>


```python
# Defining Classes
class person:
    def __init__(self, name, age, ): # constructor
        self.name = name;
        self.age = age;
    
    def getName(self): # method to create get name
        return self.name;
    
    def getAge(self): # method to create get age
        return self.age;
    
    def setName(self, name): # method to create set name
        self.name = name;
        
    def setAge(self, age): # method to create set age
        self.age = age;
        
    def yearOlder(self): # method to increment age by 1
        self.age += 1;
        
    def __str__(self): # method that returns a string when the object is printed
        return (f"My name is {self.name} and I am {self.age} years old.")

Person1 = person("John Doe", 15);
print(Person1)


print(Person1);
```

<h2 style="font-weight:bold">Popcorn Hack 3:</h2>
<h3>1. Create a Car class which has the attributes model, vehicle name, and price</h3>
<h3>2. Create instances of the following cars</h3>
<ul>
    <li>Name: Honda Civic , Model Year: 2018 , Price: $13,000 </li>
    <li>Name: Toyota Prius, Model Year: 2023 , Price: $28,000 </li>
    <li>Name: Chevrolet Impala, Model Year: 2020 , Price: $22,000 </li>
</ul>

<h1>Homework:</h1>
<h2>Assignment 1: How do you use functions?</h2>
<h3>Create a turtle python function that...</h3>
<ol>
    <li>Takes a single parameter as the number of sides</li>
    <li>Outputs a shape corresponding to the number of sides</li>
    <li>Call the function with the argument being a variable with the user input</li>
</ol>
<h3>Hint: </h3>


```python
import turtle

pen = turtle.Turtle(); # pen is the instance of Turtle which has methods that do certain actions

# Necessary methods:
# .forward(50) - moves the pen forward 50 units
# .right(angle) - turns the pen angle degrees right   
# OR
# .left(angle) - turns the pen angle degrees left

def shape(sides):
    #code here

numsides = input('How many sides do yoUUUU wnat in YOUUUURRRR shape?!?!!?!: ')
shape(int(numsides))

```

<h2>Assignment 2:</h2>
<h3>Create a student class that...</h3>
<ol>
    <li>Has a constructor that takes three parameters as attributes</li>
    <li>
        <ul>
            <li>email</li>
            <li>name</li>
            <li>grade</li>
        </ul>
    </li>
    <li>Three getter methods to access the name, email, and grade</li>
    <li>Three setter methods to modify the name, email, and grade</li>
    <li>A to string method that returns the three instance variables in this format - "My name is {name}. My email is {email}. My grade is {grade}</li>
    <li>Create an instance of the class that corresponds with you</li>
</ol>

