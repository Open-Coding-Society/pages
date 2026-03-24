// ============================================================
//  api-simulator.js — Single Responsibility: REST API simulator
//  Path: assets/js/bigsix/dataviz/api-simulator.js
//
//  Owns everything related to the mock REST API (Step 1):
//    - Maintaining the in-memory company database
//    - Processing POST/GET/PUT/DELETE requests
//    - Rendering the company list cards
//    - Wiring method tab buttons
//    - Showing/hiding path ID and body fields
//    - Setting the status badge
//
//  EXPORTS:
//    initApiSimulator(config)
// ============================================================

// Module-level DB state
let db     = [];
let nextId = 1;

// ============================================================
//  WORKER 1 — escapeHtml
//  Pure function — sanitizes user input before injecting into DOM.
// ============================================================
function escapeHtml(s) {
  return String(s)
    .replace(/&/g,'&amp;').replace(/</g,'&lt;')
    .replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

// ============================================================
//  WORKER 2 — setStatusBadge
//  Single responsibility: update the response status badge color.
// ============================================================
function setStatusBadge(text) {
  const el = document.getElementById('statusBadge');
  if (!el) return;
  const code    = parseInt(text);
  el.textContent = text;
  el.className   = 'status-badge ' + (code >= 400 ? 'status-4xx' : 'status-2xx');
}

// ============================================================
//  WORKER 3 — renderList
//  Single responsibility: rebuild the company card list from db.
// ============================================================
function renderList() {
  const el = document.getElementById('list');
  if (!el) return;
  if (!db.length) {
    el.innerHTML = '<p style="color:var(--muted);padding:12px;">No companies in database.</p>';
    return;
  }
  el.innerHTML = db.map(c => `
    <div class="company-card">
      <strong>${escapeHtml(c.name)}</strong>
      <span class="badge">${escapeHtml(c.industry)}</span>
      <span style="color:var(--muted);font-size:11px;margin-left:8px;">ID: ${c.id}</span><br/>
      <span style="font-size:12px;color:var(--muted);">${escapeHtml(c.location)} · ${c.size} employees</span><br/>
      <div style="margin-top:5px;">
        ${(c.skills||[]).map(s=>`<span class="pill">${escapeHtml(s)}</span>`).join('')}
      </div>
    </div>`).join('');
}

// ============================================================
//  WORKER 4 — syncEndpointUI
//  Single responsibility: show/hide path ID and body fields
//  based on the currently selected endpoint.
// ============================================================
function syncEndpointUI() {
  const val       = document.getElementById('ep')?.value || '';
  const needsId   = val.includes('{id}');
  const needsBody = val.startsWith('POST') || val.startsWith('PUT');
  document.getElementById('pidWrap')?.classList.toggle('hidden', !needsId);
  document.getElementById('bodyWrap')?.classList.toggle('hidden', !needsBody);
}

// ============================================================
//  WORKER 5 — processRequest
//  Single responsibility: execute the selected API operation
//  against the in-memory db and return a result object.
//  Pure logic — no DOM access.
// ============================================================
function processRequest(method, path, bodyStr, pathId) {
  try {
    if (method === 'POST' && path === '/api/companies') {
      const body = JSON.parse(bodyStr || '{}');
      if (!body.name) throw new Error('"name" field is required');
      const obj = {
        id: nextId++, name: body.name,
        industry: body.industry || 'Unknown',
        location: body.location || 'Unknown',
        size:     Number(body.size) || 0,
        skills:   Array.isArray(body.skills) ? body.skills : [],
      };
      db.push(obj);
      return { status: '201 Created', data: obj };
    }

    if (method === 'GET' && path === '/api/companies') {
      return { status: '200 OK', data: { total: db.length, companies: db } };
    }

    if (method === 'GET' && path === '/api/companies/{id}') {
      const id    = Number(pathId);
      if (!id) throw new Error('Enter a valid numeric ID');
      const found = db.find(x => x.id === id);
      return found
        ? { status: '200 OK',        data: found }
        : { status: '404 Not Found', data: { error: `No company with id ${id}` } };
    }

    if (method === 'PUT' && path === '/api/companies/{id}') {
      const id  = Number(pathId);
      if (!id) throw new Error('Enter a valid numeric ID');
      const idx = db.findIndex(x => x.id === id);
      if (idx === -1) return { status: '404 Not Found', data: { error: `No company with id ${id}` } };
      const body = JSON.parse(bodyStr || '{}');
      db[idx] = { ...db[idx], ...body, id };
      return { status: '200 OK', data: db[idx] };
    }

    if (method === 'DELETE' && path === '/api/companies/{id}') {
      const id     = Number(pathId);
      if (!id) throw new Error('Enter a valid numeric ID');
      const before = db.length;
      db = db.filter(x => x.id !== id);
      const deleted = db.length < before;
      return deleted
        ? { status: '204 No Content', data: { message: `Company ${id} deleted` } }
        : { status: '404 Not Found',  data: { error: `No company with id ${id}` } };
    }

    throw new Error('Unknown endpoint');
  } catch (err) {
    return { status: '400 Bad Request', data: { error: err.message } };
  }
}

// ============================================================
//  WORKER 6 — sendApiRequest
//  Single responsibility: read DOM inputs, call processRequest,
//  then render the result.
// ============================================================
function sendApiRequest() {
  const [method, path] = (document.getElementById('ep')?.value || '').split(' ');
  const bodyStr        = document.getElementById('reqBody')?.value || '';
  const pathId         = document.getElementById('pid')?.value || '';

  const { status, data } = processRequest(method, path, bodyStr, pathId);
  setStatusBadge(status);
  document.getElementById('out').textContent = JSON.stringify(data, null, 2);
  renderList();
}

// ============================================================
//  WORKER 7 — resetDb
//  Single responsibility: restore the database to default data.
// ============================================================
function resetDb(defaultDb) {
  db     = JSON.parse(JSON.stringify(defaultDb));
  nextId = defaultDb.length + 1;
  setStatusBadge('200 OK');
  document.getElementById('out').textContent = 'Database reset to defaults.';
  renderList();
}

// ============================================================
//  WORKER 8 — initMethodTabs
//  Single responsibility: wire tab buttons to update the endpoint
//  input and sync the UI fields.
// ============================================================
function initMethodTabs() {
  document.querySelectorAll('#methodTabs button').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('#methodTabs button').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById('ep').value = btn.dataset.ep;
      syncEndpointUI();
    });
  });
}

// ============================================================
//  ORCHESTRATOR — initApiSimulator
//  Sets up the DB, wires all buttons, renders initial state.
//  Called once on DOMContentLoaded.
// ============================================================
export function initApiSimulator(config) {
  db     = JSON.parse(JSON.stringify(config.DEFAULT_DB));
  nextId = config.DEFAULT_DB.length + 1;

  initMethodTabs();
  syncEndpointUI();
  renderList();

  document.getElementById('sendBtn')?.addEventListener('click', sendApiRequest);
  document.getElementById('resetBtn')?.addEventListener('click', () => resetDb(config.DEFAULT_DB));
}