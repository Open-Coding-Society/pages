---
layout: page 
title: Sign Up
permalink: /signup
search_exclude: true
---

{% include nav/homejava.html %}

<style>
  .login-container {
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap; /* allows the cards to wrap onto the next line if the screen is too small */
  }

  .signup-card {
      margin: auto;
      margin-top: 0; /* remove the top margin */
      width: 45%;
      border: 1px solid #ddd;
      border-radius: 5px;
      padding: 20px;
      box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.3);
      margin-bottom: 20px;
      overflow-x: auto; /* Enable horizontal scrolling */
  }

  .signup-card h1 {
      margin-bottom: 20px;
  }
</style>

<div id="login-container">
  <div class="signup-card">
    <h1 id="signupTitle">Sign Up</h1>
    <form id="signupForm" onsubmit="signup(); return false;">
      <p>
        <label>
          Name:
          <input type="text" name="name" id="name" required>
        </label>
      </p>
      <p>
        <label>
          Github Id:
          <input type="text" name="signupUid" id="signupUid" required>
        </label>
      </p>
      <p>
        <label>
          SID:
          <input type="text" name="sid" id="sid" required>
        </label>
      </p>
      <p>
        <label>
          Password:
          <input type="password" name="signupPassword" id="signupPassword" required>
        </label>
      </p>
      <p>
        <label>
          <input type="checkbox" name="kasmNeeded" id="kasmNeeded">
          Kasm Server Needed
        </label>
      </p>
      <p>
        <button type="submit" class="medium filledHighlight primary">Sign Up</button>
      </p>
      <p id="signupMessage" style="color: green;"></p>
    </form>
  </div>
</div>

<script type="module">
  import { javaURI } from '{{ site.baseurl }}/assets/js/api/config.js';
  import { pythonURI } from '{{ site.baseurl }}/assets/js/api/config.js';

  // Sign up function to handle form submission
  window.signup = function() {
    const signupOptionsJava = {
      URL: `${javaURI}/api/person/create`,
      method: "POST",
      cache: "no-cache",
      headers: new Headers({
        "Content-Type": "application/json"
      }),
      body: JSON.stringify({
        uid: document.getElementById("signupUid").value,
        sid: document.getElementById("sid").value,
        email: document.getElementById("signupUid").value + "@gmail.com",
        dob: "11-01-2024",  // Static date for now, you can modify this
        name: document.getElementById("name").value,
        password: document.getElementById("signupPassword").value,
        kasmServerNeeded: document.getElementById("kasmNeeded").checked,
      })
    };

    const signupOptionsPython = {
      URL: `${pythonURI}/api/user`,
      method: "POST",
      cache: "no-cache",
      headers: new Headers({
        "Content-Type": "application/json"
      }),
      body: JSON.stringify({
        uid: document.getElementById("signupUid").value,
        sid: document.getElementById("sid").value,
        email: document.getElementById("signupUid").value + "@gmail.com",
        dob: "11-01-2024",  // Static date for now, you can modify this
        name: document.getElementById("name").value,
        password: document.getElementById("signupPassword").value,
        kasmServerNeeded: document.getElementById("kasmNeeded").checked,
      })
    };

    // Debugging: Check if the request is set up correctly
    console.log('Sending request:', signupOptionsJava, signupOptionsPython);

    // Send the request to the server
    fetch(signupOptionsJava.URL, signupOptionsJava)
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          document.getElementById("signupMessage").innerText = "Sign up successful!";
        } else {
          document.getElementById("signupMessage").innerText = "Sign up failed: " + data.message;
        }
      })
      .catch(error => {
        document.getElementById("signupMessage").innerText = "Error: " + error.message;
        console.error('Error during signup:', error);
      });

    fetch(signupOptionsPython.URL, signupOptionsPython)
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          document.getElementById("signupMessage").innerText = "Sign up successful!";
        } else {
          document.getElementById("signupMessage").innerText = "Sign up failed: " + data.message;
        }
      })
      .catch(error => {
        document.getElementById("signupMessage").innerText = "Error: " + error.message;
        console.error('Error during signup:', error);
      });
  };
</script>
