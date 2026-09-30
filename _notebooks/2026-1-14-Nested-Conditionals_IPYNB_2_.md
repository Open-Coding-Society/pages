---
layout: post
courses: {'csse': {'week': 5}}
categories: ['JavaScript', 'Nested-Conditionals']
lesson_language: JavaScript
lesson_topic: Nested-Conditionals
lesson_part: interactive
lesson_type: lesson
codemirror: True
microblog: True
title: Nested Conditionals
description: Nested Conditionals using Code Runner
permalink: /js/nested-conditionals
author: Rohan Sharma, Kaden Arp
---

## Introduction

**Picture this**: You're getting ready for school in the morning. 

First, you check the weather forecast.

**IF** it's raining: 
- You grab your umbrella, But then you need to check another thing - how cold is it? 
  - **IF** it's also cold, you pack both your umbrella **AND** your jacket. 
  - **ELSE** (if it's raining but it's still warm outside), just the umbrella is enough.

**ELSE** (if it's not raining): 
- You skip the umbrella, **BUT** you still need to check the temperature. 
  - **IF** it's cold, you'll take a jacket. 
  - **ELSE**, you're good to go!

See how you're making decisions **INSIDE** other decisions? That's a **nested conditional**!


## Nested Conditional Code

Now let's look at an example of the nested conditional code using the analogy above.

~~~js
// Check the weather before leaving for school
if (raining) {
    // First decision: It's raining, so take umbrella
    takeUmbrella();
    
    // Nested decision INSIDE the raining condition
    if (cold) {
        takeJacket();
        console.log("Taking umbrella AND jacket");
    } else {
        console.log("Taking just umbrella");
    }
    
} else {
    // First decision: Not raining, skip umbrella
    
    // Nested decision INSIDE the not-raining condition
    if (cold) {
        takeJacket();
        console.log("Taking just jacket");
    } else {
        console.log("Nothing needed - good to go!");
    }
}
~~~

In the code example above, there are 2 nested conditionals: there's one in the if statement, and one in the else statement. If it's raining, the temperature check inside the if block will run. If it's not raining, we skip the if block entirely and go to the else statement, where a different temperature check will run.

Now you go ahead and try!



{% capture challenge0 %}
Complete the nested conditional to make it list if the numbers 1-10 are odd or even and if they are divisible by 3.
{% endcapture %}

{% capture code0 %}
const NUMBERS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

for (let number of NUMBERS) {
    if (number % 2 === 0) {
        console.log(number + " is even");
        
        // TODO: Add a nested if statement here to check if divisible by 3
        
    } else {
        console.log(number + " is odd");
        
        // TODO: Add a nested if statement here to check if divisible by 3
        
    }
}

// Expected output:
// 1 is odd
// 2 is even
// 3 is odd
// 3 is also divisible by 3
// 4 is even
// 5 is odd
// 6 is even
// 6 is also divisible by 3
// 7 is odd
// 8 is even
// 9 is odd
// 9 is also divisible by 3
// 10 is even
{% endcapture %}

{% capture source0 %}
```javascript
%%js

// CODE_RUNNER: Complete the nested conditional to make it list if the numbers 1-10 are odd or even and if they are divisible by 3.

const NUMBERS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

for (let number of NUMBERS) {
    if (number % 2 === 0) {
        console.log(number + " is even");
        
        // TODO: Add a nested if statement here to check if divisible by 3
        
    } else {
        console.log(number + " is odd");
        
        // TODO: Add a nested if statement here to check if divisible by 3
        
    }
}

// Expected output:
// 1 is odd
// 2 is even
// 3 is odd
// 3 is also divisible by 3
// 4 is even
// 5 is odd
// 6 is even
// 6 is also divisible by 3
// 7 is odd
// 8 is even
// 9 is odd
// 9 is also divisible by 3
// 10 is even
```
{% endcapture %}

{% include runners/code.html
   runner_id="js-nested-conditionals-0"
   language="javascript"
   challenge=challenge0
   code=code0
   source=source0
%}




{% capture challenge1 %}
Now, you're a bouncer at a nightclub. You need to make a for loop with a nested conditional that will check if people are of the correct age, and if they aren't, it should check if they wear sunglasses. If they are underage but they still have sunglasses, they should be let in.
{% endcapture %}

{% capture code1 %}
// List of people trying to get into the nightclub
const people = [
  { name: 'jimmy', age: 15, wearsSunglasses: false },
  { name: 'sara', age: 5, wearsSunglasses: true },
  { name: 'alex', age: 22, wearsSunglasses: true },
  { name: 'morgan', age: 18, wearsSunglasses: false },
  { name: 'dakota', age: 21, wearsSunglasses: false },
  { name: 'casey', age: 25, wearsSunglasses: true }
];

// Check everyone at the door
for (const person of people) {
  if (person.age >= 21) {
    // TODO: Add nested conditional to check if person wears sunglasses
    // If they do, print: person.name + " is free to enter because they're over 21 and they have sunglasses"
    // Otherwise, print: person.name + " is free to enter"

  } else {
    // TODO: Add nested conditional to check if person wears sunglasses
    // If they do, print: person.name + " is free to enter because they have sunglasses"
    // Otherwise, print: person.name + " is not free to enter because they are underage"

  }
}
{% endcapture %}

{% capture source1 %}
```javascript
%%js

// CODE_RUNNER: Now, you're a bouncer at a nightclub. You need to make a for loop with a nested conditional that will check if people are of the correct age, and if they aren't, it should check if they wear sunglasses. If they are underage but they still have sunglasses, they should be let in.

// List of people trying to get into the nightclub
const people = [
  { name: 'jimmy', age: 15, wearsSunglasses: false },
  { name: 'sara', age: 5, wearsSunglasses: true },
  { name: 'alex', age: 22, wearsSunglasses: true },
  { name: 'morgan', age: 18, wearsSunglasses: false },
  { name: 'dakota', age: 21, wearsSunglasses: false },
  { name: 'casey', age: 25, wearsSunglasses: true }
];

// Check everyone at the door
for (const person of people) {
  if (person.age >= 21) {
    // TODO: Add nested conditional to check if person wears sunglasses
    // If they do, print: person.name + " is free to enter because they're over 21 and they have sunglasses"
    // Otherwise, print: person.name + " is free to enter"

  } else {
    // TODO: Add nested conditional to check if person wears sunglasses
    // If they do, print: person.name + " is free to enter because they have sunglasses"
    // Otherwise, print: person.name + " is not free to enter because they are underage"

  }
}
```
{% endcapture %}

{% include runners/code.html
   runner_id="js-nested-conditionals-1"
   language="javascript"
   challenge=challenge1
   code=code1
   source=source1
%}


## Homework
Make a nested conditional that does the following: 
1. contains more than 1 nested conditional
2. use the numbers 1-50
3. check if each number is divisible by each factor of 50



{% capture challenge2 %}
Make a nested conditional homework
{% endcapture %}

{% capture code2 %}

{% endcapture %}

{% capture source2 %}
```javascript
%%js

// CODE_RUNNER: Make a nested conditional homework
```
{% endcapture %}

{% include runners/code.html
   runner_id="js-nested-conditionals-2"
   language="javascript"
   challenge=challenge2
   code=code2
   source=source2
%}

