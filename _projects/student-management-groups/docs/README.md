---
layout: post
title: Student Management Groups - Overview
description: Source-of-truth project documentation for Groups and Group Dashboard pages
category: Gamify
breadcrumb: true
permalink: /student-management-groups/overview
---

## Purpose

This project owns the student Groups feature source pages and publishes them through the registered _projects pipeline.

Canonical routes kept by this project:

- /student/groups
- /student/groups/dashboard

## Source Files

- docs/GROUPS.html
- docs/GROUP_DASHBOARD.html
- notebook.src.ipynb
- Makefile

## Build Workflow

Run from repository root:

```bash
make build-registered-projects
make build-registered-docs
```

Or project-specific:

```bash
make -C _projects/student-management-groups build
make -C _projects/student-management-groups docs
```

Generated outputs are distributed to:

- _notebooks/projects/student-management-groups/
- _posts/projects/student-management-groups/
- assets/js/projects/student-management-groups/
- images/projects/student-management-groups/
