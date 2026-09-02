---
layout: post
title: Frontend UI
description: A short reference for connecting a frontend to Spring Boot.
permalink: /java/spring/ui/
courses: {'csa': {'week': 4}}
categories: ['Java Spring']
---

## Choose the UI That Matches Your Endpoints

Your UI path follows the backend architecture selected in [Java Spring Hacks]({{ site.baseurl }}/java/spring/hacks/).

### GitHub Pages with `/api/*`

A separate JavaScript frontend calls the REST API and renders its JSON response. Keep the backend URL in `config.js`.

```javascript
const response = await fetch(`${javaURI}/api/data`);
const data = await response.json();
```

The `/api/*` endpoints use `SecurityConfig.java` with `Order(1)`. CORS must allow the GitHub Pages origin.

### Thymeleaf with `/mvc/*`

Thymeleaf templates are served by Spring and submit same-origin HTML forms to `/mvc/*`. The MVC filter chain is `MvcSecurityConfig.java` with `Order(2)` and uses session and CSRF protection.

Do not combine the endpoint patterns for this assignment: fetch JSON from `/api/*`, or render templates and submit forms through `/mvc/*`.

- [MDN: Using Fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch)
- [Thymeleaf documentation](https://www.thymeleaf.org/documentation.html)
