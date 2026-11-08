---
layout: post
title: Login Architecture
description: How the sign-in, sign-up and logout pages and the navbar's signed-in state are built, what each part calls, and how it's tested.
permalink: /systems/login/architecture/
show_reading_time: false
---

## The system

Login's sources live in `_projects/systems/login/`. It is registered as
`systems/login:dev` in `_projects/.makeprojects`, so `make` and `make dev` both build
it. `distribution.json` maps each source to the path the site loads it from, and
`scripts/publish_project.rb` copies them there. The copies are git-ignored.

| Source | Published to |
|---|---|
| `pages/login.md` | `navigation/authentication/login.md` (`/login`) |
| `pages/signup.md` | `navigation/signup.md` (`/signup`) |
| `pages/guestlogin.md` | `navigation/authentication/guestlogin.md` (`/guestlogin`) |
| `pages/logout.md` | `navigation/authentication/logout.md` (`/logout`) |
| `js/login-page.js` | `assets/js/login/login-page.js` |
| `js/navbar-login.js` | `assets/js/api/login.js` |
| `js/session.js` | `assets/js/login/session.js` |
| `js/backend.js` | `assets/js/login/backend.js` |
| `js/logout.js` | `assets/js/api/logout.js` |
| `js/password-rules.js` | `assets/js/api/passwordRules.js` |
| `js/password-fields.js` | `assets/js/api/passwordFields.js` |
| `js/reverify.js` | `assets/js/api/reverify.js` |

## Starters

Published scripts aren't rendered by Liquid, so every page that uses a module has a
short starter script. The starter imports the shared helpers with the `site.baseurl` path
and passes them to the module's start function.

| Where | Starter imports | Calls |
|---|---|---|
| `/login` (`pages/login.md`) | `config.js`, `login-return.js`, `reverify.js`, `passwordRules.js`, `backend.js`, `session.js`, `login-page.js` | `startLoginPage({ session, ..., baseurl })` |
| every page, from the site header (`_includes/themes/minima/header.html`) | `config.js`, `login-return.js`, `course-entry.js`, the dashboard's `preferences.js`, `backend.js`, `session.js`, `login.js` | `startNavbarLogin({ session, spring, ..., courseEntry })` |
| `/logout` (`pages/logout.md`) and the aesthetihawk layout | `config.js`, `backend.js`, `session.js`, `logout.js` | `handleLogout(session)` |

Each starter builds the session with `createSession(createBackends({ pythonURI, javaURI,
fetchOptions, springEnabled }))`. That gives a `FlaskSession` on a Flask-only site and a
`SpringSession` on a site with Spring.

`/login` keeps its markup, which calls four functions by name (`loginBoth`,
`showSignupForm`, `handleSignupSubmit`, and Google's `handleGoogleSignIn` callback), so
`startLoginPage` still puts them on `window`.

## Sessions

`FlaskSession` is the core; `SpringSession extends FlaskSession` and runs Spring's step
after `super`. Every request goes through a `Backend`, which resolves to JSON, `null` or
text and rejects with a `BackendError` that has the HTTP status (0 when the server can't
be reached) and the parsed answer.

| Method | `FlaskSession` | `SpringSession` adds |
|---|---|---|
| `signUp(account)` | `POST /api/user`; rejects with Flask's message, or "Flask signup failed (status)" | then `POST /api/person/create`, except for a guest. `spring` in the result is a promise of `{ created, error }` that never rejects, so the page shows Flask's result first |
| `signIn(uid, password)` | `POST /api/authenticate`; resolves Flask's answer, which says whether the student must re-verify | `POST /authenticate`, then `GET /api/person/get`, at the same time as Flask; `spring` is `false` when only Spring refused |
| `signOut()` | `DELETE /api/authenticate` | then `POST /api/logout` |
| `currentUser()` | `GET /api/id`; `null` when nobody is signed in | |
| `springSignedIn()` | | `GET /api/person/get`; `false` when Spring refuses, rejects when it can't be reached |
| `createsSpringAccount(account)` | always `false` | `true` except for a guest |

## What each part calls

`springEnabled` comes from `config.js`, which reads `spring` in `_config.yml`. With
`spring: false` none of the Spring calls in this table are made.

| Part | Flask | Spring (only with `spring: true`) |
|---|---|---|
| Sign-in (`/login`) | `POST /api/authenticate` | `POST /authenticate`, then `GET /api/person/get`, at the same time as Flask |
| Sign-up (`/login`) | `POST /api/user` | then `POST /api/person/create`, best effort |
| School email re-verification (`/login`) | `POST /api/user/reverify` | |
| Guest option (`/login`) | `GET /api/guest/window` | |
| Navbar | `GET /api/id`, then `GET /api/user/class` | `GET /api/person/get` (the sign-in warning) and `GET /api/user/preferences` (the student's theme) |
| Logout | `DELETE /api/authenticate` | then `POST /api/logout` |

`/signup` and `/guestlogin` still keep their scripts inline, and they don't read
`springEnabled` yet, so they call Spring even on a Flask-only site. `/signup` creates
the account in Flask (`POST /api/user`), then Spring (`POST /api/person/create`), and
`/guestlogin` creates a guest (`POST /api/user/guest`) and signs in to both backends.

## Changing `spring`

The modules read `springEnabled` when they run, never Liquid. `config.js` has
`regenerate: true` in its front matter, so an incremental build picks up a change to
`spring` in `_config.yml`.

## Old checkouts

A checkout that built before Login became a system had these files tracked. Pulling
deletes them, and the next `make` publishes them again from this system before Jekyll
runs. Switching back to an older commit restores the tracked files over the ignored
copies.

## Tests

- `tests/distribution.test.mjs`: every file the site loads is published by its old path,
  every source exists, and every published copy is git-ignored.
- `tests/login_page.test.mjs`: `/login` has one starter that calls `startLoginPage`, and
  `login-page.js` has no Liquid, never reads `springEnabled`, and signs up, in and out
  only through the session.
- `tests/imports.test.mjs`: every import is a `./` path to a file published beside the
  importer, importing the navbar script starts nothing, logout signs out through the
  session, and the navbar never reads `springEnabled`.
- `tests/backend.test.mjs`: requests, answers and `BackendError`.
- `tests/session.test.mjs`: `FlaskSession` never calls Spring; `SpringSession` keeps the
  Flask account and sign-in when Spring fails, and gives a guest no Spring account.
- Courses' `course_entry.test.mjs` runs `courseNavigation` for the navbar's course link.
