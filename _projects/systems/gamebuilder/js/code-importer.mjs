/**
 * @module code-importer
 * @description Pulls supported GameBuilder-style level data using Acorn ASTs,
 * never executing source. Source remains untouched; regeneration is permitted
 * only when the entire module matches what the current generator can represent.
 * @data Returns builder state and a canRegenerate flag. Custom behavior,
 * extra methods, unknown properties and non-default engine settings remain
 * code-owned and prevent a destructive panel Push.
 * @usage Call importLevelCode(source, catalog) before replacing panel state.
 * Unsupported shapes throw contextual errors; callers keep the open workspace.
 */
import { parse } from '../../../../assets/js/vendor/acorn.mjs';
import { createDefaultBuilderState, validateBuilderState } from './builder-state.mjs';
import { generateLevelCode } from './code-generator.mjs';

const unsupported = (message) => { throw new TypeError(`Cannot pull code: ${message}`); };
const parseModule = (source) => parse(source, { ecmaVersion: 'latest', sourceType: 'module' });

function property(node, name) {
  if (node?.type !== 'ObjectExpression') unsupported('expected an object-literal data definition');
  const matches = node.properties.filter((entry) => !entry.computed
    && (entry.key?.name || entry.key?.value) === name);
  if (matches.length !== 1 || matches[0].type !== 'Property' || matches[0].method) {
    unsupported(`expected one literal ${name} property`);
  }
  return matches[0].value;
}

function literal(node, label) {
  if (node?.type === 'Literal' && ['string', 'number', 'boolean'].includes(typeof node.value)) return node.value;
  if (node?.type === 'UnaryExpression' && node.operator === '-' && node.argument.type === 'Literal'
    && typeof node.argument.value === 'number') return -node.argument.value;
  unsupported(`${label} must be a literal value`);
}

function position(node) {
  return { x: literal(property(node, 'x'), 'X position'), y: literal(property(node, 'y'), 'Y position') };
}

function assetKey(data, entries) {
  const src = property(data, 'src');
  const path = src.type === 'BinaryExpression' && src.operator === '+'
    && src.left.type === 'Identifier' && src.left.name === 'path'
    ? literal(src.right, 'asset path') : literal(src, 'asset path');
  const match = [...entries.values()].find((entry) => entry.src === path);
  if (!match) unsupported(`asset is not in the builder catalog: ${path}`);
  return match.key;
}

function canonical(ast) {
  return JSON.stringify(ast, (key, value) => ['start', 'end', 'raw'].includes(key) ? undefined : value);
}

export function importLevelCode(source, catalog) {
  const ast = parseModule(source);
  const levels = ast.body.filter((node) => node.type === 'ClassDeclaration');
  if (levels.length !== 1) unsupported('this first Pull supports one locally defined level class');
  const level = levels[0];
  const constructor = level.body.body.find((node) => node.kind === 'constructor');
  if (!constructor) unsupported('level constructor is missing');
  const bindings = new Map();
  for (const statement of constructor.value.body.body) {
    if (statement.type === 'VariableDeclaration') {
      for (const declaration of statement.declarations) {
        if (declaration.id.type === 'Identifier') bindings.set(declaration.id.name, declaration.init);
      }
    }
  }
  const assignments = constructor.value.body.body.filter((node) =>
    node.type === 'ExpressionStatement' && node.expression.type === 'AssignmentExpression'
    && node.expression.operator === '='
    && node.expression.left.type === 'MemberExpression' && !node.expression.left.computed
    && node.expression.left.object.type === 'ThisExpression' && node.expression.left.property.name === 'classes');
  if (assignments.length !== 1 || assignments[0].expression.right.type !== 'ArrayExpression') {
    unsupported('expected one this.classes array');
  }
  const objects = assignments[0].expression.right.elements.map((entry) => {
    const type = property(entry, 'class');
    const data = property(entry, 'data');
    if (type.type !== 'Identifier') unsupported('object class must be a named engine class');
    return { type: type.name, data: data.type === 'Identifier' ? bindings.get(data.name) : data };
  });
  const backgrounds = objects.filter((entry) => entry.type === 'GameEnvBackground');
  const players = objects.filter((entry) => entry.type === 'Player');
  if (backgrounds.length !== 1 || players.length !== 1) unsupported('requires one background and one Player');
  const state = createDefaultBuilderState(assetKey(backgrounds[0].data, catalog.backgrounds),
    assetKey(players[0].data, catalog.sprites));
  const title = level.body.body.find((node) => node.static && node.key.name === 'displayName');
  state.name = title ? literal(title.value, 'game name') : level.id.name;
  state.player.name = literal(property(players[0].data, 'id'), 'player ID');
  state.player.position = position(property(players[0].data, 'INIT_POSITION'));
  for (const [index, object] of objects.entries()) {
    if (object.type === 'Npc') {
      const id = literal(property(object.data, 'id'), 'NPC ID');
      const generatedId = typeof id === 'string' && id.match(/^(npc-\d+)_(.+)$/);
      state.npcs.push({
        id: generatedId ? generatedId[1] : `npc-${index + 1}`,
        name: generatedId ? generatedId[2] : id,
        spriteKey: assetKey(object.data, catalog.sprites),
        greeting: literal(property(object.data, 'greeting'), 'NPC greeting'),
        position: position(property(object.data, 'INIT_POSITION'))
      });
    } else if (object.type === 'SplineBarrier') {
      const points = property(object.data, 'splinePoints');
      if (points.type !== 'ArrayExpression') unsupported('splinePoints must be an array literal');
      const id = literal(property(object.data, 'id'), 'barrier ID');
      if (typeof id !== 'string' || !/^[A-Za-z0-9_-]+$/.test(id)) unsupported('barrier ID must use letters, digits, underscores or hyphens');
      const visible = object.data.properties.find((entry) => entry.key?.name === 'visible');
      state.barriers.push({
        id, name: id.replace('barrier-', 'Barrier '),
        visible: visible ? literal(visible.value, 'barrier visibility') : true,
        points: points.elements.map(position)
      });
    } else if (!['GameEnvBackground', 'Player'].includes(object.type)) {
      unsupported(`${object.type} is code-owned and not supported by this first Pull`);
    }
  }
  const errors = validateBuilderState(state, catalog);
  if (errors.length) unsupported(errors.map((error) => error.message).join(' '));
  const generated = generateLevelCode(state, catalog).code;
  return { state, canRegenerate: canonical(ast) === canonical(parseModule(generated)) };
}
