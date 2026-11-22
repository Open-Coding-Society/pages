# Grades

Grades holds every page where students see, predict and reflect on their grades
and where work is submitted and graded. It has its own top-nav link (**Grades**,
beside Topics) and its own sidebar, so it is separate from Profile.

See [Grades architecture](docs/ARCHITECTURE.md) for how the pages, section links and
sidebar fit together and which shared files other systems load.

## Pages

| Page | Address | Sidebar item |
|---|---|---|
| Grades hub: links to every page and section below | `/grades/` | Grades |
| View Grades | `/student/view-grades` | View Grades |
| Analytics Dashboard: OCS Analytics, GitHub Analytics, Grade Predictor, Skill Passport | `/analytics-dashboard` | Analytics Dashboard |
| Retrospective: Sprint Reflection, Growth Over Time, Forecast Retrospective | `/retrospective` | Retrospective |
| Submissions: My Submissions, Assignments You Created / Teacher Dashboard, All Submissions | `/submissions` | Submissions |

## Sidebars

Every page above sets `sidebar: grades_sidebar` and `sidebar_project: grades`, so it shows the Grades sidebar
(`data/grades_sidebar.yml`). Profile, Dashboard/Preferences and the toolkit pages
keep the Profile sidebar (`_data/aesthetihawk_sidebar.yml`), which no longer lists
grading pages. The shared include `_includes/aesthetihawk/sidebar.html` picks the
file named by the page's `sidebar:` and falls back to the Profile sidebar. Each
item's `id` matches the `active_tab` of the page it highlights.

Analytics Dashboard, Retrospective and Submissions have no tab bar. The sidebar
lists each one's sections under it, indented as an `ocs__tree` (`children` in
`data/grades_sidebar.yml`), and each links to `page#section`. The page shows the
section the hash names and marks its link using the shared
`assets/js/pages/viewer/section-navigation.js`. All Submissions
is marked for teachers; anyone else who opens it stays on My Submissions.

## Phones

At 768px and below the side column is hidden, and the same links fold into a
**Menu** at the top of the page (`_layouts/opencsplus.html`), so the Profile pages
get it too.

## Files

| Source | Published to | What it is |
|---|---|---|
| `index.md` | `navigation/projects/grades/index.md` | the `/grades/` hub |
| `data/` | `_data/projects/grades/` | hub links and sidebar, accessed as `site.data.projects.grades` |
| `pages/` | `navigation/projects/grades/` | all Grades pages, with unchanged permalinks |
| `_includes/` | `_includes/projects/grades/` | the Teacher Dashboard section |
| `js/` | `assets/js/projects/grades/` | analytics, grading and shared-section modules |
| `sass/` | `_sass/projects/grades/` | page styles, imported in `_sass/open-coding/_main.scss` |
| `compatibility/` | `assets/js/` | re-exports for cached pages using old module URLs |

`distribution.json` opts into standard directory publication and maps only the
hub and compatibility URLs as exceptions (see `_projects/REGISTRATION.md`).
The publisher removes obsolete cached outputs and handles new or deleted files.
Git ignores the published copies: edit the sources here.

## Styles

The pages reuse OCS cards, tables, controls, status and loading elements.
Submissions uses the shared stack, modal and spinner; its dialog and spinner
rules keep the page-specific dimensions, backdrop and loading adjustments. Grades styles also
use the shared `surface` and `kicker` mixins for page-specific panels and labels.
Analytics retains its responsive chart layout and modal sizing.

## Tests

- `bundle exec ruby scripts/test_grades_hub.rb`: every hub link and every section
  the sidebar lists opens a page that exists and a `data-section` that page has, and
  the top nav lists the hub.
- `node --test _projects/systems/grades/tests/page_sections.test.mjs`: which section
  a hash opens, and which sidebar link is marked.
- `node --test tests/test_submission_grading.mjs tests/test_creator_dashboard.mjs`:
  the grading calls and the creator dashboard.
- `node --test tests/v2_pages.test.mjs`: the main pages, remaining `/v2` redirects,
  and that the Grades and remaining `-v2` stylesheets are imported.
- `bundle exec ruby scripts/test_system_project_distribution.rb`: publication and
  migration of the Grades pages, including their original routes and removal of old posts.

The Grades hub, submission grading and creator dashboard root tests load the tests
in `tests/` here, so they run before a build.
