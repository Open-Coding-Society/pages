---
layout: post
title: API Controller
description: A short reference for Spring REST controllers and API endpoints.
permalink: /java/spring/api/
courses: {'csa': {'week': 4}}
categories: ['Java Spring']
---

## REST API Controller

Use a REST controller only for the GitHub Pages path in [Java Spring Hacks]({{ site.baseurl }}/java/spring/hacks/).

- `@RestController` returns response data as JSON.
- `@RequestMapping("/api/data")` gives this controller an `/api/*` prefix.
- `@GetMapping`, `@PostMapping`, `@PutMapping`, and `@DeleteMapping` define HTTP operations.
- `ResponseEntity<T>` combines a typed response body with an HTTP status.

```java
@RestController
@RequestMapping("/api/data")
public class DataApiController {
    private final DataRepository repository;

    public DataApiController(DataRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public ResponseEntity<List<Data>> getAll() {
        return ResponseEntity.ok(repository.findAll());
    }
}
```

The `/api/*` filter chain is configured in `SecurityConfig.java` with `Order(1)`. It is stateless and must allow the GitHub Pages origin through CORS. For server-rendered HTML and forms, use the separate `/mvc/*` path instead.

- [Spring REST guide](https://spring.io/guides/gs/rest-service/)
- [Java Spring Hacks]({{ site.baseurl }}/java/spring/hacks/)
