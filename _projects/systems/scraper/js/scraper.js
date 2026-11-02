document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("scraper-app");
  if (!container) return;

  const payloadTemplates = {
    books: {
      url: "https://books.toscrape.com/",
      pagination: {
        type: "nextLink",
        selector: "li.next a",
        attr: "href"
      },
      itemsSelector: "article.product_pod",
      fields: {
        title: { selector: "h3 a", mode: "attr", attr: "title" },
        link: { selector: "h3 a", mode: "attr", attr: "href" },
        price: { selector: ".price_color", mode: "text" },
        availability: { selector: ".instock.availability", mode: "text" },
        ratingClass: { selector: "p.star-rating", mode: "attr", attr: "class" }
      },
      limits: {
        maxPages: 3,
        maxItems: 60,
        maxConcurrency: 6,
        timeoutMs: 15000
      }
    },
    music: {
      url: "https://books.toscrape.com/catalogue/category/books/music_14/index.html",
      pagination: {
        type: "nextLink",
        selector: "li.next a",
        attr: "href"
      },
      itemsSelector: "article.product_pod",
      fields: {
        title: { selector: "h3 a", mode: "attr", attr: "title" },
        detailLink: { selector: "h3 a", mode: "attr", attr: "href" },
        price: { selector: ".price_color", mode: "text" },
        stock: { selector: ".instock.availability", mode: "text" }
      },
      limits: {
        maxPages: 2,
        maxItems: 30,
        maxConcurrency: 4,
        timeoutMs: 15000
      }
    },
    vacation: {
      url: "https://books.toscrape.com/catalogue/category/books/travel_2/index.html",
      pagination: {
        type: "nextLink",
        selector: "li.next a",
        attr: "href"
      },
      itemsSelector: "article.product_pod",
      fields: {
        destinationTitle: { selector: "h3 a", mode: "attr", attr: "title" },
        listingLink: { selector: "h3 a", mode: "attr", attr: "href" },
        budgetPrice: { selector: ".price_color", mode: "text" },
        status: { selector: ".instock.availability", mode: "text" }
      },
      limits: {
        maxPages: 2,
        maxItems: 30,
        maxConcurrency: 4,
        timeoutMs: 15000
      }
    }
  };

  const templateName = (container.dataset.template || "books").toLowerCase();
  const selectedTemplate = payloadTemplates[templateName] || payloadTemplates.books;

  container.innerHTML = `
    <div class="scraper-card">
      <h2 class="scraper-title">Spring Scraper Runner</h2>
      <p class="scraper-subtitle">
        Paste a <code>ScrapeRequest</code> JSON payload and send it to <code>/api/scraper/run</code>.
        You must be logged in so the JWT cookie is sent with the request.
      </p>

      <div class="scraper-section">
        <div class="scraper-section-header">
          <span>Request JSON</span>
          <button type="button" class="scraper-button scraper-button-secondary" id="scraper-load-example">
            Load Example
          </button>
        </div>
        <textarea id="scraper-request" class="scraper-textarea" spellcheck="false" rows="16"></textarea>
        <div id="scraper-request-error" class="scraper-error" aria-live="polite"></div>
      </div>

      <div class="scraper-actions">
        <button type="button" class="scraper-button" id="scraper-run">
          Run Scraper
        </button>
        <span id="scraper-status" class="scraper-status" aria-live="polite"></span>
      </div>

      <div class="scraper-section">
        <div class="scraper-section-header">
          <span>Response</span>
        </div>
        <pre id="scraper-response" class="scraper-response"><code>// Response JSON will appear here</code></pre>
      </div>

      <div class="scraper-section">
        <div class="scraper-section-header">
          <span>Save these results</span>
          <a href="/scraper/my-scrapes/" class="scraper-button scraper-button-secondary">
            My Scrapes
          </a>
        </div>
        <div class="scraper-save-row">
          <input
            type="text"
            id="scraper-save-label"
            class="scraper-save-label-input"
            placeholder="Name this run, e.g. &quot;Music books - first try&quot;"
            disabled
          >
          <button type="button" class="scraper-button" id="scraper-save" disabled>
            Save Results
          </button>
        </div>
        <span id="scraper-save-status" class="scraper-status" aria-live="polite"></span>
      </div>
    </div>
  `;

  const requestInput = document.getElementById("scraper-request");
  const responseOutput = document.getElementById("scraper-response");
  const statusEl = document.getElementById("scraper-status");
  const errorEl = document.getElementById("scraper-request-error");
  const runButton = document.getElementById("scraper-run");
  const exampleButton = document.getElementById("scraper-load-example");
  const examplePayload = selectedTemplate;
  const saveLabelInput = document.getElementById("scraper-save-label");
  const saveButton = document.getElementById("scraper-save");
  const saveStatusEl = document.getElementById("scraper-save-status");

  // Only a successful run's exact payload/response pair is ever saveable - set together
  // right before enabling the button, cleared together the moment a new run starts.
  let lastSavedPayload = null;
  let lastSavedResponse = null;

  function resolveEndpoint(path) {
    // Prefer the same base used everywhere else (javaURI), if available.
    // This makes local dev hit http://localhost:8585<path>.
    try {
      if (window.javaURI && typeof window.javaURI === "string" && window.javaURI.length > 0) {
        return window.javaURI.replace(/\/+$/, "") + path;
      }
    } catch (_) {
      // Fallback stays as a relative path.
    }
    return path;
  }

  if (exampleButton) {
    exampleButton.addEventListener("click", () => {
      if (requestInput) {
        requestInput.value = JSON.stringify(examplePayload, null, 2);
        errorEl.textContent = "";
      }
    });
  }

  if (requestInput) {
    requestInput.value = JSON.stringify(examplePayload, null, 2);
  }

  function disableSaving() {
    lastSavedPayload = null;
    lastSavedResponse = null;
    if (saveLabelInput) saveLabelInput.disabled = true;
    if (saveButton) saveButton.disabled = true;
    if (saveStatusEl) saveStatusEl.textContent = "";
  }

  async function runScraper() {
    if (!requestInput || !responseOutput || !statusEl || !errorEl) return;

    errorEl.textContent = "";
    statusEl.textContent = "";
    responseOutput.textContent = "// Waiting for response...";
    disableSaving();

    let payload;
    const raw = requestInput.value.trim();
    if (!raw) {
      errorEl.textContent = "Please paste a JSON payload before running.";
      responseOutput.textContent = "// No request sent";
      return;
    }

    try {
      payload = JSON.parse(raw);
    } catch (e) {
      errorEl.textContent = "Invalid JSON. Fix the syntax and try again.";
      responseOutput.textContent = "// Invalid JSON";
      return;
    }

    const endpoint = resolveEndpoint("/api/scraper/run");
    statusEl.textContent = `Sending request to ${endpoint}...`;

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify(payload)
      });

      const text = await res.text();
      let parsed;
      try {
        parsed = JSON.parse(text);
      } catch {
        parsed = text;
      }

      if (!res.ok) {
        statusEl.textContent = `Request failed (${res.status})`;
        responseOutput.textContent = JSON.stringify(
          {
            status: res.status,
            error: "Request failed",
            body: parsed
          },
          null,
          2
        );
        return;
      }

      statusEl.textContent = "Success";
      responseOutput.textContent = JSON.stringify(parsed, null, 2);

      if (parsed && typeof parsed === "object" && Array.isArray(parsed.items)) {
        lastSavedPayload = payload;
        lastSavedResponse = parsed;
        if (saveLabelInput) saveLabelInput.disabled = false;
        if (saveButton) saveButton.disabled = false;
      }
    } catch (err) {
      statusEl.textContent = "Network error";
      responseOutput.textContent = JSON.stringify(
        {
          error: "Network error while calling /api/scraper/run",
          details: String(err)
        },
        null,
        2
      );
    }
  }

  async function saveResults() {
    if (!saveLabelInput || !saveButton || !saveStatusEl) return;
    if (!lastSavedPayload || !lastSavedResponse) return;

    const label = saveLabelInput.value.trim();
    if (!label) {
      saveStatusEl.textContent = "Name this run before saving.";
      return;
    }

    const endpoint = resolveEndpoint("/api/scraper/results");
    saveButton.disabled = true;
    saveStatusEl.textContent = "Saving...";

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          label,
          request: lastSavedPayload,
          response: lastSavedResponse
        })
      });

      if (!res.ok) {
        const body = await res.text();
        saveStatusEl.textContent = `Save failed (${res.status}). ${body}`;
        saveButton.disabled = false;
        return;
      }

      saveStatusEl.textContent = "Saved! Find it under My Scrapes.";
      saveLabelInput.value = "";
      // Stays enabled: re-saving the same run under a new name is a reasonable thing to do.
      saveButton.disabled = false;
    } catch (err) {
      saveStatusEl.textContent = `Network error while saving: ${String(err)}`;
      saveButton.disabled = false;
    }
  }

  if (saveButton) {
    saveButton.addEventListener("click", () => {
      saveResults();
    });
  }

  if (runButton) {
    runButton.addEventListener("click", () => {
      runScraper();
    });
  }
});

// Minimal scoped styles (kept inside JS so project can be dropped in easily)
(function injectScraperStyles() {
  if (document.getElementById("scraper-style-tag")) return;
  const style = document.createElement("style");
  style.id = "scraper-style-tag";
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
      margin: 0 0 1.25rem;
      font-size: 0.9rem;
      color: #64748b;
    }
    .scraper-section {
      margin-top: 1rem;
    }
    .scraper-section-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 0.35rem;
      font-size: 0.85rem;
      font-weight: 600;
      color: #1e293b;
    }
    .scraper-textarea {
      width: 100%;
      border-radius: 0.5rem;
      border: 1px solid #cbd5e1;
      padding: 0.75rem 0.9rem;
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
      font-size: 0.85rem;
      line-height: 1.4;
      resize: vertical;
      min-height: 200px;
      box-sizing: border-box;
      background-color: #0b1120;
      color: #e5e7eb;
    }
    .scraper-textarea:focus {
      outline: 2px solid #38bdf8;
      outline-offset: 2px;
      border-color: transparent;
    }
    .scraper-actions {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      margin-top: 0.85rem;
    }
    .scraper-button {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 0.45rem 0.9rem;
      border-radius: 999px;
      border: none;
      background: linear-gradient(135deg, #0ea5e9, #22c55e);
      color: white;
      font-size: 0.85rem;
      font-weight: 600;
      cursor: pointer;
      box-shadow: 0 10px 20px rgba(14, 165, 233, 0.35);
      transition: transform 0.08s ease, box-shadow 0.08s ease, filter 0.08s ease;
    }
    .scraper-button:hover {
      filter: brightness(1.05);
      transform: translateY(-1px);
      box-shadow: 0 16px 30px rgba(14, 165, 233, 0.4);
    }
    .scraper-button:active {
      transform: translateY(0);
      box-shadow: 0 6px 16px rgba(15, 23, 42, 0.4);
    }
    .scraper-button-secondary {
      background: #e2e8f0;
      color: #0f172a;
      box-shadow: none;
      padding-inline: 0.75rem;
    }
    .scraper-button-secondary:hover {
      filter: brightness(1.03);
      box-shadow: 0 4px 10px rgba(15, 23, 42, 0.1);
    }
    .scraper-status {
      font-size: 0.8rem;
      color: #64748b;
    }
    .scraper-save-row {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      flex-wrap: wrap;
    }
    .scraper-save-label-input {
      flex: 1 1 260px;
      border-radius: 0.5rem;
      border: 1px solid #cbd5e1;
      padding: 0.5rem 0.75rem;
      font-size: 0.85rem;
      box-sizing: border-box;
    }
    .scraper-save-label-input:disabled,
    .scraper-button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
      box-shadow: none;
      transform: none;
    }
    .scraper-error {
      margin-top: 0.25rem;
      font-size: 0.8rem;
      color: #b91c1c;
    }
    .scraper-response {
      margin-top: 0.4rem;
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
    @media (max-width: 768px) {
      .scraper-card {
        margin: 1rem;
        padding: 1.1rem;
      }
      .scraper-actions {
        flex-direction: column;
        align-items: flex-start;
      }
    }
  `;
  document.head.appendChild(style);
})();

