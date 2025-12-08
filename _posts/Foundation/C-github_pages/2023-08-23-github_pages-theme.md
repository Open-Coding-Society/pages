---
layout: post
toc: True
breadcrumb: True
title: Change GitHub Pages Theme 
description:  
permalink: /github/pages/theme
---

## Theme Switching Guide

### Purpose

This guide explains how to switch between Jekyll themes (such as **Minima**, **TeXt**, **So Simple**, and others) in your site, while supporting custom layouts and behaviors. The approach allows students or contributors to select a theme and still benefit from local overrides and customizations.

## Theme Switching Logic

### Directory Structure

- _themes/
  - minima/
    - _config.yml
    - Gemfile
    - opencs.html
    - _layouts/
      - post.html
      - page.html
  - text/
    - _config.yml
    - Gemfile
    - opencs.html
    - _layouts/
      - post.html
      - page.html
  - ...

### Layout Overrides

- For **Minima**, custom behaviors are implemented by overriding `post.html` and `page.html` in your project’s `_layouts/` directory. These custom layouts **terminate with** `opencs.html`, a local layout that you control for further overrides.
- For other themes, the theme-specific `post.html` and `page.html` in `_themes/<theme>/_layouts/` use front matter to load the theme’s default or base layout as their terminating layout (e.g., `layout: default` or `layout: base`).

**This means:**  

- You can always override or extend layouts by editing your themes `opencs.html`.
- For themes other than Minima, the default theme layouts is being used unless you add overrides.  In minima, you can see we brought the base.html local as well as many _sass files.  

---

## How to Switch Themes

### Using the Makefile

The Makefile includes targets to copy the appropriate config, Gemfile, and layouts from `_themes/<theme>/` into the project root and `_layouts/` directory:

```bash
make use-minima
make use-text
make use-cayman
make use-so-simple
```

- All theme-specific configuration and override files are stored in the `_themes/` directory (not built by Jekyll).
- Each theme has its own set of files.  Read the Makefile to see the copy rules.

### How Layouts Are Resolved

- Jekyll will first look for layouts in your project’s _layouts/ directory.
- If not found, it will use the layout from the remote theme.
- This allows you to override any layout by placing a file of the same name locally.


## Styling Preferences Tutorial (How It Works)

Many modern Jekyll-based sites allow visitors to adjust small styling preferences—such as font size, font family, text color, background color, and content width—without changing the underlying theme. This site uses a lightweight preferences panel (shown in the Preferences tab) that works on top of whichever Jekyll theme is active.

This explains **how the system applies user styling**, how it interacts with themes, and how developers can safely extend it.

---

### **Why Preferences Are Possible Across Themes**

Because theme switching (using `_themes/<theme>` and the Makefile) already ensures a consistent layout structure, we can apply an additional layer of styling that:

1. Does **not modify the remote theme**  
2. Respects layout overrides like `opencs.html`  
3. Works across **Minima, TeXt, So Simple, Cayman**, and future themes  
4. Is fully **local to the user's browser** via `localStorage`

---

### **Core Idea**

We implement a set of **CSS variables** at the `:root` level (e.g.,  
`--pref-bg-color`, `--pref-text-color`, `--pref-font-size`).  
These variables override the site's colors and typography at runtime.
```css
:root {
  --pref-bg-color: #0b1220;
  --pref-text-color: #e6eef8;
  --pref-font-family: Inter;
  --pref-font-size: 14px;
}
```

When the user saves preferences, JavaScript updates the variables:
```javascript
document.documentElement.style.setProperty('--pref-bg-color', prefs.bg);
```

---

### **Why `.user-theme-active` Exists**

Every Jekyll theme ships with its own styles. To ensure user customizations override theme defaults, the site adds:
```html
<html class="user-theme-active">
```

Inside this class, we apply stronger rules:
```css
.user-theme-active * {
  color: var(--text) !important;
  background-color: var(--background) !important;
}
```

This guarantees user preferences override:

- Minima's palette
- TeXt's typography
- So Simple's white backgrounds
- Any custom `_sass` files

---

### **How Background + Panel Colors Are Computed**

To ensure readability, the system automatically generates:

- A panel color slightly offset from the background
- Input + button colors
- Borders, outlines, and shadows
- Text contrast for both dark and light modes

These values use luminosity-based calculations so they remain readable regardless of the base background color.

---

### **Why This Approach Matters**

- Students control visual comfort without switching the entire theme
- Preferences apply per-user, not site-wide
- Overrides work consistently across all themes
- The system is lightweight and requires minimal maintenance

This creates a layered system:

**Remote theme → Local layout overrides → User styling preferences**

Each layer is optional, isolated, and safe to change.

### Summary

- Theme switching is managed via the Makefile and the _themes/ directory
- Layouts for posts and pages are overridden as needed, with a custom opencs.html as the local terminating layout.
- For most themes, layouts defer to the remote theme's documentation. Remember: files are loaded locally first, then remotely. Overrides work for _layouts, _includes, and _sass. Try to minimize overrides to simply what is required for customizations.
- Most content uses post or page layouts for primary formatting. Exceptions include schedule.html, blogs.html, and search.html, which may use custom layouts.
- User styling preferences (font size, colors, width, etc.) are applied via CSS variables and localStorage, allowing per-user customization without modifying the active theme. The `.user-theme-active` class ensures user preferences override theme defaults across all supported themes.
