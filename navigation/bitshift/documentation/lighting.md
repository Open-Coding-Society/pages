---
layout: post
title: Lighting
description: 
author: 
hide: true
menu: nav/bitshift-nav/render.html
---

# Lighting in 3D Rendering: Normals and Shading

Lighting is a critical component of realistic 3D rendering. It simulates how light interacts with surfaces, allowing us to perceive depth, shape, and material. In a triangle-based renderer, lighting is typically calculated using the **surface normal** of each triangle or vertex in combination with the direction of incoming light.

This document focuses on the **math and logic of lighting** in triangle-based rendering systems, emphasizing **directional lighting**, **surface normals**, **diffuse lighting**, and **basic specular reflection**.

---

## Surface Normals

A **surface normal** is a unit vector perpendicular to the surface of a triangle. It is fundamental in lighting calculations because it defines the orientation of the surface relative to incoming light.

### Calculating a Triangle Normal

For a triangle with three vertices `A`, `B`, and `C`, you can calculate its surface normal using the **cross product** of two edge vectors:

```python
U = B - A
V = C - A
Normal = normalize(cross(U, V))
```

* `U` and `V` are edge vectors of the triangle.
* `cross(U, V)` gives a vector perpendicular to both.
* `normalize()` ensures the vector has a magnitude of 1 (unit length).

This normal vector is then used in shading equations to determine how much light hits the triangle’s surface.

---

## Directional Lighting

In simple lighting models, a **directional light** is a light source where all light rays travel in the same direction, such as sunlight. This direction is defined by a unit vector `L`, typically pointing from the surface toward the light source.

---

## Diffuse Lighting (Lambertian Reflection)

### Concept

Diffuse lighting simulates the scattering of light on rough surfaces. The brightness depends on the angle between the surface normal and the light direction.

### Formula

```math
I_diffuse = max(0, dot(N, -L)) * Color * LightIntensity
```

* `N`: Normal vector of the triangle or vertex (must be normalized).
* `L`: Light direction (must be normalized).
* `dot(N, -L)`: Computes how aligned the normal is with the light.
* `Color`: Base color of the surface (albedo).
* `LightIntensity`: Scalar or RGB intensity of the light source.

The `max(0, …)` ensures that only front-facing surfaces receive light (avoids negative brightness).

### Example in Code

```python
brightness = max(0, dot(normal, -light_dir))
shaded_color = base_color * brightness
```

This is the most common and efficient form of lighting known as **Lambertian shading**.

---

## Specular Lighting (Blinn-Phong Model)

### Concept

Specular reflection simulates the bright highlights you see on shiny surfaces. It depends on the **view direction** and the **reflection** of the light.

### Formula (Simplified Blinn-Phong)

```math
H = normalize(L + V)
I_specular = max(0, dot(N, H))^shininess * LightColor
```

* `L`: Light direction vector.
* `V`: View direction vector (from surface point to camera).
* `H`: Halfway vector between `L` and `V`.
* `N`: Surface normal.
* `shininess`: A scalar controlling highlight sharpness.

The exponentiation controls how concentrated the specular highlight is. Higher values produce smaller, sharper highlights (used for polished surfaces).

---

## Putting It Together: Combined Lighting Model

A basic shading equation combining ambient, diffuse, and specular components:

```math
Color = Ambient +
        Diffuse * max(0, dot(N, -L)) +
        Specular * max(0, dot(N, H))^shininess
```

Each term is typically RGB-scaled and multiplied by light and surface properties.

### Implementation Overview

```python
# Normalize vectors
N = normalize(normal)
L = normalize(-light_direction)
V = normalize(camera_position - fragment_position)
H = normalize(L + V)

# Lighting components
diffuse = max(0, dot(N, L))
specular = pow(max(0, dot(N, H)), shininess)

# Final color
color = ambient_color + 
        (diffuse_color * diffuse * light_intensity) +
        (specular_color * specular * light_intensity)
```

---

## Per-Triangle vs. Per-Vertex vs. Per-Pixel Lighting

* **Per-triangle lighting**: Computes lighting once per triangle using the triangle’s face normal. Fast but flat and unshaded.
* **Per-vertex lighting**: Computes lighting at each vertex, then interpolates across the triangle. Smooth but less accurate.
* **Per-pixel lighting** (fragment shading): Computes lighting for each screen pixel. Most accurate but computationally intensive.

Use **per-triangle** for fast software renderers, and move toward **per-pixel** for realism in shaders.

---

## Normal Interpolation

In per-vertex lighting or per-pixel lighting, the normal vector is interpolated across the triangle using **barycentric coordinates**, allowing for smooth lighting across curved surfaces. The interpolated normals must be normalized before lighting calculations.

---

## Summary Table

| Concept               | Description                                            |
| --------------------- | ------------------------------------------------------ |
| Surface Normal        | Vector perpendicular to triangle surface               |
| Dot Product           | Measures angle alignment between two vectors           |
| Diffuse Lighting      | Brightness based on light hitting the surface head-on  |
| Specular Lighting     | Highlight from mirror-like reflections                 |
| Halfway Vector (H)    | Vector used in specular reflection (Blinn-Phong model) |
| Lambertian Shading    | Most common diffuse lighting model                     |
| Per-Triangle Lighting | One normal per triangle — fast but flat shading        |
| Per-Vertex Lighting   | Smooth interpolation across surface                    |
| Per-Pixel Lighting    | Most realistic, used in modern shaders                 |

---

## Conclusion

Lighting in triangle-based rendering is grounded in vector mathematics, particularly dot products and normalization. The surface normal plays a central role in determining how light interacts with a surface. Understanding the mathematical foundation behind these lighting models allows you to implement realistic and efficient shading in any 3D rendering engine.

