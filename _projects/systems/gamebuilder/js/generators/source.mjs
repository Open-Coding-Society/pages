/**
 * @module generators/source
 * @description Shared helpers that print readable JavaScript for the game
 * type generators (racing, platform, clicker).
 * @data `code(text)` marks raw source, such as `path + "/images/x.png"`; every
 * other value is printed as a literal.
 * @usage `literal(value, indent)` prints numbers, strings, booleans, arrays
 * and plain objects (with bare keys where possible); `imagePath(src)` makes a
 * site image path relative to the running game's `path`.
 */
class RawCode {
  constructor(text) {
    this.text = text;
  }
}

export function code(text) {
  return new RawCode(text);
}

export function imagePath(src) {
  return code(`path + ${JSON.stringify(src)}`);
}

function key(name) {
  return /^[A-Za-z_$][A-Za-z0-9_$]*$/.test(name) ? name : JSON.stringify(name);
}

export function literal(value, indent = 0) {
  if (value instanceof RawCode) return value.text;
  const pad = '  '.repeat(indent);
  if (Array.isArray(value)) {
    if (value.length === 0) return '[]';
    const items = value.map((item) => `${pad}  ${literal(item, indent + 1)}`);
    return `[\n${items.join(',\n')}\n${pad}]`;
  }
  if (value && typeof value === 'object') {
    const entries = Object.entries(value).filter(([, item]) => item !== undefined);
    const isSmall = entries.every(([, item]) => typeof item !== 'object' || item instanceof RawCode);
    const parts = entries.map(([name, item]) => `${key(name)}: ${literal(item, indent + 1)}`);
    if (isSmall && parts.join(', ').length < 80) return `{ ${parts.join(', ')} }`;
    return `{\n${parts.map((part) => `${pad}  ${part}`).join(',\n')}\n${pad}}`;
  }
  return JSON.stringify(value);
}

/** Standard level module: imports, one level class, and the exports GAME_RUNNER expects. */
export function levelModule({ imports, className, displayName, body, classes }) {
  const importLines = Object.entries(imports)
    .map(([name, file]) => `import ${name} from '/assets/js/GameEnginev1.1/essentials/${file}';`)
    .join('\n');
  return `${importLines}

class ${className} {
  static displayName = ${JSON.stringify(displayName)};

  constructor(gameEnv) {
    const path = gameEnv.path;
${body ? `${body}\n` : ''}    this.classes = ${literal(classes, 2)};
  }
}

export const gameLevelClasses = [${className}];
export { GameControl };
`;
}
