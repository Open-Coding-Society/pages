---
layout: post
title: Scraper Lesson 2 - Vacation JSON Builder
description: Build and customize a scraper payload for a travel/vacation listing page
permalink: /scraper/lessons/vacation-json/
---

## Lesson Goal

Construct a scraper JSON payload for a **vacation/travel** style dataset and practice renaming fields for business use.

You will learn:

- how to map raw page data to meaningful output keys
- how to tune limits for faster runs
- how to debug selector mistakes quickly

## Step 1: Start with a Travel Dataset

We will use the travel category page and rename fields to fit a vacation use case.

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

## Step 2: Completion Tasks

- [ ] Run the starter payload and verify all 4 fields are returned.
- [ ] Rename `budgetPrice` to `tripCost` and re-run.
- [ ] Add `ratingClass` from `p.star-rating` using mode `attr`.
- [ ] Intentionally break one selector, run it, and document the failure behavior.
- [ ] Restore the selector and produce a successful final run.

## Step 3: Reflection Prompt

In 3-5 sentences, answer:

1. Which field was hardest to model and why?
2. How do `limits` help with reliability and safety?
3. What would you change if the target site had no next-page link?

## Example Runner

This runner is preloaded with the **vacation/travel** template:

<div id="scraper-app" data-template="vacation"></div>
<script src="{{ '/assets/js/projects/scraper/scraper.js' | relative_url }}"></script>

