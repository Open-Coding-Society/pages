import test from 'node:test';
import assert from 'node:assert/strict';
import { pathwayEvidence, initPathwayEvidence } from '../js/profile-evidence.js';

test('evidence uses real completion flags without calling unfinished stations failures', () => {
  assert.deepEqual(pathwayEvidence(null), []);
  const evidence = Object.fromEntries(pathwayEvidence({ game_profile: {
    'identity-forge': { progress: { identityUnlocked: true } },
    'toolchain-trail': { progress: { stations: {
      'terminal-town-gate': 'complete',
      'compiler-canyon-forge': 'active',
    } } },
  } }));
  assert.equal(evidence['Identity terminal'], 'Passed');
  assert.equal(evidence['Avatar Forge'], 'Not yet passed');
  assert.equal(evidence['Terminal Town Gate'], 'Passed');
  assert.equal(evidence['Compiler Canyon Forge'], 'Not yet passed');
});

test('evidence load failure is visible', async () => {
  const previous = console.error;
  console.error = () => {};
  try {
    const status = {};
    await initPathwayEvidence({ profile: { gameProfile: async () => { throw new Error('HTTP 500'); } }, list: {}, status });
    assert.match(status.textContent, /HTTP 500/);
  } finally {
    console.error = previous;
  }
});
