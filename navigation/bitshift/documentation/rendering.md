---
layout: post
title: Rendering Resources
search_exclude: true
menu: nav/bitshift-nav/render.html
---

## Research
Our project features rendering engine that utilizes GPU acceleration to render 3D environments on the users device. Below are resources that were used to figure out the optimal way of doing so along with keeping user accessibility in mind.

### File Types
When designing this rendering engine, a lot of research was put in to determine how accessible it would be for all users across any device. Multiple papers related to different file types for rendering were used to figure out which file types would allow for the project to be most accessible to all users.

- [CUDA GPU Compiler](https://docs.nvidia.com/cuda/cuda-compiler-driver-nvcc/)
- [Accessible Formats](https://accessibility.mcmaster.ca/digital-accessibility/alternative-formats/)
- [MSU Digital Accessibility](https://webaccess.msu.edu/tutorials/basics/file-type)

### Rendering
The original version of this engine utilized 3D raytracing, a form of rendering that traces the path of a ray based off its direction to calculate what will be displayed on screen. Of course this is a much simpler explanation than the actual math behind it, that can be found in the following papers:

- [Stanford Raytracing Graphics](https://graphics.stanford.edu/papers/rtongfx/rtongfx.pdf)
- [RayTracing Resources](https://www.realtimerendering.com/raytracing.html)

After attempting to use this, one issue arose when testing this technique for rendering. It was too slow (Sub 30 FPS) for this to run on most computers, thus rendering it inaccessible to majority of users. This lead to a different form of rendering called Digital Differential Analyzer (more commonly referred as DDA). This form of rendering focuses on voxels, which are simply 3D pixels, to render and it is able to do so extremely faster.
These papers were used to study how this form of rendering works:

- [DDA (Graphics Algorithm)](https://en.wikipedia.org/wiki/Digital_differential_analyzer_(graphics_algorithm))
- [ACM Digital Library](https://dl.acm.org/doi/10.1145/1455200.1455222)

This allowed for list looked up of objects that the ray would collide with which would take the time to calculate ray collision from **O(n)** with **n** being the number of objects, to just **O(1)** due to grabbing an item from a list index only resulting in **O(1)**. Making this form of rendering extremely faster than the last, but the issue with this technique was that it still suffered at further distances which would lead to many users suffering in more open spaces. On top of that, the resulting resolution was much worse than expected and the project suffered due to this as well.

The final solution that our project landed on was a more traditional form of rendering which utilizes triangles to form objects in space. This can be done very simply using one function to calculate the vertices of each point of the triangle, which creates a time complexity of **O(3n)** with **n** being the number of triangles. This can become an issue, especially with projects like ours that include many triangles in a single scene. There are many solutions to this issue, the first our project utilizes is back face culling. In simple terms, back face culling stops the computer from rendering triangles that face away from the camera (so the parts of a cube that face away from the camera/user). The following papers discuss how this works in more detail:

- [Efficient BFC](https://citeseerx.ist.psu.edu/document?repid=rep1&type=pdf&doi=50abbfc6ef6a7e62c4f00ee8bf63f68e2935fe18)
- [Realtime BFC](https://www.researchgate.net/publication/228530273_A_fast_real-time_back-face_culling_approach)

The second solution is to only calculate the vertices (corners of a triangle) rather than each vertex of every triangle, this solves the issue when two or more triangles share the same vertex position, so rather than calculating it twice or more per triangle, this only calculates the vertex once no matter the amount of triangles. With this optimization, the time complexity of the engine goes down to **O(n)** with **n** being the number of vertices.

Here you can find more resources to how 3D rendering works with triangles:
- [Triangle Strips](https://www.cs.umd.edu/~varshney/papers/CADstrips.pdf)
- [Triangle Meshes](https://www.cs.umd.edu/~varshney/papers/CADstrips.pdf)
- [3D Triangle Optimization](https://www.researchgate.net/figure/Triangle-strips-for-3D-rendering-of-a-block-with-elevation-samples-same-example-as_fig5_228809499)
- [Triangle Order per Complexity](https://jcgt.org/published/0006/03/03/paper-lowres.pdf)