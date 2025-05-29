---
layout: post
title: Java Spring Hacks
description: A POJO is basis of the Spring framework, but also it is basis of Java and the AP CSA exam.
permalink: /java/spring/hacks/
categories: ['Java Spring']
menu: nav/java_spring.html
---

## Hacks
Start work on your own personal blog, using this series as a template.

### AP required.  
Review the lambok annotations (https://projectlombok.org/features/). 

- Write a POJO and show code generated code by lambok.  
  - Name all the Object methods
  - Make a blog of this generated code in context of requirements for the AP exam at the end of Unit 9.

### PBL foundational.  

Establish a POJO, JPA and APIs in your own repository.  You can begin with Jokes and modify to your needs.  

This will be beginnings of and **ideation phase** for your Trimester 1 N@tM final project.  Everyone at the table should have an idea and create a full stack project.  

- Integration of your ideation into common repository will be a different phase.  This is personal ideation.
- Consider this as your final individual PBL test and ideation project.  We expect to be completely finished with this by Oct 21st.
- Planning at table for collaboritive ideation is highly advised.  This project need to be in your team N@tM final.
- Scrum Master coordinating with teacher on building something useful for future Teaching is expected in N@tM final.   If your project(s) gets pulled into nighthawk coders, you will get an 'A"!

#### Make a new POJO
**Alert**, delete /volumes/sqlite.db each time you change schema.  Schema changes are not ugraded automatically as you simply rebuild.

  - Come up with a simple idea to record data updates from User in SQL table
  - Validate creation of SQL table with SQLite Extension, aka SQLite3 Editor
  - Add to blog.

### Make a new API endpoint
An endpoint will require POJO, JPA, and REST controller.  [Test your API using Postman](https://www.geeksforgeeks.org/basics-of-api-testing-using-postman/).  You should be able to test with localhost:8585 using the spring project.

  - Build @RESTController
  - Build custom methods extending JPARepository
  - Save your Postman queries
  - Have queries for GET and PUT operations
  - Add to blog.

### Make a new Frontend page
The frontend page should be simple to test and should have minimal typing.  Just clicking.

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
