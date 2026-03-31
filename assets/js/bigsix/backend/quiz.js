// ============================================================
//  quiz.js — Quiz render, grade, reset
//  Path: assets/js/bigsix/backend/quiz.js
// ============================================================

const picks = {};  // { quizId: { qIndex: optIndex } }

function renderQuiz(quizId, questions) {
  const box = document.getElementById(quizId);
  if (!box) return;
  picks[quizId] = {};
  box.innerHTML = '';

  questions.forEach((item, qi) => {
    const wrap  = document.createElement('div');
    wrap.className = 'question-block';

    const qText = document.createElement('div');
    qText.className   = 'question-text';
    qText.textContent = `Q${qi + 1}. ${item.q}`;
    wrap.appendChild(qText);

    item.opts.forEach((opt, oi) => {
      const el = document.createElement('div');
      el.className  = 'opt';
      el.dataset.qi = qi;
      el.dataset.oi = oi;
      el.innerHTML  = `<span class="radio-dot"></span><span class="opt-label">${opt}</span>`;
      el.addEventListener('click', () => {
        picks[quizId][qi] = oi;
        box.querySelectorAll(`.opt[data-qi="${qi}"]`).forEach(x => x.classList.remove('sel'));
        el.classList.add('sel');
      });
      wrap.appendChild(el);
    });

    const exp = document.createElement('div');
    exp.className = 'explanation';
    exp.id        = `${quizId}-exp-${qi}`;
    exp.textContent = item.explanation;
    wrap.appendChild(exp);
    box.appendChild(wrap);
  });
}

function gradeQuiz(quizId, questions) {
  const box = document.getElementById(quizId);
  let correct = 0;

  questions.forEach((item, qi) => {
    const chosen = picks[quizId]?.[qi];
    box.querySelectorAll(`.opt[data-qi="${qi}"]`).forEach(el => el.classList.remove('good','bad'));
    if (chosen === undefined) return;
    const ok       = chosen === item.a;
    if (ok) correct++;
    const chosenEl  = box.querySelector(`.opt[data-qi="${qi}"][data-oi="${chosen}"]`);
    const correctEl = box.querySelector(`.opt[data-qi="${qi}"][data-oi="${item.a}"]`);
    if (chosenEl)          chosenEl.classList.add(ok ? 'good' : 'bad');
    if (!ok && correctEl)  correctEl.classList.add('good');
    document.getElementById(`${quizId}-exp-${qi}`)?.classList.add('show');
  });

  const scoreEl = document.getElementById(`${quizId}-score`);
  if (scoreEl) {
    scoreEl.style.display = '';
    scoreEl.textContent   = `${correct} / ${questions.length}`;
    scoreEl.className     = 'score-badge' + (correct === questions.length ? ' perfect' : '');
  }
}

export function initQuizzes(quizzes) {
  Object.entries(quizzes).forEach(([id, questions]) => {
    renderQuiz(id, questions);
    const num = id.replace('quiz','');
    document.getElementById(`gradeQuiz${num}Btn`)
      ?.addEventListener('click', () => gradeQuiz(id, questions));
    document.getElementById(`resetQuiz${num}Btn`)
      ?.addEventListener('click', () => renderQuiz(id, questions));
  });
}