const PAGE_SIZE = 25;
const UNASSIGNED_COURSE = "__unassigned__";

export function assignmentPageUrl(baseUrl, contentUrl) {
  if (!contentUrl) return "";
  const normalizedBase = String(baseUrl || "").replace(/\/$/, "");
  const normalizedPath = String(contentUrl).replace(/^\/+|\/+$/g, "");
  return `${normalizedBase}/${normalizedPath}${normalizedPath.endsWith(".html") ? "" : "/"}`;
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

export function createCreatorDashboard(options) {
  const {
    managedAssignmentsUrl,
    managedSubmissionsUrl,
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
      ? `<a class="creator-assignment-link" href="${text(url)}">${name}</a>`
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
      <table class="submissions-table">
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
      <table class="submissions-table creator-submissions-table">
        <thead><tr>
          <th>Student</th><th>Student course</th><th>Assignment</th><th>Submission</th><th>Status</th><th>Grade</th><th>Feedback</th><th>AI summary</th><th>Quality</th>
        </tr></thead>
        <tbody>${rows.map((submission) => {
          const grade = submission.grade == null
            ? '<span class="creator-muted">Not graded</span>'
            : `<span class="grade-display">${text(submission.grade)}</span>`;
          const feedback = submission.feedback
            ? text(submission.feedback)
            : '<span class="creator-muted">No feedback</span>';
          return `<tr>
            <td><strong>${text(submission.submitterName, "Unknown")}</strong><span class="creator-student-uid">${text(submission.submitterUid)}</span></td>
            <td><span class="creator-course-list">${courseList(submission.submitterCourseCodes)}</span></td>
            <td>${assignmentLink({ name: submission.assignmentName, contentUrl: submission.assignmentContentUrl })}</td>
            <td><div class="cell-clamp">${renderContent(submission.content)}</div></td>
            <td>${getStatusBadge(submission)}</td>
            <td>${grade}</td>
            <td><div class="cell-clamp"${cellTitle(submission.feedback)}>${feedback}</div></td>
            <td><div class="cell-clamp"${cellTitle(submission.aiSummary)}>${renderAiSummary(submission)}</div></td>
            <td>${renderQualityScore(submission)}</td>
          </tr>`;
        }).join("")}</tbody>
      </table>`;
  }

  function renderPagination(totalRows, totalPages) {
    const pagination = element("creator-pagination");
    if (totalPages <= 1) {
      pagination.innerHTML = "";
      return;
    }
    pagination.innerHTML = `
      <button type="button" data-page="previous" ${currentPage === 1 ? "disabled" : ""}>Previous</button>
      <span>Page ${currentPage} of ${totalPages} · ${totalRows} results</span>
      <button type="button" data-page="next" ${currentPage === totalPages ? "disabled" : ""}>Next</button>`;
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
