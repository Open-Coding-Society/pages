// ============================================================
//  frq.js — Free response questions
//  Path: assets/js/bigsix/backend/frq.js
// ============================================================

export class Frq {
  #frqs;

  constructor(frqs) {
    this.#frqs = frqs;
  }

  init() {
    const container = document.getElementById('frqContainer');
    if (!container) return;

    container.innerHTML = this.#frqs.map(frq => `
      <div class="frq-box" id="${frq.id}">
        <div class="frq-question">${frq.question}</div>
        <textarea class="frq-textarea" id="${frq.id}-ta" placeholder="Write your answer here…"></textarea>
        <div class="btn-row">
          <button id="${frq.id}-grade-btn">Grade</button>
          <button id="${frq.id}-reset-btn" class="secondary">Reset</button>
        </div>
        <div class="frq-feedback" id="${frq.id}-feedback"></div>
      </div>`).join('');

    this.#frqs.forEach(frq => {
      document.getElementById(`${frq.id}-grade-btn`)
        ?.addEventListener('click', () => this.#gradeFrq(frq));
      document.getElementById(`${frq.id}-reset-btn`)
        ?.addEventListener('click', () => this.#resetFrq(frq));
    });
  }

  #gradeFrq(frq) {
    const answer   = (document.getElementById(`${frq.id}-ta`)?.value || '').toLowerCase();
    const feedback = document.getElementById(`${frq.id}-feedback`);
    if (!answer.trim()) { feedback.textContent = 'Please write an answer first.'; feedback.classList.add('show'); return; }
    const hits  = frq.rubric.filter(k => answer.includes(k));
    const score = Math.round((hits.length / frq.rubric.length) * 100);
    const tags  = frq.rubric.map(k =>
      `<span class="score-badge ${hits.includes(k) ? 'perfect' : ''}" style="font-size:11px;padding:2px 8px;">${k}</span>`
    ).join(' ');
    feedback.innerHTML = `<strong>Score: ${score}%</strong> — ${hits.length} of ${frq.rubric.length} key concepts.<br>
      <div style="margin-top:8px;display:flex;flex-wrap:wrap;gap:6px;">${tags}</div>`;
    feedback.classList.add('show');
  }

  #resetFrq(frq) {
    const ta = document.getElementById(`${frq.id}-ta`);
    const fb = document.getElementById(`${frq.id}-feedback`);
    if (ta) ta.value = '';
    if (fb) { fb.innerHTML = ''; fb.classList.remove('show'); }
  }
}
