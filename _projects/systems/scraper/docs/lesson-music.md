---
layout: post
title: "Scraper Lesson 1 — Music"
description: Build a scraper JSON payload for a music category listing
permalink: /scraper/lesson-music/
---

<p>
  <strong>Scraper</strong> ·
  <a href="{{ '/scraper/' | relative_url }}">Home</a> ·
  <a href="{{ '/scraper/lesson-music/' | relative_url }}">Lesson 1 — Music</a> ·
  <a href="{{ '/scraper/lesson-vacation/' | relative_url }}">Lesson 2 — Vacation</a>
</p>

## Goal

Build a valid JSON payload and scrape the **music** category. You should understand how `url`, `itemsSelector`, `fields`, `pagination`, and `limits` fit together.

## Target payload

```json
{
  "url": "https://books.toscrape.com/catalogue/category/books/music_14/index.html",
  "pagination": {
    "type": "nextLink",
    "selector": "li.next a",
    "attr": "href"
  },
  "itemsSelector": "article.product_pod",
  "fields": {
    "title": { "selector": "h3 a", "mode": "attr", "attr": "title" },
    "detailLink": { "selector": "h3 a", "mode": "attr", "attr": "href" },
    "price": { "selector": ".price_color", "mode": "text" },
    "stock": { "selector": ".instock.availability", "mode": "text" }
  },
  "limits": {
    "maxPages": 2,
    "maxItems": 30,
    "maxConcurrency": 4,
    "timeoutMs": 15000
  }
}
```

## Tasks

- [ ] Run the payload and confirm you get multiple music items.
- [ ] Add `ratingClass` from `p.star-rating` with `mode: "attr"` and `attr: "class"`.
- [ ] Set `maxPages` to `1` and note how the result count changes.
- [ ] In one sentence: why must `itemsSelector` match each card, not the whole page?

## Runner

<div id="scraper-app" data-template="music"></div>
<script src="{{ '/assets/js/projects/scraper/scraper.js' | relative_url }}"></script>
