import {
  applyGradingState, clearManualGrade, gradePills, hasManualOverride, isFinal, parseGradeInput, requestAiRegrade,
  saveManualGrade, showGradingHistory,
} from "./grading.js";

const PAGE_SIZE = 25;
const UNASSIGNED_COURSE = "__unassigned__";

export function assignmentPageUrl(baseUrl, contentUrl) {
  if (!contentUrl) return "";
  const normalizedBase = String(baseUrl || "").replace(/\/$/, "");
  const contentPath = String(contentUrl);
  const normalizedPath = contentPath.replace(/^\/+|\/+$/g, "");
  const hasTrailingSlash = contentPath.endsWith("/");
  return `${normalizedBase}/${normalizedPath}${normalizedPath.endsWith(".html") || !hasTrailingSlash ? "" : "/"}`;
}

function normalizedContentUrl(contentUrl) {
  return String(contentUrl || "").replace(/^\/+|\/+$/g, "");
}

// Jekyll gives posts a categories array; a page may set a single string.
function topicList(topics) {
  const values = Array.isArray(topics) ? topics : String(topics || "").split(/[\s,]+/);
  return [...new Set(values.map((topic) => String(topic).trim()).filter(Boolean))];
}

export function withFrontmatterCourses(assignments, manifest) {
  const entriesByUrl = new Map();
  for (const entry of Array.isArray(manifest) ? manifest : []) {
    const url = normalizedContentUrl(entry?.contentUrl);
    if (url) entriesByUrl.set(url, entry);
  }
  return assignments.map((assignment) => {
    const entry = entriesByUrl.get(normalizedContentUrl(assignment.contentUrl));
    const codes = [...new Set((Array.isArray(entry?.courseCodes) ? entry.courseCodes : [])
      .map((code) => String(code).trim().toUpperCase()))].filter(Boolean);
    return {
      ...assignment,
      // Frontmatter is authoritative for the visible label; Spring remains authoritative for access.
      courseCodes: codes.length ? codes : assignment.courseCodes,
      // Topics are the lesson's frontmatter categories, the same field the Topics page filters on.
      topics: topicList(entry?.topics),
    };
  });
}

export function assignmentsWithTopic(assignments, topic) {
  return topic ? assignments.filter((assignment) => (assignment.topics || []).includes(topic)) : assignments;
}

/** Submissions the AI may re-grade: not closed, and not held by an instructor grade. */
export function aiRegradeCandidates(submissions) {
  return submissions.filter((submission) => !isFinal(submission) && !hasManualOverride(submission));
}

export function filterCreatorSubmissions(submissions, filters, getFilterStatus) {
  const { course = "", assignmentId = "", student = "", status = "", topicAssignmentIds = null } = filters;
  const studentQuery = student.trim().toLowerCase();

  return submissions.filter((submission) => {
    const memberships = submission.submitterCourseCodes || [];
    const courseMatches = !course
      || (course === UNASSIGNED_COURSE ? memberships.length === 0 : memberships.includes(course));
    const assignmentMatches = !assignmentId || String(submission.assignmentId) === assignmentId;
    const topicMatches = !topicAssignmentIds || topicAssignmentIds.has(String(submission.assignmentId));
    const studentText = `${submission.submitterName || ""} ${submission.submitterUid || ""}`.toLowerCase();
    const studentMatches = !studentQuery || studentText.includes(studentQuery);
    const statusMatches = !status || getFilterStatus(submission) === status;
    return courseMatches && assignmentMatches && topicMatches && studentMatches && statusMatches;
  }).sort((left, right) => {
    const assignmentOrder = String(left.assignmentName || "").localeCompare(String(right.assignmentName || ""));
    return assignmentOrder || String(left.submitterName || "").localeCompare(String(right.submitterName || ""));
  });
}

export function createCreatorDashboard(options) {
  const {
    managedAssignmentsUrl,
    managedSubmissionsUrl,
    javaURI,
    courseManifestUrl,
    fetchOptions,
    baseUrl,
    renderContent,
    renderAiSummary,
    renderQualityScore,
    getStatusBadge,
    getFilterStatus,
    escapeHtml,
    cellTitle,
  } = options;

  let assignments = [];
  let submissions = [];
  let currentPage = 1;
  let teacherView = false;

  const element = (id) => document.getElementById(id);
  const text = (value, fallback = "") => escapeHtml(String(value ?? fallback));

  function assignmentUrl(contentUrl) {
    return assignmentPageUrl(baseUrl, contentUrl);
  }

  function assignmentLink(assignment) {
    const name = text(assignment?.name, "Untitled assignment");
    const url = assignmentUrl(assignment?.contentUrl);
    return url
      ? `<a class="creator-assignment-link" href="${text(url)}" target="_blank" rel="noopener">${name}</a>`
      : `<strong>${name}</strong>`;
  }

  function courseList(courseCodes) {
    return Array.isArray(courseCodes) && courseCodes.length
      ? text(courseCodes.join(" · "))
      : '<span class="creator-muted">Unassigned</span>';
  }

  function topicList(topics) {
    return Array.isArray(topics) && topics.length
      ? text(topics.join(" · "))
      : '<span class="creator-muted">None</span>';
  }

  function visibleAssignments() {
    return assignmentsWithTopic(assignments, element("creator-filter-topic").value);
  }

  function renderAssignments() {
    const container = element("created-assignments-container");
    const rows = visibleAssignments();
    if (!rows.length) {
      container.innerHTML = assignments.length
        ? '<div class="creator-workspace__empty">No lessons match this topic.</div>'
        : `<div class="creator-workspace__empty">${teacherView
          ? "No assignments exist yet."
          : "You are not listed as the creator of any assignments yet."}</div>`;
      return;
    }

    container.innerHTML = `
      <table class="submissions-table ocs__table">
        <thead><tr>
          <th>Assignment</th><th>Courses</th><th>Topics</th><th>Due date</th><th>Points</th><th>Submissions</th><th>Creators</th>
        </tr></thead>
        <tbody>${rows.map((assignment) => {
          const count = submissions.filter((submission) =>
            String(submission.assignmentId) === String(assignment.id)).length;
          return `<tr>
            <td>${assignmentLink(assignment)}</td>
            <td><span class="creator-course-list">${courseList(assignment.courseCodes)}</span></td>
            <td><span class="creator-course-list">${topicList(assignment.topics)}</span></td>
            <td>${text(assignment.dueDate, "Not set")}</td>
            <td>${text(assignment.points, "Not set")}</td>
            <td><button type="button" class="creator-assignment-count" data-assignment-id="${text(assignment.id)}" aria-label="Show ${count} submissions for ${text(assignment.name, "this assignment")}">${count}</button></td>
            <td>${text((assignment.creatorUids || []).join(", "), "Unassigned")}</td>
          </tr>`;
        }).join("")}</tbody>
      </table>`;
  }

  // The assignment list follows the topic, so it never offers a lesson the topic hides.
  function populateAssignmentFilter() {
    const assignmentFilter = element("creator-filter-assignment");
    const selected = assignmentFilter.value;
    const rows = visibleAssignments();
    assignmentFilter.innerHTML = '<option value="">All assignments</option>'
      + rows.map((assignment) =>
        `<option value="${text(assignment.id)}">${text(assignment.name, "Untitled assignment")}</option>`)
        .join("");
    assignmentFilter.value = rows.some((assignment) => String(assignment.id) === selected) ? selected : "";
  }

  function populateFilters() {
    const courseFilter = element("creator-filter-course");
    const topics = [...new Set(assignments.flatMap((assignment) => assignment.topics || []))]
      .sort((left, right) => left.localeCompare(right));
    element("creator-filter-topic").innerHTML = '<option value="">All topics</option>'
      + topics.map((topic) => `<option value="${text(topic)}">${text(topic)}</option>`).join("");
    populateAssignmentFilter();

    const courses = new Set();
    let hasUnassigned = false;
    submissions.forEach((submission) => {
      const memberships = submission.submitterCourseCodes || [];
      if (!memberships.length) hasUnassigned = true;
      memberships.forEach((course) => courses.add(course));
    });
    const courseOptions = [...courses].sort().map((course) =>
      `<option value="${text(course)}">${text(course)}</option>`);
    if (hasUnassigned) {
      courseOptions.push(`<option value="${UNASSIGNED_COURSE}">Unassigned</option>`);
    }
    courseFilter.innerHTML = '<option value="">All student courses</option>' + courseOptions.join("");
  }

  function filteredSubmissions() {
    const course = element("creator-filter-course").value;
    const assignmentId = element("creator-filter-assignment").value;
    const student = element("creator-filter-student").value.trim().toLowerCase();
    const status = element("creator-filter-status").value;
    const topicAssignmentIds = element("creator-filter-topic").value
      ? new Set(visibleAssignments().map((assignment) => String(assignment.id)))
      : null;

    return filterCreatorSubmissions(
      submissions,
      { course, assignmentId, student, status, topicAssignmentIds },
      getFilterStatus,
    );
  }

  function renderSubmissionTable(rows) {
    const container = element("creator-submissions-container");
    if (!rows.length) {
      container.innerHTML = '<div class="creator-workspace__empty">No submissions match the current filters.</div>';
      return;
    }

    container.innerHTML = `
      <table class="submissions-table creator-submissions-table ocs__table">
        <thead><tr>
          <th>Student</th><th>Student course</th><th>Assignment</th><th>Submission</th><th>Status</th><th>Grade</th><th>Feedback</th><th>AI summary</th><th>Quality</th>
        </tr></thead>
        <tbody>${rows.map((submission) => {
          const points = assignmentPoints(submission);
          // Grading actions only until the assignment closes.
          const final = isFinal(submission);
          const pills = gradePills(submission, escapeHtml);
          const grade = `
            <input class="ocs__input creator-grade-input" type="number" min="0" step="0.01"
              ${points != null ? `max="${text(points)}"` : ""}
              value="${text(submission.grade ?? "")}"
              placeholder="${points != null ? `0–${text(points)}` : "Points"}"
              aria-label="Grade for ${text(submission.submitterName, "this student")}"
              ${final ? "readonly" : ""}
              data-grade-input>
            ${pills ? `<div>${pills}</div>` : ""}`;
          const actions = final ? "" : `
              <button type="button" class="ocs__btn small accent fill" data-save-grade="${text(submission.id)}">Save grade</button>
              <button type="button" class="ocs__btn small" data-ai-regrade="${text(submission.id)}"
                title="Ask the AI to grade this again">AI re-grade</button>
              ${hasManualOverride(submission)
                ? `<button type="button" class="ocs__btn small" data-clear-grade="${text(submission.id)}"
                    title="Remove your grade so the AI grade applies">Use AI grade</button>`
                : ""}`;
          const feedback = `
            <textarea class="ocs__input creator-feedback-input" rows="2" placeholder="Feedback"
              aria-label="Feedback for ${text(submission.submitterName, "this student")}"
              ${final ? "readonly" : ""}
              data-feedback-input>${text(submission.feedback ?? "")}</textarea>
            <div class="ocs__links">${actions}
              <button type="button" class="ocs__btn small" data-grading-history="${text(submission.id)}">History</button>
            </div>
            <small class="creator-grade-status" role="status" data-grade-status></small>`;
          return `<tr>
            <td><strong>${text(submission.submitterName, "Unknown")}</strong><span class="creator-student-uid">${text(submission.submitterUid)}</span></td>
            <td><span class="creator-course-list">${courseList(submission.submitterCourseCodes)}</span></td>
            <td>${assignmentLink({ name: submission.assignmentName, contentUrl: submission.assignmentContentUrl })}</td>
            <td><div class="cell-clamp">${renderContent(submission.content)}</div></td>
            <td>${getStatusBadge(submission)}</td>
            <td>${grade}</td>
            <td>${feedback}</td>
            <td><div class="cell-clamp"${cellTitle(submission.aiSummary)}>${renderAiSummary(submission)}</div></td>
            <td>${renderQualityScore(submission)}</td>
          </tr>`;
        }).join("")}</tbody>
      </table>`;
  }

  function assignmentPoints(submission) {
    const assignment = assignments.find((current) => String(current.id) === String(submission.assignmentId));
    return assignment?.points ?? null;
  }

  function submissionFor(id) {
    return submissions.find((current) => String(current.id) === String(id));
  }

  async function saveGrade(button) {
    const row = button.closest("tr");
    const status = row.querySelector("[data-grade-status]");
    const submission = submissionFor(button.dataset.saveGrade);
    if (!submission) return;

    const { grade, error } = parseGradeInput(row.querySelector("[data-grade-input]").value, assignmentPoints(submission));
    if (error) {
      status.textContent = error;
      return;
    }
    await runGradingAction(button, status, submission, () => saveManualGrade({
      javaURI,
      fetchOptions,
      submissionId: submission.id,
      grade,
      feedback: row.querySelector("[data-feedback-input]").value,
      revision: submission.grading?.revision,
    }));
  }

  async function clearGrade(button) {
    const status = button.closest("tr").querySelector("[data-grade-status]");
    const submission = submissionFor(button.dataset.clearGrade);
    if (!submission) return;
    await runGradingAction(button, status, submission, () => clearManualGrade({
      javaURI,
      fetchOptions,
      submissionId: submission.id,
      revision: submission.grading?.revision,
    }));
  }

  async function aiRegrade(button) {
    const status = button.closest("tr").querySelector("[data-grade-status]");
    const submission = submissionFor(button.dataset.aiRegrade);
    if (!submission) return;
    await runGradingAction(button, status, submission, () => requestAiRegrade({
      javaURI,
      fetchOptions,
      submissionId: submission.id,
    }));
  }

  async function runGradingAction(button, status, submission, action) {
    button.disabled = true;
    status.textContent = "Working…";
    try {
      const result = await action();
      if (!result.ok) {
        // Keep the old revision so a stale save keeps failing until the page is reloaded.
        status.textContent = result.message;
        button.disabled = false;
        return;
      }
      applyGradingState(submission, result.grading);
      renderSubmissions();
    } catch (saveError) {
      status.textContent = `Could not save grade: ${saveError.message}`;
      button.disabled = false;
    }
  }

  // One request at a time: the AI grader is metered and rate limited per minute.
  async function rerunAiGrading(button) {
    const status = element("creator-bulk-ai-status");
    const candidates = aiRegradeCandidates(filteredSubmissions());
    if (!candidates.length) {
      status.textContent = "Nothing to re-grade: every filtered submission is final or has an instructor grade.";
      return;
    }
    const noun = `submission${candidates.length === 1 ? "" : "s"}`;
    if (!window.confirm(`Re-run AI grading on ${candidates.length} filtered ${noun}? `
      + "Instructor grades and closed assignments are skipped.")) return;

    button.disabled = true;
    let graded = 0;
    const failures = [];
    for (const [index, submission] of candidates.entries()) {
      status.textContent = `Re-grading ${index + 1} of ${candidates.length}…`;
      try {
        const result = await requestAiRegrade({ javaURI, fetchOptions, submissionId: submission.id });
        if (result.ok) {
          applyGradingState(submission, result.grading);
          graded += 1;
        } else {
          failures.push(`${submission.submitterName || submission.id}: ${result.message}`);
        }
      } catch (regradeError) {
        failures.push(`${submission.submitterName || submission.id}: ${regradeError.message}`);
      }
    }
    renderSubmissions();
    status.textContent = `AI re-graded ${graded} of ${candidates.length} ${noun}.`
      + (failures.length ? ` ${failures.length} failed: ${failures.slice(0, 3).join("; ")}`
        + (failures.length > 3 ? "…" : "") : "");
    button.disabled = false;
  }

  function renderPagination(totalRows, totalPages) {
    const pagination = element("creator-pagination");
    if (totalPages <= 1) {
      pagination.innerHTML = "";
      return;
    }
    pagination.innerHTML = `
      <button type="button" class="ocs__btn medium" data-page="previous" ${currentPage === 1 ? "disabled" : ""}>Previous</button>
      <span>Page ${currentPage} of ${totalPages} · ${totalRows} results</span>
      <button type="button" class="ocs__btn medium" data-page="next" ${currentPage === totalPages ? "disabled" : ""}>Next</button>`;
  }

  function renderSubmissions() {
    const filtered = filteredSubmissions();
    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    currentPage = Math.min(currentPage, totalPages);
    const start = (currentPage - 1) * PAGE_SIZE;
    const visibleRows = filtered.slice(start, start + PAGE_SIZE);
    const pending = filtered.filter((submission) => getFilterStatus(submission) === "pending").length;
    const late = filtered.filter((submission) => getFilterStatus(submission) === "late").length;
    const graded = filtered.filter((submission) => getFilterStatus(submission) === "graded").length;

    element("creator-results-summary").textContent =
      `${filtered.length} submission${filtered.length === 1 ? "" : "s"} · ${pending} pending · ${late} late · ${graded} graded`;
    renderSubmissionTable(visibleRows);
    renderPagination(filtered.length, totalPages);
  }

  function bindInteractions() {
    element("creator-submission-filters").addEventListener("submit", (event) => event.preventDefault());
    element("creator-filter-topic").addEventListener("input", () => {
      populateAssignmentFilter();
      renderAssignments();
    });
    element("creator-bulk-ai-regrade").addEventListener("click", (event) => rerunAiGrading(event.currentTarget));
    ["creator-filter-course", "creator-filter-assignment", "creator-filter-student", "creator-filter-status"]
      .forEach((id) => element(id).addEventListener("input", () => {
        currentPage = 1;
        renderSubmissions();
      }));

    element("creator-clear-filters").addEventListener("click", () => {
      element("creator-submission-filters").reset();
      populateAssignmentFilter();
      renderAssignments();
      currentPage = 1;
      renderSubmissions();
    });

    element("created-assignments-container").addEventListener("click", (event) => {
      const button = event.target.closest("[data-assignment-id]");
      if (!button) return;
      element("creator-filter-assignment").value = button.dataset.assignmentId;
      currentPage = 1;
      renderSubmissions();
      element("creator-submission-list-title").scrollIntoView({
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
        block: "start",
      });
    });

    element("creator-submissions-container").addEventListener("click", (event) => {
      const button = event.target.closest("[data-save-grade], [data-clear-grade], [data-ai-regrade], [data-grading-history]");
      if (!button || button.disabled) return;
      if (button.dataset.saveGrade) saveGrade(button);
      else if (button.dataset.clearGrade) clearGrade(button);
      else if (button.dataset.aiRegrade) aiRegrade(button);
      else {
        const submission = submissionFor(button.dataset.gradingHistory);
        showGradingHistory({
          javaURI,
          fetchOptions,
          submissionId: button.dataset.gradingHistory,
          title: `${submission?.submitterName || "Submission"} · ${submission?.assignmentName || ""}`,
          points: submission ? assignmentPoints(submission) : null,
          escapeHtml,
        });
      }
    });

    element("creator-pagination").addEventListener("click", (event) => {
      const button = event.target.closest("[data-page]");
      if (!button || button.disabled) return;
      currentPage += button.dataset.page === "next" ? 1 : -1;
      renderSubmissions();
      element("creator-submission-list-title").scrollIntoView({
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
        block: "start",
      });
    });
  }

  // Teachers manage every lesson, so the tab becomes a teacher dashboard rather than "yours".
  function showTeacherLabels() {
    element("tab-created-assignments").textContent = "Teacher Dashboard";
    element("creator-workspace-eyebrow").textContent = "Teacher dashboard";
    element("creator-workspace-title").textContent = "All lessons";
    element("creator-workspace-description").textContent =
      "Review every assignment and the submissions received from students.";
    element("creator-assignment-list-title").textContent = "Lessons";
  }

  /**
   * @param {string} currentUsername
   * @param {{ isTeacher?: boolean }} options teachers and admins see every assignment,
   *        matching what Spring's /managed endpoints return for them
   */
  async function load(currentUsername, { isTeacher = false } = {}) {
    teacherView = isTeacher;
    if (teacherView) showTeacherLabels();
    try {
      const [assignmentsResponse, submissionsResponse, manifestResponse] = await Promise.all([
        fetch(managedAssignmentsUrl, fetchOptions),
        fetch(managedSubmissionsUrl, fetchOptions),
        fetch(courseManifestUrl, { cache: "no-store" }).catch(() => null),
      ]);
      if (!assignmentsResponse.ok) {
        throw new Error(`Could not load managed assignments (HTTP ${assignmentsResponse.status})`);
      }
      if (!submissionsResponse.ok) {
        throw new Error(`Could not load managed submissions (HTTP ${submissionsResponse.status})`);
      }

      const assignmentData = await assignmentsResponse.json();
      const submissionData = await submissionsResponse.json();
      const manifest = manifestResponse?.ok ? await manifestResponse.json().catch(() => []) : [];
      assignments = withFrontmatterCourses(Array.isArray(assignmentData) ? assignmentData : [], manifest)
        .filter((assignment) => teacherView || (
          currentUsername
          && Array.isArray(assignment.creatorUids)
          && assignment.creatorUids.includes(currentUsername)))
        .sort((left, right) => String(left.name || "").localeCompare(String(right.name || "")));
      const ownedIds = new Set(assignments.map((assignment) => String(assignment.id)));
      submissions = (Array.isArray(submissionData) ? submissionData : []).filter((submission) =>
        ownedIds.has(String(submission.assignmentId)));

      element("creator-dashboard-summary").textContent =
        `${assignments.length} ${teacherView ? "lessons" : "owned"} · ${submissions.length} submission${submissions.length === 1 ? "" : "s"}`;
      renderAssignments();
      populateFilters();
      renderSubmissions();
      bindInteractions();
      element("created-assignments-content").hidden = false;
    } catch (error) {
      const errorElement = element("created-assignments-error");
      errorElement.textContent = error.message || "Unable to load creator submissions.";
      errorElement.hidden = false;
    } finally {
      element("created-assignments-loading").hidden = true;
    }
  }

  return { load };
}
