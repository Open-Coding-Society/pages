# Profile

Profile is the student's settings page at `/profile`: who they are, their account
details, classes, persona, skill check-in, Face ID and GitHub Gist connection. It
is built only from the OCS grammar (`_sass/open-coding/elements/`, documented in
`_sass/open-coding/README.md`) and has no page stylesheet.

See [Profile architecture](docs/ARCHITECTURE.md) for how the page fits together,
the backend endpoints each part calls, and how it's tested.

## Flask only or Flask + Spring

The OCS kit runs with Flask only or with Flask and Spring, depending on the features
a site needs. `spring` in `_config.yml` says which:

- `spring: false` is OCS for Business: Flask only, with single login.
- `spring: true` is OCS for Education: Flask and Spring, with dual login. This site
  uses it.

Each backend keeps its own account and sign-in. Single login uses Flask alone; dual
login does each step on Spring too:

| Step | Single login (Flask only) | Dual login (Flask + Spring) |
|---|---|---|
| Sign-up | Flask `POST /api/user` | then Spring `POST /api/person/create` |
| Sign-in | Flask `POST /api/authenticate` | and Spring `POST /authenticate`, at the same time (`loginBoth`) |
| Logout | Flask `DELETE /api/authenticate` | then Spring `POST /api/logout` |

In dual login, Flask's step must work. If only Spring's step fails, sign-up and sign-in
still work in Flask, and the login page warns that DMs, calendar and announcements
won't; at sign-in it also offers Continue anyway.

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

The setting covers Profile, the login page's sign-up and sign-in, logout and the
navbar's DM bell (its unread count). Other pages that use Spring, such as DMs, the
calendar and announcements, don't read it, and some links still lead to them:
Profile's Reset password and Skill Passport, and the toolkit sidebar's View Grades,
Calendar and Bathroom Pass.

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

The layout's starter script imports the shared helpers (`assets/js/api/config.js`
and `assets/js/api/profile.js`) with `{{ site.baseurl }}` and passes them to
`initProfilePage(api)`, `springEnabled` included. The Gist include does the same for
`javaURI`. The modules import each other only with `./` paths, so moving this folder
can't break them. A site that uses Profile needs a `config.js` that exports
`springEnabled`.

## Tests

- `node --test tests/profile_model.test.mjs`: the pure helpers in `js/profile-model.js`
  (the root file imports `tests/profile_model.test.mjs` from this system).
- `node --test tests/test_gist_connection.mjs`: the Gist card.
- `node --test tests/test_ai_connections.mjs`: independent AI-key saves, replacement, disconnect and failures.
- `bundle exec ruby tests/test_ai_profile_layout.rb`: AI card rendering, shared controls,
  publication paths and Flask-only omission. AI credentials are optional and do not add
  a required step to the setup checklist.
