import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import {
  GRADING_MESSAGES, applyGradingState, canPetition, clearManualGrade, filePetition, gradePills, gradingMessage,
  hasManualOverride, isFinal, readGradingResponse, renderGradingHistory, requestAiRegrade, saveManualGrade,
} from "../assets/js/submissions/grading.js";

const escapeHtml = (value) => String(value).replace(/[&<>"']/g, (ch) => (
  { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch]));

function jsonResponse(status, body) {
  return { ok: status >= 200 && status < 300, status, json: async () => body };
}

function recordingFetch(response) {
  const calls = [];
  globalThis.fetch = async (url, options) => {
    calls.push({ url: String(url), options });
    return response;
  };
  return calls;
}

const OVERRIDDEN = {
  submissionId: 7, revision: 2, effectiveGrade: 0.9, effectiveFeedback: "Teacher note", aiGrade: 0.6,
  aiFeedback: "AI note", qualityScore: 3, manualOverride: true, manualGrade: 0.9, manualFeedback: "Teacher note",
  needsAiRegrade: false, source: "MANUAL",
};

test("every outcome Spring can return has its own message", async (t) => {
  const java = await readFile(new URL(
    "../../AAAspring/src/main/java/com/open/spring/mvc/assignments/GradingOutcome.java", import.meta.url), "utf8")
    .catch(() => null);
  if (!java) {
    t.skip("Spring checkout not next to Pages");
    return;
  }
  const outcomes = [...java.matchAll(/^\s{4}([A-Z_]+)[,;\n]/gm)].map((match) => match[1]);
  assert.ok(outcomes.length >= 10, "parsed the enum");
  assert.deepEqual([...outcomes].sort(), Object.keys(GRADING_MESSAGES).sort());
});

test("messages add the AI's own explanation only for AI failures", () => {
  assert.equal(gradingMessage("AI_FAILED", "HTTP 503"), `${GRADING_MESSAGES.AI_FAILED} (HTTP 503)`);
  assert.equal(gradingMessage("STALE_REVISION", "ignored"), GRADING_MESSAGES.STALE_REVISION);
  assert.match(gradingMessage("SOMETHING_NEW"), /SOMETHING_NEW/);
});

test("a manual grade sends the revision the grader reviewed", async () => {
  const calls = recordingFetch(jsonResponse(200, { outcome: "MANUAL_GRADE_APPLIED", grading: OVERRIDDEN }));

  const result = await saveManualGrade({
    javaURI: "https://spring.test", fetchOptions: { credentials: "include" }, submissionId: 7, grade: 0.9,
    feedback: "Teacher note", revision: 2,
  });

  const url = new URL(calls[0].url);
  assert.equal(url.pathname, "/api/submissions/grade/7");
  assert.equal(url.searchParams.get("grade"), "0.9");
  assert.equal(url.searchParams.get("feedback"), "Teacher note");
  assert.equal(url.searchParams.get("revision"), "2");
  assert.equal(calls[0].options.method, "POST");
  assert.equal(calls[0].options.credentials, "include");
  assert.equal(result.ok, true);
  assert.equal(result.message, GRADING_MESSAGES.MANUAL_GRADE_APPLIED);
});

test("without a known revision the request leaves it out instead of sending 'undefined'", async () => {
  const calls = recordingFetch(jsonResponse(200, { outcome: "MANUAL_GRADE_APPLIED", grading: OVERRIDDEN }));

  await saveManualGrade({ javaURI: "", fetchOptions: {}, submissionId: 7, grade: 1, feedback: null, revision: undefined });

  const url = new URL(calls[0].url, "https://spring.test");
  assert.equal(url.searchParams.has("revision"), false);
  assert.equal(url.searchParams.get("feedback"), "");
});

test("clearing an override is a DELETE on the same resource", async () => {
  const calls = recordingFetch(jsonResponse(200, { outcome: "MANUAL_OVERRIDE_CLEARED", grading: { source: "AI" } }));

  const result = await clearManualGrade({ javaURI: "https://spring.test", fetchOptions: {}, submissionId: 7, revision: 2 });

  assert.equal(calls[0].options.method, "DELETE");
  assert.equal(calls[0].url, "https://spring.test/api/submissions/grade/7?revision=2");
  assert.equal(result.message, GRADING_MESSAGES.MANUAL_OVERRIDE_CLEARED);
});

test("a stale revision is reported as a typed conflict", async () => {
  const result = await readGradingResponse(jsonResponse(409, {
    outcome: "STALE_REVISION", grading: { ...OVERRIDDEN, revision: 3 }, detail: null,
  }));

  assert.equal(result.ok, false);
  assert.equal(result.outcome, "STALE_REVISION");
  assert.equal(result.grading.revision, 3);
  assert.equal(result.message, GRADING_MESSAGES.STALE_REVISION);
});

test("plain errors and unreadable bodies still produce a message", async () => {
  assert.equal((await readGradingResponse(jsonResponse(401, { error: "Authentication required" }))).message,
    "Authentication required");
  const broken = { ok: false, status: 500, json: async () => { throw new SyntaxError("bad json"); } };
  assert.equal((await readGradingResponse(broken)).message, "HTTP 500");
});

test("a grading state updates the effective grade shown in the list", () => {
  const row = { id: 7, grade: 0.6, feedback: "AI note", aiSummary: "AI note", grading: { source: "AI", revision: 2 } };

  applyGradingState(row, OVERRIDDEN);

  assert.equal(row.grade, 0.9);
  assert.equal(row.feedback, "Teacher note");
  assert.equal(row.aiSummary, "AI note");
  assert.equal(hasManualOverride(row), true);
  assert.equal(applyGradingState(row, null), row, "a missing state leaves the row alone");
  assert.equal(hasManualOverride({}), false);
});

test("history shows the effective grade, who acted, and AI grades kept for reference", () => {
  const html = renderGradingHistory({
    current: OVERRIDDEN,
    events: [
      { id: 1, revision: 1, type: "SUBMITTED", content: { url: "https://example.com/v1" }, createdAt: "2026-10-24T09:00:00" },
      { id: 2, revision: 1, type: "MANUAL_OVERRIDE_SET", grade: 0.8, actorName: "Mr. <Mort>", effective: true, createdAt: "2026-10-24T09:05:00" },
      { id: 3, revision: 1, type: "MANUAL_OVERRIDE_RELEASED_BY_REVISION", grade: 0.8, effective: false, createdAt: "2026-10-24T10:00:00" },
      { id: 4, revision: 2, type: "REVISED", content: { url: "https://example.com/v2" }, createdAt: "2026-10-24T10:00:00" },
      { id: 5, revision: 2, type: "AI_GRADED", grade: 0.6, effective: false, feedback: "AI note", createdAt: "2026-10-24T10:01:00" },
    ],
  }, { escapeHtml, points: 1 });

  assert.match(html, /Revision 2 · Effective: <strong>Instructor grade<\/strong>/);
  assert.match(html, /AI grade: 0.6\/1/);
  assert.match(html, /by Mr\. &lt;Mort&gt;/, "names are escaped");
  assert.match(html, /kept for reference/);
  assert.match(html, /released by a new revision/);
  assert.ok(html.indexOf("AI graded") < html.indexOf("Submitted"), "newest first");
  assert.match(html, /https:\/\/example.com\/v1/);
});

test("an empty history says so", () => {
  assert.match(renderGradingHistory({ current: null, events: [] }, { escapeHtml }), /No history recorded yet/);
});

// ---- closure and OCS markup ----

test("a closed assignment's grade shows as final with OCS status pills", () => {
  const open = { grade: 0.6, grading: { source: "AI", closed: false } };
  const finalManual = { grade: 0.9, grading: { source: "MANUAL", closed: true } };

  assert.equal(isFinal(open), false);
  assert.equal(isFinal(finalManual), true);
  assert.equal(gradePills(open, escapeHtml), '<span class="ocs__status-pill ocs__status-pill--neutral">AI grade</span>');
  const pills = gradePills(finalManual, escapeHtml);
  assert.match(pills, /ocs__status-pill--warn">Instructor grade/);
  assert.match(pills, /ocs__status-pill--good" title="The assignment is closed">Final/);
  assert.equal(gradePills({ grade: null, grading: { source: "NONE", closed: false } }, escapeHtml), "");
});

test("a student teacher's AI re-grade request posts to the AI grade endpoint", async () => {
  const calls = recordingFetch(jsonResponse(200, { outcome: "AI_GRADE_APPLIED", grading: { source: "AI" } }));

  const result = await requestAiRegrade({ javaURI: "https://spring.test", fetchOptions: {}, submissionId: 7 });

  assert.equal(calls[0].url, "https://spring.test/api/submissions/ai-grade/7");
  assert.equal(calls[0].options.method, "POST");
  assert.equal(result.message, GRADING_MESSAGES.AI_GRADE_APPLIED);
});

test("a submission refused because the assignment closed explains why", async () => {
  const result = await readGradingResponse(jsonResponse(409, { outcome: "ASSIGNMENT_CLOSED", grading: null }));

  assert.equal(result.ok, false);
  assert.match(result.message, /closed, so grades are final/);
});

test("history shows the close and teacher review decisions", () => {
  const html = renderGradingHistory({
    current: { ...OVERRIDDEN, closed: true },
    events: [
      { id: 1, revision: 1, type: "FINALIZED", grade: 0.6, effective: true, createdAt: "2026-10-25T15:00:00" },
      { id: 2, revision: 1, type: "AUTHORIZED_CORRECTION", grade: 0.9, actorName: "niko", effective: true,
        feedback: "Corrected after petition", createdAt: "2026-10-26T09:00:00" },
    ],
  }, { escapeHtml, points: 1 });

  assert.match(html, /Final: the assignment is closed/);
  assert.match(html, /ocs__status-pill--good">Finalized at close/);
  assert.match(html, /ocs__status-pill--warn">Teacher review: grade corrected<\/span> by niko · 0.9\/1/);
  assert.match(html, /<div class="ocs__tree">/);
  assert.match(html, /<div class="ocs__callout">/);
});

test("a student can petition an instructor grade, or any grade after close", () => {
  assert.equal(canPetition({ grading: OVERRIDDEN }), true);
  assert.equal(canPetition({ grading: { ...OVERRIDDEN, manualOverride: false, source: "AI", closed: true } }), true);
  assert.equal(canPetition({ grading: { ...OVERRIDDEN, manualOverride: false, source: "AI" } }), false);
  assert.equal(canPetition({}), false);
});

test("a petition posts the student's message as JSON", async () => {
  const calls = recordingFetch(jsonResponse(201, { outcome: "REVIEW_OPENED", grading: OVERRIDDEN }));

  const result = await filePetition({
    javaURI: "https://spring.test", fetchOptions: { credentials: "include" }, submissionId: 7,
    message: "Revision 3 fixes part 2",
  });

  assert.equal(calls[0].url, "https://spring.test/api/grade-reviews/submission/7/petition");
  assert.equal(calls[0].options.method, "POST");
  assert.equal(calls[0].options.credentials, "include");
  assert.equal(calls[0].options.headers["Content-Type"], "application/json");
  assert.deepEqual(JSON.parse(calls[0].options.body), { message: "Revision 3 fixes part 2" });
  assert.equal(result.ok, true);
  assert.equal(result.message, GRADING_MESSAGES.REVIEW_OPENED);
});

test("a petition without an instructor grade before close is refused with a reason", async () => {
  recordingFetch(jsonResponse(409, { outcome: "NO_MANUAL_OVERRIDE", grading: { ...OVERRIDDEN, manualOverride: false } }));

  const result = await filePetition({ javaURI: "https://spring.test", fetchOptions: {}, submissionId: 7, message: "x" });

  assert.equal(result.ok, false);
  assert.equal(result.message, GRADING_MESSAGES.NO_MANUAL_OVERRIDE);
});

test("history shows an instructor grade carried over to a new revision", () => {
  const html = renderGradingHistory({
    current: { ...OVERRIDDEN, revision: 2 },
    events: [
      { id: 1, revision: 2, type: "REVISED", actorName: "hop", createdAt: "2026-10-27T09:00:00" },
      { id: 2, revision: 2, type: "MANUAL_OVERRIDE_KEPT_BY_REVISION", grade: 0.9, effective: true,
        createdAt: "2026-10-27T09:00:00" },
    ],
  }, { escapeHtml, points: 1 });

  assert.match(html, /Instructor grade kept for the new revision<\/span> · 0.9\/1/);
});

test("the grading UI uses OCS grammar with no literal colors", async () => {
  for (const file of ["../assets/js/submissions/grading.js", "../assets/js/submissions/creator-dashboard.js"]) {
    const source = await readFile(new URL(file, import.meta.url), "utf8");
    assert.doesNotMatch(source, /#[0-9a-fA-F]{3,6}\b|rgba?\(|style="/, `${file} hardcodes a color or inline style`);
  }
});

