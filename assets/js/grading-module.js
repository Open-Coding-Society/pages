(function () {
  if (!window.PageFeatures?.grading_modules) return;

  const API_BASE  = 'http://localhost:8585/api';
  const ENDPOINTS = { grades: `${API_BASE}/grades` };
  let gradesCache = [];

  /* ── API helpers ── */
  async function apiRequest(url, options = {}) {
    const res = await fetch(url, {
      credentials: 'include',
      headers: { 'Content-Type': 'application/json', 'X-Origin': 'client' },
      ...options,
    });
    if (!res.ok) throw new Error('API request failed');
    return res.status === 204 ? null : res.json();
  }

  const GradeAPI = {
    getAll: ()         => apiRequest(ENDPOINTS.grades),
    create: (data)     => apiRequest(ENDPOINTS.grades,            { method: 'POST',   body: JSON.stringify(data) }),
    update: (id, data) => apiRequest(`${ENDPOINTS.grades}/${id}`, { method: 'PUT',    body: JSON.stringify(data) }),
    delete: (id)       => apiRequest(`${ENDPOINTS.grades}/${id}`, { method: 'DELETE' }),
  };

  /* ── Modal helpers ── */
  function showModal(id) { document.getElementById(id)?.classList.add('show');    }
  function hideModal(id) { document.getElementById(id)?.classList.remove('show'); }

  /* ── User helpers ── */
  function getCurrentUid() {
    const user = window.currentUser || window.App?.user || window.user || {};
    return user.uid || user.username || user.email || '';
  }

  function isAdminUser() {
    const user  = window.currentUser || window.App?.user || window.user || {};
    const roles = user.roles || [];
    return user.uid === 'toby' || roles.includes('admin') || roles.includes('ADMIN');
  }

  /* ── Status bar ── */
  function setStatus(msg, err = false) {
    const el = document.getElementById('grading-status');
    if (!el) return;
    el.textContent = msg;
    el.style.color = err ? 'var(--destructive, #dc2626)' : 'var(--success, #16a34a)';
  }

  /* ── Load grades (admin table) ── */
  async function loadGrades() {
    try {
      gradesCache = await GradeAPI.getAll();
      const tbody = document.querySelector('#grades-table tbody');
      if (!tbody) return;
      tbody.innerHTML = '';
      gradesCache.forEach(g => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${g.id}</td><td>${g.uid}</td><td>${g.assignment}</td>
          <td>${g.score ?? ''}</td><td>${g.teacherComments ?? ''}</td>
          <td>${g.submission ?? ''}</td>
          <td>
            <button data-action="edit"   data-id="${g.id}">Edit</button>
            <button data-action="delete" data-id="${g.id}">Delete</button>
          </td>`;
        tbody.appendChild(row);
      });
    } catch (e) {
      setStatus('Failed to load grades: ' + e.message, true);
    }
  }

  /* ── DOMContentLoaded ── */
  document.addEventListener('DOMContentLoaded', () => {

    if (isAdminUser()) {
      document.getElementById('open-grades-admin').style.display = 'inline-block';
    }

    document.getElementById('open-grades-admin')?.addEventListener('click', () => {
      if (!isAdminUser()) return;
      const el = document.getElementById('grading-module');
      el.style.display = el.style.display === 'block' ? 'none' : 'block';
      if (el.style.display === 'block') loadGrades();
    });

    /* ── Manual fallback modal ── */
    document.getElementById('manual-cancel-btn')?.addEventListener('click', () =>
      hideModal('grade-manual-modal'));

    document.getElementById('manual-send-btn')?.addEventListener('click', async () => {
      const uid        = document.getElementById('manual-uid').value.trim();
      const assignment = document.getElementById('manual-assignment').value.trim();
      const submission = document.getElementById('manual-submission').value.trim();
      if (!uid || !assignment || !submission) {
        alert('UID, Assignment, and Submission are required.');
        return;
      }
      try {
        await GradeAPI.create({
          uid, assignment, score: 0.0,
          teacherComments: document.getElementById('manual-comments').value.trim() || 'Manually submitted',
          submission,
          submittedAt: new Date().toISOString(),
        });
        hideModal('grade-manual-modal');
        alert('Progress submitted successfully!');
      } catch (err) {
        document.getElementById('manual-error-msg').textContent =
          `Still failing: ${err?.message || 'unknown error'}`;
      }
    });

    /* ── Admin create form ── */
    const getFormData = f => ({
      uid:            (new FormData(f).get('uid')?.trim()) || getCurrentUid(),
      assignment:      new FormData(f).get('assignment')?.trim(),
      score:           parseFloat(new FormData(f).get('score')),
      teacherComments: new FormData(f).get('teacherComments')?.trim(),
      submission:      new FormData(f).get('submission')?.trim(),
    });

    document.getElementById('grade-create-form')?.addEventListener('submit', async e => {
      e.preventDefault();
      try {
        await GradeAPI.create(getFormData(e.target));
        e.target.reset();
        loadGrades();
      } catch (err) { setStatus(err.message, true); }
    });

    /* ── Admin edit form ── */
    document.getElementById('grade-edit-form')?.addEventListener('submit', async e => {
      e.preventDefault();
      try {
        await GradeAPI.update(new FormData(e.target).get('id'), getFormData(e.target));
        e.target.reset();
        e.target.style.display = 'none';
        loadGrades();
      } catch (err) { setStatus(err.message, true); }
    });

    document.getElementById('grade-edit-cancel')?.addEventListener('click', () => {
      document.getElementById('grade-edit-form').style.display = 'none';
    });

    /* ── Admin table actions (edit / delete) ── */
    document.querySelector('#grades-table tbody')?.addEventListener('click', async e => {
      const btn = e.target.closest('button');
      if (!btn) return;
      const id = btn.dataset.id;

      if (btn.dataset.action === 'delete') {
        if (confirm('Delete this grade entry?')) {
          await GradeAPI.delete(id);
          loadGrades();
        }
      }

      if (btn.dataset.action === 'edit') {
        const g    = gradesCache.find(x => x.id == id);
        const form = document.getElementById('grade-edit-form');
        Object.entries(g).forEach(([k, v]) => {
          const input = form.querySelector(`[name="${k}"]`);
          if (input) input.value = v ?? '';
        });
        form.style.display = 'block';
      }
    });
  });
})();