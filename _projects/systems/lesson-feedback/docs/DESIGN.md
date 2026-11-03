# Lesson Feedback: UI Design

Approved by the PM from the Ratings tab mockup. Views A to C are on pages with
`assignment: true` and `team_teach: true`, which always get the microblog panel.
View A adds a Ratings tab to the panel's existing Chat | Suggestions tabs; view B is
in that tab and view C in Submit Assignment. View D, the Lesson Summary, is on the
Teacher Dashboard (`/submissions`).

## What the PM decided

- Students rate a lesson a student team taught, on four 1–5 ratings: Lesson Quality
  (`lesson`), Presentation/Engagement (`engage`), Popcorn Hacks (`popcorn`) and
  Homework Hacks (`homework`), plus one Pros box and one Grows box.
- Two steps. At the lesson: the first three ratings, Pros and Grows. At submission:
  saved ratings are shown locked, empty ones must be filled, Homework Hacks is added,
  and Pros and Grows can be edited. A student who skipped the lesson step completes
  it before the homework can be submitted.
- Feedback is required before homework. Submitting without it prompts the student to
  finish it; Spring refuses the homework too.
- Teachers, and the teaching team, rate the lesson and submit the homework like any
  other student.
- Feedback is stored in Spring, beside the submissions.
- The Lesson Summary is always available to teachers on the page where they see an
  assignment's submissions (the Teacher Dashboard): a chart of the ratings and the
  pros and grows without names. Only teachers and graders see it; there is no view of
  individual feedback with names.
- The person who creates the lesson adds `team_teach: true` and
  `assignment_creator_uids` to its front matter.
- The question wording below is approved. Pilot lesson: CSA 1.02 Variables and Data
  Types (`/csa/unit_01/1_2`).

## The four views

### A. Microblog panel with panels for each kind of message

The side panel already has Chat and Suggestions tabs (Flask microblog posts,
unchanged). Team-taught assignment pages add a Ratings tab with the lesson step
(view B, Spring, `/api/lesson-feedback`). Ratings is a panel, not a channel: it
never shows or creates posts.

```text
┌ Microblog ─────────────────────── × ┐
│  Chat │ Suggestions │ [Ratings]     │   microblog-channel-tab, is-active
│ ─────────────────────────────────── │
│  (view B)                           │   ocs__tabs-panel
└─────────────────────────────────────┘
```

The panel is older Tailwind markup today (`_includes/microblog_foundation.html`).
Converting its shell to `ocs__tabs` is a change to all 160 microblog lessons, so it
waits for review and is not part of this step.

### B. Ratings tab: the lesson step

`createLessonFeedbackForm({ step: 'lesson', saved, submitLabel: 'Save feedback', onSubmit })`

```text
Rate the lesson the team just taught. You can finish anything
you skip when you submit the homework.

Lesson Quality                                   fieldset.rating-group
How clear, accurate and well organized was the lesson?   p.rating-question
 [1] [2] [3] [4] [5]                             .rating-scale > label.rating-option
1 Poor · 2 Fair · 3 Good · 4 Very good · 5 Excellent

Presentation/Engagement   … same …
Popcorn Hacks             … same …

Pros                                             ocs__field, textarea.ocs__input
[                                    ]
What worked well in this lesson? Name a strength or two.
Grows
[                                    ]
One thing the team could do better next time.

[ Save feedback ]  Saved your feedback.          ocs__links, ocs__btn accent fill, role=status
```

Everything is optional here. A rating that was saved earlier shows as chosen and
disabled, with "Saved at the lesson. Saved ratings can't be changed."

States the page around the form must handle:

| State | What the panel shows |
|---|---|
| Not signed in | The panel's existing sign-in prompt; no form. |
| Not a team-taught lesson | No Ratings tab. |
| Assignment closed (`closed`) | "Feedback closed when this assignment was finalized." |
| Loading saved feedback | `ocs__loading` / `ocs__spinner` in the tab panel. |
| Saving / saved / failed | The form's status line: "Saving…", "Saved your feedback.", "Couldn't save your feedback: …" with Spring's message. |

`closed` comes from `loadMine()` (see "Data in Spring").

### C. Assignment submission: the submission step

`createLessonFeedbackForm({ step: 'submission', saved })` embedded in the existing
Submit Assignment card, above the submit button. It has no `<form>` or button of its
own, because forms cannot nest. The assignment form calls `validate()` first and
stops, with the message in the feedback's status line, until it passes.

```text
Submit Assignment
  Finish your feedback on this lesson. Ratings saved at the lesson
  are locked; fill the rest before you submit.

  Lesson Quality              (4) locked   "Saved at the lesson. …"
  Presentation/Engagement     [1]…[5]      required
  Popcorn Hacks               (3) locked
  Homework Hacks              [1]…[5]      required, new at this step
  Pros (required)   [Clear examples                ]
  Grows (required)  [                              ]
  Finish these before you submit: Presentation/Engagement, Grows.

  …link / file / code fields as today…
  [ Submit ]
```

Fields still missing get `aria-invalid="true"`, and the message names them by label.
A refused submit also scrolls to and focuses the first missing field
(`focusFirstInvalid()`), and the submit status shows "Finish your lesson feedback
above before you submit."

### D. Lesson Summary: on the Teacher Dashboard

`/submissions` → Teacher Dashboard → the lessons table has a **Lesson feedback**
column (teachers only): a Lesson Summary button for a team-taught lesson
(`teamTeach` from Spring), "Not team-taught" otherwise. The button opens a dialog
(`openLessonSummary`, `ocs__modal`) with `createLessonSummary(summary)`:

```text
┌ Lesson Summary · 1.02 Variables ──────────────── × ┐   ocs__modal-card
│ From 12 students who finished their feedback.      │   ocs__description
│ Comments have no names, in a random order.         │
│ ■1 Poor ■2 Fair ■3 Good ■4 Very good ■5 Excellent  │   legend
│ Lesson Quality          ░▒│▓▓▓███████       4.25   │   diverging stacked bar:
│ Presentation/Engagement ░▒▒│▓▓▓██████       3.92   │   1–2 left of the centre,
│ Popcorn Hacks            ▒▒│▓▓▓▓█████       4.08   │   3 split across it, 4–5 right
│ Homework Hacks         ░░▒▒│▓▓████          3.67   │
│ ▸ Table view                                       │   counts per rating, averages
│ Pros  • …                                          │   comments shuffled; Pros and
│ Grows • …                                          │   Grows shuffled separately
└────────────────────────────────────────────────────┘
```

It is live: it counts complete feedback as soon as the first student finishes, with
no minimum and no wait for close. Before anyone finishes it says "No student has
finished their feedback yet." Hovering or focusing a segment shows its count and
share, for example "Homework Hacks · 2 Fair: 3 students (25%)". Spring lets teachers,
admins and the assignment's assigned graders load it, never its creators, who taught
the lesson.

## Styling

`sass/main.scss`, scoped so nothing else changes. Under `#microblog-ratings-panel`
it restyles the paused self-assessment's `.rating-*` classes
(`_sass/open-coding/lesson-player.scss`) for the green panel as in the mockup: white
text, muted questions, outlined 1–5 squares that fill with the accent yellow when
chosen, a yellow locked note, translucent text boxes and a yellow Save button. The
submission step in Submit Assignment keeps the `lesson-player.scss` look.

The summary chart's colors are a diverging scale (red for 1–2, gray for 3, blue for
4–5), with separate steps for dark and light site themes. The steps passed the
dataviz palette checks (lightness band, chroma, color-blind and normal-vision
separation); some fall under 3:1 contrast, which is why every segment has a hover
label and the card has a table view. `lesson-feedback-teacher.js` picks the light
steps when `user-preferences.js` sets `--theme` to `base`. Everything else is OCS
grammar: `ocs__stack`, `ocs__field`, `ocs__label`, `ocs__input`, `ocs__links`,
`ocs__btn`, `ocs__card`, `ocs__card-header`, `ocs__section-title`, `ocs__table`,
`ocs__callout`, `ocs__description` and `ocs__modal`.

Rating numbers sit directly in their `<label>`, not in a `<span>`: theme presets
recolor every span to the text color, which would hide the number on the selected,
accent-filled option. For the same reason a count inside a chart segment is a `<b>`.
1–5 buttons were chosen over sliders because a slider always has a value, and these
forms need to show a rating that has not been given yet.

## Accessibility

- Each rating is a `fieldset` with a `legend`, and its options form a
  `role="radiogroup"` of real radio inputs, so arrow keys and screen readers work.
- Pros and Grows have labels and `aria-describedby` help text.
- The status line is `role="status"`, so saves and errors are announced.
- Invalid fields carry `aria-invalid="true"`, and a refused submit moves focus to the first one.
- Chart segments are focusable, with an `aria-label` that names the rating, value and
  count; the table view holds the same numbers, so nothing depends on color alone.

## Data in Spring

Each student's feedback is one row of Spring's `lesson_feedback` table, one per
student per assignment. The assignment ties it to the lesson: its `contentUrl` is
the lesson page (the id the page already resolves for submissions), its `teamTeach`
(from the page's `team_teach`, set by the sync bot) makes the homework wait for
feedback, and its close makes feedback final. Spring applies every rule in the model
again (locked ratings, completeness), stops saves after close, and refuses homework
with `LESSON_FEEDBACK_REQUIRED` while the submitter's feedback is incomplete. Routes
and statuses are in the Spring repository's `docs/lesson-feedback-architecture.md`.

| Call (`lesson-feedback-api.js`) | Route |
|---|---|
| `loadMine(assignmentId)` | `GET /api/lesson-feedback/{id}/mine` |
| `saveStep(assignmentId, 'lesson' or 'submission', input)` | `PUT /api/lesson-feedback/{id}/lesson` or `/submission` |
| `loadSummary(assignmentId)` | `GET /api/lesson-feedback/{id}/summary` |

The page builds the client with `javaURI` and `fetchOptions` from
`assets/js/api/config.js` and passes it in, as Profile and Messages do. The model's
`toStepRequest` sends only the step's ratings plus Pros and Grows;
`fromFeedbackView` and `fromSummaryResponse` check every value Spring returns.

### No shared format with Help

An earlier draft shared a message format with the CS Pathway Help requests
(`/api/cs-pathway/help-requests`). Spring has since removed that queue: the game's
Station Helper (`/api/cs-pathway/chat`) saves nothing, so lesson feedback has no
format to share. The microblog panel now escapes post names and text
(`escapeHtml`) before inserting them, so Ratings can sit beside Chat and Suggestions.

## Known limits

- A live summary with very few responses can let a teacher guess who wrote a comment
  (the PM chose no minimum; only teachers and graders see it).
- The microblog panel is still older Tailwind markup; converting it to `ocs__tabs`
  changes every microblog lesson, so it is separate work.
