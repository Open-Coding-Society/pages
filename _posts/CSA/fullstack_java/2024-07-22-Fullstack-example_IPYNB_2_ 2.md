---
layout: post
title: Example Fullstack Feature
description: Guide to the backend development of you're feature
permalink: /fullstack/java/example
menu: nav/fullstack_java.html
toc: True
comments: True
author: Finn Carpenter
---

## CRUD Table
> Must use local backend to test

<table>
<thead>
  <tr>
    <th>Create</th>
    <th>Read</th>
    <th>Update</th>
    <th>Delete</th>
  </tr>
</thead>
<tbody>
  <tr>
    <td><button onclick="createReq()">Create</button></td>
    <td><button onclick="generateAnnouncements()">Read</button></td>
    <td><button onclick="updateReq()">Update</button></td>
    <td><button onclick="deleteReq()">Delete</button></td>
  </tr>
</tbody>
</table>


## Announcements

<div class="Abox" id="read"></div>

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

<script>
if (location.hostname === "localhost") {
        uri = "http://localhost:8585";
} else if (location.hostname === "127.0.0.1") {
        uri = "http://127.0.0.1:8585";
} else {
        uri = "https://spring.opencodingsociety.com";
}

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
    
  fetch(uri + "/api/announcements", requestOptions)
    .then(response => response.json())
    .then(result => {
      result.reverse(); // Reverse the order of announcements
      console.log(result);
      for (let i = 0; i < result.length; i++) { // Change to '<'
        var a = result[i];
        createAnnouncement(a.title, a.author, a.tags, a.timestamp, a.body);
      }
    })
    .catch(error => console.log('error', error));
}

function createAnnouncement(title, author, tags, timestamp, body) {
  var location = document.getElementById("read"); // Correctly target an element 

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

function deleteReq() {
  const title = prompt("Enter the title of the announcement: ");

  const requestOptions = {
    method: "POST",
    redirect: "follow"
  };

  fetch(uri + `/api/announcements/delete/${title}`, requestOptions)
    .then((response) => response.text())
    .then(data => {
      console.log('Announcement deleted success:', data);
      alert('Announcement deleted successfully!');
    })
    .catch(error => {
      console.error('Error deleting announcement:', error);
      alert('Failed to delete announcement.');
    });
}

function updateReq() {
  const title = prompt("Enter the title of the announcement: ");
  const body = prompt("Changed body message: ");

  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "text/plain");

  const requestOptions = {
    method: "POST",
    body: body,
    headers: myHeaders,
    credentials: 'include',
    redirect: "follow"
  };

  fetch(uri + `/api/announcements/edit/${title}`, requestOptions)
    .then((response) => response.text())
    .then(data => {
      console.log('Announcement edited Success:', data);
      alert('Announcement Edited successfully!');
    })
    .catch(error => {
      console.error('Error editing announcement:', error);
      alert('Failed to edit announcement.');
    });
}

function createReq() {
  const author = prompt("Enter the author's name:");
  const body = prompt("Enter the body of the announcement:");
  const tags = prompt("Enter the tags for the announcement (comma separated):");
  const title = prompt("Enter the title of the announcement:");

  if (author && body && tags && title) {
    const url = `${uri}/api/announcements/create?author=${encodeURIComponent(author)}&body=${encodeURIComponent(body)}&tags=${encodeURIComponent(tags)}&title=${encodeURIComponent(title)}`;

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

generateAnnouncements();
</script>

