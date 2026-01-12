---
layout: post
title: API Controller
description: Creating an API request and response to the Spring Boot application.
permalink: /java/spring/api/
categories: ['Java Spring']
menu: nav/java_spring.html
---

## API Controller (JokesApiController)

> This backend component of the Spring framework is responsible for building out the RESTful API services to access the data. Below is the `JokesApiController`, which is extensively commented to aid understanding.
- **@Autowired**: This annotation provides full access to `JokesJpaRepository`.
- **@GetMapping** and **@PutMapping**: These annotations enable endpoints for RESTful web services to access (accessor Get) and modify (mutator Put) the data.
- **@PathVariable**: This annotation is used for obtaining information from the request URL.
- **ResponseEntity**: Review the methods that return `ResponseEntity`, a Spring Framework implementation that encapsulates the entire HTTP response, including the status code, headers, and body. This allows for a more flexible and comprehensive way to handle HTTP responses according to RESTful API standards.
- **Method Signatures**: Review the signatures of the methods to understand how the Java return type is converted to JSON using the `ResponseEntity` object. This conversion is handled by Spring's `HttpMessageConverter`, which automatically serializes the Java objects into JSON format for the HTTP response body.
- **Generics**: A feature in Java that allows you to define classes, interfaces, and methods with a generic type `<T>`. In the `JokesApiController`, we are consumers of a class definition with generics from `public class ResponseEntity<T>`. This enables the return of a serialized instance of `ResponseEntity<List<Jokes>>` or `ResponseEntity<Jokes>` using specific types. 

### AP CSA Curriculum Comparisons

- **Generics**: We are required to use and understand generic types in using `public class ArrayList<T>`. This is similar to how we use `public class ResponseEntity<T>` in the `JokesApiController`.
- **Method Signatures**: The term signature is used in the curriculum to describe method definitions: `scope, return type, method name, parameters`. The signature is tightly coupled to the return type, which is important in understanding how methods like `getJokes()` and `setLike()` return `ResponseEntity` objects.
- **Accessors and Mutators**: Making `accessors` and `mutators` in APIs reinforces the need to have backend services to perform `accessor` or `mutator` methods in Plain Old Java Objects (POJOs). JPA (Java Persistence API) enables us to inject those services into our POJO class definitions.
- **List**: The `interface List<T>` is the parent of the College Board required `class ArrayList<T> implements List`. In the inheritance language, `List` is the interface definition and `ArrayList` is a specific implementation of `List` with enhancements and overrides. The `ArrayList` class adds features such as a resizable array, fast random access, and automatic memory management, constant time performance for get/set.
    - List Interface: Defines the methods that any list implementation must provide.
    - ArrayList Implementation: Provides constant-time performance for get and set operations due to its underlying array structure.
    - LinkedList Implementation: Provides linear-time performance for get and set operations due to its underlying doubly-linked list structure.
    - Vector Implementation: Synchronized, thread-safe implementation of a dynamic array. Provides similar functionality to `ArrayList` but with synchronization, meaning it can be safely accessed by multiple threads simultaneously.   
    - Stack Implementation: Extends `Vector` and provides LIFO (last-in-first-out) stack operations.

```java
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController // Annotation to simplify the creation of RESTful web services
@RequestMapping("/api/jokes")  // All requests in this class begin with this URI
public class JokesApiController {

    /**
     * @Autowired
     * This annotation allows Spring to automatically inject the JokesJpaRepository dependency.
     * The JokesJpaRepository is an interface, so the injected dependency means that Spring is automatically creating an instance of a class that implements this interface. This instance is then used to connect JPA methods to the POJO (Plain Old Java Object) class, enabling easy Database CRUD (Create, Read, Update, Delete) operations.
     */
    @Autowired
    private JokesJpaRepository repository;

    /**
     * GET List of Jokes
     * 
     * @GetMapping annotation is used for mapping HTTP GET requests onto specific handler methods.
     * 
     * @return ResponseEntity<List<Jokes>> - A ResponseEntity containing a list of Jokes objects and an HTTP status code.
     * The ResponseEntity encapsulates the entire HTTP response, including the status code, headers, and body.
     * The list of Jokes objects is serialized to JSON format for the HTTP response body.
     */
    @GetMapping("/")
    public ResponseEntity<List<Jokes>> getJokes() {
        // ResponseEntity returns List of Jokes provided by JPA findAll()
        return new ResponseEntity<>(repository.findAll(), HttpStatus.OK);
    }

    /**
     * Update Like
     * 
     * @PutMapping annotation is used for mapping HTTP PUT requests onto specific handler methods.
     * @PathVariable annotation extracts the templated part {id} from the URI.
     * 
     * @param id The ID of the joke to be liked.
     * @return ResponseEntity<Jokes> - A ResponseEntity containing the updated Jokes object and an HTTP status code.
     * The ResponseEntity encapsulates the entire HTTP response, including the status code, headers, and body.
     * The Jokes object is serialized to JSON format for the HTTP response body.
     */
    @PutMapping("/like/{id}")
    public ResponseEntity<Jokes> setLike(@PathVariable long id) {
        /* 
        * Optional (below) is a container object which helps determine if a result is present. 
        * If a value is present, isPresent() will return true
        * get() will return the value.
        */
        Optional<Jokes> optional = repository.findById(id);
        if (optional.isPresent()) {  // Good ID
            Jokes joke = optional.get();  // Value from findByID
            joke.setHaha(joke.getHaha() + 1); // Increment value
            repository.save(joke);  // Save entity
            return new ResponseEntity<>(joke, HttpStatus.OK);  // OK HTTP response: status code, headers, and body
        }
        // Bad ID
        return new ResponseEntity<>(HttpStatus.BAD_REQUEST);  // Failed HTTP response: status code, headers, and body
    }

    /* Update Jeer
     */
    @PutMapping("/jeer/{id}")
    public ResponseEntity<Jokes> setJeer(@PathVariable long id) {
        Optional<Jokes> optional = repository.findById(id);
        if (optional.isPresent()) {  // Good ID
            Jokes joke = optional.get();
            joke.setBoohoo(joke.getBoohoo() + 1);
            repository.save(joke);
            return new ResponseEntity<>(joke, HttpStatus.OK);
        }
        // Bad ID
        return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
    }
}
```
