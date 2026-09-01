---
layout: post
title: Introduction Java Spring Framework
description: Introduction to API, JPA, ORM, POJOs in Java Spring Framework
permalink: /java/spring/intro/
courses: {'csa': {'week': 3}}
categories: [Java Spring]
---

## Spring at a Glance

Spring turns a Java data object into a working web application:

```text
POJO / @Entity -> JpaRepository -> Controller -> Endpoint -> UI
```

- **POJO / entity:** defines the data and its relationships.
- **JPA repository:** saves and retrieves entity instances from SQLite.
- **Controller:** receives HTTP requests and coordinates repository calls.
- **UI:** either fetches JSON from `/api/*` or receives HTML from `/mvc/*`.

For the scored assignment and its required implementation choices, return to [Java Spring Hacks]({{ site.baseurl }}/java/spring/hacks/).

### Reference Example

The Jokes example shows the same data flow with a small, existing object:

- [Jokes runtime](https://pages.opencodingsociety.com/java/spring/jokes)
- [Jokes backend files](https://github.com/open-coding-society/spring_2025/tree/master/src/main/java/com/nighthawk/spring_portfolio/mvc/jokes)
