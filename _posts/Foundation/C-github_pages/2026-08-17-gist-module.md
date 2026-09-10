---
layout: post
title: Gist Module
description: A shared service for moving a bundle of files out of a page and getting them back again. Any feature that needs to hand work to another person, another page, another machine, or another system builds on it instead of inventing its own storage.
permalink: /gist
toc: true
breadcrumb: True
---

## What it is

The Gist Module is a way to take a set of files from a page, put them somewhere
durable, and get back a URL that points at them. Give that URL back later and the
files come out again.

```
export  →  files in,  URL out
import  →  URL in,    files out
```

That is the entire service. It has no opinion about what the files contain — code,
notes, answers, configuration — and no opinion about who asks for them. Features
supply the meaning; the module supplies the transport.

## Why it exists

### A page cannot keep a secret

The OCS site is static. It is built ahead of time and served as plain files, so
everything it ships is readable by anyone who opens View Source. There is nowhere
in a page to hide a credential.

Storing files on a student's behalf requires one. So the browser does not get the
credential — it asks the Spring backend to act for it. The backend runs on a
machine OCS controls, holds the token, and returns only the result.

```
browser ──files──────> Spring ──files + token──> GitHub
browser <────URL────── Spring <────────────────
```

### A URL is the point

Most page state has nowhere to go:

| Where state lives | How long it survives | Who else can reach it |
|---|---|---|
| A variable | until the tab refreshes | nobody |
| `localStorage` | until the browser is cleared | nobody — one machine only |
| A database row | indefinitely | our app, with a login and a schema |
| **A gist** | indefinitely | anyone given the link, including tools outside OCS |

A variable cannot be sent to somebody. Once a bundle has a URL it can be pasted
into a message, handed to a teacher, opened by another page, fetched by a script,
or kept by a student after they leave.

That is the property the module exists to provide: **state with an address.**

### When not to use it

It is not a database and not a system of record.

- **You cannot search it.** "Every student who scored below 70" is a database
  question; a gist cannot answer it.
- **It is not private.** Bundles are unlisted, not protected — anyone with the
  link can read one.
- **It depends on GitHub** being reachable and the server's token being valid.

The usual arrangement is both: the record goes in the database, and the record
stores the URL of the bundle that holds the content.

---

## Quick start

The smallest thing that works:

```js
import { exportToGist, importFromGist } from '/assets/js/gist.js';

// send
const url = await exportToGist(
  { 'notes.txt': { content: 'hello world' } },
  { type: 'demo' }
);

// get it back
const { files } = await importFromGist(url);
console.log(files['notes.txt'].content);   // "hello world"
```

Any script using these must be loaded as a module:

{% raw %}
```html
<script type="module" src="{{ '/assets/js/my-feature.js' | relative_url }}"></script>
```
{% endraw %}

An `import` inside a plain `<script>` is a syntax error, and the file will fail
silently.

---

## The HTTP API

Two endpoints, both public, both requiring `GIST_TOKEN` on the server.

### Create a bundle

```http
POST /api/grades/create-gist
Content-Type: application/json
X-Origin: client
```

```json
{
  "files": {
    "notes.txt": { "content": "hello world" },
    "main.java": { "content": "public class Main { }" }
  },
  "description": "optional label"
}
```

Returns:

```json
{ "success": true, "url": "https://gist.github.com/user/3f7a1b..." }
```

Bundles are created unlisted. The server sets this itself, so a caller cannot ask
for a listed one.

### Read a bundle

```http
GET /api/grades/read-gist/{id}
```

`{id}` must be hexadecimal, 6–64 characters. Anything else is rejected before the
server contacts GitHub.

Returns:

```json
{
  "success": true,
  "files": { "notes.txt": { "content": "hello world" } },
  "description": "optional label"
}
```

Only file contents come back. GitHub's own response also carries `raw_url`,
`size`, `truncated`, `owner` and more; none of it is passed through.

### Errors

| Status | Body | Meaning |
|---|---|---|
| `400` | `{"error":"Invalid gist id"}` | malformed id — checked before anything else |
| `400` | `{"error":"No files provided"}` | empty bundle |
| `404` | `{"error":"No gist with that id"}` | nothing at that id |
| `500` | `{"error":"Gist token not configured on server"}` | `GIST_TOKEN` unset |
| `502` | `{"error":"Empty response from GitHub"}` | GitHub replied with nothing |

Calls to GitHub time out after 10 seconds, so a stalled request cannot hold a
server thread open indefinitely.

---

## Browser modules

Two files, kept deliberately separate:

> **`gist.js` never imports a producer. `runner-io.js` never imports a transport.
> Only a feature imports both.**

This is what makes them reusable. Because the runner reader knows nothing about
gists, the same reader can send code to an AI grader or a chat message with no
gist involved. Because the transport knows nothing about runners, it can carry a
bundle that never came from one.

### `gist.js`

```js
import {
  exportToGist, importFromGist, gistIdFrom, readManifest, MANIFEST
} from '/assets/js/gist.js';
```

#### `exportToGist(files, opts?) → Promise<string>`

Sends a bundle; resolves to its URL.

| Parameter | Meaning |
|---|---|
| `files` | `{ "name.ext": { content: "..." } }` |
| `opts.type` | what this bundle is, e.g. `'portfolio'` — recorded in the manifest |
| `opts.description` | human-readable label |

Throws if the bundle is empty. On `401`/`403` throws `Sign in before exporting.`

#### `importFromGist(urlOrId) → Promise<{ files, description, manifest }>`

Opens a bundle. Accepts a full URL or a bare id, and rejects malformed input
*before* making any request.

#### `gistIdFrom(urlOrId) → string | null`

Extracts an id from whatever someone pastes; `null` if there isn't one.

```js
gistIdFrom('https://gist.github.com/kush1434/3f7a1b...');   // '3f7a1b...'
gistIdFrom('https://gist.github.com/3f7a1b...');            // '3f7a1b...'
gistIdFrom('3f7a1b...');                                     // '3f7a1b...'
gistIdFrom('.../3f7a1b...#file-main-java');                  // '3f7a1b...'
gistIdFrom('https://example.com/nope');                      // null
```

#### `readManifest(files) → object | null`

Returns the manifest from a bundle, or `null` if it has none.

### `runner-io.js`

For features built around code runners. It imports nothing at all.

```js
import {
  readRunners, writeRunners, unsavedRunners, listRunners, readRunner
} from '/assets/js/runner-io.js';
```

| Function | Returns |
|---|---|
| `listRunners()` | every runner element on the page |
| `unsavedRunners()` | runners whose code has not been saved with 💾 |
| `readRunner(el)` | one runner's saved code, or `null` |
| `readRunners(opts?)` | all saved work, as a bundle |
| `writeRunners(files)` | loads code **into** runners; returns the ids written |

`readRunners()` prepends each challenge prompt so a bundle is readable away from
the lesson. Pass `{ includeQuestion: false }` for bare code.

`writeRunners()` matches files to runners by id — `main.java` fills the runner
whose `runner_id` is `main` — and writes to the same key the runner reads from,
so loaded code survives a refresh exactly like the student's own.

---

## The manifest

Passing `type` adds one small file to every bundle:

```json
{
  "type": "portfolio",
  "version": 1,
  "source": "/csa/unit-3",
  "createdAt": "2026-08-17T09:14:22.418Z"
}
```

This is what makes a bundle a **format** rather than a pile of files. A consumer
checks it before doing anything:

```js
const { files, manifest } = await importFromGist(url);
if (manifest?.type !== 'portfolio') {
  throw new Error('That link is not a portfolio.');
}
```

Skip the check and a page will happily render a bundle meant for something else.

Use a short, stable name and keep using it: `portfolio`, `starter`,
`peer-review`, `help-request`, `submission`.

---

## Building a feature

Three steps; only the last is new code.

### 1. Choose where the bundle comes from

If it is code runners, `runner-io.js` already does it. Otherwise write a small
reader returning the same `{ name: { content } }` shape — and do not let it
import `gist.js`.

### 2. Choose a type name

One stable string. It is how your bundles are recognised later.

### 3. Write the feature

```js
// assets/js/portfolio.js
import { readRunners } from '/assets/js/runner-io.js';
import { exportToGist, importFromGist } from '/assets/js/gist.js';

const TYPE = 'portfolio';

export async function save() {
  const files = readRunners();
  if (!Object.keys(files).length) {
    throw new Error('Save your work first with the 💾 button.');
  }
  return exportToGist(files, { type: TYPE, description: 'Course portfolio' });
}

export async function load(url) {
  const { files, manifest } = await importFromGist(url);
  if (manifest?.type !== TYPE) {
    throw new Error('That link is not a portfolio.');
  }
  return files;
}
```

Then surface it on a page:

{% raw %}
```html
<!-- _includes/portfolio.html -->
{% if page.portfolio %}
  <div id="portfolio-widget">
    <button id="portfolio-save">Save my work</button>
    <p id="portfolio-status"></p>
  </div>
  <script type="module" src="{{ '/assets/js/portfolio.js' | relative_url }}"></script>
{% endif %}
```
{% endraw %}

And switch it on in a lesson's front matter:

```yaml
---
layout: post
title: My Lesson
portfolio: true
---
```

### Wiring checklist

- Add the include to **both** branches of `_layouts/post.html`. Course lessons and
  ordinary posts render through different arms of a single condition, and an
  include added to only one is silently missing on the other.
- Register any stylesheet as a partial in `_sass/open-coding/` **and** add an
  `@import` for it in `_main.scss`, or the classes do nothing.
- Load the script with `type="module"`.
- Take the backend address from `javaURI` in `assets/js/api/config.js`. Never
  hardcode a host.

---

## Features built on it

- **Assignment submission** — reads a lesson's runners, bundles the code, and
  stores the resulting URL against the student's record. The database keeps the
  record; the bundle keeps the content.
- **Starter code** *(possible)* — a teacher edits a bundle, and a lesson's runners
  load from it, so material can change without a site rebuild.
- **Peer review** *(possible)* — one student shares a bundle and another opens it
  on their own page.
- **Portfolio export** *(possible)* — a student takes their whole course with them
  when they leave.

Each is the same two calls with different answers to *who produces*, *what is in
it*, and *who opens it*.

---

## Traps

| Trap | Symptom | Fix |
|---|---|---|
| Hardcoded backend host | works locally, dead on the live site | import `javaURI` |
| Plain `<script>` | the whole file silently does nothing | `type="module"` |
| Include in one layout branch | widget missing on some pages | add to both |
| Stylesheet not imported | styles have no effect | partial **and** `@import` |
| No manifest check on import | renders another feature's bundle as garbage | check `manifest.type` |
| Passing GitHub's response through | leaks detail, breaks on vendor change | return only what is needed |
| Dev server on an unlisted port | every request fails at CORS, with no clear reason | add the port to **`SecurityConfig`** — it governs `/api/**`, and its list is not the same as `MvcConfig`'s |

Both endpoints are open, and every call spends the organisation's single token.
That suits an open export tool; if usage grows, requiring a login or capping
bundle size is the place to start.

---

## Running and verifying locally

```bash
# backend — .env must exist; GIST_TOKEN must be set for real calls
cd spring
python3 scripts/db_init.py     # first run only, creates the local database
./mvnw spring-boot:run         # serves on 8585

# frontend
cd pages && make               # serves on 4500
```

Check in this order, so a failure identifies its own layer:

1. **`curl` the endpoint** — proves the backend, the token, and the security rule.
2. **The browser** — proves CORS and your page wiring.
3. **The deployed site** — proves `javaURI` and the server's environment.

Most "it just doesn't work" reports are a layer-one problem discovered at layer
three.
