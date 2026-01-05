---
layout: post
courses: {'csse': {'week': 2}, 'csp': {'week': 2}, 'csa': {'week': 1}}
canonical_id: sprints-home
tailwind: True
title: GitHub Pages (index.md)
description: An interactive series for learning Frontend programming, GitHub Pages, and Jupyter Notebooks through hands-on editing.  Link and then read for your understanding.
permalink: /github/pages/
author: John Mortensen
---

## GitHub Pages Task

Welcome to your GitHub Pages mini-project journey! This article will guide you through essential skills for starting with web programming with GitHub Pages and updating your home page (index.md).

The articles listed are relevant and will be part of future learnings.  But for now, just focus on adding links to these in your preferred style on your home page.

The joy is in the task and seeing information come alive.

<div class="mermaid" style="padding:1rem; border-radius:0.5rem;">
graph TD
    A[Notebooks & Jokes] --> B[Anatomy]
    B --> C[Theme]
    C --> D[Markdown]
    D --> E[Jekyll]
    E --> F[Hacks]
    linkStyle default stroke:#1e90ff,stroke-width:3px;
</div>

---

## Home Page Edits

Review the following menus, observe all the menu styles.  They all do navigation to other pages in a different way.  Pick one or more styles and update your home page with some updates.

### HTML Orientation 1

<table style="width:100%; text-align:center; border-collapse:collapse;">
  <tr>
    <th><a href="{{site.baseurl}}/github/pages/jokes">Notebooks & Jokes</a></th>
    <th><a href="{{site.baseurl}}/github/pages/anatomy">Anatomy</a></th>
    <th><a href="{{site.baseurl}}/github/pages/theme">Theme</a></th>
    <th><a href="{{site.baseurl}}/github/pages/markdown">Markdown</a></th>
    <th><a href="{{site.baseurl}}/github/pages/jekyll">Jekyll</a></th>
    <th><a href="{{site.baseurl}}/github/pages/hacks">Hacks</a></th>
  </tr>
  <tr>
    <td>Fun with JavaScript and Jupyter Notebooks</td>
    <td>Explore the structure of a GitHub Pages site</td>
    <td>Learn about theme templates and layout of SASS files for advanced styling</td>
    <td>Master Markdown for content creation</td>
    <td>Understand Jekyll static site generation</td>
    <td>Apply your knowledge with hands-on challenges</td>
  </tr>
</table>

---

### HTML Orientation 2

<table style="width:100%; text-align:center; border-collapse:collapse;">
  <tr>
    <th>Topic</th>
    <th>Description</th>
  </tr>
  <tr>
    <td><a href="{{site.baseurl}}/github/pages/jokes">Notebooks & Jokes</a></td>
    <td>Fun with JavaScript and Jupyter Notebooks</td>
  </tr>
  <tr>
    <td><a href="{{site.baseurl}}/github/pages/anatomy">Anatomy</a></td>
    <td>Explore the structure of a GitHub Pages site</td>
  </tr>
  <tr>
    <td><a href="{{site.baseurl}}/github/pages/theme">Theme</a></td>
    <td>Learn about theme templates and layout of SASS files for advanced styling</td>
  </tr>
  <tr>
    <td><a href="{{site.baseurl}}/github/pages/markdown">Markdown</a></td>
    <td>Master Markdown for content creation</td>
  </tr>
  <tr>
    <td><a href="{{site.baseurl}}/github/pages/jekyll">Jekyll</a></td>
    <td>Understand Jekyll static site generation</td>
  </tr>
  <tr>
    <td><a href="{{site.baseurl}}/github/pages/hacks">Hacks</a></td>
    <td>Apply your knowledge with hands-on challenges</td>
  </tr>
</table>

---

### Markdown Orientation 1

- **Start at the top** and follow the arrows to progress through each topic.

- [Jupyter Notebooks & Jokes]({{site.baseurl}}/github/pages/jokes)
  - Learn JavaScript in Jupyter Notebooks with a fun twist—random programming and accounting jokes!
- [GH Pages Anatomy]({{site.baseurl}}/github/pages/anatomy)
  - Explore the structure of a GitHub Pages site
- [Theme]({{site.baseurl}}/github/pages/theme)
  - Learn about theme templates and layout of SASS files for advanced styling
- [Markdown]({{site.baseurl}}/github/pages/markdown)
  - Master Markdown for content creation
- [Jekyll]({{site.baseurl}}/github/pages/jekyll)
  - Understand Jekyll static site generation

---

### Markdown Orientation 2

- [Jupyter Notebooks & Jokes]({{site.baseurl}}/github/pages/jokes): Fun with JavaScript and Jupyter Notebooks
- [Anatomy]({{site.baseurl}}/github/pages/anatomy): Explore the structure of a GitHub Pages site
- [Theme]({{site.baseurl}}/github/pages/theme): Learn about theme templates and layout of SASS files for advanced styling
- [Markdown]({{site.baseurl}}/github/pages/markdown): Master Markdown for content creation
- [Jekyll]({{site.baseurl}}/github/pages/jekyll): Understand Jekyll static site generation
- [Hacks]({{site.baseurl}}/github/pages/hacks): Apply your knowledge with hands-on challenges

---

### [Tailwind](https://tailwindcss.com/plus/ui-blocks/application-ui/page-examples/home-screens)

<div class="flex flex-wrap gap-6 justify-center my-8">
  <!-- Notebooks & Jokes Card -->
  <div class="bg-gray-800 shadow-md rounded-lg p-6 w-72 flex flex-col items-center hover:shadow-xl transition">
    <a href="{{site.baseurl}}/github/pages/jokes" class="text-xl font-bold text-blue-600 hover:underline mb-2">Notebooks & Jokes</a>
    <p class="text-gray-700 text-center">Fun with JavaScript and Jupyter Notebooks</p>
  </div>
  <!-- Anatomy Card -->
  <div class="bg-gray-400 shadow-md rounded-lg p-6 w-72 flex flex-col items-center hover:shadow-xl transition">
    <a href="{{site.baseurl}}/github/pages/anatomy" class="text-xl font-bold text-blue-600 hover:underline mb-2">Anatomy</a>
    <p class="text-gray-700 text-center">Explore the structure of a GitHub Pages site</p>
  </div>
  <!-- Theme Card -->
  <div class="bg-red-600 shadow-md rounded-lg p-6 w-72 flex flex-col items-center hover:shadow-xl transition">
    <a href="{{site.baseurl}}/github/pages/theme" class="text-xl font-bold text-blue-600 hover:underline mb-2">Theme</a>
    <p class="text-gray-700 text-center">Learn about theme templates and layout of SASS files for advanced styling</p>
  </div>
  <!-- Markdown Card -->
  <div class="bg-green-600 shadow-md rounded-lg p-6 w-72 flex flex-col items-center hover:shadow-xl transition">
    <a href="{{site.baseurl}}/github/pages/markdown" class="text-xl font-bold text-blue-600 hover:underline mb-2">Markdown</a>
    <p class="text-gray-700 text-center">Master Markdown for content creation</p>
  </div>
  <!-- Jekyll Card -->
  <div class="bg-purple-600 shadow-md rounded-lg p-6 w-72 flex flex-col items-center hover:shadow-xl transition">
    <a href="{{site.baseurl}}/github/pages/jekyll" class="text-xl font-bold text-blue-600 hover:underline mb-2">Jekyll</a>
    <p class="text-gray-700 text-center">Understand Jekyll static site generation</p>
  </div>
  <!-- Hacks Card -->
  <div class="bg-pink-600 shadow-md rounded-lg p-6 w-72 flex flex-col items-center hover:shadow-xl transition">
    <a href="{{site.baseurl}}/github/pages/hacks" class="text-xl font-bold text-blue-600 hover:underline mb-2">Hacks</a>
    <p class="text-gray-700 text-center">Apply your knowledge with hands-on challenges</p>
  </div>
</div>

---

## Hack

> Ready to begin? Start building a layout and articles on your personal Home Page (index.md).  Organizing and linking becomes part of your Learning Experience Design (LxD).

1. Pick a style to navigate to these items on your Home Page
2. Move all of these documents into your personal repository and get all the links working.
3. Read the articles and make a summary paragraph on the index.md page, so you can recognize why you made links to these topics in the future.
