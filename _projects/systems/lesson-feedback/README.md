# Lesson Feedback

Students rate a lesson a student team taught: Lesson Quality, Presentation/Engagement
and Popcorn Hacks at the lesson, Homework Hacks at submission, plus one Pros and one
Grows box. Ratings saved at the lesson are locked, and the homework cannot be submitted
until the feedback is complete. Everyone who submits the homework rates the lesson,
the teaching team and teachers included. Teachers see a live Lesson Summary, with a
chart and the comments without names, on the Teacher Dashboard.

**Status: piloted on CSA 1.02 Variables and Data Types.** Registered as
`systems/lesson-feedback:dev`. It shows only on a page whose front matter has both of
these; every other page is unchanged. The person who creates the lesson adds them:

```yaml
assignment: true
team_teach: true
assignment_creator_uids: [teammate1, teammate2]   # the teaching team
```

Such a page always gets the microblog panel (`_includes/themes/minima/base.html`),
with a **Ratings** tab beside Chat and Suggestions holding the lesson step, with its
own Save button. The submission step is inside Submit Assignment. Submitting the
homework saves the submission step first; if it is incomplete, the page says so and
moves focus to the first missing field. Ratings is not a channel: it never shows or
creates posts, and Chat and Suggestions are unchanged. See
[docs/DESIGN.md](docs/DESIGN.md) for the views, wording and states.

Spring applies the same rule to the homework: `scripts/sync_assignments.py` copies
`team_teach` to the assignment (`teamTeach`, which only the sync bot can set), and
Spring refuses a submission with `LESSON_FEEDBACK_REQUIRED` (409) until the person
submitting has finished their feedback. **Deploy Spring before setting `team_teach`
on a lesson**: without `/api/lesson-feedback`, the page's check blocks the homework.

The **Lesson Summary** is on `/submissions` → Teacher Dashboard: a Lesson Summary
button in the lessons table for each team-taught lesson. It is live from the first
finished response (no minimum, no wait for close). Spring lets teachers, admins and
the assignment's assigned graders read it, never the creators; the page shows the
button to teachers only.

## Files

| File | What it does |
| --- | --- |
| `js/lesson-feedback-model.js` | Pure functions: the four ratings, the two steps, locking, what is missing, the summary (averages and 1–5 counts), and the Spring request and response shapes. The same rules as Spring's `LessonFeedbackRules`. |
| `js/lesson-feedback-api.js` | The Spring client (`/api/lesson-feedback`): load your feedback, save a step, load the summary. The only module that fetches. |
| `js/lesson-feedback-form.js` | The form for one step, built from the model. Standalone with a Save button for the lesson step; embedded, with `validate()` and `focusFirstInvalid()`, for the submission step. |
| `js/lesson-feedback-page.js` | Wires a lesson page: loads your feedback, fills the mounts, saves the lesson step, and `beforeSubmit()` for the homework. |
| `js/lesson-feedback-summary.js` | The Lesson Summary card: a diverging bar chart per rating, a table view, and the Pros and Grows without names. |
| `js/lesson-feedback-teacher.js` | The Teacher Dashboard's dialog: loads one lesson's summary and draws it, in the site theme's colors. |
| `sass/main.scss` | The Ratings tab on the green microblog panel, and the summary chart's colors. |
| `navigation/lesson-feedback-ratings.html` | The microblog Ratings tab's content: the lesson-step mount (published to `_includes/projects/lesson-feedback/`). |
| `navigation/lesson-feedback-submission.html` | The submission-step mount inside Submit Assignment (published alongside). |
| `docs/DESIGN.md` | Wireframes, states, styling, accessibility, and the data in Spring. |
| `tests/*.test.mjs` | Node tests for the model, the views and dialog (with a stub document) and the client (with a stub fetch). |

Feedback is stored in Spring (`mvc/lessonfeedback`), which applies every rule again;
see its `docs/lesson-feedback-architecture.md`. The modules import each other with
`./` paths only: the page passes `javaURI`, `fetchOptions` (from
`assets/js/api/config.js`) and its own `ensureAssignmentId` to `startLessonFeedback`,
so feedback goes to the same assignment as the submission. The pages that do this
are the sources `_projects/systems/courses/_includes/course-document-player.html`
(course lessons) and `_projects/systems/blogs/layouts/post.html` (standalone posts and
their `/topics/view/` copies), with the submission mount in
`_projects/systems/blogs/_includes/lesson-submission-form.html`. The Teacher Dashboard
(`_projects/systems/grades/js/submissions/creator-dashboard.js`) gets `openLessonSummary`
from `_projects/systems/grades/layouts/submissions-v2.html`, which imports the dialog only when it is opened. All
student text is set with `textContent`.

## Tests

```bash
node --test _projects/systems/lesson-feedback/tests/
node --test tests/test_creator_dashboard.mjs
python3 scripts/sync_assignments_test.py
```

## Next steps

1. Watch the pilot lesson, then add `team_teach: true` to other team-taught lessons.
2. Convert the microblog panel's shell to `ocs__tabs` (a change to every microblog lesson).
