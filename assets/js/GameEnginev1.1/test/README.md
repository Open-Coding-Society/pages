# Player keyboard tests

Run from the repository root with Node.js 22.15+ (or a current LTS).
No npm dependencies, browser, or site build are needed:

```sh
node --import ./assets/js/GameEnginev1.1/test/register-assets.mjs --test assets/js/GameEnginev1.1/test/*.test.mjs _projects/games/racing-game/tests/racing-player.test.mjs _projects/games/platformer/tests/*.test.mjs
```

## Shared behavior

`Character` owns the optional behavior-controller contract:
`setController({ update(character) { ... } })`, `updateController()`, and
`applyControlActions({ up, down, left, right })`. Actions are boolean snapshots;
omitted actions release their controls. The engine adapts actions to the
existing key mapping without synthesizing DOM keyboard events. RPG, Driver,
and Platformer interpret the same actions using their own movement rules.
Controllers run once before movement, do not advance while paused, and own
input until `setController(null)` restores keyboard control. With no controller,
existing input behavior is unchanged.

```javascript
player.setController({
  update(character) {
    character.applyControlActions({ right: true });
  },
});
// Later, release the bot's controls and accept keyboard input again.
player.setController(null);
```

For Player, right means moving right; for PlayerDriver, it means steering
right; for PlayerPlatformer, it means running right. Navigation and patrol
policies choose these actions; they do not replace movement or collision rules.
The low-level Character hook also accepts behaviors that manipulate its velocity
directly; the action-to-key adapter requires a Player's key mapping and movement
methods.

RacingBot is the first example: its controller invokes the Autumn route policy.
Race-start waiting, finish rules, and spin recovery remain game-owned.
`AutumnBotGenetics.js` also contains offline training, simulation, and track
geometry; its length is not the size of the shared bot API. Those algorithms
remain outside Character. NPC patrols can adopt the same controller hook
without requiring a bot subclass; custom update loops must call
`updateController()` before their movement, avoiding a second invocation in
the parent update.

`essentials/Player.js` already accepts `data.keypress` for remapping. It also
prevents browser scrolling for movement arrows assigned to that player.
Unassigned arrows, typing fields, browser shortcuts, and paused/detached games
retain their browser defaults. This cancels the default browser action, not
event propagation or the engine's existing movement handling.

`essentials/PlayerDriver.js` extends `Player` with throttle, braking, coasting,
reverse, and steering controls. It accepts optional `data.driverPhysics`
overrides; specialized games can also override the physics values after
construction.

`essentials/PlayerPlatformer.js` is a starter for side-view movement: mapped
left/right keys move horizontally, up jumps once per press while supported,
and gravity applies even when moving. Down does not fly or crouch. It keeps
`Player.js` unchanged and disables its legacy gravity pass.

The platformer game extends it in
`_projects/games/platformer/levels/PlatformerPlayer.js`, using the engine's
inherited circular collision detector, with platform contact responses,
jump sound, and debug overlay local. The shared detector uses circle-to-rectangle
contact for `Barrier` surfaces (zero reduction by default), so wide floors are
solid across their full width. Characters remain circular, including at platform
corners; character-to-character collision is unchanged. Tangent Barrier contact
counts as support, and contact faces come from the closest surface rather than
overlapping sprite extents. There is no game-specific detector or support probe.
A new
game must supply support/collision handling: override `hasSupport()` when
needed, position the player on landing, then call `land()`; on an underside
contact, position the player below the platform and call `hitCeiling()`.
Override `onJump()` for sound or effects. Positive `verticalVelocity` means
upward; `gravityAcceleration` and `jumpVelocity` are configurable through data.
Physics retains the existing game's per-update units, not seconds.

Student extension points include animation states, crouching, jump height,
and platform contact responses using the shared engine detector. Keep game-specific assets and
effects out of the engine, and test landings, ceilings, walking off edges,
and held/released jump keys before changing collision behavior.

Games can still override `handleKeyDown` and call `super.handleKeyDown(event)`.
For example, RacingPlayer additionally rejects movement input during typing,
shortcuts, pauses, or after its container is detached. Those guards remain in
the racing subclass. Keyup must still reach the engine to clear held keys.

## Testing a game without pressing keys

The helper calls the **real keyboard and movement methods** with synthetic
event objects. It does not simulate an operating-system keyboard press.

```js
import test from 'node:test';
import assert from 'node:assert/strict';
import { createKeyboardPlayer, pressKey, releaseKey } from '@assets/js/GameEnginev1.1/test/keyboard-test-helper.mjs';

test('W moves up until released', () => {
    const player = createKeyboardPlayer();           // Arrange
    const event = pressKey(player, 87);               // Act
    assert.equal(player.velocity.y, -5);              // Assert
    assert.equal(event.defaultPrevented, false);
    releaseKey(player, 87);
    assert.equal(player.velocity.y, 0);
});
```

For another mapping or a game subclass:

```js
const player = createKeyboardPlayer(MyPlayer, {
    keypress: { up: 38, left: 37, down: 40, right: 39 },
    xVelocity: 3,
    yVelocity: 3,
});
const event = pressKey(player, 38, { target: { tagName: 'INPUT' } });
```

Use `@assets` for shared engine imports and relative paths for your game's
own source:

```js
import MyPlayer from '../levels/MyPlayer.js';
import { createKeyboardPlayer, pressKey, releaseKey } from '@assets/js/GameEnginev1.1/test/keyboard-test-helper.mjs';
```

The command's `--import` preloads `register-assets.mjs`, which uses Node's
`registerHooks` API to resolve `@assets/` to the real assets directory before
tests load. The alias works for static and later dynamic imports throughout
the test process, without replacing classes or source code. Node does not
read the browser's import map, so the preload is required for these tests.
Keep production aliases: project builds relocate game modules, so relative
engine imports that work in source may break after publishing.

### How the fixture works (and its limits)

`Object.create(PlayerType.prototype)` preserves the real class's methods and
inheritance but skips constructors that need canvas, window listeners, and
touch controls. The helper supplies only keyboard state, a real Transform,
an active game environment, and movement speeds. Supply any extra state
required by your subclass in its test. This is a keyboard unit-test fixture,
not a replacement game environment or a fully constructed Player.

Unlike the former racing test, no source imports are rewritten, no engine
class is stubbed, and no Base64 modules are injected. Assertions can check
actual velocity, direction, pressed keys, and whether scrolling was canceled.

These tests do **not** verify constructor setup, DOM event dispatch, rendering,
touch controls, collisions, or visible page scrolling. Check those in a browser:
with an arrow-controlled game on a scrollable page, Up/Down should move the
player without moving the page; typing, shortcuts, and inactive-game navigation
should retain their browser defaults.
