---
layout: post
assignment: true
title: Java Spring Hacks - Sprint 1 Final
description: Full-stack project using Spring Boot API, JPA, and POJO backed by your OCS system ideation. Individual project, team integration.
permalink: /java/spring/hacks/
courses: {'csa': {'week': 4}}
categories: ['Java Spring']
---

## Overview: Spring Boot Full-Stack Development with OCS System Ideation

This assignment is your **individual ideation phase** for the Trimester 1 N@tM final project, due at the end of Sprint 1. You will design and build a full-stack application centered on a **data-driven object** that could enhance your OCS system. This is both an individual learning experience in Spring Boot architecture AND a potential foundation for your team's N@tM deliverable. **For this round, you maintain your own template and portfolio**; OCS integration may happen later if your ideation is selected and refined for adoption.

### Learning Objectives & Requirements

By the end of this assignment, you will:

1. **Master POJO Design** — Understand how Plain Old Java Objects form the foundation of both the AP CSA exam and modern frameworks like Spring
2. **Implement Data Persistence** — Use JPA and SQLite to reliably store and retrieve your data object
3. **Build a REST API** — Create Spring Boot endpoints that expose your data with proper HTTP methods (GET, POST, PUT, DELETE)
4. **Design Full-Stack Architecture** — Connect a backend API to a frontend (GitHub Pages OR Thymeleaf admin page)
5. **Portfolio & Exam Preparation** — Document your work in a blog that demonstrates OOP mastery and prepares you for AP CSA exam

### Your Data Object: The Domain Model

**Your assignment starts with ONE question:** *What data object from your ideation could be useful to OCS or your team?*

Examples:
- A **User** with profile, roles, permissions, and activity tracking
- A **Project** with metadata, timeline, team assignments, and status
- A **Resource** (course, tool, template) with categories, versions, and usage metrics
- A **Challenge** or **Badge** with criteria, points, and completion tracking
- An **Event** or **Meeting** with attendees, agenda, notes, and outcomes

This object becomes your **POJO** → your **JPA Entity** → your **API endpoint** → your **frontend form**. Throughout this assignment, reinforce: *"My data object flows through the full stack."*

### Full-Stack Architecture: Choose Your Path

You have two deployment patterns (your team will use one for N@tM):

#### **Option A: Spring Boot API + GitHub Pages Frontend**
- **Backend:** Spring Boot running on `localhost:8585` with SQLite database
- **Frontend:** Static GitHub Pages (HTML/CSS/JavaScript) in your portfolio repo
- **Connection:** API calls from frontend to backend via `config.js` proxy
- **Why:** Mirrors your Flask + GitHub Pages experience; leverages your portfolio repo
- **Best for:** Showcase projects, portfolios, public-facing applications

#### **Option B: Spring Boot API + Thymeleaf Admin Dashboard**
- **Backend:** Spring Boot with embedded Thymeleaf templates (server-side rendering)
- **Frontend:** Admin pages served directly by Spring Boot
- **Connection:** Forms POST to Spring endpoints; responses rendered server-side
- **Why:** Simpler deployment; single JAR artifact; built-in CSRF protection
- **Best for:** Internal tools, admin dashboards, CRUD applications

**Both options use the same POJO → JPA → API architecture.** The difference is frontend delivery.

<table>
    <tr>
        <td><a href="{{site.baseurl}}/java/spring/intro">Intro</a></td>
        <td><a href="{{site.baseurl}}/java/spring/anatomy">Anatomy</a></td>
        <td><a href="{{site.baseurl}}/java/spring/jokes">Jokes</a></td>
        <td><a href="{{site.baseurl}}/java/spring/ui">UI</a></td>
        <td><a href="{{site.baseurl}}/java/spring/api">API</a></td>
        <td><a href="{{site.baseurl}}/java/spring/jpa">JPA</a></td>
        <td><a href="{{site.baseurl}}/java/spring/pojo">POJO</a></td>
    </tr>
</table>

---

## Assignment Deliverables (Phased)

### Phase 1: POJO Design & Lombok Code Generation

**Objective:** Master object design for both Spring Boot AND AP CSA exam.

**Your Data Object as a POJO:**
Your POJO is the direct representation of the data object you identified earlier. Example: a `User` class with fields for username, email, role, created_date, etc.

**Tasks:**

1. **Design your POJO** based on your data object
   - Identify all required fields (e.g., `id`, `name`, `description`, `createdAt`, `updatedBy`)
   - Choose appropriate data types (primitives, Strings, LocalDateTime, etc.)
   - Consider relationships (e.g., a Project belongs to a Team)

2. **Learn Lombok annotations** — Review [Project Lombok Features](https://projectlombok.org/features/)
   - `@Data` — Auto-generates getters, setters, toString, equals, hashCode, constructor
   - `@Entity` — Marks class for JPA persistence
   - `@Id` / `@GeneratedValue` — Primary key management
   - `@OneToMany`, `@ManyToOne` — Relationship annotations

3. **Blog deliverable: "POJO & Code Generation"**
   - Show your POJO source code (with annotations)
   - Show the generated code that Lombok produces
   - Explain each auto-generated method (getters, setters, toString, equals, hashCode)
   - **Connect to AP CSA:** Explain how Lombok-generated methods relate to AP CSA requirements for classes (accessors, mutators, equals, toString)
   - Screenshot your POJO in IDE and the generated bytecode in the debugger

---

### Phase 2: Data Persistence with JPA & SQLite

**Objective:** Persist your data object to a database and validate the schema.

**Setup:**

Your project uses **SQLite** as the database. Spring Boot will auto-create tables based on your POJO entities.

```
spring.jpa.hibernate.ddl-auto=create-drop  # Recreate tables on startup
spring.datasource.url=jdbc:sqlite:/volumes/sqlite.db
```

⚠️ **IMPORTANT:** Every time you change your POJO schema:
```bash
rm /volumes/sqlite.db
# Then restart Spring Boot to recreate the tables
```

**Tasks:**

1. **Create your data entity**
   - Copy the Jokes entity as a template
   - Modify fields to match your data object
   - Add JPA annotations (`@Entity`, `@Id`, `@GeneratedValue`, etc.)

2. **Validate schema creation**
   - Install [SQLite Extension](https://marketplace.visualstudio.com/items?itemName=alexcvzz.vscode-sqlite) in VS Code
   - Open `/volumes/sqlite.db` after Spring starts
   - Verify your table exists with correct columns and types
   - Screenshot the schema and add to your blog

3. **Blog deliverable: "Database Schema & Persistence"**
   - Explain your data object's relational schema (fields, types, constraints)
   - Screenshot SQLite table structure
   - Explain how JPA annotations map your POJO to database tables
   - Document any relationships (foreign keys, joins)
   - Discuss database design decisions (why certain fields, why certain types)

---

### Phase 3: REST API Endpoint

**Objective:** Expose your data object via HTTP endpoints using Spring Boot REST controller.

**Your API will follow this pattern:**
```
GET    /api/data/{id}           → Retrieve one data object
GET    /api/data               → Retrieve all data objects  
POST   /api/data               → Create new data object
PUT    /api/data/{id}          → Update existing data object
DELETE /api/data/{id}          → Delete data object
```

**Tasks:**

1. **Build REST Controller** (`@RestController`)
   - Create `DataController` (replace "Data" with your entity name)
   - Define endpoints for GET, POST, PUT (minimum required)
   - Use `@GetMapping`, `@PostMapping`, `@PutMapping` annotations
   - Return JSON responses with proper HTTP status codes (200, 201, 404, 500)

2. **Build JPA Repository** (extend `JpaRepository`)
   - Create a repository interface for your OCS entity
   - Extend `JpaRepository<YourEntity, Long>`
   - Add custom query methods if needed (e.g., `findByName(String name)`)
   - Leverage Spring Data JPA to handle common CRUD operations

3. **Test with Postman**
   - [Postman API Testing Guide](https://www.geeksforgeeks.org/basics-of-api-testing-using-postman/)
   - Create requests for each endpoint (GET all, GET by ID, POST, PUT)
   - Use `localhost:8585` as your base URL
   - **Save your Postman collection** — this is part of your deliverable
   - Include example JSON payloads and responses

4. **Blog deliverable: "REST API & Testing"**
   - Document each endpoint (URL, method, parameters, response)
   - Show Postman request/response screenshots for each operation
   - Explain the controller code: how `@GetMapping`, `@PostMapping` work
   - Explain the repository: how Spring Data JPA auto-generates queries
   - Share your Postman collection (export as JSON)
   - Discuss error handling: What happens when you request a non-existent ID?

---

### Phase 4: Frontend Implementation (Choose One)

**You now connect your frontend to the Spring Boot API from Phase 3.**

#### **Option A: GitHub Pages Frontend (Recommended for Portfolio)**

Your portfolio website calls your Spring Backend.

**Tasks:**

1. **Create frontend form** in your GitHub Pages portfolio repo
   - HTML form or button interface for your OCS object
   - "Minimal typing" philosophy — mostly buttons and dropdowns
   - Form should support:
     - **Read:** Display list of all objects, view details of one object
     - **Create/Update:** Form to add or modify an OCS object
     - Fetch data from API on page load
     - Submit form to API via `fetch()` or axios

2. **Use config.js for backend URL**
   - Define your Spring API URL in a central config file
   - This allows easy migration: change one line when team deploys backend

3. **Implement Read & Update operations**
   - **Read:** `GET /api/ocs` → fetch all; `GET /api/ocs/{id}` → fetch one
   - **Update:** `PUT /api/ocs/{id}` → update existing
   - Handle async responses (promise chains or async/await)
   - Display results in your page (table, list, card layout)
   - Show errors gracefully

4. **Blog deliverable: "Full-Stack GitHub Pages Frontend"**
   - Screenshot your frontend interface
   - Explain how frontend calls the API (fetch vs. axios)
   - Show your `config.js` setup
   - Demonstrate the flow: click button → API call → display response
   - Link to your GitHub Pages frontend
   - Discuss CORS considerations (if applicable)

#### **Option B: Thymeleaf Admin Dashboard**

Your Spring Boot application serves both API and admin pages.

**Tasks:**

1. **Create Thymeleaf templates** in `src/main/resources/templates`
   - HTML forms for CRUD operations on your OCS object
   - Thymeleaf variable bindings: `th:value="${object.name}"`, `th:each`, etc.
   - Form actions POST to your Spring endpoints

2. **Create admin controller** (`@Controller`) separate from REST controller
   - Render Thymeleaf templates for GET requests
   - Redirect after POST/PUT (POST-Redirect-GET pattern)
   - Pass model data to templates

3. **Implement Read & Update pages**
   - **List page:** Display all OCS objects in a table
   - **Detail page:** Show one OCS object's details
   - **Form page:** Create/edit OCS object with form submission
   - Add delete button (confirm before deleting)

4. **Blog deliverable: "Full-Stack Thymeleaf Admin Dashboard"**
   - Screenshot admin pages
   - Show Thymeleaf template code and explain bindings
   - Explain controller logic (routing, model binding)
   - Demonstrate CRUD operations in action
   - Discuss server-side rendering advantages
   - Link to deployed admin dashboard

---

### Phase 5: Portfolio Documentation (Blog)

**Your blog IS your portfolio evidence.** Each phase above has a blog deliverable.

**Each blog post should include:**

- Clear explanation of what you built (the "why")
- Code snippets from your implementation (the "how")
- Screenshots showing it working (the "proof")
- Connection to AP CSA concepts (the "learning")
- Reflection on decisions you made

**Consolidate your blog posts into ONE comprehensive post or a series:**

- Post 1: POJO Design & AP CSA
- Post 2: Database Schema & JPA
- Post 3: REST API Architecture
- Post 4: Full-Stack Frontend (choose A or B)

---

## N@tM Integration: Individual → Team

**This individual project becomes the foundation for your team's N@tM final.**

- **Your data object** may become a domain entity the team adopts and evolves
- **Your API** provides a reference implementation the team can build upon
- **Your frontend** demonstrates a working pattern (GitHub Pages or Thymeleaf) the team can adapt
- **OCS path (optional):** If your ideation solves a real OCS need, your Scrum Master may pitch it for adoption. Expect refinement—your individual work is a prototype, not a finished product. If your object is accepted into OCS, it represents successful ideation and team alignment.
- **Scrum Master role:** Coordinate with the teacher and team during planning to discuss whether any ideations have OCS potential

**Planning requirement:** Table conversations during this sprint must include ideation discussions. Everyone should have a clear idea of their object and what problem it solves for the team's N@tM project.

---

## Technical Requirements Summary

| Requirement | Details |
|---|---|
| **POJO** | Represents your data object; includes Lombok annotations |
| **JPA Entity** | Mapped to SQLite table; auto-created by Spring |
| **Repository** | Extends `JpaRepository<T, Long>` for CRUD operations |
| **REST Controller** | At least 5 endpoints: GET all, GET by ID, POST, PUT, DELETE |
| **HTTP Testing** | Postman collection with example requests/responses |
| **Frontend** | GitHub Pages form (Option A) OR Thymeleaf dashboard (Option B) |
| **Read/Update Ops** | Fetch data from API and update database via API |
| **Blog Documentation** | 4 posts minimum: POJO, Database, API, Frontend |
| **Portfolio Evidence** | Links to code repo, Postman collection, blog posts, deployed frontend |

---

## Resources


### Core Documentation

- **[Spring Framework Documentation](https://spring.io/projects/spring-framework)** — Official, comprehensive, free
- **[Spring Guides](https://spring.io/guides)** — Step-by-step tutorials for Spring Boot and Spring Data JPA
- **[Spring Data JPA Reference](https://docs.spring.io/spring-data/jpa/docs/current/reference/html/#reference)** — Complete JPA documentation
- **[Project Lombok Features](https://projectlombok.org/features/)** — Annotations for eliminating boilerplate

### Tutorials & Guides

- **[Baeldung Spring Boot Tutorials](https://www.baeldung.com/spring-boot)** — Practical examples (mix of free and premium)
- **[Java Brains Spring Boot Playlist](https://www.youtube.com/playlist?list=PLqq-6Pq4lTTZSKAFG6aCDVDP86Qx4lNas)** — Free video tutorials
- **[Java Brains Spring Data JPA Playlist](https://www.youtube.com/playlist?list=PLqq-6Pq4lTTaLMoFMHlYBG6cFZyX_cgIc)** — JPA deep dive
- **[Postman API Testing Guide](https://www.geeksforgeeks.org/basics-of-api-testing-using-postman/)** — Test your endpoints

### Tools & Extensions

- **[SQLite3 Editor for VS Code](https://marketplace.visualstudio.com/items?itemName=alexcvzz.vscode-sqlite)** — Validate your database schema
- **[Postman](https://www.postman.com/)** — Test API endpoints before building frontend
- **[Spring Boot DevTools](https://spring.io/guides/gs/spring-boot/)** — Auto-reload for faster development

---

## Concept Connections: From Flask to Spring to AP CSA

You've already done this with **Flask + GitHub Pages**. Spring is the enterprise-grade version of the same pattern:

| Concept | Flask | Spring Boot | AP CSA Connection |
|---|---|---|---|
| **Data Object** | Python class | POJO + @Entity | Class definition & encapsulation |
| **Database** | SQLAlchemy models | JPA/Hibernate | Persistent data structures |
| **API Layer** | `@app.route()` | `@RestController` | Method abstraction & interface design |
| **Frontend** | HTML/CSS/JS | GitHub Pages OR Thymeleaf | Client-server communication |
| **Testing** | Postman | Postman | Verification & validation |

**The flow is identical:** Design object → Persist data → Expose API → Connect frontend.

---

## Grading Criteria

| Criterion | Excellent | Proficient | Developing |
|---|---|---|---|
| **POJO Design** | Clear, well-documented object with Lombok; connects to AP CSA concepts | POJO works; partial documentation | Missing Lombok or unclear design |
| **Database Schema** | Correct table structure; screenshot validated; schema documented | Table created; minor issues | Schema errors or missing validation |
| **REST API** | All 5 endpoints work; error handling; Postman tests included | 3-4 endpoints; basic testing | Incomplete endpoints or missing tests |
| **Frontend** | Fully functional; integrates with API; clean UI; uses config.js | Mostly works; minimal styling | Incomplete or non-functional |
| **Blog Documentation** | 4+ detailed posts with code, screenshots, and AP CSA connections | 3 posts; basic explanations | <3 posts or missing evidence |

---

## FAQ

**Q: Do I have to choose one OCS object, or can I do multiple?**  
A: Start with ONE well-designed object. If you complete Phase 4 early, you can add a second object and associated endpoints.

**Q: Can I work with my team during this assignment?**  
A: This is your individual project, but table planning is required. You can share ideas and code patterns, but your implementation must be yours.

**Q: What if I don't know what data object to implement?**  
A: Talk with your Scrum Master and teacher. Good starting objects: User, Project, Resource, Challenge, Badge, Event, Feedback.

**Q: My database schema changed. Why doesn't Spring update it automatically?**  
A: With `ddl-auto=create-drop`, Spring recreates tables on startup. If data exists, you must manually delete `/volumes/sqlite.db` before restarting.

**Q: Can I use an embedded database instead of SQLite?**  
A: SQLite is required for this assignment (easier to inspect and debug). Once you master Spring, you can use any JPA database.

**Q: I'm deploying Option A (GitHub Pages). How do I handle CORS?**  
A: Your Spring backend must allow cross-origin requests. Add:
```java
@RestController
@CrossOrigin(origins = "https://your-github-pages-url.com")
public class YourController { ... }
```

---

## Submission Checklist

- [ ] POJO with Lombok annotations (Phase 1)
- [ ] SQLite schema validated via extension (Phase 2)
- [ ] 5 working endpoints tested in Postman (Phase 3)
- [ ] Frontend form/dashboard connected to API (Phase 4)
- [ ] 4+ blog posts with code, screenshots, and reflections
- [ ] Postman collection exported and included
- [ ] Links to: code repo, frontend deployment, blog posts
- [ ] N@tM integration plan discussed with team
- [ ] Code follows CSA naming conventions and style

---

## Questions?

Refer to the individual lesson links at the top, discuss with your table group, or ask your Scrum Master for guidance.
