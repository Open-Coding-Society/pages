---
layout: post
title: Capstone Architecture
description: Frontmatter-driven student project discovery and browsing.
categories: [Systems]
permalink: /systems/capstone/architecture/
show_reading_time: false
---

## View and data source

The Capstone page uses a searchable, course- and year-filtered card grid.
Its catalog comes from published project posts and pages with
`capstone_project` frontmatter, plus existing CSSE game-directory metadata.
The Jekyll generator prepares the catalog; the browser filters it locally.

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

## Team chat

A project page can hold its team's group chat. The page names an existing
Messages group (`capstone_project.team_group`); the Capstone system adds no
store of its own, and Spring's groups stay the one record of who is on a team.

```text
capstone-team-chat.html (only with team_group, only with spring)
    └── CapstoneTeamChat.start()
          ├── TeamGroupApi.me(), then groupsOf(me.id); findByName only for teachers
          ├── TeamChatAccess.viewFor(me, group): chat, note, or sign in
          └── Messages' mountGroupChat(groupId) + "Open in Messages" (/dm?group=id)
```

Spring decides who may read and post (`MentorRules`): a mentor uses only a
group they were added to, with at least 2 members who aren't mentors, and never
a direct message. `TeamChatAccess` applies the same rules to choose a view, so
the browser asks only for what Spring would allow.
