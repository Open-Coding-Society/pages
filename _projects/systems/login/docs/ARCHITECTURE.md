---
layout: post
title: Login Architecture
description: How the sign-in, sign-up and logout pages and the navbar's signed-in state are built, and where each file is published.
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
| `js/navbar-login.js` | `assets/js/api/login.js` |
| `js/logout.js` | `assets/js/api/logout.js` |
| `js/password-rules.js` | `assets/js/api/passwordRules.js` |
| `js/password-fields.js` | `assets/js/api/passwordFields.js` |
| `js/reverify.js` | `assets/js/api/reverify.js` |

## Old checkouts

A checkout that built before Login became a system had these files tracked. Pulling
deletes them, and the next `make` publishes them again from this system before Jekyll
runs.

## Tests

`tests/distribution.test.mjs` checks that every file the site loads is published by
its old path, that every source exists, and that every published copy is git-ignored.
