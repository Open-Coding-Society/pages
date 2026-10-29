(() => {
  const board = document.querySelector("[data-sph-board]");
  if (!board) return;

  const issueSearchUrl = "https://api.github.com/search/issues?q=project%3AYimingYin1213%2F7&per_page=100";
  const initialCardLimit = 5;
  const boardColumns = [
    { name: "Parking Lot", countLabel: "3/5", cards: [
      [10, "Support Simulation – Frontend Page"],
      [8, "Support Simulation – Scenario Data"],
      [9, "Support Simulation – API Routes"],
    ] },
    { name: "Todo", countLabel: "4", cards: [
      [7, "CPT requirements - Yiming Yin"],
      [16, "Luke Sanders Project Phase Define"],
      [6, "Identify the Relationship to Backend and Brainstorm Improvements"],
      [15, "Safe Passage Heals 2.0 – Team Capstone Plan"],
    ] },
    { name: "In progress", countLabel: "2/3", cards: [
      [2, "Issue 1 — Set Up Flask Backend and SQLite Database"],
      [4, "Repository verification"],
    ] },
    { name: "In Review", countLabel: "2", cards: [
      [1, "Set up backend and frontend"],
      [5, "Understanding this Repository Structure"],
    ] },
    { name: "PR", countLabel: "0", cards: [] },
    { name: "Done", countLabel: "3", cards: [
      [11, "CPT Requirements – Support Simulation (Noor)"],
      [14, "CPT Concepts Requirements- Luke Sanders"],
      [12, "How can I improve myself? – Yiming Yin"],
    ] },
    { name: "Information", countLabel: "2", cards: [
      [3, "About this repository - Yiming Yin"],
      [13, "Collegeboard AP CSP Vocabulary Table"],
    ] },
  ];
  const snapshotCards = boardColumns.flatMap((column) => column.cards.map(([number, title]) => ({
    number,
    title,
    status: column.name,
    repository_url: "https://api.github.com/repos/YimingYin1213/flaskandfurious",
    html_url: `https://github.com/YimingYin1213/flaskandfurious/issues/${number}`,
    labels: [],
    assignees: [],
    body: "",
    updated_at: "",
  })));
  const state = { issues: snapshotCards, area: "all", expanded: new Set() };
  const columns = board.querySelector("[data-sph-columns]");
  const status = board.querySelector("[data-sph-status]");
  const total = board.querySelector("[data-sph-total]");
  const visibleTotal = board.querySelector("[data-sph-visible]");
  const lastChange = board.querySelector("[data-sph-updated]");

  function labelName(label) {
    return typeof label === "string" ? label : label.name;
  }

  function matchingLabel(labels, expression) {
    return labels.map(labelName).find((name) => expression.test(name));
  }

  function getPriority(issue) {
    const label = matchingLabel(issue.labels || [], /^(?:priority\s*:?\s*)?(low|medium|high)$/i);
    return label ? label.match(/low|medium|high/i)[0].toLowerCase() : "Not set";
  }

  function getTopic(issue) {
    const labels = issue.labels || [];
    const label = labels.map(labelName).find((name) => !/^(?:priority|status|area|topic)\s*:/i.test(name)
      && !/^(low|medium|high|parking lot|todo|in progress|in review|pr|done|information)$/i.test(name));
    if (label) return label.replace(/^topic\s*:\s*/i, "");
    const topicLabel = matchingLabel(labels, /^topic\s*:/i);
    return topicLabel ? topicLabel.replace(/^topic\s*:\s*/i, "") : "General";
  }

  function getArea(issue) {
    const labels = issue.labels || [];
    const label = matchingLabel(labels, /^(?:area\s*:\s*)?(frontend|backend)$/i);
    if (label) return label.match(/frontend|backend/i)[0].toLowerCase();
    const repoName = (issue.repository_url || "").split("/").pop().toLowerCase();
    if (repoName.includes("backend")) return "backend";
    if (repoName.includes("frontend")) return "frontend";
    const titlePrefix = issue.title.match(/^\[(frontend|backend)\]/i);
    if (titlePrefix) return titlePrefix[1].toLowerCase();
    if (/backend|sqlite|api routes/i.test(issue.title)) return "backend";
    return "frontend";
  }

  function displayAssignees(issue) {
    if (issue.assignees?.length) return issue.assignees.map((assignee) => assignee.name || assignee.login).join(", ");
    if (issue.assignee?.login) return issue.assignee.name || issue.assignee.login;
    return "Unassigned";
  }

  function createCard(issue) {
    const card = document.createElement("a");
    card.className = "ocs__grid-cell sph-board__issue";
    card.href = issue.html_url;
    card.target = "_blank";
    card.rel = "noreferrer noopener";
    card.setAttribute("aria-label", `${issue.title}; assignee ${displayAssignees(issue)}; priority ${getPriority(issue)}; topic ${getTopic(issue)}`);

    const meta = document.createElement("div");
    meta.className = "sph-board__issue-meta";
    const area = getArea(issue);
    meta.textContent = `${area === "backend" ? "Backend" : "Frontend"} · #${issue.number}`;
    card.append(meta);

    const title = document.createElement("strong");
    title.className = "sph-board__issue-title";
    title.textContent = issue.title;
    card.append(title);

    const assignee = document.createElement("div");
    assignee.className = "sph-board__assignee";
    assignee.textContent = displayAssignees(issue);
    card.append(assignee);

    const priorityValue = getPriority(issue);
    const priority = document.createElement("div");
    priority.className = `sph-board__priority sph-board__priority--${priorityValue.replace(/\s/g, "-")}`;
    priority.textContent = `Priority: ${priorityValue}`;
    card.append(priority);

    const topic = document.createElement("div");
    topic.className = "sph-board__topic";
    topic.textContent = `Topic: ${getTopic(issue)}`;
    card.append(topic);

    const checklistItems = issue.body?.match(/^\s*-\s+\[[ xX]\]/gm) || [];
    if (checklistItems.length) {
      const completedItems = (issue.body.match(/^\s*-\s+\[[xX]\]/gm) || []).length;
      const checklist = document.createElement("div");
      checklist.className = "sph-board__checklist";
      checklist.textContent = `☑ ${completedItems}/${checklistItems.length}`;
      card.append(checklist);
    }
    return card;
  }

  function createColumn(column) {
    const columnIssues = state.issues.filter((issue) => issue.status === column.name
      && (state.area === "all" || getArea(issue) === state.area));
    const section = document.createElement("section");
    section.className = "sph-board__column";
    section.setAttribute("aria-label", `${column.name}, ${columnIssues.length} issues`);

    const heading = document.createElement("h3");
    heading.className = "sph-board__column-title";
    const title = document.createElement("span");
    title.textContent = column.name;
    heading.append(title);
    const count = document.createElement("span");
    count.className = "sph-board__count";
    count.textContent = state.area === "all" ? column.countLabel : String(columnIssues.length);
    heading.append(count);
    section.append(heading);

    const list = document.createElement("div");
    list.className = "sph-board__issue-list";
    const expanded = state.expanded.has(column.name);
    const visibleIssues = expanded ? columnIssues : columnIssues.slice(0, initialCardLimit);
    visibleIssues.forEach((issue) => list.append(createCard(issue)));
    if (!columnIssues.length) {
      const empty = document.createElement("p");
      empty.className = "sph-board__empty";
      empty.textContent = "Nothing here";
      list.append(empty);
    }
    section.append(list);

    if (columnIssues.length > initialCardLimit) {
      const foldButton = document.createElement("button");
      foldButton.type = "button";
      foldButton.className = "ocs__btn sph-board__fold";
      foldButton.textContent = expanded ? "Show less" : `+ ${columnIssues.length - initialCardLimit} more`;
      foldButton.setAttribute("aria-expanded", String(expanded));
      foldButton.addEventListener("click", () => {
        if (expanded) state.expanded.delete(column.name);
        else state.expanded.add(column.name);
        render();
      });
      section.append(foldButton);
    }
    return section;
  }

  function render() {
    columns.replaceChildren(...boardColumns.map(createColumn));
    const visibleCount = state.issues.filter((issue) => state.area === "all" || getArea(issue) === state.area).length;
    total.textContent = `${state.issues.length} cards`;
    visibleTotal.textContent = state.area === "all" ? "" : `Showing ${visibleCount}`;
  }

  function setLastEdit(issues) {
    const newestUpdate = issues.reduce((newest, issue) => issue.updated_at > newest ? issue.updated_at : newest, "");
    lastChange.textContent = newestUpdate
      ? `Last edit ${new Date(newestUpdate).toLocaleString(undefined, {
        month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit", timeZoneName: "short",
      })}`
      : "Last edit unavailable";
  }

  async function loadIssueDetails() {
    try {
      const response = await fetch(issueSearchUrl, { headers: { Accept: "application/vnd.github+json" } });
      if (!response.ok) throw new Error(`GitHub returned ${response.status}`);
      const result = await response.json();
      if (!Array.isArray(result.items)) throw new Error("GitHub returned an unexpected issue list");
      const details = new Map(result.items.filter((issue) => !issue.pull_request).map((issue) => [issue.number, issue]));
      state.issues = snapshotCards.map((snapshot) => ({ ...snapshot, ...(details.get(snapshot.number) || {}), title: snapshot.title, status: snapshot.status }));
      state.issues = await enrichAssigneeNames(state.issues);
      setLastEdit(state.issues);
      status.textContent = "Board columns and issue placement match the provided GitHub screenshots. Issue cards link to GitHub.";
      render();
    } catch (error) {
      console.error("Safe Passage Heals project board could not load issue details:", error);
      setLastEdit(state.issues);
      status.textContent = "Showing the board snapshot from the provided GitHub screenshots. Open GitHub for current issue details.";
      render();
    }
  }

  async function enrichAssigneeNames(issues) {
    const logins = [...new Set(issues.flatMap((issue) => (issue.assignees || []).map((assignee) => assignee.login)
      .concat(issue.assignee?.login ? [issue.assignee.login] : [])))];
    const names = new Map();
    await Promise.all(logins.map(async (login) => {
      try {
        const response = await fetch(`https://api.github.com/users/${encodeURIComponent(login)}`, {
          headers: { Accept: "application/vnd.github+json" },
        });
        if (!response.ok) return;
        const profile = await response.json();
        if (profile.name) names.set(login, profile.name);
      } catch {
        // GitHub login remains a usable assignee label when profile lookup fails.
      }
    }));
    return issues.map((issue) => ({
      ...issue,
      assignees: (issue.assignees || []).map((assignee) => ({ ...assignee, name: names.get(assignee.login) || assignee.login })),
      assignee: issue.assignee ? { ...issue.assignee, name: names.get(issue.assignee.login) || issue.assignee.login } : null,
    }));
  }

  board.querySelectorAll("[data-sph-area]").forEach((button) => {
    button.addEventListener("click", () => {
      state.area = button.dataset.sphArea;
      board.querySelectorAll("[data-sph-area]").forEach((filter) => {
        const selected = filter === button;
        filter.setAttribute("aria-pressed", String(selected));
        filter.classList.toggle("is-selected", selected);
      });
      render();
    });
  });

  render();
  loadIssueDetails();
})();
