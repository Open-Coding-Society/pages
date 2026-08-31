---
layout: page 
title: Sign Up
permalink: /signup
search_exclude: true
---

{% include nav/homejava.html %}

<script src="https://accounts.google.com/gsi/client" async defer></script>

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
    <form id="signupForm" onsubmit="beginGoogleSignup(); return false;">
      <p>
        <label>
          Name:
          <input type="text" name="name" id="name" required>
        </label>
      </p>
      <p>
        <label>
          Github Id:
          <input type="text" name="signupUid" id="signupUid" aria-describedby="githubIdMessage" required>
          <span id="githubIdMessage" aria-live="polite"></span>
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
    <div id="oauthVerification" style="display: none; text-align: center;">
      <h2>Google Account Verification</h2>
      <p>Sign in with any Google account. Poway USD student accounts receive immediate access; other accounts will await administrator approval.</p>
      <div id="g_id_onload"
           data-client_id="65827797404-ccjleg7jg4g2an8ddpmhnlca4ii2gk8q.apps.googleusercontent.com"
           data-callback="handleStandaloneGoogleSignIn"
           data-auto_prompt="false"></div>
      <div class="g_id_signin" data-type="standard" data-size="large" data-theme="filled_blue"></div>
      <button type="button" class="medium" onclick="showStandaloneSignupForm()">Back to form</button>
    </div>
  </div>
</div>

<script type="module">
  import { javaURI } from '{{ site.baseurl }}/assets/js/api/config.js';
  import { pythonURI } from '{{ site.baseurl }}/assets/js/api/config.js';

  const studentIdAsGithubIdPattern = /^\d{7}$/;
  const githubIdInput = document.getElementById('signupUid');
  const githubIdMessage = document.getElementById('githubIdMessage');

  function validateGithubId() {
    const isStudentId = studentIdAsGithubIdPattern.test(githubIdInput.value.trim());
    const message = isStudentId ? 'Enter your GitHub ID, not your 7-digit student ID.' : '';
    githubIdInput.setCustomValidity(message);
    githubIdMessage.innerText = message;
    return !isStudentId;
  }

  githubIdInput.addEventListener('input', validateGithubId);

  let signupIdToken = null;
  let verifiedGoogleEmail = null;

  window.beginGoogleSignup = function() {
    if (!validateGithubId()) {
      githubIdInput.reportValidity();
      githubIdInput.focus();
      return;
    }
    if (!document.getElementById('signupForm').checkValidity()) {
      document.getElementById('signupForm').reportValidity();
      return;
    }
    document.getElementById('signupForm').style.display = 'none';
    document.getElementById('oauthVerification').style.display = 'block';
  };

  window.showStandaloneSignupForm = function() {
    document.getElementById('oauthVerification').style.display = 'none';
    document.getElementById('signupForm').style.display = 'block';
  };

  window.handleStandaloneGoogleSignIn = function(response) {
    const payload = JSON.parse(atob(response.credential.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')));
    signupIdToken = response.credential;
    verifiedGoogleEmail = payload.email;
    document.getElementById('signupMessage').innerText = `Google account selected: ${verifiedGoogleEmail}`;
    window.signup();
  };

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
        email: verifiedGoogleEmail,
        dob: "11-01-2024",  // Static date for now, you can modify this
        name: document.getElementById("name").value,
        password: document.getElementById("signupPassword").value,
        kasmServerNeeded: document.getElementById("kasmNeeded").checked,
        idToken: signupIdToken,
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
        email: verifiedGoogleEmail,
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
