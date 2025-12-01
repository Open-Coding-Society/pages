---
layout: cs-portfolio-lesson
title: "Submodule 1"
description: "Submodule 1 of Backend Development Mini-Quest"
permalink: /cs-portfolio-quest/backend/submodule_1/
parent: "Backend Development"
team: "Encrypters"
submodule: 1
categories: [CSP, Submodule, Backend]
tags: [backend, submodule, encrypters]
author: "Encrypters Team"
date: 2025-10-21
---

# Module 1: Full Stack Part Two - Backend
---

## 1. Backend Responsibilities

The backend involves authenticating users, processing requests and data, and API endpoints.

### A. Authentication 
Are the user's credentials valid?

**Backend checks**:
1. Is the request properly formatted?
2. Does it have valid data?
3. Is the user allowed to submit responses?

### B. Logic Processing
How should this request be processed?


### C. Data Processing
How should this data be organized and stored?

### D. API Endpoints
What can the user do?
```

| Method | Purpose | Your Free Response Example |
|--------|---------|---------------------------|
| **GET** | Retrieve data | View all submitted responses |
| **POST** | Create new data | Submit your answer (what you coded!) |
| **PUT** | Update entire resource | Edit your entire response |
| **PATCH** | Update part of resource | Just fix a typo in your response |
| **DELETE** | Remove data | Delete your response |

### HTTP Status Codes

Your code already handles these!
```javascript
if (res.ok) {
  // Status 200-299: Success!
  messageDiv.textContent = ` Response saved! (ID: ${data.id})`;
} else {
  // Status 400-599: Error!
  messageDiv.textContent = " Error submitting response.";
}
```

## 4. Databases: Where Data Is Stored


**Key Terms**:
- **Table**: Groups of related data (like "responses")
- **Row**: One record of data
- **Column**: One category of information (ex: name, id)
- **Primary Key**: Unique ID for each row

**example responses table in a database:**


| id | name    | response                                  | created_at          |
|----|---------|-------------------------------------------|---------------------|
| 1  | Alice   | The frontend HTML builds the structure... | 2024-10-28 10:30:00 |
| 2  | Bob     | Full stack systems link user interaction  | 2024-10-28 11:15:00 |
| 3  | Charlie | The JavaScript function sends data...     | 2024-10-28 14:22:00 |                     


---

## 5. APIs: The Bridge Between Frontend and Backend

### What is an API?

**API** = Application Programming Interface

APIs allow the frontend and backend to communicate with each other.

### RESTful API Design


**REST** = **RE**presentational **S**tate **T**ransfer

**Rules**:
1. URLs represent endpoints: `/api/responses`
2. HTTP methods represent actions: POST (create), GET (read)
3. Each request is independent 
4. Responses use standard formats (JSON)

**Example API Design**:
```
POST   /api/responses     → Create new response
GET    /api/responses     → Get all responses
GET    /api/responses/42  → Get response with ID 42
PUT    /api/responses/42  → Update response 42
DELETE /api/responses/42  → Delete response 42
```
---


## 6. JSON

### What is JSON?

**JSON** = **J**ava**S**cript **O**bject **N**otation

JSON is used to send data between frontend and backend.

### Why JSON?

JSON is:
- Short and clean
- Easy to read
- Native to JavaScript
- Fast to parse

---

## 7. Environment Setup & Development

### Local vs Production

**Local Development** :
```javascript
const javaURI = "http://localhost:8085";  
```

**Production** (Live website):
```javascript
const javaURI = "https://api.mywebsite.com";  
```

**Benefits of using const javaURI**:
- Change URL in one place
- Easy to switch between local and production
- Can test different backend servers
- Keeps code clean and maintainable

## Up Next
In the next submodule, you'll learn about APIs and Databases. Keep progressing in order to receive a certificate for completing this module.

## 8. Quick Quiz — Module 1 (Interactive)


Answer the five questions below. Pick the best choice (A–D) and click Submit to see your score.


<div id="mc-quiz" style="border:1px solid #574e4eff;padding:12px;border-radius:6px;max-width:900px;">
 <form id="quiz-form">
   <ol>
     <li>
       <div style="margin-bottom:6px">You see this frontend call:
       <pre style="display:inline-block;margin:6px 0;padding:6px;border-radius:4px;background:#574e4eff">fetch(`${javaURI}/api/responses`, {
 method: "POST",
 headers: { "Content-Type": "application/json" },
 body: JSON.stringify({ name: "Ana", response: "Here is my answer" })
});
</pre>
     <li>
       What is the backend expected to do first when this request arrives?</div>
       <div><label><input type="radio" name="q0" value="A"> A. Write the body to the database without checks</label></div>
       <div><label><input type="radio" name="q0" value="B"> B. Return status 200 immediately to acknowledge receipt</label></div>
       <div><label><input type="radio" name="q0" value="C"> C. Validate the request format and required fields, then authenticate the user if needed</label></div>
       <div><label><input type="radio" name="q0" value="D"> D. Close the connection</label></div>
       <div class="feedback" aria-live="polite" style="margin-top:6px"></div>
     </li>


     <li>
       <div style="margin-bottom:6px">A request arrives without an Authorization header but the endpoint requires authentication. Which status code should the backend most appropriately return?</div>
       <div><label><input type="radio" name="q1" value="A"> A. 200 OK</label></div>
       <div><label><input type="radio" name="q1" value="B"> B. 400 Bad Request</label></div>
       <div><label><input type="radio" name="q1" value="C"> C. 401 Unauthorized</label></div>
       <div><label><input type="radio" name="q1" value="D"> D. 500 Internal Server Error</label></div>
       <div class="feedback" aria-live="polite" style="margin-top:6px"></div>
     </li>


     <li>
       <div style="margin-bottom:6px">Which Content-Type header should the client set when sending JSON in the request body?</div>
       <div><label><input type="radio" name="q2" value="A"> A. text/plain</label></div>
       <div><label><input type="radio" name="q2" value="B"> B. application/json</label></div>
       <div><label><input type="radio" name="q2" value="C"> C. multipart/form-data</label></div>
       <div><label><input type="radio" name="q2" value="D"> D. application/x-www-form-urlencoded</label></div>
       <div class="feedback" aria-live="polite" style="margin-top:6px"></div>
     </li>


     <li>
       <div style="margin-bottom:6px">Your responses table declares `id` as a primary key. Two incoming inserts accidentally use the same id value. What is the typical outcome?</div>
       <div><label><input type="radio" name="q3" value="A"> A. The database accepts both rows and duplicates the id</label></div>
       <div><label><input type="radio" name="q3" value="B"> B. The database rejects the second insert or raises a constraint error</label></div>
       <div><label><input type="radio" name="q3" value="C"> C. The database silently renames the second id to keep it unique</label></div>
       <div><label><input type="radio" name="q3" value="D"> D. The backend will always overwrite the first row automatically</label></div>
       <div class="feedback" aria-live="polite" style="margin-top:6px"></div>
     </li>


     <li>
       <div style="margin-bottom:6px">During development you switch `javaURI` from `http://localhost:8085` to your production API by mistake and run tests. What's the primary risk?</div>
       <div><label><input type="radio" name="q4" value="A"> A. Tests will run faster and use fewer resources</label></div>
       <div><label><input type="radio" name="q4" value="B"> B. You might modify or overwrite real production data and leak test input</label></div>
       <div><label><input type="radio" name="q4" value="C"> C. Local files will be deleted on your machine</label></div>
       <div><label><input type="radio" name="q4" value="D"> D. The browser will block all requests automatically</label></div>
       <div class="feedback" aria-live="polite" style="margin-top:6px"></div>
     </li>
   </ol>


   <div style="margin-top:12px;">
     <button type="submit" id="quiz-submit">Submit</button>
     <button type="button" id="quiz-reset" style="margin-left:8px">Reset</button>
     <span id="quiz-result" style="margin-left:12px;font-weight:600"></span>
   </div>
 </form>
</div>


<script>
(() => {
 const form = document.getElementById('quiz-form');
 const resultSpan = document.getElementById('quiz-result');
 const resetBtn = document.getElementById('quiz-reset');


 const answers = ['C','C','B','B','B'];


 function clearFeedback() {
   // clear any inline per-question messages (if present)
   document.querySelectorAll('#mc-quiz .feedback').forEach(el => el.textContent = '');
   resultSpan.textContent = '';
 }


 function setDisabled(disabled) {
   document.querySelectorAll('#mc-quiz input').forEach(i => i.disabled = disabled);
   document.getElementById('quiz-submit').disabled = disabled;
 }


 form.addEventListener('submit', (e) => {
   e.preventDefault();
   // compute score only; do not show per-question feedback or highlight
   let score = 0;
   for (let i = 0; i < answers.length; i++) {
     const qName = 'q' + i;
     const selected = form[qName] ? form[qName].value : null;
     if (selected === answers[i]) score += 1;
   }
   resultSpan.textContent = `You scored ${score} / ${answers.length}`;
   setDisabled(true);
 });


 resetBtn.addEventListener('click', () => {
   form.reset();
   clearFeedback();
   setDisabled(false);
 });
})();
</script>