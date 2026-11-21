// The week calendar's header row can hold a page's own controls (calendar-feed.js WeekRowTools):
// the course home puts its calendar button before < > and its connection pill at the far right.
import assert from 'node:assert/strict';
import { registerHooks } from 'node:module';
import test from 'node:test';
import { installFakeDom } from '../../messages/tests/fake-dom.mjs';

// calendar-feed.js imports the chat's rich text helpers, which live outside this system; the row
// tools don't use them.
const RICH_TEXT = `data:text/javascript,${encodeURIComponent('export const linkify = (t) => t; export function renderRichMessage() {}')}`;
registerHooks({
  resolve(specifier, context, nextResolve) {
    const from = context.parentURL ? new URL(context.parentURL).pathname : '';
    if (from.endsWith('/announcement-calendar/calendar-feed.js') && specifier === '../rich-text.js') {
      return { url: RICH_TEXT, shortCircuit: true };
    }
    return nextResolve(specifier, context);
  },
});
const { WeekRowTools } = await import('../js/announcement-calendar/calendar-feed.js');

// The week view's header row as mountWeekView draws it: < and > first, then the week's title.
function weekRow(document) {
  const row = document.createElement('div');
  row.className = 'ocs__links';
  const button = (step) => {
    const node = document.createElement('button');
    node.setAttribute('data-step', step);
    return node;
  };
  const title = document.createElement('strong');
  title.setAttribute('data-hook', 'week-title');
  row.append(button('-1'), button('1'), title);
  const body = document.createElement('div');
  body.append(row);
  return { row, body };
}

const tag = (node) => node.getAttribute('data-step') ?? node.getAttribute('data-hook') ?? node.tagName;

test('controls placed at the start come before the < and > buttons, in order', () => {
  const { document } = installFakeDom();
  const { row } = weekRow(document);
  const calendar = document.createElement('a');
  calendar.setAttribute('data-hook', 'calendar-link');
  const today = document.createElement('span');
  today.setAttribute('data-hook', 'extra');
  WeekRowTools.place(row, { start: [calendar, today] });
  assert.deepEqual(row.children.map(tag), ['calendar-link', 'extra', '-1', '1', 'week-title']);
});

test('a control placed at the end sits at the far right of an ocs__card-header row', () => {
  const { document } = installFakeDom();
  const { row, body } = weekRow(document);
  const pill = document.createElement('span');
  pill.setAttribute('data-hook', 'status');
  const header = WeekRowTools.place(row, { end: pill });
  assert.equal(header.className, 'ocs__card-header');
  assert.equal(header.parentNode, body, 'the header takes the row\'s place');
  assert.deepEqual(header.children.map((node) => node.className || tag(node)), ['ocs__links', 'status']);
  assert.equal(row.parentNode, header);
});

test('without controls the row is left exactly as it was', () => {
  const { document } = installFakeDom();
  const { row, body } = weekRow(document);
  assert.equal(WeekRowTools.place(row, {}), row);
  assert.equal(row.parentNode, body);
  assert.deepEqual(row.children.map(tag), ['-1', '1', 'week-title']);
});

test('controls already on the page are moved into the row, not copied', () => {
  const { document } = installFakeDom();
  const { row } = weekRow(document);
  const holder = document.createElement('div');
  const calendar = document.createElement('a');
  const pill = document.createElement('span');
  holder.append(calendar, pill);
  WeekRowTools.place(row, { start: [calendar], end: pill });
  assert.equal(holder.childNodes.length, 0);
  assert.equal(calendar.parentNode, row);
  assert.equal(pill.parentNode, row.parentNode);
});
