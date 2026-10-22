# Profile

Profile is the student's settings page at `/profile`: who they are, their account
details, classes, persona, skill check-in, Face ID and GitHub Gist connection. It
is built only from the OCS grammar (`_sass/open-coding/elements/`, documented in
`_sass/open-coding/README.md`) and has no page stylesheet.

See [Profile architecture](docs/ARCHITECTURE.md) for how the page fits together,
the backend endpoints each part calls, and how it's tested.

## Files

| Source | Published to | What it is |
|---|---|---|
| `pages/profile.md` | `navigation/authentication/profile.md` | the `/profile` page |
| `pages/profile-v2.md` | `navigation/authentication/profile-v2.md` | sends `/profile/v2` to `/profile` |
| `layouts/profile.html` | `_layouts/profile.html` | the page's markup and starter script |
| `_includes/profile-gist-connection.html` | `_includes/` | the GitHub Gist card |
| `js/` | `assets/js/profile/` | the page's modules |
| `sass/profile-gist-connection.scss` | `_sass/open-coding/` | the Gist card's styles |

`make` publishes these (see `_projects/REGISTRATION.md`), and git ignores the
published copies. Edit the sources here.

## Imports

The layout's starter script imports the shared helpers (`assets/js/api/config.js`
and `assets/js/api/profile.js`) with `{{ site.baseurl }}` and passes them to
`initProfilePage(api)`. The Gist include does the same for `javaURI`. The modules
import each other only with `./` paths, so moving this folder can't break them.

## Tests

- `node --test tests/profile_model.test.mjs`: the pure helpers in `js/profile-model.js`
  (the root file imports `tests/profile_model.test.mjs` from this system).
- `node --test tests/test_gist_connection.mjs`: the Gist card.
