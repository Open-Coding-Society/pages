---
layout: post
title: Java Persistent API (JPA)
description: Define the JPA layer.  The JPA enables frontend to query backend and returns a list.
permalink: /java/spring/jpa/
categories: ['Java Spring']
menu: nav/java_spring.html
---

## Java Persistence API (JPA)

> JPA (Java Persistence API) is a specification for accessing, persisting, and managing data between Java objects and a relational database.

- **Persistence**: Refers to the capability of an object to be stored in a database and retrieved later.
- **API**: Provides methods to perform operations such as storing, retrieving, updating, and deleting objects from the database.

JPA simplifies database programming by allowing developers to work with Java objects rather than SQL statements. It abstracts the database interactions and provides a standardized way to manage relational data in Java applications.

![]({{ site.baseurl }}/images/jpa-lesson-images/jpa.jpg)

### JokesJpaRepository Example

The `JokesJpaRepository` interface extends the `JpaRepository`. This allows the developer to access JPA predefined methods as well as enable the developer to create custom interfaces on persistent storage.

JPA extracts many layers of complexity (hibernate, ORM) from the developer and provides built-in and extensible ways to interact with the database through objects.

- **Built-in Methods**: Provided by `JpaRepository` to cover common CRUD operations and more.
- **Derived Queries**: Simplify the process of writing database queries by using method naming conventions.
- **JPQL Queries**: Provide more flexibility than derived queries and are based on entities and attributes.
- **Native Queries**: Allow the execution of raw SQL queries, providing more control and flexibility.

```java
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

/** 
 * JPA is an object-relational mapping (ORM) to persistent data.
 * Originally, it was used for relational databases (SQL). 
 * Now, JPA implementations have been extended for NoSQL.
 */
public interface JokesJpaRepository extends JpaRepository<Jokes, Long> {
    // JPA has many built-in methods.

    // The below methods have been prototyped to extend built-ins

    // Save method for a Jokes object.
    // Used for Create and Update operations in CRUD.
    void save(Jokes joke);  

    // Accessors, Read operations in CRUD.
    // Returns a List of Jokes in ascending order.
    List<Jokes> findAllByOrderByJokeAsc();  
    
    // Checks if a joke exists, ignoring case.
    List<Jokes> findByJokeIgnoreCase(String joke);  
}
```

#### JPA Repository Interface
Observe the generic data type in the `JpaRepository` definition: `public interface JokesJpaRepository extends JpaRepository<Jokes, Long>`.

- `Jokes`, the first entity, is the name of the POJO.
- `Long` is the data type of the ID found in the POJO's definition.



## Built-in Methods in JpaRepository

The JpaRepository interface provides several built-in methods that cover common CRUD operations and more. Here are some of the most commonly used built-in methods:

### Save and Update

```java
Jokes joke = new Jokes();
joke.setJoke("Why did the chicken cross the road?");
// Saves a given entity. Use this method for both creating and updating records. 
jokesJpaRepository.save(joke);
```

### Find by ID

```java
// Retrieves an entity by its ID.
Optional<Jokes> joke = jokesJpaRepository.findById(1L);
```

### Retrieve all

```java
List<Jokes> allJokes = jokesJpaRepository.findAll();
```

#### JPA Methods Return a List
> `List` is a super class to `ArrayList`. In this JPA code, you can see that a `List` of `Jokes` is the result from these JPA derived query accessor methods. JPA is extracting data from persistent storage.

- Review [List and ArrayList from GeeksForGeeks](https://www.geeksforgeeks.org/difference-between-list-and-arraylist-in-java/) to understand their relationship.


### Delete by ID

```java
jokesJpaRepository.deleteById(1L);
```

### Count 

```java
long count = jokesJpaRepository.count();
```

### Exists

```java
boolean exists = jokesJpaRepository.existsById(1L);
```



## Derived Queries

Derived queries are simple methods such as `findBy`, `readBy`, `getBy`, etc. Spring Data translates these derived queries into JPQL (Java Persistence Query Language) queries, which are then translated into SQL, making things easier for you.

`findBy<Attribute>` finds the column in the table that is associated with the `Attribute`.

- `findByJoke` will look for the `joke` attribute in the table.
- `private String joke` is the definition of the attribute in the POJO.

Note that SQL tables and Java naming conventions are mapped for compatibility with SQL. For example, `chatMessage` in Java class will become `chat_message` in the SQL table.

![Column Name Mapping]({{ site.baseurl }}/images/jpa-lesson-images/columnName.jpg)

## JPQL Query

JPQL (Java Persistence Query Language) provides a query language that looks similar to SQL. One important thing to note is that JPQL is based on entities, so JPQL queries are based on classes and attributes. JPQL queries are not based on the database tables, which makes it different from SQL. JPA implementations like Hibernate translate the JPQL query into SQL to work with the database.

### Entity

```java
@Entity
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String firstName;
    private String lastName;
    private String email;

    // Getters and setters
}
```

### JPQL Sample

```java
@Query("SELECT u FROM User u WHERE u.lastName = ?1")
List<User> findByLastNameQuery(String lastName);
```

#### JPQL Sample description

Use the `@Query` annotation, and then define the query in JPQL.

- This is a SELECT statement from the User entity.
- The u works like an alias in SQL, representing the User entity.
- The ?1 is a parameter placeholder for the lastName parameter from the method

Here is an interace with two paramters.

```java
@Query("SELECT u FROM User u WHERE u.lastName = ?1 AND u.firstName = ?2")
List<User> findByName(String lastName, String firstName);
```

Since this is based on the entity, the query follows the camelCase of POJO definitions

## Native Queries

While JPQL provides more flexibility than derived queries, it doesn't have all of the features of SQL. Native queries allow the programmer to execute SQL queries directly.

```java
@Query(
    value = "SELECT * FROM user WHERE last_name = ?1 AND first_name = ?2",
    nativeQuery = true
)
List<User> findByNameNative(String lastName, String firstName);
```

Native Query Description
- Annotation: Use the @Query annotation with the nativeQuery attribute set to true to define a native SQL query.
- SQL Query: The query is written in SQL and follows the snake_case conventions of SQL table and column names.
- Parameters: The ?1 and ?2 placeholders correspond to the lastName and firstName parameters from the method.

This query retrieves a list of User entities where the last_name and first_name columns match the provided parameters.
