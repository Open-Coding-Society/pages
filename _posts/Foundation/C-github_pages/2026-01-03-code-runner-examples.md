---
layout: post
courses: { csse: {week: 4}, csp: {week: 17}, csa: {week: 17 } }
codemirror: true
title: Code Runner - Examples
description: Build a lesson using multiple code runners on a page.  This modular approach allows you to create interactive lessons, more code -- less words.
permalink: /code
---

## Introduction to Code Runners

In this post, we will explore how to use code runners to create interactive lessons. Code runners allow you to embed code snippets that can be executed directly on the page, providing an engaging learning experience for students. We support 4 languages: Python, Java, JavaScript, and AP CSP Pseudocode.


### Python Code Runner 
{% capture python_example %} 
print("Hello, World!")
for i in range(5):
    print(i)
{% endcapture %} 
{% include runners/code.html runner_id="python-main" language="python" code=python_example%}

The following code snippet demonstrates a simple Python code runner. You can run this code directly on the page to see the output.

### Java Code Runner
{% capture java_example %} 
public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
        for (int i = 0; i < 5; i++) {
            System.out.println(i);
        }
    }
}
{% endcapture %} 
{% include runners/code.html runner_id="java-main" language="java" code=java_example %}

The Java code runner allows you to execute Java code snippets. The example above prints "Hello, World!" and counts from 0 to 4.

### JavaScript Code Runner
{% capture js_example %} 
console.log("Hello, World!");
for (let i = 0; i < 5; i++) {
    console.log(i);
}
{% endcapture %} 
{% include runners/code.html runner_id="js-main" language="javascript" code=js_example %}

The JavaScript code runner lets you run JavaScript code snippets. The example provided logs "Hello, World!" and counts from 0 to 4 in the console.

### AP CSP Pseudocode Runner

Context: AP Computer Science Principles has a standardized pseudocode language that is used in the AP CSP exam. Our code runner supports this pseudocode, allowing students to practice and execute their pseudocode snippets directly on the page.


{% capture csp_example %} 
num1 ← INPUT("Enter first number:")
op ← INPUT("Enter operator (+, -, *, /):")
num2 ← INPUT("Enter second number:")
result ← 0
IF (op = "+")
{
    result ← num1 + num2
}
ELSE
{
    IF (op = "-")
    {
        result ← num1 - num2
    }
    ELSE
    {
        IF (op = "*")
        {
            result ← num1 * num2
        }
        ELSE
        {
            IF (op = "/")
            {
                IF (num2 ≠ 0)
                {
                    result ← num1 / num2
                }
                ELSE
                {
                    DISPLAY("Error: Division by zero")
                    result ← "undefined"
                }
            }
            ELSE
            {
                DISPLAY("Invalid operator")
                result ← "undefined"
            }
        }
    }
}

DISPLAY("Result: "+ result)
{% endcapture %} 
{% include runners/code.html runner_id="csp-main" language="pseudocode" code=csp_example %}

The AP CSP Pseudocode runner allows you to execute pseudocode snippets. The example above is a simple calculator that takes two numbers and an operator as input and displays the result.


### Embedding Code Runners in YOUR notebooks

To embed code runners in your notebooks, you can use the following syntax:

{% raw %}
```liquid
{% include runners/code.html runner_id="your-runner-id" language="your-language" code=your_code_variable %}
```
{% endraw %}

Example Embedding a Python Code Runner:

{% raw %}
```liquid
{% include runners/code.html runner_id="python-main" language="python" code=python_example %}
```
{% endraw %}

This modular approach allows you to create interactive lessons with more code and less text, making it easier for students to learn by doing. You can customize the code snippets and languages to fit the needs of your lesson.

Example Embedding a Pseudocode Code Runner with preset code:

{% raw %}
```liquid
{% capture csp_example %}
num1 ← INPUT("Enter first number:")
op ← INPUT("Enter operator (+, -, *, /):")
num2 ← INPUT("Enter second number:")
result ← 0
IF (op = "+")
{
    result ← num1 + num2
}
ELSE
{
    IF (op = "-")
    {
        result ← num1 - num2
    }
    ELSE
    {
        IF (op = "*")
        {
            result ← num1 * num2
        }
        ELSE
        {
            IF (op = "/")
            {
                IF (num2 ≠ 0)
                {
                    result ← num1 / num2
                }
                ELSE
                {
                    DISPLAY("Error: Division by zero")
                    result ← "undefined"
                }
            }
            ELSE
            {
                DISPLAY("Invalid operator")
                result ← "undefined"
            }
        }
    }
}

DISPLAY("Result: "+ result)
{% endcapture %}
{% include runners/code.html runner_id="csp-main" language="pseudocode" code=csp_example %}
```
{% endraw %}

Notice the capture block that allows you to define the code snippet in a variable, which can then be passed to the code runner. This makes it easy to manage and update your code snippets without having to modify the HTML structure of your page.

