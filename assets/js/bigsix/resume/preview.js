// preview.js
// RESPONSIBILITY: Build the resume HTML preview and trigger PDF download.

window.Resume = window.Resume || {};

function escapeHtml(s) {
  return String(s || '').replace(/[&<>"']/g, c =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])
  );
}

function buildEduHtml(edu) {
  if (!edu.school) return '';
  return `<div style="margin-bottom:10px;">
    <b>${escapeHtml(edu.school)}</b>
    <div style="color:var(--muted); font-size:12px;">${escapeHtml(edu.degree || '')}</div>
    <div style="font-size:12px;">${escapeHtml(edu.eduHighlights || '')}</div>
  </div>`;
}

function buildSkillsHtml(hardSkills, softSkills) {
  const all = [...hardSkills, ...softSkills].map(escapeHtml).join(', ');
  if (!all) return '';
  return `<div style="margin-bottom:10px;"><b>Skills</b><div style="font-size:12px; color:var(--muted);">${all}</div></div>`;
}

function buildExpHtml(experiences) {
  return experiences.map(e => `
    <div style="margin-bottom:8px;">
      <b>${escapeHtml(e.title || '')}</b>
      <span style="color:var(--muted); font-size:12px;">— ${escapeHtml(e.company || '')}</span>
      <div style="font-size:12px; padding-left:12px;">
        ${(e.bullets || '').split('\n').map(l => l.trim()).filter(Boolean)
          .map(li => `<div>• ${escapeHtml(li.replace(/^[•\-]\s*/, ''))}</div>`).join('')}
      </div>
    </div>`).join('');
}

// ── RESPONSIBILITY: Inject assembled HTML into the preview container ──────────
Resume.updatePreview = function(state) {
  const P       = state.personal;
  const contact = [P.email, P.phone, P.location].filter(Boolean).map(escapeHtml).join(' &nbsp;•&nbsp; ');
  const expHtml = buildExpHtml(state.experiences);

  document.getElementById('resumePreview').innerHTML = `
    <div style="border-bottom:1px solid var(--border); padding-bottom:10px; margin-bottom:12px;">
      <div style="font-size:18px; font-weight:800; color:#a6c9ff;">${escapeHtml(P.fullName || '(Your Name)')}</div>
      <div style="font-size:12px; color:var(--muted);">${contact}</div>
    </div>
    ${buildEduHtml(state.education)}
    ${buildSkillsHtml(state.hardSkills, state.softSkills)}
    ${expHtml ? `<div><b>Experience</b><div style="margin-top:6px;">${expHtml}</div></div>` : ''}
  `;
};

// ── ORCHESTRATOR: Wire download PDF and save draft buttons ────────────────────
Resume.initPreview = function(state) {
  document.getElementById('downloadPdfBtn').addEventListener('click', () => {
    Resume.updatePreview(state);
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    doc.setFontSize(11);
    const lines = (document.getElementById('resumePreview').innerText || '')
      .split('\n').filter(l => l.trim());
    doc.text(lines.slice(0, 80).join('\n'), 10, 10, { maxWidth: 190 });
    doc.save('Resume.pdf');
  });

  document.getElementById('saveDraft').addEventListener('click', () => {
    Resume.persist(state);
    const msg = document.getElementById('saveMessage');
    msg.textContent = '✓ Saved locally';
    setTimeout(() => { msg.textContent = ''; }, 2000);
  });
};