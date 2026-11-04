# Review of Retired API Material

The published API curriculum is now the hub at `/python/flask/api` and three
lessons: Jokes, Users, and Microblog. Course placements live in front matter. This review
is a maintainer document, not an additional published API lesson.

## Useful Material Retained

| Retired Material | Useful Content | Where It Went |
| --- | --- | --- |
| `2026-10-15-api-contracts-testing.md` | Request contracts, environment-selected URLs, manual checks, failure boundaries, and mutation warnings | Distributed across the three lessons, with authentication and CRUD safety in Users |
| `2023-10-22-flask-debug-walk.md` | Breakpoints, following a request, comparing direct requests with the browser Network panel | Users lesson's source-reading/debugging routine |
| `2023-10-22-flocker_api.md` | Independent frontend/backend checks and agreeing on interfaces | Hub reading routine and Users contract exercise |
| `2025-08-06-flask-api.md` | Small API introduction and route-to-handler explanation | Replaced by the concrete Jokes example rather than a separate weather API |
| `hacks/api-usage/jokes_flask.md` | Frontend joke display and voting requests | Retired because it duplicated the new Jokes lesson's permalink; consider its UI ideas in a later frontend exercise |
| `2025-11-08-microblog-reference.md` and `2025-10-28-microblog_api.ipynb` | Response inspection, error handling, permission boundaries, and API/model tracing | Microblog lesson, using current registered routes and response shapes |

## Worth Revisiting Separately

| Retired Material | Potential Value | Recommended Context |
| --- | --- | --- |
| `2025-08-19-api-intro.ipynb` | Distinguishing browser APIs, library APIs, and HTTP APIs | General JavaScript/API vocabulary, not another Flask tutorial |
| `2025-08-20-api-async.ipynb` | Promises and async/await | JavaScript asynchronous programming |
| `2025-08-19-api-err-handling.ipynb` | try/throw/catch | JavaScript error handling; distinguish exceptions from HTTP error responses |
| `2025-08-20-api-handling-data.ipynb` | Response status, JSON, user input, and rendering | Frontend integration after source-reading foundations |
| `2025-08-20-api-hacks.ipynb` | Practice across errors, async calls, and data | Reassess as exercises within the relevant JavaScript lessons |
| `2024-01-25-flask-code-login-page.md` and `2024-01-25-flask-code-sign-up.md` | Full-stack forms, authentication vocabulary, and UI error feedback | A separate frontend/authentication sequence, after verifying current security behavior |
| `2025-11-08-microblog-playground.md` | Interactive microblog UI and page integration | Product/feature documentation, if it is still needed and matches the current UI |

Detailed SQLAlchemy models, relationships, schemas, joins, migrations, indexes,
and transactions should form a separate model/SQL series. Existing broad
ideation and setup references remain available, but are not additional API
assignments or a verified database curriculum.

## Material Not Carried Forward As-Is

- Older examples used fixed hosts/ports, copied credentials, or routes that did
  not match the current backend. Students now use the backend's shared REST
  Client environment, prompted login, and current source registrations.
- Older microblog frontend examples omitted authentication details or treated
  response data differently from the current `microblogs`/`count` wrapper.
  Reuse the ideas only after checking the live implementation.
- Sample authentication implementations must not replace the current user API.
  The lessons teach reading its actual decorators, validation, and model calls.
- A successful connection is not a passing test; manual REST Client requests
  are not an automated test suite.

## Retrieval

The retired files are deleted from the working curriculum, not copied into a
second published archive. Their earlier versions remain in Git history. Use
the filenames above with `git log --all -- <path>` and inspect the desired
revision before selectively reusing material in another context.
