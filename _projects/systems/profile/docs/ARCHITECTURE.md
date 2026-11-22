---
layout: post
title: Profile Architecture
description: How the profile settings page is built, what each module calls, and how it's tested.
categories: [Systems]
permalink: /systems/profile/architecture/
show_reading_time: false
---

## View and data source

Profile is an `opencsplus` sidebar hub with OCS account, class, persona and
connection cards. Its sidebar and course labels come from project YAML; account,
class, persona and skill data come from Flask, with Spring adding synchronized
account fields, course groups, Face ID and optional connections when enabled.

## The page

`/profile` is `index.md`, published as `navigation/projects/profile/index.md` and
hosted directly in the shared `opencsplus` layout. The page holds:

- the markup: the top card, then the Account, Classes, Persona, Skill check-in and
  Face ID cards, then the Gist card include. Face ID and the Gist card are built only
  when the site runs Spring (`spring` in `_config.yml` isn't `false`).
- a JSON list of courses, built from each course's `course.title` in
  `_projects/systems/courses/data/<course>.yml` (published to `_data/`)
- one starter script that imports the shared helpers with the `site.baseurl` path,
  builds the profile with `createProfile(createBackends({ pythonURI, javaURI,
  fetchOptions, springEnabled }))` (see Profile classes below), and calls
  `initProfilePage({ profile })`

The shared sidebar reads `data/profile_sidebar.yml` by default, including on
toolkit pages, and appends `data/mentor_sidebar.yml` for mentor view. Both
publish under `_data/projects/profile/`. Other hubs can select their own sidebar
with `sidebar` and `sidebar_project`.

## Modules

Each module runs one part of the page. They get the profile, never a URL or
`springEnabled`, and import each other only with `./` paths. A Flask-only site gets a
`FlaskProfile`, so none of them calls Spring: Account saves to Flask only, Classes has
no course groups to keep in step, and `profile-page.js` doesn't start Face ID or watch
the Gist card, because `profile.usesSpring` is false.

| Module | Runs | Uses |
|---|---|---|
| `profile-page.js` | Starts the others; the top card and its setup checklist | `profile.usesSpring` |
| `profile-account.js` | The Account form | `loadAccount`, and `saveField` for each changed field |
| `profile-classes.js` | The course list, Add class and Remove | `classes`, `addClass`, `removeClass`, and `syncCourseGroups` on load |
| `profile-personas.js` | The persona summary and picker cards | `personas`, `chosenPersonas`, `choosePersona` |
| `profile-skills.js` | The skill check-in (four 1–6 ratings) | `saveSkillSnapshot` |
| `profile-face.js` | Face ID status and the camera scanner | `person`, `registerFace` (a `SpringProfile` only) |
| `profile-backend.js` | `FlaskProfile`, `SpringProfile` and `createProfile` | Flask and Spring, through Login's `Backend` |
| `gist-connection.js` | The Gist card, started by its include | Spring `GET`/`PUT`/`DELETE /api/gist-connection` |
| `ai-connections.js` | Optional AI grading card, started by its include | Spring `GET /api/ai-connections`, `PUT`/`DELETE /api/ai-connections/{gemini\|groq}` |
| `profile-model.js` | Pure helpers: changed fields, initials, persona sections, setup steps | none |

## Profile classes

`FlaskProfile` is the core every site has (OCS for Business). `SpringProfile extends
FlaskProfile` for sites that also run Spring (OCS for Education), the same way Login's
`SpringSession` extends `FlaskSession`. Both send their requests through Login's
`Backend` (`assets/js/login/backend.js`), which the starter makes with `createBackends`,
and `createProfile` picks `SpringProfile` only when there is a Spring backend.

| Method | `FlaskProfile` (Flask) | `SpringProfile` adds (Spring) |
|---|---|---|
| `usesSpring` | `false` | `true` |
| `loadAccount()` | `GET /api/id`; keeps the five fields the form shows; rejects when nobody is signed in | |
| `saveField(key, value)` | `PUT /api/user`; rejects with "Flask didn't accept it" | `POST /api/person/update`, sent with Flask's; "Spring didn't accept it" when only Spring refused |
| `classes()` | `GET /api/user/class` | |
| `addClass(code)`, `removeClass(code)` | `POST /api/user/class`; resolves `{ classes, groupsError: null }` | then `syncCourseGroups`; when that fails, the classes stay saved and `groupsError` is Spring's error or "Failed to update course group membership" |
| `syncCourseGroups(classes)` | no request | `PUT /api/groups/class-memberships` |
| `personas()`, `chosenPersonas()` | `GET /api/persona`, `GET /api/user/personas` (no choices when Flask refuses) | |
| `choosePersona(personaId)` | `POST /api/user/persona` | |
| `saveSkillSnapshot(snapshot)` | `POST /api/user/skill-snapshot` | |
| `person()`, `registerFace(faceData)` | | `GET /api/person/get`, `POST /api/face/register` |

A failed request rejects with the reason the page shows after "Couldn't …:", in the
words the page has always used: Flask's own message for persona and check-in saves,
Spring's error for the course groups, "the server answered" and the status for the other
requests, and the browser's own text when no answer arrived.

## What saves when

Each part saves on its own, so no single Save button covers the whole page:

- Account's Save covers only its five fields: name, User ID, email, student ID and
  high school.
- Adding or removing a course, picking a persona, saving a check-in, registering
  a face and saving a Gist token each save right away.
- Gemini and Groq keys also save independently, including from Gist and Account saves.
  Their include supplies `javaURI` to the module as `apiBase`; the module never imports
  shared configuration via a parent path. Like Gist, the card and its starter are omitted
  when `spring: false`. It uses existing OCS cards, fields, status pills and links with
  no page stylesheet. Personal keys remain optional and are not a setup-checklist requirement.

## Rules the code depends on

- The Account form records its loaded values only after `/api/id` fills the fields.
  Recording them earlier made every field look changed, so Save re-sent all of them.
- A User ID change is confirmed first and saved after the other fields, in case the
  session stops working once it changes.
- Course changes run one at a time, so Spring's course groups never get a stale list.
- Persona cards and course rows are built with `textContent`, not HTML strings.
- The page reads `site.spring` to decide which cards exist, and the starter reads
  `springEnabled` from `config.js` to pick the profile class. Both treat a missing
  setting as Spring on, so the cards on the page and the calls the profile makes always
  agree.
- `config.js` and `index.md` have `regenerate: true` in their front matter.
  Incremental builds don't notice a change to `_config.yml`, so without it they would
  keep the old `springEnabled` after `spring` changes.
- Text that must keep an accent color is in an element preset themes don't recolor,
  such as the avatar's `<abbr>` (see "Avatars" in `_sass/open-coding/README.md`).

## Testing

- `node --test tests/profile_model.test.mjs` and `node --test tests/test_gist_connection.mjs`.
- `node --test tests/profile_backend.test.mjs`: the profile classes over Login's real
  `Backend`, with a fake network.
- `node --test tests/profile_page.test.mjs`: the real modules on the Messages system's fake
  DOM, started the way the starter starts them, against fake Flask and Spring servers. It
  checks that a Flask-only page never asks Spring, that Save and the class changes reach
  Spring's copy and course groups, and the status texts and console lines.
- `node --test tests/profile_starter.test.mjs`: every name the starter imports is exported
  by the file published at that path, and the modules import only `./` files beside them.
- In a browser, run the local site with Flask (`localhost:8587`) and Spring
  (`localhost:8585`), or answer their requests with stubs. Check:
  - Save sends only the edited field.
  - Adding and removing courses re-syncs the course groups.
  - Persona picks save.
  - The scanner opens and closes.
- Build again with `spring: false` and check that the page has no Face ID or Gist
  card, the setup list has two steps, and nothing on the page calls Spring.
