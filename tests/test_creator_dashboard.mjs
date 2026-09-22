import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const source = await readFile(new URL("../assets/js/submissions/creator-dashboard.js", import.meta.url), "utf8");
const { assignmentPageUrl, filterCreatorSubmissions, withFrontmatterCourses } = await import(
  `data:text/javascript;charset=utf-8,${encodeURIComponent(source)}`
);

const submissions = [
  { assignmentId: 1, assignmentName: "Ground 0", submitterName: "Ana", submitterUid: "ana", submitterCourseCodes: ["CSA", "CSP"], status: "pending" },
  { assignmentId: 1, assignmentName: "Ground 0", submitterName: "Ben", submitterUid: "ben-2026", submitterCourseCodes: ["CSSE"], status: "graded" },
  { assignmentId: 2, assignmentName: "Pilot", submitterName: "Casey", submitterUid: "casey", submitterCourseCodes: [], status: "late" },
];
const statusOf = (submission) => submission.status;

test("canonical assignment links keep .html posts and slash directory permalinks", () => {
  assert.equal(assignmentPageUrl("/AAApages", "/sprint1/challenge/"), "/AAApages/sprint1/challenge/");
  assert.equal(assignmentPageUrl("", "2026/07/27/lesson.html"), "/2026/07/27/lesson.html");
  assert.equal(assignmentPageUrl("", null), "");
});

test("student-course filtering uses memberships and supports multiple courses", () => {
  assert.deepEqual(
    filterCreatorSubmissions(submissions, { course: "CSP" }, statusOf).map((row) => row.submitterUid),
    ["ana"],
  );
  assert.deepEqual(
    filterCreatorSubmissions(submissions, { course: "CSA" }, statusOf).map((row) => row.submitterUid),
    ["ana"],
  );
  assert.deepEqual(
    filterCreatorSubmissions(submissions, { course: "__unassigned__" }, statusOf).map((row) => row.submitterUid),
    ["casey"],
  );
});

test("assignment, student UID, and status filters combine", () => {
  const filtered = filterCreatorSubmissions(
    submissions,
    { assignmentId: "1", student: "BEN-2026", status: "graded" },
    statusOf,
  );
  assert.deepEqual(filtered.map((row) => row.submitterUid), ["ben-2026"]);
});

test("frontmatter courses appear immediately without Spring synchronization", () => {
  const assignments = [
    { contentUrl: "sprint1/challenge", courseCodes: [] },
    { contentUrl: "csa/legacy", courseCodes: ["CSA"] },
  ];
  const manifest = [{ contentUrl: "/sprint1/challenge/", courseCodes: ["csse", "csp", "csa", "csh"] }];
  assert.deepEqual(withFrontmatterCourses(assignments, manifest).map((assignment) => assignment.courseCodes), [
    ["CSSE", "CSP", "CSA", "CSH"], ["CSA"],
  ]);
});
