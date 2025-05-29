---
layout: post
title: Introduction Java Spring Framework
description: Introduction to API, JPA, ORM, POJOs in Java Spring Framework
categories: [Java Spring]
permalink: /java/spring/intro/
menu: nav/java_spring.html
---

## Introduction

APIs build programmatic interactions between applications, people, and businesses.  They are designed around sharing data and executing pre-defined processes.  Spring Boot and Spring Data JPA reduce time for development; developers implement POJOs and JPA access layers; Spring hanldes the rest.  

An API allows you to request and receive data from the system. A POJO is the foundation for making an Entity that is turned into a Database.  The Java Persistent API (JPA) allows the database to be queried and updated.    

The subject of this article is Jokes, likes (haha)  and dislike (boohoo).   User clicks haha or boohoo and updates counters.

[Runtime](https://pages.opencodingsociety.com/java/spring/jokes)

[Back-end Java Spring Files](https://github.com/open-coding-society/spring_2025/tree/master/src/main/java/com/nighthawk/spring_portfolio/mvc/jokes)
- Jokes.java - contains POJO which defines Model
- JokesApiControler.java - contains APIs and Control, which respond to View actions
- JokesJpaRepository.java - contains CRUD and data acess queries

### Visual Overview

```
 Spring API and ORM
  ------------------
    +-------------------+
    |   API Controller  |-- Developer defines Request Mappings
    |     Request       |----- @PathVariable are received
    |     JPA call      |----- @Autowired method is called
    |     Respone       |----- ResponseEntity<> wraps data from JPA (ie JSON)
    +-------------------+
       |
       | JPA Methods
       v
    +-----------------+
    |  JPA            |-- Developer defines Database Queries
    |   Java          | ----- a.) JPA built in (long names)
    |   Persistent    | ----- b.) SQL native queries
    |   API           | 
    +-----------------+
       |
       | Database Access Methods
       v
    +-----------------+
    |  ORM            | -- Spring layers supporting Database Framework
    |   Object        | ----- Behind the scene managing tables
    |   Relational    |  ----- Behind the scene database construction
    |   Model         |
    +-----------------+
       |
       | Entities Definition
       v
    +-----------------+
    |  Database/POJOs | -- Developer defines each Class
    |    Plain        | ----- Define attributes in Table
    |    Old Java     | ----- Define relationships in Database
    |    Objects      | 
    +-----------------+
```
