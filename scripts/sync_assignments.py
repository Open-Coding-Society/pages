#!/usr/bin/env python3
"""
Core Goals:
  1. Sync pages marked `assignment: true` in their frontmatter to Spring assignments.
  2. Handle bad frontmatter gracefully by issuing warnings and applying default values. It never stops the run.
  3. A problem with one page (bad data, or Spring rejecting or crashing on it) never fails the job.
     Only a failed login, where nothing can be synced, exits non-zero.
  
Usage:
    python3 scripts/sync_assignments.py                          # dry run: review only
    PAGES_BOT_PASSWORD=... python3 scripts/sync_assignments.py   # production
    python scripts/sync_assignments_test.py                     # run the test suite for sync_assignments.py
    python scripts/sync_assignments.py 2>&1 | grep WARNING       # run and filter only warnings

Reading order of this file:
  1. Assignment         one page's assignment data, cleaned and ready to send
  2. AssignmentCatalog  every assignment in the repo, one per page URL
  3. SpringClient       sends assignments to Spring
  4. main()             ties them together
  5. Supporting pieces  reporting, reading frontmatter, Jekyll URL rules

The data, as it moves through the three systems:

  page frontmatter                 Assignment (one per page)
  ----------------                 -------------------------
  ---                              Assignment(
  assignment: true                     path=Path("_projects/.../inputs.md"),
  title: SASS Inputs        ==>        content_url="sass/inputs",     # Jekyll page.url
  permalink: /sass/inputs              name="SASS Inputs",
  assignment_submission_type: code     description="",                # default
  assignment_creator_uids:             points=1.0,                    # default; an override when declared
    - psai-github                      due_date=None,                 # not declared
  ---                                  submission_type="code",
                                       creator_uids=("psai-github",),
                                       course_codes=None,             # not declared
                                   )

  AssignmentCatalog._by_url        one Assignment per URL; a notebook and its converted
  -------------------------        post share a URL and are merged into one entry
  {
      "sass/inputs":      Assignment(...),
      "sass/typography":  Assignment(...),
      ...
  }

  SpringClient.upsert(assignment)  sends Assignment.to_payload() as a form POST to
  -------------------------------  /api/assignments/auto-create; Spring matches on contentUrl
  {
      "name": "SASS Inputs",
      "contentUrl": "sass/inputs",
      "description": "",
      "points": 1.0,
      "assignmentType": "code",
      "creatorUids": ["psai-github"],
      "courseCodes": [],                # empty: not sent, Spring keeps its stored courses
  }
"""

import argparse
import json
import math
import os
import re
import sys
import time
from dataclasses import dataclass, replace
from datetime import date
from pathlib import Path
from urllib.parse import quote

import requests
import yaml

# Defaults for missing or invalid frontmatter.
DEFAULT_POINTS = 1.0
DEFAULT_DESCRIPTION = ""
DEFAULT_DUE_DATE = None
DEFAULT_SUBMISSION_TYPE = None
DEFAULT_CREATOR_UIDS = ("toby",)  # system test user; trailing comma keeps it a tuple
DEFAULT_COURSE_CODES = ()

# ================================================================ 1. Assignment

class SkipAssignment(Exception):
    """Raised when a page cannot become an assignment; the catalog skips it and moves on."""


@dataclass(frozen=True)
class Assignment:
    """Represents an assignment extracted from a page's frontmatter."""
    path: Path
    content_url: str
    name: str
    description: str = DEFAULT_DESCRIPTION
    points: float = DEFAULT_POINTS
    due_date: str | None = DEFAULT_DUE_DATE
    submission_type: str | None = DEFAULT_SUBMISSION_TYPE
    # None means "not declared"; defaults are applied only after copies are merged.
    creator_uids: tuple | None = None
    course_codes: tuple | None = None

    # Fields that must agree when the same page appears twice (notebook + converted post).
    SYNC_FIELDS = ("submission_type", "creator_uids", "course_codes")
    # Attribute -> frontmatter key for the fields the grader cannot work without.
    # Not included: courses (assignments span courses), points (an override, default 1.0)
    # and due date (set through the calendar).
    GRADING_FIELDS = {
        "creator_uids": "assignment_creator_uids",
        "submission_type": "assignment_submission_type",
    }

    @classmethod
    def from_frontmatter(cls, root: Path, path: Path, fm: dict):
        content_url = content_url_for(root, path, fm)
        if not content_url:
            raise SkipAssignment("could not determine contentUrl")
        return cls(
            path=path,
            content_url=content_url,
            name=cls._clean_text(fm.get("title") or fm.get("name"), "title", path) or path.stem,
            description=cls._clean_text(fm.get("description"), "description", path) or DEFAULT_DESCRIPTION,
            points=cls._clean_points(fm.get("points"), path),
            due_date=cls._clean_text(fm.get("dueDate") or fm.get("due_date") or fm.get("due"), "dueDate", path)
            or DEFAULT_DUE_DATE,
            submission_type=cls._clean_text(fm.get("assignment_submission_type"), "assignment_submission_type", path)
            or DEFAULT_SUBMISSION_TYPE,
            creator_uids=cls._clean_creator_uids(fm.get("assignment_creator_uids"), path),
            course_codes=cls._clean_course_codes(fm.get("courses"), path),
        )

    def merge(self, other: "Assignment") -> "Assignment":
        """Combine two copies of one page. One copy may fill in what the other omits,
        but declared values must agree. The notebook is the editable source, so its text wins."""
        preferred = other if other.path.suffix.lower() == ".ipynb" else self
        merged = {}
        for field in self.SYNC_FIELDS:
            mine, theirs = getattr(self, field), getattr(other, field)
            if mine is not None and theirs is not None and mine != theirs:
                raise SkipAssignment(
                    f"conflicting {field} for '{self.content_url}' in {self.path} and {other.path}"
                )
            merged[field] = mine if mine is not None else theirs
        return replace(preferred, **merged)

    def missing_grading_fields(self) -> list:
        return [key for attr, key in self.GRADING_FIELDS.items() if getattr(self, attr) is None]

    def with_defaults(self) -> "Assignment":
        return replace(
            self,
            creator_uids=self.creator_uids or DEFAULT_CREATOR_UIDS,
            course_codes=self.course_codes or DEFAULT_COURSE_CODES,
        )

    def to_payload(self) -> dict:
        # Form lists become repeated fields; empty lists and None are not sent at all.
        payload = {
            "name": self.name,
            "contentUrl": self.content_url,
            "description": self.description,
            "points": self.points,
            "creatorUids": list(self.creator_uids or ()),
            "courseCodes": list(self.course_codes or ()),
        }
        if self.due_date:
            payload["dueDate"] = self.due_date
        if self.submission_type:
            payload["assignmentType"] = self.submission_type
        return payload

    def describe(self) -> str:
        return (
            f"-> {self.path} -> contentUrl={self.content_url} name={self.name} "
            f"points={self.points} dueDate={self.due_date} "
            f"assignmentType={self.submission_type or 'unchanged/default'} "
            f"creatorUids={','.join(self.creator_uids or ())} "
            f"courseCodes={','.join(self.course_codes or ()) or 'none'}"
        )

    # ---- cleaning raw frontmatter values; bad input warns and returns a fallback

    @staticmethod
    def _clean_text(value, field, path):
        if value is None or isinstance(value, bool):
            return None
        if isinstance(value, (str, int, float, date)):
            return str(value).strip() or None
        warn(f"Ignoring non-text {field} {value!r}", path)
        return None

    @staticmethod
    def _clean_points(value, path):
        if value is None:
            return DEFAULT_POINTS
        try:
            if isinstance(value, bool):
                raise ValueError
            points = float(value)
            if math.isfinite(points) and points >= 0:
                return points
        except (TypeError, ValueError):
            pass
        warn(f"Invalid points {value!r}; using {DEFAULT_POINTS}", path)
        return DEFAULT_POINTS

    @staticmethod
    def _clean_creator_uids(value, path):
        if value is None:
            return None
        if not value or not isinstance(value, list) or not all(isinstance(uid, str) and uid.strip() for uid in value):
            warn(f"assignment_creator_uids must be a list of user ids, got {value!r}; using defaults", path)
            return None
        return tuple(dict.fromkeys(uid.strip() for uid in value))

    @staticmethod
    def _clean_course_codes(value, path):
        # `courses` maps course names to routing data (e.g. week); only the names matter here.
        if value is None:
            return None
        if not value or not isinstance(value, dict) or not all(isinstance(c, str) and c.strip() for c in value):
            warn(f"courses must be a mapping of course names, got {value!r}; using defaults", path)
            return None
        return tuple(dict.fromkeys(course.strip().upper() for course in value))


# ================================================================ 2. AssignmentCatalog

class AssignmentCatalog:
    """All assignments in the repo, one per contentUrl."""

    def __init__(self, report: "SyncReport"):
        self.report = report
        self._by_url = {}  # Maps content URLs to Assignment objects
        self._conflicted = set()  # Set of content URLs that have conflicts and should be ignored

    def scan(self, root: Path) -> "AssignmentCatalog":
        for path in find_pages(root):
            fm = read_frontmatter(path)
            if not fm or fm.get("assignment") is not True:
                continue
            try:
                self.add(Assignment.from_frontmatter(root, path, fm))
            except SkipAssignment as reason:
                self.report.skip(str(reason), path)
        # Checked after merging, so a field declared in either copy of a page counts.
        for assignment in self._by_url.values():
            missing = assignment.missing_grading_fields()
            if missing:
                warn(f"Missing grading frontmatter: {', '.join(missing)}; defaults will be used", assignment.path)
        return self

    def add(self, assignment: Assignment):
        url = assignment.content_url
        if url in self._conflicted:
            return
        existing = self._by_url.get(url)
        if existing is None:
            self._by_url[url] = assignment
            return
        try:
            self._by_url[url] = existing.merge(assignment)
        except SkipAssignment as reason:
            # Neither copy is trustworthy; skip the URL without blocking the others.
            del self._by_url[url]
            self._conflicted.add(url)
            self.report.skip(str(reason))

    def __iter__(self):
        return (assignment.with_defaults() for assignment in self._by_url.values())

    def __len__(self):
        return len(self._by_url)


# ================================================================ 3. SpringClient

class SpringClient:
    """Authenticated, rate-limited access to Spring's assignment API."""

    RETRY_ATTEMPTS = 3

    def __init__(self, base_url, requests_per_minute=80, session=None,
                 clock=time.monotonic, sleeper=time.sleep):
        if requests_per_minute <= 0:
            raise ValueError("requests_per_minute must be greater than zero")
        self.base_url = base_url.rstrip("/")
        self.session = session or requests.Session()
        self.interval = 60.0 / requests_per_minute
        self.clock = clock
        self.sleeper = sleeper
        self._next_request_at = None

    def login(self, uid, password):
        response = self.session.post(
            f"{self.base_url}/authenticate", json={"uid": uid, "password": password}, timeout=20
        )
        if response.status_code != 200:
            raise RuntimeError(f"Authentication failed: {response.status_code} {response.text[:200]}")
        if "jwt_java_spring" not in self.session.cookies:
            raise RuntimeError("Authentication succeeded but the jwt cookie is missing")

    def upsert(self, assignment: Assignment):
        """Spring creates the assignment, or updates the one with the same contentUrl."""
        return self._post("/api/assignments/auto-create", data=assignment.to_payload(), timeout=30)

    @staticmethod
    def is_page_rejection(status_code):
        """A 4xx about this page's data, as opposed to auth or rate-limit trouble."""
        return 400 <= status_code < 500 and status_code not in (401, 403, 429)

    def _post(self, route, **kwargs):
        response = None
        for attempt in range(self.RETRY_ATTEMPTS):
            self._wait_for_turn()
            response = self.session.post(f"{self.base_url}{route}", **kwargs)
            if response.status_code != 429 or attempt == self.RETRY_ATTEMPTS - 1:
                return response
            delay = self._retry_after_seconds(response)
            print(f"Rate limited by Spring; retrying in {delay} seconds", file=sys.stderr)
            self.sleeper(delay)
        return response

    def _wait_for_turn(self):
        # Spacing requests keeps a full-repo sync under Spring's per-client limit.
        now = self.clock()
        if self._next_request_at is not None and now < self._next_request_at:
            self.sleeper(self._next_request_at - now)
            now = self._next_request_at
        self._next_request_at = now + self.interval

    @staticmethod
    def _retry_after_seconds(response):
        try:
            return max(1, int(response.headers.get("Retry-After", "")))
        except ValueError:
            return 60


# ================================================================ 4. main

def parse_args(argv=None):
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("--root", default=".")
    parser.add_argument("--base-url", default=os.getenv("BASE_URL", "https://spring.opencodingsociety.com"))
    parser.add_argument("--uid", default=os.getenv("PAGES_BOT_UID", "pages-bot"))
    parser.add_argument("--password", default=os.getenv("PAGES_BOT_PASSWORD", ""))
    parser.add_argument("--dry-run", action="store_true", help="Review only, even when a password is set")
    parser.add_argument("--requests-per-minute", type=int,
                        default=int(os.getenv("ASSIGNMENT_SYNC_REQUESTS_PER_MINUTE", "80")))
    return parser.parse_args(argv)


def main(argv=None):
    args = parse_args(argv)
    root = Path(args.root).resolve()
    if not root.is_dir():
        print(f"Root not found: {root}", file=sys.stderr)
        return 2

    report = SyncReport()
    catalog = AssignmentCatalog(report).scan(root)
    print(f"Found {len(catalog)} assignments")

    client = None
    if args.dry_run or not args.password:
        print("DRY RUN: no password provided or --dry-run set; Spring will not be contacted.")
    else:
        client = SpringClient(args.base_url, args.requests_per_minute)
        try:
            client.login(args.uid, args.password)
        except RuntimeError as error:
            report.fatal(
                f"Login to {args.base_url} as '{args.uid}' failed. Check the account and password "
                f"(PAGES_BOT_UID / PAGES_BOT_PASSWORD secrets). Details: {error}"
            )
            return report.exit_code
        except requests.RequestException as error:
            report.fatal(f"Could not reach {args.base_url} to log in; is Spring up? Details: {error}")
            return report.exit_code
        print(f"Authenticated as {args.uid}; writing to {args.base_url}")

    for assignment in catalog:
        print(assignment.describe())
        if client is None:
            continue
        try:
            response = client.upsert(assignment)
        except requests.RequestException as error:
            report.fail(f"Could not reach Spring for '{assignment.content_url}': {error}", assignment.path)
            continue
        print(f"  {response.status_code} {response.text[:200]}")
        if response.ok:
            report.sent += 1
        elif SpringClient.is_page_rejection(response.status_code):
            report.skip(f"Spring rejected '{assignment.content_url}': {response.text[:200]}", assignment.path)
        else:
            report.fail(
                f"Spring failed on '{assignment.content_url}': {response.status_code} {response.text[:200]}",
                assignment.path,
            )

    print(report.summary(len(catalog), dry_run=client is None))
    return report.exit_code


# ================================================================ 5. Supporting pieces

# ---- reporting: page problems are annotated but never fail the job; only a failed login does

IN_GITHUB_ACTIONS = os.getenv("GITHUB_ACTIONS") == "true"


def annotate(level, message, path=None):
    """GitHub annotation syntax in CI; plain text in a local terminal."""
    if IN_GITHUB_ACTIONS:
        location = f" file={path}" if path else ""
        print(f"::{level}{location}::{message}", file=sys.stderr)
    else:
        location = f" {path}:" if path else ""
        print(f"{level.upper()}:{location} {message}", file=sys.stderr)


def warn(message, path=None):
    annotate("warning", message, path)


class SyncReport:
    def __init__(self):
        self.sent = 0
        self.skipped = 0  # bad page data: frontmatter or a Spring 4xx
        self.failed = 0  # Spring crashed or was unreachable for one page
        self.fatal_error = None  # nothing could be synced, e.g. login failed

    def skip(self, message, path=None):
        self.skipped += 1
        warn(f"Skipped: {message}", path)

    def fail(self, message, path=None):
        self.failed += 1
        annotate("error", message, path)

    def fatal(self, message):
        self.fatal_error = message
        annotate("error", message)

    def summary(self, total, dry_run=False):
        if dry_run:
            return (f"Done (dry run): {total} assignments would be sent, {self.skipped} skipped. "
                    "Spring's own rejections and failures only appear in a production run.")
        return f"Done: {total} assignments, {self.sent} sent, {self.skipped} skipped, {self.failed} failed."

    @property
    def exit_code(self):
        return 2 if self.fatal_error else 0


# ---- reading pages

PAGE_EXTENSIONS = {".md", ".markdown", ".html", ".htm", ".ipynb"}
# Registered-project build outputs; their sources under _projects are scanned instead.
GENERATED_ROOTS = {("_notebooks", "projects"), ("_posts", "projects"), ("_sass", "projects")}
FRONTMATTER_RE = re.compile(r"^\ufeff?\s*---\s*\n(.*?)\n---\s*(?:\n|$)", re.S)


def find_pages(root: Path):
    for path in root.rglob("*"):
        if not path.is_file() or path.suffix.lower() not in PAGE_EXTENSIONS:
            continue
        if path.relative_to(root).parts[:2] in GENERATED_ROOTS:
            continue
        yield path


def read_frontmatter(path: Path):
    """Return the page's frontmatter dict, or None if it has none or can't be read."""
    try:
        text = path.read_text(encoding="utf-8")
    except (OSError, UnicodeDecodeError):
        return None

    if path.suffix.lower() != ".ipynb":
        data = parse_frontmatter(text)
        return data if isinstance(data, dict) else None

    try:
        cells = json.loads(text).get("cells", [])
    except (ValueError, AttributeError):
        return None
    for cell in cells:
        source = cell.get("source")
        if isinstance(source, list):
            # Notebook lines may lack trailing newlines; rejoin so YAML stays parseable.
            source = "\n".join(str(line).rstrip("\n") for line in source)
        if isinstance(source, str):
            data = parse_frontmatter(source)
            if data is not None:
                return data if isinstance(data, dict) else None
    return None


def parse_frontmatter(text: str):
    text = text.replace("\r\n", "\n").replace("\r", "\n")
    match = FRONTMATTER_RE.match(text)
    if not match:
        return None
    try:
        return yaml.safe_load(match.group(1)) or {}
    except yaml.YAMLError:
        return None


# ---- Jekyll URL rules
# contentUrl must equal Jekyll's `page.url` byte for byte: Spring dedups on it, and
# the browser posts `page.url` from _layouts/post.html.

PAGE_SUFFIX_RE = re.compile(r"\.(md|markdown|html|htm|ipynb)$", re.I)


def content_url_for(root: Path, path: Path, fm: dict):
    permalink = fm.get("permalink")
    if isinstance(permalink, str) and permalink.strip():
        return canonicalize_content_url(permalink)

    relative = path.relative_to(root).as_posix()
    if "_posts/" in relative:
        dated = re.match(r"^(\d{4})-(\d{2})-(\d{2})-(.+)$", PAGE_SUFFIX_RE.sub("", path.name))
        if dated:
            year, month, day, slug = dated.groups()
            parts = jekyll_categories(relative, fm) + [year, month, day, slug]
            return canonicalize_content_url("/".join(parts) + ".html")

    relative = re.sub(r"(^|/)index\.(md|markdown|html|htm)$", r"\1", relative, flags=re.I)
    return canonicalize_content_url(PAGE_SUFFIX_RE.sub(".html", relative))


def jekyll_categories(relative_path: str, fm: dict):
    """Only directories above `_posts` are categories; frontmatter overrides them."""
    declared = fm.get("categories")
    if declared is None:
        declared = fm.get("category")
    if isinstance(declared, str):
        categories = declared.replace(",", " ").split()
    elif isinstance(declared, list):
        categories = [str(c).strip() for c in declared if str(c).strip()]
    else:
        categories = [part for part in relative_path.partition("_posts/")[0].split("/") if part]
    return [quote(c.lower(), safe="") for c in categories]


def canonicalize_content_url(url):
    """Mirrors AssignmentContentUrls.canonicalize in Spring; keep the two in step."""
    if not isinstance(url, str):
        return None
    return re.sub(r"/{2,}", "/", url.strip()).strip("/") or None


if __name__ == "__main__":
    raise SystemExit(main())
