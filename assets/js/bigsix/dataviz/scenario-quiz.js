// ============================================================
//  scenario-quiz.js — Single Responsibility: Scenario checker + Quiz
//  Path: assets/js/bigsix/dataviz/scenario-quiz.js
//
//  Owns everything related to Step 5:
//    - Scenario approach checker
//    - Quiz render, grade, and reset
//
//  EXPORTS:
//    initScenarioQuiz(config)
// ============================================================

// Module-level quiz pick state: { questionIndex: optionIndex }
const picks = {};

// ============================================================
//  WORKER 1 — scoreScenario
//  Single responsibility: compare chosen approach to best options
//  and display feedback.
// ============================================================
function scoreScenario(scenarios) {
  const scenario = scenarios[document.getElementById('scenarioSel')?.value];
  if (!scenario) return;
  const chosen = document.getElementById('approach')?.value;
  const good   = scenario.best.includes(chosen);
  const el     = document.getElementById('scenarioOut');
  if (!el) return;
  el.textContent = good
    ? `✅ Good choice — "${chosen}" works well here.\n\n${scenario.reason}`
    : `❌ Not the best fit.\n\nPrefer: ${scenario.best.join(' or ')}\n\n${scenario.reason}`;
}

// ============================================================
//  WORKER 2 — renderQuiz
//  Single responsibility: build quiz option DOM.
// ============================================================
function renderQuiz(quiz) {
  const box = document.getElementById('qBox');
  if (!box) return;
  box.innerHTML = '';
  // Clear picks on re-render
  Object.keys(picks).forEach(k => delete picks[k]);

  quiz.forEach((item, i) => {
    const wrap  = document.createElement('div');
    const qText = document.createElement('div');
    qText.className   = 'quiz-question-text';
    qText.textContent = `Q${i + 1}. ${item.q}`;
    wrap.appendChild(qText);

    item.opts.forEach((optText, oi) => {
      const el  = document.createElement('div');
      el.className  = 'opt';
      el.dataset.i  = i;
      el.dataset.oi = oi;

      const dot = document.createElement('span');
      dot.className = 'radio-dot';
      const lbl = document.createElement('span');
      lbl.textContent = optText;

      el.appendChild(dot);
      el.appendChild(lbl);

      el.addEventListener('click', () => {
        picks[i] = oi;
        box.querySelectorAll(`.opt[data-i="${i}"]`).forEach(x => x.classList.remove('sel','good','bad'));
        el.classList.add('sel');
      });

      wrap.appendChild(el);
    });

    box.appendChild(wrap);
  });
}

// ============================================================
//  WORKER 3 — gradeQuiz
//  Single responsibility: apply good/bad classes and show score.
// ============================================================
function gradeQuiz(quiz) {
  let correct = 0, unanswered = 0;
  document.querySelectorAll('.opt').forEach(el => el.classList.remove('good','bad'));

  quiz.forEach((item, i) => {
    const chosen = picks[i];
    if (chosen === undefined) { unanswered++; return; }
    const ok        = chosen === item.a;
    if (ok) correct++;
    const chosenEl  = document.querySelector(`.opt[data-i="${i}"][data-oi="${chosen}"]`);
    const correctEl = document.querySelector(`.opt[data-i="${i}"][data-oi="${item.a}"]`);
    if (chosenEl)          chosenEl.classList.add(ok ? 'good' : 'bad');
    if (!ok && correctEl)  correctEl.classList.add('good');
  });

  const total = quiz.length;
  let msg     = `Score: ${correct} / ${total}`;
  if (unanswered > 0)                msg += `  (${unanswered} unanswered)`;
  if (correct === total && !unanswered) msg += '  🎉 Perfect!';
  else if (correct >= Math.ceil(total * 0.75) && !unanswered) msg += '  👍 Great work!';

  const scoreEl = document.getElementById('qScore');
  if (scoreEl) scoreEl.textContent = msg;
}

// ============================================================
//  WORKER 4 — resetQuiz
//  Single responsibility: clear picks and re-render.
// ============================================================
function resetQuiz(quiz) {
  const scoreEl = document.getElementById('qScore');
  if (scoreEl) scoreEl.textContent = '';
  renderQuiz(quiz);
}

// ============================================================
//  ORCHESTRATOR — initScenarioQuiz
//  Wires scenario and quiz buttons.
// ============================================================
export function initScenarioQuiz(config) {
  renderQuiz(config.QUIZ);

  document.getElementById('scenarioBtn')?.addEventListener('click',  () => scoreScenario(config.SCENARIOS));
  document.getElementById('gradeBtn')?.addEventListener('click',     () => gradeQuiz(config.QUIZ));
  document.getElementById('resetQuizBtn')?.addEventListener('click', () => resetQuiz(config.QUIZ));
}