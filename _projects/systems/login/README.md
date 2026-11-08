# Login

Login is how people get into the site: the sign-in page at `/login`, the sign-up pages
at `/signup` and `/guestlogin`, `/logout`, and the navbar's signed-in name and menu. It
is a system like [Profile](../profile/README.md): the sources live here, and `make`
copies them to the paths the rest of the site loads them from.

See [Login architecture](docs/ARCHITECTURE.md) for how the pages and scripts fit
together, which backend endpoints they call, and how they're tested.

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

The setting covers Profile, the login page's sign-up and sign-in, logout and the
navbar's DM bell (its unread count). Other pages that use Spring, such as DMs, the
calendar and announcements, don't read it, and some links still lead to them:
Profile's Reset password and Skill Passport, and the toolkit sidebar's View Grades,
Calendar and Bathroom Pass.

What Profile does in each is in the [Profile README](../profile/README.md#flask-only-or-flask--spring).

## Files

Edit the sources in this folder, never the published copies. The published copies are
git-ignored, and `make` (or `make dev`) writes them again from here.

| Source | Published to | What it is |
|---|---|---|
| `pages/login.md` | `navigation/authentication/login.md` | `/login`: sign-in, sign-up and Google re-verification |
| `pages/signup.md` | `navigation/signup.md` | `/signup`, a sign-up page linked from the Java toolkit menu |
| `pages/guestlogin.md` | `navigation/authentication/guestlogin.md` | `/guestlogin`, sign-in and guest sign-up |
| `pages/logout.md` | `navigation/authentication/logout.md` | `/logout` |
| `js/login-page.js` | `assets/js/login/login-page.js` | the `/login` page's script, `startLoginPage` |
| `js/navbar-login.js` | `assets/js/api/login.js` | the navbar's signed-in state, `startNavbarLogin`, started by the site header |
| `js/logout.js` | `assets/js/api/logout.js` | `handleLogout` |
| `js/password-rules.js` | `assets/js/api/passwordRules.js` | the password rule and checklist, also used by `/support` and the microblog |
| `js/password-fields.js` | `assets/js/api/passwordFields.js` | Show/Hide and the Caps Lock hint on password fields |
| `js/reverify.js` | `assets/js/api/reverify.js` | re-verifying a student's school email with Google |

The scripts keep their old published paths because pages, layouts and other systems
load them by those paths.

## Imports

A page's starter script imports the shared helpers (`assets/js/api/config.js`,
`login-return.js`, and for the navbar Courses' `course-entry.js` and the dashboard's
`FormatConverter`) with `{{ site.baseurl }}` and passes them in: the site header to
`startNavbarLogin`, `/login` to `startLoginPage`, and `/logout` to `handleLogout`. The
modules never import `config.js` or use `../` paths. They're published into two
folders, `assets/js/api/` and `assets/js/login/`, so a module may import only a file
this system publishes beside it; `tests/imports.test.mjs` checks that.

## Tests

```bash
node --test _projects/systems/login/tests/*.test.mjs
```

The `tests/login_*.test.mjs` files at the repo root run the same tests with the rest of
`node --test tests/*.test.mjs`. Courses' `course_entry.test.mjs` also runs
`courseNavigation` from `js/navbar-login.js`.
