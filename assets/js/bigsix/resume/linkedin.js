// linkedin.js
// RESPONSIBILITY: LinkedIn "About" text generation.
// Registers onto window.Resume.

class LinkedInBuilder {
  #state;

  constructor(state) {
    this.#state = state;
  }

  // ── RESPONSIBILITY: Build about text from state or textarea ─────────────────
  #buildAboutText() {
    const about = document.getElementById('aboutPrompt').value.trim();
    if (about) return about;
    const skills = Array.from(this.#state.hardSkills).slice(0, 3).join(', ');
    const name   = this.#state.personal.fullName || document.getElementById('fullName')?.value || 'This candidate';
    return `${name} is a motivated student or early-career developer with hands-on experience in ${skills || 'software development'}, building projects and collaborating in teams.`;
  }

  // ── ORCHESTRATOR: Wire generate button ──────────────────────────────────────
  init() {
    document.getElementById('generateLinkedInBtn').addEventListener('click', () => {
      const out = this.#buildAboutText();
      document.getElementById('linkedinPreview').textContent = out;
      this.#state.about = out;
      Resume.persist(this.#state);
    });
  }
}

window.Resume = window.Resume || {};
Resume.LinkedInBuilder = LinkedInBuilder;
