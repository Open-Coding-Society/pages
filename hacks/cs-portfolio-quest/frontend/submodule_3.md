---
layout: cs-portfolio-lesson
title: "CSS Styling Fundamentals"
description: "Submodule 3 of Frontend Development Mini-Quest"
permalink: /cs-portfolio-quest/frontend/submodule_3/
parent: "Frontend Development"
team: "Creators"
submodule: 3
categories: [CSP, Submodule, Frontend]
tags: [css, styling, fundamentals]
author: "Creators Team"
date: 2025-10-21
---

---
layout: post
title: "CSS Styling Fundamentals"
description: "Submodule 3 of Frontend Development Mini-Quest"
permalink: /cs-portfolio-quest/frontend/submodule_3/
parent: "Frontend Development"
team: "Creators"
submodule: 3
categories: [CSP, Submodule, Frontend]
tags: [css, styling, fundamentals]
author: "Creators Team"
date: 2025-10-21
microblog: True
---


# CSS Styling Fundamentals


## Learning Objectives
By the end of this module, you will be able to:
- Understand basic CSS syntax and how to apply styles
- Use different types of CSS selectors effectively
- Implement basic layouts and styling techniques
- Debug common CSS issues


## Prerequisites
- Basic understanding of HTML structure
- Familiarity with text editors
- Basic web development concepts


## 1. CSS Basics


CSS (Cascading Style Sheets) is a powerful language used to style webpages. It describes how HTML elements are displayed on the screen and can easily change properties of elements like colors, layouts, spacing, and more.


### CSS Implementation Methods
CSS can be implemented in three ways:
1. **Inline CSS**: Directly in HTML elements using the style attribute
2. **Internal CSS**: Using the `<style>` tag in HTML document
3. **External CSS**: Linking an external .css file


Example of each:
```html
<!-- Inline CSS -->
<p style="color: blue;">This is inline styling</p>


<!-- Internal CSS (in head section) -->
<style>
    p { color: blue; }
</style>


<!-- External CSS -->
<link rel="stylesheet" href="styles.css">
```


### Basic Syntax
CSS follows a simple pattern:
```css
selector {
    property: value;
    another-property: value;
}
```


## 3. CSS Box Model
The CSS box model is fundamental to understanding layout in CSS. Every element in CSS has:
- Content: The actual content of the element
- Padding: Clear space around the content
- Border: A border around the padding
- Margin: Clear space outside the border


## Code Example
A common HTML element used in almost every page is <p>. To style this, we can do something like:


p {
    font-family: Papyrus;
    font-size: 15px;
    color: blue;
}


Here is a 'cheat sheet' to some common things you can style with CSS (You may need to look up more details about a specific property in order to use it as this cheat sheet is simply an overview of properties you can use, not how to use them):
<a href="https://docs.google.com/spreadsheets/d/1cPH5LYVC5lIy5zE4CmK2D_cMIoQfSDDn7RwHzgbpPc0/edit?gid=0#gid=0">Cheat Sheet</a>


## Grouping and Nesting
If we want to add the same styling to multiple elements, we can use grouping. Similar to the example with p above, simply add multiple elements before the {} to do this. Example:


h1, h2 {
    color: red;
}


We can also target elements in a heirarchy like this:


ul li {
    list-style-type: square;
}


## 2. CSS Selectors


CSS selectors are patterns used to select and style HTML elements. Here are the main types:


### Basic Selectors
1. **Universal Selector (*)**
   ```css
   * { margin: 0; }
   ```


2. **Element Selector**
   ```css
   p { color: blue; }
   ```


3. **Class Selector (.)**
   ```css
   .button { background: yellow; }
   ```


4. **ID Selector (#)**
   ```css
   #header { font-size: 24px; }
   ```


### Advanced Selectors
1. **Attribute Selectors**
   ```css
   input[type="text"] { border: 1px solid gray; }
   ```


2. **Pseudo-classes**
   ```css
   a:hover { color: red; }
   ```


3. **Combinators**
   ```css
   div > p { margin: 10px; }
   ```


## Comments
A very basic part of CSS, but it is always good practice to comment on code that may be unclear. To create a single line comment, use /**/ in the same line, and you can also spread that out through multiple lines to create a multi-line comment. Examples:


.button {
    /* This is a single line comment */
    background-color: yellow;
}


#header {
    /* This is a
        multi-line comment */
    font-family: Papyrus;
}


## Other Resource(s)
You can find a lot more in-depth information here: <a href="https://www.geeksforgeeks.org/css/css-introduction/">Geeks for Geeks CSS Introduction</a>


## Best Practices
1. Use meaningful class names
2. Keep selectors simple
3. Use comments for complex styles
4. Organize properties consistently
5. Consider mobile-first design


## 4. Layout with Flexbox
Flexbox is a powerful layout model that makes it easy to create flexible, responsive layouts.


## Common Pitfalls to Avoid
- Overusing !important
- Deep nesting of selectors
- Mixing units unnecessarily
- Not considering browser compatibility


## Practice Challenges
1. Create a centered card with padding and shadow
2. Build a simple navigation bar using flexbox
3. Create a responsive grid layout
4. Style a form with custom inputs

