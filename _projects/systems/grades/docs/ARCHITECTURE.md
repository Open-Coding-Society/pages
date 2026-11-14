---
layout: post
title: Grades Architecture
description: How the Grades pages, their sidebar and their tab links fit together, and which grading files other systems load.
permalink: /systems/grades/architecture/
show_reading_time: false
---

## Where Grades starts

The top nav's **Grades** link (`navigation/grades.html` in `_config.yml`'s
`nav_pages`) opens `/grades/`. That hub page loops over `data/grades_hub.yml`
and shows three cards, Grade, Reflect and Submissions, of links to the pages and
tabs that already exist. It builds no page of its own for any of them.

## Sidebar

All Grades pages use the `aesthetihawk` layout, the same one Profile's toolkit
pages use. Its sidebar include reads `page.sidebar` as the name of a data file:

```liquid
{% raw %}{% assign sidebar_name = page.sidebar | default: "aesthetihawk_sidebar" %}
{% for section in site.data[sidebar_name] %}{% endraw %}
```

Grades pages set `sidebar: grades_sidebar`; every other page keeps the Profile
sidebar. The `sidebar:` must be in the page's own front matter, not its layout's,
because Liquid's `page` doesn't see layout front matter. The same goes for
`active_tab`, which is why `pages/retrospective.md` sets it itself.

## Tab links

A hub link can name a tab with `#name`:

| Page | How `#name` opens the tab |
|---|---|
| `/retrospective` | its script shows the panel whose `data-panel` is `name` |
| `/analytics-dashboard` | on load, clicks the button with id `tab-<name>` |
| `/submissions` | after the admin check, clicks the button with id `tab-<name>` unless it is still hidden |

So `/submissions#all-submissions` leaves a student on My Submissions, because that
tab stays hidden for non-admins. Each page checks the viewer's role itself; the hub
only labels teacher and admin links (`audience` in `data/grades_hub.yml`).

## Spring links

A hub link with `spring_path` (the Assignment Tracker) gets its address from
`config.js`'s `javaURI` when the page loads, and is left out when `_config.yml`
sets `spring: false`.

## Files other systems load

Grades publishes every file to the path it had before it moved here, so these
still work:

- `assets/js/submissions/grading.js`: the Blogs post layout and the Courses
  document player import `readGradingResponse` from it by URL.
- `assets/js/analytics/forecast-retrospective.js`: loaded by both Retrospective
  and the Analytics Dashboard.
- The modules in `js/analytics/` import `../api/config.js`, which resolves from
  their published folder, `assets/js/analytics/`.

## Tests

The tests live in `tests/` here and read the sources, not the published copies,
so they pass before a build. `scripts/test_grades_hub.rb`,
`tests/test_submission_grading.mjs` and `tests/test_creator_dashboard.mjs` load
them with one line each.
