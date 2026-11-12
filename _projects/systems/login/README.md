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

On `/login`, `/logout` and in the navbar, the setting decides whether sign-up,
sign-in and logout use Spring, and whether the navbar checks the Spring sign-in and
loads the student's theme from Spring. `/signup` and `/guestlogin` don't read it yet,
so they call Spring even with `spring: false`. Outside this system it covers Profile,
the navbar's DM bell (its unread count), the Courses calendar card, the UI Builder,
chats embedded with Messages' `conversation-embed.js`, and the site's analytics tracker
(`assets/js/ocs-analytics-tracker.js`), which `_includes/head-custom.html` leaves out
with `spring: false`.

Many pages that use Spring don't read it yet, such as `/dm`, `/student/calendar` and
the announcement chats, and some links still lead to pages that call Spring: Profile's
Reset password (`/support`) and Skill Passport (`/analytics-dashboard`), and the
toolkit sidebar's View Grades, Calendar and Bathroom Pass.

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
| `js/navbar-login.js` | `assets/js/login/navbar-login.js` | the navbar's signed-in state, `startNavbarLogin`, started by the site header |
| `js/session.js` | `assets/js/login/session.js` | `FlaskSession`, `SpringSession` and `createSession` |
| `js/backend.js` | `assets/js/login/backend.js` | `Backend`, `BackendError` and `createBackends` |
| `js/logout.js` | `assets/js/api/logout.js` | `handleLogout` |
| `js/password-rules.js` | `assets/js/api/passwordRules.js` | the password rule and checklist, also used by `/support` and the microblog |
| `js/password-fields.js` | `assets/js/api/passwordFields.js` | Show/Hide and the Caps Lock hint on password fields |
| `js/reverify.js` | `assets/js/api/reverify.js` | re-verifying a student's school email with Google |

The scripts that existed before keep their old paths in `assets/js/api/`, except the
navbar's. It used to run as soon as it loaded and now waits for the header to start
it, so it moved to `assets/js/login/` with the new modules: a new path means a
browser can't pair the new header with a cached copy of the old `login.js`.

## Sessions

Two classes in `js/session.js` handle sign-up, sign-in, logout and the signed-in user:

- `FlaskSession` is the core every site has. It does each step on Flask.
- `SpringSession extends FlaskSession` for sites that also run Spring. Sign-up and
  logout call the Flask method with `super` and then do Spring's step; sign-in signs in
  to both at the same time. Spring's result is reported, never thrown, so a Spring
  failure never undoes the Flask account or sign-in. `springSignedIn()`, which the
  navbar uses, asks Spring alone.

Both make their requests through a `Backend` from `js/backend.js`, which knows one base URL.
A starter builds them with `createSession(createBackends({ pythonURI, javaURI, fetchOptions,
springEnabled }))`: `createBackends` makes a Spring backend only when `springEnabled` is
true, and `createSession` picks `SpringSession` only when there is one. So only the
starters read `springEnabled`, and `login-page.js` and `navbar-login.js` ask
`session.usesSpring` instead. The navbar's theme sync also uses the Spring backend the
header passes it, which is `null` on a Flask-only site.

## Imports

A page's starter script imports the shared helpers (`assets/js/api/config.js`,
`login-return.js`, and for the navbar Courses' `course-entry.js` and the dashboard's
`FormatConverter`) with `{{ site.baseurl }}`, builds the session, and passes them in: the
site header to `startNavbarLogin`, `/login` to `startLoginPage`, and `/logout` to
`handleLogout(session)`. The modules never import `config.js` or use `../` paths.
They're published into two folders, `assets/js/api/` and `assets/js/login/`, so a
module may import only a file this system publishes beside it;
`tests/imports.test.mjs` checks that.

## Tests

```bash
node --test _projects/systems/login/tests/*.test.mjs
```

The one-line `tests/login_*.test.mjs` wrappers at the repo root run the same tests with
the rest of `node --test tests/*.test.mjs` (`tests/login_return.test.mjs` isn't one of
them; it tests `assets/js/api/login-return.js`). Two tests outside this folder also run Login code:
Courses' `course_entry.test.mjs` starts the navbar for its course link, and
`tests/microblog_review.test.mjs` checks the review page's guest passwords against
`js/password-rules.js`.
