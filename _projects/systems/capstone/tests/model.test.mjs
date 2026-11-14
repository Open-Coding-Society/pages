import assert from 'node:assert/strict';
import test from 'node:test';
import { matchesProject, normalizeSearch } from '../js/model.js';

test('search normalization ignores accents and letter case', () => {
  assert.equal(normalizeSearch('  Café Robotics  '), 'cafe robotics');
});

test('project filters combine course, school year, and every search word', () => {
  const project = {
    course: 'CSP',
    year: '2026-2027',
    text: 'Poway Veterans Organization accessibility chatbot',
  };
  assert.equal(matchesProject(project, { course: 'CSP', year: '2026-2027', query: 'veterans chat' }), true);
  assert.equal(matchesProject(project, { course: 'CSA', year: '2026-2027' }), false);
  assert.equal(matchesProject(project, { course: 'all', year: '2025-2026' }), false);
  assert.equal(matchesProject(project, { query: 'chatbot missing' }), false);
});
