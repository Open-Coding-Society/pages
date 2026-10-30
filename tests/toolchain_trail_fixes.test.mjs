import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

import { FIXES, STUCK_HELP, fixStepsFor, stuckHelpFor } from '../_projects/games/cs-pathway/data/toolchainTrailFixes.js';

// The check ids the agent sends (and the backend grades) live in collect_evidence().
const agent = readFileSync(new URL('../scripts/toolchain_agent.py', import.meta.url), 'utf8');
const evidence = agent.slice(agent.indexOf('def collect_evidence'), agent.indexOf('class AgentError'));
const CHECK_IDS = [...new Set([...evidence.matchAll(/\("([a-z][a-z-]*)", /g)].map((match) => match[1]))];
const GAME_OSES = ['windows', 'macos', 'linux', 'kasm'];

test('the agent check list was found', () => {
  assert.ok(CHECK_IDS.length >= 16, `only found ${CHECK_IDS.join(', ')}`);
});

test('every check the agent can fail has fix steps on every OS', () => {
  for (const id of CHECK_IDS) {
    for (const os of GAME_OSES) {
      assert.ok(fixStepsFor(id, os, 'AGENT').length > 0, `${id} has no fix steps on ${os}`);
    }
  }
});

test('fix steps have no unknown check ids', () => {
  assert.deepEqual(Object.keys(FIXES).filter((id) => !CHECK_IDS.includes(id)), []);
});

test('placeholders are filled with the OS project folder and the agent command', () => {
  const kasm = JSON.stringify(fixStepsFor('working-folder', 'kasm', 'python3 scripts/toolchain_agent.py'));
  assert.match(kasm, /cd ~\/opencs\/student/);
  assert.match(kasm, /python3 scripts\/toolchain_agent\.py/);
  for (const id of CHECK_IDS) {
    assert.doesNotMatch(JSON.stringify(fixStepsFor(id, 'macos', 'AGENT')), /\{project\}|\{agent\}/, id);
  }
});

test('the email placeholder would still be refused if pasted unchanged', () => {
  const [step] = fixStepsFor('git-email', 'linux', 'AGENT');
  assert.match(step.commands[0], /example\.com/); // the backend rejects example.com addresses
});

test('a missing pairing endpoint (404) sends the student to the practice check in plain words', () => {
  const notFound = Object.assign(new Error('Not Found'), { status: 404 });
  const [summary, ...steps] = stuckHelpFor(notFound);
  assert.match(summary, /server isn't ready/);
  assert.match(summary, /practice check/i);
  assert.doesNotMatch(summary, /Not Found|HTTP|404/);
  assert.ok(steps.some((step) => /Verify Output/.test(step)), 'names the button to click');
});

test('every pairing failure says what to do next', () => {
  const failure = (status) => Object.assign(new Error('x'), { status });
  assert.equal(stuckHelpFor(failure(401)), STUCK_HELP.notSignedIn);
  assert.equal(stuckHelpFor(failure(500)), STUCK_HELP.serverError);
  assert.equal(stuckHelpFor(new Error('unexpected response')), STUCK_HELP.serverError);
  assert.equal(stuckHelpFor(new TypeError('Failed to fetch')), STUCK_HELP.serverUnreachable);
  assert.match(STUCK_HELP.serverUnreachable.join(' '), /Practice Check/);
  assert.match(STUCK_HELP.serverUnreachable.join(' '), /Verify Output/);
  assert.equal(stuckHelpFor(new TypeError('Failed to fetch'), { localBackend: true }), STUCK_HELP.localBackendDown);
  for (const help of Object.values(STUCK_HELP)) assert.ok(help.length >= 2, 'has a next step');
});
