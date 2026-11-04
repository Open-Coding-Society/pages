---
toc: false
layout: post
tailwind: true
infoGraph: python_flask
title: Python/Flask Backend Infograph
description: Explore the Flask backend through its crash course, project anatomy, API learning path, and Jinja administration views.
courses:
  csp:
    week: 9
  csa:
    week: 2
type: framework
permalink: "/python/flask"
sticky_rank: 1
show_reading_time: false
canonical_id: python-flask
lesson_group: Flask
---

<!-- Infographic - this depends on page.infoGraph frontmatter being set -->
{%- include tailwind/infograph.html -%}

## Create Performance Task Priorities

Build a **program with a purpose**, not just a collection of endpoints. Identify
the problem, audience, and useful behavior first. Then explain how your own
code meets the AP CSP Create Performance Task requirements. Flask is one way
to build the program; authentication, deployment, and a database are project
choices, not substitutes for the required programming evidence.

| Priority | What Your Program Should Demonstrate | Flask / Full-Stack Connection |
| --- | --- | --- |
| **Program with Purpose** | A clear problem being solved or creative interest being pursued, and functionality that supports that purpose. | Explain what the user can accomplish, not just that the server runs. |
| **Input** | Input from a user, device, online data stream, or file. | Identify the form value, JSON field, query parameter, or other input that influences program behavior. |
| **Output** | Output based on input and the program's functionality. | Show a meaningful result in the interface or response, and explain how the program produced it. |
| **List or Other Collection** | Store and use multiple elements in a collection that manages complexity and helps fulfill the program's purpose. | Identify where records enter a list and where the same list is processed. Explain what would be harder without the collection; a database connection alone is not this evidence. |
| **Student-Developed Procedure** | A procedure you developed that contributes to the program's purpose, with one or more parameters that affect its functionality. | A helper such as `select_posts(posts, topic)` can express your logic. Read the parameter's effect, rather than counting a framework handler or library function as your procedure. |
| **Sequencing** | Ordered steps in the algorithm implemented inside the selected procedure. | For example, initialize a result, examine records, and return the resulting collection. |
| **Selection** | A decision in that same procedure's algorithm. | An `if` condition might include a record only when it meets the requested criteria. |
| **Iteration** | Repetition in that same procedure's algorithm. | A loop can examine the collection's records. A single library call does not demonstrate your own loop and decision logic. |
| **Calling Procedures** | A call to the student-developed procedure. | Show where a route or other program code calls your helper, what arguments it passes, and how the result is used. Defining a helper without calling it is not enough. |
| **Testing and Errors** | Inputs with expected outputs or behaviors, and an explanation of errors or corrections. | Use REST Client and the interface to compare normal, boundary, and invalid inputs. Distinguish manual checks from automated tests. |

The selected student-developed procedure must contain an algorithm with
**sequencing, selection, and iteration together**. Scattering these across
unrelated routes is not the same evidence. Its parameters must matter to what
it does. Built-in or library procedures, framework callbacks, and copied starter
code do not by themselves establish student-developed procedural abstraction.
The example helper name above is a design illustration, not supplied CPT code.

### Prepare Evidence You Can Explain

- **Program code:** submit the complete program code and acknowledge code or
  contributions that are not your own, following the task directions.
- **Video:** independently demonstrate program input, at least one aspect of
  functionality, and the resulting output. Follow the handout's format and
  privacy rules rather than showing only setup or server startup.
- **Personalized Project Reference (PPR):** independently capture the required
  procedure definition and call, plus list storage and use. Follow the PPR rules,
  including the exclusion of comments from these captures.
- **Written responses:** prepare to explain purpose/function, algorithm
  development, errors/testing, and data/procedural abstraction. These responses
  are completed on the AP exam; they are not an extra written-reflection upload
  replacing the PPR.

Reading Jokes, Users, and Microblog helps you recognize these concepts in code.
For your own Create task, follow College Board's rules on collaboration,
attribution, and permitted assistance, and be ready to explain your own work.
Keep detailed model and SQL study in its separate series.

### Official Create Task Guidance

- [College Board AP CSP exam and written-response categories](https://apcentral.collegeboard.org/courses/ap-computer-science-principles/exam)
- [Create Performance Task student directions](https://apcentral.collegeboard.org/media/pdf/ap-csp-student-task-directions.pdf)
- [Personalized Project Reference guidance](https://apcentral.collegeboard.org/media/pdf/ap-csp-personalized-project-reference-tip-sheet.pdf)

Use the official directions as the authority for submission rules. This
checklist connects those requirements to the Flask learning path; it is not
a guarantee that using a framework earns Create task credit.

## Why Flask and Backend Matter

Flask gives you the essentials to get started, allowing you to add only the backend features you need (it’s lightweight)—such as API request handling. It’s beginner-friendly, widely used in the industry, and perfect for learning how the backend of a website works. With Flask, you’ll quickly go from writing simple scripts to powering dynamic, data-driven web apps.
