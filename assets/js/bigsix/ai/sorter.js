// sorter.js
// RESPONSIBILITY: AI Use Case Sorter game (Step 6).
// Owns scenario data, card rendering, click evaluation, and score display.

const SCENARIOS = [
  { text: 'Summarize a 50-page research paper',      correct: 'good' },
  { text: 'Generate a legal contract for a startup',  correct: 'bad'  },
  { text: 'Write a SQL query for a database',         correct: 'good' },
  { text: 'Diagnose chest pain symptoms',             correct: 'bad'  },
  { text: 'Brainstorm app feature ideas',             correct: 'good' },
  { text: 'Calculate structural load for a bridge',   correct: 'bad'  },
];

let gameScore = 0;

// ── RESPONSIBILITY: Update the score counter in the DOM ───────────────────────
function updateScoreDisplay() {
  const el = document.getElementById('game-score');
  if (el) el.textContent = `${gameScore}/${SCENARIOS.length}`;
}

// ── RESPONSIBILITY: Evaluate one answer and apply the correct/incorrect style ─
function evaluateAnswer(card, correctAnswer, userChoice) {
  const isCorrect = userChoice === correctAnswer;
  card.classList.add(isCorrect ? 'correct' : 'incorrect');
  return isCorrect;
}

// ── RESPONSIBILITY: Handle a single card click — prompt, evaluate, update score
function handleCardClick(card, correctAnswer) {
  if (card.classList.contains('correct') || card.classList.contains('incorrect')) return;
  const userChoice = confirm(
    `Is "${card.textContent}" a GOOD use of AI?\n\nOK = Yes (good use)\nCancel = No (bad use)`
  ) ? 'good' : 'bad';
  if (evaluateAnswer(card, correctAnswer, userChoice)) gameScore++;
  updateScoreDisplay();
}

// ── RESPONSIBILITY: Build and insert all scenario cards into the container ────
function renderScenarioCards() {
  const container = document.getElementById('scenarios-container');
  if (!container) return;
  container.innerHTML = '';
  SCENARIOS.forEach(scenario => {
    const card        = document.createElement('div');
    card.className    = 'scenario-card';
    card.textContent  = scenario.text;
    card.onclick      = () => handleCardClick(card, scenario.correct);
    container.appendChild(card);
  });
}

// ── ORCHESTRATOR: Reset score + re-render all cards ───────────────────────────
export function resetGame() {
  gameScore = 0;
  renderScenarioCards();
  updateScoreDisplay();
}

// ── Init: called once on boot to render the first set of cards ────────────────
export function initSorter() {
  renderScenarioCards();
  updateScoreDisplay();
}

// Expose resetGame to inline HTML onclick attribute
window.resetGame = resetGame;