---
layout: post 
title: Intro Code
description: 
author: 
hide: true
menu: nav/bitshift-nav/tutorial.html
---

```javascript
/**
The code is split up to easily understand for new programmers to 3D math and calculations. It is complete possible to compact this code
into a simpler version, if you'd prefer that you can do that on your own.

This javascript file has helpful comments to teach you how to do simple 3D math calculations in js.
If you'd like a step by step tutorial, follow this link: https://pages.opencodingsociety.com/navigation/documentation/tutorial/intro

Setup for context (ctx) and canvas
const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d'); // This code will work with a 2d screen so select 2d (kinda confusing I know)
*/

const halfWidth = canvas.width / 2; // Very important for later
const halfHeight = canvas.height / 2;

// Global Variable Setup
const vector = {
    x: 0,
    y: 0,
    z: 0
};

// To keep code organized I'd recommend keeping items related to one another in objects, for example camera values should be in a camera object
const camera = {
    x: 0, // camera x position
    y: 0, // camera y position
    z: 0, // camera z position
    FOV: 90, // camera FOV (Field Of View)
    direction : {
        x: 0, // camera direction on x axis
        y: 0, // camera direction on y axis
        z: 0 // camera direction on z axis
    }
};

// I'd recommend memorizing this equation but you don't want to, I'd recommend keeping it at 1
const focalLength = 1 / Math.tan(toRadians(camera.FOV) / 2); // Focal length just typically means what you can see from the camera's point of view


function toRadians(val) {
    // if you like working with degrees then this function is required, since javascript only takes radians for angles

    return val * (Math.PI / 180)
};

function Vector3(x,y,z) {
    // A Vector3 is just a form of 3D coordinates to hold values
    // A Vector3 holds 3 spacial coordinates while a Vector2 only holds 2 spacial coordinates

    // To keep code clean, this function will just be used to update the vector values

    vector.x = x;
    vector.y = y;
    vector.z = z;
};



// Step 1: Translation

function translate(x,y,z) {
    // This function translates a Vector3 in the opposite position of the camera
    // Think of it as if on a graph the camera becomes the origin
    // This also has the effect of making the coordinates move in the opposite direction of the camera

    const tempX = x - camera.x;
    const tempY = y - camera.y;
    const tempZ = z - camera.z;

    Vector3(tempX, tempY, tempZ);
};



// Step 2: Rotation

// Part A

function rotateX(x,y,z) {
    // This function rotates a Vector3 in the direction of the camera x direction
    // Think of it as if the Vector3 is spinning around the camera (origin) based off the camera angle

    // When rotating on an axis, you only need to affect the coordinate you're rotating around (in this case the X axis) and the z coordinate

    const angle = toRadians(camera.direction.x);

    const tempX = x * Math.cos(angle) - z * Math.sin(angle);
    const tempZ = x * Math.sin(angle) + z * Math.cos(angle);

    Vector3(tempX, y, tempZ);
};

// Part B

function rotateY(x,y,z) {
    // This function rotates a Vector3 in the direction of the camera y direction
    // This function is carbon copy of the rotateY function except it rotates a Vector3 around the Y Axis

    const angle = toRadians(camera.direction.y);

    const tempY = y * Math.cos(angle) - z * Math.sin(angle);
    const tempZ = y * Math.sin(angle) + z * Math.cos(angle);

    Vector3(x, tempY, tempZ);
};

// Part C

function rotateZ(x,y,z) {
    // This function rotates a Vector3 in the direction of the camera z direction
    // This function is different due to it rotating the x and y coordinates and not the z coordinate

    const angle = toRadians(camera.direction.z);

    const tempX = x * Math.cos(angle) - y * Math.sin(angle);
    const tempY = x * Math.sin(angle) + y * Math.cos(angle);

    Vector3(tempX, tempY, z);
};



// Step 3: Projection

// Imagine projection like a project that shows an 2D image on a wall, the project actually launches light in a 3D space to create a 2D image

function project3DTo2D(x,y,z) {
    // This function flattens 3D spacial coordinates into 2D spacial coordinates
    // In more simple terms, it converts 3D coordinates in a world to 2D onscreen coordinates

    const tempX = halfWidth + halfWidth * focalLength * (x / z);
    const tempY = halfHeight + halfWidth * focalLength * (y / z); // You can replace halfWidth with halfHeight but your output will look squashed

    return {x: tempX, y: tempY}; // we can return this value rather than making it a Vector3 since it is the last function required
};

// Step 4: Final Function

function goTo(x,y,z) {
    translate(x,y,z); // Step 1

    rotateX(vector.x, vector.y, vector.z); // Step 2: Part A
    rotateY(vector.x, vector.y, vector.z); // Step 2: Part B
    rotateZ(vector.x, vector.y, vector.z); // Step 2: Part C

    return project3DTo2D(vector.x, vector.y, vector.z); // Step 3
};

// Congratulions!!!

// You completed the heavy load of simple 3D math!

// Don't worry it gets far worse :D (just kidding you'll be alright)
```