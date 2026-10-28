---
layout: post
title: Introduction Java Spring Framework
description: See how Spring turns a Java data object into a web app through an entity, a JPA repository, a controller, and endpoints a UI can call.
permalink: /java/spring/intro/
courses: {'csa': {'week': 3}}
categories: [Java, Spring]
lesson_group: "csa1"
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

The Jokes example shows Spring in action, this requires an account and login as it records data.

[Open the Jokes runtime](https://pages.opencodingsociety.com/java/spring/jokes). It requires an account and login because it records data.

![Java Jokes]({{site.baseurl}}/images/java_jokes.png)