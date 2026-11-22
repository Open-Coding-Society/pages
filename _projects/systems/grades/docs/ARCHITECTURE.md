---
layout: post
title: Grades Architecture
description: How the Grades pages, their sidebar and their section links fit together, and which grading files other systems load.
permalink: /systems/grades/architecture/
show_reading_time: false
---

## Where Grades starts

The top nav's **Grades** link (`navigation/projects/grades/index.md` in `_config.yml`'s
`nav_pages`) opens `/grades/`. That hub page loops over `data/grades_hub.yml`
and shows three cards, Grade, Reflect and Submissions, of links to the pages and
sections that already exist. It builds no page of its own for any of them.

## Sidebar

Grades pages use the `opencsplus` layout, as do Profile and toolkit pages. It
chains to `opencs` and reuses the sidebar include, which reads `page.sidebar`
as the name of a data file, optionally under `page.sidebar_project`:

```liquid
{% raw %}{% assign sidebar_name = page.sidebar %}
{% assign sidebar_data = site.data.projects[page.sidebar_project][sidebar_name] %}
{% for section in sidebar_data %}{% endraw %}
```

Grades pages set `sidebar: grades_sidebar` and `sidebar_project: grades`; other pages keep the Profile
sidebar. The `sidebar:` must be in the page's own front matter, not its layout's,
because Liquid's `page` doesn't see layout front matter. The same goes for
`active_tab`, which is why `pages/retrospective.md` sets it itself.

## Sections

Analytics Dashboard, Retrospective and Submissions show one section at a time and
have no tab bar. The sidebar lists an item's `children` under it as an `ocs__tree`:

```yaml
- id: retrospective
  title: Retrospective
  url: /retrospective
  children:
    - section: growth
      title: Growth Over Time
```

Each child links to `url#section`, and the hub links the same way
(`/analytics-dashboard#grade`). On the page, every section element carries
`data-section="<name>"`, and the shared
`assets/js/pages/viewer/section-navigation.js` does the rest:

1. `followSectionHash(names, show, canOpen)` calls the page's `show(name)` for the
   section `location.hash` names, then again on every `hashchange`. A sidebar click
   on the same page changes only the hash, so the page doesn't reload.
2. An unknown name, or one `canOpen` refuses, opens the first section. Submissions
   passes `name !== "all-submissions" || isAdmin` after its admin check, so
   `/submissions#all-submissions` leaves a student on My Submissions.
3. The sidebar include puts `data-sidebar-section` only on the current page's
   links, so `markSidebarSection` sets `aria-current` on the shown one, in both
   the side column and the phone menu. Tailwind's `aria-[current=true]:` classes
   highlight it.

The old `assets/js/grades/page-sections.js` URL re-exports these functions for
cached pages. Navigation between different pages remains ordinary links; the
shared module handles sections within a page.

Each page still checks the viewer's role itself; the hub and the sidebar only label
teacher links (`audience`). For teachers, `creator-dashboard.js` renames the
"Assignments You Created" sidebar links to "Teacher Dashboard".

## Phones

`_layouts/opencsplus.html` uses the viewport from the shared `opencs` layout. At 768px and below it hides the
side column (`max-[768px]:hidden`) and drops its 16rem margin, and a `<details>`
**Menu** above the page holds a second copy of the sidebar include. That copy
passes `id_prefix="phone-"`, so no link id repeats.

## Spring links

A hub link with `spring_path` (the Assignment Tracker) gets its address from
`config.js`'s `javaURI` when the page loads, and is left out when `_config.yml`
sets `spring: false`.

## Files other systems load

Grades publishes its standard directories under `projects/grades`. Blogs and
Courses load `assets/js/projects/grades/submissions/grading.js`. The old JS
URLs remain re-exports for cached pages, including:

- `assets/js/submissions/grading.js`: the shared submission grading API.
- `assets/js/analytics/forecast-retrospective.js`: the retrospective module.

The analytics modules import `../../../api/config.js` relative to their
published project folder. The manifest maps only the home page and the old
compatibility URLs; the publisher tracks the other files by directory.

## Tests

The tests live in `tests/` here and read the sources, not the published copies,
so they pass before a build. `scripts/test_grades_hub.rb`,
`tests/test_submission_grading.mjs` and `tests/test_creator_dashboard.mjs` load
them with one line each.
