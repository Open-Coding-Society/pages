---
layout: post
courses: { csse: {week: 4}, csp: {week: 17}, csa: {week: 17 } }
codemirror: true
title: Code Runner - Examples
description: Build a lesson using multiple code runners on a page.  This modular approach allows you to create interactive lessons, more code -- less words.
permalink: /code
---

## Python Lesson: Fix the Syntax Error

{% capture challenge1 %}
Fix the syntax error. Run the code to get a hint!
{% endcapture %}

{% capture code1 %}
print('Hello World'
{% endcapture %}

{% include code-runner.html
   runner_id="exercise1"
   language="python"
   challenge=challenge1
   code=code1
%}

---

## Python Lesson: Complete the Function

{% capture challenge2 %}
Complete the function to calculate the area of a rectangle. Replace the ??? with the correct calculation.
{% endcapture %}

{% capture code2 %}
def calculate_area(length, width):
    # Replace ??? with the correct formula
    area = ???
    return area
''' Test calculate area function '''
print(calculate_area(5, 3))
print(calculate_area(10, 2))
{% endcapture %}

{% include code-runner.html
   runner_id="exercise2"
   language="python"
   challenge=challenge2
   code=code2
   height="350px"
%}

---

## Java Lesson: Fix the Compilation Error

{% capture challenge3 %}
The code has a compilation error. Fix it!
{% endcapture %}

{% capture code3 %}
public class Main {
  public static void main(String[] args) {
    System.out.println("Hello, Java")
  }
}
{% endcapture %}

{% include code-runner.html
   runner_id="exercise3"
   language="java"
   challenge=challenge3
   code=code3
%}

---

## JavaScript Lesson: Complete the Loop

{% capture challenge4 %}
Complete the for loop to print numbers 1 through 5. Fill in the missing parts of the loop.
{% endcapture %}

{% capture code4 %}
// Complete the for loop
for (let i = ???; i <= ???; i++) {
  console.log(i);
}
{% endcapture %}

{% include code-runner.html
   runner_id="exercise4"
   language="javascript"
   challenge=challenge4
   code=code4
%}

---

## Code Runner Reference

Code runner requires defining and passing liquid variables for **challenge** and **code** to the include file `code-runner.html`. Study the source of this markdown file to see how the liquid variables are defined for each example above.

### Parameters

- **runner_id** (required): Unique ID for each runner on the page (e.g., "exercise1", "exercise2")
- **language** (optional): "python", "java", or "javascript" (defaults to "python")
- **challenge**: Variable containing the challenge/instruction text
- **code**: Variable containing the starter code
- **height** (optional): Editor height (defaults to "300px")

### Code Runner Architecture

#### HTML Component

- File: `_includes/code-runner.html`
- Reusable component with parameters for customization
- Uses CodeMirror for syntax highlighting

#### SCSS Styling

- Main file: `_sass/open-coding/forms/code-runner.scss`
- Uses mixins for consistent styling across lessons:
  - `@mixin control-panel` - Top/bottom toolbars with buttons
  - `@mixin sub-container` - Groups editor/output sections
  - `@mixin info-panel` - Challenge box styling
  - `@mixin output-panel` - Code output display
  - `@mixin icon-button` - Consistent button styling
  - `@mixin select-control` - Dropdown menus

#### Color Variables

- File: `_sass/open-coding/user-preferences.scss`
- Uses colors that correspond to user preferences

- `--pref-bg-color` - Background color
- `--pref-text-color` - Text color
- `--pref-accent-color` - Accent/emphasis color
- `--ui-border` - Border color
- `--panel` - Panel background

---
