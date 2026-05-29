---
layout: post
title: Scraper Lesson 1 - Music JSON Builder
description: Learn how to build a valid scraper JSON payload for a music listing page
permalink: /scraper/lessons/music-json/
---

## Lesson Goal

Build a JSON payload from scratch and scrape a **music category listing**.

By the end, you should understand:

- how `url`, `itemsSelector`, and `fields` work together
- how pagination is modeled in JSON
- how `limits` protects your scraper from overloading a site

## Step 1: Understand the JSON Shape

Your scraper request has five main parts:

1. **`url`** - where scraping starts.
2. **`pagination`** - how to find the next page.
3. **`itemsSelector`** - CSS selector for each repeated card/item.
4. **`fields`** - what data to extract from each item.
5. **`limits`** - guardrails (`maxPages`, `timeoutMs`, etc.).

## Step 2: Build Your Music Payload

Use this as your baseline target:

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

## Step 3: Complete the Student Tasks

- [ ] Run the payload and confirm you get a list of music books.
- [ ] Add a new field named `ratingClass` from `p.star-rating` with mode `attr`.
- [ ] Change `maxPages` to `1` and compare output size.
- [ ] Explain why `itemsSelector` must point to each item card, not the whole page.

## Example Runner

This runner is preloaded with the **music** template:

<div id="scraper-app" data-template="music"></div>
<script src="{{ '/assets/js/projects/scraper/scraper.js' | relative_url }}"></script>

