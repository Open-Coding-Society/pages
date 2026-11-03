// The Lesson Summary teachers see on the Teacher Dashboard, drawn from summarize()'s
// shape (the model) or fromSummaryResponse(): a diverging stacked bar per rating
// (1-2 left of the centre line, 3 split across it, 4-5 right), the average beside
// it, a table view of the same counts, and the pros and grows without names.
//
// Colors are classes styled in sass/main.scss (validated with the dataviz palette
// checks in both themes). Counts inside a segment sit in a <b>, not a span or div,
// because theme presets recolor those with !important. Every text is textContent:
// comments are student-written.
import { MAX_RATING, MIN_RATING, RATINGS, SCALE_HINT } from './lesson-feedback-model.js';

const NEUTRAL = Math.round((MIN_RATING + MAX_RATING) / 2);
const SCALE_WORDS = SCALE_HINT.split(' · ').map(part => part.replace(/^\d+\s*/, ''));
// A count is drawn inside its segment only when the segment is at least this wide.
const MIN_LABEL_WIDTH_PERCENT = 7;

function element(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

const valueName = value => `${value} ${SCALE_WORDS[value - MIN_RATING] || ''}`.trim();
const students = count => `${count} ${count === 1 ? 'student' : 'students'}`;

/**
 * Where each value's segment sits on a 0-100 track whose centre (50) is the middle of
 * the neutral value. Half the track stands for every response, so the widest a bar can
 * reach on one side is 50. Returns [{ value, count, left, width }] for values with counts.
 */
export function divergingSegments(counts, responseCount) {
  if (!responseCount) return [];
  const width = count => (count / responseCount) * 50;
  const below = counts.slice(0, NEUTRAL - MIN_RATING).reduce((total, count) => total + count, 0);
  let left = 50 - width(below + counts[NEUTRAL - MIN_RATING] / 2);
  const segments = [];
  counts.forEach((count, index) => {
    if (count > 0) segments.push({ value: index + MIN_RATING, count, left, width: width(count) });
    left += width(count);
  });
  return segments;
}

function legend() {
  const list = element('ul', 'lesson-summary__legend');
  list.setAttribute('aria-label', 'Rating scale');
  for (let value = MIN_RATING; value <= MAX_RATING; value += 1) {
    const item = element('li');
    item.append(element('i', `lesson-summary__swatch lesson-summary--v${value}`), document.createTextNode(valueName(value)));
    list.append(item);
  }
  return list;
}

function chartRow(rating, counts, average, responseCount) {
  const row = element('div', 'lesson-summary__row');
  row.append(element('strong', 'lesson-summary__label', rating.label));
  const track = element('div', 'lesson-summary__track');
  for (const segment of divergingSegments(counts, responseCount)) {
    const share = Math.round((segment.count / responseCount) * 100);
    const tip = `${rating.label} · ${valueName(segment.value)}: ${students(segment.count)} (${share}%)`;
    const mark = element('div', `lesson-summary__segment lesson-summary--v${segment.value}`);
    mark.style.left = `${segment.left}%`;
    mark.style.width = `${segment.width}%`;
    mark.tabIndex = 0;
    mark.dataset.tip = tip;
    mark.setAttribute('aria-label', tip);
    if (segment.width >= MIN_LABEL_WIDTH_PERCENT) mark.append(element('b', null, String(segment.count)));
    track.append(mark);
  }
  row.append(track, element('strong', 'lesson-summary__average', average.toFixed(2)));
  return row;
}

// One tooltip per chart, moved to whichever segment is hovered or focused.
function attachTooltip(figure) {
  const tooltip = element('p', 'lesson-summary__tooltip');
  tooltip.setAttribute('role', 'tooltip');
  tooltip.hidden = true;
  figure.append(tooltip);
  const show = event => {
    const mark = event.target.closest?.('.lesson-summary__segment');
    if (!mark) return;
    tooltip.textContent = mark.dataset.tip;
    tooltip.hidden = false;
    const box = figure.getBoundingClientRect();
    const target = mark.getBoundingClientRect();
    tooltip.style.left = `${target.left - box.left + target.width / 2}px`;
    tooltip.style.top = `${target.top - box.top}px`;
  };
  const hide = () => { tooltip.hidden = true; };
  figure.addEventListener('pointerover', show);
  figure.addEventListener('focusin', show);
  figure.addEventListener('pointerleave', hide);
  figure.addEventListener('focusout', hide);
}

function chart(summary) {
  const figure = element('figure', 'lesson-summary__chart');
  figure.append(element('figcaption', 'ocs__description',
    `How students rated each part, from 1 (${SCALE_WORDS[0]}) to ${MAX_RATING} (${SCALE_WORDS.at(-1)}). The number at the right is the average.`));
  figure.append(legend());
  const rows = element('div', 'lesson-summary__rows');
  for (const rating of RATINGS) {
    rows.append(chartRow(rating, summary.counts[rating.key], summary.averages[rating.key], summary.responseCount));
  }
  figure.append(rows);
  attachTooltip(figure);
  return figure;
}

function tableView(summary) {
  const details = element('details', 'lesson-summary__table');
  details.append(element('summary', null, 'Table view'));
  const wrap = element('div', 'ocs__table-wrap');
  const table = element('table', 'ocs__table');
  const headRow = element('tr');
  headRow.append(element('th', null, 'Rating'));
  for (let value = MIN_RATING; value <= MAX_RATING; value += 1) headRow.append(element('th', null, valueName(value)));
  headRow.append(element('th', null, `Average (out of ${MAX_RATING})`));
  const head = element('thead');
  head.append(headRow);
  const body = element('tbody');
  for (const rating of RATINGS) {
    const row = element('tr');
    row.append(element('td', null, rating.label));
    for (const count of summary.counts[rating.key]) row.append(element('td', null, String(count)));
    row.append(element('td', null, summary.averages[rating.key].toFixed(2)));
    body.append(row);
  }
  table.append(head, body);
  wrap.append(table);
  details.append(wrap);
  return details;
}

function commentList(title, comments) {
  const section = element('div', 'ocs__stack');
  section.append(element('h3', null, title));
  const list = element('ul');
  for (const comment of comments) list.append(element('li', null, comment));
  section.append(list);
  return section;
}

/**
 * Builds the Lesson Summary for one lesson. `light` switches the chart to the steps
 * validated for light backgrounds (the page decides from the site theme). `titled:
 * false` leaves out the card and its heading, for a dialog that already has a title.
 */
export function createLessonSummary(summary, { light = false, titled = true } = {}) {
  const card = element('section', `${titled ? 'ocs__card ' : ''}lesson-summary${light ? ' lesson-summary--light' : ''}`);
  if (titled) {
    const header = element('div', 'ocs__card-header');
    header.append(element('h2', 'ocs__section-title', 'Lesson Summary'));
    card.append(header);
  }

  const body = element('div', 'ocs__stack');
  if (!summary.responseCount) {
    body.append(element('p', 'ocs__callout', 'No student has finished their feedback yet. This updates as students submit.'));
    card.append(body);
    return card;
  }
  body.append(element('p', 'ocs__description',
    `From ${students(summary.responseCount)} who finished their feedback. Comments have no names and are shown in a random order.`));
  body.append(chart(summary), tableView(summary));
  body.append(commentList('Pros', summary.pros));
  body.append(commentList('Grows', summary.grows));
  card.append(body);
  return card;
}
