// experiences.js
// RESPONSIBILITY: Experience entry cards (add/remove/edit) and drag-drop practice zone.
// Registers onto window.Resume.

window.Resume = window.Resume || {};

function escapeHtml(s) {
  return String(s || '').replace(/[&<>"']/g, c =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])
  );
}

// ── RESPONSIBILITY: Build and append one experience entry card ────────────────
function addExperienceCard(initial, state) {
  const container = document.getElementById('experienceContainer');
  const idx       = state.experiences.length;
  state.experiences.push({ ...initial });

  const el       = document.createElement('div');
  el.className   = 'exp-entry';
  el.innerHTML   = `
    <input placeholder="Job Title / Role"  data-idx="${idx}" data-key="title"   value="${escapeHtml(initial.title   || '')}" />
    <input placeholder="Company | Dates"   data-idx="${idx}" data-key="company" value="${escapeHtml(initial.company || '')}" />
    <textarea rows="3" placeholder="Bullet points (one per line, start with action verbs)"
      data-idx="${idx}" data-key="bullets">${escapeHtml(initial.bullets || '')}</textarea>
    <div style="display:flex; justify-content:flex-end; margin-top:4px;">
      <button class="removeExpBtn" style="font-size:12px; color:#f87171; border-color:rgba(248,113,113,0.3);">✕ Remove</button>
    </div>
  `;
  container.appendChild(el);

  el.querySelectorAll('input, textarea').forEach(inp => {
    inp.addEventListener('input', e => {
      const i = Number(e.target.dataset.idx);
      const k = e.target.dataset.key;
      if (state.experiences[i]) state.experiences[i][k] = e.target.value;
      Resume.persist(state);
    });
  });

  el.querySelector('.removeExpBtn').addEventListener('click', () => {
    const i = Number(el.querySelector('[data-idx]').dataset.idx);
    state.experiences.splice(i, 1);
    renderExperiences(state);
    Resume.persist(state);
  });
}

// ── RESPONSIBILITY: Clear and re-render all experience cards ──────────────────
function renderExperiences(state) {
  document.getElementById('experienceContainer').innerHTML = '';
  const copy        = state.experiences.slice();
  state.experiences = [];
  copy.forEach(e => addExperienceCard(e, state));
}

// ── RESPONSIBILITY: Set up drag-drop practice zone ────────────────────────────
function initDragDrop() {
  const dragItems = [
    { text: 'Reduced page load time by 40%',                   good: true  },
    { text: 'Responsible for doing projects',                   good: false },
    { text: 'Implemented feature increasing retention by 12%',  good: true  },
    { text: 'Hardworking and motivated person',                 good: false },
  ];

  const pool     = document.getElementById('itemsPool');
  const goodZone = document.getElementById('goodZone');
  const badZone  = document.getElementById('badZone');

  pool.innerHTML = '';
  dragItems.forEach((it, idx) => {
    const b          = document.createElement('div');
    b.className      = 'drag-item';
    b.draggable      = true;
    b.textContent    = it.text;
    b.dataset.idx    = idx;
    b.addEventListener('dragstart', e => e.dataTransfer.setData('text/plain', idx));
    pool.appendChild(b);
  });

  [goodZone, badZone].forEach(zone => {
    zone.addEventListener('dragover',  e => { e.preventDefault(); zone.classList.add('drag-over'); });
    zone.addEventListener('dragleave', ()  => zone.classList.remove('drag-over'));
    zone.addEventListener('drop', e => {
      e.preventDefault();
      zone.classList.remove('drag-over');
      const idx      = parseInt(e.dataTransfer.getData('text/plain'), 10);
      const sourceEl = document.querySelector(`.drag-item[data-idx="${idx}"]`);
      if (!sourceEl) return;
      zone.appendChild(sourceEl);
      const isCorrect            = dragItems[idx].good === (zone.id === 'goodZone');
      sourceEl.style.borderColor = isCorrect ? 'rgba(74,222,128,0.6)' : 'rgba(248,113,113,0.6)';
      sourceEl.style.background  = isCorrect ? 'rgba(74,222,128,0.08)' : 'rgba(248,113,113,0.08)';
    });
  });
}

// ── ORCHESTRATOR: Wire add button, render saved entries, init drag-drop ───────
Resume.initExperiences = function(state) {
  renderExperiences(state);
  initDragDrop();
  document.getElementById('addExperienceBtn').addEventListener('click', () => {
    addExperienceCard({ title: 'Project / Role', company: 'Org | Dates', bullets: '• Led X\n• Improved Y by 20%' }, state);
    Resume.persist(state);
  });
};