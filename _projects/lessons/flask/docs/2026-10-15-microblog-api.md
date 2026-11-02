---
layout: post
title: Microblog API
description: Read authenticated microblog handlers, filtering, validation, permissions, and their model calls.
permalink: /python/flask/api/microblog
categories: [Flask, Python, APIs]
lesson_group: Flask
toc: true
microblog: true
---

[Flask API learning path]({{ site.baseurl }}/python/flask/api)

## Before You Start

Microblog is the comment panel on OCS pages, and a Flask API runs it. In this
lesson you use it first, then read the code behind it, then show its posts on
a page of your own. If you built the Spring feature in
[Backend Fullstack Development]({{ site.baseurl }}/fullstack/java/backend),
you will see the same five parts arranged differently.

## Read Posts with REST Client

Use the Flask backend's `local` REST Client environment and authenticate with
`api/user_auth.http`, as in the User API lesson. Keep the same host so the
authentication cookie is reused. Add these requests to an `.http` file inside
that backend repository and send them independently.

{% raw %}

```http
### Authenticated read - expect an object with microblogs and count
GET {{baseUrl}}/api/microblog?limit=5
Accept: application/json

### Authenticated validation check - expect 400 and no new post
POST {{baseUrl}}/api/microblog
Content-Type: application/json
Accept: application/json

{
  "content": ""
}
```

{% endraw %}

After successful authentication, the empty-content request returns
`Content is required`. If authentication fails first, the content-validation
path has not been tested. These are manual checks, not automated assertions;
inspect both the status and message.

## Read api/microblog_api.py

Find the `/api` blueprint prefix and the `/microblog` registration for
`MicroBlogAPI._CRUD`. Read `token_required()` before the CRUD methods. This API
is more than a list endpoint: its handler validates input, selects model calls,
checks permissions, and constructs a response.

| Method | Read for These Decisions |
| --- | --- |
| GET | `limit`, `search`, `topicId`, `pagePath`, and `userId` select a retrieval path; the response contains `microblogs` and `count`. |
| POST | `content` is required and limited to 280 characters; `topicId`, `topicPath`, and `data` are optional. |
| PUT | An `id` is required; the post must exist, and the caller must own it or have Admin permissions. |
| DELETE | An `id` is required; existence and ownership/Admin checks precede deletion. |

Read the order of the GET branches. Multiple filters do not automatically mean
all filters are combined: identify which branch wins from the code. Read each
method's actual status codes rather than importing assumptions from another API.

## Follow model/microblog.py

Follow one retrieval branch into `MicroBlog.search_content`, `get_by_topic`,
`get_by_user`, or `get_all`. For the page-path branch, identify the lookup in
`Topic` before the post retrieval call.

Read the create handler without sending a real create request: optional
`topicPath` can trigger `Topic.get_or_create_for_page`, then a `MicroBlog`
instance is created and its model methods produce response data. Identify
the inputs and returned values at each boundary.

That is the model scope of this lesson. Table design, joins, relationships,
SQLAlchemy queries, and migrations belong in a separate database series.
Actual writes should use disposable, authorized development records with a
cleanup plan; they are not required for the read and validation checks above.

## Continue by Reading the Repository

Choose a reply, reaction, or topic resource in this same source file. Apply
the routine from the [API hub]({{ site.baseurl }}/python/flask/api): registered
URL, handler, permissions, input validation, model call, and response.

After Jokes, Users, and Microblog, the Flask source code is the API learning
reference. Use your existing project discussion to explain your trace and
compare the contract with the observed response, rather than looking for
another standalone API tutorial.
