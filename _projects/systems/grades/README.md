# Grades

Grades holds every page where students see, predict and reflect on their grades
and where work is submitted and graded. It has its own top-nav link (**Grades**,
beside Topics) and its own sidebar, so it is separate from Profile.

See [Grades architecture](docs/ARCHITECTURE.md) for how the pages, tab links and
sidebar fit together and which shared files other systems load.

## Pages

| Page | Address | Sidebar item |
|---|---|---|
| Grades hub: links to every page and tab below | `/grades/` | Grades |
| View Grades | `/student/view-grades` | View Grades |
| Analytics Dashboard, including the Grade Predictor tab | `/analytics-dashboard` | Analytics Dashboard |
| Retrospective: Sprint Reflection, Growth Over Time, Forecast Retrospective | `/retrospective` | Retrospective |
| Submissions: My Submissions, Assignments You Created / Teacher Dashboard, All Submissions | `/submissions` | Submissions |

`/student/view-grades/v2`, `/analytics-dashboard/v2` and `/submissions/v2` redirect
to their main pages.

## Sidebars

Every page above sets `sidebar: grades_sidebar`, so it shows the Grades sidebar
(`data/grades_sidebar.yml`). Profile, Dashboard/Preferences and the toolkit pages
keep the Profile sidebar (`_data/aesthetihawk_sidebar.yml`), which no longer lists
grading pages. The shared include `_includes/aesthetihawk/sidebar.html` picks the
file named by the page's `sidebar:` and falls back to the Profile sidebar. Each
item's `id` matches the `active_tab` of the page it highlights.

## Files

| Source | Published to | What it is |
|---|---|---|
| `pages/grades.html` | `navigation/grades.html` | the `/grades/` hub |
| `data/grades_hub.yml` | `_data/` | the hub's sections and links |
| `data/grades_sidebar.yml` | `_data/` | the Grades sidebar |
| `pages/view-grades.md`, `pages/view-grades-v2.md` | `_posts/student_toolkit/assignments/2025-01-21-gradeviewer*.md` | View Grades and its `/v2` redirect |
| `pages/retrospective.md` | `navigation/authentication/` | the `/retrospective` page |
| `pages/analytics-dashboard.md`, `pages/analytics-dashboard-v2.md` | `navigation/authentication/` | the `/analytics-dashboard` page and its redirect |
| `pages/submissions.md`, `pages/submissions-v2.md` | `navigation/authentication/` | the `/submissions` page and its redirect |
| `layouts/` | `_layouts/` | the Retrospective, Analytics Dashboard and Submissions layouts |
| `_includes/submissions/creator-dashboard.html` | `_includes/submissions/` | the Assignments You Created / Teacher Dashboard tab |
| `js/analytics/` | `assets/js/analytics/` | sprint and forecast retrospectives, grade calculator |
| `js/ocs-analytics-dashboard.js` | `assets/js/` | the OCS Analytics tab |
| `js/submissions/` | `assets/js/submissions/` | `grading.js` and `creator-dashboard.js` |
| `sass/` | `_sass/open-coding/` | the pages' styles, imported in `_sass/open-coding/_main.scss` |

`make` publishes these through `distribution.json` (see `_projects/REGISTRATION.md`)
to the paths they had before the move, so no address or import changes. Git ignores
the published copies: edit the sources here.

## Tests

- `bundle exec ruby scripts/test_grades_hub.rb`: every hub link opens a page that
  exists and a tab that page has, and the top nav lists the hub.
- `node --test tests/test_submission_grading.mjs tests/test_creator_dashboard.mjs`:
  the grading calls and the creator dashboard.
- `node --test tests/v2_pages.test.mjs`: the main pages, their `/v2` redirects, and
  that every `-v2` partial is imported.

The root files are one-line shims that load the tests in `tests/` here, so they run
before a build.
