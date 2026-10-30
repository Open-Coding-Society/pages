// The Lesson Summary the teaching team sees after grading: average ratings and the
// anonymous pros and grows, drawn from summarize() in the model. Comments are set
// with textContent because they are student-written.
import { MAX_RATING, MIN_RESPONSES_FOR_SUMMARY, RATINGS } from './lesson-feedback-model.js';

function element(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

function averagesTable(averages) {
  const wrap = element('div', 'ocs__table-wrap');
  const table = element('table', 'ocs__table');
  const head = element('thead');
  const headRow = element('tr');
  headRow.append(element('th', null, 'Rating'), element('th', null, `Average (out of ${MAX_RATING})`));
  head.append(headRow);
  const body = element('tbody');
  for (const rating of RATINGS) {
    const row = element('tr');
    row.append(element('td', null, rating.label), element('td', null, averages[rating.key].toFixed(2)));
    body.append(row);
  }
  table.append(head, body);
  wrap.append(table);
  return wrap;
}

function commentList(title, comments) {
  const section = element('div', 'ocs__stack');
  section.append(element('h3', null, title));
  const list = element('ul');
  for (const comment of comments) list.append(element('li', null, comment));
  section.append(list);
  return section;
}

/** Builds the Lesson Summary card for one lesson from summarize()'s result. */
export function createLessonSummary(summary) {
  const card = element('section', 'ocs__card');
  const header = element('div', 'ocs__card-header');
  header.append(element('h2', 'ocs__section-title', 'Lesson Summary'));
  card.append(header);

  const body = element('div', 'ocs__stack');
  const responses = `${summary.responseCount} ${summary.responseCount === 1 ? 'student' : 'students'}`;
  if (!summary.released) {
    body.append(element('p', 'ocs__callout',
      `The Lesson Summary appears after grading, once at least ${MIN_RESPONSES_FOR_SUMMARY} students have finished their feedback. ${responses} so far.`));
    card.append(body);
    return card;
  }
  body.append(element('p', 'ocs__description',
    `From ${responses}. Comments are anonymous and shown in a random order.`));
  body.append(averagesTable(summary.averages));
  body.append(commentList('Pros', summary.pros));
  body.append(commentList('Grows', summary.grows));
  card.append(body);
  return card;
}
