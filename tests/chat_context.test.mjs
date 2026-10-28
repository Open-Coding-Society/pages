import { test } from 'node:test';
import assert from 'node:assert/strict';

import {
  buildChatProgress,
  chatGreeting,
  describeStep,
  recentHistory,
  MAX_CHAT_HISTORY_TURNS,
} from '../_projects/games/cs-pathway/model/chatContext.js';

const stations = [
  { id: 'terminal-town-gate', name: 'Terminal Town Gate' },
  { id: 'git-village-hall', name: 'Git Village Hall' },
  { id: 'python-port', name: 'Python Port' },
];
const gitStation = {
  id: 'git-village-hall',
  name: 'Git Village Hall',
  skill: 'Version control with git',
  instructions: ['Open a terminal.', { text: 'Check git:', commands: ['git --version'] }],
};

test('progress names the current station, what is done, and the OS', () => {
  const progress = buildChatProgress({
    stations,
    completedIds: new Set(['terminal-town-gate']),
    activeStation: gitStation,
    osLabel: 'macOS',
  });
  assert.deepEqual(progress, {
    stationName: 'Git Village Hall',
    stationSkill: 'Version control with git',
    stationStatus: 'active',
    os: 'macOS',
    completedStations: ['Terminal Town Gate'],
    totalStations: 3,
    stationSteps: ['Open a terminal.', 'Check git: git --version'],
    failedChecks: [],
  });
});

test('a failed check at the station is reported, and wins over stuck', () => {
  const progress = buildChatProgress({
    stations,
    completedIds: [],
    activeStation: gitStation,
    activeStatus: 'stuck',
    failure: { line: 'git: command not found' },
  });
  assert.equal(progress.stationStatus, 'failed');
  assert.deepEqual(progress.failedChecks, ['git: command not found']);
});

test('a finished trail has no current station', () => {
  const progress = buildChatProgress({ stations, completedIds: stations.map((s) => s.id), activeStation: null });
  assert.equal(progress.stationName, null);
  assert.equal(progress.stationStatus, null);
  assert.deepEqual(progress.stationSteps, []);
  assert.match(chatGreeting(progress), /finished the trail \(3 of 3 stations verified\)/);
});

test('completed stations keep trail order, whatever order they were finished in', () => {
  const progress = buildChatProgress({ stations, completedIds: ['python-port', 'terminal-town-gate'], activeStation: gitStation });
  assert.deepEqual(progress.completedStations, ['Terminal Town Gate', 'Python Port']);
});

test('the greeting tells the student where they are', () => {
  const progress = buildChatProgress({ stations, completedIds: ['terminal-town-gate'], activeStation: gitStation });
  assert.equal(chatGreeting(progress), "You're at Git Village Hall (1 of 3 stations verified). Ask me anything about this station.");
  const failed = buildChatProgress({ stations, completedIds: [], activeStation: gitStation, failure: { line: 'x' } });
  assert.match(chatGreeting(failed), /A check failed there/);
});

test('steps become one line each, commands included', () => {
  assert.equal(describeStep('Open Terminal.'), 'Open Terminal.');
  assert.equal(describeStep({ text: 'Run both:', commands: ['a', 'b'] }), 'Run both: a b');
  assert.equal(describeStep({ commands: ['pwd'] }), 'pwd');
});

test('history sent to the server skips local notices and keeps only the last turns', () => {
  const turns = [{ role: 'helper', text: 'Hi!', local: true }];
  for (let i = 0; i < 10; i += 1) turns.push({ role: i % 2 ? 'helper' : 'student', text: `turn ${i}`, element: {} });
  turns.push({ role: 'helper', text: 'Busy, try again', local: true });

  const history = recentHistory(turns);
  assert.equal(history.length, MAX_CHAT_HISTORY_TURNS);
  assert.deepEqual(history[0], { role: 'student', text: 'turn 2' });
  assert.ok(history.every((turn) => !('local' in turn) && !('element' in turn)), 'only role and text are sent');
});

test('progress needs the station list', () => {
  assert.throws(() => buildChatProgress({ completedIds: [] }), /list of stations/);
});
