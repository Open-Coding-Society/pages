// ============================================================
//  api-tester.js — Single Responsibility: API mock tester
//  Path: assets/js/bigsix/backend/api-tester.js
//
//  Owns everything related to the API testing step:
//    - Populating the endpoint select dropdown from config
//    - Rendering the request preview (method, path, body)
//    - Simulating a response from the mock data
//    - Displaying status badge, response body, and metadata
//
//  EXPORTS:
//    initApiTester(config)
// ============================================================


// ============================================================
//  WORKER 1 — populateEndpoints
//  Single responsibility: fill the select element with options.
// ============================================================

/**
 * Populate the endpoint dropdown from config.
 *
 * @param {Array} endpoints - CONFIG.API_ENDPOINTS from data.js
 */
function populateEndpoints(endpoints) {
    const sel = document.getElementById('endpointSelect');
    if (!sel) return;
    sel.innerHTML = endpoints.map(ep =>
      `<option value="${ep.value}">${ep.label}</option>`
    ).join('');
  }
  
  
  // ============================================================
  //  WORKER 2 — updateRequestPreview
  //  Single responsibility: render the HTTP request preview text
  //  based on the currently selected endpoint.
  // ============================================================
  
  /**
   * Update the request preview code block.
   */
  function updateRequestPreview() {
    const val = document.getElementById('endpointSelect')?.value || '';
    const [method, path] = val.split(':');
    const preEl = document.getElementById('reqPreview');
    if (!preEl) return;
  
    // Show a sample body for methods that send one
    const bodyMap = {
      POST: '{\n  "name": "Dave Lee",\n  "email": "dave@example.com"\n}',
      PUT:  '{\n  "name": "Alice Johnson-Updated",\n  "email": "alice.new@example.com"\n}',
    };
    const body = bodyMap[method]
      ? `\nContent-Type: application/json\n\n${bodyMap[method]}`
      : '';
  
    preEl.textContent = `${method} ${path} HTTP/1.1\nHost: localhost:8080\nAccept: application/json${body}`;
  }
  
  
  // ============================================================
  //  WORKER 3 — getStatusClass
  //  Single responsibility: map an HTTP status code to a CSS class.
  //  Pure function — no DOM access.
  // ============================================================
  
  /**
   * Return the CSS class for a given HTTP status code.
   *
   * @param {number} status
   * @returns {string}
   */
  function getStatusClass(status) {
    if (status >= 500) return 'status-5xx';
    if (status >= 400) return 'status-4xx';
    return 'status-2xx';
  }
  
  
  // ============================================================
  //  WORKER 4 — displayResponse
  //  Single responsibility: inject mock response data into the DOM.
  //  Only touches the response panel elements.
  // ============================================================
  
  /**
   * Display a mock API response in the response panel.
   *
   * @param {object} mock - Single API_RESPONSES entry from data.js
   */
  function displayResponse(mock) {
    const badgeEl = document.getElementById('statusBadgeWrap');
    const bodyEl  = document.getElementById('responseBody');
    const metaEl  = document.getElementById('responseMeta');
    const hintEl  = document.getElementById('apiHint');
    const timeEl  = document.getElementById('respTime');
    const sizeEl  = document.getElementById('respSize');
  
    badgeEl.innerHTML  = `<span class="status-badge ${getStatusClass(mock.status)}">${mock.status}</span>`;
    bodyEl.textContent = mock.body || '(no body)';
    timeEl.textContent = `${mock.time}ms`;
    sizeEl.textContent = `${new Blob([mock.body]).size} bytes`;
    metaEl.style.display = '';
    hintEl.textContent   = mock.hint;
  }
  
  
  // ============================================================
  //  WORKER 5 — sendRequest
  //  Single responsibility: look up the mock response for the
  //  selected endpoint and trigger displayResponse.
  // ============================================================
  
  /**
   * Simulate sending a request and display the mock response.
   *
   * @param {object} responses - CONFIG.API_RESPONSES from data.js
   */
  function sendRequest(responses) {
    const key  = document.getElementById('endpointSelect')?.value;
    const mock = responses[key];
    if (!mock) return;
    displayResponse(mock);
  }
  
  
  // ============================================================
  //  ORCHESTRATOR — initApiTester
  //  Populates dropdown, wires change and send events.
  //  Called once on DOMContentLoaded from backend_lesson.md.
  //
  //  @param {object} config - { API_ENDPOINTS, API_RESPONSES }
  // ============================================================
  export function initApiTester(config) {
    populateEndpoints(config.API_ENDPOINTS);
    updateRequestPreview();
  
    // Update preview whenever a different endpoint is selected
    document.getElementById('endpointSelect')
      ?.addEventListener('change', updateRequestPreview);
  
    // Send button — look up mock and display
    document.getElementById('sendRequestBtn')
      ?.addEventListener('click', () => sendRequest(config.API_RESPONSES));
  }