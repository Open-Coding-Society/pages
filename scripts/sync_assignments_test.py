#!/usr/bin/env python3
"""
Feed sample frontmatter through sync_assignments.py and check what it would send.

    python3 scripts/sync_assignments_test.py

To test a new case, add a row to CASES: a description, a file path, the frontmatter
(without `assignment: true`, which is added for you), and the fields you expect.
"""
import tempfile
from pathlib import Path

from sync_assignments import (
    DEFAULT_COURSE_CODES,
    DEFAULT_CREATOR_UIDS,
    DEFAULT_POINTS,
    AssignmentCatalog,
    SyncReport,
)

CASES = [
    (
        "good page keeps its values",
        "navigation/lesson.md",
        "title: Lesson\npoints: 5\nassignment_creator_uids: [alice, bob]\ncourses:\n  csa: {week: 1}",
        {"name": "Lesson", "points": 5.0, "creator_uids": ("alice", "bob"), "course_codes": ("CSA",)},
    ),
    (
        "missing fields get defaults",
        "navigation/empty.md",
        "",
        {"name": "empty", "description": "", "points": DEFAULT_POINTS, "due_date": None,
         "creator_uids": DEFAULT_CREATOR_UIDS, "course_codes": DEFAULT_COURSE_CODES},
    ),
    (
        "points that are not a number",
        "navigation/bad-points.md",
        "points: ten",
        {"points": DEFAULT_POINTS},
    ),
    (
        "creators written as text instead of a list",
        "navigation/bad-creators.md",
        "assignment_creator_uids: alice",
        {"creator_uids": DEFAULT_CREATOR_UIDS},
    ),
    (
        "courses written as a list instead of a mapping",
        "navigation/bad-courses.md",
        "courses: [csa, csp]",
        {"course_codes": DEFAULT_COURSE_CODES},
    ),
    (
        "title that is a list",
        "navigation/bad-title.md",
        "title: [one, two]",
        {"name": "bad-title"},
    ),
    (
        "post URL follows Jekyll's date style",
        "_posts/CSA/2026-01-02-my-post.md",
        "title: Post",
        {"content_url": "2026/01/02/my-post.html"},
    ),
    (
        "permalink wins and slashes are trimmed",
        "navigation/anything.md",
        "permalink: /csa/lesson/",
        {"content_url": "csa/lesson"},
    ),
    (
        "team-taught page",
        "navigation/team.md",
        "team_teach: true",
        {"team_teach": True},
    ),
    (
        "team_teach written as text is not set",
        "navigation/bad-team.md",
        "team_teach: yes please",
        {"team_teach": None},
    ),
]


def run_case(path, frontmatter):
    with tempfile.TemporaryDirectory() as directory:
        root = Path(directory)
        page = root / path
        page.parent.mkdir(parents=True, exist_ok=True)
        page.write_text(f"---\nassignment: true\n{frontmatter}\n---\n", encoding="utf-8")
        assignments = list(AssignmentCatalog(SyncReport()).scan(root))
    return assignments[0] if assignments else None


failures = 0
for description, path, frontmatter, expected in CASES:
    assignment = run_case(path, frontmatter)
    wrong = {
        field: getattr(assignment, field, None)
        for field, value in expected.items()
        if getattr(assignment, field, None) != value
    }
    if assignment is not None and not wrong:
        print(f"PASS  {description}")
        continue
    failures += 1
    print(f"FAIL  {description}")
    for field, actual in wrong.items():
        print(f"        {field}: expected {expected[field]!r}, got {actual!r}")

# teamTeach is always sent, so dropping the flag from a page also clears it in Spring.
for frontmatter, expected in (("team_teach: true", "true"), ("", "false")):
    sent = run_case("navigation/payload.md", frontmatter).with_defaults().to_payload()["teamTeach"]
    if sent == expected:
        print(f"PASS  payload teamTeach={expected}")
    else:
        failures += 1
        print(f"FAIL  payload teamTeach: expected {expected!r}, got {sent!r}")

print(f"\n{len(CASES) + 2 - failures} passed, {failures} failed")
raise SystemExit(1 if failures else 0)
