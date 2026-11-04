---
layout: post
title: Flask APIs
tailwind: true
description: Read Flask APIs through jokes, users, and microblog examples using VS Code REST Client.
courses:
  csp:
    week: 10 
infoGraph: python_flask_api
permalink: "/python/flask/api"
breadcrumb: true
show_reading_time: false
lesson_group: Flask
---

{%- include tailwind/infograph.html -%}

## From Examples to Reading Flask Code

Follow the three lessons above in order. Each starts with an HTTP request in
VS Code REST Client, follows the Flask handler, and identifies the corresponding
data or model call. The goal is to learn how to read the backend, not collect
separate tutorials for every API.

| Example | Read the Handler | Follow the Data Call |
| --- | --- | --- |
| [Easy API - Jokes]({{ site.baseurl }}/python/flask/api/jokes) | `hacks/joke.py` | Functions in `hacks/jokes.py`, backed by a JSON file |
| [User API]({{ site.baseurl }}/flask/api/users) | `api/user.py` | User operations in `model/user.py` |
| [Microblog API]({{ site.baseurl }}/python/flask/api/microblog) | `api/microblog_api.py` | `MicroBlog` and `Topic` in `model/microblog.py` |

## The Reading Routine

1. Find the blueprint prefix and resource registration to identify the URL.
2. Locate the method handling the request and check authentication or permissions.
3. Identify input fields, query parameters, and validation failures.
4. Follow the data/model call far enough to explain its input and returned value.
5. Compare the handler's status and response structure with REST Client output.

After these three examples, use this routine to read additional APIs directly
in the Flask repository. API handlers and their registered routes are the
reference for current behavior. These lessons introduce model boundaries;
detailed SQLAlchemy relationships, schemas, SQL, migrations, and transactions
belong in a separate model/database series.

For setup and directory orientation, use the
[Flask structure guide]({{ site.baseurl }}/python/flask/anatomy). Other non-API
references remain in [Flask Topics]({{ site.baseurl }}/topics/?category=flask).
