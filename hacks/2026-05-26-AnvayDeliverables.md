---
layout: post
title: Final Deliverables & Blog
description: Anvay's Final Deliverables & Blog Post
breadcrumb: true
permalink: /capstone/AnvayDeliverables/
---

### Final Deliverables:


# CS 113 Capstone Blog: Fortune Finders

## Project Overview

Fortune Finders is an interactive financial education platform that teaches users about trading concepts, market data, options, futures, machine learning, and graph algorithms through a gamified learning environment.

My work focused on building interactive lessons, connecting lessons to the game engine, improving user workflow, and demonstrating CS 113 concepts through data structures, algorithms, object-oriented design, API usage, and documentation.

---

# Minimum Requirements Evidence

| Requirement | Evidence |
|---|---|
| Java Spring Boot backend | Backend API routes for market history, indicators, and ML training |
| 3+ data structures | Lists, maps, sets, and graph-style structures |
| 2+ algorithms | Searching, sorting, graph/pathfinding concepts, payoff calculations |
| OOP design | Game levels, NPCs, player objects, reusable lesson components |
| REST API | `fetch()` calls to backend endpoints |
| Database integration | Market history/data retrieval |
| Testing | JUnit/API testing documentation |
| Deployment | Docker, nginx, DNS documentation |
| Blog portfolio | This post documents design, code, and contributions |

---

# Sprint 7: Project Planning and Prototype

## Goals

- Build the first version of the Fortune Finders learning system
- Connect game levels to educational finance content
- Create interactive lessons for users
- Begin documenting data structures and algorithms

## Work Completed

- Created lesson pages for options and futures trading
- Added interactive UI components
- Connected game buttons to lesson pages
- Began organizing project documentation

---

# Sprint 8: Feature Expansion

## Goals

- Improve user interaction
- Add deeper algorithmic explanations
- Connect lessons to backend/API logic
- Prepare for individual CS 113 competency review

## API Usage Example

This code shows how the frontend requests market data from the backend. It demonstrates REST API usage and JSON data handling.

```javascript
const response = await fetch(`/bank/quant/market/history?ticker=${ticker}`);
const data = await response.json();
```

# CS 113 Requirements Evidence

This section highlights several technical concepts and implementations from my Fortune Finders capstone project that demonstrate CS 113 competency in data structures, algorithms, object-oriented programming, API integration, and interactive systems.

---

## Data Structures

### Lists

I used lists to organize and load game objects into the graph lesson.

```javascript
this.classes = [
  { class: GameEnvBackground, data: bgData },
  { class: Barrier, data: topBarrier },
  { class: Player, data: playerData },
  { class: NPC, data: stationAStar }
];
```

This demonstrates use of collections for dynamically managing game entities and level components.

---

## Algorithms

### Options Profit Algorithm

```javascript
const intrinsicValue = Math.max(0, price - strike);
const profit = intrinsicValue - premium;
```

This algorithm calculates options payoff values in real time for the interactive lesson.

### Time Complexity

```text
O(1)
```

The calculation only requires a fixed number of operations regardless of input size.

---

### Futures Margin Check

```javascript
if (balance < 1000) {
  document.getElementById('margin-call-alert').style.display = 'block';
}
```

This logic simulates a real futures margin call system when account balance falls below maintenance requirements.

---

## Object-Oriented Design

### Reusable Station Objects

```javascript
function station(id, greeting, xPos) {
  return {
    id,
    greeting,
    INIT_POSITION: { x: xPos, y: height * 0.48 }
  };
}
```

This demonstrates abstraction and modular design by allowing reusable NPC station creation throughout the graph lesson.

---

## REST API Usage

### Backend API Request

```javascript
const response = await fetch(`/bank/quant/market/history?ticker=${ticker}`);
const data = await response.json();
```

This demonstrates frontend-to-backend communication using RESTful APIs and JSON data handling.

---

## Graph Algorithms

### A* Heuristics Lesson

```javascript
const stationAStar = station(
  'A* Station',
  'A* uses f(n) = g(n) + h(n).',
  width * 0.48
);
```

The graph lesson teaches graph traversal and heuristic algorithms through interactive NPC stations explaining Dijkstra’s Algorithm, Greedy Best-First Search, and A* Search.

---

## Interactive Learning Systems

### ML Training Simulator

```javascript
function simulateMLTraining() {
  const model = document.getElementById('model-select').value;
  const lookback = document.getElementById('lookback-slider').value;
}
```

This feature allows users to experiment with machine learning parameters inside the lesson environment.

---

## Game Engine Integration

### Lesson Integration into Game

```javascript
{
  label: "Learn Coding Behind Futures",
  action: () => openReusableModal(
    "futuresLessonModal",
    "futuresLessonFrame",
    `${path}/gamify/fortuneFinders/futures-lesson`
  ),
  keepOpen: false
}
```

This connects educational lessons directly into the game engine workflow and improves user accessibility to learning content.

---