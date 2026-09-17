---
layout: post
courses: {'csp': {'week': 1}}
categories: ['Python', 'Lists']
lesson_language: Python
lesson_topic: Lists
lesson_part: interactive
lesson_type: lesson
toc: True
comments: False
title: 3.10 Lists
description: This is the comprehensive lesson for Big Idea 3.10, Lists.
permalink: /csp/big-idea-3/lists/p4/lesson
---

# AP Computer Science Principles

## Big Idea 3.10: Lists


### What Are Lists?

A list is a collection of data elements that are ordered and can be accessed by their position (index). Lists are fundamental data structures in programming that allow you to store and manipulate multiple values in a single variable.

### Key Characteristics of Lists:

- Ordered: Elements maintain their position
- Indexed: Each element has a numeric position (usually starting at 0 or 1)
- Mutable: Elements can be changed, added, or removed
- Can contain duplicates: The same value can appear multiple times

### Real-World Examples:

- A shopping list: ["milk", "eggs", "bread", "butter"]
- Test scores: [85, 92, 78, 95, 88]
- Daily temperatures: [72, 75, 68, 71, 73, 76, 74]



## Creating Lists




```python
# List of integers
ages = [15, 16, 17, 15, 16]

# List of strings
colors = ["red", "blue", "green", "red"]

# List of mixed types
mixed = [42, "hello", 3.14, True]
```


```python
// List (array) of integers
let ages = [15, 16, 17, 15, 16];

// List of strings
let colors = ["red", "blue", "green", "red"];

// List of mixed types
let mixed = [42, "hello", 3.14, true];

```

## Accessing List Elements





```python
fruits = ["apple", "banana", "cherry", "date"]

print(fruits[0])   # "apple" - first element
print(fruits[1])   # "banana" - second element
print(fruits[3])   # "date" - fourth element
print(fruits[-1])  # "date" - last element (Python only)
```

## Example 1

### Sum and Average
When working with numeric lists, two common operations are finding the total sum and the average (mean).
Concept:

- Sum: Add all numbers together
- Average: Divide the sum by how many numbers there are

### Sample Problem:
A teacher has test scores: [78, 85, 92, 88, 95]
Find the total points and average score.


```python
let scores = [78, 85, 92, 88, 95];

// Calculate sum
let total = 0;
for (let score of scores) {
    total += score;
}

console.log(`Total points: ${total}`);  // 438

// Calculate average
let average = total / scores.length;
console.log(`Average score: ${average}`);  // 87.6
```


```python
scores = [78, 85, 92, 88, 95]

# Calculate sum
total = 0
for score in scores:
    total += score

print(f"Total points: {total}")  # 438

# Calculate average
average = total / len(scores)
print(f"Average score: {average}")  # 87.6
```

## Example 2: Counting Frequencies
Sometimes you need to count how many times each unique item appears in a list. This is called frequency counting.
### Concept:
Go through each item and keep track of how many times you've seen it using a dictionary (Python) or object (JavaScript).
### Sample Problem:
A survey asked students their favorite season:
["winter", "summer", "fall", "summer", "summer", "spring", "fall"]
Count how many students chose each season.


```python
seasons = ["winter", "summer", "fall", "summer", "summer", "spring", "fall"]

# Create empty dictionary to store counts
frequency = {}

# Count each item
for season in seasons:
    if season in frequency:
        frequency[season] += 1
    else:
        frequency[season] = 1

print(frequency)
# Output: {'winter': 1, 'summer': 3, 'fall': 2, 'spring': 1}
```


```python
let seasons = ["winter", "summer", "fall", "summer", "summer", "spring", "fall"];

// Create empty object to store counts
let frequency = {};

// Count each item
for (let season of seasons) {
    if (frequency[season]) {
        frequency[season]++;
    } else {
        frequency[season] = 1;
    }
}

console.log(frequency);
// Output: {winter: 1, summer: 3, fall: 2, spring: 1}
```

## Example 3: Filtering Lists
Filtering means creating a new list that contains only elements meeting certain criteria.
### Concept:
Check each element with a condition. If it passes, add it to the new list.
### Sample Problem:
A list contains ages: [12, 18, 15, 21, 17, 25, 14, 19]
Create a new list with only ages 18 and above (adults).


```python
ages = [12, 18, 15, 21, 17, 25, 14, 19]

# Create empty list for adults
adults = []

# Check each age
for age in ages:
    if age >= 18:
        adults.append(age)

print(adults)  # [18, 21, 25, 19]
```


```python
ages = [12, 18, 15, 21, 17, 25, 14, 19]

# Create empty list for adults
adults = []

# Check each age
for age in ages:
    if age >= 18:
        adults.append(age)

print(adults)  # [18, 21, 25, 19]
```

## Common Problems to Avoid

- ❌ Off-by-one errors: Remember indexing starts at 0
- ❌ Index out of range: Don't access list[5] if the list has only 4 elements
- ❌ Modifying list while iterating: Can cause unexpected behavior
- ❌ Forgetting to initialize variables: Set total = 0 before summing

- ✓ Use descriptive names: student_names instead of list1
- ✓ Check for empty lists: Before accessing elements
- ✓ Test edge cases: Empty lists, single elements, all same values

## Summary
 Lists are essential for storing and manipulating collections of data.  Through them, it is easy to access, create, and filter lists of data.
### Understanding and Mastering These Objectives is Key to Your Success in AP Computer Science Principles:

- Accessing elements by index
- Computing sum and average
- Counting frequency of items
- Filtering based on conditions
- Searching for specific values
