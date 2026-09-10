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
          Email:
          <input type="email" name="email" id="email" required>
        </label>
      </p>
      <p>
        <label>
          Password:
          <input type="password" name="signupPassword" id="signupPassword" required>
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
  import { javaURI, pythonURI, fetchOptions } from '{{ site.baseurl }}/assets/js/api/config.js';

  // Sign up function to handle form submission
  window.signup = async function() {
    const signupMessage = document.getElementById("signupMessage");
    const signupData = {
      uid: document.getElementById("signupUid").value,
      sid: document.getElementById("sid").value,
      email: document.getElementById("email").value,
      name: document.getElementById("name").value,
      password: document.getElementById("signupPassword").value,
      kasmServerNeeded: false,
      // Keep snake_case alias so Flask handlers expecting either key still work.
      kasm_server_needed: false,
    };

    const springURL = `${javaURI}/api/person/create`;
    const flaskURL = `${pythonURI}/api/user`;

    // Use shared defaults from config.js so credentials/CORS behavior is consistent site-wide.
    const springRequest = {
      ...fetchOptions,
      method: "POST",
      body: JSON.stringify(signupData),
    };

    const flaskRequest = {
      ...fetchOptions,
      method: "POST",
      body: JSON.stringify(signupData),
    };

    console.log("Sending signup requests:", { springURL, flaskURL, springRequest, flaskRequest });

    signupMessage.innerText = "Signing up...";

    try {
      // Flask signup is primary because login/auth reads from Flask user records.
      const flaskResponse = await fetch(flaskURL, flaskRequest);
      const flaskRaw = await flaskResponse.text();
      let flaskData;
      try {
        flaskData = flaskRaw ? JSON.parse(flaskRaw) : {};
      } catch (_) {
        flaskData = { message: flaskRaw };
      }

      if (!flaskResponse.ok || flaskData.success === false) {
        const flaskMessage = flaskData.message || flaskRaw || `Flask signup failed (${flaskResponse.status})`;
        throw new Error(flaskMessage);
      }

      signupMessage.innerText = "Sign up successful!";

      // Spring write is best-effort so API/MVC path issues do not block signup.
      fetch(springURL, springRequest)
        .then(async (springResponse) => {
          const springRaw = await springResponse.text();
          if (!springResponse.ok) {
            console.warn("Spring signup failed:", springResponse.status, springRaw);
          }
        })
        .catch((springError) => {
          console.warn("Spring signup error:", springError.message);
        });
    } catch (error) {
      signupMessage.innerText = "Sign up failed: " + error.message;
      console.error("Error during signup:", error);
    }
  };
</script>
