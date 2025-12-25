---
layout: post
coderunner: true
title: Code Runner Examples
description: A lesson showing how lesson can built using multiple code runners on a page.  This is a great way to create interactive lessons. Code Runner specialize in console output.
permalink: /code/lesson
---

## Define Code Runner in a Lesson

Code runner requires the **include to contain parameters**.

```liquid
{% raw %}{% include code-runner.html 
   runner_id="exercise1"
   language="python"
   challenge=challenge1
   code=code1
   height="300px"
%}{% endraw %}
```

### Parameter Definitions

Be sure to look at the working code in this lesson to customize your own examples.

- **runner_id** (required): Unique ID for each code runner on the page
- **language** (optional): "python", "java", or "javascript" (default: "python")
- **challenge** (required): The challenge text to display
- **code** (required): The initial code to load in the editor
- **height** (optional): Height of the editor (default: "300px")

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
