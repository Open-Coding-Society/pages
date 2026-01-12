---
layout: post
title: Backend Fullstack Development
description: Guide to the backend development of you're feature
permalink: /fullstack/java/backend
menu: nav/fullstack_java.html
toc: True
comments: True
author: Finn Carpenter
---

## How do API work?
> Three main components
1. Constructor.java (makes the data object), usually the name of feature + .java
2. Controller file, how data in the table is received/changed through links 
3. JPA (Java Persistence API) file, for the creation of certain methods for the controller file

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
- Create your features folder name in `src/main/java/com/nighthawk/spring_portfolio/mvc` (for me it is announcement)
- Locate the announcement folder, copy and rename to what your feature name is
- Copy and rename file to your feature, make sure to match the class name with the file name, change any other appearances of the former files name

## Step 2
> Constructor File
- Change Announcement.java to your features name
- Rename each instance of the word **Announcement** to your feature's name use ctrl+f

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
    public Announcement(String author, String title, String body, String tags) {
        this.author = author;
        this.title = title;
        this.body = body;
        this.tags = tags;
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
    public static List<Announcement> createInitialData() {
        List<Announcement> announcements = new ArrayList<>();

        // Create announcements with formatted timestamp
        announcements.add(new Announcement("Finn", "Test of innit", "Don't mind this message", "welcome"));

        return announcements;
    }

    // Static method to initialize the data
    public static List<Announcement> init() {
        return createInitialData();
    }
```

## Step 3
> JPA file
- JPA stands for Java Persistence API
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
package com.nighthawk.spring_portfolio.mvc.announcement;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List; 

@Repository
public interface AnnouncementJPA extends JpaRepository<Announcement, Long> {
    Announcement findByAuthor(String author); // Method to find announcement by author

    List<Announcement> findByTags(String tags); // Example method to find announcements by tags

    Announcement findByTitle(String title); // Example method to find announcements by title

    List<Announcement> findAllByOrderByTimestampDesc();
}

```



## Step 4
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

### Step 4.1
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

### Step 4.2
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

