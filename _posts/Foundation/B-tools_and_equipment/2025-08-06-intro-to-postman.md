---
layout: post
courses: {'csa': {'week': 21}}
toc: true
title: Postman Guide
description: Quick Guide to Write & Test APIs with Postman
permalink: /postman
author: Anusha Khobare
---

<style>
  /* Infographic styles */
  .postman-intro-visualizer {
    max-width: 900px;
    margin: 0 auto 3rem;
    text-align: center;
  }
  .hero-section {
    margin-bottom: 2rem;
  }
  .postman-flow {
    display: flex;
    justify-content: center;
    gap: 1rem;
    flex-wrap: wrap;
  }
  .postman-phase {
    border: 2px solid;
    border-radius: 10px;
    padding: 1rem 1.5rem;
    width: 220px;
    cursor: pointer;
    transition: background 0.3s ease;
    user-select: none;
  }
  .postman-phase:hover {
    background: var(--panel);
  }
  .phase-arrow {
    font-size: 2.5rem;
    user-select: none;
    align-self: center;
    padding: 0 0.5rem;
  }
  .phase-icon {
    font-size: 3rem;
    margin-bottom: 0.5rem;
  }
  /* Lesson content styles */
  section.lesson-section {
    max-width: 900px;
    margin: 3rem auto;
    padding-top: 2rem;
    border-top: 2px solid;
  }
  section.lesson-section h2 {
    color: #007bff;
    margin-bottom: 1rem;
  }
  section.lesson-section p, section.lesson-section ul {
    margin-bottom: 1rem;
  }
  section.lesson-section img {
    max-width: 100%;
    border: 1px solid;
    margin: 1rem 0;
    border-radius: 6px;
  }
</style>

<!-- Interactive Infographic -->
<div class="postman-intro-visualizer">
  <div class="hero-section">
    <h1 class="hero-title">Postman Intro Guide</h1>
    <p class="hero-subtitle">Quick Guide to Write & Test APIs with Postman</p>
  </div>

  <div class="postman-flow" role="navigation" aria-label="Postman lesson navigation">

    <div class="postman-phase" tabindex="0" role="button" aria-pressed="false" onclick="scrollToSection('background-knowledge')">
      <div class="phase-icon" aria-hidden="true">📚</div>
      <div class="phase-title">Background Knowledge</div>
      <div class="phase-desc">Understand APIs & HTTP basics</div>
    </div>

    <div class="phase-arrow" aria-hidden="true">→</div>

    <div class="postman-phase" tabindex="0" role="button" aria-pressed="false" onclick="scrollToSection('why-postman')">
      <div class="phase-icon" aria-hidden="true">❓</div>
      <div class="phase-title">Why Use Postman?</div>
      <div class="phase-desc">Test backend <strong>without a frontend</strong></div>
    </div>

    <div class="phase-arrow" aria-hidden="true">→</div>

    <div class="postman-phase" tabindex="0" role="button" aria-pressed="false" onclick="scrollToSection('write-api')">
      <div class="phase-icon" aria-hidden="true">✍️</div>
      <div class="phase-title">Write Backend Code</div>
      <div class="phase-desc">Define API routes in VS Code</div>
    </div>

    <div class="phase-arrow" aria-hidden="true">→</div>

    <div class="postman-phase" tabindex="0" role="button" aria-pressed="false" onclick="scrollToSection('test-api')">
      <div class="phase-icon" aria-hidden="true">🧪</div>
      <div class="phase-title">Test APIs</div>
      <div class="phase-desc">Send requests and inspect responses</div>
    </div>

    <div class="phase-arrow" aria-hidden="true">→</div>

    <div class="postman-phase" tabindex="0" role="button" aria-pressed="false" onclick="scrollToSection('vs-postman')">
      <div class="phase-icon" aria-hidden="true">⚖️</div>
      <div class="phase-title">VS Code vs Postman</div>
      <div class="phase-desc">Where to find info</div>
    </div>

<!-- Full Lesson Content -->

<section id="background-knowledge" class="lesson-section">
  <h2>Common Status Codes</h2>
  <!-- New Status Codes Table -->
  <table>
    <thead>
      <tr>
        <th>Status Code</th>
        <th>Meaning</th>
        <th>When to Expect</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>200 OK</td>
        <td>Request succeeded</td>
        <td>Successful GET, POST, PUT, PATCH, DELETE</td>
      </tr>
      <tr>
        <td>201 Created</td>
        <td>Resource created</td>
        <td>Successful POST that creates a resource</td>
      </tr>
      <tr>
        <td>204 No Content</td>
        <td>Request succeeded, no response body</td>
        <td>Successful DELETE or PUT with no response content</td>
      </tr>
      <tr>
        <td>400 Bad Request</td>
        <td>Malformed request syntax or invalid data</td>
        <td>When request JSON or parameters are invalid</td>
      </tr>
      <tr>
        <td>401 Unauthorized</td>
        <td>Authentication required or failed</td>
        <td>Missing or invalid auth token/cookie</td>
      </tr>
      <tr>
        <td>403 Forbidden</td>
        <td>Authenticated but not allowed</td>
        <td>Access denied for user to resource</td>
      </tr>
      <tr>
        <td>404 Not Found</td>
        <td>Resource not found</td>
        <td>Invalid endpoint or missing resource</td>
      </tr>
      <tr>
        <td>500 Internal Server Error</td>
        <td>Server encountered an error</td>
        <td>Unhandled exceptions or errors on backend</td>
      </tr>
    </tbody>
  </table>
  <h2>Common HTTP Methods</h2>
  <table>
    <thead>
      <tr>
        <th>Method</th>
        <th>Purpose</th>
        <th>Usage in VS Code</th>
        <th>Postman Tip</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>GET</td>
        <td>Retrieve data</td>
        <td>Route with <code>methods=['GET']</code></td>
        <td>No body needed</td>
      </tr>
      <tr>
        <td>POST</td>
        <td>Create data</td>
        <td>Read JSON from request body</td>
        <td>Use Body tab to send JSON</td>
      </tr>
      <tr>
        <td>PUT</td>
        <td>Replace data</td>
        <td>Replace full record</td>
        <td>Send full updated data</td>
      </tr>
      <tr>
        <td>PATCH</td>
        <td>Update part</td>
        <td>Partial update logic</td>
        <td>Send partial JSON data</td>
      </tr>
      <tr>
        <td>DELETE</td>
        <td>Remove data</td>
        <td>Delete from database</td>
        <td>No body needed</td>
      </tr>
    </tbody>
  </table>
</section>

<section id="why-postman" class="lesson-section">
  <h2> Why Use Postman?</h2>
  <ul>
    <li><strong>Test backend code (in python flask, java spring, etc.) without having a functional frontend </strong>. This allows for students to work on and test different pieces of the project seperately before joining them together. .</li>
    <li><strong>Allows for quick debugging of APIs </strong> + Test Cookie/Token storage that may be generated by the backend (typically for authorization).</li>
    <li>Has its own collaboration system such as <strong>shared workspaces</strong> and collections where team members can share postman requests. </li>
  </ul>
  <p><strong>Pro Coder Tip:</strong> For more info on any tool (in this case postman) visit its offical documentation <a href="https://learning.postman.com/docs/introduction/overview/" target="_blank" rel="noopener noreferrer">Postman Docs</a></p>
</section>

<section id="write-api" class="lesson-section">
  <h2> Write Backend Code in VS Code</h2>
  <ul>
    <li>1. Create API endpoints in an api file (flask framework) + define in main.py</li>
    <li>2. Use the terminal in VS Code to run your Flask localhost server (<code>python main.py</code>).</li>
  </ul>
  <img src="https://github.com/user-attachments/assets/2c79ce35-7312-4abf-bbea-8456bb1fca23" alt="VS Code and API route example" />
</section>

<section id="test-api" class="lesson-section">
  <h2>Test APIs in Postman</h2>
  <ul>
    <li><strong>Choose method (GET, POST, etc.) and enter your API URL (which consists of your endpoint from your code + local host server from python main.py.</strong></li>
    <img src="https://github.com/user-attachments/assets/09ce22c8-fa2e-440b-acb6-b62c632df568" alt="Postman response panel" />
    <li><strong>Use Body → raw → JSON</strong> to send data for POST/PUT requests.</li>
    <img src="https://github.com/user-attachments/assets/cc8a8572-05fb-4e5d-8085-e52d5418358d" alt="Postman JSON body input" />
    <li><strong>View status codes and response data</strong> in the panel below.</li>
  </ul>
  
  <img  alt="200 OK" src="https://github.com/user-attachments/assets/109504d5-3436-4a1c-90f1-edfe42bdad43" />

  <img  alt="404 Not Found" src="https://github.com/user-attachments/assets/c65ec532-db55-49b4-93c2-85c22270ae8f" />
  
</section>

<section id="vs-postman" class="lesson-section">
  <h2>VS Code vs Postman: Where To Find the Information</h2>
  <table>
    <thead>
      <tr>
        <th>Backend (VS Code)</th>
        <th>Testing (Postman)</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>localhost url + endpoint</td>
        <td>type localhost url + endpoint into send bar</td>
      </tr>
      <tr>
        <td><img src="https://github.com/user-attachments/assets/2c79ce35-7312-4abf-bbea-8456bb1fca23" alt="VS Code code example" style="width:300px;" /></td>
        <td><img src="https://github.com/user-attachments/assets/09ce22c8-fa2e-440b-acb6-b62c632df568" alt="Postman response and status" style="width:300px;" /></td>
      </tr>
      <tr>
        <td>Find API call method</td>
        <td>Select HTTP method and enter URL, click <strong>Send</strong></td>
      </tr>
      <tr>
        <td><img src="https://github.com/user-attachments/assets/81f50f20-d6af-47b6-b556-3831755a22b8" alt="VS Code route example" style="width:300px;" /></td>
        <td><img src="https://github.com/user-attachments/assets/09ce22c8-fa2e-440b-acb6-b62c632df568" alt="Postman response panel"/></td>
      </tr>
      <tr>
        <td>Use <code>request.json</code> to read JSON data</td>
        <td>Enter JSON data under <strong>Body → raw → JSON</strong></td>
      </tr>
      <tr>
        <td><img src="https://github.com/user-attachments/assets/81f50f20-d6af-47b6-b556-3831755a22b8" alt="VS Code JSON reading example" style="width:300px;" /></td>
        <td><img src="https://github.com/user-attachments/assets/cc8a8572-05fb-4e5d-8085-e52d5418358d" alt="Postman JSON body input" style="width:300px;" /></td>
      </tr>
      <tr>
        <td>Handle cookies with <code>request.cookies</code></td>
        <td>Manage cookies in Postman’s <strong>Cookies</strong> tab</td>
      </tr>
      <tr>
        <td><img src="https://github.com/user-attachments/assets/8c243b3f-8756-4de5-92a0-9393bd375a6a" alt="VS Code cookies handling" style="width:300px;" /></td>
        <td><img src="https://github.com/user-attachments/assets/5b997086-b3ab-450e-84ea-5e2a4979d1e9" alt="Postman Cookies tab" style="width:300px;" /></td>
      </tr>
    </tbody>
  </table>
<script>
  function scrollToSection(id) {
    document.getElementById(id).scrollIntoView({ behavior: 'smooth' });
  }
</script>
