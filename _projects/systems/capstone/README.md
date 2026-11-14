# Capstone

Capstone is the student-project directory at `/capstone/`. Its implementation,
card rendering, filtering, styles, and build-time discovery live in this
registered system project, following the source/distribution boundary used by
Topics.

## Project metadata

The project post owns the listing metadata in its front matter:

```yaml
capstone_project:
  course: CSP
  school_year: 2026-2027
  image: /images/capstone/example.png
  team: [Student One, Student Two]
  links:
    frontend: https://github.com/example/frontend
    backend: https://github.com/example/backend
```

`course` is required and must be `CSA`, `CSP`, `CSH`, or `CSSE`.
`school_year`, `image`, `team`, and `links` are optional. `title` and
`description` default to the document's ordinary front matter; `capstone_project`
may override them. The generator validates metadata and produces the catalog
from published posts/pages that explicitly declare `capstone_project`.
Supporting posts are not listed unless they opt in. Link values may use HTTP or
HTTPS; use HTTPS where the project supports it.
Hidden, draft, and search-excluded documents are not listed.

The listing filters by course and school year and searches title, description,
and team text. `?course=CSSE` continues to select the complete CSSE game
catalog. Game-directory posts remain authored by their game project and are
added through the shared `capstone-games.html` include.

Create/Edit buttons were removed because creating a project only stored a
session-scoped draft and editing had no save operation. Published entries are
now edited in the source post and deployed with the site.

## Project page content

Flat project posts and the former `websites/` posts are organized under
`_posts/capstone/<school_year>/` (currently `2025-2026/` and `2026-2027/`).
Use `capstone_project.school_year` for catalog entries; supporting posts use
top-level `school_year` without opting into the catalog. For posts without a
declared year, assign it from the post date with August starting the school
year. Preserve filenames and explicit permalinks when moving posts.
The `Intelligence/`, `OCS-in-a-Kit/`, `Presence/`, and `Jarvis3000/` project
directories remain independent and are not reorganized by year. The shared
authoring README stays at the Capstone root. Year grouping does not change
page style or YAML data ownership.

Keep project-specific HTML and Liquid in the owning Markdown post under
`_posts/capstone/`, not in a one-page include. Existing YAML data remains under
`_data/`. Keep includes for genuinely shared components, such as project
navigation, footers, repeated board cards, and the OCS Kanban board.

Scope Markdown-lint suppression to embedded HTML with
`<!-- markdownlint-capture -->`, `<!-- markdownlint-disable -->`, and
`<!-- markdownlint-restore -->`. Restoring the captured rules preserves any
surrounding lint settings. These comments do not disable Liquid processing or
hide Jekyll errors; do not wrap working Liquid in a `raw` block.

## Resources

| Source | Published destination |
| --- | --- |
| `pages/capstone.md` | `navigation/capstone.md` |
| `_includes/capstone-browser.html` | `_includes/projects/capstone/capstone-browser.html` |
| `plugins/capstone.rb` | `_plugins/capstone.rb` |
| `js/` | `assets/js/capstone-directory/` |
| `sass/main.scss` | `_sass/projects/capstone/main.scss` |

Generated root copies are not authoring sources. The system is registered as
`systems/capstone:dev` and uses the shared distribution manifest and generated
Makefile.

## Validation

```sh
bundle exec ruby scripts/test_capstone.rb
bundle exec ruby scripts/test_capstone_posts.rb
node --test tests/capstone.test.mjs tests/capstone_title_hover.test.mjs
```
