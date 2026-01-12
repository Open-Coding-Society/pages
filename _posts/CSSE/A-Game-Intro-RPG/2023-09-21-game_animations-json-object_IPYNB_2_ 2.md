---
toc: True
layout: post
title: JSON Object
description: A guide on simple parallax background animations using Javascript, and how to implement them into games
menu: nav/game_intro.html
permalink: /game/intro/json
---

## Popcorn Hack

Define the purpose of the files in the RPG games. Using the Anatomy section, describe the RPG Game files in your own words:

- **rpg.md**: Defines ... and starts ...
- **GameControl.js**: Manages ... 
- **GameEnv.js**: Defines ...
- **Background.js**: Handles ...
- **Player.js**: Handles ...

## Data Definition
This article will go through the steps of defining **JSON Object data**.  Understanding objects is crucial for understanding JavaScript, and they are used extensively in all the code we will be looking at.

> JSON Object  data is used to define the sprites and backgrounds that are used within the RPG game.

### Key-Value Definition
A JSON Object is a very common "Data Structure" used to represent data.

> A JSON Object is a formation of key-valure pair.

As a **popcord hack** replace the code in two cells with "your name" and other vitals as the values in the key-value pairs.


```python
%%js

const name = {name: 'John Doe'}
console.log(name.name)

element.append(name.name)

```


```python
%%js

const person = {
    firstName: "John",
    lastName: "Doe",
    age: 30,
    fullName: function() {
        return this.firstName + " " + this.lastName;
    }
};

// Display data from the object to the console
console.log(person.firstName)
console.log(person.lastName)
console.log(person.fullName());
// Display data from the object to jupyter notebook 
element.append(person.fullName());
```

## Image Data for Background
Shown is key JSON Object definitions for a background called water.png.

> JavaScript objects are often nested


```python
%%js

// Background data from navigation/rpg.md
const image_src = "{{site.baseurl}}/images/rpg/water.png";
const image_data = {
    pixels: {height: 580, width: 1038}
};
const image = {src: image_src, data: image_data};

// review console to see JSON in memoory
console.log(image)

// display JSON in HTML
const image_json = JSON.stringify(image, null, 2);
element.append(`<pre>${image_json}</pre>`);
```

## Sprite Data for Player
A sprite is the foundation of an animated player.  There are many JSON Object ddefinition required to implement animations.

> JavaScript Object data can be extracted with dot notation.


```python
%%js

// Sprite data
const sprite_src = "{{site.baseurl}}/images/rpg/turtle.png";
const sprite_data = {
    SCALE_FACTOR: 10,
    STEP_FACTOR: 1000,
    ANIMATION_RATE: 50,
    pixels: {height: 280, width: 256},
    orientation: {rows: 4, columns: 3 },
    down: {row: 0, start: 0, columns: 3 },
    left: {row: 1, start: 0, columns: 3 },
    right: {row: 2, start: 0, columns: 3 },
    up: {row: 3, start: 0, columns: 3 },
};
const sprite = {src: sprite_src, data: sprite_data};

// review console to see JSON in memoory
console.log(sprite)
console.log("----Extract Data with Dot Notation---");
console.log(sprite.data.up)

// display JSON in HTML
const sprite_json = JSON.stringify(sprite, null, 2);
element.append(`<pre>${sprite_json}</pre>`);
element.append("----Extract Data with Dot Notation---");
const sprite_partial = JSON.stringify(sprite.data.up, null, 2);
element.append(`<pre>${sprite_partial}</pre>`);

```
