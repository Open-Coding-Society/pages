---
layout: post
title: Frontend Fullstack Development
description: Guide to the backend development of you're feature
permalink: /fullstack/java/frontend
menu: nav/fullstack_java.html
toc: True
comments: True
author: Finn Carpenter
---

## Your projects work for you
> Don't be a static coder
- When it comes to frontend you want to put in the least amount of work into it
- While it creates most of HTML for you
- Why? You're feature will be changing all time from outside data, so if it's hard coded you will have to change it by hand
- So instead of changing all the time, use auto generation

## What code should be static?
> only exceptions to that rule above
- Things that should be static are the things that will never change
- Quick Reference: Side Bar, Sub Menu, Help Information, The DIVs that will be filled by you're data

## How do I begin with Frontend?
> Where to start
- Start with a sketch, or reference
- For my project I chose to reference [Twitter's Tweet](https://www.ledgerinsights.com/wp-content/uploads/2021/03/first-tweet-810x476.jpg)
- If you don't know how a certain element is made ask CHAT GPT, I had to for how to format the timestamp
- From this I was able to get the this as bare bones

<br>

```HTML
<div class="Abox">
  <div id="ann">
    <div class="announcement-header">
      <h1 class="announcement-title">Hello</h1>
      <div class="announcement-meta">
        <span class="announcement-author">Author: Finn Carpenter</span><br>
        <span class="announcement-timestamp">Timestamp: 11:00pm</span>
      </div>
    </div>
    <p class="announcement-body">Hey whats up</p>
    <div class="announcement-tags">
      <span class="tag">first</span>
    </div>
  </div>
</div>
```

## Result
<style>
.Abox {
    border: 1px solid white;
    padding: 20px;
    background-color: rgba(255, 255, 255, 0.1);
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    margin: 20px;
    color: white;
  }

  #ann {
    border: 1px solid white;
    padding: 20px;
    background-color: rgba(255, 255, 255, 0.1);
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    margin: 20px;
    color: white;
  }

  .announcement-header {
    margin-bottom: 10px;
  }

  .announcement-title {
    margin: 0;
    font-size: 24px;
  }

  .announcement-meta {
    font-size: 14px;
    margin-top: 5px;
    color: rgba(255, 255, 255, 0.7);
  }

  .announcement-body {
    font-size: 16px;
    margin: 10px 0;
  }

  .announcement-tags {
    margin-top: 10px;
  }

  .tag {
    display: inline-block;
    background-color: rgba(255, 255, 255, 0.3);
    color: white;
    padding: 5px 10px;
    margin-right: 5px;
    border-radius: 4px;
    font-size: 14px;
  }
</style>

<div class="Abox">
<div id="ann">
  <div class="announcement-header">
    <h1 class="announcement-title">Hello</h1>
    <div class="announcement-meta">
      <span class="announcement-author">Author: Finn Carpenter</span><br>
      <span class="announcement-timestamp">Timestamp: 11:00pm</span>
    </div>
  </div>
  <p class="announcement-body">Hey whats up</p>
  <div class="announcement-tags">
    <span class="tag">first</span>
  </div>
</div>
</div>


## HTML Auto-Generation
> Coding less == more
- Your aim for projects is to make the least amount of static HTML in your projects
- 75% of your feature should be created using data fetched from API's
- To show you a example, I show you all the code behind displaying my announcements
- What does the announcement variable look like?

<br>


```python
var announcement = `
      <div id="ann">
        <div class="announcement-header">
          <h1 class="announcement-title">${title}</h1>
          <div class="announcement-meta">
            <span class="announcement-author">Author: ${author}</span><br>
            <span class="announcement-timestamp">Timestamp: ${timestamp}</span>
          </div>
        </div>
        <p class="announcement-body">${body}</p>
        <div class="announcement-tags">
          ${tagElements} <!-- Insert the tags here -->
        </div>
      </div>
`;
```

## JS Auto-Generation method
- Create a method that puts data from an object inside that html
- This method is custom to every feature
- The message data is meant to replicate a GET response

<br>


```python
%%html
<script>
  message = {
    "title": "Welcome",
    "author": "Finn",
    "tags": ["welcome"],
    "timestamp": "2021-09-01",
    "body": "Welcome to the new website! "
  }

  function createAnnouncement(title, author, tags, timestamp, body) {
    var location = document.querySelector(".Abox:last-of-type"); // Correctly target an element
  
    // Check if tags is an array; if not, convert it into an array
    if (typeof tags === 'string') {
      tags = [tags]; // Convert string to array
    } else if (!Array.isArray(tags)) {
      tags = []; // Default to empty array if tags is not an array
    }
  
    var tagElements = tags.map(tag => `<span class="tag">${tag}</span>`).join(''); // Create tag elements
  
    var announcement = `
      <div id="ann">
        <div class="announcement-header">
          <h1 class="announcement-title">${title}</h1>
          <div class="announcement-meta">
            <span class="announcement-author">Author: ${author}</span><br>
            <span class="announcement-timestamp">Timestamp: ${timestamp}</span>
          </div>
        </div>
        <p class="announcement-body">${body}</p>
        <div class="announcement-tags">
          ${tagElements} <!-- Insert the tags here -->
        </div>
      </div>
    `;
  
    location.insertAdjacentHTML('beforeend', announcement); // Use insertAdjacentHTML to add the announcement
  }
  
  createAnnouncement(message.title, message.author, message.tags, message.timestamp, message.body);
</script>

<div class="Abox">Will only show in notebook</div>
```


<script>
  message = {
    "title": "Welcome",
    "author": "Finn",
    "tags": ["welcome"],
    "timestamp": "2021-09-01",
    "body": "Welcome to the new website! "
  }

  function createAnnouncement(title, author, tags, timestamp, body) {
    var location = document.querySelector(".Abox:last-of-type"); // Correctly target an element

    // Check if tags is an array; if not, convert it into an array
    if (typeof tags === 'string') {
      tags = [tags]; // Convert string to array
    } else if (!Array.isArray(tags)) {
      tags = []; // Default to empty array if tags is not an array
    }

    var tagElements = tags.map(tag => `<span class="tag">${tag}</span>`).join(''); // Create tag elements

    var announcement = `
      <div id="ann">
        <div class="announcement-header">
          <h1 class="announcement-title">${title}</h1>
          <div class="announcement-meta">
            <span class="announcement-author">Author: ${author}</span><br>
            <span class="announcement-timestamp">Timestamp: ${timestamp}</span>
          </div>
        </div>
        <p class="announcement-body">${body}</p>
        <div class="announcement-tags">
          ${tagElements} <!-- Insert the tags here -->
        </div>
      </div>
    `;

    location.insertAdjacentHTML('beforeend', announcement); // Use insertAdjacentHTML to add the announcement
  }

  createAnnouncement(message.title, message.author, message.tags, message.timestamp, message.body);
</script>

<div class="Abox">Will only show in notebook</div>



## How to Fetch
> Replacing message var with a fetch
- What is this codeblock mean?
- This fetch is getting all the message objects from the database
- we have to first parse through the object array, getting specific objects in order
- then we are parse the object attributes and create the element with that data

<br>

```javascript
function generateAnnouncements() {
  var location = document.getElementById("read");
  location.innerHTML = ""; // Clear the contents of the announcements div
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  var requestOptions = {
    method: 'GET',
    headers: myHeaders,
    credentials: 'include',
    redirect: 'follow'
  };
    
  fetch("http://localhost:8585/api/announcements", requestOptions)
    .then(response => response.json())
    .then(result => {
      result.reverse(); // Reverse the order of announcements
      console.log(result);
      for (let i = 0; i < result.length; i++) { // Change to '<'
        var message = result[i];
        createAnnouncement(message.title, message.author, message.tags, message.timestamp, message.body);
      }
    })
    .catch(error => console.log('error', error));
}
```

## Menu creation
> Create menu
- Will obviously be different for different features
- I prompted the user for the creation, and depending on how you make your endpoint the sending of data might be different
- Another option, use input elements in html that the user fills out instead of prompt

<br>

```JS
function createReq() {
  const author = prompt("Enter the author's name:");
  const body = prompt("Enter the body of the announcement:");
  const tags = prompt("Enter the tags for the announcement (comma separated):");
  const title = prompt("Enter the title of the announcement:");

  if (author && body && tags && title) {
    const url = `http://localhost:8585/api/announcements/create?author=${encodeURIComponent(author)}&body=${encodeURIComponent(body)}&tags=${encodeURIComponent(tags)}&title=${encodeURIComponent(title)}`;

    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(response => response.json())
    .then(data => {
      console.log('Announcement created:', data);
      alert('Announcement created successfully!');
    })
    .catch(error => {
      console.error('Error creating announcement:', error);
      alert('Failed to create announcement.');
    });
  } else {
    alert('All fields are required!');
  }
}
```

## Same thing with input fields instead

<br>

### HTML that corresponds

```HTML
    <label>Author: </label><input id="author">
    <label>Body: </label><input id="body">
    <label>Tags: </label><input id="tags">
    <label>Title: </label><input id="title">
```

<br>

## New JS

```JS
function createReq() {
  const author = document.getElementByID("author");
  const body = document.getElementByID("body");
  const tags = document.getElementByID("tags");
  const title = document.getElementByID("title");

  if (author && body && tags && title) {
    const url = `http://localhost:8585/api/announcements/create?author=${encodeURIComponent(author)}&body=${encodeURIComponent(body)}&tags=${encodeURIComponent(tags)}&title=${encodeURIComponent(title)}`;

    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(response => response.json())
    .then(data => {
      console.log('Announcement created:', data);
      alert('Announcement created successfully!');
    })
    .catch(error => {
      console.error('Error creating announcement:', error);
      alert('Failed to create announcement.');
    });
  } else {
    alert('All fields are required!');
  }
}
```


## Hacks
> You can do this with the knowledge you just learned
- Make Update Method interface for your feature
- Make Delete Method interface for your feature
