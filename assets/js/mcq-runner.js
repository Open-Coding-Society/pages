/**
 * mcq-runner.js — the multiple-choice runner (_includes/runners/mcq.html).
 *
 * Students move between questions with tabs and may check an answer as often as they like.
 * Each check saves that answer, so the last saved answers are what Submit Code sends.
 *
 * Two localStorage entries, like the reflection runner's answer and draft:
 *   <storageKey>       the readable answers, read by runner-io.js and sent in the Gist
 *   <storageKey>_picks the chosen indexes, used to restore the runner on this device
 */

const LETTERS = 'ABCD';

/** Count of questions with a saved answer, and of those that are right. */
export function scoreMcq(questions, picks) {
  const answered = picks.filter((pick) => pick !== null).length;
  const correct = questions.filter((item, i) => picks[i] === item.answer).length;
  return { answered, correct };
}

/** One student's saved answers as text the grader can read away from the lesson page. */
export function formatMcqAnswers(questions, picks) {
  const { correct } = scoreMcq(questions, picks);
  const letters = picks.map((pick) => (pick === null ? '-' : LETTERS.charAt(pick))).join(',');
  const results = questions.map((item, i) => {
    const pick = picks[i];
    const lines = [`Question ${i + 1}: ${item.q}`];
    if (item.code) lines.push(item.code);
    if (pick === null) {
      lines.push('Last saved answer: none', 'Result: not answered');
    } else {
      lines.push(`Last saved answer: ${LETTERS.charAt(pick)}. ${item.choices[pick]}`);
      lines.push(`Result: ${pick === item.answer ? 'correct' : 'incorrect'}`);
    }
    return lines.join('\n');
  });
  return [`Score: ${correct}/${questions.length} | answers: ${letters}`, ...results].join('\n\n');
}

/** Restores saved picks; anything that no longer fits the questions counts as unanswered. */
export function parseMcqPicks(savedPicks, questions) {
  const blank = questions.map(() => null);
  if (!savedPicks) return blank;
  let saved;
  try {
    saved = JSON.parse(savedPicks);
  } catch (error) {
    console.warn('MCQ runner: saved answers were unreadable, starting over', error);
    return blank;
  }
  if (!Array.isArray(saved)) return blank;
  return blank.map((_, i) => (Number.isInteger(saved[i]) && questions[i].choices[saved[i]] !== undefined ? saved[i] : null));
}

/**
 * The answers to store after one check: what is saved now, with this question replaced.
 * Reads the saved answers rather than this page's copy, so a second open tab's work is kept.
 */
export function applyMcqPick(savedPicks, questions, index, pick) {
  const picks = parseMcqPicks(savedPicks, questions);
  picks[index] = pick;
  return picks;
}

function element(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

/**
 * @param {HTMLElement} container the .mcq-runner-container element
 * @param {Array<{q: string, code?: string, choices: string[], answer: number, why?: string, ref?: string}>} questions
 */
export function mountMcqRunner(container, questions) {
  const root = container.querySelector('[data-mcq-root]');
  const { storageKey } = container.dataset;
  const picksKey = `${storageKey}_picks`;
  const sentWith = container.dataset.bundled === 'true'
    ? 'Sent when you click Submit Code at the bottom of the page.'
    : 'Saved on this device.';
  const picks = parseMcqPicks(localStorage.getItem(picksKey), questions);
  let index = 0;

  const tabs = element('ul', 'mcq-runner-tabs');
  const tabButtons = questions.map((_, i) => {
    const button = element('button', 'mcq-runner-tab', `Q${i + 1}`);
    button.type = 'button';
    button.addEventListener('click', () => showQuestion(i));
    const item = element('li');
    item.appendChild(button);
    tabs.appendChild(item);
    return button;
  });
  const pane = element('div');
  const status = element('p', 'ocs__dnd-progress');
  status.setAttribute('role', 'status');
  root.append(tabs, pane, status);

  function feedbackFor(i) {
    const item = questions[i];
    if (picks[i] === null) return '';
    if (picks[i] === item.answer) return 'Correct.';
    return `Not quite. Try again.${item.ref ? ` (Review ${item.ref}.)` : ''}`;
  }

  function resultOf(i) {
    if (picks[i] === null) return null;
    return picks[i] === questions[i].answer ? 'correct' : 'wrong';
  }

  function showProgress() {
    tabButtons.forEach((button, i) => {
      const result = resultOf(i);
      button.classList.toggle('is-active', i === index);
      button.classList.toggle('is-correct', result === 'correct');
      button.classList.toggle('is-wrong', result === 'wrong');
      // The color alone says nothing to a screen reader.
      button.setAttribute('aria-label', `Question ${i + 1}${result ? `, ${result}` : ''}`);
      if (i === index) button.setAttribute('aria-current', 'true');
      else button.removeAttribute('aria-current');
    });
    const { answered, correct } = scoreMcq(questions, picks);
    status.textContent = answered === 0
      ? 'No answers saved yet. Checking an answer saves it.'
      : `Saved ${answered} of ${questions.length} answers, ${correct} correct. ${sentWith}`;
  }

  // Saves before updating the page, so the page never shows an answer that was not stored.
  function saveAnswer(i, pick) {
    const nextPicks = applyMcqPick(localStorage.getItem(picksKey), questions, i, pick);
    localStorage.setItem(storageKey, formatMcqAnswers(questions, nextPicks));
    localStorage.setItem(picksKey, JSON.stringify(nextPicks));
    picks.splice(0, picks.length, ...nextPicks);
  }

  function showQuestion(i) {
    index = i;
    const item = questions[i];
    pane.replaceChildren();
    pane.appendChild(element('p', 'ocs__dnd-progress', `Question ${i + 1} of ${questions.length}`));
    pane.appendChild(element('p', 'ocs__dnd-status', item.q));
    if (item.code) {
      const pre = element('pre');
      pre.appendChild(element('code', '', item.code));
      pane.appendChild(pre);
    }

    let selected = picks[i];
    const form = element('form');
    const panel = element('div', 'ocs__dnd-panel');
    const choiceButtons = item.choices.map((choice, j) => {
      const choiceButton = element('button', 'ocs__drop-btn', `${LETTERS.charAt(j)}. ${choice}`);
      choiceButton.type = 'button';
      choiceButton.addEventListener('click', () => {
        selected = j;
        markSelected();
      });
      panel.appendChild(choiceButton);
      return choiceButton;
    });
    const feedback = element('p', 'ocs__dnd-progress', feedbackFor(i));
    feedback.setAttribute('aria-live', 'polite');
    const buttons = element('div');
    const check = element('button', 'ocs__dnd-reset', 'Check answer');
    check.type = 'submit';
    buttons.appendChild(check);
    if (i + 1 < questions.length) {
      const next = element('button', 'ocs__dnd-reset', 'Next question');
      next.type = 'button';
      next.addEventListener('click', () => showQuestion(i + 1));
      buttons.append(' ', next);
    }
    form.append(panel, feedback, buttons);

    function markSelected() {
      choiceButtons.forEach((choiceButton, j) => {
        choiceButton.classList.toggle('is-over', j === selected);
        choiceButton.setAttribute('aria-pressed', String(j === selected));
      });
    }

    // A right answer is final, so a later click cannot replace it with a wrong one.
    function lockIfCorrect() {
      if (picks[i] !== item.answer) return;
      choiceButtons.forEach((choiceButton) => { choiceButton.disabled = true; });
      choiceButtons[item.answer].classList.add('is-filled');
      // <small>, not <span>: theme presets recolor every span, which can hide text on a filled button.
      if (item.why) choiceButtons[item.answer].appendChild(element('small', 'mcq-runner-why', item.why));
      check.remove();
    }

    form.addEventListener('submit', (event) => {
      event.preventDefault();
      if (selected === null) {
        feedback.textContent = 'Pick an answer first.';
        return;
      }
      try {
        saveAnswer(i, selected);
      } catch (error) {
        console.error(`MCQ ${container.id}: answer could not be saved`, error);
        feedback.textContent = `Could not save your answer: ${error.message}`;
        return;
      }
      feedback.textContent = feedbackFor(i);
      lockIfCorrect();
      showProgress();
    });

    pane.appendChild(form);
    markSelected();
    lockIfCorrect();
    showProgress();
  }

  showQuestion(0);
}
