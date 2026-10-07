/**
 * @module code-generator
 * @description
 * Converts a GameBuilder document into a JavaScript level module accepted by
 * the shared GAME_RUNNER and GameEngine. Definitions for the background,
 * player, each NPC, and each spline barrier are emitted separately from the
 * `this.classes` list.
 *
 * @data
 * Inputs are a schema-versioned builder document and the catalog produced by
 * `asset-catalog.mjs`. Successful output contains `GameControl` and
 * `gameLevelClasses` exports, engine imports, resolved asset URLs, and
 * separate data objects for configured NPCs and normalized spline barriers.
 * Invalid input returns structured validation errors without generated code.
 *
 * @usage
 * Call `generateLevelCode(state, catalog)` after reading the form. If
 * `errors` is empty, pass `code` to GAME_RUNNER's page-scoped `setCode`
 * controller method; otherwise present the returned messages to the user.
 */
import { validateBuilderState } from './builder-state.mjs';

const quote = (value) => JSON.stringify(value);

function directionData(sprite) {
  const frameCount = Math.min(3, sprite.cols);
  if (sprite.movementPreset === 'single-row') {
    const singleRow = `{ row: 0, start: 0, columns: ${frameCount} }`;
    return Object.fromEntries(
      ['down', 'downRight', 'downLeft', 'right', 'left', 'up', 'upRight', 'upLeft']
        .map((direction) => [direction, singleRow])
    );
  }

  const row = (value) => Math.min(value, sprite.rows - 1);
  return {
    down: `{ row: ${row(0)}, start: 0, columns: ${frameCount} }`,
    downRight: `{ row: ${row(1)}, start: 0, columns: ${frameCount}, rotate: Math.PI / 16 }`,
    downLeft: `{ row: ${row(2)}, start: 0, columns: ${frameCount}, rotate: -Math.PI / 16 }`,
    right: `{ row: ${row(1)}, start: 0, columns: ${frameCount} }`,
    left: `{ row: ${row(2)}, start: 0, columns: ${frameCount} }`,
    up: `{ row: ${row(3)}, start: 0, columns: ${frameCount} }`,
    upRight: `{ row: ${row(1)}, start: 0, columns: ${frameCount}, rotate: -Math.PI / 16 }`,
    upLeft: `{ row: ${row(2)}, start: 0, columns: ${frameCount}, rotate: Math.PI / 16 }`
  };
}

export function generateLevelCode(state, catalog) {
  const errors = validateBuilderState(state, catalog);
  if (errors.length > 0) {
    return { code: null, errors };
  }

  const background = catalog.backgrounds.get(state.backgroundKey);
  const sprite = catalog.sprites.get(state.player.spriteKey);
  const movement = directionData(sprite);
  const directions = Object.entries(movement)
    .map(([name, config]) => `      ${name}: ${config},`)
    .join('\n');
  const className = 'GameLevelBuilder';
  const playerId = state.player.name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '_');
  const npcDefinitions = state.npcs.map((npc, index) => {
    const npcSprite = catalog.sprites.get(npc.spriteKey);
    const npcId = `${npc.id}_${npc.name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '_')}`;
    const npcDown = directionData(npcSprite).down;
    return `    const npcData${index + 1} = {
      id: ${quote(npcId)},
      greeting: ${quote(npc.greeting.trim() || 'Hello, traveler!')},
      src: path + ${quote(npcSprite.src)},
      SCALE_FACTOR: ${npcSprite.scaleFactor},
      ANIMATION_FPS: 8,
      INIT_POSITION: { x: ${npc.position.x}, y: ${npc.position.y} },
      orientation: { rows: ${npcSprite.rows}, columns: ${npcSprite.cols} },
      down: ${npcDown},
      hitbox: { widthPercentage: 0.1, heightPercentage: 0.2 }
    };`;
  });
  const barrierDefinitions = state.barriers.map((barrier, index) => `    const barrierData${index + 1} = {
      id: ${quote(barrier.id)},
      coordinateSpace: "normalized",
      ${barrier.visible === false ? 'visible: false,\n      ' : ''}splinePoints: ${JSON.stringify(barrier.points)}
    };`);

  const npcImport = state.npcs.length > 0
    ? "import Npc from '/assets/js/GameEnginev1.1/essentials/Npc.js';\n"
    : '';
  const barrierImport = state.barriers.length > 0
    ? "import SplineBarrier from '/assets/js/GameEnginev1.1/essentials/SplineBarrier.js';\n"
    : '';
  const npcDefinitionsCode = npcDefinitions.length > 0
    ? `\n${npcDefinitions.join('\n')}\n`
    : '';
  const barrierDefinitionsCode = barrierDefinitions.length > 0
    ? `\n${barrierDefinitions.join('\n')}\n`
    : '';
  const npcEntries = state.npcs
    .map((_, index) => `      { class: Npc, data: npcData${index + 1} }`)
    .join(',\n');
  const npcClassesCode = npcEntries ? `,\n${npcEntries}` : '';
  const barrierEntries = state.barriers
    .map((_, index) => `      { class: SplineBarrier, data: barrierData${index + 1} }`)
    .join(',\n');
  const barrierClassesCode = barrierEntries ? `,\n${barrierEntries}` : '';
  const code = `import GameControl from '/assets/js/GameEnginev1.1/essentials/GameControl.js';
import GameEnvBackground from '/assets/js/GameEnginev1.1/essentials/GameEnvBackground.js';
import Player from '/assets/js/GameEnginev1.1/essentials/Player.js';
${npcImport}${barrierImport}

class ${className} {
  static displayName = ${quote(state.name.trim())};

  constructor(gameEnv) {
    const path = gameEnv.path;
    const backgroundData = {
      name: ${quote(background.name)},
      src: path + ${quote(background.src)}
    };
    const playerData = {
      id: ${quote(playerId || 'player')},
      src: path + ${quote(sprite.src)},
      SCALE_FACTOR: ${sprite.scaleFactor},
      STEP_FACTOR: 1000,
      ANIMATION_FPS: 8,
      INIT_POSITION: { x: ${state.player.position.x}, y: ${state.player.position.y} },
      orientation: { rows: ${sprite.rows}, columns: ${sprite.cols} },
${directions}
      hitbox: { widthPercentage: 0.45, heightPercentage: 0.2 }
    };
${npcDefinitionsCode}
${barrierDefinitionsCode}

    this.classes = [
      { class: GameEnvBackground, data: backgroundData },
      { class: Player, data: playerData }${npcClassesCode}${barrierClassesCode}
    ];
  }
}

export const gameLevelClasses = [${className}];
export { GameControl };
`;

  return { code, errors: [] };
}
