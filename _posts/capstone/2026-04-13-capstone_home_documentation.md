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

### How to use the page

1. **View project cards**
   - Scroll through the card grid under the introductory text.
   - Click the project title or image to open the full capstone infographic post.

2. **Filter projects**
   - Click `All` to show every capstone project.
   - Click `CSA` to show only CSA projects.
   - Click `CSP` to show only CSP projects.
   - The project cards are classified using the `CSA` or `CSP` CSS class in the card container.

3. **Search projects**
   - Enter keywords in the search box labeled `Search projects, descriptions, or team members`.
   - The page filters cards in real time based on matching text inside each card.
   - Search matches the project title, description, and team member list.

4. **Open project links**
   - Click the folder icon button in the top-right corner of a project card.
   - This opens a small popup with links such as:
     - `Project Page`
     - `Frontend Repo`
     - `Backend Repo`
   - If a project has link metadata defined, those links appear in the popup.
   - Click outside the popup or press `Escape` to close it.

### Maintenance and editing notes

The page structure is defined in `_posts/capstone/2026-02-09-capstone_home.md` and includes:

- A filter toolbar at the top
- A search input field
- JavaScript logic for filtering, searching, and popup behavior
- A `div` with `id="capstone-grid"` containing one card entry per capstone project

#### Adding a new project card

To add a new capstone project:

1. Add a new card inside the `<div id="capstone-grid">` container.
2. Use the same card structure as existing entries:
   - `div` wrapper with `class="flex items-start space-x-4 p-4 border rounded-lg capstone-item CSA"` or `CSP`
   - `{% raw %}`<a href="{% post_url yyyy-mm-dd-slug %}">{% endraw %}` around the image
   - `<h3>` title with the same `post_url` destination
   - project description text
   - team member text

3. Update the `linkMap` object in the JavaScript section if the project should expose external links.
   - The map is keyed by the exact project title string.
   - Example keys include `Oasis`, `HawkHub`, `Pirna`, etc.
   - Each entry can define `pageUrl`, `frontendUrl`, and `backendUrl`.

#### Updating project link metadata

The `linkMap` JavaScript object controls the external project links shown in the popup. If a project card has a matching title, these values are used:

- `pageUrl`: opens the deployed project page
- `frontendUrl`: opens the frontend repository
- `backendUrl`: opens the backend repository

Make sure the project title in the card matches the key in `linkMap` exactly for the popup links to work.

### Troubleshooting

- If a filter button does not work, verify the corresponding card container includes the correct `CSA` or `CSP` class.
- If the search input does not filter projects, verify the JavaScript is loading and the card text content is present inside the card elements.
- If links are missing from the popup, confirm the project title is present in the `linkMap` object and the link values are valid URLs.

### Summary

This capstone home page is designed to make published capstone projects easy to explore and compare. Use filters and search to find projects quickly, and use the folder button to access live pages and code repositories when available.
