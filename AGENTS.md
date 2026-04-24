# 🧠 Core Programming Principles for `AGENT.md`

## 1. Single Responsibility Principle (SRP)

**Rule:** Every function, class, and module should have one clear reason to change.

* Avoid “god functions” that handle multiple concerns.
* If you describe a function with “and”, it likely violates SRP.
* Prefer composition over large multi-purpose units.

---

## 2. Separation of Concerns

Split logic into clear layers:

* UI / interface layer
* Business logic layer
* Data / persistence layer
* Utility/helpers (pure functions)

**Agent rule:** Never mix data access with business logic unless explicitly justified.

---

## 3. Simplicity over Cleverness

* Prefer readable code over “clever” abstractions.
* Avoid premature optimization.
* If a junior engineer can’t understand it in 30 seconds → simplify.

---

## 4. Explicit Over Implicit

* Make dependencies visible
* Avoid hidden state changes
* Avoid “magic behavior” (implicit globals, side effects)

---

## 5. Functional Purity (when possible)

* Prefer pure functions (same input → same output)
* Minimize side effects
* Isolate I/O, network, and filesystem operations

---

## 6. Fail Fast Principle

* Validate inputs early
* Raise errors immediately with clear messages
* Don’t silently ignore failures

---

## 7. Defensive Programming

* Assume inputs are invalid or malicious
* Add guards for edge cases
* Never trust external data sources

---

## 8. DRY (Don’t Repeat Yourself)

* Extract repeated logic into shared functions
* BUT: don’t over-abstract early (balance with SRP)

---

## 9. YAGNI (You Aren’t Gonna Need It)

* Don’t build features unless required now
* Avoid speculative generalization

---

## 10. Clear Naming Conventions

Names should:

* Explain *intent*, not implementation
* Avoid abbreviations unless standard
* Be consistent across codebase

Bad: `procData2()`
Good: `normalizeUserTransactionData()`

---

## 11. Testing Philosophy

* Every critical logic path should be testable
* Prefer unit tests for logic, integration tests for flows
* Tests should describe behavior, not implementation

Agent rule:

> If code changes behavior, update or add tests.

---

## 12. Deterministic Behavior First

* Avoid randomness unless explicitly required
* Ensure reproducibility in ML / data pipelines
* Fix seeds when needed

---

## 13. Performance Awareness (but not premature optimization)

* Know complexity of key operations (O(n), O(n²))
* Optimize only after correctness is guaranteed
* Profile before optimizing

---

## 14. Logging & Observability

* Log meaningful events, not noise
* Logs should answer: *what happened and why?*
* Avoid logging sensitive data

---

## 15. Error Handling Discipline

* Never swallow exceptions silently
* Always include context in errors
* Use typed/custom errors where appropriate

---

## 16. Code Structure Rules

* Prefer modular files over large monoliths
* Keep file sizes reasonable (soft rule: <300–500 lines)
* Group by feature, not by type (often better for scaling systems)

---

## 17. Agent-Specific Rules (important for AGENT.md)

These are *very useful if you're building an AI coding agent*:

### Planning First

* For non-trivial tasks: write a short plan before coding
* Break into steps before implementation

### Change Minimal Code

* Prefer minimal diffs over refactors unless required
* Don’t rewrite working code without reason

### Verify Assumptions

* If unclear, infer cautiously and flag assumptions
* Never silently guess critical requirements

### Prefer Existing Patterns

* Match existing codebase style and structure
* Don’t introduce new architecture unless necessary

---

## 18. Code Review Heuristics (Agent self-check)

Before finalizing code, check:

* Does each function do one thing?
* Is any logic duplicated?
* Are there hidden side effects?
* Are names self-explanatory?
* Is error handling complete?
* Is this the simplest correct solution?

---

# 🧩 Optional Advanced Sections (if you want a strong AGENT.md)

## Architecture Preference

* Prefer modular monolith over microservices unless scale demands it
* Avoid over-engineering distributed systems early

## Dependency Rules

* Minimize dependencies
* Prefer standard library first
* Avoid adding libraries unless justified by complexity reduction

## Security Awareness

* Sanitize inputs
* Avoid eval-like patterns
* Never expose secrets in logs or errors

---

# ⚙️ Example AGENT.md Structure

You can structure it like this:

```
# Agent Programming Guidelines

## Core Principles
- SRP
- Simplicity over cleverness
- Explicit over implicit

## Architecture Rules
- Separation of concerns
- Feature-based modularity

## Coding Standards
- Naming conventions
- Error handling
- Logging rules

## Testing Rules
- Behavior-driven tests
- Critical path coverage required

## Agent Behavior Rules
- Plan before coding
- Minimize diffs
- Follow existing patterns

## Anti-Patterns
- God functions
- Hidden side effects
- Over-engineering
```

---

# If you want to go further

I can help you turn this into:

* a **high-performance SWE agent prompt**
* a **Cursor / Claude / GPT coding agent spec**
* or a **self-improving AGENT.md that evolves with your codebase**

Just tell me.
