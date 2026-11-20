// Event text on /student/calendar comes from any signed-in account, so it must never run as
// code. CalendarSafeHtml escapes plain text and cleans HTML with DOMPurify, and when DOMPurify
// didn't load it escapes instead of passing the HTML through.
import test from 'node:test';
import assert from 'node:assert/strict';
import { CalendarSafeHtml } from '../js/CalendarSafeHtml.js';

const ATTACK = '<img src=x onerror=alert(1)>';

// A stand-in for DOMPurify that records what it was asked to clean.
function recordingPurifier(answer) {
  const calls = [];
  return {
    calls,
    sanitize(html, options) {
      calls.push({ html, options });
      return answer;
    },
  };
}

test('escape turns the five HTML characters into entities', () => {
  assert.equal(
    CalendarSafeHtml.escape(`<a title="x" class='y'>Q&A</a>`),
    '&lt;a title=&quot;x&quot; class=&#039;y&#039;&gt;Q&amp;A&lt;/a&gt;'
  );
});

test('escape gives an empty string for a missing value', () => {
  assert.equal(CalendarSafeHtml.escape(null), '');
  assert.equal(CalendarSafeHtml.escape(undefined), '');
  assert.equal(CalendarSafeHtml.escape(3), '3');
});

test('clean hands the HTML to DOMPurify and returns what it gives back', () => {
  const purifier = recordingPurifier('<b>Quiz</b>');
  assert.equal(CalendarSafeHtml.clean(`<b>Quiz</b>${ATTACK}`, purifier), '<b>Quiz</b>');
  assert.equal(purifier.calls.length, 1);
  assert.equal(purifier.calls[0].html, `<b>Quiz</b>${ATTACK}`);
});

test('clean asks DOMPurify to keep link targets, so description links still open in a new tab', () => {
  const purifier = recordingPurifier('');
  CalendarSafeHtml.clean('<a href="https://example.com" target="_blank" rel="noopener">x</a>', purifier);
  assert.deepEqual(purifier.calls[0].options, { ADD_ATTR: ['target'] });
});

test('clean escapes the HTML when DOMPurify did not load, instead of passing it through', () => {
  assert.equal(CalendarSafeHtml.clean(ATTACK, null), '&lt;img src=x onerror=alert(1)&gt;');
});

test('clean gives an empty string for an event with no description', () => {
  const purifier = recordingPurifier('should not be used');
  assert.equal(CalendarSafeHtml.clean('', purifier), '');
  assert.equal(CalendarSafeHtml.clean(null, purifier), '');
  assert.equal(purifier.calls.length, 0);
});
