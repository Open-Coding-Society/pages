---
layout: post
title: Converting CSS to SASS Guide
description: How to properly convert CSS files to SASS in this website
categories: [SASS]
permalink: /css-to-sass-guide
author: Ahaan
toc: true
---

## What is SASS and Why Use It?

**SASS** (Syntactically Awesome Style Sheets) is a CSS preprocessor that makes your styles:
- **Easier to maintain** - Use variables for colors, sizes, fonts
- **More organized** - Nest selectors logically
- **Reusable** - Create mixins and functions
- **Consistent** - One place to change site-wide colors

### CSS vs SASS - Quick Comparison

| Feature | CSS | SASS |
|---------|-----|------|
| Variables | Limited (`--var`) | Full support (`$var`) |
| Nesting | No | Yes |
| Math | Limited | Full calculations |
| Imports | Multiple HTTP requests | Compiled into one file |
| Mixins | No | Reusable code blocks |

---

## How SASS Works in This Website

### The Import Chain (How Files Connect)

```
_sass/minima/custom-styles.scss  ← ENTRY POINT (Jekyll starts here)
    ↓
imports opencs-color-map.scss    ← Maps variables to CSS custom properties
    ↓
imports root-color-map.scss      ← ALL COLOR VARIABLES DEFINED HERE
    ↓
imports open-coding/_main.scss   ← MAIN HUB (imports all components)
    ↓
imports all component .scss files ← Your styles end up here
```

### What This Means For You

When you create a new `.scss` file, you need to:
1. Put it in the right folder (`_sass/open-coding/`)
2. Import it in `_main.scss` so Jekyll knows about it
3. Jekyll will automatically compile everything into one CSS file

---

## Complete Step-by-Step Tutorial

Let's convert a real CSS file to SASS. We'll use `leaderboard.css` as our example.

### Step 1: Find Your CSS File

First, locate the CSS file you want to convert.

**Common locations for CSS files:**
- `assets/css/your-file.css`
- Inline `<style>` tags in HTML/Markdown files

**For this example:** `assets/css/leaderboard.css`

### Step 2: Create the New SCSS File

Create a new file in the SASS folder:

**File Location:** `_sass/open-coding/leaderboard.scss`

**Start with this template:**

```scss
// ============================================
// LEADERBOARD STYLES
// Converted from assets/css/leaderboard.css
// ============================================

// Import to get access to color variables
@import "materials/main.scss";

// Your styles go below...
```

> **Why `@import "materials/main.scss"`?**  
> This gives you access to all the color variables like `$accent`, `$text`, `$bg-1`, etc.

### Step 3: Copy Your CSS Into the SCSS File

Take your original CSS and paste it below the import:

```scss
@import "materials/main.scss";

// Paste your CSS here - it will work as-is!
.leaderboard-widget {
    position: fixed;
    bottom: 20px;
    right: 20px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 16px;
}
```

**Good news:** Regular CSS is valid SCSS! Your file will work immediately.

### Step 4: Register Your File in _main.scss

Open `_sass/open-coding/_main.scss` and add your import:

```scss
@import 'root-color-map.scss';
@import "bathroom";
@import "blogs";
@import "calendar";
// ... other imports ...

@import "leaderboard";  // ← ADD THIS LINE (no .scss extension needed!)
```

> **Important:** The order of imports can matter! Add new imports at the end to avoid conflicts.

### Step 5: Delete the Old CSS File

Now that SASS handles your styles, delete the original:

```bash
rm assets/css/leaderboard.css
```

### Step 6: Remove Old CSS References

Search your project for any `<link>` tags loading the old CSS:

```html
<!-- DELETE THIS LINE if you find it -->
<link rel="stylesheet" href="/assets/css/leaderboard.css">
```

SASS automatically includes your styles - no manual linking needed!

### Step 7: Build and Test

Run the build to compile your SASS:

```bash
make
# or
bundle exec jekyll serve
```

Check for errors in the terminal. If successful, your styles are now SASS!

---

## Improving Your SASS (Optional But Recommended)

Now that it works, let's make it *better* using SASS features.

### Improvement 1: Replace Hardcoded Colors

### Improvement 1: Replace Hardcoded Colors

Find hex codes and replace with variables:

**Before:**
```scss
.button {
    background: #4CAFEF;
    color: #F0F0F0;
    border: 1px solid #E53E3E;
}
```

**After:**
```scss
.button {
    background: $accent;      // #4CAFEF
    color: $text;             // #F0F0F0
    border: 1px solid $red;   // #E53E3E
}
```

### Improvement 2: Use Nesting

Group related selectors together:

**Before (CSS):**
```css
.card { background: #1F1F1F; }
.card .header { font-size: 20px; }
.card .header h3 { margin: 0; }
.card .header h3:hover { color: blue; }
.card .body { padding: 16px; }
```

**After (SASS):**
```scss
.card {
    background: $bg-2;
    
    .header {
        font-size: 20px;
        
        h3 {
            margin: 0;
            
            &:hover {
                color: $blue;
            }
        }
    }
    
    .body {
        padding: 16px;
    }
}
```

> **The `&` symbol** refers to the parent selector. `&:hover` becomes `.card .header h3:hover`

### Improvement 3: Create Local Variables

For values used multiple times in your file:

**Before:**
```scss
.box1 { border-radius: 16px; padding: 20px; }
.box2 { border-radius: 16px; padding: 20px; }
.box3 { border-radius: 16px; padding: 20px; }
```

**After:**
```scss
// Local variables (at top of file)
$card-radius: 16px;
$card-padding: 20px;

.box1 { border-radius: $card-radius; padding: $card-padding; }
.box2 { border-radius: $card-radius; padding: $card-padding; }
.box3 { border-radius: $card-radius; padding: $card-padding; }
```

### Improvement 4: Use SASS Math

SASS can do calculations:

```scss
$base-spacing: 8px;

.small { padding: $base-spacing; }           // 8px
.medium { padding: $base-spacing * 2; }      // 16px
.large { padding: $base-spacing * 3; }       // 24px
```

---

## Available Color Variables Reference

These are defined in `_sass/root-color-map.scss` - use them instead of hex codes!

### Background Colors
| Variable | Value | Use For |
|----------|-------|---------|
| `$bg-0` | `#000` | Darkest background |
| `$bg-1` | `#1F2020` | Dark panels |
| `$bg-2` | `#1F1F1F` | Cards |
| `$bg-3` | `#2A2D2D` | Lighter panels |
| `$panel` | `#2B2B2B` | Panel backgrounds |
| `$background` | varies | Page background |

### Text Colors
| Variable | Value | Use For |
|----------|-------|---------|
| `$text` | `#F0F0F0` | Main text |
| `$text-muted` | `#aaa` | Secondary/dimmed text |

### Accent Colors
| Variable | Value | Use For |
|----------|-------|---------|
| `$accent` | `#4CAFEF` | Primary accent/links |
| `$blue` | `#3182CE` | Info elements |
| `$green` | `#4ADE80` | Success states |
| `$red` | `#E53E3E` | Error states |
| `$orange` | `#ED8936` | Warning states |

---

## File Structure Overview

```
_sass/
├── root-color-map.scss      ← All color variables defined here
├── opencs-color-map.scss    ← Maps SASS vars → CSS custom properties
├── user-colors.scss         ← User-editable palette
│
├── minima/
│   └── custom-styles.scss   ← ENTRY POINT (Jekyll starts here)
│
└── open-coding/
    ├── _main.scss           ← MAIN HUB (imports all components)
    ├── bathroom.scss
    ├── blogs.scss
    ├── calendar.scss
    ├── your-new-file.scss   ← YOUR NEW SCSS FILES GO HERE
    │
    ├── materials/           ← Shared utilities & mixins
    │   ├── _main.scss
    │   ├── colors.scss
    │   └── ...
    │
    └── elements/            ← UI element styles
        ├── buttons/
        ├── forms/
        └── ...
```

---

## Quick Reference Checklist

Use this checklist every time you convert a file:

### Before Starting
- [ ] Identify the CSS file to convert
- [ ] Note where it's currently loaded (which pages use it)

### Creating the SCSS File
- [ ] Create new file: `_sass/open-coding/your-file.scss`
- [ ] Add `@import "materials/main.scss";` at the top
- [ ] Copy CSS content into the file

### Registering the File
- [ ] Open `_sass/open-coding/_main.scss`
- [ ] Add `@import "your-file";` (no .scss extension)

### Cleanup
- [ ] Delete old CSS file from `assets/css/`
- [ ] Remove any `<link>` tags loading the old CSS
- [ ] Search for inline styles that could be moved

### Testing
- [ ] Run `make` or `bundle exec jekyll serve`
- [ ] Check terminal for SASS errors
- [ ] View the page in browser to verify styles work

### Optional Improvements
- [ ] Replace hex colors with `$variables`
- [ ] Add nesting for cleaner code
- [ ] Create local variables for repeated values

---

## Common Errors and Fixes

### Error: "File to import not found"

```
Error: File to import not found or unreadable: materials/main.scss
```

**Fix:** Check your import path. From `_sass/open-coding/`, use:
```scss
@import "materials/main.scss";  // Correct
@import "../materials/main.scss";  // Wrong
```

### Error: "Undefined variable"

```
Error: Undefined variable: "$accent"
```

**Fix:** Make sure you have the import at the top of your file:
```scss
@import "materials/main.scss";  // This gives you access to variables
```

### Error: "Invalid CSS"

```
Error: Invalid CSS after "..."
```

**Fix:** SASS is stricter than browsers. Check for:
- Missing semicolons
- Unclosed brackets
- Invalid property values

### Styles Not Showing Up

**Possible causes:**
1. Forgot to add import in `_main.scss`
2. Old CSS file still being loaded (check for `<link>` tags)
3. Browser cache - try hard refresh (`Cmd+Shift+R`)

---

## Full Example: Complete Conversion

Let's see a complete before/after conversion:

### Original CSS File
**`assets/css/leaderboard.css`**

```css
.leaderboard-widget {
    position: fixed;
    bottom: 20px;
    right: 20px;
    width: 400px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 16px;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
}

.leaderboard-header {
    display: flex;
    justify-content: space-between;
    padding: 16px 20px;
    background: rgba(255, 255, 255, 0.1);
    border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}

.leaderboard-header h3 {
    margin: 0;
    color: white;
    font-size: 20px;
}

.leaderboard-content {
    padding: 16px;
}

.leaderboard-item {
    display: flex;
    align-items: center;
    padding: 12px;
    border-radius: 8px;
}

.leaderboard-item:hover {
    background: rgba(255, 255, 255, 0.1);
}
```

### Converted SASS File
**`_sass/open-coding/leaderboard.scss`**

```scss
// ============================================
// LEADERBOARD WIDGET STYLES
// Converted from assets/css/leaderboard.css
// ============================================

@import "materials/main.scss";

// Local variables
$leaderboard-width: 400px;
$leaderboard-radius: 16px;
$leaderboard-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
$item-radius: 8px;
$base-padding: 16px;

.leaderboard-widget {
    position: fixed;
    bottom: 20px;
    right: 20px;
    width: $leaderboard-width;
    background: $leaderboard-gradient;
    border-radius: $leaderboard-radius;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
}

.leaderboard-header {
    display: flex;
    justify-content: space-between;
    padding: $base-padding 20px;
    background: rgba(255, 255, 255, 0.1);
    border-bottom: 1px solid rgba(255, 255, 255, 0.2);
    
    h3 {
        margin: 0;
        color: $text;
        font-size: 20px;
    }
}

.leaderboard-content {
    padding: $base-padding;
}

.leaderboard-item {
    display: flex;
    align-items: center;
    padding: 12px;
    border-radius: $item-radius;
    
    &:hover {
        background: rgba(255, 255, 255, 0.1);
    }
}
```

### Don't Forget to Register It!
**`_sass/open-coding/_main.scss`**

```scss
// ... existing imports ...
@import "leaderboard";  // Add this line!
```

---

## Summary

Converting CSS to SASS is a 7-step process:

1. **Find** your CSS file
2. **Create** new `.scss` file in `_sass/open-coding/`
3. **Add** the import for variables at the top
4. **Copy** your CSS (it works as-is!)
5. **Register** in `_main.scss`
6. **Delete** old CSS file and references
7. **Build** and test

Then optionally improve with:
- Variable substitution
- Nesting
- Local variables
- SASS math
