---
layout: post
title: Easy API - Jokes
description: Read a small Flask API, send REST Client requests, and follow its file-backed data calls.
permalink: /python/flask/api/jokes
categories: [Flask, Python, APIs]
lesson_group: Flask
toc: true
---

[Flask API learning path]({{ site.baseurl }}/python/flask/api)

## Start with a Request

Open your Flask repository in VS Code, install **REST Client** by Huachao Mao,
and start the backend using its README. Select the `local` REST Client
environment. The repository's `.vscode/settings.json` supplies `baseUrl`,
normally `http://127.0.0.1:8587`; match it to the running backend's port.

Create an `.http` file inside that backend repository. Do not add a file-level
`@baseUrl`, which would override your selected environment. Send one request at
a time using **Send Request** above each `###` block.

{% raw %}

```http
### Count jokes - expect 200 and an object with count
GET {{baseUrl}}/api/jokes/count
Accept: application/json

### Read jokes - expect 200 and an array
GET {{baseUrl}}/api/jokes
Accept: application/json
```

{% endraw %}

These public reads do not require authentication. Inspect the status, headers,
and JSON body rather than checking only whether a connection succeeded.
These are manual checks, not automatically executed assertions.

## Read hacks/joke.py

Find `joke_api`, its `/api/jokes` prefix, and the resource registrations.
The `/count` path is handled by `_ReadCount.get`; the base path is handled by
`_Read.get`. Combine prefix and resource path to explain each full URL.

The count handler calls `countJokes()` and builds `{"count": count}`. The list
handler calls `getJokes()` and passes the returned list to `jsonify`.
Explain why one request returns an object and the other an array.

## Follow hacks/jokes.py

Follow those two function calls into `hacks/jokes.py`. This is the data layer
for this example, although it does not use a SQLAlchemy model. The functions
read JSON from the configured `DATA_FOLDER`; the file helper uses Flask's
`current_app` to locate the storage directory.

Trace request -> resource handler -> data function -> JSON file -> response.
You do not need to design tables or write SQL for this lesson.

## Read Before Trying Other Operations

The same API registers individual, random, like, jeer, and create resources.
Read their handlers before sending requests. Like and jeer calls change stored
votes. The create handler is unfinished. A registered route does not guarantee
a complete implementation, and the individual lookup does not promise a
friendly response for every invalid ID. Do not assume every API has the same
validation or complete CRUD behavior.

## Explain Your Trace

Use your existing project discussion to identify the handler for each read,
show its response shape, and point to the data function it calls. Next, read
the [User API]({{ site.baseurl }}/flask/api/users) to add authentication
and a database-backed model boundary.
