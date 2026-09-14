# SASS Grammar Lesson

This project contains the living SASS grammar lessons for the Open Coding Society.

## Source layout

- `index.ipynb` is the lesson hub and is converted by the notebook pipeline.
- `navigation/` contains the button, grid, and container lesson pages plus their shared navigation include.
- `_sass/open-coding/README.md` remains the reusable grammar reference.

## Build

```bash
make -C _projects/lessons/sass build
```

The project Makefile publishes the lesson pages under `/navigation/sass/` and copies the navigation include into `_includes/projects/sass/`.
