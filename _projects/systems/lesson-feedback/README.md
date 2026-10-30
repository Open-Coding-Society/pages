# Lesson Feedback

Students rate a lesson a student team taught: Lesson Quality, Presentation/Engagement
and Popcorn Hacks at the lesson, Homework Hacks at submission, plus one Pros and one
Grows box. Ratings saved at the lesson are locked, and the homework cannot be submitted
until the feedback is complete. The teaching team sees averages and anonymous comments
after grading.

**Status: design.** This project is not registered in `_projects/.makeprojects`, so
the build does not copy it and no page uses it. Nothing on the site changes until it
is wired into the microblog panel and the submission form. See
[docs/DESIGN.md](docs/DESIGN.md) for the views, wording and open questions.

## Files

| File | What it does |
| --- | --- |
| `js/lesson-feedback-model.js` | Pure functions: the four ratings, the two steps, locking, what is missing, the summary, and the microblog post shape. The same rules as Spring's `LessonFeedbackRules`. |
| `js/lesson-feedback-form.js` | The form for one step, built from the model. Standalone with a Save button for the lesson step; embedded, with `validate()`, for the submission step. |
| `js/lesson-feedback-summary.js` | The Lesson Summary card: averages and anonymous Pros and Grows. |
| `docs/DESIGN.md` | Wireframes, states, styling, accessibility and the data stored on the microblog. |
| `tests/*.test.mjs` | Node tests for the model and for both views (with a stub document). |

The modules import each other with `./` paths only. They never fetch: the page that
uses them loads and saves the feedback, which keeps the data source in one place.
All text is set with `textContent`.

## Tests

```bash
node --test _projects/systems/lesson-feedback/tests/
```

## Next steps

1. Review the design and wording with the PM.
2. Agree one message format with the Help group for the microblog panels.
3. Confirm the Flask microblog can store and protect the feedback (see DESIGN.md).
4. Wire the lesson step into the microblog panel and the submission step into the
   assignment form, then register the project.
5. Viewing restrictions and the after-grading release, last.
