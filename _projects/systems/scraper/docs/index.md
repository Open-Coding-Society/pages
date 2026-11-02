---
layout: post
title: Scraper System
description: Hub for scraper lessons and the live JSON runner
permalink: /scraper/
---

<p>
  <strong>Scraper</strong> ·
  <a href="{{ '/scraper/' | relative_url }}">Home</a> ·
  <a href="{{ '/scraper/getting-started/' | relative_url }}">Getting Started</a> ·
  <a href="{{ '/scraper/lesson-music/' | relative_url }}">Lesson 1 — Music</a> ·
  <a href="{{ '/scraper/lesson-vacation/' | relative_url }}">Lesson 2 — Vacation</a> ·
  <a href="{{ '/scraper/my-scrapes/' | relative_url }}">My Scrapes</a>
</p>

## What this system does

The Spring scraper API accepts a JSON `ScrapeRequest` and returns scraped items. This project is the **frontend + lessons** for building those JSON files and testing them live.

New to this? Start with [Getting Started]({{ '/scraper/getting-started/' | relative_url }}) — no JSON or CSS experience assumed.

| Piece | Location |
| --- | --- |
| Backend API | `POST /api/scraper/run` (Spring, port `8585` locally) |
| Runner UI | Below on this page |
| Lessons | [Getting Started]({{ '/scraper/getting-started/' | relative_url }}) · [Music]({{ '/scraper/lesson-music/' | relative_url }}) · [Vacation]({{ '/scraper/lesson-vacation/' | relative_url }}) |
| Saved results | [My Scrapes]({{ '/scraper/my-scrapes/' | relative_url }}) |

## JSON request shape

Every payload uses the same five sections:

| Key | Purpose |
| --- | --- |
| `url` | Start page to scrape |
| `pagination` | How to follow “next page” links |
| `itemsSelector` | CSS selector for each repeated item on the page |
| `fields` | Named outputs (`selector`, `mode`, optional `attr`) |
| `limits` | `maxPages`, `maxItems`, `maxConcurrency`, `timeoutMs` |

Log in first so your JWT cookie is sent with the request.

## Runner (books example)

<div id="scraper-app" data-template="books"></div>
<script src="{{ '/assets/js/projects/scraper/scraper.js' | relative_url }}"></script>
