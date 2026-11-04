---
layout: post
title: Blogs Architecture
description: The OCS document publishing foundation, notebook authoring, and interactive viewing systems.
permalink: /systems/blogs/architecture/
show_reading_time: false
---

## Blogs: the publishing foundation

Blogs is the document publishing and viewing foundation of the OCS GitHub Pages
site. GitHub Pages hosts the published site; Jekyll provides posts, pages,
frontmatter, layouts, includes and catalogs. Blogs organizes those building
blocks into reusable document discovery and reading.

OCS extends this publishing foundation with IPYNB authoring, Runners for code
and 2D gaming, Submissions and Grading. Chat and Calendar can share the viewing
experience with documents. A blog is therefore more than a chronological
article: it can be a lesson, assignment, reference, interactive exercise or
project document.

[Courses](../../courses/docs/ARCHITECTURE.md) adds curriculum organization around
this foundation. A document can be viewed independently or within a course;
its authored content is not owned by the course navigation.

## System picture

```text
Authoring
├── Markdown
├── IPYNB - narrative, code, outputs and runner declarations
└── DOCX
        |
        v
Conversion and Jekyll build
        |
        v
Blogs - document publishing and viewing foundation
├── Published posts and pages
├── Catalog, cards and discovery
├── Embedded reader
└── Full document view
    ├── Narrative, media and notebook output
    ├── Runners - code exercises and 2D gaming
    ├── Submissions - evidence collection
    ├── Grading - evaluation and feedback
    └── Composed communication and scheduling views
        ├── Chat
        └── Calendar

Courses
└── Composes Blogs with course selection, schedules and navigation
```

This is a capability model, not a directory tree. Shared scripts/includes,
registered projects, conversion tools and backend services implement the
capabilities together.

## Authoring and publication

Frontmatter describes a document's title, permalink, layout, course/week
association and optional capabilities. Markdown provides narrative structure;
IPYNB provides cell-based authoring with code and outputs; DOCX provides
document-based authoring.

The [notebook converter](../../../../scripts/convert_notebooks.py) translates
notebook cells and runner declarations into Markdown, Liquid includes and
browser-facing components. The [DOCX converter](../../../../scripts/convert_docx.py)
produces Markdown for the same publishing pipeline. Jekyll resolves layouts,
includes and metadata to produce the static site served by GitHub Pages.

```text
Authoritative source
    -> conversion where needed
    -> Jekyll post/page
    -> layout and composed components
    -> published HTML, styles and scripts
```

Authored content lives in registered lesson/project sources, notebooks or DOCX
sources. Generated posts are build outputs, not an additional authoring location.
Blogs owns the common presentation and discovery layer rather than all content
sources or the GitHub Pages hosting service.

## Viewing surfaces

| Surface | Responsibility |
| --- | --- |
| Catalog and cards | Select and order published posts; link readers to documents |
| Embedded reader | Read a document within the catalog context and return to the list |
| Full document | Present narrative and interactive capabilities together |
| Notebook and study/capture views | Present document-specific learning and interaction formats |
| Course document view | Add Courses' sidebar, top bar, progression and course context |

The catalog displays posts from across the site, with pinned posts first and
then newest posts. A host can narrow it to one course with `course=`, which keeps
posts whose `courses` names only that course, and add a search bar with
`search=true` (or `post_search: true` on a page). It is distinct from a course
week's document collection, which Courses selects using course/week metadata.

The embedded reader fetches same-site document HTML, resolves relative links
and images, and maintains `?post=` history. It preserves list navigation,
scroll and focus. Scripts, forms and runners are removed from embedded content;
interactive work takes place on the linked full document page.

## OCS document capabilities

### Runners: code and 2D gaming

Runners turn authored examples into interactive browser experiences. Code
runners provide editing, execution and output; game runners provide interactive
2D gaming. Notebook declarations connect authored cells to runner components.
Shared runner I/O exposes saved code and runner state to document submission
and export controls.

Runners are embedded capabilities of a document, not a separate copy of its
content. Execution and persistence depend on the runner type and its runtime.

### Submissions: evidence collection

Submissions collect assignment evidence, including saved runner code and
uploaded files. Document metadata configures assignment controls. Shared
authentication, API configuration, Gist/export helpers and backend services
support persistence and feedback about submission success or failure.

### Grading: evaluation of submissions

Grading derives from Submissions. It evaluates submitted evidence and exposes
feedback/results. Documents can present submission, self-assessment and grading
controls together, while collection and evaluation remain separate concerns.

### Chat and Calendar: composed viewing

Chat adds conversations and announcements to the document or course context.
Calendar adds scheduling and event views. These capabilities can be viewed
alongside published content without becoming part of the content's authoring
format or catalog definition.

Course Home/Announcements combines Calendar and Chat. Week views provide scoped
discussion, and documents can enable document-scoped Chat. Courses supplies
these contextual views; shared communication/scheduling infrastructure and
backend services supply their functionality.

## Source and integration boundaries

| Resource | Responsibility |
| --- | --- |
| [Layouts](../layouts/) | Post, catalog, reader, notebook and study/capture presentation |
| [Includes](../_includes/) | Catalog, document cards, embedded reader and submission UI |
| [JavaScript](../js/) | Document completion, catalog search and study/capture behavior |
| [Styles](../sass/) | Shared document/player and submission presentation |
| [Distribution manifest](../distribution.json) | Published Jekyll and browser destinations |
| [Tests](../tests/) | Catalog, independent rendering and publication contracts |

The post layout renders ordinary documents without Courses. Course metadata or
`player_page` activates the [Courses document adapter](../../courses/_includes/course-document-player.html),
which supplies course navigation and contextual controls. The embedded reader
is also reusable through a standalone layout or a course page include.

The site shell/theme, authentication, API configuration, runner components,
conversion tools, Chat, Calendar and backend services are collaborators.
Blogs presents their document-facing integrations; it does not own all their
implementations. Shared styles cover standalone documents and course-hosted
document views.

## Build and runtime contracts

Blogs is registered as `systems/blogs:dev` in the
[project registry](../../../.makeprojects). The shared generated project
Makefile publishes its manifest resources to Jekyll/runtime directories.
Courses has its own disjoint publication manifest. Source files remain in their
owning projects; published copies are generated resources.

The root [Makefile](../../../../Makefile) coordinates project publication,
conversion, course splitting and Jekyll build/serve workflows. Published
permalinks, include/layout names, asset URLs and document state keys connect
these layers.

## Validation

- `bundle exec ruby scripts/test_blog_catalog.rb`: catalog filtering, ordering,
  cards, deduplication, baseurl and empty state.
- `bundle exec ruby scripts/test_blogs_system.rb`: standalone document/reader
  rendering, module syntax and disjoint publication ownership.
- `bundle exec ruby scripts/test_course_landing_pages.rb`: course composition.
- `node --test tests/post_search.test.mjs`: catalog search matching, highlight
  ranges, `?q=` state and search bar states.
- Jekyll/Ruby-Sass builds and browser checks cover published document and reader
  views; interactive services also depend on their backend/runtime availability.
