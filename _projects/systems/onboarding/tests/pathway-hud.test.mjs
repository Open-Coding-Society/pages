import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import { installFakeDom, fakeEvent } from '../../messages/tests/fake-dom.mjs';
import StatusPanel from '../../../../assets/js/GameEnginev1.1/essentials/StatusPanel.js';
import Present from '../../../games/cs-pathway/levels/Present.js';
import { profilePanelOptions, scoreboardOptions } from '../../../games/cs-pathway/levels/PathwayHud.js';

test('embedded profile stays in its host and keeps its fields and actions', t => {
  const previousDocument = globalThis.document;
  const previousWindow = globalThis.window;
  t.after(() => { globalThis.document = previousDocument; globalThis.window = previousWindow; });
  const { document } = installFakeDom();
  const profile = document.createElement('div');
  document.body.appendChild(profile);
  const details = { hidden: true };
  const hud = { profile, scores: {}, details };
  const env = { game: { environment: { pathwayHud: hud } } };
  let clicked = false;
  const panel = new StatusPanel({
    title: 'PLAYER PROFILE', fields: [{ key: 'name', label: 'Name' }],
    actions: [{ label: 'Save', onClick: () => { clicked = true; } }],
    ...profilePanelOptions(env),
  });
  const element = panel.render();
  Object.defineProperty(element, 'isConnected', { value: true });
  panel.update({ name: 'Student' });
  panel.actionElements[0].dispatchEvent(fakeEvent('click'));
  assert.equal(element.parentNode, profile);
  assert.equal(element.style.position, 'static');
  assert.equal(details.hidden, false);
  assert.equal(panel.fieldElements.get('name').textContent, 'Name: Student');
  assert.equal(clicked, true);
  assert.deepEqual(scoreboardOptions(env), { mountTo: hud.scores, showNextLevel: false });
  assert.deepEqual(profilePanelOptions({}), {});
  assert.deepEqual(scoreboardOptions({}), {});
  panel.destroy();
  assert.equal(profile.children.length, 0);
});

test('embedded presentation routes messages and hints without floating overlays', t => {
  const previousDocument = globalThis.document;
  const previousWindow = globalThis.window;
  t.after(() => { globalThis.document = previousDocument; globalThis.window = previousWindow; });
  const { document } = installFakeDom();
  document.getElementById = () => null;
  const messages = [];
  const hints = [];
  const hud = { setMessage: value => messages.push(value), setHint: value => hints.push(value) };
  let active = true;
  const present = new Present({ gameEnv: { game: { environment: { pathwayHud: hud } } } }, {
    ignoreToasts: ['Press E to interact'], isActiveLevel: () => active,
  });
  present.toast('Saved');
  present.toast('Press E to interact');
  present.alerts('Press E');
  active = false;
  present.toast('Stale');
  present.alerts('Stale');
  assert.deepEqual(messages, ['Saved']);
  assert.deepEqual(hints, ['Press E']);
  assert.equal(document.body.children.length, 0);
  present.clearAlerts();
  present.destroy();
  assert.deepEqual(hints, ['Press E', '', '']);
});

test('a lingering panel can be dismissed by hand', t => {
  const previousDocument = globalThis.document;
  const previousWindow = globalThis.window;
  t.after(() => { globalThis.document = previousDocument; globalThis.window = previousWindow; });
  const { document } = installFakeDom();
  document.getElementById = () => null;
  const present = new Present({ gameEnv: { game: { environment: {} } } }, {});
  const node = present.panel('CSP Creative computing, projects, and broader CS concepts.');
  assert.ok(document.body.children.includes(node));
  const dismiss = node.children.find(child => child.getAttribute('aria-label') === 'Dismiss this message');
  assert.ok(dismiss, 'the panel offers a dismiss button');
  assert.equal(dismiss.style.pointerEvents, 'auto');
  // Updating the panel keeps exactly one dismiss button.
  const updated = present.panel('Updated advice');
  assert.equal(updated.children.filter(child => child.getAttribute('aria-label') === 'Dismiss this message').length, 1);
  dismiss.dispatchEvent(fakeEvent('click'));
  assert.equal(document.body.children.length, 0);
  assert.equal(present.nodes.panel, null);
  // A dismissed panel stays dismissed until a station writes a new one.
  present.destroy();
});

test('embedded scores retain updates without creating standalone next-level links', t => {
  const previousDocument = globalThis.document;
  const previousWindow = globalThis.window;
  t.after(() => { globalThis.document = previousDocument; globalThis.window = previousWindow; });
  const { document, window } = installFakeDom();
  const scores = document.createElement('div');
  document.body.appendChild(scores);
  let linksShown = 0;
  class NextLevelLink {
    show() { linksShown++; }
    setComplete() {}
    destroy() {}
  }
  const source = readFileSync(new URL('../../../games/cs-pathway/levels/PathwayScoreboard.js', import.meta.url), 'utf8')
    .replace(/import\s*\{[\s\S]*?\}\s*from\s*['"][^'"]+['"];\s*/, '')
    .replace(/import NextLevelLink.*;\s*/, '')
    .replace('export default PathwayScoreboard;', 'globalThis.PathwayScoreboard = PathwayScoreboard;');
  const context = {
    document, window, NextLevelLink, SCORES_UPDATED_EVENT: 'scores-updated',
    PATHWAY_LEVELS: [{ key: 'identity-forge', name: 'Identity Forge', shortName: 'Forge' }],
    getNextLevel: () => ({ pagePath: '/next', name: 'Next' }),
    getCachedScores: () => ({ 'identity-forge': 42 }),
    syncScoresFromServer() {},
  };
  runInNewContext(source, context);
  const embedded = new context.PathwayScoreboard({ currentLevelKey: 'identity-forge', mountTo: scores, showNextLevel: false });
  embedded.show();
  assert.equal(linksShown, 0);
  assert.equal(scores.children.length, 1);
  assert.equal(embedded.percentElements.get('identity-forge').textContent, '42%');
  embedded.destroy();
  assert.equal(scores.children.length, 0);
  const standalone = new context.PathwayScoreboard({ currentLevelKey: 'identity-forge' });
  standalone.show();
  assert.equal(linksShown, 1);
  standalone.destroy();
});
