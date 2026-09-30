---
layout: post
title: Anatomy of a Spring Boot Project
description: A discussion of key elements in a Java Spring Boot backend project.  This includes preparing a project for deployment.
permalink: /java/spring/anatomy
courses: {'csa': {'week': 4}}
categories: ['Java Spring']
type: coding 
---

## Spring Project Anatomy

Use these locations to find the part of your application you need to change:

| Location | Purpose |
| --- | --- |
| `pom.xml` | Spring, JPA, SQLite, security, and Thymeleaf dependencies |
| `src/main/java/` | Entities, repositories, controllers, and security configuration |
| `src/main/resources/application.properties` | Port and database configuration |
| `src/main/resources/templates/` | Thymeleaf HTML for the `/mvc/*` option |
| `src/main/resources/static/` | Static assets served from Spring |

`Main.java`, annotated with `@SpringBootApplication`, starts the application. For this assignment, use the configured port and SQLite database from the starter project rather than copying older example settings.

### Security Files

- `SecurityConfig.java` is `Order(1)` and processes the `/api/*` filter chain first.
- `MvcSecurityConfig.java` is `Order(2)` and processes the `/mvc/*` filter chain afterward.

See [Java Spring Hacks]({{ site.baseurl }}/java/spring/hacks/) for the required endpoint and UI path.

## Hacks

Start your own Spring project: [Open Coding Society Spring](https://github.com/Open-Coding-Society/spring)
