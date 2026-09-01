---
layout: post
assignment: true
title: Java Spring Hacks - Sprint 1 Final
description: A POJO is basis of the Spring framework, but also it is basis of Java and the AP CSA exam.
permalink: /java/spring/hacks/
courses: {'csa': {'week': 4}}
categories: ['Java Spring']
---

## Hacks

Start work on your own personal blog, using this series as a template.  Make sure this work makes it into your portfolio.

<table>
    <tr>
        <td><a href="{{site.baseurl}}/java/spring/intro">Intro</a></td>
        <td><a href="{{site.baseurl}}/java/spring/anatomy">Anatomy</a></td>
        <td><a href="{{site.baseurl}}/java/spring/jokes">Jokes</a></td>
        <td><a href="{{site.baseurl}}/java/spring/ui">UI</a></td>
        <td><a href="{{site.baseurl}}/java/spring/api">API</a></td>
        <td><a href="{{site.baseurl}}/java/spring/jpa">JPA</a></td>
        <td><a href="{{site.baseurl}}/java/spring/pojo">POJO</a></td>
    </tr>
</table>

### CSA AP Classes and Methods versus POJO

Review the lambok annotations (https://projectlombok.org/features/).

- Write a POJO and show code generated code by lambok.  
  - Name all the Object methods
  - Make a blog of this generated code in context of requirements for the AP exam with regards to classes and methods.

### PBL foundational

Establish a POJO, JPA and APIs in your own Spring repository, use Spring as a Template.  You can begin with Jokes and modify to your needs.  

This will be beginnings of and **ideation phase** for your Trimester 1 N@tM final project.  Everyone at the table should have an idea and create a full stack project.  

- This is personal ideation.
- Consider this as your final, an individual understanding of Spring Boot and a PBL review of your ideation project.
- Planning at table for collaboritive ideation is required.  This project needs to be part of your team N@tM final.
- Scrum Master coordinating with teacher on building something useful for OCS is expected in N@tM final.   If your project(s) gets pulled into OCS and remains persistent, you will get an 'A"!

#### Make a new POJO

Your ideation project will use SQLite db.  We will devise a strategy to allow you to deploy a backend spring repo that works with your individual blog.

**Alert**, delete /volumes/sqlite.db each time you change schema.  Schema changes are not ugraded automatically as you simply rebuild.

- Come up with a simple idea to record data updates from User in SQL table, this will require relational data think.
- Validate creation of SQL table with SQLite Extension, aka SQLite3 Editor
- Add accomplishments and usage to a blog.

### Make a new API endpoint

An endpoint will require POJO, JPA, and REST controller.  [Test your API using Postman](https://www.geeksforgeeks.org/basics-of-api-testing-using-postman/).  You should be able to test with localhost:8585 using the spring project.

- Build @RESTController
- Build custom methods extending JPARepository
- Save your Postman queries
- Have queries for GET and PUT operations
- Add to blog.

### Make a new Frontend page

The frontend page should be simple to test and should have minimal typing.  Just clicking is advised.  We will divise a strategy where your portfolio frontend works with the team deployed Spring and SQLite DB.

- Use definitions like config.js to allow easy migration from frontend to backend
- Be sure to have both Read and Put operations
- Add to blog.


### Resources, recommended by ChatGPT

1. [Spring Framework Documentation](https://spring.io/projects/spring-framework)
  The official Spring Framework documentation is entirely free to access. It provides comprehensive information on various Spring modules, including Spring Boot and Spring Data JPA.

2. [Baeldung Spring Boot Tutorials](https://www.baeldung.com/spring-boot)
  Baeldung: Baeldung offers a mix of free and paid content. While some articles may require a subscription, many tutorials and guides on Spring Boot and Spring Data JPA are available for free.

3. [Baeldung Spring Boot Tutorials](https://www.baeldung.com/spring-boot)
  Spring Guides: The Spring Guides are completely free and provide step-by-step tutorials on various aspects of Spring development, including Spring Boot and Spring Data JPA.

4. [Spring Guides](https://spring.io/guides)
Java Brains YouTube Channel: The Java Brains YouTube channel offers free video tutorials on Java and Spring frameworks, including dedicated playlists for Spring Boot and Spring Data JPA.

5 Java Brains YouTube Channe
  Spring Data JPA Reference Documentation: The Spring Data JPA reference documentation is freely available online and provides in-depth insights into Spring Data JPA features.

- [Java Brains Spring Boot Playlist](https://www.youtube.com/playlist?list=PLqq-6Pq4lTTZSKAFG6aCDVDP86Qx4lNas)
- [Java Brains Spring Data JPA Playlist](https://www.youtube.com/playlist?list=PLqq-6Pq4lTTZSKAFG6aCDVDP86Qx4lNas)

[Spring Data JPA Reference Documentation](https://docs.spring.io/spring-data/jpa/docs/current/reference/html/#reference)
  The Spring Data JPA reference documentation is freely available online and provides in-depth insights into Spring Data JPA features.
