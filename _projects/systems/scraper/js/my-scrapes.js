document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("my-scrapes-app");
  if (!container) return;

  container.innerHTML = `
    <div class="scraper-card">
      <h2 class="scraper-title">My Scrapes</h2>
      <p class="scraper-subtitle">
        Scrape results you saved from the runner. Saving is separate from running - a run
        only shows up here once you click "Save Results" on it.
      </p>
      <div id="my-scrapes-status" class="scraper-status" aria-live="polite">Loading...</div>
      <ul id="my-scrapes-list" class="my-scrapes-list"></ul>
      <div id="my-scrapes-detail"></div>
    </div>
  `;

  const statusEl = document.getElementById("my-scrapes-status");
  const listEl = document.getElementById("my-scrapes-list");
  const detailEl = document.getElementById("my-scrapes-detail");

  function resolveEndpoint(path) {
    try {
      if (window.javaURI && typeof window.javaURI === "string" && window.javaURI.length > 0) {
        return window.javaURI.replace(/\/+$/, "") + path;
      }
    } catch (_) {
      // Fallback stays as a relative path.
    }
    return path;
  }

  function formatDate(isoString) {
    if (!isoString) return "";
    const date = new Date(isoString);
    if (Number.isNaN(date.getTime())) return isoString;
    return date.toLocaleString();
  }

  async function loadList() {
    statusEl.textContent = "Loading...";
    listEl.innerHTML = "";
    detailEl.innerHTML = "";

    try {
      const res = await fetch(resolveEndpoint("/api/scraper/results"), {
        credentials: "include"
      });

      if (res.status === 401) {
        statusEl.textContent = "Please log in to see your saved scrapes.";
        return;
      }
      if (!res.ok) {
        statusEl.textContent = `Could not load saved scrapes (${res.status}).`;
        return;
      }

      const results = await res.json();
      if (!Array.isArray(results) || results.length === 0) {
        statusEl.textContent = "You have not saved any scrapes yet.";
        return;
      }

      statusEl.textContent = `${results.length} saved scrape${results.length === 1 ? "" : "s"}.`;
      results.forEach((result) => listEl.appendChild(renderListItem(result)));
    } catch (err) {
      statusEl.textContent = `Network error while loading: ${String(err)}`;
    }
  }

  function renderListItem(result) {
    const li = document.createElement("li");
    li.className = "my-scrapes-item";
    li.innerHTML = `
      <div class="my-scrapes-item-main">
        <span class="my-scrapes-item-label">${escapeHtml(result.label)}</span>
        <span class="my-scrapes-item-meta">
          ${escapeHtml(result.sourceUrl || "")} · ${result.itemCount} item${result.itemCount === 1 ? "" : "s"} ·
          ${formatDate(result.createdAt)}
        </span>
      </div>
      <div class="my-scrapes-item-actions">
        <button type="button" class="scraper-button scraper-button-secondary" data-action="view">View</button>
        <button type="button" class="scraper-button scraper-button-secondary" data-action="delete">Delete</button>
      </div>
    `;

    li.querySelector('[data-action="view"]').addEventListener("click", () => viewDetail(result.id));
    li.querySelector('[data-action="delete"]').addEventListener("click", () => deleteResult(result.id, li));
    return li;
  }

  async function viewDetail(id) {
    detailEl.innerHTML = `<pre class="scraper-response"><code>// Loading...</code></pre>`;

    try {
      const res = await fetch(resolveEndpoint(`/api/scraper/results/${id}`), {
        credentials: "include"
      });

      if (!res.ok) {
        detailEl.innerHTML = `<p class="scraper-error">Could not load this saved scrape (${res.status}).</p>`;
        return;
      }

      const detail = await res.json();
      detailEl.innerHTML = `
        <div class="scraper-section">
          <div class="scraper-section-header"><span>${escapeHtml(detail.label)} - request</span></div>
          <pre class="scraper-response"><code>${escapeHtml(JSON.stringify(detail.request, null, 2))}</code></pre>
        </div>
        <div class="scraper-section">
          <div class="scraper-section-header"><span>${escapeHtml(detail.label)} - response</span></div>
          <pre class="scraper-response"><code>${escapeHtml(JSON.stringify(detail.response, null, 2))}</code></pre>
        </div>
      `;
    } catch (err) {
      detailEl.innerHTML = `<p class="scraper-error">Network error while loading: ${escapeHtml(String(err))}</p>`;
    }
  }

  async function deleteResult(id, li) {
    if (!window.confirm("Delete this saved scrape? This cannot be undone.")) return;

    try {
      const res = await fetch(resolveEndpoint(`/api/scraper/results/${id}`), {
        method: "DELETE",
        credentials: "include"
      });

      if (!res.ok) {
        window.alert(`Could not delete (${res.status}).`);
        return;
      }

      li.remove();
      detailEl.innerHTML = "";
      if (!listEl.children.length) {
        statusEl.textContent = "You have not saved any scrapes yet.";
      }
    } catch (err) {
      window.alert(`Network error while deleting: ${String(err)}`);
    }
  }

  function escapeHtml(value) {
    const div = document.createElement("div");
    div.textContent = value == null ? "" : String(value);
    return div.innerHTML;
  }

  loadList();
});

// Minimal scoped styles for the list, kept separate from scraper.js's own injection so this
// page works even when scraper.js is not also loaded. Shares class names with scraper.js
// (.scraper-card, .scraper-button, .scraper-response, etc.) for a consistent look; harmless
// if both scripts happen to load on the same page since each checks before injecting twice.
(function injectMyScrapesStyles() {
  if (document.getElementById("my-scrapes-style-tag")) return;
  const style = document.createElement("style");
  style.id = "my-scrapes-style-tag";
  style.textContent = `
    .scraper-card {
      max-width: 960px;
      margin: 1.5rem auto;
      padding: 1.5rem;
      border-radius: 0.75rem;
      border: 1px solid #e2e8f0;
      background: #ffffff;
      box-shadow: 0 10px 25px rgba(15, 23, 42, 0.08);
      font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    }
    .scraper-title {
      margin: 0 0 0.25rem;
      font-size: 1.4rem;
      font-weight: 650;
      color: #0f172a;
    }
    .scraper-subtitle {
      margin: 0 0 1rem;
      font-size: 0.9rem;
      color: #64748b;
    }
    .scraper-status {
      font-size: 0.85rem;
      color: #64748b;
      margin-bottom: 0.75rem;
    }
    .scraper-error {
      font-size: 0.85rem;
      color: #b91c1c;
    }
    .scraper-button {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 0.4rem 0.8rem;
      border-radius: 999px;
      border: none;
      background: linear-gradient(135deg, #0ea5e9, #22c55e);
      color: white;
      font-size: 0.8rem;
      font-weight: 600;
      cursor: pointer;
    }
    .scraper-button-secondary {
      background: #e2e8f0;
      color: #0f172a;
    }
    .scraper-section {
      margin-top: 1rem;
    }
    .scraper-section-header {
      font-size: 0.85rem;
      font-weight: 600;
      color: #1e293b;
      margin-bottom: 0.35rem;
    }
    .scraper-response {
      padding: 0.75rem 0.9rem;
      border-radius: 0.5rem;
      background: #020617;
      color: #e5e7eb;
      font-size: 0.8rem;
      line-height: 1.4;
      overflow-x: auto;
      max-height: 420px;
    }
    .scraper-response code {
      white-space: pre;
    }
    .my-scrapes-list {
      list-style: none;
      margin: 0;
      padding: 0;
    }
    .my-scrapes-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
      padding: 0.75rem 0;
      border-bottom: 1px solid #e2e8f0;
      flex-wrap: wrap;
    }
    .my-scrapes-item-main {
      display: flex;
      flex-direction: column;
      gap: 0.15rem;
    }
    .my-scrapes-item-label {
      font-weight: 600;
      color: #0f172a;
      font-size: 0.9rem;
    }
    .my-scrapes-item-meta {
      font-size: 0.78rem;
      color: #64748b;
    }
    .my-scrapes-item-actions {
      display: flex;
      gap: 0.5rem;
    }
    @media (max-width: 768px) {
      .scraper-card {
        margin: 1rem;
        padding: 1.1rem;
      }
    }
  `;
  document.head.appendChild(style);
})();
