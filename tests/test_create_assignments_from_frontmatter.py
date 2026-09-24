import json
import tempfile
import unittest
from pathlib import Path

from scripts.create_assignments_from_frontmatter import (
    AssignmentFrontmatterError,
    RequestPacer,
    canonicalize_content_url,
    create_assignment,
    deduplicate_candidates,
    deduplicate_candidates_resilient,
    determine_content_url,
    find_files,
    post_with_rate_limit_retry,
    read_course_codes,
    read_creator_uids,
    read_frontmatter,
)


class RecordingSession:
    def __init__(self):
        self.request = None

    def post(self, url, data, timeout):
        self.request = {"url": url, "data": data, "timeout": timeout}
        return object()


class RateLimitRetryTests(unittest.TestCase):
    def test_rate_limited_request_honors_retry_after_then_succeeds(self):
        class Response:
            def __init__(self, status_code, retry_after=None):
                self.status_code = status_code
                self.headers = {} if retry_after is None else {"Retry-After": retry_after}

        class Session:
            def __init__(self):
                self.responses = [Response(429, "2"), Response(200)]
                self.calls = 0

            def post(self, url, **kwargs):
                self.calls += 1
                return self.responses.pop(0)

        session = Session()
        sleeps = []

        response = post_with_rate_limit_retry(
            session,
            "https://spring.example.test/api/assignments/auto-create",
            sleeper=sleeps.append,
            data={"name": "Assignment"},
            timeout=30,
        )

        self.assertEqual(200, response.status_code)
        self.assertEqual(2, session.calls)
        self.assertEqual([2], sleeps)


class AssignmentSourceDiscoveryTests(unittest.TestCase):
    def test_generated_registered_project_outputs_are_not_scanned(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            paths = [
                root / "_projects/lessons/java/notebooks/source.ipynb",
                root / "_notebooks/projects/java/generated.ipynb",
                root / "_posts/projects/java/generated.md",
                root / "_sass/projects/java/generated.ipynb",
                root / "_notebooks/Foundation/source.ipynb",
            ]
            for path in paths:
                path.parent.mkdir(parents=True, exist_ok=True)
                path.write_text("{}", encoding="utf-8")

            found = {path.relative_to(root).as_posix() for path in find_files(root)}

        self.assertEqual(
            {
                "_projects/lessons/java/notebooks/source.ipynb",
                "_notebooks/Foundation/source.ipynb",
            },
            found,
        )


class RequestPacerTests(unittest.TestCase):
    def test_requests_are_spaced_below_the_configured_limit(self):
        sleeps = []
        pacer = RequestPacer(60, clock=lambda: 10.0, sleeper=sleeps.append)

        pacer.wait()
        pacer.wait()

        self.assertEqual([1.0], sleeps)

    def test_nonpositive_limit_is_rejected(self):
        with self.assertRaisesRegex(ValueError, "greater than zero"):
            RequestPacer(0)


class AssignmentCreatorFrontmatterTests(unittest.TestCase):
    def test_creator_uids_are_trimmed_and_deduplicated(self):
        frontmatter = {
            "assignment_creator_uids": [
                " AdityaS-2010 ",
                "second-creator",
                "AdityaS-2010",
            ]
        }

        self.assertEqual(
            ["AdityaS-2010", "second-creator"],
            read_creator_uids(frontmatter),
        )

    def test_legacy_assignment_without_creators_remains_valid(self):
        self.assertEqual([], read_creator_uids({"assignment": True}))

    def test_creator_uids_must_be_a_nonempty_list(self):
        with self.assertRaisesRegex(AssignmentFrontmatterError, "non-empty YAML list"):
            read_creator_uids({"assignment_creator_uids": "AdityaS-2010"})

    def test_creator_uids_must_contain_nonempty_strings(self):
        with self.assertRaisesRegex(AssignmentFrontmatterError, "non-empty strings"):
            read_creator_uids({"assignment_creator_uids": ["AdityaS-2010", " "]})

    def test_sync_payload_includes_creator_uids(self):
        session = RecordingSession()

        create_assignment(
            session,
            "https://spring.example.test",
            "Creator Permissions Pilot",
            "csa/creator-permissions-pilot/",
            creator_uids=["AdityaS-2010", "second-creator"],
        )

        self.assertEqual(
            ["AdityaS-2010", "second-creator"],
            session.request["data"]["creatorUids"],
        )

    def test_notebook_frontmatter_uses_the_same_creator_contract(self):
        notebook = {
            "cells": [
                {
                    "cell_type": "markdown",
                    "source": [
                        "---",
                        "assignment: true",
                        "assignment_creator_uids:",
                        "  - AdityaS-2010",
                        "---",
                    ],
                }
            ]
        }

        with tempfile.TemporaryDirectory() as directory:
            path = Path(directory) / "assignment.ipynb"
            path.write_text(json.dumps(notebook), encoding="utf-8")
            frontmatter = read_frontmatter(path)

        self.assertEqual(["AdityaS-2010"], read_creator_uids(frontmatter))

    def test_inline_multi_course_mapping_preserves_the_established_contract(self):
        frontmatter = {
            "courses": {
                "csse": {"week": 4},
                "csp": {"week": 4},
                "csa": {"week": 4},
                "csh": {"week": 4},
            }
        }

        self.assertEqual(["CSSE", "CSP", "CSA", "CSH"], read_course_codes(frontmatter))
        self.assertEqual({"week": 4}, frontmatter["courses"]["csa"])

    def test_multiline_and_quoted_course_mapping_uses_the_same_keys(self):
        with tempfile.TemporaryDirectory() as directory:
            path = Path(directory) / "assignment.md"
            path.write_text(
                "---\nassignment: true\ncourses:\n  'csa':\n    week: 4\n  csp:\n    week: 5\n---\n",
                encoding="utf-8",
            )
            frontmatter = read_frontmatter(path)

        self.assertEqual(["CSA", "CSP"], read_course_codes(frontmatter))
        self.assertEqual(4, frontmatter["courses"]["csa"]["week"])

    def test_assignment_without_courses_remains_valid(self):
        self.assertIsNone(read_course_codes({"assignment": True}))

    def test_explicit_courses_must_be_a_nonempty_mapping(self):
        for invalid in ({}, [], "csa"):
            with self.subTest(invalid=invalid):
                with self.assertRaisesRegex(AssignmentFrontmatterError, "non-empty YAML mapping"):
                    read_course_codes({"courses": invalid})

    def test_sync_payload_includes_course_codes(self):
        session = RecordingSession()

        create_assignment(
            session,
            "https://spring.example.test",
            "Ground 0",
            "sprint1/challenge",
            course_codes=["CSSE", "CSP", "CSA", "CSH"],
        )

        self.assertEqual(
            ["CSSE", "CSP", "CSA", "CSH"],
            session.request["data"]["courseCodes"],
        )

    def test_omitted_submission_type_is_not_sent_to_existing_assignments(self):
        session = RecordingSession()

        create_assignment(session, "https://spring.example.test", "Existing", "csa/existing")

        self.assertNotIn("assignmentType", session.request["data"])

    def test_explicit_submission_type_is_sent(self):
        session = RecordingSession()

        create_assignment(
            session, "https://spring.example.test", "Issue", "csa/issue",
            assignment_submission_type="github_issue",
        )

        self.assertEqual("github_issue", session.request["data"]["assignmentType"])

    def test_identical_source_and_generated_assignments_are_deduplicated(self):
        metadata = (
            "sprint1/challenge",
            "Ground 0",
            "Onboarding",
            None,
            None,
            None,
            [],
            ["CSSE", "CSP", "CSA", "CSH"],
        )
        candidates = [
            (Path("_posts/Foundation/ground-0.md"), *metadata),
            (Path("_notebooks/Foundation/ground-0.ipynb"), *metadata),
        ]

        result = deduplicate_candidates(candidates)

        self.assertEqual(1, len(result))
        self.assertEqual(Path("_notebooks/Foundation/ground-0.ipynb"), result[0][0])

    def test_conflicting_duplicate_assignment_metadata_is_rejected(self):
        candidates = [
            (Path("_posts/ground-0.md"), "sprint1/challenge", "Ground 0", "A", None, None, None, [], ["CSA"]),
            (Path("_notebooks/ground-0.ipynb"), "sprint1/challenge", "Ground 0", "A", None, None, None, [], ["CSP"]),
        ]

        with self.assertRaisesRegex(AssignmentFrontmatterError, "Conflicting assignment metadata"):
            deduplicate_candidates(candidates)

    def test_source_notebook_wins_over_stale_generated_post(self):
        candidates = [
            (Path("_posts/generated.md"), "csa/lesson", "Lesson", "A", None, None, None, [], None),
            (Path("_notebooks/lesson.ipynb"), "csa/lesson", "Lesson", "A", None, None, "link", ["creator"], ["CSA"]),
        ]

        result = deduplicate_candidates(candidates)

        self.assertEqual(1, len(result))
        self.assertEqual(Path("_notebooks/lesson.ipynb"), result[0][0])
        self.assertEqual(["creator"], result[0][7])

    def test_stale_generated_metadata_cannot_erase_source_metadata(self):
        candidates = [
            (Path("_notebooks/lesson.ipynb"), "csa/lesson", "Lesson", "A", None, None, "link", ["creator"], ["CSA"]),
            (Path("_posts/generated.md"), "csa/lesson", "Lesson", "A", None, None, None, [], None),
        ]

        result = deduplicate_candidates(candidates)

        self.assertEqual(1, len(result))
        self.assertEqual(Path("_notebooks/lesson.ipynb"), result[0][0])
        self.assertEqual(("link", ["creator"], ["CSA"]), result[0][6:9])

    def test_one_conflicting_url_does_not_block_unrelated_assignments(self):
        candidates = [
            (Path("one.md"), "csa/conflict", "One", "A", None, None, None, [], ["CSA"]),
            (Path("two.md"), "csa/conflict", "Two", "B", None, None, None, [], ["CSP"]),
            (Path("valid.md"), "csa/valid", "Valid", "C", None, None, None, ["creator"], ["CSA"]),
        ]

        resolved, errors = deduplicate_candidates_resilient(candidates)

        self.assertEqual(["csa/valid"], [candidate[1] for candidate in resolved])
        self.assertEqual(1, len(errors))
        self.assertIn("csa/conflict", errors[0])


class ContentUrlDerivationTests(unittest.TestCase):
    """The contentUrl this script sends must equal the `{{ page.url }}` the browser sends.

    Spring dedups assignments on that string, so any disagreement creates a second
    assignment row: submissions land on the browser's row and frontmatter-declared
    creators land on this script's row.
    """

    ROOT = Path("/repo")

    def content_url(self, relative_path, frontmatter=None):
        return determine_content_url(self.ROOT, self.ROOT / relative_path, frontmatter or {})

    def test_an_explicit_permalink_is_used_verbatim(self):
        self.assertEqual(
            "csa/home-page-game-feedback",
            self.content_url(
                "_posts/CSA/2026-08-14-home-page-game-feedback.md",
                {"permalink": "/csa/home-page-game-feedback"},
            ),
        )

    def test_a_trailing_slash_permalink_is_canonicalized(self):
        self.assertEqual(
            "java/spring/hacks",
            self.content_url(
                "_posts/CSA/spring_boot/2026-08-31-java-spring-hacks.md",
                {"permalink": "/java/spring/hacks/"},
            ),
        )

    def test_a_post_without_a_permalink_uses_jekylls_default_style(self):
        # /:categories/:year/:month/:day/:title.html. Verified against a real Jekyll build:
        # a post in _posts/CSH has NO category, so CSH does not appear in the URL.
        self.assertEqual(
            "2026/07/27/csh-team-formation.html",
            self.content_url("_posts/CSH/2026-07-27-csh-team-formation.md"),
        )

    def test_directories_nested_under_posts_are_not_categories(self):
        self.assertEqual(
            "2025/12/03/javascript_oop_coder.html",
            self.content_url(
                "_posts/Foundation/B-tools/2025-12-03-javascript_oop_coder.md"
            ),
        )

    def test_a_directory_above_posts_is_a_category_and_is_lowercased(self):
        self.assertEqual(
            "catabove/2026/01/02/above-post.html",
            self.content_url("CatAbove/_posts/2026-01-02-above-post.md"),
        )

    def test_frontmatter_categories_override_the_directory(self):
        self.assertEqual(
            "csa/lessons/2026/07/27/csh-team-formation.html",
            self.content_url(
                "_posts/CSH/2026-07-27-csh-team-formation.md",
                {"categories": ["csa", "lessons"]},
            ),
        )

    def test_a_space_separated_categories_string_is_accepted(self):
        self.assertEqual(
            "csa/lessons/2026/07/27/csh-team-formation.html",
            self.content_url(
                "_posts/CSH/2026-07-27-csh-team-formation.md",
                {"categories": "csa lessons"},
            ),
        )

    def test_an_ordinary_page_keeps_its_path_with_an_html_extension(self):
        self.assertEqual(
            "navigation/sample-assignment.html",
            self.content_url("navigation/sample-assignment.md"),
        )

    def test_an_index_page_resolves_to_its_directory(self):
        self.assertEqual("navigation/csa", self.content_url("navigation/csa/index.md"))

    def test_a_declared_category_is_lowercased_and_url_encoded(self):
        # Jekyll lowercases and URL-encodes, it does not slugify: underscores survive.
        self.assertEqual(
            "b-tools_and_equipment/foo%20bar/2026/04/01/slugtest.html",
            self.content_url(
                "_posts/CSH/2026-04-01-slugtest.md",
                {"categories": ["B-tools_and_equipment", "Foo Bar"]},
            ),
        )

    def test_the_script_and_the_browser_agree_on_one_key(self):
        # These are the exact page.url values a real Jekyll build emitted for these files;
        # the browser posts them verbatim from _layouts/post.html.
        for page_url, source in [
            ("/2026/07/27/csh-team-formation.html", "_posts/CSH/2026-07-27-csh-team-formation.md"),
            ("/2025/12/03/javascript_oop_coder.html",
             "_posts/Foundation/B-tools_and_equipment/2025-12-03-javascript_oop_coder.md"),
        ]:
            with self.subTest(source=source):
                self.assertEqual(
                    canonicalize_content_url(page_url), self.content_url(source)
                )

    def test_a_permalink_page_agrees_with_its_jekyll_url(self):
        # Jekyll reports page.url as the permalink itself, without the .html it writes to disk.
        self.assertEqual(
            canonicalize_content_url("/csa/home-page-game-feedback"),
            self.content_url(
                "_posts/CSA/2026-08-14-home-page-game-feedback.md",
                {"permalink": "/csa/home-page-game-feedback"},
            ),
        )

    def test_canonicalization_strips_slashes_and_keeps_the_extension(self):
        self.assertEqual("csa/lesson", canonicalize_content_url("//csa//lesson//"))
        self.assertEqual("CSH/2026/07/27/x.html", canonicalize_content_url("/CSH/2026/07/27/x.html"))
        self.assertIsNone(canonicalize_content_url("/"))
        self.assertIsNone(canonicalize_content_url(""))
        self.assertIsNone(canonicalize_content_url(None))


if __name__ == "__main__":
    unittest.main()
