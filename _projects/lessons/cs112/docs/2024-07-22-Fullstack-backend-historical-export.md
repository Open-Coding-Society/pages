---
layout: post
title: Backend Fullstack Development
description: Guide to the backend development of you're feature
permalink: /fullstack/java/backend
menu: nav/fullstack_java.html
toc: True
comments: True
author: Finn Carpenter
lesson_group: "cs112"
articulation: {"institution":"MiraCosta College","course":"CS112"}
categories: []
---

## How do API work?
> Five standard parts
- Every Spring feature in our backend has the same five parts, named after the feature
- The announcement package (`src/main/java/com/open/spring/mvc/announcement`) is the smallest complete example, so this lesson copies it

| Part | Announcement class | What it does |
|---|---|---|
| Entity | `AnnouncementEntity` | The data object; one object is one row in the table |
| JPA repository | `AnnouncementJpaRepository` | Reads and writes the table; Spring writes the SQL from method names |
| Service | `AnnouncementService` | The rules of your feature; the only class that uses the repository |
| REST controller | `AnnouncementApiRestController` | Turns HTTP requests into service calls and results into responses |
| Table initializer | `AnnouncementTableInitializer` | Creates the table if it is missing |

- The full guide is [announcement-architecture.md](https://github.com/Open-Coding-Society/spring/blob/master/docs/announcement-architecture.md) in the Spring repo

### Why do we use API's
> These are the two main reason behind why we use them in this class
1. Stores Data that is independent of the computer/frontend (Security, Ease of Accesses)
2. Enables lazier coding (the data used from the API can be used to auto-generate HTML)

### Accessing API's using fetch
> [Article](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)
- They are accessed by fetching a specific URL in the fetch() method
- This method allows us to send list of headers with information we want the API to know
    - GET, DELETE, POST, PUT (methods used in the controller file)
    - Body (sending json data)
    - CORS
    - Cookies
    - Content Type
    - [The rest of them](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers) (still very important things to know)



## Step 1
> File Management
- Create your features folder name in `src/main/java/com/open/spring/mvc` (for me it is announcement)
- Locate the announcement folder, copy and rename to what your feature name is
- Copy all five files and rename each one to your feature, keeping the ending: `AnnouncementEntity.java` becomes `YourFeatureEntity.java`, and the same for `JpaRepository`, `Service`, `ApiRestController` and `TableInitializer`
- Make sure to match the class name with the file name, change any other appearances of the former files name

## Step 2
> Entity File
- Change AnnouncementEntity.java to your features name + Entity.java
- Rename each instance of the word **Announcement** to your feature's name use ctrl+f
- The annotations above the class tell Spring this object is a row in a table, and name the table

<br>

```java
@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity(name = "Announcement")
@Table(name = "announcement")
public class AnnouncementEntity {
```

### Step 2.1
> Column Variables
- There are a few variables at the beginning of the class
- Keep ID, but change to what your feature needs on the other variables

<br>

```java
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @Column(unique=false)
    //These variables
    private String author;
    private String title;
    private String body;
    private String timestamp;
    private String tags;
```

### Step 2.2
> Constructor Method
- This is the method that creates the objects that store your data
- Create something similar to this but with your variables
- You are passing through data for each column

<br>

```java
    // Constructor with necessary fields
    public AnnouncementEntity(String author, String title, String body, String tags) {
        this.author = author;
        this.title = title;
        this.body = body;
        this.tags = tags;
        this.timestamp = LocalDateTime.now().format(formatter);
    }
```

### Step 2.3
> Init Method + Initial Data
- The innit method is ran at the beginning of the backend
- The method is what populates your table with data
- I only have it returning the data from init
- Why have two methods?
    - if you need to manipulate the array more you can
    - other processes need to run before your for your API
    - nicer to look at too, abstraction helps readability 

<br>

```java
    // Static method to create initial data
    public static List<AnnouncementEntity> createInitialData() {
        List<AnnouncementEntity> announcements = new ArrayList<>();

        // Create announcements with formatted timestamp
        announcements.add(new AnnouncementEntity("Finn", "Test of innit", "Don't mind this message", "welcome"));

        return announcements;
    }

    // Static method to initialize the data
    public static List<AnnouncementEntity> init() {
        return createInitialData();
    }
```

## Step 3
> JPA Repository file
- JPA stands for Java Persistence API
- Name it your feature + JpaRepository.java
- This file helps with specif query methods of your database
- For example if you wanted to create method for getting posts only based on an author, this file creates them


### Step 3.1
> Copy + Paste
- Replace the names with your project and data type names
- Super simple just use the same method name formatting 
- The compiler will make the methods for you
- This code segment is you're whole file

<br>

```java
package com.open.spring.mvc.announcement;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List; 

@Repository
public interface AnnouncementJpaRepository extends JpaRepository<AnnouncementEntity, Long> {
    AnnouncementEntity findByAuthor(String author); // Method to find announcement by author

    List<AnnouncementEntity> findByTags(String tags); // Example method to find announcements by tags

    AnnouncementEntity findByTitle(String title); // Example method to find announcements by title

    List<AnnouncementEntity> findAllByOrderByTimestampDesc();
}

```



## Step 4
> Service File
- Name it your feature + Service.java
- The service holds the rules of your feature: what happens when someone creates, reads, edits or deletes
- It is the only class that uses the repository, so the controller never talks to the database directly
- `@Service` lets Spring hand it the repository through the constructor

<br>

```java
@Service
public class AnnouncementService {

    private final AnnouncementJpaRepository repository;

    public AnnouncementService(AnnouncementJpaRepository repository) {
        this.repository = repository;
    }

    // Saves a new announcement stamped with the current time
    public AnnouncementEntity create(String author, String title, String body, String tags) {
        return repository.save(new AnnouncementEntity(author, title, body, tags));
    }

    // Replaces the body of the announcement with this title
    public AnnouncementEntity editBody(String title, String body) {
        AnnouncementEntity announcement = repository.findByTitle(title);
        announcement.setBody(body);
        repository.save(announcement);
        return announcement;
    }
}
```

## Step 5
> Controller File
- Use the announcement controller file, copy and rename all parts to your API's name similar to the first step
- This file is how you will manipulate your data from outside the local system
- This is done through [fetching](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch) different URLs with data embedded in the HTTP request
- Each controller file should have a base path that is different from the rest of the other API's
- Looking above the class you should see this 

<br>

```java
@RestController
@RequestMapping("/api/announcements")
```

### Step 5.1
> Basic Methods (do not copy use as example)
- All we are doing is just assigning certain methods to URLs, that will do CRUD processes
- CRUD stands for Create Read Update Delete, and you want each kind 
- Create -> POST, Read -> GET, Update -> PUT, Delete -> DELETE
- Use CHATGPT to help with creation

<br>

```java
    // Create Example
    @PostMapping("/create") 
    public ResponseEntity<Announcement> createAnnouncement( @RequestParam String author, @RequestParam String title, @RequestParam String body, @RequestParam String tags) {
        
        Announcement newAnnouncement = new Announcement(author, title, body, tags);
        Announcement savedAnnouncement = announcementRepo.save(newAnnouncement);
        
        return new ResponseEntity<>(savedAnnouncement, HttpStatus.CREATED);
    }

    // Read Example
    @GetMapping 
    public ResponseEntity<List<Announcement>> getAllAnnouncements() {
        List<Announcement> announcements = announcementRepo.findAll();
        return new ResponseEntity<>(announcements, HttpStatus.OK);
    }

    // Update Example
    @PutMapping("/edit/{title}")
    public ResponseEntity<Announcement> editAnnouncement(@PathVariable String title, @RequestBody String body) {
        Announcement announcement = announcementRepo.findByTitle(title);
        announcement.setBody(body);
        announcementRepo.save(announcement);
        return new ResponseEntity<>(announcement, HttpStatus.OK);
    }

    // Delete Example
    @DeleteMapping("/{id}")
    public ResponseEntity<HttpStatus> deleteAnnouncement(@PathVariable Long id) {
        try {
            announcementRepo.deleteById(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
```

### Detailed Breakdown
> What each part of the controller means and does
- Breaking down the update method

<br>

```java
    // What each part of the method does
    // Response Entity is used instead because they can send extra data upon the request back
    //

    //Determines the Mapping POST GET PUT DELETE 
    @PutMapping("/edit/{title}")
    public ResponseEntity<Announcement> editAnnouncement(@PathVariable String title, @RequestBody String body)
    //     Data Type Returned                             Parameters needed for the method
    {
        // Getting the announcement from the database
        Announcement announcement = announcementRepo.findByTitle(title);
        //Setting the new information into the announcement
        announcement.setBody(body);
        //Saving into the database
        announcementRepo.save(announcement);
        // Returning the announcement, and the HTTP status, whether it worked or not
        return new ResponseEntity<>(announcement, HttpStatus.OK);
    }
```

### Step 5.2
> Custom methods using JPA
- Sometimes you want to create specific query methods for your 
- Example of fetching by author and tags
- The methods findByAuthor(), and findByTags() are made by the JPA not me

<br>

```java
@GetMapping("/author/{author}")
    public ResponseEntity<Announcement> getAnnouncementByAuthor(@PathVariable String author) {
        Announcement announcement = announcementRepo.findByAuthor(author);
        if (announcement != null) {
            return new ResponseEntity<>(announcement, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

@GetMapping("/tags/{tags}")
public ResponseEntity<List<Announcement>> getAnnouncementsByTags(@PathVariable String tags) {
    List<Announcement> announcements = announcementRepo.findByTags(tags);
    return new ResponseEntity<>(announcements, HttpStatus.OK);
}
```

## Further Questions
> Please use the comments below to suggest things to be added
- Come to office hours if further help is needed
- So we may add to this notebook

