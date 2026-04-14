// preview.js
// RESPONSIBILITY: Build the resume HTML preview and trigger PDF download.
// Registers onto window.Resume.

class ResumePreview {
  #state;

  constructor(state) {
    this.#state = state;
  }

  #escapeHtml(s) {
    return String(s || '').replace(/[&<>"']/g, c =>
      ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])
    );
  }

  #buildEduHtml(edu) {
    if (!edu.school) return '';
    return `<div style="margin-bottom:10px;">
      <b>${this.#escapeHtml(edu.school)}</b>
      <div style="color:var(--muted); font-size:12px;">${this.#escapeHtml(edu.degree || '')}</div>
      <div style="font-size:12px;">${this.#escapeHtml(edu.eduHighlights || '')}</div>
    </div>`;
  }

  #buildSkillsHtml(hardSkills, softSkills) {
    const all = [...hardSkills, ...softSkills].map(s => this.#escapeHtml(s)).join(', ');
    if (!all) return '';
    return `<div style="margin-bottom:10px;"><b>Skills</b><div style="font-size:12px; color:var(--muted);">${all}</div></div>`;
  }

  #buildExpHtml(experiences) {
    return experiences.map(e => `
      <div style="margin-bottom:8px;">
        <b>${this.#escapeHtml(e.title || '')}</b>
        <span style="color:var(--muted); font-size:12px;">— ${this.#escapeHtml(e.company || '')}</span>
        <div style="font-size:12px; padding-left:12px;">
          ${(e.bullets || '').split('\n').map(l => l.trim()).filter(Boolean)
            .map(li => `<div>• ${this.#escapeHtml(li.replace(/^[•\-]\s*/, ''))}</div>`).join('')}
        </div>
      </div>`).join('');
  }

  // ── RESPONSIBILITY: Inject assembled HTML into the preview container ────────
  update() {
    const P       = this.#state.personal;
    const contact = [P.email, P.phone, P.location].filter(Boolean).map(s => this.#escapeHtml(s)).join(' &nbsp;•&nbsp; ');
    const expHtml = this.#buildExpHtml(this.#state.experiences);

    document.getElementById('resumePreview').innerHTML = `
      <div style="border-bottom:1px solid var(--border); padding-bottom:10px; margin-bottom:12px;">
        <div style="font-size:18px; font-weight:800; color:#a6c9ff;">${this.#escapeHtml(P.fullName || '(Your Name)')}</div>
        <div style="font-size:12px; color:var(--muted);">${contact}</div>
      </div>
      ${this.#buildEduHtml(this.#state.education)}
      ${this.#buildSkillsHtml(this.#state.hardSkills, this.#state.softSkills)}
      ${expHtml ? `<div><b>Experience</b><div style="margin-top:6px;">${expHtml}</div></div>` : ''}
    `;
  }

  // ── ORCHESTRATOR: Wire download PDF and save draft buttons ──────────────────
  init() {
    document.getElementById('downloadPdfBtn').addEventListener('click', () => {
      this.update();
      const { jsPDF } = window.jspdf;
      const doc = new jsPDF();
      doc.setFontSize(11);
      const lines = (document.getElementById('resumePreview').innerText || '')
        .split('\n').filter(l => l.trim());
      doc.text(lines.slice(0, 80).join('\n'), 10, 10, { maxWidth: 190 });
      doc.save('Resume.pdf');
    });

    document.getElementById('saveDraft').addEventListener('click', () => {
      Resume.persist(this.#state);
      const msg = document.getElementById('saveMessage');
      msg.textContent = '✓ Saved locally';
      setTimeout(() => { msg.textContent = ''; }, 2000);
    });
  }
}

window.Resume = window.Resume || {};
Resume.ResumePreview = ResumePreview;
