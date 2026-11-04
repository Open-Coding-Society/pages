# Flask Lessons

This registered lesson project owns the Flask notebooks and authored Markdown
previously scattered through `_notebooks/CSP/flask`, `_posts/CSP/flask`, and
the Foundation tools references. Notebook sources are flat in `notebooks/`;
authored Markdown and historical Markdown-only exports are in `docs/`.
Edit these sources, not the published copies. Authored documents mirror into
`_posts/projects/flask/docs/`; converted notebooks remain under `_posts/projects/flask/`.

The existing map remains at `/python/flask/csp/`; its unsplit source is the
document in `docs/` with permalink `/python/flask`. Preserve its CSP/CSA split and permalink.
Every lesson carries the `flask` category, so the shared collection is
`/topics/?category=flask`. `/navigation/flask/` hosts the same Topics browser.
The shared `nav/flask.html` points at the current map and core routes.

## Top-Level Reference Map

The top-level document with permalink `/python/flask` uses
`_data/python_flask.yml` to organize the retained reference areas:

- Crash Course: `/python/flask/crash-course` - server setup and a minimal application.
- Anatomy: `/flask/anatomy` - the repository structure and its responsibilities.
- APIs: `/python/flask/api` - the separate three-example API learning path.
- Jinja UI: `/python/flask/jinja_ui` - backend administration views.

Use this map and the anatomy guide to decide which supporting non-API
documents belong here. Do not duplicate the API lessons in those references.
Keep course placements in `courses.<course>.week` front matter and course data;
do not put teaching-week labels or time estimates in lesson prose or map cards.

## API Learning Path

Teach APIs with VS Code REST Client and `.http` files, using the sibling backend's
`api/user_auth.http`, `api/user_crud.http`, and shared environment `baseUrl`.
The source examples are `api/user.py` with `model/user.py`, `hacks/joke.py` with
file-backed `hacks/jokes.py`, and `api/microblog_api.py` with `model/microblog.py`.
Read-only requests come first; credential prompts, cookie reuse, authorized test
data, and mutation side effects are discussed in the API lessons.

The central API page is the document with permalink `/python/flask/api`.
Its three infographic entries come from
`_data/python_flask_api.yml`. Keep only these dedicated API lessons:

- `/python/flask/api/jokes` - Easy API, handlers and file-backed jokes data.
- `/flask/api/users` - authentication, user operations, and model calls.
- `/python/flask/api/microblog` - filters, validation, permissions, and model calls.

After these examples, students read Flask code for further API learning.
The model scope is identifying calls, inputs, and returned values; detailed
SQLAlchemy models and SQL belong in a separate series. Other API tutorials
are deleted, not published as an archive. See `API_MATERIAL_REVIEW.md` for
useful material retained in the lessons and ideas worth revisiting elsewhere.

Non-API references (structure, setup, deployment, Jinja, ideation, and digital
citizenship) remain available. Existing course placements remain in front
matter. Retention is not certification that every historical
setup command or unrelated example is current.

## Route Collisions Resolved

The Anatomy notebook formerly duplicated `/python/flask/crash-course`. It now
uses `/python/flask/server-anatomy`; the existing authored file-structure guide
uses `/flask/anatomy`, the route used by the map. The former standalone
`hacks/api-usage/jokes_flask.md` demo was retired so only the Easy API lesson owns
`/python/flask/api/jokes`.

## Build and Check

Use the shared generated Makefile, not a project-specific override:

```sh
source venv/bin/activate
make dev
bundle exec ruby scripts/test_flask_project.rb
```

The Flask project is tagged `:dev`. The normal workflow publishes notebooks,
Markdown, and multi-course map pages before Jekyll renders the Topics index.
`distribution.json` maps the entire `docs/` directory to `_posts/projects/flask/docs/`
recursively. New, renamed, and moved documents need no manifest edits. Keep
dated post filenames and stable frontmatter permalinks; filenames determine
generated paths, while permalinks determine public URLs. Publication removes
unchanged outputs for deleted or renamed sources and refuses to remove outputs
that have been edited independently.

The shared `docs` target delegates to this directory mapping instead of writing
a second date-prefixed copy. Both targets use the same publisher and ownership
cache. Tests locate the key documents by permalink, not by their filenames.

Both outputs now live under the template's `_posts/projects/flask/` cleanup
root and are ignored as generated files. `make clean` removes the published
copies, not the sources; the next Flask build republishes them. An existing
publication cache also removes unchanged copies from the old `_posts/flask/docs/`
destination when the new mapping is first published. Public permalinks do not
change.
