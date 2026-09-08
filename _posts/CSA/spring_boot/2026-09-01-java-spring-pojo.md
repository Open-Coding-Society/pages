---
layout: post
title: Plain Old Java Objects (POJO)
description: A short reference for defining a Spring data object and JPA entity.
permalink: /java/spring/pojo/
categories: ['Java Spring']
courses: {'csa': {'week': 4}}
---

## POJO and Entity

Your data object begins as a Java class. Adding JPA annotations makes it persistable; Lombok removes routine accessor, mutator, and constructor code.

```java
@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class Data {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
}
```

- `@Entity` maps the class to a database table.
- `@Id` and `@GeneratedValue` define the primary key.
- `@Data` generates getters, setters, `equals`, `hashCode`, and `toString`.

Choose fields and relationships that model your own system object, then continue with the repository and controller references in [Java Spring Hacks]({{ site.baseurl }}/java/spring/hacks/).

- [Project Lombok features](https://projectlombok.org/features/)
- [Jakarta Persistence API](https://jakarta.ee/specifications/persistence/)
