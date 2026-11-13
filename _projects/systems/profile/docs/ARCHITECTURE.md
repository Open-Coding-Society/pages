---
layout: post
title: Profile Architecture
description: How the profile settings page is built, what each module calls, and how it's tested.
permalink: /systems/profile/architecture/
show_reading_time: false
---


## The page

`/profile` (`pages/profile.md`) uses `layouts/profile.html`, which sits inside the
toolkit's `aesthetihawk` layout. The layout holds:

- the markup: the top card, then the Account, Classes, Persona, Skill check-in and
  Face ID cards, then the Gist card include. Face ID and the Gist card are built only
  when the site runs Spring (`spring` in `_config.yml` isn't `false`).
- a JSON list of courses, built from each course's `course.title` in
  `_projects/systems/courses/data/<course>.yml` (published to `_data/`)
- one starter script that imports the shared helpers with the `site.baseurl` path and
  calls `initProfilePage(api)`

## Modules

Each module runs one part of the page. They receive the shared helpers as `api`
(`pythonURI`, `javaURI`, `springEnabled`, `fetchOptions`, `putUpdate`, `postUpdate`)
and import each other only with `./` paths. When `springEnabled` is false, none of
them calls Spring: Account saves to Flask only, Classes skips the course-group sync,
and `profile-page.js` doesn't start Face ID or watch the Gist card.

| Module | Runs | Endpoints |
|---|---|---|
| `profile-page.js` | Starts the others; the top card and its setup checklist | none |
| `profile-account.js` | The Account form | Flask `GET /api/id`; for each changed field, Flask `PUT /api/user` and, with Spring, Spring `POST /api/person/update` |
| `profile-classes.js` | The course list, Add class and Remove | Flask `GET`/`POST /api/user/class`; with Spring, Spring `PUT /api/groups/class-memberships` |
| `profile-personas.js` | The persona summary and picker cards | Flask `GET /api/persona`, `GET /api/user/personas`, `POST /api/user/persona` |
| `profile-skills.js` | The skill check-in (four 1–6 ratings) | Flask `POST /api/user/skill-snapshot` |
| `profile-face.js` | Face ID status and the camera scanner | Spring `GET /api/person/get`, `POST /api/face/register` |
| `gist-connection.js` | The Gist card | Spring `GET`/`PUT`/`DELETE /api/gist-connection` |
| `ai-connections.js` | Optional AI grading card | Spring `GET /api/ai-connections`, `PUT`/`DELETE /api/ai-connections/{gemini\|groq}` |
| `profile-model.js` | Pure helpers: changed fields, initials, persona sections, setup steps | none |

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
- The layout reads `site.spring` and the modules read `springEnabled` from `config.js`.
  Both treat a missing setting as Spring on, so the cards on the page and the calls
  the modules make always agree.
- `config.js` and `pages/profile.md` have `regenerate: true` in their front matter.
  Incremental builds don't notice a change to `_config.yml`, so without it they would
  keep the old `springEnabled` after `spring` changes.
- Text that must keep an accent color is in an element preset themes don't recolor,
  such as the avatar's `<abbr>` (see "Avatars" in `_sass/open-coding/README.md`).

## Testing

- `node --test tests/profile_model.test.mjs` and `node --test tests/test_gist_connection.mjs`.
- In a browser, run the local site with Flask (`localhost:8587`) and Spring
  (`localhost:8585`), or answer their requests with stubs. Check:
  - Save sends only the edited field.
  - Adding and removing courses re-syncs the course groups.
  - Persona picks save.
  - The scanner opens and closes.
- Build again with `spring: false` and check that the page has no Face ID or Gist
  card, the setup list has two steps, and nothing on the page calls Spring.
