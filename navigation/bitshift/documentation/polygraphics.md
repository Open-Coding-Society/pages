---
layout: post 
title: Poly Graphics
description: 
author: 
hide: true
menu: nav/bitshift-nav/render.html
---

# 3D Triangle Rendering Pipeline Documentation

This documentation describes a basic method for rendering 3D triangles onto a 2D screen using a custom software pipeline. The process is broken down into three major stages: translating the 3D world to camera space, rotating it based on camera orientation, and finally projecting the result onto a 2D screen. This method is suitable for understanding the core principles of 3D rendering without relying on high-level libraries or hardware acceleration.

---

## Overview

Triangles are the fundamental building blocks in 3D computer graphics. Any 3D surface can be represented as a mesh of interconnected triangles. To render a triangle correctly from a 3D world onto a 2D screen, we must perform a series of transformations. These transformations include translating the vertices to be relative to the camera’s position, rotating them to match the camera’s view direction, and projecting the 3D coordinates onto a flat 2D plane that represents the user's screen. Each of these steps modifies the vertex data, gradually preparing it for final rendering.

---

Here’s your updated section with **code snippets** added for both the **translation to camera space** and **rotation based on camera direction**. The code is written in **Python-style pseudocode** for clarity and adaptability across engines.

---

## Step 1: Translate to Camera Space

Before we can perform any projection or rotation, we need to reposition all the vertices of our triangles so that the camera becomes the new origin of the coordinate system. This means that every point in the 3D world is expressed relative to the camera’s location. Doing this makes all subsequent calculations simpler and allows us to simulate a camera moving through a 3D space without having to move the world itself.

Given a vertex in the world `(x, y, z)` and a camera located at `(cx, cy, cz)`, the translated position becomes `(x - cx, y - cy, z - cz)`. This operation is performed on all three vertices of each triangle. At this stage, the triangle has been repositioned in space so that it is described from the camera’s point of view, but it has not yet been oriented properly or projected.

```python
# Example vertex and camera position
vertex = (x, y, z)
camera_position = (cx, cy, cz)

# Translate the vertex relative to the camera
translated = (
    vertex[0] - camera_position[0],
    vertex[1] - camera_position[1],
    vertex[2] - camera_position[2]
)
```

For a full triangle:

```python
def translate_triangle(triangle, camera_pos):
    return [
        (v[0] - camera_pos[0], v[1] - camera_pos[1], v[2] - camera_pos[2])
        for v in triangle
    ]
```

---

## Step 2: Rotate Based on Camera Direction

After translation, the next step is to rotate the world around the origin so that it aligns with the direction the camera is facing. The camera typically has three orientation parameters: yaw, pitch, and optionally roll. Yaw is the rotation around the vertical (Y) axis and controls looking left or right. Pitch is the rotation around the horizontal (X) axis and controls looking up or down. Roll, which is often omitted in basic systems, is the rotation around the forward (Z) axis and affects tilting the view sideways.

To apply rotation, we use standard rotation matrices. The order of application is important. Usually, yaw is applied first, followed by pitch, and finally roll (if used). Each of these is a simple 2D rotation applied in the relevant plane. For example, yaw rotates points in the XZ plane, while pitch rotates them in the YZ plane. By rotating all translated vertices using these matrices, the world is now aligned with the camera’s orientation. This makes it possible to determine what part of the world is in front of the camera and should be rendered.

### Python-style rotation functions:

```python
import math

def rotate_yaw(vertex, yaw):
    x, y, z = vertex
    cos_y = math.cos(yaw)
    sin_y = math.sin(yaw)
    return (
        x * cos_y - z * sin_y,
        y,
        x * sin_y + z * cos_y
    )

def rotate_pitch(vertex, pitch):
    x, y, z = vertex
    cos_p = math.cos(pitch)
    sin_p = math.sin(pitch)
    return (
        x,
        y * cos_p - z * sin_p,
        y * sin_p + z * cos_p
    )

def rotate_roll(vertex, roll):
    x, y, z = vertex
    cos_r = math.cos(roll)
    sin_r = math.sin(roll)
    return (
        x * cos_r - y * sin_r,
        x * sin_r + y * cos_r,
        z
    )
```

### Combined rotation:

```python
def rotate_vertex(vertex, yaw, pitch, roll=0):
    v = rotate_yaw(vertex, yaw)
    v = rotate_pitch(v, pitch)
    v = rotate_roll(v, roll)
    return v
```

### Rotate a full triangle:

```python
def rotate_triangle(triangle, yaw, pitch, roll=0):
    return [rotate_vertex(v, yaw, pitch, roll) for v in triangle]
```

These transformations are applied in order **after** translation. The resulting vertices are then ready for projection into 2D screen space.

## Step 3: Project to 2D Screen

Once the triangle is both translated and rotated, it is now properly positioned in the camera's coordinate space. The final step is to project each vertex from 3D space into 2D screen space. This step simulates the perspective of the camera by shrinking objects as they get farther away, mimicking how real-world perspective works.

The most common method for doing this is perspective projection. In this method, each 3D point is divided by its Z-coordinate (distance from the camera) and then scaled by a constant focal length. The focal length determines how wide or narrow the field of view is and can be calculated based on screen dimensions and a desired field-of-view angle.

The projected 2D coordinates are computed using:

```
screen_x = (x / z) * focal_length + screen_width / 2
screen_y = (y / z) * focal_length + screen_height / 2
```

This shifts and scales the point so that it fits within the screen’s pixel space, assuming the screen origin is in the top-left corner. Any points with a Z value less than or equal to zero are considered behind the camera and are not rendered. At this point, the 3D triangle has been converted to 2D coordinates and can be drawn using a rasterization method or line drawing function.

---

## Complete Transformation Process (Pseudocode)

Below is a high-level pseudocode example that puts all the steps together in a loop that processes each triangle in a mesh:

```python
for triangle in mesh:
    projected_vertices = []
    for vertex in triangle.vertices:
        # Step 1: Translate to camera space
        vx = vertex.x - camera.x
        vy = vertex.y - camera.y
        vz = vertex.z - camera.z

        # Step 2: Apply camera rotation
        # Yaw rotation (around Y-axis)
        temp_x = vx * cos(camera.yaw) + vz * sin(camera.yaw)
        temp_z = -vx * sin(camera.yaw) + vz * cos(camera.yaw)
        vx, vz = temp_x, temp_z

        # Pitch rotation (around X-axis)
        temp_y = vy * cos(camera.pitch) - vz * sin(camera.pitch)
        temp_z = vy * sin(camera.pitch) + vz * cos(camera.pitch)
        vy, vz = temp_y, temp_z

        # Step 3: Perspective projection
        if vz <= 0:
            continue  # Skip if behind the camera

        sx = (vx / vz) * focal_length + screen_width / 2
        sy = (vy / vz) * focal_length + screen_height / 2

        projected_vertices.append((sx, sy))

    if len(projected_vertices) == 3:
        draw_triangle(projected_vertices[0], projected_vertices[1], projected_vertices[2])
```

This pseudocode assumes that camera rotations are handled with basic trigonometric functions and that `draw_triangle` is a method that fills or outlines the triangle based on its screen-space coordinates.

---

## Additional Notes

* Depth testing is essential to render triangles in the correct order. This is typically done using a Z-buffer, which keeps track of the depth of each pixel and only draws new pixels if they are closer to the camera.
* Perspective division can cause issues if the Z value is too close to zero. It's common to define a near clipping plane to prevent rendering errors.
* Lighting, shading, and texture mapping occur after projection and usually require additional attributes such as normals or texture coordinates to be transformed along with position.

---

## Summary of Transformations

| Stage       | Description                                                                     |
| ----------- | ------------------------------------------------------------------------------- |
| Translation | Moves the world relative to the camera’s position so the camera is at origin.   |
| Rotation    | Orients the world based on the camera’s yaw and pitch (and optionally roll).    |
| Projection  | Converts 3D camera-space coordinates to 2D screen-space using perspective math. |

---
