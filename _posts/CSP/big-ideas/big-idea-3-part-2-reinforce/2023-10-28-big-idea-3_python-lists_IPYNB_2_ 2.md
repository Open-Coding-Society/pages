---
toc: True
comments: True
layout: opencs
title: Data Types, Lists, Dictionaries
description: An introduction to Data Types using Python Variables, Lists [] and Python Dictionaries {}.
categories: ['Python']
---

### Variables and Types
All useful data is a collection of different types of data: letters, words, numbers, tables, etc. 

In Python, we use variables to store data, each are given a type at assignment.  Variables have names, types, and data.  Python variables can be of type: String, Integer, Float, List and Dictionary.  The types are important to understand and will impact coding operations, for instance we are required to use str() function in concatenation of different data types. A type of List allows developer to perform iteration.  

1. Developers often think of variables as primitives or collections.  Look at this example and see if you can see hypothesize the difference between a primitive and a collection.  
2. Take a minute and see if you can reference other elements in the list or other keys in the dictionary. Show output.


```python
# Sample of Python Variables

# variable of type string
print("What is the variable name/key?", "value?", "type?", "primitive or collection, why?")
name = "John Doe"
print("name", name, type(name))

```


```python
# variable of type integer
print("What is the variable name/key?", "value?", "type?", "primitive or collection, why?")
age = 18
print("age", age, type(age))
```


```python
# variable of type float
print("What is the variable name/key?", "value?", "type?", "primitive or collection, why?")
score = 90.0
print("score", score, type(score))
```


```python

# variable of type list (many values in one variable)
print("What is variable name/key?", "value?", "type?", "primitive or collection?")
print("What is different about the list output?")
langs = ["Python", "JavaScript", "Java"]
print("langs", langs, type(langs), "length", len(langs))
print("- langs[0]", langs[0], type(langs[0]))
print("- langs[1]", langs[1], type(langs[1]))
print("- langs[2]", langs[2], type(langs[2]))
```


```python
# variable of type dictionary (a group of keys and values)
print("What is the variable name/key?", "value?", "type?", "primitive or collection, why?")
print("What is different about the dictionary output?")
person = {
    "name": name,
    "age": age,
    "score": score,
    "langs": langs
}
print("person", person, type(person), "length", len(person))
print('- person["name"]', person["name"], type(person["name"]))
print('- person["age"]', person["age"], type(person["age"]))
print('- person["score"]', person["score"], type(person["score"]))
print('- person["langs"]', person["langs"], type(person["langs"]))
```

### List and Dictionary purpose
Our society is being built on information.  <mark>List and Dictionaries are used to collect information</mark>.  Mostly, when information is collected it is formed into patterns.  As that pattern is established you will be able collect many instances of that pattern.
- A List is used to collect many instances of a pattern
- A Dictionary is used to organize data patterns.
- Iteration is often used to process through lists.

To start exploring more deeply into List, Dictionary and Iteration this example will explore constructing a List of people and cars.
- As we learned above, a List is a data type: class 'list'
- A <mark>'list' data type has the method '.append(expression)'</mark> that allows you to add to the list.  A class usually has extra methods to support working with its objects.
- In the example below,  the expression is appended to the 'list' is the data type: class 'dict'
- At the end, you see a fairly complicated data structure.  This is a <mark>list of dictionaries</mark>, or a collection of many similar data patterns.  The output looks similar to JavaScript Object Notation (JSON), Jekyll/GitHub pages yml files, FastPages Front Matter. As discussed we will see this key/value patter often, you will be required to understand this data structure and understand the parts.  Just believe it is easy ;) and it will become so.


```python
# Define an empty List called InfoDb
InfoDb = []

# InfoDB is a data structure with expected Keys and Values

# Append to List a Dictionary of key/values related to a person and cars
InfoDb.append({
    "FirstName": "John",
    "LastName": "Mortensen",
    "DOB": "October 21",
    "Residence": "San Diego",
    "Email": "jmortensen@powayusd.com",
    "Owns_Cars": ["2015-Fusion", "2011-Ranger", "2003-Excursion", "1997-F350", "1969-Cadillac"]
})

# Append to List a 2nd Dictionary of key/values
InfoDb.append({
    "FirstName": "Sunny",
    "LastName": "Naidu",
    "DOB": "August 2",
    "Residence": "Temecula",
    "Email": "snaidu@powayusd.com",
    "Owns_Cars": ["4Runner"]
})

# Append to List a 2nd Dictionary of key/values
InfoDb.append({
    "FirstName": "Shane",
    "LastName": "Lopez",
    "DOB": "February 27",
    "Residence": "San Diego",
    "Email": "???@powayusd.com",
    "Owns_Cars": ["2021-Insight"]
})

# Print the data structure
print(InfoDb)
```

### Formatted output of List/Dictionary - for loop
Managing data in Lists and Dictionaries is for the convenience of passing the data across the internet, to applications, or preparing it to be stored into a database.  It is a great way to exchange data between programs and programmers.  Exchange of data between programs includes the data type the method/function and the format of the data type.  These concepts are key to learning how to write functions, receive, and return data.  This process is often referred to as an <mark>Application Programming Interface (API)</mark>. 

Next, we will take the stored data and output it within our notebook.  There are multiple steps to this process...
- <mark>Preparing a function to format the data</mark>, the print_data() function receives a parameter called "d_rec" short for dictionary record.  It then references different keys within [] square brackets.   
- <mark>Preparing a function to iterate through the list</mark>, the for_loop() function uses an enhanced for loop that pull record by record out of InfoDb until the list is empty.  Each time through the loop it call print_data(record), which passes the dictionary record to that function.
- Finally, you need to <mark>activate your function</mark> with the call to the defined function for_loop().  Functions are defined, not activated until they are called.  By placing for_loop() at the left margin the function is activated.


```python
# This jupyter cell has dependencies on one or more cells above

# print function: given a dictionary of InfoDb content
def print_data(d_rec):
    print(d_rec["FirstName"], d_rec["LastName"])  # using comma puts space between values
    print("\t", "Residence:", d_rec["Residence"]) # \t is a tab indent
    print("\t", "Birth Day:", d_rec["DOB"])
    print("\t", "Cars: ", end="")  # end="" make sure no return occurs
    print(", ".join(d_rec["Owns_Cars"]))  # join allows printing a string list with separator
    print()


# for loop algorithm iterates on length of InfoDb
def for_loop():
    print("For loop output\n")
    for record in InfoDb:
        print_data(record) # call to function

for_loop() # call to function
```

### Alternate methods for iteration - while loop
In coding, there are usually many ways to achieve the same result.  Defined are functions illustrating using index to reference records in a list, these methods are called a "while" loop and "recursion".
- The while_loop() function contains a while loop, "while i < len(InfoDb):".  This counts through the elements in the list start at zero, and passes the record to print_data()


```python
# This jupyter cell has dependencies on one or more cells above

# while loop algorithm contains an initial n and an index incrementing statement (n += 1)
def while_loop():
    print("While loop output\n")
    i = 0
    while i < len(InfoDb):
        record = InfoDb[i]
        print_data(record)
        i += 1
    return

while_loop()
```

### Calling a function repeatedly - recursion
This final technique achieves looping by calling itself repeatedly.
- recursive_loop(i) function is primed with the value 0 on its activation with "recursive_loop(0)"
- the last statement indented inside the if statement "recursive_loop(i + 1)" activates another call to the recursive_loop(i) function, each time i is increasing
- ultimately the "if i < len(InfoDb):" will evaluate to false and the program ends


```python
# This jupyter cell has dependencies on one or more cells above

# recursion algorithm loops incrementing on each call (n + 1) until exit condition is met
def recursive_loop(i):
    if i < len(InfoDb):
        record = InfoDb[i]
        print_data(record)
        recursive_loop(i + 1)
    return
    
print("Recursive loop output\n")
recursive_loop(0)
```

## Hacks
- Add a few records to the InfoDb
- Try to do a for loop with an index, research this as 4th way
- Pair Share code somethings creative or unique, with loops and data. Hints...
    - Would it be possible to output data in a reverse order?
    - Are there other methods that can be performed on lists?
    - Could you create new or add to dictionary InfoDB?  Could you do it with input?
    - Make a quiz that stores in a List of Dictionaries.
