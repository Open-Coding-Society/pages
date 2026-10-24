import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const source = await readFile(new URL('../_projects/games/cs-pathway/model/helpRequestMessage.js', import.meta.url), 'utf8');
const { buildHelpRequestMessage, MAX_HELP_MESSAGE_LENGTH } = await import(
  `data:text/javascript;charset=utf-8,${encodeURIComponent(source)}`
);

test('names the station, level, and operating system so the teacher knows where to go', () => {
  assert.equal(
    buildHelpRequestMessage({ levelName: 'Toolchain Trail', stationName: 'Git Village Hall', osLabel: 'Windows' }),
    'I need help at Git Village Hall in Toolchain Trail on Windows. Can you come help me?',
  );
});

test('says the student has been stuck when the station has gone stuck', () => {
  const message = buildHelpRequestMessage({ levelName: 'Toolchain Trail', stationName: 'Build Bridge', stuck: true });
  assert.match(message, /stuck here for a while/);
});

test('still reads naturally before a station or operating system is chosen', () => {
  assert.equal(
    buildHelpRequestMessage({ levelName: 'Toolchain Trail' }),
    'I need help in Toolchain Trail. Can you come help me?',
  );
});

test('never exceeds the length Spring accepts', () => {
  const message = buildHelpRequestMessage({ levelName: 'Toolchain Trail', stationName: 'x'.repeat(600) });
  assert.equal(message.length, MAX_HELP_MESSAGE_LENGTH);
});

test('fails fast without a level name', () => {
  assert.throws(() => buildHelpRequestMessage({}), /levelName/);
});
