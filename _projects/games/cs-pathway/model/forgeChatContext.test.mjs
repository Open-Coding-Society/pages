import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { FORGE_CHAT_STATIONS, buildForgeChatProgress } from './forgeChatContext.js';

test('the station helper sees Identity Forge stations with their completion', () => {
  const progress = buildForgeChatProgress({
    completedIds: ['identity', 'course'],
    activeGatekeeperId: 'PersonaHallGatekeeper',
  });
  assert.equal(progress.totalStations, 5);
  assert.deepEqual(progress.completedStations, ['Identity Terminal', 'Course Enlistment']);
  assert.equal(progress.stationName, 'Persona Hall');
  assert.equal(progress.stationStatus, 'active');
  assert.ok(progress.stationSteps.length > 0);
});

test('away from every gatekeeper the next unfinished station is the active one', () => {
  const progress = buildForgeChatProgress({ completedIds: ['identity'], activeGatekeeperId: null });
  assert.equal(progress.stationName, 'Course Enlistment');
});

test('with every task done and no gatekeeper in range the trail is finished', () => {
  const progress = buildForgeChatProgress({
    completedIds: FORGE_CHAT_STATIONS.map((station) => station.id),
    activeGatekeeperId: null,
  });
  assert.equal(progress.stationName, null);
  assert.equal(progress.completedStations.length, 5);
});

test('stations mirror the identity-forge tasks of pathwayScores', () => {
  // Read the source: importing pathwayScores.js would pull in the Spring API client.
  const source = readFileSync(new URL('./pathwayScores.js', import.meta.url), 'utf8');
  const tasks = source.match(/key: 'identity-forge',[^]*?tasks: \[([^\]]+)\]/)[1]
    .split(',').map((task) => task.trim().replace(/'/g, '')).filter(Boolean);
  assert.deepEqual(FORGE_CHAT_STATIONS.map((station) => station.id), tasks);
});
