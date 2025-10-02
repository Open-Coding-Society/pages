---
layout: post 
title: Js and Java Fullstack
description: 
author: 
hide: true
---

# Java Backend APIs and JavaScript Frontend Communication

## Overview

This lesson teaches how to connect a Java backend API with a JavaScript frontend. You will learn to:

* Understand the client-server architecture.
* Set up a Java backend using Spring Boot (or similar frameworks).
* Create RESTful API endpoints in Java.
* Make HTTP requests from the frontend using JavaScript (`fetch` or `axios`).
* Handle JSON data between backend and frontend.
* Secure basic API communication.

This lesson assumes basic knowledge of Java, JavaScript, and web development.

---

## 1. Understanding Client-Server Communication

**Concepts:**

* **Client:** The frontend (browser, mobile app, etc.) that requests data or services.
* **Server:** The backend (Java application) that processes requests and responds.
* **API (Application Programming Interface):** A contract defining how clients and servers communicate.

**Workflow Example:**

1. User clicks a button on the frontend.
2. Frontend sends an HTTP request to the backend API.
3. Backend processes the request and returns data (usually JSON).
4. Frontend receives the data and updates the UI.

---

## 2. Setting Up a Java Backend API

**Example using Spring Boot:**

```java
// UserController.java
@RestController
@RequestMapping("/api/users")
public class UserController {

    @GetMapping("/{id}")
    public ResponseEntity<User> getUser(@PathVariable Long id) {
        User user = userService.findUserById(id);
        if(user != null) {
            return ResponseEntity.ok(user);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/")
    public ResponseEntity<User> createUser(@RequestBody User user) {
        User createdUser = userService.saveUser(user);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdUser);
    }
}
```

**Key Points:**

* `@RestController`: Exposes REST API endpoints.
* `@RequestMapping`: Defines the base path for API.
* `@GetMapping` / `@PostMapping`: HTTP method mappings.
* `@PathVariable` / `@RequestBody`: Extracts data from request.
* `ResponseEntity`: Allows controlling HTTP status and response body.

---

## 3. Frontend Communication (JavaScript)

**Using Fetch API:**

```javascript
// GET request example
async function getUser(userId) {
    const response = await fetch(`http://localhost:8080/api/users/${userId}`);
    if(response.ok) {
        const data = await response.json();
        console.log(data);
    } else {
        console.error('Error fetching user');
    }
}

// POST request example
async function createUser(user) {
    const response = await fetch(`http://localhost:8080/api/users/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user)
    });
    if(response.ok) {
        const newUser = await response.json();
        console.log(newUser);
    } else {
        console.error('Error creating user');
    }
}
```

**Key Points:**

* Use `fetch` or `axios` to make HTTP requests.
* Always set `Content-Type` to `application/json` for JSON data.
* Use `await` with `async` functions for asynchronous operations.

---

## 4. JSON Data Handling

* Backend returns Java objects serialized to JSON automatically (Spring Boot does this with Jackson).
* Frontend parses JSON using `.json()` to get JavaScript objects.
* Example mapping:

  ```json
  {
    "id": 1,
    "name": "Alice",
    "email": "alice@example.com"
  }
  ```

---

## 5. Handling CORS (Cross-Origin Requests)

* When frontend runs on a different port (`localhost:3000`) than backend (`localhost:8080`), browsers block requests by default.
* Enable CORS in Spring Boot:

```java
@Configuration
public class CorsConfig {
    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**").allowedOrigins("http://localhost:3000");
            }
        };
    }
}
```

---

## 6. Security Considerations

* Never expose sensitive data via GET requests.
* Validate input on the backend.
* Use authentication tokens (JWT) for secured endpoints.
* Use HTTPS in production.

---

## 7. Hands-On Exercise

**Task: Build a simple app that manages users.**

1. Backend:

   * Create `User` class with `id`, `name`, `email`.
   * Add GET `/api/users/{id}` and POST `/api/users`.
2. Frontend:

   * Build a simple HTML page with a form and a button.
   * Fetch user data on button click.
   * Display user info dynamically.

---

## 8. Summary

* Frontend sends HTTP requests to backend API.
* Backend processes request and responds with JSON.
* JSON data bridges the backend Java objects and frontend JavaScript.
* Proper CORS and security handling are crucial for safe and smooth communication.