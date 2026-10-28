# Lesson Feedback: UI Design

Draft for review. Nothing here is on the site yet: the project is not registered in
`_projects/.makeprojects`, and no page includes its modules.

## What the PM decided

- Students rate a lesson a student team taught, on four 1–5 ratings: Lesson Quality
  (`lesson`), Presentation/Engagement (`engage`), Popcorn Hacks (`popcorn`) and
  Homework Hacks (`homework`), plus one Pros box and one Grows box.
- Two steps. At the lesson: the first three ratings, Pros and Grows. At submission:
  saved ratings are shown locked, empty ones must be filled, Homework Hacks is added,
  and Pros and Grows can be edited. A student who skipped the lesson step completes
  it before the homework can be submitted.
- Feedback uses the same data source as the microblog. The microblog becomes the
  standard place to communicate, with help comments and ratings on separate panels.
- The Lesson Summary (averages and anonymous comments) comes after grading. Teachers
  also do not see individual feedback until after grading.
- Viewing restrictions are built last.

## The four views

### A. Microblog panel with panels for each kind of message

The side panel on every page with `microblog: true` gets a tab bar. Comments is
today's post list; Help is the Help group's work, aligned on one message format;
Ratings holds the lesson step (view B).

```text
┌ Microblog ─────────────────────── × ┐
│  Comments │ Help │ [Ratings]        │   ocs__tabs, ocs__tabs-btn active
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
How clear and well organized was the lesson?     p.rating-question
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
| On the teaching team | "You taught this lesson, so you can't rate it." |
| Loading saved feedback | `ocs__loading` / `ocs__spinner` in the tab panel. |
| Saving / saved / failed | The form's status line: "Saving…", "Saved your feedback.", "Couldn't save your feedback: …". |

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

### D. Lesson Summary: after grading

`createLessonSummary(summarize(records))`, shown to the teaching team once grading
is done.

```text
┌ Lesson Summary ───────────────────────────┐   ocs__card, ocs__card-header
│ From 12 students. Comments are anonymous  │   ocs__description
│ and shown in a random order.              │
│ Rating                    Average (of 5)  │   ocs__table-wrap > ocs__table
│ Lesson Quality            4.25            │
│ Presentation/Engagement   3.92            │
│ Popcorn Hacks             4.08            │
│ Homework Hacks            3.67            │
│ Pros                                      │
│  • …                                      │   comments shuffled; Pros and
│ Grows                                     │   Grows shuffled separately
│  • …                                      │
└───────────────────────────────────────────┘
```

Before release it shows only: "The Lesson Summary appears after grading, once at
least 5 students have finished their feedback. N students so far." Which event counts
as "after grading" (the assignment closing, shown as Final, or each submission being
graded) is still to be decided, as part of the viewing restrictions.

The teacher's view of individual feedback (names shown, after grading) is designed
with the viewing restrictions, last.

## Styling

No new stylesheet. The ratings reuse the paused self-assessment's `.rating-group`,
`.rating-label`, `.rating-question`, `.rating-scale`, `.rating-option` and
`.rating-scale-hint` from `_sass/open-coding/lesson-player.scss`, which the site
stylesheet already loads (`_sass/minima/custom-styles.scss` imports `open-coding/main`). Everything else is OCS grammar: `ocs__stack`, `ocs__field`,
`ocs__label`, `ocs__input`, `ocs__links`, `ocs__btn`, `ocs__card`,
`ocs__card-header`, `ocs__section-title`, `ocs__table`, `ocs__callout`,
`ocs__description`, and `ocs__tabs` for the panel.

Rating numbers sit directly in their `<label>`, not in a `<span>`: theme presets
recolor every span to the text color, which would hide the number on the selected,
accent-filled option. 1–5 buttons were chosen over sliders because a slider always
has a value, and these forms need to show a rating that has not been given yet.

## Accessibility

- Each rating is a `fieldset` with a `legend`, and its options form a
  `role="radiogroup"` of real radio inputs, so arrow keys and screen readers work.
- Pros and Grows have labels and `aria-describedby` help text.
- The status line is `role="status"`, so saves and errors are announced.
- Invalid fields carry `aria-invalid="true"`.

## Data on the microblog

Each student's feedback is one microblog post on the lesson's page:

```json
{
  "content": "Lesson feedback",
  "topicPath": "/csp/lessons/loops/",
  "data": {
    "kind": "lesson-feedback",
    "version": 1,
    "ratings": { "lesson": 4, "engage": 5, "popcorn": 3, "homework": null },
    "pros": "Clear examples",
    "grows": "Slow down on the hacks"
  }
}
```

`content` is required by Flask and limited to 280 characters, so it holds a fixed
label, never student text. `toMicroblogPost` and `fromMicroblogPost` in the model
build and read this shape; `fromMicroblogPost` drops anything out of range, so a
hand-edited post cannot inject a bad rating into a summary.

This shape is unverified against the Flask code, which is not in this repository.
Before anything is saved, Flask needs to:

1. accept a JSON object in `data`, and allow text this long there;
2. apply the same rules as the model on the server: saved ratings locked, one post
   per student per lesson, the teaching team unable to rate its own lesson. Today
   any author can edit their own post freely;
3. keep these posts out of the page feed. Today every post on a page is shown with
   its author, which would break anonymity;
4. let the submission step read the saved feedback. Submissions are in Spring.

The panel also inserts post text as raw HTML (`_includes/microblog_foundation.html`,
`<div>${value}</div>`). That must be fixed before feedback or Help appears in any tab.

## Open questions

1. Is the draft wording above (questions, scale words, help text) right?
2. What is the standard message format shared with the Help group?
3. Which event counts as "after grading" for releasing the summary?
4. Is the minimum of 5 responses for the summary right?
