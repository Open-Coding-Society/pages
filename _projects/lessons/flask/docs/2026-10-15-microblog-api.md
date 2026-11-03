---
layout: post
title: Microblog API
description: Read authenticated microblog handlers, filtering, validation, permissions, and their model calls.
permalink: /python/flask/api/microblog
author: Akshaj Gurugubelli
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

## Popcorn Hack 1: Post and Watch the Request

Send a real request before reading any code.

1. Open your browser's developer tools, choose the **Network** tab, and filter
   by `microblog`.
2. Press **Microblog** at the top of this page. If you are not signed in, use
   **Guest Signup** in the panel.
3. Post one sentence: what should an API check before it saves a post? Posts
   are public, so leave out anything personal.
4. Select the `POST` request in the Network tab. Find the URL, the `content`
   and `topicPath` you sent, the status code, and the `id` that came back.

Keep that request open. The rest of this lesson explains what happened to it.

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

Read the create handler with your Popcorn Hack 1 request beside it: optional
`topicPath` can trigger `Topic.get_or_create_for_page`, then a `MicroBlog`
instance is created and its model methods produce response data. Identify
the inputs and returned values at each boundary.

That is the model scope of this lesson. Table design, joins, relationships,
SQLAlchemy queries, and migrations belong in a separate database series.
Beyond your one post in the panel, actual writes should use disposable,
authorized development records with a cleanup plan; they are not required for
the read and validation checks above.

## Popcorn Hack 2: Match the Spring Parts

The Spring feature splits its work across five files. Microblog does the same
jobs in fewer places.

| Spring Part | Its Job | Where Microblog Does It |
| --- | --- | --- |
| Entity | Describes the table | `MicroBlog` class with `db.Column` fields in `model/microblog.py` |
| JPA Repository | Reads and saves rows | Methods on the same class, such as `get_by_topic`, `search_content`, and `create` |
| Service | Holds the rules | No separate file: rules sit in the handler, such as the `Content is required` check |
| Controller | Turns HTTP into method calls | `MicroBlogAPI._CRUD` in `api/microblog_api.py` |
| Table Initializer | Makes sure the table exists | `db.create_all()` in the backend's database scripts builds tables from the models |

Answer these in the Microblog panel on this page:

1. The 280 character limit appears in two places. Find `len(content) > 280` in
   the handler and `db.String(280)` in the model. What does each one protect?
2. `put` checks that the caller owns the post. Which Spring file would hold
   that check?

## Popcorn Hack 3: Show Posts with UI Builder

UI Builder never sends sign-in cookies, so `GET /api/microblog` will not work
there: it needs `token_required()`. Find `TopicAPI._PageMicroblogs` in
`api/microblog_api.py`. Its `get` has no `token_required()`, but it still checks
the topic first:

| Response | Reason |
| --- | --- |
| 200 | The topic exists and allows anonymous viewers |
| 401 | The topic does not allow anonymous viewers and nobody is signed in |
| 404 | No topic has this key yet |

Your Popcorn Hack 1 post sent a `topicPath`, so the create handler made this
page's topic with `allow_anonymous=True`. `Topic._generate_page_key` then turned
`/python/flask/api/microblog` into the key `python_flask_api_microblog`.

1. Sign in, open [UI Builder]({{ site.baseurl }}/ui-builder/), and start from the
   **Flask API starter** template.
2. In **Data from your API**, change the link to
   `https://flask.opencodingsociety.com/api/microblog/page/python_flask_api_microblog`
   and press **Test connection**. A 404 means nobody has posted on this page yet.
3. Read the warning about `userUid`. This route is public, so everyone can read
   what it returns, and a response should only carry fields a stranger may see.
4. Choose how to show the posts, then press **Code** to read the `ocs__` classes
   behind your page.

These are manual checks, so inspect the status and the posts yourself.

## Continue by Reading the Repository

Choose a reply, reaction, or topic resource in this same source file. Apply
the routine from the [API hub]({{ site.baseurl }}/python/flask/api): registered
URL, handler, permissions, input validation, model call, and response.

After Jokes, Users, and Microblog, the Flask source code is the API learning
reference. Use your existing project discussion to explain your trace and
compare the contract with the observed response, rather than looking for
another standalone API tutorial.

## Study This With AI

Paste `api/microblog_api.py` and `model/microblog.py` into your AI tool, then
check its answers against the code. Never paste passwords, tokens, or your
`.env` file.

- **Draw it:** Draw a Mermaid sequence diagram of one POST to /api/microblog,
  from the browser through the handler and model to the database and back.
- **Quiz me:** Ask me 5 questions, one at a time, on which GET branch wins when
  a request sends more than one filter. Tell me what I missed.
- **Compare it:** Show where a Spring service would hold the rules in this
  handler, and what Flask gains and loses by keeping them there.
- **Break it:** List 3 requests that would fail on this API and the status code
  each returns. I will test them in my `.http` file and tell you where you were
  wrong.
