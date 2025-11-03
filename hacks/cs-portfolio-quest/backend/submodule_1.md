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

# # Module 1: Full Stack Part Two - Backend Deep Dive

## Welcome to Backend Development! 🚀

In **Part 1**, you learned how the frontend interacts with users and communicates with the backend through APIs. Now in **Part 2**, we'll explore what happens "behind the scenes" - the backend layer that processes requests, manages data, and sends responses back to the frontend.

Think of building a website like building a restaurant:
- **Frontend** = The dining room (what customers see and interact with)
- **Backend** = The kitchen (where the real work happens)
- **Database** = The pantry/storage (where ingredients/data are kept)

---

## 1. Reviewing the Full Stack Pipeline

### The Three Layers

| Layer | Description | Example Technologies |
|--------|--------------|----------------------|
| **Frontend (Client)** | Displays information to users and collects input | HTML, CSS, JavaScript, React, Vue |
| **Backend (Server)** | Handles logic, authentication, and routes | Flask, Node.js, Django, Spring |
| **Database** | Stores and retrieves persistent data | SQLite, PostgreSQL, MongoDB |

### How They Work Together
```
User clicks "Submit" button (Frontend)
    ↓
Frontend sends HTTP POST request to /api/responses
    ↓
Backend receives request and validates data
    ↓
Backend stores data in Database
    ↓
Database confirms save was successful
    ↓
Backend sends response: {"id": 42, "status": "success"}
    ↓
Frontend displays: "✅ Response saved! (ID: 42)"
```

---

## 2. Backend Responsibilities

The backend is like a security guard, chef, accountant, and manager all in one. Let's break down what it does:

### A. Authentication (Security Guard)
**Question it answers**: "Who is this person, and are they allowed in?"

**Example from your Free Response form**:
```javascript
// Frontend sends request
fetch(`${javaURI}/api/responses`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ name, response })
});
```

**Backend checks**:
1. Is the request properly formatted?
2. Does it have valid data?
3. Is the user allowed to submit responses?

### B. Business Logic (The Chef)
**Question it answers**: "How should we process this request?"

**Example - Processing Your Response**:
```
Backend receives: { "name": "Alice", "response": "Full stack connects..." }

Backend processes:
1. Validate name is not empty ✓
2. Validate response is not empty ✓
3. Check response length (maybe max 1000 characters)
4. Add timestamp: created_at = "2024-10-28 10:30:00"
5. Generate unique ID: id = 42
6. Prepare to save to database
```

### C. Data Processing (The Accountant)
**Question it answers**: "How do we organize and store this data?"

**Example - Saving to Database**:
```sql
-- Backend generates this SQL command
INSERT INTO responses (name, response, created_at)
VALUES ('Alice', 'Full stack connects...', '2024-10-28 10:30:00');

-- Returns: ID 42
```

### D. API Endpoints (The Menu)
**Question it answers**: "What actions can users perform?"

**Example - Student Response System**:
```
Available Actions (Endpoints):
POST /api/responses         → Submit a new response
GET  /api/responses         → View all responses
GET  /api/responses/42      → View specific response (ID: 42)
PUT  /api/responses/42      → Update response 42
DELETE /api/responses/42    → Delete response 42
```

---

## 3. Understanding HTTP: How Computers Talk

### The Request/Response Cycle

Remember your Free Response form? Let's trace exactly what happens:

**REQUEST (What Frontend Sends)**:
```
POST /api/responses HTTP/1.1
Host: your-backend-server.com
Content-Type: application/json

{
  "name": "Alice",
  "response": "The frontend HTML builds the structure..."
}
```

**RESPONSE (What Backend Sends Back)**:
```
HTTP/1.1 200 OK
Content-Type: application/json

{
  "id": 42,
  "name": "Alice",
  "response": "The frontend HTML builds the structure...",
  "created_at": "2024-10-28T10:30:00Z",
  "status": "success"
}
```

### HTTP Methods Review

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
  messageDiv.textContent = `✅ Response saved! (ID: ${data.id})`;
} else {
  // Status 400-599: Error!
  messageDiv.textContent = "⚠️ Error submitting response.";
}
```

**Common Status Codes**:

#### 2xx - Success ✅
- **200 OK**: "Here's your data" (GET request worked)
- **201 Created**: "Successfully created!" (POST request worked)
- **204 No Content**: "Deleted successfully" (DELETE worked)

#### 4xx - Client Error (Frontend Problem) ❌
- **400 Bad Request**: Missing name or response field
- **401 Unauthorized**: User not logged in
- **404 Not Found**: `/api/responses/999` doesn't exist
- **422 Unprocessable Entity**: Response too long

#### 5xx - Server Error (Backend Problem) 💥
- **500 Internal Server Error**: Backend code crashed
- **503 Service Unavailable**: Server is down

---

## 4. Databases: Where Data Lives

### Why We Need Databases

**Without Database**:
```
User submits response → Backend stores in variable
Server restarts → ALL DATA GONE! 😱
```

**With Database**:
```
User submits response → Backend stores in database
Server restarts → Data still there! ✅
Another user logs in → Can see all previous responses! ✅
```

### Basic Database Concepts

**Your Free Response data as a table**:
```
responses table:
+----+----------+------------------------------------------+---------------------+
| id | name     | response                                 | created_at          |
+----+----------+------------------------------------------+---------------------+
| 1  | Alice    | The frontend HTML builds the structure...| 2024-10-28 10:30:00 |
| 2  | Bob      | Full stack systems link user interaction| 2024-10-28 11:15:00 |
| 3  | Charlie  | The JavaScript function sends data...    | 2024-10-28 14:22:00 |
+----+----------+------------------------------------------+---------------------+
```

**Key Terms**:
- **Table**: Collection of related data (like "responses")
- **Row**: One record (one student's response)
- **Column**: One piece of information (like "name" or "response")
- **Primary Key**: Unique ID for each row (the `id` column)

---

## 5. APIs: The Bridge Between Frontend and Backend

### What is an API?

**API** = Application Programming Interface

It's a set of rules that lets the frontend and backend talk to each other.

### Your Free Response System's API

**Endpoint**: `/api/responses`

**What it does**:
```javascript
// Frontend: "Hey backend, save this!"
fetch(`${javaURI}/api/responses`, {
  method: "POST",
  body: JSON.stringify({ name: "Alice", response: "..." })
});

// Backend: "Got it! Here's the ID: 42"
return { id: 42, status: "success" };
```

### RESTful API Design

Your Free Response system follows **REST** principles:

**REST** = **RE**presentational **S**tate **T**ransfer

**Rules**:
1. URLs represent resources (things): `/api/responses`
2. HTTP methods represent actions: POST (create), GET (read)
3. Each request is independent (stateless)
4. Responses use standard formats (JSON)

**Good API Design** ✅:
```
POST   /api/responses     → Create new response
GET    /api/responses     → Get all responses
GET    /api/responses/42  → Get response with ID 42
PUT    /api/responses/42  → Update response 42
DELETE /api/responses/42  → Delete response 42
```

**Bad API Design** ❌:
```
POST   /api/createResponse        → Verb in URL
GET    /api/getAllStudentAnswers  → Too specific
GET    /api/response/42           → Singular (should be plural)
```

---

## 6. Connecting the Pieces: Complete Flow

Let's trace your Free Response submission through the **entire stack**:

### Step 1: User Action (Frontend)
```javascript
// User types name and response, clicks Submit
submitBtn.addEventListener("click", async () => {
  const name = nameInput.value.trim();        // "Alice"
  const response = responseInput.value.trim(); // "The frontend..."
  
  // Validation
  if (!name || !response) {
    messageDiv.textContent = "Please fill in both fields.";
    return;
  }
```

### Step 2: Frontend Sends Request
```javascript
  const res = await fetch(`${javaURI}/api/responses`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, response })
  });
```

**What this creates**:
```
POST /api/responses HTTP/1.1
Host: your-backend.com
Content-Type: application/json

{
  "name": "Alice",
  "response": "The frontend..."
}
```

### Step 3: Backend Receives Request
```python
# Flask backend example
@app.route('/api/responses', methods=['POST'])
def create_response():
    # 1. Get data from request
    data = request.json
    name = data.get('name')
    response_text = data.get('response')
    
    # 2. Validate
    if not name or not response_text:
        return jsonify({'error': 'Name and response required'}), 400
    
    # 3. Create database record
    new_response = Response(
        name=name,
        response=response_text,
        created_at=datetime.utcnow()
    )
    
    # 4. Save to database
    db.session.add(new_response)
    db.session.commit()
    
    # 5. Send response back
    return jsonify({
        'id': new_response.id,
        'status': 'success'
    }), 201
```

### Step 4: Database Stores Data
```sql
-- Backend generates this SQL
INSERT INTO responses (name, response, created_at)
VALUES ('Alice', 'The frontend...', '2024-10-28 10:30:00');

-- Database returns: ID = 42
```

### Step 5: Backend Sends Response
```
HTTP/1.1 201 Created
Content-Type: application/json

{
  "id": 42,
  "status": "success"
}
```

### Step 6: Frontend Receives Response
```javascript
  if (res.ok) {
    const data = await res.json();  // { id: 42, status: "success" }
    messageDiv.textContent = `✅ Response saved! (ID: ${data.id})`;
    messageDiv.style.color = "green";
    responseInput.value = "";  // Clear the form
  }
```

### Step 7: User Sees Confirmation
```
✅ Response saved! (ID: 42)
```

**Total time**: ~200-500 milliseconds

---

## 7. Error Handling: When Things Go Wrong

Your code already handles errors! Let's understand why:

### Scenario 1: Empty Fields
```javascript
if (!name || !response) {
  messageDiv.textContent = "Please fill in both fields.";
  messageDiv.style.color = "red";
  return;  // Stop before sending to backend
}
```
**This is frontend validation** - catches problems before wasting a network request!

### Scenario 2: Backend Error
```javascript
else {
  messageDiv.textContent = "⚠️ Error submitting response.";
  messageDiv.style.color = "red";
}
```
**Backend might return**:
- 400: Bad data format
- 500: Server crashed
- 422: Response too long

### Scenario 3: Network Error
```javascript
catch (err) {
  messageDiv.textContent = "❌ Could not connect to server.";
  messageDiv.style.color = "red";
}
```
**This catches**:
- Server is down
- No internet connection
- Wrong URL in `javaURI`

---

## 8. JSON: The Language of APIs

### What is JSON?

**JSON** = **J**ava**S**cript **O**bject **N**otation

It's the format used to send data between frontend and backend.

### Your Free Response as JSON

**Sending to Backend**:
```json
{
  "name": "Alice",
  "response": "The frontend HTML builds the structure and collects input from the user."
}
```

**Receiving from Backend**:
```json
{
  "id": 42,
  "name": "Alice",
  "response": "The frontend HTML builds the structure and collects input from the user.",
  "created_at": "2024-10-28T10:30:00Z",
  "status": "success"
}
```

### Why JSON?

**Before JSON (XML)**:
```xml
<response>
  <name>Alice</name>
  <response>The frontend HTML...</response>
</response>
```

**With JSON**:
```json
{
  "name": "Alice",
  "response": "The frontend HTML..."
}
```

JSON is:
- ✅ Shorter and cleaner
- ✅ Easier to read
- ✅ Native to JavaScript
- ✅ Faster to parse

---

## 9. Environment Setup & Development

### Local vs Production

**Local Development** (What you're doing now):
```javascript
const javaURI = "http://localhost:8085";  // Your computer
```

**Production** (Live website):
```javascript
const javaURI = "https://api.mywebsite.com";  // Real server
```

### Why Use Variables for URLs?
```javascript
import { javaURI } from '/assets/js/api/config.js';

// Instead of:
fetch("http://localhost:8085/api/responses", ...)

// You use:
fetch(`${javaURI}/api/responses`, ...)
```

**Benefits**:
- ✅ Change URL in one place
- ✅ Easy to switch between local and production
- ✅ Can test different backend servers
- ✅ Keeps code clean and maintainable

---

## 10. Hands-On Exercise: Enhance Your Free Response System

### Challenge 1: Add a Character Counter

**Goal**: Show how many characters the user has typed

**Add to HTML**:
```html
<textarea id="response" placeholder="Type your response here..." rows="5"></textarea>
<div id="charCount">0 / 1000 characters</div>
```

**Add to JavaScript**:
```javascript
responseInput.addEventListener("input", () => {
  const length = responseInput.value.length;
  const charCountDiv = document.getElementById("charCount");
  charCountDiv.textContent = `${length} / 1000 characters`;
  
  if (length > 1000) {
    charCountDiv.style.color = "red";
  } else {
    charCountDiv.style.color = "gray";
  }
});
```

### Challenge 2: Add Response Validation

**Goal**: Check response length before submitting

**Add to submit function**:
```javascript
if (response.length > 1000) {
  messageDiv.textContent = "Response too long! Max 1000 characters.";
  messageDiv.style.color = "red";
  return;
}

if (response.length < 50) {
  messageDiv.textContent = "Response too short! Min 50 characters.";
  messageDiv.style.color = "red";
  return;
}
```

### Challenge 3: Display All Responses

**Goal**: Add a "View All Responses" button

**Add to HTML**:
```html
<button id="viewAllBtn">View All Responses</button>
<div id="allResponses"></div>
```

**Add to JavaScript**:
```javascript
viewAllBtn.addEventListener("click", async () => {
  try {
    const res = await fetch(`${javaURI}/api/responses`);
    
    if (res.ok) {
      const responses = await res.json();
      const responsesDiv = document.getElementById("allResponses");
      
      responsesDiv.innerHTML = responses.map(r => `
        <div class="response-card">
          <strong>${r.name}</strong>
          <p>${r.response}</p>
          <small>${r.created_at}</small>
        </div>
      `).join('');
    }
  } catch (err) {
    console.error("Could not fetch responses:", err);
  }
});
```

---

## Key Takeaways

✅ **Backend** processes requests, manages data, and enforces rules

✅ **HTTP** is how frontend and backend communicate (requests and responses)

✅ **Status codes** tell you if things worked (200) or failed (404, 500)

✅ **JSON** is the standard format for sending data between frontend and backend

✅ **APIs** are the "menu" of actions users can perform

✅ **Databases** provide permanent storage (data survives server restarts)

✅ **Error handling** makes your app resilient and user-friendly

✅ **Full stack** means understanding how all three layers (frontend, backend, database) work together

---

## Review Questions

### Question 1: Trace the Flow
When a user clicks "Submit" in your Free Response form, what are the 7 steps that happen? List them in order.

### Question 2: HTTP Methods
What HTTP method would you use for each action?
- Viewing all responses
- Submitting a new response
- Editing your response
- Deleting your response

### Question 3: Error Handling
Look at your code. What three types of errors does it handle, and how does it handle each one?

### Question 4: JSON Understanding
Convert this form data to JSON:
- Name: "Bob"
- Response: "Full stack development connects frontend and backend"

### Question 5: Real-World Connection
Your Free Response system is a mini full-stack application. List which part of your code handles:
- Frontend (what the user sees)
- API communication (how data travels)
- Backend (where would data processing happen)
- Database (where would data be stored)

#### Enter ALL your answers for Review Questions!
<textarea id='grade' placeholder="Enter your answer(s) here" style="width: 25vw;"></textarea>
<br>
<button style="background-color:#4CAF50;color:#fff;border:none;padding:8px 16px;border-radius:4px;cursor:pointer;" onclick="(async function(btn){ btn.disabled=true; btn.textContent='Submitting...'; try{ await gradeLesson(); btn.textContent='Submitted.'; }catch(e){ console.error(e); btn.disabled=false; btn.textContent='Submit'; alert('Submission failed'); } })(this)">Submit</button>

---

<script type="module">
    import { javaURI } from '{{ site.baseurl }}/assets/js/api/config.js';
    import { pythonURI, fetchOptions } from '{{ site.baseurl }}/assets/js/api/config.js';

    async function getCredentials() {
        try {
            const res = await fetch(`${pythonURI}/api/id`, {
                ...fetchOptions,
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                },
            });

            if (res.ok) {
                const data = await res.json();
                const name = data.uid;
                return name;
            } else {
                console.log(`Request failed for with status ${res.status}`);
            }
        } catch (err) {
            console.log(`Error: ${err}`);
        }
    }

    // Questions and response can be numbered list
    async function gradeLesson() {
        const name = await getCredentials();
        // If there is multiple textboxes get the IDs for all of them - get the elements then use the .text or whatever parameter and the concatate the values to get one big response
        // Concat example: '1.' + answer1 + '2." + answer2
        const responseText = document.getElementById('grade').value;
        const question = `
          Question 1: Trace the Flow
          When a user clicks "Submit" in your Free Response form, what are the 7 steps that happen? List them in order.
          Question 2: HTTP Methods
          What HTTP method would you use for each action?
          - Viewing all responses
          - Submitting a new response
          - Editing your response
          - Deleting your response
          Question 3: Error Handling
          Look at your code. What three types of errors does it handle, and how does it handle each one?
          Question 4: JSON Understanding
          Convert this form data to JSON:
          - Name: "Bob"
          - Response: "Full stack development connects frontend and backend"
          Question 5: Real-World Connection
          Your Free Response system is a mini full-stack application. List which part of your code handles:
          - Frontend (what the user sees)
          - API communication (how data travels)
          - Backend (where would data processing happen)
          - Database (where would data be stored)
        `;
        try {
            const res = await fetch(`${javaURI}/api/stats/grade`, {
                ...fetchOptions,
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ "username": name, "module": "Backend Development", "submodule": 1, "question": question, "response": responseText})
            });

            if (!res.ok) {
                console.log(`Request failed with status ${res.status}`);
                return;
            }

            const data = await res.json();
            console.log(data)
            return data;
        } catch (err) {
            console.log(`Error: ${err}`);
        }
    }
    window.gradeLesson = gradeLesson;
</script>