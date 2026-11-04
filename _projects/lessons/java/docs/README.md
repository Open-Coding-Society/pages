# Java Lessons

This project contains the Java-first lesson collection for Open Coding Society learners.

## Source layout

- `index.md` is the Java reference page and project hub.
- `notebooks/` contains the Java lesson notebooks in one flat directory for easy student editing.
- Selected notebooks use `courses.csa.week` to complement the shared outline in
  `_data/csa.yml`. Weeks 13-37 have at most three primary topic documents across
  Java and the CS112/CS113/CSA collections, not three per project.
- Unselected notebooks and separate homework variants remain browsable
  references without week assignments. Review checklists link earlier lessons
  instead of assigning new work during AP weeks.
- Java source ownership stays here; a week assignment does not claim college
  articulation. The curated selection is checked by
  `node --test tests/csa_curriculum.test.mjs`.

## Build

```bash
make -C _projects/lessons/java build
```
