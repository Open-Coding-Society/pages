---
layout: post
title: "Scraper Lesson 2 — Vacation"
description: Customize scraper JSON for a travel/vacation listing
permalink: /scraper/lesson-vacation/
---

<p>
  <strong>Scraper</strong> ·
  <a href="{{ '/scraper/' | relative_url }}">Home</a> ·
  <a href="{{ '/scraper/lesson-music/' | relative_url }}">Lesson 1 — Music</a> ·
  <a href="{{ '/scraper/lesson-vacation/' | relative_url }}">Lesson 2 — Vacation</a>
</p>

## Goal

Scrape the **travel** category and practice renaming `fields` keys for a vacation-style dataset.

## Target payload

```json
{
  "url": "https://books.toscrape.com/catalogue/category/books/travel_2/index.html",
  "pagination": {
    "type": "nextLink",
    "selector": "li.next a",
    "attr": "href"
  },
  "itemsSelector": "article.product_pod",
  "fields": {
    "destinationTitle": { "selector": "h3 a", "mode": "attr", "attr": "title" },
    "listingLink": { "selector": "h3 a", "mode": "attr", "attr": "href" },
    "budgetPrice": { "selector": ".price_color", "mode": "text" },
    "status": { "selector": ".instock.availability", "mode": "text" }
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

- [ ] Run the starter payload and verify all four fields appear in the response.
- [ ] Rename `budgetPrice` to `tripCost` and run again.
- [ ] Add `ratingClass` from `p.star-rating` (`mode: "attr"`, `attr: "class"`).
- [ ] Break one selector on purpose, observe the error, then fix it for a clean final run.

## Reflection

Answer briefly: (1) hardest field to model, (2) why `limits` matter, (3) what you would change if there were no next-page link.

## Runner

<div id="scraper-app" data-template="vacation"></div>
<script src="{{ '/assets/js/projects/scraper/scraper.js' | relative_url }}"></script>
