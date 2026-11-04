---
layout: post
title: "Scraper: Getting Started"
description: A beginner's walkthrough of the scraper system for CSSE and AP CSP students
permalink: /scraper/getting-started/
---

<p>
  <strong>Scraper</strong> ·
  <a href="{{ '/scraper/' | relative_url }}">Home</a> ·
  <a href="{{ '/scraper/getting-started/' | relative_url }}">Getting Started</a> ·
  <a href="{{ '/scraper/lesson-music/' | relative_url }}">Lesson 1 — Music</a> ·
  <a href="{{ '/scraper/lesson-vacation/' | relative_url }}">Lesson 2 — Vacation</a> ·
  <a href="{{ '/scraper/my-scrapes/' | relative_url }}">My Scrapes</a>
</p>

This page is for anyone trying the scraper for the first time — no prior JSON or CSS
experience assumed. By the end you will have run a real scrape, understood why it worked, made
one small change yourself, and saved the result. After this, [Lesson 1 — Music]({{ '/scraper/lesson-music/' | relative_url }})
and [Lesson 2 — Vacation]({{ '/scraper/lesson-vacation/' | relative_url }}) go further.

## What is a web scraper?

A web scraper reads a webpage the same way your browser does, then pulls out just the pieces
of information you actually want — instead of you copy-pasting them by hand, one at a time.

Think of a recipe website with a hundred recipes listed on one page. You want just the recipe
*names* and *prices*, not the ads, the footer, or the navigation menu. A scraper is a program
you give instructions to — "every recipe card looks like this, grab the name and price from
each one" — and it does the copy-pasting for you, instantly, across every page.

## Two things you need to recognize first

### 1. CSS selectors — "which part of the page?"

Every element on a webpage can be targeted by a **CSS selector** — a short piece of text that
says "find this specific thing." A few you'll see on this page:

| Selector | Means |
| --- | --- |
| `h3 a` | an `<a>` link that's inside an `<h3>` heading |
| `.price_color` | any element with `class="price_color"` (the `.` means "class") |
| `article.product_pod` | an `<article>` element that also has `class="product_pod"` |

You don't need to memorize these — you just need to recognize that a selector is how you tell
the scraper *where* to look.

### 2. JSON — "the instructions, written down"

JSON is just a structured way to write down information using `{ }`, `[ ]`, and
`"key": "value"` pairs. Every scrape request on this site is one JSON object with five parts:

| Key | What it answers |
| --- | --- |
| `url` | Which page do I start on? |
| `itemsSelector` | What does *one* repeated item (card, row) look like? |
| `fields` | What do I pull out of each item, and what do I call it? |
| `pagination` | How do I find the next page, if there is one? |
| `limits` | How far am I allowed to go (pages, items, time)? |

That's it — every example on this site, simple or advanced, is built from just those five
pieces.

## Try it yourself

Scroll down to the runner at the bottom of the [Scraper home page]({{ '/scraper/' | relative_url }})
(or use the one below — it's the same tool) and do this, in order:

1. Click **Load Example**. The request box fills in with a real JSON payload.
2. Click **Run Scraper**. You must be logged in first — the page needs to know it's you.
3. Look at the **Response** box. You'll see a list of `items`, each one a book with a title,
   price, and availability pulled straight off a real bookstore practice site.

<div id="scraper-app" data-template="books"></div>
<script src="{{ '/assets/js/projects/scraper/scraper.js' | relative_url }}"></script>

## Reading what just happened

Look back at the Request JSON you loaded. It says:

- `itemsSelector: "article.product_pod"` — "each book is one of these on the page."
- `fields.title.selector: "h3 a"` — "the title is the link text inside each book's heading."
- `fields.price.selector: ".price_color"` — "the price is whatever has this class."

The scraper visited the `url`, found every element matching `itemsSelector`, and for each one,
ran every selector in `fields` *inside just that one item* — which is why you get one clean
title/price pair per book instead of one giant jumble.

## Make one small change

In the Request box, find `"maxPages": 3` inside `limits` and change it to `"maxPages": 1`.
Click **Run Scraper** again.

You should see fewer items come back. That's the whole idea of `limits` — it's a safety cap so
a scraper can't accidentally hammer a website or run forever.

## Save your results

Once a run succeeds, a **Save these results** box appears below the Response. Give it a short
name (like "Books - first try") and click **Save Results**. It's now stored under your account —
find it anytime on the [My Scrapes]({{ '/scraper/my-scrapes/' | relative_url }}) page. Saving is
separate from running on purpose: you'll usually run a few times while you get the JSON right,
and only the ones worth keeping need a name.

## What's next

- [Lesson 1 — Music]({{ '/scraper/lesson-music/' | relative_url }}): write a JSON payload
  mostly from scratch, using what you just learned about selectors and fields.
- [Lesson 2 — Vacation]({{ '/scraper/lesson-vacation/' | relative_url }}): practice renaming
  fields and handling a broken selector on purpose.

Both lessons use the exact same five-part JSON shape you just read about — nothing new to
learn, just more practice applying it.
