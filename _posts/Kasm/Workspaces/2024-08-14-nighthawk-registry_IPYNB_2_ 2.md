---
layout: post
title: Nighthawk Registry Guide
permalink: /kasm/workspaces/registry
menu: nav/kasm_cloud.html
categories: ['Kasm']
author: Torin Wolff
toc: True
comments: True
---

## Nighthawk Registry Description

The registry works with DockerHub has an instance of the developed containers for Kasm Workspaces. The items on the registry can be referenced by Kasm through its Workspace Registry management tool.

- `Nighthawk Coders Published Registry:` [kasm_registry GitHub Pages](https://open-coding-society.github.io/kasm_registry/1.0/)

- `NightHawd Coder GitHub location`: [kasm_registry files](https://github.com/open-coding-society/kasm_registry)



## Reistry Schema

The registry contains a schema as show below and a PNG.  In the Workspace SDLC, a developer will come to the point where they want to publish to the registry. 

The requirements include ...
- `friendly_name`  The name visible to the Users on the Kasm.
- `compatibility` The Kasm versions that will read your registry.
- `cores, cpus` The resource allocations you require from the Kasm system.
- `docker_registry, name` References to [dockerhub](hhttps://hub.docker.com/repository/docker/open-coding-society/pusd-student-ubuntu/general)

```json
{
  "friendly_name": "Ubuntu 22.04 Student Edition",
  "image_src": "open-coding-society-stu-edition.png",
  "description": "This Dockerfile creates a Docker image based on Ubuntu, with Google Chrome and Visual Studio Code pre-installed. It's designed to provide students with a consistent, ready-to-use development environment on any device.",
  "name": "open-coding-society/pusd-student-ubuntu:1.14.0-rolling",
  "cores": 2,
  "memory": 2768,
  "gpu_count": 0,
  "cpu_allocation_method": "Inherit",
  "docker_registry": "https://index.docker.io/v1.1/",
  "categories": [
    "Desktop",
    "Development"
  ],
  "require_gpu": false,
  "enabled": true,
  "image_type": "Container",
  "run_config": {
    "hostname": "kasm"
  },
  "architecture": [
    "amd64"
  ],
  "compatibility": [
    "1.14.x",
    "1.15.x"
  ],
  "uncompressed_size_mb": 4200
}
```
