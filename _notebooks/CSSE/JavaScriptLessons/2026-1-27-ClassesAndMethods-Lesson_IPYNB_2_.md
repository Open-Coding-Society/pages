---
layout: post
courses: {'csse': {'week': 5}}
categories: ['JavaScript', 'Classes-and-Methods']
lesson_language: JavaScript
lesson_topic: Classes-and-Methods
lesson_part: interactive
lesson_type: lesson
microblog: True
codemirror: True
title: Classes and Methods
description: Basics of Classes and Methods
permalink: /js/classes
author: Aarnav Jain and Dean
---

## Classes and Methods

classes and methods are fundamental parts of coding.

 - Classes are a template for creating something. It defines what properties and behaviors the object should have. 

 - For example the class car would define the color, the model, year released, etc.

 - Methods are an action that an object executes.

 - For example in the car example a method could be drive() or brake()

 - here is an example Code Runner using the example above. The code first creates a class which in this case is a car. It then defines the different properties of the car such as the brand, the color, and the speed. Lastly the method accelerate is defined, which increases speed by 10.


## Why do you use Classes and Methods

 - Methods are used because they help keep the code simple. Instead of typing out a specific process everytime, you could just define a method once and then execute the method as needed.
  
 - For example if you are making a video game you can make a method called take damage which causes the player to lose health.

 - You would use classes to organize the code and when you have a set of data that goes together such as player, monster, ally etc.



{% capture challenge0 %}
Car Example: Try and make another method called brake which decreases speed of car by a set amount.
{% endcapture %}

{% capture code0 %}
//Hint: look at how accelerate is defined and use the same format for brake.

// 1. Define the Class (The Blueprint)
class Car {
    constructor(brand, color) {
        this.brand = brand;   
        this.color = color;   
        this.speed = 0;        //(starts at 0)
    }

    // 2. Define a Method 
    accelerate() {
        this.speed = this.speed + 10;
        console.log("The " + this.brand + " is now going " + this.speed + "mph.");
    }
}

// 3. Create an Instance (The actual car)
let myCar = new Car("Toyota", "Blue");

// 4. Use the Method
myCar.accelerate(); // "The Toyota is now going 10mph."
myCar.accelerate(); // "The Toyota is now going 20mph."
{% endcapture %}

{% capture source0 %}
```javascript
%%js
//CODE_RUNNER: Car Example: Try and make another method called brake which decreases speed of car by a set amount.

//Hint: look at how accelerate is defined and use the same format for brake.

// 1. Define the Class (The Blueprint)
class Car {
    constructor(brand, color) {
        this.brand = brand;   
        this.color = color;   
        this.speed = 0;        //(starts at 0)
    }

    // 2. Define a Method 
    accelerate() {
        this.speed = this.speed + 10;
        console.log("The " + this.brand + " is now going " + this.speed + "mph.");
    }
}

// 3. Create an Instance (The actual car)
let myCar = new Car("Toyota", "Blue");

// 4. Use the Method
myCar.accelerate(); // "The Toyota is now going 10mph."
myCar.accelerate(); // "The Toyota is now going 20mph."
```
{% endcapture %}

{% include runners/code.html
   runner_id="js-classes-0"
   language="javascript"
   challenge=challenge0
   code=code0
   source=source0
%}




{% capture challenge1 %}
Car Example #2 Finish the code.
{% endcapture %}

{% capture code1 %}
class Car {
  constructor(speed, maxSpeed) {
    this.speed = speed;
    this.maxSpeed = maxSpeed;
  }

  accelerate() {
    // TODO:
    // If the current speed is less than maxSpeed,
    // increase speed by 10.
    //
    // If increasing speed would go over maxSpeed,
    // set speed to maxSpeed instead.
  }

  brake() {
    this.speed -= 10;
    if (this.speed < 0) {
      this.speed = 0;
    }
  }
}

// Example usage:
let myCar = new Car(90, 100);
myCar.accelerate();
console.log(myCar.speed); // should be 100, not more
{% endcapture %}

{% capture source1 %}
```python
%%js 

//CODE_RUNNER: Car Example #2 Finish the code.
class Car {
  constructor(speed, maxSpeed) {
    this.speed = speed;
    this.maxSpeed = maxSpeed;
  }

  accelerate() {
    // TODO:
    // If the current speed is less than maxSpeed,
    // increase speed by 10.
    //
    // If increasing speed would go over maxSpeed,
    // set speed to maxSpeed instead.
  }

  brake() {
    this.speed -= 10;
    if (this.speed < 0) {
      this.speed = 0;
    }
  }
}

// Example usage:
let myCar = new Car(90, 100);
myCar.accelerate();
console.log(myCar.speed); // should be 100, not more

```
{% endcapture %}

{% include runners/code.html
   runner_id="js-classes-1"
   language="javascript"
   challenge=challenge1
   code=code1
   source=source1
%}




{% capture challenge2 %}
Car example #3 Add stop method using while loop.
{% endcapture %}

{% capture code2 %}
class Car {
  constructor(speed) {
    this.speed = speed;
  }

  brake() {
    this.speed -= 10;
    if (this.speed < 0) {
      this.speed = 0;
    }
  }

  stop() {
    // TODO:
    // Keep calling brake() until the car's speed is 0
  }
}

// Example usage:
let myCar = new Car(35);
myCar.stop();
console.log(myCar.speed); // should be 0
{% endcapture %}

{% capture source2 %}
```python
%%js 

//CODE_RUNNER: Car example #3 Add stop method using while loop.

class Car {
  constructor(speed) {
    this.speed = speed;
  }

  brake() {
    this.speed -= 10;
    if (this.speed < 0) {
      this.speed = 0;
    }
  }

  stop() {
    // TODO:
    // Keep calling brake() until the car's speed is 0
  }
}

// Example usage:
let myCar = new Car(35);
myCar.stop();
console.log(myCar.speed); // should be 0

```
{% endcapture %}

{% include runners/code.html
   runner_id="js-classes-2"
   language="javascript"
   challenge=challenge2
   code=code2
   source=source2
%}


## Homework



{% capture challenge3 %}
Homework Challenge - Create a class and make 2 different methods.
{% endcapture %}

{% capture code3 %}
//Feel free to get creative with the methods. For example a class could be cat and a method could be eat and meow.
{% endcapture %}

{% capture source3 %}
```python
%%js 

//CODE_RUNNER: Homework Challenge - Create a class and make 2 different methods.

//Feel free to get creative with the methods. For example a class could be cat and a method could be eat and meow.

```
{% endcapture %}

{% include runners/code.html
   runner_id="js-classes-3"
   language="javascript"
   challenge=challenge3
   code=code3
   source=source3
%}

