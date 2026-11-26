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

Opening a project from the grid shows a lightweight viewer bar without replacing
its layout. Back to Capstone restores the course, year, search, and session scroll
position; previous and next follow the filtered card order, including CSSE games.
The bar stays on same-origin links below the project's URL. Other navigation and
external links are unchanged. The filtered card list is kept in session storage:
when it is unavailable (for example, in a shared link opened in another browser),
the return link retains the filters and explains how to restore previous/next.
Microblog appears in the bar only on pages that already enable it. The generator
opts catalog projects, game-directory pages, and their URL descendants into
the shared page viewer; other pages do not load its toolbar. The generic shell
and toolbar are shared with other applications, while the filtered-project
navigation remains in this project.

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
| `pages/` | `navigation/projects/capstone/` |
| `_includes/capstone-browser.html` | `_includes/projects/capstone/capstone-browser.html` |
| `plugins/` | `_plugins/projects/capstone/` |
| `js/` | `assets/js/projects/capstone/` |
| `sass/main.scss` | `_sass/projects/capstone/main.scss` |

Generated root copies are not authoring sources. The system is registered as
`systems/capstone:dev` and uses the shared distribution manifest and generated
Makefile.

Every output uses a generic ignored project root; no Capstone-specific ignore
rules are required. The landing page remains a Jekyll page at `/capstone/`,
not a blog post. Publishing removes old root-level outputs using the previous
distribution cache, which must be kept during migration.

## Team chat

A project post can show its team's group chat, where the team and its mentors
talk. It is the same group the team has in Messages (`/dm`), so the mentor gets
its alerts there too. Place the include where the chat should go, and name the
group exactly as Messages shows it:

```yaml
capstone_project:
  course: CSP
  team_group: "OCS Communication Systems"
```

```liquid
{% include projects/capstone/capstone-team-chat.html %}
```

- Without `team_group`, or on a Flask-only site (`spring: false`), the include
  renders nothing. The generator stops the build if `team_group` isn't a name.
- Place the include outside a `*-infograph` wrapper. `_sass/capstone/infograph.scss`
  styles everything inside one by the end of its class name (every `*-title` is
  2.75rem), so the chat's own parts, such as `chat-empty-title`, would grow.
- `js/team-chat-access.js` (`TeamChatAccess`) holds the rules as static
  methods, with no requests. `js/team-chat.js` (`CapstoneTeamChat`) loads the
  person and their groups once, then mounts Messages' `mountGroupChat`
  (from `assets/js/projects/messages/conversation-embed.js`, loaded only when
  the chat shows) with a link to the group in Messages, or shows a note.
- A member sees the chat. So does a mentor in the group, once the group has at
  least 2 members who aren't mentors: only then does Spring list the group among
  the mentor's own, so a mentor who doesn't see it gets a note naming both steps.
  A teacher or admin sees it whether or not they're a member. Anyone else gets a
  note saying the chat is for the team.
- Everyone looks for the group among their own groups
  (`GET /api/groups/person/{id}`) first; only a teacher or admin who isn't a
  member searches by name. So a mentor's browser never calls a route Spring
  refuses mentors.
- Spring enforces the rules (`MentorRules` in Spring's `mvc/groups`); the page
  only picks what to show. `js/team-group-api.js` (`TeamGroupApi`) makes the
  requests and keeps Spring's refusal `reason`.
- The words are in `data/team_chat.yml` (published to
  `_data/projects/capstone/`); its `embed` keys go to the chat itself.
- The tests reuse Messages' fake DOM (`../../messages/tests/fake-dom.mjs`),
  since the chat is Messages' embed.

## Validation

```sh
bundle exec ruby scripts/test_capstone.rb
bundle exec ruby scripts/test_capstone_posts.rb
bundle exec ruby scripts/test_system_project_distribution.rb
node --test tests/capstone.test.mjs tests/capstone_title_hover.test.mjs
node --test _projects/systems/capstone/tests/*.test.mjs
```
