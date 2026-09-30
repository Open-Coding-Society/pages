# Python Lessons

This project contains the Python-first lesson collection for Open Coding Society learners.

The notebooks may include JavaScript comparison examples. They are still classified as Python lessons because Python is the learning path students are polishing.

## Source layout

- `notebooks/` contains the Python lesson notebooks in one flat directory for easy student editing.
- `index.md` is the Python reference page and project hub.
- `Makefile` copies the notebooks into the repository notebook pipeline and converts them.
- Existing CSP course and week metadata is preserved.

## Build

```bash
make -C _projects/lessons/python build
```
