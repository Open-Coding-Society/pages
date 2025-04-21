---
layout: post
title: Aesthetihawk Guide - Typography
categories: [Aesthetihawk]
permalink: /aesthetihawk-guide-typography
author: Aashray Reddy
menu: nav/aesthetihawk-guide.html
toc: false
---

## Typography

### How to Use

Our site uses **semantic HTML tags** to control text styling. Instead of applying custom classes, developers should use the appropriate tags like `<h1>`, `<h2>`, and `<p>`. These tags are automatically styled through our global styles to ensure visual consistency, accessibility, and responsive behavior.

**✅ Correct usage:**

```html
<h1>Main Heading</h1>
<h2>Section Title</h2>
<p>This is a paragraph of text explaining something.</p>
```

**❌ Avoid:**

```html
<p class="big bold">Main Heading</p> <!-- Don't do this -->
```

---

### Supported Tags & Visual Hierarchy

| Tag     | Purpose                           | Usage Example                        |
|---------|------------------------------------|--------------------------------------|
| `<h1>`  | Page title                         | Used once per page (top-level heading) |
| `<h2>`  | Section titles                     | Major sections within a page         |
| `<h3>`  | Sub-sections or card headers       | Grouping inside `<h2>` sections      |
| `<h4>`  | Minor headings                     | Optional for smaller sub-sections    |
| `<p>`   | Paragraphs and body content        | Default for most content text        |
| `<strong>` | Emphasis or importance         | Highlights key words/phrases         |
| `<em>`  | Subtle emphasis or tone shift      | Used for soft emphasis (like italics)|
| `<ul>`, `<ol>`, `<li>` | Lists              | Use for bullets or ordered items     |

---

### When to Use What

- Use **`<h1>`** for the main page heading. There should only be **one** per page.
- Use **`<h2>`** for top-level sections like "Features", "Pricing", or "FAQ".
- Use **`<p>`** for all standard body text.
- Use **`<h3>` and below** when you need to break down content within a section.
- Use **`<strong>`** instead of manually bolding words.
- Use **semantic HTML** so assistive tech and search engines understand your content structure.

---

### Accessibility & SEO Benefits

- Semantic tags improve screen reader experiences.
- Headings create a logical outline of the page for users and search engines.
- Default styles ensure your typography scales responsively across devices.

---

### Recap

✅ Use semantic tags  
❌ Don’t style text manually  
🎯 Let the system handle the look — you just focus on structure.

## Examples

<h1>Top-level heading</h1>

<h2>Section title or sub-Level heading. Use for major sections.</h2>

<h3>Third-level heading. Use for sub-sections within a section.</h3>

<h4>Minor heading. Use for small headings.</h4>

<p>Normal text. Use for all body text, explanations, or descriptions.</p>

<p>This is <strong>important</strong> text. Use it to emphasize key words or actions.</p>

<p>This is <em>somewhat important</em> text. Use for soft emphasis, tone shifts, or alternate voice.</p>


<ul>
  <li>Unorder lists don't have numbers</li>
  <li>Good for bullet notes</li>
  <li>Good if order isn't important</li>
</ul>


<ol>
  <li>Ordered lists have numbers</li>
  <li>Good for steps</li>
  <li>Good if order is important (chronological)</li>
</ol>