// skills.js
// RESPONSIBILITY: Hard/soft skill checklists, tag rendering, and add-skill inputs.
// Registers onto window.Resume.

window.Resume = window.Resume || {};

function escapeHtml(s) {
  return String(s || '').replace(/[&<>"']/g, c =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])
  );
}

// ── RESPONSIBILITY: Render skill tags below each checklist ────────────────────
function renderTags(state) {
  document.getElementById('hardSkillTags').innerHTML =
    Array.from(state.hardSkills).map(s => `<span class="skill-tag">${escapeHtml(s)}</span>`).join('');
  document.getElementById('softSkillTags').innerHTML =
    Array.from(state.softSkills).map(s => `<span class="skill-tag">${escapeHtml(s)}</span>`).join('');
}

// ── RESPONSIBILITY: Build checkbox list for one skill set ─────────────────────
function renderChecklist(gridEl, setRef, state) {
  if (!gridEl) return;
  gridEl.innerHTML = '';
  Array.from(setRef).forEach(sk => {
    const label      = document.createElement('label');
    label.className  = 'skill-check-label';
    const cb         = document.createElement('input');
    cb.type          = 'checkbox';
    cb.checked       = true;
    const span       = document.createElement('span');
    span.textContent = sk;
    label.appendChild(cb);
    label.appendChild(span);
    gridEl.appendChild(label);
    cb.addEventListener('change', () => {
      if (cb.checked) setRef.add(sk); else setRef.delete(sk);
      renderTags(state);
      Resume.persist(state);
    });
  });
}

// ── RESPONSIBILITY: Add one skill from an input and re-render ─────────────────
function addSkill(inputEl, setRef, gridEl, state) {
  const v = inputEl.value.trim();
  if (!v) return;
  setRef.add(v);
  inputEl.value = '';
  renderChecklist(gridEl, setRef, state);
  renderTags(state);
  Resume.persist(state);
}

// ── ORCHESTRATOR: Wire up both skill panels ───────────────────────────────────
Resume.initSkills = function(state) {
  const hardGrid  = document.getElementById('hardSkillsGrid');
  const softGrid  = document.getElementById('softSkillsGrid');
  const hardInput = document.getElementById('customHardSkill');
  const softInput = document.getElementById('customSoftSkill');

  renderChecklist(hardGrid, state.hardSkills, state);
  renderChecklist(softGrid, state.softSkills, state);
  renderTags(state);

  document.getElementById('addHardSkillBtn').addEventListener('click', () =>
    addSkill(hardInput, state.hardSkills, hardGrid, state));
  document.getElementById('addSoftSkillBtn').addEventListener('click', () =>
    addSkill(softInput, state.softSkills, softGrid, state));

  hardInput.addEventListener('keydown', e => { if (e.key === 'Enter') document.getElementById('addHardSkillBtn').click(); });
  softInput.addEventListener('keydown', e => { if (e.key === 'Enter') document.getElementById('addSoftSkillBtn').click(); });
};