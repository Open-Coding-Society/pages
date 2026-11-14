---
layout: post
title: Capstone Architecture
description: Frontmatter-driven student project discovery and browsing.
permalink: /systems/capstone/architecture/
show_reading_time: false
---

## Capstone project discovery

Capstone is a catalog view of authored project posts, not a second store of
project descriptions. Each project post opts into the catalog with a
`capstone_project` frontmatter mapping. The Topics-inspired generator validates
that mapping and creates a small catalog consumed by the browser include.

```text
Capstone project post/page
    └── capstone_project frontmatter
          └── Jekyll generator validates and collects
                └── catalog in site.data
                      └── shared card include
                            └── course/year filters and search
```

Project title and description use ordinary document frontmatter unless the
`capstone_project` mapping overrides them. Course, school year, image, team and
repository/demo links stay beside the project content they describe. Auxiliary
posts remain out of the directory unless explicitly marked. CSSE game-directory
posts remain sourced from their existing project metadata and shared include.

The browser preserves the course and year selectors, text search, project-page
links, repository links, and the `/capstone/?course=CSSE` entry route. The
Create/Edit UI was removed: its create path stored only in `sessionStorage` and
the edit form had no persistence path, so neither was a source of published
project data.

The project owns the landing-page source, generator, include, JavaScript and
SCSS. Distribution publishes generated copies; edit only files under
`_projects/systems/capstone/`.
