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

export function withFrontmatterCourses(assignments, manifest) {
  const coursesByUrl = new Map();
  for (const entry of Array.isArray(manifest) ? manifest : []) {
    const url = String(entry?.contentUrl || "").replace(/^\/+|\/+$/g, "");
    if (!url || !Array.isArray(entry?.courseCodes)) continue;
    const codes = [...new Set(entry.courseCodes.map((code) => String(code).trim().toUpperCase()))]
      .filter(Boolean);
    if (codes.length) coursesByUrl.set(url, codes);
  }
  return assignments.map((assignment) => ({
    ...assignment,
    // Frontmatter is authoritative for the visible label; Spring remains authoritative for access.
    courseCodes: coursesByUrl.get(String(assignment.contentUrl || "").replace(/^\/+|\/+$/g, ""))
      || assignment.courseCodes,
  }));
}

export function filterCreatorSubmissions(submissions, filters, getFilterStatus) {
  const { course = "", assignmentId = "", student = "", status = "" } = filters;
  const studentQuery = student.trim().toLowerCase();

  return submissions.filter((submission) => {
    const memberships = submission.submitterCourseCodes || [];
    const courseMatches = !course
      || (course === UNASSIGNED_COURSE ? memberships.length === 0 : memberships.includes(course));
    const assignmentMatches = !assignmentId || String(submission.assignmentId) === assignmentId;
    const studentText = `${submission.submitterName || ""} ${submission.submitterUid || ""}`.toLowerCase();
    const studentMatches = !studentQuery || studentText.includes(studentQuery);
    const statusMatches = !status || getFilterStatus(submission) === status;
    return courseMatches && assignmentMatches && studentMatches && statusMatches;
  }).sort((left, right) => {
    const assignmentOrder = String(left.assignmentName || "").localeCompare(String(right.assignmentName || ""));
    return assignmentOrder || String(left.submitterName || "").localeCompare(String(right.submitterName || ""));
  });
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

// AI grading writes identical feedback and aiSummary; older manual grades predate the flag,
// so a grade that matches neither rule gets no label instead of a guessed one.
export function gradeSourceLabel(submission) {
  if (submission?.grade == null) return "";
  if (submission.gradedManually) return "Instructor grade";
  if (submission.feedback && submission.feedback === submission.aiSummary) return "AI grade";
  return "";
}

export function createCreatorDashboard(options) {
  const {
    managedAssignmentsUrl,
    managedSubmissionsUrl,
    gradeSubmissionUrl,
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

  function renderAssignments() {
    const container = element("created-assignments-container");
    if (!assignments.length) {
      container.innerHTML = '<div class="creator-workspace__empty">You are not listed as the creator of any assignments yet.</div>';
      return;
    }

    container.innerHTML = `
      <table class="submissions-table ocs__table">
        <thead><tr>
          <th>Assignment</th><th>Courses</th><th>Due date</th><th>Points</th><th>Submissions</th><th>Creators</th>
        </tr></thead>
        <tbody>${assignments.map((assignment) => {
          const count = submissions.filter((submission) =>
            String(submission.assignmentId) === String(assignment.id)).length;
          return `<tr>
            <td>${assignmentLink(assignment)}</td>
            <td><span class="creator-course-list">${courseList(assignment.courseCodes)}</span></td>
            <td>${text(assignment.dueDate, "Not set")}</td>
            <td>${text(assignment.points, "Not set")}</td>
            <td><button type="button" class="creator-assignment-count" data-assignment-id="${text(assignment.id)}" aria-label="Show ${count} submissions for ${text(assignment.name, "this assignment")}">${count}</button></td>
            <td>${text((assignment.creatorUids || []).join(", "), "Unassigned")}</td>
          </tr>`;
        }).join("")}</tbody>
      </table>`;
  }

  function populateFilters() {
    const assignmentFilter = element("creator-filter-assignment");
    const courseFilter = element("creator-filter-course");

    assignmentFilter.innerHTML = '<option value="">All assignments</option>'
      + assignments.map((assignment) =>
        `<option value="${text(assignment.id)}">${text(assignment.name, "Untitled assignment")}</option>`)
        .join("");

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

    return filterCreatorSubmissions(
      submissions,
      { course, assignmentId, student, status },
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
          const source = gradeSourceLabel(submission);
          const grade = `
            <input class="ocs__input creator-grade-input" type="number" min="0" step="0.01"
              ${points != null ? `max="${text(points)}"` : ""}
              value="${text(submission.grade ?? "")}"
              placeholder="${points != null ? `0–${text(points)}` : "Points"}"
              aria-label="Grade for ${text(submission.submitterName, "this student")}"
              data-grade-input>
            ${source ? `<small class="creator-grade-source">${text(source)}</small>` : ""}`;
          const feedback = `
            <textarea class="ocs__input creator-feedback-input" rows="2" placeholder="Feedback"
              aria-label="Feedback for ${text(submission.submitterName, "this student")}"
              data-feedback-input>${text(submission.feedback ?? "")}</textarea>
            <div class="creator-grade-actions">
              <button type="button" class="ocs__btn small accent fill" data-save-grade="${text(submission.id)}">Save grade</button>
              <small class="creator-grade-status" role="status" data-grade-status></small>
            </div>`;
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

  // Saving marks the grade as manual on the server, so the AI will not replace it later.
  async function saveGrade(button) {
    const row = button.closest("tr");
    const status = row.querySelector("[data-grade-status]");
    const submission = submissions.find((current) => String(current.id) === button.dataset.saveGrade);
    if (!submission) return;

    const { grade, error } = parseGradeInput(row.querySelector("[data-grade-input]").value, assignmentPoints(submission));
    if (error) {
      status.textContent = error;
      return;
    }
    const feedback = row.querySelector("[data-feedback-input]").value;

    button.disabled = true;
    status.textContent = "Saving…";
    try {
      const query = new URLSearchParams({ grade: String(grade), feedback });
      const response = await fetch(`${gradeSubmissionUrl}/${encodeURIComponent(submission.id)}?${query}`, {
        ...fetchOptions,
        method: "POST",
      });
      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        throw new Error(body.error || body.message || `HTTP ${response.status}`);
      }
      Object.assign(submission, { grade, feedback, gradedManually: true });
      renderSubmissions();
    } catch (saveError) {
      status.textContent = `Could not save grade: ${saveError.message}`;
      button.disabled = false;
    }
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
    ["creator-filter-course", "creator-filter-assignment", "creator-filter-student", "creator-filter-status"]
      .forEach((id) => element(id).addEventListener("input", () => {
        currentPage = 1;
        renderSubmissions();
      }));

    element("creator-clear-filters").addEventListener("click", () => {
      element("creator-submission-filters").reset();
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
      const button = event.target.closest("[data-save-grade]");
      if (button && !button.disabled) saveGrade(button);
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

  async function load(currentUsername) {
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
        .filter((assignment) =>
        currentUsername
        && Array.isArray(assignment.creatorUids)
        && assignment.creatorUids.includes(currentUsername));
      const ownedIds = new Set(assignments.map((assignment) => String(assignment.id)));
      submissions = (Array.isArray(submissionData) ? submissionData : []).filter((submission) =>
        ownedIds.has(String(submission.assignmentId)));

      element("creator-dashboard-summary").textContent =
        `${assignments.length} owned · ${submissions.length} submission${submissions.length === 1 ? "" : "s"}`;
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
