---
layout: cs-portfolio-lesson
title: "Submodule 3"
description: "Submodule 3 of Backend Development Mini-Quest"
permalink: /cs-portfolio-quest/backend/submodule_3/
parent: "Backend Development"
team: "Encrypters"
submodule: 3
categories: [CSP, Submodule, Backend]
tags: [backend, submodule, encrypters]
author: "Encrypters Team"
date: 2025-10-21

---


## Backend Frameworks

### Flask vs Spring Boot

| Aspect | Flask (Python) | Spring Boot (Java) |
|--------|----------------|-------------------|
| **Philosophy** | Microframework - minimal, add as needed | Full-featured - everything included |
| **Learning Curve** | Low - simple to start | Moderate - more concepts upfront |
| **Boilerplate** | Minimal code needed | More verbose, explicit |
| **Type Safety** | Dynamic typing | Static typing (compile-time checks) |
| **Performance** | Good (fast enough for most) | Excellent (JVM optimization) |
| **Best For** | Prototypes, ML APIs, small teams | Enterprise apps, microservices, large teams |
| **Deployment** | Lightweight (MB) | Heavier (tens of MB) |

---

## When to Use Each Framework

### Choose Flask When:

- **Rapid Prototyping**: Need an MVP in hours/days  
- **Data Science/ML**: Integrating with NumPy, Pandas, TensorFlow, PyTorch  
- **Simple REST APIs**: Straightforward CRUD without complex business logic  
- **Small Teams**: Quick onboarding, less ceremony  
- **Python Ecosystem**: Leveraging existing Python libraries

---

### Choose Spring Boot When:

- **Enterprise Applications**: Banking, insurance, healthcare systems  
- **Microservices**: Spring Cloud ecosystem for distributed systems  
- **High Performance**: Stock trading, payment processing, real-time systems  
- **Large Teams**: Strong typing helps prevent bugs across teams  
- **Long-Term Projects**: Better for long term yer maintenance 

---


## Flask Architecture & Structure

### Flask: Minimal Setup

**Installation:**
```bash
pip install flask flask-sqlalchemy flask-cors
```

**Project Structure:**
```
social_api/
├── app.py                 # Main application
├── models.py              # Database models
├── routes/
│   ├── users.py          # User endpoints
│   └── posts.py          # Post endpoints
├── requirements.txt       # Dependencies
└── config.py             # Configuration
```

### Flask Core Concepts

#### 1. Routing (Simple Functions)
```python
from flask import Flask, jsonify, request

app = Flask(__name__)

@app.route('/api/posts', methods=['GET'])
def get_posts():
    posts = Post.query.all()
    return jsonify([p.to_dict() for p in posts])

@app.route('/api/posts', methods=['POST'])
def create_post():
    data = request.json
    post = Post(title=data['title'], content=data['content'])
    db.session.add(post)
    db.session.commit()
    return jsonify(post.to_dict()), 201
```

**Key Points:**
- Routes are simple functions decorated with `@app.route`
- Manually handle JSON parsing with `request.json`
- Explicitly return status codes

#### 2. Database with SQLAlchemy
```python
from flask_sqlalchemy import SQLAlchemy

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///social.db'
db = SQLAlchemy(app)

class Post(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    content = db.Column(db.Text, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    
    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'content': self.content
        }
```

#### 3. Request Validation (Manual)
```python
@app.route('/api/users', methods=['POST'])
def register():
    data = request.json
    
    # Manual validation
    if not data.get('username'):
        return jsonify({'error': 'Username required'}), 400
    if not data.get('email'):
        return jsonify({'error': 'Email required'}), 400
    if len(data.get('password', '')) < 8:
        return jsonify({'error': 'Password too short'}), 400
    
    # Create user
    user = User(username=data['username'], email=data['email'])
    db.session.add(user)
    db.session.commit()
    
    return jsonify(user.to_dict()), 201
```

***Flask Strengths*** include fast development, being direct, being flexible for different structures, and being easy to integrate with data.
***Flask Challenges*** can be derived from strengths, like having messy code due to its flexibility and having errors from typos.

---

## Spring Boot Architecture


**Project Structure:**
```
my-spring-app/
├── src/main/java/com/example/demo/
│   ├── DemoApplication.java      # Main entry point
│   ├── controller/               # REST endpoints
│   │   └── PostController.java
│   ├── service/                  # Business logic
│   │   └── PostService.java
│   ├── repository/               # Database access
│   │   └── PostRepository.java
│   └── entity/                   # Database models
│       └── Post.java
├── src/main/resources/
│   └── application.properties    # Configuration
└── pom.xml                       # Dependencies (Maven)
```

### Spring Boot Core Concepts

#### Inversion of Control (IoC) 

**Without IoC (Tight Coupling):**
```java
public class OrderService {
    private EmailService emailService = new EmailService();  // ❌ Creates dependency
}
```

**With IoC (Loose Coupling):**
```java
@Service
public class OrderService {
    private final EmailService emailService;
    
    @Autowired  // Spring injects this automatically
    public OrderService(EmailService emailService) {
        this.emailService = emailService;
    }
}
```

**Benefits:**
- Easy to test (inject mock EmailService)
- Swap implementations without changing code
- Spring manages object lifecycle

#### Layered Architecture

**Controller Layer (HTTP Handling):**
```java
@RestController
@RequestMapping("/api/posts")
public class PostController {
    private final PostService postService;
    
    @Autowired
    public PostController(PostService postService) {
        this.postService = postService;
    }
    
    @GetMapping
    public ResponseEntity<List<Post>> getAllPosts() {
        return ResponseEntity.ok(postService.findAll());
    }
    
    @PostMapping
    public ResponseEntity<Post> createPost(@RequestBody Post post) {
        Post created = postService.create(post);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Post> getPost(@PathVariable Long id) {
        return ResponseEntity.ok(postService.findById(id));
    }
}
```

**Service Layer (Business Logic):**
```java
@Service
@Transactional  // Automatic transaction management
public class PostService {
    private final PostRepository postRepository;
    
    @Autowired
    public PostService(PostRepository postRepository) {
        this.postRepository = postRepository;
    }
    
    public List<Post> findAll() {
        return postRepository.findAll();
    }
    
    public Post findById(Long id) {
        return postRepository.findById(id)
            .orElseThrow(() -> new PostNotFoundException(id));
    }
    
    public Post create(Post post) {
        // Validation
        if (post.getTitle() == null || post.getTitle().isEmpty()) {
            throw new IllegalArgumentException("Title is required");
        }
        return postRepository.save(post);
    }
}
```

**Repository Layer (Database Access):**
```java
@Repository
public interface PostRepository extends JpaRepository<Post, Long> {
    // Spring generates implementation automatically!
    
    List<Post> findByTitleContaining(String keyword);
    List<Post> findByUserId(Long userId);
    
    @Query("SELECT p FROM Post p WHERE p.createdAt > ?1")
    List<Post> findRecentPosts(LocalDateTime since);
}
```

**Entity Layer (Database Model):**
```java
@Entity
@Table(name = "posts")
public class Post {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, length = 200)
    private String title;
    
    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;
    
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User author;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    // Constructors, getters, setters
}
```

#### 3. Automatic Validation
```java
@Entity
public class User {
    @NotBlank(message = "Username is required")
    @Size(min = 3, max = 50)
    private String username;
    
    @Email(message = "Email must be valid")
    @NotBlank
    private String email;
    
    @Size(min = 8, message = "Password must be at least 8 characters")
    private String password;
}

// In Controller
@PostMapping
public ResponseEntity<User> create(@Valid @RequestBody User user) {
    // @Valid automatically validates based on annotations
    return ResponseEntity.ok(userService.create(user));
}
```

***Spring Boot Strengths*** are mainly in the fact that Spring has a clear structure to follow, along with others like *type safety* and *built in validation*.
***Spring Boot Challenges*** include the steeper learning curve and needing more setup and code due to its structure and larger scale.
---

## How code looks in Spring Boot and Flask

### Creating a Post Endpoint

**Flask:**
```python
@app.route('/api/posts', methods=['POST'])
def create_post():
    data = request.json
    
    if not data.get('title'):
        return {'error': 'Title required'}, 400
    
    post = Post(title=data['title'], content=data['content'])
    db.session.add(post)
    db.session.commit()
    
    return post.to_dict(), 201
```

**Spring Boot:**
```java
// Controller
@PostMapping
public ResponseEntity<Post> createPost(@Valid @RequestBody Post post) {
    Post created = postService.create(post);
    return ResponseEntity.status(HttpStatus.CREATED).body(created);
}

// Service
@Transactional
public Post create(Post post) {
    validatePost(post);
    return postRepository.save(post);
}

// Repository
public interface PostRepository extends JpaRepository<Post, Long> {
    // Spring provides save() automatically
}
```

**Key Differences:**
- Flask: One function does everything
- Spring: Separated into Controller → Service → Repository
- Flask: Manual validation
- Spring: `@Valid` annotation + automatic validation
- Flask: Manual transaction management
- Spring: `@Transactional` handles it

---

## Configuration Files

### Flask Configuration
```python
# config.py
class Config:
    SQLALCHEMY_DATABASE_URI = 'sqlite:///app.db'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SECRET_KEY = 'your-secret-key'

# app.py
app = Flask(__name__)
app.config.from_object(Config)
```

### Spring Boot Configuration
```properties
# application.properties
spring.datasource.url=jdbc:h2:mem:testdb
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
server.port=8080
```

---

## Testing

### Flask Testing
```python
def test_create_post():
    response = client.post('/api/posts', 
        json={'title': 'Test', 'content': 'Content'})
    assert response.status_code == 201
    assert response.json['title'] == 'Test'
```

### Spring Boot Testing
```java
@SpringBootTest
@AutoConfigureMockMvc
public class PostControllerTest {
    
    @Autowired
    private MockMvc mockMvc;
    
    @Test
    public void testCreatePost() throws Exception {
        mockMvc.perform(post("/api/posts")
            .contentType(MediaType.APPLICATION_JSON)
            .content("{\"title\":\"Test\",\"content\":\"Content\"}"))
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.title").value("Test"));
    }
}
```
--- 

## Key Takeaways

### Flask 
- **Simplicity**: Write code, not configuration
- **Flexibility**: Choose your own tools
- **Speed**: Prototype to production quickly
- **Python Power**: Leverage data science ecosystem

### Spring Boot 
- **Convention over Configuration**: Sensible defaults
- **Enterprise Ready**: Production features built-in
- **Type Safety**: Catch bugs early
- **Scalability**: Built for millions of requests

### Summary
- **Flask**: Best for small-to-medium projects, ML APIs, rapid development
- **Spring Boot**: Best for enterprise apps, microservices, large teams
- **Both are systems that work**, it is important to choose based on the needs of the system.

## Quick Quiz — Module 3 (Interactive)

Answer the five questions below. Pick the best choice (A–D) and click Submit to see your score.

<div id="mc-quiz-3" style="border:1px solid #e0e0e0;padding:12px;border-radius:6px;max-width:900px;">
  <form id="quiz-form-3">
    <ol>
      <li>
        <div style="margin-bottom:6px">What does this Flask decorator do?
        <pre style="display:inline-block;margin:6px 0;padding:6px;border-radius:4px;background:#f7f7f7">@app.route('/api/posts', methods=['GET'])</pre>
        </div>
        <div><label><input type="radio" name="q0" value="A"> A. Binds a function to that URL and HTTP method (defines an endpoint)</label></div>
        <div><label><input type="radio" name="q0" value="B"> B. Runs the function only when the server starts</label></div>
        <div><label><input type="radio" name="q0" value="C"> C. Defines a database table named /api/posts</label></div>
        <div><label><input type="radio" name="q0" value="D"> D. Automatically secures the route with authentication</label></div>
      </li>

      <li>
        <div style="margin-bottom:6px">In Spring Boot's layered architecture, which layer should contain business logic?</div>
        <div><label><input type="radio" name="q1" value="A"> A. Controller</label></div>
        <div><label><input type="radio" name="q1" value="B"> B. Service</label></div>
        <div><label><input type="radio" name="q1" value="C"> C. Repository</label></div>
        <div><label><input type="radio" name="q1" value="D"> D. Entity</label></div>
      </li>

      <li>
        <div style="margin-bottom:6px">What is a primary benefit of IoC / dependency injection?</div>
        <div><label><input type="radio" name="q2" value="A"> A. Makes code run faster by removing all objects</label></div>
        <div><label><input type="radio" name="q2" value="B"> B. Easier to test and swap implementations without changing callers</label></div>
        <div><label><input type="radio" name="q2" value="C"> C. Automatically creates database tables</label></div>
        <div><label><input type="radio" name="q2" value="D"> D. Forces static typing in the codebase</label></div>
      </li>

      <li>
        <div style="margin-bottom:6px">In SQLAlchemy, what is the role of a column declared with primary_key=True?</div>
        <div><label><input type="radio" name="q3" value="A"> A. It is ignored by the database</label></div>
        <div><label><input type="radio" name="q3" value="B"> B. Acts as the unique identifier for each row</label></div>
        <div><label><input type="radio" name="q3" value="C"> C. Encrypts the column values automatically</label></div>
        <div><label><input type="radio" name="q3" value="D"> D. Prevents that column from being returned in queries</label></div>
      </li>

      <li>
        <div style="margin-bottom:6px">Which HTTP status code is most appropriate when a POST request successfully creates a new resource?</div>
        <div><label><input type="radio" name="q4" value="A"> A. 200 OK</label></div>
        <div><label><input type="radio" name="q4" value="B"> B. 201 Created</label></div>
        <div><label><input type="radio" name="q4" value="C"> C. 204 No Content</label></div>
        <div><label><input type="radio" name="q4" value="D"> D. 404 Not Found</label></div>
      </li>
    </ol>

    <div style="margin-top:12px;">
      <button type="submit" id="quiz-submit-3">Submit</button>
      <button type="button" id="quiz-reset-3" style="margin-left:8px">Reset</button>
      <span id="quiz-result-3" style="margin-left:12px;font-weight:600"></span>
    </div>
  </form>
</div>

<script>
(() => {
  const form = document.getElementById('quiz-form-3');
  const resultSpan = document.getElementById('quiz-result-3');
  const resetBtn = document.getElementById('quiz-reset-3');

  // Hidden answers
  const answers = ['A','B','B','B','B'];

  function setDisabled(disabled) {
    document.querySelectorAll('#mc-quiz-3 input').forEach(i => i.disabled = disabled);
    document.getElementById('quiz-submit-3').disabled = disabled;
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
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
    resultSpan.textContent = '';
    setDisabled(false);
  });
})();
</script>

## Vocab Picker — Module 3

Three short vocabulary questions. For each, choose the best term from the dropdown and click Submit to see your total score.

<div id="vocab-picker-3" style="border:1px solid #e0e0e0;padding:12px;border-radius:6px;max-width:760px;margin-top:12px;">
  <form id="vocab-form-3">
    <ol>
      <li style="margin-bottom:8px;">
        <div><strong>1.</strong> Where should HTTP request handling live in a Spring Boot app?</div>
        <select name="v0" style="margin-top:6px;width:240px;">
          <option value="">— select —</option>
          <option value="Controller">Controller</option>
          <option value="Service">Service</option>
          <option value="Repository">Repository</option>
          <option value="Entity">Entity</option>
        </select>
      </li>

      <li style="margin-bottom:8px;">
        <div><strong>2.</strong> What converts objects to database rows and back (library/tool)?</div>
        <select name="v1" style="margin-top:6px;width:240px;">
          <option value="">— select —</option>
          <option value="ORM">ORM</option>
          <option value="IoC">IoC</option>
          <option value="REST">REST</option>
          <option value="Schema">Schema</option>
        </select>
      </li>

      <li style="margin-bottom:8px;">
        <div><strong>3.</strong> Which format is commonly used for API request/response bodies?</div>
        <select name="v2" style="margin-top:6px;width:240px;">
          <option value="">— select —</option>
          <option value="XML">XML</option>
          <option value="CSV">CSV</option>
          <option value="JSON">JSON</option>
          <option value="YAML">YAML</option>
        </select>
      </li>
    </ol>

    <div style="margin-top:10px;">
      <button id="vocab-picker-submit-3">Submit</button>
      <button id="vocab-picker-reset-3" type="button" style="margin-left:8px">Reset</button>
      <span id="vocab-picker-result-3" style="margin-left:12px;font-weight:600"></span>
    </div>
  </form>
</div>

<script>
(() => {
  const form = document.getElementById('vocab-form-3');
  const submitBtn = document.getElementById('vocab-picker-submit-3');
  const resetBtn = document.getElementById('vocab-picker-reset-3');
  const resultSpan = document.getElementById('vocab-picker-result-3');

  // correct answers
  const answers = ['Controller','ORM','JSON'];

  submitBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const vals = [form.v0.value, form.v1.value, form.v2.value];
    let score = 0;
    for (let i = 0; i < answers.length; i++) if (vals[i] === answers[i]) score += 1;
    resultSpan.textContent = `You scored ${score} / ${answers.length}`;
    // disable selects and submit
    form.querySelectorAll('select').forEach(s => s.disabled = true);
    submitBtn.disabled = true;
  });

  resetBtn.addEventListener('click', () => {
    form.reset();
    resultSpan.textContent = '';
    form.querySelectorAll('select').forEach(s => s.disabled = false);
    submitBtn.disabled = false;
  });
})();
</script>

## Up Next
In the next submodule, you'll wrap up your learning on the backend. Keep progressing in order to receive a certificate for completing this module.
