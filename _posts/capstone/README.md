---
microblog: true
toc: false
layout: post
tailwind: True
title: Capstone Infographics Home Page Documentation
description: How to use and maintain the Capstone Infographics home page, including filtering, search, and project link behavior.
courses: {'csse': {'week': 25}}
type: documentation
categories: Capstone
permalink: /capstone-home-documentation/
---

## Capstone Infographics Home Page Documentation

This document explains the Capstone directory. Its implementation is maintained
under `_projects/systems/capstone/`; the registered project publishes generated
copies into the site.

<video width="640" height="360" controls>
<source src="/assets/capstoneguide.mp4" type="video/mp4">
</video>

### What the page does

The page displays a grid of capstone infographic cards for student projects. Each card includes:
- Project title and image
- Short project description
- Team member names
- Link to the detailed capstone project post

The page also includes interactive tools for visitors:

- Filter by course type (`All`, `CSA`, `CSP`)
- Search by project title, description, or team member names
- Open project-related links from the folder button on each card

The directory is rendered from project front matter at build time; it does not
load catalog data from the backend.

### How to use the page

1. **View project cards**
 - Scroll through the card grid under the introductory text.
 - Click the project title or image to open the full capstone infographic post.

2. **Filter projects**
 - Click `All` to show every capstone project.
 - Click `CSA` to show only CSA projects.
 - Click `CSP` to show only CSP projects.
 - Cards are filtered by the `CSA` or `CSP` CSS class on the card container.

3. **Search projects**
 - Enter keywords in the search box labeled `Search projects, descriptions, or team members`.
 - The page filters cards in real time by matching text inside each card.
 - Search matches the project title, description, and team member names.

4. **Open project links**
 - Expand **Project links** on a card to open its project page or declared repositories.

### Front-end page structure

The Capstone landing page is a thin Jekyll page that includes the browser.
The system's Jekyll generator discovers documents with a `capstone_project`
frontmatter mapping and renders cards from that catalog. Course/year filtering
and search are implemented in the system's JavaScript.

### Adding or updating a project card

The Capstone directory is generated from project post front matter. Do not edit
the landing-page grid or add a title-keyed link map. Add a `capstone_project`
mapping to the project's post instead:

```yaml
capstone_project:
  course: CSP
  school_year: 2026-2027
  image: /images/capstone/example.png
  team: [Student One, Student Two]
  links:
    frontend: https://github.com/example/frontend
    backend: https://github.com/example/backend
```

Use the post's existing `title` and `description`, or override them inside
`capstone_project` when the directory card needs a shorter label or summary.
The course is required (`CSA`, `CSP`, `CSH`, or `CSSE`); all other fields are
optional. Supporting posts stay out of the directory unless they opt in.
Implementation and validation are documented in the
[Capstone system README](../../_projects/systems/capstone/README.md).

### Authoring project pages

Place individual project posts in `2025-2026/`, `2026-2027/`, or the matching
school-year directory. Use `capstone_project.school_year` for listed projects
and top-level `school_year` for supporting posts. If absent, assign the year
from the post date using an August cutoff. Keep explicit permalinks stable.
The former `websites/` posts follow the same year grouping. Leave
`Intelligence/`, `OCS-in-a-Kit/`, `Presence/`, and `Jarvis3000/` intact.

Keep page-specific HTML and Liquid directly in the project's Markdown post.
Use includes only for shared components (navigation, footers, repeated board
cards, or OCS Kanban boards). Existing YAML data stays under `_data/`.

Enclose embedded HTML in `<!-- markdownlint-capture -->`,
`<!-- markdownlint-disable -->`, and `<!-- markdownlint-restore -->` comments.
These suppress Markdown-lint warnings locally and restore the surrounding
rules without preventing Liquid from rendering. Do not use `raw` around
working Liquid.

### Backend overview
The Spring backend for capstone project data lives in `spring/src/main/java/com/open/spring/mvc/capstone`.

- `CapstoneInit.java`
 - Runs on Spring application startup.
 - Creates the required capstone tables if missing.
 - Seeds capstone project rows and updates them by title.

- `CapstoneProject.java`
 - Defines the capstone project entity and database mapping.
 - Includes fields like `title`, `subtitle`, `description`, `about`, `courseCode`, `status`, `pageUrl`, `frontendUrl`, `backendUrl`, and `createdAt`.
 - Stores multiple values for `tech`, `teamMembers`, `keyPoints`, and `impact` using JPA collection tables.

- `CapstoneProjectRepository.java`
 - Provides JPA data access for capstone projects.
 - Supports queries like `findByCourseCode(String courseCode)` and `findByTitle(String title)`.

- `CapstoneProjectController.java`
 - Exposes REST endpoints for project management:
   - `GET /api/capstones`
   - `GET /api/capstones?courseCode=CSA`
   - `GET /api/capstones/{id}`
   - `POST /api/capstones`
   - `PUT /api/capstones/{id}`
   - `DELETE /api/capstones/{id}`

- `CapstoneLikeService.java` and `CapstoneLikesApiController.java`
 - Manage project like status and counts when the frontend uses that feature.

### Database and migration behavior
The current migration strategy is built into the Spring startup process:
- `CapstoneInit` uses `CommandLineRunner` to execute schema creation SQL and seed data.
- It creates the main table `capstone_projects` plus collection tables:
 - `capstone_tech`
 - `capstone_team_members`
 - `capstone_key_points`
 - `capstone_impact`
- Seeded projects are compared by title and updated if they already exist.

This means the backend self-initializes the schema and seeded project data when the application starts.

### Managing backend content
Use the Spring backend when you need persistent capstone project data or API-driven access:

- Edit `CapstoneInit.buildProjects()` to change seeded project content.
- Use `CapstoneProjectController` to create, update, or delete projects through the REST API.
- Keep project titles unique because the backend uses title matching to refresh seed data.

If you change a title in the front-end card, update the corresponding `linkMap` key in the page and the title in the backend seed data if you want both sides to remain consistent.

### Troubleshooting
- If filtering fails, verify the card wrapper contains `CSA` or `CSP`.
- If search does not match, verify the search input is enabled and the card text is visible.
- If popup links are missing, verify the project title matches the `linkMap` key exactly.
- If backend API calls fail, verify the Spring application is running and the `/api/capstones` endpoint is reachable.

### Summary
This README documents both the capstone home page and the Spring backend that supports capstone project data. Use this guide to manage page layout, add project cards, maintain external links, and understand how the backend initializes and serves capstone content.

- If a filter button does not work, verify the corresponding card container includes the correct `CSA` or `CSP` class.
- If the search input does not filter projects, verify the JavaScript is loading and the card text content is present inside the card elements.
- If links are missing from the popup, confirm the project title is present in the `linkMap` object and the link values are valid URLs.

### Summary
This capstone home page is designed to make published capstone projects easy to explore and compare. Use filters and search to find projects quickly, and use the folder button to access live pages and code repositories when available.