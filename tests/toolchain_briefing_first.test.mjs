import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const source = readFileSync(new URL('../_projects/games/cs-pathway/levels/StationVerificationTrial.js', import.meta.url), 'utf8');

test('the pairing code is offered only after the Mission Briefing', () => {
  const gate = source.indexOf('id="svt-briefing-gate"');
  const getCode = source.indexOf('id="svt-get-code-step" class="svt-hidden"');
  assert.ok(gate >= 0, 'the briefing gate is missing');
  assert.ok(getCode > gate, 'Get pairing code must start hidden, after the briefing gate');
  assert.match(source, /#svt-briefing-done'\)\.onclick = \(\) => this\._showGetCodeStep\(true\)/);
});

test('a first pairing shows the gate; a re-pair with a message goes straight to the code', () => {
  assert.match(source, /_showPairingStart\(message\) \{[\s\S]*?this\._showGetCodeStep\(Boolean\(message\)\);/);
});
