---
layout: post
assignment: true
title: Java Spring Hacks - Sprint 1 Final
description: Full-stack project using Spring Boot API, JPA, and POJO backed by your OCS system ideation. Individual project, team integration.
permalink: /java/spring/hacks/
courses: {'csa': {'week': 3}}
categories: ['Java Spring']
---

## Overview: Spring Boot Full-Stack Development with OCS System Ideation

This assignment is your **individual ideation phase** for the Trimester 1 N@tM final project, due at the end of Sprint 1. You will design and build a full-stack application centered on a **data-driven object** that could enhance your OCS system. This is both an individual learning experience in Spring Boot architecture AND a potential foundation for your team's N@tM deliverable. **For this round, you maintain your own template and portfolio**; OCS integration may happen later if your ideation is selected and refined for adoption.

### Remember the Jokes Example

You just saw the Jokes application. Your project follows the same path with a system object of your own:

```text
Jokes entity -> JokesJpaRepository -> JokesApiController -> endpoint -> UI
Your entity  -> YourRepository      -> YourController      -> endpoint -> UI
```

- [View the Jokes runtime](https://pages.opencodingsociety.com/java/spring/jokes)
- [View the Jokes frontend source](https://github.com/Open-Coding-Society/pages/blob/main/hacks/api-usage/jokes_spring.md): fetches `/api/jokes/`, renders rows, and sends button updates.
- [View `Jokes.java`](https://github.com/Open-Coding-Society/spring/blob/master/src/main/java/com/open/spring/mvc/jokes/Jokes.java): the entity and database fields.
- [View `JokesJpaRepository.java`](https://github.com/Open-Coding-Society/spring/blob/master/src/main/java/com/open/spring/mvc/jokes/JokesJpaRepository.java): the JPA data access layer.
- [View `JokesApiController.java`](https://github.com/Open-Coding-Society/spring/blob/master/src/main/java/com/open/spring/mvc/jokes/JokesApiController.java): the `/api/jokes` endpoints.

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

#### **Option A: Spring Boot REST API + GitHub Pages Frontend**

- **Backend:** Spring Boot running on `localhost:8585` with SQLite database
- **API Endpoints:** `/api/data/*` — RESTful endpoints returning JSON
- **Frontend:** Static GitHub Pages (HTML/CSS/JavaScript) in your portfolio repo
- **Connection:** Fetch calls from frontend to `/api` backend via `config.js` proxy
- **Security (Order 1):** Processed first; CORS configuration allows cross-origin requests; stateless API
- **Why:** Mirrors your Flask + GitHub Pages experience; leverages your portfolio repo
- **Best for:** Showcase projects, portfolios, public-facing applications, decoupled frontend/backend

#### **Option B: Spring Boot MVC + Thymeleaf Admin Dashboard**

- **Backend:** Spring Boot with embedded Thymeleaf templates (server-side rendering)
- **MVC Endpoints:** `/mvc/data/*` — Controller routing serving HTML pages
- **Frontend:** Admin pages served directly by Spring Boot (Thymeleaf templates)
- **Connection:** HTML forms POST to `/mvc` endpoints; responses rendered server-side
- **Security (Order 2):** Processed after the `/api` chain; traditional session-based auth, CSRF tokens, same-origin only
- **Why:** Simpler deployment; single JAR artifact; built-in CSRF protection; tighter security
- **Best for:** Internal tools, admin dashboards, CRUD applications, monolithic architecture

**Critical distinction:** Both use the same POJO → JPA architecture, but the endpoint prefix and security chain differ:

- **Option A (`/api`):** Stateless REST, CORS-enabled, frontend/backend separation
- **Option B (`/mvc`):** Stateful MVC, session-based, server-rendered HTML

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

### Phase 3: Backend Endpoints (API or MVC)

**Objective:** Expose your data object via HTTP endpoints using Spring Boot controllers.

**Choose your endpoint pattern based on your architecture choice:**

#### **If Option A (GitHub Pages Frontend):** Build `/api` REST Endpoints

```text
GET    /api/data              → Retrieve all data objects (JSON)
GET    /api/data/{id}         → Retrieve one data object (JSON)
POST   /api/data              → Create new data object (JSON request/response)
PUT    /api/data/{id}         → Update existing data object (JSON)
DELETE /api/data/{id}         → Delete data object
```

- Return JSON responses only
- Use `@RestController` and `@CrossOrigin` for CORS support
- Stateless (no session required)

#### **If Option B (Thymeleaf Frontend):** Build `/mvc` MVC Endpoints

```text
GET    /mvc/data              → Display list of all data objects (HTML)
GET    /mvc/data/{id}         → Display one data object details (HTML)
GET    /mvc/data/new          → Display creation form (HTML)
POST   /mvc/data              → Process form submission, create data object
GET    /mvc/data/{id}/edit    → Display edit form (HTML)
POST   /mvc/data/{id}         → Process form submission, update data object
POST   /mvc/data/{id}/delete  → Delete data object
```

- Return HTML responses (rendered Thymeleaf templates)
- Use `@Controller` (not `@RestController`)
- Session-based with CSRF tokens in forms
- Redirect after POST (POST-Redirect-GET pattern)

**Tasks:**

#### **If Option A (REST API):**

1. **Build REST Controller** (`@RestController`)
   - Create `DataController` (replace "Data" with your entity name)
   - Annotate with `@RestController` and `@CrossOrigin` (for GitHub Pages CORS)
   - Define endpoints with `@GetMapping`, `@PostMapping`, `@PutMapping`, `@DeleteMapping`
   - Return JSON responses with proper HTTP status codes (200, 201, 404, 500)
   - Example: `@RestController @CrossOrigin @RequestMapping("/api/data")`

2. **Build JPA Repository** (extend `JpaRepository`)
   - Create a repository interface for your data entity
   - Extend `JpaRepository<YourEntity, Long>`
   - Add custom query methods if needed (e.g., `findByName(String name)`)
   - Leverage Spring Data JPA to handle common CRUD operations

3. **Test with Postman**
   - [Postman API Testing Guide](https://www.geeksforgeeks.org/basics-of-api-testing-using-postman/)
   - Create requests for each endpoint (GET all, GET by ID, POST, PUT, DELETE)
   - Use `localhost:8585/api/data` as your base URL
   - **Save your Postman collection** — this is part of your deliverable
   - Include example JSON payloads and responses

#### **If Option B (MVC with Thymeleaf):**

1. **Build MVC Controller** (`@Controller`)
   - Create `DataController` (replace "Data" with your entity name)
   - Annotate with `@Controller` (NOT `@RestController`)
   - Define endpoints with `@GetMapping` and `@PostMapping`
   - Return template names (Thymeleaf will render HTML)
   - Example: `@Controller @RequestMapping("/mvc/data")`

2. **Build JPA Repository** (extend `JpaRepository`)
   - Create a repository interface for your data entity
   - Extend `JpaRepository<YourEntity, Long>`
   - Add custom query methods if needed
   - Inject into controller with `@Autowired`

3. **Build Thymeleaf Templates** (`src/main/resources/templates/data/`)
   - Create templates: `list.html`, `detail.html`, `form.html`
   - Use Thymeleaf expressions: `th:value="${data.name}"`, `th:each`, `th:if`
   - Include CSRF token in forms: `<input type="hidden" th:name="${_csrf.parameterName}" th:value="${_csrf.token}" />`
   - Use forms to submit POST requests to `/mvc/data` endpoints

4. **Test with Browser**
   - Navigate to `localhost:8585/mvc/data`
   - Click through list → detail → edit form → delete
   - Verify form submissions work and redirect properly
   - Check browser DevTools for CSRF tokens in form data

5. **Blog deliverable: "Backend Implementation & Testing"**

   - Document your chosen endpoint pattern (`/api` or `/mvc`)
   - Explain controller code: request mapping, method signatures, return types
   - **For REST API:** Show Postman screenshots for each endpoint
   - **For MVC:** Show browser screenshots of form workflows
   - Explain the repository: how Spring Data JPA auto-generates queries
   - Discuss error handling: What happens on edge cases?
   - Compare REST vs MVC: Why did you choose your option?

---

### Phase 4: Frontend Implementation

**The frontend differs based on your architecture choice from Phase 3.**

#### **Option A: GitHub Pages Frontend (Additional Work)**

Your portfolio website fetches data from your Spring `/api` backend.

**Tasks:**

1. **Create frontend page** in your GitHub Pages portfolio repo
   - HTML form or interface for your data object
   - "Minimal typing" philosophy — mostly buttons and dropdowns
   - Page should support:
     - **Read:** Display list of all objects, view details of one object
     - **Create/Update:** Form to add or modify data
     - Fetch data from `/api/data` endpoint on page load
     - Submit form to `/api/data` endpoints via `fetch()` or axios

2. **Use config.js for backend URL**
   - Define your Spring API URL in a central config file:

     ```javascript
     const API_BASE_URL = "http://localhost:8585/api/data";
     ```

   - This allows easy migration: change one line when team deploys backend

3. **Implement Read & Update operations**
   - **Read:** `GET /api/data` → fetch all; `GET /api/data/{id}` → fetch one
   - **Create:** `POST /api/data` → submit form data
   - **Update:** `PUT /api/data/{id}` → update existing object
   - Handle async responses (promise chains or async/await)
   - Display results in your page (table, list, card layout)
   - Show errors gracefully to user

4. **Blog deliverable: "GitHub Pages Frontend Integration"**
   - Screenshot your frontend interface
   - Explain how frontend calls the `/api` endpoints (fetch vs. axios)
   - Show your `config.js` setup and why it matters
   - Demonstrate the flow: click button → fetch call → display response
   - Link to your GitHub Pages frontend
   - Discuss CORS: How does GitHub Pages frontend talk to Spring backend?

#### **Option B: Thymeleaf MVC (Already Complete)**

**You already built your frontend in Phase 3!** The Thymeleaf templates ARE your frontend.

**Tasks for Phase 4 (Blog Only):**

1. **Blog deliverable: "Full-Stack MVC Application"**
   - Document your complete architecture: POJO → JPA → MVC Controller → Thymeleaf Templates
   - Show screenshots of each page:
     - List view (`/mvc/data`): Display all data objects in table
     - Detail view (`/mvc/data/{id}`): Show one object's full details
     - Edit form (`/mvc/data/{id}/edit`): Form for updating
     - Confirmation/success messages after POST submissions
   - Explain your controller code:
     - How `@Controller` routes requests differently from `@RestController`
     - Model binding: How data flows from controller → template
     - Redirect pattern: Why `POST /mvc/data` redirects to `GET /mvc/data`
   - Explain your Thymeleaf templates:
     - Variable expressions (`th:value`, `th:text`, `th:each`)
     - CSRF token handling: Why it's required and how it works
     - Form structure: How Thymeleaf forms POST to your controller
   - Compare MVC vs REST API: Why you chose the monolithic approach
   - Discuss security: How server-side rendering provides CSRF protection automatically

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

| Requirement | Option A (REST API) | Option B (MVC) |
|---|---|---|
| **POJO** | Represents your data object; includes Lombok annotations | (same) |
| **JPA Entity** | Mapped to SQLite table; auto-created by Spring | (same) |
| **Repository** | Extends `JpaRepository<T, Long>` for CRUD operations | (same) |
| **Endpoints** | `/api/data/*` — 5 REST endpoints returning JSON | `/mvc/data/*` — MVC endpoints serving HTML |
| **Controller** | `@RestController` with `@CrossOrigin` | `@Controller` returning template names |
| **HTTP Testing** | Postman collection (automated testing) | Browser workflow (manual testing) |
| **Security Chain** | Order 1 (First) — Stateless, CORS-based | Order 2 (After `/api`) — Session-based, CSRF tokens |
| **Frontend** | GitHub Pages (separate) calls `/api` endpoints | Thymeleaf templates served by Spring (integrated) |
| **Read/Update Ops** | JavaScript fetch calls to `/api/data` | HTML forms POST to `/mvc/data` |
| **Blog Documentation** | 5 posts: POJO, Database, API, GitHub Pages Frontend, Architecture | 5 posts: POJO, Database, MVC Architecture, Templates, Security |

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

## Architecture Deep Dive: API vs MVC Security

This is where your architectural choice matters most. The security chain (Order 1 vs Order 2) fundamentally changes how your application works.

### REST API Architecture (`/api` - Option A)

**Security Chain (Order 1 - Processed first, before `MvcSecurityConfig`):**

- Stateless authentication (no sessions)
- CORS validation for cross-origin requests
- Often: Bearer token or API key authentication
- No CSRF tokens (stateless = CSRF not applicable)

**Flow:**

```text
GitHub Pages (https://yourname.github.io)
   ↓ fetch("http://localhost:8585/api/data")
Spring @RestController (@CrossOrigin)
   ↓ CORS check: origin allowed?
   ↓ Return JSON response
GitHub Pages receives JSON and renders
```

**Benefit:** Clean separation; your frontend and backend are independent microservices. Easy for team to split work: frontend dev vs backend dev.

### MVC Architecture (`/mvc` - Option B)

**Security Chain (Order 2 - Processed after the `/api` chain):**

- Session-based authentication (HttpSession)
- CSRF token validation (same-origin only)
- Form-based login/logout
- Tighter coupling of frontend & backend

**Flow:**

```text
Browser → GET /mvc/data
   ↓ Spring Session created (JSESSIONID cookie)
Spring @Controller renders Thymeleaf template
   ↓ Thymeleaf inserts CSRF token in form
Browser displays HTML form with CSRF token
   ↓ User submits form (POST /mvc/data)
Spring validates CSRF token
   ↓ Process form, update database
Spring redirects to GET /mvc/data (fresh list)
Browser displays updated page
```

**Benefit:** Everything in one JAR; automatic CSRF protection; simpler deployment. Better for admin dashboards where UI and logic are tightly coupled.

### Why This Matters for Your Project

- **Choose Option A if:** You want your portfolio frontend independent (show separation of concerns to employers/AP CS graders)
- **Choose Option B if:** You want to show monolithic, server-side rendering skills (traditional web app pattern)
- **Team's decision:** Will influence whether they later layer Thymeleaf UI over your `/api` endpoints (common pattern)

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

**Q: What's the difference between `/api` and `/mvc` endpoints?**  
A: This is foundational to your architecture choice:

- **`/api` endpoints** (Option A): Stateless REST, return JSON, no CSRF tokens needed, frontend is separate (GitHub Pages)
- **`/mvc` endpoints** (Option B): Stateful session-based, return HTML, CSRF tokens required, frontend is same Spring app
- Choose one based on whether you want separation of concerns (REST) or monolithic integration (MVC)

**Q: Why does Option A use Order(1) security and Option B use Order(2)?**  
A: Spring Security evaluates filter chains in order. The `/api` filter chain is processed first with `Order(1)`, before `MvcSecurityConfig`; the MVC filter chain then handles `/mvc` requests with `Order(2)`. The `securityMatcher` path rules and `@Order` determine the chain, not `@Controller` versus `@RestController`.

**Q: Do I need CSRF tokens in Option A (/api)?**  
A: No. CSRF (Cross-Site Request Forgery) only applies to browser cookies. Your `/api` endpoints are stateless, so CSRF is not a threat. GitHub Pages fetch calls don't send session cookies automatically.

**Q: Can I add Thymeleaf templates to an Option A REST API?**  
A: Yes, but that's not this assignment. This gives you a preview of what the team might do later: Layer a Thymeleaf `/mvc` UI on top of your stateless `/api` backend. Both endpoints would work simultaneously.

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
