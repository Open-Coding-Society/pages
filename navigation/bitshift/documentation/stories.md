---
layout: post 
title: User Stories
description: 
author: 
hide: true
menu: nav/bitshift-nav/doc.html
---

# User Stories - Rendering

## Accessibility and File Types

As a user with accessibility needs, I want the 3D rendering engine to use universally accessible file formats so that I can interact with the content regardless of my device or limitations. It’s important that the files used for rendering are compatible with assistive technologies and conform to accessibility standards, ensuring that users with various needs can still navigate and experience the content fully. Additionally, as a user on a low-end or older device, I want files to load correctly and efficiently, so I’m not excluded from using the application due to technical limitations.

## Performance and Framerate

As a user on a standard laptop or non-gaming machine, I want the 3D environment to render at a stable framerate so I don’t experience lag or stuttering during use. When I’m exploring large open areas or complex scenes, I expect the rendering system to maintain consistent performance and not degrade due to distance or object count. For users who value clarity and detail, I want the engine to maintain high resolution, even in performance-constrained scenarios, so the visuals remain crisp and immersive.

## Rendering Efficiency

As a developer, I want the rendering system to skip rendering objects that are not visible to the user, such as back-facing triangles, so that rendering time is reduced without impacting visual output. This kind of optimization helps ensure that the engine can scale to support complex environments.

As a user on a device with limited processing power, I want rendering computations to be as efficient as possible so the engine can run smoothly without causing overheating, excessive battery drain, or application crashes. If a scene contains multiple triangles that share vertices, I want those shared elements to be calculated once rather than repeatedly, to improve overall performance and responsiveness.

## Adaptability to Device Capability

As a user with an average GPU or general-purpose device, I want the engine to use a rendering method that balances quality and speed, so I can enjoy both visual fidelity and interactive responsiveness. For users on a wide range of devices, I expect the engine to adapt its rendering strategy automatically. When advanced techniques like raytracing are too slow or unfeasible, I want the engine to switch to a faster alternative like DDA or triangle-based rendering to preserve usability.

## Scalability and Complex Scenes

As a user navigating highly detailed 3D environments with thousands of triangles, I want the engine to remain performant and responsive so I can continue exploring without interruption. In real-time applications, the rendering should remain fast regardless of the complexity of the scene, maintaining the flow of interaction and immersion.

## Graceful Degradation

As a user on older or less powerful hardware, I want the engine to gracefully fall back to simpler rendering methods such as voxel-based DDA when more advanced techniques become too resource-intensive. Even if the visual quality is reduced, I want the core experience to remain accessible.

Similarly, as a developer, I want the engine to default to traditional triangle-based rendering with optimizations like back face culling and vertex sharing, so performance remains acceptable across a broad range of devices and scenarios.

---

These user stories reflect a user-centered design approach, emphasizing accessibility, performance, adaptability, and optimization across different platforms and hardware capabilities.

# User Story - Binary Puzzles
As a middle or high school student interested in computers or games, I want to explore a virtual facility where I solve engaging puzzles about binary and related topics like logic gates, hexadecimal, and binary math, so that I can learn complex concepts in a fun, digestible, and interactive way that feels more like playing a game than studying.

### Acceptance Criteria
- The facility has rooms or areas themed around different binary concepts (e.g., one for logic gates, one for hexadecimal).
- Each puzzle or challenge teaches or reinforces a specific binary-related topic.
- Puzzles scale in difficulty, with clear feedback and hints.
- The game visually represents binary data (e.g., bits flipping, logic gate trees).
- A tracking system shows progress and topics mastered.
- The design is accessible and welcoming, even to players with no prior experience.