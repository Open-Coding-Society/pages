---
layout: opencs
permalink: /java/apidocumentation
title: Java API Documentation
author: Mihir Bapat
---

## Notes API — step‑by‑step guide

This guide assumes your project uses the standard Spring Boot layout (`src/main/java/...`, resources) and Maven wrappers (mvnw). Use the package base `com.open.spring.mvc.notes` for the example files.

Summary of what this guide covers how to add. This guide uses a Note API as an example to create.
- DTO: NoteDto (request/response contract)
- JPA Entity: Note
- Repository: NoteRepository (extends JpaRepository)
- Service: NoteService (business logic, transactions)
- Controller: NoteApiController (REST endpoints)
- Exception: ResourceNotFoundException and a small ControllerAdvice

Keep entities and DTOs separate. Always validate incoming requests.

---

1) Define the API contract (DTO)
- File: src/main/java/com/open/spring/mvc/notes/NoteDto.java
- Purpose: validate client input and shape responses

Example:
```java
package com.open.spring.mvc.notes;

import jakarta.validation.constraints.NotBlank;

public class NoteDto {
    private Long id;

    @NotBlank(message = "text is required")
    private String text;

    // optional metadata
    private String author;

    // getters & setters
}
```

Why DTOs?
- Avoid exposing internal entity details (timestamps, internal ids, sensitive fields).
- Easier validation and versioning.

---

2) Create the JPA entity
- File: src/main/java/com/open/spring/mvc/notes/Note.java

Example:
```java
package com.open.spring.mvc.notes;

import jakarta.persistence.*;

@Entity
@Table(name = "note")
public class Note {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String text;

    private String author;

    // constructors, getters, setters
}
```

Notes:
- Use `@Column(nullable=false)` to enforce DB-level constraints where appropriate.
- Align column names with your DB conventions.

---

3) Add the repository
- File: src/main/java/com/open/spring/mvc/notes/NoteRepository.java

Example:
```java
package com.open.spring.mvc.notes;

import org.springframework.data.jpa.repository.JpaRepository;

public interface NoteRepository extends JpaRepository<Note, Long> {
    // add query methods as needed, e.g., findByAuthor
}
```

Why use JpaRepository:
- Gives CRUD methods and paging/sorting for free.

---

4) Implement the service layer
- File: src/main/java/com/open/spring/mvc/notes/NoteService.java

Example:
```java
package com.open.spring.mvc.notes;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
public class NoteService {
    private final NoteRepository repo;

    public NoteService(NoteRepository repo) { this.repo = repo; }

    public List<Note> list() { return repo.findAll(); }

    public Note get(Long id) {
        return repo.findById(id).orElseThrow(() -> new ResourceNotFoundException("Note", id));
    }

    @Transactional
    public Note create(Note note) { return repo.save(note); }

    @Transactional
    public Note update(Long id, Note updated) {
        Note existing = get(id);
        existing.setText(updated.getText());
        existing.setAuthor(updated.getAuthor());
        return repo.save(existing);
    }

    @Transactional
    public void delete(Long id) { repo.deleteById(id); }
}
```

Why service:
- Keeps controllers thin.
- Centralizes transactions and business rules.

---

5) Controller: expose REST endpoints
- File: src/main/java/com/open/spring/mvc/notes/NoteApiController.java

Example:
```java
package com.open.spring.mvc.notes;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import java.net.URI;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/notes")
public class NoteApiController {
    private final NoteService svc;

    public NoteApiController(NoteService svc) { this.svc = svc; }

    @GetMapping
    public ResponseEntity<List<NoteDto>> list() {
        List<NoteDto> out = svc.list().stream().map(this::entityToDto).collect(Collectors.toList());
        return ResponseEntity.ok(out);
    }

    @GetMapping("/{id}")
    public ResponseEntity<NoteDto> get(@PathVariable Long id) {
        return ResponseEntity.ok(entityToDto(svc.get(id)));
    }

    @PostMapping
    public ResponseEntity<NoteDto> create(@Valid @RequestBody NoteDto dto) {
        Note saved = svc.create(dtoToEntity(dto));
        return ResponseEntity.created(URI.create("/api/notes/" + saved.getId())).body(entityToDto(saved));
    }

    @PutMapping("/{id}")
    public ResponseEntity<NoteDto> update(@PathVariable Long id, @Valid @RequestBody NoteDto dto) {
        Note updated = svc.update(id, dtoToEntity(dto));
        return ResponseEntity.ok(entityToDto(updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        svc.delete(id);
        return ResponseEntity.noContent().build();
    }

    private Note dtoToEntity(NoteDto d) {
        Note n = new Note();
        n.setText(d.getText());
        n.setAuthor(d.getAuthor());
        return n;
    }

    private NoteDto entityToDto(Note n) {
        NoteDto d = new NoteDto();
        d.setId(n.getId());
        d.setText(n.getText());
        d.setAuthor(n.getAuthor());
        return d;
    }
}
```

Key points:
- Use `@Valid` to run validation from DTO annotations.
- Return appropriate status codes (201 on create, 204 on delete).
- Map entity ↔ DTO explicitly.

---

6) Exception handling (nice-to-have)
- File: src/main/java/com/open/spring/system/ResourceNotFoundException.java
- File: src/main/java/com/open/spring/system/ApiExceptionHandler.java

Examples:

ResourceNotFoundException:
```java
package com.open.spring.system;

public class ResourceNotFoundException extends RuntimeException {
    public ResourceNotFoundException(String resource, Object id) {
        super(resource + " not found: " + id);
    }
}
```

ControllerAdvice:
```java
package com.open.spring.system;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpStatus;
import org.springframework.web.method.annotation.MethodArgumentNotValidException;
import java.util.stream.Collectors;

@ControllerAdvice
public class ApiExceptionHandler {
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<?> handleNotFound(ResourceNotFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", ex.getMessage()));
    }

    @ExceptionHandler(org.springframework.web.bind.MethodArgumentNotValidException.class)
    public ResponseEntity<?> handleValidation(org.springframework.web.bind.MethodArgumentNotValidException ex) {
        var errors = ex.getBindingResult().getFieldErrors().stream()
            .collect(Collectors.toMap(f -> f.getField(), f -> f.getDefaultMessage()));
        return ResponseEntity.badRequest().body(Map.of("errors", errors));
    }
}
```

---

7) Test the API using Postman