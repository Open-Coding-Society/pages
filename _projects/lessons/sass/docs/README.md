# SASS Grammar Lesson

This project contains the living SASS grammar lessons for the Open Coding Society.

## Source layout

- `index.md` is the SASS reference catalog and project hub.
- `navigation/` contains the button, grid, and container lesson pages plus their shared navigation include.
- `_sass/open-coding/README.md` remains the reusable grammar reference.

## Build

```bash
make -C _projects/lessons/sass build
```

The project Makefile publishes the lesson pages under `/navigation/sass/` and copies the navigation include into `_includes/projects/sass/`.

## Lesson metadata

Language lessons should preserve their teaching metadata and add the discovery fields used by the lesson browser:

```yaml
courses: { csse: {week: 5} }
categories: [CSSE, JavaScript, Arrays]
lesson_language: JavaScript
lesson_topic: Arrays
lesson_part: interactive
lesson_type: lesson
```

Use `lesson_part: reference` for explanatory material without a runnable activity. Keep `lesson_part: interactive` for Code Runner, SASS, Canvas, or other runnable examples. The `courses` and `week` fields describe when material was taught; the lesson fields describe how it should be found afterward.
