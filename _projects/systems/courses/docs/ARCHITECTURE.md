---
layout: post
title: Courses Architecture
description: Course content hierarchy, reusable systems, and ownership boundaries.
permalink: /systems/courses/architecture/
show_reading_time: false
---

## Courses: a composition system

Courses organizes curriculum and supplies the context in which reusable systems
are presented. A course, sprint, week, or card is a configured instance or view,
not a separate software system.

Blogs provides the underlying document publishing and viewing foundation.
Courses composes that foundation with schedules, navigation, Calendar and Chat
to present a curriculum. See [Blogs architecture](../../blogs/docs/ARCHITECTURE.md)
for the publishing, authoring and interactive-document model.

## Content hierarchy

```text
Courses - collection, selector, and navigation system
└── Course - configured instance, such as CSSE
    ├── YAML definition
    ├── Home / Announcements view
    │   ├── Calendar view
    │   └── Course-scoped Group Chat
    ├── Sprint collection
    │   └── Sprint
    │       ├── Introduction view
    │       └── Week collection
    │           └── Week
    │               ├── Introduction and learning goals
    │               ├── Document collection
    │               │   └── Lesson / assignment / reference document
    │               └── Week-scoped Group Chat
    └── Blogs view
        ├── Post catalog
        └── Post reader

Blogs - reusable document and discovery system
├── Catalog and embedded reader
├── Shared document layouts
├── Full-page document viewing
├── IPYNB authoring and publishing pipeline
├── Runners - code exercises and 2D gaming
├── Submissions and Grading integrations
└── Composed Chat and Calendar views
```

A week's documents are selected by course/week frontmatter. They are not the
same collection as the course's Blogs catalog, which displays posts
from across the site. Both can reference the same underlying Jekyll document.
Authored lessons stay in their registered lesson projects, notebooks, or DOCX;
neither Courses nor Blogs takes ownership of that content.

## Reusable systems and dependencies

```text
Site shell and authentication
        |
        v
Courses ---- uses ----> Blogs
   |                     |
   +---- uses Calendar   +---- integrates Submission
   +---- uses Chat       +---- integrates Runners
                         +---- optionally presents Grading

Grading consumes Submission evidence/results
```

These are functional system boundaries. Registered frontend projects, shared
includes/scripts, authoring tools and backend services implement the capabilities;
a functional system does not necessarily correspond to one directory or service.

| System | Responsibility | Implementation |
| --- | --- | --- |
| Courses | Selection, schedules, sprint/week routes, navigation and resume state | Registered project |
| Blogs | Document publishing, discovery, viewing and interactive-document integration | Registered project with shared authoring tools |
| Calendar | Event scheduling and calendar API/UI | Calendar project and course-facing adapters |
| Chat | Communication, connections, message history, composer and scoped conversations | Shared clients/includes, course-facing views and backend |
| Submissions | Collect and persist document/assignment evidence | Shared UI/helpers and backend services |
| Runners | Execute code exercises and interactive 2D games | Shared runner includes, runtime scripts and authoring conversion |
| Grading | Evaluate submitted evidence and expose feedback/results | Shared helpers and backend services; derives from Submissions |

Calendar and Chat are external capabilities from the course domain's perspective.
Their course-facing announcement, week and document-chat views and
calendar/announcement adapters live in Courses. Chat uses scoped groups and
document markers to associate conversations with the appropriate view.
Authentication, subscriptions, reconnection and deduplication belong to the
communication infrastructure.

## Source ownership

### Courses owns curriculum composition

- [Course YAML](../data/) and [course home sources](../navigation/).
- [Generated page definitions](../plugins/lesson_player_pages.rb).
- Course pills, title, sidebar, top bar, mobile drawer and sprint/week views.
- [Course document player adapter](../_includes/course-document-player.html):
  the two-pane presentation of documents in a course context.
- [Course Blogs adapter](../_includes/player-pages/blogs.html): delegates to
  the reusable Blogs reader, without duplicating it.
- Course selection and per-course/per-panel navigation state.
- Sprint views, course chooser and the global catalog's course
  selector page. That page consumes the Blogs layout.

### Blogs owns reusable document viewing

- [Shared layouts](../../blogs/layouts/): post, blogs, notebook, study/capture
  viewers, and an optional standalone embedded-reader layout.
- [Catalog, cards and reader](../../blogs/_includes/).
- Document completion and study/capture scripts.
- Shared document/player styles, including existing submission UI styles.
- Catalog, independent rendering, and publication-boundary tests.

The shared post layout renders conventional documents without Courses. For a
course document or generated player page, it identifies the course
context and delegates to Courses' adapter. This is an explicit conditional
extension point; the generic document layout does not own the course sidebar
or its JavaScript.

The shared stylesheet contains both viewer and course-player selectors.
It is published by Blogs so standalone document/submission views do not require
Courses to supply their styles.

## Authoring and interactive documents

OCS authors documents in Markdown, IPYNB notebooks and DOCX. The build pipeline
converts notebook and DOCX sources into Jekyll posts. Notebook cells can contain
narrative, code, output and runner declarations for code exercises or 2D games.
Course/week frontmatter connects published documents to the curriculum without
duplicating their authored content.

Blogs presents Submission and Runner capabilities; it does not own their backend
services. Courses can present those same capabilities through its document adapter.
Shared API configuration, runner I/O, Gist export, submission and grading helpers
connect document views to these services.

Grading is a derivative of Submissions: it evaluates submitted evidence and
produces feedback/results. Submission and grading controls can share a document
view while representing different responsibilities.

## Build and runtime contracts

Both `systems/blogs:dev` and `systems/courses:dev` are registered in the
[project registry](../../../.makeprojects). Their manifests publish disjoint
outputs through the shared generated Makefile. Layout/include names, script
URLs, permalinks and storage keys are runtime contracts. The publisher tracks
output ownership and rejects duplicate destinations.

Course entry opens Home/Announcements. Breadcrumbs use short course pill names.
Opening Home or Blogs preserves the last document in the panel without redirecting
or marking it complete. Blogs' embedded reader does not execute a document's
runners/forms; it directs interactive work to the full document page.

## Validation

- `bundle exec ruby scripts/test_blogs_system.rb`: independent Blogs rendering,
  and publication ownership.
- `bundle exec ruby scripts/test_blog_catalog.rb`: catalog behavior.
- `bundle exec ruby scripts/test_course_landing_pages.rb`: composed course views.
- `bundle exec ruby scripts/test_course_distribution.rb`: shared publication.
- `node --test tests/course_entry.test.mjs tests/course_navigation_state.test.mjs tests/lesson_completion.test.mjs`.
- Registered dev build, Jekyll/Ruby-Sass build, and course/global reader browser checks.
