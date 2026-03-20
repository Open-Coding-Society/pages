---
layout: post 
title: 
description: 
author: 
hide: true
menu: nav/bitshift-nav/tutorial.html
---

# Building a Simple 3D Engine in JavaScript

This is a beginner-friendly guide that walks you through the full process of building a basic 3D rendering engine using JavaScript and a 2D HTML canvas. No frameworks or WebGL required. You will learn the fundamental math behind how 3D objects are transformed and projected onto a 2D screen.

The full script can be found [here]({{ site.baseurl }}navigation/bitshift/documentation/tutorial/intro-code).

---

## Step 1: Setting Up the Canvas

Before we can begin working with 3D math, we need a place to display our output. We'll use the HTML5 `<canvas>` element as our rendering surface, and JavaScript to control it. This allows us to draw 2D shapes on the screen, which we'll use to simulate 3D visuals.

### HTML Setup

```html
<canvas width="800" height="600"></canvas>
```

### JavaScript Setup

```js
const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

const halfWidth = canvas.width / 2;
const halfHeight = canvas.height / 2;
```

The `canvas` is our drawing surface. We get the 2D rendering context with `getContext('2d')`, which is what we use to draw. The `halfWidth` and `halfHeight` variables help us center the projection of 3D objects onto the 2D screen.

---

## Step 2: Define Camera and 3D Vectors

In a 3D engine, we need a virtual camera that defines where the viewer is located and what direction they're facing. We also need a way to represent 3D points in space.

```js
const camera = {
    x: 0,
    y: 0,
    z: 0,
    FOV: 90,
    direction: { x: 0, y: 0, z: 0 }
};

let vector = { x: 0, y: 0, z: 0 };
```

The `camera` object stores the position and direction of the camera, as well as the field of view (FOV). The `vector` is used as a temporary holder for 3D coordinates that we are manipulating during each transformation step.

---

## Step 3: Degree to Radian Conversion

JavaScript’s trigonometric functions like `Math.sin()` and `Math.cos()` expect angles in radians. To work with degrees (which are easier for most people to understand), we need a conversion function.

```js
function toRadians(degrees) {
    return degrees * (Math.PI / 180);
}
```

This function allows us to write our angles in degrees and convert them as needed when using JavaScript’s math functions.

---

## Step 4: Create a Vector3 Setter

To simplify updating our global vector during each transformation step, we use a helper function. This function makes the code cleaner by avoiding repetitive assignments.

```js
function Vector3(x, y, z) {
    vector.x = x;
    vector.y = y;
    vector.z = z;
}
```

This method modifies the global `vector` object that all transformation steps act upon.

---

## Step 5: Translate Relative to the Camera

In 3D graphics, translating an object relative to the camera involves subtracting the camera's position from the point's position. This effectively moves the entire world around the camera, allowing the camera to act as the origin of the scene.

```js
function translate(x, y, z) {
    const tempX = x - camera.x;
    const tempY = y - camera.y;
    const tempZ = z - camera.z;
    Vector3(tempX, tempY, tempZ);
}
```

This translation step is always the first operation in transforming a 3D point for display.

---

## Step 6: Apply 3D Rotation

Rotations simulate a camera turning in different directions. We apply separate rotations for each axis.

### Rotate Around X Axis

Rotating around the X-axis means we're tilting the camera up or down. When rotating around this axis, we leave the X value the same and apply a 2D rotation to the Z and Y values. This operation mimics looking up or down in a 3D environment.

```js
function rotateX(x, y, z) {
    const angle = toRadians(camera.direction.x);
    const tempY = y * Math.cos(angle) - z * Math.sin(angle);
    const tempZ = y * Math.sin(angle) + z * Math.cos(angle);
    Vector3(x, tempY, tempZ);
}
```

### Rotate Around Y Axis

Rotation around the Y-axis simulates looking left or right. This affects the X and Z coordinates while leaving Y unchanged. The transformation is similar to spinning an object left or right around a vertical axis.

```js
function rotateY(x, y, z) {
    const angle = toRadians(camera.direction.y);
    const tempX = x * Math.cos(angle) - z * Math.sin(angle);
    const tempZ = x * Math.sin(angle) + z * Math.cos(angle);
    Vector3(tempX, y, tempZ);
}
```

### Rotate Around Z Axis

Rotating around the Z-axis means rotating the view like a clock hand spinning. This affects the X and Y coordinates, while Z remains the same. It can be used to create roll-like camera effects.

```js
function rotateZ(x, y, z) {
    const angle = toRadians(camera.direction.z);
    const tempX = x * Math.cos(angle) - y * Math.sin(angle);
    const tempY = x * Math.sin(angle) + y * Math.cos(angle);
    Vector3(tempX, tempY, z);
}
```

Each of these functions applies a standard 2D rotation formula to the relevant coordinate pairs.

---

## Step 7: Project 3D to 2D

Once we’ve translated and rotated a point, we project it from 3D space onto the 2D screen. This step uses perspective projection, which makes distant objects appear smaller.

```js
const focalLength = 1 / Math.tan(toRadians(camera.FOV) / 2);

function project3DTo2D(x, y, z) {
    const screenX = halfWidth + (focalLength * x / z) * halfWidth;
    const screenY = halfHeight + (focalLength * y / z) * halfWidth;
    return { x: screenX, y: screenY };
}
```

The projection simulates how a real-world camera lens works and determines where the point should appear on the screen.

---

## Step 8: Combine All Steps

This function combines translation, rotation, and projection to turn a 3D point into a 2D point on the screen.

```js
function goTo(x, y, z) {
    translate(x, y, z);
    rotateX(vector.x, vector.y, vector.z);
    rotateY(vector.x, vector.y, vector.z);
    rotateZ(vector.x, vector.y, vector.z);
    return project3DTo2D(vector.x, vector.y, vector.z);
}
```

This is the core function of your 3D engine. It allows you to take any 3D coordinate and find out where it should appear on the screen.

### Usage Example

```js
const point3D = { x: 0, y: -50, z: 200 };
const screen = goTo(point3D.x, point3D.y, point3D.z);
ctx.fillRect(screen.x, screen.y, 4, 4);
```

This example transforms a single point and draws it as a 2D square on the canvas.

---

## Final Challenges

To solidify your understanding, try completing the following:

* Add keyboard controls to move the camera position and direction.
* Extend the engine to draw lines between multiple points to form wireframes.
* Experiment with rendering multiple points at varying distances.

---

## Conclusion

You’ve now built a foundational 3D engine from scratch using JavaScript. You learned how to move points relative to a camera, apply 3D rotations, and project 3D coordinates onto a 2D screen.

Up next we'll learn how to render our points onto the screen [here]({{site.baseurl}}/navigation/documentation/tutorial/render)!