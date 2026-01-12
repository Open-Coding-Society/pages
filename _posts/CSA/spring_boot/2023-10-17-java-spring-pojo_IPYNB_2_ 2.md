---
layout: post
title: Plain Old Java Objects (POJO)
description: Define a POJO, essentially an class with @Entity properties that enables it to be used with Spring Boot in the process of making a database.
permalink: /java/spring/pojo/
categories: ['Java Spring']
menu: nav/java_spring.html
---

### POJO Review

> This code fragment shows power of Spring and Annotations to define a Model.  Using Spring, a little bit of POJO code, the Developer is enabling persistent data storage of a table in a database. It is left to student to search up each annotation for personal clarification beyond the comments below.

```java
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import javax.persistence.*;

@Data  // Annotations to simplify writing code (ie constructors, setters)
@NoArgsConstructor  // Builds zero argument constructor
@AllArgsConstructor // Builds constructor for all agurments
@Entity // Annotation to simplify creating an entity, which is a lightweight persistence domain object. Typically, an entity represents a table in a relational database, and each entity instance corresponds to a row in that table.
public class Jokes {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;  // Unique identifier

    @Column(unique=true)
    private String joke;  // The Joke

    private int haha;  // Store joke likes
    private int boohoo;  // Store joke jeers
}
```
