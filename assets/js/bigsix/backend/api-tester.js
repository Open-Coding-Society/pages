// ============================================================
//  api-tester.js — Mock API tester (Step 4)
//  Path: assets/js/bigsix/backend/api-tester.js
// ============================================================

export class ApiTester {
  #config;

  constructor(config) {
    this.#config = config;
  }

  init() {
    const sel = document.getElementById('endpointSelect');
    if (!sel) return;

    sel.innerHTML = this.#config.API_ENDPOINTS.map(ep =>
      `<option value="${ep.value}">${ep.label}</option>`
    ).join('');

    sel.addEventListener('change', () => this.#updateRequestPreview());
    document.getElementById('sendRequestBtn')
      ?.addEventListener('click', () => this.#sendApiRequest());

    this.#updateRequestPreview();
  }

  #updateRequestPreview() {
    const val    = document.getElementById('endpointSelect')?.value || '';
    const [method, path] = val.split(':');
    const preEl  = document.getElementById('reqPreview');
    if (!preEl) return;
    const bodies = {
      POST: '{\n  "name": "Dave Lee",\n  "email": "dave@example.com"\n}',
      PUT:  '{\n  "name": "Alice Johnson-Updated",\n  "email": "alice.new@example.com"\n}',
    };
    const body = bodies[method] ? `\nContent-Type: application/json\n\n${bodies[method]}` : '';
    preEl.textContent = `${method} ${path} HTTP/1.1\nHost: localhost:8080\nAccept: application/json${body}`;
  }

  #sendApiRequest() {
    const key  = document.getElementById('endpointSelect')?.value;
    const mock = this.#config.API_RESPONSES[key];
    if (!mock) return;

    const cls = mock.status >= 500 ? 'status-5xx' : mock.status >= 400 ? 'status-4xx' : 'status-2xx';
    document.getElementById('statusBadgeWrap').innerHTML =
      `<span class="status-badge ${cls}">${mock.status}</span>`;
    document.getElementById('responseBody').textContent  = mock.body || '(no body)';
    document.getElementById('respTime').textContent      = `${mock.time}ms`;
    document.getElementById('respSize').textContent      = `${new Blob([mock.body]).size} bytes`;
    document.getElementById('responseMeta').style.display = '';
    document.getElementById('apiHint').textContent       = mock.hint;
  }
}
