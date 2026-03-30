// linkedin.js
// RESPONSIBILITY: LinkedIn "About" text generation.

window.Resume = window.Resume || {};

// ── RESPONSIBILITY: Build about text from state or textarea ───────────────────
function buildAboutText(state) {
  const about = document.getElementById('aboutPrompt').value.trim();
  if (about) return about;
  const skills = Array.from(state.hardSkills).slice(0, 3).join(', ');
  const name   = state.personal.fullName || document.getElementById('fullName')?.value || 'This candidate';
  return `${name} is a motivated student or early-career developer with hands-on experience in ${skills || 'software development'}, building projects and collaborating in teams.`;
}

// ── ORCHESTRATOR: Wire generate button ───────────────────────────────────────
Resume.initLinkedIn = function(state) {
  document.getElementById('generateLinkedInBtn').addEventListener('click', () => {
    const out = buildAboutText(state);
    document.getElementById('linkedinPreview').textContent = out;
    state.about = out;
    Resume.persist(state);
  });
};