---
microblog: true
toc: true
layout: post
title: CS113 Final Project Portfolio — Fortune Finders & Quant Trading
description: A semester-long portfolio blog covering full-stack work across finalpages and pagesBackend — gamified financial literacy, Spring REST APIs, ML indicators, game engine OOP, and CS113 competency evidence.
permalink: /capstone/sai-cs113-portfolio/
authors: Sai Talisetty
comments: true
sticky_rank: 2
---

## Overview

Over the past several months I built and integrated features across two repositories:

| Repository | Role | Live / deployed |
|------------|------|-----------------|
| [finalpages](https://github.com/ApplicatorsCSA/finalpages) | Jekyll frontend — Fortune Finders game, quant bot UI, lessons, capstone pages | [applicatorscsa.github.io/finalpages](https://applicatorscsa.github.io/finalpages/gamify/fortuneFindersv1-1) |
| [pagesBackend](https://github.com/Open-Coding-Society/pages) (Spring fork) | Java/Spring backend — bank API, quant endpoints, SQLite persistence | [spring.opencodingsociety.com](https://spring.opencodingsociety.com) |

The project connects **personal finance education** to **real software engineering**: students explore stocks, futures, and quantitative trading inside a game world, while the backend exposes the same APIs a professional fintech stack would use.

**Live Demos*

- Fortune Finders game: [/gamify/fortuneFindersv1-1](https://applicatorscsa.github.io/finalpages/gamify/fortuneFindersv1-1)
- Quant trading bot: [/gamify/fortuneFinders/quant](https://applicatorscsa.github.io/finalpages/gamify/fortuneFinders/quant)
- Futures mini-game: [/gamify/fortuneFinders/futures](https://applicatorscsa.github.io/finalpages/gamify/fortuneFinders/futures)
- Capstone infographic: [/capstone/quant-trading-bot/](https://applicatorscsa.github.io/finalpages/capstone/quant-trading-bot/)

---

## Personal & Social Relevance

Most students learn finance from worksheets. I wanted something closer to how people actually encounter markets — through exploration, mistakes, and guided practice.

Fortune Finders turns abstract concepts into playable levels:

- **Map 1 (Airport):** stocks, banking, crypto, and market terminals
- **Map 2 (Futures Exchange):** margin, leverage, and mark-to-market P/L
- **Quant bot:** indicators, ML training, backtesting, and paper trading

This addresses a real gap: financial literacy is socially relevant, but traditional curriculum rarely connects it to computing. By embedding lessons inside a game and wiring them to a Spring backend, learners see how **data, algorithms, and APIs** power the tools they use in real life.

**Ethical considerations I addressed**

- CORS and credential handling so cross-origin requests do not leak session data
- Public quant endpoints scoped to paper trading (no real money)
- Clear error messages when backend fetches fail (instead of silent broken UI)
- Teaching copy that explains risk (margin calls, overfitting, directional accuracy limits)

---

## What I Built

### Frontend (`finalpages`)

#### 1. Fortune Finders Game Engine (v1.1)

The game is an ES-module canvas engine under `assets/js/GameEnginev1.1/`. Levels are classes (`GameLevelAirport`, `GameLevelFuturesExchange`, etc.) registered in a chain and managed by `GameControl`.

Key work I contributed:

- **Futures Exchange level** — new map, NPC dialogue, gate progression, iframe mini-game integration via `postMessage`
- **Level transition fixes** — hard canvas cleanup so old NPCs do not block the next map
- **WaypointArrow singleton** — persistent wayfinding UI across levels without duplicate listeners
- **SVG asset pipeline** — replaced missing PNG sprites that caused giant red placeholder blocks
- **Lesson modals** — quant, futures, and options coding lessons linked from in-game NPCs

#### 2. Quant Trading Bot UI

A single-page app embedded in `_posts/gamify/2026-02-09-quantbot.md` that calls Spring endpoints under `/bank/quant/*`:

- Load market history (OHLCV)
- Calculate indicators (MA, RSI, Bollinger, MACD)
- Train ML models and view metrics
- Pull news sentiment
- Run backtests
- Execute paper trades

I integrated this with the site's global `window.javaURI` config so the same page works locally (`localhost:8585`) and on GitHub Pages (`spring.opencodingsociety.com`).

#### 3. Futures Mini-Game & Lessons

The futures mini-game simulates 10 trading days with margin, contract sizing, and random-walk price movement. Completing it sends `postMessage` back to the parent game to unlock progression.

Supporting lesson pages explain client/server architecture, `fetch`, and financial concepts in plain language.

### Backend (`pagesBackend`)

#### 1. Bank REST API

`BankApiController` exposes banking and quant endpoints at both `/bank` and `/api/bank`:

```java
@RestController
@RequestMapping({ "/bank", "/api/bank" })
public class BankApiController {
    // Deposits, withdrawals, and /bank/quant/* endpoints
}
```

#### 2. Quant Service Layer

Separate service classes follow MVC separation:

| Service | Responsibility |
|---------|----------------|
| `MarketDataService` | Alpha Vantage API + CSV fallback, `ConcurrentHashMap` cache |
| `IndicatorService` | SMA, RSI, Bollinger Bands, MACD |
| `MLService` | Linear regression via Gaussian elimination |
| `NewsService` | Sentiment snapshots (stub, feeds ML features) |
| `BacktestService` | Strategy simulation |
| `PaperTradeService` | In-memory portfolios per person |

#### 3. Persistence & Security

- **SQLite** via JPA/Hibernate — `Bank` entity with JSON columns for quest/NPC progress
- **CORS** configured for GitHub Pages origins with `allowCredentials: true`
- **Docker** — Temurin 21 JDK, Maven build, port 8585

---

## CS113 Competency Evidence

Below is how my work maps to the Mira Costa CS113 rubric.

### Data Structures

| Requirement | Evidence | Where |
|-------------|----------|-------|
| **Collections** | `ArrayList`, `HashMap`, `LinkedHashMap`, `ConcurrentHashMap` | `Bank.java` profit/quest maps; `MarketDataService` cache; `PaperTradeService` portfolios |
| **Lists** | Bar history lists, indicator series, trade history | `IndicatorService`, quant frontend tab rendering |
| **Stacks/Queues** | Waypoint step ordering (FIFO progression through NPCs) | `WaypointArrow.js` ordered waypoint list |
| **Trees** | Random Forest model type + decision-tree-style ML classification | `MLService.trainAndPredict()`, `LoanRiskCalculator` ensemble |
| **Sets** | Unique NPC IDs, unique tickers in cache keys | `Bank.npcProgress`, market data cache keys |
| **Dictionaries/Maps** | Key-value config, personId → portfolio, ticker → bars | `HashMap` throughout backend; frontend JSON state objects |
| **Graphs** | Wayfinding graph — NPC nodes connected by progression edges; BFS-style "next waypoint" traversal | `WaypointArrow.js`, `NpcProgressSystem` |

### Algorithms

| Requirement | Evidence | Where |
|-------------|----------|-------|
| **Searching** | Linear search over bars for date ranges; JPA `findByPersonId` | `MarketDataService`, `BankJpaRepository` |
| **Sorting** | Sort bars by date; Comparator for trade history | `IndicatorService`, backtest results |
| **Hashing** | `HashMap` for O(1) lookups; BCrypt for auth (platform-wide) | Backend services, `SecurityConfig` |
| **Algorithm analysis** | ML normal equations O(n³); indicator sliding windows O(n×period) | Documented in ML/indicator service logic |

### Object-Oriented Design

| Requirement | Evidence | Where |
|-------------|----------|-------|
| **Abstraction** | `Game` / `GameCore` base; service interfaces between controller and logic | `GameEnginev1.1/essentials/Game.js`, Spring service layer |
| **Encapsulation** | Private fields on `Bank`, `PaperPortfolio`; JS module scope | Entity classes, ES modules |
| **Inheritance** | `FinTech extends Game`, `Character extends GameObject`, `GameEnvBackground extends GameObject` | Game engine class hierarchy |
| **Polymorphism** | Level classes share `create()` contract; ML model type switch (`linear_regression`, `random_forest`, `lstm`) | `GameLevel*.js`, `MLService` |
| **Design patterns** | **MVC** (Spring), **Singleton** (`WaypointArrow`), **Repository** (`BankJpaRepository`), **DTO** (nested request classes) | Both repos |

### Software Development

| Requirement | Evidence | Where |
|-------------|----------|-------|
| **Version control** | Fork → feature branch → PR workflow; 20+ commits on quant/futures/engine | GitHub: `fortune-finders-quant-futures` branch |
| **Testing** | Manual browser testing, API verification via DevTools; platform JUnit exists | DevTools Network tab debugging; `GradeTest.java` (platform) |
| **Build tools** | Maven (`pom.xml`, `./mvnw`); Jekyll (`Gemfile`, `bundle exec jekyll serve`) | Both repos |
| **Debugging** | CORS/network error surfacing; canvas layer inspection; permalink 404 fix | Quant bot error messages; `GameControl` cleanup |
| **API development** | RESTful GET/POST with proper status codes and JSON bodies | `BankApiController` |
| **Database integration** | JPA entity, repository, `@OneToOne` Person relationship, JSON columns | `Bank.java`, `BankJpaRepository.java` |

### Deployment

| Requirement | Evidence | Where |
|-------------|----------|-------|
| **Docker** | Multi-stage build, Temurin 21, port 8585 | `pagesBackend/Dockerfile`, `docker-compose.yml` |
| **DNS** | Custom domain `spring.opencodingsociety.com` | Production backend |
| **nginx** | Platform reverse proxy (OCS infrastructure) | Production deployment |
| **CI/CD** | GitHub Actions Jekyll build for frontend | `.github/workflows/jekyll-gh-pages.yml` |

### Documentation

| Requirement | Evidence | Where |
|-------------|----------|-------|
| **Code comments** | JavaDoc on controllers; inline "why" comments in game engine fixes | `BankApiController.java`, `GameControl.js` |
| **API documentation** | Endpoint list in project README and quant overview page | `_projects/fortuneFinders/docs/README.md` |
| **Help system** | In-app tutorial, glossary, futures teaching dialogue, lesson pages | Quant bot tutorial; futures NPC dialogue |
| **Blog portfolio** | This post + capstone infographic + lesson pages | `/capstone/sai-cs113-portfolio/` |

---

## Programming Fundamentals (CS Foundations)

### Data Types & I/O

- **Frontend:** strings (tickers, dates), numbers (prices, P/L), booleans (long/short), arrays (OHLCV bars), JSON objects (API responses), DOM input validation
- **Backend:** Java primitives, `LocalDate`, JSON columns in SQLite via Hibernate, request DTOs

### Control Structures

- **Iteration:** game loop (`requestAnimationFrame`), bar-by-bar backtest simulation, indicator sliding windows
- **Conditions:** margin-call checks, insufficient-funds guard, NPC gating by progress
- **Error handling:** `try/catch` in level destroy and API fetch; `.then/.catch` patterns in frontend `fetch` wrappers

### Classes & OOP (JavaScript + Java)

**JavaScript (game engine):**

```javascript
class GameControl {
  transitionToLevel() {
    // Destroy old level, hard-remove stale canvases, create next level
  }
}
```

**Java (backend):**

```java
@Entity
public class Bank {
    private HashMap<String, List<List<Object>>> profitMap;
    public double assessRiskUsingML() { /* ensemble scoring */ }
}
```

---

## Software Engineering & SDLC Practices

### Planning & tracking

- Capstone brief with team roles (`_data/quant_infograph.yml`)
- Sprint objectives notebook referencing Fortune Finders gamification goals
- Iterative fix commits (`quantbot api fix attempt` → indicator fix → permalink fix → engine cleanup)

### Source control workflow

1. Fork `Open-Coding-Society/pages` (upstream)
2. Work on feature branches (`fortune-finders-quant-futures`)
3. Commit small, focused changes with descriptive messages
4. Open pull requests for review and integration
5. Merge upstream changes to stay current

### Build → test → verify cycle

| Step | Frontend | Backend |
|------|----------|---------|
| Build | `bundle exec jekyll serve` | `./mvnw spring-boot:run` |
| Test | Browser: load data, play game, transition maps | Postman / DevTools: hit `/bank/quant/market/history` |
| Verify | Check CORS headers, no 404 on permalinks, NPC clickability | Confirm JSON response shape matches frontend expectations |
| Deploy | Push to GitHub → Jekyll Actions → GitHub Pages | Docker build → spring.opencodingsociety.com |

---

## Retrospective: What Went Wrong & What I Learned

### Challenge 1: Frontend could not reach backend

**Symptom:** `Error: Failed to fetch` on GitHub Pages.

**Root causes:**
- Hardcoded `localhost:8585` API base
- Double-slash URLs (`/bank//quant/...`)
- CORS not enabled on the MVC security chain for `/bank/**`
- Endpoint path mismatch (`/bank/market/history` vs `/bank/quant/market/history`)

**Fix:** Align frontend to `window.javaURI`, normalize URL builder, enable CORS on both security chains, add explicit GitHub Pages origin.

**Lesson:** Full-stack bugs often look like "frontend broken" but are integration problems. Surfacing the exact URL in error messages cut debug time dramatically.

### Challenge 2: Game level transitions left ghost NPCs

**Symptom:** Red blocks covered the screen; old NPCs blocked clicks on Map 2.

**Root causes:**
- Canvas elements not removed when `destroy()` threw mid-loop
- Missing sprite files drew opaque red fallback squares at huge dimensions

**Fix:** Hard canvas cleanup in `GameControl.transitionToLevel()`, SVG assets with correct `pixels` dimensions, background image load guards.

**Lesson:** Resource lifecycle management matters as much as game logic. Always tear down DOM artifacts explicitly.

### Challenge 3: WaypointArrow duplication

**Symptom:** Removing the arrow on level transition caused duplicate instances and stacked event listeners.

**Fix:** Singleton pattern + stored handler references for proper cleanup.

**Lesson:** Persistent UI elements need different lifecycle rules than per-level objects.

---

## Timeline of Major Contributions

| Period | Focus | Key deliverables |
|--------|-------|------------------|
| Sep–Oct 2025 | OOP foundations | Pong class refactor, grading view frontend |
| Mar 2026 | Quant gamification | Capstone infographic, quant prefix fixes |
| Apr 2026 | Quant bot integration | API fixes, Load All button, indicator fixes, tutorial improvements |
| Apr 2026 | Futures level | `GameLevelFuturesExchange`, mini-game, SVG assets, teaching dialogue |
| Apr–May 2026 | Engine stability | Canvas cleanup, WaypointArrow singleton, sprite fixes, NPC overlap |
| May 2026 | Deployment polish | Permalink fix, PR to upstream, CORS alignment |

---

## Team & Collaboration

Quant capstone team (from capstone brief):

- **Anvay** — ML and backend architecture
- **Sai (me)** — Fortune Finders integration, quant UI, futures level, engine fixes, frontend-backend connection
- **Aashray** — Frontend features and deployment

Fortune Finders game engine core was built collaboratively; my primary ownership is the **quant bot integration**, **futures exchange level**, **level transition reliability**, and **cross-repo API alignment**.

---

## Conclusion

This project demonstrates CS113 competencies across the full stack: **data structures and algorithms** in Java services, **OOP and design patterns** in both Java and JavaScript, **REST API design** connecting frontend to backend, and **SDLC practices** including Git workflow, debugging, documentation, and deployment.

More importantly, it shows how computing can address a **socially relevant problem** — making financial literacy interactive, accessible, and technically honest about what models can and cannot predict.

**Repositories**

- Frontend: [github.com/ApplicatorsCSA/finalpages](https://github.com/ApplicatorsCSA/finalpages)
- Backend: [github.com/Open-Coding-Society/pages](https://github.com/Open-Coding-Society/pages) (Spring backend deployed separately as pagesBackend)
