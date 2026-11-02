import assert from "node:assert/strict";
import test from "node:test";

import {
  aiRegradeCandidates, assignmentPageUrl, assignmentsWithTopic, filterCreatorSubmissions, withFrontmatterCourses,
} from "../assets/js/submissions/creator-dashboard.js";
import { gradeSourceLabel, parseGradeInput } from "../assets/js/submissions/grading.js";

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

test("frontmatter categories become topics, from an array or a page's string", () => {
  const assignments = [
    { contentUrl: "csa/arrays", courseCodes: ["CSA"] },
    { contentUrl: "csp/loops", courseCodes: [] },
    { contentUrl: "unlisted", courseCodes: [] },
  ];
  const manifest = [
    { contentUrl: "/csa/arrays", courseCodes: ["csa"], topics: ["Java", "Arrays", "Java"] },
    { contentUrl: "csp/loops/", courseCodes: [], topics: "Python Loops" },
  ];
  assert.deepEqual(withFrontmatterCourses(assignments, manifest).map((assignment) => assignment.topics), [
    ["Java", "Arrays"], ["Python", "Loops"], [],
  ]);
});

test("the topic filter narrows lessons and their submissions", () => {
  const lessons = [{ id: 1, topics: ["Java"] }, { id: 2, topics: ["Python"] }];
  assert.deepEqual(assignmentsWithTopic(lessons, "Java").map((lesson) => lesson.id), [1]);
  assert.equal(assignmentsWithTopic(lessons, "").length, 2);
  const topicAssignmentIds = new Set(assignmentsWithTopic(lessons, "Python").map((lesson) => String(lesson.id)));
  assert.deepEqual(
    filterCreatorSubmissions(submissions, { topicAssignmentIds }, statusOf).map((row) => row.submitterUid),
    ["casey"],
  );
});

test("bulk AI re-grade skips closed assignments and instructor grades", () => {
  const rows = [
    { id: 1, grading: { closed: false, manualOverride: false } },
    { id: 2, grading: { closed: true, manualOverride: false } },
    { id: 3, grading: { closed: false, manualOverride: true } },
    { id: 4 },
  ];
  assert.deepEqual(aiRegradeCandidates(rows).map((row) => row.id), [1, 4]);
});

test("creator grades must be within the assignment's points", () => {
  assert.deepEqual(parseGradeInput("3.5", 4), { grade: 3.5 });
  assert.deepEqual(parseGradeInput("0", 4), { grade: 0 });
  assert.ok(parseGradeInput("5", 4).error);
  assert.ok(parseGradeInput("-1", 4).error);
  assert.ok(parseGradeInput("", 4).error);
  assert.ok(parseGradeInput("abc", null).error);
  assert.deepEqual(parseGradeInput("12", null), { grade: 12 });
});

test("grade source comes from Spring's grading state, not from guessing at feedback", () => {
  assert.equal(gradeSourceLabel({ grade: null, grading: { source: "NONE" } }), "");
  assert.equal(gradeSourceLabel({ grade: 4, grading: { source: "MANUAL" } }), "Instructor grade");
  assert.equal(gradeSourceLabel({ grade: 3, grading: { source: "AI" } }), "AI grade");
  // Identical feedback and AI summary used to be read as "AI"; the state is now explicit.
  assert.equal(gradeSourceLabel({ grade: 3, feedback: "x", aiSummary: "x" }), "");
});
