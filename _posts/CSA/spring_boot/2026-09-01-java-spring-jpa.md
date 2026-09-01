---
layout: post
title: Java Persistence API (JPA)
description: A short reference for persisting Spring entities with JPA and SQLite.
permalink: /java/spring/jpa/
courses: {'csa': {'week': 4}}
categories: ['Java Spring']
---

## JPA Repository

JPA maps an `@Entity` class to a database table. A repository gives a controller standard create, read, update, and delete operations without writing common SQL.

```java
public interface DataRepository extends JpaRepository<Data, Long> {
    List<Data> findByNameIgnoreCase(String name);
}
```

`Data` is the entity type and `Long` is the type of its `@Id`. `findAll()`, `findById(id)`, `save(entity)`, and `deleteById(id)` are supplied by `JpaRepository`; a method such as `findByNameIgnoreCase` is a derived query.

For this assignment, inspect the SQLite schema after starting Spring. If you change the entity structure, remove `/volumes/sqlite.db` and restart so the schema is rebuilt as specified in [Java Spring Hacks]({{ site.baseurl }}/java/spring/hacks/).

- [Spring Data JPA reference](https://docs.spring.io/spring-data/jpa/reference/)
