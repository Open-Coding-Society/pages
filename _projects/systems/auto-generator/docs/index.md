---
layout: post
title: Auto-Generator for Admin CRUD Tables
description: Generate Spring Boot admin CRUD pages automatically using Java Reflection
permalink: /auto-generator/docs/
author: Yash Patil
date: 2026-01-20
---

# Auto-Generator for Admin CRUD Tables (DevOps)

Stop writing boilerplate! This system uses **Java reflection** to auto-generate fully functional admin CRUD pages for any Spring Boot entity.

## What It Generates

Given an entity class, the auto-generator produces:
- **Controller** (`GenerateTablePage.java`) with CRUD endpoints
- **Thymeleaf templates** for list, add, edit, and delete views
- **Repository interface** wired to the entity

## Quick Start

```bash
# Compile and run with your entity details
javac GenerateTablePage.java
java GenerateTablePage <EntityName> <com.your.package> <PageName>
```

## Architecture

The refactored system follows **Single Responsibility Principle** — see [SRP Compliance Report](./srp-compliance/) for full details.

| Class | Responsibility |
|---|---|
| `GenerationConfig` | Hold and compute all generation settings |
| `FileWriter` | Write generated code to the filesystem |
| `TemplateEngine` | Build code strings from templates |
| `ReflectionAnalyzer` | Inspect entity fields via reflection |
| `GenerateTablePage` | Orchestrate the generation pipeline |

## See Also

- [CRUD Automation UI Notebook](/auto-generator-ui/docs/) — Thymeleaf UI companion
- [SRP Compliance Report](./srp-compliance/)
