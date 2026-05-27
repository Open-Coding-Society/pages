---
layout: post
title: Spring Scraper — Systems Project
description: Frontend runner for the generic Spring scraper API
permalink: /scraper/
---

## Overview

This `_projects/systems/scraper` project provides a **barebones frontend UI** to call the Spring Boot scraper API at `POST /api/scraper/run`.

- **Backend**: `ScraperController` in the Spring repo (`/api/scraper/run`, `ScrapeRequest` / `ScrapeResponse`)
- **Frontend**: Small Jekyll-driven page plus a vanilla JS runner
- **Auth**: Requires a logged-in user so the JWT cookie is sent with the request

The UI lives on this docs page and is rendered into the `#scraper-app` container by `assets/js/projects/scraper/scraper.js`.

## Using the Scraper UI

1. **Log in** to the Spring-backed site (so your JWT cookie is present).
2. Visit this page: `/scraper/`.
3. In the **Request JSON** box, paste a `ScrapeRequest` payload or click **Load Example**.
4. Click **Run Scraper**.
5. The **Response** panel will show the JSON returned by `ScrapeResponse` or an error payload.

The default example uses the books demo:

```json
{
  "url": "https://books.toscrape.com/",
  "pagination": {
    "type": "nextLink",
    "selector": "li.next a",
    "attr": "href"
  },
  "itemsSelector": "article.product_pod",
  "fields": {
    "title": { "selector": "h3 a", "mode": "attr", "attr": "title" },
    "link": { "selector": "h3 a", "mode": "attr", "attr": "href" },
    "price": { "selector": ".price_color", "mode": "text" },
    "availability": { "selector": ".instock.availability", "mode": "text" },
    "ratingClass": { "selector": "p.star-rating", "mode": "attr", "attr": "class" }
  },
  "limits": {
    "maxPages": 3,
    "maxItems": 60,
    "maxConcurrency": 6,
    "timeoutMs": 15000
  }
}
```

## How the Frontend Calls Spring Boot

The runner script uses a simple `fetch` call:

```javascript
fetch("/api/scraper/run", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  credentials: "include",              // send JWT cookie
  body: JSON.stringify(scrapeRequest)  // your JSON payload
});
```

- **Path**: relative `/api/scraper/run` so it works on localhost and production.
- **Method**: `POST`.
- **Body**: A `ScrapeRequest` JSON payload like the example above.
- **Auth**: `credentials: "include"` ensures the existing JWT cookie is attached.

The backend `SecurityConfig` restricts `/api/scraper/**` to authenticated roles (`ROLE_USER`, `ROLE_STUDENT`, etc.), so you must be logged in for the call to succeed.

## Embedded UI Container

The docs page includes a minimal container that the JS runner mounts into:

<div id="scraper-app"></div>
<script src="{{ '/assets/js/projects/scraper/scraper.js' | relative_url }}"></script>

Reference snippet:

```html
<div id="scraper-app"></div>
<script src="{{ '/assets/js/projects/scraper/scraper.js' | relative_url }}"></script>
```

The `_projects` build system copies `js/scraper.js` to `assets/js/projects/scraper/scraper.js`, and the `docs` target publishes this page to `_posts/projects/scraper/`.

