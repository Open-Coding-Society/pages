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

This document explains how to use the capstone home page located at `_posts/capstone/2026-02-09-capstone_home.md`.

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

This page is a static Jekyll post enhanced with client-side JavaScript. Card content and external link metadata are defined directly in the post file, not loaded dynamically from the backend at render time.

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
 - Click the folder icon button in the top-right corner of a project card.
 - A popup appears with available links:
   - `Project Page`
   - `Frontend Repo`
   - `Backend Repo`
 - The popup is populated from the `linkMap` object in the JavaScript section.
 - Click outside the popup or press `Escape` to close it.

5. **Keep titles exact**
 - The popup matches project titles exactly to entries in `linkMap`.
 - If a title changes, update the corresponding string key in `linkMap`.

### Front-end page structure
The capstone home page includes:
- A filter toolbar with `All`, `CSA`, and `CSP` buttons.
- A search input field that filters card visibility instantly.
- A `div` with `id="capstone-grid"` containing all project cards.
- Each project card is a block of HTML with one project title, description, and team list.
- The JavaScript `linkMap` object drives the popup external links.

### Adding or updating a project card
To add a new capstone project:

1. Add a card inside the `<div id="capstone-grid">` container.
2. Match the existing card structure:
 - Use a wrapper such as `class="flex items-start space-x-4 p-4 border rounded-lg capstone-item CSA"` or `CSP`.
 - Wrap the image and title with `{% raw %}<a href="{% post_url yyyy-mm-dd-slug %}">{% endraw %}`.
 - Keep the title, description, and team members visible inside the card.

3. Add or update a `linkMap` entry if the project should show external links.
 - Use the exact project title as the `linkMap` key.
 - Include any of `pageUrl`, `frontendUrl`, or `backendUrl`.


Example `linkMap` entry:

```js
"HawkHub": {
 pageUrl: "https://pages.opencodingsociety.com/capstone/hawkhub/",
 frontendUrl: "https://github.com/SoniDhenuva/HawkHub",
 backendUrl: "https://github.com/SoniDhenuva/hawkhub_spring"
}
```

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