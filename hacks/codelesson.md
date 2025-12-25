---
layout: post
coderunner: true
title: Code Runner Lessons 
description: Example showing how student teachers can use multiple code runners on one page for interactive lessons.
permalink: /code/lesson
---

## Python Lesson: Fix the Syntax Error

{% capture challenge1 %}
Fix the syntax error in the print statement. The parenthesis is not closed!
{% endcapture %}

{% capture code1 %}
# Fix this code
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

## Test your function

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
The code has a compilation error. The System.out.println statement is missing a semicolon. Fix it!
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

## How to Use This in Your Lessons

To create a code runner exercise in your markdown file:

1. **Include CodeMirror CSS/JS** at the top of your page (copy from this example)

2. **Define your challenge and code** using Liquid capture blocks:

```liquid
{% raw %}{% capture challenge1 %}
Fix the syntax error in the print statement.
{% endcapture %}

{% capture code1 %}
print('Hello World'
{% endcapture %}{% endraw %}
```

3. **Include the code runner** with parameters:

```liquid
{% raw %}{% include code-runner.html 
   runner_id="exercise1"
   language="python"
   challenge=challenge1
   code=code1
   height="300px"
%}{% endraw %}
```

### Parameters

- **runner_id** (required): Unique ID for each code runner on the page
- **language** (optional): "python", "java", or "javascript" (default: "python")
- **challenge** (required): The challenge text to display
- **code** (required): The initial code to load in the editor
- **height** (optional): Height of the editor (default: "300px")

### Tips

- Each runner on a page needs a unique `runner_id`
- Students can edit and run the code directly
- Use keyboard shortcut: Ctrl+Enter (or Cmd+Enter) to run code
- Great for "fix the bug" or "complete the code" exercises!
