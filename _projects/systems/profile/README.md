# Profile

Profile is the student's settings page at `/profile`: who they are, their account
details, classes, persona, skill check-in, Face ID and GitHub Gist connection. It
is built only from the OCS grammar (`_sass/open-coding/elements/`, documented in
`_sass/open-coding/README.md`) and has no page stylesheet.

See [Profile architecture](docs/ARCHITECTURE.md) for how the page fits together,
the backend endpoints each part calls, and how it's tested.

## Flask only or Flask + Spring

The OCS kit runs with Flask only (`spring: false`, OCS for Business, single login) or
with Flask and Spring (`spring: true`, OCS for Education, dual login). How sign-up,
sign-in and logout work in each is in the
[Login README](../login/README.md#flask-only-or-flask--spring).

What Profile does in each:

| | Flask only | Flask + Spring |
|---|---|---|
| Login | single: Flask | dual: Flask and Spring |
| Account Save | each changed field to Flask (`PUT /api/user`) | to Flask and to Spring (`POST /api/person/update`) |
| Classes | saved in Flask | saved in Flask, then Spring's course groups updated |
| Persona and Skill check-in | saved in Flask | saved in Flask |
| Face ID and GitHub Gist cards | left out | shown; both save in Spring |
| Optional AI connections (grading and AI themes) | left out | Gemini/Groq keys save independently in Spring |
| Setup list | Classes, Persona | Classes, Persona, Face ID, GitHub |

The layout leaves the Spring cards out, and its starter picks the profile class once: a
`FlaskProfile` on a Flask-only site, or a `SpringProfile`, which extends it, on a site
with Spring. The modules ask the profile, never `springEnabled` (see
[Profile classes](docs/ARCHITECTURE.md#profile-classes)).

### Try it

- Flask + Spring: keep `spring: true` and run `make`. Run Flask on `localhost:8587` and
  Spring on `localhost:8585`, sign in, and open `/profile`.
- Flask only: set `spring: false` and run `make`. Run Flask on `localhost:8587`, sign
  in, and open `/profile`. There's no Face ID or Gist card, and Save sends each field to
  Flask only.
- Open `/systems/profile/architecture/` for the architecture document.

## Files

| Source | Published to | What it is |
|---|---|---|
| `pages/profile.md` | `navigation/authentication/profile.md` | the `/profile` page |
| `pages/profile-v2.md` | `navigation/authentication/profile-v2.md` | sends `/profile/v2` to `/profile` |
| `layouts/profile.html` | `_layouts/profile.html` | the page's markup and starter script |
| `_includes/profile-gist-connection.html` | `_includes/` | the GitHub Gist card |
| `_includes/profile-ai-connections.html` | `_includes/` | optional Gemini/Groq connection card using shared OCS controls |
| `js/` | `assets/js/profile/` | the page's modules |
| `sass/profile-gist-connection.scss` | `_sass/open-coding/` | the Gist card's styles |

`make` publishes these (see `_projects/REGISTRATION.md`), and git ignores the
published copies. Edit the sources here.

## Imports

The layout's starter script imports `assets/js/api/config.js` and Login's
`assets/js/login/backend.js` with `{{ site.baseurl }}`, builds the profile with
`createProfile(createBackends({ pythonURI, javaURI, fetchOptions, springEnabled }))`,
and passes it to `initProfilePage({ profile })`. The Gist include imports `javaURI` the
same way. The AI connections include passes both `javaURI` and shared `fetchOptions`
from that configuration; requests override only the method, cache (`no-store`) and
save body. The modules import each other only with `./` paths, so moving this folder
can't break them. A site that uses Profile needs the Login system and a `config.js`
that exports `springEnabled`.

## Tests

The `tests/profile_*.test.mjs` files in the repo's root `tests/` folder each import a
test from this system's `tests/` folder.

- `node --test tests/profile_model.test.mjs`: the pure helpers in `js/profile-model.js`.
- `node --test tests/profile_backend.test.mjs`: `FlaskProfile` and `SpringProfile` over
  Login's real `Backend` with a fake network: what each method sends, that a
  `FlaskProfile` never calls Spring, and the failure texts.
- `node --test tests/profile_page.test.mjs`: the whole page on the Messages system's fake
  DOM, with fake Flask and Spring servers. A Flask-only page sends nothing to Spring,
  from loading to every save, and every status text is the one the page always showed.
- `node --test tests/profile_starter.test.mjs`: each name the layout's starter imports is
  exported by the file published at that path, and the modules import only `./` files.
- `node --test tests/test_gist_connection.mjs`: the Gist card.
- `node --test tests/test_ai_connections.mjs`: independent AI-key saves, replacement, disconnect and failures.
- `bundle exec ruby tests/test_ai_profile_layout.rb`: AI card rendering, shared controls,
  publication paths and Flask-only omission. AI credentials are optional and do not add
  a required step to the setup checklist.
