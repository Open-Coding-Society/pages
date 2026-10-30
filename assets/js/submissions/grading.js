// Grading calls, outcome text and markup shared by the submissions page, the creator dashboard and
// the lesson submit forms. Spring answers grading actions with { outcome, grading, detail };
// GRADING_MESSAGES holds the text for every GradingOutcome. Markup is OCS grammar only.

export const GRADING_MESSAGES = {
  MANUAL_GRADE_APPLIED: "Grade saved. It replaces the AI grade.",
  MANUAL_OVERRIDE_CLEARED: "Instructor grade removed; the AI grade applies again.",
  NO_MANUAL_OVERRIDE: "There is no instructor grade to remove or petition.",
  AI_GRADE_APPLIED: "AI graded the submission.",
  MANUAL_OVERRIDE_KEPT: "AI grade saved for reference; the instructor grade still applies.",
  REVISION_CREATED: "Saved as a new revision. The AI will grade it; an instructor grade stays until your teacher changes it.",
  CONTENT_UNCHANGED: "Saved.",
  STALE_REVISION: "The student changed this submission since you loaded it. Reload and review the new version.",
  INVALID_GRADE: "Enter a grade from 0 to the assignment's points.",
  NOT_PERMITTED: "You do not have permission to do this.",
  AI_NOT_GRADEABLE: "The AI can't grade this submission.",
  AI_FAILED: "The AI grader is unavailable right now; try again later.",
  SUBMISSION_NOT_FOUND: "This submission no longer exists.",
  ASSIGNMENT_NOT_FOUND: "This assignment no longer exists.",
  ASSIGNMENT_CLOSED: "This assignment is closed, so grades are final. Ask your teacher if something needs another look.",
  ASSIGNMENT_FINALIZED: "Assignment closed. Grades are final and copied to the gradebook.",
  REVIEW_REQUIRES_CLOSE: "Reviews are for closed assignments. Before close, grade or re-grade directly.",
  REVIEW_OPENED: "Review opened. Your teacher will decide it.",
  REVIEW_ALREADY_OPEN: "This submission already has an open review.",
  EVIDENCE_RECORDED: "Evidence saved.",
  REVIEW_NOT_OPEN: "This review is already decided.",
  REASON_REQUIRED: "Give a reason for the review.",
  DECISION_REQUIRED: "Choose a decision.",
  RATIONALE_REQUIRED: "Write a rationale for the decision.",
  REVIEW_NO_CHANGE: "Decision recorded. The grade is unchanged.",
  GRADE_CORRECTED: "Grade corrected and copied to the gradebook.",
  REVIEW_NOT_FOUND: "This review no longer exists.",
};

const HISTORY_LABELS = {
  SUBMITTED: "Submitted",
  REVISED: "Revised",
  AI_GRADED: "AI graded",
  MANUAL_OVERRIDE_SET: "Instructor grade",
  MANUAL_OVERRIDE_CLEARED: "Instructor grade removed",
  MANUAL_OVERRIDE_KEPT_BY_REVISION: "Instructor grade kept for the new revision",
  MANUAL_OVERRIDE_RELEASED_BY_REVISION: "Instructor grade released by a new revision",
  FINALIZED: "Finalized at close",
  REVIEW_NO_CHANGE: "Teacher review: no change",
  AUTHORIZED_CORRECTION: "Teacher review: grade corrected",
};

// OCS status-pill tone for each kind of history entry.
const HISTORY_TONES = {
  MANUAL_OVERRIDE_SET: "warn",
  AUTHORIZED_CORRECTION: "warn",
  FINALIZED: "good",
  REVIEW_NO_CHANGE: "good",
};

export function gradingMessage(outcome, detail) {
  const message = GRADING_MESSAGES[outcome] || `Request finished: ${outcome}`;
  return detail && (outcome === "AI_NOT_GRADEABLE" || outcome === "AI_FAILED") ? `${message} (${detail})` : message;
}

export function parseGradeInput(rawValue, maxPoints) {
  const trimmed = String(rawValue ?? "").trim();
  const grade = Number(trimmed);
  const hasMax = maxPoints != null && Number.isFinite(Number(maxPoints));
  if (trimmed === "" || !Number.isFinite(grade) || grade < 0 || (hasMax && grade > Number(maxPoints))) {
    return { error: `Enter a grade from 0 to ${hasMax ? maxPoints : "the assignment's points"}` };
  }
  return { grade };
}

/** Where the effective grade comes from, as Spring reports it. */
export function gradeSourceLabel(submission) {
  switch (submission?.grading?.source) {
    case "MANUAL": return "Instructor grade";
    case "AI": return "AI grade";
    default: return "";
  }
}

export function hasManualOverride(submission) {
  return submission?.grading?.manualOverride === true;
}

/** True once the assignment is closed and the grade is final. */
export function isFinal(submission) {
  return submission?.grading?.closed === true;
}

/** A student can petition an instructor grade, or any grade once the assignment is closed. */
export function canPetition(submission) {
  return hasManualOverride(submission) || isFinal(submission);
}

/** Status pills for the grade's source, plus "Final" once the assignment is closed. */
export function gradePills(submission, escapeHtml) {
  const pills = [];
  const source = gradeSourceLabel(submission);
  if (source) {
    const tone = submission.grading.source === "MANUAL" ? "warn" : "neutral";
    pills.push(`<span class="ocs__status-pill ocs__status-pill--${tone}">${escapeHtml(source)}</span>`);
  }
  if (isFinal(submission)) {
    pills.push('<span class="ocs__status-pill ocs__status-pill--good" title="The assignment is closed">Final</span>');
  }
  return pills.join(" ");
}

/** Copies a grading state from a grading response onto a submission row from the list endpoints. */
export function applyGradingState(submission, grading) {
  if (!submission || !grading) return submission;
  return Object.assign(submission, {
    grade: grading.effectiveGrade,
    feedback: grading.effectiveFeedback ?? "",
    aiSummary: grading.aiFeedback,
    qualityScore: grading.qualityScore,
    grading,
  });
}

/** Reads a grading response; `message` is the outcome's text, or Spring's error otherwise. */
export async function readGradingResponse(response) {
  const body = await response.json().catch(() => ({}));
  const outcome = body?.outcome ?? null;
  return {
    ok: response.ok,
    status: response.status,
    outcome,
    grading: body?.grading ?? null,
    detail: body?.detail ?? null,
    message: outcome ? gradingMessage(outcome, body.detail)
      : body?.error || body?.message || response.statusText || `HTTP ${response.status}`,
  };
}

/** Sets a manual grade for the revision on screen. */
export async function saveManualGrade({ javaURI, fetchOptions, submissionId, grade, feedback, revision }) {
  const query = new URLSearchParams({ grade: String(grade), feedback: feedback ?? "" });
  if (revision != null) query.set("revision", String(revision));
  const response = await fetch(`${javaURI}/api/submissions/grade/${encodeURIComponent(submissionId)}?${query}`, {
    ...fetchOptions,
    method: "POST",
  });
  return readGradingResponse(response);
}

/** Removes the instructor grade so grading returns to the AI. */
export async function clearManualGrade({ javaURI, fetchOptions, submissionId, revision }) {
  const query = revision != null ? `?${new URLSearchParams({ revision: String(revision) })}` : "";
  const response = await fetch(`${javaURI}/api/submissions/grade/${encodeURIComponent(submissionId)}${query}`, {
    ...fetchOptions,
    method: "DELETE",
  });
  return readGradingResponse(response);
}

/** Asks the AI to re-grade (before close). */
export async function requestAiRegrade({ javaURI, fetchOptions, submissionId }) {
  const response = await fetch(`${javaURI}/api/submissions/ai-grade/${encodeURIComponent(submissionId)}`, {
    ...fetchOptions,
    method: "POST",
  });
  return readGradingResponse(response);
}

/** Asks the teacher to reconsider the grade; they decide it as a review. */
export async function filePetition({ javaURI, fetchOptions, submissionId, message }) {
  const response = await fetch(`${javaURI}/api/grade-reviews/submission/${encodeURIComponent(submissionId)}/petition`, {
    ...fetchOptions,
    method: "POST",
    headers: { ...(fetchOptions?.headers || {}), "Content-Type": "application/json" },
    body: JSON.stringify({ message }),
  });
  return readGradingResponse(response);
}

export async function fetchGradingHistory({ javaURI, fetchOptions, submissionId }) {
  const response = await fetch(`${javaURI}/api/submissions/${encodeURIComponent(submissionId)}/grading-history`, {
    ...fetchOptions,
    method: "GET",
  });
  if (!response.ok) {
    throw new Error((await readGradingResponse(response)).message);
  }
  return response.json();
}

function formatGrade(grade, points) {
  if (grade == null) return "—";
  const rounded = Math.round(Number(grade) * 100) / 100;
  return points != null ? `${rounded}/${points}` : String(rounded);
}

function contentSummary(content) {
  if (!content) return "";
  return content.url || content.filename || content.text || "";
}

/** The grading history as HTML, newest first. */
export function renderGradingHistory(history, { escapeHtml, points = null }) {
  const text = (value) => escapeHtml(String(value ?? ""));
  const current = history?.current;
  const events = [...(history?.events || [])].reverse();
  const effective = current?.source === "MANUAL" ? "Instructor grade"
    : current?.source === "AI" ? "AI grade" : "Not graded yet";
  const summary = current ? `
    <div class="ocs__callout">
      Revision ${text(current.revision)} · Effective: <strong>${text(effective)}</strong>
      ${current.effectiveGrade != null ? ` (${text(formatGrade(current.effectiveGrade, points))})` : ""}
      · AI grade: ${text(formatGrade(current.aiGrade, points))}
      ${current.manualOverride ? ` · Instructor grade: ${text(formatGrade(current.manualGrade, points))}` : ""}
      ${current.closed ? " · Final: the assignment is closed" : ""}
    </div>` : "";
  if (!events.length) {
    return `${summary}<p class="ocs__description">No history recorded yet.</p>`;
  }
  return `${summary}<div class="ocs__tree">${events.map((event) => {
    const tone = HISTORY_TONES[event.type] || "neutral";
    const by = event.actorName ? ` by ${text(event.actorName)}` : "";
    const grade = event.grade != null ? ` · ${text(formatGrade(event.grade, points))}` : "";
    const reference = event.type === "AI_GRADED" && event.effective === false ? " · kept for reference" : "";
    const work = contentSummary(event.content);
    return `<div class="ocs__tree-item">
      <span class="ocs__status-pill ocs__status-pill--${tone}">${text(HISTORY_LABELS[event.type] || event.type)}</span>${by}${grade}${reference}
      <br><small>Revision ${text(event.revision)} · ${text(new Date(event.createdAt).toLocaleString())}</small>
      ${work ? `<br><small>${text(work)}</small>` : ""}
      ${event.feedback ? `<p class="ocs__description">${text(event.feedback)}</p>` : ""}
    </div>`;
  }).join("")}</div>`;
}

function historyModal() {
  let modal = document.getElementById("grading-history-modal");
  if (modal) return modal;
  modal = document.createElement("div");
  modal.id = "grading-history-modal";
  modal.className = "hidden ocs__modal";
  modal.setAttribute("role", "dialog");
  modal.setAttribute("aria-modal", "true");
  modal.setAttribute("aria-labelledby", "grading-history-title");
  modal.innerHTML = `
    <div class="ocs__card ocs__modal-card">
      <div class="ocs__modal-header">
        <h3 class="ocs__modal-title" id="grading-history-title">Grading history</h3>
        <button type="button" class="ocs__btn ocs__btn--icon small" data-close-history aria-label="Close history">&times;</button>
      </div>
      <div data-history-body></div>
    </div>`;
  const close = () => {
    modal.classList.add("hidden");
    modal.setAttribute("aria-hidden", "true");
  };
  modal.addEventListener("click", (event) => {
    if (event.target === modal || event.target.closest("[data-close-history]")) close();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !modal.classList.contains("hidden")) close();
  });
  document.body.appendChild(modal);
  return modal;
}

/** Opens a modal with the submission's grading history. */
export async function showGradingHistory({ javaURI, fetchOptions, submissionId, title, points, escapeHtml }) {
  const modal = historyModal();
  modal.querySelector(".ocs__modal-title").textContent = title || "Grading history";
  const body = modal.querySelector("[data-history-body]");
  body.textContent = "Loading…";
  modal.classList.remove("hidden");
  modal.setAttribute("aria-hidden", "false");
  modal.querySelector("[data-close-history]").focus();
  try {
    const history = await fetchGradingHistory({ javaURI, fetchOptions, submissionId });
    body.innerHTML = renderGradingHistory(history, { escapeHtml, points });
  } catch (error) {
    body.textContent = `Could not load history: ${error.message}`;
  }
}
