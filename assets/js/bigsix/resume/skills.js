// skills.js
// RESPONSIBILITY: Hard/soft skill checklists, tag rendering, and add-skill inputs.
// Registers onto window.Resume.

class SkillsManager {
  #state;

  constructor(state) {
    this.#state = state;
  }

  // ── RESPONSIBILITY: Render skill tags below each checklist ──────────────────
  #renderTags() {
    document.getElementById('hardSkillTags').innerHTML =
      Array.from(this.#state.hardSkills).map(s => `<span class="skill-tag">${this.#escapeHtml(s)}</span>`).join('');
    document.getElementById('softSkillTags').innerHTML =
      Array.from(this.#state.softSkills).map(s => `<span class="skill-tag">${this.#escapeHtml(s)}</span>`).join('');
  }

  // ── RESPONSIBILITY: Build checkbox list for one skill set ───────────────────
  #renderChecklist(gridEl, setRef) {
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
        this.#renderTags();
        Resume.persist(this.#state);
      });
    });
  }

  // ── RESPONSIBILITY: Add one skill from an input and re-render ───────────────
  #addSkill(inputEl, setRef, gridEl) {
    const v = inputEl.value.trim();
    if (!v) return;
    setRef.add(v);
    inputEl.value = '';
    this.#renderChecklist(gridEl, setRef);
    this.#renderTags();
    Resume.persist(this.#state);
  }

  #escapeHtml(s) {
    return String(s || '').replace(/[&<>"']/g, c =>
      ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])
    );
  }

  // ── ORCHESTRATOR: Wire up both skill panels ─────────────────────────────────
  init() {
    const hardGrid  = document.getElementById('hardSkillsGrid');
    const softGrid  = document.getElementById('softSkillsGrid');
    const hardInput = document.getElementById('customHardSkill');
    const softInput = document.getElementById('customSoftSkill');

    this.#renderChecklist(hardGrid, this.#state.hardSkills);
    this.#renderChecklist(softGrid, this.#state.softSkills);
    this.#renderTags();

    document.getElementById('addHardSkillBtn').addEventListener('click', () =>
      this.#addSkill(hardInput, this.#state.hardSkills, hardGrid));
    document.getElementById('addSoftSkillBtn').addEventListener('click', () =>
      this.#addSkill(softInput, this.#state.softSkills, softGrid));

    hardInput.addEventListener('keydown', e => { if (e.key === 'Enter') document.getElementById('addHardSkillBtn').click(); });
    softInput.addEventListener('keydown', e => { if (e.key === 'Enter') document.getElementById('addSoftSkillBtn').click(); });
  }
}

window.Resume = window.Resume || {};
Resume.SkillsManager = SkillsManager;
