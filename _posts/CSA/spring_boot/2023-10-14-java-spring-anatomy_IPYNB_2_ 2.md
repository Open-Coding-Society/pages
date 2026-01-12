---
layout: post
title: Anatomy of a Spring Boot Project
description: A discussion of key elements in a Java Spring Boot backend project.  This includes preparing a project for deployment.
categories: ['Java Spring']
permalink: /java/spring/anatomy
menu: nav/java_spring.html
courses: {'csa': {'week': 4}}
type: coding 
---

## Highlights of a Spring Web Application

This article introduces key considerations in setting up a Java Spring Backend project.

## Overview of files for Spring / Maven / Thymeleaf
>
> Prepare for this review by completing Tools Setup and README instruction to clone and buid.

- `README.md`: This file contains instructions and information about the project. It is a standard component of all properly set up GitHub projects.

- `pom.xml`: This file is the Maven Project Object Model (POM) file. It defines the project configuration, dependencies, build settings, and other metadata required for building and managing the Java project.

- `src/main/java/`: This directory contains your Java source code files, including controllers, services, models, and other backend components of your Spring application.

- `src/main/resources/static/`: This directory is the location for static web resources such as CSS, JavaScript, images, and other assets that will be served directly by the web server without any processing.

- `src/main/resources/templates/`: This directory contains Thymeleaf template files. These are dynamic HTML templates that can be rendered on the server-side and populated with data from your Java code. Thymeleaf provides powerful templating features and allows you to create dynamic web pages with Java integration.

- `application.properties` or `application.yml`: These files contain configuration properties for the Spring application. They can include settings related to the database connection, server port, logging, security, and other application-specific configurations.

- `Main.java`: This Java file contains the main entry point of the Spring application. It is annotated with @SpringBootApplication and includes the main method to start the application.

- `SecurityConfiguration.java`: This Java file is a Java class that typically plays a crucial role in configuring the security aspects of a web application using Spring Security framework. It is responsible for defining security rules, authentication mechanisms, authorization policies, and other security-related configurations.

- `...ApiController.java`: These Java files define the web controllers responsible for handling incoming requests and generating appropriate responses. They typically use annotations like @RestController or @Controller to define the request mapping endpoints.

- `...ServiceImpl.java`: These Java files contain the business logic of the application. They encapsulate complex operations and provide services to the controllers. Service classes are often annotated with @Service.

- `...JpaRepository.java`: These Java files define the data access layer of the application. They interact with the database or other data sources to perform CRUD operations.

Please note that this is a general overview, and the specific file and directory structure can vary as any project progresses or the framework change.

### Main.java

Entry point for Java Spring Application

```java
@SpringBootApplication
public class Main {

    // Starts a spring application as a stand-alone application from the main method
    public static void main(String[] args) {
        SpringApplication.run(Main.class, args);
    }

}
```

### application.properties

Key properties like server.port, secret keys, and database connections are listed in this file.  


```python
server.error.whitelabel.enabled=false
spring.devtools.add-properties=false
logging.level.root=warn

spring.jpa.database-platform=com.nighthawk.spring_portfolio.SQLDialect
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=false
spring.jpa.properties.hibernate.format_sql=false
spring.jpa.open-in-view=false
spring.datasource.url = jdbc:sqlite:volumes/sqlite.db
spring.datasource.driver-class-name = org.sqlite.JDBC
spring.datasource.username = admin
spring.datasource.password = admin

server.port=8085

jwt.secret=nighthawk
```

### pom.xml

All the modules included into the project are listed in this file.  Here you can see some of the dependencies added to make the Java project into Spring Web Application.  As you add features or frameworks you will add to this file.

```pom
<dependencies>
        <!-- Spring -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-validation</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-thymeleaf</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-security</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-devtools</artifactId>
            <scope>runtime</scope>
            <optional>true</optional>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
        </dependency>
        <dependency>
            <groupId>org.thymeleaf</groupId>
            <artifactId>thymeleaf-spring5</artifactId>
            <!-- TODO Remove once available in platform BOM -->
            <version>${org.thymeleaf-version}</version>
        </dependency>
        <dependency>
            <groupId>org.thymeleaf.extras</groupId>
            <artifactId>thymeleaf-extras-springsecurity4</artifactId>
            <!-- TODO Remove version once available in platform BOM -->
            <version>${org.thymeleaf.extras.springsecurity4-version}</version>
        </dependency>
        ...
    </dependencies>
```

### PersonApiController.java

Build APIs requires a lot of [annotations](https://www.geeksforgeeks.org/annotations-in-java/#).  This controller in Module View Control (MVC) establish mechanism to receive and respond to API requests.

```java
@RestController
@RequestMapping("/api/person")
public class PersonApiController {
    //     @Autowired
    // private JwtTokenUtil jwtGen;
    /*
    #### RESTful API ####
    Resource: https://spring.io/guides/gs/rest-service/
    */

    // Autowired enables Control to connect POJO Object through JPA
    @Autowired
    private PersonJpaRepository repository;

    /*
    GET List of People
     */
    @GetMapping("/")
    public ResponseEntity<List<Person>> getPeople() {
        return new ResponseEntity<>( repository.findAllByOrderByNameAsc(), HttpStatus.OK);
    }

    /*
    GET individual Person using ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<Person> getPerson(@PathVariable long id) {
        Optional<Person> optional = repository.findById(id);
        if (optional.isPresent()) {  // Good ID
            Person person = optional.get();  // value from findByID
            return new ResponseEntity<>(person, HttpStatus.OK);  // OK HTTP response: status code, headers, and body
        }
        // Bad ID
        return new ResponseEntity<>(HttpStatus.BAD_REQUEST);       
    }

    /*
    DELETE individual Person using ID
     */
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Person> deletePerson(@PathVariable long id) {
        Optional<Person> optional = repository.findById(id);
        if (optional.isPresent()) {  // Good ID
            Person person = optional.get();  // value from findByID
            repository.deleteById(id);  // value from findByID
            return new ResponseEntity<>(person, HttpStatus.OK);  // OK HTTP response: status code, headers, and body
        }
        // Bad ID
        return new ResponseEntity<>(HttpStatus.BAD_REQUEST); 
    }

    /*
    POST Aa record by Requesting Parameters from URI
     */
    @PostMapping( "/post")
    public ResponseEntity<Object> postPerson(@RequestParam String email,
                                             @RequestParam String password,
                                             @RequestParam String name,
                                             @RequestParam("dob") String dobString) {
        Date dob;
        try {
            dob = new SimpleDateFormat("MM-dd-yyyy").parse(dobString);
        } catch (Exception e) {
            return new ResponseEntity<>(dobString +" error; try MM-dd-yyyy", HttpStatus.BAD_REQUEST);
        }
        // A person object WITHOUT ID will create a new record with default roles as student
        Person person = new Person(email, password, name, dob);
        repository.save(person);
        return new ResponseEntity<>(email +" is created successfully", HttpStatus.CREATED);
    }

    // ... //

}

```


## Deployment Files
>
> In addition to Java / Spring.   It is always a requirement to consider deployment.  Be sure your docker files are created modifying the templates below to fit you needs.


```python
# Dockerfile
FROM openjdk:18-alpine3.13
WORKDIR /app
RUN apk update && apk upgrade && \
    apk add --no-cache git 
COPY . /app
RUN ./mvnw package
CMD ["java", "-jar", "target/spring-0.0.1-SNAPSHOT.jar"]
EXPOSE 8085
```


```python
# docker-compose.yml
version: '3'
services:
        web:
                image: java_springv1 # Change the image name to something unique to your project, aka my_unique_name_v1
                build: .
                ports:
                        - "8---:8585" # Edit the number on the left to match the port you selected 
                volumes:
                        - ./volumes:/volumes
                restart: unless-stopped
```

## Hacks

Start your own Spring Project: 
<a href="https://github.com/Open-Coding-Society/spring" target="_blank">https://github.com/Open-Coding-Society/spring</a>
