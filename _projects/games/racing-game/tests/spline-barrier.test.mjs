import test from 'node:test';
import assert from 'node:assert/strict';
import SplineBarrier from '@assets/js/GameEnginev1.1/essentials/SplineBarrier.js';
import TutorialPlayer from '../levels/TutorialPlayer.js';

test('spline barriers resolve collisions for tutorial player subclasses', () => {
    const player = Object.create(TutorialPlayer.prototype);
    const pushedPlayers = [];
    const barrier = Object.create(SplineBarrier.prototype);
    barrier.gameEnv = { gameObjects: [player] };
    barrier.getCanvasPoints = () => [{ x: 0, y: 0 }, { x: 1, y: 1 }];
    barrier.pushPlayerOffCurve = (candidate) => pushedPlayers.push(candidate);

    barrier.resolvePlayerCollision();

    assert.deepEqual(pushedPlayers, [player]);
});
